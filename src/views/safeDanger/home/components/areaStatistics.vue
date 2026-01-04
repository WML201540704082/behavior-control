<template>
  <div id="areaChart" style="height: 35vh;padding-top:15px"></div>
</template>

<script>
import { getMatch } from '@/api/safeDanger/control/statistics'

export default {
  props: {
    // chartData: {
    //   type: Array,
    // }
  },
  data() {
    return {
      chartData: [
        {value: 0, name: ''}
      ]
    }
  },
  // watch: {
  //   chartData() {
  //     this.initChart()
  //   }
  // },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      getMatch().then(res => {
        this.chartData[0].value = res.data.toFixed(0)
        this.initChart()
      })
    },
    initChart() {
      let areaChart = this.$echarts.init(document.getElementById('areaChart'))
      areaChart.setOption({
        tooltip: {
          formatter: '{a}: {b}'
        },
        // zoom: 10,
        series: [{
          type: 'gauge',
          data: this.chartData,
          radius: '87%',
          detail: {
            fontSize: 25,
            formatter: '{value}%',
          },
          axisLine: {
            lineStyle: {
              width:20,
              color: [
                [0.3, "#fd666d"],
                [0.7, "#37a2da"],
                [1, "#67e0e3"],
              ]
            }
          },
          pointer: {
            length: 100,
            width: 5
          },
        }]
      })
    }
  }
}
</script>

