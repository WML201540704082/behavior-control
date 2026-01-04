<template>
  <div style="width: 100%;height: 100%;">
    <el-upload
      class="avatar-uploader"
      ref="uploadFiles"
      :limit="1"
      accept=".jpg,.jpeg,.bmp,.png"
      name="file"
      :headers="upload.headers"
      list-type="picture-card"
      :action="upload.url"
      :file-list="fileList"
      :disabled="disabled"
      :http-request="uploadFile2"
      :before-upload="beforeUpload"
      :on-progress="handleFileUploadProgress"
      :on-preview="handlePreview"
      :on-success="handleFileSuccess"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :auto-upload="true"
      v-loading="showLoading"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :modal-append-to-body="true" append-to-body  :close-on-click-modal="false" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>


import { attachSave, attachGetAttach, attachRemove, removeFile } from "@/api/system/devInBound";
import { uploadFile1 } from "@/api/ictOperation/index";
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'
export default {
  name: "ComputerRoomDetail",
  components: {},
  computed: {

  },
  props: {
    // fileList: {
    //   type: Array
    // },
    serialNumber: {
      type: String
    },
    attachId: {
      type: Number
    },
    type: {
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
    }
  },
  data() {
    return {
      fileList: [],
      showLoading: false,
      dialogVisible: false,
      dialogImageUrl: '',
      deviceData: {
        // businessKey: this.businessKey,
        // tableName: "hidden_problem_evidence",
        // columName: "file_url"
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
        url: '#', // /api/idevelop-resource/oss/endpoint/put-file
        imageUrl: null,
      },
      resObj: {}
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

      uploadFile1(formData).then(res=>{
        params.onSuccess(res)
      }).catch(error=>{
        params.onError(error)
      })
    },
    renderList(files){
      if( files.id ){
        let fileArray = new Array();
        let item = {
          id: files.id,
          name: files.fileName,
          url: files.filePath,
        }
        fileArray.push(item)
        this.fileList = fileArray
      }else{
        this.fileList = []
      }
    },
    getFiles() {
      if(this.serialNumber){
        this.showLoading = true;
        let params = {
          // attachId: this.attachId,
          storageId: this.serialNumber
        }
        attachGetAttach(params).then(response =>{
          if(response.code === 200) {
            let files =  response.data
            if(files.length > 0){
              this.renderList(files[0])
            }else{
              this.$emit('filesChange',{files:files})
            }
          }else{
            this.$message.error(response.msg)
          }
          this.showLoading = false;
        })
      }
    },
    // 文件上传成功处理
    // eslint-disable-next-line no-unused-vars
    handleFileSuccess(response, file, fileList) {
      this.resObj = response.data
      let orderFileType = '0';
      //工单上传文件类型 0 设备申请线下申请单附件 1 设备出库出库照片 2 设备投运旧设备照片
      if(this.type=='投运工单'){
        orderFileType = '1';
      }else if(this.type=='投运工单'){
        orderFileType = '2';
      }
      let params = {
        fileName: this.resObj.originalName||'',
        fileType: '',
        fileUrl: this.resObj.link||'',
        orderFileType: orderFileType,
        name:  this.resObj.originalName||'',
        url: this.resObj.link||'',
        status: null,
      }
      this.$emit('setVal', params)
      fileList.push(params)
      this.dialogImageUrl = file.url
    },
    // eslint-disable-next-line no-unused-vars
    myAttachSave(serialNumber, file){
      if(!this.resObj.link){
        return
      }
      let params = {
        businessType: 'rk',
        fileName: this.resObj.originalName,
        filePath: this.resObj.link,
        filingNo: serialNumber
      }
      // if(this.serialNumber){
        attachSave(params).then(res=>{
          this.resObj = {}
        })
      // }

    },
    handleRemove(file){
      // 旧图片作为脏数据，不在需要删除
      // removeFile({ originalName: file.name }).then(res=>{  })
      if(!file.id){
        this.resObj= {}
        this.fileList = []
        return
      }
      //删除旧图片
      this.fileList = []
      this.$emit('setVal', null)
      let data = {
        ids: file.id
      }
      if(this.serialNumber){
        attachRemove(data).then(response =>{
          if(response.code === 200) {
            this.fileList = []
          }else {
            this.$message.error(response.msg)
          }
        })
      }
      this.resObj= {}
    },
    handleExceed(){
      this.$message.warning('图片上传数量已上限！')
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      // this.upload.isUploading = true
    },
    handlePreview(file){
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //上传之前操作(用于判断是否重名与格式限制)
    beforeUpload(file) {
      let acceptType = ['jpg','jpeg','png','PNG','bmp'];
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (-1 === acceptType.indexOf(extension)) {
        this.$message.warning('支持文件格式'+ acceptType +'！');
        return false;
      }
      // if (file.size/1024 > 5 * 1024) {
      //   this.$message.warning("当前文件超过5M，请修改！");
      //   return false;
      // }
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
