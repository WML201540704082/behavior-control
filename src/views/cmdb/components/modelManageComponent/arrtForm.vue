<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="添加属性"
      width="700px"
      top="10vh"
      v-el-drag-dialog
    >
      <scrollbarBox>
        <el-form
          ref="submitForm"
          :model="submitForm"
          :rules="rules"
          label-suffix=":"
          label-width="100px"
          size="small"
          style="padding-right: 20px"
        >
          <el-form-item label="唯一标识" prop="name">
            <el-input v-model="submitForm.name"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="label">
            <el-input v-model="submitForm.label"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="submitForm.type" :disabled="showType != '新增'">
              <el-row>
                <el-col 
                  :span="6"
                  v-for="item in typeRadioList"
                  :key="item.sort"
                >
                  <el-radio :label="item.name">
                    <i :class="item.icon"></i>
                    <span>{{ item.label }}</span>
                  </el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <template
            v-if="submitForm.type === 'enum' || 
            submitForm.type === 'select' || 
            submitForm.type === 'datetime' || 
            submitForm.type === 'datetimerange' || 
            submitForm.type === 'file' || 
            submitForm.type === 'table' || 
            submitForm.type === 'expression' || 
            submitForm.type === 'hyperlink'"
          >
            <component :is="submitForm.type + 'Form'" :formValue="submitForm" :showType="showType"></component>
          </template>
          
          <el-form-item label="是否必填" prop="isRequired">
            <el-switch 
              v-model="submitForm.isRequired" 
              active-color="#13ce66" 
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item label="是否唯一" prop="isUnique">
            <el-switch 
              v-model="submitForm.isUnique" 
              active-color="#13ce66" 
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item label="自动采集" prop="inputType">
            <el-switch 
              v-model="submitForm.inputType" 
              active-color="#13ce66" 
              inactive-color="#ff4949"
              :active-value="'at'"
              :inactive-value="'mt'"
            ></el-switch>
          </el-form-item>
          <el-form-item label="属性分组">
            <el-input v-model="submitForm.groupName"></el-input>
          </el-form-item>
          <el-form-item label="校验">
            <el-select v-model="submitForm.validatorId">
              <el-option
                v-for="item in validatorList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="submitForm.description" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </scrollbarBox>
      <div class="submit_btn">
        <el-button type="primary" size="small" @click="save" :loading="saveLoading">保 存</el-button>
        <el-button size="small" @click="$emit('close')">取 消</el-button>
      </div>
      
    </el-dialog>
  </div>
</template>

<script>

import { attrtypeList, attrSave, attrDetail } from "@/api/system/ciModel";
import { validatorSearch } from "@/api/system/checkRulesManage";
import enumForm from "./arrtFormConfig/enumForm"
import selectForm from "./arrtFormConfig/selectForm"
import datetimeForm from "./arrtFormConfig/datetimeForm"
import datetimerangeForm from "./arrtFormConfig/datetimerangeForm"
import fileForm from "./arrtFormConfig/fileForm"
import tableForm from "./arrtFormConfig/tableForm"
import expressionForm from "./arrtFormConfig/expressionForm"
import hyperlinkForm from "./arrtFormConfig/hyperlinkForm"


export default {
  components: {
    enumForm,
    selectForm,
    datetimeForm,
    fileForm,
    tableForm,
    expressionForm,
    hyperlinkForm,
    datetimerangeForm,
  },
  props: ["isShow", "ciId", "showType", "arrtId"],
  data() {
    return{
      submitForm: {},
      rules: {
        name: [
          { required: true, message: '唯一标识不能为空', trigger: 'blur' },
        ],
        label: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' },
        ],
      },
      typeRadioList: [],
      validatorList: [],
      saveLoading: false
    }
  },
  mounted() {
    this.getDict()
    this.getDeatil()
  },
  methods: {
    getDeatil() {
      if(this.showType != '新增') {
        attrDetail({id: this.arrtId}).then(res => {
          this.submitForm = res.Return
        })
      }
    },
    getDict() {
      attrtypeList().then(res => {
        this.typeRadioList = res.Return
      })
      validatorSearch({needPage: false}).then(res => {
        this.validatorList = res.Return.tbodyList
      })
    },
    save() {
      this.$refs.submitForm.validate((valid) => {
        if(valid) {
          this.saveLoading = true
          this.submitForm.ciId = this.ciId
          attrSave(this.submitForm).then(res => {
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.$emit('saveArrt')
            this.saveLoading = false
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    },
  }
}
</script>

