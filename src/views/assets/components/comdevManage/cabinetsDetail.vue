<template>
  <div class="cabinetsDetail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="机柜详情" name="0">
        <div class="table-form-box">
          <!--          <div style="margin-bottom: 10px">-->
          <!--            <el-button type="primary" plain @click="isSave = !isSave">修 改</el-button>-->
          <!--            <el-button :disabled="!isSave" type="primary" plain @click="saveDetailBtn" :loading="saveLoading">保 存</el-button>-->
          <!--          </div>-->
          <el-form
            ref="cabinetsDetail"
            :model="cabinetsDetail"
            label-width="100px"
            size="small"
            :disabled="!isSave"
            :rules="rules"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="标准全称" prop="fullName">
                  <el-input v-model="cabinetsDetail.fullName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属机房" prop="computerRoom">
                  <el-input v-model="cabinetsDetail.computerRoom"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备编码" prop="deviceCode">
                  <el-input v-model="cabinetsDetail.deviceCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机柜容量（U）" prop="cabinetCapacity">
                  <el-input v-model="cabinetsDetail.cabinetCapacity" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="投运日期" prop="oprtDate" :rules="[{ required: false, message: '投运日期不能为空'}]">
                  <el-input type="date" placeholder="" v-model="cabinetsDetail.oprtDate"  disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出厂序列号" prop="sn">
                  <el-input v-model="cabinetsDetail.sn"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="品牌" prop="brand">
                  <el-input v-model="cabinetsDetail.brand"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="系列" prop="series">
                  <el-input v-model="cabinetsDetail.series"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="型号" prop="deviceModel">
                  <el-input v-model="cabinetsDetail.deviceModel"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="ERP资产编码" prop="assetCodeErp" >
                 <el-input v-model="cabinetsDetail.assetCodeErp"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="ERP台账编码" prop="deviceCodeErp" >
                 <el-input v-model="cabinetsDetail.deviceCodeErp"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备来源" prop="deviceSource" >
                 <el-input v-model="cabinetsDetail.deviceSource"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="责任人" prop="receivingPerson" >
                 <el-input v-model="cabinetsDetail.receivingPerson"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="责任人联系方式" prop="receivingTel" >
                 <el-input v-model="cabinetsDetail.receivingTel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="运维责任人" prop="operationPerson" >
                 <el-input v-model="cabinetsDetail.operationPerson"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="运维联系方式" prop="operationTel" >
                 <el-input v-model="cabinetsDetail.operationTel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否治理" prop="isGovern" >
                 <el-input v-model="cabinetsDetail.isGovern"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="数据治理时间" prop="governTime" >
                 <el-input v-model="cabinetsDetail.governTime"></el-input>
                </el-form-item>
              </el-col>






              <!-- <el-col :span="8">
                <el-form-item label="简称" prop="abbreviation">
                  <el-input v-model="cabinetsDetail.abbreviation"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="机柜编号" prop="cabinetsId">
                  <el-input v-model="cabinetsDetail.cabinetsId" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机柜类型" prop="cabinetsType">
                  <el-select
                    v-model="cabinetsDetail.cabinetsType"
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
                <el-form-item label="生产厂家" prop="produceFactory">
                  <el-input v-model="cabinetsDetail.produceFactory" disabled></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="维护单位" prop="maintenanceUnit">
                  <xt-tree-lzay-select :formValue="cabinetsDetail.maintenanceUnitName"
                                       :selectType="'CORP'"
                                       @getTreeItem="getEntityUnit"></xt-tree-lzay-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="设备型号" prop="deviceModel">
                  <el-input v-model="cabinetsDetail.deviceModel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否正序" prop="isSort">
                  <el-select
                    v-model="cabinetsDetail.isSort"
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
                <el-form-item label="机柜宽度(mm)" prop="cabinetsWidth">
                  <el-input v-model="cabinetsDetail.cabinetsWidth" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机柜高度(mm)" prop="cabinetsHeight">
                  <el-input v-model="cabinetsDetail.cabinetsHeight" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="维护人" prop="maintenanceUser">
                  <el-input v-model="cabinetsDetail.maintenanceUser"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机柜深度(mm)" prop="cabinetsDepth">
                  <el-input v-model="cabinetsDetail.cabinetsDepth" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="退运日期" prop="returnDate" :rules="[{ required: false, message: '退运日期不能为空'}]">
                  <el-date-picker
                    type="date"
                    placeholder="选择退运日期"
                    v-model="cabinetsDetail.returnDate"
                    style="width: 319px"
                    @change="changeReturnDate"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属模块" prop="module">
                  <el-input v-model="cabinetsDetail.module"></el-input>
                </el-form-item>
              </el-col> -->
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备列表" name="1">
        <el-form
          class="xt_search_form"
          :model="searchForm"
          ref="searchForm"
          label-suffix=":"
          label-width="80px"
          size="small"
        >
          <el-row gutter="20">
            <!-- <el-col :span="6">
              <el-form-item label="设备名称">
                <el-input v-model="searchForm.deviceName" clearable placeholder="请输入设备名称"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="设备分类">
                <el-select v-model="searchForm.deviceCategoryCode" @change="deviceCategoryCodeChange" placeholder="请选择设备分类" clearable>
                    <el-option
                      v-for="dict in deviceCategoryList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备类型">
                <el-select v-model="searchForm.deviceTypeCode" :disabled="!searchForm.deviceCategoryCode" placeholder="请选择设备类型" clearable>
                    <el-option
                      v-for="dict in deviceTypeList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备编码">
                <el-input v-model="searchForm.deviceCode" clearable placeholder="请输入设备编码"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="设备品牌" prop="brandCode">
                <el-select v-model="searchForm.brandCode" filterable clearable placeholder="请选择品牌" @change="brandChange">
                  <el-option v-for="dict in brandList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备系列" prop="seriesCode">
                <el-select v-model="searchForm.seriesCode"  clearable placeholder="请选择系列" :disabled="!searchForm.brandCode" @change="seriesChange">
                  <el-option v-for="dict in seriesList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备型号" prop="deviceModelCode">
                <el-select v-model="searchForm.deviceModelCode"  clearable placeholder="请选择型号" :disabled="!searchForm.seriesCode" @change="deviceModelChange">
                  <el-option v-for="dict in deviceModelList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="设备来源">
                <el-select v-model="searchForm.deviceSourceCode" placeholder="请选择设备来源" clearable>
                    <el-option
                      v-for="dict in deviceSourceCodeList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="labelHe" label="设备高度(U)">
                <el-input v-model="searchForm.deviceHeight" clearable placeholder="请输入设备高度"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="labelHe" label="设备起始高度(U)">
                <el-input v-model="searchForm.deviceHeightBegin" clearable placeholder="请输入设备起始高度"></el-input>
              </el-form-item>
            </el-col>



            <el-col :span="24" style="text-align: right;">
              <el-button type="primary" size="small" @click="search">查 询</el-button>
              <el-button type="primary" plain size="small" @click="restForm">重 置</el-button>
              <el-button type="primary" plain size="small" @click="addDevice">关联设备</el-button>
              <el-button type="danger" plain size="small" @click="delDevice">移除设备</el-button>
              <!-- <el-button type="primary" plain size="small" @click="exportBtn">导 出</el-button> -->
            </el-col>
          </el-row>
        </el-form>
        <el-table
          ref="table"
          :data="tableData"
          stripe
          border
          size="small"
          :height="tableHeight"
          v-loading="tableLoading"
        >
          <el-table-column width="50" type="selection" align="center"></el-table-column>
          <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="设备分类" prop="deviceCategory" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="设备类型" prop="deviceType" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="设备高度（U）" prop="deviceHeight" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="设备起始高度（U）" prop="deviceHeightBegin" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="设备终止高度（U）" prop="deviceHeightEnd" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="品牌" prop="brand" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="系列" prop="series" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="型号" prop="deviceModel" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="设备编码" prop="deviceCode" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="所属机柜" prop="cabinet" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="设备来源" prop="deviceSource" show-overflow-tooltip align="center"></el-table-column>



          <!-- <el-table-column label="设备名称" prop="deviceName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="所属机架" prop="cabinet" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="起始U数" prop="deviceHeightBegin" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="终止U数" prop="deviceHeightEnd" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="机柜占用" prop="rackUse" show-overflow-tooltip align="center"></el-table-column> -->
        </el-table>
        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"
        />
      </el-tab-pane>
    </el-tabs>


    <cabinetDeviveAdd
      v-if="showCabinetDeviveAdd"
      :isShow="showCabinetDeviveAdd"
      :configId="configId"
      :cabinetsListId="cabinetsListId"
      :cabinetCapacity="cabinetCapacity"
      @close="deviceAddClose">
    </cabinetDeviveAdd>
  </div>
