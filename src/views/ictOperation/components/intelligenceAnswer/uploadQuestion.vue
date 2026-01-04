<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="知识库"
      width="1000px"
      top="5vh"
      v-el-drag-dialog
    >
      <div class="library">
        <div class="library-l">
          <el-tree
            :data="treeData"
            :props="{
              children: 'children',
              label: 'title'
            }"
            @node-click="handleNodeClick"
            default-expand-all>
          </el-tree>
        </div>
        <div class="library-r">
          <el-form
            ref="searchForm"
            :model="searchForm"
            label-suffix=":"
            label-width="100px"
            @submit.native.prevent
          >
            <el-row>
              <el-col :span="10">
                <el-form-item label="问题标题" prop="resourceCondition">
                  <el-input v-model="searchForm.resourceCondition" @keyup.enter.native="search" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14" class="btn_box">
                <el-button size="mini" type="primary" @click="search">查询</el-button>
                <el-button size="mini" type="primary" plain @click="restForm">重置</el-button>
                <el-upload
                  ref="upload"
                  name="file"
                  :limit="1"
                  accept=".xlsx,.xls"
                  :headers="headers"
                  :action="action"
                  :http-request="uploadFile2"
                  :before-upload="beforeUpload"
                  :on-success="handleFileSuccess"
                  :show-file-list="false"
                >
                  <el-button size="mini" type="primary" plain style="margin: 0 10px;">上传</el-button>
                </el-upload>
                <el-button size="mini" type="primary" plain @click="handleDownload">模板下载</el-button>
                <el-button size="mini" type="primary" @click="handleExport">导出</el-button>
              </el-col>
            </el-row>
          </el-form>
          <div class="table_box">
            <el-table
              ref="questionList"
              :data="tableData"
              :height="'500px'"
              border
              stripe
              size="mini"
              v-loading="tableLoading"
            >
              <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
              <el-table-column label="知识标题" prop="problem" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="知识详情" prop="answer" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="提报人" prop="createBy" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="联系电话" prop="phone" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="审核状态" prop="status" show-overflow-tooltip width="80">
                  <template  slot-scope="scope">
                    <span>{{ showDictLable(scope.row.status) }}</span>
                  </template>
                </el-table-column>
              <el-table-column label="审核意见" prop="comment" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" align="center" width="120">
                <template slot-scope="scope">
                  <!-- icon="el-icon-delete"  -->
                  <el-link type="primary" :underline="false" @click="handle1(scope.row)" v-if="scope.row.status == 1" style="margin-right: 12px">审核</el-link>
                  <el-link type="danger" :underline="false" @click="delBtn(scope.row)">删除</el-link>
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
      </div>




    </el-dialog>

    <operateForm
      v-if="showOperate"
      :isShow="showOperate"
      :questionId="questionId"
      @close="showOperate = false"
      @submitProcess="submitProcess"
    />
  </div>
</template>

<script>
import { knowledgePage, knowledgeDelete, knowledgeTree, knowledgeUploadFile } from "@/api/ictOperation/index"
// 文件上传
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'
import { formatDate } from '@/util/date'
import operateForm from './operateForm'

export default {
  props: ['isShow'],
  components: { operateForm },
  data() {
    return{
      showOperate: false,
      questionId: undefined,

      searchForm: {
        current: 1,
        size: 20,
        resourceCondition: '',
        type: undefined
      },
      tableData: [],
      total: 0,
      tableLoading: false,
      action: '#', // /api/idevelop-control/knowledge/load
      headers: {
        Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
        'Idevelop-Auth': 'bearer ' + getToken()
      },

      treeData: [],

    }
  },
  mounted() {
    this.getList()
    knowledgeTree({}).then(res => {
      this.treeData = res.data
    })
  },
  methods: {
    uploadFile2( params ){
      const file = params.file

      const formData = new FormData()
      formData.append("file", file)

      knowledgeUploadFile(formData).then(res=>{
        params.onSuccess(res)
      })
    },
    // 导出
    handleExport() {
      this.download(
        "/api/idevelop-control/knowledge/export",
        this.searchForm,
        "知识库.xlsx"
      );
    },
    handleNodeClick(data){
      this.searchForm.type = data.key
      this.getList()
    },

    handle1(item){
      this.questionId = item.id
      this.showOperate = true
    },
    submitProcess(){
        this.showOperate = false
        this.getList()
    },

    showDictLable(status){
      switch (status) {
        case '0':
          return '暂存'
          // break;
        case '1':
          return '已提交'
          // break;
        case '2':
          return '已完成'
          // break;
        // default:
        //   break;
      }
    },
    getList() {
      this.tableLoading = true
      knowledgePage(this.searchForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      })
    },
    beforeUpload(file) {

    },
    handleFileSuccess(res, file, fileList) {
      if(res.code == 200) {
        this.$message({
          message: '问答上传成功！',
          type: 'success'
        });
        this.getList()
      }else {
        this.$message({
          message: res.msg,
          type: 'error'
        });
      }
      
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
        type: undefined
      }
      this.getList()
      knowledgeTree({}).then(res => {
        this.treeData = res.data
      })
    },
    delBtn(row) {
      this.$confirm('确定删除该问答项?', '提示', {
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

    handleDownload() {
      this.download('/api/idevelop-control/knowledge/download/template', {
        ...this.queryParams
      }, `智能问答上传模板${formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')}.xlsx`, '')
    }
  },
}
</script>

<style lang="scss" scoped>
.library{
  width: 100%;
  display: flex;
  .library-l{
    width: 25%;
  }
  .library-r{
    flex: 1;
  }
}

::v-deep .btn_box{
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 20px;
}
</style>
