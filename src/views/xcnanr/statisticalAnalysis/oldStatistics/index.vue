<template>
  <basic-container>
    <div style="width: 100%;height: 5%;">
      <el-tabs v-model="activeName" style="padding: 0 20px" @tab-click="handleClick">
        <el-tab-pane label="巡视作业统计" name="StatisticsOnPatrolOperations" />
        <el-tab-pane label="检修作业统计" name="MaintenanceJobStatistics" />
      </el-tabs>
    </div>
    <div style="width: 100%;height: 95%;margin-top: -20px">
      <StatisticsOnPatrolOperations v-if="activeName === 'StatisticsOnPatrolOperations'" />
      <MaintenanceJobStatistics v-if="activeName === 'MaintenanceJobStatistics'" />
    </div>
  </basic-container>
</template>

<script>
import StatisticsOnPatrolOperations from './StatisticsOnPatrolOperations'
import MaintenanceJobStatistics from './MaintenanceJobStatistics'
export default {
  components:{StatisticsOnPatrolOperations,MaintenanceJobStatistics},
  data() {
    return {
      activeName: 'StatisticsOnPatrolOperations'
    }
  },
}
</script>

<style scoped>

</style>
