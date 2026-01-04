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
        <el-col :span="24" v-if="type=='add'">
          <el-form-item label="枚举ID" prop="enumId">
            <el-select v-model="submitParams.enumId" placeholder="请选择枚举ID" filterable clearable>
              <el-option v-for="(item,index) in enumList"
                         :key="item.EXT_CODE"
                         :label="item.EXT_NAME"
                         :value="item.EXT_CODE"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-else>
          <el-form-item label="枚举项名称" prop="enumvalName">
            <el-input v-model="submitParams.enumvalName" placeholder="请输入枚举项名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="24">-->
        <!--          <el-form-item label="枚举数据名称" prop="enumName">-->
        <!--            <el-input v-model="submitParams.enumName" placeholder="请输入属性英文名" clearable></el-input>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <!--        <el-col :span="24">-->
        <!--          <el-form-item label="枚举项编码" prop="enumvalCode">-->
        <!--            <el-input v-model="submitParams.enumvalCode" placeholder="请输入属性ID" clearable></el-input>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <!--        <el-col :span="24">-->
        <!--          <el-form-item label="枚举项名称" prop="enumvalName">-->
        <!--            <el-input v-model="submitParams.enumvalName" placeholder="请输入属性ID" clearable></el-input>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button type="primary" error @click="submit" :loading="saveLoading">{{ getTitle(type) }}</el-button>
      <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {update, save, getEnumList} from "@/api/i6000/enum";

export default {
  name: "pzsxAddEdit",
  props: ['fromValue', 'isShow', 'type'],
  data() {
    return {
      submitParams: {},
      rules: {
        enumId: [{required: true, message: '枚举ID不能为空', trigger: 'blur'}],
        enumName: [{required: true, message: '枚举数据名称不能为空', trigger: 'blur'}],
        enumvalCode: [{required: true, message: '枚举项编码不能为空', trigger: 'blur'}],
        enumvalName: [{required: true, message: '枚举项名称不能为空', trigger: 'blur'}],
      },
      saveLoading: false,

      enumList: null,
    };
  },
  mounted() {
    this.initDict();

    if (this.type == 'edit') {
      this.submitParams = JSON.parse(JSON.stringify(this.fromValue));
    }
  },
  methods: {
    initDict() {
      getEnumList().then(res => {
        this.enumList = res.data;
      });
    },
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
            }).finally(() => {
              this.saveLoading = false
            });
          } else if (this.type == 'edit') {
            this.saveLoading = true;
            update(this.submitParams).then(res => {
              this.saveLoading = false
              this.$message.success('修改成功');
              this.$emit("close");
              this.$emit("refreshData");
            }).finally(() => {
              this.saveLoading = false
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
