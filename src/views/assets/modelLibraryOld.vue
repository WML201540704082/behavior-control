<template>
  <basic-container>
    <div class="yyy">
      <div class="yyy_l">
        <div class="xt-layout-sider" :class="showSider? 'xt-layout-has-sider':'xt-layout-none-sider'">
          <div
            class="layout-sider-btn"
            @click="showSider = !showSider"
          >
            <i v-if="showSider" class="el-icon-arrow-left"></i>
            <i v-else class="el-icon-arrow-right"></i>
          </div>
          <el-scrollbar style="height:100%">
            <!-- :load="loadNode" -->
            <!-- :default-expanded-keys="defaultExpandedKeys" -->
            <!-- lazy -->
            <el-tree
              ref="tree"
              :props="props"
              :data="treeData"
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
      </div>
      <div class="yyy_r">
        <div class="page_form">
          <el-form ref="queryForm" :model="searchForm" label-width="105px" class="xt_search_form">
            <el-row>
              <el-col :span="6">
                  <div>
                      <el-form-item label="上报内容">
                          <el-input v-model="searchForm.swName" size="mini" clearable></el-input>
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="6">
                  <div>
                      <el-form-item label="字段类别">
                        <el-select v-model="searchForm.is3" placeholder="" size="mini" clearable>
                            <el-option
                              v-for="item in is3List" :key="item.dictKey" :label="item.dictValue"
                              :value="item.dictKey"> </el-option>
                        </el-select>
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="6">
                  <div>
                      <el-form-item label="上报状态">
                          <el-select v-model="searchForm.company" size="mini" clearable placeholder="">
                              <el-option v-for="item in unitlList" :value="item.id" :label="item.deptName"
                                          :key="item.id"></el-option>
                          </el-select>
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="6">
                  <div>
                      <el-form-item label="使用状态">
                          <el-select v-model="searchForm.company" size="mini" clearable placeholder="">
                              <el-option v-for="item in unitlList" :value="item.id" :label="item.deptName"
                                          :key="item.id"></el-option>
                          </el-select>
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="6">
                  <div>
                      <el-form-item label="上报人">
                          <el-input v-model="searchForm.swWhere" size="mini" clearable></el-input>
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="6">
                  <div>
                      <el-form-item label="上报时间">
                          <el-date-picker
                            class="dates"
                            v-model="createTimes"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            style="width:100%"
                            @change="changeTime">
                  </el-date-picker>
                      </el-form-item>
                  </div>
              </el-col>
          </el-row>
          </el-form>
        </div>
        <div class="page_body">
          <el-row>
            <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
              <div slot="rightBtnBox">
                <el-button type="primary"
                            @click="handleQuery">查询</el-button>
                <el-button  style="margin-left: 5px;" type="primary" plain
                            @click="handleReset">重置</el-button>
                <el-button  style="margin-left: 5px;" type="primary" plain
                            @click="handleAdd">新增</el-button>
                <el-button  style="margin-left: 5px;" type="primary" plain
                            @click="handleReport">上报</el-button>
                <el-button  style="margin-left: 5px;" type="danger" plain
                            @click="handleDelete">删除</el-button>
                <!-- <el-button  type="primary"  style="margin-left: 5px;"
                            @click="handleSync">同步radius数据</el-button> -->

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
            @row-dblclick="showSwitcheInfo"
            @selection-change="selectionChange"
          >
            <el-table-column type="selection" width="30" fixed="left"></el-table-column>
            <el-table-column type="index" fixed label="序号" width="50" align="center"></el-table-column>
            <!-- <el-table-column show-overflow-tooltip prop="swMaker" label="制作商" width="150px" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="is3"  label="网络设备用途类型" width="150px" align="center">
              <template  slot-scope="scope">
                <span>{{showDictLable(scope.row.is3, is3List)}}</span>
              </template>
            </el-table-column> -->
            <el-table-column show-overflow-tooltip prop="swMaker" label="上报内容" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swMaker" label="字段类型" width="150px" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swMaker" label="上级节点" width="150px" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swMaker" label="所属库" width="150px" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swMaker" label="上报状态" width="150px" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swMaker" label="使用状态" width="150px" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swMaker" label="上报人" width="150px" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swMaker" label="上报时间" width="150px" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swMaker" label="上报单位" width="150px" align="center"></el-table-column>
            <el-table-column label="操作" width="200" align="center" fixed="right">
              <template  slot-scope="scope">
                <!-- v-if="permission.deviceRecord_view" -->
                <el-button type="text"
                          class="list_btn"
                          size="small"
                          icon="el-icon-view"
                          
                          @click="handleView(scope.row,scope.index)">查看
                </el-button>
                <!-- v-if="permission.deviceRecord_edit && (scope.row.status=='1' || scope.row.processStatus=='hussar_4')" -->
                <el-button type="text"
                          class="list_btn"
                          size="small"
                          icon="el-icon-edit"
                          
                          @click="handleEdit(scope.row,scope.index)">编辑
                </el-button>
                <!-- v-if=" permission.deviceRecord_delete && scope.row.status == 1 && !scope.row.processStatus " -->
                <el-button type="text"
                          class="list_btn btn_red"
                          size="small"
                          icon="el-icon-delete"
                          
                          @click="handleDelete(scope.row.id)">删除
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
      </div>
    </div>

    

    <!-- 属性新增弹窗 -->
    <switchInfo
      v-if="showForm"
      :isShow="showForm"
      :arrtId="arrtId"
      :showType="showType"
      @close="showForm = false"
    ></switchInfo>
  </basic-container>
