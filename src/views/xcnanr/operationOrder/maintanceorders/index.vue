<template>
  <basic-container>
    <!-- 查询条件 -->
    <div class="page_form" style="padding-bottom: 15px">
      <!--      <el-card shadow="always" style="border: 1px solid #d9d6d6 !important;  width: 100%; margin-bottom: 20px; ">-->
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row :gutter="20" class="align-center">
          <!-- 工单编号 -->
          <el-col :span="6">
            <el-form-item label="工单编号" prop="code">
              <el-input v-model="searchForm.code" placeholder="请输入工单编号" :maxlength="30" />
            </el-form-item>
          </el-col>
          <!-- 维修类型 -->
          <el-col :span="6">
            <el-form-item label="维修类型" prop="type">
              <el-select v-model="searchForm.type" clearable placeholder="请输入维修设备">
                <el-option v-for="item in typeOptions" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 报修人 -->
          <el-col :span="6">
            <el-form-item label="报修人" prop="user">
              <el-input v-model="searchForm.user" placeholder="请输入报修人" :maxlength="30" />
            </el-form-item>
          </el-col>
          <!-- 维修内容 -->
          <el-col :span="6">
            <el-form-item label="维修内容" prop="content">
              <el-input v-model="searchForm.content" placeholder="请输入维修内容" :maxlength="30" />
            </el-form-item>
          </el-col>
          <!-- 维修人 -->
          <el-col :span="6">
            <el-form-item label="维修人" prop="repairPerson">
              <el-input v-model="searchForm.repairPerson" placeholder="请输入维修人" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="派单时间">
              <el-date-picker
                v-model="searchForm.dispatchTimes"
                type="daterange"
                range-separator="~"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 工单状态 -->
          <el-col :span="6">
            <el-form-item label="工单状态" prop="statusInfo">
              <el-select v-model="searchForm.statusInfo" clearable placeholder="请选择工单状态">
                <el-option v-for="item in ticketsStatusOptions" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 反馈人 -->
          <el-col :span="6">
            <el-form-item label="反馈人" prop="feedbackPerson">
              <el-input v-model="searchForm.feedbackPerson" placeholder="请输入反馈人" :maxlength="30" />
            </el-form-item>
          </el-col>
          <!-- 公司选择 -->
          <el-col :span="6">
            <el-form-item label="公司" prop="companyId">
              <xtTreeLzaySelect :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getTreeItem(v,'CORP')"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="填报时间">
              <el-date-picker
                v-model="searchForm.createTimes"
                type="daterange"
                range-separator="~"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 按钮放在同一行 -->
          <el-col :span="12" align="right">
            <el-button type="primary" @click="handleQuery" style="margin-right: 5px;">查询</el-button>
            <el-button type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!--      </el-card>-->
      <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 10px; height: 30px; width: 60px;" @click="redirectEvent('Add')">新增</el-button>
      <el-button v-if="permissionList.DelBtn" type="danger" style="margin-left: 10px; height: 30px; width: 60px;" @click="delArrt(selectionList)">删除</el-button>
      <el-button v-if="permissionList.ExpBtn" type="primary" style="margin-left: 10px; height: 30px; width: 60px;" @click="handleExport">导出</el-button>
    </div>
    <div class="page_body">
      <el-table ref="arrtTable" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="50" fixed="left" />
        <el-table-column label="工单编号" prop="code" width="170" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span @click="redirectEvent('Detail',scope.row)" style="cursor: pointer; color: #59a2fd;">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="维修类型" prop="type" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.type, typeOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报修人" prop="user" width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="报修人部门" prop="userDeptName" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="维修设备" prop="deviceName" width="240" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.deviceName">{{ scope.row.deviceName }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="维修内容" prop="content" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="维修人" prop="repairPerson" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.repairPerson? '-' : scope.row.repairPerson}}</span>
          </template>
        </el-table-column>
        <el-table-column label="派单时间" prop="dispatchTime" width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.dispatchTime? '-' : scope.row.dispatchTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="工单状态" prop="status" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.statusInfo, ticketsStatusOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="反馈人" prop="feedbackPerson" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="维修完成时间" prop="finishTime" width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.finishTime? '-' : scope.row.finishTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="companyName" width="220" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="部门" prop="deptName" width="220" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="填报人" prop="createUserName" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="填报时间" prop="createTime" align="center" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" width="190" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="mini"  v-if="(scope.row.statusInfo === 7) && (userInfo.userId  === scope.row.createUser) && permissionList.editBtn" @click="redirectEvent('Edit',scope.row)" icon="el-icon-edit">编 辑</el-button>
            <el-button type="text" size="mini"  v-if="(scope.row.statusInfo === 3 && scope.row.repairPersonId.indexOf(userInfo.userId) >= 0) && permissionList.BackBtn" @click="redirectEvent('Feedback',scope.row)" icon="el-icon-thumb">反 馈</el-button>
            <el-button type="text" size="mini"  v-if="(scope.row.statusInfo === 1 || scope.row.statusInfo === 7 ) && permissionList.DispatchBtn" @click="redirectEvent('Dispatch',scope.row)" icon="el-icon-user">派 单</el-button>
            <el-button type="text" size="mini"  @click="redirectEvent('Detail',scope.row)" icon="el-icon-s-fold">详 情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="searchForm.pageNumber" :limit.sync="searchForm.pageSize" :pageSizes="[10,20,50,100,200]" @pagination="getList"/>
    </div>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import addMaintenance from "./addMaintenance.vue";
