<template>
  <basic-container style="padding-bottom: 60px">
    <breadcrumb path="/xcnanr/ideal/inspectionPlan/index" master-title="巡视计划" child-title="审批"></breadcrumb>
    <div class="text item">
      <el-row>
        <el-steps :active="2" align-center>
          <el-step title="提交完成">
            <template slot="description">
              <div>{{childDialogForm.createUserName}}</div>
              <div>{{childDialogForm.createTime}}</div>
            </template>
          </el-step>
          <el-step title="待审批">
            <template slot="description">
              <div>{{approvePeople}}</div>
            </template>
          </el-step>
          <el-step title="审批结束" description=""></el-step>
        </el-steps>
      </el-row>
    </div>
    <!-- 分割线 -->
    <el-divider></el-divider>

    <el-form class="xt_form" ref="childDialogForm" :model="childDialogForm" :rules="rules" size="small" label-suffix=":" label-width="130px" v-loading="pageLoading" style="width: 1300px;margin: 0 auto;">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form-item label="计划编号" style="font-weight: bolder">
              <span style="font-weight: bolder">{{childDialogForm.no}}</span>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="公司" prop="companyName">
              <el-input  v-model="childDialogForm.companyName" disabled style="width: 390px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="部门" prop="departmentName">
              <el-input  v-model="childDialogForm.departmentName" disabled style="width: 390px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视类型" prop="type">
              <el-select v-model="childDialogForm.type" clearable placeholder="请选择巡视类型" disabled style="width: 390px">
                <el-option v-for="item in inspectionTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="预置巡视人" prop="persons">
              <el-select v-model="childDialogForm.persons" multiple filterable collapse-tags clearable disabled placeholder="请选择巡视人" style="width: 390px">
                <el-option v-for="item in authorizedPersonList" :key="item.name" :label="item.name + ' / ' + item.companyName" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视类别" prop="category">
              <el-select v-model="childDialogForm.category" clearable placeholder="请选择巡视类别" disabled style="width: 390px">
                <el-option v-for="dict in inspectionCategoryList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="周期配置" prop="period">
              <el-select v-model="childDialogForm.period" :multiple="childDialogForm.category !== '1'?true:false" clearable placeholder="请选择巡视周期" style="width: 390px" disabled>
                <el-option v-for="item in (childDialogForm.category === '1'?categoryDayList:(childDialogForm.category === '2'? categoryWeekendList:categoryMonthList))" :key="item.value" :label="item.key" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form-item label="巡视时间段" prop="times">
              <el-row v-if="childDialogForm.period === '2'">
                <el-col :span="8">
                  <el-time-picker v-model="childDialogForm.times"
                                  is-range
                                  range-separator="至"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 390px"
                                  disabled
                  />
                </el-col>
                <el-col :span="8">
                  <el-time-picker v-model="childDialogForm.time2"
                                  is-range
                                  range-separator="至"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 390px"
                                  disabled
                  />
                </el-col>
              </el-row>
              <el-row v-else-if="childDialogForm.period === '4'">
                <el-col :span="5">
                  <el-time-picker v-model="childDialogForm.times"
                                  is-range
                                  range-separator="至"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 250px"
                                  disabled
                  />
                </el-col>
                <el-col :span="5" style="margin-left: 15px">
                  <el-time-picker v-model="childDialogForm.time2"
                                  is-range
                                  range-separator="至"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 250px"
                                  disabled
                  />
                </el-col>
                <el-col :span="5" style="margin-left: 15px">
                  <el-time-picker v-model="childDialogForm.time3"
                                  is-range
                                  range-separator="至"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 250px"
                                  disabled
                  />
                </el-col>
                <el-col :span="5" style="margin-left: 15px">
                  <el-time-picker v-model="childDialogForm.time4"
                                  is-range
                                  range-separator="至"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 250px"
                                  disabled
                  />
                </el-col>
              </el-row>
              <el-row v-else>
                <el-col>
                  <el-time-picker v-model="childDialogForm.times"
                                  is-range
                                  range-separator="至"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 390px"
                                  disabled
                  />
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24" class="input-textarea-m" style="display: contents">
          <div class="grid-contents bg-purple">
            <el-form-item label="巡视内容" prop="content">
              <el-input  v-model="childDialogForm.content" clearable placeholder="请输入巡视内容" type="textarea" :rows="3" disabled style="width: 1040px;" />
            </el-form-item>
          </div>
        </el-col>
        <el-form-item v-if="childDialogForm.type === '1'" label="巡视场所" style="margin-top: 16px">
          <el-table ref="authTable" :key="Math.random()" :data="childDialogForm.planDetailList" max-height="400px" :row-class-name="tableRowClassName" stripe style="width: 1040px;">
            <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
            <el-table-column prop="objectName" align="center" :show-overflow-tooltip="true" label="所属机房" />
            <el-table-column prop="configName" align="center" :show-overflow-tooltip="true" label="关联配置项" />
            <el-table-column label="配置项" align="center">
              <el-table-column prop="configDetailName" align="center" :show-overflow-tooltip="true" label="巡视项" />
              <el-table-column prop="configDetailDescription" align="center" :show-overflow-tooltip="true" label="描述" />
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-else label="巡视对象" style="margin-top: 16px">
          <el-table ref="authTable" :data="childDialogForm.planDetailList" max-height="400px" :row-class-name="tableRowClassName" style="width: 1040px;" stripe>
            <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
            <el-table-column prop="objectName" align="center" :show-overflow-tooltip="true" label="设备名称" />
            <el-table-column prop="extAttr2" align="center" :show-overflow-tooltip="true" label="IP" width="120px" />
            <el-table-column prop="configName" align="center" :show-overflow-tooltip="true" label="关联配置项"></el-table-column>
            <el-table-column label="配置项" align="center">
              <el-table-column prop="configDetailName" align="center" :show-overflow-tooltip="true" label="名称" />
              <el-table-column prop="configDetailDescription" align="center" :show-overflow-tooltip="true" label="描述" />
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-row>
    </el-form>

    <!-- 分割线 -->
    <el-divider></el-divider>

    <el-form class="xt_form" ref="dataForm" :model="dataForm" :rules="rules" size="small" label-suffix=":" label-width="130px" v-loading="pageLoading" style="width: 1300px;margin: 0px auto;">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="审批人" prop="extAttr1">
              <el-input  v-model="dataForm.extAttr1" placeholder="请输入审批人" readonly style="width: 390px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="审批结果" prop="recordStatus">
              <el-radio-group v-model="dataForm.recordStatus">
                <el-radio @change="fillResult()" label="已审批">同意</el-radio>
                <el-radio @change="fillResult()" label="驳回">不同意</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24" class="input-textarea-m" style="height: 100%;">
          <div class="grid-contents bg-purple">
            <el-form-item label="审批意见" prop="result">
              <el-input v-model="dataForm.result" clearable placeholder="请输入审批意见" type="textarea" :rows="2" :maxlength="100" show-word-limit style="width: 1040px;" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin: 10px auto;width: 300px;">
      <el-button type="primary" size="small" @click="submitEvent" :loading="saveLoading">提 交</el-button>
      <el-button type="primary" plain size="small" @click="returnEvent" :loading="saveLoading">返 回</el-button>
    </div>
  </basic-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getDetailById, approvalInspection } from '@/api/xcnanr/inspectionPlan'
  import { getDictList } from '@/api/dict'
  import { getAll } from "@/api/xcnanr/authorizedPerson"
  import {getAllRoom} from "@/api/xcnanr/room"
  import Breadcrumb from '../../components/Breadcrumb'

  export default {
    props: {
      childDialogFlag: {
        type: Boolean,
        default: false
      },
      dialogType: {
        type: String,
        default: ''
      }
    },
    components: { getDictList, Breadcrumb },
    data() {
      return {
        recordList:[],
        roomTreeDatas:[],
        deviceDatas:[],
        inspectionDatas:[],
        inspectionRoomDatas:[],
        inspectionDeviceDatas:[],
        inspectionTypeList:[],
        categoryDayList:[{
          key: '一天一次',
          value: '1'
        },{
          key: '一天两次',
          value: '2'
        },{
          key: '一天四次',
          value: '4'
        }],
        categoryWeekendList:[{
          key: '周一',
          value: '1'
        },{
          key: '周二',
          value: '2'
        },{
          key: '周三',
          value: '3'
        },{
          key: '周四',
          value: '4'
        },{
          key: '周五',
          value: '5'
        },{
          key: '周六',
          value: '6'
        },{
          key: '周日',
          value: '7'
        }],
        approvalTypeList:[{
          key: '不同意',
          value: '驳回'
        },{
          key: '同意',
          value: '已审批'
        }],
        categoryMonthList:[],
        inspectionCategoryList:[],
        authorizedPersonList:[],
        authTime: [],
        childDialogForm: {
          type: '',
          category: '',
          period: []
        },
        dataForm:{
          no: '',
          extAttr1: '',
          recordStatus: '已审批',
          result: '同意',
        },
        planDetailList: [],
        pageLoading: false,
        saveLoading: false,
        tableHeight: undefined,
        tableLoading: false,
        approvePeople: '',
        rules: {
          extAttr1: [
            { required: true, message: '审批人不能为空', trigger: 'blur' }
          ],
          recordStatus: [
            { required: true, message: '审批结果不能为空', trigger: 'blur' }
          ],
          result: [
            { required: true, message: '审批意见不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters(['userDetail']),
    },
    mounted() {
      this.getDictList('info_inspection_plan_type')
      this.getDictList('info_inspection_plan_category')
      this.getAuthorizedPerson()
      this.getAllRoom()
      this.getList()
      this.createTimeDict()
    },
    methods: {
      fillResult(){
        this.dataForm.result=(this.dataForm.recordStatus === '驳回'? '不同意':'同意')
      },
      createTimeDict(){
        for (let i =1;i<=31;i++){
          const key = i + '日'
          const value = i + ''
          const timeObj = {
            key: key,
            value: value
          }
          this.categoryMonthList.push(timeObj)
        }
      },
      // 转换时间
      createPeriodData(){
        if (this.childDialogForm.category === '1'){
          return this.childDialogForm.period
        }
        let zeros = ''
        if (this.childDialogForm.category === '2'){
          zeros = new Array(8).join('0');
        }else if (this.childDialogForm.category === '3') {
          zeros = new Array(32).join('0');
        }
        for (const timeString of this.childDialogForm.period) {
          let i = parseInt(timeString)
          zeros = zeros.slice(0,i-1)+ '1' + zeros.slice(i)
        }
        return zeros
      },
      getAllRoom(){
        getAllRoom().then(res=>{
          this.roomTreeDatas = res.data
        })
      },
      // 设置表格高度
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 55 - 48 - 47 + 'px'
      },
      //加载字典
      getDictList(code){
        getDictList(code).then(res => {
          if(code==='info_inspection_plan_type'){
            this.inspectionTypeList = res.data
          }else if (code==='info_inspection_plan_category'){
            this.inspectionCategoryList = res.data
          }
        })
      },
      conversionDict(code, dictList) {
        //字典回显
        if (dictList != null && code !== '') {
          let items = dictList.filter(item => item.dictKey == code)
          if (items != null && items.length > 0) {
            return items[0].dictValue
          }
        }
        return code
      },
      getList(){
        this.approvePeople = this.userDetail.userName
        getDetailById(this.$route.query.id).then(res=>{
          this.childDialogForm = res.data
          this.childDialogForm.type += ''
          this.childDialogForm.category += ''
          this.childDialogForm.persons = []
          for (const person of this.childDialogForm.relatedWorkerList){
            this.childDialogForm.persons.push(person.workerId)
          }
          // 时间回显
          if (this.childDialogForm.category === '1' && parseInt(this.childDialogForm.period) > 1){
            const times = this.childDialogForm.times.split(',')
            for (let i =0; i<=times.length-1;i++){
              if (i === 0){
                const timeArr = times[i].split('-')
                this.childDialogForm.times = [timeArr[0],timeArr[1]]
              } else {
                const timeArr = times[i].split('-')
                this.childDialogForm['time' + (i + 1)] = [timeArr[0], timeArr[1]]
              }
            }
          }else {
            const timeArr = this.childDialogForm.times.split('-')
            this.childDialogForm.times = [timeArr[0],timeArr[1]]
          }
          if (this.childDialogForm.period.length > 1){
            this.childDialogForm.period = this.translatePeriod(this.childDialogForm.period)
          }
          this.recordList = this.childDialogForm.recordList
          this.dataForm.extAttr1 = this.userDetail.userName
        })
      },
      // 转换周期
      translatePeriod(data){
        const indexes = [];
        const charToFind = '1'
        for (let i = data.indexOf(charToFind); i !== -1; i = data.indexOf(charToFind, i + 1)) {
          indexes.push(i+1+'');
        }
        return indexes
      },
      getAuthorizedPerson(){
        getAll({enabled: 1}).then(res=>{
          this.authorizedPersonList = res.data
        })
      },
      submitEvent(){
        this.dataForm.no = this.childDialogForm.id
        approvalInspection(this.dataForm).then(res=>{
          if (res.code === 200){
            this.$message({
              type: 'success',
              message: '审批完成！'
            });
          }else {
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
          this.returnEvent()
        })
      },
      returnEvent(){
        this.$router.push('/xcnanr/ideal/inspectionPlan/index')
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-input.is-disabled .el-input__inner{
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
