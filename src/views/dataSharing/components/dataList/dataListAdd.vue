<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <formTitle :titleText="'数据共享服务清单信息'" :titleType="'page_title'"></formTitle>
      <el-scrollbar style="height:calc(100% - 70px - 48px);">
        <el-form :model="form"
                 ref="dataForm"
                 :rules="rules"
                 :disabled="isInfo"
                 class="xt_form" label-width="120px">
          
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="接口名称" prop="port" size="small">
                <el-input v-model="form.port" placeholder="请输入接口名称" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="接口类型" prop="portType" size="small">
                <el-input v-model="form.portType" placeholder="请输入接口类型" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="	接口地址" prop="portAddress" size="small">
                <el-input v-model="form.portAddress" placeholder="请输入接口地址" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="6">
              <el-form-item label="接口状态" prop="status">
                <el-select v-model="form.status" placeholder="请选择接口状态" clearable>
                  <el-option v-for="dict in statusList" :key="dict.dictKey" :label="dict.dictValue"
                             :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="6">
            <el-col :span="12">
              <el-form-item label="业务描述" prop="remake" size="small">
                <el-input v-model="form.remake" placeholder="请输入业务描述" clearable maxlength="200" type="textarea" rows="4"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
      <!-- 底部按钮 -->
      <div class="form-btn">
        <el-button type="primary" v-if="!isInfo" size="small" @click="handleSaveOK">{{ id ? '修 改':'新 增' }}
        </el-button>
        <el-button class="border-btn" size="small" @click="handleReset" style="margin-left: 50px;">返 回</el-button>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {getDetail, save, portUpdate, getUserType, getUserList} from "@/api/dataSharing/dataList";
