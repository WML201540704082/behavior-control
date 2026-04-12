<template>
  <div>
    <basic-container>
      <!-- <el-header style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;"> -->
        <div class="page_form">
          <el-form class="xt_search_form" ref="queryForm" :model="queryParams" label-width="105px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="隐患编号:" prop="processInstName">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="queryParams.processInstName"
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
                <el-form-item label="责任单位:" prop="applyCompany">
                  <!-- <el-select v-model="queryParams.applyCompany" size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in basicUnitSeconds"
                      :value="item.orgId"
                      :key="item.orgId"
                      :label="item.shortName"
                    >
                    </el-option>
                  </el-select> -->
                  <JobUnit :orgId.sync="queryParams.applyCompany"></JobUnit>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <div> -->
              <el-row class="btnLine">
                <el-button type="primary" size="mini"  icon="el-icon-search"
                           @click="handleQuery">查询</el-button>
                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-refresh-left"
                           @click="resetQuery">重置</el-button>

                <!-- <el-button type="primary" icon="el-icon-download" size="mini" @click="exportExcel" style="margin-left: 5px;">导出</el-button> -->
                <el-button type="primary" icon="el-icon-search" size="mini" :disabled="multipleSelection.length != 1" @click="checkLog" style="margin-left: 5px;">查看工作日志</el-button>


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
            @row-dblclick="handleDblclick"
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%;height:100%;margin-top:5px;">
            <el-table-column
              type="selection"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column prop="processInstName" label="隐患编号" width="160">
              <template slot-scope="scope">
                <a style="color:blue;text-decoration:underline;cursor:pointer;" @click="showDetail(scope.row)">{{scope.row.processInstName}}</a>
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
              :formatter="formatHiddenSource"
              width="160"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="hiddenCategory"
              align="left"
              label="隐患分类"
              sortable
              width="160"
              :formatter="formatHiddenCategory"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="workItemName"
              label="工单状态"
              sortable
              width="160"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="applyDept"
              align="left"
              label="责任单位"
              sortable
              width="160"
              show-overflow-tooltip>
              <!-- :formatter="formatSecondCompany" -->
            </el-table-column>
            <el-table-column
              prop="applyUser"
              align="left"
              label="整改责任人"
              sortable
              width="160"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="rectificationExpectTime"
              align="left"
              label="整改期限"
              sortable
              width="160"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <!-- v-show="total>0" -->
          <pagination
            
            :total="total"
            :page.sync="queryParams.currentPage"
            :limit.sync="queryParams.size"
            @pagination="getList"
          />
        </div>
      <!-- </el-main> -->
    </basic-container>

    <!-- 详情 -->
    <div v-if="reportVisible">
      <el-dialog :modal-append-to-body="false" :title="dialogTitle" style="padding: 0px;"
                 :close-on-click-modal="false" :visible.sync="reportVisible"
                 :before-close="closeDialog"  width="80%">
        <ReportDetail @closeRoom="closeDialog" :detailId="detailId" :is-edit="isEdit" :is-info="isInfo"/>
      </el-dialog>
    </div>

    <!-- 工作日志 -->
    <div v-if="worklogVisible">
      <el-dialog :modal-append-to-body="false" title="工作日志" :visible.sync="worklogVisible" width="80%">
        <WorkLog @closeRoom="worklogVisible = false" :detailId="detailId"/>
      </el-dialog>
    </div>



    <!-- 整改详情 -->
    <div v-if="rectificationVisible">
      <el-dialog :modal-append-to-body="false" :title="dialogTitle" style="padding: 0px;"
                 :close-on-click-modal="false" :visible.sync="rectificationVisible"
                 :before-close="closeDialog"  width="80%">
        <RectificationDetail @closeRoom="closeDialog" :detailId="detailId" :is-edit="isEdit" :is-info="isInfo"/>
      </el-dialog>
    </div>


  </div>
</template>

