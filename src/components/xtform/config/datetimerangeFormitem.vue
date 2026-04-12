<template>
  <div>
    <el-form-item :label="configData.label" :prop="configData.name" :required="configData.isRequired">
      <template v-if="!onlyRead">
        <el-time-picker
          style="width:100%"
          v-if="configData.config.type === 'timerange'"
          v-model="formValue[configData.name]"
          is-range
          :value-format="configData.config.format"
          :disabled="disabled"
        ></el-time-picker>
        <el-date-picker
          v-else
          style="width:100%"
          v-model="formValue[configData.name]"
          :type="configData.config.type"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :value-format="configData.config.format"
          :disabled="disabled">
        </el-date-picker>
      </template>
      <el-input v-else v-model="formValue[configData.name]" disabled></el-input>

    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['configData', 'formValue', 'onlyRead', 'disabled'],
  data() {
    return{

    }
  },
  mounted() {
  },
  methods: {}
}
</script>
