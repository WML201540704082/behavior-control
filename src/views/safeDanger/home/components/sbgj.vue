<template>
  <div class="wrap">
    <div class="title">
      <!-- 全网设备告警分析 -->
    </div>
    
    <div id="sbgj"></div>
  </div>
</template>

<script>
  import { orgCount } from '@/api/safeDanger/home'
  import { securitySupervision } from "@/api/safeDanger/networkSecure"
  import { allCategory } from "@/api/safeDanger/computerroom"
  
  export default {
    props: ['hiddenCategory'],
    name: "Index",
    data(){
      return{
        chartData: [
          // {
          //   name: "青岛市"
          // },
          // {
          //   name: "济南市"
          // },
          // {
          //   name: "烟台市"
          // },
          // {
          //   name: "济宁市"
          // },
          // {
          //   name: "潍坊市"
          // }
        ],
        series: [
            // {
            //   name: "网络安全",
            //   type: "bar",
            //   stack: "total",
            //   barWidth: 40,
            //   emphasis: {
            //     focus: "series"
            //   },
            //   data: [320, 302, 50, 334, 390]
            // }
        ],
        chart: undefined
      }
    },
    created() {
      this.initData()
    },
    mounted() {
      setTimeout(()=>{
        this.initChart();
        // this.getList()
      }, 800)
      
      // this.getDetail()
    },
    computed:{
      
    },
    methods:{
      async initData(){
        this.series = []
        let datas;


        if(!this.hiddenCategory && this.hiddenCategory !== 0){
          datas = await this.getDicts('hidden_category');
          datas = datas.data
        }else if(this.hiddenCategory === 1){
          datas = await securitySupervision();
          datas = datas.data
          datas.forEach(el=> el.dictLabel = el.supervision )
        }else if(this.hiddenCategory === 0){
          datas = await allCategory();
          datas = datas.data
          datas.forEach(el=> el.dictLabel = el.category )
        }


        
        datas.forEach(el=>{
          let objj = {
            name: el.dictLabel,
            type: "bar",
            stack: "total",
            barWidth: 40,
            // emphasis: {
            //   focus: "series"
            // },
            data: []
          }
          this.series.push(objj)
        })
        this.getDetail()
      },

      arrReturnVal(val, arr){
        let arrr =  arr.filter(ele => ele.deptName == val)
        return arrr.length>0 ? arrr[0].count : 0
      },
      getDetail() {
        orgCount({ hiddenCategory: this.hiddenCategory }).then(res => {
          let data = res.data

          let xArr = []
          // this.series = []
          data.forEach((el,index)=>{
            xArr.push({name: el.shortName})
            this.series.forEach(ele=>{
              ele.data.push(0)
            })
            if(el.hiddenCategory){
              el.hiddenCategory.forEach(el2=>{
                let findIndex = this.series.findIndex(ell => ell.name.includes(el2.categoryTypeName))
                this.series[findIndex].data[index] = el2.categoryTypeCount
              })
            }
            
          })
          this.chartData = xArr


          this.initChart();

        }).catch(err =>{
        })
      },
      initChart() {
        this.chart = this.$echarts.init(document.getElementById("sbgj"));
        this.chart.setOption({
          legend: {
            // data: ["宽松策略", "冗余策略", "冲突策略", "高危端口策略"],
            // orient: "vertical",
            // right: 10
            right: '5%'
          },
          xAxis: {
            type: "category",
            // data: this.chartData.map(item => item.name),
            data: ["网络安全", "机房安全", "冲突策略", "高危端口策略"],
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
            bottom: "10%",
            top: "10%",
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
          series: [
            {
              // color: "#73deb3",
              name: "网络安全",
              type: "bar",
              stack: "total",
              barWidth: 40,
              emphasis: {
                focus: "series"
              },
              data: [320, 302, 50, 334, 390]
            },
            {
              // color: "#73a0fa",
              name: "机房安全",
              type: "bar",
              stack: "total",
              barWidth: 40,
              emphasis: {
                focus: "series"
              },
              data: [120, 132, 101, 134, 90]
            },
            // {
            //   // color: "#f6a944",
            //   name: "终端认证端口变更警告",
            //   type: "bar",
            //   stack: "total",
            //   barWidth: 40,
            //   emphasis: {
            //     focus: "series"
            //   },
            //   data: [220, 182, 191, 234, 290]
            // },
            // {
            //   // color: "#e65a6b",
            //   name: "新发现设备告警",
            //   type: "bar",
            //   stack: "total",
            //   barWidth: 40,
            //   emphasis: {
            //     focus: "series"
            //   },
            //   data: [150, 212, 201, 154, 190]
            // },
            // {
            //   // color: "#fcdfb8",
            //   name: "台账配置信息缺失告警",
            //   type: "bar",
            //   stack: "total",
            //   barWidth: 40,
            //   emphasis: {
            //     focus: "series"
            //   },
            //   data: [150, 212, 201, 154, 190]
            // }
          ],
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

<style lang='scss' scoped>
  .wrap{
    width:100%;
    height:100%;
    border: 1px solid #ddd;
    padding: 20px;
  }
  #sbgj {
    width: 100%;
    height: 100%;
  }
  .title{
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .filter{
    display: flex;
    justify-content: space-between;
  }
</style>
