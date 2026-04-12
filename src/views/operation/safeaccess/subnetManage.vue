<template>
  <div>
    <div class="page_form">
      <el-form ref="queryForm" :model="searchForm" label-width="105px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
              <div>
                  <el-form-item label="子网名称">
                      <el-input v-model="searchForm.subnetName" size="mini" clearable></el-input>
                  </el-form-item>
              </div>
          </el-col>
          <el-col :span="6">
              <div>
                  <el-form-item label="状态">
                      <el-select v-model="searchForm.code" size="mini" clearable placeholder="">
                          <el-option v-for="item in codeList" :value="item.dictValue" :label="item.dictKey"
                                      :key="item.dictValue"></el-option>
                      </el-select>
                  </el-form-item>
              </div>
          </el-col>

          <el-col :span="6">
              <div>
                  <el-form-item label="vlanId">
                      <el-input v-model="searchForm.vlanId" size="mini" clearable></el-input>
                  </el-form-item>
              </div>
          </el-col>

          <el-col :span="6">
              <div>
                  <el-form-item label="子网地址">
                      <el-input v-model="searchForm.subnetAddress" size="mini" clearable></el-input>
                  </el-form-item>
              </div>
          </el-col>


          <el-col :span="6" v-if="false">
              <div>
                  <el-form-item label="安全分区名称">
                      <el-input v-model="searchForm.spName" size="mini" clearable></el-input>
                  </el-form-item>
              </div>
          </el-col>


          <el-col :span="6">
              <div>
                  <el-form-item label="是否共用">
                    <el-select v-model="searchForm.isPublic" placeholder="" size="mini" clearable>
                         <el-option
                          v-for="item in isPublicList" :key="item.dictValue" :label="item.dictKey"
                          :value="item.dictValue"> </el-option>
                    </el-select>
                  </el-form-item>
              </div>
          </el-col>


      </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
          <div slot="rightBtnBox" style="width: 100%;">
            <el-scrollbar style="height: 40px;min-width: 600px;white-space: nowrap;">
              <el-button type="primary"
                          @click="handleQuery">查询</el-button>
              <el-button  type="primary" plain
                          @click="handleReset">重置</el-button>
              <!-- <el-button  type="primary"  style="margin-left: 5px;"
                          @click="handleSync">同步radius数据</el-button> -->
              <el-button type="primary"
                          @click="handleAdd">新增</el-button>
              <el-button type="primary"
                          @click="handleUpdate">修改</el-button>
              <el-button type="danger"
                          @click="handleDel">删除</el-button>
              <el-button type="primary" plain
                          @click="handleCommonSubNet">设为公共子网</el-button>
              <el-button type="primary" plain
                          @click="handleIpPool">IP地址池管理</el-button>
