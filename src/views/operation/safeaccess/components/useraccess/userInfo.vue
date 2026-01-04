<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <el-form ref="queryForm" :model="searchForm" label-width="130px" class="xt_form" style="height: calc((100% - 50px) - 48px);">
        <el-row>
          <el-col :span="6">
            <div>
              <el-form-item label="所属单位">
                <el-input v-model="searchForm.companyName" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="所属部门">
                <el-input v-model="searchForm.deptName" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="设备编码">
                <el-input v-model="searchForm.deviceCode" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="所属子网">
                <el-input v-model="searchForm.subnetName" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="设备类型">
                <el-input v-model="searchForm.deviceTypeName" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="MAC地址">
                <el-input v-model="searchForm.macAddress" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="IP地址">
                <el-input v-model="searchForm.ipAddress" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="地址">
                <el-input v-model="searchForm.address" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="联系电话">
                <el-input v-model="searchForm.phone" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="认证用户">
                <el-input v-model="searchForm.approveuUser" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="认证密码">
                <el-input v-model="searchForm.approveuPassword" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="状态">
                <el-select v-model="searchForm.code" style="width: 100%" disabled>
                  <el-option v-for="item in swStateList" :value="item.dictKey" :label="item.dictValue" :key="item.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="开始入网时间">
                <el-input v-model="searchForm.startTime" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div>
              <el-form-item label="允许入网时长(天)">
                <el-input v-model="searchForm.allowDays" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="认证方式">
                <el-select v-model="searchForm.is802" style="width: 100%" disabled>
                  <el-option v-for="item in Is802List" :value="item.dictKey" :label="item.dictValue" :key="item.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="终端是否认证">
                <el-select v-model="searchForm.isAccess" style="width: 100%" disabled>
                  <el-option v-for="item in isAccessSwitchList" :value="item.dictKey" :label="item.dictValue" :key="item.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="责任人">
                <el-input v-model="searchForm.miUser" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="使用人">
                <el-input v-model="searchForm.miChargeUser" disabled></el-input>
              </el-form-item>
            </div>
          </el-col>


        </el-row>
      </el-form>
      <div class="btn-row">
        <el-button style="margin-left: 15px;"
                   @click="handleReturn">返回
        </el-button>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {queryDept} from "@/api/operation/safeaccess/subnet";
import {userDetail} from "@/api/operation/safeaccess/useraccess";
import {mapGetters, mapState} from "vuex";
import {getDictList} from "@/api/dict";
import switchSelect from "@/components/switchSelect";


export default {
  props: [],
  components: {
    // arrtForm
    switchSelect
  },
  data() {
    return {
      Type: '',
      arrtId: '',

      unitlList: [],
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
        subnetAddress: '',
        broadcastAddress: ''
      },
      rules: {},
      pageLoading: false,
      saveLoading: false,


      dataList: [],
      selectionList: [],
      total: 0,
      tableLoading: false, //表格加载
      tableHeight: undefined,


      swStateList: [],
      Is802List: [],
      isAccessSwitchList: []
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    isCheckState() {
      return this.showType == 'check'
    }
  },
  created() {
    this.showType = this.$route.query.showType
    this.arrtId = this.$route.query.arrtId
    this.getDetail()

    // if( this.showType == 'add' ){
    //     this.searchForm.fillDate = dateFormat(new Date())
    //     this.searchForm.fillMan = this.userInfo.userName
    //     this.searchForm.code = '0'
    //     this.searchForm.defaultLeaseTime = '3600'
    // }else{
    //     this.getDetail()
    // }


    //加载字典--子网掩码
    this.getDictList("swState");
    this.getDictList("Is802");
    this.getDictList("isAccessSwitch");
    queryDept().then(res => {
      this.unitlList = res.data
    })

  },
  mounted() {
    this.setPageContentHeight('page_form', 'page_body')
  },
  methods: {


    handleReturn() {
      this.$closePage('/operation/safeaccess/useraccess');
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
      userDetail({id: this.arrtId}).then(rel => {
        this.searchForm = rel.data
        this.pageLoading = false

      }).catch(() => {
        this.pageLoading = false
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
