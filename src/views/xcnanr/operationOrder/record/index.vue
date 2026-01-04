<template>
  <basic-container>
    <div style="width: 100%;height: 5%;">
      <el-tabs v-model="activeName" style="padding: 0 20px">
        <el-tab-pane label="巡视记录" name="InspectionRecord"/>
        <el-tab-pane label="检修记录" name="RepairRecord"/>
        <el-tab-pane label="维修记录" name="MaintenanceRecord"/>
      </el-tabs>
    </div>
    <div style="width: 100%;height: 95%;margin-top: 0px">
      <InspectionRecord v-if="activeName === 'InspectionRecord'"/>
      <RepairRecord v-if="activeName === 'RepairRecord'"/>
      <MaintenanceRecord v-if="activeName === 'MaintenanceRecord'"/>
    </div>
  </basic-container>
</template>

<script>
import InspectionRecord from "./components/InspectionRecord";
import RepairRecord from "./components/RepairRecord";
import MaintenanceRecord from "./components/MaintenanceRecord";

export default {
  name: 'Record',
  components: { InspectionRecord, RepairRecord, MaintenanceRecord},
  data() {
    return {
      activeName: 'InspectionRecord'
    }
  },
}
</script>

<style scoped>

</style>
