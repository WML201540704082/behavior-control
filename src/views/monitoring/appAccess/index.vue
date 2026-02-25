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
          <el-col :span="6">
            <!-- <el-form-item label="应用名称" prop="appName">
              <el-input v-model="searchForm.appName"  placeholder="请输入业务系统名称" clearable style="width:100%"></el-input>
            </el-form-item> -->
            <el-form-item label="应用名称" prop="appName">
              <el-select v-model="searchForm.appName" filterable placeholder="请选择登录用户" clearable style="width:100%">
                <el-option v-for="user in appList" :key="user.label" :label="user.label" :value="user.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'查询应用访问记录列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" :loading="loading" size="small" icon="el-icon-search" @click="onLoad">查询</el-button>
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
      >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="ip" label="访问终端IP" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="appName" label="应用名称" min-width="100" align="center" show-overflow-tooltip>
            <template  slot-scope="scope">
              <span>{{filterStatus(scope.row.appName,appList)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="登录用户" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userDept" label="用户部门" min-width="100" align="center" show-overflow-tooltip></el-table-column>
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
import {getAppLogList,getUserList} from "@/api/terminal";
import moment from "moment";
export default {
  data() {
    return {
      // 搜索相关
      searchForm: {
        userName: undefined,
        ip: undefined,
        appName: undefined,
        current: 1,
        size: 20,
      },
      // 表格相关
      dataList: [],
      loading: false,
      tableHeight: undefined,
      total: 0,
      // 用户列表
      userList: [],
      // 应用列表
      appList: [{
        value: 'msedge.exe',
        label: 'Edge浏览器'
      },{
        value: 'EVCapture.exe',
        label: 'EV录屏'
      },{
        value: 'firefox.exe',
        label: '火狐浏览器'
      },{
        value: 'chrome.exe',
        label: '谷歌浏览器'
      },{
        value: 'NWIM.exe',
        label: '内网IM'
      },{
        value: '360net.exe',
        label: '统一浏览器'
      },{
        value: 'MongoDBCompass.exe',
        label: 'MongoDBCompass'
      },{
        value: 'Night.exe',
        label: 'Night'
      },{
        value: 'Postman.exe',
        label: 'Postman'
      },{
        value: 'SoftMgr.exe',
        label: '企业软件管家'
      },{
        value: 'naccli.exe',
        label: '认证客户端'
      },{
        value: 'et.exe',
        label: 'WPS表格'
      },{
        value: 'wpp.exe',
        label: 'WPS演示'
      },{
        value: 'wps.exe',
        label: 'WPS文字'
      },{
        value: 'wpspdf.exe',
        label: 'WPS PDF'
      },{
        value: '360Safe.exe',
        label: '信通一体化运维管理-漏洞修复'
      },{
        value: 'icallT_d.exe',
        label: '一点通'
      },{
        value: '智慧办公助手.exe',
        label: '智慧办公助手'
      }]
    };
  },
  components: {moment},
  mounted(){
    // 初始化加载数据
    this.onLoad()
    // 设置页面元素高度
    this.setPageContentHeight()
    // 设置表格高度
    this.setTableHeight()
    // 加载用户列表
    this.loadUserList();
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
    searchReset() {
      //重置按钮
      this.searchForm = {
        userName: undefined,
        ip: undefined,
        appName: undefined,
        current: 1,
        size: 20,
      }
      this.onLoad()
    },
    onLoad() {
      //加载数据
      this.loading = true;
      getAppLogList(this.searchForm).then(res => {
        const data = res.data;
        this.total = data.total;
        this.dataList = data.records.map(item=> {
          return {
            ...item,
            startTime: moment(item.startTime).format("YYYY-MM-DD HH:mm:ss"),
            endTime: moment(item.endTime).format("YYYY-MM-DD HH:mm:ss"),
          }
        });
        this.loading = false;
      });
    },
  }
};
</script>
