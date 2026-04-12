<template>
    <div
        ref="flow"
        v-loading="loading"
        class="flowContainer"
        :style="{height:'500px'}"
        @scroll.passive="handleScroll"
        @click="filterTableData('all')"
    >
        <div
            v-if="popMsg && popMsg.length"
            id="legend"
        >
      <span
          class="legendIcon"
          style="background: #1F8AFF;"
      />
            <span class="legendfont">开始</span>
            <span
                class="legendIcon"
                style="background: #41CC8B;"
            />
            <span class="legendfont">进行中</span>
            <!--<span class="legendIcon" style="background: #FBFBFB;border: 1px solid #D8D9D8;"></span>
            <span>{{$bpm_t('hussar-startFlow.notYet')}}</span>-->
            <span
                class="legendIcon"
                style="background: #FF5251;"
            />
            <span class="legendfont">驳回节点</span>
            <span
                class="legendIcon"
                style="background: #33CCCC;"
            />
            <span class="legendfont">挂起</span>
            <!--      <span class="legendIcon" style="background: #FFC35D;"></span>-->
            <!--      <span>{{$bpm_t('hussar-startFlow.revoke')}}</span>-->
            <span
                class="legendIcon"
                style="background: #FF9F0D;"
            />
            <span>已超时</span>
        </div>
        <div
            ref="scrollContainer"
            class="scrollContainer"
        >
            <div
                ref="svgContainer"
                class="svgContainer"
                :width="svgConWidth"
                :height="svgConHeight"
                :class="svgConStyle"
            >
                <paths
                    v-if="path && path.length"
                    :path="path"
                    :width="width"
                    :height="height"
                />

                <start
                    v-for="startItem in start"
                    :key="startItem.id"
                    :start="startItem"
                />
                <user
                    v-for="userItem in user"
                    :key="userItem.id"
                    :no-hover="noHover"
                    :user="userItem"
                    :scroll-y="scrollT"
                    :height="height"
                    :flow-height="flowHeight"
                    @filterTableData="filterTableData"
                />
                <end
                    v-for="endItem in end"
                    :key="endItem.id"
                    :end="endItem"
                />
                <parallel
                    v-for="parallelItem in parallel"
                    :key="parallelItem.id"
                    :parallel="parallelItem"
                />
                <inclusive
                    v-for="inclusiveItem in inclusive"
                    :key="inclusiveItem.id"
                    :inclusive="inclusiveItem"
                />
                <exclusive
                    v-for="exclusiveItem in exclusive"
                    :key="exclusiveItem.id"
                    :exclusive="exclusiveItem"
                />
                <call
                    v-for="callItem in call"
                    :key="callItem.id"
                    :call="callItem"
                    :business-id="businessId"
                    @showCallTable="showCallTable"
                />
                <serviceTask
                    v-for="serviceItem in serviceTaskData"
                    :key="serviceItem.id"
                    :service-task="serviceItem"
                />
                <receiveTask
                    v-for="receiveItem in receiveTaskData"
                    :key="receiveItem.id"
                    :receive-task="receiveItem"
                />
                <div
                    v-if="done && !newNode.length"
                    class="empty-render"
                >
                    <div class="img-content"/>
                    <div class="text-content">
                        未匹配到相应流程
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import start from './start/index.vue';
    import user from './user/index.vue';
    import end from './end/index.vue';
    import paths from './polyLine/index.vue';
    import parallel from './parallel/index.vue';
    import inclusive from './inclusive/index.vue';
    import exclusive from './exclusive/index.vue';
    import call from './callActivity/index.vue';
    import serviceTask from './serviceTask/index.vue';
    import receiveTask from './receiveTask/index.vue';
    import {askFlowProgress, askFlowMsg, askFlow} from '@/api/workflow/task';


    import './showWorkFlow.css';

    export default {
        components: {
            start,
            user,
            end,
            paths,
            parallel,
            inclusive,
            exclusive,
            call,
            serviceTask,
            receiveTask,
        },
        props: {
            noHover: {
                type: Boolean,
                default: false,
            },
            processInsId: {
                type: String,
                default: ''
            },
            businessId: {
                type: String,
                default: ''
            },
            processKey: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
              loading:true,
                fullscreen: 410,
                newNode: [],
                popMsg: [],
                path: undefined,
                start: undefined,
                end: undefined,
                user: undefined,
                parallel: undefined,
                inclusive: undefined,
                exclusive: undefined,
                call: undefined,
                serviceTaskData: undefined,
                receiveTaskData: undefined,
                width: undefined,
                height: undefined,
                svgConWidth: undefined,
                svgConHeight: undefined,
                scrollT: 0,
                scrollL: 0,
                offsetT: 0,
                offsetX: 0,
                flowHeight: 0,
                svgConStyle: [],
                done: false,
            };
        },
        computed: {
            fixedStyleFull() {
                return {
                    'top': `${this.scrollT + 18}px`,
                };
            },
            fixedStyleClose() {
                return {
                    'top': `${this.scrollT + 24}px`,
                };
            },
        },
         created() {

          new Promise(async ()=>{this.loading = true;

            await this.getWorkflowData();
            await this.getPopMsg();
            this.initSvg();
            this.loading = false;
            }).then(()=>{
          } ).catch(()=>{
            this.loading = false;
          });

        },
        beforeUpdate() {
            // const this = this;
            window.onresize = async function () {
                if (this && this.getWorkflowData) {
                    await this.getWorkflowData();
                }
                if (this && this.initSvg) {
                    this.initSvg();
                }
            };
        },
        beforeUnmount() {
            window.onresize = null;
        },
        mounted() {
            this.handleOffset();
        },
        methods: {
            showCallTable(id) {
                this.$emit('showCallTable', id);
            },
            handleOffset() {
                this.offsetT = this.$refs.flow.getBoundingClientRect().y;
                this.offsetX = this.$refs.flow.getBoundingClientRect().x;
                this.flowHeight = this.$refs.flow.getBoundingClientRect().height;
            },
            handleScroll() {
                this.scrollT = this.$refs.flow.scrollTop;
                this.scrollL = this.$refs.flow.scrollLeft;
            },
            close() {
                this.$emit('close');
            },
            filterTableData(id) {
                this.$emit('filterTableData', id);
            },

            async getWorkflowData() {
                let res;
                // 存在业务id(businessId)，使用businessId查询流程图

                if (this.businessId || this.processInsId) {
                    res = await askFlowProgress({processInsId: this.processInsId, businessId: this.businessId});
                }
                // 不存在业务id，或流程未开始，使用流程标识processKey查询流程图
                if (!res || !Object.keys(res).length) {
                    this.fullscreen = 110;
                    // console.log(this.processKey)
                    res = await askFlow({processIdentityKey: this.processKey, processKey: this.processKey});
                }
                if (!res || !Object.keys(res).length) {
                    // console.log('unknown error');
                    return;
                }
                this.dealWorkflowData(res);
            },
            async getPopMsg() {
                if (!this.businessId) {
                    return;
                }
                const popMsg = await askFlowMsg({processInsId: this.processInsId, businessId: this.businessId});
                this.popMsg = popMsg && popMsg.length ? popMsg : this.popMsg;
                this.fullscreen = this.popMsg.length ? 410 : 110;
            },
            dealWorkflowData(data) {
                this.newNode = data.data;
                this.width = data.width;
                this.height = data.height;
            },
            dealSvgStyle() {
                if (this.$refs.scrollContainer.offsetWidth >= this.width) {
                    this.svgConWidth = this.width;
                    this.svgConHeight = this.height;
                    if (this.$refs.scrollContainer.offsetHeight <= this.height) {
                        this.svgConStyle = ['svg-top'];
                    } else {
                        this.svgConStyle = ['svg-vertical-position'];
                    }
                } else {
                    this.svgConWidth = this.$refs.scrollContainer.offsetWidth;
                    this.svgConHeight = this.$refs.scrollContainer.offsetHeight;
                    if (this.$refs.scrollContainer.offsetHeight > this.height) {
                        this.svgConStyle = ['svg-left'];
                    } else {
                        this.svgConStyle = ['svg-scroll-position'];
                    }
                }
            },
            initSvg() {
                const user = [];
                const start = [];
                const end = [];
                const parallel = [];
                const inclusive = [];
                const exclusive = [];
                const call = [];
                const path = [];
                const serviceTaskData = [];
                const receiveTaskData = [];
                const finishPath = [];

                if (this.newNode) {
                    this.newNode.forEach(function (value) {
                        if (value.type === 'sequenceFlow') {
                            if (value.state === 'next') {
                                path.push(value);
                            } else {
                                finishPath.push(value);
                            }
                        } else if (value.type === 'startEvent') {
                            start.push(value);
                        } else if (value.type === 'endEvent') {
                            end.push(value);
                        } else if (value.type === 'parallelGateway') {
                            parallel.push(value);
                        } else if (value.type === 'inclusiveGateway') {
                            inclusive.push(value);
                        } else if (value.type === 'exclusiveGateway') {
                            exclusive.push(value);
                        } else if (value.type === 'callActivity') {
                            call.push(value);
                        } else if (value.type === 'receiveTask') {
                            receiveTaskData.push(value);
                        } else if (value.type === 'serviceTask') {
                            serviceTaskData.push(value);
                        } else {
                            user.push(value);
                        }
                    });
                }
                for (let j = 0; j < user.length; j++) {
                    for (let i = 0; i < this.popMsg.length; i++) {
                        if (user[j].id === this.popMsg[i].id) {
                            user[j].nodes = this.popMsg[i];
                        }
                    }
                }
                this.start = start;
                this.user = user;
                if (this.start.length > 0)
                    //console.log(this.start ,'流程图有数据了')
                    this.end = end;
                this.path = path.concat(finishPath);
                this.parallel = parallel;
                this.inclusive = inclusive;
                this.exclusive = exclusive;
                this.call = call;
                this.serviceTaskData = serviceTaskData;
                this.receiveTaskData = receiveTaskData;
                this.done = true;
                if (this.done && !this.newNode.length) {
                    this.svgConStyle = ['svg-center'];
                }
            },
        },
    };
</script>

<style scoped>
    #legend {
        position: absolute;
        right: 50px;
        top: 20px;
        z-index: 4;
    }

    #legend span {
        display: inline-block;
        font-size: 14px;
    }

    .legendIcon {
        width: 11px;
        height: 10px;
        /*-webkit-border-radius: 50%;*/
        /*-moz-border-radius: 50%;*/
        /*border-radius: 50%;*/
        margin: 0 7px;
    }

    .legendfont {
        margin-right: 23px;
    }

    .flowContainer {
        position: relative;
        padding-top: 38px;
    }

    .scrollContainer {
        width: 100%;
        height: 100%;
        overflow: scroll;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .scrollContainer::-webkit-scrollbar {
        width: 4px;
        height: 4px
    }

    .svgContainer {
        flex-shrink: 0;
        position: absolute;
        /*与父容器左上顶齐*/
        top: -30px;
        left: 0;
    }

    .svg-vertical-position {
        position: relative;
        flex-shrink: 0;
    }

    .svg-center {
        position: relative;
    }

    .svg-scroll-position {
        position: absolute;
        top: 0;
        left: 0;
    }

    .svg-top {
        top: 0;
        position: absolute;
    }

    .svg-left {
        left: 0;
        position: absolute;
    }
</style>
