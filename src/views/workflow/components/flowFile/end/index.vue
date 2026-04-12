<template>
    <div
        class="svgDiv"
        :style="mystyle"
    >
        <svg
            :width="end.width"
            :height="end.height"
            :viewBox="'0 0 '+ end.width+' '+end.height"
            class="svg-relative"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
        >
            <g
                :id="end.id+'_g'"
                pointer-events="fill"
                :title="'结束'"
                transform="translate(2, 2)"
            >
                <use
                    :xlink:href="'#bpm-end-user'"
                    :width="end.width"
                    :height="end.height"
                    x="0"
                    y="0"
                />
                <!--        <svg width="52" height="52" viewBox="160 160 1024 1024">-->
                <!--          <path d="M512 512m-307.2 0a307.2 307.2 0 1 0 614.4 0 307.2 307.2 0 1 0-614.4 0Z" :fill="userRect"></path>-->
                <!--&lt;!&ndash;          正方形&ndash;&gt;-->
                <!--          <path d="M409.6 409.6h204.8v204.8h-204.8z" :fill="userContent"></path>-->
                <!--&lt;!&ndash;          外圆&ndash;&gt;-->
                <!--          <path d="M512 204.8c169.3952 0 307.2 137.8048 307.2 307.2s-137.8048 307.2-307.2 307.2S204.8 681.3952 204.8 512 342.6048 204.8 512 204.8m0-25.6C328.192 179.2 179.2 328.192 179.2 512s148.992 332.8 332.8 332.8 332.8-148.992 332.8-332.8S695.808 179.2 512 179.2z" :fill="userBorder"></path>-->
                <!--        </svg>-->
                <!--        <circle-->
                <!--          :id="end.id+'bg_frame'"-->
                <!--          :cx="(end.width - 4)/2"-->
                <!--          :cy="(end.width - 4)/2"-->
                <!--          :r="(end.width - 4)/2"-->
                <!--          :stroke="userBorder"-->
                <!--          :fill="userRect"-->
                <!--          stroke-width="2"-->
                <!--        />-->
                <!--        <rect-->
                <!--          :id="end.id"-->
                <!--          :x="(end.width - 4)/3"-->
                <!--          :y="(end.width - 4)/3"-->
                <!--          :width="(end.width - 4)/3"-->
                <!--          :height="(end.width - 4)/3"-->
                <!--          stroke="none"-->
                <!--          :fill="userContent"-->
                <!--        />-->
            </g>
        </svg>
        <p
            class="svgText flow-text"
        >
            {{ end.name }}
        </p>
    </div>
</template>

<script>
    import '../showWorkFlow.css';

    export default {
        name: 'End',
        props: {
            end: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {};
        },
        computed: {
            mystyle() {
                return {
                    'top': `${this.end.y}px`,
                    'left': `${this.end.x}px`,
                    'width': `${this.end.width}px`,
                    'height': `${this.end.height}px`
                };
            },
            pStyle() {
                return {
                    'top': `${this.end.height}px`,
                    'left': `${this.end.width / 2 - this.end.name.length * 6}px`
                };
            },
            state() {
                return "finish";
            },
            userBorder() {
                if (this.end.state === 'finish') {
                    return '#EE6867';
                } else if (this.end.state === 'complete') {
                    return '#EE6867';
                } else if (this.end.state === 'reject') {
                    return '#EE6867';
                } else {
                    return 'rgba(254,91,90,.5)';
                }
            },
            /*    userRect() {
                  if (this.end.state === 'finish') {
                    return '#FEF1F1';
                  } else if (this.end.state === 'complete') {
                    return '#FEF1F1';
                  } else if (this.end.state === 'reject') {
                    return '#FEF1F1';
                  } else {
                    return '#FEF1F1';
                  }
                },*/
            /*    userContent() {
                  if (this.end.state === 'finish') {
                    return '#EE6867';
                  } else if (this.end.state === 'complete') {
                    return '#EE6867';
                  } else if (this.end.state === 'suspend') {
                    return '#EE6867';
                  } else if (this.end.state === 'suspend.svg') {
                    return '#EE6867';
                  } else {
                    return 'rgba(254,91,90,.5)';
                  }
                }*/
        },
        methods: {}
    };
</script>
<style lang="scss" scoped>
    .svg-relative {
        position: relative;
    }
</style>
