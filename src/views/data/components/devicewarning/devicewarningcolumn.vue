<template>
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
    <template slot="menu" slot-scope="scope">
      <el-button type="text"
                 size="small"
                 icon="el-icon-edit"
                 @click="handleCheck(scope.row)">处 理
      </el-button>
    </template>
  </avue-crud>
</template>

<script>
import {getList, getDetail, add, update, remove} from "@/api/data/devicewarning";
import {mapGetters} from "vuex";

export default {
  props: ['basicId', 'editHandel'],
  data() {
    return {
      showColumn: false,
      modelId: '',
      datasourceId: '',
      datasourceName: '',
      formDeatil: {},
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
        height: '350',
        header: false,
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 8,
        labelWidth: 150,
        tip: false,
        border: true,
        index: true,
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        selection: true,
        menuWidth: 100,
        column: [
          {
            label: "",
            prop: "id",
            hide: true,
            rules: [{
              required: true,
              message: "请输入",
              trigger: "blur"
            }]
          },
          {
            label: "规则标识",
            prop: "ruleId",
            type: "select",
            dicUrl: "/api/idevelop-data/rulescheck/select?current=1&size=100",
            props: {
              label: "ruleName",
              value: "id"
            },
            hide: true,
            rules: [{
              required: true,
              message: "请输入规则标识",
              trigger: "blur"
            }]
          },
          {
            label: "规则名称",
            prop: "ruleName",
            width: 150,
            rules: [{
              required: true,
              message: "请输入规则名称",
              trigger: "blur"
            }]
          },
          {
            label: "规则描述",
            prop: "ruleContent",
            hide: true,
            rules: [{
              required: true,
              message: "请输入规则描述",
              trigger: "blur"
            }]
          },
          {
            label: "字段名称",
            prop: "colName",
            width: 150,
            rules: [{
              required: true,
              message: "请输入字段名称",
              trigger: "blur"
            }]
          },
          {
            label: "字段描述",
            prop: "colContent",
            hide: true,
            rules: [{
              required: true,
              message: "请输入字段描述",
              trigger: "blur"
            }]
          },
          {
            label: "字段Id",
            prop: "colId",
            hide: true,
            rules: [{
              required: true,
              message: "请输入字段Id",
              trigger: "blur"
            }]
          },
          {
            label: "台账id",
            prop: "basicId",
            width: 150,
            rules: [{
              required: true,
              message: "请输入台账id",
              trigger: "blur"
            }]
          },
          {
            label: "设备编码",
            prop: "basicDeviceCode",
            width: 150,
            rules: [{
              required: true,
              message: "请输入台账设备编码",
              trigger: "blur"
            }]
          },
          {
            label: "IP",
            prop: "ip",
            width: 100,
            hide: true,
            rules: [{
              required: true,
              message: "请输入IP",
              trigger: "blur"
            }]
          },
          {
            label: "MAC",
            prop: "mac",
            width: 120,
            hide: true,
            rules: [{
              required: true,
              message: "请输入MAC",
              trigger: "blur"
            }]
          },
          {
            label: "异动状态",
            prop: "warnState",
            width: 80,
            rules: [{
              required: true,
              message: "请输入异动状态",
              trigger: "blur"
            }],
          },
          {
            label: "告警时间",
            prop: "createTime",
            width: 90,
            hide: true,
          },
          {
            label: "告警等级",
            prop: "warnLevel",
            hide: true,
            rules: [{
              required: true,
              message: "请输入告警等级",
              trigger: "blur"
            }]
          },
          {
            label: "告警失效时间",
            prop: "recoverTime",
            hide: true,
            rules: [{
              required: true,
              message: "请输入告警失效时间",
              trigger: "blur"
            }]
          },
          {
            label: "状态",
            prop: "status",
            type: 'select',
            viewDisplay: false,
            width: 80,
            rules: [{
              required: true,
              message: "请输入异动状态",
              trigger: "blur"
            }],
            change: ({value, column}) => {
              let item = this.ruleSelectHandler(column.prop, value)
              if (item) {
                this.$refs.crud.tableForm.warnState = item.label || ''
              }
            },
            dicData: [{
              label: '未处置',
              value: 0,
            }, {
              label: '已忽略',
              value: 2,
            }, {
              label: '已处置',
              value: 1,
            }],
          },
          {
            label: "来源",
            prop: "sourceType",
            width: 100,
            hide: true,
            rules: [{
              required: true,
              message: "请输入来源",
              trigger: "blur"
            }]
          },
          {
            label: "二级单位",
            prop: "basicUnitSecond",
            hide: true,
            rules: [{
              required: true,
              message: "请输入二级单位",
              trigger: "blur"
            }]
          },
          {
            label: "三级单位",
            prop: "basicUnitThird",
            hide: true,
            rules: [{
              required: true,
              message: "请输入三级单位",
              trigger: "blur"
            }]
          },
          {
            label: "处置人",
            prop: "updateBy",
            hide: true,
            rules: [{
              required: true,
              message: "请输入处置人",
              trigger: "blur"
            }]
          },
          {
            label: "处置人名称",
            prop: "updateName",
            hide: true,
            rules: [{
              required: true,
              message: "请输入处置人名称",
              trigger: "blur"
            }]
          },
          {
            label: "忽略使用的字段",
            prop: "ignoreCol",
            hide: true,
            rules: [{
              required: true,
              message: "请输入忽略使用的字段",
              trigger: "blur"
            }]
          },
          {
            label: "区域编码",
            prop: "regionCode",
            hide: true,
            rules: [{
              required: true,
              message: "请输入区域编码",
              trigger: "blur"
            }]
          },
          {
            label: "告警内容",
            prop: "warnInfo",
            type: 'textarea',
            width: 360,
            hide: true,
            rules: [{
              required: true,
              message: "请输入告警内容",
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
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.devicewarning_add, false),
        viewBtn: this.vaildData(this.permission.devicewarning_view, true),
        delBtn: this.vaildData(this.permission.devicewarning_delete, false),
        editBtn: this.vaildData(this.permission.devicewarning_edit, false)
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
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {basicId: this.basicId}) {
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
    ruleSelectHandler(dict, value) {
      if (dict) {
        const bl = this.$refs.crud.DIC.hasOwnProperty(dict);
        if (bl) {
          const item = this.$refs.crud.DIC[dict].find(it => it.id === value);
          if (item) {
            return item;
          }
        }
      }
      return {};
    },
    handleCheck(row) {
      //处理
      if (!row) {
        //编辑属性字段
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        if (this.selectionList.length > 1) {
          this.$message.warning("请选择一条数据");
          return;
        }
        row = this.selectionList[0];
      }
      if (this.editHandel) {
        this.editHandel();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
