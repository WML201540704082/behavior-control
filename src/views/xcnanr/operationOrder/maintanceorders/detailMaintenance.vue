<template>
  <basic-container>
    <breadcrumb path="/xcnanr/operationOrder/maintanceorders/index" master-title="维修工单" :child-title="$route.query.type === 'Detail' ? '详情' : '反馈'"></breadcrumb>
    <el-button v-if="form.statusInfo === 3" type="primary" style="position: absolute;top: 12px;right: 30px;" @click="printForm">打印</el-button>
    <el-form class="xt_form" :model="form" ref="form" :rules="rules" label-width="130px" label-suffix=":" style="width: 1300px;margin: 0 auto 100px auto;">
      <div>
        <el-row>
          <el-col :span="24" v-if="type !== 'add'">
            <el-form-item label="工单编号" prop="workOrderNumber">
              <span style="font-weight: bolder">{{ form.code }}</span>
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
            <el-form-item label="部门" prop="deptName">
              <el-input v-model="form.deptName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修人">
              <el-input v-model="form.user" placeholder="请输入报修人" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修人部门">
              <xt-tree-lzay-select :formValue="form.userDeptName" :unit-id="form.companyId" disabled :selectType="'DEPT'" @getTreeItem="(v)=>getItem(v,'DEPT')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              <el-input v-model="form.tel" placeholder="请输入联系方式" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修类型">
              <el-select v-model="form.type" placeholder="请选择维修类型" disabled>
                <el-option v-for="item in typeOptions" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修设备">
              <el-input v-model="form.deviceName" :placeholder="form.deviceName ? form.deviceName : '未选择维修设备'" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单状态">
              <el-select v-model="form.statusInfo" disabled>
                <el-option v-for="item in dictForStatusList" :key="item.dictKey" :label="item.dictValue" :value="parseInt(item.dictKey)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="height: 80px;">
            <el-form-item label="报修内容" prop="content">
              <el-input type="textarea" v-model="form.content" resize="none" placeholder="请输入报修内容" :rows="3" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报修位置" prop="position">
              <el-input v-model="form.position" placeholder="请输入位置" disabled></el-input>
            </el-form-item>
          </el-col>
          <!-- 详情的进行中的状态，维修人和上面显示在一起 -->
          <el-col :span="12">
            <el-form-item label="维修人" prop="repairPerson">
              <el-input v-model="form.repairPerson" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 执行中和已归档需要对下面的字段进行显示控制 -->
      <template v-if="(form.statusInfo === 6) || (type === 'Feedback')">

        <!-- 分割线 -->
        <el-divider></el-divider>

        <el-row>
          <!-- 反馈页面（执行中）、详情页面（已归档）显示这个维修人 -->
          <el-col :span="12">
            <el-form-item label="反馈人" prop="repairPerson">
              <el-input v-if="type === 'Feedback'" v-model="form.feedbackPerson" placeholder="请输入反馈人"></el-input>
              <el-input v-else v-model="form.feedbackPerson" disabled></el-input>
            </el-form-item>
          </el-col>
          <!-- 已归档的才会显示维修完成时间 -->
          <el-col v-if="form.statusInfo === 6" :span="12">
            <el-form-item label="维修完成时间">
              <el-date-picker
                disabled
                v-model="form.finishTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 300px"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="type === 'Feedback' ? '维修对象' : '维修结果'" :prop="type === 'Feedback' ? 'repairObject' : ''">
          <el-card v-if="type === 'Feedback'" shadow="never" style="border: 1px dashed #ccc; padding: 9px; width: 95%; margin-bottom: 20px">
            <div style="">
              <div style="width: 100%;height: 40px;display: block;">
                <el-button type="primary" plain style="width: 100px; height: 40px; float: left;" @click="choiceDevice">选择设备</el-button>
              </div>
              <el-divider style="display: block;"></el-divider>
              <el-col :span="24">
                <el-form-item label="设备编号" style="" label-width="80px">
                  <el-input :maxlength="30" show-word-limit style="width: 80%" v-model="deviceCode"></el-input>
                  <el-button v-if="detailEditRowIndex < 0" type="primary" plain style="width: 100px; height: 40px; float: right;" @click="addRepairResult">手动添加</el-button>
                  <el-button v-else type="primary" plain style="width: 60px; height: 40px; float: right;" @click="addRepairResult">保存</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="维修内容" style="" label-width="80px">
                  <el-input type="textarea" style="width: 100%" :maxlength="100" :rows="2" show-word-limit v-model="device"></el-input>
                </el-form-item>
              </el-col>

            </div>
          </el-card>
          <el-table ref="tableData" :data="form.detailList" :height="tableHeight" border style="width: 100%">
            <el-table-column prop="index" align="center" label="序号" width="50">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="deviceCode"  align="center" label="设备编号" width="220px"></el-table-column>
            <el-table-column prop="deviceName"  align="center" label="设备名称" width="200px">
              <template slot-scope="scope">
                {{ scope.row.deviceName ? scope.row.deviceName : '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="feedContent" align="center" label="维修内容"></el-table-column>
            <el-table-column label="操作" align="center" width="220">
              <template slot-scope="scope">
                <!-- 反馈 -->
                <template v-if="type === 'Feedback'">
                  <el-button type="text" style="display: inline-block" @click="editDetailRow(scope.$index)">编辑</el-button>
                  <el-button type="text" style="display: inline-block;margin-left: 10px;" @click="removeRow(scope.$index)">移除记录</el-button>
                  <el-button v-if="scope.row.files.length === 0" type="text" @click="uploadIndexFunc(scope.$index)">上传附件</el-button>
                  <el-badge v-else :value="scope.row.files.length" class="item" type="primary" style="margin-right: 30px">
                    <el-button type="text" style="margin-left: 10px;" @click="uploadIndexFunc(scope.$index)">附件列表</el-button>
                  </el-badge>
                </template>
                <!-- 详情 -->
                <template v-else>
                  <el-badge v-if="!!scope.row.files && scope.row.files.length > 0" :value="scope.row.files.length" class="item" type="primary">
                    <el-button type="text" size="mini" @click="uploadIndexFunc(scope.$index)">查看附件</el-button>
                  </el-badge>
                  <span v-else>-</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-col v-if="type === 'Feedback'" style="height: 100%;z-index: 100">
          <el-form-item label="维修结果">
            <el-radio v-model="form.repairResults" label="1">待处理</el-radio>
            <el-radio v-model="form.repairResults" label="2">已完成</el-radio>
          </el-form-item>
        </el-col>
        <div v-if="type === 'Feedback'" style="z-index: 1">
          <el-button type="primary" @click="feedbackSubmitForm" style="display: block;margin: 0 auto; margin-bottom: 100px;" :loading="btnLoading">提交</el-button>
        </div>
      </template>
      <!-- 底边按钮 -->
      <el-col v-if="$route.query.type === 'Detail'" :span="24">
        <el-form-item style="margin-top: 0px;display: flex; justify-content: center; align-items: center">
          <el-button type="info" @click="closeTab">返回</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <!-- 打印 -->
    <Print v-show="printFlag" ref="print" :orderInfo="form" :type-str="typeOptions.find(d => d.dictKey === form.type + '')['dictValue']" :status-str="dictForStatusList.find(d => d.dictKey === form.statusInfo + '')['dictValue']" style="margin-top: 1000px" />
    <!-- 附件列表弹层 -->
    <el-dialog v-if="dialogConfig.flag && dialogConfig.type === 'file'" :visible.sync="dialogConfig.flag" title="维修反馈上传附件列表" width="800px" @close="closeDialogFunc">
      <upload-file2-oss v-if="type === 'Feedback'" ref="file" :accept-types="[]" :max-size="200" @fileResult="getOssFileInfoFunc"></upload-file2-oss>
      <el-table :data="form.detailList[uploadIndex].files" max-height="400px" stripe>
        <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
        <el-table-column prop="fileName" align="center" :show-overflow-tooltip="true" label="附件名称" />
        <el-table-column label="操作" align="center" min-width="100px">
          <template slot-scope="scope">
            <el-button v-if="type === 'Feedback'" type="text" @click="checkFileDialogRemoveFunc(scope.$index)">移除</el-button>
            <el-button type="text" @click="previewFileFunc(scope.row.ossAddress)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 反馈时选择维修设备 -->
    <equipment-dialog v-if="dialogConfig.flag && dialogConfig.type === 'device'" :dialog-flag="dialogConfig.flag" @closeDialog="closeDialogFunc" @submitDialog="loadSelectedDeviceFunc"/>

  </basic-container>
</template>

<script>
import { feedback, getDetails } from '../../../../api/xcnanr/maintanceorders'
import {mapGetters} from 'vuex'
import {getDictList} from '@/api/dict'
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import equipmentDialog from './equipmentDialog.vue'
import Breadcrumb from '../../components/Breadcrumb'
import UploadFile2Oss from '../../components/UploadFile2Oss'
import Print from './print.vue'

export default {
  name: "addMaintenance",
  components: {xtTreeLzaySelect, equipmentDialog, Breadcrumb, UploadFile2Oss, Print},
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail'])
  },
  data() {
    const verifyOperatorArray = (rule, value, callback) => {
      if (this.form.detailList === undefined || this.form.detailList.length === 0) {
        callback(new Error('维修对象不能为空'))
      } else {
        callback()
      }
    }
    return {
      // 图片格式后缀
      imgSuffixList: ['.jpg', '.png', '.jpeg'],
      id: '',
      childDialogForm: {},
      deviceDialogFlag: false,
      controlType: {},
      typeOptions: {},
      userInfo: this.$store.state.user.userDetail,
      deviceCode: '',
      device: '',
      tableHeight: undefined,
      maintenanceData: {},
      type: '',
      form: {},
      dictForStatusList: [],
      rules: {
        repairObject: [
          {required: true, validator: verifyOperatorArray, trigger: 'change'}
        ]
      },
      detailEditRowIndex: -1, btnLoading: false,
      uploadFileList: [], uploadIndex: -1, dialogConfig: { type: null, flag: false },
      printFlag: false
    };
  },
  created() {
    this.type = this.$route.query.type;
    const code = {
      code: this.$route.query.id
    }
    getDetails(code).then(res => {
      this.form = res.data;
      this.form.type = String(res.data.type)
      if (this.type === 'Feedback') {
        this.form.feedbackPerson = this.userInfo.userName
        this.form['repairResults'] = '1'
      } else {
        this.form.feedbackPerson = res.data.feedbackPerson
      }
    })
    this.getDictList('info_maintance_type')
    getDictList("info_maintance_tickets_status").then(res => {
      this.dictForStatusList = res.data
    })
  },
  methods: {
    // 关闭新增临时授权tab
    closeTab() {
      debugger
      this.$router.push({ path: '/xcnanr/operationOrder/maintanceorders/index' })
      // 关闭已经打开过的tab页
      const thisTabId = document.getElementById("tab-/xcnanr/operationOrder/maintanceorders/index")
      const allTabs = thisTabId.parentElement.children
      for (let i = 0; i < allTabs.length; i++) {
        const tab = allTabs[i]
        if (tab.id.indexOf("tab-/xcnanr/MaintenanceDetail") >= 0) {
          document.getElementById(tab.id).childNodes[1].click()
        }
      }
    },
    editDetailRow(index) {
      this.detailEditRowIndex = index
      const detail = this.form.detailList[index]
      this.deviceCode = detail.deviceCode;
      this.device = detail.feedContent;
    },
    imagePreviewFunc(index) {
      this.$refs['uploadImg_' + index].clickHandler();
    },
    imageDelFunc(index) {
      this.$set(this.form.detailList[index], "photoBase64", null)
    },
    uploadIndexFunc(index) {
      this.uploadIndex = index
      this.dialogConfig.flag = true
      this.dialogConfig.type = 'file'
    },
    /**
     * 附件上传成功
     * @param name
     * @param ossAddress
     */
    getOssFileInfoFunc(name, ossAddress) {
      this.form.detailList[this.uploadIndex].files.push({ fileName: name, ossAddress: ossAddress })
    },
    /**
     * 预览反馈上传的附件
     */
    previewFileFunc(ossAddress) {
      if (ossAddress && ossAddress.length > 0) {
        window.open(ossAddress)
      }
    },
    /**
     * 明细列表操作栏中的查看设备弹层中的移除设备事件
     * @param platformDeviceId
     */
    checkFileDialogRemoveFunc(index) {
      this.form.detailList[this.uploadIndex].files.splice(index, 1)
    },
    loadSelectedDeviceFunc(selectedList) {
      if (selectedList.length === 0) {
        return
      }
      for (const item of selectedList) {
        const index = this.form.detailList.findIndex(d => d.deviceCode === item.deviceCode)
        if (index >= 0) {
          console
        }
        const deviceName = (!item.fullName ? (!item.deviceName ? '<未命名设备>' : item.deviceName) : item.fullName)
        console.log(JSON.stringify(item))
        this.form.detailList.push({ deviceId: item.id, deviceCode: item.deviceCode, deviceName: deviceName, feedContent: '', files: [] })
      }
    },
    closeDialogFunc() {
      this.deviceDialogFlag = false
      this.dialogConfig.flag = false
      this.dialogConfig.type = ''
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
        this.childDialogForm.companyId = val.id
        this.childDialogForm.companyName = val.fullName
        this.childDialogForm.deptId = null;
        this.childDialogForm.deptName = null;
      } else if (type === 'DEPT') {
        this.form.deptId = val.id
        this.form.deptName = val.fullName
      }
      this.$forceUpdate()
    },
    /**
     表格新增维修结果
     */
    addRepairResult() {
      if (!this.deviceCode || !this.device) {
        this.$message({ type: "warning", message: "设备编号和维修内容不能为空!" });
        return;
      }
      if (this.detailEditRowIndex < 0) {
        // 新增，添加前先检查一下是否存在重复的编号
        const existsList = this.form.detailList.filter(d => d.deviceCode === this.deviceCode)
        if (existsList.length > 0) {
          this.$message({ type: "error", message: "该设备编号已存在!" });
          return;
        }
        this.form.detailList.push({ deviceCode: this.deviceCode, feedContent: this.device, files: [] })  // 初始化 imageBase64 字段
      } else {
        //编辑，编辑保存前，先检查一下是否存在重复的编号
        for (let i = 0; i < this.form.detailList.length; i++) {
          const item = this.form.detailList[i]
          if (item.deviceCode === this.deviceCode && this.detailEditRowIndex !== i) {
            this.$message({ type: "error", message: "该设备编号已存在!" });
            return;
          }
        }
        this.form.detailList[this.detailEditRowIndex].deviceCode = this.deviceCode
        this.form.detailList[this.detailEditRowIndex].feedContent = this.device
      }
      this.deviceCode = '';
      this.device = '';
      this.detailEditRowIndex = -1
    },
    choiceDevice() {
      this.dialogConfig.flag = true
      this.dialogConfig.type = 'device'
    },
    /**
     * 移除表格行
     */
    removeRow(index) {
        this.form.detailList.splice(index, 1);
    },
    //反馈提交
    feedbackSubmitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        for (const item of this.form.detailList) {
          if (!item.deviceCode || !item.feedContent) {
            this.$message({ type: 'error', message: '设备编号或维修内容不能为空' });
            return
          }
        }

        this.btnLoading = true
        this.form.detailList.map(d => {
          d['companyId'] = this.form['companyId']
          d['companyName'] = this.form['companyName']
          d['companyRegionCode'] = this.form['companyRegionCode']
          d['feedbackPerson'] = this.form['feedbackPerson']
          d['repairResults'] = this.form['repairResults']
          d['createUserName'] = this.userInfo.name
          d['repairPerson'] = this.form.repairPerson
          d['maintanceId'] = this.form.code
          return d
        })
        feedback(this.form.detailList).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '反馈成功'
            });
            document.querySelectorAll('*[id^="tab-/xcnanr/Maintenance' + this.$route.query.type + '"]')[0].childNodes[1].click()
          } else {
            this.$message({
              type: 'error',
              message: '反馈失败'
            });
            this.btnLoading = false
          }
        }).catch(() => {
          this.btnLoading = false
        })
      })
    },
    /**
     * 打印表单
     */
    printForm() {
      this.printFlag = true
      const _this = this
      setTimeout(() => {
        _this.$refs.print.printForm();
      }, 50)
      setTimeout(() => {
        _this.printFlag = false
      }, 1000)

    }
  }
};
</script>

<style lang="scss" scoped>

.table_detail {
  background: #FFF;
}

::v-deep .el-input.is-disabled .el-input__inner {
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
/deep/.el-badge__content {
  top: 15px;
  right: -1px;
}
</style>
