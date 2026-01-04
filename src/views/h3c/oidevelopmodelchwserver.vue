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
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/h3c/oidevelopmodelchwserver";
  import {mapGetters} from "vuex";

  export default {
    props: ["modelId","h3cModelType","h3cModelId"],
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "主键",
              prop: "id",
              rules: [{
                required: true,
                message: "请输入主键",
                trigger: "blur"
              }]
            },
            {
              label: "模型名称",
              prop: "name",
              rules: [{
                required: true,
                message: "请输入模型名称",
                trigger: "blur"
              }]
            },
            {
              label: "监控UUID",
              prop: "appId",
              rules: [{
                required: true,
                message: "请输入监控UUID",
                trigger: "blur"
              }]
            },
            {
              label: "监控类型",
              prop: "appType",
              rules: [{
                required: true,
                message: "请输入监控类型",
                trigger: "blur"
              }]
            },
            {
              label: "监控指标组",
              prop: "appUnit",
              rules: [{
                required: true,
                message: "请输入监控指标组",
                trigger: "blur"
              }]
            },
            {
              label: "设备分类",
              prop: "deviceCategory",
              rules: [{
                required: true,
                message: "请输入设备分类",
                trigger: "blur"
              }]
            },
            {
              label: "设备类型",
              prop: "deviceType",
              rules: [{
                required: true,
                message: "请输入设备类型",
                trigger: "blur"
              }]
            },
            {
              label: "设备品牌",
              prop: "deviceBrand",
              rules: [{
                required: true,
                message: "请输入设备品牌",
                trigger: "blur"
              }]
            },
            {
              label: "设备系列",
              prop: "deviceSeries",
              rules: [{
                required: true,
                message: "请输入设备系列",
                trigger: "blur"
              }]
            },
            {
              label: "设备型号",
              prop: "deviceModel",
              rules: [{
                required: true,
                message: "请输入设备型号",
                trigger: "blur"
              }]
            },
            {
              label: "cmdbCid",
              prop: "cmdbCid",
              rules: [{
                required: true,
                message: "请输入cmdbCid",
                trigger: "blur"
              }]
            },
            {
              label: "cmdb模型编码",
              prop: "cmdbCode",
              rules: [{
                required: true,
                message: "请输入cmdb模型编码",
                trigger: "blur"
              }]
            },
            {
              label: "cmdb模型名称",
              prop: "cmdbName",
              rules: [{
                required: true,
                message: "请输入cmdb模型名称",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "remark",
              rules: [{
                required: true,
                message: "请输入备注",
                trigger: "blur"
              }]
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
          addBtn: this.vaildData(this.permission.oidevelopmodelchwserver_add, false),
          viewBtn: this.vaildData(this.permission.oidevelopmodelchwserver_view, false),
          delBtn: this.vaildData(this.permission.oidevelopmodelchwserver_delete, false),
          editBtn: this.vaildData(this.permission.oidevelopmodelchwserver_edit, false)
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
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
