<template>
  <div>
    <el-form-item :label="configData.label" :prop="configData.name" :rules="rules">
      <el-time-picker
        style="width:100%"
        v-model="formValue[configData.name]"
        :placeholder="`请选择${configData.label}`"
        :value-format="'HH:mm:ss'"
        v-if="!onlyRead"
        :disabled="disabled"
        >
      </el-time-picker>
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
  },
  methods: {}
}
</script>

