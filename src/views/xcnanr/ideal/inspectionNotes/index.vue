<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="110px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="巡视场所/设备" prop="objectName">
              <el-input placeholder="请输入巡视场所/设备" clearable v-model="searchForm.objectName" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="反馈人" prop="feedbackPerson">
              <el-input placeholder="请输入反馈人" clearable v-model="searchForm.feedbackPerson" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工单编号">
              <el-input placeholder="请输入工单编号" clearable v-model="searchForm.inspectionCode" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">
            <el-button type="primary" @click="handleQuery" style="margin-right: 5px;">查询</el-button>
            <el-button type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!--      </el-card>-->
    </div>
    <div class="page_body">
      <el-table :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading">
        <el-table-column label="巡视场所/设备" prop="objectName" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="巡视配置项" prop="configName" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="巡视项" prop="configDetailName" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="反馈人" prop="feedbackPerson" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="反馈结果" prop="solveStatus" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.solveStatus === 0" type="success">正常</el-tag>
            <el-tag v-else-if="scope.row.solveStatus === 2" type="warning">缺陷已解决</el-tag>
            <el-tag v-else type="danger">缺陷未解决</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="反馈描述" prop="feedbackContent" min-width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.feedbackContent? '-' : scope.row.feedbackContent}}</span>
          </template>
        </el-table-column>
        <el-table-column label="缺陷设备" prop="deviceName" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.deviceName? '-' : scope.row.deviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="工单编号" prop="inspectionCode" width="170" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="巡视类型" prop="type" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.type, inspectionTypeList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡视内容" prop="inspectionContent" min-width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.inspectionContent? '-' : scope.row.inspectionContent}}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡视开始时间" prop="startTime" width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际结束时间" prop="finishTime" width="140" align="center" show-overflow-tooltip></el-table-column>
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
  </basic-container>
</template>

<script>
  import {mapGetters} from "vuex";
  import {getInspectionRecordPage} from "@/api/xcnanr/record";
  import { getDictList } from '@/api/dict'

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
        detailTitle: "",
        detailDialogVisible: false,
        dialogType: "",
        detailInfo: {},
        inspectionTypeList: [],
      }
    },
    created() {
      getDictList('info_inspection_plan_type').then(res => {
        this.inspectionTypeList = res.data
      })
    },
    mounted() {
      this.getList();
    },
    methods: {
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
        getInspectionRecordPage(this.searchForm).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      /**
       * 查询触发事件
       */
      handleQuery() {
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
          if (tab.id.indexOf("tab-/xcnanr/inspectWorkOrderDetail") >= 0) {
            document.getElementById(tab.id).childNodes[1].click()
          }
        }
        this.$router.push({
          path: '/xcnanr/inspectWorkOrderDetail', query: { orderId: row.inspectionId }
        })
      },
      //字典回显
      conversionDict(code, dictList) {
        if (dictList != null && code !== '') {
          let items = dictList.filter(item => item.dictKey == code)
          if (items != null && items.length > 0) {
            return items[0].dictValue
          }
        }
        return code
      },
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
