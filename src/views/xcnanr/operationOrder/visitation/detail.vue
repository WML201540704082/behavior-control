<template>
  <basic-container style="padding-bottom: 60px">
    <breadcrumb path="/xcnanr/operationOrder/visitation/index" master-title="巡视工单" child-title="详情"></breadcrumb>
    <el-button type="primary" style="position: absolute;top: 12px;right: 90px;" @click="exportDetailFunc">导出</el-button>
    <el-button v-if="orderInfo.statusInfo <= 3" type="primary" style="position: absolute;top: 12px;right: 30px;" @click="printForm">打印</el-button>
    <el-form class="xt_form" ref="orderInfo" :model="orderInfo" inline size="small" label-suffix=":" label-width="130px" style="width: 1300px;margin: 0 auto;">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form-item label="工单编号">
              <span style="font-weight: bolder">{{ orderInfo.code }}</span>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视类型" prop="warningTime">
              <el-input style="width: 390px" v-model="dictForOrderType" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视人" prop="createUserName">
              <el-input style="width: 390px" v-model="orderInfo.workers" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视时间段">
              <el-date-picker v-model="orderTimes" type="datetimerange" range-separator=" ~ " value-format="yyyy-MM-dd HH:mm:ss" disabled style="width: 390px;margin-top: 4px;" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="工单状态">
              <el-input style="width: 390px" v-model="dictForOrderStatus" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="公司" prop="warningTime">
              <el-input style="width: 390px" v-model="orderInfo.companyName" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="部门" prop="createUserName">
              <el-input style="width: 390px" v-model="orderInfo.deptName" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-form-item label="巡视内容" prop="content">
          <el-input style="width: 1040px" type="textarea" :rows="3" v-model="orderInfo.content" disabled></el-input>
        </el-form-item>

        <!-- 分割线 -->
        <el-divider></el-divider>

        <el-form-item :label="(orderInfo.statusInfo === 6)?'巡视结果':'巡视信息'"
                      name="2" prop="keySolution">
          <el-table ref="tableData2" :data="orderInfo.orderDetailList" size="small" style="width: 1040px" stripe max-height="400px">
            <el-table-column type="index" align="center" label="序号" width="60px" />
            <el-table-column :label="orderInfo.type === 1 ?'所属机房': '设备名称'" prop="objectName" width="150" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="关联配置项" prop="configName" width="130" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="配置项" align="center">
              <el-table-column label="巡视项" prop="configDetailName" min-width="130" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="描述" prop="configDetailDescription" min-width="280" align="center" show-overflow-tooltip></el-table-column>
            </el-table-column>
            <el-table-column v-if="orderInfo.statusInfo === 6" label="巡视结果" min-width="80" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <i :class="scope.row.solveStatus === 0 ? 'el-icon-success' : 'el-icon-error'" :style="{color: (scope.row.solveStatus === 0 ? '#00c868' :'red'),fontSize: '20px'}"/>
              </template>
            </el-table-column>
            <el-table-column v-if="orderInfo.statusInfo === 6" label="是否已解决" prop="solveStatus" min-width="100" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag v-if="scope.row.solveStatus > 0" :type="scope.row.solveStatus === 2 ? 'success' :'danger'" ffect="dark">
                  {{ scope.row.solveStatus === 2 ? '已解决' : '未解决' }}
                </el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column v-if="orderInfo.statusInfo === 6" label="缺陷描述" prop="feedbackContent" min-width="180" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ !scope.row.feedbackContent ? '-' : scope.row.feedbackContent }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="orderInfo.statusInfo === 6" label="异常设备" prop="deviceName" min-width="180" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ !scope.row.deviceName ? '-' : scope.row.deviceName }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="orderInfo.statusInfo === 6" label="操作" align="center" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-badge v-if="!!scope.row.feedbackFilesList && scope.row.feedbackFilesList.length > 0" :value="scope.row.feedbackFilesList.length" class="item" type="primary">
                  <el-button type="text" size="mini" @click="showDetailFileFunc(scope.row.feedbackFilesList)">查看附件</el-button>
                </el-badge>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-if="orderInfo.statusInfo === 6" label="缺陷反馈总结" style="margin-bottom: 0px; margin-top: 10px;">
          <el-input style="width: 1040px" type="textarea" :rows="4" v-model="orderInfo.defectFeedbackSummary"
                    disabled></el-input>
        </el-form-item>

        <template v-if="orderInfo.statusInfo !== 1">
          <!-- 分割线 -->
          <el-divider></el-divider>

          <el-form-item label="授权信息" prop="keySolution">
            <el-table ref="tableData2" :data="authDetails" size="small" style="width: 1040px" stripe max-height="400px">
              <el-table-column type="index" align="center" label="序号" width="60px" />
              <el-table-column label="流水号" prop="serialNo" width="150" align="center" show-overflow-tooltip/>
              <el-table-column label="被授权人" prop="workerName" align="center" show-overflow-tooltip/>
              <el-table-column label="授权对象" prop="objectName" align="center" show-overflow-tooltip/>
              <el-table-column v-if="orderInfo.type === 2" label="设备地址" prop="deviceIp" align="center" show-overflow-tooltip max-width="150">
                <template slot-scope="scope">
                  {{ scope.row.deviceIp + ':' + scope.row.devicePort }}
                </template>
              </el-table-column>
              <!-- 未归档的设备巡视工单的授权信息 ，当前登录者非创建者或非巡视者不可查看登录信息 -->
              <el-table-column v-if="orderInfo.type === 2 && [3,5,6].indexOf(orderInfo.statusInfo) >= 0 && (isCreator || currVisitorWorkerId)" label="登录信息" align="center">
                <el-table-column label="地址" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (isCreator || scope.row.workerId === currVisitorWorkerId) ? scope.row.bastionUrl : '******' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="账号" prop="tempUser" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (isCreator || scope.row.workerId === currVisitorWorkerId) ? scope.row.tempUser : '******' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="密码" prop="tempPwd" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (isCreator || scope.row.workerId === currVisitorWorkerId) ? scope.row.tempPwd : '******' }}</span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="授权结果" align="center" width="100px">
                <template slot-scope="scope">
                  {{ loadAuthResult(scope.row) }}
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </template>

        <!-- 分割线 -->
        <el-divider></el-divider>

        <!--    工单跟踪-->
        <el-form-item label="工单跟踪">
          <el-table ref="recordTable" :key="Math.random()" :data="orderInfo.recordList" style="width: 1040px" stripe max-height="400px">
            <el-table-column type="index" align="center" label="序号" width="80px" />
            <el-table-column prop="createTime" align="center" label="操作时间" width="200px" />
            <el-table-column prop="extAttr1" align="center" label="操作人" width="150px">
              <template slot-scope="scope">
                {{ !scope.row.extAttr1 ? '-' : scope.row.extAttr1 }}
              </template>
            </el-table-column>
            <el-table-column prop="content"  align="center" :show-overflow-tooltip="true" label="操作内容"></el-table-column>
          </el-table>
        </el-form-item>
      </el-row>
    </el-form>
    <div style="width:100px;margin: 10px auto;">
      <el-button type="primary" size="small" @click="returnEvent">返回</el-button>
    </div>
    <ImageView ref="imgView" :imgurl="showImgUrl"/>
    <Print v-show="printFlag" ref="print" :orderInfo="orderInfo" :dictForOrderType="dictForOrderType" :dictForOrderStatus="dictForOrderStatus" style="margin-top: 1000px" />
    <!-- 附件列表弹层 -->
    <el-dialog v-if="showDetailFile.flag" :visible.sync="showDetailFile.flag" title="巡视反馈上传附件列表" width="800px" @close="closeFileDialogFunc">
      <el-table :data="showDetailFile.fileList" max-height="400px" stripe>
        <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
        <el-table-column prop="fileName" align="center" :show-overflow-tooltip="true" label="附件名称" />
        <el-table-column label="操作" align="center" min-width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="previewFileFunc(scope.row.ossAddress)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </basic-container>
