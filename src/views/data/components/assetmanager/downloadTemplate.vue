<template>
  <div>
    <!--    下载模板-->
    <!-- 导入对话框 -->
    <el-dialog :modal-append-to-body="false" :visible.sync="isVisible" class="import-dialog">
      <template #title>
        <div style="display: flex;justify-content: space-between;align-content: center;">
          <div class="d_vhl">
            <span>{{ fileType == 'SELF' ? '模板下载':'下载系统模板' }}</span>
          </div>
          <div>
            <el-button type="primary" plain @click="handleUpload">上传</el-button>
            <el-button type="primary" plain @click="getList" style="margin-right: 40px">刷新</el-button>
            <!-- <el-button type="danger" plain @click="handleDelete(null)" style="margin-right: 40px" v-if="tableData&&tableData.length>0">删除</el-button> -->
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
          <!-- <el-table-column type="selection" width="30" fixed="left"></el-table-column> -->
          <el-table-column width="50" type="index" :index="Nindex" label="序号" align="center"></el-table-column>
          <el-table-column prop="fileName" label="文件名" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="上传时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleDowload(scope.row)"> 下载 </el-button>
              <el-button type="text" size="mini" @click="handleDelete(scope.row)" style="color: #ff4949">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <pagination :total="page.total" :page.sync="page.currentPage" :limit.sync="page.pageSize" @pagination="getList"/> -->

      </div>
    </el-dialog>

    <!-- 导入文件弹框 -->
    <uploadModel v-if="openUpload" :isShow.sync="openUpload" @setVal='setValDeviceList'></uploadModel>
  </div>
</template>

<script>
import uploadModel from './uploadModel'
import {templateList, templateSave, templateRemove} from "@/api/assets/ageConfigureManage";
import {downloadInfo, downloadDelete} from "@/api/assets/devStandingBook";
import {mapGetters} from "vuex";

export default {
  props: ['isShow', 'fileType'],
  components: { uploadModel },
  data() {
    return {
      openUpload: false,

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
    handleUpload(){
      this.openUpload = true
    },
    setValDeviceList(obj) {
      // console.log(obj)
      templateSave({
        fileName: obj.originalName,
        filePath: obj.link,
        fileType: this.fileType,
      }).then(res=>{
        this.$message.success('操作成功')
        this.getList()
      })
    },

    getList() {
      this.tableLoading = true;
      templateList({
        fileType: this.fileType
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
    aDowload(url, fileName) {
      const x = new window.XMLHttpRequest();
      x.open('GET', url, true);
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
        }, 1000)
      };
      x.send();
    },
    handleDowload(row) {
      this.aDowload(row.filePath, row.fileName)
      return
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
          }, 1000)
        };
        x.send();
      }
    },

    handleDelete(row) {
      let ids = [];
      ids.push(row.id)

      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return templateRemove({ ids: row.id });
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
