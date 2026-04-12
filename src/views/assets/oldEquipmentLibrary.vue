<template>
  <basic-container>
    <div class="page_form">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
        <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="设备分类" prop="deviceCategory">
                <el-select v-model="searchForm.deviceCategory"  placeholder="请选择设备分类" clearable @change="deviceCategoryCodeChange" disabled>
                  <el-option  v-for="dict in deviceCategoryList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

          <el-col :span="6">
            <el-form-item label="设备类型" prop="deviceType">
              <el-select v-model="searchForm.deviceType" clearable placeholder="请选择所属类型" >
                <el-option
                  v-for="item in deviceTypeList"
                  :value="item.dictKey"
                  :key="item.dictKey"
                  :label="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="设备编码" prop="deviceCode">
              <el-input v-model="searchForm.deviceCode"  placeholder="请输入设备编码" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>


           <el-col :span="6">
            <el-form-item label="评价得分" prop="score">
                <div class="pj_content">
                    <el-input v-model="searchForm.startScore"  placeholder="请输入最低得分" clearable ></el-input>
              - <el-input v-model="searchForm.endScore"  placeholder="请输入最高得分" clearable ></el-input>
                </div>
             
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">

            <el-col :span="6">
        <el-form-item label="只看TOP" prop="top">
              <el-input v-model="searchForm.top"  placeholder="请输入数字(只看评分最高X数据)" clearable style="width:100%"></el-input>

            </el-form-item>
          </el-col>

    <el-col :span="6">
            <el-form-item
                  label="机房类型"
                  prop="roomType"
                >
                  <el-select v-model="searchForm.roomType" placeholder="请选择机房类型" clearable>
                    <el-option
                      v-for="dict in roomTypeList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
                </el-form-item>
          </el-col>
          
              <el-col :span="6">
            <el-form-item
                  label="机房功能"
                  prop="roomFunction"
                >
                  <el-select v-model="searchForm.roomFunction" placeholder="请选择机房功能" clearable>
                    <el-option
                      v-for="dict in roomFunctionList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
                </el-form-item>
          </el-col>

           

          <el-col :span="6">
            <el-form-item label="设备状态" prop="deviceStatus">
              <el-select v-model="searchForm.deviceStatus" clearable placeholder="请选择设备状态">
                <el-option v-for="dict in deviceStatusList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
            <el-col :span="6">
            <el-form-item label="维保情况" prop="operationCondition">
              <el-select v-model="searchForm.operationCondition" clearable placeholder="请选择运维情况">
                <el-option v-for="dict in ywqkList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col> 

           <el-col :span="6">
            <el-form-item label="自评是否更换" prop="isChange">
              <el-select v-model="searchForm.isChange" clearable placeholder="请选择自评是否更换">
                <el-option v-for="dict in isOrNotList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col> 


         <el-col :span="6">
            <el-form-item label="产权部门" prop="propertyDept">
              <xt-tree-lzay-select :formValue="searchForm.propertyDept"
                                   :unit-id="userDetail.ownerUnit"
                                   :selectType="'DEPT'"
                                   @getTreeItem="getEntityDept"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>

           <el-col :span="6">
            <el-form-item label="运维部门" prop="operationDept">
              <xt-tree-lzay-select :formValue="searchForm.operationDept"
                                   :unit-id="userDetail.ownerUnit"
                                   :selectType="'DEPT'"
                                   @getTreeItem="getYunWDept"
              ></xt-tree-lzay-select>
            </el-form-item>
          </el-col>


            <!-- <el-col :span="6"> -->
          

        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
            <el-button class="border-btn" size="small" @click="selectDevice" >添加设备</el-button>
            <el-button class="border-btn" size="small" @click="selectEdit"  :disabled='judgeCanEdit'>修改自评</el-button>
            <el-button class="border-btn" size="small" @click="reportAudit" :disabled='judgeCanEdit'>上报评审库</el-button>
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
        @selection-change="select"
        @cell-dblclick='cellClick'
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column type="selection" width="30" fixed="left" align="center"></el-table-column>
        <el-table-column prop="deviceCode" label="设备编码" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceTypeName" label="设备类型" width="120" align="center"
                         show-overflow-tooltip>            
        </el-table-column>
       <el-table-column prop="score" label="评价得分" align="center" width="100"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="roomType" label="机房类型"  width="160" align="center"
                         show-overflow-tooltip>
                           <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.roomType, roomTypeList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="roomFunction" label="机房功能" width="90" align="center"
                         show-overflow-tooltip>
              <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.roomFunction, roomFunctionList) }}</span>
          </template>            
        </el-table-column>
        <el-table-column prop="deviceStatus" label="设备状态" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.deviceStatus, deviceStatusList) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isChange" label="自评是否更换" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="changeC">
                  <span>{{ showDictLable(scope.row.isChange, isOrNotList) }}</span>
                  <!-- <i class="el-icon-edit"  style="color: #409eff" @click.stop="editClick(scope.row)"></i> -->
                </div>
          </template>
        </el-table-column>
        <el-table-column prop="faultCount" label="近三年故障次数" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="hiddenCount" label="近三年隐患次数" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="overAge" label="超龄时间" width="120" align="center" show-overflow-tooltip>        </el-table-column>
       <el-table-column prop="operationCondition" label="维保情况" width="120" align="center" show-overflow-tooltip>
            <template slot="header" slot-scope="scope">
                <span style="margin-right:3px">维保情况</span>
                <el-tooltip placement="top">
                <div slot="content">
                    有无维保
                </div>
                <i class="el-icon-info" style="color: #409eff"> </i>
              </el-tooltip>
            </template>

              <template slot-scope="scope">
                <div class="changeC">
                  <span>{{ showDictLable(scope.row.operationCondition, ywqkList) }}</span>
                  <!-- <i class="el-icon-edit"  style="color: #409eff" @click.stop="editClick(scope.row)"></i> -->
                </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="审批状态" width="90" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
                  <span :style="scope.row.status == '0' || scope.row.status == '1' ? 'color:black' :
                   scope.row.status == '2' ? 'color:green':'color:red' ">{{scope.row.status == '0' ? '未上报':(scope.row.status == '1'?'待审批':(scope.row.status == '2'?'审批通过':'审批驳回'))}}</span>
          </template>
        </el-table-column>    


           <el-table-column prop="status" label="是否上报评审库" width="180" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
                  <span>{{scope.row.reviewLibraryMark == '0' ? '未上报': '已上报'}}</span>
          </template>
        </el-table-column> 


        <el-table-column prop="propertyDept" label="产权部门" width="180" align="center" show-overflow-tooltip>
        </el-table-column>
         <el-table-column prop="operationDept" label="运维部门" width="180" align="center" show-overflow-tooltip>
        </el-table-column>
       
      </el-table>
      <!-- 分页 -->
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="getData"
      />
    </div>

    <edit-dialog  v-if="showDialog" @close="showDialog = false" :isShow="showDialog" :opearteResult='editType'></edit-dialog>
  </basic-container>
