<template>
  <basic-container style="padding-bottom: 60px">
    <breadcrumb path="/xcnanr/ideal/inspectionPlan/index" master-title="巡视计划" child-title="详情"></breadcrumb>
    <el-form class="xt_form" ref="childDialogForm" :model="childDialogForm" size="small" label-suffix=":" label-width="130px" v-loading="pageLoading" style="width: 1300px;margin: 0 auto;">
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
              <el-input v-model="childDialogForm.companyName" disabled style="width: 390px" />
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
            <el-form-item label="预置巡视人">
              <el-tooltip class="item" effect="dark" :content="personNames" placement="top">
                <el-input v-model="personNames" disabled style="width: 390px" />
              </el-tooltip>
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
                                  start-placeholder="开始时间"
                                  end-placeholder="结束时间"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 380px"
                                  disabled
                                  clearable
                  />
                </el-col>
                <el-col :span="8">
                  <el-time-picker v-model="childDialogForm.time2"
                                  is-range
                                  range-separator="至"
                                  start-placeholder="开始时间"
                                  end-placeholder="结束时间"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 380px"
                                  disabled
                                  clearable
                  />
                </el-col>
              </el-row>
              <el-row v-else-if="childDialogForm.period === '3'">
                <el-col :span="7">
                  <el-time-picker v-model="childDialogForm.times"
                                  is-range
                                  range-separator="至"
                                  start-placeholder="开始时间"
                                  end-placeholder="结束时间"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 320px"
                                  disabled
                                  clearable
                  />
                </el-col>
                <el-col :span="7" style="margin-left: 15px">
                  <el-time-picker v-model="childDialogForm.time2"
                                  is-range
                                  range-separator="至"
                                  start-placeholder="开始时间"
                                  end-placeholder="结束时间"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 320px"
                                  disabled
                                  clearable
                  />
                </el-col>
                <el-col :span="7" style="margin-left: 15px">
                  <el-time-picker v-model="childDialogForm.time3"
                                  is-range
                                  range-separator="至"
                                  start-placeholder="开始时间"
                                  end-placeholder="结束时间"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 320px"
                                  disabled
                                  clearable
                  />
                </el-col>
              </el-row>
              <el-row v-else-if="childDialogForm.period === '4'">
                <el-col :span="5">
                  <el-time-picker v-model="childDialogForm.times"
                                  is-range
                                  range-separator="至"
                                  start-placeholder="开始时间"
                                  end-placeholder="结束时间"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 250px"
                                  disabled
                                  clearable
                  />
                </el-col>
                <el-col :span="5" style="margin-left: 15px">
                  <el-time-picker v-model="childDialogForm.time2"
                                  is-range
                                  range-separator="至"
                                  start-placeholder="开始时间"
                                  end-placeholder="结束时间"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 250px"
                                  disabled
                                  clearable
                  />
                </el-col>
                <el-col :span="5" style="margin-left: 15px">
                  <el-time-picker v-model="childDialogForm.time3"
                                  is-range
                                  range-separator="至"
                                  start-placeholder="开始时间"
                                  end-placeholder="结束时间"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 250px"
                                  disabled
                                  clearable
                  />
                </el-col>
                <el-col :span="5" style="margin-left: 15px">
                  <el-time-picker v-model="childDialogForm.time4"
                                  is-range
                                  range-separator="至"
                                  start-placeholder="开始时间"
                                  end-placeholder="结束时间"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 250px"
                                  disabled
                                  clearable
                  />
                </el-col>
              </el-row>
              <el-row v-else>
                <el-col>
                  <el-time-picker v-model="childDialogForm.times"
                                  is-range
                                  range-separator="至"
                                  start-placeholder="开始时间"
                                  end-placeholder="结束时间"
                                  value-format="HH:mm:ss"
                                  align="right"
                                  style="width: 390px"
                                  disabled
                                  clearable
                  />
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24" style="height: 100%">
          <el-form-item label="巡视内容">
            <el-input style="width: 1040px" type="textarea" :rows="3" v-model="childDialogForm.content" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-form-item v-if="childDialogForm.type === '1'" label="巡视场所" style="margin-top: 16px">
          <el-table ref="authTable" :key="Math.random()" :data="childDialogForm.planDetailList" style="width: 1040px" max-height="400px" stripe :row-class-name="tableRowClassName">
            <el-table-column prop="objectName" align="center" :show-overflow-tooltip="true" label="所属机房" />
            <el-table-column prop="configName" align="center" :show-overflow-tooltip="true" label="关联配置项" />
            <el-table-column label="配置项" align="center">
              <el-table-column prop="configDetailName" align="center" :show-overflow-tooltip="true" label="巡视项" />
              <el-table-column prop="configDetailDescription" align="center" :show-overflow-tooltip="true" label="描述" />
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-else label="巡视对象" style="margin-top: 16px">
          <el-table ref="authTable" :data="childDialogForm.planDetailList" style="width: 1040px" max-height="400px" :row-class-name="tableRowClassName" stripe>
            <el-table-column type="index" width="50" />
            <el-table-column prop="objectName" align="center" :show-overflow-tooltip="true" label="设备名称" />
            <el-table-column prop="extAttr2" align="center" :show-overflow-tooltip="true" label="IP" />
            <el-table-column prop="configName" align="center" :show-overflow-tooltip="true" label="关联配置项"></el-table-column>
            <el-table-column label="配置项" align="center">
              <el-table-column prop="configDetailName" align="center" :show-overflow-tooltip="true" label="名称" />
              <el-table-column prop="configDetailDescription" align="center" :show-overflow-tooltip="true" label="描述" />
            </el-table-column>
          </el-table>
        </el-form-item>

        <!-- 分割线 -->
        <el-divider></el-divider>

        <el-form-item label="状态跟踪">
          <el-table ref="tableData" :data="childDialogForm.recordList" max-height="400px" v-loading="tableLoading" style="width: 1040px" stripe>
            <el-table-column prop="createTime" align="center" :show-overflow-tooltip="true" label="日期" />
            <el-table-column prop="extAttr1" align="center" :show-overflow-tooltip="true" label="执行人" />
            <el-table-column prop="content" align="center" :show-overflow-tooltip="true" label="操作内容" />
          </el-table>
        </el-form-item>
      </el-row>
    </el-form>
    <div style="width:100px;margin: 10px auto;">
      <el-button type="primary" plain size="small" @click="returnEvent">返 回</el-button>
    </div>
  </basic-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getDetailById } from '@/api/xcnanr/inspectionPlan'
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
        planCode: '',
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
          key: '一天三次',
          value: '3'
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
        categoryMonthList:[],
        inspectionCategoryList:[],
        authorizedPersonList:[],
        operatorType:null,
        authTime: [],
        childDialogForm: {
          type: '',
          category: '',
          period: []
        },
        planDetailList: [],
        pageLoading: false,
        saveLoading: false,
        tableHeight: undefined,
        tableLoading: false,
        personNames: null
      }
    },
    computed: {
      ...mapGetters(['userDetail']),
      getChildTitle () {
        if (this.operatorType === 'detail'){
          return '详情'
        }
      }
    },
    mounted() {
      this.getDictList('info_inspection_plan_type')
      this.getDictList('info_inspection_plan_category')
      this.getAuthorizedPerson()
      this.getAllRoom()
      this.operatorType = this.$route.query.type
      this.getList()
      this.createTimeDict()
    },
    methods: {
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
      removeInspectionDetails(index){
        this.childDialogForm.planDetailList.splice(index,1)
      },
      changeInspectionType(){
        this.childDialogForm.rooms = null
        this.childDialogForm.devices = null
        this.childDialogForm.roomOrDeviceConfig = null
        this.childDialogForm.planDetailList = []
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
        if (this.operatorType === 'detail') {
          getDetailById(this.$route.query.id).then(res=>{
            console.log(res,'res')
            this.childDialogForm = res.data
            this.planCode = res.data.no
            this.childDialogForm.type += ''
            this.childDialogForm.category += ''
            this.personNames = this.childDialogForm.relatedWorkerList.map(w => w.workerName).join('，')
            // 时间回显
            if (this.childDialogForm.category === '1' && parseInt(this.childDialogForm.period) > 1){
              const times = this.childDialogForm.times.split(',')
              for (let i = 0; i < times.length; i++){
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
          })
        }
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
      returnEvent(){
        this.$router.push('/xcnanr/ideal/inspectionPlan/index')
      },
      formatTime(date) {
        if (date) {
          return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        }
        return '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep(.xt_card_xc){
    padding: 10px 170px 15px 170px;
    background: #FFF;
    border-radius: 5px;
    margin: 5px auto;
    width: 1300px;
  }
  .table_detail{
    background: #FFF;
  }
  ::v-deep(.title-head){
    float: left;
    font-size: 25px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  ::v-deep(.el-input.is-disabled .el-input__inner){
    color: #606266;
  }
  ::v-deep(.input-textarea-m){
    margin-bottom: 74px !important;
  }
  .el-card {
    border: 1px solid #eee !important;
  }

  ::v-deep .el-textarea__inner {
    resize: none !important;
  }
</style>
