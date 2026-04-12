<template>
  <div class="wrap">
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="beforeCloseHandler"
      :visible.sync="isShow"
      append-to-body
      title="设备列表"
      width="1100px"
      top="8vh"
      v-el-drag-dialog
    >

      <el-steps :active="active" finish-status="success" process-status="finish">
        <el-step title="选择设备"></el-step>
        <el-step title="完善U位信息" class="ww2"></el-step>
      </el-steps>
      <template v-if="active === 0">
        <div class="page_form">
          <el-form
            ref="searchForm"
            :model="searchForm"
            label-suffix=":"
            label-width="100px"
            class="xt_search_form"
          >
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item label="设备分类" prop="deviceCategoryCode">
                  <el-select v-model="searchForm.deviceCategoryCode" :disabled="deviceCategory" placeholder="请选择设备分类" clearable @change="deviceCategoryCodeChange">
                    <el-option  v-for="dict in deviceCategoryCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备类型" prop="deviceTypeCode" >
                  <el-select v-model="searchForm.deviceTypeCode" :disabled="!(searchForm.deviceCategoryCode && !deviceType)" placeholder="请输入设备类型" clearable >
                    <el-option  v-for="dict in deviceTypeCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备来源" prop="deviceSourceCode" >
                  <el-select v-model="searchForm.deviceSourceCode" @change="deviceChange" clearable placeholder="请选择设备来源">
                    <el-option
                      v-for="item in deviceSourceList"
                      :value="item.dictKey"
                      :key="item.dictKey"
                      :label="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备品牌" prop="brandCode">
                  <el-select v-model="searchForm.brandCode" filterable clearable placeholder="请选择品牌" @change="brandChange">
                    <el-option v-for="dict in brandList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备系列" prop="seriesCode">
                  <el-select v-model="searchForm.seriesCode"  clearable placeholder="请选择系列" :disabled="!searchForm.brandCode" @change="seriesChange">
                    <el-option v-for="dict in seriesList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备型号" prop="deviceModelCode">
                  <el-select v-model="searchForm.deviceModelCode"  clearable placeholder="请选择型号" :disabled="!searchForm.seriesCode" @change="deviceModelChange">
                    <el-option v-for="dict in deviceModelList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="IP" prop="IP">
                  <el-input v-model="searchForm.IP" placeholder="请选择IP"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="MAC" prop="MAC">
                  <el-input v-model="searchForm.MAC" placeholder="请选择MAC"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备编码" prop="deviceCode">
                  <el-input v-model="searchForm.deviceCode" placeholder="请选择设备编码"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备状态" prop="deviceStatusCode" >
                  <el-select v-model="searchForm.deviceStatusCode"  clearable placeholder="请选择设备状态" :disabled="isChange">
                    <el-option v-for="dict in deviceStatusCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item class="labelHe" label="设备高度(U)">
                  <el-input v-model="searchForm.deviceHeight" clearable placeholder="请输入设备高度"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属机房" prop="computerRoomCode">
                  <el-select v-model="searchForm.computerRoomCode" @change="computerRoomChange" placeholder="请选择所属机房" clearable>
                    <el-option v-for="dict in roomList" :key="dict.uuid" :label="dict.roomName" :value="dict.uuid"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属机柜" prop="cabinetCode">
                  <el-select v-model="searchForm.cabinetCode" placeholder="请选择所属机柜" clearable :disabled="!searchForm.computerRoomCode">
                    <el-option v-for="dict in cabinetCodeList" :key="dict.id"  :label="dict.deviceName" :value="dict.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16" style="text-align: right;line-height: 40px;">
                <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="searchReset" plain>重置</el-button>
              </el-col>
              
            </el-row>
          </el-form>
        </div>
        <div class="page_body">
          <el-table
            ref="dataTable"
            size="small"
            @selection-change="select"
            :data="tableData"
            v-loading="loading"
            height="390px"
            row-key="id"
          >
            <el-table-column type="selection" width="30" fixed="left" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="deviceCategory" label="设备分类" width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deviceType" label="设备类型" width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="brand" label="品牌" width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="series" label="系列" width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deviceModel" label="型号" width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="IP" label="IP地址" width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="MAC" label="MAC地址" width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备高度(U)" width="90" prop="deviceHeight" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="设备起始高度(U)" width="90" prop="deviceHeightBegin" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="deviceCode" label="设备编码" width="180" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="cabinet" label="所属机柜" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="deviceSource" label="设备来源" width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deviceStatus" label="设备状态" width="100" align="center" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="deviceCodeErp" label="ERP资产编码" width="175" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deviceName" label="设备名称" width="150" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sn" label="出厂序列号" width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="100" align="center" fixed="right">
              <template  slot-scope="scope">
                <el-button type="text"  size="small" @click="handleSave(scope.row)">选择</el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <pagination
            :total="total"
            :page.sync="searchForm.current"
            :limit.sync="searchForm.size"
            @pagination="getList"
          />
        </div>
      </template>
      <cabinetsU 
        v-else 
        ref="cabinetsU" 
        :tableDataProps='selectList'
        :cabinetsListId='cabinetsListId'
        :cabinetCapacity='cabinetCapacity'
      ></cabinetsU>
      <div class="btn-row">
        <el-button type="primary" @click="handleCheck" v-if="active === 1" style="margin-right: 15px">校验</el-button>
        <el-button type="danger" @click="handleDel" v-if="active === 1" plain style="margin-right: 15px">移除</el-button>
        <el-button type="primary" @click="handleSubmit" v-if="active === 1" plain style="margin-right: 15px">提交</el-button>
        <el-button type="primary" @click="handleNextStep" v-if="active === 0" style="margin-right: 40px">下一步</el-button>
        <el-button type="primary" @click="handleReturn" v-if="active === 0" plain>返回</el-button>
        <el-button type="primary" @click="handlePrevious" v-if="active === 1" plain>上一步</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cabinetsU from './cabinetsU'
