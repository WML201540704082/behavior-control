<template>
  <div id="chart1" ref="chart1" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
// import resize from '@/views/dashboard/mixins/resize'

export default {
  // mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
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
      colors: ['#62C5E5', '#EFB56D', '#6ECAA2', '#F1A0BB', '#BEC140', '#7FA2B6', '#E9BB30', '#A197DF', '#7F9CD6', '#F18B34']
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
      // this.moduleData = [//巡视人工单统计
      //   {personName: "李飞",orderNum: 1 },
      //   {personName: "刘丽娟",orderNum: 1},
      //   {personName: "张三",orderNum: 1}
      // ]
      const type = '工单数'
      // 需要按照从大到小排列
      let showData = []
      this.moduleData.forEach(item => {
        showData.push(item)
      })
      // 按照数量从到小排序
      showData = showData.sort((a, b) => { return b.orderNum - a.orderNum })
      const names = []
      const data = []
      showData.forEach(item => {
        names.push(item.personName)
        data.push(item.orderNum)
      })
      // names = ['张店区', '周村区', '临淄区', '淄川区', '博山区', '高青县', '沂源县', '桓台县']
      // data = [0, 0, 0, 0, 0, 0, 0, 0]

      var showTitle = '工单数量统计'
      this.chart1.setOption({
        // color: this.colors,
        title: {
          show: false,
          text: showTitle,
          textStyle: {
            fontSize: 17,
            // fontFamily: 'PingFang SC'
            // color: '#ffffff'
          },
          left: 'center',
          top: 10
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 10,
          top: 40,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          textStyle: {
            fontSize: 14,
            // fontFamily: 'PingFang SC'
            // color: '#ffffff'
          },
          padding: [5, 10]
        },
        // legend: {
        //   data: legends,
        //   icon: 'roundRect',
        //   bottom: '10',
        //   textStyle: {
        //     color: 'auto',
        //     fontSize: 14, fontFamily: 'PingFang SC'
        //   }
        // },
        xAxis: {
          axisLabel: {
            // color: '#fff',
            // color: 'black',
            showMaxLabel: true,
            interval: 0,
            fontSize: 14,
            // fontFamily: 'PingFang SC'
          },
          nameTextStyle: {
            // color: '#fff',
            color: 'black',
            fontSize: 14,
            // fontFamily: 'PingFang SC'
          },
          data: names
        },
        yAxis: [
          {
            type: 'value',
            name: '工单数/个',
            // nameGap: 30,
            minInterval: 1,
            axisLabel: {
              // color: '#fff',
              // color: 'black',
              fontSize: 14,
              // fontFamily: 'PingFang SC',
              formatter: '{value}'
            },
            // min: 0,
            axisLine: { show: true },
            nameTextStyle: {
              // color: 'black',
              fontSize: 14,
              // fontFamily: 'PingFang SC'
            },
            splitArea: {
              show: false
            },
            scale: true,
            splitLine: { show: true }
          }
        ],
        series: [
          {
            name: type,
            type: 'bar',
            stack: 'Ad',
            barMaxWidth: '30%',
            // itemStyle: { barBorderRadius: [10, 10, 0, 0] },
            data: data,
            itemStyle: {
              barBorderRadius: 5,
              color: '#e07a2c'
                //   new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                // { offset: 0, color: '#62C5E5' },
                // { offset: 0.5, color: '#62C5E550' },
                // { offset: 1, color: '#62C5E500' }
              // ])
            }
          }
        ]
      })
    }
  }
}
</script>
