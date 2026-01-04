<template>
  <div>
    <el-dialog :close-on-click-modal="false"
               :before-close="() => $emit('close')"
               :show-close="true"
               append-to-body
               :visible.sync="isShow"
               :title="configId == null || configId === ''?'新增':'编辑'"
               width="1200px"
               top="10vh"
               v-el-drag-dialog>
      <div v-loading="pageLoading" class="d_ph">
        <el-form
          v-if="formDetial"
          ref="submitForm"
          :model="formDetial"
          label-width="180px"
          label-position="center"
          label-suffix=":"
          size="small"
          :rules="rules"
          class="el_fp">
          <el-collapse v-model="activeName">
            <div v-for="(item,index) in tabsList" :key="item">
              <el-collapse-item
                                v-if="item.pros&&item.pros.length>0"
                                :title="`${item.groupName}（${getFilterLength(item.pros)}项）`"
                                :name="item.groupName"
                                :class="item.pros.some(el=>editParams.colName && (el.name == editParams.colName || el.nameForCode == editParams.colName)) ? 'biaotiaaaa':''">
                <div v-if="item.pros&&item.pros.length>0">
                  <el-row :gutter="12">
                    <!-- :class=" itemJ.name == this.formDeatil ? 'hhhBiao':'' " -->
                    <div v-for="(itemJ,indexJ) in item.pros" :key="itemJ">
                    <el-col v-if="getFilter(itemJ)"
                            :class=" editParams.colName && (itemJ.name == editParams.colName || itemJ.nameForCode == editParams.colName) ? 'hhhBiao':'' "
                            :span="12">
                      <el-form-item v-if="itemJ.type === 'wbs'" :label="itemJ.label" :required="itemJ.isRequired"
                                    :prop="itemJ.name">
                        <wbsSelect type="wbsElement"
                                  placeholder="请选择WBS元素"
                                  v-model="formDetial.wbsElement"
                                  @change="wbsChange"></wbsSelect>
                      </el-form-item>
                      <el-form-item v-else-if="itemJ.type === 'CORP' || itemJ.type === 'DEPT' || itemJ.type === 'GROUP'"
                                    :label="itemJ.label"
                                    :rules="rules[itemJ.name]"
                                    :prop="itemJ.name">
                        <xt-tree-lzay-select :select-type=itemJ.type
                                            :disabled="itemJ.disabled"
                                            :is-user-unit="true"
                                            :placeholder="`请选择${itemJ.label}`"
                                            :form-value="formDetial[itemJ.name]"
                                            :unitId="itemJ.dwcode?formDetial[itemJ.dwcode]:null"
                                            :deptId="itemJ.bmcode?formDetial[itemJ.bmcode]:null"
                                            @getTreeItem="(v)=>{getOwnerUnit(v,itemJ)}">

                        </xt-tree-lzay-select>
                      </el-form-item>
                      <component
                        v-else
                        :key="indexJ"
                        :is="itemJ.type + 'Formitem'"
                        :configData="itemJ"
                        :formValue="formDetial"
                        :disabled="itemJ.allowEdit == 0"
                        :tspms="tspms"
                        :rules="rules[itemJ.name]"
                        @selectChange="selectChange"
                        @escapeCode="escapeCode"
                        @vsChange="vsChange"
                        @selectListEvent="initArrs"></component>

                    </el-col>
                    </div>
                  </el-row>
                </div>

              </el-collapse-item>
            </div>
          </el-collapse>
        </el-form>

        <div class="submit_btn" v-if="formDetial">
          <el-button type="primary" plain size="mini" @click="submit('sfwczl')" class="e_sfwczl" v-if="showSfzl()">完成治理</el-button>
          <el-button :loading="saveLoading" type="primary" size="mini" @click="submit('edit')">
            {{ isEmpty(configId) ? '新 增' : isEmpty(editParams.colName) ? '保 存' : '完成处置' }}
          </el-button>
          <el-button size="small" @click="$emit('close')">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import textFormitem from "@/components/xtform/config/textFormitem"
import numberFormitem from "@/components/xtform/config/numberFormitem"
import enumFormitem from "@/components/xtform/config/enumFormitem"
import datetimeFormitem from "@/components/xtform/config/datetimeFormitem"
import textareaFormitem from "@/components/xtform/config/textareaFormitem"
import selectFormitem from "@/components/xtform/config/selectFormitem"
import timeFormitem from "@/components/xtform/config/timeFormitem"
import dateFormitem from "@/components/xtform/config/dateFormitem"
import datetimerangeFormitem from "@/components/xtform/config/datetimerangeFormitem"
import wbsSelect from "@/components/wbsSelect/index.vue"
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";


import {attrrelAdd, attrrelUpdate} from "@/api/cmdb/ciConfig"
import {cmdbDataCheck, getInfoByErp, getInfoByIP} from "@/api/assets/devStandingBook";
import {cilistattr} from "@/api/system/ciModel"
import {getFullName} from "@/api/assets/devStandingBook";
import {getPropsItems} from "./data/pmsCustom";

import {mapGetters} from "vuex";
import {remove} from "@/api/tool/datasource";
import {Message} from "element-ui";


