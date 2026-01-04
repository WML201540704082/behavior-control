<template>
  <div>
    <el-dialog :close-on-click-modal="false" :before-close="() => $emit('close')" :show-close="true" append-to-body
               :visible.sync="isShow" title="台账详情" width="1024px" top="10vh" v-el-drag-dialog>
      <el-form ref="submitForm" :rules="rules" label-suffix=":" label-width="120px" size="small">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="基本信息" name="1">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="设备编码" prop="basicDeviceCode" size="small">
                  <el-input v-model="formDeatil.basicDeviceCode" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备名称" prop="basicDeviceName" clearable>
                  <el-input v-model="formDeatil.basicDeviceName" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="国网编号" prop="basicSgccCode" clearable>
                  <el-input v-model="formDeatil.basicSgccCode" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="一级单位" prop="basicUnitFirst" size="small">
                  <el-select v-model="formDeatil.basicUnitFirst" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="二级单位" prop="basicUnitSecond" clearable>
                  <el-select v-model="formDeatil.basicUnitSecond" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="三级单位" prop="basicUnitThird" clearable>
                  <el-select v-model="formDeatil.basicUnitThird" clearable disabled></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="设备分类" prop="basicDeviceClass" size="small">
                  <el-select v-model="formDeatil.basicDeviceClass" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备类型" prop="basicDeviceType" clearable>
                  <el-select v-model="formDeatil.basicDeviceType" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备状态" prop="basicState" clearable>
                  <el-select v-model="formDeatil.basicState" clearable disabled></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="制造国家" prop="basicMakeCountry" size="small">
                  <el-select v-model="formDeatil.basicMakeCountry" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="制造商" prop="basicMaker" clearable>
                  <el-input v-model="formDeatil.basicMaker" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备品牌" prop="basicBrand" clearable>
                  <el-select v-model="formDeatil.basicBrand" clearable disabled></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="系列" prop="basicSerial" size="small">
                  <el-select v-model="formDeatil.basicSerial" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="型号" prop="basicModel" clearable>
                  <el-select v-model="formDeatil.basicModel" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="投运日期" prop="basicPutDate" clearable>
                  <el-date-picker v-model="formDeatil.basicPutDate" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="用途" prop="basicUsage" size="small">
                  <el-input v-model="formDeatil.basicUsage" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="位置编码" prop="basicLocNo" clearable>
                  <el-input v-model="formDeatil.basicLocNo" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备存放地点" prop="appDevLocation" clearable>
                  <el-input v-model="formDeatil.appDevLocation" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="所属机房" prop="basicCproom" size="small">
                  <el-input v-model="formDeatil.basicCproom" suffix-icon="el-icon-search" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机柜号" prop="basicCabinetNo" clearable>
                  <el-input v-model="formDeatil.basicCabinetNo" suffix-icon="el-icon-search" clearable
                            disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机架号" prop="basicRackNo" clearable>
                  <el-input v-model="formDeatil.basicRackNo" suffix-icon="el-icon-search" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="IP" prop="appIp" size="small">
                  <el-input v-model="formDeatil.appIp" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="MAC地址" prop="appMac" clearable>
                  <el-input v-model="formDeatil.appMac" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属网络" prop="appNetwork" clearable>
                  <el-select v-model="formDeatil.appNetwork" clearable disabled></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="备注" prop="basicRemark" size="small">
                  <el-input v-model="formDeatil.basicRemark" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="新增时间" prop="devTTimeInsert" clearable>
                  <el-date-picker v-model="formDeatil.devTTimeInsert" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="更新时间" prop="devTTimeUpdate" clearable>
                  <el-date-picker v-model="formDeatil.devTTimeUpdate" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="实物ID" prop="entityId" size="small">
                  <el-input v-model="formDeatil.entityId" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="盘点日期" prop="checkDate" clearable>
                  <el-date-picker v-model="formDeatil.checkDate" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出厂编号" prop="piFactoryNumber" clearable>
                  <el-input v-model="formDeatil.hardwareContract.piFactoryNumber" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="认证交换机" prop="swIp" size="small">
                  <el-input v-model="formDeatil.swIp" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="交换机端口" prop="swPort" clearable>
                  <el-date-picker v-model="formDeatil.swPort" style="width: 100%" clearable disabled></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最近认证交换机" prop="recentSwIp" clearable>
                  <el-input v-model="formDeatil.recentSwIp" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="采购信息" name="2">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="采购方式" prop="piMethod" size="small">
                  <el-select v-model="formDeatil.hardwareContract.piMethod" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备增加方式" prop="piDevAddMethod" clearable>
                  <el-select v-model="formDeatil.hardwareContract.piDevAddMethod" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备变动方式" prop="piDevExchangeMethod" clearable>
                  <el-select v-model="formDeatil.hardwareContract.piDevExchangeMethod" clearable disabled></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="资产性质" prop="piAssetsProperties" size="small">
                  <el-select v-model="formDeatil.hardwareContract.piAssetsProperties" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="资产原值(元)" prop="piAssetsInitialValue" clearable>
                  <el-input v-model="formDeatil.hardwareContract.piAssetsInitialValue" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产权归属" prop="piPropertyOwnership" clearable>
                  <el-input v-model="formDeatil.hardwareContract.piPropertyOwnership" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="采购合同编号" prop="piContractCode" size="small">
                  <el-input v-model="formDeatil.hardwareContract.piContractCode" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购日期" prop="piOrderDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareContract.piOrderDate" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商" prop="piSuppliers" clearable>
                  <el-input v-model="formDeatil.hardwareContract.piSuppliers" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="供应商联系人" prop="piSuppliersContact" size="small">
                  <el-input v-model="formDeatil.hardwareContract.piSuppliersContact" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商联电话" prop="piSuppliersPhone" clearable>
                  <el-date-picker v-model="formDeatil.hardwareContract.piSuppliersPhone" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出厂编号" prop="piFactoryNumber" clearable>
                  <el-input v-model="formDeatil.hardwareContract.piFactoryNumber" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="出厂日期" prop="piFactoryDate" clearable>
                  <el-input v-model="formDeatil.hardwareContract.piFactoryDate" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="服务信息" name="3">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="售后服务到期时间" prop="siExpirationDate" size="small">
                  <el-date-picker v-model="formDeatil.hardwareService.siExpirationDate" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务合同编号" prop="siContractCode" clearable>
                  <el-select v-model="formDeatil.hardwareService.siContractCode" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务商" prop="siServicer" clearable>
                  <el-select v-model="formDeatil.hardwareService.siServicer" clearable disabled></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="服务级别" prop="siServiceClass" size="small">
                  <el-input v-model="formDeatil.hardwareService.siServiceClass" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务开始日期" prop="siStartDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareService.siStartDate" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务到期日期" prop="siEndDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareService.siEndDate" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="服务商联系人" prop="siServicerContact" size="small">
                  <el-input v-model="formDeatil.hardwareService.siServicerContact" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务商联系电话" prop="siServicerPhone" clearable>
                  <el-input v-model="formDeatil.hardwareService.siServicerPhone" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审核状态" prop="siEndDate" clearable>
                  <el-select v-model="formDeatil.hardwareService.siAuditStatus" clearable disabled></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="最后审核日期" prop="siEndDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareService.siAuditLastdate" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="维护信息" name="4">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="领用人" prop="miUser" size="small">
                  <el-input v-model="formDeatil.hardwareUse.miUser" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="领用部门" prop="miUseDep" clearable>
                  <el-select v-model="formDeatil.hardwareUse.miUseDep" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="领用日期" prop="miUseDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareUse.miUseDate" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="领用身份证" prop="miUseIdcard" size="small">
                  <el-input v-model="formDeatil.hardwareUse.miUseIdcard" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="领用班组" prop="miUseGroup" clearable>
                  <el-input v-model="formDeatil.hardwareUse.miUseGroup" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="领用手机号" prop="miUsePhone" clearable>
                  <el-input v-model="formDeatil.hardwareUse.miUsePhone" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="应用与配置信息" name="5">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="应用层级" prop="appHierarchy" size="small">
                  <el-select v-model="formDeatil.hardwareApp.appHierarchy" clearable disabled></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="部署应用系统" prop="appDeployment" clearable>
                  <el-input v-model="formDeatil.hardwareApp.appDeployment" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="应用类型" prop="appType" clearable>
                  <el-select v-model="formDeatil.hardwareApp.appType" clearable disabled></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="存储空间(MB)" prop="appStorageSpace" size="small">
                  <el-input v-model="formDeatil.hardwareApp.appStorageSpace" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="硬盘容量" prop="appHarddiskSpace" clearable>
                  <el-input v-model="formDeatil.hardwareApp.appHarddiskSpace" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="硬盘类型" prop="appHarddiskType" clearable>
                  <el-select v-model="formDeatil.hardwareApp.appHarddiskType" clearable disabled></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="硬盘数量" prop="appHarddiskCount" size="small">
                  <el-input v-model="formDeatil.hardwareApp.appHarddiskCount" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="硬盘尺寸" prop="appHarddiskSize" clearable>
                  <el-input v-model="formDeatil.hardwareApp.appHarddiskSize" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="硬盘信息" prop="appDiskInfo" clearable>
                  <el-input v-model="formDeatil.hardwareApp.appDiskInfo" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="内存信息" prop="memoryInfo" size="small">
                  <el-input v-model="formDeatil.hardwareApp.memoryInfo" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="主板信息" prop="motherboardInfo" clearable>
                  <el-input v-model="formDeatil.hardwareApp.motherboardInfo" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="网卡信息" prop="networkCardInfo" clearable>
                  <el-input v-model="formDeatil.hardwareApp.networkCardInfo" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="备案信息" name="6">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="设备编码" prop="basicDeviceCode" size="small">
                  <el-input v-model="formDeatil.hardwareRecord.basicDeviceCode" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备版本" prop="devVersion" clearable>
                  <el-input v-model="formDeatil.hardwareRecord.devVersion" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备管理部门" prop="fiDevmanageDep" clearable>
                  <el-select v-model="formDeatil.hardwareRecord.fiDevmanageDep" clearable disabled></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="备案MAC地址" prop="fiMac" size="small">
                  <el-input v-model="formDeatil.hardwareRecord.fiMac" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="备案机柜/机架号" prop="fiRackNo" clearable>
                  <el-input v-model="formDeatil.hardwareRecord.devVersion" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="检测平台" prop="fiMonitorPlatform" clearable>
                  <el-input v-model="formDeatil.hardwareRecord.fiMonitorPlatform" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="安全设备功能" prop="fiSafetyFunction" size="small">
                  <el-input v-model="formDeatil.hardwareRecord.fiSafetyFunction" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="安全运维人员" prop="fiSafetyStaff" clearable>
                  <el-input v-model="formDeatil.hardwareRecord.fiSafetyStaff" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="漏洞扫描时间" prop="fiScanDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareRecord.fiScanDate" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="所属安全边界" prop="fiSecurityBoundary" size="small">
                  <el-input v-model="formDeatil.hardwareRecord.fiSecurityBoundary" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="安全管理部门" prop="fiSefemanageDep" clearable>
                  <el-input v-model="formDeatil.hardwareRecord.fiSefemanageDep" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="督查部门" prop="fiSupervisionDep" clearable>
                  <el-date-picker v-model="formDeatil.hardwareRecord.fiSupervisionDep" style="width: 100%" clearable
                                  disabled></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="病毒库更新时间" prop="fiViruslibUpdateDate" size="small">
                  <el-input v-model="formDeatil.hardwareRecord.fiViruslibUpdateDate" clearable disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <div class="form-btn">
          <el-button type="primary" plain @click="$emit('close')">关 闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  props: ['isShow', 'formDeatil'],
  data() {
    return {
      userName: '',
      comment: '',
      loading: false,
      nextProcess: {},
      activeName: '1', //默认打开第一个选项卡
      // 表单校验
      rules: {
        basicDeviceName: [{required: true}],
        basicUnitSecond: [{required: true}],
        basicUnitThird: [{required: true}],
        basicDeviceClass: [{required: true}],
        basicDeviceType: [{required: true}],
        basicState: [{required: true}],
        piMethod: [{required: true}]
      },
    }
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"])
  },
  mounted() {

  },
  methods: {
    getNextInfo() {

    },
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-collapse-item__content {
  padding-top: 25px;
}

/deep/ .el-collapse-item__header {
  font-weight: bold;
}
</style>

