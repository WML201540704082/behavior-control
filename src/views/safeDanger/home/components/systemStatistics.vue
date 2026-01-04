<!--
 * @Author: your name
 * @Date: 2021-09-15 15:11:08
 * @LastEditTime: 2021-09-15 15:30:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ippool\src\views\dashboard\editor\components\systemStatistics.vue
-->
<template>
<div v-loading="loading">
  <div v-if="chartData.xaxisData.length >0" id="systemChart" style="width:100%;height: 35vh; right:-10px"></div>
  <div v-else style="height: 35vh;text-align:center;line-height:35vh;color:#606266;font-size:15px">暂无数据</div>
</div>
  
</template>

<script>
import { getTimeCount, } from '@/api/safeDanger/control/statistics'

export default {
  props: {
  },
  data() {
    return {
      chartData: {
        xaxisData: [],
        lineData: [],
      },
      loading: false,
    }
  },
  watch: {
  },
  async mounted() {
    await this.getDetail()
    this.initChart()
  },
  methods: {
    async getDetail() {
      this.loading = true
      await getTimeCount().then(res => {
        this.loading = false
        if(res.data.length > 1) {
          let arr = res.data.slice(0, res.data.length-1)
          for(let i=0; i<arr.length; i++) {
            let item = arr[i]
            if(item.time<10) item.time = "0" + item.time + ':00'
            else item.time = item.time + ':00'
            this.chartData.xaxisData.push(item.time)
            this.chartData.lineData.push(item.num)
          }
        }else {
          this.chartData = {
            xaxisData: [],
            lineData: []
          }
        }
      }).catch(err => {
        this.loading = false
      })
    },
    initChart() {
      if(this.chartData.xaxisData.length <1) {
        return false
      }
      let systemChart = this.$echarts.init(document.getElementById('systemChart'))
      systemChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            interval: 0,
            rotate: 30
          },
          data: this.chartData.xaxisData
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            rotate: 40,
            formatter: function(value, index) {
              let item = "";
              if (value === 1) {
                value = 100;
              } else if (value === 0.2) {
                value = 20;
              } else if (value === 0.4) {
                value = 40;
              } else if (value === 0.6) {
                value = 60;
              } else if (value === 0.8) {
                value = 80;
              }
              return value;
            }
          },
          axisPointer: {
            snap: true
          },
        },
        visualMap: {
          show: false,
          dismension: 0,
          pieces: [
            // {lte: 4, color: 'green'}
          ],
        },
        
        series: [
          {
            type: 'line',
            smooth: true,
            data: this.chartData.lineData,
            markArea: {
              itemStyle: {
                color: 'rgba(255,173,177,0.4)'
              },
              data: [
                [
                  {
                    name: '早高峰',
                    xAxis: '08:00'
                  },
                  {
                    xAxis: '10:00'
                  }
                ]
              ]
            },
          }
        ]
      })
    }
  }
}
</script>

