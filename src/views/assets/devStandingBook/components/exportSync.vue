<template>
  <div>
    <!--    导出记录-->
    <!-- 导入对话框 -->
    <el-dialog :modal-append-to-body="false" title="同步结果记录" :visible.sync="isVisible" class="import-dialog">
      <template #title>
        <div style="display: flex;justify-content: space-between;align-content: center;">
          <div class="d_vhl">
            <span>同步结果记录</span>
          </div>
          <div>
            <el-button type="primary" plain @click="getList" style="margin-right: 40px">刷新</el-button>
          </div>
        </div>
      </template>
      <div>
        <el-table
          ref="dataTable"
          stripe
          size="small"
          :data="tableData"
          height="60vh"
          v-loading="tableLoading">
          <el-table-column type="selection" width="30" fixed="left"></el-table-column>
          <el-table-column width="50" type="index" :index="Nindex" label="序号" align="center"></el-table-column>
          <el-table-column prop="importName" label="文件名" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="importNumber" label="导入总数量" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemCount" label="已导入数量" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="importStatus" label="是否完成" width="110" align="center">
            <template slot-scope="scope">
              <span :style="{color:getStatusColor(scope.row.importStatus)}">{{ getStatusText(scope.row.importStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="导入时间" width="180" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleDowload(scope.row)">下载同步结果</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="page.total" :page.sync="page.currentPage" :limit.sync="page.pageSize" @pagination="getList"/>

      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { addNums} from "@/api/assets/devStandingBook";
  import {getList} from "@/api/cmdb/i6000erpimportmaster";
  import {mapGetters} from "vuex";

  export default {
    props: ['isShow'],
    data() {
      return {
        tableData: null,
        tableLoading: false,

        page: {
          currentPage: 1,
          pageSize: 20,
          total: 0,
        },
      };
    },
    computed: {
      ...mapGetters(["userDetail"]),
      isVisible: {
        get() {
          return this.isShow
        },
        set(val) {
          this.$emit("update:isShow", val)
        }
      }

    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.tableLoading = true;
        getList(this.page.currentPage, this.page.pageSize, {
          userId: this.userDetail.userId
        }).then(res => {
          this.page.total = res.data.total;
          this.tableData = res.data.records;
        }).finally(() => {
          this.tableLoading = false;
        });
      },
      Nindex(index) {
        return index + 1 + (this.page.currentPage - 1) * this.page.pageSize;
      },
      handleDowload(row) {


        let params = {
          importUuid: row.importUuid,
        }
        let fileName = row.fileName ? row.fileName : `数据同步结果_${this.getTodayTime()}.xlsx`;
        this.download("/api/idevelop-device/i6000importlog/export", params, fileName);
      },

      getStatusColor(status) {
        if (status == '0') {
          return '#FCC628';
        } else if (status == '1') {
          return '#299B48';
        }
        return '';
      },
      getStatusText(status) {
        if (status == '0') {
          return '同步中...';
        } else if (status == '1') {
          return '同步完成';
        }
        return '';
      },
      getTodayTime(day = 0) {
        let date = new Date()
        date.setDate((new Date().getDate() + day));
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();

        m = (m >= 10) ? m : "0" + m;
        d = (d >= 10) ? d : "0" + d;

        hour = (hour >= 10) ? hour : "0" + hour;
        min = (min >= 10) ? min : "0" + min;

        let timeStr = date.getTime().toString();
        let tRand = timeStr.substring(timeStr.length - 2, timeStr.length);

        return `${y}${m}${d}${hour}${min}${tRand}`;
      },
    },
  }
</script>
<style scoped lang="scss">
  .d_vhl {
    display: flex;
    justify-content: space-between;
    align-items: center
  }
</style>
