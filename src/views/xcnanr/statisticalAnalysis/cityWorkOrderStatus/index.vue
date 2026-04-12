<template>
  <basic-container>
    <!-- 地市工单状态统计 查询条件 -->
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="50px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="时间">
              <el-date-picker
                v-model="searchForm.workTimes"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="~"
                style="width: 100%;margin-top: 5px"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司" prop="companyId">
              <xt-tree-lzay-select :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getCompanyItem(v)" />
            </el-form-item>
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" @click="queryEvent" style="margin-right: 5px;">查询</el-button>
            <el-button type="primary" plain @click="resetEvent">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 页面表格 -->
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" row-key="companyid" :tree-props="{ children: 'child' }" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column label="公司" prop="companyName" width="160" align="center" show-overflow-tooltip/>
        <el-table-column label="巡视工单" align="center">
          <el-table-column label="待处理" prop="inspectDaichuliCount" width="160" align="center" show-overflow-tooltip />
          <el-table-column label="进行中" prop="inspectZhixingzhongCount" width="160" align="center" show-overflow-tooltip />
          <el-table-column label="已完成" prop="inspectYiwanchengCount" width="160" align="center" show-overflow-tooltip />
        </el-table-column>
        <el-table-column label="检修工单" align="center">
          <el-table-column label="待处理" prop="repairDaichuliCount" width="160" align="center" show-overflow-tooltip />
          <el-table-column label="进行中" prop="repairJinxingzhongCount" width="160" align="center" show-overflow-tooltip />
          <el-table-column label="已完成" prop="repairYiwanchengCount" width="160" align="center" show-overflow-tooltip />
        </el-table-column>
        <el-table-column label="维修工单" align="center">
          <el-table-column label="待处理" prop="maintanceDaichuliCount" width="160" align="center" show-overflow-tooltip />
          <el-table-column label="进行中" prop="maintanceJinxingzhongCount" width="160" align="center" show-overflow-tooltip />
          <el-table-column label="已完成" prop="maintanceYiwanchengCount" width="160" align="center" show-overflow-tooltip />
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="total" :page.sync="searchForm.pageNumber" :limit.sync="searchForm.pageSize" :pageSizes="[10,20,50,100,200]" @pagination="getList"/>
    </div>
  </basic-container>
</template>

<script>
import { queryOrderStatusCount } from '@/api/xcnanr/statisticalAnalysis'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'

export default {
  name: 'index',
  components: { xtTreeLzaySelect },
  data() {
    return {
      workTimes: [],
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        startDate: undefined,
        endDate: undefined,
        companyId: undefined
      },
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      repairStatusList: [],
      auth: ''
    }
  },
  created() {},
  mounted() {
    this.initSearchForm()
    this.$nextTick(() => {
      // this.setTableHeight()
    })
    this.setPageContentHeight()
    this.getList()
  },
  methods: {
    /**
     * 查询
     */
    queryEvent() {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getList()
    },
    /**
     * 重置
     */
    resetEvent() {
      this.initSearchForm()
      this.getList()
    },
    initSearchForm() {
      this.searchForm = {
        pageNumber: 1,
        pageSize: 10,
        startDate: undefined,
        endDate: undefined,
        companyId: undefined
      }
    },
    getCompanyItem(val) {
      this.searchForm.companyId = val.id
      this.searchForm.companyName = val.fullName
      this.$forceUpdate()
    },
    /**
     * 获取表格数据
     */
    getList() {
      this.tableLoading = true
      this.tableLoading = true
      // 给查询时间段赋值
      if (this.searchForm.workTimes && this.searchForm.workTimes.length > 0) {
        this.searchForm.startDate = this.searchForm.workTimes[0] + ' 00:00:00'
        this.searchForm.endDate = this.searchForm.workTimes[1] + ' 23:59:59'
      } else {
        this.searchForm.startDate = null
        this.searchForm.endDate = null
      }
      queryOrderStatusCount(this.searchForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body');
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    selectionChange(selection) {
      this.selectionList = selection.map(item => item.id)
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

.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
