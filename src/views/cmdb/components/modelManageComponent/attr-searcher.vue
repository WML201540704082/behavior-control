<template>
  <div>
    <!-- @select="selectNewCiEntity($event)" -->
    <component
      :is="attrData.type+'attr'"
      v-if="attrData && attrData.type"
      ref="attrHandler"
      :attrData="attrData"
      :valueList="valueList"
      @setData="setData"
    ></component>
  </div>
</template>
<script>
import * as handlers from './attrSearcher';
export default {
  name: '',
  components: {
    ...handlers
  },
  props: {
    attrData: { type: Object },
    valueList: {type: Array}
  },
  data() {
    return {};
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    // console.log(9990111, this.attrData, this.valueList)
    
  },
  beforeUpdate() {},
  updated() {
  },
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    setData(value, actualValue) {
      if (typeof value == 'undefined' || value == null) {
        value = [];
      }

      if (typeof actualValue == 'undefined' || actualValue == null) {
        actualValue = value;
      }

      if (Array.isArray(value)) {
        this.$emit('setData', value, actualValue);
      } else {
        this.$emit('setData', [value], [actualValue]);
      }
    }
  },
  filter: {},
  computed: {},
  watch: {
    // valueList:{
    //   handler(newVal, oldVal){
    //     this.$refs.attrHandler.getData()
    //   },
    //   deep: true
    // }
  }
};
</script>
<style lang="less" scoped>
</style>
