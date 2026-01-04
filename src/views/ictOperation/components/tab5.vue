<template>
<!-- 智能问答 -->
  <div class="intelligenceAnswer">
    <!-- <div v-if="isRoleAlias" class="uploadBtn" @click="showUpload = true">上传问题</div> -->
    <div class="left">
        <div :class="{ leftBtn: true, activeBtn: componentName == 'Knowledge' }" @click="componentName='Knowledge'">
          知识分类管理
        </div>
        <div :class="{ leftBtn: true, activeBtn: componentName == 'Team' }" @click="componentName='Team'">
          运维团队管理
        </div>
    </div>
    <div class="right">
      <component 
        :is="componentName" 
      />
    </div>

  </div>
</template>

<script>
import { knowledgeTree, collectDelete } from "@/api/ictOperation/index"
import { remove } from "@/api/system/dict";
import { formatDate } from "@/util/date"
import {mapGetters,mapState} from "vuex";

import Knowledge from "./system/knowledge.vue";
import Team from "./system/team.vue";

export default {
  components: {
    Knowledge,
    Team
  },
  data() {
    return{
      componentName: 'Knowledge'
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
    
  },
  methods: {
    
  } 
}
</script>

<style lang="scss" scoped>
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
      // background-image: url('../img/searchBack.png');
      // background-size: 100% 100%;
      // background: linear-gradient(45deg, #a4a7ab, #6a7077);
      // background: linear-gradient(45deg, #caced3, #b6babf);
      font-size: 16px;
      // color: #fff;
      padding: 0 20px;
      cursor: pointer;
      margin-bottom: 10px;

      background: none;
      border: 1px solid #1b81e9;
      color: #1b81e9;
    }
    .activeBtn{
      background: linear-gradient(45deg, #3499ff, #493fff);
      // border: 0;
      color: #fff;
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
  .right{
    width: calc(100% - 256px);
    height: 100%;
    padding-left: 0px;
    .search_box{
      padding-top: 15px;
      margin-bottom: 25px;
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


