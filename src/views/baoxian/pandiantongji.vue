<template>
  <!-- <basic-container>
    盘点统计，功能开发中
  </basic-container> -->
  <div class="warpp">
    
    <div class="warpp-l">
      <div class="desk_title">
        盘点异常类型分布
        <img src="../../assets/desk/jiantou.png" alt="">
      </div>
      <div class="warpp-c">
        <div id="oldDeviceCategorySum" class="d_w100"/>
      </div>
    </div>
    <div class="warpp-r">
      <div class="desk_title">
        盘点异常部门分布
        <img src="../../assets/desk/jiantou.png" alt="">
      </div>
      <div class="warpp-c">
        <div id="chart1" class="d_w100" />
      </div>
    </div>
  </div>
</template>

<script>
import { statistic, dept } from "@/api/baoxian/pandianrenwu";
export default {
  components: {
    
  },
  data() {
    return {
      chart: null,
      datas: [
        // { value: 37, name: '已确认告警' },
        // { value: 32, name: '未确认告警' },
      ]
    };
  },
  computed: {
    
  },
  async mounted() {
    // this.initOldDeviceStockedEcharts()
    // this.initChart()

    statistic().then(res=>{
      this.datas = [
        { value: res.data.py, name: '盘盈数量' },
        { value: res.data.pk, name: '盘亏数量' },
      ]
      this.initOldDeviceStockedEcharts()
    })

    dept().then(res=>{
      this.initChart(res.data)
    })

  },
  methods: {
    initChart(chartData) {
      // this.chart = echarts.init(this.$el, 'barChart')
      let chart1 = this.$echarts.init(document.getElementById('chart1'));
      chart1.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // grid: {
        //   top: 10,
        //   left: '2%',
        //   right: '8%',
        //   bottom: '5%',
        //   containLabel: true
        // },
        xAxis: {
          type: 'category',
          data: chartData.map(ele=> ele.dept),
          // data:['类1','类2','类3','类4','类5'],
        },
        yAxis: [{
          type: 'value'
        }],
        series: [{
          type: 'bar',
          barWidth: '25px',
          // data: [50, 40, 45, 35, 45],
          data: chartData.map(ele=> ele.num),
          // itemStyle:{
          //   color:new echarts.graphic.LinearGradient(0,0,1,0,[
          //       {offset:0,color:'#f0f2ff',},
          //       {offset:0.5,color:'#CBD8FF'},
          //       {offset:1,color:'#8abbff'},
          //   ])
          // },
        }]
      })
    },



    initOldDeviceStockedEcharts() {
      // 初始化 老旧设备分类统计
      let oldDeviceCategorySum = this.$echarts.init(document.getElementById('oldDeviceCategorySum'));
      const options = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          show: true,
          right: 20,
          bottom: 30,
        },
        series: [
          {
            // color: ['#2465E0', '#84B7F9', '#5F9CF8', '#CEE5FC', '#AAD0FB', '#E5F3FF', '#2478F2', '#84B7F9', '#99C7F9'],
            // color: ['#24baa4', '#34cced', '#54a6ff', '#d678da'], #e9550c
            // color: ['#15dbbe', '#FAB51D', '#2982e3', '#d13dd7'], #ff2222e6
            color: ['#6cc98c', '#d59984', '#2982e3', '#f32222'],
            
            type: 'pie',
            // top: '16%',
            // left: '-20%',
            radius: ['0%', '65%'],
            avoidLabelOverlap: true,
            labelLine: {
              show: true
            },
            data: this.datas
          }
        ]
      };
      oldDeviceCategorySum.setOption(options);
    },


  }
}
</script>
<style lang="scss" scoped>
  .desk_title {
    color: #192C7D;
    font-weight: 600;
    line-height: 30px;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    // background: url('../../assets/desk/jiantou.png') no-repeat 100px center;
    img {
      width: 18px;
      height: 18px;
      margin-left: 10px;
    }
  }
  .d_w100 {
    width: 100%;
    height: 100%;
  }


  .warpp{
    width: 100%;
    height: calc(100vh - 130px);
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }
  .warpp-l{
    width: 50%;
    margin-top: 100px;
    margin-right: 40px;

  }
  .warpp-r{
    width: 50%;
    margin-top: 100px;
    
  }
  .warpp-c{
    width: 100%;
    height: 500px;
    background: #fff;
  }
</style>

