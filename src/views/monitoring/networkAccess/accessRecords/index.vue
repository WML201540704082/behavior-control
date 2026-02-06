<template>
    <basic-container>
      <div class="page_form">
        <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="登录用户" prop="userName">
                <el-select v-model="searchForm.userName" filterable placeholder="请选择登录用户" clearable style="width:100%">
                  <el-option v-for="user in userList" :key="user.id" :label="user.name" :value="user.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="终端IP" prop="ip">
                <el-input v-model="searchForm.ip"  placeholder="请输入终端IP" clearable style="width:100%"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="业务系统名称" prop="businessName">
                <el-input v-model="searchForm.businessName"  placeholder="请输入业务系统名称" clearable style="width:100%"></el-input>
              </el-form-item>
            </el-col> -->
            <el-button style="border: 1px #ffffff solid;position: absolute;right: 10px;" v-model="isSlaveMode" @click="handleModeChange"></el-button>
          </el-row>
        </el-form>
      </div>
      <div class="page_body">
        <el-row>
          <formTitle :titleText="'查询网络访问记录列表'" :titleType="'page_title'">
            <div slot="rightBtnBox">
              <el-button type="primary" :loading="loading" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
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
          :loading="loading"
          empty-text="请先选择登录用户或填写终端IP进行搜索"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <!-- <el-table-column prop="name" label="登录用户" min-width="100" align="center" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="ip" label="访问终端IP" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="url" label="URL地址" min-width="150" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="businessName" label="业务系统名称" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="name" label="登录用户" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userDept" label="用户部门" min-width="100" align="center" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="startTime" label="访问开始时间" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="endTime" label="访问结束时间" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="accessLength" label="访问时长" min-width="90" align="center" show-overflow-tooltip>
            <template  slot-scope="scope">
              <span>{{formatSecondsToHMS(scope.row.accessLength)}}</span>
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
  import {getNetworkLogList, getNetworkLogSlaveList,getUserList} from "@/api/terminal";
  import moment from "moment";
  export default {
    data() {
      return {
        // 搜索相关
        searchForm: {
          ip: undefined,
          status: undefined,
          name: undefined,
          current: 1,
          size: 20,
        },
        // 表格相关
        dataList: [],
        loading: false,
        tableHeight: undefined,
        total: 0,
        // 模式切换
        isSlaveMode: true,
        // 用户列表
        userList: [],
      };
    },
    components: {moment},
    mounted(){
      // 设置页面元素高度
      this.setPageContentHeight()
      // 设置表格高度
      this.setTableHeight()
      // 加载用户列表
      this.loadUserList();
      // 初始化时不加载数据，点击查询才加载
    },
    methods: {
      // 设置表格高度
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 61 - 47 + 'px'
      },
      // 加载用户列表
      loadUserList() {
        getUserList({
          current: 1,
          size: 200
        }).then(res => {
          if (res.data) {
            // 根据 name 去重
            const uniqueUsers = [];
            const names = new Set();
            res.data.records.forEach(user => {
              if (!names.has(user.name)) {
                names.add(user.name);
                uniqueUsers.push(user);
              }
            });
            this.userList = uniqueUsers;
          }
        });
      },
      handleQuery() {
        // 校验登录用户或终端IP最少填写一个
        if (!this.searchForm.userName && !this.searchForm.ip) {
          this.$message.warning('请至少填写登录用户或终端IP中的一项');
          return;
        }
        this.searchForm.current = 1;
        
        // 如果userName有值，调用用户管理列表接口获取用户IP
        if (this.searchForm.userName) {
          this.loading = true;
          getUserList({
            current: 1,
            size: 100,
            name: this.searchForm.userName
          }).then(res => {
            if (res.data && res.data.records && res.data.records.length > 0) {
              // 获取当前用户的全部IP
              const userIps = [];
              res.data.records.forEach(user => {
                if (user.terminal) {
                  userIps.push(user.terminal);
                }
              });
              if (userIps.length > 0) {
                this.searchForm.ips = userIps;
              }
            }
            this.loading = false;
            this.onLoad();
          }).catch(() => {
            this.loading = false;
            this.onLoad();
          });
        } else {
          this.onLoad();
        }
      },
      searchReset() {
        //重置按钮
        this.searchForm = {
          ip: undefined,
          status: undefined,
          userName: undefined,
          current: 1,
          size: 20,
        }
        // 重置后不自动加载数据，清空表格
        this.dataList = [];
        this.total = 0;
      },
      handleModeChange() {
        this.isSlaveMode = !this.isSlaveMode
        // 模式切换时不自动加载数据
        this.searchForm.current = 1;
        this.onLoad()
      },
      onLoad() {
        //加载数据
        this.loading = true;
        const apiMethod = this.isSlaveMode ? getNetworkLogSlaveList : getNetworkLogList;
        apiMethod(this.searchForm).then(res => {
          const data = res.data;
          this.total = data.total;
          this.dataList = data.records.map(item=> {
            return {
              ...item,
              startTime: moment(item.startTime).format("YYYY-MM-DD HH:mm:ss"),
              endTime: item.endTime ? moment(item.endTime).format("YYYY-MM-DD HH:mm:ss") : moment(item.startTime).add(30,'seconds').format("YYYY-MM-DD HH:mm:ss"),
              accessLength: item.accessLength == -1 ? 30 : item.accessLength
            }
          });
          this.loading = false;
        });
      },
    }
  };
  </script>
  