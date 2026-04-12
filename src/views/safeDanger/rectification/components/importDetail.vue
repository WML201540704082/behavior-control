<template>
  <div>
    <div v-if="!isInfo" style="margin-bottom: 10px">
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="submitForm">保存</el-button>        
    </div>
    <div>
      <el-form :disabled="isInfo" style="padding-right: 5px" :rules="rules"  label-width="140px" ref="form" :model="formData"  :status-icon="true">
        <el-collapse v-model="activeNames" style="padding-top: 5px">
          <el-collapse-item title="异常信息" name="1">
            <el-row>
              <el-col :span="12">
                <el-form-item label="异常信息:" prop="exceptionField">
                  <el-input
                    type="textarea"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.exceptionField"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="当前异常:" prop="exceptionReason">
                  <el-input
                    type="textarea"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.exceptionReason"
                    disabled
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

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
                    :disabled='disStep1'
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8" class="rowSelect2">
                <el-form-item label="隐患分类:" prop="hiddenType">
                  <el-select v-model="formData.hiddenCategory" :disabled='disStep1' @change="changeHiddenCategory" size="mini" placeholder="">
                    <el-option
                      v-for="item in hiddenCategoryList"
                      :value="item.dictValue"
                      :key="item.id"
                      :label="item.dictLabel"
                    >
                    </el-option>
                  </el-select>
                  <el-select @change="hiddenTypeChange" v-model="formData.hiddenType" :disabled="!formData.hiddenCategory" size="mini" clearable placeholder="" style="margin-left: 1%">
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
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="责任单位:" prop="secondCompanyName">
                  <JobUnit2 @change="secondCompanyChange" :orgId.sync="formData.secondCompany" :firstCompany.sync="formData.firstCompany" :secondCompanyName.sync="formData.secondCompanyName" :disabledd='disStep1'></JobUnit2>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item label="整改责任人:" prop="responsibleBy">
                  <el-select @change="responsibleByChange" v-model="formData.responsibleBy" :disabled='disStep1 || !formData.secondCompany || !(formData.hiddenType || formData.hiddenCategory)' size="mini" clearable placeholder="">
                    <el-option
                      v-for="item in userList"
                      :value="item.userName"
                      :key="item.userId"
                      :label="item.userName"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="督查人员:" prop="discoverBy">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.discoverBy"
                    :disabled='disStep1'
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="发现时间:" prop="discoverDate">
                  <el-date-picker
                          v-model="formData.discoverDate" :disabled='disStep1' placeholder="" type="date"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="discoverDatePickerOptions" size="mini" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="隐患依据:" prop="hiddenItems">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.hiddenItems"
                    :disabled='disStep1'
                    maxlength="255"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

<!-- 
            <el-row>
              <el-col :span="24">
                <el-form-item label="整改完成状态:">
                  <el-radio-group v-model="formData.rectificationStatus">
                    <el-radio label="0">未完成</el-radio>
                    <el-radio label="1">已完成</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="formData.rectificationStatus === '0'">
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

            <el-row v-if="formData.rectificationStatus == 1">
              <el-col :span="8">
                <el-form-item label="完成限期:" prop="rectificationExpectTime">
                  <el-date-picker
                          v-model="formData.rectificationExpectTime" placeholder="" type="date"
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

              <el-col :span="24">
                <el-form-item label="整改情况:" prop="rectificationStatus">
                  <el-input
                    type="textarea"
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="formData.rectificationStatus"
                    :disabled='disStep1'
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row> -->

          </el-collapse-item>

          

        </el-collapse>
      </el-form>
    </div>

 


  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Upload from '@/components/safeDanger/Upload/index'
import { orderId, orderAdd, orderUpdate, queryShortNameList, selectCategoryUserList } from "@/api/safeDanger/report"
import { securitySupervision } from "@/api/safeDanger/networkSecure"
import { allCategory } from "@/api/safeDanger/computerroom"
import SelectFlowUser from "./selectFlowUser";
import { updateHidden } from "@/api/safeDanger/rectificationImport"
import JobUnit2 from "@/views/safeDanger/report/components/jobUnit2";

