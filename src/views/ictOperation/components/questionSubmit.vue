<template>
  <div class="questionSubmit">
    <div class="left">
      <div class="left_top">
        <div class="question_tabs">
          <div
            v-for="(item, index) in tabsList"
            :key="index"
            class="question_tabs_item"
            :class="activeName == item.activeName? 'is_active':''"
            @click="handleTabsItem(item, index)"
          >
            <span>{{item.name}}</span>
          </div>
        </div>
        <div class="question_search">
          <el-input v-model="searchText" placeholder="请输入关键词" @keyup.enter.native="search" :maxlength="200">
             <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <div class="search_btn" @click="search">查询</div>
        </div>
      </div>
      <myQuestionList2 ref="myQuestionList2" :title1="searchText" v-if="isXuqiu"></myQuestionList2>

      <template v-else>
        <div class="left_content question_list" v-loading="pageLoading" ref='scrollContent'>
          <div
            v-for="(item, index) in questionData"
            :key="index"
            class="question_list_item"
          >
            <div class="item_top">
              <!-- <span v-if="item.statusValues=='纳入需求'" class="item_status" :class=" item.isResolve == 0 ? 'item_status1' : 'item_status21' ">{{item.isResolve == 0 ? '处理中':item.statusValues}}</span> -->

              <span class="item_status" :class="'item_status' + item.status">{{item.statusValues}}</span>
              <span class="item_title" @click="seeDetail(item)">{{item.title}}</span>
              <div class="item_time">发布时间：<span style="color:#1061ff">{{item.createTime}}</span></div>
              <!-- <div class="item_time_btn"></div> -->
            </div>
            <div class="item_middle" @click="handleOperate">
              <div class="item_middle_c">
                <span style="color:#1061ff">问题描述：</span>
                <span style="color:#666">{{item.content}}</span>
              </div>
              <div class="item_middle_c" style="margin-top: 6px" v-if="item.status != 1">
                <span style="color:#1061ff">解决方案：</span>
                <span style="color:#666">{{item.comment}}</span>
              </div>
            </div>
            <div class="item_footer">
              <div class="footer_item">
                <img src="../img/frame.png" alt="">
                <span>问题提报人：</span>
                <span>{{item.filler}}</span>
              </div>
              <div class="footer_item">
                <img src="../img/frame.png" alt="">
                <span>联系电话：</span>
                <span>{{item.phone}}</span>
              </div>
              <div class="footer_item">
                <img src="../img/frame.png" alt="">
                <span>业务部门：</span>
                <span>{{item.dept}}</span>
              </div>
              <div class="footer_item">
                <img src="../img/frame.png" alt="">
                <span>紧急程度：</span>
                <span>{{item.urgentLevelName}}</span>
              </div>
            </div>
          </div>
          
        </div>
        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"
        />
      </template>
    </div>
    <div class="right">
      <div class="btn_box submit_question_btn" @click="submitQuestion" v-if="!isRoleAlias">
        <img src="../img/questionicon1.png" alt="">
        <span>我要提问题</span>
      </div>
      <div class="btn_box my_btn" @click="myQuestion" style="margin-bottom: 25px;">
        <img src="../img/questionicon2.png" alt="">
        <span>我的问题单</span>
      </div>
      <div class="btn_box my_btn" @click="$emit('questionBook')" v-if="isRoleAlias">
        <img src="../img/questionicon2.png" alt="">
        <span>问题台账</span>
      </div>
      <div class="tatols">
        <div class="line">24小时内提交问题：<span style="color:#022eff">{{ totals.questionByDay }}</span> </div>
        <div class="line">累计提出问题：<span style="color:#022eff">{{ totals.questionByAll }}</span></div>
        <div class="line">累计解决问题：<span style="color:#022eff">{{ totals.questionByResolve }}</span></div>
        <div class="line">纳入需求问题：<span style="color:#022eff">{{ totals.questionByNeed }}</span></div>
      </div>
    </div>

    <questionDetailForm 
      v-if="showDetail"
      :isShow="showDetail"
      :questionId="questionId"
      @close="showDetail = false"
      @submitProcess="submitProcess"
    />

    <operateForm
      v-if="showOperate"
      :isShow="showOperate"
      :questionId="questionId"
      @close="showOperate = false"
      @submitProcess="submitProcess"
    />

  </div>
</template>

<script>
import operateForm from './questionComponents/operateForm'
import { questionList,processCreate,statistic } from "@/api/ictOperation/index"
import questionDetailForm from './questionComponents/questionDetailForm'
import {mapGetters, mapState} from "vuex";
import myQuestionList2 from './questionComponents/myQuestionList2.vue'

