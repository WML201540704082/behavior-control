<template>
  <basic-container>
    <div class="page_form">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
        <el-row :gutter="10">

          <el-col :span="6">
            <el-form-item label="接口名称" prop="port">
              <el-input v-model="searchForm.port" placeholder="请输入接口名称" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接口类型" prop="portType">
              <el-input v-model="searchForm.portType" placeholder="请输入接口类型" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接口状态" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择接口状态" clearable>
                <el-option label="正常" :value="1"></el-option>
                <el-option label="停用" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> 
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'数据共享服务清单'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
            <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
            <el-button type="primary" size="small" @click="handleDown">下载</el-button>
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
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="port" label="接口名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="portType" label="接口类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="接口状态" align="center">
          <template slot-scope="scope">
            <span>{{showDictLable(scope.row.status,statusList)}}</span>
            <!-- <span>{{ scope.row.status }}</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="remake" label="业务描述" align="center" show-overflow-tooltip></el-table-column>
        

       
        <el-table-column label="操作" width="230" align="center" fixed="right">
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
                       icon="el-icon-edit"
                       @click="handleEdit(scope.row,scope.index)">编辑
            </el-button>
            <el-button type="text"
                       class="list_btn btn_red"
                       size="small"
                       icon="el-icon-delete"
                       @click="handleDeleteOne(scope.row.id)">删除
            </el-button>
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-download"
                       @click="handleDown(scope.row,scope.index)">下载
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
  import {getList, remove, getApplyDictList} from "@/api/dataSharing/dataList";
  import {getDictCmdbList, getDictList, getDictCmdbListPid} from "@/api/dict";
  import {mapGetters} from "vuex";
  import {getDeptList} from "@/api/system/dept";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";

  export default {
    components: {xtTreeLzaySelect},
    data() {
      return {
        // 搜索相关
        searchForm: {
          current: 1,
          size: 20,
        },
        // 表格相关
        dataList: [],
        selectionList: [],
        loading: false,
        tableHeight: undefined,
        total: 0,
        // 字典
        statusList: [
          {
            dictKey: 1,
            dictValue: '正常'
          },
          {
            dictKey: 0,
            dictValue: '停用'
          },
        ],

        deviceStatusList: [],
        applyStatusList: [],
        receiveUnit: [],
        receiveUnitList: [],
        
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
      // //加载字典--工单状态
      // //this.getDictList("applyStatus");
      // this.getApplyDictList();
      // //加载字典--设备类型
      // //this.getDictList("deviceType");
      // this.getCmdbDictList("1097745969774592");
      // //加载字典--设备分类
      // //this.getDictList("deviceCategory");
      // this.getCmdbDictList("1097745625841664");
      //权限
      // this.searchForm.receiveUnitName = this.userDetail.ownerUnitName
      // this.searchForm.receiveUnit = this.userDetail.ownerUnit
      //加载数据
      this.onLoad();
    },
    methods: {
     
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
          }else if (code === 'deviceChangeType') {
            this.deviceChangeList = res.data;
          }
        });
      },
      getApplyDictList() {
        //加载流程节点
        getApplyDictList().then(res => {
          this.applyStatusList = res.data;
          this.applyStatusList.forEach(ele => {
            ele.dictKey = ele.node || '';
            ele.dictValue = ele.nodeName || '';
          });
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
            componentName: 'dataListAdd',
            routerTitle: '数据共享服务清单查看'
          }
        });
      },
      handleEdit(row) {
        //编辑 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            id: row.id,
            componentName: 'dataListAdd',
            routerTitle: '数据共享服务清单编辑'
          }
        });
      },
      handleDown(row) {
        let param = {}
        if(row.id)param.id = row.id
        //导出
        const loading = this.$loading({
          lock: true,
          text: '正在处理，请稍等。。。',
          spinner: 'el-icon-loading'
        })
        this.download('/api/idevelop-endpoint/endpoint/port/export', param,
        `数据共享服务清单.xlsx`, loading)
      },
      handleAdd() {
        //新增 页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: 'dataListAdd',
            routerTitle: '数据共享服务清单新增'
          }
        });
      },
      handleExport() {
        
      }
    }
  }
</script>
<style lang="scss" scoped>
  .list_btn {
    padding: 9px 1px !important;
  }

  .btn_red {
    color: red;
  }
</style>
