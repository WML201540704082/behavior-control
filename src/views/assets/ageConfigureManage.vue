<template>
  <div class="xt_page_box">
    <div class="page_form"></div>
    <div class="page_body xt-layout" ref="pageBody">
      <div class="xt-layout-sider" :class="showSider? 'xt-layout-has-sider':'xt-layout-none-sider'">
        <div
          class="layout-sider-btn"
          @click="showSider = !showSider"
        >
          <i v-if="showSider" class="el-icon-arrow-left"></i>
          <i v-else class="el-icon-arrow-right"></i>
        </div>
        <el-scrollbar style="height:100%">
          <el-tree
            ref="aaa"
            style="padding: 0 10px;"
            :data="treeData"
            :props="props"
            highlight-current
            node-key="dictKey"
            @node-click="handleNodeClick">
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="xt-layout-content" style="padding: 0px 20px 0px 20px">

        <!-- <div class="xt_card" style="padding-bottom: 0px"> -->
        <div class="table_detial">
          <div class="table_detial_l">
            设备分类：<span>{{ currentDeviceCategory }}</span>
          </div>
          <div class="table_btn">
            <!-- <el-button class="border-btn" @click="handleQuery">打印</el-button> -->
            <el-button type="primary" @click="handleExport">保存</el-button>
          </div>
        </div>
        <div class="table_box">
          <el-table
            ref="dataTable"
            stripe
            size="small"
            :data="tableData"
            :height="tableHeight"
            v-loading="tableLoading">
            <el-table-column prop="deviceTypeName" label="设备类型" align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="operationAge" label="投运年限" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select v-model="scope.row.operationAge" @change="operationAgeChange($event, scope.row)" size="small"
                           class="e_wd" placeholder="">
                  <el-option
                    v-for="item in operationAgeList"
                    :value="item.dictKey"
                    :key="item.dictKey"
                    :label="item.dictValue">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
          <!-- <xtTable
            ref="xtTable"
            :tableData="tableData"
            :colList="tableCol"
            :needAction="true"
            :tableLoading="tableLoading"
            :tableHeight="tableHeight"
            @rowDbClcik="dbClickDetail"
          >
            <template v-slot:action="scope">
              <el-button type="text" size="mini" @click="seeDetail(scope.scopeData.row)">查 看</el-button>
            </template>
          </xtTable> -->
          <!-- <pagination
          :total="total"
          :page.sync="searchForm.currentPage"
          :limit.sync="searchForm.pageSize"
          @pagination="getList"/> -->
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>

import {configList, batchSaveOrUpdate} from "@/api/assets/ageConfigureManage"
import {getDictList, getDictCmdbList} from "@/api/dict";

export default {
  data() {
    return {
      operationAgeList: [],
      currentDeviceCategory: '主机设备',

      showSider: true, //是否显示侧边栏
      treeData: [
        {
          name: '全职1'
        },
        {
          name: '全职2'
        },
        {
          name: '全职3'
        },
      ],
      props: { //树组件配置项
        label: 'dictValue',
        isLeaf: 'leaf'
      },
      defaultExpandedKeys: [],
      searchForm: {
        deviceCategory: 1097755012694017 // 主机设备
        // currentPage: 1,
        // pageSize: 20,

      },

      tableData: [],

      total: 0,
      tableLoading: false,
      tableHeight: undefined,
    }
  },
  mounted() {
    // 设置页面元素高度
    this.setPageContentHeight(undefined, undefined, true)

    this.$nextTick(() => {
      this.setTableHeight()
    })
    //加载字典--入库仓库
    this.getDictList("operationAge");
    this.getDictCmdbList('1097745625841664') // 设备分类
    this.getList()
  },
  methods: {
    handleNodeClick(data) {
      // console.log(9999910, data)
      this.currentDeviceCategory = data.dictValue
      this.searchForm.deviceCategory = data.dictKey
      this.getList()
    },
    setTableHeight() {
      this.tableHeight = this.$refs.pageBody.offsetHeight - 90 + 'px'
    },
    eidtSider() {
      this.showSider = !this.showSider
    },
    getDictList(code) {
      //加载字典
      return getDictList(code).then(res => {
        if (code === 'operationAge') {
          this.operationAgeList = res.data;
        }
      });
    },
    getDictCmdbList(ciId) {
      //加载字典
      return getDictCmdbList({ciId: ciId}).then(res => {
        if (ciId === '1102860579569664') { // 设备来源
          this.deviceSourceList = res.data;
        } else if (ciId === '1097745625841664') { // 设备分类
          this.treeData = res.data;

          setTimeout(() => {
            this.$refs.aaa.setCurrentKey(1097755012694017) //主机设备
          }, 500);
        } else if (ciId === '1097745969774592') { // 设备类型
          this.deviceTypeList = res.data;
        } else if (ciId === '1084068218601472') { // 电压等级
          this.voltageLevelList = res.data;
        }
      });
    },

    getList() {
      this.tableLoading = true
      configList(this.searchForm).then(res => {
        this.tableData = res.data
        // this.total = res.data.rowNum
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    search() {
      // this.searchForm.currentPage = 1
      this.getList()
    },

    handleExport() {
      batchSaveOrUpdate(this.tableData).then(res => {
        if (res.code == 200) {
          this.$message.success('操作成功！')
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.table_box {
  ::v-deep .el-input__inner {
    border: 1px solid #ddd;
  }
}

.xt-layout-sider {
  background-color: #cfe6f9;
  border-radius: 5px
}

::v-deep .el-tree {
  background: transparent;
  color: #46506d;
}

::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background: none
}

::v-deep .el-tree-node__content:hover {
  background: none
}

::v-deep .el-input__inner {
  border: none;
  // background: red;
  //border-radius: 999px;
}

.xt-layout-content {
  padding: 10px;
  background: #fff;
  border-radius: 5px;
}

.search_form {
  display: flex;
  padding: 15px 80px;
  // ::v-deep .el-button{
  //   padding: 12px 30px;
  //   height: 40px;
  //   font-size: 14px
  // }
}

.table_detial {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  margin-top: 15px;

  .table_detial_l {
    color: #999;

    span {
      color: #333;
      font-weight: bold;
    }
  }

  .table_info {
    display: flex;

    .info_item {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-right: 30px;

      &:last-child {
        margin-right: 0;
      }

      img {
        margin-right: 7px
      }

      span {
        display: inline-block;
        line-height: 40px;
        color: #46506d;
        cursor: pointer;
      }

      i {
        font-style: normal;
        color: #409EFF;
        font-weight: 900;
        margin-left: 5px;

      }

    }
  }
}

.e_wd {
  width: 50%;
}
</style>