export default {
  props: ['isShow', "configId", "ciId", 'editParams'],
  components: {
    textFormitem,
    numberFormitem,
    enumFormitem,
    datetimeFormitem,
    textareaFormitem,
    selectFormitem,
    timeFormitem,
    dateFormitem,
    datetimerangeFormitem,
    wbsSelect,
    xtTreeLzaySelect
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  watch: {
    //设备来源
    'formDetial.deviceSourceCode'(newVal, oldVal) {
      this.btzdChange('deviceSourceCode', newVal);
    },
    //ERP转资状态为"转资失败"时，原因必填
    'formDetial.erpTransferStatus'(newVal, oldVal) {
      this.btzdChange('erpTransferStatus', newVal);
    },
    'formDetial.deviceStatusCode'(newVal, oldVal) {
      this.btzdChange('deviceStatusCode', newVal);
    },
    //是否安全加固为是时，以下字段必填
    'formDetial.isSecurityReinforce'(newVal, oldVal) {
      this.btzdChange('isSecurityReinforce', newVal);
    },
    //设备类型下拉框改变，以下字段必填
    'formDetial.deviceTypeCode'(newVal, oldVal) {
      this.btzdChange('deviceTypeCode', newVal);
    },
    //所属网络下拉框改变，以下字段必填
    'formDetial.netWorkCode'(newVal, oldVal) {
      if (!this.isEmpty(this.formDetial['deviceStatusCode'])) {
        this.btzdChange('deviceStatusCode', this.formDetial['deviceStatusCode']);
      }
    },
  },
  data() {
    return {
      activeName: [],
      pageLoading: false,
      saveLoading: false,
      rules: {},

      tabsList: null,
      devDetial: {},
      formDetial: null,
      tspms: ['procureTypeCode', 'computerRoomCode', 'deviceCategoryCode', 'deviceTypeCode', 'makerCode', 'brandCode', 'seriesCode', 'deviceModelCode'],//特殊联动字段，需要俩都传的

      //设备分类、设备类型变动时做判断用，保存时接口isCategoryType字段用
      categoryType: {
        deviceCategoryCodeFirst: null,
        deviceCategoryCodeLast: null,
        deviceTypeCodeFirst: null,
        deviceTypeCodeLast: null,
      },

      dicts: {},//所有下拉框选项字典(备用)
      sfzlDis: false,//是否完成数据治理是否可用
      //设备及编码
      deviceData: [
        {name: '主机设备', code: 'SG_CMHD'},
        {name: '安全设备', code: 'SG_CMFD'},
        {name: '存储设备', code: 'SG_CMSD'},
        {name: '基础设施', code: 'SG_JCSS'},
        {name: '辅助设备', code: 'SG_CMAD'},
        {name: '网络设备', code: 'SG_CMND'},
        {name: '终端设备', code: 'SG_CMTD'},
        {name: '办公设备', code: 'SG_CMOD'},
      ],
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    //是否显示 是否治理按钮
    showSfzl() {
      //this.editParams.colName != null表示从异动 警告页面进去, 否则标记或新增
      //this.configId !=null 表示从编辑进去
      if (!this.editParams.colName && !this.isEmpty(this.configId)) {
        //编辑
        return true;
      } else {
        //新增、异动告警进去
        return false
      }
    },
    initData() {
      this.devDetial = this.editParams.devDetail;
      //console.log('this.devDetial',this.devDetial)
      this.initForm()
    },
    //下拉联动时候判断
    vsChange(arg) {
      // if (arg.vis) {
      //   if (this.tspms && this.tspms.find(a => a === arg.name)) {
      //     if (!arg.arrs || arg.arrs.length == 0) {
      //       if (arg.name === 'seriesCode') {
      //         this.$message.info('请先选择品牌');
      //       } else if (arg.name === 'deviceModelCode') {
      //         this.$message.info('请先选择系列');
      //       } else if (arg.name === 'deviceTypeCode') {
      //         this.$message.info('请先选择设备分类');
      //       }
      //     }
      //   }
      // }
    },
    //首次进去编辑页面需要处理code、name相关值，因为详情中给的code和name都是汉字，包括联动值处理
    escapeCode(pms) {
      this.dicts[pms.configData.name] = pms.arrs;
      //所有带下拉框的都需要转义
      if (pms && pms.arrs && pms.configData) {
        let codeValue = this.formDetial[pms.configData.name];
        if (!codeValue) {
          return;
        }
        let item = null;
        if (pms.arrs.find(a => a.id == codeValue) != null) {
          item = pms.arrs.find(a => a.id == codeValue);
        } else if (pms.arrs.find(a => a.name == codeValue) != null) {
          item = pms.arrs.find(a => a.name == codeValue);
        }
        if (item) {
          //重新赋值
          this.formDetial[pms.configData.name] = item.id;
          if (pms.configData.nameForCode) {
            this.formDetial[pms.configData.nameForCode] = item.name;
          }


          //特殊字段
          let tm = this.tspms.find(a => a === pms.configData.name)
          if (tm) {
            //联动判断
            //联动判断
            if (tm === 'makerCode') {
              //加载完制造商，加载品牌
              for (let i = 0; i < this.tabsList.length; i++) {
                for (let j = 0; j < this.tabsList[i].pros.length; j++) {
                  //品牌
                  if (this.tabsList[i].pros[j].name === "brandCode") {
                    this.tabsList[i].pros[j].pid = item.id;
                    this.tabsList[i].pros[j].allowEdit = 1;
                  }
                }
              }
            } else if (tm === 'brandCode') {
              //加载完品牌，加载系列
              for (let i = 0; i < this.tabsList.length; i++) {
                for (let j = 0; j < this.tabsList[i].pros.length; j++) {
                  //系列
                  if (this.tabsList[i].pros[j].name === "seriesCode") {
                    this.tabsList[i].pros[j].pid = item.id;
                    this.tabsList[i].pros[j].allowEdit = 1;
                  }
                }
              }
            } else if (tm === 'seriesCode') {
              //加载完系列，加载型号
              for (let i = 0; i < this.tabsList.length; i++) {
                for (let j = 0; j < this.tabsList[i].pros.length; j++) {
                  //型号
                  if (this.tabsList[i].pros[j].name === "deviceModelCode") {
                    this.tabsList[i].pros[j].pid = item.id;
                    this.tabsList[i].pros[j].allowEdit = 1;
                  }
                }
              }
            } else if (tm === 'deviceCategoryCode') {
              if (this.categoryType.deviceCategoryCodeFirst == null) {
                this.categoryType.deviceCategoryCodeFirst = item.id;//当设备分类变动时候提交
              }

              this.categoryType.deviceCategoryCodeLast = item.id;

              //加载设备类型
              for (let i = 0; i < this.tabsList.length; i++) {
                for (let j = 0; j < this.tabsList[i].pros.length; j++) {
                  //型号
                  if (this.tabsList[i].pros[j].name === "deviceTypeCode") {
                    this.tabsList[i].pros[j].pid = item.id;
                  }
                }
              }
            } else if (tm === 'deviceTypeCode') {
              if (this.categoryType.deviceTypeCodeFirst == null) {
                this.categoryType.deviceTypeCodeFirst = item.id;//当设备分类变动时候提交
              }
              this.categoryType.deviceTypeCodeLast = item.id;
            } else if (tm === 'computerRoomCode') {
              for (let i = 0; i < this.tabsList.length; i++) {
                for (let j = 0; j < this.tabsList[i].pros.length; j++) {
                  //机柜
                  if (this.tabsList[i].pros[j].name === "cabinetCode") {
                    this.tabsList[i].pros[j].cans.roomId = item.id;
                    this.tabsList[i].pros[j].allowEdit = 1;
                  }
                }
              }
            } else if (tm === 'procureTypeCode') {
              //采购方式
              //设备来源为非统一纳管 采购方式只能选择单位自购
              if (this.devDetial['deviceSourceCode'] == this.$store.state.common.govern.sourceFtyng && item.id == this.$store.state.common.govern.procureTypeGwcj) {
                this.formDetial['procureType'] = null;
                this.formDetial['procureTypeCode'] = null;
              }

              for (let i = 0; i < this.tabsList.length; i++) {
                for (let j = 0; j < this.tabsList[i].pros.length; j++) {
                  let itemJ = this.tabsList[i].pros[j];
                  if (itemJ.name === "procureTypeCode") {
                    itemJ.pid = this.devDetial['deviceSourceCode'];
                  }
                }
              }
            }
          }
        } else {
          //特殊字段
          let tm = this.tspms.find(a => a === pms.configData.name)
          if (tm) {
            //联动判断
            if (tm === 'makerCode') {
              //加载完制造商，加载品牌
              for (let i = 0; i < this.tabsList.length; i++) {
                for (let j = 0; j < this.tabsList[i].pros.length; j++) {
                  //品牌
                  if (this.tabsList[i].pros[j].name === "brandCode") {
                    this.tabsList[i].pros[j].pid = '-1';
                    this.tabsList[i].pros[j].allowEdit = 1;
                  }
                }
              }
            } else if (tm === 'brandCode') {
              //加载完品牌，加载系列
              for (let i = 0; i < this.tabsList.length; i++) {
                for (let j = 0; j < this.tabsList[i].pros.length; j++) {
                  //系列
                  if (this.tabsList[i].pros[j].name === "seriesCode") {
                    this.tabsList[i].pros[j].pid = '-1';
                    this.tabsList[i].pros[j].allowEdit = 1;
                  }
                }
              }
            } else if (tm === 'seriesCode') {
              //加载完系列，加载型号
              for (let i = 0; i < this.tabsList.length; i++) {
                for (let j = 0; j < this.tabsList[i].pros.length; j++) {
                  //型号
                  if (this.tabsList[i].pros[j].name === "deviceModelCode") {
                    this.tabsList[i].pros[j].pid = '-1';
                    this.tabsList[i].pros[j].allowEdit = 1;
                  }
                }
              }
            } else if (tm === 'deviceCategoryCode') {
              if (this.categoryType.deviceCategoryCodeFirst == null) {
                this.categoryType.deviceCategoryCodeFirst = item.id;//当设备分类变动时候提交
              }

              this.categoryType.deviceCategoryCodeLast = item.id;

              //加载设备类型
              for (let i = 0; i < this.tabsList.length; i++) {
                for (let j = 0; j < this.tabsList[i].pros.length; j++) {
                  //型号
                  if (this.tabsList[i].pros[j].name === "deviceTypeCode") {
                    this.tabsList[i].pros[j].pid = '-1';
                  }
                }
              }
            }
          }
        }
      }
    },
    //编辑中所有下拉框值下拉变动时触发
    selectChange(args) {
      if (args.name == 'deviceCategoryCode') {
        //设备分类
        setTimeout(() => {
          //设备分类改变，弹窗进行提醒是否需要重新加载字段
          this.$confirm('设备分类改变需要重新加载该分类下的属性，是否重新加载？', '温馨提示', {
            confirmButtonText: "是",
            cancelButtonText: "否",
            type: "warning"
          }).then(t => {
            this.formDetial['deviceCategory'] = args.piName;
            for (let i = 0; i < this.tabsList.length; i++) {
              for (let j = 0; j < this.tabsList[i].pros.length; j++) {
                let itemJ = this.tabsList[i].pros[j];
                //联动加载分类下类型
                if (itemJ.name === 'deviceTypeCode') {
                  itemJ.pid = args.pid;

                  this.formDetial['deviceTypeCode'] = null;
                  this.formDetial['deviceType'] = null;
                }
              }
            }

            let dds = this.deviceData;
            let fItem = dds.find(a => a.name === this.formDetial['deviceCategory']);
            if (fItem) {
              this.editParams.ciName = fItem.code;
              this.editParams.devDetail.deviceCategory = fItem.name;
              this.editParams.devDetail.deviceCategoryCode = fItem.name;

              this.editParams.devDetail.deviceType = null;
              this.editParams.devDetail.deviceTypeCode = null;
              this.initData();
            }
          }).catch(cancel => {
            this.formDetial['deviceCategoryCode'] = this.categoryType.deviceCategoryCodeLast;
          });
        }, 300);
      } else if (args.name == 'deviceTypeCode') {
        //设备类型 改变
        this.formDetial['deviceType'] = args.piName;
      } else if (args.name == 'makerCode') {
        //选中制造商 联动品牌
        for (let i = 0; i < this.tabsList.length; i++) {
          for (let j = 0; j < this.tabsList[i].pros.length; j++) {
            let itemJ = this.tabsList[i].pros[j];
            //制造商
            if (itemJ.name === "makerCode") {
              this.formDetial['maker'] = args.piName;
            }

            //品牌 系列 型号
            if (itemJ.name === 'brandCode' || itemJ.name === 'seriesCode' || itemJ.name === 'deviceModelCode') {
              // 品牌
              if (itemJ.name === 'brandCode') {
                itemJ.pid = args.pid;
                itemJ.allowEdit = !this.isEmpty(args.pid) ? 1 : 0;
              } else {
                itemJ.pid = null;
                itemJ.allowEdit = 0;
              }

              this.formDetial['brandCode'] = null;
              this.formDetial['brand'] = null;

              this.formDetial['seriesCode'] = null;
              this.formDetial['series'] = null;

              this.formDetial['deviceModelCode'] = null;
              this.formDetial['deviceModel'] = null;
            }
          }
        }
      } else if (args.name == 'brandCode') {
        //选中品牌 联动系列
        for (let i = 0; i < this.tabsList.length; i++) {
          for (let j = 0; j < this.tabsList[i].pros.length; j++) {
            let itemJ = this.tabsList[i].pros[j];
            //品牌
            if (itemJ.name === "brandCode") {
              this.formDetial['brand'] = args.piName;
            }

            //系列 型号
            if (itemJ.name === 'seriesCode' || itemJ.name === 'deviceModelCode') {
              if (itemJ.name === 'seriesCode') {
                itemJ.pid = args.pid;
                itemJ.allowEdit = !this.isEmpty(args.pid) ? 1 : 0;
              } else {
                itemJ.pid = null;
                itemJ.allowEdit = 0;
              }

              this.formDetial['seriesCode'] = null;
              this.formDetial['series'] = null;

              this.formDetial['deviceModelCode'] = null;
              this.formDetial['deviceModel'] = null;
            }
          }
        }
      } else if (args.name == 'seriesCode') {
        //选中系列 联动型号
        for (let i = 0; i < this.tabsList.length; i++) {
          for (let j = 0; j < this.tabsList[i].pros.length; j++) {
            let itemJ = this.tabsList[i].pros[j];
            //系列
            if (itemJ.name === "seriesCode") {
              this.formDetial['series'] = args.piName;
            }

            //型号
            if (itemJ.name === 'deviceModelCode') {
              itemJ.pid = args.pid;
              itemJ.allowEdit = !this.isEmpty(args.pid) ? 1 : 0;
              this.formDetial['deviceModelCode'] = null;
              this.formDetial['deviceModel'] = null;
            }
          }
        }
      } else if (args.name == 'deviceModelCode') {
        //选中系列 联动型号
        for (let i = 0; i < this.tabsList.length; i++) {
          for (let j = 0; j < this.tabsList[i].pros.length; j++) {
            //系列
            if (this.tabsList[i].pros[j].name === "deviceModelCode") {
              this.formDetial['deviceModel'] = args.piName;
            }
          }
        }
      } else if (args.name == 'computerRoomCode') {
        //机房
        for (let i = 0; i < this.tabsList.length; i++) {
          for (let j = 0; j < this.tabsList[i].pros.length; j++) {
            let itemJ = this.tabsList[i].pros[j];
            if (itemJ.name === "computerRoomCode") {
              this.formDetial['computerRoom'] = args.piName;
            }

            //加载机柜
            if (itemJ.name === "cabinetCode") {
              itemJ.cans.roomId = args.pid;
              itemJ.allowEdit = !this.isEmpty(args.pid) ? 1 : 0;

              this.formDetial['cabinetCode'] = null;
              this.formDetial['cabinet'] = null;
            }
          }
        }
      } else if (args.name == 'cabinetCode') {
        this.formDetial['cabinet'] = args.piName;
      } else {
        if (args.name === "inWarehouseCode") {
          //所在仓库
          if (args.obj) {
            //所在位置赋值
            this.formDetial['warehouseLocation'] = args.obj.address;
          } else {
            this.formDetial['warehouseLocation'] = '';
          }
        }
        if (args.name == 'deviceSourceCode') {
          // //设备来源改变 清空标准全称
          // this.formDetial['fullName'] = null;

          if (args.pid == this.$store.state.common.govern.sourceFtyng && this.formDetial['procureTypeCode'] == this.$store.state.common.govern.procureTypeGwcj) {
            this.formDetial['procureType'] = null;
            this.formDetial['procureTypeCode'] = null;
          }

          for (let i = 0; i < this.tabsList.length; i++) {
            for (let j = 0; j < this.tabsList[i].pros.length; j++) {
              let itemJ = this.tabsList[i].pros[j];
              if (itemJ.name === "procureTypeCode") {
                itemJ.pid = args.pid;
              }
            }
          }
        }
        if (args.nameForCode) {
          this.formDetial[args.nameForCode] = args.piName;
        }
      }
    },

    //点击编辑提交按钮时检验有validator属性的字段
    async valiCallBack(prop, callback, nameForCode = null, label = null) {
      if (callback) {
        if (prop === 'makerCode' || prop === 'brandCode' || prop === 'seriesCode' || prop === 'deviceModelCode') {
          if (this.formDetial[prop] != null && this.formDetial[prop] != '') {
            let dts = this.dicts[prop];
            if (dts) {
              if (dts.find(a => a.id == this.formDetial[prop]) != null) {
                callback();
                return;
              } else {
                callback(new Error(`${label}不存在，请选择其他`));
                return;
              }
            }
          } else {
            if (!this.isEmpty(nameForCode) && !this.isEmpty(this.formDetial[nameForCode])) {
              callback(new Error(`${label}不存在，请重新选择`));
              return;
            } else {
              callback(new Error(`请选择${label}`));
              return;
            }
          }
        } else if (prop === 'deviceHeightBegin' || prop === 'deviceHeight') {
          //设备起始高度(U)、设备高度
          if (this.formDetial[prop] != null && this.formDetial[prop] != '') {
            //判断是否是整数
            let number = Number(this.formDetial[prop]);
            if (number % 1 === 0) {
              //判断是否大于0
              if (number <= 0) {
                callback(new Error('请填写大于0的整数'));
                return;
              }
            } else {
              callback(new Error('请填写整数数字'));
              return;
            }
          } else {
            callback(new Error('不能为空'));
            return;
          }
        } else if (prop === 'wiringNodeNo' || prop === 'upsCapacity' || prop === 'pduRatedPower' || prop === 'pduOperatePower' || prop === 'powerLoad') {
          //布线节点数(个)、UPS容量、PDU额定功率、PDU运行功率、电源负载
          if (this.formDetial[prop] != null && this.formDetial[prop] != '') {
            //判断是否是整数
            let number = Number(this.formDetial[prop]);
            if (number % 1 === 0) {
              //判断是否大于0
              if (number <= 0) {
                callback(new Error('请填写大于0的整数'));
                return;
              }
            } else {
              callback(new Error('请填写整数数字'));
              return;
            }
          } else {
            callback(new Error('不能为空'));
            return;
          }
        } else if (prop === 'horsepower' || prop === 'coolCapacity') {
          //空调匹数、制冷量
          if (this.formDetial[prop] != null && this.formDetial[prop] != '') {
            let number = Number(this.formDetial[prop]);
            if (number <= 0) {
              callback(new Error('请输入大于0的数字'));
              return;
            }
          } else {
            callback(new Error('不能为空'));
            return;
          }
        } else if (prop === 'upsCapacity' || prop === 'batteryNum' || prop === 'batteryPackNum' || prop === 'powerLoad' || prop === 'ratedCapacity') {
          //UPS容量(KVA)、电池数、电池组数、电源负载、额定容量
          if (this.formDetial[prop] != null && this.formDetial[prop] != '') {
            let number = Number(this.formDetial[prop]);
            if (number % 1 === 0) {
              if (number <= 0) {
                callback(new Error('请输入大于0的数字'));
                return;
              }
            } else {
              callback(new Error('请填写整数数字'));
              return;
            }
          } else {
            callback(new Error('不能为空'));
            return;
          }
        }
        if (prop === 'serviceExpDate') {
          //服务到期时间 > 出厂日期
          let fwdqDateStr = this.formDetial['serviceExpDate'];
          let ccDateStr = this.formDetial['factoryDate'];
          if (this.isEmpty(fwdqDateStr)) {
            callback(new Error('服务到期日期不能为空'));
            return;
          } else {
            let date1 = new Date(fwdqDateStr.replace(/-/g, "/"));
            if (!this.isEmpty(ccDateStr)) {
              let date2 = new Date(ccDateStr.replace(/-/g, "/"));
              if ((date1.getTime() - date2.getTime()) <= 0) {
                callback(new Error('服务到期日期必须大于出厂日期'));
                return;
              }
            } else {
              callback()
              return;
            }
          }
        } else if (prop === 'factoryDate') {
          /*出厂日期<=投运日期<=当前时间*/
          let ccDateStr = this.formDetial['factoryDate'];
          let tyDateStr = this.formDetial['oprtDate'];
          if (this.isEmpty(ccDateStr)) {
            callback(new Error('出厂日期不能为空'));
            return;
          } else {
            let date1 = new Date(ccDateStr.replace(/-/g, "/"));
            if (!this.isEmpty(tyDateStr)) {
              let date2 = new Date(tyDateStr.replace(/-/g, "/"));
              if (date1.getTime() > date2.getTime()) {
                callback(new Error(`出厂日期必须小于投运日期(${tyDateStr})`));
                return;
              } else if ((date1.getTime() - new Date().getTime()) > 0) {
                callback(new Error('出厂日期必须小于当前日期'));
                return;
              }
            } else {
              callback();
              return;
            }
          }
        } else if (prop === 'oprtDate') {
          /*首次投运日期<=投运日期<=当前时间*/
          let tyDateStr = this.formDetial[prop];
          let firstTyDateStr = this.formDetial['oprtDateFirst'];
          if (this.isEmpty(tyDateStr)) {
            callback(new Error('投运日期不能为空'));
            return;
          } else {
            let date1 = new Date(tyDateStr.replace(/-/g, "/"));
            if (!this.isEmpty(firstTyDateStr)) {
              let date2 = new Date(firstTyDateStr.replace(/-/g, "/"));
              //(date1.getTime() - new Date().getTime())<=0
              if ((date1.getTime() - date2.getTime()) < 0) {
                callback(new Error(`投运日期必须大于首次投运日期(${firstTyDateStr})`));
                return;
              } else if ((date1.getTime() - new Date().getTime()) > 0) {
                callback(new Error(`投运日期必须小于当前时间`));
                return;
              }
            } else if ((date1.getTime() - new Date().getTime()) > 0) {
              callback(new Error('投运日期必须小于当前日期'));
              return;
            }
          }
        } else if (prop === 'retireDate') {
          /*投运日期<=退运日期<=当前时间*/
          let tuiyDateStr = this.formDetial[prop];
          let touyDateStr = this.formDetial['oprtDate'];
          if (this.isEmpty(tuiyDateStr)) {
            callback(new Error('退运日期不能为空'));
            return;
          } else {
            let date1 = new Date(tuiyDateStr.replace(/-/g, "/"));
            if (!this.isEmpty(touyDateStr)) {
              let date2 = new Date(touyDateStr.replace(/-/g, "/"));
              if ((date1.getTime() - date2.getTime()) < 0) {
                callback(new Error(`退运日期不能小于投运日期(${touyDateStr})`));
                return;
              } else if ((date1.getTime() - new Date().getTime()) > 0) {
                callback(new Error(`退运日期必须小于当前时间`));
                return;
              }
            } else if ((date1.getTime() - new Date().getTime()) > 0) {
              callback(new Error('退运日期必须小于当前日期'));
              return;
            }
          }
        } else if (prop === 'assetCodeErp') {
          //ERP资产编码校验
          let assetCodeErp = this.formDetial['assetCodeErp'];
          //console.log(911, assetCodeErp, this.formDetial['deviceSourceCode'] == this.$store.state.common.govern.sourceFtyng)

          if (this.isEmpty(assetCodeErp)) {
            callback(new Error('请输入ERP资产编码'));
            return;
          }
          //校验erp资产编码是否符合规范
          //根据erp资产编码 调用接口获取相关数据 赋值
          let noMessage = null;
          let isYes = await new Promise(async (resolve, reject) => {
            await getInfoByErp({
              assetCodeErp: this.formDetial['assetCodeErp'],
              deviceTypeCode: this.formDetial['deviceTypeCode'],
            }).then(res => {
              resolve(true)
            }).catch(err => {
              Message.closeAll();
              noMessage = err.message;
              resolve(false)
            });
          });
          if (!isYes && this.formDetial['deviceSourceCode'] != this.$store.state.common.govern.sourceFtyng) { // 设备来源不是统一纳管
            callback(new Error(this.isEmpty(noMessage) ? 'ERP资产编码错误,请检查' : noMessage));
            return;
          } else {
            callback()
            return;
          }
        } else if (prop === 'deviceTypeCode') {
          if (this.formDetial[prop] != null && this.formDetial[prop] != '') {
            let dts = this.dicts[prop];
            if (dts) {
              if (dts.find(a => a.id == this.formDetial[prop]) != null) {
                callback();
                return;
              } else {
                callback(new Error(`${label}与设备分类不匹配，请重新选择`));
                return;
              }
            }
          } else {
            if (!this.isEmpty(nameForCode) && !this.isEmpty(this.formDetial[nameForCode])) {
              callback(new Error(`${label}与设备分类不匹配，请重新选择`));
              return;
            } else {
              callback(new Error(`请选择设备类型`));
              return;
            }
          }
        }
      }
      callback();
    },

    //初始化字段
    initForm() {
      this.pageLoading = true;
      // 获得自定义属性
      cilistattr({allowEdit: 1, ciId: this.ciId,}).then(res => {
        if (res.Return) {
          let fm = {};
          let tData = null;
          let sarr = this.editParams.ciName.split('_');
          let name = `${sarr[0]}_${sarr[1]}`;
          //来自配置文件pmsCustom.js
          tData = getPropsItems(name, (prop, callback, nameForCode, label) => this.valiCallBack(prop, callback, nameForCode, label));

          //.log(989, tData, this.editParams)


          this.rules = [];

          if (tData && tData.length > 0) {
            for (let i = 0; i < tData.length; i++) {
              let item = tData[i];
              if (item.pros) {
                for (let j = 0; j < item.pros.length; j++) {
                  let itemJ = item.pros[j];
                  let isShow = false;
                  if (!itemJ.ciName || itemJ.ciName === this.editParams.ciName) {
                    isShow = true;
                  }
                  if (isShow) {
                    if (itemJ.name == 'receiveUnit') {
                      if (this.isEmpty(this.devDetial[itemJ.name])) {
                        fm[itemJ.name] = this.userDetail.ownerUnitName;
                      } else {
                        fm[itemJ.name] = this.devDetial[itemJ.name];
                      }
                    } else {
                      fm[itemJ.name] = this.devDetial[itemJ.name];
                    }

                    if (itemJ.codeForName) {
                      if (itemJ.codeForName == 'receiveUnitCode') {
                        if (this.isEmpty(this.devDetial[itemJ.codeForName])) {
                          fm[itemJ.codeForName] = this.userDetail.ownerUnit;
                        } else {
                          fm[itemJ.codeForName] = this.devDetial[itemJ.codeForName];
                        }
                      } else {
                        fm[itemJ.codeForName] = this.devDetial[itemJ.codeForName];
                      }
                    }
                    if (itemJ.nameForCode) {
                      fm[itemJ.nameForCode] = this.devDetial[itemJ.nameForCode];
                    }

                    if (!itemJ.id && itemJ.type === 'select') {
                      let flitem = res.Return.find(a => a.name == itemJ.name);
                      if (flitem) {
                        itemJ.id = flitem.id;
                      }
                    }
                    //组织特殊字典参数
                    this.initCans(itemJ);
                  }

                  //初始化正则
                  if (itemJ.isRequired && isShow) {
                    this.rules[itemJ.name] = [{
                      required: true,
                      message: itemJ.validator ? '' : `${itemJ.label}不能为空`,
                      trigger: itemJ.type === 'select' ? ['blur', 'change'] : 'blur',
                      validator: itemJ.validator
                    }];
                  }
                }
              }
            }

            if (!this.isEmpty(this.configId)) {
              //编辑时：设备编码不展示 后台自动生成（新增不需要此字段）
              fm['deviceCode'] = this.devDetial['deviceCode'];
            }

            this.formDetial = fm;
            this.tabsList = tData;

            //默认展开所有分组
            this.activeName = this.tabsList.map(item => {
              return item.groupName
            });
          }
        }
      }).finally(() => {
        this.pageLoading = false;
      })
    },
    //初始化特殊参数
    initCans(itemJ) {
      itemJ.arrs = [];
      if (itemJ.name === 'funLocationCode') {
        //功能位置接口
        itemJ.cans = {swerk: this.userDetail.erpUnitCode || 'AAAA', current: 1, size: 100};
        itemJ.url = '/api/idevelop-device/erptranstplnr/list';
      } else if (itemJ.name === 'maintenanceFactoryCode') {
        // 维护工厂接口
        itemJ.cans = {code: this.userDetail.erpUnitCode || 'AAAA', current: 1, size: 100};
        itemJ.url = '/api/idevelop-device/erpmaintain/list';
      } else if (itemJ.name === 'computerRoomCode') {
        //机房
        itemJ.cans = {maintenanceUnit: this.isEmpty(this.devDetial['receiveUnitCode']) ? this.userDetail.ownerUnit : this.devDetial['receiveUnitCode'], current: 1, size: 999};
        itemJ.url = '/api/idevelop-device/resource/room/page';
      } else if (itemJ.name === 'cabinetCode') {
        //机柜
        itemJ.cans = {roomId: null, current: 1, size: 999};
        itemJ.url = '/api/idevelop-device/resource/cabinets/getList';
      } else if (itemJ.name === 'inWarehouseCode') {
        //所在仓库
        itemJ.cans = {ownerUnitId: this.isEmpty(this.devDetial['receiveUnitCode']) ? this.userDetail.ownerUnit : this.devDetial['receiveUnitCode']};
        itemJ.url = '/api/idevelop-device/warehouse/dict/list';
      } else if (itemJ.name === 'useKeepDept') {
        //使用保管部门
        itemJ.cans = {swerk: this.userDetail.erpDeptCode || 'AAAA', current: 1, size: 100};
        itemJ.url = '/api/idevelop-device/erpkostl/list';
      } else if (itemJ.name === 'realManageDept') {
        //实物保管部门
        itemJ.cans = {swerk: this.userDetail.erpDeptCode || 'AAAA', current: 1, size: 100};
        itemJ.url = '/api/idevelop-device/erpkostl/list';
      } else if (itemJ.name === 'deviceUseDept') {
        //设备使用部门
        itemJ.cans = {swerk: this.userDetail.erpDeptCode || 'AAAA', current: 1, size: 100};
        itemJ.url = '/api/idevelop-device/erpkostl/list';
      }
    },
    //来自selectForm控件回调，初始化下拉选项数据，使其符合name、id统一规范
    initArrs(args) {
      let name = args.configData.name;
      args.configData.arrs = [];
      let arr = [];
      if (name === 'computerRoomCode') {
        //机房
        args.res.data.records.forEach(item => {
          arr.push({
            id: item.uuid,
            name: item.roomName,
          });
        })
      } else if (name === 'cabinetCode') {
        //机柜
        args.res.data.data.forEach(item => {
          arr.push({
            id: item.id,
            name: item.fullName,
          });
        })
      } else if (name === 'funLocationCode') {
        //功能位置
        for (let i = 0; i < args.res.data.records.length; i++) {
          let item = args.res.data.records[i];
          arr.push({
            id: item.trlnr,
            name: item.pltxt,
          });
        }
      } else if (name == 'maintenanceFactoryCode') {
        //维护工厂
        for (let i = 0; i < args.res.data.records.length; i++) {
          let item = args.res.data.records[i];
          arr.push({
            id: item.code,
            name: item.name,
          });
        }
      } else if (name === 'inWarehouseCode') {
        //所在仓库
        for (let i = 0; i < args.res.data.length; i++) {
          let item = args.res.data[i];
          arr.push({
            id: item.uuid,
            name: item.warehouseName,
            address: item.address
          });
        }
      } else if (name === 'useKeepDept' || name === 'realManageDept' || name === 'deviceUseDept') {
        //使用保管部门、实物保管部门、设备使用部门
        for (let i = 0; i < args.res.data.records.length; i++) {
          let item = args.res.data.records[i];
          arr.push({
            id: item.kostl,
            name: item.kostlT,
          });
        }
      }
      args.configData.arrs = arr;
    },
    //WBS元素控件选择（暂未用到）
    wbsChange(val, type) {
      if (type == 'wbsElement') {
        this.formDetial['wbsElementName'] = val.wbsName;
        this.formDetial['projectCode'] = val.projectDefineCode;
        this.formDetial['projectName'] = val.projectDefine;
        // if (this.formDetial['projectName'] != val.projectDefine) {
        //
        // }
      }
    },
    //单位、部门联动选择触发
    getOwnerUnit(val, itemJ) {
      this.formDetial[itemJ.name] = val.fullName;
      if (itemJ.type != 'GROUP') {
        this.formDetial[`${itemJ.name}Code`] = val.id;
      }
      //如果是产权单位
      if (itemJ.name === 'ownerUnit') {
        //部门初始化
        this.formDetial['propertyDept'] = null;
        this.formDetial['propertyDeptCode'] = null;
      } else if (itemJ.name === 'operationUnit') { //如果是运维单位
        //部门初始化
        this.formDetial['operationDept'] = null;
        this.formDetial['operationDeptCode'] = null;
      } else if (itemJ.name === 'receiveUnit') {
        //如果是领用单位
        //部门初始化
        this.formDetial['receiveDept'] = null;
        this.formDetial['receiveDeptCode'] = null;

        //班组初始化
        this.formDetial['receivingGroup'] = null;

        //领用单位改变 所属仓库跟着改变
        this.formDetial['inWarehouseCode'] = null;
        this.formDetial['inWarehouse'] = null;
        for (let i = 0; i < this.tabsList.length; i++) {
          for (let j = 0; j < this.tabsList[i].pros.length; j++) {
            //系列
            if (this.tabsList[i].pros[j].name === "inWarehouseCode") {
              this.tabsList[i].pros[j].cans.ownerUnitId = this.formDetial['receiveUnitCode'];
            }
          }
        }

        //领用单位改变 机房机柜进行初始化
        this.formDetial['computerRoomCode'] = null;
        this.formDetial['computerRoom'] = null;
        this.formDetial['cabinetCode'] = null;
        this.formDetial['cabinet'] = null;
        for (let i = 0; i < this.tabsList.length; i++) {
          for (let j = 0; j < this.tabsList[i].pros.length; j++) {
            //机房
            if (this.tabsList[i].pros[j].name === "computerRoomCode") {
              this.tabsList[i].pros[j].cans.maintenanceUnit = this.formDetial['receiveUnitCode'];
            }

            //机柜
            if (this.tabsList[i].pros[j].name === "cabinetCode") {
              this.tabsList[i].pros[j].allowEdit = 0;
            }
          }
        }

      } else if (itemJ.name === 'receiveDept') { //如果是领用部门
        //班组初始化
        this.formDetial['receivingGroup'] = null;
      }
      // this.$refs.submitForm.$forceUpdate()
      // this.$forceUpdate()
    },

    //编辑、新增、是否数据治理 提交
    submit(type) {
      this.saveLoading = true;
      this.$refs.submitForm.clearValidate();
      this.$refs.submitForm.validate((valid) => {
        // if (process.env.NODE_ENV !== 'production') {
        //   valid = true;
        // }
        if (valid) {
          this.pageLoading = true;
          //程序自动生成字段处理
          this.autoCreateParams().then(async () => {
            //组织参数
            let ps = null;
            if (this.isEmpty(this.configId)) {
              //新增
              ps = this.getAddPostParams();
              //新增
              attrrelAdd(ps).then(res => {
                this.$message({type: 'success', message: '新增成功！'});
                this.$emit('refreshDetial')
                this.$emit('close')
              }).catch(err => {
                this.$alert(err.message, '提醒', {
                  confirmButtonText: this.$t("submitText"),
                  cancelButtonText: this.$t("cancelText"),
                  type: "warning"
                });
              }).finally(() => {
                this.pageLoading = false;
                this.saveLoading = false;
              })
            } else {
              ps = this.getEditPostParams();
              //编辑
              //判断是否完成治理
              if (type === 'sfwczl') {
                let isOK = await new Promise(resolve => {
                  this.$confirm("确定将当前编辑数据完成数据治理？", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  }).then(() => {
                    //是否完成治理 传递 isGovern参数
                    ps[this.editParams.devid].isGovern = this.$store.state.common.govern.governYes;
                    resolve(true);
                  }).catch(err => {
                    this.pageLoading = false;
                    this.saveLoading = false;
                    resolve(false);
                  })
                });
                if (isOK == false) {
                  return;
                }
              }
              attrrelUpdate(ps).then(res => {
                this.$message({type: 'success', message: type === 'sfwczl' ? '已完成治理' : '更新成功！'});
                this.$emit('refreshDetial')
                this.$emit('close')
              }).catch(err => {
                this.$alert(err.message, '提醒', {
                  confirmButtonText: this.$t("submitText"),
                  cancelButtonText: this.$t("cancelText"),
                  type: "warning"
                });
              }).finally(() => {
                this.pageLoading = false;
                this.saveLoading = false;
              })
            }
          }).catch(err => {
            this.$alert(err.message, '提醒', {
              confirmButtonText: this.$t("submitText"),
              type: "warning"
            });
            this.pageLoading = false;
            this.saveLoading = false;
          });
        } else {
          this.$message.error('有必填项未填写，请完善');
          this.saveLoading = false;
        }
      })
    },

    //程序自动生成属性集合
    autoCreateParams() {
      return new Promise(async (resolve, reject) => {
        //是否同步I6000、是否同步Erp
        if (!this.isEmpty(this.formDetial['assetCodeErp'])) {
          this.formDetial['isToI6000'] = this.$store.state.common.govern.isYes;
          this.formDetial['isToErpCode'] = this.$store.state.common.govern.isYes;
        } else {
          this.formDetial['isToI6000'] = this.$store.state.common.govern.isNo;
          this.formDetial['isToErpCode'] = this.$store.state.common.govern.isNo;
        }

        //ERP转资状态
        if (this.formDetial['deviceSourceCode'] == this.$store.state.common.govern.sourceFtyng) {
          //非统一纳管
          this.formDetial['erpTransferStatus'] = '';
        } else if (this.formDetial['deviceSourceCode'] == this.$store.state.common.govern.sourceTyng) {
          //统一纳管
          if (!this.isEmpty(this.formDetial['assetCodeErp'])) {
            //存在erp资产编码
            this.formDetial['erpTransferStatus'] = this.$store.state.common.govern.transferYes;
          } else {
            //不存在erp资产编码
            this.formDetial['erpTransferStatus'] = this.$store.state.common.govern.transferNo;
          }
        }

        //首次投运日期（默认与投运日期一致）
        this.formDetial['oprtDateFirst'] = this.formDetial['oprtDate'];

        //领用日期（在运时 默认与投运日期一致）
        if (this.formDetial['deviceStatusCode'] == this.$store.state.common.govern.deviceOperation) {
          this.formDetial['receivingDate'] = this.formDetial['oprtDate'];
        }

        //所在位置
        if (this.dicts['inWarehouseCode'] && this.dicts['inWarehouseCode'].length > 0) {
          let fWareItem = this.dicts['inWarehouseCode'].find(a => a.id == this.formDetial['inWarehouseCode']);
          if (fWareItem) {
            this.formDetial['warehouseLocation'] = fWareItem.address;
          }
        }

        let sarr = this.editParams.ciName.split('_');
        let name = `${sarr[0]}_${sarr[1]}`;

        if (name == 'SG_CMHD' || name == 'SG_CMND' || name == 'SG_CMSD' || name == 'SG_CMFD') {
          //主机、网络、存储、安全设备属性
          //设备终止高度(U)
          if (!isNaN(this.formDetial['deviceHeightBegin']) && !isNaN(this.formDetial['deviceHeight'])) {
            let num = Number(this.formDetial['deviceHeightBegin']) + Number(this.formDetial['deviceHeight']) - 1;
            if (num > 0) {
              this.formDetial.deviceHeightEnd = num.toString();
            } else {
              this.formDetial.deviceHeightEnd = null;
            }
          } else {
            this.formDetial.deviceHeightEnd = null
          }
        }
        if (this.formDetial['deviceSourceCode'] == this.$store.state.common.govern.sourceTyng) {
          //根据erp资产编码 调用接口获取相关数据 赋值
          await getInfoByErp({
            assetCodeErp: this.formDetial['assetCodeErp'],
            deviceTypeCode: this.formDetial['deviceTypeCode'],
          }).then(res => {
            if (res.data) {
              this.initWBSInfo(res.data);
            } else {
              this.initWBSInfo(null);
            }
          }).catch(err => {
            this.initWBSInfo(null);
            reject(err);
          });
        }

        // //标准全称生成（暂时不调用接口，改为手动输入）
        // let jp = {
        //   deviceType: this.formDetial['deviceTypeCode'],
        //   type: this.formDetial['deviceSourceCode'],
        //   projectName: this.isEmpty(this.formDetial['projectName']) ? '' : this.formDetial['projectName']
        // };
        // await getFullName(jp).then(res => {
        //   if (res.data) {
        //     this.formDetial['fullName'] = res.data
        //   }
        // }).catch(err => {
        // });

        //根据IP地址获取以下信息
        if (!this.isEmpty(this.formDetial['IP'])) {
          await getInfoByIP({ip: this.formDetial['IP']}).then(res => {
            if (res.data) {
              this.formDetial['manageUsers'] = res.data.telUser;
              this.formDetial['managePassword'] = res.data.telPass;
              this.formDetial['switchPassword'] = res.data.swPass;
              this.formDetial['snmpReadString'] = res.data.snmpReadStr;
              this.formDetial['snmpWriteString'] = res.data.snmpWriteStr;
              this.formDetial['snmpVersion'] = res.data.snmpVersion;
              this.formDetial['workVlan'] = res.data.vlans;
              this.formDetial['configPassword'] = res.data.configPass;
            }
          }).catch(err => {

          });
        }
        resolve();
      });
    },

    initWBSInfo(data) {
      //ERP设备台账编码
      this.formDetial['deviceCodeErp'] = (data && !this.isEmpty(data.deviceCodeErp) ? data.deviceCodeErp : '');
      //WBS元素
      this.formDetial['wbsElement'] = (data && !this.isEmpty(data.wbsElement) ? data.wbsElement : '');
      //WBS元素显示名称
      this.formDetial['wbsElementName'] = (data && !this.isEmpty(data.wbsElementName) ? data.wbsElementName : '');
      //项目编号
      this.formDetial['projectCode'] = (data && !this.isEmpty(data.projectCode) ? data.projectCode : '');
      //项目名称
      this.formDetial['projectName'] = (data && !this.isEmpty(data.projectName) ? data.projectName : '');
      //功能位置显示名称
      this.formDetial['funLocation'] = (data && !this.isEmpty(data.funLocation) ? data.funLocation : '');
      //功能位置
      this.formDetial['funLocationCode'] = (data && !this.isEmpty(data.funLocationCode) ? data.funLocationCode : '');
      //维护工厂显示名称
      this.formDetial['maintenanceFactory'] = (data && !this.isEmpty(data.maintenanceFactory) ? data.maintenanceFactory : '');
      //工厂区域
      this.formDetial['factoryArea'] = (data && !this.isEmpty(data.factoryArea) ? data.factoryArea : '');
      //资产原值
      this.formDetial['assetOriginal'] = (data && !this.isEmpty(data.assetOriginal) ? data.assetOriginal : '');
    },

    //组织编辑、是否数据治理参数
    getEditPostParams() {
      let key = this.editParams.devid;
      let pjson = {
        ciId: this.editParams.ciId,
        uuid: this.editParams.uuid,
        ...this.formDetial
      };
      //当设备类型和设备
      if ((this.categoryType.deviceCategoryCodeFirst != this.formDetial['deviceCategoryCode']) || (this.categoryType.deviceTypeCodeFirst != this.formDetial['deviceTypeCode'])) {
        pjson['isCategoryType'] = true;
      } else {
        pjson['isCategoryType'] = false;
      }

      let d = {};
      d[key] = pjson;
      return d;
    },
    //组织新增参数
    getAddPostParams() {
      let pjson = {
        isGovern: this.$store.state.common.govern.governNo,
        ...this.formDetial
      };
      //当设备类型和设备
      if ((this.categoryType.deviceCategoryCodeFirst != this.formDetial['deviceCategoryCode']) || (this.categoryType.deviceTypeCodeFirst != this.formDetial['deviceTypeCode'])) {
        pjson['isCategoryType'] = true;
      } else {
        pjson['isCategoryType'] = false;
      }
      return pjson;
    },
    getFilter(itemJ) {
      //特有字段根据：ciName判断是否展示
      if (!itemJ.ciName) {
        return true;
      }
      if (itemJ.ciName === this.editParams.ciName) {
        return true;
      }
      return false;
    },
    getFilterLength(pros) {
      let num = 0;
      if (pros) {
        for (let i = 0; i < pros.length; i++) {
          let itemJ = pros[i];
          if (!itemJ.ciName) {
            num++;
          } else if (itemJ.ciName === this.editParams.ciName) {
            num++;
          }
        }
      }
      return num;
    },

    //条件必填逻辑郭泽校验
    getItemFilter(type, names) {
      if (!names || names.length == 0) {
        return;
      }
      names.forEach((item) => {
        let name = item;
        outloop:
          for (let i = 0; i < this.tabsList.length; i++) {
            for (let j = 0; j < this.tabsList[i].pros.length; j++) {
              let itemJ = this.tabsList[i].pros[j];
              if (itemJ.name === name) {
                let ruleItem = this.rules[name];
                if (type === 'addRule') {
                  //添加正则校验
                  if (!ruleItem) {
                    this.$set(this.rules, name, [{
                      required: true,
                      message: itemJ.validator ? '' : `${itemJ.label}不能为空`,
                      trigger: itemJ.type === 'select' ? ['blur', 'change'] : 'blur',
                      validator: itemJ.validator
                    }])
                    itemJ.isRequired = 1;
                  }
                } else if (type === 'delRule') {
                  //删除正则校验
                  if (ruleItem) {
                    this.$delete(this.rules, name)
                    itemJ.isRequired = 0;
                  }
                }
                break outloop;
              }
            }
          }
      });
    },
    //条件必填逻辑郭泽校验
    btzdChange(gj, newVal, type = 'select') {
      let sarr = this.editParams.ciName.split('_');
      let name = `${sarr[0]}_${sarr[1]}`;

      let nameYes = [];
      let nameNo = [];
      if (type === 'input') {
        //输入框非空检验
        if (newVal != null && newVal != '') {
          nameYes = this.btzds().filter(a => a.gj.findIndex(b => b == gj) != -1 && (a.ciNames == null || a.ciNames.length == 0 ? true : a.ciNames.indexOf(name) != -1)).map((item) => item.name);
        } else {
          nameNo = this.btzds().filter(a => a.gj.findIndex(b => b == gj) != -1 && (a.ciNames == null || a.ciNames.length == 0 ? true : a.ciNames.indexOf(name) != -1)).map((item) => item.name);
        }
      } else {
        let nameAll = this.btzds().filter(a => a.gj.findIndex(b => b == gj) != -1 && (a.ciNames == null || a.ciNames.length == 0 ? true : a.ciNames.indexOf(name) != -1));

        nameAll.forEach(item => {
          if (item.gj) {
            let gjYes = [];
            let gjNo = [];

            if (item.gj.length === item.value.length) {
              let jsNum = 0;
              for (let i = 0; i < item.gj.length; i++) {
                if (item.value[i] == this.formDetial[item.gj[i]]) {
                  jsNum++;
                }
              }
              if (jsNum == item.gj.length) {
                gjYes.push(item.name);
              } else {
                gjNo.push(item.name);
              }
            } else {
              let hasYes = false;
              for (let i = 0; i < item.gj.length; i++) {
                if (item.value.findIndex(a => a == this.formDetial[item.gj[i]]) != -1) {
                  hasYes = true;
                  break
                }
              }
              if (hasYes) {
                gjYes.push(item.name);
              } else {
                gjNo.push(item.name);
              }
            }


            // item.gj.forEach(itemJ => {
            //   let detial = this.formDetial;
            //   if (item.value.findIndex(a => a == detial[itemJ]) != -1) {
            //     gjYes.push(item.name);
            //   } else {
            //     gjNo.push(item.name);
            //   }
            // })
            if (gjYes.length > 0) {
              nameYes = [...nameYes, ...gjYes]
            } else {
              nameNo = [...nameNo, ...gjNo]
            }
          }
        });


        //select选择框 (默认)
        //nameYes = nameAll.filter(a => a.value.findIndex(b => b == newVal) != -1).map((item) => item.name);
        //nameNo = nameAll.filter(a => a.value.findIndex(b => b == newVal)).map((item) => item.name);
      }

      this.getItemFilter('addRule', nameYes);
      this.getItemFilter('delRule', nameNo);

      this.$nextTick(() => {
        if (this.$refs.submitForm) {
          this.$refs.submitForm.clearValidate();
        }
        this.$forceUpdate();
      })
    },
    //条件必填逻辑规则校验
    btzds() {
      let zdList = [
        {
          name: 'netWorkCode',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: null
        },
        // {
        //   name: 'oprtDate',
        //   gj: ['IP'],//根据IP输入框 非空
        //   ciNames: null
        // },
        {
          name: 'oprtDate',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: null
        }, {
          name: 'installationSite',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: null
        }, {
          name: 'receivingTel',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: null
        }, {
          name: 'receivePersonUnifiedAcc',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: null
        }, {
          name: 'receivingIDCard',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: null
        }, {
          name: 'receivingPerson',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: null,
        }, {
          name: 'retireDate',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceTyzk],//退运在库
          ciNames: null,
        }, {
          name: 'inWarehouseCode',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceTyzk, this.$store.state.common.govern.deviceKcby],//退运在库、库存备用
          ciNames: null,
        }, {
          name: 'assetCodeErp',
          gj: ['deviceSourceCode'],//根据设备来源
          value: [this.$store.state.common.govern.sourceTyng],//统一纳管
          ciNames: null,
        }, {
          name: 'deviceAddTypeCode',
          gj: ['deviceSourceCode'],//根据设备来源
          value: [this.$store.state.common.govern.sourceTyng],//统一纳管
          ciNames: null,
        }, {
          name: 'receiveUnit',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: null,
        }, {
          name: 'receiveDept',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: null,
        }, {
          name: 'user',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: ['SG_CMTD'],
        }, {
          name: 'deviceUserIDCard',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: ['SG_CMTD'],
        }, {
          name: 'computerRoomCode',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: ['SG_CMHD', 'SG_CMND', 'SG_CMSD', 'SG_CMFD', 'SG_JCSS'],
        }, {
          name: 'cabinetCode',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: ['SG_CMHD', 'SG_CMND', 'SG_CMSD', 'SG_CMFD'],
        }, {
          name: 'OSBits',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: ['SG_CMHD'],
        }, {
          name: 'deviceHeightBegin',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: ['SG_CMHD', 'SG_CMND', 'SG_CMSD', 'SG_CMFD'],
        }, {
          name: 'deviceHeight',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: ['SG_CMHD', 'SG_CMND', 'SG_CMSD', 'SG_CMFD'],
        }, {
          name: 'serverUseToType',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: ['SG_CMHD'],
        }, {
          name: 'networkDeviceType',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: ['SG_CMND'],
        }, {
          name: 'standbyAttr',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: ['SG_CMND'],
        }, {
          name: 'upsCapacity',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],
          ciNames: ['SG_CMAD'],
        }, {
          name: 'pduRatedPower',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],
          ciNames: ['SG_CMAD'],
        },


        {
          name: 'wiringNodeNo', // 布线节点数(个)
          gj: ['deviceTypeCode'],// 设备类型
          value: [this.$store.state.common.govern.deviceTypeCabinet],// 机柜
          ciNames: ['SG_CMAD'], // 设备分类（辅助设备）
        },
        {
          name: 'voltageLevelCode', // 电压等级
          gj: ['deviceTypeCode'],// 设备类型
          value: [this.$store.state.common.govern.deviceTypeCabinet, this.$store.state.common.govern.deviceTypeAccess, this.$store.state.common.govern.deviceTypeOtherComputerRoom, this.$store.state.common.govern.rotatingRing],// 机柜
          ciNames: ['SG_CMAD'], // 设备分类（辅助设备）
        },
        {
          name: 'pduRatedPower', // PDU额定功率(W)
          gj: ['deviceTypeCode'],// 设备类型
          value: [this.$store.state.common.govern.deviceTypeCabinet],// 机柜
          ciNames: ['SG_CMAD'], // 设备分类（辅助设备）
        },
        {
          name: 'pduOperatePower', // PDU运行功率(W)
          gj: ['deviceTypeCode'],// 设备类型
          value: [this.$store.state.common.govern.deviceTypeCabinet],// 机柜
          ciNames: ['SG_CMAD'], // 设备分类（辅助设备）
        },
        {
          name: 'computerRoomCode',//所属机房
          gj: ['deviceTypeCode'],//根据设备类型
          value: [this.$store.state.common.govern.deviceTypeCabinet, this.$store.state.common.govern.deviceTypeAccess, this.$store.state.common.govern.deviceTypeOtherComputerRoom, this.$store.state.common.govern.rotatingRing],
          ciNames: ['SG_CMAD'],
        },
        {
          name: 'cabinetCapacity',//机柜容量
          gj: ['deviceTypeCode'],// 设备类型
          value: [this.$store.state.common.govern.deviceTypeCabinet],// 机柜
          ciNames: ['SG_CMAD'], // 设备分类（辅助设备）
        },
        {
          name: 'powerLoad', // 电源负载
          gj: ['deviceTypeCode'],// 设备类型
          value: [this.$store.state.common.govern.deviceTypeAccess, this.$store.state.common.govern.deviceTypeOtherComputerRoom, this.$store.state.common.govern.rotatingRing],// 机柜
          ciNames: ['SG_CMAD'], // 设备分类（辅助设备）
        },









        {
          name: 'powerLoad',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],
          ciNames: ['SG_CMAD', 'SG_JCSS'],
        }, {
          name: 'sparePartsType',
          gj: ['deviceTypeCode'],//根据设备类型
          value: [this.$store.state.common.govern.typeOtherWbsb],
          ciNames: ['SG_CMOD'],
        }, {
          name: 'airConditionType',
          gj: ['deviceTypeCode'],// 设备类型
          value: [this.$store.state.common.govern.typeAir], // 机房空调
          ciNames: ['SG_JCSS'],
        }, {
          name: 'horsepower',
          gj: ['deviceTypeCode'],//根据设备类型
          value: [this.$store.state.common.govern.typeAir],
          ciNames: ['SG_JCSS'],
        }, {
          name: 'coolCapacity',
          gj: ['deviceTypeCode'],//根据设备类型
          value: [this.$store.state.common.govern.typeAir],
          ciNames: ['SG_JCSS'],
        },
        { // 新 代表 UPS容量 辅助设备 当设备类型为机柜时为必填项
          name: 'upsCapacity',
          gj: ['deviceTypeCode'],
          value: [this.$store.state.common.govern.deviceTypeCabinet],
          ciNames: ['SG_CMAD'],
        },
        {
          name: 'upsCapacity',
          gj: ['deviceStatusCode', 'deviceTypeCode'],
          value: [this.$store.state.common.govern.deviceOperation, this.$store.state.common.govern.typeUPS],
          ciNames: ['SG_JCSS'],
        }, {
          name: 'batteryNum',
          gj: ['deviceTypeCode'],
          value: [this.$store.state.common.govern.typeBattery],
          ciNames: ['SG_JCSS'],
        }, {
          name: 'batteryPackNum',
          gj: ['deviceTypeCode'],
          value: [this.$store.state.common.govern.typeBattery],
          ciNames: ['SG_JCSS'],
        }, {
          name: 'ratedCapacity',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],
          ciNames: ['SG_JCSS'],
        }, {
          name: 'voltageLevelCode',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],
          ciNames: ['SG_JCSS'],
        }, {
          name: 'belongUps',
          gj: ['deviceStatusCode', 'deviceTypeCode'],
          value: [this.$store.state.common.govern.deviceOperation, this.$store.state.common.govern.typeBattery],
          ciNames: ['SG_JCSS'],
        },
      ];

      //特殊负责情况判断
      //辅助设备新增数据IP地址和Mac地址改成非必填
      let sarr = this.editParams.ciName.split('_');
      let name = `${sarr[0]}_${sarr[1]}`;
      if (name == 'SG_CMHD' || name == 'SG_CMFD' || name == 'SG_CMSD' || name == 'SG_CMND' || name == 'SG_CMTD') {
        if (this.formDetial['deviceStatusCode'] == this.$store.state.common.govern.deviceOperation) {
          // console.log(6767, this.formDetial['netWorkCode'])
          //在运且所属网络不为空
          if (!this.isEmpty(this.formDetial['netWorkCode']) && this.formDetial['netWorkCode'] != '1107943681753089') { // 在所属网络有值且不是未联网时执行
            // 校验 IP、MAC
            zdList.push({
              name: 'IP', //公共属性
              gj: ['deviceStatusCode'],//根据设备状态
              value: [this.$store.state.common.govern.deviceOperation],//在运
              ciNames: ['SG_CMHD', 'SG_CMFD', 'SG_CMSD', 'SG_CMND', 'SG_CMTD'],
            });
            zdList.push({
              name: 'MAC',
              gj: ['deviceStatusCode'],//根据设备状态
              value: [this.$store.state.common.govern.deviceOperation],//在运
              ciNames: ['SG_CMHD', 'SG_CMFD', 'SG_CMSD', 'SG_CMND', 'SG_CMTD'],
            });
          } else {
            this.getItemFilter('delRule', ['IP', 'MAC']);
          }
        } else {
          //非在运 不校验IP、MAC
          this.getItemFilter('delRule', ['IP', 'MAC']);
        }
      } else if (name == 'SG_CMAD' || name == 'SG_JCSS' || name == 'SG_CMOD') {
        //辅助设备、基础设施、办公设备： IP、MAC不校验
        this.getItemFilter('delRule', ['IP', 'MAC', 'computerRoomCode', 'cabinetCapacity', 'cabinetCode', 'wiringNodeNo']);

        //辅助设备分类下一些设备的特殊情况
        if (name == 'SG_CMAD') {
          // console.log(300, this.$store.state.common.govern)
          if (this.formDetial['deviceTypeCode'] == this.$store.state.common.govern.deviceTypeCabinet) { //设备类型 - 机柜
            // zdList.push({
            //   name: 'computerRoomCode',//所属机房
            //   gj: ['deviceTypeCode'],//根据设备类型
            //   value: [this.$store.state.common.govern.deviceTypeCabinet],
            //   ciNames: ['SG_CMAD'],
            // });
            // zdList.push({
            //   name: 'cabinetCapacity',//机柜容量
            //   gj: ['deviceTypeCode'],//根据设备类型
            //   value: [this.$store.state.common.govern.deviceTypeCabinet],
            //   ciNames: ['SG_CMAD'],
            // });
            // zdList.push({
            //   name: 'wiringNodeNo', // 布线节点数(个)
            //   gj: ['deviceTypeCode'],// 设备类型
            //   value: [this.$store.state.common.govern.deviceTypeCabinet],// 机柜
            //   ciNames: ['SG_CMAD'], // 设备分类（辅助设备）
            // });
            // zdList.push({
            //   name: 'voltageLevelCode', // 电压等级
            //   gj: ['deviceTypeCode'],// 设备类型
            //   value: [this.$store.state.common.govern.deviceTypeCabinet],// 机柜
            //   ciNames: ['SG_CMAD'], // 设备分类（辅助设备）
            // });
            // zdList.push({
            //   name: 'pduRatedPower', // PDU额定功率(W)
            //   gj: ['deviceTypeCode'],// 设备类型
            //   value: [this.$store.state.common.govern.deviceTypeCabinet],// 机柜
            //   ciNames: ['SG_CMAD'], // 设备分类（辅助设备）
            // });
            // zdList.push({
            //   name: 'pduOperatePower', // PDU运行功率(W)
            //   gj: ['deviceTypeCode'],// 设备类型
            //   value: [this.$store.state.common.govern.deviceTypeCabinet],// 机柜
            //   ciNames: ['SG_CMAD'], // 设备分类（辅助设备）
            // });




            // zdList.push({
            //   name: 'cabinetCode',
            //   gj: ['deviceStatusCode', 'deviceTypeCode'],// 设备状态 设备类型
            //   value: [this.$store.state.common.govern.deviceOperation, this.$store.state.common.govern.deviceTypeCabinet],// 在运、机柜
            //   ciNames: ['SG_CMAD'],
            // });
            // zdList.push({
            //   name: 'wiringNodeNo',
            //   gj: ['deviceStatusCode', 'deviceTypeCode'],// 设备状态 设备类型
            //   value: [this.$store.state.common.govern.deviceOperation, this.$store.state.common.govern.deviceTypeCabinet],// 在运、机柜
            //   ciNames: ['SG_CMAD'],
            // });
          } else if (this.formDetial['deviceTypeCode'] == this.$store.state.common.govern.deviceTypeAccess) {
            //设备类型 - 门禁设备
            zdList.push({
              name: 'computerRoomCode',//所属机房
              gj: ['deviceTypeCode'],//根据设备类型
              value: [this.$store.state.common.govern.deviceTypeAccess],
              ciNames: ['SG_CMAD'],
            });

            zdList.push({
              name: 'IP', //公共属性
              gj: ['deviceStatusCode', 'deviceTypeCode'],
              value: [this.$store.state.common.govern.deviceOperation, this.$store.state.common.govern.deviceTypeAccess],
              ciNames: ['SG_CMAD'],
            });
            zdList.push({
              name: 'MAC', //公共属性
              gj: ['deviceStatusCode', 'deviceTypeCode'],
              value: [this.$store.state.common.govern.deviceOperation, this.$store.state.common.govern.deviceTypeAccess],
              ciNames: ['SG_CMAD'],
            });
            zdList.push({
              name: 'cabinetCode',
              gj: ['deviceStatusCode', 'deviceTypeCode'],
              value: [this.$store.state.common.govern.deviceOperation, this.$store.state.common.govern.deviceTypeAccess],
              ciNames: ['SG_CMAD'],
            });
            zdList.push({
              name: 'wiringNodeNo',
              gj: ['deviceStatusCode', 'deviceTypeCode'],
              value: [this.$store.state.common.govern.deviceOperation, this.$store.state.common.govern.deviceTypeAccess],
              ciNames: ['SG_CMAD'],
            });
          } else if (this.formDetial['deviceTypeCode'] == this.$store.state.common.govern.deviceTypeOtherComputerRoom) {
            //设备类型 - 其他机房辅助设备
            zdList.push({
              name: 'computerRoomCode',//所属机房
              gj: ['deviceTypeCode'],//根据设备类型
              value: [this.$store.state.common.govern.deviceTypeOtherComputerRoom],
              ciNames: ['SG_CMAD'],
            });
          }
        }
      } else {
        zdList.push({
          name: 'IP', //公共属性
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: ['SG_CMTD', 'SG_CMHD', 'SG_CMND', 'SG_CMSD', 'SG_CMFD', 'SG_CMOD', 'SG_JCSS'],
        });
        zdList.push({
          name: 'MAC',
          gj: ['deviceStatusCode'],//根据设备状态
          value: [this.$store.state.common.govern.deviceOperation],//在运
          ciNames: ['SG_CMTD', 'SG_CMHD', 'SG_CMND', 'SG_CMSD', 'SG_CMFD', 'SG_CMOD', 'SG_JCSS'],
        });
      }
      return zdList;
    },
    isEmpty(value) {
      if (value == null || value === '') {
        return true;
      }
      return false
    }
  }
}
</script>
<style lang="scss" scoped>

