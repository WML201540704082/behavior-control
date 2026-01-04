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
            <el-form-item label="机房" props="roomId">
              <el-select v-model="searchForm.roomId" :disabled="!searchForm.companyId" filterable clearable placeholder="请选择机房">
                <el-option v-for="(item,index) in roomOptions" :key="index" :label="item.name" :value="item.id" />
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
    </div>
    <!-- 页面表格 -->
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="计划编号" prop="planCode" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.planCode ? '-' : scope.row.planCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工单编号" prop="code" width="160" align="center" show-overflow-tooltip />
        <el-table-column label="工单类型" prop="orderType" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.orderType, orderTypeOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="companyName" min-width="250" align="center" show-overflow-tooltip />
        <el-table-column label="机房" prop="roomName" width="250" align="center" show-overflow-tooltip />
        <el-table-column label="操作人" prop="workerName" width="90" align="center" show-overflow-tooltip />
        <el-table-column label="门禁" prop="accesscontrolName" width="200" align="center" show-overflow-tooltip />
        <el-table-column label="验证时间" prop="operateTime" width="150" align="center" show-overflow-tooltip />
        <el-table-column label="验证方式" prop="verifyType" width="90" align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="90" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="videoListFunc(scope.row)" icon="el-icon-s-unfold">视频列表</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" :pageSizes="[10,20,50,100,200]" @pagination="getList"/>

      <el-dialog :title="'视频回放'" :visible.sync="dialogFlag" append-to-body width="660px" height="400px" top="10vh" :show-close="true" :close-on-click-modal="true"  v-el-drag-dialog>
        <video width="100%" height="100%" controls autoplay>
          <source :src="showVideoUrl" type="video/mp4">
        </video>
      </el-dialog>
      <room-video-record v-if="videoDialog.type === 'video' && videoDialog.flag" :record-id="videoDialog.recordId" :dialog-flag="videoDialog.flag" />
    </div>

  </basic-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
  import { getDictList } from '@/api/dict'
  import { getByPage } from '@/api/xcnanr/roomRecordLog'
  import { getAll as getAllRooms } from '@/api/xcnanr/room'
  import { getAll as getAllWorkers } from '@/api/xcnanr/authorizedPerson'
  // import { downloadOssFile} from "@/api/xcnanr/ossFile";
  import OSS from 'ali-oss'
  import roomVideoRecord from './roomVideoRecord'

  export default {
    name: 'RoomRecord',
    components: { xtTreeLzaySelect, getDictList, roomVideoRecord },
    computed: { ...mapGetters(["permission", "userInfo", 'userDetail']),
      permissionList() {
        return {
          DownloadBtn: this.vaildData(this.permission.AuditRecordDownload, false),
        }
      }},
    data() {
      return {
        dialogFlag: false,
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
          roomId: null,
          times: [],
          startTime: null,
          endTime: null,
          pageNo: 1,
          pageSize: 10,
        },
        total: 0,
        tableData: [],
        roomOptions: [],
        workerOptions: [],
        tableHeight: undefined,
        tableLoading: false,
        showVideoUrl: '',
        videoDialog: {
          recordId: null, type: null, flag: false
        }
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
          this.searchForm.roomId = null
          this.searchForm.workerId = null
          this.getRooms(val)
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
        this.showVideoUrl = (row.extAttr1) ? row.extAttr1 : ''
        window.open(this.showVideoUrl, '_blank');
      },
      getRooms(companyId) {
        // 加载机房
        const _this = this
        _this.roomOptions = []
        if (!companyId) {
          return
        }
        getAllRooms({ companyId: companyId }).then(res => {
          if(res.success){
            _this.roomOptions = res.data
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
          // this.getRooms(val.id)
          // //单位更改 部门请初始化
          // this.form.propertyDept = null;
          // this.form.propertyDeptName = null;
        }
        this.$forceUpdate()
      },
      approveEvent() {
        console.log('转入隐患库')
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
          roomId: null,
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
        this.searchForm.endTime = (times && times.length>1) ? times[1] : null
        getByPage(this.searchForm).then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      // 导出word报告
      // downLoadVideo(url,fileName) {
      //   axios.get(url, {
      //     headers: {
      //       // Authorization: getToken(),
      //       responseType: 'blob',
      //       ContentDisposition: 'attachment'
      //     }
      //   }).then(res => {
      //     const url = window.URL.createObjectURL(new Blob([res.data]))
      //     const link = document.createElement('a')
      //     link.href = url
      //     link.setAttribute('download', fileName)
      //     document.body.appendChild(link)
      //     link.click()
      //   }).catch(res => {
      //     console.log(res, '请求失败')
      //   })
      // },
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
      },
      videoListFunc(row) {
        this.videoDialog = {
          recordId: row.id, type: 'video', flag: true
        }
      },
      closeDialog() {
        this.videoDialog = {
          recordId: null, type: null, flag: false
        }
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
