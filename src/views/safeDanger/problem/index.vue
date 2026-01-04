<template>
  <div>
    <basic-container>
      <!-- <el-header style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;"> -->
        <div class="page_form">
          <el-form class="xt_search_form" ref="queryForm" :model="queryParams" label-width="105px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="问题编号:" prop="problemNumber">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="queryParams.problemNumber"
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="问题类型:" prop="problemType">
                  <el-select v-model="queryParams.problemType" size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in problemTypeList"
                      :value="item.dictValue"
                      :key="item.dictKey"
                      :label="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="当前状态:" prop="status">
                  <el-select v-model="queryParams.status" size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in statusList"
                      :value="item.dictKey"
                      :key="item.dictKey"
                      :label="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

            </el-row>
            <!-- <div class="btnLine">  style="padding-top:10px;padding-left: 20px" -->
              <el-row class="btnLine">
                <el-button type="primary" size="mini"  icon="el-icon-search"
                           @click="handleQuery">查询</el-button>
                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-refresh-left"
                           @click="resetQuery">重置</el-button>

                <el-button  type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-plus"
                            @click="handleAdd" v-hasPermi="['hidden:problem:insert']">新增</el-button>

                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-edit"
                           :disabled="multipleSelection.length != 1 || (multipleSelection.length == 1 && multipleSelection[0].status !== 0)"
                           @click="handleUpdate" v-hasPermi="['hidden:problem:update']">修改</el-button>

                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-delete"
                           :disabled="multipleSelection.length == 0 || !(multipleSelection.every(el => el.status === 0) )"
                           @click="handleDelete" v-hasPermi="['hidden:problem:remove']">删除</el-button>

                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-edit"
                           :disabled="multipleSelection.length != 1 || (multipleSelection.length == 1 && multipleSelection[0].status !== 0)"
                           @click="submitForm" v-hasPermi="['hidden:problem:submit']">提交</el-button>

                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-edit"
                           :disabled="multipleSelection.length != 1 || !(multipleSelection.length == 1 && multipleSelection[0].status === 1)"
                           @click="handleConfirm" v-hasPermi="['hidden:problem:confirm']">问题确认</el-button>

                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-edit"
                           :disabled="multipleSelection.length != 1 || (multipleSelection.length == 1 && multipleSelection[0].status === 3)"
                           @click="handleUpdate" v-hasPermi="['hidden:problem:recode']">问题处理</el-button>

                <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-edit"
                           :disabled="multipleSelection.length != 1 || (multipleSelection.length == 1 && multipleSelection[0].status === 3)"
                           @click="finishForm" v-hasPermi="['hidden:problem:finish']">完成</el-button>

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
            border
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
              prop="problemNumber"
              label="问题编号"
              sortable
              width="140"
            >
              <template slot-scope="scope">
                <a style="color:blue;text-decoration:underline;cursor:pointer;" @click="handleDblclick(scope.row)">{{scope.row.problemNumber}}</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="problemContent"
              align="left"
              label="问题内容"
              sortable
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="problemType"
              align="left"
              label="问题类型"
              sortable
              width="120"
              :formatter="formatProblemType"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="feedbackUser"
              align="left"
              label="反馈人员"
              sortable
              width="120"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="feedbackPhone"
              align="left"
              label="联系方式"
              sortable
              width="120"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="planFinishTime"
              align="left"
              label="预计完成时间"
              sortable
              width="140"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="finishTime"
              align="left"
              label="完成时间"
              sortable
              width="140"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="status"
              align="left"
              label="当前状态"
              sortable
              width="120"
              :formatter="formatStatus"
              show-overflow-tooltip>
            </el-table-column>
            <!-- <el-table-column
              prop="claimStatus"
              label="是否认领"
              sortable
              width="160"
              :formatter="formatClaimStatus"
              show-overflow-tooltip>
            </el-table-column> -->

          </el-table>
          <!-- v-show="total>0" -->
          <pagination
            
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

    <!-- 预计完成时间 -->
    <div class="queren" v-if="planFinishTimeShow">
      <el-dialog :modal-append-to-body="false" title="问题确认" style="padding: 0px;"
                 :close-on-click-modal="false" :visible.sync="planFinishTimeShow"
                 :before-close="beforeClose"  width="500px">
        <el-form ref="mmm" :rules="rules" :model="kkk" label-width="120px" style="margin-top: 20px;">
          <el-form-item label="预计完成时间:" prop="planFinishTime">
              <el-date-picker size="mini" v-model="kkk.planFinishTime" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-form>
        <div style="text-align: right;">
          <el-button type="primary" size="mini" style="margin-top: 25px;" icon="el-icon-check" @click="orderConfirm">保存</el-button>
        </div>

      </el-dialog>
    </div>

  </div>
