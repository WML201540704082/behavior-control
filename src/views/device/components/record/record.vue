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
               @date-change="handleDateChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.deviceRecord_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <!-- -->
      <template slot="menu" slot-scope="scope">
        <el-button type="text"
                   size="small"
                   icon="el-icon-view"
                   v-if="permission.deviceRecord_edit"
                   @click="handleView(scope.row,scope.index)">查看
        </el-button>
        <el-button type="text"
                   size="small"
                   icon="el-icon-edit"
                   v-if="permission.deviceRecord_edit && scope.row.status==0"
                   @click="handleEdit(scope.row,scope.index)">编辑
        </el-button>
        <el-button type="text"
                   size="small"
                   icon="el-icon-delete"
                   v-if="permission.deviceRecord_delete && scope.row.status==0"
                   @click="handleDelete(scope.row,scope.index)">删除
        </el-button>
      </template>

    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/device/devicerecord";
  import {mapGetters,mapState} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        queryDate: {},
        loading: true,
        username: "",
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
          dialogFullscreen: false,
          dialogWidth:  "90%",
          searchMenuSpan: 6,
          searchLabelWidth: 90,
          tip: false,
          border: true,
          index: true,
          dateBtn: true,
          viewBtn: true,
          selection: false,
          column: [
            /*{
              label: "主键",
              prop: "id",
              hide: true,
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              rules: [{
                required: true,
                message: "请输入主键",
                trigger: "blur"
              }]
            },*/
            {
              label: "建档编号",
              prop: "filingNo",
              addDisabled: false,
              editDisabled: true,
              search: true,
              span: 8,
              rules: [{
                required: true,
                message: "请输入建档编号",
                trigger: "blur"
              }]
            },
            {
              label: "工单状态",
              prop: "status",
              addDisplay: false,
              editDisabled: true,
              search: true,
              span: 8,
              type: "radio",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=work_order_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入工单状态",
                trigger: "blur"
              }]
            },
            // {
            //   label: "WBS项目",
            //   prop: "wbsProject",
            //   rules: [{
            //     required: true,
            //     message: "请输入WBS项目",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "WBS元素",
              prop: "wbsElement",
              search: true,
              span: 8,
              type: "select",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=wbs_elt",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入WBS元素",
                trigger: "blur"
              }]
            },
            {
              label: "ERP工单状态",
              prop: "erpStatus",
              addDisplay: false,
              editDisabled: true,
              search: true,
              span: 8,
              type: "radio",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=erp_state",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入ERP同步状态",
                trigger: "blur"
              }]
            },
            {
              label: "设备分类",
              prop: "deviceCategory",
              hide: true,
              span: 8,
              type: "select",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=deviceCategory",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入设备分类",
                trigger: "blur"
              }]
            },
            {
              label: "设备类型",
              prop: "deviceType",
              hide: true,
              span: 8,
              type: "select",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=deviceType",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入设备类型",
                trigger: "blur"
              }]
            },
            {
              label: "设备数量",
              prop: "deviceNum",
              type: "number",
              hide: true,
              span: 8,
              value: 0,
              max: 9999,
              min: 0,
              precision: 0,
              step: 1,
              rules: [{
                required: false,
                message: "请输入设备数量",
                trigger: "blur"
              }]
            },
            {
              label: "设备增加方式",
              prop: "deviceAddType",
              search: true,
              hide: true,
              span: 8,
              type: "select",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=device_add_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入设备增加方式",
                trigger: "blur"
              }]
            },
            {
              label: "设备变动方式",
              prop: "deviceChangeType",
              search: true,
              hide: true,
              span: 8,
              type: "select",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=device_change_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入设备变动方式",
                trigger: "blur"
              }]
            },
            {
              label: "安装地点",
              prop: "installationSite",
              hide: true,
              span: 8,
              rules: [{
                required: false,
                message: "请输入安装地点",
                trigger: "blur"
              }]
            },
            {
              label: "设备状态",
              prop: "deviceStatus",
              hide: true,
              span: 8,
              type: "radio",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=deviceStatus",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入设备状态",
                trigger: "blur"
              }]
            },
            {
              label: "投运日期",
              prop: "oprtDate",
              type: "date",
              hide: true,
              span: 8,
              rules: [{
                required: false,
                message: "请输入投运日期",
                trigger: "blur"
              }]
            },
            {
              label: "采购日期",
              prop: "procureDate",
              type: "date",
              hide: true,
              span: 8,
              rules: [{
                required: false,
                message: "请输入采购日期",
                trigger: "blur"
              }]
            },
            {
              label: "设备名称",
              prop: "deviceName",
              hide: true,
              span: 8,
              rules: [{
                required: false,
                message: "请输入设备名称",
                trigger: "blur"
              }]
            },
            {
              label: "标准全称",
              prop: "fullName",
              hide: true,
              span: 8,
              rules: [{
                required: true,
                message: "请输入标准全称",
                trigger: "blur"
              }]
            },
            {
              label: "是否同步ERP",
              prop: "isToErp",
              hide: true,
              span: 8,
              type: "radio",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=yes_no",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入是否同步ERP",
                trigger: "blur"
              }]
            },
            {
              label: "品牌",
              prop: "brand",
              hide: true,
              span: 8,
              type: "select",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=brand",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入品牌",
                trigger: "blur"
              }]
            },
            {
              label: "系列",
              prop: "series",
              hide: true,
              span: 8,
              type: "select",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=series",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入系列",
                trigger: "blur"
              }]
            },
            {
              label: "型号",
              prop: "deviceModel",
              hide: true,
              span: 8,
              type: "select",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=deviceModel",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入型号",
                trigger: "blur"
              }]
            },
            {
              label: "铭牌号",
              prop: "nameplateNo",
              hide: true,
              span: 8,
              rules: [{
                required: false,
                message: "请输入铭牌号",
                trigger: "blur"
              }]
            },
            {
              label: "制造商",
              prop: "manufacturer",
              hide: true,
              span: 8,
              rules: [{
                required: false,
                message: "请输入制造商",
                trigger: "blur"
              }]
            },
            {
              label: "制造国家地区",
              prop: "maintenanceCountry",
              hide: true,
              span: 8,
              rules: [{
                required: false,
                message: "请输入制造国家与地区",
                trigger: "blur"
              }]
            },
            {
              label: "出厂日期",
              prop: "factoryDate",
              type: "date",
              hide: true,
              span: 8,
              rules: [{
                required: false,
                message: "请输入出厂日期",
                trigger: "blur"
              }]
            },

            {
              label: "使用保管部门",
              prop: "useKeepDept",
              search: true,
              span: 8,
              type: "tree",
              dicUrl: "/api/idevelop-system/dept/tree",
              props: {
                label: "title",
                value: "value"
              },
              rules: [{
                required: false,
                message: "请输入使用保管部门",
                trigger: "blur"
              }]
            },
            {
              label: "实物保管部门",
              prop: "entityKeepDept",
              type: "tree",
              span: 8,
              dicUrl: "/api/idevelop-system/dept/tree",
              props: {
                label: "title",
                value: "value"
              },
              rules: [{
                required: false,
                message: "请输入实物保管部门",
                trigger: "blur"
              }]
            },
            {
              label: "产权单位",
              prop: "ownerUnit",
              hide: true,
              span: 8,
              type: "tree",
              dicUrl: "/api/idevelop-system/dept/tree",
              props: {
                label: "title",
                value: "value"
              },
              rules: [{
                required: false,
                message: "请输入产权单位",
                trigger: "blur"
              }]
            },
            {
              label: "产权部门",
              prop: "propertyDept",
              hide: true,
              span: 8,
              type: "tree",
              dicUrl: "/api/idevelop-system/dept/tree",
              props: {
                label: "title",
                value: "value"
              },
              rules: [{
                required: false,
                message: "请输入产权部门",
                trigger: "blur"
              }]
            },
            {
              label: "使用保管人",
              prop: "useKeepPerson",
              hide: true,
              span: 8,
              rules: [{
                required: false,
                message: "请输入使用保管人",
                trigger: "blur"
              }]
            },
            {
              label: "功能位置",
              prop: "funLocation",
              hide: true,
              span: 8,
              type: "select",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=funLocation",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入功能位置",
                trigger: "blur"
              }]
            },
            {
              label: "工厂区域",
              prop: "factoryArea",
              hide: true,
              span: 8,
              editDisabled: true,
              type: "select",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=factoryArea",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入工厂区域",
                trigger: "blur"
              }]
            },
            {
              label: "维护工厂",
              prop: "maintenanceFactory",
              hide: true,
              span: 8,
              type: "select",
              dicUrl: "/api/idevelop-system/dict/dictionary?code=maintenanceFactory",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入维护工厂",
                trigger: "blur"
              }]
            },
            {
              label: "线站标识",
              prop: "lineStation",
              span: 8,
              hide: true,
              rules: [{
                required: false,
                message: "请输入线站标识",
                trigger: "blur"
              }]
            },
            {
              label: "受理人",
              prop: "receiver",
              span: 8,
              addDisabled: true,
              editDisabled: true,
              value: "",
              hide: true,
              rules: [{
                required: false,
                message: "请输入受理人(工单发起人)",
                trigger: "blur"
              }]
            },
            {
              label: "创建时间",
              prop: "createTime",
              hide: false,
              span: 8,
              minRows: 3,
              search: false,
              addDisplay: false,
              editDisabled: true,
              type: "datetime",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
              rules: [{
                required: true,
                message: "请输入创建时间",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "remark",
              span: 16,
              minRows: 3,
              hide: true,
              type: "textarea"
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      ...mapState({
        userInfo: state => state.user.userInfo
      }),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.deviceRecord_add, false),
          viewBtn: this.vaildData(this.permission.deviceRecord_view, false),
          delBtn: this.vaildData(this.permission.deviceRecord_delete, false),
          editBtn: this.vaildData(this.permission.deviceRecord_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
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
        this.$confirm("点击确认将永久删除数据且无法恢复，请谨慎选择。","确定将选择数据删除?", {
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
        this.query.minDate = this.queryDate.minDate||'';
        this.query.maxDate = this.queryDate.maxDate||'';
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      handleDateChange(value) {
        if (value && !!value.value[0]) {
          this.queryDate.minDate = value.value[0];
          this.queryDate.maxDate = value.value[1];
          if (this.queryDate.minDate > this.queryDate.maxDate) {
            this.queryDate.maxDate = this.queryDate.minDate;
          }
        }
      },
      handleView(row,idx) {
        this.form = row;
        this.$refs.crud.rowView(row,idx);
      },
      handleEdit(row,idx) {
        this.form = row;
        this.$refs.crud.rowEdit(row,idx);
      },
    }
  };
</script>

<style lang="scss" scoped>
</style>
