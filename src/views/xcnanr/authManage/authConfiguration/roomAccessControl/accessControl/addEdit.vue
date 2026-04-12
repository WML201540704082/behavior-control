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
          <el-col :span="24">
            <el-form-item label="门禁名称" prop="name">
              <el-input v-model="formDetial.name" maxlength="50" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IP" prop="ip">
              <el-input v-model="formDetial.ip" maxlength="15" show-word-limit placeholder="0.0.0.0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口" prop="port">
              <el-input-number type="number" v-model="formDetial.port" :min="1" :max="65535" :precision="0" :step="1" style="width: 370px;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="MAC" prop="mac">
              <el-input v-model="formDetial.mac" onkeyup="this.value=this.value.toUpperCase()" maxlength="17" show-word-limit placeholder="AA-BB-CC-DD-EE-FF" @change="testValue"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本" prop="version">
              <el-select v-model="formDetial.version" filterable clearable placeholder="请选择版本">
                <el-option
                  v-for="dict in roomAcVersionList"
                  :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"
                >
                </el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权账号">
              <el-input v-model="formDetial.manageLoginName" maxlength="20" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权密码">
              <el-input v-model="formDetial.manageLoginPwd" type="password" show-password auto-complete="on" maxlength="30" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-select v-model="formDetial.brand" filterable clearable placeholder="请选择品牌">
                <el-option
                  v-for="dict in roomAcBrandList"
                  :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号">
              <el-input v-model="formDetial.model" maxlength="30" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="序列号" prop="sn">
              <el-input v-model="formDetial.sn" maxlength="20" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理员" >
              <el-input v-model="formDetial.manageUser" maxlength="20" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联录像机">
              <el-select v-model="formDetial.nvrId" filterable clearable placeholder="请选择关联录像机" @change="changeNvr">
                <el-option v-for="dict in nvrList" :key="dict.id" :label="dict.name" :value="dict.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录像机通道">
              <el-select v-model="formDetial.nvrChannel" filterable clearable placeholder="请选择录像机通道">
                <el-option v-for="dict in nvrChannelList" :key="dict.channel" :label="dict.channel" :value="dict.channel" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="安装位置" prop="position">
              <el-input v-model="formDetial.position" maxlength="100" show-word-limit></el-input>
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
import { add, edit } from "@/api/xcnanr/roomAccessControl.js"
import { getNvr } from "@/api/xcnanr/nvr"
import { getCamera } from "@/api/xcnanr/camera"

export default {
  props: ['isShow', 'operatorType', 'formDetial'],
  components:{ getDictList},
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date()
        }
      },
      roomAcVersionList:[],
      roomAcBrandList:[],
      saveLoading: false,
      loading: false,
      roomId: null,
      rules: {
        name: [
          {required: true, message: '门禁名称不能为空', trigger: 'blur'},
        ],
        ip: [
          {required: true, message: 'IP不能为空', trigger: 'blur'},
          {required: true, pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: 'IP地址格式有误', trigger: 'blur' }
        ],
        mac: [
          {required: false, message: '', trigger: 'blur'},
          {required: false, pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, message: 'MAC地址格式有误', trigger: 'blur' }
        ],
        port: [
          {required: true, message: '端口不能为空', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              const isValid = value >= 1 && value <= 65535;
              if (!isValid) {
                callback(new Error('端口不正确'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        brand: [
          {required: true, message: '品牌不能为空', trigger: 'blur'},
        ],
        sn: [
          {required: true, message: '序列号不能为空', trigger: 'blur'},
        ],
        version: [
          {required: true, message: '版本不能为空', trigger: 'blur'},
        ]
      },
      nvrList: [], nvrChannelList: []
    };
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  created(){
    this.getList();
    this.getDictList('info_room_ac_version')
    this.getDictList('info_room_ac_brand')
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.submitForm.$forceUpdate()
      this.$forceUpdate()
    });
    getNvr({ pageNumber: 1, pageSize: 999, roomId: this.formDetial.roomId }).then(res => {
      this.nvrList = res.data.list
    })
  },
  methods: {
    testValue(value) {
      this.submitForm.mac = value
    },
    //加载字典
    getDictList(code){
      getDictList(code).then(res => {
        if(code==='info_room_ac_version'){
          this.roomAcVersionList = res.data
          console.log(this.roomAcVersionList);
        }else if(code==='info_room_ac_brand'){
          this.roomAcBrandList = res.data
          console.log(this.roomAcBrandList);
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
        this.roomId = this.formDetial.roomId
        this.formDetial = {
          roomId: this.roomId,
          companyId: this.userDetail.ownerUnit,
          companyName: this.userDetail.ownerUnitName,
          departmentId: this.userDetail.deptId,
          departmentName: this.userDetail.deptName,
          companyRegionCode: this.userDetail.regionCode,
          nvrId: null,
          nvrName: null,
          nvrChannel: null
        }
      }else {
        if (this.formDetial.nvrId) {
          getCamera({ nvrId: this.formDetial.nvrId }).then(res => {
            this.nvrChannelList = res.data.list
          })
        }

        this.formDetial.version += ''
        this.formDetial.brand += ''
        if (this.formDetial.nvrChannel <= 0) {
          this.formDetial.nvrChannel = null
        }
        console.log(this.formDetial)
      }
    },
    getTitle(type) {
      if (type === 'add') {
        return '新 增';
      } else if (type === 'edit') {
        return '编 辑';
      }
      return null;
    },
    changeNvr() {
      this.formDetial.nvrChannel = null
      this.nvrChannelList = []
      if (this.formDetial.nvrId) {
        this.formDetial.nvrName = this.nvrList.filter(d => d.id === this.formDetial.nvrId)[0].name
        getCamera({ nvrId: this.formDetial.nvrId }).then(res => {
          this.nvrChannelList = res.data.list
        })
      }
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
