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
      default: '235px'
    },
    titleText: {
      type: String,
      default: ''
    },
    seriesData: {
      type: String,
      default: ''
    },
    seriesData2: {
      type: String,
      default: ''
    },
    seriesData3: {
      type: String,
      default: ''
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
      this.chart.setOption({
        color: this.colors,
        grid: {
          left: '15%',
          right: '15%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: function (row){
            const name = row.name
            const value = row.value
            const percent = row.percent
            const text = (value > 0)? (name + '\n' + percent + '%'): ''
            return text
          }
        },
        legend: {
          orient: 'vertical', //可设定图例水平（horizontal）排列还是竖直排列
          show: true,
          x: 'right', // 图例放在右侧
          y: 'center', // 垂直居中
          padding:[0,0,0,30],
          // align: 'left' // 对齐方式
        },
        series: [
          {
            data: [{ value: this.seriesData, name: '维修工单' }, { value: this.seriesData2, name: '巡视工单' }, { value: this.seriesData3, name: '检修工单' }],
            type: 'pie',
            radius: ['0%', '88%'],
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
                show: false, // 中心不显示文字
                fontSize: 20,
                fontWeight: 'bold'
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
