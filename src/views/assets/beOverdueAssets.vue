<template>
  <basic-container>
    <div class="content-box">
      <div class="d_cb_title">
        <formTitle :titleText="'数据概况'" :titleType="'page_title'"></formTitle>
      </div>
      <div class="d_chart_parent">
        <div class="d_w33">
          <div id="oldDeviceCategorySum" class="d_w100"/>
          <div class="d_hcenter">
            <span class="s_desc">老旧设备分类统计</span>
          </div>
        </div>
        <div class="d_w33 d_loading">
          <div id="oldDeviceAgeSum" class="d_w100"/>
          <div class="d_hcenter">
            <span class="s_desc">{{ selDevice ? selDevice.name : '老旧设备' }}投运年限分布</span>
          </div>
        </div>
        <div class="d_w33 d_vhcenter">
          <div>
            <div class="d_dev_info d_start">
              <div>
                <i class="el-icon-s-platform" style="font-size: 3em;color: #409EFF"></i>
              </div>
              <div class="d_l12">
                <!--                设备分类：{{ messageName }}-->
                <div><span>设备分类：{{ messageName }}</span></div>
                <div><span>资产总额：{{ assetSum }}</span></div>
              </div>
            </div>
            <div>
              <el-table
                :data="deviceList"
                border
                height="170"
                :show-header="false">
                <el-table-column prop="name" header-align="center" align="center" width="220">
                  <template slot-scope="scope">
                    <span>{{ showDictLable(scope.row.name, deviceTypeListAll) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="value" header-align="center" align="center" width="180">
                  <template slot-scope="scope">
                    <span>{{ scope.row.value + ' 万元' }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page_form">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="设备分类" prop="deviceCategory">
              <el-select v-model="searchForm.deviceCategoryCode" @change="deviceCategoryChange" clearable placeholder="请选择所属分类">
                <el-option
                  v-for="item in deviceCategoryList"
                  :value="item.dictKey"
                  :key="item.dictKey"
                  :label="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备类型" prop="deviceTypeCode">
              <el-select v-model="searchForm.deviceTypeCode" clearable placeholder="请选择所属类型" :disabled="!searchForm.deviceCategoryCode">
                <el-option
                  v-for="item in deviceTypeList"
                  :value="item.dictKey"
                  :key="item.dictKey"
                  :label="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>


          <el-col :span="6">
            <el-form-item label="设备来源" prop="deviceSource">
              <el-select v-model="searchForm.deviceSource" placeholder="请选择设备来源" clearable>
                <el-option v-for="dict in deviceSourceList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备状态" prop="deviceStatus">
              <el-select v-model="searchForm.deviceStatus" clearable placeholder="请选择设备状态">
                <el-option v-for="dict in deviceStatusList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="所属单位" prop="receiveUnit">
              <xt-tree-lzay-select :formValue="searchForm.receiveUnitName"
                                   :selectType="'CORP'"
                                   :sel-ever-node="true"
                                   @getTreeItem="getEntityUnit"></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出厂序列号" prop="deviceCode">
              <el-input v-model="searchForm.sn" placeholder="请输入出厂序列号" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="投运年限" prop="useAge">
              <el-select v-model="searchForm.useAge" clearable placeholder="请选择投运年限">
                <el-option label="1年" :value="1"></el-option>
                <el-option label="2年" :value="2"></el-option>
                <el-option label="3年" :value="3"></el-option>
                <el-option label="4年" :value="4"></el-option>
                <el-option label="5年" :value="5"></el-option>
                <el-option label="6年" :value="6"></el-option>
                <el-option label="7年" :value="7"></el-option>
                <el-option label="8年" :value="8"></el-option>
                <el-option label="9年" :value="9"></el-option>
                <el-option label="10年" :value="10"></el-option>
                <el-option label="11年" :value="11"></el-option>
                <el-option label="12年" :value="12"></el-option>
                <el-option label="13年" :value="13"></el-option>
                <el-option label="14年" :value="14"></el-option>
                <el-option label="15年" :value="15"></el-option>
                <el-option label="16年" :value="16"></el-option>
                <el-option label="17年" :value="17"></el-option>
                <el-option label="18年" :value="18"></el-option>
                <el-option label="19年" :value="19"></el-option>
                <el-option label="20年" :value="20"></el-option>
                <el-option label="21年" :value="21"></el-option>
                <el-option label="22年" :value="22"></el-option>
                <el-option label="23年" :value="23"></el-option>
                <el-option label="24年" :value="24"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
            <el-button class="border-btn" size="small" @click="handleExport">导出</el-button>
            <el-button class="border-btn" size="small" @click="handleReseatYear">刷新投运年限</el-button>
            <el-button class="border-btn" size="small" @click="refreshAsset" v-show="buttunShow">刷新资产统计</el-button>
          </div>
        </formTitle>
      </el-row>
      <el-table
        ref="dataTable"
        stripe
        size="small"
        :data="dataList"
        :height="tableHeight"
        v-loading="loading"
        @selection-change="selectionChange"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="sn" label="出厂序列号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="receiveUnit" label="领用单位" align="center" width="220"
                         show-overflow-tooltip></el-table-column>

        <el-table-column prop="deviceType" label="设备类型" width="120" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="oprtDateFirst" label="首次投运日期" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="useAge" label="投运年限" width="90" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="age" label="建议年限" width="90" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="deviceStatusCode" label="设备状态" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.deviceStatusCode, deviceStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="afterStatusCode" label="维保情况" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.afterStatusCode, afterSaleStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceSourceCode" label="设备来源" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.deviceSourceCode, deviceSourceList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="assetCodeErp" label="ERP资产编码" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="onLoad"
      />
    </div>
  </basic-container>
</template>

<script>
import {Loading} from "element-ui";
import * as echarts from 'echarts'
import {getDictList, getDictCmdbList, getDictCmdbListPid} from "@/api/dict";

import {
  getOverdueCmdbList,
  refreshUseAge,
  refreshAsset,
  getDeviceAgeConfig,
  overdueDeviceStatistics,
  overdueDeviceAgeStatistics,
  getDeviceAssetCaching
} from "@/api/device/overdue";
import {mapGetters, mapState} from "vuex";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDeptList} from "@/api/system/dept";
import {getUserDetail} from "@/api/user";

let oldDeviceCategorySum = null;
let oldDeviceAgeSum = null;
export default {
  components: {xtTreeLzaySelect},
  data() {
    return {
      // 搜索相关
      searchForm: {
        current: 1,
        size: 20,
      },
      assetSearch: {},
      assetSearchDef: {},
      // 表格相关

      // messageName:'',
      dataList: [],
      selectionList: [],
      loading: false,
      tableHeight: 550,
      total: 0,
      // 字典
      deviceCategoryList: [],
      deviceTypeList: [],
      deviceTypeListAll: [],
      useKeepDeptList: [],
      deviceStatusList: [],
      deviceErpStatusList: [],
      deviceWBSList: [],
      afterSaleStatusList: [],
      deviceSourceList: [],
      optYearList: [],
      username: "",
      unitList: [],
      deviceAgeConfig: [],
      //统计
      oldDeviceCategoryStatics: [],
      deviceCategoryName: '',
      deviceList: null,
      selDevice: null,
      waitLoading: null,
      buttunShow:false
    };
  },
  computed: {
    ...mapGetters(["permission","userDetail"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    permissionList() {
      return {};
    },

    messageName() {
      let cur = this.deviceCategoryList.filter(el => {
        return el.dictKey == this.searchForm.deviceCategoryCode
      })[0]
      return cur ? cur.dictValue : '终端设备'
    },
    assetSum() {
      if (this.deviceList != null && this.deviceList.length > 0) {
        return this.deviceList.reduce((acc, item) => acc + item.value, 0) + ' 万元';
      }
      return '0 万元';
    }
  },
  mounted() {
    // 设置页面元素高度
    this.setPageContentHeight()
    // 设置表格高度
    this.setTableHeight()
    //加载字典--设备来源
    this.getCmdbDictList("1102860579569664");
    //加载字典--设备类型
    this.getCmdbDictList("1097745969774592");
    //加载字典--设备分类
    this.getCmdbDictList("1097745625841664");
    //加载字典--售后状态
    this.getCmdbDictList("1102247959527424");
    //加载字典--投运年限
    this.getCmdbDictList("1102238379737088");
    //加载字典--设备状态
    this.getCmdbDictList("1103423111233536");
    //加载建议年限
    // this.getDeviceAgeConfigList();
    if (this.userDetail.userName ==='管理员'){
      this.buttunShow = true;
    }
    //获取 部门列表
    this.getDeptList()
    //加载数据
    //this.onLoad();
    //加载默认数据
    this.beforeOpen()
    this.$nextTick(() => {
      this.loading = false;
      this.waitLoading = Loading.service({
        target: document.querySelector('.d_loading'),//loading需要覆盖的DOM节点，默认为body
        text: '',//加载文案
        lock: true,
        background: 'rgba(255,255,255,0.6)',//背景色
      });
      // 初始化 老旧设备分类统计
      this.initOldDeviceCategorySum()
      // 初始化 老旧设备投运年限分布
      this.initOldDeviceAgeSum()
      //设备分类请求
      this.initDeviceList();
    });

  },
  methods: {
    refreshAsset(){
      refreshAsset().then(res => {
        if (res.code === 200) {
          this.$message.success("刷新资产统计任务已启动, 请稍后刷新列表!");
        }
      });
    },
    deviceCategoryChange(val) {
      this.searchForm.deviceType = undefined
      this.getDictCmdbListPid('1097745969774592', val) // 设备类型
    },
    getDictCmdbListPid(ciId, pid) {
      getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
        if (ciId === '1097745969774592') { // 设备类型
          this.deviceTypeList = res.data;
        }
      });
    },
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 50 - 47 + 'px'
    },
    getCmdbDictList(code) {
      //加载cmdb字典
      let query = {}
      query.ciId = code || '1082372687986688'
      getDictCmdbList(query).then(res => {
        if (code === '1102238379737088') {
          this.optYearList = res.data;
        } else if (code === '1102247959527424') {
          this.afterSaleStatusList = res.data;
        } else if (code === '1097745625841664') {
          this.deviceCategoryList = res.data;
        } else if (code === '1097745969774592') {
          this.deviceTypeList = res.data;
          this.deviceTypeListAll = res.data;
        } else if (code === '1103423111233536') {
          this.deviceStatusList = res.data;
        } else if (code === '1102860579569664') {
          this.deviceSourceList = res.data;
        }
      });
    },
    handleQuery() {
      this.searchForm.current = 1
      this.onLoad();

    },
    async getDeptList() {
      //获取部门 单位
      await getDeptList().then(res => {
        this.unitList = res.data
      })
    },
    // eslint-disable-next-line no-unused-vars
    getEntityUnit(val) {
      //选择领用单位 部门
      this.searchForm.receiveUnitName = val.fullName
      this.searchForm.receiveUnit = val.id
      this.$refs.searchForm.$forceUpdate()
      this.$forceUpdate()
    },
    getEntityDept(val) {
      //选择领用单位 部门
      this.searchForm.receiveDept = val.fullName
      //this.searchForm.receiveDept = val.id
      this.$refs.searchForm.$forceUpdate()
      this.$forceUpdate()
    },
    showDictLable(code, dictList) {
      //字典回显
      if (dictList != null && code != '') {
        let items = dictList.filter(item => item.dictKey == code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }
      }
      return code;
    },
    searchReset() {
      //重置按钮
      //this.$refs.searchForm.resetFields();
      // this.searchForm.oldMark = '是';

      this.searchForm = {
        current: 1,
        size: 20,
      };
      this.selDevice = null;
      this.assetSearchDef = {
        deviceCategoryCode: 1097756774301696
      }
      getDeviceAssetCaching(this.assetSearchDef).then(res => {
        this.deviceList = res.data
      })
      this.resetLoad();
    },
    resetLoad() {
      //加载数据
      this.loading = true;
      //this.searchForm.ciId = '1082372687986688'
      //加载cmdb的IT设备
      getOverdueCmdbList(this.searchForm).then(res => {
        const data = res.data;
        const datas = data.data
        this.dataList = datas;
        // datas.forEach( async (el, index)=>{
        //   let aaa = await getDeviceAgeConfig({deviceType:el.deviceTypeCode})
        //   el.age = aaa.data
        //   if( index+1 == datas.length ){
        //     this.dataList = datas;
        //   }
        // })

        this.total = data.total || 0;
        this.loading = false;
      });
      // 老旧设备投运年限分布
      this.initOldDeviceAgeSum({deviceCategoryCode: this.searchForm.deviceCategoryCode});
      // 默认资产展示终端设备
      this.assetSearchDef = {
        deviceCategoryCode: 1097756774301696
      }
      getDeviceAssetCaching(this.assetSearchDef).then(res => {
        this.deviceList = res.data
      })
    },
    onLoad() {
      //加载数据
      this.loading = true;
      //this.searchForm.ciId = '1082372687986688'
      //加载cmdb的IT设备
      getOverdueCmdbList(this.searchForm).then(res => {
        const data = res.data;
        const datas = data.data
        this.dataList = datas;
        // datas.forEach( async (el, index)=>{
        //   let aaa = await getDeviceAgeConfig({deviceType:el.deviceTypeCode})
        //   el.age = aaa.data
        //   if( index+1 == datas.length ){
        //     this.dataList = datas;
        //   }
        // })


        this.total = data.total || 0;
        this.loading = false;
      });
      //老旧设备投运年限分布联动
      this.initOldDeviceAgeSum({deviceCategoryCode: this.searchForm.deviceCategoryCode});
      // 设备资产联动
      this.initDeviceList({deviceCategoryCode: this.searchForm.deviceCategoryCode})

    },
    handleExport() {
      //导出
      if (this.total > 99999) {
        //判断当前导出条件下的所以行数，过多时提示
        this.$message.warning("导出数据过多，请通过条件筛选后再进行数据导出！");
      } else {
        this.$confirm("是否导出数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.download(
            "/api/idevelop-device/device/overdue/overdue/export",
            this.searchForm,
            "逾期资产设备列表.xlsx"
          )
        });
      }
    },
    handleReseatYear() {
      //刷新投运年限
      this.$message.success("刷新投运年限任务启动中...");
      refreshUseAge().then(res => {
        if (res.code === 200) {
          this.$message.success("刷新投运年限任务已启动, 请稍后刷新列表!");
          this.onLoad();
        }
      });
    },
    beforeOpen() {
      this.tableLoading = true
      //加载默认数据
      getUserDetail().then(res => {
        let usr = res.data;
        this.searchForm.area = usr.regionCode || ''
        // 获取WBS数据
        this.onLoad()
        this.resetLoad()
      }).catch(() => {
        this.tableLoading = false
        // 获取WBS数据
        this.onLoad()
        this.resetLoad()
      });
    },
    initDeviceList(row) {
      this.assetSearch = {
        deviceCategoryCode: row.deviceCategoryCode
      }
      getDeviceAssetCaching(this.assetSearch).then(res => {
        this.deviceList = res.data
      })
    },
    searchList(row) {
      this.searchForm = {
        current: 1,
        size: 20,
        deviceCategoryCode: row.deviceCategoryCode
      }
      this.onLoad();
    },

    initOldDeviceAgeSum(row) {
      overdueDeviceAgeStatistics(row ? row : null).then(res => {
        if (this.waitLoading) {
          this.waitLoading.close();
          this.waitLoading = null;
        }
        this.oldDeviceAgeStatistics = res.data;
        let deviceStockeds = [];
        this.oldDeviceAgeStatistics.forEach(ele => {
          deviceStockeds.push({
            name: ele.useAge,
            value: ele.devSize
          });
        })
        this.initOldDeviceAgeEcharts(deviceStockeds)
        // 初始化 老旧设备投运年限统计
      })
    },
    initOldDeviceAgeEcharts(deviceStockeds) {
      //数据格式转换
      const result = deviceStockeds.map(item => [item.value, item.name]);
      //初始化 老旧设备投运年限统计
      oldDeviceAgeSum = echarts.init(document.getElementById('oldDeviceAgeSum'));
      const options = {
        tooltip: {
          trigger: 'item'
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: {
          splitLine: {
            show: false,
            lineStyle: {
              color: ['#00B7F9'],
              width: 1,
              type: 'solid',
            },
          },
          type: 'value',
          boundaryGap: [0, 0]
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            margin: 10
          },
        },
        series: [
          {
            name: `投运年限分布${this.selDevice ? `(${this.selDevice.name})` : ''}`,
            type: 'bar',
            data: result,
            top: 30,
            itemStyle: {
              color: '#1C88E2',
              barBorderRadius: [0, 0, 0, 0],
            },
            barCategoryGap: '30%'
          }
        ]
      };
      oldDeviceAgeSum.setOption(options);
    },
    initOldDeviceCategorySum() {
      overdueDeviceStatistics().then(res => {
        this.oldDeviceCategoryStatics = res.data
        let deviceStockeds = [];
        this.oldDeviceCategoryStatics.forEach(ele => {
          deviceStockeds.push({
            value: ele.devSize,
            name: ele.deviceCategory,
            code: ele.deviceCategoryCode
          });
        })
        this.initOldDeviceStockedEcharts(deviceStockeds)
        // 初始化 老旧设备分类统计
      })
    },
    initOldDeviceStockedEcharts(deviceStockeds) {
      // 初始化 老旧设备分类统计
      oldDeviceCategorySum = echarts.init(document.getElementById('oldDeviceCategorySum'));
      const options = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          show: true,
          right: 80,
          top: 30,
        },
        series: [
          {
            // color: ['#2465E0', '#84B7F9', '#5F9CF8', '#CEE5FC', '#AAD0FB', '#E5F3FF', '#2478F2', '#84B7F9', '#99C7F9'],
            color: ['#3C97F2', '#44CC86', '#9BE2E8', '#6DC8EC', '#6E8CDE', '#EB5A49', '#FB9E02', '#F7DE2C', '#FF7081'],
            type: 'pie',
            top: '10%',
            left: '-20%',
            radius: ['0%', '80%'],
            avoidLabelOverlap: true,
            labelLine: {
              show: true
            },
            data: deviceStockeds
          }
        ]
      };
      oldDeviceCategorySum.setOption(options);

      //注册饼状图点击事件
      oldDeviceCategorySum.on('click', (params) => {
        if (this.waitLoading) {
          this.waitLoading.close();
          this.waitLoading = null;
        }
        this.waitLoading = Loading.service({
          target: document.querySelector('.d_loading'),//loading需要覆盖的DOM节点，默认为body
          text: '',//加载文案
          lock: true,
          background: 'rgba(255,255,255,0.6)',//背景色
        });
        this.selDevice = params;
        //刷新柱状图
        this.initOldDeviceAgeSum({deviceCategoryCode: params.data.code});

        //此处刷新设备分类信息
        this.initDeviceList({deviceCategoryCode: params.data.code})

        //刷新列表
        this.searchList({deviceCategoryCode: params.data.code});
      });
    },
  }
}
</script>

