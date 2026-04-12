<template>
  <div>
    <div ref="chart1" :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
export default {
  name: 'PieChart',
  props: {
    className: {
      type: String,
      default: 'echarts.js'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '330px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    seriesData: {
      type: Array,
      default: null
    },
    titleText: {
      type: String,
      default: '统计图'
    }
  },
  data() {
    return {
      chart: null,
      colors: ['#62C5E5', '#EFB56D', '#6ECAA2', '#F1A0BB', '#BEC140', '#7FA2B6', '#E9BB30', '#A197DF', '#7F9CD6', '#F18B34'], chartSize: {},
      chartData: []
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
      this.chart = echarts.init(this.$refs['chart1'], 'macarons')
      this.setOptions()
    },
    setOptions() {
      // 数据处理
      if (this.seriesData && this.seriesData.length > 0) {
        for (const data of this.seriesData) {
          this.chartData.push(data)
        }
      }
      this.chart.setOption({
        color: this.colors,
        title: {
          text: this.titleText,
          left: 'center',
          show: false,
          // top: 40,
          textStyle: {
            fontSize: 12,
            fontFamily: 'PingFang SC',
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          textStyle: {
            align: 'left',
            fontSize: 12,
            fontFamily: 'PingFang SC',
            color: '#ffffff'
          },
          position: 'top',
          padding: [5, 10],
          formatter: function(param) {
            const val = param.value > 10000
              ? (parseFloat((param.value / 10000).toFixed(2)) + '亿千瓦时') : (param.value + '万千瓦时')
            return param.name + '<br/>' + '累计用电量：' + val + '<br/>占比：' + param.percent + '%'
          }
        },
        legend: {
          orient: 'horizontal',
          x: 'center',
          bottom: 0,
          // itemHeight: this.chartSize.legendHeight,
          // itemWidth: this.chartSize.legendWidth,
          textStyle: {
            color: 'auto',
            fontSize: 12,
            fontFamily: 'PingFang SC'
          }
        },
        series: [
          // {
          //   type: 'pie',
          //   radius: '60%',
          //   center: ['50%', '48%'],
          //   data: this.chartData,
          //   emphasis: {
          //     itemStyle: {
          //       show: true,
          //       shadowBlur: 10,
          //       shadowOffsetX: 0,
          //       shadowColor: 'rgba(0, 0, 0, 0.5)'
          //     }
          //   },
          //   label: {
          //     normal: {
          //       fontSize: this.chartSize.x,
          //       fontFamily: 'PingFang SC',
          //       position: 'inner',
          //       show: true,
          //       formatter: '{d}%'
          //     }
          //   },
          //   itemStyle: {
          //     normal: {
          //       label: {
          //         fontSize: this.chartSize.x,
          //         fontFamily: 'PingFang SC'
          //       },
          //       labelLine: {
          //         show: false,
          //         length: 30,
          //         length2: 20,
          //         lineStyle: {
          //           width: 5
          //         }
          //       }
          //     }
          //   }
          // },
          {
            type: 'pie',
            radius: '70%',
            center: ['50%', '48%'],
            data: this.chartData,
            emphasis: {
              itemStyle: {
                show: true,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                fontSize: 12,
                fontFamily: 'PingFang SC',
                position: 'outside',
                show: true,
                formatter: '{b}\n{c}'
              }
            },
            itemStyle: {
              normal: {
                label: {
                  fontSize: 12,
                  fontFamily: 'PingFang SC'
                },
                labelLine: {
                  show: false,
                  length: 10,
                  length2: 10,
                  lineStyle: {
                    width: 5
                  }
                }
              }
            }
          }
        ]
      })
    },
    changeIndustryType(data) {
      if (data === 1) {
        return '第一产业'
      } else if (data === 2) {
        return '第二产业'
      } else if (data === 4) {
        return '第三产业'
      } else {
        return '城乡居民'
      }
    }
  }
}
</script>

<style scoped>
  color-profile{
    color: #8280ff;
  }
</style>
