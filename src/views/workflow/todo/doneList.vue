<template>
  <div  class="app-container" style="padding: 10px 20px;overflow: hidden">
  <div class="list-box">
      <div class="table-box">
        <div class="table-filter flex">
          <el-select
            size="mini"
            v-model="listQuery.processKey"
            :placeholder="$hussarT('hussar-todoList.selectProcess')"
            filterable
            clearable
            class="jxd_ins_elSelect default"
            popper-class="short_select element-ins-select">
            <el-option
              v-for="item in processOption"
              :label="item.name"
              :value="item.id"
              :key="item.id"/>
          </el-select>
          <el-input
            size="mini"
            v-model="listQuery.sendUserName"
            :placeholder="$hussarT('hussar-todoList.sender')"
            class="jxd_ins_elInput default"
            clearable style="width:200px;margin:0 8px"
            readonly
            type="text"
            @focus="openUser()"/>
          <el-input
            size="mini"
            v-model="listQuery.message"
            :placeholder="$hussarT('hussar-todoList.taskContent')"
            class="jxd_ins_elInput default"
            clearable style="width:200px;margin-right: 8px"
            type="text"/>
          <el-date-picker
            size="mini"
            :rows="5"
            v-model="listQuery.startTime"
            :placeholder="$hussarT('hussar-common.startTime')"
            :picker-options="startPickerOptions"
            :class="listQuery.startTime?'dateIcon':''"
            type="datetime"
            prefix-icon="font_family icon-hussar_calendar"
            popper-class="lcdp-date-pop"
            class="jxd_ins_elDateTimePicker default"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="margin-right: 8px;"/>
          <el-date-picker
            size="mini"
            :rows="5"
            v-model="listQuery.endTime"
            :placeholder="$hussarT('hussar-common.endTime')"
            :class="listQuery.endTime?'dateIcon':''"
            :picker-options="endPickerOptions"
            type="datetime"
            prefix-icon="font_family icon-hussar_calendar"
            popper-class="lcdp-date-pop"
            class="jxd_ins_elDateTimePicker default"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="margin-right: 8px;"/>

            <el-button
              size="mini"
            type="primary"
              @click="queryList(true)">{{ $hussarT('hussar-common.search') }}
            </el-button>
            <el-button
              size="mini"
              type="button"
              @click="clearData()">
              {{ $hussarT('hussar-common.reset') }}
            </el-button>

        </div>
        <div
          class="jxd_ins_elTable default"
          style="margin-top: 10px;">
          <el-table
            v-loading="listLoading"
            ref="tableRow"
            :row-key="(row)=>{ return row.id}"
            :data="list"
            :element-loading-text="$hussarT('hussar-common.loading')"
            class="currTable lcdp-table"
            height="calc(100vh - 200px)"
            fit>
            <el-table-column
              :label="$hussarT('hussar-common.no')"
              :index="indexMethod"
              type="index"
              width="80"
              align="center"/>
            <el-table-column
              :label="$hussarT('hussar-todoList.process')"
              prop="processName"
              align="center">
              <template slot-scope="scope">
                <el-link class="jxd_ins_elLink default newPage"><span @click="showPic(scope.row)">{{ scope.row.processName }}</span></el-link>
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-todoList.node')"
              prop="taskDefinitionName"
              align="center">
              <template slot-scope="scope">
                <el-link class="jxd_ins_elLink default">
                  <span
                    v-if="scope.row.web !== undefined && scope.row.web !== ''"
                    class="newPage"
                    @click="openRoute(scope.row)">{{ scope.row.taskDefinitionName }}</span>
                  <span v-else>{{ scope.row.taskDefinitionName }}</span>
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-todoList.sender')"
              prop="sendUserName"
              align="center"/>
            <el-table-column
              :label="$hussarT('hussar-todoList.handler')"
              prop="assigneeName"
              align="center"/>
            <el-table-column
              :label="$hussarT('hussar-todoList.creationTime')"
              prop="startTime"
              align="center"/>
            <el-table-column
              :label="$hussarT('hussar-common.endTime')"
              prop="endTime"
              align="center"/>
            <el-table-column
              :label="$hussarT('hussar-todoList.taskContent')"
              prop="message"
              align="center">
              <template slot-scope="scope">
                <span :title="scope.row.message">{{ scope.row.message }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-common.operation')"
              align="center">
              <template slot-scope="scope">
                <div class="btn-box flex flex-center">
                  <!-- <div @click="revoke(scope.row.taskId)" class="btn-text">{{$hussarT('hussar-todoList.withdrawal')}}</div> -->
                  <el-button

                    @click="revoke(scope.row.taskId)">
                    {{ $hussarT('hussar-todoList.withdrawal') }}
                  </el-button>

                  <!-- <div  @click="urge(scope.row.processInsId)" class="btn-text">{{$hussarT('hussar-todoList.urging')}}</div> -->
                  <el-button

                    @click="urge(scope.row.processInsId)">
                    {{ $hussarT('hussar-todoList.urging') }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              style="text-align: right;margin-top: 10px;"
              :current-page.sync="page.currentPage"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="listQuery.size"
              :pager-count="pageCount"
              :total="total"
              layout="total, sizes, prev, pager, next"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"/>
          </div>
        </div>
        <!-- 选择发送人 -->
        <consignorDialog
          :consignor-dialog-visible="resetFormVisible"
          @close="closeConsignorDialog"
          @confirm="confirmConsignorDialog"/>

        <el-dialog :visible.sync="showPicFlag"
                   width="1200px"
                   title="流程图">
          <flowfile
            :processInsId="showPicProcessInstanceId"
            :businessId="showPicBusinessId"
            class="workflow"
            @close="close" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  import  flowfile  from '../components/flowFile/flowfile';

import  TreeIcon  from '../components/icon'
  import hussarRequest from '@/views/workflow/util/request'

  import {TodoTaskApi,DoneTaskApi} from "@/api/workflow/taskManagement/todo";

import consignorDialog from '../components/consignorDialog/index';

export default {
  name: 'doneList', // 已办任务界面
  components: {
    flowfile,
    consignorDialog,
  },
  data() {
    return {
      showPicFlag: false,
      // 是否显示用户树
      resetFormVisible: false,
      showPicProcessInstanceId: '',
      showPicBusinessId: '',
      // 推送按钮的加载中效果
      sendLoading: false,
      getIndex: -1,
      lastIndex: -1,
      rowChecked: [],
      // 查询列表是否展示loading状态
      listLoading: true,
      // form表单的宽度
      formLabelWidth: '120px',
      // 查询条件
      listQuery: {
        page: 1,
        size: 10,
        processKey: '',
        message: '',
        userId: '',
        sendUserId: '',
        sendUserName: '',
        type: '',
        startTime: '',
        endTime: ''
      },
      // 人员树数据
      props: {
        id: 'id',
        label: 'label',
        children: 'zones',
        isLeaf: 'isLeaf',
        disabled: this.disabledFn
      },
      // 列表数据
      list: [],
      // 流程下拉框
      processOption: null,
      // 列表选中数据
      checkBoxData: [],
      // 总页数
      total: 0,
      pageCount: 7,
      // 分页参数
      page: {currentPage: 1, size: 10, sizes: [10, 20, 50, 100]},
      // 表格高度自适应
      tableHeight: document.body.clientHeight - 285,
      startPickerOptions: {
        disabledDate: time => {
          if (this.listQuery.endTime !== '' && this.listQuery.endTime !== null) {
            return time.getTime() > new Date(this.listQuery.endTime).getTime()
          }
        },
        selectableRange: "00:00:00 - 23:59:59",
      },
      endPickerOptions: {
        disabledDate: time => {
          if (this.listQuery.startTime !== '' && this.listQuery.startTime !== null) {
            return time.getTime() < new Date(this.listQuery.startTime).getTime() + 1 - 8.64e7;
          }
        },
        selectableRange: "00:00:00 - 23:59:59",
      },
    }
  },
  watch: {
    page: {
      handler(newValue) {
        this.listQuery.page = newValue.currentPage;
        // this.queryList()
      },
      deep: true
    },
  },
  mounted() {
    // 初始化加载获取列表数据和下拉框数据
    this.initSelect();
    this.queryList();
    window.onresize = () => {
      return (() => {
        this.tableHeight = document.body.clientHeight - 285
      })()
    }
  },
  methods: {
    indexMethod(index) {
      let curpage = this.page.currentPage;  //单前页码，具体看组件取值
      let limitpage = this.listQuery.size;   //每页条数，具体是组件取值
      return (index + 1) + (curpage - 1) * limitpage
    },
    initSelect() {
      hussarRequest.get(TodoTaskApi.queryProcess).then(res => {
        if (res.code === 10000) {
          this.processOption = res.data;
        }
      })
    },
    // 查询列表数据
    queryList(isReset) {
      if(isReset){
        this.listQuery.page = 1;
        this.page.currentPage = 1;
      }
      this.listLoading = true;
      this.listQuery.userId = this.$getHussarUserId(this);
      this.listQuery.current = this.listQuery.page;
      hussarRequest.get(DoneTaskApi.list, this.listQuery).then(res => {
        if (res.code === 10000) {
          this.listLoading = false;
          this.list = res.data.records;
          this.total = res.data.total;
        } else {
          this.listLoading = false
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 重置按钮
    clearData() {
      this.listQuery.processKey = '';
      this.listQuery.message = '';
      this.listQuery.userId = '';
      this.listQuery.sendUserId = '';
      this.listQuery.sendUserName = '';
      this.listQuery.type = '';
      this.listQuery.startTime = '';
      this.listQuery.endTime = '';
      this.queryList(true);
    },
    // 选择列表数据
    changeFun(val) {
      this.checkBoxData = val;
      this.rowChecked = [];
      for (let i = 0; i < val.length; i++) {
        this.rowChecked.push(val[i].id);
      }
    },
    // 每页条数改变
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.listQuery.size = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.listQuery.page = 1;
      this.queryList()
    },
    // 页码切换
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryList()
    },
    // 打开表单详情页面
    openRoute(res) {
      let pathObj = {
        path: res.web,
        query: {
          businessId: res.businessId,
          doneListIdentification: 1,
          taskId: res.taskId,
          processDefinitionKey: res.processKey,
          taskDefinitionKey: res.taskDefinitionKey,
          systemParams: JSON.stringify({
            tablePageTitle: '',
            tabName: res.taskId,
            refresh: 0,
            openType: 0
          }),
        }
      };
      let paramsObj = {
        openPosition: 1,
        isSaveFrom: 1,
        isClose: 0,
        isReturnFrom: 3,
        clearCache:0,
        refresh: 1
      };
      //HussarRouter.hyperlinks(this, pathObj, paramsObj);
      // this.$router.push({
      //   path: res.web,
      //   query: {
      //     businessId: res.businessId,
      //     taskId: res.taskId,
      //     processDefinitionKey: res.processKey,
      //     taskDefinitionKey: res.taskDefinitionKey,
      //     doneListIdentification: 1,
      //   }
      // });
    },
    // 行内事件-撤回
    revoke(res) {
      const loading = this.$loading({
        lock: true,
        text: this.$hussarT('hussar-todoList.withdrawing'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      hussarRequest.post(DoneTaskApi.revoke, res).then(res => {
        if (res.code === 10000) {
          loading.close();
          this.$message.success(this.$hussarT('hussar-todoList.withdrawalSuccessful'));
          this.queryList();
        } else {
          loading.close();
        }
      }).catch(() => {
        loading.close();
      });
    },
    // 行内事件-催办
    urge(res) {
      hussarRequest.post(DoneTaskApi.urge, res).then(res => {
        if (res.code === 10000) {
          this.$message.success(this.$hussarT('hussar-todoList.urgingSuccess'));
          this.queryList();
        }
      })
    },
    // 打开流程图
    showPic(row) {
      if (row.processInsId === undefined) {
        return;
      }
      this.showPicProcessInstanceId = row.processInsId;
      this.showPicBusinessId = row.businessId;
      this.showPicFlag = true;
    },
    close() {
      this.showPicFlag = false;
    },
    // 查询用户树
    openUser() {
      this.resetFormVisible = true;
    },
    // 加载树
    loadNode(node, resolve) {
      var id = '-1';
      if (node && node.level !== 0) {
        id = node.data.id;
      }
      const data = {id: id};
      hussarRequest.get(TodoTaskApi.userTree, data).then(res => {
        // if (this.$refs.tree.getCheckedKeys().length === 0 && this.listQuery.sendUserId !== '') {
        //   this.$refs.tree.setCheckedKeys([this.listQuery.sendUserId]);
        // }
        return resolve(res);
      });
    },
    // 渲染树节点
    renderContent(h, {node, data, store}) {
      let iconType = 'tree-com';
      if (data.type === 'user') {
        iconType = 'tree-staff';
        return (
            <div class="custom-tree-node">
              <div class="tree-node-info">
                <div class="tree-icon">
                  <TreeIcon icon={iconType}/>
                </div>
                <span title={node.label}>{node.label}</span>
                <div class = "tree-icon-right">
                  <i class="el-icon-check"></i>
                </div>
              </div>
            </div>
        );
      } else {
        return (
            <div class="custom-tree-node">
              <div class="tree-node-info">
                <div class="tree-icon">
                  <TreeIcon icon={iconType}/>
                </div>
                <span title={node.label}>{node.label}</span>
              </div>
            </div>
        );
      }

      /*return (
          <div>
                <span class='staff-tree'>
                <span className='svg-icon'><svg-icon icon-class={iconType}/></span>
                  {node.label}
        </span>
          </div>);*/
    },
    // 设置叶子节点组织机构不可选
    disabledFn(data, node) {
      if ((!data.isLeaf || data.type !== 'user')) {
        return true;
      } else {
        return false;
      }
    },
    // 过滤树节点文本
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 关闭用户树页面
    treeClose() {
      this.resetFormVisible = false;
    },
    // 选择用户
    taskTransfer() {
      let checkNodes = this.$refs.tree.getCheckedNodes();
      // 未选中用户 提示对应信息
      if (checkNodes.length === 0) {
        this.$message.error(this.$hussarT('hussar-todoList.selectOne'));
        return;
      }
      this.listQuery.sendUserId = checkNodes[0].id;
      this.listQuery.sendUserName = checkNodes[0].label;
      this.resetFormVisible = false;
    },
    // 关闭选择发送人弹窗
    closeConsignorDialog() {
      this.resetFormVisible = false;
    },
    // 确认选择发送人弹窗
    confirmConsignorDialog(obj) {
      this.resetFormVisible = false;
      this.listQuery.sendUserId = obj.consignors;
      this.listQuery.sendUserName = obj.consignorNames;
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .dialogFitHeight .filter-box {
  border-bottom: 0;
  padding: 24px 24px 5px 24px;
}
.menu-dialog ::v-deep .lcdp-tree .el-tree-node__content > .el-tree-node__expand-icon {
  margin-left: 0;
  padding: 6px;
  font-size: 12px;
}
.lcdp-user-tree ::v-deep.custom-tree-node{line-height: unset;}

.todo-filter-item {
  width: 200px;
}

.todo-input {
  width: 200px;
}

.todo-date {
  width: 200px;
}

.newPage {
  color: #409DFF;
  cursor: pointer;
}


@media screen and (max-width: 1366px) {
  .todo-filter-item {
    width: 160px;
  }

  .todo-input {
    width: 160px;
  }

  .todo-date {
    width: 160px;
  }
}

@media screen and (max-width: 1440px) {
  .todo-filter-item {
    width: 165px;
  }

  .todo-input {
    width: 165px;
  }

  .todo-date {
    width: 165px;
  }
}

.selectSenderDialog ::v-deep .el-dialog__body {
  height: calc(100% - 45px);
  min-height: unset !important;
}

/* 主题修改相关—————————————————————————————————————————————————————————————————————————————————————— */
  /* 发送人弹窗——选中样式 */
  .lcdp_axe.theme-config-personal-matters ::v-deep .lcdp-user-tree.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: var(--theme-btn-color) !important;
  }
  .lcdp_axe.theme-config-personal-matters ::v-deep .lcdp-user-tree .tree-icon-right {
    color: var(--theme-color) !important;
  }
  /* 调整日期框清空图标位置 */
  .lcdp_axe.theme-config-personal-matters ::v-deep .jxd_ins_elDateTimePicker .el-input__suffix {
    right: 5px;
  }
  /* 重置按钮 */
  .lcdp_axe.theme-config-personal-matters .personal-reset {
    background-color: #FFF;
    color: var(--theme-color)
  }
  .lcdp_axe.theme-config-personal-matters .personal-reset:focus-within,
  .lcdp_axe.theme-config-personal-matters .personal-reset:hover {
    color: #fff;
  }
  /* 调整表格分页 */
  .lcdp_axe.theme-config-personal-matters ::v-deep .page .el-pagination .el-input__inner {
    height: 28px;
    line-height: 28px;
  }
  .lcdp_axe.theme-config-personal-matters ::v-deep .page .el-pagination .btn-prev,
  .lcdp_axe.theme-config-personal-matters ::v-deep .page .el-pagination .btn-next {
    height: 28px;
  }
  .lcdp_axe.theme-config-personal-matters ::v-deep .el-select .el-input.is-focus .el-input__inner,
  .lcdp_axe.theme-config-personal-matters ::v-deep .el-select .el-input__inner:focus,
  .lcdp_axe.theme-config-personal-matters ::v-deep .el-pagination__sizes .el-input .el-input__inner:hover {
    border-color: var(--theme-color);
  }
  .lcdp_axe.theme-config-personal-matters ::v-deep .el-pagination .btn-prev:hover,
  .lcdp_axe.theme-config-personal-matters ::v-deep .el-pagination .btn-next:hover {
    color: var(--theme-color);
  }
  .lcdp_axe.theme-config-personal-matters ::v-deep .jxd_ins_elTable .page .el-pager li.active {
    color: #ffffff;
  }
  /*.lcdp_axe.theme-config-personal-matters ::v-deep .jxd_ins_elTable .page .el-pager li.number.active:not(.disabled).active:hover {*/
  /*  color: #606266;*/
  /*}*/
  /* 表格——加载中 */
  .lcdp_axe.theme-config-personal-matters ::v-deep .lcdp-table .el-loading-spinner .el-loading-text {
    color: var(--theme-color) !important;
  }
  .lcdp_axe.theme-config-personal-matters ::v-deep .lcdp-table .el-loading-spinner .path {
    stroke: var(--theme-color) !important;
  }
  /* 表格滚动条 */
  .lcdp_axe.theme-config-personal-matters ::v-deep ::-webkit-scrollbar-thumb {
    background-color: var(--theme-color) !important;
  }
  /* 表格内按钮 */
  .lcdp_axe.theme-config-personal-matters ::v-deep.lcdp-table.el-table .el-button {
      color: #ffffff;
  }
  /*超链接样式 */
  .lcdp_axe.theme-config-personal-matters ::v-deep .newPage span{
    line-height: unset;
  }
  /*调整撤回催办按钮 */
  .lcdp-table.el-table .el-button:active, .lcdp-table.el-table .el-button:focus {
    background-color: var(--theme-color) !important;
  }
  /* 流程图 */
  .lcdp_axe.theme-config-personal-matters ::v-deep
  .flowfile.workflow .el-tabs.el-tabs--top .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item span,
  .lcdp_axe.theme-config-personal-matters ::v-deep
  /*.flowfile.workflow .el-tabs.el-tabs--top .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item span .AxureBpm{*/
  /*  color: var(--theme-color) !important;*/
  /*}*/
  .lcdp_axe.theme-config-personal-matters ::v-deep .AxureBpm {
    color: var(--theme-color) !important;
  }
  .lcdp_axe.theme-config-personal-matters ::v-deep
  .flowfile.workflow .el-tabs.el-tabs--top .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__active-bar {
    background-color: var(--theme-color) !important;
  }
  .lcdp_axe.theme-config-personal-matters ::v-deep .return_to_form:hover {
    background-color: var(--theme-btn-color);
  }
  .lcdp_axe.theme-config-personal-matters ::v-deep .return_to_form:hover span {
    color: var(--theme-color);
  }
  /* 流程记录——流程记录颜色 */
  .lcdp_axe.theme-config-personal-matters ::v-deep .list-box .table-box .flowfile.workflow .el-tabs .el-tabs__content #pane-second .el-table .el-table__body-wrapper .el-table__body tbody tr td:nth-child(6) .cell div {
    color: var(--theme-color) !important;
  }
/*.lcdp_axe.theme-config-personal-matters ::v-deep i {*/
/*  color: var(--theme-color);*/
/*}*/
.lcdp_axe.theme-config-personal-matters ::v-deep .return_to_form i {
  color: var(--theme-color) !important;
}
.lcdp_axe.theme-config-personal-matters ::v-deep  .is-top :hover{
  color: var(--theme-color) !important;
}
.lcdp_axe.theme-config-personal-matters ::v-deep .el-tabs__item.is-active {
  color: var(--theme-color) !important;
}
.lcdp_axe.theme-config-personal-matters ::v-deep .el-tabs__item :hover {
  color: var(--theme-color) !important;
}
.lcdp_axe.theme-config-personal-matters ::v-deep .el-tabs__item i {
  color: var(--theme-color) !important;
}
/*数据表格-保持表头高度不变*/
.jxd_additional.lcdp_axe .jxd_ins_elTable ::v-deep .el-table .cell {
  padding: 0 !important;
}
/* —————————————————————————————————————————————————————————————————————————————————————— */
</style>
