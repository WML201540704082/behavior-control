<template>
  <basic-container>
    <div class="page_form">
      <el-form
        ref="searchForm"
        :model="searchForm"
        label-suffix=":"
        label-width="120px"
        class="xt_search_form"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目编码" prop="projectDefineCode">
              <el-input v-model="searchForm.projectDefineCode" placeholder="请输入项目编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectDefine">
              <el-input v-model="searchForm.projectDefine" placeholder="请输入项目名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="WBS元素" prop="wbsCode">
              <el-input v-model="searchForm.wbsCode" placeholder="请输入WBS元素"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="WBS项目" prop="wbsName">
              <el-input v-model="searchForm.wbsName" placeholder="请输入WBS项目"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目所属单位" prop="projectUnitName">
              <xt-tree-lzay-select :formValue="searchForm.projectUnitName"
                                   :selectType="'CORP'"
                                   :sel-ever-node="true"
                                   @getTreeItem="getEntityReceiveUnit"></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目创建时间" prop="">
              <el-date-picker
                v-model="createTimes"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                style="width:100%"
                @change="changeTime">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <formTitle :titleText="'存量ERP项目管理'" :titleType="'page_title'">
        <div slot="rightBtnBox">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="searchReset" plain>重置</el-button>
          <el-button type="primary" @click="handleSync" plain>ERP项目同步</el-button>
          <el-button type="primary" @click="daoru" v-if="isRoleAlias">导入</el-button>
          <el-button type="primary" @click="handleExport" plain>导出</el-button>
        </div>
      </formTitle>
      <el-table
        ref="dataTable"
        stripe
        size="small"
        :data="tableData"
        :height="tableHeight"
        v-loading="tableLoading"
        row-key="id"
        :expand-row-keys="expands"
        @row-dblclick="handleErpNum"
      >
        <el-table-column type="selection" width="30" fixed="left" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="projectType" label="项目类型" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectDefineCode" label="项目编码" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectDefine" label="项目名称" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="wbsCode" label="WBS元素" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="wbsName" label="WBS项目" width="250" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="erpTotal" label="资产编码数量" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span v-if="row.erpTotal > 0" @click="handleErpNum(row)" style="cursor: pointer;color: #569ed4;font-weight: 900;">{{ row.erpTotal }}</span>
            <span v-else style="cursor: pointer" @click="handleErpNum(row)">{{ row.erpTotal }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="projectUnitName" label="项目所属单位" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectCreateTime" label="项目创建时间" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="loevm" label="状态" width="100" align="center" :formatter="changeStatus" show-overflow-tooltip></el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="getList"
      />
    </div>

    <!-- erp资产编码查看 -->
    <erpCodeList
      v-if="showDialog"
      :isShow="showDialog"
      :wbsElement="wbsElement"
      :wbsProject="wbsProject"
      @close="showDialog = false"
    ></erpCodeList>

    <!-- 项目刷新 -->
    <projectRefresh
      v-if="showSync"
      :isShow="showSync"
      @close="showSync = false"
      @submit="getRefresh"
    ></projectRefresh>

    <!-- 导入文件弹框 -->
    <uploadModel v-if="openUpload" :isShow.sync="openUpload" type="erp" :isMath="0"
                 @setVal='setValDeviceList'></uploadModel>
  </basic-container>
</template>

<script>
import {projectmanagerList, projectpurchasebatchList} from '@/api/assets/projectManage'
import {getDeptList} from "@/api/system/dept";
import projectRefresh from './components/projectManage/projectRefresh'
import erpCodeList from './components/projectManage/erpCodeList'
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import uploadModel from "@/views/device/components/devInBound/uploadModel.vue";

import {getUserDetail} from "@/api/user";
import {mapGetters} from "vuex";

export default {
  components: {
    xtTreeLzaySelect,
    erpCodeList,
    projectRefresh,
    uploadModel
  },
  data() {
    return {
      openUpload: false,

      // 搜索
      searchForm: {
        current: 1,
        size: 20
      },
      createTimes: [],
      wbsProjectList: [],
      wbsElementList: [],
      unitList: [],
      syncStatusList: [],
      // 表格
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      total: 0,
      expandTableData: [],
      expands: [], //默认展开的列表行
      expandTableLoading: false,

      // 弹窗
      showSync: false,
      showDialog: false,
      wbsElement: '',
      wbsProject: '',
      regionCode: '',
      regionName: '',
      unit: '',
      unitName: '',
    }
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"]),
    isRoleAlias(){
      return this.$store.state.user.userDetail.roleAlias.includes('administrator')
    }
  },
  mounted() {
    // 设置页面元素高度
    this.setPageContentHeight()
    // 设置表格高度
    this.setTableHeight()
    // 获取WBS数据
    //this.getList()
    // 获取部门数据
    this.getDeptList()
    // 获取用户默认权限
    this.beforeOpen();
    // 获得项目列表
    this.getList()

  },
  methods: {
    daoru(){
      this.openUpload = true
    },
    setValDeviceList(arr) {
      // console.log(99, arr)
      this.openUpload = false
      this.getList()
    },

    getEntityReceiveUnit(val) {
      //选择所属单位
      this.searchForm.projectUnitName = val.erpUnit
      this.searchForm.projectUnitCode = val.erpUnitCode
      this.$refs.searchForm.$forceUpdate()
      this.$forceUpdate()
    },
    async getDeptList() {
      //加载部门数据
      await getDeptList().then(res => {
        this.unitList = res.data
      })
    },
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 61 - 47 + 'px'
    },
    getList() {
      this.tableLoading = true
      if (!this.searchForm.projectUnitCode) {
        this.searchForm.projectUnitCode = this.userDetail.erpUnitCode || ''
        if (this.userDetail.regionCode === '37') {
          this.searchForm.projectUnitCode = '';
        }
      }
      projectmanagerList(this.searchForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    changeStatus(row) {
      if (row.loevm === 'Y') {
        return "可使用"
      } else if (row.loevm === 'X') {
        return "已停用"
      }
    },
    // 查询
    handleQuery() {
      this.searchForm.current = 1
      this.getList()
    },
    // 重置
    searchReset() {
      this.searchForm = {
        current: 1,
        size: 20,
      }
      this.createTimes = []
      this.getList()
    },
    // 数据同步
    handleSync() {
      this.showSync = true
    },
    // 导出
    handleExport() {
      let form = {
        wbsCode: this.searchForm.wbsCode,
        wbsName: this.searchForm.wbsName,
        projectUnitCode: this.searchForm.projectUnitCode,
        ids: this.$refs.dataTable.selection.length > 0 ? this.$refs.dataTable.selection.map(el => el.id) : undefined
      }
      this.download(
        "/api/idevelop-device/projectmanager/export",
        form,
        "项目管理.xlsx"
      );
    },
    handleExpand(row, expandedRows) {
      this.expandTableData = []
      if (expandedRows.length) {
        this.expands = [row.id]
      } else {
        this.expands = []
      }
      this.expandTableLoading = true
      projectpurchasebatchList({
        current: 1,
        size: 999,
        wbsId: row.id
      }).then(res => {
        this.expandTableData = res.data.records
        this.expandTableLoading = false
      })

    },
    handleErpNum(row) {
      this.showDialog = true
      this.wbsElement = row.wbsCode
      this.wbsProject = row.wbsName
    },
    beforeOpen() {
      // this.tableLoading = true
      //加载默认数据
      getUserDetail().then(res => {
        let usr = res.data;
        this.regionCode = usr.regionCode || ''
        this.regionName = usr.regionName || ''
        this.unit = usr.ownerUnit || ''
        this.unitName = usr.ownerUnitName || ''
        // this.searchForm.projectUnitCode= usr.erpUnitCode||''
        // if (usr.regionCode === '37') {
        //   this.searchForm.projectUnitCode = '';
        // }
        // // 获取WBS数据
        // this.getList()
      })
      // .catch(() => {
      //   this.tableLoading = false
      //   // 获取WBS数据
      //   this.getList()
      // });
    },
    getRefresh() {
      this.showSync = false
      this.getList()
    },
    changeTime(val) {
      if (val == null) {
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
      } else {
        this.searchForm.startTime = val[0]
        this.searchForm.endTime = val[1]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table_expand {
  padding: 5px 40px 5px 80px
}
</style>

