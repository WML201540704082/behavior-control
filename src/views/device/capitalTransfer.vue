<template>
  <basic-container>
    <div class="page_form">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="产权单位" prop="ownerUnit">
              <xt-tree-lzay-select :formValue="searchForm.ownerUnitName"
                                   :selectType="'CORP'"
                                   @getTreeItem="getEntityUnit"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产权部门" prop="propertyDept">
              <xt-tree-lzay-select :formValue="searchForm.propertyDeptName"
                                   :unit-id="searchForm.ownerUnit"
                                   :selectType="'DEPT'"
                                   @getTreeItem="getEntityDept"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备分类" prop="deviceCategory">
              <el-select v-model="searchForm.deviceCategory" placeholder="请选择设备分类" clearable
                         @change="deviceCategoryChange">
                <el-option v-for="dict in deviceCategoryList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备类型" prop="status">
              <el-select v-model="searchForm.deviceType" placeholder="请输入设备类型" :disabled="!searchForm.deviceCategory" clearable>
                <el-option v-for="dict in deviceTypeList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编码" prop="deviceCode">
              <el-input v-model="searchForm.deviceCode" placeholder="请输入设备编号" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="6">-->
          <!--            <el-form-item label="所在仓库" prop="warehouse"  clearable >-->
          <!--              <el-select v-model="searchForm.warehouse"  placeholder="请选择所在仓库" @change="warehouseChange">-->
          <!--                  <el-option  v-for="dict in warehouseList"  :key="dict.warehouseId"  :label="dict.warehouseName" :value="dict.warehouseId"></el-option>-->
          <!--                </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="6">
            <el-form-item label="WBS项目" prop="wbsProject" clearable>
              <wbsSelect placeholder="请选择WBS项目" type="wbsProject" v-model="searchForm.wbsProject" @change="wbsChange"></wbsSelect>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker
                class="formTime"
                v-model="createTimes"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                @change="dataPickerChange"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'设备转资管理列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
            <el-button type="primary" size="small" @click="handleAdd" v-if="permissionList.addBtn">新增</el-button>
