<template>
  <div>
    <!-- 检修计划详情 -->
    <div class="xt_card_xc xt_form xc_base">
      <!-- 面包屑 -->
      <div style="margin-left: -160px;margin-top: -30px;margin-bottom: 20px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/xcnanr/operationPlan/repairPlan/index' }">检修计划</el-breadcrumb-item>
          <el-breadcrumb-item>{{ getChildTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 审批流 -->
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple" v-loading="approveLoading" style="height: 97px">
            <el-steps :active="adoptActive" align-center>
              <el-step v-for="item in adoptTrail" :key="item.title" :title="item.title" :icon="item.icon">
                <template slot="description">
                  <span v-if="item.name" class="name-ellipsis" :title="item.name">{{ item.name | truncateName }}</span>
                  <br v-if="item.name">
                  <span v-if="item.createTime">{{ item.createTime }}</span>
                </template>
              </el-step>
            </el-steps>
          </div>
        </el-col>
      </el-row>
      <!-- 计划编号 -->
      <div style="margin: 35px 0 20px 53px">
        <span style="margin: 0 14px 0 36px; font-size: 14px; color: #46506D;">计划编号:</span>
        <span style="font-weight: bolder">{{ planCode }}</span>
      </div>
      <el-form ref="childDialogForm" :model="childDialogForm" inline size="small" label-suffix=":" label-width="160px" v-loading="pageLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司" prop="companyId">
              <xt-tree-lzay-select disabled :formValue="childDialogForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getItem(v, 'CORP')" style="width: 390px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptId">
              <xt-tree-lzay-select disabled :formValue="childDialogForm.deptName" :unit-id="childDialogForm.companyId" :selectType="'DEPT'" @getTreeItem="(v)=>getItem(v,'DEPT')" style="width: 390px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 检修类型(1：常规检修2：i6000检修) -->
            <el-form-item label="检修类型" prop="type">
              <el-radio disabled v-model="childDialogForm.type" v-for="item in typeOptions" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}
              </el-radio>
            </el-form-item>
          </el-col>
          <!-- 根据检修类型显示两种表单，部分使用同一字段传值存储 -->
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <!-- 检修对象类型(1：信息系统 2：基础平台 3：基础设施 4：云平台) -->
            <el-form-item label="检修对象类型" prop="type">
              <el-select disabled v-model="childDialogForm.objectType" style="width: 390px">
                <el-option v-for="item in objectTypeOptions" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <el-form-item label="检修类别" prop="mode">
              <el-select disabled v-model="childDialogForm.mode" style="width: 390px">
                <el-option v-for="dict in modeOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <!-- 工作类别 -->
            <el-form-item label="工作类别" prop="jobCategory">
              <el-select disabled v-model="childDialogForm.jobCategory" clearable @change="loadJobTypeOptions" style="width: 390px">
                <el-option v-for="dict in jobCategoryOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <!-- 作业类型 -->
            <el-form-item label="作业类型" prop="jobType">
              <el-select disabled v-model="childDialogForm.jobType" clearable style="width: 390px">
                <el-option v-for="dict in jobTypeAllOptions[childDialogForm.jobCategory]" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <el-form-item label="检修负责人" prop="header">
              <el-input disabled v-model="childDialogForm.header" style="width: 390px"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <el-form-item label="检修操作人" prop="operatorArray">
              <el-select disabled v-model="operatorArray" multiple style="width: 390px">
                <el-option v-for="item in personList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="childDialogForm.type === '1' ? '计划类型':'检修计划类型'" prop="pattern">
              <el-select disabled v-model="childDialogForm.pattern" filterable style="width: 390px">
                <el-option v-for="dict in patternOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="是否统一下达检修" prop="isTongyi">
              <el-select disabled v-model="childDialogForm.isTongyi" filterable style="width: 390px">
                <el-option v-for="dict in isTongyiOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"/>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 暂时不拆分成两个时间框 -->
          <el-col :span="12">
            <el-form-item label="计划检修时间" prop="authTime">
              <el-date-picker
                v-model="authTime"
                disabled
                class="filter-item"
                :type="'datetimerange'"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['08:30:00', '17:30:00']"
                align="right"
                clearable
                style="width: 390px"/>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="self-input-textarea">
            <div class="grid-contents bg-purple">
              <el-form-item :label="childDialogForm.type === '1' ? '检修内容':'计划内容'" prop="content">
                <el-input disabled v-model="childDialogForm.content" clearable type="textarea" :rows="4" style="width: 1040px;"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="检修任务类型" prop="renwuType">
              <el-select disabled v-model="childDialogForm.renwuType" filterable clearable style="width: 390px">
                <el-option v-for="dict in renwuTypeOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="检修级别类型" prop="jiebieType">
              <el-select disabled v-model="childDialogForm.jiebieType" filterable clearable style="width: 390px">
                <el-option v-for="dict in jiebieTypeOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="是否停运" prop="isTingyun">
              <el-select disabled v-model="childDialogForm.isTingyun" filterable clearable style="width: 390px">
                <el-option v-for="dict in isTingyunOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="是否重要检修" prop="isImport">
              <el-select disabled v-model="childDialogForm.isImport" filterable clearable style="width: 390px">
                <el-option v-for="dict in isImportOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item disabled label="检修单位" prop="jianxiuCompa">
              <el-input disabled v-model="childDialogForm.jianxiuCompa" clearable style="width: 390px"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="业务主管部门" prop="zhuguanDep">
              <el-select disabled v-model="childDialogForm.zhuguanDep" filterable clearable style="width: 390px">
                <el-option v-for="dict in zhuguanDepOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="检修主管" prop="jianxiuZg">
              <el-input disabled v-model="childDialogForm.jianxiuZg" clearable style="width: 390px" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="建设运维单位" prop="yunweiCompa">
              <el-input disabled v-model="childDialogForm.yunweiCompa" clearable style="width: 390px" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="计划负责人" prop="jihuaHeader">
              <el-input disabled v-model="childDialogForm.jihuaHeader" clearable style="width: 390px" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="联系电话" prop="lianxiTel">
              <el-input disabled v-model="childDialogForm.lianxiTel" clearable style="width: 390px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="作业组织（建管）单位" prop="jianguanCompa">
              <el-input disabled v-model="childDialogForm.jianguanCompa" clearable style="width: 390px"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="作业实施（施工）单位" prop="shigongCompa">
              <el-input v-model="childDialogForm.shigongCompa" clearable style="width: 390px"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="作业风险等级" prop="riskLevel">
              <el-select disabled v-model="childDialogForm.riskLevel" filterable clearable style="width: 390px">
                <el-option v-for="dict in riskLevelOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="作业地点" prop="position">
              <PcdSelect disabled :inputNumShow="inputNumShow" :inputInterval="inputInterval" @addressChange="addressChange" :default-address="['山东', '济南', '市中']" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="作业总人数" prop="totalUserCount">
              <el-input disabled v-model="childDialogForm.totalUserCount" clearable style="width: 390px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="childDialogForm.type === '2'">
            <el-form-item label="涉及信息系统" prop="itSystem">
              <el-input disabled v-model="childDialogForm.itSystem" clearable style="width: 1041px;" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="childDialogForm.type === '2'">
            <el-form-item label="涉及设备/软件" prop="software">
              <el-input disabled v-model="childDialogForm.software" style="width: 1041px;" />
            </el-form-item>
          </el-col>
          <!--          选择-->
          <el-col :span="24" v-if="childDialogForm.type === '2'">
            <el-form-item label="相关缺陷消缺申请" prop="quexian">
              <el-input disabled v-model="childDialogForm.quexian" clearable style="width: 1041px;" />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="self-input-textarea" v-if="childDialogForm.type === '1'">
            <div class="grid-contents bg-purple">
              <el-form-item label="影响范围" prop="influenceScope">
                <el-input disabled v-model="childDialogForm.influenceScope" clearable type="textarea" :rows="4" style="width: 1040px" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="xt_card_xc xt_form xc_base" v-if="childDialogForm.type === '1'">
      <el-form ref="childDialogForm" :model="childDialogForm" inline size="small" label-suffix=":" label-width="160px" v-loading="pageLoading">
        <el-row :gutter="32">
          <el-col :span="24" class="self-input-textarea" v-if="childDialogForm.type === '1'">
            <el-form-item label="危险点分析" prop="riskContent">
              <el-input disabled v-model="childDialogForm.riskContent" clearable type="textarea" :rows="4" style="width: 1040px" />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 28px !important;" v-if="childDialogForm.type === '1'">
            <el-form-item label="关键措施" prop="keySolution">
              <el-input disabled v-model="childDialogForm.keySolution" clearable type="textarea" :rows="4" style="width: 1040px" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 检修对象 -->
    <div class="xt_card_xc xt_form xc_base" v-if="childDialogForm.type === '1'">
      <el-form ref="childDialogForm" :model="childDialogForm" inline size="small" label-suffix=":" label-width="160px" v-loading="pageLoading">
        <div v-if="childDialogForm.type === '1'">
          <el-form-item label="检修对象" prop="deviceIds">
            <el-table ref="deviceTableInfo" :data="deviceTableInfo" style="width: 1040px" max-height="200px" v-loading="tableLoading" @selection-change="selectionChange">
              <el-table-column label="序号" type="index" width="80" align="center" />
              <el-table-column label="设备名称" prop="deviceName" min-width="220" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ '[' + scope.row.deviceCategory + '] ' + scope.row.deviceName }}
                </template>
              </el-table-column>
              <el-table-column v-if="childDialogForm.mode === '1'" label="设备类型" prop="deviceType" width="160" align="center" show-overflow-tooltip/>
              <el-table-column v-if="childDialogForm.mode === '1'" label="IP" prop="IP" width="160" align="center" show-overflow-tooltip/>
              <el-table-column v-if="childDialogForm.mode === '1'" label="远程端口" prop="devicePort" width="120" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input disabled v-model="scope.row.devicePort" />
                </template>
              </el-table-column>
              <el-table-column v-if="childDialogForm.mode === '1'" label="资产类型" prop="deviceProtocol" width="161" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-select disabled v-model="scope.row.deviceProtocol" style="width: 151px">
                    <el-option v-for="dict in getDeviceTypeListFunc(scope.row.deviceCategory)" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="描述" prop="description" :width="childDialogForm.mode === '1' ? 300 : 550" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input disabled v-model="scope.row.description" :style="childDialogForm.mode === '1' ? 'width: 255px' : 'width: 520px'" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </div>
        <div style="margin-top: 30px" v-if="childDialogForm.type === '1' && childDialogForm.mode==='2'">
          <el-form-item label="检修场所" prop="roomIds">
            <el-table ref="roomArray" :data="roomArray" v-loading="tableLoading" style="width: 1040px" max-height="200px">
              <el-table-column label="序号" type="index" width="80" align="center" />
              <el-table-column label="机房名称" prop="objectName" align="center" show-overflow-tooltip />
            </el-table>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 状态跟踪 -->
    <div class="xt_card_xc xt_form xc_base">
      <el-form ref="childDialogForm" :model="childDialogForm" inline size="small" label-suffix=":" label-width="160px" v-loading="pageLoading">
        <div>
          <el-form-item label="状态跟踪" prop="deviceIds">
            <el-table ref="recordList" :data="childDialogForm.recordList" v-loading="tableLoading" style="width: 1040px" max-height="200px">
              <el-table-column label="日期" prop="createTime" align="center" show-overflow-tooltip/>
              <el-table-column label="执行人" prop="extAttr1" align="center" show-overflow-tooltip/>
              <el-table-column label="操作内容" prop="content" align="center" show-overflow-tooltip/>
            </el-table>
          </el-form-item>
        </div>
      </el-form>
      <!--    按钮-->
      <div style="margin: 30px 0 0 0;display: flex;justify-content: center;align-items: center;">
        <el-button type="danger" plain size="small" @click="cancelEvent">关 闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import {getDictList} from '@/api/dict'
