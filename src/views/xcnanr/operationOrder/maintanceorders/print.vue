<template>
  <div v-show="true">
    <el-form ref="orderInfo" class="xt_form" :model="orderInfo" inline size="small" label-suffix=":" label-width="100px" style="width: 1500px;">
      <div style="width: 100%;">
        <span style="text-align: center;display: block;font-weight: bold;">{{ '维修工单【' + orderInfo.code + '】' }}</span>
      </div>
      <el-form-item label="公司" style="margin-top: 50px;">
        <el-input style="width: 500px" v-model="orderInfo.companyName" disabled></el-input>
      </el-form-item>
      <el-form-item label="部门" style="margin-top: 50px;">
        <el-input style="width: 500px" v-model="orderInfo.deptName" disabled></el-input>
      </el-form-item>
      <el-form-item label="报修人" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="orderInfo.user" disabled></el-input>
      </el-form-item>
      <el-form-item label="报修人部门" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="orderInfo.userDeptName" disabled></el-input>
      </el-form-item>
      <el-form-item label="联系方式" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="orderInfo.tel" disabled></el-input>
      </el-form-item>
      <el-form-item label="维修类型" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="typeStr" disabled></el-input>
      </el-form-item>
      <el-form-item label="维修人" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="orderInfo.repairPerson" disabled></el-input>
      </el-form-item>
      <el-form-item label="工单状态" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="statusStr" disabled></el-input>
      </el-form-item>
      <el-form-item label="维修设备" style="margin-top: 15px;">
        <el-input style="width: 1110px" v-model="orderInfo.deviceName" disabled></el-input>
      </el-form-item>
      <el-form-item label="报修位置" style="margin-top: 15px;">
        <el-input style="width: 1110px" v-model="orderInfo.position" disabled></el-input>
      </el-form-item>
      <el-form-item label="报修内容" style="margin-top: 15px;">
        <el-input style="width: 1110px" type="textarea" :rows="3" v-model="orderInfo.content" disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import printJS from 'print-js'

export default {
  props: {
    orderInfo: {
      type: Object,
      default: ()=>{}
    },
    typeStr: {
      type: String,
      default:''
    },
    statusStr: {
      type: String,
      default:''
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"]),
    orderTimes() {
      // debugger
      const startTime = this.orderInfo.startTime
      const finishTime = this.orderInfo.finishTime
      const times = (startTime && finishTime) ? [startTime, finishTime] : []
      return times
    }
  },
  mounted() {},
  methods: {
    /**
     * 打印表单
     */
    printForm() {
      // 获取表单元素
      const formElement = this.$refs.orderInfo.$el
      // 使用 Print.js 打印表单
      printJS({
        printable: formElement,
        type: 'html',
        targetStyles: ['*'], // 打印时包含所有样式
        maxWidth:1300,
        scanStyle: true,
        handler:null,
        footer:null,
        style: 'body { zoom: 80%;size: landscape;  }'
      })
    },
  }
}
</script>

<style lang="scss" scoped>
/* styles.css */
@media print {
  @page {
    size: landscape; /* 设置打印页面为横向 */
  }
}
</style>
