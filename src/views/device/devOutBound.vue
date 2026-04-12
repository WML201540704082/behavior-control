<template>
  <basic-container>
    <div class="page_form">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="领用单位" prop="receiveDutyDeptName" clearable>
              <xt-tree-lzay-select :formValue="searchForm.receiveUnitName"
                                   :selectType="'CORP'"
                                   @getTreeItem="getEntityUnit"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="领用部门" prop="receiveDutyDeptName" clearable>
              <xt-tree-lzay-select :formValue="searchForm.receiveDutyDeptName"
                                   :unit-id="searchForm.receiveUnit"
                                   :selectType="'DEPT'"
                                   @getTreeItem="getEntityDept"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备分类" prop="deviceCategory">
              <el-select v-model="searchForm.deviceCategory" placeholder="请选择设备分类" clearable @change="deviceCategoryChange">
                <el-option v-for="dict in deviceCategoryList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备类型" prop="deviceType">
              <el-select v-model="searchForm.deviceType" placeholder="请选择设备类型" clearable :disabled="!searchForm.deviceCategory">
                <el-option v-for="dict in deviceTypeList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编码" prop="deviceCode">
              <el-input v-model="searchForm.deviceCode" placeholder="请输入设备编码" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>

<!--          <el-col :span="6">-->
<!--            <el-form-item label="所属单位" prop="receiveUnitName" clearable>-->
<!--              <xt-tree-lzay-select :formValue="searchForm.receiveUnitName"-->
<!--                                   :selectType="'CORP'"-->
<!--                                   @getTreeItem="getEntityUnit"></xt-tree-lzay-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="6">-->
<!--            <el-form-item label="所在仓库" prop="warehouse" clearable>-->
<!--              <el-select v-model="searchForm.warehouse" placeholder="请选择所在仓库" clearable>-->
<!--                <el-option v-for="dict in warehouseList" :key="dict.uuid" :label="dict.warehouseName" :value="dict.uuid"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="6">
            <el-form-item label="出库时间" prop="createTime">
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
          <el-col :span="6">
            <el-form-item label="出库单号" prop="outboundNo">
              <el-input v-model="searchForm.outboundNo" placeholder="请输入出库单号" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关联投运单号" prop="operationNo">
              <el-input v-model="searchForm.operationNo" placeholder="请输入投运单号" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关联申请单号" prop="applyNo">
              <el-input v-model="searchForm.applyNo" placeholder="请输入申请单号" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

<!--        <el-row :gutter="10">-->
<!--          <el-col :span="6">-->
<!--            <el-form-item label="流程节点" prop="status">-->
<!--              <el-select v-model="searchForm.status" placeholder="请选择流程节点" clearable>-->
<!--                <el-option v-for="dict in applyStatusList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <!-- <el-col :span="6">
            <el-form-item label="出库类型" prop="outboundStatus" >
              <el-select v-model="searchForm.outboundStatus"  placeholder="请输入出库类型" clearable >
                <el-option  v-for="dict in outBoundStatusList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item
          </el-col> -->
          <!--          <el-col :span="6">
                      <el-form-item label="WBS项目" prop="wbsElement"  clearable>
                        <wbsSelect type="wbsElement" placeholder="请选择WBS元素" v-model="searchForm.wbsProject" @change="wbsChange"></wbsSelect>
                      </el-form-item>
                    </el-col>-->
<!--        </el-row>-->
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'设备出库管理列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
            <!--  <el-button type="primary"  v-if="permission.deviceapply_add"  size="small"  @click="handleAdd">新增</el-button>-->
            <!-- <el-button class="border-btn"   v-if="permission.deviceapply_export" size="small" @click="handleExport">导出</el-button> -->
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
        <el-table-column prop="outboundNo" label="出库单号" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operationNo" label="关联投运单号" width="145" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyNo" label="关联申请编号" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="receiveUnitName" label="领用单位" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="receiveDutyDeptName" label="领用部门" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyNum" label="出库数量" width="80" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceCategory" label="设备分类" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.deviceCategory, deviceCategoryList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceType" label="设备类型" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.deviceType, deviceTypeListAll) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="流程节点" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.status + '', applyStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oldToNew" label="以旧换新" width="80" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.oldToNew=='1'">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
