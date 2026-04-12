<template>
  <div class="question_list">
    <div class="list_title">
      <!-- <img src="../../img/myquestion.png" alt=""> -->
    </div>
    <!-- <div class="back_btn">
      <el-button type="primary" size="mini" plain icon="el-icon-arrow-left" @click="cancel">返回</el-button>
    </div> -->
    <div class="list_content">
      <div class="list_content_search">
        <el-form
          ref="searchForm"
          :model="searchForm"
          label-suffix=":"
          label-width="100px"
          class="xt_search_form xt_search_form3"
        >
          <el-row :gutter="6">
            <el-col :span="6">
              <el-form-item label="提报单位" prop="deptName">
                <xt-tree-lzay-select :formValue="searchForm.deptName"
                                   :selectType="'CORP'"
                                   @getTreeItem="getEntityUnit"
                ></xt-tree-lzay-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="问题类型" prop="type">
                <el-select v-model="searchForm.type" clearable placeholder="请选择问题状态">
                  <el-option
                    v-for="item in typeList"
                    :value="item.dictKey"
                    :key="item.dictKey"
                    :label="item.dictValue"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理状态" prop="status">
                <el-select v-model="searchForm.status" clearable placeholder="请选择问题状态">
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
            <el-col :span="6" style="text-align: right;line-height: 38px;">
              <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
              <el-button class="border-btn" size="small" @click="handleExport">导出</el-button>
              <el-button class="border-btn" size="small" icon="el-icon-arrow-left" @click="cancel">返回</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- <div class="list_content_t">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="我的问题" name="0"></el-tab-pane>
          <el-tab-pane label="待办任务" name="1" v-if="isRoleAlias"></el-tab-pane>
          <el-tab-pane label="已办任务" name="2" v-if="isRoleAlias"></el-tab-pane>
          <el-tab-pane label="需求" name="3" v-if="isRoleAlias"></el-tab-pane>
          <el-tab-pane label="催办列表" name="4" v-if="!isRoleAlias"></el-tab-pane>
        </el-tabs>

        <el-button class="border-btn" size="small" @click="handleExport">导出</el-button>
      </div> -->
      <div class="table_box" >
        <el-table
          ref="questionList"
          :data="questionData"
          :height="'calc(100% - 35px)'"
          border
          stripe
          size="mini"

          v-loading="tableLoading"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column label="问题名称" prop="title" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="问题提报人" prop="filler" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="发布时间" prop="createTime" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="问题类型" prop="type" align="center" show-overflow-tooltip :formatter="typeFormatter"></el-table-column>
          <el-table-column label="处理状态" prop="statusValues" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="处理人" prop="handler" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="seeDetail(scope.row)">查看</el-button>
              <!-- <el-button type="text" @click="handleEdit(scope.row)" v-if="activeName == 2">编辑</el-button> -->
              <el-button type="text" @click="handleOperate(scope.row)" v-if="scope.row.status != 2 && scope.row.view == 1">处理</el-button>
              <el-button type="text" v-if="scope.row.status == 0 || isRoleAlias" @click="delOrder(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"
        />
      </div>
    </div>

    <operateForm
      v-if="showOperate"
      :isShow="showOperate"
      :questionId="questionId"
      @close="showOperate = false"
      @submitProcess="submitProcess"
    />

    <solveForm
      v-if="showSolve"
      :isShow="showSolve"
      :questionId="questionId"
      @close="showSolve = false"
      @submitProcess="submitProcess"
    />

    <questionDetailForm
      v-if="showDetail"
      :isShow="showDetail"
      :questionId="questionId"
      :isJiejue="isJiejue"
      @close="showDetail = false"
      @submitProcess="submitProcess"
    />

    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      append-to-body
      :visible.sync="showUpdateForm"
      v-if="showUpdateForm"
      title="问题表单"
      width="1000px"
      v-el-drag-dialog
      top="5vh"
    >
      <questionForm :showType="'修改'" :questionId="questionId" :isYiban="activeName==2" @backQuestion="backQuestion"></questionForm>
    </el-dialog>
  </div>
</template>

<script>
import {
  myQuestionList,
  questionList,
  questionDoneList,
  hasten,
  listDemand,
  questionDelete,
  processCreate,
  questionSubmit,
  getNextUser,
  questionSend
} from "@/api/ictOperation/index"
import operateForm from './operateForm'
import solveForm from './solveForm'
import questionDetailForm from './questionDetailForm'
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import { getDictList } from "@/api/dict";
import questionForm from './questionForm';
import {mapGetters,mapState} from "vuex";

