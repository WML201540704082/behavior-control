<!--部门管理新页面 使用中-->
<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="xt-layout page_body">
      <div class="xt-layout-content" style="height: 84vh; padding: 0px 0px 0px 20px">
        <el-form :model="queryParams" label-suffix=":" label-width="80px" size="small">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item label="部门名称" size="small">
                <el-input v-model="queryParams.deptName" placeholder="请输入上级名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="部门全称" clearable>
                <el-input v-model="queryParams.fullName" placeholder="请输入上级编码" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-button type="primary" plain size="small" @click="getList(null)">查 询</el-button>
              <el-button type="success" plain size="small" @click="handleAdd">新 增</el-button>
              <el-button type="danger" plain size="small" @click="handleDeleteSel">删 除</el-button>
              <el-button size="small" plain @click="getList">刷 新</el-button>
            </el-col>
          </el-row>
        </el-form>
        <!-- 设备列表 -->
        <el-table ref="table"
                  :data="items"
                  row-key="id"
                  lazy
                  :load="loadData"
                  :tree-props="{children:'children',hasChildren:'hasChildren'}"
                  border
                  size="small"
                  height="70vh"
                  v-loading="loading">
          <af-table-column type="selection" fixed="left" align="center"></af-table-column>
          <af-table-column label="部门名称" prop="deptName" width="300" show-overflow-tooltip align="left"></af-table-column>
          <af-table-column label="部门全称" prop="fullName" show-overflow-tooltip align="center"></af-table-column>
          <af-table-column label="排序" prop="sort" show-overflow-tooltip align="center"></af-table-column>
          <af-table-column label="是否为部门" prop="type" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <span>{{ getTypeName(scope.row.type) }}</span>
            </template>
          </af-table-column>
          <af-table-column label="ERP单位" prop="erpObj" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <span class="s_wrap">{{ getErpName(scope.row) }}</span>
            </template>
          </af-table-column>
          <af-table-column label="I6000单位" prop="i6000Obj" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <span class="s_wrap">{{ getI6000Name(scope.row) }}</span>
            </template>
          </af-table-column>
          <af-table-column label="所属区域" prop="regionName" show-overflow-tooltip align="center"></af-table-column>
          <af-table-column label="负责人" prop="teamUser" show-overflow-tooltip align="center"></af-table-column>
          <af-table-column label="负责人电话" prop="teamPhone" show-overflow-tooltip align="center"></af-table-column>

          <af-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <div class="vh_center">
                <div>
                  <div class="d_start">
                    <el-button type="text" size="small" icon="el-icon-view" @click="handleSee(scope.row)">查看</el-button>
                    <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)" style="color: #FCC422">编辑</el-button>
                  </div>
                  <div class="d_start">
                    <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)" style="color: #E53E31">删除</el-button>
                    <el-button type="text" size="small" icon="el-icon-plus" @click="handleAddChildren(scope.row)" style="color: #239443">新增子项</el-button>
                  </div>
                </div>
              </div>
            </template>
          </af-table-column>
        </el-table>
      </div>
    </div>

    <dept-manager :is-show="deptManagerParams.isShow"
                  v-if="deptManagerParams.isShow"
                  :type="deptManagerParams.type"
                  :form-detial="deptManagerParams.formDetial"
                  @close="componentClose"
                  @refreshData="refreshData"></dept-manager>
  </basic-container>
</template>

<script>

import {mapGetters} from "vuex";
import {getDeptLzayList, remove} from "@/api/system/dept";
import deptManager from "./components/deptManager/index.vue";

