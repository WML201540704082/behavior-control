<template>
  <div style="width: 100%;height: 100%;">
    <div class="btns_row" v-if="!isInfo" style="margin-bottom: 10px">
      <!-- 待提交 -->
      <div class="vvv" v-if="status0 || !detailId">
        <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="submitForm">保存</el-button>  
        <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="submitForm($event, true)">提交</el-button>     
        <!-- <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-close" @click="$emit('closeRoom');">关闭</el-button> -->
      </div>
      <!-- 处理中 -->
      <div v-else>
        <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="recordForm">提交</el-button>        
        <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="finishForm" v-hasPermi="['hidden:problem:finish']">完成</el-button>        
        <!-- <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-close" @click="$emit('closeRoom');">关闭</el-button> -->
      </div>
                    
    </div>

    <div class="mains">
      <el-form :disabled="isInfo" style="padding-right: 5px" :rules="rules" label-width="140px" ref="form" :model="formData"  :status-icon="true">
        <el-row style="margin-top: 10px">
          <el-col :span="24">
            <el-form-item label="问题描述:" prop="problemContent">
              <el-input
                type="textarea"
                placeholder="如果选择问题类型为问题反馈，请输入工单编号，并详细描述"
                :rows="3"
                clearable
                size="small"
                v-model="formData.problemContent"
                :disabled='disStep1'
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="问题类型:" prop="problemType">
              <el-select @change="typeChange" placeholder="" v-model="formData.problemType" size="small" clearable :disabled='disStep1'>
                <el-option
                  v-for="item in problemTypeList"
                  :value="item.dictValue"
                  :key="item.dictKey"
                  :label="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="反馈人员:" prop="feedbackUser">
              <el-input
                placeholder=""
                clearable
                size="small"
                v-model="formData.feedbackUser"
                disabled
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系方式:" prop="feedbackPhone">
              <el-input
                placeholder="请填写正确的手机号"
                clearable
                size="small"
                v-model="formData.feedbackPhone"
                :disabled='disStep1'
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="图片说明:" prop="hiddenProblemEvidenceList">
              <UploadImg 
                v-if="UploadImgShow"
                :fileList1="fileList1"
                :disabled='disStep1'
                :detailId="detailId"
                :businessKey="businessKey" 
                tableName="hidden_problem_evidence" 
                columName="file_url"
                @setFileName="setFileName"  
              ></UploadImg>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="detailId && formData.status !== 0">
          <div class="headd">
            问题反馈记录
          </div>
          <el-row v-for="(item, index) in recodeList" :key="item.id">
            <el-col :span="24" v-if="item.problemType === 1">
              <el-form-item label="问题答复:" prop="">
                <div slot="label">
                  项目组答复:
                  <div style="font-size: 12px;margin-top: -12px;">{{ item.createTime }}</div>
                </div>
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder=""
                  clearable
                  size="small"
                  v-model="item.problemContent"
                  disabled
                  maxlength="255"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-else>
              <el-form-item label="问题描述:" prop="">
                <div slot="label">
                  {{ index == 0 ? "问题描述:":"用户提问:" }}
                  <div style="font-size: 12px;margin-top: -12px;">{{ item.createTime }}</div>
                </div>
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder=""
                  clearable
                  size="small"
                  v-model="item.problemContent"
                  disabled
                  maxlength="255"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>


        <el-row v-if="(formData.status == 1 || formData.status == 2) && !isInfo">
          <el-col :span="24" v-if="userDetail.realName == formData.feedbackUser">
            <el-form-item label="用户提问:" prop="problemContent2">
              <el-input
                type="textarea"
                :rows="3"
                placeholder=""
                clearable
                size="small"
                v-model="formData.problemContent2"
                maxlength="255"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-else>
            <el-form-item label="项目组答复:" prop="problemContent2">
              <el-input
                type="textarea"
                :rows="3"
                placeholder=""
                clearable
                size="small"
                v-model="formData.problemContent2"
                maxlength="255"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
      </el-form>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { orderId, orderAdd, orderSub, orderUpdate, orderRec, recodeList, orderFinish } from "@/api/safeDanger/problem"
