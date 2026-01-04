<template>
  <div>
    <el-dialog :title="grandsonDialogTitle" :visible.sync="showChild" append-to-body width="890px" top="10vh" :show-close="true" :close-on-click-modal="false" v-el-drag-dialog>
      <el-form ref="submitForm" :model="formDetail" :rules="rules" label-suffix=":" label-width="120px" size="small" v-loading="loading">
        <el-row>
          <el-col :span="12">
            <el-form-item label="授权公司">
              <el-input v-model="formDetail.companyName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权部门">
              <el-input v-model="formDetail.departmentName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员类型" prop="type">
              <el-radio-group v-model="formDetail.type" @change="changePerson()">
                <el-radio
                  v-for="item in personTypeList"
                  :key="item.dictKey"
                  :label="item.dictKey"
                >{{ item.dictValue }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formDetail.type === '0'">
            <el-form-item label="人员检索" :prop="formDetail.type === '0' ? 'platformId':null">
              <el-select v-model="formDetail.platformId" @change="showPersonDetail(formDetail.platformId,'show')" filterable clearable placeholder="请选择授权人员">
                <el-option v-for="item in personList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="formDetail.platformId && formDetail.type === '0'">
            <el-form-item label="">
              <span>{{personDetail}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formDetail.type === '2'">
            <el-form-item label="姓名" :prop="formDetail.type === '2' ? 'name':null">
              <el-input v-model="formDetail.name" :maxlength="20" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formDetail.type === '2'">
            <el-form-item label="身份证号" :prop="formDetail.type === '2' ? 'idCard':null" >
              <el-input v-model="formDetail.idCard" :maxlength="18" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formDetail.type === '2'">
            <el-form-item label="外部单位" :prop="formDetail.type === '2' ? 'externalCompany' : null">
              <el-input v-model="formDetail.externalCompany" :maxlength="30" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡号">
              <el-input v-model="formDetail.accessCard" :maxlength="15" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="3"></el-col>
          <el-col :span="9">
            <el-upload ref="upload" :limit="1" accept=".jpg,.png,.jpeg" name="file" action="#" :disabled="isUploading" :on-change="beforeUploadFile" :auto-upload="false">
              <el-button type="primary">人脸照片<i class="el-icon-upload" /></el-button>
              <div class="el-upload__tip" slot="tip">只能上传JPG/JPEG/PNG文件，且不超过50kb</div>
            </el-upload>
          </el-col>
        </el-row>
        <div class="form-btn d_end">
          <el-button type="primary" error @click="submit" :loading="saveLoading">保存</el-button>
          <el-button type="danger" plain @click="showChild = false">关 闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getDictList } from '@/api/dict'
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
  import { add, getAllUsers} from "@/api/xcnanr/authorizedPerson"

  export default {
    name: "AddWorkerDialog",
    props: {
      grandsonDialogFlag: {
        type: Boolean,
        default: false
      },
      grandsonDialogTitle: {
        type: String,
        default: '新增被授权人'
      }
    },
    components:{ getDictList, xtTreeLzaySelect},
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
      };
      return {
        formDetail: {},
        operatorType: 'add',
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < new Date()
          }
        },
        personTypeList:[],
        personList: [],
        roomTreeDatas:[], deviceDatas:[], inspectionDatas:[],
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
            { validator: validateIdNo, trigger: 'blur' },
          ],
          externalCompany: [
            {required: true, message: '外部单位不能为空', trigger: 'blur'},
          ],
        },
        dialogType: null, dialogFlag: false,
        isUploading: false,
        baseImage: null, personDetail: null
      };
    },
    computed: {
      ...mapGetters(["userDetail"]),
      showChild: {
        get: function() {
          return this.grandsonDialogFlag
        },
        set: function(newValue) {
          this.$emit('update:grandsonDialogFlag', newValue)
        }
      }
    },
    created(){
      this.getList();
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
      changePerson(){
        if (this.formDetail.type !== '0'){
          this.formDetail.platformId = null
          this.personDetail = null
        }
      },
      getPersonList(){
        getAllUsers().then(res=>{
          this.personList = res.data
          this.showPersonDetail(this.formDetail.platformId,'edit')
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
          this.formDetail.faceInfo = this.baseImage
        }
        // 阻止默认上传行为
        return false
      },
      //加载字典
      getDictList(code){
        getDictList(code).then(res => {
          if(code==='info_worker_type'){
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
      showPersonDetail(personId,type){
        const person = this.personList.filter(item=>{
          return item.id === personId
        })
        if (person.length > 0 && (type === 'show' || type === 'edit')){
          this.personDetail = '检索人员归属信息：' + person[0].companyName + ' / ' + person[0].deptName + ' / ' + person[0].name + ' / ' + person[0].idCard + '/ ' + person[0].phone
          return null
        }else {
          return person[0]
        }
      },
      submit() {
        this.$refs.submitForm.validate((valid) => {
          if (valid) {
            this.saveLoading = true
            if (this.operatorType === 'add') {
              if (this.formDetail.type === '0') {
                const person = this.showPersonDetail(this.formDetail.platformId, 'add')
                this.formDetail.name = person.name
                this.formDetail.idCard = person.idCard
              }
              add(this.formDetail).then(() => {
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
            }
          }
        })
      },
      getList() {
        this.formDetail = {
          type: '0',
          companyId: this.userDetail.ownerUnit,
          companyName: this.userDetail.ownerUnitName,
          departmentId: this.userDetail.deptId,
          departmentName: this.userDetail.deptName
        }
      },
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
  .d_date_w {
    width: 49%;
  }
</style>
