<template>
  <div>
    <basic-container>
      <!-- <el-header style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;"> -->
       
        <div class="page_form">
          <el-form class="xt_search_form" ref="queryForm" :model="queryParams" label-width="105px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="整改单号:" prop="rectificationNumber">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="queryParams.rectificationNumber"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="待整改内容:" prop="content">
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
              <el-col :span="6">
                <el-form-item label="整改单位:" prop="secondCompany">
                  <!-- <el-select v-model="queryParams.secondCompany" size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in basicUnitSeconds"
                      :value="item.orgId"
                      :key="item.orgId"
                      :label="item.shortName"
                    >
                    </el-option>
                  </el-select> -->

                  <JobUnit :orgId.sync="queryParams.secondCompany"></JobUnit>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="整改状态:" prop="isRectification">
                  <el-select v-model="queryParams.isRectification"
                             size="mini" clearable placeholder=""
                  >
                    <el-option
                      v-for="item in rectificationStatusList"
                      :value="item.dictValue"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否超期:" prop="isOverdue">
                  <el-select v-model="queryParams.isOverdue"
                             size="mini" clearable placeholder=""
                  >
                    <el-option
                      v-for="item in hiddenExtensionStatusList"
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
                <el-button type="primary" size="mini" icon="el-icon-search"
                           @click="handleQuery">查询
                </el-button>
                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-refresh-left"
                           @click="resetQuery">重置
                </el-button>
                <el-button type="primary" icon="el-icon-download" size="mini" @click="exportExcel"
                           v-hasPermi="['hidden:order:export']"
                           style="margin-left: 5px;">导出
                </el-button>
                <el-button type="primary" icon="el-icon-search" size="mini" :disabled="multipleSelection.length != 1"
                           v-hasPermi="['hidden:log:list']"
                           @click="checkLog" style="margin-left: 5px;">查看工作日志
                </el-button>
                <!-- <el-button type="primary" icon="el-icon-upload" size="mini" @click="importExcel"
                           v-hasPermi="['hidden:batch:upload']"
                           style="margin-left: 5px;">批量导入
                </el-button>
                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-edit"
                           v-hasPermi="['hidden:batch:upload']"
                           :disabled="multipleSelection.length != 1"
                           @click="handleUpdate">导入修改
                </el-button>
                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-delete"
                           v-hasPermi="['hidden:province:del']"
                           :disabled="!multipleSelection.length > 0"
                           @click="handleDelete">导入删除
                </el-button>
                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-plus"
                           v-hasPermi="['hidden:batch:release']"
                           :disabled="!multipleSelection.length > 0"
                           @click="handleAdd">导入发布
                </el-button> -->
                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-edit"
                           v-hasPermi="['hidden:province:update']"
                           :disabled="multipleSelection.length != 1"
                           @click="handleRect">整改
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
            
            @row-dblclick="handleDblclick"
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%;height:100%;margin-top:5px;">
            <el-table-column
              type="selection"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="rectificationNumber"
              label="整改单号"
              sortable
              width="140"
            >
              <template slot-scope="scope">
                <a style="color:blue;text-decoration:underline;cursor:pointer;" @click="handleDblclick(scope.row)">{{scope.row.rectificationNumber}}</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              align="left"
              label="待整改内容"
              sortable

              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="rectificationRecord"
              align="left"
              label="整改记录"
              sortable

              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="hiddenNumber"
              align="left"
              label="关联隐患记录"
              sortable
              width="140"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="status"
              label="工单状态"
              sortable
              width="120"
              :formatter="formatState"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="isRectification"
              label="整改状态"
              sortable
              :formatter="formatRectificationStatus"
              width="100"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="rectificationExtensionStatus"
              label="是否超期"
              sortable
              width="100"
              show-overflow-tooltip>
              <!-- :formatter="formatRectificationExtensionStatus" -->
              <template slot-scope="{row}">
                <span v-if="row.isOverdue == 0" style="color:rgb(235,80,83);font-weight: bold;">已超期({{row.overdueDays}}天)</span>
                <span v-if="row.isOverdue == 1">未超期</span>
                <span v-if="row.isOverdue == 2" style="color:rgb(243,175,62);font-weight: bold;">即将超期({{row.overdueDays}}天)</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="shortName"
              align="left"
              label="整改单位"
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
              width="130"
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
            style="margin-bottom:10px"
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
                 :before-close="closeDialog" width="80%">
        <Detail @closeRoom="closeDialog" :detailId="detailId" :is-edit="isEdit" :is-info="isInfo" :rectEdit='rectEdit'
                :isRect='isRect'/>
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

    <!-- 流程人员选择框 -->
    <div v-if="openSelectFlowUser">
      <el-dialog title="发送人" :visible.sync="openSelectFlowUser" :modal-append-to-body="false" width="80%"
                 @close="handleProcessClose" class="sub_form_dialog">
        <select-flow-user
          ref="selectFlowUser"
          :process-type="2"
          :processInstID="multipleSelection[0].workflowId"
          :rectificationStatus="0"
          :formData="multipleSelection[0]"
          @handleClose="handleProcessClose"
          @sendWorkflow="sendNetProFlow"
          v-loading="loadingSelectUser"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import BatchImport from './components/batchImport'
  import Detail from './components/detail'
  import ImportTable from './components/importTable'
  import WorkLog from '../report/components/workLog'
  import UploadFile2 from './components/uploadFile'
  import { mapGetters } from 'vuex'
  import {
    orderList,
    orderRemove,
    queryShortNameList,
    rectificationList,
    createFlow,
    sendBpm
  } from '@/api/safeDanger/report'
  import { release } from '@/api/safeDanger/rectificationImport'

  import SelectFlowUser from '../record/components/selectFlowUser'

  // import { list, del } from "@/api/safeDanger/computerroom";
  export default {
    // 隐患整改
    name: 'index',
    computed: {
      ...mapGetters([
        'nickName',
        'companyId',
        'companyCode'
      ])
    },
    components: { BatchImport, Detail, ImportTable, UploadFile2, WorkLog, SelectFlowUser },
    data() {
      return {
        
        worklogVisible: false,
        
        tableHeight: undefined,
        // 查询参数
        queryParams: {
          current: 1,
          size: 20,
          isPresent: 1,
          rectificationNumber: undefined,
          content: undefined,
          status: undefined,
          secondCompany: undefined,
          isRectification: undefined,
          isOverdue: undefined
        },
        queryDisabled: {
          showDeviceType: true,
          showUnitSecond: false,
          showRectificationExtension: true
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
        rectEdit: false,
        isRect: false,
        detailId: undefined,
        workflowId: undefined,
        dialogTitle: '',
        dialogVisible: false,
        // 下拉列表
        hiddenSourceList: [],
        hiddenCategoryList: [],

        statusList: [],
        basicUnitSeconds: [],
        hiddenExtensionStatusList: [],
        rectificationStatusList: [{
          dictValue: 0,
          dictLabel: '待整改'
        }, {
          dictValue: 1,
          dictLabel: '整改中'
        }, {
          dictValue: 2,
          dictLabel: '已整改'
        }],
        // 导入弹框
        upload: {
          open: false, // 是否显示弹出层（用户导入）
        },
        importTableVisible: false,
        importTable: [],

        openSelectFlowUser: false,
        loadingSelectUser: false
      }
    },
    created() {
      this.initData()
      this.getList()
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


      // 设置告警类型显示颜色
      tableRowClassName({ row, rowIndex }) {
        if (row.isOverdue == 0) {
          return 'seriousWarn'
        }

        // if(row.warnLevel == '1') return 'middleWarn' // 警告
        // else if(row.warnLevel == '2') return 'warnWarn' // 严重
        // else if(row.warnLevel == '3') return 'seriousWarn' // 致命
      },
      //关闭选择人员界面
      handleProcessClose() {
        this.openSelectFlowUser = false
        this.getList()
      },
      //流程发送,供选人界面调用
      sendNetProFlow(data) {
        let param = {
          bpmParams: data.bpmParams,
          data: this.multipleSelection[0]
        }
        this.loadingSelectUser = true
        sendBpm(param).then(response => {
          if (response.code == 200) {
            this.$message.success('发送成功')
          } else {
            this.$message.error('流程发送失败')
          }

          this.loadingSelectUser = false
          this.openSelectFlowUser = false
        }).catch(() => {
          this.$message.error('流程发送出现异常')

          this.loadingSelectUser = false
          this.openSelectFlowUser = false
        })
      },

      initData() {
        this.getDicts('hidden_source').then(response => {
          this.hiddenSourceList = response.data
        })
        this.getDicts('hidden_category').then(response => {
          this.hiddenCategoryList = response.data
        })
        this.getDicts('hidden_rectification_status').then(response => {
          this.statusList = response.data
        })
        this.getDicts('hidden_extension_status').then(response => {
          this.hiddenExtensionStatusList = response.data
        })
        queryShortNameList({ parentId: this.companyCode.slice(0, 4) }).then(response => {
          this.basicUnitSeconds = response.data
        })
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
        rectificationList(this.queryParams).then(response => {
          this.tableList = response.data.records
          this.total = response.data.total
          this.loading = false
        })
      },
      handleSelectionChange(val) {
        this.ids = []
        this.multipleSelection = val
        this.ids = val.map(item => item.id)
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        // this.resetForm('queryForm')
        this.$refs.queryForm.resetFields();
        this.handleQuery()
      },
      handleDelete() {
        let flag = this.multipleSelection.some(el => el.newType != 1 || el.releaseStatus != 0 || el.status != 7)
        if (flag) {
          this.$message({
            message: '仅导入后未发布工单可删除！',
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
      handleAdd() {
        // if (this.multipleSelection[0].newType != 1 || this.multipleSelection[0].releaseStatus != 0 || this.multipleSelection[0].status != 3) {
        //   this.$message({
        //     message: '当前工单已发布！不能重复发布',
        //     type: 'warning'
        //   })
        //   return
        // }

        // if (!this.multipleSelection[0].rectificationFinishTime) {
        //   this.$message({
        //     message: '选择工单暂不支持发布！',
        //     type: 'warning'
        //   })
        //   return
        // }

        release(this.ids).then(res => {
          this.$message.success(res.msg)
          this.getList()
        })

        // if( this.multipleSelection[0].workflowId ){
        //   this.multipleSelection[0].updateTime = null // 改为已发布
        //   this.openSelectFlowUser = true;
        // }else{
        //   // this.multipleSelection[0].releaseStatus = 1 // 改为已发布
        //   this.multipleSelection[0].updateTime = null // 改为已发布
        //   createFlow(this.multipleSelection[0]).then(res=>{
        //     if(res.code == 200){
        //       this.multipleSelection = [res.data];
        //       this.openSelectFlowUser = true;
        //     }
        //   })
        // }

        // // release(this.ids).then(res=>{
        // //   if(res.code == 200){
        //     this.multipleSelection[0].releaseStatus = 1 // 改为已发布
        //     this.multipleSelection[0].updateTime = null // 改为已发布
        //     createFlow(this.multipleSelection[0]).then(res=>{
        //       if(res.code == 200){
        //         this.multipleSelection = [res.data];
        //         this.openSelectFlowUser = true;
        //         // this.$message.success('操作成功！')
        //         // this.getList();
        //       }
        //     })
        // //   }
        // // })

      },
      handleUpdate() {
        // if (this.multipleSelection[0].newType != 1) {   // newType 1批量导入 0正常流程
        //   this.$message({
        //     message: '当前工单不是导入形式！',
        //     type: 'warning'
        //   })
        //   return
        // }

        // if (this.multipleSelection[0].releaseStatus != 0) {
        //   this.$message({
        //     message: '当前工单已发布, 不可修改！',
        //     type: 'warning'
        //   })
        //   return
        // }

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

        this.rectEdit = true
      },
      handleRect() {
        // if(this.multipleSelection[0].responsibleBy != this.nickName){
        //   this.$message({
        //     message: '该数据无法操作!',
        //     type: 'warning'
        //   });
        //   return;
        // }
        if (this.multipleSelection[0].releaseStatus != 1) {
          this.$message({
            message: '当前工单尚未发布！',
            type: 'warning'
          })
          return
        }
        if (this.multipleSelection[0].status == 6) {
          this.$message({
            message: '该记录已完成整改！',
            type: 'warning'
          })
          return
        }
        if (this.multipleSelection[0].status != 3 && this.multipleSelection[0].status != 10) {
          this.$message({
            message: '已发起审批！当前数据无法操作！',
            type: 'warning'
          })
          return
        }
        this.detailId = this.multipleSelection[0].id
        this.dialogTitle = '整改'
        this.dialogVisible = true
        this.isEdit = true
        this.isInfo = false

        this.isRect = true
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
            spinner: 'el-icon-loading'
          })
          this.download('/api/idevelop-hidden/order/export', {
            ...this.queryParams
          }, `隐患整改工单${this.formatDate(new Date(), 'yyyy-MM-dd-hh:mm:ss')}.xlsx`, loading)
        }).catch(function() {
        })
      },
      checkLog() {
        this.detailId = this.multipleSelection[0].id
        this.workflowId = this.multipleSelection[0].workflowId
        this.worklogVisible = true
      },
      handleDblclick(row) {
        this.detailId = row.id
        this.dialogTitle = '详情'
        this.dialogVisible = true
        this.isEdit = true
        this.isInfo = true
        this.isRect = false
      },
      closeDialog() {
        this.importTableVisible = false
        this.dialogVisible = false
        this.getList()

        this.rectEdit = false

        // 刷新待办工作菜单数量
        this.$store.dispatch('hiddenTotal')
      },

      // 格式化数据
      formatHiddenSource(row) {
        return this.selectDictLabel(this.hiddenSourceList, row.hiddenSource)
      },
      formatHiddenCategory(row) {
        return this.selectDictLabel(this.hiddenCategoryList, row.hiddenCategory)
      },
      formatState(row) {
        // if (row.status == 3 && row.releaseStatus == 0 && row.newType == 1) {
        //   return '待发布'
        // }
        // if (row.isRefuteCancel == '1') {
        //   return '已终止'
        // }
        return this.selectDictLabel(this.statusList, row.status)
      },

      formatSecondCompany(row) {
        if (!row.secondCompany) return ''
        let data = this.basicUnitSeconds
        // if(row.secondCompany.toString().length == 5){
        //   data = this.basicUnitSeconds;
        // }else{
        //   data = this.basicUnitSeconds[0].children;
        // }
        for (let i = 0; i < data.length; i++) {
          if (row.secondCompany == data[i].orgId) {
            return data[i].shortName
          }
        }
      },

      //导入
      importExcel() {
        this.upload.open = true
      },
      
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submitFileForm()
      },
      
      
      formatRectificationStatus(row) {
        if (row.isRectification == 0) {
          return '待整改'
        }
        if (row.isRectification == 1) {
          return '整改中'
        }
        if (row.isRectification == 2) {
          return '已整改'
        }
      },
      formatRectificationExtensionStatus(row) {
        // "0=已超期,1=未超期,2=即将超期
        if (row.isOverdue == 0) {
          return '已超期(' + row.overdueDays + '天)'
        }
        if (row.isOverdue == 1) {
          return '未超期'
        }
        if (row.isOverdue == 2) {
          return '即将超期(' + row.overdueDays + '天)'
        }
        return ''
      },

      clearClassify() {
        this.queryParams.isOverdue = undefined
      },
      changeClassify(value) {
        this.queryDisabled.showRectificationExtension = true
        if (value !== '' && value == 2) {
          this.queryDisabled.showRectificationExtension = false
          this.queryParams.isOverdue = undefined
        }

        this.$nextTick(() => {
          this.$refs['tabble'].doLayout()
        })
      },

      // 获取自适应高度
      getCurrentHeight() {
        let windowHeight = window.innerHeight //窗口高度
        this.tableHeight = (windowHeight - 335) + 'px'
      }
    }
  }
</script>

<style lang='scss' scoped>
  /deep/ .el-table .seriousWarn {
    background: #e91b24;
    color: #333;
  }

  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background: none;
  }

  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: none;
  }

  .el-col-8 {
    height: 30px;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }

  .el-cascader {
    width: 100%;
  }

  .el-select {
    width: 100%;
  }

  .el-input {
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
