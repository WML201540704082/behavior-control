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
            <el-radio :label="2">同意</el-radio>
            <el-radio :label="3">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input v-model="comment" type="textarea" :rows="5"></el-input>
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
import {approveOldEquipmentInfo} from "@/api/device/oldEquipmentLibrary.js";

export default {
  props: ['isShow', 'orderList'],
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
  methods: {

    async submitOperate() {
      this.loading = true
      this.orderList.forEach(item => {
         item.status = this.opearteResult;
         item.approvalOpinion = this.comment;
         return item
      });
      let updateRes = await this.$asyncCatchApi(approveOldEquipmentInfo,this.orderList)
      if(updateRes[0] != null) {
        this.btnLoading = false
        return
      }

      this.$emit('submitOperate')
    },
  }
}
</script>

