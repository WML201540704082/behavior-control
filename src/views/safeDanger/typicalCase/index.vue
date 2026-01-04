<template>
  <div>
    <el-container>
      <el-aside v-if="!isQuery" style="'width: 19%;height:auto;'">
        <div>
          <el-tree :data="classifyTypeTree"
                   style="height: calc(100vh - 130px);overflow-y: auto"
                   class="hiddenScroll"
                   :accordion="true"
                   :default-expand-all="false" :props="classifyTypeProps"
                   :default-expanded-keys="expandedKeys"
                   :expand-on-click-node="true" @node-click="handleNodeClick" @node-expand="handleNodeClick"
                   @node-collapse="handleNodeClick">
          </el-tree>
        </div>
      </el-aside>
      <el-container>
        <basic-container>
        <!-- <el-header
          style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;"> -->
          <div class="page_form">
            <el-form class="xt_search_form" ref="queryForm" :model="queryParams" label-width="105px">
              <el-row>
                <el-col :span="8">
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
                <el-col :span="8">
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
                <el-col :span="8">
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
                <el-col :span="8">
                  <el-form-item label="隐患分类:" prop="hiddenCategory">
                    <el-select v-model="queryParams.hiddenCategory"
                               size="mini"
                               clearable
                               placeholder=""
                               @change="changeClassify"
                               @clear="clearClassify"
                    >
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
                <el-col :span="8">
                  <el-form-item label="隐患类型:" prop="hiddenType">
                    <el-select v-model="queryParams.hiddenType" size="mini" clearable placeholder=""
                               :disabled="queryDisabled.showHiddenType">
                      <el-option
                        v-for="item in hiddenCategoryTypeList"
                        :value="item.value"
                        :key="item.code"
                        :label="item.label"
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
                             style="margin-left: 5px;">导出
                  </el-button>

                </el-row>
              <!-- </div> -->
            </el-form>
          </div>
        <!-- </el-header>
        <el-main style="padding-left: 20px;padding-top: 0px"> -->
          <div class="page_body">
            <el-table
              ref="tabble"
              v-loading="loading"
              :data="tableList"
              :height="tableHeight"
              border
              stripe
              @row-dblclick="handleDblclick"
              @selection-change="handleSelectionChange"
              size="mini"
              style="width: 100%;height:100%;margin-top:5px;">
              <el-table-column type="selection" align="center" width="50"></el-table-column>
              <el-table-column prop="hiddenNumber" label="隐患编号" width="160">
                <template slot-scope="scope">
                  <a style="color:blue;text-decoration:underline;cursor:pointer;" @click="handleDblclick(scope.row)">{{scope.row.hiddenNumber}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="content" align="left" label="隐患内容"
                               show-overflow-tooltip></el-table-column>
              <el-table-column prop="rectificationRecord" align="left" label="整改措施"
                               show-overflow-tooltip></el-table-column>
              <el-table-column prop="hiddenSource" align="left" label="隐患来源" width="120"
                               :formatter="formatHiddenSource" show-overflow-tooltip></el-table-column>
              <el-table-column prop="hiddenCategory" align="left" label="隐患分类" width="120"
                               :formatter="formatHiddenCategory" show-overflow-tooltip></el-table-column>
              <el-table-column prop="categoryType" align="left" label="隐患类型" width="140" show-overflow-tooltip></el-table-column>

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
      </el-container>
    </el-container>
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
        <TypicalCaseWorkLog @closeRoom="worklogVisible = false" :detailId="detailId"/>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import TypicalCaseWorkLog from './components/workLog'
  import Detail from './components/detail'
  import { mapGetters } from 'vuex'

  import { listTree } from '@/api/safeDanger/dev/stockType'
  import {
    orderList,
    queryShortNameList,
    networkList,
    machineroomList
  } from '@/api/safeDanger/typicalCase'

  const uuid = require('uuid')
  export default {
    // 典型案例库
    name: 'typicalCase',
    computed: {
      ...mapGetters([
        'nickName',
        'companyId',
        'companyCode'
      ])
    },
    props: {
      isQuery: {
        type: Boolean,
        default: false
      },
      isRoom: {
        type: Boolean,
        default: false
      }
    },
    components: { Detail, TypicalCaseWorkLog },
    data() {
      return {
        queryDisabled: {
          showHiddenType: true,
          showUnitSecond: false,
          showMiUseDep: true
        },
        classifyTypeProps: {
          value: 'value',
          label: 'label',
          children: 'children'
        },
        tableHeight: undefined,
        // 查询参数
        queryParams: {
          current: 1,
          size: 20,
          isPresent: 4,
          libraryStatus: 1,
          company: undefined,
          hiddenType: undefined,
          hiddenNumber: undefined,
          hiddenCategory: undefined,
          content:undefined,
          hiddenSource:undefined,
          showHiddenType:undefined,
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
        dialogTitle: '',
        dialogVisible: false,
        worklogVisible: false,
        // 下拉列表
        hiddenSourceList: [],
        hiddenCategoryList: [],
        hiddenCategoryTypeList: [],
        statusList: [],
        basicUnitSeconds: [],
        classifyTypeTree: [],
        // 左侧树默认展示数值
        expandedKeys: [],
        // 左侧常用设备分类树
        stockTypeTree: [],
        networkList: [],
        machineroomTypeList: []
      }
    },
    created() {
      this.initData()
      this.getList()
      this.getClassifyTypeTree()
    },
    mounted() {
      this.getCurrentHeight()
      window.addEventListener('resize', this.getCurrentHeight)
      window.addEventListener('webkitvisibilitychange', this.getCurrentHeight)
    },
    methods: {
      initData() {
        this.getDicts('hidden_source').then(response => {
          this.hiddenSourceList = response.data
        })
        this.getDicts('hidden_category').then(response => {
          this.hiddenCategoryList = response.data
        })
        this.getDicts('hidden_present_status').then(response => {
          this.statusList = response.data
        })
        queryShortNameList({ parentId: this.companyCode.slice(0, 4) }).then(response => {
          this.basicUnitSeconds = response.data
        })
      },
      getList() {
        this.loading = true
        orderList(this.queryParams).then(response => {
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
        this.queryDisabled.showHiddenType = true
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
          }, `典型案例库${this.formatDate(new Date(), 'yyyy-MM-dd-hh:mm:ss')}.xlsx`, loading)
        }).catch(function() {
        })
      },
      handleDblclick(row) {
        this.detailId = row.id
        this.dialogTitle = '详情'
        this.dialogVisible = true
        this.isEdit = true
        this.isInfo = true
      },
      checkLog() {
        this.detailId = this.multipleSelection[0].id
        this.worklogVisible = true
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
        return this.selectDictLabel(this.statusList, row.status)
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
      // 获取隐患分类树下拉
      getClassifyTypeTree() {
        let array = new Array()
        let arrayType = new Array()
        networkList().then(response => {
          let data = response.data
          let children = new Array()
          for (let i = 0; i < data.length; i++) {
            let item = {
              level: 2,
              value: data[i].id,
              code: data[i].id,
              label: data[i].supervision
            }
            children.push(item)
            arrayType.push(item)
          }
          this.networkList = children
          let item = {
            level: 1,
            value: '1',
            code: '1',
            label: '网络安全隐患',
            children: children
          }
          array.push(item)
        })
        machineroomList().then(response => {
          let data = response.data
          let children = new Array()
          for (let i = 0; i < data.length; i++) {
            let item = {
              level: 2,
              value: data[i].id,
              code: data[i].id,
              label: data[i].category
            }
            children.push(item)
            arrayType.push(item)
          }
          this.machineroomTypeList = children
          let item = {
            level: 1,
            value: '0',
            code: '0',
            label: '机房安全隐患',
            children: children
          }
          array.push(item)
        })
        this.classifyTypeTree = array
        this.hiddenCategoryTypeList = arrayType
      },
      // 获取常用设备分类树下拉
      getStockTypeTree() {
        listTree().then(res => {
          if (res.code === 200) {
            this.stockTypeTree = res.data
          }
        })
      },
      handleNodeClick(data) {
        if (data.level === 1 || data.level === '1') {
          this.queryParams.hiddenCategory = data.code.toString()
          this.queryParams.hiddenType = undefined
          this.changeClassify(data.code)
        }
        if (data.level === 2 || data.level === '2') {
          this.queryParams.hiddenType = data.code
        }
        this.handleQuery()
      },
      // 获取自适应高度
      getCurrentHeight() {
        let windowHeight = window.innerHeight //窗口高度
        this.tableHeight = (windowHeight - 335) + 'px'
      },
      clearClassify() {
        this.queryParams.hiddenType = undefined
        this.queryDisabled.showHiddenType = true
        // this.hiddenCategoryTypeList = []
      },
      changeClassify(value) {
        let children = new Array()
        if (value !== '' && value == 0) {
          machineroomList().then(response => {
            let data = response.data
            for (let i = 0; i < data.length; i++) {
              let item = {
                value: data[i].id,
                code: data[i].id,
                label: data[i].category
              }
              children.push(item)
            }
            this.queryDisabled.showHiddenType = false
            this.queryParams.hiddenType = undefined
          })

        }
        if (value !== '' && value == 1) {
          networkList().then(response => {
            let data = response.data
            for (let i = 0; i < data.length; i++) {
              let item = {
                value: data[i].id,
                code: data[i].id,
                label: data[i].supervision
              }
              children.push(item)
            }
            this.queryDisabled.showHiddenType = false
            this.queryParams.hiddenType = undefined
          })
        }
        this.hiddenCategoryTypeList = children

        this.$nextTick(() => {
          this.$refs['tabble'].doLayout()
        })
      },
      showDetail(row) {
        this.detailId = row.hiddenId
        this.isEdit = true
        this.isInfo = false
      }
    }
  }
</script>

<style lang='scss' scoped>
  aside{
    padding: 2px 15px !important;
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
</style>
