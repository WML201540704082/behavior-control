<template>
  <el-card>
    <div style="height:calc(100vh - 170px);margin-left: 10px;">
      <div style="float: left;">可视化分析报告</div>
      <div class="date-selector">
        <el-button 
          size="mini"
          v-for="(item, index) in dateOptions" 
          :key="index"
          type="text"
          :class="{ active: currentDate === item.value }"
          @click="handleDateChange(item.value)"
        >
          {{ item.label }}
        </el-button>
        <div class="other-time" v-show="!datePicker" @click="showDatePicker">
          <i class="el-icon-circle-plus-outline"></i>
        </div>
        <div v-show="datePicker">
          <el-date-picker
            v-model="start"
            size="mini"
            type="date"
            :clearable="false"
            @change="value => dateRange(value, 'start')"
            placeholder="选择开始时间">
          </el-date-picker>
          <span style="font-size: 12px;padding: 6px">至</span>
          <el-date-picker
            v-model="end"
            size="mini"
            type="date"
            :clearable="false"
            @change="value => dateRange(value, 'end')"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </div>
      <div class="my-charts">
        <div id="terminal_chart"></div>
        <div id="user_chart"></div>
        <div id="department_chart"></div>
        <div id="url_chart"></div>
      </div>
    </div>
  </el-card>
</template>
<script>
import * as echarts from "echarts";
import {getTerminalRank,getUserRank,getDeptRank} from "@/api/terminal";
import moment from 'moment'

