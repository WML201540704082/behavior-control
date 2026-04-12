<template>
  <div class="avue-contail"
       :class="{'avue--collapse':isCollapse}">
    <div class="avue-header">
      <!-- 顶部导航栏 -->
      <top ref="topRef" :remindList="remindList" @handleNotice="drawer = true" />
    </div>

    <div class="avue-layout">
      <div class="avue-left" v-show="!currentPath">
        <!-- 左侧导航栏 -->
        <sidebar/>
      </div>
      <div :class="{ 'avue-main':true, 'avue-main2':currentPath }">
        <!-- 顶部标签卡 -->
        <tags v-show="!currentPath"/>
        <!-- 主体视图层 -->
        <el-scrollbar style="height:100%">
          <keep-alive v-if="!refreshTag">
            <router-view ref="aliveRtView"
                         class="avue-view"
                         v-if="$route.meta.keepAlive"
                         :key="$route.meta.path"/>
          </keep-alive>
          <router-view class="avue-view"
                       v-if="!$route.meta.keepAlive&&!refreshTag"
                       :key="$route.meta.path"/>
        </el-scrollbar>

      </div>
    </div>
    <!-- <el-footer class="avue-footer">
      <img src="/svg/logo.svg"
           alt=""
           class="logo">
      <p class="copyright">© 2018 Avue designed by smallwei</p>
    </el-footer> -->
    <div class="avue-shade"
         @click="showCollapse"></div>


    <el-drawer
      class="mDrawer"
      title="通知信息"
      :visible.sync="drawer"
      :modal="false"
    >
      <el-card v-for="item in remindList" :key="item.id" @click.native="handleDrawer(item)">
        <div class="item1">{{ item.title }}</div>
        <div class="item2">{{ item.remind }}</div>
        <div class="item3">{{ item.createTime }}</div>
        <div class="dian" v-if="item.isLook === 0"></div>
      </el-card>
    </el-drawer>


    <el-dialog
       class="firstDia"
       title=""
       :visible.sync="firstVisible"
       width="600px"
       :before-close="handleClose"
       :show-close="false">
       <div>
         <div style="text-align: center;font-size: 18px;line-height: 55px;font-weight: 600;margin-bottom: 6px;">用户首次进入系统，请修改密码！</div>
         <!-- <resetPwd :app="true" /> -->
         <el-form :model="queryParams" label-suffix=":" label-width="120px" size="small">
          <el-row :gutter="12">
            <el-col :span="21">
              <el-form-item label="原密码">
                <el-input v-model="queryParams.oldPassword" placeholder="请输入原密码" type="password" show-password clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="21">
              <el-form-item label="新密码">
                <el-input v-model="queryParams.newPassword" placeholder="请输入新密码" type="password" show-password clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="21">
              <el-form-item label="确认密码">
                <el-input v-model="queryParams.newPassword1" placeholder="请输入确认密码" type="password" show-password clearable></el-input>
              </el-form-item>
            </el-col>
            
            <el-col :span="24" style="text-align: center;margin-bottom: 15px;">
              <el-button type="primary" plain size="small" @click="handleSubmit(queryParams)">提 交</el-button>
              <el-button type="info" plain size="small" @click="queryParams = {}">清 空</el-button>
            </el-col>
          </el-row>
        </el-form>
       </div>
     </el-dialog>
  </div>
</template>

<script>
import resetPwd from "@/views/user/info.vue";
import { remindList, reminduserSave } from "@/api/page/index";
import {mapGetters} from "vuex";
import tags from "./tags";
import top from "./top/";
import sidebar from "./sidebar/";
import admin from "@/util/admin";
import {validatenull} from "@/util/validate";
import {calcDate} from "@/util/date.js";
import {getStore} from "@/util/store.js";
import {updatePassword} from "@/api/system/user";

