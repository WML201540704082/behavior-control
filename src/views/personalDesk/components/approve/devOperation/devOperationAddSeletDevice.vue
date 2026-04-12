<template>
  <div class="wrap">
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="() => $emit('close')"
      :visible.sync="isShow"
      append-to-body
      title="新建设备"
      width="1200px"
      top="10vh"
      v-el-drag-dialog
    >
      <el-scrollbar style="height:600px" ref="scrollbar">
        <div
          class="form_box"
          v-for="(item, index) in devList"
          :key="index"
        >
          <formTitle :titleText="'入网设备'+(index+1)" :titleType="'page_title'">
            <div slot="rightBtnBox">
              <el-button type="danger" size="small" @click="delDevice(index)">删除</el-button>
            </div>
          </formTitle>
          <el-form
            :ref="'deviceForm'+index"
            :model="item.deviceForm"
            label-suffix=":"
            label-width="145px"
            class="xt_form"
          >
            <el-collapse v-model="item.activeName">
              <el-collapse-item title="基本信息" name="1">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="设备分类" prop="deviceCategory" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.deviceCategory" @change="deviceCategoryChange(index, $event)" placeholder="请选择设备分类" clearable disabled>
                        <el-option  v-for="dict in deviceCategoryList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备类型" prop="deviceType" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.deviceType"  placeholder="请输入设备类型" clearable @change="changeDevType(index, $event)">
                        <el-option  v-for="dict in deviceTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" style="position: relative;">
                    <el-form-item label="标准全称" prop="fullName">
                      <el-input placeholder="请输入标准全称" v-model="item.deviceForm.fullName"></el-input>
                    </el-form-item>
