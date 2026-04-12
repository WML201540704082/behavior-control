<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="90px" class="xt_search_form">
        <el-row>
          <el-col :span="5">
            <el-form-item label="配置项名称" prop="name">
              <el-input placeholder="请输入配置项名称" clearable v-model="searchForm.name" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="巡视类型" prop="type">
              <el-select v-model="searchForm.type" clearable placeholder="请选择巡视类型">
                <el-option v-for="dict in dictForVisitationType" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="启用状态" prop="enabled">
              <el-select v-model="searchForm.enabled" clearable placeholder="请选择启用状态">
                <el-option
                  v-for="dict in dictForEnableStatus"
                  :key="dict.dictValue" :label="dict.dictValue" :value="dict.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 公司选择 -->
          <el-col :span="5">
            <el-form-item label="公司" prop="companyId">
              <xtTreeLzaySelect :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getTreeItem(v,'CORP')"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-top: 0px;" align="right">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button style="margin-right: 5px;" type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 0px;" @click="handleAdd">新增
      </el-button>
      <el-button v-if="permissionList.delBtn"  type="danger" style="margin-left: 5px;" @click="delArrt(selectionList)">删除
      </el-button>
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
        <el-table-column type="selection" width="55" fixed="left" align="center"></el-table-column>
        <el-table-column label="配置项名称" prop="name" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" prop="type" align="center" width="90">
          <template slot-scope="scope">
            {{ convertDictValue(scope.row.type + '', dictForVisitationType) }}
          </template>
        </el-table-column>
        <el-table-column label="巡视项记录数" prop="count" align="center" width="110"></el-table-column>
        <el-table-column label="是否启用" prop="enabled" align="center" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="changeIsEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="companyName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建人" prop="createUserName" align="center" width="120"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" width="135"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" align="center" width="135">
          <template slot-scope="scope">
            <span>{{ !scope.row.updateTime ? '-' : scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="permissionList.editBtn" label="操作" align="center" width="150" fixed="right">
          <template slot-scope="scope">
            <el-link v-if="scope.row.companyRegionCode === userDetail.regionCode" type="primary" size="mini" :underline="false" @click="handleEdit(scope.row)" icon="el-icon-edit">
              <span class="s_lt">编 辑</span>
            </el-link>
            <el-link type="primary" size="mini" :underline="false" @click="checkDetail(scope.row)" icon="el-icon-s-claim" :style="{'marginLeft': scope.row.companyRegionCode === userDetail.regionCode ? '10px' : '0px'}">
              <span class="s_lt">详 情</span>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.pageNumber"
        :limit.sync="searchForm.pageSize"
        :pageSizes="[10,20,50,100,200]"
        @pagination="getList"/>
    </div>
    <config-detail v-if="dialogConfig.type === 'detail'" :dialog-flag="dialogConfig.flag" :dialog-object="dialogConfig.row" @closeDialog="closeDialogFunc" />
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import {getListByPage, deleteById} from "@/api/xcnanr/visitationConfig";
import {changeEnabled} from "../../../../api/xcnanr/visitationConfig";
import { getDictList } from '@/api/dict'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import configDetail from './detail'

export default {
  components: { xtTreeLzaySelect, configDetail },
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.visitationConfigAdd, false),
        editBtn: this.vaildData(this.permission.visitationConfigEdit, false),
        delBtn: this.vaildData(this.permission.visitationConfigDel, false)
      }
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
        enabled: '1',
        companyId: null,
        companyName: null
      },
      total: 0,

      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗
      showForm: false,
      showType: '',
      dictForVisitationType: [], dictForEnableStatus: [],
      dialogConfig: { flag: false, type: null, row: null }
    }
  },
  created() {
    // 加载字典信息：巡视类型
    getDictList("info_inspection_plan_type").then(res => {
      this.dictForVisitationType = res.data
    })
    // 加载字典信息：启用状态
    getDictList("info_enable_status").then(res => {
      this.dictForEnableStatus = res.data
    })
    this.getList();
  },
  mounted() {
    this.setPageContentHeight();
    this.getList();
  },
  methods: {
    getTreeItem(val, type) {
      //单位
      this.searchForm.companyId = val.id
      this.searchForm.companyName = val.fullName
      this.$forceUpdate()
    },
    convertDictValue(type, dictList){
      const item = dictList.find(config => config.dictKey === type);
      return item ? item.dictValue : null;
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
        changeEnabled({id : data.id}).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: '更新成功'
          })
        })
      }).catch(() => {
        data.enabled = val === 0 ? 1:0
      })
    },
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection.map(item => item.id);
    },
    handleQuery() {
      this.searchForm.pageNumber = 1;
      this.getList();
    },
    handleReset() {
      this.searchForm.name = undefined;
      this.searchForm.enabled = '1';
      this.searchForm.type = null;
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.searchForm.companyId = null
      this.searchForm.companyName = null
      this.getList();
    },
    getList() {
      console.log("----")
      this.tableLoading = true;
      getListByPage(this.searchForm).then(res => {
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

        deleteById(ids).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getList()
        })
      })
    },
    handleAdd() {
      // 先关闭已经打开过的tab页
      const thisTabId = document.getElementById("tab-/xcnanr/operationOrder/visitationConfig/index")
      const allTabs = thisTabId.parentElement.children
      for (let i = 0; i < allTabs.length; i++) {
        const tab = allTabs[i]
        if (tab.id.indexOf("tab-/xcnanr/visitationConfig") >= 0) {
          document.getElementById(tab.id).childNodes[1].click()
        }
      }
      // 再重新打开tab页
      this.$router.push({ path: '/xcnanr/visitationConfigAdd', query: { type: 'add' } })
    },
    handleEdit(row) {
      // 先关闭已经打开过的tab页
      const thisTabId = document.getElementById("tab-/xcnanr/operationOrder/visitationConfig/index")
      const allTabs = thisTabId.parentElement.children
      for (let i = 0; i < allTabs.length; i++) {
        const tab = allTabs[i]
        if (tab.id.indexOf("tab-/xcnanr/visitationConfig") >= 0) {
          document.getElementById(tab.id).childNodes[1].click()
        }
      }
      // 再重新打开tab页
      this.$router.push({ path: '/xcnanr/visitationConfigEdit', query: { type: 'edit', configId: row.id } })
    },
    handleDelete(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return remove(row.id);
      }).then(() => {
        this.selectId = row.parentId;
        this.refreshData();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });

    },
    handleDeleteSel() {
      if (this.$refs.table.selection.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = this.$refs.table.selection.map((item) => {
          return item.id
        }).join(',');
        return remove(ids);
      }).then(() => {
        this.getList();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      });
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
