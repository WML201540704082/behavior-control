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
  import {getList, getDetail, add, update, remove} from "@/api/data/devicecolumnunit";
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
          searchMenuSpan: 6,
          labelWidth: 150,
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          editBtn: true,
          addBtn: false,
          selection: true,
          column: [
            {
              label: "主键",
              prop: "id",
              hide: true,
              addDisplay: false,
              editDisplay: false,
              rules: [{
                required: true,
                message: "请输入主键",
                trigger: "blur"
              }]
            },
            {
              label: "模型字段id",
              prop: "colId",
              width: 150,
              rules: [{
                required: true,
                message: "请输入模型字段id",
                trigger: "blur"
              }]
            },
            {
              label: "模型Id",
              prop: "modelId",
              type: "select",
              width: 120,
              search: true,
              dicUrl: "/api/idevelop-data/datasource/model/select?current=1&size=100",
              props: {
                label: "name",
                value: "id"
              },
              slot: true,
              rules: [{
                required: true,
                message: "请输入模型Id",
                trigger: "blur"
              }]
            },
            {
              label: "计算方法",
              prop: "type",
              width: 100,
              type: 'select',
              dicData: [
                {
                  label: "取值",
                  value: "取值"
                },{
                  label: "求和",
                  value: "求和"
                },{
                  label: "拼接json",
                  value: "拼接json"
                },{
                  label: "取最大值",
                  value: "取最大值"
                },{
                  label: "取最小值",
                  value: "取最小值"
                },
              ],
              rules: [{
                required: true,
                message: "请输入类型计算方法：取值、求和、拼接json、取最大值、取最小值",
                trigger: "blur"
              }]
            },
            {
              label: "监控UUID",
              prop: "appId",
              width: 150,
              rules: [{
                required: true,
                message: "请输入监控UUID",
                trigger: "blur"
              }]
            },
            {
              label: "监控类型",
              prop: "appType",
              width: 100,
              rules: [{
                required: true,
                message: "请输入监控类型",
                trigger: "blur"
              }]
            },
            {
              label: "监控指标组",
              prop: "appUnit",
              width: 100,
              rules: [{
                required: true,
                message: "请输入监控指标组",
                trigger: "blur"
              }]
            },
            {
              label: "绑定指标",
              prop: "appUnitHeader",
              width: 100,
              rules: [{
                required: true,
                message: "请输入绑定指标，appType.unitData[0].headers[0] 模型.分组.指标 c_hw_server.faninfo.fanname",
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
              label: "资源类型",
              prop: "resType",
              width: 100,
              type: 'select',
              dicData: [
                {
                  label: "iom",
                  value: "iom"
                },{
                  label: "cmdb",
                  value: "cmdb"
                },
              ],
              rules: [{
                required: true,
                message: "请输入资源类型： cmdb、iom",
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
