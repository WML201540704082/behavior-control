<!--待办任务分析-->
<template>
  <div id="processOverviewContent" class="processAnalysisContainer">
    <div class="pageTop">
      <el-select
        v-model="size"
        placeholder="请选择"
        class="search-input"
        popper-class="short_select"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button class="btn-search" type="primary" @click="queryType(size)">
        搜索
      </el-button>
      <el-button
        class="hussar-btn btn-reset"
        type="button"
        @click="clearValue()"
      >
        重置
      </el-button>
      <div class="filter-btn"></div>
      <div
        style="line-height: 32px; flex: 1; text-align: right; color: #a7a7a7"
      >
        统计待办任务数量排行前N的流程，对流程进行监控。
      </div>
      <show-list-or-echart
        v-model="checked"
        class="viewList"
        @change="isShowList"
      />
    </div>
    <div class="pageBottom">
      <div
        v-show="!isList && (doughnutData.length !== 0 || !isGetResult)"
        ref="todoTaskCharts"
        style="width: 100%; height: 100%"
      />
      <div v-show="isList" style="width: 100%; height: 100%">
        <el-table
          v-loading="isLoading"
          :data="todoTaskListData"
          width="100%"
          height="100%"
          class="checkedProcessTable lcdp-table"
          stripe
          @cell-click="isDialogTable"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="150"
          />
          <el-table-column
            key="1"
            label="流程名称"
            align="left"
            prop="processName"
          />
          <el-table-column key="2" label="待办任务数" prop="processTaskCount" />
        </el-table>
      </div>
      <div
        v-show="isGetResult && !isList && doughnutData.length === 0"
        class="empty-text"
      >
        暂无数据
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :title="`流程名称：${processName} 待办任务数：${processTaskCount}`"
      class="lcdp-dialog"
    >
      <div class="filter-btn flex">
        <el-input v-model="searchContent" placeholder="流程节点名称" />
        <el-button
          class="btn-search left ml1"
          type="primary"
          @click="searchProcess(searchContent)"
        >
          搜索
        </el-button>
        <el-button type="button" @click="clearData()"> 重置 </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="todoTaskListByKeyData"
        class="taskStatusList lcdp-table"
        width="100%"
        height="350"
        stripe
      >
        <el-table-column type="index" label="序号" align="center" width="120">
          <template #default="scope">{{
            (current - 1) * pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          key="1"
          property="taskDefinitionName"
          label="流程节点名称"
        />
        <el-table-column key="2" property="nodeTaskCount" label="待办任务数" />
      </el-table>
      <el-pagination
        :current-page="current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        :total="total"
        class="lcdp-pagination"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts';


import {
  queryInstanceTodoTaskCount,
  queryInstanceTodoTaskCountByProcessKey
} from '@/api/workflow/analyse/todoTaskAnalysis';
import showListOrEchart from '../../../components/dataPickerTabs/showListOrEchart.vue';

let resizeObserve = null;

