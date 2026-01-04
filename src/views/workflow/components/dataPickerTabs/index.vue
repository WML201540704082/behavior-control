<template>
  <el-tabs
    v-model="activeName"
    :style="{ '--margin-left': setWidth }"
    class="tabs tab-disabled datapicktabs"
  >
    <el-tab-pane v-if="tabsShow.day" lazy label="日报" name="day">
      <div class="table-filter">
        <el-date-picker
          v-model="dateTimeDay"
          :clearable="false"
          :editable="false"
          class="search-input"
          popper-class="lcdp-date-pop"
          type="date"
          placeholder="选择日期"
        />
        <el-select
          v-if="showTopFew"
          v-model="value"
          placeholder="请选择"
          class="search-input"
          popper-class="short_select"
        >
          <el-option
            v-for="item in sizeOptions || options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <select-user
          v-if="showUser"
          :title="title"
          :value.sync="users"
          :is-radio="isSelectUserRadio"
        />
        <div class="filter-btn flex">
          <el-button
            class="btn-search left ml1"
            type="primary"
            @click="queryType()"
          >搜索
          </el-button>
          <el-button
            class="hussar-btn btn-reset"
            type="button"
            @click="clearData()"
          >重置
          </el-button>
        </div>
        <show-list-or-echarts
          v-model="checked"
          class="view-list"
          @updateValue="updateChecked"
        />
      </div>
    </el-tab-pane>
    <el-tab-pane v-if="tabsShow.month" lazy label="月报" name="month">
      <div class="table-filter">
        <el-date-picker
          v-model="dateTimeMonth"
          :type="isShowYear ? 'year' : 'month'"
          :clearable="false"
          :editable="false"
          class="search-input"
          popper-class="lcdp-date-pop"
          placeholder="选择日期"
        />
        <el-select
          v-if="showTopFew"
          v-model="value"
          placeholder="请选择"
          class="search-input"
          popper-class="short_select"
        >
          <el-option
            v-for="item in sizeOptions || options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <select-user
          v-if="showUser"
          :title="title"
          :value.sync="users"
          :is-radio="isSelectUserRadio"
        />
        <div class="filter-btn flex">
          <el-button class="btn-search left" type="primary" @click="queryType()"
          >搜索
          </el-button>
          <el-button
            class="hussar-btn btn-reset"
            type="button"
            @click="clearData()"
          >重置
          </el-button>
        </div>
        <show-list-or-echarts
          v-model="checked"
          class="view-list"
          @updateValue="updateChecked"
        />
      </div>
    </el-tab-pane>
    <el-tab-pane v-if="tabsShow.quarter" lazy label="季报" name="quarter">
      <div class="table-filter">
        <el-date-picker
          v-model="dateTimeQuater"
          :clearable="false"
          :editable="false"
          class="search-input"
          popper-class="lcdp-date-pop"
          type="year"
          placeholder="选择日期"
        />
        <el-select
          v-if="!isShowYear"
          v-model="quarter"
          placeholder="请选择"
          class="search-input"
          style="margin-left: 10px"
          popper-class="short_select"
        >
          <el-option
            v-for="item in quarterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-if="showTopFew"
          v-model="value"
          placeholder="请选择"
          class="search-input"
          popper-class="short_select"
        >
          <el-option
            v-for="item in sizeOptions || options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <select-user
          v-if="showUser"
          :title="title"
          :value.sync="users"
          :is-radio="isSelectUserRadio"
        />
        <div class="filter-btn flex">
          <el-button class="btn-search left" type="primary" @click="queryType()"
          >搜索
          </el-button>
          <el-button
            class="hussar-btn btn-reset"
            type="button"
            @click="clearData()"
          >重置
          </el-button>
        </div>
        <show-list-or-echarts
          v-model="checked"
          class="view-list"
          @updateValue="updateChecked"
        />
      </div>
    </el-tab-pane>
    <el-tab-pane v-if="tabsShow.year" lazy label="年报" name="year">
      <div class="table-filter">
        <el-date-picker
          v-model="dateTimeYear"
          :clearable="false"
          :editable="false"
          class="search-input"
          popper-class="lcdp-date-pop"
          type="year"
          placeholder="选择日期"
        />
        <el-select
          v-if="showTopFew"
          v-model="value"
          placeholder="请选择"
          class="search-input"
          popper-class="short_select"
        >
          <el-option
            v-for="item in sizeOptions || options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <select-user
          v-if="showUser"
          :title="title"
          :value.sync="users"
          :is-radio="isSelectUserRadio"
        />
        <div class="filter-btn flex">
          <el-button class="btn-search left" type="primary" @click="queryType()"
          >搜索
          </el-button>
          <el-button
            class="hussar-btn btn-reset"
            type="button"
            @click="clearData()"
          >重置
          </el-button>
        </div>
        <show-list-or-echarts
          v-model="checked"
          class="view-list"
          @updateValue="updateChecked"
        />
      </div>
    </el-tab-pane>
    <el-tab-pane v-if="tabsShow.auto" lazy label="自定义" name="auto">
      <div class="table-filter">
        <el-date-picker
          v-model="dateTimeAuto"
          :clearable="false"
          :editable="false"
          :picker-options="pickerOptions"
          class="search-input"
          popper-class="lcdp-date-pop bpa-tabs-auto-time"
          type="daterange"
          style="width: auto; max-width: 300px"
          unlink-panels
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
        <el-select
          v-if="showTopFew"
          v-model="value"
          placeholder="请选择"
          class="search-input"
          popper-class="short_select"
        >
          <el-option
            v-for="item in sizeOptions || options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <select-user
          v-if="showUser"
          :title="title"
          :value.sync="users"
          :is-radio="isSelectUserRadio"
        />
        <div class="filter-btn flex" style="flex: 1">
          <el-button class="btn-search left" type="primary" @click="queryType()"
          >搜索
          </el-button>
          <el-button
            class="hussar-btn btn-reset"
            type="button"
            @click="clearData()"
          >重置
          </el-button>
        </div>
        <show-list-or-echarts
          v-model="checked"
          class="view-list"
          @updateValue="updateChecked"
        />
      </div>
    </el-tab-pane>
    <!--        <el-tab-pane-->
    <!--            disabled-->
    <!--            :label="remarks"-->
    <!--        >-->
    <!--        </el-tab-pane>-->
  </el-tabs>
