<template>
  <div class="xt-layout page_body">
    <div class="xt-layout-content" style="height: 84vh; padding: 0px 0px 0px 20px;overflow: hidden">
      <el-form :model="queryParams" label-suffix=":" label-width="auto" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="属性ID">
              <el-input v-model="queryParams.ciId" placeholder="请输入属性ID" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="属性英文">
              <el-input v-model="queryParams.ciName" placeholder="请输入属性英文名" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" class="d_end">
            <div>
              <el-button type="primary" plain size="small" @click="getList">查 询</el-button>
              <el-button type="info" plain size="small" @click="reset">重 置</el-button>
              <el-button type="success" plain size="small" @click="handelAdd()">新 增</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 设备列表 -->
      <el-table ref="table" :data="tableData" stripe border size="small" height="68vh" v-loading="tableloading">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column width="50" type="index" :index="Nindex" label="序号" align="center"></el-table-column>
        <el-table-column label="模型ID" prop="ciId" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="模型英文名" prop="ciName" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="模型中文名" prop="ciLabel" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="级联模型信息" prop="cascadeCiInfo" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="类型ID" prop="ciTypeId" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="是否需要级联" prop="isExistCascade" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ getIsExistCascadeText(scope.row.isExistCascade) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="查询模型ID" prop="selectCiId" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="查询模型英文名" prop="selectCiName" show-overflow-tooltip align="center"></el-table-column>


        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-news" @click="handleYs(scope.row)">映 射</el-button>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编 辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination :total="page.total" :page.sync="page.currentPage" :limit.sync="page.pageSize" @pagination="getList"/>
    </div>

    <!-- 属性映射弹窗 -->
    <arrtMapping
      v-if="showArrt"
      :isShow="showArrt"
      :ciId="ciId"
      :ciName="ciName"
      :ciLabel="ciLabel"
      @close="showArrt = false"
    ></arrtMapping>

    <cmdb-res-add-edit v-if="showAddEdit"
                       :isShow="showAddEdit"
                       :fromValue="fromValue"
                       :type="type"
                       @refreshData="getList"
                       @close="showAddEdit = false">
    </cmdb-res-add-edit>
  </div>
</template>

<script>

  import {getList} from "@/api/treeManager/cmdbres";
  import arrtMapping from "./components/tree/arrtMapping.vue";
  import CmdbResAddEdit from "@/views/cmdb/components/treeManage/components/cmdbres/addedit.vue";
  import PzsxAddEdit from "@/views/cmdb/components/treeManage/components/pzsx/addedit.vue";
  //成本中心页面
  export default {
    name: 'tabCmdbRes',
    components: {PzsxAddEdit, CmdbResAddEdit, arrtMapping},
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

        showArrt: false,
        ciId: '',
        ciName: '',
        ciLabel: ''
      };
    },
    mounted() {
      this.page = {currentPage: 1, pageSize: 20, total: 0,};
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
        }
      },
      handleYs(row) {
        this.showArrt = true;
        this.ciId = row.selectCiId;
        this.ciName = row.selectCiName;
        this.ciLabel = row.ciLabel;
      },
      getIsExistCascadeText(isExistCascadeText) {
        if (isExistCascadeText == '0') {
          return '否';
        } else if (isExistCascadeText == '1') {
          return '是';
        }
        return null;
      },
      Nindex(index) {
        return index + 1 + (this.page.currentPage - 1) * this.page.pageSize;
      },
      reset() {
        this.queryParams = {};
        this.page = {currentPage: 1, pageSize: 20, total: 0,};
        this.getList();
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
