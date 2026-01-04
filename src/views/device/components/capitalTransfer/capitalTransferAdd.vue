<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <formTitle :titleText="'转资申请信息'" :titleType="'page_title'"></formTitle>
      <el-scrollbar style="height:calc(100% - 80px - 48px)">
        <el-form :model="form" ref="dataForm" class="xt_form" label-width="150px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="工单编号" prop="filingNo" :rules="[{ required: false, message: '建档编号不能为空'}]"
                            size="small">
                <el-input v-model="form.filingNo" placeholder="发起流程时自动获取" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备分类" prop="deviceCategory"
                            :rules="[{ required: true, message: '设备分类不能为空'}]">
                <el-select v-model="form.deviceCategory" placeholder="请选择设备分类" clearable
                           @change="deviceCategoryChange">
                  <el-option v-for="dict in deviceCategoryList" :key="dict.dictKey" :label="dict.dictValue"
                             :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备类型" prop="deviceType"
                            :rules="[{ required: true, message: '设备类型不能为空'}]">
                <el-select v-model="form.deviceType" placeholder="请输入设备类型" clearable
                           :disabled="!form.deviceCategory" @change="deviceTypeChange">
                  <el-option v-for="dict in deviceTypeList" :key="dict.dictKey" :label="dict.dictValue"
                             :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权单位" prop="ownerUnitName" :rules="[{ required: true, message: '产权单位不能为空'}]"
                            size="small">
                <xt-tree-lzay-select :formValue="form.ownerUnitName"
                                     :selectType="'CORP'"
                                     @getTreeItem="(v)=>getOwnerUnit(v,'CORP')">
                </xt-tree-lzay-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权部门" prop="propertyDeptName"
                            :rules="[{ required: true, message: '产权部门不能为空'}]"
                            size="small">

                <xt-tree-lzay-select :formValue="form.propertyDeptName"
                                     :selectType="'DEPT'"
                                     :unit-id="form.ownerUnit"
                                     @getTreeItem="(v)=>getOwnerUnit(v,'DEPT')">
                </xt-tree-lzay-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="WBS元素" prop="wbsElement" clearable
                            :rules="[{ required: true, message: 'WBS元素不能为空', trigger: 'change'}]">
                <wbsSelect type="wbsElement" placeholder="请选择WBS元素" v-model="form.wbsElement"
                           :disabled="!form.deviceType"
                           @change="wbsChange"></wbsSelect>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="WBS项目" prop="wbsProject" clearable
                            :rules="[{ required: true, message: 'WBS项目不能为空', trigger: 'change'}]">
                <el-input v-model="form.wbsProject" placeholder="请输入WBS项目" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="设备增加方式" prop="deviceAddType"
                            :rules="[{ required: true, message: '设备增加方式不能为空'}]"
                            size="small">
                <el-select v-model="form.deviceAddType" placeholder="请选择设备增加方式" clearable>
                  <el-option v-for="dict in deviceAddTypeList" :key="dict.dictKey" :label="dict.dictValue"
                             :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="false">
              <el-form-item label="设备变动方式" prop="deviceChangeType"
                            :rules="[{ required: false, message: '设备变动方式不能为空'}]"
                            size="small">
                <el-select v-model="form.deviceChangeType" placeholder="请选择设备变动方式" clearable>
                  <el-option v-for="dict in deviceChangeTypeList" :key="dict.dictKey" :label="dict.dictValue"
                             :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用保管人" prop="useKeepPerson" size="small">
                <el-input v-model="form.useKeepPerson" placeholder="请输入使用保管人" clearable maxlength="20"
                          :disabled="isEdit"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="功能位置" prop="funLocation"
                            :rules="[{ required: true, message: '功能位置不能为空'}]"
                            size="small">
                <el-select v-model="form.funLocation" placeholder="请选择功能位置" clearable @change="handleFunlocation">
                  <el-option v-for="dict in funLocationList" :key="dict.trlnr" :label="dict.pltxt"
                             :value="dict.trlnr"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="工厂区域" prop="factoryArea"
                            :rules="[{ required: true, message: '工厂区域不能为空'}]"
                            size="small">
                <el-select v-model="form.factoryArea" placeholder="请选择工厂区域" clearable @change="handleFactoryArea">
                  <el-option v-for="dict in factoryAreaList" :key="dict.dictKey" :label="dict.dictValue"
                             :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维护工厂" prop="maintenanceFactory"
                            :rules="[{ required: false, message: '维护工厂不能为空'}]"
                            size="small">
                <el-select v-model="form.maintenanceFactory" placeholder="请输入维护工厂" clearable
                           @change="getmaintenanceFactory">
                  <el-option v-for="dict in maintenanceFactoryList" :key="dict.code" :label="dict.name"
                             :value="dict.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8" v-if="false">
              <el-form-item label="线站标识" prop="lineStation"
                            :rules="[{ required: true, message: '线站标识不能为空'}]"
                            size="small">
                <el-input v-model="form.lineStation" placeholder="请输入线站标识" clearable maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="安装地点" prop="installationSite"
                            :rules="[{ required: true, message: '安装地点不能为空'}]"
                            size="small">
                <el-input v-model="form.installationSite" placeholder="请输入安装地点" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用保管部门" prop="useKeepDept"
                            :rules="[{ required: true, message: '使用保管部门不能为空'}]">
                <el-select v-model="form.useKeepDept" filterable placeholder="请选择使用保管部门" clearable
                           @change="getuseKeepDept">
                  <el-option v-for="dict in erpDeptList" :key="dict.kostl" :label="dict.kostlT"
                             :value="dict.kostl"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实物保管部门" prop="entityKeepDept"
                            :rules="[{ required: true, message: '实物保管部门不能为空'}]">
                <el-select v-model="form.entityKeepDept" filterable placeholder="请选择实物保管部门" clearable
                           @change="getEntityKeepDept">
                  <el-option v-for="dict in erpDeptList" :key="dict.kostl" :label="dict.kostlT"
                             :value="dict.kostl"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="false">
              <el-form-item label="ERP同步状态" prop="erpStatus" size="small">
                <el-select v-model="form.erpStatus" placeholder="请选择ERP同步状态" clearable disabled>
                  <el-option v-for="dict in deviceErpStatusList" :key="dict.dictKey" :label="dict.dictValue"
                             :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="false">
              <el-form-item label="是否同步I6000" prop="isToI6000" size="small">
                <el-radio v-model="form.isToI6000" :label="'1'" disabled>是</el-radio>
                <el-radio v-model="form.isToI6000" :label="'0'" disabled>否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 中间设备列表 -->
        <formTitle :titleText="'设备列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <!--            <el-button type="primary" size="small" @click="handleImport">导入</el-button>-->
            <el-button class="border-btn" size="small" @click="deviceExport" v-if="false">导出</el-button>
            <el-button class="border-btn" size="small" @click="delBatchItem">批量删除</el-button>
          </div>
        </formTitle>
        <el-table
          ref="deviceTable"
          :data="deviceList"
          v-loading="loading"
          size="small"
          height="300px"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="30" fixed="left" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" align="center" width="180"></el-table-column>
          <el-table-column prop="erpAssetCode" label="ERP资产编码" align="center" width="150"></el-table-column>
          <!--<el-table-column prop="erpAccountCode" label="ERP台账编号" align="center" width="150"></el-table-column>-->
          <el-table-column prop="erpStatus" label="ERP同步状态" align="center" width="120">
            <template slot-scope="scope">
              <spam>{{ showDictLable(scope.row.erpStatus, deviceErpStatusList) }}</spam>
            </template>
          </el-table-column>
          <el-table-column prop="deviceName" label="标准全称" align="center"></el-table-column>
          <el-table-column prop="deviceAssetInfo" label="资产信息" align="center">
            <template slot-scope="scope">
              <div style="font-size: 12px;text-align: left;">
                <spam>出厂序列号：{{ scope.row.sn }}</spam>
                <br/>
                <spam>出厂日期：{{ scope.row.factoryDate }}</spam>
                <br/>
                <spam>制造国家及地区：{{ scope.row.maintenanceCountry }}</spam>
                <br/>
                <spam>制造商：{{ scope.row.manufacturer }}</spam>
                <br/>
                <spam>地址：{{ scope.row.address }}</spam>
                <br/>
                <spam>供应商：{{ scope.row.supplierName }}</spam>
                <br/>
                <spam>供应商联系电话：{{ scope.row.supplierTel }}</spam>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="deviceStatus" label="设备状态" align="center" width="120">
            <template slot-scope="scope">
              <spam>{{ showDictLable(scope.row.deviceStatus, deviceStatusList) }}</spam>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="createTime" align="center" width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-link type="danger" size="mini" :underline="false" icon="el-icon-delete" @click="delItem(scope.row)">删
                除
              </el-link>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <pagination :total="page.total" :page.sync="page.current" :limit.sync="page.size" @pagination="loadDeviceDataList"/>

