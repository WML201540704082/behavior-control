<template>
  <div>
    <el-dialog :title="getTitle(roomData)" :visible.sync="dialogVisible" width="70%" @close="handleClose"  :close-on-click-modal="false">
      <!-- 使用 el-row 和 el-col 创建两栏布局 -->
      <el-row :gutter="20" style="margin-top: 10px; ">
        <el-col :span="9">
          <div class="xt_card_xc xt_form xc_base" style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="margin-right: 10px;">图片名称</span>
            <el-input placeholder="请输入名称" v-model="searchForm.name" style="flex: 1; margin-right: 10px;" :maxlength="20"></el-input>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
          <upload-file2-oss ref="file" :accept-types="['.jpg', '.png', '.jpeg']" @fileResult="getOssFileInfoFunc"></upload-file2-oss>
          <div class="page_body">
            <el-table
              ref="arrtTable"
              :data="tableData"
              height="450px"
              stripe
              size="small"
              v-loading="tableLoading"
              @row-click="handleRowClick"
            >
              <el-table-column prop="index" label="序号" width="60" align="center">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column label="图纸名称" align="center" min-width="160">
                <template slot-scope="scope">
                  <el-input v-if="editRowIndex === scope.$index" v-model="scope.row.name" placeholder="请输入图纸名称" :maxlength="30" show-word-limit />
                  <span v-else>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="上传时间" align="center" width="130">
                <template slot-scope="scope">
                  {{ formatDateTime(scope.row.createTime) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="createTime" align="center" width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div style="display: flex; justify-content: center; align-items: center;">
                    <el-link v-if="editRowIndex === -1" type="primary" size="mini" :underline="false" @click="editRowFunc(scope.$index)">
                      <span class="s_lt">编辑</span>
                    </el-link>
                    <el-link v-if="editRowIndex === scope.$index" type="primary" size="mini" :underline="false" @click="updateDrawingName(scope.row)">
                      <span class="s_lt">保存</span>
                    </el-link>
                    <el-link v-if="editRowIndex === -1" type="primary" size="mini" :underline="false" style="margin-left: 10px" @click="deleteItem(scope.row)">
                      <span class="s_lt">删除</span>
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
        </el-col>
        <el-col :span="15">
          <el-card shadow="never" style="border: 1px dashed #ccc; padding: 9px; width: 95%; height: 100%">
            <!-- 这里放置图片展示的区域 -->
            <div style="text-align:center;">
              <el-image style="height: 530px;" :src="selectedImage" :preview-src-list="[selectedImage]"></el-image>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>


<script>
import {
  roomDataDetailList, editRoomDataDetail, deleteRoomDataDetail, addRoomDataDetail,
  erpmaintainList
} from "@/api/xcnanr/electronicDrawings";
import uploadFile2Oss from '../../components/UploadFile2Oss'

export default {
  components: { uploadFile2Oss },
  props: {
    operatorType: {
      type: String,
      default: 'add'
    },
    roomData: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    roomData: {
      immediate: true, // 添加立即监听
      handler(newValue) {
        this.tableLoading = true
        this.searchForm.roomDataId = newValue.id
        roomDataDetailList(this.searchForm).then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
          if (res.data.list.length > 0) {
            this.selectedImage = res.data.list[0].ossUrl
          } else {
            this.selectedImage = '' // 如果没有图片，则清空 selectedImage
          }
        }).finally(() => {
          this.tableLoading = false; // 请求完成后设置 tableLoading 为 false
        });
      }
    }
  },
  data() {
    return {
      tableHeight: undefined,
      total: 0,
      tableLoading: false,
      selectedImage: '',
      swerkList: [],
      addData: {
        imgBase64: '',
        name: '',
        roomDataId: '',
        companyId: '',
        companyName: ''
      },
      editData: {},
      editDialogVisible: false,
      searchForm: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      dialogVisible: false,
      form: {
        companyName: '',
        name: '',
        drawingName: ''
      },
      editRowIndex: -1
    };
  },
  mounted() {
    this.getDict()
  },
  methods: {
    editRowFunc(index) {
      this.editRowIndex = index
    },
    updateDrawingName(row) {
      if (!row.name || !row.name.trim()) {
        this.$message.error('图纸名称不能为空')
        return
      }
      this.tableLoading = true
      editRoomDataDetail({id : row.id, name: row.name}).then(() => {
        this.$message.success('编辑成功')
        this.getList()
        this.editRowIndex = -1
        this.tableLoading = false
      })
    },
    formatDateTime(dateTime) {
      if (dateTime) {
        return dateTime.replace('T', ' ');
      }
      return '';
    },
    handleClick() {
      this.$refs.upload.clearFiles(); // 清除文件列表
      this.$refs.upload.$el.querySelector('input').click(); // 触发文件选择器
    },
    getOssFileInfoFunc(name, ossUrl) {
      const data = {
        name: name, ossUrl: ossUrl, roomDataId: this.roomData.id, companyId: this.roomData.companyId, companyName: this.roomData.companyName
      }
      // 调用addRoomDataDetail方法上传数据
      addRoomDataDetail(data).then(() => {
        this.$message({ type: 'success', message: '上传成功!' })
        this.getList()
        this.tableLoading = false
      }).catch(() => {
        this.$message({ type: 'error', message: '上传失败!' })
        this.tableLoading = false
      })
    },
    handleRowClick(row) {
      if (!row.ossUrl) {
        this.$message({ type: 'error', message: '预览失败' })
        return
      }
      this.selectedImage = row.ossUrl; // 假设 row 包含 ossUrl 字段
    },
    getDict() {
      erpmaintainList({current: 1, size: 200}).then(res => {
        this.swerkList = res.data.records
      })
    },
    getList() {
      this.tableLoading = true
      roomDataDetailList(this.searchForm).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    showForm(formDetial) {
      this.dialogVisible = true;
      if (this.operatorType === 'edit' && formDetial) {
        this.form = {
          companyName: formDetial.companyName,
          name: formDetial.name,
          drawingName: ''
        };
      } else {
        this.form = {
          companyName: '',
          name: '',
          drawingName: ''
        };
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.form = {
        companyName: '',
        name: '',
        drawingName: ''
      };
      this.$emit('close'); // 触发关闭事件
    },
    getTitle(type) {
      return type.companyName + "/" + type.name
    },
    search() {
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = 10
      this.getList()
    },
    reset() {
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = 10
      this.searchForm.name = undefined
      this.getList()
    },
    deleteItem(row) {
      this.tableLoading = true
      deleteRoomDataDetail([row.id]).then(() => {
        this.$message.success('删除成功')
        this.getList()
        this.tableLoading = false
      })
    }
  }
};
</script>


<style scoped>
.el-dialog__header {
  border-bottom: 1px solid #ebeef5;
}

.el-dialog__footer {
  text-align: right;
}
</style>
