<template>
  <div>
    <el-input @click.native="showwwww" size="mini" v-model="fullCompanyNames" style="position: absolute;top: 1px;z-index: 2;" :disabled="isDis"></el-input>
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
import {queryShortNameTree, commonTree} from "@/api/safeDanger/report"
import {mapGetters} from 'vuex'

export default {
  name: "workLog",
  props: {
    orgId: {
      type: String,
      require: false
    },
    //一级单位ID 和 名称
    firstCompany: {type: String, require: false},
    firstCompanyName: {type: String, require: false},

    //二级单位ID 和 名称
    secondCompany: {type: String, require: false},
    secondCompanyName: {type: String, require: false},

    disabledd: {type: Boolean, require: false, default: false}
  },
  computed: {
    // ...mapGetters([
    //   'nickName',
    //   'companyId',
    //   'companyCode',
    // ]),
    ...mapGetters(["userInfo","userDetail"]),
    vModel: {
      get() {
        return this.orgId
      },
      set(val) {
        this.$emit('update:orgId', val)
      }
    },
    fullCompanyNames: {
      get() {
        if (this.firstCompanyName && this.secondCompanyName) {
          return this.firstCompanyName + '-' + this.secondCompanyName
        } else if (this.firstCompanyName) {
          return this.firstCompanyName;
        } else if (this.secondCompanyName) {
          return this.secondCompanyName;
        } else {
          return null;
        }
      },
    },
  },
  data() {
    return {
      isDis: false,
      basicUnitSeconds: [],
      defaultProps: {
        // value: 'orgId',
        // label: 'shortName',
        // leaf: 'leaf',
        // children: 'shortNameVOList',
        // // checkStrictly: true,
        // emitPath: false,
        // expandTrigger: 'hover'



        value: 'regionCode',
        label: 'regionName',
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
    showwwww() {
      if (!this.isDis) {
        document.getElementById('idd').click()
      }
    },

    /** 查询已办列表 */
    getList() {
      if (this.disabledd) {
        this.isDis = this.disabledd
      } else {
        if (this.userDetail.regionCode != '37') { // 登录用户不是省公司
          // this.vModel = this.companyCode
          this.isDis = true
        } else {
          this.isDis = this.disabledd
        }
      }

      commonTree().then(res => {
        // console.log(88, res)
        this.basicUnitSeconds = res.data
        return
        if (this.companyCode != '05') {
          // 登录用户不是省公司 默认给当前责任单位赋值
          if (this.$store.state.user.companyCode.slice(-2) != '99') {
            //县公司
            this.basicUnitSeconds.forEach(el => {
              if (el.orgId == this.$store.state.user.companyCode) {
                this.$emit('update:secondCompanyName', el.shortName);
                this.$emit('update:secondCompany', el.orgId);

                this.$emit('update:firstCompanyName', el.parentName);
                this.$emit('update:firstCompany', el.parentId);
              }
            });
          } else {
            //市公司
            this.basicUnitSeconds.forEach(el => {
              if (el.shortNameVOList) {
                //判断是否为县公司
                el.shortNameVOList.forEach(ele => {
                  if (ele.orgId == this.$store.state.user.companyCode) {
                    this.$emit('update:secondCompanyName', ele.shortName);
                    this.$emit('update:secondCompany', ele.orgId);

                    this.$emit('update:firstCompanyName', el.shortName);
                    this.$emit('update:firstCompany', el.orgId);
                  }
                })
              }
            });
          }
        }
      })
    },
    // aaa(val){
    //   this.$emit('changes', val)
    // },


    secondCompanyChange(val) {
      if (val) {
        let firstCompany = this.$refs.lll.getCheckedNodes()[0].data.parentId
        // console.log(111, firstCompany)
        if (firstCompany) {
          let fItem = this.basicUnitSeconds.find(el => el.regionCode == firstCompany);
          if (fItem) {
            //一级单位ID和Name
            this.firstCompanyName = fItem.regionName;
            this.firstCompany = firstCompany;

            this.$emit('update:firstCompanyName', fItem.regionName);
            this.$emit('update:firstCompany', firstCompany);
          }
        }
      }
      if (this.userDetail.regionCode=='37') {
        let arrs = [];
        this.basicUnitSeconds.forEach(el => {
          if (el.children) {
            el.children.forEach(ele => {
              arrs.push(ele)
            })
          }
        });
        let fSecondItem = arrs.find(el => el.regionCode == val);
        if (fSecondItem) {
          this.secondCompanyName = fSecondItem.regionName;
          this.secondCompany = fSecondItem.regionCode;

          this.$emit('update:secondCompanyName', fSecondItem.regionName);
          this.$emit('update:secondCompany', fSecondItem.regionCode);
        }
      } else {
        let fSecondItem = this.basicUnitSeconds[0].children.find(el => el.regionCode == val);
        if (fSecondItem) {
          this.secondCompanyName = fSecondItem.regionName;
          this.secondCompany = fSecondItem.regionCode;

          this.$emit('update:secondCompanyName', fSecondItem.regionName);
          this.$emit('update:secondCompany', fSecondItem.regionCode);
        }
      }
      this.$emit('change', val)
    },
  }
}
</script>

<style scoped>

</style>
