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
      default: '100%'
    },
    titleText: {
      type: String,
      default: ''
    },
    seriesData: {
      type: Array,
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
      this.chart = echarts.init(this.$refs['pieChart'], 'macarons')
      this.setOptions()
    },

    setOptions() {
      const chartData = this.seriesData.map(item => ({
        value: item.totalCount,
        name: item.job_category_label
      })).filter(item => item.value !== 0)
      console.log(chartData, 'chartData')
      this.chart.setOption({
        legend: {
          orient: 'vertical',
          itemHeight: 3,
          itemWidth: 12,
          type: 'scroll',
          // top: '30%',
          // left: 'center',
          left: 225,
          top: 5,
          // bottom: 30,
          show: true // 不展示图例
        },
        // grid: {
        //   left: '1%',
        //   right: '1%',
        //   bottom: '1%',
        //   top: '1%',
        //   containLabel: true
        // },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            // name: 'Nightingale Chart',
            type: 'pie',
            radius: [20, 65],
            center: ['40%', '60%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: chartData
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
</style>
