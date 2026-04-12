<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleCancel"
  >
    <el-form :model="form" ref="dataForm" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="通知范围" prop="scopeType">
            <el-radio-group v-model="form.scopeType" :disabled="isView">
              <el-radio label="全局">全局</el-radio>
              <!-- <el-radio label="指定范围">指定范围</el-radio> -->
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.scopeType === '指定范围'">
        <el-col :span="24">
          <el-form-item label="通知范围" prop="scope">
            <el-select v-model="form.scope" placeholder="请选择通知范围" style="width: 100%" :disabled="isView">
              <el-option label="1线端" value="1线端"></el-option>
              <el-option label="2线端" value="2线端"></el-option>
              <el-option label="148终端" value="148终端"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="通知周期" prop="dateRange">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="通知标题" prop="title" :rules="[{ required: true, message: '请输入通知标题'}, { max: 20, message: '标题字数限制为20个字以内'}]">
            <el-input v-model="form.title" placeholder="标题字数限制为20个字以内，不得包含表情、图片等" style="width: 100%" :disabled="isView"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="通知内容" prop="content" :rules="[{ required: true, message: '请输入通知内容'}, { max: 300, message: '通知字数限制为300个字以内'}]">
            <el-input type="textarea" v-model="form.content" placeholder="通知字数限制为300个字以内，不得包含表情、图片等" style="width: 100%;" :disabled="isView"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="图片">
            <el-upload
              class="upload-demo"
              action=""
              :auto-upload="false"
              :on-change="handleImageChange"
              accept=".png"
              :show-file-list="false"
            >
              <div style="display: flex; align-items: center;">
                <el-input v-model="form.image" placeholder="请选择png格式的图片，建议上传840*630尺寸的图片" style="width: 80%" :disabled="isView"></el-input>
                <el-button type="primary" style="margin-left: 10px" :disabled="isView">选择文件</el-button>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="通知URL" prop="url">
            <el-input v-model="form.url" placeholder="请输入通知URL" style="width: 100%" :disabled="isView"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave" :loading="btnLoading" v-if="!isView">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {addMessage, updateMessage, messageDetail} from "@/api/terminal";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isView: {
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
      title: '',
      btnLoading: false,
      dateRange: [],
      dialogVisible: false,
      form: {
        scopeType: '全局',
        startTime: '',
        endTime: '',
        title: '',
        content: '',
        url: '',
      }
    };
  },
  watch: {
    visible: {
      handler(newVal) {
        this.dialogVisible = newVal;
        if (newVal) {
          this.title = this.isView ? '查看通知' : '新建通知';
          if (this.id) {
            this.loadDetail();
          } else {
            this.resetForm();
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    resetForm() {
      this.form = {
        scopeType: '全局',
        startTime: '',
        endTime: '',
        title: '',
        content: '',
        url: '',
      };
      // 设置默认时间范围
      const now = new Date();
      const endDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      this.dateRange = [
        now.toISOString().slice(0, 19).replace('T', ' '),
        endDate.toISOString().slice(0, 19).replace('T', ' ')
      ];
      // 重置表单验证状态
      if (this.$refs.dataForm) {
        this.$refs.dataForm.resetFields();
      }
    },
    async handleSave() {
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          this.btnLoading = true;

          // 处理生命周期格式
          if (this.dateRange && this.dateRange.length === 2) {
            this.form.startTime = this.dateRange[0];
            this.form.endTime = this.dateRange[1];
          }
          
          try {
            let saveRes;
            if (this.id) {
              saveRes = await updateMessage(this.form);
            } else {
              saveRes = await addMessage(this.form);
            }
            
            this.btnLoading = false;
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$emit('close', true);
          } catch (error) {
            this.btnLoading = false;
            this.$message({
              type: "error",
              message: "操作失败"
            });
          }
        }
      });
    },
    handleCancel() {
      this.$emit('close', false);
    },
    loadDetail() {
      messageDetail(this.id).then(res => {
        this.form = res.data;
        // 处理生命周期格式
        if (this.form.startTime && this.form.endTime) {
          this.dateRange = [this.form.startTime,this.form.endTime];
        }
        this.form.scopeType = '全局';
      });
    },
    handleImageChange(file) {
      // 这里可以处理图片上传逻辑
      this.form.image = file.name;
    }
  }
};
</script>