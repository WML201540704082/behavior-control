<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <el-scrollbar style="height:calc(100% -  150px - 48px)">
        <!-- 设备申请信息 -->
        <formTitle v-if='applyForm.applyNo' :titleText="'设备申请信息'" :titleType="'page_title'"></formTitle>
        <el-form v-if='applyForm.applyNo' :model="applyForm" ref="dataApplyForm" class="xt_search_form" label-width="100px">
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="申请编号" prop="applyNo" size="small">
                <el-input v-model="applyForm.applyNo" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="领用单位" prop="receiveUnit" clearable>
                <el-input v-model="applyForm.receiveUnitName" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备分类" prop="deviceCategory">
                <el-select v-model="applyForm.deviceCategory" clearable @change="deviceCategoryChange" disabled>
                  <el-option v-for="dict in deviceCategoryList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备类型" prop="deviceType">
                <el-select v-model="applyForm.deviceType" clearable disabled>
                  <el-option v-for="dict in deviceTypeList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="申请数量" prop="applyNum" size="small">
                <el-input v-model="applyForm.applyNum" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请原因" prop="applyReason" size="small">
                <el-input v-model="applyForm.applyReason" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="责任人" prop="receiveDutyPersonName" size="small">
                <el-input v-model="applyForm.receiveDutyPersonName" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="责任人身份证号" prop="receiveDutyCard" size="small">
                <template slot="label">
                  <span class="formLabel">责任人<br>身份证号</span>
                </template>
                <el-input v-model="applyForm.receiveDutyCard" clearable disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item prop="receiveDutyIscAccount" size="small">
                <template slot="label">
                  <span class="formLabel">责任人<br>ISC账号</span>
                </template>
                <el-input v-model="applyForm.receiveDutyIscAccount" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="receiveDutyPhone" size="small">
                <template slot="label">
                  <span class="formLabel">责任人<br>联系方式</span>
                </template>
                <el-input v-model="applyForm.receiveDutyPhone" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="receiveDutyDept" size="small">
                <template slot="label">
                  <span class="formLabel">责任人<br>部门</span>
                </template>
                <el-input v-model="applyForm.receiveDutyDeptName" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="责任人班组" prop="receiveDutyGroup" size="small">
                <template slot="label">
                  <span class="formLabel">责任人<br>班组</span>
                </template>
                <el-input v-model="applyForm.receiveDutyGroupName" clearable disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="是否以旧换新" prop="oldToNew" size="small">
                <el-radio v-model="applyForm.oldToNew" label="0" value="0" key="0" disabled>是</el-radio>
                <el-radio v-model="applyForm.oldToNew" label="1" value="1" key="1" disabled>否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否立即投运" prop="operation" size="small">
                <el-radio v-model="applyForm.operation" label="0" value="0" key="0" disabled>是</el-radio>
                <el-radio v-model="applyForm.operation" label="1" value="1" key="1" disabled>否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="网络类型" prop="networkType" clearable>
                <el-select v-model="applyForm.networkType" size="small" disabled>
                  <el-option v-for="dict in networkTypeList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="受理人" prop="applyUserName">
                <el-input clearable v-model="applyForm.applyUserName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="申请时间" prop="applyDate" size="small">
                <el-input clearable v-model="applyForm.applyDate" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="附件" clearable>
                <div style="min-width: 80px;display: inline;padding-right: 15px;">
                  <div v-for="item in applyForm.deviceOrderFileVOList" :key="item.id">
                    <a :href="item.fileUrl" v-if="item.orderType=='Apply'" class="border-btn" style="display: inline;"
                     target="_blank" rel="noopener noreferrer">{{ item.fileName }}</a>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 出库信息 -->
        <formTitle v-if='outForm.outboundNo' :titleText="'出库信息'" :titleType="'page_title'"></formTitle>
        <el-form v-if='outForm.outboundNo' :model="outForm" ref="dataOutForm" class="xt_search_form" label-width="100px" style="height: 150px;">
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="出库单号" prop="applyNo" size="small">
                <el-input v-model="outForm.outboundNo" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备来源" prop="deviceSource" clearable>
                <el-select v-model="outForm.deviceSource" clearable disabled>
                  <el-option v-for="dict in deviceSourceList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所在仓库" prop="warehouseName" size="small">
                <el-input v-model="outForm.warehouseName" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出库数量" prop="outboundNum" size="small">
                <el-input v-model="outForm.outboundNum" clearable disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="出库人员" prop="applyUserName" size="small">
                <el-input v-model="outForm.applyUserName" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出库时间" prop="outboundTime" size="small">
                <el-input v-model="outForm.outboundTime" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="备注" prop="remark" size="small">
                <el-input v-model="outForm.remark" clearable disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="18">
              <el-form-item label="附件" size="small">
                <div style="min-width: 80px;display: inline;padding-right: 15px;">
                  <div v-for="item in form.deviceOrderFileVOList" :key="item.id">
                    <a :href="item.fileUrl" v-if="item.orderType=='Outbound'" class="border-btn" style="display: inline;" target="_blank" rel="noopener noreferrer">{{ item.fileName }}</a>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 设备投运信息 -->
        <formTitle :titleText="'设备投运信息'" :titleType="'page_title'"></formTitle>
        <el-form :model="form" ref="dataForm" class="xt_form" label-width="100px">
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="投运单号" prop="operationNo" size="small">
                <el-input v-model="form.operationNo" placeholder="自动生成投运单号" clearable maxlength="24" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="投运类型" prop="oldToNew" :rules="[{ required: true, message: '不能为空'}]">
                <el-select v-model="form.oldToNew" placeholder="请选择投运类型" clearable disabled @change="oldToNewChange">
                  <el-option v-for="dict in oldToNewList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备来源" prop="deviceSource" :rules="[{ required: true, message: '不能为空'}]">
                <el-select v-model="form.deviceSource" placeholder="请选择设备来源" clearable disabled>
                  <el-option v-for="dict in deviceSourceList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="关联出库单" prop="outboundNo" size="small">
                <el-input v-model="form.outboundNo" placeholder="出库单号" clearable maxlength="24" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="设备分类" prop="deviceCategory" :rules="[{ required: true, message: '不能为空'}]">
                <el-select v-model="form.deviceCategory" placeholder="请选择设备分类" clearable @change="deviceCategoryChange">
                  <el-option v-for="dict in deviceCategoryList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备类型" prop="deviceType" :rules="[{ required: true, message: '不能为空'}]">
                <el-select v-model="form.deviceType" placeholder="请输入设备类型" clearable>
                  <el-option v-for="dict in deviceTypeList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="受理人员" prop="applyUserName" :rules="[{ required: true, message: '不能为空'}]">
                <el-input v-model="form.applyUserName" placeholder="请输入受理人员" clearable style="width:100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请部门" prop="receiveUnitName" clearable :rules="[{ required: true, message: '不能为空'}]">
                <xt-tree-lzay-select :formValue="form.receiveUnitName"
                                     :unit-id="$store.getters.userDetail.ownerUnit"
                                     :selectType="'DEPT'"
                                     @getTreeItem="getEntityUnit"
                ></xt-tree-lzay-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="受理时间" prop="applyDate" :rules="[{ required: true, message: '不能为空'}]">
                <el-date-picker v-model="form.applyDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请输入受理时间" clearable
                                :disabled="isEdit"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 中间设备列表 -->
        <formTitle :titleText="'设备信息列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" v-if="applyForm.oldToNew" size="small" @click="selectDevice">选择设备</el-button>
          </div>
        </formTitle>
        <!-- 设备投运 -->
        <el-table
          ref="deviceTable2"
          :data="deviceList2"
          v-loading="loading"
          size="small"
          v-if="form.oldToNew=='1'"
          height="380px"
        >
          <el-table-column type="selection" width="30" fixed="left"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="userName" label="使用信息" align="center">
            <template slot-scope="scope">
              <div class="tableItem">
                <p>使用人：{{ scope.row.userName }}</p>
                <p>使用人联系方式：{{ scope.row.userPhone }}</p>
                <p>使用人身份证号：{{ scope.row.userCard }}</p>
                <p>安装地点：{{ scope.row.address }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userPhone" label="设备基本信息" align="center">
            <template slot-scope="scope">
              <div class="tableItem">
                <p>设备编码：{{ scope.row.deviceCode }}</p>
                <p>ERP资产编码：{{ scope.row.erpAssetCode }}</p>
                <p>出厂序列号：{{ scope.row.sn || scope.row.factoryNumber }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userCard" label="网络信息" align="center">
            <template slot-scope="scope">
              <div class="tableItem">
                <p>所属子网：{{ scope.row.deviceSubnet }}</p>
                <p>IP地址：{{ scope.row.deviceIp }}</p>
                <p>MAC地址：{{ scope.row.deviceMac }}</p>
                <p>入网方式：{{ scope.row.networkingMethod }}</p>
              </div>
            </template>
          </el-table-column>
          <!-- v-if="deviceList2[0] && deviceList2[0].deviceCategory == '1097756774301696'" -->
          <el-table-column prop="address" label="认证信息" align="center" width="120px">
            <template slot-scope="scope">
              <div class="tableItem">
                <p>认证账号：{{ scope.row.authAccount }}</p>
                <p>密码：{{ scope.row.authPassword }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="维护信息" align="center">
            <template slot-scope="scope">
              <div class="tableItem">
                <p>运维单位：{{ scope.row.operationUnit }}</p>
                <p>运维单位：{{ scope.row.operationDept }}</p>
                <p>运维责任人：{{ scope.row.operationUse }}</p>
                <p>运维等级：{{ scope.row.operationLevel }}</p>
                <p>运维联系电话：{{ scope.row.operationTel }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text"
                         size="small"
                         icon="el-icon-edit"
                         @click="handleEdit(scope.row,scope.index)">编辑
              </el-button>
              <el-button type="text"
                         size="small"
                         icon="el-icon-delete"
                         v-if="scope.row.id=='' || scope.row.id==null"
                         @click="handleDelete(scope.row,scope.index)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 以旧换新 -->
        <el-table
          ref="deviceTable1"
          :data="deviceList1"
          v-loading="loading"
          size="small"
          v-if="form.oldToNew=='0'"
          height="380px"
        >
          <el-table-column type="selection" width="30" fixed="left"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="deviceIp" label="网络认证信息" align="center">
            <template slot-scope="scope">
              <div class="tableItem">
                <p>所属子网：{{ scope.row.deviceSubnet }}</p>
                <p>IP地址：{{ scope.row.deviceIp }}</p>
                <p>MAC地址：{{ scope.row.deviceMac }}</p>
                <p>认证账号：{{ scope.row.authAccount }}</p>
                <p>密码：{{ scope.row.authPassword }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="oldDeviceCode" label="旧设备基本信息" align="center">
            <template slot-scope="scope">
              <div class="tableItem">
                <p>设备名称：{{ scope.row.oldDeviceName }}</p>
                <p>设备编码：{{ scope.row.oldDeviceCode }}</p>
                <p>设备MAC：{{ scope.row.deviceOldMac }}</p>
                <p>ERP资产编码：{{ scope.row.oldErpAssetCode }}</p>
                <p>出厂序列号：{{ scope.row.olDFactoryNumber }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="deviceCode" label="新设备基本信息" align="center">
            <template slot-scope="scope">
              <div class="tableItem">
                <p>设备名称：{{ scope.row.deviceName }}</p>
                <p>设备编码：{{ scope.row.deviceCode }}</p>
                <p>设备MAC：{{ scope.row.deviceMac }}</p>
                <p>ERP资产编码：{{ scope.row.erpAssetCode }}</p>
                <p>出厂序列号：{{ scope.row.sn || scope.row.factoryNumber }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="设备使用人信息" align="center">
            <template slot-scope="scope">
              <div class="tableItem">
                <p>使用人：{{ scope.row.userName }}</p>
                <p>使用人联系方式：{{ scope.row.userPhone }}</p>
                <p>使用人身份证号：{{ scope.row.userCard }}</p>
                <p>安装地点：{{ scope.row.address }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="changePerson" label="更换原因" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text"
                         size="small"
                         icon="el-icon-edit"
                         @click="handleEdit(scope.row,scope.index)">编辑
              </el-button>
              <el-button type="text"
                         size="small"
                         icon="el-icon-delete"
                         v-if="scope.row.id=='' || scope.row.id==null"
                         @click="handleDelete(scope.row,scope.index)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 附件 -->
        <div style="margin-top: 15px">
          <div class="title_con">
            <div class="title_line">附件</div>
          </div>
          <uploadImg
            ref="uploadImg"
            :type="'投运工单'"
            :fileList="fileList"
            :attachId="form.attachId"
            @setVal="selectFileHandler"
          ></uploadImg>
        </div>
      </el-scrollbar>

      <formTitle :titleText="'审核信息'" :titleType="'page_title'"></formTitle>
      <el-form ref="chekForm" class="xt_form" label-width="100px" style="height: 70px;">
        <el-row :span="6">
          <el-col :span="18">
            <el-form-item label="审批意见">
              <el-input v-model="comment" type="textarea" :rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 底部按钮 -->
      <div class="form-btn">
        <el-button type="primary" size="small" @click="handleSubmit(0)">提交</el-button>
        <el-button type="danger" size="small" v-if="form.id" @click="handleSubmit(1)" style="margin-left: 50px;">驳回</el-button>
        <el-button class="border-btn" size="small" v-if="form.id==null || form.id==''" @click="handleAdd()" style="margin-left: 50px;">新增</el-button>
        <el-button class="border-btn" size="small" @click="handleReset" style="margin-left: 50px;">返 回</el-button>
      </div>
    </div>
    <!-- 选择设备 -->
    <deviceSelect type="operation" v-if="deviceSelectSync" :isShow.sync="deviceSelectSync" @setVal="selectDeviceHandler"></deviceSelect>
    <!-- 编辑设备 -->
    <operationDeviceEdit :type="oldToNew" :deviceForm="deviceEditRow" v-if="deviceEditSync" :isShow.sync="deviceEditSync" @setVal="editDeviceHandler"></operationDeviceEdit>
  </basic-container>
</template>

<script>
import {getDetail} from "@/api/operation/deviceoperation";
import {getDictList, getDictCmdbList} from "@/api/dict";
import {mapGetters} from "vuex";
import operationDeviceEdit from "@/views/operation/components/devOperation/devOperationDeviceEdit.vue";
import uploadModel from "@/views/device/components/capitalTransfer/uploadModel.vue";
import uploadImg from "@/views/device/components/devInBound/uploadImg.vue";
import deviceSelect from "@/components/deviceSelect/index.vue";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDeptList} from "@/api/system/dept";
import {rejectProcess, submitProcess, updateDevOperationStatus, checkDevOperationStatus} from "@/api/process";

export default {
  components: {xtTreeLzaySelect, deviceSelect, uploadImg, uploadModel, operationDeviceEdit},
  data() {
    return {
      id: '',
      deviceSelectSync: false,
      deviceEditSync: false,
      deviceEditIdx: 0,
      wbsProject: '',
      wbsElement: '',
      deviceCode: '',
      chekForm: {},
      form: {
        serialNumber: 123456,
        attachId: 123456
      },
      deviceEditRow: {},
      applyForm: {applyNo: null},
      outForm: {outboundNo: null},
      queryDate: {},
      loading: false,
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
      networkTypeList: [],
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      funLocationList: [],
      oldToNewList: [],
      deviceSourceList: [],
      deviceList1: [],
      deviceList2: [],
      deviceSelectList: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      cmdbForm: {},
      openUpload: false,
      unitList: [],
      oldToNew: '',
      fileList: [],
      comment: '',
    };
  },
  computed: {
    ...mapGetters(["permission", "userInfo", "userDetail"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.deviceoperation_add, false),
        viewBtn: this.vaildData(this.permission.deviceoperation_view, false),
        delBtn: this.vaildData(this.permission.deviceoperation_delete, false),
        editBtn: this.vaildData(this.permission.deviceoperation_edit, false),
        exportBtn: this.vaildData(this.permission.deviceoperation_export, false)
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
  mounted() {
    // 设置页面元素高度
    this.setPageContentHeight()
    //加载字典--设备类型
    //this.getDictList("deviceType");
    this.getCmdbDictList("1097745969774592");
    //加载字典--设备分类
    //this.getDictList("deviceCategory");
    this.getCmdbDictList("1097745625841664");
    //加载字典--投运类型
    this.getDictList("operationType");
    //加载字典--设备来源
    this.getDictList("deviceSource");
    //加载字典--网络类型
    this.getDictList("networkType");


    // 获得部门树
    this.getDeptList()

    this.id = null;
    //获取参数 判断是否是新增还是修改
    const params = this.$route.query
    this.id = params.id;
    if (params.id) {
      this.id = params.id;
      this.loadDetail(params.id);
      this.isEdit = true
      //加载 设备列表
      //this.loadDeviceDataList();
    } else {
      //加载空数据
      this.beforeOpen();
      this.isEdit = false
    }
  },
  methods: {
    getDictList(code) {
      getDictList(code).then(res => {
        if (code === 'deviceStatus') {
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
        } else if (code === 'funLocation') {
          this.funLocationList = res.data;
        } else if (code === 'factoryArea') {
          this.factoryAreaList = res.data;
        } else if (code === 'maintenanceFactory') {
          this.maintenanceFactoryList = res.data;
        } else if (code === 'networkType') {
          this.networkTypeList = res.data;
        } else if (code === 'outBoundStatus') {
          this.outBoundStatusList = res.data;
        } else if (code === 'operationType') {
          this.oldToNewList = res.data;
        } else if (code === 'deviceSource') {
          this.deviceSourceList = res.data;
        }
      });
    },
    getCmdbDictList(code) {
      //加载cmdb字典
      let query = {}
      query.ciId = code || '1082372687986688'
      getDictCmdbList(query).then(res => {
        if (code === '1102238379737088') {
          this.optYearList = res.data;
        } else if (code === '1102247959527424') {
          this.afterSaleStatusList = res.data;
        } else if (code === '1082607703228416') {
          this.deviceWBSList = res.data;
        } else if (code === '1097745625841664') {
          this.deviceCategoryList = res.data;
        } else if (code === '1097745969774592') {
          this.deviceTypeList = res.data;
          this.deviceTypeListAll = res.data;
        }
      });
    },
    oldToNewChange(code) {
      this.oldToNew = code;
      this.form.oldToNew = code;
      this.deviceList2 = [];
      this.deviceList1 = [];
      //修改投运类型
      this.$refs.dataForm.$forceUpdate()
      this.$forceUpdate()
    },
    deviceCategoryChange(code) {
      //设备分类选择
      this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));
    },
    getDeptList() {
      //加载部门数据
      getDeptList().then(res => {
        this.unitList = res.data
      })
    },
    getEntityUnit(val) {
      //选择领用单位 部门
      this.form.receiveUnitName = val.fullName
      this.form.receiveUnit = val.id
      this.$refs.form.$forceUpdate()
      this.$forceUpdate()
    },
    handleSubmit(workerStatus) {
      //提交
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          if (this.oldToNew == '1') {
            //"1"  "设备投运"
            this.form.deviceOperationDetailDTOList = this.deviceList2 || [];
          } else {
            //"0"  "以旧换新"
            this.form.deviceOperationDetailDTOList = this.deviceList1 || [];
          }
          if (this.deviceList1.length == 0 && this.deviceList2.length == 0) {
            this.$message({type: "warning", message: "请检查投运设备列表!"});
            return;
          }
          //拒绝逻辑
          if (workerStatus === 0) {
            //判断旧设备信息 变更原因是否为主
            valid = this.checkDeviceList(this.form.deviceOperationDetailDTOList);
            if (valid) {
              return;
            }
          }
          this.form.deviceOperationDetailVOList = [];
          this.form.deviceOrderFileVOList = [];
          //this.form.deviceOrderFileVOList = this.fileList||[]
          this.form.deviceOrderFileDTOList = this.fileList || [];
          this.form.deviceOrderFileDTOList.forEach(i => {
            i.status = null;
            i.applyNo = this.form.applyNo || '0';
            i.oldToNew = this.form.oldToNew || '0';
            i.deviceSource = this.form.deviceSource || '1102861334544385';
            i.operation = this.form.operation || '0';
            i.receiveUnit = this.form.receiveUnit;
            i.receiveUnitName = this.form.receiveUnitName;
            i.receiveDutyDept = this.form.receiveDutyDept;
            i.receiveDutyDeptName = this.form.receiveDutyDeptName;
            i.receiveDutyGroup = this.form.receiveDutyGroup;
            i.receiveDutyGroupName = this.form.receiveDutyGroupName;
          })
          // 修改流程状态
          let processApi = null
          if (workerStatus === 0) processApi = submitProcess
          else processApi = rejectProcess

          let operationFlag = 0;
          //投运工单来源 0 设备申请生成 1 手动新增
          if (!this.form.applyNo) {
            operationFlag = 1
          }
          //驳回
          let cerateRes = await this.$asyncCatchApi(processApi, {
            assignees: [],
            businessKey: this.form.applyNo || this.form.operationNo,
            comment: this.comment || "",
            participantType: "2",
            processDefinitionKey: 'bpm_sbsqckty',
            taskType: "1",
            variable: {operationFlag: operationFlag},
            //operationType	投运工单来源 0 设备申请生成 1 手动新增
          })
          if (cerateRes[0] != null) {
            this.loading = false
            return
          }
          let params = {
            taskDefinitionKey: cerateRes[1].data[0].taskDefinitionKey,
            id: this.form.id,
            workerStatus: workerStatus,//0发起 1拒绝
            comment: this.comment || "",
            examineRole: cerateRes[1].msg,
            examineType: "2",
            ...this.form
          };

          let cerateRes2 = await this.$asyncCatchApi(checkDevOperationStatus, params) //  cerateRes[1].code
          if (cerateRes2[0]) {
            this.loading = false
            return
          }
          let updateRes = await this.$asyncCatchApi(updateDevOperationStatus, params)
          if (updateRes[0] != null) {
            return;
          }
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.handleReset();
          // //暂存
          // submit(this.form).then(() => {
          //   this.$message({
          //     type: "success",
          //     message: "操作成功!"
          //   });
          //   this.handleReset();
          // }, error => {
          //    
          // });
        }
      })
    },
    handleReset() {
      //返回
      this.$closePage('/operation/devOperation')
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
    loadDetail(id) {
      getDetail({id: id}).then(res => {
        this.form = res.data;
        this.form.deviceSource = this.form.deviceSource + '';
        this.form.oldToNew = this.form.oldToNew + '';
        //投运类型
        this.oldToNew = this.form.oldToNew;
        //申请
        this.applyForm = this.form.deviceApplyVO || {}
        this.outForm = this.form.deviceOutboundVO || {}
        this.deviceList = this.form.deviceOperationDetailDTOList || [];
        if (this.oldToNew == '1') {
          //"1"  "设备投运"
          this.deviceList2 = this.form.deviceOperationDetailVOList || [];
          this.deviceList1 = [];
        } else {
          //"0"  "以旧换新"
          this.deviceList2 = [];
          this.deviceList1 = this.form.deviceOperationDetailVOList || [];
        }
        //加载文件
        this.fileList = this.form.deviceOrderFileDTOList || []
        this.fileList.forEach(i => {
          i.name = i.fileName,
            i.url = i.fileUrl
        })
      });
    },
    currentChange(currentPage) {
      //分页 设备列表 点击第几页
      this.page.currentPage = currentPage;
      this.loadDeviceDataList();
    },
    sizeChange(pageSize) {
      //切换设备列表  每页数量
      this.page.pageSize = pageSize;
      this.loadDeviceDataList();
    },
    handleDelete(row) {
      //删除
      let index = null;
      //选择弹框 选择cmdb设备
      if (this.oldToNew == '1') {
        //"1"  "设备投运"
        for (let i = 0; i < this.deviceList2.length; i++) {
          if (this.deviceList2[i] == row) {
            index = i;
            break;
          }
        }
        this.deviceList2.splice(index, 1)
      } else {
        //"0"  "以旧换新"
        for (let i = 0; i < this.deviceList1.length; i++) {
          if (this.deviceList1[i] == row) {
            index = i;
            break;
          }
        }
        this.deviceList1.splice(index, 1)
      }
    },
    selectDevice() {
      //弹框 选择设备
      this.deviceSelectSync = true
    },
    selectDeviceHandler(list) {
      //选择弹框 选择cmdb设备
      if (this.oldToNew == '1') {
        //"1"  "设备投运" 1
        this.deviceList1 = [];
        this.deviceList2.forEach((it, idx) => {
          it.deviceId = it.id
          it.id = null;
          if (list && list.length >= idx) {
            this.deviceList2[idx] = {
              ...it,
              deviceMac: list[idx].MAC,
              deviceCode: list[idx].deviceCode,
              erpAssetCode: list[idx].erpAssetCode,
              factoryNumber: list[idx].factoryNumber,
              deviceName: list[idx].deviceName,
              operationUnit: list[idx].operationUnit,
              operationDept: list[idx].operationDept,
              operationUnitName: list[idx].operationUnitName,
              operationDeptName: list[idx].operationDepName,
              operationUse: list[idx].operationUse,
              operationLevel: list[idx].operationLevel,
              operationTel: list[idx].operationTel,
              deviceOldMac: list[idx].MAC,
              uuidOld: list[idx].uuid,
              deviceCid: list[idx].ciId,
              deviceIp: list[idx].IP,
              deviceNetworkType: list[idx].networkAccessMethod,
              deviceStatus: null,//list[idx].deviceStatus,
              deviceSubnet: list[idx].subnetId,
              deviceSubnetName: list[idx].subnetName,
              typeCode: list[idx].netWorkCode,
              networkType: list[idx].netWork,
              operationGrade: list[idx].operationLevel,
              operationGradeCode: list[idx].operationLevelCode,
              operationPhone: list[idx].operationTel,
              userPhone: list[idx].operationTel,
              userName: list[idx].user,
              userCard: list[idx].deviceUserIDCard,
              oldToNew: this.oldToNew,
              deviceSource: this.form.deviceSource,
              deviceUuid: list[idx].uuid,
            }
          }
        })
        this.deviceList2.push({})
        this.deviceList2.pop()
        this.$refs.deviceTable2.$forceUpdate()
      } else {
        //"0"  "以旧换新"
        this.deviceList2 = [];
        this.deviceList1.forEach((it, idx) => {
          //it.id = null;
          if (list && list.length >= idx) {
            //赋值
            this.deviceList1[idx] = this.cpAttrToBean(it, list[idx]);
          }
        })
        this.loading = false;
        this.$refs.deviceTable1.$forceUpdate()
        this.deviceList1.push({})
        this.deviceList1.pop()
      }
      this.$forceUpdate()
    },
    cpAttrToBean(device, cmdbData) {
      //依旧换新 赋值
      return {
        ...device,
        oldDeviceCode: cmdbData.deviceCode,
        oldDeviceCid: cmdbData.ciId,
        oldDeviceIp: cmdbData.IP,
        oldDeviceId: cmdbData.id,
        oldDeviceUuid: cmdbData.uuid,
        oldDeviceName: cmdbData.deviceName,
        oldErpAssetCode: cmdbData.erpAssetCode,
        oldFactoryNumber: cmdbData.factoryNumber,
        oldDeviceStatus: '退运在库',
        oldDeviceReceivePhone: cmdbData.uuid,
        oldDeviceReceiveUse: cmdbData.uuid,

        // oldDeviceCid	旧设备CMDB的Cid		false
        // oldDeviceCode	旧设备设备编码		false
        // oldDeviceId	旧设备CMDB的id		false
        // oldDeviceIp	旧设备ip		false
        // oldDeviceName	旧设备设备名称		false

        // oldDeviceReceivePhone	旧设备责任人联系方式		false
        // oldDeviceReceiveUse	旧设备责任人		false
        // oldDeviceStatus	旧设备状态		false
        // oldDeviceUuid	旧设备CMDB的UUid		false
        // oldErpAssetCode	旧设备ERP资产编码		false
        // oldFactoryNumber	旧设备出厂序列号


        // deviceMac:list[idx].MAC,
        // deviceCode:list[idx].deviceCode,
        // erpAssetCode:list[idx].erpAssetCode,
        // factoryNumber:list[idx].factoryNumber,
        // deviceName:list[idx].deviceName,
        // operationUnit:list[idx].operationUnit,
        // operationDept:list[idx].operationDept,
        // operationUnitName:list[idx].operationUnitName,
        // operationDeptName:list[idx].operationDepName,
        // operationUse:list[idx].operationUse,
        // operationLevel:list[idx].operationLevel,
        // operationTel:list[idx].operationTel,
        // deviceOldMac:list[idx].MAC,
        // uuidOld:list[idx].uuid,
        // deviceCid: list[idx].ciId,
        // deviceIp: list[idx].IP,
        // deviceUuid:list[idx].uuid,
        // deviceNetworkType: list[idx].networkAccessMethod,
        // deviceStatus: null,//list[idx].deviceStatus,
        // deviceSubnet: list[idx].subnetId,
        // deviceSubnetName: list[idx].subnetName,
        // typeCode: list[idx].netWorkCode,
        // networkType: list[idx].netWork,
        // operationGrade: list[idx].operationLevel,
        // operationGradeCode: list[idx].operationLevelCode,
        // operationPhone: list[idx].operationTel,
        // userPhone: list[idx].operationTel,
        // userName: list[idx].user,
        // userCard: list[idx].deviceUserIDCard,
        // oldToNew: this.oldToNew,
        // deviceSource: this.form.deviceSource,
        // deviceUuid:list[idx].uuid,
      };
    },
    getAttachId(attachId) {
      this.form.attachId = attachId
    },
    beforeOpen() {
      //加载默认数据
      this.form.oldToNew = this.oldToNew;
      this.form.receiveUnit = this.userDetail.ownerUnit || ''
      this.form.receiveUnitName = this.userDetail.ownerUnitName || ''
      this.form.receiveDutyDept = this.userDetail.propertyDept || ''
      this.form.receiveDutyDeptName = this.userDetail.propertyDeptName || ''
      this.form.applyUserName = this.userDetail.userName || ''
      this.form.applyUser = this.userDetail.userId || ''
      this.form.applyDate = this.userDetail.systemDateTime || ''
    },
    selectFileHandler(file) {
      //新增文件
      this.fileList = []
      if (file) {
        this.fileList.push(file)
        this.form.deviceOrderFileDTOList = []
        this.form.deviceOrderFileDTOList.push(file)
      }
    },
    // eslint-disable-next-line no-unused-vars
    handleEdit(row, idx) {
      //旧设备信息编辑
      this.deviceEditIdx = idx;
      this.deviceEditRow = row;
      this.deviceEditSync = true;
    },
    editDeviceHandler(row) {
      //编辑设备
      this.deviceEditRow = row;
      this.deviceEditSync = false;
      if (this.oldToNew == '1') {
        this.deviceList2[this.deviceEditIdx] = row
        this.$refs.deviceTable2.$forceUpdate()
        this.deviceList2.push({})
        this.deviceList2.pop()
      } else {
        this.deviceList1[this.deviceEditIdx] = row
        this.$refs.deviceTable1.$forceUpdate()
        this.deviceList1.push({})
        this.deviceList1.pop()
      }
      this.$forceUpdate()
    },
    checkDeviceList(list) {
      //判断旧设备信息 变更原因是否为主
      let msgs = '';
      list.forEach(item => {
        if (this.oldToNew == '0') {
          //"0"  "以旧换新"
          if (!item.oldDeviceCode) {
            msgs = msgs + '旧设备信息不能为空，'
          }
          if (!item.changePerson) {
            msgs = msgs + '更换原因不能为空，'
          }
        }
        if (!item.userName || !item.userName || !item.userName) {
          msgs = msgs + '使用人信息不能为空，'
        }
      })
      if (msgs) {
        this.$message({type: "warning", message: "请检查投运设备列表," + msgs});
        return true;
      }
      return false;
    }
  },
}
</script>
<style lang="scss" scoped>
.formLabel {
  line-height: 16px;
  display: block;
}

.tableItem {
  text-align: left;

  p {
    margin: 0;
    line-height: 18px;
  }

}
</style>
