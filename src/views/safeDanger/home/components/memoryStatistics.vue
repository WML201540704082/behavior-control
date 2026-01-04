<template>
  <div id="memoryChart" style="height: 35vh"></div>
</template>

<script>
import echarts from 'echarts'
import { getManufactureCount } from '@/api/safeDanger/control/statistics'
export default {
  props: {
    chartData: {
      type: Object,
    }
  },
  data() {
    return {
      chart: null,
      data:{},
    }
  },
  watch: {
    chartData() {
      this.initChart()
    }
  },
  async created(){

  },
  async mounted() {
    await this.initData()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    async initData() {
      await this.queryData()
      await this.$nextTick(function() {
        setTimeout(() => {
          this.initChart();
          window.onresize = () => {
            this.chart.resize()
          }
        })
      })
    },
    async queryData(){
      this.loading = true
      await getManufactureCount().then(response => {
        let data = response.data;
        let legendData = [];
        for (let i = 0; i < data.length; i++) {
          legendData.push(data[i].name);
        }
        this.data.seriesData = response.data;
        this.data.legendData = legendData;
      })
    },
    initChart() {
      this.chart = this.$echarts.init(document.getElementById('memoryChart'))
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}({d}%)',
        },
        legend: {
          type: 'scroll',
          //orient: 'vertical',
          right: 10,
          top: 'bottom',
          //bottom: 20,
          data: this.data.legendData
        },
        // color:['#61A0A0','#ee6666','#fac858','#5470c6'
        //     ,'#91cc75','#fc8452','#3ba272','#9a60b4'
        //     ,'#ea7ccc','#73c0de'],
        color: ['#CB4943', '#2293FF', '#F0D153', '#D444D7', '#2395FF' ,'#429E48', '#5348A9', '#F08A42', '#68AB8'],
        series: [{
          type: 'pie',
          data: this.data.seriesData,
          radius: '70%',
          center: ['50%', '45%'],
          label: {
            show: true,
            position: 'inner',
            formatter: (val) => {
              if(val.percent >= 5) {
                return val.percent.toFixed(1) + '%'
              }else {
                return ''
              }
              
            }
          },
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

