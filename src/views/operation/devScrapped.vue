<template>
  <basic-container>
    <!-- 设备报废-->
    <div class="page_form">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="产权单位" prop="applyUnitName">
              <xt-tree-lzay-select :formValue="searchForm.applyUnitName"
                                   :selectType="'CORP'"
                                   @getTreeItem="getuseApplyCorp"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产权部门" prop="applyDeptName">
              <xt-tree-lzay-select :formValue="searchForm.applyDeptName"
                                   :unit-id="searchForm.applyUnit"
                                   :selectType="'DEPT'"
                                   @getTreeItem="getuseApplyDept"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工单状态" prop="status">
              <el-select v-model="searchForm.processStatus" :value-key="searchForm.dictKey" placeholder="请选择工单状态"
                         clearable>
                <el-option v-for="dict in stepList" :key="dict.node" :label="dict.nodeName"
                           :value="dict.node"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报废单号" prop="operationNo">
              <el-input v-model="searchForm.filingNo" placeholder="请输入报废单号" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编码" prop="deviceCode">
              <el-input v-model="searchForm.deviceCode" placeholder="请输入设备编码" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请人" prop="applyUser">
              <el-input v-model="searchForm.applyUserName" placeholder="请输入申请人" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
               <el-form-item label="工单类型" prop="operationType"  >
              <el-input v-model="searchForm.operationType"  placeholder="请输入工单类型" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col> -->

          <el-col :span="6">
            <el-form-item label="报废时间" prop="submitDates">
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
          <!--            <el-form-item label="报废时间" prop="createTime">-->
          <!--              <el-date-picker-->
          <!--                v-model="searchForm.scrapTime"-->
          <!--                type="datetime"-->
          <!--                value-format="yyyy-MM-dd HH:mm:ss"-->
          <!--                placeholder="请选择报废时间"></el-date-picker>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->


        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'设备报废管理列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
            <el-button type="primary" size="small" v-if="permission.devScrap_add" @click="handleAdd">新增</el-button>
            <!-- <el-button class="border-btn"   size="small" @click="handleExport">导出</el-button> -->
            <!--  v-if="permission.devicescrapped_add"   v-if="permission.devicescrapped_export"-->
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
        <el-table-column prop="filingNo" label="工单单号" width="170" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyUnitName" label="产权单位" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyDeptName" label="产权部门" width="170" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceNum" label="报废设备数" width="150" align="center"
                         show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="scrapReason" label="报废原因" width="170" align="center"
                         show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="scrapReason" label="报废原因" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.scrapReason, baofeiReasonList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="processStatus" label="流程节点" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showProcessStatus(scope.row.processStatus, stepList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="scrapTime" label="受理时间" width="150" align="center"
                         show-overflow-tooltip></el-table-column>

        <!--        <el-table-column prop="applyUserName" label="申请人" width="100" align="center" show-overflow-tooltip></el-table-column>-->

        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-view"
                       @click="handleView(scope.row.id,scope.index)">查看
            </el-button>
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       v-if="(scope.row.status == '1' || scope.row.processStatus == 'hussar_2') && permission.devScrap_edit"
                       icon="el-icon-edit"
                       @click="handleEdit(scope.row.id,scope.index)">编辑
            </el-button>
            <el-button type="text"
                       size="small"
                       v-if="(scope.row.status == '1' || scope.row.processStatus == 'hussar_2') && permission.devScrap_delete"
                       icon="el-icon-delete"
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
  import {scrapList, scrapDel} from "@/api/operation/deviceoperation";
  import {mapGetters} from "vuex";
  import wbsSelect from "@/components/wbsSelect/index.vue";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
  import {dateFormat} from "@/util/date";
  import {getUserDetail} from "@/api/user";
  import {processDict} from "@/api/process/index"
  import {getDictCmdbList} from "@/api/dict";

  export default {
    components: {wbsSelect, xtTreeLzaySelect},
    data() {
      return {
        // 搜索相关
        searchForm: {
          current: 1,
          size: 20,
          scrapTime: null,
          applyUserName: null,
        },
        submitDates: null,
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
        operationTypeList: [],
        deviceSourceList: [],
        outBoundStatusList: [],
        username: "",
        stepList: [],
        baofeiReasonList: []
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
      let processDictRes = await processDict({orderType: 'bpm_sbbf'})
      this.stepList = processDictRes.data
      this.searchForm.applyUnitName = this.userDetail.ownerUnitName
      this.searchForm.applyUnit = this.userDetail.ownerUnit
      //加载数据
      this.beforeOpen()
      this.getScarpReason()
    },
    methods: {
      getScarpReason() {
        //加载字典
        getDictCmdbList({ciId: '1131281812619264'}).then(res => {
          this.baofeiReasonList = res.data;
        });
      },
      beforeOpen() {
        //加载默认数据
        getUserDetail().then(res => {
          let usr = res.data;
          // this.searchForm.applyUserName = usr.realName || ''
          // this.searchForm.applyUser = usr.userId || ''
          // 获取WBS数据
          this.onLoad()
        }).catch(() => {
          // 获取WBS数据
          this.onLoad()
        });
      },
      //申请单位
      getuseApplyCorp(val) {
        this.searchForm.applyUnit = val.id
        this.searchForm.applyUnitName = val.fullName

        this.searchForm.applyDept = null
        this.searchForm.applyDeptName = null

        this.$forceUpdate()
      },
      // 申请部门
      getuseApplyDept(val) {
        this.searchForm.applyDept = val.id
        this.searchForm.applyDeptName = val.fullName
        this.$forceUpdate()
      },

      // 设置表格高度
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 50 - 55 + 'px'
      },
      showProcessStatus(code, dictList) {
        //字典回显
        if (dictList != null && code !== '') {
          let items = dictList.filter(item => item.node == code);
          if (items != null && items.length > 0) {
            return items[0].nodeName;
          } else {
            return '未上报'
          }
        }
        return code;
      },
      onLoad() {
        //加载数据
        this.loading = true;
        scrapList(this.searchForm).then(res => {
          const data = res.data;
          this.total = data.total;
          this.dataList = data.records;
          this.loading = false;
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
            return scrapDel({ids: ids + ''});
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
        this.searchForm = {
          current: 1,
          size: 20,
          applyUnitName: this.userDetail.ownerUnitName,
          applyUnit: this.userDetail.ownerUnit
        }
        this.searchForm.beginTime = null
        this.searchForm.endTime = null
        this.onLoad();
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
        scrapList(this.searchForm).then(res => {
          const data = res.data;
          this.total = data.total;
          this.dataList = data.records;
          this.loading = false;
          // this.selectionClear();
        });
      },

      handleView(row) {
        //详情 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: row,
            componentName: 'devScrappedDetail',
            routerTitle: '设备报废详情'
          }
        });
      },
      handleEdit(row) {
        //编辑 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: row,
            componentName: 'devScrappedAdd',
            routerTitle: '设备报废编辑'
          }
        });
      },
      handleAdd() {
        //新增 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: 'devScrappedAdd',
            routerTitle: '设备报废申请'
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

