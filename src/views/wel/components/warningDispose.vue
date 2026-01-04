<template>
  <div class="tongji">
    <div class="tongji_title">
      <span style="margin-right: 5px">{{ datas.warningCount }}</span>本周告警统计
    </div>
   <div id="oldDeviceCategorySum" class="d_w100"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as echarts from 'echarts'
import { warningCount } from "@/api/wel/index.js"

export default {
  props: ['isShow', 'orderDeatil', 'processKeys','orderType'],
  data() {
    return {
      datas: {},
      seriesData: [
        { value: 37, name: '已确认告警' },
        { value: 32, name: '未确认告警' },
        { value: 29, name: '已确认消除' },
        { value: 9, name: '未确认消除' },
      ]
    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    // setTimeout(() => {
    //   this.initOldDeviceStockedEcharts()
    // }, 200)

    warningCount().then(res=>{
      this.datas = res.data
      this.seriesData = [
        { value: this.datas.confirmedWarning, name: '已确认告警' },
        { value: this.datas.noConfirmedWarning, name: '未确认告警' },
        { value: this.datas.confirmedRemove, name: '已确认消除' },
        { value: this.datas.noConfirmedRemove, name: '未确认消除' },
      ]

      this.initOldDeviceStockedEcharts()
    })
  },
  methods: {
    initOldDeviceStockedEcharts() {
      // 初始化 老旧设备分类统计
      let oldDeviceCategorySum = echarts.init(document.getElementById('oldDeviceCategorySum'));
      const options = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          show: true,
          right: 5,
          bottom: 30,
        },
        series: [
          {
            // color: ['#2465E0', '#84B7F9', '#5F9CF8', '#CEE5FC', '#AAD0FB', '#E5F3FF', '#2478F2', '#84B7F9', '#99C7F9'],
            // color: ['#24baa4', '#34cced', '#54a6ff', '#d678da'], #e9550c ff2222e6
            color: ['#6cc98c', '#d59984', '#2982e3', '#e71b1b'],
            
            type: 'pie',
            top: '18%',
            left: '-25%',
            radius: ['0%', '82%'],
            avoidLabelOverlap: true,
            // label: {
            //   show: false
            // },
            data: this.seriesData
          }
        ]
      };
      oldDeviceCategorySum.setOption(options);

      
    },
  }
}
</script>
<style lang='scss' scoped>
.tongji{
  position: relative;
}
.d_w100 {
  width: 100%;
  height: 212px;
}
.tongji_title{
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  color: #666;
  span{
    color: red;
    font-size: 30px;
    font-weight: bold;
  }
}
</style>
