<template>
    <basic-container>
      <div class="page_form"></div>
      <div class="page_body">
        <formTitle :titleText="'终端设备新增信息'" :titleType="'page_title'"></formTitle>
        <el-scrollbar style="height:calc(100% - 50px - 55px)">
          <el-form :model="form" ref="dataForm" class="xt_form" label-width="150px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="IP地址" prop="ip" :rules="[{ required: true, message: 'IP地址不能为空'}]">
                  <el-input v-model="form.ip" placeholder="请输入IP地址"></el-input>
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
            <el-row>
              <el-col :span="8">
                <el-form-item label="MAC地址" prop="mac" :rules="[{ required: true, message: 'MAC地址不能为空'}]">
                  <el-input v-model="form.mac" placeholder="请输入MAC地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="网关" prop="gateway" :rules="[{ required: true, message: '网关地址不能为空'}]">
                  <el-input v-model="form.gateway" placeholder="请输入网关地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
  
            <el-row style="margin-top: 30px">
              <el-col :span="8">
                <el-form-item>
                  <el-button type="primary" size="small" @click="handleSaveOK()" :loading="btnLoading" style="margin-left: 20px;">提交
                  </el-button>
                  <el-button class="border-btn" size="small" @click="handleReset" style="margin-left: 20px;">返 回</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-scrollbar>
      </div>
  
    </basic-container>
  </template>
  
  <script>
  import {getTerminalDetail, addTerminal, updateTerminal} from "@/api/terminal";
  import {mapGetters} from "vuex";
  
  export default {
    data() {
      return {
        id: '',
        form: {
          ip: "",
          status: "",
          mac: "",
          gateway: "",
        },
        loading: true,
        isEdit: true,
        deviceStatusList:[{
          label: '1',
          value: '在线'
        },{
          label: '0',
          value: '离线'
        }],
        btnLoading: false,
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.deviceRecord_add, false),
          viewBtn: this.vaildData(this.permission.deviceRecord_view, false),
          delBtn: this.vaildData(this.permission.deviceRecord_delete, false),
          editBtn: this.vaildData(this.permission.deviceRecord_edit, false),
          exportBtn: this.vaildData(this.permission.deviceRecord_export, false)
        };
      },
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
            let saveRes = this.id ? await updateTerminal(this.form) : await addTerminal(this.form)
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
        this.$closePage('/terminal/terminalList/index');
      },
      beforeOpen() {
        getEmpty().then(res => {
          this.form = res.data;
          this.form.id = null;
          this.$forceUpdate()
        });
      },
      loadDetail(id) {
        getTerminalDetail(id).then(res => {
          this.form = res.data;
          this.$refs.dataForm.$forceUpdate()
          this.$forceUpdate()
        });
      },
    }
  };
  </script>
  
  