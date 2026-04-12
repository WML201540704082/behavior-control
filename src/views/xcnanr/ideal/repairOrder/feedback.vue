<template>
  <div>
    <!-- 检修工单反馈 -->
    <div class="xt_card_xc xt_form xc_base">
      <div style="margin-left: -160px;margin-top: -30px;margin-bottom: 20px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/xcnanr/ideal/repairOrder/index' }">检修任务</el-breadcrumb-item>
          <el-breadcrumb-item v-if="type==='add'">终结</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="topForm" :model="childDialogForm" inline size="small" label-suffix=":" label-width="150px" v-loading="pageLoading">
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
              <!-- 检修类型(1：常规检修2：i6000检修)-->
              <el-form-item label="检修类型">
                <el-radio v-model="childDialogForm.type" disabled v-for="item in typeOptions" :key="item.dictKey"
                          :label="item.dictKey">{{ item.dictValue }}
                </el-radio>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="关联检修计划">
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
              <el-form-item label="公司">
                <xt-tree-lzay-select :formValue="childDialogForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getItem(v, 'CORP')" style="width: 390px" disabled/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="部门">
                <xt-tree-lzay-select :formValue="childDialogForm.deptName" :unit-id="childDialogForm.companyId" :selectType="'DEPT'" @getTreeItem="(v)=>getItem(v,'DEPT')" style="width: 390px" disabled/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="检修负责人">
                <el-input v-model="childDialogForm.header" clearable placeholder="请输入检修负责人" disabled style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="负责人电话">
                <el-input v-model="childDialogForm.headerTel" clearable placeholder="请输入检修负责人电话" disabled style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="检修操作人">
                <div class="grid-content bg-purple">
                  <el-input v-model="childDialogForm.operator" clearable  disabled style="width: 390px"/>
                </div>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="作业总人数">
                <el-input v-model="childDialogForm.totalUserCount"  disabled clearable placeholder="请输入作业总人数" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="24" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="检修时间段">
                <el-date-picker v-model="childDialogForm.dataTime"
                                class="filter-item"
                                :type="'datetimerange'"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['08:30:00', '17:30:00']"
                                align="right"
                                clearable
                                disabled
                                style="width: 1040px;"
                />
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='1'">
            <div class="grid-content bg-purple">
              <el-form-item label="检修时间段">
                <el-date-picker v-model="childDialogForm.dataTime"
                                class="filter-item"
                                :type="'datetimerange'"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['08:30:00', '17:30:00']"
                                align="right"
                                clearable
                                disabled
                                style="width: 390px;"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12" v-if="orderType==='1'">
            <div class="grid-content bg-purple">
              <el-form-item label="检修类别">
                <el-select v-model="childDialogForm.mode" disabled clearable placeholder="请选择检修类别" style="width: 390px">
                  <el-option v-for="dict in modeOptions" :key="dict.type" :label="dict.label" :value="dict.type"/>
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
          <el-col :span="24" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="检修内容">
                <el-input v-model="childDialogForm.content" disabled autosize clearable placeholder="请输入检修内容" type="textarea" :rows="2" style="width: 1040px;"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="24" v-if="orderType==='1'" style="height: 100%">
            <div class="grid-content bg-purple">
              <el-form-item label="检修内容">
                <el-input v-if="!childDialogForm.contentSucc" v-model="childDialogForm.content" disabled type="textarea" :rows="2" style="width: 1040px;"/>
                <el-input v-else v-model="childDialogForm.contentSucc" disabled type="textarea" :rows="2" style="width: 1040px;"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col v-if="orderType==='1'" :span="24" style="height: 100%;">
            <div class="grid-content bg-purple">
              <el-form-item label="危险点分析" prop="riskContent">
                <el-input disabled v-model="childDialogForm.riskContent" clearable placeholder="请输入危险点分析" type="textarea" :rows="4" style="width: 1040px"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col v-if="orderType==='1'" :span="24" style="height: 100%;">
            <div class="grid-content bg-purple">
              <el-form-item label="关键措施" prop="keySolution">
                <el-input disabled v-model="childDialogForm.keySolution" clearable placeholder="请输入关键措施" type="textarea" :rows="4" style="width: 1040px"/>
              </el-form-item>
            </div>
          </el-col>
