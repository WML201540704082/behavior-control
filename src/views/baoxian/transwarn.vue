<template>
  <div class="d_root" v-loading="pageLoading">
    <!--    数据概览-->
    <div class="d_top">
      <div class="d_t_c1">
        <div class="d_b_c1 d_t_left" v-loading="topLeftLoading">
          <div class="d_p1">
            <span class="s_line"></span>
            <span>告警预览</span>
          </div>


          <div class="d_t_bns">
            <div @click="d_t_f_bn_click('type_ydgjs')" class="d_bn1 vh_center" :class="[t_l_s_type == 'type_ydgjs'?'dbn_sel':'']">
              <div>
                <div><span>异动告警数</span></div>
                <div class="vh_center" :class="[t_l_s_type == 'type_ydgjs'?'d_t_nm_sel':'d_t_nm']"><span>{{ c(screenInfo.count, 'abnormalCount') }}</span></div>
              </div>
            </div>

            <div @click="d_t_f_bn_click('type_gjdjfb')" class="d_bn1 vh_center" :class="[t_l_s_type == 'type_gjdjfb'?'dbn_sel':'']">告警等级分布</div>
            <div @click="d_t_f_bn_click('type_gjlxfb')" class="d_bn1 vh_center" :class="[t_l_s_type == 'type_gjlxfb'?'dbn_sel':'']">告警类型分布</div>
            <div @click="d_t_f_bn_click('type_gjcsfb')" class="d_bn1 vh_center" :class="[t_l_s_type == 'type_gjcsfb'?'dbn_sel':'']">告警城市分布</div>
          </div>
          <div class="d_t_zx d_position">
            <div id="d_tl_Chart" class="d_wh100"></div>
            <div v-if="(t_l_s_type != 'type_ydgjs')" :class="[getTimeClass(t_l_s_type)]">
              <span>统计时间：2024-07-20 10:32:22</span>
            </div>

            <div v-if="(t_l_s_type == 'type_gjcsfb')" class="d_city">
              <el-steps :align-center="true">
                <el-step v-for="(item,index) in screenInfo.top_left_btn4_citys" :key="index">
                  <template #title>
                    <span class="s_city" @click="stepIconClick(item)">{{ item.cityName }}</span>
                  </template>
                  <template #icon>
                    <div :class="[item.choose?'d_step_icon_sel':'d_step_icon_nosel']" @click="stepIconClick(item)"></div>
                  </template>
                </el-step>
              </el-steps>
            </div>
          </div>

        </div>
        <div class="d_b_c1 d_t_right" v-loading="topRightLoading">
          <div class="d_p1">
            <span class="s_line"></span>
            <span>告警处置概览</span>
          </div>

          <div class="d_t_bns">
            <div class="d_bn1_noclick vh_center">
              <div>
                <div><span>异动告警处置数</span></div>
                <div class="d_t_nm vh_center"><span>{{ c(screenInfo.count, 'abnormalDisposeCount') }}</span></div>
              </div>
            </div>

            <div @click="d_t_r_bn_click('type_wqrgj')" class="d_bn1 vh_center" :class="[t_r_s_type == 'type_wqrgj'?'dbn_sel':'']">
              <div>
                <div><span>未确认告警</span></div>
                <div class="vh_center" :class="[t_r_s_type == 'type_wqrgj'?'d_t_nm_sel':'d_t_nm']"><span>{{ c(screenInfo.count, 'confirmCount') }}</span></div>
              </div>
            </div>
            <div @click="d_t_r_bn_click('type_yhlgj')" class="d_bn1 vh_center" :class="[t_r_s_type == 'type_yhlgj'?'dbn_sel':'']">
              <div>
                <div><span>已忽略告警</span></div>
                <div class="vh_center" :class="[t_r_s_type == 'type_yhlgj'?'d_t_nm_sel':'d_t_nm']"><span>{{ c(screenInfo.count, 'ignoreCount') }}</span></div>
              </div>
            </div>
            <div @click="d_t_r_bn_click('type_yqrdczgj')" class="d_bn1 vh_center" :class="[t_r_s_type == 'type_yqrdczgj'?'dbn_sel':'']">
              <div>
                <div><span>已确认待处置告警</span></div>
                <div class="vh_center" :class="[t_r_s_type == 'type_yqrdczgj'?'d_t_nm_sel':'d_t_nm']"><span>{{ c(screenInfo.count, 'disposeCount') }}</span></div>
              </div>
            </div>
          </div>
          <div class="d_t_zx d_position">
            <div id="d_tr_Chart" class="d_wh100" v-if="t_r_s_type!='type_yhlgj'"></div>
            <div v-else class="d_start d_wh100">
              <div class="d_w50">
                <div id="d_tr_ld_Chart" class="d_wh100"></div>
              </div>

              <div class="d_w50">
                <div id="d_tr_pie_Chart" class="d_wh100"></div>
              </div>
            </div>

            <div v-if="isNoData(screenInfo.top_left_zx)" class="d_empty_vhcenter">
              <span>暂无数据</span>
            </div>
            <div :class="[getTimeClass(t_r_s_type)]">
              <span>统计时间：2024-07-20 10:32:22</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="d_bottom">
      <div class="d_b_c1 d_b_c0" v-loading="downLeftLoading">
        <div class="d_100 d_sb">
          <div class="d_p1">
            <span class="s_line"></span>
            <span>未处置告警情况</span>
          </div>
        </div>
        <div class="d_p2">
          <div class="d_h35">
            <div id="d_d_leftChart1" class="d_wh100"></div>
          </div>
          <div class="d_h65">
            <div id="d_d_leftChart2" class="d_wh100"></div>
          </div>
        </div>
      </div>

      <div class="d_b_c1 d_b_c2 d_bg_tran" v-loading="downRightLoading">
        <div class="d_b_r_d1 d_position">
          <div class="d_p1">
            <span class="s_line"></span>
            <span>今日新增告警</span>
          </div>
          <div id="d_br_pieChart" class="d_lp d_100"></div>

          <div class="d_jd2">
            <div>
              <span class="s_label4">{{ screenInfo.down_right_day ? screenInfo.down_right_day.disposeSchedule : '0%' }}</span>
            </div>
            <div>
              <span class="s_label5">处置进度</span>
            </div>
          </div>
        </div>

        <div class="d_b_r_d2">
          <div class="d_b_r_b_left vh_center">
            <div class="d_ldsx vh_center">
              <div>
                <div class="vh_center">
                  <span class="s_color s_color1">{{ c(screenInfo.down_right_week, 'count') }}</span>
                </div>
                <div class="vh_center">
                  <span class="s_mlt">本周告警数</span>
                </div>
              </div>
            </div>
          </div>
          <div class="d_b_r_b_right vh_center">
            <div class="d_ldsx">
              <div class="d_h100">
                <div class="d_start d_h50 d_bor1">
                  <div class="d_h100 d_w50 vh_center d_bor2">
                    <div>
                      <div class="vh_center">
                        <span class="s_color s_color2">{{ c(screenInfo.down_right_week, 'noConfirmCount') }}</span>
                      </div>
                      <div class="vh_center">
                        <span class="s_mlt">未确认告警</span>
                      </div>
                    </div>
                  </div>
                  <div class="d_h100 d_w50 vh_center">
                    <div>
                      <div class="vh_center">
                        <span class="s_color s_color3">{{ c(screenInfo.down_right_week, 'disposeCount') }}</span>
                      </div>
                      <div class="vh_center">
                        <span class="s_mlt">已处置告警</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d_start d_h50">
                  <div class="d_h100 d_w50 vh_center d_bor2">
                    <div>
                      <div class="vh_center">
                        <span class="s_color s_color4">{{ c(screenInfo.down_right_week, 'noDisposeCount') }}</span>
                      </div>
                      <div class="vh_center">
                        <span class="s_mlt">未处置告警</span>
                      </div>
                    </div>
                  </div>
                  <div class="d_h100 d_w50 vh_center">
                    <div>
                      <div class="vh_center">
                        <span class="s_color s_color5">{{ c(screenInfo.down_right_week, 'ignoreCount') }}</span>
                      </div>
                      <div class="vh_center">
                        <span class="s_mlt">已忽略告警</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {
  Count,
  topLeftBtn1,
  topLeftBtn2,
  topLeftBtn3,
  topLeftBtn4,
  topRightBtn1,
  topRightBtn2,
  topRightBtn3,
  downLeft,
  downRightDay,
  downRightWeek
} from "@/api/baoxian/transwarn";
import * as echarts from "echarts";
import {getAreaTree} from "@/api/safeDanger/computerroom";

