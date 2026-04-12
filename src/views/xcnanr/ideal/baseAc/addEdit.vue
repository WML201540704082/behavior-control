<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      :title="getTitle(operatorType)"
      width="1024px"
      top="10vh"
      v-el-drag-dialog>
      <el-form ref="submitForm"
               class="xt_form"
               v-if="formDetial"
               :model="formDetial"
               :rules="rules"
               label-suffix=":"
               label-width="120px"
               size="small"
               v-loading="loading"
               :class="[operatorType==='see'?'e_see':'e_edit']">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="授权公司" prop="companyName">
              <el-input v-model="formDetial.companyName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机房名称" prop="name">
              <el-input v-model="formDetial.name" maxlength="40" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机房类型" prop="type">
              <el-select v-model="formDetial.type" placeholder="请选择机房类型">
                <el-option
                  v-for="dict in roomTypeList"
                  :key="dict.dictKey"
                  :label="dict.dictValue"
                  :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述">
              <el-input v-model="formDetial.remark" maxlength="100" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="form-btn d_end">
          <el-button type="primary" error @click="submit" :loading="saveLoading">保存</el-button>
          <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import { getDictList } from '@/api/dict'
import { add, edit } from "@/api/xcnanr/room"

export default {
  props: ['isShow', 'operatorType', 'formDetial'],
  components:{ getDictList },
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date()
        }
      },
      roomTypeList:[],
      saveLoading: false,
      loading: false,
      rules: {
        companyName: [
          {required: true, message: '授权公司不能为空', trigger: 'blur'},
        ],
        type: [
          {required: true, message: '机房类型不能为空', trigger: 'blur'},
        ],
        name: [
          {required: true, message: '机房名称不能为空', trigger: 'blur'},
        ]
      },
      dialogType: null, dialogFlag: false,
      isUploading: false,
      baseImage: null
    };
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  created(){
    this.getList();
    this.getDictList('info_room_type')
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.submitForm.$forceUpdate()
      this.$forceUpdate()
    });
  },
  methods: {
    // 加载字典
    getDictList(code){
      getDictList(code).then(res => {
        if(code==='info_room_type'){
          this.roomTypeList = res.data
        }
      })
    },
    // 字典回显
    conversionDict(code, dictList) {
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code)
        if (items != null && items.length > 0) {
          return items[0].dictValue
        }
      }
      return code
    },
    submit() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          if (this.operatorType === 'add') {
            add(this.formDetial).then(() => {
              this.$message({
                type: "success",
                message: "新增成功!"
              });
              this.$emit('refreshData');
              this.$emit('close');
            }).catch(err => {
              console.log(err)
            }).finally(() => {
              this.saveLoading = false
            });
          } else {
            edit(this.formDetial).then(() => {
              this.$message({
                type: "success",
                message: "更新成功!"
              });
              this.$emit('refreshData');
              this.$emit('close');
            }).catch(err => {
              console.log(err)
            }).finally(() => {
              this.saveLoading = false
            });
          }
        }
      })
    },
    getList() {
      if (this.operatorType === 'add'){
        this.formDetial = {
          companyId: this.userDetail.ownerUnit,
          companyName: this.userDetail.ownerUnitName,
          type: '1'
        }
      }
    },
    getTitle(type) {
      if (type === 'add') {
        return '新 增';
      } else if (type === 'edit') {
        return '编 辑';
      }
      return null;
    }
  }
}
</script>
<style scoped lang="scss">
.d_tree {
  padding: 12px;
  height: 300px;
  overflow-y: auto;
}

.i_filter {
  margin-bottom: 12px;
}

.s_disabled {
  font-size: 14px;
  color: #a1a1a1;
  display: block;
  margin-bottom: 3px;
}

.s_default {
  font-size: 14px;
  color: #000000;
  display: block;
  margin-bottom: 3px;
}

.e_see {
  pointer-events: none;
}

.e_edit {

}
.d_date_w {
  width: 49%;
}
::v-deep(.el-textarea .el-input__count){
   background: #e0f3ff10 !important;
 }
::v-deep(.el-input .el-input__count .el-input__count-inner){
  background: #e0f3ff10 !important;
}
</style>
