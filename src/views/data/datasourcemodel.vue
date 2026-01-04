<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.datasourcemodel_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="menu" slot-scope="scope" width="320">
        <el-button type="text"
                   size="small"
                   @click="handleEditAttr(scope.row)">结 构
        </el-button>
      </template>
    </avue-crud>
    <hardwarecolumnDialog
      v-if="showColumn"
      :isShow="showColumn"
      :modelId = 'modelId'
      :datasourceId = 'datasourceId'
      :datasourceName = 'datasourceName'
      @close="showColumn= false">
    </hardwarecolumnDialog>
  </basic-container>
</template>

<script>
  import {getModelList, getDetail, add, update, remove} from "@/api/data/datasourcemodel";
  import {mapGetters} from "vuex";
  import hardwarecolumnDialog from "@/views/data/components/hardwarebase/hardwarecolumnDialog.vue"

  export default {
    components:{
      hardwarecolumnDialog
    },
    data() {
      return {
        showColumn: false,
        form: {},
        query: {},
        loading: true,
        modelId: '',
        datasourceId: '',
        datasourceName: '',
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height: '630',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          labelWidth: 150,
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          addBtn: true,
          editBtnIcon: '',
          delBtnIcon: '',
          viewBtnIcon: '',
          selection: true,
          column: [
            {
              label: "主键",
              prop: "id",
              hide: true,
              display: false,
              addDisplay: false,
              editDisplay: false,
              rules: [{
                required: false,
                message: "请输入主键",
                trigger: "blur"
              }]
            },
            {
              label: "模型编码",
              prop: "code",
              rules: [{
                required: true,
                message: "请输入编码",
                trigger: "blur"
              }]
            },
            {
              label: "模型名称",
              prop: "name",
              rules: [{
                required: true,
                message: "请输入名称",
                trigger: "blur"
              }]
            },
            {
              label: "类型",
              prop: "type",
              rules: [{
                required: true,
                message: "请输入类型",
                trigger: "blur"
              }]
            },
            {
              label: "数据源",
              prop: "datasourceId",
              type: "select",
              search: true,
              dicUrl: "/api/idevelop-develop/datasource/select?current=1&size=10",
              props: {
                label: "name",
                value: "id"
              },
              slot: true,
              rules: [{
                required: true,
                message: "请选择数据源",
                trigger: "blur"
              }]
            },
            // {
            //   label: "数据源",
            //   prop: "datasourceName",
            //   addDisplay: false,
            //   editDisplay: false,
            //   addDisplay: true,
            //   editDisplay: true,
            //   viewDisplay: true,
            //   rules: [{
            //     required: true,
            //     message: "请输入数据源",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "备注",
              prop: "remark",
              rules: [{
                required: false,
                message: "请输入备注",
                trigger: "blur"
              }],
            },
            {
              label: "H3C模型ID",
              prop: "h3cModelId",
              rules: [{
                required: false,
                message: "请输入",
                trigger: "blur"
              }],
            },
            {
              label: "H3C模型类型",
              prop: "h3cModelType",
              rules: [{
                required: false,
                message: "请输入",
                trigger: "blur"
              }],
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.datasourcemodel_add, false),
          viewBtn: this.vaildData(this.permission.datasourcemodel_view, false),
          delBtn: this.vaildData(this.permission.datasourcemodel_delete, false),
          editBtn: this.vaildData(this.permission.datasourcemodel_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, done, loading) {
        //判断计算获取数据源名称
        add(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        if (Object.keys(row).length == 0) {
          //没有修改 不做更新操作
          done();
          return;
        }
        update(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          loading();
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      handleEditAttr(row) {
        if(!row){
          //编辑属性字段
          if (this.selectionList.length === 0) {
            this.$message.warning("请选择至少一条数据");
            return;
          }if (this.selectionList.length > 1) {
            this.$message.warning("请选择一条数据");
            return;
          }
          row = this.selectionList[0]
        }
        // this.$router.push({
        //   path: '/data/datasourcecolumn',
        //   query: {
        //     modelId: row.id||'',
        //     datasourceId: row.datasourceId||'',
        //     datasourceName: row.datasourceName||'',
        //   }
        // });
        //编辑属性字段 弹框
        this.modelId = row.id||'';
        this.datasourceId = row.datasourceId||'';
        this.datasourceName = row.datasourceName||'';
        this.showColumn = true;
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getModelList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>
