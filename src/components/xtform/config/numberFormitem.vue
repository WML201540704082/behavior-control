<template>
  <div>
    <el-form-item :label="configData.label" :prop="configData.name" :rules="rules">
      <el-input v-if="!onlyRead" type="number" v-model="formValue[configData.name]" :placeholder="`请填写${configData.label}`" :disabled="disabled"></el-input>
      <el-input v-else v-model="formValue[configData.name]" disabled></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['configData', 'formValue', 'onlyRead', 'disabled','rules'],
  data() {
    return{

    }
  },
  mounted() {},
  methods: {}
}
</script>

