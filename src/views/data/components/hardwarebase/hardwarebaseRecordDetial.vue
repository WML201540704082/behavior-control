<template>
  <div>
    <el-dialog :close-on-click-modal="false" :before-close="() => $emit('close')" :show-close="true" append-to-body
               :visible.sync="isShow" title="备案详情" width="1024px" top="10vh" v-el-drag-dialog>
      <el-form ref="submitForm" :rules="rules" label-suffix=":" label-width="auto" size="small">
        <el-row :span="6" :gutter="12">
          <el-col :span="8">
            <el-form-item label="设备编码" prop="basicDeviceCode" size="small">
              <el-input v-model="formDeatil.basicDeviceCode" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备版本" prop="devVersion" clearable>
              <el-input v-model="formDeatil.devVersion" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备管理部门" prop="fiDevmanageDep" clearable>
              <el-select v-model="formDeatil.fiDevmanageDep" clearable disabled></el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="6" :gutter="12">
          <el-col :span="8">
            <el-form-item label="备案MAC地址" prop="fiMac" size="small">
              <el-input v-model="formDeatil.fiMac" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备案机柜/机架号" prop="fiRackNo" clearable>
              <el-input v-model="formDeatil.devVersion" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检测平台" prop="fiMonitorPlatform" clearable>
              <el-input v-model="formDeatil.fiMonitorPlatform" clearable disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="6" :gutter="12">
          <el-col :span="8">
            <el-form-item label="安全设备功能" prop="fiSafetyFunction" size="small">
              <el-input v-model="formDeatil.fiSafetyFunction" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安全运维人员" prop="fiSafetyStaff" clearable>
              <el-input v-model="formDeatil.fiSafetyStaff" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="漏洞扫描时间" prop="fiScanDate" clearable>
              <el-date-picker v-model="formDeatil.fiScanDate" style="width: 100%" clearable
                              disabled></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="6" :gutter="12">
          <el-col :span="8">
            <el-form-item label="所属安全边界" prop="fiSecurityBoundary" size="small">
              <el-input v-model="formDeatil.fiSecurityBoundary" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安全管理部门" prop="fiSefemanageDep" clearable>
              <el-input v-model="formDeatil.fiSefemanageDep" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="督查部门" prop="fiSupervisionDep" clearable>
              <el-date-picker v-model="formDeatil.fiSupervisionDep" style="width: 100%" clearable
                              disabled></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="6" :gutter="12">
          <el-col :span="8">
            <el-form-item label="病毒库更新时间" prop="fiViruslibUpdateDate" size="small">
              <el-input v-model="formDeatil.fiViruslibUpdateDate" clearable disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="form-btn">
          <el-button type="primary" plain @click="$emit('close')">关 闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  props: ['isShow', 'formDeatil'],
  data() {
    return {
      userName: '',
      comment: '',
      loading: false,
      nextProcess: {},

      // 表单校验
      rules: {
        basicDeviceName: [{required: true}],
        basicUnitSecond: [{required: true}],
        basicUnitThird: [{required: true}],
        basicDeviceClass: [{required:true}],
        basicDeviceType: [{required:true}],
        basicState: [{required:true}]
      },
    }
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"])
  },
  mounted() {

  },
  methods: {
    getNextInfo() {

    },
  }
}
</script>

<style lang="scss" scoped>

</style>

