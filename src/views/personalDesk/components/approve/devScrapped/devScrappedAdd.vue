<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <formTitle :titleText="'设备报废信息'" :titleType="'page_title'"></formTitle>
      <el-scrollbar style="height:calc(100% - 80px - 48px)">
        <el-form :model="form" ref="dataForm" class="xt_form topHeight" label-width="120px">
          <el-row :span="8">
            <el-col :span="8">
              <el-form-item label="报废编号" prop="filingNo" size="small">
                <el-input v-model="form.filingNo" placeholder="发起流程后自动获取编号" clearable maxlength="24"
                          disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请单位" prop="operationUnit" size="small">
                <el-input v-model="form.applyUnitName" placeholder="请输入申请单位" clearable maxlength="24"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请部门" prop="receiveGroup" clearable>
                <el-input v-model="form.applyDeptName" placeholder="请输入申请部门" clearable style="width:100%"></el-input>
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
                <el-input v-model="form.applyPhone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="设备数量" prop="deviceNum" size="small">
                <el-input v-model="form.deviceNum" placeholder="根据选择设备自动计算" clearable maxlength="24"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="报废比例" prop="scrapScale" size="small">
                <el-input v-model="form.scrapScale" placeholder="根据选择设备自动计算" clearable maxlength="24"
                          disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="资产原值" prop="originalValue" size="small">
                <el-input v-model="form.originalValue" placeholder="根据选择设备自动计算" clearable maxlength="24"
                          disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="已提折旧" prop="operationZheJiu" size="small">
                <el-input v-model="form.operationZheJiu" placeholder="根据选择设备自动计算" clearable maxlength="24"
                          disabled></el-input>
              </el-form-item>
            </el-col>

          </el-row>


          <el-row>
            <el-col :span="8">
              <el-form-item label="资产净值" prop="netWorth" size="small">
                <el-input v-model="form.netWorth" placeholder="根据选择设备自动计算" clearable maxlength="24" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="设备报废时间" prop="scrapTime">
                <el-date-picker v-model="form.scrapTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择报废时间"
                                clearable :disabled="isEdit"></el-date-picker>
              </el-form-item>
            </el-col>
            <!-- <el-row :span="8"> -->

            <el-col :span="8">
              <el-form-item label="残值处置及资产" prop="salvageAssets" size="small">
                <el-input v-model="form.salvageAssets" placeholder="请输入残值处置及资产" clearable></el-input>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="8">
              <!-- <el-form-item clearable  label="报废原因" prop="scrapReason" size="small" :rules="[{ required: true, message: '报废原因不能为空', trigger: 'change'}]">
                <el-input v-model="form.scrapReason" placeholder="请输入报废原因" clearable></el-input>
              </el-form-item> -->
              <el-form-item label="报废原因" prop='scrapReasonW'
                            :rules="[{ required: true, message: '报废原因不能为空', trigger: 'change'}]">
                <el-select v-model="form.scrapReasonW" placeholder="请选择报废原因" clearable @change="baofeiReaonSelect">
                  <el-option v-for="dict in baofeiReasonList" :key="dict.dictKey" :label="dict.dictValue"
                             :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="是否可报废" prop="isScrap">
                <el-select v-model="isScrap" placeholder="请选择是否可报废" clearable @change="canBaofeiSelect">
                  <el-option v-for="dict in canBaofeiList" :key="dict.dictKey" :label="dict.dictValue"
                             :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="使用保管部门" prop="useKeepDept" :rules="[{ required: true, message: '使用保管部门不能为空'}]">
                <el-select v-model="form.useKeepDept" filterable placeholder="请选择使用保管部门" clearable
                           @change="getuseKeepDept">
                  <el-option v-for="dict in erpDeptList" :key="dict.kostl" :label="dict.kostlT"
                             :value="dict.kostl"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实物保管部门" prop="entityKeepDept" :rules="[{ required: true, message: '实物保管部门不能为空'}]">
                <el-select v-model="form.entityKeepDept" filterable placeholder="请选择实物保管部门" clearable
                           @change="getEntityKeepDept">
                  <el-option v-for="dict in erpDeptList" :key="dict.kostl" :label="dict.kostlT"
                             :value="dict.kostl"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="ERP发起人" prop="sqr">
                <el-select v-model="form.sqr" placeholder="请选择发起人" clearable @change="submitPersonChange">
                  <el-option v-for="dict in  submitPersons" :key="dict.bname" :label="dict.department"
                             :value="dict.bname"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="ERP审批人" prop="sqr">
                <el-select v-model="form.spr" placeholder="请选择审批人" clearable @change="approvePersonChange">
                  <el-option v-for="dict in  approvePersons" :key="dict.bname" :label="dict.department"
                             :value="dict.bname"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 中间设备列表 -->
        <formTitle :titleText="'设备信息列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" @click="selectDevice">添加设备</el-button>
            <el-button type="danger" size="small" @click="delDevice">删除</el-button>
          </div>
        </formTitle>
        <el-table
          ref="deviceTable"
          :data="deviceList"
          v-loading="loading"
          size="small"
          height="380px"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="30" fixed="left"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <af-table-column label="设备基本信息" align="center">
            <template slot-scope="scope">
              <div class="description">
                <p>设备编码：{{scope.row.deviceCode ? scope.row.deviceCode: ''}}</p>
                <p style="text-align:left">设备名称：{{scope.row.deviceCode ? scope.row.deviceCode : ''}}</p>
                <p style="text-align:left">资产编码：{{scope.row.assetCodeErp ? scope.row.assetCodeErp:''}}</p>
                <p style="text-align:left">台账编码：{{scope.row.deviceCodeErp ? scope.row.deviceCodeErp : ''}}</p>
                <p>出厂序列号：{{scope.row.sn ? scope.row.sn:''}}</p>
              </div>
            </template>
          </af-table-column>
          <af-table-column prop="address" label="投运信息" align="center">
            <template slot-scope="scope">
              <div class="description">
                <p>首次投运日期：{{scope.row.oprtDateFirst ? scope.row.oprtDateFirst :''}}</p>
                <p>预定使用年限：{{scope.row.useAge ? scope.row.useAge:''}}</p>

              </div>
              <!-- <span>{{`首次投运日期：${scope.row.oprtDateFirst ? scope.row.oprtDateFirst :''} 预定使用年限${scope.row.useAge ? scope.row.useAge:''} `}}</span> -->
            </template>
          </af-table-column>

          <af-table-column prop="address" label="型号信息" align="center">
            <template slot-scope="scope">
              <div class="description">

                <p>品牌：{{scope.row.brand ? scope.row.brand:''}}</p>
                <p>型号：{{scope.row.deviceModel ? scope.row.deviceModel :""}}</p>
              </div>

            </template>
          </af-table-column>
          <af-table-column prop="address" label="类型信息" align="center">
            <template slot-scope="scope">
              <div class="description">

                <p>设备分类：{{scope.row.deviceCategory ? scope.row.deviceCategory :'' }}</p>
                <p>设备类型：{{scope.row.deviceType ? scope.row.deviceType: ''}}</p>
              </div>

            </template>
          </af-table-column>
          <af-table-column prop="address" label="资产信息" align="center">
            <template slot-scope="scope">
              <div class="description">
                <p>资产原值：{{scope.row.originalValue && scope.row.originalValue > 0 ? scope.row.originalValue: 0}}</p>
                <p>资产净值：{{scope.row.netWorth ? scope.row.netWorth: ''}}</p>
              </div>

            </template>
          </af-table-column>
          <af-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text"
                         size="small"
                         icon="el-icon-delete"
                         @click="handleDelete(scope.row.index)">删除
              </el-button>
            </template>
          </af-table-column>
        </el-table>
        <!-- 附件 -->
        <!-- <div style="margin-top: 15px">
          <div class="title_con">
            <div class="title_line">附件</div>
          </div>
          <uploadImg
            ref="uploadImg"
            :serialNumber="form.serialNumber"
            :attachId="form.attachId"
            @setFileName="getAttachId"
          ></uploadImg>
        </div> -->
      </el-scrollbar>
      <!-- 底部按钮 -->
      <div class="form-btn">
        <el-button type="primary" v-if="isEdit == false" size="small" @click="handleSaveOK">暂存</el-button>
        <el-button class="border-btn" size="small" @click="toProcess" style="margin-left: 50px;">发起流程</el-button>
        <el-button class="border-btn" size="small" @click="handleReset" style="margin-left: 50px;">取消</el-button>
      </div>
    </div>
    <!-- 上传 -->
    <!-- <uploadModel v-if="openUpload" :isShow.sync="openUpload" @setVal='setValDeviceList'></uploadModel> -->
    <!-- 选择设备 -->
    <deviceSelect type="operation" v-if="deviceSelectSync" :isShow.sync="deviceSelectSync"
                  :useKeepDept='this.form.useKeepDept' @setVal="selectDeviceHandler"></deviceSelect>
  </basic-container>