export default {
  name: 'TodoTaskAnalysis',
  components: {
    showListOrEchart
  },
  props: {},
  data() {
    return {
      isList: false,
      checked: false,
      options: [
        {
          value: '5',
          label: '前5名'
        },
        {
          value: '10',
          label: '前10名'
        },
        {
          value: '15',
          label: '前15名'
        },
        {
          value: '20',
          label: '前20名'
        }
      ],
      size: '5',
      myChart: null, // 环图
      doughnutData: [], // 待办任务环图数据
      todoTaskListData: [], // 待办任务列表数据
      todoTaskListByKeyData: [], // 代办任务下钻列表数据
      copyData: [], // 下钻列表数据备份
      listParam: {}, // 下钻列表参数
      dialogTableVisible: false, // 下钻列表是否弹出
      searchContent: '', // 搜索内容
      loading: false,
      current: 1,
      pageSize: 10,
      total: 10,
      isGetResult: false, // 是否获取到查询结果
      isLoading: false,
      processName: '', // 流程名称
      processTaskCount: '' // 待办任务数量
    };
  },
  computed: {
    doughnutOption() {
      const self = this;
      const data = [];
      self.doughnutData.forEach(item => {
        const obj = {};
        obj.value = item.processTaskCount;
        obj.name = item.processName;
        obj.processKey = item.processKey;
        data.push(obj);
      });
      return {
        color: [
          '#2794F8',
          '#FFBB00',
          '#EE7B4E',
          '#52C566',
          '#6F5EF9',
          '#6DC8EC',
          '#945FB9',
          '#FF9845',
          '#1E9493',
          '#FF99C3',
          '#BDD2FD',
          '#BDD2FD',
          '#5AD8A6',
          '#BDEFDB',
          '#5D7092',
          '#C2C8D5',
          '#F6BD16',
          '#FBE5A2',
          '#E8684A',
          '#F6C3B7'
        ],
        tooltip: {
          trigger: 'item',
          borderWidth: 0,
          backgroundColor: 'rgba(111, 111, 111, 1)',
          textStyle: {
            color: '#fff',
            fontWeight: '400'
          },
          confine: true,
          extraCssText: 'white-space: normal; word-break: break-all;'
        },
        legend: {
          type: 'scroll',
          top: '0',
          right: 0,
          icon: 'circle',
          itemWidth: 9,
          itemHeight: 9,
          textStyle: {
            color: '#8C8C8C'
          },
          padding: 0,
          formatter: function (name) {
            return echarts.format.truncateText(name, 100, '12px', '...');
          },
          tooltip: {
            show: false
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['35%', '55%'],
            minAngle: 3,
            avoidLabelOverlap: true,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
            top: 20,
            label: {
              show: true,
              color: '#545672',
              formatter: '{b}\n{c}个',
              padding: [5, 5, 5, 5],
              lineHeight: 17
            },
            labelLine: {
              show: true,
              length: 40,
              length2: 60,
              lineStyle: {
                width: 1,
                color: '#545672'
              }
            },
            data
          }
        ]
      };
    }
  },
  watch: {
    doughnutOption() {
      this.drawDoughnut();
    }
  },
  mounted() {
    this.doughnutDataLoad(this.size);
    this.todoTaskListLoad(this.size);
    resizeObserve = new ResizeObserver(() => {
      if (this.myChart) this.myChart.resize();
    });
    resizeObserve.observe(document.getElementById('processOverviewContent'));
  },
  beforeUnmount() {
    resizeObserve.disconnect();
  },
  methods: {
    // 搜索
    searchProcess(value) {
      const self = this;
      self.loading = true;
      self.pageSize = 10;
      self.current = 1;
      self.todoTaskListByKeyLoad(
        self.listParam,
        self.pageSize,
        self.current,
        value
      );
    },

    // 重置
    clearData() {
      const self = this;
      self.loading = true;
      self.searchContent = '';
      self.current = 1;
      self.pageSize = 10;
      self.loading = true;
      self.todoTaskListByKeyLoad(
        self.listParam,
        self.pageSize,
        self.current,
        self.searchContent
      );
    },

    // 数据下钻打开弹窗
    isDialogTable(row, column) {
      const self = this;
      self.searchContent = '';
      self.listParam = {};
      self.total = 0;
      self.todoTaskListByKeyData = [];
      if (column.label !== '流程名称' && column.label !== '序号') {
        self.dialogTableVisible = !self.dialogTableVisible;
      }
      self.listParam = {
        processKey: row.processKey
      };
      self.processName = row.processName;
      self.processTaskCount = row.processTaskCount;
      self.loading = true;
      self.pageSize = 10;
      self.current = 1;
      self.todoTaskListByKeyLoad(
        self.listParam,
        self.pageSize,
        self.current,
        self.searchContent
      );
    },

    // 每页显示几条数据
    handleSizeChange(value) {
      const self = this;
      self.pageSize = value;
      self.loading = true;
      self.todoTaskListByKeyLoad(
        self.listParam,
        self.pageSize,
        self.current,
        self.searchContent
      );
    },

    // 列表页码切换
    handleCurrentChange(value) {
      const self = this;
      self.current = value;
      self.loading = true;
      self.todoTaskListByKeyLoad(
        self.listParam,
        self.pageSize,
        self.current,
        self.searchContent
      );
    },

    // 查询
    queryType(value) {
      const self = this;
      self.isGetResult = false;
      self.todoTaskListLoad(value);
      self.doughnutDataLoad(value);
    },
    // 清除
    clearValue() {
      this.size = '5';
      this.queryType(this.size);
    },

    // 查看列表
    isShowList(value) {
      const self = this;
      self.isList = value;
      self.$nextTick(() => {
        self.drawDoughnut();
      });
    },

    // 绘制环图
    drawDoughnut() {
      const self = this;
      if (self.myChart) {
        self.myChart.dispose();
        self.myChart = null;
      }
      if (
        !this.$refs.todoTaskCharts ||
        this.$refs.todoTaskCharts.clientWidth === 0
      )
        return;
      // 基于准备好的dom，初始化echarts实例
      self.myChart = echarts.init(this.$refs.todoTaskCharts);
      self.myChart.setOption(self.doughnutOption);
      self.myChart.off('click');
      self.myChart.on('click', function (param) {
        self.searchContent = '';
        self.listParam = {};
        self.total = 0;
        self.todoTaskListByKeyData = [];
        self.dialogTableVisible = !self.dialogTableVisible;
        self.listParam = {
          processKey: param.data.processKey
        };
        self.processName = param.data.name;
        self.processTaskCount = param.data.value;
        self.loading = true;
        self.pageSize = 10;
        self.current = 1;
        self.todoTaskListByKeyLoad(
          self.listParam,
          self.pageSize,
          self.current,
          self.searchContent
        );
      });
    },

    // 待办任务排行查询
    doughnutDataLoad(value) {
      const self = this;
      const data = {
        size: value
      };
      queryInstanceTodoTaskCount(data)
        .then(res => {
          if (res.code === 10000 && res.data && res.data.records.length > 0) {
            self.doughnutData = res.data.records;
            self.isGetResult = false;
            self.$nextTick(() => {
              self.drawDoughnut();
            });
          } else {
            self.doughnutData = [];
            self.isGetResult = true;
          }
        })
        .catch(() => {
           this.$message({
            message: '',
            type: 'error'
          });
        });
    },

    // 待办任务排行查询
    todoTaskListLoad(value) {
      const self = this;
      self.isLoading = true;
      const data = {
        size: value
      };
      queryInstanceTodoTaskCount(data)
        .then(res => {
          if (res.code === 10000) {
            self.todoTaskListData = res.data.records;
            self.isLoading = false;
          }
        })
        .catch(() => {
           this.$message({
            message: '数据请求失败',
            type: 'error'
          });
        });
    },

    // 流程下钻到流程名称
    todoTaskListByKeyLoad(value, size, current, keyword) {
      const self = this;
      const data = {
        current, // 当前页
        size, // 每页显示条数
        keyword,
        processKey: value.processKey
      };
      queryInstanceTodoTaskCountByProcessKey(data)
        .then(res => {
          if (res.code === 10000) {
            self.todoTaskListByKeyData = res.data.records;
            self.copyData = res.data.records;
            self.total = res.data.total;
            self.loading = false;
          }
        })
        .catch(() => {
           this.$message({
            message: '数据请求失败',
            type: 'error'
          });
        });
    }
  }
};
</script>

