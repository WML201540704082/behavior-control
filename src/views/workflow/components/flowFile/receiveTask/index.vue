<template>
  <div
    class="svgDiv"
    :style="myStyle"
  >
    <svg
      :width="receiveTask.width"
      :height="receiveTask.height"
      :viewBox="'0 0 '+ receiveTask.width+' '+receiveTask.height"
      version="1.1"
      class="svg-relative"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <use
        :xlink:href="'#bpm-receive-task-'+state"
        :width="receiveTask.width"
        :height="receiveTask.height"
        x="0"
        y="0"
      />
      <g
        :id="receiveTask.id+'_g'"
        pointer-events="fill"
        title="自动活动"
        transform="translate(1, 1)"
      >
        <!--        <rect :id="receiveTask.id+'bg_frame'"
                              :width="receiveTask.width-2"
                              :height="receiveTask.height-2"
                              rx="5"
                              ry="5"
                              :stroke="receiveTaskBorder"
                              stroke-width="1"
                              :fill="receiveTaskContent"
                        ></rect>
                        <g :id="receiveTask.id +'receiveTask'">
                          <svg t="1626143596608" class="icon" viewBox="0 0 1450 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="47963" width="68" height="48">
                            <path d="M725.333333 597.333333c-47.061333 0-85.333333-38.272-85.333333-85.333333h-64a149.333333 149.333333 0 1 0 298.666667 0h-64c0 47.061333-38.272 85.333333-85.333334 85.333333z" :fill="receiveTaskBorder" p-id="47966"></path>
                            <path d="M853.333333 512v64h149.333334v170.666667H448v-170.666667h170.666667v-64H384v298.666667h682.666667V512z" :fill="receiveTaskBorder" p-id="47967"></path>
                            <path d="M746.666667 320h-42.666667v128h-64l85.333333 85.333333 85.333334-85.333333h-64z" :fill="receiveTaskBorder" p-id="47968"></path>
                            <path d="M512 213.333333v362.666667h106.666667v-64h-42.666667V277.333333h298.666667v234.666667h-21.333334v64h85.333334V213.333333z" :fill="receiveTaskBorder" p-id="47969"></path>
                          </svg>
                        </g>-->
      </g>
    </svg>
    <p
      class="svgText flow-text"
      v-html="oldName"
    />
  </div>
</template>

<script>
    import '../showWorkFlow.css';

    export default {
        name: 'ReceiveTask',
        props: {
            receiveTask: {
                type: Object,
                default(){
                    return {};
                }
            }
        },
        data() {
            return {
                oldName: '',
                textWidth: 0,
                transformX: ''
            };
        },
        computed: {
            myStyle() {
                return {
                    'top': `${this.receiveTask.y}px`,
                    'left': `${this.receiveTask.x}px`,
                    'width': `${this.receiveTask.width}px`,
                    'height': `${this.receiveTask.height}px`,
                    'cursor': 'pointer'
                };
            },
            state() {
                const callState = this.receiveTask.state;
                if (callState === 'finish') {
                    return 'finish';
                } else if (callState === 'complete') {
                    return 'complete';
                } else if (callState === 'reject') {
                    return 'reject';
                } else if (callState === 'revoke') {
                    return 'complete';
                } else if (callState === 'suspend') {
                    return 'suspend';
                } else if (callState === 'overtime') {
                    return 'overtime';
                } else {
                    return 'todo';
                }
            },
            /*    receiveTaskBorder() {
                  if (this.receiveTask.state === 'finish') {
                    return '#27C3B0';
                  } else if (this.receiveTask.state === 'complete') {
                    return '#2794F8';
                  } else if (this.receiveTask.state === 'suspend') {
                    return '#73D0FF';
                  } else {
                    return '#D8D8D8';
                  }
                },
                receiveTaskContent() {
                  if (this.receiveTask.state === 'finish') {
                    return 'rgba(233, 249, 247, 1)';
                  } else if (this.receiveTask.state === 'complete') {
                    return 'rgba(39, 148, 248, 0.1)';
                  } else if (this.receiveTask.state === 'suspend') {
                    return 'rgba(115, 208, 255, 0.1)';
                  } else {
                    return 'rgba(216, 216, 216, 0.1)';
                  }
                }*/
        },
        watch: {},
        mounted() {
            this.$nextTick(() => {
                this.initValueText();
            });
        },
        methods: {
            // 初始化文本
            isNotEmpty(data) {
                if (data && data.length > 0) {
                    return data.filter(item => item && item.trim());
                }
                return [];
            },
            initValueText() {
                // const this = this;
                this.oldName = '';
                const newName = this.isNotEmpty(this.receiveTask.nodeNameArr);
                if (newName.length > 0) {
                    this.oldName = newName.join('<br>');
                } else {
                    this.oldName = this.receiveTask.name;
                }
                this.textWidth = this.receiveTask.textWidth || this.receiveTask.width;
                const transX = (this.textWidth - this.receiveTask.width) / 2;
                this.transformX = `translateX(-${transX}px)`;
            },
        },
    };
</script>

<style scoped>
</style>
