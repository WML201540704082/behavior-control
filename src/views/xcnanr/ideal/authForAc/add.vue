<template>
  <basic-container>
    <breadcrumb path="/xcnanr/ideal/authForAc/index" master-title="门禁临时授权" child-title="新增"></breadcrumb>
    <el-form class="xt_form" ref="form" :model="form" inline :rules="rules" label-suffix=":" label-width="130px" v-loading="pageLoading" style="width: 1300px;margin: 0 auto 40px auto;">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="公司" prop="companyId">
              <el-input v-model="form.companyName" disabled placeholder="请选择公司" style="width: 500px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="部门" prop="deptId">
              <el-input v-model="form.deptName" disabled placeholder="请选择部门" style="width: 500px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="计划开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                :picker-options="pickerOptions"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 500px"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="计划结束时间" prop="finishTime">
              <el-date-picker
                v-model="form.finishTime"
                type="datetime"
                :picker-options="pickerOptions"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 500px"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <div class="grid-content bg-purple">
          <el-form-item label="授权原因" prop="reason">
            <el-input type="textarea" :rows="3" v-model="form.reason" placeholder="请输入授权原因" maxlength="300" show-word-limit style="width: 1150px" />
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="被授权人" prop="mode">
              <el-select v-model="form.tempWorkers" clearable multiple filterable collapse-tags placeholder="请选择被授权人" style="width: 500px;">
                <el-option v-for="worker in workerList" :key="worker.id" :label="worker.name + ' / ' + worker.companyName" :value="worker.id" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="授权对象" prop="objects">
              <el-select v-if="parseInt(form.authType) === 1" filterable v-model="form.tempRooms" clearable multiple collapse-tags placeholder="请选择需要授权的机房" style="width: 500px;">
                <el-option v-for="room in roomList" :key="room.id" :label="room.name + ' / ' + room.companyName" :value="room.id" />
              </el-select>
              <el-input v-if="parseInt(form.authType) === 2" v-model="form.tempDeviceStr" readonly placeholder="请点击搜索按钮选择授权对象" style="width: 500px">
                <el-button slot="append" icon="el-icon-search" @click="checkDeviceFunc">选择设备</el-button>
              </el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="margin-left: 130px;" @click="addAuthDetailFunc">添加授权明细</el-button>
        </el-col>
        <el-col :span="24" style="height: 100%">
          <div class="grid-content bg-purple">
            <el-form-item label="授权明细">
              <el-table ref="arrtTable" :data="formDetailObject" :key="detailTableKey" stripe style="overflow-y: auto;width: 1160px" height="400" v-loading="formDetailLoading">
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column label="授权类型" prop="authType" :width="formDetailObject.filter(d => d.authType === '2').length > 0 ? '150' : '250'" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ conversionDict(scope.row['authType'], dictForType) }}</span>
                  </template>
                </el-table-column>
                <!--v-if="formDetailObject.filter(d => d.authType === '2').length > 0"-->
                <el-table-column label="被授权人" prop="workerName" :width="formDetailObject.filter(d => d.authType === '2').length > 0 ? '100' : '280'" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="授权对象" prop="objectName" :width="formDetailObject.filter(d => d.authType === '2').length > 0 ? '260' : '460'" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row.authType === '1' ? scope.row.objectName : ('[' + scope.row.deviceCategory + '] ' + scope.row.objectName) }}
                  </template>
                </el-table-column>
                <el-table-column v-if="formDetailObject.filter(d => d.authType === '2').length > 0" label="授权设备IP" prop="deviceIp" width="150" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column v-if="formDetailObject.filter(d => d.authType === '2').length > 0" label="远程端口" prop="devicePort" width="150" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.authType === '1'">{{ scope.row.devicePort }}</span>
                    <el-input v-else class="item" v-model="scope.row.devicePort" placeholder="请输入远程端口" @input="deviceChangePortFunc(scope.row.devicePort, scope.row.deviceIp)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column v-if="formDetailObject.filter(d => d.authType === '2').length > 0" label="资产类型" prop="deviceSysType" width="180" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.authType === '1'">{{ '-' }}</span>
                    <el-select v-else v-model="scope.row.deviceSysType" placeholder="请选择设备类型" @change="deviceChangeSysTypeFunc(scope.row.deviceSysType, scope.row.deviceIp)">
                      <el-option v-for="dict in getDeviceTypeListFunc(scope.row.deviceCategory)" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-link type="primary" size="mini" :underline="false" @click="removeRow(scope.row)">
                      <span class="s_lt">移 除</span>
                    </el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </div>
        </el-col>
        <!-- 底边按钮 -->
        <el-col :span="24">
          <div style="display: flex; justify-content: center; align-items: center">
            <el-button type="info" @click="closeTab">取 消</el-button>
            <el-button type="primary" size="small" v-loading="submitBtnLoading" @click="submitForm">提 交</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </basic-container>
