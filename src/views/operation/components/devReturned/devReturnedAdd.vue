<template>
  <basic-container v-loading="showLoading" element-loading-text="拼命加载中。。。" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0,0,0,0.8)">
    <div class="page_form"></div>
    <div class="page_body">
      <el-scrollbar style="height:calc(100% - 50px)">
      <div style="width: 100%;height: 1px;"></div>
      <template v-if="isView">
        <formTitle :titleText="'处理进度'" :titleType="'page_title'"></formTitle>
        <el-row type="flex">
          <el-col :span="24" style="height: 120px;">
            <step
              class="stepTop"
              :processKey="'bpm_sbty'"
              :orderId="form.id"
              :orderCode="form.filingNo"
              v-if="form.id"
              :currentSteps="form.processStatus"
              :status="form.status"
              :creatType = "form.isAuto"
            ></step>
          </el-col>
          <!-- <el-col :span="2">
            <el-image style="width: 100px; height: 100px;" fit="fill"></el-image>
          </el-col> -->
        </el-row>
      </template>
      <formTitle :titleText="'设备退运信息'" :titleType="'page_title'"></formTitle>
      <!-- <el-scrollbar> -->
        <el-form :model="form" :rules="rules" :disabled="isView" ref="dataForm" class="xt_form" label-width="120px" style="margin-bottom: 90px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="退运编号" prop="filingNo">
                <el-input v-model="form.filingNo" placeholder="系统自动生成" disabled clearable maxlength="24"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="申请单位" prop="applyUnitName">
                <xt-tree-select
                  disabled
                  :placeholder="'请选择申请单位'"
                  :formValue="form.applyUnitName"
                  :selectType="'CORP'"
                  @getTreeItem="getuseApplyUnit"
                ></xt-tree-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="申请部门" prop="applyDeptName">
                <xt-tree-select
                  disabled
                  :placeholder="'请选择申请部门'"
                  :formValue="form.applyDeptName"
                  :selectType="'DEPT'"
                  @getTreeItem="getuseApplyDept"
                ></xt-tree-select>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="6">
              <el-form-item label="设备来源" prop="deviceResource">
                <el-select v-model="form.deviceResource"  placeholder="请选择设备来源" clearable >
                  <el-option  v-for="dict in deviceResourceList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          <!-- </el-row>
          <el-row> -->


            <el-col :span="6">
              <el-form-item label="受理时间" prop="acceptTime">
                <!-- <el-date-picker v-model="form.acceptTime" value-format="yyyy-MM-dd"  type="date" placeholder="请输入报废时间" clearable></el-date-picker> -->
                <el-date-picker
                  v-model="form.acceptTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择受理时间" disabled></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="受理人" prop="acceptUserName">
                <el-input v-model="form.acceptUserName" disabled placeholder="请输入受理人员" clearable style="width:100%"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="联系电话" prop="acceptPhone">
                <el-input v-model="form.acceptPhone" placeholder=""></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="退运原因" prop="returnReason">
                <!-- <el-input v-model="form.returnReason"   placeholder="请输入退运原因,限200字" clearable maxlength="200" type="textarea" rows="3"  ></el-input> -->
                <el-input v-model="form.returnReason" placeholder="请输入退运原因,限200字" clearable maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="12">
              <el-form-item label="入库图片" size="small">
                <uploadImg
                  :disabled="isView"
                  ref="uploadImg"
                  :type="'设备出库'"
                  :fileList.sync="fileList"
                  :attachId="form.attachId"
                  @setVal="selectDeviceFileHandler"
                ></uploadImg>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      <!-- </el-scrollbar> -->
      <!-- 中间设备列表 -->
      <formTitle :titleText="'设备信息列表'" :titleType="'page_title'">
        <div slot="rightBtnBox" v-if="!isView">
          <el-button type="primary" size="small" @click="selectDevice">添加设备</el-button>
          <el-button type="danger" size="small" @click="delDevice">删除</el-button>
        </div>
      </formTitle>
      <!-- <el-scrollbar style="height:calc(100% - 350px)"> -->
        <el-table
          ref="deviceTable"
          :data="deviceList"
          v-loading="loading"
          size="small"
          height="360px"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="30" fixed="left"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" width="200" align="center"></el-table-column>
          <el-table-column prop="deviceCategory" label="设备分类" width="200" align="center">
            <template slot-scope="scope">
              <span> {{showDictLable(scope.row.deviceCategory, deviceCategoryList)}} </span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceType" label="设备类型" width="200" align="center">
            <template slot-scope="scope">
              <span> {{showDictLable(scope.row.deviceType, deviceTypeList)}} </span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceSource" label="设备来源" width="200" align="center">
            <template slot-scope="scope">
              <span> {{showDictLable(scope.row.deviceSource, deviceSourceList)}} </span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceIp" label="IP地址" width="200" align="center"></el-table-column>
          <el-table-column prop="receivingPerson" label="设备使用人" width="200" align="center"></el-table-column>
          <el-table-column prop="receivingTel" label="设备使用人联系方式" width="200" align="center"></el-table-column>
          <!-- <el-table-column prop="assetCodeErp" label="ERP资产编码" width="200" align="center"></el-table-column> -->
          <el-table-column prop="deviceStatus" label="设备状态" width="200" align="center" fixed="right" v-if=" !(isAdd || types=='edit') ">
            <template slot-scope="scope">
              <span v-if="!isAudit"> {{showDictLable(scope.row.deviceStatus,deviceStatusList)}} </span>
              <el-select v-model="scope.row.deviceStatus" @change="deviceStatusChange($event, scope.row)" clearable placeholder="" v-else>
                <el-option
                  v-for="item in deviceStatusList"
                  :value="item.dictKey"
                  :key="item.dictValue"
                  :label="item.dictValue"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="inWarehouse" label="入库仓库" width="200" align="center" fixed="right" v-if=" !(isAdd || types=='edit') ">
            <template slot-scope="scope">
              <span v-if="!isAudit"> {{ scope.row.inWarehouse }} </span>
              <el-select v-model="scope.row.inWarehouseCode" @change="inWarehouseChange($event, scope.row)" clearable placeholder="" v-else>
                <el-option
                  v-for="item in addressList"
                  :value="item.warehouseId"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="所在位置" width="200" align="center" fixed="right" v-if=" !(isAdd || types=='edit') "></el-table-column>


          <!-- <el-table-column prop="devicePhoto" label="入库设备图片" width="200" align="center"></el-table-column> -->
          <!-- <el-table-column label="设备是否归还" width="120" align="center" fixed="right">
            <template slot-scope="scope">
              <span v-if="!isAudit">{{showDictLable(scope.row.isReturned, isReturnedList)}}</span>
              <el-select v-model="scope.row.isReturned" placeholder="" v-else>
                <el-option
                  v-for="item in isReturnedList"
                  :value="item.dictKey"
                  :key="item.dictKey"
                  :label="item.dictValue"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" v-if="!isView" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text"
                         size="small"
                         icon="el-icon-delete"
                         @click="handleDelete(scope.row.index)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 审批记录/操作记录 -->
        <el-row type="flex" v-if="isView">
          <!-- 底部左侧审批记录 开始 -->
          <el-col :span="12">
            <formTitle :titleText="'审批记录'" :titleType="'page_title'"></formTitle>
            <div style="margin-left: 10px;">
              <step
                class="stepBottom"
                :processKey="'bpm_sbty'"
                :orderId="form.id"
                v-if="form.id"
                :stepType="true"
                :currentSteps="form.processStatus"
                :status="form.status"
                :stepHeight="'400px'"
              ></step>
            </div>
          </el-col>
          <!-- 底部右侧操作 开始 -->
          <el-col :span="12">
            <formTitle :titleText="'操作记录'" :titleType="'page_title'"></formTitle>
            <el-table
              ref="optTable"
              :data="optList"
              v-loading="loading"
              border
            >
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="optRole" label="角色" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="optName" label="操作人" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="160" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="title" label="操作内容" width="350" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>
        </el-row>

      </el-scrollbar>
      <!-- 底部按钮 v-if="form.status==1"-->
      <div class="form-btn">
        <template v-if="!isAudit">
          <el-button type="primary" size="small" v-if="!isView" @click="handleSaveOK()">发起流程</el-button>
          <el-button class="border-btn" size="small" v-if="!isView" @click="handleSave()"  style="margin-left: 50px;">保 存</el-button>
          <el-button class="border-btn" size="small" @click="handleReset"  style="margin-left: 50px;">返 回</el-button>
        </template>

        <template v-if="isAudit">
          <el-button class="border-btn" size="small" @click="handleIsAudit()"  style="margin-left: 50px;">确 认</el-button>
          <el-button class="border-btn" size="small" @click="handleResetIsAudit"  style="margin-left: 50px;">返 回</el-button>
        </template>
      </div>

    </div>
    <!-- 上传 -->
    <!-- <uploadModel v-if="openUpload" :isShow.sync="openUpload" @setVal='setValDeviceList'></uploadModel> -->
    <!-- 选择设备 -->
    <deviceSelect type="returned" v-if="deviceSelectSync" :isShow.sync="deviceSelectSync"  @setVal="selectDeviceHandler"></deviceSelect>
    <!-- 审批弹窗 -->
    <operateForm
      v-if="showOperate"
      :isShow="showOperate"
      :orderDeatil="form"
      :processKeys="'bpm_sbty'"
      @close="showOperate = false"
      @submitOperate="submitOperate"
    ></operateForm>
  </basic-container>