<!--              <el-button type="primary" plain-->
<!--                          @click="handleUpdateNetWork">网段变更</el-button>-->
              <el-button type="primary" plain
                          @click="handleSyncRadius">单条同步Radius子网数据</el-button>
            </el-scrollbar>
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
        <el-table-column show-overflow-tooltip
                          prop="subnetName" label="子网名称" width="200px" sortable align="center"></el-table-column>
        <el-table-column show-overflow-tooltip
                          prop="institutionName" label="所属单位" width="200px" sortable align="center"></el-table-column>
        <el-table-column show-overflow-tooltip
                          prop="isPublic" label="是否共用" width="100px" sortable align="center">
          <template slot-scope="scope">{{scope.row.isPublic === '0' ? '否':'是'}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
                          prop="subnetAddress" label="子网地址" width="150px" sortable align="center"></el-table-column>
        <el-table-column show-overflow-tooltip
                          prop="subnetGateway" label="子网网关" width="150px" sortable align="center">

            <template  slot-scope="scope">
               <span style="color:#409EFF">{{scope.row.subnetGateway}}</span>
            </template>

         </el-table-column>
        <el-table-column show-overflow-tooltip
                          prop="subnetMask" label="子网掩码" width="150px" sortable align="center"></el-table-column>
        <el-table-column show-overflow-tooltip
                          prop="broadcastAddress" label="广播地址" width="150px" sortable align="center"></el-table-column>
        <el-table-column show-overflow-tooltip
                          prop="dnsip" label="首选DNS服务器" width="150px" sortable align="center"></el-table-column>
        <el-table-column show-overflow-tooltip
                          prop="dnsip2" label="备选DNS服务器" width="150px" sortable align="center"></el-table-column>
        <!-- <el-table-column show-overflow-tooltip
                          prop="code" label="状态" :formatter="formattercode" sortable align="center"></el-table-column> -->
        <!-- <el-table-column show-overflow-tooltip
                          prop="switchName" label="所属交换机" width="200px" sortable align="center"></el-table-column> -->
        <el-table-column show-overflow-tooltip
                          prop="vlanId" label="vlanId" sortable width="150px" align="center"></el-table-column>
        <!-- <el-table-column show-overflow-tooltip
                          prop="spName" label="所属安全分区" width="200px" sortable align="center"></el-table-column> -->
        <!-- <el-table-column show-overflow-tooltip
                          prop="fillDate" label="填报时间" sortable width="150px" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip
                          prop="fillMan" label="录入人" sortable width="150px" align="center"></el-table-column> -->
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="getList"/>
    </div>

    <!-- 网段变更 -->
    <networkChange
      v-if="showForm"
      :isShow="showForm"
      :arrtId="arrtId"
      @close="showForm = false"
    ></networkChange>

    <!-- 属性新增弹窗 -->
    <ipPoolList
      v-if="showIpPoolList"
      :isShow="showIpPoolList"
      :arrtId="arrtId"
      :institutionName="this.institutionName"
      @close="showIpPoolList = false"
    ></ipPoolList>

    <!-- 删除失败消息提示 -->
    <div v-if="openMsg">
      <el-dialog title="子网被占用IP信息" :visible.sync="openMsg" @close="closeMsg"
                 :close-on-click-modal="false" :modal-append-to-body="false" width="50%">
        <span>以下子网仍有<b>IP被分配</b>使用，<b>无法删除</b>，具体信息如下：</span>
        <div v-for="netInfo in usedSubnetList" :key="netInfo.subnetName">
          <div>
            <span>{{netInfo.subnetName}}被占用的IP:</span>
            <ul style="min-height: 90%">
              <li v-for="item in netInfo.ipList" :key="item">{{item}}</li>
            </ul>
          </div>
        </div>
        <div style="display: flex;justify-content: right;">
          <el-button type="primary" @click="closeMsg" size="mini">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import networkChange from './components/subnet/networkChange'
import ipPoolList from './components/subnet/ipPoolList'

import {getDictList, getDictCmdbList} from "@/api/dict";
import {
  subnetList,
  subnetDetail,
  subnetSave,
  subnetRemove,
  getSubnetInfo,
  hasTerminal,
  initIpPool,
  syncSubnet,
  updateSubnet,
  selectSwitches,
  setCommonSubNet } from "@/api/operation/safeaccess/subnet";
import {mapGetters,mapState} from "vuex";

export default {
  components: {
    networkChange,
    ipPoolList,
  },
  data() {
    return{
      //删除时子网被占用的报错信息
      openMsg: false,
      //被占用的ip
      usedSubnetList: [],

      codeList: [{
        dictValue: '0',
        dictKey: '正常'
      }, {
        dictValue: '1',
        dictKey: '停用'
      }],
      isPublicList: [{
        dictValue: '0',
        dictKey: '否'
      }, {
        dictValue: '1',
        dictKey: '是'
      }],


      orgCodeList: [],
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
      arrtId: '',
      institutionName: '',
      showIpPoolList: false,

      deviceSourceList: [],
      deviceCategoryList: [],
      deviceTypeList: [],
      voltageLevelList: [],
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

    // //加载字典--WBS元素
    this.getDictList("is3");
    //加载字典--入库仓库
    this.getDictList("swState");
    //加载字典--WBS项目
    this.getDictList("Is802");
    //加载字典--i6000同步状态
    this.getDictList("isAccessSwitch");
    //加载字典--i6000同步状态
    this.getDictList("is_to_i6000");
    // 加载字典
    this.getDictCmdbList('1102860579569664') // 设备来源
    this.getDictCmdbList('1097745625841664') // 设备分类
    this.getDictCmdbList('1097745969774592') // 设备类型
    this.getDictCmdbList('1084068218601472') // 电压等级
  },
  methods: {
    getDictCmdbList(ciId){
      //加载字典
      getDictCmdbList({ ciId: ciId }).then(res => {
        if(ciId==='1102860579569664'){ // 设备来源
          this.deviceSourceList  = res.data;
        }else if(ciId==='1097745625841664'){ // 设备分类
          this.deviceCategoryList  = res.data;
        }else if(ciId==='1097745969774592'){ // 设备类型
          this.deviceTypeList = res.data;
        }else if(ciId==='1084068218601472'){ // 电压等级
          this.voltageLevelList = res.data;
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
        if(code==='swState'){
          this.swStateList = res.data;
        }else if(code==='Is802'){
          this.Is802List = res.data;
        }else if(code==='isAccessSwitch'){
          this.isAccessSwitchList = res.data;
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
    handleAdd(){
      this.$router.push({
        path: '/detailRoute',
        query: {
          // id: row.id,
          componentName: 'subnetInfo',
          routerTitle: '新增',
          showType: 'add'
        }
      });
    },
    handleUpdate(){
      if (this.selectionList.length !== 1) {
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        })
        return
      }

      this.$router.push({
        path: '/detailRoute',
        query: {
          arrtId: this.selectionList[0].id,
          componentName: 'subnetInfo',
          routerTitle: '修改',
          showType: 'edit'
        }
      });
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
      this.$emit('resetClick');
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

    handleCommonSubNet(){
      if (this.selectionList.length !== 1) {
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        })
        return
      }

      // let params = {
      //   id: this.selectionList[0].id,
      //   bak1: '1'
      // }
      this.$confirm('是否确认设为公共子网?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=> {
        let params = JSON.parse(JSON.stringify(this.selectionList[0]))
        params.isPublic = "1"
        setCommonSubNet(params).then(response => {
          if (response.code === 200) {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.getList()
          }
        })
      }).catch(function() {

      })
    },
    handleIpPool(){
      if (this.selectionList.length == 0) {
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        })
        return
      }
      this.arrtId = this.selectionList[0].id
      this.institutionName = this.selectionList[0].institutionName
      this.showIpPoolList = true
    },
    handleUpdateNetWork(){
      this.arrtId = this.selectionList[0].id
      this.showForm = true
    },
    handleSyncRadius(){
      if (this.selectionList.length == 0) {
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        })
        return
      }
      let params = {
        subnetId: this.selectionList[0].id
      }
      syncSubnet(params).then(resp => {
        if (resp.data) {
          this.$message({
            message: 'radius子网数据同步成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: 'radius子网数据同步失败！',
            type: 'error'
          })
        }
      })
    },
    //清理用户入网相关数据
    handleDel() {
      let _this = this
      if (_this.selectionList.length == 0) {
        _this.$message({
          message: '请选择要删除的数据',
          type: 'warning'
        })
        return
      }
      _this.$confirm('确认删除选择的子网数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.delete()
      }).catch(() => {
        _this.$message(
          {
            type: 'warning',
            message: '已取消删除'
          }
        )
      })
    },
    delete() {
      this.usedSubnetList = []
      let ids = this.selectionList.map(el=> el.id)
      subnetRemove( this.selectionList ).then(resp => {
        let data = resp.data.list
        if (data != null && data.length > 0) {
          this.usedSubnetList = data
          this.openMsg = true
        }else {
          if (resp.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
        }
        this.getList()
      }).catch(() => {
        this.$message.error('删除子网出现异常')
      })
    },
    //关闭批量归档异常提示
    closeMsg() {
      this.usedSubnetList = []
      this.openMsg = false
    },


    showSwitcheInfo(row){
      // this.arrtId = row.id
      // this.showType = 'edit'
      // this.showForm = true
      this.$router.push({
        path: '/detailRoute',
        query: {
          arrtId: row.id,
          componentName: 'subnetInfo',
          routerTitle: '查看',
          showType: 'check'
        }
      });
    },
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 240) + 'px'
    },
    getList() {
      this.tableLoading = true
      subnetList(this.searchForm).then(res => {
        this.dataList = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      })
    },

  }
}
</script>
<style lang="scss" scoped>
// width: 500px;
//     height: 52px;
//     overflow: hidden;
//     overflow-x: auto;
//     white-space: nowrap;
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
