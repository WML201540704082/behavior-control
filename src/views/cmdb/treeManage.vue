<template>
  <basic-container>
    <div class="page_body">
      <el-tabs v-model="activeName">
        <el-tab-pane name="first">
          <span slot="label"> <i class="el-icon-s-operation"></i> 资源台账树形管理 </span>
          <tab-tree v-show="activeName == 'first'"></tab-tree>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label"> <i class="el-icon-set-up"></i> 前端属性配置管理 </span>
          <tab-pzsx v-if="activeName == 'second'"></tab-pzsx>
        </el-tab-pane>
        <el-tab-pane name="thrid">
          <span slot="label"> <i class="el-icon-set-up"></i> CMDB字典模型管理 </span>
          <tab-cmdb-res v-if="activeName == 'thrid'"></tab-cmdb-res>
        </el-tab-pane>
      </el-tabs>
    </div>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import TabTree from "@/views/cmdb/components/treeManage/tabTree.vue";
import TabPzsx from "@/views/cmdb/components/treeManage/tabPzsx.vue";
import TabCmdbRes from "@/views/cmdb/components/treeManage/tabCmdbRes.vue";

export default {
  components: {TabCmdbRes, TabPzsx, TabTree},
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
