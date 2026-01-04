<template>
  <div class="title_detail">
    <div class="xt_card basic_info" style="margin-bottom: 20px">

     <formTitle :titleText="'老旧设备打分详情'" :titleType="'page_title'"></formTitle>

      <div class="info_title">
        <img src="@/assets/taizhang/jichuDevice.png" alt="">
        <span class="dev_name">{{detail.deviceName}}</span>
      </div>
      <div class="info_form">
        <div class="form_box">
          <el-row>
            <el-col :span="10" class="form_item">
               <div class="status_c">
           <span class="df_title">设备评分:</span>
           <span  class="df_value">{{score}}</span>
        </div>
            </el-col>
            <el-col :span="10" class="form_item">
            <div class="status_c">
           <span class="df_title">当前排名:</span>
           <span  class="df_value">{{rank}}</span>
        </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18" class="form_item">
               <div class="description_title">
               <p>[评分说明] 评价得分=机房级别*机房功能*设备状态*（超龄时间维度*运维情况+服务风险+（n-）满足情况）*资产运维归属情况*运行情况自评</p>
              </div>
            </el-col>
          </el-row>
        </div>
        
          <p class="yaar_score_content">打分周期：{{detail.scoreCycle}}</p>
          <div id="radarEcharts"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: ["formValue"],
  data() {
    return {
      qrcode: null,
      deviceStatus: '',
      deviceType: '',
      device_type: '',
      getEchartXData:['A 机房级别','B 机房功能','S 设备状态','T 超龄时间','C 维保情况','D 设备归属部门','E 服务风险','F 运行自评','H n-1满足情况'],
      getEchartData:[],
      score:0,
      rank:'',
      detail:{},
      tooltipContentL:[],
    }
  },
  computed: {

    getDeviceHeadImage() {
      if (this.deviceType === '安全设备') {
        return require('@/assets/taizhang/safeDevice.png')
      } else if (this.deviceType === '办公设备') {
        return require('@/assets/taizhang/bangongDevice.png')
      } else if (this.deviceType === '备品备件') {
        return require('@/assets/taizhang/beijianDevice.png')
      } else if (this.deviceType === '存储设备') {
        return require('@/assets/taizhang/cunchuDevice.png')
      } else if (this.deviceType === '辅助设备') {
        return require('@/assets/taizhang/fuzhuDevice.png')
      } else if (this.deviceType === '基础设施') {
        return require('@/assets/taizhang/jichuDevice.png')
      } else if (this.deviceType === '网络设备') {
        return require('@/assets/taizhang/wangluoDevice.png')
      } else if (this.deviceType === '终端设备') {
        return require('@/assets/taizhang/zhongduanDevice.png')
      } else if (this.deviceType === '主机设备') {
        return require('@/assets/taizhang/zhujiDevice.png')
      }
      return '';
    },
  },
  methods: {
     setData(score,data){
    this.score = score;
    this.detail = data;
    this.tooltipContentL = [this.detail.roomLevelScore,this.detail.roomFunctionScore,
    this.detail.deviceStatusScore,this.detail.overAgeScore,this.detail.maintenanceScore,this.detail.deptScore,
    this.detail.serviceRiskScore,this.detail.appriseOwnScore,this.detail.customizeScore];

    this.getEchartData = [this.detail.roomLevelScore >= 10 ? 10 : this.detail.roomLevelScore,
    this.detail.roomFunctionScore >= 10 ? 10 :  this.detail.roomFunctionScore,
    this.detail.deviceStatusScore  >= 10 ? 10 :  this.detail.deviceStatusScore,
    this.detail.overAgeScore >= 10 ? 10 :  this.detail.overAgeScore,
    this.detail.maintenanceScore >= 10 ? 10 :  this.detail.maintenanceScore,
    this.detail.deptScore >= 10 ? 10 :  this.detail.deptScore,
    this.detail.serviceRiskScore >= 10 ? 10 :  this.detail.serviceRiskScore,
    this.detail.appriseOwnScore >= 10 ? 10 :  this.detail.appriseOwnScore,
    this.detail.customizeScore >= 10 ? 10 :  this.detail.customizeScore];
     this.echartRadarInit();
    },
     setRank(rank){
        if(this.score == 0){
          this.rank = '--'
        }else{
          this.rank = rank;
        }
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
          position:'bottom',
          formatter:() =>{
            // console.log( this.getEchartXData,'------------------');
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
          radius: "60%",
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
            },
          },
          splitLine: {
           lineStyle:{
              color:'#606266',
              width:0.2,
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
              width: 1,
              color: "#1673FF",
            },
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
}
</script>

<style lang="scss" scoped>
.radio_content{
  width:30%;
  display: flex;
  flex-direction: column;
  
}

.yaar_score_content{
   position: absolute;
   top:0;
   right: 30px;
   color: #409EFF;
   font-size: 14px;
}
  #radarEcharts {
      width: 25%;
      height: 200px;
      min-height: 208px;
    }

.status_c{
    color:#409EFF;
    .df_title{
        font-size: 18px;
        font-weight: 600;
    }
    .df_value{
        margin-left:3px;
        font-size: 60px;
        font-weight: 600;
        font-style: italic;
    }
}
.status_i {
  width: 88px;
}

i {
  font-style: normal
}

.el-col {
  margin-bottom: 0px
}

.form_label:before {
  content: '';
  display: inline-block;
  border: 5px solid #409EFF;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-top-color: transparent;
}

.basic_info {
  .info_title {
    font-size: 14px;
    color: #409EFF;
    height: 35px;
    line-height: 35px;
    display: flex;
    align-items: center;
    padding-left: 20px;

    .dev_name {
      font-size: 14px;
      display: inline-block;
      margin: 0 20px;
    }

    .btn_box {
      flex: auto;
      text-align: right;
    }

    img {
      width: 28px;
      height: 28px;
    }
  }

  .info_form {
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 20px;
    flex-direction: row;
    padding-top:30px;
    width: 100%;
    .form_box {
      width: 75%;

      .form_item {
        display: flex;
        flex-direction: row;

        .form_label {
          line-height: 40px;
          font-size: 14px;
          white-space: nowrap;
          position: relative;
        }

        .form_content {
          flex: auto;
          overflow-x: hidden;
          line-height: 40px;
          font-size: 14px;
          padding-left: 15px;
        }
      }
    }

    .code_img_box {
      flex: auto;
      text-align: right;
      white-space: nowrap;

      .qrcode {
        display: inline-block;
        // height: 80px;
        // width: 80px;
      }

      img {
        height: 80px;
        width: 80px;

        &:first-child {
          margin-right: 10px
        }
      }
    }
  }
}


.description_title{
    p{
        font-size: 14px;
        color: orange;
    }
}

</style>
