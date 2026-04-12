<template>
  <basic-container>
    <div class="page_form">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="接口名称" prop="port">
              <el-input v-model="searchForm.port" placeholder="请输入接口名称" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接口地址" prop="portAddress">
              <el-input v-model="searchForm.portAddress" placeholder="请输入接口地址" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接口类型" prop="portType">
              <el-select v-model="searchForm.portType" placeholder="请选择接口类型" clearable>
                <el-option v-for="dict in portTypeList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接口说明" prop="remake">
              <el-input v-model="searchForm.remake" placeholder="请输入接口说明" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'数据共享服务清单'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button size="small" class="border-btn" icon="el-icon-refresh" @click="searchReset">重置</el-button>
            <el-button type="success" size="small" icon="el-icon-plus" v-if="permissionList.addBtn"
                       @click="handleAdd()">新 增
            </el-button>
          </div>
        </formTitle>
      </el-row>
      <el-table
        ref="dataTable"
        stripe
        size="small"
        :data="dataList"
        :height="tableHeight"
        v-loading="loading"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="port" label="接口名称" width="auto" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="portType" label="接口类型" width="auto" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="portAddress" label="接口地址" width="auto" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="remake" label="接口说明" width="auto" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-view"
                       @click="handleView(scope.row,scope.index)">查看
            </el-button>
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-edit"
                       v-if="permissionList.editBtn"
                       @click="handleEdit(scope.row,scope.index)">编辑
            </el-button>
            <el-button type="text"
                       class="list_btn btn_red"
                       size="small"
                       icon="el-icon-delete"
                       v-if="permissionList.delBtn"
                       @click="handleDeleteOne(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="onLoad"
      />
    </div>

    <!-- 新增/修改 -->
    <PortResAddEdit
      v-if="showAddEdit"
      :isShow="showAddEdit"
      :fromValue="fromValue"
      :type="type"
      @refreshData="handleQuery"
      @close="showAddEdit = false"
    ></PortResAddEdit>

    <PortDetial v-if="showDetial"
                :isShow="showDetial"
                :fromValue="fromValue"
                @close="showDetial = false"
                @refreshData="handleQuery"
                >
    </PortDetial>

  </basic-container>
</template>

<script>
  import {getDictList} from "@/api/dict";
  import {getList, remove} from "@/api/endpoint/port";
  import {mapGetters, mapState} from "vuex";
  import PortResAddEdit from "./components/port/addedit.vue";
  import PortDetial from "./components/port/detail.vue";

  export default {
    components: {PortResAddEdit, PortDetial},
    data() {
      return {
        // 搜索相关
        searchForm: {
          port: null,
          portAddress: null,
          remake: null,
          portType: null,
          current: 1,
          size: 20,
        },
        createTimes: null,
        // 表格相关
        dataList: [],
        selectionList: [],
        portTypeList: [],
        loading: false,
        tableHeight: undefined,
        total: 0,
        showAddEdit: false,
        showDetial: false,
        type: null,
        addBtn: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
      };
    },
    computed: {
      ...mapGetters(["permission", "userDetail"]),
      ...mapState({
        userInfo: state => state.user.userInfo
      }),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.endpoint_port_add, false),
          viewBtn: this.vaildData(this.permission.endpoint_port_select, false),
          delBtn: this.vaildData(this.permission.endpoint_port_delete, false),
          editBtn: this.vaildData(this.permission.endpoint_port_update, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
    },
    mounted() {
      // 设置页面元素高度
      this.setPageContentHeight();
      // 设置表格高度
      this.setTableHeight();
      // 初始化查询
      this.onLoad();
      // 初始化字典
      this.getDict();
    },
    methods: {
      // 获得字典
      getDict() {
        getDictList("endpoint_port_type").then(res => {
          this.portTypeList = res.data;
        })
      },
      // 设置表格高度
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body');
        this.tableHeight = pageBody[0].offsetHeight - 61 - 47 + 'px';
      },
      handleQuery() {
        this.searchForm.current = 1
        this.onLoad();
      },
      handleDeleteOne(id) {
        //删除按钮
        let ids = id;
        this.handleDeleteConfirm(ids);
        this.selectionList.filter(item => item != id);
      },
      handleDelete() {
        //顶部删除
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.handleDeleteConfirm(this.ids);
      },
      handleDeleteConfirm(ids) {
        this.$confirm("点击确认将永久删除数据且无法恢复，请谨慎选择。", "确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(ids);
          })
          .then(() => {
            this.onLoad();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            //重新重新加载已经选择的数据。。。待实现
          });
      },
      searchReset() {
        //重置按钮
        this.searchForm = {
          port: null,
          portAddress: null,
          remake: null,
          current: 1,
          size: 20,
        };
        this.onLoad();
      },
      selectionChange(selection) {
        //点击选择事件
        this.selectionList = selection.map(item => item.id);
      },
      selectionClear() {
        //清除选择
        this.selectionList = [];
        this.$refs.dataTable.clearSelection();
      },
      onLoad() {
        //加载数据
        this.loading = true;
        getList(this.searchForm).then(res => {
          const data = res.data;
          this.total = data.total;
          this.dataList = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      handleView(row) {
        //详情 页面
        this.showDetial = true;
        this.fromValue = row;
      },
      handleEdit(row) {
        this.type = 'edit';
        this.showAddEdit = true;
        this.fromValue = row;
      },
      handleAdd() {
        //新增 页面
        this.type = 'add';
        this.showAddEdit = true;
      }
    }
  };
</script>
<style lang="scss" scoped>
  ::v-deep .formTime {
    width: 100%;
    margin-top: 4px;

    .el-icon-date {
      margin-top: -7px;
    }
  }

  .list_btn {
    padding: 9px 5px !important;
  }

  .btn_red {
    color: red;
  }
</style>
