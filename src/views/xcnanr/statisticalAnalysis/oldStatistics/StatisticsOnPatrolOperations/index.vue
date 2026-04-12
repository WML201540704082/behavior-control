<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <div class="echarts-container">
        <div id="pieChart1" class="pieChart"></div>
        <div id="pieChart2" class="pieChart"></div>
      </div>
      <el-form ref="searchForm" :model="searchForm" label-width="50px" class="xt_search_form">
        <el-card shadow="never" style="border: 1px dashed #ccc; padding: 1px; width: 100%; height: 60px">
          <el-row :gutter="20" class="align-center" style="width: 100%; top: -10px">
            <el-col :span="6">
              <el-form-item label="月份" prop="inspectMonth">
                <el-date-picker
                  v-model="searchForm.inspectMonth"
                  value-format="yyyy-MM"
                  type="month"
                  placeholder="请输入月份"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司" prop="companyId">
                <xt-tree-lzay-select placeholder="请选择公司" :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getOwnerUnit(v,'CORP')">
                </xt-tree-lzay-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" align="right" style="margin-top: 5px">
              <el-button type="primary" @click="handleQuery" style="margin-right: 5px;">查询</el-button>
              <el-button type="primary" plain @click="handleReset">重置</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </div>
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange"  @row-click="showRow">
        <el-table-column label="月份" prop="inspectMonth" width="200" align="center" show-overflow-tooltip fixed/>
        <el-table-column label="公司" prop="companyName" align="center" show-overflow-tooltip>
        </el-table-column>
          <el-table-column label="巡视次数" align="center">
            <el-table-column label="总数" prop="inspectionTotal" width="160" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="机房" prop="roomCount" width="160" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="设备" prop="deviceCount" width="160" align="center" show-overflow-tooltip/>
          </el-table-column>
          <el-table-column label="反馈统计" align="center">
            <el-table-column label="总数" prop="feedbackTotal" width="160" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="正常" prop="normalCount" width="160" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="缺陷" prop="detectCount" width="160" align="center" show-overflow-tooltip/>
          </el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" width="130" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
              <div>
                <el-link type="primary" size="mini" :underline="false" @click="handleSee(scope.row)" icon="el-icon-s-fold">
                  <span class="s_lt">详 情</span>
                </el-link>
              </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"/>
    </div>
  </basic-container>
</template>

