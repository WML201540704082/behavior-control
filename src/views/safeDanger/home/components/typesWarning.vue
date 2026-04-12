<template>
  <div class="quEarlyWarning">
    <div class="titleW">
      <p>截至：</p>
      <el-date-picker @change="dateChange" v-model="value1" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="rectificationFinishTimePickerOptions" size="mini" type="date" placeholder=""></el-date-picker>
    </div>

    <div class="item" v-for="(item, index) in list" :key="index">
      <div :class="{
        tit: true
      }">
        <span class="tit2">{{ item.shortName }}</span>
        <el-progress :stroke-width="13" :percentage="item.rectifiedRate" show-text text-inside></el-progress>
        <span class="tit3">{{ item.orgCount }}</span>
      
        <!-- <span class="vvv" :style="{ left: item.percentage + '%' }"> {{ item.percentage }}% </span> -->
      </div>
    </div>
    
  </div>
</template>

<script>
import { rectificationCount } from '@/api/safeDanger/home'

export default {
  name: "quState",
  components: {

  },
  props: ['hiddenCategory'],
  data() {
    return {
      value1: '',
      list: [
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 50
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
        // {
        //   name: '青岛',
        //   num: '432',
        //   percentage: 25
        // },
      ],
      rectificationFinishTimePickerOptions: {
        disabledDate: (time)=>{
          return time.getTime() > Date.now()
        }
      },
    };
  },
  computed: {
    
  },
  created() {},
  mounted() {
    this.value1 = this.formatDate(new Date(), 'yyyy-MM-dd')
    this.getDetail()
  },
  methods: {
    dateChange(timeValue){
      this.getDetail()
    },
    getDetail() {
      rectificationCount({ deadline: this.value1, hiddenCategory: this.hiddenCategory }).then(res => {
        let data = res.data
        this.list = data

      }).catch(err =>{
      })
    },

    getColor(index){
      return 'linear-gradient(to right, #64dfa9, #95f27d)'


      let ccc = ''
      switch (index) {
        case 0:
          ccc = '#fbac11'
          break;
        case 1:
          ccc = '#E4EAFF'
          break;
        case 2:
          ccc = '#f6c2ab'
          break;
        default:
          ccc = '#18FEFE'
          break;
      }
      return ccc
    }
  }
};
</script>

<style lang="scss" scoped>
  .titleW{
    display: flex;
    align-items: center;
    position: absolute;
    // top: 55px;
    top: 42px;
    right: 40px;
    font-size: 14px;
  }

  ::v-deep .el-date-editor{
    // width: 150px;
    // margin-left: 1px;
    // margin-bottom: 10px;
    // position: absolute;
    // top: 22px;
    // right: 30px;
    width: 150px;
    margin-left: 1px;
    // margin-bottom: 10px;
    // position: absolute;
    // top: 55px;
    // right: 40px;
  }
  ::v-deep .el-progress-bar__outer{
    overflow: visible;
  }
  ::v-deep .el-progress-bar__innerText{
    color: #333;
    position: relative;
    bottom: 16px;
    font-weight: bold;
  }

  ::v-deep .el-progress-bar__inner{
    background: linear-gradient(to right, #64dfa9, #95f27d);
  }
  .quEarlyWarning{
    margin-top: 25px;
    padding: 0 20px 10px;
    .el-progress{
      flex: 1;
      margin: 0 10px;
    }


    .item{
      margin-top: 15px;
      &:nth-child(2){
        width: 97%;
      }
      &:nth-child(3){
        width: 94%;
      }
      &:nth-child(4){
        width: 91%;
      }
      &:nth-child(5){
        width: 88%;
      }
      &:nth-child(6){
        width: 85%;
      }
      &:nth-child(7){
        width: 82%;
      }
      &:nth-child(8){
        width: 79%;
      }
      &:nth-child(9){
        width: 76%;
      }
      &:nth-child(10){
        width: 73%;
      }
      &:nth-child(11){
        width: 70%;
      }
      &:nth-child(12){
        width: 67%;
      }
      &:nth-child(13){
        width: 64%;
      }
      &:nth-child(14){
        width: 61%;
      }
      &:nth-child(15){
        width: 58%;
      }
      &:nth-child(16){
        width: 55%;
      }
      &:nth-child(17){
        width: 52%;
      }
      &:nth-child(18){
        width: 49%;
      }
      .tit{
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #333;
        .tit1{
          font-size: 12px;
          margin-right: 10px;
          border: 1px solid #666;
          padding: 3px;
        }
        .tit2{
          font-size: 15px;
          
        }
        .tit3{
          font-size: 14px;
          font-weight: bold;
          width: 30px;
        }
      }
      position: relative;
      .vvv{
        position: absolute;
        // left: 25%;
        top: -10px;
        font-size: 12px;
      }
    }
  }

  ::v-deep .el-progress-bar__outer{
    margin: 5px 0;
    background: #33bfb1;
  }
</style>
