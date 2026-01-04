<template>
  <div class="wrap">
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="beforeCloseHandler"
      :visible.sync="isShow"
      append-to-body
      title="编辑"
      width="1100px"
      top="10vh"
      v-el-drag-dialog
    >
      <basic-container>
        <div class="page_form">
          <el-form
            ref="deviceForm"
            :model="deviceForm"
            label-width="100px"
            class="xt_form"
            :rules="rules"
          >
            <el-collapse v-model="activeName">
              <el-collapse-item title="设备基本信息" name="1">
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="设备编码" prop="deviceCode">
                      <el-input v-model="deviceForm.deviceCode" placeholder="请输入设备编码" clearable disabled></el-input>
                    </el-form-item>
                  </el-col>
<!--                  <el-col :span="8">-->
<!--                    <el-form-item label="ERP资产编码" prop="erpAssetCode">-->
<!--                      <el-input v-model="deviceForm.deviceCodeErp" placeholder="" clearable disabled></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
                  <el-col :span="8">
                    <el-form-item label="标准全称" prop="deviceName">
                      <el-input v-model="deviceForm.deviceName" placeholder="请输入设备名称" clearable disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="6">
                  <el-col :span="8">
                    <el-form-item label="出厂序列号" prop="sn">
                      <el-input v-model="deviceForm.sn" placeholder="请输入出厂序列号" clearable disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="领用信息" v-show="type=='1'" name="2">
                <el-row :gutter="6" v-show="type=='1'">
                  <el-col :span="8">
                    <el-form-item label="领用单位" prop="receiveUnit" disabled>
                      <el-input v-model="deviceForm.receiveUnit" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="领用部门" prop="receiveDept">
                      <!--                  <el-input v-model="deviceForm.receiveDept" disabled></el-input>-->
                      <xt-tree-lzay-select :formValue="deviceForm.receiveDept"
                                           :selectType="'DEPT'"
                                           :unit-id="deviceForm.receiveUnitCode"
                                           @getTreeItem="getEntityDept">

                      </xt-tree-lzay-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="责任人" prop="sn">
                      <el-input v-model="deviceForm.receivingPerson" placeholder="请输入责任人" clearable
                                :disabled="isEdit1"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="6" v-show="type=='1'">
                  <el-col :span="8">
                    <el-form-item label="责任人班组" prop="sn">
                      <el-input v-model="deviceForm.receivingGroup" placeholder="" clearable
                                disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="receivingIDCard">
                      <template slot="label">
                        <span class="formLabel">责任人<br>身份证号</span>
                      </template>
                      <el-input v-model="deviceForm.receivingIDCard" placeholder="请输入领用人身份证" clearable
                                :disabled="isEdit2"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="receivingTel">
                      <template slot="label">
                        <span class="formLabel">责任人<br>联系方式</span>
                      </template>
                      <el-input v-model="deviceForm.receivingTel" placeholder="请输入领用人联系方式" clearable
                                :disabled="isEdit3"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="责任人ISC账号" prop="receivePersonUnifiedAcc">
                      <template slot="label">
                        <span class="formLabel">责任人<br>ISC账号</span>
                      </template>
                      <el-input v-model="deviceForm.receivePersonUnifiedAcc" placeholder="请输入责任人ISC账号"
                                clearable disabled="true"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="使用信息" v-show="type=='1'" name="3">
                <el-row :gutter="6" v-show="type=='1'">
                  <el-col :span="8">
                    <el-form-item label="使用人" prop="user">
                      <el-input v-model="deviceForm.user" placeholder="请输入使用人" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用人身份证" prop="deviceUserIDCard">
                      <template slot="label">
                        <span class="formLabel">使用人<br>身份证号</span>
                      </template>
                      <el-input v-model="deviceForm.deviceUserIDCard" placeholder="请输入使用人身份证" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用人联系方式" prop="userTel">
                      <template slot="label">
                        <span class="formLabel">使用人<br>联系方式</span>
                      </template>
                      <el-input v-model="deviceForm.userTel" placeholder="请输入使用人联系方式" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="6" v-show="type=='1'">
                  <el-col :span="8">
                    <el-form-item label="安装地点" prop="installationSite" size="small">
                      <el-input v-model="deviceForm.installationSite" placeholder="请输入安装地点" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="维护信息" v-show="type=='1'" name="4">
                <el-row :gutter="6" v-show="type=='1'">
                  <el-col :span="8">
                    <el-form-item label="运维单位" prop="operationUnit">
                      <el-input v-model="deviceForm.operationUnit" disabled></el-input>
                      <!--                  <xt-tree-select-->
                      <!--                    :treeData="unitList"-->
                      <!--                    :formValue="deviceForm.operationUnit"-->
                      <!--                    :selectType="'CORP'"-->
                      <!--                    @getTreeItem="getOperationUnit"-->
                      <!--                  ></xt-tree-select>-->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运维部门" prop="operationDept">
                      <!--                  <el-input v-model="deviceForm.operationDept" disabled></el-input>-->
                      <xt-tree-lzay-select :formValue="deviceForm.operationDept"
                                           :selectType="'DEPT'"
                                           :unit-id="deviceForm.operationUnitCode"
                                           @getTreeItem="getOperationDept"
                                           :disabled="isOper">

                      </xt-tree-lzay-select>
