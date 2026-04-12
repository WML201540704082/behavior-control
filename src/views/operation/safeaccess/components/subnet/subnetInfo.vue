<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <el-form ref="queryForm" :model="searchForm" :rules="rules" :disabled="isCheckState" label-width="145px" class="xt_form" v-loading="saveLoading"
               style="height: calc((100% - 50px) - 48px);">
        <el-row>
          <el-col :span="6">
            <div>
              <el-form-item label="子网名称" prop="subnetName">
                <el-input v-model="searchForm.subnetName"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="所属单位" prop="institutionName">
                <el-input v-model="searchForm.institutionName" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="所属网络" prop="networkType">
                <el-select v-model="searchForm.networkType" size="mini" clearable placeholder=""
                           style="width: 100%" @change="networkTypeChange">
                  <el-option
                    v-for="item in networkTypeList"
                    :key="item.dictKey"
                    :value="item.dictKey"
                    :label="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="广播地址" prop="broadcastAddress">
                <el-input placeholder="广播地址由网关和掩码生成，不能编辑" v-model="searchForm.broadcastAddress" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="子网地址" prop="subnetAddress">
                <el-input placeholder="子网地址由网关和掩码生成，不能编辑" v-model="searchForm.subnetAddress" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="子网网关" prop="subnetGateway">
                <el-input v-model="searchForm.subnetGateway" @change="subnetGatewayChange" :disabled="isEditUsedSubnet"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="子网掩码" prop="subnetMask">
                <el-select v-model="searchForm.subnetMask" @change="subnetMaskChange" :disabled="isEditUsedSubnetMask" size="mini" clearable placeholder=""
                           style="width: 100%">
                  <el-option
                    v-for="item in subnetMaskList"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    :label="item.dictKey"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div>
              <el-form-item label="首选DNS服务器" prop="dnsip">
                <el-input v-model="searchForm.dnsip"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="备选DNS服务器" prop="dnsip2">
                <el-input v-model="searchForm.dnsip2"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="状态" prop="code">
                <el-select v-model="searchForm.code" :disabled="isEditUsedSubnet" size="mini" clearable placeholder=""
                           style="width: 100%">
                  <el-option
                    v-for="item in codeList"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    :label="item.dictKey"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <!-- <el-col :span="6">
              <div>
                  <el-form-item label="所属交换机" prop="switchboard">
                      <switchSelect placeholder="请选择所属交换机" v-model="searchForm.switchboard" @change="switchChange"></switchSelect>
                  </el-form-item>
              </div>
          </el-col> -->
          <el-col :span="6">
            <div>
              <el-form-item label="vlan_id" prop="vlanId">
                <el-input v-model="searchForm.vlanId"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="ip地址1" prop="ip1">
                <el-input v-model="searchForm.ip1" :disabled="isEditUsedSubnet"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="位置1" prop="location1">
                <el-input v-model="searchForm.location1" :disabled="isEditUsedSubnet"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="ip地址2" prop="ip2">
                <el-input v-model="searchForm.ip2" :disabled="isEditUsedSubnet"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="位置2" prop="location2">
                <el-input v-model="searchForm.location2" :disabled="isEditUsedSubnet"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="录入人" prop="fillMan">
                <el-input v-model="searchForm.fillMan" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="填报时间" prop="fillDate">
                <el-date-picker
                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" type="datetime" :clearable="false"
                  v-model="searchForm.fillDate" style="width: 100%"
                  :disabled="false"></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="DHCP生成周期(秒)" prop="defaultLeaseTime">
                <el-input v-model="searchForm.defaultLeaseTime" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <!-- <el-col :span="6">
              <div>
                  <el-form-item label="所属安全分区" prop="spId">
                      <el-select v-model="searchForm.spName" size="mini" clearable placeholder=""
                                  style="width: 100%">
                          <el-option
                                  v-for="item in spNameList"
                                  :key="item.spName"
                                  :value="item.spName"
                                  :label="item.spName"
                          >
                          </el-option>
                      </el-select>
                  </el-form-item>
              </div>
          </el-col> -->
          <el-col :span="6">
            <div>
              <el-form-item label="是否设为共用子网" prop="isPublic">
                <el-select v-model="searchForm.isPublic" size="mini" clearable placeholder=""
                           style="width: 100%">
                  <el-option
                    v-for="item in isPublicList"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    :label="item.dictKey"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

        </el-row>
      </el-form>
      <div class="btn-row">
        <el-button v-if="!isCheckState" type="primary"
                   @click="handleSubmit">保存
        </el-button>
        <el-button style="margin-left: 15px;"
                   @click="handleReturn">返回
        </el-button>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {subnetDetail, subnetSave, getSubnetInfo, hasTerminal} from "@/api/operation/safeaccess/subnet";
