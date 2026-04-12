<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <el-scrollbar style="height: calc(100% - 55px)">
        <div class="" style="margin-bottom: 20px">
          <formTitle class="mart0" :titleText="'基本信息'" :titleType="'page_title'" :needBorder="true"></formTitle>
          <el-form :model="form" ref="dataForm" class="xt_form" label-width="100px" >
            <el-row :span="6">
              <el-col :span="6">
                <el-form-item label="变更单号" prop="changeCode" size="small">
                  <el-input v-model="form.changeCode"  placeholder="提交时自动生成" clearable maxlength="24" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="变更类型" prop="operationType" >
                  <el-select v-model="form.changeType"  placeholder="请选择变更类型" :rules="[{ required: true, message: '不能为空'}]" @change="operationTypeHandle" :disabled="isOper">
                    <el-option  v-for="dict in changeTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请单位" prop="applyUnit">
                  <el-input v-model="form.applyUnitName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请部门" prop="applyDept">
                  <el-input v-model="form.applyDeptName" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="6">
              <el-col :span="6">
                <el-form-item label="受理人" prop="applyUser" :rules="[{ required: true, message: '不能为空'}]" >
                  <el-input v-model="form.applyUserName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="受理时间" prop="receiverTime" :rules="[{ required: true, message: '不能为空'}]" >
                  <el-input v-model="form.receiverTime" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

        </div>
        <div class="">
          <!--设备列表 -->
          <formTitle :titleText="'设备列表'" :titleType="'page_title'" :needBorder="true">
            <div slot="rightBtnBox">
              <el-button type="primary" size="small" @click="daoru">导入</el-button>
              <el-button type="primary" size="small" plain @click="selectDevice">选择设备</el-button>
            </div>
          </formTitle>
          <el-table
            ref="deviceTable1"
            :data="deviceList1"
            v-loading="loading"
            size="small"
            height="500px"
            v-show=" form.changeType=='1' || form.changeType=='4' "
            @selection-change="selectionChange1"
          >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="deviceCode" label="设备基本信息" align="left" >
              <template  slot-scope="scope">
                <p class="list-device">设备编码：{{ scope.row.deviceCode }}</p>
                <p class="list-device">标准全称：{{ scope.row.fullName }}</p>
                <p class="list-device">出厂序列号：{{ scope.row.sn }}</p>
                <p class="list-device">制造商：{{ scope.row.maker }}</p>
                <p class="list-device">品牌：{{ scope.row.brand }}</p>
                <p class="list-device">系列：{{ scope.row.series }}</p>
                <p class="list-device">型号：{{ scope.row.deviceModel }}</p>
                <p class="list-device">出厂日期：{{ scope.row.factoryDate }}</p>
                <p class="list-device">投运日期：{{ scope.row.oprtDate }}</p>
                <template v-if="form.changeType=='4'">
                  <p class="list-device">内存大小：{{ scope.row.memSize }}</p>
                  <p class="list-device">磁盘容量大小：{{ scope.row.hardDiskPartionSize }}</p>
                  <p class="list-device">CPU品牌：{{ scope.row.cpuBrand }}</p>
                  <p class="list-device">CPU型号：{{ scope.row.cpuModel }}</p>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="receiveDept" label="领用信息" align="left">
              <template  slot-scope="scope">
                <p class="list-device">领用单位：{{ scope.row.receiveUnit }}</p>
                <p class="list-device">领用部门：{{ scope.row.receiveDept }}</p>
                <p class="list-device">责任人：{{ scope.row.receivingPerson }}</p>
                <p class="list-device">责任人班组：{{ scope.row.receivingGroup }}</p>
                <p class="list-device">责任人身份证：{{ scope.row.receivingIDCard }}</p>
                <p class="list-device">责任人联系方式：{{ scope.row.receivingTel }}</p>
                <p class="list-device">责任人统一权限账号：{{ scope.row.receivePersonUnifiedAcc }}</p>
                <p class="list-device">使用人：{{ scope.row.user }}</p>
                <p class="list-device">使用人身份证：{{ scope.row.deviceUserIDCard }}</p>
                <p class="list-device">使用人联系方式：{{ scope.row.userTel }}</p>
                <p class="list-device">安装地点：{{ scope.row.installationSite }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="维护信息" align="left">
              <template  slot-scope="scope">
                <p class="list-device">运维单位：{{ scope.row.operationUnit }}</p>
                <p class="list-device">运维部门：{{ scope.row.operationDept }}</p>
                <p class="list-device">运维责任人：{{ scope.row.operationPerson }}</p>
                <p class="list-device">运维联系电话：{{ scope.row.operationTel }}</p>
                <p class="list-device">运维等级：{{ showDictLable(scope.row.operationLevel,levelList) }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="userCard" label="资产信息" align="left" >
              <template  slot-scope="scope">
                <p class="list-device">ERP资产编码：{{ scope.row.assetCodeErp }}</p>
                <p class="list-device">ERP设备台账编码：{{ scope.row.deviceCodeErp }}</p>
                <p class="list-device">使用保管部门：{{ scope.row.useKeepDeptName }}</p>
                <p class="list-device">实物保管部门：{{ scope.row.realManageDeptName }}</p>
                <p class="list-device">电压等级：{{ scope.row.voltageLevel }}</p>
                <p class="list-device">设备增加方式：{{ scope.row.deviceAddType }}</p>
                <p class="list-device">设备变动方式：{{ scope.row.deviceChangeType }}</p>
                <p class="list-device">功能位置：{{ scope.row.funLocation }}</p>
                <p class="list-device">功能位置编码：{{ scope.row.funLocation }}</p>
                <p class="list-device">工厂区域：{{ scope.row.factoryArea }}</p>
                <p class="list-device">维护工厂：{{ scope.row.maintenanceFactory }}</p>
              </template>
            </el-table-column>



            <!-- <el-table-column prop="deviceCode" label="设备基本信息" align="left" >
              <template  slot-scope="scope">
                <p class="list-device">设备编码：{{ scope.row.deviceCode }}</p>
                <p class="list-device">标准全称：{{ scope.row.deviceName }}</p>
                <p class="list-device">出厂序列号：{{ scope.row.sn }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="receiveDept" label="领用信息" align="left">
              <template  slot-scope="scope">
                <p class="list-device">领用单位：{{ scope.row.receiveUnit }}</p>
                <p class="list-device">领用部门：{{ scope.row.receiveDept }}</p>
                <p class="list-device">责任人班组：{{ scope.row.receivingGroup }}</p>
                <p class="list-device">责任人：{{ scope.row.receivingPerson }}</p>
                <p class="list-device">责任人联系方式：{{ scope.row.receivingTel }}</p>
                <p class="list-device">责任人身份证：{{ scope.row.receivingIDCard }}</p>
                <p class="list-device">责任人统一权限账号：{{ scope.row.receivePersonUnifiedAcc }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="userCard" label="使用信息" align="left" >
              <template  slot-scope="scope">
                <p class="list-device">使用人：{{ scope.row.user }}</p>
                <p class="list-device">使用人联系方式：{{ scope.row.userTel }}</p>
                <p class="list-device">使用人身份证：{{ scope.row.deviceUserIDCard }}</p>
                <p class="list-device">安装地点：{{ scope.row.installationSite }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="维护信息" align="left">
              <template  slot-scope="scope">
                <p class="list-device">运维单位：{{ scope.row.operationUnit }}</p>
                <p class="list-device">运维部门：{{ scope.row.operationDept }}</p>
                <p class="list-device">运维责任人：{{ scope.row.operationPerson }}</p>
                <p class="list-device">运维等级：{{ showDictLable(scope.row.operationLevel,levelList) }}</p>
                <p class="list-device">运维联系电话：{{ scope.row.operationTel }}</p>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="200" align="center" fixed="right">
              <template  slot-scope="scope">
                <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleChange(scope.row)" v-show="show">比对</el-button>
                <el-button type="text" size="small" @click="handleDelete1(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            ref="deviceTable2"
            :data="deviceList2"
            v-loading="loading"
            size="small"
            height="400px"
            v-show="form.changeType=='2'"
            @selection-change="selectionChange2"
          >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="deviceCode" label="设备编码" align="center" width="180"></el-table-column>
            <el-table-column prop="deviceName" label="标准全称" align="center" width="180"></el-table-column>
<!--            <el-table-column prop="deviceCodeErp" label="ERP资产编码" align="center" width="180"></el-table-column>-->
            <el-table-column prop="subnetName" label="所属子网" align="center" width="180"></el-table-column>
            <el-table-column prop="IP" label="IP地址" align="center" width="180"></el-table-column>
            <el-table-column prop="MAC" label="MAC地址" align="center" width="180"></el-table-column>
            <el-table-column prop="sn" label="出厂序列号" align="center" width="180"></el-table-column>
            <el-table-column prop="networkAccessMethod" label="入网方式" align="center"></el-table-column>
            <el-table-column label="操作" width="200" align="center" fixed="right">
              <template  slot-scope="scope">
                <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleChange(scope.row)" v-show="show">比对</el-button>
                <el-button type="text" size="small" @click="handleDelete2(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>


        </div>
      </el-scrollbar>
       <!-- 底部按钮 -->
      <div class="form-btn">
        <el-button type="primary" size="small" @click="handleSaveOK(2)" :loading="btnLoading">提交变更</el-button>
        <el-button class="border-btn" size="small" @click="handleSave(1)" style="margin-left: 50px;" :loading="btnLoading" v-show="isDis">暂 存</el-button>
        <el-button class="border-btn" size="small" @click="handleReset" style="margin-left: 50px;">返 回</el-button>
      </div>



    </div>
    <!-- 编辑设备信息 -->
    <deviceSelect
      type="change"
      :changeType="form.changeType"
      v-if="deviceSelectSync"
      :isShow.sync="deviceSelectSync"
      :deviceList = "deviceList1"
      @setVal="selectDeviceHandler"
    ></deviceSelect>
    <changeDeviceDialog
      :type="form.changeType"
      v-if="deviceEditSync"
      :isShow.sync="deviceEditSync"
      :deviceDetailForm="deviceForm"
      :deviceList = "deviceListA"
      @setVal="handleEditSave">
    </changeDeviceDialog>
    <changeLogDialog
      :type="form.changeType"
      v-if="deviceChangeLogSync"
      :isShow.sync="deviceChangeLogSync"
      :bindId = "form.id"
      :deviceCode = "this.deviceCode"
      :deviceForm="deviceForm">
    </changeLogDialog>

    <!-- 导入文件弹框 -->
    <uploadModel v-if="openUpload" :isShow.sync="openUpload" type="sbbg" :isMath="0"
                 @setVal='setValDeviceList'></uploadModel>
  </basic-container>
</template>

<script>
import {
  devicechangeList,
  getDeviceList,
  deviceChangeDetail,
  submit,
  changeOrderInit
} from "@/api/operation/devChange/devChange";
import {getDictList,getDictCmdbList} from "@/api/dict";
import deviceSelect from "@/components/deviceSelect/index.vue";
import changeDeviceDialog from "@/views/operation/components/devChange/devChangeDeviceDialog.vue";
import changeLogDialog from "@/views/operation/components/devChange/devChangeLogsDialog.vue";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDeptList} from "@/api/system/dept";
import {mapGetters} from "vuex";
import uploadModel from "@/views/device/components/devInBound/uploadModel.vue";

export default {
  components: { deviceSelect,changeDeviceDialog,changeLogDialog,xtTreeLzaySelect, uploadModel },
  data() {
    return{
      openUpload: false,//打开导入对话框

      show: '',
      isOper:false,
      isDis:true,
      deviceCode:'',
      form: {
        changeType: '1',
        applyUser: ''
      },
      searchForm: {
        current: 1,
        size: 20,
      },
      btnLoading: false,
      //变更类型
      changeType: '1',
      // 字典
      levelList:[],
      changeTypeList: [],
      unitList: [],
      deptList: [],
      submitDates: null,
      statusList: [],
      ticketCreatTypeList: [],
      ticketStatusList: [],
      selectionList1:[],
      selectionList2:[],
      // 表格
      dataList: [],
      deviceList1: [],
      deviceList2: [],
      deviceList: [],
      oldDeviceList:[],
      deviceListNow:[],
      tableHeight: undefined,
      loading: false,
      total: 0,
      deviceSelectSync: false,
      deviceEditSync: false,
      deviceChangeLogSync: false,
      page: {
        size: 100,
        current: 1,
        total: 0
      },
      deviceForm:{},

      deviceListA: [],
    }
  },
  computed:{
    ...mapGetters(["permission","userInfo","userDetail"]),
  },
  mounted() {
    // 设置页面元素高度
    this.setPageContentHeight()
    //获取 部门列表
    this.getDeptList()
    //加载字典--工单状态
    this.getDictList("ticket_status");
    //加载字典--变更类型
    this.getDictList("device_change_type");
    //加载字典--工单生成方式
    this.getDictList("ticket_creat_type");
    //加载字典--运维等级
    this.getDictCmdbList('1107954469502976')
    //判断是否是运维人员
    setTimeout(() => {
      this.isRole();
    }, 200);

    this.id = null;
    //获取参数 判断是否是新增还是修改
    const params = this.$route.query
    this.id = params.id;
    if (params.isDis !=null) {
      this.isDis = params.isDis
    }
    if (params.show != null ){
      this.show = params.show
    }
    if(params.id){
      this.id = params.id;
      this.loadDetail(params.id);
      //加载 设备列表
      this.loadDeviceDataList();
    }else{
      //加载空数据
      this.beforeOpen();
    }
  },
  methods: {
    daoru(){
      this.openUpload = true
    },
    setValDeviceList(arr) {
      // console.log(99, arr)

      this.deviceList1 = arr
      this.openUpload = false
      // this.importDeviceObj = obj
      // this.showDeviceListForm = true
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
    isRole(){
      //判断角色是否是运维人员
      if (this.userDetail.userRoleFlag === 0){
        this.isOper = false
      }else {
        this.isOper =true
      }
    },
    getDictCmdbList(ciId){
      //加载字典
      getDictCmdbList({ ciId: ciId }).then(res => {
        if(ciId==='1107954469502976'){ // 运维等级
          this.levelList  = res.data;
        }
      });
    },
    getDeptList() {
      //获取部门 单位
      getDeptList().then(res => {
        this.unitList = res.data
      })
    },
    getEntityUnit(val) {
      //选择领用单位 部门
      this.form.applyUnit = val.fullName
      this.$refs.dataForm.$forceUpdate()
      this.$forceUpdate()
    },
    getEntityDept(val) {
      //选择领用单位 部门
      this.form.applyDept = val.fullName
      //this.searchForm.receiveDept = val.id
      this.$refs.dataForm.$forceUpdate()
      this.$forceUpdate()
    },
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 50 - 47 + 'px'
    },
    getDictList(code){
      //加载字典
      getDictList(code).then(res => {
        if(code==='ticket_creat_type'){
          this.ticketCreatTypeList  = res.data;
        }else if(code==='device_change_type'){
          let datas = res.data
          datas = datas.filter(el=> el.dictValue != '异动告警变更')
          this.changeTypeList = datas;
        }else if(code==='ticket_status'){
          this.ticketStatusList = res.data;
        }
      });
    },
    selectionChange1(selection) {
      //点击选择事件
      this.selectionList1 = selection.map(item => item.id);
    },
    selectionChange2(selection) {
      //点击选择事件
      this.selectionList2 = selection.map(item => item.id);
    },
    operationTypeHandle(){
      //变更类型
      this.selectionList1 = [];
      this.selectionList2 = [];
      if(this.form.changeType=='1' || this.form.changeType=='4'){
        this.deviceList1 = this.deviceList;
        this.deviceList2 = [];
      }else if(this.form.changeType=='2'){
        this.deviceList1 = [];
        this.deviceList2 = this.deviceList;
      }
      this.$refs.deviceTable1.doLayout();
      this.$refs.deviceTable2.doLayout();
    },
    getList() {
      this.loading = true
      if(this.submitDates != null) {
        this.searchForm.startTime = this.submitDates[0]
        this.searchForm.endTime = this.submitDates[1]
      }else {
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
      }
      devicechangeList(this.searchForm).then(res => {
        this.dataList = res.data.records
        this.total = res.data.total
        this.loading= false
      }).catch(() => {
        this.loading= false
      })
    },
    handleSaveOK(status) {
      this.$refs.dataForm.validate(async valid =>{
        if(valid){
          this.form.submitStatus = status;
          this.form.oldChangeDeviceDTOList =this.oldDeviceList
          //提交变更
          if(this.form.changeType=='1' || this.form.changeType=='4'){
            if(this.deviceList1.length == 0) {
              this.$message({
                type: "warning",
                message: "请选择变更设备!"
              });
              return
            }
            this.form.newChangeDeviceDTOList = this.deviceList1||[];
            this.form.deviceCount = this.deviceList1.length
          }else if(this.form.changeType=='2'){
            if(this.deviceList2.length == 0) {
              this.$message({
                type: "warning",
                message: "请选择变更设备!"
              });
              return
            }
            this.form.newChangeDeviceDTOList = this.deviceList2||[];
            this.form.deviceCount = this.deviceList2.length
          }else{
            //其他
          }
          this.btnLoading = true
          let saveRes = await this.$asyncCatchApi(submit, this.form)
          if(saveRes[0] != null) {
            this.btnLoading = false
            return
          }

          // let cerateRes = await this.$asyncCatchApi(submitProcess, {
          //   assignees: [],
          //   businessKey: saveRes[1].data.filingNo,
          //   comment: "",
          //   participantType: "2",
          //   processDefinitionKey: 'bpm_sbbg',
          //   taskType: "1",
          //   variable: {},
          // })
          // if(cerateRes[0] != null) {
          //   this.btnLoading = false
          //   return
          // }

          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.btnLoading = false
          this.handleReset();
        }
      })
    },
    handleSave(status) {
      this.$refs.dataForm.validate(valid =>{
        if(valid){
          this.form.submitStatus = status;
          this.form.oldChangeDeviceDTOList =this.oldDeviceList

          if(this.form.changeType=='1' || this.form.changeType=='4'){
            if(this.deviceList1.length == 0) {
              this.$message({
                type: "warning",
                message: "请选择变更设备!"
              });
              return
            }
            this.form.newChangeDeviceDTOList = this.deviceList1||[];
            this.form.deviceCount = this.deviceList1.length
          }else if(this.form.changeType=='2'){
            if(this.deviceList2.length == 0) {
              this.$message({
                type: "warning",
                message: "请选择变更设备!"
              });
              return
            }
            this.form.newChangeDeviceDTOList = this.deviceList2||[];
            this.form.deviceCount = this.deviceList2.length
          }
          //暂存
          this.btnLoading = true
          submit(this.form).then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.btnLoading = true
            this.handleReset();
          }, error => {

            this.btnLoading = false
          });
        }
      })
    },
    handleReset(){
      if( this.$route.query.formRouter ){
        return this.$closePage(this.$route.query.formRouter)
      }
      //返回
      this.$closePage('/operation/devChange')
    },
    beforeOpen() {
      //默认数据
      this.form.applyUser = this.userInfo.userName
      changeOrderInit().then(res => {
        this.form = res.data
      })
    },
    loadDetail(id){
      deviceChangeDetail(id).then(res => {
        this.form = res.data;
      });
    },
    loadDeviceDataList() {
      //加载 设备列表
      this.loading = true;
      let query = {...this.page};
      query.changeId = this.id||'';
      getDeviceList(query).then(res => {
        const data = res.data;
        this.deviceList = JSON.parse(JSON.stringify(data.records));
        this.deviceList1 = JSON.parse(JSON.stringify(data.records));
        this.deviceList2 = JSON.parse(JSON.stringify(data.records));
        this.oldDeviceList= JSON.parse(JSON.stringify(data.records));
        this.loading = false;
      });
    },
    handleDelete1(idx){
      //删除
      this.deviceList1.splice(idx,1)

    },
    handleDelete2(idx){
      //删除
      this.deviceList2.splice(idx,1)

    },
    selectDevice(){
      //弹框 选择设备
      this.deviceSelectSync = true
      // this.deviceSelectSync = true
    },
    selectDeviceHandler(list){
      for(let i=0; i<list.length; i++) {
        if(list[i].operationLevel !=null){
          list[i].operationLevel = list[i].operationLevel.toString()
        }
        //  console.log(122, this.deviceList)
        // for(let j=0; j<this.deviceList.length; j++) {


        //   if(list[i].id == this.deviceList1[j].id || list[i].id == this.deviceList2[j].id) {
        //     this.$message({
        //       type: "warning",
        //       message: "请勿重复选择设备!"
        //     });
        //     return
        //   }


        //   if(list[i].IP == this.deviceList1[j].IP || list[i].IP == this.deviceList2[j].IP) {
        //     this.$message({
        //       type: "warning",
        //       message: "请勿选择IP地址重复设备!"
        //     });
        //     return
        //   }
        // }


        if(this.form.changeType=='1' || this.form.changeType=='4'){
          for(let j=0; j<this.deviceList1.length; j++) {

            if(list[i].id == this.deviceList1[j].id || list[i].deviceCode == this.deviceList1[j].deviceCode) {
              this.$message({
                type: "warning",
                message: "请勿重复选择设备!"
              });
              return
            }

            // if(list[i].IP == this.deviceList1[j].IP) {
            //   this.$message({
            //     type: "warning",
            //     message: "请勿选择IP地址重复设备!"
            //   });
            //   return
            // }
          }
        } else if(this.form.changeType=='2'){
          // console.log( 112233, list[i].id, this.deviceList2 )
          for(let j=0; j<this.deviceList2.length; j++) {

            if(list[i].id == this.deviceList2[j].id || list[i].deviceCode == this.deviceList2[j].deviceCode) {
              this.$message({
                type: "warning",
                message: "请勿重复选择设备!"
              });
              return
            }

            // if(list[i].IP == this.deviceList2[j].IP) {
            //   this.$message({
            //     type: "warning",
            //     message: "请勿选择IP地址重复设备!"
            //   });
            //   return
            // }
          }
        }
      }


      //选择弹框 选择cmdb设备
      let ls = JSON.parse(JSON.stringify(list));
      this.deviceListNow = ls;

      this.deviceList1.push(...ls);
      this.deviceList2.push(...ls);
      this.oldDeviceList.push(...list);
      this.loading = false;
      this.$refs.deviceTable1.doLayout();
      this.$refs.deviceTable2.doLayout();
    },
    deleteDeviceHandler(){
      //删除设备列表
      //this.deviceList = this.deviceList.filter();
      //this.selectionList = selection.map(item => item.id);
    },
    // eslint-disable-next-line no-unused-vars
    handleChange(row){
      this.deviceCode = row.deviceCode
      //比对
      if(this.form.id){
        this.deviceChangeLogSync = true;
      }
      this.deviceChangeLogSync = true;
    },
    // eslint-disable-next-line no-unused-vars
    handleEdit(row){
      if( this.form.changeType == '1' || this.form.changeType == '4' ){
        this.deviceListA = JSON.parse(JSON.stringify(this.deviceList1))
      } else if( this.form.changeType == '2' ){
        this.deviceListA = JSON.parse(JSON.stringify(this.deviceList2))
      }



      //编辑
      this.deviceEditSync = true;
      this.deviceForm = row;
    },
    handleEditSave(row){
      //回写 编辑
      if(this.form.changeType=='1' || this.form.changeType=='4'){
        this.deviceList1.forEach((it, index) => {
          if(it.id === row.id){
            // it = {...row}
            this.$set(this.deviceList1, index, row)
          }
        })
      }else if(this.form.changeType=='2'){
        this.deviceList2.forEach((it, index) => {
          if(it.id === row.id){
            // it = {...row}
            this.$set(this.deviceList2, index, row)
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.mart0{
  margin-top: 0 !important;
}
.formLabel{
  line-height: 16px;
  display: block;
}
.list-device{
  margin: 0;
  line-height: 16px;
}
</style>
