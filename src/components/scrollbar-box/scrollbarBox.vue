<template>
  <div :style="{height: boxHeight}">
    <el-scrollbar style="height:100%">
      <slot></slot>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  props: {
    boxHeight: {
      type: String,
      default: '600px'
    }
  },
  data() {
    return{}
  }
}
</script>
