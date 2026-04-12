<template>
  <div class="wrap">
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="beforeCloseHandler"
      :visible.sync="isShow"
      append-to-body
      title="编辑"
      width="1100px"
      top="10vh"
      v-el-drag-dialog
    >
      <basic-container>
        <div class="page_form">
          <el-form
            ref="deviceForm"
            :model="deviceForm"
            label-width="110px"
            class="xt_form"
            :rules="rules"
          >
            <el-collapse v-model="activeName">
              <el-collapse-item title="设备基本信息" name="1">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="设备编码" prop="deviceCode" :rules="[{ required: true, message: '设备编码不能为空'}]">
                      <el-input v-model="deviceForm.deviceCode" placeholder="请输入设备编码" clearable disabled></el-input>
                    </el-form-item>
                  </el-col>
<!--                  <el-col :span="8">-->
<!--                    <el-form-item label="ERP资产编码" prop="erpAssetCode">-->
<!--                      <el-input v-model="deviceForm.deviceCodeErp" placeholder="" clearable disabled></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
                  <el-col :span="8">
                    <el-form-item label="标准全称" prop="fullName" :rules="[{ required: true, message: '标准全称不能为空'}]">
                      <el-input v-model="deviceForm.fullName" placeholder="请输入标准全称" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="出厂序列号" prop="sn" :rules="[{ required: true, message: '出厂序列号不能为空'}]">
                      <el-input v-model="deviceForm.sn" placeholder="请输入出厂序列号" clearable></el-input>
                    </el-form-item>
                  </el-col>

                  <!-- <el-col :span="8">
                    <el-form-item label="设备状态" prop="deviceStatusCode">
                      <el-select v-model="deviceForm.deviceStatusCode" clearable placeholder="请选择设备状态">
                        <el-option v-for="dict in deviceStatusList" :key="dict.dictKey" :label="dict.dictValue"
                                  :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备分类" prop="deviceCategoryCode">
                      <el-select v-model="deviceForm.deviceCategoryCode" placeholder="请选择设备分类" clearable disabled>
                        <el-option v-for="dict in deviceCategoryList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item label="制造商" prop="makerCode" :rules="[{ required: true, message: '制造商不能为空'}]">
                      <el-select v-model="deviceForm.makerCode" @change="makerChange" placeholder="请选择制造商" filterable clearable>
                        <el-option v-for="dict in makerList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="品牌" prop="brandCode" :rules="[{ required: true, message: '品牌不能为空'}]">
                      <el-select v-model="deviceForm.brandCode" @change="brandChange" placeholder="请选择品牌" filterable clearable :disabled="!deviceForm.makerCode">
                        <el-option v-for="dict in brandList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- :disabled="!form.brand" -->
                  <el-col :span="8">
                    <el-form-item label="系列" prop="seriesCode" :rules="[{ required: true, message: '系列不能为空'}]">
                      <el-select v-model="deviceForm.seriesCode" @change="seriesChange" placeholder="请输入系列" filterable clearable :disabled="!seriesList.length || !deviceForm.brandCode">
                        <el-option v-for="dict in seriesList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="型号" prop="deviceModelCode" :rules="[{ required: true, message: '型号不能为空'}]">
                      <el-select v-model="deviceForm.deviceModelCode" @change="deviceModelChange" placeholder="请输入型号" filterable clearable :disabled="!deviceForm.seriesCode">
                        <el-option v-for="dict in deviceModelList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="出厂日期" prop="factoryDate" :rules="[{ required: true, message: '出厂日期不能为空'}]">
                      <el-date-picker v-model="deviceForm.factoryDate" value-format="yyyy-MM-dd" type="date" placeholder="请输入出厂日期" clearable></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="投运日期" prop="oprtDate" :rules="[{ required: deviceForm.deviceStatusCode=='1105089449492480' ? true:false, message: '投运日期不能为空'}]" clearable>
                      <el-date-picker v-model="deviceForm.oprtDate" style="width: 100%" clearable></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <template v-if="type=='4'">
                    <el-col :span="8">
                      <el-form-item label="内存大小" prop="memSize" :rules="[{ required: true, message: '内存大小不能为空'}]">
                        <el-input v-model="deviceForm.memSize" placeholder="请输入内存大小" type="number" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="磁盘容量大小" prop="hardDiskPartionSize" :rules="[{ required: true, message: '磁盘容量大小不能为空'}]">
                        <el-input v-model="deviceForm.hardDiskPartionSize" placeholder="请输入磁盘容量大小" type="number" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="CPU品牌" prop="cpuBrandCode" :rules="[{ required: true, message: 'CPU品牌不能为空'}]">
                        <el-select v-model="deviceForm.cpuBrandCode" @change="cpuBrandCodeChange" placeholder="请选择运维等级" clearable filterable>
                          <el-option v-for="dict in cpuBrandList" :key="dict.dictKey" :label="dict.dictValue"
                                    :value="dict.dictKey"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="CPU型号" prop="cpuModel" :rules="[{ required: true, message: 'CPU型号不能为空'}]">
                        <el-input v-model="deviceForm.cpuModel" placeholder="请输入CPU型号" clearable></el-input>
                      </el-form-item>
                    </el-col>
                  </template>
                </el-row>

              </el-collapse-item>
              <el-collapse-item title="领用信息" v-if="type=='1' || type=='4'" name="2">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="领用单位" prop="receiveUnit" disabled>
                      <el-input v-model="deviceForm.receiveUnit" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="领用部门" prop="receiveDept">
                      <!--                  <el-input v-model="deviceForm.receiveDept" disabled></el-input>-->
                      <xt-tree-lzay-select :formValue="deviceForm.receiveDept"
                                           :selectType="'DEPT'"
                                           :unit-id="deviceForm.receiveUnitCode"
                                           @getTreeItem="getEntityDept">

                      </xt-tree-lzay-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="责任人" prop="receivingPerson" :rules="[{ required: true, message: '责任人不能为空'}]">
                      <!-- :disabled="isEdit1" -->
                      <el-input v-model="deviceForm.receivingPerson" placeholder="请输入责任人" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="责任人班组" prop="receivingGroup">
                      <el-input v-model="deviceForm.receivingGroup" placeholder="" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="receivingIDCard" class="vaa" :rules="[{ required: deviceForm.deviceStatusCode=='1105089449492480' ? true:false, message: '责任人身份证号'}]">
                      <template slot="label">
                        <span :class="{ formLabel: true, formLabelReq: deviceForm.deviceStatusCode=='1105089449492480' ? true:false }">责任人<br>身份证号</span>
                      </template>
                      <!-- :disabled="isEdit2" -->
                      <el-input v-model="deviceForm.receivingIDCard" placeholder="请输入领用人身份证" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="receivingTel" class="vaa" :rules="[{ required: deviceForm.deviceStatusCode=='1105089449492480' ? true:false, message: '责任人联系方式'}]">
                      <template slot="label">
                        <span :class="{ formLabel: true, formLabelReq: deviceForm.deviceStatusCode=='1105089449492480' ? true:false }">责任人<br>联系方式</span>
                      </template>
                       <!-- :disabled="isEdit3" -->
                      <el-input v-model="deviceForm.receivingTel" placeholder="请输入领用人联系方式" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="责任人ISC账号" prop="receivePersonUnifiedAcc">
                      <template slot="label">
                        <span class="formLabel">责任人<br>ISC账号</span>
                      </template>
                      <el-input v-model="deviceForm.receivePersonUnifiedAcc" placeholder="请输入责任人ISC账号" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用人" prop="user">
                      <el-input v-model="deviceForm.user" placeholder="请输入使用人" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用人身份证" prop="deviceUserIDCard">
                      <template slot="label">
                        <span class="formLabel">使用人<br>身份证号</span>
                      </template>
                      <el-input v-model="deviceForm.deviceUserIDCard" placeholder="请输入使用人身份证" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用人联系方式" prop="userTel">
                      <template slot="label">
                        <span class="formLabel">使用人<br>联系方式</span>
                      </template>
                      <el-input v-model="deviceForm.userTel" placeholder="请输入使用人联系方式" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="安装地点" prop="installationSite" size="small">
                      <el-input v-model="deviceForm.installationSite" placeholder="请输入安装地点" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <!-- <el-collapse-item title="使用信息" v-show="type=='1'" name="3">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="使用人" prop="user">
                      <el-input v-model="deviceForm.user" placeholder="请输入使用人" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用人身份证" prop="deviceUserIDCard">
                      <template slot="label">
                        <span class="formLabel">使用人<br>身份证号</span>
                      </template>
                      <el-input v-model="deviceForm.deviceUserIDCard" placeholder="请输入使用人身份证" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用人联系方式" prop="userTel">
                      <template slot="label">
                        <span class="formLabel">使用人<br>联系方式</span>
                      </template>
                      <el-input v-model="deviceForm.userTel" placeholder="请输入使用人联系方式" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="安装地点" prop="installationSite" size="small">
                      <el-input v-model="deviceForm.installationSite" placeholder="请输入安装地点" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item> -->
              <el-collapse-item title="维护信息" v-if="type=='1' || type=='4'" name="4">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="运维单位" prop="operationUnit">
                      <el-input v-model="deviceForm.operationUnit" disabled></el-input>
                      <!--                  <xt-tree-select-->
                      <!--                    :treeData="unitList"-->
                      <!--                    :formValue="deviceForm.operationUnit"-->
                      <!--                    :selectType="'CORP'"-->
                      <!--                    @getTreeItem="getOperationUnit"-->
                      <!--                  ></xt-tree-select>-->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运维部门" prop="operationDept">
                      <!--                  <el-input v-model="deviceForm.operationDept" disabled></el-input>-->
                      <xt-tree-lzay-select :formValue="deviceForm.operationDept"
                                           :selectType="'DEPT'"
                                           :unit-id="deviceForm.operationUnitCode"
                                           @getTreeItem="getOperationDept"
                                           :disabled="isOper">

                      </xt-tree-lzay-select>
                      <!--                      <xt-tree-select-->
                      <!--                        :treeData="unitList"-->
                      <!--                        :formValue="deviceForm.operationDept"-->
                      <!--                        :selectType="'DEPT'"-->
                      <!--                        @getTreeItem="getOperationDept"-->
                      <!--                        :disabled="isOper"-->
                      <!--                      ></xt-tree-select>-->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运维责任人" prop="operationPerson" size="small">
                      <el-input v-model="deviceForm.operationPerson" placeholder="请选择运维责任人" clearable :disabled="isOper"></el-input>
                      <!-- <el-select v-model="deviceForm.operationPerson" placeholder="请选择运维责任人" clearable :disabled="isOper">
                        <el-option v-for="dict in userList" :key="dict.realName" :label="dict.realName"
                                  :value="dict.dictKey"></el-option>
                      </el-select> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运维联系电话" prop="operationTel" size="small">
                      <el-input v-model="deviceForm.operationTel" placeholder="请输入运维联系电话" clearable
                                :disabled="isOper"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运维等级" prop="operationLevel" size="small">
                      <el-select v-model="deviceForm.operationLevel" placeholder="请选择运维等级" clearable :disabled="isOper" filterable>
                        <el-option v-for="dict in operationLevelList" :key="dict.dictKey" :label="dict.dictValue"
                                   :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="网络信息" name="5" v-if="type=='2'">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="所属网络" prop="netWorkCode" :rules="[{ required: true, message: '所属网络不能为空'}]">
                      <el-select v-model="deviceForm.netWorkCode" placeholder="请选择所属网络" clearable filterable @change="changeNetWork">
                        <el-option v-for="dict in netWorkCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所属子网" prop="subnetId" ref="bbb" size="small" :rules="[{ required: deviceForm.netWorkCode != '1107943681753089' ? true:false, message: '所属子网不能为空'}]">
                      <el-select v-model="deviceForm.subnetId" placeholder="请选择所属子网" clearable filterable @change="changeSubnet" :disabled="deviceForm.netWorkCode == '1107943681753089'">
                        <el-option v-for="dict in belongIntnetList" :key="dict.id" :label="dict.subnetName"
                                   :value="dict.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="IP地址" prop="IP" ref="aaa" size="small" :rules="[{ required: deviceForm.netWorkCode != '1107943681753089' ? true:false, message: 'IP地址不能为空'}]">
                      <el-select v-model="deviceForm.IP" placeholder="请选择IP地址" clearable filterable  :disabled="deviceForm.netWorkCode == '1107943681753089'">
                        <el-option v-for="dict in ipList" :key="dict.ipId" :lable="dict.ip" :value="dict.ip"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="MAC地址" prop="MAC" size="small">
                      <el-input v-model="deviceForm.MAC" placeholder="请输入MAC地址" clearable disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="认证方式" prop="networkAccessMethod" size="small">
                      <el-select v-model="deviceForm.networkAccessMethod" placeholder="请选择认证方式" clearable filterable>
                        <el-option v-for="dict in networkingMethodList" :key="dict.dictValue" :label="dict.dictValue"
                                   :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- <el-row :gutter="6" v-show="type=='2'">
                  <el-col :span="8">
                    <el-form-item label="认证方式" prop="networkAccessMethod" size="small">
                      <el-select v-model="deviceForm.networkAccessMethod" placeholder="请选择认证方式" clearable filterable>
                        <el-option v-for="dict in networkingMethodList" :key="dict.dictValue" :label="dict.dictValue"
                                   :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row> -->
              </el-collapse-item>

              <el-collapse-item title="资产信息" v-if="(type=='1'||type=='4') && (deviceForm.assetCodeErp && deviceForm.deviceCodeErp)" name="5">
                <el-row :gutter="6">
                  <!-- <el-col :span="8">
                    <el-form-item label="运维单位" prop="operationUnit">
                      <el-input v-model="deviceForm.operationUnit" disabled></el-input>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item label="ERP资产编码" prop="assetCodeErp" :rules="[{ required: true, message: 'ERP资产编码不能为空'}]">
                      <el-input v-model="deviceForm.assetCodeErp" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="ERP设备台账编码" prop="deviceCodeErp">
                      <template slot="label">
                        <span class="formLabel">ERP设备台账<br>编码</span>
                      </template>
                      <el-input v-model="deviceForm.deviceCodeErp" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="工厂区域" prop="factoryAreaCode" :rules="[{ required: true, message: '工厂区域不能为空'}]">
                      <el-select v-model="deviceForm.factoryAreaCode" placeholder="请选择工厂区域" clearable @change="getfactoryArea" filterable>
                        <el-option v-for="dict in factoryAreaList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="维护工厂" prop="maintenanceFactoryCode" :rules="[{ required: true, message: '维护工厂不能为空'}]">
                      <el-select v-model="deviceForm.maintenanceFactoryCode" placeholder="请输入维护工厂" clearable filterable @change="getmaintenanceFactory">
                        <el-option v-for="dict in maintenanceFactoryList" :key="dict.code" :label="dict.name" :value="dict.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用保管部门" prop="useKeepDept" :rules="[{ required: true, message: '使用保管部门不能为空'}]">
                      <el-select
                        v-model="deviceForm.useKeepDept"
                        filterable
                        placeholder="请选择使用保管部门"
                        clearable
                        @change="getuseKeepDept"
                        :disabled="!deviceForm.maintenanceFactoryCode"
                      >
                        <el-option v-for="dict in erpDeptList" :key="dict.kostl" :label="dict.kostlT" :value="dict.kostl"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="实物保管部门" prop="realManageDept" :rules="[{ required: true, message: '实物保管部门不能为空'}]">
                      <el-select
                        v-model="deviceForm.realManageDept"
                        filterable
                        placeholder="请选择实物保管部门"
                        clearable
                        @change="getEntityKeepDept"
                        :disabled="!deviceForm.maintenanceFactoryCode"
                      >
                        <el-option v-for="dict in erpDeptList" :key="dict.kostl" :label="dict.kostlT" :value="dict.kostl"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="电压等级" prop="voltageLevelCode" :rules="[{ required: true, message: '电压等级不能为空'}]">
                      <el-select v-model="deviceForm.voltageLevelCode" clearable filterable placeholder="请选择电压等级" @change="voltageLevelChange">
                        <el-option
                          v-for="item in voltageLevelList"
                          :value="item.dictKey"
                          :key="item.dictKey"
                          :label="item.dictValue"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>


                  <el-col :span="8">
                    <el-form-item label="设备增加方式" prop="deviceAddTypeCode" :rules="[{ required: true, message: '设备增加方式不能为空'}]">
                      <el-select v-model="deviceForm.deviceAddTypeCode" filterable placeholder="请选择设备增加方式" clearable @change="deviceAddTypeChange">
                        <el-option v-for="dict in deviceAddTypeList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备变动方式" prop="deviceChangeTypeCode" :rules="[{ required: true, message: '设备变动方式不能为空'}]">
                      <el-select v-model="deviceForm.deviceChangeTypeCode" filterable placeholder="请选择设备变动方式" clearable @change="deviceChangeTypeChange">
                        <el-option v-for="dict in deviceChangeTypeList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <!-- <el-col :span="8">
                    <el-form-item label="WBS元素" prop="wbsElement" clearable :rules="[{ required: true, message: 'WBS项目不能为空'}]">
                      <wbsSelect type="wbsElement" placeholder="请选择WBS元素" v-model="deviceForm.wbsElement" @change="wbsChange"></wbsSelect>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备存放地点" prop="appDevLocation">
                      <el-input v-model="deviceForm.appDevLocation" clearable></el-input>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item label="功能位置" prop="funLocationCode" :rules="[{ required: true, message: '功能位置不能为空'}]">
                      <el-select v-model="deviceForm.funLocationCode" placeholder="请选择功能位置" clearable filterable @change="getfunLocation">
                        <el-option v-for="dict in funLocationList" :key="dict.trlnr" :label="dict.pltxt" :value="dict.trlnr"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                     <!-- :rules="[{ required: true, message: '功能位置编码不能为空'}]" -->
                    <el-form-item label="功能位置编码" prop="funLocationCode">
                      <el-input v-model="deviceForm.funLocationCode" disabled></el-input>
                    </el-form-item>
                  </el-col>


                </el-row>
              </el-collapse-item>
            </el-collapse>

            <!-- <div class="fenge"></div> -->
            <!-- <div class="fenge"></div> -->
            <!-- <div class="fenge"></div> -->
            <!-- <div class="fenge" v-show="type=='2'"></div> -->
          </el-form>
        </div>
        <!-- 底部按钮 -->
        <div class="form-btn">
          <el-button class="border-btn" size="small" @click="handleSubmit()">保 存</el-button>
          <el-button class="border-btn" size="small" @click="searchReset" style="margin-left: 50px;">返 回</el-button>
        </div>
      </basic-container>
    </el-dialog>
  </div>
