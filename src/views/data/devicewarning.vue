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
                   v-if="permission.devicewarning_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button v-if="scope.row.status ==0"
                   type="text"
                   size="small"
                   icon="el-icon-edit"
                   @click="handleCheck(scope.row)">处 置
        </el-button>
      </template>
    </avue-crud>

    <devicewarningcolumnDialog
      v-if="showColumn"
      :isShow="showColumn"
      :basicId="basicId"
      :formDeatil="formDeatil"
      @close="showColumn= false"
      @refreshDataList="refreshDataList">
    </devicewarningcolumnDialog>

    <devBookDetialDialog
      v-if="showCMDBEdit"
      :isShow="showCMDBEdit"
      :ciId="cmdbParams.ciId"
      :configId="cmdbParams.devId"
      :editParams="editParams"
      @refreshDetial="refreshDetial"
      @close="showCMDBEdit= false">
    </devBookDetialDialog>
  </basic-container>
</template>

<script>
import {getList, getDetail, add, update, remove} from "@/api/data/devicewarning";
import {getHardwareDetail} from "@/api/data/hardwarebasic";
import devicewarningcolumnDialog from "@/views/data/components/devicewarning/devicewarningcolumnDialog.vue";
import {mapGetters} from "vuex";
import {isEmpty} from "codemirror/src/util/misc";
import devBookDetialDialog from "@/views/assets/components/devStandingBook/components/devBookDetialDialog.vue";
import {devBookDetail} from "@/api/assets/devStandingBook";
import {getDetail as getHardwarebasictree} from "@/api/device/hardwarebasictree";

export default {
  components: {
    devicewarningcolumnDialog,
    devBookDetialDialog
  },
  data() {
    return {
      showCMDBEdit: false,
      cmdbParams: {
        ciId: null,
        devId: null,
      },
      editParams: {},

      showColumn: false,
      modelId: '',
      datasourceId: '',
      datasourceName: '',
      basicId: null,
      formDeatil: {},
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 20,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        height: '65vh',
        calcHeight: 'auto',
        searchShow: true,
        searchMenuSpan: 6,
        labelWidth: 150,
        menuWidth: 150,
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
            label: "设备编码",
            prop: "basicDeviceCode",
            search: true,
            width: 150,
            rules: [{
              required: true,
              message: "请输入台账设备编码",
              trigger: "blur"
            }]
          },
          {
            label: "设备类型",
            prop: "deviceType",
            search: false,
            width: 120,
            rules: [{
              required: true,
              message: "请输入台账设备类型",
              trigger: "blur"
            }]
          },
          {
            label: "设备名称",
            prop: "deviceName",
            search: true,
            width: 180,
            rules: [{
              required: true,
              message: "请输入台账设备名称",
              trigger: "blur"
            }]
          },
          {
            label: "IP",
            prop: "ip",
            width: 100,
            rules: [{
              required: true,
              message: "请输入IP",
              trigger: "blur"
            }]
          },
          {
            label: "告警时间",
            prop: "createTime",
            width: 160,
          },
          {
            label: "告警内容",
            prop: "warnInfo",
            type: 'textarea',
            minWidth: 360,
            showOverflowTooltip: true,
            rules: [{
              required: true,
              message: "请输入告警内容",
              trigger: "blur"
            }]
          },
          {
            label: "状态",
            prop: "status",
            type: 'select',
            viewDisplay: false,
            search: true,
            width: 100,
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
            label: "规则标识",
            prop: "ruleId",
            type: "select",
            search: false,
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
            search: false,
            hide: true,
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
            search: false,
            hide: true,
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
            hide: true,
            search: false,
            width: 150,
            rules: [{
              required: true,
              message: "请输入台账id",
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
            hide: true,
            rules: [{
              required: true,
              message: "请输入异动状态",
              trigger: "blur"
            }],
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
            label: "来源",
            prop: "sourceType",
            hide: true,
            width: 100,
            rules: [{
              required: true,
              message: "请输入来源",
              trigger: "blur"
            }]
          },
          {
            label: "数据来源",
            prop: "sourceFlag",
            search: false,
            hide: true,
            width: 100,
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
            label: "UUID",
            prop: "cmdbUuid",
            search: false,
            width: 150,
            hide: true,
            rules: [{
              required: true,
              message: "请输入uuid",
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
    },

    deviceCodes() {
      let deviceCodes = [];
      this.selectionList.forEach(ele => {
        deviceCodes.push(ele.basicDeviceCode);
      });
      return deviceCodes.join(",");
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
          return remove(this.deviceCodes);
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
    refreshDataList() {
      this.onLoad(this.page, this.query);
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
        row = this.selectionList[0]
      }

      if (row.sourceFlag === 'CMDB') {
        if (row.ciId === null || row.ciId === '') {
          this.$message.error('模型ID为空');
          return;
        }
        this.getCMDBDetail(row);
      } else {
        //加载台账设备详情
        if (isEmpty(row.basicId)) {
          this.$message.error('台账id为空')
          return;
        }
        getHardwareDetail(row.basicId).then(res => {
          this.basicId = row.basicId;
          this.formDeatil = res.data;
          this.showColumn = true;
        })
      }
    },
    getCMDBDetail(row) {
      let form = {
        ciId: row.ciId,
        ciEntityId: row.basicId,
        needAction: true
      }
      devBookDetail(form).then(res => {
        if (!res.data.Return) {
          this.$alert('暂无详情数据');
          return;
        }
        let resData = res.data.Return;

        let bookDetailForm = {};
        for (let key in resData.attrEntityData) {
          let dataItem = resData.attrEntityData[key];
          bookDetailForm[dataItem.name] = dataItem.actualValueList[0];
        }


        getHardwarebasictree(row.ciId).then(ax => {
          this.cmdbParams = {ciId: row.ciId, devId: row.basicId,};
          this.editParams.ciName = ax.data.ciName;
          this.editParams.devDetail = bookDetailForm;
          this.editParams.devid = row.basicId;
          this.editParams.ciId = row.ciId;
          this.editParams.uuid = row.cmdbUuid;
          this.editParams.colName = row.colName;

          this.showCMDBEdit = true;
        })
      })
    },
    refreshDetial() {
      this.refreshDataList();
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
