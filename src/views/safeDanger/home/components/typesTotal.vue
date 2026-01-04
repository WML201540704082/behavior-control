// 分类总数占比
<template>
  <div class="numContent">
    <div class="numContent1">
      <div class="numContent1_item" v-for="item in totalNumList" :key='item.title'>
        <div class="numContent1_title"> {{ item.title }} </div>
        <div class="numContent1_value"> {{ item.value }} </div>
      </div>
    </div>
    <div class="numContent2">
      
        <div class="numContent2_item" v-for="item in curNumList" :key='item.title'>
          <div class="numContent2_item_l">
            <img :src="item.imgSrc" alt="" width="39" height="39">
          </div>
          <div class="numContent2_item_r">
            <div class="numContent2_title"> {{ item.title }} </div>
            <div 
              @click="goRecord(item.title)" 
              :class="{ 
                numContent2_value: true, 
                colorRed: item.title=='超期未整改' ? true:false 
              }"> {{ item.value }} </div>
          </div>
        </div>

    </div>
  </div>
</template>

<script>
import { groupCount } from '@/api/safeDanger/home'

export default {
  props: ['hiddenCategory'],
  data() {
    return{
      totalNumList: [
        {
          title: '当前隐患总量',
          value: 604
        },
        {
          title: '月度新增隐患',
          value: 604
        },
        {
          title: '年度新增隐患',
          value: 604
        },
      ],
      curNumList: [
        {
          imgSrc: require("@/assets/safeDanger/state1.png"),
          title: '待整改',
          value: 604
        },
        {
          imgSrc: require("@/assets/safeDanger/state2.png"),
          title: '整改中',
          value: 604
        },
        {
          imgSrc: require("@/assets/safeDanger/state3.png"),
          title: '已整改',
          value: 604
        },
        {
          imgSrc: require("@/assets/safeDanger/state4.png"),
          title: '超期未整改',
          value: 604
        }
      ],
    }
  },
  mounted () {
    this.getDetail()

  },
  methods: {
    goRecord(type){
      // this.$router.push('/safeDanger/record?types='+type)
      this.$router.push({ name: "Record", params: { types: type } })
    },
    getDetail() {
      groupCount({ hiddenCategory: this.hiddenCategory }).then(res => {
        let data = res.data
        this.totalNumList[0].value = data.count
        this.totalNumList[1].value = data.monthCount
        this.totalNumList[2].value = data.yearCount

        this.curNumList[0].value = data.noRectified
        this.curNumList[1].value = data.undoRectified
        this.curNumList[2].value = data.doneRectified
        this.curNumList[3].value = data.overdueRectified

      }).catch(err =>{
      })
    },
  }
}
</script>
<style lang='scss' scoped>
  .numContent{
    padding: 10px 20px;
  }
  .numContent1{
    display: flex;
    justify-content: space-between;

    .numContent1_item{
      width: 26%;
      text-align: center;
      background: url(require('@/assets/safeDanger/total.png')) no-repeat center;
      background-size: 100%;
      .numContent1_title{
        color: #4bc5ba;
        font-size: 14px;
      }
      .numContent1_value{
        color: #33bfb1;
        font-size: 18px;
        font-weight: bold;
        margin: 15px 0 37px 0;
      }
    }
  }
  .numContent2{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-left: 20px;
    margin-top: 10px;
    .numContent2_item{
      display: flex;
      align-items: center;
      width: 50%;
      margin-bottom: 15px;
      .numContent2_item_l{
        img{

        }
      }
      .numContent2_item_r{
        // text-align: center;
        flex: 1;
        margin-left: 18px;
        .numContent2_title{
          color: #333;
        }
        .numContent2_value{
          color: #33bfb1;
          margin-top: 3px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
        }
        .colorRed{
          color: red;
        }
      }
    }
  }
</style>
