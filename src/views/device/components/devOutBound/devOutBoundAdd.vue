<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <formTitle :titleText="'设备出库信息'" :titleType="'page_title'"></formTitle>
      <el-scrollbar style="height:calc(100% - 200px - 48px)">
        <el-form :model="form" :rules="rules" ref="dataForm" class="xt_form" label-width="100px" style="height: 320px;">
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="出库单号" prop="outboundNo" size="small">
                <el-input v-model="form.outboundNo"  placeholder="出库单号自动生成" clearable maxlength="24" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item  label="关联申请单" prop="applyNo" size="small">
                <el-input v-model="form.applyNo"  placeholder="申请编号" clearable maxlength="24" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备分类" prop="deviceCategory">
                <el-select v-model="form.deviceCategory"  placeholder="请选择设备分类" clearable @change="deviceCategoryChange" disabled>
                  <el-option  v-for="dict in deviceCategoryList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备类型" prop="deviceType" >
                <el-select v-model="form.deviceType"  placeholder="请输入设备类型" clearable disabled>
                  <el-option  v-for="dict in deviceTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="出库数量" prop="applyNum" size="small" disabled>
                <el-input v-model="form.applyNum"  placeholder="请输入出库数量" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出库人员" prop="applyUserName" size="small">
                <el-input v-model="form.applyUserName"  placeholder="请输入出库人员" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出库日期" prop="applyDate" size="small">
                <el-date-picker type="date" placeholder="选择出库日期" v-model="form.applyDate" :disabled="!isAudit"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="领用单位" prop="receiveUnitName"  clearable disabled>
                <!-- <el-input v-model="form.receiveUnitName"  clearable disabled></el-input> -->
                <xt-tree-lzay-select :formValue="form.receiveUnitName"
                                   :selectType="'CORP'"
                                   @getTreeItem="getEntityUnit"
              ></xt-tree-lzay-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="所在仓库" prop="warehouseName"  clearable>
