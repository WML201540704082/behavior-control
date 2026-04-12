<template>
  <!-- <basic-container>
    <div class="page_form"></div>
    <div class="page_body"> -->
      <el-scrollbar style="height: 50vh;">
        
        <formTitle :titleText="'基本信息'" :titleType="'page_title'"></formTitle>
        <!-- <el-scrollbar style="height:calc(100% - 420px)"> -->
          <el-form :model="form" ref="dataForm" class="xt_search_form" label-width="150px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="设备分类" prop="deviceCategory" size="small">
                  <el-select v-model="form.deviceCategory" placeholder="请选择设备分类" disabled >
                    <el-option v-for="dict in deviceCategoryList" :key="dict.dictKey" :label="dict.dictValue"
                               :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备类型" prop="deviceType" size="small">
                  <el-select v-model="form.deviceType" placeholder="请输入设备类型" disabled >
                    <el-option v-for="dict in deviceTypeList" :key="dict.dictKey" :label="dict.dictValue"
                               :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="WBS项目" prop="wbsProject" size="small">
                  <el-input v-model="form.wbsProject" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="WBS元素" prop="wbsElement"  size="small">
                  <el-input v-model="form.wbsElement" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工单编号" prop="filingNo" size="small" >
                  <el-input v-model="form.filingNo"  placeholder="请输入工单编号" disabled ></el-input>
                </el-form-item>
              </el-col>
            <!--</el-row>
            <el-row>-->
              <el-col :span="8">
                <el-form-item label="设备增加方式" prop="deviceAddType" size="small">
                  <el-select v-model="form.deviceAddType"  placeholder="请选择设备增加方式" disabled >
                    <el-option  v-for="dict in deviceAddTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item label="设备变动方式" v-if="false" prop="deviceChangeType" size="small">
                  <el-select v-model="form.deviceChangeType"  placeholder="请选择设备变动方式" disabled  >
                    <el-option  v-for="dict in deviceChangeTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="ERP同步状态" v-if="false" prop="erpStatus" size="small">
                  <el-select v-model="form.erpStatus"  placeholder="请选择ERP同步状态" disabled  >
                    <el-option  v-for="dict in deviceErpStatusList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
            <!--</el-row>
            <el-row>-->
              <el-col :span="8">
                <el-form-item label="产权单位" prop="ownerUnit" size="small">
                  <el-input v-model="form.ownerUnitName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产权部门" prop="propertyDept"  size="small">
                  <el-input v-model="form.propertyDeptName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="使用保管人" prop="useKeepPerson" size="small">
                  <el-input v-model="form.useKeepPerson"  placeholder="请输入使用保管人" disabled></el-input>
                </el-form-item>
              </el-col>
            <!--</el-row>
            <el-row>-->
              <el-col :span="8">
                <el-form-item label="功能位置" prop="funLocation" size="small">
                  <el-select v-model="form.funLocation"  placeholder="请选择功能位置" disabled>
                    <el-option  v-for="dict in funLocationList" :key="dict.trlnr"  :label="dict.pltxt" :value="dict.trlnr"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工厂区域" prop="factoryArea" size="small">
                  <el-select v-model="form.factoryArea"  placeholder="请选择工厂区域" disabled>
                    <el-option  v-for="dict in factoryAreaList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="维护工厂" prop="maintenanceFactory" size="small">
                  <el-select v-model="form.maintenanceFactory"  placeholder="请输入维护工厂" disabled>
                    <el-option  v-for="dict in maintenanceFactoryList" :key="dict.code"  :label="dict.name" :value="dict.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            <!--</el-row>
            <el-row>-->
              <!-- <el-col :span="8">
                <el-form-item label="线站标识" prop="lineStation"  size="small" >
                  <el-input v-model="form.lineStation"  placeholder="请输入线站标识" disabled></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item label="安装地点" prop="installationSite" size="small" >
                  <el-input v-model="form.installationSite"  placeholder="请输入安装地点" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="使用保管部门" prop="useKeepDept"
                              :rules="[{ required: true, message: '使用保管部门不能为空'}]">
                  <el-select v-model="form.useKeepDept" filterable placeholder="请选择使用保管部门" clearable
                            @change="getuseKeepDept" disabled>
                    <el-option v-for="dict in erpDeptList" :key="dict.kostl" :label="dict.kostlT"
                              :value="dict.kostl"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实物保管部门" prop="entityKeepDept"
                              :rules="[{ required: true, message: '实物保管部门不能为空'}]">
                  <el-select v-model="form.entityKeepDept" filterable placeholder="请选择实物保管部门" clearable
                            @change="getEntityKeepDept" disabled>
                    <el-option v-for="dict in erpDeptList" :key="dict.kostl" :label="dict.kostlT"
                              :value="dict.kostl"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        <!-- </el-scrollbar> -->
        <formTitle :titleText="'设备列表'" :titleType="'page_title'"></formTitle>
        <el-table
          ref="deviceTable"
          :data="deviceList"
          size="small"
          border
          v-loading="loading"
        >
          <!-- <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" align="center" width="180"></el-table-column>
          <el-table-column prop="erpAssetCode" label="ERP资产编码" align="center" width="150"></el-table-column>
          <el-table-column prop="deviceName" label="设备名称" align="center" width="150" ></el-table-column>
          <el-table-column prop="deviceAssetInfo" label="资产信息" align="left">
            <template slot-scope="scope">
              <div style="font-size: 12px;text-align: left;">
                <spam>出厂序列号：{{scope.row.sn}}</spam>
                <br/>
                <spam>出厂日期：{{scope.row.factoryDate}}</spam>
                <br/>
                <spam>制造国家及地区：{{scope.row.maintenanceCountry}}</spam>
                <br/>
                <spam>制造商：{{scope.row.manufacturer}}</spam>
                <br/>
                <spam>地址：{{scope.row.address}}</spam>
                <br/>
                <spam>供应商：{{scope.row.supplierName}}</spam>
                <br/>
                <spam>供应商联系电话：{{scope.row.supplierTel}}</spam>
                <br/>
                <spam>功能位置：{{scope.row.funLocation}}</spam>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="deviceStatus" label="设备状态" align="center" width="120">
            <template  slot-scope="scope">
              <spam>{{showDictLable(scope.row.deviceStatus,deviceStatusList)}}</spam>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column> -->

          <el-table-column type="selection" width="30" fixed="left" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" align="center" width="180"></el-table-column>
          <el-table-column prop="erpAssetCode" label="ERP资产编码" align="center" width="150"></el-table-column>
          <el-table-column prop="erpStatus" label="ERP同步状态" align="center" width="120">
            <template slot-scope="scope">
              <spam>{{ showDictLable(scope.row.erpStatus, deviceErpStatusList) }}</spam>
            </template>
          </el-table-column>
          <el-table-column prop="deviceName" label="设备名称" align="center"></el-table-column>
          <el-table-column prop="deviceAssetInfo" label="资产信息" align="center">
            <template slot-scope="scope">
              <div style="font-size: 12px;text-align: left;">
                <spam>出厂序列号：{{ scope.row.sn }}</spam>
                <br/>
                <spam>出厂日期：{{ scope.row.factoryDate }}</spam>
                <br/>
                <spam>制造国家及地区：{{ scope.row.maintenanceCountry }}</spam>
                <br/>
                <spam>制造商：{{ scope.row.manufacturer }}</spam>
                <br/>
                <spam>地址：{{ scope.row.address }}</spam>
                <br/>
                <spam>供应商：{{ scope.row.supplierName }}</spam>
                <br/>
                <spam>供应商联系电话：{{ scope.row.supplierTel }}</spam>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="deviceStatus" label="设备状态" align="center" width="120">
            <template slot-scope="scope">
              <spam>{{ showDictLable(scope.row.deviceStatus, deviceStatusList) }}</spam>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="page.total"
          :page-size="page.pageSize"
          :current-page="page.currentPage"
          layout="sizes,total,prev,pager,next,jumper,total"
          @size-change="sizeChange"
          @current-change="currentChange"
          @prev-click="currentChange"
          @next-click="currentChange"
        ></el-pagination>
        <!-- 审批弹窗 -->
        <operateForm
          v-if="showOperate"
          :isShow="showOperate"
          :orderDeatil="form"
          :orderType="'转资工单'"
          :processKeys="'bpm_sbzz'"
          @close="showOperate = false"
          @submitOperate="submitOperate"
        ></operateForm>
      </el-scrollbar>
      <!-- 底部返回按钮-->
      <!-- <div class="form-btn">
        <el-button v-if="showAudit" type="primary" size="small" @click="handleAudited">审 批</el-button>
        <el-button class="border-btn" size="small" @click="handleReset">返 回</el-button>
      </div> -->
    <!-- </div> -->

    
  <!-- </basic-container> -->
