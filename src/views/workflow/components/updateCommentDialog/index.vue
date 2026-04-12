<!--  实例管理=》修改意见  -->
<template>
  <el-dialog
    v-loading="updateCommentDialogLoading"
    title="修改意见"
    :visible="updateCommentDialogVisible"
    custom-class="workFlow-dialog"
    class="updateCommentDialogVisible lcdp-dialog"
    width="970px"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="table-wrap">
      <el-table
        id="updateCommentPage"
        ref="tableRow"
        v-loading="listLoading"
        :data="taskComments"
        :row-key="(row)=>{ return row.taskId}"
        height="calc(100% - 0px)"
        :element-loading-text="$hussarT('hussar-common.loading')"
        :cell-class-name="setCellClassName"
        @cell-click="changeEditStatus"
        fit
        stripe
        class="lcdp-table"
      >
        <el-table-column type="index" align="center" :label="$hussarT('hussar-common.no')" width="80" :index="indexMethod" />
        <el-table-column :label="$hussarT('hussar-process.nodeName')" width="150" align="center">
          <template slot-scope="scope">
            <el-tooltip
              placement="top-start"
              popper-class="updateComment"
              effect="dark"
              :content="scope.row.activityName"
              :open-delay="300"
            >
              <span>{{ scope.row.activityName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$hussarT('hussar-process.transactor')" prop="userName" width="150" align="center" />
        <el-table-column :label="$hussarT('hussar-process.completeTime')" prop="time" width="180" align="center" />
        <el-table-column :label="$hussarT('hussar-process.completeComment')">
          <template slot-scope="scope">
            <el-tooltip
              :disabled="scope.row.fullMessage ==null || scope.row.fullMessage ==''"
              :popper-class="scope.row.fullMessage.length > 400 ? 'autoOver updateComment' : 'hiddenOver updateComment'"
              effect="dark"
              :content="scope.row.fullMessage"
              placement="top-start"
              :open-delay="300"
            >
              <el-input ref="taskComments" class="fullMessage" v-model="scope.row.fullMessage" @input="saveComment(scope.row.id,scope.row.taskId,scope.row.fullMessage)" placeholder="" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button class="updateCommentbutton" @click="handleClose">{{
        $hussarT("common.cancel")
      }}</el-button>
      <el-button class="updateCommentbutton" type="primary" @click="confirmSelect">{{
        $hussarT("common.sureUpdate")
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Vue from 'vue';
export default {
  name: 'updateCommentDialog',
  props: {
    // 弹窗显隐标识
    updateCommentDialogVisible: Boolean,
    updateCommentDialogLoading: Boolean,
    taskComments: Array
  },
  computed: {},
  data() {
    return {
      // 控制popover 显隐
      visible: false,
      listLoading: false,
      isEditStatus: false, // 参数表格是否处于可以编辑的状态
      taskCommentData: {
        id: null,
        fullMessage: null
      },
      updateList: [] // 要修改意见的列表

    };
  },
  methods: {
    // 查询列表的数据
    indexMethod(index) {
      return index + 1;
    },
    /**
     * 点击单元格，可以进行编辑
     * @param row
     * @param column
     */
    changeEditStatus(row, column) {
      const self = this;
      Vue.set(row, 'fullMessageEditable', column.n === 4);
      self.taskComments.forEach((item, n) => {
        if (n !== row.n) {
          Vue.set(item, 'fullMessageEditable', false);
        }
      });
      self.isEditStatus = true;
    },
    /**
     * 为数据表格添加行序列号和列序列号，方便确定点击的单元格
     * @param {row column rowIndex columnIndex} 行数据 列数据 行序列号 列序列号
     */
    setCellClassName({
      row, column, rowIndex, columnIndex
    }) {
      Vue.set(row, 'n', rowIndex);
      Vue.set(column, 'n', columnIndex);
    },
    /**
  * 取消所有单元格的可以编辑状态
  */
    cancelCellEditable() {
      const self = this;
      if (self.taskComments && self.taskComments.length !== 0) {
        self.taskComments.forEach((item) => {
          Vue.set(item, 'fullMessageEditable', false);
        });
      }
    },
    /**
   * 输入框值改变后向集合中保存数据
   */
    saveComment(id, taskId, fullMessage) {
      var flag = 0;
      if (this.updateList.length > 0) {
        for (const index in this.updateList) {
          if (taskId == this.updateList[index].taskId) {
            this.updateList[index].fullMessage = fullMessage;
            flag = 1;
          }
        }
      }
      if (flag == 0) {
        this.updateList.push({
          id: id,
          taskId: taskId,
          fullMessage: fullMessage
        });
      }
    },
    /**
     * 监听点击事件，点击空白处，取消表格的编辑状态
     */
    listenEvent(e) {
      const self = this;
      if (!self.isEditStatus && self.updateCommentDialogVisible) {
        const table = document.getElementById('updateCommentPage').getElementsByTagName('tbody');
        if (table && table.length !== 0 && !table[0].contains(e.target)) {
          self.cancelCellEditable();
        }
      } else {
        self.isEditStatus = false;
      }
    },

    // 确认
    confirmSelect() {
      this.$emit('confirm', { taskCommentList: this.updateList });
      this.updateList = [];
    },
    // 关闭页面
    handleClose() {
      this.updateList = [];
      this.$emit('close');
      this.$nextTick(() => {
        this.visible = false;
      });
    }
  },
  mounted() {
    const self = this;
    // 点击tbody之外的地方时，取消编辑状态
    self.$nextTick(() => {
      document.addEventListener('click', self.listenEvent);
    });
  },
  beforeDestroy() {
    document.removeEventListener('click', this.listenEvent);
  },
  watch: {
    // 监控页面显隐
    updateCommentDialogVisible: {
      handler(n) {
        if (n) {
          this.visible = false;
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .fullMessage .el-input__inner{
  text-align: left;
}
::v-deep .autoOver{
  width: 380px;
  font-size: 14px;
  max-height: 300px;
  overflow: auto;
}
::v-deep .hiddenOver{
  width: 380px;
  font-size: 14px;
  max-height: 300px;
}
::v-deep .el-tooltip__popper.updateComment .popper__arrow {
  left: 10% !important;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../style/workFlow.scss";
::v-deep .el-table th.is-leaf {
  border-bottom: 1px solid #EAEAEA !important;
}

::v-deep .workFlow-dialog {
  height: 544px;
  .el-table .el-table__row .cell {
    padding: 0 5px;
  }
  .el-dialog__body {
    overflow: auto;
    height: calc(100% - 100px);
    padding: 10px 10px;
    box-sizing: border-box;
  }
}
</style>
<style scoped>
  .updateCommentDialogVisible ::v-deep .el-loading-mask {
    background: transparent;
  }
::v-deep .table-wrap{
    height: calc(100% - 0px);
  }
::v-deep .updateCommentbutton {
  height: 32px;
  line-height: 1px;
}
</style>
