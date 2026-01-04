<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <div style="margin-bottom: 10px" v-show="searchId">
        <span>巡视对象 / </span>
        <span>{{ month }}</span>
      </div>
      <el-form ref="searchForm" :model="searchForm" label-width="130px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="巡视对象" prop="objectName">
              <el-input
                placeholder="请输入巡视对象"
                clearable
                v-model="searchForm.objectName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-top: 5px;margin-left: 5px">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button style="margin-right: 5px;" type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-table
        ref="arrtTable"
        :data="tableData"
        :height="tableHeight"
        stripe
        size="small"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="巡视对象" prop="objectName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="巡视次数" prop="total" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="反馈统计" align="center">
          <el-table-column label="总数" prop="feedbackTotal" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="正常" prop="feedbackNormalCount" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="缺陷" prop="feedbackAbnormalCount" align="center" show-overflow-tooltip/>
        </el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" width="100" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <el-link type="primary" size="mini" :underline="false" @click="handleSee(scope.row)">
                <span class="s_lt">查看报告</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        :pageSizes="[10,20,50,100,200]"
        @pagination="getList"/>
    </div>

  </basic-container>
</template>

<script>
  import {mapGetters} from "vuex";
  import {getInspectionDetailList} from "@/api/xcnanr/statisticalAnalysis"

  export default {
    name: 'AccessControl',
    components: {},
    computed: {
      ...mapGetters(["permission", 'userDetail'])
    },
    data() {
      return {
        workOrderParams: {
          isShow: false,
          type: null,
          formDetial: {}
        },
        selectionList: [],
        searchForm: {
          current: 1,
          size: 10,
          statId: null,
          objectName: null
        },
        total: 0,
        searchId: null,
        tableData: [],
        tableHeight: undefined,
        tableLoading: false,
        roomData: null,
        roomAcVersionList:[],
        roomAcBrandList:[],
        roomDescription: null,
        companyId: null,
        companyName: null
      }
    },
    created() {
      this.searchId = this.$route.query.id
      this.companyId = this.$route.query.companyId
      this.companyName = this.$route.query.companyName
      this.month = this.$route.query.month
      this.getList()
    },
    mounted() {
      this.setPageContentHeight();
      this.setTableHeight();
    },
    methods: {
      refreshData(){
        this.getList()
      },
      selectionChange(selection) {
        //点击选择事件
        this.selectionList = selection.map(item => item.id);
      },
      handleQuery() {
        this.searchForm.current = 1;
        this.getList();
      },
      handleReset() {
        this.searchForm.objectName = undefined;
        this.getList();
      },
      // 设置表格高度
      setTableHeight() {
        let bodyBox = document.getElementsByClassName('page_body');
        this.tableHeight = (bodyBox[0].offsetHeight - 100) + 'px'
      },
      getList() {
        this.searchForm.statId = this.searchId
        this.tableLoading = true;
        getInspectionDetailList(this.searchForm).then(res => {
          this.tableData = res.data;
          this.total = res.data.total;
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      handleSee(row) {
        let queryInfo = {
          inspectionMonth: this.month,
          companyId: this.companyId,
          companyName: this.companyName,
          deptName: '',
          objectId: row.objectId,
          objectName: row.objectName,
          type: row.type
        }
        // queryInfo = {
        //   inspectionMonth: '2024-12',
        //   companyId: '1745022609004736513',
        //   companyName: '国网山东省电力公司',
        //   deptName: '',
        //   objectId: '217809d2048f42e8b1a3da60a895d23e',
        //   objectName: '历城区中心机房',
        //   type: 1
        // }
        this.$router.push({
          path: '/xcnanr/inspectReport/',
          query: queryInfo
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-link {
    font-size: 13px;
  }

  .s_lt {
    font-size: 12px;
  }
</style>
