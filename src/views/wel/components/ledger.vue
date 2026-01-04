<template>
  <div class="ledger">
    <div class="ledger_c">
      <div class="ledger_tit">
        台账分析统计
        <img src="../../../assets/desk/jiantou.png" alt="">
      </div>
      <div class="ledger_item">
        <div class="ledger_iteml">
          <img src="../../../assets/wel/tai1.png" alt="">
          设备总数
        </div>
        <div class="ledger_itemr">
          <span>{{ deviceObj.deviceCount }}</span>台
        </div>
      </div>
      <div class="ledger_item">
        <div class="ledger_iteml">
          <img src="../../../assets/wel/tai2.png" alt="">
          在运设备
        </div>
        <div class="ledger_itemr">
          <span>{{ deviceObj.operationCount }}</span>台
        </div>
      </div>
      <div class="ledger_item">
        <div class="ledger_iteml">
          <img src="../../../assets/wel/tai3.png" alt="">
          退运在库设备
        </div>
        <div class="ledger_itemr">
          <span>{{ deviceObj.returnedCount }}</span>台
        </div>
      </div>
      <div class="ledger_item">
        <div class="ledger_iteml ledger_iteml2">
          <img src="../../../assets/wel/tai4.png" alt="">
          资产总数
        </div>
        <div class="ledger_itemr">
          <span>{{ deviceObj.assetCount }}</span>台
        </div>
      </div>
      <div class="ledger_item">
        <div class="ledger_iteml ledger_iteml2">
          <img src="../../../assets/wel/tai5.png" alt="">
          已转资数
        </div>
        <div class="ledger_itemr">
          <span>{{ deviceObj.transferCount }}</span>台
        </div>
      </div>
      <div class="ledger_item">
        <div class="ledger_iteml ledger_iteml2">
          <img src="../../../assets/wel/tai6.png" alt="">
          待转资数
        </div>
        <div class="ledger_itemr">
          <span>{{ deviceObj.noTransferCount }}</span>台
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { deviceCount } from "@/api/wel/index.js"

export default {
  props: [],
  data() {
    return {
      deviceObj: {}
    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    deviceCount().then(res=>{
      this.deviceObj = res.data
    })
  },
  methods: {
    handleConfirm(row){

    },
    handleHHu(row){

    },
    handleDis(row){

    },
  }
}
</script>
<style lang="scss" scoped>
  .ledger{
    width: 100%;
  }
  .ledger_c{
    // width: 100%;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0px 8px 20px 0px rgba(107,190,253,0.38);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 30px;

    .ledger_tit{
      display: flex;
      align-items: center;
      font-size: 24px;
      font-weight: 600;
      color: #192C7D;
      img{
        width: 18px;
        height: 18px;
        margin-left: 15px;
      }
    }
    .ledger_item{
      display: flex;
      align-items: center;
      line-height: 40px;
      color: #666;
      font-size: 14px;
      .ledger_iteml{
        background: linear-gradient(270deg, rgba(234,255,239,0) 0%, #D9FFE4 100%);
        border-radius: 4px;
        display: flex;
        align-items: center;
        
        img{
          // width: 18px;
          // height: 18px;
          margin: 0 10px;
        }
      }
      .ledger_iteml2{
        background: linear-gradient(270deg, rgba(255,255,255,0) 0%, #FDFADB 100%);
      }
      .ledger_itemr{
        span{
          color: #192C7D;
          font-size: 24px;
          font-weight: 600;
          margin: 0 10px 0 15px;
        }
      }
    }
  }

</style>