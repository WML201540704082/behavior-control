<template>
  <div v-loading="loading" style="height: 35vh;">
    <div v-if="chartData >0" id="officeMatch" style="height: 35vh;padding-top:15px"></div>
    <div v-else style="height: 35vh;text-align:center;line-height:35vh;color:#606266;font-size:15px">暂无数据</div>
  </div>
</template>

<script>
import { getMatchCount } from '@/api/safeDanger/control/statistics'

export default {
  data() {
    return {
      chartData: 0,
      loading: false
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      this.chartData = 0
      getMatchCount().then(res => {
        this.loading = false
        this.chartData = res.data.toFixed(0)
        if(this.chartData >0) {
          this.$nextTick(() =>{
            this.initChart()
          })
        }
        
      }).catch(err => {
        this.loading = false
      })
    },
    initChart() {
      let areaChart = this.$echarts.init(document.getElementById('officeMatch'))
      areaChart.setOption({
        tooltip: {
          formatter: '{a}: {b}'
        },
        // zoom: 10,
        series: [{
          type: 'gauge',
          data: [{value: this.chartData}],
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

