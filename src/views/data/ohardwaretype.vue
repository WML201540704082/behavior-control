<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
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
  import {getList, getDetail, add, update, remove} from "@/api/data/ohardwaretype";
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
              prop: "typeId",
              hide: true,
              rules: [{
                required: false,
                message: "请输入ID",
                trigger: "blur"
              }]
            },
            {
              label: "类型编码",
              prop: "typeCode",
              rules: [{
                required: false,
                message: "请输入类型编码",
                trigger: "blur"
              }]
            },
            {
              label: "类型名称",
              prop: "typeName",
              rules: [{
                required: false,
                message: "请输入类型名称",
                trigger: "blur"
              }]
            },
            {
              label: "上级分类",
              prop: "classifyId",
              rules: [{
                required: false,
                message: "请输入上级分类",
                trigger: "blur"
              }]
            },
            {
              label: "是否可用",
              prop: "isAvailable",
              hide: true,
              rules: [{
                required: false,
                message: "请输入是否可用",
                trigger: "blur"
              }]
            },
            {
              label: "备注信息",
              prop: "typeRemark",
              hide: true,
              rules: [{
                required: false,
                message: "请输入备注信息",
                trigger: "blur"
              }]
            },
            {
              label: "设备分类",
              prop: "classifyCode",
              rules: [{
                required: false,
                message: "请输入设备分类",
                trigger: "blur"
              }]
            },
            {
              label: "分类名称",
              prop: "classifyName",
              rules: [{
                required: false,
                message: "请输入分类名称",
                trigger: "blur"
              }]
            },
            {
              label: "设备分类",
              prop: "deviceCategory",
              rules: [{
                required: false,
                message: "请输入设备分类",
                trigger: "blur"
              }]
            },
            {
              label: "设备类型",
              prop: "deviceType",
              rules: [{
                required: false,
                message: "请输入设备类型",
                trigger: "blur"
              }]
            },
            {
              label: "设备类型名称",
              prop: "deviceTypeName",
              rules: [{
                required: false,
                message: "请输入设备类型名称",
                trigger: "blur"
              }]
            },
            {
              label: "设备分类名称",
              prop: "deviceCategoryName",
              rules: [{
                required: false,
                message: "请输入设备分类名称",
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
          getDetail(this.form.typeId).then(res => {
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
