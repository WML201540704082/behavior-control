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
  import {getList, getDetail, add, update, remove} from "@/api/data/hardwarecontract";
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
              label: "采购_ID",
              prop: "purchaseId",
              width: 150,
              rules: [{
                required: true,
                message: "请输入采购_ID",
                trigger: "blur"
              }]
            },
            {
              label: "采购方式",
              prop: "piMethod",
              width: 100,
              rules: [{
                required: true,
                message: "请输入采购方式",
                trigger: "blur"
              }]
            },
            {
              label: "设备增加方式",
              prop: "piDevAddMethod",
              rules: [{
                required: true,
                message: "请输入设备增加方式",
                trigger: "blur"
              }]
            },
            {
              label: "设备变动方式",
              prop: "piDevExchangeMethod",
              rules: [{
                required: true,
                message: "请输入设备变动方式",
                trigger: "blur"
              }]
            },
            {
              label: "资产性质",
              prop: "piAssetsProperties",
              rules: [{
                required: true,
                message: "请输入资产性质",
                trigger: "blur"
              }]
            },
            {
              label: "资产原值（元）",
              prop: "piAssetsInitialValue",
              rules: [{
                required: true,
                message: "请输入资产原值（元）",
                trigger: "blur"
              }]
            },
            {
              label: "产权归属",
              prop: "piPropertyOwnership",
              rules: [{
                required: true,
                message: "请输入产权归属",
                trigger: "blur"
              }]
            },
            {
              label: "ERP维护工厂",
              prop: "piErpMp",
              rules: [{
                required: true,
                message: "请输入ERP维护工厂",
                trigger: "blur"
              }]
            },
            {
              label: "ERP_wbs",
              prop: "piErpWbs",
              rules: [{
                required: true,
                message: "请输入ERP_wbs",
                trigger: "blur"
              }]
            },
            {
              label: "采购合同编号",
              prop: "piContractCode",
              rules: [{
                required: true,
                message: "请输入采购合同编号",
                trigger: "blur"
              }]
            },
            {
              label: "采购日期",
              prop: "piOrderDate",
              rules: [{
                required: true,
                message: "请输入采购日期",
                trigger: "blur"
              }]
            },
            {
              label: "供应商",
              prop: "piSuppliers",
              rules: [{
                required: true,
                message: "请输入供应商",
                trigger: "blur"
              }]
            },
            {
              label: "供应商联系人",
              prop: "piSuppliersContact",
              rules: [{
                required: true,
                message: "请输入供应商联系人",
                trigger: "blur"
              }]
            },
            {
              label: "供应商联系电话",
              prop: "piSuppliersPhone",
              rules: [{
                required: true,
                message: "请输入供应商联系电话",
                trigger: "blur"
              }]
            },
            {
              label: "出厂编号",
              prop: "piFactoryNumber",
              rules: [{
                required: true,
                message: "请输入出厂编号",
                trigger: "blur"
              }]
            },
            {
              label: "出厂日期",
              prop: "piFactoryDate",
              rules: [{
                required: true,
                message: "请输入出厂日期",
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
              label: "版本状态",
              prop: "versionState",
              rules: [{
                required: true,
                message: "请输入版本状态",
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
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.hardwarecontract_add, false),
          viewBtn: this.vaildData(this.permission.hardwarecontract_view, false),
          delBtn: this.vaildData(this.permission.hardwarecontract_delete, false),
          editBtn: this.vaildData(this.permission.hardwarecontract_edit, false)
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
