<!--部门管理新页面 使用中-->
<template>
  <div class="d_root">
    <div class="d_content">
      <el-form :model="queryParams" label-suffix=":" label-width="80px" size="small" class="xt_search_form">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="告警设备" prop="filingNo"  >
              <el-input v-model="queryParams.warningDevice"  placeholder="请输入告警设备" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警类型" clearable>
              <el-select v-model="queryParams.warningType" placeholder="请选择告警类型" clearable>
                <el-option v-for="(item,index) in warnTypeList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警等级" size="small">
              <el-select v-model="queryParams.warningLevel" placeholder="请选择告警等级" clearable>
                <el-option v-for="(item,index) in warnLevelList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="确认状态" clearable>
              <el-select v-model="queryParams.confirmStatus" placeholder="请选择确认状态" clearable>
                <el-option v-for="(item,index) in confirmStatusList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="处置状态" clearable>
              <el-select v-model="queryParams.disposeStatus" placeholder="请选择处置状态" clearable>
                <el-option v-for="(item,index) in handleStatusList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属单位" size="small">
              <xt-tree-lzay-select :formValue="queryParams.receiveUnitName"
                                   :selectType="'CORP'"
                                   @getTreeItem="getuseApplyUnit">
              </xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警时间" clearable>
              <el-date-picker
                v-model="createTimes"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                @change="dataPickerChange"
                placeholder="请选择告警时间"
                clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警来源" clearable>
              <el-select v-model="queryParams.warningSource" placeholder="请选择告警来源" clearable>
                <el-option v-for="(item,index) in warnSourceList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12" class="v_center">
          <el-col :span="8" class=v_center>
            <div class="d_start">
              <div class="d_line"></div>
              <span class="s_title">告警信息列表</span>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="d_end">
              <el-button type="primary" icon="el-icon-search" size="small" @click="getList(null)">查 询</el-button>
              <el-button type="primary" icon="el-icon-refresh-right" plain size="small" @click="handleReset">重 置</el-button>
              <el-button type="primary" size="small" @click="handleTop">单条置顶</el-button>
              <el-button type="primary" size="small" @click="handleOks(null)">批量确认</el-button>
              <el-button type="primary" plain size="small" @click="handleIgnores(null)">批量确认忽略</el-button>
              <el-button type="primary" plain size="small" @click="handleIgnores2(null)">批量处置忽略</el-button>
              <el-button type="primary" size="small" @click="handleExport">导出</el-button>
              <el-button size="small" plain @click="getList">刷 新</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!-- 设备列表 -->
      <el-table ref="table"
                :data="items"
                lazy
                :load="loadData"
                :tree-props="{children:'children',hasChildren:'hasChildren'}"
                row-key="id"
                border
                size="small"
                height="65vh"
                v-loading="loading"
                @row-dblclick="rowDbClcik"
                @select-all="checkBoxChange">
        <el-table-column type="selection" width="30">
          <template slot-scope="scope">
            <div v-if="scope.row.btnStatus != '0'">
              <el-checkbox v-model="scope.row.check"></el-checkbox>
            </div>
          </template>
        </el-table-column>

        <af-table-column label="告警设备" prop="warningDevice" show-overflow-tooltip></af-table-column>
        <el-table-column label="告警等级" prop="warningLevel" width="90" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="getTagType(scope.row.warningLevel)">{{ scope.row.warningLevel }}</el-tag>
          </template>
        </el-table-column>
        <af-table-column label="告警类型" prop="warningType" show-overflow-tooltip align="center"></af-table-column>
        <af-table-column label="告警原因" prop="warningReason" show-overflow-tooltip align="center"></af-table-column>
        <af-table-column label="告警详情" show-overflow-tooltip align="left">
          <template slot-scope="scope">
            <div class="d_two" v-html="heightLighText(scope.row)"></div>
          </template>
        </af-table-column>
        <el-table-column prop="warningBeginTime" width="140" show-overflow-tooltip align="center">
          <template #header>
            <div class="d_start vh_center">
              <span>开始时间</span>
              <el-tooltip content="告警首次产生时间">
                <i class="el-icon-info infocolor"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="warningEndTime" width="140" show-overflow-tooltip align="center">
          <template #header>
            <div class="d_start vh_center">
              <span>结束时间</span>
              <el-tooltip content="告警最后一次产生时间">
                <i class="el-icon-info infocolor"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="告警次数" prop="warningCount" width="90" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="确认状态" prop="confirmStatus" width="90" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <div class="d_start vh_center">
              <div class="d_cir" :style="{backgroundColor:getConfirmStatusColor(scope.row.confirmStatus)}"></div>
              <div>
                <span>{{ getConfirmStatusText(scope.row.confirmStatus) }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="处置状态" prop="disposeStatus" width="90" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <div class="d_start vh_center">
              <div class="d_cir" :style="{backgroundColor:getConfirmStatusColor(scope.row.disposeStatus)}"></div>
              <div>
                <span>{{ getDisposeStatusText(scope.row.disposeStatus) }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <af-table-column label="所属单位" prop="receiveUnitName" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ getUnitName(scope.row.receiveUnitName) }}</span>
          </template>
        </af-table-column>
        <af-table-column label="告警编码" prop="warningNumber" show-overflow-tooltip align="center"></af-table-column>
        <af-table-column label="处置人" prop="disposeUser" show-overflow-tooltip align="center"></af-table-column>
        <af-table-column label="处置时间" prop="disposeTime" show-overflow-tooltip align="center"></af-table-column>
        <af-table-column label="告警来源" prop="warningSource" show-overflow-tooltip align="center"></af-table-column>

        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template slot-scope="scope">
            <div v-if="scope.row.btnStatus != '0'">
              <el-button type="text" size="small" class="e_hbtn" @click="handleOks(scope.row)" v-if="scope.row.confirmStatus == 0">确认</el-button>
              <el-button type="text" size="small" class="e_hbtn" @click="handleChuzhi(scope.row)" v-if="scope.row.confirmStatus == 1 && scope.row.disposeStatus == 0">处置
              </el-button>
              <el-button type="text" size="small" class="e_hbtn" @click="handleIgnores2(scope.row)" v-if="scope.row.warningType == '台账监控异常' && scope.row.disposeStatus == 0 && scope.row.confirmStatus == 1">忽略</el-button>
              <el-button type="text" size="small" class="e_hbtn" @click="handleSee(scope.row)" v-if="scope.row.confirmStatus != 0 && scope.row.disposeStatus != 0">查看
              </el-button>
              <el-button type="text" size="small" class="e_hbtn" @click="handleIgnores(scope.row)" v-if="scope.row.confirmStatus == 0">忽略</el-button>
            </div>

          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination :total="page.total" :page.sync="page.current" :limit.sync="page.size" @pagination="getList"/>
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

