<template>
  <div>
    <el-container>
      <el-header style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;">
        <div>
          <el-row style="padding-top:10px;padding-left: 20px">
            <el-button type="primary" icon="el-icon-upload" size="mini" @click="handleUpdate" :disabled="multipleSelection.length != 1" style="margin-left: 5px;">修改</el-button>
            <el-button type="primary" icon="el-icon-upload" size="mini" @click="handleDel" :disabled="!multipleSelection.length > 0" style="margin-left: 5px;">删除</el-button>
            <el-button type="primary" icon="el-icon-upload" size="mini" @click="handleClear" style="margin-left: 5px;">清空临时表</el-button>
            <el-button type="primary" icon="el-icon-upload" size="mini" @click="handleSelectImport" :disabled="selectImportDis" style="margin-left: 5px;">选择数据导入正式库</el-button>
            <el-button type="primary" icon="el-icon-upload" size="mini" @click="handleImport" style="margin-left: 5px;">正常数据导入正式库</el-button>
            <!-- <el-button type="primary" icon="el-icon-upload" size="mini" @click="handleRelease" style="margin-left: 5px;">正式库发布</el-button> -->
          </el-row>
        </div>
      </el-header>
      <el-main style="padding-left: 20px;padding-top: 0px">
        <div>
          <el-table
            ref="tabble"
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
              prop="id"
              label="序号"
              width="60" align="center">
            </el-table-column>
            <el-table-column
              prop="exceptionField"
              label="异常字段"
              
              show-overflow-tooltip
              width="200">
            </el-table-column>
            <el-table-column
              prop="exceptionReason"
              align="left"
              label="异常信息"
              
              show-overflow-tooltip
              width="200">
            </el-table-column>
            <el-table-column
              prop="content"
              align="left"
              label="隐患内容"
              
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="hiddenTypeName"
              align="left"
              label="隐患分类"
              
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="secondCompanyName"
              label="责任单位"
              
              show-overflow-tooltip>
            </el-table-column>
      
            <el-table-column
              prop="discoverBy"
              align="left"
              label="督察人员"
              
              show-overflow-tooltip>
            </el-table-column>
           
            <el-table-column
              prop="discoverDate"
              align="left"
              label="发现时间"
              
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="hiddenItems"
              align="left"
              label="隐患依据"
              
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
          <!-- <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.current"
            :limit.sync="queryParams.size"
            @pagination="getList"
          /> -->
        </div>
      </el-main>
    </el-container>



    <!-- 批量导入列表 -->
    <div v-if="importDetailVisible">
      <el-dialog :modal-append-to-body="false" title="详情" style="padding: 0px;"
                 :close-on-click-modal="false" :visible.sync="importDetailVisible"
                 :before-close="closeDialog"  width="100%">
        <importTDetail @closeRoom="closeDialog2" :detailForm="detailForm"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import importTDetail from "./importDetail";

import { updateHidden, addHidden, release } from "@/api/safeDanger/rectificationImport"
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
    importTable: {
      type: Array,
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
      importDetailVisible: false,

      tableList: [],
      total: 0,

      tableHeight: "51vh",
      // 查询参数
      queryParams: {
        current: 1,
        size: 20
      },
      ids: [],
      multipleSelection: []
    }
  },
  created() {
    
    this.getList();
  },
  mounted() {

  },
  methods: {
    formatRectificationStatus(row){
      if(row.rectificationStatus == 1){
        return '已整改'
      }
      if(row.rectificationStatus === 0){
        return '未整改'
      }
    },
    closeDialog(formData){
      this.importDetailVisible = false
    },
    closeDialog2(formData){
      this.importDetailVisible = false
      if(formData){
        this.tableList.splice( this.tableList.findIndex(ele=> ele.id == formData.id), 1, formData )
      }
    },
    tableRowClassName({row}){
      if(row.markRed == 1){
        return 'danger-row'
      }
    },
    getList() {
      this.tableList = JSON.parse(JSON.stringify(this.importTable))
      this.$nextTick(()=>{
        this.$refs['tabble'].doLayout()
      })
      
      // this.loading = true
      // rectificationList(this.queryParams).then(response =>{
      //   this.tableList = response.data.records
      //   this.total = response.data.total
      //   this.loading = false
      // })
    },
    handleSelectionChange(val) {
      this.ids = []
      this.multipleSelection = val;
      this.ids = val.map(item => item.flagId);
    },
    handleDblclick(){

    },

   
    handleUpdate(){
      this.detailForm = this.multipleSelection[0]

      // if(this.detailForm.markRed != 1){
      //   this.$message.warning("该数据无需修改！")
      //   return
      // }
      this.importDetailVisible = true
    },
    handleDel(){
      this.ids.forEach(el=>{
        this.tableList.splice( this.tableList.findIndex(ele=> ele.flagId == el), 1 )
      })
    },
    handleClear(){
      this.tableList = []
    },
    handleSelectImport(){
      addHidden(this.multipleSelection).then(response=>{
        if (response.code === 200) {
          this.$message.success(response.msg);

          this.multipleSelection.forEach(el=>{
            this.tableList.splice( this.tableList.findIndex(ele=> ele.id == el.id), 1 )
          })

          // this.$emit('closeRoom')
        } else {
          this.msgError(response.msg);
        }
      })
    },
    handleImport(){
      let datas = this.tableList.filter(el=> el.markRed != 1)
      if(datas.length > 0){
        addHidden(datas).then(response=>{
          if (response.code === 200) {
            this.$message.success(response.msg);
            if(datas.length == this.tableList.length){
              this.$emit('closeRoom')
            }else{
              datas.forEach(el=>{
                this.tableList.splice( this.tableList.findIndex(ele=> ele.id == el.id), 1 )
              })
            }
          } else {
            this.msgError(response.msg);
          }
        })
      }
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

  ::v-deep .el-dialog{
    margin: 0 !important;
  }
</style>
