<template>
  <div >
    <el-form class="xt_form" :model="form" ref="form" :rules="rules" label-width="100px" style="max-width: 800px; margin: 0 auto;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属公司" prop="companyId">
            <el-input v-model="form.companyName" placeholder="请输入公司" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属机房" prop="roomId">
            <el-select v-model="form.roomId" placeholder="请选择机房">
              <el-option
                v-for="item in allRoom"
                :key="item.id" :label="item.name" :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
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
          <el-form-item label="SDK端口" prop="port">
            <el-input-number v-model="form.port" placeholder="请输入端口" :min="1" :max="65535" style="width: 300px"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名" prop="loginName">
            <el-input v-model="form.loginName" placeholder="请输入用户名" maxlength="20" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="loginPwd">
            <el-input v-model="form.loginPwd" placeholder="请输入密码" maxlength="30" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌" prop="brand">
            <el-input v-model="form.brand" placeholder="请输入品牌" maxlength="20" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="dialogType === 'add'" :span="12">
          <el-form-item label="通道数量" prop="channelCount">
            <el-input-number v-model="form.channelCount" placeholder="请输入通道总数" style="width: 300px" :min="1" :max="64" @change="changeChannelCountFunc"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col v-if="dialogType === 'add'" :span="12">
          <el-form-item label="初始化通道" prop="channelList">
            <el-select v-model="form.channelList" multiple placeholder="请输入通道总数" @change="handleAllSelect">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
    nvrData: {
      type: Object,
      default: () => ({})
    },
    allRoom: {
      type: Array,
      default: () => ([])
    }
  },
  watch: {
    dialogType: {
      handler(newValue) {
        this.type = newValue
      }
    },
    nvrData: {
      handler(newValue) {
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
      swerkList: [],
      userInfo:this.$store.state.user.userDetail,
      form: {},
      options: [],
      type: "",
      rules: {
        companyId: [
          {required: true, message: '请输入所属公司', trigger: 'blur'}
        ],
        roomId: [
          {required: true, message: '请输入所属机房', trigger: 'blur'}
        ],
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
          {required: true, message: '请输入端口', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              const isValid = value >= 1 && value <= 65535;
              if (!isValid) {
                callback(new Error('端口不正确'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        loginName: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        loginPwd: [
          {required: true, message: '请输入密码', trigger: 'blur'}
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
          this.form.roomName = this.allRoom.find(item => item.id === this.form.roomId).name
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
    /**
     * 处理全选
     */
    handleAllSelect() {
      if (this.form.channelList.includes('all')) {
        // 如果选择了“全选”，则选择所有选项
        this.form.channelList = this.options
          .filter(option => option.value !== 'all')
          .map(option => option.value);
      } else {
        // 如果取消了“全选”，则移除“全选”
        this.form.channelList = this.form.channelList.filter(value => value !== 'all');
      }
    },
    // 更改通道数量时，生成通道列表
    changeChannelCountFunc() {
      if (!this.form.channelCount || this.form.channelCount === '0') {
        this.options = []
      } else {
        this.options = [
          {value: 'all', label: '全选(可多选,生成多个通道数据)'},
          ...Array.from({length: parseInt(this.form.channelCount)}, (_, i) => ({
            value: i + 1,
            label: i + 1
          }))
        ]
      }
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
