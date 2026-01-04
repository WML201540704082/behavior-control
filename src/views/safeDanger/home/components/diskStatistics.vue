<template>
  <div id="diskChart" style="height: 35vh;padding-top: 10px"></div>
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
      total: 0,
    }
  },
  watch: {
    chartData() {
      // this.total = this.chartData[0].value + this.chartData[1].value
      if(this.chartData.length == 1) {
        if(this.chartData[0].name == '在线') {
          this.chartData.unshift({
            name: '离线',
            value: 0
          })
        }else if(this.chartData[0].name == '离线') {
          this.chartData.push({
            name: '在线',
            value: 0
          })
        }
      }
      this.initChart()
    }
  },
  mounted() {

  },
  methods: {
    initChart() {
      let diskChart = this.$echarts.init(document.getElementById('diskChart'))
      diskChart.setOption({
        tooltip: {
            trigger: 'item',
          },
          legend: {
            // top:'center',
            // orient: 'vertical',
            // right: 20,
            formatter: (val) => {
              let text
              for(let i=0; i<this.chartData.length; i++){
                let item = this.chartData[i]
                if(val == item.name) text = val + item.value
              }
              return text
            }
          },
          color: ["#2293FF" , '#f18940',],
          series: [{
            type: 'pie',
            data: [this.chartData[1], this.chartData[0]],
            radius: ['55%','75%'],
            center: ['50%', '55%'],
            label: {
              show: true,
              // position: 'center',
              formatter: (val) => {
                return val.name + '(' + val.percent.toFixed(1) + '%)'
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0,0,0,0.5)'
              }
            },
            labelLine: {
              show: true

            }
          }]
      })
      diskChart.on('click', param => {
        this.$router.push({path: '/control/monitor/online'})
      })
    }
  }
}
</script>