</template>

<script>
  import {getDeviceList, getDetail, save, submit} from "@/api/device/devicetransfer";
  import { getApproveList} from "@/api/device/approverecord";
  import { getLogOptList} from "@/api/device/logopt";
  import {getDictCmdbList, getDictList, getDictCmdbListPid} from "@/api/dict";
  import {mapGetters,mapState} from "vuex";
  import step from "@/components/step/index"
  import operateForm from "@/views/personalDesk/components/operateForm"
  import {getErpmaintainList, getErptranstplnrList, getRDeptrpList} from "@/api/device/devicerecord";

  export default {
    components: { step, operateForm },
    props: ['orderDeatil'],
    data() {
      return {
        erpDeptList: [],

        stepActive: 1,
        id:'',
        form: {},
        queryDate: {},
        loading: true,
        isEdit: true,
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
        approveListStart: [],
        approveListApprove: [],
        approveListERP1: [],
        approveListERP2: [],
        approveListEnd: [],
        optList: [],
        page: {
          pageSize: 50,
          currentPage: 1,
          total: 0
        },
        showOperate: false,
        showAudit: this.$route.query.isAudit,
      };
    },
    computed: {
      ...mapGetters(["permission","userDetail"]),
      ...mapState({
        userInfo: state => state.user.userInfo
      }),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.devicetransfer_add, false),
          viewBtn: this.vaildData(this.permission.devicetransfer_view, false),
          delBtn: this.vaildData(this.permission.devicetransfer_delete, false),
          editBtn: this.vaildData(this.permission.devicetransfer_edit, false),
          exportBtn: this.vaildData(this.permission.devicetransfer_export, false)
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
      //加载字典--设备状态
      this.getCmdbDictList("1103423111233536");
      //加载字典--WBS元素
      // this.getDictList("wbsElt");
      //加载字典--ERP工单状态
      this.getDictList("erpState");
      //加载字典--设备增加方式
      //this.getDictList("deviceAddType");
      this.getCmdbDictList("1083864635473920");
      //加载字典--设备方式
      this.getDictList("deviceType");
      //加载字典--设备分类
      //this.getDictList("deviceCategory");
      this.getCmdbDictList("1097745625841664");
      //加载字典--设备变动方式
      //this.getDictList("deviceChangeType");
      this.getCmdbDictList("1083948487999488");
      //加载字典--品牌
      this.getCmdbDictList("1082554947272704");
      //加载字典--系列
      //this.getCmdbDictList("1082609011851264");
      //加载字典--型号
      //this.getCmdbDictList("1082608047161344")
      //加载字典--功能位置
      //this.getDictList("funLocation")
      //加载字典--工厂区域
      //this.getDictList("factoryArea")
      //加载字典--维护工厂
      //this.getDictList("maintenanceFactory")


      //加载字典--功能位置
      this.getErptranstplnrList();
      //加载字典--工厂区域
      this.getCmdbDictList("1083945124167680");
      //加载字典--维护工厂
      this.getErpmaintainList();

      this.id = null;
      //获取参数 判断是否是新增还是修改
      const params = this.orderDeatil
      //params.id='1760851395719598082'
      this.id = params.id;
      if(params.id){
        this.id = params.id;
        this.loadDetail(params.id);
        this.isEdit = true
      }else{
        //参数异常处理
      }
      //加载 设备列表
      this.loadDeviceDataList();
      //加载审批记录
      this.loadApproveDataList();
      //加载操作记录
      this.loadLogOptDataList();

      this.getRDeptrpList()
    },
    methods: {
      getRDeptrpList() {
        // 使用保管部门 实物保管部门
        getRDeptrpList({swerk: this.userDetail.erpUnitCode, current: 1, size: 100}).then(res => {
          this.erpDeptList = res.data.records
        })
      },
      getErptranstplnrList(){
        //ERP功能位置
        getErptranstplnrList({swerk:this.userDetail.erpUnitCode||'AAAA',current:1,size:100}).then(res => {
          this.funLocationList = res.data.records
        })
      },
      getErpmaintainList() {
        //ERP维护工厂
        getErpmaintainList({code:this.userDetail.erpUnitCode||'AAAA',current:1,size:100}).then(res => {
          this.maintenanceFactoryList = res.data.records
        })
      },
      getDictCmdbListPid(ciId, pid) {
        getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
          if (ciId === '1097745969774592') { // 设备类型
            this.deviceTypeList = res.data;
            this.deviceTypeList = this.deviceTypeList.filter(item => item.dictKeyErp);
            if (this.deviceTypeList && this.deviceTypeList.length > 0) {
              // this.form.deviceType = this.deviceTypeList[0].dictKey || ''
            }
            //dictKeyErp
          }
        });
      },
      getDictList(code){
        getDictList(code).then(res => {
          // if(code==='deviceStatus'){
          //   this.deviceStatusList  = res.data;
          // }
       if(code==='wbsElt'){
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
          }
        });
      },
      getCmdbDictList(code,pid){
        //加载cmdb字典
        let query = {}
        query.ciId = code||'1082372687986688'
        if(pid){
          query.pid = pid
        }
        getDictCmdbList( query ).then(res => {
          if(code==='1102238379737088'){
            this.optYearList  = res.data;
          }else if(code==='1102247959527424'){
            this.afterSaleStatusList  = res.data;
          }else if(code==='1082607703228416'){
            this.deviceWBSList = res.data;
          }else if(code==='1083945124167680'){
            this.factoryAreaList = res.data;
          } else if(code === '1103423111233536'){
            this.deviceStatusList = res.data;
          }else if(code==='1083864635473920'){
            this.deviceAddTypeList = res.data;
          }else if(code==='1083948487999488'){
            this.deviceChangeTypeList = res.data;
          }else if(code==='1082554947272704'){
            this.brandList = res.data;
          }else if(code==='1082609011851264'){
            this.seriesList = res.data;
          }else if(code==='1082608047161344'){
            this.deviceModelList = res.data;
          }else if (code == '1097745625841664') {
            //console.log("res.data + "+ res.data);
            for (let i = 0; i < res.data.length; i++) {
              let item = res.data[i]
              if (item.dictKey != '1097756774301696' && item.dictKey != '1097757327949825') {
                this.deviceCategoryList.push(item)
              }
            }
          }
        });
      },
      // wbsChange(itemValue){
      //   const option  = this.deviceWBSList.find(item => item.dictKey === itemValue);
      //   this.form.wbsProject = option ? option.dictValue : ''
      // },
      handleSaveOK(status) {
        this.$refs.dataForm.validate(valid =>{
          if(valid){
            this.form.status = status;
            //提交建档
            submit(this.form).then(() => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.handleReset();
            }, error => {
               
            });
          }
        })
      },
      handleSave(status) {
        this.$refs.dataForm.validate(valid =>{
          if(valid){
            this.form.status = status;
            //暂存
            save(this.form).then(() => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.handleReset();
            }, error => {
               
            });
          }
        })
      },
      handleReset(){
        //返回
        if( this.$route.query.formRouter ){
          return this.$closePage(this.$route.query.formRouter)
        }
        if(this.showAudit) {
          this.$closePage('/personalDesk/desk');
        }else {
          this.$closePage('/device/capitalTransfer')
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
      loadDetail(id){
        getDetail(id).then(res => {
          this.form = res.data;
          //加载字典--系列
          //this.getCmdbDictList("1082609011851264",this.form.brand);
          //加载字典--型号
          //this.getCmdbDictList("1082608047161344",this.form.series)
          this.getDictCmdbListPid('1097745969774592', this.form.deviceCategory)
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
        query.transferId = this.id||'--';
        query.filingNo = this.id||'--';
        getDeviceList(this.page.currentPage, this.page.pageSize,query).then(res => {
          const data = res.data;
          this.page.total = data.total;
          this.deviceList = data.records;
          this.loading = false;
        });
      },
      loadApproveDataList() {
        //加载审批记录
        this.loading = true;
        let query = {};
        query.filingNo = this.id||'--';
        let _this = this
        getApproveList(1, 30,query).then(res => {
          const data = res.data;
          _this.approveList = data.records;
          if(_this.approveList){
            _this.approveListStart = _this.approveList.filter(item => item.nodeName === '转资申请' )
            _this.approveListApprove = _this.approveList.filter(item => item.nodeName === '专工审批' )
            _this.approveListEnd = _this.approveList.filter(item =>  item.nodeName === '自动归档' )
            //标记激活节点
            if(_this.approveListStart && _this.approveListStart.length>0){ _this.stepActive=1 }
            if(_this.approveListApprove && _this.approveListApprove.length>0){ _this.stepActive=2 }
            if(_this.approveListEnd && _this.approveListEnd.length>0){ _this.stepActive=3 }
          }
        });
      },
      loadLogOptDataList() {
        //加载操作记录
        let query = {};
        query.logId = this.id||'--';
        getLogOptList(1,20, query).then(res => {
          const data = res.data;
          this.optList = data.records;
        });
      },
      handleAudited() {
        this.showOperate = true
      },
      submitOperate() {
        this.showOperate = false
        this.$closePage('/personalDesk/desk');
      },

      getuseKeepDept(code) {
        this.erpDeptList.forEach(val => {
          if (val.kostl === code) {
            this.form.useKeepDeptName = val.kostlT
            this.form.useKeepDept = val.kostl
          }
        })
      },
      getEntityKeepDept(code) {
        // "kostlT": "国网济南市历城区供电公司-其他虚拟机构",
        //   "swerk": "AAAA",
        //   "kostl": "C0601A0099"
        this.erpDeptList.forEach(val => {
          if (val.kostl === code) {
            this.form.entityKeepDeptName = val.kostlT
            this.form.entityKeepDept = val.kostl
          }
        })
      },
    }
  };
</script>

<style lang="scss" scoped>
::v-deep .el-input__suffix{
  line-height: 32px
}
</style>
