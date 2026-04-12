<template>
  <basic-container>
    <div>
      <el-button type="primary" icon="el-icon-d-arrow-left" @click="returnTab" style="margin-bottom: 10px">返回机房页面</el-button>
    </div>
    <div class="page_form" style="padding-bottom: 15px">
      <div style="margin-bottom: 10px" v-show="searchId">
        <span>{{ roomData.companyName }}/</span>
        <span>{{ roomData.name }}</span>
      </div>
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="账号人员">
              <el-input placeholder="请输入账号人员" clearable v-model="searchForm.workerName" :maxlength="15"></el-input>
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
      <el-table
        ref="arrtTable"
        :data="tableData"
        :height="tableHeight"
        stripe
        size="small"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column label="工单编号" prop="workCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="账号归属人员" prop="workerName" align="center"></el-table-column>
        <el-table-column label="申请时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="账号状态" prop="detailStatus" align="center">
          <template slot-scope="scope">
            {{ scope.row.detailStatus === 1 ? '正常' : '失效' }}
          </template>
        </el-table-column>
        <el-table-column label="账号有效期" prop="extAttr2" align="center"></el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.pageNumber"
        :limit.sync="searchForm.pageSize"
        :pageSizes="[10,20,50,100]"
        @pagination="getList"/>
    </div>
  </basic-container>
</template>

<script>
  import {mapGetters} from "vuex";
  import {getAcUser} from "@/api/xcnanr/temporaryAuthDetail"
  import {getById} from "@/api/xcnanr/room"
  import website from '@/config/website';
  import {Base64} from 'js-base64';
  import {getToken} from '@/util/auth'

  export default {
    name: 'AccessControl',
    components: {},
    computed: {
      ...mapGetters(["permission", 'userDetail']),
      permissionList() {
        return {}
      }
    },
    data() {
      return {
        workOrderParams: {
          isShow: false,
          type: null,
          formDetial: {}
        },
        selectionList: [],
        searchForm: {
          pageNumber: 1,
          pageSize: 10,
          workCode: '',
          workerName: ''
        },
        total: 0,
        searchId: null,
        tableData: [],
        tableHeight: undefined,
        tableLoading: false,
        roomData: null,
        roomAcVersionList:[],
        roomAcBrandList:[],
        roomDescription: null,
        importDialogVisible: false,
        importLoading: false,
        headers: {
          Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
          'Idevelop-Auth': 'bearer ' + getToken()
        },

      }
    },
    created() {
      this.searchId = this.$route.query.searchId
      this.getRoom()
    },
    mounted() {
      this.getList()
    },
    methods: {
      getRoom(){
        getById(this.searchId).then(res => {
          this.roomData = res.data
          this.roomDescription = this.roomData.companyName + ' / ' + this.roomData.name
        })
      },
      handleQuery() {
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        this.getList();
      },
      handleReset() {
        this.searchForm.workCode = undefined;
        this.searchForm.workerName = undefined;
        this.searchForm.pageNumber = 1
        this.searchForm.pageSize = 10
        this.getList();
      },
      getList() {
        this.searchForm['objectId'] = this.searchId
        this.tableLoading = true;
        getAcUser(this.searchForm).then(res => {
          debugger
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      // 删除
      delArrt(row) {
        this.$confirm('确定是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids;
          ids = row.join(',')
          const worker ={
            id: ids
          }
          deleteByIds(worker).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            this.getList()
          })
        })
      },
      handleAdd() {
        this.workOrderParams.type = 'add';
        this.workOrderParams.isShow = true;
        this.workOrderParams.formDetial = {
          roomId: this.searchId
        };
      },
      handleEdit(row) {
        this.workOrderParams.type = 'edit';
        this.workOrderParams.formDetial = row;
        this.workOrderParams.formDetial.type += ''
        this.workOrderParams.isShow = true;
      },
      componentClose() {
        this.workOrderParams = {
          isShow: false,
          type: null,
          formDetial: {}
        };
      },
      returnTab() {
        this.$router.push({path: '/xcnanr/ideal/baseAc/index',query:{tab:'RoomAccessControl'}})
      },
      /**
       * 文件选择改变时触发
       * @param files
       */
      uploadBeforeSubmit(file) {
        if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
          this.$message({ type: 'error', message: '请上传xls或xlsx格式的表格文件' })
          return false
        }
        return true
      },
      uploadChangeStatus(file) {
        if (file.status === 'ready') {
          this.importLoading = true
          return
        } else if (file.status === 'success') {
          if (file.response.success) {
            this.$message({ type: 'success', message: '导入成功' })
            this.importDialogVisible = false
            this.handleQuery()
          } else {
            this.$message({ type: 'error', message: file.response.msg })
          }
        } else if (file.status === 'fail') {
          this.$message({ type: 'error', message: '导入失败' })
        }
        this.importLoading = false
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
