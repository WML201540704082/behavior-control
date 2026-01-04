<template>
  <div id="dbChart" style="height: 35vh"></div>

</template>

<script>
  export default {
    name:'DbChart',
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
        if(this.chartData.length == 0) {
          this.chartData.push({
            name: "暂无服务器数据统计数据",
            value: 0
          })
        }
        this.initChart()
      }
    },
    mounted() {

    },
    methods: {
      initChart() {
        let dbChart = this.$echarts.init(document.getElementById('dbChart'))
        dbChart.setOption({
          tooltip: {
            trigger: 'item',
          },
          legend: {
            top:'center',
            orient: 'vertical',
            left: 'right',
          },
          // color:['#61A0A0','#ee6666','#fac858','#5470c6'
          //   ,'#91cc75','#fc8452','#3ba272','#9a60b4'
          //   ,'#ea7ccc','#73c0de'],
          color: ['#CB4943', '#2293FF', '#F0D153', '#D444D7', '#2395FF' ,'#429E48', '#5348A9', '#F08A42', '#68AB8'],
          series: [{
            type: 'pie',
            data: this.chartData,
            radius: ['55%','75%'],
            center: ['35%', '50%'],
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0,0,0,0.5)'
              }
            },
            labelLine: {
              show: false
            }
          }]
        })
      }
    }
  }
</script>

