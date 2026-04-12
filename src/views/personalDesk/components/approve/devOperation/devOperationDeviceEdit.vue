<template>
  <div class="wrap">
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="() => $emit('close')"
      :visible.sync="isShow"
      append-to-body
      title="修改设备"
      width="1200px"
      top="10vh"
      v-el-drag-dialog
    >
      <el-scrollbar style="height:600px" ref="scrollbar">
        <div class="page_form">
          <el-form
            ref="deviceForm"
            :model="deviceForm"
            label-suffix=":"
            label-width="145px"
            class="xt_form"
          >
            <el-collapse v-model="activeName">
              <el-collapse-item title="基本信息" name="1">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="设备分类" prop="deviceCategory">
                      <el-select v-model="deviceForm.deviceCategory" @change="deviceCategoryChange"  placeholder="请选择设备分类" clearable disabled>
                        <el-option  v-for="dict in deviceCategoryList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备类型" prop="deviceType">
                      <el-select v-model="deviceForm.deviceType" placeholder="请输入设备类型" clearable @change="changeDevType" :disabled="operationType === '0'">
                        <el-option  v-for="dict in deviceTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" style="position: relative;">
                    <el-form-item label="标准全称" prop="fullName">
                      <el-input placeholder="选择设备类型后自动生成" v-model="deviceForm.fullName"></el-input>
                    </el-form-item>
