<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="计划编号">
              <el-input placeholder="请输入计划编号" clearable v-model="searchForm.planId" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工单编号">
              <el-input placeholder="请输入工单编号" clearable v-model="searchForm.code" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="巡视类型" prop="type">
              <el-select v-model="searchForm.type" clearable placeholder="请选择巡视类型">
                <el-option v-for="dict in inspectionTypeList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="巡视人" prop="workers">
              <el-input placeholder="请输入巡视人" clearable v-model="searchForm.workers" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作业时间">
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
            <el-form-item label="巡视内容" prop="content">
              <el-input placeholder="请输入巡视内容" clearable v-model="searchForm.content" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工单状态" prop="statusInfo">
              <el-select v-model="searchForm.statusInfo" clearable placeholder="请选择工单状态">
                <el-option v-for="dict in inspectionStatusList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="反馈人" prop="extAttr1">
              <el-input placeholder="请输入反馈人" clearable v-model="searchForm.extAttr1" :maxlength="30" />
            </el-form-item>
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
          <el-col :span="12" align="right">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button style="margin-right: 5px;" type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 0px;" @click="handleAdd">新增</el-button>
      <el-button v-if="permissionList.expBtn" type="primary" style="margin-left: 5px;" @click="handleExport">导出</el-button>
      <el-button v-if="permissionList.delBtn" type="danger" style="margin-left: 5px;" @click="handleDelAll(selectionList)">删除</el-button>
    </div>
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="30" fixed="left" />
        <el-table-column label="计划编号" prop="planId" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.planId">{{ scope.row.planId }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="工单编号" prop="code" width="170" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span @click="handleSee(scope.row)" style="cursor: pointer; color: #59a2fd;">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡视类型" prop="type" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.type, inspectionTypeList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡视人" prop="workers" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="开始时间" prop="startTime" width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="结束时间" prop="finishTime" width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="巡视内容" prop="content" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.content">{{ scope.row.content }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="工单状态" prop="statusInfo" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.statusInfo, inspectionStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="反馈人" prop="extAttr1" width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际完成时间" prop="realFinishTime" width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.realFinishTime? '-' : scope.row.realFinishTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否进入过机房" prop="enterRoom" width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.enterRoom == '1'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="companyName" width="220" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="部门" prop="deptName" width="220" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="填报人" prop="createUserName" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="填报时间" prop="createTime" width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" width="160" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="permissionList.editBtn && scope.row.statusInfo === 1 && scope.row.createUser === userInfo.userId" @click="handleEdit(scope.row)" icon="el-icon-edit">编 辑</el-button>
<!--            <el-button type="text" size="mini" v-if="scope.row.isSubmitRole === 1 && scope.row.statusInfo === 1" @click="submitEvent(scope.row.id)">提 交</el-button>-->
            <el-button v-if="scope.row.isFeedback === 1 && ([3, 5].indexOf(scope.row.statusInfo) >= 0)" type="text" size="mini" @click="handleFeedback(scope.row)" icon="el-icon-thumb">反 馈</el-button>
            <el-button type="text" size="mini" @click="handleSee(scope.row)" icon="el-icon-s-fold">详 情</el-button>
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
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getByPage, delByIds, getListExport, inspectionOrderXlsx} from '../../../../api/xcnanr/inspectionOrder'
import { getDictList } from '@/api/dict'
import ExcelJS from 'exceljs'

