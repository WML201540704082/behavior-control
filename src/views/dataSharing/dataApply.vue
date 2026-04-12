<template>
  <basic-container>
    <div class="page_form">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="申请单号" prop="filingNo">
              <el-input v-model="searchForm.filingNo" placeholder="请输入申请单号" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请项目组名" prop="applyTeamName">
              <el-input v-model="searchForm.applyTeamName" placeholder="请输入申请项目组名" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请地址IP" prop="applyIp">
              <el-input v-model="searchForm.applyIp" placeholder="请输入申请地址IP" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          
          <!-- <el-col :span="6">
            <el-form-item label="设备分类" prop="deviceCategory">
              <el-select v-model="searchForm.deviceCategory" placeholder="请选择设备分类" clearable
                         @change="deviceCategoryChange">
                <el-option v-for="dict in deviceCategoryList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备类型" prop="deviceType">
              <el-select v-model="searchForm.deviceType" placeholder="请选择设备类型" clearable
                         :disabled="!searchForm.deviceCategory">
                <el-option v-for="dict in deviceTypeList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="流程节点" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择流程节点" clearable>
                <el-option v-for="dict in applyStatusList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="以旧换新" prop="oldToNew">
              <el-select v-model="searchForm.oldToNew" placeholder="请选择是否以旧换新" clearable>
                <el-option label="是" :value="0"></el-option>
                <el-option label="否" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'数据共享申请管理'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
            <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
            <!-- <el-button class="border-btn"  v-if="permission.deviceapply_export"  size="small" @click="handleExport">导出</el-button> -->
          </div>
        </formTitle>
      </el-row>
      <!-- class="tableContent" -->
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
        <el-table-column prop="filingNo" label="申请单号" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyTeamName" label="申请项目组名" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyIp" label="申请地址IP" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyNumber" label="申请数量" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyPhone" label="项目组联系方式" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="processStatus" label="流程状态" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable2(scope.row.processStatus, processStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyCause" label="申请原因" align="center" show-overflow-tooltip></el-table-column>
        

        <!-- <el-table-column prop="receiveUnitName" label="领用单位" width="150" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="receiveDutyDeptName" label="领用部门" width="150" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceCategory" label="设备分类" align="center" width="90">
          <template slot-scope="scope">
            <span>{{showDictLable(scope.row.deviceCategory,deviceCategoryList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceType" label="设备类型" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.deviceTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyNum" label="申请数量" width="80" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="receiveDutyPersonName" label="责任人" width="90" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="outboundNo" label="关联出库单号" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link style="font-size: 12px" type="primary" @click="handleView1(scope.row)"> {{ scope.row.outboundNo
              }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="operationNo" label="关联投运单号" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link style="font-size: 12px" type="primary" @click="handleView2(scope.row)"> {{ scope.row.operationNo
              }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="oldToNew" label="以旧换新" width="80" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.oldToNew=='1'">否</span>
            <span v-else>是</span>
          </template>

        <el-table-column prop="status" label="流程节点" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.status + '', applyStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyDate" label="申请时间" width="150" align="center"
                         show-overflow-tooltip></el-table-column> -->
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-view"
                       @click="handleView(scope.row,scope.index)">查看
            </el-button>
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-view"
                       v-if="scope.row.processStatus && scope.row.processStatus != 'hussar_7'"
                       @click="handleAudited(scope.row,scope.index)">审批
            </el-button>
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-edit"
                       v-if="!scope.row.processStatus"
                       @click="handleEdit(scope.row,scope.index)">编辑
            </el-button>
            <el-button type="text"
                       class="list_btn btn_red"
                       size="small"
                       icon="el-icon-delete"
                       v-if="!scope.row.processStatus"
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
  import {getList, remove, getApplyDictList} from "@/api/dataSharing/dataApply";
  import { processDict } from "@/api/process/index"
  import {getDictCmdbList, getDictList, getDictCmdbListPid} from "@/api/dict";
  import {mapGetters} from "vuex";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";

  export default {
    components: {xtTreeLzaySelect},
    data() {
      return {
        // 搜索相关
        searchForm: {
          current: 1,
          size: 20,
          deviceType: undefined,
          applyUser: undefined
        },
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
        receiveUnit: [],
        processStatusList: []
      };
    },
    computed: {
      ...mapGetters(["permission", "userInfo", "userDetail"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.deviceapply_add, false),
          viewBtn: this.vaildData(this.permission.deviceapply_view, false),
          delBtn: this.vaildData(this.permission.deviceapply_delete, false),
          editBtn: this.vaildData(this.permission.deviceapply_edit, false),
          exportBtn: this.vaildData(this.permission.deviceapply_export, false)
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

      processDict({orderType: 'bpm_jksp'}).then(res=>{
        this.processStatusList = res.data
      })

      //加载字典--工单状态
      //this.getDictList("workOrderState");
      //加载字典--WBS元素
      //this.getDictList("wbsElt");
      //this.getCmdbDictList("1082607703228416");
      //加载字典--工单状态
      //this.getDictList("applyStatus");
      // this.getApplyDictList();
      // //加载字典--设备类型
      // //this.getDictList("deviceType");
      // this.getCmdbDictList("1097745969774592");
      // //加载字典--设备分类
      // //this.getDictList("deviceCategory");
      // this.getCmdbDictList("1097745625841664");
      //权限
      // this.searchForm.receiveUnit = this.userDetail.ownerUnitId;
      // this.searchForm.receiveUnitName = this.userDetail.ownerUnitName
      // this.searchForm.receiveUnit = this.userDetail.ownerUnit
      //加载数据
      this.onLoad();
    },
    methods: {
      showDictLable2(code, dictList) {
        //字典回显
        if (dictList != null && code !== '') {
          let items = dictList.filter(item => item.node == code);
          if (items != null && items.length > 0) {
            return items[0].nodeName;
          }
        }
        return code;
      },
      handleAudited(row) {
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: row.id,
            isInfo: true,
            isShenpi: true,
            componentName: 'dataApplyAdd',
            routerTitle: '数据共享申请详情'
          }
        });
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
          }
        });
      },
      getApplyDictList() {
        //加载流程节点
        getApplyDictList().then(res => {
          // console.log(9122, res)
          this.applyStatusList = res.data;
          this.applyStatusList.forEach(ele => {
            ele.dictKey = ele.node || '';
            ele.dictValue = ele.nodeName || '';
          });
        });
      },
      deviceCategoryChange(code) {
        //设备分类选择
        // this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));
        this.searchForm.deviceType = ''
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
          let items = dictList.filter(item => item.dictKey == (code));
          if (items != null && items.length > 0) {
            return items[0].dictValue;
          }
        }
        return code;
      },
      searchReset() {
        this.searchForm = {
          current: 1,
          size: 20,
          receiveUnitName: this.userDetail.ownerUnitName,
          receiveUnit: this.userDetail.ownerUnit
        }
        //重置按钮
        // this.$refs.searchForm.resetFields();
        // this.searchForm.receiveUnitName = null
        // this.searchForm.receiveDutyDept = null
        // this.searchForm.receiveUnit = null
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
            isInfo: true,
            componentName: 'dataApplyAdd',
            routerTitle: '数据共享申请详情'
          }
        });
      },
      handleEdit(row) {
        //编辑 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: row.id,
            componentName: 'dataApplyAdd',
            routerTitle: '数据共享申请编辑'
          }
        });
      },
      handleAdd() {
        //新增 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: 'dataApplyAdd',
            routerTitle: '数据共享申请新增'
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
