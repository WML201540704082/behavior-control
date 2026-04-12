<template>
  <div class="xinpian">
    <div class="xinpian_item">
      <div class="xinpian_item_t">
        <div class="xinpian_item_tl">
          <img src="../../../assets/wel/xinpian1.png" alt="">
          {{ armObj.name }}
        </div>
        <div class="xinpian_item_tr">
          <span>{{ armObj.number }}</span>台
        </div>
      </div>
      <div class="xinpian_item_c" v-for="(item, index) in armObj.subOperatingList" :key="index">
        <div class="xinpian_item_cl">
          <div class="dian"></div>
          {{ item.name }}
        </div>
        <div class="xinpian_item_cr">
          {{ item.number }}
        </div>
      </div>
    </div>

    <div class="xinpian_item xinpian_item2">
      <div class="xinpian_item_t">
        <div class="xinpian_item_tl">
          <img src="../../../assets/wel/xinpian2.png" alt="">
          {{ X86Obj.name }}
        </div>
        <div class="xinpian_item_tr xinpian_item_tr2">
          <span>{{ X86Obj.number }}</span>台
        </div>
      </div>
      <div class="xinpian_item_c" v-for="(item, index) in X86Obj.subOperatingList" :key="index">
        <div class="xinpian_item_cl">
          <div class="dian"></div>
          {{ item.name }}
        </div>
        <div class="xinpian_item_cr">
          {{ item.number }}
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { frameworkArm, frameworkX86 } from "@/api/wel/index.js"

export default {
  props: ['isShow', 'orderDeatil', 'processKeys','orderType'],
  data() {
    return {
      armObj: {
        name: '',
        number: 0,
        subOperatingList: []
      },
      X86Obj: {
        name: '',
        number: 0,
        subOperatingList: []
      },

    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    frameworkArm().then(res=>{
      this.armObj = res.data
    })
    frameworkX86().then(res=>{
      this.X86Obj = res.data
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
  .xinpian{
    height: 190px;
    display: flex;
    justify-content: space-between;
    .xinpian_item{
      width: 48%;
      height: 100%;
      background: linear-gradient(180deg, rgba(223,220,254,0.83) 0%, rgba(255,255,255,0.22) 100%);
      border-radius: 6px;
      padding: 15px;
      box-sizing: border-box;

      .xinpian_item_t{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .xinpian_item_tl{
          font-size: 12px;
          color: #4A4F5E;
          font-weight: 500;
          display: flex;
          align-items: center;

          img{
            margin-right: 5px;
          }
        }
        .xinpian_item_tr{
          font-weight: 400;
          font-size: 16px;
          color: #141414;
          span{
            color: #3387FF;
          }
        }
        .xinpian_item_tr2{
          span{
            color: #0CA072;
          }
        }
      }
      .xinpian_item_c{
        width: 85%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        .xinpian_item_cl{
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #4A4F5E;
          .dian{
            width: 6px;
            height: 6px;
            background: #74DD80;
            border-radius: 50%;
            margin-right: 5px;
          }
        }
        .xinpian_item_cr{
          font-weight: 400;
          color: #141414;
        }
      }
    }
    .xinpian_item2{
      background: linear-gradient(180deg, rgba(172,255,223,0.81) 0%, rgba(255,255,255,0.22) 100%);
    }

  }
  
</style>