<style lang='scss' scoped>
.content-box {
  width: calc(100% - 5px);
  height: 300px;
  margin: -20px 0px 20px 0px;
  padding-bottom: 22px;

  .d_cb_title {
    height: 40px;
  }

  .d_chart_parent {
    height: 260px;
    display: flex;
    justify-content: space-around;
  }

  .d_w33 {
    width: 33.33%;
    background-color: #fff;
  }

  .d_w100 {
    width: 100%;
    height: 100%;
  }

  .d_hcenter {
    display: flex;
    justify-content: center
  }

  .d_vhcenter {
    display: flex;
    align-items: center;
    justify-content: center
  }

  .d_start {
    display: flex;
    justify-content: flex-start;
  }

  .s_desc {
    font-size: 13px;
    margin-top: 12px
  }

  .i_img {
    width: 50px;
    height: 50px;
  }

  .d_l12 {
    margin-left: 12px;
  }

  .d_dev_info {
    margin-bottom: 12px;
  }
}

.el-col-6 {
  height: 30px !important;
}

.page_title_pie {
  font-size: 12px;
  color: #374c78;
  font-weight: 600;
  line-height: 30px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-bottom: 5px;
  margin-right: 5px;
  position: relative;
  border-bottom: 1px #e4e7ed solid;

  &::before {
    content: "";
    width: 4px;
    height: 15px;
    background: #3a86ff;
    border-radius: 6px;
    margin-right: 10px;
    display: inline-block;
  }
}

.query-btn {
  height: 24px !important;
  padding: 3px 5px !important;
  border: none !important;
  font-size: 10px !important;
  margin-bottom: 2px !important;
}

.query-btn:active, .is-active {
  background-color: #ecf5ff !important;
}


</style>