<script>
  import {mapGetters} from 'vuex'
  import xtTreeLzaySelect from '@/components/xtTreeLzaySelect'
  import {getInspectionByPage } from '@/api/xcnanr/statisticalAnalysis'
  import * as echarts from 'echarts'
  import PieChart from './PieChart'


  export default {
    components: {
      xtTreeLzaySelect, PieChart
    },
    computed: {
      ...mapGetters(["permission", 'userDetail'])
    },
    data() {
      return {
        chartData1: [],chartData2:[],
        selectionList: [],
        searchForm: {
          current: 1,
          size: 10,
          inspectMonth: null,
          companyId: null,
          companyName: null
        },
        total: 0,
        tableData: [],
        tableHeight: undefined,
        tableLoading: false,
        // 人员类型
        personTypeList: [],
        colors: ['#5087ec', '#68bbc4','#EFB56D'],
        title1: '', title2: ''
      }
    },
    mounted() {
      this.setPageContentHeight();
      this.setTableHeight();
      this.$nextTick()
      this.getList();
    },
    methods: {
      showRow(row) {
        // 设置当前行为选中行
        this.changeTitle(row)
        this.updateChart(row)
        this.$forceUpdate()
      },
      updateChart(data) {
        const chartData1 = [
          { name: '机房次数', value: data.roomCount },
          { name: '设备次数', value: data.deviceCount },
        ];

        const chartData2 = [
          { name: '正常', value: data.normalCount },
          { name: '缺陷', value: data.detectCount },
        ];

        // 构建新的图表标题
        const chartTitle1 = `${this.changeMonth(data.inspectMonth)}巡视次数统计`;
        const chartTitle2 = `${this.changeMonth(data.inspectMonth)}缺陷次数统计`;
        this.initPieChart('pieChart1', chartData1,chartTitle1);
        this.initPieChart('pieChart2', chartData2,chartTitle2);

      },
      changeTitle(data){
        const month = this.changeMonth(data.inspectMonth)
        this.title1 = month + '巡视次数统计'
        this.title2 = month + '缺陷次数统计'
      },
      changeMonth(month){
        const monthArr = month.split('-')
        return monthArr[0] + '年' + parseInt(monthArr[1]) + '月'
      },
      initPieChart(id, data,title) {
        const chartDom = document.getElementById(id);
        const myChart = echarts.init(chartDom);
        const option = {
          color: this.colors,
          title: {
            text: title,
            left: 'center',
            textStyle: {
              fontSize: 14 // 调整标题的字体大小
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              // params 包含了当前项的数据信息
              const colorCircle = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${params.color};vertical-align:middle;"></span>`;
              return `${colorCircle}${params.name}: ${params.value}`;
            }
          },
          legend: {
            orient: 'horizontal',
            left: 'center',
            top: '20px', // 调整图例的位置，使其位于标题下方
            textStyle: {
              fontSize: 12 // 调整图例的字体大小
            }
          },
          series: [
            {
              type: 'pie',
              radius: '50%', // 调整饼图的大小
              center: ['50%', '50%'], // 调整饼图的位置，使其位于图表的中心偏下
              data: data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        myChart.setOption(option);
      },
      refreshData(){
        this.getList()
      },
      getOwnerUnit(val, type) {
        if (type === 'CORP') {
          //单位
          this.searchForm.companyId = val.id
          this.searchForm.companyName = val.fullName
        }
        this.$forceUpdate()
      },
      selectionChange(selection) {
        //点击选择事件
        this.selectionList = selection.map(item => item.id);
      },
      handleQuery() {
        this.searchForm.current = 1;
        this.getList();
      },
      handleReset() {
        this.searchForm.inspectMonth = undefined;
        this.searchForm.companyId = undefined;
        this.searchForm.companyName = undefined;
        this.getList();
      },
      // 设置表格高度
      setTableHeight() {
        let bodyBox = document.getElementsByClassName('page_body');
        this.tableHeight = (bodyBox[0].offsetHeight - 100) + 'px'
      },
      getList() {
        this.tableLoading = true;
        getInspectionByPage(this.searchForm).then(res => {
         this.tableData = res.data.records;
          this.total = res.data.total;
          this.tableLoading = false
         // if (this.tableData.length === 0){
         //    const statics = {
         //      "id": "5a661552478f4bd88f558b337d34e8b1",//统计项主键id
         //      "companyId": "1745022609004736513",
         //      "companyName": "国网山东省电力公司",//公司
         //      "companyRegionCode": "37",
         //      "startDate": "2024-12-01",
         //      "finishDate": "2024-12-31",
         //      "inspectMonth": "2024-12",//月份
         //      "inspectionTotal": 3,//巡视总数
         //      "roomCount": 3,//机房总数
         //      "deviceCount": 0,//设备总数
         //      "feedbackTotal": 9,//反馈总数
         //      "normalCount": 8,//正常总数
         //      "detectCount": 1,//异常总数
         //    }
         //    const statics1 = {
         //      "id": "5a661552478f4bd88f558b337d34e8b1",//统计项主键id
         //      "companyId": "1745022609004736513",
         //      "companyName": "国网山东省电力公司",//公司
         //      "companyRegionCode": "37",
         //      "startDate": "2024-10-01",
         //      "finishDate": "2024-10-31",
         //      "inspectMonth": "2024-10",//月份
         //      "inspectionTotal": 10,//巡视总数
         //      "roomCount": 6,//机房总数
         //      "deviceCount": 4,//设备总数
         //      "feedbackTotal": 7,//反馈总数
         //      "normalCount": 4,//正常总数
         //      "detectCount": 3,//异常总数
         //    }
          //}
          if (this.tableData.length > 0){
            // 根据行数据构建新的图表数据
            const chartData1 = [
              { name: '机房次数', value: this.tableData[0].roomCount },
              { name: '设备次数', value: this.tableData[0].deviceCount },
            ];

            const chartData2 = [
              { name: '正常', value: this.tableData[0].normalCount },
              { name: '缺陷', value: this.tableData[0].detectCount },
            ];

            // 构建新的图表标题
            const chartTitle1 = `${this.changeMonth(this.tableData[0].inspectMonth)}巡视次数统计`;
            const chartTitle2 = `${this.changeMonth(this.tableData[0].inspectMonth)}缺陷次数统计`;
            this.initPieChart('pieChart1', chartData1,chartTitle1);
            this.initPieChart('pieChart2', chartData2,chartTitle2);
          }
        }).catch(() => {
          this.tableLoading = false
        })
      },
      fillChartData(data){
        this.chartData1 = []
        this.chartData2 = []
        const roomData = {
          value: data.roomCount,
          name: '机房巡视',
        }
        const deviceData = {
          value: data.deviceCount,
          name: '设备巡视'
        }
        const normalData = {
          value: data.normalCount,
          name: '正常巡视',
        }
        const detectData = {
          value: data.detectCount,
          name: '异常巡视'
        }
        this.chartData1.push(roomData,deviceData)
        this.chartData2.push(normalData,detectData)
      },
      handleSee(row) {
        this.$router.push({
          path: '/xcnanr/infoInspectionStaticsDetail/',
          query: {
            id: row.id,
            month: row.inspectMonth,
            companyId: row.companyId,
            companyName: row.companyName
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-link {
    font-size: 13px;
  }

  .s_lt {
    font-size: 12px;
  }
  .echarts-container {
    display: flex;
    justify-content: space-between;
  }

  .pieChart {
    width: 48%;
    height: 255px;
  }
  .complish_bg {
    width: 28px;
    height: 28px;
  }

  ::v-deep .el-step__head.is-process {
    .el-step__line {
      border: 0.5px dashed #C0C4CC;
      background-color: transparent;
      height: 0.1px;
    }

    .is-text {
      background: #ffffff;
      border-color: #409EFF;
      color: #409EFF;
    }
  }

  ::v-deep .el-step__head.is-success {
    .is-text {
      background: #409EFF;
      border-color: #409EFF;
      color: white;
    }

    .el-step__line {
      border: 0.5px dashed #409EFF;
      background-color: transparent;
      height: 0.1px;
    }

    .el-step__line-inner {
      border-width: 0 !important;
      width: 0 !important;
    }
  }

  /deep/ .el-step.is-horizontal .el-step__line {
    border: 0.5px dashed #409EFF;
    background-color: transparent;
    height: 0.1px;
  }

  /deep/ .el-step__title.is-process {
    color: #409EFF;
  }

  .title_con {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .formLabel {
    line-height: 20px;
  }

  ::v-deep .page_form {
    .el-form-item {
      margin-bottom: 0;
    }

    .el-col {
      margin-bottom: 0;
    }

    .el-date-editor {
      width: 100%;
    }
  }

  .page_body {
    position: relative;
    // padding-bottom: 200px;
  }
  .s_empty{
    padding: 12px;
    font-size: 14px;
    color: #a1a1a1;
  }
</style>
