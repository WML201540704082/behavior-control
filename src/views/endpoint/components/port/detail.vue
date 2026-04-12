<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="() => $emit('close')"
    :show-close="true"
    append-to-body
    :visible.sync="isShow"
    :title="详情"
    width="600px"
    top="12vh"
    v-el-drag-dialog
  >
    <el-form
      ref="submitForm"
      class="xt_form"
      :model="submitParams"
      :rules="rules"
      label-suffix=":"
      label-width="auto"
      size="small">
      <el-row>
        <el-col :span="24">
          <el-form-item label="接口名称" prop="port">
            <el-input v-model="submitParams.port" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接口类型" prop="portType">
            <el-select v-model="submitParams.portType" readonly>
              <el-option v-for="(item,index) in portTypeList"
                         :key="index"
                         :label="item.dictValue"
                         :value="item.dictValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接口地址" prop="portAddress">
            <el-input v-model="submitParams.portAddress" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接口说明" prop="remake">
            <el-input v-model="submitParams.remake" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
    </div>

  </el-dialog>
</template>

<script>
import {getDictList} from "@/api/dict";

export default {
  name: "PortResAddEdit",
  props: ['fromValue', 'isShow', 'type'],
  data() {
    return {
      submitParams: {},
      saveLoading: false,
      showIconChoose: false,
      portTypeList: [],
    };
  },
  mounted() {
    this.submitParams = JSON.parse(JSON.stringify(this.fromValue));
    this.getDict();
  },
  methods: {
    // 获得字典
    getDict() {
      getDictList("endpoint_port_type").then(res => {
        this.portTypeList = res.data;
      })
    },
    chooseClick(arg) {
      this.submitParams.ciIcon = arg.icon;
    },
    iconClear() {
      this.$forceUpdate()
    }
  },
}
</script>
<style lang="scss" scoped>
.btn_box {
  text-align: center;
}
</style>
