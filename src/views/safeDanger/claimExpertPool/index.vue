<template>
  <div>
    <basic-container>
      <!-- <el-header
        style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;"> -->
        <div class="page_form">
          <el-form class="xt_search_form" ref="queryForm" :model="queryParams" label-width="105px" @submit.native.prevent>
            <el-row>
              <el-col :span="8">
                <el-form-item label="姓名:" prop="realName">
                  <el-input placeholder="请输入姓名" clearable size="mini" v-model="queryParams.realName" @keyup.enter.native="getList"></el-input>
                </el-form-item>
              </el-col>


              <el-col :span="16">
                <el-form-item label-width="12px">
                  <div class="d_start v_center d_btns">
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch" :loading="loading">查询</el-button>
                    <el-button v-hasPermi="['hidden:inspector:add']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
                    <el-button v-hasPermi="['hidden:inspector:update']" :disabled="editBtnShow()" type="warning" icon="el-icon-edit" size="mini" @click="handleEdit(null)">修改</el-button>
                    <el-button v-hasPermi="['hidden:inspector:del']" type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(null)">删除</el-button>
                    <!-- v-hasPermi="['hidden:file:import']" -->
                    <el-button type="primary" icon="el-icon-upload" size="mini" @click="importFile" style="margin-left: 12px;">批量导入</el-button>
                    <el-button type="primary" icon="el-icon-download" size="mini" @click="exportExcel">导出</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      <!-- </el-header> -->
      <!-- <el-main style="padding-left: 20px;padding-top: 0px"> -->
        <div class="page_body">
          <el-table
            ref="dataTable"
            :highlight-current-row="false"
            v-loading="loading"
            :data="tableList"
            @selection-change="handleSelectionChange"
            :height="tableHeight"
            border
            size="mini"
            style="width: 100%;height:100%;margin-top:5px;">
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column width="50" type="index" :index="Nindex" label="序号" align="center"></el-table-column>
            <el-table-column prop="realName" align="left" label="姓名" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-html="heightLighText(scope.row)"></div>
              </template>
            </el-table-column>
            <el-table-column prop="deptName" align="left" label="部门" show-overflow-tooltip></el-table-column>
             <!-- v-if="checkPermi(['hidden:inspector:update'])" -->
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button v-hasPermi="['hidden:inspector:update']" size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                <el-button v-hasPermi="['hidden:inspector:del']" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" style="color: #ff4949">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.current"
            :limit.sync="queryParams.size"
            @pagination="getList"
          />
        </div>
      <!-- </el-main> -->
    </basic-container>

    <el-dialog :modal-append-to-body="false" title="选择督察专家" :visible.sync="addVisible" width="80%">
      <user-table v-if="addVisible" :type="type" @editCallback="editCallback" @closeDialog="closeDialog"></user-table>
    </el-dialog>

    <el-dialog :modal-append-to-body="false" title="编辑" :visible.sync="editVisible" width="35%" class="edit-dialog">
      <edit v-if="editVisible" :form-data="selectRow" @editChoose="editChoose" @closeEdit="closeEdit"></edit>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog title="上传文件" :visible.sync="upload.open" class="import-dialog" width="550px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-upload
        ref="upload"
        name="file"
        :limit="1"
        :accept="accept"
        :action="action"
        :headers="headers"
        :data="data"
        :disabled="upload.isUploading"
        :http-request="uploadFile2"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :before-upload="beforeUpload"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload" slot="trigger"></i>
        <div class="el-upload__text" slot="trigger">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>

        <div class="el-upload__tip el-upload__template" slot="tip" style="width: 120px">
          <div>
            <el-link type="primary" style="font-size:12px" @click="importTemplate">模板下载.xlsx</el-link>
          </div>
        </div>


        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入{{ accept }}格式文件！文件大小不超过10MB</div>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm" size="mini">确 定</el-button>
        <el-button @click="upload.open = false" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getList, deleteUser, expertImport} from "@/api/safeDanger/claimExpertPool"
import UserTable from "./components/userTable.vue";
import Edit from "./components/edit.vue";
// import {checkPermi} from "@/utils/permission";

// 批量导入
const uuid = require('uuid');
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'
import { formatDate } from "@/util/date"
// import {getToken, getUid, getDiffTime} from '@/utils/auth'
// import md5 from 'js-md5'
// import {sm3Hash} from '@/utils/jsencrypt'
// import {getSortPostFormDataForUpload} from '@/utils/request'

