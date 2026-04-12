/* eslint-disable vue/no-side-effects-in-computed-properties */
<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :height="this.height"
    :width="this.width"
    class="svg-path-container"
  >
    <defs>
      <marker
        :id="'arrowFinish'+flowNum"
        refX="8"
        refY="4"
        markerUnits="userSpaceOnUse"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        <path
          d="M 0 1 L 8 4 L 0 7z"
          fill="#1F8AFF"
          stroke="#1F8AFF"
          stroke-linejoin="round"
        />
      </marker>
    </defs>
    <defs>
      <marker
        :id="'arrowComplete'+flowNum"
        refX="8"
        refY="4"
        markerUnits="userSpaceOnUse"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        <path
          d="M 0 1 L 8 4 L 0 7z"
          fill="#41CC8B"
          stroke="#41CC8B"
          stroke-linejoin="round"
        />
      </marker>
    </defs>
    <defs>
      <marker
        :id="'arrowNormal'+flowNum"
        refX="8"
        refY="4"
        markerUnits="userSpaceOnUse"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        <path
          d="M 0 1 L 8 4 L 0 7z"
          fill="#CFDDEC"
          stroke="#CFDDEC"
          stroke-linejoin="round"
        />
      </marker>
    </defs>
    <g
      v-for="pathItem in pathLine"
      :id="pathItem.id"
      :key="pathItem.id"
    >
      <path
        :key="pathItem.id+'-c1'"
        :d="pathItem.d"
        fill="none"
        :stroke="pathItem.color"
        stroke-width="1"
        style="fill:none;"
      />
      <path
        :id="pathItem.id+'-tp'"
        :key="pathItem.id+'-c2'"
        :d="pathItem.d"
        :fill="pathItem.color"
        :stroke="pathItem.color"
        :marker-end="pathItem.arrow"
        style="fill:none;"
      />
      <foreignObject :id="pathItem.id + '-name'"
                     :width="pathItem.width || 0"
                     :height="pathItem.height || 0"
                     :x="pathItem.x || 0"
                     :y="pathItem.y || 0">
        <body xmlns="http://www.w3.org/1999/xhtml">
        <span v-for="(text, index) in pathItem.lineName"
              :key="pathItem.id + '_' + index"
              class="flow-path-name">{{ text }}</span>
        </body>
      </foreignObject>
    </g>
  </svg>
</template>

