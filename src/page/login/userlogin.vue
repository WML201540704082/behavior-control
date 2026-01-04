<template>
  <!-- auto-complete="off"
  auto-complete="off"
  auto-complete="off"
  auto-complete="off"
  status-icon -->
  <el-form class="login-form"

           :rules="loginRules"
           ref="loginForm"
           :model="loginForm"
           label-width="0">
    <el-form-item v-if="tenantMode" prop="tenantId">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.tenantId"
                clearable
                :placeholder="$t('login.tenantId')">
        <i slot="prefix"
           class="icon-quanxian"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="username">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.username"
                clearable
                :placeholder="$t('login.username')">
        <i slot="prefix"
           class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                clearable
                show-password
                v-model="loginForm.password"
                :placeholder="$t('login.password')">
        <!--        <i class="el-icon-view el-input__icon"-->
        <!--           slot="suffix"-->
        <!--           @click="showPassword"></i>-->
        <i slot="prefix"
           class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item v-if="captchaMode" prop="code">
      <el-row :span="24">
        <el-col :span="16">
          <el-input size="small"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.code"
                    clearable
                    :placeholder="$t('login.code')">
            <i slot="prefix" class="icon-yanzhengma"/>
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img :src="loginForm.image" class="login-code-img" @click="refreshCode"/>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 size="small"
                 @click.native.prevent="handleLogin"
                 class="login-submit">{{ $t('login.submit') }}
      </el-button>
    </el-form-item>
  </el-form>  <!--  底部  -->

</template>

<script>
import {mapGetters} from "vuex";
import website from '@/config/website';
import {getCaptcha} from "@/api/user";
import {getTopUrl} from "@/util/util";
import {info} from "@/api/system/tenant";
import {getServerPubKey} from "@/util/auth"
import crypto from "@/util/crypto";

export default {
  name: "userlogin",
  data() {
    return {
      tenantMode: website.tenantMode,
      captchaMode: website.captchaMode,
      loginForm: {
        //租户ID
        tenantId: "000000",
        //用户名
        username: "",
        //密码
        password: "",
        //账户类型
        type: "account",
        //验证码的值
        code: "",
        //验证码的索引
        key: "",
        //预加载白色背景
        image: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      },
      loginRules: {
        tenantId: [
          {required: false, message: "请输入租户ID", trigger: "blur"}
        ],
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 1, message: "密码长度最少为6位", trigger: "blur"}
        ]
      },
      passwordType: "password"
    };
  },
  created() {

  },
  mounted() {
    this.getTenant();
    this.loginForm.code = "";
    this.refreshCode();
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  props: [],
  methods: {
    refreshCode() {
      getCaptcha().then(res => {
        const data = res.data;
        this.loginForm.key = data.key;
        this.loginForm.image = data.image;
      })
    },
    showPassword() {
      this.passwordType === ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    handleLogin() {
      debugger
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '登录中,请稍后。。。',
            spinner: "el-icon-loading"
          });
          // 使用公钥对密码加密
          this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
            this.$store.dispatch("GetUserDetail").then(() => {
              this.$store.dispatch("GetUserUnit", this.$store.state.user.userDetail.ownerUnit);
              this.$store.dispatch("GetCustomId").then(() => {
              }).finally(() => {

                if (this.$store.state.user.userDetail.roleAlias ===
                          "control_report" ||
                        this.$store.state.user.userDetail.roleAlias ===
                          "control_solver"
                      ) {
                        //  this.$router.push({path: '/ictOperationManage'})
                         this.$router.push({path: '/ictHome'})
                      } else {
                        this.$router.push({ path: this.tagWel.value });
                      }
                loading.close();
              });
            }).catch(err => {
              this.refreshCode();
              loading.close();
            })
          }).catch(() => {
            this.refreshCode();
            loading.close()
          });
        }
      });
    },
    getTenant() {
      let domain = getTopUrl();
      // 临时指定域名，方便测试
      //domain = "https://bladex.cn";
      info(domain).then(res => {
        const data = res.data;
        if (data.success && data.tenantId) {
          this.tenantMode = false;
          this.loginForm.tenantId = data.tenantId;
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-input input {
  padding-bottom: 0px !important;
}
</style>