<!--                    <el-tooltip effect="dark" content="格式：年度+单位简称+部门+设备类型+3位参数" placement="top">-->
<!--                      <i class="el-icon-info" style="position: absolute;top: 12px;right: 9px;color: #84b7f9;font-size: 16px;"></i>-->
<!--                    </el-tooltip>-->
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="出厂序列号" prop="factoryNumber" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入出厂序列号" v-model="item.deviceForm.factoryNumber"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="售后服务到期时间" prop="afterSaleExpDate">
                      <el-date-picker v-model="item.deviceForm.afterSaleExpDate" value-format="yyyy-MM-dd"  type="date" placeholder="请选择售后服务到期时间" clearable></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="是否信创设备" prop="isItal">
                      <el-radio-group v-model="item.deviceForm.isItal">
                        <el-radio v-for="dict in isItalList" :key="dict.dictKey" :label="dict.dictKey"> {{ dict.dictValue }} </el-radio>
                        <!-- <el-radio :label="'0'">是</el-radio>
                        <el-radio :label="'1'">否</el-radio> -->
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="品牌" prop="brand" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.brand" filterable clearable placeholder="请选择品牌" :disabled="editDisabled" @change="brandChange(index, $event)">
                        <el-option v-for="dict in brandList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="系列" prop="series" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.series"  clearable placeholder="请选择系列" :disabled="editDisabled || !item.deviceForm.brand" @change="seriesChange(index, $event)">
                        <el-option v-for="dict in item.seriesList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="型号" prop="deviceModel" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.deviceModel"  clearable placeholder="请选择型号" :disabled="editDisabled || !item.deviceForm.series" @change="deviceModelChange(index, $event)">
                        <el-option v-for="dict in item.deviceModelList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="item.deviceForm.isItal === '1104198453493761'">
                    <el-form-item label="CPU品牌" prop="cpuBrand">
                      <el-select v-model="item.deviceForm.cpuBrand" @change="cpuBrandChange(index)" clearable placeholder="请选择CPU品牌" :disabled="editDisabled">
                        <el-option v-for="dict in cpuBrandList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="item.deviceForm.isItal === '1104198453493761'">
                    <el-form-item label="操作系统类型" prop="osType">
                      <el-select v-model="item.deviceForm.osType" @change="osTypelChange(index)" clearable placeholder="请选择操作系统类型" :disabled="editDisabled">
                        <el-option v-for="dict in osTypeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="维护信息" name="2">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="领用单位" prop="receiveUnitName">
                      <xt-tree-select
                        disabled
                        :placeholder="'请选择领用单位'"
                        :formValue="item.deviceForm.receiveUnitName"
                        :selectType="'CORP'"
                        :formIndex="index"
                        @getTreeItem="getuseApplyUnit"
                      ></xt-tree-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="领用部门" prop="receiveDutyDeptName">
                      <xt-tree-select
                        disabled
                        :placeholder="'请选择领用部门'"
                        :formValue="item.deviceForm.receiveDutyDeptName"
                        :selectType="'DEPT'"
                        :formIndex="index"
                        @getTreeItem="getuseApplyDept"
                      ></xt-tree-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运行单位" prop="oprtDeptName">
                      <xt-tree-select
                        disabled
                        :placeholder="'请选择运行单位'"
                        :formValue="item.deviceForm.oprtDeptName"
                        :selectType="'CORP'"
                        :formIndex="index"
                        @getTreeItem="getuseOprtDept"
                      ></xt-tree-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="责任人" prop="receiveUseName">
                       <!-- :disabled="userDetail.realName" -->
                      <el-input placeholder="请输入责任人" v-model="item.deviceForm.receiveUseName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="责任人身份证号" prop="receiveUseCard">
                       <!-- :disabled="userDetail.userIdCard" -->
                      <el-input placeholder="请输入责任人身份证号" v-model="item.deviceForm.receiveUseCard"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="责任人联系方式" prop="receiveUsePhone">
                       <!-- :disabled="userDetail.phone" -->
                      <el-input placeholder="请输入责任人联系方式" v-model="item.deviceForm.receiveUsePhone"></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item label="责任人班组" prop="receiveDutyGroup" size="small">
                      <el-select v-model="item.deviceForm.receiveDutyGroup"  placeholder="请选择班组" @change="groupChange(index)" size="small">
                        <el-option  v-for="dict in receiveDutyGroupList" :key="dict.id"  :label="dict.deptName" :value="dict.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item label="使用类型" prop="userType" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.userType" @change="userTypeChange(index)" clearable placeholder="请选择设备状态" :disabled="editDisabled">
                        <el-option v-for="dict in userTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用人" prop="userName" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input v-model="item.deviceForm.userName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用人身份证号" prop="userCard">
                      <el-input v-model="item.deviceForm.userCard" :disabled="item.deviceForm.userType === 0"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="	使用人联系方式" prop="userPhone" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input v-model="item.deviceForm.userPhone"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="运维等级" prop="operationGrade" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.operationGrade" @change="operationGradeChange(index)" placeholder="请输入运维等级" clearable>
                        <el-option v-for="dict in operationGradeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>


                </el-row>
              </el-collapse-item>
              <el-collapse-item title="网络信息" name="3">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="所属网络" prop="networkType" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.networkType"  clearable placeholder="请选择设备状态" @change="networkTypeChange(index, $event)">
                        <!-- <el-option-group v-for="dict in networkTypeList" :key="dict.dictKey"  :label="dict.label" :value="dict.dictKey"> -->
                          <el-option v-for="item in networkTypeList" :key="item.dictKey"  :label="item.dictValue" :value="item.dictKey"></el-option>
                        <!-- </el-option-group> -->
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所属子网" prop="deviceSubnetName" :rules="[{ required: true, message: '不能为空'}]">
                      <subSelect :disabled="!item.deviceForm.networkType" placeholder="" v-model="item.deviceForm.deviceSubnetName" @change="deviceSubnetChange" :networkType="item.deviceForm.networkType" :institutionCode="userDetail.ownerUnit" :formIndex="index"></subSelect>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="IP地址" prop="deviceIp" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.deviceIp" @change="deviceIpChange" filterable clearable placeholder="请选择IP">
                        <el-option v-for="dict in deviceIpList" :key="dict.ip"  :label="dict.ip" :value="dict.ip"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="MAC地址" prop="deviceMac" :rules="[{ required: true, message: '不能为空'},{required: true,validator: macCheck, trigger: 'blur'}]">
                      <el-input v-model="item.deviceForm.deviceMac"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="认证方式" prop="is802" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.is802" @change="is802Change(index, $event)" clearable placeholder="请选择设备状态">
                        <el-option v-for="dict in is802List" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="安装地点" prop="address" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input v-model="item.deviceForm.address"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="特有信息" name="4" v-if="item.deviceForm.deviceType == '1135308294128009'">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="机房" prop="roomId" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.roomId" @change="deviceFormChange(index, $event)" clearable placeholder="请选择设备状态">
                        <el-option v-for="dict in roomIdList" :key="dict.uuid"  :label="dict.roomName" :value="dict.uuid"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="机柜" prop="cabinetsId" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.cabinetsId" :disabled="!item.deviceForm.roomId" @change="cabinetsIdChange(index, $event)" clearable placeholder="请选择设备状态">
                        <el-option v-for="dict in item.cabinetsIdList" :key="dict.id"  :label="dict.fullName" :value="dict.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item label="机框" prop="racksId" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.racksId" :disabled="!item.deviceForm.cabinetsId" @change="racksIdChange(index, $event)" clearable placeholder="请选择设备状态">
                        <el-option v-for="dict in item.racksIdList" :key="dict.id"  :label="dict.racksName" :value="dict.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item label="设备起始高度(U)" prop="deviceStartHeight" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="设备起始高度(U)" @input="hanleInput(index, $event)" v-model="item.deviceForm.deviceStartHeight"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备终止高度(U)" prop="deviceEndHeight" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入设备终止高度(U)" @input="hanleInput2(index, $event)" v-model="item.deviceForm.deviceEndHeight"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="网络设备用途类型" prop="networkDeviceType" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="item.deviceForm.networkDeviceType"  clearable placeholder="请选择网络设备用途类型">
                        <el-option v-for="dict in networkDeviceTypeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="管理IP" prop="manageIp" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入管理IP" v-model="item.deviceForm.manageIp"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="管理用户" prop="manageUser" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入管理用户" v-model="item.deviceForm.manageUser"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="管理密码" prop="managePassword" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入管理密码" v-model="item.deviceForm.managePassword"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="配置密码" prop="allocationPassword" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入配置密码" v-model="item.deviceForm.allocationPassword"></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item label="交换机ip" prop="switchesIp" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入交换机ip" v-model="item.deviceForm.switchesIp"></el-input>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item label="NASIP" prop="switchesIp" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入NASIP" v-model="item.deviceForm.switchesIp"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="NASSECRET" prop="switchesPassword" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入NASSECRET" v-model="item.deviceForm.switchesPassword"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <!-- <el-form-item label="SNMP版本号" prop="snmpVersion" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入SNMP版本号" v-model="item.deviceForm.snmpVersion"></el-input>
                    </el-form-item> -->

                    <el-form-item label="SNMP版本号" prop="snmpVersion" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select placeholder="请选择SNMP版本号" v-model="item.deviceForm.snmpVersion" style="width: 100%">
                        <el-option v-for="item in snmpVersionList" :value="item.dictKey" :label="item.dictValue" :key="item.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item label="交换机密码" prop="switchesPassword" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入交换机密码" v-model="item.deviceForm.switchesPassword"></el-input>
                    </el-form-item>
                  </el-col> -->
                  <!-- <el-col :span="8">
                    <el-form-item label="所属安全边界" prop="securityBoundary">
                      <el-select v-model="item.deviceForm.securityBoundary"  clearable placeholder="请选择所属安全边界">
                        <el-option v-for="dict in securityBoundaryList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item label="SNMP读字符串" prop="snmpRead" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入SNMP读字符串" v-model="item.deviceForm.snmpRead"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="SNMP写字符串" prop="snmpWrite" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入SNMP写字符串" v-model="item.deviceForm.snmpWrite"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="工作Vlan" prop="vlanNumber" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入工作Vlan" v-model="item.deviceForm.vlanNumber"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="用途" prop="purpose" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入用途" v-model="item.deviceForm.purpose"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <!-- <el-collapse-item title="运维信息" name="4">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="制作国家及地区" prop="maintenanceCountry">
                      <el-select v-model="item.deviceForm.maintenanceCountry"  clearable placeholder="请选择制作国家及地区" :disabled="editDisabled">
                        <el-option v-for="dict in maintenanceCountryList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="服务商" prop="serviceName">
                      <el-select v-model="item.deviceForm.serviceName"  clearable placeholder="请选择服务商" :disabled="editDisabled">
                        <el-option v-for="dict in serviceNameList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="服务商联系人" prop="serviceContacts">
                      <el-input placeholder="请输入服务商联系人" v-model="item.deviceForm.serviceContacts"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="服务商联系电话" prop="serviceTel">
                      <el-input placeholder="请输入服务商联系电话" v-model="item.deviceForm.serviceTel" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="服务级别" prop="serviceLevel">
                      <el-select v-model="item.deviceForm.serviceLevel" @change="serviceLevelChange" clearable placeholder="请选择服务级别" :disabled="editDisabled">
                        <el-option v-for="dict in serviceLevelList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item> -->
            </el-collapse>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="add_btn" @click="addDevice">
        <i class="el-icon-plus"></i>
      </div>
      <div class="btn_box">
        <el-button type="primary" size="small" @click="saveDev">确定</el-button>
        <el-button type="primary" plain size="small" @click="$emit('close')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getDictCmdbList, getDictList, getDictCmdbListPid } from "@/api/dict";
