<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="审批操作"
      width="1000px"
      top="10vh"
      v-el-drag-dialog
    >
      <el-form
        ref="submitForm"
        label-suffix=":"
        label-width="100px"
        size="small"
        :model="submitForm"
      >
        <el-form-item label="审批人">
          <el-input v-model="userInfo.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="审批结果">
          <el-radio-group v-model="opearteResult">
            <el-radio :label="0">同意</el-radio>
            <el-radio :label="1">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见" prop="comment" :rules="[{ required: true, message: '审批意见不能为空'}]">
          <el-input v-model="submitForm.comment" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="后续节点">
          <el-input v-model="nextProcess.name" disabled></el-input>
        </el-form-item>
        <div class="form-btn">
          <el-button type="primary" @click="submitOperate" :loading="loading">提交</el-button>
          <el-button type="primary" plain @click="$emit('close')">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  submitProcess,
  updateDevRecordStatus,
  updateDevZZStatus,
  updateSheBeiBFStatus,
  rejectProcess,
  processNextInfo,
  updateDevOutBoundStatus,
  updateDevApplyStatus,
  updateDevOperationStatus,
  updateDevRepairStatus,
  updateDevChangeStatus,
  updateDevTYDStatus
} from "@/api/process/index"
import { constants } from 'crypto';

export default {
  props: ['isShow', 'orderDeatil', 'processKeys','orderType'],
  data() {
    return {
      userName: '',
      opearteResult: 0,
      comment: '',
      loading: false,
      nextProcess: {},
      submitForm: {
        comment: undefined
      }

    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    this.getNextInfo()
  },
  methods: {
    getNextInfo() {
      if(this.orderType == '投运工单') this.orderDeatil.filingNo = this.orderDeatil.applyNo
      processNextInfo({businessKey: this.orderDeatil.filingNo}).then(res => {
        this.nextProcess = res.data[0]
      })
    },

  async getBaofeiStatus(){
      let updateRes = await this.$asyncCatchApi(updateSheBeiBFStatus, {
        // taskDefinitionKey: submitProcessRes[1].data[0].taskDefinitionKey,
        id: this.orderDeatil.id,
        workerStatus: this.opearteResult,
        comment: this.submitForm.comment,
        orderNoList:this.orderDeatil.filingNo,
        taskDefinitionKey:this.orderDeatil.processStatus,
        // examineRole: submitProcessRes[1].msg,
        examineType: "1",
      })
      if(updateRes[0] != null) {
        this.btnLoading = false
        return
      }

      this.$emit('submitOperate')
    },
    async submitOperate() {
       this.$refs.submitForm.validate( async valid => {
         if( valid ){
           
            this.loading = true
            let submitProcessRes = null
            let processApi = null

            if(this.opearteResult === 0) processApi = submitProcess
            else processApi = rejectProcess

            //提交
            let regionType = 1;
            let regionCode = this.userDetail.regionCode||''
            if(regionCode.length===6){
              regionType = 0;
            }
            //投运
            let variable = {}
            if(this.orderType == '出库工单' || this.orderType == '投运工单'){
              variable.operation = 0
            }
            if(this.orderType == '申请工单'){
              variable.operation = 0
              variable.regionType = regionType;
            }
            // 提交流程 
            // submitProcessRes = await this.$asyncCatchApi(processApi, {
            //   assignees: [],
            //   businessKey: this.orderDeatil.filingNo,
            //   comment: this.comment,
            //   participantType: "2",
            //   processDefinitionKey: this.processKeys,
            //   taskType: "1",
            //   variable: variable|| {}
            // })

            // if(submitProcessRes[0] != null) {
            //   this.loading = false
            //   return
            // }
            // 修改流程状态
            if(this.processKeys == 'bpm_sbbf'){
              this.getBaofeiStatus();
              return;
            }

            // 修改流程状态
            if(this.processKeys == 'bpm_sbsqckty'){
              
              let updateRes = await this.$asyncCatchApi(updateDevApplyStatus, {
                id: this.orderDeatil.id,
                workerStatus: this.opearteResult,
                comment: this.submitForm.comment,
                examineType: "1",
                returnType: this.opearteResult === 0 ? 1 : 0
              })
              if(updateRes[0] != null) {
                this.btnLoading = false
                return
              }

              this.$emit('submitOperate')


              return;
            }



            let upDateStatusApi
            if(this.processKeys == 'bpm_sbjd') upDateStatusApi = updateDevRecordStatus
            else if(this.processKeys == 'bpm_sbzz') upDateStatusApi = updateDevZZStatus
            else if(this.orderType == '出库工单') upDateStatusApi = updateDevOutBoundStatus
            else if(this.orderType == '投运工单') upDateStatusApi = updateDevOperationStatus
            else if(this.processKeys == 'bpm_sbsqckty') upDateStatusApi = updateDevApplyStatus
            else if(this.processKeys == 'bpm_sbbx') upDateStatusApi = updateDevRepairStatus
            else if(this.processKeys == 'bpm_sbbg') upDateStatusApi = updateDevChangeStatus
            else if(this.processKeys == 'bpm_sbty') upDateStatusApi = updateDevTYDStatus

            let updateRes = await this.$asyncCatchApi(upDateStatusApi, {
              // taskDefinitionKey: submitProcessRes[1].data[0].taskDefinitionKey,
              id: this.orderDeatil.id,
              workerStatus: this.opearteResult,
              comment: this.submitForm.comment,
              // examineRole: submitProcessRes[1].msg,
              examineType: "1",
            })
            if(updateRes[0] != null) {
              this.btnLoading = false
              return
            }

            this.$emit('submitOperate')

         }
       })      
    },
  }
}
</script>

