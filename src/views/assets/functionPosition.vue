<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="130px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="维护工厂" prop="swerk">
              <el-select v-model="searchForm.swerk" :disabled="userDetail.regionCode !== '37'" filterable clearable placeholder="请选择维护工厂">
                <el-option
                  v-for="dict in swerkList"
                  :key="dict.code" :label="dict.name" :value="dict.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工厂区域" prop="beber">
              <el-select v-model="searchForm.beber" clearable placeholder="请选择工厂区域">
                <el-option
                  v-for="dict in beberList"
                  :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="功能位置编码" prop="trlnr">
              <el-input
                placeholder="请输入功能位置编码"
                clearable
                v-model="searchForm.trlnr"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="功能位置名称" prop="pltxt">
              <el-input
                placeholder="请输入功能位置名称"
                clearable
                v-model="searchForm.pltxt"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上级功能位置编码" prop="tplma">
              <el-input
                placeholder="请输入上级功能位置编码"
                clearable
                v-model="searchForm.tplma"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="primary"
                 @click="handleQuery">查询
      </el-button>
      <el-button style="margin-left: 5px;" type="primary" plain
                 @click="handleReset">重置
      </el-button>
      <el-button type="primary" style="margin-left: 5px;"
                 @click="()=>{showForm = true; showType = '新增'}">新增
      </el-button>
      <el-button type="danger" style="margin-left: 5px;"
                 @click="delArrt(selectionList)">删除
      </el-button>
    </div>
    <div class="page_body">
      <formTitle :titleText="'功能位置管理'" :titleType="'page_title'"/>
      <el-table
        ref="arrtTable"
        :data="tableData"
        :height="tableHeight"
        stripe
        size="small"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="维护工厂" prop="swerk" width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showSwerkLable(scope.row.swerk, swerkList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="功能位置编码" prop="trlnr" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="功能位置名称" prop="pltxt" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="上级功能位置编码" prop="tplma" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="工厂区域" prop="beber" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.beber, beberList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电压等级" prop="zsbdydj" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.zsbdydj, zsbdydjList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前操作标识" prop="operation" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.operation, operationList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="ERP同步状态" prop="erpStatus" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.erpStatus, statusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="I6000同步状态" prop="i6000Status" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.i6000Status, statusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" width="130" fixed="right" show-overflow-tooltip>
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
              <div style="display: flex;justify-content: space-between">
                <el-dropdown v-if="scope.row.i6000Status == 1 || scope.row.erpStatus == 1">
                  <el-link type="primary" size="mini" :underline="false" icon="el-icon-more"><span class="s_lt">更 多</span></el-link>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="i6000" v-if="scope.row.i6000Status == 1">
                      <el-link type="primary" size="mini" :underline="false" icon="el-icon-refresh" @click="tbClick('i6000')">
                        <span class="s_lt">I6000同步</span>
                      </el-link>
                    </el-dropdown-item>

                    <el-dropdown-item command="erp" v-if="scope.row.erpStatus == 1">
                      <el-link type="primary" size="mini" :underline="false" icon="el-icon-refresh" @click="tbClick('erp')">
                        <span class="s_lt">ERP同步</span>
                      </el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>


            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        :pageSizes="[20,50,100,200]"
        @pagination="getList"/>
    </div>

    <!-- 属性新增弹窗 -->
    <arrtForm
      v-if="showForm"
      :isShow="showForm"
      :arrtId="arrtId"
      :showType="showType"
      @close="showForm = false"
      @saveGlobalArrt="saveGlobalArrt"
    ></arrtForm>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import arrtForm from './components/functionPosition/arrtForm'
import {globalattrSearch, globalattrDel, erpmaintainList} from "@/api/assets/functionPosition";

export default {
  components: {
    arrtForm,
  },
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail'])
  },
  data() {
    return {
      swerkList: [],
      operationList: [
        {
          dictKey: 'C',
          dictValue: '创建'
        },
        {
          dictKey: 'M',
          dictValue: '修改'
        },
        {
          dictKey: 'D',
          dictValue: '删除'
        },
      ],
      beberList: [
        {
          dictKey: '003',
          dictValue: '省公司'
        },
        {
          dictKey: '004',
          dictValue: '县公司'
        },
      ],
      zsbdydjList: [
        {
          dictKey: '07',
          dictValue: '交流220V'
        }
      ],
      statusList: [
        {
          dictKey: 0,
          dictValue: '同步成功'
        },
        {
          dictKey: 1,
          dictValue: '同步失败'
        }
      ],
      selectionList: [],
      searchForm: {
        current: 1,
        size: 20,
        swerk: undefined,
        beber: undefined,
        trlnr: undefined,
        pltxt: undefined,
        tplma: undefined,
      },
      total: 0,

      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗
      showForm: false,
      showType: '',
      arrtId: '',

      exportList: [
        {id: 'D001', name: '导出选中'},
        {id: 'D002', name: '导出搜索'},
        {id: 'D003', name: '导出全部'},
        {id: 'D004', name: '导出记录'},
      ]
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
</style>