</template>

<script>
import {mapGetters} from 'vuex'
import { getDictList } from '@/api/dict'
import { getAll as getAllWorkers, checkWorkerHasFace } from "@/api/xcnanr/authorizedPerson"
import { getAllRoom } from "@/api/xcnanr/room"
import { addApi } from "@/api/xcnanr/temporaryAuth";
import { getByPlatformId } from "@/api/xcnanr/bastionDevice";
import Breadcrumb from '../../components/Breadcrumb'

export default {
  components: { Breadcrumb },
  props: {
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
      pickerOptions: {
        // 禁止选择过去时间
        disabledDate: (time) => {
          const curTime = new Date()
          curTime.setDate(curTime.getDate() - 1)
          return time.getTime() < curTime
        }
      },
      form: { companyId: null, companyName: null, deptId: null, deptName: null, startTime: null, finishTime: null, authType: '1',
        tempWorkers: [], tempRooms: [], selectedDeviceList: [], tempDeviceStr: '', tempObjects: [] },
      formDetailObject: [], formDetailLoading: false, detailTableKey: 0, selectDeviceList: [],
      deviceDialogFlag: false,
      dictForType: [],
      distForAuthDeviceType: [],
      dictForBastionHostSysType: [],
      dictForBastionNetworkSysType: [],
      workerList: [],
      roomList: [],
      submitBtnLoading: false,
      rules: {
        companyId: [
          { required: true, message: '公司不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '部门不能为空', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '计划开始时间不能为空', trigger: 'blur' }
        ],
        finishTime: [
          { required: true, message: '计划结束时间不能为空', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '授权原因不能为空', trigger: 'blur' }
        ]
      },


    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userDetail']),
    showChild: {
      get: function() {
        return this.childDialogFlag
      },
      set: function(newValue) {
        this.$emit('update:childDialogFlag', newValue)
      }
    }
  },
  created() {
    // 加载字典信息：授权类型
    getDictList("info_temporary_auth_type").then(res => {
      this.dictForType = res.data
    })
    // 加载字典信息：需要同步到堡垒机中的一体化设备分类的ID
    getDictList("info_device_send_bastion_type").then(res => {
      this.distForAuthDeviceType = res.data
    })
    // 加载字典信息：堡垒机中主机设备协议
    getDictList("info_bastion_server_type").then(res => {
      this.dictForBastionHostSysType = res.data
    })
    // 加载字典信息：堡垒机中网络设备协议
    getDictList("info_bastion_network_type").then(res => {
      this.dictForBastionNetworkSysType = res.data
    })
  },
  mounted() {
    // 初始化部分form表单
    this.form['companyId'] = this.userDetail.ownerUnit
    this.form['companyName'] = this.userDetail.ownerUnitName
    this.form['deptId'] = this.userDetail.deptId
    this.form['deptName'] = this.userDetail.deptName
    const thisDay = new Date()
    const thisMonthInt = thisDay.getMonth() + 1
    const thisDayStr = thisDay.getFullYear() + '-' + (thisMonthInt < 10 ? '0' + thisMonthInt : thisMonthInt) + '-' + (thisDay.getDate() < 10 ? '0' + thisDay.getDate() : thisDay.getDate())
    this.form['startTime'] = thisDayStr + ' 08:30:00'
    this.form['finishTime'] = thisDayStr + ' 17:30:00'
    // 获取机房下拉数据
    getAllRoom().then(res => {
      this.roomList = res.data
    })
    // 获取被授权人下拉数据
    getAllWorkers({ enabled: 1 }).then(res => {
      this.workerList = res.data
    })
  },
  methods: {
    // 打开选择设备弹层
    checkDeviceFunc() {
      this.deviceDialogFlag = true
    },
    // 关闭选择设备弹层
    closeDialogFunc() {
      this.deviceDialogFlag = false
    },
    // 选择设备页面点击提交时，需要将已选择的设备同步到本页面（也就是选择设备弹层的父页面）
    loadSelectedDeviceFunc(selectedList) {
      this.selectDeviceList = selectedList
      // 已选择设备回显
      this.form.tempDeviceStr = selectedList.map(d => d['IP']).join(', ')

      // 如果
      if (this.form.tempWorkers.length > 0) {
        this.addAuthDetailFunc()
      }
    },
    // 关闭新增临时授权tab
    closeTab() {
      this.$router.push({ path: '/xcnanr/ideal/authForAc/index' })
    },
    // 已选择的授权对象移除
    removeRow(row) {
      for (let i = 0; i < this.formDetailObject.length; i++) {
        const item = this.formDetailObject[i]
        if (item.authType === row.authType && item.objectId === row.objectId && item.workerId === row.workerId) {
          this.formDetailObject.splice(i, 1)
        }
      }
    },
    // 根据主机设备或网络设备，获取设备类型下的访问协议
    getDeviceTypeListFunc(deviceCategory) {
      const protocolList = []
      let list = this.dictForBastionHostSysType.filter(d => d.remark === deviceCategory)
      if (list.length === 0) {
        list = this.dictForBastionNetworkSysType.filter(d => d.remark === deviceCategory)
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
    // 根据设备类型获取堡垒机的资产类型
    getDeviceTypeCode(deviceCategory) {
      let list = this.dictForBastionHostSysType.filter(d => d.remark === deviceCategory)
      if (list.length !== 0) {
        return 0
      }
      list = this.dictForBastionNetworkSysType.filter(d => d.remark === deviceCategory)
      if (list.length !== 0) {
        return 1
      }
    },
    // 添加授权明细按钮事件
    addAuthDetailFunc() {
      const _this = this
      if (_this.form.tempWorkers.length === 0) {
        _this.$message({
          message: '未选择被授权人',
          type: 'warning'
        })
        return
      }
      if (_this.form.authType === '1') {
        // 机房授权操作
        if (_this.form.tempRooms.length === 0) {
          _this.$message({
            message: '未选择授权对象',
            type: 'warning'
          })
          return
        }
        // 需要验证选择的被授权人是否有人脸信息
        checkWorkerHasFace(_this.form.tempWorkers.join(',')).then(res => {
          if (res.code != 200) {
            _this.$message({
              message: '操作失败',
              type: 'error'
            })
            return
          }
          if (res.data) {
            _this.$message({
              message: res.data + '未上传人脸信息',
              type: 'warning'
            })
            return
          }
          this.formDetailLoading = true
          // 如果多个人选择了多个机房，授权明细表格需要相乘显示
          for (let i = 0; i < _this.form.tempRooms.length; i++) {
            const selectRoomId = _this.form.tempRooms[i]
            for (let j = 0; j < _this.form.tempWorkers.length; j++) {
              const selectWorkerId = _this.form.tempWorkers[j]
              const tempList = _this.formDetailObject.filter(o => o.objectId === selectRoomId && o.workerId === selectWorkerId)
              if (tempList.length === 0) {
                const selectRoom = _this.roomList.filter(r => r.id === selectRoomId)[0]
                const selectWorker = _this.workerList.filter(r => r.id === selectWorkerId)[0]
                const detail = {
                  authType: '1', workerId: selectWorkerId, workerName: selectWorker.name,
                  objectId: selectRoomId, objectName: selectRoom.name, deviceIp: '-',
                  devicePort: '-', deviceSysType: null
                }
                _this.$set(_this.formDetailObject, _this.formDetailObject.length, detail);  // 使用 Vue.set 修改数组中的对象

              }
            }
          }
          _this.form.tempRooms = []
          _this.form.tempWorkers = []
          _this.detailTableKey += 1
          _this.formDetailLoading = false
        })
      } else if (_this.form.authType === '2') {
        // 远程维护操作
        if (_this.selectDeviceList.length === 0) {
          _this.$message({
            message: '未选择授权对象',
            type: 'warning'
          })
          return
        }
        this.formDetailLoading = true
        // 查询堡垒机同步设备列表，将之前授权过的设备，直接带出端口和设备类型来
        const selectDeviceIdList = []
        for (let i = 0; i < _this.selectDeviceList.length; i++) {
          selectDeviceIdList.push(_this.selectDeviceList[i].id)
        }
        getByPlatformId({ platformIds: selectDeviceIdList.join(',') }).then(res => {
          const syncedDeviceList = res.data
          for (let i = 0; i < _this.selectDeviceList.length; i++) {
            const selectItem = _this.selectDeviceList[i]
            const syncedItems = syncedDeviceList.filter(s => s.platformId === (selectItem.id + ''))
            for (let j = 0; j < _this.form.tempWorkers.length; j++) {
              const selectWorkerId = _this.form.tempWorkers[j]
              const tempList = _this.formDetailObject.filter(o => o.objectId === selectItem.id && o.workerId === selectWorkerId)
              if (tempList.length === 0) {
                const selectWorker = _this.workerList.filter(r => r.id === selectWorkerId)[0]
                // 一体化正式环境用的是fullName 标准全称
                const objName = !selectItem.fullName ? (!selectItem.deviceName ? '<未命名设备>' : selectItem.deviceName) : selectItem.fullName
                const detail = {
                  authType: '2', workerId: selectWorker.id, workerName: selectWorker.name,
                  objectId: selectItem.id, objectName: objName, deviceIp: selectItem.IP,
                  devicePort: (syncedItems.length === 0 ? null : (syncedItems[0].port + '')),
                  deviceSysType: (syncedItems.length === 0 ? null : (syncedItems[0].sysType + '')),
                  deviceCategory: selectItem.deviceCategory,
                  deviceType: this.getDeviceTypeCode(selectItem.deviceCategory)
                }
                _this.$set(_this.formDetailObject, _this.formDetailObject.length, detail);  // 使用 Vue.set 修改数组中的对象
              }
            }
          }
          _this.selectDeviceList = []
          _this.form.tempDeviceStr = ''
          _this.form.tempWorkers = []
          _this.detailTableKey += 1
          _this.formDetailLoading = false
        })
      }
    },
    // 字典回显
    conversionDict(code, dictList) {
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code)
        if (items != null && items.length > 0) {
          return items[0].dictValue
        }
      }
      return code
    },
    // 切换授权类型时，未添加明细的授权对象需要清除掉
    changeAuthTypeFunc() {
      this.form.tempRooms = []
      this.selectDeviceList = []
      this.form.tempDeviceStr = ''
    },
    // 提交表单
    submitForm() {
      this.submitBtnLoading = true
      const _this = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (_this.form.startTime >= _this.form.finishTime) {
            _this.$message({ message: '计划开始时间不能晚于计划结束时间', type: 'warning' })
            _this.submitBtnLoading = false
            return
          }
          if (_this.formDetailObject.length === 0) {
            _this.$message({ message: '请先添加授权明细', type: 'warning' })
            _this.submitBtnLoading = false
            return
          }
          // 拼接后台接收对象
          const detailList = []
          for (let i = 0; i < _this.formDetailObject.length; i++) {
            const detail = _this.formDetailObject[i]
            detailList.push(detail)
          }
          _this.form['details'] = detailList
          addApi(_this.form).then(res => {
            if (!!res && res.code === 200) {
              _this.$message({
                message: '新增成功',
                type: 'success'
              });
              _this.closeTab()
            } else {
              _this.$message({
                message: '操作失败',
                type: 'error'
              })
            }
            _this.submitBtnLoading = false
          }).catch(() => {
            _this.submitBtnLoading = false
          })
        } else {
          _this.submitBtnLoading = false
        }
      })
    },
    // 填写设备端口时，相同的设备资产一块补充端口
    deviceChangePortFunc(val, deviceIp) {
      const sameIpList = this.formDetailObject.filter(d => d.authType === '2' && d.deviceIp === deviceIp)
      for (let i = 0; i < sameIpList.length; i++) {
        sameIpList[i].devicePort = val
      }
    },
    // 选择资产类型时，相同的设备资产一块更改资产类型
    deviceChangeSysTypeFunc(val, deviceIp) {
      const sameIpList = this.formDetailObject.filter(d => d.authType === '2' && d.deviceIp === deviceIp)
      for (let i = 0; i < sameIpList.length; i++) {
        sameIpList[i].deviceSysType = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep(.el-textarea .el-input__count){
    background: #e0f3ff10 !important;
  }
  ::v-deep(.el-input .el-input__count .el-input__count-inner){
    background: #e0f3ff10 !important;
  }
</style>
