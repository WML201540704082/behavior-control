<template>
  <div>
    <el-form class="xt_form" :model="form" ref="form" :rules="rules" label-width="100px" style="max-width: 700px; margin: 0 auto;">
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备分类" prop="ciId">
            <el-select v-model="form.ciId" clearable placeholder="请选择设备分类" style="width: 500px" @change="changeType1()">
              <el-option v-for="item in type1" :key="item.ciId" :label="item.ciLabel" :value="String(item.ciId)" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备类型" prop="subCiId">
            <el-select v-model="form.subCiId" clearable placeholder="请选择设备类型" style="width: 500px">
              <el-option v-for="item in type2" :key="item.ciId" :label="item.ciLabel" :value="String(item.ciId)" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="属性" prop="propKey">
            <el-select v-model="form.propKey" clearable placeholder="请选择属性" style="width: 500px">
              <el-option v-for="item in propList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="属性值" prop="propValue">
            <el-input v-model="form.propValue" placeholder="请输入属性值" maxlength="15" show-word-limit style="width: 500px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="属性单位" prop="propUnit">
            <el-input v-model="form.propUnit" placeholder="请输入属性单位" maxlength="15" show-word-limit style="width: 500px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="阈值状态" prop="extAttr1">
            <el-select v-model="form.extAttr1" clearable placeholder="请选择阈值状态" style="width: 500px">
              <el-option label="运行" value="1" />
              <el-option label="停用" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: center;">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="cancelForm">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import { devBookCiTree } from "@/api/assets/devStandingBook"
import { getDictList } from '@/api/dict'

export default {
  props: {
    dialogType: {
      type: String,
      default: 'add'
    },
    formData:{
      type: Object,
      default: () => ({
      })
    }
  },
  watch: {
    dialogType: {
      handler(newValue) {
        this.type = newValue
      }
    },
    formData:{
      handler(newValue){
        this.form = newValue
        this.getType1()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail'])
  },
  data() {
    return {
      type1: [], type2: [], propList: [],
      form: { id: null, ciId: '', ciName: '', subCiId: '', subCiName: '', propKey: null, propValue: null, propUnit: null, extAttr1: '1' },

      userInfo:this.$store.state.user.userDetail,
      type:"",
      rules: {
        ciId: [
          { required: true, message: '请选择设备分类', trigger: 'blur' }
        ],
        subCiId: [
          { required: true, message: '请选择设备类型', trigger: 'blur' }
        ],
        propKey: [
          { required: true, message: '请选择属性', trigger: 'blur' }
        ],
        propValue: [
          { required: true, message: '请输入属性值', trigger: 'blur' }
        ],
        propUnit: [
          { required: true, message: '请输入属性单位', trigger: 'blur' }
        ],
        extAttr1: [
          { required: true, message: '请选择阈值状态', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    // 获取IT设备字典的ciid
    this.getType1()

    // 获取属性字典
    getDictList('info_ideve_run_threshold_props').then(res => {
      this.propList = res.data
    })
  },
  methods: {
    getType1() {
      const _this = this
      getDictList('info_ideve_it_ciid').then(res => {
        if (res && res.data.length > 0) {
          // 获取IT设备下属分类
          devBookCiTree({ parentCiId: res.data[0]['dictKey'], isMenu: 1, current: 1, size: 999 }).then(res1 => {
            _this.type1 = res1.data.records

            if (_this.form.ciId && _this.form.subCiId) {
              devBookCiTree({ parentCiId: _this.form.ciId, isMenu: 1, current: 1, size: 999 }).then(res2 => {
                _this.type2 = res2.data.records
              })
            }
          })
        }
      })
    },
    changeType1() {
      devBookCiTree({ parentCiId: this.form.ciId, isMenu: 1, current: 1, size: 999 }).then(res1 => {
        this.type2 = res1.data.records
      })
    },
    /**
     * 提交表单
     */
    submitForm() {
      const _this = this
        this.$refs.form.validate(valid => {
          if (valid) {
            _this.form.ciName = _this.type1.find(t => String(t.ciId) === String(this.form.ciId)).ciLabel
            _this.form.subCiName = _this.type2.find(t => String(t.ciId)  === String(this.form.subCiId)).ciLabel
            if(this.dialogType === 'add'){
              this.$emit('submit', this.form, this.dialogType)
            }
            if(this.dialogType === 'edit'){
              this.$emit('submit', this.form, this.dialogType)
            }
          } else {
            return false;
          }
        });
    },
    /**
     * 关闭弹层
     */
    cancelForm(){
      this.$emit('addAndEditCloseDialog')
    },
    /**
     * 清空表单校验
     */
    clearValidate(){
      this.$refs.form.clearValidate()
    }
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 20px;
}
::v-deep(.el-textarea .el-input__count){
  background: #e0f3ff10 !important;
}
::v-deep(.el-input .el-input__count .el-input__count-inner){
  background: #e0f3ff10 !important;
}
</style>
