<template>
  <div class="d_root" v-loading="pageLoading">
    <!--    数据概览-->
    <div class="d_top">
      <div class="d_t_c1">
        <div class="d_b_c1 d_t_left" v-loading="upLeftLoading">
          <div class="d_p1">
            <span class="s_line"></span>
            <span>信创设备数据概览</span>
          </div>

          <div class="d_p2" v-if="screenInfo.top_leftcenter">
            <div class="d_p_im">
              <div class="d_headerp">
                <div class="d_l_img"></div>
                <div class="d_s1 vh_center">
                  <img src="@/assets/itai/zl.png" class="d_img"/>
                  <span>总量</span>
                </div>
                <div class="d_s1 vh_center d_mhea">
                  <img src="@/assets/itai/tsj.png" class="d_img"/>
                  <span>台式机</span>
                </div>
                <div class="d_s1 vh_center">
                  <img src="@/assets/itai/bjb.png" class="d_img"/>
                  <span>笔记本</span>
                </div>
              </div>

              <div class="d_start d_pitem">
                <div class="d_l_img d_end vh_center">
                  <img src="@/assets/itai/sbs.png" class="d_img"/>
                  <div class="d_s1">
                    <div>
                      <span>设备数</span>
                    </div>
                    <!--                    <div class="vh_center">-->
                    <!--                      <span>(台)</span>-->
                    <!--                    </div>-->
                  </div>
                </div>

                <div class="d_l1 d_llk vh_center">
                  <span>{{ screenInfo.top_leftcenter.all.allNumber }}</span>
                  <span class="s_ntai">台</span>
                </div>
                <div class="d_l2 d_llk vh_center">
                  <span>{{ screenInfo.top_leftcenter.desktop.allNumber }}</span>
                  <span class="s_ntai">台</span>
                </div>
                <div class="d_l3 d_llk vh_center">
                  <span>{{ screenInfo.top_leftcenter.notebook.allNumber }}</span>
                  <span class="s_ntai">台</span>
                </div>
              </div>

              <div class="d_start d_pitem">
                <div class="d_l_img d_end vh_center">
                  <img src="@/assets/itai/zys.png" class="d_img"/>
                  <div class="d_s1">
                    <div>
                      <span>在运数</span>
                    </div>
                    <!--                    <div class="vh_center">-->
                    <!--                      <span>(台)</span>-->
                    <!--                    </div>-->
                  </div>
                </div>

                <div class="d_l1 d_llk vh_center">
                  <span>{{ screenInfo.top_leftcenter.all.inNumber }}</span>
                  <span class="s_ntai">台</span>
                </div>
                <div class="d_l2 d_llk vh_center">
                  <span>{{ screenInfo.top_leftcenter.desktop.inNumber }}</span>
                  <span class="s_ntai">台</span>
                </div>
                <div class="d_l3 d_llk vh_center">
                  <span>{{ screenInfo.top_leftcenter.notebook.inNumber }}</span>
                  <span class="s_ntai">台</span>
                </div>
              </div>

              <div class="d_start d_pitem">
                <div class="d_l_img d_end vh_center">
                  <img src="@/assets/itai/zxs.png" class="d_img"/>
                  <div class="d_s1 d_position">
                    <div>
                      <span>在线数</span>
                    </div>
                    <div class="d_tips" v-if="false">
                      <img src="@/assets/itai/tips.png" class="i_tips"/>
                    </div>
                    <!--                    <div class="vh_center">-->
                    <!--                      <span>(台)</span>-->
                    <!--                    </div>-->
                  </div>
                </div>

                <div class="d_l1 d_llk vh_center">
                  <span>{{ screenInfo.top_leftcenter.all.onNumber }}</span>
                  <span class="s_ntai">台</span>
                </div>
                <div class="d_l2 d_llk vh_center">
                  <span>{{ screenInfo.top_leftcenter.desktop.onNumber }}</span>
                  <span class="s_ntai">台</span>
                </div>
                <div class="d_l3 d_llk vh_center">
                  <span>{{ screenInfo.top_leftcenter.notebook.onNumber }}</span>
                  <span class="s_ntai">台</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d_b_c1 d_t_center" v-loading="upLeftLoading">
          <div class="d_p1">
            <span class="s_line"></span>
            <span>分发情况</span>
          </div>

          <div class="d_ffqk">
            <div class="d_h45">
              <div class="d_p12 vh_center">
                <img src="@/assets/itai/jt_left.png"/>
                <span class="s_ls">分发进度</span>
                <img src="@/assets/itai/jt_right.png"/>
              </div>

              <div class="vh_center" style="position: relative;">
                <el-progress type="dashboard"
                             :percentage="getProcess(screenInfo)"
                             :stroke-width="11 "
                             :width="130"
                             :show-text="false"
                             color="#1F7CDC">
                </el-progress>

                <div class="d_jd">
                  <div>
                    <span class="s_jd">{{ getProcess(screenInfo) }}%</span>
                  </div>
                  <div>
                    <span class="s_label3">在运 / 总量</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="d_h50">
              <div class="d_p12 vh_center">
                <img src="@/assets/itai/jt_left.png"/>
                <span class="s_ls">采购方式</span>
                <img src="@/assets/itai/jt_right.png"/>
              </div>

              <div id="d_ffqkChart" class="d_ffqk_chart"></div>
            </div>
          </div>
        </div>
        <div class="d_b_c1 d_t_right" v-loading="zxLoading">
          <!--          <div class="d_zxtpad vh_center d_100">-->
          <!--            <img src="@/assets/itai/jt_left.png"/>-->
          <!--            <span class="s_ls">7日内每日在线数量趋势</span>-->
          <!--            <img src="@/assets/itai/jt_right.png"/>-->
          <!--          </div>-->

          <div class="d_p1 d_position">
            <span class="s_line"></span>
            <span>在线情况统计</span>

            <div class="d_refresh" :class="[isProvince?'':'d_cio']" v-if="false">
              <el-button type="primary" plain size="mini" @click="initData">刷新</el-button>
            </div>
          </div>

          <div class="d_ec2">
            <!--            省公司柱状图-->
            <div class="d_zxt" style="position: relative">
              <div id="d_zxtChart" style="width: 100%;height: 100%"></div>

              <div v-if="isNoData(screenInfo.top_right)" class="d_empty_vhcenter">
                <span>暂无数据</span>
              </div>
            </div>

            <div style="width: 20%;margin-top: -30px;" v-if="cityList&&cityList.length>0">
              <city-show style="height: 100%" :list="cityList" @menuItemClick="menuItemClick"></city-show>
            </div>
          </div>
          <!--          <div v-else class="d_ec22 d_position">-->
          <!--            &lt;!&ndash;             市县公司折线图&ndash;&gt;-->
          <!--            <div class="d_zxtpad vh_center d_100">-->
          <!--              <img src="@/assets/itai/jt_left.png"/>-->
          <!--              <span class="s_ls">7日内每日在线设备数量</span>-->
          <!--              <img src="@/assets/itai/jt_right.png"/>-->
          <!--            </div>-->
          <!--            <div id="d_zxtChart" style="width: 100%;height: 100%"></div>-->

          <!--            <div v-if="isNoData(screenInfo.top_right)" class="d_empty_vhcenter">-->
          <!--              <span>暂无数据</span>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
    </div>

    <div class="d_bottom">
      <div class="d_b_c1 d_b_c0" v-loading="zztLoading">
        <div class="d_100 d_sb">
          <div class="d_p1">
            <span class="s_line"></span>
            <span>{{ getXlFromType(selectBtnType) }}</span>
          </div>
          <div v-if="isProvince" class="d_bns d_start v_center">
            <el-button :type="selectBtnType == 'type_ff'?'primary':''" size="mini" @click="typeClick('type_ff')">分发情况</el-button>
            <el-button :type="selectBtnType == 'type_zx'?'primary':''" size="mini" @click="typeClick('type_zx')">在线情况</el-button>
          </div>

          <div v-else class="d_bns d_start v_center">
            <el-button v-if="!isQuXian" :type="selectBtnType == 'type_gs'?'primary':''" size="mini" @click="typeClick('type_gs')">公司</el-button>
            <el-button :type="selectBtnType == 'type_bm' || isQuXian?'primary':''" size="mini" @click="typeClick('type_bm')">部门</el-button>
          </div>
        </div>
        <div id="d_dwChart" class="d_dw_chart d_100"></div>

        <div v-if="isNoData(selectBtnType == 'type_ff'? screenInfo.btm_leftff:screenInfo.btm_leftzx)" class="d_empty_vhcenter">
          <span>暂无数据</span>
        </div>

        <div class="d_ltc" v-if="screenInfo.btm_lefttime">
          <div class="d_lasttime">
            <span>最后同步时间：{{ this.screenInfo.btm_lefttime }}</span>
          </div>
        </div>
      </div>

      <div class="d_b_c1 d_b_c2" v-loading="x86Loading">
        <div class="d_p1">
          <span class="s_line"></span>
          <span>信创设备软硬件分布</span>
        </div>
        <div class="d_lp d_start d_100">
          <div class="d_v1">
            <div class="d_p12 vh_center">
              <img src="@/assets/itai/jt_left.png"/>
              <span class="s_ls">操作系统</span>
              <img src="@/assets/itai/jt_right.png"/>
            </div>

            <div class="d_c1_czxt vh_center">
              <div class="d_c1_czxt2 d_sa">
                <div v-if="screenInfo.os">
                  <div v-for="(item,index) in screenInfo.os" :key="item.name" class="vh_center">
                    <span class="s_label">{{ item.name }}({{ item.number }})</span>
                  </div>
                </div>

                <div v-if="isNoData(screenInfo.os)" class="d_empty_vhcenter">
                  <span>暂无数据</span>
                </div>
              </div>
            </div>


            <div class="d_p12 vh_center">
              <img src="@/assets/itai/jt_left.png"/>
              <span class="s_ls">芯片架构</span>
              <img src="@/assets/itai/jt_right.png"/>
            </div>
            <div class="d_sa d_hArm">
              <div class="d_w40 d_h100" v-if="screenInfo.arm">
                <div class="d_t d_t1 vh_center">
                  <span class="s_weight">{{ screenInfo.arm.name }}（{{ screenInfo.arm.number }}）</span>
                </div>
                <div class="d_c1">
                  <div v-for="(item,index) in screenInfo.arm.subOperatingList" :key="item.name" class="d_p8 vh_center">
                    <span class="s_l2">{{ item.name }}（{{ item.number }}）</span>
                  </div>

                  <div v-if="isNoData(screenInfo.arm.subOperatingList)" class="d_empty_vhcenter">
                    <span>暂无数据</span>
                  </div>
                </div>
              </div>

              <div class="d_w40 d_h100" v-if="screenInfo.x86">
                <div class="d_t d_t1 vh_center">
                  <span class="s_weight">{{ screenInfo.x86.name }}（{{ screenInfo.x86.number }}）</span>
                </div>
                <div class="d_c1">
                  <div v-for="(item,index) in screenInfo.x86.subOperatingList" :key="item.name" class="d_p8 vh_center">
                    <span class="s_l2">{{ item.name }}（{{ item.number }}）</span>
                  </div>

                  <div v-if="isNoData(screenInfo.x86.subOperatingList)" class="d_empty_vhcenter">
                    <span>暂无数据</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d_v2">
            <div class="d_p12 vh_center">
              <img src="@/assets/itai/jt_left.png"/>
              <span class="s_ls">品牌分布</span>
              <img src="@/assets/itai/jt_right.png"/>
            </div>

            <div class="d_h80">
              <div id="d_yjChart" class="d_yj_chart d_100"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="d_b_c1 d_b_c3" v-loading="downRightLoading">
        <div class="d_p1">
          <span class="s_line"></span>
          <span>信创设备替代进度</span>
        </div>
        <div id="d_yChart" class="d_lp d_100"></div>

        <div class="d_jd2" v-if="screenInfo.btm_right">
          <div>
            <span class="s_label4">{{ screenInfo.btm_right.all.number }}</span>
          </div>
          <div>
            <span class="s_label5">设备数量</span>
          </div>
        </div>
        <div class="d_jd3" v-if="screenInfo.btm_right">
          <div>
            <span class="s_c1 s_bold">信创占比：{{ Math.floor(screenInfo.btm_right.isItAi.proportion * 100) }}%</span>
          </div>
          <div>
            <span class="s_c2 s_bold">非信创占比：{{ Math.floor(screenInfo.btm_right.notItAi.proportion * 100) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  top_LeftCenter,
  top_Center,
  btm_LeftFF,
  btm_LeftZX,
  btm_LeftTime,
  top_RightCitys,
  top_RightChartProvince,
  top_RightChartShiXian,
  os,
  arm,
  x86,
  pinpai,
  btm_right,
} from "@/api/assets/itaiDevice";
import {mapGetters} from "vuex";
import CityShow from "@/views/assets/components/itaiDevice/components/cityShow.vue";

export default {
  name: "dataStatis",
  components: {CityShow},
  data() {
    return {
      pageLoading: false,
      screenInfo: {
        top_leftcenter: null,
        top_center: null,
        top_right: null,
        btm_leftff: null,
        btm_leftzx: null,
        btm_leftgs: null,
        btm_leftbm: null,
        btm_lefttime: null,
        btm_centerpp: null,

        os: null,
        arm: null,
        x86: null,

        btm_right: null,
      },
      selectBtnType: '',

      upLeftLoading: false,
      zxLoading: false,
      zztLoading: false,
      x86Loading: false,
      downRightLoading: false,

      cityList: [],

      isProvince: false,//是否是省公司
      isQuXian: false,
    };
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  watch: {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.screenInfo = {};

      this.isProvince = (this.userDetail.regionCode == '37');
      this.isQuXian = (this.userDetail.regionCode.length >= 6 ? true : false);
      if (this.isProvince) {
        this.selectBtnType = 'type_ff';
      } else if (this.isQuXian) {
        this.selectBtnType = 'type_bm';
      } else {
        this.selectBtnType = 'type_gs';
      }

      this.$nextTick(() => {
        this.requestScreenInfo();
      })
    },

    requestScreenInfo() {

      //先初始化，防止切换页面eChart图形错乱
      this.initChartTopRight();
      this.initChartBtmLeftFF();
      this.initChartBtmRight();
      this.initChartBtmCenterPP();
      this.initChartTopCenterCGFS();

      this.upLeftLoading = true;
      top_LeftCenter().then(res => {
        this.screenInfo.top_leftcenter = res.data;
      }).finally(() => {
        this.upLeftLoading = false;
      })

      top_Center().then(res => {
        this.screenInfo.top_center = res.data;
        this.initChartTopCenterCGFS();
      }).finally(() => {

      })

      this.zxLoading = true;
      top_RightCitys({regionCode: this.userDetail.regionCode}).then(res => {
        if (res.data) {
          res.data.forEach((item, index) => {
            item.isActive = index == 0 ? true : false;
          })

          this.cityList = res.data;

          if (this.cityList.length > 0) {
            top_RightChartProvince({regionCode: this.cityList[0].regionCode, regionName: this.cityList[0].name}).then(res => {
              this.screenInfo.top_right = res.data;

              this.initChartTopRight();
            }).finally(() => {
              this.zxLoading = false;
            });
          }
        }
      }).catch((err) => {
        this.zxLoading = false;
      })

      // if (this.isProvince) {
      //   this.zxLoading = true;
      //   top_RightCitys().then(res => {
      //     if (res.data) {
      //       res.data.forEach((item, index) => {
      //         item.isActive = index == 0 ? true : false;
      //       })
      //
      //       this.cityList = res.data;
      //
      //       if (this.cityList.length > 0) {
      //         top_RightChartProvince({regionCode: this.cityList[0].regionCode}).then(res => {
      //           this.screenInfo.top_right = res.data;
      //
      //           this.initChartTopRight();
      //         }).finally(() => {
      //           this.zxLoading = false;
      //         });
      //       }
      //     }
      //   }).catch((err) => {
      //     this.zxLoading = false;
      //   })
      // } else {
      //   this.zxLoading = true;
      //   top_RightChartShiXian().then(res => {
      //     this.screenInfo.top_right = res.data;
      //     this.initChartTopRight();
      //   }).finally(() => {
      //     this.zxLoading = false;
      //   })
      // }


      //默认请求分发情况接口
      this.zztLoading = true;
      btm_LeftFF({type: this.getBtnSelType()}).then(res => {
        if (this.isProvince) {
          this.screenInfo.btm_leftff = res.data;
        } else if (this.isQuXian) {
          this.screenInfo.btm_leftbm = res.data;
        } else {
          this.screenInfo.btm_leftgs = res.data;
        }
        this.initChartBtmLeftFF();

        //获取最后更新时间
        btm_LeftTime().then(res => {
          this.screenInfo.btm_lefttime = res.data.time;
        });
      }).finally(() => {
        this.zztLoading = false;
      })


      os().then(res => {
        this.screenInfo.os = res.data;
      }).finally(() => {

      })

      arm().then(res => {
        this.screenInfo.arm = res.data;
      }).finally(() => {

      })

      x86().then(res => {
        this.screenInfo.x86 = res.data;
      }).finally(() => {

      })
      this.x86Loading = true;
      pinpai().then(res => {
        this.screenInfo.btm_centerpp = res.data;
        this.initChartBtmCenterPP();
      }).finally(() => {
        this.x86Loading = false;
      })

      this.downRightLoading = true;
      btm_right().then(res => {
        this.screenInfo.btm_right = res.data;
        this.initChartBtmRight();
      }).finally(() => {
        this.downRightLoading = false;
      })
    },
    getBtnSelType() {
      let type = '';
      if (this.selectBtnType == 'type_ff' || this.selectBtnType == 'type_gs') {
        type = 'CORP';
      } else {
        type = 'DEPT';
      }
      return type;
    },
    menuItemClick(arg) {
      this.zxLoading = true;
      top_RightChartProvince({regionCode: arg.regionCode, regionName: arg.regionName}).then(res => {
        this.screenInfo.top_right = res.data;

        this.initChartTopRight();
      }).finally(() => {
        this.zxLoading = false;
      });
    },
    initChartTopRight() {
      let d_zxtChart = this.$echarts.init(document.getElementById('d_zxtChart'));
      let option = null;
      //if (this.isProvince) {
      if (true) {
        let yValue = [];
        let seriesValue = [];

        if (this.screenInfo.top_right) {
          this.screenInfo.top_right.forEach((item, index) => {
            yValue.push(item.name);
            seriesValue.push(item.number);
          })
        }
        option = {
          grid: {
            top: '3%',
            left: '7%',
            right: '5%',
            bottom: '5%',
            containLabel: true
          },
          dataZoom: [{
            type: 'slider',
            startValue: 0,
            endValue: 12,
            show: yValue.length > 13 ? true : false,
            yAxisIndex: [0],
            handleSize: 0,
            width: 8,
            height: '90%',
            zoomLock: true,
            left: '3%',
            top: '3%',
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
              color: '#5894FF'
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
              color: '#5894FF',
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
                color: '#5894FF'
              },
            },
          },
          series: [{
            name: '销量',
            type: 'bar',
            barWidth: '60%',
            data: seriesValue,
            itemStyle: {
              normal: {
                color: '#409EFF'
              }
            },
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: '#1F7CDC',
                fontSize: '14px',
              },
            }
          }],
        };
      } else {
        let xValue = [];
        let yValue = [];

        if (this.screenInfo.top_right
        ) {
          this.screenInfo.top_right.forEach((item, index) => {
            xValue.push(this.getFormatDay(item.name));
            yValue.push(item.number);
          });
        }

        option = {
          tooltip: {
            show: true,
            trigger: 'axis',
            transitionDuration: 0,
            backgroundColor: '#ffffff',
            textStyle: {
              color: '#333333'
            },
            extraCssText: 'box-shadow: 0 0 2px rgba(0,0,0,0.8);',
          },
          legend: {
            show: false,
            textStyle: {
              color: '#fff',
              fontSize: '14px'
            }
          },
          grid: {
            left: '5%',
            right: '5%',
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
                color: '#333333',
                fontSize: '14px',
              }
            },
          },
          yAxis: {
            type: 'value',
            name: '数量',
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
            minInterval: 1,
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
            axisLabel: {
              show: true,
              align: 'right',
              textStyle: {
                color: '#333333',
                fontSize: '14px',
              }
            },
          },
          series: [
            {
              name: '数量：',
              type: 'line',
              smooth: 'circle',
              smoothSize: '14px',
              itemStyle: {
                borderColor: '#01ecf2',
                color: '#01ECF2'
              },
              emphasis: {
                itemStyle: {
                  color: '#01ECF2',
                  borderColor: '#b08010',
                },
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {offset: 0, color: 'rgba(214, 245, 246, 1)'},
                  {offset: 0.5, color: 'rgba(214, 245, 246, 0.5)'},
                  {offset: 1, color: 'rgba(214, 245, 246, 0)'},
                ])
              },
              lineStyle: {
                color: '#01ecf2',
              },
              data: yValue,
            }
          ]
        };
      }
      d_zxtChart.setOption(option);
    },
    initChartBtmRight() {
      // 信创设备数量
      let value1 = 0;
      // 非信创设备数量
      let value2 = 0;

      let value1Per = 0;
      let value2Per = 0;

      if (this.screenInfo.btm_right) {
        value1 = this.screenInfo.btm_right.isItAi.number;
        value2 = this.screenInfo.btm_right.notItAi.number;


        value1Per = Math.floor(this.screenInfo.btm_right.isItAi.proportion * 100);
        value2Per = Math.floor(this.screenInfo.btm_right.notItAi.proportion * 100);
      }

      let d_yChart = this.$echarts.init(document.getElementById('d_yChart'));
      d_yChart.setOption({
        series: [{
          name: '内圆',
          type: 'pie',
          radius: ['25%'],
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
          name: '外圆',
          type: 'pie',
          radius: ['30%', '40%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          // labelLine: {
          //   show: true,
          //   length: 10,
          //   length2: 0,
          // },
          data: [{
            value: value1,
            name: `信创设备\n${value1}台\n${value1Per}%`,
          }, {
            value: value2,
            name: `非信创设备\n${value2}台\n${value2Per}%`,
          }],
          itemStyle: {
            color: function (colors) {
              let colorList = ['#038DFD', '#3DCBC7'];
              return colorList[colors.dataIndex];
            },
          },
        }],
      });
    },
    initChartBtmLeftFF() {
      //已分发
      let xValue = [];
      let yValue1 = [];
      let yValue2 = [];

      let array = [];
      if (this.selectBtnType == 'type_ff') {
        array = this.screenInfo.btm_leftff;
      } else if (this.selectBtnType == 'type_gs') {
        array = this.screenInfo.btm_leftgs;
      } else if (this.selectBtnType == 'type_bm') {
        array = this.screenInfo.btm_leftbm;
      }

      if (array) {
        array.forEach((item, index) => {
          xValue.push(item.unitName);
          yValue1.push(item.yesDistribution);
          yValue2.push(item.noDistribution);
        });
      }

      let d_dwChart = this.$echarts.init(document.getElementById('d_dwChart'));
      d_dwChart.setOption({
        grid: {
          right: '3%',
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
        },
        yAxis: {
          name: !this.isNoData(array) ? '数量' : '',
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
          data: [{
            name: '已分发',
            textStyle: {
              color: '#5087EC',
              fontWeight: 'bold'
            }
          }, {
            name: '待分发',
            textStyle: {
              color: '#68BBC4',
              fontWeight: 'bold'
            }
          }],

          orient: 'horizontal',
        },
        series: [{
          name: '已分发',
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
            show: true,
            position: 'inside',
            textStyle: {
              color: '#ffffff',
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
          name: '待分发',
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
            show: true,
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
        }],
      });
    },

    initChartBtmLeftZX() {
      //各单位在线情况
      let xValue = [];
      let yValue1 = [];
      let yValue2 = [];

      if (this.screenInfo.btm_leftzx) {
        this.screenInfo.btm_leftzx.forEach((item, index) => {
          xValue.push(item.name);
          yValue1.push(item.desktopNumber);
          yValue2.push(item.notebookNumber);
        });
      }

      let d_dwChart = this.$echarts.init(document.getElementById('d_dwChart'));
      d_dwChart.setOption({
        dataZoom: [{
          type: 'slider',
          startValue: 0,
          endValue: 5,
          show: xValue.length > 0 ? true : false,
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
        },
        yAxis: {
          name: !this.isNoData(this.screenInfo.btm_leftzx) ? '设备数量' : '',
          type: 'value',
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
          data: [{
            name: '台式机终端',
            textStyle: {
              color: '#5087EC',
              fontWeight: 'bold'
            }
          }, {
            name: '笔记本终端',
            textStyle: {
              color: '#68BBC4',
              fontWeight: 'bold'
            }
          }],
          orient: 'horizontal',
        },
        series: [{
          name: '台式机终端',
          data: yValue1,
          stack: 'x',
          smooth: 'circle',
          smoothSize: '14px',
          type: 'line',
          barWidth: '40%',
          itemStyle: {
            normal: {
              color: '#5087EC'
            }
          },
          label: {
            show: true,
            position: 'top',
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
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: 'rgba(88, 148, 255, 1)'},
              {offset: 0.5, color: 'rgba(88, 148, 255, 0.5)'},
              {offset: 1, color: 'rgba(88, 148, 255, 0)'},
            ])
          },
          lineStyle: {
            color: '#5894FF',
          },
        }, {
          name: '笔记本终端',
          data: yValue2,
          stack: 'x',
          smooth: 'circle',
          smoothSize: '14px',
          type: 'line',
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
              color: '#68BBC4',
              fontSize: '10px',
            },
            formatter: function (params) {
              if (params.data == 0) {
                return ''
              }
              return params.data;
            }
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: 'rgba(104, 186, 195, 1)'},
              {offset: 0.5, color: 'rgba(104, 186, 195, 0.5)'},
              {offset: 1, color: 'rgba(104, 186, 195, 0)'},
            ])
          },
          lineStyle: {
            color: '#68BAC3',
          },
        }],
      });
    },

    initChartBtmCenterPP() {
      let xValue = [];
      let yValue = [];

      if (this.screenInfo.btm_centerpp) {
        this.screenInfo.btm_centerpp.forEach((item, index) => {
          xValue.push(item.name);
          yValue.push(item.number);
        });
      }

      let d_yjChart = this.$echarts.init(document.getElementById('d_yjChart'));
      d_yjChart.setOption({
        grid: {
          top: '10%',
          right: '2%',
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
        },
        yAxis: {
          name: '数量',
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

    initChartTopCenterCGFS() {
      let data = [];
      if (this.screenInfo.top_center) {
        this.screenInfo.top_center.forEach((item, index) => {
          data.push({
            value: item.number,
            name: `${item.procureTypeCode}\n${item.number}，${Math.floor(item.proportion * 100)}%`,
          });
        });
      } else {
        data.push({
          value: 0,
          name: '国网采集\n0%',
        });
        data.push({
          value: 0,
          name: '单位自购\n0%',
        });
      }

      let d_ffqkChart = this.$echarts.init(document.getElementById('d_ffqkChart'));
      d_ffqkChart.setOption({
        calculable: false,
        series: [{
          name: '访问来源',
          type: 'pie',
          radius: '62%',
          data: data,
          // avoidLabelOverlap: false,
          // hoverAnimation: false,
          labelLine: {
            show: true,
            length: 10,
            length2: 5,
          },
          itemStyle: {
            normal: {
              color: function (colors) {
                let colorList = ["#5894FF", "#68BAC3"];
                return colorList[colors.dataIndex];
              },

            }
          },
        }],
      });
    },
    typeClick(type) {
      this.selectBtnType = type;
      if (this.isProvince) {
        if (this.selectBtnType == 'type_ff') {
          if (this.screenInfo.btm_leftff) {
            this.initChartBtmLeftFF();
          } else {
            //默认请求分发情况接口
            this.zztLoading = true;
            btm_LeftFF({type: this.getBtnSelType()}).then(res => {
              this.screenInfo.btm_leftff = res.data;
              this.initChartBtmLeftFF();
            }).finally(() => {
              this.zztLoading = false;
            })
          }
        } else {
          if (this.screenInfo.btm_leftzx) {
            this.initChartBtmLeftZX();
          } else {
            this.zztLoading = true;
            btm_LeftZX().then(res => {
              this.screenInfo.btm_leftzx = res.data;
              this.initChartBtmLeftZX();
            }).finally(() => {
              this.zztLoading = false;
            })
          }
        }
      } else {

        if (this.selectBtnType == 'type_gs') {
          if (this.screenInfo.btm_leftgs) {
            this.initChartBtmLeftFF();
          } else {
            this.zztLoading = true;
            btm_LeftFF({type: this.getBtnSelType()}).then(res => {
              this.screenInfo.btm_leftgs = res.data;
              this.initChartBtmLeftFF();
            }).finally(() => {
              this.zztLoading = false;
            })
          }
        } else if (this.selectBtnType == 'type_bm') {
          if (this.screenInfo.btm_leftbm) {
            this.initChartBtmLeftFF();
          } else {
            this.zztLoading = true;
            btm_LeftFF({type: this.getBtnSelType()}).then(res => {
              this.screenInfo.btm_leftbm = res.data;
              this.initChartBtmLeftFF();
            }).finally(() => {
              this.zztLoading = false;
            })
          }
        }
      }
    },
    getFormatDay(value) {
      if (value) {
        let arrs = value.split('-');
        if (arrs && arrs.length == 3) {
          return `${arrs[1]} - ${arrs[2]}`;
        } else {
          return value
        }
      }
      return '';
    },
    getnum(hasnum, allnum) {
      let num = ((hasnum / allnum) * 100).toString()
      var aNew;
      var re = /([0-9]+\.[0-9]{2})[0-9]*/;
      aNew = num.replace(re, "$1");
      return Number(aNew);
    },
    getProgressValue(num) {
      if (isNaN(num)) {
        return 0;
      }

      let ns = JSON.stringify(num);
      let nsArr = ns.split('.');
      if (nsArr && nsArr.length == 2) {
        let length = 0;
        for (let i = 0; i < nsArr[1].length; i++) {
          let c = nsArr[1][i];
          if (c > 0) {
            length = i + 2;
            break;
          }
        }
        ns = num.toFixed(length);
        ns = Number(Number(ns * 100).toFixed(length));
      }
      return ns;
    },
    getRegionCode(length) {
      if (this.userDetail && this.userDetail.regionCode && this.userDetail.regionCode.length == length) {
        return true
      }
      return false;
    },
    isNoData(list) {
      if (list && list.length == 0) {
        return true;
      }
      return false;
    },
    getProcess(screenInfo) {
      if (screenInfo && screenInfo.top_leftcenter && screenInfo.top_leftcenter.all) {
        if (isNaN(screenInfo.top_leftcenter.all.distribution)) {
          return 0;
        }
        return Math.floor(screenInfo.top_leftcenter.all.distribution * 100);
      } else {
        return 0;
      }
    },
    getXlFromType(selectBtnType) {
      if (selectBtnType == 'type_ff') {
        return '信创设备分发概览';
      } else if (selectBtnType == 'type_zx') {
        return '信创设备在线情况';
      } else if (selectBtnType == 'type_gs') {
        return '信创设备公司概览';
      } else if (selectBtnType == 'type_bm') {
        return '信创设备部门概览';
      }
      return '信创设备统计概览';
    },
  },
}
</script>
<style scoped lang="scss">
.d_root {
  height: 100%;
  width: 100%;
}

.d_top {
  height: 55%;

  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.d_bottom {
  height: 45%;

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
  position: relative;
  width: 35%;
}

.d_b_c2 {
  margin: 0px 6px 0px 6px;
  width: 45%;
}

.d_b_c3 {
  width: 20%;
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
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
  width: 30%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.d_t_center {
  width: 20%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  position: relative;

  margin: 0px 6px 0px 6px;
}

.d_t_right {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
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
  left: 50%;
  top: 50%;
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
  font-size: 13px;
  color: #333333;
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
</style>
