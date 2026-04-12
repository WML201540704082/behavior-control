<template>
  <!-- 输入框 表达式 -->
  <div>
    <el-input v-model="currentValue" @change="setData" placeholder="请输入" clearable></el-input>
    <!-- <TsFormInput
      ref="handler"
      border="border"
      :value="value"
      :clearable="true"
      @change="setData"
    ></TsFormInput> -->
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    // TsFormInput: resolve => require(['@/resources/plugins/TsForm/TsFormInput'], resolve)
  },
  props: {
    attrData: { type: Object },
    valueList: { type: Array }
  },
  data() {
    return {
      // currentValue: this.value ? this.value : '',
      currentValue: '',
      validateList: []
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
    getData(){
      if (this.valueList && this.valueList.length > 0) {
        this.currentValue =  this.valueList[0]
      } else {
        this.currentValue =  ''
      }
    },
    setData(val) {
      this.$emit('setData', [val]);
    },
    valid() {
      //验证数据合法性
      const handler = this.$refs['handler'];
      return handler.valid();
    }
  },
  filter: {},
  computed: {
    // value: function() {
    //   if (this.valueList && this.valueList.length > 0) {
    //     return this.valueList[0];
    //   } 
    //   return '';
    // }
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