</template>

<script>
  import { getDetail, save, submit, returnedCheck, returnedEditStatus } from "@/api/operation/devReturned";
  import { getDeviceList} from "@/api/operation/deviceoperationdetail";
  import {getDictList, getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
  import {mapState, mapGetters} from "vuex";
  // import uploadModel from "@/views/device/components/capitalTransfer/uploadModel.vue";
  import uploadImg from "./uploadImg.vue";
  import deviceSelect from "@/components/deviceSelect/index.vue";
  import xtTreeSelect from "@/components/xtTreeSelect/index"
  import { dateFormat } from "@/util/date";
  import { getLogOptList} from "@/api/device/logopt";
  import step from "@/components/step/index"
  import {getList} from "@/api/device/warehouse";
  import { submitProcess } from "@/api/process/index"
  import operateForm from "@/views/personalDesk/components/operateForm"

  export default {
    components: {deviceSelect, xtTreeSelect, step, operateForm, uploadImg},
    data() {
      return {
        showLoading: false,
        
        fileList: [],
        showOperate: false,

        deviceStatusList: [],
        optList: [],

        id:'',

        deviceSelectSync: false,
        //校验
        rules:{
          // filingNo:[{required:true,message:'请填写退运编号',trigger:'blur'}],
          applyUnit:[{required:true,message:'请选择申请单位',trigger:'change'}],
          applyDept:[{required:true,message:'请选择申请部门',trigger:'change'}],
          deviceResource:[{required:true,message:'请选择设备来源',trigger:'change'}],
          acceptTime:[{required:true,message:'请选择受理时间',trigger:'change'}],
          acceptUserName:[{required:true,message:'请输入受理人员',trigger:'blur'}],
          acceptPhone:[{required:true,message:'请输入联系电话',trigger:'blur'}],
          returnReason:[{required:true,message:'请输入退运原因',trigger:'blur'}],
        },
        form: {
          acceptUser: undefined,
          acceptUserName: undefined,
          acceptTime: undefined
        },

        loading: false,
        isEdit: false,
        isView: false,
        isAudit: false,
        isAdd: false,

        selectionList: [],

        funLocationList:[],
        operationTypeList: [],
        deviceResourceList: [],
        deviceList: [],
        deviceSelectList: [],
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        // openUpload: false,
        addressList: [],
        isReturnedList: [
          {
            dictKey: 0,
            dictValue: '否'
          },
          {
            dictKey: 1,
            dictValue: '是'
          },
        ],

        deviceCategoryList: [],
        deviceTypeList: [],
        deviceSourceList: [],
        types: ''
      };
    },
    computed: {
      ...mapState({
        userDetail: state => state.user.userDetail
      }),
      ...mapGetters(["userInfo"]),
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
    },
    mounted(){
      // 设备分类
      this.getCmdbDictList("1097745625841664");
      // 设备类型
      this.getCmdbDictList("1097745969774592");
      // 设备来源
      this.getCmdbDictList("1102860579569664");

      // 设置页面元素高度
      this.setPageContentHeight()
      //加载字典--投运类型
      this.getDictList("operationType");
      //加载字典--设备来源
      // this.getDictList("deviceSource");


      this.id = null;
      //获取参数 判断是否是新增还是修改
      const params = this.$route.query
      this.id = params.id;

      if(params.id){
        this.id = params.id;
        this.types = params.type;
        this.loadDetail(params.id);

        if( params.type == 'view' ){ //查看
          this.isView = true
          //加载操作记录
          this.loadLogOptDataList();
        } else if( params.type == 'edit' ){ //编辑
          this.isEdit = true
        } else if( params.isAudit ){ //审批
         //加载操作记录
          this.loadLogOptDataList();
          this.isAudit = true
          this.isView = true
        }

        //加载 设备列表
        // this.loadDeviceDataList();
        // 设备状态列表
        this.getCmdbDictList('1103423111233536')
        // 仓库列表
        getList({ regionCode: this.userDetail.regionCode }).then(res=>{
          this.addressList = res.data.records
        })
      }else{
        //加载空数据
        this.beforeOpen();
        this.isAdd = true
      }
    },
    methods: {
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
      showDictLable2(code,dictList){
        //字典回显
        if(dictList!=null && code!==''){
          let items = dictList.filter(item => item.warehouseId==code);
          if(items!=null && items.length>0){
            return items[0].warehouseName;
          }
        }
        return code;
      },


      selectDeviceFileHandler(file123){
        //新增文件
        // this.fileList = []
        this.form.orderFile = undefined
        if(file123){
          // this.fileList.push(file123)
          this.form.orderFile = file123
        }
        // console.log(111,  this.fileList)
        // setTimeout(() => {
        //   console.log(222,  this.fileList)
        // }, 2000);

      },
      deviceStatusChange(val, row){
        // let select = this.addressList.filter(el=> el.dictKey == val)[0]
        // row.deviceStatus = select.dictValue
      },
      inWarehouseChange(val, row){
        let select = this.addressList.filter(el=> el.warehouseId == val)[0]
        row.inWarehouse = select.warehouseName
        row.address= select.address
        row.inWarehouseId = select.uuid
      },
      //加载操作记录
      loadLogOptDataList() {
        let query = {};
        query.logId = this.id||'--';
        getLogOptList(1,20, query).then(res => {
          const data = res.data;
          this.optList = data.records;
        });
      },
      // 申请单位
      getuseApplyUnit(val) {
        // console.log(val)
        this.form.applyUnit = val.id
        this.form.applyUnitName = val.fullName
        this.$forceUpdate()
      },
      // 申请部门
      getuseApplyDept(val) {
        this.form.applyDept = val.id
        this.form.applyDeptName = val.fullName
        this.$forceUpdate()
      },

      beforeOpen() {
        this.form.acceptUser = this.userInfo.userId
        this.form.acceptUserName = this.userInfo.userName
        this.form.acceptTime = dateFormat(new Date())
        // 申请单位、部门
        this.form.applyUnit = this.userDetail.ownerUnit
        this.form.applyUnitName = this.userDetail.ownerUnitName
        this.form.applyDept = this.userDetail.deptId
        this.form.applyDeptName = this.userDetail.deptName

      },
      loadDetail(id){
        getDetail(id).then(res => {
          this.form = res.data;
          this.deviceList = res.data.returnedDetailVOS;
          // 渲染图片
          if(this.form.orderFile && this.form.orderFile.fileName){
            this.fileList = [this.form.orderFile] || [];
            this.fileList.forEach(i => {
              i.name = i.fileName,
              i.url = i.fileUrl
            })
          }
        });
      },
      //删除
      handleDelete(idx){
        this.deviceList.splice(idx,1)
      },
      //删除设备
      delDevice(){
        // this.deviceSelectSync = true
        this.selectionList.forEach(item=>{
          let index = this.deviceList.findIndex(ell=> ell.id == item)
          this.deviceList.splice(index, 1)
        })
      },
      //弹框 选择设备
      selectDevice(){
        this.deviceSelectSync = true
      },
      //选择弹框 选择cmdb设备
      selectDeviceHandler(list){
        list.forEach(el=>{
          el.factorySerial = el.sn
          el.deviceId = el.id
          el.deviceIp = el.IP
          el.deviceMac = el.MAC

          // el.deviceStatus = el.deviceStatusCode
          // el.inWarehouse = el.inWarehouseCode
          el.deviceStatus = undefined
          el.deviceStatusCode = undefined
          el.inWarehouse = undefined
          el.inWarehouseCode = undefined


          let flag = this.deviceList.some(ell => ell.deviceId ==  el.deviceId)
          if( !flag  ){
            this.deviceList.push(el)
          }

        })
        // this.deviceList = list;
        this.page.total = this.deviceList.length;

      },
      //点击选择事件
      selectionChange(selection) {
        this.selectionList = selection.map(item => item.id);
      },
      // 发起流程
      handleSaveOK(status) {
        this.$refs.dataForm.validate(valid =>{
          if(valid){

            if( this.deviceList.length == 0 ){
              return this.$message.warning('请添加设备信息！')
            }
            // this.form.status = status;
            let arr = this.deviceList||[];
            arr.forEach(el=>{
              if(!el.deviceId){
                el.deviceId = el.id
                el.id = undefined
              }
            })
            this.form.detailDTOS = arr
            //保存modelProperties.getT105().equals(item.getDeviceCategory()
            this.showLoading = true
            submit(this.form).then( async() => {
              this.showLoading = false
              this.$message({
                type: "success",
                message: "操作成功!"
              });

              // 发起流程
              // let cerateRes = await this.$asyncCatchApi(submitProcess, {
              //   assignees: [],
              //   businessKey: this.form.filingNo,
              //   comment: "",
              //   participantType: "2",
              //   processDefinitionKey: 'bpm_sbty',
              //   taskType: "1",
              //   variable: {},
              // })
              // if(cerateRes[0] != null) {
              //   // this.btnLoading = false
              //   return
              // }

              this.handleReset();
            }, error => {
              
            });
          }
        })
      },
      // 保存
      handleSave(status) {
        this.$refs.dataForm.validate(valid =>{
          if(valid){
            // this.form.status = status;
            let arr = this.deviceList||[];
            arr.forEach(el=>{
              if(!el.deviceId){
                el.deviceId = el.id
                el.id = undefined
              }
            })
            this.form.detailDTOS = arr
            //保存
            this.showLoading = true
            save(this.form).then(() => {
              this.showLoading = false
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.handleReset();
            }, error => {
              
            });
          }
        })
      },
      handleIsAudit(){
        let flag = this.deviceList.some(el=>{
          return !el.deviceStatus || !el.inWarehouse
        })
        if(flag){
          return this.$message.warning("设备信息请填写完整！")
        }

        this.form.detailDTOS = this.deviceList||[];
        //保存
        this.showLoading = true
        returnedCheck(this.form).then( async(res) => {
          this.showLoading = false
          if(res.code != 200){
            return
          }
          this.showOperate = true

        }, error => {
          
        });

      },
      submitOperate(data) {
        this.showOperate = false
        this.$closePage('/personalDesk/desk');
      },
      //返回 退运列表
      handleReset(){
        if( this.$route.query.formRouter ){
          return this.$closePage(this.$route.query.formRouter)
        }

        if( this.$route.query.tuiyun ){
          this.$closePage('/personalDesk/desk')
        }else{
          this.$closePage('/operation/devReturned')
        }
      },
      //返回 工作台
      handleResetIsAudit(){
        if( this.$route.query.formRouter ){
          return this.$closePage(this.$route.query.formRouter)
        }
        this.$closePage('/personalDesk/desk')
      },

      getDictList(code){
        getDictList(code).then(res => {
          if(code==='deviceAddType'){
            this.deviceAddTypeList = res.data;
          }else if(code==='deviceChangeType'){
            this.deviceChangeTypeList = res.data;
          }else if(code==='funLocation'){
            this.funLocationList = res.data;
          }else if(code==='factoryArea'){
            this.factoryAreaList = res.data;
          }else if(code==='maintenanceFactory'){
            this.maintenanceFactoryList = res.data;
          }else if(code==='networkType'){
            this.networkTypeList = res.data;
          }else if(code==='outBoundStatus'){
            this.outBoundStatusList = res.data;
          }else if(code==='operationType'){
            this.operationTypeList  = res.data;
          }else if(code==='deviceSource'){
            this.deviceResourceList  = res.data;
          }
        });
      },
      getCmdbDictList(code){
        //加载cmdb字典
        let query = {}
        query.ciId = code||'1082372687986688'
        getDictCmdbList( query ).then(res => {
          if(code==='1103423111233536'){
            // 设备状态
            let data = res.data
            this.deviceStatusList  = data.filter(el=> el.dictValue == '退运在库' || el.dictValue == '待报废');
          }else if(code==='1097745625841664'){
            this.deviceCategoryList  = res.data;
          }else if(code==='1097745969774592'){
            this.deviceTypeList  = res.data;
            this.deviceTypeListAll  = res.data;
          }else if (code === '1102860579569664') { // 设备来源
            this.deviceSourceList = res.data;
          }
        });
      },
      getDictCmdbListPid(ciId, pid) {
        getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
          if (ciId === '1097745969774592') { // 设备类型
            this.deviceTypeList = res.data;
          }
          // else if(ciId==='1097745625841664'){ // 设备分类
          //   this.deviceCategoryList  = res.data;
          // }
        });
      },
      // getAttachId(attachId){
      //   this.form.attachId = attachId
      // },
      // loadDeviceDataList() {
      //   //加载 设备列表
      //   this.loading = true;
      //   let query = {};
      //   query.operationId = this.id||'';
      //   getDeviceList(this.page.currentPage, this.page.pageSize,query).then(res => {
      //     const data = res.data.data;
      //     this.page.total = data.total;
      //     this.deviceList = data.records;
      //     this.loading = false;
      //   });
      // },
    }
  };
</script>
<style lang="scss" scoped>
// ::v-deep .stepBottom .el-step:last-of-type .el-step__description, .el-step:last-of-type .el-step__main{
//   padding-right: 20%;
// }
// ::v-deep .stepBottom .el-step:last-of-type .el-step__description, .el-step:last-of-type .el-step__main {
//     padding-right: 10%;
// }

.devRenCon{
  width: 100%;
  height: 100%;
}
.formLabel{
  line-height: 16px;
  display: block;
}
</style>
