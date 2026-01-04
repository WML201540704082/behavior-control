<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="() => $emit('close')"
    :show-close="true"
    append-to-body
    :visible.sync="isShow"
    :title="getTitle(type)"
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
            <el-input v-model="submitParams.port" placeholder="请输入接口名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接口类型" prop="portType">
            <el-select v-model="submitParams.portType" placeholder="请选择接口类型" clearable filterable>
              <el-option v-for="(item,index) in portTypeList"
                         :key="index"
                         :label="item.dictValue"
                         :value="item.dictValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接口地址" prop="portAddress">
            <el-input v-model="submitParams.portAddress" placeholder="请输入接口地址" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接口说明" prop="remake">
            <el-input v-model="submitParams.remake" placeholder="请输入接口说明" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button type="primary" error @click="submit" :loading="saveLoading">{{ getTitle(type) }}</el-button>
      <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
    </div>

    <icon-choose v-if="showIconChoose"
                 :isShow="showIconChoose"
                 @close="showIconChoose = false"
                 @chooseClick="chooseClick"></icon-choose>
  </el-dialog>
</template>

<script>
import {add, update} from "@/api/endpoint/port" ;
import {getDictList} from "@/api/dict";

export default {
  name: "PortResAddEdit",
  props: ['fromValue', 'isShow', 'type'],
  data() {
    return {
      submitParams: {},
      rules: {
        port: [{required: true, message: '接口名称不能为空', trigger: 'blur'}],
        portType: [{required: true, message: '接口类型不能为空', trigger: 'blur'}],
        portAddress: [{required: true, message: '接口地址不能为空', trigger: 'blur'}],
        remake: [{required: true, message: '接口说明不能为空', trigger: 'blur'}],
      },
      saveLoading: false,
      yesNoList: null,

      showIconChoose: false,
      portTypeList: [],
    };
  },
  mounted() {
    if (this.type == 'edit') {
      this.submitParams = JSON.parse(JSON.stringify(this.fromValue));
    }

    this.getDict();
  },
  methods: {
    // 获得字典
    getDict() {
      getDictList("endpoint_port_type").then(res => {
        this.portTypeList = res.data;
      })
    },

    submit() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          if (this.type == 'add') {
            this.saveLoading = true;
            add(this.submitParams).then(res => {
              if (res.code === 200 ) {
                this.$message.success('添加成功');
              } else {
                this.$message.fail('添加失败');
              }
              this.saveLoading = false;
              this.$emit("close");
              this.$emit("refreshData");
            });
          } else if (this.type == 'edit') {
            this.saveLoading = true;
            update(this.submitParams).then(res => {
              if (res.code === 200 ) {
                this.$message.success('修改成功');
              } else {
                this.$message.fail('修改失败');
              }
              this.saveLoading = false;
              this.$emit("close");
              this.$emit("refreshData");
            });
          }
        }
      })
    },
    chooseClick(arg) {
      this.submitParams.ciIcon = arg.icon;
    },
    iconClear() {
      this.$forceUpdate()
    },
    getTitle(type) {
      if (type == 'add') {
        return '新 增';
      } else if (type == 'edit') {
        return '更 新';
      }
      return null;
    },
  },
}
</script>
<style lang="scss" scoped>
.btn_box {
  text-align: center;
}
</style>
