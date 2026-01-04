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
              <el-input v-model="formValue.disposeUser" placeholder="--" readonly disabled clearable v-if="formValue.disposeStatus == 0"></el-input>
              <span class="formatt" v-else>{{ formValue.disposeUser }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="处置人联系方式" size="small">
              <el-input v-model="formValue.disposePhone" placeholder="--" readonly disabled clearable v-if="formValue.disposeStatus == 0"></el-input>
              <span class="formatt" v-else>{{ formValue.disposePhone }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处置人所在部门" size="small">
              <el-input v-model="formValue.disposeDept" placeholder="--" readonly disabled clearable v-if="formValue.disposeStatus == 0"></el-input>
              <span class="formatt" v-else>{{ formValue.disposeDept }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处置时间" size="small">
              <el-date-picker v-model="formValue.disposeTime" placeholder="提交时自动记录当前时间" type="datetime" disabled clearable v-if="formValue.disposeStatus == 0"></el-date-picker>
              <span class="formatt" v-else>{{ formValue.disposeTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处置结果" size="small" prop="disposeResult">
              <el-select v-model="formValue.disposeResult" placeholder="请选择处置结果" :disabled="formValue.disposeStatus != 0" clearable v-if="formValue.disposeStatus == 0">
                <el-option v-for="(item,index) in czResults"
                           :label="item"
                           :value="item"
                           :key="item"></el-option>
              </el-select>
              <span class="formatt2" v-else>{{ formValue.disposeResult }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formValue.disposeStatus != 0 && formValue.disposeStatus != 2">
            <el-form-item :label="`关联${ formValue.disposeResult.slice(-2) }工单`" size="small">
              <span class="formatt3" @click="goWork">{{ formValue.disposeOrder }}</span>
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
  name: 'template_tzdevice',
  props: ['formValue'],
  data() {
    return {
      rules: {  //校验规则
        disposeResult: [{required: true, message: '请选择处置结果', trigger: 'change'}],
      },
    };
  },
  computed: {
    czResults(vm) {
      vm.formValue.disposeResult = '设备退运';
      return ['设备退运', '设备报修'];
    },
  },
  mounted() {
    // console.log(444555, this.formValue)
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
    goWork(){
      if( this.formValue.disposeResult.includes('退运') ){
        //详情 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: this.formValue.orderId,
            type: 'view',
            componentName: 'devReturnedAdd',
            routerTitle: '设备退运详情',
            formRouter: this.$route.fullPath 
          }
        });
      }
      
      if( this.formValue.disposeResult.includes('报修') ){
        //新增 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: this.formValue.orderId,
            componentName: 'devRepairDetail',
            routerTitle: '设备报修详情',
            formRouter: this.$route.fullPath 
          }
        });
      }
      
    }
  },
}
</script>
<style scoped lang="scss">
.formatt{
  color: rgb(159,171,196);
}
.formatt2{
  color: rgb(63,127,244);
}
.formatt3{
  color: rgb(63,127,244);
  // font-weight: bold;
  cursor: pointer;
}

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
