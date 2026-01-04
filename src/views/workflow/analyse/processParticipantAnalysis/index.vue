<!--流程参与者分析-->
<template>
    <div class="app-container" style="padding: 0;" >
        <el-card style="height: 100%;">
            <div id="processContent" class="list-container modelEditor">
                <el-container class="list-box">
                    <el-main>
                        <Tabs
                            :show-top-few="false"
                            :remarks="remarks"
                            :set-width="'calc(100% - 759px)'"
                            :show-user="true"
                            :is-select-user-radio="true"
                            @getQueryList="getQueryList"
                            @isShowList="isShowList"
                        />
                        <div v-show="!showList && chartData.length > 0" class="change-btns">
                            <div
                                :class="showBar ? 'change-echarts' : 'change-echarts1'"
                                @click="changeEchart('bar')"
                            >
                                柱图
                            </div>
                            <div
                                :class="showBar ? 'change-echarts1' : 'change-echarts'"
                                @click="changeEchart('line')"
                            >
                                折线
                            </div>
                        </div>
                        <div
                            v-show="!showList && chartData.length > 0 && !isNone"
                            id="chartBar"
                            class="chart"
                        ></div>
                        <div
                            v-show="!showList && chartData.length === 0 && isNone"
                            class="fill empty-text"
                        >
                            暂无数据
                        </div>
                        <div v-show="showList" class="fill">
                            <el-table
                                v-loading="listLoading"
                                ref="tableRow"
                                :data="list"
                                element-loading-text="加载中"
                                tooltip-effect="light"
                                height="calc(100vh - 340px)"
                                fit
                                show-summary
                                stripe
                                class="lcdp-table participantTable"
                            >
                                <el-table-column
                                    :label="'序号'"
                                    :index="indexMethod"
                                    type="index"
                                    width="120"
                                    align="center"
                                />
                                <el-table-column label="流程名称">
                                    <template #default="scope">
                    <span :title="scope.row.processName">{{
                      scope.row.processName
                    }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="实例数" prop="instanceCount">
                                    <!-- <template #header>
                                                        <span>实例数</span>
                                                        <el-tooltip content="已办任务涉及的流程实例数量"
                                                          ><i class="font_family icon-qingqibing_xinxi" />
                                                        </el-tooltip>
                                                      </template> -->
                                    <!-- <template #default="scope">
                                                        <a
                                                          href="#"
                                                          class="mainColor"
                                                          @click="showInstanceCountDrill(scope.row)"
                                                        >
                                                          <span>{{ scope.row.instanceCount }}</span>
                                                        </a>
                                                      </template> -->
                                    <template #default="scope">
                                        <el-button
                                            type="text"
                                            @click="showInstanceCountDrill(scope.row)"
                                        >{{ scope.row.instanceCount }}
                                        </el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column label="已办数" prop="taskCount">
                                    <!-- <template #header>
                                                        <span>已办数</span>
                                                        <el-tooltip content="已办理的任务数量"
                                                          ><i class="font_family icon-qingqibing_xinxi" />
                                                        </el-tooltip>
                                                      </template>
                                                      <template #default="scope">
                                                        <a
                                                          href="#"
                                                          class="mainColor"
                                                          @click="showTaskCountDrill(scope.row)"
                                                        >
                                                          <span>{{ scope.row.taskCount }}</span>
                                                        </a>
                                                      </template> -->
                                    <template #default="scope">
                                        <el-button
                                            type="text"
                                            @click="showTaskCountDrill(scope.row)"
                                        >{{ scope.row.taskCount }}
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination
                              style="text-align: right;margin-top: 10px"
                              background
                                :current-page="page.currentPage"
                                :page-sizes="page.sizes"
                                :page-size="page.size"
                                :total="total"
                                :pager-count="pageCount"
                                layout="total, sizes, prev, pager, next"
                                class="lcdp-pagination"
                                popper-class="lcdp-page-select"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                            />
                        </div>
                    </el-main>
                </el-container>
                <el-dialog
                    :close-on-click-modal="false"
                    :before-close="closeDialog"
                    :visible.sync="dialogVisible"
                    :title="
            `流程名称：${processName} ` +
            `\xa0\xa0\xa0\xa0\xa0` +
            ` 实例数：${instanceCount}`
          "
                    class="lcdp-dialog"
                >
                    <el-table
                        v-loading="loading"
                        :data="instanceCountList"
                        class="taskStatusList lcdp-table"
                        height="400px"
                        stripe
                    >
                        <el-table-column
                            :index="indexMethodIns"
                            type="index"
                            label="序号"
                            align="center"
                            width="120"
                        />
                        <el-table-column label="流程实例ID" property="processInsId"/>
                        <el-table-column property="startTime" label="启动时间"/>
                        <el-table-column property="endTime" label="结束时间"/>
                    </el-table>
                    <el-pagination
                        style="margin-top: 20px"
                        :current-page="instanceCountPage.currentPage"
                        :page-sizes="instanceCountPage.sizes"
                        :page-size="instanceCountPage.size"
                        :pager-count="pageCount"
                        :total="instanceCountTotal"
                        class="lcdp-pagination"
                        popper-class="lcdp-page-select"
                        layout="total, sizes, prev, pager, next"
                        @size-change="handleSizeInstanceCount"
                        @current-change="handleCurrentInstanceCount"
                    />
                </el-dialog>
                <el-dialog
                    :close-on-click-modal="false"
                    :before-close="closeDialog"
                    :visible.sync="taskDialogVisible"
                    :title="
            `流程名称：${processName} ` +
            `\xa0\xa0\xa0\xa0\xa0` +
            `已办数：${taskCount}`
          "
                    class="lcdp-dialog"
                >
                    <el-table
                        v-loading="loading"
                        :data="taskCountList"
                        class="taskStatusList lcdp-table"
                        height="400px"
                        stripe
                    >
                        <el-table-column
                            :index="indexMethodTask"
                            type="index"
                            label="序号"
                            align="center"
                            width="120"
                        />
                        <el-table-column property="taskDefinitionName" label="当前节点"/>
                        <el-table-column property="taskCount" label="已办数"/>
                    </el-table>
                    <el-pagination
                        style="margin-top: 20px"
                        :current-page="taskCountPage.currentPage"
                        :page-sizes="taskCountPage.sizes"
                        :page-size="taskCountPage.size"
                        :pager-count="pageCount"
                        :total="taskCountTotal"
                        class="lcdp-pagination"
                        popper-class="lcdp-page-select"
                        layout="total, sizes, prev, pager, next"
                        @size-change="handleSizeTaskCount"
                        @current-change="handleCurrentTaskCount"
                    />
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    import Tabs from '../../components/dataPickerTabs/index.vue';
    import * as process from '@/api/workflow/analyse/processParticipantAnalysis';


    let resizeObserve = null;
    let chartStatus = null;

    export default {
        name: 'ProcessParticipantAnalysis',
        components: {Tabs},
        data() {
            return {
                // 查询条件
                listQuery: {
                    userId: this.$getHussarUserId(this),
                    statisType: 'month', // 统计类型
                    autoStartTime: null, // 自定义开始时间
                    autoEndTime: null, // 自定义结束时间
                    dayTime: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                    }-${new Date().getDate()}`, // 按天统计时间
                    monthMonth: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`, // 按月统计的月份值
                    quarterYear: null, // 按季度统计的年份值
                    quarterQuarter: null, // 按季度统计的季度值
                    yearYear: '2022', // 按年份统计的年份值
                    size: 10, //每页显示几条数据
                    current: 1, //当前页码
                    processName: '',
                    processKey: null
                },
                showBar: true,
                showList: false,
                list: [], //列表数据
                listLoading: false,
                chart: null,
                chartData: [], //柱状图和折线图数据
                category: [], //x轴类目，对应流程名称
                xList: [],
                barData: [], //柱状图数据
                total: 0,
                pageCount: 7,
                // 分页参数
                page: {currentPage: 1, size: 10, sizes: [10, 20, 50, 100]},
                dialogVisible: false,
                taskDialogVisible: false,
                processName: '',
                instanceCount: 0,
                taskCount: 0,
                loading: false,
                instanceCountList: [],
                instanceCountTotal: 0,
                // 分页参数
                instanceCountPage: {currentPage: 1, size: 10, sizes: [10, 20, 50, 100]},
                taskCountList: [],
                taskCountTotal: 0,
                // 分页参数
                taskCountPage: {currentPage: 1, size: 10, sizes: [10, 20, 50, 100]},
                isNone: false, // 是否查询到数据
                remarks: '统计特定时间内某个人员办理的任务数量和涉及的流程实例数量。'
            };
        },
        mounted() {
            // const this = this;
            //初始化操作，当窗口大小发生变化时，图标的大小也随之改变
            this.initProcessParticipant().then(() => {
                resizeObserve = new ResizeObserver(() => {
                    if (chartStatus) chartStatus.resize();
                });
                resizeObserve.observe(document.getElementById('processContent'));
            });
        },
        methods: {
            // 初始化操作
            async initProcessParticipant() {
                // const this = this;
                this.queryProcessParticipant();
            },
            //柱状图
            drawBar() {
                if (this.chart) {
                    this.chart.dispose();
                    this.chart = null;
                }
                if (chartStatus) {
                    chartStatus.dispose();
                    chartStatus = null;
                }
                // 基于准备好的dom，初始化echarts实例
                let dom = document.getElementById('chartBar');
                if (!dom || dom.clientWidth === 0) return;
                this.chart = echarts.init(dom);
                let isShow = false;
                let end = 100;
                if (this.barData.length > 8) {
                    isShow = true;
                    end = (8 / this.barData.length) * 100;
                }
                const optionBar = {
                    legend: {
                        type: 'scroll',
                        data: ['实例数', '已办数'],
                        top: 0,
                        right: 0,
                        padding: 0,
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
                                var obj = {top: 20};
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
                        trigger: 'axis',
                        axisPointer: {
                            type: 'none'
                        },
                        backgroundColor: 'rgba(111, 111, 111, 1)',
                        textStyle: {
                            color: '#fff',
                            fontWeight: '400'
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
                    dataset: {
                        dimensions: ['名称', '创建数', '已办数'],
                        source: this.barData
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            //x轴文字的配置
                            show: true,
                            interval: 0, //使x轴文字显示全
                            color: 'rgba(0, 0, 0, 0.45)',
                            width: 100,
                            overflow: 'truncate',
                            ellipsis: '...'
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
                        type: 'value',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
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
                            barGap: '10%'
                        },
                        {
                            name: '已办数',
                            type: 'bar',
                            barWidth: '32',
                            barGap: '10%'
                        }
                    ]
                };
                // 绘制图表
                this.chart.setOption(optionBar, true);
                chartStatus = this.chart;
                this.chart.on('click', value => {
                    if (value.seriesName === '已办数') {
                        value.data.processName = value.data['名称'];
                        value.data.taskCount = value.data['已办数'];
                        this.showTaskCountDrill(value.data);
                    } else {
                        value.data.processName = value.data['名称'];
                        value.data.instanceCount = value.data['创建数'];
                        this.showInstanceCountDrill(value.data);
                    }
                });
            },
            //折线图
            drawLine() {
                if (this.chart) {
                    this.chart.dispose();
                    this.chart = null;
                }
                if (chartStatus) {
                    chartStatus.dispose();
                    chartStatus = null;
                }
                // 基于准备好的dom，初始化echarts实例
                let dom = document.getElementById('chartBar');
                if (!dom) return;
                const chart1 = echarts.init(dom);
                const optionLine = {
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(111, 111, 111, 1)',
                        axisPointer: {
                            type: 'none'
                        },
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
                        width: '80%',
                        padding: 0,
                        data: this.category,
                        icon: 'rect',
                        itemWidth: 12,
                        itemHeight: 5,
                        right: 0,
                        top: 10,
                        itemGap: 30, //图例之前的距离
                        textStyle: {
                            color: '#8C8C8C',
                            lineHeight: 15
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
                        bottom: '0',
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
                        max: function (value) {
                            if (value.max === 0) return 5;
                        }
                    },
                    series: this.xList
                };
                // 绘制图表
                chart1.setOption(optionLine, true);
                chartStatus = chart1;
                chartStatus.on('click', value => {
                    if (value.data.name === '已办数') {
                        value.data.taskCount = value.data.value;
                        this.showTaskCountDrill(value.data);
                    } else {
                        value.data.instanceCount = value.data.value;
                        this.showInstanceCountDrill(value.data);
                    }
                });
            },
            //柱状图和折线图切换
            changeEchart(value) {
                // const this = this;
                if (value === 'bar') {
                    this.showBar = true;
                    this.drawBar();
                } else {
                    this.drawLine();
                    this.showBar = false;
                }
            },
            //查询柱状图图数据
            queryProcessParticipant() {
                process
                    .getParticipantProcess(this.listQuery)
                    .then(res => {
                        this.chartData = [];
                        if (res.code === 10000) {
                            this.isNone = res.data.length <= 0;
                            this.chartData = res.data;
                            this.category = [];
                            this.barData = [];
                            this.xList = [];
                            for (let i = 0; i < res.data.length; i++) {
                                this.category.push(res.data[i].processName);
                                this.barData.push({
                                    名称: res.data[i].processName,
                                    创建数: res.data[i].instanceCount,
                                    已办数: res.data[i].taskCount,
                                    processKey: res.data[i].processKey
                                });
                                const one = {
                                    name: res.data[i].processName,
                                    type: 'line',
                                    data: [
                                        {
                                            name: '创建数',
                                            value: res.data[i].instanceCount,
                                            processName: res.data[i].processName,
                                            processKey: res.data[i].processKey
                                        },
                                        {
                                            name: '已办数',
                                            value: res.data[i].taskCount,
                                            processName: res.data[i].processName,
                                            processKey: res.data[i].processKey
                                        }
                                    ]
                                };
                                this.xList.push(one);
                            }
                            this.$nextTick(() => {
                                if (this.showBar) {
                                    this.drawBar();
                                } else {
                                    this.drawLine();
                                }
                            });
                        } else {
                            this.isNone = true;
                             this.$message({
                                message: '',
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '数据请求失败',
                            type: 'error'
                        });
                        this.listLoading = false;
                    });
            },
            //选中右上角的‘查看列表’
            isShowList(data) {
                this.showList = data;
                if (data) {
                    this.queryProcessParticipantList();
                } else {
                    this.queryProcessParticipant();
                }
            },
            //查询按钮
            getQueryList(params) {
                // const this = this;
                this.listQuery.statisType = params.statisType;
                this.listQuery.userId = params.userIds;
                if (params.statisType === 'day') {
                    this.listQuery.dayTime = params.choiceTime;
                } else if (params.statisType === 'month') {
                    this.listQuery.monthMonth = params.choiceTime;
                } else if (params.statisType === 'quarter') {
                    this.listQuery.quarterYear = params.choiceTime;
                    this.listQuery.quarterQuarter = params.quarterQuarter;
                } else if (params.statisType === 'year') {
                    this.listQuery.yearYear = params.choiceTime;
                } else if (params.statisType === 'auto') {
                    this.listQuery.autoStartTime = params.choiceTime.startTime;
                    this.listQuery.autoEndTime = params.choiceTime.endTime;
                }
                this.queryProcessParticipantList();
                this.queryProcessParticipant();
            },
            //查询列表数据
            queryProcessParticipantList() {
                this.listLoading = true;
                process
                    .getParticipantProcessList(this.listQuery)
                    .then(res => {
                        if (res.code === 10000) {
                            this.listLoading = false;
                            this.list = res.data.records;
                            this.total = res.data.total;
                        } else {
                            this.listLoading = false;
                             this.$message({
                                message: '数据请求失败',
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '数据请求失败',
                            type: 'error'
                        });
                        this.listLoading = false;
                    });
            },
            // 列表的序号
            indexMethod(index) {
                // const this = this;
                const curpage = this.page.currentPage;
                const limitpage = this.page.size;
                return index + 1 + (curpage - 1) * limitpage;
            },
            // 每页条数改变
            handleSizeChange(val) {
                // 改变每页显示的条数
                this.listQuery.size = val;
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.listQuery.current = 1;
                this.queryProcessParticipantList();
            },
            // 页码切换
            handleCurrentChange(val) {
                this.listQuery.current = val;
                this.queryProcessParticipantList();
            },

            // 实例数下钻
            showInstanceCountDrill(data) {
                // const this = this;
                this.loading = true;
                this.listQuery.current = this.instanceCountPage.currentPage;
                this.listQuery.size = this.instanceCountPage.size;
                if (data) {
                    this.dialogVisible = !this.dialogVisible;
                    this.processName = data.processName;
                    this.instanceCount = data.instanceCount;
                    this.listQuery.processKey = data.processKey;
                }
                this.instanceCountList = [];
                process
                    .getProcessNumberDrill(this.listQuery)
                    .then(res => {
                        if (res.code === 10000) {
                            this.loading = false;
                            this.instanceCountList = res.data.records;
                            this.instanceCountTotal = res.data.total;
                        } else {
                             this.$message({
                                message: '数据请求失败',
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '数据请求失败',
                            type: 'error'
                        });
                    });
            },
            // 列表的序号
            indexMethodIns(index) {
                // const this = this;
                const curpage = this.instanceCountPage.currentPage;
                const limitpage = this.instanceCountPage.size;
                return index + 1 + (curpage - 1) * limitpage;
            },
            //实例数下钻列表每页条数改变
            handleSizeInstanceCount(val) {
                // 改变每页显示的条数
                this.instanceCountPage.size = val;
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.instanceCountPage.currentPage = 1;
                this.showInstanceCountDrill();
            },
            // 页码切换
            handleCurrentInstanceCount(val) {
                this.instanceCountPage.currentPage = val;
                this.showInstanceCountDrill();
            },

            // 已办数下钻
            showTaskCountDrill(data) {
                // const this = this;
                this.loading = true;
                this.listQuery.current = this.taskCountPage.currentPage;
                this.listQuery.size = this.taskCountPage.size;
                if (data) {
                    this.taskDialogVisible = !this.taskDialogVisible;
                    this.processName = data.processName;
                    this.taskCount = data.taskCount;
                    this.listQuery.processKey = data.processKey;
                }
                this.taskCountList = [];
                process
                    .getTaskNumberDrill(this.listQuery)
                    .then(res => {
                        if (res.code === 10000) {
                            this.loading = false;
                            this.taskCountList = res.data.records;
                            this.taskCountTotal = res.data.total;
                        } else {
                             this.$message({
                                message: '数据请求失败',
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                         this.$message({
                            message: '数据请求失败',
                            type: 'error'
                        });
                    });
            },
            // 列表的序号
            indexMethodTask(index) {
                // const this = this;
                const curpage = this.taskCountPage.currentPage;
                const limitpage = this.taskCountPage.size;
                return index + 1 + (curpage - 1) * limitpage;
            },
            //已办数下钻列表每页条数改变
            handleSizeTaskCount(val) {
                // 改变每页显示的条数
                this.taskCountPage.size = val;
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.taskCountPage.currentPage = 1;
                this.showTaskCountDrill();
            },
            // 已办数页码切换
            handleCurrentTaskCount(val) {
                this.taskCountPage.currentPage = val;
                this.showTaskCountDrill();
            },
            closeDialog(done) {
                this.instanceCountPage.currentPage = 1;
                this.instanceCountPage.size = 10;
                this.instanceCountTotal = 0;
                this.taskCountPage.currentPage = 1;
                this.taskCountPage.size = 10;
                this.taskCountTotal = 0;
                done();
            }
        }
    };
</script>

<style scoped>

    #processContent {
        height: calc(100vh - 100px);
    }

    .list-box ::v-deep .tabs.el-tabs--top {
        padding-bottom: 16px;
    }

    .el-main {
        color: #333;
        padding: 16px 24px 16px 24px;
    }

    .chart {
        overflow: hidden;
        width: 100%;
        height: calc(100vh - 300px);
    }

    .change-btns {
        position: absolute;
        display: flex;
        height: 40px;
        user-select: none;
        z-index: 1;
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

    .table-wrap {
        width: 100%;
        height: calc(100% - 111px);
    }

    .fill {
        width: 100%;
        height: calc(100vh - 310px);
        /* height: calc(100% - 111px); */
    }

    .empty-text {
        display: flex;
        color: #909399;
        justify-content: center;
        align-content: center;
        align-items: center;
    }

    .lcdp-dialog ::v-deep .el-dialog {
        width: 970px;
        height: 60%;
        max-height: 700px;
    }

    .lcdp-dialog ::v-deep .el-dialog__title {
        color: #333651;
    }

    .lcdp-dialog ::v-deep .el-dialog__body {
        width: 100%;
        height: calc(100% - 42px);
    }

    .icon-qingqibing_xinxi {
        position: absolute;
        margin-left: 4px;
    }
</style>
<style lang="scss" scoped>
    ::v-deep .lcdp-table .participantTable .el-table__body-wrapper {
        height: calc(100% - 96px) !important;
    }
</style>