</template>

<script>
  /*
              一、可监听事件 -- 切换列表与echeart图
              1. 事件 isShowList
              传递给父组件数据 true/false
              2. 事件 getQueryList -- 查询
              传递给父组件数据 {
                statisType 当前选择tabs的类型， day-日报 month-月报 quarter-季报 year-年报 auto-自定义选择
                choiceTime 第一个时间选择框所选择的值
                size 第二个下拉框所选择的值
                quarterQuarter 如果activeName是quarter时，多一个下拉框默认是季度的选择
                userIds 选中人员的id
                }
              二、props传入的参数
              1. showTopFew -- 是否展示选择前五名的下拉框， 默认显示
              2. showUser -- 是否展示选择人员的下拉框，  默认不显示
              3. active -- 开始进入时活动的tab页，  默认day
              4. sizeOptions -- 下拉框的选项，显示前几的    默认显示前5
              5. tabsShow -- tabs显示那些，    默认全部显示
              6. isSelectUserRadio -- 选择人员的下拉框是否是单选 默认不是
                */
  import SelectUser from './selectUser.vue'
  import showListOrEcharts from './showListOrEchart.vue'
  import { getTopSelections } from '@/api/workflow/selectUser'

  export default {
    name: 'DataPickerTabs',
    components: {
      SelectUser,
      showListOrEcharts
    },
    props: {
      showTopFew: { type: Boolean, default: true }, // 展示前五名
      showUser: { type: Boolean, default: false }, // 展示人员组织机构树
      active: { type: String, default: 'month' }, // 初始进入时，tab页活动页
      sizeOptions: { type: Array, default: null }, // 第二个下拉坑的选项，默认值前5名
      tabsShow: {
        type: Object,
        default: () => {
          return {
            day: true,
            month: true,
            quarter: true,
            year: true,
            auto: true
          }
        }
      }, // 展示tabs
      isSelectUserRadio: { type: Boolean, default: false }, // 人员单选
      isShowYear: { type: Boolean, default: false }, // 日期类型是否为年
      title: { type: String, default: '参与者' }, // 选择人员的标题
      remarks: { type: String, default: '' },
      setWidth: { type: String, default: '' }
    },
    data() {
      return {
        activeName: 'month',
        dateTimeDay: new Date(),
        dateTimeMonth: new Date(),
        dateTimeQuater: new Date(),
        dateTimeYear: new Date(),
        dateTimeAuto: [new Date(), new Date()],
        value: '5',
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', [new Date(), new Date()])
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const end = new Date()
                const start = new Date(end.getTime() - 24 * 3600 * 1000)
                picker.$emit('pick', [start, start])
              }
            },
            {
              text: '近7天',
              onClick(picker) {
                const end = new Date()
                const start = new Date(end.getTime() - 7 * 24 * 3600 * 1000)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '近30天',
              onClick(picker) {
                const end = new Date()
                const start = new Date(end.getTime() - 30 * 24 * 3600 * 1000)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '本周',
              onClick(picker) {
                const current = new Date()
                const currentWeek = current.getDay()
                const start = new Date(
                  current.getTime() - (currentWeek - 1) * 24 * 3600 * 1000
                )
                const end = new Date(
                  current.getTime() + (7 - currentWeek) * 24 * 3600 * 1000
                )
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '本月',
              onClick(picker) {
                const current = new Date()
                const year = current.getFullYear()
                const month = current.getMonth() + 1
                const day = '1'
                let endDays = 30
                if (
                  month === 1 ||
                  month === 3 ||
                  month === 5 ||
                  month === 7 ||
                  month === 8 ||
                  month === 10 ||
                  month === 12
                ) {
                  endDays = 31
                } else if (month === 2) {
                  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                    endDays = 29
                  } else {
                    endDays = 28
                  }
                }
                const start = new Date(`${year}-${month}-${day}`)
                const end = new Date(`${year}-${month}-${endDays}`)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '上月',
              onClick(picker) {
                const date = new Date()
                let year = date.getFullYear()
                let month = date.getMonth()
                if (month === 0) {
                  month = 12
                  year = year - 1
                }
                let startDay = 1
                let endDays = 30
                if (
                  month === 1 ||
                  month === 3 ||
                  month === 5 ||
                  month === 7 ||
                  month === 8 ||
                  month === 10 ||
                  month === 12
                ) {
                  endDays = 31
                } else if (month === 2) {
                  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                    endDays = 29
                  } else {
                    endDays = 28
                  }
                }
                picker.$emit('pick', [
                  new Date(`${year}-${month}-${startDay}`),
                  new Date(`${year}-${month}-${endDays}`)
                ])
              }
            }
          ]
        },
        quarterOptions: [
          {
            value: '0',
            label: '第一季度'
          },
          {
            value: '1',
            label: '第二季度'
          },
          {
            value: '2',
            label: '第三季度'
          },
          {
            value: '3',
            label: '第四季度'
          }
        ],
        quarter: (() => {
          let month = new Date().getMonth() + 1
          if (month < 4) {
            return '0'
          } else if (month < 7) {
            return '1'
          } else if (month < 10) {
            return '2'
          } else {
            return '3'
          }
        })(),
        options: [],
        checked: false,
        users: [{ id: this.$getHussarUserId(this), label: this.$store.state.user.name }]
      }
    },
    watch: {
      activeName: {
        handler() {
          this.queryType()
        },
        deep: true
      },
      users() {
        this.queryType()
      }
    },
    mounted() {
      // const this = this;
      this.activeName = this.active
      this.initSelections()
    },
    methods: {
      updateChecked(value) {
        this.checked = value
        this.$emit('isShowList', value)
      },
      clearData() {
        if (this.activeName === 'day') {
          this.dateTimeDay = new Date()
        } else if (this.activeName === 'month') {
          this.dateTimeMonth = new Date()
        } else if (this.activeName === 'quarter') {
          this.dateTimeQuater = new Date()
          const month = this.dateTimeQuater.getMonth() + 1
          if (month < 4) {
            this.quarter = '0'
          } else if (month < 7) {
            this.quarter = '1'
          } else if (month < 10) {
            this.quarter = '2'
          } else {
            this.quarter = '3'
          }
        } else if (this.activeName === 'year') {
          this.dateTimeYear = new Date()
        } else if (this.activeName === 'auto') {
          this.dateTimeAuto = [new Date(), new Date()]
        }
        this.value = '5'
        this.users = [
          {
            id: this.$getHussarUserId(this),
            label: this.$store.state.user.name
          }
        ]
        this.queryType()
      },
      queryType() {
        let params = {}
        params.statisType = this.activeName
        if (this.activeName === 'day') {
          params.choiceTime = `${this.dateTimeDay.getFullYear()}-${
            this.dateTimeDay.getMonth() + 1
          }-${this.dateTimeDay.getDate()}`
        } else if (this.activeName === 'month') {
          params.choiceTime = `${this.dateTimeMonth.getFullYear()}-${
            this.dateTimeMonth.getMonth() + 1
          }`
        } else if (this.activeName === 'quarter') {
          params.choiceTime = `${this.dateTimeQuater.getFullYear()}`
        } else if (this.activeName === 'year') {
          params.choiceTime = `${this.dateTimeYear.getFullYear()}`
        } else if (
          this.activeName === 'auto' &&
          this.dateTimeAuto &&
          this.dateTimeAuto.length === 2
        ) {
          params.choiceTime = {
            startTime: `${this.dateTimeAuto[0].getFullYear()}-${
              this.dateTimeAuto[0].getMonth() + 1
            }-${this.dateTimeAuto[0].getDate()}`,
            endTime: `${this.dateTimeAuto[1].getFullYear()}-${
              this.dateTimeAuto[1].getMonth() + 1
            }-${this.dateTimeAuto[1].getDate()}`
          }
        }
        params.size = this.value
        params.quarterQuarter = this.quarter
        params.userIds = this.users.map(item => item.id).join(',')
        this.$emit('getQueryList', params)
      },
      initSelections() {
        // const this = this;
        let params = {
          code: 'statistics_top'
        }
        getTopSelections(params)
          .then(res => {
            if (res && res.code && res.code === 10000) {
              this.options = res.data || []
            } else {
              this.$message({
                message: '搜索组织机构失败',
                type: 'error'
              })
            }
          })
          .catch(() => {
            this.$message({
              message: '获取字典数据异常',
              type: 'error'
            })
          })
      }
    }
  }
