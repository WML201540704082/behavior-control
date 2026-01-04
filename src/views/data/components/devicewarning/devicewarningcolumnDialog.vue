<template>
  <div>
    <el-dialog :close-on-click-modal="false"
               :before-close="() => $emit('close')"
               :show-close="true"
               append-to-body
               :visible.sync="isShow"
               title="台账详情"
               width="1024px"
               top="10vh"
               v-el-drag-dialog>
      <el-form ref="submitForm" :model="formDeatil" :rules="rules" label-width="120px" label-suffix=":" size="small">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="基本信息" name="1">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="设备编码" prop="basicDeviceCode" size="small">
                  <el-input v-model="formDeatil.basicDeviceCode" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备名称" prop="basicDeviceName" clearable>
                  <el-input v-model="formDeatil.basicDeviceName" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="国网编号" prop="basicSgccCode" clearable>
                  <el-input v-model="formDeatil.basicSgccCode" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="一级单位" prop="basicUnitFirst" size="small">
                  <el-select v-model="formDeatil.basicUnitFirst" clearable :disabled="dis"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="二级单位" prop="basicUnitSecond" clearable>
                  <el-select v-model="formDeatil.basicUnitSecond" clearable :disabled="dis"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="三级单位" prop="basicUnitThird" clearable>
                  <el-select v-model="formDeatil.basicUnitThird" clearable :disabled="dis"></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="设备分类" prop="basicDeviceClass" size="small">
                  <el-select v-model="formDeatil.basicDeviceClass" clearable :disabled="dis">
                    <el-option v-for="(item, index) in sbflList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备类型" prop="basicDeviceType" clearable>
                  <el-select v-model="formDeatil.basicDeviceType" clearable :disabled="dis">
                    <el-option v-for="(item, index) in sblxList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备状态" prop="basicState" clearable>
                  <el-select v-model="formDeatil.basicState" clearable :disabled="dis">
                    <el-option v-for="(item, index) in sbztList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="制造国家" prop="basicMakeCountry" size="small">
                  <el-select v-model="formDeatil.basicMakeCountry" clearable :disabled="dis">
                    <el-option v-for="(item, index) in zzgjList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="制造商" prop="basicMaker" clearable>
                  <el-select v-model="formDeatil.basicMaker" clearable :disabled="dis">
                    <el-option v-for="(item, index) in zzsList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="品牌" prop="basicBrand" clearable>
                  <el-select v-model="formDeatil.basicBrand" clearable :disabled="dis">
                    <el-option v-for="(item, index) in ppList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="系列" prop="basicSerial" size="small">
                  <el-select v-model="formDeatil.basicSerial" clearable :disabled="dis">
                    <el-option v-for="(item, index) in xlList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="型号" prop="basicModel" clearable>
                  <el-select v-model="formDeatil.basicModel" clearable :disabled="dis">
                    <el-option v-for="(item, index) in xhList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="投运日期" prop="basicPutDate" clearable>
                  <el-date-picker v-model="formDeatil.basicPutDate" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="用途" prop="basicUsage" size="small">
                  <el-input v-model="formDeatil.basicUsage" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="位置编码" prop="basicLocNo" clearable>
                  <el-input v-model="formDeatil.basicLocNo" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备存放地点" prop="appDevLocation" clearable>
                  <el-input v-model="formDeatil.appDevLocation" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="所属机房" prop="basicCproom" size="small">
                  <el-input v-model="formDeatil.basicCproom" suffix-icon="el-icon-search" clearable
                            :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机柜号" prop="basicCabinetNo" clearable>
                  <el-input v-model="formDeatil.basicCabinetNo" suffix-icon="el-icon-search" clearable
                            :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机架号" prop="basicRackNo" clearable>
                  <el-input v-model="formDeatil.basicRackNo" suffix-icon="el-icon-search" clearable
                            :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="IP" prop="appIp" size="small">
                  <el-input v-model="formDeatil.appIp" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="MAC地址" prop="appMac" clearable>
                  <el-input v-model="formDeatil.appMac" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属网络" prop="appNetwork" clearable>
                  <el-select v-model="formDeatil.appNetwork" clearable :disabled="dis">
                    <el-option v-for="(item, index) in sswlList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="备注" prop="basicRemark" size="small">
                  <el-input v-model="formDeatil.basicRemark" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="新增时间" prop="devTTimeInsert" clearable>
                  <el-date-picker v-model="formDeatil.devTTimeInsert" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="更新时间" prop="devTTimeUpdate" clearable>
                  <el-date-picker v-model="formDeatil.devTTimeUpdate" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="实物ID" prop="entityId" size="small">
                  <el-input v-model="formDeatil.entityId" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="盘点日期" prop="checkDate" clearable>
                  <el-date-picker v-model="formDeatil.checkDate" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出厂编号" prop="piFactoryNumber" clearable>
                  <el-input v-model="formDeatil.hardwareContract.piFactoryNumber" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="认证交换机" prop="swIp" size="small">
                  <el-input v-model="formDeatil.swIp" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="交换机端口" prop="swPort" clearable>
                  <el-date-picker v-model="formDeatil.swPort" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最近认证交换机" prop="recentSwIp" clearable>
                  <el-input v-model="formDeatil.recentSwIp" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="采购信息" name="2">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="采购方式" prop="hardwareContract.piMethod" size="small">
                  <el-select v-model="formDeatil.hardwareContract.piMethod" clearable :disabled="dis">
                    <el-option v-for="(item, index) in cgfsList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备增加方式" prop="piDevAddMethod" clearable>
                  <el-select v-model="formDeatil.hardwareContract.piDevAddMethod" clearable :disabled="dis">
                    <el-option v-for="(item, index) in sbzjfsList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备变动方式" prop="piDevExchangeMethod" clearable>
                  <el-select v-model="formDeatil.hardwareContract.piDevExchangeMethod" clearable :disabled="dis">
                    <el-option v-for="(item, index) in sbbdfsList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="资产性质" prop="piAssetsProperties" size="small">
                  <el-select v-model="formDeatil.hardwareContract.piAssetsProperties" clearable
                             :disabled="dis"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="资产原值(元)" prop="piAssetsInitialValue" clearable>
                  <el-input v-model="formDeatil.hardwareContract.piAssetsInitialValue" clearable
                            :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产权归属" prop="piPropertyOwnership" clearable>
                  <el-input v-model="formDeatil.hardwareContract.piPropertyOwnership" clearable
                            :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="采购合同编号" prop="piContractCode" size="small">
                  <el-input v-model="formDeatil.hardwareContract.piContractCode" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购日期" prop="piOrderDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareContract.piOrderDate" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商" prop="piSuppliers" clearable>
                  <el-input v-model="formDeatil.hardwareContract.piSuppliers" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="供应商联系人" prop="piSuppliersContact" size="small">
                  <el-input v-model="formDeatil.hardwareContract.piSuppliersContact" clearable
                            :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商联电话" prop="piSuppliersPhone" clearable>
                  <el-date-picker v-model="formDeatil.hardwareContract.piSuppliersPhone" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出厂编号" prop="piFactoryNumber" clearable>
                  <el-input v-model="formDeatil.hardwareContract.piFactoryNumber" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="出厂日期" prop="hardwareContract.piFactoryDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareContract.piFactoryDate" style="width: 100%;" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="服务信息" name="3">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="售后服务到期时间" prop="siExpirationDate" size="small">
                  <el-date-picker v-model="formDeatil.hardwareService.siExpirationDate" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务合同编号" prop="siContractCode" clearable>
                  <el-input v-model="formDeatil.hardwareService.siContractCode" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务商" prop="siServicer" clearable>
                  <el-input v-model="formDeatil.hardwareService.siServicer" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="服务级别" prop="siServiceClass" size="small">
                  <el-input v-model="formDeatil.hardwareService.siServiceClass" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务开始日期" prop="siStartDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareService.siStartDate" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务到期日期" prop="siEndDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareService.siEndDate" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="服务商联系人" prop="siServicerContact" size="small">
                  <el-input v-model="formDeatil.hardwareService.siServicerContact" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务商联系电话" prop="siServicerPhone" clearable>
                  <el-input v-model="formDeatil.hardwareService.siServicerPhone" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审核状态" prop="siEndDate" clearable>
                  <el-select v-model="formDeatil.hardwareService.siAuditStatus" clearable :disabled="dis">
                    <el-option v-for="(item, index) in shztList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="最后审核日期" prop="siEndDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareService.siAuditLastdate" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="维护信息" name="4">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="领用部门" prop="miUseDep" clearable>
                  <xt-tree-lzay-select :formValue="formDeatil.hardwareUse.miUseDep"
                                       :unit-id="$store.getters.userDetail.ownerUnit"
                                       :selectType="'DEPT'"
                                       @getTreeItem="getOwnerUnit">
                  </xt-tree-lzay-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="领用班组" prop="miUseGroup" clearable>
                  <el-input v-model="formDeatil.hardwareUse.miUseGroup" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="领用日期" prop="miUseDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareUse.miUseDate" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="领用人" prop="miUser" size="small">
                  <el-input v-model="formDeatil.hardwareUse.miUser" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="领用身份证" prop="miUseIdcard" size="small">
                  <el-input v-model="formDeatil.hardwareUse.miUseIdcard" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="领用手机号" prop="miUsePhone" clearable>
                  <el-input v-model="formDeatil.hardwareUse.miUsePhone" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="应用与配置信息" name="5">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="应用层级" prop="appHierarchy" size="small">
                  <el-select v-model="formDeatil.hardwareApp.appHierarchy" clearable :disabled="dis"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="部署应用系统" prop="appDeployment" clearable>
                  <el-input v-model="formDeatil.hardwareApp.appDeployment" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="应用类型" prop="appType" clearable>
                  <el-select v-model="formDeatil.hardwareApp.appType" clearable :disabled="dis">
                    <el-option v-for="(item, index) in yylxList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="存储空间(MB)" prop="appStorageSpace" size="small">
                  <el-input v-model="formDeatil.hardwareApp.appStorageSpace" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="硬盘容量" prop="appHarddiskSpace" clearable>
                  <el-input v-model="formDeatil.hardwareApp.appHarddiskSpace" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="硬盘类型" prop="appHarddiskType" clearable>
                  <el-select v-model="formDeatil.hardwareApp.appHarddiskType" clearable :disabled="dis">
                    <el-option v-for="(item, index) in yplxList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="硬盘数量" prop="appHarddiskCount" size="small">
                  <el-input v-model="formDeatil.hardwareApp.appHarddiskCount" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="硬盘尺寸" prop="appHarddiskSize" clearable>
                  <el-input v-model="formDeatil.hardwareApp.appHarddiskSize" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="硬盘信息" prop="appDiskInfo" clearable>
                  <el-input v-model="formDeatil.hardwareApp.appDiskInfo" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="内存信息" prop="memoryInfo" size="small">
                  <el-input v-model="formDeatil.hardwareApp.memoryInfo" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="主板信息" prop="motherboardInfo" clearable>
                  <el-input v-model="formDeatil.hardwareApp.motherboardInfo" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="网卡信息" prop="networkCardInfo" clearable>
                  <el-input v-model="formDeatil.hardwareApp.networkCardInfo" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="备案信息" name="6">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="设备编码" prop="basicDeviceCode" size="small">
                  <el-input v-model="formDeatil.hardwareRecord.basicDeviceCode" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备版本" prop="devVersion" clearable>
                  <el-input v-model="formDeatil.hardwareRecord.devVersion" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备管理部门" prop="fiDevmanageDep" clearable>
                  <el-select v-model="formDeatil.hardwareRecord.fiDevmanageDep" clearable :disabled="dis">
                    <el-option v-for="(item, index) in sbglbmList" :key="item.dictKey" :label="item.dictValue" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="备案MAC地址" prop="fiMac" size="small">
                  <el-input v-model="formDeatil.hardwareRecord.fiMac" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="备案机柜/机架号" prop="fiRackNo" clearable>
                  <el-input v-model="formDeatil.hardwareRecord.devVersion" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="检测平台" prop="fiMonitorPlatform" clearable>
                  <el-input v-model="formDeatil.hardwareRecord.fiMonitorPlatform" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="安全设备功能" prop="fiSafetyFunction" size="small">
                  <el-input v-model="formDeatil.hardwareRecord.fiSafetyFunction" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="安全运维人员" prop="fiSafetyStaff" clearable>
                  <el-input v-model="formDeatil.hardwareRecord.fiSafetyStaff" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="漏洞扫描时间" prop="fiScanDate" clearable>
                  <el-date-picker v-model="formDeatil.hardwareRecord.fiScanDate" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="所属安全边界" prop="fiSecurityBoundary" size="small">
                  <el-input v-model="formDeatil.hardwareRecord.fiSecurityBoundary" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="安全管理部门" prop="fiSefemanageDep" clearable>
                  <el-input v-model="formDeatil.hardwareRecord.fiSefemanageDep" clearable :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="督查部门" prop="fiSupervisionDep" clearable>
                  <el-date-picker v-model="formDeatil.hardwareRecord.fiSupervisionDep" style="width: 100%" clearable
                                  :disabled="dis"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="病毒库更新时间" prop="fiViruslibUpdateDate" size="small">
                  <el-input v-model="formDeatil.hardwareRecord.fiViruslibUpdateDate" clearable
                            :disabled="dis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>

        <devicewarningcolumn :basicId="basicId"
                             :editHandel="editHandel">
        </devicewarningcolumn>

        <div class="form-btn d_end">
          <el-button type="primary" error @click="update" :disabled="dis">更 新</el-button>
          <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
        </div>
      </el-form>


    </el-dialog>

  </div>
