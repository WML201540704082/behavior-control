<template>
  <div class="d_content2">
    <div class="d_content">
      <div class="d_left vh_center">
        <img src="@/assets/taizhang/gwicon.png" class="i_gjdwlogo"/>
      </div>

      <div class="d_center" style="display: flex;flex-direction: column;justify-content: space-around;">
        <div class="d_t_center">
          <span>信息{{ deviceType }}</span>
        </div>
        <div>
          <div class="d_t_left d_start">
            <div>
              <span class="s_label" style="display: flex;justify-content: space-between">
                <span>单</span>
                <span style="padding-left: 28px">位</span>
              </span>
            </div>
            <div style="white-space: nowrap">
              <span>: {{ formValue.ownerUnit }}</span>
            </div>
          </div>
          <div class="d_t_left d_start">
            <span class="s_label">设备名称</span>
            <span>: {{ formValue.fullName }}</span>
          </div>
          <div class="d_t_left d_start">
            <span class="s_label">设备型号</span>
            <span>: {{ formValue.brand }} {{ formValue.deviceModel }}</span>
          </div>
          <div class="d_t_left d_start">
            <span class="s_label">投运日期</span>
            <span>: {{ formValue.oprtDate }}</span>
          </div>
          
            <!-- <div>
              <span class="s_label" style="display: flex;justify-content: space-between">
                <span>部&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span style="padding-left: 1px">&nbsp;&nbsp;&nbsp;门</span>
              </span>
            </div>
            <div style="white-space: nowrap">
              <span>:{{ formValue.receiveDept ? formValue.receiveDept.substring(0, 10) : '' }}</span>
            </div>
          </div>
          <div class="d_t_left d_start">
            <span class="s_label" style="display: flex;justify-content: space-around;">
              <span>责</span>
              <span style="display: block;padding: 0px 5px 0px 5px">任</span>
              <span>人</span>
            </span>
            <span>:{{ formValue.receivingPerson }}</span>
          </div>
          <div class="d_t_left d_start">
            <span ref="s_tyrq" class="s_label">投运日期</span>
            <span>:{{ formValue.oprtDate }}</span>
          </div>
          <div class="d_t_left d_start">
            <span class="s_label">出厂编号</span>
            <span>:{{ formValue.sn }}</span>
          </div> -->
        </div>
      </div>
      <div class="d_right" style="height: 100%;width: 25%;display: flex;align-items: flex-end;justify-content: flex-start">
        <div>
          <div class="vh_center" ref="qrcode"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'

export default {
  props: ["formValue", 'deviceType'],
  data() {
    return {
      qrcode: null,
      c1: null,
      c2: null,
    };
  },
  watch: {
    'formValue.deviceCode'(newVal, oldVal) {
      if (newVal) {
        if (this.qrcode != null) {
          this.qrcode.clear()
        }
        this.qrcode = new QRCode(this.$refs.qrcode, {
          // width: 63,
          // height: 63,
          width: 120,
          height: 120,
          text: `设备编码${this.formValue.deviceCode}`,
          colorDark: '#000000',
        });
        if (this.formValue.deviceCode) {
          let subIndex = Math.floor(this.formValue.deviceCode.length / 2);
          this.c1 = this.formValue.deviceCode.substring(0, subIndex);
          this.c2 = this.formValue.deviceCode.substring(subIndex);
        }


      }
    }
  },
  mounted() {

  },
  methods: {},
}
</script>
<style scoped lang="scss">
.d_content2{
    width: 302px;
    height: 70px;
    position: relative;
}
.d_content {
  position: absolute;
  left: -120px;
  top: -20px;
  // width: 302px;
  // height: 70px;
  transform: scale(0.5);
  width: 604px;
  height: 140px;
  background-color: rgba(0, 0, 0, 0);
  -webkit-print-color-adjust: exact !important;
  color-adjust: exact !important;
  print-color-adjust: exact !important;

  display: flex;
  justify-content: center;
  align-items: center;
}

.d_left {
  width: 17%;
  margin-right: 10px;
  margin-top: 20px;
}

.d_center {
  width: 58%;
  height: 90%;
  padding: 0px;
}

.d_right {
  width: 25%;
}

.vh_center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.i_gjdwlogo {
  width: 77%;
  height: 77%;
}

.d_t_center {
  text-align: center;
  // font-size: 12px;
  font-size: 20px;
  font-weight: bold;
  // line-height: 6px;
  letter-spacing: 2px;
  margin-bottom: 5px;
}

.d_t_left {
  text-align: left;
  font-size: 14px;
  /* line-height: 10px; */
  width: 95%;
  border-bottom: 0.1px solid #333;
  // text-align: left;
  // font-size: 5px;
  // line-height: 10px;
  // width: 155px;
  // border-bottom: 0.1px solid #333;
}

.code_img_box {
  white-space: normal !important;
}

.d_oneline {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.d_twoline {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.d_start {
  display: flex;
  justify-content: flex-start;
}

.s_label {
  display: block;
  white-space: nowrap;
}
</style>
