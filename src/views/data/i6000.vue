<template>
  <basic-container>
    <div class="rootd">
      <el-tabs v-model="activeName">
        <el-tab-pane name="first">
          <span slot="label"> <i class="el-icon-s-operation"></i> 外部资源数据 </span>
          <extemal v-show="activeName == 'first'"></extemal>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label"> <i class="el-icon-set-up"></i> 枚举值 </span>
          <enum v-show="activeName == 'second'"></enum>
        </el-tab-pane>
        <el-tab-pane name="third">
          <span slot="label"> <i class="el-icon-set-up"></i> 部门 </span>
          <unit-dept v-show="activeName == 'third'"></unit-dept>
        </el-tab-pane>
        <el-tab-pane name="fourth">
          <span slot="label"> <i class="el-icon-set-up"></i> 单位 </span>
          <i6000-unit v-show="activeName == 'fourth'"></i6000-unit>
        </el-tab-pane>
      </el-tabs>
    </div>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import Extemal from "@/views/cmdb/extemal.vue";
import Enum from "@/views/data/components/i6000/enum.vue";
import UnitDept from "@/views/data/components/i6000/unitDept.vue";
import I6000Unit from "@/views/data/components/i6000/i6000Unit.vue";

export default {
  components: {UnitDept, Enum, Extemal,I6000Unit},
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
.rootd {
  height: 85vh;
}
</style>
