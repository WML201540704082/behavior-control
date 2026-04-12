<template>
  <div class="d_root" v-loading="pageLoading">
    <!--    数据概览-->
    <div class="d_top">
      <div class="d_t_c1">
        <div class="d_t_left" v-loading="upLeftLoading">
          <div class="d_p1">
            <span class="s_line"></span>
            <span>信创设备数据概览</span>
          </div>

          <div class="d_p2">
            <div class="d_p3">
              <div class="vh_center">
                <img src="@/assets/itai/o_top.png" class="d_img"/>
              </div>
              <div>
                <div>
                  <span class="s_num">{{ screenInfo.deviceNum }}</span>
                  <span class="s_label">台</span>
                </div>
                <div>
                  <span class="s_label2">设备数量</span>
                </div>
              </div>
            </div>

            <div class="d_p3">
              <div class="vh_center">
                <img src="@/assets/itai/o_center.png" class="d_img"/>
              </div>
              <div>
                <div>
                  <span class="s_num">{{ screenInfo.InOperationNum }}</span>
                  <span class="s_label">台</span>
                </div>
                <div>
                  <span class="s_label2">在运数量</span>
                </div>
              </div>
            </div>

            <div class="d_p3">
              <div class="vh_center">
                <img src="@/assets/itai/o_bottom.png" class="d_img"/>
              </div>
              <div>
                <div>
                  <span class="s_num">{{ screenInfo.onLine }}</span>
                  <span class="s_label">台</span>
                </div>
                <div>
                  <span class="s_label2">在线设备</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d_t_center vh_center" v-loading="upLeftLoading">
          <el-progress type="dashboard"
                       :percentage="(screenInfo.InOperationNum/screenInfo.deviceNum)*100"
                       :stroke-width="15"
                       :width="200"
                       :show-text="false"
                       color="#1F7CDC">
          </el-progress>

          <div class="d_jd">
            <div>
              <span class="s_jd">{{ getProgressValue(screenInfo.InOperationNum / screenInfo.deviceNum) }}%</span>
            </div>
            <div>
              <span class="s_label3">分发进度</span>
            </div>
          </div>
        </div>
        <div class="d_t_right" v-loading="zxLoading">
          <div class="d_zxtpad vh_center d_100">
            <img src="@/assets/itai/jt_left.png"/>
            <span class="s_ls">7日内每日在线数量趋势</span>
            <img src="@/assets/itai/jt_right.png"/>
          </div>
          <div id="d_zxtChart" class="d_zxt"></div>

          <div class="d_refresh">
            <el-button type="primary" plain size="mini" @click="requestScreenInfo">刷新</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="d_bottom">
      <div class="d_b_c1 d_b_c0" v-loading="zztLoading">
        <div class="d_100 d_sb">
          <div class="d_p1">
            <span class="s_line"></span>
            <span>各单位分发情况</span>
          </div>
          <div class="d_bns d_start v_center" v-if="!isNoData(screenInfo.dept)">
            <el-button type="primary" size="mini" v-if="getRegionCode(2)">市</el-button>
            <el-button :type="selectBtnType == 'CORP'?'primary':''" size="mini" v-if="getRegionCode(4)" @click="typeClick('CORP')">单位</el-button>
            <el-button :type="selectBtnType == 'DEPT'?'primary':''" size="mini" v-if="getRegionCode(4)" @click="typeClick('DEPT')">部门</el-button>
          </div>
        </div>
        <div id="d_dwChart" class="d_dw_chart d_100">

        </div>

        <div v-if="isNoData(screenInfo.dept)" class="d_empty_vhcenter">
          <span>暂无数据</span>
        </div>
      </div>

      <div class="d_b_c1 d_b_c2" v-loading="zdbbLoading">
        <div class="d_p1">
          <span class="s_line"></span>
          <span>终端版本</span>
        </div>
        <div class="d_lp d_start d_100">
          <div class="d_v1">
            <div class="d_p12 vh_center">
              <img src="@/assets/itai/jt_left.png"/>
              <span class="s_ls">芯片架构</span>
              <img src="@/assets/itai/jt_right.png"/>
            </div>
            <div class="d_sa d_h80">
              <div class="d_w40 d_h100">
                <div class="d_t d_t1 vh_center">
                  <span class="s_weight">ARM（{{ screenInfo.armNums }}）</span>
                </div>
                <div class="d_c1">
                  <div v-for="(item,index) in screenInfo.armChild" :key="item.value" class="d_p12 vh_center">
                    <span class="s_l2">{{ item.name }}（{{ item.value }}）</span>
                  </div>

                  <div v-if="isNoData(screenInfo.armChild)" class="d_empty_vhcenter">
                    <span>暂无数据</span>
                  </div>
                </div>
              </div>
              <div class="d_w40">
                <div class="d_t d_t1 vh_center">
                  <span class="s_weight">X86（{{ screenInfo.x86Nums }}）</span>
                </div>
                <div class="d_c1">
                  <div v-for="(item,index) in screenInfo.x86Child" :key="item.value" class="d_p12 vh_center">
                    <span class="s_l2">{{ item.name }}（{{ item.value }}）</span>
                  </div>

                  <div v-if="isNoData(screenInfo.x86Child)" class="d_empty_vhcenter">
                    <span>暂无数据</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d_v2">
            <div class="d_p12 vh_center">
              <img src="@/assets/itai/jt_left.png"/>
              <span class="s_ls">操作系统</span>
              <img src="@/assets/itai/jt_right.png"/>
            </div>

            <div class="d_h80">
              <div class="d_c2">
                <div v-for="(item,index) in screenInfo.os" class="d_p12 vh_center">
                  <span class="s_l2">{{ item.name }}（{{ item.value }}）</span>
                </div>

                <div v-if="isNoData(screenInfo.x86Child)" class="d_empty_vhcenter">
                  <span>暂无数据</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d_b_c1 d_b_c3" v-loading="downRightLoading">
        <div class="d_p1">
          <span class="s_line"></span>
          <span>信创设备替代</span>
        </div>
        <div id="d_yChart" class="d_lp d_100"></div>

        <div class="d_jd2">
          <div>
            <span class="s_label4">{{ screenInfo.deviceAll }}</span>
          </div>
          <div>
            <span class="s_label5">设备数量</span>
          </div>
        </div>
        <div class="d_jd3">
          <div>
            <span class="s_c1">信创占比：{{ getnum(screenInfo.deviceNum, screenInfo.deviceAll) }}%</span>
          </div>
          <div>
            <span class="s_c2">非信创占比：{{ 100 - getnum(screenInfo.deviceNum, screenInfo.deviceAll) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {upLeft, zx, arm, x86, czxt, zzt, downRight} from "@/api/assets/itaiDevice";
import {mapGetters} from "vuex";

export default {
  name: "testPage",
  data() {
    return {
      pageLoading: false,
      screenInfo: {},
      selectBtnType: 'CORP',

      zdbbLoading: false,

      upLeftLoading: false,
      zxLoading: false,
      zztLoading: false,
      downRightLoading: false,
    };
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  watch: {
    'screenInfo.deviceAll'(newVal, oldVal) {
      if (!isNaN(newVal)) {
        if (!isNaN(this.screenInfo.deviceNum)) {
          //加载initChart3
          this.initChart3();
        }
      }
    },
    'screenInfo.deviceNum'(newVal, oldVal) {
      if (!isNaN(this.screenInfo.deviceAll)) {
        //加载initChart3
        this.initChart3();
      }
    },
  },
  mounted() {
    this.requestScreenInfo();
  },
  methods: {
    requestScreenInfo() {
      //先初始化，防止切换页面eChart图形错乱
      this.initChart1();
      this.initChart2();
      this.initChart3();

      let uInfo = this.userDetail;
      let pms = {area: uInfo.regionCode, userId: uInfo.userId, ownerUnitCode: uInfo.ownerUnit};

      this.upLeftLoading = true;
      upLeft(pms).then(res => {
        for (const resKey in res.data) {
          this.screenInfo[resKey] = res.data[resKey];
        }
      }).finally(() => {
        this.upLeftLoading = false;
        if (!isNaN(this.screenInfo.deviceNum)) {
          if (!isNaN(this.screenInfo.deviceAll)) {
            //加载initChart3
            this.initChart3();

            this.downRightLoading = false;
            this.upLeftLoading = false;
          }
        }
      })

      this.downRightLoading = true;
      downRight(pms).then(res => {
        for (const resKey in res.data) {
          this.screenInfo[resKey] = res.data[resKey];
        }
      }).finally(() => {
        if (!isNaN(this.screenInfo.deviceAll)) {
          if (!isNaN(this.screenInfo.deviceNum)) {
            //加载initChart3
            this.initChart3();

            this.downRightLoading = false;
            this.upLeftLoading = false;
          }
        }
      })


      this.zxLoading = true;
      zx(pms).then(res => {
        if (res.data && res.data.sevenDay) {
          this.screenInfo.sevenDay = res.data.sevenDay;
          this.initChart1();
        }
      }).finally(() => {
        this.zxLoading = false;
      });
      this.zztLoading = true;
      zzt(pms).then(res => {
        if (res.data && res.data.dept) {
          this.screenInfo.dept = res.data.dept;
          //柱状图
          this.initChart2();
        }

      }).finally(() => {
        this.zztLoading = false;
      });

      this.zdbbLoading = true;
      arm(pms).then(res => {
        let arrs = [];
        for (const resKey in res.data) {
          if (resKey == 'armChild') {
            for (const resKeyKey in res.data[resKey]) {
              arrs.push({
                name: resKeyKey,
                value: res.data[resKey][resKeyKey]
              });
            }
            this.screenInfo.armChild = arrs;
          } else {
            this.screenInfo[resKey] = res.data[resKey];
          }
        }
      }).finally(() => {
        this.zdbbLoading = false;
      });

      x86(pms).then(res => {
        let arrs = [];
        for (const resKey in res.data) {
          if (resKey == 'x86Child') {
            for (const resKeyKey in res.data[resKey]) {
              arrs.push({
                name: resKeyKey,
                value: res.data[resKey][resKeyKey]
              });
            }
            this.screenInfo.x86Child = arrs;
          } else {
            this.screenInfo[resKey] = res.data[resKey];
          }
        }
      }).finally(() => {

      });
      czxt(pms).then(res => {
        if (res.data && res.data.os) {
          let arrs = [];
          for (const resKey in res.data.os) {
            arrs.push({
              name: resKey,
              value: res.data.os[resKey]
            });
          }
          this.screenInfo.os = arrs;
        }
      }).finally(() => {

      });


      // this.zdbbLoading = true;
      // let uInfo = this.userDetail;
      // arm({area: uInfo.regionCode, userId: uInfo.userId, ownerUnitCode: uInfo.ownerUnit}).then(res => {
      //   if (res.data) {
      //     //this.screenInfo = res.data;
      //     this.zdbbInfo = res.data;
      //     //this.initChart1();
      //     //this.initChart2();
      //     //this.initChart3();
      //   }
      // }).finally(() => {
      //   this.zdbbLoading = false;
      // });
    },
    initChart1() {
      let xValue = [];
      let yValue = [];

      if (this.screenInfo.sevenDay) {
        this.screenInfo.sevenDay.forEach((item, index) => {
          xValue.push(this.getFormatDay(item.name));
          yValue.push(item.value);
        });
      }


      let d_zxtChart = this.$echarts.init(document.getElementById('d_zxtChart'));
      d_zxtChart.setOption({
        title: {
          show: false,
          text: 'stacked area chart'
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          transitionDuration: 0,
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        legend: {
          show: false,
          textStyle: {
            color: '#fff',
            fontSize: '14px'
          }
        },
        grid: {
          left: '2%',
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
      })
    },
    initChart3() {
      // 信创设备数量
      let value1 = 0;
      // 非信创设备数量
      let value2 = 0;

      if (this.screenInfo.deviceNum > 0) {
        value1 = this.screenInfo.deviceNum;
      }
      if (this.screenInfo.deviceAll > 0 && this.screenInfo.deviceNum > 0) {
        value2 = this.screenInfo.deviceAll - this.screenInfo.deviceNum;
      }

      let d_yChart = this.$echarts.init(document.getElementById('d_yChart'));
      d_yChart.setOption({
        series: [{
          name: '内圆',
          type: 'pie',
          radius: ['30%'],
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
          }
        }, {
          name: '外圆',
          type: 'pie',
          radius: ['40%', '50%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: true,
            }
          },
          data: [{
            value: value1,
            name: '信创设备',
            label: {
              show: true,
              position: 'outside'
            },
          }, {
            value: value2,
            name: '非信创设备',
            label: {
              show: true,
              position: 'outside'
            },
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
    initChart2() {
      let xValue = [];
      let yValue = [];

      if (this.screenInfo.dept) {
        this.screenInfo.dept.forEach((item, index) => {
          if (this.userDetail.regionCode.length == 4) {
            //市公司 会显示单位和部门按钮
            if (item.type == this.selectBtnType) {
              xValue.push(item.name);
              yValue.push(item.value);
            }
          } else {
            xValue.push(item.name);
            yValue.push(item.value);
          }
        });
      }

      let d_dwChart = this.$echarts.init(document.getElementById('d_dwChart'));
      d_dwChart.setOption({
        dataZoom: [{
          type: 'slider',
          startValue: this.screenInfo.dept && this.screenInfo.dept.length > 6 ? this.screenInfo.dept.length - 6 : 0,
          endValue: this.screenInfo.dept && this.screenInfo.dept.length > 1 ? this.screenInfo.dept.length - 1 : 0,
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
          formatter: function (params) {
            return params.name;
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
          name: !this.isNoData(this.screenInfo.dept) ? '设备数量' : '',
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
        series: [{
          data: yValue,
          type: 'bar',
          barWidth: '30%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: 'rgba(36, 117, 247, 1)'},
                {offset: 0.5, color: 'rgba(36, 117, 247, 0.9)'},
                {offset: 1, color: 'rgba(36, 117, 247, 0.5)'},
              ])
            }
          },
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#1F7CDC',
              fontSize: '14px',
            },
          }
        }],
      });
    },
    typeClick(type) {
      this.selectBtnType = type;
      this.initChart2();
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
  background-color: #FFFFFF;
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
  width: 40%;
}

.d_b_c3 {
  width: 25%;
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
  width: 20%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.d_t_center {
  width: 30%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  position: relative
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
  width: 36px;
  height: 36px;
  margin-right: 12px;
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
  font-size: 2.5em;
  font-weight: bold;
}

.s_label3 {
  color: #777777;
  display: block;
  margin-top: 12px;
}

.d_zxtpad {
  padding: 12px 12px 0px 12px;
}

.d_zxt {
  width: 100%;
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
  margin: 12px;
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

.d_v1 {
  width: 60%;
  margin-right: 12px;
}

.d_v2 {
  width: 40%;
  margin-right: 12px;
}

.s_ls {
  color: #5A96F9;
  margin: 0px 6px 0px 6px;
}

.d_p12 {
  padding: 12px;
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
  position: absolute;
  right: 12px;
  top: 12px;
}
</style>
