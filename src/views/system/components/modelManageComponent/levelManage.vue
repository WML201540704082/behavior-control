<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="选择图标"
      width="650px"
      top="10vh"
      v-el-drag-dialog
    >
      <div class="card-head">
        <div class="block-handler text-grey">排 序</div>
        <div class="block-name text-grey">名 称</div>
        <div class="block-key text-grey">关 键 类 型</div>
        <div class="block-topo text-grey">拓 扑 中 显 示</div>
        <div class="block-type text-grey">模 型 数 量</div>
        <div class="block-showtype text-grey"></div>
      </div>
      <div style="height:600px">
        <el-scrollbar style="height:100%">
          <draggable
            v-bind="dragOptions"
            tag="div"
            class="dataSource-ul"
            :list="ciTypeList"
            :group="{ name: 'item-sub' }"
            handle=".tsfont-bar"
            :forceFallback="false"
            @start="moveStart"
            @end="moveEnd"
          >
            <div v-for="(item, index) in ciTypeList" :key="index" class="card-item">
              <div class="block-handler">
                <div v-if="!item.isDeleted"><i class="tsfont-bar move"></i></div>
              </div>
              <div class="block-name">
                <div v-if="!item.isDeleted">
                  <el-input
                    v-model="item.name"
                    :maxlength="30"
                    show-word-limit
                    border="border"
                    :validateList="['required']"
                    size="small"
                  ></el-input>
                </div>
                <div v-else style="text-decoration:line-through" class="text-grey">{{ item.name }}</div>
              </div>
              <div class="block-key">
                <div v-if="!item.isDeleted">
                  <el-switch 
                    v-model="item.isMenu" 
                    active-color="#1670f0" 
                    inactive-color="#e5e5e5"
                    :active-value="1"
                    :inactive-value="0"
                    size="small"
                  ></el-switch>
                </div>
              </div>
              <div class="block-topo">
                <div v-if="!item.isDeleted">
                  <el-switch 
                    v-model="item.isShowInTopo" 
                    active-color="#1670f0" 
                    inactive-color="#e5e5e5"
                    :active-value="1"
                    :inactive-value="0"
                    size="small"
                  ></el-switch>
                </div>
              </div>
              <div class="block-type">
                <el-badge :value="item.ciCount" class="item"></el-badge>
              </div>
              <div class="block-showtype">
                <div v-if="!item.ciCount">
                  <div
                    v-if="!item.isDeleted"
                    class="tsfont-close-o"
                    style="cursor:pointer"
                    @click="removeCiType(item)"
                  >删 除</div>
                  <div
                    v-else
                    class="tsfont-rotate-right"
                    style="cursor:pointer"
                    @click="recoverCiType(item)"
                  >恢 复</div>
                </div>
              </div>
            </div>
          </draggable>
        </el-scrollbar>
      </div>
      <div class="submit_btn">
        <el-button type="primary" size="small" @click="save" :loading="saveLoading">保 存</el-button>
        <el-button size="small" @click="$emit('close')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { citypeList, saveAllCitype } from "@/api/system/ciModel";
import { Message } from 'element-ui'
import draggable from 'vuedraggable';

export default {
  components: {
    draggable
  },
  props: ['isShow'],
  data() {
    return{
      dragOptions: {
        animation: 150,
        scroll: true,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      },
      ciTypeList: [],
      saveLoading: false,
    }
  },
  mounted() {
    // console.log(draggable)
    this.getAllCitype()
  },
  methods: {
    // 获得全部层级
    getAllCitype() {
      citypeList().then(res => {
        this.ciTypeList = res.Return
      })
    },
    // 移除层级
    removeCiType(ciType) {
      this.$set(ciType, 'isDeleted', true);
    },
    // 恢复层级
    recoverCiType(ciType) {
      this.$set(ciType, 'isDeleted', null);
    },
    // 保存结果
    save() {
      this.saveLoading = true
      saveAllCitype({ciTypeList: this.ciTypeList}).then(res => {
        this.saveLoading = false
        Message({
          type: 'success',
          message: '保存成功!'
        })
        this.$emit("saveCitypeManage")
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
  line-height: 30px;
  font-size: 14px;

  .block-handler {
    position: absolute;
    left: 10px;
  }
  .block-name {
    position: absolute;
    left: 60px;
  }
  .block-key {
    position: absolute;
    left: 270px;
  }
  .block-topo {
    position: absolute;
    left: 360px;
  }
  .block-type {
    position: absolute;
    left: 465px;
  }
  .block-showtype {
    position: absolute;
    right: 0;
    // left:500px;
  }
}
.card-item {
  margin-bottom: 10px;
  position: relative;
  height: 30px;
  line-height: 30px;
  .block-handler {
    position: absolute;
    left: 15px;
    cursor: move;
  }
  .block-name {
    position: absolute;
    left: 60px;
  }
  .block-key {
    position: absolute;
    left: 270px;
  }
  .block-topo {
    position: absolute;
    left: 360px;
  }
  .block-type {
    position: absolute;
    left: 487px;
  }
  .block-showtype {
    position: absolute;
    // left:500px;
    right: 10px;
  }
}
</style>
