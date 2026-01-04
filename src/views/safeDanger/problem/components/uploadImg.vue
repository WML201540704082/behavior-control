<template>
  <div style="width: 100%;height: 100%;">
    <el-upload
      class="avatar-uploader"
      ref="uploadFiles"
      :limit="100"
      accept=".jpg,.jpeg,.bmp,.png"
      name="file"
      :data="deviceData"
      :headers="upload.headers"
      list-type="picture-card"
      :action="upload.url"
      :file-list="fileList1"
      :disabled="disabled"
      :http-request="uploadFile2"
      :before-upload="beforeUpload"
      :on-progress="handleFileUploadProgress"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleFileSuccess"
      :on-exceed="handleExceed"
      :auto-upload="true"
      v-loading="showLoading"
    >
      <!-- <img v-if="upload.imageUrl" :src="upload.imageUrl" class="avatar"> -->
      <i class="el-icon-plus"></i>

    </el-upload>

    <el-dialog :modal-append-to-body="true" append-to-body  :close-on-click-modal="false" :visible.sync="dialogVisible" :before-close="closeDialog">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'
// import { getToken, getUid, getDiffTime } from '@/util/auth'
import md5 from 'js-md5'
// import { getSortPostFormDataForUpload } from '@/util/request'
const uuid = require('uuid');
import { sm3Hash } from '@/util/jsencrypt'

import { upload, deleteFiles, downloadFile, downloadBase64Img, getFiles } from "@/api/oss";
import { removeFile } from "@/api/system/devInBound";
import {putFile} from '@/api/oss'

export default {
  name: "ComputerRoomDetail",
  components: {},
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
      'userId'
    ]),
  },
  props: {
    businessKey: {
      type: String
    },
    tableName: {
      type: String
    },
    columName: {
      type: String
    },
    detailId: {
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fileList1: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      showLoading: false,
      dialogVisible: false,
      dialogImageUrl: '',
      // fileList1: [
      //   // { idd: 123, name: 'qwe.jpg', url:'file:///C:/Users/zhang-mq/Desktop/ioio/qwe.jpg' }
      // ],
      deviceData: {
        
      },
      // 用户导入参数
      upload: {
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
        // url: process.env.VUE_APP_BASE_API + '/msdp-system/oss/upload',
        url: '#',
        
        imageUrl: null,
      },

    }
  },
  created() {
    this.getFiles()
  },
  mounted() {

  },
  methods: {
    uploadFile2( params ){
      const file = params.file

      const formData = new FormData()
      formData.append("file", file)

      putFile(formData).then(res=>{
        params.onSuccess(res)
      }).catch(error=>{
        params.onError(error)
      })
    },
    closeDialog(){
      this.dialogVisible = false
      const mask = document.querySelector('.v-modal')
      if(mask){
        document.body.removeChild(mask)
      }
    },
    getFiles() {
      // console.log(32,this.detailId)
      
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      // this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      // console.log('response', response)
      // console.log('file', file)
      // console.log('fileList', fileList)
      this.$emit('setFileName', fileList)
      return
      this.$emit('setFileName')
      // file.id = response.data
      // file.deviceId = this.deviceData.deviceId

    },

    handlePreview(file){
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList){
      // console.log(8881, file)
      // console.log(8882, fileList)

      // 服务删除图片
      removeFile({ originalName: file.name }).then(res=>{ 
        this.$emit('setFileName', fileList)
       })

      
      return

      let data = {
        fileName: file.name
      }
      deleteFiles(data).then(response =>{
        if(response.code === 200) {
          this.$emit('setFileName')
          //this.msgSuccess(response.msg)
          // this.showLoading = false
          // this.fileList = fileList
        }else {
          this.msgError(response.msg)
        }
      })

    },
    handleExceed(){
      this.$message.warning('图片上传数量已上限！')
    },

    //上传之前操作(用于判断是否重名与格式限制)
    beforeUpload(file) {
      let acceptType = ['jpg','jpeg','png','PNG','bmp'];
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (-1 === acceptType.indexOf(extension)) {
        this.$message.warning('支持文件格式'+ acceptType +'！');
        return false;
      }
      if (file.size/1024 > 5 * 1024) {
        this.$message.warning("当前文件超过5M，请修改！");
        return false;
      }
      this.secure()
    },
    secure() {
      // // 生成nonce_client
      // const nonce_client = md5(uuid.v4());
      // // 生成签名  客户端时间戳 + nonce_client + data + uid
      // const timestamp = parseInt((new Date()).getTime()) + parseInt(getDiffTime());
      // const token = 'Bearer' + getToken();
      // const sign_client = sm3Hash(JSON.stringify(this.deviceData) + timestamp + nonce_client + getUid());
      // this.upload.headers['Authorization'] = token;
      // this.upload.headers['nonce'] = nonce_client;
      // this.upload.headers['ts'] = timestamp;
      // this.upload.headers['sign'] = sign_client;
      // this.upload.headers.isImport = true;
    },




  }
}
</script>

<style lang='scss' scoped>

</style>