<!--                <el-input v-model="form.warehouseName"  placeholder="请输入出库人员" clearable disabled></el-input>-->
                <el-select v-model="form.warehouse"  placeholder="请选择所在出库" clearable @change="warehouseChange" :disabled="!isAudit">
                  <el-option  v-for="dict in warehouseList" :key="dict.uuid"  :label="dict.warehouseName" :value="dict.uuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="设备来源" prop="deviceSource"  clearable >
                <el-select v-model="form.deviceSource"  placeholder="请选择设备来源" clearable disabled>
                  <el-option  v-for="dict in deviceSourceList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey" ></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="备注" prop="remark" size="small" :disabled="!isAudit">
                <el-input placeholder="请输入备注"  clearable v-model="form.remark" maxlength="200" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6" style="height: auto;">
            <el-col :span="12">
              <el-form-item label="申请图片" size="small">
                <uploadImg
                  ref="uploadImg"
                  disabled
                  :type="'设备申请'"
                  :fileList="fileList1"
                  :attachId="form.attachId"
                ></uploadImg>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出库图片" size="small">
                <uploadImg
                  ref="uploadImg2"
                  :type="'设备出库'"
                  :fileList.sync="fileList2"
                  :attachId="form.attachId"
                  @setVal="selectDeviceFileHandler"
                ></uploadImg>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 中间设备列表 -->
        <formTitle :titleText="'设备信息列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" :disabled="!isAudit" @click="selectDevice">选择设备</el-button>
            <el-button type="danger" size="small" :disabled="!isAudit" @click="clearDevice">清空设备</el-button>
          </div>
        </formTitle>
        <el-table
          ref="deviceTable"
          :data="deviceList"
          v-loading="loading"
          size="small"
          height="320px"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="30" fixed="left"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" align="center" ></el-table-column>
          <el-table-column prop="deviceName" label="设备名称" align="center" ></el-table-column>
          <el-table-column prop="deviceSourceName" label="设备来源" width="100" align="center" ></el-table-column>
          <el-table-column prop="erpAssetCode" label="ERP资产编码" width="150" align="center" ></el-table-column>
          <el-table-column prop="factoryNumber" label="出厂序列号" align="center" ></el-table-column>
          <el-table-column prop="userType" label="使用类型" width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.userType == '1' ? '个人' : '公用' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="使用人" align="center" ></el-table-column>
          <el-table-column prop="userPhone" label="使用人联系方式" align="center" ></el-table-column>
          <el-table-column prop="userCard" label="使用人身份证号" align="center" ></el-table-column>
          <el-table-column prop="address" label="安装地点" align="center" ></el-table-column>
          <el-table-column prop="userTime" label="领用时间" align="center" ></el-table-column>
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template  slot-scope="scope">
              <el-button type="text" v-if="isAudit" size="small" @click="selectDeviceOne(scope.row)">选择设备</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <!-- 底部按钮  v-if="form.status==0" -->

      <!-- 中间设备列表 -->
      <formTitle :titleText="'审核信息'" :titleType="'page_title'"></formTitle>
      <el-form ref="chekForm" class="xt_form" label-width="100px" style="height: 70px;">
        <el-row :span="6">
          <el-col :span="18">
            <el-form-item label="审批意见">
              <el-input v-model="comment" type="textarea" :rows="3" :disabled="!isAudit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="form-btn">
        <el-button type="primary" v-if="isAudit" size="small" :loading="btnLoading" @click="handleSaveOK(0)">出 库</el-button>
        <!-- <el-button type="danger" v-if="isAudit" size="small"  @click="handleSaveOK(1)"  style="margin-left: 50px;">驳 回</el-button> -->
        <el-button class="border-btn" size="small" @click="handleReset"  style="margin-left: 50px;">返 回</el-button>
      </div>
    </div>
    <!-- 上传 -->
    <uploadModel v-if="openUpload" :isShow.sync="openUpload" @setVal='setValDeviceList'></uploadModel>
    <!-- 选择设备 -->
    <deviceSelect type="outbound" chuku :warehouse="form.warehouse" :deviceType="form.deviceType" :deviceCategory="form.deviceCategory" :deviceList="deviceList"
                  :warehouseName="form.warehouseName" v-if="deviceSelectSync" :isShow.sync="deviceSelectSync"  @setVal="selectDeviceHandler"></deviceSelect>
  </basic-container>
</template>

