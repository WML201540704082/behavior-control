<template>
  <div class="xt-layout page_body">
    <div class="xt-layout-content" style="height: 84vh; padding: 0px 0px 0px 20px;overflow: hidden">
      <el-form :model="queryParams" label-suffix=":" label-width="auto" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="成本中心编码">
              <el-input v-model="queryParams.kostl" placeholder="请输入编码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="成本中心描述">
              <el-input v-model="queryParams.kostlT" placeholder="请输入描述" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="成本中心状态">
              <el-select v-model="queryParams.koslStatus" placeholder="请选择状态" clearable>
                <el-option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" class="d_end">
            <div>
              <el-button type="primary" plain size="small" @click="getList">查 询</el-button>
              <el-button type="success" plain size="small" @click="reset">重 置</el-button>
              <el-button type="danger" plain size="small" :loading="tbloading" @click="handelRefresh()">同 步</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 设备列表 -->
      <el-table ref="table" :data="tableData" stripe border size="small" height="68vh" v-loading="tableloading">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column width="50" type="index" :index="Nindex" label="序号" align="center"></el-table-column>
        <el-table-column label="成本中心编码" prop="kostl" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="成本中心描述" prop="kostlT" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="成本中心状态" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span :style="{color:getStatusColor(scope.row.koslStatus)}">{{ getStatusName(scope.row.koslStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="维护工厂" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ getSwerkName(scope.row.swerk) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleDetial(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination :total="page.total" :page.sync="page.currentPage" :limit.sync="page.pageSize" @pagination="getList"/>
    </div>

    <swerk-refresh v-if="showSync"
                   :isShow="showSync"
                   @close="showSync = false"
                   @submit="getRefresh">

    </swerk-refresh>
    <cbdetial v-if="showDetial"
              :isShow="showDetial"
              :erpUnits="erpUnits"
              @close="showDetial = false"
              :fromValue="fromValue">
    </cbdetial>
  </div>
</template>

<script>

import {getList, refresh} from "@/api/data/erp/cbcenter";
import {erpUnitList} from "@/api/system/dept";
import SwerkRefresh from "@/views/data/components/erp/components/swerkRefresh.vue";
import projectRefresh from "@/views/assets/components/projectManage/projectRefresh.vue";
import Cbdetial from "@/views/data/components/erp/components/cbdetial.vue";
//成本中心页面
export default {
  name: 'chengben_center',
  components: {Cbdetial, projectRefresh, SwerkRefresh},
  data() {
    return {
      tbloading: false,
      tableloading: false,
      queryParams: {},
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
      tableData: null,

      erpUnits: null,

      showSync: false,
      statusList: null,

      showDetial: false,
      fromValue: null,
    };
  },
  mounted() {
    this.page = {currentPage: 1, pageSize: 20, total: 0,};
    this.getDict();
    this.getList();
  },
  methods: {
    // 字典
    getDict() {
      erpUnitList().then(res => {
        this.erpUnits = res.data;
      });

      this.statusList = [{
        name: '正常',
        code: 0
      }, {
        name: '异常',
        code: -1
      },];
    },
    getList() {
      this.tableloading = true;
      getList(this.page.currentPage, this.page.pageSize, this.queryParams).then(res => {
        const data = res.data;
        this.page.total = data.total;
        this.tableData = data.records;
        this.tableloading = false;
      });
    },
    handelRefresh() {
      this.showSync = true;
    },
    handleDetial(row) {
      this.fromValue = row;
      this.showDetial = true;
    },
    getRefresh(arg) {
      this.showSync = false;
      this.tbloading = true;
      refresh({swerk: arg.swerk}).then(res => {
        this.getList();
        this.$message.success('同步成功');
      }).finally(() => {
        this.tbloading = false;
      });
    },
    Nindex(index) {
      return index + 1 + (this.page.currentPage - 1) * this.page.pageSize;
    },
    reset() {
      this.queryParams = {};
      this.page = {currentPage: 1, pageSize: 20, total: 0,};
      this.getList();
    },
    getSwerkName(swerk) {
      if (swerk && this.erpUnits) {
        let fItem = this.erpUnits.find(a => a.code == swerk);
        if (fItem) {
          return fItem.name;
        }
      }
      return null;
    },
    getStatusColor(status) {
      if (status == '0') {
        return '#229241';
      }
      return '#E63E31'
    },
    getStatusName(status) {
      if (status == '0') {
        return '正常';
      }
      return '异常'
    },
  },
}
</script>
<style scoped lang="scss">
.d_stext {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.d_stext span {
  font-size: 14px;
  color: #666666;
}

.d_sb {
  display: flex;
  justify-content: space-between;
}

.d_end {
  display: flex;
  justify-content: flex-end;
}
</style>
