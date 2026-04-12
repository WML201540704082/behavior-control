<template>
  <div>
    <div class="page_form" style="padding-bottom: 15px">
      <!--      <el-card shadow="always" style="border: 1px solid #d9d6d6 !important;  width: 1100px; margin-bottom: 20px; ">-->
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="5">
            <el-form-item label="设备编号">
              <el-input placeholder="请输入设备编号" clearable v-model="searchForm.deviceCode" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="设备名称">
              <el-input placeholder="请输入设备名称" clearable v-model="searchForm.deviceName" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="工单编号">
              <el-input placeholder="请输入设备编号" clearable v-model="searchForm.maintanceId" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="维修人员">
              <el-input
                placeholder="请输入维修人员"
                clearable
                v-model="searchForm.feedbackPerson"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" align="right">
            <el-button type="primary" @click="handleQuery" style="margin-right: 5px;">查询</el-button>
            <el-button type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!--      </el-card>-->
    </div>
    <div class="page_body">
      <el-table :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading">
        <el-table-column label="设备编号" prop="deviceCode" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备名称" prop="deviceName" width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.deviceName? '-' : scope.row.deviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="工单编号" prop="maintanceId" width="170" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="维修结果" prop="feedContent" min-width="260" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="维修人员" prop="feedbackPerson" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="维修时间" prop="feedbackTime" width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="公司" prop="companyName" min-width="220" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <el-link type="primary" size="mini" :underline="false" @click="handleDetail(scope.row)">
                <span class="s_lt">详情</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.pageNumber"
        :limit.sync="searchForm.pageSize"
        :pageSizes="[10,20,50,100,200]"
        @pagination="getList"/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {getMaintanceRecordPage} from "@/api/xcnanr/record";

export default {
  components: {},
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail'])
  },
  data() {
    return {
      userInfo: this.$store.state.user.userDetail,
      // 查询对象
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗
      detailTitle:"",
      detailDialogVisible: false,
      dialogType:"",
      detailInfo:{},
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body');
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    /**
     * 获取表格数据
     */
    getList() {
      this.tableLoading = true;
      if (this.searchForm.dataTime!==undefined&&this.searchForm.dataTime.length > 0) {
        this.searchForm.startDate = this.searchForm.dataTime[0]
        this.searchForm.endDate = this.searchForm.dataTime[1]
      }
      this.searchForm.companyRegionCode=this.userInfo.regionCode
      getMaintanceRecordPage(this.searchForm).then(res => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    /**
     * 查询触发事件
     */
    handleQuery() {
      // 恢复默认查询对象
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getList()
    },
    /**
     * 重置触发事件
     */
    handleReset() {
      // 恢复默认查询对象
      this.searchForm = {
        pageNumber: 1,
        pageSize: 10,
      }
      // 重新查询
      this.getList()
    },
    /**
     * 处理详情
     * @param row
     */
    handleDetail(row) {
      // 先关闭已经打开过的tab页
      const thisTabId = document.getElementById("tab-/xcnanr/operationOrder/record/index")
      const allTabs = thisTabId.parentElement.children
      for (let i = 0; i < allTabs.length; i++) {
        const tab = allTabs[i]
        if (tab.id.indexOf("tab-/xcnanr/Maintenance") >= 0) {
          document.getElementById(tab.id).childNodes[1].click()
        }
      }

      this.$router.push({
        path: `/xcnanr/MaintenanceDetail`,
        query: {
          id: row.maintanceId,
          type:'Detail'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-link {
  font-size: 13px;
}

.s_lt {
  font-size: 12px;
}
</style>
