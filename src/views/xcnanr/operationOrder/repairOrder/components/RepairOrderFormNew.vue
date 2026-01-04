<!--<template>-->
<!--  <basic-container>-->
<!--    &lt;!&ndash; 面包屑 &ndash;&gt;-->
<!--    <breadcrumb path="/xcnanr/operationOrder/repairOrder/index" master-title="检修工单" :child-title="$route.query.type === 'Add' ? '新增' : '编辑'" />-->
<!--    &lt;!&ndash; 表单（新增、编辑、详情、变更、审批、终结页面通用） &ndash;&gt;-->
<!--    <el-form ref="dialogForm" class="xt_form" :model="childDialogForm" :rules="topRules" inline label-suffix=":" size="small" label-width="160px" v-loading="pageLoading" style="width: 1300px;margin: auto auto 40px auto;">-->
<!--      <el-row>-->
<!--        <el-col :span="24">-->
<!--          &lt;!&ndash; 检修类型(1：常规检修2：i6000检修)&ndash;&gt;-->
<!--          <el-form-item label="检修类型" prop="type">-->
<!--            <el-radio v-model="childDialogForm.type" v-for="item in typeOptions" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="24">-->
<!--          <el-form-item label="关联检修计划" prop="planId">-->
<!--            <el-select v-model="childDialogForm.planId" filterable placeholder="请选择检修计划" style="width: 1040px" @change="syncData">-->
<!--              <el-option v-for="item in repairPlan" :key="item.id" :label="item.code+'/'+item.content" :value="item.code" />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="公司" prop="companyId">-->
<!--            <xt-tree-lzay-select :formValue="childDialogForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getItem(v, 'CORP')" style="width: 390px" disabled/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="部门" prop="deptId">-->
<!--            <xt-tree-lzay-select :formValue="childDialogForm.deptName" :unit-id="childDialogForm.companyId" :disabled="!childDialogForm.companyId" :selectType="'DEPT'" @getTreeItem="(v)=>getItem(v,'DEPT')" style="width: 390px" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="检修负责人" prop="header">-->
<!--            <el-input v-model="childDialogForm.header" clearable placeholder="请输入检修负责人" :maxlength="30" show-word-limit style="width: 390px" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="负责人电话" prop="headerTel">-->
<!--            <el-input v-model="childDialogForm.headerTel" clearable placeholder="请输入检修负责人电话" :maxlength="11" show-word-limit style="width: 390px" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="检修操作人" prop="operatorList">-->
<!--            <div class="select-with-button">-->
<!--              <el-select v-model="childDialogForm.operatorList" multiple filterable clearable collapse-tags placeholder="请选择检修操作人" style="width: 344px">-->
<!--                <el-option v-for="item in authorizedPersonList" :key="item.name" :label="item.name + ' / ' + item.companyName" :value="item.id" />-->
<!--              </el-select>-->
<!--              <el-button class="select-button-ad" title="新增被授权人员" icon="el-icon-user" @click="addWorker"></el-button>-->
<!--            </div>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="作业总人数" prop="totalUserCount">-->
<!--            <el-input-number v-model="childDialogForm.totalUserCount" clearable placeholder="请输入作业总人数" :precision="0" :step="1" :min="0" :max="99999" style="width: 390px" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="24" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="检修时间段" prop="dataTime">-->
<!--            <el-date-picker v-model="childDialogForm.dataTime" class="filter-item" :type="'datetimerange'" :picker-options="pickerOptions" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['08:30:00', '17:30:00']" align="right" clearable @change="$forceUpdate()" style="width: 1040px" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '1'">-->
<!--          <el-form-item label="检修时间段" prop="dataTime">-->
<!--            <el-date-picker v-model="childDialogForm.dataTime" class="filter-item" :type="'datetimerange'" :picker-options="pickerOptions" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['08:30:00', '17:30:00']" align="right" clearable style="width: 390px;" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '1'">-->
<!--          <el-form-item label="检修类别" prop="mode">-->
<!--            <el-select v-model="childDialogForm.mode" clearable placeholder="请选择检修类别" style="width: 390px">-->
<!--              <el-option v-for="dict in modeOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '1'">-->
<!--          &lt;!&ndash; 工作类别 &ndash;&gt;-->
<!--          <el-form-item label="工作类别" prop="jobCategory">-->
<!--            <el-select v-model="childDialogForm.jobCategory" clearable placeholder="请选择工作类别" @change="loadJobTypeOptions" style="width: 390px">-->
<!--              <el-option v-for="dict in jobCategoryOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '1'">-->
<!--          &lt;!&ndash; 作业类型 &ndash;&gt;-->
<!--          <el-form-item label="作业类型" prop="jobType">-->
<!--            <el-select v-model="childDialogForm.jobType" clearable placeholder="请选择作业类型" style="width: 390px">-->
<!--              <el-option v-for="dict in jobTypeAllOptions[childDialogForm.jobCategory]" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="24" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="检修内容" prop="content">-->
<!--            <el-input v-model="childDialogForm.content" autosize clearable placeholder="请输入检修内容" type="textarea" :rows="2" :maxlength="300" show-word-limit style="width: 1040px;" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="24" v-if="childDialogForm.type === '1'" style="height: 100%;">-->
<!--          <el-form-item label="检修内容" prop="content">-->
<!--            <el-input v-model="childDialogForm.content" clearable placeholder="请输入检修内容" type="textarea" :rows="2" :maxlength="300" show-word-limit style="width: 1040px;" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '1'">-->
<!--          <el-form-item label="风险管控卡" prop="risk">-->
<!--            <el-select v-model="childDialogForm.risk" multiple filterable collapse-tags placeholder="请选择风险管控卡" style="width: 390px" @change="syncRiskInfo">-->
<!--              <el-option v-for="item in riskOptions" :key="item.id" :label="item.name" :value="item.id" />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="24" v-if="childDialogForm.type === '1'">-->
<!--          <el-form-item label="危险点分析" prop="riskContent">-->
<!--            <el-input v-model="childDialogForm.riskContent" clearable placeholder="请输入危险点分析" type="textarea" :rows="4" :maxlength="500" show-word-limit style="width: 1040px" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="24" v-if="childDialogForm.type === '1'">-->
<!--          <div class="sy-solution">-->
<!--            <el-form-item label="关键措施" prop="keySolution">-->
<!--              <el-input v-model="childDialogForm.keySolution" clearable placeholder="请输入关键措施" type="textarea" :rows="4" :maxlength="500" show-word-limit style="width: 1040px" />-->
<!--            </el-form-item>-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="风险作业等级" prop="riskLevel">-->
<!--            <el-select v-model="childDialogForm.riskLevel" filterable clearable placeholder="请选择作业风险等级" style="width: 390px">-->
<!--              <el-option v-for="item in workRiskLevel" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="作业地点" prop="address">-->
<!--            <PcdSelect v-if="addressDisplay" @addressChange="addressChange" :default-address="address" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="主办单位人数" prop="mainUserCount">-->
<!--            <el-input-number v-model="childDialogForm.mainUserCount" clearable placeholder="请输入主办单位人数" :precision="0" :step="1" :min="0" :max="99999" style="width: 390px" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="产业单位人数" prop="attachUserCount">-->
<!--            <el-input-number v-model="childDialogForm.attachUserCount" clearable placeholder="请输入产业单位人数" :precision="0" :step="1" :min="0" :max="99999" style="width: 390px" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="外包单位人数" prop="otherUserCount">-->
<!--            <el-input-number v-model="childDialogForm.otherUserCount" clearable placeholder="请输入外包单位人数" :precision="0" :step="1" :min="0" :max="99999" style="width: 390px" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="作业组织(建管)单位" prop="orgCompany">-->
<!--            <el-input v-model="childDialogForm.orgCompany" clearable placeholder="请输入作业组织单位" :maxlength="30" show-word-limit style="width: 390px" />-->
<!--            &lt;!&ndash;                <el-checkbox v-model="childDialogForm.content" style="margin-left: 5px">其他</el-checkbox>&ndash;&gt;-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="作业实施(施工)单位" prop="constructCompany">-->
<!--            <el-input v-model="childDialogForm.constructCompany" clearable placeholder="请输入作业实施单位" :maxlength="30" show-word-limit style="width: 390px" />-->
<!--            &lt;!&ndash;                <el-checkbox v-model="childDialogForm.content" style="margin-left: 5px">其他</el-checkbox>&ndash;&gt;-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="工作类别" prop="workType">-->
<!--            <el-select v-model="childDialogForm.workType" filterable clearable placeholder="请选择工作类别" style="width: 390px">-->
<!--              <el-option v-for="item in workCategory" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="工作方式" prop="workMode">-->
<!--            <el-select v-model="childDialogForm.workMode" filterable clearable placeholder="请选择工作方式" style="width: 390px">-->
<!--              <el-option v-for="item in workWay" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="工作场所名称" prop="position">-->
<!--            <el-input v-model="childDialogForm.position" clearable placeholder="请输入工作场所名称" :maxlength="30" show-word-limit style="width: 390px" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="本次操作系统信息" prop="itSystem">-->
<!--            <el-input v-model="childDialogForm.itSystem" clearable placeholder="请输入本次操作系统信息" :maxlength="300" show-word-limit style="width: 390px" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="涉及方式资源申请" prop="isApplyResource">-->
<!--            <el-radio v-model="childDialogForm.isApplyResource" :label="'1'">是</el-radio>-->
<!--            <el-radio v-model="childDialogForm.isApplyResource" :label="'0'">否</el-radio>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="24" v-if="childDialogForm.type === '2'">-->
<!--          <el-form-item label="涉及设备/软件" prop="software">-->
<!--            <el-input v-model="childDialogForm.software" clearable disabled placeholder="请选择本次操作涉及设备/软件" style="width: 945px" />-->
<!--          </el-form-item>-->
<!--          <el-button style="margin-left: 5px" type="primary" @click="openDevice">选择设备</el-button>-->
<!--        </el-col>-->
<!--        &lt;!&ndash; 检修场所 &ndash;&gt;-->
<!--        <el-form-item label="检修场所" prop="room" v-if="childDialogForm.mode === '2'">-->
<!--          <el-select v-model="childDialogForm.room" clearable multiple filterable collapse-tags placeholder="请选择需要授权的机房" style="width: 390px;margin-left: 12px" @change="$forceUpdate()">-->
<!--            <el-option v-for="room in roomList" :key="room.id" :label="room.name + ' / ' + room.companyName" :value="room.id"/>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item style="margin-top: 15px;" label="检修对象" prop="repairObjects">-->
<!--          <el-button style="position: relative; left: 3px; padding: 3px 5px" type="primary" @click="openDevice">选择设备</el-button>-->
<!--          <div v-if="childDialogForm.mode === '2'" style="width: 500px;margin-left: 6px;display: inline;vertical-align: bottom;">-->
<!--            若设备台账中未找到，可<span style="color: #409eff;cursor: pointer" @click="addOtherDevices"><em>点击此处</em></span>补充检修设备-->
<!--          </div>-->
<!--          <div class="text item page_body">-->
<!--            <el-table ref="deviceTableInfo" :data="deviceTableInfo" v-loading="tableLoading" style="width: 1040px"  max-height="430px">-->
<!--              <el-table-column label="设备名称" prop="deviceName" :width="childDialogForm.mode === '1' ? 220 : 400" align="center" show-overflow-tooltip>-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-if="scope.row.deviceCategory === '其它'" v-model="scope.row.deviceName" placeholder="请输入设备名称" />-->
<!--                  <span v-else>{{ '[' + scope.row.deviceCategory + '] ' + scope.row.deviceName }}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column v-if="childDialogForm.mode === '1'" label="IP" prop="ip" width="120" align="center" show-overflow-tooltip/>-->
<!--              <el-table-column v-if="childDialogForm.mode === '1'" label="设备类型" prop="deviceType" width="150" align="center" show-overflow-tooltip/>-->
<!--              <el-table-column v-if="childDialogForm.mode === '1'" label="远程端口" prop="devicePort" width="220" align="center" show-overflow-tooltip>-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input-number v-model="scope.row.devicePort" placeholder="请输入" :min="1" :max="65535" :precision="0" :step="1" />-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column v-if="childDialogForm.mode === '1'" label="资产类型" prop="deviceProtocol" width="161" align="center" show-overflow-tooltip>-->
<!--                <template slot-scope="scope">-->
<!--                  <el-select v-model="scope.row.deviceProtocol" placeholder="请选择资产类型" style="width: 151px">-->
<!--                    <el-option v-for="dict in getDeviceTypeListFunc(scope.row.deviceCategory)" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"/>-->
<!--                  </el-select>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column label="描述" prop="description" :width="childDialogForm.mode === '1' ? 300 : 550" align="center" show-overflow-tooltip>-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model="scope.row.description" placeholder="请输入描述" :maxlength="100" show-word-limit />-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column label="操作" align="center" width="88" show-overflow-tooltip>-->
<!--                <template slot-scope="scope">-->
<!--                  <el-button type="text" size="mini" @click="removeDevice(scope.row)">移除</el-button>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </el-table>-->
<!--          </div>-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash; 底边按钮 &ndash;&gt;-->
<!--        <el-col :span="24">-->
<!--          <el-form-item style="margin-top: 40px;display: flex; justify-content: center; align-items: center">-->
<!--            <el-button type="primary" size="small" @click="submitEvent(false)" :loading="saveLoading">保存</el-button>-->
<!--            <el-button size="small" @click="returnEvent">返回</el-button>-->
<!--            <el-button type="primary" size="small" @click="submitEvent(true)" :loading="saveLoading">提交</el-button>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </el-form>-->
<!--    &lt;!&ndash; 弹层 新增检修操作人 &ndash;&gt;-->
<!--    <add-worker-dialog v-if="grandsonDialogFlag" :grandson-dialog-flag.sync="grandsonDialogFlag"/>-->
<!--    &lt;!&ndash; 弹层 设备列表&ndash;&gt;-->
<!--    <device-dialog v-if="deviceDialogFlag" :dialog-flag="deviceDialogFlag" title="检修" :auth-device-type-list="distForAuthDeviceType" @closeDialog="closeDialogFunc" @submitDialog="loadSelectedDeviceFunc"/>-->
<!--  </basic-container>-->
<!--</template>-->