<style scoped>
.processAnalysisContainer {
  height: calc(100vh - 90px);
}

.processAnalysisContainer {
  display: flex;
  background: #ffffff;
  flex-direction: column;
  padding: 16px 24px 46px 24px;
}

.viewList {
  position: absolute;
  font-weight: 400;
  font-size: 14px;
  color: #545672;
  right: 0;
  top: 50px;
}

.pageTop {
  width: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  padding-bottom: 24px;
  margin-top: 5px;
}

.pageTop ::v-deep .el-select {
  width: 200px;
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
}

.pageTop .search-input {
  padding-right: 24px;
}

.pageTop .el-select.search-input,
.pageTop .search-input.el-date-editor.el-input,
.pageTop .search-input.el-date-editor.el-input__inner {
  width: 200px;
}

.pageTop .search-input ::v-deep .el-input__icon {
  line-height: 32px;
  height: 32px;
}

.pageBottom {
  width: 100%;
  margin-top: 50px;
  height: calc(100% - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkedProcessTable ::v-deep .cell {
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 14px;
  color: #333651;
}

.checkedProcessTable ::v-deep .el-table__body-wrapper .cell {
  color: #1b7cef;
  cursor: pointer;
}

.checkedProcessTable ::v-deep .is-center .cell,
.checkedProcessTable ::v-deep .is-left .cell {
  color: #333651;
  cursor: auto;
}

.el-dialog {
  width: 60%;
  height: 60%;
  max-height: 700px;
  padding: 0;
}

::v-deep .el-dialog__title {
  color: #333651;
}

::v-deep .el-dialog__body {
  padding: 21px 24px 12px 24px;
  width: 100%;
  height: calc(100% - 98px);
}

::v-deep .el-table--scrollable-y .el-table__body-wrapper:hover {
  overflow-x: hidden !important;
}

.filter-btn.flex {
  padding-bottom: 24px;
}

.header-title .titleName {
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 16px;
  color: #333651;
  display: inline-block;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.filter-btn.flex ::v-deep .el-input {
  width: auto;
}

.filter-btn.flex ::v-deep .el-input__inner {
  width: 160px;
  height: 32px;
  background: #ffffff;

  border-radius: 2px;
  margin-right: 8px;
}

.taskStatusList ::v-deep .is-center .cell {
  position: relative;
  left: -24px;
}

.taskStatusList ::v-deep .cell {
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 14px;
  color: #333651;
}

.empty-text {
  line-height: 60px;
  color: #909399;
}

::v-deep .el-dialog .el-loading-mask {
  height: 100% !important;
}

.ml1 {
  margin-left: 10px;
}
</style>
