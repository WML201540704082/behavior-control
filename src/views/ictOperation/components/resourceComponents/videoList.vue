<template>
  <div class="video_page" v-loading="pageLoading">
    <div class="video_box" >
      <div class="video_list">
        <div
          v-for="(item, index) in videoList"
          :key="index"
          class="video_item"
        >
          <div class="item_left" >
            <img v-if="item.coverPhoto!=''&&item.coverPhoto!=null" :src="item.coverPhoto" alt="">
            <!-- <div class="item_tag">{{item.tag}}</div> -->
          </div>
          <div class="item_right">
            <div class="item_title">{{item.title}}</div>
            <div class="right_footer">
              <div style="margin-bottom:8px;">
                <i class="el-icon-view" style="color:#1061ff"></i>
                浏览量：{{item.viewCount}}
              </div>
              <el-button type="primary" size="mini" round icon="el-icon-document" @click.stop="seeDetail(item, index)">查看</el-button>
              <el-button type="primary" size="mini" round plain @click.stop="downLoad(item)" style="margin-left: 6px;margin-right: 6px;">下载</el-button>
              <el-button type="danger" size="mini" round plain @click.stop="del(item)" style="margin-left: 0px;margin-right: 6px;" v-if="isRoleAlias">删除</el-button>
              <el-button type="primary" size="mini" round plain @click.stop="collect(item)" v-if="item.collectFlag=='未收藏'" style="margin-left: 0px;margin-right: 6px;margin-top: 8px;">收藏</el-button>
              <el-button type="warning" size="mini" round plain @click.stop="collect2(item)" v-if="item.collectFlag=='已收藏'" style="margin-left: 0px;margin-right: 6px;margin-top: 8px;">已收藏</el-button>
              <!-- <el-button type="primary" size="mini" round plain @click.stop="learn(item)" v-if="item.learnFlag=='未学习'" style="margin-left: 0px;margin-top: 8px;">学习</el-button> -->
            </div>
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
      videoList: [],
      total: 0,
      searchForm: {
        current: 1,
        size: 20,
        tag: 1,
        resourceCondition: this.searchText
      },
      pageLoading: false
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
    del(item){
       this.$confirm("是否确认删除!","提示",{
          confirmButtonText:"确认",
          cancelButtonText:"取消",
          type:"warning"
        }).then(()=>{
            resourceDel(item.id).then(res=>{
              this.getList()
              this.$emit('refresh', '1')
              this.$message.success('删除成功!')
            })  
        })
      
    },
    getList() {
      this.pageLoading = true
      resourceList(this.searchForm).then(res => {
        this.videoList = res.data.records
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
        query: {id: item.id, type: '视频'}
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

    collect(item){
      resourceCollect({
        type: 1,
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
        type: 1,
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
.video_page{
  height: 100%;
  .video_box{
    height: calc(100% - 47px);
    overflow: auto
  }
}
.video_list{
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
  ::v-deep .el-button--mini.is-round{
    padding: 7px 15px!important;
    font-size: 12px;
    height: inherit;
  }
  .video_item{
    width: 50%;
    margin-bottom: 35px;
    display: flex;
    height: 140px;
    .item_left{
      width: 230px;;
      height: 140px;
      background: #ebe7e7;
      border-radius: 5px;
      position: relative;
      text-align: center;
      border: 1px solid #ebe7e7;
      img{
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
      .item_tag{
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 11px;
        color: #1061ff;
        background: #cce4ff;
        display: inline-block;
        padding: 1px 5px;
        border-radius: 2px;
        margin-right: 10px;
        white-space: nowrap;
      }
    }
    .item_right{
      width: calc(100% - 200px);
      padding-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .item_title{
        color: #000;
        font-family: '黑体';
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: bold;
        font-size: 16px;
      }
      .right_footer{
        font-size: 14px;
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
