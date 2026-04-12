<template>
  <div class="tongji">
    <div class="tongji_title">
      <span>{{ total }}</span>本周告警统计
    </div>
   <div id="oldDeviceCategorySum" class="d_w100"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import * as echarts from 'echarts'
import { warningStatistics } from "@/api/personalDesk/index"

export default {
  props: ['isShow', 'orderDeatil', 'processKeys','orderType'],
  data() {
    return {
      userName: '',
      opearteResult: 0,
      comment: '',
      loading: false,
      nextProcess: {},
      submitForm: {
        comment: undefined
      },

      total: 105,
      datas: [
        { value: 37, name: '已确认告警' },
        { value: 32, name: '未确认告警' },
        { value: 29, name: '已确认消除' },
        { value: 19, name: '未确认消除' },
      ]

    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    warningStatistics().then(res=>{
      this.datas = [
        { value: res.data.dispose || 0, name: '已确认告警' },
        { value: res.data.noDispose || 0, name: '未确认告警' },
        { value: res.data.confirm || 0, name: '已确认消除' },
        { value: res.data.noConfirm || 0, name: '未确认消除' },
      ]
      this.total = (res.data.confirm || 0) + (res.data.noConfirm || 0) + (res.data.dispose || 0) + (res.data.noDispose || 0)
      this.initOldDeviceStockedEcharts()
    })

    
  },
  methods: {
    initOldDeviceStockedEcharts() {
      // 初始化 老旧设备分类统计
      let oldDeviceCategorySum = this.$echarts.init(document.getElementById('oldDeviceCategorySum'));
      const options = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          show: true,
          right: 20,
          bottom: 30,
        },
        series: [
          {
            // color: ['#2465E0', '#84B7F9', '#5F9CF8', '#CEE5FC', '#AAD0FB', '#E5F3FF', '#2478F2', '#84B7F9', '#99C7F9'],
            // color: ['#24baa4', '#34cced', '#54a6ff', '#d678da'], #e9550c
            // color: ['#15dbbe', '#FAB51D', '#2982e3', '#d13dd7'], #ff2222e6
            color: ['#6cc98c', '#d59984', '#2982e3', '#f32222'],
            
            type: 'pie',
            top: '16%',
            left: '-20%',
            radius: ['0%', '80%'],
            avoidLabelOverlap: true,
            labelLine: {
              show: true
            },
            data: this.datas
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
  height: 312px;
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
