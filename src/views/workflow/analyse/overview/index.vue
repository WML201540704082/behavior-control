<!--流程概览-->
<template>
    <div id="processOverviewContent" class="content-box">
        <div class="info-box flex">
            <div class="left-static-box">
                <div class="flex static-show-info">
                    <div
                        class="static-box pointer-box"
                        @click="jumpTo('/workflow/modeling')"
                    >
            <span class="static-data">{{ model }}</span
            ><br/>
                        <span class="static-name">流程数</span>
                    </div>
                    <div
                        class="static-box all-duration-box pointer-box"
                        @click="jumpTo('/workflow/process')"
                    >
            <span class="static-data">{{ intance }}</span
            ><br/>
                        <span class="static-name">实例数</span>
                    </div>
                    <div class="static-box instance-box">
            <span class="static-data">{{ allDuration }}</span
            ><br/>
                        <span class="static-name">总耗时（h）</span>
                    </div>
                    <div class="static-box revoke-task-box">
            <span class="static-data">{{ revokeTask }}</span
            ><br/>
                        <span class="static-name">撤回数</span>
                    </div>
                </div>
                <div class="flex static-show-echarts borderTop">
                    <div class="gauge-echarts">
                        <div class="echarts-title">流程完成率</div>
                        <div id="instanceComplete"/>
                        <div class="flex gauge-legend">
                            <div class="echarts-value">
                                <span class="value-label">完成率</span>
                                <el-icon class="el-icon-caret-right value-icon"/>
                                <br/>
                                <span class="value-value">{{ processCompleteRate }}</span>
                            </div>
                            <div class="echarts-data">
                                <div class="echarts-data-item">
                                    <span class="mark yellow-mark"/><span class="mark-text"
                                >进行中</span
                                ><span class="count-data">{{ runningInstance }}</span>
                                </div>
                                <div class="echarts-data-item">
                                    <span class="mark green-mark"/><span class="mark-text"
                                >已完成</span
                                ><span class="count-data">{{ completeInstance }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="gauge-echarts borderLeft">
                        <div class="echarts-title">任务完成率</div>
                        <div id="taskComplete"/>
                        <div class="flex gauge-legend">
                            <div class="echarts-value">
                                <span class="value-label">完成率</span>
                                <el-icon class="el-icon-caret-right value-icon"/>
                                <br/>
                                <span class="value-value">{{ taskCompleteRate }}</span>
                            </div>
                            <div class="echarts-data">
                                <div class="echarts-data-item">
                                    <span class="mark yellow-mark"/><span class="mark-text"
                                >进行中</span
                                ><span class="count-data">{{ runningTask }}</span>
                                </div>
                                <div class="echarts-data-item">
                                    <span class="mark green-mark"/><span class="mark-text"
                                >已完成</span
                                ><span class="count-data">{{ completeTask }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="borderLeft line-echarts">
                        <div class="echarts-title" style="margin-bottom: 8px">
                            流程、任务数量趋势
                        </div>
                        <div id="instanceTaskTrend"/>
                    </div>
                </div>
            </div>
            <div class="right-status-box borderLeft">
                <!--流程状态分析-->
                <div class="echarts-title" style="margin-bottom: 0">流程状态分析</div>
                <div id="instanceStatus"/>
                <div class="pie-legend"
                     v-for="(item, index) in statusData"
                     :key="item.value + index"
                >
                    <template                    >
                        <div

                            :class="{ 'border-top-dashed': index > 1 }"
                            class="pie-legend-item"
                            @click="changePieShowStatus(index)"
                        >
                            <span
                                :style="{
                                background: !statusDataActive[index]
                                  ? '#CECECE'
                                  : colorList[index]
                              }"
                                class="mark"
                            />
                            <span
                                :class="{ unactive: !statusDataActive[index] }"
                                class="pie-legend-item-name"
                            >{{ item.name }}</span
                            >
                            <span
                                :class="{ unactive: !statusDataActive[index] }"
                                class="pie-legend-item-value"
                            >{{ item.value }}个</span
                            >
                        </div>
                        <div
                            v-if="index % 2 === 1"
                            :key="item.value + index +'line'"
                            class="split-line"
                        />
                    </template>
                </div>
            </div>
        </div>
        <div class="table-box borderTop">
            <!--流程列表-->
            <el-table
                v-loading="tableLoading"
                :data="tableData"
                class="lcdp-table"
                stripe
                height="300px"
            >
                <el-table-column
                    :show-overflow-tooltip="true"
                    :index="indexMethod"
                    type="index"
                    label="序号"
                    width="100"
                    align="center"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="processName"
                    label="流程名称"
                    min-width="90"
                    align="left"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="completeInstance"
                    label="已完成流程"
                    min-width="130"
                    align="center"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="runningInstance"
                    label="进行中流程"
                    min-width="140"
                    align="center"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="processCompleteRate"
                    label="流程完成率"
                    min-width="166"
                    align="center"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="completeTask"
                    label="已完成任务"
                    min-width="140"
                    align="center"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="runningTask"
                    label="待办任务"
                    min-width="130"
                    align="center"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="taskCompleteRate"
                    label="任务完成率"
                    min-width="166"
                    align="center"
                />
            </el-table>
            <el-pagination
                style="margin-top: 20px"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="totalNum"
                class="lcdp-pagination"
                popper-class="lcdp-page-select"
                layout="total, sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    import * as bpaMain from '@/api/workflow/analyse/overview';

    let resizeObserve = null;
    let guageProcess = null;
    let guageTask = null;
    let lineTrend = null;
    let pieStatus = null;

    export default {
        name: 'ProcessOverview',
        data() {
            return {
                model: '', // 流程模板
                allDuration: '', // 总耗时
                revokeTask: '', // 撤回数据
                intance: '', // 流程实例
                completeInstance: 0, // 结束的流程
                runningInstance: 0, // 正在进行的流程
                processCompleteRate: '0', // 流程完成率
                runningTask: 0, // 正在进行的任务
                completeTask: 0, // 结束的任务
                taskCompleteRate: '0', // 任务完成率
                tableData: [], // 流程表格数据
                tableLoading: false, // 表格是否处于加载状态
                currentPage: 1, // 当前页
                pageSize: 10, // 每页显示条数
                totalNum: 0, // 数据总条数
                statusData: [],
                statusDataActive: [],
                colorList: ['#2794F8', '#FFBB00', '#EE7B4E', '#52C566'],
                trendData: {
                    processAdd: [],
                    processComplete: [],
                    taskAdd: [],
                    taskComplete: []
                }, // 趋势图
                trendDataXLabel: []
            };
        },
        mounted() {
            this.init().then(() => {
                resizeObserve = new ResizeObserver(() => {
                    if (guageProcess) guageProcess.resize();
                    if (guageTask) guageTask.resize();
                    if (lineTrend) lineTrend.resize();
                    if (pieStatus) pieStatus.resize();
                });
                resizeObserve.observe(document.getElementById('processOverviewContent'));
            });
        },
        beforeUnmount() {
            if (guageProcess) guageProcess.dispose();
            guageProcess = null;
            if (guageTask) guageTask.dispose();
            guageTask = null;
            if (lineTrend) lineTrend.dispose();
            lineTrend = null;
            if (pieStatus) pieStatus.dispose();
            pieStatus = null;
            if (resizeObserve) resizeObserve.disconnect();
            resizeObserve = null;
        },
        methods: {
            // 初始化操作
            async init() {
                //   const this = this;
                this.initInfo(() => {
                    this.$nextTick(() => {
                        this.initInstanceCompleteEcharts();
                        this.initTaskCompleteEcharts();
                    });
                });
                this.initTrendData(() => {
                    this.$nextTick(() => {
                        this.initInstanceTaskTrendEcharts();
                    });
                });
                this.initStatusData(() => {
                    this.$nextTick(() => {
                        this.initInstanceStatusEcharts();
                    });
                });
                this.initTableData();
            },
            accountingNumFormat(value) {
                let l1 = value.split('.');
                return (
                    l1[0]
                        .split('')
                        .reverse()
                        .reduce((total, currentValue, currentIndex) => {
                            return (
                                (currentIndex > 2 && currentIndex % 3 === 0
                                    ? currentValue + ','
                                    : currentValue) + total
                            );
                        }, '') + (l1.length === 2 ? '.' + l1[1] : '')
                );
            },
            // 获取流程基本信息
            initInfo(calcback) {
                bpaMain
                    .getProcessMessage()
                    .then(res => {
                        if (res && res.code && res.code === 10000) {
                            this.model = this.accountingNumFormat(`${res.data.model}`);
                            this.allDuration = this.accountingNumFormat(
                                `${res.data.allDuration}`
                            );
                            this.revokeTask = this.accountingNumFormat(
                                `${res.data.revokeTask}`
                            );
                            this.completeInstance = res.data.completeInstance;
                            this.runningInstance = res.data.runningInstance;
                            this.processCompleteRate = res.data.processCompleteRate;
                            this.runningTask = res.data.runningTask;
                            this.completeTask = res.data.completeTask;
                            this.taskCompleteRate = res.data.taskCompleteRate;
                            this.intance = this.accountingNumFormat(
                                `${this.completeInstance + this.runningInstance}`
                            );
                            calcback();
                        } else {
                             this.$message({
                                message: '',
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '获取流程信息异常',
                            type: 'error'
                        });
                    });
            },
            // 初始化流程完成率
            initInstanceCompleteEcharts() {
                //   const this = this;
                const dom = document.getElementById('instanceComplete');
                if (dom) {
                    let value = parseFloat(this.processCompleteRate.replace('%', ''));
                    guageProcess = this.initGaugeEcharts(dom, value);
                }
            },
            // 初始化任务完成率
            initTaskCompleteEcharts() {
                //   const this = this;
                const dom = document.getElementById('taskComplete');
                if (dom) {
                    let value = parseFloat(this.taskCompleteRate.replace('%', ''));
                    guageTask = this.initGaugeEcharts(dom, value);
                }
            },
            // 抽取出的初始化仪表盘
            initGaugeEcharts(dom, value) {
                const guageEcharts = echarts.init(dom);
                const options = {
                    series: [
                        {
                            type: 'gauge', // echarts类型，gauge为仪表盘类型
                            center: ['50%', '95%'], // 圆心的位置
                            radius: '176%', // 半径的宽度
                            startAngle: 180,
                            endAngle: 0, // 起始角度
                            axisLine: {
                                lineStyle: {
                                    color: [
                                        [0.2, '#EE7B4E'],
                                        [0.75, '#45A3F9'],
                                        [1, '#52C566']
                                    ], // 坐标轴各个分段的颜色
                                    width: 20 // 坐标轴的宽度
                                }
                            }, // 坐标轴
                            pointer: {
                                itemStyle: {
                                    color: 'auto' // 指针颜色自适应
                                },
                                show: true,
                                length: '70%',
                                width: 3
                            }, // 指针
                            markPoint: {
                                symbol: 'circle',
                                symbolSize: 10,
                                itemStyle: {
                                    color: 'auto' // 指针颜色自适应
                                },
                                data: [{x: '50%', y: '95%'}]
                            },
                            axisTick: {
                                splitNumber: 5, // 每个部分所含小部分
                                length: 10, // 刻度的长度
                                distance: -20, // 刻度和盘的距离
                                lineStyle: {
                                    width: 1,
                                    color: '#D8D8D8'
                                }
                            }, //刻度
                            splitLine: {
                                distance: -20, // 与仪表盘的距离，
                                length: 35, // 长度
                                lineStyle: {
                                    width: 2,
                                    color: '#ECEDEF'
                                }
                            }, //分割
                            axisLabel: {
                                color: 'auto',
                                fontSize: 10
                            }, // 刻度值
                            detail: {
                                show: false
                            }, // 仪表盘中间的value值显示
                            data: [
                                {
                                    value: value
                                }
                            ]
                        }
                    ],
                    grid: {
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    } // 与外部容器的距离
                };
                guageEcharts.setOption(options);
                return guageEcharts;
            },
            // 初始化折线图的数据
            initTrendData(calcback) {
                //   const this = this;
                bpaMain
                    .getFlowTaskTrend()
                    .then(res => {
                        if (res && res.code && res.code === 10000) {
                            const processAdd = (res.data.processAdd || []).map(
                                value => value.countNum
                            );
                            const processComplete = (res.data.processComplete || []).map(
                                value => value.countNum
                            );
                            const taskAdd = (res.data.taskAdd || []).map(
                                value => value.countNum
                            );
                            const taskComplete = (res.data.taskComplete || []).map(
                                value => value.countNum
                            );
                            const dateList = (res.data.processAdd || [])
                                .map(value => {
                                    const d = new Date(value.mouthDay);
                                    let month = d.getMonth() + 1;
                                    if (month < 10) month = `0${month}`;
                                    let day = d.getDate();
                                    if (day < 10) day = `0${day}`;
                                    return `${month}-${day}`;
                                })
                                .sort();
                            this.trendData = {
                                processAdd,
                                processComplete,
                                taskAdd,
                                taskComplete
                            };
                            this.trendDataXLabel = dateList;
                            calcback();
                        } else {
                             this.$message({
                                message: '',
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '获取流程、任务趋势数据异常',
                            type: 'error'
                        });
                    });
            },
            // 初始化折线趋势图
            initInstanceTaskTrendEcharts() {
                //   const this = this;
                const dom = document.getElementById('instanceTaskTrend');
                if (dom) {
                    const categoryEcharts = echarts.init(dom);
                    const options = {
                        color: ['#5B8FF9', '#5AD8A6', '#FFBB00', '#EE7B4E'],
                        grid: {
                            top: 36,
                            left: 0,
                            right: 0,
                            bottom: 18,
                            containLabel: true
                        }, // 与外部容器的距离
                        legend: {
                            type: 'scroll',
                            icon: 'rect',
                            itemWidth: 12,
                            itemHeight: 3,
                            right: 0,
                            top: 0,
                            padding: 0,
                            itemGap: 12, //图例之前的距离
                            textStyle: {
                                color: '#545672',
                                fontWeight: 400,
                                fontSize: 12
                            }
                        }, // 折线图上方的图例
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(111, 111, 111, 1)',
                            textStyle: {
                                color: '#fff',
                                fontWeight: '400'
                            },
                            borderWidth: 0
                        }, // 提示
                        xAxis: {
                            type: 'category',
                            data: this.trendDataXLabel,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                color: 'rgba(0, 0, 0, 0.45)',
                                fontSize: 12,
                                lineHeight: 24
                            },
                            axisLine: {
                                lineStyle: {
                                    color: 'rgba(0, 0, 0, 0.45)'
                                }
                            }
                        }, // x坐标
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                color: 'rgba(0, 0, 0, 0.45)',
                                fontSize: 12
                            },
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            minInterval: 1,
                            max: function (value) {
                                if (value.max === 0) return 5;
                            }
                        }, // y周坐标
                        series: [
                            {
                                name: '发起流程',
                                type: 'line',
                                symbol: 'none',
                                data: this.trendData.processAdd
                            },
                            {
                                name: '结束流程',
                                type: 'line',
                                symbol: 'none',
                                data: this.trendData.processComplete
                            },
                            {
                                name: '新增任务',
                                type: 'line',
                                symbol: 'none',
                                data: this.trendData.taskAdd
                            },
                            {
                                name: '结束任务',
                                type: 'line',
                                symbol: 'none',
                                data: this.trendData.taskComplete
                            }
                        ]
                    };
                    categoryEcharts.setOption(options);
                    lineTrend = categoryEcharts;
                }
            },
            // 初始化饼图的数据
            initStatusData(calcback) {
                //   const this = this;
                bpaMain
                    .getProcessStatus()
                    .then(res => {
                        if (res && res.code && res.code === 10000) {
                            const status = [];
                            status.push({name: '进行中', value: res.data.normalCount || 0});
                            status.push({name: '挂起', value: res.data.pauseCount || 0});
                            status.push({name: '终止', value: res.data.terminatedCount || 0});
                            status.push({name: '结束', value: res.data.endCount || 0});
                            this.statusData = status;
                            this.statusDataActive = new Array(status.length).fill(true);
                            calcback();
                        } else {
                             this.$message({
                                message: '',
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '获取流程状态数据异常',
                            type: 'error'
                        });
                    });
            },
            // 初始化同级圆环图
            initInstanceStatusEcharts() {
                //   const this = this;
                const dom = document.getElementById('instanceStatus');

                if (dom) {
                    if (pieStatus) {
                        pieStatus.dispose();
                    }
                    pieStatus = echarts.init(dom);
                    const data = [];
                    const color = [];
                    this.statusData.forEach((item, index) => {
                        if (this.statusDataActive[index]) {
                            data.push(item);
                            color.push(this.colorList[index]);
                        }
                    });
                    const options = {
                        color: color,
                        tooltip: {
                            trigger: 'item',
                            backgroundColor: 'rgba(111, 111, 111, 1)',
                            textStyle: {
                                color: '#fff',
                                fontWeight: '400'
                            },
                            borderWidth: 0
                        },
                        legend: {
                            show: false
                        },
                        series: [
                            {
                                type: 'pie',
                                radius: ['50%', '80%'],
                                avoidLabelOverlap: true,
                                label: {
                                    show: true,
                                    position: 'inside',
                                    formatter: params => {
                                        return params.data.value ? params.data.value : '';
                                    },
                                    color: '#fff'
                                },
                                labelLine: {
                                    show: false
                                },
                                data: data
                            }
                        ]
                    };
                    pieStatus.setOption(options);
                }
            },
            // 改变图例的状态
            changePieShowStatus(index) {
                //   const this = this;
                this.statusDataActive[index] = !this.statusDataActive[index]
                this.initInstanceStatusEcharts();
            },
            // 初始化列表数据
            initTableData() {
                //   const this = this;
                this.tableLoading = true;
                const param = {
                    current: this.currentPage,
                    size: this.pageSize
                };
                bpaMain
                    .getProcessAllDetails(param)
                    .then(res => {
                        if (res && res.code && res.code === 10000) {
                            this.tableData = res.data.records || [];
                            this.totalNum = res.data.total;
                        } else {
                             this.$message({
                                message: '',
                                type: 'error'
                            });
                        }
                        this.tableLoading = false;
                    })
                    .catch(() => {
                         this.$message({
                            message: '获取表格数据异常',
                            type: 'error'
                        });
                        this.tableLoading = false;
                    });
            },
            // 改变每页显示条数
            handleSizeChange(value) {
                //   const this = this;
                this.currentPage = 1;
                this.pageSize = value;
                this.initTableData();
            },
            // 改变页码
            handleCurrentChange(value) {
                //   const this = this;
                this.currentPage = value;
                this.initTableData();
            },
            // 列表的序号
            indexMethod(index) {
                //   const this = this;
                const curpage = this.currentPage;
                const limitpage = this.pageSize;
                return index + 1 + (curpage - 1) * limitpage;
            },
            //页面跳转
            jumpTo(path) {
                this.$router.push({path: path});
            }
        }
    };
