<template>
  <div v-show="true">
    <!-- 检修工单打印-表单 -->
    <el-form ref="orderInfo" class="xt_form" :model="orderInfo" inline size="small" label-suffix=":" label-width="100px" style="width: 1500px;">
      <div style="width: 100%;">
        <span style="text-align: center;display: block;font-weight: bold;">{{ '检修工单【' + orderInfo.code + '】' }}</span>
      </div>
      <el-form-item label="公司" style="margin-top: 50px;">
        <el-input style="width: 500px" v-model="orderInfo.companyName" disabled></el-input>
      </el-form-item>
      <el-form-item label="部门" style="margin-top: 50px;">
        <el-input style="width: 500px" v-model="orderInfo.deptName" disabled></el-input>
      </el-form-item>
      <el-form-item label="工作类别" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="jobCategory" disabled></el-input>
      </el-form-item>
      <el-form-item label="作业类型" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="jobType" disabled></el-input>
      </el-form-item>
      <el-form-item label="检修类型" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="mode" disabled></el-input>
      </el-form-item>
      <el-form-item label="检修时间段" style="margin-top: 15px;">
        <el-date-picker v-model="orderTimes" type="datetimerange" range-separator=" ~ " value-format="yyyy-MM-dd HH:mm:ss" disabled style="width: 500px;margin-top: 4px;"/>
      </el-form-item>
      <el-form-item label="检修负责人" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="orderInfo.header" disabled></el-input>
      </el-form-item>
      <el-form-item label="检修操作人" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="orderInfo.operator" disabled></el-input>
      </el-form-item>
      <el-form-item label="检修状态" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="orderStatusStr" disabled></el-input>
      </el-form-item>
      <el-form-item label="检修状态" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="orderStatusStr" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="orderInfo.mode + '' === '2'" label="检修场所" style="margin-top: 15px;">
        <el-input style="width: 500px" v-model="roomNames" disabled></el-input>
      </el-form-item>
      <el-form-item label="检修内容" style="margin-top: 15px;">
        <el-input v-if="!orderInfo.contentSucc" style="width: 1110px" type="textarea" :rows="3" v-model="orderInfo.content" disabled></el-input>
        <el-input v-else style="width: 1110px" type="textarea" :rows="3" v-model="orderInfo.contentSucc" disabled></el-input>
      </el-form-item>
      <el-form-item label="危险点分析" style="margin-top: 15px;">
        <el-input style="width: 1110px" type="textarea" :rows="3" v-model="orderInfo.riskContent" disabled></el-input>
      </el-form-item>
      <el-form-item label="关键措施" style="margin-top: 15px;">
        <el-input style="width: 1110px" type="textarea" :rows="3" v-model="orderInfo.keySolution" disabled></el-input>
      </el-form-item>

      <el-table ref="tableData2" :data="orderInfo.orderDetailList.filter(detail => detail.detailType === 1)" :key="new Date().getTime() + ''" size="small" style="width: 1300px;margin-top: 15px" stripe>
        <el-table-column type="index" align="center" label="序号" width="60px"/>
        <el-table-column label="设备名称" prop="objectName" align="center" show-overflow-tooltip />
        <el-table-column label="描述" prop="description" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ !scope.row.description ? '-' : scope.row.description }}
          </template>
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
    mode: {
      type: String,
      default:''
    },
    jobCategory: {
      type: String,
      default:''
    },
    jobType: {
      type: String,
      default:''
    }
  },
  data() {
    return {
      orderStatusStr: null, roomNames: null
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
    }
  },
  mounted() {
    this.orderStatusStr = this.orderInfo.statusInfo === 3 ? '执行中' : '审批通过'
    const roomDetailList = this.orderInfo.orderDetailList.filter(detail => detail.detailType === 2)
    this.roomNames = roomDetailList.map(d => d.objectName).join(", ")
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
