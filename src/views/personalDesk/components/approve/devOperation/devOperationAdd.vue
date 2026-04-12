<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <el-scrollbar style="height:calc(100% -  10px - 48px)">
        <!-- 设备投运信息 -->
        <formTitle :titleText="'设备投运信息'" :titleType="'page_title'"></formTitle>
        <el-form :model="form" :rules="rules" ref="dataForm" class="xt_form" label-width="110px">
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
                <el-input v-model="form.operationUseName" placeholder clearable maxlength="24"></el-input>
                <!-- <el-select v-model="form.operationUseName" placeholder="请选择运维责任人" clearable>
                  <el-option
                    v-for="dict in operationUseList"
                    :key="dict.dictKey"
                    :label="dict.dictValue"
                    :value="dict.dictKey"
                  ></el-option>
                </el-select> -->
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
                <el-input v-model="form.applyDate" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 中间设备列表 -->
        <formTitle :titleText="'设备信息列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" @click="addDevice">新建设备</el-button>
          </div>
        </formTitle>
        <!-- 设备投运 -->
        <el-table
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
                <p class="table_text">领用人联系方式：{{ scope.row.receiveUsePhone }}</p>
                <p class="table_text">领用人身份证号：{{ scope.row.receiveUseCard }}</p>
                <p class="table_text">安装地点：{{ scope.row.address }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userPhone" label="设备基本信息">
            <template slot-scope="scope">
              <div class="tableItem">
                <p class="table_text">设备编码：{{ scope.row.deviceCode }}</p>
                <p class="table_text">出厂序列号：{{ scope.row.sn||scope.row.factoryNumber }}</p>
                <p class="table_text">品牌/系列/型号：{{ scope.row.brandName + '/' +  scope.row.seriesName + '/' + scope.row.deviceModelName}}</p>
                <p class="table_text">标准全称：{{ scope.row.fullName }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userCard" label="网络信息" >
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
           <!-- v-if="deviceList[0] && deviceList[0].deviceCategory == '1097756774301696'" -->
          <el-table-column prop="address" label="认证信息" width="120px">
            <template slot-scope="scope">
              <div class="tableItem">
                <p class="table_text">认证账号：{{ scope.row.authAccount }}</p>
                <p class="table_text">认证密码：{{ scope.row.authPassword }}</p>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="remark" label="维护信息" align="center">
            <template slot-scope="scope">
              <div class="tableItem">
                <p>运维单位：{{ scope.row.operationUnitName }}</p>
                <p>运维部门：{{ scope.row.operationDeptName }}</p>
                <p>运维责任人：{{ scope.row.operationUse }}</p>
                <p>运维等级：{{ scope.row.operationLevel }}</p>
                <p>运维联系电话：{{ scope.row.operationTel }}</p>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="handleDevEdit(scope.row,scope.$index)"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                v-if="scope.row.id=='' || scope.row.id==null"
                @click="handleDevDelete(scope.row,scope.index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <!-- 底部按钮 -->
      <div class="form-btn">
        <el-button type="primary" size="small" @click="handleSave('1')" style="margin-left: 50px;">提 交</el-button>
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleSave('2')"
          style="margin-left: 50px;"
        >暂 存</el-button>
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleReset"
          style="margin-left: 50px;"
        >返 回</el-button>
      </div>
    </div>

    <!-- 新增设备 -->
    <devOperationAddSeletDevice
      :deviceList="deviceList"
      v-if="showAddDevice"
      :isShow="showAddDevice"
      @close="showAddDevice = false"
      @submitDev="getDevList"
    ></devOperationAddSeletDevice>

    <!-- 修改设备 -->
    <devOperationDeviceEdit
      :deviceList="deviceList"
      v-if="showDevEdit"
      :isShow.sync="showDevEdit"
      :devItemDetail="devItemDetail"
      @close="showDevEdit = false"
      @setVal="editDeviceHandler"
    ></devOperationDeviceEdit>
  </basic-container>
</template>

<script>
import crypto from "@/util/crypto";
import {
  getOperationDetail,
  operationSubmit,
  operationSave
} from "@/api/operation/deviceoperation";
import { getEmpty } from "@/api/device/devicerecord";
import { getDictList, getDictCmdbList } from "@/api/dict";
import { mapGetters } from "vuex";

import devOperationAddSeletDevice from './devOperationAddSeletDevice'
import devOperationDeviceEdit from './devOperationDeviceEdit'

export default {
  components: { devOperationAddSeletDevice, devOperationDeviceEdit },
  data() {
    return {
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
      // 字典
      operationUseList: [],
      deviceSourceList: [],

      // 弹窗
      showAddDevice: false,
      showDevEdit: false,
      devItemDetail: {},
      devListIndex: -1,
    }
  },
  computed: {
    ...mapGetters(["permission", "userDetail"])
  },
  mounted() {
    // 设置页面元素高度
    this.setPageContentHeight();

    this.getDict()
    this.getCmdbDictList('1102860579569664') // 设备来源
    this.initForm()
  },
  methods: {
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

    initForm() {
      // 编辑 查看详情
      if(this.$route.query.id) { 
        getOperationDetail({ id: this.$route.query.id }).then(res => {
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
          this.deviceList = this.form.deviceOperationDetailVOList || [];
        })
      }
      // 新增
      else {
        // 是否以旧换新 （新增为否）
        this.form.oldToNew = '1';
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
        // 受理人
        this.form.applyUserName = this.userDetail.realName || "";
        this.form.applyUser = this.userDetail.userId || "";
        // 设备来源
        this.form.deviceSource = "1102861753974784";
        getEmpty().then(res => {
          this.form.applyDate = res.data.receiverTime 
          this.$forceUpdate()
        })
        this.$forceUpdate()
      }
    },
    getDict() {
      // let dictList = ['deviceSource']
      // for(let i=0; i<dictList.length; i++) {
      //   getDictList(dictList[i]).then(res => {
      //     if(dictList[i] == 'deviceSource') this.deviceSourceList = res.data
      //   })
      // }
    },
    addDevice() {
      this.showAddDevice = true
    },
    // 提交数据
    handleSave(valType) {
      if(this.deviceList.length == 0) {
        this.$message({
          message: '请添加投运设备!',
          type: 'warning'
        });
        return
      }
      this.$refs.dataForm.validate(valid => {
        this.deviceList.forEach(el=>{
          el.operationUnit = this.form.operationUnit
          el.operationUnitName = this.form.operationUnitName
          el.operationDept = this.form.operationDept
          el.operationDeptName = this.form.operationDeptName
          el.operationUse = this.form.operationUse
          el.operationUseName = this.form.operationUseName
          el.operationPhone = this.form.operationPhone
        })
        // this.deviceList.operationUnit = this.form.operationUnit
        // this.deviceList.operationUnitName = this.form.operationUnitName
        // this.deviceList.operationDept = this.form.operationDept
        // this.deviceList.operationDeptName = this.form.operationDeptName
        // this.deviceList.operationUse = this.form.operationUse
        // this.deviceList.operationUseName = this.form.operationUseName
        // this.deviceList.operationPhone = this.form.operationPhone
        
        // console.log(333, this.deviceList)

        this.form.deviceOperationDetailDTOList = this.deviceList
        
        if(valid) {
          // 提交
          if(valType == '1') {

            operationSubmit(this.form).then(res => {
              this.$message({
                message: '操作成功!',
                type: 'success'
              });
              this.handleReset(res)
            })
          }
          else if(valType == '2') {
            operationSave(this.form).then(res => {
              this.$message({
                message: '操作成功!',
                type: 'success'
              });
              this.handleReset()
            })
          }
        }else {
          this.$message({
            message: '请完善表单必填项',
            type: 'warning'
          });
        }
      })
    },
    // 返回
    handleReset(res) {
      this.$closePage("/operation/devOperation");
      // console.log(123, res)
      if(res && res.data){
        let string = ''
        let deviceOperationDetailVOList = res.data.deviceOperationDetailVOList
        if(deviceOperationDetailVOList.length > 0){
          deviceOperationDetailVOList.forEach((el, index)=>{
            if(el.authAccount){
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



            // if(el.deviceCode){
            //   string += `
            //     <p>设备编码:${ el.deviceCode }</p>
            //     <p>认证账户:${ el.authAccount }</p>
            //     <p style="margin-bottom: 10px">认证密码:${ el.authPassword }</p>
            //   `
            // }
          })
          if(string){
            this.$alert(string, '', { dangerouslyUseHTMLString: true, customClass: 'renzhengKuang' })
          }
        }

      }



      



    },
    // 设备编辑
    handleDevEdit(row, index) {
      // console.log(index)
      this.showDevEdit = true
      this.devItemDetail = row
      this.devListIndex = index
    },
    // 设备删除
    handleDevDelete(row, index) {
      this.deviceList.splice(index, 1)
    },
    editDeviceHandler(val) {
      // console.log(val, this.devListIndex)
      this.$set(this.deviceList, this.devListIndex, val)
      this.showDevEdit = false
      this.$forceUpdate()

      // console.log(666, this.deviceList)
    },
    // 获得新增数据
    getDevList(val) {
      for(let i=0; i<val.length; i++) {
        this.deviceList.push(val[i].deviceForm)
      }

      // console.log(898989, this.deviceList)
      this.showAddDevice = false
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .renzhengKuang{
  width: 620px;
}
</style>
<style lang="scss" scoped>
.table_text{
  text-align: left
}
</style>
