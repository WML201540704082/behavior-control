<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="xt-layout page_body">
      <div class="xt-layout-content" style="height: 84vh; padding: 0px 0px 0px 20px">
        <el-form :model="queryParams" label-suffix=":" label-width="100px" size="small">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item label="反馈编号" size="small">
                <el-input v-model="queryParams.backNum" placeholder="请输入反馈编号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="反馈单位">
                <el-select
                  v-model="queryParams.dept"
                  placeholder="请选择反馈单位"
                  filterable
                  clearable>
                  <el-option
                    v-for="(item, index) in deptList"
                    :key="item.id"
                    :label="item.fullName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="反馈人员" size="small">
                <el-input v-model="queryParams.userName" placeholder="请输入反馈人员" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  class="formTime"
                  v-model="createTimes"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  @change="dataPickerChange"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="反馈进度">
                <el-select
                  v-model="queryParams.backStatus"
                  placeholder="请选择反馈进度"
                  filterable
                  clearable>
                  <el-option
                    v-for="(item, index) in backStatusOptions"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否采纳">
                <el-select
                  v-model="queryParams.isAccept"
                  placeholder="请选择是否采纳"
                  filterable
                  clearable>
                  <el-option
                    v-for="(item, index) in isAcceptOptions"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="反馈信息" size="small">
                <el-input v-model="queryParams.backDetail" placeholder="请输入反馈人员" clearable></el-input>
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="6" style="text-align: left;">
              <el-button type="primary" plain size="small" @click="getList">查 询</el-button>
              <el-button type="info" plain size="small" @click="handleReset">重 置</el-button>
              <el-button type="success" plain size="small" @click="handleAdd">新 增</el-button>
              <el-button type="primary" plain size="small" @click="handleExport">导出</el-button>
            </el-col> -->
          </el-row>
        </el-form>
        <formTitle :titleText="'查询结果列表'" :titleType="'page_title'" style="margin-top:5px">
          <div slot="rightBtnBox">
            <el-button type="primary" size="small" @click="getList">查 询</el-button>
            <el-button type="info" size="small" @click="handleReset">重 置</el-button>
            <el-button type="success" size="small" @click="handleAdd">新 增</el-button>
            <el-button type="primary" size="small" @click="handleExport">导出</el-button>
          </div>
        </formTitle>
        <!-- 设备列表 -->
        <el-table ref="table" :data="tableData" stripe border size="small" height="62vh" v-loading="loading">
          <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="反馈编号" prop="backNum" show-overflow-tooltip align="center" width="145"></el-table-column>
          <el-table-column label="制造商" prop="maker" show-overflow-tooltip align="center" width="190"></el-table-column>
          <el-table-column label="品牌" prop="brand" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="系列" prop="series" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="型号" prop="model" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="是否采纳" prop="isAccept" show-overflow-tooltip align="center" width="100">
            <template slot-scope="{ row }">
              <span>{{ conversionDict(row.isAccept, isAcceptOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属单位" prop="deptName" show-overflow-tooltip align="center" width="210"></el-table-column>
          <el-table-column label="反馈人员" prop="userName" show-overflow-tooltip align="center" width="110"></el-table-column>
          <el-table-column label="反馈进度" prop="backStatus" show-overflow-tooltip align="center" width="100">
            <template slot-scope="{ row }">
              <span>{{ conversionDict(row.backStatus, backStatusOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip align="center" width="140"></el-table-column>
          <!-- <el-table-column label="认证地址" prop="url" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="类型" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <span>{{ getTypeName(scope.row.type) }}</span>
            </template>
          </el-table-column>  fixed="right" -->

          <el-table-column label="操作" width="145" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleCheck(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="handleEdit(scope.row)" v-if="userDetail.userId == scope.row.createUser && scope.row.backStatus === '0'">编辑</el-button>
              <el-button type="text" size="small" @click="handleAdopt(scope.row)" v-if="userDetail.questionFlag === 0 && scope.row.backStatus === '0'">采纳</el-button>
              <el-button type="text" size="small" @click="handleFinshed(scope.row)" v-if="userDetail.questionFlag === 0 && scope.row.backStatus === '1'">完成</el-button>
              <el-button type="text" size="small" @click="handleDelete(scope.row.id)" v-if="userDetail.userId == scope.row.createUser && scope.row.backStatus === '0'">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" :pageSizes="[20, 50, 100, 200]" @pagination="getList"/>
      </div>
    </div>

    <addedit v-if="componentsParams.isShow"
             :isShow="componentsParams.isShow"
             :type="componentsParams.type"
             :detailId="componentsParams.id"
             :formDetial="editRow"
             @refreshData="getList"
             @close="close"></addedit>
  </basic-container>
</template>

<script>
import {getList, getDept, feedbackRemove} from "@/api/standardmodellibrary/index.js";
import { getDictList } from '@/api/dict'
import addedit from "./components/addedit.vue";
import {mapGetters} from "vuex";

export default {
  components: {
    addedit
  },
  data() {
    return {
      loading: false,
      deptList: [],
      queryParams: {
        current: 1,
        size: 20,
      },
      total: 0,
      createTimes: [],

      isAcceptOptions: [],
      backStatusOptions: [],

      selfCode: '',
      tableData: null,
      editRow: null,
      componentsParams: {
        isShow: false,
        type: null,
        id: undefined
      }
    }
  },
  watch: {},
  mounted() {
    // console.log(900, this.userDetail)
    this.queryParams.dept = this.userDetail.ownerUnit

    //记载默认数据
    this.getList()
    this.getDeptList();
    this.getDictList('back_isAccept')
    this.getDictList('back_status')
  },
  computed: {
    ...mapGetters(["permission", "userInfo", "userDetail"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.safeaccess_add, false),
        viewBtn: this.vaildData(this.permission.safeaccess_view, false),
        delBtn: this.vaildData(this.permission.safeaccess_delete, false),
        editBtn: this.vaildData(this.permission.safeaccess_edit, false)
      };
    }
  },
  methods: {
    conversionDict(code, dictList) {
      //字典回显
      if (dictList && code) {
        let items = dictList.filter(item => item.dictKey === code)
        if (items && items.length > 0) {
          return items[0].dictValue
        }
      }
      return code
    },
    getDictList(code){
      //加载字典
      getDictList(code).then(res => {
        if(code==='back_isAccept'){
          this.isAcceptOptions = res.data
        }else if(code==='back_status'){
          this.backStatusOptions = res.data
        }

      })
    },


    dataPickerChange(createTimes) {
      //时间段选择
      if (createTimes != null && createTimes.length > 0) {
        this.queryParams.startTime = createTimes[0] + ' 00:00:00'
        this.queryParams.endTime = createTimes[1] + ' 23:59:59'
      } else {
        this.queryParams.startTime = null
        this.queryParams.endTime = null
      }
    },
    getDeptList() {
      getDept({}).then(res=>{
        this.deptList = res.data
      })
    },
    getList() {
      //加载 班组
      this.loading = true
      getList({
        ...this.queryParams
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      }).finally(() => {
        this.loading = false
      })
    },
    handleReset(){
      this.queryParams= {
        current: 1,
        size: 20,
      }
      this.createTimes = []
      this.getList()
    },
    handleDelete(id) {
      this.$confirm("点击确认将永久删除数据且无法恢复，请谨慎选择。", "确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return feedbackRemove({ids: id});
      }).then(() => {
        this.getList();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      });
    },
    handleCheck(row) {
      this.componentsParams.id = row.id
      this.componentsParams.isShow = true;
      this.componentsParams.type = 'check';
      
      // this.editRow = JSON.parse(JSON.stringify(row));
    },
    handleEdit(row) {
      this.componentsParams.id = row.id
      this.componentsParams.type = 'edit';
      this.componentsParams.isShow = true;
      // this.editRow = JSON.parse(JSON.stringify(row));
    },
    handleAdopt(row) {
      this.componentsParams.id = row.id
      this.componentsParams.type = 'adopt';
      this.componentsParams.isShow = true;
      // this.editRow = JSON.parse(JSON.stringify(row));
    },
    handleFinshed(row) {
      this.componentsParams.id = row.id
      this.componentsParams.type = 'finshed';
      this.componentsParams.isShow = true;
      // this.editRow = JSON.parse(JSON.stringify(row));
    },
    handleAdd() {
      this.componentsParams.isShow = true;
      this.componentsParams.type = 'add';
    },
    close() {
      this.componentsParams.isShow = false;
      this.componentsParams.type = null;
      this.editRow = null;
    },
    // 导出
    handleExport() {
      let form = {
        // wbsCode: this.searchForm.wbsCode,
        // wbsName: this.searchForm.wbsName,
        // projectUnitCode: this.searchForm.projectUnitCode,
        // ids: this.$refs.dataTable.selection.length > 0 ? this.$refs.dataTable.selection.map(el => el.id) : undefined
      }
      this.download(
        "/api/idevelop-system/standardmodellibrary/export",
        this.queryParams,
        "标准型号库反馈.xlsx"
      );
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item{
  margin-bottom: 2px;
}
.xt-layout-sider {
  border-radius: 5px
}

::v-deep .el-tree {
  background: transparent;
  color: #46506d;
}

.theme-xintong .xt-layout .xt-layout-has-sider {
  width: 320px;
  min-width: 300px;
  max-width: 320px;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 320px;
  flex: 0 0 320px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
</style>
