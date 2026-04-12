<template>
  <!-- 重新派单 -->
  <el-dialog title="重新派单" :visible.sync="dialogFlag" width="600px" :before-close="closeThisDialog">
    <el-form class="xt_form" label-suffix=":" label-width="100px">
      <el-form-item label="工单号">
        <el-input  v-model="dialogObject.code" disabled style="width: 400px" />
      </el-form-item>
      <el-form-item label="检修操作人">
        <el-select v-model="persons" multiple filterable collapse-tags clearable placeholder="请选择检修操作人" @change="getChange()" style="width: 400px">
          <el-option v-for="item in authorizedPersonList" :key="item.name" :label="item.name + ' / ' + item.companyName" :value="item.id" />
        </el-select>
      </el-form-item>
      <div style="margin: 10px auto;">
        <el-button size="small" style="margin-left: 200px" @click="closeThisDialog">返 回</el-button>
        <el-button type="primary" size="small" @click="submitFunc">提 交</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { getAll } from "@/api/xcnanr/authorizedPerson"

export default {
  name: 'Dispatch',
  components: { },
  props: {
    dialogObject: {
      type: Object,
      default: null
    },
    dialogFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      persons: null, authorizedPersonList: null
    }
  },
  created() {
    this.getAuthorizedPerson()

  },
  methods: {
    getAuthorizedPerson() {
      getAll({enabled: 1}).then(res=>{
        this.authorizedPersonList = res.data
      })
    },
    closeThisDialog() {
      this.$parent.$parent.$parent.dialogObject = null
      this.$parent.$parent.$parent.dialogFlag = false
      this.$parent.$parent.$parent.dialogType = null
    },
    getChange(){
      this.$forceUpdate()
    },
    submitFunc() {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