</template>
<script>
import {getDictCmdbList, getDictList, getDictCmdbListPid} from "@/api/dict";
import {accessSubnetList, accessSubnetIPList} from "@/api/operation/devChange/devChange";
import {getRDeptrpList, getErptranstplnrList, getErpmaintainList2} from "@/api/device/devicerecord";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDeptList} from "@/api/system/dept";
import {getUserList} from "@/api/device/deviceapply"
import {mapGetters} from "vuex";
import wbsSelect from "@/components/wbsSelect/index.vue";


export default {
  components: {xtTreeLzaySelect, wbsSelect},
  props: {
    placeholder: {
      type: String
    },
    type: {
      type: String
    },
    value: {
      type: [String, Number, Array],
      default: ""
    },
    bindId: {
      type: String,
      default: ""
    },
    deviceDetailForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    deviceList: {
      type: Array
    }
  },
  data() {
    return {
      activeName: ['1', '2', '3', '4', '5'],
      rules: {
        receivingIDCard: [
          {pattern: /^\d{17}[0-9X]$/, message: '身份证号格式错误', trigger: 'blur'}
        ],
        deviceUserIDCard: [
          {pattern: /^\d{17}[0-9X]$/, message: '身份证号格式错误', trigger: 'blur'}
        ],
        // userTel:[
        //   {pattern:/^1[3-9]\d{9}$/,message:'手机号格式错误', trigger:'blur'}
        // ],
        // operationTel:[
        //   {pattern:/^1[3-9]\d{9}$/,message:'手机号格式错误', trigger:'blur'}
        // ],
      },
      deviceForm: {},
      isShow: true,
      tableHeight: '550px',
      loading: false,
      receiveUnitList: [],
      receiveDeptList: [],
      operationDeptList: [],
      operationUnit: [],
      operationLevelList: [],
      cpuBrandList: [],
      belongIntnetList: [],
      networkingMethodList: [],
      unitList: [],
      deptList: [],
      ipList: [],
      //是否可更改
      isEdit1: false,
      isEdit2: false,
      isEdit3: false,
      //排除ip
      excludeIps: [],
      isOper: false,
      //用户列表
      userList: [],


      erpDeptList: [],
      voltageLevelList: [],
      deviceAddTypeList: [],
      deviceChangeTypeList: [],
      deviceStatusList: [],
      deviceCategoryList: [],
      makerList: [],
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      funLocationList: [],
      factoryAreaList: [],
      maintenanceFactoryList: [],
      netWorkCodeList: []

    };
  },
  computed: {
    ...mapGetters(["permission", "userInfo", "userDetail"]),
    isVisible: {
      get() {
        return this.isVisible
      },
      set(val) {
        this.$emit("update:isShow", val)
      }
    },

  },
  created() {
    //加载字典--电压等级
    this.getCmdbDictList("1084068218601472");
    this.getCmdbDictList("1083864635473920");
    this.getCmdbDictList("1083948487999488");
    this.getCmdbDictList("1097745625841664");
    this.getCmdbDictList("1082610161090560");
    this.getCmdbDictList("1083945124167680");
    this.getCmdbDictList("1107942968721408");
    this.getCmdbDictList("1082603970297856");
    //加载字典--功能位置
    this.getErptranstplnrList();
    //加载字典--维护工厂
    this.getErpmaintainList();




    //判断是否是运维人员
    this.isRole();
    //获取 部门列表
    this.getDeptList()
    //加载字典--运维等级
    this.getCmdbDictList("1107954469502976");
    this.getDictList('Is802')


    let datas = JSON.parse(JSON.stringify(this.deviceDetailForm))
    if(datas.brandCode)datas.brandCode = datas.brandCode.toString()
    if(datas.seriesCode)datas.seriesCode = datas.seriesCode.toString()
    if(datas.deviceModelCode)datas.deviceModelCode = datas.deviceModelCode.toString()

    if(datas.voltageLevelCode)datas.voltageLevelCode = datas.voltageLevelCode.toString()
    if(datas.deviceAddTypeCode)datas.deviceAddTypeCode = datas.deviceAddTypeCode.toString()
    if(datas.deviceAddTypeCode)datas.deviceAddTypeCode = datas.deviceAddTypeCode.toString()
    if(datas.funLocationCode)datas.funLocationCode = datas.funLocationCode.toString()
    if(datas.factoryAreaCode)datas.factoryAreaCode = datas.factoryAreaCode.toString()
    if(datas.maintenanceFactoryCode)datas.maintenanceFactoryCode = datas.maintenanceFactoryCode.toString()
    if(datas.netWorkCode){
      datas.netWorkCode = datas.netWorkCode.toString()
      this.getSubnet(datas.netWorkCode)
    }else{
      datas.netWorkCode = ''
    }
    if(!datas.IP){ datas.IP='' }
    if(!datas.subnetId){ datas.subnetId='' }

    this.deviceForm = datas
    //
    if (this.deviceForm.receivingPerson != '') {
      this.isEdit1 = true
    }
    if (this.deviceForm.receivingIDCard != '') {
      this.isEdit2 = true
    }
    if (this.deviceForm.receivingTel != '') {
      this.isEdit3 = true
    }
    if (this.type == '2' && this.deviceForm.subnetId) {
      this.loadIp()
    }

    this.getDictCmdbListPid('1082554947272704', this.deviceForm.makerCode) // 品牌
    this.getDictCmdbListPid('1082609011851264', this.deviceForm.brandCode) // 系列
    this.getDictCmdbListPid('1082608047161344', this.deviceForm.seriesCode) // 型号

    if(this.deviceForm.maintenanceFactoryCode){
      //实物保管部门
      this.getRDeptrpList()
    }
  },
  methods: {
    getRDeptrpList() {
      //实物保管部门 this.userDetail.erpUnitCode
      getRDeptrpList({swerk: this.deviceForm.maintenanceFactoryCode, current: 1, size: 10000}).then(res => {
        this.erpDeptList = res.data.records
      })
    },
    getuseKeepDept(code) {
      this.erpDeptList.forEach(val => {
        if (val.kostl === code) {
          this.deviceForm.useKeepDeptName = val.kostlT
          this.deviceForm.useKeepDept = val.kostl
        }
      })
    },
    getEntityKeepDept(code) {
      this.erpDeptList.forEach(val => {
        if (val.kostl === code) {
          this.deviceForm.entityManagementDeptName = val.kostlT
          this.deviceForm.realManageDept = val.kostl
        }
      })
    },
    wbsChange(val, type) {
      if (type == 'wbsElement') {
        this.deviceForm.wbsProject = val.wbsName
      } else if (type == 'wbsProject') {
        this.deviceForm.wbsElement = val.wbsCode
      }
    },
    getfunLocation(code) {
      this.funLocationList.forEach(val => {
        if (val.trlnr === code) {
          this.deviceForm.funLocation = val.pltxt
          this.deviceForm.funLocationCode = val.trlnr
        }
      })
    },
    voltageLevelChange(code) {
      this.voltageLevelList.forEach(val => {
        if (val.dictKey === code) {
          this.deviceForm.voltageLevel = val.dictValue
        }
      })
    },
    deviceAddTypeChange(code) {
      this.deviceAddTypeList.forEach(val => {
        if (val.dictKey === code) {
          this.deviceForm.deviceAddType = val.dictValue
        }
      })
    },
    deviceChangeTypeChange(code) {
      this.deviceChangeTypeList.forEach(val => {
        if (val.dictKey === code) {
          this.deviceForm.deviceChangeType = val.dictValue
        }
      })
    },

    getErptranstplnrList() {
      //ERP功能位置
      getErptranstplnrList({swerk: this.userDetail.erpUnitCode, current: 1, size: 10000}).then(res => {
        this.funLocationList = res.data.records
      })
    },
    getfactoryArea(code) {
      this.factoryAreaList.forEach(val => {
        if (val.trlnr === code) {
          this.deviceForm.factoryArea = val.dictValue
          this.deviceForm.factoryAreaCode = val.dictKey
        }
      })
    },
    getErpmaintainList() {
      //ERP维护工厂
      getErpmaintainList2({code: this.userDetail.erpUnitCode, current: 1, size: 10000}).then(res => {
        this.maintenanceFactoryList = res.data
      })
    },
    getmaintenanceFactory(code) {
      this.maintenanceFactoryList.forEach(val => {
        if (val.code === code) {
          this.deviceForm.maintenanceFactory = val.name
          // this.form.maintenanceFactoryCode = val.code

          this.deviceForm.useKeepDeptName = undefined
          this.deviceForm.useKeepDept = undefined
          this.deviceForm.entityManagementDeptName = undefined
          this.deviceForm.realManageDept = undefined
          //实物保管部门
          this.getRDeptrpList()
        }
      })
    },
    makerChange(val) {
      this.getDictCmdbListPid('1082554947272704', val) // 品牌
      this.deviceForm.brand = ""
      this.deviceForm.series = ""
      this.deviceForm.deviceModel = ""
      this.deviceForm.brandCode = ""
      this.deviceForm.seriesCode = ""
      this.deviceForm.deviceModelCode = ""

      let current = this.makerList.filter(el => el.dictKey == val)[0]
      this.deviceForm.maker = current.dictValue;
    },
    brandChange(val) {
      this.getDictCmdbListPid('1082609011851264', val) // 系列
      this.deviceForm.series = ""
      this.deviceForm.deviceModel = ""
      this.deviceForm.seriesCode = ""
      this.deviceForm.deviceModelCode = ""

      let current = this.brandList.filter(el => el.dictKey == val)[0]
      this.deviceForm.brand = current.dictValue;
    },
    seriesChange(val) {
      this.getDictCmdbListPid('1082608047161344', val) // 型号
      this.deviceForm.deviceModel = ""
      this.deviceForm.deviceModelCode = ""

      let current = this.seriesList.filter(el => el.dictKey == val)[0]
      this.deviceForm.series = current.dictValue;
    },
    deviceModelChange(val) {
      let current = this.deviceModelList.filter(el => el.dictKey == val)[0]
      this.deviceForm.deviceModel = current.dictValue;
    },
    cpuBrandCodeChange(val) {
      let current = this.cpuBrandList.filter(el => el.dictKey == val)[0]
      this.deviceForm.cpuBrand = current.dictValue;
    },




    getUserList(val) {
      //根据部门id获取人员列表
      getUserList({deptId: val.id}).then(res => {
        this.userList = res.data
      })
    },
    isRole() {
      //判断角色是否是运维人员
      if (this.userDetail.userRoleFlag === 0) {
        this.isOper = false
      } else {
        this.isOper = true
      }
    },
    getDeptList() {
      //获取部门 单位
      getDeptList().then(res => {
        this.unitList = res.data
      })
    },
    getOperationUnit(val) {
      //选择运维单位
      this.deviceForm.operationUnit = val.fullName
      this.$refs.deviceForm.$forceUpdate()
      this.$forceUpdate()
    },
    getOperationDept(val) {
      //选择运维部门
      this.deviceForm.operationDept = val.fullName
      //根据部门id获取人员列表
      getUserList({deptId: val.id}).then(res => {
        this.userList = res.data
      })
      this.$refs.deviceForm.$forceUpdate()
      this.$forceUpdate()
    },
    getEntityUnit(val) {
      //选择领用单位
      this.deviceForm.receiveUnit = val.fullName
      this.$refs.deviceForm.$forceUpdate()
      this.$forceUpdate()
    },
    getEntityDept(val) {
      //选择领用部门
      this.deviceForm.receiveDept = val.fullName
      this.deviceForm.receiveDeptCode = val.id;
      this.$refs.deviceForm.$forceUpdate()
      this.$forceUpdate()
    },
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 50 - 47 + 'px'
    },
    getCmdbDictList(code) {
      //加载cmdb字典
      let query = {}
      query.ciId = code || '1082372687986688'
      getDictCmdbList(query).then(res => {
        if (code === '1107954469502976') {
          this.operationLevelList = res.data;
        } else if (code === '1084068218601472') { // 电压等级
          this.voltageLevelList = res.data;
        } else if (code === '1103423111233536') { // 设备状态
          this.deviceStatusList = res.data;
        } else if (code === '1083864635473920') { // 设备增加方式
          this.deviceAddTypeList = res.data;
        } else if (code === '1083948487999488') { // 设备变动方式
          this.deviceChangeTypeList = res.data;
        } else if (code === '1097745625841664') { // 设备分类
          this.deviceCategoryList = res.data;
        } else if (code === '1082610161090560') { // 制造商
          this.makerList = res.data
        } else if (code === '1083945124167680') {
          this.factoryAreaList = res.data;
        } else if (code === '1107942968721408') { // 所属网络
          this.netWorkCodeList  = res.data;
        } else if (code === '1082603970297856') { // cpu品牌
          this.cpuBrandList  = res.data;
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
          this.seriesList = res.data
        } else if (ciId === '1082608047161344') { // 型号
          this.deviceModelList = res.data
        }
      });
    },
    getDictList(code) {
      //加载字典
      getDictList(code).then(res => {
        if (code === 'ticket_creat_type') {
          this.ticketCreatTypeList = res.data;
        } else if (code === 'ticket_status') {
          this.ticketStatusList = res.data;
        } else if (code === 'Is802') {
          this.networkingMethodList = res.data;
        }
      });
      //ip

    },
    getSubnet(val){
      // 所属子网
      accessSubnetList({current: 1, size: 9999, netWorkType: val}).then(res => {
        this.belongIntnetList = res.data.records
      })
    },
    handleSubmit() {
      this.excludeIps.push(this.deviceForm.ip);

      if (this.type == '1' || this.type == '4') {
        //保存
        this.$refs.deviceForm.validate((valid, obb) => {
          if (valid) {
            //提交
            this.$emit("setVal", this.deviceForm);
            this.isVisible = false
            // 关闭
            this.beforeCloseHandler();
          }else{
            this.$message.warning('请将信息填写完整！')
          }
        })
      } else {
        this.$refs.deviceForm.validate(valid => {
          if (valid) {
            //提交
            this.$emit("setVal", this.deviceForm);
            this.isVisible = false
            // 关闭
            this.beforeCloseHandler();
          }
        })
      }
    },
    searchReset() {
      // 关闭
      this.beforeCloseHandler();
    },
    beforeCloseHandler() {
      //点击关闭按钮
      this.$emit('close')
      this.isVisible = false
    },
    changeNetWork(val) {

      this.getSubnet(val)
      this.deviceForm.subnetId = ''
      this.deviceForm.subnetName = ''
      this.deviceForm.IP = ''
      if(val == '1107943681753089'){
        this.$refs.aaa.clearValidate()
        this.$refs.bbb.clearValidate()
      }

    },
    changeSubnet(val) {
      // 修改子网
      for (let i = 0; i < this.belongIntnetList.length; i++) {
        let item = this.belongIntnetList[i]
        if (val === item.id) this.deviceForm.subnetName = item.subnetName
      }
      this.deviceForm.IP = ''
      if (val === '') {
        this.ipList = []
      } else {
        accessSubnetIPList({subnet: val, isUsed: 0, excludeIps: this.excludeIps}).then((res => {
          let datas = res.data
          datas = datas.filter(el => this.deviceForm.IP == el.ip || !this.deviceList.some(el2 => el2.IP == el.ip))
          this.ipList = datas
        }))
      }
    },
    loadIp() {
      accessSubnetIPList({subnet: this.deviceForm.subnetId, isUsed: 0, excludeIps: this.excludeIps}).then((res => {
        let datas = res.data
        datas = datas.filter(el => this.deviceForm.IP == el.ip || !this.deviceList.some(el2 => el2.IP == el.ip))
        this.ipList = datas
      }))
    }
  }
};
</script>
<style lang='scss' scoped>
::v-deep .el-collapse-item__header {
  background-color: #e4edf5 !important;
  font-weight: bold;
}

::v-deep .el-collapse-item > div .is-active {
  background-color: #84b7f9 !important;
}

::v-deep .el-collapse-item__content {
  padding: 15px 0 10px;
}

::v-deep .el-collapse {
  border: 1px solid #84b7f9;

  .el-collapse-item:last-child {
    border-bottom: 1px solid #84b7f9
  }
}

.fenge {
  border-bottom: 1px dashed #b3d8ff;
  margin-bottom: 15px;
}

.wrap {
  width: 100%;
}

::v-deep .el-select {
  width: 100% !important;
}

.formLabel {
  line-height: 16px;
  display: block;
  padding-top: 5px;
}

.formLabelReq:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
}

::v-deep .vaa  .el-form-item__label:before{
  display: none;
  // content: '' !important;
  // color: blue !important;
}
</style>
