<template>
  <basic-container style="padding: 0">
    <!-- 查询条件 -->
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="110px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="工单/授权编号">
              <el-input  v-model="searchForm.workCode" clearable placeholder="请输入计划编号" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="授权流水号">
              <el-input  v-model="searchForm.serialNo" clearable placeholder="请输入计划编号" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司" prop="companyName">
              <xt-tree-lzay-select :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getOwnerUnit(v,'CORP')" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工单类型" prop="workType">
              <el-select v-model="searchForm.workType" filterable clearable placeholder="请选择类型">
                <el-option v-for="dict in orderTypeOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 告警来源 -->
          <el-col :span="6">
            <el-form-item label="授权类型" props="authType">
              <el-select v-model="searchForm.authType" filterable clearable placeholder="请选择授权类型">
                <el-option v-for="dict in authTypeOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="操作人" props="workerId">
                  <el-select v-model="searchForm.workerId" :disabled="!searchForm.companyId" filterable clearable placeholder="请选择操作人">
                      <el-option v-for="(item,index) in workerOptions" :key="index" :label="item.name" :value="item.id" />
                  </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="12" align="right">
            <!-- 查询按钮 -->
            <el-button type="primary" @click="queryEvent">查询</el-button>
            <el-button style="margin-left: 5px;" type="primary" plain @click="resetEvent">重置</el-button>
          </el-col>
        </el-row>
      </el-form>

    </div>
    <!-- 页面表格 -->
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>
        <el-table-column label="工单/临时授权编号" prop="workCode" width="170" align="center" show-overflow-tooltip />
        <el-table-column label="授权流水号" prop="serialNo" width="160" align="center" show-overflow-tooltip />
        <el-table-column label="类型" prop="workType" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.workType+'', orderTypeOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划编号" prop="planCode" width="170" align="center" show-overflow-tooltip />
        <!--        <el-table-column label="名称" prop="content" width="300" align="center" show-overflow-tooltip />-->
        <el-table-column label="被授权人" prop="workerName" width="120" align="center" show-overflow-tooltip />
        <el-table-column label="授权类型" prop="authType" width="80" align="center" show-overflow-tooltip >
            <template slot-scope="scope">
                <span>{{ conversionDict(scope.row.authType+'', authTypeOptions) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="授权对象" prop="objectName" width="150" align="center" show-overflow-tooltip />
        <el-table-column label="授权状态" prop="detailStatus" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.detailStatus+'', detailStatusOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="授权原因" prop="workContent" min-width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.workContent? '-' : scope.row.workContent}}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" width="140" align="center" show-overflow-tooltip />
        <el-table-column label="结束时间" prop="finishTime" width="140" align="center" show-overflow-tooltip />
        <el-table-column label="公司" prop="companyName" min-width="220" align="center" show-overflow-tooltip />
        <el-table-column label="部门" prop="workerDeptName" min-width="220" align="center" show-overflow-tooltip />
        <el-table-column label="申请人" prop="createUserName" width="120" align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="100" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="detailEvent(scope.row)" icon="el-icon-s-fold">详 情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="total" :page.sync="searchForm.pageNumber" :limit.sync="searchForm.pageSize" :pageSizes="[10, 20,50,100,200]" @pagination="getList"/>
    </div>

    <!-- 弹层 -->
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getByPage } from '@/api/xcnanr/temporaryAuthDetail'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import { getDictList } from '@/api/dict'
import { getAll as getAllWorkers } from '@/api/xcnanr/authorizedPerson'

export default {
  name: 'AuthRecord',
  components: { xtTreeLzaySelect, getDictList },
  computed: { ...mapGetters(["permission", "userInfo", 'userDetail']) },
  data() {
    return {
      dialogFlag: false,
      dialogType: '',
      childDialogForm: {},
      sattusOptions: [],
      sourceOptions: [],
        // 字典
      orderTypeOptions: [],
      authTypeOptions: [],
      detailStatusOptions: [],
      workerOptions: [],

      selectionList: [], // 复选框
      searchForm: {
        serialNo: null,
        workCode: null,
        content: null,
        companyId: null,
        companyName: null,
        workType: null,
        authType: null,
        workerId: null,
        pageNumber: 1,
        pageSize: 10,
        sort: '',
        order: ''
      },
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false
    }
  },
  created() {

    this.getDictList('info_workOrderType')
    this.getDictList('info_temporary_auth_type')
    this.getDictList('info_order_detail_auth_status')
  },
  watch: {
      'searchForm.companyId': {
          handler(val) {
              this.searchForm.workerId = null
              this.getWorkers(val)
          },
          deep: true
      }
  },
  mounted() {
    this.setPageContentHeight()
    this.setTableHeight()
    this.getList()
  },
  methods: {
    getDictList(code){
      //加载字典
      getDictList(code).then(res => {
        if(code==='info_workOrderType'){
          this.orderTypeOptions = res.data
        }else if(code==='info_temporary_auth_type'){
          this.authTypeOptions = res.data
        }else if(code==='info_order_detail_auth_status'){
            this.detailStatusOptions = res.data
        }

      })
    },
    getWorkers(companyId) {
        // 加载操作人
        const _this = this
        _this.workerOptions = []
        if (!companyId) {
            return
        }
        getAllWorkers({ companyId: companyId }).then(res => {
            if(res.success){
                _this.workerOptions = res.data
            }else{
                _this.$message.warning(res.msg)
            }
        }).catch(() => {
            _this.$message.error('获取操作人信息失败')
        })
    },
    getOwnerUnit(val, type) {
      if (type === 'CORP') {
        //单位
        this.searchForm.companyId = val.id
        this.searchForm.companyName = val.fullName
      }
      this.$forceUpdate()
    },
    approveEvent() {
      console.log('转入隐患库')
    },
    detailEvent(row) {
      const workOrderType = row.workType
      if (workOrderType === 1) {
        // 打开巡视工单的详情界面
        // this.$router.push({path: '/xcnanr/inspectWorkOrderDetail',query:{id: row.workId}})
        this.$router.push({
          path: '/xcnanr/inspectWorkOrderDetail/',
          query: {
            orderId: row.workId
          }
        })
      }else if (workOrderType === 2) {
        // 打开检修工单的详情界面
        this.$router.push({path: '/xcnanr/repairOrderDetail',query:{code: row.workCode}})
      }else if (workOrderType === 3) {
        // 打开临时授权工单的详情界面
        this.$router.push({path: '/xcnanr/tempAuthDetail',query: {authCode: row.workCode}})
      }
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 100) + 'px'
    },
    selectionChange(selection) {
      this.selectionList = selection.map(item => item.id)
    },
    queryEvent() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getList()
    },
    resetEvent() {
      this.searchForm = {
        serialNo: null,
        workCode: null,
        content: null,
        companyId: null,
        companyName: null,
        workType: null,
        authType: null,
        workerId: null,
        pageNumber: 1,
        pageSize: 10,
        sort: '',
        order: ''
      }
      this.getList()
    },
    getList() {
      this.tableLoading = true
      // // 处理时间范围
      // const times = this.searchForm['times']
      // this.searchForm.startTime = (times && times.length>1) ? times[0] : null
      // this.searchForm.endTime = (times && times.length>1) ? times[1] : null
      getByPage(this.searchForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    conversionDict(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey === code)
        if (items != null && items.length > 0) {
          return items[0].dictValue
        }
      }
      return code
    },
    tbClick(type) {
      this.$message.success(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-link {
  font-size: 13px;
}

.s_lt {
  font-size: 12px;
}
</style>
