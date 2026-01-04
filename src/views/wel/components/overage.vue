<template>
  <div class="oldNew">
    <div id="danger-chart2"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { oldAge } from "@/api/wel/index.js"
export default {
  props: ['isShow', 'orderDeatil', 'processKeys','orderType'],
  data() {
    return {
      series: [
        {
          // color: "#73deb3",
          name: "UPS",
          type: "bar",
          barGap: '100%',
          // stack: "total",
          barWidth: 10,
          emphasis: {
            focus: "series"
          },
          data: [320, 302, 50, 334, 390]
        },
        {
          // color: "#73a0fa",
          name: "空调",
          type: "bar",
          // stack: "total",
          barWidth: 10,
          barGap: '100%',
          emphasis: {
            focus: "series"
          },
          data: [120, 132, 101, 134, 90]
        },
        {
          // color: "#f6a944",
          name: "蓄电池",
          type: "bar",
          // stack: "total",
          barWidth: 10,
          barGap: '100%',
          emphasis: {
            focus: "series"
          },
          data: [220, 182, 191, 234, 290]
        },
      ],

    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    // setTimeout(() => {
    //   this.initChart()
    // }, 200)

    oldAge().then(res=>{
      let arrs = []
      res.data.forEach(el=>{
        arrs.push({
          name: el.deviceType,
          type: "bar",
          barGap: '100%',
          barWidth: 10,
          emphasis: {
            focus: "series"
          },
          data: el.valueList
        })
      })
      this.series = arrs
      this.initChart()
    })
  },
  methods: {
    initChart() {
        this.chart = this.$echarts.init(document.getElementById("danger-chart2"));
        this.chart.setOption({
          legend: {
            // data: ["宽松策略", "冗余策略", "冲突策略", "高危端口策略"],
            // orient: "vertical",
            // right: 10
            // right: '5%'
          },
          xAxis: {
            type: "category",
            // data: this.chartData.map(item => item.name),
            data: ["5年以内", "6-8年", "8年以上", "10年以上"],
            axisLabel: {
              width: 30,
              fontSize: 10,
              interval: 0,
              formatter: name => {
                let arr = name.split("");
                arr.splice(5, 0, "\n");
                return arr.join("");
              },
              color: "#8c8c8c"
            },
            axisLine: {
              lineStyle: { color: "#e1e1e1" }
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
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
              lineStyle: {
                color: "#e1e1e1"
              }
            }
          },
          grid: {
            left: "5%",
            right: "5%",
            bottom: "3%",
            top: "20%",
            containLabel: true
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          series: this.series,
          // series: [
          //   {
          //     // color: "#73deb3",
          //     name: "UPS",
          //     type: "bar",
          //     barGap: '100%',
          //     // stack: "total",
          //     barWidth: 10,
          //     emphasis: {
          //       focus: "series"
          //     },
          //     data: [320, 302, 50, 334, 390]
          //   },
          //   {
          //     // color: "#73a0fa",
          //     name: "空调",
          //     type: "bar",
          //     // stack: "total",
          //     barWidth: 10,
          //     barGap: '100%',
          //     emphasis: {
          //       focus: "series"
          //     },
          //     data: [120, 132, 101, 134, 90]
          //   },
          //   {
          //     // color: "#f6a944",
          //     name: "蓄电池",
          //     type: "bar",
          //     // stack: "total",
          //     barWidth: 10,
          //     barGap: '100%',
          //     emphasis: {
          //       focus: "series"
          //     },
          //     data: [220, 182, 191, 234, 290]
          //   },
          // ],
          // color: ["#73deb3", "#73a0fa", "#f6a944", "#e65a6b", "#fcdfb8"]       
          color: [
            {
              type: 'linear',x: 0,y: 0,x2: 0,y2: 1,
              colorStops: [
                {
                  offset: 0, color: '#21ccc4'
                },
                {
                  offset: 1, color: '#6ed7dc'
                }
              ],
              global: false
            },
            {
              type: 'linear',x: 0,y: 0,x2: 0,y2: 1,
              colorStops: [
                {
                  offset: 0, color: '#5ac0fb'
                },
                {
                  offset: 1, color: '#92d1fc'
                }
              ],
              global: false
            },
            {
              type: 'linear',x: 0,y: 0,x2: 0,y2: 1,
              colorStops: [
                {
                  offset: 0, color: 'rgb(211, 152, 132)'
                },
                {
                  offset: 1, color: 'rgb(212, 181, 178)'
                }
              ],
              global: false
            },
            {
              type: 'linear',x: 0,y: 0,x2: 0,y2: 1,
              colorStops: [
                {
                  offset: 0, color: 'rgb(80, 152, 255)'
                },
                {
                  offset: 1, color: 'rgb(133, 182, 253)'
                }
              ],
              global: false
            },
            {
              type: 'linear',x: 0,y: 0,x2: 0,y2: 1,
              colorStops: [
                {
                  offset: 0, color: 'rgb(208, 182, 104)'
                },
                {
                  offset: 1, color: 'rgb(211, 201, 163)'
                }
              ],
              global: false
            },
            {
              type: 'linear',x: 0,y: 0,x2: 0,y2: 1,
              colorStops: [
                {
                  offset: 0, color: 'rgb(119, 224, 127)'
                },
                {
                  offset: 1, color: 'rgb(151, 229, 192)'
                }
              ],
              global: false
            },
            {
              type: 'linear',x: 0,y: 0,x2: 0,y2: 1,
              colorStops: [
                {
                  offset: 0, color: 'rgb(147, 161, 255)'
                },
                {
                  offset: 1, color: 'rgb(172, 186, 253)'
                }
              ],
              global: false
            },
          ]
        });
      }
  }
}
</script>
<style lang="scss" scoped>
  .oldNew{
    width: 100%;
    height: 190px;

    #danger-chart2 {
      width: 100%;
      height: 100%;
    }
  }
</style>
