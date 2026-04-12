<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="() => $emit('close')"
    :show-close="true"
    append-to-body
    :visible.sync="isShow"
    title="详情"
    width="700px"
    top="20vh"
    v-el-drag-dialog
  >
    <el-form
      ref="submitForm"
      class="xt_form"
      label-suffix=":"
      label-width="120px"
      size="small">
      <el-row>
        <el-col :span="24">
          <el-form-item label="成本中心编码" prop="projectUnitCode">
            <el-input v-model="fromValue.kostl" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="成本中心描述" prop="projectUnitCode">
            <el-input v-model="fromValue.kostlT" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="成本中心状态" prop="projectUnitCode">
            <el-input :value="getStatusName(fromValue.koslStatus)" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="维护工厂" prop="projectUnitCode">
            <el-input :value="getSwerkName(fromValue.swerk) " readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="创建时间" prop="projectUnitCode">
            <el-input v-model="fromValue.createTime " readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button type="primary" size="small" @click="$emit('close')">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "cbdetial",
  props: ['fromValue', 'isShow', 'erpUnits'],
  data() {
    return {};
  },
  mounted() {

  },
  methods: {
    getStatusName(status) {
      if (status == '0') {
        return '正常';
      }
      return '异常'
    },
    getSwerkName(swerk) {
      if (swerk && this.erpUnits) {
        let fItem = this.erpUnits.find(a => a.code == swerk);
        if (fItem) {
          return fItem.name;
        }
      }
      return null;
    },
  },
}
</script>
<style lang="scss" scoped>
.btn_box {
  text-align: center;
}
</style>
