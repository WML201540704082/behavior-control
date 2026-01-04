<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: path }">{{ masterTitle }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ childTitle }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider />
  </div>
</template>
<script>
  export default {
    name: 'Breadcrumb',
    props: {
      path: {
        type: String,
        default: null
      },
      masterTitle: {
        type: String,
        default: null
      },
      childTitle: {
        type: String,
        default: null
      }
    }
  }
</script>