<!--                    <el-tooltip effect="dark" content="格式：年度+单位简称+部门+设备类型+3位参数" placement="top">-->
<!--                      <i class="el-icon-info" style="position: absolute;top: 12px;right: 9px;color: #84b7f9;font-size: 16px;"></i>-->
<!--                    </el-tooltip>-->
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="出厂序列号" prop="factoryNumber" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入出厂序列号" v-model="deviceForm.factoryNumber" :disabled="operationType === '0'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="售后服务到期时间" prop="afterSaleExpDate">
                      <el-date-picker v-model="deviceForm.afterSaleExpDate" :disabled="operationType === '0'" value-format="yyyy-MM-dd"  type="date" placeholder="请选择售后服务到期时间" clearable></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="deviceForm.isItal !== ''">
                    <el-form-item label="是否信创设备" prop="isItal">
                      <el-radio-group v-model="deviceForm.isItal" :disabled="operationType === '0'">
                        <el-radio v-for="dict in isItalList" :key="dict.dictKey" :label="dict.dictKey"> {{ dict.dictValue }} </el-radio>
                        <!-- <el-radio :label="'0'">是</el-radio>
                        <el-radio :label="'1'">否</el-radio> -->
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="品牌" prop="brandName" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="deviceForm.brandName" clearable placeholder="请选择品牌" :disabled="editDisabled || operationType === '0'" @change="brandChange">
                        <el-option v-for="dict in brandList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="系列" prop="seriesName" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="deviceForm.seriesName"  clearable placeholder="请选择系列" :disabled="editDisabled || operationType === '0'" @change="seriesChange">
                        <el-option v-for="dict in seriesList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="型号" prop="deviceModelName" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="deviceForm.deviceModelName"  clearable placeholder="请选择型号" :disabled="editDisabled || operationType === '0'" @change="deviceModelChange">
                        <el-option v-for="dict in deviceModelList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="deviceForm.isItal === '1104198453493761'">
                    <el-form-item label="CPU品牌" prop="cpuBrand">
                      <el-select v-model="deviceForm.cpuBrand" @change="cpuBrandChange" clearable placeholder="请选择CPU品牌" :disabled="editDisabled || operationType === '0'">
                        <el-option v-for="dict in cpuBrandList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="(deviceForm.isItal === '1104198453493761') && ( operationType !== '0' || deviceForm.osType )">
                    <el-form-item label="操作系统类型" prop="osType">
                      <el-select v-model="deviceForm.osType" @change="osTypelChange" clearable placeholder="请选择操作系统类型" :disabled="editDisabled || operationType === '0'">
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
                        :placeholder="'请选择领用单位'"
                        :formValue="deviceForm.receiveUnitName"
                        :selectType="'CORP'"
                        :formIndex="index"
                        :disabled="operationType === '0'"
                        @getTreeItem="getuseApplyUnit"
                      ></xt-tree-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="领用部门" prop="receiveDutyDeptName">
                      <xt-tree-select
                        :placeholder="'请选择领用部门'"
                        :formValue="deviceForm.receiveDutyDeptName"
                        :selectType="'DEPT'"
                        :formIndex="index"
                        :disabled="operationType === '0'"
                        @getTreeItem="getuseApplyDept"
                      ></xt-tree-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运行单位" prop="oprtDeptName">
                      <xt-tree-select
                        :placeholder="'请选择运行单位'"
                        :formValue="deviceForm.oprtDeptName"
                        :selectType="'CORP'"
                        :formIndex="index"
                        :disabled="operationType === '0'"
                        @getTreeItem="getuseOprtDept"
                      ></xt-tree-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="责任人" prop="receiveUseName">
                      <el-input placeholder="请输入责任人" v-model="deviceForm.receiveUseName" :disabled="operationType === '0'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="责任人身份证号" prop="receiveUseCard">
                      <el-input placeholder="请输入责任人身份证号" v-model="deviceForm.receiveUseCard" :disabled="operationType === '0'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="责任人联系方式" prop="receiveUsePhone">
                      <el-input placeholder="请输入责任人联系方式" v-model="deviceForm.receiveUsePhone" :disabled="operationType === '0'"></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item label="责任人班组" prop="receiveDutyGroup" size="small">
                      <el-select v-model="deviceForm.receiveDutyGroup"  placeholder="" @change="groupChange" size="small" :disabled="operationType === '0'">
                        <el-option  v-for="dict in receiveDutyGroupList" :key="dict.id"  :label="dict.deptName" :value="dict.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item label="使用类型" prop="userType" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="deviceForm.userType" @change="userTypeChange" clearable placeholder="请选择设备状态" :disabled="editDisabled || operationType === '0'">
                        <el-option v-for="dict in userTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用人" prop="userName" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input v-model="deviceForm.userName" :disabled="operationType === '0'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用人身份证号" prop="userCard">
                      <el-input v-model="deviceForm.userCard" :disabled="operationType === '0' || deviceForm.userType===0"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="	使用人联系方式" prop="userPhone" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input v-model="deviceForm.userPhone" :disabled="operationType === '0'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运维等级" prop="operationGrade" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="deviceForm.operationGrade" @change="operationGradeChange" placeholder="请输入运维等级" clearable>
                        <el-option v-for="dict in operationGradeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="网络信息" name="3" v-if="deviceForm.deviceType != '1135308294128009'">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="所属网络" prop="networkType" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="deviceForm.networkType"  clearable placeholder="请选择设备状态" @change="networkTypeChange" :disabled="operationType === '0'">
                        <el-option v-for="item in networkTypeList" :key="item.dictKey"  :label="item.dictValue" :value="item.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所属子网" prop="deviceSubnetName" :rules="[{ required: true, message: '不能为空'}]">
                      <subSelect :disabled="!deviceForm.networkType" placeholder="" v-model="deviceForm.deviceSubnetName" @change="deviceSubnetChange" :networkType="deviceForm.networkType" :institutionCode="userDetail.ownerUnit" :formIndex="index"></subSelect>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="IP地址" prop="deviceIp" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="deviceForm.deviceIp" filterable :disabled="!deviceForm.deviceSubnetName" clearable placeholder="请选择IP">
                        <el-option v-for="dict in deviceIpList" :key="dict.ip"  :label="dict.ip" :value="dict.ip"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="MAC地址" prop="deviceMac" :rules="[{ required: true, message: '不能为空'},{required: true,validator: macCheck, trigger: 'blur'}]">
                      <el-input v-model="deviceForm.deviceMac"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="认证方式" prop="is802" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="deviceForm.is802" @change="is802Change" clearable placeholder="请选择设备状态">
                        <el-option v-for="dict in is802List" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="安装地点" prop="address" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input v-model="deviceForm.address"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="特有信息" name="4" v-if="deviceForm.deviceType == '1135308294128009'">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="机房" prop="roomId" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="deviceForm.roomId" @change="deviceFormChange" clearable placeholder="请选择设备状态">
                        <el-option v-for="dict in roomIdList" :key="dict.uuid"  :label="dict.roomName" :value="dict.uuid"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="机柜" prop="cabinetsId" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="deviceForm.cabinetsId" :disabled="!deviceForm.roomId" @change="cabinetsIdChange" clearable placeholder="请选择设备状态">
                        <el-option v-for="dict in cabinetsIdList" :key="dict.id"  :label="dict.fullName" :value="dict.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item label="机框" prop="racksId" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="deviceForm.racksId" :disabled="!deviceForm.cabinetsId" @change="racksIdChange(index, $event)" clearable placeholder="请选择设备状态">
                        <el-option v-for="dict in racksIdList" :key="dict.id"  :label="dict.racksName" :value="dict.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item label="设备起始高度(U)" prop="deviceStartHeight" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="设备起始高度(U)" @input="hanleInput" @blur="deviceStartHeightBlur" v-model="deviceForm.deviceStartHeight"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备终止高度(U)" prop="deviceEndHeight" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入设备终止高度(U)" @input="hanleInput2" v-model="deviceForm.deviceEndHeight"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="网络设备用途类型" prop="networkDeviceType" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select v-model="deviceForm.networkDeviceType"  clearable placeholder="请选择网络设备用途类型">
                        <el-option v-for="dict in networkDeviceTypeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="管理IP" prop="manageIp" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入管理IP" v-model="deviceForm.manageIp"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="管理用户" prop="manageUser" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入管理用户" v-model="deviceForm.manageUser"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="管理密码" prop="managePassword" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入管理密码" v-model="deviceForm.managePassword"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="配置密码" prop="allocationPassword" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入配置密码" v-model="deviceForm.allocationPassword"></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item label="交换机ip" prop="switchesIp" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入交换机ip" v-model="deviceForm.switchesIp"></el-input>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item label="NASIP" prop="switchesIp" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入NASIP" v-model="deviceForm.switchesIp"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="NASSECRET" prop="switchesPassword" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入NASSECRET" v-model="deviceForm.switchesPassword"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <!-- <el-form-item label="SNMP版本号" prop="snmpVersion" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入SNMP版本号" v-model="deviceForm.snmpVersion"></el-input>
                    </el-form-item> -->
                    <el-form-item label="SNMP版本号" prop="snmpVersion" :rules="[{ required: true, message: '不能为空'}]">
                      <el-select placeholder="请选择SNMP版本号" v-model="deviceForm.snmpVersion" style="width: 100%">
                        <el-option v-for="item in snmpVersionList" :value="item.dictKey" :label="item.dictValue" :key="item.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item label="交换机密码" prop="switchesPassword" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入交换机密码" v-model="deviceForm.switchesPassword"></el-input>
                    </el-form-item>
                  </el-col> -->
                  <!-- <el-col :span="8">
                    <el-form-item label="所属安全边界" prop="securityBoundary">
                      <el-select v-model="deviceForm.securityBoundary"  clearable placeholder="请选择所属安全边界">
                        <el-option v-for="dict in securityBoundaryList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item label="SNMP读字符串" prop="snmpRead" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入SNMP读字符串" v-model="deviceForm.snmpRead"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="SNMP写字符串" prop="snmpWrite" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入SNMP写字符串" v-model="deviceForm.snmpWrite"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="工作Vlan" prop="vlanNumber" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入工作Vlan" v-model="deviceForm.vlanNumber"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="用途" prop="purpose" :rules="[{ required: true, message: '不能为空'}]">
                      <el-input placeholder="请输入用途" v-model="deviceForm.purpose"></el-input>
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

      <div class="submit_btn">
        <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
        <el-button type="primary" plain size="small" @click="$emit('close')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {operationFullName, roomPage, cabinetsPage, racksPage} from "@/api/operation/deviceoperation";
