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
    <el-time-picker
      class="timePickerW"
      is-range
      format="HH:mm:ss"
      value-format="HH:mm:ss"
      v-model="currentValue"
      @change="setData"
      range-separator="至"
      start-placeholde="开始时间"
      end-placeholde="结束时间"
      placeholder="选择时间范围">
    </el-time-picker>
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
      currentValue: ['', ''],
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
    }
  },
  filter: {},
  computed: {
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
