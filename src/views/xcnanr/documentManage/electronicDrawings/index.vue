<template>
  <basic-container>
    <!-- 查询条件 -->
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="50px" class="xt_search_form">
        <el-row :gutter="10" class="align-center">
          <!-- 公司选择 -->
          <el-col :span="6">
            <el-form-item label="公司" prop="companyId">
              <xt-tree-lzay-select :formValue="searchForm.companyName"
                                   :selectType="'CORP'"
                                   @getTreeItem="(v)=>getTreeItem(v,'CORP')" />
            </el-form-item>
          </el-col>
          <!-- 机房选择 -->
          <el-col :span="6">
            <el-form-item label="机房" prop="id">
              <el-input placeholder="请输入机房名" clearable v-model="searchForm.name" :maxlength="20" />
            </el-form-item>
          </el-col>
          <!-- 按钮放在同一行 -->
          <el-col :span="12" align="right">
            <el-button type="primary" @click="handleQuery" style="margin-right: 5px;">查询</el-button>
            <el-button type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 5px;"
                 @click="handleAdd">新增
      </el-button>
      <el-button v-if="permissionList.DelBtn" type="danger" style="margin-left: 5px;"
                 @click="delArrt(selectionList)">删除
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
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>
        <el-table-column label="公司" prop="companyName" align="center" width="220" show-overflow-tooltip></el-table-column>
        <el-table-column label="机房" prop="name" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="照片" prop="dataCount" align="center" width="70" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="display: flex; justify-content: center; align-items: center;">
              <el-link type="primary" size="mini" :underline="false" @click="openModal(scope.row)">
                <span class="s_lt">{{ scope.row.dataCount }}</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" align="center" width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ !scope.row.updateTime ? '-' : formatDateTime(scope.row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="display: flex; justify-content: center; align-items: center;">
              <el-link v-if="permissionList.editBtn" type="primary" size="mini" :underline="false" @click="handleEdit(scope.row)" icon="el-icon-edit">
                <span class="s_lt">编 辑</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        :pageSizes="[10,20,50,100,200]"
        @pagination="getList"/>
    </div>

    <!-- 属性新增编辑弹窗 -->
    <NewDrawingForm ref="newDrawingForm"
                    :operator-type="electronicDrawings.type"
                    :form-detial="electronicDrawings.formDetial"
                    :options = "options"
                    @fetchList="getList"/>
    <modal ref="modal" :room-data = "roomData" @close="fetchList"/>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import NewDrawingForm from './newDrawingForm.vue';
import modal from "./modal.vue";
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import {globalattrSearch, erpmaintainList,deleteElectronicDrawings} from "@/api/xcnanr/electronicDrawings";

export default {
  name: 'ElectronicDrawings',
  components: {
    NewDrawingForm,
    modal,
    xtTreeLzaySelect
  },
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.electronicDrawingsAdd, false),
        editBtn: this.vaildData(this.permission.electronicDrawingsEdit, false),
        DelBtn: this.vaildData(this.permission.electronicDrawingsDel, false),
      }
    }
  },
  data() {
    return {
      swerkList: [],
      electronicDrawings: {
        type: null,
        formDetial: {}
      },
      options: [],
      selectionList: [],
      searchForm: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      roomData: {},
      tableData: [],
      popupVisible: false,
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
    getTreeItem(val,type) {
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
    fetchList(){
      this.getList();
    },
    openModal(row) {
      this.$refs.modal.showForm();

      this.roomData = row
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
      this.searchForm.pageNo = 1;
      this.searchForm.pageSize = 10;
      this.getList();
    },
    handleReset() {
      this.searchForm.pageNo = 1;
      this.searchForm.pageSize = 10;
      this.searchForm.companyId = undefined;
      this.searchForm.companyName = undefined;
      this.searchForm.id = undefined;
      this.searchForm.name = null
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
      globalattrSearch(this.searchForm).then(res => {
        this.tableData = res.data.list;
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
        deleteElectronicDrawings(row).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getList()
        })
      })
    },
    handleAdd() {
      this.$refs.newDrawingForm.showForm();
      this.electronicDrawings.type = 'add';
    },
    handleEdit(row) {
      this.$refs.newDrawingForm.showForm(row);
      this.electronicDrawings.type = 'edit';
      this.electronicDrawings.formDetial = row;
    },
    formatDateTime(dateTime) {
      if (dateTime) {
        return dateTime.replace('T', ' ');
      }
      return '';
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
