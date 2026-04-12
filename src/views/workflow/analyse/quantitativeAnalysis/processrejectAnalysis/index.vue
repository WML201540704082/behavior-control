<!--流程驳回分析-->
<template>
  <div id="rejectContent" class="content-box">
    <!--顶部条件选择框-->
    <date-picker-tabs
      :remarks="remarks"
      :set-width="'calc(100% - 755px)'"
      @isShowList="showOrHideList"
      @getQueryList="setQueryParams"
    />
    <!--列表-->
    <div v-show="showList" class="content-body">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        height="100%"
        class="lcdp-table"
        stripe
      >
        <el-table-column
          type="index"
          width="150"
          label="序号"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="流程名称"
          align="center"
          min-width="150"
          prop="processName"
          show-overflow-tooltip
        />
        <el-table-column
          min-width="150"
          label="驳回次数"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span
              class="table-link-text"
              @click="
                showRejectNode(scope.row.processKey, scope.row.processName)
              "
            >{{ scope.row.rejectCount }}</span
            >
          </template>
        </el-table-column>
        >
      </el-table>
    </div>
    <!--饼图-->
    <div v-show="!showList" class="content-body">
      <div
        v-show="pieData.length !== 0 || !isGetResult"
        id="rejcetPie"
        class="fill"
      />
      <div v-show="pieData.length === 0 && isGetResult" class="fill empty-text">
        暂无数据
      </div>
    </div>

    <el-dialog
      :visible.sync="processDialog"
      :before-close="handleProcessClose"
      :close-on-click-modal="false"
      :title="`${processName}的节点工作量统计`"
      class="lcdp-dialog"
    >
      <el-table
        v-loading="processTableLoading"
        :data="processTableData"
        class="taskStatusList lcdp-table"
        width="100%"
        height="350"
        stripe
      >
        <el-table-column
          :index="processIndexMethod"
          type="index"
          label="序号"
          align="center"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          min-width="150"
          property="taskDefinitionName"
          label="流程节点名称"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          min-width="150"
          property="rejectCount"
          label="驳回次数"
          align="center"
          show-overflow-tooltip
        />
      </el-table>
      <el-pagination
        :current-page="process.currentPage"
        :page-sizes="process.sizes"
        :page-size="process.currentSize"
        :total="process.total"
        layout="total, sizes, prev, pager, next"
        class="lcdp-pagination"
        popper-class="lcdp-page-select"
        @size-change="handleProcessSizeChange"
        @current-change="handleProcessCurrentChange"
      />
    </el-dialog>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import datePickerTabs from '../../../components/dataPickerTabs/index.vue'
  import * as Api from '@/api/workflow/analyse/processRejectAnalysis'

  let rejectEcharts = null
  let resizeObserve = null

  export default {
    name: 'ProcessRejectAnalysis',
    components: {
      datePickerTabs
    },
    data() {
      return {
        showList: false, // 控制显示列表还是圆饼
        tableData: [], // 列表数据
        pieData: [], // 图表数据
        tableLoading: false, // 列表是否加载
        queryParams: {}, // 查询参数
        isGetResult: false, // 是否获取到查询结果

        processDialog: false, // 流程--流程节点弹框
        processId: '', // 流程id
        processName: '', // 流程名称
        process: {
          currentPage: 1,
          currentSize: 10,
          sizes: [10, 20, 50, 100],
          total: 0
        }, // 分页信息
        processTableLoading: false, // 列表加载状态
        processTableData: [], // 列表数据
        remarks: '统计特定时间内任务驳回数量排行前N的流程，对流程进行监控。'
      }
    },
    mounted() {
      const self = this
      self.init().then(() => {
        if (!resizeObserve) {
          resizeObserve = new ResizeObserver(() => {
            if (rejectEcharts) rejectEcharts.resize()
          })
          resizeObserve.observe(document.getElementById('rejectContent'))
        }
      })
    },
    beforeUnmount() {
      if (resizeObserve) resizeObserve.disconnect()
      resizeObserve = null
      if (rejectEcharts) rejectEcharts.dispose()
      rejectEcharts = null
    },
    methods: {
      async init() {
        const self = this
        self.queryData(() => {
          self.$nextTick(() => {
            self.initRejectPie()
          })
        })
      },
      // 切换显示列表还是柱状图
      showOrHideList(value) {
        const self = this
        self.showList = value
      },
      // 重置查询参数
      setQueryParams(value) {
        const self = this
        self.queryParams = value
        self.queryData(() => {
          self.$nextTick(() => {
            self.initRejectPie()
          })
        })
      },
      // 查询数据
      queryData(calcback) {
        const self = this
        self.tableLoading = true
        self.tableData = []
        self.isGetResult = false
        const params = {
          size: self.queryParams.size || 5,
          statisType: self.queryParams.statisType || 'month',
          autoStartTime:
            self.queryParams.choiceTime && self.queryParams.choiceTime.startTime
              ? self.queryParams.choiceTime.startTime
              : '',
          autoEndTime:
            self.queryParams.choiceTime && self.queryParams.choiceTime.endTime
              ? self.queryParams.choiceTime.endTime
              : '',
          dayTime:
            self.queryParams.choiceTime ||
            `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()}`,
          monthMonth:
            self.queryParams.choiceTime ||
            `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
          quarterYear: self.queryParams.choiceTime || '',
          quarterQuarter: self.queryParams.quarterQuarter || '',
          yearYear: self.queryParams.choiceTime || ''
        }
        if (self.queryParams.statisType == 'auto') {
          delete params.dayTime
          delete params.monthMonth
          delete params.quarterQuarter
          delete params.quarterYear
          delete params.yearYear
        }
        Api.getRejectProcess(params)
          .then(res => {
            if (res && res.code && res.code === 10000) {
              if (res.data && res.data.length && res.data.length !== 0) {
                self.tableData = res.data
              } else {
                self.tableData = []
              }
              const data = []
              self.tableData.forEach(item => {
                data.push({
                  value: item.rejectCount,
                  name: item.processName,
                  id: item.processKey
                })
              })
              self.pieData = data
              if (self.pieData.length) calcback()
              self.tableLoading = false

              self.isGetResult = true
            } else {
              this.$message({
                message: '',
                type: 'error'
              })
            }
          })
          .catch(() => {
            this.$message({
              message: '获取流程数据异常',
              type: 'error'
            })
          })
      },
      // 初始化圆环
      initRejectPie() {
        const self = this
        if (rejectEcharts) rejectEcharts.dispose()

        let dom = document.getElementById('rejcetPie')
        if (!dom) return
        rejectEcharts = echarts.init(dom)
        rejectEcharts.on('click', value => {
          self.showRejectNode(value.data.id, value.data.name)
        })

        const options = {
          color: [
            '#2794F8',
            '#FFBB00',
            '#EE7B4E',
            '#52C566',
            '#6F5EF9',
            '#6DC8EC',
            '#945FB9',
            '#FF9845',
            '#1E9493',
            '#FF99C3',
            '#BDD2FD',
            '#BDD2FD',
            '#5AD8A6',
            '#BDEFDB',
            '#5D7092',
            '#C2C8D5',
            '#F6BD16',
            '#FBE5A2',
            '#E8684A',
            '#F6C3B7'
          ],
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(111, 111, 111, 1)',
            borderWidth: 0,
            borderColor: 'rgba(255, 255, 255, 0)',
            textStyle: {
              color: '#fff',
              fontWeight: '400'
            },
            confine: true,
            renderMode: 'html',
            className:
              'tooltip-lang-text-limit process-analysis-part process-reject-analysis flex'
          },
          legend: {
            type: 'scroll',
            top: 16,
            right: 0,
            padding: 0,
            icon: 'circle',
            itemWidth: 9,
            itemHeight: 9,
            height: 32,
            textStyle: {
              color: '#8C8C8C',
              lineHeight: 16,
              width: 100,
              overflow: 'truncate'
            }
          },
          series: [
            {
              type: 'pie',
              radius: ['35%', '55%'],
              minAngle: 3,
              avoidLabelOverlap: true,
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 2
              },
              top: 32,
              bottom: 0,
              left: 0,
              right: 0,
              label: {
                show: true,
                color: '#545672',
                formatter: '{b}\n{c}次',
                padding: [5, 5, 5, 5],
                lineHeight: 17,
                width: 100,
                overflow: 'truncate'
              },
              labelLine: {
                show: true,
                length: 40,
                length2: 60,
                lineStyle: {
                  width: 1,
                  color: '#979797'
                }
              },
              data: self.pieData
            }
          ]
        }
        rejectEcharts.setOption(options)
      },

      // 弹框点击的流程的各个节点的驳回次数信息
      showRejectNode(processId, processName) {
        const self = this
        self.processId = processId
        self.processName = processName
        self.processDialog = true
        self.queryProcessData()
      },
      // 查询指定流程的各个节点的数据
      queryProcessData() {
        const self = this
        const queryParams = {
          current: self.process.currentPage || 1,
          size: self.process.currentSize || 10,
          processKey: self.processId || '',
          statisType: self.queryParams.statisType || 'month',
          autoStartTime:
            self.queryParams.choiceTime && self.queryParams.choiceTime.startTime
              ? self.queryParams.choiceTime.startTime
              : '',
          autoEndTime:
            self.queryParams.choiceTime && self.queryParams.choiceTime.endTime
              ? self.queryParams.choiceTime.endTime
              : '',
          dayTime:
            self.queryParams.choiceTime ||
            `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()}`,
          monthMonth:
            self.queryParams.choiceTime ||
            `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
          quarterYear: self.queryParams.choiceTime || '',
          quarterQuarter: self.queryParams.quarterQuarter || '',
          yearYear: self.queryParams.choiceTime || ''
        }
        self.processTableLoading = true
        self.processTableData = []
        if (queryParams.statisType == 'auto') {
          delete queryParams.dayTime
          delete queryParams.monthMonth
          delete queryParams.quarterQuarter
          delete queryParams.quarterYear
          delete queryParams.yearYear
        }
        Api.getRejectNode(queryParams)
          .then(res => {
            if (res && res.code && res.code === 10000) {
              if (
                res.data.records &&
                res.data.records.length &&
                res.data.records.length !== 0
              ) {
                self.processTableData = res.data.records
              } else {
                self.processTableData = []
              }
              self.process.total = res.data.total || 0
              self.processTableLoading = false
            } else {
              this.$message({
                message: '根据流程获取节点数据失败',
                type: 'error'
              })
            }
          })
          .catch(() => {
            this.$message({
              message: '根据流程获取节点数据异常',
              type: 'error'
            })
          })
      },
      // 关闭流程-流程节点弹框
      handleProcessClose() {
        const self = this
        self.processDialog = false
        self.processTableData = []
        self.processId = ''
        self.processName = ''
        self.process.currentPage = 1
        self.process.total = 0
      },
      // 改变每页条数
      handleProcessSizeChange(val) {
        const self = this
        self.process.currentSize = val
        self.queryProcessData()
      },
      // 改版页数
      handleProcessCurrentChange(val) {
        const self = this
        self.process.currentPage = val
        self.queryProcessData()
      },
      // 列表序号
      processIndexMethod(index) {
        const self = this
        const curpage = self.process.currentPage
        const limitpage = self.process.currentSize
        return index + 1 + (curpage - 1) * limitpage
      }
    }
  }
