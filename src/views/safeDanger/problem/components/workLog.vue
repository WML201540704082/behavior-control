<template>
  <div>
    <el-table border size="mini" stripe :data="activeLogList" :row-style="rowStyle">
      <el-table-column prop="createTime" label="时间"></el-table-column>
      <el-table-column prop="createBy" label="操作人"></el-table-column>
      <el-table-column prop="hiddenLog" label="操作事项"></el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { logList } from "@/api/safeDanger/report";
export default {
  name: "workLog",
  props: {
    detailId: {
      // type: Number,
      require: false
    },
    workflowId: {
      require: false
    }
  },
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        hiddenId: undefined,
      },
      // 总条数
      total: 0,
      // 已办列表表格数据
      activeLogList: [],
      // 弹出层标题
      title: "",
      //遮罩层
      loading: true
    }
  },
  created() {

  },
  mounted() {
    this.getList();
  },
  methods: {
    /** 查询已办列表 */
    getList() {
      this.loading = true;
      this.queryParams.hiddenId = this.detailId || 0
      logList(this.queryParams).then(response => {
          this.activeLogList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },

    //设置行样式
    rowStyle({row,rowIndex}) {
      let styleJson = {}
      // if ("2" === row.currentState) {
      //   styleJson = {
      //     'color' : 'red'
      //   }
      // }else {

      // }
      let totalPage = Math.ceil(this.total/this.queryParams.pageSize)
      if (rowIndex === this.activeLogList.length-1 && this.queryParams.pageNum == totalPage) {
        styleJson = {
          'color' : 'red'
        }
      }
      return styleJson
    }
  }
}
</script>

<style scoped>

</style>
