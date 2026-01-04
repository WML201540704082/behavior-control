<template>
  <div class="xt_page_box">
    <div class="xt-layout" ref="pageBody" style="height: 87vh;">
      <div class="xt-layout-sider" :class="showSider? 'xt-layout-has-sider':'xt-layout-none-sider'">
        <div
          class="layout-sider-btn"
          @click="showSider = !showSider"
        >
          <i v-if="showSider" class="el-icon-arrow-left"></i>
          <i v-else class="el-icon-arrow-right"></i>
        </div>
        <el-scrollbar style="height:100%">
          <el-tree
            ref="tree"
            :props="props"
            :data="treeData"
            :load="loadNode"
            :default-expanded-keys="defaultExpandedKeys"
            lazy
            highlight-current
            :accordion="true"
            node-key="ciId"
            check-strictly
            @node-click="nodeClick"
            :default-expand-all="false"
          >
            <div class="span-ellipsis" style="font-size:14px;" slot-scope="{node,data}">
              <span :title="data.ciLabel">
                {{ data.ciLabel }}
              </span>
            </div>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="xt-layout-content" style="padding: 0px 0px 0px 20px;">
        <el-scrollbar style="height:100%;">
          <div class="xt_card xt_form" style="margin-bottom: 20px;">
            <div class="desk_title">
              设备台账
            </div>
            <div class="search_form">
              <el-input v-model="searchForm.keyword" placeholder="您可以通过设备编码/资产编码/设备名称/WBS项目编码/WBS项目名称/设备分类/设备类型/设备状态等列表属性进行模糊搜索">
                <template #suffix>
                  <i class="el-icon-search" @click="search"></i>
                </template>
              </el-input>
              <el-button type="primary" @click="search" style="margin-left: 30px">搜 索</el-button>
              <el-button plain="" type="primary" @click="restForm">重 置</el-button>
              <el-popover
                placement="left-start"
                trigger="click"
                v-model="visibleSelectBox"
                @show="filterShow">
                <div>
                  <filter-search ref="filterSearch" :ci-id="ciId" @filterOK="filterOK" @filterCancel="visibleSelectBox=false"></filter-search>
                </div>
                <el-button slot="reference" type="primary" size="small" style="margin-left: 10px">筛 选</el-button>
              </el-popover>

            </div>

            <div v-if="sxList&&sxList.length>0" class="d_oop">
              <span class="s_ssjg">搜索结果：</span>
              <div class="d_tag">
                <el-tag v-for="(item,index) in sxList" :key="index" class="e_tag" size="small" @close="tagClose(item)" closable>{{ item.attrName }}</el-tag>
              </div>
            </div>

            <el-form
              class="xt_search_form"
              ref="searchForm"
              :model="selectSearchForm"
              label-suffix=":"
              label-width="100px"
              v-if="searchItemList.length > 0"
            >
              <el-row>
                <el-col
                  :span="8"
                  v-for="item in searchItemList"
                  :key="item.key"
                >
                  <el-form-item :label="item.title">
                    <el-input v-model="selectSearchForm[item.key]"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="xt_card" style="padding-bottom: 0px">
            <div class="table_detial">
              <div class="table_info">
                <div class="info_item"
                     v-for="(item, index) in typeList"
                     :key="index"
                     :class="[selectType&&selectType.val == item.val?'d_seltype1':'d_seltype2']">
                  <img :src="item.img" alt="">
                  <span @click="searchType(item)"> {{ item.name }}: <i class="info_num">{{ item.num }}</i>台 </span>
                </div>
              </div>
              <div class="table_btn">
                <!-- <el-button class="border-btn" @click="handleQuery">打印</el-button> -->
                <!-- <el-button class="border-btn" @click="handlePrint" style="margin-left: 10px">打印</el-button> -->
                <el-button class="border-btn" @click="dataRestore" style="margin-left: 10px">数据还原</el-button>
                <el-button type="success" plain size="mini" @click="importCmdbDeviceData" v-if="fromType === 'zcgl'">导 入</el-button>
                <el-dropdown @command="handleExport" style="margin-left: 10px">
                  <el-button class="border-btn">导出<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="aa1">导出资产信息</el-dropdown-item>
                    <el-dropdown-item command="aa2" :disabled="ciId2 == '1082372687986688' || !ciId2">自定义导出</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown @command="handleSynch" style="margin-left: 10px">
                  <el-button class="border-btn">数据同步<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="handleSynch1">数据同步</el-dropdown-item>
                    <el-dropdown-item command="handleSynch2">同步结果</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- <el-button class="border-btn" @click="exportExcel" style="margin-left: 10px">导出资产信息</el-button>
                <el-button class="border-btn" @click="exportExcel2" style="margin-left: 10px">自定义导出</el-button> -->
              </div>
            </div>
            <div class="table_box" style="height: 72vh">
              <xtTable
                ref="xtTable"
                :tableData="tableData"
                :colList="tableCol"
                :needAction="true"
                :tableLoading="tableLoading"
                :tableHeight="tableHeight"
                @rowDbClcik="dbClickDetail"
                @selectionChange="selectionChange"
              >
                <template v-slot:action="scope">
                  <el-button type="text" size="mini" @click="seeDetail(scope.scopeData.row)">查 看</el-button>
                </template>
              </xtTable>
              <pagination
                :total="total"
                :page.sync="searchForm.currentPage"
                :limit.sync="searchForm.pageSize"
                @pagination="getList"/>
            </div>
          </div>
        </el-scrollbar>

      </div>
    </div>
    <!-- <div v-for="item in selectionList" :key="item.id">
      <taian-device ref="taianDevice" :form-value="item" device-type="111" v-show="true"></taian-device>
    </div> -->
    <!-- 导入文件弹框 -->
    <uploadModel v-if="openUpload" :isShow.sync="openUpload" type="zcgl" :deviceCategory="deviceCategoryCode" @setVal='setValDeviceList'></uploadModel>
    <uploadModel v-if="openUpload3" :isShow.sync="openUpload3" type="sztb" @setVal='setValDeviceList1'></uploadModel>

    <el-dialog
      title="存量数据还原"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="dialogBeforeClose"
      >
        <div>
          <!-- 请输入设备编码，使用","进行分割 -->
          <!-- 设备编码：
          <el-tooltip effect="dark" :content="code1" placement="bottom">
            <span class="s_ori11 ellipsis11">{{ code1 }}</span>
          </el-tooltip>
          是否还原到'存量数据治理'中？ -->
          <el-input type="textarea" :rows="5" v-model="codes" placeholder='例如：370100T10202202501100001,370100T10202202501100002,370100T10202202501100003'></el-input>
          <div class="tip1" style="margin-top: 2px">
            提示：方式一: 请在上方文本框中输入设备编码，使用","进行分割;
            方式二: 可通过"下载模板"下载导入模板, 再通过"文件导入" 导入后进行数据还原.
          </div>

          <div class="file-warp" style="margin-top: 15px">
            <el-button class="border-btn" @click="importTemplate">下载模板</el-button>
            <el-button type="primary" style="margin-left: 15px" @click="fileImport">文件导入</el-button>
          </div>
        </div>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="huanyuan">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 导入文件弹框 -->
    <uploadModel v-if="openUpload2" :isShow.sync="openUpload2" type="tzgl" :deviceCategory="deviceCategoryCode"
                 @setVal='setValDeviceList2'></uploadModel>

    <download-template ref="downloadTemplate" :fileType="fileType" v-if="openDownloadTemplate" :isShow.sync="openDownloadTemplate"></download-template>

    <deviceList
      v-if="showDeviceListForm"
      :deviceCategory="deviceCategoryCode"
      :tableList="importDeviceObj"
      :isShow="showDeviceListForm"
      :arrtId="arrtId"
      :ci-id="ciId"
      type="zcgl"
      @setVal="getInfoList"
      @resetUpload="resetUpload"
      @close="showDeviceListForm = false"
    ></deviceList>


    <exportHtml
      :ciId2="ciId2"
      v-if="deviceSelectSync"
      :isShow.sync="deviceSelectSync"
      @setVal="selectDeviceHandler"
    ></exportHtml>
  </div>
