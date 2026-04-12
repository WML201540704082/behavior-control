<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="() => $emit('close')"
    :show-close="true"
    append-to-body
    :visible.sync="isShow"
    title="图标选择"
    width="1300px"
    top="12vh"
    v-el-drag-dialog>

    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item,index) in iconArray" :name="item.label" :key="item.label">
        <span slot="label"> <i class="el-icon-s-operation"></i>{{ item.label }}</span>
        <el-row :gutter="20">
          <el-col :span="2" v-for="(itemJ,indexJ) in item.list" :key="itemJ">
            <div class="d_icon" @click="iconClick(itemJ)">
              <div class="vh_center"><i icon-class="gitee" :class="itemJ" class="isize"></i></div>
              <div><span>{{ itemJ }}</span></div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import iconList from "@/config/iconList";

export default {
  name: "iconChoose",
  components: {},
  props: ['isShow'],
  data() {
    return {
      activeName: iconList[0].label,
      iconArray: iconList
    };
  },
  mounted() {

  },
  methods: {
    iconClick(itemJ) {
      this.$emit('close');
      this.$emit('chooseClick', {icon: itemJ});
    }
  },
}
</script>
<style lang="scss" scoped>
.btn_box {
  text-align: center;
}

.vh_center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.isize {
  font-size: 20px;
  margin-bottom: 6px;
}

.d_icon {
  height: 100px;
  margin-top: 12px;
  transition: All 0.2s ease-in-out;
  -webkit-transition: All 0.2s ease-in-out;
}

.d_icon:hover {
  cursor: pointer;

  transform: scale(1.2);
}
</style>
