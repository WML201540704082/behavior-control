<template>
  <basic-container>
    <div style="width: 100%;height: 5%;">
      <el-tabs v-model="activeName" style="padding: 0 20px" @tab-click="handleClick">
        <el-tab-pane label="授权记录" name="authRecord" />
        <el-tab-pane label="进出机房记录" name="roomRecord" />
        <el-tab-pane label="运维操作记录" name="deviceRecord" />
      </el-tabs>
    </div>
    <div style="width: 100%;height: 93%;margin-top: -20px">
      <AuthRecord v-if="activeName === 'authRecord'" />
      <RoomRecord v-if="activeName === 'roomRecord'" />
      <DeviceRecord v-if="activeName === 'deviceRecord'" />
    </div>
  </basic-container>
</template>

<script>
import AuthRecord from './authRecord'
import RoomRecord from './roomRecord'
import DeviceRecord from './deviceRecord'
export default {
  name: 'AuditRecord',
  components:{AuthRecord,RoomRecord,DeviceRecord},
  data() {
    return {
      activeName: 'authRecord'
    }
  },
}
</script>

<style scoped>

</style>
