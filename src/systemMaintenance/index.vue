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
          
          <!-- 右侧应用导航 -->
          <el-col :span="19">
            <div class="device-management">
              <div class="device-header">
                <div class="page-title">
                  <h5>应用导航</h5>
                </div>
                <div class="header-buttons" v-if="currentOrgName">
                  <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
                  <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
                  <el-button size="small" type="primary" @click="showAddDialog">新增</el-button>
                </div>
              </div>
              
              <!-- 应用导航卡片 -->
              <div class="app-navigation">
                <div class="app-cards" v-if="currentOrgName">
                  <div v-for="app in appList" :key="app.id" class="app-card" @click="openApp(app.url)">
                    <div class="app-delete" @click.stop="handleDeleteApp(app.id)">
                      <i class="el-icon-close"></i>
                    </div>
                    <div class="app-icon">
                      <img :src="app.icon" :alt="app.name" />
                    </div>
                    <div class="app-name">{{ app.appName }}</div>
                  </div>
                </div>
                <div v-else class="no-data">
                  请选择组织架构查看应用导航
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <!-- 新增/编辑弹窗 -->
      <system-add
        ref="systemAdd"
        :visible.sync="addDialogVisible"
        :id="currentSystemId"
        @close="handleDialogClose"
      />
    </basic-container>
  </template>
  
  <script>
  import {getMaintenanceList,maintenanceRemove} from "@/api/terminal";
  import {getDeptLzayList} from "@/api/system/dept";
  import SystemAdd from './systemAdd.vue';
  export default {
    components: {
      SystemAdd
    },
    data() {
      return {
        // 组织架构树数据
        orgTreeData: [],
        treeProps: {
          label: 'deptName',
          children: 'children',
          isLeaf: 'leaf'
        },
        // 当前选中的组织
        currentOrgName: '',
        // 应用导航列表
        appList: [],
        // 弹窗相关
        addDialogVisible: false,
        currentSystemId: '',
        searchForm: {
          ip: undefined,
          status: undefined,
          current: 1,
          size: 20,
        },
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
    created() {
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
        // 只有二级目录才触发应用导航的加载
        if (data.parentId && data.parentId !== '0') {
          this.currentOrgName = data.deptName;
          // 带入deptId调接口加载应用导航
          this.searchForm.deptId = data.id;
          this.onLoad();
        }
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
          deptId: undefined,
          current: 1,
          size: 20,
        };
        this.currentOrgName = '';
        this.onLoad();
      },
      onLoad() {
        //加载数据
        this.loading = true;
        getMaintenanceList(this.searchForm).then(res => {
          const data = res.data;
          this.total = data.total;
          this.appList = data.records || [];
          this.loading = false;
        });
      },
      showAddDialog() {
        // 显示新增弹窗
        this.currentSystemId = '';
        // 带入当前选中的组织架构deptId
        if (this.searchForm.deptId) {
          this.$refs.systemAdd.form.deptId = this.searchForm.deptId;
        }
        this.addDialogVisible = true;
      },
      handleEdit(row) {
        // 显示编辑弹窗
        this.currentSystemId = row.id;
        this.addDialogVisible = true;
      },
      handleDialogClose() {
        // 弹窗关闭后重新加载数据
        this.addDialogVisible = false;
        this.currentSystemId = '';
        this.onLoad();
      },
      openApp(url) {
        // 新开页面跳转到app.url
        if (url) {
          // 确保URL包含协议头
          let fullUrl = url;
          if (!/^https?:\/\//i.test(url)) {
            fullUrl = 'http://' + url;
          }
          window.open(fullUrl, '_blank');
        }
      },
      handleDeleteApp(id) {
        // 点击叉号删除应用
        this.$confirm('确定要删除该应用吗？', '删除应用', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 调用删除接口
          maintenanceRemove(id).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            // 重新加载数据
            this.onLoad();
          });
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
      margin-top: -5px;
      
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
  
  .app-navigation {
    margin-top: 10px;
    
    .app-title {
      margin-bottom: 15px;
      
      h4 {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
        margin: 0;
      }
    }
    
    .app-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 20px;
    }
    
    .app-card {
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      padding: 15px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      
      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
        .app-delete {
          opacity: 1;
        }
      }
      
      .app-icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 10px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      
      .app-name {
        font-size: 14px;
        color: #303133;
        margin-top: 10px;
      }
      
      .app-delete {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #f56c6c;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        z-index: 10;
        font-size: 12px;
        font-weight: bold;
      }
    }
    .no-data {
      text-align: center;
      padding: 40px 0;
      color: #999;
      font-size: 14px;
    }
  }
</style>
  