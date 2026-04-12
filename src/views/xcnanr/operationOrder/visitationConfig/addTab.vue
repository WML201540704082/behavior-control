<template>
  <basic-container style="padding-bottom: 60px">
    <breadcrumb path="/xcnanr/operationOrder/visitationConfig/index" master-title="巡视配置项" :child-title="$route.query.type === 'add' ? '新增' : '编辑'"></breadcrumb>
    <el-form class="xt_form" ref="submitForm" inline :model="form" :rules="rules" label-suffix=":" label-width="180px" style="width: 1300px;margin: 0 auto;">
      <span style="display: block; color: #1c8cd9;">巡视配置项基本信息</span>
      <el-form-item label="配置项名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入配置项名称" maxlength="20" show-word-limit style="width: 430px;"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" :disabled="$route.query.type !== 'add'" style="width: 430px;" @change="changeTypeFunc">
          <el-option v-for="item in dictForVisitationType" :key="item.dictValue" :label="item.dictValue" :value="item.dictKey" />
        </el-select>
      </el-form-item>

      <el-divider></el-divider>

      <span style="display: block; color: #1c8cd9;">巡视配置项明细</span>
      <el-form ref="detailForm" inline :model="detailForm" :rules="rules2" label-suffix=":" label-width="180px">
        <el-form-item label="巡视项" prop="detailName">
          <el-input v-model="detailForm.detailName" placeholder="请输入巡视项" maxlength="20" show-word-limit style="width: 430px;"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="detailDesp" style="margin-top: 20px;">
          <el-input type="textarea" v-model="detailForm.detailDesp" placeholder="请输入巡视项描述" maxlength="300" show-word-limit :rows="3" style="width: 1050px;"></el-input>
        </el-form-item>
      </el-form>
      <div align="center" style="margin: 10px 0">
        <el-button v-if="editRowIndex < 0" type="primary" @click="addDetail">添加巡视明细</el-button>
        <el-button v-else type="primary" @click="editRowSubmit">保存巡视明细</el-button>
      </div>

      <el-table :data="form.detailList" style="width: 100%" :key="detailTableKey" stripe max-height="400">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="巡视项"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="enabled" align="center" label="是否启用">-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" active-color="#13ce66" inactive-color="#ff4949"
                       :active-value="1" :inactive-value="0"
                       @change="changeIsEnabled(scope.row, scope.row.enabled)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button @click.native.prevent="editRowFunc(scope.$index, scope.row)" type="text" size="small">编 辑</el-button>
            <el-button @click.native.prevent="deleteRow(scope.$index, form.detailList)" type="text" size="small">移 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="form-btn d_end" style="margin: 10px auto">
        <el-button type="info" plain @click="closeTab">关 闭</el-button>
        <el-button type="primary" error @click="submit" :loading="saveLoading">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
  import {add, update} from "@/api/xcnanr/visitationConfig";
  import {mapGetters} from "vuex";
  import {getDictList} from '@/api/dict'
  import {getDataById} from "@/api/xcnanr/visitationConfig";
  import Breadcrumb from '../../components/Breadcrumb'

  export default {
    components: { Breadcrumb },
    data() {
      return {
        tabFullPath: null,
        dialogVisible: false,
        deviceList: [
          {dictKey: '空1', dictValue: '1'},
          {dictKey: '办公电脑1', dictValue: '2'},
          {dictKey: '空调2', dictValue: '3'},
          {dictKey: '办公电脑2', dictValue: '4'},
        ],
        editingDetailIndex: -1,
        editingDetail: {
          name: '',
          detailDesp: '',
          deviceIds: []
        },
        saveLoading: false,
        loading: false,
        rules: {
          name: [
            {required: true, message: '配置项名称不能为空', trigger: 'blur'},
          ],
          type: [
            {required: true, message: '配置项类型不能为空', trigger: 'blur'},
          ],
          roomId: [
            {required: true, message: '所属机房不能为空', trigger: 'blur'},
          ],
        },
        rules2: {
          detailName: [
            {required: true, message: '巡视项不能为空', trigger: 'blur'},
          ],
          detailDesp: [
            {required: true, message: '描述不能为空', trigger: 'blur'},
          ]
        },
        dictForVisitationType: [], dictForEnableStatus: [],
        form: {
          name: '',
          type: '1',
          roomId: '',
          roomName: '',
          detailList: []
        },
        detailForm: {
          detailName: '',
          detailDesp: '',
          detailDevices: [],
          detailDevicesStr: ''
        },
        detailTableKey: 0,
        deviceDialogFlag: false,
        editRowIndex: -1
      };
    },
    computed: {
      ...mapGetters(["userDetail"]),
    },
    created() {
      // 获取本tab的路径地址
      this.tabFullPath = this.$route.fullPath
      // 加载字典信息：巡视类型
      getDictList("info_inspection_plan_type").then(res => {
        this.dictForVisitationType = res.data
      })
      // 加载字典信息：启用状态
      getDictList("info_enable_status").then(res => {
        this.dictForEnableStatus = res.data
      })
      this.initForm();
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.submitForm.$forceUpdate()
        this.$forceUpdate()
      });
    },
    methods: {
      // 关闭新增tab
      closeTab() {
        this.$router.push({ path: '/xcnanr/operationOrder/visitationConfig/index' })
        document.getElementById('tab-' + this.tabFullPath).childNodes[1].click()
      },
      changeIsEnabled(data, val) {
        let tip = (val === '0') ? '禁用' : '启用'
        this.$confirm('此操作将 "' + tip + '" ' + data.name + ', 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(data, 111111)
        })
      },
      submit() {
        this.$refs.submitForm.validate((valid) => {
          if (valid) {
            if (this.form.detailList.length === 0) {
              this.$message({ type: 'error', message: '巡视配置项明细不能为空'})
              return
            }
            this.saveLoading = true
            if (this.$route.query.type === 'add') {
              add(this.form).then(() => {
                this.$message({
                  type: "success",
                  message: "新增成功!"
                });
                this.closeTab()
              })
            } else {
              update(this.form).then(() => {
                this.$message({
                  type: "success",
                  message: "更新成功!"
                });
                this.closeTab()
              })
            }
          }
        })
      },
      initForm() {
        if (this.$route.query.type === 'add') {
          this.form.type = '1'
          this.form.companyId = this.userDetail.deptId
          this.form.companyName = this.userDetail.deptName
          this.form.deptId = this.userDetail.groupId
          this.form.deptName = this.userDetail.groupName
        } else {
          const configId = this.$route.query.configId
          const _this = this
          getDataById(configId).then(res => {
            if (res && res.code === 200) {
              _this.form = res['data']
              _this.form.type = _this.form.type += ''
              _this.detailTableKey += 1
            }
          })
        }
      },
      // 巡视详情添加
      addDetail() {
        this.$refs.detailForm.validate((valid) => {
          if (valid) {
            // 检查是否重复
            const sameNameList = !this.form.detailList ? [] : this.form.detailList.filter(d => d.name === this.detailForm.detailName)
            if (sameNameList.length > 0) {
              this.$message({
                type: "warning",
                message: "巡视项名称已存在!"
              });
              return;
            }
            this.form.detailList.push({
              name: this.detailForm.detailName, description: this.detailForm.detailDesp, enabled: 1, deviceList: this.detailForm.detailDevices
            })
            this.detailTableKey += 1
            this.detailForm.detailName = ''
            this.detailForm.detailDesp = ''
            this.detailForm.detailDevices = []
            this.detailForm.detailDevicesStr = ''
          }
        })
      },
      editRowFunc(index, row) {
        if (this.editRowIndex >= 0) {
          this.$message({
            type: "warning",
            message: "请先保存巡视明细!"
          });
          return;
        }
        this.editRowIndex = index;
        this.detailForm.detailName = row.name
        this.detailForm.detailDesp = row.description
        this.detailForm.detailDevices = row.deviceList
        this.detailForm.detailDevicesStr = row.deviceList && row.deviceList.length > 0 ? row.deviceList.map(d => d.deviceName).join(', ') : ''
        this.detailTableKey += 1
      },
      editRowSubmit() {
        this.$refs.detailForm.validate((valid) => {
          if (valid) {
            let editRow = this.form.detailList[this.editRowIndex]
            editRow['name'] = this.detailForm.detailName
            editRow['description'] = this.detailForm.detailDesp
            editRow['deviceList'] = this.detailForm.detailDevices
            this.editRowIndex = -1

            this.detailTableKey += 1
            this.detailForm.detailName = ''
            this.detailForm.detailDesp = ''
            this.detailForm.detailDevices = []
            this.detailForm.detailDevicesStr = ''
          }})
      },
      deleteRow(index, rows) {
        if (this.editRowIndex >= 0) {
          this.$message({
            type: "warning",
            message: "请先保存巡视明细!"
          });
          return;
        }
        rows.splice(index, 1);
      },
      // 选择巡视设备按钮事件
      checkDeviceFunc() {
        this.deviceDialogFlag = true
      },
      // 关闭选择设备弹层
      closeDialogFunc() {
        this.deviceDialogFlag = false
      },
      // 选择设备页面点击提交时，需要将已选择的设备同步到本页面（也就是选择设备弹层的父页面）
      loadSelectedDeviceFunc(selectedList) {
        this.detailForm.detailDevices = selectedList.map(d => {
          d['platformDeviceId'] = d.id
          d['deviceName'] = d.deviceName
          return d
        })
        this.detailForm.detailDevicesStr = selectedList.map(d => d.deviceName).join(', ')
      },
      changeTypeFunc() {
        this.detailForm.detailName = ''
        this.detailForm.detailDesp = ''
        this.detailForm.detailDevices = []
        this.detailForm.detailDevicesStr = ''
        this.form.roomId = ''
        this.form.roomName = ''

        if (!this.form.detailList || this.form.detailList.length === 0) {
          return
        }
        this.$confirm('切换类型会将已添加的巡视明细清除，是否切换?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.detailList = []
          this.detailTableKey += 1
        })
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

  .el-card {
    border: 1px solid #eee !important;
  }

  ::v-deep.title-head {
    width: 100%;
    float: left;
    margin: 12px 0 0 60px;
    font-size: 25px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
  /deep/.el-divider {
    margin: 12px 0 10px 0
  }

  ::v-deep(.el-textarea .el-input__count){
    background: #e0f3ff10 !important;
  }
  ::v-deep(.el-input .el-input__count .el-input__count-inner){
    background: #e0f3ff10 !important;
  }
</style>
