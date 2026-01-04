<template>
  <div class="cabinetsAdd">
    <el-dialog :close-on-click-modal="false"
               :before-close="() => $emit('close')"
               :show-close="true"
               append-to-body
               :visible.sync="isShow"
               :title="configId == null || configId === ''?'新增':'编辑'"
               width="1200px"
               top="10vh"
               v-el-drag-dialog>
      <div v-loading="pageLoading" class="d_ph">
        <el-form
          ref="submitForm"
          :model="formDetail"
          label-width="180px"
          label-position="center"
          label-suffix=":"
          size="small"
          :rules="rules"
          class="el_fp">
          <el-collapse v-model="activeName">
            <el-collapse-item title="公共属性（25项）" name="公共属性">
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item label="设备分类" prop="deviceCategoryCode">
                    <el-select v-model="formDetail.deviceCategoryCode" placeholder="请选择设备分类" clearable disabled>
                      <el-option v-for="dict in deviceCategoryList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备类型" prop="deviceTypeCode">
                    <el-select v-model="formDetail.deviceTypeCode" placeholder="请选择设备类型" clearable disabled>
                      <el-option v-for="dict in deviceTypeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="制造商" prop="makerCode">
                    <el-select v-model="formDetail.makerCode" filterable placeholder="请选择制造商" clearable @change="makerCodeChange">
                      <el-option v-for="dict in makerCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="品牌" prop="brandCode">
                    <el-select v-model="formDetail.brandCode" filterable placeholder="请选择品牌" clearable @change="brandCodeChange" :disabled="!formDetail.makerCode">
                      <el-option v-for="dict in brandCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="系列" prop="seriesCode">
                    <el-select v-model="formDetail.seriesCode" filterable placeholder="请选择系列" clearable @change="seriesCodeChange" :disabled="!formDetail.brandCode">
                      <el-option v-for="dict in seriesCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="型号" prop="deviceModelCode">
                    <el-select v-model="formDetail.deviceModelCode" filterable placeholder="请选择型号" clearable @change="deviceModelCodeChange" :disabled="!formDetail.seriesCode">
                      <el-option v-for="dict in deviceModelCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="标准全称" prop="fullName">
                    <el-input v-model="formDetail.fullName" placeholder="请填写标准全称" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备来源" prop="deviceSourceCode">
                    <el-select v-model="formDetail.deviceSourceCode" @change="deviceSourceCodeChange" placeholder="请选择设备来源" clearable>
                      <el-option v-for="dict in deviceSourceCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备状态" prop="deviceStatusCode">
                    <el-select v-model="formDetail.deviceStatusCode" placeholder="请选择设备状态" clearable disabled>
                      <el-option v-for="dict in deviceStatusCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出厂日期" prop="factoryDate">
                    <el-date-picker v-model="formDetail.factoryDate" value-format="yyyy-MM-dd" placeholder="请输入出厂日期" clearable></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="服务到期时间" prop="serviceExpDate">
                    <el-date-picker v-model="formDetail.serviceExpDate" value-format="yyyy-MM-dd" placeholder="请输入服务到期时间" clearable></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="投运日期" prop="oprtDate">
                    <el-date-picker v-model="formDetail.oprtDate" value-format="yyyy-MM-dd" placeholder="请输入投运日期" clearable></el-date-picker>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                  <el-form-item label="退运日期" prop="retireDate">
                    <el-date-picker v-model="formDetail.retireDate" value-format="yyyy-MM-dd" placeholder="请输入退运日期" clearable></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="IP地址" prop="IP">
                    <el-input v-model="formDetail.IP" placeholder="请填写IP地址" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="MAC地址" prop="MAC">
                    <el-input v-model="formDetail.MAC" placeholder="请填写MAC地址" clearable></el-input>
                  </el-form-item>
                </el-col> -->
                <el-col :span="12">
                  <el-form-item label="所属网络" prop="netWorkCode">
                    <el-select v-model="formDetail.netWorkCode" placeholder="请选择所属网络" clearable>
                      <el-option v-for="dict in netWorkCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="安装地点" prop="installationSite">
                    <el-input v-model="formDetail.installationSite" placeholder="请填写安装地点" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="责任人" prop="receivingPerson">
                    <el-input v-model="formDetail.receivingPerson" placeholder="请填写责任人" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="责任人联系方式" prop="receivingTel">
                    <el-input v-model="formDetail.receivingTel" placeholder="请填写责任人联系方式" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="责任人统一权限账号" prop="receivePersonUnifiedAcc">
                    <el-input v-model="formDetail.receivePersonUnifiedAcc" placeholder="请填写责任人统一权限账号" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="责任人身份证" prop="receivingIDCard">
                    <el-input v-model="formDetail.receivingIDCard" placeholder="请填写责任人身份证" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出厂序列号" prop="sn">
                    <el-input v-model="formDetail.sn" placeholder="请填写出厂序列号" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备增加方式" prop="deviceAddTypeCode">
                    <el-select v-model="formDetail.deviceAddTypeCode" placeholder="请选择设备增加方式" clearable>
                      <el-option v-for="dict in deviceAddTypeCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="采购方式" prop="procureTypeCode">
                    <el-select v-model="formDetail.procureTypeCode" placeholder="请选择采购方式" clearable>
                      <el-option v-for="dict in procureTypeCodeList" :key="dict.id"  :label="dict.name" :value="dict.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="ERP资产编码" prop="assetCodeErp">
                    <el-input v-model="formDetail.assetCodeErp" placeholder="请填写ERP资产编码" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="领用单位" prop="receiveUnit">
                    <xt-tree-lzay-select :formValue="formDetail.receiveUnit"
                                   :selectType="'CORP'"
                                   @getTreeItem="getuseApplyUnit"
                    ></xt-tree-lzay-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="领用部门" prop="receiveDeptCode">
                    <xt-tree-lzay-select :formValue="formDetail.receiveDept"
                                   :unit-id="formDetail.receiveUnitCode"
                                   :selectType="'DEPT'"
                                   @getTreeItem="getuseApplyDept"
                    ></xt-tree-lzay-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所在仓库" prop="inWarehouseCode">
                    <el-select v-model="formDetail.inWarehouseCode" placeholder="请选择所在仓库" clearable>
                      <el-option v-for="dict in inWarehouseCodeList" :key="dict.uuid"  :label="dict.warehouseName" :value="dict.uuid"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>

            <el-collapse-item title="特有属性（3项）" name="特有属性">
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item label="机柜容量(U)" prop="cabinetCapacity">
                    <el-select v-model="formDetail.cabinetCapacity" placeholder="请选择机柜容量(U)" clearable>
                      <el-option :label="12" :value="12"></el-option>
                      <el-option :label="24" :value="24"></el-option>
                      <el-option :label="32" :value="32"></el-option>
                      <el-option :label="42" :value="42"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="布线节点数(个)" prop="wiringNodeNo">
                    <el-input v-model="formDetail.wiringNodeNo" placeholder="请填写布线节点数(个)" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所属机房" prop="computerRoomCode">
                    <el-select v-model="formDetail.computerRoomCode" @change="computerRoomChange" placeholder="请选择所属机房" clearable disabled>
                      <el-option v-for="dict in roomList" :key="dict.uuid"  :label="dict.roomName" :value="dict.uuid"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-form>


        <div class="submit_btn">
          <el-button :loading="saveLoading" type="primary" size="mini" @click="submit">新 增</el-button>
          <el-button size="small" @click="$emit('close')">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {mapState, mapGetters} from "vuex";
