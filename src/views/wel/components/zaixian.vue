<template>
  <div class="zaixian">
    <div id="status-chart"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { online } from "@/api/wel/index.js"

export default {
  props: ['dates'],
  data() {
    return {
      xData: [
        "第一周",
        "第二周",
        "第三周",
        "第四周",
      ],
      yData: [130, 70, 153, 50]

    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData(){
      online({ date: this.dates }).then(res=>{

        this.xData = res.data.time
        this.yData = res.data.number
        this.initChart();
      })
    },
    initChart() {
      let chart = this.$echarts.init(document.getElementById("status-chart"));
      let that = this;
      chart.setOption({
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "5%",
          bottom: "5%",
          top: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xData,
          axisLabel: {
            color: "#8c8c8c",
            // formatter: value => {
            //   return value.split(" ")[1];
            // }
          },
          axisLine: {
            lineStyle: { color: "#e1e1e1" }
          },
          axisTick: { show: false }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#8c8c8c"
          },
          axisLine: {
            show: false,
            lineStyle: { color: "#e1e1e1" }
          },
          axisTick: { show: false },
          splitLine: { show: true, color: "#e1e1e1" }
        },
        tooltip: {
          trigger: "axis",
          // formatter: params => {
          //   let p = params[0];
          //   // return `${p.name} ${p.data}℃`;
          //   return `<span>
          //   ${p.name}<br >
          //   <span style="display:inline-block;width:10px;height:10px;background:${
          //     p.color
          //   };border-radius:50%"></span>
          //   ${p.data}℃</span>`;
          // }
        },
        series: [
          {
            color: "#fbaf62",
            name: "数量",
            type: "line",
            data: this.yData,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0,0,0,1,[
                {
                  offset: 0,
                  color: '#fbaf62'
                },
                {
                  offset: 1,
                  color: '#ffe'
                },
              ])
            }
          }
        ]
      });
    }
  }
}
</script>
<style lang="scss" scoped>
  .zaixian{
    width: 100%;
    margin-top: 30px;
    height: calc(100% - 60px);
  }
  #status-chart {
    width: 100%;
    height: 100%;
  }
  
</style>
