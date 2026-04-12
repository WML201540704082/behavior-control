<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="授权编号">
              <el-input placeholder="请输入授权编号" clearable v-model="searchForm.workCode" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-input placeholder="请输入设备名称" clearable v-model="searchForm.objectName" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备IP">
              <el-input placeholder="请输入设备IP" clearable v-model="searchForm.deviceIp" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button style="margin-right: 5px;" type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-table ref="arrtTable" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column label="授权编号" prop="workCode" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="被授权人" prop="workerName" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备名称" prop="objectName" min-width="300" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备IP" prop="deviceIp" width="130" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备端口" prop="devicePort" width="90" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备协议" prop="deviceProtocol" width="90" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="授权开始时间" prop="startTime" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="授权结束时间" prop="finishTime" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="堡垒机地址" prop="bastionUrl" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="临时账号" prop="tempUser" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="临时密码" prop="tempPwd" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="公司" prop="companyName" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建人" prop="createUserName" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="150" align="center" show-overflow-tooltip></el-table-column>
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
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import { getDictList } from '@/api/dict'
import { getByPage } from "@/api/xcnanr/temporaryAuthDetail";

export default {
  components: { xtTreeLzaySelect },
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
        workCode: '', objectName: '', deviceIp: '',
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
