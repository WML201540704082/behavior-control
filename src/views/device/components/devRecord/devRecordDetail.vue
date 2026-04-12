<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body" v-loading="pageLoading">
      <el-scrollbar style="height:calc(100% - 32px - 15px)">
        <formTitle :titleText="'处理进度'" :titleType="'page_title'"></formTitle>
        <el-row type="flex">
          <el-col :span="24" style="height: 120px;">
            <step
              :processKey="'bpm_sbjd'"
              :orderId="form.id"
              v-if="form.id"
              :currentSteps="form.processStatus"
              :status="form.processStatus === 'hussar_8'"
              :orderCode="form.filingNo"
            ></step>
          </el-col>
          <!-- <el-col :span="2">
            <el-image style="width: 100px; height: 100px;" fit="fill"></el-image>
          </el-col> -->
        </el-row>

        <formTitle :titleText="'基本信息'" :titleType="'page_title'"></formTitle>
        <el-form :model="form" ref="dataForm" class="xt_search_form" label-width="150px" disabled>
          <el-row>
            <el-col :span="8">
              <el-form-item label="WBS项目" prop="wbsProject" clearable :rules="[{ required: true, message: 'WBS项目不能为空'}]">
                <wbsSelect type="wbsProject" placeholder="请选择WBS元素" v-model="form.wbsProject" @change="wbsChange" disabled></wbsSelect>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="WBS元素" prop="wbsElement" clearable :rules="[{ required: true, message: 'WBS项目不能为空'}]">
                <wbsSelect type="wbsElement" placeholder="请选择WBS元素" v-model="form.wbsElement" @change="wbsChange" disabled></wbsSelect>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="建档编号" prop="filingNo" :rules="[{ required: false, message: '建档编号不能为空'}]">
                <el-input v-model="form.filingNo" placeholder="提交时自动生成" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备分类" prop="deviceCategory" :rules="[{ required: true, message: '设备分类不能为空'}]">
                <el-select v-model="form.deviceCategory" placeholder="请选择设备分类" clearable @change="deviceCategoryChange">
                  <el-option v-for="dict in deviceCategoryList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备类型" prop="deviceType" :rules="[{ required: true, message: '设备类型不能为空'}]">
                <el-select v-model="form.deviceType" placeholder="请输入设备类型" clearable :disabled="!form.deviceCategory" @change="deviceTypeChange">
                  <el-option v-for="dict in deviceTypeList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="维护工厂" prop="maintenanceFactoryCode" :rules="[{ required: true, message: '维护工厂不能为空'}]">
                <el-select v-model="form.maintenanceFactoryCode" placeholder="请输入维护工厂" clearable @change="getmaintenanceFactory">
                  <el-option v-for="dict in maintenanceFactoryList" :key="dict.code" :label="dict.name" :value="dict.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工厂区域" prop="factoryArea" :rules="[{ required: true, message: '工厂区域不能为空'}]">
                <el-select v-model="form.factoryAreaCode" placeholder="请选择工厂区域" clearable @change="getfactoryArea">
                  <el-option v-for="dict in factoryAreaList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实物保管部门" prop="entityKeepDept" :rules="[{ required: true, message: '实物保管部门不能为空'}]">
                <el-select v-model="form.entityKeepDept" filterable placeholder="请选择实物保管部门" clearable @change="getEntityKeepDept">
                  <el-option v-for="dict in erpDeptList" :key="dict.kostl" :label="dict.kostlT" :value="dict.kostl"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用保管部门" prop="useKeepDeptName" :rules="[{ required: true, message: '使用保管部门不能为空'}]">
                <el-select v-model="form.useKeepDeptName" filterable placeholder="请选择使用保管部门" clearable @change="getuseKeepDept">
                  <el-option v-for="dict in erpDeptList" :key="dict.kostl" :label="dict.kostlT" :value="dict.kostl"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="功能位置" prop="funLocationCode" :rules="[{ required: true, message: '功能位置不能为空'}]">
                <el-select v-model="form.funLocationCode" placeholder="请选择功能位置" clearable @change="getfunLocation">
                  <el-option v-for="dict in funLocationList" :key="dict.trlnr" :label="dict.pltxt" :value="dict.trlnr"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用保管人" prop="useKeepPerson" :rules="[{ required: true, message: '使用保管人不能为空'}]">
                <el-input v-model="form.useKeepPerson" placeholder="请输入使用保管人" clearable maxlength="20" :disabled="isEdit"></el-input>
              </el-form-item>
            </el-col>


            <el-col :span="8">
              <!-- min:0, max:9999,-->
              <el-form-item label="设备数量" prop="deviceNum" :rules="[{ required: true,message: '设备数量异常',trigger: change}]">
                <el-input
                  v-model="form.deviceNum"
                  :disabled="form.isSendErp == 1"
                  :min="1" :max="9999"
                  placeholder="请输入设备数量"
                  clearable
                  @input="changeDevNum"

                ></el-input>

              </el-form-item>
            </el-col>
          
            <el-col :span="8">
              <el-form-item label="设备增加方式" prop="deviceAddType" :rules="[{ required: true, message: '设备增加方式不能为空'}]">
                <el-select v-model="form.deviceAddType" filterable placeholder="请选择设备增加方式" clearable>
                  <el-option v-for="dict in deviceAddTypeList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="设备变动方式" prop="deviceChangeType" :rules="[{ required: true, message: '设备变动方式不能为空'}]">
                <el-select v-model="form.deviceChangeType" filterable placeholder="请选择设备变动方式" clearable>
                  <el-option v-for="dict in deviceChangeTypeList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="8">
              <el-form-item label="安装地点" prop="installationSite" :rules="[{ required: true, message: '安装地点不能为空'}]">
                <el-input v-model="form.installationSite" placeholder="请输入安装地点" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="投运日期" prop="oprtDate" :rules="[{ required: true, message: '投运日期为空'}]">
                <el-date-picker v-model="form.oprtDate" value-format="yyyy-MM-dd" type="date" placeholder="请输入投运日期" clearable></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购日期" prop="procureDate" :rules="[{ required: true, message: '采购日期为空'}]">
                <el-date-picker v-model="form.procureDate" value-format="yyyy-MM-dd" type="date" placeholder="请输入采购日期" clearable></el-date-picker>
              </el-form-item>
            </el-col> -->
            
       
            <el-col :span="8">
              <el-form-item label="设备名称" prop="deviceName" :rules="[{ required: true, message: '设备名称不能为空'}]">
                <el-input v-model="form.deviceName" placeholder="请输入设备名称" clearable maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="标准全称" prop="fullName" :rules="[{ required: true, message: '标准全称不能为空'}]">
                <el-input v-model="form.fullName" placeholder="请输入标准全称" clearable maxlength="30"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="计量单位" prop="unit" :rules="[{ required: true, message: '计量单位不能为空'}]">
                <el-select v-model="form.unit" @change="unitChange" placeholder="请选择计量单位" clearable>
                  <el-option v-for="dict in unitErpList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          
            <el-col :span="8">
              <el-form-item label="制造商" prop="manufacturer" :rules="[{ required: true, message: '制造商不能为空'}]">
                <el-select v-model="form.manufacturer" @change="manufacturerChange" placeholder="请选择制造商" filterable clearable>
                  <el-option v-for="dict in manufacturerList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="品牌" prop="brand" :rules="[{ required: true, message: '品牌不能为空'}]">
                <el-select v-model="form.brand" @change="brandChange" placeholder="请选择品牌" clearable :disabled="!form.manufacturer">
                  <el-option v-for="dict in brandList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="系列" prop="series" :rules="[{ required: true, message: '系列不能为空'}]">
                <el-select v-model="form.series" @change="seriesChange" placeholder="请输入系列" clearable :disabled="!form.brand">
                  <el-option v-for="dict in seriesList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="型号" prop="deviceModel" :rules="[{ required: true, message: '型号不能为空'}]">
                <el-select v-model="form.deviceModel" @change="deviceModelChange" placeholder="请输入型号" clearable :disabled="!form.series">
                  <el-option v-for="dict in deviceModelList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="铭牌号" prop="nameplateNo" :rules="[{ required: true, message: '铭牌号不能为空'}]">
                <el-input v-model="form.nameplateNo" placeholder="请输入铭牌号" clearable maxlength="30" :disabled="isEdit"></el-input>
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="8">
              <el-form-item label="制造国家地区" prop="maintenanceCountry" :rules="[{ required: true, message: '制造国家地区不能为空'}]">
                <el-input v-model="form.maintenanceCountry" placeholder="请输入制造国家地区" clearable maxlength="30" :disabled="isEdit"></el-input>
              </el-form-item>
            </el-col> -->
          <!-- </el-row>
          <el-row> -->
            <el-col :span="8">
              <el-form-item label="出厂日期" prop="factoryDate" :rules="[{ required: true, message: '出厂日期不能为空'}]">
                <el-date-picker v-model="form.factoryDate" value-format="yyyy-MM-dd" type="date" placeholder="请输入出厂日期" clearable :disabled="isEdit"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权单位" prop="ownerUnitName" :rules="[{ required: true, message: '产权单位不能为空'}]">
                <xt-tree-lzay-select :formValue="form.ownerUnitName"
                                     :selectType="'CORP'"
                                     @getTreeItem="getOwnerUnit"
                                     disabled
                ></xt-tree-lzay-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权部门" prop="propertyDept" :rules="[{ required: true, message: '产权部门不能为空'}]">
                <xt-tree-lzay-select :formValue="form.propertyDeptName"
                                     :unit-id="form.ownerUnit"
                                     :selectType="'DEPT'"
                                     @getTreeItem="getOwnerDept"></xt-tree-lzay-select>
              </el-form-item>
            </el-col>
            
          <!-- </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="线站标识" prop="lineStation" :rules="[{ required: true, message: '线站标识不能为空'}]">
                <el-input v-model="form.lineStation" placeholder="请输入线站标识" clearable maxlength="20" :disabled="isEdit"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="受理人" prop="receiverName" :rules="[{ required: true, message: '受理人不能为空'}]">
                <el-input v-model="form.receiverName" placeholder="请输入受理人" clearable maxlength="20" :disabled="isEdit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="受理时间" prop="receiverTime" :rules="[{ required: true, message: '不能为空'}]">
                <el-date-picker v-model="form.receiverTime" value-format="yyyy-MM-dd" type="date" placeholder="请输入出厂日期" clearable :disabled="isEdit"></el-date-picker>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="是否同步ERP" prop="isToErp" :rules="[{ required: true, message: '是否同步ERP不能为空'}]">
                <el-radio-group v-model="form.isToErp" placeholder="请选择是否同步ERP" clearable disabled>
                  <el-radio :label="1" value="1">是</el-radio>
                  <el-radio :label="0" value="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col> -->


            <el-col :span="24" style="height: 100% !important;">
              <el-form-item label="备注" prop="remark" :rules="[{ required: false, message: '备注不能为空'}]">
                <el-input v-model="form.remark" placeholder="请输入备注,限200字" clearable maxlength="200" type="textarea" rows="4"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <formTitle v-if="deviceList.length>0" :titleText="'设备状态'" :titleType="'page_title'"></formTitle>
        <el-table
           v-if="deviceList.length>0"
          ref="deviceTable"
          :data="deviceList"
          size="small"
          v-loading="loading"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="deviceCategory" label="设备分类" align="center">
            <template slot-scope="scope">
              <span>{{ showDictLable(scope.row.deviceCategory, deviceCategoryList) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceType" label="设备类型" align="center">
            <template slot-scope="scope">
              <span>{{ showDictLable(scope.row.deviceType, deviceTypeList) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="erpStatus" label="建卡信息同步状态" align="center">
            <template slot-scope="scope">
              <spam>{{ showDictLable(scope.row.erpStatus, deviceErpStatusList) }}</spam>
            </template>
          </el-table-column>
          <el-table-column prop="erpAssetCode" label="ERP资产编码" align="center"></el-table-column>
          <el-table-column prop="erpAccountCode" label="ERP台账编号" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" width="160"></el-table-column>
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
        <el-row type="flex">
          <!-- 底部左侧审批记录 开始-->
          <el-col :span="10">
            <formTitle :titleText="'审批记录'" :titleType="'page_title'"></formTitle>
            <div style="margin-left: 10px;">
              <step
                :processKey="'bpm_sbjd'"
                :orderId="form.id"
                v-if="form.id"
                :stepType="true"
                :currentSteps="form.processStatus"
                :status="form.processStatus === 'hussar_8'"
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
              border
              max-height="470px"
            >
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="optRole" label="角色" width="180" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="optName" label="操作人" width="150" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="160" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="title" label="操作内容" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-scrollbar>
      <!-- 底部返回按钮-->
      <div class="form-btn">
        <el-button v-if="showAudit" type="primary" size="small" @click="handleAudited">审 批</el-button>
        <el-button class="border-btn" size="small" @click="handleReset">返 回</el-button>
      </div>
    </div>

    <!-- 审批弹窗 -->
    <operateForm
      v-if="showOperate"
      :isShow="showOperate"
      :orderDeatil="form"
      :processKeys="'bpm_sbjd'"
      @close="showOperate = false"
      @submitOperate="submitOperate"
    ></operateForm>
  </basic-container>
</template>

<script>
import {getDetail, getRDeptrpList, getErpmaintainList, getErptranstplnrList} from "@/api/device/devicerecord";
import {getDeviceList} from "@/api/device/devicerecordlist";
import {getApproveList} from "@/api/device/approverecord";
import {getLogOptList} from "@/api/device/logopt";
import {getDictList, getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import {mapGetters, mapState} from "vuex";
import step from "@/components/step/index"
import operateForm from "@/views/personalDesk/components/operateForm"
import {getDeptList} from "@/api/system/dept"
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import wbsSelect from "@/components/wbsSelect/index.vue";

export default {
  components: {step, operateForm, xtTreeLzaySelect, wbsSelect},
  data() {
    return {
      propertyDeptList: [],
      unitErpList: [],
      pageLoading: false,
      id: '',
      stepActive: 1,
      form: {},
      queryDate: {},
      loading: true,
      isEdit: false,
      deviceAddTypeList: [],
      deviceChangeTypeList: [],
      useKeepDeptList: [],
      deviceStatusList: [],
      deviceErpStatusList: [],
      deviceWBSList: [],
      deviceChangeList: [],
      deviceCategoryList: [],
      deviceTypeList: [],
      selectionList: [],
      manufacturerList: [],
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      funLocationList: [],
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
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      showOperate: false,
      showAudit: this.$route.query.isAudit,

      unitList: [],
      erpDeptList: [],
    };
  },
  computed: {
    ...mapGetters(["permission", "userDetail"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
  },
  async mounted() {

    // 设置页面元素高度
    this.setPageContentHeight()
    //加载字典--工单状态
    this.getDictList("workOrderStatus");
    //加载字典--WBS元素
    this.getDictList("wbsElt");
    //加载字典--ERP工单状态
    this.getDictList("erpState");
    //加载字典--设备增加方式
    this.getDictList("deviceAddType");
    ///加载字典--设备增加方式
    this.getCmdbDictList("1083864635473920");
    //加载字典--设备变动方式
    this.getCmdbDictList("1083948487999488");
    //加载字典--设备变动方式
    this.getDictList("deviceChangeType");
    //加载字典--功能位置
   this.getErptranstplnrList();
    //加载字典--工厂区域
    this.getCmdbDictList("1083945124167680");
    //加载字典--维护工厂
    this.getErpmaintainList();
    

    //加载字典--设备类型
    await this.getCmdbDictList("1097745969774592");
    //加载字典--设备分类
    this.getCmdbDictList("1097745625841664");
    //加载字典--计量单位
    this.getCmdbDictList("1125222276464640");
    //加载字典--制造商
    this.getCmdbDictList("1082610161090560");


    this.id = null;
    //获取参数 判断是否是新增还是修改
    const params = this.$route.query
    //params.id='1760835273235841026'
    this.id = params.id;
    if (params.id) {
      this.id = params.id;
      this.loadDetail(params.id);
    } else {
      //处理参数异常
    }
    //加载工单设备列表
    this.loadDeviceDataList();
    //加载操作记录
    this.loadLogOptDataList();

    await this.getDeptList()
    this.setPropertyDeptList(this.unitList)

    this.getRDeptrpList()
  },
  methods: {
    getErpmaintainList() {
      //ERP维护工厂
      getErpmaintainList({code: this.userDetail.erpUnitCode || 'AAAA', current: 1, size: 100}).then(res => {
        this.maintenanceFactoryList = res.data.records
      })
    },
    getRDeptrpList() {
      //实物保管部门
      getRDeptrpList({swerk: this.userDetail.erpUnitCode || 'AAAA', current: 1, size: 100}).then(res => {
        this.erpDeptList = res.data.records
      })
    },
    setPropertyDeptList(list) {
      list.forEach(item => {
        if (item.id == this.form.ownerUnit) {
          this.propertyDeptList = item.children
        } else {
          if (item.children) {
            this.setPropertyDeptList(item.children)
          }
        }
      })
    },
    async getDeptList() {
      await getDeptList().then(res => {
        this.unitList = res.data
      })
    },
    getOwnerUnit(val) {
      this.form.ownerUnitName = val.fullName
      this.form.ownerUnit = val.id
      this.propertyDeptList = val.children

      //部门初始化
      this.form.propertyDept = null
      this.form.propertyDeptName = null
    },
    getOwnerDept(val) {
      this.form.propertyDept = val.id;
      this.form.propertyDeptName = val.fullName
    },


    manufacturerChange(val) {
      this.getDictCmdbListPid('1082554947272704', val) // 品牌
      this.form.brand = ""
      this.form.series = ""
      this.form.deviceModel = ""
    },
    brandChange(val) {
      this.getDictCmdbListPid('1082609011851264', val) // 系列
      this.form.series = ""
      this.form.deviceModel = ""
    },
    seriesChange(val) {
      this.getDictCmdbListPid('1082608047161344', val) // 型号
      this.form.deviceModel = ""
    },
    unitChange(code) {
      let current = this.unitErpList.filter(el => el.dictValue == code)[0]
      this.form.unitName = current.dictKey
    },
    getDictList(code) {
      //加载字典
      getDictList(code).then(res => {
        /*res.data.unshift({
          code:"",
          dictKey:'',
          dictValue:"--请选择--"})*/
        if (code === 'workOrderStatus') {
          this.deviceStatusList = res.data;
        } else if (code === 'wbsElt') {
          this.deviceWBSList = res.data;
        } else if (code === 'erpState') {
          this.deviceErpStatusList = res.data;
        } else if (code === 'deviceCategory') {
          this.deviceCategoryList = res.data;
        } else if (code === 'deviceType') {
          this.deviceTypeList = res.data;
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
        }
      });
    },
    getCmdbDictList(code) {
      //加载cmdb字典
      let query = {}
      query.ciId = code || '1082372687986688'
      return getDictCmdbList(query).then(res => {
        if (code === '1082607703228416') {
          this.deviceWBSList = res.data;
        } else if (code === '1097745625841664') {
          this.deviceCategoryList = res.data;
        } else if (code === '1097745969774592') {
          this.deviceTypeList = res.data;
          this.deviceTypeListAll = res.data;
        } else if (code === '1125222276464640') {
          this.unitErpList = res.data;
        } else if (code === '1083864635473920') {
          this.deviceAddTypeList = res.data;
        } else if (code === '1083948487999488') {
          this.deviceChangeTypeList = res.data;
        } else if (code === '1082610161090560') { // 制造商
          this.manufacturerList = res.data
        } else if (code === '1083945124167680') {
          this.factoryAreaList = res.data;
        }
      });
    },
    getDictCmdbListPid(ciId, pid) {
      getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
        if (ciId === '1097745969774592') { // 设备类型
          this.deviceTypeList = res.data.filter(el => el.dictKeyErp);
        } else if (ciId === '1082554947272704') { // 品牌
          this.brandList = res.data
        } else if (ciId === '1082609011851264') { // 系列
          // console.log(98889, res.data)
          this.seriesList = res.data
        } else if (ciId === '1082608047161344') { // 型号
          this.deviceModelList = res.data
        }
      });
    },
    getErptranstplnrList() {
      //ERP功能位置
      getErptranstplnrList({swerk: this.userDetail.erpUnitCode || 'AAAA', current: 1, size: 100}).then(res => {
        this.funLocationList = res.data.records
      })
    },
    getfactoryArea(code) {
      this.factoryAreaList.forEach(val => {
        if (val.trlnr === code) {
          this.form.factoryArea = val.dictValue
          this.form.factoryAreaCode = val.dictKey
        }
      })
    },
    handleReset() {
      //返回
      if (this.showAudit || this.showAudit === false || this.$route.query.tuiyun) {
        this.$closePage('/personalDesk/desk');
      } else {
        this.$closePage('/device/devRecord');
      }
    },
    showDictLable(code, dictList) {
      //字典回显
      if (dictList != null && code != '') {
        let items = dictList.filter(item => item.dictKey === code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }
      }
      return code;
    },
    loadDetail(id) {
      //根据id加载建档工单
      this.pageLoading = true
      getDetail(id).then(res => {
        this.form = res.data;
        this.pageLoading = false

        this.getDictCmdbListPid('1097745969774592', this.form.deviceCategory) // 设备类型
        this.getDictCmdbListPid('1082554947272704', this.form.manufacturer) // 品牌
        this.getDictCmdbListPid('1082609011851264', this.form.brand) // 系列
        this.getDictCmdbListPid('1082608047161344', this.form.series) // 型号
      });
    },
    loadDeviceDataList() {
      //加载 设备列表
      this.loading = true;
      let query = {};
      //query.filingNo = this.id||'--';
      query.recordId = this.id || '--';
      getDeviceList(this.page.currentPage, this.page.pageSize, query).then(res => {
        const data = res.data;
        this.page.total = data.total;
        this.deviceList = data.records;
        this.loading = false;
      });
    },
    currentChange(currentPage) {
      //分页 点击第几页
      this.page.currentPage = currentPage;
      this.loadDeviceDataList();
    },
    sizeChange(pageSize) {
      //切换 每页数量
      this.page.pageSize = pageSize;
      this.loadDeviceDataList();
    },
    loadLogOptDataList() {
      //加载操作记录
      let query = {};
      query.logId = this.id || '--';
      getLogOptList(1, 999, query).then(res => {
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
  }
};
</script>
