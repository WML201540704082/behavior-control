<template>
<div class="overdueWarp" v-loading="loading">
  <div class="btnRow" style="margin-bottom: 5px">
    <div :class="{btn1: true, btn1a: tabAction == 'overdueAlarm' }" style="margin-right: 2px" @click="tabClick('overdueAlarm')">
      即将超期
    </div>
    <div :class="{btn1: true, btn1a: tabAction == 'expired' }" @click="tabClick('expired')">
      已超期
    </div>
    <!-- <el-button type="primary" size="mini">即将超期</el-button>
    <el-button type="primary" size="mini">已超期</el-button> -->
  </div>
  <el-table
    class="tabble"
    ref="warnTable"
    :data="tableData"
    size="mini"
    :height="tableHeight"
    style="width: 100%"
  >
    <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
    <el-table-column prop="content" align="center" label="隐患内容" show-overflow-tooltip></el-table-column>
    <el-table-column prop="shortName" align="center" label="责任单位" width="75" ></el-table-column>
    <el-table-column prop="day" align="center" :label=" tabAction == 'overdueAlarm' ? '剩余时间':'超期时间' " width="75" >
      <template slot-scope="scope">
        <span :class=" !(tabAction == 'overdueAlarm') ? 'colorRed':'' ">{{ scope.row.day }}天</span>
      </template>
    </el-table-column>
    <!-- <el-table-column align="center" label="操作" width="100">
      <template slot-scope="scope">
        <span @click="addWorkDesk(scope.row)" style="cursor: pointer;">加入工作台</span>
      </template>
    </el-table-column> -->
  </el-table>
</div>
</template>

<script>
import { extensionCount } from '@/api/safeDanger/home'

export default {
  props: ['hiddenCategory'],
  data() {
    return {
      tabAction: 'overdueAlarm',

      totalData: {},
      loading: false,
      tableHeight: '85%',
      tableData: [
        {
          warnLevel: '网络安全领导小组网络安全领导小组',
          sourceType: '济南供电',
          ip: '6天'
        },
        {
          warnLevel: '网络安全领导小组网络安全领导小组',
          sourceType: '济南供电',
          ip: '6天'
        },
        
      ]
    }
  },
  watch: {

  },
  async mounted() {
    this.getDetail()
  },
  methods: {
    tabClick(name){
      this.tabAction = name
      this.tableData = this.totalData[name]
    },
    getDetail() {
      extensionCount({ hiddenCategory: this.hiddenCategory }).then(res => {
        let data = res.data
        this.totalData = data
        this.tableData = data.overdueAlarm

        // this.tableData = 

      }).catch(err =>{
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  .tabble{
    font-weight: bold;
  }

  .colorRed{
    color: red;
  }
  .overdueWarp{
    height: 100%;
    padding: 0 20px 10px;
  }

  .btnRow{
    display: flex;
  }
  .btn1{
    width: 120px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: url(require('@/assets/safeDanger/tab1.png')) no-repeat;
    background-size: auto 100%;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    opacity: 0.6;
  }
  .btn1a{
    opacity: 1;
  }


  // ::v-deep .el-table td, ::v-deep .el-table th.is-leaf{
  //   background: none !important;
  //   border-bottom: 0
  // }
  // ::v-deep .el-table::before{
  //   height: 0
  // }
</style>
