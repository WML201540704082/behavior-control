<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <formTitle :titleText="'终端用户新增信息'" :titleType="'page_title'"></formTitle>
      <el-scrollbar style="height:calc(100% - 50px - 55px)">
        <el-form :model="form" ref="dataForm" class="xt_form" label-width="150px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="所属终端" prop="terminal" :rules="[{ required: true, message: 'ip不能为空'}]">
                <el-input v-model="form.terminal" placeholder="请输入终端IP"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户名" prop="name" :rules="[{ required: true, message: '用户名不能为空'}]">
                <el-input v-model="form.name" placeholder="请输入用户名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户类型" prop="userType" :rules="[{ required: true, message: '用户类型不能为空'}]">
                <el-select v-model="form.userType" placeholder="请选择用户类型" clearable>
                  <el-option v-for="dict in userTypeList" :key="dict.value" :label="dict.value" :value="dict.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="可登录时间" prop="timeList" :rules="[{ required: true, message: '可登录时间不能为空'}]">
                <el-date-picker
                  v-model="form.timeList"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="终端状态" prop="status" :rules="[{ required: true, message: '终端状态不能为空'}]">
                <el-select v-model="form.status" placeholder="请选择终端状态" clearable>
                  <el-option v-for="dict in deviceStatusList" :key="dict.value" :label="dict.value" :value="dict.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 50px">
            <el-col :span="8">
              <div style="display: flex;justify-content: center;align-items: center">
                <el-button type="primary" size="small" @click="handleSaveOK()" :loading="btnLoading" style="margin-left: 40px;">提交
                </el-button>
                <el-button class="border-btn" size="small" @click="handleReset" style="margin-left: 20px;">返 回</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
    </div>

  </basic-container>
</template>

<script>
import {getUserDetail, addUser, updateUser} from "@/api/terminal";
export default {
  data() {
    return {
      id: '',
      form: {
        terminal: "",
        name: "",
        userType: "",
        timeList: [],
        loginBeginTime: "",
        loginEndTime: "",
      },
      loading: true,
      isEdit: true,
      userTypeList:[{
        label: '管理员',
        value: '管理员'
      },{
        label: '普通用户',
        value: '普通用户'
      }],
      deviceStatusList:[{
        label: '1',
        value: '在线'
      },{
        label: '0',
        value: '离线'
      }],
      btnLoading: false,
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
    };
  },
  async mounted() {
    // 设置页面元素高度
    this.setPageContentHeight()
    this.id = null;
    //获取参数 判断是否是新增还是修改
    const params = this.$route.query
    //params.id='1760851395719598082'
    this.id = params.id || '';
    if (params.id) {
      this.id = params.id;
      this.loadDetail(params.id);
      this.isEdit = true
    } else {
      //加载空数据
      this.beforeOpen();
      this.isEdit = true
    }
  },
  methods: {
    async handleSaveOK() {
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          this.btnLoading = true //按钮加载状态
          let saveRes = this.id ? await updateUser({
            ...this.form,
            loginBeginTime: this.form.timeList[0],
            loginEndTime: this.form.timeList[1],
          }) : await addUser({
            ...this.form,
            loginBeginTime: this.form.timeList[0],
            loginEndTime: this.form.timeList[1],
          })
          if (saveRes[0] != null) {
            this.btnLoading = false
            return
          }
          this.btnLoading = false
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.handleReset();
        }
      })
    },
    handleReset() {
      //返回
      this.$closePage('/device/devApply');
    },
    beforeOpen() {
      getEmpty().then(res => {
        this.form = res.data;
        this.form.id = null;
        this.$forceUpdate()
      });
    },
    loadDetail(id) {
      getUserDetail(id).then(res => {
        this.form = res.data
        console.log('this.form',this.form)
        this.form.timeList = [res.data.loginBeginTime,res.data.loginEndTime]
        this.form.status = res.data.status == 1 ? '在线' : '离线'
        this.$refs.dataForm.$forceUpdate()
        this.$forceUpdate()
      });
    },
  }
};
</script>

