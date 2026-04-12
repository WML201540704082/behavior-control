<template>
  <div>
    <basic-container>
      <!-- <el-header style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;"> -->
        <div class="page_form">
          <el-form class="xt_search_form" ref="queryForm" :model="queryParams" label-width="105px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="提报单号:" prop="serialNumber">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="queryParams.serialNumber"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="隐患内容:" prop="content">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="queryParams.content"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="隐患来源:" prop="hiddenSource">
                  <el-select v-model="queryParams.hiddenSource" size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in hiddenSourceList"
                      :value="item.dictValue"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="隐患分类:" prop="hiddenCategory">
                  <el-select v-model="queryParams.hiddenCategory" size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in hiddenCategoryList"
                      :value="item.dictValue"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工单状态:" prop="status">
                  <el-select v-model="queryParams.status" size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in statusList"
                      :value="item.dictValue"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="责任单位:" prop="secondCompany">
                  <el-select v-model="queryParams.secondCompany" size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in basicUnitSeconds"
                      :value="item.orgId"
                      :key="item.orgId"
                      :label="item.shortName"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->


              <el-col :span="6">
                <el-form-item label="责任单位:" prop="secondCompany">
                  <!-- <el-cascader
                    size="mini"
                    v-model="queryParams.secondCompany"
                    :options="basicUnitSeconds"
                    :props="defaultProps"
                    :show-all-levels="false"
                    style="width: 100%"
                    placeholder="">
                  </el-cascader> -->
                  <JobUnit :orgId.sync="queryParams.secondCompany" report></JobUnit>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="是否认领:" prop="claimStatus">
                  <el-select v-model="queryParams.claimStatus" size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in claimStatusList"
                      :value="item.dictValue"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>


            </el-row>
            <!-- <div> -->
              <el-row class="btnLine">
                <el-button type="primary" size="mini"  icon="el-icon-search"
                           @click="handleQuery">查询</el-button>
                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-refresh-left"
                           @click="resetQuery">重置</el-button>

                <el-button  type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-plus"
                            @click="handleAdd">新增</el-button>

                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-edit"
                           :disabled="!(multipleSelection.length == 1 && multipleSelection[0] && multipleSelection[0].claimStatus === 1)"
                           @click="handleUpdate">修改</el-button>

                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-delete"
                           :disabled="!multipleSelection.length > 0"
                           @click="handleDelete">删除</el-button>

                <el-button type="primary" icon="el-icon-download" size="mini" @click="exportExcel" style="margin-left: 5px;">导出</el-button>
                <el-button type="primary" icon="el-icon-search" size="mini" :disabled="multipleSelection.length != 1" @click="checkLog" style="margin-left: 5px;">查看工作日志</el-button>
                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-edit"
                           v-hasPermi="['hidden:order:claim']"
                           :disabled="!(multipleSelection.length == 1 && multipleSelection[0] && multipleSelection[0].claimStatus === 0)"
                           @click="handleUpdate">督导隐患认领</el-button>
                           
                <el-button type="primary" icon="el-icon-upload" size="mini" @click="importExcel2"
                           v-hasPermi="['hidden:batch:upload']"
                           style="margin-left: 5px;">批量导入
                </el-button>
                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-edit"
                           v-hasPermi="['hidden:batch:upload']"
                           :disabled="multipleSelection.length != 1"
                           @click="handleUpdate2">导入修改
                </el-button>
                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-delete"
                           v-hasPermi="['hidden:province:del']"
                           :disabled="!multipleSelection.length > 0"
                           @click="handleDelete2">导入删除
                </el-button>
                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-plus"
                           v-hasPermi="['hidden:batch:release']"
                           :disabled="!multipleSelection.length > 0"
                           @click="handleAdd2">导入发布
                </el-button>
              </el-row>
            <!-- </div> -->
          </el-form>
        </div>
      <!-- </el-header> -->
      <!-- <el-main style="padding-left: 20px;padding-top: 0px"> -->
        <div class="page_body">
          <el-table
            v-loading="loading"
            :data="tableList"
            :height="tableHeight"
            stripe
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%;height:100%;margin-top:5px;">
            <el-table-column
              type="selection"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="serialNumber"
              label="提报单号"
              sortable
              width="140"
            >
              <template slot-scope="scope">
                <a style="color:blue;text-decoration:underline;cursor:pointer;" @click="handleDblclick(scope.row)">{{scope.row.serialNumber}}</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              align="left"
              label="隐患内容"
              sortable
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="hiddenSource"
              align="left"
              label="隐患来源"
              sortable
              width="110"
              :formatter="formatHiddenSource"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="hiddenCategory"
              align="left"
              label="隐患分类"
              sortable
              width="120"
              :formatter="formatHiddenCategory"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="status"
              label="工单状态"
              sortable
              width="160"
              :formatter="formatState"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="shortName"
              align="left"
              label="责任单位"
              sortable
              width="120"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="responsibleBy"
              align="left"
              label="整改责任人"
              sortable
              width="120"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="rectificationExpectTime"
              align="left"
              label="整改完成限期"
              sortable
              width="160"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="claimStatus"
              label="是否认领"
              sortable
              width="160"
              :formatter="formatClaimStatus"
              show-overflow-tooltip>
            </el-table-column>
            <!-- <el-table-column
              prop="company"
              align="left"
              label="三级单位"
              sortable
              show-overflow-tooltip
              >
              <template slot-scope="scope">{{scope.row.thirdDeptLabel}}</template>
            </el-table-column> -->
          </el-table>
          <!-- v-show="total>0" -->
          <pagination
            style="margin-bottom: 5px"
            :total="total"
            :page.sync="queryParams.current"
            :limit.sync="queryParams.size"
            @pagination="getList"
          />
        </div>
      <!-- </el-main> -->
    </basic-container>

    <!-- 详情 -->
    <div v-if="dialogVisible">
      <el-dialog :modal-append-to-body="false" :title="dialogTitle" style="padding: 0px;"
                 :close-on-click-modal="false" :visible.sync="dialogVisible"
                 :before-close="closeDialog"  width="80%">
        <Detail @closeRoom="closeDialog" :detailId="detailId" :is-edit="isEdit" :is-info="isInfo"/>
      </el-dialog>
    </div>

    <!-- 工作日志 -->
    <div v-if="worklogVisible">
      <el-dialog :modal-append-to-body="false" title="工作日志" :visible.sync="worklogVisible" width="80%">
        <WorkLog @closeRoom="worklogVisible = false" :detailId="detailId" :workflowId="workflowId"/>
      </el-dialog>
    </div>
   

    
    <!-- 导入对话框 -->
    <el-dialog title="导入" :visible.sync="upload.open" @close="getList" 
      class="import-dialog"  width="550px" :modal-append-to-body="false" :close-on-click-modal="false">
      <BatchImport ref="upload" @onImportSubmit='onImportSubmit'></BatchImport>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm" size="mini">确 定</el-button>
        <el-button @click="upload.open = false" size="mini">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 批量导入列表 -->
    <div v-if="importTableVisible">
      <el-dialog title="批量导入清单展示" :modal-append-to-body="false" :close-on-click-modal="false" style="padding: 0px;" width="80%"
        :visible.sync="importTableVisible"
        :before-close="closeDialog">
        <ImportTable @closeRoom="closeDialog" :importTable="importTable"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Detail from "./components/detail";
