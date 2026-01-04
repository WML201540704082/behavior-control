<template>
  <basic-container style="padding-bottom: 60px">
    <breadcrumb path="/xcnanr/ideal/inspectionPlan/index" master-title="巡视计划" :child-title="$route.query.type === 'Add' ? '新增' : '编辑'"></breadcrumb>
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
            <el-form-item label="部门" prop="departmentName">
              <el-input v-model="childDialogForm.departmentName" disabled style="width: 500px" />
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
            <el-form-item label="预置巡视人" prop="persons">
              <el-select v-model="childDialogForm.persons" multiple filterable clearable collapse-tags placeholder="请选择巡视人" style="width: 500px">
                <el-option v-for="item in authorizedPersonList" :key="item.name" :label="item.name + ' / ' + item.companyName" :value="item.id" />
              </el-select>
              <!--<div>
                <el-button class="select-button-ad" title="新增被授权人员" icon="el-icon-user" @click="addWorker" ></el-button>
              </div>-->
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视类别" prop="category">
              <el-select v-model="childDialogForm.category" clearable placeholder="请选择巡视类别" style="width: 500px" @change="changeCategory()">
                <el-option v-for="dict in inspectionCategoryList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="周期配置" prop="period">
              <el-select ref="selectPeriod" v-model="childDialogForm.period" :multiple="childDialogForm.category !== '1'" clearable placeholder="请选择巡视周期" style="width: 500px">
                <el-option v-for="item in (childDialogForm.category === '1' ? categoryDayList : (childDialogForm.category === '2' ? categoryWeekendList : categoryMonthList))" :key="item.value" :label="item.key" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视时间段" prop="time1">
              <!--  一天两次 -->
              <el-row v-if="childDialogForm.category === '1' && childDialogForm.period === '2'">
                <el-col :span="8">
                  <el-time-picker v-model="time1" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format="HH:mm" value-format="HH:mm:ss" align="right" style="width: 380px" clearable />
                </el-col>
                <el-col :span="8">
                  <el-time-picker v-model="time2" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format="HH:mm" value-format="HH:mm:ss" align="right" style="width: 380px" clearable />
                </el-col>
              </el-row>
              <!--  一天三次 -->
              <el-row v-else-if="childDialogForm.category === '1' && childDialogForm.period === '3'">
                <el-col :span="8">
                  <el-time-picker v-model="time1" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format="HH:mm" value-format="HH:mm:ss" align="right" />
                </el-col>
                <el-col :span="8">
                  <el-time-picker v-model="time2" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format="HH:mm" value-format="HH:mm:ss" align="right" />
                </el-col>
                <el-col :span="8">
                  <el-time-picker v-model="time3" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format="HH:mm" value-format="HH:mm:ss" align="right" />
                </el-col>
              </el-row>
              <!--  一天四次 -->
              <el-row v-else-if="childDialogForm.category === '1' && childDialogForm.period === '4'">
                <el-col :span="5">
                  <el-time-picker v-model="time1" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format="HH:mm" value-format="HH:mm:ss" align="right" style="width: 250px" clearable />
                </el-col>
                <el-col :span="5" style="margin-left: 15px">
                  <el-time-picker v-model="time2" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format="HH:mm" value-format="HH:mm:ss" align="right" style="width: 250px" clearable />
                </el-col>
                <el-col :span="5" style="margin-left: 15px">
                  <el-time-picker v-model="time3" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format="HH:mm" value-format="HH:mm:ss" align="right" style="width: 250px" clearable />
                </el-col>
                <el-col :span="5" style="margin-left: 15px">
                  <el-time-picker v-model="time4" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format="HH:mm" value-format="HH:mm:ss" align="right" style="width: 250px" clearable />
                </el-col>
              </el-row>
              <!--  一天一次 -->
              <el-row v-else>
                <el-col>
                  <el-time-picker v-model="time1" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format="HH:mm" value-format="HH:mm:ss" align="right" style="width: 500px" clearable />
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24" style="height: 100%;">
          <div class="grid-contents bg-purple">
            <el-form-item label="巡视内容" prop="content">
              <el-input v-model="childDialogForm.content" clearable placeholder="请输入巡视内容" type="textarea" :rows="2" style="width: 1150px;" :maxlength="300" show-word-limit />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-contents bg-purple">
            <el-form-item :label="childDialogForm.type === '1'?'巡视场所':'巡视对象'">
              <div v-if="childDialogForm.type === '1'">
                <el-select v-model="childDialogForm.rooms" filterable v-if="childDialogForm.type === '1'" clearable placeholder="请选择机房" style="width: 500px">
                  <el-option v-for="item in roomTreeDatas" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <div v-else>
                <el-input v-model="childDialogForm.selectDeviceName" placeholder="请点击搜索按钮选择巡视设备" readonly style="width: 500px">
                  <el-button slot="append" icon="el-icon-search" @click="chooseDevices">选择设备</el-button>
                </el-input>
              </div>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配置项">
            <el-select v-model="childDialogForm.roomOrDeviceConfig" filterable style="width: 440px;" placeholder="请选择巡视配置项">
              <el-option v-for="item in (childDialogForm.type === '1' ? inspectionRoomDatas : inspectionDeviceDatas)" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-button type="primary" @click="addNewAuth">新增</el-button>
          </el-form-item>
        </el-col>

        <el-table ref="authTable" :key="Math.random()" v-if="childDialogForm.type === '1'" :data="childDialogForm.planDetailList" max-height="400" style="margin-left: 130px;width: 1150px" stripe :row-class-name="tableRowClassName">
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="objectName" align="center" :show-overflow-tooltip="true" label="所属机房" width="160px" />
          <el-table-column prop="configName" align="center" :show-overflow-tooltip="true" label="关联配置项" width="160px" />
          <el-table-column label="配置项" align="center">
            <el-table-column prop="configDetailName" align="center" :show-overflow-tooltip="true" label="巡视项" width="160px" />
            <el-table-column prop="configDetailDescription" align="center" :show-overflow-tooltip="true" label="描述" />
          </el-table-column>
          <el-table-column label="操作" align="center" width="80px">
            <template slot-scope="scope">
              <el-button slot="reference" type="text" size="mini" @click="removeInspectionDetails(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table ref="authTable" v-if="childDialogForm.type === '2'" :data="childDialogForm.planDetailList" size="small" max-height="400" style="margin-left: 130px;width: 1150px" stripe :row-class-name="tableRowClassName">
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="objectName" align="center" width="160px" :show-overflow-tooltip="true" label="设备名称">
            <template slot-scope="scope">
              {{ ('[' + changeDeviceType(scope.row.extAttr1) + '] ' + scope.row.objectName) }}
            </template>
          </el-table-column>
          <el-table-column prop="extAttr2" align="center" :show-overflow-tooltip="true" label="IP" />
          <el-table-column prop="extAttr3" align="center" :show-overflow-tooltip="true" label="端口">
            <template slot-scope="scope">
              <el-input-number class="item" v-model="scope.row.extAttr3" placeholder="请输入" @input="deviceChangePortFunc(scope.row.extAttr3, scope.row.extAttr2)" :min="0" :max="65535" :precision="0" :step="1" />
            </template>
          </el-table-column>
          <el-table-column prop="extAttr4" align="center" :show-overflow-tooltip="true" label="资产类型">
            <template slot-scope="scope">
              <el-select v-model="scope.row.extAttr4" placeholder="请选择" @change="deviceChangeSysTypeFunc(scope.row.extAttr4, scope.row.extAttr2)">
                <el-option v-for="dict in getDeviceTypeListFunc(scope.row.extAttr1)" :key="dict.dictKey"
                           :label="dict.dictValue" :value="dict.dictKey"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="configName" align="center" :show-overflow-tooltip="true" label="关联配置项"></el-table-column>
          <el-table-column label="配置项" align="center">
            <el-table-column prop="configDetailName" align="center" :show-overflow-tooltip="true" label="巡视项" />
            <el-table-column prop="configDetailDescription" align="center" :show-overflow-tooltip="true" label="描述"  />
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button slot="reference" type="text" size="mini" @click="removeInspectionDetails(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div style="margin: 10px auto;width: 300px;">
        <el-button type="primary" size="small" @click="saveEvent()" :loading="saveLoading">保 存</el-button>
        <el-button size="small" plain @click="returnEvent" :loading="saveLoading">返 回</el-button>
        <el-button type="primary" size="small" @click="submitEvent()" :loading="saveLoading">提 交</el-button>
      </div>
    </el-form>
    <!-- 新增授权人 -->
    <add-worker-dialog v-if="grandsonDialogFlag" :grandson-dialog-flag.sync="grandsonDialogFlag" @close="componentClose" @refreshData="refreshData"/>
    <device-dialog v-if="deviceDialogFlag" :dialog-flag="deviceDialogFlag" title="巡视" :auth-device-type-list="distForAuthDeviceType" @closeDialog="closeDialogFunc" @submitDialog="loadSelectedDeviceFunc"/>
  </basic-container>
