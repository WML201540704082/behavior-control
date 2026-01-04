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
      <el-form ref="submitForm" class="xt_form" v-if="formDetial" :model="formDetial" :rules="rules" label-suffix=":" label-width="140px" size="small" v-loading="loading" :class="[operatorType==='see'?'e_see':'e_edit']">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="授权公司">
              <el-input v-model="formDetial.companyName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权部门">
              <el-input v-model="formDetial.departmentName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员类型" prop="type">
              <el-radio-group v-model="formDetial.type" :disabled="operatorType === 'edit'" @input="changeWorkerType">
                <el-radio v-for="item in personTypeList" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一体化人员检索" :prop="formDetial.type === '0' ? 'platformId':null">
              <el-select v-model="formDetial.platformId" @change="showPersonDetail(formDetial.platformId)" filterable clearable placeholder="请选择授权人员">
                <el-option-group v-for="group in personGroupList" :key="group.label" :label="'【' + group.label + '】'">
                  <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="formDetial.platformId">
            <el-form-item label="">
              <span>{{ personDetail }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formDetial.type === '2'">
            <el-form-item label="姓名" :prop="formDetial.type === '2' ? 'name':null">
              <el-input v-model="formDetial.name" maxlength="10" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formDetial.type === '2'">
            <el-form-item label="身份证号" :prop="formDetial.type === '2' ? 'idCard':null">
              <el-input v-model="formDetial.idCard" maxlength="18" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formDetial.type === '2'">
            <el-form-item label="外部单位" :prop="formDetial.type === '2' ? 'externalCompany' : null">
              <el-input v-model="formDetial.externalCompany" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡号">
              <el-input v-model="formDetial.accessCard" maxlength="15" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="3"></el-col>
          <el-col :span="9" v-if="operatorType !== 'edit'">
            <el-upload
              ref="upload"
              :limit="1"
              accept=".jpg,.png,.jpeg"
              name="file"
              action="#"
              :disabled="isUploading"
              :on-change="beforeUploadFile"
              :auto-upload="false"
            >
              <el-button type="primary">人脸照片<i class="el-icon-upload"/></el-button>
              <div class="el-upload__tip" slot="tip">只能上传JPG/JPEG/PNG文件，且不超过50kb</div>
            </el-upload>
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
import {mapGetters} from 'vuex'
import {getDictList} from '@/api/dict'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import {add, edit, getAllUsers} from '@/api/xcnanr/authorizedPerson'

export default {
  props: ['isShow', 'operatorType', 'formDetial'],
  components: {getDictList, xtTreeLzaySelect},
  data() {
    const validateIdNo = (rule, value, callback) => {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (value === '' || value === undefined || value == null) {
        callback()
      } else {
        if ((!reg.test(value)) && value !== '') {
          callback(new Error('请输入正确的身份证号码'))
        } else {
          callback()
        }
      }
    }
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date()
        }
      },
      personTypeList: [],
      personList: [], personGroupList: [],
      roomTreeDatas: [], deviceDatas: [], inspectionDatas: [],
      saveLoading: false,
      loading: false,
      rules: {
        companyId: [
          {required: true, message: '授权公司不能为空', trigger: 'blur'},
        ],
        departmentId: [
          {required: true, message: '授权部门不能为空', trigger: 'blur'},
        ],
        type: [
          {required: true, message: '人员类型不能为空', trigger: 'blur'},
        ],
        platformId: [
          {required: true, message: '人员检索不能为空', trigger: 'blur'},
        ],
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'},
        ],
        idCard: [
          {required: true, message: '身份证号不能为空', trigger: 'blur'},
          {validator: validateIdNo, trigger: 'blur'},
        ],
        externalCompany: [
          {required: true, message: '外部单位不能为空', trigger: 'blur'},
        ],
      },
      dialogType: null, dialogFlag: false,
      isUploading: false,
      baseImage: null, personDetail: null
    }
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  created() {
    this.getList()
    this.getDictList('info_worker_type')
    this.getPersonList()
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.submitForm.$forceUpdate()
      this.$forceUpdate()
    });
  },
  methods: {
    getPersonList() {
      getAllUsers().then(res => {
        // personList用于改变下拉值时当总数据使用
        this.personList = res.data
        if (this.operatorType === 'edit') {
          this.showPersonDetail(this.formDetial.platformId)
        }
        // personGroupList当下拉框数据使用
        const companyArr = [...new Set(res.data.map(d => {return d.companyName}))]
        for (const company of companyArr) {
          const tempOptions = res.data.filter(d => d.companyName === company).map(d => {
            return { label: d.name, value: d.id }
          })
          this.personGroupList.push({ label: company, options: tempOptions})
        }
      })
    },
    beforeUploadFile(file) {
      const isLimit = file.size / 1024
      if (isLimit > 50) {
        this.$message.error('图片不能大于50KB')
        this.$refs.upload.clearFiles()
        return false
      }
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = (e) => {
        const base64Img = e.target.result // 此为base64编码
        if (base64Img.includes('data:image/jpeg;base64,')) {
          this.baseImage = e.target.result.split('data:image/jpeg;base64,')[1]
        }
        if (base64Img.includes('data:image/png;base64,')) {
          this.baseImage = e.target.result.split('data:image/png;base64,')[1]
        }
        this.formDetial.faceInfo = this.baseImage
      }
      // 阻止默认上传行为
      return false
    },
    //加载字典
    getDictList(code) {
      getDictList(code).then(res => {
        if (code === 'info_worker_type') {
          this.personTypeList = res.data
        }
      })
    },
    //字典回显
    conversionDict(code, dictList) {
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code)
        if (items != null && items.length > 0) {
          return items[0].dictValue
        }
      }
      return code
    },
    showPersonDetail(personId) {
      const person = this.personList.filter(item => {
        return item.id === personId
      })
      if (person.length === 0) {
        return
      }
      this.personDetail = '检索人员归属信息：' + person[0].companyName + ' / ' + person[0].deptName + ' / ' + person[0].name + ' / ' + person[0].idCard + '/ ' + person[0].phone
      if (this.operatorType === 'add') {
        this.formDetial.name = person[0].name
        this.formDetial.idCard = person[0].idCard
      }
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
              this.$emit('refreshData')
              this.$emit('close')
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
              this.$emit('refreshData')
              this.$emit('close')
            }).catch(err => {
              console.log(err)
            }).finally(() => {
              this.saveLoading = false
            })
          }
        }
      })
    },
    getList() {
      if (this.operatorType === 'add') {
        this.formDetial = {
          type: '0',
          name: null,
          idCard: null,
          externalCompany: null,
          accessCard: null,
          platformId: null,
          companyId: this.userDetail.ownerUnit,
          companyName: this.userDetail.ownerUnitName,
          departmentId: this.userDetail.deptId,
          departmentName: this.userDetail.deptName
        }
      }
      // else if (this.operatorType === 'edit') {
      // }
    },
    getTitle(type) {
      if (type === 'add') {
        return '新 增'
      } else if (type === 'edit') {
        return '编 辑'
      }
      return null;
    },
    // 弹层开启
    uploadPersonFace() {
      this.dialogType = this.operatorType
      this.dialogFlag = true
    },
    // 弹层关闭
    componentClose() {
      this.dialogType = null
      this.dialogFlag = false
    },
    // 修改人员类型
    changeWorkerType() {
      this.personDetail = null
      this.formDetial.name = null
      this.formDetial.idCard = null
      this.formDetial.externalCompany = null
      this.formDetial.accessCard = null
      this.formDetial.platformId = null
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

::v-deep(.el-textarea .el-input__count) {
  background: #e0f3ff10 !important;
}

::v-deep(.el-input .el-input__count .el-input__count-inner) {
  background: #e0f3ff10 !important;
}
</style>
