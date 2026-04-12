<!--  任务管理=》修改参与者  -->
<template>
  <el-dialog
    :title="'修改参与者'"
    :visible="assigneeDialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    custom-class="workFlow-dialog"
    class="assigneeDialogVisible lcdp-dialog"
    width="970px"
    @open="addOriginalAssignee(originalAssignee)"
    @close="handleClose">
    <div class="selectEntrust-content">
      <div class="content-right">
        <div class="cont-left">
          <div class="cont-tree">
            <!-- 搜索 -->
            <div class="cont-inp-box">
              <el-popover
                v-model="visible"
                placement="bottom"
                width="200"
                popper-class="popCls"
                trigger="manual">
                <div
                  slot="reference"
                  style="position: relative">
                  <el-input
                    :class="{'no-bg': isbg}"
                    v-model="inputSelect"
                    class="tree-inp"
                    prefix-icon="el-icon-search"
                    placeholder="按Enter键搜索"
                  />
                  <el-input
                    v-model="inputSelect"
                    prefix-icon="el-icon-search"
                    placeholder="搜索"
                    clearable
                    class="tree-inp copy-inp"
                    @focus="inpFocus"
                    @blur="inpBlur"
                    @input="visible = false"
                    @keyup.enter.native="changeFilter"
                  />
                </div>
                <div class="pop-box">
                  <div
                    v-for="(group, index) in options"
                    :key="index">
                    <div class="div-label">
                      <span>{{ group.label }}</span>
                      <span
                        v-if="group.options.length > 5"
                        class="label-btn"
                        @click="group.show = !group.show"
                      >
                        {{ group.show ? "收起" : "更多" }}
                      </span>
                    </div>
                    <div v-if="group.show">
                      <div
                        v-for="item in group.options"
                        :key="item.id">
                        <div
                          class="div-label div-pop"
                          @click="changeInput(item)"
                        >
                          <span
                            v-for="(it, ind) in item.label"
                            :key="'span' + ind"
                            :style="{color: inputSelect.indexOf(it) > -1 ? '#0D8EFF' : ''}">{{ it }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div
                        v-for="item in group.options.slice(0, 5)"
                        :key="item.id"
                      >
                        <div
                          class="div-label div-pop"
                          @click="changeInput(item)"
                        >
                          <span
                            v-for="(it, ind) in item.label"
                            :key="'span' + ind"
                            :style="{color: inputSelect.indexOf(it) > -1 ? '#0D8EFF' : ''}">{{ it }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-popover>
            </div>
            <!-- 树结构 -->
            <div
              v-if="treeData.length"
              class="cont-tree-box">
              <el-tree
                ref="tree-normal"
                :data="treeData"
                :indent="8"
                :props="props"
                :default-expand-all="true"
                :render-content="renderContent"
                :highlight-current="true"
                class="roleTree lcdp-tree work-tree work-tree1"
                node-key="id"
                @node-click="handleNodeClick"/>
            </div>
            <!-- 懒加载树 -->
            <div
              v-else
              class="cont-tree-box">
              <el-tree
                ref="tree-lazy"
                :key="treeKey"
                :indent="8"
                :props="props"
                :load="loadNode"
                :render-content="renderContent"
                :highlight-current="true"
                class="roleTree lcdp-tree work-tree work-tree2"
                node-key="id"
                lazy
                @node-click="handleNodeClick"/>
            </div>
          </div>
          <!-- 用户名称和部门列表 -->
          <div class="cont-table">
            <div class="table-tit">
              <span
                :title="JSON.stringify(tableItem) !== '{}' ? tableItem.label : ''"
                class="organ-name">
                {{ tableList.length && JSON.stringify(tableItem) !== "{}" ? tableList[0].parentName : (JSON.stringify(tableItem) !== "{}" ? tableItem.label : "") }}
              </span>
              <span v-if="tableList.length && JSON.stringify(tableItem) !== '{}'">（{{ totalCount }}）</span>
              <span v-else-if="JSON.stringify(tableItem) !== '{}'">（0）</span>
            </div>
            <div class="table_box">
              <el-table
                v-loading="tableLoading"
                ref="multipleTable"
                :data="tableList"
                highlight-current-row
                height="100%"
                tooltip-effect="dark"
                style="width: 100%"
                class="lcdp-table workflow-table"
                @selection-change="handleSelectionChange"
                @select="handleSelect"
                @select-all="selectAll">
                <el-table-column
                  type="selection"
                  width="35"/>
                <el-table-column
                  :show-overflow-tooltip="true"
                  prop="label"
                  label="用户名称"/>
                <el-table-column
                  :show-overflow-tooltip="true"
                  prop="parentName"
                  label="部门"/>
              </el-table>
            </div>
            <!-- 翻页 -->
            <div class="page-box">
              <el-pagination
                :current-page.sync="currentPage"
                :page-size="PageSize"
                :total="totalCount"
                background
                prev-text="上页"
                next-text="下页"
                layout="prev, pager, next, jumper"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
        <!-- 已选 -->
        <div class="cont-right">
          <div class="list-tit">
            已选
            <img
              src="@/views/assets/workflow/clear.png"
              @click="delAllSelection" >
          </div>
          <ul class="node-ul">
            <li
              v-for="(item, index) in selectList"
              :key="index">
              <!-- <li v-for="(item, index) in [selection]" :key="index"> -->
              <div class="item-name">{{ item.label }}</div>
              <i
                class="el-icon-delete"
                @click="delSelection(item, index)"/>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div
      slot="footer"
      class="dialog-footer">
      <el-button
        class="dialog-cancel"
        @click="handleClose">
        取消
        </el-button>
      <el-button
        :loading="assigneeDialogLoading"
        class="dialog-save"
        type="primary"
        @click="confirmSelect">
          提交
        </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { workFlowApi } from "@/api/workflow/flow/workFlowApi";
import hussarRequest from '@/views/workflow/util/request'


export default {
  name: "AssigneeDialog",
  props: {
    // 弹窗显隐标识
    assigneeDialogVisible:{
       type:Boolean,
       default:false,
    },
    assigneeDialogLoading: {
       type:Boolean,
       default:false,
    },
    originalAssignee:{
      type:Array,
      default:()=>{
        return [];
      },
    }
  },
  data() {
    return {
      // 表格加载层
      tableLoading: true,
      // 搜索内容
      searchContent: "",
      // 默认显示第几页
      currentPage: 1,
      // 默认每页显示的条数（可修改）
      PageSize: 10,
      // 选项
      selection: {},
      totalCount: 0,
      // 树数据
      treeData: [],
      treeKey: new Date() + "tree",
      // 人员树配置
      props: {
        id: "id",
        label: "label",
        children: "childrenList",
        isLeaf: "isLeaf",
      },
      // 用户名称和部门列表
      tableList: [],
      // 表格搜索条件
      tableItem: {},
      // 已选列表
      selectList: [],
      // 控制popover 显隐
      visible: false,
      // 搜索内容
      inputSelect: "",
      filterText: "",
      //人员名称和组织数组
      options: [],
      isbg: false,
      // 多选选项
      multipleSelection: [],
    };
  },
  computed: {},
  watch: {
    // 监控页面显隐
    assigneeDialogVisible: {
      handler(n) {
        if (n) {
          this.searchContent = "";
          this.treeKey = new Date() + "tree";
          this.visible = false;
          this.selection = {};
          this.tableItem = {};
          this.getTableList({});
        }
      },
      deep: true,
    },
    // 过滤树节点
    filterText: {
      handler(n) {
        this.currentPage = 1;
        if (n === "") {
          this.visible = false;
          this.options = [];
          this.treeData = [];
          this.tableList = [];
          this.tableItem = {};
          this.getTableList();
        } else {
          // 选中的部门，表格显示部门内的人员，刷新树
          // 选中的人员，表格显示选中的人员，刷新树
          this.tableItem = n;
          this.getTableList(n);
          hussarRequest.get(workFlowApi.queryDeptTreeByChildren, { ...n }).then((res) => {
            if(res.code===10000){
              if(Object.keys(res.data).length !==0){
                this.treeData = [...res.data];
              }
            }
          });
        }
      },
      deep: true,
    },
    // 查询条件
    inputSelect: {
      handler(n) {
        if (n === "") {
          this.filterText = "";
        }
      },
      deep: true,
    },
    // 用户名称和部门列表
    tableList: {
      handler(n) {
        if (n.length) {
          const self = this;
          this.$nextTick(() => {
            self.$refs.multipleTable.clearSelection();
            self.selectList.forEach((item) => {
              n.findIndex((it) => {
                const index = it.id === item.id;
                if (index) {
                  self.$refs.multipleTable.toggleRowSelection(it, true);
                }
              });
            });
          });
        }
      },
      deep: true,
    },
    // 监听被选中表格数据
    multipleSelection: {
      handler(n) {
        n.forEach((item) => {
          const index = this.selectList.findIndex((it) => it.id === item.id);
          if (index < 0) {
            this.selectList.push(item);
          }
        });
      },
      deep: true,
    },
  },
  methods: {
    // 确认
    confirmSelect() {
      if (this.selectList.length === 0) {
        this.$message.warning("请选择参与者");
      } else {
        let selectValue = [];
        this.selectList.forEach((element) => {
          selectValue.push(element.id);
        });
        this.$emit("confirm", {
          ids: selectValue.join(','),
        });
      }
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      this.getTableList();
    },
    // 关闭页面
    handleClose() {
      this.$emit("close");
      this.$nextTick(() => {
        this.treeData = [];
        this.currentPage = 1;
        this.tableList = [];
        this.options = [];
        this.visible = false;
        this.filterText = "";
        this.inputSelect = "";
        this.selectList = [];
        this.selection = {};
      });
    },
    // 懒加载树
    loadNode(node, resolve) {
      let id = "-1";
      if (node.level !== 0) {
        id = node.data.id;
      }
      const data = { id: id };
      hussarRequest
        .get(workFlowApi.dept, data)
        .then((res) => {
          if (res.code === 10000) {
            return resolve(res.data);
          } else {
            top.window.showErrorMessage("获取人员树异常");
          }
        })
        .catch((e) => {
          if (this.strategy) {
            top.window.showErrorMessage("获取人员树异常");
          } else {
            this.$message.error("获取人员树异常");
          }
        });
    },
    // 渲染树节点
    renderContent(h, { node, data }) {
      let iconType = "";
      if (node.level === 1) {
        iconType = "tree-com";
      } else if (node.level === 2) {
        iconType = "tree-department";
      } else {
        iconType = "unit";
      }
      return (
        <div class="tree-div">
          <span class="staff-tree">
            <span className="svg-icon">
              <svg-icon icon-class={iconType} />
            </span>
            {node.label}
          </span>
        </div>
      );
    },
    // 树节点点击
    handleNodeClick(item) {
      this.tableItem = item;
      this.getTableList(item);
    },
    // 清空已选
    delAllSelection() {
      this.$refs.multipleTable.clearSelection();
      this.selectList = [];
      this.selection = {};
      this.multipleSelection = [];
    },
    // 删除已选
    delSelection(item, index) {
      const findIndex = this.multipleSelection.findIndex((it) => it.id === item.id);
      const tableIndex = this.tableList.findIndex((table) => table.id === item.id);
      if (findIndex > -1 && tableIndex > -1) {
        this.$refs.multipleTable.toggleRowSelection(this.tableList[tableIndex], false);
      }
      this.multipleSelection.splice(findIndex, 1);
      this.selectList.splice(index, 1);
    },
    // 获取焦点
    inpFocus() {
      this.isbg = true;
      if (this.options.length) {
        this.visible = true;
      }
    },
    inpBlur() {
      const self = this;
      self.isbg = false;
      self.visible = false;
    },
    // 搜索
    changeFilter() {
      this.enterMethod(this.inputSelect);
    },
    // 模糊查询树的下拉
    enterMethod(query) {
      this.visible = false;
      if (query !== "") {
        this.loading = true;
        hussarRequest
          .get(workFlowApi.queryUserTree, {
            organName: query,
          })
          .then((res) => {
            if (res.code === 10000) {
              this.options = [];
              this.loading = false;
              const user = [];
              const organ = [];
              res.data.forEach((item) => {
                if (item.type === "user") {
                  user.push(item);
                } else {
                  organ.push(item);
                }
              });
              this.options.push({
                label: `员工（${hussar-user.length}）`,
                options: [...user],
                show: false
              });
              this.options.push({
                label: `部门（${organ.length}）`,
                options: [...organ],
                show: false
              });
            } else {
              // top.window.showErrorMessage('获取人员树异常');
            }
            this.visible = true;
          })
          .catch((e) => {
            // this.$message.error('获取人员树异常');
          });
      } else {
        this.options = [];
      }
    },
    // 点击查询到的列表数据
    changeInput(item) {
      this.filterText = item;
      this.inputSelect = item.label;
      this.visible = false;
    },
    // 获取列表数据
    getTableList(n = this.tableItem) {
      this.tableList = [];
      hussarRequest
        .get(workFlowApi.queryUserListByPage, {
          ...{ ...n, ...{ childrenList: [] } },
          size: this.PageSize,
          current: this.currentPage,
        })
        .then((res) => {
          this.tableLoading = false;
          if (res.code === 10000) {
            this.tableList = [...res.data.records];
            this.totalCount = res.data.total;
          }
        });
    },
    //显示原参与者
    addOriginalAssignee(originalAssignee){
      const assigneeIdNum = originalAssignee.length;
      this.multipleSelection = [];
      if(assigneeIdNum !=0){
        for(let i=0;i<assigneeIdNum;i++){
          let originalAssigneeId = originalAssignee[i].userId;
          let originalAssigneeLabel = originalAssignee[i].userName;
          this.multipleSelection.push({
            id: originalAssigneeId,
            label: originalAssigneeLabel,
          });
        }
      }
    },
    // table多选
    handleSelectionChange(val) {
      val.forEach((item) => {
        const index = this.multipleSelection.findIndex((it) => it.id === item.id);
        const findIndex = this.selectList.findIndex((it) => it.id === item.id);
        if (index < 0) {
          this.multipleSelection.push(item);
        }
        if (findIndex >= 0) {
          this.$refs.multipleTable.toggleRowSelection(item, true);
        }
      });
    },
    // 表格多选切换
    handleSelect(selection, row) {
      // 相当于取消选中
      if (selection.indexOf(row) < 0) {
        const index = this.selectList.findIndex((it) => it.id === row.id);
        this.selectList.splice(index, 1);
        const findIndex = this.multipleSelection.findIndex((it) => it.id === row.id);
        this.multipleSelection.splice(findIndex, 1);
      } else {
        this.selectList.push(row);
      }
    },
    // table点击全选复选框
    selectAll(val) {
      if (val.length === 0) {
        this.tableList.forEach((tableItem) => {
          const selectIndex = this.selectList.findIndex((it) => it.id === tableItem.id);
          const multiIndex = this.multipleSelection.findIndex((it) => it.id === tableItem.id);
          if (selectIndex > -1) {
            this.selectList.splice(selectIndex, 1);
          }
          if (multiIndex > -1) {
            this.multipleSelection.splice(multiIndex, 1);
          }
        });
      } else {
        val.forEach((item) => {
          const selectIndex = this.selectList.findIndex((it) => it.id === item.id);
          const multiIndex = this.multipleSelection.findIndex((it) => it.id === item.id);
          if (selectIndex < 0) {
            this.selectList.push(item);
          }
          if (multiIndex < 0) {
            this.multipleSelection.push(item);
          }
        })
      }
    },
  },
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../style/workFlow.scss";
.div-label {
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  &.div-pop {
    cursor: pointer;
    &:hover {
      background: #e9f4fe;
      color: #0d8eff;
    }
  }
}
::v-deep .workFlow-dialog {
  height: 544px;
  .el-table .el-table__row .cell {
    padding: 0 5px;
  }
  .el-dialog__body {
    padding: 15px 16px 0;
  }
  .selectEntrust-content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    .content-right {
      @include myBorder;
      width: 100%;
      height: 100%;
      display: flex;
      .cont-left {
        width: calc(100% - 190px);
        height: 100%;
        display: flex;
        > div {
          height: 100%;
        }
        .cont-tree {
          width: 258px;
          margin-right: 8px;
          height: 100%;
          padding: 10px 0;
          box-sizing: border-box;
          .cont-inp-box {
            margin-bottom: 10px;
            padding-left: 16px;
            position: relative;
            .myPlace {
              position: absolute;
              top: 6px;
              right: 10px;
              font-size: 14px;
              color: #c0c4cc;
            }
          }
          .cont-tree-box {
            width: 100%;
            height: calc(100% - 86px);
            overflow: auto;
            .tree-div {
              width: calc(92.7% - 24px);
              .staff-tree {
                display: block;
                width: 100%;
                height: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
              }
            }
          }
        }
        .cont-table {
          width: calc(100% - 266px);
          box-sizing: border-box;
          padding-right: 16px;
        }
        .table-tit {
          @include cardTit;
          margin: 9px 7px;
          span {
            color: #bcbdbf;
            font-weight: normal;
          }
        }
        .table_box {
          height: calc(100% - 106px);
        }
        .page-box {
          margin-right: 16px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
      .cont-right {
        width: 190px;
        height: 100%;
        border-left: 1px solid #e7e7e7;
        box-sizing: border-box;
        .list-tit {
          @include cardTit;
          display: flex;
          justify-content: space-between;
          i {
            cursor: pointer;
            &:hover {
              color: #0d8eff;
            }
          }
          img {
            cursor: pointer;
            width: 16px;
            height: 16px;
          }
        }
        .node-ul {
          li {
            cursor: default;
            i {
              display: none;
              cursor: pointer;
            }
            &:hover {
              i {
                display: block;
              }
              color: #4a4c66;
              .item-name {
                color: inherit;
              }
            }
          }
        }
      }
    }
  }
}
.assigneeDialogVisible .el-dialog__footer .el-button {
  width: auto;
}
</style>
<style scoped>
  .assigneeDialogVisible ::v-deep .el-loading-mask {
    background: transparent;
  }
  .assigneeDialogVisible .organ-name {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: calc(100% - 65px);
    color: #4A4C66 !important;
    font-weight: bold !important;
  }
</style>
