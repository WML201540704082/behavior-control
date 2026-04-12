<template>
  <div class="wrap">
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="() => $emit('close')"
      :visible.sync="isShow"
      append-to-body
      title="修改设备"
      width="1200px"
      top="10vh"
      v-el-drag-dialog
    >
      <el-table
          ref="dataTable"
          size="small"
          :data="tableData"
          v-loading="loading"
          height="500px"
          row-key="id"
      >
          <el-table-column type="selection" width="30" fixed="left" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="deviceCategory" label="设备分类" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceType" label="设备类型" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" width="150" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="erpAssetCode" label="ERP资产编码" width="150" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceName" label="设备名称" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceStatus" label="设备状态" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mac" label="MAC地址" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ip" label="IP地址" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sn" label="出厂序列号" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="brand" label="品牌" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceModel" label="型号" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="series" label="系列" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="100" align="center" fixed="right">
          <template  slot-scope="scope">
            <el-button type="text"  size="small" @click="handleSave(scope.row)">选择</el-button>
          </template>
          </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {getDictCmdbList,getCmdbList} from "@/api/dict";
import {mapGetters} from "vuex";

export default {
 props: ['devItemDetail', 'deviceSource', 'isShow'],
  data() {
    return{
      tableData: [],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getCmdbList({receivingPerson: this.devItemDetail.receiveUseName}).then(res => {
        this.tableData = res.data.data
      })
    },
    handleSave(row) {
      this.$emit("setVal", row);
    }
  }
}
</script>
