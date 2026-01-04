<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      :title="getTitle(type)"
      width="800px"
      top="10vh"
      v-el-drag-dialog>
      <el-form ref="submitForm"
               v-if="formDetial"
               :model="formDetial"
               :rules="rules"
               label-suffix=":"
               label-width="120px"
               size="small">
        <el-form-item label="文件名称" prop="uploadFileName" size="small">
          <el-input v-model="formDetial.uploadFileName" placeholder="请输入文件名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="fileOrder" size="small">
          <el-input v-model="formDetial.fileOrder" placeholder="请输入排序序号" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" size="small">
          <el-select
            v-model="formDetial.status"
            placeholder="请选择文件状态">
            <el-option
              v-for="(item, index) in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark" size="small">
          <el-input v-model="formDetial.remark" placeholder="请输入认证地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="文件预览" prop="remark" size="small" v-if="type=='edit'">
          <el-tooltip effect="dark" :content=" formDetial.fileUrl" placement="top-start">
            <a style="color: #0D8EFF" @click="aDowload(formDetial.fileUrl,formDetial.uploadFileName)">点击下载</a>
          </el-tooltip>

        </el-form-item>


        <el-form-item label="附件">
          <el-upload
            ref="upload"
            name="file"
            :limit="1"
            :accept="getAccept()"
            :headers="upload.headers"
            :action="upload.url"
            :file-list="fileList"
            :on-change="handleChange"
            :http-request="uploadFile2"
            :before-upload="beforeUpload"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :on-error="handleFileError"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :auto-upload="false"
            drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">根据模板填入信息后，导入文件进行上传。支持格式：{{ upload.accept }}</div>
          </el-upload>
        </el-form-item>

        <div class="form-btn d_end">
          <el-button type="primary" error @click="submit" :loading="loading">{{ getTitle(type) }}</el-button>
          <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {add, add2, update} from "@/api/data/uploadfiles";
import {Message} from "element-ui";
import {attrrelUpdate} from "@/api/cmdb/ciConfig";
import {Base64} from "js-base64";
import website from "@/config/website";
import {getToken} from "@/util/auth";
import {attachRemove, removeFile} from "@/api/system/devInBound";
import { uploadFile1 } from "@/api/ictOperation/index";

