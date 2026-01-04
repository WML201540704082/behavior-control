<template>
  <!-- <basic-container>
    <div class="page_form"></div>
    <div class="page_body"> -->
      <el-scrollbar style="height: 50vh;">
       
        <!-- 设备投运信息 -->
        <formTitle :titleText="'设备投运信息'" :titleType="'page_title'"></formTitle>
        <el-form :model="form" :rules="rules" ref="dataForm" class="xt_form" label-width="110px" disabled>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="投运单号" prop="operationNo" size="small">
                <el-input
                  v-model="form.operationNo"
                  placeholder="自动生成投运单号"
                  clearable
                  maxlength="24"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="责任人" prop="receiveUseName" size="small">
                <el-input v-model="form.receiveUseName" placeholder clearable maxlength="24"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="责任人身份证号" prop="receiveUseCard" size="small">
                <el-input v-model="form.receiveUseCard" placeholder clearable maxlength="24"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="责任人联系方式" prop="receiveUsePhone" size="small">
                <el-input v-model="form.receiveUsePhone" placeholder clearable maxlength="24"></el-input>
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="6">
              <el-form-item label="设备来源" prop="deviceSource">
                <el-select v-model="form.deviceSource" placeholder="请选择设备来源" clearable disabled>
                  <el-option
                    v-for="dict in deviceSourceList"
                    :key="dict.dictKey"
                    :label="dict.dictValue"
                    :value="dict.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label="运维单位" prop="operationUnitName" size="small">
                <el-input
                  v-model="form.operationUnitName"
                  placeholder
                  clearable
                  maxlength="24"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="运维部门" prop="operationDeptName" size="small">
                <el-input
                  v-model="form.operationDeptName"
                  placeholder
                  clearable
                  maxlength="24"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="运维责任人" prop="operationUseName" size="small">
                <el-select v-model="form.operationUseName" placeholder="请选择运维责任人" clearable>
                  <el-option
                    v-for="dict in operationUseList"
                    :key="dict.dictKey"
                    :label="dict.dictValue"
                    :value="dict.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="运维联系电话" prop="operationPhone" size="small">
                <el-input v-model="form.operationPhone" placeholder clearable maxlength="24"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="受理人" prop="applyUserName">
                <el-input
                  v-model="form.applyUserName"
                  placeholder="请输入受理人"
                  clearable
                  style="width:100%"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="受理时间" prop="applyDate">
                <el-date-picker
                  v-model="form.applyDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="系统自动生成"
                  clearable
                  disabled
                ></el-date-picker>
              </el-form-item>
            </el-col>
             <!-- v-if="form.deviceType === '1135308277351017'" -->
            <el-col :span="6">
              <el-form-item label="是否以旧换新" prop="oldToNew">
                <el-radio v-model="form.oldToNew" label="0" key="0" @change="operationRadio">是</el-radio>
                <el-radio v-model="form.oldToNew" label="1" key="1" @change="operationRadio">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 中间设备列表 -->
        <formTitle :titleText="'设备信息列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" @click="addDevice" v-if="!idd">新建设备</el-button>
          </div>
        </formTitle>
        <!-- 以旧换新列表   -->
        <tradeTable v-if="form.oldToNew === '0'" :disabled="!showAudit" :tradeList="deviceList"></tradeTable>
        <!-- 设备投运 v-if="false" -->
        <el-table
          v-else
          ref="deviceTable"
          :data="deviceList"
          v-loading="loading"
          size="small"
          height="380px"
        >
          <el-table-column type="selection" width="30" fixed="left"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="userName" label="使用信息">
            <template slot-scope="scope">
              <div class="tableItem">
                <p class="table_text">使用类型：{{ scope.row.userType == '1' ? '个人' : '公用' }}</p>
                <p class="table_text">使用人：{{ scope.row.userName }}</p>
                <p class="table_text">使用人联系方式：{{ scope.row.userPhone }}</p>
                <p class="table_text">使用人身份证号：{{ scope.row.userCard }}</p>
                <p class="table_text">责任人：{{ scope.row.receiveUseName }}</p>
                <p class="table_text">责任人联系方式：{{ scope.row.receiveUsePhone }}</p>
                <p class="table_text">责任人身份证号：{{ scope.row.receiveUseCard }}</p>
                <p class="table_text">安装地点：{{ scope.row.address }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userPhone" label="设备基本信息">
            <template slot-scope="scope">
              <div class="tableItem">
                <p class="table_text" v-if="form.operationType === '0'">ERP编码：{{ scope.row.erpAssetCode }}</p>
                <p class="table_text" v-if="form.oldToNew == '0'">旧设备编码：{{ scope.row.oldDeviceCode }}</p>
                <p class="table_text">设备编码：{{ scope.row.deviceCode }}</p>
                <p class="table_text">出厂序列号：{{ scope.row.sn||scope.row.factoryNumber }}</p>
                <p class="table_text">品牌/系列/型号：{{ scope.row.brandName + '/' +  scope.row.seriesName + '/' + scope.row.deviceModelName}}</p>
                <p class="table_text">标准全称：{{ scope.row.fullName }}</p>
              </div>
            </template>
          </el-table-column>
          <!-- 网络类型不是交换机时展示 -->
          <el-table-column prop="userCard" label="网络信息" v-if="deviceList[0] && deviceList[0].deviceType != '1135308294128009'">
            <template slot-scope="scope">
              <div class="tableItem">
                <p class="table_text">所属网络：{{ scope.row.networkTypeName }}</p>
                <p class="table_text">所属子网：{{ scope.row.deviceSubnetName }}</p>
                <p class="table_text">IP地址：{{ scope.row.deviceIp }}</p>
                <p class="table_text">MAC地址：{{ scope.row.deviceMac }}</p>
                <p class="table_text">是否临时：{{ scope.row.temporaryType==0? '是':'否' }}</p>
                <p class="table_text">认证方式：{{ scope.row.is802 }}</p>
              </div>
            </template>
          </el-table-column>
          <!-- 只有是交换机时展示 -->
          <el-table-column prop="userCard" label="特有信息" v-if="deviceList[0] && deviceList[0].deviceType == '1135308294128009'">
            <template slot-scope="scope">
              <div class="tableItem">
                <p class="table_text">机房：{{ scope.row.roomName }}</p>
                <p class="table_text">机柜：{{ scope.row.cabinetsName }}</p>
                <p class="table_text">设备起始高度(U)：{{ scope.row.deviceStartHeight }}</p>
                <p class="table_text">设备终止高度(U)：{{ scope.row.deviceEndHeight }}</p>
                <p class="table_text">SNMP读字符串：{{ scope.row.snmpRead }}</p>
                <p class="table_text">SNMP写字符串：{{ scope.row.snmpWrite }}</p>
                <p class="table_text">工作Vlan：{{ scope.row.vlanNumber }}</p>
                <p class="table_text">用途：{{ scope.row.purpose }}</p>
              </div>
            </template>
          </el-table-column>
           <!-- v-if="deviceList[0] && deviceList[0].deviceCategory == '1097756774301696'" -->
           <!-- 认证信息只有网络分类终端设备有 -->
          <el-table-column prop="address" label="认证信息" width="210px" v-if="deviceList[0] && deviceList[0].deviceCategory == '1097756774301696'">
            <template slot-scope="scope">
              <div class="tableItem">
                <p class="table_text">认证账号：{{ scope.row.authAccount }}</p>
                <p class="table_text">认证密码：{{ scope.row.authPassword }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right" v-if="showAudit">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                v-if="showAudit"
                @click="handleDevEdit(scope.row,scope.$index)"
              >编辑</el-button>
              <!-- <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                v-if="form.oldToNew == '0'"
                @click="handleOldDev(scope.row,scope.$index)"
              >选择旧设备</el-button> -->
            </template>
          </el-table-column>
        </el-table>


        <!-- 审批弹窗 -->
        <operateForm
          v-if="showOperate"
          :isShow="showOperate"
          :orderDeatil="form"
          :orderType="'投运工单'"
          :processKeys="'bpm_sbsqckty'"
          @close="showOperate = false"
          @submitOperate="submitOperate"
        ></operateForm>

        <!-- 修改设备 -->
        <devOperationDeviceEdit
          v-if="showDevEdit"
          :isShow.sync="showDevEdit"
          :deviceSource="form.deviceSource"
          :operationType="form.operationType"
          :devItemDetail="devItemDetail"
          :deviceList="deviceList"
          @close="showDevEdit = false"
          @setVal="editDeviceHandler"
        ></devOperationDeviceEdit>

        <!-- 选择旧设备 -->
        <devOldList
          v-if="showOldDev"
          :isShow.sync="showOldDev"
          :devItemDetail="devItemDetail"
          @close="showOldDev = false"
          @setVal="getOldDev"
        ></devOldList>
      </el-scrollbar>

      
      <!-- <div class="form-btn">
        <el-button v-if="showAudit" :loading="btnLoading" type="primary" size="small" @click="handleAudited">审 批</el-button>
        <el-button class="border-btn" size="small" @click="handleReset">返 回</el-button>
      </div> -->
    <!-- </div> -->

    
  <!-- </basic-container> -->
</template>

<script>
import crypto from "@/util/crypto";
import { getOperationDetail,} from "@/api/operation/deviceoperation";
import { getLogOptList} from "@/api/device/logopt";
import {getDictCmdbList, getDictList} from "@/api/dict";
import {mapGetters} from "vuex";
import { updateDevOperationStatus, checkDevOperationStatus } from "@/api/process/index"

import operateForm from "@/views/personalDesk/components/operateForm.vue";
import step from "@/components/step/index.vue";
import devOperationDeviceEdit from './devOperationDeviceEdit'
import devOldList from './devOldList'
import tradeTable from "./tradeTable.vue"

export default {
  components: { operateForm, step, devOperationDeviceEdit, devOldList, tradeTable },
  props: ['formRouter', 'orderDeatil'],
  data() {
    return{
      btnLoading: false,
      tradeList: [{}],


      idd: undefined,
      showAudit: this.$route.query.isAudit||false,
      form: {
        deviceSource: undefined,
        operationUnitName: undefined,
        operationUseName: undefined,
        operationTel: undefined,
        applyUserName: undefined,
        receiveUnitName: undefined,
      },
      rules: {
        deviceSource: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        applyUserName: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        receiveUnitName: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        // applyDate: [
        //   { required: true, message: "不能为空", trigger: "blur" }
        // ],
        operationUseName: [
          { required: true, message: "运维责任人不能为空", trigger: "blur" }
        ],
        operationTel: [
          { required: true, message: "运维联系电话不能为空", trigger: "blur" }
        ]
      },
      deviceList: [],
      loading: false,
      optList: [],
      // 字典
      operationUseList: [],
      deviceSourceList: [],

      // 弹窗
      comment: '',
      showOperate: false,
      showAddDevice: false,
      showDevEdit: false,
      showOldDev: false,
      devItemDetail: {},
      devListIndex: -1,
    }
  },
  computed: {
    ...mapGetters(["permission", "userDetail"])
  },
  mounted() {
    // 设置页面元素高度
    // this.setPageContentHeight();
    this.idd = this.orderDeatil.id
    this.getDict()
    this.getCmdbDictList('1102860579569664') // 设备来源
    this.getDetail()
    // this.loadLogOptDataList()
  },
  methods: {
    asd(){
      //  let string = `
      //           <p>设备编码:大撒大撒大撒dasdsadsa</p>
      //           <p>认证账户:大撒大撒大撒</p>
      //           <p style="margin-bottom: 10px">认证密码:大撒大撒大撒</p>
      //         `
      let string = `<div class="tk_wrap">
          <div class="tk_title">设备1：</div>
          <div class="tk_con">
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">使用人：ddasdasdsaldjsa</div>
            <div class="kt_item">IP：ddasdasdsaldjsa</div>
            <div class="kt_item">MAC：ddasdasdsaldjsa</div>
            <div class="kt_item">认证用户：ddasdasdsaldjsa</div>
            <div class="kt_item">认证密码：ddasdasdsaldjsa</div>
          </div>
        </div>
        <div class="tk_wrap">
          <div class="tk_title">设备1：</div>
          <div class="tk_con">
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
          </div>
        </div>
        <div class="tk_wrap">
          <div class="tk_title">设备1：</div>
          <div class="tk_con">
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
          </div>
        </div>
        <div class="tk_wrap">
          <div class="tk_title">设备1：</div>
          <div class="tk_con">
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
          </div>
        </div>
        <div class="tk_wrap">
          <div class="tk_title">设备1：</div>
          <div class="tk_con">
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
            <div class="kt_item">设备编码：ddasdasdsaldjsa</div>
          </div>
        </div>`    

            this.$alert(string, '', { dangerouslyUseHTMLString: true, customClass: 'renzhengKuang' })
    },
    operationRadio(){

    },
    getCmdbDictList(code){
      //加载cmdb字典
      let query = {}
      query.ciId = code||'1082372687986688'
      getDictCmdbList( query ).then(res => {
        if(code==='1102238379737088'){
          this.optYearList  = res.data;
        }else if(code==='1102247959527424'){
          this.afterSaleStatusList  = res.data;
        }else if(code==='1082607703228416'){
          this.deviceWBSList = res.data;
        }else if(code==='1097745625841664'){
          this.deviceCategoryList  = res.data;
        }else if(code==='1097745969774592'){
          this.deviceTypeList  = res.data;
          this.deviceTypeListAll  = res.data;
        }else if(code==='1102860579569664'){ // 设备来源
          this.deviceSourceList  = res.data;
        } 
      });
    },
    getDict() {
      // let dictList = ['deviceSource']
      // for(let i=0; i<dictList.length; i++) {
      //   getDictList(dictList[i]).then(res => {
      //     if(dictList[i] == 'deviceSource') this.deviceSourceList = res.data
      //   })
      // }
    },
    getDetail() {
      let params = {}
      if(this.idd){
        params = { id: this.idd }
      }else{
        params = { operationNo: this.orderDeatil.operationNo }
      }

      getOperationDetail(params).then(res => {
        // let resData = res.data;
        // resData.operationPhone = resData.operationPhone && crypto.decryptBySM4(resData.operationPhone) 
        // if( resData.deviceOperationDetailVOList.length>0 ){
        //   resData.deviceOperationDetailVOList.forEach(ele=>{
        //     ele.userPhone = ele.userPhone && crypto.decryptBySM4(ele.userPhone)
        //     ele.userCard = ele.userCard && crypto.decryptBySM4(ele.userCard)
        //     ele.receiveUsePhone = ele.receiveUsePhone && crypto.decryptBySM4(ele.receiveUsePhone)
        //     ele.receiveUseCard = ele.receiveUseCard && crypto.decryptBySM4(ele.receiveUseCard)
        //   })
        // } 


        this.form = res.data
        let devs = this.form.deviceOperationDetailVOList
        if(!this.showAudit){ // 查看状态
          devs.forEach(el=>{
            if(!el.returnWarehouseCode){
              el.returnWarehouseCode = el.returnWarehouseName
            }
          })
        }
        
        this.deviceList = devs || [];
        // console.log(111, this.form.operationType)
        if(this.form.operationType === '0') {
          // 运维单位
          this.form.operationUnit = this.userDetail.ownerUnit
          this.form.operationUnitCode = this.userDetail.ownerUnit || "";
          this.form.operationUnitName = this.userDetail.ownerUnitName || "";
          // 运维部门
          this.form.operationDept = this.userDetail.propertyDept || "";
          this.form.operationDeptName = this.userDetail.propertyDeptName || "";
          // 运维责任人  运维联系电话(班组未开发，暂时回填当前登录人)
          this.form.operationUse = this.userDetail.userId || "";
          this.form.operationUseName = this.userDetail.realName || "";
          this.form.operationPhone = this.userDetail.phone || "";
        }


        this.idd = res.data.id
        this.loadLogOptDataList()
      })
    },
    //加载操作记录
    loadLogOptDataList() {
      getLogOptList(1,20, {logId: this.idd}).then(res => {
        const data = res.data;
        this.optList = data.records;
      });
    },
    async handleAudited() {
      if(!this.comment){
        return this.$message.warning("审批信息不能为空！")
      }

      this.form.comment = this.comment
      this.form.workerStatus = 0

      this.deviceList.forEach(el=>{
        el.operationUnit = this.form.operationUnit
        el.operationUnitName = this.form.operationUnitName
        el.operationDept = this.form.operationDept
        el.operationDeptName = this.form.operationDeptName
        el.operationUse = this.form.operationUse
        el.operationUseName = this.form.operationUseName
        el.operationPhone = this.form.operationPhone
      })


      this.form.deviceOperationDetailDTOList = this.deviceList
      if(this.form.oldToNew == '0') { //以旧换新
        for(let i=0; i<this.deviceList.length; i++) {
          let item = this.deviceList[i]
          if(item.oldDeviceCode == '' || item.oldDeviceCode == null || !item.oldDeviceCode) {
            this.$message({
              type: "warning",
              message: "以旧换新工单请选择旧设备!"
            });
            return
          }




          if(item.deviceMac) {
            let reg_name=/[A-F\d]{2}[:|-][A-F\d]{2}[:|-][A-F\d]{2}[:|-][A-F\d]{2}[:|-][A-F\d]{2}[:|-][A-F\d]{2}/;
            if (!reg_name.test(item.deviceMac) || item.deviceMac.length > 17) {
              return this.$message({
                type: "warning",
                message: `"${item.deviceMac}"MAC地址格式不正确！参考格式:00:24:21:19:BD:E4`
              }); 
            }
          }else{
            return this.$message({
                type: "warning",
                message: `MAC地址不能为空！`
              }); 
          }
        }

      }
      // this.showOperate = true
      this.btnLoading = true
      let cerateRes = await this.$asyncCatchApi(checkDevOperationStatus, this.form) //  cerateRes[1].code
      if( cerateRes[0] ) {
        this.btnLoading = false
        return
      }

      updateDevOperationStatus(this.form).then(res => {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.btnLoading = false
        this.handleReset(res)
      })
    },
    submitOperate() {
      this.showOperate = false
      // this.$closePage('/personalDesk/desk');
      this.$closePage("/operation/devOperation");
    },
    // 返回
    handleReset(res) {
      if(this.$route.query.formRouter) this.$closePage(this.$route.query.formRouter);
      else if(this.formRouter) this.$closePage(this.formRouter);
      else this.$closePage("/operation/devOperation");
      if(res && res.data){
        let string = ''
        let data = res.data
        if(data.length > 0){
          data.forEach((el, index)=>{
            if(el.authAccount){
              // string += `
              //   <p>设备编码:${ el.deviceCode }</p>
              //   <p>认证账户:${ el.authAccount }</p>
              //   <p style="margin-bottom: 10px">认证密码:${ el.authPassword }</p>
              // `

              string += `<div class="tk_wrap">
                  <div class="tk_title">设备${ index+1 }：</div>
                  <div class="tk_con">
                    <div class="kt_item">设备编码：${ el.deviceCode }</div>
                    <div class="kt_item">使用人：${ el.userName }</div>
                    <div class="kt_item">IP：${ el.deviceIp }</div>
                    <div class="kt_item">MAC：${ el.deviceMac }</div>
                    <div class="kt_item">认证账户:${ el.authAccount }</div>
                    <div class="kt_item">认证密码：${ el.authPassword }</div>
                  </div>
                </div>`
            }
          })
          if(string){
            this.$alert(string, '', { dangerouslyUseHTMLString: true, customClass: 'renzhengKuang' })
          }
        }


        // this.$alert(`
        //   <p>设备编码:${ res.data[0].deviceCode }</p>
        //   <p>认证账户:${ res.data[0].authAccount }</p>
        //   <p>认证密码:${ res.data[0].authPassword }</p>
        // `, '', { dangerouslyUseHTMLString: true })
      }


      
    },
    // 设备编辑
    handleDevEdit(row, index) {
      this.showDevEdit = true
      this.devItemDetail = row
      this.devListIndex = index
    },
    
    editDeviceHandler(val) {
      this.$set(this.deviceList, this.devListIndex, val)
      this.showDevEdit = false
      this.$forceUpdate()
    },
    // 旧设备选择
    handleOldDev(row, index) {
      this.showOldDev = true
      this.devListIndex = index
      this.devItemDetail = row
    },
    // 获得旧设备
    getOldDev(val) {
      // this.
      this.showOldDev = false
      // this.$set(this.deviceList;p, this.devListIndex, val)
    }
  }
}
</script>
<style lang="scss" scoped>
  .renzhengKuang{
    width: 620px;
  }
  .tk_wrap{
    /* width: 1000px; */
    margin-left: 20px;
  }
  .tk_title{
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 6px;
    color: #1a1a1a;
  }
  .tk_con{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .kt_item{
    width: 50%;
  }
</style>
<style lang="scss" scoped>
.table_text{
  text-align: left;
  margin: 6px 0;
}
// ::v-deep .el-step:last-of-type .el-step__description, .el-step:last-of-type .el-step__main {
//     padding-right: 10%;
// }
</style>
