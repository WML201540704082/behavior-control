<template>
  <basic-container>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="12">
        <!-- 报告内容 -->
        <el-row>
          <el-col :span="24" class="text-title">{{ paramsInfo.companyName}}{{paramsInfo.objectName}}</el-col>
          <el-col :span="24" class="text-title">巡视报告</el-col>
        </el-row>
        <p class="text-content">
          {{reportData.startDate}}至{{reportData.finishDate}}，{{paramsInfo.companyName}}{{paramsInfo.deptName}}共执行巡视{{paramsInfo.type == 1? '机房' : '设备'}}{{reportData.inspectCount}}次，
          涉及{{reportData.planCount}}个巡视计划、{{reportData.personNum}}个巡视人员，巡视过程中发现异常{{reportData.abnormalNum}}处，
          其中已解决{{reportData.solvedNum}}处，待解决{{reportData.unsolvedNum}}处。
        </p>
        <p class="text-content">{{paramsInfo.objectName}}巡视计划如下：</p>
        <el-row>
          <el-table ref="planTable" :data="reportData.planList" size="small">
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column label="计划编号" prop="no" min-width="150" align="center"/>
            <el-table-column label="计划类别" prop="period" min-width="150" align="center" />
            <el-table-column label="巡视时间段" prop="times" min-width="150" align="center" />
            <el-table-column label="巡视人" prop="workerName" min-width="150" align="center" />
          </el-table>
        </el-row>

        <p class="text-content">发现异常明细如下：</p>
        <el-row>
          <el-table ref="planTable" :data="reportData.abnormalList" size="small">
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column label="工单编号" prop="code" min-width="150" align="center" />
            <el-table-column label="巡视人" prop="feedbackPerson" min-width="100" align="center" />
            <el-table-column label="巡视项" prop="configDetailName" min-width="150" align="center" />
            <el-table-column label="缺陷内容" prop="feedbackContent" min-width="200" align="center" />
          </el-table>
        </el-row>

        <p class="text-content">巡视人工单统计</p>
        <el-row style="border:1px solid #d5d6d7;">
          <OrderBar ref="orderBar" :width="'100%'" :height="'300px'" :module-data="reportData.personChartData"/>
        </el-row>
        <el-row style="border:1px solid #d5d6d7;margin-top:10px;margin-bottom: 80px;">
          <RoomPie ref="roomPie" :width="'100%'" :height="'300px'" :module-data="reportData.planOrderChartData"/>
        </el-row>

      </el-col>
    </el-row>
    <el-button type="primary" class="dowonload-btn" size="large" @click="handleDownload">下载报告</el-button>
  </basic-container>
</template>

<script>
import OrderBar from './orderBar.vue'
import RoomPie from './roomPie.vue'
import { getReportData,createReportFile,exportReportFile, downloadFile} from '@/api/xcnanr/report'

export default {
  name: 'Report',
  components:{OrderBar, RoomPie},
  data() {
    return {
      paramsInfo: {
        inspectionMonth: "2024-12",//巡视月份
        companyId: 1,//公司ID
        companyName: "XX公司",  //公司名称
        deptName: 'XX信息运检班',//部门名称
        objectId: 1,//对象ID
        objectName: "XX机房",//机房名称
        type: 1//类型 1机房 2设备
      },
      reportData: {
        startDate: "2024年12月1日", //开始时间
        finishDate: "2024年12月31日",//结束时间
        inspectCount: 3,//巡视总数
        planCount: 2,//涉及巡视计划总数
        personNum: 2,//涉及巡视人员数量
        abnormalNum: 3,//异常总数
        solvedNum: 2,//已解决异常数量
        unsolvedNum: 1,//未解决异常数量
        planList: [//巡视计划列表
          {
            no: "XSJH20241216000001",//计划编号
            period: "周计划巡视",//计划类别
            times: "15:00:00-16:00:00\n17:00:00-18:00:00",//巡视时间段
            index: 1,
            workerName: "刘丽娟、张三"//巡视人
          },
          {
            no: "XSJH20241216000002",
            period: "月计划巡视",
            times: "09:00:00-11:30:00",
            index: 2,
            workerName: "刘丽娟"
          }
        ],
        abnormalList: [//异常明细列表
          {code: "XSGD20241216000001",feedbackContent: "发现缺陷1处",feedbackPerson: "刘丽娟",configDetailName: "电脑巡视",index: 1}
        ],
        personChartData: [//巡视人工单统计
          {personName: "李飞",orderNum: 1 },
          {personName: "刘丽娟",orderNum: 1},
          {personName: "张三",orderNum: 1}
        ],
        planOrderChartData: [//机房巡视工单饼图数据
          { name: "计划工单",value: 3},
          { name: "临时工单",value: 0}
        ]
      }
    }
  },
  created(){
    this.paramsInfo = this.$route.query
    this.getViewData()
  },
  methods: {
    handleDownload() {
      const _this = this
      //下载报告
      _this.$message.success('开始下载报告,请稍等...')
      createReportFile(_this.paramsInfo).then(res => {
        if(res.success && res.data) {
          _this.$message.success('报告创建成功,正在下载...')
          _this.exportFile(res.data)
        }else {
          _this.$message.error('报告创建失败')
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('下载报告失败')
      })
    },
    exportFile(fileName) {
      const paramsInfo = this.paramsInfo
      const reportData = this.reportData
      const newFileName = paramsInfo.companyName + paramsInfo.objectName + '巡视报告('+reportData.startDate+'至'+reportData.finishDate+')'
      exportReportFile(fileName).then(res => {
        downloadFile(res,newFileName,'docx')
      }).catch(err => {
        console.log(err)
        this.$message.error('报告导出失败')
      })
    },
    getViewData() {
      const _this = this
      _this.reportData = {}
      getReportData(this.paramsInfo).then(res => {
        if(res.success){
          _this.reportData = res.data
        }else {
          _this.$message.warning(res.msg)
        }
      }).catch(err => {
        console.log(err)
        _this.$message.error('获取报告数据失败')
      })
    }
  }
}
</script>

<style scoped>
.text-title{
  font-size: 22px;
  font-weight: bold;
  text-align: center;
}
.text-content{
  //font-size: 16px;
  //text-align: center;
  text-indent: 2em;
  margin-top: 30px;
}
.dowonload-btn{
  position: fixed;
  top: 150px;
  right: 40px;
}
</style>
