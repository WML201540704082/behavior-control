<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
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
                   @click="onLoadOnline()">实时查询
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getListCommon, getApplications,updatecommon} from "@/api/h3c/h3capplication";
  import {mapGetters} from "vuex";

  export default {
    props: ["modelId","h3cModelType","h3cModelId"],
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
          labelWidth: 200,
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          editBtn: true,
          delBtn: false,
          addBtn: false,
          selection: true,
          column: [
            {
              label: "监控类别一级大类",
              prop: "one_category",
              with: 100,
              rules: [{
                required: false,
                message: "请输入监控类别，一级大类",
                trigger: "blur"
              }]
            },
            {
              label: "监控类别一级",
              prop: "one_category_str",
              with: 120,
              rules: [{
                required: false,
                message: "请输入监控类别，一级大类名称信息",
                trigger: "blur"
              }]
            },
            {
              label: "监控类别，二级大类",
              prop: "two_category",
              with: 100,
              rules: [{
                required: false,
                message: "请输入监控类别，二级大类",
                trigger: "blur"
              }]
            },
            {
              label: "监控类别二级大类",
              prop: "two_category_str",
              with: 120,
              rules: [{
                required: false,
                message: "请输入监控类别，二级大类名称信息",
                trigger: "blur"
              }]
            },
            {
              label: "监控类型",
              prop: "app_type",
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
              prop: "app_type_str",
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
              label: "显示名称",
              prop: "name",
              rules: [{
                required: false,
                message: "请输入显示名称",
                trigger: "blur"
              }]
            },
            {
              label: "cmdbCid",
              prop: "cmdb_cid",
              rules: [{
                required: false,
                message: "请输入cmdbCid",
                trigger: "blur"
              }]
            },
            {
              label: "cmdb模型编码",
              prop: "cmdb_code",
              rules: [{
                required: false,
                message: "请输入cmdb模型编码",
                trigger: "blur"
              }]
            },
            {
              label: "cmdb模型名称",
              prop: "cmdb_name",
              rules: [{
                required: false,
                message: "请输入cmdb模型名称",
                trigger: "blur"
              }]
            },
            {
              label: "cmdb_id",
              prop: "cmdb_id",
              rules: [{
                required: false,
                message: "请输入cmdbId",
                trigger: "blur"
              }]
            },
            {
              label: "cmdb_uuid",
              prop: "cmdb_uuid",
              rules: [{
                required: false,
                message: "请输入cmdbUuid",
                trigger: "blur"
              }]
            },
            {
              label: "监控监视的参数实体",
              prop: "app_param",
              hide: true,
              with: 100,
              rules: [{
                required: false,
                message: "请输入监控监视的参数实体",
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
      rowUpdate(row, index, done, loading) {
        //修改
        row.modelId = this.modelId
        updatecommon(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
           
          loading();
        });
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
        params.modelId = this.modelId;
        params.app_type = this.h3cModelType;
        //加载本地数据
        getListCommon(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        }).catch((error) => {
           
          this.loading = false;
        });
      },
      onLoadOnline(params = {}) {
        //加载在线实时数据
        this.loading = true;
        params.modelId = this.modelId;
        params.appType = this.h3cModelType;
        getApplications(this.page.currentPage, this.page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        }).catch((error) => {
           
          this.loading = false;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>
