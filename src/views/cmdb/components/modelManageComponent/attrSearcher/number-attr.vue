<template>
  <div style="display:grid;grid-template-columns: 47% 6% 47%;grid-gap: 0px;">
    <div>
      <!-- <TsFormInput
        ref="handler"
        type="number"
        :value="valueB"
        @change="setDataBefore"
        @on-keydown="validInput"
      ></TsFormInput> -->
      <el-input 
        type="number"
        v-model="valueB" 
        @change="setData" 
        placeholder="" 
        clearable>
      </el-input>
    </div>
    <div style="text-align:center">~</div>
    <div>
      <el-input 
        type="number"
        v-model="valueA" 
        @change="setData" 
        placeholder="" 
        clearable>
      </el-input>
      <!-- <TsFormInput
        ref="handler"
        type="number"
        :value="valueA"
        @change="setDataAfter"
        @on-keydown="validInput"
      ></TsFormInput> -->
    </div>
  </div>
</template>
<script>
// import TsFormInput from '@/resources/plugins/TsForm/TsFormInput';
export default {
  name: '',
  components: {
    // TsFormInput
  },
  props: {
    attrData: { type: Object },
    valueList: { type: Array }
  },
  data() {
    return {
      valueB: '',
      valueA: '',
      valueBefore: '',
      valueAfter: ''
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
        if (this.valueList[0].indexOf('~') > -1) {
          this.valueB = this.valueList[0].split('~')[0]
          this.valueA = this.valueList[0].split('~')[1]
        }
      }
    },
    setData(val) {
      this.valueBefore = val;
      let v = this.valueB + '~' + this.valueA;
      if (v == '~') {
        v = '';
      }

      this.$emit('setData', [v]);
      this.$emit('setValue', [v]);
    },
    // setDataBefore(val) {
    //   this.valueBefore = val;
    //   let v = this.valueBefore + '~' + this.valueAfter;
    //   if (v == '~') {
    //     v = '';
    //   }
    //   this.$emit('setData', [v]);
    //   this.$emit('setValue', [v]);
    // },
    // setDataAfter(val) {
    //   this.valueAfter = val;
    //   let v = this.valueBefore + '~' + this.valueAfter;
    //   if (v == '~') {
    //     v = '';
    //   }
    //   this.$emit('setData', [v]);
    //   this.$emit('setValue', [v]);
    // },
    validInput(event, val) {
      if ((val == '' && event.key == '-') || event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'Backspace' || (event.keyCode >= 48 && event.keyCode <= 57) || (val.toString().indexOf('.') == -1 && event.key == '.')) {
        event.returnValue = true;
      } else {
        event.returnValue = false;
      }
    },
    valid() {
      //验证数据合法性
      const handler = this.$refs['handler'];
      return handler.valid();
    }
  },
  filter: {},
  computed: {
    // valueB: function() {
    //   if (this.valueList && this.valueList.length > 0) {
    //     if (this.valueList[0].indexOf('~') > -1) {
    //       return this.valueList[0].split('~')[0];
    //     }
    //   } 
    //   return '';
    // },
    // valueA: function() {
    //   if (this.valueList && this.valueList.length > 0) {
    //     if (this.valueList[0].indexOf('~') > -1) {
    //       return this.valueList[0].split('~')[1];
    //     }
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
    // valueB: {
    //   handler: function(val) {
    //     this.valueBefore = val;
    //   },
    //   immediate: true
    // },
    // valueA: {
    //   handler: function(val) {
    //     this.valueAfter = val;
    //   },
    //   immediate: true
    // }
  }
};
</script>
<style lang="less" scoped>
</style>
