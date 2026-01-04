<template>
  <div>
    <!-- 新增表单 -->
    <div class="xt_card_xc xt_form xc_base">
      <!-- 面包屑 -->
      <div style="margin-left: -160px;margin-top: -30px;margin-bottom: 20px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/xcnanr/ideal/repairPlan/index' }">检修计划</el-breadcrumb-item>
          <el-breadcrumb-item>{{ getChildTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="childDialogForm" :model="childDialogForm" inline :rules="rules" size="small" label-suffix=":" label-width="160px" key="1" v-loading="pageLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司" prop="companyId">
              <xt-tree-lzay-select :formValue="childDialogForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getItem(v, 'CORP')" style="width: 390px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptId">
              <xt-tree-lzay-select :formValue="childDialogForm.deptName" :unit-id="childDialogForm.companyId" :disabled="!childDialogForm.companyId" :selectType="'DEPT'" @getTreeItem="(v)=>getItem(v,'DEPT')" style="width: 390px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 检修类型(1：常规检修2：i6000检修) -->
            <el-form-item label="检修类型" prop="type">
              <el-radio v-model="childDialogForm.type" v-for="item in typeOptions" :key="item.dictKey" :label="item.dictKey">{{item.dictValue}}</el-radio>
            </el-form-item>
          </el-col>
          <!-- 根据检修类型显示两种表单，部分使用同一字段传值存储 -->
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <!-- 检修对象类型(1：信息系统 2：基础平台 3：基础设施 4：云平台) -->
            <el-form-item label="检修对象类型" prop="objectType">
              <el-select v-model="childDialogForm.objectType" filterable clearable placeholder="请选择检修对象类型" style="width: 390px">
                <el-option v-for="item in objectTypeOptions" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <el-form-item label="检修类别" prop="mode">
              <el-select v-model="childDialogForm.mode" clearable placeholder="请选择检修类别" style="width: 390px" @change="changeMode">
                <el-option v-for="dict in modeOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <!-- 工作类别 -->
            <el-form-item label="工作类别" prop="jobCategory">
              <el-select v-model="childDialogForm.jobCategory" clearable placeholder="请选择工作类别" @change="loadJobTypeOptions" style="width: 390px">
                <el-option v-for="dict in jobCategoryOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <!-- 作业类型 -->
            <el-form-item label="作业类型" prop="jobType">
              <el-select v-model="childDialogForm.jobType" clearable placeholder="请选择作业类型" style="width: 390px" @change="changeJobType">
                <el-option v-for="dict in jobTypeAllOptions[childDialogForm.jobCategory]" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <el-form-item label="检修负责人" prop="header">
              <el-input v-model="childDialogForm.header" clearable placeholder="请输入检修负责人" :maxlength="30" show-word-limit style="width: 390px" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <el-form-item label="检修操作人" prop="operatorArray">
              <el-select v-model="operatorArray" multiple filterable clearable collapse-tags placeholder="请选择检修操作人" style="width: 390px">
                <el-option v-for="item in personList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <!--<div>
                <el-button class="self-select-button-ad" title="新增被授权人员" icon="el-icon-user" @click="addWorker" />
              </div>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="childDialogForm.type === '1' ? '计划类型':'检修计划类型'" prop="pattern">
              <el-select v-model="childDialogForm.pattern" filterable clearable placeholder="请选择计划类型" style="width: 390px">
                <el-option v-for="dict in patternOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="是否统一下达检修" prop="isTongyi">
              <el-select v-model="childDialogForm.isTongyi" filterable clearable placeholder="请选择是否统一下达检修" style="width: 390px">
                <el-option v-for="dict in isTongyiOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 暂时不拆分成两个时间框 -->
          <el-col :span="12">
            <el-form-item label="计划检修时间" prop="authTime">
              <el-date-picker
                v-model="authTime"
                class="filter-item"
                :type="'datetimerange'"
                :picker-options="pickerOptions"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['08:30:00', '17:30:00']"
                align="right"
                clearable
                style="width: 390px" />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="self-input-textarea">
            <div class="grid-contents bg-purple">
              <el-form-item :label="childDialogForm.type === '1' ? '检修内容':'计划内容'" prop="content">
                <el-input  v-model="childDialogForm.content" clearable placeholder="请输入内容" type="textarea" :rows="4" :maxlength="300" show-word-limit style="width: 1040px;" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="检修任务类型" prop="renwuType">
              <el-select v-model="childDialogForm.renwuType" filterable clearable placeholder="请选择检修任务类型" style="width: 390px">
                <el-option v-for="dict in renwuTypeOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="检修级别类型" prop="jiebieType">
              <el-select v-model="childDialogForm.jiebieType" filterable clearable placeholder="请选择检修级别类型" style="width: 390px">
                <el-option v-for="dict in jiebieTypeOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="是否停运" prop="isTingyun">
              <el-select v-model="childDialogForm.isTingyun" filterable clearable placeholder="请选择是否停运" style="width: 390px">
                <el-option v-for="dict in isTingyunOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="是否重要检修" prop="isImport">
              <el-select v-model="childDialogForm.isImport" filterable clearable placeholder="请选择是否重要检修" style="width: 390px">
                <el-option v-for="dict in isImportOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="检修单位" prop="jianxiuCompa">
              <!--              <el-select v-model="childDialogForm.jianxiuCompa" filterable clearable placeholder="请选择检修单位" style="width: 390px">-->
              <!--                <el-option v-for="dict in jianxiuCompaOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />-->
              <!--              </el-select>-->
              <el-input v-model="childDialogForm.jianxiuCompa" clearable placeholder="请输入检修单位" :maxlength="30" show-word-limit style="width: 390px" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="业务主管部门" prop="zhuguanDep">
              <el-select v-model="childDialogForm.zhuguanDep" filterable clearable placeholder="请选择业务主管部门" style="width: 390px">
                <el-option v-for="dict in zhuguanDepOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="检修主管" prop="jianxiuZg">
              <!--              <el-select v-model="childDialogForm.jianxiuZg" filterable clearable placeholder="请选择检修主管" style="width: 390px">-->
              <!--                <el-option v-for="dict in jianxiuZgOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />-->
              <!--              </el-select>-->
              <el-input v-model="childDialogForm.jianxiuZg" clearable placeholder="请输入检修主管" :maxlength="30" show-word-limit style="width: 390px" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="建设运维单位" prop="yunweiCompa">
              <!--              <el-select v-model="childDialogForm.yunweiCompa" filterable clearable placeholder="请选择建设运维单位" style="width: 390px">-->
              <!--                <el-option v-for="dict in yunweiCompaOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />-->
              <!--              </el-select>-->
              <el-input v-model="childDialogForm.yunweiCompa" clearable placeholder="请输入建设运维单位" :maxlength="30" show-word-limit style="width: 390px" />
            </el-form-item>
          </el-col>
          <!--          其它-->
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="计划负责人" prop="jihuaHeader">
<!--              <el-select v-model="childDialogForm.jihuaHeader" filterable clearable placeholder="请选择计划负责人" style="width: 390px">-->
<!--                <el-option v-for="dict in jihuaHeaderOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />-->
<!--              </el-select>-->
              <el-input v-model="childDialogForm.jihuaHeader" clearable placeholder="请输入计划负责人" :maxlength="30" show-word-limit style="width: 390px" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="联系电话" prop="lianxiTel">
              <el-input  v-model="childDialogForm.lianxiTel" clearable placeholder="请输入联系电话" :maxlength="11" show-word-limit style="width: 390px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="作业组织（建管）单位" prop="jianguanCompa">
              <!--              <el-select v-model="childDialogForm.jianguanCompa" filterable clearable placeholder="请选择作业组织（建管）单位" style="width: 390px">-->
              <!--                <el-option v-for="dict in jianguanCompaOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />-->
              <!--              </el-select>-->
              <el-input v-model="childDialogForm.jianguanCompa" clearable placeholder="作业组织（建管）单位" :maxlength="30" show-word-limit style="width: 390px" />
            </el-form-item>
          </el-col>
          <!--          其它-->
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="作业实施（施工）单位" prop="shigongCompa">
              <!--              <el-select v-model="childDialogForm.shigongCompa" filterable clearable placeholder="请选择作业实施（施工）单位" style="width: 390px">-->
              <!--                <el-option v-for="dict in shigongCompaOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />-->
              <!--              </el-select>-->
              <el-input v-model="childDialogForm.shigongCompa" clearable placeholder="请输入作业实施（施工）单位" :maxlength="30" show-word-limit style="width: 390px" />
            </el-form-item>
          </el-col>
          <!--          其它-->
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="作业风险等级" prop="riskLevel">
              <el-select v-model="childDialogForm.riskLevel" filterable clearable placeholder="请选择作业风险等级" style="width: 390px">
                <el-option v-for="dict in riskLevelOptions" :key="dict.dictKey" :label="dict.dictValue" :value="parseInt(dict.dictKey)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="作业地点" prop="position">
              <PcdSelect :inputNumShow="inputNumShow" :inputInterval="inputInterval" @addressChange="addressChange" :default-address="position" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '2'">
            <el-form-item label="作业总人数" prop="totalUserCount">
              <el-input-number v-model="childDialogForm.totalUserCount" clearable placeholder="请输入作业总人数" :precision="0" :step="1" :min="0" :max="99999" show-word-limit type="number" style="width: 390px;" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="childDialogForm.type === '2'">
            <el-form-item label="涉及信息系统" prop="itSystem">
              <el-input  v-model="childDialogForm.itSystem" clearable placeholder="请输入涉及信息系统" :maxlength="100" show-word-limit style="width: 1041px;" />
            </el-form-item>
          </el-col>
          <!--          选择-->
          <el-col :span="24" v-if="childDialogForm.type === '2'">
            <el-form-item label="涉及设备/软件" prop="software">
              <el-input  v-model="childDialogForm.software" disabled placeholder="请输入涉及设备/软件" style="width: 958px;" />
              <el-button style="margin-left: 2px" type="primary" @click="chooseDevices">选择设备</el-button>
            </el-form-item>
          </el-col>
          <!--          选择-->
          <el-col :span="24" v-if="childDialogForm.type === '2'">
            <el-form-item label="相关缺陷消缺申请" prop="quexian">
              <el-input  v-model="childDialogForm.quexian" clearable placeholder="请输入相关缺陷消缺申请" :maxlength="100" show-word-limit style="width: 1041px;" />
            </el-form-item>
          </el-col>
          <!--          选择-->
          <el-col :span="24" class="self-input-textarea" v-if="childDialogForm.type === '1'">
            <div class="grid-contents bg-purple">
              <el-form-item label="影响范围" prop="influenceScope">
                <el-input  v-model="childDialogForm.influenceScope" clearable placeholder="请输入影响范围" :maxlength="300" show-word-limit type="textarea" :rows="4" style="width: 1040px" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12" v-if="childDialogForm.type === '1'">
            <el-form-item label="风险管控卡" prop="riskId">
              <el-select v-model="riskIds" multiple filterable clearable collapse-tags placeholder="请选择风险管控卡" style="width: 390px" @change="syncRiskInfo">
                <el-option v-for="item in riskOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="self-input-textarea" v-if="childDialogForm.type === '1'">
            <el-form-item label="危险点分析" prop="riskContent">
              <el-input  v-model="childDialogForm.riskContent" clearable placeholder="请输入危险点分析" type="textarea" :rows="4" :maxlength="500" show-word-limit style="width: 1040px" />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 28px !important;" v-if="childDialogForm.type === '1'">
            <el-form-item label="关键措施" prop="keySolution">
              <el-input v-model="childDialogForm.keySolution" clearable placeholder="请输入关键措施" type="textarea" :rows="4" :maxlength="500" show-word-limit style="width: 1040px" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 检修对象 -->
    <div class="xt_card_xc xt_form xc_base">
      <div class="clearfix">
        <el-form ref="childDialogFormTwo" :rules="objectRules" :model="childDialogForm" inline size="small" label-suffix=":" label-width="160px" key="2" v-loading="pageLoading">
          <el-form-item label="检修场所" prop="roomIds" v-if="childDialogForm.type === '1' && childDialogForm.mode==='2'" style="margin-bottom: 10px">
            <el-select v-model="roomIdsArray" clearable multiple filterable collapse-tags placeholder="请选择需要授权的机房" style="width: 1040px;">
              <el-option v-for="room in roomList" :key="room.id" :label="room.name + ' / ' + room.companyName" :value="room.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="检修对象" prop="deviceIds" v-if="childDialogForm.type === '1'">
            <el-button style="margin-top: 5px;padding: 3px 15px;width: 100px;margin-bottom: 5px;" type="primary" @click="chooseDevices">选择设备</el-button>
            <div v-if="childDialogForm.mode === '2'" style="width: 500px;margin-left: 6px;display: inline;vertical-align: bottom;">
              若设备台账中未找到，可<span style="color: #409eff;cursor: pointer" @click="addOtherDevices"><em>点击此处</em></span>补充检修设备
            </div>
            <!-- 设备列表 -->
            <div v-if="childDialogForm.type === '1'">
              <el-table ref="deviceTableInfo" :data="deviceTableInfo" v-loading="tableLoading" @selection-change="selectionChange" max-height="430px" style="width: 1040px">
                <el-table-column label="设备名称" prop="deviceName" :width="childDialogForm.mode === '1' ? 220 : 400" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.deviceCategory === '其他'" v-model="scope.row.deviceName" placeholder="请输入设备名称" />
                    <span v-else>{{ '[' + scope.row.deviceCategory + '] ' + scope.row.deviceName }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="childDialogForm.mode === '1'" label="设备类型" prop="deviceType" width="100" align="center" show-overflow-tooltip />
                <el-table-column v-if="childDialogForm.mode === '1'" label="IP" prop="IP" width="120" align="center" show-overflow-tooltip />
                <el-table-column v-if="childDialogForm.mode === '1'" label="远程端口" prop="devicePort" width="160" align="center">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.devicePort" placeholder="请输入" :min="1" :max="65535" :precision="0" :step="1" />
                  </template>
                </el-table-column>
                <el-table-column v-if="childDialogForm.mode === '1'" label="资产类型" prop="deviceProtocol" width="175" align="center">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.deviceProtocol" placeholder="请选择资产类型" style="width: 155px">
                      <el-option v-for="dict in getDeviceTypeListFunc(scope.row.deviceCategory)" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="描述" prop="description" :width="childDialogForm.mode === '1' ? 300 : 550" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-tooltip :content="scope.row.description" :disabled="!scope.row.description" placement="top" effect="light">
                      <el-input v-model="scope.row.description" placeholder="请输入描述" :maxlength="100" show-word-limit :style="childDialogForm.mode === '1' ? 'width: 255px' : 'width: 520px'" />
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="88" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="removeDevice(scope.row)">移 除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底边按钮 -->
      <el-row style="margin: 20px 0 0 0; display: flex; justify-content: center; align-items: center;" class="self-row-bg" justify="center">
        <el-col :span="2">
          <el-button type="primary" size="small" :loading="saveLoading" @click="saveEvent('0')">保 存</el-button>
        </el-col>
        <el-col :span="2">
          <el-button stype="primary" size="small" tyle="margin-left: 15px;" @click="cancelEvent">取 消</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="small" :loading="saveLoading" @click="saveEvent('1')">提 交</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 弹层 新增检修操作人 -->
    <add-worker-dialog v-if="grandsonDialogFlag" :grandson-dialog-flag.sync="grandsonDialogFlag" @refreshWorker="refreshWorker" />
    <device-dialog v-if="deviceDialogFlag" :dialog-flag="deviceDialogFlag" title="检修" :auth-device-type-list="childDialogForm.mode === '1' ? distForAuthDeviceType : null" @closeDialog="closeDialogFunc" @submitDialog="loadSelectedDeviceFunc" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import { getDictList } from '@/api/dict'
import { getAll } from '@/api/xcnanr/authorizedPerson'
import AddWorkerDialog from './AddWorkerDialog'
import { getRiskByPage } from '@/api/xcnanr/repair'
import { getAllRoom } from '@/api/xcnanr/room'
import { getDetails, insertRepair, getByPageInit } from '../../../../api/xcnanr/repairPlan'
import DeviceDialog from "../../authManage/temporaryAuth/deviceDialog.vue";
import PcdSelect from '@/views/xcnanr/operationOrder/repairOrder/components/pcdSelect'
import { getByPlatformId } from '@/api/xcnanr/bastionDevice'

export default {
  name: 'AddEditForm',
  components: { xtTreeLzaySelect, getDictList, AddWorkerDialog, DeviceDialog, PcdSelect },
  props: {},
  data() {
    const verifyOperatorArray = (rule, value, callback) => {
      if (this.operatorArray === undefined || this.operatorArray.length === 0) {
        callback(new Error('检修操作人不能为空'))
      } else {
        callback()
      }
    }
    const verifyAuthTime = (rule, value, callback) => {
      if(this.authTime !== undefined && this.authTime !== null) {
        const authTimeArray = JSON.parse(JSON.stringify(this.authTime))
        if (authTimeArray[0] === '' || authTimeArray[1] === '') {
          callback(new Error('计划检修时间不能为空'))
        } else {
          callback()
        }
      }
    }
    const verifyDeviceIds = (rule, value, callback) => {
      if(this.childDialogForm.type === '1') {
        if (this.deviceTableInfo === undefined || this.deviceTableInfo.length === 0) {
          callback(new Error('检修对象不能为空'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const verifyRoomIds = (rule, value, callback) => {
      if (this.childDialogForm.type === '1' && this.childDialogForm.mode === '2') {
        if (this.roomIdsArray === undefined || this.roomIdsArray.length === 0) {
          callback(new Error('检修场所不能为空'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const verifyPosition = (rule, value, callback) => {
      if (this.childDialogForm.type === '2') {
        if (this.childDialogForm.province === undefined || this.childDialogForm.city === undefined || this.childDialogForm.district === undefined
          || this.childDialogForm.province === '' || this.childDialogForm.city === '' || this.childDialogForm.district === '') {
          callback(new Error('作业地点不能为空'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      childDialogForm: { planId: '',companyId: '', companyName: '', deptName: '', deptId: '', type: '1', measure: '', jobCategory: '', jobType: '', objectType: '', mode: '1', headerId: '', header: '', operatorId: '', operator: '', pattern: '1', isTongyi: '1', startTime: '', endTime: '', content: '', renwuType: '', jiebieType: '', isTingyun: '', isImport: '', jianxiuCompa: '', zhuguanDep: '', jianxiuZg: '', yunweiCompa: '', jihuaHeader: '', lianxiTel: '', jianguanCompa: '', shigongCompa: '', riskLevel: 1, province: '', city: '', district: '', totalUserCount: 0, itSystem: '', software: '', quexian: '', influenceScope: '', riskId: '', riskContent: '', keySolution: '', companyRegionCode: '', planDetailList: [], createUserName: '', isSumbit: '', deviceRecordDto: { processDefinitionKey: '', approvalOpinion: '' }},
      riskIds: [],
      jobCategoryOptions: [],
      jobTypeAllOptions: {},
      otherDevices: [],
      regularRules: {
        companyId: [
          {required: true, message: '公司不能为空', trigger: 'blur'}
        ],
        deptId: [
          {required: true, message: '部门不能为空', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '检修类型不能为空', trigger: 'blur'}
        ],
        mode: [
          {required: true, message: '检修类别不能为空', trigger: 'blur'}
        ],
        jobCategory: [
          {required: true, message: '工作类别不能为空', trigger: 'blur'}
        ],
        jobType: [
          {required: true, message: '作业类型不能为空', trigger: 'blur'}
        ],
        header: [
          {required: true, message: '检修负责人不能为空', trigger: 'blur'}
        ],
        operatorArray: [
          {required: true, validator: verifyOperatorArray, trigger: 'change'}
        ],
        pattern: [
          {required: true, message: '计划类型不能为空', trigger: 'blur'}
        ],
        authTime: [
          {required: true, validator: verifyAuthTime, trigger: 'change'}
        ],
        content: [
          {required: true, message: '检修内容不能为空', trigger: 'blur'}
        ],
        riskContent: [
          {required: true, message: '危险点分析不能为空', trigger: 'blur'}
        ],
        keySolution: [
          {required: true, message: '关键措施不能为空', trigger: 'blur'}
        ]
      },
      criticalRules: {
        companyId: [
          {required: true, message: '公司不能为空', trigger: 'blur'}
        ],
        deptId: [
          {required: true, message: '部门不能为空', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '检修类型不能为空', trigger: 'blur'}
        ],
        objectType: [
          {required: true, message: '检修对象类型不能为空', trigger: 'blur'}
        ],
        pattern: [
          {required: true, message: '检修计划类型不能为空', trigger: 'blur'}
        ],
        isTongyi: [
          {required: true, message: '是否统一下达检修不能为空', trigger: 'blur'}
        ],
        authTime: [
          {required: true, validator: verifyAuthTime, trigger: 'change'}
        ],
        content: [
          {required: true, message: '计划内容不能为空', trigger: 'blur'}
        ],
        renwuType: [
          {required: true, message: '检修任务类型不能为空', trigger: 'blur'}
        ],
        jiebieType: [
          {required: true, message: '检修级别类型不能为空', trigger: 'blur'}
        ],
        isTingyun: [
          {required: true, message: '是否停运不能为空', trigger: 'blur'}
        ],
        isImport: [
          {required: true, message: '是否重要检修不能为空', trigger: 'blur'}
        ],
        jianxiuCompa: [
          {required: true, message: '检修单位不能为空', trigger: 'blur'}
        ],
        zhuguanDep: [
          {required: true, message: '业务主管部门不能为空', trigger: 'blur'}
        ],
        jianxiuZg: [
          {required: true, message: '检修主管不能为空', trigger: 'blur'}
        ],
        jihuaHeader: [
          {required: true, message: '计划负责人不能为空', trigger: 'blur'}
        ],
        lianxiTel: [
          {required: true, message: '联系电话不能为空', trigger: 'blur'}
        ],
        riskLevel: [
          {required: true, message: '作业风险等级不能为空', trigger: 'blur'}
        ],
        position: [
          {required: true, validator: verifyPosition, trigger: 'change'}
        ],
        totalUserCount: [
          {required: true, message: '作业总人数不能为空', trigger: 'blur'}
        ]
      },
      // 检修对象单独的验证规则
      objectRules: {
        deviceIds: [
          {required: true, validator: verifyDeviceIds, trigger: 'change'}
        ],
        roomIds: [
          {required: true, validator: verifyRoomIds, trigger: 'change'}
        ]
      },
      pageLoading: false,
      typeOptions: [],
      objectTypeOptions: [],
      modeOptions: [],
      operatorArray: [],
      personList: [],
      grandsonDialogFlag: false,
      deviceDialogFlag: false,
      distForAuthDeviceType: [],
      patternOptions: [],
      isTongyiOptions: [],
      authTime: ['', ''],
      pickerOptions: {
        // 禁止选择未来时间
        disabledDate: (time) => {
          const curTime = new Date()
          return time.getTime() < curTime
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      renwuTypeOptions: [],
      jiebieTypeOptions: [
        {
          dictKey: '1',
          dictValue: '二级检修'
        }
      ], // todo i6000检修暂时写死
      isTingyunOptions: [
        {
          dictKey: '0',
          dictValue: '否'
        }, {
          dictKey: '1',
          dictValue: '是'
        }
      ], // todo i6000检修暂时写死
      isImportOptions: [
        {
          dictKey: '0',
          dictValue: '否'
        }, {
          dictKey: '1',
          dictValue: '是'
        }
      ], // todo i6000检修暂时写死
      jianxiuCompaOptions: [
        {
          dictKey: '1',
          dictValue: '国网XX供电公司本部'
        }
      ], // todo i6000检修暂时手填
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
      ], // todo i6000检修暂时写死
      jianxiuZgOptions: [
        {
          dictKey: '1',
          dictValue: '国网xx供电公司本部/信息运检班/张三'
        }
      ], // todo i6000检修暂时手填
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
      ], // todo i6000检修暂时手填
      jihuaHeaderOptions: [
        {
          dictKey: '1',
          dictValue: '国网xx供电公司本部/信息运检班/张三'
        }
      ], // todo i6000检修暂时手填
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
      ], // todo i6000检修暂时手填
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
      ], // todo i6000检修暂时手填
      riskLevelOptions: [],
      riskOptions: [],
      roomIdsArray: [],
      roomArray: [],
      roomList: [],
      deviceTableInfo: [],
      tableLoading: false,
      inputNumShow: 4,
      inputInterval: 10,
      dictForBastionHostProtocol: [],
      dictForBastionNetworkProtocol: [],
      saveLoading: false,
      position: ['山东', '济南', '市中'],
      editData: null,
      processPermission: false
    }
  },
  computed: {
    ...mapGetters(['userDetail']),
    getChildTitle() {
      return this.$route.query.childTitle
    },
    rules() {
      if (this.childDialogForm.type === '1') {
        return this.regularRules
      } else {
        return this.criticalRules
      }
    }
  },
  watch: {
    'childDialogForm.type': {
      handler(newValue) {
        if (this.editData === null) {
          // 清空表单
          this.childDialogForm = {
            type: newValue,
            companyId: this.userDetail.ownerUnit,
            companyName: this.userDetail.ownerUnitName,
            companyRegionCode: this.userDetail.regionCode,
            deptId: this.userDetail.deptId,
            deptName: this.userDetail.deptName,
            mode: newValue === '1' ? '1' : 0, // 默认远程作业
            pattern: '1', // 默认临时计划
          }
        }
        this.$nextTick(() => {
          // 清空验证
          this.$refs.childDialogForm.clearValidate()
          this.$refs.childDialogFormTwo.clearValidate()
        })
      },
      immediate: true
    },
    'childDialogForm.companyId': {
      handler() {
        this.getPersonList()
      },
      immediate: true,
      deep: true
    },
    'childDialogForm.mode': {
      handler() {
        this.$nextTick(() => {
          // 获取风险管控卡
          this.getRiskOptions()
          // 清空验证
          this.$refs.childDialogForm.clearValidate()
          this.$refs.childDialogFormTwo.clearValidate()
        })
      },
      immediate: true
    },
    'childDialogForm.jobCategory': {
      handler() {
        // 获取风险管控卡
        this.getRiskOptions()
      },
      immediate: true
    },
    'childDialogForm.jobType': {
      handler() {
        // 获取风险管控卡
        this.getRiskOptions()
      },
      immediate: true
    }
  },
  created() {
    this.isAuth()
    this.isEdit()
    // this.getInitTime()
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
    this.getDictList('info_repair_plan_mode')
    this.getDictList('info_object_type')
    this.getDictList('info_is_tongyi')
    this.getDictList('info_renwu_type_one')
    this.getDictList('info_work_risk_level')
    this.getDictList("info_device_send_bastion_type")
    this.getDictList('info_bastion_server_type')
    this.getDictList('info_bastion_network_type')
    this.getPersonList()
    this.getRoomList()
  },
  mounted() {
  },
  methods: {
    /**
     * 切换作业类型 清空风险管控卡
     */
    changeJobType() {
      this.riskIds = []
    },
    /**
     * 切换检修类别 清空详情集合、检修场所、检修对象
     */
    changeMode() {
      this.childDialogForm.planDetailList = []
      this.roomIdsArray = []
      this.deviceTableInfo = []
    },
    addOtherDevices() {
      this.deviceTableInfo.push({
        id: null, // 详情ID
        planId: this.childDialogForm.planId ? this.childDialogForm.planId : null, // 计划编号
        mode: this.childDialogForm.mode,
        deviceName: '',
        description: '',
        deviceCategory: '其他',
        deviceCategoryCode: '112233',
        companyRegionCode: this.userDetail.regionCode
      })
    },
    /**
     * 查询是否配置流程引擎相关权限
     */
    isAuth() {
      getByPageInit().then(res => {
        if(res) {
          console.log('后台返回的流程引擎提交权限请为:', res.data.tijiao)
          if(res.data.tijiao === 'yes') {
            this.processPermission = true
          }
        }
      })
    },
    isEdit() {
      this.editData = this.$route.query.code
      if (this.editData !== null) {
        getDetails(this.editData).then(res => {
          if (res && res.data !== null) {
            let rowData = res.data
            // 通用字段回填
            this.childDialogForm.id = rowData.id
            this.childDialogForm.code = this.editData
            this.childDialogForm.companyName = rowData.companyName
            this.childDialogForm.companyId = rowData.companyId
            this.childDialogForm.deptName = rowData.deptName
            this.childDialogForm.deptId = rowData.deptId
            this.childDialogForm.type = rowData.type.toString()
            this.authTime = [rowData.startTime, rowData.finishTime]
            this.$set(this.childDialogForm, 'content', rowData.content)
            this.$set(this.childDialogForm, 'influenceScope', rowData.influenceScope)
            this.childDialogForm.pattern = rowData.pattern.toString()
            this.deviceTableInfo = rowData.planDetailList.filter(detail => detail.detailType === 1).map(detail => {
              return {
                detailId: detail.id, // 详情ID
                planId: detail.planId, // 计划编号
                // 详情回填设备信息
                id: detail.objectId, // 设备ID
                deviceName: detail.objectName, // 设备名称
                deviceCategory: detail.ciLabel, // 资产类别
                deviceType: detail.type, // 设备类型
                IP: detail.device, // IP
                devicePort: detail.sort, // 远程端口
                deviceProtocol: detail.extAttr4, // 资产类型
                description: detail.description,
                deviceCategoryCode: detail.ciId,
              }
            })
            if (rowData.type.toString() === '1') {
              // 常规检修字段回填
              this.childDialogForm.id = rowData.id
              this.childDialogForm.planId = rowData.code
              this.childDialogForm.mode = rowData.mode.toString()
              this.$set(this.childDialogForm, 'jobCategory', rowData.jobCategory)
              this.$set(this.childDialogForm, 'jobType', rowData.jobType)
              this.$set(this.childDialogForm, 'header', rowData.header)
              this.childDialogForm.headerId = rowData.headerId
              this.operatorArray = rowData.operatorId.split(',')
              this.childDialogForm.influenceScope = rowData.influenceScope
              this.$set(this.childDialogForm, 'riskContent', rowData.riskContent)
              this.$set(this.childDialogForm, 'keySolution', rowData.keySolution)
              this.riskIds = rowData.riskId.split(',')
              if (res.data.mode === 2) {
                this.roomIdsArray = rowData.planDetailList.filter(detail => detail.detailType === 2).map(detail => detail.objectId)
                this.roomArray = rowData.planDetailList.filter(detail => detail.detailType === 2).map(detail => {
                  return {
                    detailId: detail.id, // 详情ID
                    planId: detail.planId, // 计划编号
                    // 详情回填设备信息
                    id: detail.objectId, // 设备ID
                    deviceName: detail.objectName // 设备名称
                  }
                })
              }
            } else if (rowData.type.toString() === '2') {
              // i6000检修字段回填
              this.childDialogForm.id = rowData.id
              this.$set(this.childDialogForm, 'objectType', rowData.objectType)
              this.$set(this.childDialogForm, 'isTongyi', rowData.isTongyi)
              this.$set(this.childDialogForm, 'renwuType', rowData.renwuType)
              this.$set(this.childDialogForm, 'jiebieType', rowData.jiebieType)
              this.$set(this.childDialogForm, 'isTingyun', rowData.isTingyun)
              this.$set(this.childDialogForm, 'isImport', rowData.isImport)
              this.$set(this.childDialogForm, 'jianxiuCompa', rowData.jianxiuCompa)
              this.$set(this.childDialogForm, 'zhuguanDep', rowData.zhuguanDep)
              this.$set(this.childDialogForm, 'jianxiuZg', rowData.jianxiuZg)
              this.$set(this.childDialogForm, 'lianxiTel', rowData.lianxiTel)
              this.$set(this.childDialogForm, 'jihuaHeader', rowData.jihuaHeader)
              this.$set(this.childDialogForm, 'yunweiCompa', rowData.yunweiCompa)
              this.$set(this.childDialogForm, 'jianguanCompa', rowData.jianguanCompa)
              this.$set(this.childDialogForm, 'shigongCompa', rowData.shigongCompa)
              this.$set(this.childDialogForm, 'riskLevel', rowData.riskLevel)
              this.position = []
              this.position.push(rowData.province)
              this.position.push(rowData.city)
              this.position.push(rowData.district)
              this.$set(this.childDialogForm, 'totalUserCount', rowData.totalUserCount)
              this.$set(this.childDialogForm, 'itSystem', rowData.itSystem)
              this.$set(this.childDialogForm, 'software', rowData.software)
              this.$set(this.childDialogForm, 'quexian', rowData.quexian)
            }
          }
        }).catch((err) => {
          console.log(err, '编辑回显报错--')
        })
      }
    },
    loadJobTypeOptions() {
      this.$set(this.childDialogForm, 'jobType', '')
    },
    /**
     * 加载下拉树 单位和部门
     * @param val
     * @param type
     */
    getItem(val, type) {
      this.refreshWorker()
      if (type === 'CORP') {
        this.childDialogForm.companyId = val.id
        this.childDialogForm.companyName = val.fullName
        this.childDialogForm.deptId = null
        this.childDialogForm.deptName = null
      } else if (type === 'DEPT') {
        this.childDialogForm.deptId = val.id
        this.childDialogForm.deptName = val.fullName
      }
      this.$forceUpdate()
    },
    // 刷新被授权人下拉
    refreshWorker() {
      this.getPersonList()
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
        } else if (code === 'info_repair_plan_mode') {
          this.modeOptions = res.data
        } else if (code === 'info_object_type') {
          this.objectTypeOptions = res.data
        } else if (code === 'info_is_tongyi') {
          this.isTongyiOptions = res.data
        } else if (code === 'info_renwu_type_one') {
          this.renwuTypeOptions = res.data
        }
          // todo 暂时写死i6000检修的字段，后期改为字典和联动
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
        } else if (code === 'info_device_send_bastion_type') {
          this.distForAuthDeviceType = res.data
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
      getAll({enabled: 1, companyId: this.childDialogForm.companyId}).then(res => {
        this.personList = []
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
      this.riskOptions = []
      const query = {
        pageNumber: 1,
        pageSize: 9999,
        // companyId: this.userDetail.ownerUnit,
        jobType: !this.childDialogForm.jobType ? 'xxxx' : this.childDialogForm.jobType,
        jobCategory: !this.childDialogForm.jobCategory ? 'xxxx' : this.childDialogForm.jobCategory,
        type: this.childDialogForm.mode,
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
      this.riskIds.forEach(riskId => {
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
      getAllRoom({}).then(res => {
        this.roomList = res.data
      })
    },
    /**
     * 打开弹层 新增操作人
     */
    addWorker() {
      this.grandsonDialogFlag = true
    },
    /**
     * 打开弹层 选择设备
     */
    chooseDevices() {
      this.deviceDialogFlag = true
    },
    /**
     * 关闭弹层 选择设备
     */
    closeDialogFunc() {
      this.deviceDialogFlag = false
    },
    /**
     * 移除设备
     * @param row
     */
    removeDevice(row) {
      const index = this.deviceTableInfo.findIndex(device => device.id === row.id)
      if (index !== -1) {
        this.deviceTableInfo.splice(index, 1)
      }
    },
    /**
     * 设备回填
     * @param selectedList
     */
    loadSelectedDeviceFunc(selectedList) {
      this.deviceTableInfo = this.deviceTableInfo == null ? [] : this.deviceTableInfo
      // 先过滤掉已经添加过的设备，使用新的数组记录未添加的设备
      let unAddList = []
      if (this.deviceTableInfo.length > 0) {
          for (const item of selectedList) {
            const exists = this.deviceTableInfo.find(d => d['id'] + '' === item['id'] + '')
            if (!exists) {
              unAddList.push(item)
            }
          }
      } else {
        unAddList.push(...selectedList)
      }

      // 过滤后，开始往数组中添加
      if (unAddList.length > 0) {
        if (this.childDialogForm.mode === '1') {
          // mode=1：远程作业   查询堡垒机同步设备列表，将之前授权过的设备，直接带出端口和设备类型来
          let devices = unAddList.map(item => item.id)
          getByPlatformId({ platformIds: devices.join(',') }).then(res => {
            const newList = unAddList.map(d => {
              const syncedItems = res.data.filter(s => s.platformId === (d.id + ''))
              // 一体化正式环境用的是fullName 标准全称
              d.deviceName = (!d.fullName ? (!d.deviceName ? '<未命名设备>' : d.deviceName) : d.fullName)
              if (syncedItems.length > 0) {
                d.devicePort = syncedItems[0].port + ''
                d.deviceProtocol = syncedItems[0].sysType + ''
              }
              return d
            })
            this.deviceTableInfo.push(...newList)
          })
        } else {
          // mode=2 | 0：现场作业、i6000检修
          unAddList = unAddList.map(d => {
            // 一体化正式环境用的是fullName 标准全称
            d.deviceName = (!d.fullName ? (!d.deviceName ? '<未命名设备>' : d.deviceName) : d.fullName)
            return d
          })
          this.deviceTableInfo.push(...unAddList)
        }

        if (this.childDialogForm.type === '2') {
          // type=2: i6000检修
          this.childDialogForm.software = this.deviceTableInfo.map(item => item.deviceName).join(',')
        }
      }
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
     * 处理检修对象明细
     * @returns {boolean}
     */
    syncPlanDetailList() {
      this.childDialogForm.planDetailList = []
      try {
        // 机房明细
        if(this.childDialogForm.mode === '2') {
          let editRoomArray = []
            this.roomIdsArray.forEach(roomId => {
              // 编辑时 复用回填的详情ID
              if(this.roomArray && this.roomArray.length > 0) {
                let oldRoom = this.roomArray.find(room => room.id === roomId)
                if(oldRoom) {
                  editRoomArray.push({
                    id: oldRoom.detailId,
                    planId: oldRoom.planId, // 计划编号
                    detailType: 2, // 详情类型（1:设备，2:机房）
                    mode: this.childDialogForm.mode, // 检修类别（1:远程作业，2:现场作业）
                    objectId: oldRoom.id,
                    objectName: oldRoom.deviceName, // 机房名称
                    companyRegionCode: this.userDetail.regionCode
                  })
                }
              }
              // 保存时 匹配下拉中的机房名称
              if(this.roomArray.length === 0 || !this.roomArray.some(room => room.id === roomId)) {
                let editRoomList = this.roomList.find(room => room.id === roomId)
                if (editRoomList) {
                  editRoomArray.push({
                    id: null,
                    planId: this.childDialogForm.planId ? this.childDialogForm.planId : null, // 计划编号
                    detailType: 2, // 详情类型（1:设备，2:机房）
                    mode: this.childDialogForm.mode, // 检修类别（1:远程作业，2:现场作业）
                    objectId: roomId,
                    objectName: editRoomList.name, // 机房名称
                    companyRegionCode: this.userDetail.regionCode
                  })
                }
              }
              this.childDialogForm.planDetailList = editRoomArray
            })
        }
        // 检查输入项是否已填写
        this.deviceTableInfo.forEach(device => {
          if(this.childDialogForm.mode === '1' && (device.devicePort === undefined || device.devicePort === '')) {
            this.$message({
              type: 'warning',
              message: device.IP + '端口号为空'
            })
            throw new Error()
          }
          if(this.childDialogForm.mode === '1' && (device.deviceProtocol === undefined || device.deviceProtocol === '')) {
            this.$message({
              type: 'warning',
              message: device.IP + '资产类型为空'
            })
            throw new Error()
          }
          if (this.childDialogForm.mode + '' !== '0' && (device.description === undefined || device.description === '')) {
            this.$message({
              type: 'warning',
              message: (this.childDialogForm.mode + '' === '1' ? device.IP : device.deviceName) + '描述不能为空'
            })
            throw new Error()
          }
          let item = {
            id: device.detailId ? device.detailId : null, // 详情ID
            planId: device.planId ? device.planId : null, // 计划编号
            detailType: 1, // 1:设备，2:机房
            mode: this.childDialogForm.mode,
            objectId: device.id,
            objectName: device.deviceName,
            device: device.IP,
            description: device.description,
            sort: device.devicePort,
            type: device.deviceType,
            extAttr1: device.deviceCategory === '主机设备' ? '0' : (device.deviceCategory === '网络设备' ? '1' : '2'),
            extAttr4: device.deviceProtocol,
            companyRegionCode: this.userDetail.regionCode,
            ciId: device.deviceCategoryCode == null ? '112233' : device.deviceCategoryCode,
            ciLabel: device.deviceCategory,
          }
          this.childDialogForm.planDetailList.push(item)
        })
      } catch(err) {
        return false
      }
      return true
    },
    /**
     * 省市区下拉
     * @param e
     */
    addressChange(e){
      this.position=e
    },
    /**
     * 保存提交
     */
    saveEvent(submitType) {
      this.childDialogForm.createUserName = this.userDetail.userName
      // 处理时间段
      this.childDialogForm.startTime = this.authTime === null ? null : this.authTime[0]
      this.childDialogForm.finishTime = this.authTime === null ? null : this.authTime[1]
      // 处理检修操作人信息
      this.syncOperator()
      // 处理风险管控卡
      this.childDialogForm.companyRegionCode = this.userDetail.regionCode
      this.childDialogForm.riskId = Array.isArray(this.riskIds) ? this.riskIds.join(',') : this.riskIds
      // 处理设备或机房
      if(!this.syncPlanDetailList()) {
        return
      }
      // 处理检修负责人
      if (this.childDialogForm.type === '1') {
        this.childDialogForm.headerId = this.userDetail.userId
      }
      // 处理省市区数据
      if (this.childDialogForm.type === '2') {
        this.syncPosition()
      }
      // 当表单为编辑时，清空表单值放在save前；表单为新增时，清空表单用watch
      if(this.editData !== null) {
        if(this.childDialogForm.type === '1') {
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
          this.childDialogForm.software = null
        } else if(this.childDialogForm.type === '2') {
          this.childDialogForm.mode = 0
          this.childDialogForm.header = null
          this.childDialogForm.headerId = null
          this.operatorArray = []
          this.childDialogForm.operatorId = null
          this.childDialogForm.influenceScope = null
          this.childDialogForm.riskId = null
          this.childDialogForm.riskContent = null
          this.childDialogForm.keySolution = null
          this.roomIdsArray = []
        }
      }
      // 开始校验两个表单
      Promise.all([
        new Promise(resolve => this.$refs.childDialogForm.validate(v=>resolve(v))),
        new Promise(resolve => this.$refs.childDialogFormTwo.validate(v=>resolve(v)))
      ]).then(([v1, v2]) => {
        if (v1 && v2) {
          // 流程引擎赋值（0是保存，1是提交）
          this.childDialogForm.isSumbit = submitType
          if (submitType === '1') {
            if(!this.processPermission) {
              this.$message({ type: 'warning', message: '未配置流程引擎相关权限！' })
              return
            }
            this.childDialogForm.deviceRecordDto = { processDefinitionKey: 'bpm_jxjh', approvalOpinion: '发起检修计划', type: 'JXJH' }
          }
          // 表单后台校验
          this.saveLoading = true
          insertRepair(this.childDialogForm).then(() => {
            this.saveLoading = false
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.$router.push('/xcnanr/ideal/repairPlan/index')
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
      this.$router.push('/xcnanr/ideal/repairPlan/index')
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
::v-deep.xt_card_xc {
  padding: 45px 170px 45px 170px;
  background: #FFF;
  border-radius: 5px;
  margin: 5px auto;
  width: 1300px;
}
::v-deep .self-input-textarea{
  margin-bottom: 74px !important;
}
::v-deep .self-select-button-ad{
  float: right;
  margin: -32px -46px 0 0 !important;
}
::v-deep .self-row-bg{
  padding: 0 0 0 30px
}
::v-deep(.el-textarea__inner){
  resize: none !important
}
::v-deep(.el-textarea .el-input__count){
  background: #e0f3ff10 !important
}
::v-deep(.el-input .el-input__count .el-input__count-inner){
  background: #e0f3ff10 !important
}
</style>
