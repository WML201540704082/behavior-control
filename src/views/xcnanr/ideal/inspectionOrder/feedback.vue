<template>
  <basic-container style="padding-bottom: 60px;">
    <breadcrumb path="/xcnanr/ideal/inspectionOrder/index" master-title="巡视任务" child-title="反馈"></breadcrumb>
    <el-form class="xt_form" ref="childDialogForm" :model="childDialogForm" inline size="small" label-suffix=":" label-width="130px" style="width: 1300px;margin: 0 auto;">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form-item label="工单编号">
              <span style="font-weight: bolder">{{ childDialogForm.code }}</span>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12" style="height: 100%;">
          <el-form-item label="公司" prop="companyName">
            <el-input v-model="childDialogForm.companyName" disabled style="width: 390px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="部门" prop="deptName">
              <el-input v-model="childDialogForm.deptName" disabled style="width: 390px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视类型" prop="type">
              <el-select v-model="childDialogForm.type" disabled clearable placeholder="请选择巡视类型" style="width: 390px">
                <el-option v-for="item in inspectionTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视人" prop="persons">
              <el-input v-model="childDialogForm.workers" disabled style="width: 390px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视时间段" prop="startTime">
              <el-input v-model="times" disabled style="width: 390px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="grid-contents bg-purple">
            <el-form-item label="巡视内容" prop="content">
              <el-input v-model="childDialogForm.content" disabled clearable placeholder="请输入巡视内容" type="textarea" :rows="3" style="width: 1040px;" resize="none"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视人" prop="feedbackPerson">
              <el-input v-model="childDialogForm.feedbackPerson" style="width: 390px" :maxlength="10" show-word-limit></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24" style="height: 100%;">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视结果">
              <!-- 机房巡视结果表格 -->
              <el-table :key="Math.random()" v-if="childDialogForm.type === '1'" :data="childDialogForm.orderDetailList" max-height="400px" :row-class-name="tableRowClassName" style="width:1040px" stripe>
                <el-table-column prop="objectName" align="center" :show-overflow-tooltip="true" label="所属机房" />
                <el-table-column label="配置项" align="center">
                  <el-table-column prop="configDetailName" align="center" :show-overflow-tooltip="true" label="巡视项" />
                  <el-table-column prop="configDetailDescription" align="center" :show-overflow-tooltip="true" label="描述" />
                </el-table-column>
                <el-table-column prop="solveStatus" align="center" :show-overflow-tooltip="true" label="巡视结果" width="80px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.solveStatus === 0" style="cursor: pointer; font-size: 20px" @click="changeStatus(scope.$index, scope.row.solveStatus)"><i class="el-icon-success" style="color: #00c868"/></span>
                    <span v-else style="cursor: pointer; font-size: 20px" @click="changeStatus(scope.$index, scope.row.solveStatus)"><i class="el-icon-error" style="color: red"/></span>
                  </template>
                </el-table-column>
                <el-table-column label="缺陷上报" align="center">
                  <el-table-column align="center" prop="solveStatus" label="是否已解决" width="100px">
                    <template slot-scope="scope">
                      <template v-if="scope.row.solveStatus !== 0">
                        <el-radio v-model="radio[scope.$index].key" :label="1" @change="getRadio(scope.$index,1)">是</el-radio>
                        <el-radio v-model="radio[scope.$index].key" :label="2" @change="getRadio(scope.$index,2)">否</el-radio>
                      </template>
                      <span v-else>-</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="feedbackContent" align="center" :show-overflow-tooltip="true" label="缺陷描述" min-width="200px">
                    <template slot-scope="scope">
                      <el-input v-if="scope.row.solveStatus !== 0" v-model="childDialogForm.orderDetailList[scope.$index].feedbackContent" placeholder="请输入缺陷描述" :maxlength="30" show-word-limit />
                      <span v-else>-</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" min-width="120px">
                    <template slot-scope="scope">
                      <template v-if="scope.row.solveStatus !== 0">
                        <template>
                          <el-button v-if="selectedDeviceList.filter(d => d.index === scope.$index).length === 0" type="text" @click="changeDeviceFunc(scope.$index)">选择设备</el-button>

                          <el-badge v-else :value="selectedDeviceList.filter(d => d.index === scope.$index).length" class="item" type="primary" style="margin-right: 30px;">
                            <el-button type="text" @click="checkDeviceFunc(scope.$index)">设备列表</el-button>
                          </el-badge>
                        </template>
                        <template>
                          <el-button v-if="uploadFileList.filter(d => d.index === scope.$index).length === 0" type="text" @click="uploadIndexFunc(scope.$index)">上传附件</el-button>
                          <el-badge v-else :value="uploadFileList.filter(d => d.index === scope.$index).length" class="item" type="primary">
                            <el-button type="text" style="margin-left: 10px;" @click="uploadIndexFunc(scope.$index)">附件列表</el-button>
                          </el-badge>
                        </template>
                      </template>
                      <span v-else>-</span>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
              <!-- 设备巡视结果表格 -->
              <el-table :key="Math.random()" v-else :data="childDialogForm.orderDetailList" max-height="400px" :row-class-name="tableRowClassName" style="width:1040px" stripe>
                <el-table-column prop="objectName" align="center" :show-overflow-tooltip="true" label="设备名称" />
                <el-table-column prop="extAttr2" align="center" :show-overflow-tooltip="true" label="IP" />
                <el-table-column label="配置项" align="center">
                  <el-table-column prop="configDetailName" align="center" :show-overflow-tooltip="true" label="巡视项" />
                  <el-table-column prop="configDetailDescription" align="center" :show-overflow-tooltip="true" label="描述" />
                </el-table-column>
                <el-table-column prop="solveStatus" align="center" :show-overflow-tooltip="true" label="巡视结果" width="80px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.solveStatus === 0" style="cursor: pointer; font-size: 20px" @click="changeStatus(scope.$index, scope.row.solveStatus)"><i class="el-icon-success" style="color: #00c868"/></span>
                    <span v-else style="cursor: pointer; font-size: 20px" @click="changeStatus(scope.$index, scope.row.solveStatus)"><i class="el-icon-error" style="color: red"/></span>
                  </template>
                </el-table-column>
                <el-table-column label="缺陷上报" align="center">
                  <el-table-column align="center" prop="solveStatus" label="是否已解决">
                    <template slot-scope="scope">
                      <template v-if="scope.row.solveStatus !== 0">
                        <el-radio v-model="radio[scope.$index].key" :label="1" @change="getRadio(scope.$index, 1)">是</el-radio>
                        <el-radio v-model="radio[scope.$index].key" :label="2" @change="getRadio(scope.$index, 2)">否</el-radio>
                      </template>
                      <span v-else>-</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="feedbackContent" align="center" label="缺陷描述" min-width="200px">
                    <template slot-scope="scope">
                      <el-input v-if="scope.row.solveStatus !== 0" v-model="childDialogForm.orderDetailList[scope.$index].feedbackContent" placeholder="请输入缺陷描述" :maxlength="30" show-word-limit />
                      <span v-else>-</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" min-width="100px">
                    <template slot-scope="scope">
                      <template v-if="scope.row.solveStatus !== 0">
                        <template>
                          <el-button v-if="uploadFileList.filter(d => d.index === scope.$index).length === 0" type="text" @click="uploadIndexFunc(scope.$index)">上传附件</el-button>
                          <el-badge v-else :value="uploadFileList.filter(d => d.index === scope.$index).length" class="item" type="primary">
                            <el-button type="text" style="margin-left: 10px;" @click="uploadIndexFunc(scope.$index)">附件列表</el-button>
                          </el-badge>

                        </template>
                      </template>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24" style="height: 100%">
          <el-form-item label="缺陷反馈总结">
            <el-input v-model="childDialogForm.defectFeedbackSummary" type="textarea" :rows="3" :maxlength="300" show-word-limit style="width: 1040px;" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="width:150px;margin: 10px auto;">
      <el-button type="primary" @click="submitEvent" :loading="saveLoading">提 交</el-button>
      <el-button @click="returnEvent" :loading="saveLoading">返 回</el-button>
    </div>

    <!-- 选择设备弹层 -->
    <feedback-device-dialog v-if="dialogConfig.flag && dialogConfig.type === 'changeDevice'" :dialog-flag="dialogConfig.flag" title="反馈缺陷" :auth-device-type-list="[]" @closeDialog="closeDialogFunc" @submitDialog="loadSelectedDeviceFunc"/>
    <!-- 设备列表弹层 -->
    <el-dialog v-if="dialogConfig.flag && dialogConfig.type === 'checkDevice'" :visible.sync="dialogConfig.flag" title="已选择异常情况设备列表" width="800px" @close="closeDialogFunc">
      <el-table :data="selectedDeviceList.filter(d => d.index === selectDeviceIndex)" max-height="400px" stripe>
        <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
        <el-table-column prop="deviceName" align="center" :show-overflow-tooltip="true" label="设备名称" />
        <el-table-column label="操作" align="center" min-width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="checkDeviceDialogRemoveFunc(scope.row.platformDeviceId)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 附件列表弹层 -->
    <el-dialog v-if="dialogConfig.flag && dialogConfig.type === 'file'" :visible.sync="dialogConfig.flag" title="巡视反馈上传附件列表" width="800px" @close="closeDialogFunc">
      <upload-file2-oss ref="file" :accept-types="[]" :max-size="200" @fileResult="getOssFileInfoFunc"></upload-file2-oss>
      <el-table :data="uploadFileList.filter(d => d.index === uploadIndex)" max-height="400px" stripe>
        <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
        <el-table-column prop="fileName" align="center" :show-overflow-tooltip="true" label="附件名称" />
        <el-table-column label="操作" align="center" min-width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="checkFileDialogRemoveFunc(scope.row.ossAddress)">移除</el-button>
            <el-button type="text" @click="previewFileFunc(scope.row.ossAddress)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </basic-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { feedbackWorkOrder,getDetailById } from '@/api/xcnanr/inspectionOrder'
  import { getDictList } from '@/api/dict'
  import Breadcrumb from '../../components/Breadcrumb'
  import FeedbackDeviceDialog from '../../authManage/temporaryAuth/deviceDialog'
  import uploadFile2Oss from '../../components/UploadFile2Oss'

  export default {
    props: {
      childDialogFlag: { type: Boolean, default: false },
      dialogType: { type: String, default: '' }
    },
    components: { getDictList, Breadcrumb, FeedbackDeviceDialog, uploadFile2Oss },
    data() {
      return {
        // 巡视时间段
        times: null,
        // 巡视人
        persons: null,
        // 图片格式后缀
        imgSuffixList: ['.jpg', '.png', '.jpeg'],
        inspectionTypeList:[],
        operatorType:null,
        childDialogForm: {
          type: ''
        },
        orderDetailList: [],
        rules: {
          feedbackPerson: [
            { required: true, message: "巡视人不能为空", trigger: "change" },
          ]
        },
        saveLoading: false,
        radio: [],
        tableIndex: null,
        feedbackForm: {
          id: null,
          feedbackPerson: null,
          defectFeedbackSummary: null,
          orderDetailList: []
        },
        dialogConfig: { type: null, flag: false },
        // 这两个是明细表格中选择的设备和上传的附件，明细共用这两个字段，每个字段集合中的对象属性，都需要添加一个index，供提交的时候区分使用
        selectedDeviceList: [], uploadFileList: [],
        selectDeviceIndex: -1, uploadIndex: -1,
      }
    },
    computed: {
      ...mapGetters(['userDetail'])
    },
    mounted() {
      this.getDictList('info_inspection_plan_type')
      this.operatorType = this.$route.query.type
      this.getList()

    },
    methods: {
      // 明细列表操作栏中的选择设备事件
      changeDeviceFunc(index) {
        this.selectDeviceIndex = index
        this.dialogConfig = { flag: true, type: 'changeDevice' }
      },
      // 明细列表操作栏中的查看设备事件
      checkDeviceFunc(index) {
        this.selectDeviceIndex = index
        this.dialogConfig = { flag: true, type: 'checkDevice' }
      },
      // 明细列表操作栏中的查看设备弹层中的移除设备事件
      checkDeviceDialogRemoveFunc(platformDeviceId) {
        for (let i = 0; i < this.selectedDeviceList.length; i++) {
          const item = this.selectedDeviceList[i]
          if (item.index === this.selectDeviceIndex && item.platformDeviceId === platformDeviceId) {
            this.selectedDeviceList.splice(i, 1)
          }
        }
      },
      // 关闭选择设备弹层
      closeDialogFunc() {
        this.dialogConfig.flag = false
        this.dialogConfig.type = null
        this.selectDeviceIndex = -1
        this.uploadIndex = -1
      },
      // 选择设备页面点击提交时，需要将已选择的设备同步到本页面（也就是选择设备弹层的父页面）
      loadSelectedDeviceFunc(selectedList) {
        const list = selectedList.map(d => {
          d['platformDeviceId'] = d.id
          d['deviceName'] = (!d.fullName ? (!d.deviceName ? '<未命名设备>' : d.deviceName) : d.fullName)
          d['deviceNo'] = d.deviceCode
          d['index'] = this.selectDeviceIndex
          return d
        })
        this.selectedDeviceList.push(...list)
        console.log(this.selectedDeviceList)
      },
      imagePreviewFunc(index) {
        this.$refs['uploadImg_' + index].clickHandler();
      },
      imageDelFunc(index) {
        this.$set(this.childDialogForm.orderDetailList[index], "photoBase64", null)
      },
      getRadio(index, value) {
        const status = value === 1 ? 2 : 1;
        this.$set(this.childDialogForm.orderDetailList[index], "solveStatus", status);
        this.$set(this.radio[index], "key", value);
      },
      /**
       * 打开文件上传列表
       * @param index
       */
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
        this.uploadFileList.push({index: this.uploadIndex, detailId: this.childDialogForm.orderDetailList[this.uploadIndex].id, fileName: name, ossAddress: ossAddress})
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
      checkFileDialogRemoveFunc(ossAddress) {
        for (let i = 0; i < this.uploadFileList.length; i++) {
          const item = this.uploadFileList[i]
          if (item.index === this.uploadIndex && item.ossAddress === ossAddress) {
            this.uploadFileList.splice(i, 1)
          }
        }
      },
      beforeUploadFile(file) {
        // 先检验上传文件格式是否正确
        let uploadRightFlag = false
        for (const imgSuffix of this.imgSuffixList) {
          if (file.name.endsWith(imgSuffix)) {
            uploadRightFlag = true
          }
        }
        if (!uploadRightFlag) {
          this.$message.error('上传图片格式不正确')
          this.$refs.upload.clearFiles()
          return false
        }
        const _this = this
        if (file.size / 1024 / 1024 > 20) {
          this.$message.error('图片不能大于20MB')
          this.$refs.upload.clearFiles()
          return false
        }
        const reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload = (e) => {
          // 此为base64编码
          _this.$set(_this.childDialogForm.orderDetailList[_this.uploadIndex], "photoBase64", e.target.result)
        }
        // 阻止默认上传行为
        return false
      },
      changeStatus(index, data) {
        data === 0
          ? this.$set(this.childDialogForm.orderDetailList[index], "solveStatus", 2)
          : this.$set(this.childDialogForm.orderDetailList[index], "solveStatus", 0);
        if (data === 1 || data === 2){
          this.$set(this.childDialogForm.orderDetailList[index], "solveStatus", 0)
        }
        if (data === 0) {
          this.$set(this.childDialogForm.orderDetailList[index], "feedbackContent", null);
        }
      },
      //加载字典
      getDictList(code){
        getDictList(code).then(res => {
          if(code==='info_inspection_plan_type'){
            this.inspectionTypeList = res.data
          }
        })
      },
      getList() {
        getDetailById(this.$route.query.id).then(res => {
          this.childDialogForm = res.data
          this.times = this.childDialogForm.startTime + ' ~ ' + this.childDialogForm.finishTime
          this.childDialogForm.type += ''
          this.childDialogForm.feedbackPerson = this.userDetail.userName
          this.initOrderDetailList()
        })
      },
      initOrderDetailList() {
        if (this.childDialogForm.orderDetailList) {
          this.childDialogForm.orderDetailList = this.childDialogForm.orderDetailList.map((obj) => {
            return { ...obj, solveStatus: 0 } // 设置默认值为 0（未解决）
          })
        }
        this.initRadio()
      },
      initRadio() {
        this.radio = this.childDialogForm.orderDetailList.map(() => ({
          key: 1, // 设置默认值为 1（否）
        }))
      },
      // 提交
      submitEvent() {
        // 检查异常结果的巡视项，是否存在缺陷描述为空的记录
        for (const item of this.childDialogForm.orderDetailList) {
          if (item.solveStatus !== 0 && !item.feedbackContent) {
            this.$message({ type: 'error', message: '缺陷描述不能为空' });
            return false
          }
        }

        this.feedbackForm.id =this.childDialogForm.id
        this.feedbackForm.feedbackPerson =this.childDialogForm.feedbackPerson
        this.feedbackForm.defectFeedbackSummary =this.childDialogForm.defectFeedbackSummary
        for (let i = 0; i < this.childDialogForm.orderDetailList.length; i++) {
          const detail = this.childDialogForm.orderDetailList[i]
          // 从已选择的异常设备中提取该行的数据
          const selectedDeviceTempList = this.selectedDeviceList.filter(d => d.index === i)
          const selectedDeviceIds = selectedDeviceTempList.length > 0 ? selectedDeviceTempList.map(d => d.platformDeviceId).join(',') : ''
          const selectedDeviceNames = selectedDeviceTempList.length > 0 ? selectedDeviceTempList.map(d => d.deviceName).join(',') : ''
          const selectedDeviceNos = selectedDeviceTempList.length > 0 ? selectedDeviceTempList.map(d => d.deviceNo).join(',') : ''
          // 拼接反馈明细对象列表
          const feedbackItem = {
            id: detail.id,
            solveStatus: detail.solveStatus,
            feedbackContent: detail.feedbackContent,
            photoBase64: detail.photoBase64,
            deviceId: selectedDeviceIds,
            deviceName: selectedDeviceNames,
            deviceNo: selectedDeviceNos
          }
          this.feedbackForm.orderDetailList.push(feedbackItem)
        }
        // 赋值附件
        this.feedbackForm.files = this.uploadFileList
        this.$refs.childDialogForm.validate((valid) => {
          if (valid) {
            this.saveLoading = true
            feedbackWorkOrder(this.feedbackForm).then(res => {
              this.saveLoading = false
              if (res.code === 200){
                this.$message({ type: 'success', message: '反馈成功！' })
              }else {
                this.$message({ type: 'error', message: res.msg });
              }
            this.$router.push('/xcnanr/ideal/inspectionOrder/index')
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      },
      returnEvent(){
        this.$router.push('/xcnanr/ideal/inspectionOrder/index')
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep.xt_card_xc{
    padding: 45px 170px 0px 170px;
    background: #FFF;
    border-radius: 5px;
    margin: 5px auto;
    width: 1300px;
    height: 260px;
  }
  ::v-deep.xt_feedback_xc{
    padding: 0px 170px 45px 170px;
    background: #FFF;
    border-radius: 5px;
    margin: 5px auto;
    width: 1300px;
    height: 500px;
  }
  .table_detail{
    background: #FFF;
  }
  ::v-deep.title-head{
    float: left;
    margin: 12px 0 0 60px;
    font-size: 25px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  ::v-deep .el-input.is-disabled .el-input__inner{
    color: #606266;
  }
  /deep/.el-radio {
    color: #606266;
    font-weight: 300;
    cursor: pointer;
    margin-right: 5px;
  }
  /deep/.el-radio__label {
    font-size: 14px;
    padding-left: 3px;
  }
  .el-card {
    border: 1px solid #eee !important;
  }

  /deep/.el-radio input[aria-hidden="true"] {
    display: none !important;
  }

  /deep/.el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
    box-shadow: none !important;
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
