<template>
  <basic-container style="padding: 0;">
    <div class="page_form" style="padding-bottom: 10px">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input placeholder="请输入姓名" clearable v-model="searchForm.name" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="人员类型">
              <el-select v-model="searchForm.type" clearable placeholder="请选择人员类型">
                <el-option v-for="dict in personTypeList" :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司">
              <xt-tree-lzay-select placeholder="请选择公司" :formValue="searchForm.companyName" :selectType="'CORP'" @getTreeItem="(v)=>getOwnerUnit(v,'CORP')">
              </xt-tree-lzay-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外部单位">
              <el-input placeholder="请选择外部单位" clearable v-model="searchForm.externalCompany" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="人员状态">
              <el-select v-model="searchForm.enabled" clearable placeholder="请选择人员状态">
                <el-option :key="1" label="启用" :value="1"/>
                <el-option :key="0" label="禁用" :value="0"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18" align="right">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button style="margin-left: 5px;" type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24">
          <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 0px;" @click="handleAdd">新增</el-button>
          <el-button v-if="permissionList.delBtn" type="danger" style="margin-left: 5px;" @click="delArrt(selectionList)">删除</el-button>
          <el-button v-if="permissionList.expBtn" type="primary" style="margin-left: 5px;" @click="handleImport">导出</el-button>
          <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 5px;" @click="handleImportDialog">导入人员信息</el-button>
          <el-button v-show="false" v-if="permissionList.addBtn" type="primary" style="margin-left: 5px;" @click="handleImportImg">导入人员照片</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="page_body">
      <el-table
        ref="arrtTable"
        :data="tableData"
        :height="tableHeight"
        stripe
        size="small"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column label="姓名" prop="name" width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="人员类型" prop="type" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.type, personTypeList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="companyName" width="230" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="部门" prop="departmentName" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="外部单位" prop="externalCompany" width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.externalCompany ? '-' : scope.row.externalCompany }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号" prop="idCard" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="门禁人员编号" prop="acCode" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="卡号" prop="accessCard" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.accessCard ? '-' : scope.row.accessCard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人脸照片" width="100" align="center">
          <template slot-scope="scope">
            <el-link v-if="scope.row.faceLength > 0" type="primary" size="mini" :underline="false"
                     @click="updatePic(scope.row, 'edit')">
              <span class="s_lt">已上传</span>
            </el-link>
            <el-link v-else type="primary" size="mini" :underline="false" @click="updatePic(scope.row, 'add')">
              <span class="s_lt">未上传</span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="人员状态" prop="enabled" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="changeIsEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column label="安规二维码" width="100" align="center">
          <template slot-scope="scope">
            <el-link v-if="scope.row.extAttr1" type="primary" size="mini" :underline="false"
                     @click="uploadCodeFunc(scope.row, 'edit')">
              <span class="s_lt">已上传</span>
            </el-link>
            <el-link v-else type="primary" size="mini" :underline="false" @click="uploadCodeFunc(scope.row, 'add')">
              <span class="s_lt">未上传</span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.updateTime ? '-' : scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="permissionList.editBtn" prop="createTime" align="center" width="100" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <el-link type="primary" size="mini" :underline="false" @click="handleEdit(scope.row)" icon="el-icon-edit">
                <span class="s_lt">编 辑</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.pageNumber"
        :limit.sync="searchForm.pageSize"
        :pageSizes="[10,20,50,100,200]"
        @pagination="getList"/>
    </div>

    <!--     属性新增编辑弹窗 -->
    <addEdit :is-show="workOrderParams.isShow"
             v-if="workOrderParams.isShow"
             :operator-type="workOrderParams.type"
             :form-detial="workOrderParams.formDetial"
             @close="componentClose"
             @refreshData="refreshData"></addEdit>

    <!--     图片上传弹窗 -->
    <upload-image :isShow.sync="uploadImageParams.isShow"
                  v-if="uploadImageParams.isShow"
                  :type="uploadImageParams.type"
                  :form-detial="uploadImageParams.formDetial"
                  @close="componentClose"
                  @refreshData="refreshData"></upload-image>

    <!-- 安规二维码 -->
    <upload-code :isShow.sync="uploadCodeParams.isShow"
                  v-if="uploadCodeParams.isShow"
                  :type="uploadCodeParams.type"
                  :form-detial="uploadCodeParams.formDetial"
                  @close="componentClose"
                  @refreshData="refreshData"></upload-code>

    <!-- 导入弹窗 -->
    <el-dialog title="导入人员信息" :visible.sync="importDialogVisible" width="500px">
      <div class="upload-container">
        <el-upload
          v-loading="importLoading"
          element-loading-text="正在导入，请稍候……"
          class="upload-demo"
          ref="upload"
          drag
          action="/api/idevelop-xcnanr/xcnanr/worker/batchAdd"
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
          <div slot="tip" class="el-upload__tip">仅支持上传xlsx、xls格式的表格文件<br/>请确认导入的正式人员身份证号与用户管理中的身份证号保持一致。</div>
        </el-upload>
      </div>
    </el-dialog>


    <!-- 导入弹窗 -->
    <el-dialog title="导入人员照片" :visible.sync="importImgVisible" width="500px">
      <div class="upload-container">
        <el-upload
          v-loading="importLoading"
          element-loading-text="正在导入，请稍候……"
          class="upload-demo"
          ref="upload"
          drag
          action="/api/idevelop-xcnanr/xcnanr/worker/batchAddWorkerImg"
          :auto-upload="true"
          :before-upload="uploadImgBefore"
          :on-change="uploadChangeStatus"
          :headers="headers"
          :show-file-list="false"
          accept=".zip"
          style="text-align: center"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">仅支持上传zip格式的文件</div>
        </el-upload>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import {mapGetters} from 'vuex'
