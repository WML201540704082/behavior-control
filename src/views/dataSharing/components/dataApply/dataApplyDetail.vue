<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <el-scrollbar style="height:calc(100% - 32px - 15px)">
        <formTitle :titleText="'处理进度'" :titleType="'page_title'"></formTitle>
        <el-row type="flex">
          <el-col :span="22" style="height: 100px;">
            <step
              :processKey="'bpm_sbsqckty'"
              :orderId="form.id"
              :orderCode="form.applyNo"
              v-if="form.id"
              :currentSteps="form.processStatus"
              :orderNo="form.applyNo"
              :status="form.type"
            ></step>
          </el-col>
        </el-row>
        <formTitle :titleText="'基本信息'" :titleType="'page_title'"></formTitle>
        <el-form :model="form" ref="dataForm" class="xt_search_form" label-width="100px" >
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="申请编号" prop="applyNo" size="small">
                <el-input v-model="form.applyNo"  clearable  disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备分类" prop="deviceCategory">
                <el-select v-model="form.deviceCategory"  clearable @change="deviceCategoryChange" disabled>
                  <el-option  v-for="dict in deviceCategoryList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备类型" prop="deviceType" >
                <el-select v-model="form.deviceType" @change="deviceTypeChange" clearable disabled>
                  <el-option  v-for="dict in deviceTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          <!-- </el-row>
          <el-row :span="6"> -->
            <el-col :span="6">
              <el-form-item label="申请数量" prop="applyNum" size="small">
                <el-input v-model="form.applyNum"  clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="责任人" prop="receiveDutyPersonName" size="small">
                <el-input v-model="form.receiveDutyPersonName" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="责任人身份证号" prop="receiveDutyCard" size="small">
                <template  slot="label">
                  <span class="formLabel">责任人<br>身份证号</span>
                </template>
                <el-input v-model="form.receiveDutyCard"  clearable disabled></el-input>
              </el-form-item>
            </el-col>
          <!-- </el-row>
          <el-row :span="6"> -->
            <el-col :span="6">
              <el-form-item prop="receiveDutyIscAccount" size="small">
                <template  slot="label">
                  <span class="formLabel">责任人<br>ISC账号</span>
                </template>
                <el-input v-model="form.receiveDutyIscAccount" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="receiveDutyPhone" size="small">
                <template  slot="label">
                  <span class="formLabel">责任人<br>联系方式</span>
                </template>
                <el-input v-model="form.receiveDutyPhone"  clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="receiveDutyDept" size="small">
                <template  slot="label">
                  <span class="formLabel">责任人<br>部门</span>
                </template>
                <el-input v-model="form.receiveDutyDeptName"  clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="责任人班组" prop="receiveDutyGroup" size="small">
                <template  slot="label">
                  <span class="formLabel">责任人<br>班组</span>
                </template>
                <el-input v-model="form.receiveDutyGroupName"  clearable disabled></el-input>
              </el-form-item>
            </el-col> -->
          <!-- </el-row>
          <el-row :span="6"> -->
            <el-col :span="6">
              <el-form-item label="申请原因" prop="applyReason" size="small">
                <el-input v-model="form.applyReason"  clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否以旧换新" prop="oldToNew" size="small" >
                <el-radio v-model="form.oldToNew" label="0" value="0" key="0" disabled>是</el-radio>
                <el-radio v-model="form.oldToNew" label="1" value="1" key="1" disabled>否</el-radio>
              </el-form-item>
            </el-col>
