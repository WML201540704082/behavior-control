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
  import {getDictList, getDictTypeList, getDetail ,update} from "@/api/data/hardwaredictdata";
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
          height: '70vh',
          calcHeight: 210,
          header: false,
          searchShow: true,
          searchMenuSpan: 8,
          labelWidth: 180,
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          addBtn: false,
          delBtn: false,
          editBtn: true,
          selection: true,
          column: [
            {
              label: "原字典编码",
              prop: "dictCode",
              width: 100,
              rules: [{
                required: false,
                message: "请输入字典编码",
                trigger: "blur"
              }]
            },
            {
              label: "原字典键值",
              prop: "dictValue",
              width: 100,
              rules: [{
                required: false,
                message: "请输入字典键值",
                trigger: "blur"
              }]
            },
            {
              label: "原字典标签",
              prop: "dictLabel",
              width: 100,
              rules: [{
                required: false,
                message: "请输入字典标签",
                trigger: "blur"
              }]
            },
            {
              label: "原类型",
              prop: "dictType",
              type: "select",
              search: true,
              dicUrl: "/api/idevelop-data/hardware/dict/type/list",
              props: {
                label: "dictName",
                value: "dictType"
              },
              width: 200,
              rules: [{
                required: false,
                message: "请输入字典类型",
                trigger: "blur"
              }]
            },
            {
              label: "原字典排序",
              prop: "dictSort",
              width: 100,
              rules: [{
                required: false,
                message: "请输入字典排序",
                trigger: "blur"
              }]
            },
            {
              label: "原样式属性",
              prop: "cssClass",
              hide: true,
              rules: [{
                required: false,
                message: "请输入样式属性（其他样式扩展）",
                trigger: "blur"
              }]
            },
            {
              label: "表格回显样式",
              prop: "listClass",
              hide: true,
              rules: [{
                required: false,
                message: "请输入表格回显样式",
                trigger: "blur"
              }]
            },
            {
              label: "是否默认（Y是 N否）",
              prop: "isDefault",
              hide: true,
              width: 100,
              rules: [{
                required: false,
                message: "请输入是否默认（Y是 N否）",
                trigger: "blur"
              }]
            },
            {
              label: "原备注",
              prop: "remark",
              hide: true,
              width: 100,
              rules: [{
                required: false,
                message: "请输入备注",
                trigger: "blur"
              }]
            },
            {
              label: "映射字典id",
              prop: "cmdbDictId",
              rules: [{
                required: false,
                message: "请输入映射字典id",
                trigger: "blur"
              }]
            },
            {
              label: "映射字典值",
              prop: "cmdbDictValue",
              rules: [{
                required: false,
                message: "请输入映射字典值",
                trigger: "blur"
              }]
            },
            {
              label: "映射字典标签",
              prop: "cmdbDictLabel",
              rules: [{
                required: false,
                message: "请输入映射字典标签",
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
    },
    methods: {
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.dictCode).then(res => {
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
        getDictList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
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
    }
  };
</script>

<style lang="scss" scoped>
</style>