import addEdit from "./addEdit.vue";
import xtTreeLzaySelect from '@/components/xtTreeLzaySelect/index.vue'
import {getDictList} from '@/api/dict'
import uploadImage from './uploadImage.vue'
import uploadCode from './uploadCode.vue'
import {
  getByPage,
  deleteByIds,
  changeEnable,
  getWorkXlsx,
  outWorkXlsx
} from '@/api/xcnanr/authorizedPerson'
import ExcelJS from 'exceljs'
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'

export default {
  components: {
    addEdit, xtTreeLzaySelect, getDictList, uploadImage, uploadCode
  },
  computed: {
    ...mapGetters(["permission", 'userDetail']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.workerAdd, false),
        editBtn: this.vaildData(this.permission.workerEdit, false),
        delBtn: this.vaildData(this.permission.workerDel, false),
        expBtn: this.vaildData(this.permission.workerExp, false)
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
      uploadCodeParams: {
        isShow: false,
        type: null,
        formDetial: {}
      },
      selectionList: [],
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        name: '',
        companyId: '',
        departmentId: '',
        externalCompany: '',
        type: null,
        enabled: null
      },
      total: 0,
      tableData: [],
      tableHeight: undefined,
      tableLoading: false,
      // 人员类型
      personTypeList: [],
      importDialogVisible: false,
      importImgVisible: false,
      importLoading: false,
      headers: {
        Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
        'Idevelop-Auth': 'bearer ' + getToken()
      },
    }
  },
  mounted() {
    this.setPageContentHeight()
    this.setTableHeight()
    this.getList()
    this.getDictList('info_worker_type')
  },
  methods: {
    handleImport() {
      getWorkXlsx(this.searchForm).then(res => {
        // 获取 outWorkXlsx 的键顺序
        const headerKeys = Object.keys(outWorkXlsx)
        // 过滤数据，只保留 outWorkXlsx 中存在的字段，并按照 outWorkXlsx 的顺序排列
        // 处理字典值
        const modifiedData = res.data.map(item => {
          return {
            ...item,
            type: this.conversionDict(item.type, this.personTypeList)
          }
        })

        const filteredData = modifiedData.map(item => {
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
        const headers = headerKeys.map(key => outWorkXlsx[key])
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
          a.download = '被授权人.xlsx'
          a.click()
          window.URL.revokeObjectURL(url)
        })
      })
    },
    refreshData() {
      this.getList()
    },
    updatePic(data, type) {
      this.uploadImageParams.isShow = true
      this.uploadImageParams.type = type
      this.uploadImageParams.formDetial = data
    },
    uploadCodeFunc(data, type) {
      this.uploadCodeParams.isShow = true
      this.uploadCodeParams.type = type
      this.uploadCodeParams.formDetial = data
    },
    // 切换可用状态
    changeIsEnabled(data, val) {
      let tip = (val === 0) ? '禁用' : '启用'
      this.$confirm('此操作将 "' + tip + '" ' + data.name + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 更改数据库数据
        const worker = {
          id: data.id,
          enabled: val
        }
        changeEnable(worker).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: data.name + tip + '成功'
            });
          }
        })
      }).catch(() => {
        data.enabled = val === 0 ? 1 : 0
      })
    },
    //加载字典
    getDictList(code) {
      getDictList(code).then(res => {
        if (code === 'info_worker_type') {
          this.personTypeList = res.data
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
    getOwnerUnit(val, type) {
      if (type === 'CORP') {
        //单位
        this.searchForm.companyId = val.id
        this.searchForm.companyName = val.fullName

        //单位更改 部门请初始化
        this.searchForm.departmentId = null
        this.searchForm.departmentName = null
      } else if (type === 'DEPT') {
        //部门
        this.searchForm.departmentId = val.id
        this.searchForm.departmentName = val.fullName
      }
      this.$forceUpdate()
    },
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection.map(item => item.id)
    },
    handleQuery() {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getList()
    },
    handleReset() {
      this.searchForm.name = undefined
      this.searchForm.companyId = undefined
      this.searchForm.companyName = undefined
      this.searchForm.departmentId = undefined
      this.searchForm.departmentName = undefined
      this.searchForm.externalCompany = undefined
      this.searchForm.type = null
      this.searchForm.enabled = null
      this.getList()
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 100) + 'px'
    },
    getList() {
      this.tableLoading = true
      getByPage(this.searchForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 删除
    delArrt(row) {
      this.$confirm('确定是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids;
        ids = row.join(',')
        const worker = {
          id: ids
        }
        deleteByIds(worker).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.getList()
        })
      })
    },
    saveGlobalArrt() {
      this.showForm = false
      this.getList()
    },
    handleAdd() {
      this.workOrderParams.type = 'add'
      this.workOrderParams.isShow = true
    },
    handleEdit(row) {
      this.workOrderParams.type = 'edit'
      this.workOrderParams.formDetial = row
      this.workOrderParams.formDetial.type += ''
      this.workOrderParams.isShow = true;
    },
    handleFeedback(row) {
      this.workOrderSee.type = 'feedback'
      this.workOrderSee.formDetial = row
      this.workOrderSee.isShow = true
    },
    handleSee(row) {
      this.workOrderSee.type = 'see'
      this.workOrderSee.formDetial = row
      this.workOrderSee.isShow = true
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
      this.uploadCodeParams = {
        isShow: false,
        type: null,
        formDetial: {}
      }
    },
    /**
     * 打开导入人员信息弹窗
     */
    handleImportDialog() {
      this.importDialogVisible = true
    },
    /**
     * 打开导入人员照片弹窗
     */
    handleImportImg() {
      this.importImgVisible = true
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
    /**
     * 文件选择改变时触发
     * @param files
     */
    uploadImgBefore(file) {
      if (!file.name.endsWith('.zip')) {
        this.$message({ type: 'error', message: '请上传zip格式的文件' })
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

::v-deep(.el-textarea .el-input__count) {
  background: #e0f3ff10 !important;
}

::v-deep(.el-input .el-input__count .el-input__count-inner) {
  background: #e0f3ff10 !important;
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
