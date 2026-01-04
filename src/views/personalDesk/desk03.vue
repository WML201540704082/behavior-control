<template>
  <div class="xt_page_box">
    <div class="page_form"></div>
    <div class="page_body">
      <div class="quick_enter">
        <el-popover
          width="80"
          trigger="hover"
          placement="bottom"
          >
          <div>
            <div v-for="(item, index) in menuList" :key="index" style="margin-bottom:10px;text-align:center">
              <el-link type="primary" @click="$router.push({path: item.href})">{{item.name}}</el-link>
            </div>
          </div>
          <div slot="reference" class="quick_btn_box">
            <i class="el-icon-menu"></i>
            <span>快捷入口</span>
          </div>
        </el-popover>
      </div>
      <div class="xt_card" style="margin-bottom: 20px;">
        <el-tabs v-model="activeName" @tab-click="handleTabs">
          <el-tab-pane name="1">
            <span slot="label"><i class="el-icon-tickets"></i> 待办工作</span>
          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label"><i class="el-icon-tickets"></i> 已办工作</span>
          </el-tab-pane>
        </el-tabs>
        <div class="menu_list">
          <div
            class="menu_item"
            v-for="(item, index) in menuList"
            :key="index"
            :style="{
              'color': '#46506d',
              'font-size':'16px',
              'font-weight':'500',
              'background-image': activeItem == index? 'url('+ item.selectImage + ')' : 'url('+ item.unselectImage + ')',
            }"
            @click="handleOrder(item, index)"
          >
            <el-badge :value="item.taskNum" class="item" v-if="item.taskNum > 0">
            </el-badge>

            <div class="menu_i">
               <img class="top_i"  :src="item.icon">
               <img class="bottom_i" :src="item.image">
            </div>
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="table_box">
          <el-table
            ref="dataTable"
            stripe
            size="small"
            :data="tableData"
            v-loading="tableLoading"
            height="205px"
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
            <el-table-column label="操作" align="center" fixed="right" width="150">
              <template slot-scope="{row}">
                <template v-if="orderType == '建档工单'">
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
                </template>
               </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page.sync="searchForm.current"
            :limit.sync="searchForm.size"
            @pagination="getOrderList"
          />
        </div>
      </div>
      <div class="xt_card" style="margin-bottom: 20px;">
        <formTitle :titleText="'设备异常告警'" :titleType="'item_title'">
          <div slot="rightBtnBox">
            <el-button class="all_btn" type="text">查看全部</el-button>
          </div>
        </formTitle>

        <el-table
          ref="alarmTable"
          stripe
          size="small"
          :data="alarmData"
          v-loading="arlrmTableLoading"
          height="205px"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="xx" label="告警标识" width="item.width" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="xx" label="告警等级" width="item.width" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="xx" label="告警类型" width="item.width" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="xx" label="告警描述" width="item.width" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="xx" label="告警发生时间" width="item.width" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="xx" label="告警设备类型" width="item.width" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="xx" label="告警设备编码" width="item.width" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <el-button type="text" class="list_btn" size="small">认领</el-button>
            <el-button type="text" class="list_btn" size="small">处置</el-button>
          </el-table-column>
        </el-table>
        <div style="margin: 10px 0"></div>
        <formTitle :titleText="'工作统计'" :titleType="'item_title'"></formTitle>
        <div class="work_list">

         <div  v-for="(item, index) in statisticsList"
            :key="index" style="display:flex;align-items:center">

          <div
            class="work_item"
            :style="{'background-image': 'url('+ item.backImage + ')'}"

          >
            <div
              class="icon_box"
            >
            <img :src='item.iconImage' style="width:28px;height:28px">
              <!-- <i :class="item.iconImage"></i> -->
            </div>
            <div class="order_info">
              <div class="info_name">
                {{item.name}}
              </div>
              <div class="info_num" :style="{color:'#192C70'}">
                {{ item.num }}
              </div>
            </div>

          </div>


         </div>
        </div>
      </div>
    </div>

    <!-- 审批弹窗 -->
    <operateForm
      v-if="showOperate"
      :isShow="showOperate"
      :orderDeatil="orderDeatil"
      :orderType="orderType"
      :processKeys="processKeys"
      @close="showOperate = false"
      @submitOperate="submitOperate"
    ></operateForm>
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
  scarpDeskList
} from "@/api/personalDesk/index"
import { processDict } from "@/api/process/index"
import { getDictCmdbList, getDictList } from "@/api/dict";
import operateForm from './components/operateForm'
import {mapGetters} from "vuex";

