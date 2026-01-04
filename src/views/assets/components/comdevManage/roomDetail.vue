<template>
  <div class="roomDetail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="机房详情" name="0">
        <div class="table-form-box">
<!--         <div style="margin-bottom: 10px">-->
<!--           <el-button type="primary" plain size="small" @click="isSave = !isSave">修 改</el-button>-->
<!--           <el-button :disabled="!isSave" type="primary" plain size="small" @click="saveBtn" :loading="saveLoading">保 存</el-button>-->
<!--         </div>-->
          <el-form
            ref="roomDetail"
            :model="roomDetail"
            :rules="rules"
            label-width="100px"
            size="small"
            :disabled="!isSave"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="机房名称" prop="roomName">
                  <el-input v-model="roomDetail.roomName" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="机房功能"
                  prop="roomFunction"
                >
                  <el-select v-model="roomDetail.roomFunction" placeholder="" clearable>
                    <el-option
                      v-for="dict in roomFunctionList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :span="8">
                <el-form-item
                  label="机房类型"
                  prop="roomType"
                >
                  <el-select v-model="roomDetail.roomType" placeholder="" clearable>
                    <el-option
                      v-for="dict in roomTypeList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="简称" prop="abbreviation">
                  <el-input v-model="roomDetail.abbreviation" ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="机房位置" prop="roomLocation">
                  <el-input v-model="roomDetail.roomLocation" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属区域" prop="regionName">
                  <el-input v-model="roomDetail.regionName" ></el-input>
                </el-form-item>
              </el-col>
<!--              <el-col :span="8">-->
<!--                <el-form-item label="机房编号" prop="roomId">-->
<!--                  <el-input v-model="roomDetail.roomId" disabled></el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
              <el-col :span="8">
                <el-form-item label="机房高度(m)" prop="roomHeight">
                  <el-input v-model="roomDetail.roomHeight" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机房进深(m)" prop="roomDepth">
                  <el-input v-model="roomDetail.roomDepth" type="number" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机房宽度(m)" prop="roomWidth">
                  <el-input v-model="roomDetail.roomWidth" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机房面积(㎡)" prop="roomArea">
                  <el-input v-model="roomDetail.roomArea" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="空调方式"
                  prop="airMethod"
                >
                  <el-select v-model="roomDetail.airMethod" placeholder="" clearable>
                    <el-option
                      v-for="dict in airMethodList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="取暖方式"
                  prop="heatingMethod"
                >
                  <el-select v-model="roomDetail.heatingMethod" placeholder="" clearable>
                    <el-option
                      v-for="dict in heatingMethodList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="走线方式"
                  prop="routingMethod"
                >
                  <el-select v-model="roomDetail.routingMethod" placeholder="" clearable>
                    <el-option
                      v-for="dict in routingMethodList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="维护单位" prop="maintenanceUnitName">
                  <xt-tree-lzay-select
                    :formValue="roomDetail.maintenanceUnitName"
                    :selectType="'CORP'"
                    @getTreeItem="getEntityUnit"
                  ></xt-tree-lzay-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="运维责任人" prop="maintenanceUser">
                  <el-input v-model="roomDetail.maintenanceUser" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="值班电话" prop="dutyPhone">
                  <el-input v-model="roomDetail.dutyPhone" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="" prop="">
                  <label for="roomType" class="el-form-item__label" style="width: 100px; height: 40px;" slot="label"></label>
                  <el-input v-model="roomDetail.add" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="" prop="">
                  <label for="roomType" class="el-form-item__label" style="width: 100px; height: 40px;" slot="label"></label>
                  <el-input v-model="roomDetail.add" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="机柜列表" name="1">
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
              <el-form-item label="机柜名称">
                <el-input v-model="searchForm.fullName" clearable placeholder="请输入机柜名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机柜容量">
                <el-select v-model="searchForm.cabinetCapacity" placeholder="请选择机柜容量（U）" clearable>
                    <el-option
                      v-for="dict in cabinetCapacityList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
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
            <el-col :span="8">
              <el-form-item label="机柜品牌" prop="brandCode">
                <el-select v-model="searchForm.brandCode" placeholder="请选择品牌" clearable @change="brandChange" filterable>
                  <el-option v-for="dict in brandCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机柜系列" prop="seriesCode">
                <el-select v-model="searchForm.seriesCode" placeholder="请选择系列" clearable @change="seriesChange" :disabled="!searchForm.brandCode" filterable>
                  <el-option v-for="dict in seriesCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机柜型号" prop="deviceModelCode">
                <el-select v-model="searchForm.deviceModelCode" placeholder="请选择型号" clearable @change="deviceModelChange" :disabled="!searchForm.seriesCode" filterable>
                  <el-option v-for="dict in deviceModelCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align: right;">
              <el-button type="primary" size="small" @click="searchCabinets">查 询</el-button>
              <el-button type="primary" plain size="small" @click="restForm">重 置</el-button>
