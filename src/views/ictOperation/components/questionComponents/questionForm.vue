<template>
  <div class="question_form">
    <div class="back_btn" v-if="!isYiban">
      <el-button
        v-if="!showType"
        type="primary"
        size="mini"
        plain
        icon="el-icon-arrow-left"
        @click="cancel"
        >返回</el-button
      >

      <div style="margin-top: 10px">
        <el-upload
          ref="upload"
          name="file"
          :limit="1"
          accept=".xlsx"
          :headers="headers"
          :action="exportAction"
          :http-request="uploadFile2"
          :before-upload="beforeExportFileUpload"
          :on-success="handleExportFileSuccess"
          :show-file-list="false"
        >
          <el-button size="mini" type="primary" plain>导入问题</el-button>
        </el-upload>
      </div>
      <div style="margin-top: 10px">
        <el-button type="primary" @click="modelDown" plain>模板下载</el-button>
      </div>
    </div>
    <div class="tel" >
      <!-- 电话：{{this.phoneNum}} -->
      <el-tooltip effect="dark" :content="'电话：' + phoneNum" placement="top">
        <el-button type="primary" round style="padding: 0;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          font-size: 20px;
          cursor: unset;">
          <i class="el-icon-phone-outline"></i>
        </el-button>
      </el-tooltip>
    </div>
    <div class="form_title">
      <img src="../../img/question_form_title.png" alt="" />
    </div>
    <div class="form_content" :class="showType == '修改' ? 'dialogHieght' : ''">
      <el-form
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
        label-suffix=":"
        label-width="110px"
        size="mini"
      >
        <el-form-item label="问题名称" prop="title">
          <el-input v-model="submitForm.title" :maxlength="100"></el-input>
        </el-form-item>

        <el-form-item label="问题描述" prop="content" class="description">
          <el-input v-model="submitForm.content" type='textarea' :row='5' :maxlength="500" show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="问题类型" prop="type">
          <el-select v-model="submitForm.type">
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="出现频率" prop="frequency">
          <el-select v-model="submitForm.frequency">
            <el-option
              v-for="(item, index) in frequencyList"
              :key="index"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="紧急程度" prop="urgentLevel">
          <el-select v-model="submitForm.urgentLevel">
            <el-option
              v-for="(item, index) in urgentLevelList"
              :key="index"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="问题佐证材料" prop="path">
          <el-upload
            class="upload-demo"
            :action="action"
            :headers="headers"
            :file-list="fileList"
            :limit="5"
            :before-upload="beforeUpload"
            :http-request="uploadFile"
            :on-success="handleFileSuccess"
            :on-remove="handleRemove"
            list-type="picture-card"
          >
            <div slot="tip" class="el-upload__tip">
              另外请上传系统详情截图，右击桌面计算机-属性查看，只能上传jpg/png文件，且不超过5M，最多上传5张图片
            </div>
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        
        <el-form-item label="应用名称" prop="sysName">
          <el-input v-model="submitForm.sysName" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="终端类型" prop="deviceType">
          <el-select v-model="submitForm.deviceType">
            <el-option
              v-for="(item, index) in deviceTypeList"
              :key="index"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作系统" prop="osType">
          <el-select v-model="submitForm.osType" @change="osTypelChange" clearable placeholder="请选择操作系统类型" :disabled="editDisabled || operationType === '0'">
            <el-option v-for="dict in osTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-select
            v-model="submitForm.brand"
            filterable
            clearable
            placeholder="请选择品牌"
            @change="brandChange"
          >
            <el-option
              v-for="dict in brandList"
              :key="dict.dictKey"
              :label="dict.dictValue"
              :value="dict.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="提报人" prop="filler" >
          <el-input v-model="submitForm.filler" clearable disabled :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="submitForm.phone" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="公司单位" prop="dept">
          <el-input v-model="submitForm.dept" clearable :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="省测处理意见" prop="comment" class="description" v-if="isYiban">
          <el-input v-model="submitForm.comment" type='textarea' :row='5' :maxlength="500" show-word-limit></el-input>
        </el-form-item>


        <!-- <el-form-item label="终端信息" prop="terminalInfo">
          <el-select v-model="submitForm.terminalInfo">
            <el-option
              v-for="(item, index) in terminalList"
              :key="index"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="系列" prop="series">
          <el-select
            v-model="submitForm.series"
            clearable
            placeholder="请选择系列"
            :disabled="!submitForm.brand"
            @change="seriesChange"
          >
            <el-option
              v-for="dict in seriesList"
              :key="dict.dictKey"
              :label="dict.dictValue"
              :value="dict.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="型号" prop="model">
          <el-select
            v-model="submitForm.model"
            clearable
            placeholder="请选择型号"
            :disabled="!submitForm.series"
            @change="deviceModelChange"
          >
            <el-option
              v-for="dict in deviceModelList"
              :key="dict.dictKey"
              :label="dict.dictValue"
              :value="dict.dictKey"
            ></el-option>
          </el-select>
        </el-form-item> -->
        
        <!-- <el-form-item label="问题来源" prop="source">
          <el-input v-model="submitForm.source"></el-input>
        </el-form-item> -->
        
        <!-- <el-form-item label="影响范围" prop="influence">
          <el-select v-model="submitForm.influence">
            <el-option
              v-for="(item, index) in influenceList"
              :key="index"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item> -->
        
        <!-- <el-form-item label="处理主体" prop="subject">
          <el-input v-model="submitForm.subject"></el-input>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="btn_box">
      <el-button type="primary" size="mini" @click="save" :loading="saveLoading"
        >暂存</el-button
      >
      <el-button
        type="primary"
        size="mini"
        @click="submit"
        :loading="saveLoading"
         v-if="!isYiban"
        >提交</el-button
      >
      <el-button type="primary" size="mini" plain @click="cancel"
        >取消</el-button
      >
    </div>
    
    <operateForm
      v-if="showOperate"
      :isShow="showOperate"
      :questionId="submitForm.id"
      @close="showOperate = false"
      @submitProcess="submitProcess"
    />
  </div>