export default {
  components: { operateForm },
  data() {
    return{
      activeName: '1',
      activeItem: '0',
      processKeys: 'bpm_sbjd',
      listApi: undefined,
      orderType: '建档工单',
      processSteps: [],
      deviceTypeList: [],
      deviceCategoryList: [],
      repairTypeList: [],
      repairLevelList: [],
      operationTypeList: [],
      deviceSourceList: [],
      scrapReasonList:[],

      allMenuList: [
        {
          href: '/device/devRecord',
          permissionFlag: 'deviceRecord',
          name: '建档工单',
          textColor: '#',
          backColor: 'rgba(76,152,247, 0.2)',
          icon:require('@/assets/personWork/jiandang_icon.png'),
          image:require('@/assets/personWork/blue_icon.png'),
          selectImage:require('@/assets/personWork/blue_selected.png') ,
          unselectImage:require('@/assets/personWork/blue_unselected.png'),
          taskNum: 0,
          processKeys: 'bpm_sbjd',
          listApi: desklistSBJD,
          tableCol: [
            {
              prop: 'filingNo',
              label: '建档编号',
            },
            {
              prop: 'processStatus',
              label: '流程节点',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.processSteps.length; i++) {
                  let item = this.processSteps[i]
                  if(item.node === cellValue) return item.nodeName
                }
              }
            },
            {
              prop: 'deviceCategory',
              label: '设备分类',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.deviceCategoryList.length; i++) {
                  let item = this.deviceCategoryList[i]
                  if(item.dictKey === cellValue) return item.dictValue
                }
              }
            },
            {
              prop: 'deviceType',
              label: '设备类型',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.deviceTypeList.length; i++) {
                  let item = this.deviceTypeList[i]
                  if(item.dictKey === cellValue) return item.dictValue
                }
              }
            },
            {
              prop: 'deviceNum',
              label: '设备数量',
            },
            {
              prop: 'ownerUnitName',
              label: '产权单位',
            },
            {
              prop: 'propertyDeptName',
              label: '产权部门',
            },
            {
              prop: 'receiverName',
              label: '发起人',
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
          icon:require('@/assets/personWork/zhuanzi_icon.png'),
          image:require('@/assets/personWork/green_icon.png'),
          selectImage:require('@/assets/personWork/green_selected.png') ,
          unselectImage:require('@/assets/personWork/green_unselcted.png'),
          tableCol: [
            {
              prop: 'filingNo',
              label: '转资编号',
            },
            {
              prop: 'processStatus',
              label: '流程节点',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.processSteps.length; i++) {
                  let item = this.processSteps[i]
                  if(item.node === cellValue) return item.nodeName
                }
              }
            },
            {
              prop: 'deviceCategory',
              label: '设备分类',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.deviceCategoryList.length; i++) {
                  let item = this.deviceCategoryList[i]
                  if(item.dictKey === cellValue) return item.dictValue
                }
              }
            },
            {
              prop: 'deviceType',
              label: '设备类型',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.deviceTypeList.length; i++) {
                  let item = this.deviceTypeList[i]
                  if(item.dictKey === cellValue) return item.dictValue
                }
              }
            },
            {
              prop: 'deviceNum',
              label: '设备数量',
            },
            {
              prop: 'ownerUnitName',
              label: '产权单位',
            },
            {
              prop: 'propertyDeptName',
              label: '产权部门',
            },
            {
              prop: 'realName',
              label: '发起人',
            },
            {
              prop: 'receiverTime',
              label: '发起时间',
            },
          ],
          textColor: '#5cdbd3',
          backColor: 'rgba(9,219,211, 0.2)',
          taskNum: 0,
          processKeys: 'bpm_sbzz',
          listApi: desklistSBZZ,
        },
        // {
        //   name: '入库工单',
        //   tableCol: [
        //     {
        //       prop: 'serialNumber',
        //       label: '入库单号',
        //     },
        //     {
        //       prop: 'wbsProject',
        //       label: 'WBS项目',
        //     },
        //     {
        //       prop: 'wbsElement',
        //       label: 'WBS元素',
        //     },
        //     {
        //       prop: 'deviceCategory',
        //       label: '设备分类',
        //     },
        //     {
        //       prop: 'deviceType',
        //       label: '设备类型',
        //     },
        //     {
        //       prop: 'procureDate',
        //       label: '入库日期',
        //     },
        //     {
        //       prop: 'status',
        //       label: '入库状态',
        //     },
        //     {
        //       prop: 'statusI6000',
        //       label: 'i6000同步状态',
        //     },
        //     {
        //       prop: 'deviceSource',
        //       label: '设备来源',
        //     },
        //     {
        //       prop: 'deviceNum',
        //       label: '入库数量',
        //     },
        //     {
        //       prop: 'warehouse',
        //       label: '所在仓库',
        //     },
        //   ],
        //   textColor: '#95de64',
        //   backColor: 'rgba(149,222,100, 0.2)',
        //   taskNum: 0,
        // },
        {
          href: '/device/devApply',
          permissionFlag: 'deviceapply',
          name: '申请工单',
          icon:require('@/assets/personWork/shenqing_icon.png'),
          image:require('@/assets/personWork/blue_icon.png'),
          selectImage:require('@/assets/personWork/blue_selected.png') ,
          unselectImage:require('@/assets/personWork/blue_unselected.png'),
          tableCol: [
            {
              prop: 'applyNo',
              label: '申请编号',
              width: 170
            },
            {
              prop: 'deviceType',
              label: '设备类型',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.deviceTypeList.length; i++) {
                  let item = this.deviceTypeList[i]
                  if(item.dictKey === cellValue) return item.dictValue
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
            },
            {
              prop: 'oldToNew',
              label: '以旧换新',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                if(cellValue==='1'){
                  return  '否';
                }else{
                  return  '是';
                }
              }
            },
            // {
            //   prop: 'operation',
            //   label: '立即投运',
            //   formatterText: (row, column, cellValue, index) => {
            //     if(cellValue==='1'){
            //       return  '否';
            //     }else{
            //       return  '是';
            //     }
            //   }
            // },
            {
              prop: 'processStatus',
              label: '流程节点',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.processSteps.length; i++) {
                  let item = this.processSteps[i]
                  if(item.node === cellValue){
                    // row.processType = item.type
                    return item.nodeName
                  }
                }
              }
            },
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
          icon:require('@/assets/personWork/chuku_icon.png'),
          image:require('@/assets/personWork/green_icon.png'),
          selectImage:require('@/assets/personWork/green_selected.png') ,
          unselectImage:require('@/assets/personWork/green_unselcted.png'),
          tableCol: [
            // {
            //   prop: 'applyNo',
            //   label: '申请编号',
            // },
            {
              prop: 'outboundNo',
              label: '出库编号',
            },
            {
              prop: 'processStatus',
              label: '流程节点',
              // width: 90,
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.processSteps.length; i++) {
                  let item = this.processSteps[i]
                  if(item.node === cellValue) return item.nodeName
                }
              }
            },
            {
              prop: 'deviceCategory',
              label: '设备分类',
              // width: 90,
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.deviceCategoryList.length; i++) {
                  let item = this.deviceCategoryList[i]
                  if(item.dictKey === cellValue) return item.dictValue
                }
              }
            },
            {
              prop: 'deviceType',
              label: '设备类型',
              // width: 120,
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.deviceTypeList.length; i++) {
                  let item = this.deviceTypeList[i]
                  if(item.dictKey === cellValue) return item.dictValue
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
            {
              prop: 'applyUserName',
              label: '申请人',
            },
            {
              prop: 'oldToNew',
              label: '以旧换新',
              width: 90,
              formatterText: (row, column, cellValue, index) => {
                if(cellValue==='1'){
                  return  '否';
                }else{
                  return  '是';
                }
              }
            },
            // {
            //   prop: 'operation',
            //   label: '立即投运',
            //   width: 90,
            //   formatterText: (row, column, cellValue, index) => {
            //     if (cellValue === '1'){
            //       return  '否';
            //     }else{
            //       return  '是';
            //     }
            //   }
            // },
            {
              prop: 'applyNo',
              label: '申请编号',
            },
            {
              prop: 'outboundTime',
              label: '出库时间',
            },
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
          image:require('@/assets/personWork/blue_icon.png'),
          selectImage: require('@/assets/personWork/blue_selected.png') ,
          unselectImage: require('@/assets/personWork/blue_unselected.png'),
          tableCol: [
            {
              prop: 'operationNo',
              label: '投运单号',
            },
            {
              prop: 'processStatus',
              label: '流程节点',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.processSteps.length; i++) {
                  let item = this.processSteps[i]
                  if(item.node === cellValue) return item.nodeName
                }
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
              prop: 'operationNum',
              label: '设备数量',
              formatterText: (row, column, cellValue, index) => {
                return cellValue < 0 ? 0 : cellValue
              }
            },
            {
              prop: 'receiveDutyDeptName',
              label: '申请部门',
            },
            // {
            //   prop: 'deviceSource',
            //   label: '设备来源',
            //   // eslint-disable-next-line no-unused-vars
            //   formatterText: (row, column, cellValue, index) => {
            //     for(let i=0; i<this.deviceSourceList.length; i++) {
            //       let item = this.deviceSourceList[i]
            //       if(item.dictKey === cellValue) return item.dictValue
            //     }
            //   }
            // },
            // {
            //   prop: 'operationType',
            //   label: '投运类型',
            //   // eslint-disable-next-line no-unused-vars
            //   formatterText: (row, column, cellValue, index) => {
            //     for(let i=0; i<this.operationTypeList.length; i++) {
            //       let item = this.operationTypeList[i]
            //       if(item.dictKey === cellValue+"") return item.dictValue
            //     }
            //   }
            // },
            {
              prop: 'applyUserName',
              label: '申请人',
            },
            {
              prop: 'applyDate',
              label: '受理时间',
            },
          ],
          textColor: '#9254de',
          backColor: 'rgba(146,84,222, 0.2)',
          taskNum: 0,
          processKeys: 'bpm_sbsqckty',
          listApi: desklistSBTY,
        },
        {
          href: '/operation/devChange',
          permissionFlag: 'change',
          name: '变更工单',
          icon:require('@/assets/personWork/biangeng_icon.png'),
          image:require('@/assets/personWork/green_icon.png'),
          selectImage:require('@/assets/personWork/green_selected.png') ,
          unselectImage:require('@/assets/personWork/green_unselcted.png'),
          tableCol: [
            {
              prop: 'filingNo',
              label: '变更单号',
            },
            {
              prop: 'processStatus',
              label: '流程节点',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.processSteps.length; i++) {
                  let item = this.processSteps[i]
                  if(item.node === cellValue) return item.nodeName
                }
              }
            },
            {
              prop: 'deviceCount',
              label: '变更设备数',
            },
            {
              prop: 'applyUserName',
              label: '申请人',
            },
            {
              prop: 'applyUnitName',
              label: '申请单位',
            },
            {
              prop: 'applyDeptName',
              label: '申请部门',
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
          icon:require('@/assets/personWork/tuiyun_icon.png'),
          image:require('@/assets/personWork/blue_icon.png'),
          selectImage:require('@/assets/personWork/blue_selected.png') ,
          unselectImage:require('@/assets/personWork/blue_unselected.png'),
          tableCol: [
            {
              prop: 'filingNo',
              label: '退运编号',
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
              prop: 'applyDeptName',
              label: '申请部门',
            },
            {
              prop: 'acceptUserName',
              label: '申请人',
            },
            {
              prop: 'acceptPhone',
              label: '联系电话',
            },
            {
              prop: 'acceptTime',
              label: '受理时间',
            },
          ],
          textColor: '#ff7875',
          backColor: 'rgba(255,120,117, 0.2)',
          taskNum: 0,
          processKeys: 'bpm_sbty',
          listApi: returnedDeskList,
        },
        {
          href: '/operation/devRepair',
          permissionFlag: 'repair',
          name: '报修工单',
          icon:require('@/assets/personWork/baoxiu_icon.png'),
          image:require('@/assets/personWork/green_icon.png'),
          selectImage:require('@/assets/personWork/green_selected.png') ,
          unselectImage:require('@/assets/personWork/green_unselcted.png'),
          tableCol: [
            {
              prop: 'filingNo',
              label: '报修单号',
            },
            {
              prop: 'processStatus',
              label: '流程节点',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.processSteps.length; i++) {
                  let item = this.processSteps[i]
                  if(item.node === cellValue) return item.nodeName
                }
              }
            },
            {
              prop: 'repairType',
              label: '报修类型',
              // eslint-disable-next-line no-unused-vars
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.repairTypeList.length; i++) {
                  if(this.repairTypeList[i].dictKey === cellValue) return this.repairTypeList[i].dictValue
                }
              }
            },
            {
              prop: 'repairLevel',
              label: '报修等级',
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.repairLevelList.length; i++) {
                  if(this.repairLevelList[i].dictKey === cellValue) return this.repairLevelList[i].dictValue
                }
              }
            },
            {
              prop: 'repairDeviceCount',
              label: '报修设备数',
            },
            {
              prop: 'applyUserName',
              label: '申请人',
            },
            {
              prop: 'applyUnitName',
              label: '申请单位',
            },
            {
              prop: 'applyDeptName',
              label: '申请部门',
            },
          ],
          textColor: '#409EFF',
          backColor: 'rgba(76,152,247, 0.2)',
          taskNum: 0,
          processKeys: 'bpm_sbbx',
          listApi: desklistSBBX
        },
        {
          href: '/operation/devScrapped',
          permissionFlag: 'devScrap',
          name: '报废工单',
          icon:require('@/assets/personWork/baofei_icon.png'),
          image:require('@/assets/personWork/gray_icon.png'),
          selectImage:require('@/assets/personWork/gray.png') ,
          unselectImage:require('@/assets/personWork/gray.png'),
          tableCol: [

               {
              prop: 'filingNo',
              label: '报废编号',
            },
            {
              prop: 'applyDeptName',
              label: '申请部门',
            },
             {
              prop: 'deviceNum',
              label: '设备数量',
            }, {
              prop: 'originalValue',
              label: '资产原值',
            }, {
              prop: 'netWorth',
              label: '资产净值',
            }, {
              prop: 'scrapReason',
              label: '报废原因',
              formatterText: (row, column, cellValue, index) => {
                for(let i=0; i<this.scrapReasonList.length; i++) {
                  if(this.scrapReasonList[i].dictKey === cellValue) return this.scrapReasonList[i].dictValue
                }
              }
            }, {
              prop: 'scrapTime',
              label: '受理时间',
            },

          ],
          textColor: '#919191',
          backColor: 'rgba(145,145,145, 0.2)',
          taskNum: 0,
          processKeys: 'bpm_sbbf',
          orderNoList:'',
          listApi: scarpDeskList,
        },
      ],
      menuList: [],

      searchForm: {
        current: 1,
        size: 10,
      },
      tableCol: [],
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      total: 0,
      // 告警表格
      alarmData: [],
      arlrmTableLoading: false,

      // 工作统计
      statisticsList: [
        {
          name: '今日新增工单',
          icon: 'el-icon-finished',
          textColor: 'rgba(105,192,255)',
          backColor: 'rgba(105,192,255, 0.8)',
          iconImage:require('@/assets/personWork/todayAddIcon.png'),
          backImage:require('@/assets/personWork/todayAddBg.png'),
          num: 1,
          processKeys: 'bpm_sbjd'
        },
        {
          name: '今日处理工单',
          icon: 'el-icon-document-checked',
          textColor: 'rgba(109,238,161)',
          backColor: 'rgba(109,238,161, 0.8)',
          iconImage:require('@/assets/personWork/todayApprovedIcon.png'),
          backImage:require('@/assets/personWork/todayApprovedBg.png'),
          num: 1,
          processKeys: '',
        },
        {
          name: '全部待处理工单',
          icon: 'el-icon-tickets',
          textColor: 'rgba(255,163,158)',
          backColor: 'rgba(255,163,158, 0.8)',
          iconImage:require('@/assets/personWork/allApprovedIcon.png'),
          backImage:require('@/assets/personWork/allApprovedBg.png'),
          num: 1,
          processKeys: '',
        },
        {
          name: '总计完成工单',
          icon: 'el-icon-folder-opened',
          textColor: 'rgba(54,207,201)',
          backColor: 'rgba(54,207,201, 0.8)',
          iconImage:require('@/assets/personWork/allConlishIcon.png'),
          backImage:require('@/assets/personWork/allConlishBg.png'),
          num: 1,
          processKeys: '',
        },
        {
          name: '逾期工单数',
          icon: 'el-icon-document-delete',
          textColor: 'rgba(255,169,64)',
          backColor: 'rgba(255,169,64, 0.8)',
          iconImage:require('@/assets/personWork/outDateIcon.png'),
          backImage:require('@/assets/personWork/outDateBg.png'),
          num: 1,
          processKeys: '',
        },
      ],
      // 操作弹窗
      showOperate: false,
      orderDeatil: null
    }
  },
  computed: {
    ...mapGetters(["permission","userInfo","userDetail"]),
  },
  async mounted() {
    this.initPage()

    this.getNum()
    this.tableLoading = true
    await this.getProcessDict()
    //加载字典--设备类型
    await this.getCmdbDictList("1097745969774592");
    //加载字典--设备分类
    await this.getCmdbDictList("1097745625841664");
    await this.getDict()
    this.tableLoading = false
    // this.getOrderList()
  },
  methods: {
    // 初始化页面、配置
    initPage() {
      this.tableCol = this.allMenuList[0].tableCol
      this.listApi = desklistSBJD
      for(let key in this.permission) {
        let permission = key.split('_')[0]
        for(let i= 0; i<this.allMenuList.length; i++) {
          let item = this.allMenuList[i]
          if(item.permissionFlag == permission && (this.menuList.length == 0 || this.menuList[this.menuList.length-1].permissionFlag != permission)) {
            this.menuList.push(item)
          }

        }
      }
      this.handleOrder(this.menuList[0], 0)
    },
    async getDict() {
      let dict = ['repair_type', 'repair_level' ,'deviceSource','operationType']
      for(let i=0 ; i<dict.length; i++) {
        await getDictList(dict[i]).then(res => {
          if(dict[i] === 'repair_type') this.repairTypeList = res.data //报修类型
          else if(dict[i] === 'repair_level') this.repairLevelList = res.data //报修等级
          else if(dict[i]==='deviceSource'){this.deviceSourceList  = res.data; }
          else if(dict[i]==='operationType'){this.operationTypeList  = res.data; }
        })
      }
    },
    getProcessDict() {
      return processDict({orderType: this.processKeys}).then(res => {
        this.processSteps = res.data
      })
    },
    async getCmdbDictList(code){
      //加载cmdb字典
      await getDictCmdbList({ ciId: code }).then(res => {
        //this.deviceTypeList  = res.data;
        //this.deviceCategoryList  = res.data;
        if(code==='1082607703228416'){
          this.deviceWBSList = res.data;
        }else if(code==='1097745625841664'){
          this.deviceCategoryList  = res.data;
        }else if(code==='1097745969774592'){
          this.deviceTypeList  = res.data;
          this.deviceTypeListAll  = res.data;
        }else if(code === '1131281812619264'){
          this.scrapReasonList = res.data;
        }
      });
    },

    getNum() {
      deskOrderNum().then(res => {
        this.menuList.forEach(item => {
          if(item.name == '建档工单') item.taskNum = res.data.deviceRecordNum
          else if(item.name == '转资工单') item.taskNum = res.data.deviceTransferNum
          else if(item.name == '申请工单') item.taskNum = res.data.deviceApplyNum
          else if(item.name == '出库工单') item.taskNum = res.data.deviceOutboundNum
          else if(item.name == '投运工单') item.taskNum = res.data.deviceOperationNum
          else if(item.name == '报修工单') item.taskNum = res.data.deviceRepairNum
          else if(item.name == '变更工单') item.taskNum = res.data.deviceChangeNum
          else if(item.name == '报废工单') item.taskNum = res.data.deviceScrapNum
          else if(item.name == '退运工单') item.taskNum = res.data.deviceReturnNum
        })
      })
    },
    getOrderList() {
      this.tableData = []
      this.total = 0
      this.tableLoading = true
      let todoApi
      // if(this.activeName === '1') todoApi = todoList
      // else todoApi = finishList
      if(this.activeName === '1'){
        todoApi = todoList
        this.searchForm.queryHandleFlag = 0
      } else {
        todoApi = finishList
        this.searchForm.queryHandleFlag = 1
      }
      todoApi({processKeys: this.processKeys}).then(res => {
        this.searchForm.orderNoList = res.data
        this.listApi(this.searchForm).then(req => {
          let records = req.data.records
          records.forEach(el=>{
            let hh = this.processSteps.filter(ele=> ele.node == el.processStatus)[0]
            if(hh){
              el.processType = hh.type
            }
          })
          this.tableData = records
          this.total = req.data.total
          this.tableLoading = false
          this.$refs.dataTable.doLayout()
        })
      })
    },
    async handleOrder(item, index) {
      this.tableCol = item.tableCol
      this.listApi = item.listApi
      this.processKeys = item.processKeys
      this.activeItem = index
      this.orderType = item.name
      this.tableData = []
      // if(item.name == '入库工单')return
      await this.getProcessDict()
      this.getOrderList()
      if(item.name === '报废工单'){
        await this.getCmdbDictList("1131281812619264");
      }

      this.getNum()
    },
    handleView(row){
      if(this.orderType == '建档工单') {
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: row.id,
            componentName: 'devRecordDetail',
            routerTitle: '设备建档详情',
            tuiyun: true,
          }
        });
      }else if(this.orderType == '申请工单') {
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: row.id,
            componentName: 'devApplyDetail',
            routerTitle: '设备申请详情',
            tuiyun: true,
          }
        });
      }else if(this.orderType == '出库工单') {
        this.$router.push({
          path: '/detailRoute',
          query: {
            outboundNo: row.outboundNo,
            id: row.id,
            componentName: 'devOutBoundDetail',
            routerTitle: '设备出库详情',
            tuiyun: true,
          }
        });
      }else if (this.orderType =='变更工单'){
        this.$router.push({
          path:'/detailRoute',
          query: {
            id: row.id,
            componentName: 'devChangeDetail',
            routerTitle: '设备变更详情',
            changeType:row.changeType,
            isAudit:true
          }
        })
      }else if (this.orderType =='报修工单'){
        this.$router.push({
          path:'/detailRoute',
          query: {
            id: row.id,
            componentName: 'devRepairDetail',
            routerTitle: '设备报修详情',
            isAudit:true
          }
        })
      }else if(this.orderType == '退运工单') {
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
      }else if(this.orderType == '转资工单') {
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
      }
    },
    handleDetail(row) {
      let componentName = ''
      let routerTitle = ''
      let isDis = ''
        let isAudit = false;
        //一般 未办
        if(this.activeName === '1'){
            isAudit = true;
        }
      if(this.orderType == '建档工单') {
        componentName = 'devRecordAdd'
        routerTitle = '设备建档编辑'
      }else if(this.orderType == '转资工单') {
        componentName = 'capitalTransferDetail'
        routerTitle = '设备转资详情'
      }else if(this.orderType == '申请工单') {
        if( row.processType == "0" ){
          componentName = 'devApplyAdd'
          routerTitle = '设备申请编辑'
        }else{
          componentName = 'devApplyDetail'
          routerTitle = '设备申请审批'
        }

      }else if(this.orderType=='出库工单'){
        componentName = 'devOutBoundDetail'
        routerTitle = '设备出库详情'
        if(this.activeName === '1'){
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
      }else if(this.orderType=='投运工单'){
        componentName = 'devOperationDetail'
        routerTitle = '设备投运审批'
      }else if(this.orderType == '报修工单') {
        componentName = 'devRepairDetail'
        routerTitle = '设备报修详情'
      }else if(this.orderType == '变更工单') {
        if (row.processType =='0'){
          componentName = 'devChangeAdd'
          routerTitle = '设备变更编辑'
        }else {
          componentName = 'devChangeDetail'
          routerTitle = '设备变更详情'
          isDis = false
        }
      }else if(this.orderType == '报修工单') {
        if (row.processType =='0'){
          componentName = 'devRepairAdd'
          routerTitle = '设备报修编辑'
        }else {
          componentName = 'devRepairDetail'
          routerTitle = '设备报修详情'
          isDis = false
        }
      }else if(this.orderType == '退运工单') {
        componentName = 'devReturnedAdd'
        routerTitle = '退运工单处置'
      }
      else if(this.orderType == '报废工单') {
        componentName = 'devScrappedDetail'
        routerTitle = '设备报废详情'
      }
      this.$router.push({
        path: '/detailRoute',
        query: {
          id: row.id,
          isAudit: isAudit,
          componentName: componentName||'devRecordDetail',
          routerTitle: routerTitle||'设备建档详情',
          isDis: isDis
        }
      });
    },
    handleAudited(row) {
      this.orderDeatil = row
      if(this.orderType == '建档工单') {
        this.orderDeatil.filingNo = this.orderDeatil.filingNo
      }else if(this.orderType == '转资工单') {
        this.orderDeatil.filingNo = this.orderDeatil.filingNo
      }else if(this.orderType == '申请工单') {
        this.orderDeatil.filingNo = this.orderDeatil.applyNo
      }else if(this.orderType == '报废工单') {
        this.orderDeatil.filingNo = this.orderDeatil.filingNo
        this.orderDeatil.processStatus = this.orderDeatil.processStatus
      }
      else if(this.orderType=='出库工单'){
        this.orderDeatil.filingNo = this.orderDeatil.applyNo||this.orderDeatil.outboundNo
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
      }else if(this.orderType=='投运工单'){
        this.orderDeatil.filingNo = this.orderDeatil.applyNo||this.orderDeatil.operationNo
      }
      this.showOperate = true
    },
    submitOperate() {
      this.showOperate = false
      this.getOrderList()
      this.getNum()
    },
    // 切换待办已办
    handleTabs(tab, event) {
      this.getOrderList()
      this.getNum()
    }
  }
}
</script>