import WorkLog from "./components/workLog";
import UploadFile from "./components/uploadFile";

import { mapGetters } from 'vuex'
import { orderList, orderRemove, queryShortNameList, queryShortNameTree } from "@/api/safeDanger/report"

import BatchImport from '../rectification/components/batchImport'
import ImportTable from '../rectification/components/importTable'
 import { release } from '@/api/safeDanger/rectificationImport'

// import { list, del } from "@/api/safeDanger/computerroom";
export default {
  // 隐患提报
  name: "index",
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
    ]),
  },
  components: {
    Detail, 
    UploadFile, 
    WorkLog, 
    BatchImport, 
    ImportTable
  },
  data() {
    return {
      defaultProps: {
        value: 'orgId',
        label: 'shortName',
        leaf: 'leaf',
        children: 'shortNameVOList',
        // checkStrictly: true,
        emitPath: false,
        expandTrigger: 'hover'
      },

      worklogVisible: false,

      tableHeight:undefined,
      // 查询参数
      queryParams: {
        current: 1,
        size: 20,
        isPresent: 0,
        newType: 0,
        serialNumber: undefined,
        hiddenCategory: undefined,
        status:undefined,
        content: undefined,
        hiddenSource: undefined,
        secondCompany: undefined,
      },
      queryDisabled: {
        showDeviceType: true,
        showUnitSecond: false
      },
      // 用户表格数据
      tableList: null,
      // 总条数
      total: 0,
      // 选中数据
      multipleSelection: [],
      // 选中数组
      ids: [],
      // 遮罩层
      loading: false,
      // 弹框层
      isEdit: false,
      isInfo: false,
      detailId: undefined,
      workflowId: undefined,
      dialogTitle: '',
      dialogVisible: false,
      // 下拉列表
      hiddenSourceList: [],
      hiddenCategoryList: [],
      hiddenCategoryList2: [],
      statusList: [],
      basicUnitSeconds: [],
      claimStatusList: [
        {
          dictValue: 0,
          dictLabel: '未认领'
        },
        {
          dictValue: 1,
          dictLabel: '已认领'
        },
      ],


      // 导入弹框
      upload: {
        open: false // 是否显示弹出层（用户导入）
      },
      importTableVisible: false,
      importTable: [],
    }
  },
  created() {
    // this.initData()
    // this.getList();
  },
  mounted() {
    this.getCurrentHeight()
    window.addEventListener('resize', this.getCurrentHeight)
    window.addEventListener('webkitvisibilitychange', this.getCurrentHeight)
  },
  methods: {
    onImportSubmit(data){
      if(!data) return
      this.upload.open = false
      this.importTable = data
      this.importTableVisible = true
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submitFileForm()
    },

    initData(){
       this.getDicts('hidden_source').then(response => {
        this.hiddenSourceList = response.data
      });
      this.getDicts('hidden_category').then(response => {
        this.hiddenCategoryList = response.data
      });
      this.getDicts('hidden_present_status').then(response => {
        this.statusList = response.data
      });
      // queryShortNameList({ parentId: this.companyCode.slice(0, 4) }).then(response => {
      //   this.basicUnitSeconds = response.data
      // })
      // queryShortNameTree().then(res=>{
      //   console.log(88, res)
      //   this.basicUnitSeconds = res.data.shortNameVOList
      //   this.queryParams.secondCompany = this.companyCode
      // })
      // this.deptSelect()
    },
    // 获取 二、三级单位及部门
    // deptSelect(){
    //   queryTowThreeDpet().then(response => {
    //     let datas = response.data
    //     datas.towDept.forEach(ele=>{
    //       ele.children = datas.threeDept
    //     })
    //     this.basicUnitSeconds = datas.towDept
    //   })
    // },
    getList() {
      this.loading = true
      orderList(this.queryParams).then(response =>{
        this.tableList = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      this.ids = []
      this.multipleSelection = val;
      this.ids = val.map(item => item.id);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.resetForm("queryForm");
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    },
    handleDelete() {
      // let flag = this.multipleSelection.some(el => el.claimStatus == 0)
      let flag = this.multipleSelection.some(el => el.newType == 1)
      if (flag) {
        this.$message({
          message: '导入工单不可删除！',
          type: 'warning'
        })
        return
      }

      const ids = this.ids;
      this.$confirm('是否确认删除选中数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return orderRemove(ids);
      }).then(rsp => {
        if(rsp.code == 200){
          this.getList();
          this.$message.success('删除成功');
        }
      }).catch(function() {});
    },
    handleAdd() {
      this.detailId = undefined
      this.dialogTitle = '新增'
      this.dialogVisible = true
      this.isEdit = false
      this.isInfo = false
    },
    handleUpdate() {
      if(this.multipleSelection.length<=0 || this.multipleSelection.length>1){
        this.$message({
          message: '请选择一条需要修改记录！',
          type: 'warning'
        });
        return;
      }
      if(this.multipleSelection[0].status > 0 && this.multipleSelection[0].status != 10){
        this.$message({
          message: '流程已发起,不可编辑!',
          type: 'warning'
        });
        return;
      }
      this.detailId = this.multipleSelection[0].id;
      this.dialogTitle = '编辑';
      this.dialogVisible = true;
      this.isEdit = true
      this.isInfo = false
    },
    exportExcel() {
      this.$confirm('全量数据导出较慢，请耐心等待。', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在处理，请稍等。。。',
          spinner: 'el-icon-loading',
        });
        this.download('/api/idevelop-hidden/order/export', {
          ...this.queryParams
        }, `隐患记录工单${this.formatDate(new Date(), 'yyyy-MM-dd-hh:mm:ss')}.xlsx`, loading)
      }).catch(function () {
      })
    },
    checkLog(){
      this.detailId = this.multipleSelection[0].id;
      this.workflowId = this.multipleSelection[0].workflowId
      this.worklogVisible = true
    },
    handleDblclick(row) {
      this.detailId = row.id;
      this.dialogTitle = '详情';
      this.dialogVisible = true;
      this.isEdit = false
      this.isInfo = true
    },
    closeDialog(){
      this.importTableVisible = false
      this.dialogVisible = false
      this.getList();

      // 刷新待办工作菜单数量
      this.$store.dispatch('hiddenTotal')
    },

    // 格式化数据
    formatHiddenSource(row){
      return this.selectDictLabel( this.hiddenSourceList, row.hiddenSource )
    },
    formatHiddenCategory(row){
      return this.selectDictLabel( this.hiddenCategoryList, row.hiddenCategory )
    },
    formatState(row){
      // if (row.isRefuteCancel == '1') {
      //   return '已终止'
      // }
      return this.selectDictLabel( this.statusList, row.status )
    },
    formatClaimStatus(row){
      return this.selectDictLabel( this.claimStatusList, row.claimStatus )
    },

    formatSecondCompany(row){
      if(!row.secondCompany) return ''
      let data = this.basicUnitSeconds;
      // if(row.secondCompany.toString().length == 5){
      //   data = this.basicUnitSeconds;
      // }else{
      //   data = this.basicUnitSeconds[0].children;
      // }
      for (let i = 0; i < data.length; i++) {
        if (row.secondCompany == data[i].orgId) {
          return data[i].shortName;
        }
      }
    },

    //导入
    importExcel2() {
      this.upload.open = true
    },
    handleUpdate2() {
      if (this.multipleSelection[0].newType != 1 || this.multipleSelection[0].releaseStatus != 0) {
        this.$message({
          message: '仅导入后未发布工单可修改！',
          type: 'warning'
        })
        return
      }

      if (this.multipleSelection[0].status != 7) {
        this.$message({
          message: '已发起审批！当前数据无法操作！',
          type: 'warning'
        })
        return
      }
      this.detailId = this.multipleSelection[0].id
      this.dialogTitle = '编辑'
      this.dialogVisible = true
      this.isEdit = true
      this.isInfo = false
      
    },
    handleDelete2() {
      let flag = this.multipleSelection.some(el => el.newType != 1 || el.releaseStatus != 0 || el.status != 7 || el.claimStatus != 0)
      if (flag) {
        this.$message({
          message: '仅导入后未发布未认领工单可删除！',
          type: 'warning'
        })
        return
      }

      const ids = this.ids
      this.$confirm('是否确认删除选中数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return orderRemove(ids)
      }).then(rsp => {
        this.getList()
        this.$message.success('删除成功')
      }).catch(function() {
      })
    },
    handleAdd2() {
      release(this.ids).then(res => {
        this.$message.success(res.msg)
        this.getList()
      })
    },



    // 获取自适应高度
    getCurrentHeight() {
      let windowHeight = window.innerHeight //窗口高度
      this.tableHeight = (windowHeight - 335) + 'px'
    },
  }
}
</script>

<style scoped>
  .el-col-8{
    height: 30px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }
  .el-cascader{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }
  .el-input{
    width: 100%;
  }
  ::v-deep .import-dialog .el-dialog__body {
    height: 280px !important;
  }


  ::v-deep .import-dialog .el-dialog__body > div {
    position: relative;
  }

  ::v-deep .import-dialog .el-upload__template {
    position: absolute;
    right: 15px;
    top: 0px;
    line-height: 20px;
  }
</style>
