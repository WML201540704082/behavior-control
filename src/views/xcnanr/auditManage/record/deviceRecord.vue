<template>
  <basic-container style="padding: 0;">
    <!-- 查询条件 -->
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="关联计划" prop="planCode">
              <el-input  v-model="searchForm.planCode" clearable placeholder="请输入计划编号" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司" prop="companyName">
              <xt-tree-lzay-select :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getOwnerUnit(v,'CORP')" />
            </el-form-item>
          </el-col>
          <!-- 机房、人员 -->
          <el-col :span="6">
            <el-form-item label="设备" props="deviceId">
              <el-select v-model="searchForm.deviceId" :disabled="!searchForm.companyId" filterable clearable placeholder="请选择设备">
                <el-option v-for="(item,index) in deviceOptions" :key="index" :label="item.name+'('+item.ip+')'" :value="item.id" />
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
          <!--          &lt;!&ndash; 计划状态（1：已提交，2：待提交，3：已启动，4：已停止） &ndash;&gt;-->
          <el-col :span="6">
            <el-form-item label="验证时间" props="times">
              <el-date-picker
                v-model="searchForm.times" clearable filterable
                type="datetimerange"
                range-separator="一"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;margin-top: 4px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="18" align="right">
            <el-button type="primary" @click="queryEvent">查询</el-button>
            <el-button style="margin-left: 5px;" type="primary" plain @click="resetEvent">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- 查询按钮 -->
<!--      <el-button type="primary" style="margin-left: 80px;" @click="queryEvent">查询</el-button>-->
<!--      <el-button style="margin-left: 5px;" type="primary" plain @click="resetEvent">重置</el-button>-->
    </div>
    <!-- 页面表格 -->
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="计划编号" prop="planCode" width="160" align="center" show-overflow-tooltip />
        <el-table-column label="工单编号" prop="code" width="160" align="center" show-overflow-tooltip />
        <el-table-column label="工单类型" prop="orderType" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.orderType, orderTypeOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="companyName" min-width="250" align="center" show-overflow-tooltip />
        <el-table-column label="操作人" prop="workerName" width="120" align="center" show-overflow-tooltip />
        <el-table-column label="堡垒机" prop="bastionName" width="250" align="center" show-overflow-tooltip />
        <el-table-column label="设备" prop="deviceName" width="200" align="center" show-overflow-tooltip />
        <el-table-column label="设备IP" prop="ip" width="200" align="center" show-overflow-tooltip />
        <el-table-column label="访问账号" prop="account" width="200" align="center" show-overflow-tooltip />
        <el-table-column label="访问时间" prop="startTime" width="160" align="center" show-overflow-tooltip />
        <el-table-column label="停留时间(分钟)" prop="duration" width="160" align="center" show-overflow-tooltip />
        <el-table-column label="结束时间" prop="finishTime" width="160" align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="200" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button v-if="(scope.row.extAttr2 && scope.row.extAttr2.length > 0) && permissionList.ReplayBtn" type="text" size="mini" @click="showVideo(scope.row)" icon="el-icon-video-play">操作回放</el-button>
            <el-button v-if="scope.row.type === 'tui' && permissionList.ActionBtn" type="text" size="mini" @click="showDialogEvent(scope.row)" icon="el-icon-data-line">操作指令</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" :pageSizes="[10,20,50,100,200]" @pagination="getList"/>

      <el-dialog :title="'操作回放'" :visible.sync="dialogFlag" append-to-body width="660px" height="400px" top="10vh" :show-close="true" :close-on-click-modal="true"  v-el-drag-dialog>
        <video width="100%" height="100%" controls autoplay>
          <source :src="showVideoUrl" type="video/mp4">
        </video>
      </el-dialog>
    </div>

    <!-- 弹层 -->
    <TerminalRecord ref="terminalRecord" :record="showRecord" />
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getByPage, getNewPlayBackUrl } from '@/api/xcnanr/deviceRecordLog'
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