<!--              <el-button type="primary" plain size="small" @click="exportBtn">导 出</el-button>-->
              <el-button type="primary" plain size="small" @click="addCabinetsBtn">新 增</el-button>
              <el-button type="primary" plain size="small" @click="addDevice">关联机柜</el-button>
              <!-- <el-button type="primary" plain size="small" @click="editCabinetsBtn">修 改</el-button> -->
              <el-button type="danger" plain size="small" @click="delCabinetsBtn">移除机柜</el-button>
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
          @row-dblclick="showDetailCabinets"
          @selection-change="selectionChange"
        >
          <el-table-column width="50" type="selection" align="center"></el-table-column>
          <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="机柜名称" prop="fullName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="机柜容量(U)" prop="cabinetCapacity" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="U位占用" prop="cabinetsName" show-overflow-tooltip align="center">
            <template  slot-scope="{ row }">
              <span>{{ row.cabinetUseCapacity }}/{{ row.cabinetCapacity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="投运日期" prop="oprtDate" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="品牌" prop="brand" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="系列" prop="series" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="型号" prop="deviceModel" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="所属机房" prop="computerRoom" show-overflow-tooltip align="center"></el-table-column>

        </el-table>
        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="设备列表" name="3">
        <deviceList :roomListId="roomListId" :roomListName="roomListName" @delNode="delNode"></deviceList>
      </el-tab-pane>
    </el-tabs>

    <cabinetsAdd
      v-if="showCabinetsAdd"
      :isShow="showCabinetsAdd"
      :computerRoomCode="roomDetail.uuid"
      :computerRoom="roomDetail.roomName"
      :configId="configId"
      @close="handleClose">
    </cabinetsAdd>
    <!-- 机柜列表 联动设备 -->
    <deviceSelect
      v-if="deviceSelectSync"
      :isShow.sync="deviceSelectSync"
      types="cabinetList"
      deviceCategory="1097757118234624"
      deviceType="1135308277350478"
      :deviceList = "tableDeviceData"
      @setVal="selectDeviceHandler"
    ></deviceSelect>
  </div>
</template>

<script>
  import {getRoomDetail, addRoom, getAidedDeviceList} from "@/api/device/resoureroom";
  import {getCabinetsList, removeCabinets, roomSubmitDevice} from "@/api/device/resourecabinets";
  import { getDictList} from "@/api/dict";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
  import {getDeptList} from "@/api/system/dept";
  import cabinetsAdd from '@/views/assets/components/comdevManage/cabinetsAdd'
  import deviceList from './deviceList'
  import {getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
  import deviceSelect from "./deviceAdd.vue";

  export default {
    props: ["roomId", "roomListId", "roomListName"],
    components: {xtTreeLzaySelect, cabinetsAdd, deviceList, deviceSelect},
    data() {
      return {
        brandCodeList: [],
        seriesCodeList: [],
        deviceModelCodeList: [],

        deviceSelectSync: false,

        cabinetCapacityList: [
          {
            dictKey: 12,
            dictValue: 12
          },
          {
            dictKey: 24,
            dictValue: 24
          },
          {
            dictKey: 32,
            dictValue: 32
          },
          {
            dictKey: 42,
            dictValue: 42
          },
        ],

        deviceCategoryList: [],
        deviceTypeList: [],
        deviceSourceCodeList: [],
        // 新增机柜弹框
        showCabinetsAdd: false,
        configId: undefined,


        roomFunctionList: [],
        cabinetsTypeList: [],
        isMonitorList: [],
        maintenanceFactoryList: [],
        roomTypeList: [],
        unitList: [],
        heatingMethodList: [],
        airMethodList: [],
        routingMethodList: [],
        selectionList: [],
        showForm: false,
        searchForm: {
          current: 1,
          size: 20,

          brandCode: undefined,
          seriesCode: undefined,
          deviceModelCode: undefined,
        },

        tableData: [],

        tableHeight: '100px',
        tableLoading: false,
        total: 0,

        activeName: '0',
        roomDetail: {},
        rules: {  //校验规则
          roomName: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          maintenanceUnitName: [
            { required: true, message: '维护单位不能为空', trigger: 'blur' }
          ],
          roomType: [
            { required: true, message: '机房类型不能为空', trigger: 'blur' }
          ],

        },
        isSave: false, //是否可保存
        saveLoading: false,
        //新增修改表单类型判断
        showType: '',

      }
    },
    watch: {
      roomId() {
        this.getDetail()
      },
      roomListId() {
        this.getList()
      },
      '$store.state.pageUpdate.listUpdate'(val) {
        this.getList()
      },
    },
    async mounted() {
      this.getDictCmdbList('1082554947272704') // 品牌
      //获取 部门列表
      // this.getDeptList()
      //字典加载
      this.getDictList("maintenanceFactory");
      this.getDictList("room_type");
      this.getDictList("room_function");
      this.getDictList("heating_method");
      this.getDictList("air_method");
      this.getDictList("routing_method");
      this.getDictList("yesNo");
      await this.getDictList("cabinets_type");
      this.$nextTick(() => {
        this.setTableHeight()
      })
      this.getDetail()
      this.getList()
      
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
            datas.forEach(el=>{
              // console.log(123, el)
              let shuju = {
                name: el.deviceName,
                type: "device",
                ciId: el.ciId,
                id: el.id,
              }
              this.$store.commit('SET_UPDATE_FORM', {handleType: '新增', dataType: 'device', nodeDetail: shuju})
            })

            this.getList()
          })
        },

      addDevice(){
        this.deviceSelectSync = true
      },
      selectionChange(selection) {
        //点击选择事件
        this.selectionList = selection
      },

      // 删除树节点
      delNode(val) {
        val.forEach(el=> {
          el.id = el.id.toString()
          el.uuid = undefined
        })
        this.$emit('delNode', val)
      },

      handleClose(){
        this.showCabinetsAdd= false
        this.getList()
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

      deviceCategoryCodeChange(code){ //设备分类选择  
        this.searchForm.deviceType = undefined
        this.searchForm.deviceTypeCode = undefined
        this.getDictCmdbListPid('1097745969774592', code) // 设备类型
      },
      getDictCmdbList(ciId) { //加载字典
        getDictCmdbList({ciId: ciId}).then(res => {
          if (ciId === '1097745625841664') { // 设备分类
            let data = res.data
            this.deviceCategoryList = data.filter(el=> el.dictValue=='基础设施' || el.dictValue=='辅助设备');
          } else if (ciId === '1082554947272704') { // 品牌
            this.brandCodeList = res.data
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
            this.deviceTypeList = res.data
          } else if (ciId === '1082554947272704') { // 品牌
            this.brandCodeList = res.data
          } else if (ciId === '1082609011851264') { // 系列
            this.seriesCodeList = res.data
          } else if (ciId === '1082608047161344') { // 型号
            this.deviceModelCodeList = res.data
          }
        });
      },
      showDetailCabinets(row){
        //双击跳转详情页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: 'cabinetsForm',
            routerTitle: '机柜详情',
            id: row.id,
            ciId: row.ciId,
            showType: '详情'
          }
        });
      },
      async getDictList(code) {
        await getDictList(code).then(res => {
          if (code === "maintenanceFactory") {
            this.maintenanceFactoryList = res.data;
          } else if (code === "room_type") {
            this.roomTypeList = res.data;
          } else if (code === "heating_method") {
            this.heatingMethodList = res.data;
          } else if (code === "air_method") {
            this.airMethodList = res.data;
          } else if (code === "routing_method") {
            this.routingMethodList = res.data;
          }else if (code === "yesNo") {
            this.isMonitorList = res.data;
          }else if (code === "cabinets_type") {
            this.cabinetsTypeList = res.data
          } else if(code ==='room_function') { // 机房功能
            this.roomFunctionList = res.data;
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
        this.roomDetail.maintenanceUnitName = val.fullName
        this.$refs.roomDetail.$forceUpdate()
        this.$forceUpdate()
      },

      saveBtn() {
        this.$refs.roomDetail.validate((valid) => {
          if(valid) {
            this.saveLoading = true
            addRoom(this.roomDetail).then((res) => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });

              res.data.name = res.data.roomName
              res.data.id = res.data.uuid
              this.isSave = false
              this.$emit('updateNode', {handleType: '修改', dataType: 'room', nodeDetail: res.data})
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      },
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 55 - 48 - 145 + 'px'
      },
      getDetail() {
        getRoomDetail(this.roomId).then(res => {
          let datas = res.data
          datas.roomFunction = datas.roomFunction.toString()
          this.roomDetail = datas
        })
      },
      returnSearch(){
        this.searchForm ={
          current: 1,
          size: 20,
        }
      },
      getList() {
        this.tableLoading = true
        this.searchForm.computerRoomCode = this.roomListId // 机房
        this.searchForm.deviceTypeCode = '1135308277350478' // 设备分类：机柜
        this.searchForm.findType = 'cabinet' 
        getCabinetsList(this.searchForm).then(res => {
          this.tableData = res.data.data
          this.total = res.data.total
          this.tableLoading = false
        })

      },
      // 格式化列表数据
      formatterText(row, column, cellValue, index) {
        if(column.label === "机柜类型") {
          for(let i=0; i<this.cabinetsTypeList.length; i++) {
          if(this.cabinetsTypeList[i].dictKey === cellValue) return this.cabinetsTypeList[i].dictValue
        }
        }
      },
      
      searchCabinets(){
        this.getList();
      },
     
      restForm() {
        this.searchForm = {
          current: 1,
          size: 20,
        }
        this.getList()
      },
      
      addCabinetsBtn() {
        this.showCabinetsAdd = true
      },
      editCabinetsBtn() {
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
            componentName: 'cabinetsForm',
            routerTitle: '机柜表单',
            roomId: this.roomListId,
            roomName: this.roomDetail.roomName,
            showType: this.showType,
            id: id
          }
        });
      },
      ids(list) {
        let idList = [];
        list.forEach(ele => {
          idList.push(ele.id);
        });
        return idList.join(",");
      },
      delCabinetsBtn() {
        let selectList = this.$refs.table.selection
        if (!selectList || selectList.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的设备！'
          });
          return
        }

        this.$confirm('请确认是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeCabinets(this.selectionList).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            this.$emit('delNode', selectList, true)
            this.getList()
          })
        })
      },
      importBtn() {

      },
      downTemplate() {
        let params = {}
        this.download(
          "/api/idevelop-device/resource/cabinets/downExcel",
          params,
          "机柜列表模板.xlsx"
          // ,"导入模板生成中..."
        );
      },
      exportBtn() {
        this.returnSearch()
        this.searchForm.computerRoomCode = this.roomListId
        let params = {}
        let selectList = this.$refs.table.selection
        params = {
          ids:this.ids(selectList),
          ...this.searchForm,
        }
        this.download(
          "/api/idevelop-device/resource/cabinets/exportExcel",
          params,
          "机柜列表.xlsx"
          // ,"导入模板生成中..."
        );
      },
      operaRecord() {

      },
      delDevBtn() {

      },

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
