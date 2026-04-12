<template>
  <div>
    <el-form class="xt_form" :model="form" ref="form" :rules="rules" label-width="100px" style="max-width: 800px; margin: 0 auto;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IP地址" prop="ip">
            <el-input v-model="form.ip" placeholder="请输入IP" maxlength="15" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="端口" prop="port">
            <el-input-number v-model="form.port" placeholder="请输入端口" :min="1" :max="65535" style="width: 300px"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通道编号" prop="channel">
            <el-input-number v-model="form.channel" placeholder="请输入通道编号" :min="1" :max="64" style="width: 300px"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: center;">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="cancelForm">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {

  props: {
    dialogType: {
      type: String,
      default: 'add'
    },
    cameraData: {
      type: Object,
      default: () => ({})
    },
    nvrInfo:{
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail'])
  },
  watch: {
    dialogType: {
      handler(newValue) {
        this.type = newValue
      }
    },
    cameraData: {
      handler(newValue) {
        this.form = newValue
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      form: {},
      userInfo:this.$store.state.user.userDetail,
      type: "",
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        ip: [
          {required: true, message: '请输入IP地址', trigger: 'blur'},
          {
            required: true,
            pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: 'IP地址格式有误',
            trigger: 'blur'
          }
        ],
        port: [
          {required: true, message: '请输入端口', trigger: 'blur'}
        ],
        channel: [
          {required: true, message: '请输入通道编号', trigger: 'blur'}
        ],
      }
    };
  },
  methods: {
    /**
     * 提交表单
     */
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.nvrId=this.nvrInfo.id;
          this.form.companyId=this.userInfo.ownerUnit
          this.form.roomId=this.nvrInfo.roomId
          this.form.companyName=this.userInfo.ownerUnitName
          if (this.dialogType === 'add') {
            this.$emit('submit', this.form, this.dialogType)
          }
          if (this.dialogType === 'edit') {
            this.$emit('submit', this.form, this.dialogType)
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 关闭弹层
     */
    cancelForm() {
      this.$emit('addAndEditCloseDialog')
    },
    /**
     * 清空表单校验
     */
    clearValidate() {
      this.$refs.form.clearValidate()
    },
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 20px;
}

::v-deep(.el-textarea .el-input__count){
  background: #e0f3ff10 !important;
}
::v-deep(.el-input .el-input__count .el-input__count-inner){
  background: #e0f3ff10 !important;
}
</style>
