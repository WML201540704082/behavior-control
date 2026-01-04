<template>
  <basic-container>
    <!-- 查询条件 -->
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="90px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="计划编号" prop="planId">
              <el-input  v-model="searchForm.planId" clearable placeholder="请输入计划编号" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工单编号" prop="code">
              <el-input v-model="searchForm.code" clearable placeholder="请输入工单编号" :maxlength="30" />
            </el-form-item>
          </el-col>
          <!-- 检修类别(1：远程作业 2：现场作业）-->
          <el-col :span="6">
            <el-form-item label="检修类别" prop="mode">
              <el-select v-model="searchForm.mode" clearable placeholder="请选择检修类别">
                <el-option v-for="dict in modeOptions" :key="dict.type" :label="dict.label" :value="dict.type" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工作类别" prop="jobCategory">
              <el-select v-model="searchForm.jobCategory" clearable placeholder="请选择检修类别" @change="loadJobTypeOptions">
                <el-option v-for="dict in jobCategoryOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="检修操作人" prop="operator">
                <el-input v-model="searchForm.operator" clearable placeholder="请输入检修操作人" :maxlength="10" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作业时间">
              <el-date-picker
                v-model="searchForm.dataTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="~"
                style="width: 100%"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="终结操作人" prop="operator">
                <el-input v-model="searchForm.feedbackPerson" clearable placeholder="请输入检修操作人" :maxlength="10" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司" prop="companyId">
              <xt-tree-lzay-select  placeholder="请选择公司" :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getOwnerUnit(v,'CORP')" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="填报时间">
              <el-date-picker
                v-model="searchForm.createTimes"
                type="daterange"
                range-separator="~"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="18" align="right">
            <el-button type="primary" @click="queryEvent" style="margin-right: 5px;">查询</el-button>
            <el-button type="primary" plain @click="resetEvent">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 页面表格 -->
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="计划编号" prop="planId" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.planId">{{ scope.row.planId }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="工单编号" prop="code" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检修类型" prop="type" width="90" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.type, typeOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检修类别" prop="mode" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ modeOptions.find(d => d.type === String(scope.row.mode))['label'] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工作类别" prop="jobCategory" min-width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{conversionDict(scope.row.jobCategory, jobCategoryOptions)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="作业类型" prop="jobType" min-width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{showDictLabelByCategory(scope.row.jobCategory, scope.row.jobType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="检修负责人" prop="header" width="100" align="center" show-overflow-tooltip/>
        <el-table-column label="检修操作人" prop="operator" width="160" align="center" show-overflow-tooltip/>
        <el-table-column label="开始时间" prop="startTime" width="140" align="center" show-overflow-tooltip/>
        <el-table-column label="结束时间" prop="finishTime" width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="!scope.row.applyFinishTimeSucc">{{ scope.row.finishTime }}</span>
            <span v-if="scope.row.applyFinishTimeSucc">{{ scope.row.applyFinishTimeSucc }}</span>
            <el-badge v-if="scope.row.chaoshi==='超时'" :value="'超时'" class="item"/>
          </template>
        </el-table-column>
        <el-table-column label="工单状态" prop="statusInfo" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.statusInfo + '' === '3' && scope.row.stateBiangeng + '' === '1'">执行中-变更提交</span>
            <span v-else-if="scope.row.statusInfo + '' === '3' && scope.row.stateBiangeng + '' === '3'">执行中-变更驳回</span>
            <span v-else>{{ conversionDict(scope.row.statusInfo, repairStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="终结操作人" prop="feedbackPerson" width="120" align="center" show-overflow-tooltip/>
        <el-table-column label="实际完成时间" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.actualFinishTime }}
            <el-badge v-if="scope.row.yanshi==='延期'" :value="'延期'" type="warning" class="item"/>
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="companyName" width="220" align="center" show-overflow-tooltip/>
        <el-table-column label="部门" prop="deptName" width="220" align="center" show-overflow-tooltip/>
        <el-table-column label="填报人" prop="createUserName" width="120" align="center" show-overflow-tooltip/>
        <el-table-column label="填报时间" prop="createTime" width="140" align="center" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" width="200" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button v-if="(scope.row.stateBiangeng===1)" type="text" size="mini" @click="approveEvent(scope.row)" icon="el-icon-finished">审 批</el-button>
            <!-- 变更按钮显示：检修工单是执行中、非变更提交（0：未变更，1：变更提交，2：变更同意，3：变更驳回） -->
            <el-button v-if="(scope.row.stateBiangeng !== 1)" type="text" size="mini" @click="changeEvent(scope.row)" icon="el-icon-timer">变 更</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="total" :page.sync="searchForm.pageNumber" :limit.sync="searchForm.pageSize" :pageSizes="[10,20,50,100,200]" @pagination="getList"/>
    </div>
  </basic-container>
</template>

<script>
import {mapGetters} from 'vuex'
import {
  getRepairOrderByPage,
} from '@/api/xcnanr/repairOrder'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import {getDictList} from '@/api/dict'
import {getAll} from "@/api/xcnanr/authorizedPerson"

export default {
  name: 'RepairOrder',
  components: {xtTreeLzaySelect, getDictList},
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail']),
    permissionList() {
      return {}
    }
  },
  data() {
    return {
      exportModalVisible: '',
      exportTitle: '',
      fileInfo: {
        name: '检修工单'
      },
      dialogFlag: false,
      dialogType: '',
      personList: [],
      childDialogForm: {},
      patternOptions: [],
      typeOptions: [],
      jobCategoryOptions: [],
      jobTypeAllOptions: {},
      modeOptions: [
        { type: '1', label: '网络空间作业'},
        { type: '2', label: '机房现场作业'},
        { type: '3', label: '变电站作业'},
        { type: '4', label: '办公场所作业'}
      ],
      orderStateOptions: [],
      authorizedPersonList: [],
      operatorOptions: [{
        dictKey: '1',
        dictValue: '张三'
      }, {
        dictKey: '2',
        dictValue: '李四'
      }],
      statusInfoOptions: [],
      selectionList: [], // 复选框
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        jobCategory: undefined,
        jobType: undefined,
        workTimes: [], startDate: null, endDate: null,
        createTimes: [], creatStartDate: null, creatEndDate: null, feedbackPerson: null, companyId: null, companyName: null
      },
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      repairStatusList: [],
      auth: '', dialogObject: null
    }
  },
  created() {
    this.getDictList('info_repair_plan_pattern')
    this.getDictList('info_repair_plan_type')
    this.getDictList('info_job_category')
    this.getDictList('info_power_air_system')
    this.getDictList('info_cloud_platform_virtual_pool')
    this.getDictList('info_host_storage_device')
    this.getDictList('info_core_network_device')
    this.getDictList('info_safe_device')
    this.getDictList('info_apply_software')
    this.getDictList('info_basic_environment')
    this.getDictList('info_fire_fighting_system')
    this.getDictList('info_cabling_system')
    this.getDictList('info_plan_status')
    this.getDictList('info_repair_workOrder_status')
    this.getAuthorizedPerson()
  },
  mounted() {
    this.setPageContentHeight()
    this.setTableHeight()
    this.getList()
  },
  methods: {
    /**
     * 刷新
     */
    refreshTable() {
      this.getList()
    },
    /**
     * 获取字典
     * @param code
     */
    getDictList(code) {
      //加载字典
      getDictList(code).then(res => {
        if (code === 'info_repair_plan_pattern') {
          this.patternOptions = res.data
        } else if (code === 'info_repair_plan_type') {
          this.typeOptions = res.data
        } else if (code === 'info_job_category') {
          this.jobCategoryOptions = res.data
        } else if (code === 'info_power_air_system') {
          this.jobTypeAllOptions['info_power_air_system'] = res.data
        } else if (code === 'info_cloud_platform_virtual_pool') {
          this.jobTypeAllOptions['info_cloud_platform_virtual_pool'] = res.data
        } else if (code === 'info_host_storage_device') {
          this.jobTypeAllOptions['info_host_storage_device'] = res.data
        } else if (code === 'info_core_network_device') {
          this.jobTypeAllOptions['info_core_network_device'] = res.data
        } else if (code === 'info_safe_device') {
          this.jobTypeAllOptions['info_safe_device'] = res.data
        } else if (code === 'info_apply_software') {
          this.jobTypeAllOptions['info_apply_software'] = res.data
        } else if (code === 'info_basic_environment') {
          this.jobTypeAllOptions['info_basic_environment'] = res.data
        } else if (code === 'info_fire_fighting_system') {
          this.jobTypeAllOptions['info_fire_fighting_system'] = res.data
        } else if (code === 'info_cabling_system') {
          this.jobTypeAllOptions['info_cabling_system'] = res.data
        } else if (code === 'info_plan_status') {
          this.statusInfoOptions = res.data
        } else if (code === 'info_repair_workOrder_status') {
          this.repairStatusList = res.data
        }
      })
    },
    /**
     * 根据工作类别 回显作业类型
     * @param parentCode
     * @param code
     * @returns {*}
     */
    showDictLabelByCategory(parentCode, code) {
      if(parentCode != null && parentCode != '' && this.jobCategoryOptions.length && this.jobCategoryOptions.length > 1) {
        const jobCategoryOption = this.jobCategoryOptions.filter(item => item.dictKey === parentCode)
        if (jobCategoryOption.length <= 0) {
          return code
        }
        const jobTypeAllOption = this.jobTypeAllOptions[jobCategoryOption[0].dictKey]
        if(!jobTypeAllOption || jobTypeAllOption.length === 0) {
          return code
        }
        const jobTypeOption = jobTypeAllOption.filter(item => item.dictKey == code)
        return jobTypeOption.length > 0 ? jobTypeOption[0].dictValue : code
      }
      return code
    },
    /**
     * 审批
     */
    approveEvent(row) {
      this.$router.push({
        path: '/xcnanr/ideal/repairDelay/approve', query: {id: row.id, code: row.code, type: row.type, stateBiangeng: row.stateBiangeng}
      })
    },
    /**
     * 变更
     * @param row
     */
    changeEvent(row) {
      this.$router.push({
        path: '/xcnanr/ideal/repairDelay/change', query: {id: row.id, code: row.code, type: row.type}
      })
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    queryEvent() {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getList()
    },
    /**
     * 被授权人员下拉
     */
    getAuthorizedPerson() {
      getAll({enabled: 1}).then(res => {
        this.authorizedPersonList = res.data
      })
    },
    /**
     * 重置查询表单
     */
    resetEvent() {
      this.searchForm = {
        pageNumber: 1,
        pageSize: 10,
        jobCategory: undefined,
        jobType: undefined,
        workTimes: [], startDate: null, endDate: null,
        createTimes: [], creatStartDate: null, creatEndDate: null, feedbackPerson: null, companyId: null, companyName: null
      }
      this.getList()
    },
    getOwnerUnit(val, type) {
      if (type === 'CORP') {
        //单位
        this.searchForm.companyId = val.id
        this.searchForm.companyName = val.fullName

        //单位更改 部门请初始化
        this.searchForm.departmentId = null;
        this.searchForm.departmentName = null;
      } else if (type === 'DEPT') {
        //部门
        this.searchForm.departmentId = val.id;
        this.searchForm.departmentName = val.fullName;
      }
      this.$forceUpdate()
    },
    /**
     * 获取表格数据
     */
    getList() {
      this.tableLoading = true
      this.searchForm.statusInfo = 3
      getRepairOrderByPage(this.searchForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    /**
     * 字典回显
     * @param code
     * @param dictList
     * @returns {*}
     */
    conversionDict(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code)
        if (items != null && items.length > 0) {
          return items[0].dictValue
        }
      }
      return code
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
/deep/.el-date-editor .el-range__icon{
  line-height: 24px!important;
}
</style>
