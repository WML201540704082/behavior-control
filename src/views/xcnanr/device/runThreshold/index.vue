<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 15px">
<!--      <el-card shadow="always" style="border: 1px solid #d9d6d6 !important;  width: 1100px; margin-bottom: 20px; ">-->
        <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
          <el-row>
            <el-col :span="6">
              <el-form-item label="设备分类">
                <el-select v-model="searchForm.ciId" filterable clearable placeholder="请选择设备分类">
                  <el-option v-for="dict in type1List" :key="dict.ciId" :label="dict.ciLabel" :value="dict.ciId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="属性">
                <el-select v-model="searchForm.propKey" filterable clearable placeholder="请选择属性">
                  <el-option v-for="dict in propList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" align="right">
              <el-button type="primary" @click="handleQuery" style="margin-right: 5px;">查询</el-button>
              <el-button type="primary" plain @click="handleReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
<!--      </el-card>-->
      <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 0;" @click="handleAdd">新增</el-button>
      <el-button v-if="permissionList.delBtn" type="danger" style="margin-left: 5px;" @click="delBatch">删除</el-button>
    </div>
    <div v-loading="connectLoading" element-loading-text="正在进行连通性测试, 请稍候……" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" class="page_body">
      <el-table :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="设备分类" prop="ciName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备类型" prop="subCiName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="属性" prop="propKey" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ showDictLabel(scope.row.propKey, propList) }}
          </template>
        </el-table-column>
        <el-table-column label="属性值" prop="propValue" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="属性单位" prop="propUnit" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="阈值状态" prop="extAttr1" align="center">
          <template slot-scope="scope">
            {{ scope.row.extAttr1 + '' === '1' ? '运行' : '停用' }}
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createUserName" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" width="120" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <div style="justify-content: space-between">
                <el-link v-if="permissionList.editBtn" type="primary" size="mini" :underline="false" @click="handleEdit(scope.row)" icon="el-icon-edit">
                  <span class="s_lt">编辑</span>
                </el-link>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize" :pageSizes="[10,20,50,100]" @pagination="getList"/>
    </div>
    <!-- 新增编辑弹窗 -->
    <el-dialog :title="addAndEditTitle" :visible.sync="addAndEditDialogVisible" width="1024px" :before-close="addAndEditCloseDialog">
      <Form ref="AddAndEdit" :dialogType="dialogType" :form-data="formData" @submit="submit" @addAndEditCloseDialog="addAndEditCloseDialog"></Form>
    </el-dialog>

  </basic-container>
</template>

<script>
import {mapGetters} from "vuex"
import infoIdeveRunThresholdApi from '@/api/xcnanr/infoIdeveRunThreshold'
import Form from "./Form.vue"
import XtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue"
import { getDictList } from '@/api/dict'
import { devBookCiTree } from "@/api/assets/devStandingBook"

export default {
  components: {
    XtTreeLzaySelect,
    Form
  },
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.bastionAdd, false),
        editBtn: this.vaildData(this.permission.bastionEdit, false),
        delBtn: this.vaildData(this.permission.bastionDel, false),
        expBtn: this.vaildData(this.permission.bastionExp, false),
        connectivityBtn: this.vaildData(this.permission.connectivity, false),
        operationalOrderBtn: this.vaildData(this.permission.operationalOrder, false)
      }
    }
  },
  data() {
    return {
      userInfo:this.$store.state.user.userDetail,
      // 批量删除选中id
      selectionList: [],
      // 查询对象
      searchForm: {
        companyId: '',
        companyName:'',
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗控制
      addAndEditDialogVisible: false,
      deviceListDialogVisible: false,
      // 弹层标题
      addAndEditTitle: '',
      deviceListTitle:'',
      // 弹层类型
      dialogType:'',
      // 弹层数据
      formData:{},
      connectLoading: false,
      importDialogVisible: false,
      fileList: [{}],
      propList:[], type1List: []
    }
  },
  mounted() {
    getDictList("info_ideve_run_threshold_props").then(res => {
      this.propList = res.data
    })
    getDictList('info_ideve_it_ciid').then(res => {
      if (res && res.data.length > 0) {
        // 获取IT设备下属分类
        devBookCiTree({ parentCiId: res.data[0]['dictKey'], isMenu: 1, current: 1, size: 999 }).then(res1 => {
          this.type1List = res1.data.records
        })
      }
    })
    this.getList();
  },
  methods: {
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body');
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    /**
     * 获取表格数据
     */
    getList() {
      this.tableLoading = true;
      infoIdeveRunThresholdApi.getByPage(this.searchForm).then(res => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    /**
     * 批量删除选择事件
     */
    selectionChange(selection) {
      this.selectionList = selection.map(item => item.id);
    },
    /**
     * 编辑触发事件
     */
    handleEdit(row) {
      this.formData = JSON.parse(JSON.stringify(row))
      this.addAndEditTitle='编辑运行状态阈值'
      this.dialogType='edit'
      this.addAndEditDialogVisible=true
    },
    /**
     * 新增触发事件
     */
    handleAdd() {
      // 开启弹窗
      this.formData={}
      this.addAndEditTitle = '新增运行状态阈值'
      this.dialogType='add'
      this.addAndEditDialogVisible = true
    },
    /**
     * 查询触发事件
     */
    handleQuery() {
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = 10
      this.getList()
    },
    /**
     * 重置触发事件
     */
    handleReset() {
      // 恢复默认查询对象
      this.searchForm = {
        pageNo: 1,
        pageSize: 10,
      }
      // 重新查询
      this.getList()
    },
    /**
     * 新增或编辑提交
     */
    submit(data, type){
      if(type === 'add'){
        infoIdeveRunThresholdApi.add(data).then(() => {
          this.addAndEditDialogVisible = false
          this.getList()
          this.$message({ type: "success", message: "新增成功!" })
        })
      }
      if(type === 'edit'){
        infoIdeveRunThresholdApi.edit(data).then(() => {
          this.addAndEditDialogVisible = false
          this.getList()
          this.$message({ type: "success", message: "编辑成功!" })
        })
      }
    },
    /**
     * 删除触发事件
     */
    delBatch() {
      const _this = this
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据")
        return
      }
      if (this.selectionList.length > 0) {
        this.$confirm('此操作将删除选中的堡垒机，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          infoIdeveRunThresholdApi.deleteByIds({ id: _this.selectionList.join(',') }).then(res => {
            if (res.code === 200) {
              // 删除成功刷新列表
              this.getList()
            }
          })
        })
      }
    },
    /**
     * 关闭弹层
     */
    addAndEditCloseDialog(){
      this.addAndEditDialogVisible=false
      this.$refs.AddAndEdit.clearValidate()
    },
    deviceListCloseDialog(){
      this.deviceListDialogVisible=false
      this.$refs.DeviceList.cleanQuery()
    },
    /**
     * 公司下拉树
     * @param val
     */
    getTreeItem(val){
      this.searchForm.companyId = val.id
      this.searchForm.companyName =val.fullName
    },
    showDictLabel(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        if(Array.isArray(dictList) && dictList.length > 0) {
          let items = dictList.filter(item => item.dictKey == code)
          if (items != null && items.length > 0) {
            return items[0].dictValue
          }
        }
      }
      return code
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
