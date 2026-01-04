<template>
  <div>
    <!-- 设备备案列表-->
    <el-table ref="optTable" :data="dataList" size="small" height="78vh" stripe="true" v-loading="loading">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="basicDeviceCode" label="设备编码"></el-table-column>
      <el-table-column prop="fiCode" label="备案编号"></el-table-column>
      <el-table-column prop="fiMac" label="备案MAC地址"></el-table-column>
      <el-table-column prop="fiRackNo" label="备案机柜/机架号"></el-table-column>
      <el-table-column prop="status" label="业务状态"></el-table-column>
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleView(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      :total="searchForm.total"
      :page.sync="searchForm.current"
      :limit.sync="searchForm.size"
      @pagination="getHardwareRecordList"
    />
    <!-- 弹窗 -->
    <hardwarebaseRecordDetial
      v-if="showDetail"
      :formDeatil="form"
      :isShow="showDetail"
      @close="showDetail= false"
    ></hardwarebaseRecordDetial>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {getHardwareRecordList, getHardwareRecordDetail} from "@/api/data/hardwareRecord";
import hardwarebaseRecordDetial from "@/views/data/components/hardwarebase/hardwarebaseRecordDetial.vue";

export default {
  components: {hardwarebaseRecordDetial},
  props: ['loading', 'type', 'tableHeight', "keyId", "searchForm"],
  data() {
    return {
      showDetail: false,
      userName: '',
      comment: '',
      form: {},
      dataList: [],
    }
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"])
  },
  mounted() {
    //加载备案信息
    this.getHardwareRecordList()
  },
  methods: {
    //加载设备台账数据源
    async getHardwareRecordList() {
      getHardwareRecordList(this.searchForm.current, this.searchForm.size, this.query).then(res => {
        const data = res.data;
        this.dataList = data.records;
        this.searchForm.total = data.total;
      });
    },
    getHardwareRecordDetail(row) {
      //加载设备详情
      getHardwareRecordDetail(row.recordId).then(res => {
        this.form = res.data
        this.showDetail = true;
      })
    },
    handleView(row) {
      //加载设备详情弹框
      this.form = row;
      this.getHardwareRecordDetail(row);
    },
    handleCheck() {
      //设备合规检查
      this.$message.warning("功能暂未开放");
    },
    getNextInfo() {

    },
  }
}
</script>

