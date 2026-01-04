<template>
  <div v-loading="loading" style="width: 100%;height: 100%;">
    <div class="btns_row" v-if="!isInfo">
      <div>
        <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="submitForm" v-if="formData.status == 0 || formData.status == 7">保存
        </el-button>
        <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="sendBPM" v-if="formData.status == 0" :disabled="!formData.id">发起流程
        </el-button>
        <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="saveToBPM" v-if="formData.status>0 && formData.status != 7">发送
        </el-button>
      </div>

      <!--      <div class="d_start">-->
      <!--        <div class="d_center">-->
      <!--          <div v-for="(item,index) in selectAnlis" class="d_start d_tlg">-->
      <!--            <el-link type="primary" class="elink" @click="anliClick(item)">{{ item.name }}</el-link>-->
      <!--            <i class="el-icon-close i_close" @click="delLibraryLink(index)" v-if='!(disStep1 || formData.newType == 1)'></i>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <el-button type="primary" size="mini" style="margin-right: 5px;" @click="guanlSend" v-if='!(disStep1 || formData.newType == 1)'>关联案例库</el-button>-->
      <!--      </div>-->
    </div>

    <div class="mains">
      <el-form :disabled="isInfo" style="padding-right: 5px" :rules="rules" label-width="140px" ref="form" :model="formData" :status-icon="true">

        <div v-if=" steps && steps.length > 0 " style="padding: 12px 0px 12px 0px;">
          <el-steps :active="active" align-center finish-status="success" :process-status="formData.status == 0?'wait':'process'">
            <el-step v-for="(item,index) in steps" :key="index">
              <template #icon>
                <i class="el-icon-arrow-right" v-if="item.active == statusActive"></i>
              </template>
              <template #title>
                <span class="s_title">{{ item.title }}</span>
              </template>
              <template #description>
                <transition name="el-fade-in">
                  <span v-if="item.active == statusActive&&statusActiveUser&&formData.status!=0">({{ statusActiveUser }}{{ formData.status == 3 ? '整改' : '审核' }}中)</span>
                </transition>
              </template>
            </el-step>
          </el-steps>
        </div>

        <div v-if="isEdit || isInfo" style="font-size: 15px;padding: 5px;">
          <span>提报单号: {{ formData.serialNumber }}</span>
        </div>

        <el-collapse v-model="activeNames" style="padding-top: 5px">
          <el-collapse-item title="基本信息" name="1">
            <el-row style="margin-top: 10px">

              <el-col :span="24">
                <el-form-item label="隐患内容:" prop="content">
                  <el-input type="textarea" :autosize="{minRows:3}" maxlength="250" show-word-limit clearable size="mini" v-model="formData.content"
                            :disabled='disStep1 || formData.newType == 1'></el-input>
                </el-form-item>
              </el-col>


              <el-col :span="8" class="">
                <el-form-item label="隐患一级分类:" prop="hiddenType">
                  <el-select v-model="formData.hiddenCategory" @change="firstCategoryChange" :disabled='disStep1 || formData.newType == 1' size="mini" placeholder="">
                    <el-option
                      v-for="item in firstCategoryList"
                      :value="item.id"
                      :key="item.id"
                      :label="item.name"
                    >
                    </el-option>
                  </el-select>

                </el-form-item>
              </el-col>

              <el-col :span="8" class="">
                <el-form-item label="隐患二级分类:" prop="hiddenType">
                  <el-select v-model="formData.hiddenType" @change="secondCategoryChange" :disabled="secondCategoryList.length == 0 || disStep1 || formData.newType == 1"
                             size="mini" placeholder="">
                    <el-option
                      v-for="item in secondCategoryList"
                      :value="item.id"
                      :key="item.id"
                      :label="item.name"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>


              <!--v-if="!(formData.hiddenType == 118 || formData.hiddenType == 126)"-->
              <el-col :span="8">
                <el-form-item label="隐患排查对象:" prop="hiddenThird">
                  <el-select v-model="formData.hiddenThird" @change="screeningCategoryChange"
                             :disabled="screeningCategoryList.length == 0 || disStep1 || formData.newType == 1" size="mini" placeholder="">
                    <el-option
                      v-for="item in screeningCategoryList"
                      :value="item.id"
                      :key="item.id"
                      :label="item.name"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8" class="">
                <el-form-item label="隐患分类标准:" prop="hiddenTypeLevel">
                  <el-select v-model="formData.hiddenTypeLevel" @change="yhOptionsChange" :disabled="getDisabledLevel() || disStep1 || formData.newType == 1" size="mini"
                             clearable placeholder="">
                    <el-option
                      v-for="item in yhOptions"
                      :value="item.name"
                      :key="item.name"
                      :label="item.name"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="隐患来源:" prop="hiddenSource">
                  <el-select v-model="formData.hiddenSource" size="mini" clearable placeholder="" >
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

              <el-col :span="18" v-if="false">
                <el-form-item label="关联设备:">
                  <div class="d_glsb">
                    <div>
                      <el-tag style="margin-right: 6px" closable>0191293 / 济南公司 / 济南公司本部 / 交换机 / 济南交换机010</el-tag>
                      <el-tag style="margin-right: 6px" closable>0191293 / 济南公司 / 济南公司本部 / 交换机 / 济南交换机010</el-tag>
                    </div>

                    <div class="d_dianc">
                      <el-button type="success" size="mini" @click="deviceChoose">选择</el-button>
                    </div>
                  </div>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="隐患依据:" prop="hiddenItems">
                  <el-input type="textarea" :autosize="{minRows:3}" maxlength="250" placeholder="" clearable size="mini" v-model="formData.hiddenItems" :disabled='disStep1'
                            show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="发现人:" prop="discoverBy">
                  <el-select v-if=" userDetail.regionCode=='37' " v-model="formData.discoverBy" :disabled='disStep1 || formData.newType == 1' size="mini"
                             clearable placeholder>
                    <el-option v-for="item in discoverByList" :value="item.realName" :key="item.realName" :label="item.realName"></el-option>
                  </el-select>
                  <el-input v-else placeholder="" clearable size="mini" v-model="formData.discoverBy" :disabled='disStep1 || formData.newType == 1'></el-input>
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
                  <el-input placeholder="" clearable size="mini" v-model="formData.reportedBy" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="提报日期:" prop="reportintDate">
                  <el-date-picker v-model="formData.reportintDate" disabled placeholder="" type="date" value-format="yyyy-MM-dd" size="mini"
                                  style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>

            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="责任单位:" prop="secondCompany">

                  <el-input v-if="isInfo||isEdit" :value="getUnitName(formData)" disabled size="mini"></el-input>

                  <JobUnit2 v-else
                            @change="secondCompanyChange"
                            :orgId.sync="formData.secondCompany"
                            :firstCompanyName.sync="formData.firstCompanyName"
                            :firstCompany.sync="formData.firstCompany"
                            :secondCompanyName.sync="formData.secondCompanyName"
                            :secondCompany.sync="formData.secondCompany"
                            :disabledd='disStep1'></JobUnit2>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="整改责任人:" prop="responsibleUser">
                  <el-select @change="responsibleUserChange" v-model="formData.responsibleUser"
                             :disabled='disStep1 || !formData.secondCompany || !(formData.hiddenType || formData.hiddenCategory)' size="mini" clearable placeholder="">
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
                <el-form-item label="整改方式:" prop="rectificationMethod">
                  <el-select v-model="formData.rectificationMethod" @change="rectificationMethodChange" size="mini" clearable placeholder="" :disabled='disStep1'>
                    <el-option
                      v-for="item in rectificationMethodList"
                      :value="item.dictKey"
                      :key="item.dictKey"
                      :label="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
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
          </el-collapse-item>

          <el-collapse-item title="整改计划信息" name="2">
            <el-row>
              <el-col :span="8">
                <el-form-item label="预计整改完成时间:" prop="rectificationExpectTime">
                  <div class="d_start d_center">
                    <el-date-picker
                      ref="expectTimePicker"
                      :picker-options="expectTimePickerOptions"
                      v-model="formData.rectificationExpectTime"
                      :placeholder="getJihuaTimeHolder(formData)"
                      type="date"
                      value-format="yyyy-MM-dd" size="mini" style="width: 100%" :disabled='disStep1 || getJihuaTime(formData)'>
                    </el-date-picker>
                    <el-tooltip placement="right" v-if="formData.rectificationMethodCode=='0' || formData.rectificationMethodCode=='1'">
                      <template #content>
                        <div>
                          <div v-if="formData.rectificationMethodCode=='0'">
                            <span>立查立改（7天内完成） 预计整改完成时间可选择范围7天内</span>
                          </div>
                          <div v-else>
                            <span>按期整改（重大1个月；较大2个月；一般3个月）</span>
                          </div>
                        </div>

                      </template>
                      <i class="el-icon-question i_help"></i>
                    </el-tooltip>
                  </div>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="延期整改原因:" prop="extensionReason" v-if="formData.rectificationMethodCode=='2'">
                  <el-input v-model="formData.extensionReason" placeholder="请输入延期整改原因" :disabled="disStep1" size="mini" clearable></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="已采取的防范措施:" prop="rectificationPrecautions">
                  <el-input type="textarea" :autosize="{minRows:3}" maxlength="250" placeholder="" clearable size="mini" v-model="formData.rectificationPrecautions"
                            :disabled='disStep1' show-word-limit></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="整改计划:" prop="rectificationPlan">
                  <el-input type="textarea" :autosize="{minRows:3}" maxlength="250" placeholder="" clearable size="mini" v-model="formData.rectificationPlan"
                            :disabled='disStep1' show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!--            <el-row>-->
            <!--              <el-col :span="8">-->
            <!--                <div>-->
            <!--                  <el-form-item label="佐证材料:" prop="fileUrl2">-->
            <!--                    <el-input-->
            <!--                      disabled-->
            <!--                      placeholder=""-->
            <!--                      size="mini"-->
            <!--                      v-model="formData.fileUrl2">-->
            <!--                      <el-button :disabled='disStep1' size="mini" slot="append" icon="el-icon-search" @click="uploadFile(0)"></el-button>-->
            <!--                    </el-input>-->
            <!--                  </el-form-item>-->
            <!--                </div>-->
            <!--              </el-col>-->
            <!--            </el-row>-->
            <!--            <el-row>-->
            <!--              <el-col :span="24">-->
            <!--                <div>-->
            <!--                  <el-form-item label="" prop="fileUrl2">-->
            <!--                    <FilePreview :filesArr="filesArr" :fileType="0" fileTypeText="整改计划"></FilePreview>-->
            <!--                  </el-form-item>-->
            <!--                </div>-->
            <!--              </el-col>-->
            <!--            </el-row>-->
          </el-collapse-item>

          <!-- 8 提报(认领)-县公司审核  -->
          <el-collapse-item title="县公司审核" name="3" v-if="getShowCollapseItem(formData,8)">
            <el-row>
              <el-col :span="24">
                <el-form-item label="县公司审核:" prop="cityLeaderStatus">
                  <el-radio-group v-model="formData.cityLeaderStatus" @change="approveChange($event, 1)" :disabled='formData.status != 8'>
                    <el-radio :label="0">通过</el-radio>
                    <!--                    <el-radio :label="1">未通过</el-radio>-->
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="formData.cityLeaderStatus == 1 && !isInfo">
              <el-col :span="24">
                <el-form-item label="流程操作" prop="isRefuteAndCancel">
                  <el-radio-group v-model="formData.isRefuteAndCancel" :disabled='formData.status != 8'>
                    <el-radio :label="0">回退</el-radio>
                    <!--                    <el-radio :label="1" v-if="formData.hiddenSource != 1">终止</el-radio>-->
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
                  <el-input type="textarea" :autosize="{minRows:3}" maxlength="250" placeholder="" clearable size="mini" v-model="formData.cityLeaderOpinion"
                            :disabled='formData.status != 8'
                            show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </el-collapse-item>

          <!-- status = 1 -->
          <el-collapse-item title="市公司审核" name="3" v-if="getShowCollapseItem(formData,1)">
            <el-row>
              <el-col :span="24">
                <el-form-item label="市公司审核:" prop="presentingLeaderStatus">
                  <el-radio-group v-model="formData.presentingLeaderStatus" @change="approveChange($event, 2)" :disabled='formData.status != 1'>
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
                    <!--                    <el-radio :label="1" v-if="formData.hiddenSource != 1">终止</el-radio>-->
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
                  <el-input type="textarea" :autosize="{minRows:3}" maxlength="250" placeholder="" clearable size="mini" v-model="formData.presentingLeaderOpinion"
                            :disabled='formData.status != 1' show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>

    <!--    上传文件-->
    <div v-if="showUpload">
      <el-dialog title="文件管理" :visible.sync="showUpload" :modal-append-to-body="false" width="80%">
        <Upload :tableName="fileParams.tableName"
                :read-only="fileParams.readOnly"
                :business-key="businessKey"
                :limit-num="fileParams.limitNum"
                :colum-name="fileParams.columName"
                :accept-type="fileParams.fileType"
                :max-fileSize='10000'
                @setFileName="setFileName"></Upload>
      </el-dialog>
    </div>

    <!-- 流程人员选择框 -->
    <div v-if="openSelectFlowUser">
      <el-dialog title="请选择审批人" :visible.sync="openSelectFlowUser" :modal-append-to-body="false" width="100%" @close="handleProcessClose" class="sub_form_dialog">
        <select-flow-user
          ref="selectFlowUser"
          :process-type="2"
          :processInstID="formData.workflowId"
          :rectificationStatus="userState"
          :idd="formData.hiddenId || formData.id"
          :formData="formData"
          @handleClose="handleProcessClose"
          @sendWorkflow="sendNetProFlow"
          v-loading="loadingSelectUser"/>
      </el-dialog>
    </div>

    <!-- 批量隐患管理列表 -->
    <div v-if="hiddenTableVisible">
      <el-dialog title="隐患管理" :visible.sync="hiddenTableVisible"
                 :before-close="()=>{this.hiddenTableVisible=false}" width="80%" style="padding: 0px;"
                 :modal-append-to-body="false" :close-on-click-modal="false">
        <HiddenTable @select="selectHiddenTable" :roomId="roomId" :category="category" :yhbz="formData.hiddenTypeLevel" from-type="yhtb"/>
      </el-dialog>
    </div>

    <!-- 选择案例列表 -->
    <div v-if="anliTableVisible">
      <el-dialog title="案例管理" :visible.sync="anliTableVisible"
                 :before-close="()=>{this.anliTableVisible=false}" width="80%" style="padding: 0px;"
                 :modal-append-to-body="false" :close-on-click-modal="false">
        <AnliTable @closeRoom="anliTableVisible=false" @select="selectAnLiTable" :roomId="roomId" :select-anlis="selectAnlis"></AnliTable>
      </el-dialog>
    </div>

    <!-- 查看案例详情 -->
    <div v-if="anliDetialVisible">
      <el-dialog :title="anliName" :visible.sync="anliDetialVisible"
                 :before-close="()=>{this.anliDetialVisible=false}" width="80%" style="padding: 0px;"
                 :modal-append-to-body="false" :close-on-click-modal="false">
        <AnliDetial @closeRoom="()=>{anliDetialVisible=false}" :detailId="anliDetailId" :is-edit="true" :is-info="true"></AnliDetial>
      </el-dialog>
    </div>

    <!-- 流程人员选择框 -->
    <div v-if="recordDetailVis">
      <el-dialog title="请选择审批人" :visible.sync="recordDetailVis" :modal-append-to-body="false" width="100%" @close="handleProcessClose" class="sub_form_dialog">
        <RecordDetail @closeRoom="recordDetailVis=false" :hiddenNumber="formData.assocHidden" :is-info="true"/>
      </el-dialog>
    </div>

    <!-- 关联设备选择 -->
    <div v-if="deviceListVis">
      <el-dialog title="选择设备" :visible.sync="deviceListVis" :modal-append-to-body="false" width="100%" @close="()=>{deviceListVis=false}" class="sub_form_dialog">
        <device-table :is-info="true"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import RecordDetail from '@/views/safeDanger/record/components/detail'