import {switcheDetail} from "@/api/operation/safeaccess/switch";
import {mapGetters, mapState} from "vuex";
import {getDictList, getDictCmdbList} from "@/api/dict";
import {dateFormat} from "@/util/date";
import switchSelect from "@/components/switchSelect";

let ipCheck = (rule, value, callback) => {
  let regex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  if (value) {
    if (!regex.test(value)) {
      return callback(new Error('ip地址不正确'))
    } else {
      return callback()
    }
  } else {
    return callback()
  }
}
let vlanidCheck = (rule, value, callback) => {
  let regex = /^[0-9]*[0-9][0-9]*$/
  if (value) {
    if (!regex.test(value)) {
      return callback(new Error('vlanId格式不正确，请输入正整数'))
    } else {
      return callback()
    }
  } else {
    return callback()
  }
}

export default {
  props: [],
  components: {
    // arrtForm
    switchSelect
  },
  data() {
    return {
      showType: '',
      arrtId: '',

      networkTypeList: [],
      subnetMaskList: [],
      codeList: [{
        dictValue: '0',
        dictKey: '正常'
      }, {
        dictValue: '1',
        dictKey: '停用'
      }],
      spNameList: [],
      isPublicList: [{
        dictValue: '0',
        dictKey: '否'
      }, {
        dictValue: '1',
        dictKey: '是'
      }],
      isEditUsedSubnet: false,//已使用子网编辑时，不可编辑项
      isEditUsedSubnetMask: false,


      brandList: [],
      seriesList: [],
      deviceModelList: [],
      maintenanceCountryList: [],

      searchForm: {
        subnetAddress: null,
        broadcastAddress: null,
        code: undefined,
        fillDate: undefined,
        fillMan: undefined,
        defaultLeaseTime: undefined,
      },
      rules: {
        networkType: [{required: true, message: '请选择所属网络', trigger: 'blur'}],
        subnetName: [{required: true, message: '请输入子网名称', trigger: 'blur'}],
        //institutionCode: [{required: true, message: '所属单位不能为空', trigger: 'change'}],
        broadcastAddress: [{required: true, message: '广播地址不能为空', trigger: 'blur'}],
        subnetAddress: [{required: true, message: '子网地址不能为空', trigger: 'blur'}],
        subnetGateway: [{required: true, message: '子网网关不能为空', trigger: 'blur'}, {validator: ipCheck, trigger: 'blur'}],
        subnetMask: [{required: true, message: '子网掩码不能为空', trigger: 'blur'}],
        dnsip: [{required: true, message: '首选dns不能为空', trigger: 'blur'}],
        code: [{required: true, message: '状态不能为空', trigger: 'change'}],
        vlanId: [{required: true, message: 'vlanid不能为空', trigger: 'blur'}, {validator: vlanidCheck, trigger: 'blur'}],
        defaultLeaseTime: [{required: true, message: 'dhcp生成周期不能为空', trigger: 'blur'}],
        isPublic: [{required: true, message: '请选择是否设为公共子网', trigger: 'change'}],
        ip1: [{validator: ipCheck, trigger: 'blur'}],
        ip2: [{validator: ipCheck, trigger: 'blur'}]
      },
      pageLoading: false,
      saveLoading: false,


      dataList: [],
      selectionList: [],
      total: 0,
      tableLoading: false, //表格加载
      tableHeight: undefined,
      isSave: false
    }
  },
  computed: {
    ...mapGetters(["permission", 'userDetail']),
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    isCheckState() {
      return this.showType == 'check'
    }
  },
  watch: {
    'networkTypeList'(newVal, oldVal) {

    },
  },
  created() {
    this.showType = this.$route.query.showType
    this.arrtId = this.$route.query.arrtId


    if (this.showType == 'add') {
      this.searchForm.fillDate = dateFormat(new Date())
      this.searchForm.fillMan = this.userInfo.userName
      this.searchForm.code = '0'
      this.searchForm.defaultLeaseTime = '3600'


      //单位根据当前用户登录单位默认值固定，不可修改
      this.searchForm.institutionName = this.userDetail.institutionName;
      this.searchForm.institutionCode = this.userDetail.institutionCode;

      this.getNetWorkList();
    } else {
      this.getDetail()
    }

    //加载字典--子网掩码
    this.getDictList("itump_subnetMask");
  },
  mounted() {
    this.setPageContentHeight('page_form', 'page_body')
  },
  methods: {
    getNetWorkList() {
      //加载字典--所属网络
      getDictCmdbList({ciId: 1107942968721408}).then(res => {
        this.networkTypeList = res.data;
        if (this.searchForm.networkType) {
          let item = this.networkTypeList.find(a => a.dictKey == this.searchForm.networkType);
          if (item) {
            this.searchForm.networkTypeName = item.dictValue;
          }
        }
      })
    },

    networkTypeChange(val) {
      this.searchForm.networkTypeName = this.networkTypeList.find(a => a.dictKey == val).dictValue;
    },
    switchChange(val, type) {

    },
    //网关值改变时间
    subnetGatewayChange(val) {
      if (this.searchForm.subnetMask == null || this.searchForm.subnetMask === null) {
        // this.searchForm.subnetGateway = val
      } else {
        this._getSubnetInfo()
      }
    },
    //子网掩码值改变事件
    subnetMaskChange(val) {
      if (this.searchForm.subnetGateway == null || this.searchForm.subnetGateway === null) {
        // this.searchForm.subnetMask = val
      } else {
        this._getSubnetInfo()
      }
    },
    //根据子网掩码和网管自动生成子网信息
    //计算子网信息并填写
    _getSubnetInfo() {
      let _this = this
      let v_gateway = _this.searchForm.subnetGateway
      let v_mask = _this.searchForm.subnetMask
      if (v_gateway != null && v_gateway != null && v_mask != null && v_mask != null) {
        if (v_mask == '255.255.255.255') {
          _this.searchForm.subnetAddress = v_gateway
          _this.searchForm.broadcastAddress = v_gateway
          return
        }
        let params = {
          id: _this.searchForm.id,
          subnetGateway: v_gateway,
          subnetMask: v_mask
        }
        getSubnetInfo(params).then(resp => {
          if (resp.code === 200) {
            let subnetInfo = resp.data
            if (subnetInfo[0].length > 7) {
              _this.isSave = false
              _this.searchForm.subnetAddress = subnetInfo[0]
              _this.searchForm.broadcastAddress = subnetInfo[1]
            } else if (subnetInfo[0] == '-1') {
              _this.isSave = true
              _this.$message({
                message: '子网网关与子网掩码格式错误，请检查！',
                type: 'warning'
              })

              _this.searchForm.subnetAddress = undefined
              _this.searchForm.broadcastAddress = undefined
            } else if (subnetInfo[0] == '-2') {
              _this.isSave = true
              _this.$message({
                message: '子网网关与子网地址或广播地址相同，请检查！',
                type: 'warning'
              })

              _this.searchForm.subnetAddress = undefined
              _this.searchForm.broadcastAddress = undefined
            } else if (subnetInfo[0] == '-3') {
              _this.isSave = true
              _this.$message({
                message: '子网地址重复，请检查！',
                type: 'warning'
              })

              _this.searchForm.subnetAddress = undefined
              _this.searchForm.broadcastAddress = undefined
            }
          } else {
            _this.isSave = true
            _this.$message({
              message: '获取子网信息失败',
              type: 'warning'
            })

            _this.searchForm.subnetAddress = undefined
            _this.searchForm.broadcastAddress = undefined
          }
        })
      }
    },
    handleSubmit() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          subnetSave(this.searchForm).then(res => {
            this.saveLoading = false
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.handleReturn()
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    },
    handleReturn() {
      this.$closePage('/operation/safeaccess/subnet');
    },
    getDictList(code) {
      //加载字典
      getDictList(code).then(res => {
        if (code === 'itump_subnetMask') { // 子网掩码
          this.subnetMaskList = res.data;
        } else if (code === 'swState') {
          this.swStateList = res.data;
        } else if (code === 'Is802') {
          this.Is802List = res.data;
        } else if (code === 'snmpVersion') {
          this.snmpVersionList = res.data;
        } else if (code === 'isAccessSwitch') {
          this.isAccessSwitchList = res.data;
        }
      });
    },


    // 详情
    getDetail() {

      this.pageLoading = true
      subnetDetail({id: this.arrtId}).then(rel => {
        this.searchForm = rel.data

        this.getNetWorkList();
        //   this.hasTerminal()
        this.pageLoading = false
      }).catch(() => {
        this.pageLoading = false
      })

    },


    //查询子网中是否存在终端
    hasTerminal() {
      let _this = this
      let params = {
        subnetId: _this.arrtId
      }
      hasTerminal(params).then(resp => {
        if (resp.data === true) {
          _this.isshow = true
          _this.isSave = false
          _this.isEditUsedSubnet = true
          // if ('01liuzhigang' == this.name) {
          //     this.isEditUsedSubnetMask = false
          // } else {
          //     this.isEditUsedSubnetMask = true
          // }
        } else {
          _this.isshow = true
          _this.isSave = false
          _this.isEditUsedSubnet = false
          // if ('01liuzhigang' == this.name) {
          //     this.isEditUsedSubnetMask = false
          // } else {
          //     this.isEditUsedSubnetMask = true
          // }
        }
      })
    },


  }
}
</script>

<style lang="scss" scoped>
.formLabel {
  line-height: 20px;
}

.btn-row {
  text-align: center;
}
</style>
