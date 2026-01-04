<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body" v-loading="pageLoading">
      <el-scrollbar style="height: calc(100% - 55px)">
        <formTitle :titleText="'基本信息'" :titleType="'page_title'"></formTitle>
        <el-form
          ref="submitForm"
          :model="submitForm"
          :rules="rules"
          label-suffix=":"
          label-width="100px"
          class="xt_form"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="报修单号" prop="filingNo">
                <el-input v-model="submitForm.filingNo" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报修类型" prop="repairType">
                <el-select v-model="submitForm.repairType"  placeholder="请输入工单状态" clearable @change="changeRepairType">
                  <el-option  v-for="dict in repairTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="申请单位" prop="applyUnitName">
                <el-input v-model="submitForm.applyUnitName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请部门" prop="applyDeptName">
                <el-input v-model="submitForm.applyDeptName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报修等级" prop="repairLevel">
                <el-select v-model="submitForm.repairLevel"  placeholder="请选择报修等级" clearable  >
                  <el-option  v-for="dict in repairLevelList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="受理人" prop="applyUserName">
                <el-input v-model="submitForm.applyUserName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="受理时间" prop="receiverTime">
                <el-input v-model="submitForm.receiverTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="submitForm.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="height: 100%;">
              <el-form-item label="故障描述" prop="description">
                <el-input v-model="submitForm.description" type="textarea" :rows="5"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <formTitle :titleText="'设备列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" @click="selectDev">选择设备</el-button>
            <el-button type="danger" size="small" plain @click="delDev">删除</el-button>
          </div>
        </formTitle>
        <el-table
          ref="repairDevTable"
          stripe
          size="small"
          :data="repairDevList"
          max-height="380px"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="selection" width="30" fixed="left"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column
            v-for="item in tableCol"
            :key="item.label"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            align="center" show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </el-scrollbar>
      <div class="form-btn">
        <el-button type="primary" size="small" :loading="btnLoading" @click="handleSaveOK(2)" v-if="permissionList.submitBtn">提 交</el-button>
        <el-button type="primary" plain size="small" style="margin-left: 50px;" :loading="btnLoading" @click="handleSaveOK(1)" v-if="permissionList.saveBtn" v-show="isDis">暂 存</el-button>
        <el-button type="primary" plain size="small" style="margin-left: 50px;" @click="handleReset">返 回</el-button>
      </div>
    </div>

    <!-- 设备列表 -->
    <devList
      v-if="showDev"
      :isShow="showDev"
      :userDetail = this.userDetail
      :repairType="submitForm.repairType"
      @submitVal="getDevInfo"
      @close="showDev = false"
    ></devList>
  </basic-container>
</template>

<script>
import { getDictList } from "@/api/dict";
import { computerTable, printTable, otherTable } from "./devTableCol"
import { repairOrderInit, repairOrderSubmit, repairOrderDetail, repairOrderDetailDevlist } from "@/api/operation/devRepair/index"
import { submitProcess } from "@/api/process/index"
import { mapGetters } from "vuex";
import devList from './devList'