const uuid = require('uuid');
import { getFiles } from "@/api/oss";
import UploadImg from "./uploadImg.vue"

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
  components: { UploadImg },
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
      'userId',
      'userDetail'
    ]),
    status0(){
      return this.formData.status === 0
    }
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
    //校验电话号码手机号
    let phoneCheckReg = /(^1[3|4|5|7|8][0-9]{9}$)|(^0\d{2,3}\-\d{7,8}$)/;
    let phoneCheck = (rule,value,callback) => {
        if (!phoneCheckReg.test(value)) {
            return callback(this.$message.warning("请填写正确联系方式(固定电话格式0531-80812321或手机号)！"));
        }else {
            callback();
        }
    };
    return {
      fileList1: [],

      UploadImgShow: false,
      businessKey: '',
      disStep1: false,

      // 表单参数
      formData: {
        hiddenProblemEvidenceList: []
      },
      //校验
      rules:{
        problemContent:[{required:true,message:'请填写问题描述',trigger:'blur'}],
        // problemContent2:[{required:true,message:'请填写内容',trigger:'blur'}],
        problemType:[{required:true,message:'请选择隐患来源',trigger:'change'}],
        hiddenItems:[{required:true,message:'请填写隐患依据',trigger:'blur'}],
        feedbackUser:[{required:true,message:'请填写反馈人员',trigger:'blur'}],
        // hiddenProblemEvidenceList:[{type: "array", required:true,message:'请上传图片',trigger:'change'}],
        hiddenProblemEvidenceList:[],
        discoverDate:[{required:true,message:'请填写发现日期',trigger:'blur'}],
        reportedBy:[{required:true,message:'请填写提报人',trigger:'blur'}],
        feedbackPhone:[{required:true,message:'请输入联系方式',trigger:'blur'}, {validator:phoneCheck,trigger:"blur"}],



        rectificationExpectTime:[{required:true,message:'请填写预计整改完成时间',trigger:'blur'}],
        rectificationPrecautions:[{required:true,message:'请填写已采取的防范措施',trigger:'blur'}],
        rectificationPlan:[{required:true,message:'请填写整改计划',trigger:'blur'}],
        rectificationFinishTime:[{required:true,message:'请填写完成时间',trigger:'blur'}],
        rectificationRecord:[{required:true,message:'请填写整改记录',trigger:'blur'}],
        cityLeaderStatus:[{required:true,message:'请选择',trigger:'change'}],
        cityLeaderBy:[{required:true,message:'请填写审核人',trigger:'blur'}],
        cityLeaderTime:[{required:true,message:'请填写审核时间',trigger:'blur'}],
        cityLeaderOpinion:[{required:true,message:'请填写审核意见',trigger:'blur'}],
        presentingLeaderBy:[{required:true,message:'请填写审核时间',trigger:'blur'}],
        presentingLeaderTime:[{required:true,message:'请填写审核意见',trigger:'blur'}],
        presentingLeaderOpinion:[{required:true,message:'请选择',trigger:'change'}],
        presentintExamineStatus:[{required:true,message:'请填写流程操作',trigger:'blur'}],
        presentingBy:[{required:true,message:'请填写审核人',trigger:'blur'}],
        presentingTime:[{required:true,message:'请填写审核时间',trigger:'blur'}],
        presentintOpinion:[{required:true,message:'请填写审核意见',trigger:'blur'}],
      },
    

      // 下拉列表
      problemTypeList: [],
      hiddenCategoryList: [],
      basicUnitSeconds: [], // 二级单位

      recodeList: []
      
    }
  },
  created() {
    this.initData()
    this.showInfo();
  },
  mounted() {
      
  },
  methods: {
    typeChange(val){
      if(val === '问题反馈'){
        this.rules.hiddenProblemEvidenceList = [{type: "array", required:true,message:'请上传图片',trigger:'change'}]
      }else{
        this.rules.hiddenProblemEvidenceList = []
      }

      this.$refs['form'].clearValidate('hiddenProblemEvidenceList')
    },

    setFileName(fileList) { //设置附件值
      let datas = fileList.map(ele=>{
        if(ele.response){ // 代表新上传的图片
          return {
            fileName: ele.response.data.name,
            fileUrl: ele.response.data.link
          }
        }else{ // 代表详情返回的图片
          return {
            fileName: ele.name,
            fileUrl: ele.url
          }
        }
      })
      this.formData.hiddenProblemEvidenceList = datas
      return
      // 获取附件列表
      getFiles({
        businessKey: this.businessKey,
        // tableName: this.tableName,
        // columName: this.columName
      }).then(response =>{
        if( response.code == 200 ){
          let data = response.data.map(el=>{
            return {
              businessKey: el.businessKey,
              fileName: el.fileName,
              fileUrl: el.ossPath
            }
          })

          this.formData.hiddenProblemEvidenceList = data
        }
      })
        
    },

    //发起流程
    sendBPM() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          this.$message.warning('缺乏必要信息，请填写后再保存！')
        }
      })
    },
    saveToBPM() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
         this.$message.warning('缺乏必要信息，请填写后再保存！')
        }
      })
    },
 



    // 渲染表格
    async showInfo() {
      this.formData.status = 0


      if(this.detailId) { // 修改
        let response = await orderId(this.detailId)
        let datas = Object.assign({}, response.data)
        this.formData = datas
        // 问题反馈记录
        if( this.formData.status == 1 || this.formData.status == 2 || this.formData.status == 3 ){
          this.disStep1 = true
          this.recodeList = this.formData.hiddenProblemRecodeList
        }
        this.typeChange(this.formData.problemType)
        
        // if( this.formData.status == 1 || this.formData.status == 2 ){
        //   this.disStep1 = true
        //   recodeList({ id: this.formData.id }).then(res=>{
        //     let dataList = res.rows.reverse()
        //     // this.recodeList = dataList.slice(1)
        //     this.recodeList = dataList
        //   })
        // }

      }else{ // 新增
        // 赋值 反馈人员
        // console.log(11, this.userDetail.realName)
        this.formData.feedbackUser = this.userDetail.realName
      }

      this.renderImgs()
    },
    renderImgs(){
      if(this.formData.hiddenProblemEvidenceList && this.formData.hiddenProblemEvidenceList.length>0){
        this.fileList1 = this.formData.hiddenProblemEvidenceList.map(ele=>{
          return {
            name: ele.fileName,
            url: ele.fileUrl
          }
        })
      }
      this.UploadImgShow = true
      
      return
      if(this.formData.hiddenProblemEvidenceList && this.formData.hiddenProblemEvidenceList.length>0){
        this.businessKey = this.formData.hiddenProblemEvidenceList[0].businessKey;
      }else{
        this.businessKey = uuid.v4().replace(/-/g, "");
      }
      this.UploadImgShow = true
    },
  
    closed(){

    },

    recordForm(){
      let params = {
        problemId: this.formData.id,
        problemType: this.userDetail.realName == this.formData.feedbackUser ? 0 : 1,
        problemContent: this.formData.problemContent2
      }

      orderRec(params).then(response => {
        if (response.code === 200) {
          this.msgSuccess("反馈成功");
          this.$emit('closeRoom')
        } else {
          this.msgError(response.msg);
        }
      });
    },
    finishForm(){
      orderFinish(this.formData).then(response => {
        if (response.code === 200) {
          this.msgSuccess("反馈成功");
          this.$emit('closeRoom')
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 提交按钮 */
    submitForm: function(e, isSub) {

      // console.log(366, this.formData)
      // return

      // this.formData.reportedBy = this.userId
      // this.formData.firstCompany = this.companyCode.slice(0, 4)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(isSub){
            orderSub([ this.formData.id ]).then(response => {
              if (response.code === 200) {
                this.msgSuccess("提交成功");
                this.$emit('closeRoom')
              } else {
                this.msgError(response.msg);
              }
            });

            return
          }


          if (this.formData.id) {
            
            orderUpdate(this.formData).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                
                this.formData = response.data
                // this.$emit('closeRoom')
              } else {
                this.msgError(response.msg);
              }
            });

          } else {
            orderAdd(this.formData).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                
                this.formData = response.data
                // this.$emit('closeRoom')
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
      this.getDicts('problem_feedback_type').then(response => {
        this.problemTypeList = response.data
      });
      this.getDicts('hidden_category').then(response => {
        let datas = response.data
          datas.forEach(el=>{
            if( typeof el.dictValue == 'string' ) el.dictValue = Number(el.dictValue)
          })
          this.hiddenCategoryList = response.data
      });

     
    },


    
  }
}
</script>

<style lang='scss' scoped>
  .headd{
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0 25px 15px;
    border-top: 1px solid #ddd;
    padding-top: 20px;
  }

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