<!--            <el-col :span="6">-->
<!--              <el-form-item label="是否立即投运" prop="operation" size="small">-->
<!--                <el-radio v-model="form.operation" label="1" value="1" key="1" disabled>是</el-radio>-->
<!--                <el-radio v-model="form.operation" label="0" value="0" key="0" disabled>否</el-radio>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <el-col :span="6" v-if="form.deviceCategory != '1118822355763201' && form.deviceCategory != '1097757118234624'">
              <el-form-item label="网络类型" prop="networkType"  clearable>
                <el-select v-model="form.networkType"  size="small" disabled>
                  <el-option v-for="dict in networkTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="受理人" prop="applyUserName">
                <el-input clearable v-model="form.applyUserName" disabled></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label="领用单位" prop="receiveUnit"  clearable >
                <el-input v-model="form.receiveUnitName"  clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请时间" prop="applyDate" size="small">
                <el-input clearable v-model="form.applyDate" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6" v-if="form.deviceCategory != '1118822355763201' && form.deviceCategory != '1097757118234624'">
              <el-form-item label="是否临时使用" prop="temporaryType" size="small">
                <el-radio v-model="form.temporaryType" :label="0" key="0" @change="temporaryTypeRadio" disabled>是</el-radio>
                <el-radio v-model="form.temporaryType" :label="1" key="1" @change="temporaryTypeRadio" disabled>否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item v-if="form.temporaryType=== 0" label="临时使用时间" prop="createTime">
                <el-date-picker
                  v-model="temporaryTimes"
                  type="daterange"
                  start-placeholder="临时使用开始时间"
                  end-placeholder="临时使用结束时间"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  disabled
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6" class="fujian">
<!--            <el-col :span="6">
              <el-form-item label="所在仓库" prop="warehouseName" size="small">
                <el-input clearable v-model="form.warehouseName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备来源" prop="deviceSource"  clearable >
                <el-select v-model="form.deviceSource"  clearable disabled>
                  <el-option  v-for="dict in deviceSourceList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>-->
            <el-col :span="12">
              <el-form-item label="附件" clearable>
                <div style=" min-width: 80px;display: inline;padding-right: 15px;">
                  <!-- <a :href="item.fileUrl" class="border-btn" style="display: inline;" :key="item.id" v-for="item in form.deviceOrderFileVOList" target="_blank" rel="noopener noreferrer">{{ item.fileName }}</a> -->
                  <uploadImg
                    disabled
                    ref="uploadImg"
                    :type="'工单申请'"
                    :fileList="fileList"
                    :attachId="form.attachId"
                    @setVal="selectDeviceHandler"
                  ></uploadImg>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
     
       

        <el-row type="flex">
          <!-- 底部左侧审批记录 开始-->
          <el-col :span="10">
            <formTitle :titleText="'审批记录'" :titleType="'page_title'"></formTitle>
            <div style="margin-left: 10px;">
              <step
                :processKey="'bpm_sbsqckty'"
                :orderId="form.id"
                v-if="form.id"
                :stepType="true"
                :currentSteps="form.processStatus"
                :orderNo="form.applyNo"
                :status="form.type"
                :stepHeight="'400px'"
              ></step>
            </div>
          </el-col>
          <!-- 底部右侧操作 开始-->
          <el-col :span="14">
            <formTitle :titleText="'操作记录'" :titleType="'page_title'"></formTitle>
            <el-table
              ref="optTable"
              :data="optList"
              
              v-loading="loading"
            >
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="optRole" label="角色" width="160"></el-table-column>
              <el-table-column prop="optName" label="操作人" width="120"></el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
              <el-table-column prop="title" label="操作内容" ></el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination
                :total="searchForm.total"
                :page.sync="searchForm.current"
                :limit.sync="searchForm.size"
                @pagination="loadLogOptDataList"
            />
          </el-col>
        </el-row>
      </el-scrollbar>
      <!-- 底部返回按钮-->
      <div class="form-btn">
        <el-button v-if="isAudit" type="primary" size="small" @click="handleAudited">审 批</el-button>
        <el-button class="border-btn" size="small" @click="handleReset">返 回</el-button>
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

    <!-- 选择设备 -->
    <deviceSelect type="change" v-if="deviceSelectSync" :isShow.sync="deviceSelectSync"  @setVal="deviceHandler"></deviceSelect>
  </basic-container>
</template>

