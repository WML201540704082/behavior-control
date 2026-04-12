<template>
    <basic-container>
      <div class="page_form">
        <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="终端IP" prop="ip">
                <el-input v-model="searchForm.ip"  placeholder="请输入终端IP" clearable style="width:100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="登录用户" prop="userName">
                <el-input v-model="searchForm.userName"  placeholder="请输入用户名" clearable style="width:100%"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="用户部门" prop="department">
                <el-input v-model="searchForm.department"  placeholder="请输入用户名" clearable style="width:100%"></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </div>
      <div class="page_body">
        <el-row>
          <formTitle :titleText="'查询终端运行状态列表'" :titleType="'page_title'">
            <div slot="rightBtnBox">
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
              <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
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
          <el-table-column prop="ip" label="终端IP" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userName" label="登录用户" min-width="100" align="center" show-overflow-tooltip>
            <!-- <template  slot-scope="scope">
              <span>{{scope.row.dept + '-' + scope.row.userName}}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="dept" label="用户部门" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="openTime" label="开机时间" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="showdownTime" label="关机时间" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="onlineLength" label="在线时长" min-width="90" align="center" show-overflow-tooltip>
            <template  slot-scope="scope">
              <span>{{formatSecondsToHMS(scope.row.onlineLength)}}</span>
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
  import {getTerminalMonitoringList} from "@/api/terminal";
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
        getTerminalMonitoringList(this.searchForm).then(res => {
          const data = res.data;
          this.total = data.total;
          this.dataList = data.records.map(item=> {
            return {
              ...item,
              openTime: moment(item.openTime).format("YYYY-MM-DD HH:mm:ss"),
              showdownTime: moment(item.showdownTime).format("YYYY-MM-DD HH:mm:ss"),
            }
          });
          this.loading = false;
        });
      },
    }
  };
  </script>
  