import {mapGetters} from "vuex";
import {getDictList} from "@/api/dict";
import XtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";

import {warningList, warningDevice, warningTopping, warningConfirm, warningDispose, warningIgnore, exportExcel, warningDetail, tzjkycConfirm} from "@/api/baoxian/shebeiyidonggaojing"
import devBookDetialDialog from "@/views/assets/components/devStandingBook/components/devBookDetialDialog.vue";
import {devBookDetail} from "@/api/assets/devStandingBook";
import {getDetail as getHardwarebasictree} from "@/api/device/hardwarebasictree";
import {getOperationDetail} from "@/api/device/deviceapply";


export default {
  components: {devBookDetialDialog, XtTreeLzaySelect,},
  data() {
    return {
      loading: false,
      queryParams: {},
      items: [],

      page: {
        current: 1,
        size: 20,
        total: 0,
      },
      selectId: null,

      warnLevelList: null,
      warnTypeList: null,
      confirmStatusList: null,
      handleStatusList: null,
      warnSourceList: null,

      showCMDBEdit: false,
      cmdbParams: {
        ciId: null,
        devId: null,
      },
      editParams: {},

      createTimes: [],
      tzjkycRow: null,

      lazyIds: [],
    }
  },
  mounted() {
    this.getList();
    this.initDict();

    // console.log(this.$store.state.common.govern)
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
  },
  methods: {
    checkBoxChange(scope){
      // console.log(667, scope.length)
      this.items.forEach(ele=>{
        ele.check = !ele.check
      })
    },

    initDict() {
      getDictList('deviceWarnLevel').then(a => {
        this.warnLevelList = a.data;
      });
      getDictList('deviceWarnType').then(a => {
        this.warnTypeList = a.data;
      });
      getDictList('deviceConfirmStatus').then(a => {
        this.confirmStatusList = a.data;
      });
      getDictList('handleStatus').then(a => {
        this.handleStatusList = a.data;
      });
      getDictList('deviceWarnSource').then(a => {
        this.warnSourceList = a.data;
      });
    },
    loadData(tree, treeNode, resolve) {
      //加载子列表
      warningDevice({warningDevice: tree.warningDevice, disposeTime: tree.disposeTime}).then(res => {
        res.data.forEach((item, index) => {
          item.hasChildren = (item.warningShow == 1 ? true : false);
          item.btnStatus = '0';
        });
        resolve(res.data)
      }).catch(err => {
        resolve([])
      })
    },
    handleReset() {
      this.page.current = 1;
      this.page.total = 0;
      this.queryParams = {};
      this.getList();
    },
    getList() {
      this.loading = true;
      let params = {...this.queryParams, ...this.page};
      warningList(params).then(res => {
        this.page.total = res.data.total;
        this.loading = false
        res.data.records.forEach((item, index) => {
          item.hasChildren = (item.warningShow == 1 ? true : false);
          item.children = [];
          item.check = false;
        });
        this.items = res.data.records;

        this.lazyIds.forEach((item, index) => {
          let treeItem = this.$refs.table.store.states.treeData[item];
          if (treeItem) {
            treeItem.loaded = false;
            treeItem.expanded = false
          }
        });
        this.lazyIds = [];
      }).finally(() => {
        this.loading = false;
      })
    },

    //单条置顶
    handleTop() {
      let selectList = this.items.filter(a => a.check);
      if (selectList.length != 1) {
        this.$alert('请选择一条数据', '提示', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"});
        return;
      }

      this.loading = true;
      warningTopping({id: selectList[0].id}).then(res => {
        this.$message.success('置顶操作成功');
        this.getList();
      }).finally(() => {
        this.loading = false;
      });
    },
    //批量确认、单挑确认
    handleOks(row) {
      if (row == null) {
        //批量
        let selectList = this.items.filter(a => a.check);
        if (selectList.length == 0) {
          this.$alert('请选择至少一条数据', '提示', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"});
          return;
        }

        let arrs = selectList.filter(a => a.hasChildren);
        let message = arrs.length > 0 ? `确定执行当前数据确认吗？（选中数据中有${arrs.length}条数据存在子告警，子告警会同时执行确认操作）` : '确定执行当前数据确认吗？';
        this.$confirm(message, '提醒', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"}).then(async res => {
          this.loading = true;

          let ids = [];
          for (let i = 0; i < selectList.length; i++) {
            let item = selectList[i];
            if (item.hasChildren) {
              //加载子列表
              await warningDevice({warningDevice: item.warningDevice, disposeTime: item.disposeTime}).then(res => {
                let tempIds = res.data.map(item => {
                  return item.id;
                });
                ids = [...ids, ...tempIds];
              })
              this.lazyIds.push(item.id);
            }
            ids = [item.id, ...ids];
          }

          warningConfirm(ids).then((res => {
            this.$message.success('批量确认操作成功');
            this.getList();
          })).catch(err => {
            this.lazyIds = []
          }).finally(() => {
            this.loading = false;
          })
        });
      } else {
        //单条
        let message = row.hasChildren ? '确定执行当前数据确认吗（当前数据下存在子告警，执行操作后会同时改变子告警状态）' : '确定执行当前数据确认吗？';
        this.$confirm(message, '提醒', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"}).then(async res => {
          this.loading = true;
          //判断该条下方是否有子告警
          let ids = [];
          if (row.hasChildren) {
            //加载子列表
            await warningDevice({warningDevice: row.warningDevice, disposeTime: row.disposeTime}).then(res => {
              ids = res.data.map(item => {
                return item.id;
              });
            });
            this.lazyIds.push(row.id);
          }
          ids = [...ids, row.id];
          warningConfirm(ids).then((res => {
            this.$message.success('确认操作成功');
            this.getList();
          })).catch(err => {
            this.lazyIds = []
          }).finally(() => {
            this.loading = false;
          })
        });
      }
    },
    //批量忽略，单条忽略
    handleIgnores(row) {
      if (row == null) {
        //批量
        let selectList = this.items.filter(a => a.check);
        if (selectList.length == 0) {
          this.$alert('请选择至少一条数据', '提示', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"});
          return;
        }
        let arrs = selectList.filter(a => a.hasChildren);
        let message = arrs.length > 0 ? `确定执行当前数据忽略吗？（选中数据中有${arrs.length}条数据存在子告警，子告警会同时执行忽略操作）` : '确定要执行批量忽略吗？';
        this.$confirm(message, '提醒', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"}).then(async res => {
          this.loading = true;

          let ids = [];
          for (let i = 0; i < selectList.length; i++) {
            let item = selectList[i];
            if (item.hasChildren) {
              //加载子列表
              await warningDevice({warningDevice: item.warningDevice, disposeTime: item.disposeTime}).then(res => {
                let tempIds = res.data.map(item => {
                  return item.id;
                });
                ids = [...ids, ...tempIds];
              })
              this.lazyIds.push(item.id);
            }
            ids = [item.id, ...ids];
          }
          warningDispose(ids).then((res => {
            this.$message.success('批量忽略操作成功');
            this.getList();
          })).catch(err => {
            this.lazyIds = []
          }).finally(() => {
            this.loading = false;
          })
        });
      } else {
        //单条
        let message = row.hasChildren ? '确定执行当前数据忽略吗（当前数据下存在子告警，执行操作后会同时改变子告警状态）' : '确定执行当前数据忽略吗？';
        this.$confirm(message, '提醒', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"}).then(async res => {
          this.loading = true;

          //判断该条下方是否有子告警
          let ids = [];
          if (row.hasChildren) {
            //加载子列表
            await warningDevice({warningDevice: row.warningDevice, disposeTime: row.disposeTime}).then(res => {
              ids = res.data.map(item => {
                return item.id;
              });
            });
            this.lazyIds.push(row.id);
          }
          ids = [...ids, row.id];
          warningDispose(ids).then((res => {
            this.$message.success('忽略操作成功');
            this.getList();
          })).catch(err => {
            this.lazyIds = []
          }).finally(() => {
            this.loading = false;
          })
        });
      }
    },


    //批量忽略，单条忽略
    handleIgnores2(row) {
      if (row == null) {
        //批量
        let selectList = this.items.filter(a => a.check);
        if (selectList.length == 0) {
          this.$alert('请选择至少一条数据', '提示', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"});
          return;
        }
        let arrs = selectList.filter(a => a.hasChildren);
        let message = arrs.length > 0 ? `确定执行当前数据忽略吗？（选中数据中有${arrs.length}条数据存在子告警，子告警会同时执行忽略操作）` : '确定要执行批量忽略吗？';
        this.$confirm(message, '提醒', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"}).then(async res => {
          this.loading = true;

          let ids = [];
          for (let i = 0; i < selectList.length; i++) {
            let item = selectList[i];
            if (item.hasChildren) {
              //加载子列表
              await warningDevice({warningDevice: item.warningDevice, disposeTime: item.disposeTime}).then(res => {
                let tempIds = res.data.map(item => {
                  return item.id;
                });
                ids = [...ids, ...tempIds];
              })
              this.lazyIds.push(item.id);
            }
            ids = [item.id, ...ids];
          }
          warningIgnore(ids).then((res => {
            this.$message.success('批量忽略操作成功');
            this.getList();
          })).catch(err => {
            this.lazyIds = []
          }).finally(() => {
            this.loading = false;
          })
        });
      } else {
        //单条
        let message = row.hasChildren ? '确定执行当前数据忽略吗（当前数据下存在子告警，执行操作后会同时改变子告警状态）' : '确定执行当前数据忽略吗？';
        this.$confirm(message, '提醒', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"}).then(async res => {
          this.loading = true;

          //判断该条下方是否有子告警
          let ids = [];
          if (row.hasChildren) {
            //加载子列表
            await warningDevice({warningDevice: row.warningDevice, disposeTime: row.disposeTime}).then(res => {
              ids = res.data.map(item => {
                return item.id;
              });
            });
            this.lazyIds.push(row.id);
          }
          ids = [...ids, row.id];
          warningIgnore(ids).then((res => {
            this.$message.success('忽略操作成功');
            this.getList();
          })).catch(err => {
            this.lazyIds = []
          }).finally(() => {
            this.loading = false;
          })
        });
      }
    },
    // 导出
    async handleExport(){
      //批量
      let selectList = this.items.filter(a => a.check);
      // if (selectList.length == 0) {
      //   this.$alert('请选择至少一条数据', '提示', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"});
      //   return;
      // }
      // let arrs = selectList.filter(a => a.hasChildren);
      // let message = arrs.length > 0 ? `确定执行当前数据忽略吗？（选中数据中有${arrs.length}条数据存在子告警，子告警会同时执行忽略操作）` : '确定要执行批量忽略吗？';
      // this.$confirm(message, '提醒', {confirmButtonText: this.$t("submitText"), cancelButtonText: this.$t("cancelText"), type: "warning"}).then(async res => {
        // this.loading = true;

        let ids = [];
        for (let i = 0; i < selectList.length; i++) {
          let item = selectList[i];
          if (item.hasChildren) {
            //加载子列表
            await warningDevice({warningDevice: item.warningDevice, disposeTime: item.disposeTime}).then(res => {
              let tempIds = res.data.map(item => {
                return item.id;
              });
              ids = [...ids, ...tempIds];
            })
            // this.lazyIds.push(item.id);
          }
          ids = [item.id, ...ids];
        }
        this.download(
            "/api/idevelop-data/device/abnormal/warning/exportExcel",
            ids,
            "台账异动告警列表.xlsx"
          )
        // exportExcel(ids).then((res => {
        //   this.$message.success('操作成功');
        //   // this.getList();
        // })).catch(err => {
        //   // this.lazyIds = []
        // }).finally(() => {
        //   this.loading = false;
        // })
      // });
    },



    //台账监控异常 编辑后更新状态
    clsjzlCallback() {
      if (this.tzjkycRow) {
        //更新处置状态
        tzjkycConfirm({id: this.tzjkycRow.id}).then(res => {
          this.tzjkycRow.disposeStatus = 1;
        }).finally(() => {
          this.tzjkycRow = null;
        })
      }
    },

    //处置
    handleChuzhi(row) {
      if (row.warningType !== '台账监控异常') {
        this.gotoDetial(row);
      } else {
        let form = {
          ciId: row.deviceCid,
          ciEntityId: row.deviceId,
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


          getHardwarebasictree(row.deviceCid).then(ax => {
            this.cmdbParams = {ciId: row.deviceCid, devId: row.deviceId,};
            this.editParams.ciName = ax.data.ciName;
            this.editParams.devDetail = bookDetailForm;
            this.editParams.devid = row.deviceId;
            this.editParams.ciId = row.deviceCid;
            this.editParams.uuid = row.deviceUuid;
            this.editParams.colName = 'frombaox';//来自数据保险→设备异动告警

            this.showCMDBEdit = true;
            this.tzjkycRow = row;
          })
        })
      }
    },
    handleSee(row) {
      this.gotoDetial(row);
    },
    rowDbClcik(row, column, event) {
      if (row.btnStatus != '0') {
        this.gotoDetial(row)
        this.$EventBus.$once('sbydgjList', (arg) => {
          this.getList();
        });
      }
    },
    gotoDetial(row) {
      this.lazyIds = [];
      if (row.hasChildren) {
        this.lazyIds = [];
        this.lazyIds.push(row.id);
      }
      this.$router.push({
        path: '/detailRoute',
        query: {
          componentName: 'shebeiyidongDetial',
          routerTitle: '台账异动告警详情',
          id: row.id,
          operationId: row.disposeOrder,
          hasChildren: row.hasChildren,
          warningType: row.warningType
        }
      });
    },

    showArrow(type) {
      if (type === 'CORP' || type === 'DEPT') {
        return true;
      }
      return false;
    },
    getTypeName(type) {
      if (type === 'CORP') {
        return '单位';
      } else if (type === 'DEPT') {
        return '部门';
      } else if (type === 'TEAM') {
        return '班组';
      }
      return '未知';
    },
    getErpName(row) {
      if (row) {
        if (row.type === 'CORP') { // 公司
          return row.erpUnit;
        } else { // 部门 DEPT  班组 TEAM
          return this.getEIObj(row, 'erpObj');
        }
      }
      return null;
    },
    getEIObj(row, type) {
      if (type === 'erpObj') {
        if (!this.isEmpty(row.erpUnit) && !this.isEmpty(row.erpDept)) {
          return row.erpUnit + '/' + row.erpDept
        } else if (!this.isEmpty(row.erpUnit)) {
          return row.erpUnit;
        } else if (!this.isEmpty(row.erpDept)) {
          return row.erpDept;
        }
      } else if (type === 'i6000Obj') {
        if (!this.isEmpty(row.i6000Unit) && !this.isEmpty(row.i6000Dept)) {
          return row.i6000Unit + '/' + row.i6000Dept
        } else if (!this.isEmpty(row.i6000Unit)) {
          return row.i6000Unit;
        } else if (!this.isEmpty(row.i6000Dept)) {
          return row.i6000Dept;
        }
      }
      return null;
    },
    getI6000Name(row) {
      if (row) {
        if (row.type === 'CORP') { // 公司
          return row.i6000Unit;
        } else { // 部门 DEPT  班组 TEAM
          return this.getEIObj(row, 'i6000Obj');
        }
      }
      return null;
    },
    // 获得设备回显
    getuseApplyUnit(val) {
      this.queryParams.receiveUnit = val.id
      this.queryParams.receiveUnitName = val.fullName

      this.$forceUpdate()
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
    heightLighText(row) {
      //warningDetail
      //gatherIp
      //gatherMac
      if (row.warningDetail) {
        let mgText = '';
        if (!this.isEmpty(row.gatherIp) && !this.isEmpty(row.gatherMac)) {
          mgText = `${row.gatherIp}|${row.gatherMac}`;
        } else if (!this.isEmpty(row.gatherIp)) {
          mgText = `${row.gatherIp}`;
        } else if (!this.isEmpty(row.gatherMac)) {
          mgText = `${row.gatherMac}`;
        }
        let reg = new RegExp(mgText, 'gi');
        let newStr = row.warningDetail.replace(reg, (matchedText) => {
          return `<span style="color:#FAAD15;">${matchedText}</span>`
        });
        return newStr
      } else return row.warningDetail;
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

    isEmpty(value) {
      if (value == null || value === '') {
        return true;
      }
      return false;
    },
    dataPickerChange(createTimes) {
      //时间段选择
      if (createTimes != null && createTimes.length > 0) {
        this.queryParams.warningBeginTime = createTimes[0]
        this.queryParams.warningEndTime = createTimes[1]
      } else {
        this.queryParams.warningBeginTime = null
        this.queryParams.warningEndTime = null
      }
    },
    getColumnType(row, column) {
      if (row.btnStatus != '0') {
        column.type = 'selection';
      }
      return null;
    },
    getUnitName(unitName) {
      if (unitName == null || unitName == 'null') {
        return null;
      }
      return unitName;
    }
  }
}
</script>
<style lang="scss" scoped>
.d_root {
  height: 92%;
  padding: 0px 12px 0px 12px;
}

.d_content {
  background-color: #FFFFFF;
  border-radius: 8px;
  height: 100%;
  padding: 12px;
}

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

.s_title {
  font-size: 14px;
  font-weight: bold;
}

.e_hbtn {
  color: #265BE2;
  font-weight: bold;
}

.d_cir {
  width: 8px;
  height: 8px;
  margin-right: 6px;
  border-radius: 50%;
}

.infocolor {
  color: #1A93D8;
  margin-left: 4px;
}

.d_two {
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>