</script>


<style scoped lang="scss">

  .table-filter {
    width: 100%;
    height: 40px;
    display: flex;
    position: relative;
  }

  .search-input {
    margin-left: 10px;
  }

  .table-filter .el-select.search-input,
  .table-filter .search-input.el-date-editor.el-input,
  .table-filter .search-input.el-date-editor.el-input__inner {
    width: 200px;
  }

  .table-filter .search-input ::v-deep .el-input__icon {
    line-height: 32px;
    height: 32px;
  }

  .table-filter .el-date-editor ::v-deep .el-input__prefix {
    left: 170px;
  }

  .view-list {
    position: absolute;
    right: 0;
    top: 3px;
  }

  .table-filter .el-date-editor.search-input.el-date-editor--daterange {
    width: 300px;
    height: 32px;
    margin-right: 8px;
  }

  .tabs ::v-deep .el-tabs__header.is-top {
    border-bottom: 1px solid #eaeaea;
    padding: 0 0 0 15px;
  }

  .tabs ::v-deep .el-tabs__item {
    color: #545672;
  }

  .tabs ::v-deep .el-tabs__item:hover,
  .tabs ::v-deep .el-tabs__item.is-active {
    color: #2794f8;
  }

  .tabs ::v-deep .el-tabs__nav-wrap::after {
    height: 0;
  }

  .tabs ::v-deep .el-tabs__nav {
    width: 100%;
  }

  .tabs ::v-deep .el-tabs__item.is-disabled {
    color: #a7a7a7 !important;
    text-align: right;
  }

  .tabs ::v-deep .el-tabs__item.is-disabled:hover {
    color: #a7a7a7 !important;
  }

  .tab-disabled ::v-deep.el-tabs__item.is-disabled {
    margin-left: var(--margin-left);
  }

  .btn-search {
    margin-left: 10px;
  }
