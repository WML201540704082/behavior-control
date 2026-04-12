<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <formTitle :titleText="'建档申请信息'" :titleType="'page_title'"></formTitle>
      <el-scrollbar style="height:calc(100% - 50px - 55px)">
        <el-form :model="form" ref="dataForm" class="xt_form" label-width="150px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="WBS项目" prop="wbsProject" clearable :rules="[{ required: true, message: 'WBS项目不能为空'}]">
                <wbsSelect type="wbsProject" placeholder="请选择WBS元素" v-model="form.wbsProject" @change="wbsChange"></wbsSelect>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="WBS元素" prop="wbsElement" clearable :rules="[{ required: true, message: 'WBS项目不能为空'}]">
                <wbsSelect type="wbsElement" placeholder="请选择WBS元素" v-model="form.wbsElement" @change="wbsChange"></wbsSelect>
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
                <el-select v-model="form.brand" @change="brandChange" placeholder="请选择品牌" filterable clearable :disabled="!form.manufacturer">
                  <el-option v-for="dict in brandList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- :disabled="!form.brand" -->
            <el-col :span="8">
              <el-form-item label="系列" prop="series" :rules="[{ required: true, message: '系列不能为空'}]">
                <el-select v-model="form.series" @change="seriesChange" placeholder="请输入系列" filterable clearable :disabled="!seriesList.length || !form.brand">
                  <el-option v-for="dict in seriesList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="型号" prop="deviceModel" :rules="[{ required: true, message: '型号不能为空'}]">
                <el-select v-model="form.deviceModel" @change="deviceModelChange" placeholder="请输入型号" filterable clearable :disabled="!form.series">
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


            <el-col :span="24">
              <el-form-item label="备注" prop="remark" :rules="[{ required: false, message: '备注不能为空'}]">
                <el-input v-model="form.remark" placeholder="请输入备注,限200字" clearable maxlength="200" type="textarea" rows="4"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-scrollbar>
      <div class="form-btn">
        <el-button type="primary" v-if="form.status==1 || form.processStatus=='hussar_4'" size="small" @click="handleSaveOK(2)" :loading="btnLoading">提交建档</el-button>
        <el-button class="border-btn" size="small" v-if="form.status==1 || form.processStatus=='hussar_4'" @click="handleSave(1)" style="margin-left: 50px;"
                   :loading="btnLoading">暂 存
        </el-button>
        <el-button class="border-btn" size="small" @click="handleReset" style="margin-left: 50px;">返 回</el-button>
      </div>
    </div>

  </basic-container>
</template>

<script>
import {submitProcess, updateDevRecordStatus} from "@/api/process/index"
import {getDetail, save, getEmpty, submit, getErpmaintainList, getErptranstplnrList, getRDeptrpList} from "@/api/device/devicerecord";
import {getDictCmdbList, getDictList, getDictCmdbListPid} from "@/api/dict";
import {mapGetters, mapState} from "vuex";
import {getDeptList} from "@/api/system/dept"
import wbsSelect from "@/components/wbsSelect/index.vue";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";

