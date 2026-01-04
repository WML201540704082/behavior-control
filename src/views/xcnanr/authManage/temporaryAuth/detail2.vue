<template>
  <basic-container style="padding-bottom: 60px">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="20">
          <el-row>
            <el-form ref="form" v-if="authObject !== null" :model="authObject" inline :rules="rules" label-suffix=":" label-width="120px" v-loading="pageLoading" style="margin-top: 20px">
              <el-form-item label="公司" prop="companyId">
                <el-input v-model="authObject.companyName" readonly style="width: 300px" />
              </el-form-item>
              <el-form-item label="部门" prop="deptId">
                <el-input v-model="authObject.deptName" readonly style="width: 300px" />
              </el-form-item>
              <el-form-item label="发起人" prop="startTime">
                <el-input v-model="authObject.createUserName" readonly style="width: 300px" />
              </el-form-item>
              <el-form-item label="计划开始时间" prop="startTime">
                <el-input v-model="authObject.startTime" readonly style="width: 300px" />
              </el-form-item>
              <el-form-item label="计划结束时间" prop="finishTime">
                <el-input v-model="authObject.finishTime" readonly style="width: 300px" />
              </el-form-item>
              <el-form-item label="实际结束时间" prop="finishTime">
                <el-input v-model="authObject.realTime" readonly style="width: 300px" />
              </el-form-item>
              <br>
              <el-form-item label="授权编号" prop="code">
                <el-input v-model="authObject.code" readonly style="width: 300px" />
              </el-form-item>
              <el-form-item label="授权状态" prop="startTime">
                <el-input v-model="authObject.woStatus" readonly style="width: 300px" />
              </el-form-item>
              <br>
              <el-form-item label="授权原因" prop="reason">
                <el-input type="textarea" :rows="3" readonly v-model="authObject.reason" style="width: 1160px" />
              </el-form-item>
              <br>
            </el-form>
          </el-row>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="22">
          <el-table
              ref="arrtTable"
              :data="formDetailObject"
              :key="detailTableKey"
              stripe
              height="450"
              v-loading="formDetailLoading"
          >
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column label="授权类型" prop="authType" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ conversionDict(scope.row['authType'], dictForType) }}</span>
              </template>
            </el-table-column>
            <!--v-if="formDetailObject.filter(d => d.authType === '2').length > 0"-->
            <el-table-column label="被授权人" prop="workerName" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="授权对象" prop="objectName" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.objectName }}
              </template>
            </el-table-column>
            <el-table-column v-if="formDetailObject.filter(d => d.authType === 2).length > 0" label="授权设备IP" prop="deviceIp" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="formDetailObject.filter(d => d.authType === 2).length > 0" label="远程端口" prop="devicePort" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="formDetailObject.filter(d => d.authType === 2).length > 0" label="资产类型" prop="deviceProtocol" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ conversionDict(scope.row['deviceProtocol'], (scope.row.deviceType === 0 ? dictForBastionHostProtocol : dictForBastionNetworkProtocol)) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="授权结果" align="center" width="300px">
              <template slot-scope="scope">
                {{ loadAuthResult(scope.row) }}
              </template>
            </el-table-column>
          </el-table>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

  </basic-container>
</template>

<script>
import {mapGetters} from 'vuex'
import { getDictList } from '@/api/dict'
import { getAll as getAllDetails } from "@/api/xcnanr/temporaryAuthDetail";
import { getAll as getAllAuth } from "@/api/xcnanr/temporaryAuth";
import { getWorkerByIdIn } from "@/api/xcnanr/authorizedPerson";