export default {
  name: "ComputerRoomDetail",
  components: {Upload, SelectFlowUser, JobUnit2},
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
      'userId'
    ]),
  },
  props: {
    detailForm: {
      type: Object,
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

      disStep1: false,
      disStep2: false,
      disStep3: false,

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
        responsibleBy: ''
      },
      queryDisabled: {
        showUnitSecond: false
      },
      //校验
      rules:{
        content:[{required:true,message:'请填写隐患内容',trigger:'blur'}],
        // hiddenSource:[{required:true,message:'请选择隐患来源',trigger:'change'}],
        hiddenType:[{required:true,message:'请选择隐患分类',trigger:'change'}],
        hiddenItems:[{required:true,message:'请填写隐患依据',trigger:'blur'}],
        discoverBy:[{required:true,message:'请填写督查人员',trigger:'blur'}],

        
        secondCompanyName:[{required:true,message:'请选择责任单位'}],
        // responsibleBy:[{required:true,message:'请填写整改责任人',trigger:'blur'}],


        discoverDate:[{required:true,message:'请填写发现时间',trigger:'blur'}],
        // reportedBy:[{required:true,message:'请填写提报人',trigger:'blur'}],
        // reportintDate:[{required:true,message:'请填写提报日期',trigger:'blur'}],
        // fileUrl:[{required:true,message:'请填写详情材料',trigger:'blur'}],
        // rectificationStatus:[{required:true,message:'请填写整改完成状态',trigger:'change'}],



        // rectificationExpectTime:[{required:true,message:'请填写预计整改完成时间',trigger:'blur'}],
        // rectificationPrecautions:[{required:true,message:'请填写已采取的防范措施',trigger:'blur'}],
        // rectificationPlan:[{required:true,message:'请填写整改计划',trigger:'blur'}],
        rectificationFinishTime:[{required:true,message:'请填写完成时间',trigger:'blur'}],
        // rectificationRecord:[{required:true,message:'请填写整改记录',trigger:'blur'}],

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
    }
  },
  created() {
    this.initData()
    this.showInfo();
  },
  mounted() {
    
  },
  methods: {

    
    discoverDatePickerOptions: {
      disabledDate: (time)=>{
        return time.getTime() > new Date(this.formData.reportintDate).getTime()
      }
    },
    secondCompanyChange(val){
      this.hiddenTypeChange(val)
    },
    responsibleByChange(val){
      // if(val){
      //   let name = this.userList.filter(el => el.userId == val)[0].userName
      //   this.formData.responsibleBy = name
      // }else{
      //   this.formData.responsibleBy = ''
      // }
    },



    changeState1(val){
      if(val == 0){
        this.showRectPlan = true
      }else{
        this.showRectFinsh = true
      }
    },



    // 渲染表格
    showInfo() {
      let data = JSON.parse(JSON.stringify(this.detailForm))

      if(!data.hiddenType){
        data.hiddenType = data.hiddenTypeName
      }
      if(!data.secondCompany){
        data.secondCompany = data.secondCompanyName
      }
      data.hiddenCategory = data.hiddenCategory.toString()
      // data.hiddenType = data.hiddenType  // 二级分类
      // data.secondCompany = data.secondCompany // 责任单位

      

      // if(!data.responsibleUser){
      //   data.responsibleUser = data.responsibleBy
      // }
      
      this.formData = data


      // 获取责任人列表
      selectCategoryUserList({
        flagType: this.detailForm.hiddenCategory,
        categoryId: this.detailForm.hiddenType,
        firstCompany: this.detailForm.firstCompany,
        secondCompany: this.detailForm.secondCompany,
      }).then(res=>{
        this.userList = res.data
      })
    },
    
    /** 提交按钮 */
    submitForm: function() {
      // this.formData.firstCompany = this.companyCode.slice(0, 4)
      this.$refs["form"].validate(valid => {
        if (valid) {
          let forms = JSON.parse(JSON.stringify(this.formData))
          delete forms.hiddenType
          delete forms.secondCompany

          updateHidden(forms).then(response => {
            if (response.code === 200) {
              this.$message.success("修改成功");
              this.$emit('closeRoom', response.data)
            } else {
              this.msgError(response.msg);
            }
          });
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
        // 渲染对应的隐患分类二级列表
        this.changeHiddenCategory(this.formData.hiddenCategory, true)
      })
      allCategory().then(res=>{
        this.categoryList = res.data
        // 渲染对应的隐患分类二级列表
        this.changeHiddenCategory(this.formData.hiddenCategory, true)
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
        this.hiddenTypeChange(111111111)
      }

      
    },

    hiddenTypeChange(val){

      if(this.hiddenCategoryList2.filter(el=> el.id == val)[0]){
        let aaa = this.hiddenCategoryList2.filter(el=> el.id == val)[0].dictLabel
        this.formData.hiddenTypeName = aaa
      }
      


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
