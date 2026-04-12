<template>
    <div
        class="svgDiv"
        :style="mystyle"
    >
        <svg
            :width="start.width"
            :height="start.height"
            :viewBox="'0 0 '+ start.width+' '+start.height"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            class="svg-relative"
            xmlns:xlink="http://www.w3.org/1999/xlink"
        >
            <use
                :xlink:href="'#bpm-start-'+state"
                svg
                :width="start.width"
                :height="start.height"
                x="0"
                y="0"
            />
            <!--        <svg width="52" height="52"-->
            <!--        :viewBox="'0 0 '+ 1024+' '+1024">-->
            <!--      <path d="M512 512m-307.2 0a307.2 307.2 0 1 0 614.4 0 307.2 307.2 0 1 0-614.4 0Z" fill="#F4FAE6" ></path>-->
            <!--      <path d="M435.2 640V384l230.4 128z" fill="#94C833" ></path>-->
            <!--      <path d="M512 204.8c169.3952 0 307.2 137.8048 307.2 307.2s-137.8048 307.2-307.2 307.2S204.8 681.3952 204.8 512 342.6048 204.8 512 204.8m0-25.6C328.192 179.2 179.2 328.192 179.2 512s148.992 332.8 332.8 332.8 332.8-148.992 332.8-332.8S695.808 179.2 512 179.2z" fill="#94C833" ></path>-->
            <!--      <use xlink:href="#bpm-start"></use>-->
            <!--      <g-->
            <!--        :id="start.id+'_g'"-->
            <!--        pointer-events="fill"-->
            <!--        :title="$bpm_t('hussar-startFlow.start')"-->
            <!--        transform="translate(2, 2)"-->
            <!--      >-->
            <!--        <circle-->
            <!--          :id="start.id+'bg_frame'"-->
            <!--          :cx="(start.width - 4)/2"-->
            <!--          :cy="(start.width - 4)/2"-->
            <!--          :r="(start.width - 4)/2"-->
            <!--          :stroke="userBorder"-->
            <!--          :fill="userRect"-->
            <!--          stroke-width="2"-->
            <!--        />-->
            <!--        <path-->
            <!--          :id="start.id"-->
            <!--          :fill="userContent"-->
            <!--          stroke="none"-->
            <!--          :d="'M'+(start.width/3+2)+' '+(start.width/3-3)+' L'+(start.width/3+2)+' '+(start.width/3*2)+' L'+(start.width/3*2-2)+' '+(start.width/2-2)+' z'"-->
            <!--        />-->
            <!--      </g>-->
        </svg>
        <!--    </svg>-->
        <p
            class="svgText flow-text"
        >
             {{ start.name }}
        </p>
    </div>
</template>
<script>
    import '../showWorkFlow.css';

    export default {
        name: 'Start',
        props: {
            start: {
                type: Object,
                default() {
                    return null;
                }
            }
        },
        data() {
            return {};
        },
        computed: {
            // 区域样式
            mystyle() {
                return {
                    'top': `${this.start.y}px`,
                    'left': `${this.start.x}px`,
                    'width': `${this.start.width}px`,
                    'height': `${this.start.height}px`
                };
            },
            // 文本样式
            pStyle() {
                return {
                    'top': `${this.start.height}px`,
                    'left': `${this.start.width / 2 - this.start.name.length * 6}px`
                };
            },
            state() {
                return 'user';
            }
            // 路径颜色
            // userBorder() {
            //   if (this.start.state === 'finish') {
            //     return '#27C3B0';
            //   } else if (this.start.state === 'complete') {
            //     return '#2794F8';
            //   } else if (this.start.state === 'reject') {
            //     return '#F77E5C';
            //   } else {
            //     return 'rgba(226, 226, 226, 0.8)';
            //   }
            // },
            // 填充当前区域颜色
            // userRect() {
            //   if (this.start.state === 'finish') {
            //     return '#27C3B0';
            //   } else if (this.start.state === 'complete') {
            //     return '#2794F8';
            //   } else if (this.start.state === 'reject') {
            //     return 'rgba(247, 126, 92, 0.1)';
            //   } else {
            //     return 'rgba(216, 216, 216, 0.1)';
            //   }
            // },
            // userContent() {
            //   if (this.start.state === 'finish') {
            //     return '#ffffff';
            //   } else if (this.start.state === 'complete') {
            //     return '#ffffff';
            //   } else if (this.start.state === 'suspend') {
            //     return 'rgba(247, 126, 92, 0.1)';
            //   } else if (this.start.state === 'revoke') {
            //     return 'rgba(216, 216, 216, 1)';
            //   } else {
            //     return 'rgba(226, 226, 226, 0.8)';
            //   }
            // }
        }
    };
</script>
<style lang="scss" scoped>
</style>
