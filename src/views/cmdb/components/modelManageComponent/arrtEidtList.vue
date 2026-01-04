<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="显示设置"
      width="700px"
      top="10vh"
      v-el-drag-dialog
    >
      <div class="card-head">
        <div class="block-handler text-grey">排序</div>
        <div class="block-name text-grey">字段名称</div>
        <div class="block-type text-grey">字段类型</div>
        <div class="block-showtype text-grey">显示方式</div>
        <div v-if="!isVirtual" class="block-allowedit text-grey">允许编辑</div>
      </div>
      <scrollbarBox>
        <draggable
          v-bind="dragOptions"
          tag="div"
          class="dataSource-ul"
          :list="attrRelList"
          :group="{ name: 'item-sub' }"
          handle=".tsfont-bar"
          :forceFallback="false"
        >
          <div v-for="(item, index) in attrRelList" :key="index" class="card-item">
            <div class="block-handler"><i class="tsfont-bar move"></i></div>
            <div class="block-name">{{ item.itemLabel }}</div>
            <div class="block-type">{{ item.typeText }}</div>
            <div class="block-showtype">
              <el-select v-model="item.showType" size="mini" style="width: 65%">
                <el-option
                  v-for="(item, index) in viewList"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div v-if="!isVirtual" class="block-allowedit">
              <el-select v-if="item.type != 'const'" v-model="item.allowEdit" size="mini" style="width: 65%">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </div>
          </div>
        </draggable>
      </scrollbarBox>
      <div class="submit_btn">
        <el-button type="primary" size="small" @click="save" :loading="saveLoading">确 定</el-button>
        <el-button size="small" @click="$emit('close')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { civiewGetList, showtypeList, civiewsave } from "@/api/system/ciModel";
import draggable from 'vuedraggable';

export default {
  props: ["isShow", "ciId", "isVirtual"],
  data() {
    return{
      dragOptions: {
        animation: 150,
        scroll: true,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      },
      attrRelList: [],
      viewList: [],
      saveLoading: false
    }
  },
  mounted() {
    this.getDict()
    this.getList()
  },
  methods: {
    getList() {
      civiewGetList({ciId: this.ciId}).then(res => {
        this.attrRelList = res.Return
      })
    },
    getDict() {
      showtypeList().then(res => {
        this.viewList = res.Return
      })
    },
    save() {
      this.saveLoading = true
      civiewsave({
        ciId: this.ciId,
        ciViewList: this.attrRelList
      }).then(res => {
        this.$emit('saveView')
        this.saveLoading = false
      }).catch(() => {
        this.saveLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-head {
  position: relative;
  height: 30px;
  .block-handler {
    position: absolute;
    left: 10px;
    line-height: 30px;
  }
  .block-name {
    position: absolute;
    left: 60px;
    top: 0px;
    line-height: 30px;
  }
  .block-type {
    position: absolute;
    left: 250px;
    top: 0px;
    line-height: 30px;
  }
  .block-showtype {
    position: absolute;
    left: 400px;
    top: 0px;
    line-height: 30px;
  }
  .block-allowedit {
    position: absolute;
    left: 550px;
    top: 0px;
    line-height: 30px;
  }
}
.card-item {
  margin-bottom: 10px;
  position: relative;
  height: 30px;
  .block-handler {
    position: absolute;
    left: 10px;
    line-height: 30px;
    cursor: move;
  }
  .block-name {
    position: absolute;
    left: 60px;
    top: 0px;
    line-height: 30px;
  }
  .block-type {
    position: absolute;
    left: 250px;
    top: 0px;
    line-height: 30px;
  }
  .block-showtype {
    position: absolute;
    left: 400px;
    top: 0px;
  }
  .block-allowedit {
    position: absolute;
    left: 550px;
    top: 0px;
  }
}
</style>
