<template>
  <div>
    <basic-container>
      <!-- <el-header style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;"> -->
      <div class="page_form">  
        <el-form ref="queryForm" :model="queryParams" label-width="105px">
          <el-row>
            <!-- <el-col :span="8">
              <el-form-item label="督察分类:" prop="category">
                <el-select v-model="queryParams.category" placeholder="" clearable size="mini">
                  <el-option
                    v-for="dict in supervisionList"
                    :key="dict.id"
                    :label="dict.category"
                    :value="dict.category"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="督察内容:" prop="content">
                <el-input
                  placeholder=""
                  clearable
                  size="mini"
                  v-model="queryParams.content"
                >
                </el-input>
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="8">
              <el-form-item label="分类名称:" prop="name">
                <el-input
                  placeholder=""
                  clearable
                  size="mini"
                  v-model="queryParams.name"
                >
                </el-input>
              </el-form-item>
            </el-col> -->

          </el-row>

          <div>
            <el-row style="padding-top:5px;padding-left: 0px;padding-bottom:5px;">
              <el-button type="primary" size="mini" icon="el-icon-search"
                         @click="handleQuery">查询
              </el-button>

              <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-refresh-left"
                         @click="resetQuery">重置
              </el-button>

              <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-plus"
                         v-hasPermi="['system:computerroom:add']"
                         @click="handleAdd">新增
              </el-button>

              <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-edit"
                         v-hasPermi="['system:computerroom:edit']"
                         :disabled="multipleSelection.length != 1"
                         @click="handleUpdate">修改
              </el-button>

              <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-delete"
                         v-hasPermi="['system:computerroom:remove']"
                         :disabled="!multipleSelection.length > 0"
                         @click="handleDelete">删除
              </el-button>

              <!-- <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-custom"
                         v-hasPermi="['system:computerroom:remove']"
                         :disabled="multipleSelection.length != 1"
                         @click="handleBinding">绑定整改责任人
              </el-button>

              <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-tickets"
                         v-hasPermi="['system:computerroom:add']"
                         :disabled="multipleSelection.length != 1"
                         @click="handleHiddelContent">新增隐患
              </el-button>
              <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-eyes"
                         v-hasPermi="['system:computerroom:add']"
                         :disabled="multipleSelection.length != 1"
                         @click="handleHiddelManager">查看隐患
              </el-button> -->

              <el-button type="primary" icon="el-icon-upload" size="mini" @click="importFile">批量导入</el-button>
                    <el-button type="primary" icon="el-icon-download" size="mini" @click="exportExcel">导出</el-button>
            </el-row>
          </div>
        </el-form>
      </div>
      <!-- </el-header> -->
      <div class="page_body">
      <!-- <el-main style="padding-left: 20px;padding-top: 0px"> -->
        <div>
          <el-table
            ref="dataTable"
            v-loading="loading"
            :data="tableList"
            :height="tableHeight"
            border
            stripe
            @row-dblclick="handleDblclick"
            @row-click="rowClick"
            @selection-change="handleSelectionChange"
            row-key="id"
            :tree-props="{ children: 'children' }"
            size="mini"
            style="width: 100%;height:100%;margin-top:5px;">
            <el-table-column
              type="selection"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="regionName"
              align="left"
              label="区域名称"
              sortable
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="name"
              align="left"
              label="督察单位名称"
              sortable
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="regionCode"
              align="left"
              label="区域编码"
              sortable
              show-overflow-tooltip
            >
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
      </div>
    </basic-container>
    <div class="hiddenDetail" v-if="dialogVisible">
      <el-dialog :modal-append-to-body="false" :title="dialogTitle" style="padding: 0px;"
                 :close-on-click-modal="false" :visible.sync="dialogVisible"
                 :before-close="handleClose" width="45%">
        <Detail @closeRoom="closeDialog" :room-id="roomId" :is-edit="isEdit" :is-info="isInfo"/>
      </el-dialog>
    </div>
    <!-- 隐患新增 -->
    <div class="hiddenDetail" v-if="hiddenDialogVisible">
      <el-dialog :modal-append-to-body="false" :title="hiddenDialogTitle" style="padding: 0px;"
                 :close-on-click-modal="false" :visible.sync="hiddenDialogVisible"
                 :before-close="handleClose" width="45%">
        <hidden-detial @closeRoom="closeDialog" :roomId="roomId" :type="hiddenType" :category="category"/>
      </el-dialog>
    </div>
    <!-- 批量隐患管理列表 -->
    <div v-if="hiddenTableVisible">
      <el-dialog title="隐患管理" :visible.sync="hiddenTableVisible"
                 :before-close="closeDialog" width="80%" style="padding: 0px;"
                 :modal-append-to-body="false" :close-on-click-modal="false">
        <HiddenTable @closeRoom="closeDialog" :roomId="roomId" :category="category"/>
      </el-dialog>
    </div>


    <!-- 批量导入列表 -->
    <div v-if="importTableVisible">
      <el-dialog title="绑定责任人" :visible.sync="importTableVisible"
                 :before-close="closeDialog" width="80%" style="padding: 0px;"
                 :modal-append-to-body="false" :close-on-click-modal="false">
        <ImportTable @closeRoom="closeDialog" :roomId="roomId"/>
      </el-dialog>
    </div>







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
import {mapGetters} from 'vuex'
import Detail from "./components/detail";
import HiddenDetial from "./components/hiddenDetial";
import HiddenTable from "./components/hiddenTable";
import ImportTable from './components/importTable'
import {categoryTree, securityDelete, allCategory, superintendImport} from "@/api/safeDanger/supervisionUnit"
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'

