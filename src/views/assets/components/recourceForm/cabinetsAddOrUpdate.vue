<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <formTitle :titleText="'机柜信息'" :titleType="'page_title'"></formTitle>
      <el-scrollbar style="height:calc(100% - 50px - 48px)">
        <el-form :model="form"  :rules="rules" ref="dataForm" class="xt_form" label-width="150px" :disabled="isChange">
          




          <el-row>
          <el-col :span="8">
            <el-form-item label="标准全称" prop="fullName" clearable >
              <el-input v-model="form.fullName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属机房" prop="computerRoom" clearable >
              <el-input v-model="form.computerRoom" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备编码" prop="deviceCode" clearable >
              <el-input v-model="form.deviceCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机柜容量（U）" prop="cabinetCapacity" clearable >
              <el-input v-model="form.cabinetCapacity" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="投运日期" prop="oprtDate" clearable >
              <el-date-picker type="date" placeholder="" v-model="form.oprtDate" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂序列号" prop="sn" clearable >
              <el-input v-model="form.sn" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌" prop="brand" clearable >
              <el-input v-model="form.brand" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="系列" prop="series" clearable >
              <el-input v-model="form.series" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="型号" prop="deviceModel" clearable >
              <el-input v-model="form.deviceModel" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="ERP资产编码" prop="assetCodeErp" clearable >
              <el-input v-model="form.assetCodeErp" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="ERP台账编码" prop="deviceCodeErp" clearable >
              <el-input v-model="form.deviceCodeErp" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备来源" prop="deviceSource" clearable >
              <el-input v-model="form.deviceSource" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任人" prop="receivingPerson" clearable >
              <el-input v-model="form.receivingPerson" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任人联系方式" prop="receivingTel" clearable >
              <el-input v-model="form.receivingTel" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运维责任人" prop="operationPerson" clearable >
              <el-input v-model="form.operationPerson" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运维联系方式" prop="operationTel" clearable >
              <el-input v-model="form.operationTel" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否治理" prop="isGovern" clearable >
              <el-input v-model="form.isGovern" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据治理时间" prop="governTime" clearable >
              <el-date-picker type="date" placeholder="" v-model="form.governTime" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>

          <!-- 
            <el-col :span="8">
              <el-form-item label="机柜名称" prop="cabinetsName">
                <el-input v-model="form.cabinetsName" placeholder="请输入机柜名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="全局名称" prop="globalName" clearable >
                <el-input v-model="form.globalName" placeholder="请输入全局名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="简称" prop="abbreviation" >
                <el-input v-model="form.abbreviation" placeholder="请输入简称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属机房" prop="belongRoom" >
                <el-input v-model="form.belongRoom" placeholder="请输入所属机房" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机柜编号" prop="cabinetsId" >
                <el-input v-model="form.cabinetsId" placeholder="请输入机柜编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机柜类型" prop="cabinetsType">
                <el-select
                  v-model="form.cabinetsType"
                  placeholder="请选择机柜类型"
                  clearable
                  :disabled="isEdit"
                >
                  <el-option
                    v-for="dict in cabinetsTypeList"
                    :key="dict.dictKey"
                    :label="dict.dictValue"
                    :value="dict.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产厂家" prop="produceFactory" >
                <el-input v-model="form.produceFactory" placeholder="请输入生产厂家"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="投运日期" prop="useDate" >
                <el-date-picker
                  type="date"
                  placeholder="选择投运日期"
                  v-model="form.useDate"
                  @change="changeUseDate"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维护单位" prop="maintenanceUnit" >
                <xt-tree-lzay-select :formValue="form.maintenanceUnitName"
                                     :selectType="'CORP'"
                                     @getTreeItem="getEntityUnit"
                ></xt-tree-lzay-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="容量(U)" prop="capacity" >
                <el-input v-model="form.capacity" placeholder="请输入容量" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备型号" prop="deviceModel" >
                <el-input v-model="form.deviceModel" placeholder="请输入设备型号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否正序" prop="isSort">
                <el-select
                  v-model="form.isSort"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="dict in isSortList"
                    :key="dict.dictKey"
                    :label="dict.dictValue"
                    :value="dict.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机柜宽度(mm)" prop="cabinetsWidth" >
                <el-input v-model="form.cabinetsWidth" placeholder="请输入机柜宽度" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机柜高度(mm)" prop="cabinetsHeight" >
                <el-input v-model="form.cabinetsHeight" placeholder="请输入机柜高度" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维护人" prop="maintenanceUser" >
                <el-input v-model="form.maintenanceUser" placeholder="请输入维护人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机柜深度(mm)" prop="cabinetsDepth" >
                <el-input v-model="form.cabinetsDepth" placeholder="请输入机柜深度" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退运日期" prop="returnDate" >
                <el-date-picker
                  type="date"
                  placeholder="选择退运日期"
                  v-model="form.returnDate"
                  @change="changeReturnDate"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </el-scrollbar>
      <div class="form-btn">
        <el-button type="primary" size="small" @click="onSubmit" v-show="!isChange">提交</el-button>
        <el-button class="border-btn" size="small" @click="$closePage('/assets/comdevManage')"
                   style="margin-left: 50px;">返 回
        </el-button>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {addCabinets, getCabinetsDetail} from "@/api/device/resourecabinets";
