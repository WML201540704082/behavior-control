<template>
  <div>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <div style="width: 350px;height: 28px;margin-top: -16px">
            <!-- 日期 -->
            <el-button :class="this.cycleDateValue === '1' ? 'date-button shadow-button' : 'date-button'" type="primary" round @click="statisticsDate('1')">今日</el-button>
            <el-button :class="this.cycleDateValue === '2' ? 'date-button shadow-button' : 'date-button'" type="primary" round @click="statisticsDate('2')">本周</el-button>
            <el-button :class="this.cycleDateValue === '3' ? 'date-button shadow-button' : 'date-button'" type="primary" round @click="statisticsDate('3')">本月</el-button>
            <el-button :class="this.cycleDateValue === '4' ? 'date-button shadow-button' : 'date-button'" type="primary" round @click="statisticsDate('4')">本年度</el-button>
          </div>
        </basic-container>
      </el-col>
      <el-col :span="4">
        <div style="height: 193px;margin: 0 -7px 0 0">
          <!-- 1、总数 -->
          <div class="count-plan count-background" style="position: relative">
            <img style="width: 16px; height: 16px;position: absolute;margin: -23px 0 0 -160px" src="./img/plan.svg" />
            <div style="position: absolute; top: 37px; left: 56px; font-size: 11px; color: #ffffff;">计划总数</div>
            <div style="width: 122px; height: 38px; white-space: nowrap;text-align: center; overflow: hidden; position: absolute; top: 16px; left: 99px; font-size: 26px;color: #ffffff">{{ statistics.planCount }}</div>
            <div style="position: absolute; top: 37px; left: 223px; font-size: 11px; color: #ffffff;">个</div>
          </div>
          <div class="count-warning count-background" style="position: relative">
            <img style="width: 16px; height: 16px;position: absolute;margin: -23px 0 0 -160px" src="./img/warning.svg" />
            <div style="position: absolute; top: 37px; left: 56px; font-size: 11px; color: #ffffff;">告警总数</div>
            <div style="width: 122px; height: 38px; white-space: nowrap;text-align: center; overflow: hidden; position: absolute; top: 16px; left: 99px; font-size: 26px;color: #ffffff">{{ statistics.warningCount }}</div>
            <div style="position: absolute; top: 37px; left: 223px; font-size: 11px; color: #ffffff;">个</div>
          </div>
          <div class="count-work-order count-background" style="position: relative">
            <img style="width: 16px; height: 16px;position: absolute;margin: -23px 0 0 -160px" src="./img/workOrder.svg" />
            <div style="position: absolute; top: 37px; left: 56px; font-size: 11px; color: #ffffff;">工单总数</div>
            <div style="width: 122px; height: 38px; white-space: nowrap;text-align: center; overflow: hidden; position: absolute; top: 16px; left: 99px; font-size: 26px;color: #ffffff">{{ statistics.workOrdernCount }}</div>
            <div style="position: absolute; top: 37px; left: 223px; font-size: 11px; color: #ffffff;">个</div>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <basic-container>
          <div style="height: 193px">
            <!-- 2、工作任务指标 -->
            <img style="width: 23px; height: 23px;float: left;margin: 0 4px 0 -4px" src="./img/taskIndicators.svg" />
            <div style="margin-top: -14px"><span style="color: #192C7D;">工作任务指标</span></div>
            <div class="gradient-line" />
            <div style="display: flex">
              <pie-chart :series-data="statistics.chart1.seriesData" :title-text="'巡视故障率'" />
              <pie-chart :series-data="statistics.chart2.seriesData" :title-text="'检修超时率'" />
              <pie-chart :series-data="statistics.chart3.seriesData" :title-text="'检修计划率'" />
              <pie-chart :series-data="statistics.chart4.seriesData" :title-text="'维修完成率'" />
            </div>
            <div style="margin-top: -33px">
              <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="6">
                  <div style="text-align: center;color: rgb(102,102,102)">
                    {{ statistics.chart1.ratioData }}
                    <img v-show="statistics.chart1.ratioData.includes('上升')" style="width: 23px; height: 23px;position: absolute;margin-left: 5px" src="./img/rising.svg" />
                    <img v-show="statistics.chart1.ratioData.includes('下降')" style="width: 23px; height: 23px;position: absolute;margin-left: 5px" src="./img/decline.svg" />
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="text-align: center;color: rgb(102,102,102)">
                    {{ statistics.chart2.ratioData }}
                    <img v-show="statistics.chart2.ratioData.includes('上升')" style="width: 23px; height: 23px;position: absolute;margin-left: 5px" src="./img/rising.svg" />
                    <img v-show="statistics.chart2.ratioData.includes('下降')" style="width: 23px; height: 23px;position: absolute;margin-left: 5px" src="./img/decline.svg" />
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="text-align: center;color: rgb(102,102,102)">
                    {{ statistics.chart3.ratioData }}
                    <img v-show="statistics.chart3.ratioData.includes('上升')" style="width: 23px; height: 23px;position: absolute;margin-left: 5px" src="./img/rising.svg" />
                    <img v-show="statistics.chart3.ratioData.includes('下降')" style="width: 23px; height: 23px;position: absolute;margin-left: 5px" src="./img/decline.svg" />
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="text-align: center;color: rgb(102,102,102)">
                    {{ statistics.chart4.date }}工单总计：{{ statistics.chart4.countData }} 已完成：{{ statistics.chart4.completeData }}
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </basic-container>
      </el-col>
      <el-col :span="18">
        <basic-container>
          <!-- 3、区域作业统计 -->
          <img style="width: 23px; height: 23px;float: left;margin: -11px 4px 0 -4px" src="./img/taskIndicators.svg" />
          <div style="margin-top: -12px"><span style="color: #192C7D;">区域作业统计</span></div>
          <div class="gradient-line" />
          <div style="margin: 5px 0 -32px 41px; position: relative; z-index: 99999">
            <el-radio v-model="activeName" label="1">作业计划</el-radio>
            <el-radio v-model="activeName" label="2">作业工单</el-radio>
          </div>
          <div>
            <double-bar-chart v-show="activeName === '1'" :series-data="statistics.chart5.seriesData" :series-data2="statistics.chart5.seriesData2" />
            <three-bar-chart v-show="activeName === '2'" :series-data="statistics.chart6.seriesData" :series-data2="statistics.chart6.seriesData2" :series-data3="statistics.chart6.seriesData3" />
          </div>
        </basic-container>
      </el-col>
      <el-col :span="6" style="margin: 0 0 0 -20px; width: 440px">
        <basic-container>
          <!-- 4、工单类型分布 -->
          <img style="width: 23px; height: 23px;float: left;margin: -11px 4px 0 -4px" src="./img/taskIndicators.svg" />
          <div style="margin-top: -12px"><span style="color: #192C7D;">工单类型分布</span></div>
          <div class="gradient-line" />
          <div style="width: 370px; height: 250px">
            <pie3-d-chart :series-data="statistics.chart7.seriesData" :series-data2="statistics.chart7.seriesData2" :series-data3="statistics.chart7.seriesData3" />
          </div>
        </basic-container>
      </el-col>
      <el-col :span="18">
        <basic-container>
          <!-- 5、检修类别统计 -->
          <img style="width: 23px; height: 23px;float: left;margin: -11px 4px 0 -4px" src="./img/taskIndicators.svg" />
          <div style="margin-top: -12px"><span style="color: #192C7D;">检修类别统计</span></div>
          <div class="gradient-line" />
          <div style="width: 1186px; height: 208px">
            <stack-bar-chart :series-data="statistics.chart8.seriesData" />
          </div>
        </basic-container>
      </el-col>
      <el-col :span="6" style="margin: 0 0 0 -20px; width: 440px">
        <basic-container>
          <!-- 6、工作类别分布 -->
          <img style="width: 23px; height: 23px;float: left;margin: -11px 4px 0 -4px" src="./img/taskIndicators.svg" />
          <div style="margin-top: -12px"><span style="color: #192C7D;">工作类别分布</span></div>
          <div class="gradient-line" />
          <div style="width: 370px;height: 208px;">
            <rose-chart :series-data="statistics.chart9.seriesData" />
          </div>
        </basic-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryOneData, queryTwoData } from '@/api/xcnanr/statisticalAnalysis'
