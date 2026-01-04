<template>
  <basic-container v-loading='mainLoading' element-loading-text="设备正在入库，请稍后！">
    <!-- <div class="xt-layout-content"> -->
    <div class="page_form">
    </div>
    <div class="page_body">
      <el-scrollbar style="height:100%">
        <!-- 处理进度 -->
        <div v-if="isView">
          <div class="title_con">
            <div class="title_line">处理进度</div>
          </div>
          <el-steps class="xt-steps" :active="active" align-center finish-status="success" v-loading="stepsLoading">

            <el-step :title="logItem.title" v-for="logItem in logList"
                     :key="logItem.id">

              <template #description>
                <p>{{ logItem.optName }}</p>
                <p>{{ logItem.createTime }}</p>
              </template>

            </el-step>

            <!-- 工单状态为暂存时展示 -->
            <el-step title="入库完成" v-if="logList.length>0 && searchForm.isTemp == 1">
              <div slot="description">
                <p>待处理</p>
              </div>
            </el-step>
          </el-steps>
        </div>
        <!-- 入库信息 -->
        <div>
          <div class="title_con">
            <div class="title_line">入库信息</div>
          </div>
          <el-form ref="queryForm" :rules="rules" :disabled="isView" :model="searchForm" label-width="115px"
                   class="xt_form">
            <el-row>
              <el-col :span="6">
                <el-form-item label="入库单号" prop="serialNumber">
                  <el-input
                    placeholder="系统自动生成"
                    clearable

                    v-model="searchForm.serialNumber"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="设备来源" prop="deviceSource">
                  <el-select v-model="searchForm.deviceSource" @change="deviceChange" clearable placeholder="请选择设备来源">
                    <el-option
                      v-for="item in deviceSourceList"
                      :value="item.dictKey"
                      :key="item.dictKey"
                      :label="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="设备分类" prop="deviceCategory">
                  <el-select v-model="searchForm.deviceCategory" @change="deviceCategoryChange"
                             :disabled="!searchForm.deviceSource" clearable placeholder="请选择所属分类">
                    <el-option
                      v-for="item in deviceCategoryList"
                      :value="item.dictKey"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :disabled="item.disabled"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="设备类型" prop="deviceType">
                  <el-select v-model="searchForm.deviceType" clearable placeholder="请选择所属类型"
                             :disabled="!searchForm.deviceCategory">
                    <el-option
                      v-for="item in deviceTypeList"
                      :value="item.dictKey"
                      :key="item.dictKey"
                      :label="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6" v-show="searchForm.deviceSource === '1102861334544385'">
                <el-form-item label="WBS元素" prop="wbsElement">
                  <wbsSelect type="wbsElement" placeholder="请选择WBS元素" v-model="searchForm.wbsElement"
                             @change="wbsChange"></wbsSelect>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-show="searchForm.deviceSource === '1102861334544385'">
                <el-form-item label="WBS项目" prop="wbsProject">
                  <wbsSelect type="wbsProject" placeholder="请选择WBS项目" v-model="searchForm.wbsProject"
                             @change="wbsChange" disabled></wbsSelect>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="所在仓库" prop="warehouse">
                  <el-select v-model="searchForm.warehouse" clearable placeholder="请选择所在仓库">
                    <el-option
                      v-for="dict in warehouseList"
                      :key="dict.uuid"
                      :label="dict.warehouseName"
                      :value="dict.uuid"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>


              <el-col :span="6">
                <el-form-item label="入库数量" prop="deviceNum">
                  <el-input
                    placeholder="请输入入库数量"
                    clearable
                    disabled
                    v-model="searchForm.deviceNum"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6" v-if="searchForm.deviceSource == '1102861753974784'">
                <el-form-item label="功能位置" prop="funLocation">
                  <el-select v-model="searchForm.funLocation"  clearable placeholder="请选择功能位置">
                    <el-option
                      v-for="item in funLocationList"
                      :value="item.dictKey"
                      :key="item.dictKey"
                      :label="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item label="运行单位" prop="oprtDept">
                  <el-select v-model="searchForm.oprtDept"  clearable placeholder="请选择运行单位">
                    <el-option
                      v-for="item in oprtDeptList"
                      :value="item.dictKey"
                      :key="item.dictKey"
                      :label="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="所属部门" prop="deptName">
                  <el-input
                    placeholder="请输入所属部门"
                    clearable
                    disabled
                    v-model="searchForm.deptName"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="入库人" prop="receiver">
                  <el-input
                    placeholder="请输入入库人"
                    clearable
                    disabled
                    v-model="searchForm.receiver"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="入库时间" prop="storageTime">
                  <el-date-picker
                    v-model="searchForm.storageTime"
                    disabled
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="系统自动获取"></el-date-picker>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="使用保管人" prop="useKeepPerson">
                  <el-input
                    placeholder="请输入使用保管人"
                    clearable

                    v-model="searchForm.useKeepPerson"
                  >
                  </el-input>
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item label="电压等级" prop="voltageLevel">
                  <el-select v-model="searchForm.voltageLevel"  clearable placeholder="请选择电压等级">
                    <el-option
                      v-for="item in voltageLevelList"
                      :value="item.dictKey"
                      :key="item.dictKey"
                      :label="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item prop="isToI6000">
                  <div slot="label" class="formLabel">
                    是否同步<br>i6000
                  </div>
                  <el-radio-group v-model="searchForm.isToI6000" disabled>
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="采购日期" prop="procureDate">
                  <el-date-picker
                    :picker-options="procureDatePickerOptions"
                    v-model="searchForm.procureDate"
                    type="date"
                    clearable
                    value-format="yyyy-MM-dd"
                    placeholder="请选择采购日期"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 入库列表 -->
        <div>
          <div class="title_con">
            <div class="title_line">入库列表</div>
            <el-row style="padding-left: 20px;text-align: right;" v-if="!isView">
              <el-button style="margin-left: 5px;" type="primary"
                         @click="handleImport">EXCEL导入
              </el-button>
              <el-button type="primary" plain
                         @click="handleDownload">模板下载
              </el-button>
            </el-row>
          </div>
          <deviceListTable :idd="$route.query.id" :infoList="infoList" :deviceCategory="searchForm.deviceCategory"
                           :isTemp="searchForm.isTemp" :deviceSource="searchForm.deviceSource"></deviceListTable>
        </div>
        <!-- 现场收货图片 -->
        <div style="margin-top: 15px">
          <div class="title_con">
            <div class="title_line">现场收货图片</div>
          </div>
          <uploadImg
            ref="uploadImg"
            :disabled="isView"
            :serialNumber="searchForm.serialNumber"
            :attachId="searchForm.attachId"
            @setFileName="getAttachId"
            @filesChange="filesChange"
            v-if="isShowUpload"
          ></uploadImg>
          <span v-else class="s_empty">暂无现场收货图片</span>
        </div>
        <!-- 操作记录 -->
        <div v-if="isView" style="margin-top: 15px">
          <div class="title_con">
            <div class="title_line">操作记录</div>
          </div>
          <logTable :serialNumber="searchForm.serialNumber"></logTable>
        </div>
        <!-- 底部按钮 -->
        <div class="btn-line">
          <el-button type="primary" v-show="!isView"
                     @click="handleInBound">设备入库
          </el-button>
          <el-button type="primary" plain style="margin-left: 5px;" v-show="!isView"
                     @click="handleStaging">暂存
          </el-button>
          <el-button type="primary" plain style="margin-left: 5px;"
                     @click="handleReturn">返回
          </el-button>
        </div>

      </el-scrollbar>
    </div>


    <!-- 导入文件弹框 -->
    <uploadModel v-if="openUpload" :isShow.sync="openUpload" :deviceCategory="searchForm.deviceCategory"
                 :deviceType="searchForm.deviceType" :deviceSource="searchForm.deviceSource"
                 @setVal='setValDeviceList'></uploadModel>
    <deviceList v-if="showDeviceListForm" :deviceCategory="searchForm.deviceCategory"
                :deviceType="searchForm.deviceType" :tableList="importDeviceObj" :isShow="showDeviceListForm"
                :arrtId="arrtId" @setVal="getInfoList" @resetUpload="resetUpload" @close="showDeviceListForm = false"
    ></deviceList>
  </basic-container>
