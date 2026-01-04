<template>
  <div>
    <basic-container>
      <!-- <el-header style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;"> -->
       
        <div class="page_form">
          <el-form class="xt_search_form" ref="queryForm" :model="queryParams" label-width="105px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="隐患编号:" prop="hiddenNumber">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="queryParams.hiddenNumber"
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
              <el-col :span="6">
                <el-form-item label="责任单位:" prop="secondCompany">
                  <!-- <el-select v-model="queryParams.secondCompany" size="mini" clearable placeholder="" :disabled="true">
                    <el-option
                      v-for="item in basicUnitSeconds"
                      :value="item.orgId"
                      :key="item.orgId"
                      :label="item.shortName"
                    >
                    </el-option>
                  </el-select> -->
                  <JobUnit v-if="isCompany" :orgId.sync="queryParams.secondCompany" record></JobUnit>
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

                <!-- <el-button type="primary" icon="el-icon-upload" size="mini" @click="importExcel" style="margin-left: 5px;">导入</el-button> -->
                <el-button type="primary" icon="el-icon-download" size="mini" @click="exportExcel"
                           style="margin-left: 5px;">导出
                </el-button>
                <el-button type="primary" icon="el-icon-search" size="mini" :disabled="multipleSelection.length != 1"
                           @click="checkLog" style="margin-left: 5px;">查看工作日志
                </el-button>


              </el-row>
            <!-- </div> -->
          </el-form>
        </div>
      <!-- </el-header> -->
      <!-- <el-main style="padding-left: 20px;padding-top: 0px"> -->
        <div class="page_body">
          <el-table
            ref="tabble"
            :highlight-current-row="false"
            v-loading="loading"
            :data="tableList"
            :height="tableHeight"
            border
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
              prop="hiddenNumber"
              label="隐患编号"
              sortable
              width="150">
              <template slot-scope="scope">
                <a style="color:blue;text-decoration:underline;cursor:pointer;" @click="handleDblclick(scope.row)">{{scope.row.hiddenNumber}}</a>
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
              show-overflow-tooltip
              width="130">
            </el-table-column>
            <el-table-column
              prop="hiddenCategory"
              align="left"
              label="隐患分类"
              sortable
              :formatter="formatHiddenCategory"
              show-overflow-tooltip
              width="130">
            </el-table-column>
            <el-table-column
              prop="status"
              label="工单状态"
              sortable
              :formatter="formatState"
              show-overflow-tooltip
              width="150">
            </el-table-column>

            <el-table-column
              prop="isRectification"
              label="整改状态"
              sortable
              :formatter="formatRectificationStatus"
              show-overflow-tooltip
              width="120">
            </el-table-column>
            <el-table-column
              prop="isOverdue"
              label="是否超期"
              sortable
              
              show-overflow-tooltip
              width="120">
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
              label="责任单位"
              sortable
              show-overflow-tooltip
              width="120">
            </el-table-column>
            <el-table-column
              prop="responsibleBy"
              align="left"
              label="整改责任人"
              sortable
              show-overflow-tooltip
              width="120">
            </el-table-column>
            <el-table-column
              prop="rectificationExpectTime"
              align="left"
              label="整改完成限期"
              sortable
              show-overflow-tooltip
              width="130">
            </el-table-column>
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
    <el-dialog title="导入" :visible.sync="upload.open" width="500px" :modal-append-to-body="false" @close="getList"
               :close-on-click-modal="false" class="import-dialog">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx,.xls"
        name="file"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :http-request="uploadFile2"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :before-upload="beforeUpload"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 -->
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="primary" @click="handleExport" size="mini" style="float: left">下载模板</el-button>-->
        <el-button type="primary" @click="submitFileForm" size="mini">确 定</el-button>
        <el-button @click="upload.open = false" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Detail from './components/detail'
  import WorkLog from '../report/components/workLog'
  import UploadFile from './components/uploadFile'
  import { mapGetters } from 'vuex'
  import md5 from 'js-md5'
  import { sm3Hash, decryptBySM2 } from '@/util/jsencrypt'
  import { getToken, getUid, getDiffTime, setToken, setUid } from '@/util/auth'
  import { recordList, queryShortNameList, orderImport } from '@/api/safeDanger/report'


  const uuid = require('uuid')

  export default {
    name: 'index',
    computed: {
      // 隐患记录
      ...mapGetters([
        'nickName',
        'companyId',
        'companyCode'
      ])
    },
    components: { Detail, UploadFile, WorkLog },
    data() {
      return {
        isCompany: false,
        worklogVisible: false,

        tableHeight: undefined,
        // 查询参数
        queryParams: {
          current: 1,
          size: 20,
          isPresent: 2,
          hiddenNumber: undefined,
          content: undefined,
          hiddenSource: undefined,
          hiddenCategory: undefined,
          status: undefined,
          secondCompany: undefined,
          isRectification: undefined,
          isOverdue: undefined
        },
        queryDisabled: {
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
        loading: true,
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
        // 用户导入参数
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: '',
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {},
          // 上传的地址
          url: '#', // process.env.VUE_APP_BASE_API + '/api/idevelop-hidden/order/import'
        }
      }
    },
    created() {
      // 隐患首页调整过来
      let types = this.$route.params.types
      if(types){
        this.queryParams.isNotCancel = 'true'
        if(types == '待整改'){
          this.queryParams.isRectification = 0
        } else if(types == '整改中'){
          this.queryParams.isRectification = 1
        } else if(types == '已整改'){
          this.queryParams.isRectification = 2
        } else if(types == '超期未整改'){
          this.queryParams.isOverdue = '0'
          //this.queryParams.isPresent = 9
        }
      }
      // 第三方门户待办跳转过来
      let username = this.$route.query.username
      let hiddenOrder = this.$route.query.hiddenOrder
      if( username ){
        this.isCompany = true
        this.initData()
        this.getList()

        this.handleDblclick({id:hiddenOrder})
        // this.$store.dispatch("FristCallOn").then(re=>{
        //     this.$store.dispatch("kkk", {username: username}).then(res=>{
        //       this.$store.dispatch('GetInfo').then(res => {
        //         this.isCompany = true
        //         this.initData()
        //         this.getList()

        //         this.handleDblclick({id:hiddenOrder})
        //       })
        //     })
        // })
                 
      }else{
        this.isCompany = true
        this.initData()
        this.getList()
      }


      
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

        orderImport(formData).then(res=>{
          params.onSuccess(res)
        }).catch(error=>{
          params.onError(error)
        })
      },
      initData() {
        // this.queryParams.secondCompany = this.companyCode
        this.getDicts('hidden_source').then(response => {
          this.hiddenSourceList = response.data
        })
        this.getDicts('hidden_category').then(response => {
          this.hiddenCategoryList = response.data
        })
        this.getDicts('hidden_record_status').then(response => {
          this.statusList = response.data
        })
        this.getDicts('hidden_extension_status').then(response => {
          this.hiddenExtensionStatusList = response.data
        })
        queryShortNameList({ parentId: this.companyCode.slice(0, 4) }).then(response => {
          this.basicUnitSeconds = response.data
        })
      },
      getList() {
        this.loading = true
        recordList(this.queryParams).then(response => {
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
        this.queryParams.isRectification = undefined
        this.queryParams.isOverdue = undefined
        this.handleQuery()
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
          }, `隐患记录工单${this.formatDate(new Date(), 'yyyy-MM-dd-hh:mm:ss')}.xlsx`, loading)
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
      },
      closeDialog() {
        this.dialogVisible = false
        this.getList()
      },

      // 格式化数据
      formatHiddenSource(row) {
        return this.selectDictLabel(this.hiddenSourceList, row.hiddenSource)
      },
      formatHiddenCategory(row) {
        return this.selectDictLabel(this.hiddenCategoryList, row.hiddenCategory)
      },
      formatState(row) {
        if (row.isRefuteCancel == '1') {
          return '已终止'
        }
        return this.selectDictLabel(this.statusList, row.status)
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
        if (row.isRectification == 3) {
          return '终止'
        }
        if (row.isRectification == 4) {
          return '驳回'
        }
      },
      formatRectificationExtensionStatus(row) {
        // "0=已超期,1=未超期,2=即将超期
        if (row.isOverdue == 0) {
          return '<span style="color:red">已超期(' + row.overdueDays + '天)</span>'
        }
        if (row.isOverdue == 1) {
          return '未超期'
        }
        if (row.isOverdue == 2) {
          return '即将超期(' + row.overdueDays + '天)'
        }
        return ''
      },

      formatSecondCompany(row) {
        if (!row.secondCompany) return ''
        let data = this.basicUnitSeconds
        for (let i = 0; i < data.length; i++) {
          if (row.secondCompany == data[i].orgId) {
            return data[i].shortName
          }
        }
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

      //导入
      importExcel() {
        this.upload.open = true
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false
        this.upload.isUploading = false
        this.$refs.upload.clearFiles()
        this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
        this.getList()
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit()
      },
      //上传之前操作(用于判断是否重名与格式限制)
      beforeUpload(file) {
        this.secure()
      },
      secure() {
        // 生成nonce_client
        const nonce_client = md5(uuid.v4())
        // 生成签名  客户端时间戳 + nonce_client + data + uid
        const timestamp = parseInt((new Date()).getTime()) + parseInt(getDiffTime())
        const token = 'Bearer' + getToken()
        const sign_client = sm3Hash(timestamp + nonce_client + getUid())
        this.upload.headers['Authorization'] = token
        this.upload.headers['nonce'] = nonce_client
        this.upload.headers['ts'] = timestamp
        this.upload.headers['sign'] = sign_client
        this.upload.headers.isImport = true
      },
      importTemplate() {
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
          this.download('/msdp-hardwarebase/sparesin/importTemplate', {
            ...this.queryParams
          }, `隐患记录工单${this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')}.xlsx`, loading)
        }).catch(function() {
        })
      },

      warningTableRow({ row }) {
        if (row.isOverdue == 0) {
          return 'warning-row'
        }
        return ''
      },
      // 获取自适应高度
      getCurrentHeight() {
        let windowHeight = window.innerHeight //窗口高度
        this.tableHeight = (windowHeight - 350) + 'px'
      }
    }
  }
</script>

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

  ::v-deep .import-dialog .el-dialog__body {
    height: 280px !important;
  }

  ::v-deep .el-table .warning-row {
    /*background: oldlace;*/
    background: #e91b24;
    color: #333;
  }

  ::v-deep .el-table .warning-row1 {
    /*background: oldlace;*/
    background: #f49ae7;
  }

  ::v-deep .el-table tbody tr:hover > td {
    background: none !important;
  }
</style>
