<template>
  <div>
    <!-- 检修工单详情 -->
    <div class="xt_card_xc xt_form xc_base">
      <div style="margin-left: -160px;margin-top: 0px;margin-bottom: 0px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/xcnanr/operationOrder/repairOrder/index' }">检修工单</el-breadcrumb-item>
          <el-breadcrumb-item v-if="type==='add'">详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button v-if="[3,4].indexOf(parseInt(childDialogForm.statusInfo)) >= 0" type="primary" style="position: absolute;top: 12px;right: 30px;" @click="printForm">打印</el-button>
      </div>
      <div class="text item">
        <el-row>
          <el-steps :active="adoptActive" align-center>
            <el-step v-for="item in adoptTrail" :key="item.title" :title="item.title">
              <template slot="description">
                <span v-if="item.name" class="name-ellipsis" :title="item.name">{{ item.name | truncateName }}</span>
                <br v-if="item.name">
                <span v-if="item.createTime">{{ item.createTime }}</span>
              </template>
            </el-step>
          </el-steps>
        </el-row>
      </div>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <el-form :model="childDialogForm" inline label-suffix=":" label-width="150px" v-loading="pageLoading">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="工单编号">
                <span style="font-weight: bolder">{{ childDialogForm.code }}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <!-- 检修类型(1：常规检修2：i6000检修)-->
              <el-form-item label="检修类型" prop="type">
                <el-radio disabled v-model="childDialogForm.type" v-for="item in typeOptions" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="关联检修计划" prop="companyId">
                <el-select disabled v-model="childDialogForm.planId" style="width: 1040px" placeholder="未关联检修计划">
                  <el-option v-for="item in companyIdOptions" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="公司" prop="companyId">
                <xt-tree-lzay-select :formValue="childDialogForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getItem(v, 'CORP')" style="width: 390px" disabled/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="部门" prop="deptId">
                <xt-tree-lzay-select :formValue="childDialogForm.deptName" :unit-id="childDialogForm.companyId" disabled :selectType="'DEPT'" @getTreeItem="(v)=>getItem(v,'DEPT')" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="检修负责人" prop="header">
                <el-input disabled v-model="childDialogForm.header" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="负责人电话" prop="headerTel">
                <el-input disabled v-model="childDialogForm.headerTel" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="检修操作人" prop="operator">
                <el-input disabled v-model="childDialogForm.operator" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="作业总人数" prop="totalUserCount">
                <el-input disabled v-model="childDialogForm.totalUserCount" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="orderType==='1' ? 12 : 24">
            <div class="grid-content bg-purple">
              <el-form-item label="检修时间段" prop="dataTime">
                <el-date-picker disabled v-model="childDialogForm.authTime"
                                class="filter-item"
                                :type="'datetimerange'"
                                format="yyyy-MM-dd HH:mm"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                align="right"
                                :style="{width: orderType==='1' ? '390px' : '1040px'}"
                />
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='1'">
            <div class="grid-content bg-purple">
              <el-form-item label="检修类别" prop="mode">
                <el-select disabled v-model="childDialogForm.mode" style="width: 390px">
                  <el-option v-for="dict in modeOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"/>
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
          <el-col :span="24" style="height: 100%">
            <div class="grid-content bg-purple">
              <el-form-item label="检修内容" prop="content">
                <el-input v-if="!childDialogForm.contentSucc" disabled v-model="childDialogForm.content" type="textarea" :rows="2" style="width: 1040px"/>
                <el-input v-else disabled v-model="childDialogForm.contentSucc" type="textarea" :rows="2" style="width: 1040px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col v-if="orderType==='1'" :span="24" style="height: 100%;">
            <div class="grid-content bg-purple">
              <el-form-item label="危险点分析" prop="riskContent">
                <el-input disabled v-model="childDialogForm.riskContent" type="textarea" :rows="4" style="width: 1040px"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col v-if="orderType==='1'" :span="24" style="height: 100%;">
            <div class="grid-content bg-purple">
              <el-form-item label="关键措施" prop="keySolution">
                <el-input disabled v-model="childDialogForm.keySolution" type="textarea" :rows="4" style="width: 1040px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="风险作业等级" prop="riskLevel">
                <el-select disabled v-model="childDialogForm.riskLevel" style="width: 390px">
                  <el-option v-for="item in workRiskLevel" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="作业地点" prop="address">
                <PcdSelect disabled v-model="childDialogForm.address" @addressChange="addressChange" :default-address="['山东', '济南', '市中']"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="主办单位人数" prop="mainUserCount">
                <el-input disabled v-model="childDialogForm.mainUserCount" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="产业单位人数" prop="attachUserCount">
                <el-input disabled v-model="childDialogForm.attachUserCount" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="外包单位人数" prop="otherUserCount">
                <el-input disabled v-model="childDialogForm.otherUserCount" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="作业组织(建管)单位" prop="orgCompany">
                <el-input disabled v-model="childDialogForm.orgCompany" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="作业实施(施工)单位" prop="constructCompany">
                <el-input disabled v-model="childDialogForm.constructCompany" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="工作类别" prop="workType">
                <el-select disabled v-model="childDialogForm.workType" style="width: 390px">
                  <el-option v-for="item in workCategory" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="工作方式" prop="workMode">
                <el-select disabled v-model="childDialogForm.workMode" style="width: 390px">
                  <el-option v-for="item in workWay" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="工作场所名称" prop="position">
                <el-input disabled v-model="childDialogForm.position" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="本次操作系统信息" prop="itSystem">
                <el-input disabled v-model="childDialogForm.itSystem" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="涉及方式资源申请" prop="isApplyResource">
                <el-radio disabled v-model="childDialogForm.isApplyResource" :label="'1'">是</el-radio>
                <el-radio disabled v-model="childDialogForm.isApplyResource" :label="'0'">否</el-radio>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="24" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="涉及设备/软件" prop="software">
                <el-input disabled v-model="childDialogForm.software" style="width: 945px"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <!-- 常规检修下面的表格 -->
        <template v-if="childDialogForm.type + '' === '1'">
          <!-- 分割线 -->
          <el-divider></el-divider>

          <!-- 检修场所 / 检修结果 现场作业 -->
          <el-form-item v-if="childDialogForm.mode === '2'" :label="childDialogForm.statusInfo + '' === '6' ? '检修场所' : '检修场所'">
            <el-table ref="authTable" :key="Math.random()" :data="roomArray" style="width: 1040px" stripe max-height="400px">
              <el-table-column label="序号" type="index" width="80" align="center" />
              <el-table-column prop="objectName" align="center" :show-overflow-tooltip="true" label="机房名称"/>
              <el-table-column v-if="childDialogForm.statusInfo + '' === '6'" align="center" prop="feedbackContent" label="终结内容">
                <template slot-scope="scope">
                  {{ !scope.row.feedbackContent ? '-' : scope.row.feedbackContent }}
                </template>
              </el-table-column>
              <el-table-column v-if="childDialogForm.statusInfo + '' === '6'" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-if="!!scope.row.files && scope.row.files.length > 0" type="text" size="mini" @click="showDetailFileFunc(scope.row.files)">
                    查看附件
                  </el-button>
                  <span v-else>-</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- 检修对象 / 检修结果 -->
          <el-form-item style="margin-top: 15px;" :label="childDialogForm.statusInfo + '' === '6' ? '检修对象' : '检修结果'">
            <!-- 检修对象-现场作业 -->
            <el-table v-if="childDialogForm.mode === '2'" :data="deviceTableInfo" :key="deviceTableInfoKey" ref="tableData" :height="tableHeight" style="width: 1040px" max-height="400px" stripe v-loading="tableLoading">
              <el-table-column label="序号" type="index" width="80" align="center" />
              <el-table-column label="设备名称" prop="objectName" min-width="400" align="center" show-overflow-tooltip />
              <el-table-column label="描述" prop="description" width="565" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ !scope.row.description ? '-' : scope.row.description }}
                </template>
              </el-table-column>
              <el-table-column v-show="childDialogForm.statusInfo + '' === '6'" align="center" prop="feedbackContent" label="终结内容" width="300">
                <template slot-scope="scope">
                  {{ !scope.row.feedbackContent ? '-' : scope.row.feedbackContent }}
                </template>
              </el-table-column>
              <el-table-column v-show="childDialogForm.statusInfo + '' === '6'" label="操作" align="center" width="150">
                <template slot-scope="scope">
                  <el-badge v-if="!!scope.row.files && scope.row.files.length > 0" :value="scope.row.files.length" class="item" type="primary">
                    <el-button type="text" size="mini" @click="showDetailFileFunc(scope.row.files)">查看附件</el-button>
                  </el-badge>
                  <span v-else>-</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 检修对象-远程作业 -->
            <el-table v-else :data="deviceTableInfo" :key="deviceTableInfoKey" ref="tableData" :height="tableHeight" style="width: 1040px" max-height="400px" stripe v-loading="tableLoading">
              <el-table-column label="序号" type="index" width="80" align="center" />
              <el-table-column label="设备名称" prop="objectName" min-width="300" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ '[' + scope.row.ciLabel + '] ' + scope.row.objectName }}
                </template>
              </el-table-column>
              <el-table-column label="IP" prop="ip" min-width="120" align="center" show-overflow-tooltip/>
              <el-table-column label="端口" prop="sort" min-width="80" align="center" />
              <el-table-column label="资产类型" prop="extAttr4" width="160" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.extAttr1 === "0" ? conversionDict(scope.row.extAttr4, dictForBastionHostProtocol) : conversionDict(scope.row.extAttr4, dictForBastionNetworkProtocol) }}
                </template>
              </el-table-column>
              <el-table-column label="描述" prop="description" width="300" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ !scope.row.description ? '-' : scope.row.description }}
                </template>
              </el-table-column>
              <el-table-column v-show="childDialogForm.statusInfo + '' === '6'" align="center" prop="feedbackContent" label="终结内容" width="300">
                <template slot-scope="scope">
                  {{ !scope.row.feedbackContent ? '-' : scope.row.feedbackContent }}
                </template>
              </el-table-column>
              <el-table-column v-show="childDialogForm.statusInfo + '' === '6'" label="操作" align="center" width="150">
                <template slot-scope="scope">
                  <el-badge v-if="!!scope.row.files && scope.row.files.length > 0" :value="scope.row.files.length" class="item" type="primary">
                    <el-button type="text" size="mini" @click="showDetailFileFunc(scope.row.files)">查看附件</el-button>
                  </el-badge>
                  <span v-else>-</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <!-- 分割线 -->
          <el-divider></el-divider>

          <el-form-item label="授权信息">
            <!-- 授权信息 -->
            <el-table ref="tableData2" :data="authDetailList" :height="tableHeight" style="width: 1040px" max-height="400px" v-loading="tableLoading" stripe>
              <el-table-column type="index" align="center" label="序号" width="60px" />
              <el-table-column label="流水号" prop="serialNo" align="center" width="200px" />
              <el-table-column label="被授权人" prop="workerName" align="center" show-overflow-tooltip width="90px" />
              <el-table-column label="授权对象" prop="objectName" align="center" show-overflow-tooltip min-width="150px" />
              <el-table-column v-if="checkLoginInfo" label="登录信息" align="center">
                <el-table-column label="访问地址" prop="bastionUrl" align="center" show-overflow-tooltip width="180px"></el-table-column>
                <el-table-column label="检修账号" align="center" show-overflow-tooltip width="130px">
                  <template slot-scope="scope">
                    {{ checkLoginPwd(scope.row) ? scope.row.tempUser : '-' }}
                  </template>
                </el-table-column>
                <el-table-column label="检修密码" align="center" show-overflow-tooltip width="110px">
                  <template slot-scope="scope">
                    {{ checkLoginPwd(scope.row) ? scope.row.tempPwd : '-' }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="授权结果" align="center" width="110px">
                <template slot-scope="scope">
                  {{ loadAuthResult(scope.row) }}
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <!-- 分割线 -->
          <el-divider></el-divider>

          <!--    工单跟踪-->
          <el-form-item label="工单跟踪">
            <el-table ref="recordTable" :key="Math.random()" :data="childDialogForm.recordList" style="width: 1040px" max-height="400px" stripe>
              <el-table-column type="index" align="center" label="序号" width="80px" />
              <el-table-column prop="createTime" align="center" label="操作时间" width="200px" />
              <el-table-column prop="extAttr1" align="center" label="操作人" width="150px">
                <template slot-scope="scope">
                  {{ !scope.row.extAttr1 ? '-' : scope.row.extAttr1 }}
                </template>
              </el-table-column>
              <el-table-column prop="content" align="center" :show-overflow-tooltip="true" label="操作内容"></el-table-column>
            </el-table>
          </el-form-item>
        </template>
        <div style="width:100px;margin: 0 auto; margin-top: 10px; margin-bottom: 30px">
          <el-button type="primary" size="small" @click="returnEvent">返回</el-button>
        </div>
      </el-form>

    </div>
    <Print v-show="printFlag" ref="print" :orderInfo="childDialogForm" :mode="modeOptions.find(d => d.dictKey === childDialogForm.mode)['dictValue']" :job-category="jobCategoryOptions.find(d => d.dictKey === childDialogForm.jobCategory)['dictValue']" :job-type="jobTypeAllOptions[childDialogForm.jobCategory].find(d => d.dictKey === childDialogForm.jobType)['dictValue']" style="margin-top: 1000px" />
    <!-- 附件列表弹层 -->
    <el-dialog v-if="showDetailFile.flag" :visible.sync="showDetailFile.flag" title="检修终结上传附件列表" width="800px" @close="closeFileDialogFunc">
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
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getDictList} from '@/api/dict'
import {getAllRoom} from "@/api/xcnanr/room"
import PcdSelect from '@/views/xcnanr/operationOrder/repairOrder/components/pcdSelect.vue'
import {repairOrderDetail, queryTaskInfo} from "@/api/xcnanr/repairOrder";
import XtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import { getAll as getAllDetails } from "@/api/xcnanr/temporaryAuthDetail";
import { getWorkerByIdIn } from "@/api/xcnanr/authorizedPerson";
import Print from './print.vue'

