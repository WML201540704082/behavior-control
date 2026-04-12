<template>
  <div class="document_box" v-loading="pageLoading">
    <div class="document_list">
      <div
        class="resource_item"
        v-for="(item, index) in resourceData"
        :key="index"
        
      >
        <div class="coverImg">
          <img v-if="item.coverPhoto" :src="item.coverPhoto" alt="">
        </div>
        <div class="item_top">
          <!-- <span class="item_tag">{{item.tag}}</span> -->
          <img src="../../img/wordicon.png" alt="">
          <span class="item_title">{{item.title}}</span>
        </div>
        <div class="item_middle">
          <i style="color:#1061ff">内容简介：</i>
          <span>{{item.content}}</span>
        </div>
        <div class="item_footer">
          <div class="footer_left">
            <el-button type="primary" size="mini" round icon="el-icon-document" @click.stop="seeDetail(item, index)">查看</el-button>
            <el-button type="primary" size="mini" round plain @click.stop="downLoad(item)" style="margin-left: 6px;">下载</el-button>
            <el-button type="danger" size="mini" round plain @click.stop="del(item)" v-if="isRoleAlias" style="margin-left: 6px;">删除</el-button>
            <el-button type="primary" size="mini" round plain @click.stop="collect(item)" v-if="item.collectFlag=='未收藏'" style="margin-left: 6px;">收藏</el-button>
            <el-button type="warning" size="mini" round plain @click.stop="collect2(item)" v-if="item.collectFlag=='已收藏'" style="margin-left: 6px;">已收藏</el-button>
            <!-- <el-button type="primary" size="mini" round plain @click.stop="learn(item)" v-if="item.learnFlag=='未学习'" style="margin-left: 6px;">学习</el-button> -->
          </div>
          <div class="footer_right">
            <span style="margin-right:10px">
              <i class="el-icon-view" style="color:#1061ff"></i>
              浏览量：{{item.viewCount}}
            </span>
            <span>
              <i class="el-icon-time" style="color:#1061ff"></i>
              {{item.createTime}}
            </span>
          </div>

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
  </div>
  
</template>

<script>
import { resourceList, resourceDel, resourceCollect, resourceLearn, collectDelete } from "@/api/ictOperation/index"
import {mapGetters,mapState} from "vuex";

export default {
  props: ['searchText'],
  data() {
    return{
      resourceData: [],
      total: 0,
      searchForm: {
        current: 1,
        size: 20,
        tag: 0,
        resourceCondition: this.searchText
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
    getList() {
      this.pageLoading = true
      resourceList(this.searchForm).then(res => {
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
      this.$router.push({
        path: '/resourceDetail',
        query: {id: item.id, type: '文档'}
      })
    }, 
    downLoad(item) {
      const a = document.createElement('a')
      fetch(item.path).then(res => res.blob()).then(blob => {
        a.href = URL.createObjectURL(blob)
        a.download = item.fileName
        document.body.appendChild(a)
        a.click()
      })
    },
    del(item){
       this.$confirm("是否确认删除!","提示",{
          confirmButtonText:"确认",
          cancelButtonText:"取消",
          type:"warning"
        }).then(()=>{
            resourceDel(item.id).then(res=>{
              this.getList()
              this.$emit('refresh', '0')
              this.$message.success('删除成功!')
            })  
        })
      
    },
    collect(item){
      resourceCollect({
        type: 0,
        knowledgeId: item.id,
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
.document_box{
  height: 100%;
  .document_list{
    height: calc(100% - 47px);
    overflow: auto;
  }
}
.resource_item{
  padding: 0 15px 20px 265px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
  position: relative;
  height: 160px;
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
      font-family: '黑体'
    }
  }
  .item_middle{
    font-size: 14px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    i{
      white-space: nowrap;
      font-style: normal;
    }
    span{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 15px;
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