<script>
  import ReportDetail from "../report/components/detail";
  import RectificationDetail from "../rectification/components/detail";
  import WorkLog from "../report/components/workLog";

  import { mapGetters } from 'vuex'



  import { orderList, queryShortNameList } from "@/api/safeDanger/report"
  import { queryUndoWorkItems, queryDoneWorkItems } from "@/api/safeDanger/todoWork"
  import { securitySupervision } from "@/api/safeDanger/networkSecure"
  import { allCategory } from "@/api/safeDanger/computerroom"


  export default {
    name: "index",
    computed: {
      ...mapGetters([
        'nickName',
        'companyId',
        'companyCode',
      ]),
    },
    components: {ReportDetail, RectificationDetail, WorkLog},
    props:{
      types: {
        type: Boolean,
        default: false
      }

    },
    data() {
      return {
        worklogVisible: false,

        tableHeight:undefined,
        // 查询参数
        queryParams: {
          currentPage: 1,
          size: 10,
          
          processInstName: undefined,
          hiddenSource: undefined,
          status: undefined,
          hiddenCategory: undefined,
          hiddenStatus: undefined,
          applyCompany: undefined,
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
        loading: true,
        // 弹框层
        isEdit: false,
        isInfo: false,
        detailId: undefined,
        workflowId: undefined,
        dialogTitle: '',
        reportVisible: false,
        rectificationVisible: false,
        // 下拉列表
        hiddenSourceList: [],
        hiddenCategoryList: [],
        hiddenCategoryList2: [],
        statusList: [],
        basicUnitSeconds: [],
        supervisionList: [],
        categoryList: []
      }
    },
    created() {
      // 第三方门户待办跳转过来
      // let username = this.$route.query.username
      // let hiddenOrder = this.$route.query.hiddenOrder
      // if( username ){
      //   this.queryParams.processInstName = hiddenOrder          
      // }

      this.initData()
      this.getList(true);
    },
    mounted() {
      this.getCurrentHeight()
      window.addEventListener('resize', this.getCurrentHeight)
      window.addEventListener('webkitvisibilitychange', this.getCurrentHeight)
    },
    methods: {
      initData(){
        this.getDicts('hidden_source').then(response => {
          this.hiddenSourceList = response.data
        });
        this.getDicts('hidden_category').then(response => {
          this.hiddenCategoryList = response.data
        });

        if(this.types){ // 已处理
          this.getDicts('hidden_doneWork_state').then(response => {
            this.statusList = response.data
          });
        }else{ // 未处理
          this.getDicts('hidden_todoWork_state').then(response => {
            this.statusList = response.data
          });
        }
        


        queryShortNameList({ parentId: this.companyCode.slice(0, 4) }).then(response => {
          this.basicUnitSeconds = response.data
        })
        securitySupervision().then(res=>{
          this.supervisionList = res.data
        })
        allCategory().then(res=>{
          this.categoryList = res.data
        })
      },

      getList(init) {
        this.loading = true
        if (this.queryParams.status != undefined && this.queryParams.status != '') {
          this.statusList.forEach(el => {
            if (el.dictValue == this.queryParams.status) {
              this.queryParams.hiddenStatus = el.dictLabel
            }
          })
        }else{
          this.queryParams.hiddenStatus = undefined
        }
        this.queryParams.workNo = this.queryParams.processInstName;
        if(this.types){ // 已处理
          queryDoneWorkItems(this.queryParams).then(response =>{
            let datas = response.list
            if(datas.length>0){
              datas = datas.map(ele=> {
                return {
                  hiddenId: ele.params.hiddenId,
                  processInstName: ele.wfWorkItem.processInstName,
                  content: ele.params.content,
                  hiddenSource: ele.params.hiddenSource,
                  hiddenCategory: ele.params.hiddenCategory,
                  processDefName: ele.wfWorkItem.processDefName,
                  activityInstName: ele.wfWorkItem.activityInstName,
                  workItemName: ele.wfWorkItem.workItemName,
                  applyCompany: ele.applyCompany,
                  applyDept: ele.applyDept,
                  applyUser: ele.applyUser,
                  rectificationExpectTime: ele.params.rectificationExpectTime
                }
              } )
            }

            this.tableList = datas
            this.total = response.data.total
            this.loading = false
          })
        }else{ // 待处理
          queryUndoWorkItems(this.queryParams).then(response =>{
            let datas = response.list
            if(datas.length>0){
              datas = datas.map(ele=> {
                return {
                  hiddenId: ele.params.hiddenId,
                  processInstName: ele.wfWorkItem.processInstName,
                  content: ele.params.content,
                  hiddenSource: ele.params.hiddenSource,
                  hiddenCategory: ele.params.hiddenCategory,
                  processDefName: ele.wfWorkItem.processDefName,
                  activityInstName: ele.wfWorkItem.activityInstName,
                  workItemName: ele.wfWorkItem.workItemName,
                  applyCompany: ele.applyCompany,
                  applyDept: ele.applyDept,
                  applyUser: ele.applyUser,
                  rectificationExpectTime: ele.params.rectificationExpectTime
                }
              } )
            }

            if(init){
              let seletRow = datas.filter(ele=> ele.hiddenId == this.$route.query.hiddenOrder)[0]
              if(seletRow) { this.showDetail(seletRow) }
            }
            
            

            this.tableList = datas
            this.total = response.data.total
            this.loading = false


          })
        }

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
      showDetail(row){
        this.detailId = row.hiddenId;
        this.isEdit = true
        this.isInfo = false
        // hidden_order 提报   hidden_order_rectification 整改


        if(row.activityInstName.includes('提报')){
          this.dialogTitle = '隐患提报单'
          this.reportVisible = true;
        }
        if(row.activityInstName.includes('整改')){
          this.dialogTitle = '隐患整改单'
          this.rectificationVisible = true;
        }
        if(row.activityInstName == '结束'){
          this.dialogTitle = '隐患整改单'
          this.rectificationVisible = true;
        }

        if(this.types){
          this.isEdit = false
          this.isInfo = true
        }

      },
      exportExcel() {
        this.queryParams.num = 1;
        this.queryParams.size = 999999;
        if (this.types) {
          // false 已处理
          this.queryParams.undoOrDone = false
        } else {
          // true 待处理
          this.queryParams.undoOrDone = true
        }
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
          this.download('/api/idevelop-hidden/bpm/export/workItems', {
            ...this.queryParams
          }, `待办工作工单${this.formatDate(new Date(), 'yyyy-MM-dd-hh:mm:ss')}.xlsx`, loading)
        }).catch(function() {
        })
      },
      checkLog() {
        this.detailId = this.multipleSelection[0].hiddenId
        this.worklogVisible = true
      },
      handleDblclick(row) {
        // this.detailId = row.id;
        // this.dialogTitle = '详情';
        // this.reportVisible = true;
        // this.isEdit = true
        // this.isInfo = true
      },
      closeDialog(){
        this.reportVisible = false
        this.rectificationVisible = false
        this.getList();

        // 刷新待办工作菜单数量
        this.$store.dispatch('hiddenTotal')
      },

      // 格式化数据
      formatHiddenSource(row){
        return this.selectDictLabel( this.hiddenSourceList, row.hiddenSource )
      },
      formatHiddenCategory(row){
        if(row.hiddenCategory){
          let one = row.hiddenCategory.split('-')[0]
          one = this.selectDictLabel( this.hiddenCategoryList, one )

          let data;
          if(row.hiddenCategory.split('-')[0] == 0){ // 机房
            data = this.categoryList
            data.forEach(el=> { el.dictLabel = el.category; el.dictValue = el.id; } )
          }else{
            data = this.supervisionList
            data.forEach(el=> { el.dictLabel = el.supervision; el.dictValue = el.id; } )
          }

          let two = row.hiddenCategory.split('-')[1]
          if(two){
            // console.log(789, row.hiddenCategory.split('-')[0], data, two)
            two = this.selectDictLabel( data, two )
            return one +'-'+ two
          }
          return one
        }

      },
      formatState(row){
        // return this.selectDictLabel( this.statusList, row.workItemName )

        let type; // hidden_order 提报   hidden_order_rectification 整改
        if(row.processDefName == 'hidden_order'){
          type = '隐患提报'
        }else{
          type = '隐患整改'
        }
        return type + '——' + row.workItemName
      },

      formatSecondCompany(row){
        if(!row.applyCompany) return ''
        let data = this.basicUnitSeconds;
        for (let i = 0; i < data.length; i++) {
          if (row.applyCompany == data[i].orgId) {
            return data[i].shortName;
          }
        }
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
</style>