</template>

<script>
import {devBookCiTree, devBookList, batchSave, restoreUpdate} from "@/api/assets/devStandingBook"
import {mapGetters} from "vuex";
import uploadModel from "@/views/device/components/devInBound/uploadModel.vue";
import deviceList from "@/views/device/components/devInBound/deviceList.vue";
import filterSearch from "@/views/assets/components/devStandingBook/filterSearch.vue";
import {Loading, Message} from "element-ui";
import { formatDate } from "@/util/date"
import taianDevice from "@/views/assets/components/devStandingBook/components/print/taianDevice.vue"
import printHtml from "@/util/printHtml";
import exportHtml from "./export.vue"
import downloadTemplate from "../devStandingBook/components/exportSync.vue"

export default {
  props: ['fromType'],
  components: {deviceList, uploadModel, filterSearch, taianDevice, exportHtml, downloadTemplate},
  data() {
    return {
      deviceSelectSync: false,

      codes: undefined,
      huanyuanLoading: true,
      code1: undefined,
      dialogVisible: false,

      openDownloadTemplate: false,

      showSider: true, //是否显示侧边栏
      treeData: [],
      props: { //树组件配置项
        label: 'name',
        isLeaf: 'leaf'
      },
      ciId: null,//默认：1082372687986688 IT设备
      ciId2: '',//默认：1082372687986688 IT设备
      deviceCategoryCode: '',
      deviceTypeCode: '',
      defaultExpandedKeys: [],
      searchForm: {
        attrFilterList: [],
        ciId: this.$store.state.common.govern.itCiId_AST,
        currentPage: 1,
        pageSize: 20,
        needAction: true,
        needActionType: false,
        needExpand: false,
        needCheck: true,
        keyword: '',
      },
      searchItemList: [],
      selectSearchForm: {},
      visibleSelectBox: false,
      checkSearchList: [],
      typeList: [
        {
          name: '统一纳管',
          img: require('@/assets/img/xintong_img/devBookImg/propertydev.png'),
          typeName: 'deviceSource',
          typeId: '1130558647500800',
          val: 1102861334544385,
          num: 0,
          expression: 'equal'
        },
        {
          name: '非统一纳管',
          img: require('@/assets/img/xintong_img/devBookImg/nopropertydev.png'),
          typeName: 'deviceSource',
          typeId: '1130558647500800',
          val: 1102861753974784,
          num: 0,
          expression: 'equal'
        },
        {
          name: '投运到期设备',
          img: require('@/assets/img/xintong_img/devBookImg/touyundaoqi.png'),
          typeName: 'useAge',
          typeId: '1102858943791104',
          val: '8~100',
          num: 0,
          expression: 'between'
        },
        {
          name: '维保到期设备',
          img: require('@/assets/img/xintong_img/devBookImg/weibaodaoqi.png'),
          typeName: 'afterStatusCode',
          typeId: '1130557464707072',
          val: 1102248395735041,
          num: 0,
          expression: 'equal'
        },
      ],
      tableData: [],
      tableCol: [],
      total: 0,
      tableLoading: false,
      tableHeight: undefined,

      openUpload: false,
      openUpload2: false,
      openUpload3: false,
      showDeviceListForm: false,
      importDeviceObj: {},
      arrtId: '',
      infoList: [],

      sxList: [],//筛选列表
      selectType: null,
      fromAssets: null,

      selectionList: []
    }
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"]),
  },
  watch: {
    'sxList'(newVal, oldVal) {
      if (newVal && newVal.length > 0) {
        this.tableHeight = this.$refs.pageBody.offsetHeight - 277 + 'px'
      } else {
        this.tableHeight = this.$refs.pageBody.offsetHeight - 220 + 'px'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setTableHeight()

      // console.log(321, this.$store.state.common.govern.itCiId_AST)
    })
  },
  activated() {
    let assetspmsStr = localStorage.getItem('assetspms');
    if (assetspmsStr) {
      this.fromAssets = JSON.parse(assetspmsStr);
      localStorage.removeItem('assetspms');

      let nodes = this.$refs.tree.store._getAllNodes();
      if (nodes && nodes.length > 0) {
        //折叠左右选项

        let tree = this.$refs.tree;
        tree.setCurrentKey(null)
        for (let i = 1; i < tree.store._getAllNodes().length; i++) {
          tree.store._getAllNodes()[i].expanded = false;
        }

        //从缓存进入
        if (this.fromAssets) {
          if (this.fromAssets.cateciid) {
            //展开
            this.defaultExpandedKeys = [this.fromAssets.cateciid];
            //高亮显示
            tree.setCurrentKey(this.fromAssets.cateciid);

            if (this.fromAssets.typeciid) {
              setTimeout(() => {
                if (this.fromAssets && this.fromAssets.typeciid) {
                  //高亮显示
                  tree.setCurrentKey(this.fromAssets.typeciid);

                  let itm = tree.store._getAllNodes().find(a => a.data.ciId == this.fromAssets.typeciid);
                  if (itm && itm.data) {
                    this.nodeClick(itm.data, {level: 3});
                  }
                }
              }, 300);
            } else {
              let itm = tree.store._getAllNodes().find(a => a.data.ciId == this.fromAssets.cateciid);
              if (itm && itm.data) {
                this.nodeClick(itm.data, {level: 2});
              }
            }
          } else {
            //刷新根节点
            this.nodeClick({level: 0}, null);
          }
        }
      }
    }
  },
  methods: {
    selectDeviceHandler(list){
      //设备台账导出
      let params = {
        ciId: this.$store.state.common.govern.SG_CM_BUS,
        showAttrRelList: list.map(el => 'attr_'+el),
        idList: this.$refs.xtTable.$refs.table.selection.length > 0 ? this.$refs.xtTable.$refs.table.selection.map(el => el.id) : undefined,
        attrFilterList: this.searchForm.attrFilterList.length > 0 ? this.searchForm.attrFilterList : undefined
      }
      let fileName = `信息设备台账_${this.getTodayTime()}.xlsx`;
      this.download(
        "/api/idevelop-cmdb/cmdb/cientity/exportCustom",
        params,
        fileName
      );
    },
    getTodayTime(day = 0) {
      let date = new Date()
      date.setDate((new Date().getDate() + day));
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();

      m = (m >= 10) ? m : "0" + m;
      d = (d >= 10) ? d : "0" + d;

      hour = (hour >= 10) ? hour : "0" + hour;
      min = (min >= 10) ? min : "0" + min;

      let timeStr = date.getTime().toString();
      let tRand = timeStr.substring(timeStr.length - 2, timeStr.length);

      return `${y}${m}${d}${hour}${min}${tRand}`;
    },
    // 打印
    // handlePrint() {
    //   console.log(103, this.$refs.taianDevice[0].$el.innerHTML)
    //   let printElement = this.$refs.taianDevice;


    //   printHtml(`${printElement[0].$el.innerHTML}`)
    // },
    fileImport(){
      this.openUpload2 = true
    },
    importTemplate() {
      const loading = this.$loading({
        lock: true,
        text: '正在处理，请稍等。。。',
        spinner: 'el-icon-loading'
      })
      this.download('/api/idevelop-device/cmdb/repair/downExcel', {},
        `存量数据还原导入模板_${formatDate(new Date(), 'yyyyMMddhhmmss')}.xlsx`, loading)
    },
    setTableHeight() {
      this.tableHeight = this.$refs.pageBody.offsetHeight - 220 + 'px'
    },
    eidtSider() {
      this.showSider = !this.showSider
    },
    loadNode(node, resolve) {
      let form = {
        parentCiId: '',
        isMenu: 1,
        current: 1,
        size: 999
      }
      if (node.level === 0) {
        form.parentCiId = this.$store.state.common.govern.basicCiId
      } else {
        form.parentCiId = node.data.ciId
      }
      devBookCiTree(form).then(res => {
        if (node.level == 0) {
          this.defaultExpandedKeys = [res.data.records[0].ciId]
        } else if (node.level === 1) {
          if (this.fromAssets && this.fromAssets.cateciid) {
            //从资产管理进入
            setTimeout(() => {
              this.defaultExpandedKeys = [this.fromAssets.cateciid];
              let itm = res.data.records.find(a => a.ciId == this.fromAssets.cateciid);
              this.nodeClick(itm, {level: 2});

              //高亮显示
              this.$refs.tree.setCurrentKey(this.fromAssets.cateciid)
            }, 300);
          } else {
            this.nodeClick({level: 0});
          }
        } else if (node.level === 2) {
          res.data.records.forEach(item => {
            item.leaf = true
          })
          if (this.fromAssets && this.fromAssets.typeciid) {
            //从资产管理进入
            setTimeout(() => {
              let itm = res.data.records.find(a => a.ciId == this.fromAssets.typeciid);
              this.nodeClick(itm, {level: 3});

              //高亮显示
              this.$refs.tree.setCurrentKey(this.fromAssets.typeciid)
            }, 300);
          }
        }
        return resolve(res.data.records)
      })
    },
    nodeClick(data, node) {
      this.ciId2 = data.ciId;
      if (data.level === 0) {
        this.deviceCategoryCode = null
        this.deviceTypeCode = null
        this.ciId = null

        this.sxList = [];
        this.searchForm.attrFilterList = [];
        this.getBookInfo()
        this.getList();
      } else {
        this.deviceCategoryCode = data.deviceClaccify || '';
        this.deviceTypeCode = data.deviceType || '';
        this.ciId = data.ciId;

        this.searchForm.attrFilterList = [];
        this.selectType = null;
        if (data.level !== 0) {
          let form = {
            expression: 'equal',
            attrId: node.level == 2 ? this.$store.state.common.govern.deviceCategoryCode : this.$store.state.common.govern.deviceTypeCode,
            valueList: node.level == 2 ? [data.deviceClaccify] : [data.deviceType],
            type: 'tree'
          }
          this.searchForm.attrFilterList.forEach((item, index) => {
            if (item.type == 'tree') this.searchForm.attrFilterList.splice(index, 1)
          })
          this.searchForm.attrFilterList.push(form)
        }
        this.getList()
        for (let i = 0; i < this.typeList.length; i++) {
          let item = this.typeList[i]
          let form = {
            attrFilterList: [{expression: item.expression, attrId: item.typeId, valueList: [item.val]}],
            ciId: this.$store.state.common.govern.itCiId_AST,
            currentPage: 1,
            pageSize: 20,
            needAction: false,
            needActionType: false,
          }
          if (data.level !== 0) {
            form.attrFilterList.push({
              expression: 'equal',
              attrId: node.level == 2 ? this.$store.state.common.govern.deviceCategoryCode : this.$store.state.common.govern.deviceTypeCode,
              valueList: node.level == 2 ? [data.deviceClaccify] : [data.deviceType],
            })
          }
          for (let j = 0; j < this.sxList.length; j++) {
            form.attrFilterList.push(this.sxList[j]);
          }
          devBookList(form).then(res => {
            item.num = res.data.rowNum
          })
        }
      }
    },
    getBookInfo() {
      for (let i = 0; i < this.typeList.length; i++) {
        let item = this.typeList[i]
        let form = {
          attrFilterList: [{
            expression: item.expression,
            attrId: item.typeId,
            valueList: [item.val]
          }],
          ciId: this.$store.state.common.govern.itCiId_AST,
          currentPage: 1,
          pageSize: 20,
          needAction: false,
          needActionType: false,
        }
        devBookList(form).then(res => {
          item.num = res.data.rowNum
        })
      }
    },

    searchAll(clickType) {

    },

    getList() {
      this.tableLoading = true
      let newList = JSON.parse(JSON.stringify(this.sxList));

      //筛选条件改变重置like类型item
      this.searchForm.attrFilterList = this.searchForm.attrFilterList.filter(a => a.expression != 'like');

      for (let i = 0; i < newList.length; i++) {
        let item = newList[i];

        let fIndex = this.searchForm.attrFilterList.findIndex(a => a.attrName == item.attrName && a.type == item.type);
        if (fIndex >= 0) {
          this.searchForm.attrFilterList.splice(fIndex, 1)
        }
        this.searchForm.attrFilterList.push(item);
      }
      // for(let key in this.selectSearchForm) {
      //   this.searchForm.attrFilterList.push({
      //     expression: 'like',
      //     attrId: key.split('_')[1],
      //     valueList: [this.selectSearchForm[key]],
      //     type: 'search'
      //   })
      // }

      devBookList(this.searchForm).then(res => {
        // console.log('res', res)
        this.tableData = res.data.tbodyList
        this.tableCol = res.data.theadList
        this.total = res.data.rowNum
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })

    },
    search() {
      if (this.selectType) {
        let fIndex = this.searchForm.attrFilterList.findIndex(a => a.attrId == this.selectType.typeId && a.type == 'info' && a.expression == this.selectType.expression);
        if (fIndex != -1) {
          this.searchForm.attrFilterList.splice(fIndex, 1)
        }
        this.selectType = null;
      }

      this.searchForm.currentPage = 1
      this.getList()

      for (let i = 0; i < this.typeList.length; i++) {
        let item = this.typeList[i]
        let typeSearchForm = JSON.parse(JSON.stringify(this.searchForm))
        let form = {
          expression: item.expression,
          attrId: item.typeId,
          valueList: [item.val],
          type: 'info'
        }
        for (let j = 0; j < typeSearchForm.attrFilterList.length; j++) {
          let item = typeSearchForm.attrFilterList[j]
          if (item.type == 'info') typeSearchForm.attrFilterList.splice(j, 1)
        }
        // typeSearchForm.attrFilterList.forEach((item, index) => {
        //   if (item.type == 'info') typeSearchForm.attrFilterList.splice(index, 1)
        // })
        typeSearchForm.attrFilterList.push(form)

        devBookList(typeSearchForm).then(res => {
          item.num = res.data.rowNum
        })
      }
    },
    searchType(item) {
      this.selectType = item;
      let form = {
        expression: item.expression,
        attrId: item.typeId,
        valueList: [item.val],
        type: 'info'
      }
      this.searchForm.attrFilterList.forEach((item, index) => {
        if (item.type == 'info') this.searchForm.attrFilterList.splice(index, 1)
      })

      this.searchForm.attrFilterList.push(form)
      this.getList()
    },
    restForm() {
      this.searchForm = {
        attrFilterList: [],
        ciId: this.$store.state.common.govern.itCiId_AST,
        currentPage: 1,
        pageSize: 20,
        needAction: false,
        needActionType: false,
        keyword: '',
      }
      this.selectSearchForm = {}
      this.selectType = null;
      this.sxList = [];
      this.getList()

      for (let i = 0; i < this.typeList.length; i++) {
        let item = this.typeList[i]
        let typeSearchForm = JSON.parse(JSON.stringify(this.searchForm))
        let form = {
          expression: item.expression,
          attrId: item.typeId,
          valueList: [item.val],
          type: 'info'
        }
        typeSearchForm.attrFilterList.forEach((item, index) => {
          if (item.type == 'info') typeSearchForm.attrFilterList.splice(index, 1)
        })

        typeSearchForm.attrFilterList.push(form)
        devBookList(typeSearchForm).then(res => {
          item.num = res.data.rowNum
        })
      }
      this.$refs.filterSearch.getAttrs(true);


      let tree = this.$refs.tree;
      tree.setCurrentKey(null)
      for (let i = 1; i < tree.store._getAllNodes().length; i++) {
        tree.store._getAllNodes()[i].expanded = false;
      }

    },
    seeDetail(row) {
      let sarr = row.ciName.split('_');
      // console.log(`${sarr[0]}_${sarr[1]}`)
      this.$router.push({
        path: '/detailRoute',
        query: {
          ciId: row.ciId,
          ciName: `${sarr[0]}_${sarr[1]}`,
          devId: row.id,
          uuid: row.uuid,
          componentName: 'devBookDetail',
          routerTitle: '设备台账详情',
          // isEdit: this.fromType === 'zcgl' ? true : false,//设备台账由于权限太高，不允许修改，只允许查看,只能在数据治理中模块中点击才能编辑
          isEdit: true
        }
      });
    },
    dbClickDetail(val) {
      let sarr = val.row.ciName.split('_');
      // console.log(`${sarr[0]}_${sarr[1]}`)
      this.$router.push({
        path: '/detailRoute',
        query: {
          ciId: val.row.ciId,
          ciName: `${sarr[0]}_${sarr[1]}`,
          devId: val.row.id,
          uuid: val.row.uuid,
          componentName: 'devBookDetail',
          routerTitle: '设备台账详情',
          // isEdit: this.fromType === 'zcgl' ? true : false,//设备台账由于权限太高，不允许修改，只允许查看,只能在数据治理中模块中点击才能编辑
          isEdit: true
        }
      });
    },
    selectionChange(selection){
      // console.log(90, selection)
      this.selectionList = selection;
    },
    filterOK(args) {
      //this.searchForm.attrFilterList = args.attrFilterList
      this.visibleSelectBox = false

      //判断搜索条件的设备分类和设备类型是否跟左边树形选择的一致
      let isyes = false;
      args.attrFilterList.forEach((item, index) => {
        if (item.attrName == '设备分类') {
          if (item.valueList && item.valueList.length > 0) {
            let fItem = item.valueList.find(a => a == this.deviceCategoryCode);
            if (!fItem) {
              isyes = true;
            }
          }
        } else if (item.attrName == '设备类型') {
          if (item.valueList && item.valueList.length > 0) {
            let fItem = item.valueList.find(a => a == this.deviceTypeCode);
            if (!fItem) {
              isyes = true;
            }
          }
        }
      })

      if (isyes) {
        //设备类型和设备台账有变动 重新定位到IT设备下
        this.deviceCategoryCode = null
        this.deviceTypeCode = null
        this.ciId = null
        this.ciName = null

        this.sxList = [];
        this.searchForm.attrFilterList = [];

        let tree = this.$refs.tree;
        tree.setCurrentKey(null)
        for (let i = 1; i < tree.store._getAllNodes().length; i++) {
          tree.store._getAllNodes()[i].expanded = false;
        }
      }

      this.sxList = args.attrFilterList;
      this.search();
    },
    saveSearchItem() {
      this.searchItemList = []
      for (let i = 0; i < this.checkSearchList.length; i++) {
        for (let j = 0; j < this.tableCol.length; j++) {
          if (this.checkSearchList[i] == this.tableCol[j].key) {
            this.searchItemList.push(this.tableCol[j])
            break;
          }
        }
      }
      this.visibleSelectBox = false
    },
    dataRestore(){
      // if(this.selectionList.length == 0){
      //   this.$message.warning("请选择一条数据!")
      //   return
      // }
      // console.log(this.selectionList)

      let code = ''
      code = this.selectionList.map(ele=>ele.name).join(',')
      // this.selectionList.forEach(ele=>{
      //   code += ele.name + '，'
      // })
      // this.code1 = code
      this.codes = code
      this.dialogVisible = true
      // this.$confirm(`设备编码：<el-tooltip effect="dark" content="${code}" placement="bottom">
      //         <span class="s_ori11 ellipsis11">${code}</span>
      //       </el-tooltip> 是否还原到'存量数据治理'中？`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     dangerouslyUseHTMLString: true,
      //     type: 'warning'
      //   }).then(() => {



      //   })


    },
    huanyuan(){
      let params = {
        deviceCode: this.codes
      }
      this.huanyuanLoading = true;
      this.$message.success("操作提交成功, 请去存量数据治理中查看!");
      this.dialogVisible = false;
      restoreUpdate(params).then(res=>{
        this.huanyuanLoading = false
        this.getList()
      }).catch(() => {
        this.huanyuanLoading = false
      })
    },
    handleExport(command){
      // console.log(command)
      if(command == 'aa1'){
        this.exportExcel()
      }
      if(command == 'aa2'){
        this.exportExcel2()
      }
    },
    handleSynch(command){
      // console.log(command)
      if(command == 'handleSynch1'){
        this.importCmdbDeviceData1()
      }
      if(command == 'handleSynch2'){
        this.exportSync()
      }
    },

    exportSync() {
      this.openDownloadTemplate = true
    },

    exportExcel2(){
      this.deviceSelectSync = true
    },
    exportExcel() {
      if (this.fromType === 'zcgl') {
        //资产管理导出
        if (this.deviceCategoryCode == null || this.deviceCategoryCode === '') {
          this.$message.warning('请先选择左侧设备类型！')
          return
        }

        //导出台账数据文件
        let params = {
          area: this.userDetail.regionCode || '37',
          deviceType: this.deviceTypeCode || '',
          deviceCategory: this.deviceCategoryCode || ''
        }
        let fileName = "信息设备台账" + (this.userDetail.regionCode || '37') + (this.$store.state.common.govern.deviceCategoryCode || '') + (this.$store.state.common.govern.deviceTypeCode || '') + ".xlsx";
        this.download("/api/idevelop-device/hardwarebasic/cmdb/download", params, fileName);
      } else {
        //设备台账导出
        let params = {
          ciId: this.$store.state.common.govern.SG_CM_BUS,
          showAttrRelList: this.tableCol.map(el => el.key),
          idList: this.$refs.xtTable.$refs.table.selection.length > 0 ? this.$refs.xtTable.$refs.table.selection.map(el => el.id) : undefined,
          attrFilterList: this.searchForm.attrFilterList.length > 0 ? this.searchForm.attrFilterList : undefined
        }
        let fileName = `信息设备台账_${this.getTodayTime()}.xlsx`;
        this.download(
          "/api/idevelop-cmdb/cmdb/cientity/export",
          params,
          fileName
        );
      }
    },
    importCmdbDeviceData() {
      // 导出台账数据预览编辑
      /**
       * 孙琦
       * 1.参考工单--设备入库，点击弹框上传 后台解析，获取文件 解析的数据 前端数据回显，提示错误信息。
       * 2.弹框页面列表展示后台返回的全部列表数据，字段列表参考台账列表 可以最大化 重点突出 错误信息。
       * 3.弹框页面顶部 按钮“正式导入”，点击将返回的JSON数据按照接口要求提交后台接口，写入cmdb。前端启动longding效果
       * 4.正式保存写入接口返回错误提示 前端回显。
       */
      if (this.deviceCategoryCode == null || this.deviceCategoryCode === '') {
        this.$message.warning('请先选择左侧设备类型！')
        return
      }
      this.openUpload = true
    },
    importCmdbDeviceData1() {
      this.openUpload3 = true
    },
    setValDeviceList(obj) {
      this.openUpload = false
      this.importDeviceObj = obj
      this.showDeviceListForm = true
    },
    setValDeviceList1(obj) {
      this.openUpload3 = false;
      // this.importDeviceObj = obj
      // this.showDeviceListForm = true
    },
    setValDeviceList2(arr) {
      this.openUpload2 = false
      // this.importDeviceObj = obj
      // console.log(9090, arr)
      if(arr && arr.length>0){
        arr = arr.map(ele=> ele.deviceCode)
        let val = arr.join(',')
        if(this.codes){
          this.codes += ',' + val
        }else{
          this.codes = val
        }

      }
    },
    resetUpload() {
      this.showDeviceListForm = false
      this.openUpload = true
    },
    getInfoList(list) {
      this.showDeviceListForm = false
      this.infoList = list
      //this.searchForm.deviceNum = this.infoList.length
      this.tableLoading = true;
      batchSave({records: JSON.parse(JSON.stringify(this.infoList))}).then((res) => {
        this.getList();
      }).finally(() => {
        this.tableLoading = true;
      })
    },
    filterShow() {
      this.$refs.filterSearch.getAttrs();
    },
    tagClose(item) {
      let index = this.sxList.findIndex(a => a.attrName === item.attrName);
      if (index != -1) {
        this.sxList.splice(index, 1);
      }
      let index2 = this.searchForm.attrFilterList.findIndex(a => a.attrName === item.attrName);
      if (index2 != -1) {
        this.searchForm.attrFilterList.splice(index2, 1);
      }

      this.$refs.filterSearch.delAttr(item);

      this.search();
    },
  }
}
</script>

