<template>
  <div>
    <el-form-item label="目标模型">
      <el-select v-model="formValue.targetCiId" filterable>
        <el-option-group
          v-for="group in modelList"
          :key="group.id"
          :label="group.name">
          <el-option
            v-for="item in group.ciList"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-option-group>
      </el-select>
    </el-form-item>
    <el-form-item label="关联方式" >
      <el-radio-group v-model="formValue.config.mode" @change="$forceUpdate()">
        <el-radio :label="'r'">选择</el-radio>
        <el-radio :label="'rm'">选择或新增</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="多选">
      <el-switch 
        @change="$forceUpdate()"
        v-model="formValue.config.isMultiple" 
        active-color="#13ce66" 
        inactive-color="#ff4949"
        :active-value="1"
        :inactive-value="0"
      ></el-switch>
    </el-form-item>
  </div>
</template>

<script>
import { citypesearch } from "@/api/system/ciModel";

export default {
  props: ['formValue', 'showType'],
  data() {
    return{
      modelList: [],
    }
  },
  created() {
    if(this.showType == '新增') {
      this.formValue.config = {
        isMultiple: 0,
        mode: 'r'
      }
    }
    this.getModelList()
  },
  methods: {
    getModelList() {
      citypesearch().then(res => {
        this.modelList = res.Return
      })
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
