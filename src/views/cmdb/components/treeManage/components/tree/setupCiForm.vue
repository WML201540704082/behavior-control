<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="() => $emit('close')"
    :show-close="true"
    :append-to-body="false"
    :visible.sync="isShow"
    :title="'['+ ciLabel +'] 详情层级管理'"
    width="1200px"
    v-el-drag-dialog
  >
    <el-form
      :model="searchForm"
      ref="searchForm"
      label-suffix=":"
      label-width="100px"
      size="small"
      class="xt_search_form"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="模型ID" prop="ciId">
            <el-input v-model="searchForm.ciId" disabled="false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="属性英文名" prop="attrName">
            <el-input v-model="searchForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="属性中文名" prop="attrLabel">
            <el-input v-model="searchForm.label"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="search_btn">
        <el-button type="primary" size="small" @click="search">查 询</el-button>
        <el-button size="small" @click="restForm">重 置</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="refresh" :loading="refreshLoading">刷 新</el-button>
      </div>
    </el-form>

    <div class="table_box">
      <el-table
        ref="table"
        :data="tableList"
        stripe
        border
        size="small"
        :height="tableHeight"
        v-loading="tableLoading"
      >
        <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
        <el-table-column label="属性英文名" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="属性中文名" align="center" prop="label" show-overflow-tooltip></el-table-column>
        <el-table-column label="属性id" align="center" prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="属性类型" align="center" prop="type" show-overflow-tooltip></el-table-column>
        <el-table-column label="属性类型文本" align="center" prop="typeText" show-overflow-tooltip></el-table-column>
        <el-table-column label="属性级别" align="center" fixed="right">
          <template slot-scope="{row}">
            <el-select v-model="row.attrGrade" size="mini" @change="changeGrade(row)">
              <el-option
                v-for="item in attrGradeList"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="是否必填" align="center" fixed="right">
          <template slot-scope="{row}">
            <el-select v-model="row.isXtythRequired" size="mini" @change="changeGrade(row)">
              <el-option
                v-for="item in requiredList"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sort" show-overflow-tooltip fixed="right">
          <template slot-scope="{row}">
            <el-input v-model="row.sort" size="mini" placeholder="" @blur="changeGrade(row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="delItem(row)" style="color: #E74032">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="getTableList"
      />
    </div>
  </el-dialog>
</template>

<script>
import {cmdbciattrgradePage, cmdbciattrgradeUpdate, cmdbciattrgradeRefresh, cmdbciattrgradeRemove} from "@/api/device/hardwarebasictree";
import {getDictCmdbList, getDictList} from "@/api/dict";

export default {
  props: ["isShow", "ciId", "ciName", "ciLabel"],
  data() {
    return {
      searchForm: {
        size: 20,
        current: 1
      },
      refreshLoading: false,
      attrGradeList: [],
      requiredList:[],
      tableList: [],
      tableHeight: "500px",
      tableLoading: false,
      total: 0,
    }
  },
  mounted() {
    this.searchForm.ciId = this.ciId
    this.getDict()
    this.getTableList()
  },
  methods: {
    getDict(code) {
      //加载字典 attr_grade
      getDictList('attr_grade').then(res => {
        this.attrGradeList = res.data;
      });

      getDictList('attr_required').then(res => {
        if(res.data){
          res.data.forEach((item,index)=>{
            item.dictKey = parseInt(item.dictKey)
          })
        }
        this.requiredList = res.data;
      });
    },
    getTableList() {
      this.tableLoading = true
      this.searchForm.attrCiId = this.ciId
      cmdbciattrgradePage(this.searchForm).then(res => {
        this.tableList = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      })
    },
    search() {
      this.searchForm.current = 1
      this.getTableList()
    },
    restForm() {
      this.searchForm = {
        size: 20,
        current: 1,
      }
      this.getTableList()
    },
    changeGrade(row) {
      cmdbciattrgradeUpdate({
        attrCiId: row.attrCiId,
        attrGrade: row.attrGrade,
        sort: row.sort,
        isXtythRequired: row.isXtythRequired
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }
      })
    },
    refresh() {
      this.refreshLoading = true
      cmdbciattrgradeRefresh({
        ciId: this.ciId,
        ciName: this.ciName,
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: res.data
          });
          this.refreshLoading = false
          this.restForm();
        }
      })
    },
    delItem(row) {
      this.$confirm("点击确认将永久删除数据且无法恢复，请谨慎选择。", "确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        cmdbciattrgradeRemove({ids: row.attrCiId}).then(res => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.restForm();
          }
        })
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.search_btn {
  margin-bottom: 15px
}
</style>
