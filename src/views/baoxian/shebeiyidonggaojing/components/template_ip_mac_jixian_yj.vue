<template>
  <div class="d_center">
    <div class="d_sb d_title">
      <div>
        <div class="d_start">
          <div class="d_line2"></div>
          <span class="s_title">处置信息</span>
        </div>
      </div>
    </div>

    <div class="d_tmpl">
      <el-form ref="submitForm" :model="formValue" :rules="rules" label-suffix=":" label-width="auto" size="small" class="xt_search_form">
        <el-row :gutter="12">
          <el-col :span="6">
            <!--        <el-form-item label="告警等级" size="small">-->
            <!--          <el-select v-model="formValue.warnLevel" placeholder="请选择告警等级" clearable>-->
            <!--            <el-option v-for="(item,index) in warnLevelList"-->
            <!--                       :key="item.dictKey"-->
            <!--                       :label="item.dictValue"-->
            <!--                       :value="item.dictKey"></el-option>-->
            <!--          </el-select>-->
            <!--        </el-form-item>-->
            <el-form-item label="处置人" size="small">
              <el-input v-model="formValue.disposeUser" placeholder="--" readonly disabled clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="处置人联系方式" size="small">
              <el-input v-model="formValue.disposePhone" placeholder="--" readonly disabled clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处置人所在部门" size="small">
              <el-input v-model="formValue.disposeDept" placeholder="--" readonly disabled clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处置时间" size="small">
              <el-date-picker v-model="formValue.disposeTime" placeholder="提交时自动记录当前时间" type="datetime" disabled clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处置结果" size="small" prop="disposeResult">
              <el-select v-model="formValue.disposeResult" placeholder="请选择处置结果" :disabled="formValue.disposeStatus != 0" clearable>
                <el-option v-for="(item,index) in czResults"
                           :label="item"
                           :value="item"
                           :key="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <transition name="el-fade-in-linear">
            <el-col :span="18" class="v_center" v-if="formValue.disposeResult == '临时断网'">
              <div class="d_tips">
                <i class="el-icon-magic-stick"></i>
                <span>发起临时退网后，该IP对应设备临时断网，需前往安全准入→用户入网手动恢复方可再次入网</span>
              </div>
            </el-col>
          </transition>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import {dateFormat} from "@/util/date";

export default {
  name: 'template_ip_mac_jixian_yj',
  props: ['formValue'],
  data() {
    return {
      rules: {  //校验规则
        disposeResult: [{required: true, message: '请选择处置结果', trigger: 'change'}],
      },
    };
  },
  computed: {
    czResults() {
      if (this.formValue.warningType == 'IP/MAC变更' || this.formValue.warningType == '基线异常') {
        return ['临时断网', '发起变更'];
      } else if (this.formValue.warningType == '硬件变化') {
        return ['同意变更'];
      }
      return [];
    },
  },
  mounted() {

  },
  methods: {
    validate(callback) {
      this.$refs.submitForm.validate((valid) => {
        if (callback) {
          //告警处置时间 赋值
          if(valid){
            this.formValue.disposeTime = dateFormat(new Date);
          }
          callback(valid);
        }
      });
    },
  },
}
</script>
<style scoped lang="scss">
.d_center {
  border-radius: 8px;
  background-color: #FFFFFF;
  margin-top: 12px;
}

.d_sb {
  display: flex;
  justify-content: space-between;
}

.d_title {
  padding: 12px;
}

.d_start {
  display: flex;
  justify-content: flex-start;
}

.d_line2 {
  width: 4px;
  height: auto;
  margin-right: 12px;
  background-color: #589AF8;
}

.s_title {
  font-size: 14px;
  font-weight: bold;
}

.d_tmpl {
  padding: 0px 12px 0px 12px;
}

.d_tips {
  color: #E43D30;
  font-size: 13px;
}

.v_center {
  display: flex;
  align-items: center;
}
</style>