</template>

<script>
import switchInfo from './components/switch/switchInfo'
import { queryDept } from "@/api/operation/safeaccess/subnet";
import { getDictList, getDictCmdbList } from "@/api/dict";
import { switcheList, getRadiusState } from "@/api/operation/safeaccess/switch";
import {mapGetters,mapState} from "vuex";

export default {
  components: {
    switchInfo,
  },
  data() {
    return{
      showSider: true, //是否显示侧边栏
      treeData: [],
      props: { //树组件配置项
        label: 'name',
        isLeaf: 'leaf'
      },


      createTimes: [],

      unitlList: [],
      is3List: [],
      swStateList: [],
      Is802List: [],
      isAccessSwitchList: [],

      searchForm: {
        current: 1,
        size: 20
      },

      dataList: [],
      selectionList: [],
      total: 0,
      tableLoading: false, //表格加载
      tableHeight: undefined,
      // 弹窗
      showForm: false,
      showType: '',
      arrtId: ''
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  mounted() {
    this.setPageContentHeight()
    this.setTableHeight()
    this.getList()


    //加载字典--工单状态
    //加载字典--snmp版本号
    this.getDictList("snmpVersion");
    //加载字典--入库仓库
    this.getDictList("swState");
    //加载字典--WBS项目
    this.getDictList("Is802");
    //加载字典--i6000同步状态
    this.getDictList("isAccessSwitch");
    //加载字典--i6000同步状态
    this.getDictList("is_to_i6000");
    queryDept().then(res=>{
        this.unitlList = res.data
    })
    this.getCmdbDictList('1131177441558528')

  },
  methods: {
    nodeClick(data, node) {

    },
    handleAdd(){
      this.arrtId = undefined
      this.showType = 'add'
      this.showForm = true
    },
    handleReport(){

    },
    handleView(){

    },
    handleEdit(){

    },
    handleDelete(){

    },
    changeTime(val) {
      if (val == null) {
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
      } else {
        this.searchForm.startTime = val[0]
        this.searchForm.endTime = val[1]
      }
    },



    getCmdbDictList(code){
      //加载cmdb字典
      let query = {}
      query.ciId = code||'1082372687986688'
      getDictCmdbList( query ).then(res => {
        if(code==='1103423111233536'){ // 设备状态
          this.deviceStatusList  = res.data;
        }else if(code==='1097745625841664'){
          this.deviceCategoryList  = res.data;
        }else if(code==='1097745969774592'){
          this.deviceTypeList  = res.data;
          this.deviceTypeListAll  = res.data;
        }else if(code==='1107954469502976'){ // 运维等级
          this.operationGradeList = res.data;
        }else if(code==='1107951709650944'){ // 操作系统类型
          this.osTypeList = res.data;
        }else if(code==='1107950904344576'){ // 操作系统版本号
          this.osVersionList = res.data;
        }else if(code==='1084068218601472'){ // 电压等级
          this.voltageLevelList = res.data;
        }else if(code==='1083979207081984'){ // 国家与区域
          this.maintenanceCountryList = res.data;
        }else if(code==='1083969669234688'){ // 服务级别
          this.serviceLevelList = res.data;
        }else if(code==='1082603970297856'){ // CPU品牌
          this.cpuBrandList = res.data;
        }else if(code==='1107942968721408'){ // 所属网络
          this.networkTypeList = res.data;
        }else if(code==='1131177441558528'){ // 网络设备用途类型
          this.is3List = res.data;
        }else if(code==='1131278314569728'){ // 所属安全边界
          this.securityBoundaryList = res.data;
        }
      });
    },
    getDictList(code){
      //加载字典
      getDictList(code).then(res => {
        /*res.data.unshift({
          code:"",
          dictKey:'',
          dictValue:"--请选择--"})*/
        if(code==='is3'){ // 工单状态
          this.is3List  = res.data;
        }else if(code==='swState'){
          this.swStateList = res.data;
        }else if(code==='Is802'){
          this.Is802List = res.data;
        }else if(code==='isAccessSwitch'){
          this.isAccessSwitchList = res.data;
        }else if(code === 'snmpVersion') {
          this.snmpVersionList = res.data;
        }
      });
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
    handleQuery(){
      this.getList()
    },
    handleReset(){
      this.searchForm = {
        current: 1,
        size: 20
      }
      this.getList()
    },
    handleSync(){
      if(this.selectionList.length != 1){
        return this.$message.warning('请选择一条数据！')
      }


      let params = {
          id: this.selectionList[0].id
      }
      getRadiusState(params).then(resp => {
        if(resp.data){
          this.$message({
            message:"Radius同步成功",
            type:"success"
          });
        }else{
          this.$message({
            message:"Radius同步失败",
            type:"error"
          });
        }
      })
    },



    showSwitcheInfo(row){
      this.arrtId = row.id
      this.showForm = true
    },

    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 110) + 'px'
    },
    getList() {
      this.tableLoading = true
      switcheList(this.searchForm).then(res => {
        // console.log(11, res)
        this.dataList = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      })
    },

  }
}
</script>
<style lang="scss" scoped>
  .yyy{
    display: flex;
    .yyy_l{
      // width: 200px;
      // height: 100px;
      // background: red;
      


      position: relative;
      padding-top: 15px;

      background-color: #cfe6f9;
      border-radius: 5px;


      .xt-layout-has-sider{
        width: 200px;
        min-width: 200px;
        max-width: 200px;
        -webkit-box-flex: 0;
        -ms-flex: 0 0 200px;
        flex: 0 0 200px;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
      }
      .xt-layout-none-sider{
        width: 0px;
        min-width: 0px;
        max-width: 0px;
        -webkit-box-flex: 0;
        -ms-flex: 0 0 0px;
        flex: 0 0 0px;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
      }
      .xt-layout-sider{
        height: 100%;
        position: relative;
      }
      .layout-sider-btn{
        position: absolute;
        width: 12px;
        height: 87px;
        top: 50%;
        right: -12px;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        background-color: #909399;
        color: #fff;
        cursor: pointer;
        border-radius: 0 5px 5px 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
      }
      .el-scrollbar {
          overflow: hidden;
          position: relative;
      }

      .el-tree {
          background: transparent;
          color: #46506d;
      }
    }
    .yyy_r{
      padding-left: 20px;
      width: 10px;
      flex: 1;
    }
  }

  ::v-deep .dates {
    .el-range__icon{
      line-height: 25px;
    }
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
