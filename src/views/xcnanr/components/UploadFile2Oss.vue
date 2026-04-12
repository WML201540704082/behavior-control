<template>
  <div>
    <div style="display: flex; align-items: center;  margin-bottom: 10px;">
      <el-upload ref="upload" :accept="acceptTypes.join(',')" name="file" :multiple="multiple" :action="oss.action"
                 :headers="headers" :show-file-list="false" :before-upload="fileUploadBeforeFunc"
                 :on-change="fileChangeFunc"
                 :on-success="uploadFileSuccess" :file-list="oss.fileList">
        <el-button type="primary">附件上传</el-button>
      </el-upload>
      <!-- 图纸大小限制 -->
      <span style="color: red; margin-left: 20px; font-size: 13px;">*附件大小请勿超过{{ maxSize + maxUnit }}</span>
    </div>

    <!-- 图片预览（供外部预览使用） -->
    <el-dialog :visible.sync="preview.visible" title="附件预览" width="550px;" append-to-body>
      <div class="dialog-content">
        <el-image style="width: 480px;height: 640px;margin: 0 auto" :src="preview.imageUrl" :preview-src-list="[preview.imageUrl]"></el-image>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {Base64} from 'js-base64';
  import {getToken} from '@/util/auth'
  import website from '@/config/website';

  export default {
    name: "UploadFile2Oss",
    props: {
      // 是否同时上传多个
      multiple: {
        type: Boolean,
        default: true
      },
      // 附件类型集合
      acceptTypes: {
        type: Array,
        default: () => ['.jpg', '.png', '.jpeg']
      },
      maxSize: {
        type: Number,
        default: 20
      },
      maxUnit: {
        type: String,
        default: 'MB'
      }
    },
    data() {
      return {
        oss: {
          action: '/api/idevelop-resource/oss/endpoint/put-file',
          fileList: []
        },
        headers: {
          Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
          'Idevelop-Auth': 'bearer ' + getToken()
        },
        preview: { visible: false, imageUrl: null }
      }
    },
    methods: {
      // 文件上传之前的事件
      fileUploadBeforeFunc(file) {
        // 先检验上传文件格式是否正确
        if (this.acceptTypes.length > 0) {
          let uploadRightFlag = false
          for (const type of this.acceptTypes) {
            if (file.name.endsWith(type)) {
              uploadRightFlag = true
            }
          }
          if (!uploadRightFlag) {
            this.$message.error('附件[' + file.name + ']格式不正确')
            this.$refs.upload.clearFiles()
            return false
          }
        }

        // 判断文件大小
        if (['GB', 'MB'].indexOf(this.maxUnit) < 0) {
          this.$message.error('文件大小配置失败')
          this.$refs.upload.clearFiles()
          return false
        } else if (this.maxUnit === 'MB' && file.size / 1024 / 1024 > this.maxSize) {
          this.$message.error('附件[' + file.name + ']不能大于' + this.maxSize + this.maxUnit)
          this.$refs.upload.clearFiles()
          return false
        } else if(this.maxUnit === 'GB' && file.size / 1024 / 1024 / 1024 > this.maxSize) {
          this.$message.error('附件[' + file.name + ']不能大于' + this.maxSize + this.maxUnit)
          this.$refs.upload.clearFiles()
          return false
        }
        return true
      },
      /**
       * 文件状态发生变化的事件，可接受两个参数  file,fileList
       * @returns {boolean}
       */
      fileChangeFunc() {
        return true
      },
      // 文件上传成功的事件
      uploadFileSuccess(response, file) {
        // 返回父组件两个参数，文件名称、上传OSS路径
        this.$emit("fileResult", file.name, response.data.link )
      },
      // 图片预览（供外部调用）
      previewImageFunc(imageUrl) {
        this.preview = { visible: true, imageUrl: imageUrl }
      }
    }
  }
</script>
<style scoped>
  .dialog-content {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    height: 100%; /* 确保容器有高度 */
  }
</style>
