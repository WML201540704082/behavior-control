<template>
  <el-dialog
    :close-on-click-modal="false"
    :show-close="true"
    append-to-body
    :visible.sync="dialogFlag"
    title="巡视配置项详情"
    width="1000px"
    @close="closeThisDialog"
    v-el-drag-dialog>
    <div class="xt_card_xc xc_base">
      <el-form :model="form" ref="form" label-width="100px" label-suffix=":" class="xt_form">
        <el-row>
          <el-col :span="14">
            <el-form-item label="名称">
              <el-input v-model="form.name" disabled show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="检修类别">
              <el-select v-model="form.type" disabled>
                <el-option v-for="dict in controlType" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="工作类别">
              <el-select v-model="form.jobCategory" disabled>
                <el-option v-for="dict in jobCategoryOptions" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="作业类型">
              <el-select v-model="form.jobType" disabled>
                <el-option v-for="dict in jobTypeAllOptions[form.jobCategory]" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="height: 100%">
            <el-form-item label="危险点分析">
              <el-input v-model="form.riskPoints" disabled type="textarea" :rows="7" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="height: 100%">
            <el-form-item label="安全措施" disabled>
              <el-input v-model="form.measure" disabled type="textarea" :rows="7" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: center;">
            <el-button type="info" @click="closeThisDialog">返 回</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { getDictList } from '@/api/dict'
import { getDetailsControl } from '@/api/xcnanr/riskcontrol'

export default {
  name: 'riskManagement',
  data() {
    return {
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
      }
    }
  },
  props: {
    dialogFlag: {
      type: Boolean, default: false
    },
    dialogObject: {
      type: Object, default: null
    }
  },
  created() {
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
    setTimeout(() => {
      getDetailsControl({id: this.dialogObject.id}).then(res => {
        this.form = res.data
        this.form.name = String(res.data.name)
        this.form.type = String(res.data.type)
        this.form.jobCategory = String(res.data.jobCategory)
        this.form.jobType = String(res.data.jobType)
        this.form.riskPoints = String(res.data.riskPoints)
        this.form.measure = String(res.data.measure)
      })
    }, 100)
  },
  methods: {
    // 关闭当前弹层
    closeThisDialog() {
      this.$emit('closeDialog', null)
    },
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
    }
  }
}
</script>

<style scoped>
/* 样式可以根据需要添加 */
::v-deep.xt_card_xc {
  padding: 0px 0px 0px 0px;
  background: #FFF;
  border-radius: 5px;
  margin: 5px auto;
  width: 900px;
}
::v-deep(.el-textarea .el-input__count){
  background: #e0f3ff10 !important;
}
::v-deep(.el-input .el-input__count .el-input__count-inner){
  background: #e0f3ff10 !important;
}
</style>
