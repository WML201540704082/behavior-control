<template>
  <div>
    <el-form class="xt_form" :model="form" ref="form" :rules="rules" label-width="100px" style="max-width: 800px; margin: 0 auto;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="IP地址" prop="ip">
            <el-input v-model="form.ip" placeholder="请输入IP" maxlength="15" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="SDK端口" prop="sdkPort">
            <el-input-number v-model="form.sdkPort" placeholder="请输入SDK端口" :min="1" :max="65535" style="width: 300px"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="MAC">
            <el-input v-model="form.mac" placeholder="请输入MAC地址" maxlength="17" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="用户名" prop="loginName">
            <el-input v-model="form.loginName" placeholder="请输入用户名" maxlength="20" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="密码" prop="loginPwd">
            <el-input v-model="form.loginPwd" placeholder="请输入密码" maxlength="30" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="品牌" prop="brand">
            <el-input v-model="form.brand" placeholder="请输入品牌" maxlength="20" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="型号" prop="model">
            <el-input v-model="form.model" placeholder="请输入型号" maxlength="30" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属公司" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入公司" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="管理员" prop="manageUser">
            <el-input v-model="form.manageUser" placeholder="请输入管理员" maxlength="20" show-word-limit></el-input>
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
    bastionData:{
      type: Object,
      default: () => ({
      })
    }
  },
  watch: {
    dialogType: {
      handler(newValue) {
        this.type = newValue
      }
    },
    bastionData:{
      handler(newValue){
        this.form = newValue
      },
      deep: true,
      immediate: true
    },
    'form.companyName':{
      handler(){
        if(this.form.companyName===undefined){
          this.form.companyId=this.userInfo.ownerUnit
          this.form.companyName=this.userInfo.ownerUnitName
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail'])
  },
  data() {
    return {
      form: {},
      userInfo:this.$store.state.user.userDetail,
      type:"",
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入IP地址', trigger: 'blur' },
          { required: true, pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: 'IP地址格式有误', trigger: 'blur' }
        ],
        sdkPort: [
          { required: true, message: '请输入SDK端口', trigger: 'blur' }
        ],
        mac: [
          { required: true, message: '请输入MAC地址', trigger: 'blur' },
          { required: true, pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, message: 'MAC地址格式有误', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        loginPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        brand: [
          { required: true, message: '请输入品牌', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '请输入所属公司', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getDict()
  },
  methods: {
    /**
     * 提交表单
     */
    submitForm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if(this.dialogType === 'add'){
              this.$emit('submit', this.form, this.dialogType)
            }
            if(this.dialogType === 'edit'){
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
    cancelForm(){
      this.$emit('addAndEditCloseDialog')
    },
    /**
     * 清空表单校验
     */
    clearValidate(){
      this.$refs.form.clearValidate()
    }
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
