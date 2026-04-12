<template>
  <basic-container>
     <!-- style="height: 85vh" -->
    <div class="page_form">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="区域名称">
          <el-input v-model="dataForm.regionName" placeholder="区域名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="区域端口号">
          <el-input v-model="dataForm.regionPort" placeholder="区域端口号" size="small" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="类型">
          <el-select v-model="dataForm.type" size="small" clearable>
            <el-option label="数据抽取" value="数据抽取"></el-option>
            <el-option label="数据校验" value="数据校验"></el-option>
            <el-option label="数据贯通" value="数据贯通"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
          <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除
          </el-button>
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
        <el-table-column prop="regionName" header-align="center" align="center" label="区域名称"></el-table-column>
        <el-table-column prop="regionPort" header-align="center" align="center" label="区域端口号"></el-table-column>
        <el-table-column prop="regionAssetOid" header-align="center" align="center" label="区域组织id"></el-table-column>
        <el-table-column prop="regionAssetId" header-align="center" align="center" label="区域资产id" show-overflow-tooltip></el-table-column>
        <el-table-column prop="regionAppKey" header-align="center" align="center" label="区域AppKey"></el-table-column>
        <el-table-column prop="regionAppSecret" header-align="center" align="center"  label="区域AppSecret"></el-table-column>
        <el-table-column prop="regionTimestamp" header-align="center" align="center" label="区域Timestamp"></el-table-column>
        <el-table-column prop="regionSignature" header-align="center" align="center" label="区域Signature"></el-table-column>
        <el-table-column prop="regionAuthorization" header-align="center" align="center" width="140px" label="区域Authorization"></el-table-column>
        <el-table-column prop="remark" header-align="center" align="center" label="数据权限备注"></el-table-column>
        <el-table-column fixed="right" header-align="center" align="center"  label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
import AddOrUpdate from './components/xinChuangAdd.vue'
import ScheduleLog from '@/views/job/components/schedule-log.vue'
import {signatureSearch,signatureDel} from "../../api/assets/xinChuangTQXX";
export default {
  components: {AddOrUpdate, ScheduleLog},
  data() {
    return {
      dataForm: {
       
      },
      tableHeight: undefined,
      dataList: [],
      id: '',
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
      if(!this.dataForm.regionName){
         this.dataForm = {
           
         }
      }
      signatureSearch(this.dataForm).then(({data}) => {
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
    // 新增 
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 批量删除
    deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let str = ids.join(',')
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        signatureDel({ids: str}).then(({data}) => {
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

