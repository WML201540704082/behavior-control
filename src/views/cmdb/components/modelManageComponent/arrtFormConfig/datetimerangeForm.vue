<template>
  <div>
    <el-form-item label="输入类型" :required="true">
      <el-select v-model="formValue.config.type" @change="changeType">
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="格式" :required="true">
      <el-select v-model="formValue.config.format" @change="$forceUpdate()">
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
      typeList: [
        { name: '日期范围', value: 'daterange' },
        { name: '时间范围', value: 'timerange' },
        { name: '日期时间范围', value: 'datetimerange' },
      ],
      formatList: [
        { value: 'yyyy-MM-dd' },
        { value: 'MM-dd' },
      ],
    }
  },
  created() {
    if(this.showType == '新增') {
      this.formValue.config = {
        format: 'yyyy-MM-dd',
        type: 'daterange'
      }
    }else {
      if(this.formValue.config.type == 'daterange') {
        this.formatList = [
          { value: 'yyyy-MM-dd' },
          { value: 'MM-dd' },
        ]
      }else if(this.formValue.config.type == 'timerange') {
        this.formatList = [
          { value: 'HH:mm:ss' },
        ]
      }else if(this.formValue.config.type == 'datetimerange') {
        this.formatList = [
          { value: 'yyyy-MM-dd HH:mm' },
        ]
      }
    }
    
  },
  methods: {
    changeType(val) {
      
      if(val == 'daterange') {
        this.formatList = [
          { value: 'yyyy-MM-dd' },
          { value: 'MM-dd' },
        ]
        this.formValue.config.format = 'yyyy-MM-dd'
      }else if(val == 'timerange') {
        this.formatList = [
          { value: 'HH:mm:ss' },
        ]
        this.formValue.config.format = 'HH:mm:ss'
      }else if(val == 'datetimerange') {
        this.formatList = [
          { value: 'yyyy-MM-dd HH:mm' },
        ]
        this.formValue.config.format = 'yyyy-MM-dd HH:mm'
      }
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
