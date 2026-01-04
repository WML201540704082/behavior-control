<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="() => $emit('close')"
    :show-close="true"
    append-to-body
    :visible.sync="isShow"
    :title="getTitle(type)"
    width="700px"
    top="20vh"
    v-el-drag-dialog
  >
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
          <el-form-item label="属性ID" prop="value">
            <el-input v-model="submitParams.value" placeholder="请输入属性ID" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="属性英文名" prop="name">
            <el-input v-model="submitParams.name" placeholder="请输入属性英文名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="属性类型" prop="type">
            <el-select v-model="submitParams.type" placeholder="请选择属性类型" clearable>
              <el-option v-for="(item,index) in typeList"
                         :key="item.name"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="属性描述" prop="remark">
            <el-input v-model="submitParams.remark" placeholder="请输入属性描述" clearable></el-input>
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
import {update, save} from "@/api/treeManager/pzsx";

export default {
  name: "pzsxAddEdit",
  props: ['fromValue', 'isShow', 'type'],
  data() {
    return {
      submitParams: {},
      rules: {
        value: [{
          required: true, message: '', trigger: 'blur', validator: (rule, value, callback) => {
            if (value) {
              // 1 开头的默认是手机号，进行校验
              let reg = /^[0-9]*$/
              if (reg.test(value) === false) {
                callback(new Error('属性ID只允许输入数字'))
              } else {
                callback()
              }
            } else {
              callback('请输入属性ID')
            }
          }
        }],
        name: [{required: true, message: '属性英文名不能为空', trigger: 'blur'}],
        type: [{required: true, message: '属性类型不能为空', trigger: 'blur'}],
        remark: [{required: true, message: '属性描述不能为空', trigger: 'blur'}],
      },
      saveLoading: false,
    };
  },
  computed: {
    typeList() {
      return [
        {name: '属性', id: 0},
        {name: '配置', id: 1},
        {name: '模型', id: 2},
        {name: '字典模型', id: 3}
      ];
    },
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
