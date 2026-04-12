<template>
  <div class="resource_support">
    <div class="left resource_card">
      <div class="left_top">
        <div class="resource_tabs">
          <div class="is_active_line"></div>
          <div class="resource_tabs_item" @click="handleTabs('典型经验')">
            <img src="../img/word.png" alt="">
            <span>典型经验</span>
          </div>
          <div class="resource_tabs_item" @click="handleTabs('文档')">
            <img src="../img/word.png" alt="">
            <span>文档</span>
          </div>
          <div class="resource_tabs_item" @click="handleTabs('视频')">
            <img src="../img/video.png" alt="">
            <span>视频</span>
          </div>
        </div>
        <div class="question_search">
          <el-input v-model="searchText" placeholder="请输入关键词" @keyup.enter.native="searchBtn" :maxlength="200">
             <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <div class="search_btn" @click="searchBtn">查询</div>
        </div>
      </div>
      <div class="left_content">
        <documentList ref="documentList" v-if="activeName == '0'" :searchText="searchText" @refresh="refresh"></documentList>
        <videoList ref="videoList" v-if="activeName == '1'" :searchText="searchText" @refresh="refresh"></videoList>
        <!-- 典型经验 -->
        <typical ref="typical" v-if="activeName == '2'" :searchText="searchText" @refresh="refresh" @seeProblem="seeProblem" @handleShenpi="handleShenpi"></typical>
      </div>
    </div>
    <div class="right">
      <div class="submit-btn resource_card" @click="openTupu">
        <div class="btn_box">
          <img src="../img/uploadicon.png" alt="">
          <span> {{ activeName==='2' ? '知识图谱':'信创课程图谱' }} </span>
        </div>
      </div>
      <!-- 典型经验 -->
      <template v-if="activeName == '2'">
        <!-- <div class="submit-btn resource_card" @click="isCollect = false; questionId = undefined; showUpload2 = true">
          <div class="btn_box">
            <img src="../img/uploadicon.png" alt="">
            <span>新建典型经验</span>
          </div>
        </div>
        <div class="submit-btn resource_card" @click="showUpload3 = true">
          <div class="btn_box">
            <img src="../img/uploadicon.png" alt="">
            <span>我的典型经验</span>
          </div>
        </div> -->

        <div class="btn_box2 submit_question_btn" @click="isCollect = false; isShenpi=false, questionId = undefined; showUpload2 = true">
          <img src="../img/questionicon1.png" alt="">
          <span>新建典型经验</span>
        </div>
        <div class="btn_box2 my_btn" @click="showUpload3 = true">
          <img src="../img/questionicon2.png" alt="">
          <span>我的典型经验</span>
        </div>


        <div class="resource_card" style="margin-bottom:15px">
          <div class="card_title">
            <img src="../img/icon1.png" alt="">
            <span>最新知识</span>
          </div>
          <div class="card_content" style="height:auto;max-height:200px;overflow: auto" v-loading="newLoading">
            <div
              class="card_list_item"
              v-for="(item, index) in newList"
              :key="index"
              @click="seeProblem(item)"
            >
              <div class="item_left">
                <span class="item_index">{{index + 1}}</span>
                <span class="item_title">{{item.problem}}</span>
              </div>
              <!-- <div class="item_right" style="color: #999">{{item.num}}人</div> -->
            </div>
          </div>
        </div>
        <div class="resource_card">
          <div class="card_title">
            <img src="../img/frame.png" alt="">
            <span>知识贡献度排名</span>
          </div>
          <div class="card_pai" style="min-height:280px">
            <!-- :height="'100%'" -->
            <el-table
              ref="questionList"
              :data="questionData"
              stripe
              size="mini"
              v-loading="tableLoading"
            >
              <el-table-column label="排名" prop="isResolve" width="56px" align="center" show-overflow-tooltip>
                <template slot-scope="{ row, $index }">
                  <div :class="['tag', 'tag'+$index]"> {{ $index+1 }} </div>
                </template>
              </el-table-column>
              <el-table-column label="贡献人" prop="dept" align="center" show-overflow-tooltip>
                <template slot-scope="{ row, $index }">
                  <span v-if="row.deptName && row.createBy"> {{ row.deptName }} - {{ row.createBy }} </span>
                  <span v-else> {{ row.deptName }}{{ row.createBy }} </span>
                </template>
              </el-table-column>
              <el-table-column label="数量" prop="count" width="56px" align="center" show-overflow-tooltip></el-table-column>            
            </el-table>
          </div>
        </div>
      </template>
      <!-- 文档-视频 -->
      <template v-else>
        <div v-if="isRoleAlias" class="submit-btn resource_card" @click="showFile = true">
          <div class="btn_box">
            <img src="../img/uploadicon.png" alt="">
            <span>上传材料</span>
          </div>
        </div>
        <div class="resource_card" style="margin-bottom:15px">
          <div class="card_title">
            <img src="../img/icon1.png" alt="">
            <span>最近浏览</span>
          </div>
          <div class="card_content">
            <div
              class="card_list_item"
              v-for="(item, index) in recentViewList"
              :key="index"
              @click="seeDetail(item)"
            >
              <div class="item_left">
                <span class="item_title">{{item.resourceTitle}}</span>
              </div>
              <div class="item_right" style="color: #1061ff">{{item.createTime}}</div>
            </div>
          </div>
        </div>
        <div class="resource_card">
          <div class="card_title">
            <img src="../img/icon2.png" alt="">
            <span>最新上传</span>
          </div>
          <div class="card_content" style="height:auto;max-height:150px;overflow: auto">
            <div
              class="card_list_item"
              v-for="(item, index) in newFileList"
              :key="index"
              @click="seeDetail(item)"
            >
              <div class="item_left">
                <span class="item_index">{{index + 1}}</span>
                <span class="item_title">{{item.title}}</span>
              </div>
              <!-- <div class="item_right" style="color: #999">{{item.num}}人</div> -->
            </div>
          </div>
        </div>
      </template>

      <div class="resource_card" style="margin:10px 0">
        <div class="card_title">
          <img src="../img/icon1.png" alt="">
          <span>最近学习</span>
        </div>
        <div class="card_content">
          <div
            class="card_list_item"
            v-for="(item, index) in nearLearnList"
            :key="index"
            @click="handle1(item)"
          >
            <div class="item_left">
              <span class="item_title">{{item.title}}</span>
            </div>
            <!-- <div class="item_right" style="color: #1061ff">{{item.createTime}}</div> -->
          </div>
        </div>
      </div>
      <div class="resource_card">
        <div class="card_title">
          <img src="../img/icon2.png" alt="">
          <span>最热学习</span>
        </div>
        <div class="card_content" style="height:auto;max-height:150px;overflow: auto">
          <div
            class="card_list_item"
            v-for="(item, index) in hotLearnList"
            :key="index"
            @click="handle1(item)"
          >
            <div class="item_left">
              <span class="item_index">{{index + 1}}</span>
              <span class="item_title">{{item.title}}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 上传材料 -->
    <fileUpload
      v-if="showFile"
      :isShow="showFile"
      :tag="activeName"
      @close="showFile = false"
      @addResource="updateList"
    ></fileUpload>


    <!-- 新建知识弹窗 -->
    <addKnowledge
      v-if="showUpload2"
      :isShow="showUpload2"
      :isCollect="isCollect"
      :isShenpi="isShenpi"
      :questionId="questionId"
      @addClose="addClose"
      @close="showUpload2 = false"
    ></addKnowledge>
    <!-- 我的知识弹窗 -->
    <myKnowledge
      v-if="showUpload3"
      :isShow="showUpload3"
      @close="showUpload3 = false"
    ></myKnowledge>
    <!-- 知识图谱 -->
    <mind
      v-if="showMind"
      :isShow="showMind"
      @seeProblem="seeProblem"
      @close="showMind = false"
    ></mind>
    <!-- 信创课程图谱 -->
    <mind2
      v-if="showMind2"
      :isShow="showMind2"
      @close="showMind2 = false"
    ></mind2>
  </div>
