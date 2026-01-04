<!--流程数量分析-->
<template>
  <div id="processQuantityContent" class="processContainer">
    <div class="pageLeft" @mouseleave="mouseLeave">
      <processList @input="getProcessKey" @processListSize="processListSize" />
    </div>
    <div id="rightEchart" class="pageRight">
      <Tabs
        :remarks="remarks"
        :set-width="'calc(100% - 746px)'"
        :is-show-year="true"
        :show-top-few="false"
        :show-user="false"
        @getQueryList="getQueryList"
        @isShowList="isShowList"
      />
      <div class="mainContent">
        <div
          v-show="!showList && chartData.length !== 0 && !isNone"
          id="echartBar"
          class="chart"
        />
        <div
          v-show="!showList && chartData.length === 0 && isNone"
          class="fill empty-text"
        >
          暂无数据
        </div>
        <div v-show="showList" class="table-wrap">
          <el-table
            v-loading="listLoading"
            ref="tableRow"
            :data="chartData"
            element-loading-text="加载中"
            tooltip-effect="light"
            fit
            stripe
            class="lcdp-table"
          >
            <el-table-column
              label="序号"
              type="index"
              width="120"
              align="center"
            />
            <el-table-column label="统计时间">
              <template #default="scope">
                {{ scope.row.statisTime }}
              </template>
            </el-table-column>
            <el-table-column label="发起数">
              <template #default="scope">
                {{ scope.row.createCount }}
              </template>
            </el-table-column>
            <el-table-column label="结束数">
              <template #default="scope">
                {{ scope.row.finishCount }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import Tabs from '../../../components/dataPickerTabs/index.vue';
import processList from '../../../components/processList/index.vue';
import * as processQuantity from '@/api/workflow/analyse/processQuantityAnalysis';


let resizeObserver = null;
let barStatus = null;

export default {
  name: 'ProcessQuantityAnalysis',
  components: { Tabs, processList },
  data() {
    return {
      // 查询条件
      listQuery: {
        userId: null,
        statisType: 'month', // 统计类型
        autoStartTime: null, // 自定义开始时间
        autoEndTime: null, // 自定义结束时间
        dayTime: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`, // 按天统计时间
        monthMonth: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`, // 按月统计的月份值 2022-05
        quarterYear: null, // 按季度统计的年份值
        quarterQuarter: null, // 按季度统计的季度值
        yearYear: '2022', // 按年份统计的年份值
        processKeys: ''
      },
      chart: '',
      showList: false,
      listLoading: false,
      chartData: [], //柱状图数据
      category: [], //x轴类目，对应流程名称
      createCounts: [], //实例数
      finishCounts: [], //结束数
      isNone: false, // 是否查询到数据
      isChange: true,
      remarks: '统计特定时间内流程实例的发起和结束数量，对流程进行监控。'
    };
  },
  mounted() {
    const self = this;
    //初始化操作，当窗口大小发生变化时，图标的大小也随之改变
    self.initProcess().then(() => {
      resizeObserver = new ResizeObserver(() => {
        if (barStatus && this.isChange) barStatus.resize();
      });
      resizeObserver.observe(document.getElementById('processQuantityContent'));
      resizeObserver.observe(document.getElementById('rightEchart'));
    });
  },
  methods: {
    // 初始化操作
    async initProcess() {
      const self = this;
      self.queryProcessQuantity();
    },
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
    //柱状图
    drawBar() {
      if (barStatus) {
        barStatus.dispose();
        barStatus = null;
      }
      // 基于准备好的dom，初始化echarts实例
      let dom = document.getElementById('echartBar');
      if (!dom || dom.clientWidth === 0) return;
      this.chart = echarts.init(dom);
      const optionBar = {
        legend: {
          type: 'scroll',
          data: ['发起数', '结束数'],
          top: 0,
          right: 0,
          padding: 0,
          icon: 'rect',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: '#8C8C8C'
          },
          tooltip: {
            show: true,
            position: function (pos, params, dom, rect, size) {
              // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
              var obj = { top: 20 };
              obj[['right', 'left'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
              return obj;
            },
            backgroundColor: '#303133',
            textStyle: {
              fontSize: 12,
              color: '#ffffff'
            },
            formatter: function (params) {
              if (params.name === '发起数') {
                return '发起的流程实例数量';
              } else {
                return '结束的流程实例数量，包含结束和终止两种状态';
              }
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          backgroundColor: 'rgba(111, 111, 111, 1)',
          textStyle: {
            color: '#fff',
            fontWeight: '400'
          },
          borderWidth: 0
        },
        color: ['rgba(82,172,255,0.85)', 'rgba(122,200,255,0.85)'],
        grid: {
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.category,
          axisLabel: {
            color: 'rgba(0, 0, 0, 0.45)'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.45)'
            }
          }
        },
        yAxis: {
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
        },
        series: [
          {
            name: '发起数',
            type: 'bar',
            data: this.createCounts,
            barWidth: '32',
            barGap: '20%'
          },
          {
            name: '结束数',
            type: 'bar',
            data: this.finishCounts,
            barWidth: '32',
            barGap: '20%'
          }
        ]
      };
      // 绘制图表
      this.chart.setOption(optionBar, true);
      barStatus = this.chart;
    },
    processListSize(value) {
      const self = this;
      self.isChange = value;
      self.$nextTick(() => {
        this.drawBar();
      });
    },
    // 获取左侧流程key
    getProcessKey(value) {
      const self = this;
      self.listQuery.processKeys = self.listQuery.processKeys = value;
      self.queryProcessQuantity();
    },
    //选中右上角的‘查看列表’
    isShowList(data) {
      this.showList = data;
      this.$nextTick(() => {
        this.drawBar();
      });
    },
    //查询按钮
    getQueryList(params) {
      this.listQuery.statisType = params.statisType;
      this.listQuery.userId = params.userIds;
      if (params.statisType === 'day') {
        this.listQuery.dayTime = params.choiceTime;
      } else if (params.statisType === 'month') {
        this.listQuery.yearYear = params.choiceTime.slice(0, 4);
      } else if (params.statisType === 'quarter') {
        this.listQuery.yearYear = params.choiceTime.slice(0, 4);
      } else if (params.statisType === 'year') {
        this.listQuery.yearYear = params.choiceTime;
      } else if (params.statisType === 'auto') {
        this.listQuery.autoStartTime = params.choiceTime.startTime;
        this.listQuery.autoEndTime = params.choiceTime.endTime;
      }
      this.queryProcessQuantity();
    },
    //查询柱状图图数据
    queryProcessQuantity() {
      processQuantity
        .getProcessCount(this.listQuery)
        .then(res => {
          this.chartData = [];
          if (res.code === 10000) {
            this.isNone = res.data.length <= 0;
            this.chartData = res.data;
            this.category = [];
            this.createCounts = [];
            this.finishCounts = [];
            for (let i = 0; i < res.data.length; i++) {
              this.category.push(res.data[i].statisTime);
              this.createCounts.push(res.data[i].createCount);
              this.finishCounts.push(res.data[i].finishCount);
            }
            this.$nextTick(() => {
              this.drawBar(); // 查询柱图数据并加载柱图
            });
          } else {
            this.isNone = true;
             this.$message({
              message: '',
              type: 'error'
            });
          }
        })
        .catch(() => {
           this.$message({
            message: '数据请求失败',
            type: 'error'
          });
          this.listLoading = false;
        });
    }
  }
};
</script>
<style scoped>
.chart {
  width: 100%;
  height: 100%;
}

.table-wrap {
  height: 100%;
}

.processContainer {
  display: -webkit-box;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  background: #ffffff;
  box-shadow: 0 1px 5px 0 rgba(18, 29, 106, 0.2);
  border-radius: 4px;
}

.processContainer ::v-deep .el-table {
  height: 100%;
}

.processContainer ::v-deep .el-table .el-table__body-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
}

.processContainer ::v-deep .el-table .el-table__body-wrapper.is-scrolling-none {
  height: calc(100vh - 150px);
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
  height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  padding: 16px 24px 46px 24px;
}

.pageRight .mainContent {
  width: 100%;
  height: calc(100% - 111px);
}

.pageRight ::v-deep .tabs.el-tabs.el-tabs--top {
  padding-bottom: 16px;
}

.fill {
  width: 100%;
  height: 100%;
}

.empty-text {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  color: #909399;
}

.pageLeft.spread-tree {
  width: 0;
}

.pageLeft.spread-tree ::v-deep .tree-filter {
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

.pageLeft.over-tree ::v-deep .tree-filter {
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

.icon-qingqibing_xinxi {
  position: absolute;
  margin-left: 4px;
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