<!--        <el-table-column prop="warehouseName" label="所在仓库" width="120" align="center" show-overflow-tooltip></el-table-column>-->
        <!--        <el-table-column prop="applyUserName" label="受理人" width="120"  align="center" show-overflow-tooltip></el-table-column>-->


        <!-- <el-table-column prop="outboundStatus" label="出库类型" width="100" align="center" show-overflow-tooltip>
          <template  slot-scope="scope">
            <span>{{showDictLable(scope.row.outboundStatus,outBoundStatusList)}}</span>
          </template>
        </el-table-column> -->

        <!-- <el-table-column prop="operation" label="立即投运" width="80" align="center" show-overflow-tooltip>
          <template  slot-scope="scope">
            <span v-if="scope.row.operation=='1'">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="outboundTime" label="出库时间" width="150" align="center" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="outboundNum" label="出库数量" width="80" align="center" show-overflow-tooltip></el-table-column> -->
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-view"
                       v-if="permission.deviceoutbound_view"
                       @click="handleView(scope.row,scope.index)">查看
            </el-button>
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-edit"
                       v-if="permission.deviceoutbound_edit && scope.row.status==4"
                       @click="handleEdit(scope.row,scope.index)">处理
            </el-button>
            <!--            <el-button type="text"
                                   class="list_btn btn_red"
                                   size="small"
                                   icon="el-icon-delete"
                                   v-if="permission.deviceoutbound_delete && scope.row.status==0"
                                   @click="handleDeleteOne(scope.row.id)">删除
                        </el-button>-->
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
import {getList, remove} from "@/api/device/deviceoutbound";
import {getApplyDictList, getOutboundDictList} from "@/api/device/deviceapply";
import {getDictCmdbList, getDictList,getDictCmdbListPid} from "@/api/dict";
import {mapGetters} from "vuex";
import wbsSelect from "@/components/wbsSelect/index.vue";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDeptList} from "@/api/system/dept";
import {getWareDictList} from "@/api/device/warehouse";