</template>

<script>
import devicewarningcolumn from "@/views/data/components/devicewarning/devicewarningcolumn.vue";
import {mapGetters} from "vuex";
import {update} from "@/api/data/hardwarebasic";
import {getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import {targetciSearch} from "@/api/system/ciModel";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";

export default {
  props: ['isShow', 'formDeatil', 'basicId'],
  components: {
    devicewarningcolumn,
    xtTreeLzaySelect
  },
  data() {
    return {
      userName: '',
      comment: '',
      dis: true,

      loading: false,
      nextProcess: {},
      activeName: '0', //默认打开第一个选项卡
      // 表单校验
      rules: {
        // basicDeviceName: [{required: true, message: '设备名称不能为空', trigger: 'blur'}],
        // basicUnitSecond: [{required: true, message: '二级单位不能为空', trigger: 'blur'}],
        // basicUnitThird: [{required: true, message: '三级单位不能为空', trigger: 'blur'}],
        // basicDeviceClass: [{required: true, message: '设备分类不能为空', trigger: 'blur'}],
        // basicDeviceType: [{required: true, message: '设备类型不能为空', trigger: 'blur'}],
        // basicState: [{required: true, message: '设备状态不能为空', trigger: 'blur'}],
        // 'hardwareContract.piMethod': [{required: true, message: '采购方式不能为空', trigger: 'blur'}],
        //
        // 'hardwareContract.piFactoryDate': [{required: true, message: '出场日期不能为空', trigger: 'blur'}],
      },

      sbflList: [],
      sblxList: [],
      sbztList: [],
      zzgjList: [],
      sswlList: [],

      cgfsList: [],
      sbzjfsList: [],
      sbbdfsList: [],
      shztList: [],
      yylxList: [],
      yplxList: [],
      sbglbmList: [],

      zzsList: [],
      ppList: [],
      xlList: [],
      xhList: [],
    }
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"])
  },
  watch: {
    //设备分类改变的时候加载设备类型
    'formDeatil.basicDeviceClass'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        this.formDeatil.basicDeviceType = null;
        //加载设备类型
        let item = this.sbflList.find(a => a.dictValue === this.formDeatil.basicDeviceClass);
        if (item) {
          //加载设备类型
          getDictCmdbListPid({ciId: '1097745969774592', pid: item.dictKey}).then(res => {
            this.sblxList = res.data;
          })
        }
      }
    },
    'formDeatil.basicMaker'(newVal, oldVal) {
      //制造商改变加载品牌
      if (!this.isEmpty(newVal)) {
        if (!this.isEmpty(oldVal)) {
          //非首次加载，手动改变
          this.formDeatil.basicBrand = null;
          this.formDeatil.basicSerial = null;
          this.formDeatil.basicModel = null;

          this.ppList = [];
          this.xlList = [];
          this.xhList = [];
        }

        let item = this.zzsList.find(a => a.dictValue === this.formDeatil.basicMaker);
        if (item) {
          //加载品牌
          getDictCmdbListPid({ciId: '1082554947272704', pid: item.dictKey}).then(res => {
            this.ppList = res.data;
          })
        }
      }
    },
    'formDeatil.basicBrand'(newVal, oldVal) {
      //品牌改变加载系列
      if (!this.isEmpty(newVal)) {
        if (!this.isEmpty(oldVal)) {
          //非首次加载，手动改变
          this.formDeatil.basicSerial = null;
          this.formDeatil.basicModel = null;

          this.xlList = [];
          this.xhList = [];
        }
        let item = this.ppList.find(a => a.dictValue === this.formDeatil.basicBrand);
        if (item) {
          //加载系列
          getDictCmdbListPid({ciId: '1082609011851264', pid: item.dictKey}).then(res => {
            this.xlList = res.data;
          })
        }
      }
    },
    'formDeatil.basicSerial'(newVal, oldVal) {
      //系列改变加载型号
      if (!this.isEmpty(newVal)) {
        if (!this.isEmpty(oldVal)) {
          //非首次加载，手动改变
          this.formDeatil.basicModel = null;
          this.xhList = [];
        }

        let item = this.xlList.find(a => a.dictValue === this.formDeatil.basicSerial);
        if (item) {
          //加载系列
          getDictCmdbListPid({ciId: '1082608047161344', pid: item.dictKey}).then(res => {
            this.xhList = res.data;
          })
        }
      }
    },
  },
  mounted() {
    //this.testData();
    this.requestDict();
  },
  methods: {
    requestDict() {
      //获取设备分类
      getDictCmdbListPid({ciId: '1097745625841664'}).then(res => {
        this.sbflList = res.data;
        if (this.sbflList) {
          //根据设备分类
          let item = this.sbflList.find(a => a.dictValue === this.formDeatil.basicDeviceClass);
          if (item) {
            //加载设备类型
            getDictCmdbListPid({ciId: '1097745969774592', pid: item.dictKey}).then(res => {
              this.sblxList = res.data;
            })
          }
        }
      });

      //获取设备状态
      targetciSearch({attrId: '1130559847071744', currentPage: 1, pageSize: 999, keyword: ''}).then(res => {
        this.sbztList = res.Return;
      });
      //制造国家
      getDictCmdbList({ciId: '1083979207081984'}).then(res => {
        this.zzgjList = res.data;
      });
      //所属网络
      getDictCmdbList({ciId: '1107942968721408'}).then(res => {
        this.sswlList = res.data;
      });

      //采购方式
      targetciSearch({attrId: '1131258181910528', currentPage: 1, pageSize: 999, keyword: ''}).then(res => {
        this.cgfsList = res.Return;
      });
      //设备增加方式
      getDictCmdbList({ciId: '1083864635473920'}).then(res => {
        this.sbzjfsList = res.data;
      });
      //设备变动方式
      getDictCmdbList({ciId: '1083948487999488'}).then(res => {
        this.sbbdfsList = res.data;
      });

      //审核状态
      getDictCmdbList({ciId: '1131067534016512'}).then(res => {
        this.shztList = res.data;
      });
      // 应用类型
      getDictCmdbList({ciId: '1131174010617856'}).then(res => {
        this.yylxList = res.data;
      });
      // 硬盘类型
      getDictCmdbList({ciId: '1107947020419072'}).then(res => {
        this.yplxList = res.data;
      });
      // 设备管理部门
      getDictCmdbList({ciId: '1131150480572416'}).then(res => {
        this.sbglbmList = res.data;
      });

      // 制造商
      getDictCmdbList({ciId: '1082610161090560'}).then(res => {
        this.zzsList = res.data;
        let item1 = this.zzsList.find(a => a.dictValue === this.formDeatil.basicMaker);
        if (item1) {
          //加载品牌
          getDictCmdbListPid({ciId: '1082554947272704', pid: item1.dictKey}).then(res => {
            this.ppList = res.data;
            let item2 = this.ppList.find(a => a.dictValue === this.formDeatil.basicBrand);
            if (item2) {
              //加载系列
              getDictCmdbListPid({ciId: '1082609011851264', pid: item2.dictKey}).then(res => {
                this.xlList = res.data;

                let item3 = this.xlList.find(a => a.dictValue === this.formDeatil.basicSerial);
                if (item3) {
                  //加载系列
                  getDictCmdbListPid({ciId: '1082608047161344', pid: item3.dictKey}).then(res => {
                    this.xhList = res.data;
                  })
                }
              })
            }

          })
        }
      });
    },

    editHandel() {
      this.dis = false;
      this.activeName = '1';
    },
    update() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          update(this.formDeatil).then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$emit('refreshDataList')
            this.$emit('close')
          });
        } else {
          this.$message({
            type: "error",
            message: "存在未必输项!"
          });
        }
      });
    },
    getOwnerUnit(val, itemJ) {
      this.formDeatil.hardwareUse.miUseDep = val.fullName;
    },

    isEmpty(value) {
      if (value === '' || value == null) {
        return true;
      }
      return false;
    },

    // testData() {
    //   //测试数据
    //   if (process.env.NODE_ENV == 'development') {
    //     this.formDeatil.basicDeviceClass = '基础设施';
    //     this.formDeatil.basicMaker = '迪讯信息技术有限公司';
    //     this.formDeatil.basicBrand = '迪讯';
    //     this.formDeatil.basicSerial = 'CNS';
    //     this.formDeatil.basicModel = 'CNS-1500';
    //   }
    // },
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

.d_end {
  display: flex;
  justify-content: flex-end;
  padding-right: 24px;
}

.d_end button {
  width: 100px;
}
</style>

