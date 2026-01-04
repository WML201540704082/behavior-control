<template>
  <div class="xt_tree_select" @click.stop="handlePopver">
    <el-input v-model="formValue" :disabled="disabled" readonly size="small" :placeholder="placeholder"
              suffix-icon="el-icon-arrow-down"></el-input>
    <div class="tree_box" :class="showTree? 'show_tree' : 'hide_tree'">
      <div class="popper__arrow"></div>
      <el-scrollbar style="height:100%;" ref="scrollbar">
        <el-tree
          ref="tree"
          :data="treeItems"
          :props="defaultProps"
          highlight-current
          node-key="id"
          :accordion="true"
          @node-click="nodeClick"
          :filter-node-method="filterNodeMethod"
          @node-expand="nodeExpand">
          <div class="span-ellipsis" style="font-size:14px;" slot-scope="{node,data}">
            <span :class="data.type==selectType? 'el-icon-office-building':'el-icon-help'"></span>
            <!-- <el-tooltip effect="dark" :content="data.fullName" placement="top">
              {{ data.fullName }}
            </el-tooltip> -->
            <span :title="data.fullName">
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
    disabled: {
      type: Boolean,
      default: false
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
    },
    formIndex: {
      type: Number,
      default: -1
    },
  },
  data() {
    return {
      showTree: false,
      treeList: this.$store.state.user.userUnitList,
      treeItems: [],
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
    userUnit(val) {
      if (val != '' && val != null) {
        //如果是部门下拉框且，组件传入了单位，则加载用户单位下部门 并隐藏班组
        if (this.selectType == 'DEPT') {
          let arrs = this.loadDeptList(this.treeList, this.userUnit);
          // console.log(arrs)
          this.treeItems = arrs;
        }
      }
    },
  },
  mounted() {
    //防止删除更改原有数组
    this.treeItems = JSON.parse(JSON.stringify(this.treeList));
  },
  methods: {
    //加载单位下部门
    loadDeptList(list, unitName) {
      let arrs = null;
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.children && item.children.length > 0) {
          let temps = this.loadDeptList(item.children, unitName);
          if (temps && temps.length > 0) {
            return temps;
          }
        }

        if (item.fullName === unitName) {
          arrs = item.children;
        }
      }
      return arrs;
    },
    //加载单位
    // loadCorpList(list) {
    //   for (let i = list.length - 1; i >= 0; i--) {
    //     if (list[i].type == 'DEPT') {
    //       list.splice(i, 1)
    //     }
    //     if (list[i] && list[i].children) this.loadCorpList(list[i].children)
    //   }
    // },
    filterNodeMethod(value, data, node) {
      if (data.type == this.selectType) return true;
      return false;
    },
    nodeExpand(data, node, dom) {
      //create筛选
      this.$refs.tree.filter(this.selectType);
    },
    watchContextmenu(e) {
      this.showTree = false
    },
    handlePopver() {
      if (this.disabled) return
      this.showTree = !this.showTree
    },
    nodeClick(data, node) {
      if (this.selectType == data.type) {
        this.$emit("getTreeItem", data, this.formIndex)
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
