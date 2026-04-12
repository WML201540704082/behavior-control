<template>
  <div>
    <el-form ref="queryForm" :model="queryParams" label-width="auto" @submit.native.prevent>
      <el-row>
        <el-col :span="8">
          <el-form-item label="姓名:" prop="realName">
            <el-input placeholder="请输入姓名" clearable size="mini" v-model="queryParams.realName" @keyup.enter.native="getList"></el-input>
          </el-form-item>
        </el-col>


        <el-col :span="16">
          <el-form-item label-width="12px">
            <div class="d_start v_center d_btns">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getList" :loading="loading">查询</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      ref="dataTable"
      :highlight-current-row="false"
      v-loading="loading"
      :data="tableList"
      :height="tableHeight"
      border
      size="mini"
      style="width: 100%;height:100%;margin-top:5px;">
      <el-table-column type="selection" align="center" width="50" v-if="false"></el-table-column>
      <el-table-column width="50" type="index" :index="Nindex" label="序号" align="center"></el-table-column>
      <el-table-column prop="realName" align="left" label="姓名" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-html="heightLighText(scope.row)"></div>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" align="left" label="部门" show-overflow-tooltip></el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span v-if="scope.row.hasAdd == 1" class="s_hasadd">{{ type == 'add' ? '已添加' : '列表已存在' }}</span>
          <el-button v-else size="mini" type="text" icon="el-icon-edit" @click="handleSel(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
  </div>
</template>

<script>

import {getList, userList, addUser} from "@/api/safeDanger/claimExpertPool"

export default {
  name: "userTable",
  props: ['type'],
  data() {
    return {
      loading: false,
      tableList: [],
      tableHeight: null,

      queryParams: {
        current: 1,
        size: 20,
      },
      // 总条数
      total: 0,
    };
  },
  mounted() {
    this.getCurrentHeight();
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;

      if (this.type == 'add' || this.type == 'edit') {
        getList({current: 1, size: 999}).then(all => {
          userList(this.queryParams).then(res => {
            if (all.data.records && res.data.records) {
              res.data.records.forEach(item => {
                if (all.data.records.find(a => a.userId == item.id)) {
                  item.hasAdd = 1;
                }
              })
            }
            this.tableList = res.data.records;
            this.total = res.data.total;
          }).finally(() => {
            this.loading = false;
          })
        }).catch(() => {
          this.loading = false;
        });
      } else if (this.type == 'todo') {
        getList(this.queryParams).then(res => {
          this.tableList = res.rows;
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
        })
      }
    },
    handleSel(row) {
      if (this.type == 'add') {
        addUser({ userId: row.id }).then(res => {
          this.msgSuccess("新增成功");
          this.$emit('closeDialog');
        });
      } else if (this.type == 'edit') {
        this.$emit('editCallback', row);
      } else if (this.type == 'todo') {
        //来自待处理页面指派按钮功能
        this.$emit('editCallback', row);
      }
    },
    Nindex(index) {
      return index + 1 + (this.queryParams.current - 1) * this.queryParams.size;
    },
    // 获取自适应高度
    getCurrentHeight() {
      let windowHeight = window.innerHeight //窗口高度
      this.tableHeight = (windowHeight - 405) + 'px'
    },
    heightLighText(row) {
      if (row.realName && this.queryParams.realName) {
        let mgText = this.queryParams.realName;
        let reg = new RegExp(mgText, 'gi');
        let newStr = row.realName.replace(reg, (matchedText) => {
          return `<span style="color:#00A9B8;font-weight: bold;">${matchedText}</span>`
        });
        return newStr
      } else {
        return row.realName;
      }
    },
  },
}
</script>
<style scoped>
.el-col-6, .el-col-8, .el-col-16 {
  height: 40px;
}

.s_hasadd {
  color: #C82C2B;
  font-weight: bold;
}
</style>
