<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="数据修改"
      width="1200px"
      top="10vh"
      v-el-drag-dialog
    >
      <div>
        <el-form ref="queryForm" :model="searchForm" label-width="105px" class="xt_form">
          <el-row>
            <el-col :span="8">
              <el-form-item label="品牌:" prop="brand">
                <el-select v-model="searchForm.brand"  clearable placeholder="请选择WBS编码">
                  <el-option
                    v-for="dict in brandList"
                    :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="系列:" prop="series">
                <el-select v-model="searchForm.series"  clearable placeholder="请选择WBS编码">
                  <el-option
                    v-for="dict in seriesList"
                    :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="型号:" prop="deviceModel">
                <el-select v-model="searchForm.deviceModel"  clearable placeholder="请选择WBS编码">
                  <el-option
                    v-for="dict in deviceModelList"
                    :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备名称:" prop="deviceName">
                <el-input
                  placeholder="请输入"
                  clearable
                  v-model="searchForm.deviceName"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出厂序列号:" prop="sn">
                <el-input
                  placeholder="请输入"
                  clearable
                  v-model="searchForm.sn"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电源:" prop="powerModel">
                <el-input
                  placeholder="请输入"
                  clearable
                  v-model="searchForm.powerModel"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="CPU:" prop="cpuModel">
                <el-input
                  placeholder="请输入"
                  clearable
                  v-model="searchForm.cpuModel"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="内存:" prop="memSize">
                <el-input
                  placeholder="请输入"
                  clearable
                  v-model="searchForm.memSize"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="硬盘:" prop="hardDiskCapability">
                <el-input
                  placeholder="请输入"
                  clearable
                  v-model="searchForm.hardDiskCapability"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="制造商:" prop="supplierName">
                <el-input
                  placeholder="请输入"
                  clearable
                  v-model="searchForm.supplierName"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="制作国家及地区:" prop="serialNumber">
                <div slot="label" class="formLabel">
                  制作国家<br>及地区
                </div>
                <el-select v-model="searchForm.maintenanceCountry"  clearable placeholder="请选择WBS编码">
                  <el-option
                    v-for="dict in maintenanceCountryList"
                    :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地址:" prop="aaa">
                <el-input
                  placeholder="请输入"
                  clearable
                  v-model="searchForm.aaa"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="生产日期:" prop="factoryDate">
              <el-date-picker
                v-model="searchForm.factoryDate"
                type="date"
                clearable
                placeholder="请选择"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form>
        <div class="btn-row">
          <el-button type="primary"
                      @click="handleSubmit">保存</el-button>
          <el-button  style="margin-left: 15px;"
                      @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { globalattrDetail, globalattrSave } from "@/api/system/relationManage";
import {getDictList, getDictCmdbList} from "@/api/dict";
export default {
  props: ['isShow', 'formData'],
  data() {
    return{
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      maintenanceCountryList: [],

      searchForm: {

      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
        ]
      },
      pageLoading: false,
      saveLoading: false,


      dataList: [],
      selectionList: [],
      total: 0,
      tableLoading: false, //表格加载
      tableHeight: undefined,
    }
  },
  computed: {
    // ids() {
    //   let ids = [];
    //   this.selectionList.forEach(ele => {
    //     ids.push(ele.id);
    //   });
    //   return ids.join(",");
    // },
  },
  created() {
    // this.getDetail()
    this.searchForm = {...this.formData}
    // 加载字典
    this.getDictCmdbList('1082554947272704') // 品牌
    this.getDictCmdbList('1082609011851264') // 系列
    this.getDictCmdbList('1082608047161344') // 型号
    this.getDictCmdbList('1083979207081984') // 国家及地区
  },
  methods: {
    handleSubmit(){
      this.$emit('setVal', this.searchForm)
    },
    handleCancel(){
      this.$emit('close')
    },
    getDictCmdbList(ciId){
      //加载字典
      getDictCmdbList({ ciId: ciId }).then(res => {
        if(ciId==='1082554947272704'){ // 品牌
          this.brandList  = res.data;
        }else if(ciId==='1082609011851264'){ // 系列
          this.seriesList  = res.data;
        }else if(ciId==='1082608047161344'){ // 型号
          this.deviceModelList = res.data;
        }else if(ciId==='1083979207081984'){ // 国家及地区
          this.maintenanceCountryList = res.data;
        }
      });
    },

    // 详情
    getDetail() {
      if(this.showType != '新增') {
        this.pageLoading = true
        globalattrDetail({id: this.arrtId}).then(res => {
          this.pageLoading = false
          this.submitForm = res.Return
        }).catch(() => {
          this.pageLoading = false
        })
      }
    },
    // 保存
    save() {
      this.$refs.submitForm.validate((valid) => {
        if(valid) {
          this.saveLoading = true
          globalattrSave(this.submitForm).then(res => {
            this.saveLoading = false
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.$emit('saveGlobalArrt')
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .formLabel{
    line-height: 20px;
  }
  .btn-row{
    text-align: right;
  }
</style>
