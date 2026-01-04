<template>
  <div v-loading="showLoading"
       style="margin-top: -25px;">
    <el-upload
      class="uploadFile-class"
      :action="action"
      :headers="headers"
      ref="upload" :data="data" :accept="acceptType" :limit="limitNum" multiple
      :file-list="fileList" :http-request="uploadFile2" :before-remove="beforeRemove" :before-upload="beforeUpload"
      :on-success="fileSuccess" :on-remove="removeFile" :on-error="showError"
      :on-preview="downloadFile" :on-exceed="handleExceed">
      <el-button style="margin-top: 30px;" slot="trigger" type="primary" icon="el-icon-plus" size="small" v-if="enable">添加上传</el-button>
      <el-button style="margin-left: 10px;margin-top: 30px;" type="primary" icon="el-icon-delete" size="small" @click="deleteAll" v-if="enable">全部清空</el-button>
      <!--<el-button  type="primary" size="small" @click="downloadFileByName(true)">全部下载</el-button>-->
      <div slot="tip" class="upLoad_tip" style="color: red;font-size: small;">点击已上传文件进行下载</div>
    </el-upload>
    <el-dialog :close-on-click-modal="false" append-to-body class="picShow" :visible.sync="dialogVisible" v-if="dialogVisible" title="图片预览">
            <span style="margin-left: 96%;cursor: pointer;" title="下载图片" class="el-upload-list-download" @click="downloadFileByName(false)">
                <i class="el-icon-download" style="color: #006F6B;"></i>
            </span>
      <img width="100%" height="400px" :src="imgUrl" :alt="imgName" ref="img">
    </el-dialog>
  </div>
</template>

