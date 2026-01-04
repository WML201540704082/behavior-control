<template>
   <div class="page_set_title">
    <div class="t_content">
         <i class="el-icon-s-tools"></i>
         <span>{{titleText}}</span>
    </div>
   
   <div class="right_b" v-if='showBtn'>
        <el-button type="primary" v-if="titleText=='全局配置'" @click='saveClick'>保存</el-button>
        <el-button type="primary" v-else  @click="editClick" plain>{{title}}</el-button>
   </div>


   </div>
</template>

<script>
export default {
  props: {
    titleText:{
      type:String,
      default:'',
    },
    showBtn:{
      type:Boolean,
      default:true,
    }
  },
  data() {
    return{
      title:'修改',
    }
  },
  methods:{
    editClick(){
           let text = this.titleText;
           if(this.title === '修改'){
            this.$emit('edit',text);
            this.title = '保存';
           }else{
            this.$emit('save',text);
           }
    },
    saveClick(){
      let text = this.titleText;
      this.$emit('save',text);
      
    },

    setBtnTitleC(){
      this.title = '修改';
    },
  },
}
</script>

<style lang="scss" scoped>
.page_set_title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top:10px;
    span{
        font-size: 14px;
        margin-left: 8px;
        font-size: 15px;
       color: #374c78;
       font-weight: 700;
    }

  /deep/ .el-icon-s-tools:before{
        color: #3a86ff;
    }

    .t_content{
      text-align: left;
    }
    .right_b{
      text-align: right;
    }

}
</style>
