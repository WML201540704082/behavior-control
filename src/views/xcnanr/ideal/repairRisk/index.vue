<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="名称" prop="name">
              <el-input placeholder="请输入名称" clearable v-model="searchForm.name" :maxlength="30" />
            </el-form-item>
          </el-col>
          <!-- 公司选择 -->
          <el-col :span="6">
            <el-form-item label="公司" prop="companyId">
              <xtTreeLzaySelect :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getTreeItem(v,'CORP')"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检修类别" prop="type">
              <el-select v-model="searchForm.type" clearable placeholder="请选择检修类别">
                <el-option v-for="dict in controlType" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工作类别" prop="jobCategory">
              <el-select v-model="searchForm.jobCategory" clearable placeholder="请选择检修类别" @change="loadJobTypeOptions">
                <el-option v-for="dict in jobCategoryOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作业类型" prop="jobType">
              <el-select v-model="searchForm.jobType" clearable placeholder="请选择作业类型">
                <el-option v-for="dict in jobTypeAllOptions[searchForm.jobCategory]" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="jobType">
              <el-select v-model="searchForm.statusInfo" clearable placeholder="请选择状态">
                <el-option v-for="dict in statusInfoOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button style="margin-right: 5px;" type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 0px;" @click="redirectEvent('Add')">新增
      </el-button>
      <el-button v-if="permissionList.delBtn" type="danger" style="margin-left: 5px;" @click="delArrt(selectionList)">删除
      </el-button>
    </div>
    <div class="page_body">
      <el-table ref="arrtTable" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="30" fixed="left" />
        <el-table-column label="名称" prop="name" width="160" align="center" show-overflow-tooltip />
        <el-table-column label="检修类别" prop="type" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{showDictLabel(scope.row.type, controlType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="工作类别" prop="jobCategory" align="center" show-overflow-tooltip min-width="150">
          <template slot-scope="scope">
            <span>{{showDictLabel(scope.row.jobCategory, jobCategoryOptions)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="作业类型" prop="jobType" align="center" show-overflow-tooltip min-width="120">
          <template slot-scope="scope">
            <span>{{showDictLabelByCategory(scope.row.jobCategory, scope.row.jobType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="风险点分析" prop="riskPoints" align="center" show-overflow-tooltip min-width="200" />
        <el-table-column label="安全措施" prop="measure" align="center" show-overflow-tooltip min-width="200" />
        <el-table-column label="状态" prop="statusInfo" width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.statusInfo" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" @change="changeIsEnabled(scope.row, scope.row.statusInfo)" />
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="companyName" width="220" align="center" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" align="center" width="135" />
        <el-table-column label="更新时间" prop="updateTime" align="center" width="135">
          <template slot-scope="scope">
            <span>{{ !scope.row.updateTime ? '-' : scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="permissionList.editBtn" label="操作" align="center" width="150" fixed="right">
          <template slot-scope="scope">
            <el-link v-if="scope.row.companyRegionCode === userDetail.regionCode" type="primary" size="mini" :underline="false" @click="redirectEvent('Edit',scope.row)" icon="el-icon-edit">
              <span class="s_lt">编 辑</span>
            </el-link>
            <el-link type="primary" size="mini" :underline="false" @click="checkDetail(scope.row)" icon="el-icon-s-claim" :style="{'marginLeft': scope.row.companyRegionCode === userDetail.regionCode ? '10px' : '0px'}">
              <span class="s_lt">详 情</span>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="searchForm.pageNumber" :limit.sync="searchForm.pageSize" :pageSizes="[10, 20, 50, 100, 200]" @pagination="getList" />
    </div>
    <risk-detail v-if="dialogConfig.type === 'detail'" :dialog-flag="dialogConfig.flag" :dialog-object="dialogConfig.row" @closeDialog="closeDialogFunc" />
  </basic-container>
</template>

<script>
import {mapGetters} from 'vuex'
import { getDictList } from '@/api/dict'
import {dellByIdsControl, getByPageControlInit, updateControl} from '../../../../api/xcnanr/riskcontrol'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import riskDetail from './detail'

export default {
  name: "riskControl",
  components: {
    xtTreeLzaySelect, riskDetail
  },
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.riskcontrolAdd, false),
        editBtn: this.vaildData(this.permission.riskcontrolEdit, false),
        delBtn: this.vaildData(this.permission.riskcontrolDel, false)
      }
    }
  },
  data() {
    return {
      selectionList :{},
      riskcontrolData:{},
      riskcontrolType: null,
      dialogVisible: false,
      swerkList: [],
      workOrderParams: {
        isShow: false,
        type: null,
        formDetial: {}
      },
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        name: undefined,
        type: undefined,
        jobCategory: undefined,
        jobType: undefined,
        companyId: undefined,
        companyName: undefined,
        statusInfo: undefined
      },
      total: 0,
      controlType: {},
      jobCategoryOptions: [],
      jobTypeAllOptions: {},
      statusInfoOptions: [],
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗
      showForm: false,
      showType: '',
      dialogConfig: { flag: false, type: null, row: null }
    }
  },
  created() {
    this.getList()
    this.getDictList('info_repair_plan_mode')
    this.getDictList('info_job_category')
    this.getDictList('info_power_air_system')
    this.getDictList('info_cloud_platform_virtual_pool')
    this.getDictList('info_host_storage_device')
    this.getDictList('info_core_network_device')
    this.getDictList('info_safe_device')
    this.getDictList('info_apply_software')
    this.getDictList('info_basic_environment')
    this.getDictList('info_fire_fighting_system')
    this.getDictList('info_cabling_system')
    this.getDictList('info_risk_control_statusinfo')
  },
  mounted() {
    this.setPageContentHeight()
    this.setTableHeight()
    this.getDict()
    this.getList()
  },
  methods: {
    getTreeItem(val, type) {
      //单位
      this.searchForm.companyId = val.id
      this.searchForm.companyName = val.fullName
      this.$forceUpdate()
    },
    /**
     * 切换工作类别
     */
    loadJobTypeOptions() {
      this.$set(this.searchForm, 'jobType', '')
    },
    showDictLabel(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        if(Array.isArray(dictList) && dictList.length > 0) {
          let items = dictList.filter(item => item.dictKey == code)
          if (items != null && items.length > 0) {
            return items[0].dictValue
          }
        }
      }
      return code
    },
    /**
     * 根据工作类别 回显作业类型
     * @param parentCode
     * @param code
     * @returns {*}
     */
    showDictLabelByCategory(parentCode, code) {
      if(parentCode != null && parentCode != '' && this.jobCategoryOptions.length && this.jobCategoryOptions.length > 1) {
        const jobCategoryOption = this.jobCategoryOptions.filter(item => item.dictKey === parentCode)
        if (jobCategoryOption.length <= 0) {
          return code
        }
        const jobTypeAllOption = this.jobTypeAllOptions[jobCategoryOption[0].dictKey]
        if(!jobTypeAllOption || jobTypeAllOption.length === 0) {
          return code
        }
        const jobTypeOption = jobTypeAllOption.filter(item => item.dictKey == code)
        return jobTypeOption.length > 0 ? jobTypeOption[0].dictValue : code
      }
      return code
    },
    getDictList(code){
      //加载字典
      getDictList(code).then(res => {
        if(code==='info_repair_plan_mode'){
          this.controlType = res.data
        } else if (code === 'info_job_category') {
          this.jobCategoryOptions = res.data
        } else if (code === 'info_power_air_system') {
          this.jobTypeAllOptions['info_power_air_system'] = res.data
        } else if (code === 'info_cloud_platform_virtual_pool') {
          this.jobTypeAllOptions['info_cloud_platform_virtual_pool'] = res.data
        } else if (code === 'info_host_storage_device') {
          this.jobTypeAllOptions['info_host_storage_device'] = res.data
        } else if (code === 'info_core_network_device') {
          this.jobTypeAllOptions['info_core_network_device'] = res.data
        } else if (code === 'info_safe_device') {
          this.jobTypeAllOptions['info_safe_device'] = res.data
        } else if (code === 'info_apply_software') {
          this.jobTypeAllOptions['info_apply_software'] = res.data
        } else if (code === 'info_basic_environment') {
          this.jobTypeAllOptions['info_basic_environment'] = res.data
        } else if (code === 'info_fire_fighting_system') {
          this.jobTypeAllOptions['info_fire_fighting_system'] = res.data
        } else if (code === 'info_cabling_system') {
          this.jobTypeAllOptions['info_cabling_system'] = res.data
        } else if (code === 'info_risk_control_statusinfo') {
          this.statusInfoOptions = res.data
        }
      })
    },
    openDialog() {
      this.dialogVisible = true
      this.riskcontrolType = 'add'
    },
    handleFormSubmit() {
    },
    // 切换可用状态
    changeIsEnabled(data, val) {
      let tip = (val === 0) ? '禁用': '启用'
      this.$confirm('此操作将 "' + tip + '" ' + data.name + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 更改数据库数据
        updateControl({
          id: data.id,
          statusInfo: val
        }).then( res =>{
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: data.name + tip + '成功'
            })
          }
        })
      }).catch(() => {
        data.statusInfo = val === 0 ? 1: 0
      })
    },
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection.map(item => item.id);
    },
    showSwerkLable(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.code == code);
        if (items != null && items.length > 0) {
          return items[0].name
        }
      }
      return code
    },
    handleQuery() {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getList()
    },
    handleReset() {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.searchForm.type = null
      this.searchForm.name = null
      this.searchForm.jobCategory = null
      this.searchForm.jobType = null
      this.searchForm.companyId = null
      this.searchForm.companyName = null
      this.searchForm.statusInfo = null
      this.getList()
    },
    getDict() {
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    getList() {
      this.tableLoading = true;
      getByPageControlInit(this.searchForm).then(res => {
        this.tableData = res.data.records
        this.tableData = this.tableData.map((obj)=>{
          return {...obj,enabled:1}
        })
        this.total = res.data.total
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

        dellByIdsControl(ids).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getList()
        })
      })
    },
    handleAdd() {
      this.$router.push({path: '/xcnanr/addRiskManagement', query: { type: 'add' }})
    },
    handleEdit(row) {
      this.$router.push({path: '/xcnanr/editRiskManagement', query: { type: 'edit', id: row.id }})
    },
    componentClose() {
      this.workOrderParams = {
        isShow: false,
        type: null,
        formDetial: {}
      };
    },
    // 跳子页面
    redirectEvent(type, data) {
      let id = ''
      if (type === 'Add') {
        id = ''
      } else if (type === 'Edit') {
        id = data.id
      }


      // 再重新打开tab页
      this.$router.push({
        path: `/xcnanr/ideal/repairRisk/add`,
        query: {
          id,
          type
        }
      })

    },
    checkDetail(row) {
      this.dialogConfig.flag = true
      this.dialogConfig.type = 'detail'
      this.dialogConfig.row = row
    },
    // 关闭选择设备弹层
    closeDialogFunc() {
      this.dialogConfig.flag = false
      this.dialogConfig.type = null
      this.dialogConfig.row = null
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