</template>

<script>
import {Loading} from "element-ui";
import {getDictList, getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import {mapGetters, mapState} from "vuex";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import editDialog from './components/oldEquipment/editDialog.vue';
import {getList} from "@/api/device/oldEquipmentLibrary.js";
export default {
  components: {xtTreeLzaySelect,editDialog},
  data() {
    return {
      // 搜索相关
      searchForm: {
        current: 1,
        size: 20,
      },
      dataList: [],
      loading: false,
      tableHeight: undefined,
      total: 0,
      // 字典
      deviceTypeList: [],
      deviceStatusList: [],
      roomTypeList: [],
      roomFunctionList:[],
      ywqkList:[],
      deviceCategoryList:[],
      isOrNotList:[],
      showDialog:false,
      editType:0,
      deviceSelectSync:false,
      selectList:[],
    };
  },
  computed: {
    ...mapGetters(["permission","userDetail"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    }),

    judgeCanEdit(){
      let disabled = false;
      let filterArr =  this.selectList.filter(item=> 
            item.status == '1' || item.status == '2'
      );
      if(filterArr.length > 0){
        disabled = true;
      }
      return disabled;
    },
  },
 async mounted() {
    //  console.log(this.userDetail,'打印一下用户信息==========');
    // // 设置页面元素高度
    this.setPageContentHeight()
    // 设置表格高度
    this.setTableHeight()
    //机房类型
    this.getDictList("room_type");
    //机房功能
    this.getDictList("room_function");
    //运维情况
    this.getDictList("haveNo");
    //加载字典--设备分类
    await  this.getCmdbDictList("1097745625841664");
    this.searchForm.deviceCategory = this.deviceCategoryList.filter(item=> item.dictValue ==='基础设施')[0].dictKey;
    this.searchForm.deviceCategoryName =  this.deviceCategoryList.filter(item=> item.dictValue ==='基础设施')[0].dictValue;
    // console.log(this.deviceCategoryList,'---------------');
    let dictKey = this.deviceCategoryList.filter(item=> item.dictValue =='基础设施')[0].dictKey;
    this.getDictCmdbListPid('1097745969774592',dictKey);
    //加载字典--设备状态
     this.getCmdbDictList("1103423111233536");
    //自评是否更换
     this.getDictList("needNo");
     this.getData();
  },
  methods: {
    // judgeCanEdit(){
    //   let disabled = false;
    //   let filterArr =  this.selectList.filter(item=> {
    //         item.status == '1' || item.status == '2' || item.status == '3'
    //   });
    //   if(filterArr.length > 0){
    //     disabled = true;
    //   }
    //   return disabled;
    // },
    getData(){
      //加载数据
      this.loading = true;
      getList(this.searchForm).then(res => {
        // console.log(res,'List=================');
        const data = res.data;
        this.total = data.total;
        this.dataList = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
     selectionClear() {
      //清除选择
      this.selectionList = [];
      this.$refs.dataTable.clearSelection();
    },
    select(val) {
      this.selectList = val;
    },
    reportAudit(){
      if (this.selectList.length == 0) {
        this.$message.warning("请选择一条数据!")
        return
      }
       this.$router.push({
        path: '/detailRoute',
        query: {
          data:this.selectList,
          componentName: 'oldEquipmentUpload',
          routerTitle: '老旧设备上传资料'
        }
      });
    },
    cellClick(row){
       this.$router.push({
        path: '/detailRoute',
        query: {
          from:'library',
          id:row.id,
          operationDeptCode:row.operationDeptCode,
          propertyDeptCode:row.propertyDeptCode,
          deviceCategory:row.deviceCategory,
          deviceType:row.deviceType,
          componentName: 'oldEquipmentDetail',
          routerTitle: '老旧设备详情'
        }
      });
    },
    selectEdit(){
       if (this.selectList.length == 0) {
        this.$message.warning("请选择一条数据!")
        return
      }

       this.$router.push({
        path: '/detailRoute',
        query: {
          data:this.selectList,
          componentName: 'oldEquipmentChangePj',
          routerTitle: '老旧设备自评库编辑 '
        }
      });

    },
    editClick(row){
       this.$router.push({
        path: '/detailRoute',
        query: {
          data:row,
          componentName: 'oldEquipmentChangePj',
          routerTitle: '老旧设备自评库编辑 '
        }
      });
    },
     getEntityDept(val) {
        //选择 部门
        this.searchForm.propertyDeptCode = val.id
        this.searchForm.propertyDept = val.fullName
        this.$refs.searchForm.$forceUpdate()
        this.$forceUpdate()
      },
      getYunWDept(val) {
        //选择 部门
        this.searchForm.operationDeptCode = val.id
        this.searchForm.operationDept = val.fullName
        this.$refs.searchForm.$forceUpdate()
        this.$forceUpdate()
      },
     async getDictList(code) {
        await getDictList(code).then(res => {
          if (code === "room_type") {
            this.roomTypeList = res.data;
          }else if(code ==='room_function') {
            this.roomFunctionList = res.data;
          }else if(code === 'haveNo'){
            this.ywqkList = res.data;
          }else if(code === 'needNo'){
             this.isOrNotList = res.data;
          }
        });
      },
    getDictCmdbListPid(ciId, pid) {
      getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
        if (ciId === '1097745969774592') { // 设备类型
          this.deviceTypeList = res.data;
        }
      });
    },
    // 设置表格高度
    setTableHeight() {
      this.tableHeight = '50vh';
    },
 async getCmdbDictList(code) {
      //加载cmdb字典
      let query = {}
      query.ciId = code || '1082372687986688'
    await  getDictCmdbList(query).then(res => {
        if (code === '1097745625841664') {
          this.deviceCategoryList = res.data;
        } else if (code === '1103423111233536') {
          this.deviceStatusList = res.data;
        }
        
      
      });
    },
    handleQuery() {
      this.searchForm.current = 1
      this.getData();

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
      };
    this.searchForm.deviceCategory = this.deviceCategoryList.filter(item=> item.dictValue ==='基础设施')[0].dictKey;
    this.searchForm.deviceCategoryName =  this.deviceCategoryList.filter(item=> item.dictValue ==='基础设施')[0].dictValue;
    this.getData();
    
    },
   
    
    selectDevice() {
       this.$router.push({
        path: '/detailRoute',
        query: {
          componentName: 'oldEquipmentSelect',
          routerTitle: '老旧设备自评库选择设备'
        }
      });
    },
  }
}
</script>

<style lang='scss' scoped>

.pj_content{
    display: flex;
}

.changeC{
    display: flex;
    justify-content: center;
    align-items: center;
    span{
        margin-right: 3px;
    }
}

</style>
