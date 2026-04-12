<template>
  <div>
    <!-- 检修工单变更 -->
    <div class="xt_card_xc xt_form xc_base">
      <div style="margin-left: -160px;margin-top: -30px;margin-bottom: 20px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/xcnanr/ideal/repairDelay/index' }">检修任务</el-breadcrumb-item>
          <el-breadcrumb-item>变更</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="topForm" :model="childDialogForm" inline size="small" label-suffix=":"
               label-width="150px"
               v-loading="pageLoading">
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="工单编号" style="font-weight: bolder">
                <span style="font-weight: bolder">{{childDialogForm.code}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="关联检修计划" prop="planId">
                <el-select v-model="childDialogForm.planId" disabled filterable clearable placeholder="请选择检修计划"
                           style="width: 1040px">
                  <el-option v-for="item in repairPlan" :key="item.id" :label="item.code+'/'+item.content"
                             :value="item.code"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="公司" prop="companyId">
                <xt-tree-lzay-select :formValue="childDialogForm.companyName" :selectType="'CORP'"
                                     @getTreeItem="(v)=>getItem(v, 'CORP')" style="width: 390px" disabled/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="部门" prop="deptId">
                <xt-tree-lzay-select :formValue="childDialogForm.deptName" :unit-id="childDialogForm.companyId"
                                     disabled :selectType="'DEPT'"
                                     @getTreeItem="(v)=>getItem(v,'DEPT')" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="检修负责人" prop="header">
                <el-input v-model="childDialogForm.header" disabled clearable placeholder="请输入检修负责人"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="负责人电话" prop="headerTel">
                <el-input v-model="childDialogForm.headerTel" disabled clearable placeholder="请输入检修负责人电话"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="检修操作人" prop="operatorId">
                <div class="select-with-button">
                  <el-input disabled v-model="childDialogForm.operator" clearable placeholder="请输入检修操作人"
                            style="width: 390px"/>
                </div>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="作业总人数" prop="totalUserCount">
                <el-input v-model="childDialogForm.totalUserCount" disabled clearable placeholder="请输入作业总人数"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="24" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="检修时间段" prop="dataTime">
                <el-date-picker v-model="childDialogForm.dataTime"
                                class="filter-item"
                                disabled
                                :type="'datetimerange'"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['08:30:00', '17:30:00']"
                                align="right"
                                clearable
                                style="width: 1040px;"
                />
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='1'">
            <div class="grid-content bg-purple">
              <el-form-item label="检修时间段" prop="dataTime">
                <el-date-picker v-model="childDialogForm.dataTime"
                                class="filter-item"
                                disabled
                                :type="'datetimerange'"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['08:30:00', '17:30:00']"
                                align="right"
                                clearable
                                style="width: 390px;"
                />
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='1'">
            <div class="grid-content bg-purple">
              <el-form-item label="检修类别" prop="mode">
                <el-select v-model="childDialogForm.mode" disabled clearable placeholder="请选择检修类别"
                           style="width: 390px">
                  <el-option v-for="dict in modeOptions" :key="dict.type" :label="dict.label"
                             :value="dict.type"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <!-- 工作类别 -->
            <el-form-item label="工作类别" prop="jobCategory">
              <el-select v-model="childDialogForm.jobCategory" disabled clearable style="width: 390px">
                <el-option v-for="dict in jobCategoryOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <!-- 作业类型 -->
            <el-form-item label="作业类型" prop="jobType">
              <el-select v-model="childDialogForm.jobType" disabled clearable style="width: 390px">
                <el-option v-for="dict in jobTypeAllOptions[childDialogForm.jobCategory]" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="检修内容" prop="content">
                <el-input v-model="childDialogForm.content" disabled autosize clearable placeholder="请输入检修内容" type="textarea" :rows="2" :maxlength="30" show-word-limit style="width: 1040px;"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="24" v-if="childDialogForm.type==='1'" style="height: 100%">
            <div class="grid-content bg-purple">
              <el-form-item label="检修内容" prop="content">
                <el-input v-if="!childDialogForm.contentSucc" v-model="childDialogForm.content" disabled clearable placeholder="请输入检修内容" type="textarea" :rows="2" :maxlength="30" show-word-limit style="width: 1040px;"/>
                <el-input v-else v-model="childDialogForm.contentSucc" disabled clearable placeholder="请输入检修内容" type="textarea" :rows="2" :maxlength="30" show-word-limit style="width: 1040px;"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="风险作业等级" prop="riskLevel">
                <el-select v-model="childDialogForm.riskLevel" disabled filterable clearable
                           placeholder="请选择作业风险等级"
                           style="width: 390px">
                  <el-option v-for="item in workRiskLevel" :key="item.dictKey" :label="item.dictValue"
                             :value="item.dictKey"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="作业地点" prop="address">
                <PcdSelect v-model="childDialogForm.address" :inputNumShow="inputNumShow" :inputInterval="inputInterval"
                           :disabled="true" :default-address="address"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="主办单位人数" prop="mainUserCount">
                <el-input v-model="childDialogForm.mainUserCount" disabled clearable placeholder="请输入主办单位人数"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="产业单位人数" prop="attachUserCount">
                <el-input v-model="childDialogForm.attachUserCount" disabled clearable placeholder="请输入产业单位人数"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="外包单位人数" prop="otherUserCount">
                <el-input v-model="childDialogForm.otherUserCount" disabled clearable placeholder="请输入外包单位人数"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="作业组织(建管)单位" prop="orgCompany">
                <el-input v-model="childDialogForm.orgCompany" disabled clearable placeholder="请输入作业组织单位"
                          style="width: 390px"/>
                <!--                <el-checkbox v-model="childDialogForm.content" style="margin-left: 5px">其他</el-checkbox>-->
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="作业实施(施工)单位" prop="constructCompany">
                <el-input v-model="childDialogForm.constructCompany" disabled clearable placeholder="请输入作业实施单位"
                          style="width: 390px"/>
                <!--                <el-checkbox v-model="childDialogForm.content" style="margin-left: 5px">其他</el-checkbox>-->
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="工作类别" prop="workType">
                <el-select v-model="childDialogForm.workType" disabled filterable clearable placeholder="请选择工作类别"
                           style="width: 390px">
                  <el-option v-for="item in workCategory" :key="item.dictKey" :label="item.dictValue"
                             :value="item.dictKey"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="工作方式" prop="workMode">
                <el-select v-model="childDialogForm.workMode" disabled filterable clearable placeholder="请选择工作方式"
                           style="width: 390px">
                  <el-option v-for="item in workWay" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="工作场所名称" prop="position">
                <el-input v-model="childDialogForm.position" disabled clearable placeholder="请输入工作场所名称"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="本次操作系统信息" prop="itSystem">
                <el-input v-model="childDialogForm.itSystem" disabled clearable placeholder="请输入本次操作系统信息"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="涉及方式资源申请" prop="isApplyResource">
                <el-radio v-model="childDialogForm.isApplyResource" disabled :label="1">是</el-radio>
                <el-radio v-model="childDialogForm.isApplyResource" disabled :label="0">否</el-radio>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="24" v-if="childDialogForm.type==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="涉及设备/软件" prop="software">
                <el-input v-model="childDialogForm.software" clearable disabled
                          placeholder="请选择本次操作涉及设备/软件"
                          style="width: 1040px"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="24" style="height: 100%;">
            <div class="grid-content bg-purple">
              <el-form-item label="危险点分析" prop="riskContent">
                <el-input v-model="childDialogForm.riskContent" disabled clearable placeholder="请输入危险点分析"
                          type="textarea"
                          :rows="4" style="width: 1040px"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="24" style="height: 100%;">
            <div class="grid-content bg-purple">
              <el-form-item label="关键措施" prop="keySolution">
                <el-input v-model="childDialogForm.keySolution" disabled clearable placeholder="请输入关键措施"
                          type="textarea"
                          :rows="4" style="width: 1040px"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 检修对象 -->
    <div class="xt_card_xc xt_form xc_base" v-if="childDialogForm.type==='1'">
      <div class="text item" style="margin: 0 0 30px 80px" v-if="childDialogForm.mode==='2'">
        <el-form label-suffix=":">
          <el-form-item label="检修场所" prop="object">
            <el-table ref="roomArray" :data="roomArray" v-loading="tableLoading"
                      style="width: 1040px" max-height="200px">
              <el-table-column label="序号" type="index" width="520" align="center"></el-table-column>
              <el-table-column label="机房名称" prop="objectName" width="520" align="center" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <div class="text item" style="margin: 0 0 0 80px">
        <el-form label-suffix=":">
          <el-form-item label="检修对象" prop="object">
            <!-- 检修对象-现场作业 -->
            <el-table v-if="childDialogForm.mode === '2'" ref="deviceTableInfo" :data="deviceTableInfo" v-loading="tableLoading"
                      style="width: 1040px" max-height="200px">
              <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
              <el-table-column label="设备名称" prop="objectName" width="200" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ '[' + scope.row.ciLabel + '] ' + scope.row.objectName }}
                </template>
              </el-table-column>
              <el-table-column label="描述" prop="description" min-width="300" align="center" show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <!-- 检修对象-远程作业 -->
            <el-table v-else ref="deviceTableInfo" :data="deviceTableInfo" v-loading="tableLoading"
                      style="width: 1040px" max-height="200px">
              <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
              <el-table-column label="设备名称" prop="objectName" width="250" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ '[' + scope.row.ciLabel + '] ' + scope.row.objectName }}
                </template>
              </el-table-column>
              <el-table-column label="IP" prop="ip" width="160" align="center" show-overflow-tooltip/>
              <el-table-column label="设备端口" prop="sort" width="120" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="资产类型" prop="extAttr4" width="160" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{
                  scope.row.extAttr1 === "0"
                  ? conversionDict(scope.row.extAttr4, dictForBastionHostProtocol)
                  : conversionDict(scope.row.extAttr4, dictForBastionNetworkProtocol)
                  }}
                </template>
              </el-table-column>
              <el-table-column label="描述" prop="description" min-width="160" align="center" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>



    </div>

    <div class="xt_card_xc xt_form xc_base ">
      <el-form ref="submitForm" :rules="rules" :model="submitForm" inline size="small" label-suffix=":"
               label-width="110px" v-loading="pageLoading" style="margin-left: 40px;">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purplesy">
              <el-form-item label="审请人" prop="changePersonName">
                <el-input v-model="submitForm.changePersonName" disabled clearable placeholder="请输入审请人"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="申请结束时间" prop="applyFinishTime">
                <el-date-picker
                  v-model="submitForm.applyFinishTime"
                  type="datetime"
                  placeholder="选择申请结束时间"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="23:59:59"
                  style="width: 390px"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="24" style="height: 100%;">
            <div class="grid-content bg-purple">
              <el-form-item label="检修内容" prop="content">
                <el-input v-model="submitForm.content" placeholder="请输入新的检修内容" type="textarea" :rows="2" style="width: 1020px" :maxlength="30" show-word-limit />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!--    按钮-->
      <div style="margin: 20px 124px 0 0;display: flex;justify-content: center;align-items: center;">
        <el-button type="primary" size="small" @click="saveEvent" :loading="saveLoading">提交</el-button>
        <el-button type="primary" plain size="small" @click="returnEvent" :loading="saveLoading">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getDictList} from '@/api/dict'
import XtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getAll} from "@/api/xcnanr/authorizedPerson"
import AddWorkerDialog from "@/views/xcnanr/operationPlan/repairPlan/AddWorkerDialog.vue";
import {getRiskByPage} from "@/api/xcnanr/repair";
import PcdSelect from '@/views/xcnanr/operationOrder/repairOrder/components/pcdSelect.vue'
import {getAllRoom} from "@/api/xcnanr/room"
import {changeApply, getRepairPlanList, repairOrderDetail} from "../../../../api/xcnanr/repairOrder"

export default {
  components: {
    AddWorkerDialog,
    XtTreeLzaySelect,
    PcdSelect
  },
  data() {
    return {
      address: [],
      userInfo: this.$store.state.user.userDetail,
      code: "",
      orderType: '1',
      id: '1',
      mode: '',
      deviceDialogFlag: false,
      pickerOptions: {
        // 禁止选择时间
        disabledDate: (time) => {
          return time.getTime() < new Date(this.childDialogForm.dataTime[1]).getTime();
        }
      },
      selectDeviceList: [{}],
      roomList: [{}],
      deviceTableInfo: [{}],
      roomArray: [],
      authTime: [],
      childDialogForm: {},
      patternOptions: [],
      typeOptions: [],
      modeOptions: [
        { type: '1', label: '网络空间作业'},
        { type: '2', label: '机房现场作业'},
        { type: '3', label: '变电站作业'},
        { type: '4', label: '办公场所作业'}
      ],
      jobCategoryOptions: [],
      jobTypeAllOptions: {},
      riskOptions: [],
      statusInfoOptions: [],
      planDetailList: [],
      repairObjects: [],
      rules: {
        applyFinishTime: [
          {required: true, message: '申请结束时间不能为空', trigger: 'blur'}
        ],
        changePersonName: [
          {required: true, message: '申请人不能为空', trigger: 'blur'}
        ]
      },
      submitForm: {
        applyFinishTime: null,
        content: null
      },
      pageLoading: false,
      saveLoading: false,
      tableLoading: false,
      repairPlan: [],
      personList: [],
      grandsonDialogFlag: false,
      riskPointsList: [],
      measureList: [],
      workRiskLevel: [],
      workWay: [],
      workCategory: [],
      dictForBastionHostProtocol: [],
      dictForBastionNetworkProtocol: [],
      inputNumShow: 4,
      inputInterval: 10,
      authorizedPersonList: []
    }
  },
  computed: {
    ...mapGetters(['userDetail'])
  },
  created() {
    this.getDictList('info_repair_plan_pattern')
    this.getDictList('info_repair_plan_type')
    this.getDictList('info_job_category')
    this.getDictList('info_power_air_system')
    this.getDictList('info_cloud_platform_virtual_pool')
    this.getDictList('info_host_storage_device')
    this.getDictList('info_core_network_device')
    this.getDictList('info_safe_device')
    this.getDictList('info_apply_software')
    this.getDictList('info_basic_environment')
    this.getDictList('info_fire_fighting_system')
    this.getDictList('info_cabling_system')
    this.getDictList('info_plan_status')
    this.getDictList('info_work_risk_level')
    this.getDictList('info_work_way')
    this.getDictList('info_work_category')
    this.getDictList('info_bastion_server_type')
    this.getDictList('info_bastion_network_type')
    this.getRepairPlan()
    this.getAuthorizedPerson()
    this.getRiskOptions()
    this.getRoomList()
    this.code = this.$route.query.code
    this.orderType = this.$route.query.type
    this.id = this.$route.query.id
    this.submitForm.changePersonName = this.userInfo.userName
    this.getList()
  },
  mounted() {
    this.setTableHeight()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    /**
     * 浮动样式转换
     */
    handleScroll() {
      const footer = document.querySelector('.fixed-form')
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      if (scrollTop + windowHeight >= documentHeight) {
        footer.style.position = 'fixed'
        footer.style.bottom = '0'
      } else {
        footer.style.position = 'sticky'
      }
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    /**
     * 加载字典
     * @param code
     */
    getDictList(code) {
      getDictList(code).then(res => {
        if (code === 'info_repair_plan_pattern') {
          this.patternOptions = res.data
        } else if (code === 'info_repair_plan_type') {
          this.typeOptions = res.data
        } else if (code === 'info_job_category') {
          this.jobCategoryOptions = res.data
        } else if (code === 'info_power_air_system') {
          this.jobTypeAllOptions['info_power_air_system'] = res.data
        } else if (code === 'info_cloud_platform_virtual_pool') {
          this.jobTypeAllOptions['info_cloud_platform_virtual_pool'] = res.data
        } else if (code === 'info_host_storage_device') {
          this.jobTypeAllOptions['info_host_storage_device'] = res.data
        } else if (code === 'info_core_network_device') {
          this.jobTypeAllOptions['info_core_network_device'] = res.data
        } else if (code === 'info_safe_device') {
          this.jobTypeAllOptions['info_safe_device'] = res.data
        } else if (code === 'info_apply_software') {
          this.jobTypeAllOptions['info_apply_software'] = res.data
        } else if (code === 'info_basic_environment') {
          this.jobTypeAllOptions['info_basic_environment'] = res.data
        } else if (code === 'info_fire_fighting_system') {
          this.jobTypeAllOptions['info_fire_fighting_system'] = res.data
        } else if (code === 'info_cabling_system') {
          this.jobTypeAllOptions['info_cabling_system'] = res.data
        } else if (code === 'info_plan_status') {
          this.statusInfoOptions = res.data
        } else if (code === 'info_work_risk_level') {
          this.workRiskLevel = res.data
        } else if (code === 'info_work_way') {
          this.workWay = res.data
        } else if (code === 'info_work_category') {
          this.workCategory = res.data
        } else if (code === 'info_bastion_server_type') {
          this.dictForBastionHostProtocol = res.data
        } else if (code === 'info_bastion_network_type') {
          this.dictForBastionNetworkProtocol = res.data
        }
      })
    },
    /**
     * 页面返回
     */
    returnEvent() {
      this.$router.push({
        path: '/xcnanr/ideal/repairDelay/index'
      })
    },
    /**
     * 获取机房列表
     */
    getRoomList() {
      // 获取机房下拉数据
      getAllRoom().then(res => {
        this.roomList = res.data
      })
    },
    /**
     * 被授权人员下拉
     */
    getAuthorizedPerson() {
      getAll({enabled: 1}).then(res => {
        this.authorizedPersonList = res.data
      })
    },
    /**
     * 获取数据
     */
    getList() {
      repairOrderDetail(this.code).then(res => {
        this.childDialogForm = res.data
        this.childDialogForm.mode = this.childDialogForm.mode + ''
        this.childDialogForm.type = this.childDialogForm.type + ''
        this.buildData()
      })
    },
    /**
     * 处理重构数据
     */
    buildData() {
      let date = []
      date.push(this.childDialogForm.startTime)
      date.push(!this.childDialogForm.applyFinishTimeSucc ? this.childDialogForm.finishTime : this.childDialogForm.applyFinishTimeSucc)
      this.childDialogForm.dataTime = date
      this.childDialogForm.operator = this.childDialogForm.operator.split(',').map(name => name.trim()).filter(name => name);
      let operatorList = []
      this.childDialogForm.operator.forEach(name => {
        let temp = this.personList.find(person => person.name === name)
        if (temp) {
          operatorList.push(temp.id)
        }
      })
      this.childDialogForm.operatorList = operatorList
      if (this.childDialogForm.riskId !== undefined && this.childDialogForm.riskId !== '') {
        this.childDialogForm.risk = this.childDialogForm.riskId.split(',').map(id => id.trim()).filter(id => id);
      }
      if (this.childDialogForm.type === '2') {
        let address = []
        address.push(this.childDialogForm.province)
        address.push(this.childDialogForm.city)
        address.push(this.childDialogForm.district)
        this.childDialogForm.address = address
        this.address = address
      }
      if (this.childDialogForm.orderDetailList !== undefined && this.childDialogForm.orderDetailList.length > 0) {
        // this.deviceTableInfo = []
        // this.deviceTableInfo = this.childDialogForm.orderDetailList
        // 检修对象回填
        this.roomArray = this.childDialogForm.orderDetailList.filter(detail => detail.detailType === 2)
        this.deviceTableInfo = this.childDialogForm.orderDetailList.filter(detail => detail.detailType === 1)
      }
      if (this.childDialogForm.applyFinishTime !== undefined || this.childDialogForm.applyFinishTime !== '') {
        let date = []
        date.push(this.childDialogForm.startTime)
        date.push(this.childDialogForm.applyFinishTime)
        this.childDialogForm.updateTime = date
      }

      this.submitForm.applyFinishTime = (!this.childDialogForm.applyFinishTimeSucc ? this.childDialogForm.finishTime : this.childDialogForm.applyFinishTimeSucc)
      this.submitForm.content = (!this.childDialogForm.contentSucc ? this.childDialogForm.content : this.childDialogForm.contentSucc)
      console.log("组装后的数据", this.childDialogForm)
    },
    /**
     * 获取检修计划
     */
    getRepairPlan() {
      getRepairPlanList().then(res => {
        this.repairPlan = res.data
      })
    },
    /**
     * 获取风险管控卡
     */
    getRiskOptions() {
      const query = {
        pageNumber: 1,
        pageSize: 9999,
        companyRegionCode: this.userInfo.regionCode,
        statusInfo: 1
      }
      getRiskByPage(query).then(res => {
        this.riskOptions = res.data.records
      })
    },
    /**
     * 字典回显
     * @param code
     * @param dictList
     * @returns {*}
     */
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
    /**
     * 公司下拉树处理数据
     * @param val
     * @param type
     */
    getItem(val, type) {
      if (type === 'CORP') {
        this.childDialogForm.companyId = val.id
        this.childDialogForm.companyName = val.fullName
        this.childDialogForm.deptId = null;
        this.childDialogForm.deptName = null;
      } else if (type === 'DEPT') {
        this.childDialogForm.deptId = val.id
        this.childDialogForm.deptName = val.fullName
      }
      this.$forceUpdate()
    },
    /**
     * 提交
     */
    saveEvent() {
      this.submitForm.id = this.id
      this.submitForm.changePersonId = this.userDetail.userId
      this.submitForm.code = this.code
      // this.submitForm.yanshi = '延期'
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          changeApply(this.submitForm).then(() => {
            this.saveLoading = false
            this.$message({
              type: 'success',
              message: '变更申请提交成功！'
            });
            this.returnEvent()
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.xt_card_xc {
  padding: 45px 170px 45px 170px;
  background: #FFF;
  border-radius: 5px;
  margin: 5px auto;
  width: 1300px;
}

::v-deep.xt_approve_xc {
  padding: 45px 170px 45px 170px;
  background: #FFF;
  border-radius: 5px;
  margin: 5px auto;
  width: 1300px;
}

.table_detail {
  background: #FFF;
}

::v-deep.title-head {
  float: left;
  margin: 12px 0 0 60px;
  font-size: 25px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266;
}

::v-deep .input-textarea-m {
  margin-bottom: 74px !important;
}

.el-card {
  border: 1px solid #eee !important;
}

.fixed-form {
  position: sticky;
  bottom: 0;
  z-index: 1000;
  background-color: white; /* 确保审批人盒子在底部时有背景色 */
  width: 1300px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1); /*添加阴影效果 */
}

::v-deep .el-textarea__inner {
  resize: none !important;
}
</style>
