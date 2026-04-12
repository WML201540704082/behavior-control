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
                   v-if="permission.rulescheck_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {getList, getDetail, add, update, remove} from "@/api/data/rulescheck";
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
        height: '630',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        viewBtn: true,
        addBtn: true,
        editBtnIcon: '',
        delBtnIcon: '',
        viewBtnIcon: '',
        selection: true,
        labelWidth: 160,
        column: [
          {
            label: "主键id",
            prop: "id",
            hide: true,
            display: false,
            addDisplay: false,
            editDisplay: false,
            rules: [{
              required: false,
              message: "请输入主键id",
              trigger: "blur"
            }]
          },
          {
            label: "规则名称",
            prop: "ruleName",
            search: true,//搜索项
            rules: [{
              required: true,
              message: "请输入规则名称",
              trigger: "blur"
            }]
          },
          {
            label: "规则类型",
            prop: "ruleType",
            type: 'select',
            rules: [{
              required: true,
              message: "请输入规则类型",
              trigger: "blur"
            }],
            dicData: [  //ruleType    规则类型(0为正则,1为枚举,2为外部,3为自定义)
              {label: "正则", value: '0'},
              {label: "枚举", value: '1'},
              {label: "外部", value: '2'},
              {label: "自定义", value: '3'},
            ]
          },
          {
            label: "正则表达式",
            prop: "ruleErpression",
            rules: [{
              required: false,
              message: "请输入正则表达式",
              trigger: "blur"
            }]
          },
          {
            label: "关联字典",
            prop: "asDictionary",
            rules: [{
              required: false,
              message: "请输入关联字典",
              trigger: "blur"
            }]
          },
          {
            label: "外部资源",
            prop: "outResource",
            rules: [{
              required: false,
              message: "请输入外部资源",
              trigger: "blur"
            }]
          },
          {
            label: "自定义方法名",
            prop: "customMethod",
            rules: [{
              required: true,
              message: "请输入自定义方法名",
              trigger: "blur"
            }]
          },
          {
            label: "错误提示信息",
            prop: "errorMessage",
            width: 300,
            rules: [{
              required: true,
              message: "请输入错误提示信息",
              trigger: "blur"
            }]
          },
          {
            label: "状态",
            prop: "ruleStatus",
            type: "select",
            value: '1',
            rules: [{
              required: true,
              message: "请输入状态",
              trigger: "blur"
            }],
            dicData: [{label: "未启用", value: '0'}, {label: "启用", value: '1'}],
          },
          {
            label: "排序",
            prop: "ruleOrders",
            type: 'number',
            rules: [{
              required: true,
              message: "请输入排序序号",
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
        addBtn: this.vaildData(this.permission.rulescheck_add, false),
        viewBtn: this.vaildData(this.permission.rulescheck_view, false),
        delBtn: this.vaildData(this.permission.rulescheck_delete, false),
        editBtn: this.vaildData(this.permission.rulescheck_edit, false)
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
      if (Object.keys(row).length == 0) {
        //没有修改 不做更新操作
        done();
        return;
      }
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
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
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