<script>
import { upload, deleteFiles, downloadFile, downloadBase64Img, getFiles } from "@/api/oss";
import { getToken, getUid, getDiffTime } from '@/util/auth'
import md5 from 'js-md5';
// import { sm3Hash } from '@/util/jsencrypt'
// import { getSortPostFormDataForUpload } from '@/router/axios'
const uuid = require('uuid');
export default {
  name: "Upload",
  props:{
    //主键id
    businessKey:{
      type:String,
      require:true
    },
    //表名
    tableName:{
      type:String,
      require:true
    },
    //列名
    columName:{
      type:String,
      require:true
    },
    //文件格式限制
    acceptType:{
      type:String,
      require:true
    },
    //文件数量限制
    limitNum:{
      type:Number,
      require:true
    },
    //文件大小限制(单位kb)
    maxFileSize:{
      type:Number,
      require:true
    },
    //只读true只读
    readOnly:{
      type:Boolean,
      require:true
    },
  },
  data() {
    return {
      action: '#', // process.env.VUE_APP_BASE_API + '/msdp-system/oss/upload'
      controllerUrl:"/api/system/fileUpload",
      fileList:[],
      data:{
        businessKey: this.businessKey,
        // tableName: this.tableName,
        // columName: this.columName
      },
      showLoading:false,
      dialogVisible:false,
      enable:true,
      imgUrl:"",//图片路径
      imgName: '',
      headers: {},

      isRepeat: false
    }
  },
  created() {
    //定义界面状态
    if (this.readOnly) {//父页面传入false或无参数代表可编辑
      this.enable = false;
    }
    this.getFiles();
  },
  //窗口关闭向父页面传值
  beforeDestroy() {
    let filename = "";
    if (this.fileList.length >= 1){
      for (let i = 0 ; i < this.fileList.length ; i++) {
        filename += this.fileList[i].name+";";
      }
    }
    this.$emit("setFileName",filename);
  },
  methods: {
    uploadFile2( params ){
      const file = params.file

      const formData = new FormData()
      formData.append("file", file)
      formData.append("businessKey", data.businessKey)

      upload(formData).then(res=>{
        params.onSuccess(res)
      }).catch(error=>{
        params.onError(error)
      })
    },
    secure() {

      // 对post-form-data请求参数排序
      function getSortPostFormDataForUpload(data) {
        let params = data;
        let sortParams = {};
        // 排序
        let sortKeys = Object.keys(params).sort();
        for (let i = 0; i < sortKeys.length; i++) {
          if (params[sortKeys[i]] !== undefined) {
            sortParams[sortKeys[i]] = params[sortKeys[i]]
          }
        }
        return sortParams;
      }

      // 生成nonce_client
      const nonce_client = md5(uuid.v4());
      // 生成签名  客户端时间戳 + nonce_client + data + uid
      const timestamp = parseInt((new Date()).getTime()) + parseInt(getDiffTime())
      const token = 'Bearer' + getToken();
      let sortData = getSortPostFormDataForUpload(this.data);
      // const sign_client = sm3Hash((Object.keys(sortData).length === 0 ? '' : JSON.stringify(sortData)) + timestamp + nonce_client + getUid());
      this.headers['Authorization'] = token;
      this.headers['nonce'] = nonce_client;
      this.headers['ts'] = timestamp;
      // this.headers['sign'] = sign_client;
      this.headers.isImport = true;
    },
    getFiles() {
      if(this.businessKey !== undefined){
        this.showLoading = true;
        getFiles(this.data).then(response =>{
          if(response.code === 200) {
            let files =  response.data
            let fileArray = new Array();
            for(let i = 0 ;i < files.length;i++) {
              let item = {
                name: files[i].fileName,
                url: files[i].ossName,
                columName: files[i].columName, 
                tableName: files[i].tableName, 
              }
              fileArray.push(item)
            }
            this.fileList = fileArray
            this.showLoading = false;
          }else{
            this.msgError(response.msg)
          }
        })
      }
    },
    //上传成功后
    fileSuccess(res,file,fileList) {
      if (res.code === 200) {//后台报错
        this.fileList = fileList;
      }else {
        this.msgError("当前文件【"+file.name+"】上传异常，请联系运维人员！")
      }
    },
    //上传之前操作(用于判断是否重名与格式限制)
    beforeUpload(file) {
      let extension = file.name.substring(file.name.lastIndexOf('.')+1);
      if ("" != this.acceptType && null != this.acceptType) {
        if (-1 == this.acceptType.indexOf(extension)) {
          this.msgWarning('支持文件格式【'+this.acceptType+'】！')
          return false;
        }
      }

      for (let i = 0 ;i < this.fileList.length;i++) {
        if (this.fileList[i].name == file.name) {
          this.msgWarning("当前文件【"+file.name+"】重名，请修改！");
          this.isRepeat = true
          return false;
        }
      }
      if (null != this.maxFileSize && (file.size/1024 > this.maxFileSize)) {
        this.msgWarning("当前文件"+file.name+"超过大小限制，请修改！");
        return false;
      }
      this.secure();
    },
    //删除之前操作
    beforeRemove(file,fileList){
      if (this.readOnly) {
        this.$message("只读状态不可删除！");
        return false;
      }
      //上传成功的文件删除则给出提示
      if ("success" != file.status) {
        return true;
      }
      return this.$confirm("确认删除【"+file.name+"】？","提示",{
        confirmButtonText:"确认",
        cancelButtonText:"取消",
        type:"warning"
      }).then(()=>{
        this.showLoading = true;
      })
    },
    //删除附件
    removeFile(file,fileList) {
      if(this.isRepeat){
        this.isRepeat = false
        return
      }

      let data = {
        businessKey: this.businessKey,
        tableName: file.tableName,
        columName: file.columName,
        fileName: file.name
      }
      deleteFiles(data).then(response =>{
        if(response.code === 200) {
          //this.$message.success(response.msg)
          this.showLoading = false
          this.fileList = fileList
        }else {
          this.msgError(response.msg)
        }
      })
    },
    //清空附件
    deleteAll() {
      if (this.fileList.length <= 0) {
        return;
      }
      this.$confirm("确认清空附件？","提示",{
        confirmButtonText:"确认",
        cancelButtonText:"取消",
        type:"warning"
      }).then(()=>{
        this.showLoading = true;
        let data = {
          businessKey: this.businessKey,
          // tableName: this.tableName,
          // columName: this.columName
        }
        deleteFiles(data).then(response =>{
          if(response.code === 200) {
            this.$message.success(response.msg)
            this.showLoading = false
            this.fileList = []
          }else {
            this.msgError(response.msg)
          }
        })
      })
    },
    //附件预览或下载
    downloadFile(file) {
      //验证图片正则表达式 jpg,jpeg,png,bmp,gif
      let Regexs = {
        photo:(/\jpg$|\jpeg$|\bmp$|\png$|\gif$/i) //图片格式
      };
      let reg = Regexs["photo"];
      //请求地址
      let fileName = file.name.substring(file.name.lastIndexOf('.')+1).toLowerCase();
      if(reg.test(file.name.substring(file.name.lastIndexOf('.')+1)) || fileName === 'bmp'){
        this.dialogVisible = true;
        let data = {
          businessKey: this.businessKey,
          tableName: this.tableName,
          columName: this.columName,
          fileName: file.name
        }
        downloadBase64Img(data).then(response =>{
          this.imgUrl = "data:image/gif;base64," + response.data.img
          this.imgName = file.name
        })
      }else {
        let data = {
          businessKey: this.businessKey,
          tableName: this.tableName,
          columName: this.columName,
          fileName: file.name
        }
        //非图片格式文件直接下载
        this.download('msdp-system/oss/downloadFile', data, file.name)
      }

    },
    //下载附件
    downloadFileByName(flg) {
      if (flg) {//全部下载（暂不使用）
        /*if (this.fileList.length <= 0) {
          return;
        }
        for (let i = 0 ; i < this.fileList.length ; i++) {
          let downLoadUrlNew = downLoadUrl+"&fileName="+this.fileList[i].ossName;
          window.location.href = safeUtil.makeUrl(downLoadUrlNew);
        }*/
      }else {
        let fileName = this.$refs.img.alt;
        let data = {
          businessKey: this.businessKey,
          tableName: this.tableName,
          columName: this.columName,
          fileName: fileName
        }
        this.download('msdp-system/oss/downloadFile', data, fileName)
      }
    },
    //数量超过限制给出提示
    handleExceed(){
      this.msgWarning('当前只可上传'+this.limitNum+'个文件！')
    },
    //上传失败操作
    showError(err,file) {
      this.msgError('当前文件【'+file.name+'】上传失败！'+err)
    }
  }
}
</script>

<style scoped>

</style>