export default {
  name: "",
  components: {},
  data() {
    return {
      pageLoading: false,
      screenInfo: {},

      t_l_s_type: null,
      t_r_s_type: null,

      topLeftLoading: false,
      topRightLoading: false,
      downRightLoading: false,
      downLeftLoading: false,
    };
  },
  watch: {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.t_l_s_type = 'type_ydgjs';
      this.t_r_s_type = 'type_wqrgj';

      this.screenInfo = {};

      this.$nextTick(() => {
        this.requestScreenInfo();
      })
    },

    requestScreenInfo() {
      this.d_t_f_bn_click(this.t_l_s_type);
      this.d_t_r_bn_click(this.t_r_s_type);

      this.initchartDownRightPie();
      this.initchartDownLeftChart1();
      this.initchartDownLeftChart2();

      //Count统计数
      Count().then(res => {
        this.$set(this.screenInfo, 'count', res.data);
      });

      this.downRightLoading = true;
      downRightDay().then(res => {
        this.$set(this.screenInfo, 'down_right_day', res.data);
        this.initchartDownRightPie();
      }).finally(() => {
        if (this.screenInfo.down_right_week) {
          this.downRightLoading = false;
        }
      });

      downRightWeek().then(res => {
        this.$set(this.screenInfo, 'down_right_week', res.data);
      }).finally(() => {
        if (this.screenInfo.down_right_day) {
          this.downRightLoading = false;
        }
      });

      this.downLeftLoading = true;
      downLeft().then(res => {
        this.$set(this.screenInfo, 'down_left', res.data);

        this.initchartDownLeftChart1();
        this.initchartDownLeftChart2();
      }).finally(() => {
        this.downLeftLoading = false;
      });
    },
    initchartTopLeftYDGJS() {
      let xValue = [];
      let yValue = [];

      if (this.screenInfo.top_left_btn1) {
        this.screenInfo.top_left_btn1.forEach((item, index) => {
          xValue.push(this.getFormatDay(item.dayDate));
          yValue.push(item.count);
        });
      }
      let d_tl_Chart = this.$echarts.init(document.getElementById('d_tl_Chart'));
      d_tl_Chart.clear();
      d_tl_Chart.setOption({
        title: {
          text: '近7天新增告警趋势图',
          left: 'center',
          textStyle: {
            fontSize: 14,
          }
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          transitionDuration: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        legend: {
          show: true,
          top: '6%',
          textStyle: {
            color: '#555555',
            fontSize: '14px',
          },
          data: ['每日新增告警数'],
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '6%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xValue,
          axisTick: {
            show: true,
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: '#c7c7c7',
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#0f5681',
              tyle: 'dotted'
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#888888',
              fontSize: '14px',
            }
          },
        },
        yAxis: {
          type: 'value',
          name: '数量',
          nameTextStyle: {
            color: '#333333',
            fontSize: '14px',
            align: 'right'
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#c7c7c7',
            }
          },
          axisTick: {
            show: true,
            alignWithLabel: true,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#e7e7e7',
              tyle: 'dashed'
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#888888',
              fontSize: '14px',
            }
          },
        },
        series: [
          {
            name: '每日新增告警数',
            type: 'line',
            smooth: 'circle',
            smoothSize: '14px',
            itemStyle: {
              borderColor: '#4aBB5E',
              color: '#4aBB5E'
            },
            emphasis: {
              itemStyle: {
                color: '#4aBB5E',
                borderColor: '#4aBB5E',
              },
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: 'rgba(212, 239, 218, 1)'},
                {offset: 0.5, color: 'rgba(212, 239, 218, 1)'},
                {offset: 1, color: 'rgba(212, 239, 218, 1)'},
              ])
            },
            lineStyle: {
              color: '#4aBB5E',//'#D4EFDA',
            },
            data: yValue,
          }
        ]
      })
    },
    initchartTopLeftGJJBFB() {
      let d_tl_Chart = this.$echarts.init(document.getElementById('d_tl_Chart'));
      d_tl_Chart.clear();
      d_tl_Chart.setOption({
        title: {
          text: '告警级别分布情况统计',
          left: 'center',
          top: 20,
          textStyle: {
            fontSize: 14,
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          transitionDuration: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        legend: {
          show: true,
          orient: 'vertical',
          left: '10%',
          top: '30%'
        },
        series: [{
          name: '',
          type: 'pie',
          radius: ['20%', '55%'],
          avoidLabelOverlap: false,
          hoverAnimation: true,
          labelLine: {
            show: true,
            length: 10,
            length2: 15,
          },

          data: !this.screenInfo.top_left_btn2 ? [] : this.screenInfo.top_left_btn2.map(item => {
            return {
              value: item.count,
              name: item.warningLevel,
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    color: '#333333'
                  },
                  formatter: (params) => {
                    return `${params.name}\r\n${item.count}`
                  },
                },
              },
            }
          }),
          itemStyle: {
            color: function (colors) {
              let colorList = ['#58A55C', '#5081EC', '#68BBC4'];
              return colorList[colors.dataIndex];
            },
          },
        }],
      });

      // d_tl_Chart.dispatchAction({
      //   type: 'highlight',
      //   seriesIndex: 0,
      //   dataIndex: 0
      // });

    },
    initchartTopLeftGJLXFB() {
      let xValue = [];
      let yValue = [];

      if (this.screenInfo.top_left_btn3) {
        xValue = this.screenInfo.top_left_btn3.map(item => {
          return item.warningType;
        });
        yValue = this.screenInfo.top_left_btn3.map(item => {
          return item.count;
        });
      }

      let d_tl_Chart = this.$echarts.init(document.getElementById('d_tl_Chart'));
      d_tl_Chart.clear();
      d_tl_Chart.setOption({
        title: {
          text: '告警类型分布情况统计',
          left: 'center',
          top: 20,
          textStyle: {
            fontSize: 14,
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: xValue.length > 6 ? '12%' : '6%',
          containLabel: true
        },
        dataZoom: [{
          type: 'slider',
          startValue: 0,
          endValue: 5,
          show: xValue.length > 6 ? true : false,
          xAxisIndex: [0],
          handleSize: 0,
          height: 12,
          left: '5%',
          right: '5%',
          bottom: 12,
          borderColor: '#8BB6FB',
          fillerColor: '#327EF7',
          backgroundColor: '#eee',
          showDataShadow: false,
          showDetail: false,
          realtime: true,
          filterMode: 'filter',
          handleStyle: {
            borderRadius: '20'
          }
        }],
        tooltip: {
          show: true,
          trigger: 'axis',
          transitionDuration: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        xAxis: {
          type: 'category',
          data: xValue,
          nameTextStyle: {
            color: '#333333',
            fontSize: '12px',
            align: 'right'
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333333',
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#888888',
              fontSize: 12,
            }
          },
        },
        yAxis: {
          name: '',
          type: 'value',
          minInterval: 1,
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333333',
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#888888',
              fontSize: '14px',
            }
          },
        },
        series: [{
          data: yValue,
          stack: 'x',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            normal: {
              color: '#5087EC'
            }
          },
          label: {
            show: true,
            position: 'outside',
            textStyle: {
              color: '#5087EC',
              fontSize: '10px',
            },
            formatter: function (params) {
              if (params.data == 0) {
                return ''
              }
              return params.data;
            }
          }
        }],
      });
    },
    initchartTopLeftGJCSFB() {
      let yValue = [];
      let seriesValue = [];

      // for (let i = 0; i < 16; i++) {
      //   yValue.push(`城市${i}`);
      //   seriesValue.push(parseInt(Math.random() * 60));
      // }
      if (this.screenInfo.top_left_btn4) {
        this.screenInfo.top_left_btn4.forEach(item => {
          yValue.push(item.regionName);
          seriesValue.push(item.count);
        });
      }

      let d_tl_Chart = this.$echarts.init(document.getElementById('d_tl_Chart'));
      d_tl_Chart.clear();
      d_tl_Chart.setOption({
        title: {
          text: '告警数按城市分布情况统计',
          left: 'center',
          textStyle: {
            fontSize: 14,
          }
        },
        grid: {
          top: '30%',
          left: '7%',
          right: '15%',
          bottom: '5%',
          containLabel: true
        },
        dataZoom: [{
          type: 'slider',
          startValue: 0,
          endValue: 9,
          show: yValue.length > 10 ? true : false,
          yAxisIndex: [0],
          handleSize: 0,
          width: 12,
          height: '65%',
          zoomLock: true,
          left: '3%',
          top: '30%',
          bottom: '5%',
          borderColor: '#AAD1FB',
          fillerColor: '#AAD1FB',
          backgroundColor: '#eee',
          showDataShadow: false,
          showDetail: false,
          realtime: true,
          filterMode: 'filter',
          handleStyle: {
            borderRadius: '20'
          }
        }, {
          type: 'inside',
          yAxisIndex: [0],
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: false,
        }],
        tooltip: {
          show: true,
          trigger: 'axis',
          transitionDuration: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        legend: {
          show: true,
          top: '55%',
          right: 12,
          textStyle: {
            color: '#555555',
            fontSize: '14px',
          },
          data: ['告警总数'],
        },
        xAxis: {
          type: 'value',
          minInterval: 1,
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            interval: 0,
            color: '#AAD1FB'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(95,153,255,0.3)',
              type: 'dashed',
            }
          }
        },
        yAxis: {
          type: 'category',
          data: yValue,
          axisLabel: {
            show: true,
            color: '#AAD1FB',
            formatter: function (params) {
              let newParamsName = '';
              params = params.length <= 6 ? params : params.substring(0, 4) + '...';
              let paramsNameNumber = params.length;
              let provideNumber = 7;
              let rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                for (let p = 0; p < rowNumber; p++) {
                  let tempStr = '';
                  let start = p * provideNumber;
                  let end = start + provideNumber;
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    tempStr = params.substring(start, end) + '\n';
                  }

                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName;
            },
          },
          axisLine: {
            show: yValue.length > 0 ? true : false,
            lineStyle: {
              color: '#AAD1FB'
            },
          },
        },
        series: [{
          name: '告警总数',
          type: 'bar',
          barWidth: '60%',
          data: seriesValue,
          itemStyle: {
            normal: {
              color: '#AAD1FB'
            }
          },
          label: {
            show: true,
            position: 'right',
            textStyle: {
              color: '#AAD1FB',
              fontSize: '14px',
            },
          }
        }],
      })
    },
    initchartTopLeftGJCSFBFromCity() {
      let xValue = [];
      let yValue = [];

      if (this.screenInfo.top_left_btn4_city_detial) {
        this.screenInfo.top_left_btn4_city_detial.forEach(item => {
          xValue.push(item.warningType);
          yValue.push(item.count);
        })
      }

      let d_tl_Chart = this.$echarts.init(document.getElementById('d_tl_Chart'));
      d_tl_Chart.clear();
      d_tl_Chart.setOption({
        title: {
          text: '告警数按城市分布情况统计',
          left: 'center',
          textStyle: {
            fontSize: 14,
          }
        },
        grid: {
          top: '40%',
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        dataZoom: [{
          type: 'slider',
          startValue: 0,
          endValue: 5,
          show: xValue.length > 6 ? true : false,
          xAxisIndex: [0],
          handleSize: 0,
          height: 12,
          left: '5%',
          right: '5%',
          bottom: 12,
          borderColor: '#AAD1FB',
          fillerColor: '#AAD1FB',
          backgroundColor: '#eee',
          showDataShadow: false,
          showDetail: false,
          realtime: true,
          filterMode: 'filter',
          handleStyle: {
            borderRadius: '20'
          }
        }],
        tooltip: {
          show: true,
          trigger: 'axis',
          transitionDuration: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        xAxis: {
          type: 'category',
          data: xValue,
          nameTextStyle: {
            color: '#333333',
            fontSize: '12px',
            align: 'right'
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333333',
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#AAD1FB',
              fontSize: '14px',
            }
          },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333333',
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#AAD1FB',
              fontSize: '14px',
            }
          },
        },
        legend: {
          show: true,
          left: 'center',
          top: '30%',
          textStyle: {
            color: '#AAD1FB',
            fontSize: '14px',
          },
          data: ['告警总数'],
        },
        series: [{
          name: '告警总数',
          data: yValue,
          stack: 'x',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            normal: {
              color: '#AAD1FB'
            }
          },
          label: {
            show: true,
            position: 'outside',
            textStyle: {
              color: '#AAD1FB',
              fontSize: '10px',
            },
            formatter: function (params) {
              if (params.data == 0) {
                return ''
              }
              return params.data;
            }
          }
        }],
      });
    },
    d_t_f_bn_click(type) {
      this.t_l_s_type = type;
      if (this.t_l_s_type == 'type_ydgjs') {
        //异动告警数
        this.initchartTopLeftYDGJS();

        this.topLeftLoading = true;
        //数据请求
        topLeftBtn1().then(res => {
          this.$set(this.screenInfo, 'top_left_btn1', res.data);
          this.initchartTopLeftYDGJS();
        }).finally(() => {
          this.topLeftLoading = false;
        })
      } else if (this.t_l_s_type == 'type_gjdjfb') {
        //告警级别分布
        this.initchartTopLeftGJJBFB();

        this.topLeftLoading = true;
        topLeftBtn2().then(res => {
          this.$set(this.screenInfo, 'top_left_btn2', res.data);
          this.initchartTopLeftGJJBFB();
        }).finally(() => {
          this.topLeftLoading = false;
        });
      } else if (this.t_l_s_type == 'type_gjlxfb') {
        //告警类型分布
        this.initchartTopLeftGJLXFB();

        this.topLeftLoading = true;
        topLeftBtn3().then(res => {
          this.$set(this.screenInfo, 'top_left_btn3', res.data);
          this.initchartTopLeftGJLXFB();
        }).finally(() => {
          this.topLeftLoading = false;
        });
      } else if (this.t_l_s_type == 'type_gjcsfb') {
        getAreaTree({code: '37'}).then(res => {
          if (res.data && res.data.length > 0) {
            if (res.data[0].children) {
              res.data[0].children.forEach(item => {
                item.choose = false;
              });
              this.$set(this.screenInfo, 'top_left_btn4_citys', res.data[0].children);
            }
          }
        })

        //告警城市分布
        this.initchartTopLeftGJCSFB();
        this.topLeftLoading = true;
        topLeftBtn4().then(res => {
          this.$set(this.screenInfo, 'top_left_btn4', res.data);
          this.initchartTopLeftGJCSFB();
        }).finally(() => {
          this.topLeftLoading = false;
        });
      }
    },

    initchartTopRightWQRGJ() {

      let hasLevelData = this.screenInfo.top_right_btn1 && this.screenInfo.top_right_btn1.levelList;
      let hasTypeData = this.screenInfo.top_right_btn1 && this.screenInfo.top_right_btn1.typeList;

      let valueTZ = 0;
      let valueYJ = 0;
      let valueJX = 0;
      let valueIPMAC = 0;
      let valueNew = 0;

      if (hasTypeData) {
        this.screenInfo.top_right_btn1.typeList.forEach((item, index) => {
          if (item.warningType == '台账监控异常' || item.warningType == '台账设备') {
            valueTZ += item.count;
          } else if (item.warningType == '硬件变化') {
            valueYJ += item.count;
          } else if (item.warningType == '基线异常') {
            valueJX += item.count;
          } else if (item.warningType == 'IP/MAC变更') {
            valueIPMAC += item.count;
          } else if (item.warningType == '新发现设备') {
            valueNew += item.count;
          }
        })
      }

      let serData = [];
      if (valueTZ > 0) {
        serData.push({value: valueTZ, name: `台账异常`});
      }
      if (valueYJ > 0) {
        serData.push({value: valueYJ, name: `硬件变化`});
      }
      if (valueJX > 0) {
        serData.push({value: valueJX, name: `基线异常`});
      }
      if (valueIPMAC > 0) {
        serData.push({value: valueIPMAC, name: `IP/MAC变化`});
      }
      if (valueNew > 0) {
        serData.push({value: valueNew, name: `新发现`});
      }

      let d_tr_Chart = this.$echarts.init(document.getElementById('d_tr_Chart'));
      d_tr_Chart.clear();
      d_tr_Chart.setOption({
        title: {
          text: '未确认告警分布统计',
          right: '6%',
          top: '46%',
          textStyle: {
            fontSize: 14,
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          transitionDuration: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        legend: {
          show: true,
          left: '10%',
          top: 'center',
          orient: 'vertical',
          data: hasLevelData ? this.screenInfo.top_right_btn1.levelList.map(item => {
            return {
              name: item.warningLevel,
              textStyle: {
                color: '#333333',
                fontWeight: 'bold'
              },
            }
          }) : [],
        },
        series: [{
          name: '',
          type: 'pie',
          radius: '39%',
          hoverAnimation: false,
          data: hasLevelData ? this.screenInfo.top_right_btn1.levelList.map(item => {
            return {
              value: item.count,
              name: item.warningLevel,
              label: {
                show: true,
                position: 'inside',
                textStyle: {
                  fontSize: 11,
                  color: '#ffffff'
                }
              },
            }
          }) : [],
          itemStyle: {
            color: function (colors) {
              let colorList = ['#86C9D0', '#79B77D', '#739FF0'];
              return colorList[colors.dataIndex];
            },
          },
        }, {
          name: '',
          type: 'pie',
          radius: ['40%', '80%'],
          avoidLabelOverlap: false,
          hoverAnimation: true,
          data: serData.map(item => {
            return {
              ...item,
              label: {show: true, position: 'inside', textStyle: {fontSize: 10, color: '#ffffff'}}
            }
          }),
          itemStyle: {
            color: function (colors) {
              let colorList = ['#86C9D0', '#79B77D', '#739FF0'];
              let dIndex = colors.dataIndex;
              if (dIndex == 0) {
                return colorList[0];
              } else if (dIndex == 1 || dIndex == 2) {
                return colorList[1];
              } else {
                return colorList[2];
              }
            },
          },
        }],
      });
    },
    initchartTopRightYHLGJ1() {

      let hasTypeData = this.screenInfo.top_right_btn2 && this.screenInfo.top_right_btn2.typeList;

      let valueTZ = 0;
      let valueYJ = 0;
      let valueJX = 0;
      let valueIPMAC = 0;
      let valueNew = 0;

      if (hasTypeData) {
        this.screenInfo.top_right_btn2.typeList.forEach((item, index) => {
          if (item.warningType == '台账监控异常' || item.warningType == '台账设备') {
            valueTZ += item.count;
          } else if (item.warningType == '基线异常') {
            valueJX += item.count;
          } else if (item.warningType == '硬件变化') {
            valueYJ += item.count;
          } else if (item.warningType == 'IP/MAC变更') {
            valueIPMAC += item.count;
          } else if (item.warningType == '新发现设备') {
            valueNew += item.count;
          }
        });

        if (valueTZ > 10) {
          valueTZ = 10;
        }
        if (valueJX > 10) {
          valueJX = 10;
        }
        if (valueYJ > 10) {
          valueYJ = 10;
        }
        if (valueIPMAC > 10) {
          valueIPMAC = 10;
        }
        if (valueNew > 10) {
          valueNew = 10;
        }
      }

      let d_tr_ld_Chart = this.$echarts.init(document.getElementById("d_tr_ld_Chart"));
      d_tr_ld_Chart.clear();
      d_tr_ld_Chart.setOption({
        title: {
          text: '已忽略告警类型分布',
          left: 'center',
          top: '3%',
          textStyle: {
            fontSize: 14,
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          transitionDuration: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          },
          formatter: (params) => {
            let countNew = 0;
            let countIPMAC = 0;
            let countYJ = 0;
            let countJX = 0;
            let countTZ = 0;
            if (hasTypeData) {
              this.screenInfo.top_right_btn2.typeList.forEach((item, index) => {
                if (item.warningType == '新发现设备') {
                  countNew += item.count;
                } else if (item.warningType == 'IP/MAC变更') {
                  countIPMAC += item.count;
                } else if (item.warningType == '硬件变化') {
                  countYJ += item.count;
                } else if (item.warningType == '基线异常') {
                  countJX += item.count;
                } else if (item.warningType == '台账监控异常' || item.warningType == '台账设备') {
                  countTZ += item.count;
                }
              });
            }

            return `设备配置表：</br>
                    新发现设备：${countNew}</br>
                    IP/MAC变更：${countIPMAC}</br>
                    硬件变化：${countYJ}</br>
                    基线异常：${countJX}</br>
                    台账异常：${countTZ}</br>`;
          }
        },

        radar: {
          shape: "polygon",
          radius: "50%",
          center: ['50%', '50%'],
          splitNumber: 5,
          clockwise: true,
          indicator: [
            {name: '新发现设备', max: 10},
            {name: '台账异常', max: 10},
            {name: '基线异常', max: 10},
            {name: '硬件变化', max: 10},
            {name: 'IP/MAC变更', max: 10},
          ],
          nameGap: 10,
          name: {
            textStyle: {
              color: "#333",
              fontSize: 10,
            },
          },
          splitLine: {
            lineStyle: {
              color: '#606266',
              width: 0.2,
            },
          },
          axisLine: {
            show: false,
          },
          splitArea: {
            show: false,
          },
        },
        legend: {
          show: true,
          top: '15%',
          left: '5%',
          data: [{
            name: '已忽略告警',
            textStyle: {
              color: '#1673FF',
              fontWeight: 'bold'
            },
          }],
        },
        series: [
          {
            name: '已忽略告警',
            type: "radar",
            data: [
              {
                value: [valueNew, valueTZ, valueJX, valueYJ, valueIPMAC],
                name: '设备配置表',
                symbol: 'circle',
                symbolSize: 7,
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
      });
    },
    initchartTopRightYHLGJ2() {

      let hasLevelData = this.screenInfo.top_right_btn2 && this.screenInfo.top_right_btn2.levelList;

      let d_tr_pie_Chart = this.$echarts.init(document.getElementById('d_tr_pie_Chart'));
      d_tr_pie_Chart.clear();
      d_tr_pie_Chart.setOption({
        title: {
          text: '已忽略告警级别分布',
          left: 'center',
          top: '3%',
          textStyle: {
            fontSize: 14,
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          transitionDuration: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        series: [{
          name: '',
          type: 'pie',
          radius: ['30%', '50%'],
          hoverAnimation: true,
          labelLine: {
            show: true,
            length: 10,
            length2: 15,
          },
          data: hasLevelData ? this.screenInfo.top_right_btn2.levelList.map(item => {
            return {
              value: item.count,
              name: `${item.warningLevel}\n${item.count}`,
              label: {
                show: true,
                position: 'outside'
              },
            }
          }) : [],
          itemStyle: {
            color: function (colors) {
              let colorList = ['#6DC8E1', '#4EB2D4', '#3F95C2'];
              return colorList[colors.dataIndex];
            },

          },
        }],
      });
    },
    initchartTopRightYQRDCZGJ() {
      //top_right_btn3

      //已分发
      let xValue = [];
      let yValue = [];

      if (this.screenInfo.top_right_btn3) {
        xValue = this.screenInfo.top_right_btn3.map(item => {
          return item.warningType;
        });

        yValue = this.screenInfo.top_right_btn3.map(item => {
          return item.count;
        });
      }

      let d_tr_Chart = this.$echarts.init(document.getElementById('d_tr_Chart'));
      d_tr_Chart.clear();
      d_tr_Chart.setOption({
        title: {
          text: '已确认待处置告警分布统计',
          left: 'center',
          textStyle: {
            fontSize: 14,
          }
        },
        grid: {
          top: '25%',
          right: '3%',
          left: '6%',
          bottom: xValue && xValue.length > 6 ? '17%' : '12%'
        },
        dataZoom: [{
          type: 'slider',
          startValue: 0,
          endValue: 5,
          show: xValue.length > 6 ? true : false,
          xAxisIndex: [0],
          handleSize: 0,
          height: 12,
          right: '3%',
          left: '3%',
          bottom: 12,
          borderColor: '#8BB6FB',
          fillerColor: '#327EF7',
          backgroundColor: '#eee',
          showDataShadow: false,
          showDetail: false,
          realtime: true,
          filterMode: 'filter',
          handleStyle: {
            borderRadius: '20'
          }
        }, {
          type: 'inside',
          xAxisIndex: [0],
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: false,
        }],
        tooltip: {
          show: true,
          trigger: 'axis',
          transitionDuration: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        xAxis: {
          type: 'category',
          data: xValue,
          nameTextStyle: {
            color: '#333333',
            fontSize: '12px',
            align: 'right'
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333333',
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#888888',
              fontSize: 12,
            }
          },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          nameTextStyle: {
            color: '#333333',
            fontSize: '14px',
            align: 'right'
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333333',
            }
          },
        },
        legend: {
          show: true,
          top: '10%',
          data: [{
            name: '已确认待处置',
            textStyle: {
              color: '#68BBC4',
              fontWeight: 'bold'
            }
          }],
          orient: 'horizontal',
        },
        series: [{
          name: '已确认待处置',
          data: yValue,
          stack: 'x',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            normal: {
              color: '#68BBC4'
            }
          },
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#72CDD7',
              fontSize: 12,
            },
            formatter: function (params) {
              if (params.data == 0) {
                return ''
              }
              return params.data;
            }
          }
        },],
      });
    },
    d_t_r_bn_click(type) {
      let el_tr_Chart = document.getElementById("d_tr_Chart");
      let el_tr_ld_Chart = document.getElementById("d_tr_ld_Chart");
      let el_tr_pie_Chart = document.getElementById("d_tr_pie_Chart");
      if (el_tr_Chart) {
        this.$echarts.init(el_tr_Chart).dispose();
      }
      if (el_tr_ld_Chart) {
        this.$echarts.init(el_tr_ld_Chart).dispose();
      }
      if (el_tr_pie_Chart) {
        this.$echarts.init(el_tr_pie_Chart).dispose();
      }

      this.t_r_s_type = type;

      this.$nextTick(() => {
        if (this.t_r_s_type == 'type_wqrgj') {
          // 未确认告警
          this.initchartTopRightWQRGJ();

          this.topRightLoading = true;
          topRightBtn1().then(res => {
            this.$set(this.screenInfo, 'top_right_btn1', res.data);
            this.initchartTopRightWQRGJ();
          }).finally(() => {
            this.topRightLoading = false;
          })
        } else if (this.t_r_s_type == 'type_yhlgj') {
          // 已忽略告警
          this.initchartTopRightYHLGJ1();
          this.initchartTopRightYHLGJ2();

          this.topRightLoading = true;
          topRightBtn2().then(res => {
            this.$set(this.screenInfo, 'top_right_btn2', res.data);

            this.initchartTopRightYHLGJ1();
            this.initchartTopRightYHLGJ2();
          }).finally(() => {
            this.topRightLoading = false;
          })
        }
        if (this.t_r_s_type == 'type_yqrdczgj') {
          // 已确认待处置告警
          this.initchartTopRightYQRDCZGJ();

          this.topRightLoading = true;
          topRightBtn3().then(res => {
            this.$set(this.screenInfo, 'top_right_btn3', res.data);
            this.initchartTopRightYQRDCZGJ();
          }).finally(() => {
            this.topRightLoading = false;
          })
        }
      })
    },


    initchartDownLeftChart1() {
      let xValue = [];
      let yValue = [];

      if (this.screenInfo.down_left) {
        for (const xValueKey in this.screenInfo.down_left) {
          if (xValueKey) {
            xValue.push(xValueKey);
            let item = this.screenInfo.down_left[xValueKey];
            if (item && item.length > 0) {
              yValue.push(item[0].warningSchedule);
            } else {
              yValue.push(1);
            }
          }
        }
      }


      let d_d_leftChart1 = this.$echarts.init(document.getElementById('d_d_leftChart1'));
      d_d_leftChart1.clear();
      d_d_leftChart1.setOption({
        grid: {
          right: '3%',
          left: '6%',
          containLabel: true
        },
        dataZoom: [{
          type: 'slider',
          startValue: 0,
          endValue: 20,
          show: xValue.length > 21 ? true : false,
          xAxisIndex: [0],
          handleSize: 0,
          height: 12,
          left: '5%',
          right: '5%',
          bottom: 12,
          borderColor: '#8BB6FB',
          fillerColor: '#327EF7',
          backgroundColor: '#eee',
          showDataShadow: false,
          showDetail: false,
          realtime: true,
          filterMode: 'filter',
          handleStyle: {
            borderRadius: '20'
          }
        }],
        tooltip: {
          show: true,
          trigger: 'axis',
          transitionDuration: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        xAxis: {
          type: 'category',
          position: 'top',
          data: xValue,
          nameTextStyle: {
            color: '#333333',
            fontSize: '12px',
            align: 'right'
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#e1e1e1',
            }
          },
          axisLabel: {
            show: false,
            interval: 0,
            rotate: 0,
            maigin: 2,
            textStyle: {
              color: '#5087EC',
            },
          },
        },
        yAxis: {
          name: '数量',
          type: 'value',
          show: false,
          inverse: true,
          position: 'left',
          minInterval: 1,
          nameTextStyle: {
            color: '#333333',
            fontSize: '14px',
            align: 'right'
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#e1e1e1',
            }
          },
          axisLabel: {
            show: false,
            interval: 0,
            rotate: 0,
            maigin: 2,
            textStyle: {
              color: '#5087EC',
            },
          },
        },
        legend: {
          show: true,
          top: '-4%',
          data: [{
            name: '紧急告警占比',
            textStyle: {
              color: '#333333',
            }
          },],
          orient: 'horizontal',
        },
        series: [{
          name: '紧急告警占比',
          data: yValue,
          stack: 'x',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            normal: {
              color: '#68BBC4'
            }
          },
          label: {
            show: true,
            position: 'bottom',
            textStyle: {
              color: '#333333',
              fontSize: '10px',
            },
            formatter: function (params) {
              if (params.data == 0) {
                return ''
              }
              return `${params.data}%`;
            }
          }
        }],
      });
    },
    initchartDownLeftChart2() {
      let xValue = [];

      let yValue1 = [];
      let yValue2 = [];
      let yValue3 = [];
      let yValue4 = [];
      let yValue5 = [];


      if (this.screenInfo.down_left) {
        for (const xValueKey in this.screenInfo.down_left) {
          if (xValueKey) {
            xValue.push(xValueKey);
            let item = this.screenInfo.down_left[xValueKey];
            if (item && item.length > 0) {
              let fItem1 = item.find(a => a.warningType == '台账异常');
              let fItem2 = item.find(a => a.warningType == '基线异常');
              let fItem3 = item.find(a => a.warningType == '硬件变化');
              let fItem4 = item.find(a => a.warningType == 'IP/MAC变更');
              let fItem5 = item.find(a => a.warningType == '新发现设备');

              yValue1.push(fItem1 ? fItem1.count : 0);
              yValue2.push(fItem2 ? fItem2.count : 0);
              yValue3.push(fItem3 ? fItem3.count : 0);
              yValue4.push(fItem4 ? fItem4.count : 0);
              yValue5.push(fItem5 ? fItem5.count : 0);
            } else {
              yValue1.push(0);
              yValue2.push(0);
              yValue3.push(0);
              yValue4.push(0);
              yValue5.push(0);
            }
          }
        }
      }


      // for (let i = 0; i < 17; i++) {
      //   xValue.push(`城市${i + 1}`);
      // }

      // for (let i = 0; i < 17; i++) {
      //   yValue1.push(parseInt(Math.random() * 60));
      //   yValue2.push(parseInt(Math.random() * 60));
      //   yValue3.push(parseInt(Math.random() * 60));
      //   yValue4.push(parseInt(Math.random() * 60));
      //   yValue5.push(parseInt(Math.random() * 60));
      // }

      let d_d_leftChart2 = this.$echarts.init(document.getElementById('d_d_leftChart2'));
      d_d_leftChart2.clear();
      d_d_leftChart2.setOption({
        grid: {
          top: '6%',
          right: '3%',
          left: '6%',
          bottom: '25%',
        },
        dataZoom: [{
          type: 'slider',
          startValue: 0,
          endValue: 20,
          show: xValue.length > 21 ? true : false,
          xAxisIndex: [0],
          handleSize: 0,
          height: 12,
          right: '3%',
          left: '3%',
          bottom: 12,
          borderColor: '#8BB6FB',
          fillerColor: '#327EF7',
          backgroundColor: '#eee',
          showDataShadow: false,
          showDetail: false,
          realtime: true,
          filterMode: 'filter',
          handleStyle: {
            borderRadius: '20'
          }
        }, {
          type: 'inside',
          xAxisIndex: [0],
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: false,
        }],
        tooltip: {
          show: true,
          trigger: 'axis',
          transitionDuration: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        xAxis: {
          type: 'category',
          data: xValue,
          nameTextStyle: {
            color: '#333333',
            fontSize: '12px',
            align: 'right'
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333333',
            }
          },
          axisLabel: {
            interval: 0,
            rotate: 0,
            maigin: 2,
            textStyle: {
              color: '#5087EC',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333333',
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#BBE5FF',
            },
          },
          axisLabel: {
            interval: 0,
            rotate: 0,
            maigin: 2,
            textStyle: {
              color: '#5087EC',
            },
          },
        },
        legend: {
          show: true,
          bottom: '2%',
          data: [{
            name: '台账异常',
            textStyle: {
              color: '#5087EC',
            }
          }, {
            name: '基线异常',
            textStyle: {
              color: '#68BBC4',
            }
          }, {
            name: '硬件变化',
            textStyle: {
              color: '#58A55C',
            }
          }, {
            name: 'IP/MAC变更',
            textStyle: {
              color: '#F2BD42',
            }
          }, {
            name: '新发现设备',
            textStyle: {
              color: '#EE752F',
            }
          }],
          orient: 'horizontal',
        },
        series: [{
          name: '台账异常',
          data: yValue1,
          stack: 'x',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            normal: {
              color: '#5087EC'
            }
          },
          label: {
            show: false,
            position: 'inside',
            textStyle: {
              color: '#333333',
              fontSize: '10px',
            },
            formatter: function (params) {
              if (params.data == 0) {
                return ''
              }
              return params.data;
            }
          }
        }, {
          name: '基线异常',
          data: yValue2,
          stack: 'x',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            normal: {
              color: '#68BBC4'
            }
          },
          label: {
            show: false,
            position: 'inside',
            textStyle: {
              color: '#333333',
              fontSize: '10px',
            },
            formatter: function (params) {
              if (params.data == 0) {
                return ''
              }
              return params.data;
            }
          }
        }, {
          name: '硬件变化',
          data: yValue3,
          stack: 'x',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            normal: {
              color: '#58A55C'
            }
          },
          label: {
            show: false,
            position: 'inside',
            textStyle: {
              color: '#333333',
              fontSize: '10px',
            },
            formatter: function (params) {
              if (params.data == 0) {
                return ''
              }
              return params.data;
            }
          }
        }, {
          name: 'IP/MAC变更',
          data: yValue4,
          stack: 'x',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            normal: {
              color: '#F2BD42'
            }
          },
          label: {
            show: false,
            position: 'inside',
            textStyle: {
              color: '#333333',
              fontSize: '10px',
            },
            formatter: function (params) {
              if (params.data == 0) {
                return ''
              }
              return params.data;
            }
          }
        }, {
          name: '新发现设备',
          data: yValue5,
          stack: 'x',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            normal: {
              color: '#EE752F'
            }
          },
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#333333',
              fontSize: '10px',
            },
            formatter: function (params) {
              return yValue1[params.dataIndex] + yValue2[params.dataIndex] + yValue3[params.dataIndex] + yValue4[params.dataIndex] + yValue5[params.dataIndex];
            }
          }
        },],
      });
    },

    initchartDownRightPie() {
      //未确认告警
      let noConfirmCount = 0;
      //已处置告警
      let disposeCount = 0;
      //未处置告警
      let noDisposeCount = 0;
      //已忽略告警
      let ignoreCount = 0;


      if (this.screenInfo.down_right_day) {
        noConfirmCount = this.screenInfo.down_right_day.ignoreCount;
        disposeCount = this.screenInfo.down_right_day.disposeCount;
        noDisposeCount = this.screenInfo.down_right_day.noDisposeCount;
        ignoreCount = this.screenInfo.down_right_day.ignoreCount;
      }


      // if (this.screenInfo.btm_right) {
      //   value1 = this.screenInfo.btm_right.isItAi.number;
      //   value2 = this.screenInfo.btm_right.notItAi.number;
      //
      //
      //   value1Per = Math.floor(this.screenInfo.btm_right.isItAi.proportion * 100);
      //   value2Per = Math.floor(this.screenInfo.btm_right.notItAi.proportion * 100);
      // }

      let d_br_pieChart = this.$echarts.init(document.getElementById('d_br_pieChart'));
      d_br_pieChart.clear();
      d_br_pieChart.setOption({
        tooltip: {
          show: true,
          trigger: 'item',
          transitionDuration: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        legend: {
          show: true,
          orient: 'vertical',
          right: '5%',
          top: 'center'
        },
        series: [{
          name: '',
          type: 'pie',
          radius: ['38%'],
          center: ['40%', '48%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: false,
            }
          },
          data: [{
            value: 100,
            label: {
              normal: {
                show: false,
              }
            },
          }],
          itemStyle: {
            color: function (colors) {
              let colorList = ['#f5f5f5'];
              return colorList[colors.dataIndex];
            },
          },
        }, {
          name: '',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '48%'],
          avoidLabelOverlap: false,
          hoverAnimation: true,
          labelLine: {
            show: true,
            length: 10,
            length2: 15,
          },

          data: [{
            value: noConfirmCount,
            name: `未确认告警`,
            label: {
              show: true,
              position: 'outside'
            },

          }, {
            value: disposeCount,
            name: `已处置告警`,
            label: {
              show: true,
              position: 'outside'
            },

          }, {
            value: noDisposeCount,
            name: `未处置告警`,
            label: {
              show: true,
              position: 'outside'
            },
          }, {
            value: ignoreCount,
            name: `已忽略告警`,
            label: {
              show: true,
              position: 'outside'
            },
          }],
          itemStyle: {
            color: function (colors) {
              let colorList = ['#5087EC', '#68BBC4', '#58A55C', '#F2BD42'];
              return colorList[colors.dataIndex];
            },
          },
        }],
      });

      // d_tl_Chart.dispatchAction({
      //   type: 'highlight',
      //   seriesIndex: 0,
      //   dataIndex: 0
      // });

    },
    stepIconClick(item) {
      this.screenInfo.top_left_btn4_citys.forEach((item, index) => {
        item.choose = false;
      })
      item.choose = true;

      this.topLeftLoading = true;
      topLeftBtn3(item.cityCode).then(res => {
        this.$set(this.screenInfo, 'top_left_btn4_city_detial', res.data);
        this.initchartTopLeftGJCSFBFromCity();
      }).finally(() => {
        this.topLeftLoading = false;
      });
    },
    isNoData(list) {
      if (list && list.length == 0) {
        return true;
      }
      return false;
    },
    getTimeClass(type) {
      if (type == 'type_gjdjfb' || type == 'type_wqrgj' || type == 'type_yhlgj') {
        //告警级别分布
        return 'd_time1';
      } else if (type == 'type_gjlxfb' || type == 'type_gjcsfb' || type == 'type_yqrdczgj') {
        //告警类型分布
        return 'd_time2';
      }
      return '';
    },
    getFormatDay(value) {
      if (value) {
        let arrs = value.split('-');
        if (arrs && arrs.length == 3) {
          return `${arrs[1]} / ${arrs[2]}`;
        } else {
          return value
        }
      }
      return '';
    },
    setValue(screenInfo, key, data) {
      this.$set(screenInfo, key, data);
    },
    c(countObj, key) {
      if (countObj) {
        if (countObj[key]) {
          return countObj[key];
        }
      }
      return 0;
    },
  },
}
</script>
<style scoped lang="scss">
.d_root {
  height: 94%;
  width: 100%;
  padding: 0px 12px 12px 12px;
}

