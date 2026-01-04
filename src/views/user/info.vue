<template>
  <div>
    <basic-container>
      <avue-form :option="option"
                 v-model="form"
                 @tab-click="handleTabClick"
                 @submit="handleSubmit"></avue-form>
    </basic-container>
  </div>
</template>

<script>
import option from "@/const/user/info";
import {mapGetters, mapState} from "vuex";
import {getUserInfo, update, updatePassword} from "@/api/system/user";
import func from "@/util/func";


export default {
  data() {
    return {
      index: 0,
      option: option,
      form: {}
    };
  },
  created() {
    this.handleWitch();
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    handleSubmit(form, done) {
      if (this.index === 0) {
        update(form).then(res => {
          if (res.success) {
            this.$message({
              type: "success",
              message: "修改信息成功!"
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
          done();
        }, error => {
           
          done();
        })
      } else {
        // console.log("11",this.userInfo)
        if (form.newPassword && form.newPassword1){
          updatePassword(form.oldPassword, form.newPassword, form.newPassword1,this.userInfo.userId).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "修改密码成功!"
              });
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
            }
            done();
          }, error => {
             
            done();
          })
        }else {
          this.$message({
            type: "warning",
            message: "请输入密码!"
          });
        }
      }
    },
    handleWitch() {
      if (this.index === 0) {
        getUserInfo().then(res => {
          const user = res.data;
          this.form = {
            id: user.id,
            avatar: user.avatar,
            name: user.name,
            realName: user.realName,
            phone: user.phone,
            email: user.email,
          }
        });
      }
    },
    handleTabClick(tabs) {
      this.index = func.toInt(tabs.index);
      this.handleWitch();
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-col{
  height: 100%!important;
}
</style>

