<!--流程状态分析-->

<template>
  <el-card style="height: 100%;">
    <div id="processOverviewContent" class="processAnalysisContainer">
      <div class="pageLeft" @mouseleave="mouseLeave">
        <ProcessList
          @input="getProcessKey"
          @processListSize="processListSize"
        />
      </div>
      <div id="rightEchart" class="pageRight">
        <div class="showList">
          <div
            style="
              line-height: 32px;
              text-align: right;
              color: #a7a7a7;
              font-size: 14px;
            "
          >
            统计整体及各个流程的状态数据分布，对流程状态进行监控。
          </div>
          <ShowListOrEchart
            v-model="checked"
            class="viewList"
            @change="isShowList"
          />
        </div>
        <div class="mainContent">
          <div
            v-show="isAllProcess && isList"
            style="width: 100%; height: 100%"
          >
            <el-table
              v-loading="isLoading"
              :data="statusForListData"
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
                label="状态"
                align="left"
                prop="statusName"
              />
              <el-table-column key="2" label="数量" prop="instanceCount" />
            </el-table>
          </div>
          <div
            v-show="
              !isList &&
              (doughnutData.length !== 0 ||
                stackingBarData.length !== 0 ||
                !isGetResult)
            "
            ref="processCharts"
            style="width: 100%; height: 100%; overflow: hidden"
          />
          <div
            v-show="!isAllProcess && isList"
            style="width: 100%; height: 100%"
          >
            <el-table
              v-loading="isLoading"
              :data="statusByKeysForListData"
              width="100%"
              height="calc(100% - 40px)"
              class="checkedProcessTable lcdp-table"
              stripe
              @cell-click="isDialogTable"
            >
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="150"
              >
              </el-table-column>
              <el-table-column
                key="1"
                label="流程名称"
                prop="processName"
                align="left"
              />
              <el-table-column key="2" label="进行中" prop="normalCount" />
              <el-table-column key="3" label="挂起" prop="pauseCount" />
              <el-table-column key="4" label="终止" prop="terminatedCount" />
              <el-table-column key="5" label="结束" prop="endCount" />
            </el-table>
            <el-pagination
              :current-page="listCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="listSize"
              :total="listTotal"
              style="text-align: right;margin-top: 10px"
              background
              layout="total, sizes, prev, pager, next"
              @size-change="handleListSizeChange"
              @current-change="handleListCurrentChange"
            />
          </div>
          <div
            v-show="
              !isList &&
              doughnutData.length === 0 &&
              stackingBarData.length === 0 &&
              isGetResult
            "
            class="empty-text"
          >
            暂无数据
          </div>
        </div>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :title="`状态：${statusName}`"
        :visible.sync="dialogTableVisible"
        class="lcdp-dialog"
      >
        <div>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input v-model="searchContent" placeholder="流程名称" />
            </el-col>
            <el-button
              class="btn-search left"
              type="primary"
              @click="searchProcess(searchContent)"
            >
              搜索
            </el-button>
            <el-button
              class="hussar-btn btn-reset"
              type="button"
              @click="clearData()"
            >
              重置
            </el-button>
          </el-row>
        </div>
        <el-table
          v-loading="isLoading"
          :data="taskStatusListData"
          class="taskStatusList lcdp-table"
          width="100%"
          stripe
        >
          <el-table-column type="index" label="序号" align="center" width="120">
          </el-table-column>
          <el-table-column key="1" property="processName" label="流程名称" />
          <el-table-column
            key="2"
            property="taskDefinitionName"
            label="当前节点"
          />
          <el-table-column key="3" property="ver" label="版本" width="180" />
        </el-table>
        <el-pagination
          style="margin-top: 20px"
          :current-page="current"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="size"
          :total="total"
          class="lcdp-pagination"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts';
import ShowListOrEchart from '../../components/dataPickerTabs/showListOrEchart.vue';


import {
  queryProcessStatusForChart,
  queryProcessStatusForList,
  queryProcessStatusByKeysForChart,
  queryProcessStatusByKeysForList,
  queryProcessTaskStatusList
} from '@/api/workflow/analyse/processStatus.js';

