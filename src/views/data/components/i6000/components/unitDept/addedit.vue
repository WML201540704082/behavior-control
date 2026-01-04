<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="() => $emit('close')"
    :show-close="true"
    append-to-body
    :visible.sync="isShow"
    :title="getTitle(type)"
    width="700px"
    top="30vh"
    v-el-drag-dialog>
    <el-form
      ref="submitForm"
      class="xt_form"
      :model="submitParams"
      :rules="rules"
      label-suffix=":"
      label-width="120px"
      size="small">
      <el-row>
        <el-col :span="24">
          <el-form-item label="i6000部门名称" prop="i6000DeptName">
            <el-input v-model="submitParams.i6000DeptName" placeholder="请输入i6000部门名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button type="primary" error @click="submit" :loading="saveLoading">{{ getTitle(type) }}</el-button>
      <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {update} from "@/api/i6000/dept";

export default {
  name: "UnitDeptAddEdit",
  props: ['fromValue', 'isShow', 'type'],
  data() {
    return {
      submitParams: {},
      rules: {
        i6000DeptName: [{required: true, message: 'i6000部门名称不能为空', trigger: 'blur'}],
      },
      saveLoading: false,
    };
  },
  mounted() {
    if (this.type == 'edit') {
      this.submitParams = JSON.parse(JSON.stringify(this.fromValue));
    }
  },
  methods: {
    submit() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          if (this.type == 'add') {
            this.saveLoading = true;
            save(this.submitParams).then(res => {
              this.saveLoading = false
              this.$message.success('添加成功');
              this.$emit("close");
              this.$emit("refreshData");
            });
          } else if (this.type == 'edit') {
            this.saveLoading = true;
            update(this.submitParams).then(res => {
              this.saveLoading = false
              this.$message.success('修改成功');
              this.$emit("close");
              this.$emit("refreshData");
            });
          }
        }
      })
    },
    getTitle(type) {
      if (type == 'add') {
        return '新 增';
      } else if (type == 'edit') {
        return '更 新';
      }
      return null;
    },
  },
}
</script>
<style lang="scss" scoped>
.btn_box {
  text-align: center;
}
</style>
