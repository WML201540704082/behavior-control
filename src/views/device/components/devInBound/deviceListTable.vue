<template>
  <div>
    <el-table
      ref="dataTable"
      stripe
      size="small"
      :data="dataList"
      :height="tableHeight"
      v-loading="tableLoading"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="30" fixed="left"></el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column v-if="idd" prop="deviceCode" label="设备编码" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="idd && deviceSource == '1102861334544385'" prop="erpAssetCode" label="ERP资产编码" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="isTemp === 0 && deviceSource == '1102861334544385'" prop="syncErpStatus" label="ERP同步状态" align="center" show-overflow-tooltip>
        <template  slot-scope="scope">
          <span>{{showDictLable(scope.row.syncErpStatus, syncErpStatusList)}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isTemp === 0 && deviceSource == '1102861334544385'" prop="syncI6000Status" label="I6000同步状态" align="center" show-overflow-tooltip>
        <template  slot-scope="scope">
          <span>{{showDictLable(scope.row.syncI6000Status, syncI6000StatusList)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fullName" label="设备名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="资产信息" align="center" width="280">
        <template slot-scope="scope">
          <div class="tableItem">
            <p v-for="item in propertyInfo" :key="item.prop">{{ item.label }}：{{ scope.row[item.prop] }}</p>
            <!-- <p>出厂序列号：{{ scope.row.sn }}</p>
            <p>生产日期：{{ scope.row.factoryDate }}</p>
            <p>制造国家及地区：{{ showDictLable(scope.row.maintenanceCountry,maintenanceCountryList) }}</p>
            <p>制造商：{{ scope.row.aaa }}</p>
            <p>地址：{{ scope.row.aaa }}</p>
            <p>供应商：{{ scope.row.supplierName }}</p>
            <p>供应商联系电话：{{ scope.row.supplierTel }}</p>
            <p>资产原值(￥)：{{ scope.row.assetOriginal }}</p>
            <p>净值(￥)：{{ scope.row.netWorth }}</p> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="硬件配置" align="center" width="280">
        <template slot-scope="scope">
          <div class="tableItem">
            <p v-for="item in hardwareInfo" :key="item.prop">{{ item.label }}：{{ scope.row[item.prop] }}</p>
            <!-- <p>品牌：{{ showDictLable(scope.row.brand, brandList) }}</p>
            <p>系列：{{ showDictLable(scope.row.series, seriesList) }}</p>
            <p>型号：{{ showDictLable(scope.row.deviceModel, deviceModelList) }}</p>
            <p>CPU：{{ scope.row.cpuModel }}</p>
            <p>内存：{{ scope.row.memSize }}</p>
            <p>硬盘驱动器：{{ scope.row.hardDiskCapability }}</p>
            <p>固态硬盘驱动器：{{ scope.row.aaa }}</p>
            <p>电源：{{ scope.row.powerModel }}</p>
            <p>操作系统：{{ scope.row.OSVersion }}</p> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="idd" prop="deviceStatus" label="设备状态" width="150" align="center" show-overflow-tooltip>
        <template  slot-scope="scope">
          <span>{{showDictLable(scope.row.deviceStatus,deviceStatusList)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>



    </el-table>
    <!-- <pagination
      :total="total"
      :page.sync="searchForm.currentPage"
      :limit.sync="searchForm.pageSize"
      @pagination="getList"/> -->
  </div>
</template>

<script>
import { globalattrDetail, globalattrSave } from "@/api/system/relationManage";
import {getDictList, getDictCmdbList} from "@/api/dict";
export default {
  props: ['infoList', 'deviceCategory', 'idd', 'isTemp', 'deviceSource'],
  data() {
    return{
      tableArr: [],
      syncErpStatusList: [],
      syncI6000StatusList: [],
      allTemplate: {
        1118822355763201: [ // 基础设施
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'}, 
          { prop: 'procureType', label: '采购方式', type: '资产信息' },
          { prop: 'sn', label: '出厂序列号', type: '资产信息' }, 
          { prop: 'maker', label: '制造商', type: '硬件配置' },    
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },  
          { prop: 'ownerUnit', label: '产权单位', type: '资产信息' },
          { prop: 'propertyDept', label: '产权部门', type: '资产信息' },
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },      


          // { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          // { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          // { prop: 'procureType', label: '采购方式', type: '资产信息' },
          // { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          // { prop: 'isExternalUnit', label: '是否外单位设备', type: '资产信息' },
          // { prop: 'maker', label: '制造商', type: '硬件配置' },
          // { prop: 'brand', label: '品牌', type: '硬件配置' },
          // { prop: 'series', label: '系列', type: '硬件配置' },
          // { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          // { prop: 'wiringNodeNo', label: '布线节点数（个）', type: '硬件配置' },
          // { prop: 'cabinetCapacity', label: '机柜容量（U）', type: '硬件配置' },
          // { prop: 'airConditionType', label: '空调类型', type: '硬件配置' },
          // { prop: 'horsepower', label: '匹数', type: '硬件配置' },
          // { prop: 'remainingCapacity', label: '剩余容量', type: '硬件配置' },
          // { prop: 'coolCapacity', label: '制冷量', type: '硬件配置' },
          // { prop: 'residualValueAssetRenewal', label: '残值处理及资产更新方案', type: '资产信息' },
          // { prop: 'pduRatedPower', label: 'PDU额定功率', type: '硬件配置' },
          // { prop: 'pduOperatePower', label: 'PDU运行功率', type: '硬件配置' },
          // { prop: 'upsCapacity', label: 'UPS容量（KVA）', type: '硬件配置' },
          // { prop: 'batteryNum', label: '电池数（块）', type: '硬件配置' },
          // { prop: 'batteryPackNum', label: '电池组数（组）', type: '硬件配置' },
          // { prop: 'powerLoad', label: '电源负载', type: '硬件配置' },
          // { prop: 'ratedCapacity', label: '额定容量', type: '硬件配置' },
          // { prop: 'functionDes', label: '功能描述', type: '硬件配置' },
          // { prop: 'usableCapacity', label: '可用容量', type: '硬件配置' },
          // { prop: 'belongUps', label: '所属UPS', type: '硬件配置' },
          // { prop: 'afterSaleExpDate', label: '售后服务到期时间', type: '资产信息' },
          // { prop: 'serviceLevel', label: '服务级别', type: '资产信息' },
          // { prop: 'serviceName', label: '服务商', type: '资产信息' },
          // { prop: 'serviceTel', label: '服务商联系电话', type: '资产信息' },
          // { prop: 'serviceContacts', label: '服务商联系人', type: '资产信息' },
          // // { prop: 'remark', label: '备注', type: '资产信息' },
        ],
        1097757579608065: [ // 备品备件
          { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'maker', label: '制造商', type: '硬件配置' },
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          { prop: 'cpuModel', label: 'CPU型号', type: '硬件配置' },
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceName', label: '服务商', type: '资产信息' },
          { prop: 'serviceTel', label: '服务商联系电话', type: '资产信息' },
          { prop: 'serviceContacts', label: '服务商联系人', type: '资产信息' },
          { prop: 'serviceLevel', label: '服务级别', type: '资产信息' },
          { prop: 'afterSaleBeginDate', label: '服务开始日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期时间', type: '资产信息' },
          { prop: 'afterSaleExpDate', label: '售后服务到期时间', type: '资产信息' },
          { prop: 'sparePartsType', label: '备品备件类型', type: '资产信息' },
          // { prop: 'remark', label: '备注', type: '资产信息' },
        ],
        1097757327949825: [ // 办公设备
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'procureType', label: '采购方式', type: '资产信息' },
          { prop: 'sn', label: '出厂序列号', type: '资产信息' },  
          { prop: 'maker', label: '制造商', type: '硬件配置' },    
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },  
          { prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},    
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },      




          // { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          // { prop: 'deviceName', label: '设备名称', type: '硬件配置' },
          // { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          // { prop: 'procureType', label: '采购方式', type: '资产信息' },
          // { prop: 'residualValueAssetRenewal', label: '残值处理及资产更新方案', type: '资产信息' },
          // { prop: 'maker', label: '制造商', type: '硬件配置' },
          // { prop: 'brand', label: '品牌', type: '硬件配置' },
          // { prop: 'series', label: '系列', type: '硬件配置' },
          // { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          // { prop: 'contractNo', label: '服务合同编号', type: '资产信息' },
          // { prop: 'serviceName', label: '服务商', type: '资产信息' },
          // { prop: 'serviceTel', label: '服务商联系电话', type: '资产信息' },
          // { prop: 'serviceContacts', label: '服务商联系人', type: '资产信息' },
          // { prop: 'afterSaleBeginDate', label: '服务开始日期', type: '资产信息' },
          // { prop: 'serviceExpDate', label: '服务到期时间', type: '资产信息' },
          // { prop: 'afterSaleExpDate', label: '售后服务到期时间', type: '资产信息' },
          // { prop: 'serviceLevel', label: '服务级别', type: '资产信息' },
          // { prop: 'developerTel', label: '开发商联系方式', type: '资产信息' },
          // { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          // // { prop: 'remark', label: '备注', type: '资产信息' },
        ],
        1097757118234624: [ // 辅助设备
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},
          { prop: 'procureType', label: '采购方式', type: '资产信息' },
          { prop: 'sn', label: '出厂序列号', type: '资产信息' }, 
          { prop: 'maker', label: '制造商', type: '硬件配置' },       
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },      
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },      
             



          // { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          // { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          // { prop: 'procureType', label: '采购方式', type: '资产信息' },
          // { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          // { prop: 'isExternalUnit', label: '是否外单位设备', type: '资产信息' },
          // { prop: 'maker', label: '制造商', type: '硬件配置' },
          // { prop: 'brand', label: '品牌', type: '硬件配置' },
          // { prop: 'series', label: '系列', type: '硬件配置' },
          // { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          // { prop: 'wiringNodeNo', label: '布线节点数（个）', type: '硬件配置' },
          // { prop: 'cabinetCapacity', label: '机柜容量（U）', type: '硬件配置' },
          // { prop: 'airConditionType', label: '空调类型', type: '硬件配置' },
          // { prop: 'horsepower', label: '匹数', type: '硬件配置' },
          // { prop: 'remainingCapacity', label: '剩余容量', type: '硬件配置' },
          // { prop: 'coolCapacity', label: '制冷量', type: '硬件配置' },
          // { prop: 'residualValueAssetRenewal', label: '残值处理及资产更新方案', type: '资产信息' },
          // { prop: 'pduRatedPower', label: 'PDU额定功率', type: '硬件配置' },
          // { prop: 'pduOperatePower', label: 'PDU运行功率', type: '硬件配置' },
          // { prop: 'upsCapacity', label: 'UPS容量（KVA）', type: '硬件配置' },
          // { prop: 'batteryNum', label: '电池数（块）', type: '硬件配置' },
          // { prop: 'batteryPackNum', label: '电池组数（组）', type: '硬件配置' },
          // { prop: 'powerLoad', label: '电源负载', type: '硬件配置' },
          // { prop: 'ratedCapacity', label: '额定容量', type: '硬件配置' },
          // { prop: 'functionDes', label: '功能描述', type: '硬件配置' },
          // { prop: 'usableCapacity', label: '可用容量', type: '硬件配置' },
          // { prop: 'belongUps', label: '所属UPS', type: '硬件配置' },
          // { prop: 'afterSaleExpDate', label: '售后服务到期时间', type: '资产信息' },
          // { prop: 'serviceLevel', label: '服务级别', type: '资产信息' },
          // { prop: 'serviceName', label: '服务商', type: '资产信息' },
          // { prop: 'serviceTel', label: '服务商联系电话', type: '资产信息' },
          // { prop: 'serviceContacts', label: '服务商联系人', type: '资产信息' },
          // // { prop: 'remark', label: '备注', type: '资产信息' },
        ],
        1097756774301696: [ // 终端设备
          
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'procureType', label: '采购方式', type: '资产信息' },
          { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          { prop: 'maker', label: '制造商', type: '硬件配置' },  
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          { prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },
          { prop: 'isITAI', label: '是否信创设备', type: '资产信息' },
          { prop: 'hardDiskCapability', label: '硬盘容量(GB)', type: '硬件配置' },
          { prop: 'cpuArch', label: 'CPU架构', type: '硬件配置' },
          { prop: 'cpuBrand', label: 'CPU品牌', type: '硬件配置' },
          { prop: 'memSize', label: '内存大小(GB)', type: '硬件配置' },
          
        // { prop: 'fullName', label: '标准全称', type: '硬件配置' },
        //   { prop: 'maker', label: '制造商', type: '硬件配置' },
        //   { prop: 'brand', label: '品牌', type: '硬件配置' },
        //   { prop: 'series', label: '系列', type: '硬件配置' },
        //   { prop: 'deviceModel', label: '型号', type: '硬件配置' },
        //   { prop: 'isITAI', label: '是否信创设备', type: '资产信息' },
        //   { prop: 'hardDiskType', label: '硬盘类型', type: '硬件配置' },
        //   { prop: 'hardDiskCapability', label: '硬盘容量(GB)', type: '硬件配置' },
        //   { prop: 'memSize', label: '内存大小(GB)', type: '硬件配置' },
        //   { prop: 'cpuArch', label: 'CPU架构', type: '硬件配置' },
        //   { prop: 'cpuBrand', label: 'CPU品牌', type: '硬件配置' },
        //   { prop: 'cpuModel', label: 'CPU型号', type: '硬件配置' },
        //   { prop: 'cpuFrequecy', label: 'CPU主频', type: '硬件配置' },

        //   { prop: 'procureType', label: '采购方式', type: '资产信息' },

        //   { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
        //   { prop: 'sn', label: '出厂序列号', type: '资产信息' },
        //   { prop: 'netWorth', label: '净值', type: '资产信息' },
        //   { prop: 'assetOriginal', label: '资产原值', type: '资产信息' },
        //   { prop: 'serviceName', label: '服务商', type: '资产信息' },
        //   { prop: 'afterSaleExpDate', label: '售后服务到期时间', type: '资产信息' },

        //   { prop: 'isUse', label: '是否可用', type: '资产信息' },

        //   { prop: 'OSVersion', label: '操作系统版本号', type: '硬件配置' },
        //   { prop: 'OSType', label: '操作系统类型', type: '硬件配置' },
          // { prop: 'remark', label: '备注', type: '资产信息' },
        ],
        1097756572975105: [ // 安全设备
          
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'procureType', label: '采购方式', type: '资产信息' },
          { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          { prop: 'maker', label: '制造商', type: '硬件配置' },  
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          { prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },
    
          // { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          // { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          // { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          // { prop: 'cpuCoreSize', label: 'CPU核数', type: '硬件配置' },
          // { prop: 'securityFilingNo', label: '安全备案编号', type: '资产信息' },
          // { prop: 'procureType', label: '采购方式', type: '资产信息' },

          // { prop: 'maker', label: '制造商', type: '硬件配置' },
          // { prop: 'brand', label: '品牌', type: '硬件配置' },
          // { prop: 'series', label: '系列', type: '硬件配置' },
          // { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          // { prop: 'hardDiskType', label: '硬盘类型', type: '硬件配置' },
          // { prop: 'hardDiskCapability', label: '硬盘容量(GB)', type: '硬件配置' },
          // { prop: 'useTo', label: '用途', type: '资产信息' },
          // { prop: 'memSize', label: '内存大小(GB)', type: '硬件配置' },
          // { prop: 'deviceLevel', label: '设备等级', type: '资产信息' },
          // { prop: 'middleware', label: '中间件', type: '硬件配置' },
          // { prop: 'residualValueAssetRenewal', label: '残值处理及资产更新方案', type: '资产信息' },
          // { prop: 'raidStorageType', label: '存储RAID冗余方式', type: '硬件配置' },
          // { prop: 'serviceName', label: '服务商', type: '资产信息' },
          // { prop: 'serviceTel', label: '服务商联系电话', type: '资产信息' },
          // { prop: 'serviceContacts', label: '服务商联系人', type: '资产信息' },
          // { prop: 'afterSaleExpDate', label: '售后服务到期时间', type: '资产信息' },
          // { prop: 'afterSaleBeginDate', label: '服务开始日期', type: '资产信息' },
          // { prop: 'serviceExpDate', label: '服务到期时间', type: '资产信息' },
          // { prop: 'serviceLevel', label: '服务级别', type: '资产信息' },
          // { prop: 'remark', label: '备注', type: '资产信息' },
        ],
        1097756405202944: [ // 网络设备
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'procureType', label: '采购方式', type: '资产信息' },
          { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          { prop: 'maker', label: '制造商', type: '硬件配置' },  
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          {prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },


          // { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          // { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          // { prop: 'maker', label: '制造商', type: '硬件配置' },
          // { prop: 'brand', label: '品牌', type: '硬件配置' },
          // { prop: 'series', label: '系列', type: '硬件配置' },
          // { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          // { prop: 'netPortNum', label: '网口数量', type: '硬件配置' },
          // { prop: 'electricPortNum', label: '电端口数量', type: '硬件配置' },
          // { prop: 'opticalPortNum', label: '光端口数量', type: '硬件配置' },
          // { prop: 'powerModel', label: '电源模块(个)', type: '硬件配置' },
          // { prop: 'ratedPower', label: '额定功率(W)', type: '硬件配置' },
          // { prop: 'deviceHeight', label: '设备高度', type: '硬件配置' },
          // { prop: 'networkDeviceType', label: '网络设备用途类型', type: '资产信息' },
          // { prop: 'residualValueAssetRenewal', label: '残值处理及资产更新方案', type: '资产信息' },
          // { prop: 'procureType', label: '采购方式', type: '资产信息' },
          // { prop: 'netWorth', label: '净值', type: '资产信息' },
          // { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          // { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },
          // { prop: 'afterSaleExpDate', label: '售后服务到期时间', type: '资产信息' },
          // { prop: 'remark', label: '备注', type: '资产信息' },
        ],
        1097756019326977: [ // 存储设备
          { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          { prop: 'procureType', label: '采购方式', type: '资产信息' },
          { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          { prop: 'maker', label: '制造商', type: '硬件配置' },  
          { prop: 'brand', label: '品牌', type: '硬件配置' },
          { prop: 'series', label: '系列', type: '硬件配置' },
          { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          {prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},
          { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },


          // { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          // { prop: 'fullName', label: '标准全称', type: '硬件配置' },
          // { prop: 'maker', label: '制造商', type: '硬件配置' },
          // { prop: 'brand', label: '品牌', type: '硬件配置' },
          // { prop: 'series', label: '系列', type: '硬件配置' },
          // { prop: 'deviceModel', label: '型号', type: '硬件配置' },
          // { prop: 'storageCapacity', label: '存储容量', type: '硬件配置' },
          // { prop: 'memSize', label: '内存大小', type: '硬件配置' },
          // { prop: 'isCloudMange', label: '是否纳入云管', type: '资产信息' },
          // { prop: 'residualValueAssetRenewal', label: '残值处理及资产更新方案', type: '资产信息' },
          // { prop: 'procureType', label: '采购方式', type: '资产信息' },
          // { prop: 'netWorth', label: '净值', type: '资产信息' },
          // { prop: 'assetOriginal', label: '资产原值', type: '资产信息' },
          // { prop: 'serviceExpDate', label: '服务到期日期', type: '资产信息' },
          // { prop: 'afterSaleExpDate', label: '售后服务到期时间', type: '资产信息' },
          // { prop: 'powerModel', label: '电源模块(个)', type: '硬件配置' },
          // { prop: 'ratedPower', label: '额定功率(W)', type: '硬件配置' },
          // { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          // { prop: 'useTo', label: '用途', type: '资产信息' },
          // { prop: 'remark', label: '备注', type: '资产信息' },
        ],
        1097755012694017: [ // 主机设备
        
          {prop: 'fullName', label: '标准全称', type: '硬件配置'},  
          {prop: 'procureType', label: '采购方式', type: '资产信息'}, 
          {prop: 'sn', label: '出厂序列号', type: '资产信息'},   
          { prop: 'maker', label: '制造商', type: '硬件配置' },  
          {prop: 'brand', label: '品牌', type: '资产信息'},
          {prop: 'series', label: '系列', type: '资产信息'},
          {prop: 'deviceModel', label: '型号', type: '资产信息'},
          {prop: 'deviceAddType', label: '设备增加方式', type: '资产信息'},
          {prop: 'factoryDate', label: '出厂日期', type: '资产信息'},
          {prop: 'serviceExpDate', label: '服务到期时间', type: '资产信息'},
          {prop: 'cpuCoreSize', label: 'CPU核数', type: '资产信息'},
          {prop: 'cpuArch', label: 'CPU架构', type: '资产信息'},
          {prop: 'cpuBrand', label: 'CPU品牌', type: '资产信息'},
          {prop: 'memSize', label: '内存大小（GB）', type: '硬件配置'},

          
          // { prop: 'hostName', label: '主机名称', type: '资产信息' },
          // { prop: 'fullName', label: '标准全称', type: '资产信息' },
          // { prop: 'sn', label: '出厂序列号', type: '资产信息' },
          // { prop: 'factoryDate', label: '出厂日期', type: '资产信息' },
          // { prop: 'maker', label: '制造商', type: '硬件配置' },
          // { prop: 'brand', label: '品牌', type: '资产信息' },
          // { prop: 'series', label: '系列', type: '资产信息' },
          // { prop: 'deviceModel', label: '型号', type: '资产信息' },
          // { prop: 'isITAI', label: '是否信创设备', type: '资产信息' },
          // { prop: 'isCloudMange', label: '是否纳入云管', type: '资产信息' },
          // { prop: 'cpuBrand', label: 'CPU品牌', type: '资产信息' },
          // { prop: 'cpuCoreSize', label: 'CPU核数', type: '资产信息' },
          // { prop: 'cpuModel', label: 'CPU型号', type: '资产信息' },
          // { prop: 'cpuFrequecy', label: 'CPU主频', type: '资产信息' },
          // { prop: 'cpuArch', label: 'CPU架构', type: '资产信息' },
          // { prop: 'cpuSize', label: 'CPU数量', type: '资产信息' },
          // { prop: 'cpuInfo', label: 'CPU信息', type: '资产信息' },
          // { prop: 'hardDiskType', label: '硬盘类型', type: '资产信息' },
          // { prop: 'hddInfor', label: '硬盘信息', type: '资产信息' },
          // { prop: 'hddNum', label: '硬盘数量', type: '资产信息' },
          // { prop: 'hardDiskCapability', label: '硬盘容量（GB）', type: '硬件配置' },
          // { prop: 'memoryCardSize', label: '内存条数量（个）', type: '硬件配置' },
          // { prop: 'memSize', label: '内存大小（GB）', type: '硬件配置' },
          // { prop: 'virtMemerySize', label: '虚拟内存大小', type: '硬件配置' },
          // { prop: 'raidStorageType', label: '存储RAID冗余方式', type: '硬件配置' },
          // { prop: 'hbaCardWWN', label: 'HBA卡WWN', type: '硬件配置' },
          // { prop: 'hbaCardSize', label: 'HBA卡数（个）', type: '硬件配置' },
          // { prop: 'opticalPortNum', label: '光端口数量', type: '硬件配置' },
          // { prop: 'netPortType', label: '网口类型', type: '硬件配置' },
          // { prop: 'netPortNum', label: '网口数量', type: '硬件配置' },
          // { prop: 'networkCardSize', label: '网卡数（个）', type: '硬件配置' },
          // { prop: 'powerInfo', label: '电源信息', type: '硬件配置' },
          // { prop: 'powerModel', label: '电源模块（个）', type: '硬件配置' },



          // { prop: 'procureType', label: '采购方式', type: '资产信息' },
          // { prop: 'assetOriginal', label: '资产原值', type: '资产信息' },
          // { prop: 'netWorth', label: '净值', type: '资产信息' },
          // { prop: 'residualValueAssetRenewal', label: '残值处理及资产更新方案', type: '资产信息' },
          // { prop: 'serviceExpDate', label: '服务到期时间', type: '资产信息' },
          // { prop: 'afterSaleExpDate', label: '售后服务到期时间', type: '资产信息' },

          // { prop: 'remark', label: '备注', type: '资产信息' },
        ],
      },

      maintenanceCountryList: [],
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      deviceStatusList: [],

      searchForm: {
        currentPage: 1,
        pageSize: 20
      },
      dataList: [],
      selectionList: [],
      total: 0,
      tableLoading: false, //表格加载
      tableHeight: "600px",
    }
  },
  computed: {
    propertyInfo(){
      return this.tableArr.filter(el => el.type == '资产信息')
    },
    hardwareInfo(){
      return this.tableArr.filter(el => el.type == '硬件配置')
    },

  },
  mounted() {
    // this.getList()
    // erpState ERP同步状态
    // is_to_i6000 I6000同步状态

    // 加载字典
    //ERP同步状态
    this.getDictList("erpState");
    //I6000同步状态
    this.getDictList("is_to_i6000");
    this.getDictCmdbList('1103423111233536') // 设备状态
    // this.getDictCmdbList('1082554947272704') // 品牌
    // this.getDictCmdbList('1082609011851264') // 系列
    // this.getDictCmdbList('1082608047161344') // 型号
    // this.getDictCmdbList('1083979207081984') // 国家及地区
  },
  methods: {
    doLayout(){
      this.$refs.dataTable.doLayout()
    },
    getList() {
      this.tableArr = this.allTemplate[this.deviceCategory]
      // this.dataList.push(...this.infoList)
      this.dataList = JSON.parse(JSON.stringify(this.infoList))

      this.$refs.dataTable.doLayout()
    },
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection.map(item => item.id);
    },
    getDictList(code){
      //加载字典
      return getDictList(code).then(res => {
        if(code==='erpState'){
          this.syncErpStatusList  = res.data;
        }else if(code==='is_to_i6000'){
          this.syncI6000StatusList = res.data;
        }
      });
    },
    getDictCmdbList(ciId){
      //加载字典
      getDictCmdbList({ ciId: ciId }).then(res => {
        if(ciId==='1103423111233536'){ // 设备状态
          this.deviceStatusList  = res.data;
        }else if(ciId==='1082554947272704'){ // 品牌
          this.brandList  = res.data;
        }else if(ciId==='1082609011851264'){ // 系列
          this.seriesList  = res.data;
        }else if(ciId==='1082608047161344'){ // 型号
          this.deviceModelList = res.data;
        }else if(ciId==='1083979207081984'){ // 国家及地区
          this.maintenanceCountryList = res.data;
        }
      });
    },
    showDictLable(code,dictList){
      //字典回显
      if(dictList!=null && code!==''){
        let items = dictList.filter(item => item.dictKey==code);
        if(items!=null && items.length>0){
          return items[0].dictValue;
        }
      }
      return code;
    },

  },
  watch:{
    infoList: {
      handler(newValue, oldValue) {
        this.getList()
      },
      deep: true,
      // immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .tableItem{
    text-align: left;
    p{
      margin: 0;
      line-height: 20px;
    }

  }
</style>