<!--          <el-col :span="24" v-if="orderType==='1'">-->
<!--            &lt;!&ndash; 检修场所 / 检修结果：现场作业 &ndash;&gt;-->
<!--            <el-form-item v-if="childDialogForm.mode === '2'" :label="'检修场所'">-->
<!--              <el-table ref="authTable" :key="Math.random()" :data="roomArray" style="width: 1040px" stripe max-height="400px">-->
<!--                <el-table-column label="序号" type="index" width="80" align="center" />-->
<!--                <el-table-column prop="objectName" align="center" :show-overflow-tooltip="true" label="机房名称"/>-->
<!--                <el-table-column v-if="childDialogForm.statusInfo + '' === '6'" align="center" prop="feedbackContent" label="终结内容">-->
<!--                  <template slot-scope="scope">-->
<!--                    {{ !scope.row.feedbackContent ? '-' : scope.row.feedbackContent }}-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column v-if="childDialogForm.statusInfo + '' === '6'" label="操作" align="center">-->
<!--                  <template slot-scope="scope">-->
<!--                    <el-button v-if="(scope.row.url)" type="text" size="mini" @click="showImg(scope.row)">查看照片</el-button>-->
<!--                    <span v-else>-</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--              </el-table>-->
<!--            </el-form-item>-->
<!--          </el-col>-->


          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="风险作业等级">
                <el-select v-model="childDialogForm.riskLevel" disabled filterable clearable placeholder="请选择作业风险等级" style="width: 390px">
                  <el-option v-for="item in workRiskLevel" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="作业地点">
                <PcdSelect v-model="childDialogForm.address" disabled :inputNumShow="inputNumShow" :inputInterval="inputInterval"
                            :default-address="address"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="主办单位人数">
                <el-input v-model="childDialogForm.mainUserCount" disabled clearable placeholder="请输入主办单位人数"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="产业单位人数">
                <el-input v-model="childDialogForm.attachUserCount" disabled clearable placeholder="请输入产业单位人数"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="外包单位人数">
                <el-input v-model="childDialogForm.otherUserCount" disabled clearable placeholder="请输入外包单位人数" style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="作业组织(建管)单位">
                <el-input v-model="childDialogForm.orgCompany" disabled clearable placeholder="请输入作业组织单位" style="width: 390px"/>
                <!--                <el-checkbox v-model="childDialogForm.content" style="margin-left: 5px">其他</el-checkbox>-->
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="作业实施(施工)单位">
                <el-input v-model="childDialogForm.constructCompany" disabled clearable placeholder="请输入作业实施单位" style="width: 390px"/>
                <!--                <el-checkbox v-model="childDialogForm.content" style="margin-left: 5px">其他</el-checkbox>-->
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="工作类别">
                <el-select v-model="childDialogForm.workType" disabled filterable clearable placeholder="请选择工作类别" style="width: 390px">
                  <el-option v-for="item in workCategory" :key="item.dictKey" :label="item.dictValue"
                             :value="item.dictKey"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="工作方式">
                <el-select v-model="childDialogForm.workMode" disabled filterable clearable placeholder="请选择工作方式"
                           style="width: 390px">
                  <el-option v-for="item in workWay" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="工作场所名称">
                <el-input v-model="childDialogForm.position" disabled clearable placeholder="请输入工作场所名称"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="本次操作系统信息">
                <el-input v-model="childDialogForm.itSystem" disabled clearable placeholder="请输入本次操作系统信息"
                          style="width: 390px"/>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="涉及方式资源申请">
                <el-radio v-model="childDialogForm.isApplyResource" disabled :label="'1'">是</el-radio>
                <el-radio v-model="childDialogForm.isApplyResource" disabled :label="'0'">否</el-radio>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="24" v-if="orderType==='2'">
            <div class="grid-content bg-purple">
              <el-form-item label="涉及设备/软件">
                <el-input v-model="childDialogForm.software" disabled clearable
                          placeholder="请选择本次操作涉及设备/软件"
                          style="width: 945px"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--    终结表单-->
    <div class="xt_feedback_xc xt_form" >
      <div class="text item" style="margin-left: 40px">
        <el-form
          ref="submitForm"
          v-if="childDialogForm"
          :model="childDialogForm"
          :rules="feedbackRules"
          label-suffix=":"
          label-width="120px"
          size="small"
          v-loading="pageLoading"
        >
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="检修操作人" prop="feedbackPerson">
                  <el-input v-model="childDialogForm.feedbackPerson" placeholder="请输入检修操作人"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="grid-content bg-purple">
                <el-form-item label="检修结果">
                  <el-row v-if="this.childDialogForm.mode === '1'">
                    <!-- 远程作业 -->
                    <el-table ref="authTable" :key="Math.random()" :data="childDialogForm.orderDetailList" style="width: 1030px" max-height="200px" :row-class-name="tableRowClassName">
                      <el-table-column prop="objectName" align="center" :show-overflow-tooltip="true" label="设备名称" width="130px" />
                      <el-table-column prop="ip" align="center" :show-overflow-tooltip="true" label="设备IP" width="140px" />
                      <el-table-column prop="description" align="center" :show-overflow-tooltip="true" label="描述" width="200">
                        <template slot-scope="scope">
                          <span v-if="scope.row.description">{{ scope.row.description }}</span>
                          <span v-else>-</span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="solveStatus" label="终结内容">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.feedbackContent" placeholder="请输入描述" :maxlength="100" show-word-limit />
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" align="center" width="120px">
                        <template slot-scope="scope">
                          <el-button v-if="uploadFileList.filter(d => d.index === scope.$index).length === 0" type="text" @click="uploadIndexFunc(scope.$index)">上传附件</el-button>
                          <el-badge v-else :value="uploadFileList.filter(d => d.index === scope.$index).length" class="item" type="primary">
                            <el-button type="text" style="margin-left: 10px;" @click="uploadIndexFunc(scope.$index)">附件列表</el-button>
                          </el-badge>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-row>
                  <el-row v-else>
                    <!-- 现场作业 -->
                    <el-table ref="authTable" :key="Math.random()" :data="devices" style="width: 1030px" max-height="200px" :row-class-name="tableRowClassName">
                      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                      <el-table-column prop="objectName" align="center" :show-overflow-tooltip="true" label="机房名称" width="200" />
                      <el-table-column align="center" prop="feedbackContent" label="终结内容">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.feedbackContent" placeholder="请输入描述"/>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" align="center" width="120px">
                        <template slot-scope="scope">
                          <el-button v-if="uploadFileList.filter(d => d.index === scope.$index).length === 0" type="text" @click="uploadIndexFunc(scope.$index)">上传附件</el-button>
                          <el-badge v-else :value="uploadFileList.filter(d => d.index === scope.$index).length" class="item" type="primary">
                            <el-button type="text" style="margin-left: 10px;" @click="uploadIndexFunc(scope.$index)">附件列表</el-button>
                          </el-badge>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-row>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="margin: 170px 124px 0 0;display: flex;justify-content: center;align-items: center;">
        <el-button type="primary" size="small" @click="submitEvent" :loading="saveLoading">提 交</el-button>
        <el-button plain size="small" @click="returnEvent" :loading="returnLoading">返 回</el-button>
      </div>
    </div>
    <!-- 附件列表弹层 -->
    <el-dialog v-if="dialogConfig.flag && dialogConfig.type === 'file'" :visible.sync="dialogConfig.flag" title="检修终结上传附件列表" width="800px" @close="closeDialogFunc">
      <upload-file2-oss ref="file" :accept-types="[]" :max-size="200" @fileResult="getOssFileInfoFunc"></upload-file2-oss>
      <el-table :data="uploadFileList.filter(d => d.index === uploadIndex)" max-height="400px" stripe>
        <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
        <el-table-column prop="fileName" align="center" :show-overflow-tooltip="true" label="附件名称" />
        <el-table-column label="操作" align="center" min-width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="checkFileDialogRemoveFunc(scope.row.ossAddress)">移除</el-button>
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
import XtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import AddWorkerDialog from "@/views/xcnanr/operationPlan/repairPlan/AddWorkerDialog.vue";
import {getRiskByPage} from "@/api/xcnanr/repair";
import PcdSelect from '@/views/xcnanr/operationOrder/repairOrder/components/pcdSelect.vue'
import {feedbackWorkOrder, getRepairPlanList, repairOrderDetail} from "@/api/xcnanr/repairOrder"
import uploadFile2Oss from '../../components/UploadFile2Oss'

