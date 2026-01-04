<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="() => $emit('close')"
    :show-close="true"
    append-to-body
    :visible.sync="isShow"
    title="设备列表"
    width="1200px"
    top="10vh"
    v-el-drag-dialog
  >
    <el-form
      ref="searchForm"
      :model="searchForm"
      label-suffix=":"
      label-width="100px"
      class="xt_search_form"
    >
      <el-row v-if="repairType === '1'">
        <el-col :span="8">
          <el-form-item label="使用人" prop="user">
            <el-input v-model="searchForm.user" clearable placeholder="请输入使用人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="IP地址" prop="ip">
            <el-input v-model="searchForm.IP" clearable placeholder="请输入IP地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="MAC地址" prop="mac">
            <el-input v-model="searchForm.MAC" clearable placeholder="请输入MAC地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备编码" prop="deviceCode">
            <el-input v-model="searchForm.deviceCode" clearable placeholder="请输入设备编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出厂序列号" prop="sn">
            <el-input v-model="searchForm.sn" clearable placeholder="请输入出场序列号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备来源" prop="deviceSourceCode">
            <el-select v-model="searchForm.deviceSourceCode" placeholder="请选择设备来源" clearable>
              <el-option v-for="dict in deviceSourceList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-else-if="repairType === '2'">
        <el-col :span="8">
          <el-form-item label="设备编码" prop="deviceCode">
            <el-input v-model="searchForm.deviceCode" clearable placeholder="请输入设备编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出厂序列号" prop="sn">
            <el-input v-model="searchForm.sn" clearable placeholder="请输入出场序列号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备来源" prop="deviceSourceCode">
            <el-select v-model="searchForm.deviceSourceCode" placeholder="请选择设备来源" clearable>
              <el-option v-for="dict in deviceSourceList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-else-if="repairType === '3'">
        <el-col :span="8">
          <el-form-item label="设备分类" prop="deviceCategoryCode">
            <el-select v-model="searchForm.deviceCategoryCode" :disabled="deviceCategory" placeholder="请选择设备分类" clearable @change="deviceCategoryCodeChange">
              <el-option v-for="dict in deviceCategoryList" :key="dict.dictValue" :label="dict.dictValue" :value="dict.dictKey"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备类型" prop="deviceTypeCode">
            <el-select v-model="searchForm.deviceTypeCode" :disabled="!(searchForm.deviceCategoryCode )" placeholder="请输入设备类型" clearable>
              <el-option v-for="dict in deviceTypeList" :key="dict.dictValue" :label="dict.dictValue" :value="dict.dictKey"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备编码" prop="deviceCode">
            <el-input v-model="searchForm.deviceCode" clearable placeholder="请输入设备编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出厂序列号" prop="sn">
            <el-input v-model="searchForm.sn" clearable placeholder="请输入出场序列号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备来源" prop="deviceSource">
            <el-select v-model="searchForm.deviceSourceCode" placeholder="请选择设备来源" clearable>
              <el-option v-for="dict in deviceSourceList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
      <div slot="rightBtnBox">
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">查 询</el-button>
        <el-button type="primary" plain size="small" icon="el-icon-refresh" @click="restForm">重 置</el-button>
        <el-button type="primary" plain size="small" @click="submitDev">提 交</el-button>
      </div>
    </formTitle>
    <div class="table_box">
      <el-table
        ref="dataTable"
        stripe
        size="small"
        :data="dataList"
        height="500px"
        v-loading="loading"
      >
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column
          v-for="item in tableCol"
          :key="item.label"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          align="center" show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="getList"
      />
    </div>
  </el-dialog>
</template>

<script>
import {getCmdbList, getDictCmdbList, getDictList, getDictCmdbListPid} from "@/api/dict";
import {repairCmdbDevList} from "@/api/operation/devRepair/index"
import {computerTable, printTable, otherTable} from "./devTableCol"


