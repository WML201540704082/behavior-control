<template>
  <div class="xt_page_box desk">
    <div class="desk_t">
      <div class="desk_tl">
        <div class="desk_tlt">
          <img class="rrr" src="../../../assets/desk/character.png" alt="">
          <div class="desk_title">
            待办任务
            <img src="../../../assets/desk/jiantou.png" alt="">
          </div>
          <div class="desk_tabs">
            <el-tabs v-model="activeName" @tab-click="handleTabs">
              <el-tab-pane name="1">
                <span slot="label">待我处理({{ waitHandleNum }})</span>
              </el-tab-pane>
              <el-tab-pane name="2">
                <span slot="label">我处理的</span>
              </el-tab-pane>
              <el-tab-pane name="3">
                <span slot="label">我发起的</span>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="desk_content contents">
          <el-radio-group v-if="allMenuList2.length>0" v-model="radio1" @input="handleOrder">
            <el-radio-button
              :class="{ bbt: true, bbt2: activeName==3 ? true : false } "
              v-for="(item, index) in allMenuList2"
              :key="index"
              :label="item.name"
            >
              <span>{{ item.name }}({{ item.taskNum }})</span>

            </el-radio-button>
          </el-radio-group>
          <div class="table_box">
            <!-- row-key="id" -->
            <el-table
              ref="dataTable"
              stripe
              size="small"
              :data="tableData"
              v-loading="tableLoading"
              :height="tableDataHeight"
            >
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column
                v-for="item in tableCol"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                align="center"
                show-overflow-tooltip
                :formatter="item.formatterText"
              ></el-table-column>
              <el-table-column label="操作" align="center" fixed="right" width="80">
                <template slot-scope="{row}">
                  <el-button type="text" class="list_btn" size="small" @click="handleAudited(row)"
                             v-if="activeName === '1' && row.processType !== '0' && orderType != '投运工单' && orderType != '退运工单' && orderType != '作业计划' && orderType != '作业工单'">
                    审批
                  </el-button>
                  <el-button type="text" class="list_btn" size="small" @click="handleView(row)"
                             v-if="activeName === '2' || activeName === '3'">查看
                  </el-button>
                  <!-- 我发起的-进行中  处置 -->
                  <el-button type="text" class="list_btn" size="small" @click="handleDetail2(row)"
                             v-if="activeName === '3' && radio1 == '进行中' && row.currentProcessId == userInfo.userId">处置
                  </el-button>
                  <!-- 我发起的-进行中  催办 -->
                  <el-popover
                    placement="right"
                    width="500"
                    trigger="click"
                    @show="getCurrentStep(row)"
                  >
                    <el-button
                      slot="reference" type="text" class="list_btn" size="small"
                      v-if="activeName === '3' && radio1 == '进行中' && row.currentProcessId != userInfo.userId"
                      style="margin-left: 10px">
                      催办
                    </el-button>


                    <el-table
                      ref="dataTable"
                      stripe
                      size="small"
                      :data="currentUserList"
                      max-height="400px"
                    >
                      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                      <el-table-column prop="realName" label="审核人" align="center" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="phone" label="联系方式" align="center" show-overflow-tooltip></el-table-column>
                      <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scc">
                          <el-button type="primary" size="mini" plain @click="sendMessage(scc,row)">催 办</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-popover>


                  <template v-if="orderType == '建档工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleDetail(row)"
                               v-if="activeName === '1' && row.processType === '0'">编辑
                    </el-button>
                  </template>
                  <template v-else-if="orderType == '退运工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleDetail(row)"
                               v-if="activeName === '1' && permission.devReturned_handle && row.processStatus == 'hussar_2'">编辑
                    </el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleDetail(row)"
                               v-if="activeName === '1' && permission.devReturned_handle && row.processStatus != 'hussar_2'">处置
                    </el-button>
                  </template>
                  <template v-else-if="orderType == '申请工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleDetail(row)"
                               v-if="activeName === '1' && row.processType === '0'">编辑
                    </el-button>
                  </template>
                  <template v-else-if="orderType == '出库工单'">

                  </template>
                  <template v-else-if="orderType == '投运工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleDetail(row)">处置</el-button>
                  </template>
                  <template v-else-if="orderType == '变更工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleDetail(row)"
                               v-if="activeName === '1' && row.processType === '0'">编辑
                    </el-button>
                  </template>
                  <template v-else-if="orderType == '报修工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleDetail(row)"
                               v-if="activeName === '1' && row.processType === '0'">编辑
                    </el-button>
                  </template>
                  <template v-else-if="orderType == '转资工单'">

                  </template>
                  <template v-else-if="orderType == '报废工单'">

                  </template>
                  <template v-else-if="orderType === '作业计划'">
                    <el-button type="text" class="list_btn" size="small" @click="handleSubmit(row)"
                               v-if="activeName === '1' && row.statusInfo==='待提交'">提交
                    </el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleAudited(row)"
                               v-if="activeName === '1' && row.statusInfo === '已提交'">审批
                    </el-button>
                  </template>
                  <template v-else-if="orderType === '作业工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleSubmit(row)"
                               v-if="activeName === '1' && row.statusInfo==='待提交'">提交
                    </el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleAudited(row)"
                               v-if="activeName === '1' && row.type === '检修工单' && (row.statusInfo === '已提交' || row.statusInfo === '已变更')">审批
                    </el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleFeedBack(row)"
                               v-if="activeName === '1' && (row.statusInfo === '执行中' || row.statusInfo === '待反馈')">反馈
                    </el-button>
                  </template>


                  <!-- <template v-if="orderType == '建档工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleView(row)">查看</el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleDetail(row)" v-if="activeName === '1' && row.processType === '0'">编辑</el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleAudited(row)" v-if="activeName === '1' && row.processType !== '0'">审批</el-button>
                  </template>
                  <template v-else-if="orderType == '退运工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleView(row)">查看</el-button>
                    <el-button type="text" class="list_btn" size="small" v-if="activeName === '1' && permission.devReturned_handle" @click="handleDetail(row)">处置</el-button>
                  </template>
                  <template v-else-if="orderType == '申请工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleView(row)">查看</el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleDetail(row)" v-if="activeName === '1' && row.processType === '0'">编辑</el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleAudited(row)" v-if="activeName === '1' && row.processType !== '0'">审批</el-button>
                  </template>
                  <template v-else-if="orderType == '出库工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleView(row)">查看</el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleAudited(row)" v-if="activeName === '1'">处理</el-button>
                  </template>
                  <template v-else-if="orderType == '投运工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleDetail(row)">处置</el-button>
                  </template>
                  <template v-else-if="orderType == '变更工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleView(row)">查看</el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleDetail(row)" v-if="activeName === '1' && row.processType === '0'">编辑</el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleAudited(row)" v-if="activeName === '1' && row.processType !== '0'">审批</el-button>
                  </template>
                  <template v-else-if="orderType == '报修工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleView(row)">查看</el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleDetail(row)" v-if="activeName === '1' && row.processType === '0'">编辑</el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleAudited(row)" v-if="activeName === '1'  && row.processType !== '0'">审批</el-button>
                  </template>
                  <template v-else-if="orderType == '转资工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleView(row)">查看</el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleAudited(row)" v-if="activeName === '1'">处理</el-button>
                  </template>
                  <template v-else-if="orderType == '报废工单'">
                    <el-button type="text" class="list_btn" size="small" @click="handleView(row)">查看</el-button>
                    <el-button type="text" class="list_btn" size="small" @click="handleAudited(row)" v-if="activeName === '1'">处理</el-button>
                  </template> -->
                </template>
              </el-table-column>
            </el-table>
            <pagination
              class="pagination111"
              :total="total"
              :smalla="true"
              :pageSizes="[5,10,20,50,100,200]"
              :page.sync="searchForm.current"
              :limit.sync="searchForm.size"
              @pagination="getOrderList"
            />
          </div>
        </div>
      </div>
      <div class="desk_tr">
        <div class="desk_title">
          IP资源
          <img src="../../../assets/desk/jiantou.png" alt="">
        </div>
        <div class="contents" style="margin-bottom: 15px;">
          <div class="desk_ip">
            <div class="desk_ip_l">
              <div class="desk_ip_total">
                <div class="zhi1">{{ ipTotal }}</div>
                <div class="zhi2">IP地址总数</div>
              </div>
            </div>
            <div class="desk_ip_r">
              <div class="desk_ip_nei desk_ip_neit">
                <div class="desk_ip_nei1">
                  <img src="../../../assets/desk/nei.png" alt="">
                  <div>内网</div>
                </div>
                <div class="desk_ip_nei2">
                  <span class="dian"></span>
                  <span class="desk_ip_nei_z1">已分配</span>
                  <span class="desk_ip_nei_z2">{{ intranet.assignNumber }}</span>
                </div>
                <div class="desk_ip_nei2">
                  <span class="dian"></span>
                  <span class="desk_ip_nei_z1">未分配</span>
                  <span class="desk_ip_nei_z2">{{ intranet.undistributedNumber }}</span>
                </div>
                <div class="desk_ip_nei2">
                  <span class="dian"></span>
                  <span class="desk_ip_nei_z1">IP使用率</span>
                  <span class="desk_ip_nei_z2">{{ intranet.usageRate * 100 }}%</span>
                </div>
              </div>
              <div class="desk_ip_nei desk_ip_neib">
                <div class="desk_ip_nei1 desk_ip_nei11">
                  <img src="../../../assets/desk/wai.png" alt="">
                  <div>外网</div>
                </div>
                <div class="desk_ip_nei2">
                  <span class="dian"></span>
                  <span class="desk_ip_nei_z1">已分配</span>
                  <span class="desk_ip_nei_z2">{{ outernet.assignNumber }}</span>
                </div>
                <div class="desk_ip_nei2">
                  <span class="dian"></span>
                  <span class="desk_ip_nei_z1">未分配</span>
                  <span class="desk_ip_nei_z2">{{ outernet.undistributedNumber }}</span>
                </div>
                <div class="desk_ip_nei2">
                  <span class="dian"></span>
                  <span class="desk_ip_nei_z1">IP使用率</span>
                  <span class="desk_ip_nei_z2">{{ outernet.usageRate * 100 }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="desk_title">
          快捷入口
          <img src="../../../assets/desk/jiantou.png" alt="">
        </div>
        <div class="contents">
          <div class="desk_quick">
            <div class="desk_quick_item" @click="$router.push('/device/devRecord')">
              <img src="../../../assets/desk/jiandang.png" alt="">
              建档工单
            </div>
            <div class="desk_quick_item" @click="$router.push('/operation/devOperation')">
              <img src="../../../assets/desk/touyun.png" alt="">
              投运工单
            </div>
            <div class="desk_quick_item" @click="$router.push('/operation/devChange')">
              <img src="../../../assets/desk/biangeng.png" alt="">
              变更工单
            </div>
            <div class="desk_quick_item" @click="$router.push('/operation/devRepair')">
              <img src="../../../assets/desk/baoxiu.png" alt="">
              报修工单
            </div>
            <div class="desk_quick_item" @click="$router.push('/device/capitalTransfer')">
              <img src="../../../assets/desk/zhuanzi.png" alt="">
              转资工单
            </div>
            <div class="desk_quick_item" @click="$router.push('/device/devApply')">
              <img src="../../../assets/desk/shenqing.png" alt="">
              申请工单
            </div>
            <div class="desk_quick_item" @click="$router.push('/device/devInBound')">
              <img src="../../../assets/desk/ruku.png" alt="">
              入库工单
            </div>
            <div class="desk_quick_item" @click="$router.push('/operation/devReturned')">
              <img src="../../../assets/desk/tuiyun.png" alt="">
              退运工单
            </div>
            <div class="desk_quick_item" @click="$router.push('/operation/devScrapped')">
              <img src="../../../assets/desk/baofei.png" alt="">
              报废工单
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="desk_b">
      <div class="desk_bl">
        <div class="desk_title">
          告警处置一周统计
          <img src="../../../assets/desk/jiantou.png" alt="">
        </div>
        <div class="contents">
          <!-- <div class="desk_quick"></div> -->
          <warningDispose></warningDispose>
        </div>
      </div>
      <div class="desk_br">
        <div class="desk_title">
          实时告警信息
          <img src="../../../assets/desk/jiantou.png" alt="">
        </div>
        <div class="contents">
          <!-- <div class="desk_quick"></div> -->
          <warningInfo></warningInfo>
        </div>
      </div>
    </div>

    <!-- 审批弹窗 -->
    <touyunForm
      v-if="showOperate"
      :isShow="showOperate"
      :orderDeatil="orderDeatil"
      :orderType="orderType"
      :processKeys="processKeys"
      @close="showOperate = false"
      @submitOperate="submitOperate"
    ></touyunForm>
  </div>
</template>

<script>
  import {
    todoList,
    finishList,
    desklistSBJD,
    desklistSBZZ,
    deskOrderNum,
    desklistSBSQ,
    desklistSBCK,
    desklistSBTY,
    desklistSBBX,
    desklistSBBG,
    returnedDeskList,
    scarpDeskList,

    benchFinishList,
    completeList,
    wnderwayList,
    ipAll,
    ipAssign,
    completeNumber
  } from "@/api/personalDesk/index"
  import {processDict, queryAssignee, pressDo} from "@/api/process/index"
  import {getDictCmdbList, getDictList} from "@/api/dict";
  // import operateForm from '../components/operateForm'
  import touyunForm from '../components/approve/touyunForm'

  import {mapGetters} from "vuex";

  import warningDispose from "../components/warningDispose"
  import warningInfo from "../components/warningInfo"

  // 新增部分
  import {waitForHandle, waitForHandleNum, myHandle, mySubmit} from "@/api/personalDesk/xcnanr"
  import {submitInspection as submitInspectionPlan} from "@/api/xcnanr/inspectionPlan"
  import {submit as submitRepairPlan} from "@/api/xcnanr/repairPlan"
  import {submitRepairOrder} from '@/api/xcnanr/repairOrder'

  export default {
    components: {touyunForm, warningDispose, warningInfo},
    data() {
      return {
        currentUserList: [],

        orderType: undefined,

        deviceTypeList: [],
        deviceCategoryList: [],
        ipTotal: 0,
        intranet: {
          assignNumber: 0,
          undistributedNumber: 0,
          usageRate: 0
        },
        outernet: {
          assignNumber: 0,
          undistributedNumber: 0,
          usageRate: 0
        },

        activeName: '1',
        processKeys: 'bpm_sbjd',
        searchForm: {
          current: 1,
          size: 5,
        },
        tableCol: [],
        tableData: [],
        tableHeight: undefined,
        tableLoading: false,
        tableDataHeight: '280px',
        total: 0,
        processSteps: [],

        radio1: "",
        allMenuList: [
{
            href: '/device/devRecord',
            permissionFlag: 'deviceRecord',
            name: '建档工单',
            textColor: '#',
            backColor: 'rgba(76,152,247, 0.2)',
            icon: require('@/assets/personWork/jiandang_icon.png'),
            image: require('@/assets/personWork/blue_icon.png'),
            selectImage: require('@/assets/personWork/blue_selected.png'),
            unselectImage: require('@/assets/personWork/blue_unselected.png'),
            taskNum: 0,
            processKeys: 'bpm_sbjd',
            listApi: desklistSBJD,
            tableCol: [
              {
                prop: 'filingNo',
                label: '单号',
                width: '150px'
              },
              // {
              //   prop: 'processStatus',
              //   label: '流程节点',
              //   width: '100px',
              //   formatterText: (row, column, cellValue, index) => {
              //     for(let i=0; i<this.processSteps.length; i++) {
              //       let item = this.processSteps[i]
              //       if(item.node === cellValue) return item.nodeName
              //     }
              //   }
              // },
              // {
              //   prop: 'deviceCategory',
              //   label: '设备分类',
              //   width: '100px',
              //   formatterText: (row, column, cellValue, index) => {
              //     for(let i=0; i<this.deviceCategoryList.length; i++) {
              //       let item = this.deviceCategoryList[i]
              //       if(item.dictKey === cellValue) return item.dictValue
              //     }
              //   }
              // },
              {
                prop: 'deviceType',
                label: '设备类型',
                width: '100px',
                formatterText: (row, column, cellValue, index) => {
                  for (let i = 0; i < this.deviceTypeList.length; i++) {
                    let item = this.deviceTypeList[i]
                    if (item.dictKey === cellValue) return item.dictValue
                  }
                }
              },
              {
                prop: 'deviceNum',
                label: '设备数量',
                width: '80px',
              },
              {
                prop: 'ownerUnitName',
                label: '产权单位',
                width: '100px',
              },
              {
                prop: 'propertyDeptName',
                label: '产权部门',
                width: '130px',
              },
              {
                prop: 'receiverName',
                label: '发起人',
                width: '100px',
              },
              {
                prop: 'submitTime',
                label: '发起时间',

              },
            ],
          },
{
            href: '/device/capitalTransfer',
            permissionFlag: 'capitalTransfer',
            name: '转资工单',
            icon: require('@/assets/personWork/zhuanzi_icon.png'),
            image: require('@/assets/personWork/green_icon.png'),
            selectImage: require('@/assets/personWork/green_selected.png'),
            unselectImage: require('@/assets/personWork/green_unselcted.png'),
            tableCol: [
              {
                prop: 'filingNo',
                label: '单号',
                // width: '100px',
              },
              // {
              //   prop: 'processStatus',
              //   label: '流程节点',
              //   width: '100px',
              //   formatterText: (row, column, cellValue, index) => {
              //     for(let i=0; i<this.processSteps.length; i++) {
              //       let item = this.processSteps[i]
              //       if(item.node === cellValue) return item.nodeName
              //     }
              //   }
              // },
              // {
              //   prop: 'deviceCategory',
              //   label: '设备分类',
              //   width: '100px',
              //   formatterText: (row, column, cellValue, index) => {
              //     for(let i=0; i<this.deviceCategoryList.length; i++) {
              //       let item = this.deviceCategoryList[i]
              //       if(item.dictKey === cellValue) return item.dictValue
              //     }
              //   }
              // },
              {
                prop: 'deviceType',
                label: '设备类型',
                width: '100px',
                formatterText: (row, column, cellValue, index) => {
                  for (let i = 0; i < this.deviceTypeList.length; i++) {
                    let item = this.deviceTypeList[i]
                    if (item.dictKey === cellValue) return item.dictValue
                  }
                }
              },
              {
                prop: 'deviceNum',
                label: '设备数量',
                width: '100px',
              },
              {
                prop: 'ownerUnitName',
                label: '产权单位',
                width: '100px',
              },
              {
                prop: 'propertyDeptName',
                label: '产权部门',
                width: '100px',
              },
              {
                prop: 'realName',
                label: '发起人',
                width: '100px',
              },
              {
                prop: 'receiverTime',
                label: '发起时间',
                // width: '100px',
              },
            ],
            textColor: '#5cdbd3',
            backColor: 'rgba(9,219,211, 0.2)',
            taskNum: 0,
            processKeys: 'bpm_sbzz',
            listApi: desklistSBZZ,
          },
{
            href: '/device/devApply',
            permissionFlag: 'deviceapply',
            name: '申请工单',
            icon: require('@/assets/personWork/shenqing_icon.png'),
            image: require('@/assets/personWork/blue_icon.png'),
            selectImage: require('@/assets/personWork/blue_selected.png'),
            unselectImage: require('@/assets/personWork/blue_unselected.png'),
            tableCol: [
              {
                prop: 'applyNo',
                label: '单号',
                width: 170
              },
              {
                prop: 'deviceType',
                label: '设备类型',
                formatterText: (row, column, cellValue, index) => {
                  for (let i = 0; i < this.deviceTypeList.length; i++) {
                    let item = this.deviceTypeList[i]
                    if (item.dictKey === cellValue) return item.dictValue
                  }
                }
              },
              {
                prop: 'applyNum',
                label: '申请数量',
              },
              {
                prop: 'applyReason',
                label: '申请原因',
              },
              {
                prop: 'receiveDutyPersonName',
                label: '责任人',
              },
              {
                prop: 'receiveDutyPhone',
                label: '责任人联系方式',
                width: '130px',
              },
              {
                prop: 'oldToNew',
                label: '以旧换新',
                formatterText: (row, column, cellValue, index) => {
                  if (cellValue === '1') {
                    return '否';
                  } else {
                    return '是';
                  }
                }
              },
              // {
              //   prop: 'processStatus',
              //   label: '流程节点',
              //   formatterText: (row, column, cellValue, index) => {
              //     for(let i=0; i<this.processSteps.length; i++) {
              //       let item = this.processSteps[i]
              //       if(item.node === cellValue){
              //         // row.processType = item.type
              //         return item.nodeName
              //       }
              //     }
              //   }
              // },
              {
                prop: 'submitTime',
                label: '发起时间',
              },
            ],
            textColor: '#ffa940',
            backColor: 'rgba(255,169,64, 0.2)',
            taskNum: 0,
            processKeys: 'bpm_sbsqckty',
            listApi: desklistSBSQ,
          },
          {
            href: '/device/devOutBound',
            permissionFlag: 'deviceoutbound',
            name: '出库工单',
            icon: require('@/assets/personWork/chuku_icon.png'),
            image: require('@/assets/personWork/green_icon.png'),
            selectImage: require('@/assets/personWork/green_selected.png'),
            unselectImage: require('@/assets/personWork/green_unselcted.png'),
            tableCol: [
              {
                prop: 'outboundNo',
                label: '出库单号',
              },
              // {
              //   prop: 'processStatus',
              //   label: '流程节点',
              //   // width: 90,
              //   formatterText: (row, column, cellValue, index) => {
              //     for(let i=0; i<this.processSteps.length; i++) {
              //       let item = this.processSteps[i]
              //       if(item.node === cellValue) return item.nodeName
              //     }
              //   }
              // },
              // {
              //   prop: 'deviceCategory',
              //   label: '设备分类',
              //   // width: 90,
              //   formatterText: (row, column, cellValue, index) => {
              //     for(let i=0; i<this.deviceCategoryList.length; i++) {
              //       let item = this.deviceCategoryList[i]
              //       if(item.dictKey === cellValue) return item.dictValue
              //     }
              //   }
              // },
              {
                prop: 'deviceType',
                label: '设备类型',
                // width: 120,
                formatterText: (row, column, cellValue, index) => {
                  for (let i = 0; i < this.deviceTypeList.length; i++) {
                    let item = this.deviceTypeList[i]
                    if (item.dictKey === cellValue) return item.dictValue
                  }
                }
              },
              {
                prop: 'applyNum',
                label: '出库数量',
                width: 80
              },
              {
                prop: 'warehouseName',
                label: '所在仓库',
              },
              // {
              //   prop: 'applyUserName',
              //   label: '申请人',
              // },
              {
                prop: 'oldToNew',
                label: '以旧换新',
                width: 90,
                formatterText: (row, column, cellValue, index) => {
                  if (cellValue === '1') {
                    return '否';
                  } else {
                    return '是';
                  }
                }
              },
              {
                prop: 'applyNo',
                label: '设备申请编号',
              },
              // {
              //   prop: 'outboundTime',
              //   label: '出库时间',
              // },
            ],
            textColor: '#ff85c0',
            backColor: 'rgba(255,133,192, 0.2)',
            taskNum: 0,
            processKeys: 'bpm_sbsqckty',
            listApi: desklistSBCK,
          },
          {
            href: '/operation/devOperation',
            permissionFlag: 'deviceoperation',
            name: '投运工单',
            icon: require('@/assets/personWork/touyun_icon.png'),
            image: require('@/assets/personWork/blue_icon.png'),
            selectImage: require('@/assets/personWork/blue_selected.png'),
            unselectImage: require('@/assets/personWork/blue_unselected.png'),
            tableCol: [
              {
                prop: 'operationNo',
                label: '单号',
              },
              {
                prop: 'applyUserName',
                label: '申请人',
              },
              {
                prop: 'receiveDutyDeptName',
                label: '申请部门',
              },
              {
                prop: 'deviceType',
                label: '设备类型',
                width: '100px',
                formatterText: (row, column, cellValue, index) => {
                  for (let i = 0; i < this.deviceTypeList.length; i++) {
                    let item = this.deviceTypeList[i]
                    if (item.dictKey === cellValue) return item.dictValue
                  }
                }
              },
              {
                prop: 'operationNum',
                label: '设备数量',
                formatterText: (row, column, cellValue, index) => {
                  return cellValue < 0 ? 0 : cellValue
                }
              },
              {
                prop: 'oldToNew',
                label: '以旧换新',
                formatterText: (row, column, cellValue, index) => {
                  return cellValue === '0' ? '是' : '否'
                }
              },
              {
                prop: 'applyDate',
                label: '发起时间',
              },
              // {
              //   prop: 'processStatus',
              //   label: '流程节点',
              //   formatterText: (row, column, cellValue, index) => {
              //     for(let i=0; i<this.processSteps.length; i++) {
              //       let item = this.processSteps[i]
              //       if(item.node === cellValue) return item.nodeName
              //     }
              //   }
              // },

            ],
            textColor: '#9254de',
            backColor: 'rgba(146,84,222, 0.2)',
            taskNum: 0,
            processKeys: 'bpm_sbsqckty',
            listApi: desklistSBTY,
          },
          {
            href: '/operation/devRepair',
            permissionFlag: 'repair',
            name: '报修工单',
            icon: require('@/assets/personWork/baoxiu_icon.png'),
            image: require('@/assets/personWork/green_icon.png'),
            selectImage: require('@/assets/personWork/green_selected.png'),
            unselectImage: require('@/assets/personWork/green_unselcted.png'),
            tableCol: [
              {
                prop: 'filingNo',
                label: '单号',
              },
              // {
              //   prop: 'processStatus',
              //   label: '流程节点',
              //   formatterText: (row, column, cellValue, index) => {
              //     for(let i=0; i<this.processSteps.length; i++) {
              //       let item = this.processSteps[i]
              //       if(item.node === cellValue) return item.nodeName
              //     }
              //   }
              // },
              {
                prop: 'repairType',
                label: '报修类型',
                formatterText: (row, column, cellValue, index) => {
                  for (let i = 0; i < this.repairTypeList.length; i++) {
                    if (this.repairTypeList[i].dictKey === cellValue) return this.repairTypeList[i].dictValue
                  }
                }
              },
              {
                prop: 'repairLevel',
                label: '报修等级',
                formatterText: (row, column, cellValue, index) => {
                  for (let i = 0; i < this.repairLevelList.length; i++) {
                    if (this.repairLevelList[i].dictKey === cellValue) return this.repairLevelList[i].dictValue
                  }
                }
              },
              {
                prop: 'applyUserName',
                label: '报修人',
              },
              {
                prop: 'phone',
                label: '联系方式',
              },
              {
                prop: 'description',
                label: '故障描述',
              },
              {
                prop: 'receiverTime',
                label: '报修时间',
              },

              // {
              //   prop: 'repairDeviceCount',
              //   label: '报修设备数',
              // },

              // {
              //   prop: 'applyUnitName',
              //   label: '申请单位',
              // },
              // {
              //   prop: 'applyDeptName',
              //   label: '申请部门',
              // },
            ],
            textColor: '#409EFF',
            backColor: 'rgba(76,152,247, 0.2)',
            taskNum: 0,
            processKeys: 'bpm_sbbx',
            listApi: desklistSBBX
          },
          {
            href: '/operation/devChange',
            permissionFlag: 'change',
            name: '变更工单',
            icon: require('@/assets/personWork/biangeng_icon.png'),
            image: require('@/assets/personWork/green_icon.png'),
            selectImage: require('@/assets/personWork/green_selected.png'),
            unselectImage: require('@/assets/personWork/green_unselcted.png'),
            tableCol: [
              {
                prop: 'filingNo',
                label: '单号',
              },
              {
                prop: 'changeType',
                label: '变更类型',
                formatterText: (row, column, cellValue, index) => {
                  for (let i = 0; i < this.changeTypeList.length; i++) {
                    let item = this.changeTypeList[i]
                    if (item.dictKey === cellValue) return item.dictValue
                  }
                }
              },
              // {
              //   prop: 'processStatus',
              //   label: '流程节点',
              //   formatterText: (row, column, cellValue, index) => {
              //     for(let i=0; i<this.processSteps.length; i++) {
              //       let item = this.processSteps[i]
              //       if(item.node === cellValue) return item.nodeName
              //     }
              //   }
              // },
              {
                prop: 'deviceCount',
                label: '变更设备数',
              },
              {
                prop: 'applyUserName',
                label: '申请人',
              },
              // {
              //   prop: 'applyUnitName',
              //   label: '申请单位',
              // },
              {
                prop: 'applyDeptName',
                label: '申请部门',
              },
              {
                prop: 'receiverTime',
                label: '发起时间',
              },
            ],
            textColor: '#ffa940',
            backColor: 'rgba(255,169,64, 0.2)',
            taskNum: 0,
            processKeys: 'bpm_sbbg',
            listApi: desklistSBBG,

          },
          {
            href: '/operation/devReturned',
            permissionFlag: 'devReturned',
            name: '退运工单',
            icon: require('@/assets/personWork/tuiyun_icon.png'),
            image: require('@/assets/personWork/blue_icon.png'),
            selectImage: require('@/assets/personWork/blue_selected.png'),
            unselectImage: require('@/assets/personWork/blue_unselected.png'),
            tableCol: [
              {
                prop: 'filingNo',
                label: '单号',
              },
              {
                prop: 'deviceReturnNum',
                label: '退运数量',
              },
              {
                prop: 'returnReason',
                label: '退运原因',
              },
              {
                prop: 'acceptUserName',
                label: '申请人',
              },
              {
                prop: 'applyDeptName',
                label: '申请部门',
              },

              // {
              //   prop: 'acceptPhone',
              //   label: '联系电话',
              // },
              {
                prop: 'acceptTime',
                label: '发起时间',
              },
            ],
            textColor: '#ff7875',
            backColor: 'rgba(255,120,117, 0.2)',
            taskNum: 0,
            processKeys: 'bpm_sbty',
            listApi: returnedDeskList,
          },
          {
            href: '/operation/devScrapped',
            permissionFlag: 'devScrap',
            name: '报废工单',
            icon: require('@/assets/personWork/baofei_icon.png'),
            image: require('@/assets/personWork/gray_icon.png'),
            selectImage: require('@/assets/personWork/gray.png'),
            unselectImage: require('@/assets/personWork/gray.png'),
            tableCol: [
              {
                prop: 'filingNo',
                label: '单号',
              },
              {
                prop: 'applyDeptName',
                label: '申请部门',
              },
              {
                prop: 'deviceNum',
                label: '设备数量',
              },
              // {
              //   prop: 'originalValue',
              //   label: '资产原值',
              // }, {
              //   prop: 'netWorth',
              //   label: '资产净值',
              // },
              {
                prop: 'scrapReason',
                label: '报废原因',
                formatterText: (row, column, cellValue, index) => {
                  for (let i = 0; i < this.scrapReasonList.length; i++) {
                    if (this.scrapReasonList[i].dictKey === cellValue) return this.scrapReasonList[i].dictValue
                  }
                }
              }, {
                prop: 'scrapTime',
                label: '发起时间',
              },

            ],
            textColor: '#919191',
            backColor: 'rgba(145,145,145, 0.2)',
            taskNum: 0,
            processKeys: 'bpm_sbbf',
            orderNoList: '',
            listApi: scarpDeskList,
          },
          {
                      // href: '/operation/devOperation',
                      permissionFlag: 'planOperation',
                      name: '作业计划',
                      icon: require('@/assets/personWork/touyun_icon.png'),
                      image: require('@/assets/personWork/blue_icon.png'),
                      selectImage: require('@/assets/personWork/blue_selected.png'),
                      unselectImage: require('@/assets/personWork/blue_unselected.png'),
                      tableCol: [
                        {
                          prop: 'code',
                          label: '计划编号',
                        },
                        {
                          prop: 'type',
                          label: '计划类型',
                          width: '100px'
                        },
                        {
                          prop: 'fillPerson',
                          label: '填报人'
                        },
                        {
                          prop: 'fillTime',
                          label: '填报时间',
                        },
                        {
                          prop: 'statusInfo',
                          label: '计划状态',
                          width: '100px'
                        },
                      ],
                      textColor: '#9254de',
                      backColor: 'rgba(146,84,222, 0.2)',
                      taskNum: 0,
                      processKeys: 'bpm_plan',
                      listApi: waitForHandle,
                    },
                    {
                      // href: '/operation/devOperation',
                      permissionFlag: 'workOrderOperation',
                      name: '作业工单',
                      icon: require('@/assets/personWork/touyun_icon.png'),
                      image: require('@/assets/personWork/blue_icon.png'),
                      selectImage: require('@/assets/personWork/blue_selected.png'),
                      unselectImage: require('@/assets/personWork/blue_unselected.png'),
                      tableCol: [
                        {
                          prop: 'code',
                          label: '工单编号',
                          width: '150px'
                        },
                        {
                          prop: 'type',
                          label: '工单类型',
                          width: '80px'
                        },
                        {
                          prop: 'fillPerson',
                          label: '填报人',
                          width: '70px'
                        },
                        {
                          prop: 'startTime',
                          label: '开始时间',
                        },
                        {
                          prop: 'finishTime',
                          label: '结束时间',
                        },
                        {
                          prop: 'statusInfo',
                          label: '状态',
                          width: '80px',
                          formatterText: (row, column, cellValue, index) => {
                            return cellValue === '已变更' ? "执行中": cellValue
                          }
                        },

                      ],
                      textColor: '#9254de',
                      backColor: 'rgba(146,84,222, 0.2)',
                      taskNum: 0,
                      processKeys: 'bpm_workOrder',
                      listApi: waitForHandle,
                    }
        ],
        allMenuList2: [],
        waitHandleNum: 0,
        chuli: [
          {
            name: '我处理的',
            tableCol: [
              {
                prop: 'businessId',
                label: '单号',
                width: '160px'
              },
              {
                prop: 'processName',
                label: '工单类型',
                width: '100px'
              },
              {
                prop: 'processing',
                label: '处理时间',
                width: '140px',
              },
              {
                prop: 'processResult',
                label: '处理结果',
                // width: '100px',
              },

            ],
          },
        ],

        wancheng: [
          {
            name: '进行中',
            taskNum: 0,
            tableCol: [
              {
                prop: 'businessId',
                label: '单号',
                width: '160px'
              },
              {
                prop: 'processName',
                label: '工单类型',
                width: '100px'
              },
              {
                prop: 'sponsorTime',
                label: '发起时间',
                width: '140px',
              },
              {
                prop: 'nodeCurrent',
                label: '当前流程节点',
                width: '130px'
                // formatterText: (row, column, cellValue, index) => {
                //   for(let i=0; i<this.processSteps.length; i++) {
                //     let item = this.processSteps[i]
                //     if(item.node === cellValue) return item.nodeName
                //   }
                // }
              },
              {
                prop: 'currentProcess',
                label: '当前处理人',
                // width: '100px',
              },

            ],
          },
          {
            name: '已完成',
            taskNum: 0,
            tableCol: [
              {
                prop: 'businessId',
                label: '单号',
                width: '160px'
              },
              {
                prop: 'processName',
                label: '工单类型',
                width: '100px'
                // formatterText: (row, column, cellValue, index) => {
                //   for(let i=0; i<this.deviceTypeList.length; i++) {
                //     let item = this.deviceTypeList[i]
                //     if(item.dictKey === cellValue) return item.dictValue
                //   }
                // }
              },
              {
                prop: 'sponsorTime',
                label: '发起时间',
                width: '140px',
              },
              {
                prop: 'explain',
                label: '申请业务说明',
                // width: '100px',
              },


            ],
          },
        ],

        scrapReasonList: [],
        repairTypeList: [],
        repairLevelList: [],
        changeTypeList: [],
        menuList: [],

        // 操作弹窗
        showOperate: false,
        orderDeatil: null,
        // 新增作业计划作业工单数据
        planNum: 0,
        workOrderNum: 0
      }
    },
    computed: {
      ...mapGetters(["permission", "userInfo", "userDetail"]),
    },
    created() {
      this.allMenuList2 = this.allMenuList

      this.initIp()

      // benchFinishList({
      //   currentPage: 1,
      //   pageSize: 20
      // }).then(res=>{
      // })
      // completeList({
      //   currentPage: 1,
      //   pageSize: 20
      // }).then(res=>{
      // })
      // wnderwayList({
      //   currentPage: 1,
      //   pageSize: 20
      // }).then(res=>{
      // })


    },
    async mounted() {
      this.tableLoading = true
      //加载字典--设备类型
      await this.getCmdbDictList("1097745969774592");
      //加载字典--设备分类
      await this.getCmdbDictList("1097745625841664");
      //加载字典--设备分类
      await this.getCmdbDictList("1131281812619264");
      this.getDictList('device_change_type')
      this.getDict()

      this.initPage()
    },
    methods: {
      getCurrentStep(row) {
        queryAssignee({businessKey: row.businessId}).then(res => {
          this.currentUserList = res.data
        })
      },
      sendMessage(scc, row2) {
        let params = {
          filingCode: row2.businessId,
          phone: scc.row.phone,
          type: row2.processCode,
        }

        pressDo(params).then(res => {
          this.$message.success("操作成功！")
        })
      },


      submitOperate() {
        this.showOperate = false
        this.getOrderList()
        this.getNum()
      },

      handleView(row) {
        if (row.processName == '设备建档') {
          this.$router.push({
            path: '/detailRoute',
            query: {
              id: row.id,
              componentName: 'devRecordDetail',
              routerTitle: '设备建档详情',
              tuiyun: true,
            }
          });
        } else if (row.processName == '设备申请') {
          this.$router.push({
            path: '/detailRoute',
            query: {
              id: row.id,
              componentName: 'devApplyDetail',
              routerTitle: '设备申请详情',
              tuiyun: true,
            }
          });
        } else if (row.processName == '设备出库') {
          this.$router.push({
            path: '/detailRoute',
            query: {
              // outboundNo: row.outboundNo,
              outboundNo: row.businessId,
              id: row.id,
              componentName: 'devOutBoundDetail',
              routerTitle: '设备出库详情',
              tuiyun: true,
            }
          });
        } else if (row.processName == '设备变更') {
          this.$router.push({
            path: '/detailRoute',
            query: {
              id: row.id,
              componentName: 'devChangeDetail',
              routerTitle: '设备变更详情',
              changeType: row.changeType,
              isAudit: this.radio1 == '已完成' ? false : true
            }
          })
        } else if (row.processName == '设备报修') {
          this.$router.push({
            path: '/detailRoute',
            query: {
              id: row.id,
              componentName: 'devRepairDetail',
              routerTitle: '设备报修详情',
              // isAudit:true,
              formRouter: '/personalDesk/desk'
            }
          })
        } else if (row.processName == '设备退运') {
          this.$router.push({
            path: '/detailRoute',
            query: {
              id: row.id,
              type: 'view',
              componentName: 'devReturnedAdd',
              routerTitle: '设备退运详情',
              tuiyun: true,
            }
          });
        } else if (row.processName == '设备报废') {
          this.$router.push({
            path: '/detailRoute',
            query: {
              id: row.id,
              componentName: 'devScrappedDetail',
              routerTitle: '设备报废详情'
            }
          });
        } else if (row.processName == '设备转资') {
          // 转资详情 页面
          this.$router.push({
            path: '/detailRoute',
            query: {
              id: row.id,
              componentName: 'capitalTransferDetail',
              routerTitle: '设备转资详情',
              formRouter: '/personalDesk/desk'
            }
          });
        } else if (row.processName == '设备投运') {
          this.$router.push({
            path: "/detailRoute",
            query: {
              id: row.id,
              componentName: "devOperationDetail",
              routerTitle: "设备投运详情",
              formRouter: '/personalDesk/desk'
            }
          });
        }
      },
      handleDetail(row) {
        let componentName = ''
        let routerTitle = ''
        let isDis = ''
        let isAudit = false;
        //一般 未办
        if (this.activeName === '1') {
          isAudit = true;
        }
        if (this.orderType == '建档工单') {
          componentName = 'devRecordAdd'
          routerTitle = '设备建档编辑'
        } else if (this.orderType == '转资工单') {
          componentName = 'capitalTransferDetail'
          routerTitle = '设备转资详情'
        } else if (this.orderType == '申请工单') {
          if (row.processType == "0") {
            componentName = 'devApplyAdd'
            routerTitle = '设备申请编辑'
          } else {
            componentName = 'devApplyDetail'
            routerTitle = '设备申请审批'
          }

        } else if (this.orderType == '出库工单') {
          componentName = 'devOutBoundDetail'
          routerTitle = '设备出库详情'
          if (this.activeName === '1') {
            isAudit = true;
            componentName = 'devOutBoundAdd'
            routerTitle = '设备出库审批'
          }
          this.$router.push({
            path: '/detailRoute',
            query: {
              id: row.id,
              isAudit: isAudit,
              componentName: 'devOutBoundAdd',
              routerTitle: routerTitle
            }
          });
          return;
        } else if (this.orderType == '投运工单') {
          componentName = 'devOperationDetail'
          routerTitle = '设备投运审批'
        } else if (this.orderType == '报修工单') {
          componentName = 'devRepairDetail'
          routerTitle = '设备报修详情'
        } else if (this.orderType == '变更工单') {
          if (row.processType == '0') {
            componentName = 'devChangeAdd'
            routerTitle = '设备变更编辑'
          } else {
            componentName = 'devChangeDetail'
            routerTitle = '设备变更详情'
            isDis = false
          }
        } else if (this.orderType == '报修工单') {
          if (row.processType == '0') {
            componentName = 'devRepairAdd'
            routerTitle = '设备报修编辑'
          } else {
            componentName = 'devRepairDetail'
            routerTitle = '设备报修详情'
            isDis = false
          }
        } else if (this.orderType == '退运工单') {
          componentName = 'devReturnedAdd'
          routerTitle = '退运工单处置'

          if (row.processStatus == 'hussar_2' || row.processStatus == '1') { //驳回后跳到编辑页面
            //编辑 页面
            this.$router.push({
              path: '/detailRoute',
              query: {
                id: row.id,
                type: 'edit',
                componentName: 'devReturnedAdd',
                routerTitle: '设备退运编辑',
                tuiyun: true,
              }
            });
            return
          }

        } else if (this.orderType == '报废工单') {
          componentName = 'devScrappedDetail'
          routerTitle = '设备报废详情'
        }
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: row.id,
            isAudit: isAudit,
            componentName: componentName || 'devRecordDetail',
            routerTitle: routerTitle || '设备建档详情',
            isDis: isDis
          }
        });
      },

      // 我发起的-进行中  处置
      handleDetail2(row) {
        let componentName = ''
        let routerTitle = ''
        let isDis = ''
        let isAudit = false;
        //一般 未办
        if (this.activeName === '3') {
          isAudit = true;
        }
        if (row.processName == '设备建档') {
          componentName = 'devRecordAdd'
          routerTitle = '设备建档编辑'
        } else if (row.processName == '设备转资') {
          componentName = 'capitalTransferDetail'
          routerTitle = '设备转资详情'
        } else if (row.processName == '设备申请') {
          // 改
          if (row.processStatus === 'hussar_2') {
            componentName = 'devApplyAdd'
            routerTitle = '设备申请编辑'
          } else {
            componentName = 'devApplyDetail'
            routerTitle = '设备申请审批'
          }

        } else if (row.processName == '设备出库') {
          // 改
          componentName = 'devOutBoundDetail'
          routerTitle = '设备出库详情'
          if (this.activeName === '3') {
            isAudit = true;
            componentName = 'devOutBoundAdd'
            routerTitle = '设备出库审批'
          }
          this.$router.push({
            path: '/detailRoute',
            query: {
              id: row.id,
              isAudit: isAudit,
              componentName: 'devOutBoundAdd',
              routerTitle: routerTitle
            }
          });
          return;
        } else if (row.processName == '设备投运') {
          componentName = 'devOperationDetail'
          routerTitle = '设备投运审批'
        } else if (row.processName == '设备变更') {
          if (row.processStatus === 'hussar_2') {
            componentName = 'devChangeAdd'
            routerTitle = '设备变更编辑'
            isDis = true
          } else {
            componentName = 'devChangeDetail'
            routerTitle = '设备变更详情'
            isDis = false
          }
        } else if (row.processName == '设备报修') {
          if (row.processStatus === 'hussar_2') {
            componentName = 'devRepairAdd'
            routerTitle = '设备报修编辑'
            isDis = true
          } else {
            componentName = 'devRepairDetail'
            routerTitle = '设备报修详情'
            isDis = false
          }
        } else if (row.processName == '设备退运') {
          componentName = 'devReturnedAdd'
          routerTitle = '退运工单处置'

          if (row.processStatus == 'hussar_2' || row.processStatus == '1') { //驳回后跳到编辑页面
            //编辑 页面
            this.$router.push({
              path: '/detailRoute',
              query: {
                id: row.id,
                type: 'edit',
                componentName: 'devReturnedAdd',
                routerTitle: '设备退运编辑',
                tuiyun: true,
              }
            });
            return
          }

        } else if (row.processName == '设备报废') {
          // 改
          // componentName = 'devScrappedDetail'
          // routerTitle = '设备报废详情'

          componentName = 'devScrappedAdd'
          routerTitle = '设备报废编辑'
          isDis = true
        }
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: row.id,
            isAudit: isAudit,
            componentName: componentName || 'devRecordDetail',
            routerTitle: routerTitle || '设备建档详情',
            isDis: isDis,
            formRouter: '/personalDesk/desk'
          }
        });
      },


      handleAudited(row) {
        this.orderDeatil = row
        if (this.orderType == '建档工单') {
          this.orderDeatil.filingNo = this.orderDeatil.filingNo
        } else if (this.orderType == '转资工单') {
          this.orderDeatil.filingNo = this.orderDeatil.filingNo
        } else if (this.orderType == '申请工单') {
          this.orderDeatil.filingNo = this.orderDeatil.applyNo
        } else if (this.orderType == '报废工单') {
          this.orderDeatil.filingNo = this.orderDeatil.filingNo
          // this.orderDeatil.processStatus = this.orderDeatil.processStatus
        } else if (this.orderType == '出库工单') {
          this.orderDeatil.filingNo = this.orderDeatil.applyNo || this.orderDeatil.outboundNo
          this.$router.push({
            path: '/detailRoute',
            query: {
              id: row.id,
              isAudit: true,
              componentName: 'devOutBoundAdd',
              routerTitle: '设备出库审批'
            }
          });
          return;
        } else if (this.orderType == '投运工单') {
          this.orderDeatil.filingNo = this.orderDeatil.applyNo || this.orderDeatil.operationNo
          this.$router.push({
            path: '/detailRoute',
            query: {
              id: row.id,
              isAudit: true,
              componentName: 'devOperationDetail',
              routerTitle: '设备投运审批'
            }
          });
          return;
        } else if (this.orderType == '退运工单') {
          this.orderDeatil.type = 'view'
        } else if (this.orderType === '作业计划'){
          if (row.type === '巡视计划'){
            this.$router.push({
              path: '/xcnanr/inspectPlanApproval/',
              query: {
                id: row.id
              }
            })
          } else if (row.type === '检修计划'){
            this.$router.push({
              path: '/xcnanr/repairPlanApprove',
              query: {
                id: row.id
              }
            });
          }
        } else if (this.orderType === '作业工单'){
          if (row.type === '检修工单'){
            this.$router.push({
              path: '/xcnanr/repairOrderAdopt',
              query: {
                id: row.id,
                code: row.code,
                type: row.repairType
              }
            });
          }
        }
        this.showOperate = true
      },

      initIp() {
        ipAll().then(res => {
          this.ipTotal = res.data.number
        });
        ipAssign().then(res => {
          if (res.data && res.data.length && res.data.length !== 0) {
            this.intranet = res.data.filter(el => el.type == 'intranet')[0];
            this.outernet = res.data.filter(el => el.type == 'outernet')[0];
          }
        })
      },
      getDictList(code) {
        //加载字典
        getDictList(code).then(res => {
          if (code === 'ticket_creat_type') {
            this.ticketCreatTypeList = res.data;
          } else if (code === 'device_change_type') {
            this.changeTypeList = res.data;
          } else if (code === 'ticket_status') {
            this.ticketStatusList = res.data;
          }
        });
      },
      async getDict() {
        let dict = ['repair_type', 'repair_level', 'deviceSource', 'operationType']
        for (let i = 0; i < dict.length; i++) {
          await getDictList(dict[i]).then(res => {
            if (dict[i] === 'repair_type') this.repairTypeList = res.data //报修类型
            else if (dict[i] === 'repair_level') this.repairLevelList = res.data //报修等级
            else if (dict[i] === 'deviceSource') {
              this.deviceSourceList = res.data;
            } else if (dict[i] === 'operationType') {
              this.operationTypeList = res.data;
            }
          })
        }
      },


      async getCmdbDictList(code) {
        //加载cmdb字典
        await getDictCmdbList({ciId: code}).then(res => {
          //this.deviceTypeList  = res.data;
          //this.deviceCategoryList  = res.data;
          if (code === '1082607703228416') {
            this.deviceWBSList = res.data;
          } else if (code === '1097745625841664') {
            this.deviceCategoryList = res.data;
          } else if (code === '1097745969774592') {
            this.deviceTypeList = res.data;
          } else if (code === '1131281812619264') {
            this.scrapReasonList = res.data;
          }
        });
      },

      // 初始化页面、配置
      initPage() {
        this.tableCol = this.allMenuList[0].tableCol
        this.radio1 = this.allMenuList[0].name

        this.handleOrder(this.allMenuList[0].name)
      },
      async handleOrder(item) {
        this.searchForm.current = 1
        if (item == '进行中' || item == '已完成') {
          this.handleOrder3(this.allMenuList2.filter(ele => ele.name == item)[0])
          return
        }

        item = this.allMenuList2.filter(ele => ele.name == item)[0]
        this.tableCol = item.tableCol
        this.radio1 = item.name
        this.listApi = item.listApi
        this.processKeys = item.processKeys
        this.orderType = item.name
        this.tableData = []
        if (this.$refs.dataTable) {
          this.$refs.dataTable.doLayout()
        }
        await this.getProcessDict()
        this.getOrderList()
        this.getNum()
      },

      async handleOrder2(item) {
        this.orderType = undefined
        this.tableCol = item.tableCol
        this.radio1 = item.name
        this.benchFinishList()
      },

      benchFinishList() {
        this.tableLoading = true

        let params = JSON.parse(JSON.stringify(this.searchForm))
        // params.currentPage = params.current
        // params.pageSize = params.size

        benchFinishList(params).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.tableLoading = false
          this.$nextTick(() => {
            this.$refs.dataTable.doLayout()
          })
          // setTimeout(() => {
          // this.$refs.dataTable.doLayout()
          // }, 2000);

        })
      },


      async handleOrder3(item) {
        this.orderType = undefined
        this.tableCol = item.tableCol
        this.radio1 = item.name

        this.wnderwayList()
      },

      wnderwayList() {
        this.tableLoading = true

        this.getNum2()

        if (this.radio1 == '进行中') {

          wnderwayList(this.searchForm).then(res => {
            this.tableData = res.data.records
            this.total = res.data.total
            this.tableLoading = false
            this.$refs.dataTable.doLayout()
          })

        } else if (this.radio1 == '已完成') {

          completeList(this.searchForm).then(res => {
            if (res.data && res.data.records) {
              res.data.records.forEach((item, index) => {
                if (item.processName == '设备变更') {
                  if (this.changeTypeList) {
                    let fItem = this.changeTypeList.find(a => a.dictKey == item.explain);
                    if (fItem) {
                      item.explain = fItem.dictValue;
                    }
                  }
                }
              });
            }
            this.tableData = res.data.records
            this.total = res.data.total
            this.tableLoading = false
            this.$refs.dataTable.doLayout()
          })

        }
      },

      getProcessDict() {
        return processDict({orderType: this.processKeys}).then(res => {
          this.processSteps = res.data
        })
      },

      // 切换待办已办
      handleTabs(tab, event) {
        this.searchForm.current = 1

        if (this.activeName == 1) {
          this.tableDataHeight = '280px'
          this.allMenuList2 = this.allMenuList
          this.handleOrder(this.allMenuList[0].name)
        } else if (this.activeName == 2) {
          this.tableDataHeight = '330px'
          this.allMenuList2 = []
          this.handleOrder2(this.chuli[0])
        } else if (this.activeName == 3) {
          this.tableDataHeight = '280px'
          this.allMenuList2 = this.wancheng
          this.handleOrder3(this.wancheng[0])
        }

        // this.getOrderList()
        // this.getNum()
      },
      getOrderList() {
        // 应对翻页情况做的 我处理的、我发起的 设置
        if (this.activeName == 2) {
          this.benchFinishList()
          return
        } else if (this.activeName == 3) {
          this.wnderwayList()
          return
        }

        this.tableData = []
        this.tableLoading = true
        let todoApi

        if (this.orderType === '作业计划' || this.orderType === '作业工单') {
          this.searchForm.type = this.orderType === '作业计划'?1:2
          const data = {
            current: this.searchForm.current,
            size: this.searchForm.size,
            type: this.searchForm.type,
          }
          waitForHandle(data).then(res => {
            this.tableData = res.data.result
            this.total = res.data.total
          })
        }else {
          if (this.activeName === '1') {
            todoApi = todoList
            this.searchForm.queryHandleFlag = 0
          } else {
            todoApi = finishList
            this.searchForm.queryHandleFlag = 1
          }
          todoApi({processKeys: this.processKeys}).then(res => {
            this.searchForm.orderNoList = res.data
            this.listApi(this.searchForm).then(res => {
              let records = []
              records = res.data.records
              records.forEach(el => {
                let hh = this.processSteps.filter(ele => ele.node == el.processStatus)[0]
                if (hh) {
                  el.processType = hh.type
                }
              })
              this.tableData = records
              this.total = res.data.total
            })
          })
        }
        this.tableLoading = false
        this.$refs.dataTable.doLayout()
      },
      getNum() {
        waitForHandleNum().then(res=>{
          this.planNum = res.data.planNum
          this.workOrderNum = res.data.workOrderNum
          deskOrderNum().then(res => {
            this.allMenuList2.forEach(item => {
              if (item.name == '建档工单') item.taskNum = res.data.deviceRecordNum
              else if (item.name == '转资工单') item.taskNum = res.data.deviceTransferNum
              else if (item.name == '申请工单') item.taskNum = res.data.deviceApplyNum
              else if (item.name == '出库工单') item.taskNum = res.data.deviceOutboundNum
              else if (item.name == '投运工单') item.taskNum = res.data.deviceOperationNum
              else if (item.name == '报修工单') item.taskNum = res.data.deviceRepairNum
              else if (item.name == '变更工单') item.taskNum = res.data.deviceChangeNum
              else if (item.name == '报废工单') item.taskNum = res.data.deviceScrapNum
              else if (item.name == '退运工单') item.taskNum = res.data.deviceReturnNum
              else if (item.name == '作业计划') item.taskNum = this.planNum
              else if (item.name == '作业工单') item.taskNum = this.workOrderNum
            })
            let numArrs = this.allMenuList2.map(item => {
              return item.taskNum;
            })
            if (numArrs && numArrs.length > 0) {
              let allNum = numArrs.reduce((a, b) => a + b, 0)
              this.waitHandleNum = allNum;
            }
          })
        })
      },
      getNum2() {
        completeNumber().then(res => {
          this.allMenuList2.forEach(item => {
            if (item.name == '进行中') item.taskNum = res.data.wnderwayCount
            else if (item.name == '已完成') item.taskNum = res.data.completeCount
          })
        })
      },
      // 提交
      handleSubmit(row){
        if (this.orderType === '作业计划' || this.orderType === '作业工单') {
          this.$confirm('您确认要发起流程吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (row.type === '巡视计划') {
              submitInspectionPlan(row.id).then(res => {
                this.getMessage(res)
              })
            }else if (row.type === '检修计划'){
              let deviceRecordDto = { id: row.id, filingNo: row.code, processDefinitionKey: 'bpm_jxjh', approvalOpinion: '发起检修计划', type: 'JXJH' }
              submitRepairPlan(deviceRecordDto).then(res => {
                this.getMessage(res)
              })
            }else if (row.type === '检修工单') {
              let data ={
                id: row.id,
                filingNo: row.code,
                approvalOpinion: '发起检修工单',
                type: 'JXGD'
              }
              submitRepairOrder(data).then(res => {
                this.getMessage(res)
              })
            }
          })
        }
      },
      getMessage(row){
        if (row.code === 200){
          this.$message({
            type: 'success',
            message: '提交成功！'
          });
          this.initPage()
        }else {
          this.$message({
            type: 'error',
            message: '提交失败！'
          });
        }
      },
      // 反馈
      handleFeedBack(row){
        if (row.type === '巡视工单'){
          this.$router.push({
            path: '/xcnanr/inspectWorkOrderFeedback/',
            query: {
              id: row.id
            }
          })
        } else if (row.type === '检修工单') {
          this.$router.push({
            path: '/xcnanr/repairOrderFeedback',
            query: {
              code: row.code
            }
          })
        }else if (row.type === '维修工单'){
          this.$router.push({
            path: `/xcnanr/MaintenanceFeedback`,
            query: {
              id: row.code,
              type: 'Feedback'
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .xt_page_box {
    width: 100%;
    height: calc(100% - 56px);
    overflow: auto;
    // background: red;
    .desk_t {
      display: flex;
      justify-content: space-between;

      .desk_tlt {
        // background: url('../../assets/desk/character.png') no-repeat 100% bottom;
        position: relative;

        .rrr {
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }

      .desk_tl {
        width: 58.5%;
      }

      .desk_tr {
        width: 40%;
      }
    }

    .desk_title {
      color: #192C7D;
      font-weight: 600;
      line-height: 30px;
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      // background: url('../../assets/desk/jiantou.png') no-repeat 100px center;
      img {
        width: 18px;
        height: 18px;
        margin-left: 10px;
      }
    }

    .desk_tabs {
      // background: linear-gradient(230deg, #f0f4ff 0%, #F7FAFF 100%);
      background: #fff;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;

      ::v-deep .el-tabs__item {
        font-size: 18px;
        color: #666;
        // line-height: 25px;

        span {
          padding: 0 20px;
        }
      }

      ::v-deep .el-tabs__item.is-active {
        font-weight: bold;
        color: #409EFF;
      }

      ::v-deep .el-tabs__header {
        margin-bottom: 0;
      }
    }

    .desk_content {
      overflow: auto;
      ::v-deep .el-radio-group {
        display: flex;
        margin-bottom: 10px;
      }

      ::v-deep .bbt {
        flex: 1;
      }

      ::v-deep .bbt2 {
        flex: none;
      }

      ::v-deep .el-radio-button__inner {
        width: 100%;
        padding: 12px 10px;
      }
    }

    .contents {
      background: #fff;
      padding: 10px;
      border-radius: 6px;
    }

    .desk_ip {
      display: flex;
      background: linear-gradient(180deg, rgba(220, 254, 241, 0.71) 0%, rgba(255, 255, 255, 0.22) 100%);
      padding: 26px 15px;
    }

    .desk_ip_l {
      .desk_ip_total {
        text-align: center;
        border-right: 1px solid #e1e1e1;
        padding-right: 5px;
        margin-top: 15px;

        .zhi1 {
          font-size: 40px;
          font-weight: bold;
          color: #FF6D1A;
          padding-right: 5px;
        }

        .zhi2 {
          font-size: 14px;
          color: #666;
        }
      }
    }

    .desk_ip_r {
      margin-left: 10px;
      flex: 0.9;

      .desk_ip_nei {
        display: flex;

        .desk_ip_nei1 {
          font-size: 12px;
          color: #06AE79;
          text-align: center;
          margin-top: 0px;
          margin-left: 15px;
        }

        .desk_ip_nei11 {
          color: #0D76FB;
        }

        .desk_ip_nei2 {
          display: flex;
          // margin-left: 25px;

          flex: 1;
          justify-content: center;

          .dian {
            width: 8px;
            height: 8px;
            background: #06AE79;
            border-radius: 50%;
            margin-top: 17px;
          }

          .dian2 {
            background: #FE914D;
          }

          .dian3 {
            background: #4D54FE;
          }

          .desk_ip_nei_z1 {
            font-size: 14px;
            color: #666;
            margin: 10px 7px 0 4px;
          }

          .desk_ip_nei_z2 {
            font-size: 24px;
            color: #000;
            font-weight: bold;
          }
        }
      }

      .desk_ip_neit {
        border-bottom: 1px solid #e1e1e1;
        padding-bottom: 12px;
      }

      .desk_ip_neib {
        padding-top: 10px;
      }
    }

    .desk_quick {
      display: flex;
      justify-content: space-between;
      flex-flow: wrap;
      padding-top: 20px;

      .desk_quick_item {
        cursor: pointer;
        font-size: 16px;
        color: #666;
        width: 33%;
        text-align: center;
        margin-bottom: 25px;

        img {
          margin-right: 10px;
          vertical-align: middle;
        }

        &:nth-child(7) {
          margin-bottom: 20px;
        }

        &:nth-child(8) {
          margin-bottom: 20px;
        }

        &:nth-child(9) {
          margin-bottom: 20px;
        }
      }
    }

    .desk_b {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;

      .desk_bl {
        width: 35%;
      }

      .desk_br {
        width: 63.5%;
      }
    }
  }

</style>
<style lang="scss" scoped>
  ::v-deep .pagination111 {
    margin-top: -10px;
  }
</style>