<style lang="scss" scoped>
.s_ori11 {
  color: #FFB445;
}
.ellipsis11{
  display: inline-block;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  line-height: 10px;
}


.el-popover {
  background: red !important;
}

.xt-layout-sider {
  background-color: #cfe6f9;
  border-radius: 5px
}

::v-deep .el-tree {
  background: transparent;
  color: #46506d;
}

::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background: none
}

::v-deep .el-tree-node__content:hover {
  background: none
}

.e_earc {
  border-radius: 50% !important;
  background-color: red;
}

.xt_card {
  padding: 10px;
  background: #fff;
  border-radius: 5px;
}

.search_form {
  display: flex;
  padding: 15px 12px 12px 24px;
  // ::v-deep .el-button{
  //   padding: 12px 30px;
  //   height: 40px;
  //   font-size: 14px
  // }
}

.table_detial {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .table_info {
    display: flex;

    .info_item {
      display: flex;
      align-items: center;
      font-size: 14px;
      padding: 0px 12px 0px 12px;
      margin-right: 30px;

      &:last-child {
        margin-right: 0;
      }

      img {
        margin-right: 7px
      }

      span {
        display: inline-block;
        line-height: 40px;
        color: #46506d;
        cursor: pointer;
      }

      i {
        font-style: normal;
        color: #409EFF;
        font-weight: 900;
        margin-left: 5px;

      }

    }
  }
}

.s_ssjg {
  font-size: 14px;
}

.d_seltype1 {
  border-radius: 6px;
  border: 1px solid #409EFF;
}

.d_tag {
  padding: 12px 0px 0px 0px;
}

.d_oop {
  padding: 0px 0px 0px 24px;
}

.e_tag {
  margin-right: 12px;
}

.el-tag {
  color: #0D8EFF;
  background-color: #FFFFFF;
  border: 1px solid #0D8EFF;
}
</style>
