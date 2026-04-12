<!--热门流程分析-->
<template>
  <div id="popularProcessContent" class="list-container modelEditor">
    <el-container class="list-box">
      <el-main>
        <Tabs
          :remarks="remarks"
          :set-width="'calc(100% - 727px)'"
          @isShowList="isShowList"
          @getQueryList="getQueryList"
        />
        <div
          v-show="!showList && list.length > 0 && !isNone"
          id="chartPie"
          class="chart"
        />
        <div
          v-show="!showList && list.length === 0 && isNone"
          class="fill empty-text"
        >
          暂无数据
        </div>
        <div v-show="showList" class="table-wrap">
          <el-table
            v-loading="listLoading"
            ref="tableRow"
            :data="list"
            element-loading-text="加载中"
            :default-sort="{ prop: 'instanceCount', order: 'descending' }"
            tooltip-effect="light"
            height="calc(100% - 34px)"
            fit
            stripe
            class="lcdp-table"
          >
            <el-table-column
              label="序号"
              type="index"
              width="150"
              align="center"
            />
            <el-table-column label="流程名称" prop="processName">
            </el-table-column>
            <el-table-column prop="instanceCount" label="实例数" />
          </el-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import Tabs from '../../../components/dataPickerTabs/index.vue';
import * as popular from '@/api/workflow/analyse/popularProcessAnalysis';


let resizeObserve = null;
let chartStatus = null;

export default {
  name: 'PopularProcessAnalysis',
  components: { Tabs },
  data() {
    return {
      // 查询条件
      listQuery: {
        size: 5,
        statisType: 'month', // 统计类型
        autoStartTime: null, // 自定义开始时间
        autoEndTime: null, // 自定义结束时间
        dayTime: null, // 按天统计时间
        monthMonth: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`, // 按月统计的月份值 2022-05
        quarterYear: null, // 按季度统计的年份值
        quarterQuarter: null, // 按季度统计的季度值
        yearYear: '2022' // 按年份统计的年份值
      },
      showList: false,
      list: [],
      listLoading: false,
      isNone: false, // 是否查询到数据
      chart: null,
      remarks: '统计特定时间内实例数量排行前N的流程，对流程进行监控。'
    };
  },
  computed: {
    option() {
      // instanceCount statusName
      const self = this;
      const data = [];
      self.list.forEach(item => {
        const obj = {};
        obj.value = item.instanceCount;
        obj.name = item.processName;
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
          backgroundColor: 'rgba(111, 111, 111, 1)',
          borderWidth: 0,
          borderColor: 'rgba(255, 255, 255, 0)',
          textStyle: {
            color: '#fff',
            fontWeight: '400'
          },
          confine: true,
          renderMode: 'html',
          className:
            'tooltip-lang-text-limit process-analysis-part process-reject-analysis flex'
        },
        legend: {
          type: 'scroll',
          top: 16,
          right: 0,
          padding: 0,
          icon: 'circle',
          itemWidth: 9,
          itemHeight: 9,
          textStyle: {
            color: '#8C8C8C',
            lineHeight: 14
          },
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
            top: 40,
            radius: ['35%', '55%'],
            minAngle: 3,
            avoidLabelOverlap: true,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              color: '#545672',
              lineHeight: 17,
              formatter: '{b}\n{c}个',
              padding: [5, 5, 5, 5],
              width: 100,
              overflow: 'truncate'
            },
            labelLine: {
              show: true,
              length: 40,
              length2: 60,
              lineHeight: 17,
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
  watch: {},
  mounted() {
    this.initProcess().then(() => {
      resizeObserve = new ResizeObserver(() => {
        if (chartStatus) chartStatus.resize();
      });
      resizeObserve.observe(document.getElementById('popularProcessContent'));
    });
  },
  methods: {
    // 初始化操作
    async initProcess() {
      const self = this;
      self.queryProcess();
    },
    drawPie() {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
      // 基于准备好的dom，初始化echarts实例
      let dom = document.getElementById('chartPie');
      if (!dom || dom.clientWidth === 0) return;
      this.chart = echarts.init(dom);
      // 绘制图表
      this.chart.setOption(this.option, true);
      chartStatus = this.chart;
    },
    queryProcess() {
      this.listLoading = true;
      popular
        .getProcessList(this.listQuery)
        .then(res => {
          if (res.code === 10000) {
            this.isNone = res.data.length <= 0;
            this.listLoading = false;
            this.list = res.data;
            this.$nextTick(() => {
              this.drawPie();
            });
          } else {
            this.isNone = true;
            this.listLoading = false;
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
    },
    isShowList(data) {
      this.showList = data;
      this.queryProcess();
    },
    getQueryList(params) {
      this.listQuery = {};
      this.listQuery.size = params.size;
      this.listQuery.statisType = params.statisType;
      if (params.statisType === 'day') {
        this.listQuery.dayTime = params.choiceTime;
      } else if (params.statisType === 'month') {
        this.listQuery.monthMonth = params.choiceTime;
      } else if (params.statisType === 'quarter') {
        this.listQuery.quarterYear = params.choiceTime;
        this.listQuery.quarterQuarter = params.quarterQuarter;
      } else if (params.statisType === 'year') {
        this.listQuery.yearYear = params.choiceTime;
      } else if (params.statisType === 'auto') {
        this.listQuery.autoStartTime = params.choiceTime.startTime;
        this.listQuery.autoEndTime = params.choiceTime.endTime;
      }
      this.queryProcess();
    }
  }
};
</script>

<style lang="scss" scoped>
  .el-container{
    height: calc(100vh - 90px);
background: #fff;
  }
.list-container {
}

::v-deep .el-main {
  height: calc(100vh - 50px);
}

.el-main {
  color: #333;
  padding: 16px 24px 46px 24px;
}

.chart {
  width: 100%;
  height: calc(100% - 95px);
}

.table-wrap {
  height: calc(100% - 112px) !important;
}

.fill {
  width: 100%;
  height: 100%;
}

.empty-text {
  color: #909399;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}

::v-deep .el-table .cell:empty::before {
  content: '';
}

::v-deep .el-table__row.selected-row,
::v-deep
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped.selected-row,
::v-deep
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped.selected-row
  td {
  background: #e4f2ff;
}
</style>
<style lang="scss" scoped>
::v-deep .tooltip-lang-text-limit.process-analysis-part.process-reject-analysis span {
  display: inline-block;
  max-width: 400px;
  width: fit-content;
  white-space: normal;
  word-break: break-all;
  vertical-align: middle;
  line-height: 20px;
}

::v-deep .tooltip-lang-text-limit.process-analysis-part.process-reject-analysis.flex
  div {
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
}
</style>