export default {
  components: {deptManager},
  data() {
    return {
      loading: false,
      queryParams: {},
      items: null,

      deptManagerParams: {
        isShow: false,
        type: null,
        formDetial: {}
      },

      selectId: null,
    }
  },
  watch: {},
  mounted() {
    this.getList();
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
  },
  methods: {
    loadData(tree, treeNode, resolve) {
      if (tree.type === 'DEPT') {
        //加载班组
        getDeptLzayList({type: 'TEAM', parentId: tree.id}).then(res => {
          this.initUnits(res.data);
          resolve(res.data)
        }).catch(err => {
          resolve([])
        })
      } else {
        //加载部门
        getDeptLzayList({parentId: tree.id}).then(res => {
          this.initUnits(res.data);
          resolve(res.data)
        }).catch(err => {
          resolve([])
        })
      }
    },
    getList(type) {
      this.getUnitItems(null);
    },
    getUnitItems(type) {
      this.loading = true;
      let params = {...this.queryParams};
      if (!type) {
        //如果type为null，默认为首次加载，此时只传入山东省id即可
        params['id'] = '1745022609004736513';
      } else {
        params = {type: type, ...this.queryParams};
      }
      getDeptLzayList(params).then(res => {
        this.loading = false
        this.initUnits(res.data);
        this.items = res.data;
      }).finally(() => {
        this.loading = false;
      })
    },
    initUnits(list) {
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.type === 'CORP' || item.type === 'DEPT') {
          if (item.children && item.children.length > 0) {
            this.initUnits(item.children)
          } else {
            item.hasChildren = true;
          }
        }
      }
    },
    refreshData() {
      //重新加载展开的节点
      //table
      if (this.selectId) {
        const {lazyTreeNodeMap, treeData} = this.$refs.table['store'].states;
        this.$set(lazyTreeNodeMap, this.selectId, [])
        this.loadData({id: this.selectId}, null, data => {
          this.$set(treeData[this.selectId], 'loading', false);
          this.$set(treeData[this.selectId], 'loaded', true);
          this.$set(treeData[this.selectId], 'expanded', true);
          if (data.length) {
            this.$set(lazyTreeNodeMap, this.selectId, data);
          } else {
            treeData[this.selectId].hasChildren = false;
          }

          this.selectId = null;
        })
      } else {
        this.items = [];
        this.getList();
      }
    },
    handleAdd() {
      this.deptManagerParams.type = 'add';
      this.deptManagerParams.isShow = true;
    },
    handleAddChildren(row) {
      this.deptManagerParams.type = 'addchildren';
      this.deptManagerParams.formDetial = row;
      this.deptManagerParams.isShow = true;

      this.selectId = row.id;
    },
    handleSee(row) {
      this.deptManagerParams.type = 'see';
      this.deptManagerParams.formDetial = row;
      this.deptManagerParams.isShow = true;
    },
    handleEdit(row) {
      this.deptManagerParams.type = 'edit';
      this.deptManagerParams.formDetial = row;
      this.deptManagerParams.isShow = true;

      this.selectId = row.id;
    },
    handleDelete(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return remove(row.id);
      }).then(() => {
        this.selectId = row.parentId;
        this.refreshData();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });

    },
    handleDeleteSel() {
      if (this.$refs.table.selection.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = this.$refs.table.selection.map((item, index) => {
          return item.id
        }).join(',');
        return remove(ids);
      }).then(() => {
        this.getList();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      });
    },
    componentClose() {
      this.deptManagerParams = {
        isShow: false,
        type: null,
        formDetial: {}
      };
    },

    showArrow(type) {
      if (type === 'CORP' || type === 'DEPT') {
        return true;
      }
      return false;
    },
    getTypeName(type) {
      if (type === 'CORP') {
        return '单位';
      } else if (type === 'DEPT') {
        return '部门';
      } else if (type === 'TEAM') {
        return '班组';
      }
      return '未知';
    },
    getErpName(row) {
      if (row) {
        if (row.type === 'CORP') { // 公司
          return row.erpUnit;
        } else { // 部门 DEPT  班组 TEAM
          return this.getEIObj(row, 'erpObj');
        }
      }
      return null;
    },
    getEIObj(row, type) {
      if (type === 'erpObj') {
        if (!this.isEmpty(row.erpUnit) && !this.isEmpty(row.erpDept)) {
          return row.erpUnit + '/' + row.erpDept
        } else if (!this.isEmpty(row.erpUnit)) {
          return row.erpUnit;
        } else if (!this.isEmpty(row.erpDept)) {
          return row.erpDept;
        }
      } else if (type === 'i6000Obj') {
        if (!this.isEmpty(row.i6000Unit) && !this.isEmpty(row.i6000Dept)) {
          return row.i6000Unit + '/' + row.i6000Dept
        } else if (!this.isEmpty(row.i6000Unit)) {
          return row.i6000Unit;
        } else if (!this.isEmpty(row.i6000Dept)) {
          return row.i6000Dept;
        }
      }
      return null;
    },
    getI6000Name(row) {
      if (row) {
        if (row.type === 'CORP') { // 公司
          return row.i6000Unit;
        } else { // 部门 DEPT  班组 TEAM
          return this.getEIObj(row, 'i6000Obj');
        }
      }
      return null;
    },
    isEmpty(value) {
      if (value == null || value === '') {
        return true;
      }
      return false;
    },
  }
}
</script>
<style lang="scss" scoped>
.s_wrap {
  white-space: normal;
}

.i_dpn {
  margin-right: 6px;
}

.d_start {
  display: flex;
  justify-content: flex-start;
}

.vh_center {
  display: flex;
  align-items: center;
  justify-content: center
}

</style>
