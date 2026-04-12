<template>
  <basic-container>
    <!-- 查询条件 -->
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="计划编号" prop="no">
              <el-input placeholder="请输入计划编号" clearable v-model="searchForm.no" :maxlength="30"  />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="巡视类型" props="type">
              <el-select v-model="searchForm.type" clearable placeholder="请选择巡视类型">
                <el-option
                  v-for="dict in inspectionTypeList"
                  :key="dict.dictKey"
                  :label="dict.dictValue"
                  :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="巡视类别" prop="category">
              <el-select v-model="searchForm.category" clearable placeholder="请选择巡视类别">
                <el-option
                  v-for="dict in inspectionCategoryList"
                  :key="dict.dictKey"
                  :label="dict.dictValue"
                  :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司" prop="companyId">
              <xt-tree-lzay-select  placeholder="请选择公司" :formValue="searchForm.companyName"
                                    :selectType="'CORP'"
                                    @getTreeItem="(v)=>getOwnerUnit(v,'CORP')">
              </xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计划状态" prop="statusInfo">
              <el-select v-model="searchForm.statusInfo" clearable placeholder="请选择计划状态">
                <el-option
                  v-for="dict in inspectionStatusList"
                  :key="dict.dictKey"
                  :label="dict.dictValue"
                  :value="dict.dictKey">
                </el-option>
              </el-select>
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
          <!-- 查询按钮 -->
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button style="margin-left: 5px;" type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="table_btn">
        <el-button type="primary" style="margin-left: 5px;" @click="handleAdd">新增</el-button>
        <el-button type="primary" style="margin-left: 5px;" @click="handleStart(selectionList)">启动</el-button>
        <el-button type="primary" style="margin-left: 5px;" @click="handleSuspend(selectionList)">暂停</el-button>
        <el-button type="primary" style="margin-left: 5px;" @click="handleStop(selectionList)">停止</el-button>
        <el-button type="danger" style="margin-left: 5px;" @click="handleDelAll(selectionList)">删除</el-button>
        <el-button type="primary" style="margin-left: 5px;" @click="handleExport">导出</el-button>
      </div>
    </div>
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange" @cell-dblclick="doubleCellFunc">
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="计划编号" prop="no" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span @click="handleSee(scope.row)" style="cursor: pointer; color: #59a2fd;">{{ scope.row.no }}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡视类型" prop="type" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.type + '', inspectionTypeList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡视类别" prop="category" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.category + '', inspectionCategoryList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡视周期" prop="periodText" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="巡视对象" prop="objects" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="公司" prop="companyName" min-width="220" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="部门" prop="departmentName" width="220" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="填报人" prop="createUserName" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="计划状态" prop="statusInfo" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.statusInfo + '', inspectionStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="填报时间" prop="createTime" width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.updateTime ? '-' : scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" width="150" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="permissionList.editBtn && (scope.row.statusInfo === 1 && scope.row.createUser === userDetail.userId)" @click="handleEdit(scope.row)" icon="el-icon-edit">编 辑</el-button>
            <el-button type="text" size="mini" v-if="displayApprovalFunc(scope.row)" @click="handleApproval(scope.row)" icon="el-icon-finished">审 批</el-button>
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
import {mapGetters} from 'vuex'
import {getDictList} from '@/api/dict'
import {
  delByIds,
  getAllInfoInspectionPlan,
  getByPage,
  inspectionPlanXlsx,
  pauseBatchInspection,
  startBatchInspection,
  stopBatchInspection
} from '@/api/xcnanr/inspectionPlan'
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue"
import {exportColumnLine} from '@/api/xcnanr/export/exportInspectionPlan.js'
import ExcelJS from 'exceljs'