<!--        <el-pagination-->
<!--          :total="page.total"-->
<!--          :page-size="page.size"-->
<!--          :current-page="page.current"-->
<!--          layout="sizes,total,prev,pager,next,jumper,total"-->
<!--          @size-change="sizeChange"-->
<!--          @current-change="currentChange"-->
<!--          @prev-click="currentChange"-->
<!--          @next-click="currentChange"-->
<!--        ></el-pagination>-->
      </el-scrollbar>
      <!-- 底部按钮 -->
      <div class="form-btn" style="margin-bottom: 10px;">
        <el-button type="primary" v-if="showSaveBtn && permissionList.submitBtn" size="small" @click="handleSaveOK(2)"
                   :loading="btnLoading">提交转资
        </el-button>
        <el-button class="border-btn" size="small" v-if="showSaveBtn && permissionList.saveBtn" @click="handleSave(1)"
                   style="margin-left: 50px;" :loading="btnLoading">暂 存
        </el-button>
        <el-button class="border-btn" size="small" @click="handleReset" style="margin-left: 50px;">返 回</el-button>
      </div>
    </div>
    <!-- 上传 -->
    <uploadModel v-if="openUpload" :isShow.sync="openUpload" @setVal='setValDeviceList'></uploadModel>
  </basic-container>