<!--            <el-button class="border-btn" size="small" @click="handleExport" v-if="permissionList.exportBtn">导出-->
<!--            </el-button>-->
            <!--
            <el-button v-if="permission.devicetransfer_add" type="primary"  @click="handleAdd">转资</el-button>
            <el-button v-if="permission.devicetransfer_add || permission.devicetransfer_export " class="border-btn" @click="handleExport">导出</el-button>
            -->
          </div>
        </formTitle>
      </el-row>
      <el-table
        ref="dataTable"
        stripe
        size="small"
        :data="dataList"
        :height="tableHeight"
        v-loading="loading"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="filingNo" label="工单编号" width="180" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="ownerUnitName" label="产权单位" width="200" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="propertyDeptName" label="产权部门" width="200" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="wbsProject" label="WBS项目" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span> {{scope.row.wbsProject ? scope.row.wbsProject:showDictLable(scope.row.wbsElement,deviceWBSList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="wbsElement" label="WBS元素" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="processStatus" label="流程节点" :formatter="formatterText" width="120" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="erpStatus" label="ERP工单状态" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{showDictLable(scope.row.erpStatus,deviceErpStatusList)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="useKeepDept" label="使用保管部门" width="200" align="center" show-overflow-tooltip></el-table-column> -->
        <!-- <el-table-column prop="useKeepDept" label="实物保管部门" width="200" align="center" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="createTime" label="创建时间" width="150" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <!--v-if="permission.devicetransfer_view"-->
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-view"
                       v-if="permissionList.viewBtn"
                       @click="handleView(scope.row,scope.index)">查看
            </el-button>
            <!-- -->
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-edit"
                       v-if="(scope.row.status=='1' || scope.row.processStatus == 'hussar_2') && permissionList.editBtn"
                       @click="handleEdit(scope.row,scope.index)">编辑
            </el-button>
            <!-- v-if="permission.devicetransfer_delete && scope.row.status=='1'"-->
            <el-button type="text"
                       class="list_btn btn_red"
                       size="small"
                       icon="el-icon-delete"
                       v-if="scope.row.status=='1' && permissionList.delBtn"
                       @click="handleDeleteOne(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="onLoad"
      />
    </div>
  </basic-container>
</template>

<script>
  import {getList, remove} from "@/api/device/devicetransfer";
  import wbsSelect from "@/components/wbsSelect";
  import {getDictCmdbList, getDictList} from "@/api/dict";
  import {mapGetters, mapState} from "vuex";
  import {getWareDictList} from "@/api/device/warehouse";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
  import {processDict} from "@/api/process/index"

  export default {
    components: {xtTreeLzaySelect,wbsSelect},
    data() {
      return {
        // 搜索相关
        searchForm: {
          current: 1,
          size: 20,
        },
        createTimes: null,
        // 表格相关
        dataList: [],
        selectionList: [],
        loading: false,
        tableHeight: undefined,
        total: 0,
        // 字典
        procecssStepList: [],
        warehouseList: [],
        deviceCategoryList: [],
        deviceTypeList: [],
        deviceTypeListAll: [],
        deviceAddTypeList: [],
        useKeepDeptList: [],
        deviceStatusList: [],
        deviceErpStatusList: [],
        deviceWBSList: [],
        deviceChangeList: [],
        username: "",
      };
    },
    computed: {
      ...mapGetters(["permission","userDetail"]),
      ...mapState({
        userInfo: state => state.user.userInfo
      }),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.capitalTransfer_add, false),
          viewBtn: this.vaildData(this.permission.capitalTransfer_detail, false),
          delBtn: this.vaildData(this.permission.capitalTransfer_delete, false),
          editBtn: this.vaildData(this.permission.capitalTransfer_edit, false),
          exportBtn: this.vaildData(this.permission.capitalTransfer_export, false)
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
    async mounted() {
      // 设置页面元素高度
      this.setPageContentHeight()
      // 设置表格高度
      this.setTableHeight()
      //加载字典--工单状态
      this.getDictList("workOrderState");
      //加载字典--WBS元素
      //this.getDictList("wbsElt");
      // this.getCmdbDictList("1082607703228416");
      //加载字典--ERP工单状态
      this.getDictList("erpState");
      //加载字典--设备增加方式
      this.getDictList("deviceAddType");
      //加载字典--设备增加方式
      this.getDictList("deviceChangeType");
      //加载字典--设备类型
      //this.getDictList("deviceType");
      this.getCmdbDictList("1097745969774592");
      //加载字典--设备分类
      //this.getDictList("deviceCategory");
      this.getCmdbDictList("1097745625841664");
      // 加载字典--仓库
      this.getWareList()
      // 加载流程字典
      await this.getProcessList()
      this.searchForm.ownerUnitName = this.userDetail.ownerUnitName
      this.searchForm.ownerUnit = this.userDetail.ownerUnit
      //加载数据
      this.onLoad();

    },
    methods: {
      wbsChange(val, type){
        if(type == 'wbsElement'){
          this.searchForm.wbsProject = val.wbsName
        } else if( type == 'wbsProject' ) {
          this.searchForm.wbsElement = val.wbsCode
        }
      },
      getEntityUnit(val) {
        //选择单位 部门
        this.searchForm.ownerUnit = val.id
        this.searchForm.ownerUnitName = val.fullName
        this.$refs.searchForm.$forceUpdate()
        this.$forceUpdate()
      },
      getEntityDept(val) {
        //选择单位 部门
        this.searchForm.propertyDept = val.id
        this.searchForm.propertyDeptName = val.fullName
        this.$refs.searchForm.$forceUpdate()
        this.$forceUpdate()
      },
      // 设置表格高度
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 61 - 47 + 'px'
      },
      getWareList() {
        //加载仓库列表
        getWareDictList({ownerUnitId: this.$store.state.user.userDetail.ownerUnit || ''}).then(res => {
          this.warehouseList = res.data;
        });
      },
      async getProcessList() {
        await processDict({orderType: 'bpm_sbzz'}).then(res => {
          this.procecssStepList = res.data
        })
      },
      getCmdbDictList(code) {
        //加载cmdb字典
        let query = {}
        query.ciId = code || '1082372687986688'
        getDictCmdbList(query).then(res => {
          if (code === '1082607703228416') {
            this.deviceWBSList = res.data;
          } else if (code === '1097745625841664') {
            this.deviceCategoryList = res.data;
          } else if (code === '1097745969774592') {
            this.deviceTypeList = res.data;
            this.deviceTypeListAll = res.data;
          }
        });
      },
      getDictList(code) {
        //加载字典
        getDictList(code).then(res => {
          if (code === 'workOrderState') {
            this.deviceStatusList = res.data;
          } else if (code === 'wbsElt') {
            this.deviceWBSList = res.data;
          } else if (code === 'erpState') {
            this.deviceErpStatusList = res.data;
          } else if (code === 'deviceAddType') {
            this.deviceAddTypeList = res.data;
          } else if (code === 'deviceCategory') {
            this.deviceCategoryList = res.data;
          } else if (code === 'deviceType') {
            this.deviceTypeList = res.data;
            this.deviceTypeListAll = res.data;
          } else if (code === 'deviceChangeType') {
            this.deviceChangeList = res.data;
          }
        });
      },
      deviceCategoryChange(code) {
        //设备分类选择
        this.deviceTypeList = this.deviceTypeListAll.filter(item => item.pid == code);
      },
      handleQuery() {
        this.searchForm.current = 1
        this.onLoad();
      },
      handleDeleteOne(id) {
        //删除按钮
        let ids = id;
        this.handleDeleteConfirm(ids);
        this.selectionList.filter(item => item != id);
      },
      handleDelete() {
        //顶部删除
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.handleDeleteConfirm(this.ids);
      },
      handleDeleteConfirm(ids) {
        this.$confirm("点击确认将永久删除数据且无法恢复，请谨慎选择。", "确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(ids);
          })
          .then(() => {
            this.onLoad();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            //重新重新加载已经选择的数据。。。待实现
          });
      },
      showDictLable(code, dictList) {
        //字典回显
        if (dictList != null && code != '') {
          let items = dictList.filter(item => item.dictKey == code);
          if (items != null && items.length > 0) {
            return items[0].dictValue;
          }
        }
        return code;
      },
      searchReset() {
        //重置按钮
        // this.$refs.searchForm.resetFields();
        // this.searchForm.deviceType = undefined
        // this.searchForm.ownerUnit = undefined
        // this.searchForm.ownerUnitName = undefined
        // this.searchForm.propertyDept = undefined
        // this.searchForm.propertyDeptName = undefined
        this.searchForm.minDate = ''
        this.searchForm.maxDate = ''
        this.createTimes = null
        this.searchForm.minDate = null
        this.searchForm.maxDate = null
        this.searchForm = {
          current: 1,
          size: 20,
          ownerUnitName : this.userDetail.ownerUnitName,
          ownerUnit : this.userDetail.ownerUnit
        }
        this.onLoad();
      },
      selectionChange(selection) {
        //点击选择事件
        this.selectionList = selection.map(item => item.id);
      },
      selectionClear() {
        //清除选择
        this.selectionList = [];
        this.$refs.dataTable.clearSelection();
      },
      dataPickerChange(createTimes) {
        //时间段选择
        if (createTimes != null && createTimes.length > 0) {
          this.searchForm.minDate = createTimes[0] + ' 00:00:00'
          this.searchForm.maxDate = createTimes[1] + ' 23:59:59'
        } else {
          this.searchForm.minDate = null
          this.searchForm.maxDate = null
        }
      },
      onLoad() {
        //加载数据
        this.loading = true;
        getList(this.searchForm).then(res => {
          const data = res.data;
          this.total = data.total;
          this.dataList = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      handleView(row) {
        //详情 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: row.id,
            componentName: 'capitalTransferDetail',
            routerTitle: '设备转资详情'
          }
        });
      },
      handleEdit(row) {
        //编辑 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: row.id,
            componentName: 'capitalTransferAdd',
            routerTitle: '设备转资编辑'
          }
        });
      },
      handleAdd() {
        //新增 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: 'capitalTransferAdd',
            routerTitle: '设备转资新增'
          }
        });
      },
      handleExport() {
        //导出
      },
      formatterText(row, column, cellValue, index) {
        if (cellValue == "") return '未上报'
        else {
          for (let i = 0; i < this.procecssStepList.length; i++) {
            if (cellValue === this.procecssStepList[i].node) return this.procecssStepList[i].nodeName
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .list_btn {
    padding: 9px 5px !important;
  }

  .btn_red {
    color: red;
  }
</style>
