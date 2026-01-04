<template>
  <basic-container style="padding: 0;">
    <div class="page_form" style="padding-bottom: 15px">
      <!--      <el-card shadow="always" style="border: 1px solid #d9d6d6 !important;  width: 1100px; margin-bottom: 20px; ">-->
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="公司" prop="companyId">
              <xt-tree-lzay-select placeholder="请选择公司" :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getTreeItem(v)"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属机房" prop="name">
              <el-select v-model="searchForm.roomId" placeholder="请选择">
                <el-option v-for="item in allRoom" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
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
      <el-button v-if="permissionList.expBtn" type="primary" style="margin-left: 5px;" @click="handleImport">导出</el-button>
      <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 5px;" @click="handleImportDialog">导入</el-button>
    </div>
    <div class="page_body">
      <el-table :data="tableData" :height="tableHeight" stripe size="small" v-loading="tableLoading" @selection-change="selectionChange">
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="录像机名称" prop="name" min-width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="公司" prop="companyName" width="220" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="机房" prop="roomName" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="IP" prop="ip" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="SDK端口" prop="port" width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="品牌" prop="brand" width="130" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.brand ? '-' : scope.row.brand }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="在线状态" prop="status" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" type="danger">离线</span>
            <span v-else type="success">在线</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.updateTime ? '-' : scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <el-link v-if="permissionList.editBtn" type="primary" size="mini" :underline="false" @click="handleEdit(scope.row)" icon="el-icon-edit">
                <span class="s_lt">编辑</span>
              </el-link>
              <el-link v-if="permissionList.cameraAddBtn" type="primary" size="mini" :underline="false" style="margin-left: 20px" @click="addEvent(scope.row)" icon="el-icon-video-camera">
                <span class="s_lt">摄像头</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        :pageSizes="[10,20,50,100,200]"
        @pagination="getList"/>
    </div>

    <!-- 新增编辑弹窗 -->
    <el-dialog :title="addAndEditTitle" :visible.sync="addAndEditDialogVisible" width="1000px" :before-close="addAndEditCloseDialog">
      <AddAndEdit ref="AddAndEdit" :allRoom="allRoom" :dialogType="dialogType" :nvrData="nvrData" @submit="submit" @addAndEditCloseDialog="addAndEditCloseDialog" />
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog title="导入录像机数据" :visible.sync="importDialogVisible" width="500px">
      <div class="upload-container">
        <el-upload
          v-loading="importLoading"
          element-loading-text="正在导入，请稍候……"
          class="upload-demo"
          ref="upload"
          drag
          action="/api/idevelop-xcnanr/xcnanr/nvr/batchAdd"
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
import {mapGetters} from "vuex";
import {addNvr, deleteNvr, getNvr, getNvrXlsx, outNvrXlsx, updateNvr} from '@/api/xcnanr/nvr'
import {getAllRoom} from '@/api/xcnanr/room'
import AddAndEdit from "@/views/xcnanr/authManage/authConfiguration/roomVideo/components/addEdit.vue"
import XtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import ExcelJS from 'exceljs'
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'

export default {
  components: {
    XtTreeLzaySelect,
    AddAndEdit
  },
  computed: {
    ...mapGetters(["permission", "userInfo", 'userDetail']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.NVRAdd, false),
        editBtn: this.vaildData(this.permission.NVREdit, false),
        delBtn: this.vaildData(this.permission.NVRDel, false),
        expBtn: this.vaildData(this.permission.NVRExp, false),
        cameraAddBtn: this.vaildData(this.permission.cameraAdd, false)
      }
    }
  },
  data() {
    return {
      userInfo: this.$store.state.user.userDetail,
      // 批量删除选中id
      swerkList: [],
      selectionList: [],
      allRoom: [{}],
      // 查询对象
      searchForm: {
        companyId: '',
        companyName: '',
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
      dialogType: '',
      // 弹层数据
      nvrData: {},
      importDialogVisible: false,
      importLoading: false,
      headers: {
        Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
        'Idevelop-Auth': 'bearer ' + getToken()
      },
    }
  },
  mounted() {
    this.getList()
    this.queryAllRoom()
  },
  methods: {
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 50) + 'px'
    },
    /**
     * 获取表格数据
     */
    getList() {
      this.tableLoading = true
      getNvr(this.searchForm).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    /**
     * 获取所有机房
     */
    queryAllRoom() {
      const query = {
        companyId: this.userInfo.ownerUnit
      }
      getAllRoom(query).then(res => {
        this.allRoom = res.data
      })
    },
    /**
     * 批量删除选择事件
     */
    selectionChange(selection) {
      this.selectionList = selection.map(item => item.id)
    },
    /**
     * 编辑触发事件
     */
    handleEdit(row) {
      this.nvrData = JSON.parse(JSON.stringify(row))
      this.addAndEditTitle = '编辑录像机'
      this.dialogType = 'edit'
      this.addAndEditDialogVisible = true

    },
    /**
     * 新增触发事件
     */
    handleAdd() {
      this.nvrData = {}
      this.addAndEditTitle = '新增录像机'
      this.dialogType = 'add'
      this.addAndEditDialogVisible = true
    },
    /**
     * 新增或编辑提交
     */
    submit(data, type) {
      if (type === 'add') {
        addNvr(data).then(() => {
          this.addAndEditDialogVisible = false
          this.getList()
          this.$message({type: "success", message: "新增成功!"})
        })
      }
      if (type === 'edit') {
        updateNvr(data).then(() => {
          this.addAndEditDialogVisible = false
          this.getList()
          this.$message({type: "success", message: "编辑成功!"})
        })
      }
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
     * 删除触发事件
     */
    delBatch() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据")
        return
      }
      if (this.selectionList.length > 0) {
        this.$confirm('删除录像机时会同时删除所属摄像头，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteNvr(this.selectionList).then(res => {
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
    addAndEditCloseDialog() {
      this.addAndEditDialogVisible = false
      this.$refs.AddAndEdit.clearValidate()
    },
    /**
     * 公司下拉树
     * @param val
     */
    getTreeItem(val) {
      this.searchForm.companyId = val.id
      this.searchForm.companyName = val.fullName
    },
    /**
     * 导出
     */
    handleImport() {
      getNvrXlsx(this.searchForm).then(res => {
        // 获取 outNvrXlsx 的键顺序
        const headerKeys = Object.keys(outNvrXlsx);
        // 过滤数据，只保留 outNvrXlsx 中存在的字段，并按照 outNvrXlsx 的顺序排列
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
        const headers = headerKeys.map(key => outNvrXlsx[key])
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
          a.download = '机房视频.xlsx'
          a.click()
          window.URL.revokeObjectURL(url)
        })
      })
    },
    /**
     * 跳转摄像头列表
     */
    addEvent(row) {
      const thisTabId = document.getElementById("tab-/xcnanr/authManage/authConfiguration/index")
      const allTabs = thisTabId.parentElement.children
      for (let i = 0; i < allTabs.length; i++) {
        const tab = allTabs[i]
        if (tab.id.indexOf("tab-/xcnanr/cameraList") >= 0) {
          document.getElementById(tab.id).childNodes[1].click()
        }
      }
      this.$router.push({path: "/xcnanr/cameraList", query: {nvrId: row.id}})
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
