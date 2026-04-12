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
        <el-scrollbar style="height:100%">
          <div class="xt_card xt_form" style="margin-bottom: 20px;">
            <div class="desk_title">
              存量台账管理
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
                  <filter-search ref="filterSearch" :ci-id="ciId" @filterOK="filterOK"
                                 @filterCancel="visibleSelectBox=false"></filter-search>
                </div>
                <el-button slot="reference" type="primary" size="small" style="margin-left: 12px">筛 选</el-button>
              </el-popover>

            </div>

            <div v-if="sxList&&sxList.length>0" class="d_oop">
              <span class="s_ssjg">搜索结果：</span>
              <div class="d_tag">
                <el-tag v-for="(item,index) in sxList" :key="index" class="e_tag" size="small" @close="tagClose(item)"
                        closable>{{ item.attrName }}
                </el-tag>
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
                  <!--                  <span @click="searchType(item)"> {{ item.name }}: <i class="info_num">{{ item.num }}</i>台 </span>-->
                  <span @click="searchType(item)"> {{ item.name }}: <i class="info_num">{{ item.num }}</i>台 </span>
                </div>
              </div>
              <div class="table_btn">
                <el-button type="primary" @click="handleAdd">新增</el-button>
                <el-button type="danger" @click="handleDelete(null)">删除</el-button>
                <!-- <el-button type="success" plain size="mini" @click="importCmdbDeviceData">导 入</el-button> -->

                <el-dropdown @command="importCmdbDeviceData">
                  <el-button class="border-btn" style="margin-left: 10px">导入</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1">数字化设备导入</el-dropdown-item>
                    <el-dropdown-item command="2">非数字化设备导入</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

                <el-dropdown @command="exportClick">
                  <el-button class="border-btn" style="margin-left: 10px">导出</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,index) in exportList" :key="item.id" :command="item.id">{{ item.name
                      }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-badge :value="noExportHisNum">
                  <el-button class="border-btn" @click="exportHistory" style="margin-left: 10px">导出记录</el-button>
                </el-badge>

                <el-button class="border-btn" style="margin-left: 10px" @click="downloadCityClick">新增模板</el-button>

<!--                <el-dropdown @command="downloadClick">-->
<!--                  <el-button class="border-btn" style="margin-left: 10px">下载</el-button>-->
<!--                  <el-dropdown-menu slot="dropdown">-->
<!--                    <el-dropdown-item v-for="(item,index) in downloadList" :key="item.id" :command="item.id">{{-->
<!--                      item.name }}-->
<!--                    </el-dropdown-item>-->
<!--                  </el-dropdown-menu>-->
<!--                </el-dropdown>-->
              </div>
            </div>
            <!--            -->
            <div class="table_box" :style="{height:sxList&&sxList.length>0?'63vh':'69vh',padding:'0px 0px 12px 0px'}">
              <xtTable
                ref="xtTable"
                :tableData="tableData"
                :colList="tableCol"
                :needAction="true"
                :tableLoading="tableLoading"
                :tableHeight="tableHeight"
                @rowDbClcik="dbClickDetail">
                <template v-slot:action="scope">
                  <el-button type="text" size="mini" @click="seeDetail(scope.scopeData.row)">查 看</el-button>
                  <el-button type="text" size="mini" @click="handleDelete(scope.scopeData.row)" style="color: #ff4949">删
                    除
                  </el-button>
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

    <!-- 导入文件弹框 -->
    <uploadModel v-if="openUpload" :isShow.sync="openUpload" type="zcgl" :deviceCategory="deviceCategoryCode" :isMath="isMath"
                 @setVal='setValDeviceList'></uploadModel>

    <deviceList
      v-if="showDeviceListForm"
      :deviceCategory="deviceCategoryCode"
      :tableList="importDeviceObj"
      :isShow="showDeviceListForm"
      :arrtId="arrtId"
      :ci-id="ciId"
      type="zcgl"
      @setVal="getInfoList"
      @setValExoprt="getInfoListExport"
      @resetUpload="resetUpload"
      @close="showDeviceListForm = false"
    ></deviceList>

    <export-history ref="exportHistory"
                    v-if="openExportHistory"
                    :isShow.sync="openExportHistory"
                    @refreshAllNum="getExportHisNoDowloadNums"></export-history>

    <!-- 下载模板 -->
    <download-template ref="downloadTemplate" :fileType="fileType" v-if="openDownloadTemplate"
                       :isShow.sync="openDownloadTemplate"></download-template>

    <devBookDetialDialog
      v-if="showCMDBEdit"
      :isShow="showCMDBEdit"
      :ciId="cmdbParams.ciId"
      :configId="cmdbParams.devId"
      :editParams="editParams"
      @refreshDetial="refreshDetial"
      @close="showCMDBEdit= false">
    </devBookDetialDialog>
  </div>
