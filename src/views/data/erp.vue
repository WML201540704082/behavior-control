<template>
  <basic-container>
    <div class="page_body">
      <el-tabs v-model="activeName">
        <el-tab-pane name="first">
          <span slot="label"> <i class="el-icon-s-operation"></i> 成本中心 </span>
          <chengben_center v-show="activeName == 'first'"></chengben_center>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label"> <i class="el-icon-set-up"></i> 标签页2 </span>
          <div v-show="activeName == 'second'">
            <span>内容content2</span>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import Chengben_center from "./components/erp/chengben_center.vue";

export default {
  components: {Chengben_center},
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail'])
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  mounted() {

  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.page_body {
  height: 85vh;
}
</style>
