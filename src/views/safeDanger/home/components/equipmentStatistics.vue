
<template>
  <div v-loading="loading" style="height: 35vh;">
    <div v-if="chartData.length>0" id="equipmentChart" style="height: 35vh;padding-top:10px"></div>
    <div v-else style="height: 35vh;text-align:center;line-height:35vh;color:#606266;font-size:15px">暂无数据</div>
  </div>

</template>

<script>
import { getInterfaceCount,getInterfaceTotal, } from '@/api/safeDanger/control/statistics'
import { constants } from 'fs';

export default {
  props: {
    // chartData: {
    //   type: Array,
    // }
  },
  data() {
    return {
      chartData: [],
      total: 0,
      loading: false
    }
  },
  watch: {
    // chartData() {
    //   this.initChart()
    // }
  },
  async mounted() {
    await this.getDetail()
    // this.initChart()
  },
  methods: {
    getDetail() {
      this.loading = true
      getInterfaceCount().then(res => {
        this.loading = false
        this.chartData = []
        if(res.data.length > 0) {
          this.chartData[0] = {
            name: '在线',
            value: res.data[0].online
          }
          this.chartData[1] = {
            name: '离线',
            value: res.data[0].offline
          }
          this.total = res.data[0].num
          this.$nextTick(() =>{
            this.initChart()
          })
        }

      }).catch(err => {
        this.loading = false
      })
    },
    initChart() {
      let equipmentChart = this.$echarts.init(document.getElementById('equipmentChart'))
      equipmentChart.setOption({
        tooltip: {
            trigger: 'item',
          },
          legend: {
            // top:'center',
            // orient: 'vertical',
            // right: 50,
            formatter: (val) => {
              let text
              for(let i=0; i<this.chartData.length; i++){
                let item = this.chartData[i]
                if(val == item.name) text = val + item .value
              }
              return text
            }
          },
          color: ["#2293FF",'#F18940',],
          series: [{
            type: 'pie',
            data: this.chartData,
            radius: ['55%','75%'],
            center: ['50%', '55%'],
            label: {
              // show: false,
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
      equipmentChart.on('click', param => {
        this.$router.push({path: '/control/monitor/online',query:{basicDeviceClass: '06'}})
      })
    }
  }
}
</script>

