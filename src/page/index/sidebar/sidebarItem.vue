<template>
  <div class="menu-wrapper">
    <!-- 临时改动， 去掉表单详情页 -->
    <!-- <template v-for="item in menu"> -->

    <template v-for="item in menuList">
      <el-menu-item v-if="validatenull(item[childrenKey]) && vaildRoles(item)"
                    :index="item[pathKey]"
                    @click="open(item)"
                    :key="item[labelKey]"
                    class="firstMenuItem"
                    :class="{'is-active':vaildAvtive(item)}">
        <i :class="item[iconKey]"></i>
        <span slot="title"
              :alt="item[pathKey]">{{ generateTitle(item) }}</span>
      </el-menu-item>
      <el-submenu v-else-if="!validatenull(item[childrenKey])&&vaildRoles(item)"
                  :index="item[pathKey]"
                  :key="item[labelKey]">
        <template slot="title">
          <i :class="item[iconKey]"></i>
          <span slot="title"
                :class="{'el-menu--display':collapse && first}">{{ generateTitle(item) }}</span>
        </template>
        <template v-for="(child,cindex) in item[childrenKey]">
          <el-menu-item :index="child[pathKey],cindex"
                        @click="open(child)"
                        :class="{'is-active':vaildAvtive(child)}"
                        v-if="validatenull(child[childrenKey])"
                        :key="child[labelKey]">
            <i :class="child[iconKey]"></i>
            <span slot="title">{{ generateTitle(child) }}</span>
          </el-menu-item>
          <sidebar-item v-else
                        :menu="[child]"
                        :key="cindex"
                        :props="props"
                        :screen="screen"
                        :collapse="collapse"></sidebar-item>
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import {validatenull} from "@/util/validate";
import config from "./config.js";

export default {
  name: "sidebarItem",
  data() {
    return {
      config: config
    };
  },
  props: {
    menu: {
      type: Array
    },
    screen: {
      type: Number
    },
    first: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => {
        return {};
      }
    },
    collapse: {
      type: Boolean
    }
  },
  created() {
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["roles"]),
    labelKey() {
      return this.props.label || this.config.propsDefault.label;
    },
    pathKey() {
      return this.props.path || this.config.propsDefault.path;
    },
    iconKey() {
      return this.props.icon || this.config.propsDefault.icon;
    },
    childrenKey() {
      return this.props.children || this.config.propsDefault.children;
    },
    nowTagValue() {
      return this.$router.$avueRouter.getValue(this.$route);
    },

    // 临时改动， 去掉表单详情页
    menuList() {
      let menuList = []
      this.menu.forEach((item, index) => {
        if (item.name !== '表单详情页') menuList.push(item)
      })
      return menuList
    },
  },
  methods: {
    generateTitle(item) {
      return this.$router.$avueRouter.generateTitle(
        item[this.labelKey],
        (item.meta || {}).i18n
      );
    },
    vaildAvtive(item) {
      const groupFlag = (item["group"] || []).some(ele =>
        this.$route.path.includes(ele)
      );
      return this.nowTagValue === item[this.pathKey] || groupFlag;
    },
    vaildRoles(item) {
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
    },
    validatenull(val) {
      return validatenull(val);
    },
    open(item) {
      if (item.name != '信创运维') {
        if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
        this.$router.$avueRouter.group = item.group;
        this.$router.$avueRouter.meta = item.meta;
        this.$router.push({
          path: this.$router.$avueRouter.getPath({
            name: item[this.labelKey],
            src: item[this.pathKey],
            i18n: (item.meta || {}).i18n
          }),
          query: item.query
        });
      } else { //信创运维跳转空白页
        let routerLink = this.$router.resolve({
          path: '/ictOperationManage',
        })
        // window.open(routerLink.href, '_blank')
        window.open(routerLink.href)
      }
    }
  }
};
</script>

