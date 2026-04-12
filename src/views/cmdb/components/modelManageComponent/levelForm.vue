<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="添加层级"
      width="700px"
      v-el-drag-dialog
    >
      <el-form
         ref="submitForm"
         :model="submitForm"
         :rules="rules"
         size="small"
         label-suffix=":"
         label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="submitForm.name"></el-input>
        </el-form-item>
        <el-form-item label="关键类型">
          <el-switch 
            v-model="submitForm.isMenu" 
            active-color="#13ce66" 
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="是否在拓扑中显示">
          <el-switch 
            v-model="submitForm.isShowInTopo" 
            active-color="#13ce66" 
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <div class="submit_btn">
          <el-button type="primary" size="small" @click="save">保 存</el-button>
          <el-button size="small" @click="$emit('close')">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { citypeSave } from "@/api/system/ciModel";
import { Message } from 'element-ui'

export default {
  props: ['isShow'],
  data() {
    return{
      submitForm: {
        name: '',
        isMenu: 0,
        isShowInTopo: 0
      },
      rules: {
        name: [
          { required: true, pattern: '[^ \x22]+', message: '名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {

  },
  methods: {
    save() {
      // console.log(this.submitForm)
      this.$refs.submitForm.validate((valid) => {
        if(valid) {
          this.savaLoading = true
          citypeSave(this.submitForm).then(res => {
            Message({
              type: 'success',
              message: '保存成功！'
            })
            this.$emit('saveCitype')
            this.savaLoading = false
          }).catch(() => {
            this.savaLoading = false
          })
        }
      })
    },
  }
}
</script>
