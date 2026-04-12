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
  import {getList, getDetail} from "@/api/data/hardwareservice";
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
          labelWidth: 150,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          addBtn: false,
          editBtn: false,
          delBtn: false,
          selection: true,
          column: [
            {
              label: "服务ID",
              prop: "serviceId",
              hide: true,
              rules: [{
                required: true,
                message: "请输入服务ID",
                trigger: "blur"
              }]
            },
            {
              label: "设备编码",
              prop: "basicDeviceCode",
              width: 150,
              rules: [{
                required: true,
                message: "请输入设备编码",
                trigger: "blur"
              }]
            },
            {
              label: "售后服务到期时间",
              prop: "siExpirationDate",
              hide: true,
              rules: [{
                required: true,
                message: "请输入售后服务到期时间",
                trigger: "blur"
              }]
            },
            {
              label: "服务合同编号",
              prop: "siContractCode",
              width: 110,
              rules: [{
                required: true,
                message: "请输入服务合同编号",
                trigger: "blur"
              }]
            },
            {
              label: "服务商",
              prop: "siServicer",
              width: 120,
              rules: [{
                required: true,
                message: "请输入服务商",
                trigger: "blur"
              }]
            },
            {
              label: "服务级别",
              prop: "siServiceClass",
              hide: true,
              rules: [{
                required: true,
                message: "请输入服务级别",
                trigger: "blur"
              }]
            },
            {
              label: "服务开始日期",
              prop: "siStartDate",
              hide: true,
              rules: [{
                required: true,
                message: "请输入服务开始日期",
                trigger: "blur"
              }]
            },
            {
              label: "服务到期日期",
              prop: "siEndDate",
              hide: true,
              rules: [{
                required: true,
                message: "请输入服务到期日期",
                trigger: "blur"
              }]
            },
            {
              label: "服务商联系人",
              prop: "siServicerContact",
              width: 120,
              rules: [{
                required: true,
                message: "请输入服务商联系人",
                trigger: "blur"
              }]
            },
            {
              label: "服务商联系电话",
              prop: "siServicerPhone",
              width: 120,
              rules: [{
                required: true,
                message: "请输入服务商联系电话",
                trigger: "blur"
              }]
            },
            {
              label: "审核状态",
              prop: "siAuditStatus",
              hide: true,
              rules: [{
                required: true,
                message: "请输入审核状态",
                trigger: "blur"
              }]
            },
            {
              label: "最后审核日期",
              prop: "siAuditLastdate",
              hide: true,
              rules: [{
                required: true,
                message: "请输入最后审核日期",
                trigger: "blur"
              }]
            },
            {
              label: "领用部门",
              prop: "miUseDep",
              rules: [{
                required: true,
                message: "请输入领用部门",
                trigger: "blur"
              }]
            },
            {
              label: "插入时间",
              prop: "createDate",
              hide: true,
              rules: [{
                required: true,
                message: "请输入插入时间",
                trigger: "blur"
              }]
            },
            {
              label: "修改时间",
              prop: "updateDate",
              hide: true,
              rules: [{
                required: true,
                message: "请输入修改时间",
                trigger: "blur"
              }]
            },
            {
              label: "设备版本",
              prop: "devVersion",
              hide: true,
              rules: [{
                required: true,
                message: "请输入设备版本",
                trigger: "blur"
              }]
            },
            {
              label: "版本状态",
              prop: "versionState",
              hide: true,
              width: 100,
              type: 'checkbox',
              dicData:[{
                label: '不显示',
                value: '0',
              },{
                label: '显示',
                value: '1',
              }],
              rules: [{
                required: true,
                message: "请输入版本状态0：不显示；1：显示",
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
              hide: true,
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
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.serviceId).then(res => {
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
