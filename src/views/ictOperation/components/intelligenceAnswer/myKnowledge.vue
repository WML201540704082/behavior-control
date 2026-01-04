<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="我的典型经验"
      width="1000px"
      top="5vh"
      v-el-drag-dialog
    >
      <el-form
        ref="searchForm"
        :model="searchForm"
        label-suffix=":"
        label-width="100px"
        @submit.native.prevent
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="知识标题" prop="title">
              <el-input v-model="searchForm.title" placeholder="请输入" @keyup.enter.native="search" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核状态" prop="status">
              <el-select v-model="searchForm.status" clearable placeholder="请选择" size="small">
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
          <el-col :span="12" class="btn_box">
            <el-button size="mini" type="primary" @click="search">查询</el-button>
            <el-button size="mini" type="primary" plain @click="restForm">重置</el-button>

          </el-col>
        </el-row>
      </el-form>
      <div class="table_box">
        <el-table
          ref="questionList"
          :data="tableData"
          :height="'600px'"
          border
          stripe
          size="mini"
          v-loading="tableLoading"
        >
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column label="知识标题" prop="title" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="知识描述" prop="problem" align="center" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column label="审核状态" prop="status" align="center" show-overflow-tooltip></el-table-column> -->
          <el-table-column label="审核状态" prop="status" show-overflow-tooltip width="80">
              <template  slot-scope="scope">
                <span>{{ showDictLable(scope.row.status) }}</span>
              </template>
            </el-table-column>
          <el-table-column label="审核意见" prop="comment" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip width="120"></el-table-column>
          <el-table-column label="操作" align="center" width="140">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="handle1(scope.row)" v-if="scope.row.status == '0'" style="margin-right: 12px">编辑</el-link>
              <el-link type="primary" :underline="false" @click="submit(scope.row)" v-if="scope.row.status == '0'" style="margin-right: 12px">提交</el-link>
              <el-link type="danger" :underline="false" @click="delBtn(scope.row)" v-if="scope.row.status == '0'">删除</el-link>
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
    </el-dialog>

    <!-- 新建知识弹窗 -->
    <addKnowledge
      v-if="showUpload2"
      :questionId="questionId"
      :isShow="showUpload2"
      @close="lll"
    ></addKnowledge>
  </div>
</template>

<script>
import { myKnowledge, knowledgeDelete, knowledgeSubmit } from "@/api/ictOperation/index"
import addKnowledge from './addKnowledge'
// 文件上传
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'
import { formatDate } from '@/util/date'

export default {
  components: {addKnowledge},
  props: ['isShow'],
  data() {
    return{
      statusList: [
        {
          dictKey: 1,
          dictValue: '待审核'
        },
        {
          dictKey: 2,
          dictValue: '已审核'
        },
        {
          dictKey: 0,
          dictValue: '暂存'
        },
      ],

      searchForm: {
        current: 1,
        size: 20,
        title: '',
      },
      tableData: [],
      total: 0,
      tableLoading: false,
      
      questionId: undefined,
      showUpload2: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    submit(row){
      this.$confirm("是否确认提交!","提示",{
        confirmButtonText:"确认",
        cancelButtonText:"取消",
        type:"warning"
      }).then( async ()=>{
        
        // this.saveLoading = true;
        knowledgeSubmit(row).then((res) => {
          this.$message({
            message: "提交成功！",
            type: "success",
          });
          // this.saveLoading = false;
          this.getList()
        });

      })
      
    },
    lll(){
      this.showUpload2 = false
      this.getList()
    },
    showDictLable(status){
      switch (status) {
        case '0':
          return '暂存'
          // break;
        case '1':
          return '待审核'
          // break;
        case '2':
          return '已审核'
          // break;
        // default:
        //   break;
      }
    },
    getList() {
      this.tableLoading = true
      myKnowledge(this.searchForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      })
    },

    search() {
      this.searchForm.current = 1
      this.getList()
    },
    restForm() {
      this.searchForm = {
        current: 1,
        size: 20,
        resourceCondition: '',
      }
      this.getList()
    },
    handle1(item){
      this.questionId = item.id
      this.showUpload2 = true
    },
    delBtn(row) {
      this.$confirm('确定删除该典型经验?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        knowledgeDelete({id: row.id}).then(res => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.getList()
        })
      })
    },

  },
}
</script>

<style lang="scss" scoped>
::v-deep .btn_box{
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 20px;
}
</style>
