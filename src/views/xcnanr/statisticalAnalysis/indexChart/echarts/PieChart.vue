<template>
  <div :id="className" :class="className" ref="pieChart" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
  name: 'PieChart',
  props: {
    className: {
      type: String,
      default: 'pieChart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '175px'
    },
    titleText: {
      type: String,
      default: '检修计划率'
    },
    seriesData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      colors: ['#62C5E5', '#EFB56D', '#6ECAA2', '#F1A0BB', '#BEC140', '#7FA2B6', '#E9BB30', '#A197DF', '#7F9CD6', '#F18B34'],
      timer: null // 用于存储定时任务
    }
  },
  watch: {
    seriesData: {
      handler() {
        this.setOptions()
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    // 清除定时任务
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs['pieChart'], 'macarons')
      this.setOptions()
      // 初始化定时任务
      this.startTimer()
      // 监听鼠标悬停事件
      this.chart.on('mouseover', (v) => {
        if (v.dataIndex !== 0) {
          // 暂停定时任务
          this.pauseTimer()
          // 隐藏定时任务的提示
          this.chart.dispatchAction({
            type: 'hideTip',
            seriesIndex: 0,
            dataIndex: 0
          })
          // 取消高亮定时任务的项
          this.chart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: 0
          })
        }
      })

      // 监听鼠标移出事件
      this.chart.on('mouseout', () => {
        // 恢复定时任务
        this.startTimer()
      })
    },

    startTimer() {
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.chart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: 0
          })
          this.chart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: 0
          })
        }, 2000)
      }
    },

    pauseTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    setOptions() {
      this.chart.setOption({
        color: this.colors,
        title: {
          text: this.titleText,
          show: true,
          subtext: '',
          left: 'left',
          top: '0%',
          textStyle: {
            color: '#000',
            fontSize: 15,
            fontFamily: 'Arial'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '90%',
          left: 'center',
          show: false // 不展示图例
        },
        series: [
          {
            data: this.seriesData,
            type: 'pie',
            radius: ['45%', '55%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold',
                formatter: function(data) {
                  return data.percent + '%'
                }
              }
            },
            labelLine: {
              show: false
            }
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
</style>
