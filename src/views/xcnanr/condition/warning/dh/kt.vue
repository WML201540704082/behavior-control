<template>
  <basic-container>
    <!-- 查询条件 -->
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="130px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="告警单元" prop="unitName">
              <el-input  v-model="searchForm.unitName" clearable placeholder="请输入告警单元" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警内容" prop="content">
              <el-input  v-model="searchForm.content" clearable placeholder="请输入告警内容" :maxlength="100" />
            </el-form-item>
          </el-col>
          <!-- 确认状态 -->
          <el-col :span="6">
            <el-form-item label="确认状态">
              <el-select v-model="searchForm.status" filterable clearable placeholder="请选择确认状态">
                <el-option v-for="dict in sattusOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警时间" props="times">
              <el-date-picker
                v-model="searchForm.times" clearable filterable
                type="datetimerange"
                range-separator="一"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 80%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button-group>
              <el-button type="primary" style="margin-left: 130px;" @click="queryEvent">查询</el-button>
              <el-button style="margin-left: 5px;" type="primary" plain @click="resetEvent">重置</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
      <!-- 查询按钮 -->
    </div>
    <!-- 页面表格 -->
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="告警单元" prop="unitName" width="200" align="center" show-overflow-tooltip />
        <el-table-column label="告警时间" prop="warningTime" width="200" align="center" show-overflow-tooltip />
        <el-table-column label="告警内容" prop="content" min-width="300" align="center" show-overflow-tooltip />
        <el-table-column label="创建人" prop="createUserName" width="100" align="center" show-overflow-tooltip />
        <el-table-column label="公司" prop="companyName" width="150" align="center" show-overflow-tooltip />
        <el-table-column label="部门" prop="deptName" width="150" align="center" show-overflow-tooltip />
        <el-table-column label="机房" prop="roomName" width="150" align="center" show-overflow-tooltip />
        <el-table-column label="工单编号" prop="code" width="150" align="center" show-overflow-tooltip />
        <el-table-column label="确认状态" prop="status" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.status, sattusOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="330" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0" type="text" size="mini" disabled @click="turnToRouble(scope.row)" icon="el-icon-coin">转入隐患库</el-button>
            <el-button v-if="scope.row.status === 0" type="text" size="mini" @click="turnToRepair(scope.row)" icon="el-icon-s-fold">转检修工单</el-button>
            <el-button v-if="scope.row.status === 0" type="text" size="mini" @click="warningDialog(scope.row)" icon="el-icon-warning-outline">确认</el-button>
            <el-button type="text" size="mini" @click="detailDialogFunc(scope.row)" icon="el-icon-warning-outline">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" :pageSizes="[10,20,50,100,200]" @pagination="getList"/>

      <el-dialog :title="'告警确认'" :visible.sync="dialogFlag" append-to-body width="800px" height="400px" top="10vh" :show-close="true" :close-on-click-modal="true"  v-el-drag-dialog>
        <el-form ref="submitForm" :model="warningForm" :rules="rules" label-width="120px" size="small" v-loading="loading">
          <el-row :gutter="12">
            <el-col :span="12">
              <el-form-item label="告警单元" prop="unitName">
                <el-input v-model="warningForm.unitName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="告警时间" prop="warningTime">
                <el-input v-model="warningForm.warningTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="巡视人" prop="createUserName">
                <el-input v-model="warningForm.createUserName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" >
              <el-form-item label="告警内容" prop="content">
                <el-input type="textarea" :rows="3" v-model="warningForm.content" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" >
              <el-form-item label="确认人" prop="updateUserName">
                <el-input v-model="warningForm.updateUserName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" >
              <el-form-item label="确认描述" prop="dealContent" >
                <el-input type="textarea" :rows="3"  v-model="warningForm.dealContent" :maxlength="100" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="form-btn d_end">
            <el-button type="primary" error @click="submit" >提交</el-button>
<!--            <el-button type="danger" plain >关 闭</el-button>-->
          </div>
        </el-form>
      </el-dialog>

      <detail-dialog v-if="detailDialog.flag" :dialog-flag="detailDialog.flag" :dialog-object="detailDialog.obj" :upload-files="detailDialog.uploadFiles" @closeDialog="closeDetailDialogFunc" />
    </div>

    <!-- 弹层 -->
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getByPage, dealWarning, getInfoFeedbackFiles } from '@/api/xcnanr/warning'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import { getDictList } from '@/api/dict'
import detailDialog from '../detail'

