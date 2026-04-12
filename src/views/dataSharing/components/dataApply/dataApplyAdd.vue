<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      
      
      <el-scrollbar style="height:calc(100% - 80px);">
        <template v-if="isInfo && form.id">
          <formTitle :titleText="'处理进度'" :titleType="'page_title'" style="margin-bottom: 10px"></formTitle>
          <el-row type="flex">
            <el-col :span="22" style="height: 100px;">
              <step
                :processKey="'bpm_jksp'"
                :orderId="form.id"
                :orderCode="form.filingNo"
                :currentSteps="form.processStatus"
                :orderNo="form.filingNo"
                :status="form.type"
              ></step>
            </el-col>
          </el-row>
        </template>
        <formTitle :titleText="'数据共享申请信息'" :titleType="'page_title'"></formTitle>
        <el-form :model="form"
                 ref="dataForm"
                 :rules="rules"
                 :disabled="isInfo"
                 class="xt_form" label-width="120px">
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="申请项目组名" prop="applyTeamName" size="small">
                <el-input v-model="form.applyTeamName" placeholder="请输入申请项目组名" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请地址IP" prop="applyIp" size="small">
                <el-input v-model="form.applyIp" placeholder="请输入申请地址IP" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请数量" prop="applyNumber" size="small">
                <el-input v-model="form.applyNumber" @input="hanleInput" min="0" type="number" placeholder="请输入申请数量" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目组联系方式" prop="applyPhone" size="small">
                <el-input v-model="form.applyPhone" placeholder="请输入联系方式" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请原因" prop="applyCause" size="small">
                <el-input v-model="form.applyCause" placeholder="请输入申请原因" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名称" prop="userId">
                <el-select v-model="form.userId" placeholder="请选择用户名称" filterable clearable @change="userIdChange">
                  <el-option v-for="dict in userIdList" :key="dict.id" :label="dict.realName"
                             :value="dict.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请接口" prop="portId">
                <el-select v-model="form.portId" placeholder="请选择申请接口" filterable clearable @change="portIdChange">
                  <el-option v-for="dict in portIdList" :key="dict.id" :label="dict.port"
                             :value="dict.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>


            <!-- <el-col :span="6">
              <el-form-item label="设备分类" prop="deviceCategory">
                <el-select v-model="form.deviceCategory" placeholder="请选择设备分类"
                           clearable @change="deviceCategoryChange">
                  <el-option v-for="dict in deviceCategoryList" :key="dict.dictKey" :label="dict.dictValue"
                             :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备类型" prop="deviceType">
                <el-select v-model="form.deviceType" @change="deviceTypeChange" placeholder="请输入设备类型" clearable
                           :disabled="!form.deviceCategory">
                  <el-option v-for="dict in deviceTypeList" :key="dict.dictKey" :label="dict.dictValue"
                             :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="责任人" prop="receiveDutyPersonName" size="small">
                <el-input v-model="form.receiveDutyPersonName" placeholder="请输入责任人" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="责任人身份证号" prop="receiveDutyCard" size="small" class="vaa">
                <template slot="label">
                  <span class="formLabel formLabelReq">责任人<br>身份证号</span>
                </template>
                <el-input v-model="form.receiveDutyCard" placeholder="请输入责任人身份证号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="receiveDutyIscAccount" size="small">
                <template slot="label">
                  <span class="formLabel">责任人<br>ISC账号</span>
                </template>
                <el-input v-model="form.receiveDutyIscAccount" placeholder="请输入责任人ISC账号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="receiveDutyPhone" size="small" class="vaa">
                <template slot="label">
                  <span class="formLabel formLabelReq">责任人<br>联系方式</span>
                </template>
                <el-input v-model="form.receiveDutyPhone" placeholder="请输入责任人联系方式" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            
            <el-col :span="6">
              <el-form-item label="受理时间" prop="applyDate">
                <el-date-picker
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="true" v-model="form.applyDate" type="datetime" placeholder="请输入受理时间" clearable>
                </el-date-picker>
              </el-form-item>
            </el-col>
         
            <el-col :span="6">
              <el-form-item label="临时使用时间" prop="createTime">
                <el-date-picker
                  :picker-options="temporaryTimesOptions"
                  class="formTime"
                  v-model="temporaryTimes"
                  type="daterange"
                  start-placeholder="临时使用开始时间"
                  end-placeholder="临时使用结束时间"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  @change="dataPickerChange"
                ></el-date-picker>
              </el-form-item>
            </el-col>
   
          </el-row> -->
        </el-form>

        <template v-if="isInfo">
          <formTitle :titleText="'申请共享服务接口列表'" :titleType="'page_title'"></formTitle>
          <el-table
            ref="repairDevTable"
            stripe
            size="small"
            :data="repairDevList"
          >
            <el-table-column type="selection" width="30" fixed="left"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="网址" prop="portAddress" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="请求类型" prop="portType" width="150" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="频率" prop="cycle" width="150" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="端口" prop="port" width="150" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="传入参数" prop="inParam" width="150" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="返回数据" prop="outParam" align="center" show-overflow-tooltip></el-table-column>
          </el-table>
        </template>
        <el-row style="margin-top:10px" v-if="isInfo">
          <el-col :span="12">
            <formTitle :titleText="'审批记录'" :titleType="'page_title'"></formTitle>
            <div style="margin-left: 10px;">
              <!-- <step
                :processKey="'bpm_jksp'"
                :orderId="form.id"
                :orderCode="form.filingNo"
                :currentSteps="form.processStatus"
                :orderNo="form.filingNo"
                :status="form.type"
              ></step> -->

              <step
                :processKey="'bpm_jksp'"
                :orderId="form.id"
                v-if="form.id"
                :stepType="true"
                :currentSteps="form.processStatus"
                :status="form.type"
                :stepHeight="'400px'"
              ></step>
            </div>
          </el-col>
          <el-col :span="12">
            <formTitle :titleText="'操作记录'" :titleType="'page_title'"></formTitle>
            <el-table
              ref="optTable"
              :data="optList"
              stripe
              border
            >
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="optRole" label="角色" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="optName" label="操作人" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="160" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="title" label="操作内容" width="350" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>
        </el-row>







        <template v-if="isShenpi">
          <formTitle :titleText="'审批信息'" :titleType="'page_title'"></formTitle>
          <el-form :model="form2"
                  ref="dataForm2"
                  :rules="rules2"
                  class="xt_form" label-width="120px">
            <el-row :span="6">
              <el-col :span="6">
                <el-form-item label="审批结果" prop="workerStatus" size="small">
                  <el-radio-group v-model="form2.workerStatus">
                    <el-radio :label="0">同意</el-radio>
                    <el-radio :label="1">驳回</el-radio>
                  </el-radio-group>
                  <!-- <el-radio v-model="form2.workerStatus" :label="0" key="0">同意</el-radio>
                  <el-radio v-model="form2.workerStatus" :label="1" key="1">拒绝</el-radio> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="6">
              <el-col :span="12">
                <el-form-item label="审批意见" prop="comment" size="small">
                  <el-input v-model="form2.comment" placeholder="请输入审批意见" clearable maxlength="200" type="textarea" rows="4"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-scrollbar>
      <!-- 底部按钮 -->
      <div class="form-btn">
        <el-button type="primary"  v-if="!isInfo && !isShenpi" size="small" @click="handleSaveOK(2)">提交</el-button>
        <el-button class="border-btn"  v-if="!isInfo && !isShenpi" size="small" @click="handleSave(1)" style="margin-left: 50px;">暂 存</el-button>
        <el-button type="primary" v-if="isShenpi" size="small" @click="handleAudited">审批</el-button>
        <el-button class="border-btn" size="small" @click="handleReset" style="margin-left: 50px;">返 回</el-button>
      </div>
    </div>


    <!-- 审批弹窗 -->
    <operateForm
      v-if="showOperate"
      :isShow="showOperate"
      :orderDeatil="form"
      :orderType="'申请工单'"
      :processKeys="'bpm_sbsqckty'"
      @close="showOperate = false"
      @submitOperate="submitOperate"
    ></operateForm>
  </basic-container>
