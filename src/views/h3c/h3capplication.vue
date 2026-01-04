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
      <template slot="menuLeft"  slot-scope="scope" >
        <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   @click="onLoadNet()">实时查询
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   @click="onLoadTest()">本地模拟查询
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {getList, getListLocal, getDetail, add, update, remove, getApplications} from "@/api/h3c/h3capplication";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
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
          height: '63vh',
          calcHeight: 210,
          header: false,
          searchShow: true,
          searchMenuSpan: 6,
          labelWidth: 200,
          tip: false,
          border: true,
          index: true,
          addBtn: false,
          viewBtn: true,
          editBtn: true,
          delBtn: false,
          selection: true,
          column: [
            {
              label: "监控类别一级大类",
              prop: "oneCategory",
              with: 100,
              rules: [{
                required: false,
                message: "请输入监控类别，一级大类",
                trigger: "blur"
              }]
            },
            {
              label: "监控类别一级",
              prop: "oneCategoryStr",
              with: 120,
              rules: [{
                required: false,
                message: "请输入监控类别，一级大类名称信息",
                trigger: "blur"
              }]
            },
            {
              label: "监控类别，二级大类",
              prop: "twoCategory",
              with: 100,
              rules: [{
                required: false,
                message: "请输入监控类别，二级大类",
                trigger: "blur"
              }]
            },
            {
              label: "监控类别二级大类",
              prop: "twoCategoryStr",
              with: 120,
              rules: [{
                required: false,
                message: "请输入监控类别，二级大类名称信息",
                trigger: "blur"
              }]
            },
            {
              label: "监控监视的参数实体",
              prop: "appParam",
              hide: true,
              with: 100,
              rules: [{
                required: false,
                message: "请输入监控监视的参数实体",
                trigger: "blur"
              }]
            },
            {
              label: "监控类型",
              prop: "appType",
              search: true,
              with: 100,
              rules: [{
                required: false,
                message: "请输入监控类型，三级大类",
                trigger: "blur"
              }]
            },
            {
              label: "监控类型三级大类",
              with: 150,
              prop: "appTypeStr",
              rules: [{
                required: false,
                message: "请输入监控类型，三级大类名称信息",
                trigger: "blur"
              }]
            },
            {
              label: "监控IP",
              prop: "ip",
              with: 150,
              search: true,
              rules: [{
                required: false,
                message: "请输入监控IP",
                trigger: "blur"
              }]
            },
            {
              label: "监控UUID",
              prop: "id",
              search: true,
              rules: [{
                required: false,
                message: "请输入监控UUID",
                trigger: "blur"
              }]
            },
            {
              label: "可用性",
              prop: "available",
              type: 'select',
              search: true,
              rules: [{
                required: false,
                message: "请输入可用性,0:可用，2:ping不可达，3:协议连接失败，4:应用未管理",
                trigger: "blur"
              }],
              dicData:[{
                label: '可用',
                value: 0,
              },{
                label: 'ping不可达',
                value: 2,
              },{
                label: '协议连接失败',
                value: 3,
              },{
                label: '应用未管理',
                value: 4,
              }],
            },
            {
              label: "配置轮询",
              prop: "configPollStatus",
              type: 'select',
              search: true,
              rules: [{
                required: false,
                message: "请输入配置轮询状态，-1:全选,0:停止采集,1:启用,2:未启用",
                trigger: "blur"
              }],
              dicData:[{
                label: '停止采集',
                value: '0',
              },{
                label: '未启用',
                value: '2',
              },{
                label: '启用',
                value: '1',
              },{
                label: '全选',
                value: '-1',
              }],
            },
            {
              label: "资源异常状态",
              prop: "exceptionStatus",
              type: 'select',
              rules: [{
                required: false,
                message: "请输入资源异常状态，0:正常，1:协议参数存在异常",
                trigger: "blur"
              }],
              dicData:[{
                label: '正常',
                value: 0,
              },{
                label: '协议参数存在异常',
                value: 1,
              }],
            },
            {
              label: "性能数据",
              prop: "appDataOfPerf",
              rules: [{
                required: false,
                message: "请输入性能数据",
                trigger: "blur"
              }]
            },
            {
              label: "对应的访问参数模板ID-名称",
              prop: "accessTemplateIds",
              hide: true,
              rules: [{
                required: false,
                message: "请输入对应的访问参数模板ID-名称，可多个",
                trigger: "blur"
              }]
            },
            {
              label: "是否探测",
              prop: "detectApp",
              rules: [{
                required: false,
                message: "请输入是否探测",
                trigger: "blur"
              }]
            },
            {
              label: "健康状态",
              prop: "health",
              type: 'select',
              search: true,
              rules: [{
                required: false,
                message: "请输入健康状态,0:正常，1:未知(显示:–), 3:通知，4:警告，5:次要, 6:重要, 7:紧急",
                trigger: "blur"
              }],
              dicData:[{
                label: '正常',
                value: 0,
              },{
                label: '未知(显示:–)',
                value: 1,
              },{
                label: '',
                value: 2,
              },{
                label: '通知',
                value: 3,
              },{
                label: '次要',
                value: 4,
              },{
                label: '次要',
                value: 5,
              },{
                label: '重要',
                value: 6,
              },{
                label: '紧急',
                value: 7,
              }],
            },
            {
              label: "是否加入配置轮询",
              prop: "monitorCp",
              type: 'select',
              rules: [{
                required: false,
                message: "请输入是否加入配置轮询,0:不加入，1:加入",
                trigger: "blur"
              }],
              dicData:[{
                label: '不加入',
                value: 0,
              },{
                label: '加入',
                value: 1,
              }],
            },
            {
              label: "是否加入监控",
              prop: "monitorApm",
              type: 'select',
              rules: [{
                required: false,
                message: "请输入是否加入监控,0:不加入，1:加入",
                trigger: "blur"
              }],
              dicData:[{
                label: '不加入',
                value: 0,
              },{
                label: '加入',
                value: 1,
              }],
            },
            {
              label: "agent ID",
              prop: "agentId",
              rules: [{
                required: false,
                message: "请输入agent ID",
                trigger: "blur"
              }]
            },
            {
              label: "操作ID列表",
              prop: "appOperationIds",
              width: 320,
              rules: [{
                required: false,
                message: "请输入操作ID列表",
                trigger: "blur"
              }]
            },
            {
              label: "描述",
              prop: "description",
              rules: [{
                required: false,
                message: "请输入描述",
                trigger: "blur"
              }]
            },
            {
              label: "图片资源路径",
              hide: true,
              prop: "imgUrl",
              rules: [{
                required: false,
                message: "请输入图片资源路径",
                trigger: "blur"
              }]
            },
            {
              label: "monitorSpace",
              prop: "monitorSpace",
              rules: [{
                required: false,
                message: "请输入monitorSpace",
                trigger: "blur"
              }]
            },
            {
              label: "对应的监控模板ID",
              prop: "monitorTemplateId",
              rules: [{
                required: false,
                message: "请输入对应的监控模板ID",
                trigger: "blur"
              }]
            },
            {
              label: "对应的监控模板名称",
              prop: "monitorTemplateName",
              rules: [{
                required: false,
                message: "请输入对应的监控模板名称",
                trigger: "blur"
              }]
            },
            {
              label: "对应的配置轮询模板ID",
              prop: "monitorTemplateCpId",
              rules: [{
                required: false,
                message: "请输入对应的配置轮询模板ID",
                trigger: "blur"
              }]
            },
            {
              label: "对应的配置轮询模板名称",
              prop: "monitorTemplateCpName",
              rules: [{
                required: false,
                message: "请输入对应的配置轮询模板名称",
                trigger: "blur"
              }]
            },
            {
              label: "显示名称",
              prop: "name",
              rules: [{
                required: false,
                message: "请输入显示名称",
                trigger: "blur"
              }]
            },
            {
              label: "站点ID",
              prop: "regionId",
              rules: [{
                required: false,
                message: "请输入站点ID",
                trigger: "blur"
              }]
            },
            {
              label: "管理站IP",
              prop: "regionIp",
              rules: [{
                required: false,
                message: "请输入管理站IP",
                trigger: "blur"
              }]
            },
            {
              label: "站点名称",
              prop: "regionName",
              rules: [{
                required: false,
                message: "请输入站点名称",
                trigger: "blur"
              }]
            },
            {
              label: "资源分组ID列表",
              prop: "resGroupIds",
              rules: [{
                required: false,
                message: "请输入资源分组ID列表",
                trigger: "blur"
              }]
            },
            {
              label: "监控状态",
              prop: "state",
              type: 'select',
              rules: [{
                required: false,
                message: "请输入监控状态 0:未管理, 1:已管理",
                trigger: "blur"
              }],
              dicData:[{
                label: '未管理',
                value: 0,
              },{
                label: '已管理',
                value: 1,
              }],
            },
            {
              label: "配置轮询纳管状态",
              prop: "stateCp",
              type: 'select',
              rules: [{
                required: false,
                message: "请输入配置轮询纳管状态 0:未纳管，1:纳管",
                trigger: "blur"
              }],
              dicData:[{
                label: '未纳管',
                value: 0,
              },{
                label: '纳管',
                value: 1,
              }],
            },
            {
              label: "子型号名称",
              prop: "subModelName",
              rules: [{
                required: false,
                message: "请输入子型号名称",
                trigger: "blur"
              }],
            },
            {
              label: "挂牌状态",
              prop: "suspensionState",
              type: 'select',
              rules: [{
                required: false,
                message: "请输入挂牌状态 0或null: 未挂牌 2: 挂牌中",
                trigger: "blur"
              }],
              dicData:[{
                label: '未挂牌',
                value: 0,
              },{
                label: '未挂牌',
                value: null,
              },{
                label: '未挂牌',
                value: '',
              },{
                label: '挂牌中',
                value: 2,
              }],
            },
            {
              label: "租户ID",
              prop: "tenantId",
              rules: [{
                required: false,
                message: "请输入租户ID",
                trigger: "blur"
              }]
            },
            {
              label: "物理内存利用率",
              prop: "osMemUtil",
              rules: [{
                required: false,
                message: "请输入物理内存利用率",
                trigger: "blur"
              }]
            },
            {
              label: "CPU利用",
              prop: "osCpuUtil",
              rules: [{
                required: false,
                message: "请输入CPU利用",
                trigger: "blur"
              }]
            },
            {
              label: "更新时间",
              prop: "updateTime",
              rules: [{
                required: false,
                message: "请输入更新时间",
                trigger: "blur"
              }]
            },
            {
              label: "logEnable",
              prop: "logEnable",
              rules: [{
                required: false,
                message: "请输入logEnable",
                trigger: "blur"
              }]
            },
            {
              label: "allLogConf",
              prop: "allLogConf",
              rules: [{
                required: false,
                message: "请输入allLogConf",
                trigger: "blur"
              }]
            },
            {
              label: "logModelId",
              prop: "logModelId",
              rules: [{
                required: false,
                message: "请输入logModelId",
                trigger: "blur"
              }]
            },
            {
              label: "logPollCycle",
              prop: "logPollCycle",
              rules: [{
                required: false,
                message: "请输入logPollCycle",
                trigger: "blur"
              }]
            },
            {
              label: "fillIPMIParam",
              prop: "fillIPMIParam",
              rules: [{
                required: false,
                message: "请输入fillIPMIParam",
                trigger: "blur"
              }]
            },
            {
              label: "showVkvmBtn",
              prop: "showVkvmBtn",
              rules: [{
                required: false,
                message: "请输入showVkvmBtn",
                trigger: "blur"
              }]
            },
            {
              label: "thirdParty",
              prop: "thirdParty",
              rules: [{
                required: false,
                message: "请输入thirdParty",
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
          addBtn: this.vaildData(this.permission.h3capplication_add, false),
          viewBtn: this.vaildData(this.permission.h3capplication_view, false),
          delBtn: this.vaildData(this.permission.h3capplication_delete, false),
          editBtn: this.vaildData(this.permission.h3capplication_edit, false)
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
        })
      },
      onLoadNet(params = {}) {
        this.loading = true;
        getApplications(this.page.currentPage, this.page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        }).catch(() => { this.loading = false });
      },
      onLoadTest(params = {}) {
        this.loading = true;
        getListLocal(this.page.currentPage, this.page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        }).catch(() => { this.loading = false });
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>
