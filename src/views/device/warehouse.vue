<template>
  <basic-container>
    <div class="page_form">
      <el-form ref="searchForm" :model="searchForm" label-width="105px" class="xt_search_form">
      <el-row>
        <el-col :span="6">
          <el-form-item label="仓库名称" prop="warehouseName">
            <el-input
              placeholder="请输入仓库名称"
              clearable
              v-model="searchForm.warehouseName"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="仓库编号" prop="warehouseId">
            <el-input
              placeholder="请输入仓库编号"
              clearable
              v-model="searchForm.warehouseId"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属单位" prop="ownerUnit">
            <xt-tree-lzay-select :formValue="searchForm.ownerUnit"
                                 :selectType="'CORP'"
                                 @getTreeItem="getEntityReceiveUnit"></xt-tree-lzay-select>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
      </div>
      <div class="page_body">
        <el-row>
          <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
            <div slot="rightBtnBox">
              <el-button type="primary"
                         v-if="permission.warehouse_view"
                         @click="handleQuery">查询</el-button>
              <el-button  style="margin-left: 5px;" type="primary" plain
                          @click="handleReset">重置</el-button>
              <el-button  type="primary"  style="margin-left: 5px;"
                          v-if="permission.warehouse_add"
                          @click="handleAdd">新增</el-button>
              <el-button  style="margin-left: 5px;" type="danger" plain
                          v-if="permission.warehouse_delete"
                          @click="handleDel">删除</el-button>
            </div>
          </formTitle>
        </el-row>
      <el-table
        ref="dataTable"
        stripe
        size="small"
        :data="dataList"
        :height="tableHeight"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="warehouseId" label="仓库编号" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ownerUnit" label="所属单位" width="200" align="center" show-overflow-tooltip>
          <template  slot-scope="scope">
            <span>{{showDictLable(scope.row.ownerUnit,oprtDeptList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseStatus" label="仓库状态" width="200" align="center" show-overflow-tooltip :formatter="changeStatus"></el-table-column>
        <el-table-column prop="chargeUser" label="负责人员" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phoneNum" label="联系电话" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="详细地址" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template  slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="list_btn"
              icon="el-icon-view"
              v-if="permission.warehouse_view"
              @click="handleView(scope.row, scope.index)">查看
            </el-button>
            <el-button
              type="text"
              size="small"
              class="list_btn"
              icon="el-icon-edit"
              v-if="permission.warehouse_edit"
              @click="handleEdit(scope.row, scope.index)">编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              class="list_btn btn_red"
              icon="el-icon-delete"
              v-if="permission.warehouse_delete"
              @click="handleDeleteOne(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"/>
    </div>
    <div class="page_body"></div>
  </basic-container>
</template>

<script>

  import {mapGetters} from "vuex";
  import {getDictList} from "@/api/dict";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
  import {getDeptList} from "@/api/system/dept";

  export default {
    components:{xtTreeLzaySelect},
    data() {
      return {
        tableLoading: false, //表格加载
        tableHeight: undefined,
        dataList:[],
        receiveUnitList:[],
        oprtDeptList: [],
        searchForm: {
          current: 1,
          size: 20
        },
        total: 0,
        form: {},
        query: {},
        loading: true,
        selectionList: [],
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.warehouse_add, false),
          viewBtn: this.vaildData(this.permission.warehouse_view, false),
          delBtn: this.vaildData(this.permission.warehouse_delete, false),
          editBtn: this.vaildData(this.permission.warehouse_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    mounted() {
      // 获得部门树
      this.getDeptList()
      // 设置页面元素高度
      this.setPageContentHeight()
      //加载所属单位
      this.getDictList("oprtDept");
    },
    created() {
      getList(this.searchForm).then(res=>{
        this.dataList = res.data.records
      })
    },
    methods: {
      getEntityReceiveUnit(val) {
        //选择所属单位
        this.searchForm.ownerUnit = val.fullName
        this.searchForm.ownerUnitId= val.id
        this.$refs.searchForm.$forceUpdate()
        this.$forceUpdate()
      },
      async getDeptList() {
        //加载部门数据
        await getDeptList().then(res => {
          this.receiveUnitList = res.data
        })
      },
      // eslint-disable-next-line no-unused-vars
      changeStatus(row,index){
        if (row.warehouseStatus=='0'){
          return "停用"
        }else if (row.warehouseStatus=='1'){
          return "启用"
        }
      },
      handleDel(){
        let selectList = this.$refs.dataTable.selection
        if (selectList.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的数据！'
          });
          return
        }
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (selectList != null && selectList.length > 0) {
            let ids = this.getIds(selectList);
            remove(ids).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              this.$emit('delNode', selectList)
              this.getList()
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请选择要删除的数据！'
            });
          }

        })
      },
      //获取id串
      getIds(list) {
        let idList = [];
        list.forEach(ele => {
          idList.push(ele.id);
        });
        return idList.join(",");
      },
      handleEdit(row){
        this.showType = '修改'
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: 'warehouseForm',
            routerTitle: '仓库表单',
            showType: this.showType,
            id:row.id
          }
        });
      },
      handleAdd(){
        this.showType = '新增'
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: 'warehouseForm',
            routerTitle: '仓库表单',
            showType: this.showType
          }
        });
      },
      handleView(row){
        this.showType = '查看'
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: 'warehouseForm',
            routerTitle: '仓库表单',
            showType: this.showType,
            id:row.id
          }
        });
      },
      handleReset(){
        this.searchForm = {
          current: 1,
          size: 20,
        }
        this.getList()
      },
      getList(){
        this.tableLoading = true
        getList(this.searchForm).then(res=>{
          this.dataList = res.data.records
          this.total = res.data.total
          this.tableLoading = false
        })
        this.changeStatus()
      },
      handleQuery(){
        this.searchForm.current = 1
        this.getList()
      },
      // 设置表格高度
      setTableHeight() {
        let bodyBox = document.getElementsByClassName('page_body')
        this.tableHeight = (bodyBox[0].offsetHeight - 97) + 'px'
      },
      getDictList(code){
        //加载字典
        getDictList(code).then(res => {
          if(code==='oprtDept'){
            this.oprtDeptList = res.data;
          }
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
      handleDeleteOne(id){
        //删除按钮
        let ids =  id;
        this.handleDeleteConfirm(ids);
        this.selectionList.filter(item => item!=id);
      },
      handleDeleteConfirm(ids) {
        this.$confirm("点击确认将永久删除数据且无法恢复，请谨慎选择。","确定将选择数据删除?", {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove0(ids);
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.getList()
          });
      },
      rowSave(row, done, loading) {
        add(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          //  
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          //  
          loading();
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
    }
  };
</script>

<style lang="scss" scoped>
  .list_btn{
    padding: 9px 5px !important;
  }
  .btn_red{
    color: red;
  }
</style>
