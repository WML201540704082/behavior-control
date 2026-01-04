<template>
  <div class="d_root">
    <el-form ref="queryForm" :model="modelData" :rules="rules" label-width="auto" @submit.native.prevent>
      <el-row>
        <el-col :span="24">
          <el-form-item label="用户姓名:" prop="realName">
            <el-select ref="esel" placeholder="请输入用户姓名" clearable size="mini" v-model="modelData.realName" @visible-change="handleSel" style="width: 100%"></el-select>
          </el-form-item>
        </el-col>


        <el-col :span="24">
          <el-form-item label="部门:" prop="deptName">
            <el-input placeholder="请输入用户账号" size="mini" v-model="modelData.deptName" disabled clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="end">

      </el-row>
    </el-form>

    <div class="d_end">
      <el-button size="mini" type="warning" icon="el-icon-edit" @click="handelUpdate">更新</el-button>
      <el-button size="mini" type="danger" icon="el-icon-close" @click="handelCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import {updateUser} from "@/api/safeDanger/claimExpertPool"
import UserTable from "./userTable.vue";

export default {
  name: "",
  components: {UserTable},
  props: ['formData'],
  data() {
    return {
      loading: false,
      modelData: {},

      addVisible: false,
      // 校验
      rules: {
        realName: [{required: true, message: '必填:用户姓名', trigger: 'blur'}],
      },
    };
  },
  watch: {
    'formData'(newVal, oldVal) {
      if (newVal) {
        let newData = JSON.parse(JSON.stringify(newVal));
        for (const newDataKey in newData) {
          if (newData[newDataKey]) {
            this.modelData[newDataKey] = newData[newDataKey];
          }
        }
      }
    },
  },
  mounted() {
    this.modelData = JSON.parse(JSON.stringify(this.formData));
  },
  methods: {
    handelUpdate() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.loading = true;
          updateUser(this.modelData).then(res => {
            this.msgSuccess("修改成功");
            this.$emit('closeEdit', true);
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    },
    handleSel(vis) {
      if (vis) {
        this.$emit('editChoose');
        if (this.$refs.esel) {
          this.$refs.esel.visible = false;
        }
      }
    },
    handelCancel() {
      this.$emit('closeEdit');
    },
    closeDialog(isRefresh) {

    },
  },
}
</script>
<style scoped>
.d_root {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-flow: column;
  padding: 0px 0px 12px 0px;
}

.d_end {
  display: flex;
  justify-content: flex-end;
}
</style>
