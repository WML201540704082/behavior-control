<template>
  <basic-container>
    <div>
      <el-button type="primary" icon="el-icon-d-arrow-left" @click="returnTab" style="margin-bottom: 10px">返回机房视频页面</el-button>
    </div>
    <div style="margin-bottom: 10px" v-show="nvrId">
      <span>{{ nvrInfo.companyName }}/</span>
      <span>{{ nvrInfo.roomName }}/</span>
      <span>{{ nvrInfo.name }}</span>
    </div>
    <div class="page_form" style="padding-bottom: 15px">
      <!--      <el-card shadow="always" style="border: 1px solid #d9d6d6 !important;  width: 1100px; margin-bottom: 20px; ">-->
      <el-form ref="searchForm" :model="searchForm" label-width="50px" class="xt_search_form">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="名称" prop="name">
              <el-input placeholder="请输入名称" clearable v-model="searchForm.name" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IP" prop="IP">
              <el-input placeholder="请输入IP" clearable v-model="searchForm.ip" :maxlength="15"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!--      </el-card>-->
      <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 0;" @click="handleAdd">新增</el-button>
      <el-button v-if="permissionList.delBtn" type="danger" style="margin-left: 5px;" @click="delBatch">删除</el-button>
      <el-button v-if="permissionList.expBtn" type="primary" style="margin-left: 5px;" @click="handleImport">导出</el-button>
      <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 5px;" @click="handleImportDialog">导入</el-button>
    </div>
    <div class="page_body">
      <el-table
        :data="tableData"
        :height="tableHeight"
        stripe
        size="small"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="名称" prop="name" min-width="250" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="IP" prop="ip" width="250" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.ip ? '-' : scope.row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="端口" prop="port" width="220" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.port ? '-' : scope.row.port }}</span>
          </template>
        </el-table-column>
        <el-table-column label="通道" prop="channel" width="220" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="250" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="250" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.updateTime ? '-' : scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <el-link v-if="permissionList.editBtn" type="primary" size="mini" :underline="false" @click="handleEdit(scope.row)" icon="el-icon-edit">
                <span class="s_lt">编 辑</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        :pageSizes="[10,20,50,100]"
        @pagination="getList"/>
    </div>

    <!-- 新增编辑弹窗 -->
    <el-dialog :title="addAndEditTitle" :visible.sync="addAndEditDialogVisible" width="1024px" :before-close="addAndEditCloseDialog">
      <CameraAddAndEdit  ref="CameraAddAndEdit" :cameraData="cameraData" :dialogType="dialogType" :nvrInfo="nvrInfo" @submit="submit" @addAndEditCloseDialog="addAndEditCloseDialog"></CameraAddAndEdit>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog title="导入摄像头数据" :visible.sync="importDialogVisible" width="500px">
      <div class="upload-container">
        <el-upload
          v-loading="importLoading"
          element-loading-text="正在导入，请稍候……"
          class="upload-demo"
          ref="upload"
          drag
          action="/api/idevelop-xcnanr/xcnanr/camera/batchAdd"
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
import {
  updateCamera,
  addCamera,
  deleteCamera,
  getCamera,
  getCameraXlsx,
  outCameraXlsx
} from "@/api/xcnanr/camera";
import CameraAddAndEdit from "@/views/xcnanr/authManage/authConfiguration/roomVideo/components/CameraAddAndEdit.vue";
import {getNvrInfo} from "@/api/xcnanr/nvr";
import { mapGetters } from 'vuex'
import ExcelJS from 'exceljs'
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'

export default {
  components: {
    CameraAddAndEdit
  },
  data() {
    return {
      // 批量删除选中id
      swerkList: [],
      nvrInfo:{},
      selectionList: [],
      // 查询对象
      searchForm: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 弹窗控制
      addAndEditDialogVisible: false,
      // 弹层标题
      addAndEditTitle: '',
      // 弹层类型
      dialogType:'',
      // 弹层数据
      cameraData:{},
      nvrId:"",
      importDialogVisible: false,
      importLoading: false,
      headers: {
        Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
        'Idevelop-Auth': 'bearer ' + getToken()
      },
    }
  },
  computed: {
    ...mapGetters(['permission']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.cameraAdd, false),
        editBtn: this.vaildData(this.permission.cameraEdit, false),
        delBtn: this.vaildData(this.permission.cameraDel, false),
        expBtn: this.vaildData(this.permission.cameraExp, false)
      }
    }
  },
  created() {
    this.nvrId=this.$route.query.nvrId
    this.getNvrInfo()
  },
  mounted() {
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
      this.searchForm.nvrId=this.nvrId
      getCamera(this.searchForm).then(res => {
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
      this.cameraData=JSON.parse(JSON.stringify(row))
      this.addAndEditTitle='编辑摄像头'
      this.dialogType='edit'
      this.addAndEditDialogVisible=true

    },
    /**
     * 获取机房信息
     */
    getNvrInfo(){
      getNvrInfo(this.nvrId).then(res => {
        this.nvrInfo=res.data
      })
    },
    /**
     * 新增触发事件
     */
    handleAdd() {
      this.cameraData={}
      this.addAndEditTitle = '新增摄像头'
      this.dialogType='add'
      this.addAndEditDialogVisible = true
    },
    /**
     * 新增或编辑提交
     */
    submit(data, type){
      if(type === 'add'){
        addCamera(data).then(() => {
          this.addAndEditDialogVisible = false
          this.getList()
          this.$message({ type: "success", message: "新增成功!" })
        })
      }
      if(type === 'edit'){
        this.addAndEditDialogVisible = false
        updateCamera(data).then(() => {
          this.getList()
          this.$message({ type: "success", message: "编辑成功!" })
        })
      }
    },
    /**
     * 查询触发事件
     */
    handleQuery() {
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
     * 删除触发事件
     */
    delBatch() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据")
        return
      }
      if (this.selectionList.length > 0) {
        this.$confirm('此操作将删除选中的摄像头，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCamera(this.selectionList).then(res => {
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
      this.$refs.CameraAddAndEdit.clearValidate()
    },
    /**
     * 导出
     */
    handleImport(){
      this.searchForm.nvrId=this.nvrId
      getCameraXlsx(this.searchForm).then(res => {
        // 获取 outCameraXlsx 的键顺序
        const headerKeys = Object.keys(outCameraXlsx);
        // 过滤数据，只保留 outCameraXlsx 中存在的字段，并按照 outCameraXlsx 的顺序排列
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
        const headers = headerKeys.map(key => outCameraXlsx[key])
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
          // 跳过表头行
          if (rowNumber > 1) {
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
          a.download = '摄像头.xlsx'
          a.click()
          window.URL.revokeObjectURL(url)
        })
      })
    },
    returnTab() {
      this.$router.push({path: '/xcnanr/authManage/authConfiguration/index',query:{tab:'RoomVideo'}})
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

.upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