</template>

<script>
  import {devBookCiTree, batchSave, remove, allNums} from "@/api/assets/devStandingBook"
  import {devBookList, devListByType} from "@/api/assets/ageConfigureManage";
  import {mapGetters} from "vuex";
  import uploadModel from "@/views/device/components/devInBound/uploadModel.vue";
  import deviceList from "@/views/device/components/devInBound/deviceList.vue";
  import filterSearch from "@/views/assets/components/devStandingBook/filterSearch.vue";
  import exportHistory from "@/views/assets/components/devStandingBook/exportHistory.vue";
  import devBookDetialDialog from "@/views/assets/components/devStandingBook/components/devBookDetialDialog.vue";
  import config from "@/page/index/sidebar/config";
  import downloadTemplate from "../components/assetmanager/downloadTemplate"


  export default {
    components: {devBookDetialDialog, deviceList, uploadModel, filterSearch, exportHistory, downloadTemplate},
    data() {
      return {
        showSider: true, //是否显示侧边栏
        treeData: [],
        props: { //树组件配置项
          label: 'name',
          isLeaf: 'leaf'
        },
        ciId: null,//默认：1082372687986688 IT设备
        ciName: null,
        isMath: undefined,
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
          // {
          //   name: '统一纳管',
          //   img: require('@/assets/img/xintong_img/devBookImg/propertydev.png'),
          //   typeName: 'deviceSource',
          //   typeId: '1130558647500800',
          //   val: 1102861334544385,
          //   num: 0,
          //   expression: 'equal'
          // },
          // {
          //   name: '非统一纳管',
          //   img: require('@/assets/img/xintong_img/devBookImg/nopropertydev.png'),
          //   typeName: 'deviceSource',
          //   typeId: '1130558647500800',
          //   val: 1102861753974784,
          //   num: 0,
          //   expression: 'equal'
          // },
          // {
          //   name: '投运到期设备',
          //   img: require('@/assets/img/xintong_img/devBookImg/touyundaoqi.png'),
          //   typeName: 'useAge',
          //   typeId: '1102858943791104',
          //   val: '8~100',
          //   num: 0,
          //   expression: 'between'
          // },
          // {
          //   name: '维保到期设备',
          //   img: require('@/assets/img/xintong_img/devBookImg/weibaodaoqi.png'),
          //   typeName: 'afterStatusCode',
          //   typeId: '1130557464707072',
          //   val: 1102248395735041,
          //   num: 0,
          //   expression: 'equal'
          // },
          {
            name: '存量设备总数',
            img: require('@/assets/img/xintong_img/devBookImg/nopropertydev.png'),
            typeName: 'isGovern',
            typeId: this.$store.state.common.govern.isGovern,
            val: '',
            num: 0,
            expression: 'is-not-null',
            searchNum: false
          },
          {
            name: '已治理数量',
            img: require('@/assets/img/xintong_img/devBookImg/propertydev.png'),
            typeName: 'isGovern',
            typeId: this.$store.state.common.govern.isGovern,
            //val: 1162125105233921,
            val: this.$store.state.common.govern.governYes,
            num: 0,
            expression: 'equal',
            searchNum: false
          },
        ],
        tableData: [],
        tableCol: [],
        total: 0,
        tableLoading: false,
        tableHeight: undefined,

        openExportHistory: false,//打开导出记录对话框
        openUpload: false,//打开导入对话框
        showDeviceListForm: false,//打开设备列表对话框
        importDeviceObj: {},
        arrtId: '',
        infoList: [],

        sxList: [],//筛选列表
        selectType: null,

        deviceCateList: null,
        deviceTypeList: null,
        showCMDBEdit: false,
        cmdbParams: {
          ciId: null,
          devId: null,
        },
        editParams: {},
        exportList: [
          {id: 'D001', name: '导出选中'},
          {id: 'D002', name: '导出搜索'},
          {id: 'D003', name: '导出全部'},
        ],
        devBookcIid: {
          cateciid: null,
          typeciid: null
        },
        noExportHisNum: null,

        openDownloadTemplate: false,
        downloadList: [
          {id: 'city', name: '下载地市模板'},
          // {id: 'system', name: '下载系统模板'},
        ],
        fileType: '',
      }
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
    computed: {
      ...mapGetters(['website', 'menu', "userInfo", "userDetail"]),
    },
    mounted() {
      this.$nextTick(() => {
        this.setTableHeight()
      })

      this.getBookInfo()
      this.getList()

      this.getExportHisNoDowloadNums();
    },
    methods: {
      //导出记录未下载次数请求
      getExportHisNoDowloadNums() {
        allNums({userId: this.userDetail.userId}).then(res => {
          if (res.data > 0) {
            this.noExportHisNum = res.data;
          } else {
            this.noExportHisNum = null;
          }
        })
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
            this.deviceCateList = res.data.records;
          } else if (node.level === 2) {
            this.deviceTypeList = res.data.records;
            res.data.records.forEach(item => {
              item.leaf = true
            })
          }
          return resolve(res.data.records)
        })
      },
      nodeClick(data, node) {
        if (data.level === 0) {
          this.deviceCategoryCode = null
          this.deviceTypeCode = null
          this.ciId = null
          this.ciName = null

          this.devBookcIid.cateciid = null
          this.devBookcIid.typeciid = null

          this.sxList = [];
          this.searchForm.attrFilterList = [];
          this.getBookInfo()
          this.getList()
        } else {

          if (node.level === 2) {
            this.devBookcIid.cateciid = data.ciId;
            this.devBookcIid.typeciid = null;
          } else if (node.level === 3) {
            this.devBookcIid.cateciid = data.parentCiId;
            this.devBookcIid.typeciid = data.ciId;
          }

          this.deviceCategoryCode = data.deviceClaccify || '';
          this.deviceTypeCode = data.deviceType || '';
          if (node.level === 2) {
            this.deviceTypeList = [];
            node.childNodes.forEach(item => {
              this.deviceTypeList.push(item.data);
            });
          }

          this.ciId = data.ciId;
          this.ciName = data.ciName;

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
            if (item.searchNum) {
              //通过全部检索获取 总数据量
              devListByType(form).then(res => {
                item.num = res.data.rowNum
              })
            } else {
              devBookList(form).then(res => {
                item.num = res.data.rowNum
              })
            }
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
          if (item.searchNum) {
            //通过全部检索获取 总数据量
            devListByType(form).then(res => {
              item.num = res.data.rowNum
            })
          } else {
            devBookList(form).then(res => {
              item.num = res.data.rowNum
            })
          }
        }
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
          if (item.searchNum) {
            //通过全部检索获取 总数据量
            devListByType(typeSearchForm).then(res => {
              item.num = res.data.rowNum
            })
          } else {
            devBookList(typeSearchForm).then(res => {
              item.num = res.data.rowNum
            })
          }
        }
      },
      searchType(item) {
        let dd = this.menu;
        if (dd) {
          let fItem = dd.find(a => a.path.indexOf('/assets') != -1);
          if (fItem) {
            if (fItem.path == '/assets/devStandingBook/index') {

              try {
                localStorage.setItem('assetspms', JSON.stringify(this.devBookcIid))
              } catch (err) {
                localStorage.clear();
                localStorage.setItem('assetspms', JSON.stringify(this.devBookcIid))
              }

              this.$router.$avueRouter.group = fItem.group;
              this.$router.$avueRouter.meta = fItem.meta;
              this.$router.push({
                path: this.$router.$avueRouter.getPath({
                  name: fItem[this.website.menu.props.label || config.propsDefault.label],
                  src: fItem[this.website.menu.props.path || config.propsDefault.path],
                  i18n: (fItem.meta || {}).i18n
                }),
                query: {
                  ...fItem.query,
                },
              });
            }
          } else {
            this.$message.error('设备管理路径未找到')
          }
        }
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
          if (item.searchNum) {
            //通过全部检索获取 总数据量
            devListByType(typeSearchForm).then(res => {
              item.num = res.data.rowNum
            })
          } else {
            devBookList(typeSearchForm).then(res => {
              item.num = res.data.rowNum
            })
          }
        }
        this.$refs.filterSearch.getAttrs(true);

        let tree = this.$refs.tree;
        tree.setCurrentKey(null)
        for (let i = 1; i < tree.store._getAllNodes().length; i++) {
          tree.store._getAllNodes()[i].expanded = false;
        }
      },
      seeDetail(row) {
        this.$router.push({
          path: '/detailRoute',
          query: {
            ciId: row.ciId,
            ciName: row.ciName,
            devId: row.id,
            uuid: row.uuid,
            componentName: 'devBookDetail',
            routerTitle: '资产管理详情',
            isEdit: true
          }
        });
      },
      dbClickDetail(val) {
        this.$router.push({
          path: '/detailRoute',
          query: {
            ciId: val.row.ciId,
            ciName: val.row.ciName,
            devId: val.row.id,
            uuid: val.row.uuid,
            componentName: 'devBookDetail',
            routerTitle: '资产管理详情',
            isEdit: true
          }
        });
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
      async exportClick(id) {
        if (id) {
          //资产管理导出
          if (id != 'D004' && (this.deviceCategoryCode == null || this.deviceCategoryCode === '')) {
            this.$alert('请先选择左侧设备分类！', {type: "warning"})
            return
          }
          let params = null;
          if (id === 'D001') {
            //导出选中
            if (this.$refs.xtTable.$refs.table.selection && this.$refs.xtTable.$refs.table.selection.length <= 0) {
              this.$alert('请选择列表中需要导出的数据', {type: "warning"})
              return;
            }
            params = {
              area: this.userDetail.regionCode || '37',
              deviceType: this.deviceTypeCode || '',
              deviceCategory: this.deviceCategoryCode || '',
              idList: this.$refs.xtTable.$refs.table.selection.map(el => el.id),
            }
          } else if (id === 'D002') {
            this.tableLoading = true
            let form = JSON.parse(JSON.stringify(this.searchForm));
            form.currentPage = 1;
            form.pageSize = 999999;
            await devBookList(form).then(res => {
              if (res.data.tbodyList && res.data.tbodyList.length > 0) {
                //导出搜索
                params = {
                  area: this.userDetail.regionCode || '37',
                  deviceType: this.deviceTypeCode || '',
                  deviceCategory: this.deviceCategoryCode || '',
                  idList: res.data.tbodyList.map(el => el.id),
                }
              } else {
                this.$alert('暂无数据可导出', '提醒', {
                  cancelButtonText: this.$t("cancelText"),
                  type: "warning"
                });
              }
            }).finally(() => {
              this.tableLoading = false
            })
          } else if (id === 'D003') {
            await this.$confirm("导出全部可能由于数据量过大导致下载缓慢，进度请在导出记录中查看, 确定继续导出全部数据?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              //导出全部
              params = {
                area: this.userDetail.regionCode || '37',
                deviceType: this.deviceTypeCode || '',
                deviceCategory: this.deviceCategoryCode || '',
              }
            });
          } else if (id === 'D004') {
            //导出记录
            params = null;
            this.openExportHistory = true;
          }
          if (params) {
            let fileName = `设备台账导出.xlsx`;
            this.download("/api/idevelop-device/hardwarebasic/cmdb/download", params, fileName, '下载中，请稍后...', false, false, () => {
              //下载成功回调
              if (this.$refs.exportHistory) {
                this.$refs.exportHistory.getList();
              }

              this.getExportHisNoDowloadNums();
            });
            this.$message.warning('请在导出记录中查看导出状态');
          }
        }
      },
      exportHistory() {
        //导出记录
        this.openExportHistory = true;
      },
      //废弃
      downloadClick(id) {
        if (id == 'city') { // 下载地市模板
          this.fileType = 'SELF'
        } else if (id == 'system') { // 下载系统模板
          this.fileType = 'ITUMP'
        }
        this.openDownloadTemplate = true
      },
      downloadCityClick(){
        this.fileType = 'SELF';
        this.openDownloadTemplate = true
      },
      importCmdbDeviceData(id) {
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
        if(id == 1){ // 数字化设备导入
          this.isMath = 0
          this.openUpload = true
        }else{ // 非数字化设备导入
          this.isMath = 1
          this.openUpload = true
        }
        
      },
      setValDeviceList(obj) {
        this.openUpload = false
        this.importDeviceObj = obj
        this.showDeviceListForm = true
      },
      resetUpload() {
        this.showDeviceListForm = false
        this.openUpload = true
      },
      getInfoList(list) {
        this.showDeviceListForm = false
        this.infoList = list
        //this.searchForm.deviceNum = this.infoList.length

        batchSave({
          records: JSON.parse(JSON.stringify(this.infoList)),
          deviceCategory: this.deviceCategoryCode
        }).then((res) => {
          if (res.msg != null && res.msg != '') {
            this.$message.warning(res.msg);
          }
        }).finally(() => {

        })
      },
      getInfoListExport(args) {
        //this.searchForm.deviceNum = this.infoList.length
        //this.tableLoading = true;

        // downloadError({records: JSON.parse(JSON.stringify(list))}).then((res) => {
        //   //this.getList();
        // }).finally(() => {
        //   //this.tableLoading = true;
        //   this.showDeviceListForm = false
        // })


        this.showDeviceListForm = false
        //导出台账数据文件
        let params = {
          area: this.userDetail.regionCode || '37',
          deviceType: this.deviceTypeCode || '',
          deviceCategory: this.deviceCategoryCode || '',
          records: JSON.parse(JSON.stringify(args.filterArr)),
          errAddr: JSON.parse(JSON.stringify(args.errAddr)),
        }
        //设备台账异常数据导出20240614xxxxxx
        let fileName = `设备台账异常数据导出${this.getTodayTime()}.xlsx`;
        this.download("/api/idevelop-device/hardwarebasic/cmdb/download-error", params, fileName);
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
      refreshDetial() {
        //新增后刷新列表
        this.getList();
      },
      handleAdd() {
        if (this.deviceCategoryCode == null || this.deviceCategoryCode === '') {
          this.$message.warning('请先选择左侧设备类型！')
          return
        }
        let formDetial = {};
        if (this.deviceCateList) {
          let fItemCate = this.deviceCateList.find(a => a.deviceClaccify == this.deviceCategoryCode);
          if (fItemCate) {
            formDetial['deviceCategory'] = fItemCate.ciLabel;
            formDetial['deviceCategoryCode'] = fItemCate.ciLabel;
          }
        }
        if (this.deviceTypeList) {
          let fItemType = this.deviceTypeList.find(a => a.deviceType == this.deviceTypeCode);
          if (fItemType) {
            formDetial['deviceType'] = fItemType.ciLabel;
            formDetial['deviceTypeCode'] = fItemType.ciLabel;
          }
        }

        this.cmdbParams = {ciId: this.ciId, devId: null,};
        this.editParams.ciName = this.ciName;
        this.editParams.devDetail = formDetial;
        this.editParams.devid = null;
        this.editParams.ciId = this.ciId;

        // this.editParams.uuid = row.cmdbUuid;

        this.showCMDBEdit = true;
      },
      handleDelete(row) {
        if (row) {
          //单个删除
          //删除某一条数据
          this.$confirm("确定将选择数据删除?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let data = {
              ciEntityList: [{ciEntityId: row.id, ciEntityName: row.name, ciId: row.ciId}],
              description: "",
              needCommit: true
            }
            return remove(data);
          }).then(() => {
            this.getList();
            this.$message({type: "success", message: "操作成功!"});
          });
        } else {
          //批量删除
          //删除多条数据
          if (this.$refs.xtTable.$refs.table.selection.length === 0) {
            this.$message.warning("请选择至少一条数据");
            return;
          }
          //
          let data = {
            ciEntityList: [],
            description: "",
            needCommit: true
          }

          this.$refs.xtTable.$refs.table.selection.forEach(ele => {
            data.ciEntityList.push({ciEntityId: ele.id, ciEntityName: ele.name, ciId: ele.ciId});
          });
          this.$confirm("确定将选择数据删除?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            return remove(data);
          }).then(() => {
            this.getList();
            this.$message({type: "success", message: "操作成功!"});
          });
        }
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
    }
  }
</script>

<style lang="scss" scoped>
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

  .table_btn /deep/ .el-badge__content.is-fixed {
    right: 20px;
  }
</style>


<!--<template>-->
<!--  <dev-standing-book from-type="zcgl"></dev-standing-book>-->
<!--</template>-->

<!--<script>-->

<!--import DevStandingBook from "@/views/assets/devStandingBook.vue";-->

<!--export default {-->
<!--  components: {DevStandingBook},-->
<!--  data() {-->
<!--    return {}-->
<!--  },-->
<!--  mounted() {-->
<!--  },-->
<!--  methods: {}-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--</style>-->
