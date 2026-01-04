<template>
  <el-upload
    ref="upload"
    :limit="1"
    accept=".xlsx,.xls"
    name="file"
    :headers="upload.headers"
    :action="upload.url"
    :disabled="upload.isUploading"
    :http-request="uploadFile2"
    :on-progress="handleFileUploadProgress"
    :on-success="handleFileSuccess"
    :on-error="handleFileError"
    :before-upload="beforeUpload"
    :auto-upload="false"
    drag
  >
    <i class="el-icon-upload" slot="trigger"></i>
    <div class="el-upload__text" slot="trigger">
      将文件拖到此处，或
      <em>点击上传</em>
    </div>


    <div class="el-upload__tip el-upload__template" slot="tip">
      <div><span>模板下载</span></div>
      <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 -->
      <div>
        <el-link type="primary" style="font-size:12px" @click="importTemplate(0)">网络安全清单.xlsx</el-link>
      </div>
      <div>
        <el-link type="primary" style="font-size:12px" @click="importTemplate(1)">信息机房安全清单.xlsx</el-link>
      </div>
    </div>

    <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>

    <!-- <div class="el-upload__tip" slot="tip">
      <span>模板下载</span>
    </div>
    <div class="el-upload__tip" slot="tip">
      <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
      <el-link type="info" style="font-size:12px" @click="importTemplate(0)">网络安全清单.xlsx</el-link>
    </div>
    <div class="el-upload__tip" slot="tip">
      <el-link type="info" style="font-size:12px" @click="importTemplate(1)">信息机房安全清单.xlsx</el-link>
    </div>
    <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div> -->
  </el-upload>
</template>

<script>
import { mapGetters } from 'vuex'
import { uploadEcho } from '@/api/safeDanger/rectification'
import md5 from 'js-md5'
// import { sm3Hash } from '@/util/jsencrypt'
const uuid = require('uuid')
import { getToken, getUid, getDiffTime } from '@/util/auth'
export default {
  name: "ComputerRoomDetail",
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
    ]),
  },
  props: {
    roomId: {
      type: String,
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 导入弹框
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
        headers: {},
        // 上传的地址
        // url: process.env.VUE_APP_BASE_API + '/api/idevelop-hidden/rectification/upload/echo'
        url: '#'
      },
    }
  },
  created() {
    
  },
  mounted() {

  },
  methods: {
    importTemplate(downLoadType) {
      let exportName = downLoadType == 0 ? '网络安全清单' : '信息机房安全清单'

      const loading = this.$loading({
        lock: true,
        text: '正在处理，请稍等。。。',
        spinner: 'el-icon-loading'
      })
      this.download('/api/idevelop-hidden/rectification/downLoad/template?downLoadType=' + downLoadType, {
        downLoadType: downLoadType
      }, `${exportName}模板_${this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')}.xlsx`, loading)

      // this.$confirm('全量数据导出较慢，请耐心等待。', '警告', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   const loading = this.$loading({
      //     lock: true,
      //     text: '正在处理，请稍等。。。',
      //       spinner: 'el-icon-loading'
      //     })
      //   this.download('/api/idevelop-hidden/rectification/downLoad/template?downLoadType='+downLoadType, {
      //     downLoadType: downLoadType
      //   }, `${exportName}模板_${this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')}.xlsx`, loading)
      //   }).catch(function() {
      //   })
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    uploadFile2( params ){
      const file = params.file

      const formData = new FormData()
      formData.append("file", file)

      uploadEcho(formData).then(res=>{
        params.onSuccess(res)
      }).catch(error=>{
        params.onError(error)
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })

      this.$emit('onImportSubmit', response.data)
    },
    // 文件上传失败处理
    handleFileError(err, file, fileList) {
      // console.log(999, err, file, fileList)
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert('解析失败，请参照模板导入数据清单', '导入结果', { dangerouslyUseHTMLString: true })

      this.$emit('onImportSubmit')
    },
    //上传之前操作(用于判断是否重名与格式限制)
    beforeUpload(file) {
      this.secure()
    },
    secure() {
      // 生成nonce_client
      const nonce_client = md5(uuid.v4())
      // 生成签名  客户端时间戳 + nonce_client + data + uid
      const timestamp = parseInt((new Date()).getTime()) + parseInt(getDiffTime())
      const token = 'Bearer' + getToken()
      // const sign_client = sm3Hash(timestamp + nonce_client + getUid())
      this.upload.headers['Authorization'] = token
      this.upload.headers['nonce'] = nonce_client
      this.upload.headers['ts'] = timestamp
      // this.upload.headers['sign'] = sign_client
      this.upload.headers.isImport = true
    },
  }
}
</script>

<style scoped>
  .el-cascader{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }
  .el-input{
    width: 100%;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }
  .el-col-24 {
    height: 50px;
  }
</style>