<script>
  import crypto from "@/util/crypto";
  import { submit } from "@/api/device/deviceoutbound";
  import { getDetail } from "@/api/device/deviceapply";
  import { getDeviceList} from "@/api/device/deviceoutbounddetail";
  import {getDictList,getDictCmdbList} from "@/api/dict";
  import {mapGetters} from "vuex";
  import uploadModel from "@/views/device/components/capitalTransfer/uploadModel.vue";
  import uploadImg from "@/views/operation/components/devReturned/uploadImg.vue";
  import deviceSelect from "@/components/deviceSelect/index.vue";
  import {getWareDictList} from "@/api/device/warehouse";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
  import {getDeptList} from "@/api/system/dept";
  import {getUserDetail} from "@/api/user";
  import {rejectProcess, submitProcess, outboundDeviceCheck, updateDevOutBoundStatus} from "@/api/process";
  import Vue from "vue";

  export default {
    components: {xtTreeLzaySelect, deviceSelect, uploadImg, uploadModel},
    data() {
      return {
        btnLoading: false,
        id:'',
        userDetailInfo : {},
        wbsProject: '',
        wbsElement: '',
        deviceCode:'',
        form: {
          serialNumber:123456,
          attachId:123456
        },
        queryDate: {},
        deviceSelectSync: false,
        loading: false,
        isEdit: true,
        deviceAddTypeList:[],
        deviceChangeTypeList: [],
        useKeepDeptList:[],
        deviceStatusList:[],
        deviceErpStatusList:[],
        deviceWBSList:[],
        deviceChangeList:[],
        deviceCategoryList: [],
        deviceTypeList: [],
        selectionList: [],
        networkTypeList: [],
        brandList: [],
        seriesList:[],
        deviceModelList: [],
        funLocationList:[],
        deviceSourceList: [],
        deviceList: [],
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        cmdbForm:{},
        openUpload: false,
        selectDeviceId: '',
        warehouseList: [],
        unitList: [],
        fileList1: [],
        fileList2: [],
        comment: '',
        showAudit: this.$route.query.isAudit||false,
        isAudit: this.$route.query.isAudit,

        initDevList: [],
        rules: {
          warehouseName: [
            {required: true, message: "请选择所在出库", trigger: "change"}
          ],
        }
      };
    },
    computed: {
      ...mapGetters(["permission","userInfo","userDetail"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.deviceapply_add, false),
          viewBtn: this.vaildData(this.permission.deviceapply_view, false),
          delBtn: this.vaildData(this.permission.deviceapply_delete, false),
          editBtn: this.vaildData(this.permission.deviceapply_edit, false),
          exportBtn: this.vaildData(this.permission.deviceapply_export, false)
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
    mounted(){
      // 设置页面元素高度
      this.setPageContentHeight()
      //加载字典--工单状态
      this.getDictList("outBoundStatus");
      //加载字典--设备类型
      //this.getDictList("deviceType");
      this.getCmdbDictList("1097745969774592");
      //加载字典--设备分类
      //this.getDictList("deviceCategory");
      this.getCmdbDictList("1097745625841664");
      //加载字典--网络类型
      this.getDictList("networkType");
      //加载字典--投运类型
      this.getDictList("operationType");
      // 加载字典--设备来源
      this.getCmdbDictList('1102860579569664') // 设备来源
      //加载 仓库列表
      this.getWareList(this.userDetail.ownerUnitId);
      // 获得部门树
      this.getDeptList()

      if(this.isAudit==null){
        this.isAudit = true
      }
      this.form.receiveUnitName = this.userDetail.ownerUnitName
      this.form.receiveUnit = this.userDetail.ownerUnit

      this.id = null;
      //获取参数 判断是否是新增还是修改
      const params = this.$route.query
      this.id = params.id;
      if(params.id){
        this.id = params.id;
        this.loadDetail({id:params.id});
        this.isEdit = true
        //加载 设备列表
        //this.loadDeviceDataList();
      }else{
        //加载空数据
        this.isEdit = true
      }
    },
    methods: {
      
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
            this.networkTypeList = res.data;
          }else if(code==='outBoundStatus'){
            this.outBoundStatusList = res.data;
          }else if(code==='operationType'){
            this.operationTypeList  = res.data;
          }else if(code==='deviceSource'){
            this.deviceSourceList  = res.data;
          }
        });
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
          }else if(code==='1102860579569664'){ // 设备来源
            this.deviceSourceList  = res.data;
          }
        });
      },
      getWareList(ownerUnitId){
        //加载仓库列表
        getWareDictList({ownerUnitId:ownerUnitId||this.userDetail.ownerUnitId}).then(res => {
            this.warehouseList  = res.data;
        });
      },
      getDeptList() {
        //加载部门数据
        getDeptList().then(res => {
            this.unitList = res.data
        })
      },
      // eslint-disable-next-line no-unused-vars
      getEntityUnit(val) {
        //选择领用单位 部门
        this.form.receiveUnitName = val.fullName
        this.form.receiveUnit = val.id
        //this.$refs.form.$forceUpdate()
        //this.$forceUpdate()
      },
      deviceCategoryChange(code){
        //设备分类选择
        
      },
      clearDevice(){
        this.deviceList = JSON.parse(JSON.stringify( this.initDevList )) || [];
      },
      warehouseChange(code){
        //仓库编码
        let warehouse = this.warehouseList.filter(item => item.uuid===code);
        if(warehouse){
          this.form.warehouseName = warehouse[0].warehouseName
          this.form.warehouse = warehouse[0].uuid
          this.$refs.dataForm.$forceUpdate()
          this.$forceUpdate()
        }

        // this.deviceList = []
        this.deviceList = JSON.parse(JSON.stringify( this.initDevList )) || [];
      },
      selectionChange(selection) {
        //点击选择事件
        this.selectionList = selection.map(item => item.id);
      },
      async handleSaveOK(workerStatus) {
        this.$refs.dataForm.validate(async valid => {
          if (valid) {
            if( this.deviceList.length == 0 ){
              return this.$message.warning('设备信息不能为空！')
            }

            if(!this.comment){
              return this.$message.warning('请输入审批意见！')
            }

            this.form.status = null;
            //提交建档
            this.form.deviceOperationDetailDTOList = this.deviceList || [];

            this.form.deviceOperationDetailVOList = []
            this.form.deviceOrderFileVOList = []
            this.form.operationNo = null;
            Vue.delete(this.form, "operationNo")
            // 修改流程状态
            let processApi = null
            if(workerStatus === 0) processApi = submitProcess
            else processApi = rejectProcess


            let params = {
              // taskDefinitionKey: cerateRes[1].data[0].taskDefinitionKey,
              id: this.form.id,
              workerStatus: workerStatus,//发起
              comment: this.comment||"",
              // examineRole: cerateRes[1].msg,
              examineType: "2",
              ...this.form
            };

            this.btnLoading = true
            let cerateRes = await this.$asyncCatchApi(outboundDeviceCheck, params) //  cerateRes[1].code
            // console.log(666, cerateRes)
            if( cerateRes[0] ) {
              this.btnLoading = false
              return
            }



            let updateRes = await this.$asyncCatchApi(updateDevOutBoundStatus, params)
            // console.log(888, updateRes)
            if (updateRes[0]) {
              this.btnLoading = false
              return
            }

            this.btnLoading = false
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.handleReset();
 
          }
        })
      },
      handleSave(status) {
        this.$refs.dataForm.validate(valid =>{
          if(valid){
            this.form.status = status;
            this.form.deviceOperationDetailDTOList = this.deviceList||[];
            // this.form.deviceOrderFileDTOList = this.fileList || [];
            // this.form.deviceOrderFileDTOList.forEach(i => {i.status = null })
            //暂存
            submit(this.form).then(() => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.handleReset();
            }, error => {
              //  
            });
          }
        })
      },
      handleReset(){ //返回
        if( this.$route.query.formRouter ){
          return this.$closePage(this.$route.query.formRouter)
        }

        if( this.isAudit ){
          this.$closePage('/personalDesk/desk')
        }else{
          this.$closePage('/device/devOutBound')
        }


      },
      showDictLable(code,dictList){
        if(dictList!=null && code!=''){
          let items = dictList.filter(item => item.dictKey===code);
          if(items!=null && items.length>0){
            return items[0].dictValue;
          }
        }
        return code;
      },
      loadDetail(params){
        getDetail(params).then(res => {
          // let resData = res.data;
          // if( resData.deviceOperationDetailVOList.length>0 ){
          //   resData.deviceOperationDetailVOList.forEach(ele=>{
          //     ele.userPhone = ele.userPhone && crypto.decryptBySM4(ele.userPhone)
          //     ele.userCard = ele.userCard && crypto.decryptBySM4(ele.userCard)
          //   })
          // }  
          
          // console.log(90, res)

          this.form = res.data;
          this.form.deviceSource = this.form.deviceSource+''
          this.form.applyUser= this.form.applyUser||this.userDetailInfo.userName
          this.form.applyDate= this.form.applyDate||this.userDetailInfo.systemTime
          // this.form.deviceCategoryName = this.showDictLable(this.form.deviceCategory,this.deviceCategoryList);
          // this.form.deviceTypeName = this.showDictLable(this.form.deviceType,this.deviceTypeList);


          this.initDevList = this.form.deviceOperationDetailVOList
          this.deviceList = JSON.parse(JSON.stringify( this.initDevList )) || [];
          this.form.deviceOrderFileDTOList  = this.form.deviceOrderFileVOList
          this.fileList1 = this.form.deviceOrderFileVOList.filter(el=>el.orderType == 'Apply') || [];
          this.fileList1.forEach(i => {
            i.name = i.fileName,
            i.url = i.fileUrl
          })

          this.fileList2 = this.form.deviceOrderFileVOList.filter(el=>el.orderType == 'Outbound')||[];
          this.fileList2.forEach(i => {
            i.name = i.fileName,
            i.url = i.fileUrl
          })

          this.getWareList(this.form.receiveUnit||this.userDetail.ownerUnitId);
        });
      },
      currentChange(currentPage){
        //分页 设备列表 点击第几页
        this.page.currentPage = currentPage;
        this.loadDeviceDataList();
      },
      sizeChange(pageSize){
        //切换设备列表  每页数量
        this.page.pageSize = pageSize;
        this.loadDeviceDataList();
      },
      loadDeviceDataList() {
        //加载 设备列表
        this.loading = true;
        let query = {};
        query.outboundId = this.id||'';
        getDeviceList(this.page.currentPage, this.page.pageSize,query).then(res => {
          const data = res.data;
          //this.page.total = data.total;
          this.deviceList = data.records;
          this.loading = false;
        });
      },
      beforeOpen() {
        //加载默认数据
        getUserDetail().then(res => {
          let usr = res.data;
          this.userDetailInfo = usr||{}
          this.form.applyUser= usr.realName||''
          this.form.applyDate= usr.systemTime||null

          this.form.regionCode= usr.regionCode||''
          this.form.regionName= usr.regionName||''
          this.form.receiveUnit = usr.ownerUnit||''
          this.form.receiveUnitName= usr.ownerUnitName||''

          this.$refs.dataForm.$forceUpdate()
          this.$forceUpdate()
        });
      },
      handleImport(){
        this.openUpload = true
      },
      applyNumChange(){
        //调整设备数量
        if(this.form.outboundNum > 99){
          this.$message({
            message: "出库数量限制不能超过申请数量,请重新输入！",
            type: "error"
          });
          this.form.outboundNum = 99;
        }
      },
      handleDelete(idx){
        //删除
        this.deviceList.splice(idx,1)
        this.form.applyNum = this.deviceList.length
      },
      getAttachId(attachId){
        this.form.attachId = attachId
      },
      selectDevice(){
        if(!this.form.warehouse){
          return this.$message.warning("请选择所在仓库！")
        }
        //弹框 选择设备
        this.selectDeviceId = null;
        this.deviceSelectSync = true
      },
      selectDeviceOne(row){
        if(!this.form.warehouse){
          return this.$message.warning("请选择所在仓库！")
        }
        //弹框 选择设备
        this.selectDeviceId = row.id;
        this.deviceSelectSync = true
      },
      selectDeviceFileHandler(file){
        // console.log(11456, file)

        let shuhu = this.form.deviceOrderFileDTOList.findIndex(el=> el.orderType == 'Outbound')
        // console.log(800, shuhu)
        if(file){ // 新增图片
          file.orderType = 'Outbound'
          this.form.deviceOrderFileDTOList.push(file)
        }else{ // 删除图片
          this.form.deviceOrderFileDTOList.splice(shuhu, 1)
        }
        // console.log(900, this.form)


        // this.form.deviceOrderFileDTOList  = file
        //新增文件
        // this.fileList = []
        // if(file){
        //   this.fileList.push(file)
        //   this.form.deviceOrderFileDTOList  = []
        //   this.form.deviceOrderFileDTOList.push(file)
        // }
      },
      selectDeviceHandler(list){
        //选择弹框 选择cmdb设备
        if(list && list.length>0){
          if(this.selectDeviceId){
            //判断是否是 单个修改
            this.deviceList.forEach((item, index) => {
              //循环赋值
              if(item.id === this.selectDeviceId){
                let objj = JSON.parse(JSON.stringify(this.deviceList[index]))

                objj.deviceCategory = list[0].deviceCategoryCode || null  // 设备分类
                objj.deviceCategoryName = list[0].deviceCategory || null  // 设备分类名称
                objj.deviceType = list[0].deviceTypeCode || null  // 设备类型
                objj.deviceTypeName = list[0].deviceType || null  // 设备类型名称
                // objj.address = list[0].installationSite || null  // 安装地点
                objj.deviceId = list[0].id || null // 设备CMDB的id
                objj.deviceCid = list[0].ciId || null // 设备CMDB的Cid
                objj.deviceUuid = list[0].uuid || null // 设备CMDB的UUid
                objj.deviceCode = list[0].deviceCode || null // 设备编码
                objj.deviceName = list[0].deviceName || null // 设备名称
                objj.erpAssetCode = list[0].assetCodeErp || null // ERP资产编码
                objj.deviceStatus = list[0].deviceStatus || null // 设备状态
                objj.factoryNumber = list[0].sn || null // 出厂序列号
                objj.deviceIp = list[0].IP || null // IP地址
                objj.deviceMac = list[0].MAC || null // MAC地址
                objj.deviceSubnet = list[0].subnetId || null // 所属子网id
                objj.deviceSubnetName = list[0].subnetName || null // 所属子网名称
                // objj.networkType = list[0].netWorkCode || null // 所属网络id
                // objj.networkTypeName = list[0].netWorkCode || null // 所属网络名称

                objj.deviceSource = list[0].deviceSourceCode || null // 设备来源
                objj.deviceSourceName = list[0].deviceSource || null // 设备来源

                objj.deviceNetworkType = list[0].networkAccessMethod || null // 入网方式
                objj.fullName = list[0].fullName || null // 标准全称
                objj.afterSaleExpDate = list[0].afterSaleExpDate || null // 售后服务到期时间
                objj.maker = list[0].makerCode || null // 制造商
                objj.makerName = list[0].maker || null // 制造商
                objj.brand = list[0].brandCode || null // 品牌
                objj.brandName = list[0].brand || null // 品牌
                objj.series = list[0].seriesCode || null // 系列
                objj.seriesName = list[0].series || null // 系列
                objj.deviceModel = list[0].deviceModelCode || null // 型号
                objj.deviceModelName = list[0].deviceModel || null // 型号

                objj.isItal = list[0].isITAICode || null // 是否信创设备
                objj.cpuBrand = list[0].cpuBrand || null // CPU品牌
                objj.cpuBrandCode = list[0].cpuBrandCode || null // CPU品牌编码
                objj.osType = list[0].OSTypeCode || null // 操作系统类型
                objj.osTypeCode = list[0].OSTypeCode || null // 操作系统类型编码

                objj.roomId = list[0].computerRoom || null // 机房编号
                objj.roomName = list[0].computerRoomCode || null // 机房名称
                objj.cabinetsId = list[0].cabinetCode || null // 机柜编号
                objj.cabinetsName = list[0].cabinet || null // 机柜名称
                objj.racksId = list[0].rackCode || null // 机架编号
                objj.racksName = list[0].rack || null // 机架名称
                objj.oprtDept = list[0].oprtDeptCode || null // 运行单位编码
                objj.oprtDeptName = list[0].oprtDept || null // 运行单位
                objj.deviceHeight = list[0].deviceHeight || null // 运行单位


                if( this.form.deviceType == '1135308294128009' ){ //网络交换机
                  objj.maker = list[0].makerCode || null // 机架编号
                  objj.makerName = list[0].maker || null // 机架编号
                  objj.portsCount = list[0].electricPortNum + Number(list[0].opticalPortNum) // 机架编号
                }
                



                this.$set(this.deviceList, index, objj);
                // this.deviceList[index] = {
                //   ...item,
                //   ...list[0]
                // }
                // this.deviceList[index].factoryNumber = this.deviceList[0].sn
                // this.deviceList[index].erpAssetCode = this.deviceList[0].assetCodeErp
                // this.deviceList[index].deviceCid = this.deviceList[0].ciId
                // this.deviceList[index].deviceUuid = this.deviceList[0].uuid
                // this.deviceList[index].deviceId = this.deviceList[0].id
                // this.deviceList[index].deviceSubnet = this.deviceList[0].subnetId
                // this.deviceList[index].deviceSubnetName = this.deviceList[0].subnetName
                // this.deviceList[index].operationGrade = this.deviceList[0].operationLevel
                // this.deviceList[index].operationGradeCode = this.deviceList[0].operationLevelCode
                // this.deviceList[index].userCard = this.deviceList[0].deviceUserIDCard
              }
            })
          }else{
            //批量修改
            list.forEach((item, index) => {
              //循环赋值
              if(this.deviceList.length>index){
                let objj = JSON.parse(JSON.stringify(this.deviceList[index]))


                objj.deviceCategory = item.deviceCategoryCode || null  // 设备分类
                objj.deviceCategoryName = item.deviceCategory || null  // 设备分类名称
                objj.deviceType = item.deviceTypeCode || null  // 设备类型
                objj.deviceTypeName = item.deviceType || null  // 设备类型名称
                // objj.address = item.installationSite || null  // 安装地点
                objj.deviceId = item.id || null // 设备CMDB的id
                objj.deviceCid = item.ciId || null // 设备CMDB的Cid
                objj.deviceUuid = item.uuid || null // 设备CMDB的UUid
                objj.deviceCode = item.deviceCode || null // 设备编码
                objj.deviceName = item.deviceName || null // 设备名称
                objj.erpAssetCode = item.assetCodeErp || null // ERP资产编码
                objj.deviceStatus = item.deviceStatus || null // 设备状态
                objj.factoryNumber = item.sn || null // 出厂序列号
                objj.deviceIp = item.IP || null // IP地址
                objj.deviceMac = item.MAC || null // MAC地址
                objj.deviceSubnet = item.subnetId || null // 所属子网id
                objj.deviceSubnetName = item.subnetName || null // 所属子网名称
                // objj.networkType = item.netWorkCode || null // 所属网络id
                // objj.networkTypeName = item.netWorkCode || null // 所属网络名称

                objj.deviceSource = item.deviceSourceCode || null // 设备来源
                objj.deviceSourceName = item.deviceSource || null // 设备来源

                objj.deviceNetworkType = item.networkAccessMethod || null // 入网方式
                objj.fullName = item.fullName || null // 标准全称
                objj.afterSaleExpDate = item.afterSaleExpDate || null // 售后服务到期时间
                objj.maker = item.makerCode || null // 制造商
                objj.makerName = item.maker || null // 制造商
                objj.brand = item.brandCode || null // 品牌
                objj.brandName = item.brand || null // 品牌
                objj.series = item.seriesCode || null // 系列
                objj.seriesName = item.series || null // 系列
                objj.deviceModel = item.deviceModelCode || null // 型号
                objj.deviceModelName = item.deviceModel || null // 型号

                objj.isItal = item.isITAICode || null // 是否信创设备
                objj.cpuBrand = item.cpuBrand || null // CPU品牌
                objj.cpuBrandCode = item.cpuBrandCode || null // CPU品牌编码
                objj.osType = item.OSTypeCode || null // 操作系统类型
                objj.osTypeCode = item.OSTypeCode || null // 操作系统类型编码

                objj.roomId = item.computerRoom || null // 机房编号
                objj.roomName = item.computerRoomCode || null // 机房名称
                objj.cabinetsId = item.cabinetCode || null // 机柜编号
                objj.cabinetsName = item.cabinet || null // 机柜名称
                objj.racksId = item.rackCode || null // 机架编号
                objj.racksName = item.rack || null // 机架名称
                objj.oprtDept = item.oprtDeptCode || null // 运行单位编码
                objj.oprtDeptName = item.oprtDept || null // 运行单位
                objj.deviceHeight = item.deviceHeight || null // 运行单位

                if( this.form.deviceType == '1135308294128009' ){ //网络交换机
                  objj.maker = item.makerCode || null // 机架编号
                  objj.makerName = item.maker || null // 机架编号
                  objj.portsCount = item.electricPortNum + Number(item.opticalPortNum) // 机架编号
                }


                // objj.deviceCategory = item.deviceCategoryCode || null  // 设备分类
                // objj.deviceCategoryName = item.deviceCategory || null  // 设备分类名称
                // objj.deviceType = item.deviceTypeCode || null  // 设备类型
                // objj.deviceTypeName = item.deviceType || null  // 设备类型名称
                // // objj.address = item.installationSite || null  // 安装地点
                // objj.deviceId = item.id || null // 设备CMDB的id
                // objj.deviceCid = item.ciId || null // 设备CMDB的Cid
                // objj.deviceUuid = item.uuid || null // 设备CMDB的UUid
                // objj.deviceCode = item.deviceCode || null // 设备编码
                // objj.deviceName = item.deviceName || null // 设备名称
                // objj.erpAssetCode = item.assetCodeErp || null // ERP资产编码
                // objj.deviceStatus = item.deviceStatus || null // 设备状态
                // objj.factoryNumber = item.sn || null // 出厂序列号
                // objj.deviceIp = item.IP || null // IP地址
                // objj.deviceMac = item.MAC || null // MAC地址
                // objj.deviceSubnet = item.subnetId || null // 所属子网id
                // objj.deviceSubnetName = item.subnetName || null // 所属子网名称
                // // objj.networkType = item.netWorkCode || null // 所属网络id
                // // objj.networkTypeName = item.netWorkCode || null // 所属网络名称

                // objj.deviceSource = item.deviceSourceCode || null // 设备来源
                // objj.deviceSourceName = item.deviceSource || null // 设备来源

                // objj.deviceNetworkType = item.networkAccessMethod || null // 入网方式
                // objj.fullName = item.fullName || null // 标准全称
                // objj.afterSaleExpDate = item.afterSaleExpDate || null // 售后服务到期时间
                // objj.brand = item.brandCode || null // 品牌
                // objj.brandName = item.brand || null // 品牌
                // objj.series = item.seriesCode || null // 系列
                // objj.seriesName = item.series || null // 系列
                // objj.deviceModel = item.deviceModelCode || null // 型号
                // objj.deviceModelName = item.deviceModel || null // 型号

                // objj.isItal = item.isITAICode || null // 是否信创设备
                // objj.cpuBrand = item.cpuBrand || null // CPU品牌
                // objj.cpuBrandCode = item.cpuBrandCode || null // CPU品牌编码
                // objj.osType = item.OSTypeCode || null // 操作系统类型
                // objj.osTypeCode = item.OSTypeCode || null // 操作系统类型编码

                // objj.roomId = item.computerRoom || null // 机房编号
                // objj.roomName = item.computerRoomCode || null // 机房名称
                // objj.cabinetsId = item.cabinetCode || null // 机柜编号
                // objj.cabinetsName = item.cabinet || null // 机柜名称
                // objj.racksId = item.rackCode || null // 机架编号
                // objj.racksName = item.rack || null // 机架名称
                // objj.oprtDept = item.oprtDeptCode || null // 运行单位编码
                // objj.oprtDeptName = item.oprtDept || null // 运行单位










                this.$set(this.deviceList, index, objj);

              }
            })
          }
        }
        this.deviceList.push({})
        this.deviceList.pop()
      },
    }
  };
</script>
<style lang="scss" scoped>
.formLabel{
  line-height: 16px;
  display: block;
}
</style>
