<template>
  <div class="ictHome">
    <el-button 
      type="primary" 
      size="small"  
      icon="el-icon-arrow-left"
      @click="$router.push({path: '/ictOperationManage'})"
      style="position: fixed;
            right: 45px;
            top: 20px;"
    >返回</el-button>
    
    <div class="ictHome-c">
      <div class="ictHome-l">
        <div class="title1">信创运维全景图</div>
        <div class="d_center_top_c3" v-loading="pageLoading">
          <div id="chartCenterMap" class="wh100"></div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { statistic } from "@/api/ictHome/index"

export default {
  data() {
    return{

      pageLoading: false,
      mapData: [],
      tableLoading: false,
      
    }
  },
  mounted() {
    this.statisticRegion2()
  },
  methods: {
    
    statisticRegion2(){
      this.pageLoading = true
      statistic().then(res=>{
        res.data.forEach(ele=>{
          // ele.value = ele.questionCount
          ele.name = ele.regionName
        })
        this.mapData = res.data
        this.pageLoading = false
        this.initchartCenterTopMap2()
      })
    },
    
    //隐患地图展示
    initchartCenterTopMap2() {
      // let mapData = require(`@/assets/mapsData/27117.json`);
      // console.log(11333, mapData)
      let _this = this
      var chartCenterMap = this.$echarts.init(document.getElementById('chartCenterMap'))
      var name = 'shandong';
      let geoJson = require(`@/assets/mapsData/27117.json`);
      // console.log(111, geoJson)
      var geoCoordMap = {}
      geoJson.features.forEach(ele=>{
        geoCoordMap[ele.properties.name] = ele.properties.cp
      })
      // console.log(222, geoCoordMap)

      this.$echarts.registerMap(name, geoJson);

      var convertData = (data)=>{
        // return []
        var res = [];
        for( var i=0; i<data.length; i++ ){
          var geoCoord = geoCoordMap[data[i].name];
          if(geoCoord){
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            })
          }
        }
        return res
      }
      // console.log(333, convertData(this.mapData))

      chartCenterMap.setOption({
        title: {
          text: '',
          right: '3%',
          bottom: '5%',
          textStyle: {
            fontSize: 20,
            fontWeight: 'bolder',
            color: 'black' // 主标题文字颜色
          }
        },
        tooltip: {
          // trigger: 'item',
          // formatter: '{b}<br/>{c}'
          trigger: 'item',
          borderWidth: 0,
          formatter: function (params) {
            // console.log(9999, params)
            let str = '';
            if(params.data && params.seriesType=='map'){
              // str = `<span style="color:#000000;font-weight: bold">${params.data.name}</span></br>
              //        <span style="color:#F4A03F;font-size: 13px;">问题提报：${params.data.questionCount}</span></br>
              //        <span style="color:#5BCEB5;font-size: 13px;">信创知识：${params.data.knowledgeCount}</span></br>
              //        <span style="color:#91CC75;font-size: 13px;">纳入需求：${params.data.questionByNeed}</span></br>
              //        <span style="color:#f56c6c;font-size: 13px;">已关闭：${params.data.questionByResolve}</span>`

              let line = '';
              if(params.data.rank.length> 0){
                params.data.rank.forEach((ele, index)=>{
                  line+=`<tr>
                            <td style='width: 50px; height: 30px;text-align: center; border: 0; border: 1px solid #33bfb1'>${index+1}</td>
                            <td style='width: 100px; height: 30px;text-align: center; border: 0; border: 1px solid #33bfb1'>${ele.name}</td>
                            <td style='width: 80px; height: 30px;text-align: center; border: 0; border: 1px solid #33bfb1'>${ele.questionCount}</td>
                            <td style='width: 80px; height: 30px;text-align: center; border: 0; border: 1px solid #33bfb1'>${ele.knowledgeCount}</td>
                          </tr>`
                })
              }else{
                line = `<tr>
                            <td style='width: 90px; height: 30px;text-align: center; border: 0; border: 1px solid #33bfb1' colspan="4">空</td>
                          </tr>`
              }
              
              // border: 1px solid #33bfb1;
              str = `<table border="1" cellspacing="1" style="color:#000000;border: 1px solid #33bfb1;">
                          <tr>
                            <td style='width: 50px; height: 30px;text-align: center; border: 0; border: 1px solid #33bfb1'>排名</td></td>
                            <td style='width: 100px; height: 30px;text-align: center; border: 0; border: 1px solid #33bfb1'>姓名</td>
                            <td style='width: 80px; height: 30px;text-align: center; border: 0; border: 1px solid #33bfb1'>提报问题</td></td>
                            <td style='width: 80px; height: 30px;text-align: center; border: 0; border: 1px solid #33bfb1'>提报知识</td>
                          </tr>
                          ${line}
                        </table>`
            }
            return str;
          },

          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#fff',
          padding: 0
        },
        // visualMap: {
        //   // orient: 'horizontal',
        //   text: ['30', '0'],
        //   // textStyle: {
        //   //   color: 'red'
        //   // },
        //   right: 10,
        //   bottom: 25,
        //   calculable: false,
        //   min: 0,
        //   max: 30,
        //   inRange: {
        //     color: ['#d4f0fc', '#6ea2e7']
        //   }
        // },
        geo: {
          map: name,
          show: true,
          // roam: true,
          top: '11%',
          left: '5%',
          // right: '20%',
          bottom: '5%',
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
              borderColor: '#fff',
              shadowColor: '#ddf6fe',//外发光
              shadowBlur: 20
            },
            emphasis: {
              areaColor: 'red',//悬浮区背景
            },
          },
        },
        series: [
          {
          // name: '地市',
          // selectedMode:"multiple", //选择模式，单选，只能选中一个地市
          select: {//这个就是鼠标点击后，地图想要展示的配置
            disabled: true,//可以被选中
            itemStyle: {//相关配置项很多，可以参考echarts官网
              areaColor: "#77e8e4"//选中
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
          top: '11%',
          left: '5%',
          bottom: '5%',
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
          itemStyle: {
            normal: {
              borderWidth: 1,//区域边框宽度
              borderColor: '#6f9ed1',//区域边框颜色
              areaColor: "#c0e1f7",//区域颜色
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
          data: _this.mapData 
          // [
          //   { name:'烟台市', value:100 },
          //   { name:'青岛市', value:200 },
          // ]
          // animationDurationUpdate: 1000,
          // animationEasingUpdate: 'quinticInOut'
          },
          // 气泡
          // {
          //   name: '点',
          //   type: 'scatter',
          //   coordinateSystem: 'geo',
          //   symbol: 'pin',
          //   data: convertData(_this.mapData),
          //   symbolSize: 60,
          //   label: {
          //     normal: {
          //       show: true,
          //       formatter: '{@[2]}',
          //       textStyle:{
          //         color: 'blue',
          //         fontSize: 10,
          //       }
          //     }
          //   },
          //   itemStyle: {
          //     normal: {
          //       color: '#8ab9ed',
          //       borderColor: '#8ab9ed'
          //     }
          //   },
          //   zlevel: 6,
          // }
        ]
      });
      // chartCenterMap.off('click')
      // chartCenterMap.on('click', (params)=>{
      //   console.log(123, params, this.secondCompanyList)
      //   if(params.name){
         

      //     let orgId1 = this.secondCompanyList.filter( ele=> ele.shortName.includes(params.name.replace('市', '')) )[0]
      //     console.log('看了看', orgId1)

      //     if( orgId1 && this.queryParams.secondCompany == orgId1.orgId && (this.companyCode == '05' || this.companyCode == '059999') ){
      //       this.companyChange('05')
      //     }else if(orgId1){
      //       this.companyChange(orgId1.orgId)
      //     }

      //   }
      // })


    },
    goRecord(){

    }
  }
}
</script>

<style lang="scss" scoped>
  .title1{
    font-size: 20px;
    margin-bottom: 10px;
  }
  .ictHome-l{
    width: 100%;
    height: 100%;
    .wh100{
      width: 100%;
      height: 100%;
    }
    .d_center_top_c3{
      width: 100%;
      height: calc(100% - 100px);
      max-height:550px
    }
  }
  
  .ictHome{
    width: 1300px;
    margin: 0 auto;
    height: 100%;
    padding: 30px 50px;
    box-sizing: border-box;
  }
  .ictHome-c{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: calc(100% - 130px);
    margin-top: 30px;
  }
  
</style>
