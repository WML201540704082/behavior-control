<template>
  <basic-container>
     <!-- style="height: 85vh" -->
    <div class="page_form">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="名称">
          <el-input v-model="dataForm.remark" placeholder="名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="任务方法">
          <el-input v-model="dataForm.beanName" placeholder="任务方法" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="dataForm.type" size="small" clearable>
            <el-option label="数据抽取" value="数据抽取"></el-option>
            <el-option label="数据校验" value="数据校验"></el-option>
            <el-option label="数据贯通" value="数据贯通"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
          <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除
          </el-button>
          <el-button type="danger" @click="pauseHandle()" :disabled="dataListSelections.length <= 0">批量暂停
          </el-button>
          <el-button type="danger" @click="resumeHandle()" :disabled="dataListSelections.length <= 0">批量恢复
          </el-button>
          <el-button type="danger" @click="runHandle()" :disabled="dataListSelections.length <= 0">批量立即执行
          </el-button>
          <el-button type="success" @click="logHandle()">日志列表</el-button>
        </el-form-item>
      </el-form>
      </div>
      <div class="page_body">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        :height="tableHeight">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="jobId" header-align="center" align="center" width="180" label="ID"></el-table-column>
        <el-table-column prop="remark" header-align="center" align="center" label="名称"></el-table-column>
        <el-table-column prop="beanName" header-align="center" align="center" label="任务方法"></el-table-column>
        <el-table-column prop="params" header-align="center" align="center" label="参数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cronExpression" header-align="center" align="center"
                         label="cron表达式"></el-table-column>
        <el-table-column prop="type" header-align="center" align="center" width="80" label="类型"></el-table-column>
        <el-table-column prop="status" header-align="center" align="center" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" size="small">正常</el-tag>
            <el-tag v-else size="small" type="danger">暂停</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="280" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.jobId)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.jobId)">删除</el-button>
            <el-button type="text" size="small" @click="pauseHandle(scope.row.jobId)">暂停</el-button>
            <el-button type="text" size="small" @click="resumeHandle(scope.row.jobId)">恢复</el-button>
            <el-button type="text" size="small" @click="runHandle(scope.row.jobId)">立即执行</el-button>
            <el-button type="text" size="small" @click="logHandle(scope.row.jobId)">日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="d_pagin">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <!-- 弹窗, 日志列表 -->
      <scheduleLog v-if="logVisible" :jobId="jobId" ref="log"></scheduleLog>
    </div>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import AddOrUpdate from '@/views/job/components/scheduleForm.vue'
import ScheduleLog from '@/views/job/components/schedule-log.vue'
import request from "@/router/axios";

export default {
  components: {AddOrUpdate, ScheduleLog},
  data() {
    return {
      dataForm: {
        beanName: ''
      },
      tableHeight: undefined,
      dataList: [],
      jobId: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      logVisible: false
    };
  },
  computed: {
    ...mapGetters(["permission", "userInfo", "userDetail"]),
  },
  mounted() {
    // 设置页面元素高度
    this.setPageContentHeight()
    // 设置表格高度
    this.setTableHeight()
    //加载数据
    this.getDataList()
  },
  methods: {

    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      // console.log(78, pageBody[0].offsetHeight - 100)
      this.tableHeight = pageBody[0].offsetHeight - 50 + 'px'
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      request({
        url: '/api/idevelop-data/sys/schedule/list',
        method: 'get',
        params: {
          'current': this.pageIndex,
          'size': this.pageSize,
          'beanName': this.dataForm.beanName,
          'remark': this.dataForm.remark,
          'type': this.dataForm.type
        }
      }).then(({data}) => {
        // console.log(data)
        if (data) {
          this.dataList = data.records
          this.totalPage = data.total
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let jobIds = ids;
        request({
          url: '/api/idevelop-data/sys/schedule/delete',
          method: 'post',
          params: {jobIds: jobIds},
          data: {jobIds: jobIds}
        }).then(({data}) => {
          if (data) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
            })
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {
      })
    },
    // 暂停
    pauseHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '暂停' : '批量暂停'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let jobIds = ids;
        request({
          url: '/api/idevelop-data/sys/schedule/pause',
          method: 'post',
          data: {jobIds: jobIds}
        }).then(({data}) => {
          if (data) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
            })
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {
      })
    },
    // 恢复
    resumeHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '恢复' : '批量恢复'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let jobIds = ids;
        request({
          url: '/api/idevelop-data/sys/schedule/resume',
          method: 'post',
          data: {jobIds: jobIds}
        }).then(({data}) => {
          if (data) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
            })
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {
      })
    },
    // 立即执行
    runHandle(id) {
      // let lsParams = {
      //   deviceCategoryCode: 'aa', // 设备分类
      //   deviceTypeCode: 'aa', // 设备类型
      //   deviceStatusCode: 'aa', // 设备状态
      //   area: 'aa', // 区域
      //   querySize: 1000, // 前端单次最大同步量（int类型）
      //   executeRuleId: 34 // 执行的规则id(int类型)
      // };
      // console.log(JSON.stringify(lsParams))
      // return;
      //{"deviceCategoryCode":"aa","deviceTypeCode":"aa","deviceStatusCode":"aa","area":"aa","querySize":1000,"executeRuleId":34}


      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '立即执行' : '批量立即执行'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let jobIds = ids;
        request({
          url: '/api/idevelop-data/sys/schedule/run',
          method: 'post',
          data: {
            jobIds: jobIds,
          }
        }).then(({data}) => {
          if (data) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
            })
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {
      })
    },
    // 日志列表
    logHandle(id) {
      this.jobId = id || '';
      this.logVisible = true
      this.$nextTick(() => {
        this.$refs.log.init()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.d_pagin {
  text-align: right;
  margin: 10px 0;
  // position: absolute;
  // bottom: 0px;
  // right: 24px;
  // z-index: 1;
  // height: 60px;
  // display: flex;
  // align-items: center
}
</style>

