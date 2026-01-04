<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="请选择维护工厂"
      width="700px"
      top="20vh"
      v-el-drag-dialog
    >
      <el-form
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
        class="xt_form"
        label-suffix=":"
        label-width="120px"
        size="small"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="ERP单位" prop="projectUnitCode">
              <el-select v-model="submitForm.projectUnitCode" filterable clearable>
                <el-option
                  v-for="(item, index) in erpUnits"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="btn_box">
        <el-button type="primary" size="small" @click="handleRefresh" :loading="btnLoading">刷 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {erpUnitList} from "@/api/system/dept";
import {erpRefresh} from '@/api/assets/projectManage'

export default {
  name: 'swerkRefresh',
  props: ['isShow'],
  data() {
    return {
      submitForm: {
        projectCreateStartTime: '',
      },
      rules: {
        projectUnitCode: [
          {required: true, message: 'erp单位不能为空', trigger: 'change'},
        ],
      },
      erpUnits: [],
      btnLoading: false,
    }
  },
  mounted() {
    this.getDict()
  },
  methods: {
    // 字典
    getDict() {
      erpUnitList().then(res => {
        this.erpUnits = res.data;
      })
    },
    // 刷新
    handleRefresh() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          this.$emit('submit',{swerk:this.submitForm.projectUnitCode})
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.btn_box {
  text-align: center;
}
</style>
