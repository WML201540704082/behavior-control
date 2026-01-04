
<template>
  <div style="padding-bottom: 120px; padding-left: 10px; padding-top: 5px; padding-right: 15px" class="index">

    <el-row :gutter="15" style="margin-bottom: 15px">
      <el-col :span="6">
        <el-card class="box-card" body-style="height: 25vh;padding: 0;" style="margin-bottom: 10px">
          <div slot="header">
            <div class="title_wrap">
              隐患数量统计
              <img class="img1" :src='require("@/assets/safeDanger/headJiao.png")' alt="">
              <img class="img2" :src='require("@/assets/safeDanger/headDian.png")' alt="">
            </div>
          </div>

          <typesTotal :hiddenCategory="hiddenCategory" v-if="aaaaa"></typesTotal>
        </el-card>

        <el-card class="box-card" body-style="height: 35vh;padding: 0">
          <div slot="header">
            <div class="title_wrap">
              超期告警
              <img class="img1" :src='require("@/assets/safeDanger/headJiao.png")' alt="">
              <img class="img2" :src='require("@/assets/safeDanger/headDian.png")' alt="">
            </div>
          </div>

          <onlineStatistics :hiddenCategory="hiddenCategory" v-if="aaaaa"></onlineStatistics>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="box-card" body-style="height: 76vh;padding: 0" header="">
          <typesOnline :hiddenCategory="hiddenCategory" v-if="aaaaa"></typesOnline>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" body-style="height: 67vh;padding: 0">
          <div slot="header">
            <div class="title_wrap">
              隐患整改统计
              <img class="img1" :src='require("@/assets/safeDanger/headJiao.png")' alt="">
              <img class="img2" :src='require("@/assets/safeDanger/headDian.png")' alt="">
            </div>
          </div>

          <typesWarning :hiddenCategory="hiddenCategory" v-if="aaaaa"></typesWarning>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15" style="margin-bottom: 15px">
      <el-col :span="24">
        <el-card class="box-card" body-style="height: 45vh;padding: 0" header="">
          <Sbgj :hiddenCategory="hiddenCategory" v-if="aaaaa"></Sbgj>
        </el-card>
      </el-col>
    </el-row>
    <div class="menus">
      <div @click="tabClick(undefined)" :class="{menus_item: true, 'menus_item-a': !hiddenCategory && hiddenCategory !== 0}"> <span>隐患总计</span> </div>
      <div @click="tabClick(1)" :class="{menus_item: true, 'menus_item-a': hiddenCategory === 1}"> <span>网络安全</span> </div>
      <div @click="tabClick(0)" :class="{menus_item: true, 'menus_item-a': hiddenCategory === 0}"> <span>机房安全</span> </div>
    </div>
  </div>
</template>

<script>
import typesTotal from './components/typesTotal'
import typesOnline from './components/typesOnline'
import typesWarning from './components/typesWarning'
import areaStatistics from './components/areaStatistics.vue'
import equipmentStatistics from './components/equipmentStatistics'
import brandStatistics from './components/brandStatistics'
import diskStatistics from './components/diskStatistics'
import memoryStatistics from './components/memoryStatistics'
import osTypeStatistics from './components/osTypeStatistics'
import systemStatistics from './components/systemStatistics'
import onlineStatistics from './components/onlineStatistics'
import officeOsTotal from './components/officeOsTotal'
import officeMatch from './components/officeMatch'
import Sbgj from './components/sbgj'

import { getServerTotal, getNetworkTotal, getHsTotal, getDeviceClass, getSecurity, getNetWork
} from '@/api/safeDanger/control/statistics'
import DbChart from "./components/dbStatistics";

