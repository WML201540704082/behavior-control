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
  import {getBrandList, getDetail ,update} from "@/api/data/hardwarebrand";
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
          addBtn: false,
          delBtn: false,
          editBtn: true,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "类型ID",
              prop: "typeId",
              rules: [{
                required: false,
                message: "请输入",
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
              label: "上级类型",
              prop: "parentId",
              rules: [{
                required: false,
                message: "请输入上级类型",
                trigger: "blur"
              }]
            },
            {
              label: "类型级别",
              prop: "typeLevel",
              rules: [{
                required: false,
                message: "请输入类型级别",
                trigger: "blur"
              }]
            },
            {
              label: "是否停用",
              prop: "isAvailable",
              rules: [{
                required: false,
                message: "请输入是否停用(0:停用,1:可用)",
                trigger: "blur"
              }],
              dicData:[{
                label: '停用',
                value: 0,
              },{
                label: '可用',
                value: 1,
              }],
            },
            {
              label: "备注信息",
              prop: "typeRemark",
              rules: [{
                required: false,
                message: "请输入备注信息",
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
              label: "状态",
              prop: "state",
              rules: [{
                required: false,
                message: "请输入状态",
                trigger: "blur"
              }]
            },
            {
              label: "区域编码",
              prop: "regionalCode",
              rules: [{
                required: false,
                message: "请输入区域编码",
                trigger: "blur"
              }]
            },
            {
              label: "公司",
              prop: "companyName",
              rules: [{
                required: false,
                message: "请输入公司",
                trigger: "blur"
              }]
            },
            {
              label: "上报人",
              prop: "applicantName",
              hide: true,
              rules: [{
                required: false,
                message: "请输入上报人",
                trigger: "blur"
              }]
            },
            {
              label: "提交时间",
              prop: "acceptDate",
              hide: true,
              rules: [{
                required: false,
                message: "请输入提交时间",
                trigger: "blur"
              }]
            },
            {
              label: "是否通过",
              prop: "isPass",
              hide: true,
              rules: [{
                required: false,
                message: "请输入是否通过",
                trigger: "blur"
              }]
            },
            {
              label: "审核时间",
              prop: "reviewDate",
              hide: true,
              rules: [{
                required: false,
                message: "请输入审核时间",
                trigger: "blur"
              }]
            },
            {
              label: "审核人",
              prop: "reviewMan",
              hide: true,
              rules: [{
                required: false,
                message: "请输入审核人",
                trigger: "blur"
              }]
            },
            {
              label: "设备分类",
              prop: "deviceClass",
              rules: [{
                required: false,
                message: "请输入设备分类",
                trigger: "blur"
              }]
            },
            {
              label: "厂家",
              prop: "brandManufactor",
              rules: [{
                required: false,
                message: "请输入厂家",
                trigger: "blur"
              }]
            },
            {
              label: "品牌",
              prop: "brandMake",
              rules: [{
                required: false,
                message: "请输入品牌",
                trigger: "blur"
              }]
            },
            {
              label: "系列",
              prop: "brandSeries",
              rules: [{
                required: false,
                message: "请输入系列",
                trigger: "blur"
              }]
            },
            {
              label: "型号",
              prop: "brandModel",
              rules: [{
                required: false,
                message: "请输入型号",
                trigger: "blur"
              }]
            },
            {
              label: "设备出厂编码",
              prop: "brandExitCode",
              hide: true,
              rules: [{
                required: false,
                message: "请输入设备出厂编码",
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
        getBrandList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
