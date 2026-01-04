<template>
  <div class="deviceList">
        <el-form
          class="xt_search_form"
          :model="searchForm"
          ref="searchForm"
          label-suffix=":"
          label-width="80px"
          size="small"
        >
          <el-row gutter="20">            
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
              <el-form-item label="所属机柜">
                <el-select v-model="searchForm.cabinetCode" placeholder="请选择所属机柜" clearable>
                    <el-option
                      v-for="dict in cabinetList"
                      :key="dict.uuid"
                      :label="dict.deviceName"
                      :value="dict.uuid"
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
              <el-form-item label="投运日期">
                <div class="pj_content" style="display: flex;justify-content: space-between;">
                    <el-date-picker v-model="searchForm.oprtDateBegin" value-format="yyyy-MM-dd" placeholder="请输入起始日期" class="d_date_w" clearable></el-date-picker>
              - <el-date-picker v-model="searchForm.oprtDateEnd" value-format="yyyy-MM-dd" placeholder="请输入截止日期" class="d_date_w" clearable></el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align: right;">
              <el-button type="primary" size="small" @click="search">查 询</el-button>
              <el-button type="primary" plain size="small" @click="restForm1">重 置</el-button>
              <el-button type="primary" plain size="small" @click="addDevice">关联设备</el-button>
              <el-button type="danger" plain size="small" @click="delDevice">移除设备</el-button>
              <!--              <el-button type="primary" plain size="small" @click="addBtn">新 增</el-button>-->
              <!--              <el-button type="primary" plain size="small" @click="editBtn">修 改</el-button>-->
              <!--              <el-button type="danger" plain size="small" @click="delDevBtn">删 除</el-button>-->
              <!--              <el-button type="primary" size="small" @click="importBtn">导 入</el-button>-->
              <!--              <el-button type="primary" plain size="small" @click="exportBtn">导 出</el-button>-->
              <!--              <el-button type="primary" plain size="small" @click="operaRecord">操作记录</el-button>-->
            </el-col>
          </el-row>
        </el-form>
        <el-table
          ref="table2"
          :data="tableDeviceData"
          stripe
          border
          size="small"
          :height="tableHeight2"
          v-loading="tableLoading"
        >
          <el-table-column width="50" type="selection" align="center"></el-table-column>
          <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
          <!-- <el-table-column label="设备名称" prop="deviceName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="全局名称" prop="fullName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="简称" prop="shortName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="所属机房" prop="computerRoom" show-overflow-tooltip align="center"></el-table-column>
         <el-table-column label="所属机柜" prop="cabinet" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="设备类型" prop="deviceType" show-overflow-tooltip align="center"></el-table-column> -->

          <el-table-column label="设备类型" prop="deviceType" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="品牌" prop="brand" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="系列" prop="series" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="型号" prop="deviceModel" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="投运日期" prop="oprtDate" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="设备编码" prop="deviceCode" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="设备名称" prop="deviceName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="所属机房" prop="computerRoom" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="所属机柜" prop="cabinet" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="设备来源" prop="deviceSource" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="设备分类" prop="deviceCategory" show-overflow-tooltip align="center"></el-table-column>
        </el-table>
        <pagination
          :total="total1"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getDevice"
        />


        <deviceSelect
          v-if="deviceSelectSync"
          :isShow.sync="deviceSelectSync"
          types="deviceList"
          :deviceList = "tableDeviceData"
          @setVal="selectDeviceHandler"
        ></deviceSelect>
  </div>
</template>

