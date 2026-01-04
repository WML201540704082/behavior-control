// 分类在线率
<template>
  <div class='wrap'>
    <div class="div1"></div>
    <div class="div2"></div>
    <div id="box-c-t-map"></div>

    
  </div>
</template>

<script>
import { mapDisplay } from '@/api/safeDanger/home'



export default {
  props: ['hiddenCategory'],
  data() {
    return{
      tableData: []
    }
  },
  mounted () {
    this.initChart()
    this.getDetail()
  },
  methods: {
    getDetail() {
      mapDisplay({ hiddenCategory: this.hiddenCategory }).then(res => {
        let data = res.data
        this.tableData = data

      }).catch(err =>{
      })
    },
    initChart() {
      let mapData = require(`@/assets/mapsData/27117.json`);
      // console.log(888, mapData)

      let _this = this
      var myChart = this.$echarts.init(document.getElementById('box-c-t-map'))
      var name = 'shandong';
      // myChart.showLoading();
        let geoJson = require(`@/assets/mapsData/27117.json`);  
        // myChart.hideLoading();

          this.$echarts.registerMap(name, geoJson);

          myChart.setOption({
              title: {
                  text: '',
                  left: 'center', //标题位置
                  textStyle: {
                      fontSize: 28,
                      fontWeight: 'bolder',
                      color: 'black' // 主标题文字颜色
                  }
              },
              // color: ['orange'],
              legend: {
                  orient: 'vertical',
                  left: 'left',
                  textStyle: {
                      fontSize: 20,
                      color: 'black' // 图例文字颜色
                  },
                  //data: ['地市']
                  // 图例位置
              },
              
              tooltip: {
                  trigger: 'item',
                  padding: 0,
                  borderWidth: 0,
                  formatter: function (params) {
   
                    // if(typeof(params.value)[2] == "undefined"){
                    //   return params.name + ' : ' + params.value;
                    // }else{
                    //   return params.name + ' : ' + params.value[2];
                    // }

                    let str = ''
                    let nowDate = _this.formatDate(new Date(), 'yyyy-MM-dd')
                    let selectArr = _this.tableData.filter(el=> params.name.includes(el.orgNo))[0]

                    // if(selectArr){
                    //   str = `
                    //     ${nowDate}: <br>
                    //     已完成：${selectArr.doneRectified} <br>
                    //     未完成：${selectArr.noRectified} <br>
                    //     超期未完成：${selectArr.overdueRectified} 
                    //   `
                    // } else {
                    //   str = `
                    //     ${nowDate}: <br>
                    //     已完成：0 <br>
                    //     未完成：0 <br>
                    //     超期未完成：0
                    //   `
                    // }

                    if(selectArr){
                      str = `
                        <table border="1" cellspacing="0" style="border: 1px solid #33bfb1">
                          <tr>
                            <td colspan="3" style='width: 60px; height: 32px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1;color: #fff;     background: #33bfb1;'>隐患总量：${selectArr.count}</td>
                          </tr>
                          <tr>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1'></td>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1'>未超期</td>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1'>已超期</td>
                          </tr>
                          <tr>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1'>未整改</td>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1'>${selectArr.noRectified}</td>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1'>${selectArr.overdueRectified}</td>
                          </tr>
                          <tr>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0;'>已整改</td>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0;'>${selectArr.doneRectified}</td>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0;'>${selectArr.completedRectified}</td>
                          </tr>
                        </table>
                      `
                    } else {
                      str = `
                        <table border="1" cellspacing="0" style="border: 1px solid #33bfb1">
                          <tr>
                            <td colspan="3" style='width: 60px; height: 32px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1;color: #fff;     background: #33bfb1;'>隐患总量：0</td>
                          </tr>
                          <tr>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1'></td>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1'>未超期</td>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1'>已超期</td>
                          </tr>
                          <tr>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1'>未整改</td>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1'>0</td>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0; border-bottom: 1px solid #33bfb1'>0</td>
                          </tr>
                          <tr>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0;'>已整改</td>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0;'>0</td>
                            <td style='width: 60px; height: 30px;text-align: center; border: 0;'>0</td>
                          </tr>
                        </table>
                      `
                    }

                    






                    return str
                    // <br> 超期已完成：${selectArr.completedRectified}
                        
                    // if(params.data){
                    //   str = `
                    //     ${params.name}: <br>
                    //     数量：${params.data.value} <br>
                    //     数量2：${params.data.value}
                    //   `
                    // }

                  }
              },

              // visualMap: {
              //   show: false,
                
              //   // min: 0,
              //   // max: 20,
              //   // left: 'left',
              //   // top: 'bottom',
              //   // text: ['高', '低'], // 文本，默认为数值文本
              //   // calculable: true,
              //   // color: ['blue', 'blue'],

              // },
              toolbox: {
                  show: false,
                  // orient: 'vertical',
                  // left: 'right',
                  // top: 'center',
                  // feature: {
                  //     dataView: {
                  //         readOnly: false
                  //     },
                  //     restore: {},
                  //     saveAsImage: {}
                  // }
              },
              geo: {
                    map: name,
                    show: true,
                    left: '7%',
                    // roam: true,
                    label: {
                      normal: {
                        show: false
                      },
                      emphasis: {
                        show: false,
                      }
                    },

                    itemStyle: {
                        normal: {
                            // areaColor: '#e8f4f3',
                            // borderColor: '#0a53e9',//线
                            // shadowColor: '#092f8f',//外发光
                            // shadowBlur: 20
                            // areaColor: '#000',
                            borderWidth: 5, //设置外层边框
                            borderColor:'#fff',
                            shadowColor: '#83c5c7',//外发光
                            shadowBlur: 20
                        },
                        emphasis: {
                            areaColor: 'red',//悬浮区背景
                        },
                    },

                    // select: {
                    //   itemStyle: {
                    //     areaColor: "red",
                    //     borderColor: "#f18355",
                    //     borderWidth: "3"
                    //   }
                    // }

              },
              series: [{
                  // name: '地市',
                  // selectedMode:"multiple", //选择模式，单选，只能选中一个地市
                  select:{//这个就是鼠标点击后，地图想要展示的配置
                    disabled: true,//可以被选中
                    itemStyle:{//相关配置项很多，可以参考echarts官网
                      areaColor:"#77e8e4"//选中
                    },
                    label: {
                      normal: {
                          show: true,
                          color: '#333'
                      },
                      emphasis: {
                          textStyle: {
                              color: '#fff'
                          }
                      }
                    },
                  },
                  type: 'map',
                  map: name,
                  // roam: true,
                  label: {
                      normal: {
                          show: true,
                          color: '#333'
                      },
                      emphasis: {
                          textStyle: {
                              color: '#fff'
                          }
                      }
                  },
                  left: '7%',
                  data: [
                      // {
                      //     name: '济南市',
                      //     value: 7,
                      // },
                      // {
                      //     name: '青岛市',
                      //     value: 13,
                      // }
                  ],

                  itemStyle: {
                      normal: {
                          borderWidth: 1,//区域边框宽度
                          borderColor: '#6f9ed1',//区域边框颜色
                          areaColor: "#e8f4f3",//区域颜色
                          // shadowColor: '#092f8f',//外发光
                          // shadowBlur: 20
                      },
                      emphasis: {
                          // borderWidth: .5,
                          // borderColor: '#fff',
                          areaColor: "#06a7ac",
                      },
                      //重点下面，与点击事件不同，虽然也是点击选中，但是事件不一样
              
                      
                  },
                  
                  // animationDurationUpdate: 1000,
                  // animationEasingUpdate: 'quinticInOut'
              }]
          });
  

      },
    
  }
}
</script>
<style lang='scss' scoped>
  .div1{
    width: 150px;
    height: 80%;
    background: url(require('@/assets/safeDanger/map1.png')) no-repeat;
    background-size: auto 100%;
    position: absolute;
    left: 2%;
    top: 10%;
  }
  .div2{
    width: 150px;
    height: 80%;
    background: url(require('@/assets/safeDanger/map2.png')) no-repeat right;
    background-size: auto 100%;
    position: absolute;
    right: 1.5%;
    top: 10%;
  }
  .wrap{
    width: 100%;
    height:100%;
    position: relative;
    // background: linear-gradient(to bottom, #d5e1f8, #fff);
  }
  #box-c-t-map{
    width: 100%;
    height: 100%;
    padding: 20px;
    overflow: hidden;
  }
</style>
