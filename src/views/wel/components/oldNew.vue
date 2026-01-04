<template>
  <div class="oldNew">
    <div id="status-chart22"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { oldTrend } from "@/api/wel/index.js"
export default {
  props: ['isShow', 'orderDeatil', 'processKeys','orderType'],
  data() {
    return {
      chartData: [
        { value: 50, name: "冗余策略" },
        { value: 40, name: "宽松策略" },
        { value: 60, name: "高危端口策略" },
        { value: 30, name: "冲突策略" },
        { value: 20, name: "隐藏策略" }
      ],

      xData: [
        "2024.12",
        "2025.12",
        "2026.12",
        "2027.12",
        "2028.12"
      ],
      seriesData: [
        {
          color: "#34C1F0",
          name: "主机",
          type: "line",
          // stack: "总量",
          data: [5, 10, 15, 25, 15]
        },
        {
          color: "#FFBE32",
          name: "网络",
          type: "line",
          // stack: "总量",
          data: [70, 75, 60, 80, 60]
        },
        {
          color: "#FF2222",
          name: "终端",
          type: "line",
          // stack: "总量",
          data: [90, 85, 95, 97, 94]
        },
        {
          color: "#06B6A9",
          name: "存储",
          type: "line",
          // stack: "总量",
          data: [58, 80, 55, 70, 53]
        },
        {
          color: "#8E0E83",
          name: "安全",
          type: "line",
          // stack: "总量",
          data: [70, 50, 70, 55, 60]
        },
        {
          color: "#0596C6",
          name: "辅助",
          type: "line",
          // stack: "总量",
          data: [30, 30, 18, 40, 35]
        },
        {
          color: "#333333",
          name: "基础设施",
          type: "line",
          // stack: "总量",
          data: [10, 19, 12, 18, 11]
        }
      ]


    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    // setTimeout(() => {
    //   this.initChart();
    // }, 200);
    
    oldTrend().then(res=>{

      this.xData = res.data.year
      let dataMap = res.data.dataMap
      
      let arr = []
      for (const key in dataMap) {
        arr.push({
          name: key,
          type: "line",
          data: dataMap[key]
        })
      
      }
      // console.log(322, this.xData, arr)
      this.seriesData = arr

      this.initChart();
    })
  },
  methods: {
    initChart() {
      let chart = this.$echarts.init(document.getElementById("status-chart22"));
      chart.setOption({
        tooltip: {
          trigger: "axis",
          // formatter: params => {
          //   let cpu = params[0];
          //   let ram = params[1];
          //   return `
          //   <span>${cpu.name}</span><br>
          //   <span style="display:inline-block;width:10px;height:10px;background:${
          //     cpu.color
          //   };border-radius:50%"></span>
          //   <span>cpu: ${cpu.value}%</span><br>
          //   <span style="display:inline-block;width:10px;height:10px;background:${
          //     ram.color
          //   };border-radius:50%"></span>
          //   <span>内存: ${ram.value}%</span>
          //   `;
          // }
        },
        legend: {
          orient: 'vertical',
          icon: 'circle',
          // data: [
          //   { name: '终端', icon: 'circle' },
          //   { name: '网络', icon: 'circle' },
          //   { name: '主机', icon: 'circle' },
          //   { name: '存储', icon: 'circle' },
          //   { name: '安全', icon: 'circle' },
          //   { name: '辅助', icon: 'circle' },
          //   { name: '基础设施', icon: 'circle' },
          // ],
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            fontSize: 11,
            lineHight: 20
          },
          show: true,
          right: 0,
          bottom: 3,
        },
        grid: {
          left: "3%",
          right: "22%",
          bottom: "3%",
          top: "18%",
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
            lineStyle: { color: "#ccc" }
          },
          axisTick: { show: false }
        },
        yAxis: {
          type: "value",
          name: "单位（台）",
          nameTextStyle: {
            color: '#666'
          },
          axisLabel: {
            color: "#8c8c8c"
          },
          axisLine: {
            show: false,
            lineStyle: { color: "red" }
          },
          axisTick: { show: false },
          splitLine: { show: true, color: "#ccc" }
        },
        series: this.seriesData,
        color: ["#34C1F0", "#FFBE32", "#FF2222", "#06B6A9", "#8E0E83", "#0596C6", "#333333", "#0CA072"]
      });
    }
  }
}
</script>
<style lang="scss" scoped>
  .oldNew{
    width: 100%;
    height: 190px;

    #status-chart22 {
      width: 100%;
      height: 100%;
    }
  }
</style>
