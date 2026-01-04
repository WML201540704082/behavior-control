<template>
  <div>
    <el-container>
      <el-form ref="queryForm" :model="queryParams" label-width="90px">
        <el-row  style="padding: 0 20px">
          <el-col :span="8">
            <el-form-item label="责任单位:" prop="secondCompany2">
                <el-cascader
                  size="mini"
                  v-model="queryParams.secondCompany2"
                  :options="basicUnitSeconds"
                  :props="defaultProps"
                  @change="secondCompanyChange"
                  style="width: 100%"
                  placeholder=""
                  clearable>
                </el-cascader>
              
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任人:" prop="userId">
              <el-select v-model="queryParams.userId" filterable size="mini" placeholder="" :disabled="!queryParams.secondCompany2 || queryParams.secondCompany2.length == 0">
                <el-option
                  v-for="item in userList"
                  :value="item.userId"
                  :key="item.userId"
                  :label="item.nickName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="分类" prop="category">
              <el-select v-model="queryParams.category" placeholder="" clearable size="mini">
                <el-option
                  v-for="dict in supervisionList"
                  :key="dict.id"
                  :label="dict.category"
                  :value="dict.category"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="省:" prop="content">
              <el-input
                placeholder=""
                clearable
                size="mini"
                v-model="queryParams.content"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="一级单位:" prop="supervision">
              <el-input
                placeholder=""
                clearable
                size="mini"
                v-model="queryParams.supervision"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二级单位:" prop="supervisionPoint">
              <el-input
                placeholder=""
                clearable
                size="mini"
                v-model="queryParams.supervisionPoint"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任人:" prop="supervisionPoint">
              <el-input
                placeholder=""
                clearable
                size="mini"
                v-model="queryParams.supervisionPoint"
              >
              </el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <el-header style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;">
        <div>
          <el-row style="padding-top:10px;padding-left: 20px">
            <el-button type="primary" size="mini"  icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button type="primary" size="mini" icon="el-icon-refresh-left" @click="resetQuery" style="margin-left: 5px;">重置</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd" style="margin-left: 5px;">新增</el-button>  
            <el-button type="primary" icon="el-icon-upload" size="mini" :disabled="multipleSelection.length != 1" @click="handleUpdate" style="margin-left: 5px;">修改</el-button>
            <el-button type="primary" icon="el-icon-upload" size="mini" @click="handleDel" :disabled="multipleSelection.length != 1" style="margin-left: 5px;">删除</el-button>
          </el-row>
        </div>
      </el-header>
      <el-main style="padding-left: 20px;padding-top: 0px">
        <div>
          <el-table
            :data="tableList"
            :height="tableHeight"
            border
            :row-class-name="tableRowClassName"
            @row-dblclick="handleDblclick"
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%;height:100%;margin-top:5px;">
            <el-table-column
              type="selection"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="60" align="center">
            </el-table-column>
            <el-table-column
              prop="supervision"
              label="督察分类"
              
              show-overflow-tooltip
              width="200">
            </el-table-column>
            <!-- <el-table-column
              prop="content"
              align="left"
              label="内容"
              
              show-overflow-tooltip
              width="200">
            </el-table-column> -->
            <el-table-column
              prop="firstName"
              align="left"
              label="责任单位"
              
              show-overflow-tooltip>
            </el-table-column>
          
            <el-table-column
              prop="userName"
              align="left"
              label="责任人"
              
              show-overflow-tooltip>
            </el-table-column>
           
           
           
          
            <!-- <el-table-column
              prop="company"
              align="left"
              label="三级单位"
              sortable
              show-overflow-tooltip
              >
              <template slot-scope="scope">{{scope.row.thirdDeptLabel}}</template>
            </el-table-column> -->
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.current"
            :limit.sync="queryParams.size"
            @pagination="getList"
          />
        </div>
      </el-main>
    </el-container>



    <!-- 批量导入列表 -->
    <div v-if="importDetailVisible">
      <el-dialog :modal-append-to-body="false" title="详情" style="padding: 0px;"
                 :close-on-click-modal="false" :visible.sync="importDetailVisible"
                 :before-close="closeDialog"  width="600px">
        <importTDetail @closeRoom="closeDialog" :roomId="roomId" :detailId="detailId" :detailObj="detailObj"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import importTDetail from "./importDetail";