</template>

<script>
import Detail from "./components/detail";

import { mapGetters } from 'vuex'
import { orderList, orderRemove, orderSub, orderFinish, orderConfirm } from "@/api/safeDanger/problem"

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
    Detail
  },
  data() {
    return {
      //校验
      rules:{
        planFinishTime:[{required:true,message:'请选择预计完成时间',trigger:'change'}],
      },
      kkk: {
        planFinishTime: ''
      },
      tableHeight:undefined,
      // 查询参数
      queryParams: {
        current: 1,
        size: 20,
        problemNumber: undefined,
        problemType: undefined,
        status: undefined,
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
      dialogVisible: false,
      // 下拉列表
      problemTypeList: [],
      statusList: [],

      planFinishTimeShow: false
    }
  },
  created() {
    this.initData()
    this.getList();
  },
  mounted() {
    this.getCurrentHeight()
    window.addEventListener('resize', this.getCurrentHeight)
    window.addEventListener('webkitvisibilitychange', this.getCurrentHeight)
  },
  methods: {
    beforeClose(){
      this.planFinishTimeShow = false
    },
    /** 提交按钮 */
    submitForm: function(e, isSub) {
      orderSub([ this.multipleSelection[0].id ]).then(response => {
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    orderConfirm(){
      this.$refs["mmm"].validate(valid => {
        if (valid) {
          orderConfirm({
            id: this.multipleSelection[0].id,
            planFinishTime: this.kkk.planFinishTime
          }).then(response => {
            if (response.code === 200) {
              this.planFinishTimeShow = false
              this.msgSuccess(response.msg);
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });


        }
      })

    },



    initData(){
       this.getDicts('problem_feedback_type').then(response => {
        this.problemTypeList = response.data
      });
      this.getDicts('problem_feedback_status').then(response => {
        this.statusList = response.data
      });
    },
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
      this.queryParams.current = 1
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleDelete() {
      // let flag = this.multipleSelection.some(el => el.claimStatus == 0)
      let flag = this.multipleSelection.some(el => el.newType == 1)
      if (flag) {
        this.$message({
          message: '当前反馈单不可删除！',
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
          this.msgSuccess('删除成功');
        }
      }).catch(function() {});
    },
    handleAdd() {
      this.detailId = undefined
      this.dialogTitle = '问题反馈单'
      this.dialogVisible = true
      this.isEdit = false
      this.isInfo = false
    },
    handleConfirm(){
      this.planFinishTimeShow = true
    },
    handleUpdate() {
      // if(this.multipleSelection.length<=0 || this.multipleSelection.length>1){
      //   this.$message({
      //     message: '请选择一条需要修改记录！',
      //     type: 'warning'
      //   });
      //   return;
      // }
      // if(this.multipleSelection[0].status > 0 && this.multipleSelection[0].status != 10){
      //   this.$message({
      //     message: '流程已发起,不可编辑!',
      //     type: 'warning'
      //   });
      //   return;
      // }
      this.detailId = this.multipleSelection[0].id;
      this.dialogTitle = '编辑';
      this.dialogVisible = true;
      this.isEdit = true
      this.isInfo = false
    },
    finishForm(){
      orderFinish({ id: this.multipleSelection[0].id }).then(response => {
        if (response.code === 200) {
          this.getList();
          this.msgSuccess(response.msg);
        } else {
          this.msgError(response.msg);
        }
      });
    },


    handleDblclick(row) {
      this.detailId = row.id;
      this.dialogTitle = '详情';
      this.dialogVisible = true;
      this.isEdit = false
      this.isInfo = true
    },
    closeDialog(){
      this.dialogVisible = false
      this.getList();
    },

    // 格式化数据
    formatProblemType(row){
      return row.problemType
      // return this.selectDictLabel( this.problemTypeList, row.problemType )
    },
    formatStatus(row){
      return this.selectDictLabel( this.statusList, row.status )
    },

    // 获取自适应高度
    getCurrentHeight() {
      let windowHeight = window.innerHeight //窗口高度
      this.tableHeight = (windowHeight - 290) + 'px'
    },
  }
}
</script>

<style lang='scss' scoped>
  ::v-deep .queren .el-dialog__body{
    height: 200px !important;
  }

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
