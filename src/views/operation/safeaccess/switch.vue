<template>
  <basic-container>
    <div class="page_form">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="URL地址" prop="url">
              <el-input v-model="searchForm.url"  placeholder="请输入URL地址" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="业务系统名称" prop="businessName">
              <el-input v-model="searchForm.businessName"  placeholder="请输入业务系统名称" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'查询业务系统维护列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
            <el-button size="small" type="primary"  @click="handleAdd">新增</el-button>
          </div>
        </formTitle>
      </el-row>
      <el-table
        ref="dataTable"
        stripe
        size="small"
        :data="dataList"
        :height="tableHeight"
      >
        <el-table-column type="index" label="序号" min-width="50" align="center"></el-table-column>
        <el-table-column prop="url" label="URL地址" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="businessName" label="业务系统名称" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="domainName" label="域名" min-width="90" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template  slot-scope="scope">
            <el-button type="text"
                       class="list_btn"
                      size="small"
                      icon="el-icon-edit"
                      @click="handleEdit(scope.row,scope.index)">编辑
            </el-button>
            <el-button type="text"
                       class="list_btn btn_red"
                      size="small"
                      icon="el-icon-delete"
                      @click="handleDeleteOne(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="onLoad"
      />
    </div>

  </basic-container>
</template>

<script>
import {getMaintenanceList,maintenanceRemove} from "@/api/terminal";
import moment from "moment";
export default {
  data() {
    return {
      // 搜索相关
      searchForm: {
        ip: undefined,
        status: undefined,
        current: 1,
        size: 20,
      },
      // 表格相关
      dataList: [],
      loading: false,
      tableHeight: undefined,
      total: 0,
      deviceStatusList:[{
        label: '1',
        value: '在线'
      },{
        label: '0',
        value: '离线'
      }],
    };
  },
  components: {moment},
  mounted(){
    // 设置页面元素高度
    this.setPageContentHeight()
    // 设置表格高度
    this.setTableHeight()
    //加载数据
    this.onLoad();
  },
  methods: {
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 61 - 47 + 'px'
    },
    handleQuery() {
      this.searchForm.current = 1
      this.onLoad();
    },
    handleDeleteOne(id) {
      //删除按钮
      let ids = id;
      this.handleDeleteConfirm(ids);
    },
    handleDeleteConfirm(ids) {
      this.$confirm("点击确认将永久删除数据且无法恢复，请谨慎选择。", "确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return maintenanceRemove(ids);
        })
        .then(() => {
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    searchReset() {
      //重置按钮
      this.searchForm = {
        ip: undefined,
        status: undefined,
        current: 1,
        size: 20,
      }
      this.onLoad();
    },
    onLoad() {
      //加载数据
      this.loading = true;
      getMaintenanceList(this.searchForm).then(res => {
        const data = res.data;
        this.total = data.total;
        this.dataList = data.records
        this.loading = false;
      });
    },
    handleEdit(row) {
      //编辑 页面
      this.$router.push({
        path: '/detailRoute',
        query: {
          id: row.id,
          componentName: 'devScrappedAdd',
          routerTitle: '业务系统维护编辑'
        }
      });
    },
    handleAdd() {
      //新增 页面
      this.$router.push({
        path: '/detailRoute',
        query: {
          componentName: 'devScrappedAdd',
          routerTitle: '业务系统维护新增'
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.list_btn{
  padding: 9px 5px !important;
}
.btn_red{
  color: red;
}
</style>
