<template>
  <basic-container>
    <!-- 人员作业统计 查询条件 -->
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
          <el-col :span="6">
            <el-form-item label="姓名" prop="workerId">
              <el-select v-model="searchForm.workerId" filterable clearable collapse-tags placeholder="请选择人员">
                <el-option v-for="item in operatorOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">
            <el-button type="primary" @click="queryEvent" style="margin-right: 5px;">查询</el-button>
            <el-button type="primary" plain @click="resetEvent">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 页面表格 -->
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column label="姓名" prop="name" align="center" show-overflow-tooltip/>
        <el-table-column label="所属单位" prop="company_name" align="center" show-overflow-tooltip/>
        <el-table-column label="指派工单" align="center">
          <el-table-column label="巡视工单" prop="inspCount" align="center" show-overflow-tooltip />
          <el-table-column label="检修工单" prop="repairCount" align="center" show-overflow-tooltip />
          <el-table-column label="维修工单" prop="mainCount" align="center" show-overflow-tooltip />
        </el-table-column>
        <el-table-column label="完成工单" align="center">
          <el-table-column label="巡视工单" prop="inspWanchengCount" align="center" show-overflow-tooltip />
          <el-table-column label="检修工单" prop="repairWanchengCount" align="center" show-overflow-tooltip />
          <el-table-column label="维修工单" prop="mainWanchengCount" align="center" show-overflow-tooltip />
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="total" :page.sync="searchForm.pageNumber" :limit.sync="searchForm.pageSize" :pageSizes="[10,20,50,100,200]" @pagination="getList"/>
    </div>
  </basic-container>
</template>

<script>
import { queryPersonCount } from '@/api/xcnanr/statisticalAnalysis'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import { getAll } from '@/api/xcnanr/authorizedPerson'

export default {
  name: 'index',
  components: { xtTreeLzaySelect },
  data() {
    return {
      workTimes: [],
      operatorOptions: [],
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        startDate: undefined,
        endDate: undefined,
        companyId: undefined,
        workerId: undefined
      },
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      repairStatusList: [],
      auth: ''
    }
  },
  created() {
    this.getOperatorOptions()
  },
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
     * 被授权人员下拉
     */
    getOperatorOptions(){
      getAll({enabled: 1}).then(res=>{
        this.operatorOptions = res.data
      })
    },
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
        companyId: undefined,
        workerId: undefined
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
      queryPersonCount(this.searchForm).then(res => {
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
