<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="xt-layout page_body">
      <div class="xt-layout-content" style="height: 84vh; padding: 0px 0px 0px 20px">
        <el-form :model="queryParams" label-suffix=":" label-width="120px" size="small">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item label="名称" size="small">
                <el-input v-model="queryParams.name" placeholder="请输入上级名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" plain size="small" @click="requestData">查 询</el-button>
              <el-button type="primary" size="small" @click="handleAdd">新 增</el-button>
              <el-button type="warning" size="small" @click="requestData">刷 新</el-button>
            </el-col>
          </el-row>
        </el-form>
        <!-- 设备列表 -->
        <el-table ref="table" :data="tableData" stripe border size="small" height="70vh" v-loading="loading">
          <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="文件名称" prop="uploadFileName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="状态" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <span>{{ getStatusName(scope.row.status) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="排序" prop="fileOrder" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="地址URL" prop="fileUrl" show-overflow-tooltip align="center"></el-table-column>

          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
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
             @refreshData="requestData"
             @close="close"></addedit>
  </basic-container>
</template>

<script>
import addedit from "./components/helpComponent/addedit";
import {getList, remove} from "@/api/data/uploadfiles";
import {removeFile} from "@/api/system/devInBound";

export default {
  components: {addedit},
  data() {
    return {
      loading: false,
      queryParams: {},
      tableData: [],

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
    this.requestData();
  },
  methods: {
    requestData() {
      getList(1, 100, this.queryParams).then(res => {
        this.tableData = res.data.records;
      });
    },
    handleEdit(row) {
      this.componentsParams.isShow = true;
      this.componentsParams.type = 'edit';
      this.editRow = JSON.parse(JSON.stringify(row));
    },
    handleDelete(row) {
      this.$alert('确定要删除此条数据吗?').then(res => {
        remove(row.id).then(res => {
          this.requestData();
        });
      })
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
    getStatusName(type) {
      if (type == '0') {
        return '可用'
      }
      return '不可用'
    },
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