export default {
  components: { operateForm, questionDetailForm, questionForm, solveForm, xtTreeLzaySelect },
  data() {
    return{
      typeList: [],
      statusList: [
        {
          dictKey: '0',
          dictValue: '已提交'
        },
        {
          dictKey: '1',
          dictValue: '处理中'
        },
        {
          dictKey: '2',
          dictValue: '已解决'
        },
        {
          dictKey: '3',
          dictValue: '纳入需求'
        },
      ],

      isEdit: false,
      isJiejue: false,
      listApi: myQuestionList,
      searchForm: {
        deptId: undefined,
        deptName: undefined,
        type: undefined,
        status: undefined,
        current: 1,
        size: 20
      },
      questionData: [],
      total: 0,
      tableLoading: false,
      questionId: '',
      showOperate: false,
      showSolve: false,
      showDetail: false,
      showUpdateForm: false,

    }
  },
  computed: {
    ...mapGetters(["permission", "userDetail"]),
    permissionList() {
      return {
        questionTodo: this.vaildData(this.permission.question_todo, false),
        questionDone: this.vaildData(this.permission.question_done, false),
      };
    },
    isRoleAlias(){
      return this.$store.state.user.userDetail.roleAlias.includes('control_solver')
    }
  },
  mounted() {
    this.getDict()
    this.getList()
  },
  methods: {
    getEntityUnit(val) {
      //选择单位 部门
      this.searchForm.deptId = val.id
      this.searchForm.deptName = val.fullName
      this.$refs.searchForm.$forceUpdate()
      this.$forceUpdate()
    },
    handleSearch(){
      this.getList()
    },
    handleExport() {
      //导出
      let types1 = {
        '0': "我的问题",
        '1': "待办任务",
        '2': "已办任务",
        '3': "需求",
      }
      let types2 = {
        '0': "my",
        '1': "todo",
        '2': "done",
        '3': "demand",
      }

      
      this.$confirm("是否导出数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.download(
          "/api/idevelop-control/question/download/exportNew",
          this.searchForm,
          "全部问题.xlsx"
        )
      });
      
    },

    // 字典值
    getDict() {
      let dict = ['control_question_type']
      for(let i=0; i<dict.length; i++) {
        getDictList(dict[i]).then(res => {
          if(dict[i] == 'control_question_type') { //问题类型
            this.typeList = res.data
          }
        })
      }
    },

    getList() {
      // this.tableLoading = true
      // this.listApi(this.searchForm).then(res => {
      //   this.questionData = res.data.records
      //   this.total = res.data.total
      //   this.tableLoading = false
      // })

      this.tableLoading = true
      questionList(this.searchForm).then(res => {
        this.questionData = res.data.records
        this.total = res.data.total
        this.tableLoading = false 
      })
    },
    handleClick(tabs) {
      this.listApi = myQuestionList
      this.getList()
    },
    // seeDetail(row) {
    //   this.questionId = row.id
    //   if(row.status == 0) {
    //     this.showUpdateForm = true
    //   }else {
    //     this.showDetail = true
    //   }
    // },

    seeDetail(row, isJiejue) {
      this.questionId = row.id
      if(row.status == 0) {
        this.showUpdateForm = true
      }else {
        this.isJiejue = isJiejue
        this.showDetail = true
      }
    },



    handleEdit(row){
      // this.isEdit = true
      this.questionId = row.id
      this.showUpdateForm = true
    },
    async handleOperate(row) {
      if(row.status == 0) {
        let createRes = await processCreate({id: row.id})
      }
      this.questionId = row.id

      if(this.isRoleAlias){ // 处理人
        this.showOperate = true
      }else{ // 提报人
        questionSubmit({
          userName: this.userDetail.userName,
          comment: "问题提交",
          id: row.id
        }).then(res => {
          this.submitProcess()
        })
      } 
    },

    async handleSolve(row) {
      this.questionId = row.id
      this.showSolve = true
    },


    delOrder(row) {
      this.$confirm('确定删除该问题?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        questionDelete({id: row.id}).then(() => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.getList()
        })
      })
    },
   
    cancel() {
      this.$emit('backQuestion')
    },
    submitProcess() {
      this.showOperate = false
      this.showSolve = false
      this.$message({
        message: '处理成功！',
        type: 'success'
      });
      this.getList()
    },
    typeFormatter(row) {
      return this.selectDictLabel(this.typeList, row.type)
    },
    isResolveFormatter(row){
      if(row.isResolve == 1){
        return '已解决'
      }else{
        return '未解决'
      }
    },
    backQuestion() {
      this.showUpdateForm = false
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .xt_search_form3 .el-input__inner {
    background-color: #FFF;
    border-color: #DCDFE6;
}


.list_content_t{
  position: relative;
}
.border-btn{
  // position: absolute;
  // top: 5px;
  // right: 2px;
}
.question_list{
  position: relative;
  height: 50vh;
  box-shadow: 0 4px 25px 0 #e9f0ff;
  padding: 0 40px;
  position: relative;
  .back_btn{
    margin-bottom: 15px;
    position: absolute;
    top: 0px;
    left: 40px;
  }
  .list_title{
    text-align: center;
    margin-bottom: 20px;
  }
  .list_content{
    height: calc(100% - 20px);
  }
  .table_box{
    height: calc(100% - 54px);
  }
}
</style>
