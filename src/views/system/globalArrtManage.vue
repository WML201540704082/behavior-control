<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="()=>{showForm = true; showType = '新增'}">属 性</el-button>
    </div>
    <div class="page_body">
      <el-table
        ref="arrtTable"
        :data="tableData"
        :height="tableHeight"
        stripe
        size="small"
        v-loading="tableLoading"
      >
        <el-table-column type="index" align="center" label="序号"></el-table-column>
        <el-table-column label="唯一标识" prop="name" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="名称" prop="label" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否激活" prop="isActive" align="center" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="scope.row.isActive === 1? 'text-success': 'text-grey'">
              {{ scope.row.isActive === 1? '是':'否' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="是否多选" prop="isMultiple" align="center" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="scope.row.isMultiple === 1? 'text-success': 'text-grey'">
              {{ scope.row.isMultiple === 1? '是':'否' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="选项" prop="createTime" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag
              v-for="item in scope.row.itemList" 
              :key="item.id"
              type="info" 
              size="small"
            >{{ item.value }}</el-tag>
            <span v-if="scope.row.itemList.length === 0">--</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link type="primary" size="mini" :underline="false" icon="el-icon-edit" style="margin-right: 15px" @click="editArrt(scope.row)">编 辑</el-link>
            <el-link type="danger" size="mini" :underline="false" icon="el-icon-delete" @click="delArrt(scope.row)">删 除</el-link>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <!-- 属性新增弹窗 -->
    <arrtForm
      v-if="showForm"
      :isShow="showForm"
      :arrtId="arrtId"
      :showType="showType"
      @close="showForm = false"
      @saveGlobalArrt="saveGlobalArrt"
    ></arrtForm>
  </basic-container>
</template>

<script>
import arrtForm from './components/globalArrtManageComponent/arrtForm'
import { globalattrSearch, globalattrDel } from "@/api/system/globalArrtManage";

export default {
  components: {
    arrtForm
  },
  data() {
    return{
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗
      showForm: false,
      showType: '',
      arrtId: '',
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
      globalattrSearch().then(res => {
        this.tableData = res.Return.tbodyList
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 删除
    delArrt(row) {
      this.$confirm('确定删除该全局属性?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        globalattrDel({id: row.id}).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getList()
        })
      })
    },
    // 编辑
    editArrt(row) {
      this.showType = '修改'
      this.arrtId = row.id
      this.showForm = true
    },
    saveGlobalArrt() {
      this.showForm = false
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