</script>

<style scoped>
    #instanceComplete,
    #taskComplete {
        width: 100%;
        height: 120px;
        margin: 0 0 36px 0;
    }

    #instanceTaskTrend {
        width: 100%;
        height: 260px;
    }

    #instanceStatus {
        width: 100%;
        height: calc(100% - 116px);
    }

    .flex {
        display: flex;
        justify-content: space-between;
        align-content: center;
        align-items: center;
    }

    .borderTop {
        border-top: 1px solid #eaeaea;
    }

    .borderLeft {
        border-left: 1px solid #eaeaea;
    }

    .border-top-dashed {
        border-top: 1px dashed #eaeaea;
    }

    .content-box {
        width: calc(100% - 16px);
        height: calc(100% - 16px);
        margin: 8px;
        padding: 24px 24px 16px 24px;
        background: #fff;
        overflow: auto;
        border-radius: 4px;
    }

    .info-box {
        width: 100%;
        height: 434px;
    }

    .left-static-box {
        width: 75%;
        height: 100%;
        padding-right: 24px;
    }

    .static-show-info {
        padding-bottom: 16px;
    }

    .static-box {
        width: 24%;
        height: 88px;
        background: url('../../../assets/workflow/processTemplate.png') no-repeat;
        background-size: cover;
        border-radius: 4px;
        color: #ffffff;
        text-align: center;
        padding: 12px 0 10px 0;
    }

    .static-box.all-duration-box {
        background: url('../../../assets/workflow/processComplete.png') no-repeat;
    }

    .static-box.instance-box {
        background: url('../../../assets/workflow/processInstance.png') no-repeat;
    }

    .static-box.revoke-task-box {
        background: url('../../../assets/workflow/taskComplete.png') no-repeat;
    }

    .static-data {
        line-height: 42px;
        font-weight: 600;
        font-size: 30px;
    }

    .static-name {
        line-height: 22px;
        font-weight: 400;
        font-size: 16px;
    }

    .static-show-echarts {
        padding: 16px 0;
        width: 100%;
    }

    .gauge-echarts {
        width: 25%;
        height: 298px;
        padding: 0 24px;
        min-width: 289px;
        cursor: default;
        user-select: none;
    }

    .gauge-echarts:first-child {
        width: calc(25% - 25px);
        padding-left: 0;
        min-width: 264px;
    }

    .echarts-title {
        line-height: 30px;
        font-size: 16px;
        color: #333651;
        margin-bottom: 32px;
    }

    .gauge-legend {
        padding: 0 20px;
        line-height: 32px;
    }

    .value-label {
        font-size: 14px;
        color: #545672;
    }

    .value-icon {
        font-size: 10px;
        color: #545672;
    }

    .value-value {
        font-weight: 500;
        font-size: 14px;
        color: #333651;
    }

    .echarts-data {
        width: 103px;
    }

    .echarts-data-item {
        position: relative;
        height: 32px;
    }

    .mark {
        display: inline-block;
        vertical-align: middle;
        width: 8px;
        height: 8px;
        border-radius: 4px;
    }

    .yellow-mark {
        background: #f7ab2c;
    }

    .green-mark {
        background: #73deb3;
    }

    .mark-text {
        font-size: 12px;
        color: #545672;
        display: inline-block;
        margin-left: 8px;
        vertical-align: middle;
    }

    .count-data {
        font-size: 12px;
        color: #545672;
        display: inline-block;
        position: absolute;
        right: 0;
    }

    .line-echarts {
        width: calc(50% + 25px);
        height: 298px;
        padding-left: 24px;
    }

    .right-status-box {
        width: 25%;
        height: calc(100% - 16px);
        padding-left: 24px;
        min-width: 307px;
    }

    .pie-legend {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        align-content: center;
    }

    .pie-legend-item {
        width: 125px;
        font-weight: 400;
        font-size: 12px;
        color: #545672;
        line-height: 32px;
        position: relative;
        cursor: pointer;
        user-select: none;
    }

    .pie-legend-item-name {
        display: inline-block;
        margin-left: 10px;
    }

    .pie-legend-item-value.unactive,
    .pie-legend-item-name.unactive {
        color: #cecece;
    }

    .pie-legend-item-value {
        display: inline-block;
        position: absolute;
        right: 0;
    }

    .pie-legend-item + .pie-legend-item {
        width: 157px;
        padding-left: 32px;
    }

    .split-line {
        width: 100%;
        height: 0;
    }

    .table-box {
        width: 100%;
        height: calc(100% - 434px);
        padding: 0;
        min-height: 300px;
    }

    .table-box ::v-deep (.el-table--scrollable-y .el-table__body-wrapper:hover),
    .table-box ::v-deep (.el-table--scrollable-x .el-table__body-wrapper:hover) {
        overflow-x: hidden !important;
    }

    .pointer-box {
        cursor: pointer;
    }
</style>