import {getRoomList} from "@/api/device/resoureroom";
import {getDictCmdbList,getCmdbList,getDictCmdbListPid} from "@/api/dict";
import {mapGetters} from "vuex";
import {getCabinetsList, cabinetsGetDeviceList, cabinetsCheck, cabinetsSubmit} from "@/api/device/resourecabinets";


export default {
  components: {cabinetsU},
  props: {
    placeholder: {
      type: String
    },
    deviceType: {
      type: String,
      default: ""
    },
    deviceCategory: {
      type: String,
      default: undefined
    },
    type: {
      type: String
    },    
    multiple: {
      type: Boolean,
      default: true
    },
    deviceList: {
      type: Array,
      default: []
    },
    cabinetsListId: {},
    cabinetCapacity: {}
  },
  data() {
    return {
      active: 0,

      roomList: [],
      cabinetCodeList: [],
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      deviceSourceList: [],
      isShow:true,
      searchForm: {
        current: 1,
        size: 20,
        deviceStatusCode: undefined,
        deviceCategoryCode: this.deviceCategory,
        deviceTypeCode: this.deviceType,
        cabinetCode: undefined,
        brandCode: undefined,
        seriesCode: undefined,
        deviceModelCode: undefined,
      },
      // 表格
      tableData: [
        // {eprNum: 2023},
        // {eprNum: 220},
      ],
      tableHeight: '550px',
      loading: false,
      total: 0,
      selectList: [],


      deviceCategoryCodeList: [],
      deviceTypeCodeList: [],
      deviceStatusCodeList: [],
    };
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"]),
    isVisible: {
      get(){
        return this.isVisible
      },
      set(val){
        this.$emit("update:isShow", val)
      }
    }
  },
  created() {

    // 已报废 1105092729438209
    // 退运在库 1105092544888833
    // 待报废 1105089734705152
    // 在运 1105089449492480
    // 库存备用 1104999917879296
    //加载字典--设备类型
    // this.getCmdbDictList("1097745969774592");
    this.getDictCmdbListPid('1097745969774592', this.deviceCategory) // 设备类型
    //加载字典--设备分类
    this.getCmdbDictList("1097745625841664");
    //加载字典--设备状态
    this.getCmdbDictList("1103423111233536");
    //加载字典--设备来源
    this.getCmdbDictList("1102860579569664");
    //加载字典--品牌
    this.getCmdbDictList("1082554947272704");
    // 机房
    getRoomList({current:1, size:999999, maintenanceUnit:this.userDetail.ownerUnit}).then(res => {
      this.roomList = res.data.records;
    })
    

   
    this.searchForm.area = this.userDetail.regionCode||'37'
    this.searchForm.ownerUnitCode = this.userDetail.ownerUnit||''
    this.searchForm.deviceStatusCode = '1105089449492480' //设备状态 在运
    
    //加载数据
    this.getList()
  },
  methods: {
    computerRoomChange(val){
      let params = {
        computerRoomCode: val,
        current: 1,
        size: 999,
        deviceTypeCode: '1135308277350478'
      }
      this.searchForm.cabinetCode = undefined
      getCabinetsList(params).then(res => {
        this.cabinetCodeList = res.data.data
      })
    },
    handleReturn(){
      this.$emit('close')
    },
    handleNextStep(){
      if(this.selectList.length == 0){
        this.$message.warning('请选择设备！')
        return
      }
      this.active = 1
    },
    handlePrevious(){
      this.selectList = []
      this.active = 0
    },

    brandChange(val){ // 品牌
        this.searchForm.seriesCode = "";
        this.searchForm.deviceModelCode = "";

        this.getDictCmdbListPid('1082609011851264', val) // 系列

        // let current = this.brandList.filter(el=> el.dictKey == val)[0]
        // this.searchForm.brandName = current.dictValue;
      },
      seriesChange(val){ // 系列
        this.searchForm.deviceModelCode = "";

        this.getDictCmdbListPid('1082608047161344', val) // 型号

        // let current = this.seriesList.filter(el=> el.dictKey == val)[0]
        // this.searchForm.seriesName = current.dictValue;
      },
      deviceModelChange(val){ // 型号
        // let current = this.deviceModelList.filter(el=> el.dictKey == val)[0]
        // this.searchForm.deviceModelName = current.dictValue;
      },
    select(val) {
      this.selectList = val;
    },
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 50 - 47 + 'px'
    },
    getCmdbDictList(code){
      //加载cmdb字典
      let query = {}
      query.ciId = code||'1082372687986688'
      getDictCmdbList( query ).then(res => {
        if(code==='1103423111233536'){ // 设备状态
          let data = res.data
          this.deviceStatusCodeList  = data.filter(el=> el.dictValue=='在运' || el.dictValue=='库存备用' || el.dictValue=='退运在库');
        }else if(code==='1097745625841664'){
          let data = res.data
          this.deviceCategoryCodeList = data.filter(el=> el.dictValue=='主机设备' || el.dictValue=='网络设备' || el.dictValue=='存储设备' || el.dictValue=='安全设备');
        }else if(code==='1097745969774592'){
          this.deviceTypeCodeList  = res.data;
        }else if(code==='1102860579569664'){ // 设备来源
          this.deviceSourceList  = res.data;
        }else if (code === '1082554947272704') { // 品牌
            this.brandList = res.data
        }
      });
    },
    getDictCmdbListPid(ciId, pid){
      getDictCmdbListPid({ ciId: ciId, pid: pid }).then(res => {
        if(ciId==='1097745969774592'){ // 设备类型
          this.deviceTypeCodeList = res.data
        } else if (ciId === '1082609011851264') { // 系列
          this.seriesList = res.data
        } else if (ciId === '1082608047161344') { // 型号
          this.deviceModelList = res.data
        }
      });
    },
    deviceCategoryCodeChange(code){
      //设备分类选择
      this.searchForm.deviceType = undefined
      this.searchForm.deviceTypeCode = undefined
      // this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));
      this.getDictCmdbListPid('1097745969774592', code) // 设备类型
    },
    deviceChange(){

    },
    getList() {
      this.loading = true
      this.searchForm.cabinets = this.cabinetsListId
      cabinetsGetDeviceList(this.searchForm).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    
    handleCheck(){
      let datas = this.$refs.cabinetsU.tableData
      let flag = datas.some(el=> !el.deviceHeight || !el.deviceHeightBegin)
      if(flag){
        this.$message.warning("请将设备信息填写完整！")
        return
      }
      let params = {
        id: this.cabinetsListId,
        cabinetCapacity: this.cabinetCapacity,
        deviceList: datas
      }
      this.$refs.cabinetsU.loading = true
      cabinetsCheck(params).then(res=>{
        this.selectList = res.data
        this.$refs.cabinetsU.loading = false
      })
    },
    handleDel(){
      this.$refs.cabinetsU.delSelect()
    },
    handleSubmit(){
      let datas = this.$refs.cabinetsU.tableData

      if(datas.length == 0){
        this.$message.warning("选择设备不能为空！")
        return
      }

      let flag = datas.some(el=> !el.deviceHeight || !el.deviceHeightBegin)
      if(flag){
        this.$message.warning("请将设备信息填写完整！")
        return
      }
      
      let params = {
        id: this.cabinetsListId,
        cabinetCapacity: this.cabinetCapacity,
        deviceList: datas
      }

      this.$refs.cabinetsU.loading = true
      cabinetsSubmit(params).then(res=>{
        if(res.msg == '操作成功'){
          
          // console.log(909090, datas)
          datas.forEach(el=>{
            el.name = el.deviceName
            el.type = "device"
            
            setTimeout(() => {
              this.$store.commit('SET_UPDATE_FORM', {handleType: '机柜新增', dataType: 'room', nodeDetail: el})
            }, 20);
            
          })

          
          this.$emit('close')
          this.$message.success("操作成功！")
        }else{
          this.selectList = res.data
          this.$message.error('存在校验未通过设备, 请重新编辑!')
        }
        this.$refs.cabinetsU.loading = false
        
      })


      // let tongguo = datas.filter(ele=> ele.checkMark === 0)
      // if( tongguo.length > 0 ){
      //   cabinetsSubmit(tongguo).then(res=>{
      //     if( datas.length == tongguo.length ){
      //       //点击关闭按钮
      //       this.$emit('close')
      //     }
      //     this.$message.success("操作成功！")
      //   })
      // }else{
      //   this.$message.warning("无校验通过的设备，无法提交！")
      // }
    },
    // 查询
    handleQuery() {
      this.searchForm.current = 1
      this.getList()
    },
    // 重置
    searchReset() {
      this.searchForm = {
        current: 1,
        size: 20,
        area: this.userDetail.regionCode||'37',
        ownerUnitCode: this.userDetail.ownerUnit||'',
        deviceStatusCode: undefined,
        deviceCategoryCode: this.deviceCategory,
        deviceTypeCode: this.deviceType,
      }

      this.getList()
    },

    beforeCloseHandler(){
      //点击关闭按钮
      this.$emit('close')
      this.isVisible = false
    },
    handleSave(row){

      if( this.deviceList.length>0 && this.deviceList.some(el=> el.deviceId == row.id) ){
        this.$message.warning('该设备已存在，请重新选择')
        return
      }

      //保存
      let list = []
      list.push(row)
      this.$emit("setVal", list);
      this.isVisible = false
    },
  }
};
</script>
<style lang='scss' scoped>
.el-steps{
  width: 360px;
  margin: 0px 0 25px 320px;
}
.btn-row{
  text-align: center;
  margin-top: 20px;
  // margin-bottom: 5px;
}
.wrap {
  width: 100%;
}
::v-deep .el-select {
  width: 100% !important;
}

::v-deep .el-step__title{
  position: absolute;
  left: 24px;
  top: -7px;
  background: #fff;
  padding: 0 10px;
}
::v-deep .ww2 .el-step__title{
  width: 100px;
}
::v-deep .el-step.is-horizontal .el-step__line{
  position: absolute;
  height: 2px;
  top: 11px;
  left: 0;
  right: 10px;
}
::v-deep .el-dialog{
  margin-bottom: 0 !important;
}
::v-deep .el-step__head.is-success{
  color: #409EFF;
  border-color: #409EFF;
}
::v-deep .el-step__title.is-success{
  color: #409EFF;
}
</style>
