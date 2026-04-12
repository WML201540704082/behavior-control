<template>
  <div>
    <!-- 导入对话框 -->
    <el-dialog :modal-append-to-body="false" :title="title" :visible.sync="isVisible" width="600px"  class="import-dialog">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx,.xls"
        name="file"
        :headers="headers"
        :data='datas'
        :action="url"
        :disabled="isUploading"
        :http-request="uploadFile2"
        :on-progress="handleFileUploadProgress"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">根据模板填入信息后，导入文件进行上传。支持格式：xls、xlsx</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="isVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { transferImport } from "@/api/device/devicetransfer";
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'
export default {
  props: ['isShow', 'selectIcon'],
  data() {
    return{
      // isVisible: false,
      title: '请导入数据文件',
      headers: {
        Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
        'Idevelop-Auth': 'bearer ' + getToken()
      },
      datas: {},
      url: '#', // /api/idevelop-device/device/transfer/import
      isUploading: false,
      fileList: [],
      activeIcon: ''
    }
  },
  computed: {
    isVisible: {
      get(){
        return this.isShow
      },
      set(val){
        this.$emit("update:isShow", val)
      }
    }
  },
  methods: {
    uploadFile2( params ){
      const file = params.file

      const formData = new FormData()
      formData.append("file", file)

      transferImport(formData).then(res=>{
        params.onSuccess(res)
      }).catch(error=>{
        params.onError(error)
      })
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    handleSuccess(res){
      this.$emit('setVal', res.data)
      this.isVisible = false
    },
    // eslint-disable-next-line no-unused-vars
    handlePreview(file){
      //console.log(file)
    },
    // eslint-disable-next-line no-unused-vars
    handleRemove(file, fileList){
      //console.log(file, fileList)
    },
    // eslint-disable-next-line no-unused-vars
    beforeRemove(file, fileList){
      return this.$confirm(`确定移除 ${ file.name }`)
    },
    // eslint-disable-next-line no-unused-vars
    handleExceed(file, fileList){
      // this.$message.warning('')
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .import-dialog{
  .el-dialog__body{
    text-align: center;
  }
}

.icon_item{
  text-align: center;
}
</style>
