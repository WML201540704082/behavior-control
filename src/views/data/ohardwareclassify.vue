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
  import {getList, getDetail, add, update, remove} from "@/api/data/ohardwareclassify";
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
          selection: true,
          column: [
            {
              label: "ID",
              prop: "classifyId",
              hide: true,
              rules: [{
                required: true,
                message: "请输入ID",
                trigger: "blur"
              }]
            },
            {
              label: "原分类编码",
              prop: "classifyCode",
              width: 120,
              rules: [{
                required: true,
                message: "请输入原分类编码",
                trigger: "blur"
              }]
            },
            {
              label: "原分类名称",
              prop: "classifyName",
              width: 120,
              rules: [{
                required: true,
                message: "请输入原分类名称",
                trigger: "blur"
              }]
            },
            {
              label: "原上级分类",
              prop: "parentId",
              width: 100,
              rules: [{
                required: true,
                message: "请输入原上级分类",
                trigger: "blur"
              }]
            },
            {
              label: "原分类级别",
              prop: "classifyLevel",
              width: 100,
              rules: [{
                required: true,
                message: "请输入原分类级别",
                trigger: "blur"
              }]
            },
            {
              label: "设备分类",
              prop: "deviceCategory",
              width: 150,
              rules: [{
                required: true,
                message: "请输入设备分类",
                trigger: "blur"
              }]
            },
            {
              label: "设备分类名称",
              prop: "deviceCategoryName",
              width: 120,
              rules: [{
                required: true,
                message: "请输入设备分类名称",
                trigger: "blur"
              }]
            },
            {
              label: "是否可用",
              prop: "isAvailable",
              hide: true,
              rules: [{
                required: true,
                message: "请输入是否可用",
                trigger: "blur"
              }]
            },
            {
              label: "备注信息",
              prop: "classifyRemark",
              hide: true,
              rules: [{
                required: true,
                message: "请输入备注信息",
                trigger: "blur"
              }]
            },
            {
              label: "创建者",
              prop: "createBy",
              hide: true,
              rules: [{
                required: true,
                message: "请输入创建者",
                trigger: "blur"
              }]
            },
            {
              label: "更新者",
              prop: "updateBy",
              hide: true,
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
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.ohardwareclassify_add, false),
          viewBtn: this.vaildData(this.permission.ohardwareclassify_view, false),
          delBtn: this.vaildData(this.permission.ohardwareclassify_delete, false),
          editBtn: this.vaildData(this.permission.ohardwareclassify_edit, false)
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
          getDetail(this.form.classifyId).then(res => {
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