export default {
  components: { devList },
  data() {
    return{
      isDis:true,
      pageLoading: false,
      submitForm: {},
      rules: {
        repairType: [
          { required: true, message: '报修类型不能为空', trigger: 'blur' },
        ],
        repairLevel: [
          { required: true, message: '报修等级不能为空', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '故障描述不能为空', trigger: 'blur' },
        ],
      },
      // 设备列表
      repairDevList: [],
      tableCol: computerTable.formTable,
      btnLoading: false,
      // 字典
      repairTypeList: [],
      repairLevelList: [],
      // 弹窗
      showDev: false,
    }
  },
  computed: {
    ...mapGetters(["permission","userDetail"]),
    permissionList() {
      return {
        submitBtn: this.vaildData(this.permission.repair_submit, false),
        saveBtn: this.vaildData(this.permission.repair_save, false),
      };
    },
  },
  mounted() {
    // 设置页面元素高度
    this.setPageContentHeight()
    // 字典
    this.getDict()
    this.initForm()
    const params = this.$route.query
    if (params.isDis !=null) {
      this.isDis = params.isDis
    }
  },
  methods: {
    initForm() {
      this.pageLoading = true
      if(this.$route.query.id) {
        repairOrderDetail({id: this.$route.query.id}).then(res => {
          this.submitForm = res.data
          if(this.submitForm.repairType === '1') {
            this.tableCol = computerTable.formTable
          }else if(this.submitForm.repairType === '2') {
            this.tableCol = printTable.formTable
          }else if(this.submitForm.repairType === '3') {
            this.tableCol = otherTable.formTable
          }
          this.pageLoading = false
        })
        repairOrderDetailDevlist({repairId: this.$route.query.id}).then(res => {
          this.repairDevList = res.data.records
        })
      }else {
        repairOrderInit().then(res => {
          this.submitForm = res.data
          this.pageLoading = false
        })
      }
    },
    getDict() {
      let dict = ['repair_type', 'repair_level']
      for(let i=0 ; i<dict.length; i++) {
        getDictList(dict[i]).then(res => {
          if(dict[i] === 'repair_type') this.repairTypeList = res.data
          else if(dict[i] === 'repair_level') this.repairLevelList = res.data
        })
      }
    },
    // 保存
    handleSaveOK(val) {
      if(this.repairDevList.length === 0) {
        this.$message.warning('请选择报修设备！')
        return
      }
      this.$refs.submitForm.validate(async (valid) => {
        if(valid) {
          this.submitForm.deviceRepairLists = this.repairDevList
          this.submitForm.submitType = val
          this.btnLoading = true

          let saveRes = await this.$asyncCatchApi(repairOrderSubmit, this.submitForm)
          if(saveRes[0] != null) {
            this.btnLoading = false
            return
          }

          // 提交
          if(val == 2) {
            // let cerateRes = await this.$asyncCatchApi(submitProcess, {
            //   assignees: [],
            //   businessKey: saveRes[1].data.filingNo,
            //   comment: "",
            //   participantType: "2",
            //   processDefinitionKey: 'bpm_sbbx',
            //   taskType: "1",
            //   variable: {
            //     'deviceType': this.submitForm.repairType == 3? '1':'0'
            //   },
            // })
            // if(cerateRes[0] != null) {
            //   this.btnLoading = false
            //   return
            // }
          }
          this.$message.success('操作成功！')
          this.btnLoading = false
          this.handleReset()

        }else {
          this.$message.warning('请完善表单必填项！')
        }
      })
    },
    // 返回
    handleReset() {
      if(this.showAudit || this.showAudit===false) {
        this.$closePage('/personalDesk/desk');
      }else {
        this.$closePage('/operation/devRepair');
      }
    },
    tableRowClassName({row, rowIndex}) {
      row.row_index = rowIndex
    },
    // 选择设备类型
    changeRepairType(val) {
      if(val === '1') {
        this.tableCol = computerTable.formTable
      }else if(val === '2') {
        this.tableCol = printTable.formTable
      }else if(val === '3') {
        this.tableCol = otherTable.formTable
      }
      this.repairDevList = []
    },
    // 选择设备
    selectDev() {
      if(this.submitForm.repairType && this.submitForm.repairType != '' && this.submitForm.repairType != null) {
        this.showDev = true
      }else {
        this.$message.warning('请先选择报修类型！')
      }
    },
    delDev() {
      let selectList = this.$refs.repairDevTable.selection
      if(selectList.length == 0) {
        this.$message({
          type: "warning",
          message: "请至少选择一条设备!"
        });
        return
      }
      selectList.sort((a, b) => {
        return b.row_index - a.row_index;
      });
      for(let i=0; i<selectList.length; i++) {
        let item = selectList[i]
        this.repairDevList.splice(item.row_index, 1)
        selectList.splice(i, 1)
        i--
      }
    },
    getDevInfo(val) {
      for(let i=0; i<val.length; i++) {
        for(let j=0; j<this.repairDevList.length; j++) {
          if(val[i].id == this.repairDevList[j].id) {
            this.$message({
              type: "warning",
              message: "请勿重复选择设备!"
            });
            return
          }
        }
      }
      this.repairDevList = this.repairDevList.concat(val)
      this.showDev = false
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
