<template>
  <div class="ict_page">
  <div class="ict_page111" :class="activeName == 2? 'topback2':(activeName == 0 ? 'topback1' : 'topback3') ">
    <el-button class="fanhui" type="primary" @click="goIndex">< 返回</el-button>
    <div class="bottom_back"></div>
    <div class="page_content">
      <div class="tabs_header">
        <div
          class="tabs_header_item" 
          v-for="(item, index) in tabsItems"
          :key="index"
          :class="activeName == item.tabName? 'is_active':''"
          @click="handleTabsItem(item, index)"
        >
          <span>{{item.name}}</span>
        </div>
      </div>
      <div class="tabs_content" style="overflow: visible;">
        <component 
          :is="componentName" 
          @submitQuestion="componentName = 'questionForm'" 
          @myQuestionList="componentName = 'myQuestionList'"
          @backQuestion="componentName = 'questionSubmit'"
          @questionBook="componentName = 'questionBook'"
        />
      </div>
    </div>
     
      <el-backtop target='.ict_page'></el-backtop>
  </div>  
  </div>

 
</template>

<script>
import intelligenceAnswer from './components/intelligenceAnswer';
import questionSubmit from './components/questionSubmit';
import resourceSupport from './components/resourceSupport';
import tab4 from './components/tab4';
import tab5 from './components/tab5';
import questionForm from './components/questionComponents/questionForm'
import myQuestionList from './components/questionComponents/myQuestionList'
import questionBook from './components/questionComponents/questionBook'


export default {
  components: {
    intelligenceAnswer,
    questionSubmit,
    resourceSupport,
    questionForm,
    myQuestionList,
    questionBook,
    tab4,
    tab5
  },
  data() {
    return{
      activeName: '1',
      componentName: '',
      tabsItems: [
        {name: '首页', tabName: '4', componentName: ''},
        {name: '问题提报', tabName: '1', componentName: 'questionSubmit'},
        {name: '信创知识库', tabName: '2', componentName: 'resourceSupport'},
        {name: '智能问答', tabName: '0', componentName: 'intelligenceAnswer'},
        {name: '个人中心', tabName: '3', componentName: 'tab4'},
        // {name: '系统管理', tabName: '5', componentName: 'tab5'},
      ]
    }
  },
  created(){
    
    
  },
  computed: {
    isRoleAlias(){
      // console.log(123333, this.$store.state.user.userDetail.roleAlias.includes('control_solver'))
      return this.$store.state.user.userDetail.roleAlias.includes('control_solver')
    },
  },
  watch: {
    '$store.state':{
      handler( newVal, oldVal ){
        // console.log(11122, newVal, this.isRoleAlias)
          if(this.isRoleAlias && !this.tabsItems.some(el=>el.name == '系统管理')){
            this.tabsItems.push(
              {name: '系统管理', tabName: '5', componentName: 'tab5'}
            )
          }
      },
      immediate: true,
      deep: true
    }
    // 'isRoleAlias'(newVal, oldVal) {
    //   if(newVal){
    //     this.tabsItems.push(
    //       {name: '系统管理', tabName: '5', componentName: 'tab5'}
    //     )
    //   }
    // },
  },
  mounted() {
    document.title = '信创运维'; //设置浏览器表退
    // if(this.$route.query.third == 1){
    //   this.handleTabsItem(this.tabsItems[2])
    // }

    // if(this.isRoleAlias){
    //   this.tabsItems.push(
    //     {name: '系统管理', tabName: '5', componentName: 'tab5'}
    //   )
    // }

    let tabIndex = sessionStorage.getItem('tabIndex')
    if(tabIndex){
      let obj = this.tabsItems.filter(ele=> ele.tabName == tabIndex)[0]
      this.handleTabsItem(obj)
      // this.componentName = obj.componentName
    }else{
      // this.componentName = 'questionSubmit'
      this.handleTabsItem(this.tabsItems[1])
    }


    

  },
  methods: {
    goIndex(){
      this.$router.push("/wel/index")
    },
    handleTabsItem(item, index) {
      if(item.tabName != 4){
        sessionStorage.setItem('tabIndex', item.tabName)
      }
      
      if( item.tabName==4 ){ // 首页
        this.$router.push("/ictHome")
        return
      }

      this.activeName = item.tabName
      this.componentName = item.componentName
    }
  }
}
</script>

<style lang="scss" scoped>
.fanhui{
  position: fixed;
  left: 30px;
  top: 30px;
}
.ict_page111{
  background-repeat: no-repeat;
  position: relative;
  padding: 1px;
  user-select: none;
  &.topback1{
    background-image: url('./img/topback1.png');
  }
  &.topback2{
    background-image: url('./img/topback2.png');
  }
   &.topback3{
    background-image: url('./img/xc_bg.png');
  }
}
.ict_page{
  height: calc(100% - 20px);
  overflow-y: auto;

  // background-repeat: no-repeat;
  // position: relative;
  // padding: 1px;
  // user-select: none;
  // &.topback1{
  //   background-image: url('./img/topback1.png');
  // }
  // &.topback2{
  //   background-image: url('./img/topback2.png');
  // }
  //  &.topback3{
  //   background-image: url('./img/xc_bg.png');
  // }
  ::v-deep *{box-sizing: border-box;}
  .bottom_back{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: calc(100% - 555px);
    background: linear-gradient(180deg, #fff 0%, rgba(206,229,255,0.8) 100%);
    display: none;
    z-index: -1;
  }
  .page_content{
    width: 1280px;
    margin: 0 auto;
    height: calc(100% - 350px);
    margin-top: 300px;
    // overflow-y: auto;
  }
  .tabs_header{
    width: 100%;
    height: 60px;
    padding: 0px 33px;
    box-sizing: border-box;
    border-radius: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #c2d6ff 100%);
    box-shadow: 0px 4px 13px 0px rgba(255,255,255,0.25);
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: 0.85;
    margin-bottom: 25px;
    &_item {
      color: #333;
      font-size: 18px;
      height: 45px;
      line-height: 45px;
      font-weight: bold;
      width: 387px;
      text-align: center;
      cursor: pointer;
    }
    &_item.is_active{
      background: linear-gradient(180deg, #109bff 0%, #022eff 85%, #0019ff 100%);
      box-shadow: 0px 4px 13px 0px rgba(255,255,255,0.5);
      border-radius: 6px;
      color: #fff;
    }
  }
  .tabs_content{
    // height: calc(100% - 85px);
    box-sizing: border-box;
    overflow-y: auto;
  }
}
</style>