<script>
  import crypto from "@/util/crypto";
  import { getDetail,getOutBoundDetail,getOperationDetail} from "@/api/device/deviceapply";
  import { getDeviceList} from "@/api/device/deviceapplydetail";
  import { getLogOptList} from "@/api/device/logopt";
  import {getDictCmdbList, getDictList} from "@/api/dict";
  import {mapGetters} from "vuex";
  import step from "@/components/step/index.vue";
  import {getGroupDictList} from "@/api/system/usergroup";
  import {getWareDictList} from "@/api/device/warehouse";
  import operateForm from "@/views/personalDesk/components/operateForm.vue";
  import uploadImg from "@/views/operation/components/devReturned/uploadImg.vue";
  import tradeTable from "./tradeTable.vue"
  import deviceSelect from "./deviceSelect.vue";

  export default {
    components: {operateForm, step, uploadImg, deviceSelect, tradeTable},
    data() {
      return {
        deviceSelectSync: false,

        fileList: [],
        fileList2: [],
        temporaryTimes: null,
        stepActive: 1,
        id:'',
        title: '',
        form: {},
        outForm: {},
        operationForm: {},
        queryDate: {},
        loading: false,
        isEdit: false,
        isView: true,
        searchForm:{
          current: 1,
          size: 20
        },
        deviceAddTypeList:[],
        deviceChangeTypeList: [],
        useKeepDeptList:[],
        deviceStatusList:[],
        deviceErpStatusList:[],
        deviceWBSList:[],
        deviceChangeList:[],
        deviceCategoryList: [],
        deviceTypeList: [],
        selectionList: [],
        brandList: [],
        seriesList:[],
        deviceModelList: [],
        funLocationList:[],
        maintenanceFactoryList: [],
        deviceList: [],
        approveList: [],
        optList: [],
        networkTypeList: [],

        deviceSourceList: [],
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        showOperate: false,
        showAudit: this.$route.query.isAudit||false,
        isAudit: this.$route.query.isAudit||false,
      };
    },
    computed: {
      ...mapGetters(["permission","userInfo"]),
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
    mounted(){
      // 设置页面元素高度
      this.setPageContentHeight()
      //加载字典--工单状态
      this.getDictList("applyStatus");
      //加载字典--设备类型
      //this.getDictList("deviceType");
      this.getCmdbDictList("1097745969774592");
      //加载字典--设备分类
      //this.getDictList("deviceCategory");
      this.getCmdbDictList("1097745625841664");
      this.getCmdbDictList("1107942968721408");
      //加载字典--网络类型
      this.getDictList("networkType");

      //加载字典--设备来源
      this.getDictList("deviceSource");

      this.id = null;
      //获取参数 判断是否是新增还是修改
      const params = this.$route.query
      //params.id='1760851395719598082'
      this.id = params.id||'';
      this.applyNo = params.applyNo||'';
      this.outboundNo = params.outboundNo||'';
      this.operationNo = params.operationNo||'';
      this.title = params.routerTitle;
      if(this.id){
        this.loadDetail({id: this.id});
        this.isEdit = true
      }if(this.applyNo){
        this.loadDetail({applyNo: this.applyNo});
        this.isEdit = true
      }if(this.outboundNo){
        this.loadDetail({outboundNo: this.outboundNo});
        this.isEdit = true
      }if(this.operationNo){
        this.loadDetail({operationNo: this.operationNo});
        this.isEdit = true
      }else{
        //参数异常处理
      }
      
    },
    methods: {
      getCmdbDictList(code){
        //加载cmdb字典
        let query = {}
        query.ciId = code||'1082372687986688'
        getDictCmdbList( query ).then(res => {
          if(code==='1082607703228416'){
            this.deviceWBSList = res.data;
          }else if(code==='1097745625841664'){
            this.deviceCategoryList  = res.data;
          }else if(code==='1097745969774592'){
            this.deviceTypeList  = res.data;
            this.deviceTypeListAll  = res.data;
          }else if(code==='1107942968721408'){ // 所属网络
            // console.log(898, res)
            this.networkTypeList = res.data;
          }
        });
      },
      getDictList(code){
        getDictList(code).then(res => {
          if(code==='deviceStatus'){
            this.deviceStatusList  = res.data;
          }else if(code==='wbsElt'){
            this.deviceWBSList = res.data;
          }else if(code==='erpState'){
            this.deviceErpStatusList = res.data;
          }else if(code==='deviceCategory'){
            this.deviceCategoryList = res.data;
          }else if(code==='deviceType'){
            this.deviceTypeList = res.data;
            this.deviceTypeListAll = res.data;
          }else if(code==='deviceAddType'){
            this.deviceAddTypeList = res.data;
          }else if(code==='deviceChangeType'){
            this.deviceChangeTypeList = res.data;
          }else if(code==='brand'){
            this.brandList = res.data;
          }else if(code==='series'){
            this.seriesList = res.data;
          }else if(code==='deviceModel'){
            this.deviceModelList = res.data;
          }else if(code==='funLocation'){
            this.funLocationList = res.data;
          }else if(code==='factoryArea'){
            this.factoryAreaList = res.data;
          }else if(code==='maintenanceFactory'){
            this.maintenanceFactoryList = res.data;
          }else if(code==='networkType'){
            this.networkTypeList = res.data;
          }else if(code==='deviceSource'){
            this.deviceSourceList  = res.data;
          }
        });
      },
      deviceCategoryChange(code){
        //设备分类选择
        this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));

        let current = this.deviceCategoryList.filter(el=> el.dictKey == code)[0]
        this.form.deviceCategoryName = current.dictValue;
      },
      changeDevType(val) {
        let current = this.deviceTypeList.filter(el=> el.dictKey == val)[0]
        this.form.deviceTypeName = current.dictValue;
      },
  
      handleReset(){
        //返回
        if( this.$route.query.formRouter ){
          return this.$closePage(this.$route.query.formRouter)
        }
        if(this.$route.query.tuiyun){
          this.$closePage('/personalDesk/desk');
        }else if(this.title=='设备申请详情'){
          this.$closePage('/device/devApply')
        }else if(this.title=='设备出库详情'){
          this.$closePage('/device/devOutBound')
        }else if(this.title=='设备投运详情'){
          this.$closePage('/device/devOperation')
        }else if(this.isAudit){
          this.showOperate = false
          this.$closePage('/personalDesk/desk');
        }
      },
      showDictLable(code,dictList){
        if(dictList!=null && code!=''){
          let items = dictList.filter(item => item.dictKey===code || item.dictKey==code);
          if(items!=null && items.length>0){
            return items[0].dictValue;
          }
        }
        return code;
      },
      loadDetail(params){
        //申请工单
        getDetail(params).then(res => {
          // let resData = res.data;
          // resData.receiveDutyCard = resData.receiveDutyCard && crypto.decryptBySM4(resData.receiveDutyCard) 
          // resData.receiveDutyIscAccount = resData.receiveDutyIscAccount && crypto.decryptBySM4(resData.receiveDutyIscAccount)
          // resData.receiveDutyPhone = resData.receiveDutyPhone && crypto.decryptBySM4(resData.receiveDutyPhone)
          // if( resData.deviceApplyDetailVOList.length>0 ){
          //   resData.deviceApplyDetailVOList.forEach(ele=>{
          //     ele.userPhone = ele.userPhone && crypto.decryptBySM4(ele.userPhone)
          //     ele.userCard = ele.userCard && crypto.decryptBySM4(ele.userCard)
          //   })
          // }  

          this.form = res.data;
          // if(this.form.temporaryStartTime && this.form.temporaryEndTime){// 渲染临时使用时间
          //   this.temporaryTimes = [ this.form.temporaryStartTime, this.form.temporaryEndTime ]
          // } 
          // this.form.filingNo = this.form.applyNo
          // this.form.oldToNew = this.form.oldToNew+''
          // this.form.operation = this.form.operation+''
          // if(this.form.deviceSource)this.form.deviceSource = this.form.deviceSource+''
          // this.form.receiveDutyGroupName = this.form.receiveDutyGroupName||this.form.groupName
        
          this.$refs.dataForm.$forceUpdate()
          this.$forceUpdate()


          this.id = this.form.id
          //加载操作记录
          this.loadLogOptDataList();
        });
      },

      loadLogOptDataList() {
        //加载操作记录
        let query = {};
        query.logId = this.id||'--';
        getLogOptList(this.searchForm.current, this.searchForm.size, query).then(res => {
          const data = res.data;
          this.optList = data.records;
          this.searchForm.total = data.total
        });
      },

      handleAudited() {
        this.showOperate = true
      },
      submitOperate() {
        this.showOperate = false
        this.$closePage('/personalDesk/desk');
      },
    }
  };
</script>
<style lang="scss" scoped>
::v-deep .el-range-editor.is-disabled input{
  color: #606266;
}
::v-deep .el-range-editor .el-range__icon{
  margin-top: -7px;
}
  // ::v-deep .el-input.is-disabled .el-input__inner{
  //   color: #606266;
  // }
.fujian{
  height: 160px;
}
.tableItem{
  text-align: left;
  p{
    margin: 0;
  }
}
.formLabel{
  line-height: 16px;
  display: block;
}
</style>
