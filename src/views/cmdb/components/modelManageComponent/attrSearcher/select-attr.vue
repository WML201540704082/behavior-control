<template>
  <!-- 下拉框 表格 -->
  <div>
    <!-- <TsFormSelect
      ref="handler"
      v-bind="searchConfig"
      :value="valueList"
    ></TsFormSelect> -->
    <el-select v-model="currentValue" placeholder="请输入" @change="setData">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
// import TsFormSelect from '@/resources/plugins/TsForm/TsFormSelect';
import {
  targetciSearch
} from "@/api/system/ciModel";
export default {
  name: '',
  components: {
    // TsFormSelect
  },
  props: {
    attrData: {type: Object},
    valueList: { type: Array }
  },
  data() {
    return {
      options: [],
      currentValue: '',


      multiple: false,
      validateList: [],
      searchConfig: {
        multiple: true,
        border: 'border',
        search: true,
        width: '100%',
        dynamicUrl: '/api/rest/cmdb/attr/targetci/search?attrId=' + this.attrData.id,
        textName: 'name',
        valueName: 'id',
        transfer: true,
        onChange: (val, opt) => {
          if (opt) {
            if (Array.isArray(opt)) {
              this.$emit('setData', val, opt.filter(d => d.text));
            } else {
              this.$emit('setData', val, opt.text);
            }
          } else {
            this.$emit('setData', '', '');
          }
        }
      }
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    // this.getData()
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    setData(val) {
      this.$emit('setData', [val]);
    },
    getData(){
      let params = {
        attrId: this.attrData.id,
        currentPage: 1,
        keyword: "",
        pageSize: 20
      }
      targetciSearch(params).then(res=>{
        // console.log(8801, res)
        this.options = res.Return
      })


      if (this.valueList && this.valueList.length > 0) {
        this.currentValue =  this.valueList[0]
      } else {
        this.currentValue =  ''
      }
    },
  },
  filter: {},
  computed: {
  },
  watch: {
    valueList: {
      handler(newValue, oldValue) {
        this.getData()
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
</style>