export default {
    name: 'InspectionPlan',
    components: {
      xtTreeLzaySelect, getDictList
    },
    computed: {
      ...mapGetters(["permission", "userInfo", 'userDetail']),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.inspectionPlanAdd, false),
          editBtn: this.vaildData(this.permission.inspectionPlanEdit, false),
          delBtn: this.vaildData(this.permission.inspectionPlanDel, false),
          expBtn: this.vaildData(this.permission.inspectionPlanExp, false),
          startBtn: this.vaildData(this.permission.inspectionPlanStop, false),
          pauseBtn: this.vaildData(this.permission.inspectionPlanPause, false),
          stopBtn: this.vaildData(this.permission.inspectionPlanStop, false)
        }
      }
    },
    data() {
      return {
        /*导出汇总相关变量*/
        exportModalVisible: false,
        loadingExport: true,
        exportColumns: exportColumnLine,
        chooseColumns: [],
        filename: "巡视计划统计",
        exportTitle: "确认导出",
        exportType: "",
        exportData: [],
        disabled: false,
        // 常规
        type: '',
        inspectionTypeList:[],
        inspectionCategoryList:[],
        inspectionStatusList:[],
        workOrderParams: {
          isShow: false,
          type: null,
          formDetail: {}
        },
        selectionList: [],
        searchForm: {
          pageNumber: 1,
          pageSize: 10,
          no: null,
          type: null,
          category: null,
          companyId: null,
          statusInfo: null,
          createTimes: [],
          creatStartDate: null,
          creatEndDate: null
        },
        total: 0,
        // 是否具备审批权限（也就是班长或专工角色）
        hasApprovalPerm: false,
        tableData: [],
        tableHeight: undefined,
        tableLoading: false,
        // 弹窗
        // showForm: false,
        // showType: '',
        arrtId: ''
      }
    },
    mounted() {
      // 先判断一下当前登录人员的角色是否有班长或专工角色，是否具备审批该计划的权限
      if (this.userDetail.roleAlias.length > 0) {
        const roleArr = this.userDetail.roleAlias.split(",");
        for (const roleAlia of roleArr) {
          if (roleAlia.indexOf("operation_monitor") >= 0 || roleAlia.indexOf("run_engineer") >= 0) {
            this.hasApprovalPerm = true
          }
        }
      }
      this.setPageContentHeight();
      this.setTableHeight();
      this.getList();
      this.getDictList('info_inspection_plan_type')
      this.getDictList('info_inspection_plan_category')
      this.getDictList('info_inspection_plan_status')
    },
    methods: {
      //加载字典
      getDictList(code){
        getDictList(code).then(res => {
          if(code==='info_inspection_plan_type'){
            this.inspectionTypeList = res.data
          }else if (code==='info_inspection_plan_category'){
            this.inspectionCategoryList = res.data
          }else if (code==='info_inspection_plan_status'){
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
        }
        this.$forceUpdate()
      },
      closeTags(){
        // 先关闭已经打开过的tab页
        const thisTabId = document.getElementById("tab-/xcnanr/operationPlan/inspectionPlan/index")
        const allTabs = thisTabId.parentElement.children
        for (let i = 0; i < allTabs.length; i++) {
          const tab = allTabs[i]
          if (tab.id.indexOf("tab-/xcnanr/inspectPlan") >= 0) {
            document.getElementById(tab.id).childNodes[1].click()
          }
        }
      },
      handleAdd() {
        this.$router.push({
          path: '/xcnanr/ideal/inspectionPlan/add',
          query: {
            type: 'Add',
          }
        })
      },
      handleEdit(row) {
        this.$router.push({
          path: '/xcnanr/ideal/inspectionPlan/add',
          query: {
            id: row.id,
            type: 'Edit'
          }
        })
      },
      // 详情
      handleSee(row) {
        this.$router.push({
          path: '/xcnanr/ideal/inspectionPlan/detail',
          query: {
            id: row.id,
            type: 'detail'
          }
        })
      },
      // 是否显示审批按钮
      displayApprovalFunc(row) {
        // 状态是已审批、具备班长或专工的具有审批权限的角色、不是自己
        if (row.statusInfo === 2 && this.hasApprovalPerm && row.createUser !== this.userInfo.userId) {
          return true
        }
      },
      // 审批
      handleApproval(row) {
        this.$router.push({
          path: '/xcnanr/ideal/inspectionPlan/approve',
          query: {
            id: row.id
          }
        })
      },
      // 批量启动
      handleStart(row) {
        if (this.$refs.tableData.selection.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        const equalObj = this.tableData.filter(item=>row.includes(item.id)).filter(item=>item.statusInfo !== 4)
        if (equalObj.length > 0){
          this.$message.warning("【启动】操作仅针对于【已暂停】状态，请检查后重试！");
          return;
        }
        this.$confirm('是否启动计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = this.$refs.tableData.selection.map((item) => {
            return item.id
          }).join(',')
          startBatchInspection(ids).then(() => {
            this.$message({
              type: 'success',
              message: '启动成功！开始定时生成巡视工单'
            })
            this.getList()
          })
        })
      },
      // 暂停
      handleSuspend(row) {
        if (this.$refs.tableData.selection.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        const equalObj = this.tableData.filter(item=>row.includes(item.id)).filter(item=>item.statusInfo !== 3)
        if (equalObj.length > 0){
          this.$message.warning("【暂停】操作仅针对于【已启动】状态，请检查后重试！");
          return;
        }
        this.$confirm('是否暂停计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = this.$refs.tableData.selection.map((item) => {
            return item.id
          }).join(',')
          pauseBatchInspection(ids).then(() => {
            this.$message({
              type: 'success',
              message: '暂停成功！暂不生成巡视工单'
            });
            this.getList()
          })
        })
      },
      // 终止
      handleStop(row) {
        if (this.$refs.tableData.selection.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        const equalObj = this.tableData.filter(item=>row.includes(item.id)).filter(item=>item.statusInfo === 5)
        if (equalObj.length > 0){
          this.$message.warning("选择数据中存在【已停止】状态数据，请检查后重试！");
          return;
        }
        this.$confirm('是否终止计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = this.$refs.tableData.selection.map((item) => {
            return item.id
          }).join(',')
          stopBatchInspection(ids).then(() => {
            this.$message({
              type: 'success',
              message: '终止成功！停止生成巡视工单'
            });
            this.getList()
          })
        })
      },
      handleExport() {
        getAllInfoInspectionPlan(this.searchForm).then(res => {
          // 获取 inspectionPlanXlsx 的键顺序
          const headerKeys = Object.keys(inspectionPlanXlsx);
          // 过滤数据，只保留 inspectionPlanXlsx 中存在的字段，并按照 inspectionPlanXlsx 的顺序排列

          // 处理字典值
          const modifiedData = res.data.map(item => {
            return {
              ...item,
              statusInfo: this.conversionDict(item.statusInfo + '', this.inspectionStatusList),
              type: this.conversionDict(item.type + '', this.inspectionTypeList),
              category: this.conversionDict(item.category + '', this.inspectionCategoryList)
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
          const headers = headerKeys.map(key => inspectionPlanXlsx[key]);
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
              fgColor: {argb: 'FFDDDDDD'}
            }
            cell.font = {
              bold: true,
              color: {argb: 'FF000000'}
            }
            cell.border = {
              top: {style: 'thin'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'}
            }
            cell.alignment = {horizontal: 'center', vertical: 'middle'}
          })

          // 设置数据行样式
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // 跳过表头行
              row.eachCell((cell) => {
                cell.border = {
                  top: {style: 'thin'},
                  left: {style: 'thin'},
                  bottom: {style: 'thin'},
                  right: {style: 'thin'}
                }
                cell.alignment = {horizontal: 'center', vertical: 'middle'}
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
            const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            // 设置文件名
            a.download = '巡视计划.xlsx'
            a.click()
            window.URL.revokeObjectURL(url)
          })
        })
      },
      selectionChange(selection) {
        this.selectionList = selection.map(item => item.id)
      },
      doubleCellFunc(row, column, cell, event) {
        this.handleSee(row)
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
        this.searchForm.no = undefined;
        this.searchForm.type = undefined;
        this.searchForm.category = undefined;
        this.searchForm.companyId = undefined;
        this.searchForm.companyName = undefined;
        this.searchForm.statusInfo = undefined;
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
      handleDelAll() {
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
          return delByIds(ids)
        }).then(() => {
          this.getList()
          this.$message({
            type: "success",
            message: "操作成功!"
          })
        })
      },
      // 审批
      approve(row) {
        this.showType = 'approve'
        this.arrtId = row.id
        this.showForm = true
      },
      // 编辑
      editTable(row) {
        this.showType = '修改'
        this.arrtId = row.id
        this.showForm = true
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
