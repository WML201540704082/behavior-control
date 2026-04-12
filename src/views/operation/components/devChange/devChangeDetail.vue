<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <el-scrollbar style="height:calc(100% - 60px)">
        <template v-if="ticketForm.changeType != '3'">
          <formTitle :titleText="'处理进度'" :titleType="'page_title'"></formTitle>
          <el-row type="flex">
            <el-col :span="24" style="height: 120px;">
              <step
                :processKey="'bpm_sbbg'"
                :orderId="ticketForm.id"
                v-if="ticketForm.id"
                :currentSteps="ticketForm.processStatus"
                :status="ticketForm.ticketStatus"
                :orderCode = ticketForm.filingNo
              ></step>
            </el-col>
          </el-row>
        </template>
        <div class="xt_card" style="margin-bottom: 20px">
          <formTitle class="mart0" :titleText="'基本信息'" :titleType="'page_title'" :needBorder="true"></formTitle>
          <el-form :model="ticketForm" ref="ticketForm" class="xt_form" label-width="100px">
            <el-row :span="6">
              <el-col :span="6">
                <el-form-item label="变更单号" prop="filingNo" size="small">
                  <el-input v-model="ticketForm.filingNo" placeholder="请输入变更单号" clearable maxlength="24"
                            disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="变更类型" prop="operationType">
                  <el-select v-model="ticketForm.changeType" placeholder="请选择变更类型" clearable disabled>
                    <el-option
                      v-for="dict in changeTypeList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请单位" prop="applyUnit">
                  <el-select v-model="ticketForm.applyUnitName" disabled>
                    <el-option
                      v-for="dict in unitList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请部门" prop="applyDept">
                  <el-select v-model="ticketForm.applyDeptName" disabled>
                    <el-option
                      v-for="dict in deptList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="6">
              <el-col :span="6">
                <el-form-item label="受理人" prop="applyUser">
                  <el-input v-model="ticketForm.applyUserName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="受理时间" prop="receiverTime">
                  <el-date-picker v-model="ticketForm.receiverTime" value-format="yyyy-MM-dd" type="date"
                                  placeholder="请输入出厂日期" clearable disabled></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!--设备列表 -->
        <dic v-if="ticketForm.changeType != '3'">
          <formTitle :titleText="'设备列表'" :titleType="'page_title'" :needBorder="true"></formTitle>
          <el-table
            ref="deviceTable"
            :data="deviceList"
            v-loading="loading"
            size="small"
            height="500"
            style="width: 99%;"
            v-show="changeType=='1' || changeType=='4'"
            @selection-change="selectionChange"
          >

            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="deviceCode" label="设备基本信息" align="left" >
              <template  slot-scope="scope">
                <p class="list-device">设备编码：{{ scope.row.deviceCode }}</p>
                <p class="list-device">标准全称：{{ scope.row.fullName }}</p>
                <p class="list-device">出厂序列号：{{ scope.row.sn }}</p>
                <p class="list-device">制造商：{{ scope.row.maker }}</p>
                <p class="list-device">品牌：{{ scope.row.brand }}</p>
                <p class="list-device">系列：{{ scope.row.series }}</p>
                <p class="list-device">型号：{{ scope.row.deviceModel }}</p>
                <p class="list-device">出厂日期：{{ scope.row.factoryDate }}</p>
                <p class="list-device">投运日期：{{ scope.row.oprtDate }}</p>
                <template v-if="changeType=='4'">
                  <p class="list-device">内存大小：{{ scope.row.memSize }}</p>
                  <p class="list-device">磁盘容量大小：{{ scope.row.hardDiskPartionSize }}</p>
                  <p class="list-device">CPU品牌：{{ scope.row.cpuBrand }}</p>
                  <p class="list-device">CPU型号：{{ scope.row.cpuModel }}</p>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="receiveDept" label="领用信息" align="left">
              <template  slot-scope="scope">
                <p class="list-device">领用单位：{{ scope.row.receiveUnit }}</p>
                <p class="list-device">领用部门：{{ scope.row.receiveDept }}</p>
                <p class="list-device">责任人：{{ scope.row.receivingPerson }}</p>
                <p class="list-device">责任人班组：{{ scope.row.receivingGroup }}</p>
                <p class="list-device">责任人身份证：{{ scope.row.receivingIDCard }}</p>
                <p class="list-device">责任人联系方式：{{ scope.row.receivingTel }}</p>
                <p class="list-device">责任人统一权限账号：{{ scope.row.receivePersonUnifiedAcc }}</p>
                <p class="list-device">使用人：{{ scope.row.user }}</p>
                <p class="list-device">使用人身份证：{{ scope.row.deviceUserIDCard }}</p>
                <p class="list-device">使用人联系方式：{{ scope.row.userTel }}</p>
                <p class="list-device">安装地点：{{ scope.row.installationSite }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="维护信息" align="left">
              <template  slot-scope="scope">
                <p class="list-device">运维单位：{{ scope.row.operationUnit }}</p>
                <p class="list-device">运维部门：{{ scope.row.operationDept }}</p>
                <p class="list-device">运维责任人：{{ scope.row.operationPerson }}</p>
                <p class="list-device">运维联系电话：{{ scope.row.operationTel }}</p>
                <p class="list-device">运维等级：{{ showDictLable(scope.row.operationLevel,levelList) }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="userCard" label="资产信息" align="left" >
              <template  slot-scope="scope">
                <p class="list-device">ERP资产编码：{{ scope.row.assetCodeErp }}</p>
                <p class="list-device">ERP设备台账编码：{{ scope.row.deviceCodeErp }}</p>
                <p class="list-device">使用保管部门：{{ scope.row.useKeepDeptName }}</p>
                <p class="list-device">实物保管部门：{{ scope.row.realManageDeptName }}</p>
                <p class="list-device">电压等级：{{ scope.row.voltageLevel }}</p>
                <p class="list-device">设备增加方式：{{ scope.row.deviceAddType }}</p>
                <p class="list-device">设备变动方式：{{ scope.row.deviceChangeType }}</p>
                <p class="list-device">功能位置：{{ scope.row.funLocation }}</p>
                <p class="list-device">功能位置编码：{{ scope.row.funLocation }}</p>
                <p class="list-device">工厂区域：{{ scope.row.factoryArea }}</p>
                <p class="list-device">维护工厂：{{ scope.row.maintenanceFactory }}</p>
              </template>
            </el-table-column>







            <!-- <el-table-column prop="userName" label="设备基本信息" align="left" width="380">
              <template slot-scope="scope">
                <p class="list-device">设备编码：{{ scope.row.deviceCode }}</p>
                <p class="list-device">设备名称：{{ scope.row.deviceName }}</p>
                <p class="list-device">ERP资产编码：{{ scope.row.deviceCodeErp }}</p>
                <p class="list-device">出厂序列号：{{ scope.row.sn }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="userPhone" label="领用信息" align="left" width="380">
              <template slot-scope="scope">
                <p class="list-device">领用单位：{{ scope.row.receiveUnit }}</p>
                <p class="list-device">领用部门：{{ scope.row.receiveDept }}</p>
                <p class="list-device">责任人班组：{{ scope.row.receivingGroup }}</p>
                <p class="list-device">责任人：{{ scope.row.receivingPerson }}</p>
                <p class="list-device">责任人联系方式：{{ scope.row.receivingTel }}</p>
                <p class="list-device">责任人身份证：{{ scope.row.receivingIDCard }}</p>
                <p class="list-device">责任人统一权限账号：{{ scope.row.receivePersonUnifiedAcc }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="userCard" label="使用信息" align="left" width="360">
              <template slot-scope="scope">
                <p class="list-device">使用人：{{ scope.row.user }}</p>
                <p class="list-device">使用人联系方式：{{ scope.row.userTel }}</p>
                <p class="list-device">使用人身份证：{{ scope.row.deviceUserIDCard }}</p>
                <p class="list-device">安装地点：{{ scope.row.installationSite }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="维护信息" align="left" width="360">
              <template slot-scope="scope">
                <p class="list-device">运维单位：{{ scope.row.operationUnit }}</p>
                <p class="list-device">运维部门：{{ scope.row.operationDept }}</p>
                <p class="list-device">运维责任人：{{ scope.row.operationPerson }}</p>
                <p class="list-device">运维等级：{{showDictLable(scope.row.operationLevel,operationLevelList)}}</p>
                <p class="list-device">运维联系电话：{{ scope.row.operationTel }}</p>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template  slot-scope="scope">
                <el-button type="text" size="small" @click="handleChange(scope.row)">比对</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            ref="deviceTable2"
            :data="deviceList"
            v-loading="loading"
            size="small"
            height="500px"
            v-show="changeType=='2'"
          >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="deviceCode" label="设备编码" align="center" width="200"></el-table-column>
            <el-table-column prop="deviceName" label="设备名称" align="center" width="200"></el-table-column>
            <el-table-column prop="deviceCodeErp" label="ERP资产编码" align="center" width="200"></el-table-column>
            <el-table-column prop="subnetName" label="所属子网" align="center" width="200"></el-table-column>
            <el-table-column prop="IP" label="IP地址" align="center" width="200"></el-table-column>
            <el-table-column prop="MAC" label="MAC地址" align="center" width="200"></el-table-column>
            <el-table-column prop="sn" label="出厂序列号" align="center" width="200"></el-table-column>
            <el-table-column prop="networkAccessMethod" label="入网方式" align="center" ></el-table-column>
            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template  slot-scope="scope">
                <el-button type="text" size="small" @click="handleChange(scope.row)">比对</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :total="page.total"
            :page-size="page.size"
            :current-page="page.current"
            layout="sizes,total,prev,pager,next,jumper,total"
            @size-change="sizeChange"
            @current-change="currentChange"
            @prev-click="currentChange"
            @next-click="currentChange"
          ></el-pagination>
        </dic>

        <!--变更信息 -->
        <template v-if="ticketForm.changeType == '3'">
          <formTitle class="mart0" :titleText="'变更信息'" :titleType="'page_title'" :needBorder="true">
            <div slot="rightBtnBox">
                <div class="title_right">
                  <div class="title_right_l">
                    变更数据来源：<span>天擎</span>
                  </div>
                  <div class="title_right_r">
                    橙色为变更字段
                  </div>
                </div>
            </div>
          </formTitle>
          <el-table v-loading="loading" :data="itemsTz2" border size="small" class="e_tabel">
            <el-table-column label="相关字段" prop="name1" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="台账记录信息" prop="name2" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span v-if="scope.$index === 0" style="color:#265BE2">{{ scope.row.name2 }}</span>
                <span v-else>{{ scope.row.name2 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="变更后信息" prop="name3" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span v-if="scope.$index === 0" style="color:#265BE2">{{ scope.row.name3 }}</span>
                <span v-else :style="{color:getIsSign(scope.row.name2,scope.row.name3)?'#FFB445':''}">{{ scope.row.name3 }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <el-row type="flex" v-if="ticketForm.changeType != '3'">
          <!-- 底部左侧审批记录 开始-->
          <el-col :span="12">
            <formTitle :titleText="'审批记录'" :titleType="'page_title'"></formTitle>
            <div style="margin-left: 10px;">
              <step
                :processKey="'bpm_sbbg'"
                :orderId="ticketForm.id"
                v-if="ticketForm.id"
                :stepType="true"
                :currentSteps="ticketForm.processStatus"
                :status="ticketForm.ticketStatus"
                :stepHeight="'400px'"
              ></step>
            </div>
          </el-col>
          <!-- 底部右侧操作 开始-->
          <el-col :span="12">
            <formTitle :titleText="'操作记录'" :titleType="'page_title'"></formTitle>
            <el-table
              ref="optTable"
              :data="optList"
              v-loading="loading"
              border
            >
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="optRole" label="角色" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="optName" label="操作人" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="160" align="center"
                               show-overflow-tooltip></el-table-column>
              <el-table-column prop="title" label="操作内容" width="350" align="center"
                               show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-scrollbar>
      <!-- 底部按钮 -->
      <div class="form-btn">
        <el-button v-if="showAudit" type="primary" size="small" @click="handleAudited">审 批</el-button>
        <el-button class="border-btn" size="small" @click="handleReset">返 回</el-button>
      </div>
    </div>

    <!-- 对比弹窗 -->
    <changeLogDialog
      :type="ticketForm.changeType"
      v-if="deviceChangeLogSync"
      :isShow.sync="deviceChangeLogSync"
      :bindId ="ticketForm.id"
      :deviceCode ="deviceCode"
      :deviceForm="deviceForm">
    </changeLogDialog>

    <!-- 审批弹窗 -->
    <operateForm
      v-if="showOperate"
      :isShow="showOperate"
      :orderDeatil="ticketForm"
      :processKeys="'bpm_sbbg'"
      @close="showOperate = false"
      @submitOperate="submitOperate"
    ></operateForm>
  </basic-container>
</template>

<script>
  import {deviceChangeDetail, getDeviceList, warningChangeDetail} from "@/api/operation/devChange/devChange";
  import {getDictList,getDictCmdbList} from "@/api/dict";
  import deviceSelect from "@/components/deviceSelect/index.vue";
  import {getApproveList} from "@/api/device/approverecord";
  import {getLogOptList} from "@/api/device/logopt";
  import step from "@/components/step/index"
  import operateForm from "@/views/personalDesk/components/operateForm"
  import changeLogDialog from "@/views/operation/components/devChange/devChangeLogsDialog.vue";

  export default {
    components: {deviceSelect, step, operateForm, changeLogDialog},
    data() {
      return {
        id: '',
        ticketForm: {},
        searchForm: {
          current: 1,
          size: 20,
        },
        // 字典
        changeTypeList: [],
        unitList: [],
        deptList: [],
        submitDates: null,
        statusList: [],
        ticketCreatTypeList: [],
        ticketStatusList: [],
        selectionList: [],
        operationLevelList:[],
        // 表格
        deviceList2: [],
        dataList: [],
        deviceList: [],
        tableHeight: undefined,
        loading: false,
        total: 0,
        deviceSelectSync: false,
        page: {
          size: 10,
          current: 1,
          total: 0
        },
        changeType: '',
        approveList: [],
        approveListStart: [],
        approveListApprove: [],
        approveListERP1: [],
        approveListERP2: [],
        approveListEnd: [],
        optList: [],
        showAudit: this.$route.query.isAudit,
        // 弹窗
        showOperate: false,
        deviceCode: '',
        deviceChangeLogSync: false,
        deviceForm: {},


        itemsTz2: []
      }
    },
    mounted() {
      // 设置页面元素高度
      this.setPageContentHeight()
      if (this.$route.query.changeType === "1") {
        this.changeType = "1"
      } else {
        this.changeType = "2"
      }





      //加载字典--申请单位
      this.getDictList("maintenanceFactory");
      //加载字典--变更类型
      this.getDictList("device_change_type");
      //加载字典--申请部门
      this.getDictList("maintenanceFactory");
      //加载字典--运维等级
      this.getCmdbDictList("1107954469502976");
      //加载工单详情
      this.loadDetail()
      //加载审批记录
      this.loadApproveDataList();
      //加载操作记录
      this.loadLogOptDataList();
      this.$refs.deviceTable.doLayout();
      this.$refs.deviceTable2.doLayout();
    },
    methods: {
      isEmpty(value) {
        if (value === '' || value == null) {
          return true;
        }
        return false;
      },
      getIsSign(value1, value2) {
        if (!this.isEmpty(value1) && !this.isEmpty(value2)) {
          if (value1 !== value2) {
            return true;
          }
        }
        return false;
      },

      // 设置表格高度
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 50 - 47 + 'px'
      },
      getDictList(code) {
        //加载字典
        getDictList(code).then(res => {
          if (code === 'maintenanceFactory') {
            this.unitList = res.data;
            this.deptList = res.data;
          } else if (code === 'device_change_type') {
            this.changeTypeList = res.data;
          } else if (code === 'maintenanceFactory') {
            this.deptList = res.data;
          }
        });
      },
      getCmdbDictList(code){
        //加载cmdb字典
        let query = {}
        query.ciId = code||'1082372687986688'
        getDictCmdbList( query ).then(res => {
          if(code==='1107954469502976'){
            this.operationLevelList = res.data;
            // console.log(999,res.data)
          }
        });
      },
      showDictLable(code,dictList){
        //字典回显
        if(dictList!=null && code!=''){
          let items = dictList.filter(item => item.dictKey==code);
          if(items!=null && items.length>0){
            return items[0].dictValue;
          }
        }
        return code;
      },
      selectionChange(selection) {
        //点击选择事件
        this.selectionList = selection.map(item => item.id);
      },
      getList() {
        this.loading = true
        let id = this.$route.query.id
        this.page.changeId = id
        getDeviceList(this.page).then(res => {
          this.deviceList = res.data.records
          this.page.total = res.data.total
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      warningChangeDetail() {
        this.loading = true

        warningChangeDetail({ orderNo: this.$route.query.filingNo }).then(res => {
          let datas = res.data
          let arrr = [
            {
              name1: '设备编码',
              name2: datas.deviceCode,
              name3: datas.deviceCode
            },
            {
              name1: 'IP',
              name2: datas.deviceIp,
              name3: datas.gatherIp,
            },
            {
              name1: 'MAC',
              name2: datas.deviceMac,
              name3: datas.gatherMac,
            },
            {
              name1: '出厂序列号',
              name2: datas.deviceFactoryNumber,
              name3: datas.gatherFactoryNumber,
            },
            {
              name1: '出厂日期',
              name2: datas.deviceFactoryDate,
              name3: datas.gatherFactoryDate,
            },
            {
              name1: '磁盘容量(GB)',
              name2: datas.deviceHardDiskSize,
              name3: datas.gatherHardDiskSize,
            },
            {
              name1: '内存大小(GB)',
              name2: datas.deviceMemorySize,
              name3: datas.gatherMemorySize,
            },
            {
              name1: '操作系统版本号',
              name2: datas.deviceSystemVersion,
              name3: datas.gatherSystemVersion,
            },
            {
              name1: '操作系统类型',
              name2: datas.deviceSystemType,
              name3: datas.gatherSystemType,
            },
          ]



          this.itemsTz2 = arrr


          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      handleReset() {
        //返回
        if(this.showAudit) {
          this.$closePage('/personalDesk/desk');
        }else {
          this.$closePage('/operation/devChange');
        }
      },
      loadDetail() {
        let id = this.$route.query.id
        deviceChangeDetail(id).then(res => {
          this.ticketForm = res.data;


          if( this.ticketForm.changeType != '3' ){
            //加载设备列表
            this.getList()
          }else{
            this.warningChangeDetail()
          }
        });
      },
      currentChange(current) {
        //分页 设备列表 点击第几页
        this.page.current = current;
        this.getList();
      },
      sizeChange(size) {
        //切换设备列表  每页数量
        this.page.size = size;
        this.getList();
      },
      loadApproveDataList() {
        //加载审批记录
        this.loading = true;
        let query = {};
        query.filingNo = this.id || '--';
        let _this = this
        getApproveList(1, 30, query).then(res => {
          const data = res.data;
          _this.approveList = data.records;
          if (_this.approveList) {
            _this.approveListStart = _this.approveList.filter(item => item.nodeName === '转资申请')
            _this.approveListApprove = _this.approveList.filter(item => item.nodeName === '专工审批')
            _this.approveListEnd = _this.approveList.filter(item => item.nodeName === '自动归档')
            //标记激活节点
            if (_this.approveListStart && _this.approveListStart.length > 0) {
              _this.stepActive = 1
            }
            if (_this.approveListApprove && _this.approveListApprove.length > 0) {
              _this.stepActive = 2
            }
            if (_this.approveListEnd && _this.approveListEnd.length > 0) {
              _this.stepActive = 3
            }
          }
        });
      },
      loadLogOptDataList() {
        //加载操作记录
        let query = {};
        query.logId = this.$route.query.id || '--';
        getLogOptList(1, 20, query).then(res => {
          const data = res.data;
          this.optList = data.records;
        });
      },
      handleAudited() {
        this.showOperate = true
      },
      submitOperate() {
        this.showOperate = false
        this.$closePage('/personalDesk/desk');
      },
      handleChange(row) {
        this.deviceCode = row.deviceCode
        this.deviceForm = row
        this.deviceChangeLogSync = true;
      },
    }
  }
</script>
<style lang="scss" scoped>
  .title_right{
    width: 100%;
    display: flex;
    justify-content: right;
    font-size: 14px;
    .title_right_l{
      color: #333;
      span{
        color: #265BE2;
      }
    }
    .title_right_r{
      color: #FFB445;
      margin-left: 30px;
    }
  }

  .mart0{
    margin-top: 0 !important;
  }

  .formLabel {
    line-height: 16px;
    display: block;
  }

  .list-device {
    margin: 0;
    line-height: 20px;
  }
</style>
