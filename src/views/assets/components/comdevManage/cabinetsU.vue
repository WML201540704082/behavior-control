<template>
  <div class="wrap">
    <div class="page_body">
      <el-table
        ref="dataTable"
        size="small"
        @selection-change="select"
        :data="tableData"
        v-loading="loading"
        height="430px"
        row-key="id"
      >
        <el-table-column type="selection" width="30" fixed="left" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="deviceCode" label="设备编码" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceCategory" label="设备分类" width="90" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceType" label="设备类型" width="90" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand" label="品牌" width="90" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="series" label="系列" width="90" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceModel" label="型号" width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备高度(U)" width="120" prop="deviceHeight" show-overflow-tooltip align="center" fixed="right">
          <template slot-scope="{row}">
            <el-input v-model.number="row.deviceHeight" @input="deviceHeightInput(row)" @blur="gaoduChange" clearable placeholder="请输入" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="设备起始高度(U)" width="130" prop="deviceHeightBegin" show-overflow-tooltip align="center" fixed="right">
          <template slot-scope="{row}">
            <el-select v-model="row.deviceHeightBegin" @change="gaoduChange" placeholder="请选择" clearable size="mini">
              <el-option v-for="dict in deviceHeightBeginList" :key="dict"  :label="dict" :value="dict"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="U位校验提醒" width="140" align="center" fixed="right">
          <template slot-scope="scope">
            <span v-if="scope.row.checkMark == 1" style="color: #f56c6c">{{ scope.row.checkPrompt }}</span>
            <span v-else style="color: #67c23a">{{ scope.row.checkPrompt }}</span>
          </template>
        </el-table-column>

        
      </el-table>
      <!-- <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="getList"
      /> -->
    </div>
  </div>
</template>
<script>
import { cabinetsGetPlace } from "@/api/device/resourecabinets";
import {getDictCmdbList,getCmdbList,getDictCmdbListPid} from "@/api/dict";
import {mapGetters} from "vuex";

export default {
  props: {
    tableDataProps: {
      type: Array,
      default: []
    },
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
      deviceHeightBeginList: [
        // {
        //   label: 1,
        //   value: 1
        // },
        // {
        //   label: 2,
        //   value: 2
        // },
        // {
        //   label: 3,
        //   value: 3
        // },
      ],
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
    
  },
  created() {
    // 已报废 1105092729438209
    // 退运在库 1105092544888833
    // 待报废 1105089734705152
    // 在运 1105089449492480
    // 库存备用 1104999917879296
    //加载字典--设备类型
    // this.getCmdbDictList("1097745969774592");
    // this.getDictCmdbListPid('1097745969774592', this.deviceCategory) // 设备类型
    // //加载字典--设备分类
    // this.getCmdbDictList("1097745625841664");
    // //加载字典--设备状态
    // this.getCmdbDictList("1103423111233536");
    // //加载字典--设备来源
    // this.getCmdbDictList("1102860579569664");
    // //加载字典--品牌
    // this.getCmdbDictList("1082554947272704");
    // getRoomList({current:1,size:999999,ownUnit:this.userDetail.ownerUnit}).then(res => {
    //   this.roomList = res.data.records;
    // })
    

   
    // this.searchForm.area = this.userDetail.regionCode||'37'
    // this.searchForm.ownerUnitCode = this.userDetail.ownerUnit||''
    // this.searchForm.deviceStatusCode = '1105089449492480' //设备状态 在运
    
    
    //加载数据
    this.getList()
    this.gaoduChange()
  },
  methods: {
    deviceHeightInput(val){
      val.deviceHeight = val.deviceHeight.replace(/[^0-9]/g, '')
    },

    gaoduChange(){
      let params = {
        uuid: this.cabinetsListId,
        cabinetCapacity: this.cabinetCapacity,
        deviceList: this.tableData
      }
      cabinetsGetPlace(params).then(res=>{
        let datas = res.data
        datas.forEach(el=> el = el.toString())
        this.deviceHeightBeginList = datas
      })
    },
    handleNextStep(){

    },
    handlePrevious(){

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
    delSelect (){
      if(this.selectList.length == 0){
        this.$message.warning('请选择移除设备！')
        return
      }
      this.selectList.forEach(el=>{
        this.tableData.splice(
          this.tableData.findIndex(v=> v.id == el.id),
          1
        )
      })
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
          this.deviceStatusCodeList  = res.data;
        }else if(code==='1097745625841664'){
          let data = res.data
          this.deviceCategoryCodeList = data.filter(el=> el.dictValue=='基础设施' || el.dictValue=='辅助设备');
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
      this.tableData = JSON.parse(JSON.stringify(this.tableDataProps))
      // this.loading = true
      // getCmdbList(this.searchForm).then(res => {
      //   this.tableData = res.data.data
      //   this.total = res.data.total
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
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

  },
  watch: {
    tableDataProps() {
      // console.log(989, this.tableDataProps)
      this.tableData = JSON.parse(JSON.stringify(this.tableDataProps))
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
</style>