<!--<script>-->
<!--import { mapGetters } from 'vuex'-->
<!--import { getDictList } from '@/api/dict'-->
<!--import Breadcrumb from '../../../components/Breadcrumb'-->
<!--import XtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'-->
<!--import { getAll } from '@/api/xcnanr/authorizedPerson'-->
<!--import AddWorkerDialog from '@/views/xcnanr/operationPlan/repairPlan/AddWorkerDialog.vue'-->
<!--import { getRiskByPage } from '@/api/xcnanr/repair'-->
<!--import PcdSelect from '@/views/xcnanr/operationOrder/repairOrder/components/pcdSelect.vue'-->
<!--import { getAllRoom } from '@/api/xcnanr/room'-->
<!--import { addOrUpdateRepairOrder, getRepairPlanList,getByPageInit } from '@/api/xcnanr/repairOrder'-->
<!--import { getDetails } from '@/api/xcnanr/repairPlan'-->

<!--export default {-->
<!--  name: 'RepairOrderFormNew',-->
<!--  components: { Breadcrumb, DeviceDialog, AddWorkerDialog, XtTreeLzaySelect, PcdSelect },-->
<!--  props: {},-->
<!--  data() {-->
<!--    const verifyDeviceIds = (rule, value, callback) => {-->
<!--      if(this.childDialogForm.type === '1' && this.childDialogForm.mode === '1') {-->
<!--        if (this.deviceTableInfo === undefined || this.deviceTableInfo.length === 0) {-->
<!--          callback(new Error('检修对象不能为空'))-->
<!--        } else {-->
<!--          let errStr = null-->
<!--          for (const item of this.deviceTableInfo) {-->
<!--            if (!item.devicePort || item.devicePort + '' === '0') {-->
<!--              errStr = '远程端口不能为空'-->
<!--              break-->
<!--            } else if (!item.deviceProtocol) {-->
<!--              errStr = '资产类型不能为空'-->
<!--              break-->
<!--            } else if (!item.description || !item.description.trim()) {-->
<!--              errStr = '描述不能为空'-->
<!--              break-->
<!--            }-->
<!--          }-->
<!--          errStr ? callback(new Error(errStr)) : callback()-->
<!--        }-->
<!--      } else {-->
<!--        callback()-->
<!--      }-->
<!--    }-->
<!--    const verifyPosition = (rule, value, callback) => {-->
<!--      if (this.childDialogForm.type === '2' && (!this.childDialogForm.province || !this.childDialogForm.city || !this.childDialogForm.district)) {-->
<!--        callback(new Error('作业地点不能为空'))-->
<!--      } else {-->
<!--        callback()-->
<!--      }-->
<!--    }-->
<!--    return {-->
<!--      permissions: 'yes',-->
<!--      userDetail: this.$store.state.user.userDetail,-->
<!--      deviceDialogFlag: false,-->
<!--      distForAuthDeviceType: [],-->
<!--      selectDeviceList: [],-->
<!--      roomList: [],-->
<!--      deviceTableInfo: [],-->
<!--      authTime: [],-->
<!--      pickerOptions: {-->
<!--        // 禁止选择过去时间-->
<!--        disabledDate: (time) => {-->
<!--          const curTime = new Date();-->
<!--          curTime.setHours(0, 0, 0, 0);-->
<!--          return time.getTime() < curTime;-->
<!--        },-->
<!--        shortcuts: [{-->
<!--          text: '最近一周',-->
<!--          onClick(picker) {-->
<!--            const start = new Date();-->
<!--            const end = new Date();-->
<!--            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);-->
<!--            picker.$emit('pick', [start, end]);-->
<!--          }-->
<!--        }, {-->
<!--          text: '最近一个月',-->
<!--          onClick(picker) {-->
<!--            const start = new Date();-->
<!--            const end = new Date();-->
<!--            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);-->
<!--            picker.$emit('pick', [start, end]);-->
<!--          }-->
<!--        }, {-->
<!--          text: '最近三个月',-->
<!--          onClick(picker) {-->
<!--            const start = new Date();-->
<!--            const end = new Date();-->
<!--            end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);-->
<!--            picker.$emit('pick', [start, end]);-->
<!--          }-->
<!--        }]-->
<!--      },-->
<!--      childDialogForm: { risk: '', riskId: '', riskContent: '', keySolution: '', type: '1', jobCategory: '', jobType: '', mode: '1', isApplyResource: '1', room:[] },-->
<!--      patternOptions: [],-->
<!--      typeOptions: [],-->
<!--      address: [], addressDisplay: true,-->
<!--      modeOptions: [],-->
<!--      jobCategoryOptions: [],-->
<!--      jobTypeAllOptions: {},-->
<!--      riskOptions: [],-->
<!--      statusInfoOptions: [],-->
<!--      planDetailList: [],-->
<!--      repairObjects: [],-->
<!--      topRules: {-->
<!--        companyId: [-->
<!--          {required: true, message: '公司不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        deptId: [-->
<!--          {required: true, message: '部门不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        headerTel: [{ pattern: /^[0-9]*$/, message: '请输入有效号码', trigger: 'blur'}],-->
<!--        totalUserCount: [{ pattern: /^[0-9]*$/, message: '请输入有效数字', trigger: 'blur'}],-->
<!--        mainUserCount: [{ pattern: /^[0-9]*$/, message: '请输入有效数字', trigger: 'blur'}],-->
<!--        attachUserCount: [{ pattern: /^[0-9]*$/, message: '请输入有效数字', trigger: 'blur'}],-->
<!--        otherUserCount: [{ pattern: /^[0-9]*$/, message: '请输入有效数字', trigger: 'blur'}],-->
<!--        type: [-->
<!--          {required: true, message: '检修类型不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        mode: [-->
<!--          {required: true, message: '检修类别不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        header: [-->
<!--          {required: true, message: '检修负责人不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        operatorList: [-->
<!--          {required: true, message: '检修操作人不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        pattern: [-->
<!--          {required: true, message: '计划类型不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        dataTime: [-->
<!--          {required: true, message: '计划检修时间不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        content: [-->
<!--          {required: true, message: '检修内容不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        riskLevel: [-->
<!--          {required: true, message: '作业风险等级不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        address: [-->
<!--          {required: true, validator: verifyPosition, trigger: 'change'}-->
<!--        ],-->
<!--        orgCompany: [-->
<!--          {required: true, message: '作业组织单位不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        constructCompany: [-->
<!--          {required: true, message: '作业施工单位不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        workType: [-->
<!--          {required: true, message: '工作类别不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        workMode: [-->
<!--          {required: true, message: '工作方式不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        position: [-->
<!--          {required: true, message: '工作场所不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        isApplyResource: [-->
<!--          {required: true, message: '涉及方式资源申请不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        riskContent: [-->
<!--          {required: true, message: '危险点分析不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        keySolution: [-->
<!--          {required: true, message: '关键措施不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        room: [-->
<!--          {required: true, message: '检修场所不能为空', trigger: 'blur'}-->
<!--        ],-->
<!--        repairObjects: [-->
<!--          {required: true, validator: verifyDeviceIds, trigger: 'change'}-->
<!--        ]-->
<!--      },-->
<!--      pageLoading: false,-->
<!--      saveLoading: false,-->
<!--      tableLoading: false,-->
<!--      repairPlan: [],-->
<!--      personList: [],-->
<!--      grandsonDialogFlag: false,-->
<!--      riskPointsList: [],-->
<!--      measureList: [],-->
<!--      workRiskLevel: [],-->
<!--      workWay: [],-->
<!--      workCategory: [],-->
<!--      inputNumShow: 4,-->
<!--      inputInterval: 10,-->
<!--      dictForBastionHostProtocol: [],-->
<!--      dictForBastionNetworkProtocol: [],-->
<!--      authorizedPersonList: []-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    ...mapGetters(['userDetail'])-->
<!--  },-->
<!--  watch: {-->
<!--    'childDialogForm.type': {-->
<!--      handler(newValue) {-->
<!--        this.repairPlan = []-->
<!--        this.getRepairPlan(newValue)-->
<!--        // 清空表单-->
<!--        this.childDialogForm = {-->
<!--          type: newValue,-->
<!--          companyId: this.userDetail.ownerUnit,-->
<!--          companyName: this.userDetail.ownerUnitName,-->
<!--          companyRegionCode: this.userDetail.regionCode,-->
<!--          deptId: this.userDetail.deptId,-->
<!--          deptName: this.userDetail.deptName,-->
<!--          mode: newValue === '1' ? '1' : 0, // 默认远程作业-->
<!--          pattern: '2', // 默认周计划-->
<!--        }-->
<!--        // 清空表单校验-->
<!--        this.$nextTick(() => {-->
<!--          this.$refs.dialogForm.clearValidate()-->
<!--        })-->
<!--      },-->
<!--      immediate: true-->
<!--    },-->
<!--    'childDialogForm.companyId': {-->
<!--      handler() {-->
<!--        this.getAuthorizedPerson()-->
<!--      },-->
<!--      deep: true-->
<!--    },-->
<!--    'childDialogForm.mode': {-->
<!--      handler() {-->
<!--        this.$nextTick(() => {-->
<!--          // 清空验证-->
<!--          this.$refs.dialogForm.clearValidate()-->
<!--        })-->
<!--      },-->
<!--      immediate: true-->
<!--    },-->
<!--    'childDialogForm.jobCategory': {-->
<!--      handler() {-->
<!--        // 获取风险管控卡-->
<!--        this.getRiskOptions()-->
<!--      },-->
<!--      immediate: true-->
<!--    },-->
<!--    'childDialogForm.jobType': {-->
<!--      handler() {-->
<!--        // 获取风险管控卡-->
<!--        this.getRiskOptions()-->
<!--      },-->
<!--      immediate: true-->
<!--    },-->
<!--    selectDeviceList: {-->
<!--      handler(newValue) {-->
<!--        this.deviceTableInfo = []-->
<!--        this.deviceTableInfo = newValue.map(item => {-->
<!--          item['ip'] = item['IP']-->
<!--          return item-->
<!--        })-->
<!--        if (this.childDialogForm.type === '2') {-->
<!--          this.childDialogForm.software = newValue.map(item => item.deviceName).join(',')-->
<!--        }-->
<!--      },-->
<!--      deep: true-->
<!--    },-->
<!--    deviceTableInfo:{-->
<!--      handler(newValue){-->
<!--        if (this.childDialogForm.type === '2') {-->
<!--          this.childDialogForm.software = newValue.map(item => item.deviceName).join(',');-->
<!--        }-->
<!--      }-->
<!--    },-->
<!--  },-->
<!--  created() {-->
<!--    this.getDictList('info_repair_plan_pattern')-->
<!--    this.getDictList('info_repair_plan_type')-->
<!--    this.getDictList('info_repair_plan_mode')-->
<!--    this.getDictList('info_job_category')-->
<!--    this.getDictList('info_power_air_system')-->
<!--    this.getDictList('info_cloud_platform_virtual_pool')-->
<!--    this.getDictList('info_host_storage_device')-->
<!--    this.getDictList('info_core_network_device')-->
<!--    this.getDictList('info_safe_device')-->
<!--    this.getDictList('info_apply_software')-->
<!--    this.getDictList('info_basic_environment')-->
<!--    this.getDictList('info_fire_fighting_system')-->
<!--    this.getDictList('info_cabling_system')-->
<!--    this.getDictList('info_plan_status')-->
<!--    this.getDictList('info_device_send_bastion_type')-->
<!--    this.getDictList('info_work_risk_level')-->
<!--    this.getDictList('info_work_way')-->
<!--    this.getDictList('info_work_category')-->
<!--    this.getDictList('info_bastion_server_type')-->
<!--    this.getDictList('info_bastion_network_type')-->
<!--    this.getAuthorizedPerson()-->
<!--    this.getRoomList()-->
<!--    this.getAuth()-->
<!--  },-->
<!--  mounted() {},-->
<!--  methods: {-->
<!--    addOtherDevices() {-->
<!--      this.deviceTableInfo.push({-->
<!--        id: null, // 详情ID-->
<!--        planId: this.childDialogForm.planId ? this.childDialogForm.planId : null, // 计划编号-->
<!--        mode: this.childDialogForm.mode,-->
<!--        deviceName: '',-->
<!--        description: '',-->
<!--        deviceCategory: '其它',// 0主机，1网络，2其它-->
<!--        companyRegionCode: this.userDetail.regionCode-->
<!--      })-->
<!--    },-->
<!--    /**-->
<!--     * 初始权限-->
<!--     */-->
<!--    getAuth(){-->
<!--      getByPageInit().then(res=>{-->
<!--        this.permissions = res.data-->
<!--      })-->
<!--    },-->
<!--    /**-->
<!--     * 加载字典-->
<!--     * @param code-->
<!--     */-->
<!--    getDictList(code) {-->
<!--      //加载字典-->
<!--      getDictList(code).then(res => {-->
<!--        if (code === 'info_repair_plan_pattern') {-->
<!--          this.patternOptions = res.data-->
<!--        } else if (code === 'info_repair_plan_type') {-->
<!--          this.typeOptions = res.data-->
<!--        } else if (code === 'info_repair_plan_mode') {-->
<!--          this.modeOptions = res.data-->
<!--        } else if (code === 'info_job_category') {-->
<!--          this.jobCategoryOptions = res.data-->
<!--        } else if (code === 'info_power_air_system') {-->
<!--          this.jobTypeAllOptions['info_power_air_system'] = res.data-->
<!--        } else if (code === 'info_cloud_platform_virtual_pool') {-->
<!--          this.jobTypeAllOptions['info_cloud_platform_virtual_pool'] = res.data-->
<!--        } else if (code === 'info_host_storage_device') {-->
<!--          this.jobTypeAllOptions['info_host_storage_device'] = res.data-->
<!--        } else if (code === 'info_core_network_device') {-->
<!--          this.jobTypeAllOptions['info_core_network_device'] = res.data-->
<!--        } else if (code === 'info_safe_device') {-->
<!--          this.jobTypeAllOptions['info_safe_device'] = res.data-->
<!--        } else if (code === 'info_apply_software') {-->
<!--          this.jobTypeAllOptions['info_apply_software'] = res.data-->
<!--        } else if (code === 'info_basic_environment') {-->
<!--          this.jobTypeAllOptions['info_basic_environment'] = res.data-->
<!--        } else if (code === 'info_fire_fighting_system') {-->
<!--          this.jobTypeAllOptions['info_fire_fighting_system'] = res.data-->
<!--        } else if (code === 'info_cabling_system') {-->
<!--          this.jobTypeAllOptions['info_cabling_system'] = res.data-->
<!--        } else if (code === 'info_plan_status') {-->
<!--          this.statusInfoOptions = res.data-->
<!--        } else if (code === 'info_device_send_bastion_type') {-->
<!--          this.distForAuthDeviceType = res.data-->
<!--        } else if (code === 'info_work_risk_level') {-->
<!--          this.workRiskLevel = res.data-->
<!--        } else if (code === 'info_work_way') {-->
<!--          this.workWay = res.data-->
<!--        } else if (code === 'info_work_category') {-->
<!--          this.workCategory = res.data-->
<!--        } else if (code === 'info_bastion_server_type') {-->
<!--          this.dictForBastionHostProtocol = res.data-->
<!--        } else if (code === 'info_bastion_network_type') {-->
<!--          this.dictForBastionNetworkProtocol = res.data-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    /**-->
<!--     * 提交事件-->
<!--     */-->
<!--    submitEvent(flag) {-->
<!--      if(this.permissions === 'no') {-->
<!--        this.$message({-->
<!--          type: 'warning',-->
<!--          message: '您没有流程引擎提交权限'-->
<!--        })-->
<!--        return-->
<!--      }-->
<!--      if (flag === true) {-->
<!--        this.$confirm('您确认要发起流程吗', '提示', {-->
<!--          confirmButtonText: '确定',-->
<!--          cancelButtonText: '取消',-->
<!--          type: 'warning'-->
<!--        }).then(() => {-->
<!--          this.childDialogForm.isSubmit = '1'-->
<!--          this.saveEvent()-->
<!--        }).catch(() => {-->
<!--        })-->
<!--      } else {-->
<!--        this.childDialogForm.isSubmit = '0'-->
<!--        this.saveEvent()-->
<!--      }-->
<!--    },-->
<!--    /**-->
<!--     * 关闭设备弹层-->
<!--     */-->
<!--    closeDialogFunc() {-->
<!--      this.deviceDialogFlag = false-->
<!--    },-->
<!--    /**-->
<!--     * 页面返回-->
<!--     */-->
<!--    returnEvent() {-->
<!--      this.$router.push({-->
<!--        path: '/xcnanr/repairOrder'-->
<!--      })-->
<!--    },-->
<!--    /**-->
<!--     * 获取机房列表-->
<!--     */-->
<!--    getRoomList() {-->
<!--      // 获取机房下拉数据-->
<!--      getAllRoom(null).then(res => {-->
<!--        this.roomList = res.data-->
<!--      })-->
<!--    },-->
<!--    /**-->
<!--     * 设备列表提交-->
<!--     * @param selectedList-->
<!--     */-->
<!--    loadSelectedDeviceFunc(selectedList) {-->
<!--      // 一体化正式环境用的是fullName 标准全称-->
<!--      selectedList = selectedList.map(d => {-->
<!--        d.deviceName = (!d.fullName ? (!d.deviceName ? '<未命名设备>' : d.deviceName) : d.fullName)-->
<!--        return d-->
<!--      })-->
<!--      this.selectDeviceList = selectedList-->
<!--    },-->
<!--    /**-->
<!--     * 打开设备列表-->
<!--     */-->
<!--    openDevice() {-->
<!--      this.deviceDialogFlag = true-->
<!--    },-->
<!--    /**-->
<!--     * 移除设备-->
<!--     */-->
<!--    removeDevice(row) {-->
<!--      const index = this.deviceTableInfo.findIndex(device => device.id === row.id);-->
<!--      if (index !== -1) {-->
<!--        this.deviceTableInfo.splice(index, 1);-->
<!--      }-->
<!--    },-->
<!--    /**-->
<!--     * 被授权人员下拉-->
<!--     */-->
<!--    getAuthorizedPerson() {-->
<!--      const companyId = (this.childDialogForm.companyId) ? this.childDialogForm.companyId : this.userDetail.ownerUnit-->
<!--      this.authorizedPersonList = []-->
<!--      getAll({enabled: 1, companyId: companyId}).then(res => {-->
<!--        this.authorizedPersonList = res.data-->
<!--      })-->
<!--    },-->
<!--    loadJobTypeOptions() {-->
<!--      this.$set(this.childDialogForm, 'jobType', '')-->
<!--    },-->
<!--    /**-->
<!--     * 根据检修计划同步数据-->
<!--     */-->
<!--    syncData() {-->
<!--      this.addressDisplay = false-->
<!--      getDetails(this.childDialogForm.planId).then(res => {-->
<!--        const data = res.data-->
<!--        this.childDialogForm.type= data.type+''-->
<!--        this.$set(this.childDialogForm, 'dataTime', [data.startTime, data.finishTime])-->
<!--        this.childDialogForm.operatorList = data.operatorId.split(',').map(id => id.trim()).filter(id => id);-->
<!--        if (data.riskId) {-->
<!--          this.childDialogForm.risk = data.riskId.split(',').map(id => id.trim()).filter(id => id);-->
<!--        }-->
<!--        this.childDialogForm.mode = data.mode + ''-->
<!--        this.$set(this.childDialogForm, 'jobCategory', data.jobCategory)-->
<!--        this.$set(this.childDialogForm, 'jobType', data.jobType)-->
<!--        this.$set(this.childDialogForm, 'header', data.header)-->
<!--        this.$set(this.childDialogForm, 'content', data.content)-->
<!--        this.$set(this.childDialogForm, 'keySolution', data.keySolution)-->
<!--        this.$set(this.childDialogForm, 'riskContent', data.riskContent)-->
<!--        // i6000检修独有字段-->
<!--        if (data.type === 2) {-->
<!--          let address = []-->
<!--          address.push(data.province)-->
<!--          address.push(data.city)-->
<!--          address.push(data.district)-->
<!--          this.address = address-->
<!--          this.childDialogForm.riskLevel = data.riskLevel-->
<!--          this.$set(this.childDialogForm, 'orgCompany', data.jianguanCompa)-->
<!--          this.$set(this.childDialogForm, 'constructCompany', data.shigongCompa)-->
<!--          this.$set(this.childDialogForm, 'totalUserCount', data.totalUserCount)-->
<!--          this.$set(this.childDialogForm, 'itSystem', data.itSystem)-->
<!--        }-->
<!--        if (data.planDetailList) {-->
<!--          if (data.mode === 2) {-->
<!--            data.planDetailList.filter(detail => detail.detailType === 2).forEach(detail => {-->
<!--              this.childDialogForm.room.push(detail.objectId)-->
<!--            })-->
<!--          }-->
<!--          this.deviceTableInfo = []-->
<!--          data.planDetailList.filter(detail => detail.detailType === 1) .forEach(detail => {-->
<!--            this.deviceTableInfo.push({-->
<!--              id: detail.objectId,-->
<!--              content: this.childDialogForm.content,-->
<!--              deviceName: detail.objectName,-->
<!--              description: detail.description,-->
<!--              ip: detail.device,-->
<!--              deviceType: detail.type,-->
<!--              devicePort: detail.sort,-->
<!--              deviceCategory: detail.extAttr1 === '0' ? '主机设备' : '网络设备',-->
<!--              deviceProtocol: detail.extAttr4-->
<!--            })-->
<!--          })-->
<!--        }-->
<!--        setTimeout(() => {-->
<!--          this.addressDisplay = true-->
<!--        }, 30)-->
<!--      })-->
<!--    },-->
<!--    /**-->
<!--     * 资产下拉-->
<!--     * @param deviceCategory-->
<!--     */-->
<!--    getDeviceTypeListFunc(deviceCategory) {-->
<!--      const protocolList = []-->
<!--      let list = this.dictForBastionHostProtocol.filter(d => d.remark === deviceCategory)-->
<!--      if (list.length === 0) {-->
<!--        list = this.dictForBastionNetworkProtocol.filter(d => d.remark === deviceCategory)-->
<!--      }-->
<!--      if (list.length === 0) {-->
<!--        return []-->
<!--      }-->
<!--      for (let i = 0; i < list.length; i++) {-->
<!--        const item = list[i]-->
<!--        if (item.dictKey !== '-1') {-->
<!--          protocolList.push(item)-->
<!--        }-->
<!--      }-->
<!--      return protocolList-->
<!--    },-->
<!--    /**-->
<!--     * 省市区下拉-->
<!--     * @param e-->
<!--     */-->
<!--    addressChange(e) {-->
<!--      this.address = e-->
<!--    },-->
<!--    /**-->
<!--     * 新增操作人-->
<!--     */-->
<!--    addWorker() {-->
<!--      this.grandsonDialogFlag = true-->
<!--    },-->
<!--    /**-->
<!--     * 获取检修计划-->
<!--     */-->
<!--    getRepairPlan(type) {-->
<!--      getRepairPlanList({type}).then(res => {-->
<!--        this.repairPlan = res.data-->
<!--      })-->
<!--    },-->
<!--    /**-->
<!--     * 获取风险管控卡-->
<!--     */-->
<!--    getRiskOptions() {-->
<!--      const query = {-->
<!--        pageNumber: 1,-->
<!--        pageSize: 9999,-->
<!--        companyId: this.userDetail.ownerUnit,-->
<!--        jobType: this.childDialogForm.jobType,-->
<!--        jobCategory: this.childDialogForm.jobCategory,-->
<!--        statusInfo: 1-->
<!--      }-->
<!--      getRiskByPage(query).then(res => {-->
<!--        this.riskOptions = res.data.records-->
<!--      })-->
<!--    },-->
<!--    /**-->
<!--     * 同步风险信息-->
<!--     */-->
<!--    syncRiskInfo() {-->
<!--      this.riskPointsList = []-->
<!--      this.measureList = []-->
<!--      this.childDialogForm.risk.forEach(riskId => {-->
<!--        const riskElement = this.riskOptions.find(item => item.id === riskId)-->
<!--        if (riskElement) {-->
<!--          this.riskPointsList.push(riskElement.riskPoints)-->
<!--          this.measureList.push(riskElement.measure)-->
<!--        }-->
<!--      })-->
<!--      this.$set(this.childDialogForm, 'riskContent', this.riskPointsList.join(','))-->
<!--      this.$set(this.childDialogForm, 'keySolution', this.measureList.join(','))-->
<!--    },-->
<!--    /**-->
<!--     * 字典回显-->
<!--     * @param code-->
<!--     * @param dictList-->
<!--     * @returns {*}-->
<!--     */-->
<!--    conversionDict(code, dictList) {-->
<!--      //字典回显-->
<!--      if (dictList != null && code !== '') {-->
<!--        let items = dictList.filter(item => item.dictKey === code)-->
<!--        if (items != null && items.length > 0) {-->
<!--          return items[0].dictValue-->
<!--        }-->
<!--      }-->
<!--      return code-->
<!--    },-->
<!--    /**-->
<!--     * 公司下拉树处理数据-->
<!--     * @param val-->
<!--     * @param type-->
<!--     */-->
<!--    getItem(val, type) {-->
<!--      if (type === 'CORP') {-->
<!--        this.childDialogForm.companyId = val.id-->
<!--        this.childDialogForm.companyName = val.fullName-->
<!--        this.childDialogForm.deptId = null;-->
<!--        this.childDialogForm.deptName = null;-->
<!--      } else if (type === 'DEPT') {-->
<!--        this.childDialogForm.deptId = val.id-->
<!--        this.childDialogForm.deptName = val.fullName-->
<!--      }-->
<!--      this.$forceUpdate()-->
<!--    },-->
<!--    /**-->
<!--     * 检修操作人处理数据-->
<!--     */-->
<!--    syncOperator() {-->
<!--      let nameList = []-->
<!--      this.childDialogForm.operatorList.forEach(id => {-->
<!--        let name = this.authorizedPersonList.find(person => person.id === id)-->
<!--        if (name) {-->
<!--          nameList.push(name.name)-->
<!--        }-->
<!--      })-->
<!--      this.childDialogForm.operator = nameList.join(',')-->
<!--      this.childDialogForm.operatorId = this.childDialogForm.operatorList.join(',')-->
<!--    },-->
<!--    /**-->
<!--     * 提交-->
<!--     */-->
<!--    saveEvent() {-->
<!--      // 如果作业地点有值，给省市区赋值-->
<!--      this.childDialogForm.province = null-->
<!--      this.childDialogForm.city = null-->
<!--      this.childDialogForm.district = null-->
<!--      if (this.address && this.address.length >= 3) {-->
<!--        this.childDialogForm.province = this.address[0]-->
<!--        this.childDialogForm.city = this.address[1]-->
<!--        this.childDialogForm.district = this.address[2]-->
<!--      }-->
<!--      Promise.all([-->
<!--        new Promise(resolve => this.$refs['topForm'].validate(v=>resolve(v))),-->
<!--        new Promise(resolve => this.$refs[this.childDialogForm.type === '2' ? 'topForm' : 'bottomForm'].validate(v=>resolve(v)))-->
<!--      ]).then(([v1, v2]) => {-->
<!--        if (v1 && v2) {-->
<!--          // 处理时间字段-->
<!--          this.saveLoading = true-->
<!--          this.childDialogForm.startTime = this.childDialogForm.dataTime[0];-->
<!--          this.childDialogForm.finishTime = this.childDialogForm.dataTime[1];-->
<!--          // 处理风险字段-->
<!--          if (this.childDialogForm.risk !== undefined) {-->
<!--            this.childDialogForm.riskId = this.childDialogForm.risk.join(',');-->
<!--          }-->
<!--          // 处理检修操作人信息-->
<!--          this.syncOperator();-->
<!--          // 处理设备数据-->
<!--          if (this.childDialogForm.type === '1') {-->
<!--            this.syncOrderDetailList()-->
<!--          }-->
<!--          // 设置创建用户名-->
<!--          this.childDialogForm.createUserName = this.userDetail.userName;-->
<!--          // 准备提交-->
<!--          this.childDialogForm.deviceRecordDto = { userId: this.userDetail.userId, userName: this.userDetail.userName, regionCode: this.userDetail.regionCode, processDefinitionKey: "bpm_jxgd", approvalOpinion: "发起检修工单", type: "JXGD" }-->
<!--          addOrUpdateRepairOrder(this.childDialogForm).then(() => {-->
<!--            this.saveLoading = false-->
<!--            this.$message({ type: 'success', message: '保存成功！' })-->
<!--            this.$router.push({path: '/xcnanr/repairOrder'});-->
<!--            this.$emit('refreshTable');-->
<!--          }).catch(() => {-->
<!--            this.saveLoading = false-->
<!--          })-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    /**-->
<!--     * 处理检修对象明细-->
<!--     */-->
<!--    syncOrderDetailList() {-->
<!--      this.childDialogForm.orderDetailList = []-->
<!--      // 新增机房-->
<!--      if(this.childDialogForm.mode === '2') {-->
<!--        this.childDialogForm.room.forEach(id => {-->
<!--          let room = this.roomList.find(room => room.id === id);-->
<!--          if (room) {-->
<!--            let item = {-->
<!--              detailType: 2, // 1:设备，2:机房-->
<!--              objectId: room.id,-->
<!--              objectName: room.name,-->
<!--              companyId: this.userDetail.ownerUnit,-->
<!--              companyName: this.userDetail.ownerUnitName,-->
<!--              companyRegionCode: this.userDetail.regionCode,-->
<!--            };-->
<!--            this.childDialogForm.orderDetailList.push(item);-->
<!--          }-->
<!--        })-->
<!--      }-->
<!--      // 新增设备-->
<!--      this.deviceTableInfo.forEach(device => {-->
<!--        let item = {-->
<!--          detailType: 1, // 1:设备，2:机房-->
<!--          content: this.childDialogForm.content,-->
<!--          objectId: device.id,-->
<!--          objectName: device.deviceName,-->
<!--          description: device.description,-->
<!--          ip: device.ip,-->
<!--          sort: device.devicePort,-->
<!--          type: device.deviceType,-->
<!--          extAttr1: device.deviceCategory === '主机设备' ? '0' : '1',-->
<!--          extAttr4: device.deviceProtocol,-->
<!--          companyId: this.userDetail.ownerUnit,-->
<!--          companyName: this.userDetail.ownerUnitName,-->
<!--          companyRegionCode: this.userDetail.regionCode,-->
<!--        }-->
<!--        this.childDialogForm.orderDetailList.push(item);-->
<!--      })-->
<!--    },-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--::v-deep(.xt_card_xc) {-->
<!--  padding: 45px 170px 15px 170px;-->
<!--  background: #FFF;-->
<!--  border-radius: 5px;-->
<!--  margin: 5px auto;-->
<!--  width: 1300px;-->
<!--}-->

<!--::v-deep(.title-head) {-->
<!--  float: left;-->
<!--  margin: 12px 0 0 60px;-->
<!--  font-size: 25px;-->
<!--  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;-->
<!--}-->

<!--::v-deep(.sy-solution) {-->
<!--  margin-top: 10px;-->
<!--}-->

<!--::v-deep(.el-input.is-disabled .el-input__inner) {-->
<!--  color: #606266;-->
<!--}-->

<!--.select-with-button {-->
<!--  display: flex;-->
<!--  align-items: center; /* 垂直居中对齐 */-->
<!--}-->

<!--.select-with-button .el-select {-->
<!--  margin-right: 2px; /*调整选择框和按钮之间的间距 */-->
<!--}-->
<!--::v-deep(.el-textarea__inner) {-->
<!--  resize: none !important;-->
<!--}-->
<!--::v-deep(.el-textarea .el-input__count){-->
<!--background: #e0f3ff10 !important-->
<!--}-->
<!--::v-deep(.el-input .el-input__count .el-input__count-inner){-->
<!--background: #e0f3ff10 !important-->
<!--}-->
<!--</style>-->
