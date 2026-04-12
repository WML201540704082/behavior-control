<template>
  <div>
    <!--    导出记录-->
    <!-- 导入对话框 -->
    <el-dialog :modal-append-to-body="false" title="导出记录" :visible.sync="isVisible" class="import-dialog">
      <template #title>
        <div style="display: flex;justify-content: space-between;align-content: center;">
          <div class="d_vhl">
            <span>导出记录</span>
          </div>
          <div>
            <el-button type="primary" plain @click="getList" :style="{marginRight: tableData&&tableData.length>0?'0':'40' +'px'}">刷新</el-button>
            <el-button type="danger" plain @click="handleDelete(null)" style="margin-right: 40px" v-if="tableData&&tableData.length>0">删除</el-button>
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
          <el-table-column prop="fileName" label="文件名" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="导出状态" width="110" align="center">
            <template slot-scope="scope">
              <span :style="{color:getStatusColor(scope.row.status)}">{{ getStatusText(scope.row.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="导出时间" width="180" align="center"></el-table-column>
          <el-table-column prop="nums" label="下载次数" width="110" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleDowload(scope.row)">{{ getDBtnText(scope.row.status) }}</el-button>
              <el-button type="text" size="mini" @click="handleDelete(scope.row)" style="color: #ff4949" v-if="scope.row.status!='1'">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="page.total" :page.sync="page.currentPage" :limit.sync="page.pageSize" @pagination="getList"/>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import {downloadInfo, downloadDelete, addNums} from "@/api/assets/devStandingBook";
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
      downloadInfo(this.page.currentPage, this.page.pageSize, {
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
      if (row.status == '1') {
        //导出中
        this.$message.warning('文件导出中，请耐心等待');
        return;
      }
      if (row.status == '3') {
        //重试
        if (row.exportJson) {
          let params = JSON.parse(row.exportJson);
          if (params) {
            let fileName = `设备台账${this.getTodayTime()}.xlsx`;
            row.status = '1';
            this.download("/api/idevelop-device/hardwarebasic/cmdb/download", {...params, bs: '1', fileId: row.id}, fileName, '下载中，请稍后', false, false, () => {
              this.getList();
            });
          }
        }
        return;
      }
      if (row.link && row.link != '') {
        //走浏览器文件下载
        let fileName = row.fileName ? row.fileName : `设备台账${this.getTodayTime()}.xlsx`;
        const x = new window.XMLHttpRequest();
        x.open('GET', row.link, true);
        x.responseType = 'blob';
        x.onload = () => {
          const url2 = window.URL.createObjectURL(x.response);
          const a = document.createElement('a');
          a.href = url2;
          a.download = fileName;
          a.click();
          a.style.display = 'none';
          const timer = setTimeout(() => {
            a.remove();

            //释放blob对象
            URL.revokeObjectURL(url2);
            clearTimeout(timer);
          }, 1000);
        };
        x.send();

        //统计下载次数

        addNums({id: row.id}).then(res => {
          row.nums++;

          this.$emit('refreshAllNum');
        })
      }
    },

    handleDelete(row) {
      let ids = [];
      if (row == null) {
        //删除选中
        if (this.$refs.dataTable.selection.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        ids = this.$refs.dataTable.selection.map(a => {
          return a.id;
        })
      } else {
        ids.push(row.id)
      }

      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return downloadDelete(ids);
      }).then(() => {
        this.getList();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
    getStatusColor(status) {
      if (status == '1') {
        return '#FCC628';
      } else if (status == '2') {
        return '#299B48';
      } else if (status == '3') {
        return '#E74133';
      }
      return '';
    },
    getStatusText(status) {
      if (status == '1') {
        return '导出中...';
      } else if (status == '2') {
        return '导出成功';
      } else if (status == '3') {
        return '导出失败';
      }
      return '';
    },
    getDBtnText(status) {
      if (status == '1') {
        return '正在导出...'
      } else if (status == '2') {
        return '下载'
      } else if (status == '3') {
        return '重试'
      }
      return null;
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