/* .hhhBiao .el-select{
  border: 1px solid red !important;
} */
::v-deep .hhhBiao .el-input input {
  border: 1px solid red !important;
}

::v-deep .hhhBiao .el-textarea textarea {
  border: 1px solid red !important;
}

::v-deep .biaotiaaaa .el-collapse-item__header {
  color: red !important;
}
</style>
<style lang="scss" scoped>


.submit_btn {
  margin-top: 16px;

  button {
    padding: 0px 12px 0px 12px;
    height: 30px;
  }
}

.d_ill {
  padding: 0px 24px 24px 24px;
  color: #FFFFFF;
}

.s_ill {
  background-color: #91D5FF;
  padding: 6px 12px 6px 12px;
}

.d_ph {
  height: 75vh;
}

.el_fp {
  overflow-y: auto;
  height: 70vh;
  padding-right: 12px
}

.e_btnsc {
  background-color: #00a680 !important;
  color: #FFFFFF !important;
  color: #FFFFFF !important;
  border-bottom-left-radius: 0px !important;
  border-top-left-radius: 0px !important;
}

/deep/ .el-collapse-item__content {
  padding-top: 25px;
}

/deep/ .el-collapse-item__header {
  font-weight: bold;
}

.e_sfwczl {
  margin-right: 12px;
}
</style>