</template>

<script>
  import {mapGetters} from "vuex";
  import uploadModel from "@/views/device/components/capitalTransfer/uploadModel.vue";
  import {getRDeptrpList} from "@/api/device/devicerecord";
  import uploadImg from "@/views/device/components/devInBound/uploadImg.vue";
  import deviceSelect from "@/components/discardDeviceSelect/index.vue";
  import {getUserDetail} from "@/api/user";
  import {scrapSave, scrapApprove, scrapDetail, scrapGetApprove} from "@/api/operation/deviceoperation";
  import {dateFormat} from "@/util/date";
  import {getDictCmdbList} from "@/api/dict";

  export default {
    components: {deviceSelect, uploadImg, uploadModel},
    data() {
      return {
        id: '',
        deviceSelectSync: false,
        form: {},
        loading: false,
        isEdit: false,
        selectionList: [],
        deviceList: [],
        deviceSelectList: [],
        canBaofeiList: [{dictKey: 0, dictValue: '是'}, {dictKey: 1, dictValue: '否'}],
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        openUpload: false,
        selectDeviceList: [],
        erpDeptList: [],
        baofeiReasonList: [],
        isScarp: '',
        submitPersons: [],
        approvePersons: [],
      };
    },
    computed: {
      ...mapGetters(["permission", "userInfo", 'userDetail']),
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
    },
    mounted() {
      // 设置页面元素高度
      this.setPageContentHeight()
      this.id = null;
      //获取参数 判断是否是新增还是修改
      const params = this.$route.query
      this.id = params.id;

      if (params.id) {
        this.id = params.id;
        this.form.id = params.id;
        this.loadDetail(params.id);
        this.isEdit = true
        //加载 设备列表
        // this.loadDeviceDataList();
        this.getScarpReason();
        this.getRDeptrpList()

      } else {
        //加载空数据
        this.form.isScrap = 0;
        this.isScrap = '是';
        this.beforeOpen();
        this.getScarpReason();
        this.isEdit = false
      }

    },
    methods: {
      approvePersonChange(code) {
        this.approvePersons.forEach(val => {
          if (val.bname === code) {
            this.form.spr = val.bname
          }
          this.$forceUpdate();
        })
      },
      submitPersonChange(code) {
        this.submitPersons.forEach(val => {
          if (val.bname === code) {
            this.form.sqr = val.bname
          }
          this.$forceUpdate();
        })
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
      baofeiReaonSelect(item) {
        this.baofeiReasonList.forEach(val => {
          if (val.dictKey === item) {
            this.form.scrapReason = val.dictKey;
            this.form.scrapReasonW = val.dictValue;
            this.$forceUpdate();

          }
        })
      },
      getScarpReason() {
        //加载字典
        getDictCmdbList({ciId: '1131281812619264'}).then(res => {
          this.baofeiReasonList = res.data;
          if (this.$route.query.id) {
            this.form.scrapReasonW = res.data.filter(item => item.dictKey === this.form.scrapReason)[0].dictValue
            this.$forceUpdate();
          }
        });
      },
      //删除设备
      delDevice() {
        // this.deviceSelectSync = true
        this.selectionList.forEach(item => {
          let index = this.deviceList.findIndex(ell => ell.id == item)
          this.deviceList.splice(index, 1)
        })
      },
      getuseKeepDept(code) {
        this.erpDeptList.forEach(val => {
          if (val.kostl === code) {
            this.form.useKeepDeptName = val.kostlT
            this.form.useKeepDept = val.kostl
            this.form.entityKeepDeptName = val.kostlT
            this.form.entityKeepDept = val.kostl
            this.form.sqr = '';
            this.getApprovePersons();
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
            this.form.useKeepDeptName = val.kostlT
            this.form.useKeepDept = val.kostl
            this.form.sqr = '';
            this.getApprovePersons();
          }
        })
      },
      getRDeptrpList() {
        getRDeptrpList({swerk: this.userDetail.erpUnitCode, current: 1, size: 100}).then(res => {
          this.erpDeptList = res.data.records
        })
      },
      toProcess() {
        this.form.scrapListDTOS = this.deviceList;
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            //提交流程
            scrapApprove(this.form).then((res) => {
              this.$message({
                type: "success",
                message: "提交成功!"
              });
              this.handleReset();
            }, error => {
               
            });
          }
        })
      },
      canBaofeiSelect(item) {
        this.canBaofeiList.forEach(val => {
          if (val.dictKey === item) {
            this.form.isScrap = val.dictKey;
            this.isScrap = val.dictValue;
            this.$forceUpdate();
          }
        })
      },

      selectionChange(selection) {
        //点击选择事件
        this.selectDeviceList = selection;
        this.selectionList = selection.map(item => item.id);
      },
      handleSaveOK(status) {
        this.form.scrapListDTOS = this.deviceList;
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            //提交建档
            scrapSave(this.form).then((res) => {
              this.$message({
                type: "success",
                message: "保存成功!"
              });
              this.form.filingNo = res.data.filingNo;
              this.form.id = res.data.id;
              this.handleReset();

            }, error => {
               
            });
          }
        })
      },
      handleReset() {
        //返回
        this.$closePage('/operation/devScrapped')
      },
      showDictLable(code, dictList) {
        if (dictList != null && code != '') {
          let items = dictList.filter(item => item.dictKey === code);
          if (items != null && items.length > 0) {
            return items[0].dictValue;
          }
        }
        return code;
      },
      beforeOpen() {
        this.form.scrapTime = dateFormat(new Date())
        getUserDetail().then(res => {
          let usr = res.data;
          this.form.applyUser = usr.userId || '';
          this.form.applyUserName = usr.realName || '';
          this.form.applyUnitName = usr.ownerUnitName || '';
          this.form.applyUnit = usr.ownerUnit || '';
          this.form.applyDeptName = usr.propertyDeptName || '';
          this.form.applyDept = usr.propertyDept || '';
          this.$forceUpdate();
          this.getRDeptrpList()

        }).catch(() => {
        });

      },
      loadDetail(id) {
        scrapDetail(id).then(res => {
          this.form = res.data;
          this.isScrap = res.data.isScrap == 0 ? '是' : '否';
          this.deviceList = res.data.scrapListVOS.sort((a, b) => {
            return parseInt(a.sort) - parseInt(b.sort);
          });

          this.getApprovePersons();

        });
      },

      handleDelete(idx) {
        //删除
        this.deviceList.splice(idx, 1)
      },
      selectDevice() {
        //弹框 选择设备
        if (!this.form.useKeepDept) {
          this.$message.warning("请选择使用保管部门!")
          return;
        }
        if (!this.form.entityKeepDept) {
          this.$message.warning("请选择实物保管部门!")
          return;
        }
        this.deviceSelectSync = true
      },
      selectDeviceHandler(list) {
        //选择弹框 选择cmdb设备
        this.form.deviceNum = list.length;
        this.deviceSelectList = list;
        this.page.total = this.deviceSelectList.length;
        this.deviceList = this.deviceSelectList;
        // console.log(this.deviceSelectList, 'dayin============');
        let totalOriginalValue = 0;
        this.deviceSelectList.map((item) => {
          if (item.originalValue) {
            totalOriginalValue = totalOriginalValue + parseInt(item.originalValue)
          }
        })

        this.form.originalValue = totalOriginalValue;

        // console.log(this.form.originalValue, '打印资产原值');

        let totalNetWorth = 0;
        this.deviceSelectList.map((item) => {
          if (item.netWorth) {
            totalNetWorth = totalNetWorth + parseInt(item.netWorth)
          }
        })

        this.form.netWorth = totalNetWorth;
      },
    }
  };
</script>
<style lang="scss" scoped>
  .formLabel {
    line-height: 16px;
    display: block;
  }

  .topHeight {
    height: auto;
  }

  .description {
    p {
      text-align: left !important;
    }
  }
</style>
