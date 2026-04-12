<template>
  <div class="model">
    <div id="radarEcharts"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as echarts from "echarts";
export default {
  props: ['isShow', 'orderDeatil', 'processKeys','orderType'],
  data() {
    return {
      getEchartXData:['A机房级别','B机房功能','S设备状态','T超龄时间','C维保情况','D设备归属部门','E服务风险','F运行自评','H n-1满足情况'],
      getEchartData:[8,4,5,4,7,4,8,6,8],
      tooltipContentL:[8,4,5,4,7,4,8,6,8],
    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    setTimeout(() => {
      this.echartRadarInit()
    }, 200)
  },
  methods: {
    init0(){
      this.getEchartData = [8,4,5,4,7,4,8,6,8]
      this.tooltipContentL = [8,4,5,4,7,4,8,6,8]
      this.echartRadarInit()
    },
    init1(){
      this.getEchartData = [9,1,3,7,7,10,8,5,6]
      this.tooltipContentL = [9,1,3,7,7,10,8,5,6]
      this.echartRadarInit()
    },
    init2(){
      this.getEchartData = [6,3,5,4,9,2,1,8,8]
      this.tooltipContentL = [6,3,5,4,9,2,1,8,8]
      this.echartRadarInit()
    },
    init3(){
      this.getEchartData = [6,6,5,9,7,2,6,6,8]
      this.tooltipContentL = [6,6,5,9,7,2,6,6,8]
      this.echartRadarInit()
    },


    // 雷达图
    echartRadarInit() {
      var myChart = echarts.init(document.getElementById("radarEcharts"));
      // 指定图表的配置项和数据
      var option = {
        // grid:{
        //   left:'10%',
        //   top:'10%',
        //   right:'10%',
        //   bottom:'10%',
        //   containLabel:true,
        // },
        legend: {
          show: false,
        },
        tooltip:{
          trigger:'item',
          position:'top',
          formatter:(item) =>{
            // console.log( item,'------------------');
            let tooltipContent = '';
            this.getEchartXData.forEach((item,index)=>{
              let value = this.tooltipContentL[index];
              tooltipContent += `${item}:${value} <br>`;
            })

            return tooltipContent;
            
          },
        },
        radar: {
          shape: "polygon",
          radius: "75%",
          center:['50%','50%'],
          splitNumber:5,
          clockwise: true,
          indicator: this.getEchartXData.map((item) => {
            return {
              name: item,
              max: 10,
            };
          }),
          nameGap: 10,
          name: {
            textStyle: {
              color: "#333",
              fontSize: 10,
              fontWeight: 'bold'
            },
          },
          splitLine: {
           lineStyle:{
              color:'#606266',
              width:0.5,
            },
          },
          axisLine: {
           show:false,
          },
          splitArea: {
            show: false,
          },
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: this.getEchartData,
                name:'设备配置表'
              },
            ],
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#1673FF", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#1673FF", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
            lineStyle: {
              width: 2,
              color: "#1f74f3",
            },
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  }
}
</script>
<style lang="scss" scoped>
  .model{
    width: 100%;
    margin-top: 30px;
    height: calc(100% - 60px);

    #radarEcharts {
      width: 100%;
      height: 100%;
    }
  }
  
</style>
