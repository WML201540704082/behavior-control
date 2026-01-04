<template>
  <basic-container style="padding: 0;">
    <div class="page_form" style="padding-bottom: 15px">
<!--      <el-card shadow="always" style="border: 1px solid #d9d6d6 !important;  width: 1100px; margin-bottom: 20px; ">-->
        <el-form ref="searchForm" :model="searchForm" label-width="50px" class="xt_search_form">
          <el-row>
            <el-col :span="6">
              <el-form-item label="名称" prop="name">
                <el-input
                  placeholder="请输入名称"
                  clearable
                  v-model="searchForm.name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司" prop="companyId">
                <xt-tree-lzay-select placeholder="请选择公司" :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getTreeItem(v)" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="IP" prop="IP">
                <el-input placeholder="请输入IP" clearable v-model="searchForm.ip" maxlength="15" />
              </el-form-item>
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="primary" @click="handleQuery" style="margin-right: 5px;">查询</el-button>
              <el-button type="primary" plain @click="handleReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
<!--      </el-card>-->
      <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 0;" @click="handleAdd">新增</el-button>
      <el-button v-if="permissionList.delBtn" type="danger" style="margin-left: 5px;" @click="delBatch">删除</el-button>
      <el-button type="primary" style="margin-left: 5px;" @click="handleImport">导出</el-button>
    </div>
    <div v-loading="connectLoading" element-loading-text="正在进行连通性测试, 请稍候……" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" class="page_body">
      <el-table :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="名称" prop="name" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="IP" prop="ip" width="130" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="MAC地址" prop="mac" width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.mac ? '-' : scope.row.mac }}</span>
          </template>
        </el-table-column>
        <el-table-column label="SDK端口" prop="sdkPort" width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="品牌" prop="brand" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.brand }}</span>
          </template>
        </el-table-column>
        <el-table-column label="在线状态" prop="status" width="100" align="center"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" type="danger">离线</span>
            <span v-else type="success">在线</span>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" prop="enabled" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" @change="changeIsEnabled(scope.row, scope.row.enabled)" />
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="companyName" min-width="220" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="管理员" prop="manageUser" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.manageUser ? '-' : scope.row.manageUser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="140" align="center"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="140" align="center">
          <template slot-scope="scope">
            <span>{{ !scope.row.updateTime ? '-' : scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" width="220" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <div style="justify-content: space-between">
                <el-link v-if="permissionList.editBtn" type="primary" size="mini" :underline="false" @click="handleEdit(scope.row)" icon="el-icon-edit">
                  <span class="s_lt">编辑</span>
                </el-link>
                <el-link v-if="permissionList.connectivityBtn" type="primary" size="mini" :underline="false"  style="margin-left: 10px;" :disabled="scope.row.invokeCount > 0" @click="handleConnect(scope.row)" icon="el-icon-connection">
                  <span class="s_lt">连通性</span>
                </el-link>
                <el-link v-if="permissionList.operationalOrderBtn" type="primary" size="mini" :underline="false" style="margin-left: 10px;" @click="handleDeviceList(scope.row)" icon="el-icon-box">
                  <span class="s_lt">设备列表</span>
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
      <AddAndEdit  ref="AddAndEdit" :dialogType="dialogType" :bastionData="bastionData" @submit="submit" @addAndEditCloseDialog="addAndEditCloseDialog"></AddAndEdit>
    </el-dialog>

    <!-- 设备列表弹窗 -->
    <el-dialog v-if="deviceListDialogVisible" :title="deviceListTitle" :visible.sync="deviceListDialogVisible" width="1200px" :before-close="deviceListCloseDialog">
      <DeviceList ref="DeviceList" :bastionDataId="bastionDataId" @deviceListCloseDialog="deviceListCloseDialog"></DeviceList>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog title="导入录像机" :visible.sync="importDialogVisible" width="30%">
      <div class="upload-container">
        <el-upload class="upload-demo" ref="upload" drag action="" :auto-upload="false" :on-change="handleChange" :on-remove="handleRemove" :file-list="fileList" accept=".xlsx,.xls" multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传xlsx/xls文件</div>
        </el-upload>
      </div>
      <div class="button-container">
        <el-button style="margin-left: 10px;" type="primary" @click="uploadBastionData">确认</el-button>
        <el-button style="margin-left: 10px;" plain @click="cancelUpload">取消</el-button>
      </div>
    </el-dialog>

  </basic-container>
</template>

<script>
import {mapGetters} from "vuex"
import {
  getBastion,
  updateEnabled,
  deleteBastion,
  addBastion,
  updateBastion,
  testConnection,
  getBastionXlsx, outBastionXlsx, inBastionXlsx, batchAddBastion
} from '@/api/xcnanr/bastion'
import AddAndEdit from "./components/AddAndEdit.vue"
import DeviceList from "./components/DeviceList.vue"
import {erpmaintainList} from "@/api/xcnanr/electronicDrawings"
import XtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue"
import ExcelJS from 'exceljs'
import { submitUpload } from '@/api/xcnanr/export/exportExcel'


export default {
  components: {
    XtTreeLzaySelect,
    AddAndEdit,
    DeviceList
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
      swerkList: [],
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
      bastionData:{},
      bastionDataId:"",
      connectLoading: false,
      importDialogVisible: false,
      fileList: [{}]
    }
  },
  mounted() {
    this.getList();
    this.getDict();
  },
  methods: {
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body');
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    // 获取字典
    getDict() {
      erpmaintainList({current: 1, size: 200}).then(res => {
        this.swerkList = res.data.records
      })
    },
    /**
     * 导出
     */
    handleImport() {
      getBastionXlsx(this.searchForm).then(res => {
        // 获取 bastionXlsx 的键顺序
        const headerKeys = Object.keys(outBastionXlsx);
        // 过滤数据，只保留 bastionXlsx 中存在的字段，并按照 bastionXlsx 的顺序排列
        const filteredData = res.data.map(item => {
          const filteredItem = {}
          headerKeys.forEach(key => {
            if (item.hasOwnProperty(key)) {
              filteredItem[key] = item[key]
            }
          })
          return filteredItem
        })
        // 创建工作簿和工作表
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Sheet1')
        // 添加表头
        const headers = headerKeys.map(key => outBastionXlsx[key])
        worksheet.addRow(headers)
        // 添加数据行
        filteredData.forEach(row => {
          worksheet.addRow(Object.values(row))
        })
        // 设置表头样式
        const headerRow = worksheet.getRow(1)
        headerRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'FFDDDDDD'}
          }
          cell.font = {
            bold: true,
            color: {argb: 'FF000000'}
          }
          cell.border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
          }
          cell.alignment = {horizontal: 'center', vertical: 'middle'}
        })

        // 设置数据行样式
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) { // 跳过表头行
            row.eachCell((cell) => {
              cell.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
              }
              cell.alignment = {horizontal: 'center', vertical: 'middle'}
            })
          }
        })
        // 自动调整列宽
        worksheet.columns.forEach(column => {
          let maxLength = 0
          column.eachCell((cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 10
            if (columnLength > maxLength) {
              maxLength = columnLength
            }
          })
          column.width = maxLength < 10 ? 10 : maxLength
        })
        // 导出文件
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          // 设置文件名
          a.download = '堡垒机.xlsx'
          a.click()
          window.URL.revokeObjectURL(url)
        })
      })
    },
    /**
     * 获取表格数据
     */
    getList() {
      this.tableLoading = true;
      getBastion(this.searchForm).then(res => {
        this.tableData = res.data.list;
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
      this.bastionData = JSON.parse(JSON.stringify(row))
      this.addAndEditTitle='编辑堡垒机'
      this.dialogType='edit'
      this.addAndEditDialogVisible=true
    },
    /**
     * 新增触发事件
     */
    handleAdd() {
      // 开启弹窗
      this.bastionData={}
      this.addAndEditTitle = '新增堡垒机'
      this.dialogType='add'
      this.addAndEditDialogVisible = true
    },
    /**
     * 设备列表触发事件
     */
    handleDeviceList(row) {
      console.log("数据", row)
      this.bastionDataId = row.id
      this.deviceListTitle = row.name+'同步设备列表'
      this.deviceListDialogVisible = true
    },
    /**
     * 连通性触发事件
     */
    handleConnect(row) {
      this.connectLoading = true
      testConnection(row.id).then(res => {
        this.connectLoading = false
        this.getList()
        if (res.msg === '连接成功') {
          this.$message({
            message: '连接成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '连接失败',
            type: 'error'
          })
        }
      })
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
        addBastion(data).then(() => {
          this.addAndEditDialogVisible = false
          this.getList()
          this.$message({ type: "success", message: "新增成功!" })
        })
      }
      if(type === 'edit'){
        updateBastion(data).then(() => {
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
          deleteBastion(this.selectionList).then(res => {
            if (res.code === 200) {
              // 删除成功刷新列表
              this.getList()
            }
          })
        })
      }
    },
    /**
     * 是否启用触发事件
     */
    changeIsEnabled(data, val) {
      const _this = this
      let tip = (val === 0) ? '禁用' : '启用'
      this.$confirm('此操作将 "' + tip + '" ' + data.name + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateEnabled(data).then(() => {
          _this.$message({ type: "success", message: "操作成功!" })
        })
      }).catch(() => {
        data.enabled = val === 0 ? 1 : 0
      })
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
    /**
     * 打开导入弹窗
     */
    handleImportDialog() {
      this.importDialogVisible = true
      this.fileList = []
    },
    /**
     * 取消导入弹窗
     */
    cancelUpload() {
      this.importDialogVisible = false
      this.fileList = []
    },
    /**
     * 文件选择改变时触发
     * @param files
     * @param fileList
     */
    handleChange(files, fileList) {
      this.fileList = fileList
    },
    /**
     * 移除文件时触发
     * @param file
     * @param fileList
     */
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    /**
     * 上传录像机数据到后端
     */
    uploadBastionData() {
      this.$confirm('确认导入这些堡垒机数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.fileList.length === 0) {
          this.$message.warning('请选择文件')
          return
        }
        submitUpload(this.fileList,inBastionXlsx).then(dataArray => {
          batchAddBastion(dataArray).then(() => {
            this.$message({
              type: 'success',
              message: '导入成功！'
            })
            this.cancelUpload()
            this.getList()
          })
        }) .catch(() => {
          this.$message.info('上传文件时出错')
        })
      }).catch(() => {
        this.$message.info('已取消导入')
      })
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
