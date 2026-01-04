<template>
  <div>
    <!-- 对话框 -->
    <el-dialog :title="title" :visible.sync="isVisible" width="600px" class="import-dialog">
      <div v-if="type === 'edit'">
        <el-row>
          <el-col :span="12">
            <img :src="formDetial.extAttr1" style="height: 240px;width: 240px">
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-upload ref="upload" :limit="1" :accept="acceptTypes" name="file" :action="oss.action"
                         :headers="headers" :show-file-list="true" :before-upload="fileUploadBeforeFunc"
                         :on-change="fileChangeFunc" :on-success="uploadFileSuccess" class="upload_image" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将二维码图片拖到此处，或
                  <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">仅支持上传JPG/JPEG/PNG文件<br/>文件大小请勿超过20M</div>
              </el-upload>
            </el-row>
            <el-row>
              <div class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="isVisible = false">取 消</el-button>
              </div>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-upload ref="upload" :limit="1" :accept="acceptTypes" name="file" :action="oss.action"
                   :headers="headers" :show-file-list="true" :before-upload="fileUploadBeforeFunc"
                   :on-change="fileChangeFunc" :on-success="uploadFileSuccess" class="upload_image" drag>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将二维码图片拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">仅支持上传JPG/JPEG/PNG文件，文件大小请勿超过20M。</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="isVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {uploadAgCode} from '@/api/xcnanr/authorizedPerson'
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'
import website from '@/config/website';

export default {
  props: ['isShow', 'type', 'formDetial'],
  data() {
    return {
      title: '安规二维码上传', acceptTypes: ['.jpg', '.png', '.jpeg'],
      oss: {
        action: '/api/idevelop-resource/oss/endpoint/put-file',
        fileList: []
      },
      headers: {
        Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
        'Idevelop-Auth': 'bearer ' + getToken()
      },
      ossLink: null
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
    },
  },
  methods: {
    // 提交上传文件
    submitFileForm() {
      if (!this.ossLink) {
        this.$notify({title: '提示', message: '二维码未上传', type: 'warning'})
      } else {
        uploadAgCode({id: this.formDetial.id, link: this.ossLink}).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '二维码上传成功'
            });
          } else {
            this.$message({
              type: 'error',
              message: '二维码上传失败'
            });
          }
          this.$emit('refreshData')
          this.$emit('close')
        })
      }
    },
    // 文件上传之前的事件
    fileUploadBeforeFunc(file) {
      this.ossLink = null
      // 先检验上传文件格式是否正确
      if (this.acceptTypes.length > 0) {
        let uploadRightFlag = false
        for (const type of this.acceptTypes) {
          if (file.name.endsWith(type)) {
            uploadRightFlag = true
          }
        }
        if (!uploadRightFlag) {
          this.$message.error('文件[' + file.name + ']格式不正确')
          this.$refs.upload.clearFiles()
          return false
        }
      }

      // 判断文件大小
      if (file.size / 1024 / 1024 > 20) {
        this.$message.error('文件[' + file.name + ']大小超出范围')
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
      this.ossLink = response.data.link
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

/deep/ .upload_image .el-upload-dragger {
  width: 280px;
  height: 160px;
}

.dialog-footer {
  margin-top: 10px;
}

.emptyImage {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 230px;
  height: 280px;
  margin-left: 10px;
  background-color: #f5f7fa;
  color: #909399;
}
</style>
