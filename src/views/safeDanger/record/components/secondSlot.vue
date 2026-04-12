<template>
  <div>
    <!-- 正常发送 县 -->
    <el-steps v-if="formData.secondCompany && formData.secondCompany.slice(-2) != '99' && formData.newType != 1 && formData.rectificationStatus === 0" :active="active" align-center style="margin-bottom: 20px">
      <el-step title="隐患提报" @click.native="tabClick(1, 1)"></el-step>
      <el-step title="县公司审核" @click.native="tabClick(2, 2)"></el-step>
      <el-step title="市公司审核" @click.native="tabClick(3, 3)"></el-step>
      <el-step title="省公司审核" @click.native="tabClick(4, 4)"></el-step>
      <el-step title="隐患整改" @click.native="tabClick(5, 5)"></el-step>
      <el-step title="县公司审核" @click.native="tabClick(6, 6)" ></el-step>
      <el-step title="市公司审核" @click.native="tabClick(7, 7)"></el-step>
      <el-step title="省公司审核" @click.native="tabClick(8, 8)"></el-step>
    </el-steps>
    <!-- 正常发送 市 -->
    <el-steps v-else-if="formData.secondCompany && formData.secondCompany.slice(-2) == '99' && formData.newType != 1 && formData.rectificationStatus === 0" :active="active" align-center style="margin-bottom: 20px">
      <el-step title="隐患提报" @click.native="tabClick(1, 1)"></el-step>
      <el-step title="市公司审核" @click.native="tabClick(3, 2)"></el-step>
      <el-step title="省公司审核" @click.native="tabClick(4, 3)"></el-step>
      <el-step title="隐患整改" @click.native="tabClick(5, 4)"></el-step>
      <el-step title="市公司审核" @click.native="tabClick(7, 5)"></el-step>
      <el-step title="省公司审核" @click.native="tabClick(8, 6)"></el-step>
    </el-steps>
    <!-- 正常发送 县 已完成 -->
    <el-steps v-else-if="formData.secondCompany && formData.secondCompany.slice(-2) != '99' && formData.newType != 1 && formData.rectificationStatus === 1" :active="active" align-center style="margin-bottom: 20px">
      <el-step title="隐患提报" @click.native="tabClick(1, 1)"></el-step>
      <el-step title="隐患整改" @click.native="tabClick(5, 2)"></el-step>
      <el-step title="县公司审核" @click.native="tabClick(6, 3)" ></el-step>
      <el-step title="市公司审核" @click.native="tabClick(7, 4)"></el-step>
      <el-step title="省公司审核" @click.native="tabClick(8, 5)"></el-step>
    </el-steps>
    <!-- 正常发送 市 已完成 -->
    <el-steps v-else-if="formData.secondCompany && formData.secondCompany.slice(-2) == '99' && formData.newType != 1 && formData.rectificationStatus === 1" :active="active" align-center style="margin-bottom: 20px">
      <el-step title="隐患提报" @click.native="tabClick(1, 1)"></el-step>
      <el-step title="隐患整改" @click.native="tabClick(5, 2)"></el-step>
      <el-step title="市公司审核" @click.native="tabClick(7, 3)"></el-step>
      <el-step title="省公司审核" @click.native="tabClick(8, 4)"></el-step>
    </el-steps>
    <!-- 批量导入 县 -->
    <el-steps v-else-if="formData.secondCompany && formData.secondCompany.slice(-2) != '99' && formData.newType == 1 && formData.rectificationStatus === 0" :active="active" align-center style="margin-bottom: 20px">
      <el-step title="隐患认领" @click.native="tabClick(1, 1)"></el-step>
      <el-step title="县公司审核" @click.native="tabClick(2, 2)"></el-step>
      <el-step title="市公司审核" @click.native="tabClick(3, 3)"></el-step>
      <el-step title="省公司审核" @click.native="tabClick(4, 4)"></el-step>
      <el-step title="隐患整改" @click.native="tabClick(5, 5)"></el-step>
      <el-step title="县公司审核" @click.native="tabClick(6, 6)" ></el-step>
      <el-step title="市公司审核" @click.native="tabClick(7, 7)"></el-step>
      <el-step title="省公司审核" @click.native="tabClick(8, 8)"></el-step>
    </el-steps>
    <!-- 批量导入 市 -->
    <el-steps v-else-if="formData.secondCompany && formData.secondCompany.slice(-2) == '99' && formData.newType == 1 && formData.rectificationStatus === 0" :active="active" align-center style="margin-bottom: 20px">
      <el-step title="隐患认领" @click.native="tabClick(1, 1)"></el-step>
      <el-step title="市公司审核" @click.native="tabClick(3, 2)"></el-step>
      <el-step title="省公司审核" @click.native="tabClick(4, 3)"></el-step>
      <el-step title="隐患整改" @click.native="tabClick(5, 4)"></el-step>
      <el-step title="市公司审核" @click.native="tabClick(7, 5)"></el-step>
      <el-step title="省公司审核" @click.native="tabClick(8, 6)"></el-step>
    </el-steps>
    <!-- 批量导入 县 已完成 -->
    <el-steps v-else-if="formData.secondCompany && formData.secondCompany.slice(-2) != '99' && formData.newType == 1 && formData.rectificationStatus === 1" :active="active" align-center style="margin-bottom: 20px">
      <el-step title="隐患认领" @click.native="tabClick(1, 1)"></el-step>
      <el-step title="隐患整改" @click.native="tabClick(5, 2)"></el-step>
      <el-step title="县公司审核" @click.native="tabClick(6, 3)" ></el-step>
      <el-step title="市公司审核" @click.native="tabClick(7, 4)"></el-step>
      <el-step title="省公司审核" @click.native="tabClick(8, 5)"></el-step>
    </el-steps>
    <!-- 批量导入 市 已完成 -->
    <el-steps v-else-if="formData.secondCompany && formData.secondCompany.slice(-2) == '99' && formData.newType == 1 && formData.rectificationStatus === 1" :active="active" align-center style="margin-bottom: 20px">
      <el-step title="隐患认领" @click.native="tabClick(1, 1)"></el-step>
      <el-step title="隐患整改" @click.native="tabClick(5, 2)"></el-step>
      <el-step title="市公司审核" @click.native="tabClick(7, 3)"></el-step>
      <el-step title="省公司审核" @click.native="tabClick(8, 4)"></el-step>
    </el-steps>

    <div>
      <el-form :disabled="isInfo" style="padding-right: 5px" :rules="rules"  label-width="140px" ref="form" :model="formData"  :status-icon="true">
       
        <div v-if="active2 == 1">
          <el-row>
            <el-col :span="24">
              <el-form-item label="隐患内容:" prop="content">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder=""
                  clearable
                  size="mini"
                  v-model="formData.content"
                >
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="隐患来源:" prop="hiddenSource">
                <el-select v-model="formData.hiddenSource" size="mini" clearable placeholder="">
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
                <el-select v-model="formData.hiddenCategory" @change="changeHiddenCategory" size="mini" clearable placeholder="">
                  <el-option
                    v-for="item in hiddenCategoryList"
                    :value="item.dictValue"
                    :key="item.id"
                    :label="item.dictLabel"
                  >
                  </el-option>
                </el-select>
                <el-select v-model="formData.hiddenType" :disabled="hiddenCategoryList2.length == 0" size="mini" clearable placeholder="" style="margin-left: 1%">
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
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发现日期:" prop="discoverDate">
                <el-date-picker
                        v-model="formData.discoverDate" placeholder="" type="date"
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
                <!-- <el-select v-model="formData.secondCompany" size="mini" clearable placeholder="">
                  <el-option
                    v-for="item in basicUnitSeconds"
                    :value="item.orgId"
                    :key="item.orgId"
                    :label="item.shortName"
                  >
                  </el-option>
                </el-select> -->
                <JobUnit :orgId.sync="formData.secondCompany"></JobUnit>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="整改责任人:" prop="responsibleBy">
                <el-input
                  placeholder=""
                  clearable
                  size="mini"
                  v-model="formData.responsibleBy"
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
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <div>
                <el-form-item label="详情材料:" prop="fileUrl1">
                  <!-- <el-input
                    disabled
                    placeholder=""
                    size="mini"
                    v-model="formData.fileUrl1">
                    <el-button size="mini" slot="append" icon="el-icon-search"></el-button>
                  </el-input> -->
                  <div v-for="item in reportFiles2" :key="item.id" style="">
                    <el-link @click="qwe" type="primary" :href="item.fileUrl" target="_blank" rel="noopener noreferrer"> 
                        {{ item.fileName }} 
                    </el-link>
                  </div>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="整改完成状态" prop="rectificationStatus">
                <el-radio-group v-model="formData.rectificationStatus">
                  <el-radio :label="0">未完成</el-radio>
                  <el-radio :label="1">已完成</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="active2 == 1 && formData.rectificationStatus === 0">

          <el-row>
            <el-col :span="8">
              <el-form-item label="预计整改完成时间:" prop="rectificationExpectTime">
                <el-date-picker
                        v-model="formData.rectificationExpectTime" placeholder="" type="date"
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
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>
                <el-form-item label="佐证材料:" prop="fileUrl2">
                  <!-- <el-input
                    disabled
                    placeholder=""
                    size="mini"
                    v-model="formData.fileUrl2">
                    <el-button size="mini" slot="append" icon="el-icon-search"></el-button>
                  </el-input> -->
                  <div v-for="item in reportFiles0" :key="item.id" style="">
                    <el-link @click="qwe" type="primary" :href="item.fileUrl" target="_blank" rel="noopener noreferrer"> 
                        {{ item.fileName }} 
                    </el-link>
                  </div>
                </el-form-item>
              </div>
            </el-col>
          </el-row>              
        </div>
        <div v-if="active2 == 1 && formData.rectificationStatus === 1"> 
          <el-row>
            <el-col :span="8">
              <el-form-item label="完成时间:" prop="rectificationFinishTime">
                <el-date-picker
                        v-model="formData.rectificationFinishTime" placeholder="" type="date"
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
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>
                <el-form-item label="佐证材料:" prop="fileUrl3">
                  <!-- <el-input
                    disabled
                    placeholder=""
                    size="mini"
                    v-model="formData.fileUrl3">
                    <el-button size="mini" slot="append" icon="el-icon-search"></el-button>
                  </el-input> -->
                  <div v-for="item in rectFiles" :key="item.id" style="">
                    <el-link @click="qwe" type="primary" :href="item.fileUrl" target="_blank" rel="noopener noreferrer"> 
                        {{ item.fileName }} 
                    </el-link>
                  </div>
                </el-form-item>
              </div>
            </el-col>
          </el-row>              
        </div>
        <div v-if="active2 == 2">
          <el-row>
            <el-col :span="24">
              <el-form-item label="县级审核:" prop="cityLeaderStatus">
                <el-radio-group v-model="formData.cityLeaderStatus">
                  <el-radio :label="0">通过</el-radio>
                  <el-radio :label="1">未通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="formData.cityLeaderStatus == 1 && !isInfo">
            <el-col :span="24">
              <el-form-item label="流程操作" prop="isRefuteAndCancel">
                <el-radio-group v-model="formData.isRefuteAndCancel">
                  <el-radio :label="0">回退</el-radio>
                  <el-radio :label="1">终止</el-radio>
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
                  maxlength="200"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="active2 == 3">
          <el-row>
            <el-col :span="24">
              <el-form-item label="分管主任审核" prop="presentingLeaderStatus">
                <el-radio-group v-model="formData.presentingLeaderStatus">
                  <el-radio :label="0">通过</el-radio>
                  <el-radio :label="1">未通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="formData.presentingLeaderStatus == 1 && !isInfo">
            <el-col :span="24">
              <el-form-item label="流程操作" prop="isRefuteAndCancel">
                <el-radio-group v-model="formData.isRefuteAndCancel">
                  <el-radio :label="0">回退</el-radio>
                  <el-radio :label="1">终止</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="审核人:" prop="presentingLeaderBy">
                <el-input
                  placeholder=""
                  clearable
                  size="mini"
                  v-model="formData.presentingLeaderBy"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审核时间:" prop="presentingLeaderTime">
                <el-date-picker
                        v-model="formData.presentingLeaderTime" placeholder="" type="date"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="审核意见:" prop="presentingLeaderOpinion">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder=""
                  clearable
                  size="mini"
                  v-model="formData.presentingLeaderOpinion"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>  
        <div v-if="active2 == 4">
          <el-row>
            <el-col :span="24">
              <el-form-item label="省公司审核" prop="presentintExamineStatus">
                <el-radio-group v-model="formData.presentintExamineStatus">
                  <el-radio :label="0">通过</el-radio>
                  <el-radio :label="1">未通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="formData.presentintExamineStatus == 1 && !isInfo">
            <el-col :span="24">
              <el-form-item label="流程操作" prop="isRefuteAndCancel">
                <el-radio-group v-model="formData.isRefuteAndCancel">
                  <el-radio :label="0">回退</el-radio>
                  <el-radio :label="1">终止</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="审核人:" prop="presentingBy">
                <el-input
                  placeholder=""
                  clearable
                  size="mini"
                  v-model="formData.presentingBy"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审核时间:" prop="presentingTime">
                <el-date-picker
                        v-model="formData.presentingTime" placeholder="" type="date"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%">
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
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        






        <!-- 整改 -->
        <div v-if="active2 == 5">
          <el-row>
            <el-col :span="8">
              <el-form-item label="完成时间:" prop="rectificationFinishTime">
                <el-date-picker
                        v-model="formData.rectificationFinishTime" placeholder="" type="date"
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
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>
                <el-form-item label="佐证材料:" prop="fileUrl">
                  <!-- <el-input
                    disabled
                    placeholder=""
                    size="mini"
                    v-model="formData.fileUrl">
                    <el-button size="mini" slot="append" icon="el-icon-search"></el-button>
                  </el-input> -->
                  <div v-for="item in rectFiles" :key="item.id" style="">
                    <el-link @click="qwe" type="primary" :href="item.fileUrl" target="_blank" rel="noopener noreferrer"> 
                        {{ item.fileName }} 
                    </el-link>
                  </div>
                </el-form-item>
              </div>
            </el-col>
          </el-row>              
        </div>

        <div v-if="active2 == 6">
          <el-row>
            <el-col :span="24">
              <el-form-item label="县级审核:" prop="cityRectificationLeaderStatus">
                <el-radio-group v-model="formData.cityRectificationLeaderStatus">
                  <el-radio :label="0">通过</el-radio>
                  <el-radio :label="1">未通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="formData.cityRectificationLeaderStatus == 1 && !isInfo">
            <el-col :span="24">
              <el-form-item label="流程操作" prop="isRefuteAndCancel">
                <el-radio-group v-model="formData.isRefuteAndCancel">
                  <el-radio :label="0">回退</el-radio>
                  <el-radio :label="1">终止</el-radio>
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
                  maxlength="200"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div v-if="active2 == 7">
          <el-row>
            <el-col :span="24">
              <el-form-item label="分管主任审核" prop="rectificationLeaderStatus">
                <el-radio-group v-model="formData.rectificationLeaderStatus">
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
                  <el-radio :label="1">终止</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="审核人:" prop="rectificationLeaderBy">
                <el-input
                  placeholder=""
                  clearable
                  size="mini"
                  v-model="formData.rectificationLeaderBy"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审核时间:" prop="rectificationLeaderTime">
                <el-date-picker
                        v-model="formData.rectificationLeaderTime" placeholder="" type="date"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%">
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
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          
        </div>

        <div v-if="active2 == 8">
          <el-row>
            <el-col :span="24">
              <el-form-item label="省公司审核" prop="rectificationExamineStatus">
                <el-radio-group v-model="formData.rectificationExamineStatus">
                  <el-radio :label="0">通过</el-radio>
                  <el-radio :label="1">未通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="审核人:" prop="rectificationBy">
                <el-input
                  placeholder=""
                  clearable
                  size="mini"
                  v-model="formData.rectificationBy"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审核时间:" prop="rectificationTime">
                <el-date-picker
                        v-model="formData.rectificationTime" placeholder="" type="date"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%">
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
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          
        </div>
        

      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { orderId, orderAdd, orderUpdate, queryShortNameList, createFlow, sendBpm, backToLastItem, queryNextFlowUsers } from "@/api/safeDanger/report"
