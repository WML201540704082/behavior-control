<template>
  <el-dialog :title="'【'+record.deviceName + '】设备操作指令记录'" :visible.sync="dialogFlag" append-to-body width="740px" height="400px" top="10vh" :show-close="true" :close-on-click-modal="true"  v-el-drag-dialog>
    <basic-container>
      <!-- 查询条件 -->
      <div class="page_form" style="padding-bottom: 0px">
        <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
          <el-row>
            <el-col :span="18">
              <el-form-item label="操作指令" prop="planCode">
                <el-input v-model="searchForm.command" clearable placeholder="请输入操作指令" :maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button-group style="margin-left: 20px;padding-top: 4px;">
                <!-- 查询按钮 -->
                <el-button type="primary" @click="queryEvent">查询</el-button>
                <el-button style="margin-left: 5px;" type="primary" plain @click="resetEvent">重置</el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </el-form>
      </div>
    <div style="width: 100%;font-size: 15px;font-weight: bold;margin-bottom: 10px;">
      {{record.companyName}}<span style="padding: 0 6px;">/</span>{{record.deviceName + '(' + record.ip + ')'}}<span style="padding: 0 6px;">/</span>{{record.workerName}}
    </div>

      <!-- 页面表格 -->
      <div class="page_body">
        <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
          <el-table-column type="selection" width="30" fixed="left"></el-table-column>
          <el-table-column label="操作指令" prop="command" width="380" align="center" show-overflow-tooltip />
          <el-table-column label="返回行数" prop="rows" width="80" align="center" show-overflow-tooltip />
          <el-table-column label="执行时间" prop="executeTime" width="140" align="center" show-overflow-tooltip />
        </el-table>
        <!-- 分页 -->
        <pagination :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" :pageSizes="[10,20,50,100,200]" @pagination="getList"/>
      </div>

      <!-- 弹层 -->
    </basic-container>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getByPage } from '@/api/xcnanr/deviceTerminalRecord'

export default {
  name: 'DeviceTerminalRecord',
  components: { },
  computed: { ...mapGetters(["permission", "userInfo", 'userDetail']) },
  props: {
    record: {
      type: Object,
      default(){
        return {
          id: '',
          compangyId: '',
          companyName: '',
          bastionId: '',
          bastionName: '',
          deviceName: '',
          ip: '',
          workerName: '',
          workerId: '',

        }
      }
    }
  },
  data() {
    return {
      dialogFlag: false,
      dialogTitle: '设备操作指令记录',
      dialogType: '',
      childDialogForm: {},
      sattusOptions: [],
      sourceOptions: [],

      selectionList: [], // 复选框
      searchForm: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false
    }
  },
  created() {
  },
  mounted() {
    this.setPageContentHeight()
    this.setTableHeight()
    this.getList()
  },
  watch: {
    'record.id': function () {
      this.queryEvent()
    }
  },
  methods: {
    // 设置表格高度
    setTableHeight() {
      // let bodyBox = document.getElementsByClassName('page_body')
      // this.tableHeight = (bodyBox[0].offsetHeight - 10) + 'px'
    },
    selectionChange(selection) {
      this.selectionList = selection.map(item => item.id)
    },
    queryEvent() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getList()
    },
    resetEvent() {
      this.searchForm.command = undefined
      this.getList()
    },
    getList() {
      this.tableLoading = true
      this.searchForm.deviceRecordId = this.record.id
      getByPage(this.searchForm).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    tbClick(type) {
      this.$message.success(type)
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
