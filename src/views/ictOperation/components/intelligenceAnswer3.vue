<template>
<!-- 智能问答 -->
  <div class="intelligenceAnswer">
    <iframe
      src="http://25.41.75.98:32360/chatbot/yOvZPTTLjsTFtEzS"
      style="width: 100%; height: 100%; min-height: 700px"
      allow="microphone">
    </iframe>

    <!-- 上传问题弹窗 -->
    <uploadQuestion
      v-if="showUpload"
      :isShow="showUpload"
      @close="showUpload = false"
    ></uploadQuestion>
    <!-- 新建知识弹窗 -->
    <addKnowledge
      v-if="showUpload2"
      :isShow="showUpload2"
      @close="showUpload2 = false"
    ></addKnowledge>
    <!-- 我的知识弹窗 -->
    <myKnowledge
      v-if="showUpload3"
      :isShow="showUpload3"
      @close="showUpload3 = false"
    ></myKnowledge>
  </div>
</template>

<script>
import { knowledgeList, historyAnswerList, historyAnswerDelete, collect, learnSave, logStastic, newKnowledge } from "@/api/ictOperation/index"
import { formatDate } from "@/util/date"
import uploadQuestion from './intelligenceAnswer/uploadQuestion'
import addKnowledge from './intelligenceAnswer/addKnowledge'
import myKnowledge from './intelligenceAnswer/myKnowledge'
import {mapGetters,mapState} from "vuex";
import { getToken, getUid, getDiffTime, setToken, setUid } from '@/util/auth'
import website from '@/config/website';

export default {
  components: {
    uploadQuestion,
    addKnowledge,
    myKnowledge,
  },
  data() {
    return{
      month: 1,
      active: -1,
      historySearchText: '',
      searchText: '',
      historyList: [],
      searchContentList: [],
      showUpload: false,
      showUpload2: false,
      showUpload3: false,
      isSearch: false,

      newList: [],
      logList: [],
      newLoading: false,
      logLoading: false,

      isHistory: false,
    }
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
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

    this.getHistortList('')
    this.newKnowledge()
    this.logStastic()

  },
  methods: {
    // async fetchReq(message='你好'){
    //   // let arr1 = 'data:data: {"event": "message", "conversation_id": "2983171d-14f2-4d7c-a7d0-cbe592cb9041", "message_id": "45a030ae-6007-4032-81fa-e6e83e928c76", "created_at": 1752229677, "task_id": "98eec519-8eca-4ef2-8d2f-405c4f1e4fee", "id": "45a030ae-6007-4032-81fa-e6e83e928c76", "answer": " ", "from_variable_selector": ["llm", "text"]}\n\n\n'
    //   // let str = arr1.replace(/data:/g, '').replace(/\n/g, '').trim()
    //   // console.log(123, JSON.parse(str))

    //   // return
    //   const API_URL = '/api/idevelop-control/stream';
    //   const API_KEY = '';
    //   let dataJSON = {
    //     "model": "deepseek-r1",
    //     "messages": [
    //       {
    //         "role": "user",
    //         "content": message
    //       }
    //     ],
    //     "stream": true
    //   }

    //   try {
    //     // 发送请求
    //     const response = await fetch(API_URL, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         // 'authorization': 'Bearer '+API_KEY
    //         Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
    //         'Idevelop-Auth': 'bearer ' + getToken()
    //       },
    //       body: JSON.stringify(dataJSON)
    //     })
    //     console.log(889, response)
    //     // if(!response.ok){
    //     //   throw new Error('API请求失败：'+response.status)
    //     // }
    //     // 创建读取器和文本解码器
    //     const reader = response.body.getReader();
    //     const decoder = new TextDecoder();
    //     let accumulatedText = ''; // 存储拼接后的完整内容

    //     // 循环读取流
    //     while(true){
    //       const { done, value } = await reader.read();
    //       if(done){
    //         console.log('流读取完成');
    //         break
    //       }
    //       // 解码二进制数据为文本
    //       const chunk = decoder.decode(value, {stream: true});
    //       console.log(9000, chunk)

    //       let str = chunk.replace(/data:/g, '').replace(/\n/g, '').trim()

    //       if(!str.includes('"event": "message"')) continue

    //       const lines = str.split(',')
    //       // console.log(8000, lines)
    //       let filterLine = lines.filter(line=>{
    //         // console.log(33111, line.trim())
    //         return line.trim().startsWith('"answer"')
    //       })
          
    //       console.log(6000, filterLine)

    //       for (const line of filterLine) {
    //         let line1 = line.trim()
    //         let data1 = line1.replace('"answer": ', '').trim()
    //         console.log('书书书', data1)
    //         data1 = data1.replace(/"/g, '')
    //         // accumulatedText+=data1
    //         // this.content123 += data1
    //       }

    //       // let arr1 = chunk
    //       // let str = arr1.replace(/data:/g, '').replace(/\n/g, '').trim()

    //       // if(str){
    //       //   console.log(123, JSON.parse(str))
    //       // }
    //     }
    //     return accumulatedText
    //   } catch(err){
    //     console.log('API调用错误', err)
    //     throw err
    //   }
    // },
    // updateUI(text){
    //   console.log(90, text)
    // },


    handleClick(val){
      knowledgeList({
        current: 1,
        size: 999,
        resourceCondition: val,
      }).then(res => {
        this.searchContentList = res.data
        this.isSearch = true
        this.getHistortList()
      })
    },
    handleChange(){
      this.logStastic()
    },
    newKnowledge(){
      this.newLoading = true
      newKnowledge().then(res=>{
        this.newList = res.data
        this.newLoading = false
      })
    },
    logStastic(){
      this.logLoading = true
      logStastic({ time: this.month }).then(res=>{
        this.logList = res.data
        this.logLoading = false
      })
    },
    handlelCollect(item){
      collect({ 
        knowledgeId: item.id, 
        isDeleted: 0,
        userId: this.userInfo.userId 
      }).then(res=>{
        this.$message({
          message: '操作成功！',
          type: 'success'
        });
        this.answerSearch()
      })
    },
    handlelStudy(item){
      learnSave({ 
        knowledgeId: item.id
      }).then(res=>{
        this.$message({
          message: '操作成功！',
          type: 'success'
        });
        this.answerSearch()
      })
    },
    getHistortList(val) {
      historyAnswerList({resourceCondition: val}).then(res => {
        if(this.isHistory){
          this.active = 0
          this.isHistory = false
        }
        this.historyList = res.data
        for(let i=0; i<this.historyList.length; i++) {
          let item = this.historyList[i]
          if(item.createTime != null) {
            item.time = formatDate(new Date(item.createTime), 'yyyy年MM月dd日')
          }
        }
      })
    },
    // 历史问答搜索
    querySearchAsync(queryString, cb) {
      if(queryString == '') {
        cb([])
        this.getHistortList('')
      }
      else {
        historyAnswerList({resourceCondition: queryString}).then(res => {
          for(let i=0; i<res.data.length; i++) {
            res.data[i].value = res.data[i].problem
          }
          cb(res.data)
        })
      }
    },
    handleSelect(item) {
      this.getHistortList(item.problem)
    },
    handleHistorySearch() {
      this.getHistortList(this.historySearchText)
    },
    // 查看历史详情
    seeHistoryDetail(item,index) {
      if(index){
        this.active = index;
      }
      this.isHistory = true
      this.searchText = item.problem
      this.answerSearch()
    },
    delHistory(item) {
      this.$confirm('确定删除该历史记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        historyAnswerDelete({id: item.id}).then(res => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.getHistortList()
        })
      })
    },
    handleSearchText() {
      if(this.searchText == '') this.isSearch = false
    },
    // 搜索答案
    answerSearch(val) {
      if(this.searchText == '' && val) {
        this.$message({
          message: '请输入搜索内容！',
          type: 'warning'
        });
      }else {
        knowledgeList({
          current: 1,
          size: 999,
          resourceCondition: this.searchText,
        }).then(res => {
          this.searchContentList = res.data
          this.isSearch = true
          this.getHistortList()
        })
      }
      
    },
    handleReset(){
      this.searchText = ''
      this.searchContentList = []
    }
    
  } 
}
</script>