</template>

<script>
import {getDetailById, exportDetail} from '@/api/xcnanr/inspectionOrder';
import {getDictList} from "@/api/dict";
import {getAll as getAuthDetails} from '@/api/xcnanr/temporaryAuthDetail';
import {mapGetters} from "vuex"
import ImageView from './imgView'
import Print from './print.vue'
import Breadcrumb from '../../components/Breadcrumb'
import { exportReportFile, downloadFile} from '@/api/xcnanr/report'

export default {
  props: [],
  components: {ImageView, Breadcrumb, Print},
  data() {
    return {
      activeNames: ['1', '2', '3'],
      orderId: '',
      orderInfo: {
        createUser: "",
        status: 1,
        isDeleted: 0,
        id: null,
        code: null,
        type: 1,
        startTime: null,
        finishTime: null,
        realFinishTime: "",
        content: null,
        planId: "",
        objects: "",
        workers: null,
        companyId: null,
        companyName: null,
        companyRegionCode: null,
        deptId: null,
        deptName: null,
        extAttr1: "",
        extAttr2: "",
        extAttr3: "",
        createUserName: null,
        updateUserName: "",
        statusInfo: 3,
        defectFeedbackSummary: "",
        relatedWorkerList: [],
        orderDetailList: [],
        recordList: [],
        feedbackPerson: "",
        userWorkerId: null
      },
      // currVisitorWorkerId: null,
      // isCreator: false,
      authDetails: [],
      dictForDetailStatus: [],
      dictForType: [],
      typeOptions: [],
      dictForBastionHostProtocol:[],
      dictForBastionNetworkProtocol:[],
      showImgUrl: '',
      orderDetailCols: ['serialNo', 'objectName', 'configName', 'configDetailName', 'configDetailDescription', 'deviceName', 'solveStatus'],
      dictForOrderType: null, dictForOrderStatus: null, printFlag: false,
      showDetailFile: { flag: false, fileList: [] }
    }
  },
  created() {
    this.orderId = this.$route.query.orderId
    this.getOrderInfo()
    this.getAuthDetailsByOrder()
    getDictList("info_temporary_auth_type").then(res => {
      this.dictForType = res.data
    })
    getDictList("info_order_detail_auth_status").then(res => {
      this.dictForDetailStatus = res.data
    })
    // 加载字典信息：堡垒机中主机设备协议
    getDictList("info_bastion_server_type").then(res => {
      this.dictForBastionHostProtocol = res.data
    })
    // 加载字典信息：堡垒机中网络设备协议
    getDictList("info_bastion_network_type").then(res => {
      this.dictForBastionNetworkProtocol = res.data
    })
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"]),
    orderTimes() {
      // debugger
      const startTime = this.orderInfo.startTime
      const finishTime = this.orderInfo.finishTime
      const times = (startTime && finishTime) ? [startTime, finishTime] : []
      return times
    },
    isCreator() {
      return this.orderInfo.createUser === this.userInfo.userId
    },
    currVisitorWorkerId() {
      return this.orderInfo.userWorkerId
    }
  },
  methods: {
    trackingTimeConvert(time) {
      return time.substring(5, time.length - 3)
    },
    trackingDescConvert(person, desc) {
      if (person) {
        return '【' + person + '】 ' + desc
      } else {
        return desc
      }
    },
    /**
     * 打印表单
     */
    printForm() {
      this.printFlag = true
      const _this = this
      setTimeout(() => {
        _this.$refs.print.printForm();
      }, 50)
      setTimeout(() => {
        _this.printFlag = false
      }, 1000)

    },
    returnEvent() {
      this.$router.push({path: '/xcnanr/operationOrder/visitation/index'})
    },
    showImg(row) {
      this.showImgUrl = (row.url) ? row.url : ''
      const imgView = this.$refs.imgView
      imgView.dialogFlag = true
    },
    handleChange(val) {
      console.log(val);
    },
    getAuthDetailsByOrder() {
      const orderId = this.orderId;
      this.authDetails = []
      getAuthDetails({workId: orderId}).then(res => {
        if (res.success) {
          this.authDetails = res.data
        } else {
          this.$message.warning(res.msg);
        }
      }).catch(error => {
        console.log(error);
        this.$message.warning('获取授权明细失败');
      })
    },
    getOrderInfo() {
      const orderId = this.orderId
      const _this = this
      _this.orderInfo = {}
      getDetailById(orderId).then(res => {
        if (res.success) {
          _this.orderInfo = res.data
          // 根据工单类型、状态获取对应的字典值
          getDictList("info_inspection_plan_type").then(res => {
            const typeList = res.data.filter(t => t.dictKey === _this.orderInfo.type + '')
            _this.dictForOrderType = typeList.length > 0 ? typeList[0].dictValue : _this.orderInfo.type
          })
          getDictList("info_inspection_workOrder_status").then(res => {
            const typeList = res.data.filter(t => t.dictKey === _this.orderInfo.statusInfo + '')
            _this.dictForOrderStatus = typeList.length > 0 ? typeList[0].dictValue : _this.orderInfo.statusInfo
          })
        } else {
          _this.$message.warning(res.msg)
        }
      }).catch(error => {
        console.log(error);
        _this.$message.warning('获取工单详情失败');
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
    // 加载授权结果
    loadAuthResult(row) {
      const status = row['detailStatus']
      const statusList = this.dictForDetailStatus.filter(s => s.dictKey === (status + ''))
      const statusStr = statusList.length === 0 ? '未识别的状态' : statusList[0].dictValue
      if (row.authType === 1) {
        // 机房门禁授权
        if ([0,1,2,4].indexOf(status) >= 0) {
          return statusStr
        } else if (status === 3) {
          return statusStr + (!row['sendFailMsg'] ? '' : (': ' + row['sendFailMsg']))
        } else if (status === 5) {
          const sendFailMsg = !row['sendFailMsg'] ? '' : ('授权下发失败: ' + row['sendFailMsg'] + '; ')
          return sendFailMsg + statusStr + (!row['removeFailMsg'] ? '' : (': ' + row['removeFailMsg']))
        }
      } else {
        // 远程维护授权
        if ([0,1,2,4].indexOf(status) >= 0) {
          return statusStr
        } else if (status === 3) {
          return statusStr + (!row['sendFailMsg'] ? '' : (': ' + row['sendFailMsg']))
        } else {
          const sendFailMsg = !row['sendFailMsg'] ? '' : ('授权下发失败: ' + row['sendFailMsg'] + '; ')
          return sendFailMsg + statusStr + (!row['removeFailMsg'] ? '' : (': ' + row['removeFailMsg']))
        }
      }
      return statusStr
    },
    // 导出巡视详情
    exportDetailFunc() {
      exportDetail(this.orderId).then(res => {
        exportReportFile(res.data).then(res2 => {
          downloadFile(res2, res.data, 'docx')
        })
      })
    },
    showDetailFileFunc(fileList) {
      this.showDetailFile = { flag: true, fileList: fileList }
    },
    closeFileDialogFunc() {
      this.showDetailFile = { flag: false, fileList: [] }
    },
    previewFileFunc(url) {
      if (url && url.length > 0) {
        window.open(url)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266;
}
/* styles.css */
@media print {
  @page {
    size: landscape; /* 设置打印页面为横向 */
  }
}
/deep/.el-badge__content {
  top: 15px;
  right: -1px;
}
</style>
