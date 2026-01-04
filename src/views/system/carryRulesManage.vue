<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="130px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="规则名" prop="swerk">
               <el-input
                placeholder="请输入规则名"
                clearable
                v-model="searchForm.swerk"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="表名字段" prop="beber">
              <!-- <el-select v-model="searchForm.beber" clearable placeholder="请选择工厂区域">
                <el-option
                  v-for="dict in beberList"
                  :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"
                >
                </el-option>
              </el-select> -->
               <el-input
                placeholder="请输入表名"
                clearable
                v-model="searchForm.swerk"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务名" prop="trlnr">
              <el-input
                placeholder="请输入任务名"
                clearable
                v-model="searchForm.trlnr"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日志信息" prop="pltxt">
              <el-input
                placeholder="请输入日志信息"
                clearable
                v-model="searchForm.pltxt"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <formTitle :titleText="'查询结果列表'" :titleType="'page_title'" style="margin-top:5px">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" @click="handleQuery">查 询</el-button>
            <el-button type="info" size="small" @click="handleReset">重 置</el-button>
            <!-- <el-button type="success" size="small" @click="handleAdd">新 增</el-button>
            <el-button type="primary" size="small" @click="handleExport">导出</el-button> -->
          </div>
     </formTitle>
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
        <!-- <el-table-column type="selection" width="30 " fixed="left"></el-table-column> -->
        <el-table-column label="规则名" prop="swerk" width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showSwerkLable(scope.row.swerk, swerkList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="表名字段" prop="trlnr" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务名" prop="pltxt" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="规则设定与结果的对比" prop="tplma" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="执行状态" prop="beber" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.beber, beberList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行时间" prop="zsbdydj" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.zsbdydj, zsbdydjList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日志信息" prop="operation" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.operation, operationList) }}</span>
          </template>
        </el-table-column>
        
        <!-- <el-table-column label="操作" prop="createTime" align="center" width="130" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <div style="display: flex;justify-content: space-between">
                <el-link type="primary" size="mini" :underline="false" icon="el-icon-edit" @click="editArrt(scope.row)">
                  <span class="s_lt">编 辑</span>
                </el-link>
                <el-link type="danger" size="mini" :underline="false" icon="el-icon-delete" :disabled="scope.row.invokeCount > 0"
                         @click="delArrt([scope.row.trlnr])">
                  <span class="s_lt">删 除</span>
                </el-link>
              </div>
             
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        :pageSizes="[20,50,100,200]"
        @pagination="getList"/>
    </div>

  
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";

import {globalattrSearch, globalattrDel, erpmaintainList} from "@/api/assets/functionPosition";

export default {
 
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail'])
  },
  data() {
    return {
      swerkList: [],
      operationList: [],
      beberList: [],
      zsbdydjList: [],
      statusList: [],
      selectionList: [],
      searchForm: {
        current: 1,
        size: 20,
      },
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗
      showForm: false,
      showType: '',
      arrtId: '',
    }
  },
  mounted() {
    this.setPageContentHeight();
    this.setTableHeight();
    this.getDict();
    this.getList();
  },
  methods: {
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection.map(item => item.trlnr);
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
      this.searchForm.current = 1;
      this.getList();
    },
    handleReset() {
      this.searchForm.swerk = undefined;
      this.searchForm.beber = undefined;
      this.searchForm.trlnr = undefined;
      this.searchForm.pltxt = undefined;
      this.searchForm.tplma = undefined;
      this.getList();
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
      this.tableLoading = true;
      if (this.userDetail.regionCode !== '37') {
        this.searchForm.swerk = this.userDetail.erpUnitCode;
      }
      globalattrSearch(this.searchForm).then(res => {
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

        globalattrDel({ids: ids}).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getList()
        })
      })
    },
    // 编辑
    editArrt(row) {
      this.showType = '修改'
      this.arrtId = row.trlnr
      this.showForm = true
    },
    tbClick(type) {
      this.$message.success(type)
    },
    saveGlobalArrt() {
      this.showForm = false
      this.getList()
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

::v-deep .el-input__inner{
    background-color: #FFF !important;
    border-color: #DCDFE6 !important;
}
</style>
