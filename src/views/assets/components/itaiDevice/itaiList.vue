<template>
  <div class="d_root">
    <!--    信创列表-->
    <div class="d_form">
      <el-form ref="submitForm" :model="queryParams" label-suffix=":" label-width="80px" size="small">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="领用单位" size="small">
              <xt-tree-lzay-select :formValue="queryParams.receiveUnit"
                                   :selectType="'CORP'"
                                   @getTreeItem="getuseApplyUnit"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="领用部门" size="small">
              <xt-tree-lzay-select :formValue="queryParams.receiveDept"
                                   :unit-id="queryParams.receiveUnitCode"
                                   :selectType="'DEPT'"
                                   @getTreeItem="getuseApplyDept"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备类型" size="small">
              <el-select v-model="queryParams.deviceTypeCode" placeholder="请输入设备类型" clearable>
                <el-option v-for="dict in deviceTypeList"
                           :key="dict.dictKey"
                           :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备状态" size="small">
              <el-select v-model="queryParams.deviceStatusCode" filterable clearable :placeholder="getPlaceholder(deviceStatusList)" :disabled="getDisabled(deviceStatusList)">
                <el-option v-for="dict in deviceStatusList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="设备来源" size="small">
              <el-select v-model="queryParams.deviceSourceCode" filterable clearable :placeholder="getPlaceholder(deviceSourceList)" :disabled="getDisabled(deviceSourceList)">
                <el-option v-for="dict in deviceSourceList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="投运日期">
              <el-date-picker
                v-model="createTimes"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                @change="changeTime"
                placeholder="请选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="制造商" size="small">
              <el-select v-model="queryParams.makerCode" filterable clearable :placeholder="getPlaceholder(makerList)" :disabled="getDisabled(makerList)">
                <el-option v-for="dict in makerList"
                           :key="dict.dictKey"
                           :label="dict.dictValue"
                           :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品牌" size="small">
              <el-select v-model="queryParams.brandCode" filterable clearable :placeholder="getPlaceholder(brandList,{name:queryParams.makerCode,label:'制造商'})"
                         :disabled="getDisabled(brandList,{name:queryParams.makerCode,label:'制造商'})">
                <el-option v-for="dict in brandList"
                           :key="dict.dictKey"
                           :label="dict.dictValue"
                           :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="系列" size="small">
              <el-select v-model="queryParams.seriesCode" filterable clearable :placeholder="getPlaceholder(seriesList,{name:queryParams.brandCode,label:'品牌'})"
                         :disabled="getDisabled(seriesList,{name:queryParams.brandCode,label:'品牌'})">
                <el-option v-for="dict in seriesList"
                           :key="dict.dictKey"
                           :label="dict.dictValue"
                           :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="型号" size="small">
              <el-select v-model="queryParams.deviceModelCode" filterable clearable :placeholder="getPlaceholder(deviceModelList,{name:queryParams.seriesCode,label:'系列'})"
                         :disabled="getDisabled(deviceModelList,{name:queryParams.seriesCode,label:'系列'})">
                <el-option v-for="dict in deviceModelList"
                           :key="dict.dictKey"
                           :label="dict.dictValue"
                           :value="dict.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属网络" size="small">
              <el-select v-model="queryParams.netWorkCode" filterable clearable :placeholder="getPlaceholder(netWorkList)" :disabled="getDisabled(netWorkList)">
                <el-option v-for="dict in netWorkList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="CPU品牌" size="small">
              <el-select v-model="queryParams.cpuBrandCode" filterable clearable :placeholder="getPlaceholder(cpuBrandList)" :disabled="getDisabled(cpuBrandList)">
                <el-option v-for="dict in cpuBrandList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="CPU架构" size="small">
              <el-select v-model="queryParams.cpuArchCode" filterable clearable :placeholder="getPlaceholder(cpuArchList)" :disabled="getDisabled(cpuArchList)">
                <el-option v-for="dict in cpuArchList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IP地址" size="small">
              <el-input v-model="queryParams.ip" clearable placeholder="请输入IP地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="MAC地址" size="small">
              <el-input v-model="queryParams.mac" clearable placeholder="请输入MAC地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="d_end">
              <div>
                <el-button type="primary" plain size="small" @click="getList">查 询</el-button>
                <el-button type="success" plain size="small" @click="reset">重 置</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!-- 设备列表 -->
      <el-table ref="table" :data="tableData" stripe border size="small" height="50vh" v-loading="tableLoading" @row-dblclick="rowDbClcik">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <!--        <el-table-column width="50" type="index" :index="Nindex" label="序号" align="center"></el-table-column>-->
        <el-table-column label="设备编码" width="180" prop="deviceCode" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="设备来源" width="150" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ getDictValue(deviceSourceList, scope.row.deviceSourceCode) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备类型" width="150" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ getDictValue(deviceTypeList, scope.row.deviceTypeCode) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备状态" prop="ciLabel" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <div class="vh_center">
              <div class="d_status" :style="getStatusStyle(scope.row.deviceStatusCode)">
                <span>{{ getDictValue(deviceStatusList,scope.row.deviceStatusCode) }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="制造商" prop="maker" width="200" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="品牌" prop="brand" width="120" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="系列" prop="series" width="140" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="型号" prop="deviceModel" width="140" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="CPU品牌" prop="cpuBrand" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="CPU架构" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ getCpuArch(scope.row.cpuArchCode) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="领用单位" prop="receiveUnit" width="180" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="领用部门" prop="receiveDept" width="180" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="投运日期" prop="oprtDate" width="100" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="MAC地址" prop="MAC" width="150" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="IP地址" prop="IP" width="150" show-overflow-tooltip align="center"></el-table-column>

        <el-table-column fixed="right" align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="seeDetail(scope.row)">查 看</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!-- 分页 -->
      <pagination :total="page.total" :page.sync="page.currentPage" :limit.sync="page.pageSize" @pagination="getList"/>
    </div>
  </div>
</template>

<script>
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import {informationList} from "@/api/assets/itaiDevice";
import {mapGetters} from "vuex";

export default {
  name: "itaiList",
  components: {xtTreeLzaySelect},
  data() {
    return {
      deviceTypeList: [],
      queryParams: {},
      ciIdList: null,

      deviceStatusList: null,
      deviceSourceList: null,
      createTimes: [],
      makerList: null,
      brandList: null,
      seriesList: null,
      deviceModelList: null,

      netWorkList: null,
      cpuBrandList: null,
      cpuArchList: null,

      tableLoading: false,
      tableData: null,
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
    };
  },
  watch: {
    'queryParams.makerCode'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        //加载品牌
        this.getCmdbDictListPid(this.ciIdList.find(a => a.name == 'brand'), newVal);
      }
      //初始化品牌、系列、型号
      this.brandList = null;
      this.seriesList = null;
      this.deviceModelList = null;
      if (!this.isEmpty(this.queryParams.brandCode)) {
        this.queryParams.brandCode = null;
      }
      if (!this.isEmpty(this.queryParams.seriesCode)) {
        this.queryParams.seriesCode = null;
      }
      if (!this.isEmpty(this.queryParams.deviceModelCode)) {
        this.queryParams.deviceModelCode = null;
      }
    },
    'queryParams.brandCode'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        //加载系列
        this.getCmdbDictListPid(this.ciIdList.find(a => a.name == 'series'), newVal);
      }
      //初始化系列、型号
      this.seriesList = null;
      this.deviceModelList = null;
      if (!this.isEmpty(this.queryParams.seriesCode)) {
        this.queryParams.seriesCode = null;
      }
      if (!this.isEmpty(this.queryParams.deviceModelCode)) {
        this.queryParams.deviceModelCode = null;
      }
    },
    'queryParams.seriesCode'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        //加载型号
        this.getCmdbDictListPid(this.ciIdList.find(a => a.name == 'deviceModel'), newVal);
      }
      //初始化型号
      this.deviceModelList = null;
      if (!this.isEmpty(this.queryParams.deviceModelCode)) {
        this.queryParams.deviceModelCode = null;
      }
    }
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  mounted() {
    this.initId();
    this.initDeviceType();
    //this.getDictCmdbList('1097745969774592') // 设备类型
    this.requestLoadData();
  },
  methods: {
    reset() {
      this.queryParams = {};
      this.createTimes = [];
    },
    getList() {
      this.tableLoading = true;
      let pms = {
        ...this.queryParams,
        // area: this.userDetail.regionCode
      }
      informationList(pms, this.page.currentPage, this.page.pageSize).then(res => {
        this.tableData = res.data.data;
        this.page.total = res.data.total;
      }).finally(() => {
        this.tableLoading = false;
      })
    },
    initId() {
      this.ciIdList = [];
      this.ciIdList.push({name: 'deviceStatus', label: '设备状态', ciId: '1103423111233536'});
      this.ciIdList.push({name: 'deviceSource', label: '设备来源', ciId: '1102860579569664'});
      this.ciIdList.push({name: 'maker', label: '制造商', ciId: '1082610161090560'});
      this.ciIdList.push({name: 'brand', label: '品牌', ciId: '1082554947272704'});
      this.ciIdList.push({name: 'series', label: '系列', ciId: '1082609011851264'});
      this.ciIdList.push({name: 'deviceModel', label: '型号', ciId: '1082608047161344'});
      this.ciIdList.push({name: 'netWork', label: '所属网络', ciId: '1107942968721408'});
      this.ciIdList.push({name: 'cpuBrand', label: 'CPU品牌', ciId: '1082603970297856'});
      this.ciIdList.push({name: 'cpuArch', label: 'CPU架构', ciId: '1107948723306496'});
    },
    requestLoadData() {
      this.getList();
      //加载字典--设备状态
      this.getCmdbDictList(this.ciIdList.find(a => a.name == 'deviceStatus'));
      //加载字典--设备来源
      this.getCmdbDictList(this.ciIdList.find(a => a.name == 'deviceSource'));
      //加载制造商
      this.getCmdbDictList(this.ciIdList.find(a => a.name == 'maker'));
      //加载 所属网络
      this.getCmdbDictList(this.ciIdList.find(a => a.name == 'netWork'));
      //加载 CPU品牌
      this.getCmdbDictList(this.ciIdList.find(a => a.name == 'cpuBrand'));
      //加载 CPU架构
      this.getCmdbDictList(this.ciIdList.find(a => a.name == 'cpuArch'));
    },
    getCmdbDictList(item) {
      if (!item) {
        return;
      }
      //加载cmdb字典
      let query = {}
      getDictCmdbList({ciId: item.ciId}).then(res => {
        if (item.name === 'deviceStatus') {
          // 设备状态
          this.deviceStatusList = res.data;
        } else if (item.name === 'deviceSource') {
          // 设备来源
          this.deviceSourceList = res.data;
        } else if (item.name === 'maker') {
          // 制造商
          this.makerList = res.data;
        } else if (item.name === 'netWork') {
          // 所属网络
          this.netWorkList = res.data;
        } else if (item.name === 'cpuBrand') {
          // CPU品牌
          this.cpuBrandList = res.data;
        } else if (item.name === 'cpuArch') {
          // CPU架构
          this.cpuArchList = res.data;
        }
      });
    },
    initDeviceType() {
      //设备类型目前只有：笔记本电脑、台式机
      this.deviceTypeList = [];
      this.deviceTypeList.push({dictKey: this.$store.state.common.govern.dictNote, dictValue: '笔记本电脑'});
      this.deviceTypeList.push({dictKey: this.$store.state.common.govern.dictDesktopPC, dictValue: '台式机'});

      // console.log('this.deviceTypeList', this.deviceTypeList)
    },
    // getDictCmdbList(ciId){
    //   // //加载字典
    //   getDictCmdbList({ ciId: ciId }).then(res => {
    //     if(ciId==='1097745969774592'){ // 设备类型(终端设备)
    //       let datas = res.data
    //       this.deviceTypeList = datas.filter(item => item.pid == "1097756774301696");
    //     }
    //   });
    // },
    getCmdbDictListPid(item, pid) {
      getDictCmdbListPid({
        ciId: item.ciId,
        pid: pid,
      }).then(res => {
        if (item.name === 'brand') {
          //品牌
          this.brandList = res.data;
        } else if (item.name === 'series') {
          //系列
          this.seriesList = res.data;
        } else if (item.name === 'deviceModel') {
          //型号
          this.deviceModelList = res.data;
        }
      });
    },
    getuseApplyUnit(val) {
      this.queryParams.receiveUnitCode = val.id
      this.queryParams.receiveUnit = val.fullName;

      this.queryParams.receiveDeptCode = null;
      this.queryParams.receiveDept = null;
      this.$forceUpdate();
    },
    getuseApplyDept(val) {
      this.queryParams.receiveDeptCode = val.id;
      this.queryParams.receiveDept = val.fullName;
      this.$forceUpdate();
    },
    changeTime(val) {
      if (val == null) {
        this.queryParams.startOprtDate = '';
        this.queryParams.endOprtDate = '';
      } else {
        this.queryParams.startOprtDate = val[0]
        this.queryParams.endOprtDate = val[1]
      }
    },
    getPlaceholder(list, params) {
      if (params && this.isEmpty(params.name)) {
        return `请先选择${params.label}`;
      }
      return list == null ? '加载中' : '请选择';
    },
    getDisabled(list, params) {
      if (params) {
        if (this.isEmpty(params.name)) {
          return true;
        } else {
          return list == null ? true : false;
        }
      }
      return list == null ? true : false;
    },
    Nindex(index) {
      return index + 1 + (this.page.currentPage - 1) * this.page.pageSize;
    },

    getStatusStyle(statusCode) {
      if (statusCode == this.$store.state.common.govern.deviceOperation) {
        return {color: '#64CB31', border: '1px solid #64CB31'};
      } else if (statusCode == this.$store.state.common.govern.deviceKcby) {
        return {color: '#FCBF45', border: '1px solid #FCBF45'};
      } else if (statusCode == this.$store.state.common.govern.deviceTyzk) {
        return {color: '#FF5759', border: '1px solid #FF5759'};
      } else if (statusCode == this.$store.state.common.govern.deviceState3) {
        return {color: '#FF7759', border: '1px solid #FF7759'};
      } else if (statusCode == this.$store.state.common.govern.deviceState5) {
        return {color: '#B4B4B4', border: '1px solid #B4B4B4'};
      }
      return {color: '#64CB31', border: '1px solid #64CB31'};
    },
    getCpuArch(cpuArchCode) {
      if (!this.isEmpty(cpuArchCode)) {
        if (this.cpuArchList && this.cpuArchList.length > 0) {
          let fItem = this.cpuArchList.find(a => a.dictKey == cpuArchCode);
          if (fItem) {
            return fItem.dictValue;
          }
        }
        return cpuArchCode;
      }
      return null;
    },
    isEmpty(value) {
      if (value == null || value === '') {
        return true;
      }
      return false
    },
    seeDetail(row) {
      this.detialPage(row);
    },
    rowDbClcik(row, column, event) {
      this.detialPage(row);
    },
    detialPage(row) {
      let sarr = row.ciName ? row.ciName.split('_') : null;
      this.$router.push({
        path: '/detailRoute',
        query: {
          ciId: row.ciId,
          ciName: sarr ? `${sarr[0]}_${sarr[1]}` : '',
          devId: row.id,
          uuid: row.uuid,
          componentName: 'devBookDetail',
          routerTitle: '设备台账详情',
          isEdit: false,//设备台账由于权限太高，不允许修改，只允许查看,只能在数据治理中模块中点击才能编辑
        }
      });
    },
    getDictValue(list, code) {
      if (list) {
        let fItem = list.find(a => a.dictKey == code);
        if (fItem) {
          return fItem.dictValue;
        }
      }
      return null;
    }
  },
}
</script>
<style scoped lang="scss">
.d_root {
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  border-radius: 6px;
}

.d_form {
  padding: 12px;
}

.d_end {
  display: flex;
  justify-content: flex-end;
}

.vh_center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.d_status {
  width: 70px;
}
</style>
