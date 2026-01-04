<template>
  <basic-container>
    <div style="width: 100%;height: 5%;">
      <el-tabs v-model="activeName" style="padding: 0 20px">
        <el-tab-pane label="被授权人" name="AuthorizedPerson" />
        <el-tab-pane label="机房门禁" name="RoomAccessControl" />
        <el-tab-pane label="机房视频" name="RoomVideo" />
        <el-tab-pane label="堡垒机" name="FortressMachine" />
      </el-tabs>
    </div>
    <div style="width: 100%;height: 95%;margin-top: -20px">
      <AuthorizedPerson v-if="activeName === 'AuthorizedPerson'" />
      <RoomAccessControl v-if="activeName === 'RoomAccessControl'" />
      <RoomVideo v-if="activeName === 'RoomVideo'" />
      <FortressMachine v-if="activeName === 'FortressMachine'" />
    </div>
  </basic-container>
</template>

<script>
  import AuthorizedPerson from './authorizedPerson/index'
  import RoomAccessControl from './roomAccessControl/index'
  import RoomVideo from './roomVideo/index'
  import FortressMachine from './fortressMachine/index'
export default {
  name: 'AuthManage',
  components:{AuthorizedPerson, RoomAccessControl, RoomVideo, FortressMachine},
  data() {
    return {
      activeName: 'AuthorizedPerson',
      activeList: ['AuthorizedPerson', 'RoomAccessControl', 'RoomVideo', 'FortressMachine']
    }
  },
  created() {
    const tab = this.$route.query['tab']
    if (tab && this.activeList.indexOf(tab) >= 0) {
      this.activeName = tab
    }
  }
}
</script>

<style scoped>

</style>