</template>

<script>
import { getDictList,getDictCmdbList,getDictCmdbListPid, getDictBsd} from "@/api/dict";
import {
  questionSave,
  saveFinish,
  processCreate,
  questionDetail,
  questionSubmit,
  downloadTemplate,
  getPhone,
  uploadFile1,
  exportUploadFile
} from "@/api/ictOperation/index";
import website from "@/config/website";
import { Base64 } from "js-base64";
import { getToken } from "@/util/auth";
import operateForm from "./operateForm";
import { mapGetters } from "vuex";

export default {
  components: { operateForm },
  props: ["showType", "questionId", "isYiban"],
  data() {
    return {
      phoneNum:"",
      submitForm: {
        filler: "",
        dept: "",
        brandCode: undefined,
        seriesCode: undefined,
        deviceModelCode: undefined,
      },
      osTypeList: [],
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      deviceTypeList: [],
      rules: {
        title: [
          { required: true, message: "问题名称不能为空", trigger: "blur" },
        ],
        filler: [
          { required: true, message: "提报人不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
          { pattern:/^1[3-9]\d{9}$/, message:'手机号码格式错误', trigger:'blur' }
        ],
        dept: [
          { required: true, message: "公司单位不能为空", trigger: "blur" },
        ],
        osType: [
          { required: true, message: "操作系统不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "问题类型不能为空", trigger: "blur" },
        ],
        brand: [
          { required: true, message: "品牌不能为空", trigger: "blur" },
        ],
        sysName: [
          { required: false, message: "应用名称不能为空", trigger: "blur" },
        ],
        series: [
          { required: true, message: "系列不能为空", trigger: "blur" },
        ],
        frequency: [
          { required: true, message: "出现频率不能为空", trigger: "blur" },
        ],
        urgentLevel: [
          { required: true, message: "紧急程度不能为空", trigger: "blur" },
        ],
        content: [
          { required: true, message: "问题描述不能为空", trigger: "blur" },
        ],
        model: [
          { required: true, message: "型号不能为空", trigger: "blur" },
        ],
        deviceType: [
          { required: true, message: "终端类型不能为空", trigger: "blur" },
        ],
        comment: [
          { required: true, message: "省测处理意见不能为空", trigger: "blur" },
        ],
      },
      terminalList: [],
      typeList: [],
      influenceList: [],
      frequencyList: [],
      urgentLevelList: [],
      fileList: [],
      // action: "/api/idevelop-resource/oss/endpoint/put-file",
      // exportAction: "/api//idevelop-control/question/import",
      action: "#",
      exportAction: "#",
      headers: {
        Authorization: `Basic ${Base64.encode(
          `${website.clientId}:${website.clientSecret}`
        )}`,
        "Idevelop-Auth": "bearer " + getToken(),
      },
      saveLoading: false,
      showOperate: false,
    };
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  mounted() {
    this.submitForm.filler = this.userDetail.realName;
    this.submitForm.fillerId = this.userDetail.userId;
    this.submitForm.dept = this.userDetail.ownerUnitName;
    this.submitForm.deptId = this.userDetail.ownerUnit;
    this.initForm();
    this.getDict();
    this.getPhone();
    // this.getDictCmdbList('1082554947272704') // 品牌
    // this.getDictCmdbList('1131183120646144') // 操作系统

  },
  methods: {
    getPhone(){
      getPhone().then(res =>{
        this.phoneNum = res.data
      })
    },
     getDictCmdbList(ciId) { //加载字典
        getDictCmdbList({ciId: ciId}).then(res => {
         if (ciId === '1082554947272704') { // 品牌
            this.brandList = res.data
          }else if(ciId ==='1131183120646144'){ // 操作系统类型
            this.osTypeList = res.data.filter(item=> item.dictValue === '银河麒麟' || item.dictValue === '统信');
          }

        });
      },
      getDictCmdbListPid(ciId, pid){
        getDictCmdbListPid({ ciId: ciId, pid: pid }).then(res => {
         if (ciId === '1082609011851264') { // 系列
            this.seriesList = res.data
          } else if (ciId === '1082608047161344') { // 型号
            this.deviceModelList = res.data
          }
        });
      },
      // 操作系统类型
    osTypelChange(index){
      // let current = this.osTypeList.filter(el=> el.dictValue == this.devList[index].deviceForm.osType)
      // this.devList[index].deviceForm.osTypeCode = current[0].dictKey
    },
      brandChange(val){ // 品牌
        this.submitForm.series = "";
        this.submitForm.deviceModel = "";
        // this.getDictCmdbListPid('1082609011851264', val) // 系列

        let current = this.brandList.filter(ele=> ele.dictKey == val)[0]
        // 系列
        getDictBsd('control_question_bsm', current.id).then(res=>{
          this.seriesList = res.data
        })
      },
      seriesChange(val){ // 系列
        this.submitForm.deviceModel = "";

        // this.getDictCmdbListPid('1082608047161344', val) // 型号
        // 型号
        let current = this.seriesList.filter(ele=> ele.dictKey == val)[0]
        getDictBsd('control_question_bsm', current.id).then(res=>{
          this.deviceModelList = res.data
        })
      },
      deviceModelChange(val){ // 型号
      },
    initForm() {
      if (this.showType == "修改") {
        questionDetail({ id: this.questionId }).then( async (res) => {
          this.submitForm = res.data;
          // 品牌
          let brandList = await getDictBsd('control_question_bsm', 0)
          this.brandList = brandList.data
          // // 系列
          // let current1 = this.brandList.filter(ele=> ele.dictKey == this.submitForm.brand)[0]
          // let seriesList =  await getDictBsd('control_question_bsm', current1.id)
          // this.seriesList = seriesList.data
          // // 型号
          // let current2 = this.seriesList.filter(ele=> ele.dictKey == this.submitForm.series)[0]
          // let deviceModelList = await getDictBsd('control_question_bsm', current2.id)
          // this.deviceModelList = deviceModelList.data

          if (this.submitForm.path != "" && this.submitForm.path != null) {
            
            this.submitForm.path.split(",").forEach((item) => {
              this.fileList.push({
                url: item,
                response: {
                  data: {
                    link: item,
                  },
                },
              });
            });
          }

          // this.getDictCmdbListPid('1082609011851264', this.submitForm.brand) // 系列
          // this.getDictCmdbListPid('1082608047161344', this.submitForm.series) // 型号


        });
      }else{
        // 品牌
        getDictBsd('control_question_bsm', 0).then(res=>{
          this.brandList = res.data
        })
      }
    },
    // 字典值
    getDict() {
      let dict = [
        "control_question_type",
        "control_question_terminal_info",
        "control_question_frequency",
        "control_question_urgent_level",
        "control_question_influence",
        "control_question_device_type",

        "control_question_osType",
        // "control_question_brand",
        // "control_question_series",
        // "control_question_model",
      ];

      for (let i = 0; i < dict.length; i++) {
        getDictList(dict[i]).then((res) => {
          if (dict[i] == "control_question_type") {
            //问题类型
            this.typeList = res.data;
          } else if (dict[i] == "control_question_terminal_info") {
            //终端信息
            this.terminalList = res.data;
          } else if (dict[i] == "control_question_frequency") {
            //出现频率
            this.frequencyList = res.data;
          } else if (dict[i] == "control_question_urgent_level") {
            //紧急程度
            this.urgentLevelList = res.data;
          } else if (dict[i] == "control_question_influence") {
            //影响范围
            this.influenceList = res.data;
          } else if (dict[i] == "control_question_device_type") {
            //影响范围
            this.deviceTypeList = res.data;
          } else if (dict[i] == "control_question_osType") {
            //操作系统
            this.osTypeList = res.data;
          } else if (dict[i] == "control_question_brand") {
            //影响范围
            this.brandList = res.data;
          } else if (dict[i] == "control_question_series") {
            //影响范围
            this.seriesList = res.data;
          } else if (dict[i] == "control_question_model") {
            //影响范围
            this.deviceModelList = res.data;
          }
        });
      }
    },
    beforeExportFileUpload(file) {
      let ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!(ext.indexOf("xlsx") > -1 || ext.indexOf("xls") > -1 )) {
        this.$message({
          message: "请上传xlsx或xlsx",
          type: "warning",
        });
        return ext.indexOf("xlsx") > -1 || ext.indexOf("xls") > -1;
      }
      if (file.size > 50 * 1024 * 1024) {
        this.$message({
          message: "大小不能超过50mb",
          type: "warning",
        });
        return false;
      }
    },
    beforeUpload(file) {
      let ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      
      // console.log(11122, file.name)
      // console.log(222, this.fileList)
      // console.log(333, isRepeat)
      
      if (!(ext.indexOf("jpg") > -1 || ext.indexOf("png") > -1)) {
        this.$message({
          message: "请上传jpg或png格式的图片",
          type: "warning",
        });
        return ext.indexOf("jpg") > -1 || ext.indexOf("png") > -1;
      }
      if (file.size > 5 * 500 * 1024) {
        this.$message({
          message: "大小不能超过5M",
          type: "warning",
        });
        return false;
      }

      // let isRepeat = this.fileList.some(ele=> ele.name == file.name)
      // if(isRepeat){
      //   this.$message({
      //     message: "请勿上传重复图片",
      //     type: "warning",
      //   });
      //   return false;
      // }

      

    },
    uploadFile( params ){
      const file = params.file

      const formData = new FormData()
      formData.append("file", file)

      uploadFile1(formData).then(res=>{
        params.onSuccess(res)
      })
    },
    uploadFile2( params ){
      const file = params.file

      const formData = new FormData()
      formData.append("file", file)

      exportUploadFile(formData).then(res=>{
        params.onSuccess(res)
      })
    },

    handleFileSuccess(res, file, fileList) {
      this.fileList = fileList;
      this.submitForm.path = this.fileList
        .map((item) => item.response.data.link)
        .join(",");
    },
    handleExportFileSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.$message({
          message: "问题导入成功！",
          type: "success",
        });
        this.$emit("backQuestion");
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      this.submitForm.path = this.fileList
        .map((item) => item.response.data.link)
        .join(",");
    },
    submit() {
      this.$refs.submitForm.validate(async (valid) => {
        if (valid) {

          this.$confirm("是否确认提交!","提示",{
            confirmButtonText:"确认",
            cancelButtonText:"取消",
            type:"warning"
          }).then(async ()=>{
            
            let saveRes = await questionSave(this.submitForm);
            this.submitForm.id = saveRes.data.id;
            processCreate({ id: saveRes.data.id }).then(() => {
              // this.showOperate = true;

              questionSubmit({
                userName: this.userDetail.userName,
                comment: "问题提交",
                id: this.submitForm.id
              }).then(res => {
                this.submitProcess()
              })


            });

          })
          
        } else {
          this.$message({
            message: "请完善表单项",
            type: "warning",
          });
        }
      });
    },
    save() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          if(this.isYiban){
            this.saveLoading = true;
            saveFinish(this.submitForm).then((res) => {
              this.$message({
                message: "暂存成功！",
                type: "success",
              });
              this.submitForm.id = res.data.id;
              this.saveLoading = false;
            });
          }else{
            this.saveLoading = true;
            questionSave(this.submitForm).then((res) => {
              this.$message({
                message: "暂存成功！",
                type: "success",
              });
              this.submitForm.id = res.data.id;
              this.saveLoading = false;
            });
          }
        } else {
          this.$message({
            message: "请完善表单项",
            type: "warning",
          });
        }
      });
    },
    cancel() {
      this.$emit("backQuestion");
    },
    submitProcess() {
      this.showOperate = false;
      this.$emit("backQuestion");
    },
    aDowload(url, fileName) {
      const x = new window.XMLHttpRequest();
      x.open('GET', url, true);
      x.responseType = 'blob';
      x.onload = () => {
        const url2 = window.URL.createObjectURL(x.response);
        const a = document.createElement('a');
        a.href = url2;
        a.download = fileName;
        a.click();
        a.style.display = 'none';
        const timer = setTimeout(() => {
          a.remove();

          //释放blob对象
          URL.revokeObjectURL(url2);
          clearTimeout(timer);
        }, 1000)
      };
      x.send();
    },
    modelDown() {
      downloadTemplate({}).then(res=>{
        this.aDowload(res, "问题提报模板.xlsx")
      })
      // this.download(
      //   "/api/idevelop-control/question/download/template",
      //   undefined,
      //   "问题提报模板.xls"
      // );
    },
  },
};
</script>

