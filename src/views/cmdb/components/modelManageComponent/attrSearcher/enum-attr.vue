<template>
  <div>
    <!-- <TsFormRadio
      ref="handler"
      :value="value"
      :dataList="dataList"
      :allowToggle="true"
      @change="setData"
    ></TsFormRadio> -->
    <el-radio 
      v-for="item in dataList"
      :key="item.value"
      v-model="currentValue" 
      :label="item.value"
      @click.native.prevent="clickRadio(item.value)"
    > {{ item.text }} </el-radio>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    // TsFormRadio: resolve => require(['@/resources/plugins/TsForm/TsFormRadio'], resolve)
  },
  props: {
    attrData: { type: Object },
    valueList: { type: Array }
  },
  data() {
    return {
      currentValue: '',
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    
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
    clickRadio(currentValue){
      // console.log(111, currentValue)
      if(this.currentValue == currentValue){
        this.currentValue = null
      }else{
        this.currentValue = currentValue
      }

      this.setData(this.currentValue)
    },
    setData(val) {
      this.$emit('setData', [val]);
      // this.$emit('setValue', [val]);
    },
    valid() {
      //验证数据合法性
      const handler = this.$refs['handler'];
      return handler.valid();
    }
  },
  filter: {},
  computed: {
    dataList: function() {
      const dataList = [];
      if (this.attrData.config && this.attrData.config.members) {
        this.attrData.config.members.forEach(element => {
          if (element && element.trim()) {
            dataList.push({text: element.trim(), value: element.trim()});
          }
        });
      }
      return dataList;
    },
    value: function() {
      if (this.valueList && this.valueList.length > 0) {
        return this.valueList[0];
      } 
      return '';
    }
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
