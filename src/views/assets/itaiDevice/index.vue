<template>
  <!--  信创设备库-->
  <div class="page_body" style="position:relative;">
    <el-tabs v-model="activeName">

      <el-tab-pane name="first">
        <span slot="label"> <i class="el-icon-s-operation"></i> 信创概览 </span>
        <div class="d_content">
          <data-statis ref="dataStatis" ></data-statis>
        </div>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label"> <i class="el-icon-set-up"></i> 信创台账 </span>
        <div class="d_content">
          <itai-list ref="itaiList" v-if="showDataStatis"></itai-list>
        </div>
      </el-tab-pane>
      <el-tab-pane name="third">
        <span slot="label"> <i class="el-icon-s-data"></i> 信创设备分析统计 </span>
        <div class="d_content">
          <data-statis2 ref="dataStatis" v-if="showDataStatis2"></data-statis2>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div style="position: absolute;right: 12px;top:0px;" v-if="activeName == 'first'">
      <el-button type="primary" plain @click="dataStatisRefresh">刷新</el-button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ItaiList from "../components/itaiDevice/itaiList.vue";
import DataStatis from "../components/itaiDevice/dataStatis.vue";
import DataStatis2 from "../components/itaiDevice/dataStatis2.vue";

export default {
  components: {DataStatis, ItaiList, DataStatis2},
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail'])
  },
  props: {},
  data() {
    return {
      activeName: 'first',
      showDataStatis: false,
      showDataStatis2: false,
      isShengComp: false,
    }
  },
  watch: {
    'activeName'(newVal, oldVal) {
      if (newVal === 'second') {
        if (!this.showDataStatis) {
          this.showDataStatis = true;
        }
      }

      if (newVal === 'third') {
        if (!this.showDataStatis2) {
          this.showDataStatis2 = true;
        }
      }
    }
  },
  mounted() {
    if (this.userDetail.regionCode == '37') {
      //省公司
      this.isShengComp = true;
    } else {
      //市县公司、单位
      this.isShengComp = false;
    }
  },
  methods: {
    dataStatisRefresh() {
      this.$refs.dataStatis.initData();
    },
  }
}
</script>

<style lang="scss" scoped>
.page_body {
  height: 87vh;
  padding: 0px 12px 12px 12px;
}

/deep/ .el-progress__text {
  white-space: pre;
}

.d_content {
  background-color: #F0F2F5;
  height: calc(87vh - 58px);
}


</style>
