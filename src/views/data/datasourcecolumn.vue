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
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/data/datasourcecolumn";
  import {mapGetters} from "vuex";

  export default {
    props: ['isShow','modelId','datasourceId','datasourceName'],
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
          searchShow: false,
          searchMenuSpan: 6,
          labelWidth: 150,
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "主键",
              prop: "id",
              hide: true,
              display: false,
              addDisplay: false,
              editDisplay: false,
              rules: [{
                required: true,
                message: "请输入主键",
                trigger: "blur"
              }]
            },
            {
              label: "名称",
              prop: "code",
              search: true,
              width: 150,
              rules: [{
                required: true,
                message: "请输入编码",
                trigger: "blur"
              }]
            },
            {
              label: "类型",
              prop: "type",
              width: 70,
              type: "select",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=tableColumnType",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请选择类型",
                trigger: "blur"
              }]
            },
            {
              label: "长度",
              prop: "length",
              width: 60,
              rules: [{
                required: false,
                message: "请输入长度",
                trigger: "blur"
              }]
            },
            {
              label: "排序",
              prop: "sort",
              width: 60,
              rules: [{
                required: false,
                message: "请输入排序",
                trigger: "blur"
              }]
            },
            {
              label: "注释",
              prop: "name",
              width: 150,
              search: true,
              rules: [{
                required: true,
                message: "请输入名称",
                trigger: "blur"
              }]
            },
            {
              label: "模型",
              prop: "modelId",
              type: "select",
              width: 120,
              search: true,
              dicUrl: "/api/idevelop-data/datasource/model/select?current=1&size=10",
              props: {
                label: "name",
                value: "id"
              },
              slot: true,
              rules: [{
                required: true,
                message: "请选择模型",
                trigger: "blur"
              }]
            },
            {
              label: "模型名称",
              prop: "modelName",
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              hide: true,
              rules: [{
                required: false,
                message: "请输入模型名称",
                trigger: "blur"
              }]
            },
            {
              label: "数据源",
              width: 120,
              prop: "datasourceId",
              type: "select",
              search: true,
              dicUrl: "/api/idevelop-develop/datasource/select?current=1&size=10",
              props: {
                label: "name",
                value: "id"
              },
              slot: true,
              rules: [{
                required: true,
                message: "请选择数据源",
                trigger: "blur"
              }]
            },
            {
              label: "数据源名称",
              prop: "datasourceName",
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              hide: true,
              rules: [{
                required: false,
                message: "请输入数据源名称",
                trigger: "blur"
              }]
            },
            {
              label: "规则",
              prop: "ruleId",
              type: "select",
              hide: true,
              width: 150,
              dicUrl: "/api/idevelop-data/rulescheck/select?current=1&size=100",
              props: {
                label: "ruleName",
                value: "id"
              },
              change: ({value,column})=>{
                let item = this.ruleSelectHandler(column.prop,value)
                if(item){
                  this.$refs.crud.tableForm.ruleName = item.ruleName||''
                  //规则名称",
                  this.$refs.crud.tableForm.ruleRemark = item.remark||''
                  //"规则要求",
                  this.$refs.crud.tableForm.ruleCode = item.ruleErpression||(item.asDictionary||(item.outResource||item.customMethod))
                }
              },
              rules: [{
                required: false,
                message: "请输入规则id",
                trigger: "blur"
              }]
            },
            {
              label: "规则名称",
              prop: "ruleName",
              width: 150,
              search: true,
              rules: [{
                required: false,
                message: "请输入规则名称",
                trigger: "blur"
              }]
            },
            {
              label: "规则要求",
              prop: "ruleRemark",
              width: 120,
              rules: [{
                required: false,
                message: "请输入规则要求",
                trigger: "blur"
              }]
            },
            {
              label: "规则内容",
              prop: "ruleCode",
              width: 120,
              rules: [{
                required: false,
                message: "请输入规则内容",
                trigger: "blur"
              }]
            },
            {
              label: "cmdb属性名称",
              prop: "cmdbName",
              width: 120,
              rules: [{
                required: false,
                message: "cmdb属性名称",
                trigger: "blur"
              }]
            },
            {
              label: "cmdb属性Id",
              prop: "cmdbId",
              width: 120,
              rules: [{
                required: false,
                message: "请输入cmdbId",
                trigger: "blur"
              }]
            },
            {
              label: "cmdb同步",
              prop: "cmdbFlag",
              search: true,
              width: 100,
              type: "radio",
              dicData: [{label: "不需要", value: '0'}, {label: "需要", value: '1'}],
              rules: [{
                required: false,
                message: "是否需要cmdb同步，0不需要 1需要 cmdb_flag cmdbFlag",
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
          addBtn: this.vaildData(this.permission.datasourcecolumn_add, false),
          viewBtn: this.vaildData(this.permission.datasourcecolumn_view, false),
          delBtn: this.vaildData(this.permission.datasourcecolumn_delete, false),
          editBtn: this.vaildData(this.permission.datasourcecolumn_edit, false)
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
    created() {
      //弹框
      if(this.modelId){
        this.query.modelId = this.modelId||'';
        this.query.datasourceId = this.datasourceId||''
      }
      //参数
      if(this.$route.query.modelId){
        this.query.modelId = this.$route.query.modelId||'';
        this.query.datasourceId = this.$route.query.datasourceId||''
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
        }else{
          //弹框
          if(this.modelId){
            this.form.modelId = this.modelId||'';
            this.form.datasourceId = this.datasourceId||''
            this.form.datasourceName = this.datasourceName||''
          }
          //参数
          if(this.$route.query.modelId){
            this.form.modelId = this.$route.query.modelId||'';
            this.form.datasourceId = this.$route.query.datasourceId||''
            this.form.datasourceName = this.$route.query.datasourceName||''
          }
        }
        done();
      },
      searchReset() {
        this.query = {};
        //弹框
        if(this.modelId){
          this.query.modelId = this.modelId||'';
          this.query.datasourceId = this.datasourceId||''
        }
        //参数
        if(this.$route.query.modelId){
          this.query.modelId = this.$route.query.modelId||'';
          this.query.datasourceId = this.$route.query.datasourceId||''
        }
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        //弹框
        if(this.modelId){
          this.query.modelId = this.modelId||'';
          this.query.datasourceId = this.datasourceId||''
        }
        //参数
        if(this.$route.query.modelId){
          this.query.modelId = this.$route.query.modelId||'';
          this.query.datasourceId = this.$route.query.datasourceId||''
        }
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
      },
      ruleSelectHandler(dict,value){
        if(dict){
          const bl = this.$refs.crud.DIC.hasOwnProperty(dict);
          if(bl){
            const item = this.$refs.crud.DIC[dict].find(it => it.id===value);
            if(item) {
              return item;
            }
          }
        }
        return {};
      },
    }
  };
</script>

<style lang="scss" scoped>
</style>
