<template>
  <div class="avue-sidebar">
    <logo></logo>
    <top-search
      v-if="themeName === 'theme-xintong'"
    ></top-search>
    <el-button class="menuCon" type="primary" @click="goIndex(menuContent)" v-if="menuContent.name">
      <i :class="[menuContent.source]" style="margin-right: 10px;" v-if="menuContent.source"></i>
      <span style="display: inline-block">
        {{
          menuContent.name
        }}
      </span>
    </el-button>

    <el-scrollbar style="height: calc(100% - 50px)">
      <div v-if="validatenull(menu)"
           class="avue-sidebar--tip">{{$t('menuTip')}}</div>
      <el-menu unique-opened
               :default-active="nowTagValue"
               mode="vertical"
               :show-timeout="200"
               :collapse="keyCollapse">
        <sidebar-item :menu="menu.filter(ele=> ele.name != '信创运维')"
                      :screen="screen"
                      first
                      :props="website.menu.props"
                      :collapse="keyCollapse"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";
import topSearch from "../top/top-search"

export default {
  name: "sidebar",
  components: { sidebarItem, logo, topSearch },
  data() {
    return {
      menuContent: {},
    };
  },
  created() {
    this.$store.dispatch("GetMenu").then(data => {
      // console.log(889123, data, this.menu, this.website)
      this.menuContent = data.filter(ele=>ele.name == '信创运维')[0]


      if (data.length === 0) return;
      this.$router.$avueRouter.formatRoutes(data, true);
    });

    
  },
  computed: {
    ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen", "themeName"]),
    nowTagValue: function() {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  mounted() {},
  methods: {
    goIndex(val) {
      let routerLink = this.$router.resolve({
        // path: '/ictOperationManage',
        path: '/ictHome',
      })
      // window.open(routerLink.href, '_blank')
      window.open(routerLink.href)
    }
  }
};
</script>
<style lang="scss" scoped>
  .menuCon{
    width: 80%;
    height: 42px !important;
    font-size: 18px !important;
    font-weight: bold;
    margin: 0 auto;
    position: relative;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    z-index: 111;
    margin-top: 10px;
    margin-bottom: 0px;
    box-shadow: 0 4px 10px 0 rgba(64, 158, 255, 0.5);
  }
</style>

