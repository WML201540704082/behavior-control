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
        <el-form-item label="上级名称" prop="parentName" size="small">
          <el-input v-model="formDetial.parentName" placeholder="请输入上级名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="上级编码" prop="parentCode" size="small">
          <el-input v-model="formDetial.parentCode" placeholder="请输入上级编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="编码名称" prop="selfName" size="small">
          <el-input v-model="formDetial.selfName" placeholder="请输入编码名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="selfCode" size="small">
          <el-input v-model="formDetial.selfCode" placeholder="请输入编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="认证地址" prop="url" size="small">
          <el-input v-model="formDetial.url" placeholder="请输入认证地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" size="small">
          <el-select
            v-model="formDetial.type"
            placeholder="请选择类型">
            <el-option
              v-for="(item, index) in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
import {add, update} from "@/api/operation/safeaccess/areacode";
import {Message} from "element-ui";
import {attrrelUpdate} from "@/api/cmdb/ciConfig";

export default {
  props: ['isShow', 'arrtId', 'type', 'formDetial'],
  data() {
    return {
      saveLoading: false,
      typeList: null,
      rules: {
        parentName: [{required: true, message: '上级名称不能为空', trigger: 'blur'}],
        parentCode: [{required: true, message: '上级编码不能为空', trigger: 'blur'}],
        selfName: [{required: true, message: '编码名称不能为空', trigger: 'blur'}],
        selfCode: [{required: true, message: '编码不能为空', trigger: 'blur'}],
        url: [{required: true, message: '认证地址不能为空', trigger: 'blur'}],
        type: [{required: true, message: '类型不能为空', trigger: 'blur'}],
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
            add([this.formDetial]).then(res => {
              this.saveLoading = false
              this.$message.success('添加成功');
              this.$emit("close");
              this.$emit("refreshData");
            });
          } else if (this.type == 'edit') {
            this.saveLoading = true;
            update([this.formDetial]).then(res => {
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
