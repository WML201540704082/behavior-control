<template>
  <basic-container style="padding-bottom: 60px">
    <breadcrumb path="/xcnanr/operationOrder/visitation/index" master-title="巡视工单" :child-title="$route.query.type === 'add' ? '新增' : '编辑'"></breadcrumb>
    <el-form class="xt_form" ref="childDialogForm" :model="childDialogForm" :rules="rules" label-suffix=":" label-width="130px" v-loading="pageLoading" style="width: 1300px;margin: 0 auto;">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="公司" prop="companyName">
              <el-input v-model="childDialogForm.companyName" disabled style="width: 500px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="部门" prop="deptName">
              <el-input  v-model="childDialogForm.deptName" disabled style="width: 500px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视类型" prop="type">
              <el-select v-model="childDialogForm.type" clearable placeholder="请选择巡视类型" style="width: 500px" @change="changeInspectionType()">
                <el-option v-for="item in inspectionTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视人" prop="persons">
              <el-select v-model="childDialogForm.persons" multiple filterable collapse-tags clearable placeholder="请选择巡视人" @change="getChange()" style="width: 500px">
                <el-option v-for="item in authorizedPersonList" :key="item.name" :label="item.name + ' / ' + item.companyName" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视时间段" prop="startTime">
              <el-date-picker v-model="childDialogForm.startTime"
                              class="filter-item"
                              type="datetimerange"
                              @change="judgeTime(childDialogForm.startTime)"
                              :picker-options="pickerOptions"
                              format="yyyy-MM-dd HH:mm"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              :default-time="['08:30:00', '17:30:00']"
                              align="right"
                              style="width: 500px"
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24" style="height: 100%">
          <el-form-item label="巡视内容" prop="content">
            <el-input v-model="childDialogForm.content" clearable placeholder="请输入巡视内容" type="textarea" :rows="3" :maxlength="300" show-word-limit style="width: 1150px;" resize="none"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="childDialogForm.type === '1' ? '巡视场所' : '巡视设备'">
            <div v-if="childDialogForm.type === '1'">
              <el-select v-model="childDialogForm.rooms" v-if="childDialogForm.type === '1'" clearable filterable placeholder="请选择机房" style="width: 500px">
                <el-option v-for="item in roomTreeDatas" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
            <div v-else>
              <el-input v-model="childDialogForm.selectDeviceName" readonly style="width: 500px">
                <el-button slot="append" icon="el-icon-search" @click="chooseDevices">选择设备</el-button>
              </el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配置项">
            <el-select v-model="childDialogForm.roomOrDeviceConfig" clearable filterable placeholder="请选择巡视配置项" style="width: 440px;" @change="getChange()">
              <el-option v-for="item in (childDialogForm.type === '1'?inspectionRoomDatas:inspectionDeviceDatas)" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-button type="primary" style="margin-left: 5px" @click="addNewAuth">新增</el-button>
          </el-form-item>
        </el-col>

        <el-table v-if="childDialogForm.type === '1'" ref="authTable" :key="Math.random()" :data="childDialogForm.orderDetailList" max-height="400" style="margin-left: 130px;width: 1150px">
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="objectName" align="center" show-overflow-tooltip label="所属机房" width="160px" />
          <el-table-column prop="configName" align="center" show-overflow-tooltip label="关联配置项" width="160px" />
          <el-table-column label="配置项" align="center">
            <el-table-column prop="configDetailName" align="center" show-overflow-tooltip label="巡视项" width="160px" />
            <el-table-column prop="configDetailDescription" align="center" show-overflow-tooltip label="描述" />
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button slot="reference" type="text" size="mini" @click="removeInspectionDetails(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table v-if="childDialogForm.type === '2'" :data="childDialogForm.orderDetailList" max-height="400" style="margin-left: 130px;width: 1150px">
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="objectName" align="center" min-width="180" show-overflow-tooltip label="设备名称">
            <template slot-scope="scope">
              {{ ('[' + changeDeviceType(scope.row.extAttr1) + '] ' + scope.row.objectName) }}
            </template>
          </el-table-column>
          <el-table-column prop="extAttr2" align="center" show-overflow-tooltip width="110" label="IP" />
          <el-table-column prop="extAttr3" align="center" show-overflow-tooltip width="155" label="端口">
            <template slot-scope="scope">
              <el-input-number class="item" v-model="scope.row.extAttr3" placeholder="请输入" @input="deviceChangePortFunc(scope.row.extAttr3, scope.row.extAttr2)" :min="0" :max="65535" :precision="0" :step="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="extAttr4" align="center" show-overflow-tooltip label="资产类型">
            <template slot-scope="scope">
              <el-select v-model="scope.row.extAttr4" placeholder="请选择" width="150" @change="deviceChangeSysTypeFunc(scope.row.extAttr4, scope.row.extAttr2)">
                <el-option v-for="dict in getDeviceTypeListFunc(scope.row.extAttr1)" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="configName" align="center" show-overflow-tooltip label="关联配置项" />
          <el-table-column label="配置项" align="center">
            <el-table-column prop="configDetailName" align="center" show-overflow-tooltip label="巡视项" />
            <el-table-column prop="configDetailDescription" align="center" label="描述" />
          </el-table-column>
          <el-table-column label="操作" align="center" width="70">
            <template slot-scope="scope">
              <el-button slot="reference" type="text" size="mini" @click="removeInspectionDetails(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-row>
      <div style="margin: 10px auto;width: 300px;">
        <el-button type="primary" size="small" @click="saveEvent('0')" :loading="saveLoading">保 存</el-button>
        <el-button size="small" @click="returnEvent" :loading="saveLoading">返 回</el-button>
        <el-button type="primary" size="small" @click="saveEvent('1')" :loading="saveLoading">提 交</el-button>
      </div>
    </el-form>
    <device-dialog v-if="deviceDialogFlag" :dialog-flag="deviceDialogFlag" title="巡视" :auth-device-type-list="distForAuthDeviceType" @closeDialog="closeDialogFunc" @submitDialog="loadSelectedDeviceFunc"/>

  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { insertInfoInspectionOrder, updateInfoInspectionOrder,getDetailById } from '@/api/xcnanr/inspectionOrder'
