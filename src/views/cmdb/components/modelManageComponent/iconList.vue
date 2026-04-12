<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="选择图标"
      width="700px"
      v-el-drag-dialog
    >
      
      <el-row>
        <scrollbarBox>
          <el-col
            :span="3"
            v-for="(item, index) in iconList"
            :key="index"
            class="icon_item"
            :class="activeIcon === item? 'text_primary':'text_action'"
          >
            <i
              style="font-size: 25px;cursor: pointer;"
              :class="item"
              @click="changeIcon(item)"
            ></i>
          </el-col>
        </scrollbarBox>
        
      </el-row>
      <div class="submit_btn">
        <el-button type="primary" size="small" @click="save">确 定</el-button>
        <el-button size="small" @click="$emit('close')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getIconList } from "@/api/system/ciModel";

export default {
  props: ['isShow', 'selectIcon'],
  data() {
    return{
      iconList: [],
      activeIcon: ''
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.activeIcon = this.selectIcon
      getIconList({type: ['cmdb']}).then(res => {
        // console.log(res)
        this.iconList = res.Return
      })
    },
    changeIcon(item) {
      this.activeIcon = item
    },
    save() {
      this.$emit('submitIcon', this.activeIcon)
    },
  }
}
</script>

<style lang="scss" scoped>
.icon_item{
  text-align: center;
}
</style>
