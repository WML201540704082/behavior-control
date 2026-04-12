<template>
  <div>
    <el-form-item :label="configData.label" :prop="configData.name" :rules="rules">
      <el-input v-if="!onlyRead" v-model="formValue[configData.name]" :placeholder="`请填写${configData.label}`" clearable :disabled="disabled"></el-input>
      <el-input v-else v-model="formValue[configData.name]" disabled></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['configData', 'formValue', 'onlyRead', 'disabled', 'rules'],
  data() {
    return {}
  },
  watch: {
    formValue: {
      deep: true,
      handler() {
        this.$forceUpdate()
      }
    }
  },
  mounted() {
    this.$forceUpdate()
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-form-item__label {
  white-space: nowrap;
}
</style>

