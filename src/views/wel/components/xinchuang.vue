<template>
  <div class="xinc">
    <div class="xinc_l">
      <div id="domId1" class="circle" style="width: 160px; height: 160px"></div>
      <div class="xinc_lc">
        分发进度
      </div>
    </div>
    <div class="xinc_r">
      <div class="xinc_item">
        <img src="../../../assets/wel/xin1.png" alt="">
        <div class="xinc_itemr">
          <div class="xinc_itemr_t">信创总数</div>
          <div class="xinc_itemr_b">
            <span>{{ deviceObj.patentCount }}</span>台
          </div>
        </div>
      </div>
      <div class="xinc_item">
        <img src="../../../assets/wel/xin2.png" alt="">
        <div class="xinc_itemr">
          <div class="xinc_itemr_t">已分发数</div>
          <div class="xinc_itemr_b">
            <span>{{ deviceObj.distributeCount }}</span>台
          </div>
        </div>
      </div>
    </div>

    <div class="mainm_ttrr">
      新创替代率：<span>{{ deviceObj.patentProbability }}%</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { distributeCount } from "@/api/wel/index.js"

export default {
  props: ['isShow', 'orderDeatil', 'processKeys','orderType'],
  data() {
    return {
      deviceObj: {}
    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    distributeCount().then(res=>{
      // console.log('信创设备', res)
      this.deviceObj = res.data
      this.initCircle()
    })
    

    // console.log(123, echarts)
  },
  methods: {
    initCircle() {
      const count = this.deviceObj.distributionProgress;
      const { start, end } = {
        start: 'rgb(24,148,254)',
        end: 'rgb(30,228,232)'
      }

      const myChart = echarts.init(document.getElementById("domId1"));
      // 绘制图表
      const option = {
        // backgroundColor: 'black',
        title: {
          top: '42%',
          left: 'center',
          text: count + '%',
          textStyle: {
            color: 'rgb(255, 255, 255)',
            fontWeight: 'normal',
            fontSize: 24
          }
        },
        series: [
          {
            type: 'liquidFill',
            radius: '80%',
            data: [count / 100, (count - 10) / 100],
            backgroundStyle: {
              color: '#a1c0fe',
              // color: {
              //   type: 'radial',
              //   x: 0.5,
              //   y: 0.5,
              //   r: 0.5,
              //   colorStops: [
              //     // {
              //     //   offset: 0,
              //     //   color: 'rgba(0,24,55, 0)'
              //     // },
              //     // {
              //     //   offset: 0.75,
              //     //   color: 'rgba(0,24,55, 0)'
              //     // },
              //     // {
              //     //   offset: 1,
              //     //   color: 'rgba(37,237,259, 1)'
              //     // }
              //   ],
              //   globalCoord: false
              // },
              borderColor: '#7fb3ff',
              borderWidth: 5,
              outline: {
                show: true
              }
            },
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 0,
                borderColor: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(50,115,256, 1)'
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(50,115,233, .75)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(50,115,233, 1)'
                    }
                  ],
                  globalCoord: false
                }
              }
            },
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: start
                },
                {
                  offset: 1,
                  color: end
                }
              ],
              globalCoord: false
            },
            label: {
              normal: {
                formatter: ''
              }
            }
          },
        ]
      };
      myChart.setOption(option);
    }
  }
}
</script>
<style lang="scss" scoped>
  .mainm_ttrr{
    position: absolute;
    right: 0;
    top: -41px;
    color: #192C7D;
    font-size: 12px;

    span{
      color: #21c190;
      font-size: 14px;
    }
  }
  
  .xinc{
    display: flex;
    align-items: center;
    padding-top: 5px;
    position: relative;
   .xinc_l{
     margin-right: 23px;
     margin-left: 12px;
     .xinc_lc{
       font-size: 18px;
       color: #156AF6;
       text-align: center;
       margin-top: -5px;
       font-weight: 400;
     }
   }
   .xinc_r{
     .xinc_item{
       display: flex;
       align-items: center;
       margin-bottom: 10px;
     }
     .xinc_itemr{
       margin-left: 10px;
     }
     .xinc_itemr_t{
       font-size: 14px;
       color: #333;
     }
     .xinc_itemr_b{
       color: #0FC0E2;
       font-size: 14px;
       span{
         font-weight: bold;
         font-size: 30px;
       }
     }
   }
  }
</style>
<style lang="scss" scoped>
  ::v-deep .pagination111{
    margin-top: -10px;
  }
</style>