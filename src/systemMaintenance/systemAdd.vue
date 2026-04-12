<template>
  <el-dialog
    :title="id ? '编辑应用导航' : '新增应用导航编'"
    :visible.sync="visible"
    width="500px"
    @close="handleClose"
  >
    <el-form :model="form" ref="dataForm" label-width="100px">
      <el-form-item label="所属组织" prop="deptId" :rules="[{ required: true, message: '所属组织不能为空'}]">
        <el-select v-model="form.deptId" placeholder="请选择所属组织" clearable>
          <el-option v-for="org in orgList" :key="org.id" :label="org.deptName" :value="org.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称" prop="appName" :rules="[{ required: true, message: '应用名称不能为空'}]">
        <el-input v-model="form.appName" placeholder="请输入应用名称"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <div class="upload-container">
          <upload-img
            :file-list="iconFileList"
            @setVal="handleIconUpload"
          />
          <div class="upload-tip">
            图标格式支持jpg、jpeg、png，图片文件大小不超过100k
          </div>
        </div>
      </el-form-item>
      <el-form-item label="URL" prop="url" :rules="[{ required: true, message: 'URL不能为空'}]">
        <el-input v-model="form.url" placeholder="请输入URL地址"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSaveOK" :loading="btnLoading">提交</el-button>
    </div>
  </el-dialog>
</template>
  
<script>
import { getMaintenanceDetail, addMaintenance, updateMaintenance } from "@/api/terminal";
import { getDeptLzayList } from "@/api/system/dept";
import uploadImg from "@/views/operation/components/devReturned/uploadImg.vue";

export default {
  components: {
    uploadImg
  },
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
        deptId: "",
        appName: "",
        icon: "",
        url: "",
      },
      orgList: [],
      iconFileList: [],
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
        // 新增时重置表单，但保留可能已经设置的deptId
        const currentDeptId = this.form.deptId;
        this.form = {
          deptId: currentDeptId || "",
          appName: "",
          icon: "",
          url: "",
        };
        // 重置图标文件列表
        this.iconFileList = [];
        // 重置表单验证状态
        if (this.$refs.dataForm) {
          this.$refs.dataForm.resetFields();
          // 重新设置deptId，确保它被选中
          if (currentDeptId) {
            this.form.deptId = currentDeptId;
          }
        }
      }
    },
    async loadOrgList() {
      try {
        // 加载山东省电力公司的所有二级组织
        const res = await getDeptLzayList({ parentId: '1745022609004736513' });
        this.orgList = res.data || [];
      } catch (error) {
        console.error('加载组织列表失败:', error);
      }
    },
    async handleSaveOK() {
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          this.btnLoading = true;
          try {
            let saveRes = this.id ? await updateMaintenance(this.form) : await addMaintenance(this.form);
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
      getMaintenanceDetail(id).then(res => {
        this.form = res.data;
        // 处理图标文件列表
        if (res.data.icon) {
          this.iconFileList = [{
            name: 'icon',
            url: res.data.icon
          }];
        }
      });
    },
    handleIconUpload(file) {
      if (file) {
        this.form.icon = file.fileUrl;
      } else {
        this.form.icon = '';
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.upload-container {
  margin-top: 10px;
  
  .avatar-uploader {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      border-color: #409eff;
    }
    
    .upload-plus {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      color: #d9d9d9;
    }
    
    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .upload-tip {
    margin-top: 10px;
    font-size: 12px;
    color: #999;
  }
}
</style>
  
  