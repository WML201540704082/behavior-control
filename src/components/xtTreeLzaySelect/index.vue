<template>
  <div class="xt_tree_select" @click="handlePopver">
    <el-select ref="e_sel" v-model="formValue" :disabled="disabled" readonly size="small" :placeholder="getPlaceHolder(placeholder)" @clear="clearClick" clearable>
      <template slot="empty">
        <div style="height: 300px;overflow-y: auto">
          <div class="popper__arrow"></div>
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            highlight-current
            node-key="id"
            :accordion="true"
            @node-click="nodeClick"
            :filter-node-method="filterNodeMethod">
            <div class="span-ellipsis" style="font-size:14px;" slot-scope="{node,data}">
              <span :class="[getTypeClassName(selectType)]"></span>
              <span :title="data.title">
                {{ getName(data) }}
              </span>
            </div>
          </el-tree>
        </div>
      </template>
    </el-select>
  </div>
</template>

<script>
/*
*部门、单位、班组联动下拉菜单 by sunq 2024年4月28日
* */
import {getDeptLzayList} from "@/api/system/dept";
import {getGroupDictList} from "@/api/system/usergroup";

export default {
  name:'xtTreeLzaySelect',
  props: {
    isUserUnit: { // 是否只显示所在公司单位
      type: Boolean,
      default: true
    },
    formValue: { // 此处有个能是单位Name、部门Name、班组Name ，后续根据Name进行联动下一级菜单
      type: String,
      default: ''
    },
    unitId: {
      type: String, // 此处是单位ID，部门下拉框时必填
      default: ''
    },
    deptId: {
      type: String, // 此处是部门ID，班组下拉框时必填
      default: ''
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    placeholder: { // el-input 提示文字
      type: String
    },
    treeData: { // 下拉菜单数据，根据前端菜单需要是否传值 一般用于单位下拉数据加载。
      type: Array,
      default: null,
    },
    selectType: { // 下拉数据类型，可能是单位（'CORP'）、部门（'DEPT'）、班组（'GROUP'）
      type: String,
      default: ''
    },
    showFullName: { //是否展示全名
      type: Boolean,
      default: true
    },
    formIndex: {
      type: Number,
      default: -1
    },
    defaultProps: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        label: 'fullName',
        value: 'id',
        leaf: 'hasChildren',
        disabled: 'disabled'
      }
    },
    selEverNode: { //是否点击任意节点都触发回调
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      loading: false,//加载提示

      ishandlePopver: false,
    }
  },
  watch: {
    'unitId'(newVal, oldVal) {
      //单位ID改变 重新加载部门下拉列表
      if (this.selectType === 'DEPT') {
        this.requestDeptList();
      }
    },
    'deptId'(newVal, oldVal) {
      if (this.selectType === 'GROUP') {
        this.requestGroupList();
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.initData();
    }, 200);
  },
  methods: {
    initData() {
      if (this.selectType === 'CORP') {
        //当前是单位下拉框
        if (!this.treeData || this.treeData.length == 0) {
          if (!this.isUserUnit) {
            //请求单位下拉框数据
            this.loading = true;
            getDeptLzayList({type: this.selectType}).then(res => {
              this.loading = false
              this.treeData = res.data;
            }).catch(err => {
              this.loading = false;
            })
          } else {
            let uls = JSON.parse(JSON.stringify(this.$store.state.user.userUnitList));
            this.initUserUnit(uls);
            this.treeData = uls;
          }
        }
      } else if (this.selectType === 'DEPT') {
        //当前是部门下拉框菜单，根据单位ID请求部门下拉框数据
        this.requestDeptList();
      } else if (this.selectType === 'GROUP') {
        //当前是班组下拉框菜单，根据部门ID请求班组下拉框数据
        this.requestGroupList();
      }
    },
    //只加载单位
    initUserUnit(list) {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].type != 'CORP') {
          list.splice(i, 1)
        }
        if (list[i] && list[i].children) {
          this.initUserUnit(list[i].children)
        }
      }
    },
    requestDeptList() {
      if (!this.isEmpty(this.unitId)) {
        this.loading = true;
        getDeptLzayList({type: this.selectType, parentId: this.unitId}).then(res => {
          this.treeData = res.data;
          this.loading = false;
        }).catch(err => {
          this.loading = false;
        });
      } else {
        this.treeData = [];
      }
    },
    requestGroupList() {
      if (!this.isEmpty(this.deptId)) {
        this.loading = true;
        getGroupDictList({deptId: this.deptId || this.userInfo.deptId}).then(res => {
          this.loading = false;
          this.treeData = res.data;
        }).catch(err => {
          this.loading = false;
        });
      } else {
        this.treeData = [];
      }
    },

    filterNodeMethod(value, data, node) {
      if (data.type === this.selectType) {
        return true;
      }
      return false;
    },
    nodeExpand(data, node, dom) {
      //create筛选
      this.$refs.tree.filter(this.selectType);
    },
    handlePopver() {
      this.ishandlePopver = true;
      if (this.disabled)
        return

      if (this.selectType === 'DEPT') {
        //如果是部门 判断是否传入了单位ID
        if (this.isEmpty(this.unitId)) {
          this.$message.error('请选择单位')
          return;
        }
      } else if (this.selectType === 'GROUP') {
        //如果是班组 判断是否传入了部门ID
        if (this.isEmpty(this.deptId)) {
          this.$message.error('请选择部门')
          return;
        }
      }
    },
    nodeClick(data, node) {
      if (this.selectType === 'CORP') {
        if (!this.selEverNode) {
          if (data.children && data.children.length > 0) {
            return;
          }
        }
      }

      if (this.selectType === 'GROUP') {
        //如果是班组，因为班组和单位、部门从两个接口获取，返回的字段名称不一致
        data.fullName = data.groupName;
      }
      this.$emit("getTreeItem", data, this.formIndex)

      if (this.selectType !== 'CORP') {
        this.$refs.e_sel.visible = false
      }
    },

    getName(data) {
      if (this.selectType === 'GROUP') {
        return data.groupName;
      } else {
        return this.showFullName ? data.fullName : data.deptName;
        //return data.deptName;
      }
    },
    isEmpty(value) {
      if (value === '' || value == null) {
        return true;
      }
      return false;
    },
    getTypeClassName(type) {
      if (type === 'CORP') {
        return 'el-icon-office-building';
      } else if (type === 'DEPT') {
        return 'el-icon-film';
      } else if (type === 'GROUP') {
        return 'el-icon-help';
      }
      return null;
    },
    getPlaceHolder(placeholder) {
      if (!this.isEmpty(placeholder)) {
        return;
      }
      if (this.selectType === 'CORP') {
        return '请选择单位名称';
      } else if (this.selectType === 'DEPT') {
        return '请选择部门名称';
      } else if (this.selectType === 'GROUP') {
        // return '请选择班组名称！';
        return '';
      }
    },
    clearClick() {
      let tItem = JSON.parse(JSON.stringify(this.treeData[0]));
      for (const tItemKey in tItem) {
        tItem[tItemKey] = null;
      }
      this.$emit("getTreeItem", tItem, 0)
    },
  }
}
</script>

<style lang="scss" scoped>
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
    min-width: 380px;
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

  .i_custom {

  }
}
</style>
