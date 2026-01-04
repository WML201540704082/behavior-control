<template>
    <basic-container>
      <div class="page_form"></div>
      <div class="page_body">
        <formTitle :titleText="'业务系统维护新增信息'" :titleType="'page_title'"></formTitle>
        <el-scrollbar style="height:calc(100% - 50px - 55px)">
          <el-form :model="form" ref="dataForm" class="xt_form" label-width="150px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="URL地址" prop="url" :rules="[{ required: true, message: 'url地址不能为空'}]">
                  <el-input v-model="form.url" placeholder="请输入URL地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="业务系统名称" prop="businessName" :rules="[{ required: true, message: '业务系统名称不能为空'}]">
                  <el-input v-model="form.businessName" placeholder="请输入业务系统名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="域名" prop="domainName" :rules="[{ required: true, message: '域名不能为空'}]">
                  <el-input v-model="form.domainName" placeholder="请输入域名"></el-input>
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
  import {getMaintenanceDetail, addMaintenance, updateMaintenance} from "@/api/terminal";
  export default {
    data() {
      return {
        id: '',
        form: {
          url: "",
          businessName: "",
          domainName: "",
        },
        loading: true,
        isEdit: true,
        btnLoading: false,
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
            let saveRes = this.id ? await updateMaintenance(this.form) : await addMaintenance(this.form)
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
        this.$closePage('/terminal/userManagement/index');
      },
      handleReset() {
        //返回
        this.$closePage('/monitoring/networkAccess/systemMaintenance/index');
      },
      beforeOpen() {
        getEmpty().then(res => {
          this.form = res.data;
          this.form.id = null;
          this.$forceUpdate()
        });
      },
      loadDetail(id) {
        getMaintenanceDetail(id).then(res => {
          this.form = res.data
          this.$refs.dataForm.$forceUpdate()
          this.$forceUpdate()
        });
      },
    }
  };
  </script>
  
  