export default {
  components: {
    top,
    tags,
    sidebar,
    resetPwd
  },
  name: "index",
  data() {
    return {
      queryParams: {

      },
      firstVisible: false,
      
      drawer: false,
      remindList: [],


      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: "",
      refreshTag: false,
    };
  },
  watch: {
    $route(to, from) {
      this.$nextTick(() => {
        if (to.meta.keepAlive) {
          let keepView = this.$refs.aliveRtView;
          if (keepView) {
            this.$store.state.common.keepAliveNodes[keepView.$vnode.componentInstance.$route.path] = keepView;
          }
        }
      })
    },
  },
  created() {
    //实时检测刷新token
    //this.refreshToken();

    setTimeout(() => {
      if( this.userDetail.isLogin === 0 ){
        this.firstVisible=true
      }
    }, 200);
  },
  mounted() {
    this.getRemindList()
    this.init();
    this.$EventBus.$on('tagRefresh', () => {
      this.refreshTag = true;
      this.$nextTick(() => {
        this.refreshTag = false;
      })
    });
  },
  computed: {
    ...mapGetters(["isLock", "isCollapse", "website", "userInfo", "userDetail"]),
    currentPath() {
      return this.$route.path == "/wel/index"
    }
  },
  props: [],
  methods: {
    handleSubmit(form) {
      if (form.newPassword && form.newPassword1){
        updatePassword(form.oldPassword, form.newPassword, form.newPassword1,this.userInfo.userId).then(res => {
          if (res.success) {
            this.firstVisible = false
            this.$message({
              type: "success",
              message: "修改密码成功!"
            });
            setTimeout(() => {
              location.reload()
            }, 300);

            // this.$store.dispatch("LogOut").then(() => {
            //   this.$router.push({ path: "/login" });
            // });
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
          
        })
      }else {
        this.$message({
          type: "warning",
          message: "请输入密码!"
        });
      }
    },

    handleClose(done){
      // this.firstVisible=false
    },
    handleDrawer(item){
      reminduserSave({
        remindId: item.id,
        userId: this.userInfo.userId
      }).then(res=>{
        this.getRemindList()
      })
    },
    getRemindList(){
      remindList().then(res=>{
        this.remindList = res.data
      })
    },
    showCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    // 屏幕检测
    init() {
      this.$store.commit("SET_SCREEN", admin.getScreen());
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit("SET_SCREEN", admin.getScreen());
        }, 0);
      };
    },
    // 定时检测一次token
    refreshToken() {
      this.refreshTime = setInterval(() => {
        const token = getStore({
          name: "token",
          debug: true
        }) || {};
        const date = calcDate(token.datetime, new Date().getTime());
        if (validatenull(date)) return;
        if (date.seconds >= this.website.tokenTime && !this.refreshLock) {
          this.refreshLock = true;
          this.$store
            .dispatch("RefreshToken")
            .then(() => {
              this.refreshLock = false;
            })
            .catch(() => {
              this.refreshLock = false;
              clearInterval(this.refreshTime);
            });
        }
      }, 1000);
    },
  }
};
</script>
<style lang="scss" scoped>
::v-deep .mDrawer .el-drawer.ltr, .el-drawer.rtl, .el-drawer__container{
  top: 32px;
}
::v-deep .mDrawer .el-drawer.rtl{
  background: #F7F8FB;
}


</style>
<style lang='scss' scoped>
.avue-main2 {
  position: absolute;
  left: 0;
  width: 100%;
}

.mDrawer{
 .el-card{
    width: 90%;
    margin: 20px auto;
    padding-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1) !important;
    cursor: pointer;
    position: relative;
    overflow: visible;

    .dian{
      position: absolute;
      top: -3px;
      right: -3px;
      width: 10px;
      height: 10px;
      background: red;
      border-radius: 50%;
    }
  } 
  .item1{
    font-size: 14px;
    color: #2c3e50;
  }
  .item2{
    font-size: 14px;
    color: #666;
    margin: 5px 0;
  }
  .item3{
    font-size: 13px;
    color: #666;
  }
  ::v-deep .el-drawer__header{
    padding-top: 15px;
    padding-bottom: 15px;
    margin-bottom: 0;
    background: #fff;
    border-bottom: 1px solid #e7e7e7;
  }
}
</style>