import { getAreaTree, selectShoutUser, machineroomuserList, machineroomuserRemove } from "@/api/safeDanger/networkSecure"
export default {
  name: "importTable",
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
    ]),

    editDis(){
      return this.multipleSelection.length != 1 || this.multipleSelection[0].markRed != 1
    },
    selectImportDis(){
      let isMarkRed = this.multipleSelection.some(el=> el.markRed == 1)
      return !this.multipleSelection.length > 0 || isMarkRed
    },
    addImportDis(){
      let isMarkRed = this.tableList.some(el=> el.markRed == 1)
      return !this.tableList.length > 0 || isMarkRed
    },
  },
  components: {importTDetail},
  props: {
    roomId: {
      type: Number,
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detailId: undefined,
      detailObj: {},
      importDetailVisible: false,

      tableList: [],
      total: 0,

      tableHeight:undefined,
      // 查询参数
      queryParams: {
        secondCompany2: undefined,
        userId: undefined,
        current: 1,
        size: 20
      },
      ids: [],
      multipleSelection: [],


      // 下拉列表
      basicUnitSeconds: [],
      userList: [],

      defaultProps: {
        value: 'code',
        label: 'shortName',
        leaf: 'leaf',
        children: 'children',
        // checkStrictly: true,
        // emitPath: false,
        expandTrigger: 'hover'
      },
    }
  },
  created() {
    this.initData()
    this.getList();
  },
  mounted() {

  },
  methods: {
    secondCompanyChange(val){
      this.queryParams.userId = ''
      if(val.length > 0){
        let code = val[2] || val[1]
        selectShoutUser({ regionCode: code }).then(res=>{
          this.userList = res.data
        })
      }
    },
    handleQuery(){
      this.queryParams.current = 1
      this.getList();
    },
    resetQuery(){
      // this.resetForm("queryForm")
      this.$refs.queryForm.resetFields();
      this.queryParams.secondCompany2 = []
      this.handleQuery()
    },
    handleAdd(){
      this.importDetailVisible = true
    },

    formatRectificationStatus(row){
      if(row.rectificationStatus == 1){
        return '已整改'
      }else{
        return '未整改'
      }
    },
    closeDialog(){
      this.detailId = ''
      this.importDetailVisible = false
      this.getList();
    },

    tableRowClassName({row}){
      if(row.markRed == 1){
        return 'danger-row'
      }
    },
    initData(){
      getAreaTree({code: '37'}).then(res=>{
        this.basicUnitSeconds = res.data
      })
    },
    getList() {
      // this.tableList = JSON.parse(JSON.stringify(this.importTable))
      
      this.queryParams.networkId = this.roomId
      this.loading = true
      if(this.queryParams.secondCompany2){
        this.queryParams.orgCode = this.queryParams.secondCompany2[0]
        this.queryParams.firstCompany = this.queryParams.secondCompany2[1]
        this.queryParams.secondCompany = this.queryParams.secondCompany2[2]
      }

      let params = JSON.parse(JSON.stringify(this.queryParams))
      delete params.secondCompany2
      machineroomuserList(params).then(response =>{
        this.tableList = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      this.ids = []
      this.multipleSelection = val;
      this.ids = val.map(item => item.id);
    },
    handleDblclick(){

    },

   
    handleUpdate(){
      this.detailId = this.multipleSelection[0].id
      this.detailObj = this.multipleSelection[0]

      // if(this.detailForm.markRed != 1){
      //   this.$message.warning("该数据无需修改！")
      //   return
      // }
      this.importDetailVisible = true
    },
    handleDel(){
      // this.ids.forEach(el=>{
      //   this.tableList.splice( this.tableList.findIndex(ele=> ele.id == el), 1 )
      // })

      machineroomuserRemove(this.multipleSelection[0]).then(res=>{
        this.$message.success(res.msg)
        this.getList()
      })
    },
  
   
   
  
    handleRelease(){

    },
  }
}
</script>

<style lang="scss" scoped>
  .el-cascader{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }
  .el-input{
    width: 100%;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }
  .el-col-24 {
    height: 50px;
  }



  ::v-deep .danger-row{
    background: red;
    color: #333;
  }
  ::v-deep .el-dialog__body{
    height: 50vh !important;
  }

  ::v-deep .el-form-item{
    margin-bottom: 0;
  }
</style>
