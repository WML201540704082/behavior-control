<template>
  <div
    class="svgDiv"
    :style="myStyle"
  >
    <svg
      :width="serviceTask.width"
      :height="serviceTask.height"
      :viewBox="'0 0 '+ serviceTask.width+' '+serviceTask.height"
      version="1.1"
      class="svg-relative"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <use
        :xlink:href="'#bpm-service-node-'+state"
        :width="serviceTask.width"
        :height="serviceTask.height"
        x="0"
        y="0"
      />
      <g
        :id="serviceTask.id+'_g'"
        pointer-events="fill"
        title="自动活动"
        transform="translate(1, 1)"
      >
        <!--<rect :id="serviceTask.id+'bg_frame'"
              :width="serviceTask.width-2"
              :height="serviceTask.height-2"
              rx="5"
              ry="5"
              :stroke="serviceTaskBorder"
              stroke-width="1"
              :fill="serviceTaskContent"
        ></rect>
        <g :id="serviceTask.id +'serviceTask'">
          <svg class="icon" viewBox="0 0 1450 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4093" width="68" height="48">
            <path d="M963.050667 629.333333V414.229333c0-75.605333-62.08-136.896-138.666667-136.896s-138.666667 61.290667-138.666667 136.896v195.562667c0 32.341333-26.666667 58.666667-59.434666 58.666667s-59.434667-26.325333-59.434667-58.666667V394.666667h39.616L527.232 277.333333 448 394.666667h39.616v215.104c0 75.605333 62.08 136.896 138.666667 136.896s138.666667-61.290667 138.666666-136.896v-195.562667c0-32.341333 26.666667-58.666667 59.434667-58.666667s59.434667 26.325333 59.434667 58.666667V629.333333h-39.616l79.232 117.333334L1002.666667 629.333333h-39.616z" :fill="serviceTaskBorder" p-id="4096"></path>
          </svg>
        </g>-->
      </g>
    </svg>
    <p
      class="svgText flow-text"
      :style="{width: textWidth+'px', transform: transformX }"
      v-html="oldName"
    />
  </div>
</template>

<script>
import '../showWorkFlow.css';

export default {
  name: 'ServiceTask',
  props: {
    serviceTask: {
      type: Object,
      default(){
          return null;
      },
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
        'top': `${this.serviceTask.y}px`,
        'left': `${this.serviceTask.x}px`,
        'width': `${this.serviceTask.width}px`,
        'height': `${this.serviceTask.height}px`,
        'cursor': 'pointer'
      };
    },
    state() {
      const serviceTaskState = this.serviceTask.state;
      if (serviceTaskState === 'finish') {
        return 'finish';
      } else if (serviceTaskState === 'complete') {
        return 'complete';
      } else if (serviceTaskState === 'reject') {
        return 'reject';
      } else if (serviceTaskState === 'revoke') {
        return 'complete';
      } else if (serviceTaskState === 'suspend') {
        return 'suspend';
      } else if (serviceTaskState === 'overtime') {
        return 'overtime';
      } else {
        return 'todo';
      }
    },
    serviceTaskBorder() {
      if (this.serviceTask.state === 'finish') {
        return '#27C3B0';
      }
      return '#D8D8D8';
    },
    serviceTaskContent() {
      if (this.serviceTask.state === 'finish') {
        return 'rgba(233, 249, 247, 1)';
      }
      return 'rgba(216, 216, 216, 0.1)';
    },
  },
  watch: {},
  mounted(){
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
      const newName = this.isNotEmpty(this.serviceTask.nodeNameArr);
      if (newName.length > 0) {
        this.oldName = newName.join('<br>');
      } else {
        this.oldName = this.serviceTask.name;
      }
      this.textWidth = this.serviceTask.textWidth || this.serviceTask.width;
      const transX = (this.textWidth - this.serviceTask.width)/2;
      this.transformX = `translateX(-${transX}px)`;
    },
  },
};
</script>

<style scoped></style>
