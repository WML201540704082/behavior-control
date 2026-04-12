<template>
  <div class="wrap">
    <el-input v-model="myValue" readonly :disabled="disabled" @click.native="handleClick" :placeholder="placeholder" suffix-icon="el-icon-search"></el-input>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="WBS列表"
      width="1000px"
      top="10vh"
      v-el-drag-dialog
    >
      <!-- <basic-container> -->
        <div class="page_form">
          <el-form
            ref="searchForm"
            :model="searchForm"
            label-suffix=":"
            label-width="120px"
            class="xt_search_form"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="WBS项目" prop="wbsName">
                  <el-input v-model="searchForm.wbsName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="WBS元素" prop="wbsCode">
                  <el-input v-model="searchForm.wbsCode"></el-input>
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
              <el-button type="primary" icon="el-icon-delete" @click="handleSEmpty" plain>清空</el-button>
            </div>
          </formTitle>
          <el-table
            ref="dataTable"
            stripe
            size="small"
            @selection-change="select"
            :data="tableData"
            :height="tableHeight"
            v-loading="tableLoading"
            row-key="id"
          >
            <el-table-column type="selection" width="30" fixed="left" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="projectDefine" label="项目名称" width="200" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="wbsCode" label="WBS元素" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="wbsName" label="WBS项目" align="center" show-overflow-tooltip></el-table-column>
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
      <!-- </basic-container> -->

    </el-dialog>
  </div>
</template>
<script>
import { projectmanagerList } from '@/api/assets/projectManage'

export default {
  props: {
    placeholder: {
      type: String
    },
    type: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    value: {
      type: [String, Number, Array],
      default: ""
    }
  },
  watch: {
    value(val) {
      this.myValue = val;
      this.$emit("input", val);
    }
  },
  data() {
    return {
      isShow: false,
      searchForm: {
        current: 1,
        size: 20
      },
      // 表格
      tableData: [
        {eprNum: 2023},
        {eprNum: 220},
      ],
      tableHeight: '550px',
      tableLoading: false,
      total: 0,
      selectList: [],
      list: [],
      myValue: this.value
    };
  },
  created() {
    this.getList()
  },
  methods: {
    select(val) {
      this.selectList = val;
    },
    handleClick(){
      if (this.disabled) {
        return
      }
      this.isShow = true
      this.getList()
    },
    getList() {
      this.tableLoading = true
      this.searchForm.projectUnitCode = this.$store.state.user.userDetail.erpUnitCode
      projectmanagerList(this.searchForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    handleSubmit(){
      if (this.selectList.length != 1) {
        this.$message.warning("请选择一条数据!")
        return
      }
      if( this.type == 'wbsElement' ){
        this.$emit('input', this.selectList[0].wbsCode)
      }else if( this.type == 'wbsProject' ){
        this.$emit('input', this.selectList[0].wbsName)
      }
      this.$emit("change", this.selectList[0], this.type);
      this.isShow = false
    },
    handleSEmpty(){
      this.$emit('input', undefined)
      this.$emit("change", {}, this.type);
      this.isShow = false
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
        size: 20
      }
      this.getList()
    },
    handleSave(row){
      //保存
      if( this.type == 'wbsElement' ){
        this.$emit('input', row.wbsCode)
      }else if( this.type == 'wbsProject' ){
        this.$emit('input', row.wbsName)
      }
      this.$emit("change", row, this.type);
      this.isShow = false
    }
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