import {getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import {targetciSearch} from "@/api/system/ciModel";
import {getWareDictList} from "@/api/device/warehouse";
import {getRoomList} from "@/api/device/resoureroom";
import {stockAdd} from "@/api/device/resourecabinets";
import checkProps from "./utils/checkProps.js";



export default {
  components: {xtTreeLzaySelect},
  props: ['isShow', "configId", "ciId", 'editParams', 'computerRoomCode', 'computerRoom'],
  data() {
    var serviceExpDateCheck = (rule, value, callback)=>{
      
      //服务到期时间 > 出厂日期
      let fwdqDateStr = this.formDetail['serviceExpDate'];
      let ccDateStr = this.formDetail['factoryDate'];
      if (this.isEmpty(fwdqDateStr)) {
        callback(new Error('服务到期日期不能为空'));
        return;
      } else {
        let date1 = new Date(fwdqDateStr.replace(/-/g, "/"));
        if (!this.isEmpty(ccDateStr)) {
          let date2 = new Date(ccDateStr.replace(/-/g, "/"));
          if ((date1.getTime() - date2.getTime()) <= 0) {
            callback(new Error('服务到期日期必须大于出厂日期'));
            return;
          }else{
            callback();
            return;
          }
        } else {
          callback()
          return;
        }
      }

    }

    var IPCheck = (rule, value, callback)=>{
      
      if (value) {
        let reg = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(value) === false) {
          callback(new Error('IP地址格式有误'))
        } else {
          callback()
        }
      } else {
        callback('请输入IP地址')
      }

    }

    var MACCheck = (rule, value, callback)=>{
      /*MAC地址校验*/
      if (value) {
        let reg = /^[A-Fa-f0-9]{1,2}:[A-Fa-f0-9]{1,2}:[A-Fa-f0-9]{1,2}:[A-Fa-f0-9]{1,2}:[A-Fa-f0-9]{1,2}:[A-Fa-f0-9]{1,2}$/;
        if (reg.test(value) === false) {
          callback(new Error('MAC地址格式有误（示例: FC:34:97:65:37:17）'))
        } else {
          callback()
        }
      } else {
        callback('请输入MAC地址')
      }
      

    }
    var oprtDateCheck = (rule, value, callback)=>{
      // 因为只有新增无修改，所以不用考虑首次投运日期的情况
      let tyDateStr = this.formDetail['oprtDate'];
      if (this.isEmpty(tyDateStr)) {
        callback(new Error('投运日期不能为空'));
        return;
      } else {
        /*投运日期<=当前时间*/
        let date1 = new Date(tyDateStr.replace(/-/g, "/"));
        if ((date1.getTime() - new Date().getTime()) > 0) {
          callback(new Error('投运日期必须小于当前日期'));
          return;
        }else{
          callback();
          return;
        }
      }


      // /*首次投运日期<=投运日期<=当前时间*/
      // let tyDateStr = this.formDetail['oprtDate'];
      // let firstTyDateStr = this.formDetail['oprtDateFirst'];
      // if (this.isEmpty(tyDateStr)) {
      //   callback(new Error('投运日期不能为空'));
      //   return;
      // } else {
      //   let date1 = new Date(tyDateStr.replace(/-/g, "/"));
      //   if (!this.isEmpty(firstTyDateStr)) {
      //     let date2 = new Date(firstTyDateStr.replace(/-/g, "/"));
      //     //(date1.getTime() - new Date().getTime())<=0
      //     if ((date1.getTime() - date2.getTime()) < 0) {
      //       callback(new Error(`投运日期必须大于首次投运日期(${firstTyDateStr})`));
      //       return;
      //     } else if ((date1.getTime() - new Date().getTime()) > 0) {
      //       callback(new Error(`投运日期必须小于当前时间`));
      //       return;
      //     }
      //   } else if ((date1.getTime() - new Date().getTime()) > 0) {
      //     callback(new Error('投运日期必须小于当前日期'));
      //     return;
      //   }
      // }

    }
    var receivingIDCardCheck = (rule, value, callback)=>{
      if (value) {
          if (checkProps.checkCode(value)) {
            if (checkProps.checkDate(value.substring(6, 14))) {
              if (checkProps.checkProv(value.substring(0, 2))) {
                callback();
              } else {
                callback(new Error(`身份证开头${value.substring(0, 2)}省份代码错误`));
              }
            } else {
              callback(new Error('身份证出生年月错误'));
            }
          } else {
            callback(new Error('身份证号不正确'));
          }

        } else {
          callback(new Error('请输入责任人身份证'))
        }
    }

    var factoryDateCheck = (rule, value, callback)=>{
      /*出厂日期<采购日期<=当前时间*/
      let ccDateStr = this.formDetail['factoryDate'];
      if (this.isEmpty(ccDateStr)) {
        callback(new Error('出厂日期不能为空'));
        return;
      } else {
        let date1 = new Date(ccDateStr.replace(/-/g, "/"));
        if ((date1.getTime() - new Date().getTime()) > 0) {
          callback(new Error('出厂日期必须小于当前日期'));
          return;
        }else{
          callback()
          return
        }
      }
      
    }
    var retireDateCheck = (rule, value, callback)=>{
      /*投运日期<=退运日期<=当前时间*/
      let tuiyDateStr = this.formDetail['retireDate'];
      let touyDateStr = this.formDetail['oprtDate'];
      if (this.isEmpty(tuiyDateStr)) {
        callback(new Error('退运日期不能为空'));
        return;
      } else {
        let date1 = new Date(tuiyDateStr.replace(/-/g, "/"));
        if (!this.isEmpty(touyDateStr)) {
          let date2 = new Date(touyDateStr.replace(/-/g, "/"));
          if ((date1.getTime() - date2.getTime()) < 0) {
            callback(new Error(`退运日期不能小于投运日期(${touyDateStr})`));
            return;
          } else if ((date1.getTime() - new Date().getTime()) > 0) {
            callback(new Error(`退运日期必须小于当前时间`));
            return;
          }else{
            callback()
            return
          }
        } else if ((date1.getTime() - new Date().getTime()) > 0) {
          callback(new Error('退运日期必须小于当前日期'));
          return;
        }
      }
      

    }


    
    


    return {
      rules: {//校验规则
        deviceCategoryCode: [
          { required: true, message: '设备分类不能为空', trigger: 'change' }
        ],
        deviceTypeCode: [
          { required: true, message: '设备类型不能为空', trigger: 'change' }
        ],
        makerCode: [
          { required: true, message: '制造商不能为空', trigger: 'change' }
        ],
        brandCode: [
          { required: true, message: '品牌不能为空', trigger: 'change' }
        ],
        seriesCode: [
          { required: true, message: '系列不能为空', trigger: 'change' }
        ],
        deviceModelCode: [
          { required: true, message: '型号不能为空', trigger: 'change' }
        ],
        fullName: [
          { required: true, message: '标准全称不能为空', trigger: 'blur' }
        ],
        deviceSourceCode: [
          { required: true, message: '设备来源不能为空', trigger: 'change' }
        ],
        deviceStatusCode: [
          { required: true, message: '设备状态不能为空', trigger: 'change' }
        ],
        


        serviceExpDate: [
          // { required: true, message: '服务到期时间不能为空', trigger: 'change' }
          { required: true, validator: serviceExpDateCheck, trigger: 'change' }
        ],
        // 设备状态 在运
        // IP: [
        //   { required: true, validator: IPCheck, trigger: 'change' }
        // ],
        // // 设备状态 在运
        // MAC: [
        //   { required: true, validator: MACCheck, trigger: 'change' }
        // ],
        // 设备状态 在运
        // netWorkCode: [
        //   { required: true, message: '所属网络不能为空', trigger: 'change' }
        // ],
        // 设备状态 在运
        oprtDate: [
          { required: true, validator: oprtDateCheck, trigger: 'change' }
          // { required: true, message: '投运日期不能为空', trigger: 'change' }
        ],
        // 设备状态 在运
        installationSite: [
          { required: true, message: '安装地点不能为空', trigger: 'change' }
        ],
        // 设备状态 在运
        receivingTel: [
          { required: true, message: '责任人联系方式不能为空', trigger: 'blur' }
          // ,{
          //   pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
          //   message: "请输入正确的手机号码",
          //   trigger: "blur"
          // }
        ],
        // 设备状态 在运
        receivePersonUnifiedAcc: [
          { required: true, message: '责任人统一权限账号不能为空', trigger: 'change' }
        ],
        // 设备状态 在运
        receivingIDCard: [
          { required: true, validator: receivingIDCardCheck, trigger: 'change' }
        ],
        // 设备状态 在运
        receivingPerson: [
          { required: true, message: '责任人不能为空', trigger: 'blur' }
        ],
        // 设备来源 统一纳管--------------------------------------
        deviceAddTypeCode: [
          { required: false, message: '设备增加方式不能为空', trigger: 'change' }
        ],
        procureTypeCode: [
          { required: true, message: '采购方式不能为空', trigger: 'change' }
        ],
        factoryDate: [// 出厂日期
          { required: true, validator: factoryDateCheck, trigger: 'change' }
          // { required: true, message: '出厂日期不能为空', trigger: 'change' }
        ],
        // // 设备状态 退运在库
        // retireDate: [
        //   { required: false, validator: retireDateCheck, trigger: 'change' }
        // ],
        // 设备状态 库存备用 退运在库
        inWarehouseCode: [
          { required: false, message: '所在仓库不能为空', trigger: 'change' }
        ],
        // 设备来源 统一纳管--------------------------------------
        assetCodeErp: [
          { required: false, message: 'ERP资产编码不能为空', trigger: 'blur' }
        ],
        // 设备状态 在运
        receiveDeptCode: [
          { required: true, message: '领用部门不能为空', trigger: 'change' }
        ],


        cabinetCapacity: [
          { required: true, message: '机柜容量(U)不能为空', trigger: 'change' }
        ],
      },

      formDetail: {
        brandCode: undefined,
        seriesCode: undefined,
        deviceModelCode: undefined,
        deviceStatusCode: '1105089449492480'
      },
      activeName: ['公共属性', '特有属性'],

      deviceCategoryList: [],
      deviceTypeList: [],
      makerCodeList: [],
      brandCodeList: [],
      seriesCodeList: [],
      deviceModelCodeList: [],
      deviceSourceCodeList: [],
      deviceStatusCodeList: [], // 设备状态
      netWorkCodeList: [], // 所属网络
      deviceAddTypeCodeList: [],
      procureTypeCodeList: [],
      inWarehouseCodeList: [],
      roomList: [],
      cabinetCodeList: [],
      saveLoading: false
    }
  },
  computed: {
    ...mapGetters(["permission","userDetail"]),
    ...mapState({
      userInfo: state => state.user.userInfo,
      userDetail: state => state.user.userDetail
    })
  },
  watch: {
    // cabinetsId() {
    //   this.getList()
    //   this.getDetail()
    // }
  },
  mounted() {
    // 加载字典
    this.getDictCmdbList('1097745625841664') // 设备分类(辅助设备)
    this.getDictCmdbListPid('1097745969774592', '1097757118234624') // 设备类型
    this.getDictCmdbList('1082610161090560') // 制作商
    this.getDictCmdbList('1102860579569664') // 设备来源
    this.getDictCmdbList('1103423111233536') // 设备状态
    this.getDictCmdbList('1107942968721408') // 所属网络
    this.getDictCmdbList('1083864635473920') // 设备增加方式

    //采购方式
    targetciSearch({attrId: '1131258181910528', currentPage: 1, pageSize: 999, keyword: ''}).then(res => {
      this.procureTypeCodeList = res.Return;
    });
    //加载仓库列表
    getWareDictList({ownerUnitId:this.userDetail.ownerUnit||''}).then(res => {
      this.inWarehouseCodeList  = res.data;
    });
    
    getRoomList({current:1,size:999999,maintenanceUnit:this.userDetail.ownerUnit}).then(res => {
      this.roomList = res.data.records;
    })
    

    // this.getDictCmdbList('1082554947272704') // 品牌
    // this.getDictCmdbList('1082609011851264') // 系列
    // this.getDictCmdbList('1082608047161344') // 型号
    
    this.initForm()
  },
  methods: {
    isEmpty(value) {
      if (value == null || value === '') {
        return true;
      }
      return false
    },
    computerRoomChange(val){
      let current = this.roomList.filter(el=>el.uuid == val)
      this.formDetail.computerRoom = current[0].roomName
    },

    submit() {
      // this.saveLoading = true;
      // this.$refs.submitForm.clearValidate();

      this.$refs.submitForm.validate((valid) => {

        if (valid) {
          //新增
          stockAdd(this.formDetail).then(res => {
            this.$message({type: 'success', message: '新增成功！'});
            let datas = res.data
            datas.ciEntityId = datas.id
            datas.name = datas.deviceName
            this.$store.commit('SET_UPDATE_FORM', {handleType: '机柜新增', dataType: 'room', nodeDetail: datas})
            this.$emit('close')
          })
        }else{
          this.$message.warning("请将信息填写完整!")
        }
      })
    },

    getuseApplyUnit(val) {
      this.formDetail.receiveUnitCode = val.id
      this.formDetail.receiveUnit = val.fullName;

      this.formDetail.receiveDeptCode = null;
      this.formDetail.receiveDept = null;
      this.$forceUpdate();
    },
    getuseApplyDept(val) {
      this.formDetail.receiveDeptCode = val.id;
      this.formDetail.receiveDept = val.fullName;
      this.$forceUpdate();
    },

    makerCodeChange(val) {
      this.getDictCmdbListPid('1082554947272704', val) // 品牌
      this.formDetail.brandCode = ""
      this.formDetail.seriesCode = ""
      this.formDetail.deviceModelCode = ""
    },
    brandCodeChange(val) {
      this.getDictCmdbListPid('1082609011851264', val) // 系列
      this.formDetail.seriesCode = ""
      this.formDetail.deviceModelCode = ""

      let current = this.brandCodeList.filter(el => el.dictKey == val)[0]
      this.formDetail.brand = current.dictValue;
    },
    seriesCodeChange(val) {
      this.getDictCmdbListPid('1082608047161344', val) // 型号
      this.formDetail.deviceModelCode = ""

      let current = this.seriesCodeList.filter(el => el.dictKey == val)[0]
      this.formDetail.series = current.dictValue;
    },
    deviceModelCodeChange(val) {
      let current = this.deviceModelCodeList.filter(el => el.dictKey == val)[0]
      this.formDetail.deviceModel = current.dictValue;
    },
    deviceSourceCodeChange(val) {
      let current = this.deviceSourceCodeList.filter(el => el.dictKey == val)[0]
      this.formDetail.deviceSource = current.dictValue;

      if(val == '1102861334544385'){ // 统一纳管
        // 设备来源 统一纳管--------------------------------------
        this.rules.deviceAddTypeCode= [
          { required: true, message: '设备增加方式不能为空', trigger: 'change' }
        ],
        // 设备来源 统一纳管--------------------------------------
        this.rules.assetCodeErp= [
          { required: true, message: 'ERP资产编码不能为空', trigger: 'blur' }
        ]
      }else{
        // 设备来源 统一纳管--------------------------------------
        this.rules.deviceAddTypeCode= [
          { required: false, message: '设备增加方式不能为空', trigger: 'change' }
        ],
        // 设备来源 统一纳管--------------------------------------
        this.rules.assetCodeErp= [
          { required: false, message: 'ERP资产编码不能为空', trigger: 'blur' }
        ]
      }


    },
    initForm(){
      this.formDetail.deviceCategoryCode = '1097757118234624' // 辅助设备
      this.formDetail.deviceTypeCode = '1135308277350478' // 机柜

      this.formDetail.computerRoomCode = this.computerRoomCode // 机房uuid
      this.formDetail.computerRoom = this.computerRoom // 机房名称

      this.formDetail.receiveUnitCode = this.userDetail.ownerUnit
      this.formDetail.receiveUnit = this.userDetail.ownerUnitName;
    },
    getDictCmdbList(ciId) { //加载字典
      getDictCmdbList({ciId: ciId}).then(res => {
        if (ciId === '1097745625841664') { // 设备分类
          this.deviceCategoryList = res.data;
        } else if (ciId === '1082610161090560') { // 制造商
          this.makerCodeList = res.data
        }else if(ciId === '1102860579569664'){ // 设备来源
          this.deviceSourceCodeList  = res.data;
        }else if(ciId === '1103423111233536'){ // 设备状态
          this.deviceStatusCodeList  = res.data;
        }else if(ciId === '1107942968721408'){ // 所属网络
          this.netWorkCodeList  = res.data;
        }else if(ciId === '1083864635473920'){ // 设备增加方式
          this.deviceAddTypeCodeList  = res.data;
        }
      });
    },
    getDictCmdbListPid(ciId, pid){
      getDictCmdbListPid({ ciId: ciId, pid: pid }).then(res => {
        if(ciId==='1097745969774592'){ // 设备类型
          this.deviceTypeList = res.data
        } else if (ciId === '1082554947272704') { // 品牌
          this.brandCodeList = res.data
        } else if (ciId === '1082609011851264') { // 系列
          this.seriesCodeList = res.data
        } else if (ciId === '1082608047161344') { // 型号
          this.deviceModelCodeList = res.data
        }
      });
    },
  }
}
</script>
<style lang='scss' scoped>
.d_ph {
  height: 75vh;
}
.el_fp {
  overflow-y: auto;
  height: 70vh;
  padding-right: 12px
}
/deep/ .el-collapse-item__content {
  padding-top: 25px;
}

/deep/ .el-collapse-item__header {
  font-weight: bold;
}

/deep/ .el-date-editor--date{
  width: 100%;
}
</style>