import {getGroupDictList} from "@/api/system/usergroup";
import {ippoolSearch, ippoolSearch2} from "@/api/operation/safeaccess/subnet";
import {mapGetters} from "vuex";
import {operationFullName, roomPage, cabinetsPage, racksPage} from "@/api/operation/deviceoperation";

import {getDeptLzayList} from "@/api/system/dept";
import subSelect from "@/components/subSelect/index.vue";
import switchInfoModel from "@/views/operation/safeaccess/components/switch/switchInfo.vue";
import xtTreeSelect from "@/components/xtTreeSelect/index.vue";

export default {
  components: {switchInfoModel, xtTreeSelect, subSelect},
  props: ['isShow', 'deviceList'],
  data() {
    // let reg_name=/[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/;
    // let macCheck = (rule,value,callback) => {
    //   if (!reg_name.test(value) || value.length > 17) {
    //     return callback(new Error('mac地址格式不正确！参考格式:00:24:21:19:BD:E4'));
    //   } else {
    //     callback();
    //   }
    // };
    return{
      operationGradeList: [],
      roomIdList: [],
      cabinetsIdList: [],
      racksIdList: [],
      networkDeviceTypeList: [],
      securityBoundaryList: [],
      isItalList: [],
      devList: [

      ],

      // 字典
      userTypeList: [
        {
          dictKey: 0,
          dictValue: '公用'
        },
        {
          dictKey: 1,
          dictValue: '个人'
        },
      ],
      operationGradeList: [],
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      osTypeList: [],
      voltageLevelList: [],
      maintenanceCountryList: [],
      serviceLevelList: [],
      cpuBrandList: [],
      cpuModelList: [], // CPU型号
      cpuCoreSizeList: [], // CPU核数
      cpuClockSpeedList: [], // CPU主频
      serviceNameList: [], // 服务商
      oprtDeptList: [], // 运行单位
      deviceCategoryList: [],
      deviceTypeList: [],
      receiveDutyGroupList: [],
      cmdbDeviceSync: true,
      switchForm: {},
      isShow: true,
      loading: false,
      editDisabled: false,
      is802List: [],
      networkTypeList: [],
      deviceSourceList: [],
      deviceIpList: [],
      yuanshuju: [],
      unitList: [],

      snmpVersionList: [],
    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"]),
  },
  mounted() {
    // this.getDictCmdbListPid('1082554947272704') // 品牌
    this.getDict()
    this.getRoomList()// 机房
    this.init()
  },
  methods: {
    hanleInput(index, value) {
      // const reg = /^[1-9]\d*$/;
      const reg = /^[\d.]*$/;
      if (!reg.test(value)) {
        let val = this.deviceForm.deviceStartHeight.substring(0, this.deviceForm.deviceStartHeight.length - 1)
        // this.deviceForm.deviceStartHeight = Number(val)

        this.devList[index].deviceForm.deviceStartHeight = Number(val)
      }
    },
    hanleInput2(index, value) {
      const reg = /^[\d.]*$/;
      if (!reg.test(value)) {
        // this.deviceForm.deviceEndHeight = this.deviceForm.deviceEndHeight.substring(0, this.deviceForm.deviceEndHeight.length - 1)
        this.devList[index].deviceForm.deviceEndHeight = this.devList[index].deviceForm.deviceEndHeight.substring(0, this.devList[index].deviceForm.deviceEndHeight.length - 1)
      }
    },

    macCheck(rule,value,callback){
      let reg_name=/[A-F\d]{2}[:|-][A-F\d]{2}[:|-][A-F\d]{2}[:|-][A-F\d]{2}[:|-][A-F\d]{2}[:|-][A-F\d]{2}/;
      if (!reg_name.test(value) || value.length > 17) {
        return callback(new Error('mac地址格式不正确！参考格式:00:24:21:19:BD:E4'));
      } else {
        callback();
      }
    },
    init(){
      this.devList = [
        {
          deviceForm: {
            isItal: '1104198587711488',
            deviceCategory: '1097756774301696',
            deviceCategoryName: '终端设备',

            oprtDept: this.userDetail.ownerUnit,
            oprtDeptName: this.userDetail.ownerUnitName,

            receiveUnit: this.userDetail.ownerUnit,
            receiveUnitCode: this.userDetail.ownerUnit,
            receiveUnitName: this.userDetail.ownerUnitName,

            receiveDutyDept: this.userDetail.deptId,
            receiveDutyDeptCode: this.userDetail.deptId,
            receiveDutyDeptName: this.userDetail.deptName,

            receiveUseName: this.userDetail.realName,
            receiveUseCard: this.userDetail.userIdCard,
            receiveUsePhone: this.userDetail.phone,
            receiveDutyGroup: this.userDetail.groupId,
            receiveDutyGroupName: this.userDetail.groupName,

            series: undefined,
            deviceModel: undefined,
            userCard: undefined,

          },
          activeName: '1',
          cabinetsIdList: [],
          racksIdList: [],
          seriesList: [], // 系列
          deviceModelList: [], // 型号

        }
      ]
    },
    getRoomList(){ // 机房
      roomPage().then(res=>{
        this.roomIdList = res.data.records
      })
    },
    getcabinetsList(roomId, index){ // 机柜
      cabinetsPage({ roomId: roomId }).then(res=>{
        // this.cabinetsIdList = res.data.records
        this.devList[index].cabinetsIdList = res.data.data
      })
    },
    getracksList( cabinetsId, index ){ // 机框
      racksPage({ cabinetsId: cabinetsId }).then(res=>{
        // this.racksIdList = res.data.records
        this.devList[index].racksIdList = res.data.records
      })
    },
    //机房
    deviceFormChange(index, val){
      // console.log(909090, this.devList[index])
      this.devList[index].deviceForm.cabinetsId = undefined;

      let current = this.roomIdList.filter(el=> el.uuid == val)[0]
      this.devList[index].deviceForm.roomName = current.roomName;
      this.getcabinetsList(val, index)
    },
    //机柜
    cabinetsIdChange(index, val){
      let current = this.devList[index].cabinetsIdList.filter(el=> el.id == val)[0]
      this.devList[index].deviceForm.cabinetsName = current.cabinetsName;
      this.getracksList(val, index)
    },
    //机框
    racksIdChange(index, val){
      let current = this.devList[index].racksIdList.filter(el=> el.id == val)[0]
      this.devList[index].deviceForm.racksName = current.racksName;
    },




    // 字典
    getDict() {
      // 系统字典
      let dictList = ['Is802', 'deviceSource', 'snmpVersion']
      for(let i=0; i<dictList.length; i++) {
        getDictList(dictList[i]).then(res => {
          if(dictList[i]==='brand'){
            this.brandList = res.data;
          }else if(dictList[i]==='series'){
            this.seriesList = res.data;
          }else if(dictList[i]==='deviceModel'){
            this.deviceModelList = res.data;
          }else if(dictList[i]==='deviceSource'){
            this.deviceSourceList  = res.data;
          }else if(dictList[i] === 'Is802') {
            this.is802List = res.data;
          }else if(dictList[i] === 'snmpVersion') {
            this.snmpVersionList = res.data;
          }
        })
      }

      // cmdb字典
      let cmdbDictList = [
        '1107951709650944', '1084068218601472', '1083979207081984', '1083969669234688', '1082603970297856',
        '1097745625841664', '1103423111233536', '1107942968721408', '1131177441558528', '1131278314569728',
        '1104198218612736', '1082554947272704', '1107954469502976'
      ]
      for(let i=0; i<cmdbDictList.length; i++) {
        getDictCmdbList({ciId: cmdbDictList[i]}).then(res => {
          if(cmdbDictList[i]==='1103423111233536'){ // 设备状态
            this.deviceStatusList  = res.data;
          }else if(cmdbDictList[i]==='1097745625841664'){
            this.deviceCategoryList  = res.data;
          }else if(cmdbDictList[i]==='1107954469502976'){ // 运维等级
            this.operationGradeList = res.data;
          }else if(cmdbDictList[i]==='1107951709650944'){ // 操作系统类型
            this.osTypeList = res.data;
          }else if(cmdbDictList[i]==='1084068218601472'){ // 电压等级
            this.voltageLevelList = res.data;
          }else if(cmdbDictList[i]==='1083979207081984'){ // 国家与区域
            this.maintenanceCountryList = res.data;
          }else if(cmdbDictList[i]==='1083969669234688'){ // 服务级别
            this.serviceLevelList = res.data;
          }else if(cmdbDictList[i]==='1082603970297856'){ // CPU品牌
            this.cpuBrandList = res.data;
          }else if(cmdbDictList[i]==='1107942968721408'){ // 所属网络
            this.networkTypeList = res.data;
          }else if(cmdbDictList[i]==='1131177441558528'){ // 网络设备用途类型
            this.networkDeviceTypeList = res.data;
          }else if(cmdbDictList[i]==='1131278314569728'){ // 所属安全边界
            this.securityBoundaryList = res.data;
          }else if(cmdbDictList[i]==='1104198218612736'){ // 是否信创设备
            this.isItalList = res.data;
          }else if(cmdbDictList[i]==='1082554947272704'){ // 品牌
            this.brandList = res.data
          }
        })
      }
      // 设备类型
      getDictCmdbListPid({ciId: '1097745969774592', pid: '1097756774301696'}).then(res => {
        this.deviceTypeList = res.data
      })
      //加载班组列表
      // getGroupDictList({ownerUnitId: this.userDetail.deptId}).then(res => {
      //   console.log(11123, res)
      //   this.receiveDutyGroupList  = res.data;
      // });
      getDeptLzayList({parentId: this.userDetail.deptId, type: 'TEAM'}).then(res => {
        this.receiveDutyGroupList  = res.data;
      });
    },
    getDictCmdbListPid(ciId, pid, index){
      getDictCmdbListPid({ ciId: ciId, pid: pid }).then(res => {
        if(ciId==='1097745969774592'){ // 设备类型
          this.deviceTypeList = res.data.filter(el=> el.dictKeyErp);
        }else if(ciId==='1082554947272704'){ // 品牌
          this.brandList = res.data
        }else if(ciId==='1082609011851264'){ // 系列
          // this.seriesList = res.data
          this.devList[index].seriesList = res.data
        }else if(ciId==='1082608047161344'){ // 型号
          // this.deviceModelList = res.data
          this.devList[index].deviceModelList = res.data
        }
      });
    },
    // 设备类型
    changeDevType(index, val) {
      let current = this.deviceTypeList.filter(el=> el.dictKey == val)[0]
      this.devList[index].deviceForm.deviceTypeName = current.dictValue;

      // this.devList[index].deviceForm.fullName = ''
      // if(this.devList[index].deviceForm.deviceType != '') {
      //   operationFullName({deviceType: this.devList[index].deviceForm.deviceType}).then(res => {
      //     this.devList[index].deviceForm.fullName = res.msg
      //     this.$forceUpdate()
      //   })
      // }
    },
    userTypeChange(index){
      this.devList[index].deviceForm.userCard = undefined
    },
    //班组编码
    groupChange(index){
      let group = this.receiveDutyGroupList.filter(item => item.id===this.devList[index].deviceForm.receiveDutyGroup);
      this.devList[index].deviceForm.receiveDutyGroupName = group[0].groupName
    },
    // 运行单位
    getuseOprtDept(val, index) {
      this.devList[index].deviceForm.oprtDept = val.id
      this.devList[index].deviceForm.oprtDeptName = val.fullName
      this.$forceUpdate()
    },
    // 领用单位
    getuseApplyUnit(val, index) {
      this.devList[index].deviceForm.receiveUnit = val.id
      this.devList[index].deviceForm.receiveUnitCode = val.id
      this.devList[index].deviceForm.receiveUnitName = val.fullName
      this.$forceUpdate()
    },
    // 领用部门
    getuseApplyDept(val, index) {
      this.devList[index].deviceForm.receiveDutyDept = val.id
      this.devList[index].deviceForm.receiveDutyDeptCode = val.id
      this.devList[index].deviceForm.receiveDutyDeptName = val.fullName
      this.$forceUpdate()
    },
    //选择运维单位
    getOperationUnit(val){

      this.deviceForm.operationUnit = val.fullName
      this.deviceForm.operation = val.id
      this.$refs.deviceForm.$forceUpdate()
      this.$forceUpdate()
    },
    //选择运维部门
    getOperationDept(val){
      this.deviceForm.operationDeptName = val.fullName
      this.deviceForm.operationDept = val.id
      this.$refs.deviceForm.$forceUpdate()
      this.$forceUpdate()
    },
    operationGradeChange(index){
      let current = this.operationGradeList.filter(el=> el.dictValue == this.devList[index].deviceForm.operationGrade)

      // console.log(788, this.operationGradeList, this.devList[index].deviceForm)

      this.devList[index].deviceForm.operationGradeCode = current[0].dictKey
    },
    cpuBrandChange(index){
      let current = this.cpuBrandList.filter(el=> el.dictValue == this.devList[index].deviceForm.cpuBrand)
      this.devList[index].deviceForm.cpuBrandCode = current[0].dictKey
    },
    // 操作系统类型
    osTypelChange(index){
      let current = this.osTypeList.filter(el=> el.dictValue == this.devList[index].deviceForm.osType)
      this.devList[index].deviceForm.osTypeCode = current[0].dictKey
    },
    // 服务级别
    serviceLevelChange(val){
      let current = this.serviceLevelList.filter(el=> el.dictValue == val)
      this.deviceForm.serviceLevelCode = current[0].dictKey
    },
    // 选择所属子网
    deviceSubnetChange(data, index){
      this.devList[index].deviceForm.deviceSubnet = data.id
      this.devList[index].deviceForm.deviceSubnetName = data.subnetName
      //获取未用的地址
      let params = {
        subnet: data.id,
        isUsed: 0,
        excludeIps: this.deviceList.map(el=> el.deviceIp)
        // current: 1,
        // size: 99,
      }
      ippoolSearch2(params).then(res => {
        let data = res.data
        this.yuanshuju = data
        let selectIps = this.devList.map(el => el.deviceForm.deviceIp)
        this.deviceIpList = data.filter(el=> !selectIps.includes(el.ip))
        // this.deviceIpList = res.data
      })
    },
    deviceIpChange(val){
      // let currentIndex = this.deviceIpList.findIndex(el => el.ip == val)
      // this.deviceIpList.splice( currentIndex, 1 )
      let selectIps = this.devList.map(el => el.deviceForm.deviceIp)
      // console.log(909090, selectIps)
      this.deviceIpList = this.yuanshuju.filter(el=> !selectIps.includes(el.ip))
    },

    deviceCategoryChange(index, val){
      let current = this.deviceCategoryList.filter(el=> el.dictKey == val)[0]
      this.devList[index].deviceForm.deviceCategoryName = current.dictValue;
    },
    brandChange(index, val){
      this.devList[index].deviceForm.series = "";
      this.devList[index].deviceForm.deviceModel = "";


      this.getDictCmdbListPid('1082609011851264', val, index) // 系列

      let current = this.brandList.filter(el=> el.dictKey == val)[0]
      this.devList[index].deviceForm.brandName = current.dictValue;
    },
    seriesChange(index, val){
      this.devList[index].deviceForm.deviceModel = "";

      this.getDictCmdbListPid('1082608047161344', val, index) // 型号

      let current = this.devList[index].seriesList.filter(el=> el.dictKey == val)[0]
      this.devList[index].deviceForm.seriesName = current.dictValue;
    },
    deviceModelChange(index, val){
      let current = this.devList[index].deviceModelList.filter(el=> el.dictKey == val)[0]
      this.devList[index].deviceForm.deviceModelName = current.dictValue;
    },
    is802Change(index, val){
      this.devList[index].deviceForm.isAccess = val === '0' ? 1 : 0;
    },
    //所属网络
    networkTypeChange(index, val){
      let current = this.networkTypeList.filter(el=> el.dictKey == val)[0]
      // this.devList[index].deviceForm.networkType = current.dictValue;
      this.devList[index].deviceForm.networkTypeName = current.dictValue;

      // let networkTypeList = this.networkTypeList[0].options.concat(this.networkTypeList[1].options)
      // if(this.networkTypeList!=null && this.devList[index].deviceForm.networkType!==''){
      //   let items = networkTypeList.filter(item => item.dictKey==(this.devList[index].deviceForm.networkType+''));
      //   if(items!=null && items.length>0){
      //     this.devList[index].deviceForm.networkType = items[0].dictValue;
      //     this.devList[index].deviceForm.networkTypeCode = items[0].dictKey;
      //   }
      //   console.log(items)
      // }
    },
    // 添加设备
    addDevice() {

      this.devList.push({
        deviceForm: {
          isItal: '1104198587711488',
          deviceCategory: '1097756774301696',
          deviceCategoryName: '终端设备',

          oprtDept: this.userDetail.ownerUnit,
          oprtDeptName: this.userDetail.ownerUnitName,

          receiveUnit: this.userDetail.ownerUnit,
          receiveUnitCode: this.userDetail.ownerUnit,
          receiveUnitName: this.userDetail.ownerUnitName,

          receiveDutyDept: this.userDetail.deptId,
          receiveDutyDeptCode: this.userDetail.deptId,
          receiveDutyDeptName: this.userDetail.deptName,

          receiveUseName: this.userDetail.realName,
          receiveUseCard: this.userDetail.userIdCard,
          receiveUsePhone: this.userDetail.phone,
          receiveDutyGroup: this.userDetail.groupId,
          receiveDutyGroupName: this.userDetail.groupName,

          series: undefined,
          deviceModel: undefined,
          userCard: undefined,
        },
        activeName: '1',
        cabinetsIdList: [],
        racksIdList: [],
        seriesList: [], // 系列
        deviceModelList: [], // 型号
      })
      this.$nextTick(() => {
        this.$refs.scrollbar.update()
      })

      this.$message.success("新增设备成功，请及时填写信息！")
    },
    // 删除设备
    delDevice(index) {
      this.devList.splice(index, 1)
      this.$nextTick(() => {
        this.$refs.scrollbar.update()
      })
    },
    // 保存设备
    saveDev() {
      // this.devList.forEach(el=>{

      // })
      // let deviceIpFlag = this.deviceList.some(el => el.deviceIp == this.deviceForm.deviceIp)
      // let deviceMacFlag = this.deviceList.some(el => el.deviceMac == this.deviceForm.deviceMac)
      // if(deviceIpFlag){
      //   this.$message.warning('IP地址已存在，不可重复！')
      //   return
      // }
      // if(deviceMacFlag){
      //   this.$message.warning('MAC地址已存在，不可重复！')
      //   return
      // }

      let promiseList = []
      for(let i=0; i<this.devList.length; i++) {
        promiseList.push(
          this.$refs['deviceForm'+i][0].validate()
        )
      }
      Promise.all(promiseList).then(() => {
        this.$emit('submitDev', this.devList)
      }).catch(err=>{
        this.$message.warning("请将信息填写完整!")
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.wrap {
  width: 100%;
}
.add_btn{
  height: 32px;
  line-height: 32px;
  text-align: center;
  background-color: #409EFF;
  color: #fff;
  cursor: pointer;
  border-radius: 3px;
  margin-top: 15px;
}
.btn_box{
  margin-top: 15px;
  text-align: center;
}
::v-deep .el-collapse-item__header{
  background-color: #e4edf5 !important;
  font-weight: bold;
  .el-icon-arrow-right{
    // color: #4c98f7;
  }
}
::v-deep .el-collapse-item >div .is-active{
  background-color: #84b7f9 !important;
}
::v-deep .el-collapse-item__content{
  padding: 15px 0 10px;
}
::v-deep .el-collapse{
  border: 1px solid #84b7f9;
  .el-collapse-item:last-child{
    border-bottom: 1px solid #84b7f9
  }
}
</style>
