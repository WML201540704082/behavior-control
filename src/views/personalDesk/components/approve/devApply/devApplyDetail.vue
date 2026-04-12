<template>
  <div>
    <!-- <div class="page_form"></div>
    <div class="page_body"> -->
      <!-- height:calc(100% - 105px) -->
      <el-scrollbar style="height: 50vh">
        
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
            <el-col :span="6">
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
            <el-col :span="6">
              <el-form-item label="是否临时使用" prop="temporaryType" size="small"  >
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
        <!--设备列表 -->
        <formTitle :titleText="'使用信息'" :titleType="'page_title'"></formTitle>
        <!-- <el-table
          v-if=" form.processStatus == 'hussar_10' || form.processStatus == 'hussar_12' "
          ref="deviceTable"
          :data="deviceList"
          size="small"
          height="500px"
          v-loading="loading"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="userName" label="使用信息" align="center" >
            <template  slot-scope="scope">
              <div class="tableItem">
                <p>使用人：{{ scope.row.userName }}</p>
                <p>使用人联系方式：{{ scope.row.userPhone }}</p>
                <p>使用人身份证号：{{ scope.row.userCard }}</p>
                <p>安装地点：{{ scope.row.address }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userPhone" label="设备基本信息" align="center" >
            <template  slot-scope="scope">
              <div class="tableItem">
                <p>设备编码：{{ scope.row.deviceCode }}</p>
                <p>ERP资产编码：{{ scope.row.erpAssetCode }}</p>
                <p>出厂序列号：{{ scope.row.sn||scope.row.factoryNumber }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userCard" label="网络信息" align="center" >
            <template  slot-scope="scope">
              <div class="tableItem">
                <p>所属子网：{{ scope.row.deviceSubnet }}</p>
                <p>IP地址：{{ scope.row.deviceIp }}</p>
                <p>MAC地址：{{ scope.row.deviceMac }}</p>
                <p>入网方式：{{ scope.row.networkingMethod }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="认证信息" align="center" >
            <template  slot-scope="scope">
              <div class="tableItem">
                <p>认证账号：{{ scope.row.authAccount }}</p>
                <p>密码：{{ scope.row.authPassword }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="维护信息" align="center" >
            <template  slot-scope="scope">
              <div class="tableItem">
                <p>运维单位：{{ scope.row.operationUnit }}</p>
                <p>运维单位：{{ scope.row.operationDept }}</p>
                <p>运维责任人：{{ scope.row.operationUse }}</p>
                <p>运维等级：{{ scope.row.operationLevel }}</p>
                <p>运维联系电话：{{ scope.row.operationTel }}</p>
              </div>
            </template>
          </el-table-column>
        </el-table> -->

        <el-table
           v-if="form.oldToNew === '1'"
          ref="deviceTable"
          :data="deviceList"
          size="small"
          height="320px"
          v-loading="loading"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="userName" label="使用人" align="center" >
            <template  slot-scope="scope">
              <span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userPhone" label="使用人联系方式" align="center" >
            <template  slot-scope="scope">
              <span>{{scope.row.userPhone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userCard" label="使用人身份证信息" align="center" >
            <template  slot-scope="scope">
              <span>{{ scope.row.userCard }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="安装地点" align="center" >
            <template  slot-scope="scope">
              <span>{{scope.row.address}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userType" label="使用类型" align="center">
            <template slot-scope="scope">
              <!-- <el-select v-if="scope.row.isEdit" v-model="scope.row.userType"
                         @change="userTypeChange(scope.row.userType,scope.$index)" style="width:100%">
                <el-option :value='1' label="个人"></el-option>
                <el-option :value='0' label="公用"></el-option>
              </el-select> -->
              <span>{{ scope.row.userType == '1' ? '个人' : '公用' }}</span>
            </template>
          </el-table-column>


        </el-table>

        <!-- 以旧换新列表 -->
        <tradeTable disabled v-if="form.oldToNew === '0'" :tradeList="deviceList"></tradeTable>
        <!--
        <el-pagination
          :total="page.total"
          :page-size="page.pageSize"
          :current-page="page.currentPage"
          layout="sizes,total,prev,pager,next,jumper,total"
          @size-change="sizeChange"
          @current-change="currentChange"
          @prev-click="currentChange"
          @next-click="currentChange"
        ></el-pagination>-->

        <!-- <formTitle v-if="outForm.outboundNo" :titleText="'出库信息'" :titleType="'page_title'"></formTitle>
        <el-form v-if="outForm.outboundNo" :model="outForm" ref="dataOutForm" class="xt_search_form" label-width="100px">
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="出库单号" prop="applyNo" size="small">
                <el-input v-model="outForm.outboundNo" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所在仓库" prop="warehouseName" size="small">
                <el-input v-model="outForm.warehouseName"  clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出库数量" prop="outboundNum" size="small">
                <el-input v-model="outForm.outboundNum"  clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出库人员" prop="applyUserName" size="small">
                <el-input v-model="outForm.applyUserName"  clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出库时间" prop="outboundTime" size="small">
                <el-input v-model="outForm.outboundTime"  clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="备注" prop="remark" size="small">
                <el-input v-model="outForm.remark"  clearable disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6" class="fujian" >
            <el-col :span="24">
              <el-form-item label="附件" clearable>
                <div style=" min-width: 80px;display: inline;padding-right: 15px;">
                  <uploadImg
                    disabled
                    ref="uploadImg"
                    :type="'工单申请'"
                    :fileList="fileList2"
                    :attachId="form.attachId"
                    @setVal="selectDeviceHandler"
                  ></uploadImg>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <formTitle v-if="operationForm.operationNo" :titleText="'投运信息'" :titleType="'page_title'"></formTitle>
        <el-form v-if="operationForm.operationNo" :model="operationForm" ref="dataOptForm" class="xt_search_form" label-width="100px" style="height: 200px;">
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="投运单号" prop="operationNo" size="small">
                <el-input v-model="operationForm.operationNo"   clearable maxlength="24" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="投运时间" prop="operationDate"  clearable >
                <el-input v-model="operationForm.operationDate"  clearable style="width:100%" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="18">
              <el-form-item label="附件" size="small">
              </el-form-item>
            </el-col>
          </el-row>
        </el-form> -->


       
      </el-scrollbar>
      <!-- 底部返回按钮-->
    <!-- </div> -->


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
  </div>
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
    props: ['orderDeatil'],
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
        warehouseList: [],
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
      // this.setPageContentHeight()
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
      //加载 仓库列表
      // this.getWareList();
      //加载 班组列表
      this.getGroupList();

      this.id = null;
      //获取参数 判断是否是新增还是修改
      // const params = this.$route.query
      const params = this.orderDeatil
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
      //加载 设备列表
      //this.loadDeviceDataList();
      
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
      getGroupList(){
        //加载班组列表
        getGroupDictList({ownerUnitId:this.userInfo.deptId||''}).then(res => {
          this.receiveDutyGroupList  = res.data;
        });
      },
      getWareList(){
        //加载仓库列表
        getWareDictList({ownerUnitId:this.userInfo.deptId||''}).then(res => {
          this.warehouseList  = res.data;
        });
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
          if(this.form.temporaryStartTime && this.form.temporaryEndTime){// 渲染临时使用时间
            this.temporaryTimes = [ this.form.temporaryStartTime, this.form.temporaryEndTime ]
          } 
          this.form.filingNo = this.form.applyNo
          this.form.oldToNew = this.form.oldToNew+''
          this.form.operation = this.form.operation+''
          if(this.form.deviceSource)this.form.deviceSource = this.form.deviceSource+''
          this.form.receiveDutyGroupName = this.form.receiveDutyGroupName||this.form.groupName
          this.deviceList = res.data.deviceApplyDetailVOList||[]
          // this.fileList = res.data.deviceOrderFileDTOList||[]
          this.fileList = this.form.deviceOrderFileVOList.filter(el=>el.orderType == 'Apply') || [];
          this.fileList.forEach(i => {
            i.name = i.fileName,
            i.url = i.fileUrl
          })
          this.fileList2 = this.form.deviceOrderFileVOList.filter(el=>el.orderType == 'Outbound') || [];
          this.fileList2.forEach(i => {
            i.name = i.fileName,
            i.url = i.fileUrl
          })

          
          this.outForm = this.form.deviceOutboundVO||{}
          if(this.outForm.deviceSource)this.outForm.deviceSource = this.outForm.deviceSource+''
          this.operationForm = this.form.deviceOperationVO||{}
          this.loading = false;
          if(this.form.outboundNo){
            //申请出库工单
            //this.loadOutBoundDetail(this.form.outboundNo);
          }
          if(this.form.operationNo){
            //投运工单
            //this.loadOperationDetail(this.form.operationNo);
          }
          this.$refs.dataForm.$forceUpdate()
          this.$forceUpdate()


          this.id = this.form.id
          //加载操作记录
          this.loadLogOptDataList();
        });
      },
      loadOutBoundDetail(id){
        //申请出库工单
        getOutBoundDetail(id).then(res => {
          this.outForm = res.data;
          this.deviceList = res.data.deviceOperationDetailVOList||[]
          this.loading = false;
          this.$refs.dataForm.$forceUpdate()
          this.$forceUpdate()
        });
      },
      loadOperationDetail(id){
        //投运工单
        getOperationDetail({ id: id }).then(res => {
          this.operationForm = res.data;
          this.deviceList = res.data.deviceOperationDetailVOList||[]
          this.loading = false;
          this.$refs.dataForm.$forceUpdate()
          this.$forceUpdate()
        });
      },
      currentChange(currentPage){
        //分页 设备列表 点击第几页
        this.page.currentPage = currentPage;
        this.loadDeviceDataList();
      },
      sizeChange(pageSize){
        //切换设备列表  每页数量
        this.page.pageSize = pageSize;
        this.loadDeviceDataList();
      },
      loadDeviceDataList() {
        //加载 设备列表
        this.loading = true;
        let query = {};
        query.transferId = this.id||'';
        query.filingNo = this.id||'';
        getDeviceList(this.page.currentPage, this.page.pageSize,query).then(res => {
          const data = res.data;
          this.page.total = data.total;
          this.deviceList = data.records;
          this.loading = false;
        });

        this.loading = false;
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
      getAttachId(attachId){
        this.form.attachId = attachId
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
