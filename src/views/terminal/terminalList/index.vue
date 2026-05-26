<template>
    <basic-container>
      <div class="page_body">
        <el-row :gutter="20">
          <!-- 左侧组织架构树 -->
          <el-col :span="5">
            <div class="org-tree-container">
              <h3 class="tree-title">组织架构</h3>
              <el-tree
                ref="orgTree"
                :data="orgTreeData"
                :props="treeProps"
                node-key="id"
                default-expand-all
                @node-click="handleNodeClick"
                :load="loadNode"
                lazy
              >
                <template slot-scope="{ node, data }">
                  <span class="custom-tree-node">
                    <span>{{ node.label }}</span>
                  </span>
                </template>
              </el-tree>
            </div>
          </el-col>
          
          <!-- 右侧设备管理 -->
          <el-col :span="19">
            <div class="device-management">
              <div class="device-header">
                <h3 class="page-title">终端列表</h3>
                <div class="header-buttons">
                  <el-form :model="searchForm" ref="searchForm" label-width="80px" class="xt_search_form">
                    <el-form-item label="IP地址" prop="ip">
                      <el-input v-model="searchForm.ip" placeholder="请输入IP地址" clearable style="width:130px"></el-input>
                    </el-form-item>
                  </el-form>
                  <el-form style="display: flex;align-items: center;">
                    <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
                    <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
                    <el-button v-if="searchForm.fullName == '山东鲁软数字科技有限公司'" size="small" type="primary" @click="showAddDialog">新增</el-button>
                  </el-form>
                </div>
              </div>
              
              <el-table
                ref="dataTable"
                stripe
                size="small"
                :data="dataList"
                :height="tableHeight"
              >
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="ip" label="IP地址" min-width="150" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="fullName" label="所属组织" min-width="150" align="center" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="操作" width="100" align="center" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text"
                               class="list_btn"
                              size="small"
                              icon="el-icon-edit"
                              @click="handleEdit(scope.row,scope.index)">编辑
                    </el-button>
                  </template>
                </el-table-column> -->
              </el-table>
              
              <pagination
                :total="total"
                :page.sync="searchForm.current"
                :limit.sync="searchForm.size"
                @pagination="onLoad"
              />
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 新增/编辑弹窗 -->
      <terminal-add
        :visible.sync="addDialogVisible"
        :id="currentTerminalId"
        @close="handleDialogClose"
      />
    </basic-container>
  </template>
  
  <script>
  import {getTerminalList,terminalRemove} from "@/api/terminal";
  import {informationList} from "@/api/assets/itaiDevice";
  import {getDeptLzayList} from "@/api/system/dept";
  import TerminalAdd from './terminalAdd.vue';
  export default {
    components: {
      TerminalAdd
    },
    data() {
      return {
        // 组织架构树数据
        orgTreeData: [],
        treeProps: {
          label: 'fullName',
          children: 'children',
          isLeaf: 'leaf'
        },
        // 搜索相关
        searchForm: {
          ip: undefined,
          current: 1,
          size: 20,
          deptId: '',
          fullName: ''
        },
        // 表格相关
        dataList: [],
        loading: false,
        tableHeight: undefined,
        total: 0,
        deviceStatusList:[{
          label: 1,
          value: '在线'
        },{
          label: 0,
          value: '离线'
        }],
        // 弹窗相关
        addDialogVisible: false,
        currentTerminalId: '',
      };
    },
    mounted(){
      // 设置页面元素高度
      this.setPageContentHeight()
      // 设置表格高度
      this.setTableHeight()
      // 初始化加载组织架构树
      this.loadNode({ level: 0 }, (data) => {
        this.orgTreeData = data;
      });
    },
    created(){
      //加载数据
      this.onLoad();
    },
    methods: {
      // 设置表格高度
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 61 - 47 + 'px'
      },
      // 加载组织架构树节点
      loadNode(node, resolve) {
        let params = {};
        if (node.level === 0) {
          // 首次加载，使用山东省的ID
          params['id'] = '1745022609004736513';
        } else if (node.level === 2) {
          // 加载二级节点时，不返回任何子节点，只显示到二级目录
          resolve([]);
          return;
        } else {
          // 加载子节点
          params['parentId'] = node.data.id;
        }
        
        getDeptLzayList(params).then(res => {
          // 只显示到二级目录，将一级节点的子节点（二级节点）标记为叶子节点
          if (node.level === 0) {
            res.data.forEach(item => {
              item.leaf = true;
            });
          }
          resolve(res.data || []);
        });
      },
      
      // 点击组织架构节点
      handleNodeClick(data) {
        this.searchForm.fullName = data.fullName
        this.searchForm.deptId = data.id;
        this.searchForm.current = 1;
        this.onLoad();
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
            return terminalRemove(ids);
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
          current: 1,
          size: 20,
          deptId: this.searchForm.deptId
        }
        this.onLoad();
      },
      onLoad() {
        //加载数据
        this.loading = true;
        // getTerminalList({
        //   ...this.searchForm,
        //   deptId: this.searchForm.deptId == '1745022609004736513' ? '' : this.searchForm.deptId
        // }).then(res => {
        //   const data = res.data;
        //   this.total = data.total;
        //   this.dataList = data.records;
        //   this.loading = false;
        // });
        informationList(
          {
            deviceStatusCode:"",
            receiveUnit: this.searchForm.fullName,
            receiveUnitCode: this.searchForm.deptId,
          }, this.searchForm.current, this.searchForm.size
        ).then(res => {
          this.total = res.data.total;
          this.dataList = (res.data.data || []).map(item => ({
            ip: item.IP,
            fullName: item.receiveUnit
          }));
          this.loading = false;
        });
      },
      // handleView(row) {
      //   //详情 页面
      //   this.$router.push({
      //     path: '/detailRoute',
      //     query: {
      //       id: row.id,
      //       componentName: 'devRecordDetail',
      //       routerTitle: '设备建档详情'
      //     }
      //   });
      // },
      showAddDialog() {
        // 显示新增弹窗
        this.currentTerminalId = '';
        this.addDialogVisible = true;
      },
      handleEdit(row) {
        // 显示编辑弹窗
        this.currentTerminalId = row.id;
        this.addDialogVisible = true;
      },
      handleDialogClose() {
        // 弹窗关闭后重新加载数据
        this.addDialogVisible = false;
        this.currentTerminalId = '';
        this.onLoad();
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
  
  .page_body {
    padding: 20px;
  }
  
  .org-tree-container {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    height: calc(100vh - 120px);
    overflow-y: auto;
    padding: 10px;
    
    .tree-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #303133;
    }
    
    .custom-tree-node {
      padding: 5px 0;
      font-size: 12px;
    }
  }
  
  .device-management {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 20px;
    min-height: calc(100vh - 120px);
    
    .device-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      .page-title {
        font-size: 18px;
        font-weight: bold;
        color: #303133;
        margin: 0;
      }
      
      .header-buttons {
        display: flex;
        gap: 10px;
      }
    }
  }
  </style>
  