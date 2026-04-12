<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-card shadow="always" style="border: 1px solid #d9d6d6 !important;  width: 1080px; margin-bottom: 20px; ">
        <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
          <el-row>
            <el-col :span="6">
              <el-form-item label="设备名称" prop="name">
                <el-input placeholder="请输入名称" clearable v-model="searchForm.name" :maxlength="30" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备类型" prop="name">
                <el-cascader v-model="searchForm.type" :options="tree" style="width: 180px" :props="{ expandTrigger: 'hover', value: 'value', label: 'label', children: 'children' }" placeholder="请选择" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="IP" prop="IP">
                <el-input placeholder="请输入IP" clearable v-model="searchForm.ip" :maxlength="15" />
              </el-form-item>
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="primary" @click="handleQuery" style="margin-right: 5px;">查询</el-button>
              <el-button type="primary" plain @click="handleReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-button type="primary" style="margin-left: 0;" @click="getSyncedDeviceFunc">获取已同步设备列表</el-button>
    </div>
    <div class="page_body">
      <el-table :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading">
        <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
        <el-table-column label="名称" prop="name" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备类型" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.type1 }}/
            {{ scope.row.type2 }}
          </template>
        </el-table-column>
        <el-table-column label="IP" prop="ip" width="130" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="端口" prop="port" width="70" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="访问方式" prop="loginType" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="同步状态" prop="extAttr1" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="danger" v-if="!scope.row.extAttr1">未同步</el-tag>
            <el-tag type="success" v-else>已同步</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="同步时间" prop="syncTime" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.extAttr1 ? scope.row.syncTime : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80" fixed="right">
          <template slot-scope="scope">
            <el-link v-if="!!scope.row.extAttr1" type="primary" size="mini" :underline="false" @click="cancelSyncFunc(scope.row)">
              <span class="s_lt">取消同步</span>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" :pageSizes="[20,50,100,200]" @pagination="getList" />
    </div>
  </basic-container>
</template>

<script>
import { getBastionDevice, cancelSync } from '@/api/xcnanr/bastionDevice'
import { getSyncedDeviceApi } from '@/api/xcnanr/bastion'

import { getDictList } from '@/api/dict'

export default {
  props: {
    bastionDataId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      // 查询对象
      searchForm: {
        pageNo: 1,
        pageSize: 10,
        bastionId:"",
      },
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      serverDeviceType:[],
      networkDeviceType:[],
      tree: [{}],
      getSyncedTime: null
    }
  },
  created() {
    this.searchForm.bastionId = this.bastionDataId
    this.getList();
    this.getDictList('info_bastion_server_type')
    this.getDictList('info_bastion_network_type')
  },
  methods: {
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body');
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    /**
     * 获取字典
     */
    getDictList(code) {
      // 加载字典
      getDictList(code).then(res => {
        if (code === 'info_bastion_server_type') {
          this.serverDeviceType = res.data;
          this.updateTree();
        } else if (code === 'info_bastion_network_type') {
          this.networkDeviceType = res.data;
          this.updateTree();
        }
      });
    },
    /**
     * 所有下拉值
     */
    updateTree() {
      // 清空 tree 数组以避免重复添加
      this.tree = [];

      // 创建主机设备根节点
      if (this.serverDeviceType && this.serverDeviceType.length > 0) {
        const serverRootNode = {
          id: 1,
          value: 'server',
          label: '主机设备',
          children: []
        };
        this.serverDeviceType.forEach(item => {
          serverRootNode.children.push({
            id: item.dictKey,
            value: item.dictValue,
            label: item.dictValue
          });
        });
        this.tree.push(serverRootNode);
      }

      // 创建网络设备根节点
      if (this.networkDeviceType && this.networkDeviceType.length > 0) {
        const networkRootNode = {
          id: 2,
          value: 'network',
          label: '网络设备',
          children: []
        };
        this.networkDeviceType.forEach(item => {
          networkRootNode.children.push({
            id: item.dictKey,
            value: item.dictValue,
            label: item.dictValue
          });
        });
        this.tree.push(networkRootNode);
      }
    },

    /**
     * 获取表格数据
     */
    getList() {
      this.tableLoading = true;
      // 处理参数
      if(this.searchForm.type!==undefined&&this.searchForm.type.length>0){
        this.searchForm.type1 = this.searchForm.type[0]
        this.searchForm.type2 = this.searchForm.type[1]
      }
      console.log("参数", this.searchForm)
      getBastionDevice(this.searchForm).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.total;
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    /**
     * 查询触发事件
     */
    handleQuery() {
      this.getList()
    },
    /**
     * 重置触发事件
     */
    handleReset() {
      // 恢复默认查询对象
      this.searchForm = {
        pageNo: 1,
        pageSize: 10,
      }
      this.searchForm.bastionId = this.bastionDataId
      // 重新查询
      this.getList()
    },
    /**
     * 重置查询条件
     */
    cleanQuery() {
      this.searchForm = {
        pageNo: 1,
        pageSize: 10,
        bastionId:"",
      }
    },
    // 取消同步
    cancelSyncFunc(row) {
      cancelSync({ id: row.id }).then(() => {
        this.$message({
          type: 'success', message: '已将取消同步指令发送到堡垒机!'
        })
      })
    },
    // 获取已经同步的设备列表，2分钟内仅请求一次，避免造成后台拥挤
    getSyncedDeviceFunc() {
      if (!this.getSyncedTime || (new Date().getTime() - this.getSyncedTime > 120000)) {
        getSyncedDeviceApi(this.bastionDataId).then(res => {
          if (res.code === 200) {
            this.$message({ type: 'success', message: '获取已同步列表请求发送成功' })
            this.getSyncedTime = new Date().getTime()
          } else {
            this.$message({ type: 'error', message: '获取已同步列表请求发送成功' })
          }
        })
      } else {
        this.$message({ type: 'warning', message: '获取同步列表请求已发送，2分钟后可再次获取……' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-link {
  font-size: 13px;
}

.s_lt {
  font-size: 12px;
}
</style>
