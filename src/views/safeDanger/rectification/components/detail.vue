<template>
  <div style="width: 100%;height: 100%;">
    <div v-if="!isInfo && !isRect" style="margin-bottom: 10px">
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="submitForm" v-if="formData.status == 7 && formData.newType == 1">保存</el-button>              
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="saveToBPM" v-if="(formData.status>2 && formData.status<6 && formData.workflowId) || formData.status==9 || formData.status==10">发送</el-button>        
      <!-- <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="saveToBPM" v-if="formData.status>3 && formData.status<6 && formData.workflowId && formData.newType == 1">发送</el-button>         -->
    </div>

    <div v-if="isRect" style="margin-bottom: 10px">
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="submitForm">保存</el-button>        
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="sendBPM">发起流程</el-button>        
    </div>

    <div class="mains">
      <el-form :disabled="isInfo" style="padding-right: 5px" :rules="rules"  label-width="140px" ref="form" :model="formData"  :status-icon="true">
        <div style="font-size: 16px;margin-top: 5px;"> 工单编号: {{ formData.serialNumber }} </div>
        <el-collapse v-model="activeNames" style="padding-top: 5px">
          <el-collapse-item title="基本信息" name="1">
            <el-row style="margin-top: 10px">
              <el-col :span="24">
                <el-form-item label="隐患内容:" prop="content">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.content"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="隐患来源:" prop="hiddenSource">
                  <el-select v-model="formData.hiddenSource" disabled size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in hiddenSourceList"
                      :value="item.dictValue"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8" class="rowSelect2">
                <el-form-item label="隐患分类:" prop="hiddenCategory">
                  <el-select v-model="formData.hiddenCategory" disabled @change="changeHiddenCategory" size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in hiddenCategoryList"
                      :value="item.dictValue"
                      :key="item.id"
                      :label="item.dictLabel"
                    >
                    </el-option>
                  </el-select>
                  <el-select v-model="formData.hiddenType" disabled size="mini" clearable placeholder="" style="margin-left: 1%">
                    <el-option
                      v-for="item in hiddenCategoryList2"
                      :value="item.id"
                      :key="item.id"
                      :label="item.dictLabel"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="隐患依据:" prop="hiddenItems">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.hiddenItems"
                    :disabled='disStep0'
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="发现人:" prop="discoverBy">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.discoverBy"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="发现日期:" prop="discoverDate">
                  <el-date-picker
                          v-model="formData.discoverDate" :disabled='disStep0' placeholder="" type="date"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="提报人:" prop="reportedBy">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.reportedBy"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="提报日期:" prop="reportintDate">
                  <el-date-picker
                          v-model="formData.reportintDate" disabled placeholder="" type="date"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="责任单位:" prop="secondCompany">
                  <!-- <el-select v-model="formData.secondCompany" disabled size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in basicUnitSeconds"
                      :value="item.orgId"
                      :key="item.orgId"
                      :label="item.shortName"
                    >
                    </el-option>
                  </el-select> -->
                  <JobUnit :orgId.sync="formData.secondCompany" disabledd></JobUnit>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="整改责任人:" prop="responsibleBy">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.responsibleBy"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="责任人联系方式:" prop="responsiblePhone">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.responsiblePhone"
                    :disabled='disStep0'
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div>
                  <el-form-item label="详情材料" prop="fileUrl1">
                    <el-input
                      disabled
                      placeholder=""
                      size="mini"
                      v-model="formData.fileUrl1">
                      <el-button :disabled='disStep0' size="mini" slot="append" icon="el-icon-search" @click="uploadFile(2)"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div>
                  <el-form-item label="详情材料:" prop="fileUrl1">
                    <FilePreview :filesArr="filesArr" :fileType="2" fileTypeText="整改前"></FilePreview>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="整改完成状态" prop="rectificationStatus">
                  <el-radio-group disabled v-model="formData.rectificationStatus" @input="changeState1">
                    <el-radio :label="0">未完成</el-radio>
                    <el-radio :label="1">已完成</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="整改计划信息" name="2" v-if="formData.rectificationStatus != 1">
            <el-row>
              <el-col :span="8">
                <el-form-item label="预计整改完成时间:" prop="rectificationExpectTime">
                  <el-date-picker
                          v-model="formData.rectificationExpectTime" disabled placeholder="" type="date"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="已采取的防范措施:" prop="rectificationPrecautions">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.rectificationPrecautions"
                    :disabled='disStep0'
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="整改计划:" prop="rectificationPlan">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.rectificationPlan"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div>
                  <el-form-item label="佐证材料:" prop="fileUrl2">
                    <el-input
                      disabled
                      placeholder=""
                      size="mini"
                      v-model="formData.fileUrl2">
                      <el-button :disabled='disStep0' size="mini" slot="append" icon="el-icon-search" @click="uploadFile(0)"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>     
            <el-row>
              <el-col :span="24">
                <div>
                  <el-form-item label="" prop="fileUrl2">
                    <FilePreview :filesArr="filesArr" :fileType="0" fileTypeText="整改计划"></FilePreview>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>         
          </el-collapse-item>

          <el-collapse-item title="整改记录" name="3" v-if="!rectEdit || formData.rectificationStatus == 1">
            <el-row>
              <el-col :span="8">
                <el-form-item label="完成时间:" prop="rectificationFinishTime">
                  <el-date-picker
                          v-model="formData.rectificationFinishTime" :disabled='disStep1' :picker-options="rectificationFinishTimePickerOptions" placeholder="" type="date"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="整改记录:" prop="rectificationRecord">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.rectificationRecord"
                    :disabled='disStep1'
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" v-if="!(isInfo  || disStep1)">
                <div>
                  <el-form-item label="佐证材料:" prop="fileUrl4">
                    <el-input
                      disabled
                      placeholder=""
                      size="mini"
                      v-model="formData.fileUrl4">
                      <el-button :disabled='disStep1' size="mini" slot="append" icon="el-icon-search" @click="uploadFile(1)"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div>
                  <el-form-item label="">
                    <FilePreview :filesArr="filesArr" :fileType="1" fileTypeText="整改后"></FilePreview>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <!-- <el-row v-if="isInfo  || disStep1">
              <el-col :span="24">
                <div>
                  <el-form-item label="佐证材料:" prop="fileUrl4">
                    <FilePreview :filesArr="filesArr" :fileType="1" fileTypeText="整改后"></FilePreview>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>               -->
          </el-collapse-item>
          <!-- status = 9 -->
          <el-collapse-item title="县公司审核" name="4" v-if=" formData.status > 3 && formData.secondCompany.slice(-2) != '99' && formData.status != 10 && formData.status != 7 ">
            <el-row>
              <el-col :span="24">
                <el-form-item label="县公司审核:" prop="cityRectificationLeaderStatus">
                  <el-radio-group v-model="formData.cityRectificationLeaderStatus" @change="approveChange($event, 1)" :disabled='disStep9'>
                    <el-radio :label="0">通过</el-radio>
                    <el-radio :label="1">未通过</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="formData.cityRectificationLeaderStatus == 1 && !isInfo">
              <el-col :span="24">
                <el-form-item label="流程操作" prop="isRefuteAndCancel">
                  <el-radio-group v-model="formData.isRefuteAndCancel" :disabled='disStep9'>
                    <el-radio :label="0">回退</el-radio>
                    <!-- <el-radio :label="1" v-if="formData.hiddenSource != 1">终止</el-radio> -->
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核人:" prop="cityRectificationLeaderBy">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.cityRectificationLeaderBy"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核时间:" prop="cityRectificationLeaderTime">
                  <el-date-picker
                          v-model="formData.cityRectificationLeaderTime" placeholder="" type="datetime"
                          disabled size="mini" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="审核意见:" prop="cityRectificationLeaderOpinion">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.cityRectificationLeaderOpinion"
                    :disabled='disStep9'
                    maxlength="200"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            
          </el-collapse-item>
          <el-collapse-item title="市公司审核" name="4" v-if="formData.status > 3 && formData.status != 9 && formData.status != 10 && formData.status != 7">
            <el-row>
              <el-col :span="24">
                <el-form-item label="市公司审核:" prop="rectificationLeaderStatus">
                  <el-radio-group v-model="formData.rectificationLeaderStatus" @change="approveChange($event, 2)" :disabled='disStep2'>
                    <el-radio :label="0">通过</el-radio>
                    <el-radio :label="1">未通过</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="formData.rectificationLeaderStatus == 1 && !isInfo">
              <el-col :span="24">
                <el-form-item label="流程操作" prop="isRefuteAndCancel">
                  <el-radio-group v-model="formData.isRefuteAndCancel">
                    <el-radio :label="0">回退</el-radio>
                    <!-- <el-radio :label="1" v-if="formData.hiddenSource != 1">终止</el-radio> -->
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核人:" prop="rectificationLeaderBy">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.rectificationLeaderBy"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核时间:" prop="rectificationLeaderTime">
                  <el-date-picker
                          v-model="formData.rectificationLeaderTime" placeholder="" type="datetime"
                          disabled size="mini" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="审核意见:" prop="rectificationLeaderOpinion">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.rectificationLeaderOpinion"
                    :disabled='disStep2'
                    maxlength="200"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            
          </el-collapse-item>

          <el-collapse-item title="省公司审核" name="5" v-if="formData.status > 4 && formData.status != 9 && formData.status != 10 && formData.status != 7">
            <el-row>
              <el-col :span="24">
                <el-form-item label="省公司审核:" prop="rectificationExamineStatus">
                  <el-radio-group v-model="formData.rectificationExamineStatus" @change="approveChange($event, 3)" :disabled='disStep3'>
                    <el-radio :label="0">通过</el-radio>
                    <el-radio :label="1">未通过</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="formData.rectificationExamineStatus == 1 && !isInfo">
              <el-col :span="24">
                <el-form-item label="流程操作" prop="isRefuteAndCancel">
                  <el-radio-group v-model="formData.isRefuteAndCancel">
                    <el-radio :label="0">回退</el-radio>
                    <!-- <el-radio :label="1" v-if="formData.hiddenSource != 1">终止</el-radio> -->
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核人:" prop="rectificationBy">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.rectificationBy"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核时间:" prop="rectificationTime">
                  <el-date-picker
                          v-model="formData.rectificationTime" placeholder="" type="datetime"
                          disabled size="mini" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="审核意见:" prop="rectificationOpinion">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.rectificationOpinion"
                    :disabled='disStep3'
                    maxlength="200"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>

    <el-dialog :close-on-click-modal="false" :visible.sync="showUpload"
                v-if="showUpload" title="文件管理" append-to-body :modal-append-to-body="false">
      <Upload :tableName="fileParams.tableName"
              :read-only="fileParams.readOnly"
              :business-key="businessKey"
              :limit-num="fileParams.limitNum"
              :colum-name="fileParams.columName"
              :accept-type="fileParams.fileType"
              :max-fileSize='10000'
              @setFileName="setFileName"></Upload>
    </el-dialog>

    <!-- 流程人员选择框 -->
    <div v-if="openSelectFlowUser">
      <el-dialog title="发送人" :visible.sync="openSelectFlowUser" :modal-append-to-body="false"  width="100%" @close="handleProcessClose" class="sub_form_dialog">
        <select-flow-user 
          ref="selectFlowUser"
          :process-type="2"
          :processInstID="formData.workflowId" 
          :rectificationStatus="userState"
          :idd="formData.hiddenId || formData.id"
          :formData = "formData"
          @handleClose="handleProcessClose"
          @sendWorkflow="sendNetProFlow"
          v-loading="loadingSelectUser"/>        
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Upload from '@/components/safeDanger/Upload/index'
import { orderId, orderAdd, orderUpdate, queryShortNameList, createFlow, sendBpm, updateLibraryStatus, queryNextFlowUsers } from "@/api/safeDanger/report"
import { securitySupervision } from "@/api/safeDanger/networkSecure"
import { allCategory } from "@/api/safeDanger/computerroom"
import SelectFlowUser from "@/views/safeDanger/report/components/selectFlowUser";
import FilePreview from "../../report/components/filePreview";
import { getFiles } from "@/api/oss";
const uuid = require('uuid');