import ProcessList from '../../components/processList/index.vue';

let resizeObserve = null;

export default {
  name: 'ProcessStatus',
  components: {
    ShowListOrEchart,
    ProcessList
  },
  props: {},
  data() {
    return {
      checked: false,
      isList: false, // 是否展示列表
      isAllProcess: true, // 是否展示全部流程状态
      myChart: null, // 环图,堆叠柱图
      doughnutData: [], // 全部状态环图数据
      statusForListData: [], // 全部状态列表数据
      stackingBarData: [], // 通过keys查询出的堆叠柱状图数据
      statusByKeysForListData: [], // 通过key查询出的列表数据
      taskStatusListData: [], // 下钻列表数据
      dialogTableVisible: false, // 下钻列表是否弹出
      processKeys: '', // 选中的流程key值，以逗号分隔
      statusName: '', // 弹窗中状态名称
      searchContent: '', // 搜索内容
      listParam: {}, // 下钻列表参数
      copyData: [], // 下钻列表数据备份
      current: 1, // 当前页
      size: 10, // 每页显示条数
      total: 100,
      isGetResult: false, // 是否获取到查询结果
      isLoading: false,
      listCurrent: 1, // 当前页
      listSize: 10, // 每页显示条数
      listTotal: 0,
      isChange: true
    };
  },
  computed: {
    doughnutOption() {
      // const this = this;
      const data = [];
      this.doughnutData.forEach(item => {
        const obj = {};
        obj.value = item.instanceCount;
        obj.name = item.statusName;
        obj.status = item.status;
        obj.processKey = item.processKey;
        data.push(obj);
      });
      return {
        color: ['#2794F8', '#F6BD16', '#E8684A', '#5AD8A6'],
        tooltip: {
          show: true,
          trigger: 'item',
          borderWidth: 0,
          backgroundColor: 'rgba(111, 111, 111, 1)',
          textStyle: {
            color: '#fff',
            fontWeight: '400'
          }
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
          padding: 0
        },
        series: [
          {
            type: 'pie',
            radius: ['35%', '55%'],
            top: 20,
            avoidLabelOverlap: true,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
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
                color: '#979797'
              }
            },
            data
          }
        ]
      };
    },
    stackingBarOption() {
      // const this = this;
      const xAxisData = [];
      const endCount = []; // 结束
      const normalCount = []; // 进行中
      const pauseCount = []; //挂起
      const terminatedCount = []; // 终止
      this.stackingBarData.forEach(item => {
        xAxisData.push(item.processName);
        endCount.push({ value: item.endCount, processKey: item.processKey });
        normalCount.push({
          value: item.normalCount,
          processKey: item.processKey
        });
        pauseCount.push({
          value: item.pauseCount,
          processKey: item.processKey
        });
        terminatedCount.push({
          value: item.terminatedCount,
          processKey: item.processKey
        });
      });
      let isShow = false;
      let end = 100;
      if (this.stackingBarData.length > 8) {
        isShow = true;
        end = (8 / this.stackingBarData.length) * 100;
      }
      return {
        color: ['#73A0FA', '#F7C739', '#EB7E65', '#73DEB3'],
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          backgroundColor: 'rgba(111, 111, 111, 1)',
          textStyle: {
            color: '#fff',
            fontWeight: '400',
            align: 'left'
          },
          borderWidth: 0
        },
        legend: {
          type: 'scroll',
          top: '8px',
          right: 0,
          icon: 'square',
          itemWidth: 9,
          itemHeight: 9,
          textStyle: {
            color: '#8C8C8C'
          },
          padding: 0
        },
        dataZoom: [
          {
            type: 'slider',
            show: isShow,
            backgroundColor: '#ffffff',
            xAxisIndex: [0],
            height: '8',
            width: 'auto',
            top: 'auto',
            bottom: 10,
            left: '25',
            border: 0,
            start: 0, // 数据窗口范围的起始百分比。范围是：0 ~ 100。表示 0% ~ 100%。
            end: end, // 数据窗口范围的结束百分比。范围是：0 ~ 100。
            handleIcon: 'none',
            showDataShadow: false,
            showDetail: false,
            brushSelect: false,
            zoomLock: true
          },
          {
            start: 0,
            end: end,
            type: 'inside',
            disabled: false,
            zoomLock: true
          }
        ],
        grid: {
          left: '0',
          right: '0',
          bottom: '30',
          containLabel: true,
          show: false
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(0, 0, 0, 0.45)'
              }
            },
            axisLabel: {
              color: 'rgba(0, 0, 0, 0.45)',
              interval: 0,
              width: 100,
              overflow: 'truncate',
              ellipsis: '...'
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: 'rgba(0, 0, 0, 0.45)'
            },
            minInterval: 1,
            max: function (value) {
              if (value.max === 0) return 5;
            }
          }
        ],
        textStyle: {
          fontSize: 12
        },
        series: [
          {
            name: '进行中',
            type: 'bar',
            stack: 'Process',
            barWidth: 50,
            emphasis: {
              focus: 'series'
            },
            data: normalCount
          },
          {
            name: '挂起',
            type: 'bar',
            stack: 'Process',
            emphasis: {
              focus: 'series'
            },
            data: pauseCount,
            barWidth: 50
          },
          {
            name: '终止',
            type: 'bar',
            stack: 'Process',
            emphasis: {
              focus: 'series'
            },
            data: terminatedCount,
            barWidth: 50
          },
          {
            name: '结束',
            type: 'bar',
            stack: 'Process',
            emphasis: {
              focus: 'series'
            },
            data: endCount,
            barWidth: 50
          }
        ]
      };
    }
  },
  watch: {
    doughnutOption() {
      this.drawDoughnut();
    },
    stackingBarOption() {
      this.drawStackingBar();
    }
  },
  mounted() {
    this.doughnutDataLoad();
    resizeObserve = new ResizeObserver(() => {
      if (this.myChart && this.isChange) this.myChart.resize();
    });
    resizeObserve.observe(document.getElementById('processOverviewContent'));
    resizeObserve.observe(document.getElementById('rightEchart'));
  },
  beforeUnmount() {
    resizeObserve.disconnect();
  },
  methods: {
    mouseLeave() {
      if (document.getElementsByClassName('over-tree').length > 0) {
        document
          .getElementsByClassName('pageLeft')[0]
          .classList.remove('over-tree');
        document
          .getElementsByClassName('pageLeft')[0]
          .classList.add('leave-tree');
      }
    },
    // 每页显示几条数据
    handleListSizeChange(value) {
      // const this = this;
      this.listSize = value;
      this.statusByKeysForListLoad(this.processKeys, value, this.listCurrent);
    },
    // 列表页码切换
    handleListCurrentChange(value) {
      // const this = this;
      this.listCurrent = value;
      this.statusByKeysForListLoad(this.processKeys, this.size, value);
    },
    // 搜索
    searchProcess(value) {
      // const this = this;
      this.loading = true;
      this.size = 10;
      this.current = 1;
      this.taskStatusListLoad(this.current, this.size, this.listParam, value);
      this.loading = false;
    },

    // 重置
    clearData() {
      // const this = this;
      this.loading = true;
      this.searchContent = '';
      this.current = 1;
      this.size = 10;
      this.taskStatusListLoad(
        this.current,
        this.size,
        this.listParam,
        this.searchContent
      );
      this.loading = false;
    },

    // 每页显示几条数据
    handleSizeChange(value) {
      // const this = this;
      this.size = value;
      this.taskStatusListLoad(
        this.current,
        this.size,
        this.listParam,
        this.searchContent
      );
    },

    // 列表页码切换
    handleCurrentChange(value) {
      // const this = this;
      this.current = value;
      this.taskStatusListLoad(
        this.current,
        this.size,
        this.listParam,
        this.searchContent
      );
    },
    // 数据下钻打开弹窗
    isDialogTable(row, column) {
      // const this = this;
      this.searchContent = '';
      this.listParam = {};
      let status = '';
      this.total = 0;
      this.taskStatusListData = [];
      if (
        column.label !== '状态' &&
        column.label !== '序号' &&
        column.label !== '流程名称'
      ) {
        this.dialogTableVisible = !this.dialogTableVisible;
      }
      if (row.status) {
        status = row.status;
        this.statusName = row.statusName;
      } else {
        if (column.property === 'normalCount') {
          status = 'normal';
          this.statusName = '进行中';
        }
        if (column.property === 'endCount') {
          status = 'end';
          this.statusName = '结束';
        }
        if (column.property === 'pauseCount') {
          status = 'pause';
          this.statusName = '挂起';
        }
        if (column.property === 'terminatedCount') {
          status = 'terminated';
          this.statusName = '终止';
        }
      }
      this.listParam = {
        status,
        processKey: row.processKey
      };
      this.size = 10;
      this.current = 1;
      this.taskStatusListLoad(
        this.current,
        this.size,
        this.listParam,
        this.searchContent
      );
    },

    // 绘制环图
    drawDoughnut() {
      // const this = this;
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = null;
      }
      // 判断dom不为空
      if (
        !this.$refs.processCharts ||
        this.$refs.processCharts.clientWidth === 0
      )
        return;
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(this.$refs.processCharts);
      this.myChart.setOption(this.doughnutOption);
      this.myChart.off('click');
      this.myChart.on('click', function (param) {
        this.searchContent = '';
        this.listParam = {};
        this.total = 0;
        this.taskStatusListData = [];
        this.dialogTableVisible = !this.dialogTableVisible;
        this.listParam = {
          status: param.data.status,
          processKey: param.data.processKey
        };
        this.statusName = param.name;
        this.size = 10;
        this.current = 1;
        this.taskStatusListLoad(
          this.current,
          this.size,
          this.listParam,
          this.searchContent
        );
      });
    },

    // 绘制堆叠柱图
    drawStackingBar() {
      // const this = this;
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = null;
      }
      if (
        !this.$refs.processCharts ||
        this.$refs.processCharts.clientWidth === 0
      )
        return;
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(this.$refs.processCharts);
      this.myChart.setOption(this.stackingBarOption);
      this.myChart.off('click');
      this.myChart.on('click', function (param) {
        this.searchContent = '';
        this.listParam = {};
        this.total = 0;
        this.taskStatusListData = [];
        this.dialogTableVisible = !this.dialogTableVisible;
        this.statusName = param.seriesName;
        let status = '';
        if (param.seriesName === '进行中') {
          status = 'normal';
        }
        if (param.seriesName === '结束') {
          status = 'end';
        }
        if (param.seriesName === '挂起') {
          status = 'pause';
        }
        if (param.seriesName === '终止') {
          status = 'terminated';
        }
        this.listParam = {
          status,
          processKey: param.data.processKey
        };
        this.size = 10;
        this.current = 1;
        this.taskStatusListLoad(
          this.current,
          this.size,
          this.listParam,
          this.searchContent
        );
      });
    },

    processListSize(value) {
      // const this = this;
      this.isChange = value;
      this.$nextTick(() => {
        if (this.isAllProcess) {
          this.drawDoughnut();
        } else {
          this.drawStackingBar();
        }
      });
    },

    // 获取左侧流程key
    getProcessKey(value) {
      // const this = this;
      this.processKeys = value;
      this.isGetResult = false;
      if (value) {
        this.isAllProcess = false;
        // this.doughnutData = [];
        this.listSize = 10;
        this.listCurrent = 1;
        this.statusByKeysForListLoad(value, this.listSize, this.listCurrent); // 根据流程key查询流程状态列表查询
        this.stackingBarDataLoad(value); // 查询堆叠柱图数据并加载堆叠柱图
      } else {
        this.isAllProcess = true;
        this.statusForListLoad(); // 查询全部流程状态列表数据
        this.doughnutDataLoad(); //加载环图数据并重绘环图
      }
    },

    // 查看列表
    isShowList(value) {
      // const this = this;
      this.isList = value;
      if (value) {
        if (this.isAllProcess) {
          this.statusForListLoad(); // 展示全部流程状态列表数据
        } else {
          this.listSize = 10;
          this.listCurrent = 1;
          this.statusByKeysForListLoad(
            this.processKeys,
            this.listSize,
            this.listCurrent
          ); // 根据流程key查询流程状态列表查询
        }
      } else {
        if (this.isAllProcess) {
          this.$nextTick(() => {
            this.drawDoughnut(); //加载环图数据并重绘环图
          });
        } else {
          this.$nextTick(() => {
            this.drawStackingBar(); // 堆叠柱图重新加载
          });
        }
      }
    },

    // 流程实例状态环图查询
    doughnutDataLoad() {
      // const this = this;
      queryProcessStatusForChart()
        .then(res => {
          if (res.code === 10000 && res.data.length > 0) {
            this.doughnutData = res.data;
            this.$nextTick(() => {
              this.drawDoughnut();
            });
          } else {
            this.doughnutData = [];
          }
        })
        .catch(() => {
           this.$message({
            message: '数据请求失败',
            type: 'error'
          });
        });
    },

    // 流程实例状态列表查询
    statusForListLoad() {
      // const this = this;
      this.isLoading = true;
      queryProcessStatusForList()
        .then(res => {
          if (res.code === 10000) {
            this.statusForListData = res.data.records;
            this.isLoading = false;
          }
        })
        .catch(() => {
           this.$message({
            message: '数据请求失败',
            type: 'error'
          });
        });
    },

    // 根据流程key查询流程状态柱状图查询
    stackingBarDataLoad(value) {
      // const this = this;
      const data = {
        processKeys: value
      };
      queryProcessStatusByKeysForChart(data)
        .then(res => {
          if (res.code === 10000 && res.data.length > 0) {
            this.stackingBarData = res.data;
            this.isGetResult = false;
            this.$nextTick(() => {
              this.drawStackingBar();
            });
          } else {
            this.stackingBarData = [];
            this.isGetResult = true;
          }
        })
        .catch(() => {
           this.$message({
            message: '数据请求失败',
            type: 'error'
          });
        });
    },

    // 根据流程key查询流程状态列表查询
    statusByKeysForListLoad(value, size, current) {
      // const this = this;
      this.isLoading = true;
      const data = {
        processKeys: value
      };
      data.size = size;
      data.current = current;
      queryProcessStatusByKeysForList(data)
        .then(res => {
          if (res.code === 10000) {
            this.statusByKeysForListData = res.data.records;
            this.listTotal = res.data.total;
            this.isLoading = false;
          }
        })
        .catch(() => {
           this.$message({
            message: '数据请求失败',
            type: 'error'
          });
        });
    },

    // 流程实例状态数量下钻查询
    taskStatusListLoad(current, size, value, keyword) {
      // const this = this;
      const data = {
        current, // 当前页
        size, // 每页显示条数
        keyword, // 关键字
        status: value.status,
        processKey: value.processKey
      };
      this.isLoading = true;
      this.taskStatusListData = [];
      queryProcessTaskStatusList(data)
        .then(res => {
          if (res.code === 10000) {
            this.taskStatusListData = res.data.records;
            this.copyData = res.data.records;
            this.total = res.data.total;
            this.isLoading = false;
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

<style lang="scss" scoped>
.processAnalysisContainer {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 150px);
}

.pageLeft.spread-tree {
  width: 0;
}

.pageLeft.spread-tree :deep.tree-filter {
  display: none;
}

.pageRight.spread-tree {
  width: 100%;
}

.pageLeft.over-tree {
  position: absolute;
  top: 48px;
  width: 19%;
  height: calc(100% - 56px);
  animation: slideContentUp 0.2s linear both;
  z-index: 9999;
}

.pageLeft.leave-tree {
  position: absolute;
  top: 48px;
  width: 19%;
  height: calc(100% - 56px);
  animation: slideContentDown 0.2s linear both;
}

@keyframes slideContentUp {
  from {
    width: 0;
  }
  to {
    width: 19%;
  }
}

@keyframes slideContentDown {
  from {
    width: 19%;
  }
  to {
    width: 0;
  }
}

.pageLeft.over-tree ::v-deep.tree-filter {
  display: flex;
  flex-direction: column;
}

.pageLeft.over-tree ::v-deep .tree-toggle-box {
  width: auto;
}

.pageLeft.over-tree ::v-deep .el-checkbox-group {
  height: calc(100% - 55px);
}

.pageLeft.over-tree ::v-deep .tree-wrap {
  height: calc(100% - 74px);
  box-shadow: -8px 0px 16px 0px rgba(18, 29, 106, 0.2);
  border-radius: 0px 8px 8px 0px;
}

.pageLeft.over-tree ::v-deep .tree-toggle-box .mouseover {
  bottom: -58px;
  left: 0;
  position: absolute;
}

.pageLeft.leave-tree ::v-deep .tree-filter {
  display: none;
}

.pageLeft.leave-tree ::v-deep .tree-toggle-box {
  width: auto;
}

.pageLeft.leave-tree ::v-deep .el-checkbox-group {
  height: calc(100% - 55px);
  overflow: hidden;
}

.pageLeft.leave-tree ::v-deep .tree-wrap {
  height: calc(100% - 74px);
  box-shadow: -8px 0px 16px 0px rgba(18, 29, 106, 0.2);
  border-radius: 0px 8px 8px 0px;
}

.pageLeft.leave-tree ::v-deep .tree-toggle-box .mouseover {
  bottom: -58px;
  left: 0;
  position: absolute;
}

.pageLeft.leave-tree ::v-deep .checkGroup {
  overflow: hidden;
}

.pageLeft.flod-tree {
  width: 28.5%;
}

.pageLeft.flod-tree ::v-deep .process-list-checked {
  width: unset;
}

.pageLeft.flod-tree ::v-deep .process-list {
  width: unset;
}

.pageRight.flod-tree {
  width: 71.5%;
}

.pageLeft {
  width: 19%;
}

.pageRight {
  width: 81%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 24px 16px 24px;
}

.showList {
  padding: 4px 0 30px 0;
}

.pageRight .mainContent {
  width: 100%;
  height: calc(100% - 62px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewList {
  margin-top: 20px;
  position: relative;
  font-weight: 400;
  font-size: 14px;
  color: #545672;
  float: right;
}

.filter-btn.flex {
  margin-bottom: 24px;
}

.filter-btn.flex ::v-deep .el-input {
  width: auto;
}

.filter-btn.flex ::v-deep .el-input__inner {
  width: 160px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin-right: 8px;
}

.lcdp-dialog ::v-deep .el-dialog {
  width: 60%;
  height: 60%;
  max-height: 700px;
}

.lcdp-dialog ::v-deep .el-dialog__title {
  color: #333651;
}

.lcdp-dialog ::v-deep .el-dialog__body {
  padding: 21px 24px 12px 24px;
  width: 100%;
  height: calc(100% - 98px);
}

::v-deep .el-table--scrollable-y .el-table__body-wrapper:hover {
  overflow-x: hidden !important;
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

.checkedProcessTable ::v-deep .cell {
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 14px;
  color: #333651;
}

.empty-text {
  line-height: 60px;
  color: #909399;
}

::v-deep .el-loading-mask {
  height: 100%;
}

.lcdp-dialog ::v-deep .el-dialog .el-loading-mask {
  height: 100% !important;
}
::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color: #00a9b8 ;
  border-color: #00a9b8 ;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #00a9b8 ;
    border-color: #00a9b8 ;
  }
 ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label{
   color: #00a9b8;
 }
  ::v-deep .process-list-checked{
    background: #00a9b809;
  }
  ::v-deep .process-list:hover{
    color: #00a9b8;
  }
  ::v-deep .el-checkbox__inner:hover{
    border-color: #00a9b8;
  }
</style>
<style lang="scss" scoped>
::v-deep .processAnalysisContainer {
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  margin: 8px;
  background: #ffffff;
  box-shadow: 0 1px 5px 0 rgba(18, 29, 106, 0.2);
  border-radius: 4px;
}
</style>
