<template>
  <div>
    <!-- 对话框 -->
    <el-dialog :title="title" :visible.sync="isVisible" width="600px" class="import-dialog">
      <div v-if="type === 'edit'">
        <el-row>
          <el-col :span="12">
            <div v-if="!formDetial.faceInfo" class="emptyImage">暂未上传照片</div>
            <div v-else align="center"><img :src="imageData" style="height: 280px;width: 200px"></div>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-upload ref="upload" :limit="1" accept=".jpg,.png,.jpeg" name="file" action="#" :disabled="isUploading" :on-change="beforeUploadFile" :auto-upload="false" class="upload_image" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将图片拖到此处，或
                  <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">只能上传JPG/JPEG/PNG文件，且不超过50kb。<br/>用于门禁人脸识别使用。</div>
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
        <el-upload ref="upload" :limit="1" accept=".jpg,.png,.jpeg" name="file" action="#" :disabled="isUploading" :on-change="beforeUploadFile" :auto-upload="false" drag>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将图片拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传JPG/JPEG/PNG文件，且不超过50kb。<br/>用于门禁人脸识别使用。</div>
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
import {uploadPic, checkPic} from '@/api/xcnanr/authorizedPerson'

export default {
  props: ['isShow', 'type', 'formDetial'],
  data() {
    return {
      title: '照片上传',
      isUploading: false,
      baseImage: null, imageData: ''
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
  created() {
    this.getImage()
  },
  methods: {
    // 预览照片
    getImage() {
      if (this.formDetial && this.type === 'edit') {
        checkPic(this.formDetial.id).then(res => {
          this.imageData = 'data:image/png;base64,' + res.msg
        })
      }
    },
    // 提交上传文件
    submitFileForm() {
      if (!this.baseImage) {
        this.$notify({title: '提示', message: '照片为空', type: 'warning'})
      } else {
        if (this.formDetial) {
          this.formDetial.faceInfo = this.baseImage
          uploadPic(this.formDetial).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '照片上传成功'
              });
            }
            this.$emit('refreshData')
            this.$emit('close')
          })
        } else {
          this.$emit('setVal', this.baseImage)
          this.$emit('close')
        }
      }
    },
    beforeUploadFile(file) {
      const isLimit = file.size / 1024
      if (isLimit > 50) {
        this.$message.error('图片不能大于50KB')
        this.$refs.upload.clearFiles()
        return false
      }
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = (e) => {
        const base64Img = e.target.result // 此为base64编码
        if (base64Img.includes('data:image/jpeg;base64,')) {
          this.baseImage = e.target.result.split('data:image/jpeg;base64,')[1]
        }
        if (base64Img.includes('data:image/png;base64,')) {
          this.baseImage = e.target.result.split('data:image/png;base64,')[1]
        }
      }
      // 阻止默认上传行为
      return false
    }
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
  height: 230px;
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
