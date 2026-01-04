<template>
  <div>
    <el-form-item :label="configData.label" :prop="configData.name">
      <el-radio-group v-if="!onlyRead" v-model="formValue[configData.name]" :disabled="disabled">
        <el-radio
          v-for="(item, index) in configData.config.members"
          :key="index"
          :label="item"
         >{{item}}</el-radio>
      </el-radio-group>
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
  mounted() {},
  methods: {}
}
</script>

