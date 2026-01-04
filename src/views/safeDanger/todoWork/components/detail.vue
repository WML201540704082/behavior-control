<template>
  <div>
    <div v-if="!isInfo" style="margin-bottom: 10px">
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="submitForm">保存</el-button>        
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="sendBPM">发起流程</el-button>        
    </div>
    <div>
      <el-form :disabled="isInfo" style="padding-right: 5px" :rules="rules"  label-width="140px" ref="form" :model="formData"  :status-icon="true">
        <el-collapse v-model="activeNames" style="padding-top: 5px">
          <el-collapse-item title="基本信息" name="1">
            <el-row>
              <el-col :span="24">
                <el-form-item label="隐患内容:" prop="content">
                  <el-input
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
                <el-form-item label="提报日期:" prop="reportintDate">
                  <el-date-picker
                          v-model="formData.reportintDate" placeholder="" type="date"
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
              <el-col :span="8">
                <div>
                  <el-form-item label="详情材料" prop="fileUrl">
                    <el-input
                      disabled
                      placeholder=""
                      size="mini"
                      v-model="formData.fileUrl">
                      <el-button size="mini" slot="append" icon="el-icon-search" @click="uploadFile"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="整改完成状态" prop="rectificationStatus">
                  <el-radio-group v-model="formData.rectificationStatus" @input="changeState1">
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
                <el-form-item label="预计整改完成时间:" prop="rectificationFinishTime">
                  <el-date-picker
                          v-model="formData.rectificationFinishTime" placeholder="" type="date"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="已采取的防范措施:" prop="rectificationPrecautions">
                  <el-input
                    type="textarea"
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
                  <el-form-item label="佐证材料" prop="fileUrl">
                    <el-input
                      disabled
                      placeholder=""
                      size="mini"
                      v-model="formData.fileUrl">
                      <el-button size="mini" slot="append" icon="el-icon-search" @click="uploadFile"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>              
          </el-collapse-item>

          <el-collapse-item title="整改完成信息" name="3" v-if="formData.rectificationStatus == 1">
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
                  <el-form-item label="佐证材料" prop="fileUrl">
                    <el-input
                      disabled
                      placeholder=""
                      size="mini"
                      v-model="formData.fileUrl">
                      <el-button size="mini" slot="append" icon="el-icon-search" @click="uploadFile"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>              
          </el-collapse-item>

          <el-collapse-item title="分管主任审核" name="4" v-if="formData.status == 1">
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
            <el-row v-if="formData.presentingLeaderStatus == 1">
              <el-col :span="24">
                <el-form-item label="流程操作" prop="caozuo1">
                  <el-radio-group v-model="formData.caozuo1">
                    <el-radio :label="0">终止</el-radio>
                    <el-radio :label="1">回退</el-radio>
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
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.presentingLeaderOpinion"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            
          </el-collapse-item>

          <el-collapse-item title="省公司审核" name="5" v-if="formData.status == 2">
            <el-row>
              <el-col :span="24">
                <el-form-item label="分管主任审核" prop="presentintExamineStatus">
                  <el-radio-group v-model="formData.presentintExamineStatus">
                    <el-radio :label="0">通过</el-radio>
                    <el-radio :label="1">未通过</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="formData.presentintExamineStatus == 1">
              <el-col :span="24">
                <el-form-item label="流程操作" prop="caozuo1">
                  <el-radio-group v-model="formData.caozuo1">
                    <el-radio :label="0">终止</el-radio>
                    <el-radio :label="1">回退</el-radio>
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
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.presentintOpinion"
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
              :business-key="detailId"
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
import { orderId, orderAdd, orderUpdate, queryShortNameList, createFlow, sendBpm, backToLastItem, queryNextFlowUsers } from "@/api/safeDanger/report"
import { securitySupervision } from "@/api/safeDanger/networkSecure"
import { allCategory } from "@/api/safeDanger/computerroom"
import SelectFlowUser from "./selectFlowUser";

