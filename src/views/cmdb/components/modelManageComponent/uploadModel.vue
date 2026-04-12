<template>
  <div>
    <el-upload
      class="upload-model"
      :action="url"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="1"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import { getIconList } from "@/api/system/ciModel";

export default {
  props: ['isShow', 'selectIcon'],
  data() {
    return{
      url: '',
      fileList: [], // [{name: 'name', url: 'url'}]
      activeIcon: ''
    }
  },
  mounted() {
    
  },
  methods: {
    handlePreview(file){
      // console.log(file)
    },
    handleRemove(file, fileList){
      // console.log(file, fileList)
    },
    beforeRemove(file, fileList){
      return this.$confirm(`确定移除 ${ file.name }`)
    },
    handleExceed(file, fileList){
      // this.$message.warning('')
    },
  }
}
</script>

<style lang="scss" scoped>
.icon_item{
  text-align: center;
}
</style>