</script>

<style scoped>
  .fill {
    width: 100%;
    height: 100%;
  }

  .content-box {
    width: calc(100% - 16px);
    height: calc(100vh - 96px);
    padding: 16px 24px 16px 14px;
    background: #fff;
    overflow: auto;
    border-radius: 4px;
  }

  .content-body {
    width: 100%;
    height: calc(100% - 95px);
    position: relative;
  }

  .empty-text {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    line-height: 60px;
    color: #909399;
  }

  .table-link-text {
    display: block;
    width: 100%;
    height: 100%;
    color: #2794f8;
    cursor: pointer;
  }

  .lcdp-dialog ::v-deep .el-dialog {
    width: 970px;
    height: 60%;
    min-height: 500px;
  }

  .lcdp-dialog ::v-deep .el-dialog__title {
    color: #333651;
  }

  ::v-deep .el-dialog__body {
    padding: 21px 24px 12px 24px;
    width: 100%;
    height: calc(100% - 42px);
  }

  .dialog-title {
    line-height: 22px;
    font-size: 16px;
    color: #333651;
    display: inline-block;
    vertical-align: middle;
  }

  .limit-title-length {
    max-width: 450px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
  }
</style>

<style lang="scss" scoped>
  ::v-deep .tooltip-lang-text-limit.process-analysis-part.process-reject-analysis span {
    display: inline-block;
    max-width: 400px;
    width: fit-content;
    white-space: normal;
    word-break: break-all;
    vertical-align: middle;
    line-height: 20px;
  }

  ::v-deep .tooltip-lang-text-limit.process-analysis-part.process-reject-analysis.flex
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
  }
</style>