import { securitySupervision } from "@/api/safeDanger/networkSecure"
import { allCategory } from "@/api/safeDanger/computerroom"

export default {
  name: "recordDetail",
  components: {},
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
      default: true
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isInfo: {
      type: Boolean,
      default: true
    }
  },
  // computed: {
  //   kk(){
  //     if(this.formData.secondCompany){
  //       return this.formData.secondCompany.slice(-2) != '99'
  //     }else{
  //       return false
  //     }
  //     // return this.formData.secondCompany && this.formData.secondCompany.slice(-2) != '99'
  //   }
  // },
  data() {
    return {
      reportFiles2: [],
      reportFiles0: [],
      rectFiles: [],


      active: 1,
      active2: 1,
      step1: true,
      step2: false,
      step3: false,
      step4: false,
      step5: false,
      step6: false,


      // 表单参数
      formData: {},

      //校验
      rules:{
        // content:[{required:true,message:'请填写隐患内容',trigger:'blur'}],
        // hiddenSource:[{required:true,message:'请选择隐患来源',trigger:'change'}],
        // hiddenCategory:[{required:true,message:'请选择隐患分类',trigger:'change'}],
        // hiddenItems:[{required:true,message:'请填写隐患依据',trigger:'blur'}],
        // discoverBy:[{required:true,message:'请填写发现人',trigger:'blur'}],
        // discoverDate:[{required:true,message:'请填写发现日期',trigger:'blur'}],
        // reportedBy:[{required:true,message:'请填写提报人',trigger:'blur'}],
        // reportintDate:[{required:true,message:'请填写提报日期',trigger:'blur'}],
        // // fileUrl:[{required:true,message:'请填写详情材料',trigger:'blur'}],
        // rectificationStatus:[{required:true,message:'请填写整改完成状态',trigger:'change'}],

        // rectificationExpectTime:[{required:true,message:'请填写预计整改完成时间',trigger:'blur'}],
        // rectificationPrecautions:[{required:true,message:'请填写已采取的防范措施',trigger:'blur'}],
        // rectificationPlan:[{required:true,message:'请填写整改计划',trigger:'blur'}],
        // rectificationFinishTime:[{required:true,message:'请填写完成时间',trigger:'blur'}],
        // rectificationRecord:[{required:true,message:'请填写整改记录',trigger:'blur'}],
        // presentingLeaderStatus:[{required:true,message:'请选择',trigger:'change'}],
        // isRefuteAndCancel:[{required:true,message:'请填写审核人',trigger:'blur'}],
        // presentingLeaderBy:[{required:true,message:'请填写审核时间',trigger:'blur'}],
        // presentingLeaderTime:[{required:true,message:'请填写审核意见',trigger:'blur'}],
        // presentingLeaderOpinion:[{required:true,message:'请选择',trigger:'change'}],
        // presentintExamineStatus:[{required:true,message:'请填写流程操作',trigger:'blur'}],
        // presentingBy:[{required:true,message:'请填写审核人',trigger:'blur'}],
        // presentingTime:[{required:true,message:'请填写审核时间',trigger:'blur'}],
        // presentintOpinion:[{required:true,message:'请填写审核意见',trigger:'blur'}],
      },

      basicUnitSeconds: [],
      hiddenSourceList: [],
      hiddenCategoryList: [],
      supervisionList: [],
      categoryList: [],
      hiddenCategoryList2: []
    }
  },
  created() {
    this.initData()
    this.showInfo();
  },
  mounted() {

  },
  methods: {
    qwe(){

    },
    tabClick(step, index){
      this.active = index
      this.active2 = step
    },
    // 渲染表格
    showInfo() {
      // this.formData.status = 0
      if(this.detailId) {
        orderId(this.detailId).then(response =>{
          this.formData = Object.assign({}, response.data)
          // 获取 隐患分类二级列表
          this.changeHiddenCategory(this.formData.hiddenCategory)

          
          this.reportFiles2 = this.formData.evidenceDTOList.filter(el => el.type == 2)
          this.reportFiles0 = this.formData.evidenceDTOList.filter(el => el.type == 0)
          this.rectFiles = this.formData.evidenceDTOList.filter(el => el.type == 1)
        })        
      }
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
    }

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

  // ::v-deep .el-form-item__label{
  //   text-align: left;
  // }

</style>