</template>

<script>
  import deviceList from './components/devInBound/deviceList'
  import deviceListTable from './components/devInBound/deviceListTable'
  import logTable from './components/devInBound/logTable'
  import uploadModel from './components/devInBound/uploadModel'
  import uploadImg from './components/devInBound/uploadImg'
  import {storageDetail, storageSave, storageTempSave, optList, findByStorageId} from "@/api/system/devInBound";
  import {getDictList, getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
  import {mapState, mapGetters} from "vuex";
  import {dateFormat} from "@/util/date";
  import wbsSelect from "@/components/wbsSelect";
  import xtTreeSelect from "@/components/xtTreeSelect/index"
  import {getDeptList} from "@/api/system/dept"
  import {getWareDictList} from "@/api/device/warehouse";

  export default {
    components: {
      deviceList,
      deviceListTable,
      logTable,
      uploadModel,
      uploadImg,
      wbsSelect,
      xtTreeSelect
    },
    data() {
      return {
        mainLoading: false,

        deviceSourceList: [],
        deviceCategoryList: [],
        deviceTypeList: [],
        warehouseList: [],
        funLocationList: [],
        oprtDeptList: [],
        voltageLevelList: [],
        ownerUnitList: [],

        entityKeepDeptList: [],
        useKeepDeptList: [],
        maintenanceFactoryList: [],
        factoryAreaList: [],

        showSteps: false,
        showLog: false,
        ShowBtns: true,
        active: 1,
        searchForm: {
          deviceSource: undefined,
          isToI6000: 1,
          storageTime: undefined,
          deviceNum: undefined,
          deptName: undefined,
          receiver: undefined,
          useKeepPerson: undefined,
          deviceCategory: undefined,
          deviceType: undefined,

          voltageLevel: undefined,
          funLocation: undefined,
          warehouse: undefined,
          wbsElement: undefined,
          wbsProject: undefined,
          // 实物保管部门
          // entityKeepDept: undefined,
          // entityKeepDeptName: undefined,
          // useKeepDept: undefined,
          // useKeepDeptName: undefined,

        },
        //校验
        rules: {
          // serialNumber:[{required:true,message:'请填写入库单号',trigger:'blur'}],
          deviceSource: [{required: true, message: '请选择设备来源', trigger: 'change'}],
          wbsElement: [{required: true, message: '请选择WBS元素', trigger: 'change'}],
          wbsProject: [{required: true, message: '请选择WBS项目', trigger: 'change'}],
          deviceCategory: [{required: true, message: '请选择设备分类', trigger: 'change'}],
          deviceType: [{required: true, message: '请选择设备类型', trigger: 'change'}],
          warehouse: [{required: true, message: '请选择所在仓库', trigger: 'change'}],
          // deviceNum:[{required:true,message:'请填写入库数量',trigger:'blur'}],
          // funLocation:[{required:true,message:'请选择功能位置',trigger:'change'}],
          // oprtDept:[{required:true,message:'请选择运行单位',trigger:'change'}],
          receiver: [{required: true, message: '请填写入库人', trigger: 'blur'}],
          // storageTime:[{required:true,message:'请选择入库时间',trigger:'change'}],
          useKeepPerson: [{required: true, message: '请填写使用保管人', trigger: 'blur'}],
          voltageLevel: [{required: true, message: '请选择电压等级', trigger: 'change'}],
          // isToI6000:[{required:true,message:'请选择isToI6000',trigger:'change'}],
          procureDate: [{required: true, message: '请选择采购日期', trigger: 'change'}],
          entityKeepDeptName: [{required: true, message: '请选择实物保管部门', trigger: 'change'}],
          useKeepDeptName: [{required: true, message: '请选择使用保管部门', trigger: 'change'}],
          // ownerUnit:[{required:true,message:'请选择产权单位',trigger:'change'}],
          // propertyDept:[{required:true,message:'请选择产权部门',trigger:'change'}],
          // entityKeepDept:[{required:true,message:'请选择实物保管部门',trigger:'change'}],
          // useKeepDept:[{required:true,message:'请选择使用保管部门',trigger:'change'}],
          // maintenanceFactory:[{required:true,message:'请选择维护工厂',trigger:'change'}],
          // factoryArea:[{required:true,message:'请选择工厂区域',trigger:'change'}],

        },

        isEdit: false,
        isView: false,
        isShowUpload: true,
        idd: null,
        // 弹窗
        showForm: false,
        showType: '',
        arrtId: '',

        showDeviceListForm: false,
        importDeviceObj: {},

        infoList: [],

        openUpload: false,

        logList: [],
        stepsLoading: false,


        propertyDeptList: [],
        unitList: [],

        procureDatePickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.now()
          }
        },
      }
    },
    computed: {
      ...mapState({
        userDetail: state => state.user.userDetail
      }),
      ...mapGetters(["userInfo", "userDetail"]),
      // deviceTypeListCom(){
      //   // return this.deviceTypeList.filter(el => el.dictKey.includes(this.searchForm.deviceCategory))
      //   return this.deviceTypeList
      // },

    },
    async mounted() {
      this.setPageContentHeight()
      // this.setTableHeight()


      // 加载字典
      await this.getDictCmdbList('1102860579569664') // 设备来源

      // await this.getDictCmdbList('1084068218601472') // 电压等级
      // //加载字典--功能位置
      // await this.getDictList("funLocation")
      // //加载字典--工厂区域
      // await this.getDictList("factoryArea")
      // //加载字典--维护工厂
      // await this.getDictList("maintenanceFactory")
      // 加载字典--仓库
      this.getWareList()
      await this.getDeptList()
      this.setPropertyDeptList(this.unitList)
      //获取参数 判断是否是新增还是修改
      const params = this.$route.query
      if (params.id) { // 查看/修改
        this.idd = params.id;
        this.getDetail(params.id);
        this.isEdit = true

        if (params.isView) {
          this.isView = true
        }
      } else { // 新增
        // 部门赋值
        // this.searchForm.entityKeepDept = this.$store.state.user.userDetail.entityKeepDept
        // this.searchForm.entityKeepDeptName = this.$store.state.user.userDetail.entityKeepDeptName
        // this.searchForm.useKeepDept = this.$store.state.user.userDetail.useKeepDept
        // this.searchForm.useKeepDeptName = this.$store.state.user.userDetail.entityKeepDeptName

        // this.searchForm.funLocation =  this.funLocationList[0].dictKey // 功能位置
        this.searchForm.deviceSource = '1102861334544385'
        this.searchForm.storageTime = dateFormat(new Date())
        this.searchForm.deviceNum = this.infoList.length
        this.searchForm.deptName = this.userDetail.deptName
        this.searchForm.receiver = this.userInfo.userName
        this.searchForm.useKeepPerson = this.userInfo.userName
        this.searchForm.voltageLevel = '60' // 电压等级 '07'
        this.searchForm.deviceCategory = '1097756774301696' // 设备分类
        this.searchForm.deviceCategoryName = '终端设备' // 设备分类

        this.getDictCmdbListPid('1097745969774592', this.searchForm.deviceCategory) // 设备类型列表
        this.getDictCmdbList('1097745625841664') // 设备分类
      }


    },
    methods: {
      wbsIsShow(val) {
        if (val === '1102861334544385') { // 统一纳管
          this.searchForm.isToI6000 = 1

          // this.searchForm.deviceSource === '0'
          this.rules.wbsElement = [{required: true, message: '请选择WBS元素', trigger: 'change'}]
          this.rules.wbsProject = [{required: true, message: '请选择WBS项目', trigger: 'change'}]

        } else if (val === '1102861753974784') { // 非统一纳管
          this.searchForm.isToI6000 = 0

          this.rules.wbsElement = [{required: false, message: '请选择WBS元素', trigger: 'change'}]
          this.rules.wbsProject = [{required: false, message: '请选择WBS项目', trigger: 'change'}]
        }
      },
      deviceChange(val) {
        this.wbsIsShow(val)
        this.searchForm.deviceCategory = undefined
        this.searchForm.deviceType = undefined
        this.getDictCmdbList('1097745625841664') // 设备分类
      },
      setPropertyDeptList(list) {
        list.forEach(item => {
          if (item.fullName == this.searchForm.ownerUnitName) {
            this.propertyDeptList = item.children
          } else {
            if (item.children) {
              this.setPropertyDeptList(item.children)
            }

          }
        })
      },
      getEntityKeepDept(val) {
        this.searchForm.entityKeepDeptName = val.fullName
        this.searchForm.entityKeepDept = val.id
      },
      getuseKeepDept(val) {
        this.searchForm.useKeepDeptName = val.fullName
        this.searchForm.useKeepDept = val.id
      },
      async getDeptList() {
        await getDeptList().then(res => {
          this.unitList = res.data
        })
      },
      getOwnerUnit(val) {
        this.searchForm.ownerUnitName = val.fullName
        this.searchForm.ownerUnit = val.id
        this.propertyDeptList = val.children
        this.searchForm.propertyDept = ''
      },
      changePropertyDept(val) {
        this.propertyDeptList.forEach(item => {
          if (item.id == val) this.searchForm.propertyDeptName = item.fullName
        })
      },


      // 所有详情赋值
      getDetail(id) {
        storageDetail({id: id}).then(res => {
          this.searchForm = res.data
          this.getDictCmdbList('1097745625841664') // 设备分类
          this.getDictCmdbListPid('1097745969774592', this.searchForm.deviceCategory) // 设备类型列表
          // 渲染wbs元素
          this.wbsIsShow(this.searchForm.deviceSource)
          // 渲染处理进度
          this.getLogList()
          // 获取设备列表
          this.getList(id)
          // 赋值现场收货图片
          setTimeout(() => {
            this.$refs.uploadImg.getFiles()
          }, 500);
        })

      },
      // 设备列表赋值
      getList(id) {
        findByStorageId({storageId: id}).then(res => {
          let data = res.data
          data.forEach(el => {
            if (el.deviceHardwareInfo) {
              let deviceHardwareInfo = JSON.parse(el.deviceHardwareInfo)

              for (const key in deviceHardwareInfo) {
                // ielement = object[key];
                el[key] = deviceHardwareInfo[key]
              }


              // el.sn = rrr.sn
              // el.factoryDate = rrr.factoryDate
              // el.maintenanceCountry = rrr.maintenanceCountry
              // el.supplierName = rrr.supplierName
              // el.supplierTel = rrr.supplierTel
              // el.assetOriginal = rrr.assetOriginal
              // el.netWorth = rrr.netWorth
              // el.brand = rrr.brand
              // el.series = rrr.series
              // el.deviceModel = rrr.deviceModel
              // el.cpuModel = rrr.cpuModel
              // el.memSize = rrr.memSize
              // el.powerModel = rrr.powerModel
              // el.OSVersion = rrr.OSVersion
              // el.hardDiskCapability = rrr.hardDiskCapability
            }
          })
          this.infoList = data
          this.searchForm.deviceNum = this.infoList.length
        })
      },
      // wbs赋值
      wbsChange(val, type) {
        if (type == 'wbsElement') {
          this.searchForm.wbsProject = val.wbsName
        } else if (type == 'wbsProject') {
          this.searchForm.wbsElement = val.wbsCode
        }
      },
      // 渲染处理进度
      getLogList() {
        this.stepsLoading = true
        optList({logId: this.searchForm.serialNumber}).then(res => {
          this.logList = res.data.records
          this.active = res.data.total
          // console.log(this.active);
          this.stepsLoading = false
        })
      },
      getWareList() {
        //加载仓库列表
        getWareDictList({ownerUnitId: this.userDetail.ownerUnit || ''}).then(res => {
          this.warehouseList = res.data;
        });
      },
      getDictList(code) {
        //加载字典
        return getDictList(code).then(res => {
          if (code === 'workOrderState') {
            this.workOrderStateList = res.data;
          } else if (code === 'oprtDept') {
            this.oprtDeptList = res.data;
          } else if (code === 'isToI6000') {
            this.isToI6000List = res.data;
          } else if (code === 'factoryArea') {
            this.factoryAreaList = res.data;
          } else if (code === 'maintenanceFactory') {
            this.maintenanceFactoryList = res.data;
          } else if (code === 'funLocation') {
            this.funLocationList = res.data;
          }
        });
      },
      getDictCmdbList(ciId) {
        //加载字典
        return getDictCmdbList({ciId: ciId}).then(res => {
          if (ciId === '1102860579569664') { // 设备来源
            this.deviceSourceList = res.data;
          } else if (ciId === '1097745625841664') { // 设备分类
            let data = res.data
            if (this.searchForm.deviceSource == '1102861753974784') {
              data.forEach(el => {
                if (el.dictValue == '终端设备') el.disabled = true
              })
            }
            this.deviceCategoryList = data;

          } else if (ciId === '1097745969774592') { // 设备类型
            this.deviceTypeList = res.data;
          } else if (ciId === '1084068218601472') { // 电压等级
            this.voltageLevelList = res.data;
          }
        });
      },
      getDictCmdbListPid(ciId, pid) {

        getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
          if (ciId === '1097745969774592') { // 设备类型
            let data = res.data
            if (this.searchForm.deviceSource == '1102861334544385') { // 统一纳管
              data = data.filter(el => el.dictKeyErp)
            }
            this.deviceTypeList = data;
          }
          // else if(ciId==='1097745625841664'){ // 设备分类
          //   this.deviceCategoryList  = res.data;
          // }
        });
      },


      filesChange(args) {
        if (!this.$route.query.isView) return
        if (args.files) {
          if (args.files.length == 0) {
            //隐藏上传图片控件
            this.isShowUpload = false;
          } else {
            this.isShowUpload = true;
          }
        } else {
          this.isShowUpload = true;
        }
      },

      getAttachId(attachId) {
        this.searchForm.attachId = attachId
      },
      getInfoList(list) {
        this.showDeviceListForm = false
        this.infoList = list
        this.searchForm.deviceNum = this.infoList.length
      },
      // 设备入库
      handleInBound() {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            if (this.infoList.length === 0) {
              return this.$message.warning('入库列表不能为空！')
            }
            let params = JSON.parse(JSON.stringify(this.searchForm))
            params.isTemp = 0
            params.devices = JSON.parse(JSON.stringify(this.infoList))

            this.mainLoading = true
            storageSave(params).then(res => {
              this.mainLoading = false
              // 新增图片列表
              this.$refs.uploadImg.myAttachSave(res.data.serialNumber)
              // 返回
              this.handleReturn()
              this.$message.success(res.msg)
            }).catch(error => {
              this.$message.success(error)
              this.mainLoading = false
            })

          }
        })
      },
      // 暂存
      handleStaging() {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            this.searchForm.isTemp = 1

            let params = JSON.parse(JSON.stringify(this.searchForm))
            params.devices = JSON.parse(JSON.stringify(this.infoList))
            // if(params.devices.length > 0){
            //   params.devices.forEach(el=>{
            //     let data = {
            //       sn: el.sn,
            //       factoryDate: el.factoryDate,
            //       maintenanceCountry: el.maintenanceCountry,
            //       supplierName: el.supplierName,
            //       supplierTel: el.supplierTel,
            //       assetOriginal: el.assetOriginal,
            //       netWorth: el.netWorth,
            //       brand: el.brand,
            //       series: el.series,
            //       deviceModel: el.deviceModel,
            //       cpuModel: el.cpuModel,
            //       memSize: el.memSize,
            //       powerModel: el.powerModel,
            //       OSVersion: el.OSVersion,
            //       hardDiskCapability: el.hardDiskCapability
            //     }
            //     el.deviceHardwareInfo = JSON.stringify(data)
            //   })
            // }
            this.mainLoading = true
            storageTempSave(params).then(res => {
              this.mainLoading = false
              // 新增图片列表
              this.$refs.uploadImg.myAttachSave(res.data.serialNumber)
              // 新增设备列表
              this.handleReturn()
              this.$message.success(res.msg)
            })
          }
        })
      },
      handleReturn() {
        this.$closePage('/device/devInBound');
      },
      resetUpload() {

        console.log("searchForm.deviceSource:", this.searchForm.deviceSource);

        this.showDeviceListForm = false
        this.openUpload = true
      },
      handleImport() {
        if (!this.searchForm.deviceSource) {
          this.$message.warning('请选择设备来源！');
          return
        }
        if (!this.searchForm.deviceCategory) {
          this.$message.warning('请选择设备分类！')
          return
        }
        if (!this.searchForm.deviceType) {
          this.$message.warning('请选择设备类型！')
          return
        }
        this.openUpload = true
      },
      setValDeviceList(obj) {
        this.openUpload = false
        this.importDeviceObj = obj
        this.showDeviceListForm = true
      },
      handleDownload() {
        // console.log(19, dateFormat(new Date()))
        if (!this.searchForm.deviceCategory) {
          this.$message.warning('请选择设备分类！')
          return
        }
        if (!this.searchForm.deviceType) {
          this.$message.warning('请选择设备类型！')
          return
        }

        let fileName = this.searchForm.deviceCategoryName + '模板下载' + dateFormat(new Date()).split(' ')[0] + '.xlsx'

        let params = {
          deviceCategory: this.searchForm.deviceCategory,
          deviceType: this.searchForm.deviceType
        }
        // console.log(9111, params)
        // "/api/idevelop-device/device/storage/template/download?deviceCategory=" + this.searchForm.deviceCategory
        this.download(
          "/api/idevelop-device/device/storage/template/download",
          params,
          fileName,
          "导入模板生成中..."
        );
        // "模板下载.xlsx"
      },
      // 设置表格高度
      setTableHeight() {
        let bodyBox = document.getElementsByClassName('page_body')
        this.tableHeight = (bodyBox[0].offsetHeight - 35) + 'px'
      },
      deviceCategoryChange(val) {
        let current = this.deviceCategoryList.filter(el => el.dictKey == val)[0]
        this.searchForm.deviceCategoryName = current.dictValue;

        this.searchForm.deviceType = undefined
        this.infoList = []
        this.getDictCmdbListPid('1097745969774592', val) // 设备类型
      }
    }
  }