</template>

<script>
import crypto from "@/util/crypto";
import {getDetail, save, submit, approval, userList} from "@/api/dataSharing/dataApply";
import {getDictList, getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import {mapGetters} from "vuex";
import uploadImg from "@/views/operation/components/devReturned/uploadImg.vue";
import {cardid, isvalidatemobile,} from "@/util/validate";
import {submitProcess, updateDevApplyStatus} from "@/api/process";
import {dateFormat} from "@/util/date";
import Vue from "vue";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import step from "@/components/step/index.vue";
import operateForm from "@/views/personalDesk/components/operateForm.vue";
import {getList as dataList} from "@/api/dataSharing/dataList";
import { getLogOptList } from "@/api/device/logopt";
export default {
  components: {xtTreeLzaySelect, uploadImg, step, operateForm},
  data() {
    // eslint-disable-next-line no-unused-vars
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]));
      } else {
        callback();
      }
    };
    return {
      repairDevList: [],
      optList: [],
      form2: {
        workerStatus: undefined,
        comment: undefined,
      },
      userIdList: [],
      portIdList: [],

      isInfo: this.$route.query.isInfo,
      isShenpi: this.$route.query.isShenpi,
      showOperate: false,
      id: '',
      temporaryTimes: null,
      form: {
        applyTeamName: undefined,
        applyIp: undefined,
        applyNumber: undefined,
        applyPhone: undefined,
        applyCause: undefined,
      },
      isEdit: true,
      deviceAddTypeList: [],
      deviceChangeTypeList: [],
      deviceStatusList: [],
      deviceErpStatusList: [],
      deviceWBSList: [],
      deviceChangeList: [],
      deviceCategoryList: [],
      deviceTypeList: [],
      selectionList: [],
      networkTypeList: [],
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      funLocationList: [],
      maintenanceFactoryList: [],
      deviceSourceList: [],

      rules: {
        applyTeamName: [
          {required: true, message: "请输入申请项目组名", trigger: "blur"}
        ],
        applyIp: [
          {required: true, message: "请输入申请地址IP", trigger: "blur"}
        ],
        applyNumber: [
          {required: true, message: "请输入申请数量", trigger: "blur"}
        ],
        applyPhone: [
          {required: true, message: "请输入项目组联系方式", trigger: "blur"}
        ],
        applyCause: [
          {required: true, message: "请输入申请原因", trigger: "blur"}
        ],
      },
      rules2: {
        workerStatus: [
          {required: true, message: "请选择审批结果", trigger: "change"}
        ],
        comment: [
          {required: true, message: "请输入审批意见", trigger: "blur"}
        ],
      },


      temporaryTimesOptions: {
        disabledDate: (time)=>{
          return time.getTime() < Date.now() - 8.64e7
        }
      },
    };
  },
  computed: {
    ...mapGetters(["permission", "userInfo", "userDetail"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.deviceapply_add, false),
        viewBtn: this.vaildData(this.permission.deviceapply_view, false),
        delBtn: this.vaildData(this.permission.deviceapply_delete, false),
        editBtn: this.vaildData(this.permission.deviceapply_edit, false),
        exportBtn: this.vaildData(this.permission.deviceapply_export, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  mounted() {
    this.loadLogOptDataList()

    userList({}).then(res => {
      const data = res.data;
      this.userIdList = data
    });
    dataList({
      current: 1,
      size: 200,
    },).then(res => {
      const data = res.data.records;
      this.portIdList = data;
    });


    // 设置页面元素高度
    this.setPageContentHeight()
    //加载字典--工单状态
    // this.getDictList("applyStatus");
    // //加载字典--设备类型
    // //this.getDictList("deviceType");
    // // this.getCmdbDictList("1097745969774592");
    // //加载字典--设备分类
    // //this.getDictList("deviceCategory");
    // this.getCmdbDictList("1097745625841664");
    // //加载字典--网络类型
    // // this.getDictList("networkType");
    // this.getCmdbDictList("1107942968721408");

    // //加载字典--设备来源
    // this.getDictList("deviceSource");


    this.id = null;
    //获取参数 判断是否是新增还是修改
    const params = this.$route.query
    this.id = params.id;
    if (params.id) {
      this.id = params.id;
      this.loadDetail({id: params.id});
      this.isEdit = true
    } else {
      this.isEdit = true
    }
  },
  methods: {
    loadLogOptDataList() {
      //加载操作记录
      getLogOptList(1, 99, {logId: this.$route.query.id}).then(res => {
        this.optList = res.data.records;
      });
    },
    
    handleAudited(){
      // this.showOperate = true
      
      this.$refs.dataForm2.validate(async valid => {
        if (valid) {
          approval({ ...this.form, ...this.form2 }).then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.handleReset();
          }, error => {
          });
        }else{
          this.$message.warning('请将必填信息填写完整！')
        }
      })
    },
    submitOperate() {
      this.showOperate = false
      this.$closePage('/personalDesk/desk');
    },
    
    getDictList(code) {
      getDictList(code).then(res => {
        if (code === 'deviceStatus') {
          this.deviceStatusList = res.data;
        } else if (code === 'wbsElt') {
          this.deviceWBSList = res.data;
        } else if (code === 'erpState') {
          this.deviceErpStatusList = res.data;
        } else if (code === 'deviceCategory') {
          this.deviceCategoryList = res.data;
        } else if (code === 'deviceType') {
          this.deviceTypeList = res.data;
          this.deviceTypeListAll = res.data;
        } else if (code === 'deviceAddType') {
          this.deviceAddTypeList = res.data;
        } else if (code === 'deviceChangeType') {
          this.deviceChangeTypeList = res.data;
        } else if (code === 'brand') {
          this.brandList = res.data;
        } else if (code === 'series') {
          this.seriesList = res.data;
        } else if (code === 'deviceModel') {
          this.deviceModelList = res.data;
        } else if (code === 'funLocation') {
          this.funLocationList = res.data;
        } else if (code === 'factoryArea') {
          this.factoryAreaList = res.data;
        } else if (code === 'maintenanceFactory') {
          this.maintenanceFactoryList = res.data;
        } else if (code === 'deviceSource') {
          this.deviceSourceList = res.data;
        }
      });
    },
    getCmdbDictList(code) {
      //加载cmdb字典
      let query = {}
      query.ciId = code || '1082372687986688'
      getDictCmdbList(query).then(res => {
        if (code === '1102238379737088') {
          this.optYearList = res.data;
        } else if (code === '1102247959527424') {
          this.afterSaleStatusList = res.data;
        } else if (code === '1082607703228416') {
          this.deviceWBSList = res.data;
        } else if (code === '1097745625841664') {
          this.deviceCategoryList = res.data;
        } else if (code === '1097745969774592') {
          this.deviceTypeList = res.data;
          this.deviceTypeListAll = res.data;
        } else if (code === '1107942968721408') { // 所属网络
          this.networkTypeList = res.data;
        }
      });
    },
    getDictCmdbListPid(ciId, pid) {
      getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
        if (ciId === '1097745969774592') { // 设备类型
          this.deviceTypeList = res.data;
        }
        // else if(ciId==='1097745625841664'){ // 设备分类
        //   this.deviceCategoryList  = res.data;
        // }
      });
    },
    validateUserPhone(phone) {
      let isPhone = /^1\d{10}$/;
      let isTel = /\d{2-5}-?\d{4,8}$/;
      let isShtTel = /\d{4,9}$/;
      let msg = '';
      //常用号码95 812 加4位短号  手机号  普通固化
      if (!isPhone.test(phone) && !isTel.test(phone) && !isShtTel.test(phone)) {
        msg = phone + '号码格式不正确';
        this.$message({
          type: "success",
          message: msg
        });
        return false;
      }
      return true;
    },
    deviceCategoryChange(code) {
      //设备分类选择
      this.form.deviceType = ''
      this.getDictCmdbListPid('1097745969774592', code) // 设备类型

      this.form.oldToNew = '1'
      // console.log(112, this.deviceCategoryList, code)
      let current = this.deviceCategoryList.filter(el => el.dictKey == code)[0]
      // console.log(880, current)
      this.form.deviceCategoryName = current.dictValue;

    },
    deviceTypeChange(val) {
      let current = this.deviceTypeList.filter(el => el.dictKey == val)[0]
      this.form.deviceTypeName = current.dictValue;

      this.form.oldToNew = '1'
    },

    userIdChange(id) {
      let current = this.userIdList.filter(el => el.id == id)[0]
      this.form.userName = current.realName;
    },
    portIdChange(id) {
      let current = this.portIdList.filter(el => el.id == id)[0]
      this.form.port = current.port;
    },


    async handleSaveOK() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          //提交建档
          submit(this.form).then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.handleReset();
          }, error => {
          });
        }else{
          this.$message.warning('请将必填信息填写完整！')
        }
      })
    },
    handleSave() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          //暂存
          save(this.form).then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.handleReset();
          }, error => {
          });
        }else{
          this.$message.warning('请将必填信息填写完整！')
        }
      })
    },
    handleReset() {
      //返回
      if( this.$route.query.formRouter ){
        return this.$closePage(this.$route.query.formRouter)
      }

      if (this.$route.query.isAudit) {
        this.$closePage('/personalDesk/desk')
      } else {
        this.$closePage('/dataSharing/dataApply')
      }

    },
    showDictLable(code, dictList) {
      if (dictList != null && code != '') {
        let items = dictList.filter(item => item.dictKey === code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }
      }
      return code;
    },
    
    loadDetail(params) {
      //获取信息
      getDetail(params).then(res => {

        this.form = res.data;
        this.repairDevList = [res.data.endpointPortVOList]
        // this.form.oldToNew = (this.form.oldToNew + '')
        // this.form.operation = (this.form.operation + '')
        // this.form.deviceSource = this.form.deviceSource + ''
        // this.form.networkType = (this.form.networkType + '')
        this.$forceUpdate()
        this.$refs.dataForm.clearValidate();

      });
    },
    hanleInput(value) {
      const reg = /^[1-9]\d*$/;
      if (!reg.test(value)) {
        this.form.applyNumber = this.form.applyNumber.substring(0, this.form.applyNumber.length - 1)
      }
    },


    dataPickerChange(temporaryTimes) {
      //时间段选择
      if (temporaryTimes != null && temporaryTimes.length > 0) {
        this.form.temporaryStartTime = temporaryTimes[0]//临时使用结束时间
        this.form.temporaryEndTime = temporaryTimes[1]//临时使用开始时间
      } else {
        this.form.temporaryStartTime = null
        this.form.temporaryEndTime = null
      }
    },
    deviceExport() {
      //导出
      let param = {}
      this.download(
        "/api/idevelop-device/device/apply/export",
        param,
        "申请设备清单.xlsx"
      )
    },
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-scrollbar__view{
  box-sizing: border-box;
  padding-top: 2px;
}

::v-deep .vaa  .el-form-item__label:before{
  display: none;
  // content: '' !important;
  // color: blue !important;
}
::v-deep .formTime{
  width: 100%;
  margin-top: 4px;

  .el-icon-date{
    margin-top: -7px;
  }
}
.formLabel {
  line-height: 16px;
  display: block;
}
.formLabelReq:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
}
</style>
