<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <!-- <el-form ref="searchForm" :model="searchForm" label-width="105px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="cmdb模型" prop="cmdbCiName">
              <el-select v-model="searchForm.cmdbCiName" @change="cmdbCiIdChange" clearable filterable
                         placeholder="请选择cmdb模型">
                <el-option
                  v-for="dict in cmdbCiIdList"
                  :key="dict.cmdbCiId" :label="dict.cmdbCiName" :value="dict.cmdbCiName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="cmdb属性" prop="cmdbAttrCode">
              <el-select v-model="searchForm.cmdbAttrCode" :disabled="!searchForm.cmdbCiName" clearable filterable
                         placeholder="请选择cmdb属性">
                <el-option
                  v-for="dict in cmdbAttrCodeList"
                  :key="dict.attrName" :label="dict.attrLabel" :value="dict.attrName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="i6000属性" prop="i6000AttrCode">
              <el-select v-model="searchForm.i6000AttrCode" :disabled="!searchForm.cmdbCiName" clearable filterable
                         placeholder="请选择i6000属性">
                <el-option
                  v-for="dict in i6000AttrCodeList"
                  :key="dict.attrCode" :label="dict.attrName" :value="dict.attrCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form> -->
      <el-row>
          <el-col :span="12" class="newTitle">
            与i6000系统关联字段概览
          </el-col>
          <!-- line-height: 42px; -->
          <el-col :span="12" style="text-align: right;">
            <el-button type="primary"
                 @click="handleQuery">查询
            </el-button>
            <el-button style="margin-left: 5px;" type="primary" plain
                      @click="handleReset">重置
            </el-button>
            <!-- <el-button type="primary" style="margin-left: 5px;"
                      @click="()=>{showForm = true; showType = '新增'}">新增
            </el-button> -->
            <el-button type="success" icon="el-icon-refresh" style="margin-left: 5px;"
                      @click="haldleSync('tbys')" :loading="tbysLoading">同步映射关系
            </el-button>

            <el-button type="success" icon="el-icon-refresh" style="margin-left: 5px;"
                      @click="haldleSync('tbmx')" :loading="tbmxLoading">同步模型
            </el-button>
          </el-col>
      </el-row>
      
    </div>
    <div class="page_body">
      <el-table
        ref="arrtTable"
        :data="tableData"
        :height="tableHeight"
        stripe
        size="small"
        v-loading="tableLoading"
      >
        <el-table-column type="index" align="center" label="序号"></el-table-column>
        <!-- <el-table-column label="信通一体化设备分类" prop="cmdbCiName" align="left" show-overflow-tooltip></el-table-column> -->
        <el-table-column label="信通一体化设备类型" prop="cmdbCiName" align="center" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column label="I6000设备分类" prop="cmdbAttrCode" align="center" show-overflow-tooltip></el-table-column> -->
        <el-table-column label="I6000设备类型" prop="i6000CiId" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="最后关联时间" prop="updateTime" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="与I6000已关联字段数" prop="count" align="center" show-overflow-tooltip></el-table-column>
       

        <el-table-column label="操作" prop="createTime" align="center" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link type="primary" size="mini" :underline="false" icon="el-icon-edit" style="margin-right: 10px"
                     @click="editArrt(scope.row)">编 辑
            </el-link>
            <!-- <el-link type="danger" size="mini" :underline="false" icon="el-icon-delete" style="margin-right: 10px"
                     :disabled="scope.row.invokeCount > 0" @click="delArrt(scope.row)">删 除
            </el-link> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        :pageSizes="[20,50,100,200]"
        @pagination="getList"/> -->
    </div>

    <!-- 新增修改 -->
    <editCom
      v-if="showForm"
      :isShow="showForm"
      :arrtId="arrtId"
      :showType="showType"
      :currentItem="currentItem"
      @close="showForm = false"
      @saveGlobalArrt="saveGlobalArrt"
    ></editCom>
    <!-- 查看关系图 -->
    <checkCom
      v-if="showForm2"
      :isShow="showForm2"
      :arrtId="arrtId"
      :showType="showType"
      @close="showForm2 = false"
      @saveGlobalArrt="saveGlobalArrt"
    ></checkCom>
  </basic-container>
