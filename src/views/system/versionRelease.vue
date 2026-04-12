<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="xt-layout page_body">
      <div class="xt-layout-content" style="height: 84vh; padding: 0px 0px 0px 20px">
        <el-form :model="queryParams" label-suffix=":" label-width="120px" size="small">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item label="标题" size="small">
                <el-input v-model="queryParams.title" placeholder="请输入标题" clearable></el-input>
              </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-button type="primary" plain size="small" @click="getList">查 询</el-button>
              <el-button type="success" plain size="small" @click="handleAdd">新 增</el-button>
              <!-- <el-button type="info" plain size="small" @click="getList">刷 新</el-button> -->
            </el-col>
          </el-row>
        </el-form>
        <!-- 设备列表 -->
        <el-table ref="table" :data="tableData" stripe border size="small" height="70vh" v-loading="loading">
          <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="标题" prop="title" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="内容" prop="remind" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip align="center"></el-table-column>
         
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          :total="queryParams.total"
          :page.sync="queryParams.currentPage"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
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
import {remindPage, remindRemove} from "@/api/page/index";
import addedit from "./components/versionRelease/addedit.vue";
import {mapGetters} from "vuex";

export default {
  components: {
    addedit
  },
  data() {
    return {
      loading: false,
      typeList: null,
      queryParams: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },

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
      remindPage({
        ...this.queryParams
      }).then(res => {
        this.tableData = res.data.records
        this.queryParams.total = res.data.total
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
        return remindRemove({ids: id});
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