import PieChart from '@/views/xcnanr/statisticalAnalysis/indexChart/echarts/PieChart'
import DoubleBarChart from '@/views/xcnanr/statisticalAnalysis/indexChart/echarts/DoubleBarChart'
import ThreeBarChart from '@/views/xcnanr/statisticalAnalysis/indexChart/echarts/ThreeBarChart'
import Pie3DChart from '@/views/xcnanr/statisticalAnalysis/indexChart/echarts/Pie3DChart'
import StackBarChart from '@/views/xcnanr/statisticalAnalysis/indexChart/echarts/StackBarChart'
import RoseChart from '@/views/xcnanr/statisticalAnalysis/indexChart/echarts/RoseChart'

export default {
  name: 'StatisticalAnalysis',
  components: { queryOneData, queryTwoData, PieChart, DoubleBarChart, ThreeBarChart, Pie3DChart, StackBarChart, RoseChart },
  data() {
    return {
      activeName: '1',
      cycleDateValue: '4',
      statistics: {
        planCount: 0, warningCount: 0, workOrdernCount: 0,
        chart1: { seriesData: [{ name: '故障工单占比', value: '' }, { name: '无故障工单占比', value: '0' }], ratioData: '' },
        chart2: { seriesData: [{ name: '超时工单占比', value: '' }, { name: '未超时工单占比', value: '0' }], ratioData: '' },
        chart3: { seriesData: [{ name: '计划工单占比', value: '' }, { name: '未关联计划工单占比', value: '0' }], ratioData: '' },
        chart4: { seriesData: [{ name: '完成工单占比', value: '' }, { name: '未完成工单占比', value: '0' }], date: '较前一日', countData: '', completeData: ''  },
        chart5: { xAxisData: [], seriesData: [], seriesData2: [] },
        chart6: { xAxisData: [], seriesData: [], seriesData2: [], seriesData3: [] },
        chart7: { xAxisData: [], seriesData: '', seriesData2: '', seriesData3: '' },
        chart8: { xAxisData: [], seriesData: [], seriesData2: [], seriesData3: [] },
        chart9: { xAxisData: [], seriesData: [] }
      }
    }
  },
  // watch: {
  //   activeName: {
  //     handler(newValue, oldValue) {
  //       console.log(newValue, 'newValue++++++');
  //       console.log(oldValue, 'oldValue+++++++');
  //     },
  //     deep: true,
  //     // immediate: true
  //   }
  // },
  created() {
    this.initUpChartData()
  },
  methods: {
    statisticsDate(data) {
      this.cycleDateValue = data
      if(data === '2') {
        this.statistics.chart3.date = '较前一周'
      } else if(data === '3') {
        this.statistics.chart3.date = '较前一月'
      } else if(data === '4') {
        this.statistics.chart3.date = '较前一年'
      }
      this.initUpChartData()
    },
    initUpChartData() {
      queryOneData({ cycleDate: this.cycleDateValue }).then(res => {
        console.log(res.data, '上半部分--------')
        // 1.总数（计划总数、告警总数、工单总数）
        this.statistics.planCount = res.data.jihuaCount
        this.statistics.warningCount = res.data.warningCount
        this.statistics.workOrdernCount = res.data.gongdanCount
        // 2.工作任务指标（巡视故障率、检修超时率、检修计划率、维修完成率）
        this.statistics.chart1.seriesData =  [{ name: '故障率占比', value: res.data.inspWorkRate }, { name: '未超时工单', value: (100 - res.data. inspWorkRate)}]
        this.statistics.chart1.ratioData = res.data.workerPreviUpOrDown
        this.statistics.chart2.seriesData =  [{ name: '超时工单占比', value: res.data.repairChaoshiRate }, { name: '未超时工单占比', value: (100 - res.data. repairChaoshiRate)}]
        this.statistics.chart2.ratioData = res.data.repairPreviRateUpOrDown
        this.statistics.chart3.seriesData =  [{ name: '计划工单占比', value: res.data.planIdCountRate }, { name: '未关联计划工单占比', value: (100 - res.data. planIdCountRate)}]
        this.statistics.chart3.ratioData = res.data.planIdCountPreviUpOrDown
        this.statistics.chart4.seriesData =  [{ name: '超时工单占比', value: res.data.mainCompleRate }, { name: '未超时工单占比', value: (100 - res.data. mainCompleRate)}]
        this.statistics.chart4.countData = res.data.mainpreviCount
        this.statistics.chart4.completeData = res.data.mainpreviCompleCount
      })
      queryTwoData({ cycleDate: this.cycleDateValue }).then(res => {
        console.log(res.data, '下半部分--------')
        // 3.区域作业统计（作业计划、作业工单）
        this.statistics.chart5.seriesData = res.data.productPlanBar.inspectPlanList
        this.statistics.chart5.seriesData2 = res.data.productPlanBar.repairPlanList

        this.statistics.chart6.seriesData = res.data.productOrderBar.inspectOrderList
        this.statistics.chart6.seriesData2 = res.data.productOrderBar.repairList
        this.statistics.chart6.seriesData3 = res.data.productOrderBar.maintanceList
        // 4.工单类型分布
        this.statistics.chart7.seriesData = res.data.proTypePie.infoMaintanceRate
        this.statistics.chart7.seriesData2 = res.data.proTypePie.insWorkerRate
        this.statistics.chart7.seriesData3 = res.data.proTypePie.infoRepairRate
        // 5.检修类别统计
        this.statistics.chart8.seriesData = res.data.repairCiModeBar
        // 6.工作类别分布
        this.statistics.chart9.seriesData = res.data.jobCategoryPie
      })
    }
  }
}
</script>

<style scoped>
  ::v-deep(.date-button) {
    height: 22px;
    padding: 4px 11px;
    font-size: 12px;
  }
  ::v-deep(.shadow-button) {
    filter:progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=4);/*ie*/
    -moz-box-shadow: 2px 2px 10px #909090;/*firefox*/
    -webkit-box-shadow: 2px 2px 10px #909090;/*safari或chrome*/
    box-shadow:2px 2px 10px #909090;/*opera或ie9*/
    font-weight: 1600;
    font-size: 14px;
  }
  .gradient-line {
    height: 1px;
    overflow: hidden;
    margin: 3px 0 2px 2px;
    background-image: linear-gradient(90deg,rgba(20,114,255,0.00), rgba(49, 109, 199, 0.81) 4%, rgba(20,114,255,0.00));
  }
  ::v-deep(.count-plan) {
    background-image: url('./img/planCount.png');
  }
  ::v-deep(.count-warning) {
    background-image: url('./img/warningCount.png');
  }
  ::v-deep(.count-work-order) {
    background-image: url('./img/workOrderCount.png');
  }
  ::v-deep(.count-background) {
    width: 87%;
    height: 17px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    padding: 20px;
    margin: 1px 1px 13px 16px;
  }
</style>
