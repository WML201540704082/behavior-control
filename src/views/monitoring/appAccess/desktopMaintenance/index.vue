<template>
    <basic-container>
      <div class="page_form">
        <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="桌面应用名称" prop="appName">
                <el-input v-model="searchForm.appName"  placeholder="请输入桌面应用名称" clearable style="width:100%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="page_body">
        <el-row>
          <formTitle :titleText="'查询桌面应用维护列表'" :titleType="'page_title'">
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
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="appName" label="桌面应用名称" min-width="150" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mainFileName" label="主程序文件名" min-width="150" align="center" show-overflow-tooltip></el-table-column>
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
  import {getDesktopAppList, desktopAppRemove} from "@/api/terminal/desktopApp";
  import moment from "moment";
  export default {
    data() {
      return {
        // 搜索相关
        searchForm: {
          appName: undefined,
          current: 1,
          size: 20,
        },
        // 表格相关
        dataList: [],
        loading: false,
        tableHeight: undefined,
        total: 0,
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
            return desktopAppRemove(ids);
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
          appName: undefined,
          current: 1,
          size: 20,
        }
        this.onLoad();
      },
      onLoad() {
        //加载数据
        this.loading = true;
        getDesktopAppList(this.searchForm).then(res => {
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
            componentName: 'desktopAppAdd',
            routerTitle: '桌面应用维护编辑'
          }
        });
      },
      handleAdd() {
        //新增 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: 'desktopAppAdd',
            routerTitle: '桌面应用维护新增'
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