</template>

<script>
  import {mapGetters} from 'vuex'
  import { getDetailById, insertInfoInspection, updateInfoInspection } from '../../../../api/xcnanr/inspectionPlan'
  import {getDictList} from '@/api/dict'
  import {getAll} from "@/api/xcnanr/authorizedPerson"
  import {getAllRoom} from "@/api/xcnanr/room"
  import {getAllInspectionConfig, getDataById} from "@/api/xcnanr/visitationConfig"
  import AddWorkerDialog from './AddWorkerDialog'
  import DeviceDialog from '../../authManage/temporaryAuth/deviceDialog'
  import Breadcrumb from '../../components/Breadcrumb'
  import { getByPlatformId } from '@/api/xcnanr/bastionDevice'

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
    components: { getDictList, AddWorkerDialog, DeviceDialog, Breadcrumb },
    data() {
      // const verifyTimes = (rule, value, callback) => {
      //   if(this.time1 !== undefined && this.time1 !== null) {
      //     const authTimeArray = JSON.parse(JSON.stringify(this.time1))
      //     if (authTimeArray.length === 0) {
      //       callback(new Error('巡视时间段不能为空'))
      //     } else {
      //       callback()
      //     }
      //   }
      // }
      return {
        devicesIp:'',
        roomTreeDatas:[],
        deviceDatas:[],
        inspectionDatas:[],
        inspectionRoomDatas:[],
        inspectionDeviceDatas:[],
        inspectionTypeList:[],
        categoryDayList:[{
          key: '一天一次',
          value: '1'
        },{
          key: '一天两次',
          value: '2'
        },{
          key: '一天三次',
          value: '3'
        },{
          key: '一天四次',
          value: '4'
        }],
        deviceTypeList:[{
          key: '主机设备',
          value: '0'
        },{
          key: '网络设备',
          value: '1'
        }],
        categoryWeekendList:[{
          key: '周一',
          value: '1'
        },{
          key: '周二',
          value: '2'
        },{
          key: '周三',
          value: '3'
        },{
          key: '周四',
          value: '4'
        },{
          key: '周五',
          value: '5'
        },{
          key: '周六',
          value: '6'
        },{
          key: '周日',
          value: '7'
        }],
        categoryMonthList:[],
        inspectionCategoryList:[],
        authorizedPersonList:[],
        operatorType:null,
        authTime: [],
        childDialogForm: {
          type: '',
          category: '',
          persons: '',
          period: '1',
          rooms: '',
          devices: [],
          selectDeviceName: '',
          roomOrDeviceConfig: '',
          content: '',
          times: []
        },
        time1: [],
        time2: ['08:30:00', '17:30:00'],
        time3: ['08:30:00', '17:30:00'],
        time4: ['08:30:00', '17:30:00'],
        planDetailList: [],
        rules: {
          companyName: [
            { required: true, message: '公司不能为空', trigger: 'blur' }
          ],
          departmentName: [
            { required: true, message: '部门不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '巡视类型不能为空', trigger: 'blur' }
          ],
          category: [
            { required: true, message: '巡视类别不能为空', trigger: 'blur' }
          ],
          // time1: [
          //   {required: true, validator: verifyTimes, trigger: 'change'}
          // ],
          period: [
            { required: true, message: '周期配置不能为空', trigger: 'blur' }
          ],
          persons: [
            { required: true, message: '预置巡视人不能为空', trigger: 'blur' }
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
      ...mapGetters(['userDetail']),
      getChildTitle () {
        if (this.operatorType === 'Add'){
          return '新增'
        } else if (this.operatorType === 'Edit'){
          return '编辑'
        }
      }
    },
    created() {},
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
      this.createTimeDict()
      // 加载字典信息：需要同步到堡垒机中的一体化设备分类的ID
      getDictList("info_device_send_bastion_type").then(res => {
        this.distForAuthDeviceType = res.data
      })
    },
    methods: {
      changeDeviceType(deviceCategory){
        const device = this.deviceTypeList.find(item=>{
          return item.value === deviceCategory
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
        const sameIpList = this.childDialogForm.planDetailList.filter(d => d.extAttr2 === deviceIp)
        for (let i = 0; i < sameIpList.length; i++) {
          sameIpList[i].extAttr3 = val
        }
      },
      // 选择资产类型时，相同的设备资产一块更改资产类型
      deviceChangeSysTypeFunc(val, deviceIp) {
        const sameIpList = this.childDialogForm.planDetailList.filter(d => d.extAttr2 === deviceIp)
        for (let i = 0; i < sameIpList.length; i++) {
          sameIpList[i].extAttr4 = val
        }
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
      refreshData(){
        this.getAuthorizedPerson()
      },
      changeCategory(){
        this.$nextTick(()=>{
          if (this.$refs.selectPeriod) {
            this.$refs.selectPeriod.selected = []
            this.$refs.selectPeriod.selectedLabel = ''
            this.$refs.selectPeriod.currentPlaceholder = '请选择巡视周期'
            this.childDialogForm.period = this.childDialogForm.category === '1'?'':[]
          }
        })
      },
      handleStringTimeChange(value) {
        if (value && value.length === 2) {
          return value[0] + '-' + value[1]
        }
      },
      /**
       * 周期配置 拼接月的下拉
       */
      createTimeDict(){
        for (let i =1;i<=31;i++){
          const key = i + '日'
          const value = i + ''
          const timeObj = {
            key: key,
            value: value
          }
          this.categoryMonthList.push(timeObj)
        }
      },
      /**
       * 转换周期配置存储
       * @returns {string}
       */
      createPeriodData(){
        if (this.childDialogForm.category === '1'){
          return this.childDialogForm.period
        }
        let zeros = ''
        if (this.childDialogForm.category === '2'){
          zeros = new Array(8).join('0')
        } else if (this.childDialogForm.category === '3') {
          zeros = new Array(32).join('0')
        }
        for (const timeString of this.childDialogForm.period) {
          let i = parseInt(timeString)
          zeros = zeros.slice(0,i-1)+ '1' + zeros.slice(i)
        }
        return zeros
      },
      removeInspectionDetails(index){
        this.childDialogForm.planDetailList.splice(index,1)
      },
      changeInspectionType(){
        this.$set(this.childDialogForm, 'rooms', '')
        this.$set(this.childDialogForm, 'devices', '')
        this.$set(this.childDialogForm, 'selectDeviceName', '')
        this.$set(this.childDialogForm, 'roomOrDeviceConfig', '')
        this.childDialogForm.planDetailList = []
      },
      addNewAuth(){
        if (this.childDialogForm.type === '1'){
          if (!this.childDialogForm.rooms){
            this.$message({
              type: "warning",
              message: "请选择机房!"
            })
            return null
          }
        }else{
          if (!this.childDialogForm.devices){
            this.$message({
              type: "warning",
              message: "请选择设备!"
            })
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
        if (this.childDialogForm.planDetailList){
          let dataList = []
          if (this.childDialogForm.type === '1') {
            dataList = this.childDialogForm.planDetailList.filter(item=>{
              return item.objectId === this.childDialogForm.rooms
            })
          }else {
            for (const device of this.childDialogForm.devices){
              for (const detail of this.childDialogForm.planDetailList) {
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
                })
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
          // 测试机房 循环遍历绑定的设备
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
              this.childDialogForm.planDetailList.push(planDetail)
            }
          } else {
            for (const detail of res.data.detailList){
              // 选择设备遍历
              for (const device of roomOrDevice){
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
                this.childDialogForm.planDetailList.push(planDetail)
              }
            }
          }
        })
        // 机房配置项
      },
      getAllRoom(){
        getAllRoom().then(res=>{
          this.roomTreeDatas = res.data
        })
      },
      getAllInspectionConfig(){
        const inspectionConfig = { enabled: 1 }
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
        if (this.operatorType === 'Add'){
          this.time1 = ['08:30:00', '17:30:00']
          this.childDialogForm = {
            type: '1',
            category: '1',
            period: '',
            content: '',
            companyId: this.userDetail.ownerUnit,
            companyName: this.userDetail.ownerUnitName,
            companyRegionCode: this.userDetail.regionCode,
            departmentId: this.userDetail.deptId,
            departmentName: this.userDetail.deptName,
            planDetailList: []
          }
        } else if (this.operatorType === 'Edit') {
          getDetailById(this.$route.query.id).then(res=>{
            console.log(res.data)
            this.childDialogForm = res.data
            this.childDialogForm.type += ''
            this.childDialogForm.category += ''
            // this.childDialogForm.rooms = ''
            this.$set(this.childDialogForm, 'roomOrDeviceConfig', '')
            this.$set(this.childDialogForm, 'persons', [])
            for (const person of this.childDialogForm.relatedWorkerList){
              this.childDialogForm.persons.push(person.workerId)
            }
            // 时间回显
            if (this.childDialogForm.category === '1' && parseInt(this.childDialogForm.period) > 1){
              const times = this.childDialogForm.times.split(',')
              for (let i =0; i<=times.length-1;i++){
                if (i === 0){
                  const timeArr = times[i].split('-')
                  this.time1 = [timeArr[0],timeArr[1]]
                } else {
                  const timeArr = times[i].split('-')
                  this.childDialogForm['time' + (i + 1)] = [timeArr[0], timeArr[1]]
                }
              }
            }else {
              const timeArr = this.childDialogForm.times.split('-')
              this.time1 = [timeArr[0],timeArr[1]]
            }
            if (this.childDialogForm.period.length > 1){
              this.childDialogForm.period = this.translatePeriod(this.childDialogForm.period)
            }
          })
        }
      },
      // 转换周期
      translatePeriod(data){
        const indexes = []
        const charToFind = '1'
        for (let i = data.indexOf(charToFind); i !== -1; i = data.indexOf(charToFind, i + 1)) {
          indexes.push(i + 1 + '')
        }
        return indexes
      },
      getAuthorizedPerson(){
        getAll({enabled: 1, companyId: this.childDialogForm.companyId}).then(res=>{
          this.authorizedPersonList = res.data
        })
      },
      // 校验巡视时间
      verifyTime() {
        if(this.childDialogForm.period === '2') {
          if (!this.time1 || !this.time2) {
            return false
          }
          this.childDialogForm.times = this.handleStringTimeChange(this.time1) + ',' + this.handleStringTimeChange(this.time2)
        } else if (this.childDialogForm.period === '3') {
          if (!this.time1 || !this.time2 || !this.time3) {
            return false
          }
          this.childDialogForm.times = this.handleStringTimeChange(this.time1) + ',' + this.handleStringTimeChange(this.time2) + ',' + this.handleStringTimeChange(this.time3)
        } else if (this.childDialogForm.period === '4') {
          if (!this.time1 || !this.time2 || !this.time3 || !this.time4) {
            return false
          }
          this.childDialogForm.times = this.handleStringTimeChange(this.time1) + ',' + this.handleStringTimeChange(this.time2) + ',' + this.handleStringTimeChange(this.time3) + ',' + this.handleStringTimeChange(this.time4)
        } else {
          this.childDialogForm.times = this.handleStringTimeChange(this.time1)
        }
        return true
      },
      /**
       * 处理巡视时间
       */
      processTimes() {
        if(this.childDialogForm.category === '1') {
          if (!this.verifyTime()) {
            this.$message({
              type: 'warning',
              message: '请补充缺失时间段'
            })
            return
          }
        } else {
          this.childDialogForm.times = this.handleStringTimeChange(this.time1)
        }
      },
      // 保存
      saveEvent() {
        this.$refs.childDialogForm.validate((valid) => {
          if (valid) {
            // 处理巡视时间
            if (!this.time1) {
              this.$message({ type: 'warning', message: '巡视时间段不可为空！' })
              return
            }
            this.processTimes()
            // 遍历封装人员
            this.createInspectionPerson()
            this.childDialogForm.period = this.createPeriodData()

            // 检查巡视对象是否为空
            if (!this.childDialogForm.planDetailList || this.childDialogForm.planDetailList.length <= 0) {
              this.$message({ type: 'error', message: ('请先添加' + ((this.childDialogForm.type + '' === '1') ? '巡视场所' : '巡视设备'))  });
              return
            }

            if (this.childDialogForm.type === '2') {
              for (const data of this.childDialogForm.planDetailList){
                if (!data.extAttr3 || data.extAttr3 === ''){
                  this.$message({
                    type: 'error',
                    message: data.objectName + '端口号为空'
                  });
                  return
                }
                if (!data.extAttr4 || data.extAttr4 === ''){
                  this.$message({
                    type: 'error',
                    message: data.objectName + '资产类型为空'
                  })
                  return
                }
              }
            }
            this.childDialogForm.isSubmit = 0
            this.saveLoading = true
            if (this.operatorType === 'Add') {
              this.$confirm('该计划保存后不生成巡视工单，如需自动定时生成工单请点击【提交】，是否保存？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                insertInfoInspection(this.childDialogForm).then(res => {
                  this.saveLoading = false
                  if (res.code === 200){
                    this.$message({
                      type: 'success',
                      message: '保存成功！'
                    })
                  } else {
                    this.$message({
                      type: 'error',
                      message: res.msg
                    })
                  }
                  this.childDialogForm.persons = []
                  this.returnEvent()
                }).catch(() => {
                  this.saveLoading = false
                })
              }).catch(() => {
                this.saveLoading = false
              })
            } else {
              this.$confirm('该计划保存后不生成巡视工单，如需自动定时生成工单请点击【提交】，是否保存？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                updateInfoInspection(this.childDialogForm).then(res => {
                  this.saveLoading = false
                  if (res.code === 200){
                    this.$message({
                      type: 'success',
                      message: '编辑成功！'
                    })
                    this.returnEvent()
                  } else {
                    this.$message({
                      type: 'error',
                      message: res.msg
                    })
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
      submitEvent(){
        // 检查巡视对象是否为空
        if (!this.childDialogForm.planDetailList || this.childDialogForm.planDetailList.length <= 0) {
          this.$message({ type: 'error', message: ('请先添加' + ((this.childDialogForm.type + '' === '1') ? '巡视场所' : '巡视设备'))  });
          return
        }

        this.$confirm('该计划提交后将不可编辑，是否提交？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs.childDialogForm.validate((valid) => {
            if (valid) {
              // 处理巡视时间
              if (!this.time1) {
                this.$message({ type: 'warning', message: '巡视时间段不可为空！' })
                return
              }
              this.processTimes()
              // 遍历封装人员
              this.createInspectionPerson()
              this.childDialogForm.period = this.createPeriodData()

              if (this.childDialogForm.type === '2') {
                for (const data of this.childDialogForm.planDetailList){
                  if (!data.extAttr3 || data.extAttr3 === ''){
                    this.$message({
                      type: 'error',
                      message: data.objectName + '端口号为空'
                    });
                    return
                  }
                  if (!data.extAttr4 || data.extAttr4 === ''){
                    this.$message({
                      type: 'error',
                      message: data.objectName + '资产类型为空'
                    });
                    return
                  }
                }
              }
              this.childDialogForm.isSubmit = 1
              this.saveLoading = true
              // this.childDialogForm.times = []
              if (this.operatorType === 'Add') {
                insertInfoInspection(this.childDialogForm).then(res => {
                  this.saveLoading = false
                  if (res.code === 200){
                    this.$message({
                      type: 'success',
                      message: '提交成功！开始定时生成巡视工单'
                    })
                  } else {
                    this.$message({
                      type: 'error',
                      message: res.msg
                    })
                  }
                  this.childDialogForm.persons = []
                  this.returnEvent()
                }).catch(() => {
                  this.saveLoading = false
                })
              } else {
                updateInfoInspection(this.childDialogForm).then(res => {
                  this.saveLoading = false
                  if (res.code === 200){
                    this.$message({
                      type: 'success',
                      message: '提交成功！开始定时生成巡视工单'
                    })
                    this.returnEvent()
                  }else {
                    this.$message({
                      type: 'error',
                      message: res.msg
                    })
                  }
                }).catch(() => {
                  this.saveLoading = false
                })
              }
            }
          })
        })
      },
      // 授权人员封装
      createInspectionPerson(){
        this.childDialogForm.relatedWorkerList = []
        // 遍历封装人员
        if(this.childDialogForm.persons === undefined || this.childDialogForm.persons === null) {
          return
        }
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
      },
      returnEvent(){
        if (this.operatorType === 'Add') {
          this.$router.push('/xcnanr/ideal/inspectionPlan/index')
        }else {
          this.$router.push('/xcnanr/ideal/inspectionPlan/index')
        }
      },
      // 新增操作人
      addWorker() {
        this.grandsonDialogFlag = true
      },
      formatTime(date) {
        if (date) {
          return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
        }
        return ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep(.el-input.is-disabled .el-input__inner){
    color: #606266;
  }
  .el-card {
    border: 1px solid #eee !important;
  }
  ::v-deep(.select-button-ad){
    float: right;
    margin: -36px 20px 0 0 !important;
  }
  ::v-deep(.el-textarea .el-input__count){
    background: #e0f3ff10 !important;
  }
  ::v-deep(.el-input .el-input__count .el-input__count-inner){
    background: #e0f3ff10 !important;
  }
</style>
