<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      :title="getTitle(type)"
      width="800px"
      top="10vh"
      v-el-drag-dialog>
      <el-form ref="submitForm" v-if="formDetial" :model="formDetial" :rules="rules" label-suffix=":"
               label-width="120px" size="small">
        <el-form-item label="标题" prop="title" size="small">
          <el-input v-model="formDetial.title" placeholder="请输入标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="remind" size="small">
          <el-input v-model="formDetial.remind" placeholder="请输入内容" clearable></el-input>
        </el-form-item>
       
        <div class="form-btn d_end">
          <el-button type="primary" error @click="submit" :loading="saveLoading">{{ getTitle(type) }}</el-button>
          <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {remindSave, remindUpdate} from "@/api/page/index";

export default {
  props: ['isShow', 'arrtId', 'type', 'formDetial'],
  data() {
    return {
      saveLoading: false,
      typeList: null,
      rules: {
        title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
        remind: [{required: true, message: '内容不能为空', trigger: 'blur'}],
        
      },
    }
  },
  computed: {},
  mounted() {
    if (!this.formDetial) {
      this.formDetial = {};
    }
    this.initTypes();
  },
  methods: {
    initTypes() {
      this.typeList = [];
      this.typeList.push({
        name: '市',
        id: '2'
      })
      this.typeList.push({
        name: '县',
        id: '3'
      })
    },
    selectionChange(val) {
      this.selectionList = val;
    },
    submit() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          if (this.type == 'add') {
            this.saveLoading = true;
            remindSave(this.formDetial).then(res => {
              this.saveLoading = false
              this.$message.success('添加成功');
              this.$emit("close");
              this.$emit("refreshData");
            });
          } else if (this.type == 'edit') {
            this.saveLoading = true;
            remindUpdate(this.formDetial).then(res => {
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
  }
}
</script>

<style lang="scss" scoped>
.d_end {
  display: flex;
  justify-content: flex-end;
}

.d_end button {
  width: 100px;
}
</style>
