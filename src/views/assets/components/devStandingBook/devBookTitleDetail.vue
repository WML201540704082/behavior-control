<template>
  <div class="title_detail">
    <div class="xt_card basic_info" style="margin-bottom: 20px">
      <div class="info_title">
        <img :src="getDeviceHeadImage" alt="">
        <!-- <span>{{ formValue.name }}</span> -->
        <span class="dev_name">设备名称：{{ formValue.deviceName }} </span>
        <span class="xt-font">投运年限： <i style="color: #409EFF">{{ formValue.useAge }}</i> 年</span>
        <span class="btn_box">
          <el-button class="border-btn" size="mini" @click="handlePrint">打印设备标签</el-button>
        </span>
      </div>
      <div class="info_form">
        <div class="form_box">
          <el-row>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">领用部门:</div>
              <div class="form_content">{{ formValue.receiveDept }}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">责任人:</div>
              <div class="form_content">{{ formValue.receivingPerson }}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">责任人联系方式:</div>
              <div class="form_content">{{ formValue.receivingTel }}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font" v-if="ciName==='SG_CMTD'">
              <div class="form_label xt-font">使用人:</div>
              <div class="form_content">{{ formValue.user }}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">IP地址:</div>
              <div class="form_content">{{ formValue.IP }}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">MAC地址:</div>
              <div class="form_content">{{ formValue.MAC }}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">安装地点:</div>
              <div class="form_content">{{ formValue.installationSite }}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font" v-if="ciName==='SG_CMTD'">
              <div class="form_label xt-font">使用人联系方式:</div>
              <div class="form_content">{{ formValue.userTel }}</div>
            </el-col>
          </el-row>
        </div>

        <div class="status_c">
          <img :src="getImage" class="status_i">
        </div>

        <div class="code_img_box">
          <!-- <img v-if="formValue.deviceStatus" :src="require('@/assets/img/xintong_img/devBookImg/' + formValue.deviceStatus + '.png')" alt=""> -->
          <div v-if="formValue">
            <zdbg-device ref="zdbgDevice" :form-value="formValue" :device-type="deviceType" v-show="false"></zdbg-device>
            <other-device ref="otherDevice" :form-value="formValue" :device-type="deviceType" v-show="false"></other-device>
            <taian-device ref="taianDevice" :form-value="formValue" :device-type="deviceType" v-show="false"></taian-device>
          </div>

          <div class="qrcode" ref="qrcode"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import printHtml from "@/util/printHtml"
import zdbgDevice from "./components/print/zdbgDevice.vue"
import otherDevice from "./components/print/otherDevice.vue"
import taianDevice from "./components/print/taianDevice.vue"
import {mapGetters} from "vuex";
export default {
  props: ["formValue", 'ciName'],
  components: {
    zdbgDevice,
    otherDevice,
    taianDevice
  },
  data() {
    return {
      qrcode: null,
      deviceStatus: '',
      deviceType: '',
    }
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"]),
    getImage() {
      if (this.deviceStatus === '待报废') {
        return require('@/assets/taizhang/unBaofei.png')
      } else if (this.deviceStatus === '已报废') {
        return require('@/assets/taizhang/yiBaofei.png')
      } else if (this.deviceStatus === '退运在库') {
        return require('@/assets/taizhang/tuiyunzaiku.png')
      } else if (this.deviceStatus === '在运') {
        return require('@/assets/taizhang/zaiyun.png')
      } else if (this.deviceStatus === '库存备用') {
        return require('@/assets/taizhang/kucunBeiYong.png')
      }
      return '';
    },

    getDeviceHeadImage() {
      if (this.deviceType === '安全设备') {
        return require('@/assets/taizhang/safeDevice.png')
      } else if (this.deviceType === '办公设备') {
        return require('@/assets/taizhang/bangongDevice.png')
      } else if (this.deviceType === '备品备件') {
        return require('@/assets/taizhang/beijianDevice.png')
      } else if (this.deviceType === '存储设备') {
        return require('@/assets/taizhang/cunchuDevice.png')
      } else if (this.deviceType === '辅助设备') {
        return require('@/assets/taizhang/fuzhuDevice.png')
      } else if (this.deviceType === '基础设施') {
        return require('@/assets/taizhang/jichuDevice.png')
      } else if (this.deviceType === '网络设备') {
        return require('@/assets/taizhang/wangluoDevice.png')
      } else if (this.deviceType === '终端设备') {
        return require('@/assets/taizhang/zhongduanDevice.png')
      } else if (this.deviceType === '主机设备') {
        return require('@/assets/taizhang/zhujiDevice.png')
      }
      return '';
    },
  },
  watch: {
    formValue: {
      deep: true,
      handler() {
        this.$refs.qrcode.innerHTML = '';

        this.qrcode = null;
        this.qrcode = new QRCode(this.$refs.qrcode, {
          width: 80,
          height: 80,
          text: `设备编码${this.formValue.deviceCode}`
        })
      },
    }
  },
  mounted() {

  },
  methods: {
    // 打印
    handlePrint() {
      // console.log(103, this.deviceType)

      let printElement = null;
      if(this.userDetail.regionCode.includes('3709')){ // 泰安账户
        printElement = this.$refs.taianDevice;
      }else if (this.deviceType == '终端设备' || this.deviceType == '办公设备') {
        printElement = this.$refs.zdbgDevice;
      } else {
        printElement = this.$refs.otherDevice;
      }

      printHtml(`${printElement.$el.innerHTML}`)
    },
    getDeviceStatus(status) {
      this.deviceStatus = status;

    },
    getDeviceType(deviceType) {
      this.deviceType = deviceType;
    },
  },
}
</script>

<style lang="scss" scoped>
.status_i {
  width: 88px;
}

i {
  font-style: normal
}

.el-col {
  margin-bottom: 0px
}

.form_label:before {
  content: '';
  display: inline-block;
  border: 5px solid #409EFF;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-top-color: transparent;
}

.basic_info {
  .info_title {
    border-bottom: 1px solid #DCDFE6;
    font-size: 14px;
    color: #409EFF;
    height: 35px;
    line-height: 35px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .dev_name {
      font-size: 15px;
      display: inline-block;
      font-weight: 900;
      margin: 0 20px;
    }

    .btn_box {
      flex: auto;
      text-align: right;
    }

    img {
      width: 28px;
      height: 28px;
    }
  }

  .info_form {

    display: flex;
    align-items: center;
    padding-left: 20px;
    flex-direction: row;

    .form_box {
      width: 82%;

      .form_item {
        display: flex;
        flex-direction: row;

        .form_label {
          line-height: 40px;
          font-size: 14px;
          white-space: nowrap;
          position: relative;
        }

        .form_content {
          flex: auto;
          overflow-x: hidden;
          line-height: 40px;
          font-size: 14px;
          padding-left: 15px;
        }
      }
    }

    .code_img_box {
      flex: auto;
      text-align: right;
      white-space: nowrap;

      .qrcode {
        display: inline-block;
        // height: 80px;
        // width: 80px;
      }

      img {
        height: 80px;
        width: 80px;

        &:first-child {
          margin-right: 10px
        }
      }
    }
  }
}


</style>
