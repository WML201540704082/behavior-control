<template>
  <div id="brandChart" style="height: 35vh"></div>
</template>

<script>
import { getBrandCount } from '@/api/safeDanger/control/statistics'

export default {
  // props: {
  //   chartData: {
  //     type: Object,
  //   }
  // },
  data() {
    return {
      chartData: {
        legendData: [],
        seriesData: [],
      }
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
      await getBrandCount().then(res => {
        this.chartData = {
          legendData: [],
          seriesData: [],
        }
        for(let i=0; i<res.data.length; i++) {
          let item = res.data[i]
          let obj = {}
          obj.value = item.num
          obj.name = item.brand
          this.chartData.legendData.push(item.brand)
          this.chartData.seriesData.push(obj)
        }
        
      })
    },
    initChart() {
      
      let brandChart = this.$echarts.init(document.getElementById('brandChart'))
      brandChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: this.chartData.legendData
        },
        // color: [
        //   '#5470c6', '#91cc75', '#fac858', '#e66', '#73c0de', '#3ba272', '#fc8452', "#9a60b4"
        // ],
        color: ['#CB4943', '#2293FF', '#67e0e3', '#D444D7', '#2395FF' ,'#429E48', '#5348A9', '#F08A42', '#68AB8'],
        series: [{
          type: 'pie',
          data: this.chartData.seriesData,
          radius: '70%',
          center: ['40%', '50%'],
          // label: {
          //   show: false,
          //   position: 'center',
          // },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0,0,0,0.5)'
            }
          }
        }]
      })
    }
  }
}
</script>