export default {
  props: ['isShow', 'arrtId', 'type', 'formDetial'],
  data() {
    return {
      saveLoading: false,
      statusList: null,

      title: '请导入数据文件',

      // 用户导入参数
      upload: {
        accept: ['doc', 'pdf', 'excel', 'rar', 'zip'],
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {
          Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
          'Idevelop-Auth': 'bearer ' + getToken()
        },
        // 上传的地址
        url: '#',
        imageUrl: null,
      },

      isUploading: false,

      fileList: [],
      fileSize: 2 * 1024 * 1024, //文件大小

      loading: false,
      resObj: {},

      rules: {
        uploadFileName: [{required: true, message: '文件名称不能为空', trigger: 'blur'}],
        fileOrder: [{required: true, message: '排序序号不能为空', trigger: 'blur'}],
        fileUrl: [{required: true, message: '文件URL不能为空', trigger: 'blur'}],
        status: [{required: true, message: '状态不能为空', trigger: 'blur'}],
      },


    }
  },
  computed: {},
  mounted() {
    if (!this.formDetial) {
      this.formDetial = {};
    }
    this.initTypes();
  },
  methods: {
    uploadFile2( params ){
      const file = params.file

      const formData = new FormData()
      formData.append("file", file)

      uploadFile1(formData).then(res=>{
        params.onSuccess(res)
      }).catch(error=>{
        params.onError(error)
      })
    },
    initTypes() {
      this.statusList = [];
      this.statusList.push({
        name: '可用',
        id: 0
      })
      this.statusList.push({
        name: '不可用',
        id: 1
      })
    },
    aDowload(url, fileName) {
      const x = new window.XMLHttpRequest();
      x.open('GET', url, true);
      x.responseType = 'blob';
      x.onload = () => {
        const url2 = window.URL.createObjectURL(x.response);
        const a = document.createElement('a');
        a.href = url2;
        a.download = fileName;
        a.click();
        a.style.display = 'none';
        const timer = setTimeout(() => {
          a.remove();

          //释放blob对象
          URL.revokeObjectURL(url2);
          clearTimeout(timer);
        }, 1000)
      };
      x.send();
    },

    selectionChange(val) {
      this.selectionList = val;
    },
    submit() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
            if (this.$refs.upload.uploadFiles.length == 0) {
              this.$alert(`请选择要上传的文件（格式 ${this.upload.accept}）`);
              return;
            }
          }

          if (this.type == 'add') {
            // this.saveLoading = true;
            // add([this.formDetial]).then(res => {
            //   this.saveLoading = false
            //   this.$message.success('添加成功');
            //   this.$emit("close");
            //   this.$emit("refreshData");
            // });
            this.loading = true;
            this.$refs.upload.submit();
          } else if (this.type == 'edit') {
            if (this.$refs.upload.uploadFiles.length == 0) {
              //只更新基本信息
              update(this.formDetial).then(res => {
                this.saveLoading = false
                this.$message.success('修改成功');
                this.$emit("close");
                this.$emit("refreshData");
              });
            } else {
              //先删除旧文件,在更新新文件
              this.loading = true;
              removeFile({originalName: this.formDetial.localFileName}).then(res => {
                this.$refs.upload.submit();
              })
            }
          }
        }
      })
    },
    handleChange(file, fileList) {
      let imgSize = Number(file.size / 1024 / 1024)
      if (imgSize > this.fileSize) {
        this.$message.error(`文件大小不能超过${this.fileSize}Mb`)
        this.fileList = [];
      }
    },
    //上传之前操作(用于判断是否重名与格式限制)
    beforeUpload(file) {
      let acceptType = ['doc', 'pdf', 'excel', 'rar', 'zip'];
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (-1 === acceptType.indexOf(extension)) {
        this.$message.warning('支持文件格式' + acceptType + '！');
        return false;
      }
      // if (file.size/1024 > 5 * 1024) {
      //   this.$message.warning("当前文件超过5M，请修改！");
      //   return false;
      // }
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file) {
      // this.upload.isUploading = true
    },
    // 文件上传成功处理
    // eslint-disable-next-line no-unused-vars
    handleFileSuccess(response, file, fileList) {
      // console.log(909090, response)
      if (this.type == 'add') {
        this.loading = true;
        this.formDetial['fileUrl'] = response.data.link;
        add(this.formDetial).then(res => {
          this.loading = true;
          this.$message.success('添加成功');
          this.$emit("close");
          this.$emit("refreshData");
        });
      } else if (this.type == 'edit') {
        this.loading = true;
        update(this.formDetial).then(res => {
          this.loading = true;
          this.$message.success('修改成功');
          this.$emit("close");
          this.$emit("refreshData");
        });
      }
    },
    handleFileError(response, file, fileList) {
      this.$message.error(response)
    },
    handleRemove(file) {
      if (!file.id) {
        this.resObj = {}
        return
      }
      //删除旧文件
      this.fileList = []
      let data = {
        ids: file.id
      }
      attachRemove(data).then(response => {
        if (response.code === 200) {
          this.fileList = []
        } else {
          this.$message.error(response.msg)
        }
      })
      this.resObj = {}
    },
    handleExceed() {
      this.$message.warning('图片上传数量已上限！')
    },
    getAccept() {
      let acc = '';
      for (let i = 0; i < this.upload.accept.length; i++) {
        acc += `.${this.upload.accept[i]}`;
        if (i < this.upload.accept.length - 1) {
          acc += ','
        }
      }
      return acc;
    },
    getTitle(type) {
      if (type == 'add') {
        return '新 增';
      } else if (type == 'edit') {
        return '更 新';
      }
      return null;
    },
  }
}
</script>

<style lang="scss" scoped>
.d_end {
  display: flex;
  justify-content: flex-end;
}

.d_end button {
  width: 100px;
}
</style>
