<template>
  <basic-container style="padding: 0;">
    <!-- 查询条件 -->
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="工单编号">
              <el-input  v-model="searchForm.code" clearable placeholder="请输入工单编号" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-input  v-model="searchForm.deviceName" clearable placeholder="请输入设备名称" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备IP">
              <el-input  v-model="searchForm.ip" clearable placeholder="请输入设备IP" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="访问账号">
              <el-input  v-model="searchForm.account" clearable placeholder="请输入访问账号" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="执行人">
              <el-input  v-model="searchForm.workerName" clearable placeholder="请输入执行人" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="执行指令">
              <el-input  v-model="searchForm.command" clearable placeholder="请输入执行指令" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" @click="queryEvent">查询</el-button>
            <el-button style="margin-left: 5px;" type="primary" plain @click="resetEvent">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 页面表格 -->
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="工单编号" prop="code" align="center" show-overflow-tooltip />
        <el-table-column label="设备名称" prop="deviceName" align="center" show-overflow-tooltip />
        <el-table-column label="设备IP" prop="ip" width="120" align="center" show-overflow-tooltip />
        <el-table-column label="访问账号" prop="account" align="center" show-overflow-tooltip />
        <el-table-column label="执行人" prop="workerName" align="center" show-overflow-tooltip />
        <el-table-column label="执行指令" prop="command" align="center" show-overflow-tooltip />
        <el-table-column label="返回行数" prop="rows" align="center" show-overflow-tooltip />
        <el-table-column label="执行时间" prop="executeTime" width="200" align="center" show-overflow-tooltip />
      </el-table>
      <!-- 分页 -->
      <pagination :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" :pageSizes="[10,20,50,100,200]" @pagination="getList"/>
    </div>
  </basic-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getByPage } from '@/api/xcnanr/deviceTerminalRecord'
  import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
  import { getDictList } from '@/api/dict'
  import TerminalRecord from './terminalRecord'
  import { getAll as getAllDevices } from '@/api/xcnanr/bastionDevice'
  import { getAll as getAllWorkers } from '@/api/xcnanr/authorizedPerson'

  export default {
    name: 'DeviceRecord',
    components: { xtTreeLzaySelect, getDictList, TerminalRecord },
    computed: { ...mapGetters(["permission", "userInfo", 'userDetail']),
      permissionList() {
        return {
          ReplayBtn: this.vaildData(this.permission.AuditRecordReplay, false),
          ActionBtn: this.vaildData(this.permission.AuditRecordAction, false),
        }
      }
    },
    data() {
      return {
        dialogFlag: false,
        dialogType: '',
        childDialogForm: {},
        sattusOptions: [],
        sourceOptions: [],
        orderTypeOptions: [],

        selectionList: [], // 复选框
        searchForm: {
          planCode: null,
          companyId: null,
          companyName: null,
          workerId: null,
          deviceId: null,
          times: [],
          startTime: null,
          endTime: null,
          pageNo: 1,
          pageSize: 10,
        },
        total: 0,
        tableData: [],
        deviceOptions: [],
        workerOptions: [],
        tableHeight: undefined,
        tableLoading: false,
        showRecord: {},
        showVideoUrl: ''
      }
    },
    created() {

      this.getDictList('info_workOrderType')
      this.getDictList('info_warningSource')
    },
    watch: {
      'searchForm.companyId': {
        handler(val) {
          console.log(val)
          this.searchForm.deviceId = null
          this.searchForm.workerId = null
          this.getDevices(val)
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
          }else if(code==='info_warningSource'){
            this.sourceOptions = res.data
          }

        })
      },
      showVideo(row)   {
        window.location.href=row.extAttr2;
        getNewPlayBackUrl({ id: row.id }).then(() => {
          this.getList()
        })
      },
      getDevices(companyId) {
        const _this = this
        _this.deviceOptions = []
        if (!companyId) {
          return
        }
        getAllDevices({ companyId: companyId }).then(res => {
          if(res.success){
            _this.deviceOptions = res.data
          }else{
            _this.$message.warning(res.msg)
          }
        }).catch(() => {
          _this.$message.error('获取机房信息失败')
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
      showDialogEvent(row) {
        this.showRecord = row
        const recordView =this.$refs.terminalRecord
        recordView.dialogFlag = true
      },
      detailEvent() {
        console.log('转维修工单')
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
        this.searchForm.pageNo = 1;
        this.searchForm.pageSize = 10;
        this.getList()
      },
      resetEvent() {
        this.searchForm = {
          planCode: null,
          companyId: null,
          companyName: null,
          workerId: null,
          deviceId: null,
          times: [],
          startTime: null,
          endTime: null,
          pageNo: 1,
          pageSize: 10,
        }
        this.getList()
      },
      getList() {
        this.tableLoading = true
        // 处理时间范围
        const times = this.searchForm['times']
        this.searchForm.startTime = (times && times.length>1) ? times[0] : null
        this.searchForm.finishTime = (times && times.length>1) ? times[1] : null
        getByPage(this.searchForm).then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      conversionDict(code, dictList) {
        //字典回显
        if (dictList != null && code !== '') {
          let items = dictList.filter(item => item.dictKey == code)
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