export default {
  components: {
    xtTreeLzaySelect, getDictList
  },
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.visitationAdd, false),
        editBtn: this.vaildData(this.permission.visitationEdit, false),
        delBtn: this.vaildData(this.permission.visitationDel, false),
        expBtn: this.vaildData(this.permission.visitationExp, false)
      }
    }
  },
  data() {
    return {
      swerkList: [],
      workOrderParams: {
        isShow: false,
        type: null,
        formDetial: {}
      },
      workOrderSee: {
        isShow: false,
        type: null,
        formDetial: {}
      },
      selectionList: [],
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        planId: null,
        code: null,
        companyId: null,
        type: null,
        statusInfo: null,
        content: null,
        extAttr1: null,
        workers: null,
        workTimes: [], startDate: null, endDate: null,
        createTimes: [], creatStartDate: null, creatEndDate: null
      },
      total: 0,

      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗
      showForm: false,
      showType: '',
      arrtId: '',
      inspectionTypeList:[],
      inspectionStatusList:[]
    }
  },
  mounted() {
    this.setPageContentHeight();
    this.setTableHeight();
    this.getList();
    this.getDictList('info_inspection_plan_type')
    this.getDictList('info_inspection_workOrder_status')
  },
  methods: {
    hasFeedBack(row) {
      // 判断当前登录人员是否是巡视人之一
      let hasAuth = false
      const workers =row.relatedWorkerList
      if(workers instanceof Array){
        const userName = this.userDetail.userName
        // const userId = this.userDetail.userId
        const deptId = this.userDetail.deptId
        // const deptId = this.userDetail.
        const worker =workers.find(worker => worker.departmentId === deptId && worker.userNames === userName)
        if(worker){
          hasAuth = true
        }
      }
      return hasAuth
    },
    // 设置页面内容高度
    //加载字典
    getDictList(code){
      getDictList(code).then(res => {
        if(code==='info_inspection_plan_type'){
          this.inspectionTypeList = res.data
        }else if (code==='info_inspection_workOrder_status'){
          this.inspectionStatusList = res.data
        }
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
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection.map(item => item.id);
    },
    showDictLable(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }
      }
      return code;
    },
    showSwerkLable(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.code == code);
        if (items != null && items.length > 0) {
          return items[0].name;
        }
      }
      return code;
    },
    handleQuery() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getList();
    },
    handleReset() {
      this.searchForm.planId = null
      this.searchForm.code = null
      this.searchForm.content = null
      this.searchForm.extAttr1 = null
      this.searchForm.companyId = undefined;
      this.searchForm.companyName = undefined;
      this.searchForm.type = undefined;
      this.searchForm.statusInfo = undefined;
      this.searchForm.workers = undefined;
      this.searchForm.workTimes = []
      this.searchForm.createTimes = []
      this.getList();
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body');
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
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
      this.tableLoading = true;
      getByPage(this.searchForm).then(res => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 删除
    handleDelAll() {
      if (this.$refs.tableData.selection.length === 0) {
        this.$message.warning("请选择至少一条数据")
        return
      }
      // // 遍历出非待提交状态的工单
      // const selection = this.$refs.tableData.selection
      // const currentUser = this.userDetail.userId
      // const otherList = selection.filter(item => item.statusInfo > 1 || item.createUser !== currentUser)
      // if(otherList instanceof Array && otherList.length > 0){
      //   let codes = otherList.map(item => item.code).join('、')
      //   this.$message.warning('工单['+codes+']不符合删除规则，请重新选择')
      //   return
      // }

      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = this.$refs.tableData.selection.map((item) => {
          return item.id
        }).join(',')
        return delByIds(ids)
      }).then(() => {
        this.getList()
        this.$message({
          type: "success",
          message: "操作成功!"
        })
      })
    },
    // 导出
    handleExport() {
      getListExport(this.searchForm).then(res => {
        // 获取 inspectionOrderXlsx 的键顺序
        const headerKeys = Object.keys(inspectionOrderXlsx);
        // 过滤数据，只保留 repairPlanXlsx 中存在的字段，并按照 inspectionOrderXlsx 的顺序排列

        // 处理字典值
        const modifiedData = res.data.map(item => {
          return {
            ...item,
            statusInfo: this.conversionDict(item.statusInfo, this.inspectionStatusList),
            type: this.conversionDict(item.type, this.inspectionTypeList),
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
        const headers = headerKeys.map(key => inspectionOrderXlsx[key]);
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
          const MAX_COLUMN_WIDTH = 30; // 设置最大列宽为30（可根据需要调整）
          column.eachCell((cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 10
            if (columnLength > maxLength) {
              maxLength = columnLength
            }
          })
          column.width = maxLength < 10 ? 10 : MAX_COLUMN_WIDTH
        })
        // 导出文件
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          // 设置文件名
          a.download = '巡视工单.xlsx'
          a.click()
          window.URL.revokeObjectURL(url)
        })
      })
    },
    closeTags(){
      // 先关闭已经打开过的tab页
      const thisTabId = document.getElementById("tab-/xcnanr/operationOrder/visitation/index")
      const allTabs = thisTabId.parentElement.children
      for (let i = 0; i < allTabs.length; i++) {
        const tab = allTabs[i]
        if (tab.id.indexOf("tab-/xcnanr/inspectWorkOrder") >= 0) {
          document.getElementById(tab.id).childNodes[1].click()
        }
      }
    },
    handleAdd() {
      this.$router.push({
        path: '/xcnanr/inspectWorkOrderAdd/',
        query: {
          type: 'add',
        }
      })
    },
    handleEdit(row) {
      this.closeTags()
      this.$router.push({
        path: '/xcnanr/inspectWorkOrderEdit/',
        query: {
          id: row.id,
          type: 'edit'
        }
      })
    },
    handleFeedback(row){
      this.closeTags()
      this.$router.push({
        path: '/xcnanr/inspectWorkOrderFeedback/',
        query: {
          id: row.id
        }
      })
    },
    handleSee(row) {
      this.closeTags()
      this.$router.push({
        path: '/xcnanr/inspectWorkOrderDetail/',
        query: {
          orderId: row.id
        }
      })
    },
    handleDelete(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return remove(row.id);
      }).then(() => {
        this.selectId = row.parentId;
        this.refreshData();
        this.$message({
          type: "success",
          message: "删除成功!"
        })
      })
    },
    componentSeeClose() {
      this.workOrderSee = {
        isShow: false,
        type: null,
        formDetial: {}
      }
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

/deep/.el-date-editor .el-range__icon{
  line-height: 24px!important;
}
</style>
