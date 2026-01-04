<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="编辑"
      width="800px"
      top="10vh"
      v-el-drag-dialog>
      <el-form ref="submitForm" v-if="formDetial" :model="formDetial" :rules="rules" label-suffix=":"
               label-width="120px" size="small" v-loading="loading">

        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="父模型ID" prop="parentCiId" size="small">
              <el-input v-model="formDetial.parentCiId" placeholder="请输入父模型ID" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模型ID" prop="ciId" size="small">
              <el-input v-model="formDetial.ciId" placeholder="请输入模型ID" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="模型英文" prop="ciLabel" size="small">
              <el-input v-model="formDetial.ciLabel" placeholder="请输入模型英文" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模型名称" prop="ciName" size="small">
              <el-input v-model="formDetial.ciName" placeholder="请输入模型名称" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="设备分类" prop="ciLabel" size="small">
              <el-select v-model="formDetial.deviceClaccify" placeholder="请选择设备分类" @visible-change="((val)=>{elSelectVis(val,deviceCategoryList,'deviceClaccify')})"
                         @change="val=>{selChange(val,'deviceClaccify')}" clearable>
                <el-option
                  v-for="(item, index) in deviceCategoryList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="设备类型" clearable>
              <el-select v-model="formDetial.deviceType" placeholder="请选择设备类型" @visible-change="((val)=>{elSelectVis(val,deviceTypeList,'deviceType')})"
                         @change="val=>{selChange(val,'deviceType')}" clearable>
                <template #empty>
                  <div class="d_stext">
                    <span v-if="deviceTypeList&&deviceTypeList.length === 0">暂无数据</span>
                    <span v-else>获取中...</span>
                  </div>
                </template>
                <el-option
                  v-for="(item, index) in deviceTypeList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前层级" prop="level" size="small">
              <el-input v-model="formDetial.level" type="number" placeholder="请输入当前层级"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="显示树形" prop="isMenu" size="small">
              <el-select v-model="formDetial.isMenu" placeholder="请选择显示树形" @visible-change="((val)=>{elSelectVis(val,yesnoList,'tree_is_menu')})" clearable>
                <template #empty>
                  <div class="d_stext">
                    <span v-if="yesnoList&&yesnoList.length === 0">暂无数据</span>
                    <span v-else>获取中...</span>
                  </div>
                </template>
                <el-option
                  v-for="(item, index) in yesnoList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="属性映射" prop="isMenu" size="small">
              <el-select v-model="formDetial.isMap" placeholder="请选择属性映射" @visible-change="((val)=>{elSelectVis(val,yesnoList,'tree_is_menu')})" clearable>
                <template #empty>
                  <div class="d_stext">
                    <span v-if="yesnoList&&yesnoList.length === 0">暂无数据</span>
                    <span v-else>获取中...</span>
                  </div>
                </template>
                <el-option
                  v-for="(item, index) in yesnoList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="属性层级" prop="isUpdate" size="small">
              <el-select v-model="formDetial.isUpdate" placeholder="请选择属性层级" @visible-change="((val)=>{elSelectVis(val,yesnoList,'tree_is_menu')})" clearable>
                <template #empty>
                  <div class="d_stext">
                    <span v-if="yesnoList&&yesnoList.length === 0">暂无数据</span>
                    <span v-else>获取中...</span>
                  </div>
                </template>
                <el-option
                  v-for="(item, index) in yesnoList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="form-btn d_end">
          <el-button type="primary" error @click="submit" :loading="saveLoading">修 改</el-button>
          <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getDictCmdbList, getDictCmdbListPid, getDictList} from "@/api/dict";
import {update} from "@/api/device/hardwarebasictree";

export default {
  props: ['isShow', 'arrtId', 'type', 'formDetial'],
  data() {
    return {
      loading: false,
      saveLoading: false,

      deviceCategoryList: null,
      deviceTypeList: null,
      yesnoList: null,

      rules: {
        parentCiId: [{required: true, message: '父模型ID不能为空', trigger: 'blur'}],
        ciId: [{required: true, message: '模型ID不能为空', trigger: 'blur'}],
        ciLabel: [{required: true, message: '模型英文不能为空', trigger: 'blur'}],
        ciName: [{required: true, message: '模型名称不能为空', trigger: 'blur'}],

        level: [{required: true, message: '当前层级不能为空', trigger: 'blur'}],
        isMenu: [{required: true, message: '显示树形不能为空', trigger: 'blur'}],
        isMap: [{required: true, message: '属性映射不能为空', trigger: 'blur'}],
        isUpdate: [{required: true, message: '属性层级不能为空', trigger: 'blur'}],

      },
    };
  },
  mounted() {
    this.initDict();
  },
  methods: {
    submit(){
      this.saveLoading = true;
      update(this.formDetial).then(() => {
        this.$emit('refreshData');
        this.$emit('close');
        this.$message({type: "success", message: "操作成功!"});
      }).finally(()=>{
        this.saveLoading = false;
      });
    },
    initDict() {
      this.loading = true;
      //设备分类
      getDictCmdbList({
        ciId: 1097745625841664,
      }).then(res => {
        this.loading = false;
        this.deviceCategoryList = res.data;
      });

      this.loading = true;
      //设备类型
      getDictCmdbListPid({
        ciId: 1097745969774592,
        pid: this.formDetial.deviceClaccify,
      }).then(res => {
        this.loading = false;
        this.deviceTypeList = res.data;
      });

      this.loading = true;
      //yes or no menu
      getDictList('tree_is_menu').then(res => {
        this.loading = false;
        this.yesnoList = res.data;
      });
    },
    elSelectVis(val, list, type) {
      if (val) {
        if (list && list.length > 0) {
          return;
        }

        if (type === 'tree_is_menu') {
          //yes or no menu
          getDictList('tree_is_menu').then(res => {
            this.yesnoList = res.data;
          });
        } else if (type === 'deviceClaccify') {
          //设备分类
          getDictCmdbList({
            ciId: 1097745625841664,
          }).then(res => {
            this.deviceCategoryList = res.data;
          });
        } else if (type === 'deviceType') {
          //设备类型
          if (!this.formDetial.deviceClaccify) {
            this.$message.warning('请先选择设备分类');
            this.deviceTypeList = [];
            return;
          }
          getDictCmdbListPid({
            ciId: 1097745969774592,
            pid: this.formDetial.deviceClaccify,
          }).then(res => {
            this.deviceTypeList = res.data;
          });
        }
      }
    },
    selChange(value, type) {
      if (type === 'deviceClaccify') {
        //设备分类
        this.deviceTypeList = null;
        this.formDetial.deviceType = null;
        if (value != null && value != '') {
          this.elSelectVis(true, this.deviceTypeList, 'deviceType');
        }
      } else if (type === 'deviceType') {
        //设备类型
        this.$forceUpdate()
      }
    },
  },
}
</script>
<style scoped lang="scss">
.d_stext {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.d_stext span {
  font-size: 14px;
  color: #666666;
}
</style>
