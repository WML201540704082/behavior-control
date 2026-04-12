<template>
  <el-dialog
    :title="id ? '终端设备编辑信息' : '终端设备新增信息'"
    :visible.sync="visible"
    width="500px"
    @close="handleClose"
  >
    <el-form :model="form" ref="dataForm" label-width="100px">
      <el-form-item label="IP地址" prop="ip" :rules="[{ required: true, message: 'IP地址不能为空'}]">
        <el-input v-model="form.ip" placeholder="请输入IP地址"></el-input>
      </el-form-item>
      <el-form-item label="所属组织" prop="deptId" :rules="[{ required: true, message: '所属组织不能为空'}]">
        <el-select v-model="form.deptId" placeholder="请选择所属组织" clearable>
          <el-option v-for="org in orgList" :key="org.id" :label="org.deptName" :value="org.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSaveOK" :loading="btnLoading">提交</el-button>
    </div>
  </el-dialog>
</template>
  
<script>
import { getTerminalDetail, addTerminal, updateTerminal } from "@/api/terminal";
import { getDeptLzayList } from "@/api/system/dept";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        ip: "",
        deptId: "",
      },
      orgList: [],
      btnLoading: false,
    };
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal) {
          this.initData();
        }
      },
      immediate: true
    },
    id: {
      handler(newVal) {
        if (newVal && this.visible) {
          this.loadDetail(newVal);
        }
      },
      immediate: true
    }
  },
  methods: {
    async initData() {
      // 加载组织列表
      await this.loadOrgList();
      if (!this.id) {
        // 新增时重置表单
        this.form = {
          ip: "",
          deptId: "",
        };
        // 重置表单验证状态
        if (this.$refs.dataForm) {
          this.$refs.dataForm.resetFields();
        }
      }
    },
    async loadOrgList() {
      try {
        // 加载山东省电力公司的所有二级组织
        const res = await getDeptLzayList({ parentId: '1745022609004736513' });
        this.orgList = res.data || [];
        console.log('加载的组织列表:', this.orgList);
      } catch (error) {
        console.error('加载组织列表失败:', error);
      }
    },
    async handleSaveOK() {
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          this.btnLoading = true;
          try {
            let saveRes = this.id ? await updateTerminal(this.form) : await addTerminal(this.form);
            if (saveRes[0] != null) {
              this.$message({
                type: "error",
                message: saveRes[0]
              });
              return;
            }
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.handleClose();
          } catch (error) {
            this.$message({
              type: "error",
              message: "操作失败"
            });
          } finally {
            this.btnLoading = false;
          }
        }
      });
    },
    handleClose() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    loadDetail(id) {
      getTerminalDetail(id).then(res => {
        this.form = res.data;
      });
    },
  }
};
</script>
  
  