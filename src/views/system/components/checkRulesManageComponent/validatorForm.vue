<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="添加规则"
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
        v-loading='pageLoading'
      >
        
        <el-form-item label="名称" prop="name">
          <el-input v-model="submitForm.name"></el-input>
        </el-form-item>
        <el-form-item label="是否激活" prop="isActive">
          <el-switch 
            v-model="submitForm.isActive" 
            active-color="#13ce66" 
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="组件" prop="handler">
          <el-select v-model="submitForm.handler" clearable @change="changeHandler">
            <el-option
              v-for="item in handlerList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="异常模板" prop="errorTemplate">
          <el-input v-model="submitForm.errorTemplate" type="textarea"></el-input>
          <div class="form-tips text-tips">自定义异常信息，范例：属性“{label}”的值“{value}”需要符合IP格式</div>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="submitForm.description" type="textarea"></el-input>
        </el-form-item>

        <div v-if="submitForm.handler">
          <el-divider>组 件 配 置</el-divider>
          <el-form-item
            v-for="(item, index) in formList"
            :key="index"
            :label="item.label"
            :required="true"
          >
            <el-input v-model="submitForm.config[item.name]"></el-input>
          </el-form-item>
        </div>
        <div class="submit_btn">
          <el-button type="primary" size="small" @click="save" :loading="saveLoading">保 存</el-button>
          <el-button size="small" @click="$emit('close')">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { validatorDetail, validatorSave, validatorHandlerList, validatorFormGet } from "@/api/system/checkRulesManage";

export default {
  props: ['isShow', 'itemId', 'showType'],
  data() {
    return{
      submitForm: {
        config: {}
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
        ],
        isActive: [
          { required: true, message: '是否激活', trigger: 'blur' },
        ],
        handler: [
          { required: true, message: '组件不能为空', trigger: 'blur' },
        ]
      },
      handlerList: [],
      formList: [],
      pageLoading: false,
      saveLoading: false
    }
  },
  mounted() {
    this.getDetail()
    this.getDict()
  },
  methods: {
    getDetail() {
      if(this.showType != '新增') {
        this.pageLoading = true
        validatorDetail({id: this.itemId}).then(res => {
          this.pageLoading = false
          this.submitForm = res.Return
          this.changeHandler(this.submitForm.handler)
        }).catch(() => {
          this.pageLoading = false
        })
      }
    },
    getDict() {
      validatorHandlerList().then(res => {
        this.handlerList = res.Return
      })
    },
    changeHandler(val) {
      if(val !== '') {
        validatorFormGet({handler: val}).then(res => {
          this.formList = res.Return
        })
      }
      
    },
    save() {
      this.$refs.submitForm.validate((valid) => {
        if(valid) {
          this.saveLoading = true
          validatorSave(this.submitForm).then(res => {
            this.saveLoading = false
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.$emit('saveValidator')
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
