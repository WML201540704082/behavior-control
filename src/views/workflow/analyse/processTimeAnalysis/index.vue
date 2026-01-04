<!--流程耗时分析-->

<template>
    <div class="app-container" style="padding: 0px;">
        <el-card style="height:100%;">
            <div id="processOverviewContent" class="processAnalysisContainer">
                <div class="pageTop">
                    <Tabs
                        :active="choiceTime.statisType"
                        :tabs-show="tabsShow"
                        :show-top-few="true"
                        :remarks="remarks"
                        :set-width="'calc(100% - 577px)'"
                        :size-options="options"
                        @isShowList="isShowList"
                        @getQueryList="getQueryList"
                    />
                </div>
                <div class="pageBottom">
                    <div
                        v-show="!isList && (doughnutData.length !== 0 || !isGetResult)"
                        ref="processCharts"
                        style="width: 100%; height: 100%"
                    />
                    <div v-show="isList" style="width: 100%; height: 100%">
                        <el-table
                            v-loading="isLoading"
                            :data="consumeTimeListData"
                            width="100%"
                            height="100%"
                            class="checkedProcessTable lcdp-table"
                            stripe
                            @cell-click="isDialogTable"
                        >
                            <el-table-column
                                type="index"
                                label="序号"
                                align="center"
                                width="150"
                            />
                            <el-table-column
                                key="1"
                                label="流程名称"
                                align="left"
                                prop="processName"
                            />
                            <el-table-column
                                key="2"
                                label="平均耗时(小时)"
                                prop="processDate"
                            />
                        </el-table>
                    </div>
                    <div
                        v-show="isGetResult && !isList && doughnutData.length === 0"
                        class="empty-text"
                    >
                        暂无数据
                    </div>
                </div>
                <el-dialog
                    :title="`${processName}的耗时统计`"
                    :visible.sync="dialogTableVisible"
                    :close-on-click-modal="false"
                    class="lcdp-dialog"
                >
                    <el-table
                        v-loading="loading"
                        :data="consumeTimeByKeyListData"
                        class="taskStatusList lcdp-table"
                        width="100%"
                        height="400px"
                        stripe
                    >
                        <el-table-column
                            type="index"
                            label="序号"
                            align="center"
                            width="120"
                        />
                        <el-table-column
                            key="1"
                            property="taskDefinitionName"
                            label="流程节点名称"
                        />
                        <el-table-column
                            key="2"
                            property="nodeTime"
                            label="平均耗时(小时)"
                        />
                    </el-table>
                    <el-pagination
                        style="margin-top: 20px"
                        :current-page="current"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pageSize"
                        :total="total"
                        class="lcdp-pagination"
                        layout="total, sizes, prev, pager, next"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    import Tabs from '../../components/dataPickerTabs/index.vue';


    import {
        queryProcessConsumeTime,
        queryNodeConsumeTimeByProcessKey
    } from '@/api/workflow/analyse/processTimeAnalysis';

    import * as _ from 'lodash';

    let resizeObserve = null;

    export default {
        name: 'ProcessTimeAnalysis',
        components: {Tabs},
        data() {
            return {
                tabsShow: {
                    day: false,
                    month: true,
                    quarter: true,
                    year: true,
                    auto: false
                },
                options: [
                    {
                        value: '5',
                        label: '前5名'
                    },
                    {
                        value: '10',
                        label: '前10名'
                    },
                    {
                        value: '15',
                        label: '前15名'
                    },
                    {
                        value: '20',
                        label: '前20名'
                    }
                ],
                checked: false,
                isList: false, // 是否展示列表
                myChart: null, // 环图
                doughnutData: [], // 环图数据
                consumeTimeListData: [], // 消耗时间列表数据
                consumeTimeByKeyListData: [], //下钻列表数据
                copyData: [], // 下钻列表数据备份
                listParam: {}, // 下钻列表参数
                dialogTableVisible: false, // 下钻列表是否弹出
                searchContent: '', // 搜索内容
                loading: false,
                current: 1,
                pageSize: 10,
                total: 10,
                // 查询条件
                choiceTime: {
                    statisType: 'month', // 统计类型
                    autoStartTime: null, // 自定义开始时间
                    autoEndTime: null, // 自定义结束时间
                    dayTime: null, // 按天统计时间
                    monthMonth: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`, // 按月统计的月份值 2022-05
                    quarterYear: null, // 按季度统计的年份值
                    quarterQuarter: null, // 按季度统计的季度值
                    yearYear: null, // 按年份统计的年份值
                    size: '5'
                },
                isGetResult: false, // 是否获取到查询结果
                isLoading: false,
                processName: '', // 流程名称
                remarks: '统计特定时间内平均耗时排行前N的流程，对流程进行监控。'
            };
        },
        computed: {
            doughnutOption() {
                // const this = this;
                const data = [];
                this.doughnutData.forEach(item => {
                    const obj = {};
                    obj.value = item.processDate;
                    obj.name = item.processName;
                    obj.processKey = item.processKey;
                    data.push(obj);
                });
                return {
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
                        borderWidth: 0,
                        backgroundColor: 'rgba(111, 111, 111, 1)',
                        textStyle: {
                            color: '#fff',
                            fontWeight: '400'
                        },
                        confine: true
                    },
                    legend: {
                        type: 'scroll',
                        top: '16',
                        right: 0,
                        icon: 'circle',
                        itemWidth: 9,
                        itemHeight: 9,
                        textStyle: {
                            color: '#8C8C8C'
                        },
                        padding: 0,
                        formatter: function (name) {
                            return echarts.format.truncateText(name, 100, '12px', '...');
                        },
                        tooltip: {
                            show: false
                        }
                    },
                    series: [
                        {
                            type: 'pie',
                            minAngle: 3,
                            radius: ['35%', '55%'],
                            avoidLabelOverlap: true,
                            itemStyle: {
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            top: 36,
                            label: {
                                show: true,
                                color: '#545672',
                                formatter: '{b}\n{c}h',
                                padding: [5, 5, 5, 5],
                                lineHeight: 17
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
                            data
                        }
                    ]
                };
            }
        },
        watch: {
            doughnutOption() {
                this.drawDoughnut();
            }
        },
        mounted() {
            // const this = this;
            this.doughnutDataLoad(this.choiceTime); //加载环图数据并重绘环图
            this.consumeTimeListLoad(this.choiceTime); //加载列表数据
            resizeObserve = new ResizeObserver(() => {
                if (this.myChart) this.myChart.resize();
            });
            resizeObserve.observe(document.getElementById('processOverviewContent'));
        },
        beforeUnmount() {
            resizeObserve.disconnect();
        },
        methods: {
            // 每页显示几条数据
            handleSizeChange(value) {
                // const this = this;
                this.pageSize = value;
                this.loading = true;
                this.consumeTimeListByKeyLoad(
                    this.listParam,
                    this.pageSize,
                    this.current
                );
            },

            // 列表页码切换
            handleCurrentChange(value) {
                // const this = this;
                this.current = value;
                this.loading = true;
                this.consumeTimeListByKeyLoad(
                    this.listParam,
                    this.pageSize,
                    this.current
                );
            },
            isShowList(value) {
                // console.log(value);
                // const this = this;
                this.isList = value;
                this.$nextTick(() => {
                    this.drawDoughnut();
                });
            },
            // 按时间查询
            getQueryList(value) {
                // const this = this;
                this.choiceTime = {};
                if (this.doughnutData.length === 0) {
                    this.doughnutData = [];
                }
                this.isGetResult = false;
                this.choiceTime.statisType = value.statisType;
                if (value.statisType === 'day') {
                    this.choiceTime.dayTime = value.choiceTime;
                } else if (value.statisType === 'month') {
                    this.choiceTime.monthMonth = value.choiceTime;
                } else if (value.statisType === 'quarter') {
                    this.choiceTime.quarterYear = value.choiceTime;
                    this.choiceTime.quarterQuarter = value.quarterQuarter;
                } else if (value.statisType === 'year') {
                    this.choiceTime.yearYear = value.choiceTime;
                } else if (value.statisType === 'auto') {
                    this.choiceTime.autoStartTime = value.choiceTime.startTime;
                    this.choiceTime.autoEndTime = value.choiceTime.endTime;
                }
                this.consumeTimeListLoad(this.choiceTime);
                this.doughnutDataLoad(this.choiceTime);
            },
            // 数据下钻打开弹窗
            isDialogTable(row, column) {
                // const this = this;
                this.searchContent = '';
                this.listParam = {};
                this.total = 0;
                if (column.label !== '流程名称' && column.label !== '序号') {
                    this.dialogTableVisible = !this.dialogTableVisible;
                }
                this.listParam = {
                    processKey: row.processKey
                };
                this.processName = row.processName;
                this.loading = true;
                this.pageSize = 10;
                this.current = 1;
                this.consumeTimeListByKeyLoad(
                    this.listParam,
                    this.pageSize,
                    this.current
                );
            },
            // 绘制环图
            drawDoughnut() {
                // const this = this;
                if (this.myChart) {
                    this.myChart.dispose();
                    this.myChart = null;
                }
                if (
                    !this.$refs.processCharts ||
                    this.$refs.processCharts.clientWidth === 0
                )
                    return;
                // 基于准备好的dom，初始化echarts实例
                this.myChart = echarts.init(this.$refs.processCharts);
                this.myChart.setOption(this.doughnutOption);
                this.myChart.off('click');
                this.myChart.on('click', function (param) {
                    this.searchContent = '';
                    this.listParam = {};
                    this.total = 0;
                    this.dialogTableVisible = !this.dialogTableVisible;
                    this.listParam = {
                        processKey: param.data.processKey
                    };
                    this.processName = param.data.name;
                    this.loading = true;
                    this.pageSize = 10;
                    this.current = 1;
                    this.consumeTimeListByKeyLoad(
                        this.listParam,
                        this.pageSize,
                        this.current
                    );
                });
            },
            // 流程消耗时间环图查询
            doughnutDataLoad(value) {
                // const this = this;
                const param = _.cloneDeep(value);
                queryProcessConsumeTime(param)
                    .then(res => {
                        if (res.code === 10000 && res.data && res.data.records.length > 0) {
                            this.doughnutData = res.data.records;
                            this.isGetResult = false;
                            this.$nextTick(() => {
                                this.drawDoughnut();
                            });
                        } else {
                            this.doughnutData = [];
                            this.isGetResult = true;
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '数据请求失败',
                            type: 'error'
                        });
                    });
            },
            // 流程消耗时间列表查询
            consumeTimeListLoad(value) {
                // const this = this;
                this.isLoading = true;
                const param = _.cloneDeep(value);
                queryProcessConsumeTime(param)
                    .then(res => {
                        if (res.code === 10000) {
                            this.isLoading = false;
                            this.consumeTimeListData = res.data.records;
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '数据请求失败',
                            type: 'error'
                        });
                    });
            },
            // 下钻流程消耗时间列表查询
            consumeTimeListByKeyLoad(value, size, current) {
                // const this = this;
                const param = _.cloneDeep(this.choiceTime);
                param.current = current;
                param.size = size;
                param.processKey = value.processKey;
                queryNodeConsumeTimeByProcessKey(param)
                    .then(res => {
                        if (res.code === 10000) {
                            this.consumeTimeByKeyListData = res.data.records;
                            this.copyData = res.data.records;
                            this.total = res.data.total;
                            this.loading = false;
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '数据请求失败',
                            type: 'error'
                        });
                    });
            }
        }
    };
</script>

<style scoped>
  /deep/ .el-card__body{
    height: 100%;
  }
    .processAnalysisContainer {
        display: flex;
        flex-direction: column;
        padding: 16px 24px 46px 24px;
        height: calc(100vh - 200px);
    }

    .pageTop {
        width: 100%;
        padding-left: 16px;
    }

    .pageBottom {
        width: 100%;
        height: calc(100% - 95px);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .lcdp-dialog ::v-deep .el-table--scrollable-y .el-table__body-wrapper:hover {
        overflow-x: hidden !important;
    }

    .checkedProcessTable ::v-deep .el-table__body-wrapper .cell {
        color: #1b7cef;
        cursor: pointer;
    }

    .checkedProcessTable ::v-deep .is-center .cell,
    .checkedProcessTable ::v-deep .is-left .cell {
        color: #333651;
        cursor: auto;
    }

    .lcdp-dialog ::v-deep .el-dialog {
        width: 60%;
        height: 60%;
        max-height: 700px;
    }

    .lcdp-dialog ::v-deep .el-dialog__title {
        color: #333651;
    }

    .lcdp-dialog ::v-deep .el-dialog__body {
        padding: 21px 24px 12px 24px;
        width: 100%;
        height: calc(100% - 42px);
    }

    .taskStatusList ::v-deep .is-center .cell {
        position: relative;
        left: -24px;
    }

    .taskStatusList ::v-deep .cell {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 14px;
        color: #333651;
    }

    .checkedProcessTable ::v-deep .cell {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 14px;
        color: #333651;
    }

    .empty-text {
        line-height: 60px;
        color: #909399;
    }

    .lcdp-dialog ::v-deep .el-dialog .el-loading-mask {
        height: 100% !important;
    }
</style>
