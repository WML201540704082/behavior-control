<template>
  <div :class="{[titleType]: titleType, 'needBorder': needBorder}">
    <span style="color: #ff4949;margin-right:4px" v-if="required">*</span>
    <span>{{titleText}}</span>
    <div class="right_btn">
      <slot name="rightBtnBox"></slot>
    </div>
    <div class="left_btn">
      <slot name="leftBtnBox"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['titleText', 'titleType', 'required', 'needBorder'],
  data() {
    return{

    }
  }
}
</script>

<style lang="scss" scoped>
.page_title{
  font-size: 15px;
  color: #374c78;
  font-weight: 900;
  line-height: 40px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 10px;
  margin-top: 10px;
  border-bottom: 1px solid #b9cee3;
  margin-right: 10px;
  position: relative;
  &::before{
    content: "";
    width: 4px;
    height: 15px;
    background: #3a86ff;
    border-radius: 6px;
    margin-right: 10px;
    display: inline-block;
  }
}
.item_title{
  position: relative;
  font-size: 14px;
  color: #374c78;
  font-weight: 900;
  line-height: 26px;
  display: flex;
  align-items: center;
  margin-bottom: 0px;
  &::before{
    content: "";
    width: 10px;
    height: 10px;
    background: #3a86ff;
    border-radius: 50%;
    margin-right: 10px;
    display: inline-block;
  }
}
.right_btn{
  width: 80%;
  text-align: right;
  position: absolute;
  right: 0;
}
.left_btn{
  margin-left: 15px;
}
.needBorder{
  border-bottom: 1px solid #EBEEF5;
}
</style>
