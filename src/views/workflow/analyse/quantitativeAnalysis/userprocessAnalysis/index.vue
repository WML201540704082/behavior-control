<!--用户流程分析-->
<template>
  <div id="personProcessContent" style="flex: 1" class="content-box">
    <!--顶部条件选择框-->
    <date-picker-tabs
      :remarks="remarks"
      :set-width="'calc(100% - 689px)'"
      :show-top-few="false"
      :show-user="true"
      title="用户"
      @isShowList="showOrHideList"
      @getQueryList="setQueryParams"
    />
    <!--列表-->
    <div v-show="showList" class="content-body">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        height="100%"
        stripe
        class="lcdp-table"
      >
        <el-table-column
          type="index"
          width="150"
          label="序号"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="人员名称"
          align="center"
          min-width="150"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span
              class="table-link-text"
              @click="showPersonDialog(scope.row.userId, scope.row.userName)"
            >{{ scope.row.userName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="createCount"
          align="center"
          show-overflow-tooltip
        >
          <template v-slot:header>
            <span>发起数</span>
            <el-tooltip content="发起的流程实例数量"
            ><i class="font_family icon-qingqibing_xinxi"
            /></el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="approveCount"
          align="center"
          show-overflow-tooltip
        >
          <template v-slot:header>
            <span>审批数</span>
            <el-tooltip content="参与审批的流程数量"
            ><i class="font_family icon-qingqibing_xinxi"
            /></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--柱状图-->
    <div v-show="!showList" class="content-body">
      <div id="personProcessBar" class="fill"/>
    </div>
    <!--人员--流程--流程节点-->
    <el-dialog
      :visible.sync="personalDialog"
      :before-close="handlePersonalClose"
      :close-on-click-modal="false"
      :title="personalName + '的工作量统计'"
      class="lcdp-dialog"
    >
      <div class="left-mian-table">
        <div class="filter-btn flex">
          <el-input v-model="personalKeyword" placeholder="流程名称"/>
          <el-button
            class="btn-search left"
            style="margin-left: 10px"
            type="primary"
            @click="queryPersonalData"
          >搜索
          </el-button>
          <el-button
            class="hussar-btn btn-reset"
            type="button"
            @click="clearPersonQuery"
          >重置
          </el-button>
          <!--          <el-button style="position: absolute;right: 0;" class="hussar-btn btn-reset" type="button" @click="queryPersonalData">刷新</el-button>-->
        </div>
        <el-table
          v-loading="personalTableLoading"
          :data="personalTableData"
          height="350"
          :row-class-name="selectedRowClass"
          class="taskStatusList lcdp-table"
          width="100%"
          stripe
          @row-click="clickProcessRow"
        >
          <el-table-column align="center" width="50">
            <template #default="scope">
              <el-radio
                :label="scope.row.processKey"
                v-model="processId"
                @change="
                  showProcessDialog(scope.row.processKey, scope.row.processName)
                "
              ><span/>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            :index="personalIndexMethod"
            type="index"
            label="序号"
            align="center"
            width="60"
            show-overflow-tooltip
          />
          <el-table-column
            min-width="150"
            property="processName"
            label="流程名称"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            min-width="75"
            property="createCount"
            align="center"
            label="发起数"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            min-width="75"
            property="approveCount"
            align="center"
            label="审批数"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="personal.currentPage"
          :page-sizes="personal.sizes"
          :page-size="personal.currentSize"
          :total="personal.total"
          layout="total, sizes, prev, pager, next"
          class="lcdp-pagination"
          popper-class="lcdp-page-select"
          @size-change="handlePersonalSizeChange"
          @current-change="handlePersonalCurrentChange"
        />
      </div>
      <div class="right-detail-table">
        <div class="filter-btn filter-title">
          {{
          processName === '' ? processName : processName + '的节点工作量统计'
          }}
        </div>
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
            width="80"
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
            min-width="75"
            property="approveCount"
            label="已办数"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            min-width="75"
            property="revokeCount"
            label="撤回数"
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
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import datePickerTabs from '../../../components/dataPickerTabs/index.vue'
  import * as echarts from 'echarts'
  import * as Api from '@/api/workflow/analyse/personProcessAnalysis'

  let personEcharts = null
  let resizeObserve = null

  export default {
    name: 'PersonProcessAnalysis',
    components: {
      datePickerTabs
    },
    data() {
      return {
        showList: false, // 控制显示列表还是柱状图
        tableData: [], // 列表数据
        barData: [], // 图表数据
        tableLoading: false, // 列表是否加载
        queryParams: {}, // 查询参数

        personalDialog: false, // 人员-流程弹框
        personalId: '', // 人员id
        personalName: '', // 人员名称
        personal: {
          currentPage: 1,
          currentSize: 10,
          sizes: [10, 20, 50, 100],
          total: 0
        }, // 分页信息
        personalTableLoading: false, // 列表加载状态
        personalTableData: [], // 列表数据
        personalKeyword: '', // 搜索关键字

        processDialog: false, // 人员-流程--流程节点弹框
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
        remarks: '统计特定时间内人员发起和参与审批的流程实例数量。'
      }
    },
    mounted() {
      const self = this
      self.init().then(() => {
        if (!resizeObserve) {
          resizeObserve = new ResizeObserver(() => {
            if (personEcharts) personEcharts.resize()
          })
          resizeObserve.observe(document.getElementById('personProcessContent'))
        }
      })
    },
    beforeUnmount() {
      if (personEcharts) personEcharts.dispose()
      personEcharts = null
      if (resizeObserve) resizeObserve.disconnect()
      resizeObserve = null
    },
    methods: {
      // 初始化
      async init() {
        const self = this
        self.queryData(() => {
          self.$nextTick(() => {
            self.initBarEcheart()
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
            self.initBarEcheart()
          })
        })
      },
      // 查询数据
      queryData(calcback) {
        const self = this
        self.tableLoading = true
        self.tableData = []
        const params = {
          userIds:
            self.queryParams.userIds || this.$getHussarUserId(this),
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
        Api.getPersonProcessData(params)
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
                  姓名: item.userName,
                  发起数: item.createCount,
                  审批数: item.approveCount,
                  id: item.userId
                })
              })
              self.barData = data
              calcback()
              self.tableLoading = false
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
      // 初始化柱状图
      initBarEcheart() {
        const self = this
        let isShow = false
        let end = 100
        if (self.barData.length > 8) {
          isShow = true
          end = (8 / self.barData.length) * 100
        }
        if (personEcharts) {
          personEcharts.dispose()
        }

        let dom = document.getElementById('personProcessBar')
        if (!dom) return
        personEcharts = echarts.init(dom)
        personEcharts.on('click', value => {
          self.showPersonDialog(value.data.id, value.data['姓名'])
        })
        //  }
        const options = {
          color: ['rgba(82,172,255,0.85)', 'rgba(122,200,255,0.85)'],
          grid: {
            top: 60,
            right: 0,
            bottom: 30,
            left: 0,
            containLabel: true
          },
          dataZoom: [
            {
              type: 'slider',
              show: isShow,
              backgroundColor: '#ffffff',
              xAxisIndex: [0],
              height: 8,
              width: 'auto',
              top: 'auto',
              bottom: 10,
              left: 25,
              border: 0,
              start: 0, // 数据窗口范围的起始百分比。范围是：0 ~ 100。表示 0% ~ 100%。
              end: end, // 数据窗口范围的结束百分比。范围是：0 ~ 100。
              handleIcon: 'none',
              showDataShadow: false,
              showDetail: false,
              brushSelect: false,
              zoomLock: true
            },
            {
              start: 0,
              end: end,
              type: 'inside',
              disabled: false,
              zoomLock: true
            }
          ],
          legend: {
            type: 'scroll',
            top: 0,
            right: 0,
            padding: 0,
            icon: 'rect',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
              color: '#8C8C8C'
            },
            tooltip: {
              show: true,
              position: function(pos, params, dom, rect, size) {
                // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                var obj = { top: 20 }
                obj[['right', 'left'][+(pos[0] < size.viewSize[0] / 2)]] = 5
                return obj
              },
              backgroundColor: '#303133',
              textStyle: {
                fontSize: 12,
                color: '#ffffff'
              },
              formatter: function(params) {
                if (params.name === '发起数') {
                  return '发起的流程实例数量'
                } else {
                  return '参与审批的流程数量'
                }
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            },
            backgroundColor: 'rgba(111, 111, 111, 1)',
            textStyle: {
              color: '#fff',
              fontWeight: '400',
              align: 'left'
            },
            borderWidth: 0
          },
          dataset: {
            dimensions: ['姓名', '发起数', '审批数'],
            source: self.barData
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              color: 'rgba(0, 0, 0, 0.45)',
              interval: 0,
              width: 100,
              overflow: 'truncate'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(0, 0, 0, 0.45)'
              }
            }
          },
          yAxis: {
            show: true,
            type: 'value',
            axisLabel: {
              color: 'rgba(0, 0, 0, 0.45)'
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            minInterval: 1,
            max: function(value) {
              if (value.max === 0) return 5
            }
          },
          series: [
            {
              type: 'bar',
              barMaxWidth: 32
            },
            {
              type: 'bar',
              barMaxWidth: 32
            }
          ]
        }
        personEcharts.setOption(options)
      },

      // 点击流程名称，查看人员下流程下流程节点的相关数据
      showPersonDialog(userId, userName) {
        const self = this
        self.personalId = userId
        self.personalName = userName
        self.personalDialog = true
        self.queryPersonalData()
      },
      // 查询指定人员的各个流程的数据
      queryPersonalData() {
        const self = this
        const queryParams = {
          current: self.personal.currentPage || 1,
          size: self.personal.currentSize || 10,
          keyword: self.personalKeyword || '',
          userId: self.personalId || this.$getHussarUserId(this),
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
        if (queryParams.statisType == 'auto') {
          delete queryParams.dayTime
          delete queryParams.monthMonth
          delete queryParams.quarterQuarter
          delete queryParams.quarterYear
          delete queryParams.yearYear
        }
        self.personalTableLoading = true
        self.personalTableData = []
        self.handleProcessClose()
        Api.getPersonalProcessData(queryParams)
          .then(res => {
            if (res && res.code && res.code === 10000) {
              if (
                res.data.records &&
                res.data.records.length &&
                res.data.records.length !== 0
              ) {
                self.personalTableData = res.data.records
                self.showProcessDialog(
                  self.personalTableData[0].processKey,
                  self.personalTableData[0].processName
                )
              } else {
                self.personalTableData = []
              }
              self.personal.total = res.data.total || 0
              if (
                self.personalTableData.length === 0 &&
                self.personal.total !== 0
              ) {
                self.personal.currentPage = 1
                self.queryPersonalData()
              } else {
                self.personalTableLoading = false
              }
            } else {
              this.$message({
                message: '根据人员获取流程数据失败',
                type: 'error'
              })
            }
          })
          .catch(() => {
            this.$message({
              message: '根据人员获取流程数据异常',
              type: 'error'
            })
          })
      },
      // 关闭人员--流程弹框
      handlePersonalClose() {
        const self = this
        self.personalDialog = false
        self.personalTableData = []
        self.personal.currentPage = 1
        self.personal.total = 0
        self.personalId = ''
        self.personalName = ''
        self.personalKeyword = ''
        self.handleProcessClose()
      },
      // 清空查询提交并查询
      clearPersonQuery() {
        const self = this
        self.personalKeyword = ''
        self.queryPersonalData()
      },
      // 改变每页条数
      handlePersonalSizeChange(val) {
        const self = this
        self.personal.currentSize = val
        self.queryPersonalData()
      },
      // 改版页数
      handlePersonalCurrentChange(val) {
        const self = this
        self.personal.currentPage = val
        self.queryPersonalData()
      },
      // 列表序号
      personalIndexMethod(index) {
        const self = this
        const curpage = self.personal.currentPage
        const limitpage = self.personal.currentSize
        return index + 1 + (curpage - 1) * limitpage
      },
      // 点击当前行，选中当前行
      clickProcessRow(row) {
        const self = this
        self.showProcessDialog(row.processKey, row.processName)
      },
      // 选中行独特的样式
      selectedRowClass({ row }) {
        const self = this
        return row.processKey === self.processId ? 'selected-row' : ''
      },

      // 点击人员名称，查看人员下流程的相关数据
      showProcessDialog(processId, processName) {
        const self = this
        if (self.processId !== processId) {
          self.processId = processId
          self.processName = processName
          self.process.currentPage = 1
          // self.processDialog = true;
          self.queryProcessData()
        }
      },
      // 查询指定人员的各个流程的数据
      queryProcessData() {
        const self = this
        const queryParams = {
          current: self.process.currentPage || 1,
          size: self.process.currentSize || 10,
          processKey: self.processId || '',
          userId: self.personalId || this.$getHussarUserId(this),
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
        Api.getPersonalConfirmProcess(queryParams)
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
                message: '根据人员、流程获取流节点程数据失败',
                type: 'error'
              })
            }
          })
          .catch(() => {
            this.$message({
              message: '根据人员、流程获取流节点程数据异常',
              type: 'error'
            })
          })
      },
      // 关闭人员--流程弹框
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

