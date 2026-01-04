<template>
    <div
        class="svgDiv"
        :style="mystyle"
    >
        <svg
            :width="inclusive.width"
            :height="inclusive.height"
            :viewBox="'0 0 '+ inclusive.width+' '+inclusive.height"
            version="1.1"
            class="svg-relative"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
        >
            <use
                :xlink:href="'#bpm-inclusive-gateway-'+state"
                :width="inclusive.width"
                :height="inclusive.height"
                x="0"
                y="0"
            />
            <g
                :id="inclusive.id+'_g'"
                :title="'多路网关'"
                transform="translate(0.2,0.2)"
            >
                <!--          <svg width="50" height="50" viewBox="100 100 1024 1024">-->
                <!--              <path d="M512 128l384 383.9744-384 384-384-384z" :fill="userContent" ></path>-->
                <!--              <path d="M512 435.2c42.3424 0 76.8 34.4576 76.8 76.8s-34.4576 76.8-76.8 76.8-76.8-34.4576-76.8-76.8 34.4576-76.8 76.8-76.8m0-51.2a128 128 0 1 0 0.0256 256.0256A128 128 0 0 0 512 384z" :fill="userBorder" ></path>-->
                <!--              <path d="M512 164.1984L859.8016 512 512 859.8016 164.1984 512 512 164.1984M512 128L128 512l384 384 384-384L512 128z" :fill="userBorder" ></path>-->
                <!--          </svg>-->
                <!--        <use xlink:href="#bpm-inclusive-gateway"-->
                <!--             :width="inclusive.width+7.5"-->
                <!--             :height="inclusive.height+7.5"-->
                <!--             :fill="userContent"-->
                <!--             :stroke="userBorder"-->
                <!--             x="-4"-->
                <!--             y="-4"></use>-->
                <!--        <path-->
                <!--          :id="inclusive.id+'bg_frame'"-->
                <!--          :d="'M1 '+inclusive.width/2+' L'+inclusive.width/2+' 0  L'+inclusive.width+' '+inclusive.width/2+' L'+inclusive.width/2+' '+ inclusive.width+'  z'"-->
                <!--          :fill="userContent"-->
                <!--          :stroke="userBorder"-->
                <!--          style="stroke-width:1"-->
                <!--        />-->
                <!--        <circle-->
                <!--          :id="inclusive.id+'circle'"-->
                <!--          :stroke="userBorder"-->
                <!--          :cx="inclusive.width/2"-->
                <!--          :cy="inclusive.width/2"-->
                <!--          :r="inclusive.width/3.5"-->
                <!--          style="fill:none;stroke-width:2.5"/>-->
            </g>
        </svg>
        <p class="svgText flow-text">
            {{ inclusive.name }}
        </p>
    </div>
</template>
<script>
    import '../showWorkFlow.css';

    export default {
        name: 'Inclusive',
        props: {
            inclusive: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {};
        },
        computed: {
            mystyle() {
                return {
                    'top': `${this.inclusive.y}px`,
                    'left': `${this.inclusive.x}px`,
                    'width': `${this.inclusive.width}px`,
                    'height': `${this.inclusive.height}px`
                };
            },
            state() {
                if (this.inclusive.state === 'finish') {
                    return 'finish';
                } else if (this.inclusive.state === 'complete') {
                    return 'finish';
                } else if (this.inclusive.state === 'reject') {
                    return 'finish';
                } else if (this.inclusive.state === 'revoke') {
                    return 'finish';
                } else if (this.inclusive.state === 'suspend') {
                    return 'finish';
                } else {
                    return 'todo';
                }
            },
            // userContent() {
            //   if (this.inclusive.state === 'finish') {
            //     return 'rgba(233, 249, 247, 1)';
            //   } else if (this.inclusive.state === 'complete') {
            //     return 'rgba(39, 148, 248, 0.1)';
            //   } else if (this.inclusive.state === 'reject') {
            //     return 'rgba(247, 126, 92, 0.1)';
            //   } else if (this.inclusive.state === 'revoke') {
            //     return 'rgba(255, 195, 93, 0.1)';
            //   } else if (this.inclusive.state === 'suspend') {
            //     return 'rgba(115, 208, 255, 0.1)';
            //   } else {
            //     return 'rgba(216, 216, 216, 0.1)';
            //   }
            // }
        },
        methods: {}
    };
</script>
<style scoped>
</style>
