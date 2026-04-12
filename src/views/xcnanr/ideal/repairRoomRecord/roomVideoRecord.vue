<template>
  <el-dialog :title="'视频回放列表'" :visible.sync="dialogFlag" width="800px" height="400px" :before-close="closeThisView">
    <!-- 页面表格 -->
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" height="440px" stripe size="small" v-loading="tableLoading">
        <el-table-column type="index" width="80" align="center" />
        <el-table-column label="操作类型" prop="recordType" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.recordType === 1 ? '机房' : '机柜' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作设备" prop="operateDevice" align="center" show-overflow-tooltip />
        <el-table-column label="操作时间" prop="operateTime" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ convertTime(scope.row.operateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="认证方式" prop="verifyType" align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button v-if="(scope.row.ossAddress && scope.row.ossAddress.length>0)" type="text" size="mini" @click="showVideo(scope.row)" icon="el-icon-video-camera">查看视频</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import { getDictList } from '@/api/dict'
import { getDetails } from '@/api/xcnanr/roomRecordLog'

export default {
  name: 'RoomRecord',
  components: { xtTreeLzaySelect, getDictList },
  computed: { ...mapGetters(["permission", "userInfo", 'userDetail']),
    permissionList() {
      return {
        DownloadBtn: this.vaildData(this.permission.AuditRecordDownload, false),
      }
    }},
  props: {
    recordId: {
      type: String,
      default: null
    },
    dialogFlag: {
      type: Boolean,
      default: null
    }
  },
  data() {
    return {
      sourceOptions: [],
      orderTypeOptions: [],

      tableData: [],
      tableHeight: undefined,
      tableLoading: false
    }
  },
  created() {
    this.getDictList('info_workOrderType')
    this.getDictList('info_warningSource')
  },
  mounted() {
    this.setPageContentHeight()
    this.setTableHeight()
    this.getList()
  },
  methods: {
    convertTime(time) {
      return time.replace(/T/, " ")
    },
    getDictList(code){
      //加载字典
      getDictList(code).then(res => {
        if(code==='info_workOrderType'){
          this.orderTypeOptions = res.data
        }else if(code==='info_warningSource'){
          this.sourceOptions = res.data
        }
      })
    },
    showVideo(row)   {
      window.open(row.ossAddress, '_blank');
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 100) + 'px'
    },
    getList() {
      this.tableLoading = true
      getDetails({ roomRecordId: this.recordId }).then(res => {
        this.tableData = res.data
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    closeThisView() {
      this.$parent.$parent.$parent.closeDialog()
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
