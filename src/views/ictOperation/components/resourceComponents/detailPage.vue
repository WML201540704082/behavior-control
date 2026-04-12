<template>
  <div class="detail_page" v-loading="pageLoading">
    <div class="bottom_back"></div>
    <div class="detail_box">
      <div class="detail_left">
        <div class="detail_info">
          <div class="info_top">
            <span class="title">{{detailForm.title}}</span>
            <span class="info_btn">
              <el-button v-if="detailForm.tag == 0" type="primary" size="mini" round @click="fullScreen">全屏</el-button>
              <el-button type="primary" size="mini" round plain @click="$router.push({path: '/ictOperationManage', query:{ third: 1 }})">返回</el-button>
            </span>
          </div>
          <div class="info_middle">
            <span style="margin-right:35px">
              <i class="el-icon-view" style="color:#1061ff"></i>
              浏览量：{{detailForm.viewCount}}
            </span>
            <span>
              <i class="el-icon-time" style="color:#1061ff"></i>
              {{detailForm.createTime}}
            </span>
          </div>
          <div class="info_footer" id="textContent">
            <i style="color:#1061ff">内容简介：</i>
            <span>{{detailForm.content}}</span>
            <span v-if="showTextBtn" class="text_btn" @click="handleShowText">{{isExpand? '展开':'收起'}}</span>
          </div>
        </div>
        <div class="detail_content">
          <iframe class="iframe" v-if="detailForm.tag == 0" :src="detailForm.path" type="application/x-google-chrome-pdf"></iframe>
          <video v-else :src="detailForm.path" controls style="width:100%"></video>
        </div>
      </div>
      <div class="detail_right">
        <div class="resource_card" style="margin-bottom:15px">
          <div class="card_title">
            <img src="../../img/icon1.png" alt="">
            <span>最近浏览</span>
          </div>
          <div class="card_content">
            <div
              class="card_list_item"
              v-for="(item, index) in hotFileList"
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
            <img src="../../img/icon2.png" alt="">
            <span>最新上传</span>
          </div>
          <div class="card_content">
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

      </div>
    </div>
  </div>
</template>

<script>
import { resourceDetail, resourceRecentView, resourceLasted } from "@/api/ictOperation/index"

export default {
  data() {
    return{
      detailForm: {},
      hotFileList: [],
      newFileList: [],
      showTextBtn: false,
      isExpand: true
    }
  },
  mounted() {
    this.getDetail(this.$route.query.id)
    this.getRecentView()
  },
  methods: {
    base64ToUrl(data){
      let base64 = data
      let bstr = atob(base64)
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while(n--){
        u8arr[n] = bstr.charCodeAt(n)
      }
      let blob = new Blob([u8arr], { type: 'application/pdf;chartset=UTF-8' })
      let url = window.URL.createObjectURL(blob)
      return url
    },
    getDetail(id) {
      this.pageLoading = true
      resourceDetail({id}).then(res => {
        // console.log(1231, this.base64ToUrl(res.data.fileOutputStream))
        // res.data.fileOutputStream = this.base64ToUrl(res.data.fileOutputStream)


        this.detailForm = res.data
        this.pageLoading = false
        this.$nextTick(() => {
          let contentBox = document.getElementById('textContent')
          if(contentBox.scrollWidth > contentBox.clientWidth) {
            this.showTextBtn = true
          }else {
            this.showTextBtn = false
          }
          let detailInfo = document.getElementsByClassName('detail_info')
          let detailContent = document.getElementsByClassName('detail_content')
          let detailLeft = document.getElementsByClassName('detail_left')
          detailContent[0].style.height = detailLeft[0].offsetHeight - detailInfo[0].offsetHeight - 40 + 'px'
        })
      })
    },
    getRecentView() {
      let tag
      if(this.$route.query.type == '文档') tag = '0'
      else tag = '1'
      resourceRecentView({tag: tag}).then(res => {
        this.hotFileList = res.data
      })
      resourceLasted({tag: tag}).then(res => {
        this.newFileList = res.data
      })
    },
    fullScreen() {
      window.open(this.detailForm.path)
    },
    seeDetail(item) {
      this.detailForm = {}
      this.showTextBtn = false
      this.isExpand = true
      let contentBox = document.getElementById('textContent')
      contentBox.style.whiteSpace = 'nowrap'
      contentBox.style.overflow = 'hidden'
      this.getDetail(item.id)
    },
    handleShowText() {
      this.isExpand = !this.isExpand
      let contentBox = document.getElementById('textContent')
      if(this.isExpand) {
        contentBox.style.whiteSpace = 'nowrap'
        contentBox.style.overflow = 'hidden'
      }else {
        contentBox.style.whiteSpace = 'wrap'
        contentBox.style.overflow = 'inherit'
      }
      this.$nextTick(() => {
        let detailInfo = document.getElementsByClassName('detail_info')
        let detailContent = document.getElementsByClassName('detail_content')
        let detailLeft = document.getElementsByClassName('detail_left')
        detailContent[0].style.height = detailLeft[0].offsetHeight - detailInfo[0].offsetHeight - 40 + 'px'
      })
    },
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
.detail_page{
  height: 100%;
  background-image: url('../../img/detailback.png');
  position: relative;
  background-repeat: no-repeat;
  padding: 1px;
  .bottom_back{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: calc(100% - 555px);
    background: linear-gradient(180deg, #fff 0%, rgba(206,229,255,0.8) 100%);
    z-index: -1;
  }
  .detail_box{
    margin: 140px 320px 0;
    min-width: 1280px;
    height: calc(100% - 140px);
    display: flex;
    justify-content: space-between;
    .detail_left{
      width: 920px;
      height: 100%;
      background: #fff;
      box-shadow: 0px 4px 25px 0px #e9f0ff;
      padding: 40px 35px 0 40px;
      .detail_info{
        border-bottom: 1px solid #f0f0f0;
        .info_top{
          display: flex;
          justify-content: space-between;
          min-height: 22px;
          line-height: 22px;
          margin-bottom: 15px;
          .el-button{
            height: 30px;
            width: 80px;
          }
          .title{
            color: #000;
            font-family: '黑体';
            font-size: 20px;
            font-weight: bold;
          }
          .info_btn{
            display: flex;
          }
        }
        .info_middle{
          font-size: 14px;
          color: #333;
          span{
            display: inline-block;
            height: 22px;
            line-height: 22px;
            margin-bottom: 20px;
          }
          i{margin-right: 7px;font-weight: bold}
        }
        .info_footer{
          font-size: 14px;
          color: #666;
          line-height: 22px;
          margin-bottom: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 25px;
          position: relative;
          .text_btn{
            position: absolute;
            right: 0px;
            color: #1061ff;
            cursor: pointer;
          }
          i{
            font-style: normal;
          }
        }
      }
      .detail_content{
        height: calc(100% - 117px);
        padding: 20px;
        .iframe{
          width: 100%;
          height: 100%;
        }
      }
    }
    .detail_right{
      width: 335px;
      height: 100%;
      .resource_card{
        background: #fff;
        box-shadow: 0 4px 25px 0 #e9f0ff;
        padding: 18px;
        box-shadow: 0px 4px 25px 0px #e9f0ff;
        border-radius: 4px;
        .card_title{
          display: flex;
          align-items: center;
          font-size: 15px;
          line-height: 20px;
          font-family: '黑体';
          margin-bottom: 20px;
          img{margin-right: 10px;}
        }
        .card_content{
          .card_list_item{
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-bottom: 20px;
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
                font-weight: bold;
                font-size: 16px;
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
      }
    }
  }
}
</style>