export default {
  name: "ComputerRoomDetail",
  components: {Upload, SelectFlowUser, FilePreview},
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
      'userId'
    ]),
  },
  props: {
    detailId: {
      type: String,
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isInfo: {
      type: Boolean,
      default: false
    },
    rectEdit: {
      type: Boolean,
      default: false
    },
    isRect: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      filesArr: [],

      disStep0: true,

      disStep1: false,
      disStep2: false,
      disStep3: false,
      disStep9: true,

      showRectPlan: false,
      showRectFinsh: false,
      showPresentingLeader: false,
      showPresentint: false,

      // 发送人列表
      openSelectFlowUser: false,
      loadingSelectUser: false,
      userState: 0,



      //展开第一个
      activeNames: ['1', '2', '3', '4', '5'],
      // 表单参数
      formData: {
        isRefuteAndCancel: undefined
      },
      queryDisabled: {
        showUnitSecond: false
      },
      //校验
      rules:{
        content:[{required:true,message:'请填写隐患内容',trigger:'blur'}],
        // hiddenSource:[{required:true,message:'请选择隐患来源',trigger:'change'}],
        hiddenCategory:[{required:true,message:'请选择隐患分类',trigger:'change'}],
        // hiddenItems:[{required:true,message:'请填写隐患依据',trigger:'blur'}],
        secondCompany:[{required:true,message:'请选择责任单位',trigger:'blur'}],
        responsibleBy:[{required:true,message:'请输入整改责任人',trigger:'blur'}],
        discoverBy:[{required:true,message:'请填写发现人',trigger:'blur'}],
        // discoverDate:[{required:true,message:'请填写发现日期',trigger:'blur'}],
        reportedBy:[{required:true,message:'请填写提报人',trigger:'blur'}],
        reportintDate:[{required:true,message:'请填写提报日期',trigger:'blur'}],
        // fileUrl:[{required:true,message:'请填写详情材料',trigger:'blur'}],
        rectificationStatus:[{required:true,message:'请填写整改完成状态',trigger:'change'}],



        rectificationExpectTime:[{required:true,message:'请填写预计整改完成时间',trigger:'blur'}],
        // rectificationPrecautions:[{required:true,message:'请填写已采取的防范措施',trigger:'blur'}],
        // rectificationPlan:[{required:true,message:'请填写整改计划',trigger:'blur'}],

        rectificationFinishTime:[{required:true,message:'请填写完成时间',trigger:'blur'}],
        rectificationRecord:[{required:true,message:'请填写整改记录',trigger:'blur'}],
        fileUrl4:[{required:true,message:'请上传佐证材料',trigger:'blur'}],

        cityRectificationLeaderStatus:[{required:true,message:'请选择',trigger:'change'}],
        cityRectificationLeaderBy:[{required:true,message:'请填写审核人',trigger:'blur'}],
        cityRectificationLeaderTime:[{required:true,message:'请填写审核时间',trigger:'blur'}],
        cityRectificationLeaderOpinion:[{required:true,message:'请填写审核意见',trigger:'blur'}],
        rectificationLeaderStatus:[{required:true,message:'请选择',trigger:'change'}],
        rectificationLeaderBy:[{required:true,message:'请填写审核人',trigger:'blur'}],
        rectificationLeaderTime:[{required:true,message:'请填写审核时间',trigger:'blur'}],
        rectificationLeaderOpinion:[{required:true,message:'请填写审核意见',trigger:'blur'}],
        rectificationExamineStatus:[{required:true,message:'请选择',trigger:'change'}],
        isRefuteAndCancel:[{required:true,message:'请填写流程操作',trigger:'blur'}],
        rectificationBy:[{required:true,message:'请填写审核人',trigger:'blur'}],
        rectificationTime:[{required:true,message:'请填写审核时间',trigger:'blur'}],
        rectificationOpinion:[{required:true,message:'请填写审核意见',trigger:'blur'}],
      },
      

      //附件上传
      showUpload: false,
      // businessKey: '8a0d2b9d5acca441015ad6066a4525b5',
      businessKey: '',
      evidenceType: 0,
      fileParams: {
        readOnly: false,
        tableName: 'cs_t_network_process',
        columName: 'fileUrl',
        fileType: 'jpg,jpeg,png,bmp,gif,pdf,rar,zip,tz,doc,docx,wps,xlsx,xls,pptx',
        limitNum: 100
      },

      // 下拉列表
      hiddenSourceList: [],
      hiddenCategoryList: [],
      hiddenCategoryList2: [],
      basicUnitSeconds: [], // 二级单位
      supervisionList: [],
      categoryList: [],

      rectificationFinishTimePickerOptions: {
        disabledDate: (time)=>{
          return time.getTime() < new Date(this.formData.reportintDate).getTime() - 8.64e7
        }
      },
      // rectificationFinishTimePickerOptions: {
      //   disabledDate: (time)=>{
      //     return time.getTime() > Date.now()
      //   }
      // },
      
    }
  },
  created() {
    this.initData()
    this.showInfo();
  },
  mounted() {

  },
  methods: {
    approveChange(val, type){
      if(val === 0){
        this.formData.isRefuteAndCancel = undefined
      }
      
      if( val == 1 ){
        this.formData.isRefuteAndCancel = 0
      }

      if( type == 1 ){
        this.formData.cityRectificationLeaderOpinion = val === 0 ? '同意' : '不同意'
      } else if( type == 2 ){
        this.formData.rectificationLeaderOpinion = val === 0 ? '同意' : '不同意'
      } else if( type == 3 ){
        this.formData.rectificationOpinion = val === 0 ? '同意' : '不同意'
      }
    },
    changeState1(val){
      if(val == 0){
        this.showRectPlan = true
      }else{
        this.showRectFinsh = true
      }
    },

    //发起流程
    sendBPM() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.formData.workflowId){

            if(this.formData.isRefuteAndCancel === 0){ // 回退
              this.userState = 1
            }
            if(this.formData.isRefuteAndCancel === 1){ // 终止
              this.userState = 2 
            }
            this.openSelectFlowUser = true;
            
          }else{
            this.formData.passStatus = 0
            createFlow(this.formData).then(res=>{
              if(res.code == 200){
                this.formData = res.data;
                // 修改获取节点人员状态
                // if(this.formData.status == 0 && this.formData.rectificationStatus == 2){
                //   this.userState = 1
                // }
                this.openSelectFlowUser = true;
              }
            })
          }
          
        }else{
          this.$message.warning('缺乏必要信息，请填写后再保存！')
        }
      })
    },
    saveToBPM() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.formData.isRefuteAndCancel == 0){ // 回退
            this.userState = 1
          }else if(this.formData.isRefuteAndCancel == 1){ // 终止
            this.userState = 2 
          }else{  // 通过
            this.userState = 0
          }

          // 当审核回退、终止时，直接走发送流程
          if( this.formData.isRefuteAndCancel === 0 || this.formData.isRefuteAndCancel === 1 || this.formData.status == 5 ){
            this.sendNetProFlow({ 
              bpmParams: {
                // list: [],
                processInstId: this.formData.workflowId
              }
            })
            return
          }


          this.openSelectFlowUser = true;
        } else{
          this.$message.warning('缺乏必要信息，请填写后再保存！')
        }
      })
    },
    //关闭选择人员界面
    handleProcessClose() {
      this.openSelectFlowUser = false;
      this.$emit('closeRoom');
    },
    //流程发送,供选人界面调用
    sendNetProFlow(data) {
      
      if(this.userState === 0){ // 通过
        this.formData.passStatus = 0
      }else{ // 不通过
        this.formData.passStatus = 1
        this.formData.returnOrFinishStatus = this.formData.isRefuteAndCancel
      }
      
      let param = {
        bpmParams: data.bpmParams,
        data: this.formData
      };
      this.loadingSelectUser = true;
      sendBpm(param).then(response => {
        if (response.code == 200) {
          
          if(this.formData.status == 5 && this.formData.rectificationExamineStatus == 0){
            this.$confirm('流程已结束，是否加入典型案例库', '提示', {
              confirmButtonText: '是',
              cancelButtonText: '否'
            }).then(()=>{
              let paramLibrary = {
                libraryStatus: 1,
                id: this.formData.id
              }
              updateLibraryStatus(paramLibrary).then(response => {
                if (response.code === 200) {
                  this.$message.success("操作成功");
                  this.closeProcessPage();
                  this.loadingSelectUser = false;
                }
              });
            }).catch(()=>{
              this.closeProcessPage();
              this.loadingSelectUser = false;
            })
          }else{
            this.$message.success('发送成功');
            this.closeProcessPage();
            this.loadingSelectUser = false;
          }

        }else {
          this.$message.error('流程发送失败');
          this.closeProcessPage();
          this.loadingSelectUser = false;
        }

      }).catch(() => {
        this.$message.error('流程发送出现异常');
        this.closeProcessPage();
        this.loadingSelectUser = false;
      })

      
    },
    //关闭流程页面
    closeProcessPage() {
      this.openSelectFlowUser = false;
      this.$emit('closeRoom');
    },



    // 渲染表格
    showInfo() {
      this.formData.status = 0


      if(this.detailId) {
        orderId(this.detailId).then(response =>{
          let datas = Object.assign({}, response.data) 
          datas.fileUrl1 = ''
          datas.fileUrl4 = ''
          datas.fileUrl2 = ''
          datas.fileUrl3 = ''
          datas.isRefuteAndCancel = undefined
          this.formData = datas
          // 获取 隐患分类二级列表
          this.changeHiddenCategory(this.formData.hiddenCategory)

          if(this.formData.status == 4){ // 分管主任审核
            this.disStep1 = true
          }
          if(this.formData.status == 5){ // 省公司审核
            this.disStep1 = true
            this.disStep2 = true
          }
          if(this.formData.status == 6){ // 省公司审核
            this.disStep1 = true
            this.disStep2 = true
            this.disStep3 = true
          }
          if(this.formData.status == 9){ // 县级审核
            this.disStep1 = true
            this.disStep9 = false
          }

          // 渲染附件的文件名称
          this.renderFileName()

          // 县级：审核人 审核时间 当修改时自动赋值登录信息 
          if(this.isEdit && this.formData.status == 9){
            this.formData.cityRectificationLeaderBy = this.nickName
            this.formData.cityRectificationLeaderTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          }
          // 分管主任：审核人 审核时间 当修改时自动赋值登录信息 
          if(this.isEdit && this.formData.status == 4){
            this.formData.rectificationLeaderBy = this.nickName
            this.formData.rectificationLeaderTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          }
          // 省公司：审核人 审核时间 当修改时自动赋值登录信息 
          if(this.isEdit && this.formData.status == 5){
            this.formData.rectificationBy = this.nickName
            this.formData.rectificationTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          }

          

        })        
      }else{
        this.formData.reportedBy = this.nickName
        this.formData.reportintDate = new Date()
      }
    },

    renderFileName(){
      if(this.formData.evidenceDTOList){
        this.formData.evidenceDTOList.forEach(el=>{
          el.evidenceType = el.type
        })
        let rectBefore =  this.formData.evidenceDTOList.filter(el => el.evidenceType == 0)  // 整改前材料 文件名称
        let rectBeforeName = rectBefore.map( el => el.fileName ).join(';')
        let rectPlan =  this.formData.evidenceDTOList.filter(el => el.evidenceType == 2)  // 整改计划材料 文件名称
        let rectPlanName = rectPlan.map( el => el.fileName ).join(';')
        let rectFinsh =  this.formData.evidenceDTOList.filter(el => el.evidenceType == 1)  // 整改后计划材料 文件名称
        let rectFinshName = rectFinsh.map( el => el.fileName ).join(';')

        this.formData.fileUrl1 = rectPlanName 
        this.formData.fileUrl4 = rectFinshName 
        this.formData.fileUrl2 = rectBeforeName 

        this.filesArr = this.formData.evidenceDTOList
      }

    },
    
    /** 提交按钮 */
    submitForm: function() {
      // this.formData.reportedBy = this.userId
      // this.formData.firstCompany = this.companyCode.slice(0, 4)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.detailId !== undefined) {
            orderUpdate(this.formData).then(response => {
              if (response.code === 200) {
                this.$message.success("修改成功");
                // this.$emit('closeRoom')
                this.formData = response.data
                // 渲染附件的文件名称
                this.renderFileName()
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }else{
          this.$message.warning('缺乏必要信息，请填写后再保存！')
        }
      });
    },

    // 获取下拉列表
    initData(){
      queryShortNameList({ parentId: this.companyCode.slice(0, 4) }).then(response => {
        this.basicUnitSeconds = response.data
      })
      this.getDicts('hidden_source').then(response => {
        this.hiddenSourceList = response.data
      });
      this.getDicts('hidden_category').then(response => {
        this.hiddenCategoryList = response.data
      });
      securitySupervision().then(res=>{
        this.supervisionList = res.data
      })
      allCategory().then(res=>{
        this.categoryList = res.data
      })
    },

    // 隐患分类选中
    changeHiddenCategory(value){ 
      if(value){
        let data;
        if(value == 0){ // 机房
          data = this.categoryList 
          data.forEach(el=> el.dictLabel = el.category )
        }else{
          data = this.supervisionList
          data.forEach(el=> el.dictLabel = el.supervision )
        }
        this.hiddenCategoryList2 = data
      }else{
        this.hiddenCategoryList2 = []
      }
    },

    //打开附件上传
    uploadFile(type) { // 点击按钮
      this.evidenceType = type

      if( this.formData.evidenceDTOList && this.formData.evidenceDTOList.length>0){
        let key0 = this.formData.evidenceDTOList.filter(el=>el.type == type)[0]
        if(key0){
          this.businessKey = key0.businessKey;
        }else{
          this.businessKey = uuid.v4().replace(/-/g, "");
        }
      }else{
        this.businessKey = uuid.v4().replace(/-/g, "");
      }

      this.showUpload = true;
    },
    checking(fileName){
      //验证图片正则表达式 jpg,jpeg,png,bmp,gif
      let reg = (/\jpg$|\jpeg$|\bmp$|\png$|\gif$/i) //图片格式
      fileName = fileName.substring(fileName.lastIndexOf('.')+1).toLowerCase();
      if(reg.test(fileName) || fileName === 'bmp'){
        return 1
      }else{
        return 0
      }
    },
    setFileName(fileName) { //设置附件值
      // 获取附件列表
      getFiles({
        businessKey: this.businessKey,
        tableName: this.tableName,
        columName: this.columName
      }).then(response =>{
        if(response.code === 200) {

          let fileArray =  response.data
          fileArray = fileArray.map(ele=>{
            let textImages = this.checking(ele.fileName);
            let fileUrl = ele.ossPath;
            let fileName = ele.fileName;

            return {
              type: this.evidenceType,
              evidenceType: this.evidenceType,
              businessKey: this.businessKey,
              textImages: textImages,
              fileName: fileName,
              fileUrl: fileUrl
            }
          })

          // let fileNameCollect = fileArray.map( el => el.fileName ).join(';')
          // if(this.evidenceType == 0){
          //   this.formData.fileUrl1 = fileNameCollect
          // }else if(this.evidenceType == 2 && this.formData.rectificationStatus == 0){
          //   this.formData.fileUrl2 = fileNameCollect
          // }else if(this.evidenceType == 2 && this.formData.rectificationStatus == 1){
          //   this.formData.fileUrl3 = fileNameCollect
          // }else if(this.evidenceType == 1){
          //   this.formData.fileUrl4 = fileNameCollect
          // }

          let fileNameCollect = fileArray.map( el => el.fileName ).join(';')
          if(this.evidenceType == 2){
            this.formData.fileUrl1 = fileNameCollect
          }else if(this.evidenceType == 0){
            this.formData.fileUrl2 = fileNameCollect
          }else if(this.evidenceType == 1){
            this.formData.fileUrl4 = fileNameCollect
          }

          let narr = this.formData.evidenceDTOList || []
          narr = narr.filter(ele=>{
            return ele.evidenceType != this.evidenceType
          })
          narr = [...narr, ...fileArray]
          // console.log(888, narr)

          this.formData.evidenceDTOList = narr
          
          let arrs = JSON.parse(JSON.stringify(this.formData.evidenceDTOList))
          arrs.forEach(el=> el.type = el.evidenceType)
          this.filesArr = arrs
        }
      })



      // this.formData.fileUrl = fileName;
      //新增的时候显示的值不更新,使用以下来解决
      // this.$forceUpdate()
    },
  }
}
</script>

<style lang='scss' scoped>
  .el-cascader{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }
  .el-input{
    width: 100%;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }

  ::v-deep .el-form-item {
    margin-bottom: 18px;
  }
  .rowSelect2 .el-select{
    width: 48.5%;
  }
  .mains{
    height: calc(100% - 39px);
    overflow: auto;
  }

</style>
