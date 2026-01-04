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
              <el-form-item label="知识标题" prop="problem">
                <el-input
                  placeholder="请输入知识标题"
                  clearable
                  v-model="searchForm.problem"
                  :maxlength="200"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
            </el-col>
            <el-col :span="8" style="text-align: right;line-height: 38px;">
              <el-button type="primary" size="small" @click="getList">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="table_box">
        <el-table
          ref="questionList"
          :data="tableData"
          :height="'600px'"
          border
          stripe
          size="mini"
          v-loading="tableLoading"
        >
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column label="知识标题" prop="problem" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="知识详情" prop="answer" align="center" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column label="审核状态" prop="status" align="center" show-overflow-tooltip></el-table-column> -->
          <el-table-column label="审核状态" prop="status" show-overflow-tooltip width="80">
              <template  slot-scope="scope">
                <span>{{ showDictLable(scope.row.status) }}</span>
              </template>
            </el-table-column>
          <el-table-column label="审核意见" prop="comment" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip width="140"></el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="handle1(scope.row)" style="margin-right: 12px">查看</el-link>
              <el-link type="danger" :underline="false" @click="delBtn(scope.row)">删除</el-link>
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
      <!-- 新建知识弹窗 -->
      <addKnowledge
        v-if="showUpload2"
        :isCollect="true"
        :questionId="questionId"
        :isShow="showUpload2"
        @close="showUpload2 = false"
      ></addKnowledge>
    </div>

    
  
</template>

<script>
import { collectList, collectDelete } from "@/api/ictOperation/index"
import { formatDate } from "@/util/date"
import {mapGetters,mapState} from "vuex";
import addKnowledge from '../intelligenceAnswer/addKnowledge'

export default {
  components: {
    addKnowledge
  },
  data() {
    return{
      questionId: undefined,
      showUpload2: false,

      searchForm: {
        current: 1,
        size: 20,
        problem: '',
      },
      tableData: [],
      total: 0,
      tableLoading: false,
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
      collectList(this.searchForm).then(res => {
        this.tableData = res.data
        // this.tableData = res.data.records
        // this.total = res.data.total
        this.tableLoading = false
      })
    },
    handle1(item){
      if( item.sourceFlag=='知识' ){
        this.questionId = item.id
        this.showUpload2 = true
      }else{
        this.$router.push({
          path: '/resourceDetail',
          query: { id: item.id, type: item.type == 1 ? '视频':'文档' }
        })
      }
    },
    delBtn(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        collectDelete({id: row.id}).then(res => {
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
::v-deep .el-autocomplete-suggestion{
  padding-bottom: 15px;
}
.menus{
  width: 78px;
  // position: fixed;
  // right: 50px;
  // top: 45%;
  position: absolute;
  right: -120px;
  top: 15px;
  z-index: 999;
  background: #fff;
  box-shadow: 2px 0 20px #ccc;
  padding: 15px 5px 0px;
  border-radius: 5px;
  // border-top-left-radius: 5px;
  // border-bottom-left-radius: 5px;
  text-align: center;
  padding-top: 15px;
  .menus-item{
    cursor: pointer;
    .menus-item-text{
      margin: 4px 0 15px 0;
    }
  }
}
.intelligenceAnswer{
  // height: 100%;
  height: 60vh;
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  position: relative;
  .uploadBtn{
    position: absolute;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 10px;
    background-image: url('../../img/searchBack.png');
    background-size: 100% 100%;
    right: -120px;
    top: 15px;
    font-size: 14px;
    color: #fff;
    padding: 0 20px;
    cursor: pointer;
  }
  .left{
    width: 220px;
    height: 100%;
    background: linear-gradient(180deg, #f3f9ff 0%, #dfe3ff 100%);
    border-radius: 10px;
    padding: 15px;
    .leftBtn{
      width: 100%;
      height: 45px;
      line-height: 45px;
      text-align: center;
      border-radius: 5px;
      // background-image: url('../../img/searchBack.png');
      // background-size: 100% 100%;
      background: linear-gradient(45deg, #3499ff, #493fff);
      font-size: 16px;
      color: #fff;
      padding: 0 20px;
      cursor: pointer;
      margin-bottom: 10px;
    }
    ::v-deep .el-input__inner{
      border-color: #1061ff;
      border-radius: 10px;
      box-shadow: 0px 4px 4px 0px rgba(10,129,255,0.09);
    }
    ::v-deep .el-input__icon {
      color: #1061ff;
    }
    .history_search{
      margin-bottom: 20px;
    }
    .history_content{
      height: calc(100% - 60px);
      & > .title{
        color: #ccc;
        font-size: 13px;
        line-height: 16px;
        margin-bottom: 15px
      }
      .history_list{
        overflow-y: auto;
        height: calc(100% - 31px);
        &_item{
          display: flex;
          font-size: 13px;
          height: 60px;
          padding: 10px;
          margin-bottom: 20px;
          transition: all 0.3s;
          .item_left{
            width: 80%;
            display: flex;
            flex-direction: column;
            justify-content: space-between
          } 
          .item_right{
            width: 20%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #1061ff;
            i{margin-right: 15px;}
            img,i{
              cursor: pointer;
            }
          }
        }
        &_item.is_active{
          border-radius: 6px;
          box-shadow: 0px 4px 4px 0px rgba(10,129,255, 0.1);
          background: #fff;
        }
        &_item:hover{
          border-radius: 6px;
          box-shadow: 0px 4px 4px 0px rgba(10,129,255, 0.1);
          background: #fff;
        }
      }
    }

  }
  .right1{
    // width: calc(100% - 256px);
    // height: 100%;
    // padding-left: 0px;
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
.searchbtn{
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  padding: 0 20px
}
</style>

