<template>
  <div ref="droot" style="height: 100%">
    <el-container>
      <el-header style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;">
        <el-form ref="queryForm" :model="queryParams" label-width="auto">
          <el-row style="margin-bottom: 12px;">
            <el-col :span="12">
              <el-button :disabled="multipleSelection.length == 0" type="primary" size="mini" icon="el-icon-check" @click="handleSelect">提交选中</el-button>
              <el-button type="primary" size="mini" icon="el-icon-close" @click="handleCancel" style="margin-left: 5px;">取消</el-button>
            </el-col>

            <el-col :span="12" class="d_end">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="handleQuery">查询</el-button>
              <el-button type="primary" size="mini" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="隐患一级分类" prop="hiddenCategory">
                <el-select v-model="queryParams.hiddenCategory" @change="changeHiddenCategory" placeholder="请选择" clearable size="mini">
                  <el-option
                    v-for="dict in firstCategoryList"
                    :key="dict.id"
                    :label="dict.name"
                    :value="dict.id"/>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="隐患二级分类" prop="hiddenType">
                <el-select v-model="queryParams.hiddenType" :disabled="secondCategoryList == null || secondCategoryList.length == 0" placeholder="请选择" clearable
                           size="mini">
                  <el-option
                    v-for="item in secondCategoryList"
                    :value="item.id"
                    :key="item.id"
                    :label="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="隐患内容" prop="hiddenType">
                <el-input v-model="queryParams.content" placeholder="请输入" clearable size="mini"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="padding-left: 20px;padding-top: 0px">
        <div>
          <el-table
            ref="table"
            :data="tableList"
            :height="tableHeight"
            v-loading="loading"
            border
            @select="handleSelectEvent"
            @selection-change="handleSelectionChangeEvent"
            @select-all="handleSelectAllEvent"
            size="mini"
            style="width: 100%;height:100%;margin-top:5px;">
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="content" align="left" label="隐患内容" show-overflow-tooltip></el-table-column>
            <el-table-column prop="rectificationRecord" align="left" label="整改措施" show-overflow-tooltip></el-table-column>
            <el-table-column prop="hiddenThirdName" align="left" label="隐患排查对象" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {libraryList} from "@/api/safeDanger/report"
import {categoryTree} from "@/api/safeDanger/hiddenCategory"
// import {getHiddenPCDict} from "@/util/hiddenDict";

export default {
  name: "anliTable",
  components: {},
  props: ['roomId', 'selectAnlis'],
  data() {
    return {

      tableList: [],
      loading: false,
      tableHeight: undefined,
      // 查询参数
      queryParams: {},
      multipleSelection: [],


      hiddenSourceList: null,
      firstCategoryList: null,
      secondCategoryList: null,
    }
  },
  watch: {
    'queryParams.hiddenCategory'(newVal, oldVal) {
      this.$set(this.queryParams, 'hiddenType', undefined);
      if (newVal) {
        this.secondCategoryList = this.firstCategoryList.filter(el => el.id == newVal)[0].hiddenCategoryVOList
      }
    }
  },
  created() {
    this.initData()
    this.getList();
  },
  mounted() {
    this.$nextTick(() => {
      let windowHeight = this.$refs.droot.clientHeight //窗口高度
      this.tableHeight = (windowHeight - 150) + 'px'
    })
    this.getCurrentHeight()
  },
  methods: {
    getCurrentHeight() {

    },
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.queryParams = {};
      this.handleQuery()
    },

    initData() {
      this.getDicts('hidden_source').then(response => {
        this.hiddenSourceList = response.data
      });


      // 隐患分类(一级、二级、三级)
      categoryTree().then(response => { // 一级
        this.firstCategoryList = response.data
      })
    },
    getList() {
      this.loading = true
      libraryList(this.queryParams).then(response => {
        this.tableList = response.rows;

        this.$nextTick(() => {
          if (this.selectAnlis) {
            this.tableList.forEach(item1 => {
              this.selectAnlis.forEach(item2 => {
                if (item1.id == item2.id) {
                  this.$refs.table.toggleRowSelection(item1, true);
                }
              });
            });
          }
        });
      }).finally(() => {
        this.loading = false
      })
    },
    handleSelectionChangeEvent(val) {
      this.multipleSelection = val;
    },
    handleSelectEvent(selection, row) {
      if (this.multipleSelection.length >= 5) {
        this.$refs.table.toggleRowSelection(row, false)
        this.$message.warning('最多只能选5个')
      }
    },
    handleSelectAllEvent(selection) {
      if (selection.length >= 5) {
        selection.splice(5, selection.length - 5);
        this.$refs.table.clearSelection();

        selection.forEach(row => {
          this.$refs.table.toggleRowSelection(row, true);
        })
        this.$message.warning('最多只能选5个')
      }
    },
    handleSelect() {
      let list = JSON.parse(JSON.stringify(this.$refs.table.selection));
      list.forEach((item, index) => {
        item.name = `案例${index + 1}`;
      });
      this.$emit('select', list)
    },
    handleCancel() {
      this.$emit('closeRoom')
    },
    handleClose() {
      this.hiddenDialogVisible = false
      this.getList();
    },

    // 隐患分类选中
    changeHiddenCategory(value) {
      if (value || value === 0) {
        let data;
        if (value == 0) { // 机房
          data = this.categoryList
          data.forEach(el => el.dictLabel = el.category)
        } else {
          data = this.supervisionList
          data.forEach(el => el.dictLabel = el.supervision)
        }
        this.hiddenCategoryList2 = data
      } else {
        this.hiddenCategoryList2 = []
      }
    },

    // 格式化数据
    formatHiddenSource(row) {
      return this.selectDictLabel(this.hiddenSourceList, row.hiddenSource)
    },
  }
}
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}

.el-select {
  width: 100%;
}

.el-input {
  width: 100%;
}

.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100% !important;
}

.el-col-24 {
  height: 50px;
}


::v-deep .danger-row {
  background: red;
  color: #333;
}

::v-deep .el-dialog__body {
  height: 50vh !important;
}

::v-deep .el-form-item {
  margin-bottom: 0;
}

.hiddenDetail .el-dialog__body {
  height: 30vh !important;
}

.d_end {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
}
</style>
