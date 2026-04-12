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
          @node-click="nodeClick"
          :filter-node-method="filterNodeMethod"
          @node-expand="nodeExpand">
          <div class="span-ellipsis" style="font-size:14px;" slot-scope="{node,data}" v-show="data.type==selectType">
            <span :class="data.type==selectType? 'el-icon-office-building':'el-icon-help'"></span>
            <span :title="data.title">
                {{ data.fullName }}
              </span>
          </div>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String
    },
    treeData: {
      type: Array,
      default: []
    },
    formValue: {
      type: String,
      default: ''
    },
    defaultProps: {
      type: Object,
      default: {
        label: 'fullName',
        value: 'id',
        leaf: 'hasChildren',
        disabled: 'disabled'
      }
    },
    selectType: {
      type: String,
      default: ''
    },
    userUnit: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showTree: false,
      treeList: this.$store.state.user.userUnitList
    }
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
  create() {

  },
  methods: {
    watchContextmenu(e) {
      this.showTree = false
    },
    handlePopver() {
      this.showTree = !this.showTree
    },
    filterNodeMethod(value, data, node) {
      if (data.type == this.selectType) return true;
      return false;
    },
    nodeExpand(data, node, dom) {
      //create筛选
      this.$refs.tree.filter(this.selectType);
    },
    nodeClick(data, node) {
      if (this.selectType == data.type) {
        this.$emit("getTreeItem", data)
        this.showTree = false
      } else {
        if (this.selectType == 'CORP') {
          this.$message({
            type: "warning",
            message: "请选择单位类型!"
          });
        } else {
          this.$message({
            type: "warning",
            message: "请选择部门类型!"
          });
        }
      }
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
