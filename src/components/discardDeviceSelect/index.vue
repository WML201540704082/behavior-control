<template>
  <div class="wrap">
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="beforeCloseHandler"
      :visible.sync="isShow"
      append-to-body
      title="选择设备"
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
              <el-form-item label="所属单位" prop="ownerUnitName">
                <xt-tree-lzay-select :formValue="searchForm.ownerUnitName"
                                     :selectType="'CORP'"
                                     @getTreeItem="getuseApplyUnit">
                </xt-tree-lzay-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="所属部门" prop="createDept">
                <xt-tree-lzay-select :formValue="createDept"
                                     :selectType="'DEPT'"
                                     :unit-id="searchForm.ownerUnit"
                                     @getTreeItem="getuseApplyDept">

                </xt-tree-lzay-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="投运起止时间">
                <el-date-picker
                  v-model="createTimes"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  @change="dataPickerChange"
                  placeholder="请选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row :gutter="6">
            <el-col :span="8">
              <el-form-item label="ERP资产编码" prop="assetCodeErp">
                <el-input v-model="searchForm.assetCodeErp"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备来源" prop="deviceSource">
                <el-select v-model="searchForm.deviceSourceCode" clearable disabled>
                  <el-option v-for="(item,index) in deviceSourceList"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
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
          </el-row>
        </el-form>
      </div>
      <div class="page_body">
        <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="searchReset" plain>重置</el-button>
            <!-- <el-button type="primary" icon="el-icon-plus" @click="handleSubmit">提交</el-button> -->
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
          <el-table-column prop="assetCodeErp" label="ERP资产编码" width="150" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sn" label="出厂序列号" width="100" align="center" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="deviceCategory" label="设备分类" width="100" align="center" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="deviceType" label="设备类型" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceName" label="设备名称" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="user" label="使用人" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ownUnit" label="使用单位" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="propertyDept" label="所属部门" width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="MAC" label="MAC地址" width="150" align="center" show-overflow-tooltip></el-table-column>

        </el-table>

        <div class="form-btn">
          <el-button type="primary" size="small" @click="handleSaveOK">确定</el-button>
          <el-button class="border-btn" size="small" @click="handleReset" style="margin-left: 50px;">取消</el-button>
        </div>

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
import {getDictCmdbList, getCmdbList,getDictCmdbListPid} from "@/api/dict";
import {mapGetters} from "vuex";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";

export default {
  components: {xtTreeLzaySelect},
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
      default: undefined
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
    deviceList1: [],
    createTimes: null,
    useKeepDept: {
      type: String,
    },
    isSpecial: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: true,
      createDept: null,
      searchForm: {
        current: 1,
        size: 20,
        deviceSourceCode: this.$store.state.common.govern.sourceTyng,
        deviceTypeCode:undefined,
        deviceCategoryCode:undefined
      },
      // 表格
      tableData: [
        {eprNum: 2023},
        {eprNum: 220},
      ],
      tableHeight: '550px',
      loading: false,
      total: 0,
      selectList: [],
      list: [],
      myValue: this.value,
      deviceCategoryList: [],
      deviceTypeList: [],
      deviceTypeListAll: [],
      deviceStatusList: [],
      receiveUnitList: [],
      deviceTypeCodeList: [],
      deviceCategoryCodeList: [],


    };
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"]),
    isVisible: {
      get() {
        return this.isVisible
      },
      set(val) {
        this.$emit("update:isShow", val)
      }
    },
    deviceSourceList() {
      return [{
        name: '统一纳管',
        id: this.$store.state.common.govern.sourceTyng
      }]
    }
  },
  created() {
    //加载数据
    this.getList()
    this.getDictCmdbListPid('1097745969774592', this.deviceCategory) // 设备类型
    //加载字典--设备分类
    this.getCmdbDictList("1097745625841664");
  },
  methods: {
    deviceCategoryCodeChange(code){
      //设备分类选择
      this.searchForm.deviceType = undefined
      this.searchForm.deviceTypeCode = undefined
      // this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));
      this.getDictCmdbListPid('1097745969774592', code) // 设备类型
    },
    getDictCmdbListPid(ciId, pid){
      getDictCmdbListPid({ ciId: ciId, pid: pid }).then(res => {
        if(ciId==='1097745969774592'){ // 设备类型
          this.deviceTypeCodeList = res.data
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
        }else if(code==='1102860579569664'){ // 设备来源
          this.deviceSourceList  = res.data;
        }
      });
    },
    handleSaveOK() {
      if (this.selectList.length == 0) {
        this.$message.warning("请选择一条数据!")
        return
      }
      this.$emit("setVal", this.selectList);
      this.isVisible = false
    },
    handleReset() {
      this.isVisible = false
    },
    // 申请单位
    getuseApplyUnit(val) {
      this.searchForm.ownerUnit = val.id
      this.searchForm.ownerUnitName = val.fullName

      this.searchForm.createDept = null;
      this.createDept = null;
      this.$forceUpdate()
    },
    // 申请部门
    getuseApplyDept(val) {
      this.searchForm.createDept = val.id
      this.createDept = val.fullName
      this.$forceUpdate()
    },
    select(val) {
      this.selectList = val;
    },
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 50 - 47 + 'px'
    },

    getList() {
      this.tableLoading = true
      this.searchForm.area = this.userDetail.regionCode;
      this.searchForm.deviceStatusCode = this.$store.state.common.govern.deviceState3;
      this.searchForm.useKeepDept = this.useKeepDept;
      this.searchForm.isSpecial = this.isSpecial;
      getCmdbList(this.searchForm).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSubmit() {
      if (this.selectList.length == 0) {
        this.$message.warning("请选择一条数据!")
        return
      }

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
      this.searchForm.ownerUnitName = undefined;
      this.searchForm.ownerUnit = undefined;
      this.searchForm.createTimes = undefined;
      this.searchForm.assetCodeErp = undefined;
      this.searchForm.deviceSourceCode = undefined;
      this.searchForm.current = 1;
      this.searchForm.deviceTypeCode = undefined;
      this.searchForm.deviceCategoryCode = undefined;
      this.getList()
    },
    handleSave(row) {
      //保存
      this.list.push(row)
      this.$emit("setVal", list);
      this.isVisible = false
    },
    beforeCloseHandler() {
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