import {getDictList,getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDeptList} from "@/api/system/dept";

export default {
  name: "cabinetsAddOrUpdate",
  components: {xtTreeLzaySelect},

  data() {
    return {
      rules: {
        cabinetsName: [
          {required: true, message: '名称不能为空', trigger: 'blur'}
        ],
      },
      form: {},
      produceFactoryList: [],
      cabinetsTypeList: [],
      isSortList: [],
      unitList: [],
      isChange: false,
      
      isGovernList: []
    }
  },
  created() {
    this.getDictCmdbList(this.$store.state.common.govern.dictGovern);
    //获取 部门列表
    this.getDeptList()
    //字典加载
    this.getDictList("cabinets_type");
    this.getDictList("yesNo");
    this.form.belongRoom = this.$route.query.roomName
    // console.log(this.$route.query.showType)
    if (this.$route.query.showType === '修改') {
      getCabinetsDetail({ ciEntityId: this.$route.query.id, ciId: this.$route.query.ciId }).then(res => {
          let datas = res.data
          datas.isGovern = this.showDictLable(datas.isGovern, this.isGovernList)
          this.form = datas
        }
      )
    } else if (this.$route.query.showType === '详情') {
      getCabinetsDetail({ ciEntityId: this.$route.query.id, ciId: this.$route.query.ciId }).then(res => {
        let datas = res.data
        datas.isGovern = this.showDictLable(datas.isGovern, this.isGovernList)
        this.form = datas
        }
      )
      this.isChange = true
    }
  },
  methods: {
     showDictLable(code, dictList) {
      //字典回显
      if (dictList != null && code != '') {
        let items = dictList.filter(item => item.dictKey == (code));
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }
      }
      return code;
    },
    getDictCmdbList(ciId) { //加载字典
      getDictCmdbList({ciId: ciId}).then(res => {
        if (ciId === '1097745625841664') { // 设备分类
          let data = res.data
          this.deviceCategoryList = data.filter(el=> el.dictValue=='主机设备' || el.dictValue=='存储设备' || el.dictValue=='网络设备' || el.dictValue=='安全设备');
        } else if (ciId === '1082554947272704') { // 品牌
          this.brandList = res.data
        }else if(ciId === '1102860579569664'){ // 设备来源
          this.deviceSourceCodeList  = res.data;
        }else if(ciId === '1103423111233536'){ // 设备状态
          this.deviceStatusCodeList  = res.data;
        }else if(ciId === '1107942968721408'){ // 所属网络
          this.netWorkCodeList  = res.data;
        }else if(ciId === this.$store.state.common.govern.dictGovern){ // 是否治理
          this.isGovernList  = res.data;
        }
      });
    },
    getDeptList() {
      //获取部门 单位
      getDeptList().then(res => {
        this.unitList = res.data
      })
    },
    getEntityUnit(val) {
      //选择领用单位 部门
      this.form.maintenanceUnitName = val.fullName
      this.form.maintenanceUnit = val.id
      this.$refs.dataForm.$forceUpdate()
      this.$forceUpdate()
    },
    getDictList(code) {
      getDictList(code).then(res => {
        if (code === "cabinets_type") {
          this.cabinetsTypeList = res.data
        } else if (code === "yesNo") {
          this.isSortList = res.data
        }
      });
    },
    submitReset() {
      this.$closePage('/assets/comdevManage')
    },
    onSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid){
          let roomId = this.$route.query.roomId
          this.form.roomId = roomId
          addCabinets(this.form).then((res) => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            let handleType = ''
            if (this.$route.query.showType === "修改") handleType = '修改'
            else handleType = '新增'
            res.data.name = res.data.cabinetsName
            this.$store.commit('SET_LIST_UPDATE', (new Date()).getTime())
            this.$store.commit('SET_UPDATE_FORM', {handleType: handleType, dataType: 'cabinets', nodeDetail: res.data})
            this.submitReset();
          }, error => {
            //  
          });
        }
      })
    },
    changeUseDate(val) {
      if (val != null && this.form.returnDate && this.form.returnDate != null) {
        if (new Date(val).getTime() > new Date(this.form.returnDate).getTime()) {
          this.$message({
            type: "warning",
            message: "投运日期不可大于退运日期!"
          });
          this.form.useDate = null
        }
      }
    },
    changeReturnDate(val) {
      if (val != null && this.form.useDate && this.form.useDate != null) {
        if (new Date(val).getTime() < new Date(this.form.useDate).getTime()) {
          this.$message({
            type: "warning",
            message: "退运日期不可小于投运日期!"
          });
          this.form.returnDate = null
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
