<template>
  <basic-container>
    <!--设备退运-->
    <div class="page_form">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="产权单位" prop="applyDeptName">
              <xt-tree-lzay-select :formValue="searchForm.applyUnitName"
                                   :selectType="'CORP'"
                                   @getTreeItem="getEntityCorp"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产权部门" prop="applyDeptName">
              <xt-tree-lzay-select :formValue="searchForm.applyDeptName"
                                   :unit-id="searchForm.applyUnit"
                                   :selectType="'DEPT'"
                                   @getTreeItem="getEntityDept"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产生方式" prop="isAuto">
              <el-select v-model="searchForm.isAuto" placeholder="请选择产生方式" clearable>
                <el-option label="自动创建" value="0"></el-option>
                <el-option label="手动创建" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退运单号" prop="filingNo">
              <el-input v-model="searchForm.filingNo" placeholder="请输入退运单号" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编码" prop="deviceCode">
              <el-input v-model="searchForm.deviceCode" placeholder="请输入设备编码" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="设备来源" prop="deviceResource" >
              <el-select v-model="searchForm.deviceResource"  clearable placeholder="请选择设备来源">
                <el-option
                  v-for="item in deviceResourceList"
                  :value="item.dictKey"
                  :key="item.dictKey"
                  :label="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="工单状态" prop="processStatus">
              <el-select v-model="searchForm.processStatus" placeholder="请输入工单状态" clearable>
                <el-option v-for="dict in stepList" :key="dict.node" :label="dict.nodeName"
                           :value="dict.node"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="受理人" prop="acceptUserName">
              <el-input v-model="searchForm.acceptUserName" placeholder="请输入受理人" clearable
                        style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="受理时间" prop="submitDates">
              <el-date-picker
                style="width:100%"
                v-model="submitDates"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd"
                @change="dataPickerChange"
                clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>

          <!--          <el-col :span="6">-->
          <!--            <el-form-item label="设备是否归还" prop="isAllReturned">-->
          <!--              <el-select v-model="searchForm.isAllReturned" placeholder="" clearable>-->
          <!--                <el-option v-for="dict in isAllReturnedList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"></el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->


        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'设备退运管理'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
            <el-button type="primary" size="small" v-if="permission.devReturned_add" @click="handleAdd">新增</el-button>
            <!-- <el-button class="border-btn" size="small" @click="handleExport">导出</el-button> -->
            <!--  v-if="permission.devicereturned_add"   v-if="permission.devicereturned_export"-->
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
        <el-table-column prop="filingNo" label="退运单号" align="center" width="170"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyUnitName" label="产权单位" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyDeptName" label="产权部门" width="170" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceReturnNum" label="退运设备数" width="100" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="isAuto" label="产生方式" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.isAuto == 0">自动创建</span>
            <span v-else-if="scope.row.isAuto == 1">手动创建</span>
          </template>
        </el-table-column>
        <el-table-column prop="processStatus" label="工单状态" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showProcessStatus(scope.row.processStatus, stepList) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="status" label="设备来源" width="150" align="center" show-overflow-tooltip>
          <template  slot-scope="scope">
            <span>{{showDictLable(scope.row.deviceResource,deviceResourceList)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="acceptUserName" label="受理人" width="120" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="acceptTime" label="受理时间" width="150" align="center"
                         show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="isAllReturned" label="是否全部归还" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.isAllReturned, isAllReturnedList) }}</span>
          </template>
        </el-table-column> -->


        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-view"
                       v-if="permission.devReturned_view"
                       @click="handleView(scope.row,scope.index)">查看
            </el-button>
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-edit"
                       v-if="(scope.row.processStatus == 'hussar_2' || scope.row.processStatus == '1') && permission.devReturned_edit"
                       @click="handleEdit(scope.row,scope.index)">编辑
            </el-button>
            <el-button type="text"
                       class="btn_red"
                       size="small"
                       icon="el-icon-delete"
                       v-if="(scope.row.processStatus == '1') && permission.devReturned_del"
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
  import {getList, remove} from "@/api/operation/devReturned";
  import {getDictCmdbList, getDictList} from "@/api/dict";
  import {getDeptList} from "@/api/system/dept";
  import {mapGetters} from "vuex";
  import wbsSelect from "@/components/wbsSelect/index.vue";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
  import {processDict} from "@/api/process/index"

  export default {
    components: {wbsSelect, xtTreeLzaySelect},
    data() {
      return {
        // 搜索相关
        searchForm: {
          current: 1,
          size: 20,
        },
        submitDates: null,
        createTimes: null,
        // 表格相关
        dataList: [
          // {}
        ],
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
        operationTypeList: [],
        deviceResourceList: [],
        outBoundStatusList: [],
        stepList: [],

        unitList: [],
        isAllReturnedList: [
          {
            dictKey: '0',
            dictValue: '否'
          },
          {
            dictKey: '1',
            dictValue: '是'
          },
        ]
      };
    },
    computed: {
      ...mapGetters(["permission", "userInfo", "userDetail"]),
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
      // this.getDictList("outBoundStatus");
      let processDictRes = await processDict({orderType: 'bpm_sbty'})
      this.stepList = processDictRes.data
      //加载字典--设备来源
      this.getDictList("deviceSource");
      this.searchForm.applyUnitName = this.userDetail.ownerUnitName
      this.searchForm.applyUnit = this.userDetail.ownerUnit
      //加载数据
      this.onLoad();
      //获取 部门列表
      this.getDeptList()
    },
    methods: {
      // getEntityUnit(val) {
      //   //选择领用单位 部门
      //   this.searchForm.applyUnit = val.fullName
      //   this.$refs.searchForm.$forceUpdate()
      //   this.$forceUpdate()
      // },
      getEntityCorp(val) {
        this.searchForm.applyUnitName = val.fullName
        this.searchForm.applyUnit = val.id

        //部门初始化
        this.searchForm.applyDeptName = null
        this.searchForm.applyDept = null

        this.$refs.searchForm.$forceUpdate()
        this.$forceUpdate()
      },
      getEntityDept(val) {
        // console.log(90, val)
        //选择领用单位 部门
        this.searchForm.applyDeptName = val.fullName
        this.searchForm.applyDept = val.id

        this.$refs.searchForm.$forceUpdate()
        this.$forceUpdate()
      },
      async getDeptList() {
        //获取部门 单位
        await getDeptList().then(res => {
          this.unitList = res.data
        })
      },
      // 设置表格高度
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 50 - 60 + 'px'
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
          } else if (code === 'operationType') {
            this.operationTypeList = res.data;
          } else if (code === 'deviceSource') {
            this.deviceResourceList = res.data;
          }
        });
      },
      deviceCategoryChange(code) {
        //设备分类选择
        this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));
      },
      handleQuery() {
        this.searchForm.current = 1
        this.onLoad();
      },
      handleDeleteOne(id) {
        //删除按钮
        let ids = id;
        this.handleDeleteConfirm(ids);
        // this.selectionList.filter(item => item!=id);
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
        if (dictList != null && code !== '') {
          let items = dictList.filter(item => item.dictKey == code);
          if (items != null && items.length > 0) {
            return items[0].dictValue;
          }
        }
        return code;
      },
      showProcessStatus(code, dictList) {
        //字典回显
        if (dictList != null && code !== '') {
          let items = dictList.filter(item => item.node == code);
          if (items != null && items.length > 0) {
            return items[0].nodeName;
          } else {
            return '暂存'
          }
        }
        return code;
      },
      searchReset() {
        //重置按钮
        // this.$refs.searchForm.resetFields();
        this.searchForm = {
          current: 1,
          size: 20,
          applyUnitName: this.userDetail.ownerUnitName,
          applyUnit: this.userDetail.ownerUnit
        }
        this.submitDates = undefined;
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
            id: row.id,
            type: 'view',
            componentName: 'devReturnedAdd',
            routerTitle: '设备退运详情'
          }
        });
      },
      handleEdit(row) {
        //编辑 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: row.id,
            type: 'edit',
            componentName: 'devReturnedAdd',
            routerTitle: '设备退运编辑'
          }
        });
      },
      handleAdd() {
        //新增 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: 'devReturnedAdd',
            routerTitle: '设备退运申请'
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
  .list_btn {
    padding: 9px 5px !important;
  }

  .btn_red {
    color: red;
  }
</style>


