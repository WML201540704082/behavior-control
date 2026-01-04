<template>
  <div class="svg" v-if="s">
    <svg :width="s.width" :height="s.height">
      <defs>
        <linearGradient id="color">
          <stop
            offset="50%"
            :style="`stop-color: ${s.color}; stop-opacity: 0.1`"
          />
          <stop
            offset="100%"
            :style="`stop-color: ${s.color}; stop-opacity: 0.8`"
          />
        </linearGradient>
      </defs>
      <path
        :d="`
        M ${f(s.p1)}
        Q ${f(s.cp1)} ${f(s.p2)}
        T ${f(s.p2)}
        Q ${f(s.cp2)} ${f(s.p1)} Z`"
        fill="url(#color)"
      ></path>
    </svg>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  props: ["width", "height", "color", "borderWidth"],
  name: "svg2",
  data() {
    return {};
  },
  computed: {
    s: (a) => {
      let o = {
        width: a.getWidth(),
        height: a.getHeight(),
        color: a.color || "blue",
        borderWidth: a.borderWidth || (a.getWidth() / 10),
        p1: [0, 0],
        cp1: [a.getWidth() * 2, a.getHeight() / 2],
        cp2: null,
        cp3: null,
        p2: null,
      };

      o.cp2 = [o.width * 2 - o.borderWidth, o.height / 2];
      o.cp3 = [o.width * 2 - o.borderWidth / 2, o.height / 2];
      o.p2 = [0, o.height];
      return o;
    },
  },
  created() {

  },
  methods: {
    getHeight() {
      if (this.height) return this.height;
      if (this.width) return this.width * 10;
      return 200;
    },
    getWidth() {
      if (this.width) return this.width;
      if (this.height) return this.height / 10;
      return 20;
    },
    getCoordinate(t) {
      return this.twoOrderBezier(t, this.s.p1, this.s.cp3, this.s.p2);
    },
    f(arr){
      return _(arr).join(",");
    },
    twoOrderBezier(t, p1, cp, p2) {
      //参数分别是t,起始点,控制点和终点
      var [x1, y1] = p1,
        [cx, cy] = cp,
        [x2, y2] = p2;
      var x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2,
        y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
      return [x, y];
    },
  },
}
</script>
<style scoped>

</style>
