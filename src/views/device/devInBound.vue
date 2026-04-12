<template>
  <basic-container>
    <div class="page_form">
      <el-form ref="queryForm" :model="searchForm" label-width="105px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="产权单位" prop="ownerUnitCode">
              <xt-tree-lzay-select :formValue="searchForm.ownerUnit"
                                   :selectType="'CORP'"
                                   @getTreeItem="getEntityUnit"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产权部门" prop="deptCode">
              <xt-tree-lzay-select :formValue="searchForm.dept"
                                   :unit-id="searchForm.ownerUnitCode"
                                   :selectType="'DEPT'"
                                   @getTreeItem="getEntityDept"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>
<!--          <el-col :span="6">-->
<!--            <el-form-item label="产权部门" prop="oprtDept">-->
<!--              <el-cascader-->
<!--                style="width:100%"-->
<!--                v-model="useKeepDept"-->
<!--                :options="useKeepDeptList"-->
<!--                :props="deptProps"-->
<!--                :show-all-levels="false"-->
<!--                clearable-->
<!--              ></el-cascader>-->
<!--              &lt;!&ndash; <el-select v-model="searchForm.oprtDept"  clearable placeholder="请选择所属部门">-->
<!--                <el-option-->
<!--                  v-for="dict in oprtDeptList"-->
<!--                  :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"-->
<!--                >-->
<!--                </el-option>-->
<!--              </el-select> &ndash;&gt;-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="6">
            <el-form-item label="设备来源" prop="deviceSourceCode" >
              <el-select v-model="searchForm.deviceSourceCode" @change="deviceChange" clearable placeholder="请选择设备来源">
                <el-option
                  v-for="item in deviceSourceList"
                  :value="item.dictKey"
                  :key="item.dictKey"
                  :label="item.dictValue"
                >
                </el-option>
              </el-select>
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
              <el-input v-model="searchForm.deviceCode"  placeholder="请输入设备编码" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所在仓库" prop="warehouse">
              <el-select v-model="searchForm.warehouse"  clearable placeholder="请选择仓库">
                <el-option
                  v-for="dict in warehouseList"
                  :key="dict.warehouseId"  :label="dict.warehouseName" :value="dict.uuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库日期" prop="procureDate" class="timein">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                style="width: 100%;margin-top: 4px;"
                value-format="yyyy-MM-dd"
                @change="dataPickerChange"
              ></el-date-picker>
            </el-form-item>
          </el-col>
<!--          <el-col :span="6">-->
<!--            <el-form-item label="入库状态" prop="status">-->
<!--              <el-select v-model="searchForm.status"  clearable placeholder="请选择入库状态">-->
<!--                <el-option-->
<!--                  v-for="dict in statusList"-->
<!--                  :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"-->
<!--                >-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="6">-->
<!--            <el-form-item label="WBS元素" prop="wbsElement">-->
<!--              <wbsSelect type="wbsElement" placeholder="请选择WBS元素" v-model="searchForm.wbsElement" @change="wbsChange"></wbsSelect>-->
<!--            </el-form-item>-->
<!--          </el-col>-->

<!--          <el-col :span="6">-->
<!--            <el-form-item label="入库人" prop="receiver">-->
<!--              <el-input-->
<!--                placeholder="请输入入库人"-->
<!--                clearable-->

<!--                v-model="searchForm.receiver"-->
<!--              >-->
<!--              </el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->

          <el-col :span="6">
            <el-form-item label="WBS项目" prop="wbsProject">
              <wbsSelect placeholder="请选择WBS项目" type="wbsProject" v-model="searchForm.wbsProject" @change="wbsChange"></wbsSelect>
            </el-form-item>
          </el-col>