<style lang="scss" scoped>
.all_btn{
  font-size: 14px;
  padding: 0px
}
.list_btn{
  padding: 0px !important;
}
.page_body{
  position: relative;
  .quick_enter{
    position: absolute;
    top: 4px;
    right: 10px;
    z-index: 99;
  }
  .quick_btn_box{
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #409EFF;
    cursor: pointer;
    i{
      font-size: 25px
    }
    span{
      font-size: 14px;
    }
  }
  .menu_list{
    display: inline-grid;
    grid-template-columns: repeat(9, 11.11%);
    grid-column-gap: 15px;
    // width: calc(100% - 135px);
    width: calc(100% - 120px);
    .menu_item{
      position: relative;
      height: 60px;
      // line-height: 60px;
      text-align: right;
      border-radius: 5px;
      display: flex;
      justify-content: left;
      align-items: center;
      background-size:100% 60px;
      background-repeat: no-repeat;
      cursor: pointer;
      .item{
        position: absolute;
        top: -5px;
        right: -5px;
      }
      .menu_i{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-left: 14px;
        margin-right: 20px;
        .bottom_i{
          width: 25px;
          height: 19px;
        }

        .top_i{
          width: 10px;
          height: 10px;
        }
      }
    }
    .activeClass{
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      border: 1px solid
    }
  }
  .table_box{
    margin-top: 15px
  }
  .work_list{
    display: inline-grid;
    grid-template-columns: repeat(5, 20%);
    grid-column-gap: 15px;
    width: calc(100% - 60px);
    .work_item{
      border: 1px solid #EBEEF5;
      border-radius: 10px;
      display: flex;
      padding: 10px;
      width: 95%;
      .icon_box{
        height: 70px;
        width: 70px;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        line-height: 70px;
        font-size: 40px;
        margin-left: 20px
      }
      .order_info{
        flex: auto;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .info_name{
          font-weight: 900;
          color: #46506d;
          font-size: 14px
        }
        .info_num{
          font-size: 25px;
          margin-top: 8px;
        }
      }
    }
  }
}

</style>
