<template>
  <basic-container>
    <!-- 设备报废-->
    <div class="page_form">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="xt_search_form">
        <el-row :gutter="10">
           <el-col :span="6">
            <el-form-item label="WBS项目" prop="filingNo"  >
              <el-input v-model="searchForm.filingNo"  placeholder="搜索并选择WBS项目" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="WBS元素" prop="status" >
              <el-select v-model="searchForm.status"   placeholder="请选择WBS元素" clearable >
                <el-option  v-for="dict in taskList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

           <el-col :span="6">
            <el-form-item label="设备名称" prop="taskName"  >
              <el-input v-model="searchForm.taskName"  placeholder="请输入设备名称" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编码" prop="taskName"  >
              <el-input v-model="searchForm.taskName"  placeholder="请输入设备编码" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备类型" prop="taskName"  >
             <el-select v-model="searchForm.pyStyle"   placeholder="请选择设备类型" clearable >
                <el-option  v-for="dict in pyStyleList" :key="dict.node"  :label="dict.nodeName" :value="dict.node"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备状态" prop="taskName"  >
              <el-select v-model="searchForm.pyStatus"   placeholder="请选择设备状态" clearable >
                <el-option  v-for="dict in pyStatusList" :key="dict.node"  :label="dict.nodeName" :value="dict.node"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="剩余时间" prop="pyStatus" >
              <!-- <el-select v-model="searchForm.pyStatus"   placeholder="请选择转资剩余时间" clearable >
                <el-option  v-for="dict in pyStatusList" :key="dict.node"  :label="dict.nodeName" :value="dict.node"></el-option>
              </el-select> -->
              <el-input v-model="searchForm.pyStatus"  placeholder="请输入转资剩余时间" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>

            <el-col :span="6">
            <el-form-item label="入库时间" prop="createTimes" >
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
        <formTitle :titleText="'任务列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button class="border-btn" size="small" icon="el-icon-refresh" @click="searchReset">重置</el-button>
            <!-- <el-button type="primary" size="small"  v-if="permission.pandian_add"  @click="handleAdd">新增</el-button>
            <el-button class="border-btn"   size="small" @click="handleExport">导出</el-button>
            <el-button type="danger" size="small" plain v-if="permission.pandian_delete" @click="handleDelete">删除</el-button> -->
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
        <el-table-column prop="filingNo" label="WBS项目"  align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="taskName" label="WBS元素"  align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="设备编码" align="center" show-overflow-tooltip>
          <!-- <template  slot-scope="scope">
             <div class="status_chuzhi">
              <div
                class="cicle"
                :class="
                  scope.row.status == '1' ? 'unstart' : (scope.row.status == '2' ? 'start':(scope.row.status == '3' ? 'complish':'timeout'))
                "
              ></div>
              <div>
                {{showProcessStatus(scope.row.status,taskList)}}
              </div>
            </div>
          </template> -->
        </el-table-column>
        <el-table-column prop="isExpire" label="设备名称"  align="center" show-overflow-tooltip>
           <!-- <template  slot-scope="scope">
            <span>{{scope.row.isExpire == '0' ? '否':'是'}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="checkProgress" label="设备类型"   align="center" show-overflow-tooltip>  </el-table-column>
        <el-table-column prop="isCheckNum" label="入库时间"  align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="noCheckNum" label="剩余转资操作天数"   align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pyProgress" label="设备状态"   align="center" show-overflow-tooltip></el-table-column>

        
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template  slot-scope="scope">
            <el-button type="text"
                       class="list_btn"
                       size="small"
                       icon="el-icon-view"
                       @click="handleView(scope.row.id)">转资
            </el-button>
            <!-- <el-button type="text"
                       class="list_btn"
                       size="small"
                       v-if="((scope.row.processStatus === 'hussar_2') && permission.pandian_edit)|| (scope.row.processStatus == '1' && permission.pandian_edit) && scope.row.status != '3'"
                       icon="el-icon-edit"
                       @click="handleEdit(scope.row.id)">编辑
            </el-button>
            <el-button type="text"
                       size="small"
                       v-if="scope.row.processStatus == '1' && permission.pandian_delete && scope.row.status != '3'"
                       icon="el-icon-delete"
                       @click="handleDeleteOne(scope.row.id)">删除
            </el-button>
              <el-button type="text"
                       class="list_btn"
                       size="small"
                        v-if="scope.row.processStatus == 'hussar_4' &&  (userDetail.userName.indexOf('部门主任') != -1) && permission.pandian_approve"
                       icon="el-icon-view"
                       @click="handleApprove(scope.row)">处置
            </el-button> -->
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
import {mapGetters} from "vuex";
import { processDict } from "@/api/process/index";
import {pandianTaskList,pandianTaskRemove} from "@/api/shujubaoxian/pandianTask";
import {getDictList} from "@/api/dict";
import operateForm from './pandianrenwu/components/dialog/operateForm'

export default {
    components: { operateForm },

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
      tableHeight: undefined,
      total: 0,
      // 字典
      username: "",
      taskList:[],//任务状态
      pyStatusList:[{node:'0',nodeName:'待处理'},{node:'1',nodeName:'已处理'},{node:'2',nodeName:'已超期'}],//设备状态
      pyStyleList:[{node:'0',nodeName:'台式机'},{node:'1',nodeName:'笔记本'}],//设备类型
        // 操作弹窗
      showOperate: false,
      orderDeatil: {
        filingNo:'',
      }
    };
  },
  computed: {
    ...mapGetters(["permission","userDetail"]),
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      // console.log(ids,'删除的id=============');
      return ids.join(",");
    },


  },
 async mounted(){
    // 设置页面元素高度
    this.setPageContentHeight()
    // 设置表格高度
    this.setTableHeight()
    //加载字典--任务状态
    this.getTaskStatusList("checkTaskStatus");
    //加载数据
    this.onLoad()
    // console.log(this.userDetail,'111111111=========')
  },
  methods: {
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
     selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection;
    },
    selectionClear() {
      //清除选择
      this.selectionList = [];
      this.$refs.dataTable.clearSelection();
    },
     textColor(noCheckNum){
        if(parseInt(noCheckNum) > 0){
          return '#409EFF'
        }else{
          return '#606266'
        }
     },
     goDetail(index,taskId){
      //新增 页面
      this.$router.push({
        path: '/detailRoute',
        query: {
          index:index,
          taskId:taskId,
          componentName: 'pandianTaskDetail',
          routerTitle: '盘点任务详情'
        }
      });
     },
      onLoad() {
      //加载数据
      this.loading = true;
      pandianTaskList(this.searchForm).then(res => {
        // console.log(res,'pandianTaskList=================');
        const data = res.data;
        this.total = data.total;
        this.dataList = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },

     //任务状态
     getTaskStatusList(code){
      //加载字典
      getDictList(code).then(res => {
          this.taskList  = res.data;
      });
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
      this.tableHeight = pageBody[0].offsetHeight - 50 - 47 + 'px'
    },
     showProcessStatus(code,dictList){
      //字典回显
      if(dictList!=null && code!==''){
        let items = dictList.filter(item => item.dictKey==code);
        if(items!=null && items.length>0){
          return items[0].dictValue;
        }else{
          return ''
        }
      }
      return code;
    },
    handleQuery(){
      this.searchForm.current = 1
      this.onLoad();
    },
    handleDeleteOne(id) {
      //删除按钮
      let ids =  id;
      this.handleDeleteConfirm(ids);
      // this.selectionList.filter(item => item!=id);
    },
    handleDelete() {
      //顶部删除
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }

      let selectionArr = this.selectionList.filter(item=> item.processStatus != '1')
      // console.log(this.selectionList,selectionArr);
      if(selectionArr.length > 0){
          this.$message.warning("当前选中盘点任务不能删除");
          return;
      }
      this.handleDeleteConfirm(this.ids);
    },
    handleDeleteConfirm(ids) {
       this.$confirm("点击确认将永久删除数据且无法恢复，请谨慎选择。","确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return pandianTaskRemove(ids+'');
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
    searchReset() {
      //重置按钮
      this.$refs.searchForm.resetFields();
      this.onLoad();
    },

    dataPickerStartChange(createTimes) {
      //时间段选择
      if (createTimes != null && createTimes.length > 0) {
        this.searchForm.taskStartTimeS = createTimes[0]
        this.searchForm.taskEndTimeS = createTimes[1]
      } else {
        this.searchForm.taskStartTimeS = null
        this.searchForm.taskEndTimeS = null
      }
    },
      dataPickerEndChange(createTimes) {
      //时间段选择
      if (createTimes != null && createTimes.length > 0) {
        this.searchForm.taskStartTimeE = createTimes[0]
        this.searchForm.taskEndTimeE = createTimes[1]
      } else {
        this.searchForm.taskStartTimeE = null
        this.searchForm.taskEndTimeE = null
      }
    },
    handleView(id) {
       // 页面
      this.$router.push({
        path: '/detailRoute',
        query: {
          id:id,
          componentName: 'pandianTaskProcessDetail',
          routerTitle: '盘点任务详情'
        }
      });
    },
    handleApprove(item){
      //  this.orderDeatil = row;
      this.orderDeatil.filingNo = item.filingNo;
      this.orderDeatil.id = item.id;
      this.showOperate = true
    },
     submitOperate() {
      this.showOperate = false
      this.handleQuery()
    },
    handleEdit(id) {
     this.$router.push({
        path: '/detailRoute',
        query: {
          id:id,
          componentName: 'pandianTaskAdd',
          routerTitle: '盘点任务编辑'
        }
      });
    },
    handleAdd(){
      //新增 页面
      this.$router.push({
        path: '/detailRoute',
        query: {
          componentName: 'pandianTaskAdd',
          routerTitle: '盘点任务新增'
        }
      });
    },
    handleExport(){
      //导出
    }
  }
}
</script>
<style lang="scss" scoped>
.list_btn{
  padding: 9px 5px !important;
}
.btn_red{
  color: red;
}

.status_chuzhi {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .cicle {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    margin-right: 5px;
  }

  .unstart {
    background-color: lightgray;
  }
  .start {
    background-color: #409eFF;
  }
  .timeout{
    background-color: red;

  }
  .complish{
    background-color: green;

  }
}
</style>