<script>
  import {getCabinetsList, removeCabinets, roomSubmitDevice} from "@/api/device/resourecabinets";
  import {getAidedDeviceList} from "@/api/device/resoureroom";
  import {getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
  import deviceSelect from "./deviceAdd.vue";
  import {getDeptList} from "@/api/system/dept";

  export default {
    props: ["roomId", "roomListId", "roomListName"],
    components: {xtTreeLzaySelect, deviceSelect},
    data() {
      return {
        deviceSelectSync: false,

        deviceCategoryList: [],
        deviceTypeList: [],
        deviceSourceCodeList: [],
        brandList: [],
        seriesList: [],
        deviceModelList: [],
        cabinetList: [],
        
        searchForm: {
          brandCode: undefined,
          seriesCode: undefined,
          deviceModelCode: undefined,
          deviceTypeCode: undefined,
          current: 1,
          size: 20,
        },

        
        tableDeviceData: [],

        tableHeight2: '100px',
        tableLoading: false,
        total1: 0,
      }
    },
    watch: {
      roomListId() {
        this.getDevice()
      },
    
    },
    async mounted() {
 
      //字典加载
      this.getDictCmdbList('1097745625841664') // 设备分类
      // this.getDictCmdbListPid('1097745969774592', '1097757118234624') // 设备类型
      this.getDictCmdbList('1082554947272704') // 品牌
      this.getDictCmdbList('1102860579569664') // 设备来源
      // this.getDictCmdbList('1103423111233536') // 设备状态
      // this.getDictCmdbList('1107942968721408') // 所属网络
      let params = {
        current: 1,
        size: 200,
        computerRoomCode: this.roomListId,
        deviceTypeCode: '1135308277350478' // 机柜
      }
      getCabinetsList(params).then(res => {
        let datas = res.data.data
        datas.unshift({
          deviceName: "空",
          uuid: 'nullMark'
        })
        this.cabinetList = datas
      })

      this.$nextTick(() => {
        this.setTableHeight()
      })
     
      this.getDevice()
    },
    methods: {
      selectDeviceHandler(list){
        // console.log(344, list)
        let datas = list
        datas.forEach(el=>{
          el.computerRoomCode = this.roomListId
          el.computerRoom = this.roomListName
        })
        roomSubmitDevice(datas).then(res=>{
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          
          // console.log(30, datas)
          // datas.forEach(el=>{
          //   let shuju = {
          //     name: el.deviceName,
          //     type: "device",
          //     ciId: el.ciId,
          //     id: el.id,
          //   }
          //   this.$store.commit('SET_UPDATE_FORM', {handleType: '新增', dataType: 'device', nodeDetail: shuju})
          // })

          this.getDevice()
        })
      },

      brandChange(val){ // 品牌
        this.searchForm.seriesCode = "";
        this.searchForm.deviceModelCode = "";

        this.getDictCmdbListPid('1082609011851264', val) // 系列

        // let current = this.brandList.filter(el=> el.dictKey == val)[0]
        // this.searchForm.brandName = current.dictValue;
      },
      seriesChange(val){ // 系列
        this.searchForm.deviceModelCode = "";

        this.getDictCmdbListPid('1082608047161344', val) // 型号

        // let current = this.seriesList.filter(el=> el.dictKey == val)[0]
        // this.searchForm.seriesName = current.dictValue;
      },
      deviceModelChange(val){ // 型号
        // let current = this.deviceModelList.filter(el=> el.dictKey == val)[0]
        // this.searchForm.deviceModelName = current.dictValue;
      },

      deviceCategoryCodeChange(code){ //设备分类选择  
        this.searchForm.deviceType = undefined
        this.searchForm.deviceTypeCode = undefined
        this.getDictCmdbListPid('1097745969774592', code) // 设备类型
      },
      getDictCmdbList(ciId) { //加载字典
        getDictCmdbList({ciId: ciId}).then(res => {
          if (ciId === '1097745625841664') { // 设备分类
            let data = res.data
            this.deviceCategoryList = data.filter(el=> el.dictValue=='主机设备' || el.dictValue=='存储设备' || el.dictValue=='网络设备' || el.dictValue=='安全设备' || el.dictValue=='辅助设备' || el.dictValue=='基础设施');
          } else if (ciId === '1082554947272704') { // 品牌
            this.brandList = res.data
          }else if(ciId === '1102860579569664'){ // 设备来源
            this.deviceSourceCodeList  = res.data;
          }else if(ciId === '1103423111233536'){ // 设备状态
            this.deviceStatusCodeList  = res.data;
          }else if(ciId === '1107942968721408'){ // 所属网络
            this.netWorkCodeList  = res.data;
          }else if(ciId === '1083864635473920'){ // 设备增加方式
            this.deviceAddTypeCodeList  = res.data;
          }
        });
      },
      getDictCmdbListPid(ciId, pid){
        getDictCmdbListPid({ ciId: ciId, pid: pid }).then(res => {
          if(ciId==='1097745969774592'){ // 设备类型
            let datas = res.data
            this.deviceTypeList = datas.filter(el=>el.dictKey != "1135308277350478") // 隐藏机柜
          } else if (ciId === '1082554947272704') { // 品牌
            this.brandCodeList = res.data
          } else if (ciId === '1082609011851264') { // 系列
            this.seriesList = res.data
          } else if (ciId === '1082608047161344') { // 型号
            this.deviceModelList = res.data
          }
        });
      },


      addDevice(){
        this.deviceSelectSync = true
      },
      delDevice(){
        let selectList = this.$refs.table2.selection
        if (!selectList || selectList.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的设备！'
          });
          return
        }
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
            removeCabinets(selectList).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              this.$emit('delNode', selectList)
              this.getDevice()
            })
          
        })
      },
      
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight2 = pageBody[0].offsetHeight - 55 - 48 - 190 + 'px'
      },
      
     
      search(){
        this.getDevice()
      },
      getDevice() {
       
        this.tableLoading = true
        this.searchForm.computerRoomCode = this.roomListId
        this.searchForm.findType = "device"
        // this.searchForm.computerRoomCode = this.roomId
        // this.searchForm.deviceCategoryCode = "1097757118234624"

         
         
        let params = JSON.parse(JSON.stringify(this.searchForm))
        if( params.cabinetCode == 'nullMark' ){
          params.nullMark = 1
          params.cabinetCode = undefined
        }
        getCabinetsList(params).then(res => {
          this.tableDeviceData = res.data.data
          this.total1 = res.data.total
          this.tableLoading = false
        })

      },
      
      restForm1() {
        this.searchForm = {
          current: 1,
          size: 20,
        }
        this.getDevice()
      },

      // importBtn() {

      // },
      // exportBtn() {
      //   this.returnSearch()
      //   this.searchForm.roomId = this.roomListId
      //   let params = {}
      //   let selectList = this.$refs.table.selection
      //   params = {
      //     ids:this.ids(selectList),
      //     ...this.searchForm,
      //   }
      //   this.download(
      //     "/api/idevelop-device/resource/cabinets/exportExcel",
      //     params,
      //     "机柜列表.xlsx"
      //     // ,"导入模板生成中..."
      //   );
      // },
      // operaRecord() {

      // },
      // delDevBtn() {

      // },

    }
  }
</script>

<style lang="scss" scoped>
.el-col-6,.el-col-18{
  height: 40px;
}
.d_date_w {
  width: 48% !important;
}
</style>