.d_top {
  height: 50%;

  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.d_bottom {
  height: 50%;

  display: flex;
  align-items: flex-start;
  flex-direction: row;
}

.d_t_c1 {
  height: 100%;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 6px;

  display: flex;
  align-items: flex-start;
  flex-direction: row;
}

.d_b_c1 {
  height: 100%;
  background-color: #FFFFFF;
  border-radius: 8px;

  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.d_b_c0 {
  width: 70%;
  margin: 0px 3px 0px 0px;
}

.d_b_c2 {
  width: 30%;
  margin: 0px 0px 0px 3px;
}

.d_empty_vhcenter {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.d_empty_vhcenter span {
  font-size: 14px;
  color: #555555;
}

.d_100 {
  width: 100%;
}

.d_t_left {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin: 0px 3px 0px 0px;
}

.d_t_right {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin: 0px 0px 0px 3px;
}

.d_p1 {
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  font-size: 14px;
}

.d_p2 {
  height: calc(100% - 36px);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.d_p3 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 30%;
}

.s_line {
  width: 3px;
  background-color: #1F7CDC;
  height: 40%;
  margin: 2px 4px 0px 12px;
}

.d_img {
  width: 25px;
  height: 25px;
  margin-right: 6px;
}

.v_center {
  display: flex;
  align-items: center;
}

.h_center {
  display: flex;
  justify-content: center;
}

.vh_center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.d_sa {
  display: flex;
  justify-content: space-around;
}

.s_num {
  font-weight: bold;
  font-size: 20px;
}

.s_label {
  font-size: 14px;
}

.s_label2 {
  font-size: 12px;
  color: #777777
}

.d_jd {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.d_jd2 {
  position: absolute;
  left: 40%;
  top: 48%;
  transform: translate(-50%, calc(-50% + 18px));
  text-align: center;
}

.d_jd3 {
  position: absolute;
  right: 4%;
  bottom: 4%;
  text-align: right;
}

.d_jd3 span {
  font-size: 12px;
}

.s_jd {
  font-size: 1.6em;
  font-weight: bold;
  color: #68BCCA;
}

.s_label3 {
  font-size: 0.8em;
  color: #68BCCA;
}

.d_zxtpad {
  padding: 12px 12px 0px 12px;
}

.d_zxt {
  width: 80%;
  height: 100%;
}

.d_sb {
  display: flex;
  justify-content: space-between;
}

.d_start {
  display: flex;
  justify-content: flex-start;
}

.d_bns {
  margin: 12px 12px 0px 12px;
}

.d_bns button {
  font-size: 12px;
  padding: 6px;
  height: auto;
  width: auto;
}

.d_lp {
  height: calc(100% - 36px);
}

.d_dw_chart {
  height: calc(100% - 50px);
}

.d_yj_chart {
  height: 100%;
}

.d_v1 {
  width: 45%;
}

.d_v2 {
  width: 55%;
}

.s_ls {
  color: #3F7FF4;
  font-size: 14px;
  font-weight: bold;
  margin: 0px 6px 0px 6px;
}

.d_p12 {
  padding: 12px;
}

.d_p8 {
  padding: 8px 12px 8px 12px;
}

.d_t {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  padding: 6px 12px 6px 12px;
}

.d_t1 {
  background-color: #C8FBE5;
}

.d_t2 {
  background-color: #ECF2FF;
}

.s_weight {
  font-weight: bold;
}

.s_l2 {
  font-size: 13px;
  color: #333333;
}

.d_c1_czxt {
  height: 40px;
}

.d_c1_czxt2 {
  height: 100%;
  width: 94%;
  border-radius: 8px;
  background-color: #C6FDE5;
  position: relative;
}

.d_c1 {
  background-color: #F3FFFC;
  height: calc(100% - 33px);
  overflow-y: auto;
  position: relative;
}

.d_c2 {
  background-color: #F6FDFF;
  height: calc(100%);
  overflow-y: auto;
  position: relative;
}

.d_hArm {
  height: 55%;
}

.d_h80 {
  height: 80%;
}

.d_h100 {
  height: 100%;
}

.d_w40 {
  width: 43%;
}

.s_label4 {
  color: #0E8B8D;
  font-weight: bold;
  font-size: 1.5em;
}

.s_label5 {
  font-size: 12px;
  color: #68BCC4;
  display: block;
}

.s_c1 {
  color: #038DFD;
}

.s_c2 {
  color: #3DCBC7;
}

.d_refresh {
  margin: 4px 12px 0px 12px;
}

.d_refresh button {
  height: 25px;
  padding: 0px 12px 0px 12px;
}

.d_l_img {
  width: 20%;
}

.d_s1 {
  color: #587FF4;
  font-weight: bold;
  font-size: 14px;
}

.d_p_im {
  display: flex;
  justify-content: space-around;
  flex-flow: column;
  width: 100%;
  height: 100%;
}

.d_pitem {
  display: flex;
  justify-content: space-around;
}

.d_llk {
  font-weight: bold;
  width: 20%;
  padding: 5% 0px 5% 0px;
  border-radius: 4px;
  font-size: 18px;
}

.d_l1 {
  background-color: #D9FDED;
  color: #68BCC4;
}

.d_l2 {
  background-color: #D6E7FF;
  color: #3F7FF4;
}

.d_l3 {
  background-color: #F3F7FF;
  color: #3F7FF4;
}

.d_headerp {
  display: flex;
  justify-content: space-around;
}

.d_mhea {
  margin: 0px 22px 0px 22px;
}

.d_ffqk {
  display: flex;
  justify-content: space-around;
  flex-flow: column;
  width: 100%;
  height: calc(100% - 36px);
}

.d_ffqk_chart {
  width: 100%;
  height: calc(100% - 38px)
}

.d_h45 {
  height: 45%;
}

.d_h50 {
  height: 50%;
}

.d_ec2 {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100% - 36px);
}

.d_ec22 {
  width: 100%;
  height: calc(100% - 36px);
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.s_ntai {
  font-size: 14px;
}

.d_lasttime {
  font-size: 11px;
  color: #a1a1a1;
}

.d_position {
  position: relative;
}

.d_ltc {
  position: absolute;
  bottom: 3px;
  right: 12px;
}

.d_end {
  display: flex;
  justify-content: flex-end;
}

.s_bold {
  font-weight: bold;
}

.d_cio {
  position: absolute;
  right: 6px;
  top: 6px;
}

.d_tips {
  position: absolute;
  top: -10px;
  right: -10px;
}

.i_tips {
  width: 15px;
  height: 15px;
}

.d_t_bns {
  width: 100%;
  height: 15%;
  padding: 6px 0px 12px 0px;
  display: flex;
  justify-content: space-around;
}

.d_bn1_noclick {
  height: 100%;
  width: 20%;
  font-size: 15px;
  background-color: #EAF3FF;
  border: 1px solid #c7c7c7;
  border-radius: 6px;
  color: #777777;
}

.d_bn1 {
  height: 100%;
  width: 20%;
  font-size: 15px;
  cursor: pointer;
  background-color: #EAF3FF;
  border: 1px solid #69ACF7;
  border-radius: 6px;
  color: #777777;
}

.d_bn1:hover {
  background-color: #B4D5FB;
  transition: background-color 0.3s ease;
}

.d_bn1:not(:hover) {
  background-color: #EAF3FF;
  transition: background-color 0.3s ease;
}

.d_t_zx {
  height: calc(85% - 36px - 18px);
  width: 100%;
}

.d_t_nm {
  font-size: 20px;
  color: #69ACF8;
  font-weight: bold;
}

.dbn_sel {
  color: #FFFFFF;
  background-color: #69ACF7 !important;
  border: 1px solid #69ACF7;
  border-radius: 6px;
  font-weight: bold;
}

.d_t_nm_sel {
  font-size: 20px;
  color: #FFFFFF;
  font-weight: bold;
}

.d_time1 {
  position: absolute;
  font-size: 12px;
  color: #999999;
  bottom: 12px;
  right: 20px;
}

.d_time2 {
  position: absolute;
  font-size: 12px;
  color: #999999;
  top: 12px;
  right: 20px;
}

.d_city {
  position: absolute;
  width: 100%;
  color: #999999;
  top: 12%;

  /deep/ .el-step__icon-inner {
    display: none;
  }

  /deep/ .el-step__icon {
    width: 17px;
    height: 17px;
    background: #FFFFFF;
    //border: 1px solid #409EFF;
    border: 0px;
  }

  /deep/ .el-step__line {
    background-color: #409EFF;
    top: 8px;
  }

  /deep/ .el-step__title {
    line-height: 20px;
  }

  .d_step_icon_sel {
    width: 16px;
    height: 15px;
    background-color: #69ACF7;
    border-radius: 50%;
    border: 1px solid #69ACF7;
    transition: background-color 0.3s ease;
  }

  .d_step_icon_nosel {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid #69ACF7;
    cursor: pointer;
  }
}

.s_city {
  font-size: 12px;
  color: #409EFF;
  cursor: pointer;
}

.d_ldpie {
  display: flex;
  justify-content: flex-start;
}

.d_w50 {
  width: 50%;
  height: 100%;
}

.d_wh100 {
  width: 100%;
  height: 100%;
}

.d_b_r_d1 {
  width: 100%;
  height: 60%;
  margin-bottom: 3px;
  background-color: #FFFFFF;
  border-radius: 6px;
}

.d_b_r_d2 {
  width: 100%;
  height: 40%;
  margin-top: 3px;
  border-radius: 6px;

  display: flex;
  flex-flow: row;
  align-items: flex-start;
}

.d_bg_tran {
  background-color: transparent !important;
}

.d_b_r_b_left {
  background-color: #FFFFFF;
  height: 100%;
  width: 33%;
  margin-right: 3px;
  border-radius: 6px;
}

.d_b_r_b_right {
  background-color: #FFFFFF;
  height: 100%;
  width: 66%;
  margin-left: 3px;
  border-radius: 6px;
}

.s_mlt {
  color: #888888;
  font-size: 14px;
}

.s_color {
  font-size: 1.5em;
  font-weight: bold;
}

.s_color1 {
  color: #69ACF7;
}

.s_color2 {
  color: #5087EC;
}

.s_color3 {
  color: #68BBC4;
}

.s_color4 {
  color: #58A55C;
}

.s_color5 {
  color: #F2BD42;
}

.d_ldsx {
  border: 1px solid #68BBC4;
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  border-radius: 6px;
  background-color: #F5F7FE;
}

.d_bor1 {
  border-bottom: 1px solid #e7e7e7;
}

.d_bor2 {
  border-right: 1px solid #e7e7e7;
}

.d_h35 {
  height: 25%;
}

.d_h65 {
  height: 75%;
}
</style>