export default {
  props: {},
  components: {},
  data() {
    return {
      turnoverLoading: false,
      datePicker: false,
      start: moment().startOf('month').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      terminalChart: null,
      userChart: null,
      departmentChart: null,
      urlChart: null,
      // 当前选中的日期类型
      currentDate: 'month',
      // 日期选项配置
      dateOptions: [
        { label: '昨天', value: 'yesterday' },
        { label: '今天', value: 'today' },
        // { label: '上月', value: 'lastMonth' },
        { label: '本月', value: 'month' }
      ],
      value1: '',
    };
  },
  watch: {},
  computed: {},
  mounted() {
    this.terminalChart = echarts.init(document.getElementById("terminal_chart"));
    this.userChart = echarts.init(document.getElementById("user_chart"));
    this.departmentChart = echarts.init(document.getElementById("department_chart"));
    this.urlChart = echarts.init(document.getElementById("url_chart"));
    this.terminalRank()
    this.userRank()
    this.deptRank()
    // this.urlCountRank()
  },
  methods: {
    // 切换日期选择
    handleDateChange(value) {
      this.datePicker = false
      this.currentDate = value;
      let start = ''
      let end = ''
      switch(value) {
      case 'today':
        start = moment()
        end = moment()
        break
      case 'yesterday':
        start = moment().subtract(1, 'days')
        end = moment().subtract(1, 'days')
        break
      case 'month':
        start = moment().startOf('month')
        end = moment()
        break
      case 'lastMonth':
        start = moment().startOf('month').subtract(1, 'month')
        end = moment().endOf('month').subtract(1, 'month').endOf('month')
      default:
        break
      }
      this.start = start.format('YYYY-MM-DD')
      this.end = end.format('YYYY-MM-DD')
      this.terminalRank()
      this.userRank()
      this.deptRank()
      // this.urlCountRank()
    },
    dateRange(value, type) {
      if (type === 'start') {
        this.start = value
      } else if (type === 'end') {
        this.end = value
      }
      if (this.start && this.end) {
        this.terminalRank()
        this.userRank()
        this.deptRank()
        // this.urlCountRank()
      }
    },
    // 切换成日期选择
    showDatePicker() {
      if (!this.datePicker) {
        this.currentDate = ''
      }
      this.datePicker = !this.datePicker
    },
    // 终端使用时长
    terminalRank() {
      let aaa1 = this.start + " " + "00:00:00"
      let aaa2 = this.end + " " + "23:59:59"
      getTerminalRank({
        startTime: aaa1,
        endTime: aaa2
      }).then(res => {
        // const ipList = res.data.length > 0 ? res.data.map(item => item.ip) : ['10.192.228.183','10.192.228.117','10.192.228.156','10.192.228.173','10.192.228.149','10.192.228.109','10.192.228.193']
        // const timeLength = res.data.length > 0 ? res.data.map(item => item.timeLength) : [42,38,30,22,18,12,10]
        const ipList = res.data.length > 0 ? res.data.slice(0, 8).map(item => item.ip) : []
        const timeLength = res.data.length > 0 ? res.data.slice(0, 8).map(item => item.timeLength/60) : []
        this.terminalChartInit(ipList,timeLength)
      });
    },
    terminalChartInit(ipList,timeLength) {
      this.terminalChart.setOption({
        title: {
          text: "终端使用时长",
          left: 'center',
          textStyle: {
            color: "#000000", // 标题颜色
            fontSize: 14, // 默认值：18
            fontStyle: "normal", // normal:正常风格（默认值）,italic:倾斜体
            fontWeight: "bold" // normal:正常粗细（默认值）,bold/bolder:粗体,lighter:正常粗细
          },
        },
        grid: {
          left: "60px",
          top: "40px",
          right: "10px",
          bottom: "30px"
        },
        xAxis: {
          show: true,
          axisTick: {
            show: false,
            length: 20 // 竖线的长度
          },
          axisLabel: {
            show: true,
            textStyle: {
                fontSize: 10
            }
          },
          data: ipList,
        },
        yAxis: {
          axisLabel: {
            show: true,
            formatter: '{value}小时',
          }
        },
        series: [
          {
            name: "访问来源",
            type: "bar",
            barWidth: 30,
            data: timeLength,
            itemStyle: {
              color: '#419eff'
            }
          }
        ]
      });
    },
    // 用户使用时长
    userRank() {
      let aaa1 = this.start + " " + "00:00:00"
      let aaa2 = this.end + " " + "23:59:59"
      getUserRank({
        startTime: aaa1,
        endTime: aaa2
      }).then(res => {
        const nameList = res.data.length > 0 ? res.data.slice(0, 8).map(item => item.name) : []
        const totalUseMinutesList = res.data.length > 0 ? res.data.slice(0, 8).map(item => item.totalUseMinutes/60) : []
        this.userChartInit(nameList,totalUseMinutesList)
      });
    },
    userChartInit(nameList,totalUseMinutesList) {
      this.userChart.setOption({
        title: {
          text: "用户使用时长",
          left: 'center',
          textStyle: {
            color: "#000000", // 标题颜色
            fontSize: 14, // 默认值：18
            fontStyle: "normal", // normal:正常风格（默认值）,italic:倾斜体
            fontWeight: "bold" // normal:正常粗细（默认值）,bold/bolder:粗体,lighter:正常粗细
          },
        },
        grid: {
          left: "60px",
          top: "40px",
          right: "10px",
          bottom: "30px"
        },
        xAxis: {
          show: true,
          axisTick: {
            show: false,
            length: 20 // 竖线的长度
          },
          axisLabel: {
            show: true,
            textStyle: {
                fontSize: 10
            }
          },
          data: nameList,
        },
        yAxis: {
          axisLabel: {
            show: true,
            formatter: '{value}小时',
          }
        },
        series: [
          {
            name: "访问来源",
            type: "bar",
            barWidth: 30,
            data: totalUseMinutesList,
            itemStyle: {
              color: '#419eff'
            }
          }
        ]
      });
    },
    // 部门使用终端时长
    deptRank() {
      let aaa1 = this.start + " " + "00:00:00"
      let aaa2 = this.end + " " + "23:59:59"
      getDeptRank({
        startTime: aaa1,
        endTime: aaa2
      }).then(res => {
        const deptList = res.data.length > 0 ? res.data.slice(0, 8).map(item => item.dept) : []
        const lenList = res.data.length > 0 ? res.data.slice(0, 8).map(item => item.len/60) : []
        this.deptChartInit(deptList,lenList)
      });
    },
    deptChartInit(deptList,lenList) {
      this.departmentChart.setOption({
        title: {
          text: "部门使用时长",
          left: 'center',
          textStyle: {
            color: "#000000", // 标题颜色
            fontSize: 14, // 默认值：18
            fontStyle: "normal", // normal:正常风格（默认值）,italic:倾斜体
            fontWeight: "bold" // normal:正常粗细（默认值）,bold/bolder:粗体,lighter:正常粗细
          },
        },
        grid: {
          left: "60px",
          top: "40px",
          right: "10px",
          bottom: "30px"
        },
        xAxis: {
          show: true,
          axisTick: {
            show: false,
            length: 20 // 竖线的长度
          },
          axisLabel: {
            show: true,
            textStyle: {
                fontSize: 10
            }
          },
          data: deptList,
        },
        yAxis: {
          axisLabel: {
            show: true,
            formatter: '{value}小时',
          }
        },
        series: [
          {
            name: "访问来源",
            type: "bar",
            barWidth: 30,
            data: lenList,
            itemStyle: {
              color: '#419eff'
            }
          }
        ]
      });
    },
    // 业务系统访问次数
    // urlCountRank() {
    //   console.log(999, this.start)
    //   let aaa1 = this.start + " " + "00:00:00"
    //   let aaa2 = this.end + " " + "23:59:59"
    //   console.log(9992, aaa1)
    //   getUrlCountRank({
    //     start: aaa1,
    //     end: aaa2
    //   }).then(res => {
    //     const businessNameList = res.data.length > 0 ? res.data.slice(0, 8).map(item => item.businessName || item.url) : []
    //     const countList = res.data.length > 0 ? res.data.slice(0, 8).map(item => item.count) : []
    //     this.urlCountChartInit(businessNameList,countList)
    //   });
    // },
    // urlCountChartInit(businessNameList,countList) {
    //   this.urlChart.setOption({
    //     title: {
    //       text: "业务系统访问次数",
    //       left: 'center',
    //       textStyle: {
    //         color: "#000000", // 标题颜色
    //         fontSize: 14, // 默认值：18
    //         fontStyle: "normal", // normal:正常风格（默认值）,italic:倾斜体
    //         fontWeight: "bold" // normal:正常粗细（默认值）,bold/bolder:粗体,lighter:正常粗细
    //       },
    //     },
    //     grid: {
    //       left: "60px",
    //       top: "40px",
    //       right: "10px",
    //       bottom: "30px"
    //     },
    //     xAxis: {
    //       show: true,
    //       axisTick: {
    //         show: false,
    //         length: 20 // 竖线的长度
    //       },
    //       axisLabel: {
    //         show: true,
    //         textStyle: {
    //             fontSize: 10
    //         }
    //       },
    //       data: businessNameList,
    //     },
    //     yAxis: {
    //       axisLabel: {
    //         show: true,
    //         formatter: '{value}次',
    //       }
    //     },
    //     series: [
    //       {
    //         name: "访问来源",
    //         type: "bar",
    //         barWidth: 30,
    //         data: countList,
    //         itemStyle: {
    //           color: '#419eff'
    //         }
    //       }
    //     ]
    //   });
    // },
  }
};
</script>
<style lang="scss" scoped>
.date-selector {
  float: right;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px;
  margin-bottom: 20px;
}

.date-selector button {
  padding: 5px 12px;
  // border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #ffffff;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  // transition: all 0.2s ease;
}

.date-selector button.active {
  background-color: #0ea5e9;
  color: #ffffff;
  border-color: #0ea5e9;
}

.date-selector button:not(.active):hover {
  background-color: #f3f4f6;
}
.other-time {
  width: 20px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 150px;
}
.my-charts {
  width: 100%;
  height: calc(100vh - 200px);
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 200px;
  scrollbar-width: none; /* Firefox 隐藏滚动条 */
  -ms-overflow-style: none; /* IE/Edge 旧版兼容（可选） */
  overflow-x: hidden; /* 可选：隐藏水平滚动条（按需开启） */
  overflow-y: auto; /* 保留垂直滚动（必须，否则无法滚动） */
  > div {
    width: 50%;
    height: 300px;
  }
}
</style>