<template>
  <div v-show="true">
    <el-form ref="orderInfo" class="xt_form" :model="orderInfo" inline size="small" label-suffix=":" label-width="100px" style="width: 1500px;">
      <div style="width: 100%;">
        <span style="text-align: center;display: block;font-weight: bold;">{{ '巡视工单【' + orderInfo.code + '】' }}</span>
      </div>
      <el-form-item label="公司" style="margin-top: 50px;">
        <el-input style="width: 500px" v-model="orderInfo.companyName" disabled></el-input>
      </el-form-item>
      <el-form-item label="部门" style="margin-top: 50px;">
        <el-input style="width: 500px" v-model="orderInfo.deptName" disabled></el-input>
      </el-form-item>
      <el-form-item label="巡视类型" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="dictForOrderType" disabled></el-input>
      </el-form-item>
      <el-form-item label="预置巡视人" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="orderInfo.workers" disabled></el-input>
      </el-form-item>
      <el-form-item label="巡视时间段" style="margin-top: 15px;">
        <el-date-picker v-model="orderTimes" type="datetimerange" range-separator=" ~ " value-format="yyyy-MM-dd HH:mm:ss" disabled style="width: 500px;margin-top: 4px;"/>
      </el-form-item>
      <el-form-item label="工单状态" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="dictForOrderStatus" disabled></el-input>
      </el-form-item>
      <el-form-item label="巡视内容" style="margin-top: 15px;">
        <el-input style="width: 1110px" type="textarea" :rows="3" v-model="orderInfo.content" disabled></el-input>
      </el-form-item>
      <el-table ref="tableData2" :data="orderInfo.orderDetailList" size="small" style="width: 1300px;margin-top: 15px" stripe>
        <el-table-column type="index" align="center" label="序号" width="60px"/>
        <el-table-column :label="orderInfo.type === 1 ?'机房名称': '设备名称'" prop="objectName" width="130" align="center" />
        <el-table-column label="关联配置项" prop="configName" width="100" align="center" />
        <el-table-column label="配置项" align="center">
          <el-table-column label="巡视项" prop="configDetailName" min-width="150" align="center"/>
          <el-table-column label="描述" prop="configDetailDescription" min-width="280" align="center"/>
        </el-table-column>
        <el-table-column v-if="orderInfo.statusInfo === 6" label="巡视结果" min-width="80" align="center">
          <template slot-scope="scope">
            <i :class="scope.row.solveStatus === 0 ? 'el-icon-success' : 'el-icon-error'"
               :style="{color: (scope.row.solveStatus === 0 ? '#00c868' :'red'),fontSize: '20px'}"/>
          </template>
        </el-table-column>
        <el-table-column label="巡视结果" align="center" min-width="100">
          <template slot-scope="scope"></template>
        </el-table-column>
      </el-table>
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
    dictForOrderType: {
      type: String,
      default:''
    },
    dictForOrderStatus: {
      type: String,
      default:''
    },
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"]),
    orderTimes() {
      // debugger
      const startTime = this.orderInfo.startTime
      const finishTime = this.orderInfo.finishTime
      const times = (startTime && finishTime) ? [startTime, finishTime] : []
      return times
    },
    isCreator() {
      return this.orderInfo.createUser === this.userInfo.userId
    },
    currVisitorWorkerId() {
      return this.orderInfo.userWorkerId
    }
  },
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