export default {
  name: "index",
  components: {UserTable, Edit},
  data() {
    return {
      loading: false,
      tableList: [],
      tableHeight: null,

      queryParams: {
        current: 1,
        size: 20,
      },
      // 总条数
      total: 0,

      addVisible: false,
      editVisible: false,
      selectRow: null,
      type: null,

      // 批量导入
      action: '#', // /api/idevelop-hidden/inspector/expert/import
      headers: {
        Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
        'Idevelop-Auth': 'bearer ' + getToken()
      },
      data: {
        businessKey: null,
        tableName: null,
        columnName: null
      },
      upload: {
        isUploading: false,
        open: false,
      },
      maxFileSize: 10 * 1024 * 1024,//默认10MB大小限制
      accept: ".docx,.xlsx,.pdf,.txt,.ceb,.ofd,.rar,.zip",
    };
  },
  mounted() {
    this.getCurrentHeight()
    this.getList();
  },
  methods: {
    uploadFile2( params ){
      const file = params.file

      const formData = new FormData()
      formData.append("file", file)
      formData.append("businessKey", this.data.businessKey)
      formData.append("tableName", this.data.tableName)
      formData.append("columnName", this.data.columnName)


      expertImport(formData).then(res=>{
        params.onSuccess(res)
      }).catch(error=>{
        params.onError(error)
      })
    },
    handleSearch(){
      this.queryParams.current = 1
      this.getList();
    },
    handleSelectionChange(val) {
      // this.ids = []
      // this.multipleSelection = val;
      // this.ids = val.map(item => item.id);
    },
    // checkPermi(arrs) {
    //   if (arrs && arrs.length > 0) {
    //     return checkPermi(arrs);
    //   }
    //   return false;
    // },
    getList() {
      this.loading = true;
      getList(this.queryParams).then(res => {
        this.tableList = res.data.records;
        this.total = res.data.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    editCallback(row){
      row.userId = row.id
      row.id = this.selectRow.id
      this.selectRow = row;
      this.addVisible = false;


    },
    closeDialog() {
      this.queryParams = {current: 1, size: 20,};
      this.total = 0;
      this.getList();
      this.addVisible = false;
    },

    editChoose() {
      this.type = 'edit';
      this.addVisible = true;
    },
    closeEdit(isRefresh) {
      this.selectRow = null;
      this.editVisible = false;
      if (isRefresh) {
        this.getList();
      }
    },
    handleAdd() {
      this.type = 'add';
      this.addVisible = true;
    },
    handleEdit(row) {
      if (row == null) {
        this.selectRow = this.$refs.dataTable.selection[0];
      } else {
        this.selectRow = row;
      }
      this.editVisible = true;
    },
    handleDelete(row) {
      let ids = [];
      let message = null;
      if (row == null) {
        //删除选中
        if (this.$refs.dataTable.selection.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        ids = this.$refs.dataTable.selection.map(a => {
          return a.id;
        });
        message = `确定将选择的${this.$refs.dataTable.selection.length}条数据删除？`;
      } else {
        ids.push(row.id);
        message = `确定删除用户：${row.realName}？`;
      }
      this.$confirm(message, "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return deleteUser(ids);
      }).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        }
      });
    },
    editBtnShow() {
      if (this.$refs.dataTable) {
        return this.$refs.dataTable.selection.length != 1;
      }
      return true;
    },
    Nindex(index) {
      return index + 1 + (this.queryParams.current - 1) * this.queryParams.size;
    },
    // 获取自适应高度
    getCurrentHeight() {
      let windowHeight = window.innerHeight //窗口高度
      this.tableHeight = (windowHeight - 210) + 'px'
    },
    heightLighText(row) {
      if (row.realName && this.queryParams.realName) {
        let mgText = this.queryParams.realName;
        let reg = new RegExp(mgText, 'gi');
        let newStr = row.realName.replace(reg, (matchedText) => {
          return `<span style="color:#00A9B8;font-weight: bold;">${matchedText}</span>`
        });
        return newStr
      } else {
        return row.realName;
      }
    },




    // 下载模板
    importTemplate(){
      // this.exportExcel()
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
        this.download('/api/idevelop-hidden/inspector/expert/down', {
          ...this.queryParams
        }, `模板_${formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')}.xlsx`, loading)
      }).catch(function() {})
    },
    // 导出
    exportExcel() {
      let ids = [];
      ids = this.$refs.dataTable.selection.map(a => {
        return a.id;
      });

      // if(ids.length === 0){
      //   this.$message.warning("请选择导出数据！")
      //   return
      // }

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
        this.download('/api/idevelop-hidden/inspector/expert/export', ids, `模板${formatDate(new Date(), 'yyyy-MM-dd-hh:mm:ss')}.xlsx`, loading)
      }).catch(function () {
      })
    },
    //导入
    importFile() {
      this.data.businessKey = uuid.v4().replace(/-/g, "");
      this.data.tableName = 'hidden_manage_file';
      this.data.columnName = 'file_url';
      this.upload.open = true;
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传失败处理
    handleFileError(err, file, fileList) {
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert('文件上传失败', '提示', {dangerouslyUseHTMLString: true});
    },
    //上传成功后
    handleFileSuccess(res, file, fileList) {

      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      if (res && res.code == 200) {
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg);
      }

      this.getList();
    },
    beforeUpload(file) {
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      if ("" != this.accept && null != this.accept) {
        if (-1 == this.accept.indexOf(extension)) {
          this.msgWarning('文件格式只支持【' + this.accept + '】！')
          return false;
        }
      }
      if (this.maxFileSize && (file.size > this.maxFileSize)) {
        this.msgWarning("当前文件" + file.name + "超过大小限制，请重新上传！");
        return false;
      }

      this.secure();
      this.upload.isUploading = true;
    },

    secure() {
      // // 生成nonce_client
      // const nonce_client = md5(uuid.v4());
      // // 生成签名  客户端时间戳 + nonce_client + data + uid
      // const timestamp = parseInt((new Date()).getTime()) + parseInt(getDiffTime())
      // const token = 'Bearer' + getToken();
      // let sortData = getSortPostFormDataForUpload(this.data);
      // const sign_client = sm3Hash((Object.keys(sortData).length === 0 ? '' : JSON.stringify(sortData)) + timestamp + nonce_client + getUid());
      // this.headers['Authorization'] = token;
      // this.headers['nonce'] = nonce_client;
      // this.headers['ts'] = timestamp;
      // this.headers['sign'] = sign_client;
      // this.headers.isImport = true;
    },
  },
}
</script>
<style scoped>
.el-col-6, .el-col-8, .el-col-16 {
  height: 40px;
}

::v-deep .edit-dialog .el-dialog__body {
  height: 250px !important;
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
