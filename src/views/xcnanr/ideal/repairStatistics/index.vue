<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
      <div class="echarts-container">
        <div id="pieChart1" class="pie-chart"></div>
        <div id="pieChart2" class="pie-chart"></div>
      </div>
      <el-form ref="searchForm" :model="searchForm" label-width="50px" class="xt_search_form">
        <el-card shadow="never" style="border: 1px dashed #ccc; padding: 1px; width: 100%; height: 60px">
          <el-row :gutter="20" class="align-center" style="width: 100%; top: -10px">
            <el-col :span="6">
              <el-form-item label="周期" prop="name">
                <el-date-picker
                  v-model="startDate"
                  type="daterange"
                  range-separator="至"
                  style="margin-top: 5px"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                  <!-- @change="handleDateChange" -->
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司" prop="companyId">
                <xt-tree-lzay-select placeholder="请选择公司" :formValue="searchForm.companyName" :selectType="'CORP'"
                                     @getTreeItem="(v) => getOwnerUnit(v, 'CORP')">
                </xt-tree-lzay-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-top: 5px" align="right">
              <el-button type="primary" @click="handleQuery" style="margin-right: 5px;">查询</el-button>
              <el-button type="primary" plain @click="handleReset">重置</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </div>
    <div class="page_body">
      <el-table ref="tableData" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading"
                @selection-change="selectionChange"
                @row-click="handleRowClick">
        <el-table-column label="周期" prop="cycle" width="200" align="center" show-overflow-tooltip/>
        <el-table-column label="公司" prop="companyName" width="160" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="网络空间作业" align="center">
          <el-table-column label="总数" prop="deviceTotal" width="160" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="进行中" prop="deviceIng" width="160" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="已完成" prop="deviceCompleted" width="160" align="center" show-overflow-tooltip/>
        </el-table-column>
        <el-table-column label="机房现场作业" align="center">
          <el-table-column label="总数" prop="roomTotal" width="160" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="进行中" prop="roomIng" width="160" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="已完成" prop="roomCompleted" width="160" align="center" show-overflow-tooltip/>
        </el-table-column>
        <el-table-column label="变电站作业" align="center">
          <el-table-column label="总数" prop="transformerTotal" width="160" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="进行中" prop="transformerIng" width="160" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ !scope.row.transformerIng? '-' : scope.row.transformerIng}}</span>
            </template>
          </el-table-column>
          <el-table-column label="已完成" prop="transformerCompleted" align="center" show-overflow-tooltip/>
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
  import {mapGetters} from "vuex";
  import xtTreeLzaySelect from '@/components/xtTreeLzaySelect'
  import {getDictList} from '@/api/dict'
  import * as echarts from "echarts";
  import {getRepairPie, repairStatList} from '@/api/xcnanr/maintenanceJobStatistics'


  export default {
    components: {
      xtTreeLzaySelect, getDictList,
    },
    computed: {
      ...mapGetters(["permission", 'userDetail'])
    },
    data() {
      return {
        chartData1: [],
        chartData2: [],
        startDate: [],
        uploadImageParams: {
          isShow: false,
          type: null,
          formDetial: {}
        },
        selectionList: [],
        searchForm: {
          pageNumber: 1,
          pageSize: 10,
        },
        total: 0,
        tableData: [],
        tableHeight: undefined,
        tableLoading: false,
        colors: ['#5087ec', '#68bbc4', '#EFB56D'],
      }
    },
    mounted() {
      this.setPageContentHeight();
      this.setTableHeight();
      this.getList();
      this.getRepairPie();
      this.getDictList('info_worker_type')

    },
    methods: {
      handleDateChange(value) {
        if (value && value.length === 2) {
          this.searchForm.startTime = value[0];
          this.searchForm.endTime = value[1];
        } else {
          this.searchForm.startTime = '';
          this.searchForm.endTime = '';
        }
      },
      handleRowClick(row) {
        // 更新 ECharts 图表
        this.updateChart(row)

      },
      updateChart(data) {
        // 根据行数据构建新的图表数据
        const chartData1 = [
          {name: '进行中', value: data.deviceIng + data.roomIng},
          {name: '已完成', value: data.deviceCompleted + data.roomCompleted},
        ];

        const chartData2 = [
          {name: '机房现场作业', value: data.roomTotal},
          {name: '网络作业空间', value: data.deviceTotal}, // 这里应该是 roomTotal 和 roomIng 吗？
        ];

        // 构建新的图表标题
        const chartTitle1 = `设备作业状态统计（${data.cycle}）`;
        const chartTitle2 = `检修类别统计（${data.cycle}）`;

        // 更新图表数据和标题
        this.initPieChart('pieChart1', chartData1, chartTitle1);
        this.initPieChart('pieChart2', chartData2, chartTitle2);

      },
      initPieChart(id, data, title) {
        const chartDom = document.getElementById(id);
        const myChart = echarts.init(chartDom);
        const option = {
          color: this.colors,
          title: {
            text: title,
            left: 'center',
            textStyle: {
              fontSize: 12 // 调整标题的字体大小
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
              radius: '52%', // 调整饼图的大小
              center: ['52%', '55%'], // 调整饼图的位置，使其位于图表的中心偏下
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
      refreshData() {
        this.getList()
      },
      //加载字典
      getDictList(code) {
        getDictList(code).then(res => {
          if (code === 'info_worker_type') {
            this.personTypeList = res.data
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
      getOwnerUnit(val, type) {
        if (type === 'CORP') {
          //单位
          this.searchForm.companyId = val.id
          this.searchForm.companyName = val.fullName

          //单位更改 部门请初始化
          this.searchForm.departmentId = null;
          this.searchForm.departmentName = null;
        } else if (type === 'DEPT') {
          //部门
          this.searchForm.departmentId = val.id;
          this.searchForm.departmentName = val.fullName;
        }
        this.$forceUpdate()
      },
      selectionChange(selection) {
        console.log("点击事件", selection)
        //点击选择事件
        this.selectionList = selection.map(item => item.id);
      },
      handleQuery() {
        this.searchForm.current = 1;
        this.getList();
      },
      handleReset() {
        this.searchForm.companyId = undefined;
        this.searchForm.companyName = undefined;
        this.searchForm.startDate = undefined;
        this.searchForm.endDate = undefined;
        this.startDate = undefined;
        this.getList();
      },
      // 设置表格高度
      setTableHeight() {
        let bodyBox = document.getElementsByClassName('page_body');
        this.tableHeight = (bodyBox[0].offsetHeight - 100) + 'px'
      },
      getList() {
        this.tableLoading = true;
        this.searchForm.companyRegionCode = this.userDetail.regionCode
        this.searchForm.startDate = this.startDate[0]
        this.searchForm.endDate = this.startDate[1]
        repairStatList(this.searchForm).then(res => {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      getRepairPie() {
        getRepairPie({companyRegionCode: this.userDetail.regionCode}).then(res => {
          // 假设res.data包含chartTitle1和chartTitle2字段用于存储图表标题
          const chartTitle1 = '作业完成状态周期统计（' + res.data.statusMap.cycle + '）'
          const chartTitle2 = '检修类别周期统计（' + res.data.cycleMap.cycle + '）'

          // 填充 chartData1
          this.chartData1 = [
            {name: '已完成', value: res.data.statusMap.completedCount},
            {name: '进行中', value: res.data.statusMap.ingCount},
          ];
          // 填充 chartData2
          this.chartData2 = [
            {name: '机房现场作业', value: res.data.cycleMap.jifangCount},
            {name: '网络作业空间', value: res.data.cycleMap.wangluoCount},
          ];
          this.initPieChart('pieChart1', this.chartData1, chartTitle1);
          this.initPieChart('pieChart2', this.chartData2, chartTitle2);
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-card {
    box-sizing: border-box;
  }

  .align-center {
    display: flex;
    align-items: center;
  }

  .el-link {
    font-size: 13px;
  }

  .s_lt {
    font-size: 12px;
  }

  .echarts-container {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
  }

  .pie-chart {
    width: 48%;
    height: 236px;
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
      border-width: 0px !important;
      width: 0px !important;
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
      margin-bottom: 0px;
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

  .btn-line {
    text-align: center;
    padding-bottom: 25px;
    margin-top: 20px;
    // position: absolute;
    // left: 50%;
    // bottom: 30px;
    // transform: translateX(-50%);
    & > button {
      margin-right: 10px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .s_empty {
    padding: 12px;
    font-size: 14px;
    color: #a1a1a1;
  }
</style>