export default {
  name: "ComputerRoomDetail",
  components: {Upload, SelectFlowUser},
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
      type: Number,
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
      formData: {},
      queryDisabled: {
        showUnitSecond: false
      },
      //校验
      rules:{
        content:[{required:true,message:'请填写隐患内容',trigger:'blur'}],
        hiddenSource:[{required:true,message:'请选择隐患来源',trigger:'change'}],
        hiddenCategory:[{required:true,message:'请选择隐患分类',trigger:'change'}],
        hiddenItems:[{required:true,message:'请填写隐患依据',trigger:'blur'}],
        discoverBy:[{required:true,message:'请填写发现人',trigger:'blur'}],
        discoverDate:[{required:true,message:'请填写发现日期',trigger:'blur'}],
        reportedBy:[{required:true,message:'请填写提报人',trigger:'blur'}],
        reportintDate:[{required:true,message:'请填写提报日期',trigger:'blur'}],
        // roomName:[{required:true,message:'请填写责任单位',trigger:'blur'}],
        // fileUrl:[{required:true,message:'请填写详情材料',trigger:'blur'}],
        rectificationStatus:[{required:true,message:'请填写整改完成状态',trigger:'change'}],
      },
      

      //附件上传
      showUpload: false,
      fileParams: {
        readOnly: false,
        tableName: 'cs_t_network_process',
        columName: 'fileUrl',
        fileType: 'jpg,jpeg,png,bmp,gif,pdf,rar,zip,tz,doc,docx,wps,xlsx,xls,pptx',
        limitNum: 5
      },

      // 下拉列表
      hiddenSourceList: [],
      hiddenCategoryList: [],
      hiddenCategoryList2: [],
      basicUnitSeconds: [], // 二级单位
      supervisionList: [],
      categoryList: [],
    }
  },
  created() {
    this.initData()
    this.showInfo();
  },
  mounted() {

  },
  methods: {
    changeState1(val){
      if(val == 0){
        this.showRectPlan = true
      }else{
        this.showRectFinsh = true
      }
    },

    //发起流程
    sendBPM() {
      if(this.formData.caozuo1 === 0){
        this.formData.isCancel = true // 是否终止
        this.formData.isRefute = false // 是否驳回
      } else if(this.formData.caozuo1 === 1){
        this.formData.isCancel = false // 是否终止
        this.formData.isRefute = true // 是否驳回
      } else{
        this.formData.isCancel = false // 是否终止
        this.formData.isRefute = false // 是否驳回
      }

      createFlow(this.formData).then(res=>{
        if(res.code == 200){
          this.formData = res.data;
           
          // 修改 获取节点人员状态
          if(this.formData.isRefute){
            this.userState = 1
          }
          if(this.formData.isCancel){
            this.userState = 2
          }

          this.openSelectFlowUser = true;
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
      if(this.detailId) {
        orderId(this.detailId).then(response =>{
          this.formData = Object.assign({}, response.data)
          // 获取 隐患分类二级列表
          this.changeHiddenCategory(this.formData.hiddenCategory)
        })        
      }
    },
    
    /** 提交按钮 */
    submitForm: function() {
      this.formData.reportedBy = this.userId
      this.formData.firstCompany = this.companyCode.slice(0, 4)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.detailId !== undefined) {
            orderUpdate(this.formData).then(response => {
              if (response.code === 200) {
                this.$message.success("修改成功");
                this.$emit('closeRoom')
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            orderAdd(this.formData).then(response => {
              if (response.code === 200) {
                this.$message.success("新增成功");
                this.$emit('closeRoom')
              } else {
                this.msgError(response.msg);
              }
            });
          }
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
    uploadFile() { // 点击按钮
      this.showUpload = true;
    },
    setFileName(fileName) { //设置附件值
      this.formData.fileUrl = fileName;
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

</style>
