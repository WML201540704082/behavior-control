<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <el-scrollbar style="height:calc(100% - 50px)">
        <div style="width: 100%;height: 1px;"></div>
        <template>
          <formTitle :titleText="'处理进度'" :titleType="'page_title'"></formTitle>
          <el-row type="flex">
            <el-col :span="24" style="height: 120px;">
              <step
                :processKey="'bpm_sbbf'"
                :orderId="form.id"
                v-if="form.id"
                :currentSteps="form.processStatus"
                :orderCode="form.filingNo"
                :status="form.status"
              ></step>
            </el-col>
          </el-row>
        </template>
        <formTitle :titleText="'设备报废信息'" :titleType="'page_title'"></formTitle>
        <!-- <el-scrollbar> -->
        <el-form :model="form" ref="dataForm" class="xt_form topHeight" label-width="120px">
          <el-row :span="8">
            <el-col :span="8">
              <el-form-item label="报废编号" prop="filingNo" size="small">
                <el-input v-model="form.filingNo" placeholder="请输入报废编号" clearable maxlength="24" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请单位" prop="operationUnit" size="small">
                <el-input v-model="form.applyUnitName" placeholder="请输入申请单位" clearable maxlength="24"
                          disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请部门" prop="receiveGroup" clearable>
                <el-input v-model="form.applyDeptName" placeholder="请输入申请部门" clearable style="width:100%"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="申请人" prop="applyUserName">
                <el-input v-model="form.applyUserName" placeholder="请输入受理人员" clearable style="width:100%"
                          disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="联系电话" prop="applyPhone">
                <el-input v-model="form.applyPhone" placeholder="请输入联系电话" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="设备数量" prop="deviceNum" size="small">
                <el-input v-model="form.deviceNum" placeholder="请输入设备数量" clearable maxlength="24" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="报废比例" prop="scrapScale" size="small">
                <el-input v-model="form.scrapScale" placeholder="请输入设备数量" clearable maxlength="24" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="资产原值" prop="originalValue" size="small">
                <el-input v-model="form.originalValue" placeholder="请输入资产原值" clearable maxlength="24"
                          disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="已提折旧" prop="operationZheJiu" size="small">
                <el-input v-model="form.operationZheJiu" placeholder="请输入已提折旧" clearable maxlength="24"
                          disabled></el-input>
              </el-form-item>
            </el-col>

          </el-row>


          <el-row>
            <el-col :span="8">
              <el-form-item label="资产净值" prop="netWorth" size="small">
                <el-input v-model="form.netWorth" placeholder="请输入资产净值" clearable maxlength="24" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="设备报废时间" prop="scrapTime">
                <el-date-picker v-model="form.scrapTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择报废时间"
                                clearable disabled></el-date-picker>
              </el-form-item>
            </el-col>
            <!-- <el-row :span="8"> -->

            <el-col :span="8">
              <el-form-item label="残值处置及资产" prop="salvageAssets" size="small">
                <el-input v-model="form.salvageAssets" placeholder="请输入残值处置及资产" clearable disabled></el-input>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item clearable label="报废原因" prop="scrapReason" size="small">
                <el-input v-model="form.scrapReason" placeholder="请输入报废原因" clearable disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="是否可报废" prop="isScrap">
                <el-input v-model="form.isScrap" placeholder="请输入报废原因" clearable disabled></el-input>
              </el-form-item>

            </el-col>

            <el-col :span="8">
              <el-form-item clearable label="使用保管部门" prop="useKeepDept" size="small">
                <el-select v-model="form.useKeepDept" filterable placeholder="请选择使用保管部门" clearable disabled>
                  <el-option v-for="dict in erpDeptList" :key="dict.kostl" :label="dict.kostlT"
                             :value="dict.kostl"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <!-- <el-form-item label="实物保管部门" prop="useKeepDept">
                 <el-input v-model="form.useKeepDept" placeholder="请输入实物保管部门" clearable disabled></el-input> -->

              <el-form-item clearable label="实物保管部门" prop="useKeepDept" size="small">
                <el-select v-model="form.useKeepDept" filterable placeholder="请选择实物保管部门" clearable disabled>
                  <el-option v-for="dict in erpDeptList" :key="dict.kostl" :label="dict.kostlT"
                             :value="dict.kostl"></el-option>
                </el-select>
              </el-form-item>


            </el-col>

            <el-col :span="8">
              <el-form-item label="ERP发起人" prop="sqr">
                <el-select v-model="form.sqr" placeholder="请选择发起人" clearable disabled>
                  <el-option v-for="dict in  submitPersons" :key="dict.bname" :label="dict.nameTextc"
                             :value="dict.bname"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="ERP审批人" prop="sqr">
                <el-select v-model="form.spr" placeholder="请选择审批人" clearable disabled>
                  <el-option v-for="dict in  approvePersons" :key="dict.bname" :label="dict.nameTextc"
                             :value="dict.bname"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 中间设备列表 -->
        <formTitle :titleText="'设备信息列表'" :titleType="'page_title'">
        </formTitle>
        <el-table
          ref="deviceTable"
          :data="deviceList"
          v-loading="loading"
          size="small"
          height="360px"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column label="设备基本信息" width="250" align="center">
            <template slot-scope="scope">
              <div class="description">
                <p>设备编码：{{scope.row.deviceCode ? scope.row.deviceCode: ''}}</p>
                <p style="text-align:left">设备名称：{{scope.row.deviceCode ? scope.row.deviceCode : ''}}</p>
                <p style="text-align:left">资产编码：{{scope.row.assetCodeErp ? scope.row.assetCodeErp:''}}</p>
                <p style="text-align:left">台账编码：{{scope.row.deviceCodeErp ? scope.row.deviceCodeErp : ''}}</p>
                <p>出厂序列号：{{scope.row.sn ? scope.row.sn:''}}</p>
              </div>


            </template>
          </el-table-column>
          <el-table-column prop="address" label="投运信息" width="250" align="center">
            <template slot-scope="scope">
              <div class="description">
                <p>首次投运日期：{{scope.row.oprtDateFirst ? scope.row.oprtDateFirst :''}}</p>
                <p>预定使用年限：{{scope.row.useAge ? scope.row.useAge:''}}</p>

              </div>
              <!-- <span>{{`首次投运日期：${scope.row.oprtDateFirst ? scope.row.oprtDateFirst :''} 预定使用年限${scope.row.useAge ? scope.row.useAge:''} `}}</span> -->
            </template>
          </el-table-column>

          <el-table-column prop="address" label="型号信息" width="250" align="center">
            <template slot-scope="scope">
              <div class="description">

                <p>品牌：{{scope.row.brand ? scope.row.brand:''}}</p>
                <p>型号：{{scope.row.deviceModel ? scope.row.deviceModel :""}}</p>
              </div>

            </template>
          </el-table-column>
          <el-table-column prop="address" label="类型信息" width="250" align="center">
            <template slot-scope="scope">
              <div class="description">

                <p>设备分类：{{scope.row.deviceCategory ? scope.row.deviceCategory :'' }}</p>
                <p>设备类型：{{scope.row.deviceType ? scope.row.deviceType: ''}}</p>
              </div>

            </template>
          </el-table-column>
          <el-table-column prop="address" label="资产信息" width="250" align="center">
            <template slot-scope="scope">
              <div class="description">

                <p>资产原值：{{scope.row.originalValue && scope.row.originalValue > 0 ? scope.row.originalValue: 0}}</p>
                <p>资产净值：{{scope.row.netWorth ? scope.row.netWorth: ''}}</p>
              </div>

            </template>
          </el-table-column>
        </el-table>
        <!-- 审批记录/操作记录 -->
        <el-row type="flex">
          <!-- 底部左侧审批记录 开始 -->
          <el-col :span="12">
            <formTitle :titleText="'审批记录'" :titleType="'page_title'"></formTitle>
            <div style="margin-left: 10px;">
              <step
                :processKey="'bpm_sbbf'"
                :orderId="form.id"
                v-if="form.id"
                :stepType="true"
                :currentSteps="form.processStatus"
                :status="form.status"
                :stepHeight="'400px'"
              ></step>
            </div>
          </el-col>
          <!-- 底部右侧操作 开始 -->
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
      <div class="form-btn">
        <template>
          <el-button class="border-btn" size="small" @click="back" style="margin-left: 50px;">返 回</el-button>
        </template>
      </div>

    </div>
    <!-- 上传 -->
    <!-- <uploadModel v-if="openUpload" :isShow.sync="openUpload" @setVal='setValDeviceList'></uploadModel> -->
    <!-- 选择设备 -->
    <deviceSelect type="change" v-if="deviceSelectSync" :isShow.sync="deviceSelectSync"
                  @setVal="selectDeviceHandler"></deviceSelect>
    <!-- 审批弹窗 -->
    <operateForm
      v-if="showOperate"
      :isShow="showOperate"
      :orderDeatil="form"
      :processKeys="'bpm_sbbf'"
      @close="showOperate = false"
      @submitOperate="submitOperate"
    ></operateForm>
  </basic-container>
