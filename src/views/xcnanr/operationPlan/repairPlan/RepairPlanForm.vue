<template>
  <!-- 检修计划的表单组件（新增、编辑、详情、审批） -->
  <basic-container>
    <!-- 面包屑 -->
    <div style="margin-left: -160px;margin-top: -30px;margin-bottom: 20px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/xcnanr/operationPlan/repairPlan/index' }">检修计划</el-breadcrumb-item>
        <el-breadcrumb-item>{{ getChildTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 审批流 -->
    <div></div>
    <el-divider />
    <!-- 主表字段 -->
    <div></div>
    <el-divider />
    <!-- 状态追踪 -->
    <div></div>
    <el-divider />
    <!-- 审批 -->
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'RepairPlanForm',
  components: {},
  props: {},
  data() {},
  computed: {
    ...mapGetters(['userDetail']),
    getChildTitle() {
      return this.$route.query.childTitle
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped>
  /** 字数限制的背景色：文本域 */
  ::v-deep(.el-textarea .el-input__count){
    background: #e0f3ff10 !important;
  }
  /** 字数限制的背景色：文本框 */
  ::v-deep(.el-input .el-input__count .el-input__count-inner){
    background: #e0f3ff10 !important;
  }
</style>
