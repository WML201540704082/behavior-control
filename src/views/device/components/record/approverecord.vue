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
                   v-if="permission.approverecord_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getApproveList, getDetail, add, update, remove} from "@/api/device/approverecord";
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
              label: "主键",
              prop: "id",
              rules: [{
                required: true,
                message: "请输入主键",
                trigger: "blur"
              }]
            },
            {
              label: "WBS元素",
              prop: "wbsId",
              rules: [{
                required: true,
                message: "请输入WBS元素",
                trigger: "blur"
              }]
            },
            {
              label: "建档编号/转资/入库/申请/出库工单id",
              prop: "filingNo",
              rules: [{
                required: true,
                message: "请输入建档编号/转资/入库/申请/出库工单id",
                trigger: "blur"
              }]
            },
            {
              label: "设备建档/转资/入库/申请/出库",
              prop: "optType",
              rules: [{
                required: true,
                message: "请输入设备建档/转资/入库/申请/出库",
                trigger: "blur"
              }]
            },
            {
              label: "节点id",
              prop: "nodeId",
              rules: [{
                required: true,
                message: "请输入节点id",
                trigger: "blur"
              }]
            },
            {
              label: "节点名称",
              prop: "nodeName",
              rules: [{
                required: true,
                message: "请输入节点名称",
                trigger: "blur"
              }]
            },
            {
              label: "操作角色名称",
              prop: "optRole",
              rules: [{
                required: true,
                message: "请输入操作角色名称",
                trigger: "blur"
              }]
            },
            {
              label: "操作人姓名",
              prop: "optName",
              rules: [{
                required: true,
                message: "请输入操作人姓名",
                trigger: "blur"
              }]
            },
            {
              label: "操作人ID",
              prop: "optBy",
              rules: [{
                required: true,
                message: "请输入操作人ID",
                trigger: "blur"
              }]
            },
            {
              label: "操作说明",
              prop: "optTitle",
              rules: [{
                required: true,
                message: "请输入操作说明",
                trigger: "blur"
              }]
            },
            {
              label: "审批意见",
              prop: "optOpinion",
              rules: [{
                required: true,
                message: "请输入审批意见",
                trigger: "blur"
              }]
            },
            {
              label: "操作时间",
              prop: "optDate",
              rules: [{
                required: true,
                message: "请输入操作时间",
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
          addBtn: this.vaildData(this.permission.approverecord_add, false),
          viewBtn: this.vaildData(this.permission.approverecord_view, false),
          delBtn: this.vaildData(this.permission.approverecord_delete, false),
          editBtn: this.vaildData(this.permission.approverecord_edit, false)
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
        getApproveList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