<!--          <el-col :span="6">-->
<!--            <el-form-item label="i6000同步状态" prop="statusI6000">-->
<!--              <el-select v-model="searchForm.statusI6000"  clearable placeholder="请选择i6000同步状态">-->
<!--                <el-option-->
<!--                  v-for="dict in statusI6000List"-->
<!--                  :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"-->
<!--                >-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'设备入库管理列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary"
                        @click="handleQuery">查询</el-button>
            <el-button  style="margin-left: 5px;" type="primary" plain
                        @click="handleReset">重置</el-button>
            <el-button  type="primary" v-if="permission.devInBound_add" style="margin-left: 5px;"
                        @click="handleAdd">新增</el-button>
            <!-- <el-button  style="margin-left: 5px;" type="primary" plain
                        @click="handlePrint">打印</el-button> -->
            <el-button  type="primary" plain v-if="permission.devInBound_export" style="margin-left: 5px;"
                        @click="exportExcel">导出</el-button>
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
        <el-table-column prop="serialNumber" label="入库单号" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ownerUnitName" label="产权单位" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptName" label="产权部门" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceSource" label="设备来源" width="150" align="center" show-overflow-tooltip>
          <template  slot-scope="scope">
            <span>{{showDictLable(scope.row.deviceSource,deviceSourceList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceCategory" label="设备分类" width="130" align="center" show-overflow-tooltip>
          <template  slot-scope="scope">
            <span>{{showDictLable(scope.row.deviceCategory,deviceCategoryList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceType" label="设备类型" width="150" align="center" show-overflow-tooltip>
          <template  slot-scope="scope">
            <span>{{showDictLable(scope.row.deviceType,deviceTypeListAll)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceNum" label="入库数量" width="90" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="warehouse" label="所在仓库" width="180" align="center" show-overflow-tooltip>
          <template  slot-scope="scope">
            <span>{{showWarehouseLable(scope.row.warehouse, warehouseList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="wbsProject" label="WBS项目" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="入库状态" width="120" align="center" show-overflow-tooltip>
          <template  slot-scope="scope">
            <span>{{showDictLable(scope.row.status,statusList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="statusI6000" label="i6000同步状态" width="150" align="center" show-overflow-tooltip>
          <template  slot-scope="scope">
            <span>{{showDictLable(scope.row.statusI6000,statusI6000List)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storageTime" label="入库日期" width="120" align="center" show-overflow-tooltip>
           <template  slot-scope="scope">
            <span>{{ scope.row.storageTime.split(' ')[0] }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="receiver" label="入库人" width="120" align="center" show-overflow-tooltip></el-table-column> -->
        <!-- <el-table-column prop="wbsElement" label="WBS元素" width="200" align="center" show-overflow-tooltip></el-table-column> -->
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                      size="small"
                      icon="el-icon-view"
                      class="list_btn"
                      v-if="permission.devInBound_view"
                      @click="handleView(scope.row, scope.index)">查看
            </el-button>
            <el-button
                      type="text"
                      size="small"
                      icon="el-icon-edit"
                      class="list_btn"
                      v-if="permission.devInBound_edit && scope.row.isTemp==1"
                      @click="handleEdit(scope.row, scope.index)">编辑
            </el-button>
            <el-button
                      type="text"
                      size="small"
                      icon="el-icon-delete"
                      class="list_btn btn_red"
                      v-if="permission.devInBound_delete && scope.row.isTemp==1"
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

    <!-- 属性新增弹窗 -->
    <!-- <arrtForm
      v-if="showForm"
      :isShow="showForm"
      :arrtId="arrtId"
      :showType="showType"
      @close="showForm = false"
      @saveGlobalArrt="saveGlobalArrt"
    ></arrtForm> -->
  </basic-container>
</template>

<script>
// import arrtForm from './components/relationManageComponent/arrtForm'
import wbsSelect from "@/components/wbsSelect";
import {getDictList, getDictCmdbList} from "@/api/dict";
import { storageList, storageRemove } from "@/api/system/devInBound";
import {mapGetters,mapState} from "vuex";
// import { getDeptList } from "@/api/system/dept"
import {getWareDictList} from "@/api/device/warehouse";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";

export default {
  components: {
    // arrtForm
    wbsSelect,
    xtTreeLzaySelect
  },
  data() {
    return{
      createTimes: null,
      statusList: [],
      wbsElementList: [],
      oprtDeptList: [],
      warehouseList: [],
      wbsProjectList: [],
      statusI6000List: [],
      deviceTypeListAll:[],
      searchForm: {
        current: 1,
        size: 20
      },
      hiddenCategoryList: [

      ],
      dataList: [],
      selectionList: [],
      total: 0,
      tableLoading: false, //表格加载
      tableHeight: undefined,
      // 弹窗
      showForm: false,
      showType: '',
      arrtId: '',

      deptProps: { //部门级联框配置
        label: 'fullName',
        value: 'id',
        leaf: 'hasChildren',
        checkStrictly: true
      },
      useKeepDept: [],
      useKeepDeptList:[],
      deviceSourceList: [],
      deviceCategoryList: [],
      deviceTypeList: [],
      voltageLevelList: [],
    }
  },
  computed: {
    ...mapGetters(["permission","userDetail"]),
    ...mapState({
      userInfo: state => state.user.userInfo,
      userDetail: state => state.user.userDetail
    }),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.deviceRecord_add, false),
        viewBtn: this.vaildData(this.permission.deviceRecord_view, false),
        delBtn: this.vaildData(this.permission.deviceRecord_delete, false),
        editBtn: this.vaildData(this.permission.deviceRecord_edit, false),
        exportBtn: this.vaildData(this.permission.deviceRecord_export, false)
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
    this.setPageContentHeight()
    this.setTableHeight()
    this.searchForm.ownerUnit = this.userDetail.ownerUnitName
    this.searchForm.ownerUnitCode = this.userDetail.ownerUnit
    this.getList()


    //加载字典--工单状态
    // this.getDictList("status");
    this.getDictList("device_storage_tatus");

    // //加载字典--WBS元素
    // this.getDictList("wbsElt");
    //加载字典--入库仓库
    this.getDictList("oprtDept");
    //加载字典--WBS项目
    this.getDictList("warehouse");
    //加载字典--i6000同步状态
    this.getDictList("wbsProject");
    //加载字典--i6000同步状态
    this.getDictList("is_to_i6000");
    // 加载字典--仓库
    this.getWareList()
    // 加载字典
    this.getDictCmdbList('1102860579569664') // 设备来源
    this.getDictCmdbList('1097745625841664') // 设备分类
    this.getDictCmdbList('1097745969774592') // 设备类型
    this.getDictCmdbList('1084068218601472') // 电压等级
    // 获得部门树
    this.getDeptList()
  },
  methods: {
    deviceCategoryChange(code) {
      //设备分类选择
      this.deviceTypeList = this.deviceTypeListAll.filter(item => item.pid == code);
    },
    getEntityUnit(val) {
      //选择单位 部门
      this.searchForm.ownerUnitCode = val.id
      this.searchForm.ownerUnit = val.fullName
      this.$forceUpdate()
    },
    getEntityDept(val) {
      //选择单位 部门
      this.searchForm.deptCode = val.id
      this.searchForm.dept = val.fullName
      this.$forceUpdate()
    },
    getWareList(){
      //加载仓库列表
      getWareDictList({ownerUnitId:this.userDetail.ownerUnit||''}).then(res => {
        this.warehouseList  = res.data;
      });
    },

    getDeptList() {
      this.useKeepDeptList = this.$store.state.user.userUnitList

      this.setDeptDisable(this.useKeepDeptList, 'DEPT')
      // getDeptList().then(res => {
      //   this.useKeepDeptList = res.data
      //   this.setDeptDisable(this.useKeepDeptList, 'DEPT')
      // })
    },
    setDeptDisable(list, val) {
      list.forEach(item => {

        if(item.type == val) item.disabled = false
        else item.disabled = true

        if(item.children) this.setDeptDisable(item.children, val)
      })
    },

    dataPickerChange(createTimes) {
      //时间段选择
      if (createTimes != null && createTimes.length > 0) {
        this.searchForm.startDate = createTimes[0]+ ' 00:00:00'
        this.searchForm.endDate = createTimes[1]+ ' 23:59:59'
      } else {
        this.searchForm.startDate = null
        this.searchForm.endDate = null
      }
    },

    wbsChange(val, type){
      if(type == 'wbsElement'){
        this.searchForm.wbsProject = val.wbsName
      } else if( type == 'wbsProject' ) {
        this.searchForm.wbsElement = val.wbsCode
      }
    },

    getDictCmdbList(ciId){
      //加载字典
      getDictCmdbList({ ciId: ciId }).then(res => {
        if(ciId==='1102860579569664'){ // 设备来源
          this.deviceSourceList  = res.data;
        }else if(ciId==='1097745625841664'){ // 设备分类
          this.deviceCategoryList  = res.data;
        }else if(ciId==='1097745969774592'){ // 设备类型
          this.deviceTypeListAll = res.data;
        }else if(ciId==='1084068218601472'){ // 电压等级
          this.voltageLevelList = res.data;
        }
      });
    },

    getDictList(code){
      //加载字典
      getDictList(code).then(res => {
        if(code==='device_storage_tatus'){ // 工单状态
          this.statusList  = res.data;
        }else if(code==='wbsElt'){ // wbsElement
          this.wbsElementList = res.data;
        }else if(code==='oprtDept'){
          this.oprtDeptList = res.data;
        }else if(code==='wbsProject'){
          this.wbsProjectList = res.data;
        }else if(code==='is_to_i6000'){
          this.statusI6000List = res.data;
        }
      });
    },
    deviceChange(){

    },
    showDictLable(code,dictList){
      //字典回显
      if(dictList!=null && code!==''){
        let items = dictList.filter(item => item.dictKey==code);
        if(items!=null && items.length>0){
          return items[0].dictValue;
        }
      }
      return code;
    },
    showWarehouseLable(code,dictList){
      //字典回显
      if(dictList!=null && code!==''){
        let items = dictList.filter(item => item.uuid==code);
        if(items!=null && items.length>0){
          return items[0].warehouseName;
        }
      }
      return code;
    },
    handleQuery(){
      this.searchForm.current = 1
      // if(this.useKeepDept.length > 0) {
      //   this.searchForm.deptCode = this.useKeepDept[this.useKeepDept.length - 1]
      // }else{
      //   this.searchForm.deptCode = undefined
      // }
      this.getList()
    },
    handleReset(){
      this.useKeepDept = []
      this.createTimes = null
      this.searchForm = {
        current: 1,
        size: 20,
        ownerUnit : this.userDetail.ownerUnitName,
        ownerUnitCode : this.userDetail.ownerUnit
      }
      this.getList()
    },
    handleAdd(){
      // this.$router.push({path: '/device/devInBoundDetail'});
      this.$router.push({
        path: '/detailRoute',
        query: {
          // id: row.id,
          componentName: 'devInBoundDetail',
          routerTitle: '入库管理新增'
        }
      });
    },
    handlePrint(){

    },
    exportExcel(){

      let params = {}
      if(this.selectionList.length>0){
        params = {
          ids: this.selectionList.join(',')
        }
      }else{
        params = {}
      }
      this.download(
        "/api/idevelop-device/device/storage/export",
        params,
        "入库列表.xlsx"
        // ,"导入模板生成中..."
      );
    },
    handleView(row){
      this.$router.push({
        path: '/detailRoute',
        query: {
          id: row.id,
          isView: true,
          componentName: 'devInBoundDetail',
          routerTitle: '入库管理详情'
        }
      });
    },
    handleEdit(row){
      this.$router.push({
        path: '/detailRoute',
        query: {
          id: row.id,
          componentName: 'devInBoundDetail',
          routerTitle: '入库管理详情'
        }
      });
    },
    handleDeleteOne(id){
      this.$confirm(`确认要删除这条信息吗？<div>点击确定将永久删除数据且无法恢复，请谨慎选择。</div>`, {
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'confirmClass'
      }).then(()=>{

        storageRemove({ids: id }).then(res=>{
          if(res.code == 200){
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getList()
          }
        })

      })
    },
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection.map(item => item.id);
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 97) + 'px'
    },
    getList() {
      this.tableLoading = true
      storageList(this.searchForm).then(res => {
        this.dataList = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      })
    },

  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .confirmClass{
    padding-bottom: 15px;
    .el-message-box__status{
      position: absolute;
      top: 21%;
    }
    .el-message-box__message{
      font-size: 16px;
      font-weight: bold;
      div{
        font-size: 14px;
        margin-top: 10px;
        font-weight: normal;
      }
    }
    .el-button--primary {
      color: #FFF;
      background-color: #f56c6c;
      border-color: #f56c6c;
    }
    .el-button--primary:focus, .el-button--primary:hover {
      background: #f78989;
      border-color: #f78989;
      color: #FFF;
    }
  }
</style>
<style lang="scss" scoped>
  ::v-deep .el-date-editor .el-range__icon{
    line-height: 25px;
  }
  ::v-deep .list_btn{
    padding: 9px 5px !important;
  }
  ::v-deep .btn_red{
    color: red;
  }
  .title_line{

    position: relative;
    padding-left: 15px;
    font-size: 15px;
    font-weight: bold;
    height: 20px;
    &::before{
      content: '';
      position: absolute;
      left: 0px;
      width: 0px;
      height: 100%;
      border-left: 4px solid;
      z-index: 9;
      margin-right: 4px;
      color: #409EFF;
    }


  }
</style>
