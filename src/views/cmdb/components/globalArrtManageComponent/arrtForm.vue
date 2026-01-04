<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      :title=" showType+'全局属性' "
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
        <el-form-item label="唯一标识" prop="name">
          <el-input v-model="submitForm.name" :disabled="showType != '新增'"></el-input>
          <div class="form-tips text-tips">保存后不可修改</div>
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input v-model="submitForm.label"></el-input>
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
        <el-form-item label="是否多选" prop="isMultiple">
          <el-switch 
            v-model="submitForm.isMultiple" 
            active-color="#13ce66" 
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="选项" prop="">
          <el-link type="primary" :underline="false" icon="el-icon-plus" @click="addItem">选 项</el-link>
          <el-table
            ref="itemTable"
            :data="submitForm.itemList"
            stripe
            size="mini"
            :row-class-name="tableRowClassName"
          >
            <el-table-column label="值" prop="value">
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" :maxlength="50" show-word-limit></el-input>
              </template>
            </el-table-column>
            <el-table-column label="" width="50">
              <template slot-scope="scope">
                <el-link type="primary" size="mini" :underline="false" icon="el-icon-minus" @click="delItem(scope.row)"></el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="描述" prop="description">
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
import { globalattrDetail, globalattrSave } from "@/api/system/globalArrtManage";

export default {
  props: ['isShow', 'arrtId', 'showType'],
  data() {
    return{
      submitForm: {
        itemList: []
      },
      rules: {
        name: [
          { required: true, message: '唯一标识不能为空', trigger: 'blur' },
        ],
        label: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
        ],
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
    // 添加选项
    addItem() {
      this.submitForm.itemList.push({
        value: ''
      })
    },
    // 删除选项
    delItem(row) {
      this.submitForm.itemList.splice(row.row_index, 1)
    },
    // 设置选项类别标识
    tableRowClassName({row, rowIndex}) {
      row.row_index = rowIndex
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
