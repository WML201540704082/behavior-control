<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="工单编号">
              <el-input placeholder="请输入工单编号" clearable v-model="searchForm.no" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="18" align="right">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button style="margin-right: 5px;" type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" stripe size="small" v-loading="tableLoading">
        <el-table-column label="工单编号" prop="no" align="center" show-overflow-tooltip />
        <el-table-column label="工单状态" prop="recordStatus" align="center" show-overflow-tooltip />
        <el-table-column prop="extAttr1" align="center" label="操作人">
          <template slot-scope="scope">
            {{ !scope.row.extAttr1 ? '-' : scope.row.extAttr1 }}
          </template>
        </el-table-column>
        <el-table-column prop="content"  align="center" :show-overflow-tooltip="true" label="操作内容"></el-table-column>
        <el-table-column prop="createTime" align="center" label="操作时间" />
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.pageNumber"
        :limit.sync="searchForm.pageSize"
        :pageSizes="[10,20,50,100,200]"
        @pagination="getList"/>
    </div>
  </basic-container>
</template>

<script>
  import {mapGetters} from "vuex";
  import { getXSInfoRecordPage } from '@/api/xcnanr/infoRecord'

  export default {
    components: {},
    computed: {
      ...mapGetters(["userInfo", 'userDetail'])
    },
    data() {
      return {
        total: 0,
        tableData: [],
        tableHeight: undefined,
        tableLoading: false,
        searchForm: {
          pageNumber: 1,
          pageSize: 10,
          no: null
        }
      }
    },
    mounted() {
      this.setTableHeight();
      this.getList();
    },
    methods: {
      handleQuery() {
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        this.getList();
      },
      handleReset() {
        this.searchForm.no = null
        this.getList();
      },
      // 设置表格高度
      setTableHeight() {
        // let bodyBox = document.getElementsByClassName('page_body');
        // this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
      },
      getList() {
        this.tableLoading = true;
        getXSInfoRecordPage(this.searchForm).then(res => {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
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

  /deep/.el-date-editor .el-range__icon{
    line-height: 24px!important;
  }
</style>
