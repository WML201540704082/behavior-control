<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      :visible.sync="isShow"
      title="提交表单"
      width="800px"
      top="5vh"
      append-to-body
      v-el-drag-dialog
    >
      <el-form
        ref="submitForm"
        :model="submitForm"
        label-suffix=":"
        label-width="100px"
      >
        <el-form-item label="审核人">
          <el-input v-model="submitForm.userName" disabled></el-input>
        </el-form-item>

        <el-form-item label="审核意见">
          <el-input v-model="submitForm.comment" type="textarea" :rows="5"></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-radio-group v-model="submitForm.isResolve">
            <el-radio :label="-1">纳入问题</el-radio>
            <el-radio :label="0">纳入需求</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="btn_box">
          <el-button type="primary" @click="submit" :loading="saveLoading">提交</el-button>
          <el-button type="primary" @click="$emit('close')">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import {
  auditingUserList,
  questionSubmit
} from "@/api/ictOperation/index"

export default {
  props: ['isShow', 'questionId'],
  data() {
    return{
      submitForm: {
        id: '',
        comment: '',
        isResolve: -1
      },
      userList: [],
      saveLoading: false,
    }
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  mounted() {
    this.initForm()
  },
  methods: {
    initForm() {
      this.submitForm.userName = this.userDetail.userName
      this.submitForm.id = this.questionId
      this.$forceUpdate()
    },
    submit() {
      this.saveLoading = true
      questionSubmit(this.submitForm).then(res => {
        this.$emit('submitProcess')
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.btn_box{
  text-align: center
}
</style>
