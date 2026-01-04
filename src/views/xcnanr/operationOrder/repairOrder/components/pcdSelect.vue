<template>
  <div style="display: flex;">
    <el-select
      v-show="inputNumShow >= 1"
      v-model="provinceData"
      clearable
      @change="provinceChange"
      filterable
      placeholder="请选择省"
      style="width: 129px; margin-right: 2px;"
      :disabled="disabled">
      <el-option v-for="item in provinceDataOpt" :key="item.n" :label="item.n" :value="item.n"></el-option>
    </el-select>
    <el-select
      v-show="inputNumShow >= 2"
      clearable
      no-data-text="请选择上级"
      v-model="cityData"
      @change="cityChange"
      filterable
      placeholder="请选择市"
      style="width: 129px; margin-right: 2px;"
      :disabled="disabled">
      <el-option v-for="item in cityDataOpt" :key="item.n" :label="item.n" :value="item.n"></el-option>
    </el-select>
    <el-select
      v-show="inputNumShow >= 3"
      clearable
      no-data-text="请选择上级"
      @change="areaChange"
      v-model="areaData"
      filterable
      placeholder="请选择区县"
      style="width: 129px;"
      :disabled="disabled">
      <el-option v-for="item in areaDataOpt" :key="item.n" :label="item.n" :value="item.n"></el-option>
    </el-select>
    <!--    <el-select :style="{marginLeft:inputInterval+'px'}"  @change="streetChange" v-show="inputNumShow>=4"  clearable no-data-text="请选择上级" v-model="streetData"-->
    <!--               filterable placeholder="请选择城镇村" :disabled="disabled">-->
    <!--      <el-option v-for="item in streetDataOpt" :key="item.n" :label="item.n" :value="item.n"></el-option>-->
    <!--    </el-select>-->
  </div>
</template>

<script>
import addressData from "@/api/xcnanr/area_format_object.json"; //山东省市区街道数据

export default {
  name: "hsk-addressSel",
  props: {
    inputNumShow: {
      type: Number,
      default: 4,
    },
    inputInterval: {
      type: Number,
      default: 10
    },
    defaultAddress: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      provinceData: undefined,
      cityData: undefined,
      areaData: undefined,
      streetData: undefined,
      provinceDataOpt: [], // 省,自治区，直辖市，特别行政区都在其中
      cityDataOpt: [], // 市数据
      areaDataOpt: [], // 区数据
      streetDataOpt: [], //城镇
      sourceData: null,
    }
  },
  created() {
    // 省市区镇数据处理,将省市区镇数据分离出来
    this.dataProces()
  },
  mounted() {
    // 可能是省市区，也可能是省市，也可能是省市县镇
    if (typeof (this.defaultAddress[0]) !== "undefined") {
      this.provinceData = this.defaultAddress[0]
      this.provinceChange(this.defaultAddress[0])
    }
    if (typeof (this.defaultAddress[1]) !== "undefined") {
      this.cityData = this.defaultAddress[1]
      this.cityChange(this.defaultAddress[1])
    }
    if (typeof (this.defaultAddress[2]) !== "undefined") {
      this.areaData = this.defaultAddress[2]
      this.areaChange(this.defaultAddress[2])
    }
    if (typeof (this.defaultAddress[3]) !== "undefined") {
      this.streetData = this.defaultAddress[3]
      this.streetChange(this.defaultAddress[3])
    }
  },
  methods: {
    // 数据初始化处理
    dataProces() {
      // 初始化
      this.provinceDataOpt = []
      this.cityDataOpt = []
      this.areaDataOpt = []
      this.streetDataOpt = []
      this.sourceData = undefined
      this.cityData = undefined
      this.areaData = undefined
      this.streetData = undefined
      this.sourceData = addressData
      // 递归，为每层添加level，区分省，市，县，镇,并将数据放入指定变量中使用
      this.addLevel(this.sourceData)
    },
    /**
     * 递归为每个层级添加一个level
     * 0.（省,自治区,直辖市,特别行政区）、
     * 1.（市，直辖市，特别行政区）、
     * 2.（区，县，镇）、
     * 3. （城，镇，街道）、
     * 将省市区城镇放入到指定的provinceData，cityData，areaData，streetData
     */
    addLevel(data, level = 0) {
      for (const key in data) {
        if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
          data[key].level = level;
          if (level === 0) {
            this.provinceDataOpt.push(data[key])
          }
          if ('c' in data[key]) {
            this.addLevel(data[key].c, level + 1);
          }
        }
      }
    },
    /**
     * 当省份改变选中时触发,获取市，直辖市，行政区，自治区
     */
    provinceChange(e) {
      this.cityDataOpt = []
      this.cityData = undefined
      this.areaData = undefined
      this.areaDataOpt = []
      this.streetData = undefined
      this.streetDataOpt = []
      // 根据选中项确定市，直辖市，或者特别行政区的数据
      for (let i = 0; i < this.provinceDataOpt.length; i++) {
        if (e === this.provinceDataOpt[i].n) {
          // 获取市的内容放入市区数组
          for (let j in this.provinceDataOpt[i].c) {
            // 获取市，直辖市，行政区，自治区
            this.cityDataOpt.push(this.provinceDataOpt[i].c[j])
          }
        }
      }
      this.$emit("addressChange", [this.provinceData])
    },
    /**
     * 当市区修改的时候触发，获取县，区
     */
    cityChange(e) {
      this.areaData = undefined
      this.areaDataOpt = []
      this.streetData = undefined
      this.streetDataOpt = []
      // 拿到县区选项
      for (let i = 0; i < this.cityDataOpt.length; i++) {
        if (e === this.cityDataOpt[i].n) {
          for (let j in this.cityDataOpt[i].c) {
            this.areaDataOpt.push(this.cityDataOpt[i].c[j])
          }
        }
      }
      this.$emit("addressChange", [this.provinceData, this.cityData])
    },
    /**
     * 当前区县修改时触发，获取城镇选项列表
     */
    areaChange(e) {
      this.streetData = undefined
      this.streetDataOpt = []
      // 拿到城镇庄村选项
      for (let i = 0; i < this.areaDataOpt.length; i++) {
        if (e === this.areaDataOpt[i].n) {
          for (let j in this.areaDataOpt[i].c) {
            this.streetDataOpt.push(this.areaDataOpt[i].c[j])
          }
        }
      }
      this.$emit("addressChange", [this.provinceData, this.cityData, this.areaData])
    },
    streetChange(e) {
      this.$emit("addressChange", [this.provinceData, this.cityData, this.areaData, e])
    }
  }
}
</script>

<style></style>
