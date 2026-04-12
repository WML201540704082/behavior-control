<template>
  <basic-container style="padding: 0;">
    <div class="page_form" style="padding-bottom: 15px">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="机房名称" prop="name">
              <el-input placeholder="请选择名称" clearable v-model="searchForm.name" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="机房类型" prop="type">
              <el-select v-model="searchForm.type" filterable clearable placeholder="请选择机房类型">
                <el-option v-for="dict in roomTypeList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司" prop="companyId">
              <xt-tree-lzay-select  placeholder="请选择公司" :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getOwnerUnit(v,'CORP')" />
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button style="margin-right: 0px;" type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 0px;" @click="handleAdd">新增</el-button>
            <el-button v-if="permissionList.delBtn" type="danger" style="margin-left: 5px;" @click="delArrt(selectionList)">删除</el-button>
            <el-button v-if="permissionList.expBtn" type="primary" style="margin-left: 5px;" @click="handleImport">导出</el-button>
            <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 5px;" @click="handleImportDialog">导入</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-table ref="arrtTable" :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="机房名称" prop="name" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="机房类型" prop="type" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.type, roomTypeList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="companyName" width="300px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="备注" prop="remark" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.remark ? '-' : scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.updateTime ? '-' : scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" width="120" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="display: flex;justify-content: space-between">
              <el-link v-if="permissionList.editBtn" type="primary" size="mini" :underline="false" @click="handleEdit(scope.row)" icon="el-icon-edit">
                <span class="s_lt">编 辑</span>
              </el-link>
              <el-link v-if="permissionList.roomControlBtn" type="primary" size="mini" :underline="false" @click="handleAccessControl(scope.row)" icon="el-icon-mobile">
                <span class="s_lt">门 禁</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.pageNumber"
        :limit.sync="searchForm.pageSize"
        :pageSizes="[10, 20,50,100]"
        @pagination="getList"/>
    </div>

    <!--     属性新增编辑弹窗 -->
    <addEdit :is-show="workOrderParams.isShow"
             v-if="workOrderParams.isShow"
             :operator-type="workOrderParams.type"
             :form-detial="workOrderParams.formDetial"
             @close="componentClose"
             @refreshData="refreshData"></addEdit>

    <!-- 导入弹窗 -->
    <el-dialog title="导入机房数据" :visible.sync="importDialogVisible" width="500px">
      <div class="upload-container">
        <el-upload
          v-loading="importLoading"
          element-loading-text="正在导入，请稍候……"
          class="upload-demo"
          ref="upload"
          drag
          action="/api/idevelop-xcnanr/xcnanr/room/batchAdd"
          :auto-upload="true"
          :before-upload="uploadBeforeSubmit"
          :on-change="uploadChangeStatus"
          :headers="headers"
          :show-file-list="false"
          accept=".xlsx,.xls"
          style="text-align: center"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">仅支持上传xlsx、xls格式的表格文件</div>
        </el-upload>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {mapGetters} from "vuex"
  import addEdit from "./addEdit.vue"
  import { getDictList } from '@/api/dict'
  import {getByPage, deleteByIds, getAllRoom} from "@/api/xcnanr/room"
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue"
  import { exportData } from '@/api/xcnanr/export/exportExcel'
  import website from '@/config/website';
  import {Base64} from 'js-base64';
  import {getToken} from '@/util/auth'

  export default {
    components: {
      addEdit, getDictList, xtTreeLzaySelect
    },
    computed: {
      ...mapGetters(["permission", 'userDetail']),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.roomAdd, false),
          editBtn: this.vaildData(this.permission.roomEdit, false),
          delBtn: this.vaildData(this.permission.roomDel, false),
          expBtn: this.vaildData(this.permission.roomExp, false),
          roomControlBtn: this.vaildData(this.permission.roomControlAdd, false)
        }
      }
    },
    data() {
      return {
        workOrderParams: {
          isShow: false,
          type: null,
          formDetial: {}
        },
        uploadImageParams: {
          isShow: false,
          type: null,
          formDetial: {}
        },
        selectionList: [],
        searchForm: {
          pageNumber: 1,
          pageSize: 10,
          name: '',
          type: '',
          companyId: ''
        },
        total: 0,
        tableData: [],
        tableHeight: undefined,
        tableLoading: false,
        // 机房类型
        roomTypeList: [],
        importDialogVisible: false,
        importLoading: false,
        headers: {
          Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
          'Idevelop-Auth': 'bearer ' + getToken()
        },
      }
    },
    mounted() {
      this.setPageContentHeight();
      this.setTableHeight();
      this.getList();
      this.getDictList('info_room_type')
    },
    methods: {
      getOwnerUnit(val, type) {
        if (type === 'CORP') {
          //单位
          this.searchForm.companyId = val.id
          this.searchForm.companyName = val.fullName

          //单位更改 部门请初始化
          this.searchForm.departmentId = null;
          this.searchForm.departmentName = null;
        } else if (type === 'DEPT') {
          //部门
          this.searchForm.departmentId = val.id;
          this.searchForm.departmentName = val.fullName;
        }
        this.$forceUpdate()
      },
      handleAccessControl(data){
        this.$router.push({
          path: '/xcnanr/ideal/baseAc/ac/index',
          query: {
            searchId: data.id
          }
        })
      },
      refreshData(){
        this.getList()
      },
      updatePic(data,type){
        this.uploadImageParams.isShow = true
        this.uploadImageParams.type = type
        this.uploadImageParams.formDetial = data
      },
      //加载字典
      getDictList(code){
        getDictList(code).then(res => {
          if(code==='info_room_type'){
            this.roomTypeList = res.data
          }
        })
      },
      //字典回显
      conversionDict(code, dictList) {
        if (dictList != null && code !== '') {
          let items = dictList.filter(item => item.dictKey == code)
          if (items != null && items.length > 0) {
            return items[0].dictValue
          }
        }
        return code
      },
      selectionChange(selection) {
        //点击选择事件
        this.selectionList = selection.map(item => item.id);
      },
      handleQuery() {
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        this.getList();
      },
      handleReset() {
        this.searchForm.name = undefined;
        this.searchForm.type = undefined;
        this.searchForm.companyId = undefined;
        this.searchForm.companyName = undefined;
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        this.getList();
      },
      // 设置表格高度
      setTableHeight() {
        let bodyBox = document.getElementsByClassName('page_body');
        this.tableHeight = (bodyBox[0].offsetHeight - 100) + 'px'
      },
      getList() {
        this.tableLoading = true;
        getByPage(this.searchForm).then(res => {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      /**
       * 导出
       */
      handleImport() {
        // 定义需要导出的列
        const columns = {
          name: "机房名称",
          type: "机房类型",
          companyName: "归属公司",
          remark: "备注",
          createUserName: "创建人",
          createTime: "创建时间",
          updateUserName: "更新人",
          updateTime: "更新时间"
        }
        const _this = this
        // 获取数据
        getAllRoom(this.searchForm).then(res => {
          const dataList = res.data
          // 字典值替换
          for (const item of dataList) {
            const dict = _this.roomTypeList.find(d => d.dictKey === item.type + '')
            item.type = dict ? dict.dictValue : item.type
          }
          // 导出数据
          exportData(dataList, columns, '机房信息 ')
        })
      },
      // 删除
      delArrt(row) {
        this.$confirm('删除机房时会同时删除所属门禁，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids;
          ids = row.join(',')
          const worker ={
            id: ids
          }
          deleteByIds(worker).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            this.getList()
          })
        })
      },
      saveGlobalArrt() {
        this.showForm = false
        this.getList()
      },
      handleAdd() {
        this.workOrderParams.type = 'add';
        this.workOrderParams.isShow = true;
      },
      handleEdit(row) {
        this.workOrderParams.type = 'edit';
        this.workOrderParams.formDetial = row;
        this.workOrderParams.formDetial.type += ''
        this.workOrderParams.isShow = true;
      },
      componentClose() {
        this.workOrderParams = {
          isShow: false,
          type: null,
          formDetial: {}
        };
        this.uploadImageParams = {
          isShow: false,
          type: null,
          formDetial: {}
        }
      },
      /**
       * 打开导入弹窗
       */
      handleImportDialog() {
        this.importDialogVisible = true
      },
      /**
       * 文件选择改变时触发
       * @param files
       */
      uploadBeforeSubmit(file) {
        if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
          this.$message({ type: 'error', message: '请上传xls或xlsx格式的表格文件' })
          return false
        }
        return true
      },
      uploadChangeStatus(file) {
        if (file.status === 'ready') {
          this.importLoading = true
          return
        } else if (file.status === 'success') {
          if (file.response.success) {
            this.$message({ type: 'success', message: '导入成功' })
            this.importDialogVisible = false
            this.handleQuery()
          } else {
            this.$message({ type: 'error', message: file.response.msg })
          }
        } else if (file.status === 'fail') {
          this.$message({ type: 'error', message: '导入失败' })
        }
        this.importLoading = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-link {
    font-size: 13px;
  }

  .s_lt {
    font-size: 12px;
  }
  ::v-deep(.el-textarea .el-input__count){
    background: #e0f3ff10 !important;
  }
  ::v-deep(.el-input .el-input__count .el-input__count-inner){
    background: #e0f3ff10 !important;
  }
</style>
