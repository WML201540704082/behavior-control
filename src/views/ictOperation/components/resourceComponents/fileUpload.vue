<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      :visible.sync="isShow"
      title="新增资源"
      width="700px"
      top="10vh"
      v-el-drag-dialog
    >
      <el-form
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
        label-suffix=":"
        label-width="100px"
      >
        <el-form-item label="资源标题" prop="title">
          <el-input v-model="submitForm.title" placeholder="可根据上传文件名称自动获取" maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="资源内容" prop="content">
          <el-input v-model="submitForm.content" type="textarea" :rows="10" maxlength="500" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="资源标签" prop="tag">
          <el-select v-model="submitForm.tag" @change="handleTag">
            <el-option
              v-for="(item, index) in tagsList"
              :key="index"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面图" prop="coverPhoto">
          <el-upload
            class="upload-demo"
            :action="action"
            :headers="headers"
            :accept="acceptCoverType"
            :limit="1"
            :file-list="coverFileList"
            :http-request="uploadFile2"
            :before-upload="beforeCoverUpload"
            :on-success="handleCoverFileSuccess"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            list-type="picture-card">
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传附件" prop="path">
          <el-upload
            ref="uploadFile"
            class="upload-demo"
            :action="action"
            :headers="headers"
            :accept="acceptType"
            :limit="1"
            :file-list="fileList"
            :http-request="uploadFile22"
            :before-upload="beforeUpload"
            :on-success="handleFileSuccess"
            :on-remove="handleRemove2"
          >
            <div slot="tip" class="el-upload__tip">{{tipsText}}</div>
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="btn_box">
        <el-button type="primary" size="mini" @click="save" :loading="saveLoading">保存</el-button>
        <el-button type="primary" size="mini" plain @click="$emit('close')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDictList } from "@/api/dict";
import { resourceSave, uploadFile1 } from "@/api/ictOperation/index"
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'


