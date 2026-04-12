<template>
  <div>
    <!-- 导入对话框 -->
    <el-dialog :modal-append-to-body="false" :title="title" :visible.sync="isVisible" width="600px" class="import-dialog">
      <div v-loading="uploading">
        <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx,.xls"
          name="file"
          :headers="headers"
          :data='datas'
          :action="url"
          :http-request="customUpload"
          :file-list="fileList"
          :disabled="isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="beforeUpload"
          :auto-upload="false"
          drag>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <!-- <div class="el-upload__tip" slot="tip">
            <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
          </div> -->
          <div class="el-upload__tip" slot="tip">根据模板填入信息后，导入文件进行上传。支持格式：xls、xlsx</div>
        </el-upload>
        <div slot="footer" class="dialog-footer d_bn">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="isVisible = false" style="margin-left: 5px">取 消</el-button>
        </div>
      </div>

    </el-dialog>


    <!-- <el-upload
      class="upload-model"
      :headers="headers"
      :action="url"
      :on-success="handleSuccess"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="1"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload> -->
  </div>
</template>





<script>
import {cmdbImport, repairImport, changeImport, syncImport, storageImport, syncImportI6000Erp} from "@/api/system/devInBound";
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'

export default {
  props: ['isShow', 'selectIcon', 'deviceCategory', 'deviceType', 'type', 'isMath', 'deviceSource'],
  data() {
    return {
      // isVisible: false,
      title: '请导入数据文件',
      headers: {
        Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
        'Idevelop-Auth': 'bearer ' + getToken()
      },
      datas: {
        isMath: this.isMath, //只总用于存量数据治理区分数字化设备类型
        deviceCategory: this.deviceCategory,
        deviceType: this.deviceType
      },
      url: "#",
      isUploading: false,
      fileList: [], // [{name: 'name', url: 'url'}]
      activeIcon: '',
      uploading: false,

      listApi: null,

      storageImportType: false
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.isShow
      },
      set(val) {
        this.$emit("update:isShow", val)
      }
    }
  },
  mounted() {
    if (this.type === 'zcgl') {
      //资产管理上传接口
      // this.url = '/api/idevelop-device/hardwarebasic/cmdb/import';
      this.listApi = cmdbImport
    } else if (this.type === 'tzgl') {
      //台账管理上传接口
      // this.url = '/api/idevelop-device/cmdb/repair/import';
      this.listApi = repairImport
    } else if (this.type === 'sbbg') {
      //设备变更上传接口
      // this.url = '/api/idevelop-device/device/change/list/import';
      this.listApi = changeImport
    } else if (this.type === 'erp') {
      //设备变更上传接口
      // this.url = '/api/idevelop-device/I6000/import/sync/i6000detail';
      this.listApi = syncImport
    } else if (this.type === 'sztb') {
      // 数据同步 上传接口
      // this.url = '/api/idevelop-device/I6000/import/sync/i6000detail';
      this.listApi = syncImportI6000Erp
    }else {
      //其他 上传接口
      // this.url = '/api/idevelop-device/device/storage/info/import'
      this.listApi = storageImport;
      this.storageImportType = true;
    }
  },
  methods: {
    customUpload( params ){
      const file = params.file
      const formData = new FormData()
      formData.append("file", file)
      formData.append("isMath", this.isMath)
      formData.append("deviceCategory", this.deviceCategory)
      formData.append("deviceType", this.deviceType)
      if (this.storageImportType)  {
        formData.append("deviceSource", this.deviceSource)
      }

      if (this.type === 'sztb') {
        this.isVisible = false;
        this.$message.success("数据同步提交成功, 可去同步结果中查看进度!");
      }

      this.listApi(formData).then(res=>{
        params.onSuccess(res)
      }).catch(error=>{
        params.onError(error)
      })
    },

    // 提交上传文件
    submitFileForm() {
      //判断有没有文件
      if (this.$refs.upload.uploadFiles.length == 0) {
        this.$alert(`请选择要上传的xlsx文件`);
        return;
      }

      this.uploading = true;
      this.$refs.upload.submit()
    },
    //上传之前操作(用于判断是否重名与格式限制)
    beforeUpload(file) {
      // this.secure()
    },
    handleFileUploadProgress() {

    },
    handleSuccess(res) {
      // if( res.data.exceptionField ){
      //   this.$message.error(res.data.exceptionField)
      // }
      this.$emit('setVal', res.data)
      this.isVisible = false
      this.uploading = false;
    },
    handleError(err) {
      this.fileList = [];
      this.uploading = false;
      try {
        let myError = err.toString();
        myError = myError.replace('Error: ', '');
        myError = JSON.parse(myError);
        this.$message.error(myError.msg);
      } catch (err) {
        this.$message.error(err.toString());
      }
    },
    handlePreview(file) {

    },
    handleRemove(file, fileList) {

    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}`)
    },
    handleExceed(file, fileList) {
      // this.$message.warning('')
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .import-dialog {
  .el-dialog__body {
    text-align: center;
  }
}

.icon_item {
  text-align: center;
}

.d_bn {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
}
</style>
