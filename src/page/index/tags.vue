<template>
  <div class="avue-tags"
       v-if="showTag">
    <!-- tag盒子 -->
    <div v-if="contextmenuFlag"
         class="avue-tags__contentmenu"
         :style="{left:contentmenuX+'px',top:contentmenuY+'px'}">
      <div class="item"
           @click="refTags">{{ $t('tagsView.refreshPage') }}
      </div>
      <div class="item"
           @click="closeOthersTags">{{ $t('tagsView.closeOthers') }}
      </div>
      <div class="item"
           @click="closeAllTags">{{ $t('tagsView.closeAll') }}
      </div>
    </div>
    <div class="avue-tags__box"
         :class="{'avue-tags__box--close':!website.isFirstPage}">
      <el-tabs v-model="active"
               type="card"
               @contextmenu.native="handleContextmenu"
               :closable="tagLen!==1"
               @tab-click="openTag"
               @edit="menuTag">
        <el-tab-pane :key="item.value"
                     v-for="item in tagList"
                     :label="generateTitle(item)"

                     :name="item.value">
        </el-tab-pane>

      </el-tabs>
      <el-dropdown class="avue-tags__menu">
        <el-button type="primary"
                   size="mini">
          {{ $t('tagsView.menu') }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="closeOthersTags">{{ $t('tagsView.closeOthers') }}</el-dropdown-item>
          <el-dropdown-item @click.native="closeAllTags">{{ $t('tagsView.closeAll') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>
<script>
import {mapGetters, mapState} from "vuex";
import {constants} from 'crypto';
import {win} from "codemirror/src/util/dom";

export default {
  name: "tags",
  data() {
    return {
      active: "",
      contentmenuX: "",
      contentmenuY: "",
      contextmenuFlag: false
    };
  },
  created() {
  },
  mounted() {
    this.setActive();
    // window.addEventListener("mousedown", this.watchContextmenu);
  },
  watch: {
    tag() {
      this.setActive();
    },
    contextmenuFlag(val) {
      if (val) {
        document.body.addEventListener('click', this.watchContextmenu)
      } else {
        document.body.removeEventListener('click', this.watchContextmenu)
      }
    }
  },
  computed: {
    ...mapGetters(["tagWel", "tagList", "tag", "website"]),
    ...mapState({
      showTag: state => state.common.showTag
    }),
    tagLen() {
      return this.tagList.length || 0;
    }
  },
  methods: {
    generateTitle(item) {
      if (item.query.routerTitle) return item.query.routerTitle //跳转公共详情页面时设置路由标题

      return this.$router.$avueRouter.generateTitle( //原有tag标题
        item.label,
        (item.meta || {}).i18n
      );
    },
    watchContextmenu(event) {
      this.contextmenuFlag = false;
      // if (!this.$el.contains(event.target) || event.button !== 0) {
      //   this.contextmenuFlag = false;
      // }
      // window.removeEventListener("mousedown", this.watchContextmenu);
    },
    handleContextmenu(event) {
      let target = event.target;
      // 解决 https://github.com/d2-projects/d2-admin/issues/54
      let flag = false;
      if (target.className.indexOf("el-tabs__item") > -1) flag = true;
      else if (target.parentNode.className.indexOf("el-tabs__item") > -1) {
        target = target.parentNode;
        flag = true;
      }
      if (flag) {
        event.preventDefault();
        event.stopPropagation();
        this.contentmenuX = event.clientX;
        this.contentmenuY = event.clientY;
        this.tagName = target.getAttribute("aria-controls").slice(5);
        this.contextmenuFlag = true;
      }
    },
    //激活当前选项
    setActive() {
      this.active = this.tag.value;
    },
    menuTag(value, action) {
      if (action === "remove") {
        let {tag, key} = this.findTag(value);
        this.$store.commit("DEL_TAG", tag);
        //删除node缓存
        this.delKeepLiveCache(tag.value);
        if (tag.value === this.tag.value) {
          tag = this.tagList[key === 0 ? key : key - 1]; //如果关闭本标签让前推一个
          this.openTag(tag);
        }
      }
    },
    delKeepLiveCache(path) {
      if (this.$store.state.common.keepAliveNodes && this.$store.state.common.keepAliveNodes[path]) {
        let kView = this.$store.state.common.keepAliveNodes[path];
        let vnode = kView.$vnode;
        let parentVnode = vnode && vnode.parent;

        if (parentVnode && parentVnode.componentInstance && parentVnode.componentInstance.cache) {
          let key = vnode.key == null ? vnode.componentOptions.Ctor.cid + (vnode.componentOptions.tag ? `::${vnode.componentOptions.tag}` : '') : vnode.key;
          let cache = parentVnode.componentInstance.cache;
          let keys = parentVnode.componentInstance.keys;
          if (cache[key]) {
            //判断当前返回的页面是不是
            kView.$destroy()
            // remove key
            if (keys.length) {
              var index = keys.indexOf(key)
              if (index > -1) {
                keys.splice(index, 1)
              }
            }
            //移除key和对象
            delete (cache[key])
          }
        }
        //this.$store.state.common.keepAliveNodes[path] = undefined;
        delete (this.$store.state.common.keepAliveNodes[path]);
      }
    },
    openTag(item) {
      let tag;
      if (item.name) {
        tag = this.findTag(item.name).tag;
      } else {
        tag = item;
      }
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          name: tag.label,
          src: tag.value,
          i18n: tag.meta.i18n
        }),
        query: tag.query
      });
    },
    closeOthersTags() {
      this.contextmenuFlag = false;

      this.$store.commit("DEL_TAG_OTHER");
      if (this.$store.state.common.keepAliveNodes) {
        for (const key in this.$store.state.common.keepAliveNodes) {
          //删除node缓存
          if (key != this.active) {
            this.delKeepLiveCache(key);
          }
        }
      }
    },
    findTag(value) {
      let tag, key;
      this.tagList.map((item, index) => {
        if (item.value === value) {
          tag = item;
          key = index;
        }
      });
      return {tag: tag, key: key};
    },
    closeAllTags() {
      this.contextmenuFlag = false;
      this.$store.commit("DEL_ALL_TAG");
      if (this.$store.state.common.keepAliveNodes) {
        for (const key in this.$store.state.common.keepAliveNodes) {
          //删除node缓存
          this.delKeepLiveCache(key);
        }
        this.$store.state.common.keepAliveNodes = {};
      }


      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          src: this.tagWel.value
        }),
        query: this.tagWel.query
      });
    },
    refTags() {
      let {tag, key} = this.findTag(this.$store.state.tags.tag.value);
      if (tag.meta.keepAlive) {
        //删除node缓存
        this.delKeepLiveCache(tag.value);
      }
      this.$EventBus.$emit('tagRefresh');

      // this.contextmenuFlag = false;
      // //获取到当前需要刷新的标签和坐标
      // let {tag, key} = this.findTag(this.$store.state.tags.tag.value);
      // //删除当前需要刷新的坐标
      // this.$store.commit("DEL_TAG", tag);
      // //删除node缓存
      // this.delKeepLiveCache(tag.value);
      //
      // if (this.tagList.length > 0) {
      //   //默认打开首页
      //   this.openTag(this.tagList[0]);
      // }
      // this.$nextTick(() => {
      //   //将当前需要删除的tag插入 tagList 中
      //   this.tagList.splice(key, 0, tag);
      //   this.$router.replace({
      //     path: this.$router.$avueRouter.getPath({
      //       src: tag.value
      //     }),
      //     query: tag.query
      //   });
      //
      //   this.$nextTick(() => {
      //     if (this.$store.state.tags.tag.value === '/wel/index') {
      //       setTimeout(() => {
      //         this.$router.replace({
      //           path: this.$router.$avueRouter.getPath({
      //             src: tag.value
      //           }),
      //           query: tag.query
      //         });
      //       }, 10);
      //     }
      //   });
      // })
    },
  }
};
</script>
<style lang="scss" scoped>
::v-deep .avue-tags .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
//color: #409EFF; //border-bottom: 3px solid #409EFF; //font-weight: bold; color: #FFFFFF !important; font-weight: bold; background-color: #409EFF; border-radius: 3px; line-height: 30px; height: 30px;
}

::v-deep .avue-tags .el-tabs--card > .el-tabs__header .el-tabs__item {
  color: #333333 !important;
}

::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
  -webkit-transition: color 0s cubic-bezier(.645, .045, .355, 1), padding .3s cubic-bezier(.645, .045, .355, 1);
  transition: color 0s cubic-bezier(.645, .045, .355, 1), padding .3s cubic-bezier(.645, .045, .355, 1);
}

</style>


