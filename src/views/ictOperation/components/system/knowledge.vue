<template>
<!-- 智能问答 -->

 
    <div class="right1">
      <div class="list_content_search">
        <el-form
          ref="searchForm"
          :model="searchForm"
          label-suffix=":"
          label-width="100px"
          class="xt_search_form xt_search_form3"
        >
          <el-row :gutter="6">
            <el-col :span="8">
              <el-form-item label="知识分类名称" prop="name">
                <el-input
                  placeholder="请输入知识分类名称"
                  clearable
                  v-model="searchForm.name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!-- <el-form-item label="问题类型" prop="type">
                <el-input
                  placeholder="请输入功能位置名称"
                  clearable
                  v-model="searchForm.pltxt"
                ></el-input>
              </el-form-item> -->
            </el-col>
            <el-col :span="8" style="text-align: right;line-height: 38px;">
              <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
              <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
              <el-button type="danger" size="small" @click="delBtn">删除</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="table_box">
        <el-table
          ref="questionList"
          :data="tableData"
          default-expand-all
          row-key="id"
          :tree-props="{ children: 'children',hasChildren:'hasChildren1' }"
          :height="'500px'"
          border
          stripe
          size="mini"
          v-loading="tableLoading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="50"></el-table-column>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <!-- <el-table-column label="字典编号" prop="code" align="center" show-overflow-tooltip></el-table-column> -->
          <el-table-column label="知识分类名称" prop="title" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="知识分类键值" prop="key" align="center" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column label="排序" prop="sort" align="center" show-overflow-tooltip></el-table-column> -->
          <!-- <el-table-column label="审核状态" prop="status" align="center" show-overflow-tooltip></el-table-column> -->
          <!-- <el-table-column label="审核状态" prop="status" show-overflow-tooltip width="80">
              <template  slot-scope="scope">
                <span>{{ showDictLable(scope.row.status) }}</span>
              </template>
            </el-table-column>
          <el-table-column label="审核意见" prop="comment" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip width="140"></el-table-column> -->
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="handleSee(scope.row)" style="margin-right: 12px">查看</el-link>
              <el-link type="primary" :underline="false" @click="handleEdit(scope.row)" style="margin-right: 12px">编辑</el-link>
              <el-link type="danger" :underline="false" @click="delBtn(scope.row)" style="margin-right: 12px">删除</el-link>
              <el-link type="primary" :underline="false" @click="handleAddChildren(scope.row)">新增子项</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"
        /> -->
      </div>
      <dictDia :is-show="deptManagerParams.isShow"
        v-if="deptManagerParams.isShow"
        :type="deptManagerParams.type"
        :form-detial="deptManagerParams.formDetial"
        @close="componentClose"
      ></dictDia>
    </div>

</template>

<script>
import { knowledgeTree, collectDelete } from "@/api/ictOperation/index"
import { remove } from "@/api/system/dict";
import { formatDate } from "@/util/date"
import {mapGetters,mapState} from "vuex";

import dictDia from "../dictDia.vue";

export default {
  components: {

    dictDia
  },
  data() {
    return{
      deptManagerParams: {
        isShow: false,
        type: null,
        formDetial: {}
      },


      searchForm: {
        name: '',
        current: 1,
        size: 20,
        problem: '',
      },
      tableData: [
        // {
        //   children: [
        //     {
        //       hasChildren: false,
        //       id: "1927307476133990402",
        //       key: "3",
        //       parentId: "1916660965215526913",
        //       title: "类型1子项",
        //       value: "1927307476133990402"
        //     }
        //   ],
        //   hasChildren: true,
        //   id: "1916660885007851521",
        //   key: "-1",
        //   parentId: "0",
        //   title: "知识类型1",
        //   value: "1916660885007851521"
        // }
      ],
      total: 0,
      tableLoading: false,

      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    isRoleAlias(){
      return this.$store.state.user.userDetail.roleAlias.includes('control_solver')
    },
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.knowleage_upload, false),
      };
    },
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleAdd() {
      this.deptManagerParams.type = 'add';
      this.deptManagerParams.isShow = true;
    },
    handleAddChildren(row) {
      row.parentId = row.id
      row.id = undefined
      this.deptManagerParams.type = 'addchildren';
      this.deptManagerParams.formDetial = row;
      this.deptManagerParams.isShow = true;

      // this.selectId = row.id;
    },
    handleSee(row) {
      row.dictValue = row.title
      row.dictKey = row.key
      this.deptManagerParams.type = 'see';
      this.deptManagerParams.formDetial = row;
      this.deptManagerParams.isShow = true;
    },
    handleEdit(row) {
      row.dictValue = row.title
      row.dictKey = row.key
      let arr1 = JSON.parse(JSON.stringify(row))
      this.deptManagerParams.type = 'edit';
      this.deptManagerParams.formDetial = arr1;
      this.deptManagerParams.isShow = true;

      // this.selectId = row.id;
    },
    
    componentClose() {
      this.deptManagerParams = {
        isShow: false,
        type: null,
        formDetial: {}
      };
      this.getList()
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSearch(){
      this.getList()
    },
    showDictLable(status){
      switch (status) {
        case '0':
          return '暂存'
          // break;
        case '1':
          return '已提交'
          // break;
        case '2':
          return '已完成'
          // break;
        // default:
        //   break;
      }
    },
    getList() {
      this.tableLoading = true
      knowledgeTree(this.searchForm).then(res => {
        this.tableData = res.data
        // this.tableData = res.data.records
        // this.total = res.data.total
        this.tableLoading = false
      })
    },

    delBtn(row) {
      if(this.multipleSelection.length==0){
        return this.$message.warning('请选择删除项！')
      }

      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = undefined
        if(row.id){
          params = row.id
        }else{
          let ids = this.multipleSelection.map(item => item.id)
          params = ids.join(',')
        }
        remove(params).then(res => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.getList()
        })
      })
    },
  } 
}
</script>

<style lang="scss" scoped>
  ::v-deep .xt_search_form3 .el-input__inner {
    background-color: #FFF;
    border-color: #DCDFE6;
  }

  

  .right1{
    width: 100%;
    height: 100%;

    .search_box{
      padding-top: 15px;
      margin-bottom: 25px;
      ::v-deep .el-input__inner{
        border-color: #1061ff;
        border-radius: 10px 0 0 10px;
      }
      ::v-deep .el-input-group__append{
        background-image: url('../../img/searchBack.png');
        background-size: 100% 100%;
        text-align: center;
        color: #fff;
        border-radius: 0 10px 10px 0;
        border-width: 0px;
        padding: 0px
      }
    }
    .search_list{
      height: calc(100% - 80px);
      overflow: auto;
      padding-left: 40px;
      padding-top: 10px;
      &_item{
        border-radius: 10px;
        background: #fff;
        box-shadow: 0px 0px 25px 0px rgba(0,56,255,0.1);
        padding: 20px;
        margin: 0px 10px 35px;
        position: relative;
        .search_icon{
          position: absolute;
          top: 0;
          left: -50px;
        }
        .title{
          color: #000;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 20px;
          font-family: 'fangsong'
        }
        .content{
          color: #57668d;
          font-size: 13px;
        }
      }
    }
  }

::-webkit-scrollbar{
  width: 5px;
  height: 5px;
}
::v-deep ::-webkit-scrollbar-button{
  display: none
}
::-webkit-scrollbar-thumb{
  background: #bed4ff;
  border-radius: 3px
}
::-webkit-scrollbar-track{
  margin: 5px
}

</style>

<style lang="scss" scoped>
::v-deep .el-autocomplete-suggestion{
  padding-bottom: 15px;
}
</style>