import {getDictList} from '@/api/dict'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import {erpmaintainList} from '@/api/xcnanr/repairworkorders'
import { dellByIds, getListByPage, getListExport } from '@/api/xcnanr/maintanceorders'
import { exportData } from '@/api/xcnanr/export/exportExcel'

export default {
  name: "maintanceOrders",
  components: {
    addMaintenance,
    xtTreeLzaySelect
  },
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.maintanceordersAdd, false),
        ExpBtn: this.vaildData(this.permission.maintanceordersExp, false),
        DispatchBtn: this.vaildData(this.permission.maintanceordersDispatch, false),
        editBtn: this.vaildData(this.permission.maintanceordersEdit, false),
        DelBtn: this.vaildData(this.permission.maintanceordersDel, false),
        BackBtn: this.vaildData(this.permission.maintanceordersBack, false),
      }
    }
  },
  data() {
    return {
      userInfo: this.$store.state.user.userDetail,
      ticketsStatusOptions: [],
      swerkList: [],
      maintenanceData: {
        type: null,
        formDetial: {}
      },
      selectionList: [],
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        code: null,
        repairPerson:null,
        feedbackPerson:null,
        content:null,
        type:null,
        companyId:null,
        statusInfo:null,
        dispatchTimes: [], dispatchStartDate: null, dispatchEndDate: null,
        createTimes: [], creatStartDate: null, creatEndDate: null
      },
      total: 0,
      roomData: {},
      tableData: [],
      dialogVisible: false,
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗
      showForm: false,
      showType: '',
      arrtId: '',
      typeOptions: [],
      equipmentOptions: []
    }
  },
  created() {
    if (!this.userInfo || !this.userInfo.username) {
      this.$store.dispatch('user/GetUserDetail');
    }
    this.getDictList('info_maintance_tickets_status')
    this.getDictList('info_maintance_type')
    this.getDictList('info_maintance_equipment')
  },
  mounted() {
    this.setPageContentHeight();
    this.setTableHeight();
    this.getDict();
    this.getList();
  },
  methods: {
    getTreeItem(val, type) {
      if (type === 'CORP') {
        //单位
        this.searchForm.companyId = val.id
        this.searchForm.companyName = val.fullName

        //单位更改 部门请初始化
        this.searchForm.departmentId = null;
        this.searchForm.departmentName = null;
      } else if (type === 'DEPT') {
        //部门
        this.searchForm.departmentId = val.id;
        this.searchForm.departmentName = val.fullName;
      }
      this.$forceUpdate()
    },
    getDictList(code) {
      //加载字典
      getDictList(code).then(res => {
        if (code === 'info_maintance_tickets_status') {
          this.ticketsStatusOptions = res.data
        } else if (code === 'info_maintance_type') {
          this.typeOptions = res.data
        } else if (code === 'info_maintance_equipment') {
          this.equipmentOptions = res.data
        }
      })
    },
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection.map(item => item.id);
    },
    showDictLable(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }
      }
      return code;
    },
    showSwerkLable(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.code == code);
        if (items != null && items.length > 0) {
          return items[0].name;
        }
      }
      return code;
    },
    handleQuery() {
      this.searchForm.pageNumber = 1;
      this.getList();
    },
    /**
     * 重置
     */
    handleReset() {
      this.searchForm.companyId = undefined;
      this.searchForm.type = undefined;
      this.searchForm.user = undefined;
      this.searchForm.code = '';
      this.searchForm.repairPerson = undefined;
      this.searchForm.feedbackPerson = undefined;
      this.searchForm.content = undefined;
      this.searchForm.statusInfo = undefined;
      this.searchForm.companyName = undefined;
      this.searchForm.dispatchTimes = [];
      this.searchForm.createTimes = [];
      this.getList();
    },
    // 删除
    delArrt(row) {
      if (this.$refs['arrtTable'].selection.length === 0) {
        this.$message.warning("请选择至少一条数据")
        return
      }
      this.$confirm('确定是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dellByIds(row).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getList()
        })
      })
    },
    getDict() {
      erpmaintainList({current: 1, size: 200}).then(res => {
        this.swerkList = res.data.records
      })
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body');
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    getList() {
      // 给查询时间段赋值
      if (this.searchForm.dispatchTimes && this.searchForm.dispatchTimes.length > 0) {
        this.searchForm.dispatchStartDate = this.searchForm.dispatchTimes[0] + ' 00:00:00'
        this.searchForm.dispatchEndDate = this.searchForm.dispatchTimes[1] + ' 23:59:59'
      } else {
        this.searchForm.dispatchStartDate = null
        this.searchForm.dispatchEndDate = null
      }
      if (this.searchForm.createTimes && this.searchForm.createTimes.length > 0) {
        this.searchForm.creatStartDate = this.searchForm.createTimes[0] + ' 00:00:00'
        this.searchForm.creatEndDate = this.searchForm.createTimes[1] + ' 23:59:59'
      } else {
        this.searchForm.creatStartDate = null
        this.searchForm.creatEndDate = null
      }
      this.searchForm.companyRegionCode = this.userInfo.regionCode
      this.tableLoading = true;
      getListByPage(this.searchForm).then(res => {
        this.total = res.data.total;
        this.tableData = res.data.records;
        this.tableLoading = false;
      })
    },
    // 跳子页面
    redirectEvent(type, data) {
      let id = ''
      if (type === 'Add') {
        id = ''
      } else if (type === 'Edit') {
        id = data.code
      } else if (type === 'Detail') {
        id = data.code
      } else if (type === 'Dispatch') {
        id = data.code
      } else if (type === 'Feedback') {
        id = data.code
      }
      // 先关闭已经打开过的tab页
      const thisTabId = document.getElementById("tab-/xcnanr/operationOrder/maintanceorders/index")
      const allTabs = thisTabId.parentElement.children
      for (let i = 0; i < allTabs.length; i++) {
        const tab = allTabs[i]
        if (tab.id.indexOf("tab-/xcnanr/Maintenance") >= 0) {
          document.getElementById(tab.id).childNodes[1].click()
        }
      }
      this.$router.push({
        path: `/xcnanr/Maintenance${type}`,
        query: {
          id,
          type
        }
      })
    },
    // 导出
    handleExport() {
      // 定义需要导出的列
      const columns = {
        code: "工单编号",
        type: "维修类型",
        user: "报修人",
        userDeptName: "报修人部门",
        tel: "报修人电话",
        position: "报修人位置",
        deviceName: "维修设备",
        content: "维修内容",
        repairPerson: "维修人",
        dispatchTime: "派单时间",
        statusInfo: "工单状态",
        feedbackPerson: "反馈人",
        finishTime: "维修完成时间",
        companyName: "所属公司名称",
        createUserName: "填报人",
        createTime: "填报时间"
      }
      const _this = this
      // 查询数据
      getListExport(this.searchForm).then(res => {
        const dataList = res.data
        // 字典值替换
        for (const item of dataList) {
          const dict1 = _this.typeOptions.find(d => d.dictKey === item.type + '')
          item.type = dict1 ? dict1.dictValue : item.type
          const dict2 = _this.ticketsStatusOptions.find(d => d.dictKey === item.statusInfo + '')
          item.statusInfo = dict2 ? dict2.dictValue : item.statusInfo
        }
        // 导出数据
        exportData(dataList, columns, '维修工单 ')
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
/deep/.el-date-editor .el-range__icon{
  line-height: 24px!important;
}
</style>