</script>

<style lang="scss" scoped>
  .complish_bg {
    width: 28px;
    height: 28px;
  }

  ::v-deep .el-step__head.is-process {
    .el-step__line {
      border: 0.5px dashed #C0C4CC;
      background-color: transparent;
      height: 0.1px;
    }

    .is-text {
      background: #ffffff;
      border-color: #409EFF;
      color: #409EFF;
    }
  }

  ::v-deep .el-step__head.is-success {
    .is-text {
      background: #409EFF;
      border-color: #409EFF;
      color: white;
    }

    .el-step__line {
      border: 0.5px dashed #409EFF;
      background-color: transparent;
      height: 0.1px;
    }

    .el-step__line-inner {
      border-width: 0px !important;
      width: 0px !important;
    }
  }

  /deep/ .el-step.is-horizontal .el-step__line {
    border: 0.5px dashed #409EFF;
    background-color: transparent;
    height: 0.1px;
  }

  /deep/ .el-step__title.is-process {
    color: #409EFF;
  }

  .title_con {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .formLabel {
    line-height: 20px;
  }

  ::v-deep .page_form {
    .el-form-item {
      margin-bottom: 0px;
    }

    .el-col {
      margin-bottom: 0;
    }

    .el-date-editor {
      width: 100%;
    }
  }

  .page_body {
    position: relative;
    // padding-bottom: 200px;
  }

  .btn-line {
    text-align: center;
    padding-bottom: 25px;
    margin-top: 20px;
    // position: absolute;
    // left: 50%;
    // bottom: 30px;
    // transform: translateX(-50%);
    & > button {
      margin-right: 10px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .s_empty {
    padding: 12px;
    font-size: 14px;
    color: #a1a1a1;
  }
</style>
