<!--流程统计分析-->
<template>
    <div class="app-container" style="height: 100%;padding: 0px;">
        <el-card class="box-card" style="height: 100%;">
            <div id="processOverviewContent" class="processAnalysisContainer">
                <div class="pageLeft" @mouseleave="mouseLeave">
                    <processList
                        @input="getProcessKey"
                        @processListSize="processListSize"
                    />
                </div>
                <div id="rightEchart" class="pageRight">
                    <div class="pageTop">
                        <Tabs
                            :show-top-few="false"
                            :remarks="remarks"
                            :set-width="'calc(100% - 774px)'"
                            @isShowList="isShowList"
                            @getQueryList="getQueryList"
                        />
                        <div
                            v-show="
                !isList &&
                (showBar ? barData.length !== 0 : lineData.length !== 0)
              "
                            class="barOrLine"
                        >
                            <div
                                :class="showBar ? 'change-echarts' : 'change-echarts1'"
                                @click="changeEChart('bar')"
                            >
                                柱图
                            </div>
                            <div
                                :class="showBar ? 'change-echarts1' : 'change-echarts'"
                                @click="changeEChart('line')"
                            >
                                折线
                            </div>
                        </div>
                    </div>
                    <div class="pageBottom">
                        <div
                            v-show="
                !isList &&
                (showBar ? barData.length !== 0 : lineData.length !== 0)
              "
                            ref="statisticalCharts"
                            style="width: 100%; height: 100%; overflow: hidden"
                        ></div>
                        <div v-show="isList" style="width: 100%; height: 100%">
                            <el-table
                                stripe
                                v-loading="isLoading"
                                ref="table"
                                :data="listData"
                                width="100%"
                                height="calc(100vh - 340px)"
                                class="checkedProcessTable lcdp-table"
                                show-summary
                                @cell-click="isDialogTable"
                            >
                                <el-table-column
                                    type="index"
                                    label="序号"
                                    align="center"
                                    width="120"
                                >
                                    <template #dafault="scope"
                                    >{{ (listCurrent - 1) * size + scope.$index + 1 }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    key="1"
                                    label="流程名称"
                                    prop="processName"
                                    align="left"
                                />
                                <el-table-column key="2" label="实例数" prop="instanceCount">
                                    <template #header>
                                        <span>实例数</span>
                                        <el-tooltip content="已办任务涉及的流程实例数量"
                                        ><i class="font_family icon-qingqibing_xinxi"/>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column key="3" label="已办数" prop="taskCount">
                                    <template #header>
                                        <span>已办数</span>
                                        <el-tooltip content="已办理的任务数量"
                                        ><i class="font_family icon-qingqibing_xinxi"/>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination
                                style="text-align: right;margin-top: 10px"
                                background
                                :current-page="listCurrent"
                                :page-sizes="[10, 20, 30, 40]"
                                :page-size="size"
                                :total="listTotal"

                                layout="total, sizes, prev, pager, next"
                                @size-change="handleListSizeChange"
                                @current-change="handleListCurrentChange"
                            />
                        </div>
                        <div
                            v-show="
                !isList &&
                (showBar ? barData.length === 0 : lineData.length === 0)
              "
                            class="empty-text"
                        >
                            暂无数据
                        </div>
                    </div>
                </div>
                <el-dialog
                  :visible.sync="dialogTableVisible"
                    :close-on-click-modal="false"
                    class="lcdp-dialog"
                >
                    <template #title>
                        <div class="header-title">
                            <span class="titleName">流程名称：{{ processName }}</span>
                            <span class="titleName"
                            >&nbsp;&nbsp;{{ instanceOrTask }}：{{
                  instanceOrTaskCount
                }}</span
                            >
                        </div>
                    </template>

                    <el-table
                        v-loading="loading"
                        v-show="!isTask"
                        :data="drillDownListData"
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
                        >
                        </el-table-column>
                        <el-table-column
                            key="1"
                            property="processInsId"
                            label="流程实例ID"
                        />
                        <el-table-column key="2" property="startTime" label="开始时间"/>
                        <el-table-column
                            key="3"
                            property="endTime"
                            label="结束时间"
                            width="200"
                        />
                    </el-table>
                    <el-table
                        v-loading="loading"
                        v-show="isTask"
                        :data="drillDownTaskListData"
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
                        >
                        </el-table-column>
                        <el-table-column
                            key="1"
                            property="taskDefinitionName"
                            label="节点名称"
                        />
                        <el-table-column key="2" property="taskCount" label="已办数"/>
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


    import processList from '../../components/processList/index.vue';

    import {
        queryProcessStatisticForChart,
        queryProcessStatisticForList,
        queryParticipateProcessNumberDrill,
        queryParticipateTaskNumberDrill
    } from '@/api/workflow/analyse/processStatisticalAnalysis';

    import * as _ from 'lodash';

    let resizeObserve = null;

    export default {
        name: 'ProcessStatisticalAnalysis',
        components: {Tabs, processList},
        data() {
            return {
                myChart: null, // 柱状图、折线图
                isList: false, // 展示列表
                showBar: true, // 柱状图折线图切换
                barData: [], // 柱状图数据
                lineData: [], // 折线图数据
                listData: [], // 列表数据
                drillDownListData: [], //实例数下钻列表数据
                drillDownTaskListData: [], // 已办数下钻列表查询
                dialogTableVisible: false, // 下钻列表是否弹出
                listParam: {}, // 下钻列表参数
                copyData: [], // 下钻列表数据备份
                processKeys: '', // 全部流程key
                // 查询条件
                choiceTime: {
                    statisType: 'month', // 统计类型
                    autoStartTime: null, // 自定义开始时间
                    autoEndTime: null, // 自定义结束时间
                    dayTime: null, // 按天统计时间
                    monthMonth: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`, // 按月统计的月份值 2022-05
                    quarterYear: null, // 按季度统计的年份值
                    quarterQuarter: null, // 按季度统计的季度值
                    yearYear: null // 按年份统计的年份值
                },
                searchContent: '', // 搜索内容
                loading: false,
                current: 1, // 当前页
                pageSize: 10, // 每页显示条数
                total: 100,
                isTask: false,
                isLoading: false,
                processName: '', // 流程名称
                instanceOrTask: '', // 实例或操作
                instanceOrTaskCount: 0, // 实例或操作之和
                listCurrent: 1, // 当前页
                size: 10, // 每页显示条数
                listTotal: 0,
                isChange: true,
                remarks: '统计特定时间内已办任务和涉及的流程实例数量，对流程进行监控。'
            };
        },
        computed: {
            barOption() {
                // const this = this;
                const taskCount = []; // 已办数量
                const instanceCount = []; // 实例数量
                const processName = []; // 流程名称
                this.barData.forEach(item => {
                    taskCount.push({value: item.taskCount, processKey: item.processKey});
                    instanceCount.push({
                        value: item.instanceCount,
                        processKey: item.processKey
                    });
                    processName.push(item.processName);
                });
                let isShow = false;
                let end = 100;
                if (this.barData.length > 8) {
                    isShow = true;
                    end = (8 / this.barData.length) * 100;
                }
                return {
                    legend: {
                        type: 'scroll',
                        right: 0,
                        data: ['实例数', '已办数'],
                        icon: 'rect',
                        itemWidth: 9,
                        itemHeight: 9,
                        textStyle: {
                            color: '#8C8C8C'
                        },
                        tooltip: {
                            show: true,
                            position: function (pos, params, dom, rect, size) {
                                // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                                var obj = {top: 24};
                                obj[['right', 'left'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                                return obj;
                            },
                            backgroundColor: '#303133',
                            textStyle: {
                                fontSize: 12,
                                color: '#ffffff'
                            },
                            formatter: function (params) {
                                if (params.name === '实例数') {
                                    return '已办任务涉及的流程实例数量';
                                } else {
                                    return '已办理的任务数量';
                                }
                            }
                        }
                    },
                    dataZoom: [
                        {
                            id: 'bar',
                            type: 'slider',
                            show: isShow,
                            backgroundColor: '#ffffff',
                            xAxisIndex: [0],
                            height: '8',
                            width: 'auto',
                            top: 'auto',
                            bottom: 10,
                            left: '25',
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
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        backgroundColor: 'rgba(111, 111, 111, 1)',
                        textStyle: {
                            color: '#fff',
                            fontWeight: '400',
                            align: 'left'
                        },
                        axisPointer: {
                            type: 'none'
                        },
                        borderWidth: 0
                    },
                    color: ['rgba(82,172,255,0.85)', 'rgba(122,200,255,0.85)'],
                    grid: {
                        left: '5',
                        right: '20',
                        bottom: 30,
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: processName,
                        axisTick: {
                            length: 0
                        },
                        axisLabel: {
                            color: 'rgba(0, 0, 0, 0.45)',
                            interval: 0,
                            width: 100,
                            overflow: 'truncate',
                            ellipsis: '...'
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(0, 0, 0, 0.45)'
                            }
                        }
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            length: 0
                        },
                        axisLabel: {
                            color: 'rgba(0, 0, 0, 0.45)'
                        },
                        minInterval: 1,
                        max: function (value) {
                            if (value.max === 0) return 5;
                        }
                    },
                    series: [
                        {
                            name: '实例数',
                            type: 'bar',
                            barWidth: '32',
                            barGap: '10%',
                            data: instanceCount
                        },
                        {
                            name: '已办数',
                            type: 'bar',
                            barWidth: '32',
                            barGap: '10%',
                            data: taskCount
                        }
                    ]
                };
            },
            lineOption() {
                // const this = this;
                const series = []; // 已办数量量
                const processName = []; // 流程名称
                this.lineData.forEach(item => {
                    const data = {
                        name: item.processName,
                        type: 'line',
                        data: [
                            {value: item.instanceCount, processKey: item.processKey},
                            {value: item.taskCount, processKey: item.processKey}
                        ]
                    };
                    processName.push(item.processName);
                    series.push(data);
                });
                return {
                    color: ['#5B8FF9', '#5AD8A6', '#FFBB00', '#EE7B4E'],
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
                        borderWidth: 0,
                        enterable: true, //滚动条
                        extraCssText: 'max-width:60%;max-height:83%; overflow: auto; ', //滚动条
                        position: function (point, params, dom, rect, size) {
                            var x = 0; // x坐标位置
                            var y = 0; // y坐标位置
                            // 当前鼠标位置
                            var pointX = point[0];
                            var pointY = point[1];
                            // 提示框大小
                            var boxWidth = size.contentSize[0];
                            var boxHeight = size.contentSize[1];
                            if (boxWidth > pointX) {
                                x = 5;
                            } else {
                                // 左边放的下
                                x = pointX - boxWidth;
                            }
                            if (boxHeight > pointY) {
                                y = 5;
                            } else {
                                // 上边放得下
                                y = pointY - boxHeight;
                            }
                            return [x, y];
                        }
                    },
                    legend: {
                        type: 'scroll',
                        data: processName,
                        icon: 'rect',
                        itemWidth: 12,
                        itemHeight: 3,
                        right: 0,
                        top: 3,
                        width: '80%',
                        itemGap: 12, //图例之前的距离
                        textStyle: {
                            color: '#8C8C8C'
                        },
                        formatter: function (name) {
                            return echarts.format.truncateText(name, 100, '12px', '...');
                        },
                        tooltip: {
                            show: false
                        }
                    },
                    grid: {
                        left: '5',
                        right: '20',
                        bottom: 30,
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisTick: {
                            length: 0
                        },
                        axisLabel: {
                            color: 'rgba(0, 0, 0, 0.45)'
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(0, 0, 0, 0.45)'
                            }
                        },
                        data: ['实例数', '已办数']
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            length: 0
                        },
                        axisLabel: {
                            color: 'rgba(0, 0, 0, 0.45)'
                        },
                        minInterval: 1,
                        max: function (value) {
                            if (value.max === 0) return 5;
                        }
                    },
                    series
                };
            }
        },
        watch: {
            barOption() {
                this.drawBar();
            },
            lineOption() {
                this.drawLine();
            }
        },
        mounted() {
            resizeObserve = new ResizeObserver(() => {
                if (this.myChart && this.isChange) this.myChart.resize();
            });
            resizeObserve.observe(document.getElementById('processOverviewContent'));
            resizeObserve.observe(document.getElementById('rightEchart'));
        },
        beforeUnmount() {
            resizeObserve.disconnect();
        },
        updated() {
            this.$nextTick(() => {
                this.$refs.table.doLayout();
            });
        },
        methods: {
            mouseLeave() {
                if (document.getElementsByClassName('over-tree').length > 0) {
                    document
                        .getElementsByClassName('pageLeft')[0]
                        .classList.remove('over-tree');
                    document
                        .getElementsByClassName('pageLeft')[0]
                        .classList.add('leave-tree');
                }
            },
            // 每页显示几条数据
            handleListSizeChange(value) {
                // const this = this;
                this.size = value;
                this.statisticalListLoad(value, this.listCurrent);
            },
            // 列表页码切换
            handleListCurrentChange(value) {
                // const this = this;
                this.listCurrent = value;
                this.statisticalListLoad(this.size, value);
            },

            processListSize(value) {
                // const this = this;
                this.isChange = value;
                this.$nextTick(() => {
                    if (this.showBar) {
                        this.drawBar();
                    } else {
                        this.drawLine();
                    }
                });
            },

            // 获取左侧流程key
            getProcessKey(value) {
                // const this = this;
                this.processKeys = value;
                this.statisticalListLoad(this.size, this.listCurrent);
                if (this.showBar) {
                    this.statisticalBarLoad();
                } else {
                    this.statisticalLineLoad();
                }
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
                this.instanceOrTask = column.label;
                this.pageSize = 10;
                this.current = 1;
                if (column.label === '实例数') {
                    this.isTask = false;
                    this.drillDownListLoad(this.listParam, this.pageSize, this.current);
                    this.instanceOrTaskCount = row.instanceCount;
                } else if (column.label === '已办数') {
                    this.isTask = true;
                    this.drillDownTaskListLoad(this.listParam, this.pageSize, this.current);
                    this.instanceOrTaskCount = row.taskCount;
                }
            },
            // 每页显示几条数据
            handleSizeChange(value) {
                // const this = this;
                this.pageSize = value;
                if (this.isTask) {
                    this.drillDownTaskListLoad(this.listParam, this.pageSize, this.current);
                } else {
                    this.drillDownListLoad(this.listParam, this.pageSize, this.current);
                }
            },
            // 列表页码切换
            handleCurrentChange(value) {
                // const this = this;
                this.current = value;
                if (this.isTask) {
                    this.drillDownTaskListLoad(this.listParam, this.pageSize, this.current);
                } else {
                    this.drillDownListLoad(this.listParam, this.pageSize, this.current);
                }
            },
            // 按时间查询
            getQueryList(value) {
                // const this = this;
                this.choiceTime = {};
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
                if (!this.processKeys) {
                     this.$message({
                        message: '至少选择一条流程',
                        type: 'warning'
                    });
                    return;
                }
                this.statisticalListLoad(this.size, this.listCurrent);
                if (this.showBar) {
                    this.statisticalBarLoad();
                } else {
                    this.statisticalLineLoad();
                }
            },
            // 查看列表
            isShowList(value) {
                // const this = this;
                this.isList = value;
                if (!value) {
                    if (this.showBar) {
                        this.$nextTick(() => {
                            this.drawBar();
                        });
                    } else {
                        this.$nextTick(() => {
                            this.drawLine();
                        });
                    }
                }
            },
            // 绘制柱状图
            drawBar() {
                // const this = this;
                if (this.myChart) {
                    this.myChart.dispose();
                    this.myChart = null;
                }
                if (
                    !this.$refs.statisticalCharts ||
                    this.$refs.statisticalCharts.clientWidth === 0
                )
                    return;
                // 基于准备好的dom，初始化echarts实例
                this.myChart = echarts.init(this.$refs.statisticalCharts);
                this.myChart.setOption(this.barOption);
                this.myChart.off('click');
                let that = this;
                that.myChart.on('click', function (param) {
                    that.searchContent = '';
                    that.listParam = {};
                    that.total = 0;
                    that.dialogTableVisible = !that.dialogTableVisible;
                    that.listParam = {
                        processKey: param.data.processKey
                    };
                    that.processName = param.name;
                    that.instanceOrTask = param.seriesName;
                    that.instanceOrTaskCount = param.data.value;
                    that.pageSize = 10;
                    that.current = 1;
                    if (param.seriesName === '实例数') {
                        that.isTask = false;
                        that.drillDownListLoad(that.listParam, that.pageSize, that.current);
                    } else if (param.seriesName === '已办数') {
                        that.isTask = true;
                        that.drillDownTaskListLoad(that.listParam, that.pageSize, that.current);
                    }
                });
            },
            // 绘制折线图
            drawLine() {
                // const this = this;
                if (this.myChart) {
                    this.myChart.dispose();
                    this.myChart = null;
                }
                if (
                    !this.$refs.statisticalCharts ||
                    this.$refs.statisticalCharts.clientWidth === 0
                )
                    return;
                // 基于准备好的dom，初始化echarts实例
                this.myChart = echarts.init(this.$refs.statisticalCharts);
                this.myChart.setOption(this.lineOption);
                this.myChart.off('click');
                let that = this;
                this.myChart.on('click', function (param) {
                    that.searchContent = '';
                    that.listParam = {};
                    that.total = 0;
                    that.dialogTableVisible = !that.dialogTableVisible;
                    that.listParam = {
                        processKey: param.data.processKey
                    };
                    that.processName = param.seriesName;
                    that.instanceOrTask = param.name;
                    that.instanceOrTaskCount = param.data.value;
                    that.pageSize = 10;
                    that.current = 1;
                    if (param.name === '实例数') {
                        that.isTask = false;
                        that.drillDownListLoad(that.listParam, that.pageSize, that.current);
                    } else if (param.name === '已办数') {
                        that.isTask = true;
                        that.drillDownTaskListLoad(that.listParam, that.pageSize, that.current);
                    }
                });
            },
            // 切换柱状图与折线图
            changeEChart(data) {
                if (data === 'bar') {
                    this.statisticalBarLoad();
                } else {
                    this.statisticalLineLoad();
                }
            },
            //  流程统计查询 柱状图
            statisticalBarLoad() {
                // const this = this;
                const param = _.cloneDeep(this.choiceTime);
                param.processKeys = this.processKeys;
                queryProcessStatisticForChart(param)
                    .then(res => {
                        if (res.code === 10000 && res.data.length > 0) {
                            this.barData = res.data;
                            this.showBar = true;
                            this.$nextTick(() => {
                                this.drawBar();
                            });
                        } else {
                            this.barData = [];
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '数据请求失败',
                            type: 'error'
                        });
                    });
            },
            //  流程统计查询 折线图
            statisticalLineLoad() {
                // const this = this;
                const param = _.cloneDeep(this.choiceTime);
                param.processKeys = this.processKeys;
                queryProcessStatisticForChart(param)
                    .then(res => {
                        if (res.code === 10000 && res.data.length > 0) {
                            this.lineData = res.data;
                            this.showBar = false;
                            this.$nextTick(() => {
                                this.drawLine();
                            });
                        } else {
                            this.lineData = [];
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '数据请求失败',
                            type: 'error'
                        });
                    });
            },
            // 	流程统计查询列表
            statisticalListLoad(size, current) {
                // const this = this;
                this.isLoading = true;
                const param = _.cloneDeep(this.choiceTime);
                param.processKeys = this.processKeys;
                param.size = size;
                param.current = current;
                queryProcessStatisticForList(param)
                    .then(res => {
                        if (res.code === 10000) {
                            this.listData = res.data.records;
                            this.listTotal = res.data.total;
                            this.isLoading = false;
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '数据请求失败',
                            type: 'error'
                        });
                    });
            },
            // 	实例数下钻列表查询列表
            drillDownListLoad(value, pageSize, current) {
                // const this = this;
                this.loading = true;
                const param = _.cloneDeep(this.choiceTime);
                param.processKey = value.processKey;
                param.size = pageSize;
                param.current = current;
                queryParticipateProcessNumberDrill(param)
                    .then(res => {
                        if (res.code === 10000) {
                            this.drillDownListData = res.data.records;
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
            },
            // 	已办数下钻列表查询列表
            drillDownTaskListLoad(value, pageSize, current) {
                // const this = this;
                this.loading = true;
                const param = _.cloneDeep(this.choiceTime);
                param.processKey = value.processKey;
                param.size = pageSize;
                param.current = current;
                queryParticipateTaskNumberDrill(param)
                    .then(res => {
                        if (res.code === 10000) {
                            this.drillDownTaskListData = res.data.records;
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

<style lang="scss" scoped>
    .processAnalysisContainer {
        display: flex;
        flex-direction: row;
        height: calc(100vh - 130px);
    }

    .pageTop {
        width: 100%;
    }

    .pageTop ::v-deep .tabs.el-tabs.el-tabs--top {
        padding-bottom: 16px;
    }

    .pageBottom {
        width: 100%;
        height: calc(100% - 111px);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .pageLeft.flod-tree {
        width: 28.5%;
    }

    .pageLeft.flod-tree ::v-deep .process-list-checked {
        width: unset;
    }

    .pageLeft.flod-tree ::v-deep .process-list {
        width: unset;
    }

    .pageRight.flod-tree {
        width: 71.5%;
    }

    .pageLeft {
        width: 19%;
    }

    .pageRight {
        width: 81%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 16px 24px 16px 24px;
    }

    .checkedProcessTable ::v-deep .cell {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 14px;
        color: #333651;
    }

    ::v-deep .el-table--scrollable-y .el-table__body-wrapper:hover {
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

    .lcdp-dialog .header-title .titleName {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 16px;
        color: #333651;
        display: inline-block;
        width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .change-echarts {
        width: 48px;
        height: 32px;
        background: #079b9f11;
        border: 1px solid #079b9f;
        color: #079b9f;
        border-radius: 2px 0 0 2px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
    }

    .change-echarts1 {
        width: 48px;
        height: 32px;
        border: 1px solid #d9d9d9;
        border-radius: 0 2px 2px 0;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
    }

    .empty-text {
        line-height: 60px;
        color: #909399;
    }

    .barOrLine {
        position: absolute;
        display: flex;
        z-index: 1;
    }

    ::v-deep .el-loading-mask {
        height: 100%;
    }

    .lcdp-dialog ::v-deep .el-dialog .el-loading-mask {
        height: 100% !important;
    }

    .pageLeft.spread-tree {
        width: 0;
    }

    .pageLeft.spread-tree ::v-deep .tree-filter {
        display: none;
    }

    .pageRight.spread-tree {
        width: 100%;
    }

    .pageLeft.over-tree {
        position: absolute;
        top: 48px;
        width: 19%;
        height: calc(100% - 56px);
        animation: slideContentUp 0.2s linear both;
        z-index: 9999;
    }

    .pageLeft.leave-tree {
        position: absolute;
        top: 48px;
        width: 19%;
        height: calc(100% - 56px);
        animation: slideContentDown 0.2s linear both;
    }

    @keyframes slideContentUp {
        from {
            width: 0;
        }
        to {
            width: 19%;
        }
    }

    @keyframes slideContentDown {
        from {
            width: 19%;
        }
        to {
            width: 0;
        }
    }

    .pageLeft.over-tree ::v-deep .tree-filter {
        display: flex;
        flex-direction: column;
    }

    .pageLeft.over-tree ::v-deep .tree-toggle-box {
        width: auto;
    }

    .pageLeft.over-tree ::v-deep .el-checkbox-group {
        height: calc(100% - 55px);
    }

    .pageLeft.over-tree ::v-deep .tree-wrap {
        height: calc(100% - 74px);
        box-shadow: -8px 0px 16px 0px rgba(18, 29, 106, 0.2);
        border-radius: 0px 8px 8px 0px;
    }

    .pageLeft.over-tree ::v-deep .tree-toggle-box .mouseover {
        bottom: -58px;
        left: 0;
        position: absolute;
    }

    .pageLeft.leave-tree ::v-deep .tree-filter {
        display: none;
    }

    .pageLeft.leave-tree ::v-deep .tree-toggle-box {
        width: auto;
    }

    .pageLeft.leave-tree ::v-deep .el-checkbox-group {
        height: calc(100% - 55px);
        overflow: hidden;
    }

    .pageLeft.leave-tree ::v-deep .tree-wrap {
        height: calc(100% - 74px);
        box-shadow: -8px 0px 16px 0px rgba(18, 29, 106, 0.2);
        border-radius: 0px 8px 8px 0px;
    }

    .pageLeft.leave-tree ::v-deep .tree-toggle-box .mouseover {
        bottom: -58px;
        left: 0;
        position: absolute;
    }

    .pageLeft.leave-tree ::v-deep .checkGroup {
        overflow: hidden;
    }

    .pageLeft.flod-tree {
        width: 28.5%;
    }

    .pageLeft.flod-tree ::v-deep .process-list-checked {
        width: unset;
    }

    .pageLeft.flod-tree ::v-deep .process-list {
        width: unset;
    }

    .pageRight.flod-tree {
        width: 71.5%;
    }

    .icon-qingqibing_xinxi {
        position: absolute;
        margin-left: 4px;
    }
    ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner{
      background-color: #00a9b8 ;
      border-color: #00a9b8 ;
    }
    ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: #00a9b8 ;
      border-color: #00a9b8 ;
    }
    ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label{
      color: #00a9b8;
    }
    ::v-deep .process-list-checked{
      background: #00a9b809;
    }
    ::v-deep .process-list:hover{
      color: #00a9b8;
    }
    ::v-deep .el-checkbox__inner:hover{
      border-color: #00a9b8;
    }
</style>
