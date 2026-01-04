<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="xt-layout page_body">
      <div class="xt-layout-content" style="height: 84vh; padding: 0px 0px 0px 20px">
        <el-form :model="queryParams" label-suffix=":" label-width="120px" size="small">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item label="上级名称" size="small">
                <el-input v-model="queryParams.parentName" placeholder="请输入上级名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="上级编码" clearable>
                <el-input v-model="queryParams.parentCode" placeholder="请输入上级编码" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="编码名称" clearable>
                <el-input v-model="queryParams.selfName" placeholder="请输入编码名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="编码" clearable>
                <el-input v-model="queryParams.selfCode" placeholder="请输入编码" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="类型">
                <el-select
                  v-model="queryParams.type"
                  placeholder="请选择类型"
                  clearable>
                  <el-option
                    v-for="(item, index) in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" plain size="small" @click="getList">查 询</el-button>
              <el-button type="success" plain size="small" @click="handleAdd">新 增</el-button>
              <el-button type="info" plain size="small" @click="getList">刷 新</el-button>
            </el-col>
          </el-row>
        </el-form>
        <!-- 设备列表 -->
        <el-table ref="table" :data="tableData" stripe border size="small" height="70vh" v-loading="loading">
          <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="上级名称" prop="parentName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="上级编码" prop="parentCode" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="编码名称" prop="selfName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="编码" prop="selfCode" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="认证地址" prop="url" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="类型" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <span>{{ getTypeName(scope.row.type) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <addedit v-if="componentsParams.isShow"
             :isShow="componentsParams.isShow"
             :type="componentsParams.type"
             :formDetial="editRow"
             @refreshData="getList"
             @close="close"></addedit>
  </basic-container>
</template>

<script>
import {getList, del} from "@/api/operation/safeaccess/areacode";
import addedit from "./components/areacode/addedit.vue";
import {mapGetters} from "vuex";

export default {
  components: {
    addedit
  },
  data() {
    return {
      loading: false,
      typeList: null,
      queryParams: {},

      selfCode: '',
      tableData: null,
      editRow: null,
      componentsParams: {
        isShow: false,
        type: null,
      }
    }
  },
  watch: {},
  mounted() {
    //记载默认数据
    this.getList()
    this.initTypes();
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.safeaccess_add, false),
        viewBtn: this.vaildData(this.permission.safeaccess_view, false),
        delBtn: this.vaildData(this.permission.safeaccess_delete, false),
        editBtn: this.vaildData(this.permission.safeaccess_edit, false)
      };
    }
  },
  methods: {
    initTypes() {
      this.typeList = [];
      this.typeList.push({
        name: '市',
        id: '2'
      })
      this.typeList.push({
        name: '县',
        id: '3'
      })
    },
    getList() {
      //加载 班组
      this.loading = true
      getList({
        ...this.queryParams
      }).then(res => {
        this.tableData = res.data
      }).finally(() => {
        this.loading = false
      })
    },
    handleDelete(id) {
      this.$confirm("点击确认将永久删除数据且无法恢复，请谨慎选择。", "确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return del([{id: id}]);
      }).then(() => {
        this.getList();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      });
    },
    handleEdit(row) {
      this.componentsParams.isShow = true;
      this.componentsParams.type = 'edit';
      this.editRow = JSON.parse(JSON.stringify(row));
    },
    handleAdd() {
      this.componentsParams.isShow = true;
      this.componentsParams.type = 'add';
    },
    close() {
      this.componentsParams.isShow = false;
      this.componentsParams.type = null;
      this.editRow = null;
    },
    getTypeName(type) {
      switch (type) {
        case '2':
          return '市';
        case '3':
          return '县';
        default:
          return null;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.xt-layout-sider {
  border-radius: 5px
}

::v-deep .el-tree {
  background: transparent;
  color: #46506d;
}

.theme-xintong .xt-layout .xt-layout-has-sider {
  width: 320px;
  min-width: 300px;
  max-width: 320px;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 320px;
  flex: 0 0 320px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
</style>
