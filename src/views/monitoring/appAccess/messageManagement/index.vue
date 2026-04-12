<template>
    <basic-container>
      <div class="page_form">
        <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="通知标题" prop="title">
                <el-input v-model="searchForm.title"  placeholder="请输入通知标题" clearable style="width:100%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="page_body">
        <el-row>
          <formTitle :titleText="'消息管理'" :titleType="'page_title'">
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
          :loading="loading"
        >
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="150" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{formatTime(scope.row.createTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="scope" label="通知范围" min-width="100" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span :class="{ 'scope-tag': true, 'scope-all': scope.row.scope === '全部', 'scope-line1': scope.row.scope === '1线端', 'scope-line2': scope.row.scope === '2线端', 'scope-148': scope.row.scope === '148终端' }">
                {{scope.row.scope}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="dateRange" label="生命周期" min-width="200" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.dateRange}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="通知标题" min-width="180" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="content" label="通知内容" min-width="180" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="状态" min-width="100" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag type="success" size="small">推送完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template  slot-scope="scope">
              <el-button type="text"
                         class="list_btn"
                        size="small"
                        @click="handleView(scope.row)">查看
              </el-button>
              <el-button type="text"
                         class="list_btn btn_red"
                        size="small"
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
      
      <!-- 消息弹窗 -->
      <message-dialog
        :visible="dialogVisible"
        :is-view="isViewMode"
        :id="currentId"
        @close="handleDialogClose"
      />
    </basic-container>
  </template>
  
  <script>
import {getMessageList, messageRemove} from "@/api/terminal";
import messageDialog from "./messageDialog.vue";
  import moment from "moment";
  export default {
    data() {
      return {
        // 搜索相关
        searchForm: {
          title: undefined,
          publisher: undefined,
          scope: undefined,
          current: 1,
          size: 20,
        },
        // 表格相关
        dataList: [],
        loading: false,
        tableHeight: undefined,
        total: 0,
        // 弹窗相关
        dialogVisible: false,
        isViewMode: false,
        currentId: ''
      };
    },
    components: {moment,messageDialog},
    mounted(){    
      // 设置页面元素高度
      this.setPageContentHeight()
      // 设置表格高度
      this.setTableHeight()
      //加载数据
      this.onLoad();
    },
    activated() {
      // 当组件被激活时（从其他页面跳转回来），重新加载数据
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
            return messageRemove({id: ids});
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
          title: undefined,
          publisher: undefined,
          scope: undefined,
          current: 1,
          size: 20,
        }
        this.onLoad();
      },
      onLoad() {
        //加载数据
        this.loading = true;
        getMessageList(this.searchForm).then(res => {
          const data = res.data;
          this.total = data.total;
          this.dataList = data.records.map(item => {
            return {
              ...item,
              createTime: item.createTime,
              publisher: item.publisher || 'admin',
              scope: item.scope || '全部',
              dateRange: item.startTime + '~' + item.endTime,
              title: item.title || '',
              deliveryCount: item.deliveryCount || 0,
              readCount: item.readCount || 0
            };
          });
          this.loading = false;
        });
      },
      handleView(row) {
        //查看详情
        this.isViewMode = true;
        this.currentId = row.id;
        this.dialogVisible = true;
      },
      handleAdd() {
        //新增 页面
        this.isViewMode = false;
        this.currentId = '';
        this.dialogVisible = true;
      },
      handleDialogClose(needRefresh) {
        this.dialogVisible = false;
        if (needRefresh) {
          this.onLoad();
        }
      },
      formatTime(time) {
        if (!time) return '';
        return moment(time).format('YYYY-MM-DD HH:mm:ss');
      }
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
  .scope-tag {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }
  .scope-all {
    background-color: #ecf5ff;
    color: #409eff;
  }
  .scope-line1 {
    background-color: #f0f9eb;
    color: #67c23a;
  }
  .scope-line2 {
    background-color: #f0f0f0;
    color: #909399;
  }
  .scope-148 {
    background-color: #fef0f0;
    color: #f56c6c;
  }
  </style>