<script>
import '../showWorkFlow.css';
export default {
  name: 'Paths',
  props: {
    path: {
      type: Array,
        default(){
          return [];
        }
    },
    width: {
      type: String,
        default(){
            return '';
        }
    },
    height: {
      type: String,
        default(){
            return '';
        }
    }
  },
  data() {
    return {
      pathLine: [],
      rotate: {},
      flowNum: 0,
    };
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    /* pathLine() {
      this.path.forEach(function(value, index, arr) {
        // eslint-disable-next-line no-unused-vars
        let line = '';
        for (let i = 0; i < value.xPoints.length; i++) {
          if (i === 0) {
            line = 'M' + value.xPoints[0] + ' ' + value.yPoints[0] + ' ';
          } else {
            line += 'L' + value.xPoints[i] + ' ' + value.yPoints[i] + ' ';
          }
        }
        arr[index].d = line;
        if (value.state === 'finish') {
          arr[index].color = '#1F8AFF';
          arr[index].arrow = 'url(#arrowFinish)';
        } else if (value.state === 'complete') {
          arr[index].color = '#41CC8B';
          arr[index].arrow = 'url(#arrowComplete)';
        } else {
          arr[index].color = '#CFDDEC';
          arr[index].arrow = 'url(#arrowNormal)';
        }
      });
      return this.path;
    }, */
  },
  mounted() {
    // this.svgHeight();
    this.flowNum = document.getElementsByClassName('svg-path-container').length;
    this.initPathLine();
  },
  methods: {
    reversal(string) {
      return string.split('').reverse().join('');
    },
    svgHeight(){
      let x1Min = [],x2Max = [],y1Min = [],y2Max = [];
      this.path.forEach(function(value) {
        const startX1Path = Math.min.apply(Math, value.xPoints);
        const startY1Path = Math.min.apply(Math, value.yPoints);
        const endX2Path = Math.max.apply(Math, value.xPoints);
        const endY2Path = Math.max.apply(Math, value.yPoints);
        x1Min.push(startX1Path);
        y1Min.push(startY1Path);
        x2Max.push(endX2Path);
        y2Max.push(endY2Path);
      });
    },
    initPathLine() {
      this.pathLine = [];
      this.path.forEach((item) => {
        let line = '';
        for (let i = 0; i < item.xPoints.length; i++) {
          if (i === 0) {
            line = 'M' + item.xPoints[0] + ' ' + item.yPoints[0] + ' ';
          } else {
            line += 'L' + item.xPoints[i] + ' ' + item.yPoints[i] + ' ';
          }
        }
        item.d = line;
        if (item.state === 'finish') {
          item.color = '#1F8AFF';
          item.arrow = 'url(#arrowFinish'+ this.flowNum +')';
        } else if (item.state === 'complete') {
          item.color = '#41CC8B';
          item.arrow = 'url(#arrowComplete'+ this.flowNum +')';
        } else {
          item.color = '#CFDDEC';
          item.arrow = 'url(#arrowNormal'+ this.flowNum +')';
        }
        // if (item.name) {
        //   this.updateLineName(item);
        //   Object.keys(this.rotate).forEach((field) => {
        //     item[field] = this.rotate[field];
        //   });
        // }
        this.pathLine.push(item);
      });
    },
    // 获取字符串长度
    getDataLength(data) {
      let intLength = 0;
      for (let i = 0; i < data.length; i++) {
        if ((data.charCodeAt(i) < 0) || (data.charCodeAt(i) > 255))
          intLength += 2;
        else
          intLength++;
      }
      return intLength;
    },
      // 获取宽度
      getDataWidth(len) {
          let intWidth = 0;
          if (len < 18) {
              intWidth = len * 8;
          } else {
              intWidth = 72;
          }
          return intWidth;
      },
    // 更新文本
    updateLineName(path) {
      this.rotate = {};
      const lineName = path.lineName && path.lineName.length > 0 ? path.lineName : path.name.split('\n');
      let height = 0;
        const width = []; // 宽度
      lineName.forEach((item) => {
        if (item) {
          const len = this.getDataLength(item);
          height += Math.ceil(len / 18) * 18;
          width.push(this.getDataWidth(len));
        }
      });
      let maxLineIndex = 0, maxLength = 0;
      const { xPoints, yPoints } = path;
      // 获取最大长度
      for (let i = 0; i < xPoints.length - 1; i++) {
        const dX = xPoints[i] - xPoints[i + 1];
        const dY = yPoints[i] - yPoints[i + 1];
        const lineLength = Math.sqrt(dX * dX + dY * dY);
        if (lineLength > maxLength) {
          maxLineIndex = i;
          maxLength = lineLength;
        }
      }
      // 最大长度所在起始点坐标值
      const pointX = xPoints[maxLineIndex];
      const pointY = yPoints[maxLineIndex];
      // 判断最大长度是垂直方向或水平
      let right = pointX - xPoints[maxLineIndex + 1];
      let top = pointY - yPoints[maxLineIndex + 1];
      // 校正误差 -1 - 1
      right = Math.abs(right) > 1 ? right : 0;
      top = Math.abs(top) > 1 ? top : 0;
      let textDx = 0, textDy = 0;
      if (right === 0) {
        textDx = pointX - 60;
        if (top > 0) {
          textDy = pointY - maxLength/2 - height/2;
        } else if (top < 0) {
          textDy = pointY + maxLength/2 - height/2;
        }
      } else if (top === 0) {
        if (right > 0) {
          textDx = pointX - maxLength/2 - 60;
        } else if (right < 0) {
          textDx = pointX + maxLength/2 - 60;
        }
        textDy = pointY - height/2;
      } else {
        textDx = pointX - right/2;
        textDy = pointY - top/2;
      }

      // let rotateX = 0;
      // let rotateY = 0;
      // if (path.start.port === 'B' || path.start.port === 'T') {
      //   rotateX = Number(textDx.toFixed(1)) - 60;
      //   rotateY = Number(textDy.toFixed(1));
      // } else if (this.v.start.port === 'R' || this.v.start.port === 'L') {
      //   rotateX = Number(textDx.toFixed(1));
      //   rotateY = Number(textDy.toFixed(1)) - ((height / 18 + 1) * 7);
      // } else {
      //   rotateX = Number(textDx.toFixed(1));
      //   rotateY = Number(textDy.toFixed(1));
      // }
      this.rotate = {
        width: Math.max(...width), height, lineName, x: Number(textDx.toFixed(1)), y: Number(textDy.toFixed(1))
      };
    }
  }
};
</script>

<style scoped>
  .flow-path-name {
    word-wrap: break-word;
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, Alibaba-PuHuiTi-Regular, PingFang, tahoma, arial;
    width: 100%;
    height: 100%;
    font-size: 14px;
    line-height: 16px;
    color: #878787;
    text-align: center;
    background: #fff;
  }
</style>