export default {
  name: 'Back',
  components: { xtTreeLzaySelect, getDictList, detailDialog },
  computed: { ...mapGetters(["permission", "userInfo", 'userDetail']) },
  data() {
    return {
      dialogFlag: false,
      dialogType: '',
      childDialogForm: {},
      sattusOptions: [],
      selectionList: [], // 复选框
      searchForm: {
        pageNo: 1,
        pageSize: 10,
        unitName: null,
        content: null,
        source: null,
        warnType: null,
        times: null,
        status: null,
      },
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      rules: {
        updateUserName: [{required: true, message: '请选择确认人', trigger: 'blur'}],
        dealContent: [{required: true, message: '请填写确认描述', trigger: 'blur'}]
      },
      warningForm: { id: null,unitName: null,warningTime: null, content: null, createUserName: null, dealContent: '已确认告警', updateUserName: null },
      // 弹窗
      detailDialog: { flag: false, obj: null, uploadFiles: null },
    }
  },
  created() {

    this.getDictList('info_warningSattus')
    this.getDictList('info_warningSource')
    this.getDictList('info_warning_type')
  },
  mounted() {
    this.setPageContentHeight()
    this.setTableHeight()
    this.getList()
  },
  methods: {
    // 关闭详情弹层
    closeDetailDialogFunc() {
      this.detailDialog = {
        flag: false,
        obj: null,
        uploadFiles: null
      }
    },
    detailDialogFunc(row) {
      if (row.code && row.code !== '' ) {
        const params = {
          detailId: row.extAttr1,
          type: row.source
        }
        getInfoFeedbackFiles(params).then(res => {
          console.log(res)
          this.openDetailDialog(row,res.data)
        })
      }else {
        this.openDetailDialog(row,null)
      }
    },
    openDetailDialog(row,files){
      this.detailDialog = {
        flag: true,
        obj: row,
        uploadFiles: files
      }
    },
    getDictList(code){
      //加载字典
      getDictList(code).then(res => {
        if(code==='info_warningSattus'){
          this.sattusOptions = res.data
        }
      })
    },
    warningDialog(row) {
      this.warningForm = row
      this.warningForm['updateUserName'] = this.userInfo.userName
      this.warningForm['dealContent'] = '该告警记录已处理。'
      this.dialogFlag = true
    },
    getOwnerUnit(val, type) {
      if (type === 'CORP') {
        //单位
        this.form.ownerUnit = val.id
        this.form.ownerUnitName = val.fullName

        //单位更改 部门请初始化
        this.form.propertyDept = null;
        this.form.propertyDeptName = null;
      }
      this.$forceUpdate()
    },
    approveEvent() {
      console.log('转入隐患库')
    },
    detailEvent() {
      console.log('转维修工单')
    },
    turnToRouble(row){
      this.$confirm('是否将该告警转入隐患库?', '转入隐患库', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
        // type: 'warning'
      }).then(() => {
        return this.dealWarningByType(row.id,2,'确认告警并转入隐患库','')
      }).catch(() => {
      })
    },
    dealWarningByType(warningId, dealType,dealContent,repairCode) {
      const params = {
        warningId: warningId,
        dealType: dealType,
        dealContent: dealContent,// 1: 确认，2：转入隐患库，3：转维修工单
        repairCode: repairCode
      }
      const _this = this
      dealWarning(params).then(res => {
        if (res.success) {
          _this.dialogFlag = false
          _this.$message.success(res.msg)
          _this.getList()
        } else {
          _this.$message.error(res.msg)
        }
      }).catch(() => {
        _this.$message.error('操作失败')
      })
    },
    turnToRepair(row) {
      // 先关闭已经打开过的tab页
      const thisTabId = document.getElementById("tab-/xcnanr/condition/warning/index")
      const allTabs = thisTabId.parentElement.children
      for (let i = 0; i < allTabs.length; i++) {
        const tab = allTabs[i]
        if (tab.id.indexOf("tab-/xcnanr/repairOrderAdd") >= 0) {
          document.getElementById(tab.id).childNodes[1].click()
        }
      }
      this.$router.push({
        path: `/xcnanr/repairOrderAdd`,
        query: {
          type: 'Add',warningId: row.id
        }
      })
    },
    submit() {
      const _this = this
      const warninForm = _this.warningForm
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          const params = {warningId: warninForm.id, dealType: 1, dealContent: warninForm.dealContent, repairCode: ''}
          dealWarning(params)
            .then(res => {
              if (res.success) {
                _this.dialogFlag = false
                _this.$message.success(res.msg)
                _this.getList()
              } else {
                _this.$message.error(res.msg)
              }
            }).catch(() => {
            _this.$message.error('操作失败')
            })
        }
      })
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    selectionChange(selection) {
      this.selectionList = selection.map(item => item.id)
    },
    queryEvent() {
      this.searchForm.pageNo = 1;
      this.searchForm.pageSize = 10;
      this.getList()
    },
    resetEvent() {
      this.searchForm.pageNo = 1;
      this.searchForm.pageSize = 10;
      this.searchForm.unitName = undefined
      this.searchForm.content = undefined
      this.searchForm.source = undefined
      this.searchForm.warnType = undefined
      this.searchForm.times = undefined
      this.searchForm.status = undefined
      this.getList()
    },
    getList() {
      this.tableLoading = true
      // 处理时间范围
      const times = this.searchForm['times']
      this.searchForm.startTime = (times && times.length>1) ? times[0] : null
      this.searchForm.endTime = (times && times.length>1) ? times[1] : null
      this.searchForm.warnType = 5
      getByPage(this.searchForm).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
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
      return "未定义"
    },
    tbClick(type) {
      this.$message.success(type)
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
/deep/ .el-input__inner{
  background-color: #e0f3ff;
}
/deep/ .el-textarea__inner {
  background-color: #e0f3ff;
}
::v-deep(.el-textarea__inner) {
  resize: none !important;
}
  /deep/.el-date-editor {
    padding: 0px 10px;
  }
</style>
