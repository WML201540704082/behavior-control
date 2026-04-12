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
    <div class="ictHome-t">
      
      <div class="d_sjglbtn d_v1 vh_center" @click="goRecord">
        <div class="d_start">
          <div class="d_img vh_center">
            <img src="@/assets/img/ictHome/yhgl_yhzs.png" class="i_mg"/>
          </div>
          <div>
            <div class="d_yhzs">
              <span class="s_s1">提报问题</span>
            </div>
            <div class="vh_center">
              <span class="s_v1 s_v">{{ counts.questionCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="d_sjglbtn d_v2 vh_center" @click="goRecord">
        <div class="d_start">
          <div class="d_img vh_center">
            <img src="@/assets/img/ictHome/yhgl_zgz.png" class="i_mg"/>
          </div>
          <div>
            <div class="d_yhzs">
              <span class="s_s1">处理中</span>
            </div>
            <div class="vh_center">
              <span class="s_v2 s_v">{{ counts.questionOnline }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="d_sjglbtn d_v3 vh_center" @click="goRecord">
        <div class="d_start">
          <div class="d_img vh_center">
            <img src="@/assets/img/ictHome/yhgl_wczg.png" class="i_mg"/>
          </div>
          <div>
            <div class="d_yhzs">
              <span class="s_s1">已解决</span>
            </div>
            <div class="vh_center">
              <span class="s_v3 s_v">{{ counts.questionByResolve }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="d_sjglbtn d_v4 vh_center" @click="goRecord">
        <div class="d_start">
          <div class="d_img vh_center">
            <img src="@/assets/img/ictHome/yhgl_wczg.png" class="i_mg"/>
          </div>
          <div>
            <div class="d_yhzs">
              <span class="s_s1">纳入需求</span>
            </div>
            <div class="vh_center">
              <span class="s_v4 s_v">{{ counts.questionByNeed }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="d_sjglbtn d_v3 vh_center" @click="goRecord">
        <div class="d_start">
          <div class="d_img vh_center">
            <img src="@/assets/img/ictHome/yhgl_wczg.png" class="i_mg"/>
          </div>
          <div>
            <div class="d_yhzs">
              <span class="s_s1">转为知识</span>
            </div>
            <div class="vh_center">
              <span class="s_v3 s_v">{{ counts.knowledgeCount }}</span>
            </div>
          </div>
        </div>
      </div> -->

              
            
    </div>
    <div class="ictHome-c">
      <div class="ictHome-l">
        <div class="title1">
          {{ mapTitle }}
          <el-select v-model="mapType" @change="mapTypeChange" size="small" style="width: 150px">
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="d_center_top_c3" v-loading="pageLoading">
          <div id="chartCenterMap" class="wh100"></div>
        </div>
      </div>
      <div class="ictHome-r">
        <div class="title1">信创知识贡献度排名</div>
        <div class="ictHome-rc">
          <el-table
            ref="questionList"
            :data="questionData"
            :height="'100%'"
            stripe
            size="mini"
            v-loading="tableLoading"
          >
          <!-- :formatter="isResolveFormatter" -->
            <!-- <el-table-column type="index" label="序号" width="50"></el-table-column> -->
            <el-table-column label="排名" prop="isResolve" align="center" show-overflow-tooltip>
              <template slot-scope="{ row, $index }">
                <div :class="['tag', 'tag'+$index]"> {{ $index+1 }} </div>
              </template>
            </el-table-column>
            <el-table-column label="公司" prop="dept" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="数量" prop="count" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="占比" prop="ratio" align="center" show-overflow-tooltip></el-table-column>
          
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statisticCount, statisticRegion, statistic, statisticRank } from "@/api/ictHome/index"

export default {
  data() {
    return{
      mapTitle: "信创运维全景图",
      mapType: 1,
      typeList: [
        {
          label: '信创运维全景图',
          value: 1
        },
        {
          label: '运维团队全景图',
          value: 2
        },
      ],
      
      counts: {
        questionCount: 0,
        questionOnline: 0,
        questionByResolve: 0,
        questionByNeed: 0
      },
      questionData: [],

      pageLoading: false,
      mapData: [],
      tableLoading: false,
      
      chartCenterMap: null,
    }
  },
  mounted() {
    this.statisticCount()
    this.statisticRegion()
    this.statisticRank()


    
   
  },
  methods: {
    mapTypeChange(val){
      
      this.chartCenterMap.dispose()
      this.mapData = []
      if(val == 1){
        this.mapTitle="信创运维全景图"
        this.statisticRegion()
      }else{
        // this.chartCenterMap.setOption({})
        this.mapTitle="运维团队全景图"
        this.statisticRegion2()
      }
    },
    statisticCount(){
      statisticCount().then(res=>{
        this.counts = res.data
      })
    },
    statisticRegion(){
      this.pageLoading = true
      statisticRegion().then(res=>{
        res.data.forEach(ele=>{
          ele.value = ele.questionCount
        })
        this.mapData = res.data
        this.pageLoading = false
        // setTimeout(()=>{
          this.initchartCenterTopMap()
        // }, 3000)
        
      })
    },
    statisticRank(){
      statisticRank().then(res=>{
        this.questionData = res.data
      })
    },
    
    
    //隐患地图展示
    initchartCenterTopMap() {
      // let mapData = require(`@/assets/mapsData/27117.json`);
      // console.log(11333, mapData)
      let _this = this
      this.chartCenterMap = this.$echarts.init(document.getElementById('chartCenterMap'))
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

      this.chartCenterMap.setOption({
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
              str = `<span style="color:#000000;font-weight: bold">${params.data.name}</span></br>
                     <span style="color:#F4A03F;font-size: 13px;">问题提报：${params.data.questionCount}</span></br>
                     <span style="color:#5BCEB5;font-size: 13px;">处理中：${params.data.knowledgeCount}</span></br>
                     <span style="color:#f56c6c;font-size: 13px;">已解决：${params.data.questionByResolve}</span></br>
                     <span style="color:#91CC75;font-size: 13px;">纳入需求：${params.data.questionByNeed}</span>
                     `
            }
            return str;
          },

          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#5494e9',
          padding: 10
        },
        visualMap: {
          show: true,
          // orient: 'horizontal',
          text: ['30', '0'],
          // textStyle: {
          //   color: 'red'
          // },
          right: 10,
          bottom: 25,
          calculable: false,
          min: 0,
          max: 30,
          inRange: {
            color: ['#d4f0fc', '#6ea2e7']
          }
        },
        geo: {
          map: name,
          show: true,
          // roam: true,
          top: '11%',
          left: '3%',
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
          left: '3%',
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
          data: _this.mapData 
          // [
          //   { name:'烟台市', value:100 },
          //   { name:'青岛市', value:200 },
          // ]
          // animationDurationUpdate: 1000,
          // animationEasingUpdate: 'quinticInOut'
          },
          // 气泡
          {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin',
            data: convertData(_this.mapData),
            symbolSize: 60,
            label: {
              normal: {
                show: true,
                formatter: '{@[2]}',
                textStyle:{
                  color: 'blue',
                  fontSize: 10,
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#8ab9ed',
                borderColor: '#8ab9ed'
              }
            },
            zlevel: 6,
          }
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


    statisticRegion2(){
      this.pageLoading = true
      statistic().then(res=>{
        res.data.forEach(ele=>{
          // ele.value = ele.questionCount
          ele.name = ele.regionName
        })
        this.mapData = res.data
        this.pageLoading = false
        // console.log(123)
        // setTimeout(()=>{
          // console.log(321)
          this.initchartCenterTopMap2()
        // }, 3000)
      })
    },
    
    //隐患地图展示
    initchartCenterTopMap2() {
      // let mapData = require(`@/assets/mapsData/27117.json`);
      // console.log(11333, mapData)
      let _this = this
      this.chartCenterMap = this.$echarts.init(document.getElementById('chartCenterMap'))
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

      this.chartCenterMap.setOption({
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
        //   show: false,
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
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ictHome-l{
    width: 65%;
    height: 100%;
    .wh100{
      width: 100%;
      height: 100%;
    }
    .d_center_top_c3{
      width: 100%;
      height: calc(100% - 100px);
      max-height:680px
    }
  }
  .ictHome-r{
    width: 28%;
    height: 100%;
    // padding-left: 90px;
    // box-sizing: border-box;
    .ictHome-rc{
      height: calc(100% - 20px);
      max-height: 665px;
    }
    ::v-deep .ictHome-rc .el-table .el-table__cell{
      height: 35px;
    }
    .tag{
      width: 20px;
      height: 20px;
      text-align: center;
      margin: 0 auto;
      line-height: 20px;
      border-radius: 50%;
      background: #d9e2e9;
      color: #333;
    }
    .tag0{
      background: #e3593c;
      color: #fff;
    }
    .tag1{
      background: #ea993f;
      color: #fff;
    }
    .tag2{
      background: #f3c843;
      color: #fff;
    }
  }
  .ictHome{
    width: 1400px;
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
  .ictHome-t{
    height: 100px;
    display: flex;
    justify-content: space-between;
    padding: 10px 0;

    .d_sjglbtn {
      width: 21%;
      cursor: pointer;
    }
    .vh_center {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .d_start {
      display: flex;
      justify-content: flex-start;
    }
    .d_img {
      margin-right: 16px;
    }
    .i_mg {
      width: 45px;
      height: 45px;
    }
    .d_yhzs {
      margin-bottom: 3px;
    }
    .s_s1 {
      font-size: 18px;
      color: #333333;
    }

    .s_v {
      font-weight: bold;
      font-size: 28px;
    }

    .s_v1 {
      color: #4DA2F8;
    }

    .s_v2 {
      color: #F4A03F;
    }

    .s_v3 {
      color: #5BCEB5;
    }

    .s_v4 {
      color: #91CC75;
    }



    .d_v1 {
      background-color: #EDF6FD;
      border-radius: 8px;
    }

    .d_v2 {
      background-color: #FEF8EC;
      border-radius: 8px;
    }

    .d_v3 {
      background-color: #EBFAF9;
      border-radius: 8px;
    }

    .d_v4 {
      background-color: #E9F5E3;
      border-radius: 8px;
    }
  }
</style>
