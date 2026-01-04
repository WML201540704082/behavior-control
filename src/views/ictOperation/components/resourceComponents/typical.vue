<template>
  <!-- <div class="wwrap"> -->
  
    <div class="document_box" v-loading="pageLoading">
      <!-- <div :span="14" class="btn_box">
        <el-upload
          ref="upload"
          name="file"
          :limit="1"
          accept=".xlsx,.xls"
          :headers="headers"
          :action="action"
          :before-upload="beforeUpload"
          :on-success="handleFileSuccess"
          :show-file-list="false"
        >
          <el-button size="mini" type="primary" plain style="margin: 0 10px;">上传</el-button>
        </el-upload>
        <el-button size="mini" type="primary" plain @click="handleDownload">模板下载</el-button>
        <el-button size="mini" type="primary" @click="handleExport">导出</el-button>
      </div> -->
      <div class="question_tabs" v-if="isRoleAlias">
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

      <div :class="['document_list', isRoleAlias && 'document_list_t']">
        <div
          class="resource_item"
          v-for="(item, index) in resourceData"
          :key="index"
          
        >
          <!-- <div class="coverImg">
            <img v-if="item.coverPhoto!=''&&item.coverPhoto!=null" :src="item.coverPhoto" alt="">
          </div> -->
          <div class="item_top">
            <!-- <span class="item_tag">{{item.tag}}</span> -->
            <!-- <img src="../../img/wordicon.png" alt=""> -->
            <el-tag size="mini" effect="dark" :type="showDictLable2(item.status)">{{ showDictLable(item.status) }}</el-tag>
            <span class="item_title" @click="handleTitle(item)">{{item.title}}</span>
          </div>
          <!-- <div class="item_middle">
            <i style="color:#1061ff">内容简介：</i>
            <span>{{item.answer}}</span>
          </div> -->
          <div class="item_middle">
            <div class="item_middle_c">
              <span class="line1">问题描述：</span>
              <span class="line2">{{item.problem}}</span>
            </div>
            <div class="item_middle_c" style="margin-top: 6px">
              <span class="line1">解决方案：</span>
              <span class="line2">{{item.answer}}</span>
            </div>
          </div>
          <div class="item_footer">
            <div class="footer_left">
              <el-button type="primary" size="mini" round @click.stop="seeDetail(item, index)" v-if="item.status == 2">查看</el-button>
              <el-button type="primary" size="mini" round plain @click.stop="handle1(item)" v-if="item.status == 1" style="margin-left: 6px;">审核</el-button>
              <el-button type="danger" size="mini" round plain @click.stop="del(item)" v-if="isRoleAlias && item.status == 2" style="margin-left: 6px;">删除</el-button>
              <el-button type="primary" size="mini" round plain @click.stop="collect(item)" v-if=" item.collectFlag=='未收藏' && item.status == 2 && item.result !== '0' " style="margin-left: 6px;">收藏</el-button>
              <el-button type="warning" size="mini" round plain @click.stop="collect2(item)" v-if=" item.collectFlag=='已收藏' && item.status == 2 && item.result !== '0' " style="margin-left: 6px;">已收藏</el-button>
              <!-- <el-button type="primary" size="mini" round plain @click.stop="learn(item)" v-if="item.learnFlag=='未学习'" style="margin-left: 6px;">学习</el-button> -->
            </div>
            <!-- <div class="footer_right">
              <span style="margin-right:10px">
                <i class="el-icon-view" style="color:#1061ff"></i>
                浏览量：{{item.viewCount}}
              </span>
              <span>
                <i class="el-icon-time" style="color:#1061ff"></i>
                {{item.createTime}}
              </span>
            </div> -->

          </div>
        </div>
      </div>
      <div class="pagination_box">
        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"
        />
      </div>

      <operateForm
        v-if="showOperate"
        :isShow="showOperate"
        :questionId="questionId"
        @close="showOperate = false"
        @submitProcess="submitProcess"
      />
    </div>
  <!-- </div> -->
  
</template>

<script>
import { resourceList, knowledgeDelete, collect, resourceLearn, knowledgePage, collectDelete } from "@/api/ictOperation/index"
import operateForm from '../intelligenceAnswer/operateForm'
import {mapGetters,mapState} from "vuex";

