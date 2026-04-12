<template>
  <basic-container>
    <!-- 查询条件 -->
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="130px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="计划编号" prop="code">
              <el-input v-model="searchForm.code" clearable placeholder="请输入计划编号" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司" prop="companyId">
              <xt-tree-lzay-select :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getCompanyItem(v)" />
            </el-form-item>
          </el-col>
          <!-- 计划类型(1：临时计划 2：周计划 3：月计划) -->
          <el-col :span="6">
            <el-form-item label="计划类型" props="pattern">
              <el-select v-model="searchForm.pattern" filterable clearable placeholder="请选择计划类型">
                <el-option v-for="dict in patternOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 检修类型(1：常规检修2：i6000检修)-->
          <el-col :span="6">
            <el-form-item label="检修类型" props="type">
              <el-select v-model="searchForm.type" filterable clearable placeholder="请选择检修类型">
                <el-option v-for="item in typeOptions" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 检修类别(1：远程作业 2：现场作业）-->
          <el-col :span="6">
            <el-form-item label="检修类别" prop="mode">
              <el-select v-model="searchForm.mode" clearable placeholder="请选择检修类别">
                <el-option v-for="dict in modeOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
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
            <el-form-item label="作业类型" prop="jobType">
              <el-select v-model="searchForm.jobType" clearable placeholder="请选择作业类型">
                <el-option v-for="dict in jobTypeAllOptions[searchForm.jobCategory]" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检修操作人" prop="operator">
              <el-select v-model="searchForm.operator" filterable clearable placeholder="请选择检修操作人">
                <el-option v-for="item in operatorOptions" :key="item.name" :label="item.name + ' / ' + item.companyName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 计划状态（1：已提交，2：待提交，3：已启动，4：已停止） -->
          <el-col :span="6">
            <el-form-item label="计划状态" props="statusInfo">
              <el-select v-model="searchForm.statusInfo" filterable clearable placeholder="请选择计划状态">
                <el-option v-for="dict in statusInfoOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作业时间范围">
              <el-date-picker
                v-model="searchForm.workTimes"
                type="daterange"
                range-separator="~"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="填报时间范围">
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
          <el-col :span="6" style="margin-top: 0px;" align="right">
            <!-- 查询按钮 -->
            <el-button type="primary" @click="queryEvent">查询</el-button>
            <el-button style="margin-left: 5px" type="primary" plain @click="resetEvent">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="table_btn">
        <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 5px" @click="redirectEvent('新增', 'add', null, null, null)">新增</el-button>
        <el-button v-if="permissionList.delBtn" type="danger" style="margin-left: 5px" @click="delAllEvent">删除</el-button>
        <el-button v-if="permissionList.stopBtn" type="primary" style="margin-left: 5px;" @click="handleStop(selectionList)">停止</el-button>
        <el-button v-if="permissionList.expBtn" type="primary" style="margin-left: 5px;" @click="handleExport">导出</el-button>
        <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 5px;" @click="handleCopyFunc">复制</el-button>
      </div>
    </div>
    <!-- 页面表格 -->
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange" @cell-dblclick="doubleCellFunc">
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="计划编号" prop="code" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span @click="redirectEvent('编辑', 'detail', null, scope.row.code, null)" style="cursor: pointer; color: #59a2fd;">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划类型" prop="pattern" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.pattern, patternOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检修类型" prop="type" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.type, typeOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检修类别" prop="mode" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="parseInt(scope.row.mode) > 0">{{ conversionDict(scope.row.mode, modeOptions) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="工作类别" prop="jobCategory" width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{conversionDict(scope.row.jobCategory, jobCategoryOptions)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="作业类型" prop="jobType" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{showDictLabelByCategory(scope.row.jobCategory, scope.row.jobType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="检修负责人" prop="header" width="130" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.header !== ''">{{ scope.row.header }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="检修操作人" prop="operator" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.operator !== ''">{{ scope.row.operator }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" width="140" align="center" show-overflow-tooltip />
        <el-table-column label="完成时间" prop="finishTime" width="140" align="center" show-overflow-tooltip />
        <el-table-column label="检修内容" prop="content" width="200" align="center" show-overflow-tooltip />
        <el-table-column label="公司" prop="companyName" width="220" align="center" show-overflow-tooltip />
        <el-table-column label="部门" prop="deptName" width="220" align="center" show-overflow-tooltip />
        <el-table-column label="计划状态" prop="statusInfo" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.statusInfo, statusInfoOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="填报人" prop="createUserName" width="120" align="center" show-overflow-tooltip />
        <el-table-column label="填报时间" prop="createTime" width="140" align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="192" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="permissionList.editBtn && scope.row.statusInfo === 1&& (scope.row.createUser === userDetail.userId)  " @click="redirectEvent('编辑', 'add', null, scope.row.code, null)" icon="el-icon-edit">编 辑</el-button>
            <el-button type="text" size="mini" v-if="scope.row.statusInfo === 2 && scope.row.shenhe === 'yes'" @click="redirectEvent('审批', 'approve', scope.row.id, scope.row.code,'2')" icon="el-icon-finished">审 批</el-button>
            <el-button type="text" size="mini" @click="redirectEvent('详情', 'detail', null, scope.row.code, null)" icon="el-icon-s-fold">详 情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="total" :page.sync="searchForm.pageNumber" :limit.sync="searchForm.pageSize" :pageSizes="[10, 20, 50, 100, 200]" @pagination="getList"/>
    </div>
  </basic-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { getByPage, submit, dellByIds, stopByIds,repairPlanXlsx,getListExport, copyApi } from '../../../../api/xcnanr/repairPlan'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import { getDictList } from '@/api/dict'
import { getAll } from '@/api/xcnanr/authorizedPerson'
import ExcelJS from 'exceljs'

export default {
  name: 'RepairPlan',
  components: { xtTreeLzaySelect, getDictList },
  data() {
    return {
      dialogFlag: false,
      dialogType: '',
      childDialogForm: {},
      patternOptions: [],
      typeOptions: [],
      jobCategoryOptions: [],
      jobTypeAllOptions: {},
      modeOptions: [],
      operatorOptions: [],
      statusInfoOptions: [],
      selectionList: [], // 复选框
      searchForm: {},
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false
    }
  },
  computed: {
    ...mapGetters(['userDetail', 'permission']),
    ...mapState({ userDetail: state => state.user.userDetail }),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.repairPlanAdd, false),
        editBtn: this.vaildData(this.permission.repairPlanEdit, false),
        delBtn: this.vaildData(this.permission.repairPlanDel, false),
        expBtn: this.vaildData(this.permission.repairPlanExp, false),
        stopBtn: this.vaildData(this.permission.repairPlanStop, false)
      }
    }
  },
  created() {
    this.getDictList('info_repair_plan_pattern')
    this.getDictList('info_repair_plan_type')
    this.getDictList('info_repair_plan_mode')
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
    this.getOperatorOptions()
  },
  mounted() {
    this.initSearchForm()
    this.$nextTick(() => {
      this.setTableHeight()
    })
    this.setPageContentHeight()
    this.getList()
  },
  methods: {
    initSearchForm() {
      this.searchForm = {
        companyId: undefined,
        companyName: undefined,
        pageNumber: 1,
        pageSize: 10,
        jobCategory: undefined,
        jobType: undefined,
        workTimes: [], startDate: null, endDate: null,
        createTimes: [], creatStartDate: null, creatEndDate: null
      }
    },
    getDictList(code){
      //加载字典
      getDictList(code).then(res => {
        if(code==='info_repair_plan_pattern'){
          this.patternOptions = res.data
        } else if(code==='info_repair_plan_type'){
          this.typeOptions = res.data
        } else if(code==='info_repair_plan_mode'){
          this.modeOptions = res.data
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
        } else if(code==='info_plan_status'){
          this.statusInfoOptions = res.data
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
     * 切换工作类别
     */
    loadJobTypeOptions() {
      this.$set(this.searchForm, 'jobType', '')
    },
    getCompanyItem(val) {
      this.searchForm.companyId = val.id
      this.searchForm.companyName = val.fullName
      this.$forceUpdate();
    },
    /**
     * 操作栏 发起流程
     */
    submitEvent(data) {
      let deviceRecordDto = { id: data.id, filingNo: data.code, processDefinitionKey: 'bpm_jxjh', approvalOpinion: '发起检修计划', type: 'JXJH' }
      this.$confirm("确定开始发起检修计划的流程引擎吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        console.log(deviceRecordDto, 'deviceRecordDto+++')
        return submit(deviceRecordDto)
      }).then(() => {
        this.getList()
        this.$message({
          type: "success",
          message: "操作成功!"
        })
      })
    },
    // 跳子页面
    redirectEvent(title, suffixName, id, code, type) {
      const path = `/xcnanr/ideal/repairPlan/${ suffixName }`

      // 再重新打开tab页
      this.$router.push({
        path: path,
        query: { title, id, code, type }
      })
    },
    // 终止
    handleStop(row) {
      console.log(row)
      if (this.$refs.tableData.selection.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      const equalObj = this.tableData.filter(item=>row.includes(item.id)).filter(item=>item.statusInfo === 5)
      if (equalObj.length > 0){
        this.$message.warning("选择数据中存在【已停止】状态数据，请检查后重试！");
        return;
      }
      let ids = []
      let codes = []
      this.selectionList.forEach(item=>{
        const plan = this.tableData.find(data=> data.id === item)
        ids.push(plan.id)
        codes.push(plan.code)
      })
      this.$confirm('是否终止计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ids = ids.join(',')
        codes = codes.join(',')
        stopByIds(ids,codes).then(() => {
          this.$message({
            type: 'success',
            message: '终止成功！'
          });
          this.getList()
        })
      })
    },
    // 导出
    handleExport() {
      getListExport(this.searchForm).then(res => {
        // 获取 repairPlanXlsx 的键顺序
        const headerKeys = Object.keys(repairPlanXlsx);
        // 过滤数据，只保留 repairPlanXlsx 中存在的字段，并按照 repairPlanXlsx 的顺序排列

        // 处理字典值
        const modifiedData = res.data.map(item => {
          return {
            ...item,
            statusInfo: this.conversionDict(item.statusInfo, this.statusInfoOptions),
            type: this.conversionDict(item.type, this.typeOptions),
            pattern: this.conversionDict(item.pattern, this.patternOptions)
          }
        })

        const filteredData = modifiedData.map(item => {
          const filteredItem = {}
          headerKeys.forEach(key => {
            if (item.hasOwnProperty(key)) {
              filteredItem[key] = item[key]
            }
          })
          return filteredItem
        })
        // 创建工作簿和工作表
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Sheet1')
        // 添加表头
        const headers = headerKeys.map(key => repairPlanXlsx[key])
        worksheet.addRow(headers)
        // 添加数据行
        filteredData.forEach(row => {
          worksheet.addRow(Object.values(row))
        })
        // 设置表头样式
        const headerRow = worksheet.getRow(1)
        headerRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFDDDDDD' }
          }
          cell.font = {
            bold: true,
            color: { argb: 'FF000000' }
          }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        })

        // 设置数据行样式
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) { // 跳过表头行
            row.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              }
              cell.alignment = { horizontal: 'center', vertical: 'middle' }
            })
          }
        })
        // 自动调整列宽
        worksheet.columns.forEach(column => {
          let maxLength = 0
          column.eachCell((cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 10
            if (columnLength > maxLength) {
              maxLength = columnLength
            }
          })
          column.width = maxLength < 10 ? 10 : maxLength
        })
        // 导出文件
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          // 设置文件名
          a.download = '检修计划.xlsx'
          a.click()
          window.URL.revokeObjectURL(url)
        })
      })
    },
    delAllEvent() {
      if (this.$refs.tableData.selection.length === 0) {
        this.$message.warning("请选择至少一条数据")
        return
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = this.$refs.tableData.selection.map((item) => {
          return item.id
        }).join(',')
        return dellByIds(ids)
      }).then(() => {
        this.getList()
        this.$message({
          type: "success",
          message: "操作成功!"
        })
      })
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body');
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    selectionChange(selection) {
      this.selectionList = selection.map(item => item.id)
    },
    doubleCellFunc(row, column, cell, event) {
      this.redirectEvent('编辑', 'detail', null, row.code, null)
    },
    queryEvent() {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getList()
    },
    resetEvent() {
      this.initSearchForm()
      this.getList()
    },
    getList() {
      // 给查询时间段赋值
      if (this.searchForm.workTimes && this.searchForm.workTimes.length > 0) {
        this.searchForm.startDate = this.searchForm.workTimes[0] + ' 00:00:00'
        this.searchForm.endDate = this.searchForm.workTimes[1] + ' 23:59:59'
      } else {
        this.searchForm.startDate = null
        this.searchForm.endDate = null
      }
      if (this.searchForm.createTimes && this.searchForm.createTimes.length > 0) {
        this.searchForm.creatStartDate = this.searchForm.createTimes[0] + ' 00:00:00'
        this.searchForm.creatEndDate = this.searchForm.createTimes[1] + ' 23:59:59'
      } else {
        this.searchForm.creatStartDate = null
        this.searchForm.creatEndDate = null
      }
      this.tableLoading = true
      getByPage(this.searchForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    /**
     * 被授权人员下拉
     */
    getOperatorOptions(){
      getAll({enabled: 1}).then(res=>{
        this.operatorOptions = res.data
      })
    },
    conversionDict(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code)
        if (items != null && items.length > 0) {
          return items[0].dictValue
        }
      }
      return code
    },
    handleCopyFunc() {
      if (this.$refs.tableData.selection.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm(`已选择${this.$refs.tableData.selection.length}条数据, 确定要复制吗?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const ids = this.$refs.tableData.selection.map((item) => {
          return item.id
        }).join(',')
        copyApi({ids}).then(res => {
          this.$message({
            type: "success",
            message: "操作成功!"
          })
          this.getList()
        })
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
.table_btn {
  margin-left: -5px;
}
/deep/.el-date-editor .el-range__icon{
  line-height: 24px!important;
}
</style>
