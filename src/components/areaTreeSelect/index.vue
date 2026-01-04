<template>
  <div class="xt_tree_select" @click.stop="handlePopver">
    <el-input v-model="formValue" readonly size="mini" :placeholder="placeholder"
              suffix-icon="el-icon-arrow-down"></el-input>
    <div class="tree_box" :class="showTree? 'show_tree' : 'hide_tree'">
      <div class="popper__arrow"></div>
      <el-scrollbar style="height:100%" ref="scrollbar">
        <el-tree
          ref="tree"
          :data="treeList"
          :props="defaultProps"
          highlight-current
          node-key="id"
          :accordion="true"
          :default-expanded-keys="defaultExpandedKeys"
          lazy
          :load="loadNode"
          @node-click="nodeClick"
        >
          <div class="span-ellipsis" style="font-size:14px;" slot-scope="{node,data}">
              <span :title="data.name">
                {{ data.name }}
              </span>
          </div>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {resourceLazyTree} from "@/api/device/resoureroom";
import {mapGetters} from "vuex";

export default {
  props: {
    placeholder: {
      type: String,
      default: '请选择所区域'
    },
    formValue: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      showTree: false,
      treeList: {},
      defaultExpandedKeys: [],
      defaultProps: {
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  watch: {
    showTree(val) {
      if (val) {
        document.body.addEventListener('click', this.watchContextmenu)
      } else {
        document.body.removeEventListener('click', this.watchContextmenu)
      }
    },

  },
  mounted() {

  },
  methods: {
    loadNode(node, resolve) {
      let form = {
        id: node.data.id,
        type: node.data.type
      }
      if (node.level == 0) {
        let type = ''
        this.defaultExpandedKeys = [this.userDetail.regionCode || '37']
        if (this.userDetail.regionCode.length == 2) type = ''
        else if (this.userDetail.regionCode.length == 4) type = 'city'
        else type = 'county'
        return resolve([{
          name: this.userDetail.regionName || '山东省',
          id: this.userDetail.regionCode || '37',
          hasChildren: true,
          type: type
        }])
      }
      else {
        if (form.type == 'county'){
          return resolve(form)
        }
        resourceLazyTree(form).then(res => {
          res.data.forEach(item => {
            if (item.type == 'county') item.leaf = true
          })
          return resolve(res.data)
        })
      }
    },
    watchContextmenu(e) {
      this.showTree = false
    },
    handlePopver() {
      this.showTree = !this.showTree
    },
    nodeClick(data, node) {
      this.$emit("getTreeItem", data)
      this.showTree = false
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__suffix {
  line-height: 40px
}

::v-deep .el-input__inner {
  cursor: pointer;
}

::v-deep .el-tree-node > .el-tree-node__children {
  width: 100%;
}

.xt_tree_select {
  position: relative;

  .tree_box {
    width: 100%;
    min-width: 320px;
    position: absolute;
    background: #fff;
    border-radius: 4px;
    z-index: 999;
    top: 50px;
    transition: height 0.3s;
  }

  .show_tree {
    height: 250px;
    border: 1px solid #E4E7ED;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

    .popper__arrow {
      position: absolute;
      top: -6px;
      left: 35px;
      margin-right: 3px;
      border-width: 6px;
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      border-top-width: 0;
      border-bottom-color: #EBEEF5;

      &::after {
        content: " ";
        border-width: 6px;
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
        top: 2px;
        margin-left: -6px;
        border-top-width: 0;
        border-bottom-color: #FFF;
      }
    }
  }

  .hide_tree {
    height: 0px;
  }
}
</style>
