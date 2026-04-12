<!--部门管理新页面 使用中-->
<template>
  <div class="d_root d_start_flow" v-loading="loading">
    <div class="d_top d_start_flow">
      <div class="d_start d_title">
        <div class="d_line"></div>
        <span class="s_title">告警信息</span>
      </div>
      <div class="d_desc">
        <el-descriptions :column="3" :content-style="CS" size="small" label-class-name="el-desc-label" content-class-name="el-desc-content" border>
          <el-descriptions-item label="告警编码">{{ fromDetial.warningNumber }}</el-descriptions-item>
          <el-descriptions-item label="告警类型">
            <span class="s_ori">{{ fromDetial.warningType }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="告警等级">
            <el-tag size="small" :type="getTagType(fromDetial.warningLevel)">{{ fromDetial.warningLevel }}</el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="告警原因">
            <!-- <span class="s_ori">{{ fromDetial.warningReason }}</span> -->
            <el-tooltip effect="dark" :content="warningReason" placement="bottom">
              <span class="s_ori ellipsis">{{ warningReason }}</span>
            </el-tooltip>
          </el-descriptions-item>
          <el-descriptions-item label="告警详情">
            <!-- <span class="s_ori">{{ fromDetial.warningDetail }}</span> -->
            <el-tooltip effect="dark" :content="warningReason" placement="bottom">
              <span class="s_ori ellipsis">{{ warningDetail }}</span>
            </el-tooltip> 
          </el-descriptions-item>
          <el-descriptions-item label="告警时间">
            <div class="d_start v_center">
              <span>{{ fromDetial.warningBeginTime }}</span>
              <el-tooltip>
                <template #content>
                  <div>
                    <div v-if="fromDetial.historyTime!=null&&fromDetial.historyTime!=''">
                      <div v-for="(item,index) in getHisTime(fromDetial.historyTime)" :key="index" class="d_histime">
                        <span>{{ item }}</span>
                      </div>
                    </div>
                    <div v-else>
                      <span>暂无数据</span>
                    </div>
                  </div>
                </template>
                <i class="el-icon-info infocolor"></i>
              </el-tooltip>
            </div>
          </el-descriptions-item>

          <el-descriptions-item label="告警设备">{{ fromDetial.warningDevice }}</el-descriptions-item>
          <el-descriptions-item label="设备分类">{{ fromDetial.warningCategoryName }}</el-descriptions-item>
          <el-descriptions-item label="设备类型">{{ fromDetial.warningDeviceTypeName }}</el-descriptions-item>

          <el-descriptions-item label="确认状态">
            <div class="d_start v_center">
              <div class="d_cir" :style="{backgroundColor:getConfirmStatusColor(fromDetial.confirmStatus)}"></div>
              <div>
                <span>{{ getConfirmStatusText(fromDetial.confirmStatus) }}</span>
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="处置状态">
            <div class="d_start v_center">
              <div class="d_cir" :style="{backgroundColor:getConfirmStatusColor(fromDetial.disposeStatus)}"></div>
              <div>
                <span>{{ getDisposeStatusText(fromDetial.disposeStatus) }}</span>
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="告警次数">{{ fromDetial.warningCount }}</el-descriptions-item>

          <el-descriptions-item label="领用单位">{{ fromDetial.receiveUnitName }}</el-descriptions-item>
          <el-descriptions-item label="领用部门">{{ fromDetial.receiveDutyDeptName }}</el-descriptions-item>
          <el-descriptions-item label="责任人">{{ fromDetial.receiveUseName }}</el-descriptions-item>

          <el-descriptions-item label="责任人联系方式">{{ fromDetial.receiveUsePhone }}</el-descriptions-item>
          <el-descriptions-item label="使用人">{{ fromDetial.userName }}</el-descriptions-item>
          <el-descriptions-item label="使用人联系方式">{{ fromDetial.userPhone }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <transition name="el-zoom-in-top">
      <template_ip_mac_jixian_yj ref="ipmacjx" :form-value="fromDetial" v-if="showIpMacJixian(fromDetial)"></template_ip_mac_jixian_yj>
    </transition>

    <template_newdevice ref="newdevice" :form-value="fromDetial" :operationId="$route.query.operationId" v-if="showNewDevice(fromDetial)"></template_newdevice>

    <transition name="el-zoom-in-top">
      <template_tzdevice ref="tzdevice" :form-value="fromDetial" v-if="showTZDevice(fromDetial)"></template_tzdevice>
    </transition>

    <transition name="el-zoom-in-top">
      <template_donghuan ref="donghuan" :form-value="fromDetial" v-if="showDonghuan(fromDetial)"></template_donghuan>
    </transition>

    <div class="d_bottom">
      <div class="d_sb d_title">
        <div>
          <div class="d_start">
            <div class="d_line2"></div>
            <span class="s_title">设备信息</span>
          </div>
        </div>
        <div class="d_btm_rtitle" v-if="!donghuan">
          <div class="d_end">
            <span class="s_ori">橙色为异常字段</span>
          </div>
          <div class="d_start d_tdl">
            <div>
              <span>采集来源：</span>
              <span class="s_tq">{{ fromDetial.warningSource }}</span>
            </div>
            <div>
              <span class="s_cjtime">采集时间：</span>
              <span class="s_tq">{{ fromDetial.createTime }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 设备列表 -->
      <div class="d_btmcom">
        <div v-if="fromDetial.warningType == '基线异常'">
          <el-table :data="itemsJx1" border size="small" class="e_tabel e_tabel1">
            <el-table-column label="对比字段" prop="fieldName" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="本次采集信息" prop="tzInfo" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="距离当前日期（天）" prop="sjInfo" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span :style="{color:isMore90(scope.row.sjInfo)?'#FFB445':''}">{{ scope.row.sjInfo }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="itemsJx2" border size="small" class="e_tabel">
            <el-table-column label="对比字段" prop="fieldName" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="台账记录信息" prop="tzInfo" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="实际采集信息" prop="sjInfo" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span :style="{color:getIsSign(scope.row.tzInfo,scope.row.sjInfo)?'#FFB445':''}">{{ scope.row.sjInfo }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else-if="fromDetial.warningType == '台账监控异常'">
          <el-table :data="itemsTz1" border size="small" class="e_tabel e_tabel1">
            <el-table-column label="告警字段" prop="fieldName" :width="dismWidth" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="异常原因" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span class="s_ori">{{scope.row.tzInfo}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table ref="tbTZ2" :data="itemsTz2" border size="small" class="e_tabel">
            <el-table-column label="对比字段" prop="fieldName" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="台账记录信息" prop="tzInfo" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="实际采集信息" prop="sjInfo" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span :style="{color:getIsSign(scope.row.tzInfo,scope.row.sjInfo)?'#FFB445':''}">{{ scope.row.sjInfo }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else-if="donghuan">
          <el-table :data="itemsCustom" border size="small" class="e_tabel">
            <el-table-column label="对比字段" prop="fieldName" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="台账记录信息" prop="tzInfo" show-overflow-tooltip align="center"></el-table-column>
          </el-table>
        </div>
        <div v-else>
          <el-table :data="itemsCustom" border size="small" class="e_tabel">
            <el-table-column label="对比字段" prop="fieldName" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="台账记录信息" prop="tzInfo" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="实际采集信息" prop="sjInfo" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span :style="{color:getIsSign(scope.row.tzInfo,scope.row.sjInfo)?'#FFB445':''}">{{ scope.row.sjInfo }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>

    <div class="vh_center d_btn">
      <div class="d_start" v-if="fromDetial.confirmStatus==0">
        <el-button type="primary" @click="submit" :loading="btnLoading">确认</el-button>
        <el-button type="danger" @click="hl" plain icon="el-icon-close" :loading="btnLoading">忽 略</el-button>

        <el-button plain @click="back" icon="el-icon-arrow-left">返 回</el-button>
      </div>
      <div v-else-if="fromDetial.confirmStatus==1&&fromDetial.disposeStatus==0">
        <el-button v-if="fromDetial.warningType =='台账监控异常'" type="primary" @click="tzchuzhi" :loading="btnLoading">处置</el-button>
        <el-button v-else type="primary" @click="submit" :loading="btnLoading">提交</el-button>
        <!--        <el-button type="danger" @click="back" plain icon="el-icon-close">取 消</el-button>-->

        <el-button plain @click="back" icon="el-icon-arrow-left">返 回</el-button>
      </div>
      <div v-else>
        <el-button plain @click="back" icon="el-icon-arrow-left">返 回</el-button>
      </div>

    </div>

    <devBookDetialDialog
      v-if="showCMDBEdit"
      :isShow="showCMDBEdit"
      :ciId="cmdbParams.ciId"
      :configId="cmdbParams.devId"
      :editParams="editParams"
      @refreshDetial="clsjzlCallback"
      @close="showCMDBEdit= false">
    </devBookDetialDialog>
  </div>
</template>

<script>
import {warningDetail, warningConfirm, accessConfirm, disposeConfirm, operationConfirm, warningDispose, tzjkycConfirm, warningDevice, ringDetail, ringConfirm} from "@/api/baoxian/shebeiyidonggaojing"
import Template_newdevice from "@/views/baoxian/shebeiyidonggaojing/components/template_newdevice.vue";
import {mapState, mapGetters} from "vuex";
import Template_ip_mac_jixian_yj from "@/views/baoxian/shebeiyidonggaojing/components/template_ip_mac_jixian_yj.vue";
import Template_tzdevice from "@/views/baoxian/shebeiyidonggaojing/components/template_tzdevice.vue";
import Template_donghuan from "@/views/baoxian/shebeiyidonggaojing/components/template_donghuan.vue";
import {f} from "af-table-column";
import devBookDetialDialog from "@/views/assets/components/devStandingBook/components/devBookDetialDialog.vue";
import {devBookDetail} from "@/api/assets/devStandingBook";
import {getDetail as getHardwarebasictree} from "@/api/device/hardwarebasictree";

export default {
  name: 'shebeiyidongDetial',
  components: {devBookDetialDialog, Template_tzdevice, Template_donghuan, Template_ip_mac_jixian_yj, Template_newdevice,},
  data() {
    return {
      loading: false,
      btnLoading: false,
      fromDetial: {},
      itemsCustom: null,
      itemsJx1: null,
      itemsJx2: null,

      itemsTz1: null,
      itemsTz2: null,

      showCMDBEdit: false,
      cmdbParams: {
        ciId: null,
        devId: null,
      },
      editParams: {},
      dismWidth: 'auto',

      warningChilds: []
    }
  },
  computed: {
    ...mapGetters(["permission", "userDetail"]),
    donghuan(){
      // return this.fromDetial.warningType == '动环监控异常'
      return this.$route.query.warningType == '动环监控异常'
    },
    warningReason(){
      let aaa = '' 
      this.warningChilds.forEach(ele=>{
        if(ele.warningReason){
          aaa += '，'+ele.warningReason
        }
      })

      return this.fromDetial.warningReason + aaa
    },
    warningDetail(){
      let aaa = '' 
      this.warningChilds.forEach(ele=>{
        if(ele.warningDetail){
          aaa += '，'+ele.warningDetail
        }
      })

      return this.fromDetial.warningDetail + aaa
    }
  },
  watch: {
    'fromDetial.warningType'(newVal, oldVal) {
      if (newVal == '台账监控异常') {
        this.$nextTick(() => {
          if (this.$refs.tbTZ2) {
            let width = this.$refs.tbTZ2.$el.clientWidth;
            if (width > 0) {
              this.dismWidth = width / 3 + 2;
            }
          }
        })
      }
    }
  },
  mounted() {
    this.getDetial();

   
  },
  methods: {
    submit() {
      if (this.fromDetial.confirmStatus == 0) {
        //待确认
        let message = this.$route.query.hasChildren ? '确定执行当前数据确认吗（当前数据下存在子告警，执行操作后会同时改变子告警状态）' : '确定执行当前数据确认吗？';
        this.$confirm(message, '提醒', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"}).then(async res => {
          this.btnLoading = true;
          //判断该条下方是否有子告警
          let ids = [];
          if (this.$route.query.hasChildren) {
            //加载子列表
            await warningDevice({warningDevice: this.fromDetial.warningDevice}).then(res => {
              ids = res.data.map(item => {
                return item.id;
              });
            })
          }
          ids = [...ids, this.fromDetial.id];
          warningConfirm(ids).then((res => {
            this.getDetial();
            this.$EventBus.$emit('sbydgjList');
          })).finally(() => {
            this.btnLoading = false;
          })
        });
      } else if (this.fromDetial.confirmStatus == 1) { // 处置
        let warningType = this.fromDetial.warningType;
        if (warningType == '新发现设备') {
          //新设备提交校验
          if (this.$refs.newdevice) {
            this.$refs.newdevice.validate((valid) => {
              if (valid) {
                //准备提交
                this.btnLoading = true;
                operationConfirm(this.fromDetial).then(res => {
                  //刷新当前页面
                  this.getDetial();
                  this.$EventBus.$emit('sbydgjList');
                }).finally(() => {
                  this.btnLoading = false;
                });
              }
            })
          }
        } else if (warningType == 'IP/MAC变更' || warningType == '基线异常') {
          //硬件变化提交校验
          if (this.$refs.ipmacjx) {
            this.$refs.ipmacjx.validate((valid) => {
              if (valid) {
                //准备提交
                this.btnLoading = true;
                accessConfirm(this.fromDetial).then(res => {
                  //刷新当前页面
                  this.getDetial();
                  this.$EventBus.$emit('sbydgjList');
                }).finally(() => {
                  this.btnLoading = false;
                });
              }
            })
          }
        } else if (warningType == '硬件变化') {
          //硬件变化提交校验
          if (this.$refs.ipmacjx) {
            this.$refs.ipmacjx.validate((valid) => {
              if (valid) {
                //准备提交
                this.btnLoading = true;
                disposeConfirm(this.fromDetial).then(res => {
                  //刷新当前页面
                  this.getDetial();
                  this.$EventBus.$emit('sbydgjList');
                }).finally(() => {
                  this.btnLoading = false;
                });
              }
            })
          }
        } else if (warningType == '动环监控异常') {
          //动环监控异常提交校验
          if (this.$refs.donghuan) {
            this.$refs.donghuan.validate((valid) => {
              if (valid) {
                //准备提交
                this.btnLoading = true;
                ringConfirm(this.fromDetial).then(res => {
                  //刷新当前页面
                  this.getDetial();
                  this.$EventBus.$emit('sbydgjList');
                }).finally(() => {
                  this.btnLoading = false;
                });
              }
            })
          }
        } else if (warningType == '台账监控异常') {
          this.$message.info('开发中');
        }
      }
    },

    tzchuzhi() {
      let form = {
        ciId: this.fromDetial.deviceCid,
        ciEntityId: this.fromDetial.deviceId,
        needAction: true
      }

      devBookDetail(form).then(res => {
        if (!res.data.Return) {
          this.$alert('台账暂无详情数据');
          return;
        }
        let resData = res.data.Return;

        let bookDetailForm = {};
        for (let key in resData.attrEntityData) {
          let dataItem = resData.attrEntityData[key];
          bookDetailForm[dataItem.name] = dataItem.actualValueList[0];
        }


        getHardwarebasictree(this.fromDetial.deviceCid).then(ax => {
          this.cmdbParams = {ciId: this.fromDetial.deviceCid, devId: this.fromDetial.deviceId,};
          this.editParams.ciName = ax.data.ciName;
          this.editParams.devDetail = bookDetailForm;
          this.editParams.devid = this.fromDetial.deviceId;
          this.editParams.ciId = this.fromDetial.deviceCid;
          this.editParams.uuid = this.fromDetial.deviceUuid;
          this.editParams.colName = 'frombaox';//来自数据保险→设备异动告警

          this.showCMDBEdit = true;
        })
      })
    },
    hl() {
      //忽略
      let message = this.$route.query.hasChildren ? '确定执行当前数据忽略吗（当前数据下存在子告警，执行操作后会同时改变子告警状态）' : '确定执行当前数据忽略吗？';
      this.$confirm(message, '提醒', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"}).then(async res => {
        this.btnLoading = true;
        //判断该条下方是否有子告警
        let ids = [];
        if (this.$route.query.hasChildren) {
          //加载子列表
          await warningDevice({warningDevice: this.fromDetial.warningDevice}).then(res => {
            ids = res.data.map(item => {
              return item.id;
            });
          });
        }
        ids = [...ids, this.fromDetial.id];

        warningDispose(ids).then((res => {
          this.$message.success('忽略操作成功');
          this.getDetial();
          this.$EventBus.$emit('sbydgjList');
        })).finally(() => {
          this.btnLoading = false;
        })
      });
    },
    back() {
      this.$closePage('/baoxian/shebeiyidonggaojing');
    },
    getDetial() {
      if(this.donghuan){
        this.loading = true;
        ringDetail({id: this.$route.query.id}).then(res => {
          // console.log(900, res)

          let datas = res.data
          datas.disposeUser = datas.disposeUser || this.userDetail.realName;
          datas.disposePhone = datas.disposePhone || this.userDetail.phone;
          datas.disposeDept = datas.disposeDept || this.userDetail.deptName;

          this.fromDetial = datas;
          this.initItems(this.fromDetial);

          warningDevice({warningDevice: this.fromDetial.warningDevice}).then(res => {
            // console.log(900, res)
            this.warningChilds = res.data
          });

        }).finally(() => {
          this.loading = false;
        })
        return
      }

      this.loading = true;
      warningDetail({id: this.$route.query.id}).then(res => {
        let datas = res.data
        datas.disposeUser = datas.disposeUser || this.userDetail.realName;
        datas.disposePhone = datas.disposePhone || this.userDetail.phone;
        datas.disposeDept = datas.disposeDept || this.userDetail.deptName;


        this.fromDetial = datas;
        this.initItems(this.fromDetial);

        warningDevice({warningDevice: this.fromDetial.warningDevice}).then(res => {
          // console.log(900, res)
          this.warningChilds = res.data
        });

      }).finally(() => {
        this.loading = false;
      })
    },
    initItems(data) {
      this.itemsCustom = [];
      this.itemsJx1 = [];
      this.itemsJx2 = [];

      this.itemsTz1 = [];
      this.itemsTz2 = [];
      for (const key in data) {
        const element = data[key];
        if (element == -1 || element == "null") {
          data[key] = ''
        }
      }
      // console.log(8890, this.fromDetial.warningType)
      if (this.fromDetial.warningType == '基线异常') {
        this.itemsJx1.push({fieldName: '最后一次活跃时间', tzInfo: data.gatherLastTime, sjInfo: this.getDateNum(data.gatherLastTime)});
        this.itemsJx1.push({fieldName: '病毒库更新时间', tzInfo: data.gatherLibraryTime, sjInfo: this.getDateNum(data.gatherLibraryTime)});

        this.itemsJx2.push({fieldName: 'IP', tzInfo: data.deviceIp, sjInfo: data.gatherIp});
        this.itemsJx2.push({fieldName: 'MAC', tzInfo: data.deviceMac, sjInfo: data.gatherMac});
        this.itemsJx2.push({fieldName: '出厂序列号', tzInfo: data.deviceFactoryNumber, sjInfo: data.gatherFactoryNumber,});
      } else if (this.fromDetial.warningType == '台账监控异常') {
        this.itemsTz1.push({fieldName: '出场序列号', tzInfo: data.warningReason, sjInfo: null});

        this.itemsTz2.push({fieldName: 'IP', tzInfo: data.deviceIp, sjInfo: data.gatherIp});
        this.itemsTz2.push({fieldName: 'MAC', tzInfo: data.deviceMac, sjInfo: data.gatherMac});
        this.itemsTz2.push({fieldName: '出厂序列号', tzInfo: data.deviceFactoryNumber, sjInfo: data.gatherFactoryNumber,});
      } else if (this.fromDetial.warningType == '动环监控异常') {
        this.itemsCustom.push({fieldName: '所属机房', tzInfo: data.room});
        this.itemsCustom.push({fieldName: '所属机柜', tzInfo: data.cabinet});
        this.itemsCustom.push({fieldName: '出厂序列号', tzInfo: data.deviceFactoryNumber});
        this.itemsCustom.push({fieldName: '出厂日期', tzInfo: data.deviceFactoryDate});        
        this.itemsCustom.push({fieldName: '投运日期', tzInfo: data.oprtDate});        
        this.itemsCustom.push({fieldName: '历史告警次数', tzInfo: data.warningCount});        
        this.itemsCustom.push({fieldName: '历史报修次数', tzInfo: data.repairCount});        
      } else {
        this.itemsCustom.push({fieldName: 'IP', tzInfo: data.deviceIp, sjInfo: data.gatherIp});
        this.itemsCustom.push({fieldName: 'MAC', tzInfo: data.deviceMac, sjInfo: data.gatherMac});
        this.itemsCustom.push({fieldName: '出厂序列号', tzInfo: data.deviceFactoryNumber, sjInfo: data.gatherFactoryNumber});
        this.itemsCustom.push({fieldName: '出厂日期', tzInfo: data.deviceFactoryDate, sjInfo: data.gatherFactoryDate});
        this.itemsCustom.push({fieldName: '磁盘容量（GB）', tzInfo: data.deviceHardDiskSize, sjInfo: data.gatherHardDiskSize});
        this.itemsCustom.push({fieldName: '内存大小（GB）', tzInfo: data.deviceMemorySize, sjInfo: data.gatherMemorySize});
        this.itemsCustom.push({fieldName: '操作系统版本号', tzInfo: data.deviceSystemVersion, sjInfo: data.gatherSystemVersion});
        this.itemsCustom.push({fieldName: '操作系统类型', tzInfo: data.deviceSystemType, sjInfo: data.gatherSystemType});
      }
    },
    getIsSign(value1, value2) {
      if (!this.isEmpty(value1) && !this.isEmpty(value2)) {
        if (value1 !== value2) {
          return true;
        }
      }
      return false;
    },
    isMore90(number) {
      if (!this.isEmpty(number)) {
        if (Number(number) > 90) {
          return true
        }
      }
      return false;
    },
    isEmpty(value) {
      if (value === '' || value == null) {
        return true;
      }
      return false;
    },
    getConfirmStatusText(status) {
      if (status == 0) {
        return '待确认';
      } else if (status == 1) {
        return '已确认';
      } else if (status == 2) {
        return '已忽略';
      }
      return null;
    },
    getDisposeStatusText(status) {
      if (status == 0) {
        return '待处置';
      } else if (status == 1) {
        return '已处置';
      } else if (status == 2) {
        return '已忽略';
      }
      return null;
    },
    getConfirmStatusColor(status) {
      if (status == 0) {
        return '#FAAD15';
      } else if (status == 1) {
        return '#51C41B';
      } else if (status == 2) {
        return '#BFBFBF';
      }
      return null;
    },
    getTagType(type) {
      if (type == '紧急') {
        return 'danger';
      } else if (type == '主要') {
        return 'warning';
      } else if (type == '次要') {
        return '';
      } else if (type == '提示') {
        return 'success';
      }
    },
    showIpMacJixian(formDetial) {
      if (formDetial) {
        if (formDetial.confirmStatus == 1 && (formDetial.warningType == 'IP/MAC变更' || formDetial.warningType == '基线异常' || formDetial.warningType == '硬件变化')) {
          return true;
        }
      }
      return false;
    },
    showNewDevice(formDetial) {
      if (formDetial) {
        if (formDetial.confirmStatus == 1 && (formDetial.warningType == '新发现设备')) {
          return true;
        }
      }
      return false;
    },
    showTZDevice(formDetial) {
      if (formDetial) {
        if (formDetial.confirmStatus == 1 && formDetial.disposeStatus == 1 && formDetial.warningType == '台账监控异常') {
          return true;
        }
      }
      return false;
    },
    showDonghuan(formDetial) {
      //  && formDetial.disposeStatus == 1
      // console.log(9099, formDetial)
      if (formDetial) {
        if ((formDetial.confirmStatus == 1 || formDetial.disposeStatus == 2) && formDetial.warningType == '动环监控异常') {
          return true;
        }
      }
      return false;
    },
    getHisTime(hisTime) {
      if (hisTime) {
        let arrs = hisTime.split(',');
        if (arrs && arrs.length > 0) {
          return arrs;
        }
      }
      return [];
    },
    getDateNum(firstDate) {
      if (!firstDate) {
        return '未知天数';
      }
      let date1 = new Date(firstDate.replace(/-/g, "/"));
      let date2 = new Date();

      const oneDay = 24 * 60 * 60 * 1000;//每天的毫秒数
      return Math.round(Math.abs((date2 - date1) / oneDay));
    },
    clsjzlCallback() {
      //更新处置状态
      tzjkycConfirm({id: this.fromDetial.id}).then(res => {
        this.getDetial();
        this.$EventBus.$emit('sbydgjList');
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.d_root {
  height: 93%;
  padding: 0px 12px 0px 12px;
  overflow-y: auto;
}

.d_top {
  border-radius: 8px;
  background-color: #FFFFFF;
}

.d_center {
  border-radius: 8px;
  background-color: #FFFFFF;
  margin-top: 12px;
}

.d_bottom {
  border-radius: 8px;
  background-color: #FFFFFF;
  margin-top: 12px;
}

.d_start_flow {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
}

//.d_content {
//  background-color: #FFFFFF;
//  border-radius: 8px;
//  height: 100%;
//}

.s_wrap {
  white-space: normal;
}

.i_dpn {
  margin-right: 6px;
}

.d_start {
  display: flex;
  justify-content: flex-start;
}

.v_center {
  display: flex;
  align-items: center;
}

.d_sb {
  display: flex;
  justify-content: space-between;
}

.d_end {
  display: flex;
  justify-content: flex-end;
}

.vh_center {
  display: flex;
  align-items: center;
  justify-content: center
}

.d_line {
  display: block;
  width: 4px;
  margin-right: 12px;
  background-color: #589AF8;
}

.d_line2 {
  width: 4px;
  height: auto;
  margin-right: 12px;
  background-color: #589AF8;
}

.d_title {
  padding: 12px;
}

.s_title {
  font-size: 14px;
  font-weight: bold;
}

.e_hbtn {
  color: #265BE2;
  font-weight: bold;
}

.s_tq {
  color: #265BE2;
}

.s_cjtime {
  margin-left: 12px;
}

.s_ori {
  color: #FFB445;
}
.ellipsis{
  display: inline-block;
  width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}

.d_tdl {
  margin-top: 6px;
}

.d_desc {
  padding: 0px 12px 12px 12px;
}

.d_btm_rtitle {
  font-size: 12px;
}

.d_btmcom {
  height: calc(100% - 62px);
  padding: 0px 12px 12px 12px;
}

.e_tabel {
  height: 99%;
}

.e_tabel1 {
  margin-bottom: 12px;
}

.d_btn {
  margin-top: 12px
}

.infocolor {
  color: #1A93D8;
  margin-left: 4px;
}

.d_cir {
  width: 8px;
  height: 8px;
  margin-right: 6px;
  border-radius: 50%;
}

.d_histime {
  margin-bottom: 6px;
}

.lcn {
  height: 10px !important;
}

/deep/ .el-desc-label {
  background: #E3EEFD;
  font-size: 13px;
  color: #000;
  border-style: solid;
  border-color: #B2D4FA !important;
  border-bottom: 1px;
  width: 130px;
  text-align: center !important;
  white-space: nowrap;
}

/deep/ .el-desc-content {
  background-color: #F8FAFF;
  font-size: 13px;
  border-style: solid;
  border-color: #B2D4FA !important;
  border-bottom: 1px;
  width: 33.33%;
}
</style>

