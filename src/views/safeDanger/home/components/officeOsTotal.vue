<template>
  <div v-loading="loading">
    <div v-if="chartData.length>0" id="officeOsChart" style="height: 35vh;"></div>
    <div v-else style="height: 35vh;text-align:center;line-height:35vh;color:#606266;font-size:15px">暂无数据</div>
  </div>
  
</template>

<script>
import { getClientCount } from '@/api/safeDanger/control/statistics'

  export default {
    // props: {
    //   chartData: {
    //     type: Array,
    //   }
    // },
    data() {
      return {
        chartData: [],
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
      this.initChart()
    },
    methods: {
      async getDetail() {
        this.loading = true
        await getClientCount().then(res => {
          this.chartData = []
          this.loading = false
          for(let i=0; i<res.data.length; i++) {
            let item = res.data[i]
            if(!item.new_os_name) {
              item.name = '未知'
            }else {
              let name = item.new_os_name;
              if (name.trim().indexOf('Microsoft') === 0) {
                name = name.replace('Microsoft','').trim();
              }
              item.name = name;//item.new_os_name.slice(9,)
            }
            item.value = item['count(1)']
            this.chartData.push(item)
          }
          this.chartData.sort(function(a,b){return b.value - a.value})
        }).catch(err => {
          this.loading = false
        })
      },
      initChart() {
        if(this.chartData.length < 1) {
          return
        }
        let osTypeChart = this.$echarts.init(document.getElementById('officeOsChart'))
        osTypeChart.setOption({
          tooltip: {
            trigger: 'item',
          },
          legend: {
            type:'scroll',
            top:'center',
            orient: 'vertical',
            left: 'right',
          },
          color: [ '#2293FF','#67e0e3', '#f18940', '#D444D7', '#10a999' ,'#429E48', '#5348A9', '#F08A42', '#68AB8'],
          // legend: {
          //   //orient: 'vertical',
          //   //left: 'left',
          // },
          series: [{
            type: 'pie',
            data: this.chartData,
            radius: '75%',
            center: ['35%', '50%'],
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

