<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="公司" prop="companyId" size="small">
              <xt-tree-lzay-select :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getTreeItem(v)" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="授权编号" prop="name">
              <el-input placeholder="请输入授权编号" clearable v-model="searchForm.code" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="被授权人" prop="name">
              <el-input placeholder="请选择被授权人" clearable v-model="searchForm.workers" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="授权原因" prop="name">
              <el-input placeholder="请输入授权原因" clearable v-model="searchForm.reason" :maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="type">
              <el-select v-model="searchForm.woStatus" clearable placeholder="请选择类型">
                <el-option v-for="dict in dictForStatus" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18" align="right">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button style="margin-right: 5px;" type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="primary" style="margin-left: 0px;" @click="addEvent">新增</el-button>
      <el-button type="danger" style="margin-left: 5px;" @click="finishEvent">归档</el-button>
    </div>
    <div class="page_body">
      <el-table ref="arrtTable" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="授权编号" prop="code" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="被授权人" prop="workers" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.workers ? '-' : scope.row.workers }}</span>
          </template>
        </el-table-column>
        <el-table-column label="授权原因" prop="reason" min-width="300" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="计划开始时间" prop="startTime" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="计划结束时间" prop="finishTime" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际结束时间" prop="realTime" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.realTime ? '-' : scope.row.realTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="woStatus" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row['woStatus'], dictForStatus) }}</span>
            <!--<el-badge v-else value="归档" class="item" type="primary">
              <span>{{ conversionDict(scope.row['woStatus'], dictForStatus) }}</span>
            </el-badge>-->
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="companyName" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建人" prop="createUserName" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="80" fixed="right">
          <template slot-scope="scope">
            <el-link type="primary" size="mini" :underline="false" @click="handleCheckDetailFunc(scope.row)" icon="el-icon-s-fold">
              <span class="s_lt">详 情</span>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.pageNumber"
        :limit.sync="searchForm.pageSize"
        :pageSizes="[10,20,50,100]"
        @pagination="getList"/>
    </div>
    <detail v-if="detailDialog.flag" :dialog-flag="detailDialog.flag" :auth-object="detailDialog.authObject" @closeDialog="closeDetailDialogFunc" />
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import { getDictList } from '@/api/dict'
import { getByPage, finishApi } from "@/api/xcnanr/temporaryAuth";
import detail from './detail'

export default {
  components: { xtTreeLzaySelect, detail },
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail'])
  },
  data() {
    return {
      dictForStatus: [],
      selectionList: [],
      searchForm: null,
      total: 0,

      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗
      detailDialog: { flag: false, authObject: null },
    }
  },
  created() {
    this.initSearchForm()
    // 加载字典信息
    getDictList("info_temporary_auth_status").then(res => {
      this.dictForStatus = res.data
    })
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 初始化查询form对象
    initSearchForm() {
      this.searchForm = {
        companyId: '', companyName: '', extAttr1: '2',
        pageNumber: 1,
        pageSize: 10,
      }
    },
    //字典回显
    conversionDict(code, dictList) {
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code)
        if (items != null && items.length > 0) {
          return items[0].dictValue
        }
      }
      return code
    },
    // 新增事件
    addEvent() {
      this.$router.push({ path: '/xcnanr/ideal/authForBastion/add', query: { type: 'add' } })
    },
    //点击选择事件
    selectionChange(selection) {
      this.selectionList = selection.map(item => item.id);
    },
    // 查询
    handleQuery() {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getList();
    },
    // 重置
    handleReset() {
      this.initSearchForm()
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      getByPage(this.searchForm).then(res => {
        this.tableData = res.data.records;
        this.tableData = this.tableData.map((obj)=>{
          return {...obj,enabled:'1'}
        })
        this.total = res.data.total;
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    getTreeItem(val) {
      this.searchForm.companyId = val.id
      this.searchForm.companyName = val.fullName
    },
    // 打开详情弹层
    handleCheckDetailFunc(row) {
      this.detailDialog = {
        flag: true,
        authObject: row
      }
    },
    // 关闭详情弹层
    closeDetailDialogFunc() {
      this.detailDialog = {
        flag: false,
        authObject: null
      }
    },
    // 归档按钮
    finishEvent() {
      const selection = this.$refs['arrtTable'].selection
      if (selection.length === 0) {
        this.$message({
          type: "warning",
          message: "表格未选择行!"
        });
        return
      }
      const finishedRows = selection.filter(t => t.woStatus === 3 || t.finishIdentify === 1)
      if (finishedRows.length === selection.length) {
        this.$message({
          type: "warning",
          message: "已选择的临时授权均已结束或已归档!"
        });
        return
      }
      const tips = finishedRows.length > 0 ? '选择记录中包含已结束或已归档的临时授权，其他临时授权将进行归档操作，是否继续？' : '已选择记录将进行归档操作，是否继续？'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        finishApi({ id: selection.map(t => t.id).join(',') }).then(res => {
          if (res && res.code === 200) {
            this.$message({
              type: "success",
              message: res.msg
            });
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/.el-badge__content {
    top: 10px;
    right: 2px;
  }
  /deep/.el-badge__content {
    font-size: 11px;
  }
.el-link {
  font-size: 13px;
}

.s_lt {
  font-size: 12px;
}
</style>