import HiddenTable from "@/views/safeDanger/hiddenCategory/components/hiddenTable"
import DeviceTable from "@/views/safeDanger/report/components/deviceTable"
import AnliTable from "@/views/safeDanger/report/components/anliTable";
import {mapGetters} from 'vuex'
import Upload from '@/components/safeDanger/Upload/index'
import {orderId, orderAdd, orderUpdate, queryShortNameList, createFlow, sendBpm, discoverUser, orderClaim, selectNow} from "@/api/safeDanger/report"
import {securitySupervision} from "@/api/safeDanger/networkSecure"
import {allCategory} from "@/api/safeDanger/computerroom"
import {categoryTree, hiddenList, machineroomuserList, userDetail} from "@/api/safeDanger/hiddenCategory"
import SelectFlowUser from "./selectFlowUser";
import FilePreview from "./filePreview";

const uuid = require('uuid');

import {getFiles} from "@/api/oss";
import AnliDetial from "@/views/safeDanger/typicalCase/components/detail.vue";
import {getHiddenPCDict} from "@/util/hiddenDict";
import JobUnit2 from "@/views/safeDanger/report/components/jobUnit2.vue";


let reg_name = /^[1]+[3,8,4,5,6,7,9]+\d{9}$/;
let reg_zuoji = /^([0-9]{3,4}-)?[0-9]{7,8}$/; ///^([0-9]{3,4}-)+[0-9]{7,8}$/
let phoneCheck = (rule, value, callback) => {
  if (reg_name.test(value) || reg_zuoji.test(value) || !value) {
    callback();
  } else {
    return callback(new Error("请填写正确联系方式(纯数字格式或如0531-80812321的固话)"));
  }
};


