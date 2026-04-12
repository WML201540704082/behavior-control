<template>
  <div>
    <el-container>
      <el-header style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;">
        <el-form ref="queryForm" :model="queryParams" label-width="auto">
          <el-row style="padding: 0 20px;display: flex;align-items: center" :gutter="30">
            <el-col :span="8">
              <el-form-item label="所属分类:">
                <el-input v-model="category" size="mini" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8" v-if="fromType!='yhtb'">
              <el-form-item label="隐患分类标准" prop="type">
                <el-select v-model="queryParams.type" placeholder="请选择" clearable size="mini">
                  <el-option
                    v-for="dict in options"
                    :key="dict.name"
                    :label="dict.name"
                    :value="dict.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8" v-if="fromType!='yhtb'">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="handleQuery">查询</el-button>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd" style="margin-left: 5px;">新增</el-button>
              <el-button type="primary" icon="el-icon-edit" size="mini" :disabled="multipleSelection.length != 1" @click="handleUpdate" style="margin-left: 5px;">修改
              </el-button>
              <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleDel" :disabled="multipleSelection.length == 0" style="margin-left: 5px;">删除
              </el-button>
            </el-col>

          </el-row>
        </el-form>
      </el-header>
      <el-main style="padding-left: 20px;padding-top: 0px">
        <div>
          <el-table
            :data="tableList"
            :height="tableHeight"
            v-loading="loading"
            border
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%;height:100%;margin-top:5px;">
            <el-table-column
              type="selection"
              align="center"
              width="50"
              v-if="fromType!='yhtb'">
            </el-table-column>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="type" label="分类标准" show-overflow-tooltip width="200"></el-table-column>
            <el-table-column prop="content" align="left" label="隐患内容" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" align="left" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="80" v-if="fromType=='yhtb'">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="btnClick(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>

    <!-- 隐患新增 -->
    <div class="hiddenDetail" v-if="hiddenDialogVisible">
      <el-dialog :modal-append-to-body="false" :title="hiddenDialogTitle" style="padding: 0px;"
                 :close-on-click-modal="false" :visible.sync="hiddenDialogVisible"
                 :before-close="handleClose" width="45%">
        <hidden-detial @closeRoom="closeDialog"
                       :roomId="roomId"
                       :type="hiddenType"
                       :info="detailObj"
                       :category="category"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import HiddenDetial from "./hiddenDetial";
import {hiddenList, hiddenDelete, securityDelete} from "@/api/safeDanger/hiddenCategory"
// import {getHiddenPCDict} from "@/utils/hiddenDict";

export default {
  name: "hiddenTable",
  components: {HiddenDetial},
  props: {
    category: {
      type: String,
      default: null
    },
    roomId: {
      type: Number,
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    fromType: {
      type: String,
      default: null
    },
    yhbz: {
      type: String,
      default: null
    },
  },
  data() {
    return {
      detailObj: {},
      // options: getHiddenPCDict,
      options: [],
      tableList: [],
      loading: false,
      tableHeight: undefined,
      // 查询参数
      queryParams: {
        categoryId: '',
        type: '',
      },
      multipleSelection: [],


      hiddenDialogVisible: false,
      hiddenDialogTitle: '',
      hiddenType: false,
    }
  },
  created() {
    this.getList();
  },
  mounted() {

  },
  methods: {
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    handleAdd() {
      this.hiddenDialogTitle = '新增'
      this.hiddenDialogVisible = true
      this.hiddenType = 'add';
    },

    formatRectificationStatus(row) {
      if (row.rectificationStatus == 1) {
        return '已整改'
      } else {
        return '未整改'
      }
    },
    closeDialog() {
      this.hiddenDialogVisible = false
      this.getList();
    },
    getList() {
      this.queryParams.categoryId = this.roomId
      this.loading = true

      if(this.fromType == 'yhtb'){
        //来自隐患提报
        this.queryParams.type = this.yhbz;
      }

      hiddenList(this.queryParams).then(response => {
        this.tableList = response.data
      }).finally(() => {
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      this.ids = []
      this.multipleSelection = val;
    },
    btnClick(row){
      this.$emit('select',row);
    },
    handleUpdate() {
      this.hiddenDialogTitle = '修改'
      this.detailObj = this.multipleSelection[0]
      this.hiddenDialogVisible = true
      this.hiddenType = 'edit'
    },
    handleDel() {
      this.$confirm('是否确认删除选中数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        hiddenDelete(this.multipleSelection.map(item => {
          return item.id;
        })).then(res => {
          this.$message.success(res.msg)
          this.getList()
        })
      })
    },

    handleClose() {
      this.hiddenDialogVisible = false
      this.getList();
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
</style>
