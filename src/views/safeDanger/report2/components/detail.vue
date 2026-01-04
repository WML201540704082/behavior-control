<template>
  <div style="width: 100%;height: 100%;">
    <div class="btns_row" v-if="!isInfo" style="margin-bottom: 10px">
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="submitForm" v-if="formData.status == 0 || formData.status == 7">保存</el-button>        
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="sendBPM" v-if="formData.status == 0">发起流程</el-button>        
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="saveToBPM" v-if="formData.status>0 && formData.status != 7">发送</el-button>        
    </div>

    <div class="mains">
      <el-form :disabled="isInfo" style="padding-right: 5px" :rules="rules"  label-width="140px" ref="form" :model="formData"  :status-icon="true">
        <div v-if="isEdit || isInfo" style="font-size: 16px;margin-top: 5px;"> 提报单号: {{ formData.serialNumber }} </div>
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
                    :disabled='disStep1 || formData.newType == 1'
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="隐患来源:" prop="hiddenSource">
                  <el-select v-model="formData.hiddenSource" size="mini" clearable placeholder="" disabled>
                    <el-option
                      v-for="item in hiddenSourceList"
                      :value="item.dictKey"
                      :key="item.dictKey"
                      :label="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="10" class="rowSelect2">
                <el-form-item label="隐患分类:" prop="hiddenType">
                  <el-select v-model="formData.hiddenCategory" @change="changeHiddenCategory" size="mini" clearable placeholder="" :disabled='disStep1 || formData.newType == 1'>
                    <el-option
                      v-for="item in hiddenCategoryList"
                      :value="item.dictKey"
                      :key="item.dictKey"
                      :label="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                  <el-select v-model="formData.hiddenType" @change="hiddenTypeChange" :disabled="hiddenCategoryList2.length == 0 || disStep1 || formData.newType == 1" size="mini" clearable placeholder="" style="margin-left: 1%">
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
                    :disabled='disStep1 || formData.newType == 1'
                    maxlength="255"
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
                    :disabled='disStep1 || formData.newType == 1'
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="发现日期:" prop="discoverDate">
                  <el-date-picker
                          v-model="formData.discoverDate" :disabled='disStep1 || formData.newType == 1' placeholder="" type="date"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="discoverDatePickerOptions" size="mini" style="width: 100%">
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
                  <!-- <el-select @change="secondCompanyChange" v-model="formData.secondCompany" :disabled='disStep1' size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in basicUnitSeconds"
                      :value="item.orgId"
                      :key="item.orgId"
                      :label="item.shortName"
                    >
                    </el-option>
                  </el-select> -->
                  <JobUnit @change="secondCompanyChange" :orgId.sync="formData.secondCompany" :firstCompany.sync="formData.firstCompany" :secondCompanyName.sync="formData.shortName" :disabledd='disStep1' :isInfo='isInfo'></JobUnit>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="整改责任人:" prop="responsibleUser">  
                  <el-select @change="responsibleUserChange" v-model="formData.responsibleUser" :disabled='disStep1 || !formData.secondCompany || !(formData.hiddenType || formData.hiddenCategory)' size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in userList"
                      :value="item.userId"
                      :key="item.userId"
                      :label="item.userName"
                    >
                    </el-option>
                  </el-select>
                
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="责任人联系方式:" prop="responsiblePhone">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.responsiblePhone"
                    :disabled='disStep1'
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div>
                  <el-form-item label="详情材料:" prop="fileUrl1">
                    <el-input
                      disabled
                      placeholder=""
                      size="mini"
                      v-model="formData.fileUrl1">
                      <el-button :disabled='disStep1' size="mini" slot="append" icon="el-icon-search" @click="uploadFile(2)"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <div>
                  <el-form-item label="" prop="fileUrl1">
                    <FilePreview :filesArr="filesArr" :fileType="2" fileTypeText="整改前"></FilePreview>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>       

            <el-row>
              <el-col :span="24">
                <el-form-item label="整改完成状态:" prop="rectificationStatus">
                  <el-radio-group v-model="formData.rectificationStatus" @input="changeState1" :disabled='disStep1'>
                    <el-radio :label="0">未完成</el-radio>
                    <el-radio :label="1">已完成</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="整改计划信息" name="2" v-if="formData.rectificationStatus == 0">
            <el-row>
              <el-col :span="8">
                <el-form-item label="预计整改完成时间:" prop="rectificationExpectTime">
                  <el-date-picker
                          :picker-options="expectTimePickerOptions"
                          v-model="formData.rectificationExpectTime" placeholder="" type="date"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%" :disabled='disStep1'>
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
                     :disabled='disStep1'
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
                    :disabled='disStep1'
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
                      <el-button :disabled='disStep1' size="mini" slot="append" icon="el-icon-search" @click="uploadFile(0)"></el-button>
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

          <el-collapse-item title="整改完成信息" name="2" v-if="formData.rectificationStatus == 1">
            <el-row>
              <el-col :span="8">
                <el-form-item label="完成时间:" prop="rectificationFinishTime">
                  <el-date-picker
                          :picker-options="rectificationFinishTimePickerOptions"
                          v-model="formData.rectificationFinishTime" :disabled='disStep1' placeholder="" type="date"
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
              <el-col :span="8">
                <div>
                  <el-form-item label="佐证材料:" prop="fileUrl3">
                    <el-input
                      disabled
                      placeholder=""
                      size="mini"
                      v-model="formData.fileUrl3">
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
          </el-collapse-item>
          


          <!-- status = 8 -->
          <el-collapse-item title="县公司审核" name="3" v-if="formData.status > 0 && formData.secondCompany.slice(-2) != '99' && formData.rectificationStatus != 1 && formData.status != 10 && formData.status != 7 ">
            <el-row>
              <el-col :span="24">
                <el-form-item label="县公司审核:" prop="cityLeaderStatus">
                  <el-radio-group v-model="formData.cityLeaderStatus" @change="approveChange($event, 1)" :disabled='disStep8'>
                    <el-radio :label="0">通过</el-radio>
                    <el-radio :label="1">未通过</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="formData.cityLeaderStatus == 1 && !isInfo">
              <el-col :span="24">
                <el-form-item label="流程操作" prop="isRefuteAndCancel">
                  <el-radio-group v-model="formData.isRefuteAndCancel" :disabled='disStep8'>
                    <el-radio :label="0">回退</el-radio>
                    <el-radio :label="1" v-if="formData.hiddenSource != 1">终止</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核人:" prop="cityLeaderBy">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.cityLeaderBy"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核时间:" prop="cityLeaderTime">
                  <el-date-picker
                          v-model="formData.cityLeaderTime" placeholder="" type="datetime" 
                          disabled size="mini" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="审核意见:" prop="cityLeaderOpinion">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.cityLeaderOpinion"
                    :disabled='disStep8'
                    maxlength="200"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            
          </el-collapse-item>

          <!-- status = 1 -->
          <el-collapse-item title="市公司审核" name="3" v-if="formData.status > 0 && formData.status != 8 && formData.rectificationStatus != 1 && formData.status != 10 && formData.status != 7">  
            <el-row>
              <el-col :span="24">
                <el-form-item label="市公司审核:" prop="presentingLeaderStatus">
                  <el-radio-group v-model="formData.presentingLeaderStatus" @change="approveChange($event, 2)" :disabled='disStep2'>
                    <el-radio :label="0">通过</el-radio>
                    <el-radio :label="1">未通过</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="formData.presentingLeaderStatus == 1 && !isInfo">
              <el-col :span="24">
                <el-form-item label="流程操作:" prop="isRefuteAndCancel">
                  <el-radio-group v-model="formData.isRefuteAndCancel">
                    <el-radio :label="0">回退</el-radio>
                    <el-radio :label="1" v-if="formData.hiddenSource != 1">终止</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核人:" prop="presentingLeaderBy">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.presentingLeaderBy"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核时间:" prop="presentingLeaderTime">
                  <el-date-picker
                          v-model="formData.presentingLeaderTime" placeholder="" type="datetime"
                          disabled size="mini" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="审核意见:" prop="presentingLeaderOpinion">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.presentingLeaderOpinion"
                    :disabled='disStep2'
                    maxlength="200"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            
          </el-collapse-item>
          <!-- status = 2 -->
          <el-collapse-item title="省公司审核" name="4" v-if="formData.status > 1 > 0 && formData.status != 8 && formData.rectificationStatus != 1 && formData.status != 10 && formData.status != 7">
            <el-row>
              <el-col :span="24">
                <el-form-item label="省公司审核:" prop="presentintExamineStatus">
                  <el-radio-group v-model="formData.presentintExamineStatus" @change="approveChange($event, 3)" :disabled='disStep3'>
                    <el-radio :label="0">通过</el-radio>
                    <el-radio :label="1">未通过</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="formData.presentintExamineStatus == 1 && !isInfo">
              <el-col :span="24">
                <el-form-item label="流程操作:" prop="isRefuteAndCancel">
                  <el-radio-group v-model="formData.isRefuteAndCancel">
                    <el-radio :label="0">回退</el-radio>
                    <el-radio :label="1" v-if="formData.hiddenSource != 1">终止</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核人:" prop="presentingBy">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.presentingBy"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核时间:" prop="presentingTime">
                  <el-date-picker
                          v-model="formData.presentingTime" placeholder="" type="datetime"
                          disabled size="mini" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="审核意见:" prop="presentintOpinion">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.presentintOpinion"
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
      <el-dialog title="请选择审批人" :visible.sync="openSelectFlowUser" :modal-append-to-body="false"  width="100%" @close="handleProcessClose" class="sub_form_dialog">
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
import { orderId, orderAdd, orderUpdate, queryShortNameList, createFlow, sendBpm, selectCategoryUserList, orderClaim } from "@/api/safeDanger/report"
import { securitySupervision } from "@/api/safeDanger/networkSecure"
import { allCategory } from "@/api/safeDanger/computerroom"
import SelectFlowUser from "./selectFlowUser";
import FilePreview from "./filePreview";
const uuid = require('uuid');