</template>

<script>
  import uploadImg from "../devReturned/uploadImg.vue";
  import deviceSelect from "@/components/deviceSelect/index.vue";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
  import {scrapDetail, scrapGetApprove} from "@/api/operation/deviceoperation";
  import {getLogOptList} from "@/api/device/logopt";
  import step from "@/components/step/index"
  import {getDictCmdbList} from "@/api/dict";
  import operateForm from "@/views/personalDesk/components/operateForm"
  import {getRDeptrpList} from "@/api/device/devicerecord";
  import {mapGetters} from "vuex";

  export default {
    components: {deviceSelect, xtTreeLzaySelect, step, operateForm, uploadImg},
    data() {
      return {
        fileList: [],
        showOperate: false,

        deviceStatusList: [],
        optList: [],
        deviceSelectSync: false,
        form: {},
        loading: false,
        deviceList: [],
        erpDeptList: [],
        approvePersons: [],
        submitPersons: [],
      };
    },
    computed: {
      ...mapGetters(['userDetail']),
    },
    mounted() {
      // 设置页面元素高度
      this.setPageContentHeight()
      //加载字典--投运类型
      this.id = null;
      //获取参数 判断是否是新增还是修改
      const params = this.$route.query
      this.id = params.id;

      if (params.id) {
        this.id = params.id;
        this.loadDetail(params.id);
        this.loadLogOptDataList();
        this.getScarpReason();
        this.getDeptList();

      }
    },
    methods: {
      getScarpReason() {
        //加载字典
        getDictCmdbList({ciId: '1131281812619264'}).then(res => {
          this.form.scrapReason = res.data.filter(item => item.dictKey === this.form.scrapReason)[0].dictValue
        });
      },
      getDeptList() {
        getRDeptrpList({swerk: this.userDetail.erpDeptCode, current: 1, size: 1000000}).then(res => {
          this.erpDeptList = res.data.records
        })
      },

      loadLogOptDataList() {
        //加载操作记录
        let query = {};
        query.logId = this.id || '--';
        getLogOptList(1, 20, query).then(res => {
          const data = res.data;
          this.optList = data.records;
        });
      },

      loadDetail(id) {
        scrapDetail(id).then(res => {
          this.form = res.data;
          this.form.isScrap = res.data.isScrap == 0 ? '是' : '否'
          this.deviceList = res.data.scrapListVOS.sort((a, b) => {
            return parseInt(a.sort) - parseInt(b.sort);
          });

          this.getApprovePersons();

        });
      },

      getApprovePersons() {
        if (!this.form.useKeepDept) {
          this.$message.warning('请先选择实物保管部门')
          return;
        }
        scrapGetApprove(this.form.useKeepDept, 1).then(res => {
          if (res.code == 200) {
            this.approvePersons = res.data;
          }
        });
        scrapGetApprove(this.form.useKeepDept, 0).then(res => {
          if (res.code == 200) {
            this.submitPersons = res.data;
          }
        });
      },

      //返回
      back() {
        this.$closePage('/operation/devScrapped')
      },
    }
  };
</script>
<style lang="scss" scoped>
  .devRenCon {
    width: 100%;
    height: 100%;
  }

  .formLabel {
    line-height: 16px;
    display: block;
  }

  .description {
    p {
      text-align: left !important;
    }
  }
</style>
