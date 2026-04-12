<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body" style="padding-right:5px" v-loading="pageLoading">
      <el-scrollbar style="height: calc(100% - 55px);width:100%">
        <formTitle :titleText="'处理进度'" :titleType="'page_title'"></formTitle>
        <el-row type="flex">
          <el-col :span="24" style="height: 120px;">
            <step
              v-if="submitForm.id"
              :processKey="'bpm_sbbx'"
              :orderId="submitForm.id"
              :currentSteps="submitForm.processStatus"
              :status="submitForm.status"
              :repairType="submitForm.repairType"
              :orderCode ="submitForm.filingNo"
            ></step>
          </el-col>
        </el-row>

        <formTitle :titleText="'基本信息'" :titleType="'page_title'"></formTitle>
        <el-form
          ref="submitForm"
          :model="submitForm"
          label-suffix=":"
          label-width="100px"
          class="xt_form"
          disabled
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="报修单号" prop="filingNo">
                <el-input v-model="submitForm.filingNo" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报修类型" prop="repairType">
                <el-select v-model="submitForm.repairType"  placeholder="请输入工单状态" clearable @change="changeRepairType">
                  <el-option  v-for="dict in repairTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="申请单位" prop="applyUnitName">
                <el-input v-model="submitForm.applyUnitName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请部门" prop="applyDeptName">
                <el-input v-model="submitForm.applyDeptName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报修等级" prop="repairLevel">
                <el-select v-model="submitForm.repairLevel"  placeholder="请选择报修等级" clearable  >
                  <el-option  v-for="dict in repairLevelList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="受理人" prop="applyUserName">
                <el-input v-model="submitForm.applyUserName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="受理时间" prop="receiverTime">
                <el-input v-model="submitForm.receiverTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="submitForm.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="height: 100%;">
              <el-form-item label="故障描述" prop="description">
                <el-input v-model="submitForm.description" type="textarea" :rows="5"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <formTitle :titleText="'设备列表'" :titleType="'page_title'"></formTitle>
        <div class="table_box">
          <el-table
            ref="repairDevTable"
            stripe
            size="small"
            :data="repairDevList"
            max-height="380px"
          >
            <el-table-column type="selection" width="30" fixed="left"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              v-for="item in tableCol"
              :key="item.label"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              align="center" show-overflow-tooltip
            ></el-table-column>
          </el-table>
        </div>
        <el-row style="margin-top:10px">
          <el-col :span="12">
            <formTitle :titleText="'审批记录'" :titleType="'page_title'"></formTitle>
            <div style="margin-left: 10px;">
              <step
                :processKey="'bpm_sbbx'"
                :orderId="submitForm.id"
                v-if="submitForm.id"
                :stepType="true"
                :currentSteps="submitForm.processStatus"
                :status="submitForm.status"
                :stepHeight="'400px'"
                :repairType="submitForm.repairType"
              ></step>
            </div>
          </el-col>
          <el-col :span="12">
            <formTitle :titleText="'操作记录'" :titleType="'page_title'"></formTitle>
            <el-table
              ref="optTable"
              :data="optList"
              stripe
              border
            >
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="optRole" label="角色" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="optName" label="操作人" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="160" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="title" label="操作内容" width="350" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>
        </el-row>

      </el-scrollbar>
      <div class="form-btn">
        <el-button v-if="showAudit" type="primary" size="small" @click="handleAudited">审 批</el-button>
        <el-button type="primary" plain size="small" style="margin-left: 50px;" @click="handleReset">返 回</el-button>
      </div>
    </div>

    <!-- 审批弹窗 -->
    <operateForm
      v-if="showOperate"
      :isShow="showOperate"
      :orderDeatil="submitForm"
      :processKeys="'bpm_sbbx'"
      @close="showOperate = false"
      @submitOperate="submitOperate"
    ></operateForm>
  </basic-container>
</template>

<script>
import { getDictList } from "@/api/dict";
import { computerTable, printTable, otherTable } from "./devTableCol"
import { repairOrderInit, repairOrderSubmit, repairOrderDetail, repairOrderDetailDevlist } from "@/api/operation/devRepair/index"
import { getLogOptList } from "@/api/device/logopt";
import step from "@/components/step/index"
import operateForm from "@/views/personalDesk/components/operateForm"

export default {
  components: { step, operateForm },
  data() {
    return{
      pageLoading: false,
      submitForm: {},
      optList: [],
      // 设备列表
      repairDevList: [],
      tableCol: computerTable.formTable,
      // 字典
      repairTypeList: [],
      repairLevelList: [],
      showAudit: this.$route.query.isAudit,
      showOperate: false,
    }
  },
  mounted() {
    // 设置页面元素高度
    this.setPageContentHeight()
    this.getDict()
    this.loadLogOptDataList()
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.pageLoading = true
      repairOrderDetail({id: this.$route.query.id}).then(res => {
        this.submitForm = res.data
        if(this.submitForm.repairType === '1') {
          this.tableCol = computerTable.formTable
        }else if(this.submitForm.repairType === '2') {
          this.tableCol = printTable.formTable
        }else if(this.submitForm.repairType === '3') {
          this.tableCol = otherTable.formTable
        }
        this.pageLoading = false
      })
      repairOrderDetailDevlist({repairId: this.$route.query.id}).then(res => {
        this.repairDevList = res.data.records
      })
    },
    getDict() {
      let dict = ['repair_type', 'repair_level']
      for(let i=0 ; i<dict.length; i++) {
        getDictList(dict[i]).then(res => {
          if(dict[i] === 'repair_type') this.repairTypeList = res.data
          else if(dict[i] === 'repair_level') this.repairLevelList = res.data
        })
      }
    },
    handleReset() {
      if( this.$route.query.formRouter ){
        return this.$closePage(this.$route.query.formRouter)
      }
      this.$closePage('/operation/devRepair');
    },
    handleAudited() {
      this.showOperate = true
    },
    submitOperate() {
      this.showOperate = false
      this.$closePage('/personalDesk/desk');
    },
    loadLogOptDataList() {
      //加载操作记录
      getLogOptList(1, 99, {logId: this.$route.query.id}).then(res => {
        this.optList = res.data.records;
      });
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
