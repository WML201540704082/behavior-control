<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="120px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="外部数据code" prop="extCode">
              <el-select v-model="searchForm.extCode" placeholder="请输入外部数据code" clearable>
                <el-option v-for="(item,index) in extCodeList"
                           :key="item.EXT_CODE"
                           :label="item.EXT_NAME"
                           :value="item.EXT_CODE"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="I6000唯一ID" prop="extId">
              <el-input
                placeholder="请输入I6000唯一ID"
                clearable
                v-model="searchForm.extId"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外部数据值名称" prop="extName">
              <el-input
                placeholder="请输入外部数据值名称"
                clearable
                v-model="searchForm.extName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外部数据值父ID" prop="extPid">
              <el-input
                placeholder="请输入外部数据值父ID"
                clearable
                v-model="searchForm.extPid"
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
      <el-button type="primary" style="margin-left: 5px;"
                 @click="delArrt">删除
      </el-button>
    </div>
    <div class="page_body">
      <formTitle :titleText="'外部资源数据管理'" :titleType="'page_title'"/>
      <el-table
        ref="arrtTable"
        :data="tableData"
        :height="tableHeight"
        stripe
        size="small"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <!-- <el-table-column type="index" align="center" label="序号"></el-table-column> -->
        <el-table-column label="序号" prop="rn" align="center" width="50" show-overflow-tooltip></el-table-column>
        <el-table-column label="外部数据code" prop="extCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="I6000唯一ID" prop="extId" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="外部数据值名称" prop="extName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="外部数据值父ID" prop="extPid" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="外部数据值状态" prop="extState" align="center" show-overflow-tooltip></el-table-column>

        <!-- <el-table-column label="i6000属性值源类型" prop="i6000OriType" align="left" :formatter="changeStatus" show-overflow-tooltip></el-table-column> -->

        <!-- <el-table-column label="操作" prop="createTime" align="left" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link type="primary" size="mini" :underline="false" icon="el-icon-edit" style="margin-right: 10px"
                     @click="editArrt(scope.row)">编 辑
            </el-link>
            <el-link type="danger" size="mini" :underline="false" icon="el-icon-delete" style="margin-right: 10px"
                     :disabled="scope.row.invokeCount > 0" @click="delArrt(scope.row)">删 除
            </el-link>
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
import arrtForm from './components/extemal/arrtForm'
import {getExtCodeList, globalattrSearch, globalattrDel} from "@/api/system/extemal";

export default {
  components: {
    arrtForm
  },
  data() {
    return {
      selectionList: [],
      cmdbCiIdList: [],
      cmdbAttrCodeList: [],
      i6000AttrCodeList: [],
      searchForm: {
        current: 1,
        size: 20,
        extCode: undefined,
        extId: undefined,
        extName: undefined,
        extPid: undefined,
      },
      total: 0,

      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗
      showForm: false,
      showType: '',
      arrtId: '',

      extCodeList:null,
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
      this.selectionList = selection.map(item => item.id);
    },
    changeStatus(row) {
      if (row.i6000OriType === '1') {
        return "手工录入"
      } else if (row.i6000OriType === '2') {
        return "枚举数据"
      } else if (row.i6000OriType === '3') {
        return "配置类型"
      } else if (row.i6000OriType === '4') {
        return "外部数据"
      }
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
    handleQuery() {
      this.searchForm.current = 1;
      this.getList();
    },
    handleReset() {
      this.searchForm.extCode = undefined;
      this.searchForm.extId = undefined;
      this.searchForm.extName = undefined;
      this.searchForm.extPid = undefined;
      
      this.getList();
    },
    getDict() {
      getExtCodeList().then(res => {
        this.extCodeList = res.data;
      });
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body');
      this.tableHeight = (bodyBox[0].offsetHeight - 120) + 'px'
    },
    getList() {
      this.tableLoading = true;
      globalattrSearch(this.searchForm).then(res => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 删除
    delArrt() {
      this.$confirm('确定是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        globalattrDel({ids: this.selectionList.join(',')}).then(res => {
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
      this.arrtId = row.id
      this.showForm = true
    },
    saveGlobalArrt() {
      this.showForm = false
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
