<template>
  <div>
    <el-form-item label="格式">
      <el-select v-model="formValue.config.format" @change="changeSelect">
        <el-option
          v-for="item in formatList"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { citypesearch } from "@/api/system/ciModel";

export default {
  props: ['formValue', 'showType'],
  data() {
    return{
      formatList: [
        { value: 'yyyy-MM-dd HH:mm:ss' },
        { value: 'yyyy-MM-dd HH:mm' },
        { value: 'yyyy-MM-dd HH' },
      ],
    }
  },
  created() {
    if(this.showType == '新增') {
      this.formValue.config = {
        format: 'yyyy-MM-dd HH:mm:ss',
        type: 'timerange'
      }
    }
  },
  methods: {
    changeSelect(val) {
      this.$forceUpdate()
    },
  }
}
</script>

<style lang="scss" scoped>
.member_item{
  display: flex;
  align-items: center; 
  margin-bottom: 10px
}
</style>