export default {
  name: "ControlCharts",
  components: {
    DbChart,
    areaStatistics, equipmentStatistics, brandStatistics, diskStatistics, memoryStatistics,
    osTypeStatistics, systemStatistics, onlineStatistics,officeOsTotal, officeMatch, typesTotal,typesOnline,typesWarning, Sbgj
  },
  data() {
    return {
      hiddenCategory: undefined,
      // numList: [
      //   {val: '信息设备台账', num: '0',url: '/dev/hardwarebase'},
      //   {val: '办公终端设备', num: '0',url: '/control/devicecontrol/hardwareConfig'},
      //   {val: '物联网终端', num: '0'},
      //   {val: '网络设备', num: '0',url: '/control/devicecontrol/NetDevice'},
      //   {val: '服务器设备', num: '0',url: '/control/devicecontrol/promotionMachine'},
      //   {val: '长期不在线设备', num: '0',url: '/control/monitor/overdue'},
      // ],
      areaStatisticsData: [], //各地市终端入网统计
      equipmentStatisticsData: [], //设备资产统计
      brandStatisticsData: {}, //设备品牌
      diskData: [], //硬盘容量分布
      memoryData: [], //内存容量分布
      onlineData: [], //在线统计
      systemData: [], //操作系统统计
      serverVendorData: {}, //服务器生产商统计
      osTypeData: [], //服务器生产商统计
      dbData: [], //服务器数据库统计

      aaaaa: true
    }
  },
  mounted() {
    // this.formatTotal();
  },
  methods: {
    tabClick(type){
      this.hiddenCategory = type

      this.aaaaa = false
      setTimeout(()=>{
        this.aaaaa = true
      }, 0)
    },
    // //格式化所有数量统计
    // formatTotal() {
    //   this.getServerTotal();
    // },
    // //各个模块总数量统计getHsTotal
    // getServerTotal() {
    //   getNetworkTotal().then(res => { //设备总数
    //     this.numList[0].num = res.data
    //   })
    //   getDeviceClass().then(res => { //终端设备总数
    //     this.numList[1].num = res.data
    //   })
    //   getSecurity().then(res => { //物联网总数

    //     this.numList[2].num = res.data
    //   })
    //   getNetWork().then(res => { //网络设备总数
    //     this.numList[3].num = res.data
    //   })
    //   getServerTotal().then(response => { //服务器设备
    //     this.numList[4].num = response.data;
    //   })
    //   getHsTotal().then(res => { //僵尸设备
    //     this.numList[5].num = res.data
    //   })
    // },

    goDetail(val) {
      if(val.url != '') {

        this.$router.push({path: val.url,query: {type: 1}})
      }
    }
  }
}
</script>


<style lang='scss' scoped>
::v-deep .el-card{
  overflow: initial;
}

.menus{
  position: fixed;
  top: 32%;
  right: 13px;
  .menus_item{
    width: 40px;
    height: 130px;
    background: url(require('@/assets/safeDanger/menu2.png')) no-repeat;
    background-size: 100%;
    font-size: 18px;
    color: #fff;
    cursor: pointer;
    text-align: center;
    padding-top: 22px;

    span{
      display: inline-block;
      width: 20px;
    }
  }
  .menus_item-a{
    background: url(require('@/assets/safeDanger/menu1.png')) no-repeat;
    background-size: 100%;
  }
}


::v-deep .el-card__header{
  border-bottom: 0;
}
.title_wrap{
  width: 100%;
  height: 34px;
  background: url(require('@/assets/safeDanger/headBg.png')) no-repeat;
  background-size: 100%;
  position: relative;
  padding-left: 25px;
  line-height: 30px;
  font-size: 16px;
  color: #333;

  .img1{
    width: 6.5px;
    position: absolute;
    left: 10px;
    top: 9px;
  }
  .img2{
    position: absolute;
    top: 22px;
    right: 5px;
    width: 23px;
  }
}


.title_card{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0px;
  color:#606266;
  font-weight: bold;
  font-size: 14px
}
.index >>> .el-card__header{
  font-size: 15px;
  color: #606266;
  font-weight: bold
}
.card0{
  background: linear-gradient(to right, #ffc75e, #ff5f37)
}
.card1{
  background: linear-gradient(to right, #8ddfff, #7fabfd)
}
.card2{
  background: linear-gradient(to right, #f49ae7, #b470fe)
}
.card3{
  background: linear-gradient(to right, #7ae9e7, #47e6c3)
}
.card4{
  background: linear-gradient(to right, #b0c1e1, #647799)
}
.card5{
  background: linear-gradient(to right, #ffbbdb, #ff6caa);

}
</style>