export default {
  filters: {
    truncateName(value) {
      if (!value) return '';
      return value.length > 5 ? value.slice(0, 5) + '...' : value;
    }
  },
  watch: {
    'childDialogForm.type': {
      handler(newValue) {
        this.orderType = newValue;
      }
    }
  },
  components: { XtTreeLzaySelect, PcdSelect, Print },
  data() {
    return {
      userInfo: this.$store.state.user.userDetail,
      type: "add", orderType: '1', deviceDialogFlag: false, selectDeviceList: [],
      roomList: [], authTime: [], childDialogForm: { type: '1', mode: '1', isApplyResource: '1', jobCategory: '', jobType: '' },
      patternOptions: [], typeOptions: [], modeOptions: [],
      jobCategoryOptions: [],
      jobTypeAllOptions: {}, riskOptions: [], statusInfoOptions: [], planDetailList: [],
      repairObjects: [], pageLoading: true, tableHeight: undefined, tableLoading: false, repairPlan: [], personList: [],
      grandsonDialogFlag: false, riskPointsList: [], measureList: [], workRiskLevel: [], workWay: [], workCategory: [],
      dictForBastionHostProtocol: [], dictForBastionNetworkProtocol: [], adoptInfo: '', adoptActive: 0, adoptTrail: [],
      selectedImage:'', authDetailList: [], authWorkerList: [], dictForDetailStatus: [],
      roomArray: [],
      deviceTableInfo: [], deviceTableInfoKey: null, showDetailFile: { flag: false, fileList: [] },
      printFlag: false
    }
  },
  computed: {
    ...mapGetters(['userDetail']),
    // 显示登录信息几列：远程作业、工单状态 执行中和待终结
    checkLoginInfo() {
      return this.childDialogForm.mode !== '2'
        && [3,5].indexOf(parseInt(this.childDialogForm.statusInfo))>=0
    }
  },
  created() {
    this.getData()
    this.getDictList('info_repair_plan_pattern')
    this.getDictList('info_repair_plan_type')
    this.getDictList('info_repair_plan_mode')
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
    this.getDictList('info_order_detail_auth_status')
    this.getRoomList()
  },
  mounted() {
  },
  methods: {
    // 显示登录账号和密码：当前登录人是填报人，当前登录人是被授权人
    checkLoginPwd(row) {
      return this.userInfo.userId + '' === this.childDialogForm.createUser
        || this.authWorkerList.filter(d => d.id === row.workerId && d.platformId === this.userInfo.userId + '').length > 0
    },
    trackingTimeConvert(time) {
      return time.substring(0, time.length - 3)
    },
    trackingDescConvert(person, desc) {
      if (person) {
        return '【' + person + '】 ' + desc
      } else {
        return desc
      }
    },
    /**
     * 获取详情
     */
    getData() {
      repairOrderDetail(this.$route.query.code).then(res => {
        this.childDialogForm = res.data
        this.childDialogForm.mode = res.data.mode.toString()
        this.childDialogForm.type = res.data.type.toString()
        this.childDialogForm.risk = res.data.riskId.split(',')
        let address = []
        address.push(this.childDialogForm.province)
        address.push(this.childDialogForm.city)
        address.push(this.childDialogForm.district)
        this.childDialogForm.address = address
        this.childDialogForm.isApplyResource = res.data.isApplyResource.toString()
        this.childDialogForm.riskLevel = res.data.riskLevel.toString()
        this.childDialogForm.workMode = res.data.workMode.toString()
        this.childDialogForm.workType = res.data.workType.toString()
        this.childDialogForm.operatorList = res.data.operatorId.split(',')
        if (res.data.applyFinishTimeSucc === undefined || res.data.applyFinishTimeSucc === '') {
          this.childDialogForm.authTime = [res.data.startTime, res.data.finishTime]
        } else {
          this.childDialogForm.authTime = [res.data.startTime, res.data.applyFinishTimeSucc]
        }
        // 检修对象回填
        this.roomArray = this.childDialogForm.orderDetailList.filter(detail => detail.detailType === 2)
        this.deviceTableInfo = this.childDialogForm.orderDetailList.filter(detail => detail.detailType === 1)
        this.deviceTableInfoKey = new Date().getTime() + ''
        // 加载审批流
        this.getAdoptInfo()
        // 加载授权明细
        getAllDetails({ workId: res.data.id }).then(res2 => {
          if (res2.data && res2.data.length > 0) {
            this.authDetailList = res2.data
            // 根据被授权人列表，查询被授权人信息
            const workerIds = this.authDetailList.map(d => d.workerId)
            if (workerIds && workerIds.length > 0) {
              getWorkerByIdIn(workerIds).then(res3 => {
                this.authWorkerList = res3.data
                this.pageLoading = false
              })
            } else {
              this.pageLoading = false
            }
          } else {
            this.pageLoading = false
          }
        })
      })
    },
    /**
     * 获取工单跟踪预审批人员信息
     */
    getAdoptInfo() {
      queryTaskInfo(this.$route.query.code).then(res => {
        this.adoptInfo = res.data.map(item => item.name).join('/');
        // 处理审批追踪
        this.disposeAdopt()
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
    getDictList(code) {
      //加载字典
      getDictList(code).then(res => {
        if (code === 'info_repair_plan_pattern') {
          this.patternOptions = res.data
        } else if (code === 'info_repair_plan_type') {
          this.typeOptions = res.data
        } else if (code === 'info_repair_plan_mode') {
          this.modeOptions = res.data
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
        } else if (code === 'info_order_detail_auth_status') {
          this.dictForDetailStatus = res.data
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
     * 页面返回
     */
    returnEvent() {
      this.$router.push({
        path: '/xcnanr/operationOrder/repairOrder/index'
      })
    },
    /**
     * 处理审批追踪
     */
    disposeAdopt() {
      this.adoptTrail = []
      this.adoptActive = 0
      let name = ''
      let time = ''

      // 查找审批人
      if (this.childDialogForm.statusInfo >= 3) {
        this.childDialogForm.recordList.forEach(item => {
          if (item.content.includes('审批通过')) {
            name = item.createUserName
            time = item.createTime
          }
        })
      }

      const steps = [
        {
          title: '填报', name: this.childDialogForm.createUserName, createTime: this.childDialogForm.createTime
        },
        {title: '签发', name: this.adoptInfo},
        {title: '签发', name: name, createTime: time},
        {title: '终结', createTime: time},
        {title: '终结',}
      ]
      if (this.childDialogForm.statusInfo >= 3) {
        this.adoptTrail.push(steps[0], steps[2], steps[3])
        this.adoptActive = 3
      } else {
        this.adoptTrail.push(steps[0], steps[1], steps[4])
        this.adoptActive = 1
      }
    },
    /**
     * 照片
     * @param row
     */
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
        } else if(status === 3) {
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
  }
}
</script>

<style lang="scss" scoped>
::v-deep.xt_card_xc {
  padding: 15px 170px 15px 170px;
  background: #FFF;
  border-radius: 5px;
  margin: 5px auto;
  width: 1300px;
}

::v-deep.title-head {
  float: left;
  margin: 12px 0 0 60px;
  font-size: 25px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

::v-deep .bg-purplesy {
  margin-top: 10px;
}

::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266;
}

::v-deep .el-textarea__inner {
  resize: none !important;
}

::v-deep .name-ellipsis {
  display: inline-block;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

::v-deep .name-tooltip {
  display: inline-block;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

::v-deep .name-tooltip:hover {
  white-space: normal;
  width: auto;
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 5px;
  z-index: 1000;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
/deep/.el-badge__content {
  top: 15px;
  right: -1px;
}
</style>