export default {
  name: "ComputerRoomDetail",
  components: {JobUnit2, AnliDetial, AnliTable, DeviceTable, HiddenTable, Upload, SelectFlowUser, FilePreview, RecordDetail},
  computed: {
    // ...mapGetters([
    //   'nickName',
    //   'companyId',
    //   'companyCode',
    //   'userId'
    // ]),
    ...mapGetters(["userInfo","userDetail"]),
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
      recordDetailVis: false,

      discoverByList: [],
      firstCategoryList: [],
      secondCategoryList: [],
      screeningCategoryList: [],

      userList: [],
      filesArr: [],

      disStep1: false,

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

        hiddenType: undefined,
        hiddenThird: undefined,
        responsibleUser: '',
        isRefuteAndCancel: undefined,
        rectificationMethod: null,
        extensionReason: null,
        rectificationExpectTime: null,

        status: 0
      },
      yhOptions: getHiddenPCDict,
      queryDisabled: {
        showUnitSecond: false
      },
      //校验
      rules: {
        content: [{required: true, message: '请填写隐患内容', trigger: 'blur'}],
        hiddenSource: [{required: true, message: '请选择隐患来源', trigger: 'change'}],
        // hiddenCategory:[{required:true,message:'请选择隐患分类',trigger:'change'}],
        hiddenType: [{required: true, message: '请选择隐患分类', trigger: 'change'}],

        hiddenTypeLevel: [{required: true, message: '请选择隐患分类标准', trigger: 'change'}],
        hiddenItems: [{required: true, message: '请填写隐患依据', trigger: 'blur'}],
        discoverBy: [{required: true, message: '请填写发现人', trigger: 'blur'}],
        discoverDate: [{required: true, message: '请填写发现日期', trigger: 'blur'}],
        reportedBy: [{required: true, message: '请填写提报人', trigger: 'blur'}],
        reportintDate: [{required: true, message: '请填写提报日期', trigger: 'blur'}],
        secondCompany: [{required: true, message: '请选择责任单位', trigger: 'change'}],
        responsibleUser: [{required: true, message: '请填写整改责任人', trigger: 'change'}],
        responsiblePhone: [{validator: phoneCheck, trigger: 'blur'}],
        // fileUrl:[{required:true,message:'请填写详情材料',trigger:'blur'}],
        rectificationStatus: [{required: true, message: '请选择整改完成状态', trigger: 'change'}],

        rectificationMethod: [{required: true, message: '请选择整改方式', trigger: 'change'}],
        extensionReason: [{required: true, message: '请输入延期整改原因', trigger: 'blur'}],
        hiddenThird: [{required: true, message: '请选择隐患排查对象', trigger: 'change'}],


        rectificationExpectTime: [{required: true, message: '请填写预计整改完成时间', trigger: 'blur'}],
        fileUrl3: [{required: true, message: '请上传佐证材料', trigger: 'change'}],
        rectificationPrecautions: [{required: true, message: '请填写已采取的防范措施', trigger: 'blur'}],
        rectificationPlan: [{required: true, message: '请填写整改计划', trigger: 'blur'}],
        rectificationFinishTime: [{required: true, message: '请填写完成时间', trigger: 'blur'}],
        rectificationRecord: [{required: true, message: '请填写整改记录', trigger: 'blur'}],
        cityLeaderStatus: [{required: true, message: '请选择', trigger: 'change'}],
        cityLeaderBy: [{required: true, message: '请填写审核人', trigger: 'blur'}],
        cityLeaderTime: [{required: true, message: '请填写审核时间', trigger: 'blur'}],
        cityLeaderOpinion: [{required: true, message: '请填写审核意见', trigger: 'blur'}],
        presentingLeaderStatus: [{required: true, message: '请选择', trigger: 'change'}],
        isRefuteAndCancel: [{required: true, message: '请填写审核人', trigger: 'blur'}],
        presentingLeaderBy: [{required: true, message: '请填写审核时间', trigger: 'blur'}],
        presentingLeaderTime: [{required: true, message: '请填写审核意见', trigger: 'blur'}],
        presentingLeaderOpinion: [{required: true, message: '请选择', trigger: 'change'}],
        presentintExamineStatus: [{required: true, message: '请填写流程操作', trigger: 'blur'}],
        presentingBy: [{required: true, message: '请填写审核人', trigger: 'blur'}],
        presentingTime: [{required: true, message: '请填写审核时间', trigger: 'blur'}],
        presentintOpinion: [{required: true, message: '请填写审核意见', trigger: 'blur'}],
        assocHidden: [{required: false, message: '请输入关联隐患单号', trigger: 'blur'}],
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
      rectificationMethodList: [],
      hiddenSourceList: [],
      hiddenCategoryList: [],
      hiddenCategoryList2: [],
      basicUnitSeconds: [], // 二级单位
      supervisionList: [],
      categoryList: [],

      expectTimePickerOptions: null,
      expectTimePickerOptions1: {
        disabledDate: (time) => {
          //立查立改（7天内完成）

          //督导隐患认领功能 的 预计整改时间 按导入时间取计算预计整改完成时间 导入时间取值：createTime
          let date = new Date();
          date.setDate(date.getDate() + 7);


          let nowDate = new Date();
          if (this.formData.claimStatus == 0) {
            //督导检查
            if (this.formData.createTime) {
              nowDate = new Date(this.formData.createTime.replace(/-/g, "/"));
            }
          }

          return (time.getTime() < nowDate.getTime() - 8.64e7) || (time.getTime() > date.getTime());
        }
      },
      expectTimePickerOptions2: {
        disabledDate: (time) => {
          //根据隐患分类标准 重大 3个月、较大 6个月、一般 9个月
          let fItem = getHiddenPCDict.find(a => a.name == this.formData.hiddenTypeLevel);
          let date = new Date();

          let nowDate = new Date();
          if (this.formData.claimStatus == 0) {
            //督导检查
            if (this.formData.createTime) {
              nowDate = new Date(this.formData.createTime.replace(/-/g, "/"));
            }
          }

          if (fItem) {
            //按期整改（重大1个月；较大2个月；一般3个月）
            if (fItem.id == 1) {
              //重大
              date.setMonth(date.getMonth() + 1);
              return (time.getTime() < nowDate.getTime() - 8.64e7) || (time.getTime() > date.getTime());
            } else if (fItem.id == 2) {
              //较大
              date.setMonth(date.getMonth() + 2);
              return (time.getTime() < nowDate.getTime() - 8.64e7) || (time.getTime() > date.getTime())
            } else if (fItem.id == 3) {
              //一般
              date.setMonth(date.getMonth() + 3);
              return (time.getTime() < nowDate.getTime() - 8.64e7) || (time.getTime() > date.getTime())
            } else {
              return time.getTime() < nowDate.getTime() - 8.64e7;
            }
          } else {
            return time.getTime() < nowDate.getTime() - 8.64e7;
          }
        }
      },
      expectTimePickerOptions3: {
        disabledDate: (time) => {
          //延期整改（立项或新增设备等情况） 次年12月之前
          let date = new Date();
          date.setFullYear(date.getFullYear() + 1);
          date.setMonth(11);
          date.setDate(31);

          let nowDate = new Date();
          if (this.formData.claimStatus == 0) {
            //督导检查
            if (this.formData.createTime) {
              nowDate = new Date(this.formData.createTime.replace(/-/g, "/"));
            }
          }

          return (time.getTime() < nowDate.getTime() - 8.64e7) || (time.getTime() > date.getTime());
        }
      },
      expectTimePickerOptions4: {
        disabledDate: (time) => {
          //特殊隐患  时间不做限制
          // let nowDate = new Date();
          // if (this.formData.claimStatus == 0) {
          //   //督导检查
          //   if (this.formData.createTime) {
          //     nowDate = new Date(this.formData.createTime.replace(/-/g, "/"));
          //   }
          // }
          // return (time.getTime() < nowDate.getTime() - 8.64e7);
        }
      },
      rectificationFinishTimePickerOptions: {
        disabledDate: (time) => {
          let date = new Date();
          date.setDate(date.getDate() - 30);

          return (time.getTime() > Date.now()) || (time.getTime() < date.getTime())
        }
      },
      discoverDatePickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > new Date(this.formData.reportintDate).getTime()
        }
      },
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.formData.reportintDate).getTime() - 8.64e7
        }
      },
      presentingPickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.formData.presentingLeaderTime).getTime() - 8.64e7
        }
      },

      hiddenTableVisible: false,
      roomId: null,
      category: null,

      anliTableVisible: false,
      deviceListVis: false,
      selectAnlis: null,

      anliName: null,
      anliDetailId: null,
      anliDetialVisible: false,


      loading: false,
      steps: null,
      active: 1,
      statusActive: 1,
      statusActiveUser: null,
    }
  },
  watch: {
    'formData.rectificationMethodCode'(newVal, oldVal) {
      this.expectTimePickerOptions = {};
      this.$nextTick(() => {
        if (newVal == '0') {
          //立查立改（7天内完成）
          this.expectTimePickerOptions = this.expectTimePickerOptions1;
        } else if (newVal == '1') {
          //按期整改（重大1个月；较大2个月；一般3个月）
          this.expectTimePickerOptions = this.expectTimePickerOptions2;
        } else if (newVal == '2') {
          //延期整改（立项或新增设备等情况）
          this.expectTimePickerOptions = this.expectTimePickerOptions3;
        } else if (newVal == '3') {
          //特殊隐患
          this.expectTimePickerOptions = this.expectTimePickerOptions4;
        }
      })
    },
  },
  created() {
    this.initData()
    this.showInfo();
  },
  mounted() {

  },
  methods: {

    handleAssocHidden() {
      // console.log(909090, this.disStep1, this.formData.assocHidden)
      if (this.formData.assocHidden) {
        this.recordDetailVis = true
      }
    },
    firstCategoryChange(val) { // 隐患一级分类
      let name = this.firstCategoryList.filter(el => el.id == val)[0].name
      this.formData.hiddenCategoryName = name

      this.formData.hiddenType = undefined
      this.formData.hiddenTypeName = undefined
      this.formData.hiddenThird = undefined
      this.formData.hiddenThirdName = undefined

      if (this.formData.hiddenTypeLevel) {
        this.formData.hiddenTypeLevel = undefined
      }
      if (this.formData.hiddenItems) {
        this.formData.hiddenItems = undefined
      }

      this.secondCategoryList = this.firstCategoryList.filter(el => el.id == val)[0].children
      this.screeningCategoryList = [];


      if (this.formData.secondCompany && this.formData.hiddenCategory) {// 获取责任人列表
        this.getUserList()
      }

      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      })
    },
    secondCategoryChange(val) { // 隐患二级分类
      let name = this.secondCategoryList.filter(el => el.id == val)[0].name
      this.formData.hiddenTypeName = name

      this.formData.hiddenThird = undefined
      this.formData.hiddenThirdName = undefined

      if (this.formData.hiddenTypeLevel) {
        this.formData.hiddenTypeLevel = undefined
      }
      if (this.formData.hiddenItems) {
        this.formData.hiddenItems = undefined
      }

      this.screeningCategoryList = this.secondCategoryList.filter(el => el.id == val)[0].children

      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      })
    },
    screeningCategoryChange(val) { // 隐患排查对象
      let name = this.screeningCategoryList.filter(el => el.id == val)[0].name
      this.formData.hiddenThirdName = name

      if (this.formData.hiddenTypeLevel) {
        this.formData.hiddenTypeLevel = undefined
      }
      if (this.formData.hiddenItems) {
        this.formData.hiddenItems = undefined
      }
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      })
    },
    yhOptionsChange(val) {
      if (val) {
        // let isPer = (this.formData.hiddenType == 118 || this.formData.hiddenType == 126);
        // hiddenList({
        //   categoryId: isPer ? this.formData.hiddenType : this.formData.hiddenThird,
        //   type: this.formData.hiddenTypeLevel
        // }).then(response => {
        //   if (response.data && response.data.length == 1) {
        //     this.$set(this.formData, 'hiddenItems', response.data[0].content);
        //   } else {
        //     this.category = isPer ? this.formData.hiddenTypeName : this.formData.hiddenThirdName;
        //     this.roomId = isPer ? this.formData.hiddenType : this.formData.hiddenThird;
        //     this.hiddenTableVisible = true;
        //   }
        // });

        hiddenList({
          categoryId: this.formData.hiddenThird,
          type: this.formData.hiddenTypeLevel
        }).then(response => {
          if (response.data) {
            if (response.data.length == 1) {
              this.$set(this.formData, 'hiddenItems', response.data[0].content);
            } else if (response.data.length > 1) {
              this.category = this.formData.hiddenThirdName;
              this.roomId = this.formData.hiddenThird;
              this.hiddenTableVisible = true;
            }
          }
        });
      }

      if (this.formData.rectificationMethod) {
        if (this.formData.rectificationMethodCode == '1') {
          //按期整改（重大1个月；较大2个月；一般3个月）
          this.expectTimePickerOptions = {};
          this.$nextTick(() => {
            this.expectTimePickerOptions = this.expectTimePickerOptions2;
          });
        }
      }
    },
    selectAnLiTable(rows) {
      this.selectAnlis = rows;
      this.anliTableVisible = false;
      this.formData.hiddenLibraryId = this.selectAnlis.map(item => {
        return item.id
      }).join(',');
    },
    selectHiddenTable(row) {
      this.$set(this.formData, 'hiddenItems', row.content);
      this.hiddenTableVisible = false;
    },
    deviceChoose() {
      this.deviceListVis = true;
    },
    approveChange(val, type) {
      if (val === 0) {
        this.formData.isRefuteAndCancel = undefined
      } else if (val == 1) {
        this.formData.isRefuteAndCancel = 0
      }


      if (type == 1) {
        this.formData.cityLeaderOpinion = val === 0 ? '同意' : '不同意'
      } else if (type == 2) {
        this.formData.presentingLeaderOpinion = val === 0 ? '同意' : '不同意'
      } else if (type == 3) {
        this.formData.presentintOpinion = val === 0 ? '同意' : '不同意'
      }
    },
    changeState1(val) {
      this.$refs.form.clearValidate(['rectificationFinishTime', 'rectificationRecord', 'rectificationExpectTime'])
      if (val == 0) {
        this.showRectPlan = true
      } else {
        this.showRectFinsh = true
      }
    },

    responsibleUserChange(val) {
      if (val) {
        let name = this.userList.filter(el => el.userId == val)[0].userName
        this.formData.responsibleBy = name
      } else {
        this.formData.responsibleBy = ''
      }
    },

    //关联案例库
    guanlSend() {
      this.anliTableVisible = true;
    },

    delLibraryLink(index) {
      this.selectAnlis.splice(index, 1);
      this.formData.hiddenLibraryId = this.selectAnlis.map(item => {
        return item.id
      }).join(',');
    },
    anliClick(item) {
      this.anliDetialVisible = true;
      this.anliDetailId = item.id;
      this.anliName = item.name;
    },
    //发起流程
    sendBPM() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if (this.formData.workflowId) {
            // if(this.formData.status == 0 && this.formData.rectificationStatus == 1){
            //   this.userState = 1
            // }
            this.openSelectFlowUser = true;
            return
          }


          this.formData.passStatus = 0
          createFlow(this.formData).then(res => {
            if (res.code == 200) {
              this.formData = res.data;
              // 修改获取节点人员状态
              // if(this.formData.status == 0 && this.formData.rectificationStatus == 1){
              //   this.userState = 1
              // }
              this.openSelectFlowUser = true;
            }
          })

        } else {
          this.$message.warning('缺乏必要信息，请填写后再保存！')
        }
      })
    },

    saveToBPM() {
      //市公司审核&&一般隐患 不校验县公司提交数据
      let yhItem = getHiddenPCDict.find(a => a.name == this.formData.hiddenTypeLevel);
      if (this.formData.status == '1' && (yhItem && yhItem.id == 3)) {
        this.$delete(this.rules, 'cityLeaderStatus')
        this.$delete(this.rules, 'cityLeaderBy')
        this.$delete(this.rules, 'cityLeaderTime')
        this.$delete(this.rules, 'cityLeaderOpinion')
      }

      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.formData.isRefuteAndCancel == 0) { // 回退
            this.userState = 1
          } else if (this.formData.isRefuteAndCancel == 1) { // 终止
            this.userState = 2
          } else {  // 通过
            this.userState = 0
          }
          // 市公司审核不管是通过还是驳回，都直接发起流程不选人
          //if ((this.formData.status == 1 && this.formData.presentingLeaderStatus === 0) || this.formData.isRefuteAndCancel === 0 || this.formData.isRefuteAndCancel === 1) {
          if (this.formData.status == 1) {
            this.sendNetProFlow({
              bpmParams: {
                // list: [],
                processInstId: this.formData.workflowId
              }
            })
            return
          }
          this.openSelectFlowUser = true;
        } else {
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

      if (this.userState === 0) { // 通过
        this.formData.passStatus = 0
      } else { // 不通过
        this.formData.passStatus = 1
        this.formData.returnOrFinishStatus = this.formData.isRefuteAndCancel
      }

      if (this.formData.status == 8) { // 县审批
        this.formData.examineContent = this.formData.cityLeaderOpinion
      } else if (this.formData.status == 1) { // 市审批
        this.formData.examineContent = this.formData.presentingLeaderOpinion
      } else if (this.formData.status == 2) { // 省审批
        this.formData.examineContent = this.formData.presentintOpinion
      }

      let param = {
        bpmParams: data.bpmParams,
        data: this.formData
      };
      this.loadingSelectUser = true;
      sendBpm(param).then(response => {
        if (response.code == 200) {
          this.$message.success('发送成功');
        } else {
          this.$message.error('流程发送失败');
        }
        this.closeProcessPage();
        this.loadingSelectUser = false;
      }).catch(() => {
        // this.$message.error('流程发送出现异常');
        this.closeProcessPage();
        this.loadingSelectUser = false;
      })
    },
    //关闭流程页面
    closeProcessPage() {
      this.openSelectFlowUser = false;
      this.$emit('closeRoom');
    },


    renderCategory() {
      // 隐患分类(一级、二级、三级)
      categoryTree().then(response => { // 一级
        // console.log(123, response)
        this.firstCategoryList = response.data
        if (this.formData.hiddenCategory && this.formData.hiddenType) { // 二级
          this.secondCategoryList = this.firstCategoryList.filter(el => el.id == this.formData.hiddenCategory)[0].children

          if (this.formData.hiddenThird) { // 三级
            this.screeningCategoryList = this.secondCategoryList.filter(el => el.id == this.formData.hiddenType)[0].children
          }
        }
      })
    },
    // 渲染表格
    showInfo() {
      this.formData.status = 0

      if (this.detailId) { // 修改
        this.loading = true;
        orderId(this.detailId).then(response => {
          let datas = Object.assign({}, response.data)
          datas.responsibleUser = datas.responsibleUser || ''
          datas.fileUrl1 = ''
          datas.fileUrl2 = ''
          datas.fileUrl3 = ''
          datas.isRefuteAndCancel = undefined
          this.formData = datas

          // 隐患分类下拉列表赋值
          this.renderCategory()
          // 渲染对应的隐患分类二级列表
          // this.changeHiddenCategory(this.formData.hiddenCategory, true)
          // 提报县级审核
          if (this.formData.status == 8) {
            this.disStep1 = true
          }

          // 提报(认领)-市公司审核
          if (this.formData.status == 1) {
            this.disStep1 = true
          }

          // 渲染附件的文件名称
          this.renderFileName()

          // 县级：审核人 审核时间 当修改时自动赋值登录信息
          if (this.isEdit && this.formData.status == 8) {
            this.formData.cityLeaderBy = this.userDetail.realName
            // console.log(88,this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'))
            this.formData.cityLeaderTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          }
          // 分管主任：审核人 审核时间 当修改时自动赋值登录信息
          if (this.isEdit && this.formData.status == 1) {
            this.formData.presentingLeaderBy = this.userDetail.realName
            this.formData.presentingLeaderTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          }
          // 省公司：审核人 审核时间 当修改时自动赋值登录信息
          if (this.isEdit && this.formData.status == 2) {
            this.formData.presentingBy = this.userDetail.realName
            this.formData.presentingTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          }

          // 获取责任人列表
          this.getUserList()

          // 如果是未发布状态，提报人自动赋值
          if (this.formData.claimStatus === 0) {
            this.formData.reportedBy = this.userDetail.realName
          }

          if (this.formData.hiddenLibraryId) {
            let libIds = this.formData.hiddenLibraryId.split(',');
            let libList = libIds.map((item, index) => {
              return {
                name: `案例${index + 1}`,
                id: item
              }
            });

            this.selectAnlis = libList;
          }

          if (this.rectificationMethodList) {
            let fItem = this.rectificationMethodList.find(a => a.dictLabel == this.formData.rectificationMethod);
            if (fItem) {
              this.$set(this.formData, 'rectificationMethodCode', fItem.dictValue);
            }
          }

          //顶部流程节点信息
          if (this.isInfo) {
            //县公司、市公司审核时展示流程节点信息
            this.showStepsFromHiddenLevel()
          }
        }).finally(() => {
          this.loading = false;
        })
      } else { // 新增
        if (this.userDetail.regionCode == '37') {  //省账户
          this.formData.hiddenSource = '1'
        } else {
          this.formData.hiddenSource = '0'
        }

        //整改状态 默认全部是未完成
        this.formData.rectificationStatus = 0;

        // 赋值 提报人 提报日期
        this.formData.reportedBy = this.userDetail.realName
        this.formData.reportintDate = new Date()
        // 隐患分类下拉列表赋值
        this.renderCategory();
      }
    },

    //根据隐患来源（督导检查、自检自查）来判断 加载节点信息
    showStepsFromHiddenLevel() {
      //根据隐患来源（督导检查、自检自查）来判断
      if (this.formData.hiddenSource == '0') {
        //自检自查
        this.hiddenSourceFrom0();
      } else if (this.formData.hiddenSource == '1') {
        //督导检查
        this.hiddenSourceFrom1();
      }

      if (this.steps && this.steps.length > 0) {
        if (this.formData.status == 6) {
          //隐患单状态已结束
          this.active = this.steps[this.steps.length - 1].active;
          this.statusActive = this.active + 1;
        } else {
          let fItem = this.steps.find(a => a.status == this.formData.status);
          if (fItem) {
            if (fItem.active == 1) {
              this.active = 1;
              this.statusActive = 2;
            } else {
              this.active = fItem.active - 1;
              this.statusActive = fItem.active;
            }
          }
        }
      }

      //获取当前审核节点审核人
      selectNow(this.formData.workflowId).then(res => {
        //extensionReason
        if (res.data && res.data.length > 0) {
          this.statusActiveUser = res.data[0].partiName;
        }
      });
    },

    //自检自查方式
    hiddenSourceFrom0() {
      let data = this.formData;
      let index = 1;
      let yhItem = getHiddenPCDict.find(a => a.name == data.hiddenTypeLevel);
      if (yhItem) {
        this.steps = [];
        if (['1', '2'].find(a => a == yhItem.id) != null) {
          //重大、较大隐流程
          //1、提报阶段
          this.steps.push({active: index, title: '隐患提报', status: 0});
          //2、判断是否是县公司
          if (data.secondCompany && data.secondCompany.slice(-2) != '99') {
            //是 提报县公司审核（分管领导）
            this.steps.push({active: ++index, title: '提报县公司审核', status: 8});

            //提报市公司
            this.steps.push({active: ++index, title: '提报市公司审核', status: 1});
          } else {
            //否 提报市公司审核
            this.steps.push({active: ++index, title: '提报市公司审核', status: 1});
          }

          //整改阶段
          //3、隐患整改
          this.steps.push({active: ++index, title: '隐患整改', status: 3});

          //4、判断是否是县公司
          if (data.secondCompany && data.secondCompany.slice(-2) != '99') {
            //是 整改县公司审核（分管领导）
            this.steps.push({active: ++index, title: '整改县公司审核', status: 9});

            //整改市公司审核
            this.steps.push({active: ++index, title: '整改市公司审核', status: 4});
          } else {
            //否 整改市公司审核
            this.steps.push({active: ++index, title: '整改市公司审核', status: 4});
          }

          //5、省公司（授权） 复核、确认
          this.steps.push({active: ++index, title: '整改省公司审核', status: 5});
          //6、判断省公司是否进行了转审
          if (data.isPreliminary == '1') {
            //是 添加最后
            this.steps.push({active: ++index, title: '省公司转审', status: 18});
          }
        } else if (yhItem.id == '3') {
          //一般隐患
          //1、提报阶段
          this.steps.push({active: 1, title: '隐患提报', status: 0});
          //2、提报市公司审核
          this.steps.push({active: 2, title: '提报市公司审核', status: 1});
          //3、隐患整改
          this.steps.push({active: 3, title: '隐患整改', status: 3});
          //4 整改市公司审核
          this.steps.push({active: 4, title: '整改市公司审核', status: 4});
          // //5、省公司（授权） 复核、确认
          // this.steps.push({active: 5, title: '整改省公司审核', status: 5});
          // //6、判断省公司是否进行了转审
          // if (data.isPreliminary == '1') {
          //   //是 添加最后
          //   this.steps.push({active: 6, title: '省公司转审', status: 18});
          // }
        }
      }
    },
    //督导检查方式
    hiddenSourceFrom1() {
      let data = this.formData;
      let index = 1;
      let yhItem = getHiddenPCDict.find(a => a.name == this.formData.hiddenTypeLevel);
      if (yhItem) {
        this.steps = [];
        if (['1', '2'].find(a => a == yhItem.id) != null) {
          //重大、较大隐患流程
          //1、认领阶段
          this.steps.push({active: index, title: '隐患提报', status: 0});
          //2、判断是否是县公司
          if (data.secondCompany && data.secondCompany.slice(-2) != '99') {
            //是 认领县公司审核（分管领导）
            this.steps.push({active: ++index, title: '认领县公司审核', status: 8});

            // 提报市公司审核
            this.steps.push({active: ++index, title: '认领市公司审核', status: 1});
          } else {
            //否 提报市公司审核
            this.steps.push({active: ++index, title: '认领市公司审核', status: 1});
          }

          //整改阶段
          //3、隐患整改
          this.steps.push({active: ++index, title: '隐患整改', status: 3});
          //4、判断是否是县公司
          if (data.secondCompany && data.secondCompany.slice(-2) != '99') {
            //是 整改县公司审核（分管领导）
            this.steps.push({active: ++index, title: '整改县公司审核', status: 9});

            //整改市公司审核
            this.steps.push({active: ++index, title: '整改市公司审核', status: 4});
          } else {
            //否 整改市公司审核
            this.steps.push({active: ++index, title: '整改市公司审核', status: 4});
          }
          //5、现场督察人员复核
          this.steps.push({active: ++index, title: '现场督察人员复核', status: 15});
          //6、省公司（授权）确认
          this.steps.push({active: ++index, title: '整改省公司审核', status: 5});
          //7、判断省公司是否进行了转审
          if (data.isPreliminary == '1') {
            //是 添加最后
            this.steps.push({active: ++index, title: '省公司转审', status: 18});
          }
        } else if (yhItem.id == '3') {
          //一般隐患
          //1、认领阶段
          this.steps.push({active: 1, title: '隐患提报', status: 0});
          //2、认领市公司审核
          this.steps.push({active: 2, title: '认领市公司审核', status: 1});
          //3、隐患整改
          this.steps.push({active: 3, title: '隐患整改', status: 3});
          //4 整改市公司审核
          this.steps.push({active: 4, title: '整改市公司审核', status: 4});
          //5 现场督察人员复核、确认
          this.steps.push({active: 5, title: '现场督察人员复核', status: 15});
          // //6、省公司（授权） 复核、确认
          // this.steps.push({active: 6, title: '整改省公司督办', status: 5});
          // //7、判断省公司是否进行了转审
          // if (data.isPreliminary == '1') {
          //   //是 添加最后
          //   this.steps.push({active: 7, title: '省公司转审', status: 18});
          // }
        }
      }
    },

    getUserList() {
      let params = {
        categoryId: this.formData.hiddenCategory,
        firstCompany: this.formData.firstCompany,
        secondCompany: this.formData.secondCompany
      }
      userDetail(params).then(response => {
        this.userList = response.data
      })
    },

    renderFileName() {
      if (this.formData.evidenceDTOList) {
        this.formData.evidenceDTOList.forEach(el => {
          el.evidenceType = el.type
        })

        let rectBefore = this.formData.evidenceDTOList.filter(el => el.evidenceType == 2)  // 整改前材料 文件名称
        let rectBeforeName = rectBefore.map(el => el.fileName).join(';')
        let rectPlan = this.formData.evidenceDTOList.filter(el => el.evidenceType == 0)  // 未完成
        let rectPlanName = rectPlan.map(el => el.fileName).join(';')
        let completed = this.formData.evidenceDTOList.filter(el => el.evidenceType == 1)  // 已完成
        let completedName = completed.map(el => el.fileName).join(';')
        if (rectBeforeName) {
          this.formData.fileUrl1 = rectBeforeName
        }
        if (rectPlanName) {
          this.formData.fileUrl2 = rectPlanName
        }
        if (completedName) {
          this.formData.fileUrl3 = completedName
        }

        this.filesArr = this.formData.evidenceDTOList

      }
    },

    /** 提交按钮 */
    submitForm: function () {

      // this.formData.reportedBy = this.userId
      // this.formData.firstCompany = this.companyCode.slice(0, 4)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.formData.id) {
            if (this.formData.claimStatus === 0) {
              orderClaim(this.formData).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  // this.$emit('closeRoom')
                  this.formData = response.data
                  this.formData.firstCompanyName = response.data.firstOrgName
                  this.formData.secondCompanyName = response.data.shortName

                  if (this.formData.rectificationMethod) {
                    let fItem = this.rectificationMethodList.find(a => a.dictLabel == this.formData.rectificationMethod);
                    if (fItem) {
                      this.$set(this.formData, 'rectificationMethodCode', fItem.dictValue);
                    }
                  }
                  // 渲染附件的文件名称
                  this.renderFileName()
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              orderUpdate(this.formData).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  // this.$emit('closeRoom')
                  this.formData = response.data
                  this.formData.firstCompanyName = response.data.firstOrgName
                  this.formData.secondCompanyName = response.data.shortName

                  if (this.formData.rectificationMethod) {
                    let fItem = this.rectificationMethodList.find(a => a.dictLabel == this.formData.rectificationMethod);
                    if (fItem) {
                      this.$set(this.formData, 'rectificationMethodCode', fItem.dictValue);
                    }
                  }
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
                this.msgSuccess("新增成功");
                // this.$emit('closeRoom')
                this.formData = response.data
                this.formData.firstCompanyName = response.data.firstOrgName
                this.formData.secondCompanyName = response.data.shortName
                if (this.formData.rectificationMethod) {
                  let fItem = this.rectificationMethodList.find(a => a.dictLabel == this.formData.rectificationMethod);
                  if (fItem) {
                    this.$set(this.formData, 'rectificationMethodCode', fItem.dictValue);
                  }
                }
                // 渲染附件的文件名称
                this.renderFileName()
              } else {
                this.msgError(response.msg);
              }
            });
          }
        } else {
          this.$message.warning('缺乏必要信息，请填写后再保存！')
        }
      });
    },

    // 获取下拉列表
    initData() {
      // queryShortNameList({parentId: this.companyCode.slice(0, 4)}).then(response => {
      //   this.basicUnitSeconds = response.data
      // })
      this.getDicts('hidden_source').then(response => {
        this.hiddenSourceList = response.data
      });
      // this.getDicts('hidden_category').then(response => {
      //   let datas = response.data
      //   datas.forEach(el => {
      //     if (typeof el.dictValue == 'string') el.dictValue = Number(el.dictValue)
      //   })
      //   this.hiddenCategoryList = response.data
      // });
      this.getDicts('rectification_method').then(response => { //整改方式
        this.rectificationMethodList = response.data

        if (this.formData.rectificationMethod) {
          let fItem = this.rectificationMethodList.find(a => a.dictLabel == this.formData.rectificationMethod);
          if (fItem) {
            this.$set(this.formData, 'rectificationMethodCode', fItem.dictValue);
          }
        }
      });
      // securitySupervision().then(res => {
      //   this.supervisionList = res.data
      // })
      // allCategory().then(res => {
      //   this.categoryList = res.data
      // })

      discoverUser().then(res => {
        this.discoverByList = res.data
      })
    },

    // 隐患分类选中
    // changeHiddenCategory(value, initFlag) {
    //   if (value || value === 0) {
    //     let data;
    //     if (value == 0) { // 机房
    //       data = this.categoryList
    //       data.forEach(el => el.dictLabel = el.category)
    //     } else {
    //       data = this.supervisionList
    //       data.forEach(el => el.dictLabel = el.supervision)
    //     }
    //     this.hiddenCategoryList2 = data
    //   } else {
    //     this.hiddenCategoryList2 = []
    //   }

    //   if (!initFlag) {
    //     this.formData.hiddenType = ''
    //     this.hiddenTypeChange(value)
    //   }

    // },


    hiddenTypeChange(val) {
      this.formData.responsibleUser = ''
      this.formData.responsibleBy = ''
      // if(val){

      // }
    },
    secondCompanyChange(val) {
      this.hiddenTypeChange(val)
      if (this.formData.secondCompany && this.formData.hiddenCategory) {// 获取责任人列表
        this.getUserList()
      }
    },


    //打开附件上传
    uploadFile(type) { // 点击按钮
      this.evidenceType = type
      if (this.formData.evidenceDTOList && this.formData.evidenceDTOList.length > 0) {
        let key0 = this.formData.evidenceDTOList.filter(el => el.type == type)[0]
        if (key0) {
          this.businessKey = key0.businessKey;
        } else {
          this.businessKey = uuid.v4().replace(/-/g, "");
        }
      } else {
        this.businessKey = uuid.v4().replace(/-/g, "");
      }

      this.showUpload = true;
    },
    checking(fileName) {
      //验证图片正则表达式 jpg,jpeg,png,bmp,gif
      let reg = (/\jpg$|\jpeg$|\bmp$|\png$|\gif$/i) //图片格式
      fileName = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
      if (reg.test(fileName) || fileName === 'bmp') {
        return 1
      } else {
        return 0
      }
    },
    setFileName(fileName) { //设置附件值
      // 获取附件列表
      getFiles({
        businessKey: this.businessKey,
        tableName: this.tableName,
        columName: this.columName
      }).then(response => {
        if (response.code === 200) {

          let fileArray = response.data
          fileArray = fileArray.map(ele => {
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

          let fileNameCollect = fileArray.map(el => el.fileName).join(';')
          if (this.evidenceType == 2) {
            this.formData.fileUrl1 = fileNameCollect
          } else if (this.evidenceType == 0) {
            this.formData.fileUrl2 = fileNameCollect
          } else if (this.evidenceType == 1) {
            this.formData.fileUrl3 = fileNameCollect
          }


          let narr = this.formData.evidenceDTOList || []
          narr = narr.filter(ele => {
            return ele.evidenceType != this.evidenceType
          })
          narr = [...narr, ...fileArray]
          // console.log(888, narr)

          this.formData.evidenceDTOList = narr


          let arrs = JSON.parse(JSON.stringify(this.formData.evidenceDTOList))
          arrs.forEach(el => el.type = el.evidenceType)
          this.filesArr = arrs


          this.$refs["form"].validate(valid => {
            if (valid) {
              if (this.formData.id) {
                orderUpdate(this.formData).then(response => {
                  if (response.code === 200) {
                    this.msgSuccess("修改成功");

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
          });
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
    rectificationMethodChange(val) {
      if (this.rectificationMethodList) {
        let fItem = this.rectificationMethodList.find(a => a.dictLabel == val);
        if (fItem) {
          this.$set(this.formData, 'rectificationMethodCode', fItem.dictValue);
          this.formData.extensionReason = null;
        }
      }
      this.formData.rectificationExpectTime = null;
    },
    getDisabledLevel() {
      // if (this.formData.hiddenType == 118 || this.formData.hiddenType == 126) {
      //   return false;
      // } else {
      //   return !this.formData.hiddenThird;
      // }
      return !this.formData.hiddenThird
    },
    getJihuaTime(formData) {
      if (formData) {
        if (formData.rectificationMethodCode == 0) {
          //立查立改（7天内完成）
          return false;
        } else if (formData.rectificationMethodCode == 1) {
          //按期整改（重大1个月；较大2个月；一般3个月）
          return !formData.hiddenTypeLevel
        } else if (formData.rectificationMethodCode == 2 || formData.rectificationMethodCode == 3) {
          //延期整改（立项或新增设备等情况）
          //特殊隐患
          return false;
        }
      }
      return true
    },
    getJihuaTimeHolder(formData) {
      if (formData) {
        if (formData.rectificationMethodCode == 0) {
          //立查立改（7天内完成）
          return '请选择预计整改完成时间';
        } else if (formData.rectificationMethodCode == 1) {
          //按期整改（重大1个月；较大2个月；一般3个月）
          if (!formData.hiddenTypeLevel) {
            return '请选择隐患分类标准';
          }
        } else if (formData.rectificationMethodCode == 2 || formData.rectificationMethodCode == 3) {
          //延期整改（立项或新增设备等情况）
          //特殊隐患
          return '请选择预计整改完成时间';
        }
      }
      return '请选择整改方式';
    },

    getShowCollapseItem(formData, status) {
      if (formData) {
        let yhItem = getHiddenPCDict.find(a => a.name == formData.hiddenTypeLevel);
        if (status == '8') {
          //判断县公司审核节点是否显示
          if (formData.status == '8') {
            //如果单子详情状态为8，说明为县公司审核节点 直接显示县公司节点
            return true;
          } else if (formData.status == '1') {
            //如果单子详情状态为1，说明为市公司审核节点 需要进行隐患分类标准进行判断
            if (yhItem) {
              if (['1', '2'].find(a => a == yhItem.id) != null) {
                //较大、重大隐患下判断是否是县公司
                if (formData.secondCompany && formData.secondCompany.slice(-2) != '99') {
                  //是
                  return true;
                }
              }
            }
          }
        } else if (status == '1') {
          //判断市公司审核节点是否显示
          if (formData.status == '1') {
            return true;
          }
        }
      }
      return false;
    },
    getUnitName(formData) {
      if (formData && formData.firstOrgName && formData.shortName) {
        return `${formData.firstOrgName}-${formData.shortName}`
      }
      return null;
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .xiaoshou input {
  cursor: pointer !important;
}

.el-cascader {
  width: 100%;
}

.el-select {
  width: 100%;
}

.el-input {
  width: 100%;
}

.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100% !important;
}

::v-deep .el-form-item {
  margin-bottom: 18px;
}

.rowSelect2 .el-select {
  // width: 32%;
  width: 48.5%;
}


.btns_row {
  // padding-bottom: 10px;
  // border-bottom: 1px solid #EBEEF5;
  // position: absolute;
  // background: #fff;
  // width: calc(100% - 56px);
  // z-index: 1;
  // padding-top: 5px;
  margin: 8px 0px 10px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mains {
  height: calc(100% - 39px);
  overflow: auto;
}

.d_glsb {
  display: flex;
  justify-content: space-between;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 0px 3px 0px 10px;
  font-size: 13px;
}

.d_dianc {
  white-space: nowrap;
  color: #FFFFFF;
  font-size: 12px;
}

.d_start {
  display: flex;
  justify-content: flex-start;
}

.d_tlg {
  margin-right: 12px;
}

.d_center {
  display: flex;
  align-items: center;
}

.elink {
  text-decoration: underline;
  font-size: 13px;
  cursor: pointer;
}

.i_close {
  cursor: pointer;
}

.i_help {
  color: #A1A1A1;
  margin-left: 12px;
  font-size: 16px;
}

.s_title {
  font-size: 15px;
}
</style>