<style lang="scss" scoped>

.search_emptyc{
  width: 100%;
  display: flex;
  font-size: 16px;
  .col0{
    color: #fe324a;
  }
  .col1{
    color: #ff7f29;
  }
  .col2{
    color: #faaa10;
  }
  >div{
    width: 50%;
  }
  .search_emptyct{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    height: 30px;
  }
  .search_emptyc_item{
    margin-top: 14px;
    cursor: pointer;
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    span{
      margin-right: 10px;
    }
  }
  .search_emptycl{

  }
  .search_emptycr{
    
  }
}
.btnn{
  text-align: right;
  margin-top: 5px;
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
  height: 55vh;
  display: flex;
  justify-content: space-between;
  padding-bottom: 0px;
  position: relative;
  .uploadBtn{
    position: absolute;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 10px;
    background-image: url('../img/searchBack.png');
    background-size: 100% 100%;
    right: -120px;
    top: 15px;
    font-size: 14px;
    color: #fff;
    padding: 0 20px;
    cursor: pointer;
  }
  .left{
    width: 300px;
    height: 100%;
    background: linear-gradient(180deg, #f3f9ff 0%, #dfe3ff 100%);
    border-radius: 10px;
    padding: 15px;
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
            justify-content: space-between;
            .title{
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
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
  .right{
    width: calc(100% - 300px);
    height: 100%;
    padding-left: 65px;
    .search_box{
      padding-top: 15px;
      margin-bottom: 25px;
      display: flex;
      ::v-deep .el-input__inner{
        border-color: #1061ff;
        border-radius: 10px 0 0 10px;
      }
      ::v-deep .el-input-group__append{
        background-image: url('../img/searchBack.png');
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

<style lang="scss" scoped>
::v-deep .el-autocomplete-suggestion{
  padding-bottom: 15px;
}
</style>