// 批量导入
const uuid = require('uuid');
// import {getToken, getUid, getDiffTime} from '@/utils/auth'
// import md5 from 'js-md5'
// import {sm3Hash} from '@/utils/jsencrypt'
// import {getSortPostFormDataForUpload} from '@/utils/request'

export default {
  name: "index",
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
    ]),
  },
  components: {Detail, HiddenDetial, HiddenTable, ImportTable},
  data() {
    return {
      importTableVisible: false,

      tableHeight: undefined,
      isEdit: false,
      isInfo: false,
      roomId: undefined,
      dialogTitle: '',
      dialogVisible: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中数据
      multipleSelection: [],
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: null,
      // 查询参数
      queryParams: {
        current: 1,
        size: 20,
        category: undefined,
        content: undefined,
        supervision: undefined,
        supervisionPoint: undefined
      },
      queryDisabled: {
        showDeviceType: true,
        showUnitSecond: false
      },

      supervisionList: [],

      hiddenDialogVisible: false,
      hiddenDialogTitle: '',
      hiddenType: false,
      hiddenTableVisible: false,

      category: null,





      // 批量导入 process.env.VUE_APP_BASE_API + 
      action: '#', // /api/idevelop-hidden/superintend/import
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
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    this.getCurrentHeight()
    window.addEventListener('resize', this.getCurrentHeight)
    window.addEventListener('webkitvisibilitychange', this.getCurrentHeight)
  },
  methods: {
    uploadFile2( params ){
      const file = params.file

      const formData = new FormData()
      formData.append("file", file)
      formData.append("businessKey", this.data.businessKey)
      formData.append("tableName", this.data.tableName)
      formData.append("columnName", this.data.columnName)


      superintendImport(formData).then(res=>{
        params.onSuccess(res)
      }).catch(error=>{
        params.onError(error)
      })
    },

    handleRow(row) {
      this.roomId = row.id
      this.importTableVisible = true
    },

    initData() {
      allCategory().then(res => {
        this.supervisionList = res.data
      })
    },
    // 获取自适应高度
    getCurrentHeight() {
      let windowHeight = window.innerHeight //窗口高度
      this.tableHeight = (windowHeight - 210) + 'px'
    },
    closeDialog() {
      this.dialogVisible = false
      this.importTableVisible = false

      if (this.hiddenDialogVisible || this.hiddenTableVisible) {
        this.hiddenDialogVisible = false
        this.hiddenTableVisible = false;
      } else {
        this.getList();
      }
    },
    getList() {
      // this.initData()
      this.loading = true
      categoryTree(this.queryParams).then(response => {
        this.tableList = response.data
        // this.total = response.total
        this.loading = false
      })
    },
    rowClick(row) {
      //只能选择一行，选择其他，清除上一行
      if (this.$refs.dataTable.selection.length > 0) {
        let del_row = this.$refs.dataTable.selection.shift();
        this.$refs.dataTable.toggleRowSelection(del_row, false) //设置这一行取消选中
      }
      if (!row.disabled) {
        this.$refs.dataTable.toggleRowSelection(row);
      }
    },

    handleSelectionChange(val) {
      //点击选择事件
      if (val.length > 1) {
        let del_row = val.shift()
        this.$refs.dataTable.toggleRowSelection(del_row, false) //设置这一行取消选中
      }

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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleDelete() {
      const ids = this.ids;
      this.$confirm('是否确认删除选中数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {

        securityDelete(this.multipleSelection[0].id).then(rsp => {
          this.getList();
          this.msgSuccess('删除成功');
        }).catch(function () {
        });
      })
    },
    handleHiddelManager() {
      this.category = this.multipleSelection[0].name;
      this.roomId = this.multipleSelection[0].id;
      this.hiddenTableVisible = true;
    },
    handleHiddelContent() {
      this.category = this.multipleSelection[0].name;
      this.roomId = this.multipleSelection[0].id;
      this.hiddenDialogTitle = '新增'
      this.hiddenDialogVisible = true
      this.hiddenType = 'add';

      // console.log(this.category)
    },
    handleAdd() {
      this.roomId = undefined
      this.dialogTitle = '新增'
      this.dialogVisible = true
      this.isEdit = false
      this.isInfo = false
    },
    handleUpdate() {
      if (this.multipleSelection.length <= 0 || this.multipleSelection.length > 1) {
        this.$message({
          message: '请选择一条需要修改记录！',
          type: 'warning'
        });
        return;
      }
      this.roomId = this.multipleSelection[0].id;
      this.dialogTitle = '编辑';
      this.dialogVisible = true;
      this.isEdit = true
      this.isInfo = false
    },
    handleBinding() {
      if (this.multipleSelection[0].parentId !== 0) {
        this.$message({
          message: '请选择父级分类！',
          type: 'warning'
        });
        return;
      }
      this.roomId = this.multipleSelection[0].id;
      this.importTableVisible = true
    },
    handleDblclick(row) {
      this.roomId = row.id;
      this.dialogTitle = '详情';
      this.dialogVisible = true;
      this.isEdit = true
      this.isInfo = true
    },
    handleClose() {
      this.dialogVisible = false
      if (this.hiddenDialogVisible) {
        this.hiddenDialogVisible = false
      } else {
        this.getList();
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
        this.download(
          "/api/idevelop-hidden/superintend/down",
          {},
          "模板.xlsx"
          // ,"导入模板生成中..."
        );
        // const loading = this.$loading({
        //   lock: true,
        //   text: '正在处理，请稍等。。。',
        //   spinner: 'el-icon-loading',
        // });
        // this.download('/api/idevelop-hidden/superintend/down', {
        //   ...this.queryParams
        // }, `模板.xlsx`, loading)
      }).catch(function() {})
    },
    // 导出
    exportExcel() {
      // let ids = [];
      // ids = this.$refs.dataTable.selection.map(a => {
      //   return a.id;
      // });
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
        this.download('/api/idevelop-hidden/superintend/export', {}, `模板.xlsx`, loading)
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
  }
}
</script>
<style scoped>
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
<style lang="scss" scoped>
::v-deep .hiddenDetail .el-dialog__body {
  height: 35vh !important;
}
</style>
<style scoped>
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
</style>
