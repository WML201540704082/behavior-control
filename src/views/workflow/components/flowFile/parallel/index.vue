<template>
  <div
    class="svgDiv"
    :style="mystyle"
  >
    <svg
      :width="parallel.width"
      :height="parallel.height"
      :viewBox="'0 0 '+ parallel.width+' '+parallel.height"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      class="svg-relative"
    >
      <g
        :id="parallel.id+'_g'"
        :title="'并行网关'"
        transform="translate(0.2,0.2)"
      >
        <use
          :xlink:href="'#bpm-parallel-gateway-'+state"
          :width="parallel.width"
          :height="parallel.height"
          x="0"
          y="0"
        />
        <!--        <svg width="50" height="50" viewBox="100 100 1024 1024">-->
        <!--        <path d="M512 128l384 383.9744-384 384-384-384z" :fill="userContent" ></path>-->
        <!--        <path d="M640 486.4h-102.4v-102.4h-51.2v102.4h-102.4v51.2h102.4v102.4h51.2v-102.4h102.4z" :fill="userBorder" ></path>-->
        <!--        <path d="M512 164.1984L859.8016 512 512 859.8016 164.1984 512 512 164.1984M512 128L128 512l384 384 384-384L512 128z" :fill="userBorder" ></path>-->
        <!--        </svg>-->
        <!--        <path-->
        <!--          :id="parallel.id+'bg_frame'"-->
        <!--          :d="'M1 '+parallel.width/2+' L'+parallel.width/2+' 0  L'+parallel.width+' '+parallel.width/2+' L'+parallel.width/2+' '+ parallel.width+'  z'"-->
        <!--          :fill="userContent"-->
        <!--          :stroke="userBorder"-->
        <!--          style="stroke-width:1"-->
        <!--        />-->
        <!--        <path-->
        <!--          :id="parallel.id+'path'"-->
        <!--          :d="'M'+(parallel.width)/4+' '+parallel.width/2+' L'+(parallel.width)/4*3+' '+parallel.width/2+' M'+parallel.width/2+' '+(parallel.width)/4+'  L'+parallel.width/2+' '+(parallel.width)/4*3 "-->
        <!--          :stroke="userBorder"-->
        <!--          style="fill:none;stroke-width:3"-->
        <!--        />-->
      </g>
    </svg>
    <p class="svgText flow-text">
      {{ parallel.name }}
    </p>
  </div>
</template>
<script>
import '../showWorkFlow.css';
export default {
  name: 'Parallel',
  props: {
    parallel: {
      type: Object,
        default(){
          return {};
        }
    }
  },
  data() {
    return {
    };
  },
  computed: {
    mystyle() {
      return {
        'top': `${this.parallel.y}px`,
        'left': `${this.parallel.x}px`,
        'width': `${this.parallel.width}px`,
        'height': `${this.parallel.height}px`
      };
    },
    state() {
      if (this.parallel.state === 'finish') {
        return 'finish';
      } else if (this.parallel.state === 'complete') {
        return 'complete';
      } else if (this.parallel.state === 'reject') {
        return 'reject';
      } else if (this.parallel.state === 'revoke') {
        return 'revoke';
      } else if (this.parallel.state === 'suspend') {
        return 'suspend';
      } else {
        return 'todo';
      }
    },
    // userBorder() {
    //   if (this.parallel.state === 'finish') {
    //     return '#1F8AFF';
    //   } else if (this.parallel.state === 'complete') {
    //     return '#41CC8B';
    //   } else if (this.parallel.state === 'reject') {
    //     return '#FF5251';
    //   } else if (this.parallel.state === 'revoke') {
    //     return '#41CC8B';
    //   } else if (this.parallel.state === 'suspend') {
    //     return '#33CCCC';
    //   } else {
    //     return '#CFDDEC';
    //   }
    // },
    // userContent() {
    //   if (this.parallel.state === 'finish') {
    //     return 'rgba(233, 249, 247, 1)';
    //   } else if (this.parallel.state === 'complete') {
    //     return 'rgba(39, 148, 248, 0.1)';
    //   } else if (this.parallel.state === 'reject') {
    //     return 'rgba(247, 126, 92, 0.1)';
    //   } else if (this.parallel.state === 'revoke') {
    //     return 'rgba(255, 195, 93, 0.1)';
    //   } else if (this.parallel.state === 'suspend') {
    //     return 'rgba(115, 208, 255, 0.1)';
    //   } else {
    //     return 'rgba(216, 216, 216, 0.1)';
    //   }
    // }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
</style>