<style lang="scss" scoped>
  .fill {
    width: 100%;
    height: 100%;
  }

  .content-box {
    width: 100%;
    height: calc(100vh - 96px);
    padding: 16px 24px 16px 24px;
    background: #fff;
    overflow: auto;
    border-radius: 4px;
  }

  .content-body {
    width: 100%;
    height: calc(100vh - 300px);
    position: relative;
  }

  .content-box :deep(.tabs.el-tabs.el-tabs--top) {
    padding-bottom: 16px;
  }

  .table-link-text {
    display: block;
    width: 100%;
    height: 100%;
    color: #2794f8;
    cursor: pointer;
  }

  .lcdp-dialog :deep(.el-dialog) {
    height: 60%;
    min-height: 500px;
    width: 970px;
  }

  .lcdp-dialog :deep(.el-dialog__title) {
    color: #333651;
  }

  :deep(.el-dialog__body) {
    padding: 0;
    width: 100%;
    height: calc(100% - 42px);
    font-size: 0;
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

  .left-mian-table {
    vertical-align: top;
    width: 50%;
    height: 100%;
    display: inline-block;
    border-right: 1px solid #eaeaea;
    padding: 10px 14px 12px 14px;
  }

  .question-detail-icon {
    color: #2794f8;
    display: inline-block;
    font-size: 14px;
    vertical-align: middle;
    margin-left: 5px;
  }

  .right-detail-table {
    width: 50%;
    height: 100%;
    display: inline-block;
    padding: 10px 14px 12px 14px;
  }

  .filter-btn {
    width: 100%;
    height: 32px;
    margin-bottom: 10px;
    position: relative;
  }

  .filter-btn.filter-title {
    font-weight: 400;
    font-size: 14px;
    color: #545672;
    line-height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }

  .flex {
    display: flex;
  }

  .lcdp-dialog .filter-btn :deep(.el-input) {
    width: 160px;
  }

  :deep(.el-table .cell:empty::before) {
    content: '';
  }

  :deep(.el-table__row.selected-row),
  :deep(.el-table--striped
    .el-table__body
    tr.el-table__row--striped.selected-row),
  :deep(.el-table--striped
    .el-table__body
    tr.el-table__row--striped.selected-row
    td) {
    background: #e4f2ff;
  }

  .icon-qingqibing_xinxi {
    position: absolute;
    margin-left: 4px;
  }
</style>
