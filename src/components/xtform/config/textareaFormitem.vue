<template>
  <div>
    <el-form-item :label="configData.label" :prop="configData.name" :rules="rules">
      <el-input v-if="!onlyRead" type="textarea" v-model="formValue[configData.name]"
                :placeholder="`请填写${configData.label}`"
                :rows="1"
                clearable
                :disabled="disabled"
                :class="[disabled?'t_d1':'t_d2']"></el-input>
      <el-input v-else v-model="formValue[configData.name]" disabled></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['configData', 'formValue', 'onlyRead', 'disabled','rules'],
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
/deep/ .el-textarea__inner {
  background: none !important;
}

.t_d1 {
  background-color: #E4EDF5;
}

.t_d2 {
  background-color: #E0F3FF;
}
</style>

