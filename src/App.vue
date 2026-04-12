<template>
  <div id="app">
    <!-- <router-view /> -->
    <!--    <keep-alive>-->
    <!--      <router-view-->
    <!--        v-if="$route.meta.keepAlive"-->
    <!--        :key="$route.meta.path"-->
    <!--      />-->
    <!--    </keep-alive>-->

    <!--    此处先不要动，会影响el-menu展开效果-->
    <router-view :key="$route.meta.path"/>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },

  created() {
  },
  methods: {},
  computed: {}
};
</script>
<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

::v-deep .avue--detail .el-col {
  margin-bottom: 0;
}
</style>
