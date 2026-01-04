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
      default: '256px'
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
      colors: ['#62C5E5', '#EFB56D', '#6ECAA2', '#F1A0BB', '#BEC140', '#7FA2B6', '#E9BB30', '#A197DF', '#7F9CD6', '#F18B34']
    }
  },
  watch: {
    seriesData: {
      handler() {
        this.setOptions()
      },
      deep: true
    },
    seriesData2: {
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
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs['barChart'], 'macarons')
      this.setOptions()
    },
    setOptions() {
      // X轴名称合并去重
      const regionNames = [...new Set(
        this.seriesData.map(item => item.region_name)
          .concat(this.seriesData2.map(item => item.region_name))
      )]
      // Y轴的两个系列的数据构建
      const inspectData = regionNames.map(region => {
        const item = this.seriesData.find(i => i.region_name === region);
        return item ? item.ct : 0
      })
      const repairData = regionNames.map(region => {
        const item = this.seriesData2.find(i => i.region_name === region);
        return item ? item.ct : 0
      })
      this.chart.setOption({
        color: this.colors,
        grid: {
          left: '1%',
          right: '1%',
          bottom: '1%',
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
          top: '6%',
          left: '82.5%',
          show: true // 不展示图例
        },
        xAxis: [
          {
            type: 'category',
            data: regionNames,
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
            data: inspectData,
            name: '巡视计划',
            type: 'bar',
            barWidth: '40'
          },
          {
            data: repairData,
            name: '检修计划',
            type: 'bar',
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
