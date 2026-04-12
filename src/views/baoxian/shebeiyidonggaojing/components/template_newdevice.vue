<template>
  <div class="d_center">
    <div class="d_sb d_title">
      <div>
        <div class="d_start">
          <div class="d_line2"></div>
          <span class="s_title">处置信息</span>
          <div v-loading="detialLoading" class="d_load">

          </div>
        </div>
      </div>
    </div>

    <div class="d_tmpl">
      <el-form ref="submitForm" :model="deviceOperationDetailDTO"
               :rules="formValue.disposeStatus == 1?[]:rules"
               label-suffix=":"
               label-width="auto"
               size="small"
               class="xt_search_form"
               :disabled="formValue.disposeStatus == 1">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="设备分类" size="small">
              <el-select v-model="deviceOperationDetailDTO.deviceCategory" placeholder="请选择设备分类" clearable>
                <el-option v-for="(item,index) in deviceCategoryList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="设备类型" size="small" prop="deviceType">
              <el-select v-model="deviceOperationDetailDTO.deviceType"
                         :placeholder="getPlaceholder(deviceTypeList,{name:deviceOperationDetailDTO.deviceCategory,label:'设备分类'})"
                         :disabled="getDisabled(deviceTypeList,{name:deviceOperationDetailDTO.deviceCategory,label:'设备分类'})"
                         clearable>
                <el-option v-for="(item,index) in deviceTypeList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="安装地点" size="small" prop="address">
              <el-input v-model="deviceOperationDetailDTO.address" placeholder="请输入安装地点" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否信创设备" size="small" prop="isItal">
              <el-select v-model="deviceOperationDetailDTO.isItal"
                         :placeholder="getPlaceholder(isItalList)" :disabled="getDisabled(isItalList)"
                         clearable>
                <el-option v-for="(item,index) in isItalList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="制造商" size="small" prop="maker">
              <el-select v-model="deviceOperationDetailDTO.maker" filterable clearable :placeholder="getPlaceholder(makerList)" :disabled="getDisabled(makerList)">
                <el-option v-for="dict in makerList"
                           :key="dict.dictKey"
                           :label="dict.dictValue"
                           :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品牌" size="small" prop="brand">
              <el-select v-model="deviceOperationDetailDTO.brand" filterable clearable
                         :placeholder="getPlaceholder(brandList,{name:deviceOperationDetailDTO.maker,label:'制造商'})"
                         :disabled="getDisabled(brandList,{name:deviceOperationDetailDTO.maker,label:'制造商'})">
                <el-option v-for="dict in brandList"
                           :key="dict.dictKey"
                           :label="dict.dictValue"
                           :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="系列" size="small" prop="series">
              <el-select v-model="deviceOperationDetailDTO.series" filterable clearable
                         :placeholder="getPlaceholder(seriesList,{name:deviceOperationDetailDTO.brand,label:'品牌'})"
                         :disabled="getDisabled(seriesList,{name:deviceOperationDetailDTO.brand,label:'品牌'})">
                <el-option v-for="dict in seriesList"
                           :key="dict.dictKey"
                           :label="dict.dictValue"
                           :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="型号" size="small" prop="deviceModel">
              <el-select v-model="deviceOperationDetailDTO.deviceModel" filterable clearable
                         :placeholder="getPlaceholder(deviceModelList,{name:deviceOperationDetailDTO.series,label:'系列'})"
                         :disabled="getDisabled(deviceModelList,{name:deviceOperationDetailDTO.series,label:'系列'})">
                <el-option v-for="dict in deviceModelList"
                           :key="dict.dictKey"
                           :label="dict.dictValue"
                           :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="产权部门" size="small" prop="operationDeptName">
              <xt-tree-lzay-select :formValue="deviceOperationDetailDTO.operationDeptName"
                                   :unit-id="$store.getters.userDetail.ownerUnit"
                                   :selectType="'DEPT'"
                                   @getTreeItem="getOperationDeptDept"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="领用部门" size="small" prop="receiveDutyDeptName">
              <xt-tree-lzay-select :formValue="deviceOperationDetailDTO.receiveDutyDeptName"
                                   :unit-id="$store.getters.userDetail.ownerUnit"
                                   :selectType="'DEPT'"
                                   @getTreeItem="getReceiveDutyDeptDept"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="使用人" size="small" prop="userName">
              <el-input v-model="deviceOperationDetailDTO.userName" placeholder="请填写使用人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="使用人联系方式" size="small" prop="userPhone">
              <el-input v-model="deviceOperationDetailDTO.userPhone" placeholder="请填写使用人联系方式" clearable oninput="this.value=this.value.replace(/\D/g,'')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="责任人" size="small" prop="receiveUseName">
              <el-input v-model="deviceOperationDetailDTO.receiveUseName" placeholder="请填写责任人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="责任人联系方式" size="small" prop="receiveUsePhone">
              <el-input v-model="deviceOperationDetailDTO.receiveUsePhone" placeholder="请填写责任人联系方式" clearable
                        oninput="this.value=this.value.replace(/\D/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="责任人身份证号" size="small" prop="receiveUseCard">
              <el-input v-model="deviceOperationDetailDTO.receiveUseCard" placeholder="请填写责任人身份证号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="责任人ISC账号" size="small" prop="receiveDutyIscAccount">
              <el-input v-model="deviceOperationDetailDTO.receiveDutyIscAccount" placeholder="请填写责任人ISC账号" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="投运日期" size="small" prop="oprtDate">
              <el-date-picker v-model="deviceOperationDetailDTO.oprtDate" value-format="yyyy-MM-dd" placeholder="请选择投运日期" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服务到期时间" size="small" prop="afterSaleExpDate">
              <el-date-picker v-model="deviceOperationDetailDTO.afterSaleExpDate" value-format="yyyy-MM-dd" placeholder="请选择服务到期时间" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="false">
            <el-form-item label="所属网络" size="small" prop="networkType">
              <el-select v-model="deviceOperationDetailDTO.networkType"
                         :placeholder="getPlaceholder(networkTypeList)" :disabled="getDisabled(networkTypeList)"
                         clearable>
                <el-option v-for="(item,index) in networkTypeList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="false">
            <el-form-item label="所属子网" prop="deviceSubnetName">
              <subSelect v-model="deviceOperationDetailDTO.deviceSubnetName"
                         :disabled="!deviceOperationDetailDTO.networkType"
                         :placeholder="isEmpty(deviceOperationDetailDTO.networkType)?'请先选择所属网络':'请选择所属子网'"
                         @change="deviceSubnetChange"
                         :networkType="deviceOperationDetailDTO.networkType"
                         :institutionCode="$store.getters.userDetail.ownerUnit"
                         :formIndex="index"></subSelect>
            </el-form-item>
          </el-col>


          <el-col :span="6">
            <el-form-item label="设备来源" size="small">
              <el-select v-model="deviceOperationDetailDTO.deviceSource"
                         :placeholder="getPlaceholder(deviceSourceList)" :disabled="getDisabled(deviceSourceList)"
                         clearable disabled>
                <el-option v-for="(item,index) in deviceSourceList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="采购方式" size="small">
              <el-select v-model="deviceOperationDetailDTO.procureTypeCode"
                         :placeholder="getPlaceholder(procureTypeCodeList)" :disabled="getDisabled(procureTypeCodeList)"
                         clearable disabled>
                <el-option v-for="(item,index) in procureTypeCodeList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="处置人" size="small">
              <el-input v-model="formValue.disposeUser" placeholder="--" readonly disabled clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处置人联系方式" size="small">
              <el-input v-model="formValue.disposePhone" placeholder="--" readonly disabled clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处置人所在部门" size="small">
              <el-input v-model="formValue.disposeDept" placeholder="--" readonly disabled clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处置时间" size="small">
              <el-date-picker v-model="formValue.disposeTime" placeholder="提交时自动记录当前时间" type="datetime" disabled clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="处置结果" size="small" prop="disposeResult">
              <el-select v-model="deviceOperationDetailDTO.disposeResult" placeholder="请选择处置结果" :disabled="formValue.disposeStatus != 0" clearable>
                <el-option v-for="(item,index) in czResults"
                           :label="item"
                           :value="item"
                           :key="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备状态" size="small">
              <el-select v-model="deviceOperationDetailDTO.deviceStatus"
                         :placeholder="getPlaceholder(deviceStatusList)" :disabled="getDisabled(deviceStatusList)"
                         clearable disabled>
                <el-option v-for="(item,index) in deviceStatusList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import {getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {dateFormat} from "@/util/date";
