<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="() => $emit('close')"
    :show-close="true"
    append-to-body
    :visible.sync="isShow"
    :title="getTitle(type)"
    width="700px"
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
          <el-form-item label="模型ID" prop="ciId">
            <el-input v-model="submitParams.ciId" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模型中文名" prop="ciLabel">
            <el-input v-model="submitParams.ciLabel" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模型英文名" prop="ciName">
            <el-input v-model="submitParams.ciName" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模型别名" prop="ciAlias">
            <el-input v-model="submitParams.ciAlias" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类型ID" prop="ciTypeId">
            <el-input v-model="submitParams.ciTypeId" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模型图标" prop="ciIcon">
            <!--            <el-input v-model="submitParams.ciIcon" placeholder="请选择" @focus="iconClick" @clear="iconClear" clearable></el-input>-->
            <el-input v-model="submitParams.ciIcon" placeholder="请选择" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否需要级联" prop="isExistCascade">
            <el-select v-model="submitParams.isExistCascade" placeholder="请选择" clearable filterable>
              <el-option v-for="(item,index) in yesNoList"
                         :key="index"
                         :label="item.name"
                         :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="查询模型ID" prop="selectCiId">
            <el-input v-model="submitParams.selectCiId" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="查询模型英文名" prop="selectCiName">
            <el-input v-model="submitParams.selectCiName" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="级联模型信息" prop="cascadeCiInfo">
            <el-input v-model="submitParams.cascadeCiInfo" placeholder="请输入" clearable></el-input>
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
import {save, update} from "@/api/treeManager/cmdbres";
import IconChoose from "@/components/iconChoose/index.vue";

export default {
  name: "CmdbResAddEdit",
  components: {IconChoose},
  props: ['fromValue', 'isShow', 'type'],
  data() {
    return {
      submitParams: {},
      rules: {
        ciId: [{required: true, message: '模型ID不能为空', trigger: 'blur'}],
        ciLabel: [{required: true, message: '模型中文名不能为空', trigger: 'blur'}],
        ciName: [{required: true, message: '模型英文名不能为空', trigger: 'blur'}],

        selectCiId: [{required: true, message: '查询模型ID不能为空', trigger: 'blur'}],
        selectCiName: [{required: true, message: '查询模型英文名不能为空', trigger: 'blur'}],
      },
      saveLoading: false,
      yesNoList: null,

      showIconChoose: false,
    };
  },
  mounted() {
    if (this.type == 'edit') {
      this.submitParams = JSON.parse(JSON.stringify(this.fromValue));
    }

    this.initDict();
  },
  methods: {
    initDict() {
      this.yesNoList = [{
        name: '是',
        code: 1
      }, {
        name: '否',
        code: 0
      },];
    },
    submit() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          if (this.type == 'add') {
            this.saveLoading = true;
            save(this.submitParams).then(res => {
              this.saveLoading = false
              this.$message.success('添加成功');
              this.$emit("close");
              this.$emit("refreshData");
            });
          } else if (this.type == 'edit') {
            this.saveLoading = true;
            update(this.submitParams).then(res => {
              this.saveLoading = false
              this.$message.success('修改成功');
              this.$emit("close");
              this.$emit("refreshData");
            });
          }
        }
      })
    },
    iconClick() {
      this.showIconChoose = true;
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