export default {
  components: {},
  props: {
    dialogFlag: {
      type: Boolean,
      default: false
    },
    childDialogFlag: {
      type: Boolean,
      default: false
    },
    dialogType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      authCode: null,
      authObject: null,
      formDetailObject: [], formDetailLoading: true, detailTableKey: 0, selectDeviceList: [],
      dictForType: [],
      dictForBastionHostProtocol: [],
      dictForBastionNetworkProtocol: [],
      dictForDetailStatus: [],
      authWorkerList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userDetail']),
  },
  created() {
    this.authCode = this.$route.query.authCode
    this.getAuthObject()
    // 加载字典信息：授权类型
    getDictList("info_temporary_auth_type").then(res => {
      this.dictForType = res.data
    })
    // 加载字典信息：堡垒机中主机设备协议
    getDictList("info_bastion_server_type").then(res => {
      this.dictForBastionHostProtocol = res.data
    })
    // 加载字典信息：堡垒机中网络设备协议
    getDictList("info_bastion_network_type").then(res => {
      this.dictForBastionNetworkProtocol = res.data
    })
    // 加载字典信息：授权明细授权状态
    getDictList("info_order_detail_auth_status").then(res => {
      this.dictForDetailStatus = res.data
    })
    // 加载字典信息
    getDictList("info_temporary_auth_status").then(res => {
      for (let i = 0; i < res.data.length; i++) {
        const item = res.data[i]
        if (item.dictKey === (this.authObject['woStatus']+'')) {
          this.authObject['woStatus'] = item.dictValue
        }
      }
    })
  },
  mounted() {


  },
  methods: {
    closeTab() {
      document.getElementById('tab-/xcnanr/tempAuthAdd?type=add').childNodes[1].click()
    },
    getAuthObject(){
      const _this = this
      getAllAuth({code:_this.authCode}).then(res => {
        if (res && res.data) {
          _this.authObject = res.data[0]
          // 实际结束时间修改
          if (!_this.authObject.realTime) {
            _this.authObject.realTime = '-'
          }
          _this.getAllData()
        }
      })
    },
    getAllData() {
      const _this = this
      // 加载授权明细
      getAllDetails({ workId: _this.authObject.id }).then(res => {
        _this.formDetailObject = res.data
        // 根据被授权人列表，查询被授权人信息
        const workerIds = this.formDetailObject.map(d => d.workerId)
        getWorkerByIdIn(workerIds).then(res => {
          _this.authWorkerList = res.data
          _this.formDetailLoading = false
        })
      })
    },
    // 根据主机设备或网络设备，获取设备类型下的访问协议
    getDeviceTypeListFunc(deviceCategory) {
      const protocolList = []
      let list = this.dictForBastionHostProtocol.filter(d => d.remark === deviceCategory)
      if (list.length === 0) {
        list = this.dictForBastionNetworkProtocol.filter(d => d.remark === deviceCategory)
      }
      if (list.length === 0) {
        return []
      }
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item.dictKey !== '-1') {
          protocolList.push(item)
        }
      }
      return protocolList
    },
    //字典回显
    conversionDict(code, dictList) {
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code)
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
        if (status === 0 || status === 1|| status === 2 || status == 4) {
          return statusStr
        } else if(status === 3) {
          return statusStr + (!row['sendFailMsg'] ? '' : (': ' + row['sendFailMsg']))
        } else if (status === 5) {
          const sendFailMsg = !row['sendFailMsg'] ? '' : ('授权下发失败: ' + row['sendFailMsg'] + '; ')
          return sendFailMsg + statusStr + (!row['removeFailMsg'] ? '' : (': ' + row['removeFailMsg']))
        }
      } else {
        // 远程维护授权
        if (status === 0 || status == 1 || status == 4) {
          return statusStr
        } else if (status === 2) {
          // 授权状态为授权推送成功时，如果当前登录人是填报人、或者是授权明细的被授权人是当前登录人的话，要能看到对应的登录信息
          const createUserIsLoginUser = this.userInfo.userId + '' === this.authObject.createUser
          const detailUserIsLoginUser = this.authWorkerList.filter(d => d.id === row.workerId && d.platformId === this.userInfo.userId + '').length > 0
          if (createUserIsLoginUser || detailUserIsLoginUser) {
            return '堡垒机登录地址: ' + row['bastionUrl'] + ', 登录账号: ' + row['tempUser'] + ', 登录密码: ' + row['tempPwd']
          } else {
            return statusStr
          }
        } else if (status === 3) {
          return statusStr + (!row['sendFailMsg'] ? '' : (': ' + row['sendFailMsg']))
        } else {
          const sendFailMsg = !row['sendFailMsg'] ? '' : ('授权下发失败: ' + row['sendFailMsg'] + '; ')
          return sendFailMsg + statusStr + (!row['removeFailMsg'] ? '' : (': ' + row['removeFailMsg']))
        }
      }
      return statusStr
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner{
  background-color: #e0f3ff;
}
/deep/ .el-textarea__inner {
  background-color: #e0f3ff;
}
</style>
