<template>
  <div ref="box" class="menu-box" :class="{ 'is-left': isLeft }">
    <my-svg ref="bg" class="menu-bg" v-bind="bgStyle"></my-svg>
    <nav class="menu">
      <div
        class="menu-item"
        v-for="item in menuList"
        :key="item.id"
        :style="{ top: `${item.y}px`, [isLeft ? 'left' : 'right']: `${item.x}px`}" @click="menuItemClick(item)">
        <div class="menu-item-title" :class="[item.isActive?'menu-item-title_active':'']">
          <span :class="[item.isActive?'menu-item-name_active':'']">{{ item.name }}</span>
          <div
            class="menu-item-title-dot"
            :class="[item.isActive?'menu-item-doc_active':'menu-item-doc_normal']"
          ></div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>

import mySvg from "./svg.vue";
import _ from "lodash";
import {mapGetters} from "vuex";

export default {
  name: 'HelloWorld3',
  components: {mySvg},
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    isLeft: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isNotInited: true,
      box: null,
      bg: null,
      data: null,
    };
  },
  computed: {
    ...mapGetters(["userDetail"]),
    fontColor() {
      if (this.isNotInited) return "blue";
      let color = this.box.computedStyleMap().get("color").toString();

      return color;
    },
    menuList(v) {
      if (this.isNotInited) {
        return []
      }
      const base = 1 / (this.list.length + 1);
      let nlist = this.list.map((x, i) => {
        let bgW = this.bg.s.width;
        let coordinate = this.bg.getCoordinate(base * (i + 1));
        return {...x, x: (bgW - coordinate[0]), y: coordinate[1]};
      });
      v.data = nlist;
      return v.data;
    },
    bgStyle() {
      let s = {color: this.fontColor};
      if (!this.isNotInited) {
        const boxH = this.box.offsetHeight;
        _.assign(s, {height: boxH});
      }
      return s;
    },
  },
  mounted() {
    this.box = this.$refs.box;
    this.bg = this.$refs.bg;
    this.isNotInited = false;
  },
  methods: {
    menuItemClick(item) {
      // this.list.forEach((itemJ, index) => {
      //     itemJ.isActive = false;
      // });
      //
      // item.isActive = true;
      // this.$forceUpdate();


      // if (this.userDetail.regionCode != '37') {
      //   return;
      // }

      if (this.data.length == 1) {
        return;
      }

      this.data.forEach((itemJ, index) => {
        itemJ.isActive = false;
      })
      item.isActive = true;

      this.$emit('menuItemClick', {regionCode: item.regionCode, regionName: item.name});
    },
  }
}
</script>

<style lang="scss" scoped>
#app {
  background-color: #f2f2f2;
  height: 100vh;
  width: 100vw;
}

.menu-box {
  display: flex;
  position: relative;
  height: 100%;
  width: 150px;
}

.menu {
  flex: 1;
}

.menu-bg {
  position: absolute;
  top: 0;
  right: 0px;
  height: 100%;
}

.menu-box.is-left .menu-bg {
  left: 0px;
  right: initial;
  transform: scale(-1, 1);
}

.menu-item {
  position: absolute;
  list-style: none;
  transform: translateY(-50%);

}

.menu-item-title-dot {
  display: inline-block;
  width: 0.7em;
  height: 0.7em;
  padding: 0.2em;
  border-radius: 50%;
  margin-left: 1em;
  margin-right: -0.5em;
  margin-top: 0.3em;
  vertical-align: middle;
  float: right;
  font-size: 10px;
}

.menu-box.is-left .menu-item-title-dot {
  float: left;
  margin-left: -0.5em;
  margin-right: 1em;
}

.menu-item-title {
  font-size: 12px;
  color: #666666;
  white-space: nowrap;
  display: flex;
  justify-content: flex-start;
}

.menu-item-title:hover {
  color: #00A6A2;
  cursor: pointer;
}

.menu-item-name_active {
  display: block;
  transform: scale(1.2);
  transform-origin: left;
  transition: transform 0.2s;
  margin-right: 12px;
}

.menu-item-title_active {
  color: #00A6A2;
  font-weight: bold;
  display: flex;
  justify-content: flex-start;
}

//.menu-item-title_active:hover{
//  color: #00A6A2;
//  font-weight: bold;
//  display: flex;
//  justify-content: flex-start;
//}

.menu-item-doc_normal {
  background: #c7c7c7;
}

.menu-item-doc_active {
  background: #00A6A2;

  transform: scale(1.2);
  transform-origin: left;
  transition: transform 0.2s;
}

.menu-item-title:hover .menu-item-title-dot {
  background: #00A6A2;

  //background: radial-gradient(
  //        orange 40%,
  //        transparent 45%,
  //        transparent 50%,
  //        orange 60%,
  //        orange 100%
  //) !important;
}

.d_oneline {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
