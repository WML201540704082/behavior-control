<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="ERP资产编码查看"
      width="1000px"
      top="10vh"
      v-el-drag-dialog
    >
      <el-form
        class="xt_search_form"
        :model="searchForm"
        ref="searchForm"
        label-suffix=":"
        label-width="120px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="ERP资产编码" prop="erpAssetCode">
              <el-input v-model="searchForm.erpAssetCode" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备编码" prop="deviceCode">
              <el-input v-model="searchForm.deviceCode" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用状态" prop="erpAssetStatus">
              <el-select v-model="searchForm.erpAssetStatus" clearable>
                <el-option
                  v-for="(item, index) in useStatusList"
                  :key="index"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="ERP同步状态" prop="erpStatus">
              <el-select v-model="searchForm.erpStatus" clearable>
                <el-option
                  v-for="(item, index) in erpSyncStatusList"
                  :key="index"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="I6000同步状态" prop="i6000Status">
              <el-select v-model="searchForm.i6000Status" clearable>
                <el-option
                  v-for="(item, index) in iSyncStatusList"
                  :key="index"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="submit_btn" style="margin: 0px 0px 14px;">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="rest">重置</el-button>
          <el-button type="primary" plain @click="exportList">导出</el-button>
          <el-button type="primary" @click="handleSyncs" v-loading="btnLoading">I6000批量同步</el-button>
        </div>
      </el-form>
      <el-table
        ref="erpCodeTable"
        stripe
        size="small"
        :data="tableData"
        :height="tableHeight"
        v-loading="tableLoading"
        @selection-change="handleChange"
      >
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column prop="erpAssetCode" label="ERP资产编码" width="120" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="erpAccountCode" label="ERP台账编码" width="150" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceCode" label="设备编码" width="180" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="sn" label="出厂序列号" width="150" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceType" label="设备类型" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.deviceType, deviceTypeList) }}</span>
          </template>
        </el-table-column>
        

        <el-table-column prop="erpStatus" label="ERP同步状态" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :style="{color:getColorForStatus(scope.row.erpStatus)}">{{ showDictLable(scope.row.erpStatus, erpSyncStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="i6000Status" label="I6000同步状态" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.i6000Status == '3'" effect="light" :content="'123'" placement="bottom">
              <span :style="{color:getColorForStatus(scope.row.i6000Status)}">{{ showDictLable(scope.row.i6000Status, iSyncStatusList) }}</span>
            </el-tooltip>
            <span v-else :style="{color:getColorForStatus(scope.row.i6000Status)}">{{ showDictLable(scope.row.i6000Status, iSyncStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="i6000Remake" label="i6000同步结果" width="120" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="erpAssetStatus" label="ERP资产编码使用状态" width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.erpAssetStatus, useStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="erpTransferStatus" label="ERP转资状态" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.erpTransferStatus, erpTransferStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
             <!-- v-if="scope.row.i6000Status=='0' || scope.row.i6000Status=='3'" -->
            <el-button type="primary" size="mini" @click="handleSync(scope.row)">I6000同步</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="getList"
      />
    </el-dialog>




    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="900px"
    >
      <div>
        <el-table
          ref="arrtTable"
          :data="mapData"
          :span-method="objectSpanMethods"
          :height="tableHeight2"
          cell-class-name="bgE"
          size="small"
          @selection-change="selectionChange"
          border
        >
          <el-table-column type="selection" width="30"></el-table-column>
          <!-- <el-table-column prop="erpAccountCode" label="ERP台账编码" width="150" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="erpAssetCode" label="ERP资产编码" width="120" align="center" show-overflow-tooltip></el-table-column>

          <el-table-column label="ERP_ASSET_NO" width="150" prop="ERP_ASSET_NO" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="ERP_LEDGER_NO" width="150" prop="ERP_LEDGER_NO" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="OPDEP_NAME" width="150" prop="OPDEP_NAME" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="PROP_CORP_NAME" width="150" prop="PROP_CORP_NAME" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="WBS_NAME" width="150" prop="WBS_NAME" align="center" show-overflow-tooltip></el-table-column> -->
          <el-table-column label="信通一体化" align="left" show-overflow-tooltip>
            <template slot-scope="{row}">
              <div class="itemStyle">
                <div> ERP台账编码：{{ row.erpAccountCode }} </div>
                <div> 设备编码：{{ row.deviceCode }} </div>
                <div> ERP资产编码：{{ row.erpAssetCode }} </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="i6000系统" align="left" show-overflow-tooltip>
            <template slot-scope="{row}">
              <div class="itemStyle" v-if="row.code">
                <div> ERP_ASSET_NO：{{ row.ERP_ASSET_NO }} </div>
                <div> ERP_LEDGER_NO：{{ row.ERP_LEDGER_NO }} </div>
                <div> OPDEP_NAME：{{ row.OPDEP_NAME }} </div>
                <div> PROP_CORP_NAME：{{ row.PROP_CORP_NAME }} </div>
                <div> WBS_NAME：{{ row.WBS_NAME }} </div>
              </div>
              <div class="itemStyle itemStyle2" v-else>
                <div v-if="row.isAddI6000Detail2" style="display: flex">
                  <div style="width: 110px"> <span style="color: red">*</span> 是否新增i6000: </div>
                  <el-radio-group v-model="row.isAddI6000Detail" size="mini">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </div>
                {{ row.remake }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="syncSub" v-loading="syncLoading">同 步</el-button>
      </div>
    </el-dialog>




  </div>
</template>

<script>
import {projectErpList, selectI6000, syncI6000,exportData} from '@/api/assets/projectManage'
import {getDictList, getDictCmdbList} from "@/api/dict";

export default {
  props: ['isShow', 'wbsElement', 'wbsProject'],
  data() {
    return {
      btnLoading: false,
      syncLoading: false,
      searchForm: {
        current: 1,
        size: 20,
        wbsCode: this.wbsElement,
        wbsName: this.wbsProject,
        erpAssetStatus: '',
        erpStatus: '',
        i6000Status: '',
      },
      erpSyncStatusList: [],
      iSyncStatusList: [],
      useStatusList: [],
      deviceTypeList: [],
      erpTransferStatusList: [],

      tableData: [],
      tableHeight: '500px',
      tableLoading: false,
      total: 0,


      dialogVisible: false,
      selectionList: [],
      mapData: [],
      tableHeight2: '500px',
      rowSpanArr1: [],
      selectArr: []
    }
  },
  watch: {
    'searchForm.erpAssetCode'(newVal, oldVal) {
      if (newVal == '') {
        this.searchForm.erpAssetCode = null;
      }
    },
    'searchForm.deviceCode'(newVal, oldVal) {
      if (newVal == '') {
        this.searchForm.deviceCode = null;
      }
    },
  },
  mounted() {
    this.getCmdbDictList('1097745969774592');// 设备类型
    this.getCmdbDictList('1130565584879617');// ERP转资状态
    this.getDict();
    this.getList();
  },
  methods: {
    isSync(val){
      
    },
    syncSub(){
      // console.log(111, this.selectionList)
      // return
      if(this.selectionList.length > 30){
        this.$message.warning('同步I6000平台数量请控制在30条以内！')
        return
      }
      if(this.dup(this.selectionList).length != 0){
        this.$message.warning('请选择一条信息！')
        return
      }
      this.syncLoading = true
      syncI6000(this.selectionList).then(res=>{
        this.syncLoading = false
        this.$message.success('操作成功！')
        this.dialogVisible = false
        this.getList()
      })


    },
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection;
    },
    handleTableData1(tableData) {
      let rowSpanArr = [], position = 0
      for (const [index, item] of tableData.entries()) {
        if (index == 0) {
          rowSpanArr.push(1)
          position = 0
        } else {
          if (item.erpAccountCode == tableData[index - 1].erpAccountCode) {
            rowSpanArr[position] += 1
            rowSpanArr.push(0)
          } else {
            rowSpanArr.push(1)
            position = index
          }
        }
      }
      this.rowSpanArr1 = rowSpanArr
    },
    objectSpanMethods({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const rowSpan = this.rowSpanArr1[rowIndex]
        return {
          rowspan: rowSpan,
          colspan: 1
        }
      }
    },

    handleChange(val){
      this.selectArr = val
    },
    handleSyncs(){
      
      let arrs = this.selectArr.map(ele=>{
        return {
          erpAssetCode: ele.erpAssetCode,
          erpAccountCode: ele.erpAccountCode,
          deviceCode: ele.deviceCode,
        }
      })
      this.btnLoading = true
      selectI6000(arrs).then(res=>{
          this.dialogVisible = true
          let datas = res.data
          let arrrs = []
          for(let key in datas){
            let cur1 = this.selectArr.filter(ele=> ele.erpAccountCode == key)[0]

            let code1 = datas[key].code
            let deviceCode = datas[key].deviceCode
            let remake = datas[key].remake
            let isAddI6000Detail = datas[key].isAddI6000Detail
            
            let juti = datas[key].i6000ResultMap

            if(code1){
              juti.forEach(ele=>{
                ele.deviceType = cur1.deviceType
                ele.erpAccountCode = cur1.erpAccountCode
                ele.deviceCode = deviceCode
                ele.erpAssetCode = cur1.erpAssetCode
                ele.uuid = cur1.uuid
                ele.code = code1
                ele.remake = remake
                arrrs.push(ele)
              })
            }else{
              arrrs.push({
                deviceType: cur1.deviceType,
                erpAccountCode: cur1.erpAccountCode,
                deviceCode: deviceCode,
                erpAssetCode: cur1.erpAssetCode,
                uuid: cur1.uuid,
                code: code1,
                remake: remake,
                isAddI6000Detail: isAddI6000Detail,
                isAddI6000Detail2: isAddI6000Detail
              })
            }

            
          }
          // arrrs.forEach(ele=>{
          //   ele.erpAccountCode = row.erpAccountCode
          //   ele.deviceCode = row.deviceCode
          //   ele.erpAssetCode = row.erpAssetCode
          //   ele.uuid = row.uuid
          // })
          this.mapData = arrrs
          this.handleTableData1(arrrs)
          this.btnLoading = false
          // let datas = res.data[row.deviceCode].i6000ResultMap
          // console.log(res, datas)
          // datas.forEach(ele=>{
          //   ele.erpAccountCode = row.erpAccountCode
          //   ele.deviceCode = row.deviceCode
          //   ele.erpAssetCode = row.erpAssetCode
          //   ele.uuid = row.uuid
          // })
          // this.mapData = datas
          // this.handleTableData1(datas)
      })
    },
    dup( arr ){
      const seenId = new Set()
      let flag = arr.filter(ele=>{
        if( seenId.has(ele.deviceCode) ){
          return true
        }else{
          seenId.add(ele.deviceCode)
          return false
        }
      })
      return flag
    },

    handleSync(row){
      let params = [{
        erpAssetCode: row.erpAssetCode,
        erpAccountCode: row.erpAccountCode,
        deviceCode: row.deviceCode,
      }]
      selectI6000(params).then(res=>{
        this.dialogVisible = true
        let code1 = res.data[row.erpAccountCode].code
        let deviceCode = res.data[row.erpAccountCode].deviceCode
        let remake = res.data[row.erpAccountCode].remake
        let isAddI6000Detail = res.data[row.erpAccountCode].isAddI6000Detail
        let datas = res.data[row.erpAccountCode].i6000ResultMap

        

        if(code1){
          datas.forEach(ele=>{
            ele.deviceType = row.deviceType
            ele.erpAccountCode = row.erpAccountCode
            ele.deviceCode = deviceCode
            ele.erpAssetCode = row.erpAssetCode
            ele.uuid = row.uuid
            ele.code = code1
            ele.remake = remake
          })
        }else{
          datas.push({
            deviceType: row.deviceType,
            erpAccountCode: row.erpAccountCode,
            deviceCode: deviceCode,
            erpAssetCode: row.erpAssetCode,
            uuid: row.uuid,
            code: code1,
            remake: remake,
            isAddI6000Detail: isAddI6000Detail,
            isAddI6000Detail2: isAddI6000Detail
          })
        }


        
        this.mapData = datas
        this.handleTableData1(datas)


        // this.$confirm('啊实打实大大实打实', '', {
        //   confirmButtonText: '同步',
        //   cancelButtonText: '取消'
        // }).then(()=>{
        //   this.$message.success('同步成功！')
        // }).catch(()=>{

        // })
      })



    },

    getDict() {
      let dictList = [
        'isSyncErpI6000', 'isUseErpStatus'
      ]
      for (let i = 0; i < dictList.length; i++) {
        let item = dictList[i]
        getDictList(item).then(res => {
          // 使用状态
          if (item === 'isUseErpStatus') {
            this.useStatusList = res.data
          }
          //  erp同步状态 i6000同步状态
          else if (item === 'isSyncErpI6000') {
            this.erpSyncStatusList = res.data
            this.iSyncStatusList = res.data
          }
        })
      }
    },
    getCmdbDictList(code) {
      //加载cmdb字典
      let query = {};
      query.ciId = code;
      getDictCmdbList(query).then(res => {
        if (code === '1097745969774592') {
          this.deviceTypeList = res.data;
        } else if (code === '1130565584879617') {
          this.erpTransferStatusList = res.data;
        }
      });
    },
    showDictLable(code, dictList) {
      //字典回显
      if (dictList !== null && code !== '') {
        let items = dictList.filter(item => item.dictKey === code.toString());
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }
      }
      return code;
    },
    getColorForStatus(status) {
      if (status == '0') {
        //未同步
        return '#888888'
      } else if (status == '1') {
        //同步中
        return '#FBC21C'
      } else if (status == '2') {
        //已同步
        return '#229342';
      } else if (status == '3') {
        //同步失败
        return '#E33D30';
      } else if (status == '99') {
        //部分成功
        return '#28B3A9';
      }
      return '';
    },
    getList() {
      this.tableLoading = true;
      projectErpList(this.searchForm).then(res => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    search() {
      this.searchForm.current = 1;
      this.getList()
    },
    rest() {
      this.searchForm = {
        current: 1,
        size: 20,
        wbsCode: this.wbsElement,
        wbsName: this.wbsProject,
        erpAssetStatus: '',
        erpStatus: '',
        i6000Status: '',
      }
      this.getList()
    },
    exportList() {
      let params = {}
      if(this.selectionList.length>0){
        params = {
          uuidList: this.selectionList,
          wbsCode:this.wbsElement
        }
      }else{
        params = {
          wbsCode:this.wbsElement
        }
      }
      this.download(
       '/api/idevelop-device/projectmanagerdetail/export',
        params,
        "wbs项目信息.xlsx"
        // ,"导入模板生成中..."
      );
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .bgE{
    background: #e2f2ff;
    border: 1px solid #fff!important;
  }
</style>
<style lang="scss" scoped>
  .itemStyle{
    margin: 5px 15px;
    font-size: 11px;
    >div{
      line-height: 18px;
    }
  }
  .itemStyle2{
    width: 100%;
    /* height: 80px; */
    margin: 0;
    white-space: initial;
  }
</style>
