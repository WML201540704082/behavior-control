<template>
  <div>
    <el-input v-if="disabledd" disabled size="mini" v-model="secondCompanyNames"></el-input>
    <el-cascader
      v-else
      ref="lll"
      :disabled="isDis"
      :show-all-levels="false"
      v-model="vModel"
      :options="basicUnitSeconds"
      :props="defaultProps"
      @change="secondCompanyChange"
      style="width: 100%"
      placeholder=""
      size="mini"
      clearable>
    </el-cascader>



    <!-- <el-cascader
      v-else
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
    </el-cascader> -->
  </div>
</template>

<script>
// import {queryShortNameTree} from "@/api/safeDanger/report"
import {commonTree} from "@/api/safeDanger/report"
import {categoryTree} from "@/api/safeDanger/supervisionUnit"
import {mapGetters} from 'vuex'

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
    ...mapGetters(["userInfo","userDetail"]),
    // ...mapGetters([
    //   'nickName',
    //   'companyId',
    //   'companyCode',
    // ]),
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
      get() {
        return this.firstCompany
      },
      set(val) {
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
    isDis() {
      return false
      // if (this.companyCode != '05' && this.companyCode != '059999' && !(!this.report && this.companyCode.length == 6 && this.companyCode.slice(-2) == '99')) { // 登录用户不是省公司
      //   return true
      // } else {
      //   return this.disabledd
      // }
    }
  },
  data() {
    return {
      basicUnitSeconds: [],
      // defaultProps: {
      //   value: 'orgId',
      //   label: 'shortName',
      //   leaf: 'leaf',
      //   children: 'shortNameVOList',
      //   emitPath: false,
      //   expandTrigger: 'hover'
      // },
      defaultProps: {
        value: 'id',
        label: 'name',
        leaf: 'leaf',
        children: 'children',
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
    /** 查询已办列表 */
    getList() {
      // if (this.companyCode != '05' && this.companyCode != '059999' && !(this.record && this.companyCode.length == 6 && this.companyCode.slice(-2) == '99')) { // 登录用户不是省公司  并且 隐患记录市级账号不是本部
      //   this.firstCompanys = this.companyCode.slice(0, 4)
      //   this.vModel = this.companyCode
      // } else {
      // }
      // queryShortNameTree().then(res => {
      //   this.basicUnitSeconds = res.data.shortNameVOList
      // })
      // console.log(123, this.userDetail.regionCode)
      commonTree().then(response => {
        this.basicUnitSeconds = response.data
      })
    },


    secondCompanyChange(val) {

      // if (val) {
      //   this.firstCompanys = this.$refs.lll.getCheckedNodes()[0].data.parentId
      // } else {
      //   this.firstCompanys = ''
      // }

      // let aaa;
      // if (this.companyCode == '05' || this.companyCode == '059999') {
      //   let arrs = []
      //   this.basicUnitSeconds.forEach(el => {
      //     if (el.shortNameVOList) {
      //       el.shortNameVOList.forEach(ele => {
      //         arrs.push(ele)
      //       })
      //     }

      //   })
      //   aaa = arrs.filter(el => el.orgId == val)[0].shortName
      // } else {
      //   aaa = this.basicUnitSeconds.filter(el => el.orgId == val)[0].shortName
      // }


      // console.log(8888, val)
      // this.secondCompanyNames = val;
      // this.$emit('change', val)
    },
  }
}
</script>

<style scoped>

</style>
