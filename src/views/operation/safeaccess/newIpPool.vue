<template>
  <div class="ippool">
    <div class="page_form"></div>
    <div class="tabCon">
      <el-container style="height:100%">

        <el-main v-loading="mainLoading" style="padding: 0px ">
          <el-header ref="header" style="padding: 10px 20px 0px 20px;margin:0px;height:auto">
            <el-form :inline="false" v-model="searchForm" label-width="110px" style="font-weight: bold" class="form-page">
              <el-row>
                <el-col :span="8">
                  <div>
                    <el-form-item label="子网名称:">
                      <el-select v-model="searchForm.subnetName" filterable size="small" clearable placeholder="" style="width: 100%" @change="subnetNameChange">
                        <el-option v-for="item in subnetNameList" :value="item.subnetName" :label="item.subnetName" :key="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <el-form-item label="vlanId:">
                      <el-input v-model="searchForm.vlanId" size="small" clearable></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8" style="text-align: right;padding-top: 4px;">
                  <div style="margin-right: 10px;display: inline;">
                    <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
                  </div>
                  <div style="margin-right: 10px;display: inline">
                    <el-button type="primary" size="mini" @click="handleReset" plain>重置</el-button>
                  </div>
                  <div style="display: inline">
                    <el-button type="primary" size="mini" @click="handleAdd" plain>子网定义</el-button>
                  </div>
                </el-col>

              </el-row>

            </el-form>
          </el-header>

          <div class="content" style="padding-left: 20px; margin-top: 10px">
            <div class="ip_box">
              <div class="">
                <div style="display: flex;justify-content: space-between; padding-right: 0.5%;margin-bottom: 10px">
                  <el-tag><span style="font-weight:900">子网单位：</span> {{ institutionName }}</el-tag>
                  <el-tag><span style="font-weight:900">地址范围：</span> {{ ipRange }}</el-tag>
                  <!-- <el-tag><span style="font-weight:900">当前地址池：</span> {{ nowIpRange }}</el-tag> -->
                </div>
              </div>
              <div class="tip">
                <span>
                  <i class="btn4"></i> 网关
                </span>
                <span>
                  <i class="btn2"></i> 未分配
                </span>
                <span>
                  <i class="btn3"></i> 已分配
                </span>
                <span>
                  <i class="btn5"></i> 异常
                </span>
                <span>
                  <i style="background: #909399;"></i> 不可用
                </span>
              </div>
              <ul v-loading="mainLoading" style="min-height: 55vh">
                <li style="background: #909399;color: #fff;border: none;"> 0</li>
                <li v-for="(item, index) in ippool" :key="index" :class="item.style"
                    @click="seeIpDetail(item, index)">
                  <el-tooltip effect="dark" placement="top">
                    <div slot="content">
                      <div> 设备类型: {{ item.adress.deviceType }}</div>
                      <div style="margin: 5px 0;"> IP地址: {{ item.adress.ip }}</div>
                      <div> MAC地址: {{ item.adress.mac }}</div>
                    </div>
                    <span :class="[ active == index? 'active_class':'', item.adress.iS802 == 3 && item.style == 'is_use offline' ? 'btn5': '' ]"> {{
                        item.ip
                      }} </span>
                  </el-tooltip>

                </li>
                <li style="background: #909399;color: #fff;border: none;"> 255</li>
              </ul>
              <pagination
                :total="total"
                :page.sync="searchForm.current"
                :limit.sync="searchForm.size"
                @pagination="handleChange"/>

            </div>

            <!-- 右侧详情 -->
            <div class="ip_info" v-loading="ipInfoLoading" style="margin-right: 20px;margin-left: 30px">
              <el-scrollbar style="height:100%">
                <el-row style="background: rgb(227,238,253); height: 4.5vh; line-height: 4.3vh; font-weight: 900">基本信息</el-row>
                <el-row>
                  <el-col :span="8">子网名称</el-col>
                  <el-col :span="16">{{ detail.subnetName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">掩码</el-col>
                  <el-col :span="16">{{ detail.subnetMask }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">IP地址</el-col>
                  <el-col :span="16">
                    <div> {{ detail.ip }}</div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">Vlan</el-col>
                  <el-col :span="16">{{ detail.vlanId }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">交换机</el-col>
                  <!-- <el-col :span="16" class="switch" @click="seeSwitchDateil">
                    <div @click="seeSwitchDateil"> {{ detail.nasip }}</div>
                  </el-col> -->
                  <el-col :span="16">{{ detail.nasip }}</el-col>
                </el-row>


                <el-row>
                  <el-col :span="8">使用情况</el-col>
                  <el-col :span="16">
                    <div v-if="!showOnline">
                      {{ online | onlineFilter }}
                      <el-button type="text" @click="setOnline" v-if="false">修改</el-button>
                    </div>
                    <el-select v-model="online" size="mini" @change="selectOnline">
                      <el-option value="0" label="未使用"></el-option>
                      <el-option value="1" label="已使用"></el-option>
                      <el-option value="2" label="网关"></el-option>
                    </el-select>
                  </el-col>
                </el-row>


                <el-row>
                  <el-col :span="8">IP类型</el-col>
                  <el-col :span="16">
                    <div v-if="!showType">
                      {{ type | typeFilter }}
                      <el-button type="text" @click="setUpType" v-if="false">修改</el-button>
                    </div>
                    <el-select v-if="showType" v-model="type" size="mini" @change="selectType">
                      <el-option value="1" label="普通地址"></el-option>
                      <el-option value="2" label="预留地址"></el-option>
                      <el-option value="3" label="禁用地址"></el-option>
                    </el-select>
                  </el-col>
                </el-row>

                <el-row style="background: rgb(227,238,253); height: 4.5vh; line-height: 4.3vh; font-weight: 900">终端信息</el-row>
                <el-row>
                  <el-col :span="8">设备名称</el-col>
                  <el-col :span="16">{{ detail.basicDeviceName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">设备类型</el-col>
                  <el-col :span="16">{{ detail.basicDeviceType }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">操作系统</el-col>
                  <!-- <el-col :span="16">{{ ip }}</el-col> -->
                  <el-col :span="16">{{showDictLable(detail.OSTypeCode, osTypeList)}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">制造商</el-col>
                  <el-col :span="16">{{ detail.basicMaker }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">责任人</el-col>
                  <el-col :span="16">{{ detail.miUser }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">设备状态</el-col>
                  <el-col :span="16">{{ detail.basicState }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">最近认证时间</el-col>
                  <el-col :span="16">{{ detail.lastAuthTime }}</el-col>
                </el-row>

                <el-row style="background: rgb(227,238,253); height: 4.5vh; line-height: 4.3vh; font-weight: 900">用户入网信息</el-row>
                <el-row>
                  <el-col :span="8">单位</el-col>
                  <el-col :span="16">{{ userAccess.companyName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">部门</el-col>
                  <el-col :span="16">{{ userAccess.deptName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">安装地点</el-col>
                  <el-col :span="16">{{ userAccess.address }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">联系电话</el-col>
                  <el-col :span="16">{{ userAccess.phone }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">设备类型</el-col>
                  <el-col :span="16">{{ userAccess.deviceTypeName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">设备编码</el-col>
                  <el-col :span="16">{{ userAccess.deviceCode }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">IP地址</el-col>
                  <el-col :span="16">{{ userAccess.ipAddress }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">MAC地址</el-col>
                  <el-col :span="16">{{ userAccess.macAddress }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">状态</el-col>
                  <el-col :span="16">{{ userAccess.code | codeFilter }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-tooltip content="入网时长(天)" placement="bottom" effect="light">
                      <span>入网时长(天)</span>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="16">{{ userAccess.allowDays }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">责任人</el-col>
                  <el-col :span="16">{{ userAccess.fullUsername }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">认证方式</el-col>
                  <el-col :span="16">{{ userAccess.is802 }}</el-col>
                </el-row>
                <!-- <el-row>
                  <el-col :span="8">
                    <el-tooltip content="认证方式" placement="bottom" effect="light">
                      <span>认证方式</span>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="16">{{ userAccess.is802 | is802Filter }}</el-col>
                </el-row> -->
                <el-row>
                  <el-col :span="8">终端是否认证</el-col>
                  <el-col :span="16">{{ userAccess.isAccess | isAccessFilter }}</el-col>
                </el-row>
              </el-scrollbar>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>


    <!-- 交换机详情弹窗 -->
    <el-dialog :modal-append-to-body="false" :close-on-click-modal="false" title="交换机配置详情"
               v-if="isShowSwith" :visible.sync="isShowSwith" width="90%">
      <div class="switch_box">
        <div style="position: absolute;top: 54%;left: 83%;color: #fff;">
          <span>地址：{{ switchDetailData.swIp }}</span>
        </div>
        <div style="position: absolute;top: 50%;left: 5%;color: #fff;">
          <div style="margin-bottom:5px">设备厂家：{{ switchDetailData.swFirm }}</div>
          <div>设备型号：{{ switchDetailData.swModel }}</div>
        </div>
        <div class="postion_box">
          <ul>
            <li v-for="(item, index) in switchList" :key="index" class="switch_item" :class="switchDetailData.port == item.num? 'arrow_box': ''">
              <i class="item_back is_range" v-if="item.num%2 == 1" style="margin-bottom: 100%; transform: rotate(180deg)"></i>
              <span>{{ item.num }}</span>
              <i class="item_back is_range" v-if="item.num%2 == 0" style="margin-bottom:3px"></i>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import switchInfo from './components/switch/switchInfo'
import wbsSelect from "@/components/wbsSelect";
import {getDictList, getDictCmdbList} from "@/api/dict";
import {mapGetters, mapState, setIpLevel} from "vuex";
import {subnetList} from "@/api/operation/safeaccess/subnet";
import {
  ipPoolIdSegmentList,
  getQueryList,
  getDetails,
  setIsUsed,
  getRadiusIp,

} from "@/api/operation/safeaccess/newIpPool";
import {fingUserAccessByIpAddress} from "@/api/operation/safeaccess/useraccess";
import {Loading} from 'element-ui'


export default {
  components: {
    switchInfo,
    wbsSelect
  },
  data() {
    return {
      waitLoading: null,
      ipBox: [],

      switchList: [{}],
      isShowSwith: false,

      subnetNameList: [],
      ippool: [{
        ip: '',
        style: '',
        adress: {}
      }],

      ipdata: [ //树状图数据（所有子网）
      ],
      defaultProps: {
        label: 'subnetName',
        children: 'children',
        isLeaf: 'leaf'
      },

      searchForm: {
        subnetName: undefined,
        current: 1,
        size: 9999,
      },
      total: 0,
      code: '',
      subnetNum: '',

      institutionName: '',
      ipRange: '',
      nowIpRange: '',

      detail: {},
      userAccess: {},

      online: '',
      showType: '',
      showOnline: '',

      type: '',
      mainLoading: false,
      ipInfoLoading: false,
      active: -1,

      ipItem: {},//点击后的ip详情

      osTypeList: []
    }
  },
  filters: {
    is802Filter(val) {
      if (val == '' || val == undefined || val == null) return ''
      else if (val == 0) return "不认证"
      else if (val == 1 || val == '802.1x') return "802.1x"
      else if (val == 2) return "MAC认证"
      else return ''
    },
    isAccessFilter(val) {
      if (val == '' || val == undefined || val == null) return ''
      else if (val == 0) return "未认证"
      else if (val == 1) return "已认证"
      else return ''
    },
    codeFilter(val) {
      if (val == '' || val == undefined || val == null) return ''
      else if (val == 0) return "停用"
      else if (val == 1) return "运行"
      else if (val == 2) return "禁用"
      else return ''
    },
    onlineFilter(val) {
      if (val == '' || val == undefined || val == null) return ''
      else if (val == 0) return "未使用"
      else if (val == 1) return "已使用"
      else if (val == 2) return "网关"
      else return ''
    },
    typeFilter(val) {
      if (val == '' || val == undefined || val == null) return ''
      else if (val == 1) return "普通地址"
      else if (val == 2) return "预留地址"
      else if (val == 3) return "禁用地址"
      else return ''
    },
  },
  computed: {
    ...mapGetters(["permission"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  mounted(){
    this.getCmdbDictList('1107951709650944')

  },
  methods: {
    getCmdbDictList(code){
      //加载cmdb字典
      let query = {}
      query.ciId = code||'1082372687986688'
      getDictCmdbList( query ).then(res => {
        if(code==='1107951709650944'){ // 操作系统类型
          this.osTypeList = res.data;
        }
      });
    },
    showDictLable(code,dictList){
      //字典回显
      if(dictList!=null && code!==''){
        let items = dictList.filter(item => item.dictKey==code);
        if(items!=null && items.length>0){
          return items[0].dictValue;
        }
      }
      return code;
    },


    requestLoadData() {
      if (!this.isFirst) {
        this.isFirst = true;
        this.setPageContentHeight('page_form', 'ip_info', false, 120)
        this.setPageContentHeight('page_form', 'tabCon', false, 60)
        this.getSubnet()
        this.getSubnetNameList()
      }
    },
    subnetNameChange(newVal) {
      // if (newVal && newVal != '') {
      //   this.handleSearch();
      // }
    },
    getSubnetNameList() { //获得子网数据
      this.selectForm = {
        subnetName: '',
        code: '',
        vlanId: '',
        subnetAddress: '',
        spName: '',
        institutionCode: '',
        id: '',
        current: 1,
        size: 9999,
      }
      subnetList(this.selectForm).then(res => {
        this.subnetNameList = res.data.records;
      })
    },
    getSubnet() { //获得子网列表数据
      subnetList(this.searchForm).then(res => {
        if (this.waitLoading) {
          this.waitLoading.close();
          this.waitLoading = null;
        }
        let val = res.data.records;
        if (val.length > 0) {
          let val1 = val[0]
          if (val1) {
            this.searchForm.subnetName = val1.subnetName
            this.code = val1.subnetMask
            this.subnetNum = val1.subnetNum
            this.institutionName = val1.institutionName || ''
            this.getIpSegmentList(val1.id)
          }
        }
      }).catch(err => {
        if (this.waitLoading) {
          this.waitLoading.close();
          this.waitLoading = null;
        }
      })
    },
    getIpSegmentList(subnet) { //获取子网段
      this.mainLoading = true
      ipPoolIdSegmentList({subnetId: subnet}).then(res => {
        this.mainLoading = false
        this.ipBox = res.data
        this.total = res.data.length

        this.getIpList(res.data, subnet)
      }).catch(err => {
        this.mainLoading = false
      })
    },

    getIpList(res, subnet) { //获得ip池内容
      let form = {
        ippoolSegment: res[0],
        subnet: subnet
      }
      this.mainLoading = true
      getQueryList(form).then(req => {
        let datas = req.data.saTIpPool

        this.mainLoading = false
        this.ipInfoLoading = true

        if (datas && datas.length > 0) {
          // 当前ip选项
          this.ipItem = {
            adress: datas[0]
          }

          // 根据返回子网段最后一个，获取ip地址池范围信息
          let form1 = {
            ippoolSegment: res[res.length - 1],
            subnet: subnet
          }
          getQueryList(form1).then(val => {
            this.ipRange = datas[0].ip + '-' + val.data.saTIpPool[val.data.saTIpPool.length - 1].ip
          })
          // 赋值当前地址池
          this.nowIpRange = datas[0].ip + " - " + datas[datas.length - 1].ip
          // 右侧基本信息等赋值
          for (let i = 0; i < datas.length; i++) {
            let item = datas[i]
            if (item.isUsed != 2) {
              this.getIpDetail(item.ipId)
              break
            }
          }
          this.getRange(datas)

        } else {
          this.ipInfoLoading = false
          this.detail = {}
          this.ipRange = undefined
          this.ippool = []
          this.nowIpRange = undefined
        }
      }).catch(err => {
        this.mainLoading = false
      })
    },


    getRange(val) { //获得地址池范围
      this.ippool = []
      // 选中当前ip地址
      for (let i = 0; i < val.length; i++) {
        if (val[i].isUsed != 2) {
          this.active = val[i].ip.split('.')[3] - 1
          break
        }
      }
      for (let i = 1; i <= 254; i++) {
        let obj = {
          ip: i,
          adress: {},
          style: ''
        }
        for (let j = 0; j < val.length; j++) {
          let item = val[j]
          let ip = item.ip.split('.')
          if (i == ip[3]) {
            obj.adress = item || {}
            if (item.isUsed == '0') {
              obj.style = 'is_range'
              if (item.online == '在线') {
                obj.style = 'is_range nouse_online'
              } else if (item.online == '离线') {
                obj.style = 'is_range'
              }
            } else if (item.isUsed == '1') {
              if (item.online == '在线') {
                obj.style = 'is_use'
              } else if (item.online == '离线') {
                obj.style = 'is_use offline'
              }
            } else if (item.isUsed == '2') {
              obj.style = 'wangguan'
            }
          }
        }
        this.ippool.push(obj)
      }
    },


    handleChange(val) { //页数改变时
      this.getIpList([this.ipBox[val - 1]])
      // this.mainLoading = true
      // let form = {
      //   subnet: this.subnet,
      //   ippoolSegment: this.ipBox[val-1]
      // }
      // this.currentIndex = val
      // getQueryList(form).then(res => {
      //   this.mainLoading = false
      //   this.active = -1;
      //   this.getRange(JSON.parse(decrypt(res.data.saTIpPool.toString())))
      // })
    },


    getIpDetail(val) { //获得ip详情
      getDetails({ippoolId: val}).then(req => {
        this.showOnline = false
        this.ipInfoLoading = false
        this.detail = req.data[0]
        this.detail.subnet = this.subnetNum
        this.detail.subnetMask = this.code
        this.type = this.detail.ipLevel
        this.online = this.detail.isUsed
        // 渲染运行状态的值
        // for(let i=0; i<this.basicStates.length; i++) {
        //   let item = this.basicStates[i]
        //   if(item.dictValue == this.detail.basicState) {
        //     this.detail.basicStateVal = item.dictLabel
        //   }
        // }
        this.showUserAccess()
      })
    },
    //表格双击事件
    showUserAccess() {
      fingUserAccessByIpAddress({ipAddress: this.detail.ip}).then(resp => {
        if (resp.code === 200) {
          if (resp.msg != null) {
            this.userAccess = resp.data
          } else {
            this.userAccess = {
              id: '',//id
              company: '',//公司
              companyName: '',//公司
              departmentid: '',//部门
              deptName: '',
              address: '',//地址
              phone: '',//联系电话
              deviceId: '',//设备类型
              sbbm: '',//设备编码
              subnetName: '',//所属子网
              ipAddress: '',//ip地址
              macAddress: '',//mac地址
              code: '',//状态
              allowDays: '',//允许入网时长
              fullUsername: '',//用户全名
              is802: '',//启用802.1x接入认证
              isAccess: '',//终端是否认证
              netInAppllyId: '',//入网申请工单id
              fillMan: '',//录入人
              fillTime: '',//填报时间
              acceptMan: '',//受理人
              acceptDate: '',//受理时间
              bmbm: '',//部门编码
              startTime: '',//入网开始时间
              approveuUser: '',//认证用户
              approveuPasswork: ''//认证密码
            }
          }
        }
      })
    },
    seeIpDetail(val, index) { //点击方格获得ip详情
      if (val.adress.isUsed == 2) {
        //点击了网关
        return
      }
      if (val.style) {
        this.ipInfoLoading = true
        this.ipItem = val
        this.active = index
        this.showType = false
        this.getIpDetail(val.adress.ipId)
      }
    },

    handleSearch() {
      this.waitLoading = Loading.service({
        text: '正在加载数据中，请稍后...',//加载文案
        lock: true,
        background: 'rgba(255,255,255,0.6)',//背景色
      });
      this.getSubnet()
      // this.getSubnetNameList()
    },
    handleReset() {
      this.searchForm = {
        current: 1,
        size: 9999,
      }
      this.handleSearch()
      this.$emit('resetClick')
    },
    handleAdd() {
      this.$router.push({
        path: '/detailRoute',
        query: {
          // id: row.id,
          componentName: 'subnetInfo',
          routerTitle: '新增',
          showType: 'add'
        }
      });
    },
    setOnline() { //设置使用情况
      this.showOnline = true
    },
    setUpType() { //设置IP等级
      this.showType = true
    },
    selectOnline(val) { //选择使用情况
      this.showOnline = false

      let params = {
        ipId: this.ipItem.adress.ipId,
        ip: this.ipItem.adress.ip,
        isUsed: val
      }
      setIsUsed(params).then(res => {
        if (res.data == 2) {
          this.$message.error("此IP已入网禁止修改!");
        } else {
          this.$message.success("设置成功")
        }
        this.mainLoading = true
        let form = {
          subnet: this.ipItem.adress.subnet,
          ippoolSegment: this.ipBox[this.searchForm.current - 1]
        }
        getQueryList(form).then(res => {
          this.mainLoading = false
          this.getRange(res.data.saTIpPool)
        })
      })
    },
    selectType(val) { //选择IP等级
      this.showType = false

      let params = {
        ids: [this.ipItem.adress.ipId],
        ipLevel: val
      }
      setIpLevel(params).then(res => {
        this.$message.success("设置成功")
        this.getIpDetail(this.ipItem.adress.ipId)
        this.mainLoading = true

        let form = {
          subnet: this.ipItem.adress.subnet,
          ippoolSegment: this.ipBox[this.searchForm.current - 1]
        }
        getQueryList(form).then(res => {
          this.mainLoading = false
          this.getRange(res.data.saTIpPool)
        })
      })
    },


    seeSwitchDateil() {
      this.isShowSwith = true
      this.getSwitchDetail()
    },
    getSwitchDetail() { //获得交换机详情
      this.switchList = []
      getRadiusIp(this.detail.ip).then(res => {


        if (res.code === 200) {
          if (res.data.num == 0) {
            this.$message.error('未找到当前终端对应端口')
          }

          this.switchDetailData = res.data

          if (res.data.port === undefined) {
            this.switchList = []
          } else if (res.data.port == 0) {
            let max = 0
            if (res.data.porstCount > 40) max = 40
            else max = res.data.porstCount
            for (let i = 0; i < max; i++) {
              let obj = {
                num: i + 1,
                state: 0,
              }
              this.switchList.push(obj)
            }
          } else {
            let minNum = Math.floor(res.data.port / 40) * 40 + 1

            for (let i = 0; i < 40; i++) {
              let obj = {
                num: minNum + i,
                state: 0,
              }
              this.switchList.push(obj)
            }
          }
        } else {

        }

      })
    },
  },

}
</script>
<style lang="scss" scoped>
aside {
  padding: 8px 10px
}

::v-deep .el-tree-node {
  width: 300px;
}

::v-deep .el-tree-node__expand-icon.is-leaf {
  width: 13px;
}

.el-col-8 {
  height: 30px;
}

.ippool {
  color: #606266;
  font-size: 14px
}

ul {
  list-style: none;
}

.content {
  display: flex;

}

.ip_info {
  width: 22%;
  height: 100%;
  overflow: auto;
}

.ip_box {
  flex: 1;
}

.ip_box ul {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0px;
  margin: 0px;
  justify-content: space-between
}

.ip_box ul li {
  width: 5.5%;
  text-align: center;
  /* border: 1px solid #00a9b8; */
  height: 3vh;
  line-height: 3vh;
  margin-bottom: 0.6%;
  margin-right: 0.5%;
  font-size: 0.8rem;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  // background: url('../../../assets/styles/按钮.png') no-repeat;
  background: #a1a1a1;
  background-size: 100% 100%;
  // overflow: hidden;
  /* border: 1px solid #606266 */
}

// .ip_box ul li >span{
//   display: block;
// }
.tip {
  text-align: center;
  font-size: 0.8rem;
  margin: 15px 0;
}

.tip span {
  display: inline-block;
  width: 14%;
  height: 1.3rem;
  line-height: 1.3rem;
  text-align: center
}

.tip span i {
  display: inline-block;
  width: 2rem;
  vertical-align: top;
  height: 90%;
  margin-right: 5px;
  border-radius: 3px;
}

.ip_box ul .is_use {
  // background: url('../../../assets/styles/按钮1.png') no-repeat;
  background: rgb(92, 219, 211);
  background-size: 100% 100%;
  color: #fff;
  border: none;
}

.ip_box ul .wangguan {
  // background: yellow;
  background: rgb(24, 144, 255);
  border: none;
}

.i_default {
  background: #82848a;
  border: none;
}

.online {
  color: #fff !important;
}

.offline {
  color: #606266 !important;
}

.ip_box ul .is_range {
  // background: url('../../../assets/styles/按钮2.png') no-repeat;
  background: rgb(105, 192, 255);
  color: #fff;
  border: none;
}

.nouse_online {
  color: red !important;
}

.ip_box ul .is_normel {
  // background: url('../../../assets/styles/按钮2.png') no-repeat;
  background: rgb(105, 192, 255);
  background-size: 100% 100%;
  color: #ff4040;
  font-weight: bold;
  border: none;
}

.form-page .el-col-6 {
  height: 40px;
}

.ip_info .el-row {
  border: 1px solid #dcdfe6;
  text-align: center;
  height: 2rem;
  line-height: 2rem
}

.ip_info .el-col {
  border-right: 1px solid #dcdfe6;
  height: 2rem;
  line-height: 2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}

.el-row .switch {
  cursor: pointer;
  color: #47aa9a
}

::v-deep .el-switch__label * {
  font-size: 0.4rem;
}

.switch_box {
  background: url('../../assets/workflow/switch.png');
  background-size: 100% 100%;
  min-height: 60vh;
  position: relative;
}

.postion_box {
  width: 50%;
  position: absolute;
  left: 31%;
  top: 50%
}

.switch_box ul {

  padding: 0;
  display: flex;
  height: 15vh;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
}

.switch_box ul li {
  display: flex;
  flex-direction: column;
  width: 4.2%;
  /* margin-right: 2%; */
  flex-direction: column-reverse;
  align-items: center;
  color: #fff;
  font-size: 12px
}

.switch_box ul li .item_back {
  width: 100%;
  height: 2.5vh;
  /* background: #000; */
}

.switch_box ul li .no_range {
  // background: url('../../../assets/styles/7.png') no-repeat;
  background-size: 100% 100%;
}

.switch_box ul li .is_range {
  // background: url('../../../assets/styles/无标题.png') no-repeat;
  background-size: 100% 100%;
}

.switch_box ul li .is_use {
  // background: url('../../../assets/styles/6.png') no-repeat;
  background-size: 100% 100%;
}

.btn2 {
  // background: url('../../../assets/styles/按钮2.png') no-repeat;
  background: rgb(105, 192, 255);
  background-size: 100% 100%;
}

.btn3 { // 已分配
  // background: url('../../../assets/styles/按钮1.png') no-repeat;
  background: rgb(92, 219, 211);
  background-size: 100% 100%;
}

.btn5 { // 异常
  background: rgb(181, 245, 236);
  background-size: 100% 100%;
}

.btn4 {
  // background: yellow;
  background: rgb(24, 144, 255);
}


.switch_tips {
  text-align: center
}

.switch_tips span {
  display: inline-block;
  margin: 0 1.5vw
}

.switch_tips span i {
  display: inline-block;
  width: 3vw;
  height: 2.8vh;
  /* background: #47aa9a; */
  vertical-align: text-bottom;
}


.arrow_box {
  color: #00ff00 !important;
}

// .arrow_box i{
//   border-color: #00ff00;
//   border: 1px solid rgb(0, 255, 0);
//   color: #00ff00!important;
//   animation: glow 1000ms ease-out infinite alternate;
// }
// @keyframes glow{
//   0% {
//     border-color: #393;
//     box-shadow: 0 0 5px rgba(255,2,0,.2), inset 0 0 5px rgba(255,2,0,.1), 0 0px 0 #393
//   }
//   100% {
//     border-color: 393;
//     box-shadow: 0 0 20px rgb(0, 255, 0), inset 0 0 10px rgba(0, 255, 0,.4), 0 0px 0  #393
//   }
// }

.active_class {
  display: block;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  border-radius: 5px;
  box-shadow: 1px 1px 10px black;
}

.zero_class {
  display: block;
  border-bottom: 1px solid red;
  border-right: 1px solid red;
  border-radius: 5px;
  box-shadow: 1px 1px 10px red;
}
</style>
