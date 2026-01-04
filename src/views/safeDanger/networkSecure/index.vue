<template>
  <div>
    <basic-container>
      <!-- <el-header style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;"> -->

        <div class="page_form">
          <el-form class="xt_search_form" ref="queryForm" :model="queryParams" label-width="105px">
          
            <el-row>
              <el-col :span="8">
                <el-form-item label="督察分类" prop="supervision">
                  <el-select v-model="queryParams.supervision" placeholder="" clearable size="small">
                    <el-option
                      v-for="dict in supervisionList"
                      :key="dict.supervision"
                      :label="dict.supervision"
                      :value="dict.supervision"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="督察项:" prop="supervisionType">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="queryParams.supervisionType"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="督察要点:" prop="supervisionPoint">
                  <el-input
                    placeholder=""
                    clearable
                    size="mini"
                    v-model="queryParams.supervisionPoint"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

          
            <el-row class="btnLine">
              <el-button type="primary" size="mini"  icon="el-icon-search"
                          @click="handleQuery">查询</el-button>
              <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-refresh-left"
                          @click="resetQuery">重置</el-button>

              <el-button  type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-plus"
                          v-hasPermi="['system:computerroom:add']"
                          @click="handleAdd">新增</el-button>

              <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-edit"
                          v-hasPermi="['system:computerroom:edit']"
                          :disabled="multipleSelection.length != 1"
                          @click="handleUpdate">修改</el-button>

              <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-delete"
                          v-hasPermi="['system:computerroom:remove']"
                          :disabled="!multipleSelection.length > 0"
                          @click="handleDelete">删除</el-button>
            </el-row>
            
            
          </el-form>
        </div>

      <!-- </el-header> -->
      <!-- <el-main style="padding-left: 20px;padding-top: 0px"> -->
        <div class="page_body">
          <el-table
            v-loading="loading"
            :data="tableList"
            :height="tableHeight"
            border
            stripe
            @row-dblclick="handleDblclick"
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%;height:100%;margin-top:5px;">
            <el-table-column
              type="selection"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="supervision"
              align="left"
              label="督察分类"
              sortable
              width="230"
              show-overflow-tooltip>
            </el-table-column>
              <el-table-column
              prop="supervisionType"
              align="left"
              label="督察项"
              sortable
              width="230"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="supervisionPoint"
              align="left"
              label="督察要点"
              sortable
              show-overflow-tooltip>
            </el-table-column>
           
            <el-table-column
              prop="company"
              align="left"
              label="操作"
              sortable
              show-overflow-tooltip
              width="150"
            >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" v-if='scope.row.parentId == 0' @click="handleRow(scope.row)">绑定整改责任人</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.current"
            :limit.sync="queryParams.size"
            @pagination="getList"
          />
        </div>
      <!-- </el-main> -->
    </basic-container>
    <div v-if="dialogVisible">
      <el-dialog :modal-append-to-body="false" :title="dialogTitle" style="padding: 0px;"
                 :close-on-click-modal="false" :visible.sync="dialogVisible"
                 :before-close="handleClose"  width="45%">
        <Detail @closeRoom="closeDialog" :room-id="roomId" :is-edit="isEdit" :is-info="isInfo"/>
      </el-dialog>
    </div>


    <!-- 批量导入列表 -->
    <div v-if="importTableVisible">
      <el-dialog  title="绑定责任人" :visible.sync="importTableVisible" 
                  :before-close="closeDialog" width="80%" style="padding: 0px;"
                  :modal-append-to-body="false" :close-on-click-modal="false">
        <ImportTable @closeRoom="closeDialog" :roomId="roomId"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ImportTable from './components/importTable'
import Detail from "./components/detail";
import { securityList, securityDelete, securitySupervision } from "@/api/safeDanger/networkSecure"

// import { list, del } from "@/api/safeDanger/computerroom";
export default {
  name: "index",
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
    ]),
  },
  components: {Detail, ImportTable},
  data() {
    return {
      tableHeight:undefined,
      isEdit: false,
      isInfo: false,
      roomId: undefined,
      dialogTitle: '',
      dialogVisible: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中数据
      multipleSelection: [],
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: null,
      // 查询参数
      queryParams: {
        current: 1,
        size: 20,
        supervision: undefined,          //督察分类
        supervisionType: undefined,      //督察项
        supervisionPoint: undefined,     //督察要点
      },
      queryDisabled: {
        showDeviceType: true,
        showUnitSecond: false
      },

      supervisionList: [],

      importTableVisible: false
    }
  },
  created() {
    
    this.getList();
  },
  mounted() {
    this.getCurrentHeight()
    window.addEventListener('resize', this.getCurrentHeight)
    window.addEventListener('webkitvisibilitychange', this.getCurrentHeight)
  },
  methods: {
    handleRow(row){
      this.roomId = row.id
      this.importTableVisible = true
    },
    initData(){
      securitySupervision().then(res=>{
        this.supervisionList = res.data
      })
    },
    // 获取自适应高度
    getCurrentHeight() {
      let windowHeight = window.innerHeight //窗口高度
      this.tableHeight = (windowHeight - 280) + 'px'
    },
    closeDialog(){
      this.dialogVisible = false
      this.importTableVisible = false
      this.getList();
    },
    getList() {
      this.initData()
      this.loading = true
      securityList(this.queryParams).then(response =>{
        this.tableList = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      this.ids = []
      this.multipleSelection = val;
      this.ids = val.map(item => item.id);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1
      this.getList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      // this.resetForm("queryForm");
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    },
    handleDelete() {
      const ids = this.ids;
      this.$confirm('是否确认删除选中数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return securityDelete(ids);
      }).then(rsp => {
        this.getList();
        this.$message.success('删除成功');
      }).catch(function() {});
    },
    handleAdd() {
      this.roomId = undefined
      this.dialogTitle = '新增'
      this.dialogVisible = true
      this.isEdit = false
      this.isInfo = false
    },
    handleUpdate() {
      if(this.multipleSelection.length<=0 || this.multipleSelection.length>1){
        this.$message({
          message: '请选择一条需要修改记录！',
          type: 'warning'
        });
        return;
      }
      this.roomId = this.multipleSelection[0].id;
      this.dialogTitle = '编辑';
      this.dialogVisible = true;
      this.isEdit = true
      this.isInfo = false
    },
    handleDblclick(row) {
      this.roomId = row.id;
      this.dialogTitle = '详情';
      this.dialogVisible = true;
      this.isEdit = true
      this.isInfo = true
    },
    handleClose() {
      this.dialogVisible = false
      this.getList();
    }
  }
}
</script>

<style scoped>
  .el-col-8{
    height: 30px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }
  .el-cascader{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }
  .el-input{
    width: 100%;
  }
</style>