import {getAll as getAllUsers} from '@/api/xcnanr/authorizedPerson'
import {getRiskByPage} from '@/api/xcnanr/repair'
import {getAllRoom} from '@/api/xcnanr/room'
import { getDetails, insertRepair } from '../../../../api/xcnanr/repairPlan'
import PcdSelect from '@/views/xcnanr/operationOrder/repairOrder/components/pcdSelect'
import { queryTaskInfo } from '@/api/xcnanr/repairOrder'

export default {
  name: 'DetailForm',
  components: {xtTreeLzaySelect, getDictList, PcdSelect},
  props: {},
  data() {
    return {
      approveLoading: false,
      adoptActive: 0,
      adoptTrail: [],
      adoptInfo: '',
      adoptTime: '',
      childDialogForm: {
        companyId: '',
        companyName: '',
        deptName: '',
        deptId: '',
        type: '1',
        objectType: '',
        mode: '1',
        headerId: '',
        header: '',
        operatorId: '',
        operator: '',
        pattern: '2',
        isTongyi: '1',
        startTime: '',
        endTime: '',
        content: '',
        renwuType: '',
        jiebieType: '',
        isTingyun: '',
        isImport: '',
        jianxiuCompa: '',
        zhuguanDep: '',
        jianxiuZg: '',
        yunweiCompa: '',
        jihuaHeader: '',
        lianxiTel: '',
        jianguanCompa: '',
        shigongCompa: '',
        riskLevel: '',
        province: '',
        city: '',
        district: '',
        totalUserCount: '',
        itSystem: '',
        software: '',
        quexian: '',
        influenceScope: '',
        riskId: '',
        riskContent: '',
        keySolution: '',
        companyRegionCode: '',
        planDetailList: [],
        createUserName: '',
        isSumbit: '',
        deviceRecordDto: {processDefinitionKey: '', approvalOpinion: ''}
      },
      jobCategoryOptions: [],
      jobTypeAllOptions: {},
      pageLoading: false,
      typeOptions: [],
      objectTypeOptions: [],
      modeOptions: [],
      operatorArray: [],
      personList: [],
      patternOptions: [],
      isTongyiOptions: [],
      authTime: ['', ''],
      pickerOptions: {},
      renwuTypeOptions: [],
      jiebieTypeOptions: [
        {
          dictKey: '1',
          dictValue: '二级检修'
        }
      ], // todo i6000暂时写死
      isTingyunOptions: [
        {
          dictKey: '0',
          dictValue: '否'
        }, {
          dictKey: '1',
          dictValue: '是'
        }
      ], // todo i6000暂时写死
      isImportOptions: [
        {
          dictKey: '0',
          dictValue: '否'
        }, {
          dictKey: '1',
          dictValue: '是'
        }
      ], // todo i6000暂时写死
      jianxiuCompaOptions: [
        {
          dictKey: '1',
          dictValue: '国网XX供电公司本部'
        }
      ], // todo i6000暂时手填
      zhuguanDepOptions: [
        {
          dictKey: '1',
          dictValue: '省公司临时组织'
        }, {
          dictKey: '2',
          dictValue: '外部董事'
        }, {
          dictKey: '3',
          dictValue: '省公司指挥部'
        }, {
          dictKey: '4',
          dictValue: '正源公司'
        }, {
          dictKey: '5',
          dictValue: '数字化部'
        }, {
          dictKey: '6',
          dictValue: '一级职员'
        }, {
          dictKey: '7',
          dictValue: '党委宣传部（对外联络部）'
        }, {
          dictKey: '8',
          dictValue: '其它虚拟机构'
        }
      ], // todo i6000暂时写死
      jianxiuZgOptions: [
        {
          dictKey: '1',
          dictValue: '国网xx供电公司本部/信息运检班/张三'
        }
      ], // todo i6000暂时手填
      yunweiCompaOptions: [
        {
          dictKey: '1',
          dictValue: 'XX公司1'
        }, {
          dictKey: '2',
          dictValue: 'XX公司2'
        }, {
          dictKey: '3',
          dictValue: 'XX公司23'
        }
      ], // todo i6000暂时手填
      jihuaHeaderOptions: [
        {
          dictKey: '1',
          dictValue: '国网xx供电公司本部/信息运检班/张三'
        }
      ], // todo i6000暂时手填
      jianguanCompaOptions: [
        {
          dictKey: '1',
          dictValue: 'XX公司1'
        }, {
          dictKey: '2',
          dictValue: 'XX公司2'
        }, {
          dictKey: '3',
          dictValue: 'XX公司23'
        }
      ], // todo i6000暂时手填
      shigongCompaOptions: [
        {
          dictKey: '1',
          dictValue: 'XX公司1'
        }, {
          dictKey: '2',
          dictValue: 'XX公司2'
        }, {
          dictKey: '3',
          dictValue: 'XX公司23'
        }
      ], // todo i6000暂时手填
      riskLevelOptions: [],
      riskOptions: [],
      selectDeviceList: [],
      roomArray: [],
      roomList: [],
      deviceTableInfo: [],
      statusTableInfo: [
        {
          datePlan: '2024-12-20',
          workerPlan: '张三',
          contentPlan: '计划提交'
        }, {
          datePlan: '2024-12-21',
          workerPlan: '李四',
          contentPlan: '计划审批：通过'
        }
      ],
      tableHeight: '441px',
      tableLoading: false,
      inputNumShow: 4,
      inputInterval: 10,
      dictForBastionHostProtocol: [],
      dictForBastionNetworkProtocol: [],
      saveLoading: false,
      position: ['山东', '济南', '市中'],
      planCode: ''
    }
  },
  filters: {
    truncateName(value) {
      if (!value) return '';
      return value.length > 5 ? value.slice(0, 5) + '...' : value;
    }
  },
  computed: {
    ...mapGetters(['userDetail']),
    getChildTitle() {
      return this.$route.query.childTitle
    }
  },
  watch: {
    'childDialogForm.type': {
      handler(newValue) {
        if (this.$route.query.code === null) {
          // 清空表单
          this.childDialogForm = {
            type: newValue,
            companyId: this.userDetail.ownerUnit,
            companyName: this.userDetail.ownerUnitName,
            companyRegionCode: this.userDetail.regionCode,
            deptId: this.userDetail.deptId,
            deptName: this.userDetail.deptName,
            mode: '1', // 默认远程作业
            pattern: '2', // 默认周计划
          }
          this.$nextTick(() => {
            // 清空验证
            this.$refs.childDialogForm.clearValidate()
          })
        }
      },
      immediate: true
    },
    selectDeviceList: {
      handler(newValue) {
        this.deviceTableInfo = []
        this.deviceTableInfo = newValue;
        if (this.childDialogForm.type === '2') {
          this.childDialogForm.software = newValue.map(item => item.deviceName).join(',');
        }
      },
      deep: true
    }
  },
  created() {
    this.isDetail()
    this.getInitTime()
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
    this.getDictList('info_object_type')
    this.getDictList('info_is_tongyi')
    this.getDictList('info_renwu_type_one')
    this.getDictList('info_work_risk_level')
    this.getDictList('info_bastion_server_type')
    this.getDictList('info_bastion_network_type')
    this.getPersonList()
    this.getRiskOptions()
    this.getRoomList()
  },
  mounted() {
    this.suffixName = this.$route.query.suffixName
    this.$nextTick(() => {
      this.setTableHeight()
      this.$refs.childDialogForm.$forceUpdate()
      this.$forceUpdate()
    })
  },
  methods: {
    /**
     * 获取工单跟踪预审批人员信息
     */
    getAdoptInfo() {
      try {
        queryTaskInfo(this.$route.query.code).then(res => {
          // 获取待提交的预审批人
          this.adoptInfo = res.data !== null ? (res.data.map(item => item.name).join('/')) : null
          // 处理审批追踪
          this.disposeAdopt()
        })
      } catch (error) {
        console.error('获取工单跟踪预审批人员信息报错:', error);
      }
    },
    /**
     * 处理审批追踪
     */
    disposeAdopt() {
      this.adoptTrail = []
      this.adoptActive = 0
      // 查找审批人
      if (this.childDialogForm.statusInfo >= 3) {
        this.childDialogForm.recordList.forEach(item => {
          if (item.content.includes('审批通过') || item.content.includes('驳回')) {
            this.adoptInfo = item.createUserName
            this.adoptTime = item.createTime
          }
        })
      }
      const steps = [
        { title: '填报', name: this.childDialogForm.createUserName, createTime: this.childDialogForm.createTime, icon: 'el-icon-document-add' },
        { title: '签发', name: this.adoptInfo, createTime: this.adoptTime, icon: 'el-icon-s-check' },
        { title: '终结', name: this.adoptInfo, createTime: this.adoptTime, icon: 'el-icon-finished' }
      ]
      this.adoptTrail.push(steps[0], steps[1], steps[2])
      if (this.childDialogForm.statusInfo >= 3) {
        this.adoptActive = 3
      } else {
        this.adoptActive = 1
      }
    },
    isDetail() {
      console.log('-------------=+++++++++++++++++获取编号前')
      console.log('-------------=+++++++++++++++++获取编号为', this.$route.query.code)
      console.log('-------------=+++++++++++++++++获取编号后')
      if (this.$route.query.code !== null) {
        getDetails(this.$route.query.code).then(res => {
          this.childDialogForm = res.data
          if (res && res.data !== null) {
            // 加载审批流
            this.getAdoptInfo()
            let rowData = res.data
            this.planCode = rowData.code
            this.childDialogForm.companyName = rowData.companyName
            this.childDialogForm.companyId = rowData.companyId
            this.childDialogForm.deptName = rowData.deptName
            this.childDialogForm.deptId = rowData.deptId
            this.childDialogForm.type = rowData.type.toString()
            this.authTime = [rowData.startTime, rowData.finishTime]
            this.childDialogForm.content = rowData.content
            this.deviceTableInfo = rowData.planDetailList.filter(detail => detail.detailType === 1).map(detail => {
              return {
                id: detail.objectId,
                deviceName: detail.objectName, // 设备名称
                deviceCategory: detail.ciLabel, // 资产类别
                deviceType: detail.type, // 设备类型
                IP: detail.device, // IP
                devicePort: detail.sort, // 远程端口
                deviceProtocol: detail.extAttr4, // 资产类型
                description: detail.description
              }
            })

            if (rowData.type.toString() === '1') {
              this.childDialogForm.mode = rowData.mode.toString()
              this.$set(this.childDialogForm, 'jobCategory', rowData.jobCategory)
              this.$set(this.childDialogForm, 'jobType', rowData.jobType)
              this.childDialogForm.header = rowData.header
              this.childDialogForm.headerId = rowData.headerId
              this.operatorArray = rowData.operatorId.split(',')
              this.childDialogForm.pattern = rowData.pattern.toString()
              this.childDialogForm.influenceScope = rowData.influenceScope
              this.childDialogForm.riskId = rowData.riskId.split(',')
              this.childDialogForm.riskContent = rowData.riskContent
              this.childDialogForm.keySolution = rowData.keySolution
              if (res.data.mode.toString() === '2') {
                this.roomArray = rowData.planDetailList.filter(detail => detail.detailType === 2)
              }
            } else if (rowData.type.toString() === '2') {
              this.childDialogForm.objectType = rowData.objectType
              this.childDialogForm.isTongyi = rowData.isTongyi
              this.childDialogForm.renwuType = rowData.renwuType
              this.childDialogForm.jiebieType = rowData.jiebieType
              this.childDialogForm.isTingyun = rowData.isTingyun
              this.childDialogForm.isImport = rowData.isImport
              this.childDialogForm.jianxiuCompa = rowData.jianxiuCompa
              this.childDialogForm.zhuguanDep = rowData.zhuguanDep
              this.childDialogForm.jianxiuZg = rowData.jianxiuZg
              this.childDialogForm.yunweiCompa = rowData.yunweiCompa
              this.childDialogForm.jihuaHeader = rowData.jihuaHeader
              this.childDialogForm.lianxiTel = rowData.lianxiTel
              this.childDialogForm.jianguanCompa = rowData.jianguanCompa
              this.childDialogForm.shigongCompa = rowData.shigongCompa
              this.childDialogForm.riskLevel = rowData.riskLevel.toString()
              this.position = []
              this.position.push(rowData.province)
              this.position.push(rowData.city)
              this.position.push(rowData.district)
              this.childDialogForm.totalUserCount = rowData.totalUserCount.toString()
              this.$set(this.childDialogForm, 'itSystem', rowData.itSystem)
              this.$set(this.childDialogForm, 'software', rowData.software)
              this.$set(this.childDialogForm, 'quexian', rowData.quexian)
            }
            this.childDialogForm.recordList = rowData.recordList.sort((a, b) => {
              const timeA = new Date(a.createTime)
              const timeB = new Date(b.createTime)
              return timeA - timeB
            })
          }
        }).catch((err) => {
          console.log(err, '编辑回显报错--------')
        })
      }
    },
    /**
     * 初始化检修时间 月计划默认下月一号  todo: 临时默认当天、周计划默认下周一
     */
    getInitTime() {
      const currenDate = new Date()
      let authYear = currenDate.getFullYear()
      let authMonth = currenDate.getMonth() === 11 ? 1 : currenDate.getMonth() + 1
      if (currenDate.getMonth() === 11) {
        authYear += 1
      }
      let startTime = authYear + '-' + authMonth + '-' + '01 ' + '08:30:00'
      let endTime = authYear + '-' + authMonth + '-' + '01 ' + '17:30:00'
      this.authTime[0] = startTime
      this.authTime[1] = endTime
    },
    /**
     * 加载下拉树 单位和部门
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
     * 加载字典
     * @param code
     */
    getDictList(code) {
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
        } else if (code === 'info_object_type') {
          this.objectTypeOptions = res.data
        } else if (code === 'info_is_tongyi') {
          this.isTongyiOptions = res.data
        } else if (code === 'info_renwu_type_one') {
          this.renwuTypeOptions = res.data
        }
          // todo 暂时写死i6000的字段，后期改为字典和联动
          // else if(code===''){
          //   this.jiebieTypeOptions = res.data
          // } else if(code===''){
          //   this.isTingyunOptions = res.data
          // } else if(code===''){
          //   this.isImportOptions = res.data
          // } else if(code===''){
          //   this.jianxiuCompaOptions = res.data
          // } else if(code===''){
          //   this.zhuguanDepOptions = res.data
          // } else if(code===''){
          //   this.jianxiuZgOptions = res.data
          // } else if(code===''){
          //   this.yunweiCompaOptions = res.data
          // } else if(code===''){
          //   this.jihuaHeaderOptions = res.data
          // } else if(code===''){
          //   this.jianguanCompaOptions = res.data
          // } else if(code===''){
          //   this.shigongCompaOptions = res.data
        // }
        else if (code === 'info_work_risk_level') {
          this.riskLevelOptions = res.data
        } else if (code === 'info_bastion_server_type') {
          this.dictForBastionHostProtocol = res.data
        } else if (code === 'info_bastion_network_type') {
          this.dictForBastionNetworkProtocol = res.data
        }
      })
    },
    /**
     * 字典回显
     * @param code
     * @param dictList
     * @returns {*}
     */
    conversionDict(code, dictList) {
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code)
        if (items != null && items.length > 0) {
          return items[0].dictValue
        }
      }
      return code
    },
    /**
     * 加载下拉 操作人
     */
    getPersonList() {
      getAllUsers().then(res => {
        this.personList = res.data
      })
    },
    /**
     * 处理操作人
     */
    syncOperator() {
      let nameList = []
      this.operatorArray.forEach(id => {
        let name = this.personList.find(person => person.id === id)
        if (name) {
          nameList.push(name.name)
        }
      })
      this.childDialogForm.operator = nameList.join(',')
      this.childDialogForm.operatorId = this.operatorArray.join(',')
    },
    /**
     * 加载下拉 风险管控卡
     */
    getRiskOptions() {
      const query = {
        pageNumber: 1,
        pageSize: 9999,
        companyRegionCode: this.userDetail.regionCode,
        statusInfo: 1
      }
      getRiskByPage(query).then(res => {
        this.riskOptions = res.data.records
      })
    },
    /**
     * 处理风险管控卡
     */
    syncRiskInfo() {
      this.riskPointsList = []
      this.measureList = []
      this.childDialogForm.riskId.forEach(riskId => {
        const riskElement = this.riskOptions.find(item => item.id === riskId)
        if (riskElement) {
          this.riskPointsList.push(riskElement.riskPoints)
          this.measureList.push(riskElement.measure)
        }
      })
      this.$set(this.childDialogForm, 'riskContent', this.riskPointsList.join('，'))
      this.$set(this.childDialogForm, 'keySolution', this.measureList.join('，'))
    },
    /**
     * 省市区下拉处理数据
     */
    syncPosition() {
      if (this.position.length > 0) {
        this.childDialogForm.province = this.position[0]
        this.childDialogForm.city = this.position[1]
        this.childDialogForm.district = this.position[2]
      }
    },
    /**
     * 加载下拉 机房
     */
    getRoomList() {
      getAllRoom(null).then(res => {
        this.roomList = res.data
      })
    },
    /**
     * 设备回填
     * @param selectedList
     */
    loadSelectedDeviceFunc(selectedList) {
      this.$refs.childDialogForm.clearValidate('deviceIds')
      this.selectDeviceList = selectedList
    },
    /**
     * 加载下拉 设备资产
     * @param deviceCategory
     */
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
    /**
     * 处理授权设备
     * @returns {boolean}
     */
    syncDevice() {
      this.childDialogForm.planDetailList = []
      try {
        // planId：计划编号 objectId：对象ID device：ip sort：端口 type：设备类型
        this.deviceTableInfo.forEach(device => {
          if (device.devicePort === undefined || device.devicePort === '') {
            this.$message({
              type: 'warning',
              message: device.IP + '端口号为空'
            });
            throw new Error()
          }
          if (device.deviceProtocol === undefined || device.deviceProtocol === '') {
            this.$message({
              type: 'warning',
              message: device.IP + '资产类型为空'
            });
            throw new Error()
          }
          let item = {
            mode: this.childDialogForm.mode,
            objectId: device.id,
            objectName: device.deviceName,
            device: device.IP,
            description: device.description,
            companyRegionCode: this.userDetail.regionCode,
            sort: device.devicePort,
            type: device.deviceType,
            extAttr1: device.deviceCategory === '主机设备' ? '0' : (device.deviceCategory === '网络设备' ? '1' : '2'),
            extAttr4: device.deviceProtocol
          }
          this.childDialogForm.planDetailList.push(item)
        })
      } catch (error) {
        return false
      }
      return true
    },
    /**
     * 处理授权机房
     */
    syncRoom() {
      this.childDialogForm.planDetailList = []
      this.roomArray.forEach(id => {
        let room = this.roomList.find(room => room.id === id)
        if (room) {
          let item = {
            mode: this.childDialogForm.mode,
            objectId: room.id,
            objectName: room.name,
            device: '',
            description: '',
            companyRegionCode: this.userDetail.regionCode,
            sort: '',
            type: ''
          }
          this.childDialogForm.planDetailList.push(item)
        }
      })
    },
    /**
     * 省市区下拉
     * @param e
     */
    addressChange(e) {
      this.position = e
    },
    /**
     * 保存提交
     */
    saveEvent(submitType) {
      this.$refs.childDialogForm.validate((valid) => {
        this.childDialogForm.createUserName = this.userDetail.userName
        this.childDialogForm.headerId = this.userDetail.userId // todo
        // 发起流程 0是保存，1是提交
        this.childDialogForm.isSumbit = submitType
        if (submitType === '1') {
          this.childDialogForm.deviceRecordDto = {
            processDefinitionKey: 'bpm_jxjh',
            approvalOpinion: '发起检修计划',
            type: 'JXJH'
          }
        }
        // 处理时间段
        this.childDialogForm.startTime = this.authTime === null ? null : this.authTime[0]
        this.childDialogForm.finishTime = this.authTime === null ? null : this.authTime[1]
        // 处理检修操作人信息
        this.syncOperator()
        // 处理风险管控卡
        this.childDialogForm.companyRegionCode = this.userDetail.regionCode
        this.childDialogForm.riskId = Array.isArray(this.childDialogForm.riskId) ? this.childDialogForm.riskId.join(',') : this.childDialogForm.riskId
        // 处理设备或机房
        if (this.childDialogForm.mode === '1') {
          if (!this.syncDevice()) {
            return
          }
        } else if (this.childDialogForm.mode === '2') {
          if (!this.syncRoom()) {
            return
          }
        }
        // 处理省市区数据
        if (this.childDialogForm.type === '2') {
          this.syncPosition()
        }
        console.log(this.childDialogForm, 'add+submit')
        // 当表单为编辑时，清空表单值放在save前；表单为新增时，清空表单用watch
        if (this.$route.query.code !== null) {
          if (this.childDialogForm.type === '1') {
            console.log('编辑页面开始清空关键字段-------')
            this.childDialogForm.objectType = null
            this.childDialogForm.isTongyi = null
            this.childDialogForm.renwuType = null
            this.childDialogForm.jiebieType = null
            this.childDialogForm.isTingyun = null
            this.childDialogForm.isImport = null
            this.childDialogForm.jianxiuCompa = null
            this.childDialogForm.zhuguanDep = null
            this.childDialogForm.jianxiuZg = null
            this.childDialogForm.yunweiCompa = null
            this.childDialogForm.jihuaHeader = null
            this.childDialogForm.lianxiTel = null
            this.childDialogForm.jianguanCompa = null
            this.childDialogForm.shigongCompa = null
            this.childDialogForm.riskLevel = null
            this.childDialogForm.province = null
            this.childDialogForm.city = null
            this.childDialogForm.district = null
            this.childDialogForm.totalUserCount = null
            this.childDialogForm.itSystem = null
            this.childDialogForm.quexian = null
          } else if (this.childDialogForm.type === '2') {
            console.log('编辑页面开始清空常规字段-------')
            this.childDialogForm.mode = null
            this.childDialogForm.header = null
            this.childDialogForm.headerId = null
            this.operatorArray = []
            this.childDialogForm.operatorId = null
            this.childDialogForm.pattern = null
            this.childDialogForm.influenceScope = null
            this.childDialogForm.riskId = null
            this.childDialogForm.riskContent = null
            this.childDialogForm.keySolution = null
            this.roomArray = []
          }
        }
        // 表单后台校验
        if (valid) {
          this.saveLoading = true
          insertRepair(this.childDialogForm).then(() => {
            this.saveLoading = false
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
            document.querySelectorAll('*[id^="tab-/xcnanr/repairPlan' + this.suffixName + '"]')[0].childNodes[1].click()
            this.$router.push('/xcnanr/operationPlan/repairPlan/index')
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    },
    /**
     * 关闭页面并跳转
     */
    cancelEvent() {
      document.querySelectorAll('*[id^="tab-/xcnanr/repairPlan' + this.suffixName + '"]')[0].childNodes[1].click()
      this.$router.push('/xcnanr/operationPlan/repairPlan/index')
    },
    /**
     * 设置表格高度
     */
    setTableHeight(item) {
      if (item !== undefined) {
        this.tableHeight += item.height // 每次更新累加描述项高度
      }
    },
    /**
     * 选择事件
     * @param selection
     */
    selectionChange(selection) {
      this.selectionList = selection.map(item => item.id)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep(.xt_card_xc) {
  padding: 45px 170px 45px 170px;
  background: #FFF;
  border-radius: 5px;
  margin: 5px auto;
  width: 1300px;
}
::v-deep(.self-input-textarea) {
  margin-bottom: 74px !important;
}

::v-deep(.self-select-button-ad) {
  float: right;
  margin: -32px -46px 0 0 !important;
}
::v-deep(.self-row-bg) {
  padding: 0 0 0 30px;
}
::v-deep(.el-textarea__inner){
  resize: none !important;
}
::v-deep(.el-textarea .el-input__count){
  background: #e0f3ff10 !important;
}
::v-deep(.el-input .el-input__count .el-input__count-inner){
  background: #e0f3ff10 !important;
}
</style>
