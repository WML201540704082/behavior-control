<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="设备列表"
      width="1200px"
      top="10vh"
      v-el-drag-dialog
    >
      <div class="page_form" v-if="type !== 'zcgl'">
        <el-form ref="queryForm" :model="searchForm" label-width="105px" class="xt_form">
          <el-row>
            <el-col :span="6">
              <el-form-item label="制造商:" prop="manufacturer">
                <el-select v-model="searchForm.manufacturer" @change="manufacturerChange" filterable clearable placeholder="请选择制造商">
                  <el-option
                    v-for="dict in manufacturerList"
                    :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictValue"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="品牌:" prop="brand">
                <el-select v-model="searchForm.brand" @change="brandChange" :disabled="!searchForm.manufacturer" filterable clearable placeholder="请选择品牌">
                  <el-option
                    v-for="dict in brandList"
                    :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictValue"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="系列:" prop="series">
                <el-select v-model="searchForm.series" @change="seriesChange" :disabled="!searchForm.brand" filterable clearable placeholder="请选择系列">
                  <el-option
                    v-for="dict in seriesList"
                    :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictValue"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="型号:" prop="deviceModel">
                <el-select v-model="searchForm.deviceModel" @change="deviceModelChange" :disabled="!searchForm.series" filterable clearable placeholder="请选择型号">
                  <el-option
                    v-for="dict in deviceModelList"
                    :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictValue"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="page_body">
        <el-row>
          <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
            <div slot="rightBtnBox">
              <el-button type="primary"
                         @click="handleQuery"
                         v-if="type !== 'zcgl'">查询
              </el-button>
              <el-button style="margin-left: 5px;"
                         @click="handleReset"
                         v-if="type !== 'zcgl'">重置
              </el-button>
              <!-- <el-button  type="primary"  style="margin-left: 5px;"
                          @click="handleEdit">修改</el-button> -->
              <el-button type="primary" style="margin-left: 5px;"
                         @click="handleUpload">重新导入
              </el-button>
              <el-button type="primary" style="margin-left: 5px;"
                         @click="rukuExport">导出异常数据
              </el-button>
              <el-button type="primary" style="margin-left: 5px;"
                         @click="handleExport"
                         v-if="type === 'zcgl'">导出数据
              </el-button>
              <el-button style="margin-left: 5px;"
                         @click="handleImportSelect">选择数据导入正式表
              </el-button>
              <el-button style="margin-left: 5px;"
                         @click="handleImportAll">全部数据导入正式表
              </el-button>
              
            </div>
          </formTitle>
        </el-row>
        <el-table
          ref="dataTable"
          stripe
          size="small"
          :data="dataList"
          :height="tabelHeight"
          v-loading="tableLoading"
          :row-class-name="rowClassName"
          @selection-change="selectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column v-if="type === 'zcgl'" prop="exceptionField" label="异常信息" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column v-for="item in tableArr.filter(el=>!el.hidden)" :key="item.prop" :prop="item.prop" :label="item.label" width="120" align="center" show-overflow-tooltip></el-table-column>

          <!-- <el-table-column prop="exceptionField" label="异常信息" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceName" label="设备名称" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sn" label="出厂序列号" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="factoryDate" label="生产日期" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="maintenanceCountry" label="制造国家及地区" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="制造国家及地区" width="200" align="center" show-overflow-tooltip>
            <template  slot-scope="scope">
              <span>{{showDictLable(scope.row.maintenanceCountry, maintenanceCountryList)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supplierName" label="制作商" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="aaa" label="地址" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="备注" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cpuModel" label="CPU" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="memSize" label="内存" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="hardDiskCapability" label="硬盘" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="powerModel" label="电源" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="OSVersion" label="操作系统" width="200" align="center" show-overflow-tooltip></el-table-column> -->
        </el-table>
        <!-- <pagination
          :total="total"
          :page.sync="searchForm.currentPage"
          :limit.sync="searchForm.pageSize"
          @pagination="getList"/> -->
      </div>
    </el-dialog>


    <deviceEdit
      v-if="showDeviceEdit"
      :formData="formData"
      :isShow="showDeviceEdit"
      @setVal="editDeviceForm"
      @close="showDeviceEdit = false"
    ></deviceEdit>
  </div>
</template>

<script>
import {globalattrDetail, globalattrSave} from "@/api/system/relationManage";
import deviceEdit from './deviceEdit'
import {getDictList, getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import {cmdbciattrgradePage} from "@/api/assets/devStandingBook";

export default {
  props: ['isShow', 'arrtId', 'tableList', 'deviceCategory', 'deviceType', 'type', 'ciId'],
  components: {deviceEdit},
  data() {
    return {
      manufacturerList: [],
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      maintenanceCountryList: [],
      tabelHeight: '60vh',
      searchForm: {
        currentPage: 1,
        pageSize: 20,
        brand: '',
        series: '',
        deviceModel: '',
      },
      rules: {
        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'},
        ]
      },
      pageLoading: false,
      saveLoading: false,

      importList: [],
      dataList: [],
      selectionList: [],
      total: 0,
      tableLoading: false, //表格加载

      // 数据修改
      showDeviceEdit: false,
      formData: {},

      tableArr: [],
      allTemplate: {
        1118822355763201: [ // 基础设施
        {prop: 'exceptionField', label: '异常信息'},
        { prop: 'fullName', label: '标准全称', type: '硬件配置' },
        { prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'}, 
        { prop: 'procureType', label: '采购方式', type: '资产信息' },
        { prop: 'sn', label: '出厂序列号', type: '资产信息' },
        {prop: 'maker', label: '制造商', type: '硬件配置'},     
        {prop: 'makerCode', label: '制造商编码', type: '硬件配置', hidden: true},     
        { prop: 'brand', label: '品牌', type: '硬件配置' },
        { prop: 'brandCode', label: '品牌编码', type: '硬件配置', hidden: true },
        { prop: 'series', label: '系列', type: '硬件配置' },
        { prop: 'seriesCode', label: '系列编码', type: '硬件配置', hidden: true },
        { prop: 'deviceModel', label: '型号', type: '硬件配置' },  
        { prop: 'deviceModelCode', label: '型号编码', type: '硬件配置', hidden: true },  
        { prop: 'ownerUnit', label: '产权单位', type: '资产信息' },
        { prop: 'propertyDept', label: '产权部门', type: '资产信息' },
        { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
        { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },      
        { prop: 'remark', label: '备注', type: '资产信息' },  
        ],
        1097757579608065: [ // 备品备件
          {prop: 'exceptionField', label: '异常信息'},
          {prop: 'sn', label: '出厂序列号', type: '资产信息'},
          {prop: 'fullName', label: '标准全称', type: '硬件配置'},
          {prop: 'deviceName', label: '设备名称', type: '硬件配置'},
          {prop: 'maker', label: '制造商', type: '硬件配置'},
          {prop: 'makerCode', label: '制造商编码', type: '硬件配置', hidden: true},  
          {prop: 'brand', label: '品牌', type: '硬件配置'},
          { prop: 'brandCode', label: '品牌编码', type: '硬件配置', hidden: true },
          {prop: 'series', label: '系列', type: '硬件配置'},
          { prop: 'seriesCode', label: '系列编码', type: '硬件配置', hidden: true },
          {prop: 'deviceModel', label: '型号', type: '硬件配置'},
          { prop: 'deviceModelCode', label: '型号编码', type: '硬件配置', hidden: true },  
          {prop: 'cpuModel', label: 'CPU型号', type: '硬件配置'},
          {prop: 'factoryDate', label: '出厂日期', type: '资产信息'},
          {prop: 'serviceName', label: '服务商', type: '资产信息'},
          {prop: 'serviceTel', label: '服务商联系电话', type: '资产信息'},
          {prop: 'serviceContacts', label: '服务商联系人', type: '资产信息'},
          {prop: 'serviceLevel', label: '服务级别', type: '资产信息'},
          {prop: 'afterSaleBeginDate', label: '服务开始日期', type: '资产信息'},
          {prop: 'serviceExpDate', label: '服务到期时间', type: '资产信息'},
          {prop: 'afterSaleExpDate', label: '售后服务到期时间', type: '资产信息'},
          {prop: 'sparePartsType', label: '备品备件类型', type: '资产信息'},
          {prop: 'remark', label: '备注', type: '资产信息'},
        ],
        1097757327949825: [ // 办公设备
          { prop: 'exceptionField', label: '异常信息'},
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'procureType', label: '采购方式', type: '资产信息' },
          { prop: 'sn', label: '出厂序列号', type: '资产信息' },  
          { prop: 'maker', label: '制造商', type: '硬件配置' },    
          { prop: 'makerCode', label: '制造商编码', type: '硬件配置', hidden: true },  
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'brandCode', label: '品牌编码', type: '硬件配置', hidden: true },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'seriesCode', label: '系列编码', type: '硬件配置', hidden: true },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },  
          { prop: 'deviceModelCode', label: '型号编码', type: '硬件配置', hidden: true },  
          { prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},    
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },      
          { prop: 'remark', label: '备注', type: '资产信息' }, 
        ],
        1097757118234624: [ // 辅助设备
          {prop: 'exceptionField', label: '异常信息'},
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},
          { prop: 'procureType', label: '采购方式', type: '资产信息' },
          { prop: 'sn', label: '出厂序列号', type: '资产信息' },   
          {prop: 'maker', label: '制造商', type: '硬件配置'},
          {prop: 'makerCode', label: '制造商编码', type: '硬件配置', hidden: true},     
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'brandCode', label: '品牌编码', type: '硬件配置', hidden: true },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'seriesCode', label: '系列编码', type: '硬件配置', hidden: true },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },  
          { prop: 'deviceModelCode', label: '型号编码', type: '硬件配置', hidden: true },      
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },      
          { prop: 'remark', label: '备注', type: '资产信息' },     

        ],
        1097756774301696: [ // 终端设备
          { prop: 'exceptionField', label: '异常信息'},
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'procureType', label: '采购方式', type: '资产信息' },
          { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          {prop: 'maker', label: '制造商', type: '硬件配置'},
          {prop: 'makerCode', label: '制造商编码', type: '硬件配置', hidden: true},  
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'brandCode', label: '品牌编码', type: '硬件配置', hidden: true },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'seriesCode', label: '系列编码', type: '硬件配置', hidden: true },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          { prop: 'deviceModelCode', label: '型号编码', type: '硬件配置', hidden: true },  
          { prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },
          { prop: 'isITAI', label: '是否信创设备', type: '资产信息' },
          { prop: 'hardDiskCapability', label: '硬盘容量(GB)', type: '硬件配置' },
          { prop: 'cpuArch', label: 'CPU架构', type: '硬件配置' },
          { prop: 'cpuBrand', label: 'CPU品牌', type: '硬件配置' },
          { prop: 'memSize', label: '内存大小(GB)', type: '硬件配置' },
          { prop: 'remark', label: '备注', type: '资产信息' }


        ],
        1097756572975105: [ // 安全设备
        { prop: 'exceptionField', label: '异常信息'},
        { prop: 'fullName', label: '标准全称', type: '硬件配置' },
        { prop: 'procureType', label: '采购方式', type: '资产信息' },
        { prop: 'sn', label: '出厂序列号', type: '资产信息' },
        {prop: 'maker', label: '制造商', type: '硬件配置'},
        {prop: 'makerCode', label: '制造商编码', type: '硬件配置', hidden: true},  
        { prop: 'brand', label: '品牌', type: '硬件配置' },
        { prop: 'brandCode', label: '品牌编码', type: '硬件配置', hidden: true },
        { prop: 'series', label: '系列', type: '硬件配置' },
        { prop: 'seriesCode', label: '系列编码', type: '硬件配置', hidden: true },
        { prop: 'deviceModel', label: '型号', type: '硬件配置' },
        { prop: 'deviceModelCode', label: '型号编码', type: '硬件配置', hidden: true },  
        { prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},
        { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
        { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },
        { prop: 'remark', label: '备注', type: '资产信息' }

        ],
        1097756405202944: [ // 网络设备
          { prop: 'exceptionField', label: '异常信息'},
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'procureType', label: '采购方式', type: '资产信息' },
          { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          {prop: 'maker', label: '制造商', type: '硬件配置'},
          {prop: 'makerCode', label: '制造商编码', type: '硬件配置', hidden: true},  
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'brandCode', label: '品牌编码', type: '硬件配置', hidden: true },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'seriesCode', label: '系列编码', type: '硬件配置', hidden: true },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          { prop: 'deviceModelCode', label: '型号编码', type: '硬件配置', hidden: true },  
          { prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },
          { prop: 'remark', label: '备注', type: '资产信息' }

        ],
        1097756019326977: [ // 存储设备
          {prop: 'exceptionField', label: '异常信息'},
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'procureType', label: '采购方式', type: '资产信息' },
          { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          {prop: 'maker', label: '制造商', type: '硬件配置'},
          {prop: 'makerCode', label: '制造商编码', type: '硬件配置', hidden: true},  
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'brandCode', label: '品牌编码', type: '硬件配置', hidden: true },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'seriesCode', label: '系列编码', type: '硬件配置', hidden: true },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          { prop: 'deviceModelCode', label: '型号编码', type: '硬件配置', hidden: true },  
          {prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },
          { prop: 'remark', label: '备注', type: '资产信息' }

        ],
        1097755012694017: [ // 主机设备
          {prop: 'exceptionField', label: '异常信息'},
          {prop: 'fullName', label: '标准全称', type: '硬件配置'},  
          {prop: 'procureType', label: '采购方式', type: '资产信息'}, 
          {prop: 'sn', label: '出厂序列号', type: '资产信息'},  
          {prop: 'maker', label: '制造商', type: '硬件配置'},
          {prop: 'makerCode', label: '制造商编码', type: '硬件配置', hidden: true},   
          {prop: 'brand', label: '品牌', type: '资产信息'},
          { prop: 'brandCode', label: '品牌编码', type: '硬件配置', hidden: true },
          {prop: 'series', label: '系列', type: '资产信息'},
          { prop: 'seriesCode', label: '系列编码', type: '硬件配置', hidden: true },
          {prop: 'deviceModel', label: '型号', type: '资产信息'},
          { prop: 'deviceModelCode', label: '型号编码', type: '硬件配置', hidden: true },  
          {prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},
          {prop: 'factoryDate', label: '出厂日期', type: '资产信息'},
          {prop: 'serviceExpDate', label: '服务到期时间', type: '资产信息'},
          {prop: 'cpuCoreSize', label: 'CPU核数', type: '资产信息'},
          {prop: 'cpuArch', label: 'CPU架构', type: '资产信息'},
          {prop: 'cpuBrand', label: 'CPU品牌', type: '资产信息'},
          {prop: 'memSize', label: '内存大小（GB）', type: '硬件配置'},
          {prop: 'remark', label: '备注', type: '资产信息'},

        ],
      },


    }
  },
  computed: {},
  async mounted() {
    let tables = null;
    if (this.type === 'zcgl') {
      tables = this.tableList.records;
      if (tables && tables.length > 0) {
        let item = tables[0];
        await cmdbciattrgradePage({
          ciId: this.ciId,
        }).then(res => {
          this.attrList = res.data.records
        })

        let arrs = [];
        arrs.push({
          prop: 'dataOptType',
          label: '操作类型',
          type: ''
        })
        Object.keys(item).forEach(key => {
          let im = this.attrList.find(a => a.name === key);
          if (im) {
            let tsarrs = this.tsarrs();
            let newKey = null;
            let fItem = tsarrs.find(a => a === key);
            if (fItem) {
              newKey = key.replace('Code', '');
            } else {
              newKey = key;
            }
            arrs.push({
              prop: newKey,
              label: im.label,
              type: im.groupName
            })
          }
        })

        this.tableArr = arrs;
        this.tabelHeight = '70vh';
      }
    } else {
      tables = this.tableList.list

      this.tableArr = this.allTemplate[this.deviceCategory]
    }

    if (this.tableList.exceptionField) {
      this.$message.error(this.tableList.exceptionField)
    }

    tables.forEach((el, index) => {
      el.indexs = index
    })

    // 做筛选
    // let newArr = tables.filter(el=>{
    //   return !el.exceptionField
    // })
    this.dataList = JSON.parse(JSON.stringify(tables))
    this.importList = JSON.parse(JSON.stringify(tables))

    // this.dataList = [
    //   { deviceName: 'qqq', exceptionField: '啊啊啊啊' },
    //   { deviceName: 'qqq2' }
    // ]
    // this.importList = [
    //   { deviceName: 'qqq', exceptionField: '啊啊啊啊' },
    //   { deviceName: 'qqq2' }
    // ]
    // 加载字典
    // this.getDictCmdbList('1082554947272704') // 品牌
    // this.getDictCmdbList('1082609011851264') // 系列
    // this.getDictCmdbList('1082608047161344') // 型号
    // this.getDictCmdbList('1083979207081984') // 国家及地区
    this.getDictCmdbList('1082610161090560') // 制造商
  },
  methods: {
    //特殊Code字段
    tsarrs() {
      return [
        'deviceSourceCode',
        'deviceStatusCode',
        'deviceTypeCode',
        'deviceCategoryCode',
        'cpuArchCode',
        'inWarehouseCode',
        'rackCode',
        'computerRoomCode',
        'cabinetCode',
        'afterStatusCode',
        'netWorkCode',
        'isITAICode',
        'hardDiskTypeCode',
        'isExternalUnitCode',
        'isDataCompleteCode',
        'isScrapCode',
        'OSTypeCode',
        'procureTypeCode',
        'scrapReasonCode',
        'isToErpCode',
        'cpuBrandCode',
        'deviceAddTypeCode',
        'deviceChangeTypeCode',
        'factoryAreaCode',
        'voltageLevelCode',
        'isAccessEquipmentCode',
      ];
    },
    manufacturerChange(val) {

      this.searchForm.brand = ""
      this.searchForm.series = ""
      this.searchForm.deviceModel = ""

      let current = this.manufacturerList.filter(el => el.dictValue == val)[0]
      if (!current) return
      this.searchForm.manufacturerCode = current.dictKey;
      this.getDictCmdbListPid('1082554947272704', this.searchForm.manufacturerCode) // 品牌
    },
    brandChange(val) {
      this.searchForm.series = ""
      this.searchForm.deviceModel = ""

      let current = this.brandList.filter(el => el.dictValue == val)[0]
      if (!current) return
      this.searchForm.brandCode = current.dictKey;
      this.getDictCmdbListPid('1082609011851264', this.searchForm.brandCode) // 系列
    },
    seriesChange(val) {
      this.searchForm.deviceModel = ""

      let current = this.seriesList.filter(el => el.dictValue == val)[0]
      if (!current) return
      this.searchForm.seriesCode = current.dictKey;
      this.getDictCmdbListPid('1082608047161344', this.searchForm.seriesCode) // 型号
    },
    deviceModelChange() {
      // let current = this.deviceModelList.filter(el=> el.dictKey == val)[0]
      // this.searchForm.deviceModelName = current.dictValue;
    },
    getDictCmdbListPid(ciId, pid) {
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

    handleUpload() {
      this.$emit("resetUpload")
    },

    //设置行样式
    rowClassName({row, rowIndex}) {
      let styleJson = ''
      if (row.exceptionField) {
        styleJson = 'activeRow'
      }
      return styleJson
    },
    editDeviceForm(form) {
      let dataListIndex = this.dataList.findIndex(el => el.indexs == form.indexs)
      let importListIndex = this.importList.findIndex(el => el.indexs == form.indexs)
      if (dataListIndex != -1) {
        this.$set(this.dataList, dataListIndex, form)
      }
      if (importListIndex != -1) {
        this.$set(this.importList, importListIndex, form)
      }
      this.showDeviceEdit = false
    },
    getList() {
      // this.tableLoading = true
      // storageList(this.searchForm).then(res => {
      //   console.log(10, res)
      //   this.dataList = res.data.records
      //   this.total = res.data.total
      //   this.tableLoading = false
      // })
    },
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection;
    },
    handleQuery() {
      this.dataList = this.importList.filter(el => {
        if ((!this.searchForm.manufacturer || el.maker == this.searchForm.manufacturer) && (!this.searchForm.brand || el.brand == this.searchForm.brand) && (!this.searchForm.series || el.series == this.searchForm.series) && (!this.searchForm.deviceModel || el.deviceModel == this.searchForm.deviceModel)) {
          return true
        } else {
          return false
        }
      })
    },
    handleReset() {
      this.searchForm = {}
      this.handleQuery()
    },
    handleEdit() {
      if (this.selectionList.length != 1) {
        return this.$message.warning("请选择一条数据！")
      }

      this.formData = this.selectionList[0]
      this.showDeviceEdit = true
    },
    handleImportSelect() {
      if (this.selectionList.length == 0) {
        return this.$message.warning("请至少选择一条数据！")
      }
      if (this.selectionList.some(el => el.exceptionField)) {
        return this.$message.warning("异常数据不能导入！")
      }
      // console.log(111, this.tableArr)
      // console.log(222, this.selectionList)
      let filterArr = this.selectionList
      for (let i = 0; i < filterArr.length; i++) {
        let item = filterArr[i]
        let deviceHardwareInfo = {}
        for (let j = 0; j < this.tableArr.length; j++) {
          if (this.tableArr[j].type) {
            deviceHardwareInfo[this.tableArr[j].prop] = item[this.tableArr[j].prop]
          }
        }
        item.deviceHardwareInfo = JSON.stringify(deviceHardwareInfo)
      }
      this.$emit('setVal', filterArr)
    },
    handleImportAll() {
      if (this.importList.length == 0) {
        return this.$message.warning("导入数据不能为空！")
      }

      let filterArr = this.importList.filter(el => !el.exceptionField)
      if (filterArr.length === 0) {
        this.$message.warning('异常数据不能导入！');
        return;
      }

      for (let i = 0; i < filterArr.length; i++) {
        let item = filterArr[i]
        let deviceHardwareInfo = {}
        for (let j = 0; j < this.tableArr.length; j++) {
          if (this.tableArr[j].type) {
            deviceHardwareInfo[this.tableArr[j].prop] = item[this.tableArr[j].prop]
          }
        }
        item.deviceHardwareInfo = JSON.stringify(deviceHardwareInfo)
      }
      this.$emit('setVal', filterArr)
    },
    rukuExport(){
      let params = {
        deviceCategory: this.deviceCategory,
        deviceType: this.deviceType,
        records: this.dataList
      }
      let fileName = '设备入库异常导出.xlsx'
      this.download("/api/idevelop-device/device/storage/info/export", params, fileName);
    },
    handleExport() {
      if (this.importList.length == 0) {
        return this.$message.warning("导入数据不能为空！")
      }

      let filterArr = null;
      if (this.type === 'zcgl') {
        filterArr = this.importList;
      } else {
        filterArr = this.importList.filter(el => !el.exceptionField)
      }

      for (let i = 0; i < filterArr.length; i++) {
        let item = filterArr[i]
        let deviceHardwareInfo = {}
        for (let j = 0; j < this.tableArr.length; j++) {
          if (this.tableArr[j].type) {
            deviceHardwareInfo[this.tableArr[j].prop] = item[this.tableArr[j].prop]
          }
        }
        item.deviceHardwareInfo = JSON.stringify(deviceHardwareInfo)
      }
      if (filterArr.length === 0) {
        this.$message.warning('异常数据不能导入！');
        return;
      }
      this.tableLoading = true;

      this.$emit('setValExoprt', {
        filterArr: filterArr,
        errAddr: this.tableList.errAddr,
      })
    },

    showDictLable(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }
      }
      return code;
    },
    getDictCmdbList(ciId) {
      //加载字典
      getDictCmdbList({ciId: ciId}).then(res => {
        if (ciId === '1082554947272704') { // 品牌
          this.brandList = res.data;
        } else if (ciId === '1082609011851264') { // 系列
          this.seriesList = res.data.slice(0, 10);
        } else if (ciId === '1082608047161344') { // 型号
          this.deviceModelList = res.data.slice(0, 10);
        } else if (ciId === '1083979207081984') { // 国家及地区
          this.maintenanceCountryList = res.data;
        } else if (ciId === '1082610161090560') { // 制造商
          this.manufacturerList = res.data
        }
      });
    },


    // 详情
    getDetail() {
      if (this.showType != '新增') {
        this.pageLoading = true
        globalattrDetail({id: this.arrtId}).then(res => {
          this.pageLoading = false
          this.submitForm = res.Return
        }).catch(() => {
          this.pageLoading = false
        })
      }
    },
    // 保存
    save() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          globalattrSave(this.submitForm).then(res => {
            this.saveLoading = false
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.$emit('saveGlobalArrt')
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .tabb .el-table__fixed {
  height: 100% !important;
}

::v-deep .activeRow td {
  //background: rgba(255,0,0,0.3) !important;
  color: #E43D30;
}

::v-deep .el-table__fixed-right::before, ::v-deep .el-table__fixed::before {
  background: none !important;
}
</style>
