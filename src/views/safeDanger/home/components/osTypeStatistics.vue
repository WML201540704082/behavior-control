<template>
  <div id="osTypeChart" style="height: 35vh;padding-top: 10px"></div>
</template>

<script>
  export default {
    props: {
      chartData: {
        type: Array,
      }
    },
    data() {
      return {

      }
    },
    watch: {
      chartData() {
        this.initChart()
      }
    },
    mounted() {

    },
    methods: {
      initChart() {
        let osTypeChart = this.$echarts.init(document.getElementById('osTypeChart'))
        osTypeChart.setOption({
          tooltip: {
            trigger: 'item',
          },
          // color:['#61A0A0','#ee6666','#fac858','#5470c6'
          //   ,'#91cc75','#fc8452','#3ba272','#9a60b4'
          //   ,'#ea7ccc','#73c0de'],
          color: ['#CB4943', '#2293FF', '#F0D153', '#D444D7', '#2395FF' ,'#429E48', '#5348A9', '#F08A42', '#68AB8'],
          legend: {
            //orient: 'vertical',
            //left: 'left',
          },
          series: [{
            type: 'pie',
            data: this.chartData,
            radius: '75%',
            center: ['50%', '50%'],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0,0,0,0.5)'
              }
            },
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
          }]
        })
      }
    }
  }
</script>