export default {
  props: ['isShow', 'tag'],
  data() {
    return{
      submitForm: {
        path: '',
        fileName: '',
        title: '',
        tag: '',
        coverPhoto: ''
      },
      rules: {
        title: [
          { required: true, message: '资源标题不能为空', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '资源内容不能为空', trigger: 'blur' },
        ],
        tag: [
          { required: true, message: '资源标签不能为空', trigger: 'blur' },
        ],
        path: [
          { required: true, message: '附件不能为空', trigger: 'blur' },
        ],
        coverPhoto: [
          { required: true, message: '封面不能为空', trigger: 'change' },
        ],
      },
      tagsList: [],
      action: '#', // /api/idevelop-resource/oss/endpoint/put-file
      headers: {
        Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
        'Idevelop-Auth': 'bearer ' + getToken()
      },
      tipsText: '',
      acceptType: '',
      fileList: [],
      acceptCoverType: '.jpg,.png',
      coverFileList: [],
      saveLoading: false,
    }
  },
  mounted() {
    this.initForm()

    this.getDict()
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
    uploadFile22( params ){
      const file = params.file

      const formData = new FormData()
      formData.append("file", file)

      uploadFile1(formData).then(res=>{
        params.onSuccess(res)
      }).catch(error=>{
        params.onError(error)
      })
    },
    // 初始化表单
    initForm() {
      this.submitForm.tag = this.tag
      if(this.tag == 0) {
        this.tipsText = '只能上传word、pdf、xmind、ppt类型文件,且不超过100M（允许上传数量1个）'
        this.acceptType = '.pdf,.docx,.doc,.xmind,.ppt,.pptx'
      }else {
        this.tipsText = '只能上传mp4、wmv、asf、asx、rm、rmvb格式的视频文件,且不超过100M（允许上传数量1个）'
        this.acceptType = '.mp4,.wmv,.asf,.asx,.rm,.rmvb'
      }
      this.$forceUpdate()
    },
    // 获得字典
    getDict() {
      getDictList("control_resource_type").then(res => {
        this.tagsList = res.data;
      })
    },
    handleTag(val) {
      if(val == 0) {
        this.tipsText = '只能上传word、pdf、xmind、ppt类型文件（允许上传数量1个）'
        this.acceptType = '.pdf,.docx,.doc,.xmind,.ppt,.pptx'
      }else if(val == 1) {
        this.tipsText = '只能上传mp4、wmv、asf、asx、rm、rmvb格式的视频文件（允许上传数量1个）'
        this.acceptType = '.mp4,.wmv,.asf,.asx,.rm,.rmvb'
      }
      this.$refs.uploadFile.clearFiles()
      this.submitForm.path = ''
      this.submitForm.fileName = ''
      this.$set(this.submitForm, 'title', '')
      this.$forceUpdate()
    },
    // 上传前回调
    beforeUpload(file) {
      let ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      let fileTypes = this.acceptType.split(',')
      let isCanUpload = true
      for(let i=0; i<fileTypes.length; i++) {
        let item = fileTypes[i]
        if(ext.indexOf(item) > -1) {
          isCanUpload = true
          break
        }else {
          isCanUpload = false
        }
      }
      if(!isCanUpload) {
        this.$message({
          message: '只能上传提示给出的文件类型！',
          type: 'warning'
        });
      }
      if(file.size > 100*1024*1024) {
        this.$message({
          message: '文件大小不能超过100M',
          type: 'warning'
        });
        return false
      }
      return isCanUpload
    },
    // 上传成功回调
    handleFileSuccess(res, file, fileList) {
      this.submitForm.path = res.data.link
      this.submitForm.fileName = res.data.originalName
      this.$set(this.submitForm, 'title', res.data.originalName.split('.')[0])
      // this.$forceUpdate()
      this.$refs.submitForm.validateField('path')
    },
    handleRemove2(file, fileList){
      this.submitForm.path = ''
      this.submitForm.fileName = ''
      this.$set(this.submitForm, 'title', '')
      this.$refs.submitForm.validateField('path')
    },
    
    // 封面上传
    beforeCoverUpload(file) {
      let ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if(!(ext.indexOf('jpg') > -1 || ext.indexOf('png') > -1)) {
        this.$message({
          message: '请上传jpg或png格式的图片',
          type: 'warning'
        });
        return ext.indexOf('jpg') > -1 || ext.indexOf('png') > -1
      }
      if(file.size > 500*1024) {
        this.$message({
          message: '封面大小不能超过500kb',
          type: 'warning'
        });
        return false
      }
    },
    handleCoverFileSuccess(res, file, fileList) {
      this.$set(this.submitForm, 'coverPhoto', res.data.link)
      // this.$forceUpdate()
      this.$refs.submitForm.validateField('coverPhoto')
    },
    handleRemove(file, fileList){
      // console.log(3321, file, fileList)
      this.$set(this.submitForm, 'coverPhoto', '')
      this.$refs.submitForm.validateField('coverPhoto')
    },
    handleExceed() {
      this.$message({
        message: '只能上传一张封面！',
        type: 'warning'
      });
    },
    // 保存
    save() {
      this.$refs.submitForm.validate(valid => {
        if(valid) {
          this.saveLoading = true
          resourceSave(this.submitForm).then(res => {
            if(res.code == 200) {
              this.$message({
                message: '新增成功！',
                type: 'success'
              });
              this.saveLoading = false
              this.$emit('addResource')
            }
          })
        }else {
          this.$message({
            message: '请完善表单项',
            type: 'warning'
          });
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.btn_box{
  text-align: center;
}
::v-deep .el-dialog{
  background-image: url('../../img/dialogbackj.png');
  background-repeat: no-repeat;
  .el-dialog__body{
    background: linear-gradient(180deg, #cce4ff 0%, #ffffff 17%, #ffffff 100%);
  }
}
::v-deep .el-upload__tip{
  margin: 0;
  line-height: 16px;
}
</style>
