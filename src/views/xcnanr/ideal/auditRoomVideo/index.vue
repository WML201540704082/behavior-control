<template>
  <basic-container style="padding: 0;">
    <!-- 查询条件 -->
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="工单编号" prop="planCode">
              <el-input  v-model="searchForm.workCode" clearable placeholder="请输入工单编号" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作人" prop="planCode">
              <el-input  v-model="searchForm.workerName" clearable placeholder="请输入操作人" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作对象" prop="planCode">
              <el-input  v-model="searchForm.operateDevice" clearable placeholder="请输入操作对象" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">
            <el-button type="primary" @click="queryEvent">查询</el-button>
            <el-button style="margin-left: 5px;" type="primary" plain @click="resetEvent">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 页面表格 -->
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column label="工单编号" prop="workCode" align="center" show-overflow-tooltip />
        <el-table-column label="机房" prop="roomName" align="center" show-overflow-tooltip />
        <el-table-column label="操作人" prop="workerName" align="center" show-overflow-tooltip />
        <el-table-column label="操作对象" prop="operateDevice" align="center" show-overflow-tooltip />
        <el-table-column label="操作时间" prop="operateTime" align="center" show-overflow-tooltip />
        <el-table-column label="认证类型" prop="verifyType" width="150" align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button v-if="(scope.row.ossAddress && scope.row.ossAddress.length>0)" type="text" size="mini" @click="showVideo(scope.row)" icon="el-icon-video-camera">查看视频</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" :pageSizes="[10,20,50,100,200]" @pagination="getList"/>
    </div>

  </basic-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getVideoByPage } from '@/api/xcnanr/roomRecordLog'

  export default {
    name: 'RoomRecordVideo',
    computed: { ...mapGetters(["permission", "userInfo", 'userDetail']),
      permissionList() {
        return {}
      }},
    data() {
      return {
        searchForm: {
          workCode: null,
          workerName: null,
          operateDevice: null,
          pageNo: 1,
          pageSize: 10,
        },
        total: 0,
        tableData: [],
        tableHeight: undefined,
        tableLoading: false
      }
    },
    mounted() {
      this.setPageContentHeight()
      this.setTableHeight()
      this.getList()
    },
    methods: {
      showVideo(row)   {
        window.open(row.ossAddress, '_blank');
      },
      // 设置表格高度
      setTableHeight() {
        let bodyBox = document.getElementsByClassName('page_body')
        this.tableHeight = (bodyBox[0].offsetHeight - 100) + 'px'
      },
      queryEvent() {
        this.searchForm.pageNo = 1;
        this.searchForm.pageSize = 10;
        this.getList()
      },
      resetEvent() {
        this.searchForm = {
          workCode: null,
          workerName: null,
          operateDevice: null,
          pageNo: 1,
          pageSize: 10,
        }
        this.getList()
      },
      getList() {
        this.tableLoading = true
        // 处理时间范围
        getVideoByPage(this.searchForm).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
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
</style>
