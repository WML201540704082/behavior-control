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
                   v-if="permission.devicerecordlist_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getDeviceList, getDetail, add, update, remove} from "@/api/device/devicerecordlist";
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
              label: "WBS项目",
              prop: "wbsProject",
              rules: [{
                required: true,
                message: "请输入WBS项目",
                trigger: "blur"
              }]
            },
            {
              label: "WBS元素",
              prop: "wbsElement",
              rules: [{
                required: true,
                message: "请输入WBS元素",
                trigger: "blur"
              }]
            },
            {
              label: "建档编号",
              prop: "filingNo",
              rules: [{
                required: true,
                message: "请输入建档编号",
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
              label: "设备状态",
              prop: "deviceStatus",
              rules: [{
                required: true,
                message: "请输入设备状态",
                trigger: "blur"
              }]
            },
            {
              label: "设备名称",
              prop: "deviceName",
              rules: [{
                required: true,
                message: "请输入设备名称",
                trigger: "blur"
              }]
            },
            {
              label: "设备编码",
              prop: "deviceCode",
              rules: [{
                required: true,
                message: "请输入设备编码",
                trigger: "blur"
              }]
            },
            {
              label: "ERP同步状态",
              prop: "erpStatus",
              rules: [{
                required: true,
                message: "请输入ERP同步状态",
                trigger: "blur"
              }]
            },
            {
              label: "ERP资产编码",
              prop: "erpAssetCode",
              rules: [{
                required: true,
                message: "请输入ERP资产编码",
                trigger: "blur"
              }]
            },
            {
              label: "ERP台账编号",
              prop: "erpAccountCode",
              rules: [{
                required: true,
                message: "请输入ERP台账编号",
                trigger: "blur"
              }]
            },
            {
              label: "资产信息",
              prop: "assetInfo",
              rules: [{
                required: true,
                message: "请输入资产信息",
                trigger: "blur"
              }]
            },
            {
              label: "功能位置",
              prop: "funLocation",
              rules: [{
                required: true,
                message: "请输入功能位置",
                trigger: "blur"
              }]
            },
            {
              label: "硬件配置",
              prop: "hardwareConfig",
              rules: [{
                required: true,
                message: "请输入硬件配置",
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
          addBtn: this.vaildData(this.permission.devicerecordlist_add, false),
          viewBtn: this.vaildData(this.permission.devicerecordlist_view, false),
          delBtn: this.vaildData(this.permission.devicerecordlist_delete, false),
          editBtn: this.vaildData(this.permission.devicerecordlist_edit, false)
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
        getDeviceList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
