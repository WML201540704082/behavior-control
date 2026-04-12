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
      top="10vh"
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
              <el-form-item label="责任人" prop="receivingPerson">
                <el-input v-model="searchForm.receivingPerson" :disabled="receiveDutyPersonNameDis"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="IP地址" prop="IP">
                <el-input v-model="searchForm.IP"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="MAC地址" prop="MAC">
                <el-input v-model="searchForm.MAC"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备编码" prop="deviceCode">
                <el-input v-model="searchForm.deviceCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用人" prop="user">
                <el-input v-model="searchForm.user"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备状态" prop="deviceStatusCode" >
                <el-select v-model="searchForm.deviceStatusCode" :disabled="deviceStatusCodeDis" clearable placeholder="请选择设备状态">
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

          <el-table-column prop="deviceCode" label="设备编码" width="180" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="user" label="使用人" width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="IP" label="IP地址" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="MAC" label="MAC地址" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="brand" label="品牌" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceType" label="设备类型" width="110" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceSource" label="设备来源" width="100" align="center" show-overflow-tooltip></el-table-column>
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

export default {
  props: {
    placeholder: {
      type: String
    },
    warehouse: {
      type: String,
      default: ""
    },
    warehouseName: {
      type: String,
      default: ""
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
    value: {
      type: [String, Number, Array],
      default: ""
    },
    bindId: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    deviceList: {
      type: Array,
      default: []
    },
    deviceList1: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      deviceStatusCodeDis: false,
      receiveDutyPersonNameDis: true,
      isShow:true,
      searchForm: {
        current: 1,
        size: 20,
        // deviceStatusCode: '退运在库',
        deviceStatusCode: undefined,
        deviceCategoryCode: this.deviceCategory,
        deviceTypeCode: this.deviceType,
        receivingPerson: undefined,
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
      list: [],
      myValue: this.value,
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
    this.receiveDutyPersonNameDis = this.userDetail.userRoleFlag === 0 ? false : true

    // 已报废 1105092729438209
    // 退运在库 1105092544888833
    // 待报废 1105089734705152
    // 在运 1105089449492480
    // 库存备用 1104999917879296
    //加载字典--设备类型
    //this.getDictList("deviceType");
    // this.getCmdbDictList("1097745969774592");
    this.getDictCmdbListPid('1097745969774592', this.deviceCategory) // 设备类型
    //加载字典--设备分类
    //this.getDictList("deviceCategory");
    this.getCmdbDictList("1097745625841664");
    //加载字典--设备状态
    this.getCmdbDictList("1103423111233536");
    if(this.type==='operation'){
      //退运 仅查询  退运在库 库存备用
      this.searchForm.deviceStatusCode = '1105092544888833' //退运在库
    }else if(this.type==='change'){
      //变更 仅查询  在运
      this.searchForm.deviceStatusCode = '1105089449492480' //在运
      this.searchForm.receivingPerson = this.userDetail.realName //责任人
      this.deviceStatusCodeDis = true
    }else if(this.type==='outbound'){
      //退运 仅查询  退运在库 库存备用
      this.searchForm.deviceStatusCode = '1104999917879296' //库存备用
    }
    this.searchForm.area = this.userDetail.regionCode||'37'
    this.searchForm.dept = this.userDetail.ownerUnit||''
    this.searchForm.inWarehouseCode = this.warehouse||''
    //加载数据
    this.getList()
  },
  methods: {
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
        if(code==='1103423111233536'){
          // 设备状态
          this.deviceStatusCodeList  = res.data;
          if(this.type==='operation'){
            //退运 仅查询  退运在库 库存备用
            this.deviceStatusCodeList = this.deviceStatusCodeList.filter(el => (el.dictValue == '退运在库' || el.dictValue == '库存备用'))
          }
          if(this.type==='outbound'){
            //出库 仅查询  退运在库 库存备用
            this.deviceStatusCodeList = this.deviceStatusCodeList.filter(el => (el.dictValue == '退运在库' || el.dictValue == '库存备用'))
          }
          if(this.type==='change'){
            //退运 仅查询  在运
            this.deviceStatusCodeList = this.deviceStatusCodeList.filter(el => (el.dictValue == '在运'))
          }
        }else if(code==='1097745625841664'){
          this.deviceCategoryCodeList  = res.data;
        }else if(code==='1097745969774592'){
          this.deviceTypeCodeList  = res.data;
        }
      });
    },
    getDictCmdbListPid(ciId, pid){
      getDictCmdbListPid({ ciId: ciId, pid: pid }).then(res => {
        if(ciId==='1097745969774592'){ // 设备类型
          this.deviceTypeCodeList = res.data
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
    getList() {
      this.tableLoading = true
      getCmdbList(this.searchForm).then(res => {
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
      // console.log("111",this.selectList)
      // console.log("222",this.deviceList1)
      // for (const obj1 of this.selectList){
      //   for (const obj2 of this.deviceList1){
      //     if (obj1.id==obj2.id){
      //       this.$message.warning("设备已存在，请重新选择!")
      //       return;
      //     }
      //   }
      // }
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
        dept: this.userDetail.ownerUnit||'',
        deviceStatusCode: undefined,
        deviceCategoryCode: this.deviceCategory,
        deviceTypeCode: this.deviceType,
      }

      if(this.type==='operation'){
        //退运 仅查询  退运在库 库存备用
        this.searchForm.deviceStatusCode = '1105092544888833' //退运在库
      }else if(this.type==='change'){
        //变更 仅查询  在运
        this.searchForm.deviceStatusCode = '1105089449492480' //在运
        this.searchForm.receivingPerson = this.userDetail.realName //责任人
      }else if(this.type==='outbound'){
        //退运 仅查询  退运在库 库存备用
        this.searchForm.deviceStatusCode = '1104999917879296' //库存备用
      }

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
