<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      :append-to-body="false"
      :visible.sync="isShow"
      :title="'['+ ciLabel +'] 属性映射'"
      width="1200px"
      v-el-drag-dialog
    >
      <el-form
        :model="searchForm"
        ref="searchForm"
        label-suffix=":"
        label-width="100px"
        size="small"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="模型ID" prop="ciId">
              <el-input v-model="searchForm.ciId" disabled="false"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="属性英文名" prop="attrName">
              <el-input v-model="searchForm.attrName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="属性中文名" prop="attrLabel">
              <el-input v-model="searchForm.attrLabel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="search_btn">
          <el-button type="primary" size="small" @click="search">查 询</el-button>
          <el-button size="small" @click="restForm">重 置</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="refresh">刷 新</el-button>
        </div>
      </el-form>

      <div class="table_box">
        <el-table
          ref="table"
          :data="tableList"
          stripe
          border
          size="small"
          :height="tableHeight"
          v-loading="tableLoading"
        >
          <el-table-column width="50" type="index" :index="Nindex" label="序号" align="center"></el-table-column>
          <el-table-column label="模型-属性" align="center" prop="attrCiId" show-overflow-tooltip></el-table-column>
          <el-table-column label="属性ID" align="center" prop="attrId" show-overflow-tooltip></el-table-column>
          <el-table-column label="属性英文名" align="center" prop="attrName" show-overflow-tooltip></el-table-column>
          <el-table-column label="属性中文名" align="center" prop="attrLabel" show-overflow-tooltip></el-table-column>
          <el-table-column label="属性类型编码" align="center" prop="attrType" show-overflow-tooltip></el-table-column>
          <el-table-column label="属性类型" align="center" prop="attrTypeText" show-overflow-tooltip></el-table-column>
        </el-table>
        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getTableList"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getList, refreshCiAttr} from '@/api/device/cmdbciattr'

  export default {
    props: ["isShow", "ciId", "ciName", "ciLabel"],
    data() {
      return {
        searchForm: {
          size: 20,
          current: 1
        },
        tableList: [],
        tableHeight: "500px",
        tableLoading: false,
        total: 0,
      }
    },
    mounted() {
      this.searchForm.ciId = this.ciId
      this.getTableList()
    },
    methods: {
      getTableList() {
        this.tableLoading = true
        getList(this.searchForm).then(res => {
          this.tableList = res.data.records
          this.total = res.data.total
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      search() {
        this.searchForm.current = 1
        this.getTableList()
      },
      restForm() {
        this.searchForm = {
          size: 20,
          current: 1,
          ciId: this.ciId
        }
        this.getTableList()
      },
      refresh() {
        this.tableLoading = true
        refreshCiAttr({
          ciId: this.ciId,
          ciName: this.ciName
        }).then(res => {
          this.$message({
            type: "success",
            message: res.data
          });
          this.search()
        })
      },
      Nindex(index) {
        return index + 1 + (this.searchForm.current - 1) * this.searchForm.size;
      },
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-col-8 {
    height: 40px;
  }

  .search_btn {
    margin-bottom: 15px
  }
</style>