import {getDictList, getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import {mapGetters} from "vuex";
import uploadImg from "@/views/operation/components/devReturned/uploadImg.vue";
import {cardid, isvalidatemobile,} from "@/util/validate";
import {getUserDetail} from "@/api/user";
import {getWareDictList} from "@/api/device/warehouse";
import {dateFormat} from "@/util/date";
import Vue from "vue";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import deviceSelect from "./deviceSelect.vue";

export default {
  components: {xtTreeLzaySelect, uploadImg, deviceSelect},
  data() {
    // eslint-disable-next-line no-unused-vars
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]));
      } else {
        callback();
      }
    };
    return {
      isInfo: this.$route.query.isInfo,
      statusList: [
        {
          dictKey: 1,
          dictValue: '正常'
        },
        {
          dictKey: 0,
          dictValue: '停用'
        },
      ],

      receiveDutyPersonNameList: [],

      tradeList: [],

      deviceCategoryDis: false,

      receiveDutyPhoneDis: true,
      receiveDutyIscAccountDis: true,
      id: '',
      wbsProject: '',
      wbsElement: '',
      deviceCode: '',
      temporaryTimes: null,
      form: {
        port: undefined,
        portType: undefined,
        portAddress: undefined,
        status: undefined,
        remake: undefined,
      },
      loading: false,
      isEdit: true,
      deviceAddTypeList: [],
      deviceChangeTypeList: [],
      useKeepDeptList: [],
      
      deviceWBSList: [],
      deviceChangeList: [],
      deviceCategoryList: [],
      deviceTypeList: [],
      selectionList: [],
      networkTypeList: [],
      brandList: [],
      seriesList: [],
      deviceModelList: [],
      funLocationList: [],
      maintenanceFactoryList: [],
      deviceList: [],
      receiveUnit: '',
      receiveUnitList: [],
      receiveDutyDeptList: [],
      receiveDutyGroupList: [],
      warehouseList: [],
      deviceSourceList: [],
      fileList: [],
   
      rules: {
        port: [
          {required: true, message: "请输入接口名称", trigger: "blur"}
        ],
        portType: [
          {required: true, message: "请输入接口类型", trigger: "blur"}
        ],
        portAddress: [
          {required: true, message: "请输入接口地址", trigger: "blur"}
        ],
        status: [
          {required: true, message: "请选择接口状态", trigger: "change"}
        ],
        remake: [
          {required: true, message: "请输入业务描述", trigger: "blur"}
        ],
      },

      temporaryTimesOptions: {
        disabledDate: (time)=>{
          return time.getTime() < Date.now() - 8.64e7
        }
      },
    };
  },
  computed: {
    ...mapGetters(["permission", "userInfo", "userDetail"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.deviceapply_add, false),
        viewBtn: this.vaildData(this.permission.deviceapply_view, false),
        delBtn: this.vaildData(this.permission.deviceapply_delete, false),
        editBtn: this.vaildData(this.permission.deviceapply_edit, false),
        exportBtn: this.vaildData(this.permission.deviceapply_export, false)
      };
    },
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
    // //加载字典--工单状态
    // this.getDictList("applyStatus");
    // //加载字典--设备分类
    // //this.getDictList("deviceCategory");
    // this.getCmdbDictList("1097745625841664");
    // //加载字典--网络类型
    // // this.getDictList("networkType");
    // this.getCmdbDictList("1107942968721408");

    // //加载字典--设备来源
    // this.getDictList("deviceSource");

    this.id = null;
    //获取参数 判断是否是新增还是修改
    const params = this.$route.query
    this.id = params.id;
    if (params.id) {
      this.id = params.id;
      this.loadDetail({id: params.id});
      this.isEdit = true
    } else {
      //加载空数据
      this.isEdit = true
    }
  },
  methods: {
    getDictList(code) {
      getDictList(code).then(res => {
        if (code === 'deviceStatus') {
          this.deviceStatusList = res.data;
        } else if (code === 'wbsElt') {
          this.deviceWBSList = res.data;
        } else if (code === 'erpState') {
          this.deviceErpStatusList = res.data;
        } else if (code === 'deviceCategory') {
          this.deviceCategoryList = res.data;
        } else if (code === 'deviceType') {
          this.deviceTypeList = res.data;
          this.deviceTypeListAll = res.data;
        } else if (code === 'deviceAddType') {
          this.deviceAddTypeList = res.data;
        } else if (code === 'deviceChangeType') {
          this.deviceChangeTypeList = res.data;
        } else if (code === 'brand') {
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
        } else if (code === 'deviceSource') {
          this.deviceSourceList = res.data;
        }
      });
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
        } else if (code === '1082607703228416') {
          this.deviceWBSList = res.data;
        } else if (code === '1097745625841664') {
          this.deviceCategoryList = res.data;
        } else if (code === '1097745969774592') {
          this.deviceTypeList = res.data;
          this.deviceTypeListAll = res.data;
        } else if (code === '1107942968721408') { // 所属网络
          this.networkTypeList = res.data;
        }
      });
    },
    getDictCmdbListPid(ciId, pid) {
      getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
        if (ciId === '1097745969774592') { // 设备类型
          this.deviceTypeList = res.data;
        }
      });
    },
    validateUserPhone(phone) {
      let isPhone = /^1\d{10}$/;
      let isTel = /\d{2-5}-?\d{4,8}$/;
      let isShtTel = /\d{4,9}$/;
      let msg = '';
      //常用号码95 812 加4位短号  手机号  普通固化
      if (!isPhone.test(phone) && !isTel.test(phone) && !isShtTel.test(phone)) {
        msg = phone + '号码格式不正确';
        this.$message({
          type: "success",
          message: msg
        });
        return false;
      }
      return true;
    },
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection.map(item => item.id);
    },

    async handleSaveOK() {
      this.$refs.dataForm.validate(async valid => {        
        if (valid) {
          if( this.id ){ // 修改
            portUpdate(this.form).then(() => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.handleReset();
            }, error => {
            });
          }else{ // 新增
            save(this.form).then(() => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.handleReset();
            }, error => {
            });
          }
          

        }else{
          this.$message.warning('请将必填信息填写完整！')
        }
      })
    },
    handleSave() {
      this.$refs.dataForm.validate(valid => {
        if(this.form.oldToNew === "0"){ //是以旧换新
          this.tradeList.forEach(el=>{
            // 请将新设备使用信息填写完整！
            if (valid && el.userCard) {
              let resCard = cardid(el.userCard);
              if (resCard[0]) {
                this.$message({
                  type: "warning",
                  message: "身份证号异常：" + el.userCard
                });
                valid = false;
              }
              if(!el.userType && el.userType !== 0){
                this.$message({
                  type: "warning",
                  message: "使用类型不能为空！"
                });
                valid = false;  
              }
              
            }
          })

          if( !valid ){
            return
          }
          
        }

        if(this.form.oldToNew === "1"){

          //验证手机号
          this.deviceList.forEach(device => {
            if (valid && !this.validateUserPhone(device.userPhone)) {
              valid = false;
              
            }
            if (valid && device.userCard) {
              let resCard = cardid(device.userCard);
              if (resCard[0]) {
                this.$message({
                  type: "warning",
                  message: "身份证号异常：" + device.userCard
                });
                valid = false;
                
              }
            }
            if (valid && !device.address) {
              this.$message({
                type: "warning",
                message: "安装地点不能为空！"
              });
              valid = false;
              
            }
          })

          if( !valid ){
            return
          }
        }

        if (valid) {
          this.form.status = null;

          if( this.form.oldToNew === '0' ){ // 选中以旧换新时
            this.form.deviceApplyDetailDTOList = this.tradeList || [];
          }else{
            this.form.deviceApplyDetailDTOList = this.deviceList || [];
          }
          
          // this.form.deviceOrderFileDTOList = this.fileList||[];
          // this.form.deviceOrderFileDTOList.forEach(i => {i.status = null })
          this.form.deviceApplyDetailVOList = []
          this.form.deviceOrderFileVOList = []
          this.form.outboundNo = null;
          this.form.operationNo = null;
          Vue.delete(this.form, "outboundNo")
          Vue.delete(this.form, "operationNo")
          //暂存
          save(this.form).then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.handleReset();
          }, error => {
          });
        }else{
          this.$message.warning('请将必填信息填写完整！')
        }
      })
    },
    handleReset() {
      //返回
      this.$closePage('/dataSharing/dataList')
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
   
    loadDetail(params) {
      //获取信息
      getDetail(params).then(res => { 
        this.form = res.data;
      });
    },
    
    deviceExport() {
      //导出
      let param = {}
      this.download(
        "/api/idevelop-device/device/apply/export",
        param,
        "申请设备清单.xlsx"
      )
    },
    hanleInput(value) {
      const reg = /^[1-9]\d*$/;
      if (!reg.test(value)) {
        this.form.applyNum = this.form.applyNum.substring(0, this.form.applyNum.length - 1)
      }
    },
    applyNumChange() {
      //调整设备数量
      if (this.form.applyNum < 0) {
        this.form.applyNum = 0;
      }
      if (this.form.applyNum > 99) {
        this.$message({
          message: "单次申请数量限制99以内,请重新输入！",
          type: "error"
        });
        this.form.applyNum = 99;
      }
      if (this.form.applyNum > this.deviceList.length) {
        //追加
        let i = this.deviceList.length;
        for (; this.form.applyNum > this.deviceList.length;) {
          this.deviceList.push({
            isEdit: true,
            userName: '',
            userPhone: '',
            userCard: '',
            address: '',
            userType: 1,
            userCardEdit: true,
            remark: '',
          })
          i = i + 1;
        }
      }
      if (this.form.applyNum < this.deviceList.length) {
        //移除底部
        let i = this.deviceList.length;
        for (; this.form.applyNum < this.deviceList.length;) {
          this.deviceList.pop()
          i = i - 1;
        }
      }
      this.deviceList.push({})
      this.deviceList.pop()
    },
    handleDelete(idx) {
      //删除
      this.deviceList.splice(idx, 1)
      this.form.applyNum = this.deviceList.length
    },
    getAttachId(attachId) {
      this.form.attachId = attachId
    },
  
    userTypeChange(userType, index) {
      //子表领用类型
      if (userType === '0' || userType === 0) {
        this.deviceList[index].userCardEdit = false;
        this.deviceList[index].userCard = null;
      } else {
        this.deviceList[index].userCardEdit = true;
        this.deviceList[index].userCard = null;
      }
    },
    dataPickerChange(temporaryTimes) {
      //时间段选择
      if (temporaryTimes != null && temporaryTimes.length > 0) {
        this.form.temporaryStartTime = temporaryTimes[0]//临时使用结束时间
        this.form.temporaryEndTime = temporaryTimes[1]//临时使用开始时间
      } else {
        this.form.temporaryStartTime = null
        this.form.temporaryEndTime = null
      }
    },
    temporaryTypeRadio() {
      //临时使用结束时间
      if (!this.form.temporaryType) {
        this.form.temporaryStartTime = null
        this.form.temporaryEndTime = null
      }
    },
  }
};
</script>
<style lang="scss" scoped>
::v-deep .vaa  .el-form-item__label:before{
  display: none;
  // content: '' !important;
  // color: blue !important;
}
::v-deep .formTime{
  width: 100%;
  margin-top: 4px;

  .el-icon-date{
    margin-top: -7px;
  }
}
.formLabel {
  line-height: 16px;
  display: block;
}
.formLabelReq:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
}
</style>
