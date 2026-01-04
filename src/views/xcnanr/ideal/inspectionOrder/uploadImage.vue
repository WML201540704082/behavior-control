<template>
  <div>
    <!-- 导入对话框 -->
    <el-dialog :title="title" :visible.sync="isVisible" width="600px"  class="import-dialog">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".jpg,.png,.jpeg"
        name="file"
        action="#"
        :disabled="isUploading"
        :on-change="beforeUploadFile"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将图片拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传JPG/JPEG/PNG文件，且不超过200kb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="isVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['isShow', 'tableIndex'],
  data() {
    return{
      title: '照片上传',
      isUploading: false,
      baseImage: { index:null, imgData: null }
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
    },
  },
  created(){
    this.baseImage.index = this.tableIndex
  },
  methods: {
    // 提交上传文件
    submitFileForm() {
      if (!this.baseImage.imgData) {
        this.$notify({ title: '提示', message: '照片为空', type: 'warning' })
      }else {
        this.$emit('setVal', this.baseImage)
        this.isVisible = false
      }
    },
    beforeUploadFile(file) {
      const isLimit = file.size / 1024
      if (isLimit < 10) {
        this.$message.error('图片不能小于10KB')
        this.$refs.upload.clearFiles()
        return false
      }
      if (isLimit > 200) {
        this.$message.error('图片不能大于200KB')
        this.$refs.upload.clearFiles()
        return false
      }
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = (e) => {
         // 此为base64编码
        this.baseImage.imgData = e.target.result
      }
      // 阻止默认上传行为
      return false
    }
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