</style>
<style lang="scss" scoped>
  ::v-deep .datapicktabs .el-tabs__item.is-active::before {
    height: 0px !important;
  }

  ::v-deep .datapicktabs .el-tabs__active-bar {
    background-color: #079b9f;
  }

  ::v-deep .lcdp-date-pop.bpa-tabs-auto-time .el-picker-panel__shortcut {
    height: 24px;
    background: #f2f3f5;
    margin: 10px 8px;
    width: calc(100% - 16px);
    text-align: center;
    padding: 0;
    line-height: 24px;
  }

  ::v-deep .lcdp-date-pop.bpa-tabs-auto-time .el-date-table td.end-date.today span {
    color: #fff !important;
  }

  ::v-deep .lcdp-date-pop.bpa-tabs-auto-time .el-date-table td,
  .lcdp-date-pop.bpa-tabs-auto-time .el-date-table td div {
    height: 24px;
  }

  ::v-deep .lcdp-date-pop.bpa-tabs-auto-time .el-date-range-picker__content {
    padding-top: 0;
  }

  ::v-deep .lcdp-date-pop.bpa-tabs-auto-time .el-date-range-picker__header {
    height: 40px;
    line-height: 40px;
  }

  ::v-deep .lcdp-date-pop.bpa-tabs-auto-time .el-date-table th {
    line-height: 24px;
  }

  ::v-deep .lcdp-date-pop.bpa-tabs-auto-time .el-picker-panel__icon-btn {
    margin-top: 16px;
  }
</style>
