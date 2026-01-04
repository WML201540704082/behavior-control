<template>
  <div>
    <!-- <TsFormDatePicker
      ref="handler"
      border="border"
      :value="value"
      :type="type"
      :format="format"
      @change="setData"
    ></TsFormDatePicker> -->
    <el-date-picker
      class="timePickerW"
      unlink-panels
      type="datetimerange"
      :format="configFormat"
      :value-format="configFormat"
      v-model="currentValue"
      @change="setData"
      range-separator="~"
      start-placeholde="开始时间"
      end-placeholde="结束时间"
      placeholder="选择时间范围">
    </el-date-picker>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    // TsFormDatePicker: resolve =>
    //   require(['@/resources/plugins/TsForm/TsFormDatePicker'], resolve)
  },
  props: {
    propConfig: {type: Object},
    attrData: {type: Object},
    valueList: {type: Array}
  },
  data() {
    return {
      currentValue: [],
      // "05:03:05", "05:03:08"

      type: 'datetime',
      format: 'yyyy-MM-dd'
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    // this.init();
    // console.log(112, this.attrData)
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
        if (this.valueList[0].indexOf('~') > -1) {
          this.currentValue =  [ this.valueList[0].split('~')[0],  this.valueList[0].split('~')[1] ]
        }
      }

    },
    init() {
      if (this.attrData) {
        this.type = this.attrData.config.type;
        this.format = this.attrData.config.format;
      }
    },
    setData(val) {
      let str;
      if(val){
        str = val[0] + '~' + val[1]
        if (str == '~') {
          str = '';
        }
      }else{
        str = '';
      }
      
      this.$emit('setData', str);
      // this.$emit('setValue', [val]);
    }
  },
  filter: {},
  computed: {
    configFormat: function() {
      
      const dataList = [];
      if (this.attrData.config && this.attrData.config.format) {
        return this.attrData.config.format
      }
      return "yyyy-MM-dd HH:mm:ss"
    },
    // value: function() {
    //   if (this.valueList && this.valueList.length > 0) {
    //     return this.valueList[0];
    //   } else {
    //     if (this.propConfig) {
    //       return this.propConfig.value;
    //     } else {
    //       return '';
    //     }
    //   }
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
    // propConfig: {
    //   handler: function(val) {
    //     if (val) {
    //       this.init();
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  }
};
</script>
<style lang="scss" scoped>
  .timePickerW{
    width: 100%;
  }
</style>