</template>

<script>
  import {getErpmaintainList, getErptranstplnrList, getRDeptrpList} from "@/api/device/devicerecord";
  import {getDetail, save, submit, getDeviceList} from "@/api/device/devicetransfer";
  // eslint-disable-next-line no-unused-vars
  import {getDictList, getCmdbList, getDictCmdbList, getCmdbListAll, getDictCmdbListPid} from "@/api/dict";
  import {mapGetters, mapState} from "vuex";
  import uploadModel from "@/views/device/components/capitalTransfer/uploadModel";
  import wbsSelect from "@/components/wbsSelect/index";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";

  export default {
    components: {uploadModel, wbsSelect, xtTreeLzaySelect},
    data() {
      return {
        erpDeptList: [],
        id: '',
        wbsProject: '',
        wbsElement: '',
        deviceCode: '',
        deviceType: null,
        form: {
          deviceType: '',
          wbsElement: '',
          wbsProject: '',
          lineStation: '',
          maintenanceFactory: undefined,
          maintenanceName: undefined,
          ownerUnitName: undefined,
          propertyDeptName: undefined,
        },
        queryDate: {},
        loading: false,
        isEdit: true,
        deviceAddTypeList: [],
        deviceChangeTypeList: [],
        useKeepDeptList: [],
        deviceStatusList: [],
        deviceErpStatusList: [],
        deviceWBSList: [],
        deviceChangeList: [],
        deviceCategoryList: [],
        deviceTypeList: [],
        selectionList: [],
        brandList: [],
        seriesList: [],
        deviceModelList: [],
        funLocationList: [],
        maintenanceFactoryList: [],
        deviceList: [],
        page: {
          size: 50,
          current: 1,
          total: 0
        },
        openUpload: false,
        btnLoading: false,
        showSaveBtn: true
      };
    },
    computed: {
      ...mapGetters(["permission", "userDetail"]),
      ...mapState({
        userInfo: state => state.user.userInfo
      }),
      permissionList() {
        return {
          submitBtn: this.vaildData(this.permission.capitalTransfer_submit, false),
          saveBtn: this.vaildData(this.permission.capitalTransfer_save, false),
        };
      },
    },
    async mounted() {
      // 设置页面元素高度
      this.setPageContentHeight()
      //加载字典--设备状态
      this.getCmdbDictList("1103423111233536");
      //加载字典--ERP工单状态
      this.getDictList("erpState");
      //加载字典--设备增加方式
      this.getCmdbDictList("1083864635473920");
      //加载字典--设备方式
      this.getDictList("deviceType");
      //加载字典--设备分类
      this.getCmdbDictList("1097745625841664");
      //加载字典--设备变动方式
      this.getCmdbDictList("1083948487999488");
      //加载字典--品牌
      this.getCmdbDictList("1082554947272704");

      //加载字典--功能位置
      this.getErptranstplnrList();
      //加载字典--工厂区域
      this.getCmdbDictList("1083945124167680");
      //加载字典--维护工厂
      this.getErpmaintainList();


      this.getRDeptrpList()

      this.id = null;
      //获取参数 判断是否是新增还是修改
      const params = this.$route.query
      this.wbsProject = params.wbsProject || ''
      this.wbsElement = params.wbsElement || ''
      this.deviceCode = params.deviceCode || ''
      this.deviceId = params.deviceId || ''
      this.id = params.id;
      if (params.id) {
        this.id = params.id;
        this.loadDetail(params.id);
        this.isEdit = true
        //加载 设备列表
        //this.loadDeviceDataList();
      } else if (params.deviceCode) {
        //轉資到期 頁面跳轉
        this.id = params.deviceCode;
        this.form.wbsElement = this.wbsElement;
        this.form.wbsProject = this.wbsProject;
        //加载空数据
        this.beforeOpen();
        this.isEdit = true
        //加载 设备列表
        this.page.deviceCode = this.deviceCode;
        this.loadDeviceDataList();
        this.$refs.dataForm.clearValidate();
      } else {
        //加载空数据
        this.beforeOpen();
        this.isEdit = true
      }
    },
    methods: {
      // handleFunlocation(val) {
      //   this.funLocationList.forEach((item, index) => {
      //     if(item.trlnr == val) this.form.funLocation = item.pltxt
      //   })
      // },

      handleFactoryArea(val) {
        this.factoryAreaList.forEach((item, index) => {
          if(item.dictKey == val) this.form.pltxt1 = item.dictValue
        })
      },
      deviceCategoryChange(code) {
        //设备分类选择
        //console.log(this.$refs.dataForm.fields)
        //this.$refs.dataForm.fields[0].resetField()
        //this.form.deviceType = this.deviceType
        this.form.deviceType = undefined
        this.$set(this.form, 'wbsProject', undefined)
        this.$set(this.form, 'wbsElement', undefined)
        this.deviceList = []
        this.page.total = 0
        this.getDictCmdbListPid('1097745969774592', code) // 设备类型
      },
      deviceTypeChange(item) {
        this.$set(this.form, 'wbsProject', undefined)
        this.$set(this.form, 'wbsElement', undefined)
        this.deviceList = []
        this.page.total = 0
        this.form.deviceType = item;
        this.deviceTypeList.push({})
        this.deviceTypeList.pop()
      },
      getDictCmdbListPid(ciId, pid) {
        getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
          if (ciId === '1097745969774592') { // 设备类型
            this.deviceTypeList = res.data;
            this.deviceTypeList = this.deviceTypeList.filter(item => item.dictKeyErp);
            if (this.deviceTypeList && this.deviceTypeList.length > 0) {
              // this.form.deviceType = this.deviceTypeList[0].dictKey || ''
            }
            //dictKeyErp
          }
        });
      },
      getmaintenanceFactory(code) {
        this.maintenanceFactoryList.forEach(val => {
          if (val.trlnr === code) {
            this.form.maintenanceFactory = val.code
            this.form.maintenanceName = val.name
          }
        })
      },

      getDictList(code) {
        getDictList(code).then(res => {
          // if (code === 'deviceStatus') {
          //   this.deviceStatusList = res.data;
          // }
          if (code === 'wbsElt') {
            this.deviceWBSList = res.data;
          } else if (code === 'erpState') {
            this.deviceErpStatusList = res.data;
          }
          // else if (code === 'deviceAddType') {
          //   this.deviceAddTypeList = res.data;
          // }
          //  else if (code === 'deviceChangeType') {
          //   this.deviceChangeTypeList = res.data;
          // }
          else if (code === 'brand') {
            this.brandList = res.data;
          } else if (code === 'series') {
            this.seriesList = res.data;
          } else if (code === 'deviceModel') {
            this.deviceModelList = res.data;
          } else if (code === 'funLocation') {
            this.funLocationList = res.data;
          } else if (code === 'factoryArea') {
            this.factoryAreaList = res.data;
          } else if (code === 'maintenanceFactory') {
            this.maintenanceFactoryList = res.data;
          }
        });
      },
      getRDeptrpList() {
        // 使用保管部门 实物保管部门
        getRDeptrpList({swerk: this.userDetail.erpUnitCode, current: 1, size: 10000}).then(res => {
          this.erpDeptList = res.data.records
        })
      },
      getErptranstplnrList() {
        //ERP功能位置
        getErptranstplnrList({swerk: this.userDetail.erpUnitCode, current: 1, size: 10000}).then(res => {
          this.funLocationList = res.data.records
        })
      },
      getErpmaintainList() {
        //ERP维护工厂
        getErpmaintainList({code: this.userDetail.erpUnitCode, current: 1, size: 10}).then(res => {
          this.maintenanceFactoryList = res.data.records
        })
      },
      getCmdbDictList(code, pid) {
        //加载cmdb字典
        let query = {}
        query.ciId = code || '1082372687986688'
        if (pid) {
          query.pid = pid
        }
        getDictCmdbList(query).then(res => {
          if (code === '1102238379737088') {
            this.optYearList = res.data;
          } else if (code === '1102247959527424') {
            this.afterSaleStatusList = res.data;
          } else if (code === '1082607703228416') {
            this.deviceWBSList = res.data;
          } else if (code === '1083945124167680') {
            this.factoryAreaList = res.data;
          } else if (code === '1083864635473920') {
            this.deviceAddTypeList = res.data;
          } else if (code === '1083948487999488') {
            this.deviceChangeTypeList = res.data;
          } else if (code === '1103423111233536') {
            this.deviceStatusList = res.data;
          } else if (code == '1097745625841664') {
            //console.log("res.data + "+ res.data);
            for (let i = 0; i < res.data.length; i++) {
              let item = res.data[i]
              if (item.dictKey != '1097756774301696' && item.dictKey != '1097757327949825') {
                this.deviceCategoryList.push(item)
              }
            }
          } else if (code === '1083864635473920') {
            this.deviceAddTypeList = res.data;
          } else if (code === '1083948487999488') {
            this.deviceChangeTypeList = res.data;
          } else if (code === '1082554947272704') {
            this.brandList = res.data;
          } else if (code === '1082609011851264') {
            this.seriesList = res.data;
          } else if (code === '1082608047161344') {
            this.deviceModelList = res.data;
          }
        });
      },
      wbsChange(val, type) {
        // if (!val.deviceType) {
        //   window.console.log("请先选择设备类型");
        // }
        if (type == 'wbsElement') {
          // this.form.wbsProject = val.wbsName
          // this.form.wbsElement = val.wbsCode
          this.$set(this.form, 'wbsProject', val.wbsName)
          this.$set(this.form, 'wbsElement', val.wbsCode)
        } else if (type == 'wbsProject') {
          // this.form.wbsElement = val.wbsCode
          // this.form.wbsProject = val.wbsName
          this.$set(this.form, 'wbsElement', val.wbsCode)
          this.$set(this.form, 'wbsProject', val.wbsName)
        }
        this.$forceUpdate()

        //const option  = this.deviceWBSList.find(item => item.dictKey === val);
        //this.form.wbsProject = option ? option.dictValue : ''
        //加载数据
        this.loading = true;
        this.page = {
          ...this.page,
          area: this.userDetail.regionCode||'37',
          wbsElement: this.form.wbsElement,
          erpTransferStatus: '1130566297911296',
          isSpecial: true
        }

        if (this.form.deviceCode) {
          this.page.deviceCode = this.form.deviceCode
        }
        //加载cmdb的IT设备
        this.page.ownerUnitCode = this.form.ownerUnit
        this.page.deviceCategoryCode = this.form.deviceCategory
        this.page.deviceTypeCode = this.form.deviceType
        getCmdbListAll(this.page).then(res => {
          const data = res.data;
          this.deviceList = data.data || [];
          //手动 补充uuid
          this.deviceList.forEach(ele => {
            ele.deviceUuid = ele.uuid || '0';
            ele.warehouse = ele.warehouse || '0';
            ele.deviceId = ele.deviceId || '0';
            // ele.deviceStatus = '2';
          });
          this.page.total = data.total || 0;
          this.loading = false;
        });
      },
      delItem(row) {
        // 删除
        this.deviceList = this.deviceList.filter(ele => ele.id != row.id)
        this.page.total = this.page.total - 1
      },
      delBatchItem() {
        // 批量删除
        this.selectionList.forEach(key => {
          this.deviceList = this.deviceList.filter(ele => ele.id != key)
        })
        this.page.total = this.page.total - this.selectionList.length
      },
      selectionChange(selection) {
        //点击选择事件
        this.selectionList = selection.map(item => item.id);
      },
      async handleSaveOK(status) {
        this.$refs.dataForm.validate(async valid => {
          if (valid) {
            this.form.status = status;
            this.btnLoading = true
            //提交建档

            this.form.deviceTransferDetailDTOList = this.deviceList || [];
            this.form.deviceTransferDetailDTOList.forEach(item => {
              let entitys = JSON.parse(JSON.stringify(item));
              item.entity = entitys;
            })
            // 提交转资
            let saveRes = await this.$asyncCatchApi(save, this.form)
            if (saveRes[0] != null) {
              this.btnLoading = false
              return
            }
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.handleReset();
          }
        })
      },
      handleSave(status) {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.form.status = status;
            this.form.deviceTransferDetailDTOList = this.deviceList || [];
            this.form.deviceTransferDetailDTOList.forEach(item => {
              let entitys = JSON.parse(JSON.stringify(item));
              item.entity = entitys;
            })
            //暂存
            this.btnLoading = true
            submit(this.form).then((res) => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              // console.log(res);
              this.btnLoading = false
              this.handleReset();
            }, error => {
              this.btnLoading = false
              //
            });
          }
        })
      },
      handleReset() {
        //返回
        this.$closePage('/device/capitalTransfer')
      },
      showDictLable(code, dictList) {
        //console.log(code,dictList,'显示设备状态============');
        if (dictList != null && code != '') {
          let items = dictList.filter(item => item.dictKey === code);
          if (items != null && items.length > 0) {
            return items[0].dictValue;
          }
        }
        return code;
      },
      beforeOpen() {
        this.form.useKeepPerson = this.userInfo.userName || ''
        this.form.erpStatus = '2';
        this.form.status = 1;
        this.form.isToI6000 = "1";
        this.form.lineStation = "00000000000000000"
        // 维护工厂
        this.form.maintenanceFactory = this.userDetail.erpUnitCode;
        this.form.maintenanceName = this.userDetail.erpUnit;

        this.form.wbsProject = this.wbsProject
        this.form.wbsElement = this.wbsElement
        this.form.deviceCode = this.deviceCode
        this.showSaveBtn = true
        // this.form.funLocation = this.$store.state.user.userDeatil.
        // this.form.factoryArea = this.$store.state.user.userDeatil.
        // this.form.maintenanceFactory = this.$store.state.user.userDeatil.
        this.$forceUpdate()
      },
      loadDetail(id) {
        getDetail(id).then(res => {
          this.form = res.data;
          this.$refs.dataForm.$forceUpdate()
          if (this.form.status == 1 || this.form.processStatus == 'hussar_2') this.showSaveBtn = true
          else this.showSaveBtn = false
          //加载设备数据
          this.page.wbsElement = this.form.wbsElement;
          if (this.form.deviceCode) {
            this.page.deviceCode = this.form.deviceCode
          }
          // this.loadDeviceDataList()
          let query = {};
          query.transferId = this.id || '';
          query.filingNo = this.id || '';
          getDeviceList(1, 999, query).then(res => {

            const data = res.data;
            //console.log(res.data,'设备列表打印===============================');
            this.page.total = data.total;
            this.deviceList = data.records;
            this.loading = false;
          });

          this.getDictCmdbListPid('1097745969774592', this.form.deviceCategory) // 设备类型

          this.$forceUpdate()
        });
      },
      // currentChange(currentPage) {
      //   //分页 设备列表 点击第几页
      //   this.page.current = currentPage;
      //   this.loadDeviceDataList();
      // },
      // sizeChange(pageSize) {
      //   //切换设备列表  每页数量
      //   this.page.size = pageSize;
      //   this.loadDeviceDataList();
      // },
      loadDeviceDataList(val) {
        // //加载 设备列表
        // this.loading = true;
        // let query = {};
        // query.transferId = this.id||'';
        // query.filingNo = this.id||'';
        // this.page.ownerUnit = this.form.ownerUnit
        getCmdbListAll(this.page).then(res => {
          const data = res.data;
          this.deviceList = data.data || [];
          //手动 补充uuid
          this.deviceList.forEach(ele => {
            ele.deviceUuid = ele.uuid || '0';
            ele.warehouse = ele.warehouse || '0';
            ele.deviceId = ele.deviceId || '0';
            // ele.deviceStatus = '2';
          });
          this.page.total = data.total || 0;
          this.loading = false;
        });
      },
      deviceExport() {
        //导出
        if (this.deviceList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.deviceList.forEach((item, index) => {
          item.index = index + 1;
          if (item.erpStatus) item.erpStatus = this.showDictLable(item.erpStatus, this.deviceErpStatusList);
          if (item.deviceStatus) item.deviceStatus = this.showDictLable(item.deviceStatus, this.deviceStatusList);
        })
        let param = {}
        param.list = this.deviceList
        this.download(
          "/api/idevelop-device/device/transfer/export",
          param,
          "转资设备清单.xlsx"
        )
      },
      handleImport() {
        this.openUpload = true
      },
      setValDeviceList(list) {
        //判断 是否删除
        this.deviceList = this.deviceList.filter(d => {
          let isR = false;
          list.forEach(it => {
            if (d.deviceCode == it.deviceCode) {
              isR = true;
            }
          })
          return isR;
        })

        this.page.total = this.deviceList.length || 0;
      },
      getOwnerUnit(val, type) {
        if (type === 'CORP') {
          //单位
          this.form.ownerUnit = val.id
          this.form.ownerUnitName = val.fullName

          //单位更改 部门请初始化
          this.form.propertyDept = null;
          this.form.propertyDeptName = null;
        } else if (type === 'DEPT') {
          //部门
          this.form.propertyDept = val.id;
          this.form.propertyDeptName = val.fullName;
        }
        this.$forceUpdate()
      },
      getuseKeepDept(code) {
        this.erpDeptList.forEach(val => {
          if (val.kostl === code) {
            this.form.useKeepDeptName = val.kostlT
            this.form.useKeepDept = val.kostl
          }
        })
      },
      getEntityKeepDept(code) {
        // "kostlT": "国网济南市历城区供电公司-其他虚拟机构",
        //   "swerk": "AAAA",
        //   "kostl": "C0601A0099"
        this.erpDeptList.forEach(val => {
          if (val.kostl === code) {
            this.form.entityKeepDeptName = val.kostlT
            this.form.entityKeepDept = val.kostl
          }
        })
      },
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep .el-input__suffix {
    line-height: 32px
  }
</style>
