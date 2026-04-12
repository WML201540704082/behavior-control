<template>
  <el-color-picker size="mini"
                   style="padding-top:18px;"
                   class="theme-picker"
                   popper-class="theme-picker-dropdown"
                   v-model="themeVal"></el-color-picker>
</template>

<script>
import color from "@/mixins/color";
export default {
  name: "topColor",
  mixins: [color()],
  data() {
    return {
      chalk: ""
    };
  }
};
</script>

<style lang="scss" scoped>
::v-deep .theme-picker .el-color-picker__trigger {
  vertical-align: middle;
}

::v-deep .theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
