<template>
  <div ref="barChart" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
  name: 'DoubleBarChart',
  props: {
    width: {
      type: String,
      default: '1175px'
    },
    height: {
      type: String,
      default: '235px'
    },
    titleText: {
      type: String,
      default: ''
    },
    yAxisName: {
      type: Array,
      default: null
    },
    xAxisData: {
      type: Array,
      default: null
    },
    seriesData: {
      type: Array,
      default: null
    },
    seriesData2: {
      type: Array,
      default: null
    },
    seriesName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      colors: ['#62C5E5', '#EFB56D', '#6ECAA2', '#F1A0BB', '#BEC140', '#7FA2B6', '#E9BB30', '#A197DF', '#7F9CD6', '#F18B34'],
      xData: '', yData: 0, xData2: '', yData2: 0
    }
  },
  watch: {
    seriesData: {
      handler(data) {
        this.xData = data.map(item => item.ci_label)
        this.yData = data.map(item => item.yuanchengCount)
        this.yData2 = data.map(item => item.jifangCount)
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
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs['barChart'], 'macarons')
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        color: this.colors,
        grid: {
          left: '1%',
          right: '1%',
          bottom: '15%',
          top: '19%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          top: '1%',
          left: '82.5%',
          show: true // 不展示图例
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            data: this.yData,
            name: '远程作业',
            type: 'bar',
            stack: 'order',
            barWidth: '40'
          },
          {
            data: this.yData2,
            name: '现场作业',
            type: 'bar',
            stack: 'order',
            barWidth: '40'
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
</style>
