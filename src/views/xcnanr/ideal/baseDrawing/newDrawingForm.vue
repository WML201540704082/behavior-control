<template>
  <div>
    <el-dialog :title="getTitle(operatorType)" :visible.sync="dialogVisible" width="700px" @close="handleClose"  :close-on-click-modal="false">
      <div class="xt_card_xc xt_form xc_base">
      <el-form :model="form" label-width="100px" :rules="rules" ref="form">
        <!-- 公司和机房名称输入框 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="公司:" prop="companyId">
              <el-input v-model="form.companyName" placeholder="请输入公司" style="width: 550px" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="机房名称:" prop="name">
              <el-input type="text" v-model="form.name" show-word-limit maxlength="10" placeholder="请输入机房名称" style="width: 550px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-card v-if="operatorType === 'add'" shadow="never" style="border: 1px dashed #ccc; padding: 9px; width: 95%; margin-bottom: 20px;">
          <div>
            <upload-file2-oss ref="file" :accept-types="['.jpg', '.png', '.jpeg']" @fileResult="getOssFileInfoFunc"></upload-file2-oss>
            <!-- 图纸表格 -->
            <el-table :data="drawings" style="width: 100%">
              <el-table-column prop="roomDataId" label="序号" width="80">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="name" label="图纸名称" align="center"></el-table-column>
              <el-table-column label="操作" align="center" width="150px">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="deleteDrawing(scope.$index)">删除</el-button>
                  <el-button type="primary" size="mini" @click="previewDrawing(scope.row.ossUrl)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-left: 540px">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-loading="submitBtnLoading" type="primary" @click="handleConfirm">确认</el-button>
      </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {addElectronicDrawings, editElectronicDrawings} from "@/api/xcnanr/electronicDrawings";
import {mapGetters} from "vuex";
import uploadFile2Oss from '../../components/UploadFile2Oss'

export default {
  components: {
    uploadFile2Oss,
    ...mapGetters(["permission", "userInfo", 'userDetail'])
  },
  props: {
    operatorType: {
      type: String,
      default: 'add'
    },
    formDetial: {
      type: Object,
      default: () => ({
        type: '1',
        companyId: '',
        companyName: '',
        deptId: '',
        deptName: ''
      })
    },
  },
  watch: {
    formDetial(newValue) {
      if (newValue) {
        this.form = newValue;
      }
    },
    'form.companyName': {
      handler() {
        if (this.form.companyName === undefined) {
          this.form.companyId = this.userInfo.ownerUnit
          this.form.companyName = this.userInfo.ownerUnitName
        }
      },
      immediate: true,
      deep: true
    },
  },
  data() {
    return {
      userInfo: this.$store.state.user.userDetail,
      swerkList: [],
      dialogVisible: false,
      form: {
        companyName: '',
        name: '',
        drawingName: ''
      },
      drawings: [],
      rules: {
        companyId: [
          {required: true, message: '请输入公司名称', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入机房名称', trigger: 'blur'}
        ]
      },
      submitBtnLoading: false
    };
  },
  mounted() {

  },
  methods: {
    getOssFileInfoFunc(name, ossUrl) {
      this.drawings.push({ name, ossUrl })
    },
    showForm(formDetial) {
      this.dialogVisible = true;
      if (this.operatorType === 'edit' && formDetial) {
        this.form = {
          companyId: formDetial.companyId,
          name: formDetial.name,
          drawingName: ''
        };
        this.drawings = formDetial.roomDataDetailList || [];
      } else {
        this.form = {
          companyId: '',
          name: '',
          drawingName: ''
        };
        this.drawings = [];
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.form = { companyName: '', name: '', drawingName: '' };
      this.drawings = [];
      this.$emit('fetchList');
    },
    deleteDrawing(index) {
      this.drawings.splice(index, 1);
    },
    previewDrawing(imageUrl) {
      this.$refs['file'].previewImageFunc(imageUrl)
    },
    getTitle(type) {
      switch (type) {
        case 'add':
          return '新 增';
        case 'edit':
          return '编 辑';
        case 'see':
          return '详 情';
        case 'feedback':
          return '反 馈';
        default:
          return null;
      }
    },
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitBtnLoading = true
          if (this.operatorType === 'add') {
            const add = {
              companyId: this.form.companyId,
              companyName: this.form.companyName,
              name: this.form.name,
              roomDataDetailList: this.drawings.map(drawing => ({
                name: drawing.name,
                ossUrl: drawing.ossUrl,
                roomDataId: this.form.id
              }))
            };
            addElectronicDrawings(add).then(() => {
              this.$emit('fetchList'); // 调用父组件的fetchList方法
              this.handleClose(); // 关闭弹窗
              this.$message({
                type: "success",
                message: "新增成功!"
              });
              this.submitBtnLoading = false
            }).catch(() => {
              this.submitBtnLoading = false
            });
          } else {
            const edit = {
              name: this.form.name,
              companyName: this.form.companyName,
              companyId: this.form.companyId,
              id: this.form.id
            };
            editElectronicDrawings(edit).then(() => {
              this.$emit('fetchList'); // 调用父组件的fetchList方法
              this.handleClose(); // 关闭弹窗
              this.$message({
                type: "success",
                message: "编辑成功!"
              });
            }).catch(() => {
              this.submitBtnLoading = false
            });
          }
        } else {
          return false;
        }
      });
    },
  }
};
</script>


<style scoped>
.el-dialog__header {
  border-bottom: 1px solid #ebeef5;
}

.el-dialog__footer {
  text-align: right;
}
/* 如果需要增加优先级，可以使用更具体的选择器 */
.el-dialog__footer.dialog-footer {
  text-align: right;
}

::v-deep(.el-textarea .el-input__count){
  background: #e0f3ff10 !important;
}
::v-deep(.el-input .el-input__count .el-input__count-inner){
  background: #e0f3ff10 !important;
}
</style>
