<template>
  <div
    class="svgDiv"
    :style="mystyle"
    @click="showCallTable(requestData)"
  >
    <svg
      :width="call.width"
      :height="call.height"
      :viewBox="'0 0 '+ call.width+' '+call.height"
      version="1.1"
      class="svg-relative"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <use
        v-if="!isCountersign"
        :xlink:href="'#bpm-call-activity-'+state"
        :width="call.width"
        :height="call.height"
        x="0"
        y="0"
      />
      <use
        v-else
        :xlink:href="'#bpm-call-activity-countersign-'+state"
        :width="call.width"
        :height="call.height"
        x="0"
        y="0"
      />
      <g
        :id="call.id+'_g'"
        pointer-events="fill"
        title="外部子流程"
        transform="translate(2,2)"
      >
        <!--        <use :xlink:href="'#bpm-call-activity-'+state"-->
        <!--             :width="44" :height="40"-->
        <!--             x="-4" y="-7"></use>-->
        <!--        <svg width="65" height="50" x="-14" y="-12" viewBox="0 0 1024 1024">-->
        <!--        <path d="M128 230.4h768v563.2H128z" :fill="userContent" ></path>-->
        <!--        <path d="M179.2 230.4h25.6v563.2H179.2zM819.2 230.4h25.6v563.2h-25.6z" :fill="userBorder" ></path>-->
        <!--        <path d="M896 204.8H128a25.6 25.6 0 0 0-25.6 25.6v563.2a25.6 25.6 0 0 0 25.6 25.6h768a25.6 25.6 0 0 0 25.6-25.6V230.4a25.6 25.6 0 0 0-25.6-25.6z m0 588.8H128V230.4h768v563.2z" :fill="userBorder" ></path>-->
        <!--        <path d="M640 563.2a76.544 76.544 0 0 0-72.0896 51.2H358.4v-179.2h209.5104A76.5952 76.5952 0 0 0 716.8 409.6a76.8 76.8 0 0 0-76.8-76.8 76.544 76.544 0 0 0-72.0896 51.2H358.4V204.8h-51.2v460.8h260.7104A76.5952 76.5952 0 0 0 716.8 640a76.8 76.8 0 0 0-76.8-76.8z" :fill="userBorder" ></path>-->
        <!--      </svg>-->
        <!--        <rect-->
        <!--          :id="call.id+'bg_frame'"-->
        <!--          :width="call.width-4"-->
        <!--          :height="call.height-4"-->
        <!--          rx="10"-->
        <!--          ry="10"-->
        <!--          :stroke="userBorder"-->
        <!--          stroke-width="4"-->
        <!--          :fill="userContent"-->
        <!--        ></rect>>-->
        <!--        <path v-if="call.state==='finish'"-->
        <!--              d="M72 18 L76 22 L82 14"-->
        <!--              fill="none"-->
        <!--              stroke="#27C3B0"-->
        <!--              stroke-linejoin="round"></path>-->
        <!--        <path v-else-if="call.state==='complete'"-->
        <!--              d="M72 16 L72 22 L77 19 Z"-->
        <!--              fill="#2794F8"-->
        <!--              stroke="#2794F8"-->
        <!--              stroke-linejoin="round"></path>-->
      </g>
    </svg>
    <p class="svgText flow-text">
      {{ call.name }}
    </p>
    <svg
      class="callSvgImg svgImg2"
      width="26px"
      height="26px"
      viewBox="0 0 26 26"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      @click.stop="showCallTable(requestData)"
    >
      <g
        id="页面-2"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g
          id="画板"
          transform="translate(-76.000000, -134.000000)"
          :fill="userBorder"
          fill-rule="nonzero"
        >
          <g
            id="形状结合-2"
            transform="translate(76.964975, 134.000000)"
          >
            <!--            <path d="M6.92484973,7.22222222 L6.924,9.386 L11.373,12.277 L15.479,12.277 L15.4799375,9.38888889 L24.0350252,9.38888889 L24.0350252,16.6111111 L20.4704053,16.6111111 L20.4704053,23.1111111 L10.3967046,23.1113726 C9.96721546,24.759527 8.09723824,26 5.85546376,26 C3.29617299,26 1.22145789,24.3832505 1.22145789,22.3888889 C1.22145789,20.3945273 3.29617299,18.7777778 5.85546376,18.7777778 C8.09723824,18.7777778 9.96721546,20.0182508 10.3967046,21.6664052 L19.044,21.666 L19.0445574,16.6111111 L15.4799375,16.6111111 L15.479,13.722 L11.262,13.722 L6.867,16.611 L6.92484973,16.6111111 L6.92484973,18.7777778 L5.49900177,18.7777778 L5.499,16.613 L-4.4408921e-15,13.0402468 L5.556,9.388 L5.49900177,9.38888889 L5.49900177,7.22222222 L6.92484973,7.22222222 Z M5.85546376,20.2222222 C4.01408163,20.2222222 2.64730585,21.2873005 2.64730585,22.3888889 C2.64730585,23.4904772 4.01408163,24.5555556 5.85546376,24.5555556 C7.69684589,24.5555556 9.06362167,23.4904772 9.06362167,22.3888889 C9.06362167,21.2873005 7.69684589,20.2222222 5.85546376,20.2222222 Z M6.22712023,10.6547935 L2.62409794,13.022738 L6.19673784,15.3441917 L9.79976013,12.9762472 L6.22712023,10.6547935 Z M22.6084644,10.8333333 L16.9050725,10.8333333 L16.9050725,15.1666667 L22.6084644,15.1666667 L22.6084644,10.8333333 Z M5.85546376,0 C8.41475453,0 10.4894696,1.61674951 10.4894696,3.61111111 C10.4894696,5.60547271 8.41475453,7.22222222 5.85546376,7.22222222 C3.29617299,7.22222222 1.22145789,5.60547271 1.22145789,3.61111111 C1.22145789,1.61674951 3.29617299,0 5.85546376,0 Z M5.85546376,1.44444444 C4.01408163,1.44444444 2.64730585,2.50952277 2.64730585,3.61111111 C2.64730585,4.71269945 4.01408163,5.77777778 5.85546376,5.77777778 C7.69684589,5.77777778 9.06362167,4.71269945 9.06362167,3.61111111 C9.06362167,2.50952277 7.69684589,1.44444444 5.85546376,1.44444444 Z" id="形状结合"></path>-->
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>
<script>
import '../showWorkFlow.css';
export default {
  name: 'CallActivity',
  props: {
    call: {
      type: Object,
        default(){
          return {};
        }
    },
    choose: {
      type: String,
        default(){
          return '';
        }
    },
    businessId: {
      type:String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {
      // 会签节点开关状态改变时，切换子流程会签的图标
      isCountersign() {
          return false;
      },
    requestData() {
      let requestData = undefined;
      if(this.choose === 'showflow'){
        requestData = [];
        this.call.callActivityElement.forEach(function(value) {
           requestData.push(value);
        });
      } else {
          requestData = {
              supProcessInsId: this.call.processInsId,
              businessId: this.businessId,
              taskDefinitionKey: this.call.id
          }
      }
      return requestData;
    },
    mystyle() {
      return {
        'top': `${this.call.y}px`,
        'left': `${this.call.x}px`,
        'width': `${this.call.width}px`,
        'height': `${this.call.height}px`,
        'cursor': this.call.processInsId ? 'pointer' : 'default'
      };
    },
    pStyle() {
      return {
        'top': `${this.call.height}px`,
        'left': `${this.call.width / 2 - this.call.name.length * 6}px`
      };
    },
    state() {
      const callState = this.call.state;
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
/*    userContent() {
      const callState = this.call.state;
      if (callState === 'finish') {
        return 'rgba(233, 249, 247, 1)';
      } else if (callState === 'complete') {
        return 'rgba(39, 148, 248, 0.1)';
      } else if (callState === 'reject') {
        return 'rgba(247, 126, 92, 0.1)';
      } else if (callState === 'revoke') {
        return 'rgba(255, 195, 93, 0.1)';
      } else if (callState === 'suspend') {
        return 'rgba(115, 208, 255, 0.1)';
      } else if (callState === 'overtime') {
        return 'rgba(255, 64, 64, 0.1)';
      } else {
        return 'rgba(216, 216, 216, 0.1)';
      }
    },*/
  },
  methods: {
    showCallTable(id) {
      if(!this.call.processInsId) return;
      this.$emit('showCallTable', id);
    },
  }
};
</script>
<style scoped>
.callSvgImg {
  transform: scale(1.55);
  top: calc(50% - 13px);
  left: calc(50% - 13px);
}
</style>
