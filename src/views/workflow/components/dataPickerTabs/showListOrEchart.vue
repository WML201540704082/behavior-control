<template>
  <div class="icon-btns">
    <!-- <svg-icon
      :icon-class="!value ? 'bpm-change-to-echarts-active' : 'bpm-change-to-echarts'"
      class="echarts-icon"
      @click="change(2)"/>
    <svg-icon
      :icon-class="value ? 'bpm-change-to-list-active' : 'bpm-change-to-list'"
      class="list-icon"
      @click="change(1)"/> -->

    <el-button type="primary" @click="change(2)">图表</el-button>
    <el-button type="primary" @click="change(1)">列表</el-button>
  </div>
</template>

<script>
export default {
  name: 'ShowListOrEchart',
  props: {
    value: { type: Boolean, default: false } // 是否显示列表， true -- 列表  false -- echarts
  },
  data() {
    return {};
  },
  methods: {
    change(type) {
      // const this = this;
      // 原来显示echarts，现在显示列表
      if (type === 1) {
        this.$emit('updateValue', true);
        this.$emit('change', true);
      }
      // 原来显示列表，现在显示echarts
      if (type === 2) {
        this.$emit('updateValue', false);
        this.$emit('change', false);
      }
    }
  }
};
</script>

<style scoped>
.icon-btns {
  height: 32px;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.list-icon,
.echarts-icon {
  width: 24px;
  height: 24px;
}

.list-icon {
  margin-left: 8px;
}

.el-icon {
  width: 24px;
  height: 24px;
}
</style>