<!--                      <xt-tree-select-->
<!--                        :treeData="unitList"-->
<!--                        :formValue="deviceForm.operationDept"-->
<!--                        :selectType="'DEPT'"-->
<!--                        @getTreeItem="getOperationDept"-->
<!--                        :disabled="isOper"-->
<!--                      ></xt-tree-select>-->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运维责任人" prop="operationPerson" size="small">
                      <!--                  <el-input v-model="deviceForm.operationPerson" placeholder="请选择运维责任人" clearable :disabled="isOper"></el-input>-->
                      <el-select v-model="deviceForm.operationPerson" placeholder="请选择运维责任人" clearable :disabled="isOper">
                        <el-option v-for="dict in userList" :key="dict.realName" :label="dict.realName"
                                  :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运维联系电话" prop="operationTel" size="small">
                      <el-input v-model="deviceForm.operationTel" placeholder="请输入运维联系电话" clearable
                                :disabled="isOper"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运维等级" prop="operationLevel" size="small">
                      <el-select v-model="deviceForm.operationLevel" placeholder="请输入运维等级" clearable :disabled="isOper">
                        <el-option v-for="dict in operationLevelList" :key="dict.dictKey" :label="dict.dictValue"
                                  :value="dict.dictKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="网络信息" name="5" v-show="type=='2'">
                <el-row :gutter="6" v-show="type=='2'">
                  <el-col :span="8">
                    <el-form-item label="所属子网" prop="subnetId" size="small">
                      <el-select v-model="deviceForm.subnetId" placeholder="请选择所属子网" clearable
                                @change="changeSubnet">
                        <el-option v-for="dict in belongIntnetList" :key="dict.id" :label="dict.subnetName"
                                  :value="dict.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="IP地址" prop="IP" size="small">
                      <el-select v-model="deviceForm.IP" placeholder="请选择IP地址" clearable>
                        <el-option v-for="dict in ipList" :key="dict.ipId" :lable="dict.ip" :value="dict.ip"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="MAC地址" prop="MAC" size="small">
                      <el-input v-model="deviceForm.MAC" placeholder="请输入MAC地址" clearable disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="6" v-show="type=='2'">
                  <el-col :span="8">
                    <el-form-item label="认证方式" prop="networkAccessMethod" size="small">
                      <el-select v-model="deviceForm.networkAccessMethod" placeholder="请选择认证方式" clearable disabled>
                        <el-option v-for="dict in networkingMethodList" :key="dict.dictValue" :label="dict.dictValue"
                                  :value="dict.dictValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>

            <!-- <div class="fenge"></div> -->
            <!-- <div class="fenge"></div> -->
            <!-- <div class="fenge"></div> -->
            <!-- <div class="fenge" v-show="type=='2'"></div> -->
          </el-form>
        </div>
        <!-- 底部按钮 -->
        <div class="form-btn">
          <el-button class="border-btn" size="small" @click="handleSubmit()">保 存</el-button>
          <el-button class="border-btn" size="small" @click="searchReset" style="margin-left: 50px;">返 回</el-button>
        </div>
      </basic-container>
    </el-dialog>
  </div>
