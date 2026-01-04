<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="ERP项目刷新"
      width="700px"
      top="10vh"
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
            <el-form-item label="项目类型" prop="projectTypeCode">
              <el-select v-model="submitForm.projectTypeCode" clearable filterable>
                <el-option
                  v-for="(item, index) in projecTypeList"
                  :key="index"
                  :label="item.projectDesc"
                  :value="item.projectType"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="ERP单位" prop="projectUnitCode">
              <el-select v-model="submitForm.projectUnitCode" clearable filterable>
                <el-option
                  v-for="(item, index) in erpUnits"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目创建时间" prop="projectCreateStartTime">
              <el-date-picker
                v-model="projectTimes"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyyMMdd"
                style="width:100%"
                @change="changeTime">
              </el-date-picker>
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
  import {erpProjectType, erpRefresh} from '@/api/assets/projectManage'

  export default {
    props: ['isShow'],
    data() {
      return {
        submitForm: {
          projectCreateStartTime: '',
        },
        rules: {
          projectTypeCode: [
            {required: true, message: '项目类型不能为空', trigger: 'change'},
          ],
          projectUnitCode: [
            {required: true, message: 'erp单位不能为空', trigger: 'change'},
          ],
          projectCreateStartTime: [
            {required: true, message: '创建时间不能为空', trigger: 'change'},
          ],
        },
        projecTypeList: [],
        erpUnits: [],
        projectTimes: [],
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
        erpProjectType({
          current: 1,
          size: 99999
        }).then(res => {
          this.projecTypeList = res.data.records;
        })
      },
      changeTime(val) {
        if (val != null) {
          this.$set(this.submitForm, 'projectCreateStartTime', val[0])
          // this.submitForm.projectCreateStartTime = val[0]
          this.submitForm.projectCreateEndTime = val[1]
        } else {
          this.submitForm.projectCreateStartTime = ''
          this.submitForm.projectCreateEndTime = ''
        }
      },
      // 刷新
      handleRefresh() {
        this.$refs.submitForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            erpRefresh(this.submitForm).then(res => {
              this.$message({
                type: "success",
                message: "刷新成功!"
              });
              this.btnLoading = false
              this.$emit('submit')
            })
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