import { getDictList } from '@/api/dict'
import { getAll } from "@/api/xcnanr/authorizedPerson"
import {getAllRoom} from "@/api/xcnanr/room"
import { getAllInspectionConfig, getDataById } from "@/api/xcnanr/visitationConfig"
import DeviceDialog from '../../authManage/temporaryAuth/deviceDialog'
import { getByPlatformId } from "@/api/xcnanr/bastionDevice";
import Breadcrumb from '../../components/Breadcrumb'

  export default {
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
    components: {
      getDictList, DeviceDialog, Breadcrumb
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
        deviceTypeList:[{
          key: '主机设备',
          value: '0'
        },{
          key: '网络设备',
          value: '1'
        }],
        roomTreeDatas:[],
        deviceDatas:[],
        inspectionDatas:[],
        inspectionRoomDatas:[],
        inspectionDeviceDatas:[],
        inspectionTypeList:[],
        inspectionCategoryList:[],
        authorizedPersonList:[],
        operatorType:null,
        childDialogForm: {
          type: '',
          selectDeviceName: ''
        },
        orderDetailList: [],
        rules: {
          companyName: [
            { required: true, message: '公司不能为空', trigger: 'blur' }
          ],
          deptName: [
            { required: true, message: '部门不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '巡视类型不能为空', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '巡视时间段不能为空', trigger: 'blur' }
          ],
          persons: [
            { required: true, message: '巡视人不能为空', trigger: 'blur' }
          ]
        },
        pageLoading: false,
        saveLoading: false,
        tableHeight: undefined,
        tableLoading: false,
        grandsonDialogFlag: false,
        deviceDialogFlag: false,
        distForAuthDeviceType: [],
        selectDeviceList: [],
        dictForBastionHostProtocol: [],
        dictForBastionNetworkProtocol: []
      }
    },
    computed: {
      ...mapGetters(['userDetail'])
    },
    created() {
    },
    mounted() {
      this.getDictList('info_inspection_plan_type')
      this.getDictList('info_inspection_plan_category')
      this.getDictList('info_bastion_server_type')
      this.getDictList('info_bastion_network_type')
      this.getAllInspectionConfig()
      this.operatorType = this.$route.query.type
      this.getList()
      this.getAuthorizedPerson()
      this.getAllRoom()
      // 加载字典信息：需要同步到堡垒机中的一体化设备分类的ID
      getDictList("info_device_send_bastion_type").then(res => {
        this.distForAuthDeviceType = res.data
      })
    },
    methods: {
      judgeTime(time){
        if (time && time.length>1){
          if (time[0].substr(0,10) !== time[1].substr(0,10)) {
            this.$message({
              type: "warning",
              message: "巡视时间段不可跨天!"
            });
            return false
          }
          const endTime = new Date(time[1]).getTime()
          if (endTime<new Date().getTime()) {
            this.$message({
              type: 'warning',
              message: '结束时间不能早于当前时间！'
            });
            return false
          }
        }
        return true
      },
      changeDeviceType(deviecCategory){
        const device = this.deviceTypeList.find(item=>{
          return item.value === deviecCategory
        })
        return device.key
      },
      /**
       * 资产下拉
       * @param deviceCategory
       */
      getDeviceTypeListFunc(deviceCategory) {
        deviceCategory = this.changeDeviceType(deviceCategory)
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
      // 填写设备端口时，相同的设备资产一块补充端口
      deviceChangePortFunc(val, deviceIp) {
        const sameIpList = this.childDialogForm.orderDetailList.filter(d => d.extAttr2 === deviceIp)
        for (let i = 0; i < sameIpList.length; i++) {
          sameIpList[i].extAttr3 = val
        }
      },
      // 选择资产类型时，相同的设备资产一块更改资产类型
      deviceChangeSysTypeFunc(val, deviceIp) {
        const sameIpList = this.childDialogForm.orderDetailList.filter(d => d.extAttr2 === deviceIp)
        for (let i = 0; i < sameIpList.length; i++) {
          sameIpList[i].extAttr4 = val
        }
      },
      getChange(){
        this.$forceUpdate()
      },
      // 选择设备页面点击提交时，需要将已选择的设备同步到本页面（也就是选择设备弹层的父页面）
      loadSelectedDeviceFunc(selectedList) {
        // 一体化正式环境用的是fullName 标准全称
        selectedList = selectedList.map(d => {
          d.deviceName = (!d.fullName ? (!d.deviceName ? '<未命名设备>' : d.deviceName) : d.fullName)
          return d
        })
        this.selectDeviceList = selectedList
        this.deviceDatas = selectedList
        this.childDialogForm.devices = selectedList
        this.childDialogForm.selectDeviceName = selectedList.map(d => d.deviceName).join(', ')
      },
      // 关闭选择设备
      closeDialogFunc() {
        this.deviceDialogFlag = false
      },
      // 选择设备
      chooseDevices() {
        this.deviceDialogFlag = true
      },
      componentClose(){
        this.grandsonDialogFlag = false
      },
      handleStringTimeChange(value) {
        if (value && value.length === 2) {
          return value[0] + '-' + value[1]; // 输出格式化后的时间段字符串
        }
      },
      removeInspectionDetails(index){
        this.childDialogForm.orderDetailList.splice(index,1)
      },
      changeInspectionType(){
        this.childDialogForm.rooms = null
        this.childDialogForm.devices = null
        this.childDialogForm.roomOrDeviceConfig = null
        this.childDialogForm.orderDetailList = []
        this.getChange()
      },
      addNewAuth(){
        if (this.childDialogForm.type === '1'){
          if (!this.childDialogForm.rooms){
            this.$message({
              type: "warning",
              message: "请选择机房!"
            });
            return null
          }
        }else{
          if (!this.childDialogForm.devices){
            this.$message({
              type: "warning",
              message: "请选择设备!"
            });
            return null
          }
        }
        if (!this.childDialogForm.roomOrDeviceConfig){
          this.$message({
            type: "warning",
            message: "请选择配置项!"
          });
          return null
        }
        // 过滤机房/设备
        if (this.childDialogForm.orderDetailList){
          let dataList = []
          if (this.childDialogForm.type === '1') {
            dataList = this.childDialogForm.orderDetailList.filter(item=>{
              return item.objectId === this.childDialogForm.rooms
            })
          }else {
            for (const device of this.childDialogForm.devices){
              for (const detail of this.childDialogForm.orderDetailList) {
                if (detail.objectId === device.id) {
                  dataList.push(detail)
                }
              }
            }
          }
          // 过滤配置项
          if (dataList){
            for (const data of dataList) {
              if (data.configId === this.childDialogForm.roomOrDeviceConfig) {
                this.$message({
                  type: "warning",
                  message: this.childDialogForm.type === '1'?"当前机房与配置项组合已使用!":"当前设备与配置项组合已使用!"
                });
                return null
              }
            }
          }
        }
        // 机房配置项
        // 先过滤机房
        const roomOrDevice = this.childDialogForm.type === '1'? this.roomTreeDatas.find(item=>item.id === this.childDialogForm.rooms):this.childDialogForm.devices
        // 过滤配置项
        const config = this.childDialogForm.type === '1'? this.inspectionRoomDatas.find(item => item.id === this.childDialogForm.roomOrDeviceConfig):this.inspectionDeviceDatas.find(item => item.id === this.childDialogForm.roomOrDeviceConfig)
        // 查询堡垒机同步设备列表，将之前授权过的设备，直接带出端口和设备类型来
        let devices = []
        if(Array.isArray(roomOrDevice)) {
          devices = roomOrDevice.map(item => item.id)
        }
        if(this.childDialogForm.type !== '1') {
          getByPlatformId({ platformIds: devices.join(',') }).then(res => {
            this.deviceTableInfo = []
            this.deviceTableInfo = roomOrDevice.map(roomOrDevice => {
              const syncedItems = res.data.filter(s => s.platformId === (roomOrDevice.id + ''))
              roomOrDevice.extAttr3 = (syncedItems.length === 0 ? 0 : (syncedItems[0].port + ''))
              roomOrDevice.extAttr4 = (syncedItems.length === 0 ? null : (syncedItems[0].sysType + ''))
              return roomOrDevice
            })
          })
        }

        getDataById(config.id).then(res=>{
          // 循环遍历绑定的设备
          if (this.childDialogForm.type === '1'){
            for (const detail of res.data.detailList){
              const planDetail = {
                objectId: roomOrDevice.id,
                objectName: roomOrDevice.name,
                configId: config.id,
                configName: config.name,
                configDetailId: detail.id,
                configDetailName: detail.name,
                configDetailDescription: detail.description,
              }
              this.childDialogForm.orderDetailList.push(planDetail)
            }
          } else {
            getByPlatformId({ platformIds: this.selectDeviceList.join(',') }).then(devieRes => {
              const syncedDeviceList = devieRes.data
              for (const detail of res.data.detailList){
                // 选择设备遍历
                for (const device of roomOrDevice){
                  const syncedItems = syncedDeviceList.filter(s => s.platformId === (device.id + ''))
                  const deviceCategory = device.deviceCategory === '主机设备'?'0':'1'
                  const planDetail = {
                    objectId: device.id,
                    objectName: device.deviceName,
                    extAttr1: deviceCategory,
                    extAttr2: device.IP,
                    extAttr3: device.extAttr3,
                    extAttr4: device.extAttr4,
                    configId: config.id,
                    configName: config.name,
                    configDetailId: detail.id,
                    configDetailName: detail.name,
                    configDetailDescription: detail.description
                  }
                  this.childDialogForm.orderDetailList.push(planDetail)
                }
              }
            })
          }
        })
      },
      getAllRoom(){
        getAllRoom().then(res=>{
          this.roomTreeDatas = res.data
        })
      },
      getAllInspectionConfig(){
        const inspectionConfig = {
          enabled: 1
        }
        getAllInspectionConfig(inspectionConfig).then(res=>{
          this.inspectionDatas = res.data
          this.inspectionRoomDatas = res.data.filter(item=>{
            return item.type === 1
          })
          this.inspectionDeviceDatas = res.data.filter(item=>{
            return item.type === 2
          })
        })
      },
      // 设置表格高度
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 55 - 48 - 47 + 'px'
      },
      //加载字典
      getDictList(code){
        getDictList(code).then(res => {
          if(code==='info_inspection_plan_type'){
            this.inspectionTypeList = res.data
          }else if (code==='info_inspection_plan_category'){
            this.inspectionCategoryList = res.data
          }else if (code === 'info_bastion_server_type') {
            this.dictForBastionHostProtocol = res.data
          } else if (code === 'info_bastion_network_type') {
            this.dictForBastionNetworkProtocol = res.data
          }
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
      getList(){
        if (this.operatorType === 'add'){
          this.childDialogForm = {
            type: '1',
            companyId: this.userDetail.ownerUnit,
            companyName: this.userDetail.ownerUnitName,
            companyRegionCode: this.userDetail.regionCode,
            deptId: this.userDetail.deptId,
            deptName: this.userDetail.deptName,
            orderDetailList: []
          }
        }else if (this.operatorType === 'edit') {
          getDetailById(this.$route.query.id).then(res=>{
            this.childDialogForm = res.data
            const times = []
            times[0] = this.childDialogForm.startTime
            times[1] = this.childDialogForm.finishTime
            this.childDialogForm.startTime = times
            this.childDialogForm.type += ''
            this.childDialogForm.persons = []
            for (const person of this.childDialogForm.relatedWorkerList){
              this.childDialogForm.persons.push(person.workerId)
            }
          })
        }
      },
      getAuthorizedPerson(){
        getAll({enabled: 1,companyId: this.childDialogForm.companyId}).then(res=>{
          this.authorizedPersonList = res.data
        })
      },
      // 保存
      saveEvent(submitType) {
        this.childDialogForm.isSubmit = submitType
        this.$refs.childDialogForm.validate((valid) => {
          if (valid) {
            if (this.childDialogForm.orderDetailList.length <= 0) {
              this.$message({ type: 'error', message: ('请先添加' + ((this.childDialogForm.type + '' === '1') ? '巡视场所' : '巡视设备'))  });
              return
            }

            // 先检查表格中的字段是否都填写了
            if (this.childDialogForm.type === '2') {
              for (const data of this.childDialogForm.orderDetailList){
                if (!data.extAttr3 || data.extAttr3 === ''){
                  this.$message({ type: 'error', message: data.objectName + '端口号为空' });
                  return
                }
                if (!data.extAttr4 || data.extAttr4 === ''){
                  this.$message({ type: 'error', message: data.objectName + '资产类型为空' });
                  return
                }
              }
            }
            // 时间段
            const times = this.childDialogForm.startTime
            if (!this.judgeTime(times)){
              return;
            }
            this.saveLoading = true
            this.childDialogForm.startTime = times[0]
            this.childDialogForm.finishTime = times[1]

            this.childDialogForm.relatedWorkerList = []
            // 遍历封装人员
            for (const personId of this.childDialogForm.persons) {
              const authorizedPerson = this.authorizedPersonList.find(item=>item.id === personId);
              const inspectionPerson = {
                workerId: authorizedPerson.id,
                workerName: authorizedPerson.name,
                companyId: authorizedPerson.companyId,
                companyName: authorizedPerson.companyName,
                departmentId: authorizedPerson.departmentId,
                departmentName: authorizedPerson.departmentName,
              }
              this.childDialogForm.relatedWorkerList.push(inspectionPerson)
            }
            // 配置二次确认的提示语
            let markedWords = ''
            if(submitType === '0') {
              markedWords = '该工单保存后不下发授权，如需到达巡视时间后自动下发授权请再次点击【提交】,是否暂存？'
            } else {
              markedWords = '该工单提交后将不可编辑，是否提交？'
            }
            if (this.operatorType === 'add') {
              this.$confirm(markedWords, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                insertInfoInspectionOrder(this.childDialogForm).then(res => {
                  this.saveLoading = false
                  if (res.code === 200){
                    this.$message({ type: 'success', message: '保存成功！' })
                  }else {
                    this.$message({ type: 'error', message: res.msg });
                  }
                  this.childDialogForm.persons = []
                  this.returnEvent()
                }).catch(() => {
                  this.saveLoading = false
                })
              }).catch(() => {
                this.saveLoading = false
              })
            }else {
              this.$confirm(markedWords, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                updateInfoInspectionOrder(this.childDialogForm).then(res => {
                  this.saveLoading = false
                  if (res.code === 200){
                    this.$message({ type: 'success', message: '编辑成功！' })
                    this.returnEvent()
                  }else {
                    this.$message({ type: 'error', message: res.msg });
                  }
                }).catch(() => {
                  this.saveLoading = false
                })
              }).catch(() => {
                this.saveLoading = false
              })
            }
          }
        })
      },
      // 字符串转时间判断
      changeTime(str){
        if (new Date(str).getTime()<new Date().getTime()) {
          this.$message({
            type: 'error',
            message: '结束时间不能早于当前时间！'
          });
          return false
        }
        return new Date(str).getTime()<new Date().getTime()
      },
      returnEvent(){
        if (this.operatorType === 'add') {
          document.querySelectorAll('*[id^="tab-/xcnanr/inspectWorkOrderAdd"]')[0].childNodes[1].click()
          this.$router.push('/xcnanr/operationOrder/visitation/index')
        }else {
          document.querySelectorAll('*[id^="tab-/xcnanr/inspectWorkOrderEdit"]')[0].childNodes[1].click()
          this.$router.push('/xcnanr/operationOrder/visitation/index')
        }
      },
      formatTime(date) {
        if (date) {
          return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        }
        return '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-input.is-disabled .el-input__inner{
    color: #606266;
  }
  .el-card {
    border: 1px solid #eee !important;
  }
  ::v-deep(.el-textarea .el-input__count){
    background: #e0f3ff10 !important;
  }
  ::v-deep(.el-input .el-input__count .el-input__count-inner){
    background: #e0f3ff10 !important;
  }
</style>