import subSelect from "@/components/subSelect/index.vue";
import {getOperationDetail} from "@/api/device/deviceapply";

export default {
  name: 'template_newdevice',
  components: {subSelect, xtTreeLzaySelect},
  props: ['formValue', 'operationId'],
  data() {
    return {
      deviceOperationDetailDTO: {},

      rules: {  //校验规则
        deviceType: [{required: true, message: '设备类型不能为空', trigger: 'change'}],
        address: [{required: true, message: '安装地点不能为空', trigger: 'blur'}],
        isItal: [{required: true, message: '是否信创设备不能为空', trigger: 'change'}],
        operationDeptName: [{required: true, message: '产权部门不能为空', trigger: 'change'}],
        receiveDutyDeptName: [{required: true, message: '领用部门不能为空', trigger: 'change'}],
        userName: [{required: true, message: '使用人不能为空', trigger: 'blur'}],
        userPhone: [{required: true, message: '使用人联系方式不能为空', trigger: 'blur'}],
        receiveUseName: [{required: true, message: '责任人不能为空', trigger: 'blur'}],
        receiveUsePhone: [{required: true, message: '责任人联系方式不能为空', trigger: 'blur'}],
        receiveUseCard: [{required: true, message: '责任人身份证号不能为空', trigger: 'blur'}],
        receiveDutyIscAccount: [{required: true, message: '责任人ISC账号不能为空', trigger: 'blur'}],
        oprtDate: [{required: true, message: '投运日期不能为空', trigger: 'blur'}],
        afterSaleExpDate: [{required: true, message: '服务到期时间不能为空', trigger: 'blur'}],
        disposeResult: [{required: true, message: '请选择处置结果', trigger: 'change'}],

        networkType: [{required: true, message: '请选择所属网络', trigger: 'change'}],
        deviceSubnetName: [{required: true, message: '请选择所属子网', trigger: 'change'}],


        maker: [{required: true, message: '请选择制造商', trigger: 'change'}],
        brand: [{required: true, message: '请选择品牌', trigger: 'change'}],
        series: [{required: true, message: '请选择系列', trigger: 'change'}],
        deviceModel: [{required: true, message: '请选择型号', trigger: 'change'}],
      },

      ciIdList: null,
      deviceCategoryList: null,
      deviceTypeList: null,
      isItalList: null,
      deviceSourceList: null,
      procureTypeCodeList: null,
      deviceStatusList: null,
      networkTypeList: null,

      makerList: null,
      brandList: null,
      seriesList: null,
      deviceModelList: null,

      detialLoading: false,
    };
  },
  computed: {
    czResults(vm) {
      vm.deviceOperationDetailDTO.disposeResult = '设备投运';
      return ['设备投运'];
    },
  },
  watch: {
    'deviceOperationDetailDTO.deviceCategory'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        //加载设备类型
        this.getCmdbDictListPid(this.ciIdList.find(a => a.name == 'deviceType'), newVal);
        this.deviceOperationDetailDTO.deviceCategoryName = this.deviceCategoryList.find(a => a.dictKey == newVal).dictValue;
      } else {
        this.deviceOperationDetailDTO.deviceCategoryName = null;
      }

      if (this.formValue.disposeStatus == 0) {
        //初始化品牌、系列、型号
        this.deviceTypeList = null;
        if (!this.isEmpty(this.deviceOperationDetailDTO.deviceType)) {
          this.deviceOperationDetailDTO.deviceType = null;
        }
        if (!this.isEmpty(this.deviceOperationDetailDTO.deviceTypeName)) {
          this.deviceOperationDetailDTO.deviceTypeName = null;
        }
      }
    },
    'deviceOperationDetailDTO.deviceType'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        //加载设备类型
        this.deviceOperationDetailDTO.deviceTypeName = this.deviceTypeList.find(a => a.dictKey == newVal).dictValue;
      } else {
        this.deviceOperationDetailDTO.deviceTypeName = null;
      }
    },
    'deviceOperationDetailDTO.networkType'(newVal, oldVal) {
      if (!this.isEmpty(this.deviceOperationDetailDTO.deviceSubnetName)) {
        this.deviceOperationDetailDTO.networkTypeName = this.networkTypeList.find(a => a.dictKey == newVal).dictValue;

        this.deviceOperationDetailDTO.deviceSubnetName = null;
        this.deviceOperationDetailDTO.deviceSubnet = null;
      }
    },

    'deviceOperationDetailDTO.maker'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        //加载品牌
        this.getCmdbDictListPid(this.ciIdList.find(a => a.name == 'brand'), newVal);
        this.deviceOperationDetailDTO.makerName = this.makerList.find(a => a.dictKey == newVal).dictValue;
      } else {
        this.deviceOperationDetailDTO.makerName = null;
      }
      if (this.formValue.disposeStatus == 0) {
        //初始化品牌、系列、型号
        this.brandList = null;
        this.seriesList = null;
        this.deviceModelList = null;
        if (!this.isEmpty(this.deviceOperationDetailDTO.brand)) {
          this.deviceOperationDetailDTO.brand = null;
          this.deviceOperationDetailDTO.brandName = null;
        }
        if (!this.isEmpty(this.deviceOperationDetailDTO.series)) {
          this.deviceOperationDetailDTO.series = null;
          this.deviceOperationDetailDTO.seriesName = null;
        }
        if (!this.isEmpty(this.deviceOperationDetailDTO.deviceModel)) {
          this.deviceOperationDetailDTO.deviceModel = null;
          this.deviceOperationDetailDTO.deviceModelName = null;
        }
      }
    },
    'deviceOperationDetailDTO.brand'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        //加载系列
        this.getCmdbDictListPid(this.ciIdList.find(a => a.name == 'series'), newVal);
        this.deviceOperationDetailDTO.brandName = this.brandList.find(a => a.dictKey == newVal).dictValue;
      } else {
        this.deviceOperationDetailDTO.brandName = null;
      }
      if (this.formValue.disposeStatus == 0) {
        //初始化系列、型号
        this.seriesList = null;
        this.deviceModelList = null;
        if (!this.isEmpty(this.deviceOperationDetailDTO.series)) {
          this.deviceOperationDetailDTO.series = null;
          this.deviceOperationDetailDTO.seriesName = null;
        }
        if (!this.isEmpty(this.deviceOperationDetailDTO.deviceModel)) {
          this.deviceOperationDetailDTO.deviceModel = null;
          this.deviceOperationDetailDTO.deviceModelName = null;
        }
      }
    },
    'deviceOperationDetailDTO.series'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        //加载型号
        this.getCmdbDictListPid(this.ciIdList.find(a => a.name == 'deviceModel'), newVal);
        this.deviceOperationDetailDTO.seriesName = this.seriesList.find(a => a.dictKey == newVal).dictValue;
      } else {
        this.deviceOperationDetailDTO.seriesName = null;
      }
      if (this.formValue.disposeStatus == 0) {
        //初始化型号
        this.deviceModelList = null;
        if (!this.isEmpty(this.deviceOperationDetailDTO.deviceModel)) {
          this.deviceOperationDetailDTO.deviceModel = null;
          this.deviceOperationDetailDTO.deviceModelName = null;
        }
      }
    },
    'deviceOperationDetailDTO.deviceModel'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        this.deviceOperationDetailDTO.deviceModelName = this.deviceModelList.find(a => a.dictKey == newVal).dictValue;
      } else {
        this.deviceOperationDetailDTO.deviceModelName = null;
      }
    },
  },
  mounted() {
    this.initId();
    if (this.formValue.disposeStatus == 1) {
      this.requestOperationDetail();
    }
  },
  methods: {
    requestOperationDetail() {
      //投运工单详情
      this.detialLoading = true;
      getOperationDetail({operationNo: this.operationId}).then(res => {
        if (res.data.deviceOperationDetailVOList && res.data.deviceOperationDetailVOList.length > 0) {
          this.deviceOperationDetailDTO = res.data.deviceOperationDetailVOList[0];
        }
      }).finally(() => {
        this.detialLoading = false;
      });
    },
    validate(callback) {
      this.$refs.submitForm.validate((valid) => {
        if (callback) {
          //告警处置时间 赋值
          if (valid) {
            this.formValue.disposeTime = dateFormat(new Date);
            this.formValue.deviceOperationDetailDTO = this.deviceOperationDetailDTO;
            this.formValue.disposeResult = this.deviceOperationDetailDTO.disposeResult;
          }
          callback(valid);
        }
      });
    },
    initId() {
      this.ciIdList = [];
      this.ciIdList.push({name: 'deviceCategory', label: '设备分类', ciId: '1097745625841664'});
      this.ciIdList.push({name: 'deviceType', label: '设备类型', ciId: '1097745969774592', loading: false});
      this.ciIdList.push({name: 'isItal', label: '是否信创设备', ciId: '1104198218612736'});
      this.ciIdList.push({name: 'maker', label: '制造商', ciId: '1082610161090560'});
      this.ciIdList.push({name: 'brand', label: '品牌', ciId: '1082554947272704', loading: false});
      this.ciIdList.push({name: 'series', label: '系列', ciId: '1082609011851264', loading: false});
      this.ciIdList.push({name: 'deviceModel', label: '型号', ciId: '1082608047161344', loading: false});
      this.ciIdList.push({name: 'deviceSource', label: '设备来源', ciId: '1102860579569664'});
      this.ciIdList.push({name: 'procureTypeCode', label: '采购方式', ciId: '1083886445854720'});
      this.ciIdList.push({name: 'deviceStatus', label: '设备状态', ciId: '1103423111233536'});
      this.ciIdList.push({name: 'networkType', label: '所属网络', ciId: '1107942968721408'});


      //加载字典
      for (let i = 0; i < this.ciIdList.length; i++) {
        if (!this.ciIdList[i].loading) {
          this.getCmdbDictList(this.ciIdList[i]);
        }
      }
    },
    getCmdbDictList(item) {
      if (!item) {
        return;
      }
      //加载cmdb字典
      getDictCmdbList({ciId: item.ciId}).then(res => {
        if (item.name === 'deviceCategory') {
          // 设备分类
          this.deviceCategoryList = res.data;

          //设备分类默认为终端设备
          this.$set(this.deviceOperationDetailDTO, 'deviceCategory', this.deviceCategoryList.find(a => a.dictKey == this.$store.state.common.govern.device_terminal).dictKey);
        } else if (item.name === 'isItal') {
          // 是否是信创设备
          this.isItalList = res.data;
        } else if (item.name === 'deviceSource') {
          // 设备来源
          this.deviceSourceList = res.data;

          //设备来源默认非统一纳管：不可选
          this.$set(this.deviceOperationDetailDTO, 'deviceSource', this.deviceSourceList.find(a => a.dictKey == this.$store.state.common.govern.sourceFtyng).dictKey);
        } else if (item.name === 'procureTypeCode') {
          // 采购方式
          this.procureTypeCodeList = res.data;

          //采购方式默认单位自购：不可选
          this.$set(this.deviceOperationDetailDTO, 'procureTypeCode', this.procureTypeCodeList.find(a => a.dictKey == this.$store.state.common.govern.procureTypeDwzg).dictKey);
        } else if (item.name === 'deviceStatus') {
          // 设备状态
          //只显示在运选项
          this.deviceStatusList = res.data.filter(a => a.dictKey == "1105089449492480");

          //设备状态默认在运：不可选
          this.$set(this.deviceOperationDetailDTO, 'deviceStatus', this.deviceStatusList.find(a => a.dictKey == this.$store.state.common.govern.deviceOperation).dictKey);
        } else if (item.name === 'networkType') {
          // 所属网络
          this.networkTypeList = res.data;
        } else if (item.name === 'maker') {
          // 制造商
          this.makerList = res.data;
        }
      });
    },
    getCmdbDictListPid(item, pid) {
      getDictCmdbListPid({
        ciId: item.ciId,
        pid: pid,
      }).then(res => {
        if (item.name === 'deviceType') {
          //设备类型
          this.deviceTypeList = res.data;
        } else if (item.name === 'brand') {
          //品牌
          this.brandList = res.data;
        } else if (item.name === 'series') {
          //系列
          this.seriesList = res.data;
        } else if (item.name === 'deviceModel') {
          //型号
          this.deviceModelList = res.data;
        }
      });
    },
    getPlaceholder(list, params) {
      if (params && this.isEmpty(params.name)) {
        return `请先选择${params.label}`;
      }
      return list == null ? '加载中' : '请选择';
    },
    getDisabled(list, params) {
      if (params) {
        if (this.isEmpty(params.name)) {
          return true;
        } else {
          return list == null ? true : false;
        }
      }
      return list == null ? true : false;
    },
    isEmpty(value) {
      if (value == null || value === '') {
        return true;
      }
      return false
    },

    //产权部门改变
    getOperationDeptDept(val) {
      this.$set(this.deviceOperationDetailDTO, 'operationDeptName', val.fullName);
      this.$set(this.deviceOperationDetailDTO, 'operationDept', val.id);
    },
    //领用部门改变
    getReceiveDutyDeptDept(val) {
      this.$set(this.deviceOperationDetailDTO, 'receiveDutyDeptName', val.fullName);
      this.$set(this.deviceOperationDetailDTO, 'receiveDutyDept', val.id);
    },

    // 选择所属子网
    deviceSubnetChange(data, index) {
      this.$set(this.deviceOperationDetailDTO, 'deviceSubnetName', data.subnetName);
      this.$set(this.deviceOperationDetailDTO, 'deviceSubnet', data.id);
    },
  },
}
</script>
<style scoped lang="scss">
.d_center {
  border-radius: 8px;
  background-color: #FFFFFF;
  margin-top: 12px;
}

.d_sb {
  display: flex;
  justify-content: space-between;
}

.d_title {
  padding: 12px;
}

.d_start {
  display: flex;
  justify-content: flex-start;
}

.d_line2 {
  width: 4px;
  height: auto;
  margin-right: 12px;
  background-color: #589AF8;
}

.s_title {
  font-size: 14px;
  font-weight: bold;
}

.d_tmpl {
  padding: 0px 12px 0px 12px;
}

.d_load {
  margin-left: 12px;
  transform: scale(0.5);
}
</style>
