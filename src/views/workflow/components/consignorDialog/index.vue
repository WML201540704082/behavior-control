<template>
  <el-dialog
    :visible="consignorDialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    title="选择发送人"
    custom-class="workFlow-dialog"
    class="consignorDialogVisible lcdp-dialog"
    width="970px"
    @close="handleClose">
    <div class="selectEntrust-content lcdp_axe jxd_additional theme-config-personal-matters-dialog">
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
                    v-model="inputSelect"
                    prefix-icon="el-icon-search"
                    placeholder="按Enter键搜索"
                    clearable

                    @focus="inpFocus"
                    @blur="isbg = false"
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
                            :style="{color: inputSelect.indexOf(it) > -1 ? 'var(--theme-color)' : ''}">{{ it }}</span>
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
                            :style="{color: inputSelect.indexOf(it) > -1 ? 'var(--theme-color)' : ''}">{{ it }}</span>
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
                {{ tableList.length && JSON.stringify(tableItem) !== "{}" ? tableList[0].parentName : (JSON.stringify(tableItem) !== "{}" ? tableItem.label : '') }}
              </span>
              <span v-if="tableList.length && JSON.stringify(tableItem) !== '{}'">（{{ totalCount }}）</span>
              <span v-else-if="JSON.stringify(tableItem) !== '{}'">（0）</span>
            </div>
            <div
              class="jxd_ins_elTable default"
              style="height: calc(100% - 50px);width:auto;">
              <el-table
                v-loading="tableLoading"
                ref="multipleTable"
                :data="tableList"
                :row-key="getRowKey"
                highlight-current-row
                height="calc(100% - 53px)"
                tooltip-effect="dark"
                style="width: 100%"
                class="lcdp-table"
                @current-change="tableChange"
              >
                <el-table-column
                  label=" "
                  width="50">
                  <template slot-scope="scope">
                    <el-radio
                      v-model="selection"
                      :label="scope.row"
                    ><i/></el-radio>
                  </template>
                </el-table-column>
                <el-table-column
                  :show-overflow-tooltip="true"
                  prop="label"
                  label="用户名称"/>
                <el-table-column
                  :show-overflow-tooltip="true"
                  prop="parentName"
                  label="部门"/>
              </el-table>
              <!-- 翻页 -->
              <div class="page">
                <el-pagination
                  :current-page.sync="currentPage"
                  :page-size="PageSize"
                  :page-sizes="pageSizes"
                  :total="totalCount"
                  layout="total, sizes, prev, pager, next"
                  popper-class="lcdp-page-select"
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 已选 -->
        <div class="cont-right">
          <div class="list-tit">
            已选
            <img
              src="../../../assets/workflow/clear.png"
              @click="delAllSelection" >
          </div>
          <ul class="node-ul">
            <li
              v-for="(item, index) in selectList"
              :key="index">
              <!-- <li v-for="(item, index) in [selection]" :key="index"> -->
              <div class="item-name">{{ item.label }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div
      slot="footer"
      class="dialog-footer lcdp_axe jxd_additional theme-config-personal-matters-dialog">
      <el-button
        @click="handleClose">{{
          $hussarT("common.cancel")
        }}</el-button>
      <el-button
        type="primary"
        @click="confirmSelect">{{
          $hussarT("common.confirm")
        }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import hussarRequest from '@/views/workflow/util/request'
import { workFlowApi } from "@/api/workflow/flow/workFlowApi";

export default {
  name: "ConsignorDialog",
  props: {
    consignorDialogVisible: {
      type:Boolean,
      default:false,
    },
  },
  data() {
    return {
      // 表格加载层
      tableLoading: true,
      // 搜索内容
      searchContent: "",
      // 页码数
      PageCount: 5,
      // 默认显示第几页
      currentPage: 1,
      // 个数选择器（可修改）
      pageSizes: [10, 15, 20, 30],
      // 默认每页显示的条数（可修改）
      PageSize: 10,
      // 选项
      selection: {},
      // 当前页结果
      filterData: [],
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
      isbg: false
    };
  },
  computed: {},
  watch: {
    // 监控页面显隐
    consignorDialogVisible: {
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
    // 选项
    selection: {
      handler(n) {
        if (JSON.stringify(n) !== "{}" && n !== null) {
          this.selectList = [n];
        }
      },
      deep: true,
    },
    // 用户名称和部门列表
    tableList: {
      handler(n) {
        this.$nextTick(() => {
          this.$refs.multipleTable.setCurrentRow();
          if (this.selectList.length) {
            const sel = this.selectList[0];
            n.forEach((item) => {
              if (item.id === sel.id) {
                this.$refs.multipleTable.setCurrentRow(item);
              }
            });
          }
        });
      },
      deep: true,
    },
  },
  methods: {
    // 行数据的key
    getRowKey(row) {
      return row.consignorId;
    },
    // 确认
    confirmSelect() {
      if (this.selectList.length === 0) {
        this.$message.warning("请选择发送人");
      } else {
        const sel = this.selectList[0];
        let selectValue = sel.id;
        let names = sel.label;
        this.$emit("confirm", {
          consignors: selectValue,
          consignorNames: names,
          tableSelects: sel,
        });
        this.$emit("close");
      }
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      this.getTableList();
    },
    handleSizeChange(val) {
      this.PageSize = val;
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
      this.$refs.multipleTable.setCurrentRow();
      this.selectList = [];
      this.selection = {};
    },
    // 获取焦点
    inpFocus() {
      this.isbg = true;
      if (this.options.length) {
        this.visible = true;
      }
    },
    // 搜索
    changeFilter() {
      this.enterMethod(this.inputSelect);
    },
    // 模糊查询树的下拉
    enterMethod(query) {
      this.visible = false;
      this.options = [];
      if (query !== "") {
        this.loading = true;
        hussarRequest
          .get(workFlowApi.queryUserTree, {
            organName: query,
          })
          .then((res) => {
            if (res.code === 10000) {
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
                label: `员工（${user.length}）`,
                options: [...user],
                show: false
              });
              this.options.push({
                label: `部门（${organ.length}）`,
                options: [...organ],
                show: false
              });
              if (res.data.length) {
                this.visible = true;
              }
            } else {
              // top.window.showErrorMessage('获取人员树异常');
            }
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
    // 添加已选
    tableChange(item) {
      this.selection = item;
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
</style>
<style scoped>
  .consignorDialogVisible .organ-name {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: calc(100% - 65px);
    color: #4A4C66 !important;
    font-weight: bold !important;
  }

  /*input框样式 */
  .lcdp-dialog .el-dialog .el-dialog__body .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .el-input .el-input__inner:hover,
  .lcdp-dialog .el-dialog .el-dialog__body .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .el-input .el-input__inner:focus{
    border-color: var(--theme-color) !important;
  }
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .tree-inp.jxd_ins_elInput.default.el-input.el-input--prefix, .tree-inp.copy-inp.jxd_ins_elSelect.default.el-input.el-input--prefix.el-input--suffix {
    width: 100%;
    height: 100%;
  }
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .el-input__inner {
    background: none !important;
  }
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .tree-inp .el-input__inner::placeholder {
    text-align: right;
  }
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .tree-inp.copy-inp .el-input__inner::placeholder {
    text-align: left;
  }
  /* 查询下拉样式 */
  .div-label.div-pop:hover {
    color: var(--theme-color);
    background-color: var(--theme-btn-color);
  }

  /* 树选择 */
  .lcdp-dialog .el-dialog .el-dialog__body .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .work-tree .el-tree-node.is-current > .el-tree-node__content {
    color: var(--theme-color) !important;
    background: var(--theme-light-color) !important;
  }
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .lcdp-tree .el-tree-node__content:hover {
      background: var(--theme-light-color) !important;
  }
  /* 表格选择 */
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .lcdp-table .el-radio__input.is-checked .el-radio__inner,
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .lcdp-table .el-radio__inner:hover {
    border-color: var(--theme-color) !important;
  }
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .lcdp-table .el-radio__input.is-checked .el-radio__inner::after {
    background: var(--theme-color) !important;
  }
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .jxd_ins_elTable.default {
    border: none;
  }
  /* 分页 */
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .el-pagination .btn-prev,
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .el-pagination .btn-next {
    padding-top: 0px;
    color: #878787;
    transform: scale(0.8);
  }
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .el-pager li {
    line-height: 24px;
  }
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .el-input__inner {
    width: 100%;
  }
  /* 表格滚动条 */
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep ::-webkit-scrollbar-thumb {
    background: var(--theme-color) !important;
  }
  /* 已选择 */
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .node-ul li:hover {
    background: var(--theme-btn-color);
  }
  /* 取消按钮 */
  .lcdp_axe.theme-config-personal-matters-dialog ::v-deep .personal-dialog-cancel {
    background-color: #FFF;
    color: var(--theme-color);
    border: 1px solid var(--theme-color);
  }
  .lcdp_axe.theme-config-front /deep/ .dialog-cancel :hover{
    color: #fff;
    background: var(--theme-color);
  }
  .jxd_additional.lcdp_axe .jxd_ins_elButton.default:hover:not(.is-disabled){
    color:  #FFF !important;
  }

  /*.jxd_additional.lcdp_axe .jxd_ins_elTable.default .el-table ::v-deep .has-gutter th {*/
  /*  background: #fff;*/
  /*}*/
  .lcdp_axe .jxd_ins_elTable ::v-deep .el-table tbody tr td {
    border-bottom: 0;
  }
  .jxd_additional.lcdp_axe .jxd_ins_elTable.default .el-table ::v-deep .el-table__header-wrapper {
    border-bottom: 1px solid #EAEAEA;
  }
  .lcdp_axe .jxd_ins_elTable ::v-deep tbody tr:nth-of-type(even){
    background: #fff;
  }
  /*.lcdp_axe .jxd_ins_elTable ::v-deep tbody td {*/
  /*  height: 48px;*/
  /*}*/
  .lcdp_axe .jxd_ins_elTable .page {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  /*.lcdp_axe .jxd_ins_elTable .el-pagination ::v-deep .el-select .el-input .el-input__inner {*/
  /*  width: 80px;*/
  /*  height: 24px;*/
  /*  border: 1px solid #D9D9D9;*/
  /*  padding-right: 20px;*/
  /*  letter-spacing: 1px;*/
  /*}*/
  .el-pagination ::v-deep .el-input__suffix {
    transform: translateX(-2px) scale(0.8);
  }
  /*.jxd_additional.lcdp_axe .jxd_ins_elTable.default .page ::v-deep .el-pager li,.jxd_additional.lcdp_axe .jxd_ins_elTable.default .page ::v-deep .el-pager li:hover {*/
  /*  border: 0;*/
  /*}*/
  .jxd_additional.lcdp_axe .jxd_ins_elTable.default .page ::v-deep .el-pager li.number.active:not(.disabled).active {
    /*background: #fff;*/
    color: var(--theme-color);
    /*border: 0;*/
  }
  /*.jxd_additional.lcdp_axe .jxd_ins_elTable.default .page ::v-deep .el-pagination__total {*/
  /*  margin-right: 14px;*/
  /*}*/
  /*.lcdp_axe .jxd_ins_elTable .page ::v-deep .el-pagination{*/
  /*  padding:  0;*/
  /*}*/
</style>