import {getDictCmdbList, getDictList, getDictCmdbListPid} from "@/api/dict";
import {mapGetters} from "vuex";
import subSelect from "@/components/subSelect/index.vue";
import {getGroupDictList} from "@/api/system/usergroup";
import {getDeptLzayList} from "@/api/system/dept";
import {ippoolSearch, ippoolSearch2} from "@/api/operation/safeaccess/subnet";
import xtTreeSelect from "@/components/xtTreeSelect/index.vue";
import {getDeptList} from "@/api/system/dept";
import switchInfoModel from "@/views/operation/safeaccess/components/switch/switchInfo.vue";

export default {
  components: {switchInfoModel, xtTreeSelect, subSelect},
  props: ['devItemDetail', 'deviceSource', 'operationType', 'deviceList'],
  data() {
    // let reg_name=/[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/;
    // let macCheck = (rule,value,callback) => {
    //   if (!reg_name.test(value) || value.length > 17) {
    //     return callback(new Error('mac地址格式不正确！参考格式:00:24:21:19:BD:E4'));
    //   } else {
    //     callback();
    //   }
    // };

    return {
      operationGradeList: [],
      roomIdList: [],
      cabinetsIdList: [],
      racksIdList: [],
      networkDeviceTypeList: [],
      securityBoundaryList: [],
      isItalList: [],

      activeName:['1'],

      deviceForm:{
      },
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
      deviceSubnetList: [],
      is802List: [],
      networkTypeList: [],
      deviceSourceList: [],
      deviceIpList: [],
      unitList: [],

      currentDeviceIp: '',
      currentDeviceMac: '',
      snmpVersionList: [],
    };
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"]),
  },
  created() {
    // 字典
    //加载字典--运维等级
    this.getCmdbDictList("1107954469502976");

    //加载字典-品牌
    this.getCmdbDictList("1082554947272704");
    // //加载字典--品牌
    // this.getDictList('brand')
    // //加载字典--系列
    // this.getDictList('series')
    // //加载字典--型号
    // this.getDictList('deviceModel')
    //加载字典-操作系统类型
    this.getCmdbDictList("1107951709650944");
    //加载字典-电压等级
    this.getCmdbDictList("1084068218601472");
    //加载字典-国家与区域
    this.getCmdbDictList("1083979207081984");
    //加载字典-服务级别
    this.getCmdbDictList("1083969669234688");
    //加载字典-CPU品牌
    this.getCmdbDictList("1082603970297856");

    //加载字典--设备分类
    this.getCmdbDictList("1097745625841664");
    //加载字典--是否信创设备
    this.getCmdbDictList("1104198218612736");
    // 加载班组列表
    this.getGroupList()
    //加载字典--所属子网
    //this.getDictList("deviceSubnet");
    //加载字典--入网方式
    this.getDictList('Is802')
    //加载字典--snmp版本号
    this.getDictList("snmpVersion");
    this.getCmdbDictList("1107942968721408");
    this.getCmdbDictList("1131177441558528");
    this.getCmdbDictList("1131278314569728");
    //加载字典--设备来源
    this.getDictList("deviceSource");

    //加载字典--设备类型
    // this.getCmdbDictList("1097745969774592");

    //加载字典--设备状态
    this.getCmdbDictList("1103423111233536");
    //加载部门
    this.getDeptList()
    let datas = JSON.parse(JSON.stringify(this.devItemDetail))
    datas.oprtDept = datas.oprtDept || datas.receiveUnit
    datas.oprtDeptName = datas.oprtDeptName || datas.receiveUnitName
    this.deviceForm = datas;
    //加载字典--设备类型
    getDictCmdbListPid({ciId: '1097745969774592', pid: this.deviceForm.deviceCategory}).then(res => {
      this.deviceTypeList = res.data
    })
    this.getDictCmdbListPid('1082609011851264', this.deviceForm.brand) // 系列
    this.getDictCmdbListPid('1082608047161344', this.deviceForm.series) // 型号
    this.currentDeviceIp = this.deviceForm.deviceIp
    this.currentDeviceMac = this.deviceForm.deviceMac


    if(this.operationType == '0') {
      this.activeName = ['2', '3']
    }

    if(this.deviceForm.deviceType == '1135308294128009') {
      this.activeName = ['2','4']
    }


    this.getRoomList()

    if(this.deviceForm.deviceSubnet){
      //获取未用的地址
      let params = {
        subnet: this.deviceForm.deviceSubnet,
        isUsed: 0,
        excludeIps: this.deviceList.map(el=> el.deviceIp)
      }
      ippoolSearch2(params).then(res => {
        this.deviceIpList = res.data
      }).catch(() => {})
    }

  },
  methods: {
    hanleInput(value) {
      // const reg = /^[1-9]\d*$/;
      const reg = /^[\d.]*$/;
      if (!reg.test(value)) {
        // let val = this.deviceForm.deviceStartHeight.substring(0, this.deviceForm.deviceStartHeight.length - 1)
        // console.log(999111, val)
        // this.deviceForm.deviceStartHeight = Number(val)
        this.deviceForm.deviceStartHeight = 0
      }
    },
    hanleInput2(value) {
      const reg = /^[\d.]*$/;
      if (!reg.test(value)) {
        this.deviceForm.deviceEndHeight = this.deviceForm.deviceEndHeight.substring(0, this.deviceForm.deviceEndHeight.length - 1)
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
    deviceStartHeightBlur(){
      // console.log(8888000, this.deviceForm.deviceStartHeight)

      if(this.deviceForm.deviceStartHeight.startsWith('0')){
        this.deviceForm.deviceStartHeight = this.deviceForm.deviceStartHeight.slice(1, this.deviceForm.deviceStartHeight.length)
      }

      let deviceHeight = this.deviceForm.deviceHeight || 0 // 设备高度
      let deviceStartHeight = this.deviceForm.deviceStartHeight || 0
      if(typeof deviceHeight != 'number') deviceHeight = Number(deviceHeight) || 0
      if(typeof deviceStartHeight != 'number') deviceStartHeight = Number(deviceStartHeight) || 0
      this.deviceForm.deviceEndHeight = deviceStartHeight + deviceHeight
    },

    userTypeChange(val){
      this.deviceForm.userCard = undefined
    },

    getDictCmdbListPid(ciId, pid){
      getDictCmdbListPid({ ciId: ciId, pid: pid }).then(res => {
        if(ciId==='1097745969774592'){ // 设备类型
          this.deviceTypeList = res.data.filter(el=> el.dictKeyErp);
        }else if(ciId==='1082554947272704'){ // 品牌
          this.brandList = res.data
        }else if(ciId==='1082609011851264'){ // 系列
          this.seriesList = res.data
        }else if(ciId==='1082608047161344'){ // 型号
          this.deviceModelList = res.data
        }
      });
    },

    getRoomList(){ // 机房
      roomPage({ regionCode: this.userDetail.regionCode }).then(res=>{
        this.roomIdList = res.data.records
      })
    },
    getcabinetsList(roomId){ // 机柜
      cabinetsPage({ roomId: roomId }).then(res=>{
        this.cabinetsIdList = res.data.data
      })
    },
    getracksList( cabinetsId ){ // 机框
      racksPage({ cabinetsId: cabinetsId }).then(res=>{
        this.racksIdList = res.data.records
      })
    },
    //机房
    deviceFormChange(val){

      this.deviceForm.cabinetsId = undefined;

      if(!val)return

      let current = this.roomIdList.filter(el=> el.uuid == val)[0]
      this.deviceForm.roomName = current.roomName;

      this.getcabinetsList(val)
    },
    //机柜
    cabinetsIdChange(val){
      let current = this.cabinetsIdList.filter(el=> el.id == val)[0]
      this.deviceForm.cabinetsName = current.cabinetsName;
      this.getracksList(val)
    },
    //机框
    racksIdChange(index, val){
      let current = this.racksIdList.filter(el=> el.id == val)[0]
      this.deviceForm.racksName = current.racksName;
    },




    getGroupList(unitId){
      //加载班组列表
      this.receiveDutyGroupList  = []
      // getGroupDictList({deptId:unitId||this.userInfo.deptId}).then(res => {
      //   this.receiveDutyGroupList  = res.data;
      // });
      getDeptLzayList({parentId: this.userDetail.deptId, type: 'TEAM'}).then(res => {
        this.receiveDutyGroupList  = res.data;
      });
    },
    brandChange(val){
      this.getDictCmdbListPid('1082609011851264', val) // 系列

      let current = this.brandList.filter(el=> el.dictKey == val)[0]
      this.deviceForm.brandName = current.dictValue;
    },
    seriesChange(val){
      this.getDictCmdbListPid('1082608047161344', val) // 型号

      let current = this.seriesList.filter(el=> el.dictKey == val)[0]
      this.deviceForm.seriesName = current.dictValue;
    },
    deviceModelChange(val){
      let current = this.deviceModelList.filter(el=> el.dictKey == val)[0]
      this.deviceForm.deviceModelName = current.dictValue;
    },
    deviceCategoryChange(val){
      let current = this.deviceCategoryList.filter(el=> el.dictKey == val)[0]
      this.deviceForm.deviceCategoryName = current.dictValue;
    },
    // deviceTypeChange(val){
    //   let current = this.deviceTypeList.filter(el=> el.dictKey == val)[0]
    //   this.deviceForm.deviceTypeName = current.dictValue;
    // },



    changeDevType(val) {
      let current = this.deviceTypeList.filter(el=> el.dictKey == val)[0]
      this.deviceForm.deviceTypeName = current.dictValue;

      // this.deviceForm.fullName = ''
      // if(this.deviceForm.deviceType != '') {
      //   operationFullName({deviceType: this.deviceForm.deviceType}).then(res => {
      //     this.deviceForm.fullName = res.msg
      //     this.$forceUpdate()
      //   })
      // }
    },
    groupChange(code){
      //班组编码
      let group = this.receiveDutyGroupList.filter(item => item.id===code);
      if(group){
        this.deviceForm.receiveDutyGroupName = group[0].groupName
        this.deviceForm.receiveDutyGroup = group[0].id
        // this.$refs.dataForm.$forceUpdate()
        // this.$forceUpdate()
      }
    },
    // 领用单位
    getuseApplyUnit(val) {
      this.deviceForm.receiveUnit = val.id
      this.deviceForm.receiveUnitCode = val.id
      this.deviceForm.receiveUnitName = val.fullName
      this.$forceUpdate()
    },
    // 领用部门
    getuseApplyDept(val) {
      this.deviceForm.receiveDutyDept = val.id
      this.deviceForm.receiveDutyDeptCode = val.id
      this.deviceForm.receiveDutyDeptName = val.fullName
      this.$forceUpdate()
    },
    voltageLevelChange(val){
      let current = this.voltageLevelList.filter(el=> el.dictValue == val)
      this.deviceForm.voltageLevelCode = current[0].dictKey
    },
    cpuBrandChange(val){
      let current = this.cpuBrandList.filter(el=> el.dictValue == val)
      this.deviceForm.cpuBrandCode = current[0].dictKey
    },
    osTypelChange(val){
      let current = this.osTypeList.filter(el=> el.dictValue == val)
      this.deviceForm.osTypeCode = current[0].dictKey
    },
    serviceLevelChange(val){
      let current = this.serviceLevelList.filter(el=> el.dictValue == val)
      this.deviceForm.serviceLevelCode = current[0].dictKey
    },
    operationGradeChange(val){
      let current = this.operationGradeList.filter(el=> el.dictValue == val)
      this.deviceForm.operationGradeCode = current[0].dictKey
    },


    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 50 - 47 + 'px'
    },
    //加载部门数据
    getDeptList() {
      getDeptList().then(res => {
        this.unitList = res.data
      })
    },
    getDictList(code){
      getDictList(code).then(res => {
        if(code==='deviceStatus'){
          this.deviceStatusList  = res.data;
        }else if(code==='wbsElt'){
          this.deviceWBSList = res.data;
        }else if(code==='erpState'){
          this.deviceErpStatusList = res.data;
        }else if(code==='deviceCategory'){
          this.deviceCategoryList = res.data;
        }else if(code==='deviceType'){
          this.deviceTypeList = res.data;
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
        }else if(code==='networkType'){

          // let networkTypeListT = res.data;
          // this.networkTypeList = [];
          // this.networkTypeList.push({
          //   key:"网络类型",
          //   label:"网络类型",
          //   value:"网络类型",
          //   remark: '网络类型',
          //   options: [],
          // })
          // this.networkTypeList.push({
          //   key:"外网",
          //   label:"外网",
          //   value:"外网",
          //   remark: '外网',
          //   options: [],
          // })
          // networkTypeListT.forEach(item => {
          //   // eslint-disable-next-line no-cond-assign
          //   if(item.dictValue=== '外网' || (item.dictValue+"").startsWith("外网")){
          //     item.dictValue = item.dictValue.replace("外网-","")
          //     this.networkTypeList[1].options.push(item)
          //   }else{
          //     this.networkTypeList[0].options.push(item)
          //   }
          // });
        }else if(code==='outBoundStatus'){
          this.outBoundStatusList = res.data;
        }else if(code==='operationType'){
          this.operationTypeList  = res.data;
        }else if(code==='deviceSource'){
          this.deviceSourceList  = res.data;
        }else if(code === 'Is802') {
          this.is802List = res.data;
        }else if(code === 'snmpVersion') {
          this.snmpVersionList = res.data;
        }
      });
    },
    getCmdbDictList(code){
      //加载cmdb字典
      let query = {}
      query.ciId = code||'1082372687986688'
      getDictCmdbList( query ).then(res => {
        if(code==='1103423111233536'){ // 设备状态
          this.deviceStatusList  = res.data;
        }else if(code==='1097745625841664'){
          this.deviceCategoryList  = res.data;
        }
        else if(code==='1097745969774592'){
          this.deviceTypeList  = res.data;
        }
        else if(code==='1107954469502976'){ // 运维等级
          this.operationGradeList = res.data;
        }else if(code==='1107951709650944'){ // 操作系统类型
          this.osTypeList = res.data;
        }else if(code==='1084068218601472'){ // 电压等级
          this.voltageLevelList = res.data;
        }else if(code==='1083979207081984'){ // 国家与区域
          this.maintenanceCountryList = res.data;
        }else if(code==='1083969669234688'){ // 服务级别
          this.serviceLevelList = res.data;
        }else if(code==='1082603970297856'){ // CPU品牌
          this.cpuBrandList = res.data;
        }else if(code==='1107942968721408'){ // 所属网络
          this.networkTypeList = res.data;
        }else if(code==='1131177441558528'){ // 网络设备用途类型
          this.networkDeviceTypeList = res.data;
        }else if(code==='1131278314569728'){ // 所属安全边界
          this.securityBoundaryList = res.data;
        }else if(code==='1104198218612736'){ // 是否信创设备
          this.isItalList = res.data;
        }else if(code==='1082554947272704'){ // 是否信创设备
          this.brandList = res.data
        }
      });
    },
    getOperationUnit(val){
      //选择运维单位
      this.deviceForm.operationUnit = val.fullName
      this.deviceForm.operation = val.id
      this.$refs.deviceForm.$forceUpdate()
      this.$forceUpdate()
    },
    getOperationDept(val){
      //选择运维单位
      this.deviceForm.operationDeptName = val.fullName
      this.deviceForm.operationDept = val.id
      this.$refs.deviceForm.$forceUpdate()
      this.$forceUpdate()
    },
    handleSubmit(){
      //提交
      this.$refs.deviceForm.validate(async valid => {
        if (valid) {
          let deviceIpFlag = this.deviceList.some(el => el.deviceIp == this.deviceForm.deviceIp)
          let deviceMacFlag = this.deviceList.some(el => el.deviceMac == this.deviceForm.deviceMac)

          if(deviceIpFlag && this.currentDeviceIp != this.deviceForm.deviceIp){
            this.$message.warning('IP地址已存在，不可重复！')
            return
          }
          if(deviceMacFlag && this.currentDeviceMac != this.deviceForm.deviceMac){
            this.$message.warning('MAC地址已存在，不可重复！')
            return
          }

          this.$emit("setVal", this.deviceForm);
        }else{
          this.$message.warning("请将信息填写完整!")
        }
      })
    },
    deviceSubnetChange(data){
      //所属子网
      this.deviceForm.deviceSubnet = data.id
      this.deviceForm.deviceSubnetName = data.subnetName

      //获取未用的地址
      let params = {
        subnet: data.id,
        isUsed: 0,
        excludeIps: this.deviceList.map(el=> el.deviceIp)
      }
      ippoolSearch2(params).then(res => {
        this.deviceIpList = res.data
      }).catch(() => {})
    },
    is802Change(val){
      this.deviceForm.isAccess = val === '0' ? 1 : 0;
    },
    networkTypeChange(code){
      //所属网络
      let current = this.networkTypeList.filter(el=> el.dictKey == code)[0]
      // this.deviceForm.networkType = current.dictValue;
      this.deviceForm.networkTypeName = current.dictValue;
      // let networkTypeList = this.networkTypeList[0].options.concat(this.networkTypeList[1].options)
      // if(this.networkTypeList!=null && code!==''){
      //   let items = networkTypeList.filter(item => item.dictKey==(code+''));
      //   if(items!=null && items.length>0){
      //     this.deviceForm.networkType = items[0].dictValue;
      //     this.deviceForm.networkTypeCode = items[0].dictKey;
      //   }
      // }
    },
  }
};
</script>
<style lang='scss' scoped>
  .continune{
    padding: 0 5px;
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
  .wrap {
    width: 100%;
  }
  .suffixName{
    line-height: 40px;
    color: #333;
  }
  ::v-deep .el-select {
    width: 100% !important;
  }
  ::v-deep .el-input-number {
    width: 100% !important;
  }
  ::v-deep .el-collapse{
    border: 1px solid #84b7f9;
    .el-collapse-item:last-child{
      border-bottom: 1px solid #84b7f9
    }
  }
  .submit_btn{
    text-align: center
  }
</style>
