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
         
            
            
          </el-row>
        </el-form>
      </div>
      <div class="page_body">
        <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="searchReset" plain>重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="handleSubmit">提交</el-button>
          </div>
        </formTitle>
        <el-table
          ref="dataTable"
          size="small"
          @selection-change="select"
          :data="tableData"
          v-loading="loading"
          height="500px"
          row-key="id"
        >
          <el-table-column type="selection" width="30" fixed="left" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="deviceCategory" label="设备分类" width="100" align="center" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="deviceType" label="设备类型" width="100" align="center" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="deviceSource" label="设备来源" width="100" align="center" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" width="180" align="center" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="deviceCodeErp" label="ERP资产编码" width="175" align="center" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="deviceName" label="设备名称" width="150" align="center" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="deviceStatus" label="设备状态" width="100" align="center" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="MAC" label="MAC地址" width="120" align="center" show-overflow-tooltip sortable></el-table-column>
          <!-- <el-table-column prop="ip" label="IP地址" width="100" align="center" show-overflow-tooltip sortable></el-table-column> -->
          <el-table-column prop="sn" label="出厂序列号" width="120" align="center" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="brand" label="品牌" width="100" align="center" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="series" label="系列" width="100" align="center" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="deviceModel" label="型号" width="100" align="center" show-overflow-tooltip sortable></el-table-column>
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template  slot-scope="scope">
              <el-button type="text"  size="small" @click="handleSave(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getDictCmdbList,getCmdbList,getDictCmdbListPid} from "@/api/dict";
import {mapGetters} from "vuex";
import {roomGetDeviceList, roomSubmitDevice} from "@/api/device/resourecabinets";

export default {
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
    types: {
      type: String
    }
  },
  data() {
    return {
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
    


    this.initForm()

    //加载数据
    this.getList()
  },
  methods: {
    initForm(){
      this.searchForm.area = this.userDetail.regionCode||'37'
      this.searchForm.ownerUnitCode = this.userDetail.ownerUnit||''
      this.searchForm.deviceStatusCode = '1105089449492480' //设备状态 在运
      if(this.types=='cabinetList'){
        this.getDictCmdbListPid('1097745969774592', "1097757118234624") // 设备类型
      
        this.searchForm.isCabinetsMark = 1
      }else{
        this.searchForm.isCabinetsMark = 0
      }
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
          this.deviceStatusCodeList  = res.data;
        }else if(code==='1097745625841664'){
          let data = res.data
          if(this.types=='deviceList'){
            // this.deviceCategoryCodeList = data.filter(el=> el.dictValue=='主机设备' || el.dictValue=='存储设备' || el.dictValue=='网络设备' || el.dictValue=='安全设备' || el.dictValue=='辅助设备' || el.dictValue=='基础设施');
            this.deviceCategoryCodeList = data.filter(el=> el.dictValue=='基础设施' || el.dictValue=='辅助设备');
          }else{
            this.deviceCategoryCodeList = data.filter(el=> el.dictValue=='基础设施' || el.dictValue=='辅助设备');
          }
          
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
          let datas = res.data
          if(this.types=='deviceList'){
            datas = datas.filter(el=> el.dictKey != "1135308277350478") //排除机柜
          }
          this.deviceTypeCodeList = datas
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
      roomGetDeviceList(this.searchForm).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
    handleSubmit(){
      if (this.selectList.length == 0) {
        this.$message.warning("请选择一条数据!")
        return
      }

      let flag = this.deviceList.some(el=> {
        return this.selectList.some(el2=> el2.id == el.deviceId)
      })
      if( flag ){
        this.$message.warning('该设备已存在，请重新选择')
        return
      }
      
      this.$emit("setVal", this.selectList);
      this.isVisible = false
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
      this.initForm()
      this.getList()
    },

    beforeCloseHandler(){
      //点击关闭按钮
      this.$emit('close')
      this.isVisible = false
    },
  }
};
</script>
<style lang='scss' scoped>
.wrap {
  width: 100%;
}
::v-deep .el-select {
  width: 100% !important;
}
</style>
