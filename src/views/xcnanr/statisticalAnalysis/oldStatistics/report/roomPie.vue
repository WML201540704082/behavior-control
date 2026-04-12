<template>
  <div :id="className" ref="chart1" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme


export default {
  props: {
    className: {
      type: String,
      default: 'chart1'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    moduleData: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      chart1: null,
      colors: ['#16cc80','#4f97ff','#62C5E5', '#7F9CD6', '#6ECAA2', '#F1A0BB', '#BEC140', '#7FA2B6', '#E9BB30', '#A197DF',  '#F18B34']
    }
  },
  watch: {
    moduleData: {
      handler(val) {
        console.log(val)
        this.setOptions1()
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      this.setOptions1()
    })
  },
  beforeDestroy() {
    if (!this.chart1) {
      return
    }
    this.chart1.dispose()
    this.chart1 = null
  },
  methods: {
    initChart() {
      this.chart1 = echarts.init(this.$refs['chart1'], 'macarons')
    },
    setOptions1() {
      const _this = this
      if (_this.chart1 == null) {
        _this.initChart()
      }
      // const showData = this.moduleData
      const colors = this.colors
      let showData = []
      let names = []
      this.moduleData.forEach((item,index) => {
        item['itemStyle'] = { color: colors[index] }
        showData.push(item)
        names.push(item.name)
      })
      //
      // showData.forEach((item,index) => {
      //   item.itemStyle = { color: colors[index] }
      // })
      this.chart1.setOption({
        color: this.colors,
        // grid: {
        //   left: 40,
        //   right: 40,
        //   bottom: 20,
        //   top: 20,
        //   containLabel: true
        // },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross'
          },
          textStyle: {
            fontSize: 14, fontFamily: 'PingFang SC',
            color: '#ffffff'
          },
          formatter: '{b}\n 数量：{c}个\n占比：{d}%',
          padding: [5, 10]
        },
        legend: {
          data: names,
          icon: 'roundRect',
          bottom: 5,
          textStyle: {
            color: 'auto',
            fontSize: 14,
            fontFamily: 'PingFang SC'
          }
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            // radius: ['75%', '85%'],
            avoidLabelOverlap: false,
            label: {
              position: 'inner',
              show: true,
              formatter: function (row){
                const name = row.name
                const value = row.value
                const percent = row.percent
                const text = (value > 0)? (name + '\n' + percent + '%'): ''
                return text
              },
              color: '#ffffff',
              lineHeight: 25,
              fontSize: 23,
              fontWeight: 'normal',
              fontFamily: 'PingFang SC'
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0
              }
            },
            labelLine: {
              show: false
            },
            data: showData
          }
        ]
      })
    }
  }
}
</script>
