<template>
  <div>
    <el-cascader
      ref="lll"
      size="mini"
      :disabled="isDis"
      v-model="vModel"
      :options="basicUnitSeconds"
      :props="defaultProps"
      :show-all-levels="false"
      @change="secondCompanyChange"
      style="width: 100%"
      placeholder=""
      clearable>
    </el-cascader>
  </div>
</template>

<script>
import { getAreaTree } from "@/api/safeDanger/networkSecure"
import { queryShortNameTree } from "@/api/safeDanger/report"
import { mapGetters } from 'vuex'
export default {
  name: "workLog",
  props: {
    orgId: {
      type: String,
      require: false
    },
    firstCompany: {
      type: String,
      require: false
    },
    secondCompanyName: {
      type: String,
      require: false
    },
    disabledd: {
      type: Boolean,
      require: false,
      default: false
    },
    record: {
      type: Boolean,
      require: false
    },
    report: {
      type: Boolean,
      require: false
    }
   
  },
  computed: {
    ...mapGetters([
      'userDetail'
    ]),
    vModel: {
      get() {
        return this.orgId
      },
      set(val) {
        
        // setTimeout(() => {
        //   if(val){
        //     this.firstCompanys = this.$refs.lll.getCheckedNodes()[0].data.parentId
        //   }else{
        //     this.firstCompanys = ''
        //   }
        // }, 1500);
          
        this.$emit('update:orgId', val)
      }
    },
    firstCompanys: {
      get(){
        return this.firstCompany
      },
      set(val){
        this.$emit('update:firstCompany', val)
      }
    },
    secondCompanyNames: {
      get() {
        return this.secondCompanyName
      },
      set(val) {
        this.$emit('update:secondCompanyName', val)
      }
    },
    isDis(){
      // return this.disabledd  && this.basicUnitSeconds[0] && !this.basicUnitSeconds[0].shortNameVOList
      if(this.userDetail.regionCode != '37' && !( !this.report )){ // 登录用户不是省公司
        return true
      }else{
        return this.disabledd
      }
    }
  },
  data() {
    return {
      // isDis: false,
      basicUnitSeconds: [],
      // defaultProps: {
      //   value: 'orgId',
      //   label: 'shortName',
      //   leaf: 'leaf',
      //   children: 'shortNameVOList',
      //   // checkStrictly: true,
      //   emitPath: false,
      //   expandTrigger: 'hover'
      // },
      defaultProps: {
        value: 'code',
        label: 'shortName',
        leaf: 'leaf',
        children: 'children',
        // checkStrictly: true,
        // emitPath: false,
        expandTrigger: 'hover',
        emitPath: false
      },
    }
  },
  created() {

  },
  mounted() {
    this.getList();
  },
  methods: {
    /** 查询已办列表 */
    getList() {
      if(this.userDetail.regionCode != '37' && !( this.record && this.userDetail.regionCode.length==6 && this.userDetail.regionCode.slice(-2)=='99' ) ){ // 登录用户不是省公司  并且 隐患记录市级账号不是本部
        this.firstCompanys = this.userDetail.regionCode.slice(0, 4)
        this.vModel = this.userDetail.regionCode
        // this.isDis = true
      }else{
        // this.isDis = this.disabledd
      }
      // queryShortNameTree().then(res=>{
      //   this.basicUnitSeconds = res.data.shortNameVOList
      // })
      getAreaTree({code: '37'}).then(res=>{
        this.basicUnitSeconds = res.data
      })
    },
    // aaa(val){
    //   this.$emit('changes', val)
    // },


    secondCompanyChange(val){
      // console.log(818, val, this.$refs.lll.getCheckedNodes()[0])

      // console.log(6, this.$refs.lll.getCheckedNodes()[0].data) 
      if(val){
        this.firstCompanys = this.$refs.lll.getCheckedNodes()[0].data.parentId
      }else{
        this.firstCompanys = ''
      }
      let aaa = this.$refs.lll.getCheckedNodes()[0].label;
      this.secondCompanyNames = aaa;
      this.$emit('change', val)

      // let aaa;
      // if(this.userDetail.regionCode == '37'){
      //   let arrs = []
      //   this.basicUnitSeconds.forEach(el=>{
      //     if(el.shortNameVOList){
      //       el.shortNameVOList.forEach(ele=>{
      //         arrs.push(ele)
      //       })
      //     }
          
      //   })
      //   aaa = arrs.filter(el=> el.orgId == val)[0].shortName
      // }else{
      //   aaa = this.basicUnitSeconds.filter(el=> el.orgId == val)[0].shortName
      // }

      
      // console.log(8888, aaa)
      
    },
  }
}
</script>

<style scoped>

</style>