</template>
<script>
import {getCabinetsDetail, addCabinets, removeDev} from "@/api/device/resourecabinets";
import {getRacksList, removeRacks, getDeviceList} from "@/api/device/resoureracks";
import {getDictList, getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDeptList} from "@/api/system/dept";
import cabinetDeviveAdd from "./cabinetDeviveAdd.vue"


export default {
  components: {xtTreeLzaySelect, cabinetDeviveAdd},
  props: ["cabinetsId", "cabinetsCiId", "cabinetsListId", "cabinetsCiEntityId", "cabinetCapacity"],
  data() {
    return {
      showCabinetDeviveAdd: false,
      configId: undefined,

      isGovernList: [],
      deviceCategoryList: [],
      deviceTypeList: [],
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      deviceSourceCodeList: [],

      unitList: [],
      isSortList: [],

      cabinetsTypeList: [],
      showForm: false,
      searchForm: {
        current: 1,
        size: 20,
        brandCode: undefined,
        seriesCode: undefined,
        deviceModelCode: undefined,

        deviceType: undefined,
        deviceTypeCode: undefined,
      },
      cabinetsDetail: {},
      rules: {
        cabinetsName: [
          {required: true, message: '名称不能为空', trigger: 'blur'}
        ],
        capacity: [
          {min: 0, max: 99, message: '最大容量99', trigger: 'blur'}
        ],
      },
      isSave: false,
      saveLoading: false,
      tableHeight: '100px',
      tableLoading: false,
      total: 0,
      activeName: '0',
      tableData: [],
      //新增修改表单类型判断
      showType: '',

    }
  },
  watch: {
    cabinetsId() {
      this.getList()
      this.getDetail()
    },
    '$store.state.pageUpdate.listUpdate'(val) {
      this.getList()
    },
  },
  mounted() {
    //获取 部门列表
    this.getDeptList()
    //字典加载
    this.getDictList("yesNo");
    this.getDictList("cabinets_type");
    //字典加载
    this.getDictCmdbList('1097745625841664') // 设备分类
    this.getDictCmdbList('1082554947272704') // 品牌
    this.getDictCmdbList('1102860579569664') // 设备来源
    this.getDictCmdbList(this.$store.state.common.govern.dictGovern) // 是否治理

    this.$nextTick(() => {
      this.setTableHeight()
    })
    this.getDetail()
    this.getList()
  },
  methods: {
    deviceAddClose(){
      this.showCabinetDeviveAdd= false
      this.getList()
    },
    addDevice(){
      this.showCabinetDeviveAdd = true
    },
    delDevice(){
      let selectList = this.$refs.table.selection
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (selectList != null && selectList.length > 0) {
          removeDev(selectList).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            this.$emit('delNode', selectList, true)
            this.getList()
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请选择要删除的数据！'
          });
        }
      })
    },


    deviceCategoryCodeChange(code){ //设备分类选择
      this.searchForm.deviceType = undefined
      this.searchForm.deviceTypeCode = undefined
      this.getDictCmdbListPid('1097745969774592', code) // 设备类型
    },
    brandChange(val){ // 品牌
      this.searchForm.seriesCode = undefined;
      this.searchForm.deviceModelCode = undefined;

      this.getDictCmdbListPid('1082609011851264', val) // 系列

      // let current = this.brandList.filter(el=> el.dictKey == val)[0]
      // this.searchForm.brandName = current.dictValue;
    },
    seriesChange(val){ // 系列
      this.searchForm.deviceModelCode = undefined;

      this.getDictCmdbListPid('1082608047161344', val) // 型号

      // let current = this.seriesList.filter(el=> el.dictKey == val)[0]
      // this.searchForm.seriesName = current.dictValue;
    },
    deviceModelChange(val){ // 型号
      // let current = this.deviceModelList.filter(el=> el.dictKey == val)[0]
      // this.searchForm.deviceModelName = current.dictValue;
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
      getDictCmdbListPid(ciId, pid){
        getDictCmdbListPid({ ciId: ciId, pid: pid }).then(res => {
          if(ciId==='1097745969774592'){ // 设备类型
            this.deviceTypeList = res.data
          } else if (ciId === '1082554947272704') { // 品牌
            this.brandCodeList = res.data
          } else if (ciId === '1082609011851264') { // 系列
            this.seriesList = res.data
          } else if (ciId === '1082608047161344') { // 型号
            this.deviceModelList = res.data
          }
        });
      },
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

    getDictList(code) {
      getDictList(code).then(res => {
        if (code === "yesNo") {
          this.isSortList = res.data
        } else if (code === "cabinets_type") {
          this.cabinetsTypeList = res.data
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
      this.cabinetsDetail.maintenanceUnit = val.fullName
      this.$refs.cabinetsDetail.$forceUpdate()
      this.$forceUpdate()
    },
    saveDetailBtn() {
      this.$refs.cabinetsDetail.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          addCabinets(this.cabinetsDetail).then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.cabinetsDetail.name = this.cabinetsDetail.cabinetsName
            this.isSave = false
            this.$emit('updateNode', {handleType: '修改', dataType: 'cabinets', nodeDetail: this.cabinetsDetail})
            this.saveLoading = false
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })

    },
    ids(list) {
      let idList = [];
      list.forEach(ele => {
        idList.push(ele.id);
      });
      return idList.join(",");
    },
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 55 - 55 - 185 + 'px'


    },
    getDetail() {
      // console.log(33, { ciEntityId: this.cabinetsCiEntityId, ciId: this.cabinetsCiId })
      getCabinetsDetail({ ciEntityId: this.cabinetsCiEntityId, ciId: this.cabinetsCiId }).then(res => {
        let datas = res.data
        datas.isGovern = this.showDictLable(datas.isGovern, this.isGovernList)
        this.cabinetsDetail = datas

      })
    },
    // getList() {
    //   this.tableLoading = true
    //   this.searchForm.cabinetsId = this.cabinetsListId
    //   getRacksList(this.searchForm).then(res => {
    //     this.tableData = res.data.records
    //     this.total = res.data.total
    //     this.tableLoading = false
    //   })
    // },
    getList() {
      this.tableLoading = true
      this.searchForm.cabinetCode = this.cabinetsId
      getDeviceList(this.searchForm).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
        this.tableLoading = false
        this.tableData.forEach(item => {
          item.rackUse = item.deviceHeightEnd - item.deviceHeightBegin + 1
        })
      })

    },
    getDevice() {
      this.tableLoading = true
      this.searchForm.cabinetsId = this.cabinetsId

    },
    search() {
      this.searchForm.current = 1
      this.getList()
    },
    restForm() {
      this.searchForm = {
        current: 1,
        size: 20,
      }
      this.getList()
    },
    addBtn() {
      this.showType = '新增'
      this.$router.push({
        path: '/detailRoute',
        query: {
          componentName: 'racksForm',
          routerTitle: '机架表单',
          cabinetsId: this.cabinetsListId,
          cabinetsName: this.cabinetsDetail.cabinetsName
        }
      });
    },
    editBtn() {
      let selectList = this.$refs.table.selection
      if (selectList.length != 1) {
        this.$message({
          type: 'warning',
          message: '请只选择一条数据修改！'
        });
        return
      }
      this.showType = '修改'
      let id = selectList[0].id
      this.$router.push({
        path: '/detailRoute',
        query: {
          componentName: 'racksForm',
          routerTitle: '机架表单',
          cabinetsId: this.cabinetsListId,
          cabinetsName: this.cabinetsDetail.cabinetsName,
          showType: this.showType,
          id: id
        }
      });
    },

    downTemplate() {
      let params = {}
      this.download(
        "/api/idevelop-device/resource/racks/downExcel",
        params,
        "机架列表模板.xlsx"
        // ,"导入模板生成中..."
      );
    },
    exportBtn() {
      let params = {}
      let selectList = this.$refs.table.selection
      params = {
        ids: this.ids(selectList),
        ...this.searchForm,
      }
      this.download(
        "/api/idevelop-device/resource/racks/exportExcel",
        params,
        "机架列表.xlsx"
        // ,"导入模板生成中..."
      );
    },
    operaRecord() {

    },
    changeReturnDate(val) {
      if (val != null) {
        if (new Date(val).getTime() < new Date(this.cabinetsDetail.useDate).getTime()) {
          this.$message({
            type: "warning",
            message: "退运日期不可小于投运日期!"
          });
          this.cabinetsDetail.returnDate = null
        }
      }
    }
  }
}
</script>
<style lang='scss' scoped>
  ::v-deep .labelHe .el-form-item__label{
    line-height: 18px;
  }
</style>