export default {
  components: {wbsSelect, xtTreeLzaySelect},
  data() {
    return {
      id: '',
      form: {
        deviceType: "",
        wbsProject: "",
        wbsElement: "",
        filingNo: "",
        deviceCategory: "",
        status: "",
        deviceNum: "",
        deviceAddType: "",
        deviceChangeType: "",
        installationSite: "",
        oprtDate: "",
        procureDate: "",
        isToErp: "",
        deviceName: "",
        fullName: "",
        unit: "",
        brand: "",
        series: "",
        deviceModel: "",
        nameplateNo: "",
        manufacturer: "",
        maintenanceCountry: "",
        maintenanceFactoryCode: "",
        factoryDate: "",
        ownerUnitName: "",
        propertyDept: "",
        useKeepDeptName: "",
        entityKeepDept: "",
        useKeepPerson: "",
        funLocationCode: "",
        factoryArea: "",
        maintenanceFactory: "",
        lineStation: "",
        receiverName: "",
        receiverTime: "",
        remark: "",
      },
      queryDate: {},
      loading: true,
      isEdit: true,
      deviceAddTypeList: [],
      deviceChangeTypeList: [],
      useKeepDeptList: [],
      deviceStatusList: [],
      deviceErpStatusList: [],
      deviceWBSList: [],
      deviceChangeList: [],
      deviceCategoryList: [],
      deviceTypeList: [],
      deviceTypeListAll: [],
      selectionList: [],
      manufacturerList: [],
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      funLocationList: [],
      maintenanceFactoryList: [],
      btnLoading: false,
      unitList: [],
      propertyDeptList: [],
      erpDeptList: [],
      unitErpList: [],
    };
  },
  computed: {
    ...mapGetters(["permission", "userDetail"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.deviceRecord_add, false),
        viewBtn: this.vaildData(this.permission.deviceRecord_view, false),
        delBtn: this.vaildData(this.permission.deviceRecord_delete, false),
        editBtn: this.vaildData(this.permission.deviceRecord_edit, false),
        exportBtn: this.vaildData(this.permission.deviceRecord_export, false)
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
  async mounted() {
    // 设置页面元素高度
    this.setPageContentHeight()
    //加载字典--工单状态
    this.getDictList("workOrderStatus");
    //加载字典--WBS元素
    //this.getDictList("wbsElt");
    // this.getCmdbDictList("1082607703228416");
    //加载字典--ERP工单状态
    this.getDictList("erpState");
    //加载字典--设备增加方式
    //this.getDictList("deviceAddType");
    this.getCmdbDictList("1083864635473920");
    //加载字典--设备类型
    //this.getDictList("deviceType");
    this.getCmdbDictList("1097745969774592");
    //加载字典--设备分类
    this.getCmdbDictList("1097745625841664");
    //加载字典--设备变动方式
    //this.getDictList("deviceChangeType");
    this.getCmdbDictList("1083948487999488");

    //加载字典--功能位置
    this.getErptranstplnrList();
    //加载字典--工厂区域
    //this.getDictList("factoryArea")
    this.getCmdbDictList("1083945124167680");
    //加载字典--计量单位(RES_DICT_JLDW)
    this.getCmdbDictList("1125222276464640");
    //加载字典--制造商
    this.getCmdbDictList("1082610161090560");
    //加载字典--品牌

    //加载字典--系列

    //加载字典--型号


    //加载字典--维护工厂
    this.getErpmaintainList();

    await this.getDeptList()
    //实物保管部门
    this.getRDeptrpList()

    this.id = null;
    //获取参数 判断是否是新增还是修改
    const params = this.$route.query
    //params.id='1760851395719598082'
    this.id = params.id || '';
    if (params.id) {
      this.id = params.id;
      this.loadDetail(params.id);
      this.isEdit = true
    } else {
      //加载空数据
      this.beforeOpen();
      this.isEdit = true
    }
  },
  methods: {
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

      let current = this.brandList.filter(el => el.dictKey == val)[0]
      this.form.brandName = current.dictValue;
    },
    seriesChange(val) {
      this.getDictCmdbListPid('1082608047161344', val) // 型号
      this.form.deviceModel = ""

      let current = this.seriesList.filter(el => el.dictKey == val)[0]
      this.form.seriesName = current.dictValue;
    },
    deviceModelChange() {
      let current = this.deviceModelList.filter(el => el.dictKey == val)[0]
      this.form.deviceModelName = current.dictValue;
    },

    unitChange(code) {
      let current = this.unitErpList.filter(el => el.dictKey == code)[0]
      this.form.unitName = current.dictValue
    },

    getCmdbDictList(code) {
      //加载cmdb字典
      let query = {}
      query.ciId = code || '1082372687986688'
      getDictCmdbList(query).then(res => {
        if (code === '1082607703228416') {
          this.deviceWBSList = res.data;
        } else if (code === '1097745625841664') {
          for (let i = 0; i < res.data.length; i++) {
            let item = res.data[i]
            if (item.dictKey == '1097756774301696' || item.dictKey == '1097757327949825') {
              this.deviceCategoryList.push(item)
            }
          }
        } else if (code === '1097745969774592') {
          // this.deviceTypeList  = res.data;
          this.deviceTypeListAll = res.data;
        } else if (code === '1083945124167680') {
          this.factoryAreaList = res.data;
        } else if (code === '1083864635473920') {
          this.deviceAddTypeList = res.data;
        } else if (code === '1083948487999488') {
          this.deviceChangeTypeList = res.data;
        } else if (code === '1125222276464640') {
          this.unitErpList = res.data;
        } else if (code === '1082610161090560') { // 制造商
          this.manufacturerList = res.data
        }
      });
    },
    getDictCmdbListPid(ciId, pid) {
      if(ciId === '1082609011851264'){ //系列(联想)
        this.seriesList = []
      }

      getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
        if (ciId === '1097745969774592') { // 设备类型
          this.deviceTypeList = res.data.filter(el => el.dictKeyErp);
        } else if (ciId === '1082554947272704') { // 品牌
          this.brandList = res.data
        } else if (ciId === '1082609011851264') { // 系列
          this.seriesList = res.data
        } else if (ciId === '1082608047161344') { // 型号
          this.deviceModelList = res.data
        }
      });
    },
    getDictList(code) {
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
        }
      });

    },
    getRDeptrpList() {
      //实物保管部门
      getRDeptrpList({swerk: this.userDetail.erpUnitCode || 'AAAA', current: 1, size: 100}).then(res => {
        this.erpDeptList = res.data.records
      })
    },
    getErptranstplnrList() {
      //ERP功能位置
      getErptranstplnrList({swerk: this.userDetail.erpUnitCode || 'AAAA', current: 1, size: 100}).then(res => {
        this.funLocationList = res.data.records
      })
    },
    getErpmaintainList() {
      //ERP维护工厂
      getErpmaintainList({code: this.userDetail.erpUnitCode || 'AAAA', current: 1, size: 100}).then(res => {
        this.maintenanceFactoryList = res.data.records
      })
    },
    async getDeptList() {
      await getDeptList().then(res => {
        this.unitList = res.data
      })
    },
    deviceCategoryChange(code) {
      let current = this.deviceCategoryList.filter(el => el.dictKey == code)[0]
      this.form.deviceCategoryName = current.dictValue

      //设备分类选择
      this.form.deviceType = ''
      this.getDictCmdbListPid('1097745969774592', code) // 设备类型
    },
    deviceTypeChange(code) {
      let current = this.deviceTypeList.filter(el => el.dictKey == code)[0]
      this.form.deviceTypeName = current.dictValue
    },
    wbsChange(val, type) {
      if (type == 'wbsElement') {
        this.form.wbsProject = val.wbsName
      } else if (type == 'wbsProject') {
        this.form.wbsElement = val.wbsCode
      }
    },
    wbsSelectChange(itemValue) {
      const option = this.deviceWBSList.find(item => item.dictKey === itemValue);
      this.form.wbsProject = option ? option.dictValue : ''
    },
    async handleSaveOK(status) {
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          this.form.status = status;
          if (this.form.processInsId == '') this.form.processInsId = null;
          if (this.form.processStatus == '') this.form.processStatus = null;
          this.btnLoading = true //按钮加载状态
          //提交建档(保存表单)
          let saveRes = await this.$asyncCatchApi(submit, this.form)
          if (saveRes[0] != null) {
            this.btnLoading = false
            this.form.status = 1
            return
          }

          // // 发起流程
          // let cerateRes = await this.$asyncCatchApi(submitProcess, {
          //   assignees: [],
          //   businessKey: saveRes[1].data.filingNo,
          //   comment: "",
          //   participantType: "2",
          //   processDefinitionKey: 'bpm_sbjd',
          //   taskType: "1",
          //   variable: {},
          // })
          // if(cerateRes[0] != null) {
          //   this.btnLoading = false
          //   return
          // }


          this.btnLoading = false
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.handleReset();


        }
      })
    },
    handleSave(status) {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.form.status = status;
          this.form.processInsId = undefined;
          this.form.processStatus = undefined;

          //暂存
          save(this.form).then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.handleReset();
          }, error => {
            this.form.status = 1
             
          });
        }
      })
    },
    handleReset() {
      //返回
      if (this.$route.query.isAudit || this.$route.query.isAudit === false || this.$route.query.tuiyun) {
        this.$closePage('/personalDesk/desk');
      } else {
        this.$closePage('/device/devRecord');
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
    beforeOpen() {
      getEmpty().then(res => {
        this.form = res.data;
        this.form.wbsElement = ''
        this.form.erpStatus = '1';
        this.form.isToErp = 1;
        this.form.status = '1';
        this.form.id = null;
        this.form.deviceNum = 1;

        this.form.manufacturer = ''
        this.form.brand = ''
        this.form.series = ''
        this.form.deviceModel = ''

        // this.form.regionCode = this.userDetail.regionCode||''
        this.form.deviceCategory = '1097756774301696' //终端设备
        this.form.deviceCategoryName = '终端设备' //终端设备
        this.getDictCmdbListPid('1097745969774592', this.form.deviceCategory) // 设备类型
        this.setPropertyDeptList(this.unitList)
        this.$forceUpdate()
      });
    },
    loadDetail(id) {
      getDetail(id).then(res => {
        this.form = res.data;
        // this.form.regionCode = this.userDetail.regionCode||''
        // this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(this.form.deviceCategory));
        this.setPropertyDeptList(this.unitList)
        this.$refs.dataForm.$forceUpdate()
        this.$forceUpdate()
        this.getDictCmdbListPid('1097745969774592', this.form.deviceCategory) // 设备类型
        this.getDictCmdbListPid('1082554947272704', this.form.manufacturer) // 品牌
        this.getDictCmdbListPid('1082609011851264', this.form.brand) // 系列
        this.getDictCmdbListPid('1082608047161344', this.form.series) // 型号


      });
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
    getOwnerUnit(val) {
      this.form.ownerUnitName = val.fullName
      this.form.ownerUnit = val.id
      this.propertyDeptList = val.children

      this.form.propertyDept = null
      this.form.propertyDeptName = null
    },
    getOwnerDept(val) {
      this.form.propertyDept = val.id
      this.form.propertyDeptName = val.fullName
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
    getfunLocation(code) {
      this.funLocationList.forEach(val => {
        if (val.trlnr === code) {
          this.form.funLocation = val.pltxt
          this.form.funLocationCode = val.trlnr
        }
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
    getmaintenanceFactory(code) {
      this.maintenanceFactoryList.forEach(val => {
        if (val.code === code) {
          this.form.maintenanceFactory = val.name
          // this.form.maintenanceFactoryCode = val.code
        }
      })
    },
    changeDevNum(val) {
      this.form.deviceNum = this.form.deviceNum.replace(/[^\d]/g, '')
      // oninput="value=value.replace(/[^\d]/g, '')"
    }
  }
};
</script>

