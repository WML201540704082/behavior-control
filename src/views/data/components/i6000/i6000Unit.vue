<template>
  <div class="xt-layout page_body">
    <div class="xt-layout-content" style="height: 84vh; padding: 0px 0px 0px 20px;overflow: hidden">
      <el-form :model="queryParams" label-suffix=":" label-width="120px" size="small">
        <el-row :gutter="12">
<!--          <el-col :span="6">-->
<!--            <el-form-item label="i6000单位ID">-->
<!--              <el-input v-model="queryParams.i6000DeptId" placeholder="请输入i6000单位ID" clearable></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="6">
            <el-form-item label="i6000单位名称">
              <el-input v-model="queryParams.i6000DeptName" placeholder="请输入i6000单位名称" clearable></el-input>
            </el-form-item>
          </el-col>
<!--          <el-col :span="6">-->
<!--            <el-form-item label="i6000单位ID">-->
<!--              <el-input v-model="queryParams.i6000UnitId" placeholder="请输入i6000单位ID" clearable></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <!--          <el-col :span="6">-->
          <!--            <el-form-item label="模型英文名">-->
          <!--              <el-input v-model="queryParams.ciName" placeholder="请输入模型英文名" clearable></el-input>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->

          <el-col :span="18" class="d_end">
            <div>
              <el-button type="primary" plain size="small" @click="getList">查 询</el-button>
              <el-button type="info" plain size="small" @click="reset">重 置</el-button>
              <!--              <el-button type="success" plain size="small" @click="handelAdd()">新 增</el-button>-->
              <el-button type="danger" plain size="small" @click="handelDelete(null)">删 除</el-button>
              <el-button type="success" icon="el-icon-refresh" plain size="small" @click="handelUpdate(null)" :loading="upLoading">更新数据</el-button>
<!--              <el-button type="success" icon="el-icon-refresh" plain size="small" @click="handelSync(null)" :loading="tbLoading">同 步</el-button>-->
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 设备列表 -->
      <el-table ref="table" :data="tableData" stripe border size="small" height="68vh" v-loading="tableloading">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column width="50" type="index" :index="Nindex" label="序号" align="center"></el-table-column>
        <el-table-column label="i6000单位ID" prop="i6000UnitId" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="i6000单位名称" prop="i6000UnitName" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="i6000单位ID" prop="i6000UnitId" s show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" sortable s show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
<!--            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>-->
            <el-button type="text" size="small" icon="el-icon-delete" @click="handelDelete(scope.row.i6000DeptId)" style="color: red;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination :total="page.total" :page.sync="page.currentPage" :limit.sync="page.pageSize" @pagination="getList"/>
    </div>
    <unit-dept-add-edit v-if="showAddEdit"
                        :isShow="showAddEdit"
                        :fromValue="fromValue"
                        :type="type"
                        @refreshData="getList"
                        @close="showAddEdit = false">
    </unit-dept-add-edit>
  </div>
</template>

<script>

import {getList, remove, up,sync} from "@/api/i6000/unit";
import UnitDeptAddEdit from "./components/unitDept/addedit.vue";
//成本中心页面
export default {
  name: 'i6000Unit',
  components: {UnitDeptAddEdit},
  data() {
    return {
      tableloading: false,
      queryParams: {},
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
      tableData: null,

      showAddEdit: false,
      fromValue: null,
      type: null,

      upLoading:false,
      tbLoading: false,
    }
  },
  mounted() {
    this.page = {currentPage: 1, pageSize: 20, total: 0};
    this.getList();
  },
  methods: {
    getList() {
      this.tableloading = true;
      getList(this.page.currentPage, this.page.pageSize, this.queryParams).then(res => {
        const data = res.data;
        this.page.total = data.total;
        this.tableData = data.records;
        this.tableloading = false;
      });
    },
    handelAdd() {
      this.type = 'add';
      this.showAddEdit = true;
    },
    handleEdit(row) {
      this.type = 'edit';
      this.showAddEdit = true;
      this.fromValue = row;
    },
    handelUpdate(){
      this.upLoading = true;
      up().then(res => {
        this.$message.success('更新成功');
      }).finally(() => {
        this.upLoading = false;
      });
    },
    //手动同步按钮
    handelSync() {
      this.tbLoading = true;
      sync().then(res => {
        this.$message.success('请求成功');
      }).finally(() => {
        this.tbLoading = false;
      });
    },
    handelDelete(id) {
      if (id) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return remove(id);
        }).then(() => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      } else {
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
            return item.i6000DeptId
          }).join(',');
          return remove(ids);
        }).then(() => {
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
      }
    },
    Nindex(index) {
      return index + 1 + (this.page.currentPage - 1) * this.page.pageSize;
    },
    reset() {
      this.queryParams = {};
      this.page = {currentPage: 1, pageSize: 20, total: 0,};
      this.getList();
    },
    getTypeColor(type) {
      if (type == '0') {
        return '#209141';
      } else if (type == '1') {
        return '#4390F2';
      } else if (type == '2') {
        return '#000000';
      } else if (type == '3') {
        return '#000000';
      }
      return '#000000';
    },
    getTypeName(type) {
      if (type == '0') {
        return '属性';
      } else if (type == '1') {
        return '配置项';
      } else if (type == '2') {
        return '模型';
      } else if (type == '3') {
        return '字典模型';
      }
    },
  },
}
</script>
<style scoped lang="scss">
.d_stext {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.d_stext span {
  font-size: 14px;
  color: #666666;
}

.d_sb {
  display: flex;
  justify-content: space-between;
}

.d_end {
  display: flex;
  justify-content: flex-end;
}
</style>
