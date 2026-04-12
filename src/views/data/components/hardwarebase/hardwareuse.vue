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
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/data/hardwareuse";
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
          height: '75vh',
          calcHeight: 210,
          header: false,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          delBtn: false,
          editBtn: false,
          selection: true,
          column: [
            {
              label: "使用_ID",
              prop: "useId",
              width: 150,
              rules: [{
                required: true,
                message: "请输入使用_ID",
                trigger: "blur"
              }]
            },
            {
              label: "领用部门",
              prop: "miUseDep",
              width: 100,
              rules: [{
                required: true,
                message: "请输入领用部门",
                trigger: "blur"
              }]
            },
            {
              label: "使用保管部门",
              prop: "miReserveDep",
              rules: [{
                required: true,
                message: "请输入使用保管部门",
                trigger: "blur"
              }]
            },
            {
              label: "领用人",
              prop: "miUser",
              rules: [{
                required: true,
                message: "请输入领用人",
                trigger: "blur"
              }]
            },
            {
              label: "领用日期",
              prop: "miUseDate",
              rules: [{
                required: true,
                message: "请输入领用日期",
                trigger: "blur"
              }]
            },
            {
              label: "运维部门",
              prop: "miOmDep",
              rules: [{
                required: true,
                message: "请输入运维部门",
                trigger: "blur"
              }]
            },
            {
              label: "实物管理部门",
              prop: "miMeterialManageDep",
              rules: [{
                required: true,
                message: "请输入实物管理部门",
                trigger: "blur"
              }]
            },
            {
              label: "运维责任人",
              prop: "miOmResponsible",
              rules: [{
                required: true,
                message: "请输入运维责任人",
                trigger: "blur"
              }]
            },
            {
              label: "运维联系电话",
              prop: "miOmPhone",
              rules: [{
                required: true,
                message: "请输入运维联系电话",
                trigger: "blur"
              }]
            },
            {
              label: "线站标识",
              prop: "miLsLogo",
              rules: [{
                required: true,
                message: "请输入线站标识",
                trigger: "blur"
              }]
            },
            {
              label: "插入时间",
              prop: "createDate",
              rules: [{
                required: true,
                message: "请输入插入时间",
                trigger: "blur"
              }]
            },
            {
              label: "修改时间",
              prop: "updateDate",
              rules: [{
                required: true,
                message: "请输入修改时间",
                trigger: "blur"
              }]
            },
            {
              label: "设备编码",
              prop: "basicDeviceCode",
              rules: [{
                required: true,
                message: "请输入设备编码",
                trigger: "blur"
              }]
            },
            {
              label: "设备版本",
              prop: "devVersion",
              rules: [{
                required: true,
                message: "请输入设备版本",
                trigger: "blur"
              }]
            },
            {
              label: "版本状态0：不显示；1：显示",
              prop: "versionState",
              rules: [{
                required: true,
                message: "请输入版本状态0：不显示；1：显示",
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
              label: "更新者",
              prop: "updateBy",
              rules: [{
                required: true,
                message: "请输入更新者",
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
            {
              label: "设备使用人",
              prop: "miChargeUser",
              rules: [{
                required: true,
                message: "请输入设备使用人",
                trigger: "blur"
              }]
            },
            {
              label: "设备使用人身份证",
              prop: "miChargeIdcard",
              rules: [{
                required: true,
                message: "请输入设备使用人身份证",
                trigger: "blur"
              }]
            },
            {
              label: "设备使用人部门",
              prop: "miChargeDep",
              rules: [{
                required: true,
                message: "请输入设备使用人部门",
                trigger: "blur"
              }]
            },
            {
              label: "领用人（责任人）身份证",
              prop: "miUseIdcard",
              rules: [{
                required: true,
                message: "请输入领用人（责任人）身份证",
                trigger: "blur"
              }]
            },
            {
              label: "领用人（责任人）班组",
              prop: "miUseGroup",
              rules: [{
                required: true,
                message: "请输入领用人（责任人）班组",
                trigger: "blur"
              }]
            },
            {
              label: "设备使用人班组",
              prop: "miChargeGroup",
              rules: [{
                required: true,
                message: "请输入设备使用人班组",
                trigger: "blur"
              }]
            },
            {
              label: "领用人（责任人）手机号",
              prop: "miUsePhone",
              rules: [{
                required: true,
                message: "请输入领用人（责任人）手机号",
                trigger: "blur"
              }]
            },
            {
              label: "专业",
              prop: "speciality",
              rules: [{
                required: true,
                message: "请输入专业",
                trigger: "blur"
              }]
            },
            {
              label: "专业名称",
              prop: "specialityName",
              rules: [{
                required: true,
                message: "请输入专业名称",
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
          addBtn: this.vaildData(this.permission.hardwareuse_add, false),
          viewBtn: this.vaildData(this.permission.hardwareuse_view, false),
          delBtn: this.vaildData(this.permission.hardwareuse_delete, false),
          editBtn: this.vaildData(this.permission.hardwareuse_edit, false)
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