export default {
  components: { questionDetailForm,operateForm,myQuestionList2 },
  data() {
    return{
      totals: {},
      isXuqiu: false,
      activeName: '0',
      tabsList: [
        {name: '全部', activeName: '0', status: undefined},
        // {name: '未受理', activeName: '1', status: '0'},
        {name: '处理中', activeName: '2', status: '1'},
        {name: '已解决', activeName: '3', status: '2'},
        {name: '纳入需求', activeName: '4', status: '3'},
      ],
      searchForm: {
        current: 1,
        size: 20,
        status: undefined,
      },
      total: 0,
      searchText: '',
      pageLoading: false,
      questionData: [],
      questionId: '',
      showDetail: false,
      showOperate:false,
    }
  },
  computed: {
    ...mapGetters([
      "userInfo",
      "isFullScren",
      "tagWel",
      "tagList",
      "isCollapse",
      "tag",
      "logsLen",
      "logsFlag",
      "themeName",
      "userDetail",
    ]),
    isRoleAlias(){
      return this.$store.state.user.userDetail.roleAlias.includes('control_solver')
    }
  },
  mounted() {
    // if( this.isRoleAlias ){
    //   this.tabsList.push({
    //     name: '需求', activeName: '4', status: '3'
    //   })
    // }
    statistic().then(res=>{
      this.totals = res.data
    })


    this.getList()
  },
  methods: {
    // async handleOperate(item,index) {
    //   if(index == 0) {
    //     let createRes = await processCreate({id: item.id})
    //   }
    //   this.questionId = item.id
    //   this.showOperate = true
    // },

    handleOperate(){
      // this.$emit('myQuestionList')
    },
  // submitProcess() {
  //     this.showOperate = false
  //     this.$message({
  //       message: '处理成功！',
  //       type: 'success'
  //     });
  //     this.getList() 
  //   },
    // 获得问题列表
  async  getList() {
      this.pageLoading = true
      await questionList(this.searchForm).then(res => {
        this.questionData = res.data.records
        this.total = res.data.total
        this.pageLoading = false
        this.$nextTick(()=>{
          this.$refs.scrollContent.scrollTop = 0;
        }) 
      })
    },
    search() {
      if( this.activeName == '4' ){ // 需求
        this.$refs.myQuestionList2.getList()
        return
      }

      if(this.searchText == '') this.searchForm.title = undefined
      else this.searchForm.title = this.searchText
      this.getList()
    },
    handleTabsItem(item, index) {
      if( item.activeName == '4' ){
        this.isXuqiu = true
        this.activeName = item.activeName
      }else{
        this.isXuqiu = false
        this.activeName = item.activeName
        this.searchForm.status = item.status
        this.getList()
      }
    },
    submitQuestion() {
      this.$emit('submitQuestion')
    },
    myQuestion() {
      this.$emit('myQuestionList')
    },
    seeDetail(item) {
      this.questionId = item.id
      this.showDetail = true
    },
    submitProcess() {
      this.showDetail = false
      this.getList()
    },
  }
}
</script>

<style lang="scss" scoped>
.questionSubmit{
  // height: 100%;
  height: 180vh;
  display: flex;
  overflow-y: auto;
  .left{
    width: 919px;
    height: 100%;
    box-shadow: 0 4px 25px 0 #e9f0ff;
    background: #fff;
    padding: 15px;
    .left_top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .question_tabs{
        display: flex;
        color: #999;
        .question_tabs_item{
          margin-right: 40px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px;
          &.is_active{
            color: #1061ff;
            background: #eaf4ff;
            border-radius: 4px;
          }
        }
      }
      .question_search{
        overflow: hidden;
        display: flex;
        align-items: center;
        ::v-deep .el-input__inner{
          background-color: #fff;
          border-radius: 30px;
          // border: 1px solid #1061ff;
          border: 1px solid rgba(200,255,255,0.9);
          color: #000;
        }
        ::v-deep .el-input_placeholder{
          color: #000;
        }
        ::v-deep .el-input__icon{
          // color: #1061ff;
          color: #007bff;
        }
        .search_btn{
          white-space: nowrap;
          background-image: url('../img/questionsearch.png');
          background-size: 100% 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #fff;
          padding: 0 20px;
          margin-left: 20px;
          cursor: pointer;
        }
      }
    }
    .left_content{
      height: calc(100% - 107px);
      overflow-y: auto;
      .question_list_item{
        margin-bottom: 20px;
        padding-right: 10px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f0f0f0;
        .item_top{
          width: 100%;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          .item_status{
            font-size: 11px;
            color: #fff;
            
            display: inline-block;
            padding: 1px 5px;
            border-radius: 2px;
            margin-right: 10px;
            white-space: nowrap;
          }
          .item_status.item_status0{
            background: #ffb800;
          }
          .item_status.item_status1{
            background: #00c868;
          }
          .item_status.item_status2{
            background: #c4c4c4;
          }
          .item_status.item_status21{
            background: rgb(230,162,60);
          }
          .item_status.item_status3{
            background: #c4c4c4;
          }
          .item_title{
            font-size: 16px;
            color: #000;
            font-weight: bold;
            line-height: 22px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 20px;
            font-family: '黑体';
            cursor: pointer;
            &:hover{
              color: #1061ff;
            }
          }
          .item_time{
            line-height: 22px;
            flex: 1;
            text-align: right;
            white-space: nowrap;
            font-size: 14px;
          }

        }
        .item_middle{
          background-color: #ecf5ff;
          padding: 10px;
          border-radius: 3px;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .item_footer{
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #333;
          img{vertical-align: bottom; margin-right: 7px;}
        }
      }
    }
  }
  .right{
    flex: 1;
    padding-left: 35px;
    .btn_box{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 61px;
      width: 100%;
      border-radius: 10px;
      font-size: 22px;
      line-height: 61px;
      text-align: center;
      cursor: pointer;
      img{margin-right: 30px}
      
    }
    .submit_question_btn{
      background-image: url('../img/submitbtnback.png');
      background-size: 100% 100%;
      color: #fff;
      margin-bottom: 25px;
    }
    .my_btn{
      border: 1px solid rgba(76,137,255,1);
    }

    .tatols{
        border: 1px solid #4c89ff;
        border-radius: 10px;
        margin-top: 25px;
        padding: 15px 20px;
        .line{
          line-height: 30px;
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