</template>

<script>
import documentList from './resourceComponents/documentList'
import videoList from './resourceComponents/videoList'
import typical from './resourceComponents/typical'
import addKnowledge from './intelligenceAnswer/addKnowledge'
import mind from './intelligenceAnswer/mind'
import mind2 from './intelligenceAnswer/mind2'
import myKnowledge from './intelligenceAnswer/myKnowledge'
import fileUpload from './resourceComponents/fileUpload'
import { resourceList, resourceRecentView, resourceLasted, newKnowledge, personRank, hotLearn, nearLearn } from "@/api/ictOperation/index"
import {mapGetters,mapState} from "vuex";

export default {
  components: { documentList, videoList, typical, fileUpload, addKnowledge, mind, mind2, myKnowledge },
  data() {
    return{
      tableLoading: false,
      questionData: [],

      isShenpi: false,
      isCollect: false,
      questionId: undefined,

      activeName: '2',
      searchText: '',
      recentViewList: [],
      newFileList: [],
      hotLearnList: [],
      nearLearnList: [],
      // 弹窗
      showFile: false,
      showUpload2: false,
      showUpload3: false,

      showMind: false,
      showMind2: false,

      newList: [],
      newLoading: false
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.resource_update, false),
      };
    },
    isRoleAlias(){
      return this.$store.state.user.userDetail.roleAlias.includes('control_solver')
    },
  },
  mounted() {
    this.getHotLearn()
    this.getNearLearn()

    this.getRecentView('0')
    this.getResourceLasted('0')

    this.personRank()
    this.newKnowledge()
  },
  methods: {
    openTupu(){
      if( this.activeName==='2' ){
        this.showMind = true
      }else{
        this.showMind2 = true
      }
    },

    personRank(){
      personRank().then(res=>{
        this.questionData = res.data
      })
    },
    newKnowledge(){
      this.newLoading = true
      newKnowledge().then(res=>{
        this.newList = res.data.slice(0,5)
        this.newLoading = false
      })
    },


    refresh(activeName){
      this.getRecentView(activeName)
      this.getResourceLasted(activeName)
    },
    // 获得最近浏览列表
    getRecentView(tag) {
      resourceRecentView({tag: tag}).then(res => {
        this.recentViewList = res.data
      })
    },
    // 最新上传
    getResourceLasted(tag) {
      resourceLasted({tag: tag}).then(res => {
        this.newFileList = res.data
      })
    },
    getHotLearn(){
      hotLearn().then(res => {
        this.hotLearnList = res.data.slice(0,5)
      })
    },
    getNearLearn(){
      nearLearn().then(res => {
        this.nearLearnList = res.data.slice(0,5)
      })
    },
    
    handleTabs(val) {
      let tabLine = document.getElementsByClassName('is_active_line')
      if(val == '文档') {
        tabLine[0].style.left = '145px'
        this.activeName = '0'

        this.getRecentView(this.activeName)
        this.getResourceLasted(this.activeName)
      }else if(val == '视频') {
        tabLine[0].style.left = '290px'
        this.activeName = '1'

        this.getRecentView(this.activeName)
        this.getResourceLasted(this.activeName)
      }else if(val == '典型经验') {
        tabLine[0].style.left = '5px'
        this.activeName = '2'
      }
      
    },
    updateList() {
      this.showFile = false
      if(this.activeName == 0) {
        this.$refs.documentList.getList()
      }else {
        this.$refs.videoList.getList()
      }
    },

    handle1(item){
      if( item.sourceFlag=='知识' ){
        this.seeProblem(item)
      }else{
        this.$router.push({
          path: '/resourceDetail',
          query: { id: item.id, type: item.type == 1 ? '视频':'文档' }
        })
      }
    },

    seeDetail(item) {
      this.$router.push({
        path: '/resourceDetail',
        query: {id: item.id, type: this.activeName == '0'? '文档':'视频'}
      })
    },
    seeProblem(item){
      this.isShenpi = false
      this.isCollect = true
      this.questionId = item.id
      this.showUpload2 = true
    },
    handleShenpi(item){
      this.isShenpi = true
      this.isCollect = true
      this.questionId = item.id
      this.showUpload2 = true
    },
    addClose(){
      this.$refs.typical.getList()
    },
    searchBtn() {
      if(this.activeName == 0) {
        this.$refs.documentList.search()
      }else if(this.activeName == 1){
        this.$refs.videoList.search()
      }else if(this.activeName == 2){
        this.$refs.typical.search()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.resource_support{
  // height: 100%;
  height: 90vh;
  // overflow-y: auto;
  display: flex;
  justify-content: space-between;
  .resource_card{
    background: #fff;
    box-shadow: 0 4px 25px 0 #e9f0ff;
    padding: 10px;
    .card_title{
      display: flex;
      align-items: center;
      font-size: 15px;
      line-height: 20px;
      font-family: '黑体';
      margin-bottom: 10px;
      img{margin-right: 10px;}
    }
    .card_content{
      .card_list_item{
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        margin-bottom: 12px;
        cursor: pointer;
        &:hover{
          color: #1061ff;
        }
        &:last-child{
          margin-bottom: 0px
        }
        .item_left{
          width: calc(100% - 50px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 20px;
          .item_index{
            margin-right: 20px;
            color: #999;
          }
        }
        .item_right{
          width: 45px;
        }
        &:first-child{
          .item_index{
            color: #ffd02b;
          }
        }
        &:nth-child(2) {
          .item_index{
            color: #6ca3e2;
          }
        }
        &:nth-child(3) {
          .item_index{
            color: #d5a38e;
          }
        }
      }
    }


    .card_pai{
      ::v-deep .ictHome-rc .el-table .el-table__cell{
        height: 35px;
      }
      .tag{
        width: 20px;
        height: 20px;
        text-align: center;
        margin: 0 auto;
        line-height: 20px;
        border-radius: 50%;
        background: #d9e2e9;
        color: #333;
      }
      .tag0{
        background: #e3593c;
        color: #fff;
      }
      .tag1{
        background: #ea993f;
        color: #fff;
      }
      .tag2{
        background: #f3c843;
        color: #fff;
      }
    }
  }
  .left{
    width: 919px;
    height: 145%;
    .left_top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .resource_tabs{
        display: flex;
        color: #333;
        position: relative;
        .is_active_line{
          position: absolute;
          height: 2px;
          width: 120px;
          background: #1061ff;
          bottom: 0px;
          left: 0px;
          transition: all 0.3s;
        }
        .resource_tabs_item{
          margin-right: 25px;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px;
          padding-bottom: 12px;
          width: 120px;
          img{
            margin-right: 10px
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
      height: calc(100% - 62px);
      overflow: auto;
    }
  }
  .right{
    width: 334px;
    height: 100%;
    .submit-btn{
      padding: 10px;
      margin-bottom: 15px;
      cursor: pointer;
      .btn_box{
        background: #eef8ff;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        font-family: '黑体';
        font-size: 18px;
        font-weight: bold;
        img{margin-right: 20px}
      }
    }

    .btn_box2{
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
      margin-bottom: 15px;
    }
    .my_btn{
      border: 1px solid rgba(76,137,255,1);
      margin-bottom: 15px;
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
