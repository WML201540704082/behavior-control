<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="网段变更"
      width="800px"
      top="10vh"
      v-el-drag-dialog
    >
      <div>

        <el-form ref="queryForm" :model="searchForm" label-width="135px" class="xt_form">
          <el-row>
            <el-col :span="10">
                <div>
                    <el-form-item label="原网段">
                        <subSelect placeholder="请选择原网段" v-model="searchForm.subnetOldName" @change="subChange1"></subSelect>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="10">
                <div>
                    <el-form-item label="原网段已用地址数">
                        <el-input v-model="searchForm.ipUsedCount"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="10">
                <div>
                    <el-form-item label="新网段">
                        <subSelect placeholder="请选择新网段" v-model="searchForm.subnetNewName" @change="subChange2"></subSelect>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="10">
                <div>
                    <el-form-item label="新网段空闲地址数">
                        <el-input v-model="searchForm.ipAvailableCount"></el-input>
                    </el-form-item>
                </div>
            </el-col>
          </el-row>
        </el-form>
        <div class="btn-row">
          <el-button  style="margin-left: 15px;"
                      @click="handleCancel">取消</el-button>
          <el-button type="primary" :disabled="isSaveWDBG"
                      @click="handleSubmit">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { globalattrDetail, globalattrSave } from "@/api/system/relationManage";
import {getDictList, getDictCmdbList} from "@/api/dict";
import subSelect from "@/components/subSelect";
import { selectSwitches, queryIpPoolCount, updateSubnet } from "@/api/operation/safeaccess/subnet";

export default {
  props: ['isShow', 'arrtId'],
  components: {
    subSelect
  },
  data() {
    return{
      isSaveWDBG: true,

      orgCodeList: [],
      swStateList: [],
      snmpVersionList: [],
      Is802List: [],
      isAccessSwitchList: [],

      brandList: [],
      seriesList: [],
      deviceModelList: [],
      maintenanceCountryList: [],

      searchForm: {
        ipAvailableCount: undefined
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
   
    //加载字典--工单状态
    // //加载字典--WBS元素
    this.getDictList("is3");
    //加载字典--入库仓库
    this.getDictList("swState");
    //加载字典--i6000同步状态
    this.getDictList("snmpVersion");
    //加载字典--WBS项目
    this.getDictList("Is802");
    //加载字典--i6000同步状态
    this.getDictList("isAccessSwitch");
    
    // 加载字典
    this.getDictCmdbList('1082554947272704') // 品牌
    this.getDictCmdbList('1082609011851264') // 系列
    this.getDictCmdbList('1082608047161344') // 型号
    this.getDictCmdbList('1083979207081984') // 国家及地区
  },
  methods: {
    //判断该子网下是否有交换机信息
    searchSwitchBySubnetId() {
        selectSwitches({
            subentId: this.searchForm.subnetOld
        }).then(resp => {
            if (resp.data) {
                this.$message({
                    message: '该子网下存在交换机，请执行退网操作后，再进行网段变更',
                    type: 'warning'
                })
                this.isSaveWDBG = true
            } else {
                this.isSaveWDBG = false
            }
        })
    },
    subChange1(data){
        this.searchForm.subnetOld = data.id
        let params = {
            subnet: data.id,
            isUsed: 1
        }
        queryIpPoolCount(params).then(resp => {
        //   if (data.oldOrNew === 1) {
            this.searchForm.ipUsedCount = resp.data
            if (this.searchForm.ipUsedCount === 0) {
              this.$message({
                message: '原网段已用地址数为零，不允许变更',
                type: 'warning'
              })
              this.isSaveWDBG = true
            } else {

              this.isSaveWDBG = false
            //   this.searchSwitchBySubnetId()
            }

        //   } else if (data.oldOrNew === 2) {
        //     this.wdbg.ipAvailableCount = resp.data
        //   }
        })
        
    },
    subChange2(data){
      
        // this.searchForm.subnetNew = data.id
        let params = {
            subnet: data.id,
            isUsed: 0
        }

        queryIpPoolCount(params).then(resp1 => {
          this.searchForm.ipAvailableCount = resp1.data
        })

    },
    handleSubmit(){
    //   this.$emit('setVal', this.searchForm)

        if (this.searchForm.ipUsedCount >= this.searchForm.ipAvailableCount) {
          this.$message({
            message: '空闲地址小于或等于已用地址，无法保存',
            type: 'warning'
          })
          return
        }
        if (this.searchForm.ipUsedCount === '0') {
          this.$message({
            message: '原网段已用地址数为0 ，不允许变更',
            type: 'warning'
          })
          return
        }
        if (this.searchForm.subnetOld === this.searchForm.subnetNew) {
          this.$message({
            message: '选择的子网是同一个，请重新选择',
            type: 'warning'
          })
          return
        }
        updateSubnet(this.searchForm).then(resp => {
          if (resp.code === 200) {
            this.$message({
              message: '网段变更成功',
              type: 'success'
            })
            this.$emit('close')
          } else {
            this.$message({
              message: '网段变更失败',
              type: 'error'
            })
          }
        })
    },
    
    handleCancel(){
      this.$emit('close')
    },
    getDictList(code){
        //加载字典
        getDictList(code).then(res => {
            if(code==='swState'){
            this.swStateList = res.data;
            }else if(code==='Is802'){
            this.Is802List = res.data;
            }else if(code==='snmpVersion'){
            this.snmpVersionList = res.data;
            }else if(code==='isAccessSwitch'){
            this.isAccessSwitchList = res.data;
            }
        });
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

    // 保存
    save() {
      this.$refs.searchForm.validate((valid) => {
        if(valid) {
          this.saveLoading = true
          globalattrSave(this.searchForm).then(res => {
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
