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
                   v-if="permission.logopt_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getLogOptList, getDetail, add, update, remove} from "@/api/device/logopt";
  import {mapGetters} from "vuex";

  export default {
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
              label: "编号",
              prop: "id",
              rules: [{
                required: true,
                message: "请输入编号",
                trigger: "blur"
              }]
            },
            {
              label: "服务ID",
              prop: "serviceId",
              rules: [{
                required: true,
                message: "请输入服务ID",
                trigger: "blur"
              }]
            },
            {
              label: "服务器名",
              prop: "serverHost",
              rules: [{
                required: true,
                message: "请输入服务器名",
                trigger: "blur"
              }]
            },
            {
              label: "服务器IP地址",
              prop: "serverIp",
              rules: [{
                required: true,
                message: "请输入服务器IP地址",
                trigger: "blur"
              }]
            },
            {
              label: "系统环境",
              prop: "env",
              rules: [{
                required: true,
                message: "请输入系统环境",
                trigger: "blur"
              }]
            },
            {
              label: "日志级别",
              prop: "logLevel",
              rules: [{
                required: true,
                message: "请输入日志级别",
                trigger: "blur"
              }]
            },
            {
              label: "日志业务id，原始业务id，用于关联查询",
              prop: "logId",
              rules: [{
                required: true,
                message: "请输入日志业务id，原始业务id，用于关联查询",
                trigger: "blur"
              }]
            },
            {
              label: "日志数据",
              prop: "logData",
              rules: [{
                required: true,
                message: "请输入日志数据",
                trigger: "blur"
              }]
            },
            {
              label: "操作方式",
              prop: "method",
              rules: [{
                required: true,
                message: "请输入操作方式",
                trigger: "blur"
              }]
            },
            {
              label: "请求URI",
              prop: "requestUri",
              rules: [{
                required: true,
                message: "请输入请求URI",
                trigger: "blur"
              }]
            },
            {
              label: "操作IP地址",
              prop: "remoteIp",
              rules: [{
                required: true,
                message: "请输入操作IP地址",
                trigger: "blur"
              }]
            },
            {
              label: "方法类",
              prop: "methodClass",
              rules: [{
                required: true,
                message: "请输入方法类",
                trigger: "blur"
              }]
            },
            {
              label: "方法名",
              prop: "methodName",
              rules: [{
                required: true,
                message: "请输入方法名",
                trigger: "blur"
              }]
            },
            {
              label: "用户代理",
              prop: "userAgent",
              rules: [{
                required: true,
                message: "请输入用户代理",
                trigger: "blur"
              }]
            },
            {
              label: "操作提交的数据",
              prop: "params",
              rules: [{
                required: true,
                message: "请输入操作提交的数据",
                trigger: "blur"
              }]
            },
            {
              label: "执行时间",
              prop: "time",
              rules: [{
                required: true,
                message: "请输入执行时间",
                trigger: "blur"
              }]
            },
            {
              label: "创建者",
              prop: "createBy",
              rules: [{
                required: true,
                message: "请输入创建者",
                trigger: "blur"
              }]
            },
            {
              label: "操作人",
              prop: "optName",
              rules: [{
                required: true,
                message: "请输入操作人",
                trigger: "blur"
              }]
            },
            {
              label: "操作类型，设备建档/转资/入库/申请/出库类型",
              prop: "optType",
              rules: [{
                required: true,
                message: "请输入操作类型，设备建档/转资/入库/申请/出库类型",
                trigger: "blur"
              }]
            },
            {
              label: "角色",
              prop: "optRole",
              rules: [{
                required: true,
                message: "请输入角色",
                trigger: "blur"
              }]
            },
            {
              label: "操作内容",
              prop: "title",
              rules: [{
                required: true,
                message: "请输入操作内容",
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
          addBtn: this.vaildData(this.permission.logopt_add, false),
          viewBtn: this.vaildData(this.permission.logopt_view, false),
          delBtn: this.vaildData(this.permission.logopt_delete, false),
          editBtn: this.vaildData(this.permission.logopt_edit, false)
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
            this.form = res.data;
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
        getLogOptList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