<style lang="scss" scoped>
.tel{
  position: fixed;
  bottom: 110px;
  right: 38px;
}
::v-deep .el-textarea__inner{
  font-size: 15px;
}
.description{
   ::v-deep .el-textarea__inner{
    min-height: 80px !important;
   }
}
.question_form {
  position: relative;
  height: 100%;
  box-shadow: 0 4px 25px 0 #e9f0ff;
  .back_btn {
    position: absolute;
    top: 0;
    left: 20px;
  }
  .form_title {
    text-align: center;
    margin-bottom: 20px;
  }
  .form_content {
    margin: 0 115px;
    height: calc(100% - 68px - 60px);
    margin-bottom: 15px;
    padding-right: 10px;
    overflow: auto;
    ::v-deep .el-input__inner {
      border-color: #93b8ff;
      height: 45px;
      font-size: 15px;
    }
    ::v-deep .el-form-item__label {
      line-height: 45px;
      color: #333;
    }
  }
  .dialogHieght {
    height: 67vh;
  }
  .btn_box {
    text-align: center;
  }
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::v-deep ::-webkit-scrollbar-button {
  display: none;
}
::-webkit-scrollbar-thumb {
  background: #bed4ff;
  border-radius: 3px;
}
::-webkit-scrollbar-track {
  margin: 5px;
}
</style>
