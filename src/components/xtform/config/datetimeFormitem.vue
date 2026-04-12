<template>
  <div>
    <el-form-item :label="configData.label" :prop="configData.name" :rules="rules">
      <el-date-picker
        v-if="!onlyRead"
        style="width:100%"
        v-model="formValue[configData.name]"
        :type="configData.type"
        :placeholder="`请选择${configData.label}`"
        :value-format="configData.config.format"
        :disabled="disabled">
      </el-date-picker>
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
  mounted() {
    // console.log(this.configData.config)
  },
  methods: {}
}
</script>

