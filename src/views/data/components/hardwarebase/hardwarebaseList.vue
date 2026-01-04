<template>
  <div>
    <!-- 设备台账列表-->
    <el-table
      ref="optTable"
      :data="dataList"
      size="small"
      height="78vh"
      stripe="true"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="basicDeviceCode" label="设备编码" width="150"></el-table-column>
      <el-table-column prop="basicDeviceName" label="设备名称" width="150"></el-table-column>
      <el-table-column prop="basicDeviceClass" label="设备分类" width="120"></el-table-column>
      <el-table-column prop="basicDeviceType" label="设备类型" width="120"></el-table-column>
      <el-table-column prop="basicSgccCode" label="国网编号" width="120"></el-table-column>
      <el-table-column prop="basicUsage" label="用途" width="120"></el-table-column>
      <el-table-column prop="appMac" label="MAC地址" width="120"></el-table-column>
      <el-table-column prop="appIp" label="IP" width="120"></el-table-column>
      <el-table-column prop="basicUnitFirst" label="一级单位" width="150"></el-table-column>
      <el-table-column prop="basicUnitSecond" label="二级单位" width="150"></el-table-column>
      <el-table-column prop="basicUnitThird" label="三级单位" width="150"></el-table-column>
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template  slot-scope="scope">
          <el-button type="text"  size="small" @click="handleView(scope.row)">详情</el-button>
          <el-button type="text"  size="small" @click="handleCheck(scope.row)">合规查验</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      :total="searchForm.total"
      :page.sync="searchForm.current"
      :limit.sync="searchForm.size"
      @pagination="getHardwareList"
    />
    <!-- 弹窗 -->
    <hardwarebaseDetail
      v-if="showDetail"
      :formDeatil="form"
      :isShow="showDetail"
      @close="showDetail= false"
    ></hardwarebaseDetail>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {getHardwareDetail, getHardwareList} from "@/api/data/hardwarebasic";
import hardwarebaseDetail from "@/views/data/components/hardwarebase/hardwarebaseDetail.vue";

export default {
  components: {hardwarebaseDetail},
  props: ['loading','type','tableHeight',"keyId","searchForm"],
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
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    if (this.type === 'o_hardware_basic' || this.type ==="hardwarebaseList") {
      //加载设备数据源
      this.getHardwareList()
    }else{
      //加载设备数据源
      this.getHardwareList()
    }
  },
  methods: {
    //加载设备台账数据源
    async getHardwareList() {
      getHardwareList(this.searchForm.current, this.searchForm.size, this.query).then(res => {
        const data = res.data;
        this.dataList = data.records;
        this.searchForm.total = data.total;
      });
    },
    getHardwareDetail(row){
      //加载设备详情
      getHardwareDetail(row.dthbId).then(res => {
        this.form = res.data
        this.showDetail = true;
      })
    },
    handleView(row){
      //加载设备详情弹框
      this.form = row;
      this.getHardwareDetail(row);
    },
    handleCheck(){
      //设备合规检查
      this.$message.warning("功能暂未开放");
    },
    getNextInfo() {

    },
  }
}
</script>