</template>
<script>
  import {getDictCmdbList, getDictList} from "@/api/dict";
  import {accessSubnetList, accessSubnetIPList} from "@/api/operation/devChange/devChange";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
  import {getDeptList} from "@/api/system/dept";
  import {getUserList} from "@/api/device/deviceapply"
  import {mapGetters} from "vuex";


  export default {
    components: {xtTreeLzaySelect},
    props: {
      placeholder: {
        type: String
      },
      type: {
        type: String
      },
      value: {
        type: [String, Number, Array],
        default: ""
      },
      bindId: {
        type: String,
        default: ""
      },
      deviceDetailForm: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    data() {
      return {
        activeName:['1','2','3','4','5'],
        rules: {
          receivingIDCard: [
            {pattern: /^\d{17}[0-9X]$/, message: '身份证号格式错误', trigger: 'blur'}
          ],
          deviceUserIDCard: [
            {pattern: /^\d{17}[0-9X]$/, message: '身份证号格式错误', trigger: 'blur'}
          ],
          // userTel:[
          //   {pattern:/^1[3-9]\d{9}$/,message:'手机号格式错误', trigger:'blur'}
          // ],
          // operationTel:[
          //   {pattern:/^1[3-9]\d{9}$/,message:'手机号格式错误', trigger:'blur'}
          // ],
        },
        deviceForm: {},
        isShow: true,
        tableHeight: '550px',
        loading: false,
        receiveUnitList: [],
        receiveDeptList: [],
        operationDeptList: [],
        operationUnit: [],
        operationLevelList: [],
        belongIntnetList: [],
        networkingMethodList: [],
        unitList: [],
        deptList: [],
        ipList: [],
        //是否可更改
        isEdit1: false,
        isEdit2: false,
        isEdit3: false,
        //排除ip
        excludeIps: [],
        isOper: false,
        //用户列表
        userList: [],

      };
    },
    computed: {
      ...mapGetters(["permission", "userInfo", "userDetail"]),
      isVisible: {
        get() {
          return this.isVisible
        },
        set(val) {
          this.$emit("update:isShow", val)
        }
      },

    },
    created() {
      //判断是否是运维人员
      this.isRole();
      //获取 部门列表
      this.getDeptList()
      //加载字典--运维等级
      this.getCmdbDictList("1107954469502976");
      this.getDictList('Is802')

      this.deviceForm = JSON.parse(JSON.stringify(this.deviceDetailForm))
      //
      if (this.deviceForm.receivingPerson != '') {
        this.isEdit1 = true
      }
      if (this.deviceForm.receivingIDCard != '') {
        this.isEdit2 = true
      }
      if (this.deviceForm.receivingTel != '') {
        this.isEdit3 = true
      }
      if (this.type == '2') {
        this.loadIp()
      }

    },
    methods: {
      getUserList(val) {
        //根据部门id获取人员列表
        getUserList({deptId: val.id}).then(res => {
          this.userList = res.data
        })
      },
      isRole() {
        //判断角色是否是运维人员
        if (this.userDetail.userRoleFlag === 0) {
          this.isOper = false
        } else {
          this.isOper = true
        }
      },
      getDeptList() {
        //获取部门 单位
        getDeptList().then(res => {
          this.unitList = res.data
        })
      },
      getOperationUnit(val) {
        //选择运维单位
        this.deviceForm.operationUnit = val.fullName
        this.$refs.deviceForm.$forceUpdate()
        this.$forceUpdate()
      },
      getOperationDept(val) {
        //选择运维部门
        this.deviceForm.operationDept = val.fullName
        //根据部门id获取人员列表
        getUserList({deptId: val.id}).then(res => {
          this.userList = res.data
        })
        this.$refs.deviceForm.$forceUpdate()
        this.$forceUpdate()
      },
      getEntityUnit(val) {
        //选择领用单位
        this.deviceForm.receiveUnit = val.fullName
        this.$refs.deviceForm.$forceUpdate()
        this.$forceUpdate()
      },
      getEntityDept(val) {
        //选择领用部门
        this.deviceForm.receiveDept = val.fullName
        this.deviceForm.receiveDeptCode = val.id;
        this.$refs.deviceForm.$forceUpdate()
        this.$forceUpdate()
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
          if (code === '1107954469502976') {
            this.operationLevelList = res.data;
          }
        });
      },
      getDictList(code) {
        //加载字典
        getDictList(code).then(res => {
          if (code === 'ticket_creat_type') {
            this.ticketCreatTypeList = res.data;
          } else if (code === 'ticket_status') {
            this.ticketStatusList = res.data;
          } else if (code === 'Is802') {
            this.networkingMethodList = res.data;
          }
        });
        //ip


        // 所属子网
        accessSubnetList({current: 1, size: 9999}).then(res => {
          this.belongIntnetList = res.data.records
        })
      },
      handleSubmit() {
        this.excludeIps.push(this.deviceForm.ip);
        //保存
        this.$refs.deviceForm.validate(valid => {
          if (valid) {
            //提交
            this.$emit("setVal", this.deviceForm);
            this.isVisible = false
            // 关闭
            this.beforeCloseHandler();
          }
        })
      },
      searchReset() {
        // 关闭
        this.beforeCloseHandler();
      },
      beforeCloseHandler() {
        //点击关闭按钮
        this.$emit('close')
        this.isVisible = false
      },
      changeSubnet(val) {
        // 修改子网
        for (let i = 0; i < this.belongIntnetList.length; i++) {
          let item = this.belongIntnetList[i]
          if (val === item.id) this.deviceForm.subnetName = item.subnetName
        }
        if (val === '') {
          this.ipList = []
          this.deviceForm.IP = ''
        } else {
          accessSubnetIPList({subnet: val, isUsed: 0, excludeIps: this.excludeIps}).then((res => {
            this.ipList = res.data
          }))
        }
      },
      loadIp() {
        accessSubnetIPList({subnet: this.deviceForm.subnetId, isUsed: 0, excludeIps: this.excludeIps}).then((res => {
          this.ipList = res.data
        }))
      }
    }
  };
</script>
<style lang='scss' scoped>
  ::v-deep .el-collapse-item__header{
    background-color: #e4edf5 !important;
    font-weight: bold;
  }
  ::v-deep .el-collapse-item >div .is-active{
    background-color: #84b7f9 !important;
  }
  ::v-deep .el-collapse-item__content{
    padding: 15px 0 10px;
  }
  ::v-deep .el-collapse{
    border: 1px solid #84b7f9;
    .el-collapse-item:last-child{
      border-bottom: 1px solid #84b7f9
    }
  }

  .fenge{
    border-bottom: 1px dashed #b3d8ff;
    margin-bottom: 15px;
  }
  .wrap {
    width: 100%;
  }

  ::v-deep .el-select {
    width: 100% !important;
  }

  .formLabel {
    line-height: 16px;
    display: block;
    padding-top: 5px;
  }
</style>
