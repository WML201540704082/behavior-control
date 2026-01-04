<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="()=>{showForm = true; showType = '新增'}">规 则</el-button>
    </div>
    <div class="page_body">
      <el-table
        ref="arrtTable"
        :data="tableData"
        :height="tableHeight"
        border
        stripe
        size="small"
        v-loading="tableLoading"
      >
        <el-table-column type="index" align="center" label="序号"></el-table-column>
        <el-table-column label="名称" prop="name" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否激活" prop="isActive" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="scope.row.isActive === 1? 'text-success': 'text-grey'">
              {{ scope.row.isActive === 1? '是':'否' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="组件" prop="handlerName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="引用数" prop="invokeCount" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="描述" prop="description" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link type="primary" size="mini" :underline="false" icon="el-icon-edit" style="margin-right: 15px" @click="editItem(scope.row)">编 辑</el-link>
            <el-link type="danger" size="mini" :underline="false" icon="el-icon-delete" @click="delItem(scope.row)">删 除</el-link>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <!-- 规则新增弹窗 -->
    <validatorForm
      v-if="showForm"
      :isShow="showForm"
      :itemId="itemId"
      :showType="showType"
      @close="showForm = false"
      @saveValidator="saveValidator"
    ></validatorForm>
  </basic-container>
</template>

<script>
import validatorForm from './components/checkRulesManageComponent/validatorForm'
import { validatorSearch, validatorDel } from "@/api/system/checkRulesManage";

export default {
  components: {
    validatorForm
  },
  data() {
    return{
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗
      showForm: false,
      showType: '',
      itemId: '',
    }
  },
  mounted() {
    this.setPageContentHeight()
    this.setTableHeight()
    this.getList()
  },
  methods: {
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = bodyBox[0].offsetHeight + 'px'
    },
    getList() {
      this.tableLoading = true
      validatorSearch().then(res => {
        this.tableData = res.Return.tbodyList
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 删除
    delItem(row) {
      this.$confirm('确定删除该全局属性?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        validatorDel({id: row.id}).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getList()
        })
      })
    },
    // 编辑
    editItem(row) {
      this.showType = '修改'
      this.itemId = row.id
      this.showForm = true
    },
    saveValidator() {
      this.showForm = false
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
