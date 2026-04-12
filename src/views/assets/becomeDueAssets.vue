<template>
  <basic-container>
    <div class="page_form">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="WBS项目" prop="wbsElementName"  clearable>
              <wbsSelect placeholder="请选择WBS项目" type="wbsProject" clearable v-model="searchForm.wbsElementName" @change="wbsChange"></wbsSelect>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WBS元素" prop="wbsElement"  clearable >
              <wbsSelect placeholder="WBS元素" type="wbsElement" clearable v-model="searchForm.wbsElement" @change="wbsChange"></wbsSelect>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称" prop="deviceName" >
              <el-input v-model="searchForm.deviceName"  placeholder="请输入设备名称" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编号" prop="deviceCode" >
              <el-input v-model="searchForm.deviceCode"  placeholder="请输入设备编号" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="设备分类" prop="deviceCategory"  >
              <el-select v-model="searchForm.deviceCategory"  placeholder="请选择设备分类" clearable @change="deviceCategoryChange" >
                <el-option  v-for="dict in deviceCategoryList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备类型" prop="deviceType" >
              <el-select v-model="searchForm.deviceType"  placeholder="请输入设备类型" clearable >
                <el-option  v-for="dict in deviceTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备状态" prop="deviceStatus" >
              <el-select v-model="searchForm.deviceStatus"  clearable placeholder="请选择设备状态">
                <el-option v-for="dict in deviceStatusList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库时间" prop="createTime">
              <el-date-picker
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
        <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
            <el-button class="border-btn" size="small" @click="handleExport">导出</el-button>
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
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="wbsElementName" label="WBS项目" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="wbsElement" label="WBS元素" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceCode" label="设备编号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceName" label="设备名称" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceType" label="设备类型" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="inWarehouseDate" label="入库时间" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="transferDate" label="剩余转资操作天数" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceStatus" label="设备状态" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template  slot-scope="scope">
            <el-button type="text"  size="small" @click="handleView(scope.row)">转资</el-button>
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
  import {getDictList,getDictCmdbList} from "@/api/dict";
  import {getBecomdueCmdbList} from "@/api/device/becomedue";
  import {mapGetters,mapState} from "vuex";
  import wbsSelect from "@/components/wbsSelect/index.vue";
  import {getUserDetail} from "@/api/user";
export default {
  components: {wbsSelect},
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
      tableHeight: 600,
      total: 0,
      // 字典
      deviceCategoryList: [],
      deviceTypeList: [],
      deviceTypeListAll: [],
      useKeepDeptList:[],
      deviceStatusList:[],
      deviceErpStatusList:[],
      deviceWBSList:[],
      afterSaleStatusList:[],
      optYearList:[],
      username: "",
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    permissionList() {
      return { };
    },
  },
  mounted(){
    // 设置页面元素高度
    // this.setPageContentHeight()
    // 设置表格高度
    this.setTableHeight()
    //加载字典--WBS元素
    //this.getDictList("wbsElt");
    // this.getCmdbDictList("1082607703228416");
    //加载字典--设备类型
    //this.getDictList("deviceType");
    this.getCmdbDictList("1097745969774592");
    //加载字典--设备分类
    //this.getDictList("deviceCategory");
    this.getCmdbDictList("1097745625841664");
    //加载字典--设备状态
    this.getDictList("deviceStatus");
    //加载数据
    //this.onLoad();
    //加载默认数据
    this.beforeOpen()
  },
  methods: {
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 100 - 47 + 'px'
    },
    getCmdbDictList(code){
      //加载cmdb字典
      let query = {}
      query.ciId = code||'1082372687986688'
      getDictCmdbList( query ).then(res => {
        if(code==='1082607703228416'){
          this.deviceWBSList = res.data;
        }else if(code==='1097745625841664'){
          this.deviceCategoryList  = res.data;
        }else if(code==='1097745969774592'){
          this.deviceTypeList  = res.data;
          this.deviceTypeListAll  = res.data;
        }
      });
    },
    getDictList(code){
      //加载字典
      getDictList(code).then(res => {
        if(code==='deviceStatus'){
          this.deviceStatusList  = res.data;
        }else if(code==='wbsElt'){
          this.deviceWBSList = res.data;
        }else if(code==='erpState'){
          this.deviceErpStatusList = res.data;
        }else if(code==='deviceCategory'){
          this.deviceCategoryList = res.data;
        }else if(code==='deviceType'){
          this.deviceTypeList = res.data;
          this.deviceTypeListAll = res.data;
        }
      });
    },
    handleQuery(){
      this.searchForm.current = 1
      this.onLoad();
    },
    showDictLable(code,dictList){
      //字典回显
      if(dictList!=null && code!=''){
        let items = dictList.filter(item => item.dictKey==code);
        if(items!=null && items.length>0){
          return items[0].dictValue;
        }
      }
      return code;
    },
    deviceCategoryChange(code){
      //设备分类选择
      this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));
    },
    wbsChange(val, type){
      if(type == 'wbsElement'){
        this.searchForm.wbsProject = val.wbsName
      } else if( type == 'wbsProject' ) {
        this.searchForm.wbsElement = val.wbsCode
      }
    },
    searchReset() {
      //重置按钮
      this.$refs.searchForm.resetFields();
      this.onLoad();
    },
    dataPickerChange(createTimes){
      //时间段选择
      if(createTimes != null && createTimes.length > 0) {
        this.searchForm.minDate = createTimes[0]
        this.searchForm.maxDate = createTimes[1]
      }else{
        this.searchForm.minDate = null
        this.searchForm.maxDate = null
      }
    },
    onLoad() {
      //加载数据
      this.loading = true;
      this.searchForm.ciId = '1082372687986688'
      if(this.createTimes != null && this.createTimes.length > 0) {
        this.searchForm.minDate = this.createTimes[0]
        this.searchForm.maxDate = this.createTimes[1]
      }
      //加载cmdb的IT设备
      getBecomdueCmdbList(this.searchForm).then(res => {
        const data = res.data;
        this.dataList = data.data||[];
        this.total = data.total||0;
        this.loading = false;
      });
      //加载mysql
      //getList(this.searchForm).then(res => {
      //   const data = res.data;
      //   this.total = data.total;
      //   this.dataList = data.records;
      //   this.loading = false;
      // });
    },
    handleExport() {
      //导出
      if(this.total>99999){
        //判断当前导出条件下的所以行数，过多时提示
        this.$message.warning("导出数据过多，请通过条件筛选后再进行数据导出！");
      }else{
        this.$confirm("是否导出数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.download(
            "/api/idevelop-device/device/overdue/becomeDue/export",
            this.searchForm,
            "转资到期设备列表.xlsx"
          )
        });
      }
    },
    handleView(row) {
      //转资
      this.$router.push({
        path: '/detailRoute',
        query: {
          deviceId: row.id,
          wbsProject: row.wbsElementName,
          wbsElement: row.wbsElement,
          deviceCode: row.deviceCode,
          componentName: 'capitalTransferAdd',
          routerTitle: '设备转资编辑'
        }
      });
    },
    beforeOpen() {
      this.tableLoading = true
      //加载默认数据
      getUserDetail().then(res => {
        let usr = res.data;
        this.searchForm.area= usr.regionCode||''
        // 获取WBS数据
        this.onLoad()
      }).catch(() => {
        this.tableLoading = false
        // 获取WBS数据
        this.onLoad()
      });
    },
  }

}
</script>
