<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      :title=" showType + '关系类型' "
      width="700px"
      top="10vh"
      v-el-drag-dialog
    >
      <el-form
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
        size="small"
        label-suffix=":"
        label-width="100px"
        v-loading="pageLoading"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="submitForm.name"></el-input>
        </el-form-item>
        <el-form-item label="拓扑中显示" prop="isShowInTopo">
          <el-switch 
            v-model="submitForm.isShowInTopo" 
            active-color="#13ce66" 
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="submitForm.description" type="textarea"></el-input>
        </el-form-item>
        <div class="submit_btn">
          <el-button type="primary" size="small" @click="save" :loading="saveLoading">保 存</el-button>
          <el-button size="small" @click="$emit('close')">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { globalattrDetail, globalattrSave } from "@/api/system/relationManage";

export default {
  props: ['isShow', 'arrtId', 'showType'],
  data() {
    return{
      submitForm: {
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
        ]
      },
      pageLoading: false,
      saveLoading: false
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    // 详情
    getDetail() {
      if(this.showType != '新增') {
        this.pageLoading = true
        globalattrDetail({id: this.arrtId}).then(res => {
          this.pageLoading = false
          this.submitForm = res.Return
        }).catch(() => {
          this.pageLoading = false
        })
      }
    },
    // 保存
    save() {
      this.$refs.submitForm.validate((valid) => {
        if(valid) {
          this.saveLoading = true
          globalattrSave(this.submitForm).then(res => {
            this.saveLoading = false
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.$emit('saveGlobalArrt')
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
