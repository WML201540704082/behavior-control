<template>
  <!-- 原头部 -->
  <div class="avue-top" v-if="themeName !== 'theme-xintong'">
    <div class="top-bar__left">
      <div class="avue-breadcrumb"
           :class="[{ 'avue-breadcrumb--active': isCollapse }]"
           v-if="showCollapse">
        <i class="icon-navicon"
           @click="setCollapse"></i>
      </div>
    </div>
    <div class="top-bar__title">
      <div class="top-bar__item top-bar__item--show"
           v-if="showMenu">
        <top-menu></top-menu>
      </div>
      <span class="top-bar__item"
            v-if="showSearch">
        <top-search></top-search>
      </span>
    </div>
    <div class="top-bar__right">
      <el-tooltip v-if="showColor"
                  effect="dark"
                  :content="$t('navbar.color')"
                  placement="bottom">
        <div class="top-bar__item">
          <top-color></top-color>
        </div>
      </el-tooltip>
      <!--      <el-tooltip v-if="showDebug"-->
      <!--                  effect="dark"-->
      <!--                  :content="logsFlag?$t('navbar.bug'):logsLen+$t('navbar.bugs')"-->
      <!--                  placement="bottom">-->
      <!--        <div class="top-bar__item">-->
      <!--          <top-logs></top-logs>-->
      <!--        </div>-->
      <!--      </el-tooltip>-->


      <el-tooltip v-if="showTheme"
                  effect="dark"
                  :content="$t('navbar.theme')"
                  placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-theme></top-theme>
        </div>
      </el-tooltip>

      <!--      <el-tooltip effect="dark"-->
      <!--                  :content="$t('navbar.language')"-->
      <!--                  placement="bottom">-->
      <!--        <div class="top-bar__item top-bar__item&#45;&#45;show">-->
      <!--          <top-lang></top-lang>-->
      <!--        </div>-->
      <!--      </el-tooltip>-->
      <el-tooltip v-if="showFullScren"
                  effect="dark"
                  :content="isFullScren?$t('navbar.screenfullF'):$t('navbar.screenfull')"
                  placement="bottom">
        <div class="top-bar__item">
          <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'"
             @click="handleScreen"></i>
        </div>
      </el-tooltip>
      <img class="top-bar__img"
           :src="userInfo.avatar">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.userName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">{{ $t('navbar.dashboard') }}</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">{{ $t('navbar.userinfo') }}</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout"
                            divided>{{ $t('navbar.logOut') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
  <!-- 信通头部 -->
  <div v-else class="avue-top">
    <div class="top-bar__left">
      <div class="top-bar__logo">
        <img src="@/assets/img/xintong_img/logo.png" alt="">
      </div>
      <div class="top-bar__title">
        终端访问行为监控管理平台
      </div>
    </div>
    <div class="top-bar__right">
      <!-- <div class="right_item2">
        <el-dropdown>
          <el-button type="primary">
            问题反馈<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handle1">用户反馈</el-dropdown-item>
            <el-dropdown-item @click.native="handle2">标准型号库反馈</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="right_item">
        <el-tooltip effect="dark" :content="userDetail.deptName" placement="top-start">
          <router-link to="/info/index">
            {{ userInfo.userName }}
          </router-link>
        </el-tooltip>
      </div>

      <div class="right_item d_pointer" @click="helpWord">
        <div><span>帮助文档</span></div>
        <top-help :show-heper="showHelper" v-if="showHelper" @close="showHelper=false"></top-help>
      </div>
      <div class="right_item right_notice d_pointer" @click="notice">
        <div>通知</div>
        <div class="dian" v-if="isNotice"></div>
      </div> -->


      <div class="right_item d_pointer" @click="logout">
        <span style="margin-right: 10px">退出</span>
        <img style="padding-top: 2px" src="@/assets/img/xintong_img/loginout.png" alt="">
      </div>
    </div>



    <!-- 用户反馈新增 -->
    <addedit v-if="componentsParams.isShow"
      :isShow="componentsParams.isShow"
      :type="componentsParams.type"
      @close="close"></addedit>

    <!-- 典型案例库反馈 -->
    <addedit2 v-if="componentsParams.isShow2"
      :isShow="componentsParams.isShow2"
      :type="componentsParams.type2"
      @close="close"></addedit2>
  </div>
</template>
<script>

import { remindList } from "@/api/page/index";
import {mapGetters, mapState} from "vuex";
import {fullscreenToggel, listenfullscreen} from "@/util/util";
import topLock from "./top-lock";
import topMenu from "./top-menu";
import topSearch from "./top-search";
import topTheme from "./top-theme";
import topLogs from "./top-logs";
import topColor from "./top-color";
import topLang from "./top-lang";
import topHelp from "./top-help";

import addedit from "@/views/userFeedback/userFeedback/addedit.vue";
import addedit2 from "@/views/standardmodellibrary/components/addedit.vue";

export default {
  components: {
    topHelp,
    topLock,
    topMenu,
    topSearch,
    topTheme,
    topLogs,
    topColor,
    topLang,

    addedit,
    addedit2
  },
  name: "top",
  data() {
    return {
      showHelper: false,

      componentsParams: {
        isShow: false,
        type: null,
        id: undefined,

        isShow2: false,
        type2: null,
      }
    };
  },
  props: ['remindList'],
  filters: {},
  created() {
  },
  mounted() {
    listenfullscreen(this.setScreen);
  },
  computed: {
    ...mapState({
      showDebug: state => state.common.showDebug,
      showTheme: state => state.common.showTheme,
      showLock: state => state.common.showLock,
      showFullScren: state => state.common.showFullScren,
      showCollapse: state => state.common.showCollapse,
      showSearch: state => state.common.showSearch,
      showMenu: state => state.common.showMenu,
      showColor: state => state.common.showColor
    }),
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

    isNotice(){
      return this.remindList.some(ele=> ele.isLook === 0)
    }
  },
  methods: {
    close() {
      this.componentsParams.isShow = false;
      this.componentsParams.type = null;

      this.componentsParams.isShow2 = false;
      this.componentsParams.type2 = null;
    },

    handle1(){
      this.componentsParams.isShow = true;
      this.componentsParams.type = 'add';
    },
    handle2(){
      this.componentsParams.isShow2 = true;
      this.componentsParams.type2 = 'add';
    },

    notice(){
      this.$emit("handleNotice")
    },
    handleScreen() {
      fullscreenToggel();
    },
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    setScreen() {
      this.$store.commit("SET_FULLSCREN");
    },
    logout() {
      this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({path: "/login"});
        });
      });
    },
    helpWord() {
      //this.$message.warning("功能暂未开放");
      this.showHelper = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.d_pointer:hover {
  cursor: pointer !important;
}

.right_notice{
  position: relative;
  .dian{
    position: absolute;
    top: -3px;
    right: 30px;
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  }
}
</style>
