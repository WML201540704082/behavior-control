<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="修改自评是否更换"
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
        <el-form-item label="自评是否更换">
          <el-radio-group v-model="opearteResult">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="更换原因">
          <el-input v-model="comment" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <div class="form-btn">
          <el-button type="primary" @click="submitOperate" :loading="loading">确定</el-button>
          <el-button type="primary" plain @click="$emit('close')">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['isShow','opearteResult'],
  data() {
    return {
      userName: '',
      comment: '',
      loading: false,
      nextProcess: {},
    }
  },
  mounted() {
  },
  methods: {
    async submitOperate() {
      let selectResult = this.opearteResult;
      this.$emit('submitOperate',selectResult);
    },
  }
}
</script>

