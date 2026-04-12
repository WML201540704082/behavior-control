<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogFlag" :width="width" append-to-body top="10vh" :show-close="true" :close-on-click-modal="true"  v-el-drag-dialog>
    <el-image
      :width="width"
      :height="height"
      :style="{width: '100%',height: height}"
      :src="imgurl"
      :fit="'fill'"
      :preview-src-list="srcList"/>
  </el-dialog>
</template>

<script>

export default {
  name: 'ImageView',
  components: { },
  props: {
    imgurl: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '500px'
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      dialogFlag: false,
      dialogTitle: '照片查看',
    }
  },
  created() {
  },
  computed: {
    srcList() {
        const imgArr = (this.imgurl) ? [this.imgurl] : []
      return imgArr
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