export default {
  props: ["isShow", "repairType", "userDetail"],
  data() {
    return {
      searchForm: {
        current: 1,
        size: 20,
        deviceTypeCode: undefined
      },
      deviceSourceList: [],
      deviceCategoryList: [],
      deviceTypeList: [],
      dataList: [],
      tableCol: [],
      total: 0,
      loading: false
    }
  },
  mounted() {
    this.init()
    this.getDict()
    this.getCmdbDictList()
    this.getList()
  },
  methods: {
    getDict() {
      let dict = ['deviceSource']
      for (let i = 0; i < dict.length; i++) {
        getDictList(dict[i]).then(res => {
          // if(dict[i] == 'deviceSource') this.deviceSourceList = res.data
        })
      }
    },
    getCmdbDictList(code) {
      //加载cmdb字典
      let dict = ['1097745625841664', '1097745969774592', '1102860579569664']
      for (let i = 0; i < dict.length; i++) {
        getDictCmdbList({ciId: dict[i]}).then(res => {
          if (dict[i] === '1097745625841664') {
            this.deviceCategoryList = res.data;
          } else if (dict[i] === '1097745969774592') {
            // this.deviceTypeList  = res.data;
            this.deviceTypeListAll = res.data;
          } else if (dict[i] === '1102860579569664') { // 设备来源
            this.deviceSourceList = res.data;
          }
        })
      }
    },
    deviceCategoryChange(val) {
      //设备分类选择
      let code = ''
      for (let i = 0; i < this.deviceCategoryList.length; i++) {
        if (val == this.deviceCategoryList[i].dictValue) {
          code = this.deviceCategoryList[i].dictKey
          break
        }
      }
      this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));
    },
    init() {
      if (this.repairType === '1') {
        this.tableCol = computerTable.dialogTable
      } else if (this.repairType === '2') {
        this.tableCol = printTable.dialogTable
      } else if (this.repairType === '3') {
        this.tableCol = otherTable.dialogTable
      }
    },
    deviceCategoryCodeChange(code) {
      //设备分类选择
      this.searchForm.deviceType = undefined
      this.searchForm.deviceTypeCode = undefined
      // this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));
      this.getDictCmdbListPid('1097745969774592', code) // 设备类型
    },
    getDictCmdbListPid(ciId, pid) {
      getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
        if (ciId === '1097745969774592') { // 设备类型
          let datas = res.data
          this.deviceTypeList = datas;
          //过滤选项
          this.filterDeviceTypeList(pid);
        }
      });
    },
    filterDeviceTypeList(pid) {
      /*过滤掉:
        终端设备：台式机、笔记本电脑、平板电脑
        办公设备：打印机
      */

      if (pid == this.$store.state.common.govern.device_terminal) {
        //终端设备
        this.deviceTypeList = this.deviceTypeList.filter(
          a => a.dictKey != this.$store.state.common.govern.dictDesktopPC
            && a.dictKey != this.$store.state.common.govern.dictNote
            && a.dictKey != this.$store.state.common.govern.dictNotePad);
      } else if (pid == this.$store.state.common.govern.device_work) {
        //办公设备
        this.deviceTypeList = this.deviceTypeList.filter(a => a.dictKey != this.$store.state.common.govern.device_prient);
      }
    },
    getList() {
      this.searchForm.deviceStatusCode = '1105089449492480'
      this.searchForm.repairType = this.repairType
      this.searchForm.ownerUnitCode = this.userDetail.ownerUnit
      this.loading = true
      repairCmdbDevList(this.searchForm).then(res => {
        this.dataList = res.data.data
        this.total = res.data.total
        this.loading = false
      })
    },
    deviceChange(code) {
      this.searchForm.deviceSourceCode = code;
      this.$forceUpdate();
    },
    search() {
      this.searchForm.current = 1
      this.getList()
    },
    restForm() {
      this.searchForm = {
        current: 1,
        size: 20,
        deviceStatusCode: '1105089449492480',
        repairType: this.repairType,
        ownerUnitCode: this.userDetail.ownerUnit,
        deviceTypeCode: undefined
      }
      this.getList()
    },
    submitDev(val) {
      let selectList = this.$refs.dataTable.selection
      if (selectList.length === 0) {
        this.$message({
          type: "warning",
          message: "请至少选择一条数据!"
        });
        return
      }
      this.$emit('submitVal', selectList)
    },
  },
}
</script>
