<template>
  <div class="mainc">
    <div class="mainc1 mainc11">
      <div class="mainc1_t">
        主机设备 <span>54.55%</span>
      </div>
      <img class="img1" src="../../../assets/wel/icon1.png" alt="">
      <img class="img2" src="../../../assets/wel/di1.png" alt="">
    </div>
    <div class="mainc1 mainc2">
      <div class="mainc1_t mainc1_t2">
        终端设备 <span>58.45%</span>
      </div>
      <img class="img1" src="../../../assets/wel/icon2.png" alt="">
      <img class="img2" src="../../../assets/wel/di2.png" alt="">
    </div>
    <div class="mainc1 mainc3">
      <div class="mainc1_t mainc1_t2">
        安全设备 <span>55.25%</span>
      </div>
      <img class="img1" src="../../../assets/wel/icon3.png" alt="">
      <img class="img2" src="../../../assets/wel/di2.png" alt="">
    </div>
    <!-- <div class="mainc1 mainc4">
      <div class="mainc1_t mainc1_t3">
        储存设备 <span>54.55%</span>
      </div>
      <img class="img1" src="../../../assets/wel/icon5.png" alt="">
      <img class="img2" src="../../../assets/wel/di3.png" alt="">
    </div> -->
    <div class="mainc1 mainc5">
      <div class="mainc1_t">
        网络设备 <span>58.55%</span>
      </div>
      <img class="img1" src="../../../assets/wel/icon4.png" alt="">
      <img class="img2" src="../../../assets/wel/di1.png" alt="">
    </div>
    <div class="mainc22">
      <img class="img1 imgc1" src="../../../assets/wel/center.png" alt="">
      <img class="img2 imgc2" src="../../../assets/wel/di4.png" alt="">
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ['isShow', 'orderDeatil', 'processKeys','orderType'],
  data() {
    return {
      

    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    
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
  .mainc{
    width: 100%;
    height: calc(100% - 35px);
    position: relative;
  }
  .mainc22{
    width: 350px;
    height: 420px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 10px;
    .img1{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 32px;
      z-index: 11;
    }
    .img2{
        position: absolute;
        left: 53%;
        transform: translateX(-50%);
        top: 245px;
    }

    .imgc1{
      width: 264px;
      height: 287px;
    }
    .imgc2{
      width: 357px;
      height: 190px;
    }
  }
  .mainc1{
    width: 180px;
    height: 180px;
    text-align: center;
    .mainc1_t{
      color: #2dc12d;
      font-weight: bold;
      font-size: 18px;
      background: url("../../../assets/wel/kuang1.png") no-repeat center bottom;
      span{
        font-size: 28px;
        margin-left: 5px;
        
      }
    }
    .mainc1_t2{
      color: #2777f8;
      background: url("../../../assets/wel/kuang2.png") no-repeat center bottom;
    }
    .mainc1_t3{
      color: #df9558;
      background: url("../../../assets/wel/kuang3.png") no-repeat center bottom;
    }
    .img1{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 50px;
        z-index: 11;
      }
      .img2{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 95px;
      }
  }
  .mainc11{
    position: absolute;
    left: 120px;
    top: 20px;
  }
  .mainc2{
    position: absolute;
    right: 120px;
    top: 20px;
  }
  .mainc3{
    position: absolute;
    left: 15px;
    bottom: 18px;
  }
  .mainc4{
    position: absolute;
    left: 50%;
    bottom: 0;
  }
  .mainc5{
    position: absolute;
    right: 15px;
    bottom: 15px;
  }
  // #2777f8 #df9558

</style>