export default {
  props: ['searchText'],
  components: { operateForm },
  data() {
    return{
      activeName: '0',
      tabsList: [
        {name: '全部', activeName: '0'},
        {name: '待审核', activeName: '1'},
        {name: '已审核', activeName: '2'},
        {name: '驳回', activeName: '3'}
      ],

      showOperate: false,
      questionId: undefined,

      resourceData: [],
      total: 0,
      searchForm: {
        current: 1,
        size: 20,
        tag: 0,
        resourceCondition: '',
        view: 0
      },
      pageLoading: false,
    }
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
    isRoleAlias(){
      return this.$store.state.user.userDetail.roleAlias.includes('control_solver')
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleTitle(item){
      // console.log(90, item)
      // return
      if(item.status == 1){
        this.handle1(item)
      }else{
        this.seeDetail(item)
      }
    },
    handleTabsItem(item, index) {
      this.activeName = item.activeName
      this.searchForm.view = item.activeName
      this.getList()
    },

    showDictLable(status){
      switch (status) {
        case '0':
          return '暂存'
          // break;
        case '1':
          return '待审核'
          // break;
        case '2':
          return '已审核'
        case '3':
          return '驳回'
          // break;
          // default:
      }
    },
    showDictLable2(status){
      switch (status) {
        case '0':
          return 'warning'
          // break;
        case '1':
          return 'success'
          // break;
        case '2':
          return 'info'
        case '3':
          return 'danger'
      }
    },

    handle1(item){
      this.$emit('handleShenpi', item)
      // this.questionId = item.id
      // this.showOperate = true
    },
    submitProcess(){
      this.showOperate = false
      this.getList()
    },

    getList() {
      this.pageLoading = true
      knowledgePage(this.searchForm).then(res => {
        this.resourceData = res.data.records
        this.total = res.data.total
        this.pageLoading = false
      })
    },
    search() {
      this.searchForm.current = 1
      this.searchForm.resourceCondition = this.searchText
      this.getList()
    },
    seeDetail(item, index) {
      this.$emit('seeProblem', item)
      // this.$router.push({
      //   path: '/resourceDetail',
      //   query: {id: item.id, type: '文档'}
      // })
    }, 
    
    del(item){
      this.$confirm("是否确认删除!","提示",{
        confirmButtonText:"确认",
        cancelButtonText:"取消",
        type:"warning"
      }).then(()=>{
          knowledgeDelete({id: item.id}).then(res=>{
            this.getList()
            // this.$emit('refresh', '0')
            this.$message.success('删除成功!')
          })  
      })
      
    },
    collect(item){
      collect({
        knowledgeId: item.id, 
        isDeleted: 0,
        userId: this.userInfo.userId 
      }).then(res=>{
        this.getList()
        this.$message.success('操作成功!')
      }) 
    },
    collect2(item){
      collectDelete({id: item.id}).then(res => {
        this.getList()
        this.$message.success('操作成功!')
      })
    },
    learn(item){
      resourceLearn({
        type: 0,
        knowledgeId: item.id,
        userId: this.userInfo.userId 
      }).then(res=>{
        this.getList()
        this.$message.success('操作成功!')
      }) 
    },


  }
}
</script>

<style lang="scss" scoped>
::v-deep .btn_box{
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  
}
// .wwrap{
//   width: 100%;
//   height: 100%;

  .question_tabs{
    display: flex;
    color: #999;
    position: absolute;
    left: 0;
    top: 0;
    background: #fff;
    z-index: 1;
    width: 98%;
    padding-bottom: 5px;
    
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
// }
.document_box{
  position: relative;
  height: 100%;
  .document_list{
    height: calc(100% - 47px);
    overflow: auto;
  }
  .document_list_t{
    padding-top: 60px;
  }

  
}
.resource_item{
  padding: 0 15px 20px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
  position: relative;
  // height: 165px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .coverImg{
    height: 140px;
    width: 250px;
    background: #ebe7e7;
    position: absolute;
    left: 0px;
    border-radius: 5px;
    text-align: center;
    border: 1px solid #ebe7e7;
    img{height: 100%;width: 100%;border-radius: 5px;}
  }
  .item_top{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .item_tag{
      font-size: 11px;
      color: #1061ff;
      background: #cce4ff;
      display: inline-block;
      padding: 1px 5px;
      border-radius: 2px;
      margin-right: 10px;
      white-space: nowrap;
    }
    img{
      margin-right: 10px;
    }
    .item_title{
      color: #000;
      font-weight: bold;
      font-family: '黑体';
      margin-left: 10px;
      cursor: pointer;
      &:hover{
        color: #1061ff;
      }
    }
  }
  .item_middle{
    background-color: #ecf5ff;
    padding: 10px;
    border-radius: 3px;
    font-size: 14px;
    margin-bottom: 15px;

    // font-size: 14px;
    // margin-bottom: 20px;
    .item_middle_c{
      display: flex;
      align-items: center;

      .line1{
        width: 70px;
        color:#1061ff;
      }
      .line2{
        flex: 1;
        color:#666
      }
    }
    
    i{
      white-space: nowrap;
      font-style: normal;
    }
    span{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      // padding-right: 15px;
    }
  }
  .item_footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .footer_left{
      ::v-deep .el-button--mini.is-round{
        padding: 7px 15px!important;
        font-size: 12px;
        height: inherit;
      }
    }
    .footer_right{
      font-size: 14px;
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
