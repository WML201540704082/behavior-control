<template>
  <basic-container style="padding-bottom: 60px">
    <breadcrumb path="/xcnanr/operationOrder/maintanceorders/index" master-title="维修工单" :child-title="getTitle()"></breadcrumb>
    <el-form class="xt_form" ref="form" :model="form" :rules="rules" size="small" label-suffix=":" label-width="130px" style="width: 1300px;margin: 0 auto;">
      <el-row>
        <el-col :span="24" v-if="type !== 'Add'">
          <el-form-item label="工单编号" style="font-weight: bold" prop="workOrderNumber">
            <span>{{ form.code }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="公司" prop="companyName">
              <el-input v-model="form.companyName" disabled/>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="部门" prop="deptName">
              <el-input v-model="form.deptName" disabled/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="报修人" prop="user">
            <el-input maxlength="8" show-word-limit v-model="form.user" placeholder="请输入报修人" :disabled="isButtonDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报修人部门" prop="userDeptName">
            <xtTreeLzaySelect :formValue="form.userDeptName" :unit-id="form.companyId" :disabled="isButtonDisabled" :selectType="'DEPT'" @getTreeItem="(v)=>getItem(v,'DEPT')" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="tel">
            <el-input maxlength="11"
                      show-word-limit v-model="form.tel" placeholder="请输入联系方式" :disabled="isButtonDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="维修类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择维修类型" :disabled="isButtonDisabled">
              <el-option v-for="item in typeOptions" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="维修设备" prop="deviceName">
            <template v-if="$route.query.type === 'Dispatch'">
              <el-input v-model="form.deviceName" placeholder="未选择维修设备" disabled />
            </template>
            <template v-else>
              <el-input v-model="form.deviceName" placeholder="请选择维修设备，支持多选" style="width: 1080px" disabled />
              <el-button style="margin-left: 2px" type="primary" @click="checkDeviceFunc">选择设备</el-button>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="height: 80px;">
          <el-form-item label="报修内容" prop="content">
            <el-input type="textarea" v-model="form.content" placeholder="请输入报修内容" :rows="3" resize="none" :disabled="isButtonDisabled" maxlength="300" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="报修位置" prop="position">
            <el-input v-model="form.position" placeholder="请输入位置" :disabled="isButtonDisabled" maxlength="100" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="维修人" prop="repairPerson">
            <el-select v-model="repairPersons" filterable multiple placeholder="请选择维修人" :disabled="['Add', 'Edit', 'Dispatch'].indexOf(type) < 0" @change="handleRepairPersonChange">
              <el-option v-for="item in UsersCondType" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      以上是新增 反馈 派单 详情公用的-->
      <el-row v-if="type === 'Add' || type === 'Edit'">
        <el-col :span="24" style="text-align: center; margin: 10px auto;" v-if="this.warning !== 1">
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-col>
      </el-row>
      <el-row v-if="this.warning === 1">
        <el-col :span="24" style="text-align: center; margin: 10px auto;">
          <el-button type="primary" @click="warningsubmitForm">提交</el-button>
        </el-col>
      </el-row>
      <el-row v-if="type === 'Dispatch'">
        <el-col :span="24" style="text-align: center; margin: 10px auto;">
          <el-button type="primary" @click="DispatchSubmitForm">派单</el-button>
        </el-col>
      </el-row>
      <!-- 维修结果表格 反馈和详情-->
    </el-form>
    <equipment-dialog v-if="deviceDialogFlag" :dialog-flag="deviceDialogFlag" @closeDialog="closeDialogFunc" @submitDialog="loadSelectedDeviceFunc"/>
  </basic-container>
</template>

<script>
import {dispatch, getDetails, getUsersCondi, insertRepair} from '../../../../api/xcnanr/maintanceorders'
import {dealWarning} from '@/api/xcnanr/warning'
import {getUserByUserId} from '@/api/xcnanr/authorizedPerson'
import {mapGetters} from 'vuex'
import {getDictList} from '@/api/dict'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import equipmentDialog from './equipmentDialog.vue'
import {getWarningById} from '../../../../api/xcnanr/warning'
import Breadcrumb from '../../components/Breadcrumb'

export default {
  name: "addMaintenance",
  components: {xtTreeLzaySelect, equipmentDialog, Breadcrumb},
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail']),
  },
  data() {
    return {
      warning: '',
      isButtonDisabled: false,
      id: '',
      childDialogForm: {},
      selectDeviceList: [],
      deviceDialogFlag: false,
      controlType: {},
      typeOptions: {},
      maintance: {},
      UsersCondType: {},
      userInfo: this.$store.state.user.userDetail,
      deviceCode: '',
      device: '',
      tableHeight: undefined,
      maintenanceData: {},
      type: '',
      form: {type: '1',content:'', position: ''},
      repairPersons: [],
      rules: {
        companyName: [
          {required: true, message: '请输入公司名称', trigger: 'blur'}
        ],
        deptName: [
          {required: true, message: '请输入部门名称', trigger: 'blur'}
        ],
        user: [
          {required: true, message: '请输入报修人', trigger: 'blur'}
        ],
        userDeptName: [
          {required: true, message: '请输入报修人部门名称', trigger: 'blur'}
        ],
        tel: [
          {required: true, message: '电话号码不能为空', trigger: 'blur'},
        ],
        type: [
          {required: true, message: '请输入维修类型', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入保修内容', trigger: 'blur'}
        ],
        position: [
          {required: true, message: '请输入维修位置', trigger: 'blur'}
        ],
        repairPerson: [
          {required: true, message: '请输入维修人', trigger: 'blur'}
        ],
      },
    };
  },
  created() {
    this.type = this.$route.query.type
    if(['Add', 'Edit'].indexOf(this.$route.query.type) >= 0) {
      this.isButtonDisabled = false; // 启用按钮
    } else {
      this.isButtonDisabled = true; // 禁用按钮
    }
    const warningId = this.$route.query.warningId
    //转维修工单
    if (warningId) {
      const _this = this
      getWarningById(warningId).then(res => {
        const warningItem = res.data
        this.warning = 1
        this.form.companyName = warningItem.companyName
        this.form.companyId = warningItem.companyId
        this.form.deptName = warningItem.deptName
        this.form.deptId = warningItem.deptId
        this.form.content = warningItem.content
        this.form.position = warningItem.roomName
        // 根据告警创建人ID，获取用户信息，拿到报修人和报修人电话
        getUserByUserId(warningItem.createUser).then(res => {
          _this.form.user = res.data.name
          _this.form.tel = res.data.phone
          _this.$set(_this.form, _this.form.user, res.data.name);  // 使用 Vue.set 修改数组中的对象
          _this.$set(_this.form, _this.form.tel, res.data.phone);  // 使用 Vue.set 修改数组中的对象

        })
        // 加载对象
        this.loadSelectedDeviceFunc([{id: warningItem.unitId, deviceName: warningItem.unitName}])
      })
    }
    /**
     * 获取维修人列表
     */
    getUsersCondi({regionCode: this.userInfo.regionCode}).then(res => {
      this.UsersCondType = res.data.map(item => ({
        id: item.id,
        name: item.name
      }))
    })
    if (this.type !== 'Add') {
      const code = {
        code: this.$route.query.id
      }
      getDetails(code).then(res => {
        this.form = res.data
        this.form.type = res.data.type.toString()
        if (this.type === 'Dispatch') {
          this.form.feedbackPerson = res.data.repairPerson
        }
      })
    } else {
      this.form.companyId = this.userInfo.ownerUnit
      this.form.companyName = this.userInfo.ownerUnitName
      this.form.deptId = this.userInfo.deptId
      this.form.deptName = this.userInfo.deptName
      this.form.companyRegionCode = this.userInfo.regionCode
      this.form.content = this.userInfo.content
    }
    this.rules = {
      companyName: (this.type === 'Edit' || this.type === 'Add') ? [
        {required: true, message: '公司名称不能为空', trigger: 'blur'}
      ] : [],
      deptName: (this.type === 'Edit' || this.type === 'Add') ? [
        {required: true, message: '部门名称不能为空', trigger: 'blur'}
      ] : [],
      user: (this.type === 'Edit' || this.type === 'Add') ? [
        {required: true, message: '报修人不能为空', trigger: 'blur'}
      ] : [],
      userDeptName: (this.type === 'Edit' || this.type === 'Add') ? [
        {required: true, validator: this.userDeptNameRuleValid, trigger: 'change'}
      ] : [],
      tel: (this.type === 'Edit' || this.type === 'Add') ? [
        {required: true, message: '联系方式不能为空', trigger: 'blur'},
      ] : [],
      type: (this.type === 'Edit' || this.type === 'Add') ? [
        {required: true, message: '维修类型不能为空', trigger: 'blur'}
      ] : [],
      content: (this.type === 'Edit' || this.type === 'Add') ? [
        {required: true, message: '保修内容不能为空', trigger: 'blur'}
      ] : [],
      position: (this.type === 'Edit' || this.type === 'Add') ? [
        {required: true, message: '维修位置不能为空', trigger: 'blur'}
      ] : [],
      repairPerson: (this.type === 'Dispatch') ? [
        {required: true, message: '维修人不能为空', trigger: 'blur'}
      ] : [],
    }
    this.getDictList('info_maintance_type')
  },
  methods: {
    userDeptNameRuleValid(rule, value, callback) {
      if (!this.form.userDeptName) {
        callback(new Error('报修人部门不能为空'))
      } else {
        callback()
      }
    },
    handleRepairPersonChange(selectedIds) {
      this.form.repairPersonId = ''
      this.form.repairPerson = ''
      // 找到对应的 item
      for (let i = 0; i < selectedIds.length; i++) {
        const selectedItem = this.UsersCondType.find(item => item.id === selectedIds[i]);
        if (selectedItem) {
          // 更新其他字段
          this.form.repairPersonId += this.form.repairPersonId.length > 0 ? (',' + selectedIds[i]) : selectedIds[i];
          this.form.repairPerson += this.form.repairPerson.length > 0 ? (',' + selectedItem['name']) : selectedItem['name']
        }
      }
    },
    showDictLable(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code);
        if (items != null && items.length > 0) {
          return items[0].dictValue
        }
      }
      return code
    },
    /**
     * 选择设备
     * @param selectedList
     */
    loadSelectedDeviceFunc(selectedList) {
      // 一体化正式环境用的是fullName 标准全称
      selectedList = selectedList.map(d => {
        d.deviceName = (!d.fullName ? (!d.deviceName ? '<未命名设备>' : d.deviceName) : d.fullName)
        return d
      })
      this.selectDeviceList = selectedList
      this.form.deviceName = selectedList.map(item => item.deviceName).join(',');
      this.form.deviceId = selectedList.map(item => item.id).join(',');
      this.getSelectedDeviceStr()
    },
    // 已选择设备回显方法
    getSelectedDeviceStr() {
      let str = ''
      for (let i = 0; i < this.selectDeviceList.length; i++) {
        const item = this.selectDeviceList[i]
        str += item['IP'] + (i === this.selectDeviceList.length - 1 ? '' : ', ')
      }
      this.form.tempDeviceStr = str
    },
    //选择设备
    checkDeviceFunc() {
      this.deviceDialogFlag = true
    },
    closeDialogFunc() {
      this.deviceDialogFlag = false
    },
    getDictList(code) {
      //加载字典
      getDictList(code).then(res => {
        if (code === 'info_repair_plan_mode') {
          this.controlType = res.data
        } else if (code === 'info_maintance_type') {
          this.typeOptions = res.data
        } else if (code === 'info_maintance_equipment') {
          this.equipmentOptions = res.data
        }
      })
    },
    getItem(val, type) {
      if (type === 'CORP') {
        this.form.companyId = val.id
        this.form.companyName = val.fullName
        this.form.userDeptId = null
        this.form.userDeptName = null
      } else if (type === 'DEPT') {
        this.form.userDeptId = val.id
        this.form.userDeptName = val.fullName
        this.$set(this.form, 'userDeptId', val.id);
        this.$set(this.form, 'userDeptName', val.fullName);
      }
      this.$forceUpdate()
    },
    /**
     表格新增维修结果
     */
    addRepairResult() {
      if (!this.deviceCode || !this.device) {
        this.$message({
          type: 'warning',
          message: '设备编号和维修结果不能为空!'
        });
        return;
      }

      this.maintance.push({
        statusInfo: "3",
        repairPerson: this.form.repairPerson,
        maintanceId: this.form.code,
        createUserName: this.userInfo.name,
        deviceName: this.deviceCode,
        feedContent: this.device,
        companyRegionCode: this.userInfo.regionCode,
        companyId: this.userInfo.ownerUnit,
        companyName: this.userInfo.ownerUnitName,
        imgBase64: '' // 初始化 imageBase64 字段
      })
      this.deviceCode = ''
      this.device = ''
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    //告警转维修工单提交
    warningsubmitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const warningId = this.$route.query.warningId
          if (warningId) {
            insertRepair(this.form).then(() => {
              const params = {
                warningId: warningId,
                dealType: 3,
                dealContent: "告警转维修工单",// 1: 确认，2：转入隐患库，3：转维修工单
                repairCode: this.userInfo.repairCode
              }
              const _this = this
              dealWarning(params).then(res => {
                if (res.success) {
                  _this.dialogFlag = false
                  _this.$message.success(res.msg)
                  this.closeTab()
                } else {
                  _this.$message.error(res.msg)
                }
              }).catch(() => {
                _this.$message.error('操作失败')
              })
            })
          }
        } else {
          return false
        }
      })
    },
    //新增提交
    submitForm() {
      // 提交表单的逻辑
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.type === 'Add') {
            // 这里可以添加提交表单的具体逻辑
            insertRepair(this.form).then(() => {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
              this.closeTab()
            })
          } else {
            insertRepair(this.form).then(() => {
              this.$message({
                type: 'success',
                message: '编辑保存成功！'
              })
              this.closeTab()
            })
          }
        } else {
          return false
        }
      })

    },
    closeTab() {
      const tabs = document.querySelectorAll('*[id^="tab-/xcnanr/Maintenance"]')
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].childNodes[1].click()
      }
    },
    cancelForm() {
      // 取消表单的逻辑
      this.$refs.form.resetFields()
      // this.$store.commit('navs/DEL_TAG', this.$route)
      //this.$router.replace('/xcnanr/operationOrder/maintanceorders/index')
      this.DEL_TAG(this.currentTag)
    },
    handleFileChange(event) {
      const files = event.target.files
      if (files.length > 0) {
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64Image = e.target.result
          const mimeType = file.type || 'application/octet-stream' // 默认为二进制流
          const prefixedBase64Image = `data:${mimeType};base64,${base64Image.split(',')[1]}`
          this.updateRowWithImage(prefixedBase64Image)
        };
        reader.onerror = (e) => {
          console.error('文件读取错误:', e)
        };
        reader.readAsDataURL(file)
      }
    },
    updateRowWithImage(image64) {
      if (this.currentRowIndex !== null && this.currentRowIndex >= 0 && this.currentRowIndex < this.maintance.length) {
        this.$set(this.maintance[this.currentRowIndex], 'imgBase64', image64);
      } else {
        console.warn('无效的行索引:', this.currentRowIndex);
      }
      this.currentRowIndex = null; // 清空当前行索引
    },
    previewPhoto(index) {
      const imgBase64 = this.maintance[index].imgBase64;
      if (imgBase64) {
        this.$alert(`<img src="${imgBase64}" style="width: 100%; height: auto;" />`, '预览照片', {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: '关闭'
        });
      } else {
        this.$message({
          type: 'warning',
          message: '没有照片可以预览!'
        });
      }
    },
    getTitle() {
      switch (this.$route.query.type) {
        case 'Add':
          return '新增维修工单'
        case 'Edit':
          return '编辑维修工单'
        case 'Dispatch':
          return '派 单'
        default:
          return null
      }
    },
    //派单提交
    DispatchSubmitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        const dispatchData = {
          'id': this.form.id,
          'repairPerson': this.form.repairPerson,
          'repairPersonId': this.form.repairPersonId,
          'code': this.form.code
        }
        dispatch(dispatchData).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '派单成功'
            })
            this.closeTab()
          } else {
            this.$message({
              type: 'error',
              message: '派单失败'
            })
            this.closeTab()
          }
        })
      })
    }
  }
};
</script>


<style lang="scss" scoped>
.table_detail {
  background: #FFF;
}

::v-deep(.el-input.is-disabled .el-input__inner) {
  color: #606266;
}


.el-card {
  border: 1px solid #eee !important;
}

::v-deep(.el-textarea .el-input__count){
  background: #e0f3ff10 !important;
}
::v-deep(.el-input .el-input__count .el-input__count-inner){
  background: #e0f3ff10 !important;
}
</style>
