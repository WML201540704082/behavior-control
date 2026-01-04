<template>
  <!-- <basic-container>
    <div class="page_form"></div>
    <div class="page_body"> -->
      <el-scrollbar style="height: 50vh;">
        
        <div class="xt_card" style="margin-bottom: 20px">
          <formTitle :titleText="'基本信息'" :titleType="'page_title'" :needBorder="true"></formTitle>
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
        <formTitle :titleText="'设备列表'" :titleType="'page_title'" :needBorder="true"></formTitle>
        <el-table
          ref="deviceTable"
          :data="deviceList"
          v-loading="loading"
          size="small"
          height="500"
          v-show="changeType=='1'"
          @selection-change="selectionChange"
        >

          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="userName" label="设备基本信息" align="left" width="380">
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
          </el-table-column>
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
      </el-scrollbar>
      <!-- 底部按钮 -->
      <!-- <div class="form-btn">
        <el-button v-if="showAudit" type="primary" size="small" @click="handleAudited">审 批</el-button>
        <el-button class="border-btn" size="small" @click="handleReset">返 回</el-button>
      </div> -->
    <!-- </div> -->

    
  <!-- </basic-container> -->
</template>

<script>
  import {deviceChangeDetail, getDeviceList,} from "@/api/operation/devChange/devChange";
  import {getDictList,getDictCmdbList} from "@/api/dict";
  import deviceSelect from "@/components/deviceSelect/index.vue";
  import {getApproveList} from "@/api/device/approverecord";
  import {getLogOptList} from "@/api/device/logopt";
  import step from "@/components/step/index"
  import operateForm from "@/views/personalDesk/components/operateForm"
  import changeLogDialog from "@/views/operation/components/devChange/devChangeLogsDialog.vue";

  export default {
    components: {deviceSelect, step, operateForm, changeLogDialog},
    props: ['orderDeatil'],
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
        deviceForm: {}
      }
    },
    mounted() {
      // 设置页面元素高度
      // this.setPageContentHeight()
      if (this.orderDeatil.changeType === "1") {
        this.changeType = "1"
      } else {
        this.changeType = "2"
      }
      //加载设备列表
      this.getList()
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
        let id = this.orderDeatil.id
        this.page.changeId = id
        getDeviceList(this.page).then(res => {
          this.deviceList = res.data.records
          this.page.total = res.data.total
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
        let id = this.orderDeatil.id
        deviceChangeDetail(id).then(res => {
          this.ticketForm = res.data;
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
  .formLabel {
    line-height: 16px;
    display: block;
  }

  .list-device {
    margin: 0;
    line-height: 20px;
  }
</style>