export default {
  components: {xtTreeLzaySelect, wbsSelect},
  data() {
    return {
      // 搜索相关
      searchForm: {
        outboundNo: undefined,
        receiveUnitName: undefined,
        warehouse: undefined,
        status: undefined,
        outboundStatus: undefined,
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
      deviceCategoryList: [],
      deviceTypeList: [],
      deviceTypeListAll: [],
      useKeepDeptList: [],
      deviceStatusList: [],
      applyStatusList: [],
      outBoundStatusList: [],
      username: "",
      unitList: [],
      warehouseList: [],
      areaId: '',
    };
  },
  computed: {
    ...mapGetters(["permission", "userInfo", "userDetail"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.deviceoutbound_add, false),
        viewBtn: this.vaildData(this.permission.deviceoutbound_view, false),
        delBtn: this.vaildData(this.permission.deviceoutbound_delete, false),
        editBtn: this.vaildData(this.permission.deviceoutbound_edit, false),
        exportBtn: this.vaildData(this.permission.deviceoutbound_export, false)
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
    // 设置表格高度
    this.setTableHeight()
    //加载字典--工单状态
    //this.getDictList("applyStatus");
    this.getApplyDictList();
    //加载字典--出库类型
    // this.getDictList("outBoundStatus");
    //加载字典--设备类型
    //this.getDictList("deviceType");
    this.getCmdbDictList("1097745969774592");
    //加载字典--设备分类
    //this.getDictList("deviceCategory");
    this.getCmdbDictList("1097745625841664");
    //加载 仓库列表
    this.getWareList();
    // 获得部门树
    this.getDeptList()

    this.areaId = this.userDetail.regionCode || '37'
    this.searchForm.areaId = this.userDetail.regionCode || '37'
    this.searchForm.receiveUnitName = this.userDetail.ownerUnitName
    this.searchForm.receiveUnit = this.userDetail.ownerUnit
    //加载数据
    this.onLoad();
  },
  methods: {
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 50 - 55 + 'px'
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
        if (code === 'applyStatus') {
          this.applyStatusList = res.data;
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
        } else if (code === 'outBoundStatus') {
          this.outBoundStatusList = res.data;
        }
      });
    },
    getApplyDictList() {
      //加载流程节点
      getOutboundDictList().then(res => {
        this.applyStatusList = res.data;
        this.applyStatusList.forEach(ele => {
          ele.dictKey = ele.node || '';
          ele.dictValue = ele.nodeName || '';
        });
      });
    },
    getWareList() {
      //加载仓库列表
      getWareDictList({ownerUnitId: this.userDetail.ownerUnit || ''}).then(res => {
        this.warehouseList = res.data;
      });
    },
    wbsChange(val, type) {
      if (type == 'wbsElement') {
        this.searchForm.wbsProject = val.wbsName
      } else if (type == 'wbsProject') {
        this.searchForm.wbsElement = val.wbsCode
      }
    },
    deviceCategoryChange(code) {
      //设备分类选择
      // this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));
      this.getDictCmdbListPid('1097745969774592', code) // 设备类型
    },
    getDictCmdbListPid(ciId, pid) {
      getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
        if (ciId === '1097745969774592') { // 设备类型
          this.deviceTypeList = res.data;
        }
      });
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
    getDeptList() {
      //加载部门数据
      getDeptList().then(res => {
        this.unitList = res.data
      })
    },
    // eslint-disable-next-line no-unused-vars
    getEntityUnit(val) {
      //选择领用单位 部门
      this.searchForm.receiveUnitName = val.fullName
      this.searchForm.receiveUnit = val.id
      this.$refs.searchForm.$forceUpdate()
      this.$forceUpdate()
    },
    getEntityDept(val) {
      //领用部门
      this.searchForm.receiveDutyDeptName = val.fullName
      this.searchForm.receiveDutyDept = val.id
      this.$refs.searchForm.$forceUpdate()
      this.$forceUpdate()
    },
    searchReset() {
      //重置按钮
      // this.$refs.searchForm.resetFields();
      this.searchForm.beginTime = undefined
      this.searchForm.endTime = undefined
      // this.searchForm.receiveUnit = undefined
      this.createTimes = null
      this.searchForm = {
        current: 1,
        size: 20,
        receiveUnitName : this.userDetail.ownerUnitName,
        receiveUnit : this.userDetail.ownerUnit
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
        this.searchForm.beginTime = createTimes[0] + ' 00:00:00'
        this.searchForm.endTime = createTimes[1] + ' 23:59:59'
      } else {
        this.searchForm.beginTime = null
        this.searchForm.endTime = null
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
          outboundNo: row.outboundNo,
          id: row.id,
          componentName: 'devOutBoundDetail',
          routerTitle: '设备出库详情'
        }
      });
    },
    handleEdit(row) {
      //编辑 页面
      this.$router.push({
        path: '/detailRoute',
        query: {
          id: row.id,
          componentName: 'devOutBoundAdd',
          routerTitle: '设备出库审核',
          formRouter: '/device/devOutBound'
        }
      });
    },
    handleAdd() {
      //新增 页面
      this.$router.push({
        path: '/detailRoute',
        query: {
          componentName: 'devOutBoundAdd',
          routerTitle: '设备出库新增'
        }
      });
    },
    handleExport() {
      //导出
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .formTime {
  width: 100%;
  margin-top: 4px;

  .el-icon-date {
    margin-top: -7px;
  }
}

.list_btn {
  padding: 9px 5px !important;
}

.btn_red {
  color: red;
}
</style>
