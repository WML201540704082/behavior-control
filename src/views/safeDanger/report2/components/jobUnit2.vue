<template>
  <div>
    <el-input @click.native="showwwww" size="mini" v-model="secondCompanyNames" style="position: absolute;top: 1px;z-index: 2;"></el-input>
    <el-cascader
      ref="lll"
      id="idd"
      size="mini"
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
import { queryShortNameTree } from "@/api/safeDanger/report"
import { mapGetters } from 'vuex'
export default {
  name: "workLog",
  props: {
    orgId: {
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
    }
  },
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
    ]),
    vModel: {
      get() {
        return this.orgId
      },
      set(val) {
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
        // setTimeout(() => {
        //   if(val){
        //     this.firstCompanys = this.$refs.lll.getCheckedNodes()[0].data.parentId
        //   }else{
        //     this.firstCompanys = ''
        //   }
        // }, 1500);

        this.$emit('update:secondCompanyName', val)
      }
    },
  },
  data() {
    return {
      isDis: false,
      basicUnitSeconds: [],
      defaultProps: {
        value: 'orgId',
        label: 'shortName',
        leaf: 'leaf',
        children: 'shortNameVOList',
        // checkStrictly: true,
        emitPath: false,
        expandTrigger: 'hover'
      },
    }
  },
  created() {

  },
  mounted() {
    this.getList();
  },
  methods: {
    showwwww(){
      document.getElementById('idd').click()
    },

    /** 查询已办列表 */
    getList() {
      if(this.companyCode != '05'){ // 登录用户不是省公司
        // this.vModel = this.companyCode
        this.isDis = true
      }else{
        this.isDis = this.disabledd
      }
      queryShortNameTree().then(res=>{
        // console.log(88, res)
        this.basicUnitSeconds = res.data.shortNameVOList
      })
    },
    // aaa(val){
    //   this.$emit('changes', val)
    // },


    secondCompanyChange(val){
      if(val){
        this.firstCompanys = this.$refs.lll.getCheckedNodes()[0].data.parentId
      }else{
        this.firstCompanys = ''
      }
      
      let aaa;
      if(this.companyCode == '05'){
        let arrs = []
        // console.log(12255, this.basicUnitSeconds)
        this.basicUnitSeconds.forEach(el=>{
          if(el.shortNameVOList){
            el.shortNameVOList.forEach(ele=>{
              arrs.push(ele)
            })
          }
          
        })
        aaa = arrs.filter(el=> el.orgId == val)[0].shortName
      }else{
        aaa = this.basicUnitSeconds[0].shortNameVOList.filter(el=> el.orgId == val)[0].shortName
      }

      
      // console.log(8888, aaa)
      this.secondCompanyNames = aaa

      this.$emit('change', val)
    },
  }
}
</script>

<style scoped>

</style>