import { getFiles } from "@/api/oss";

let reg_name= /^[1]+[3,8,4,5,6,7,9]+\d{9}$/;
let reg_zuoji = /^([0-9]{3,4}-)?[0-9]{7,8}$/; ///^([0-9]{3,4}-)+[0-9]{7,8}$/
let phoneCheck = (rule,value,callback) => {
  if (reg_name.test(value)||reg_zuoji.test(value)||!value ) {
    callback();
  }else {
    return callback(new Error("请填写正确联系方式(纯数字格式或如0531-80812321的固话)"));
  }
};


export default {
  name: "ComputerRoomDetail",
  components: {Upload, SelectFlowUser, FilePreview},
  computed: {
    ...mapGetters([
      'userDetail'
    ]),
  },
  props: {
    detailId: {
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userList: [],
      filesArr: [],

      disStep1: false,
      disStep2: false,
      disStep3: false,
      disStep8: true,

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
        fileUrl1: undefined,
        fileUrl2: undefined,
        fileUrl3: undefined,

        hiddenType: '',
        responsibleUser: '',
        isRefuteAndCancel: undefined
      },
      queryDisabled: {
        showUnitSecond: false
      },
      //校验
      rules:{
        content:[{required:true,message:'请填写隐患内容',trigger:'blur'}],
        hiddenSource:[{required:true,message:'请选择隐患来源',trigger:'change'}],
        // hiddenCategory:[{required:true,message:'请选择隐患分类',trigger:'change'}],
        hiddenType:[{required:true,message:'请选择隐患分类',trigger:'blur'}],
        hiddenItems:[{required:true,message:'请填写隐患依据',trigger:'blur'}],
        discoverBy:[{required:true,message:'请填写发现人',trigger:'blur'}],
        discoverDate:[{required:true,message:'请填写发现日期',trigger:'blur'}],
        reportedBy:[{required:true,message:'请填写提报人',trigger:'blur'}],
        reportintDate:[{required:true,message:'请填写提报日期',trigger:'blur'}],
        secondCompany:[{required:true,message:'请选择责任单位',trigger:'blur'}],
        responsibleUser:[{required:true,message:'请填写整改责任人',trigger:'blur'}],
        responsiblePhone:[{validator: phoneCheck, trigger: 'blur'}],
        // fileUrl:[{required:true,message:'请填写详情材料',trigger:'blur'}],
        rectificationStatus:[{required:true,message:'请选择整改完成状态',trigger:'blur'}],



        rectificationExpectTime:[{required:true,message:'请填写预计整改完成时间',trigger:'blur'}],
        fileUrl3:[{required:true,message:'请上传佐证材料',trigger:'change'}],
        rectificationPrecautions:[{required:true,message:'请填写已采取的防范措施',trigger:'blur'}],
        rectificationPlan:[{required:true,message:'请填写整改计划',trigger:'blur'}],
        rectificationFinishTime:[{required:true,message:'请填写完成时间',trigger:'blur'}],
        rectificationRecord:[{required:true,message:'请填写整改记录',trigger:'blur'}],
        cityLeaderStatus:[{required:true,message:'请选择',trigger:'change'}],
        cityLeaderBy:[{required:true,message:'请填写审核人',trigger:'blur'}],
        cityLeaderTime:[{required:true,message:'请填写审核时间',trigger:'blur'}],
        cityLeaderOpinion:[{required:true,message:'请填写审核意见',trigger:'blur'}],
        presentingLeaderStatus:[{required:true,message:'请选择',trigger:'change'}],
        isRefuteAndCancel:[{required:true,message:'请填写审核人',trigger:'blur'}],
        presentingLeaderBy:[{required:true,message:'请填写审核时间',trigger:'blur'}],
        presentingLeaderTime:[{required:true,message:'请填写审核意见',trigger:'blur'}],
        presentingLeaderOpinion:[{required:true,message:'请选择',trigger:'change'}],
        presentintExamineStatus:[{required:true,message:'请填写流程操作',trigger:'blur'}],
        presentingBy:[{required:true,message:'请填写审核人',trigger:'blur'}],
        presentingTime:[{required:true,message:'请填写审核时间',trigger:'blur'}],
        presentintOpinion:[{required:true,message:'请填写审核意见',trigger:'blur'}],
      },
      

      //附件上传
      showUpload: false,
      // businessKey: '8a0d2b9d5acca441015ad6066a4525b5',
      businessKey: '',
      evidenceType: 0,
      fileParams: {
        readOnly: false,
        // tableName: 'cs_t_network_process',
        // columName: 'fileUrl',
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

      expectTimePickerOptions: {
        disabledDate: (time)=>{
          return time.getTime() < Date.now()  - 8.64e7
        }
      },
      rectificationFinishTimePickerOptions: {
        disabledDate: (time)=>{
          return time.getTime() > Date.now()
        }
      },
      discoverDatePickerOptions: {
        disabledDate: (time)=>{
          return time.getTime() > new Date(this.formData.reportintDate).getTime()
        }
      },
      pickerOptions: {
        disabledDate: (time)=>{
          return time.getTime() < new Date(this.formData.reportintDate).getTime()  - 8.64e7
        }
      },
      presentingPickerOptions: {
        disabledDate: (time)=>{
          return time.getTime() < new Date(this.formData.presentingLeaderTime).getTime()  - 8.64e7
        }
      }
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
      
      if( val == 1 && this.formData.hiddenSource == 1 ){
        // console.log(98, this.formData.hiddenSource, val, this.formData.isRefuteAndCancel)
        this.formData.isRefuteAndCancel = 0
      }

      if( type == 1 ){
        this.formData.cityLeaderOpinion = val === 0 ? '同意' : '不同意'
      } else if( type == 2 ){
        this.formData.presentingLeaderOpinion = val === 0 ? '同意' : '不同意'
      } else if( type == 3 ){
        this.formData.presentintOpinion = val === 0 ? '同意' : '不同意'
      }
    },
    changeState1(val){
      this.$refs.form.clearValidate([ 'rectificationFinishTime', 'rectificationRecord', 'rectificationExpectTime' ])
      if(val == 0){
        this.showRectPlan = true
      }else{
        this.showRectFinsh = true
      }
    },
    
    responsibleUserChange(val){
      if(val){
        let name = this.userList.filter(el => el.userId == val)[0].userName
        this.formData.responsibleBy = name
      }else{
        this.formData.responsibleBy = ''
      }
    },

    //发起流程
    sendBPM() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if(this.formData.workflowId){
            // if(this.formData.status == 0 && this.formData.rectificationStatus == 1){
            //   this.userState = 1
            // }
            this.openSelectFlowUser = true;
            return
          }



          this.formData.passStatus = 0
          createFlow(this.formData).then(res=>{
            if(res.code == 200){
              this.formData = res.data;
              // 修改获取节点人员状态
              // if(this.formData.status == 0 && this.formData.rectificationStatus == 1){
              //   this.userState = 1
              // }
              this.openSelectFlowUser = true;
            }
          })

        } else{
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

          // 当省公司审核，选择通过时下一步操作
          if( (this.formData.status == 2 && this.formData.presentintExamineStatus === 0) || this.formData.isRefuteAndCancel === 0 || this.formData.isRefuteAndCancel === 1  ){
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
          this.$message.success('发送成功');
        }else {
          this.$message.error('流程发送失败');
        }
        this.closeProcessPage();
        this.loadingSelectUser = false;
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


      if(this.detailId) { // 修改
        orderId(this.detailId).then(response =>{
          let datas = Object.assign({}, response.data)
          datas.fileUrl1= ''
          datas.fileUrl2= ''
          datas.fileUrl3= ''
          datas.isRefuteAndCancel = undefined
          this.formData = datas
          
          // 渲染对应的隐患分类二级列表
          this.changeHiddenCategory(this.formData.hiddenCategory, true)
          // 禁用相关进程所有表单
          if(this.formData.status == 1){ // 分管主任审核
            this.disStep1 = true
          }
          if(this.formData.status == 2){ // 省公司审核
            this.disStep1 = true
            this.disStep2 = true
          }
          if(this.formData.status == 8){ // 县级审核
            this.disStep1 = true
            this.disStep8 = false
          }

          // 渲染附件的文件名称
          this.renderFileName()

          // 县级：审核人 审核时间 当修改时自动赋值登录信息 
          if(this.isEdit && this.formData.status == 8){
            this.formData.cityLeaderBy = this.userDetail.realName
            // console.log(88,this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'))
            this.formData.cityLeaderTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          }
          // 分管主任：审核人 审核时间 当修改时自动赋值登录信息 
          if(this.isEdit && this.formData.status == 1){
            this.formData.presentingLeaderBy = this.userDetail.realName
            this.formData.presentingLeaderTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          }
          // 省公司：审核人 审核时间 当修改时自动赋值登录信息 
          if(this.isEdit && this.formData.status == 2){
            this.formData.presentingBy = this.userDetail.realName
            this.formData.presentingTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          }

          // 获取责任人列表
          selectCategoryUserList({
            flagType: this.formData.hiddenCategory,
            categoryId: this.formData.hiddenType,
            firstCompany: this.formData.firstCompany,
            secondCompany: this.formData.secondCompany,
          }).then(res=>{
            this.userList = res.data
          })


          // 如果是未发布状态，提报人自动赋值
          if(this.formData.claimStatus === 0){
            this.formData.reportedBy = this.userDetail.realName
          }
        })        
      }else{ // 新增
        if(this.userDetail.regionCode == '37'){  //省账户
          this.formData.hiddenSource = '1'
        }else{
          this.formData.hiddenSource = '0'
        }
        
        // 赋值 提报人 提报日期
        this.formData.reportedBy = this.userDetail.realName
        this.formData.reportintDate = new Date()
      }
    },

    renderFileName(){
      if(this.formData.evidenceDTOList){
        this.formData.evidenceDTOList.forEach(el=>{
          el.evidenceType = el.type
        })

        let rectBefore =  this.formData.evidenceDTOList.filter(el => el.evidenceType == 2)  // 整改前材料 文件名称
        let rectBeforeName = rectBefore.map( el => el.fileName ).join(';')
        let rectPlan =  this.formData.evidenceDTOList.filter(el => el.evidenceType == 0)  // 未完成
        let rectPlanName = rectPlan.map( el => el.fileName ).join(';')
        let completed =  this.formData.evidenceDTOList.filter(el => el.evidenceType == 1)  // 已完成
        let completedName = completed.map( el => el.fileName ).join(';')
        if(rectBeforeName){
          this.formData.fileUrl1 = rectBeforeName
        } 
        if(rectPlanName){
          this.formData.fileUrl2 = rectPlanName 
        }
        if(completedName){
          this.formData.fileUrl3 = completedName 
        }

        this.filesArr = this.formData.evidenceDTOList
      }
    },
    
    /** 提交按钮 */
    submitForm: function() {

      // console.log(366, this.formData)
      // return

      // this.formData.reportedBy = this.userId
      // this.formData.firstCompany = this.companyCode.slice(0, 4)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.formData.id) {

            if(this.formData.claimStatus === 0){
              orderClaim(this.formData).then(response => {
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
            }else{
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

          } else {
            orderAdd(this.formData).then(response => {
              if (response.code === 200) {
                this.$message.success("新增成功");
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
      // queryShortNameList({ parentId: this.userDetail.regionCode.slice(0, 4) }).then(response => {
      //   this.basicUnitSeconds = response.data
      // })
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
    changeHiddenCategory(value, initFlag){ 
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

      if(!initFlag){
        this.formData.hiddenType = ''
        this.hiddenTypeChange(value)
      }

    },


    hiddenTypeChange(val){
      this.formData.responsibleUser = ''
      this.formData.responsibleBy = ''
      // if(val){
        if(this.formData.secondCompany && this.formData.hiddenCategory){
          selectCategoryUserList({
            flagType: this.formData.hiddenCategory,
            categoryId: this.formData.hiddenType,
            firstCompany: this.formData.firstCompany,
            secondCompany: this.formData.secondCompany,
          }).then(res=>{
            this.userList = res.data
          })
        }
      // }
    },
    secondCompanyChange(val){
      this.hiddenTypeChange(val)
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

          let fileNameCollect = fileArray.map( el => el.fileName ).join(';')
          if(this.evidenceType == 2){
            this.formData.fileUrl1 = fileNameCollect
          }else if(this.evidenceType == 0){
            this.formData.fileUrl2 = fileNameCollect
          }else if(this.evidenceType == 1){
            this.formData.fileUrl3 = fileNameCollect
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

          if (this.formData.id) {
            orderUpdate(this.formData).then(response => {
              if (response.code === 200) {
                this.$message.success("修改成功");
               
                // this.formData = response.data
                // console.log(200, this.formData)
                // // 渲染附件的文件名称
                // this.renderFileName()
              } else {
                this.msgError(response.msg);
              }
            });
          }
          
        }
      })
      



      // let newArr = fileName.split(';')
      // newArr = newArr.map(ele=>{

      //   let textImages;
      //   let fileUrl;

      //   //验证图片正则表达式 jpg,jpeg,png,bmp,gif
      //   let reg = (/\jpg$|\jpeg$|\bmp$|\png$|\gif$/i) //图片格式
      //   let fileName = ele.substring(ele.lastIndexOf('.')+1).toLowerCase();
      //   if(reg.test(fileName) || fileName === 'bmp'){
      //     textImages = 1
      //   }else{
      //     textImages = 0
      //   }

      //   return {
      //     evidenceType: this.evidenceType,
      //     businessKey: this.businessKey,
      //     textImages: textImages,
      //     fileName:
      //     fileUrl:
          
      //   }

      // })

      
      
      // this.formData.fileUrl = fileName;
      //新增的时候显示的值不更新,使用以下来解决
      this.$forceUpdate()
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


  .btns_row{
    // padding-bottom: 10px;
    // border-bottom: 1px solid #EBEEF5;
    // position: absolute;
    // background: #fff;
    // width: calc(100% - 56px);
    // z-index: 1;
    // padding-top: 5px;
  }
  .mains{
    height: calc(100% - 39px);
    overflow: auto;
  }

</style>