export default {
  components: {
    AddWorkerDialog,
    XtTreeLzaySelect,
    PcdSelect,
    uploadFile2Oss
  },
  data() {
    return {
      imgSuffixList: ['.jpg', '.png', '.jpeg'],
      userInfo: this.$store.state.user.userDetail,
      type: "",
      code: '',
      orderType: '1',
      deviceDialogFlag: false,
      returnLoading:false,
      selectDeviceList: [],
      deviceTableInfo: [],
      authTime: [],
      childDialogForm: {
        type: '',
        mode: '',
        isApplyResource: '',
        dataTime: [],
        riskDetailList: [],
        jobCategory: '',
        jobType: ''
      },
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
      tableIndex: null,
      address:[],
      feedbackRules:{
        feedbackPerson: [
          {required: true, message: '检修操作人不能为空', trigger: 'blur'}
        ]
      },
      pageLoading: false,
      saveLoading: false,
      tableHeight: undefined,
      tableLoading: false,
      repairPlan: [],
      personList: [],
      riskPointsList: [],
      measureList: [],
      workRiskLevel: [],
      workWay: [],
      workCategory: [],
      inputNumShow: 4,
      inputInterval: 10,
      dictForBastionHostProtocol: [],
      dictForBastionNetworkProtocol: [],
      details: [],
      uploadIndex: -1,
      roomArray: [],
      devices: [], uploadFileList: [], dialogConfig: { type: null, flag: false },
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
    this.code = this.$route.query.code
    this.getRepairPlan()
    this.getRiskOptions()
    this.getList()
  },
  mounted() {
    this.setTableHeight()
  },
  methods: {
    imagePreviewFunc(index) {
      this.$refs['uploadImg_' + index].clickHandler();
    },
    imageDelFunc(index) {
      this.$set(this.childDialogForm.orderDetailList[index], "imgBase64", null)
    },
    uploadIndexFunc(index) {
      this.uploadIndex = index
      this.dialogConfig.flag = true
      this.dialogConfig.type = 'file'
    },
    /**
     * 附件上传成功
     * @param name
     * @param ossAddress
     */
    getOssFileInfoFunc(name, ossAddress) {
      this.uploadFileList.push({index: this.uploadIndex, detailId: this.childDialogForm.orderDetailList[this.uploadIndex].id, fileName: name, ossAddress: ossAddress})
    },
    /**
     * 预览反馈上传的附件
     */
    previewFileFunc(ossAddress) {
      if (ossAddress && ossAddress.length > 0) {
        window.open(ossAddress)
      }
    },
    /**
     * 明细列表操作栏中的查看设备弹层中的移除设备事件
     * @param platformDeviceId
     */
    checkFileDialogRemoveFunc(ossAddress) {
      for (let i = 0; i < this.uploadFileList.length; i++) {
        const item = this.uploadFileList[i]
        if (item.index === this.uploadIndex && item.ossAddress === ossAddress) {
          this.uploadFileList.splice(i, 1)
        }
      }
    },
    // 关闭上传附件弹层
    closeDialogFunc() {
      this.dialogConfig.flag = false
      this.dialogConfig.type = null
      this.uploadIndex = -1
    },
    getList(){
      repairOrderDetail(this.code).then(res=>{
        this.childDialogForm = res.data
        this.childDialogForm.type += ''
        // 默认反馈操作人
        this.$set(this.childDialogForm, 'feedbackPerson', this.userInfo.userName)
        this.orderType = this.childDialogForm.type
        if (this.orderType === '1') {
          this.childDialogForm.mode += ''
        }else {
          this.childDialogForm.workType += ''
          this.childDialogForm.workMode += ''
          this.childDialogForm.riskLevel += ''
          this.childDialogForm.isApplyResource += ''
          this.address = [this.childDialogForm.province,this.childDialogForm.city,this.childDialogForm.district]
        }
        this.childDialogForm.dataTime = [this.childDialogForm.startTime, (!this.childDialogForm.applyFinishTimeSucc ? this.childDialogForm.finishTime : this.childDialogForm.applyFinishTimeSucc)]
        const riskIds = this.childDialogForm.riskId.split(',')
        const riskContents = this.childDialogForm.riskContent.indexOf(',')>0?this.childDialogForm.riskContent.split(','):this.childDialogForm.riskContent.split('，')
        const keySolutions = this.childDialogForm.keySolution.indexOf(',')>0?this.childDialogForm.keySolution.split(','):this.childDialogForm.keySolution.split('，')
        this.childDialogForm.riskDetailList = []
        for (let i = 0; i < riskIds.length; i++) {
          const risk = {
            riskId: riskIds[i],
            riskName: this.changeRisk(riskIds[i],this.riskOptions),
            riskContent: riskContents[i],
            keySolution: keySolutions[i]
          }
          // 检修对象回填
          this.roomArray = this.childDialogForm.orderDetailList.filter(detail => detail.detailType === 2)
          this.devices = this.childDialogForm.orderDetailList.filter(detail => detail.detailType === 1)
          this.childDialogForm.riskDetailList.push(risk)
        }
      })
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
      //加载字典
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
      this.$router.push('/xcnanr/ideal/repairOrder/index')
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
    changeRisk(id, dictList) {
      //字典回显
      if (dictList != null && id !== '') {
        let items = dictList.filter(item => item.id === id)
        if (items != null && items.length > 0) {
          return items[0].name
        }
      }
      return id
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
    submitEvent() {
      this.details = []
      const feedbackPerson = this.childDialogForm.feedbackPerson
      const companyRegionCode = this.childDialogForm.companyRegionCode
      const companyId = this.childDialogForm.companyId
      const companyName = this.childDialogForm.companyName
      for (const item of this.childDialogForm.orderDetailList) {
        const fileList = this.uploadFileList.filter(f => f.detailId === item.id)
        const feedback = {
          imgBase64: item.imgBase64,
          id: item.id,
          feedbackContent: item.feedbackContent,
          feedbackPerson: feedbackPerson,
          type: 4,
          repairId: this.childDialogForm.code,
          companyRegionCode: companyRegionCode,
          companyId: companyId,
          companyName: companyName,
          files: fileList
        }
        this.details.push(feedback)
      }
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          feedbackWorkOrder(this.details).then(res => {
            this.saveLoading = false
            if (res.code === 200){
              this.$message({
                type: 'success',
                message: '终结成功！'
              })
            }else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
            this.$router.push('/xcnanr/ideal/repairOrder/index')
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

::v-deep.title-head {
  float: left;
  margin: 12px 0 0 60px;
  font-size: 25px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266;
}

.select-with-button {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
}

.select-with-button .el-select {
  margin-right: 2px; /*调整选择框和按钮之间的间距 */
}

::v-deep.xt_feedback_xc{
  padding: 45px 170px 45px 170px;
  background: #FFF;
  border-radius: 5px;
  margin: 5px auto;
  width: 1300px;
  height: 500px;
}

::v-deep .el-textarea__inner {
  resize: none !important;
}
/deep/.el-badge__content {
  top: 15px;
  right: -1px;
}
</style>