</template>

<script>
import arrtForm from './components/modelMapping/arrtForm'
import editCom from './components/modelMapping/edit'
import checkCom from './components/modelMapping/check'
import {
  globalattrSearch,
  globalattrDel,
  cmdbciattrList,
  i6000ciattrList,
  i6000Mapping,
  checkRefresh,
  mxRefresh,
  cmdbGetList
} from "@/api/system/modelMapping";

export default {
  components: {
    arrtForm,
    editCom,
    checkCom
  },
  data() {
    return {
      currentItem: {},

      cmdbCiIdList: [],
      lll: [
        {
          dictKey: 1,
          dictValue: '手工录入'
        },
        {
          dictKey: 2,
          dictValue: '枚举数据'
        },
        {
          dictKey: 3,
          dictValue: '配置类型'
        },
        {
          dictKey: 4,
          dictValue: '外部数据'
        },
      ],
      cmdbAttrCodeList: [],
      i6000AttrCodeList: [],
      searchForm: {
        current: 1,
        size: 15,
        cmdbCiName: undefined,
        cmdbAttrCode: undefined,
        i6000AttrCode: undefined,
      },
      total: 0,

      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗
      showForm: false,
      showForm2: false,
      showType: '',
      arrtId: '',

      cmdbMxObj: null,
      tbmxLoading: false,
      tbysLoading: false
    }
  },
  mounted() {
    this.setPageContentHeight();
    this.setTableHeight();
    this.getDict();
    this.getList();
  },
  methods: {
    cmdbCiIdChange(val) {
      this.searchForm.cmdbAttrCode = undefined
      this.searchForm.i6000AttrCode = undefined
      let obj = this.cmdbCiIdList.filter(el => {
        return el.cmdbCiName == val
      })[0]
      this.cmdbMxObj = obj;
      cmdbciattrList({
        size: 500,
        current: 1,
        ciId: obj.cmdbCiId
      }).then(res => {
        this.cmdbAttrCodeList = res.data.records
      })
      i6000ciattrList({
        size: 500,
        current: 1,
        ciCode: obj.i6000CiId
      }).then(res => {
        this.i6000AttrCodeList = res.data.records
      })
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
    haldleSync(type) {
      if (!this.cmdbMxObj) {
        this.$alert('请先选择cmdb模型', '提醒', {
          confirmButtonText: this.$t("submitText"),
          cancelButtonText: this.$t("cancelText"),
          type: "warning"
        });
        return;
      }

      if (type == 'tbmx') {
        this.tbmxLoading = true;

        mxRefresh({ciCode: this.cmdbMxObj ? this.cmdbMxObj['i6000CiId'] : null}).then(res => {
          this.$message.success('同步模型请求成功')
        }).finally(() => {
          this.tbmxLoading = false;
        });

      } else if (type == 'tbys') {
        this.tbysLoading = true;
        checkRefresh(this.cmdbMxObj).then(res => {
          this.$message.success('同步映射关系请求成功')
        }).finally(() => {
          this.tbysLoading = false;
        });
      }
    },
    handleReset() {
      this.searchForm.cmdbAttrCode = undefined;
      this.searchForm.i6000AttrCode = undefined;
      this.getList();
    },
    getDict() {
      i6000Mapping().then(res => {
        this.cmdbCiIdList = res.data
      })
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body');
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    getList() {
      this.tableLoading = true;
      cmdbGetList(this.searchForm).then(res => {
        this.tableData = res.data;
        // this.total = res.data.total;
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
        globalattrDel({id: row.id}).then(res => {
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
      this.currentItem = row
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
  .newTitle{
    line-height: 32px;
    color: rgb(70,80,109);
    font-weight: bold;
    font-size: 17px;
    position: relative;
    padding-left: 12px;

    &::before{
      content: "";
      width: 4px;
      height: 17px;
      background: #3a86ff;
      border-radius: 6px;
      margin-right: 10px;
      display: inline-block;
      position: absolute;
      top: 9px;
      left: 0;
    }
  }
</style>
