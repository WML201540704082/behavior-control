<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="审批操作"
      width="700px"
      top="10vh"
      v-el-drag-dialog
    >
      <el-form
        ref="submitForm"
        label-suffix=":"
        label-width="100px"
        size="small"
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
        <el-form-item label="审批意见">
          <el-input v-model="comment" type="textarea" :rows="5"></el-input>
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
  updatePandianrStatus
} from "@/api/shujubaoxian/pandianTask"
import {

  processNextInfo,
  
} from "@/api/process/index"
import { constants } from 'crypto';

export default {
  props: ['isShow', 'orderDeatil', 'processKeys'],
  data() {
    return {
      userName: '',
      opearteResult: 0,
      comment: '',
      loading: false,
      nextProcess: {},
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
      processNextInfo({businessKey: this.orderDeatil.filingNo }).then(res => {
        this.nextProcess = res.data[0]
      })
    },

    async submitOperate() {
      this.loading = true

      let updateRes = await this.$asyncCatchApi(updatePandianrStatus, {
        // taskDefinitionKey: submitProcessRes[1].data[0].taskDefinitionKey,
        id: this.orderDeatil.id,
        workerStatus: this.opearteResult,
        comment: this.comment,
        // examineRole: submitProcessRes[1].msg,
        examineType: "1",
        filingNo: this.orderDeatil.filingNo,
      })
      if(updateRes[0] != null) {
        this.btnLoading = false
        return
      }

      this.$emit('submitOperate')
    },
  }
}
</script>

