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
            row-key="id"
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
              width="60">
            </el-table-column>
            <!-- <el-table-column
              prop="category"
              label="督察分类"
              
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
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </el-main>
    </el-container>



    <!-- 批量导入列表 -->
    <div v-if="importDetailVisible">
      <el-dialog :modal-append-to-body="false" :title="dialogTitle" style="padding: 0px;"
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

import { selectShortNameTree, selectShoutUser, machineroomuserList, machineroomuserRemove, securityId } from "@/api/safeDanger/hiddenCategory"
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
      dialogTitle: undefined,
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
        pageNum: 1,
        pageSize: 20
      },
      ids: [],
      multipleSelection: [],


      // 下拉列表
      basicUnitSeconds: [],
      userList: [],

      defaultProps: {
        value: 'orgId',
        label: 'shortName',
        leaf: 'leaf',
        children: 'shortNameVOList',
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
        selectShoutUser({ orgCode: val[2] }).then(res=>{
          this.userList = res.data
        })
      }
    },
    handleQuery(){
      this.queryParams.pageNum = 1
      this.getList();
    },
    resetQuery(){
      this.resetForm("queryForm")
      this.queryParams.secondCompany2 = []
      this.handleQuery()
    },
    handleAdd(){
      this.dialogTitle = '新增'
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
      this.detailId = undefined
      this.importDetailVisible = false
      this.getList();
    },

    tableRowClassName({row}){
      if(row.markRed == 1){
        return 'danger-row'
      }
    },
    initData(){
      selectShortNameTree().then(res=>{
        this.basicUnitSeconds = res.data
      })
    },
    getList() {

      
      this.queryParams.categoryId = this.roomId
      this.loading = true
      if(this.queryParams.secondCompany2){
        this.queryParams.orgCode = this.queryParams.secondCompany2[0]
        this.queryParams.firstCompany = this.queryParams.secondCompany2[1]
        this.queryParams.secondCompany = this.queryParams.secondCompany2[2]
      }

      let params = JSON.parse(JSON.stringify(this.queryParams))
      delete params.secondCompany2
      machineroomuserList(params).then(response =>{
        this.tableList = response.rows
        this.total = response.total
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
      this.dialogTitle = '修改'
      this.detailId = this.multipleSelection[0].categoryId
      this.detailObj = this.multipleSelection[0]
      // console.log(999991111, this.detailId, this.detailObj)
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
