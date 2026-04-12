<template>
  <basic-container>
    <div class="title-head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/xcnanr/operationPlan/riskcontrol/index' }">风险管控卡</el-breadcrumb-item>
        <el-breadcrumb-item>{{ getTitle(formType) }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="xt_card_xc xc_base">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px" label-suffix=":" class="xt_form">
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="公司" prop="companyName">
                <el-input v-model="form.companyName" disabled />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" :maxlength="80" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检修类别" prop="type">
              <el-select v-model="form.type" placeholder="请选择检修类别">
                <el-option v-for="dict in controlType" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作类别" prop="jobCategory">
              <el-select v-model="form.jobCategory" placeholder="请选择工作类别" @change="loadJobTypeOptions">
                <el-option v-for="dict in jobCategoryOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业类型" prop="jobType">
              <el-select v-model="form.jobType" placeholder="请选择作业类型">
                <el-option v-for="dict in jobTypeAllOptions[form.jobCategory]" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="height: 100%">
            <el-form-item label="危险点分析" prop="riskPoints">
              <el-input v-model="form.riskPoints" placeholder="请输入内容" type="textarea" :rows="3" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="height: 100%">
            <el-form-item label="安全措施" prop="measure">
              <el-input v-model="form.measure" placeholder="请输入内容" type="textarea" :rows="3" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: center;">
            <el-button type="primary" @click="submitForm">提 交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </basic-container>
</template>

<script>
import { getDictList } from '@/api/dict'
import { mapGetters } from 'vuex'
import { getDetailsControl, insertRiskControl } from '../../../../api/xcnanr/riskcontrol'

export default {
  name: 'riskManagement',
  components: {...mapGetters(["permission", "userInfo", 'userDetail'])},
  data() {
    return {
      userInfo: this.$store.state.user.userDetail,
      controlType: [],
      jobCategoryOptions: [],
      jobTypeAllOptions: {},
      form: {
        id: '',
        companyName: '',
        name: '',
        type: '1',
        riskPoints: '',
        measure: '',
        jobCategory: '',
        jobType: ''
      },
      rules: {
        companyName: [
          {required: true, message: '请选择公司', trigger: 'change'}
        ],
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择检修类别', trigger: 'change'}
        ],
        jobCategory: [
          {required: true, message: '请选择工作类别', trigger: 'change'}
        ],
        jobType: [
          {required: true, message: '请选择作业类型', trigger: 'change'}
        ],
        riskPoints: [
          {required: true, message: '请输入危险点分析', trigger: 'blur'}
        ],
        measure: [
          {required: true, message: '请输入安全措施', trigger: 'blur'}
        ]
      },
      formType: ''
    }
  },
  created() {
    this.form.companyId = this.userInfo.ownerUnit
    this.form.companyName = this.userInfo.ownerUnitName
    this.form.companyRegionCode = this.userInfo.regionCode
    // 获取路由参数
    this.formType = this.$route.query.type
    this.getDictList('info_repair_plan_mode')
    this.getDictList('info_job_category')
    this.getDictList('info_power_air_system')
    this.getDictList('info_cloud_platform_virtual_pool')
    this.getDictList('info_host_storage_device')
    this.getDictList('info_core_network_device')
    this.getDictList('info_safe_device')
    this.getDictList('info_apply_software')
    this.getDictList('info_basic_environment')
    this.getDictList('info_fire_fighting_system')
    this.getDictList('info_cabling_system')
  },
  mounted() {
    if (this.formType === 'Edit') {
      setTimeout(() => {
        getDetailsControl({
          id: this.$route.query.id
        }).then(res => {
          this.form = res.data
          this.form.name = String(res.data.name)
          this.form.type = String(res.data.type)
          this.form.jobCategory = String(res.data.jobCategory)
          this.form.jobType = String(res.data.jobType)
          this.form.riskPoints = String(res.data.riskPoints)
          this.form.measure = String(res.data.measure)
        })
      }, 100)
    }
  },
  methods: {
    getDictList(code) {
      //加载字典
      getDictList(code).then(res => {
        if (code === 'info_repair_plan_mode') {
          this.controlType = res.data
        } else if (code === 'info_job_category') {
          this.jobCategoryOptions = res.data
        } else if (code === 'info_power_air_system') {
          this.jobTypeAllOptions['info_power_air_system'] = res.data
        } else if (code === 'info_cloud_platform_virtual_pool') {
          this.jobTypeAllOptions['info_cloud_platform_virtual_pool'] = res.data
        } else if (code === 'info_host_storage_device') {
          this.jobTypeAllOptions['info_host_storage_device'] = res.data
        } else if (code === 'info_core_network_device') {
          this.jobTypeAllOptions['info_core_network_device'] = res.data
        } else if (code === 'info_safe_device') {
          this.jobTypeAllOptions['info_safe_device'] = res.data
        } else if (code === 'info_apply_software') {
          this.jobTypeAllOptions['info_apply_software'] = res.data
        } else if (code === 'info_basic_environment') {
          this.jobTypeAllOptions['info_basic_environment'] = res.data
        } else if (code === 'info_fire_fighting_system') {
          this.jobTypeAllOptions['info_fire_fighting_system'] = res.data
        } else if (code === 'info_cabling_system') {
          this.jobTypeAllOptions['info_cabling_system'] = res.data
        }
      })
    },
    loadJobTypeOptions() {
      this.$set(this.form, 'jobType', '')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 提交表单的逻辑
          // 可以在这里发送请求或执行其他操作
          if (this.$route.query.type === 'Add') {
            this.form.createUserName = this.userInfo.userName
            this.form.enabled = '1'
            this.form.statusInfo = '1'
            this.form.updateUserName = ''
            insertRiskControl(this.form).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                document.querySelectorAll('*[id^="tab-/xcnanr/RiskManagement' + this.$route.query.type + '"]')[0].childNodes[1].click()
                this.$router.push('/xcnanr/operationPlan/riskcontrol/index')
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          } else {
            this.form.updateUserName = this.userInfo.userName
            insertRiskControl(this.form).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                document.querySelectorAll('*[id^="tab-/xcnanr/RiskManagement' + this.$route.query.type + '"]')[0].childNodes[1].click()
                this.$router.push('/xcnanr/operationPlan/riskcontrol/index')
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    getTitle(type) {
      switch (type) {
        case 'Add':
          return '新增风险管控卡'
        case 'Edit':
          return '编辑风险管控卡'
        default:
          return null
      }
    }
  }
}
</script>

<style scoped>
/* 样式可以根据需要添加 */
::v-deep.xt_card_xc {
  padding: 45px 0px 45px 0px;
  background: #FFF;
  border-radius: 5px;
  margin: 5px auto;
  width: 1300px;
}
::v-deep(.el-textarea .el-input__count){
  background: #e0f3ff10 !important;
}
::v-deep(.el-input .el-input__count .el-input__count-inner){
  background: #e0f3ff10 !important;
}
</style>
