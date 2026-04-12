<template>
  <div
    class="svgDiv"
    :style="mystyle"
  >
    <svg
      :width="exclusive.width"
      :height="exclusive.height"
      :viewBox="'0 0 '+ exclusive.width+' '+exclusive.height"
      class="svg-relative"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <use
        :xlink:href="'#bpm-exclusive-gateway-'+state"
        :width="exclusive.width"
        :height="exclusive.height"
        x="0"
        y="0"
      />
      <!--      <svg  width="50" height="50"-->
      <!--              :viewBox="'0 0 '+ 1024+' '+1024"-->
      <!--      >-->
      <!--        <path d="M512 128l384 383.9744-384 384-384-384z" :fill="userContent" ></path>-->
      <!--        <path d="M580.2752 409.6L512 477.8752 443.7248 409.6 409.6 443.7248 477.8752 512 409.6 580.2752 443.7248 614.4 512 546.1248 580.2752 614.4 614.4 580.2752 546.1248 512 614.4 443.7248z" :fill="userBorder" ></path>-->
      <!--        <path d="M512 164.1984L859.8016 512 512 859.8016 164.1984 512 512 164.1984M512 128L128 512l384 384 384-384L512 128z" :fill="userBorder" ></path>-->
      <!--      </svg>-->
      <!--      <g-->
      <!--        :id="exclusive.id+'_g'"-->
      <!--        :title="$bpm_t('hussar-startFlow.handleOpinions')"-->
      <!--        transform="translate(0.2,0.2)"-->
      <!--      >-->
      <!--        <path-->
      <!--          :id="exclusive.id+'bg_frame'"-->
      <!--          :d="'M1 '+exclusive.width/2+' L'+exclusive.width/2+' 0  L'+exclusive.width+' '+exclusive.width/2+' L'+exclusive.width/2+' '+ exclusive.width+'  z'"-->
      <!--          :fill="userContent"-->
      <!--          :stroke="userBorder"-->
      <!--          style="stroke-width:1"-->
      <!--        />-->
      <!--        <g :id="exclusive.id+'cross'">-->
      <!--          <path-->
      <!--            :id="exclusive.id+'crosspath'"-->
      <!--            :stroke="userBorder"-->
      <!--            :fill="userBorder"-->
      <!--            :d="'M'+(exclusive.width-exclusive.width/2.85)/2+' '+(exclusive.width-exclusive.width/2.5)/2+' L'+((exclusive.width-exclusive.width/2.85)/2+4)+' '+(exclusive.width-exclusive.width/2.5)/2+' L'+((exclusive.width-exclusive.width/2.85)/2+exclusive.width/2.85)+' '+ ((exclusive.width-exclusive.width/2.5)/2+exclusive.width/2.5)+' L'+(((exclusive.width-exclusive.width/2.85)/2+exclusive.width/2.85)-4)+' '+((exclusive.width-exclusive.width/2.5)/2+exclusive.width/2.5)+' z'"-->
      <!--            style="stroke-width:0.2"-->
      <!--          />-->
      <!--          <path-->
      <!--            :id="exclusive.id+'crosspath2'"-->
      <!--            stroke="userBorder"-->
      <!--            :fill="userBorder"-->
      <!--            :d="'M'+(exclusive.width-exclusive.width/2.85)/2+' '+((exclusive.width-exclusive.width/2.5)/2+exclusive.width/2.5)+' L'+(((exclusive.width-exclusive.width/2.85)/2+exclusive.width/2.85)-4)+ ' '+(exclusive.width-exclusive.width/2.5)/2+'  L'+((exclusive.width-exclusive.width/2.85)/2+exclusive.width/2.85)+' '+(exclusive.width-exclusive.width/2.5)/2+' L'+((exclusive.width-exclusive.width/2.85)/2+4)+' '+((exclusive.width-exclusive.width/2.5)/2+exclusive.width/2.5)+'  z'"-->
      <!--            style="stroke-width:0.2"-->
      <!--          />-->
      <!--        </g>-->
      <!--      </g>-->
    </svg>
    <p class="svgText flow-text">
      {{ exclusive.name }}
    </p>
  </div>
</template>
<script>
import '../showWorkFlow.css';
export default {
  name: 'Exclusive',
  props: {
    exclusive: {
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
        'top': `${this.exclusive.y}px`,
        'left': `${this.exclusive.x}px`,
        'width': `${this.exclusive.width}px`,
        'height': `${this.exclusive.height}px`,
      };
    },
    state() {
      if (this.exclusive.state === 'finish') {
        return 'finish';
      } else if (this.exclusive.state === 'complete') {
        return 'finish';
      } else if (this.exclusive.state === 'reject') {
        return 'finish';
      } else if (this.exclusive.state === 'revoke') {
        return 'finish';
      } else if (this.exclusive.state === 'suspend') {
        return 'finish';
      } else {
        return 'todo';
      }
    },
    userContent() {
      if (this.exclusive.state === 'finish') {
        return 'rgba(233, 249, 247, 1)';
      } else if (this.exclusive.state === 'complete') {
        return 'rgba(253,245,234,1)';
      } else if (this.exclusive.state === 'reject') {
        return 'rgba(247, 126, 92, 0.1)';
      } else if (this.exclusive.state === 'revoke') {
        return 'rgba(255, 195, 93, 0.1)';
      } else if (this.exclusive.state === 'suspend') {
        return 'rgba(115, 208, 255, 0.1)';
      } else {
        return 'rgba(216, 216, 216, 0.1)';
      }
    }
  },
  methods: {}
};
</script>
<style scoped>
</style>
