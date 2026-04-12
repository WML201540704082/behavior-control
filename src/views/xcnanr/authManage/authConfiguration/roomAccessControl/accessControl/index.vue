<template>
  <basic-container>
    <div>
      <el-button type="primary" icon="el-icon-d-arrow-left" @click="returnTab" style="margin-bottom: 10px">返回机房页面</el-button>
    </div>
    <div class="page_form" style="padding-bottom: 15px">
      <div style="margin-bottom: 10px" v-show="searchId">
        <span>{{ roomData.companyName }}/</span>
        <span>{{ roomData.name }}</span>
      </div>
      <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="门禁名称" prop="name">
              <el-input placeholder="请选择名称" clearable v-model="searchForm.name" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IP" prop="ip">
              <el-input placeholder="请输入IP" clearable v-model="searchForm.ip" :maxlength="15"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品牌" prop="brand">
              <el-select v-model="searchForm.brand" filterable clearable placeholder="请选择品牌">
                <el-option
                  v-for="dict in roomAcBrandList"
                  :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button style="margin-right: 5px;" type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
          <el-col :span="5" style="margin-top: 5px;margin-left: 5px">
            <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 0px;" @click="handleAdd">新增</el-button>
            <el-button v-if="permissionList.delBtn" type="danger" style="margin-left: 5px;" @click="delArrt(selectionList)">删除</el-button>
            <el-button v-if="permissionList.expBtn" type="primary" style="margin-left: 5px;" @click="handleImport">导出</el-button>
            <el-button v-if="permissionList.addBtn" type="primary" style="margin-left: 5px;" @click="handleImportDialog">导入</el-button>
          </el-col>
        </el-row>
      </el-form>
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
        <el-table-column label="名称" prop="name" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="IP" prop="ip" align="center" width="140px"></el-table-column>
        <el-table-column label="端口" prop="port" align="center" width="90px"></el-table-column>
        <el-table-column label="MAC" prop="mac" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ !scope.row.mac ? '-' : scope.row.mac }}</span>
          </template>
        </el-table-column>
        <el-table-column label="版本" prop="version" align="center" width="90px">
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.version, roomAcVersionList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌" prop="brand" align="center" width="90px">
          <template slot-scope="scope">
            <span>{{ conversionDict(scope.row.brand, roomAcBrandList) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="型号" prop="model" align="center" width="130px"></el-table-column>
        <el-table-column label="序列号" prop="sn" align="center" width="130px"></el-table-column>
        <el-table-column v-if="false" label="状态" prop="networkStatus" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.networkStatus === 0" type="danger">离线</span>
            <span v-else type="success">在线</span>
          </template>
        </el-table-column>
        <el-table-column label="管理员" prop="manageUser" align="center" width="130px">
          <template slot-scope="scope">
            <span>{{ !scope.row.manageUser ? '-' : scope.row.manageUser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联摄像头" prop="manageUser" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.nvrId">{{ scope.row.nvrName + ' [' + (!scope.row.nvrChannel ? '未选择通道号' : ('通道: ' + scope.row.nvrChannel)) + ']' }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" width="140px"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" align="center" width="140px">
          <template slot-scope="scope">
            <span>{{ !scope.row.updateTime ? '-' : scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="createTime" align="center" width="100" fixed="right" show-overflow-tooltip>
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
        :page.sync="searchForm.pageNumber"
        :limit.sync="searchForm.pageSize"
        :pageSizes="[10,20,50,100]"
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
    <el-dialog title="导入机房门禁数据" :visible.sync="importDialogVisible" width="500px">
      <div class="upload-container">
        <el-upload
          v-loading="importLoading"
          element-loading-text="正在导入，请稍候……"
          class="upload-demo"
          ref="upload"
          drag
          action="/api/idevelop-xcnanr/xcnanr/roomAc/batchAdd"
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
  import addEdit from "./addEdit.vue";
  import { getDictList } from '@/api/dict'
  import {getByPage, deleteByIds, getAll} from "@/api/xcnanr/roomAccessControl"
  import {getById} from "@/api/xcnanr/room"
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
  import { exportData } from '@/api/xcnanr/export/exportExcel'
  import website from '@/config/website';
  import {Base64} from 'js-base64';
  import {getToken} from '@/util/auth'

  export default {
    name: 'AccessControl',
    components: {
      addEdit, getDictList, xtTreeLzaySelect
    },
    computed: {
      ...mapGetters(["permission", 'userDetail']),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.roomControlAdd, false),
          editBtn: this.vaildData(this.permission.roomControlEdit, false),
          delBtn: this.vaildData(this.permission.roomControlDel, false),
          expBtn: this.vaildData(this.permission.roomControlExp, false)
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
        selectionList: [],
        searchForm: {
          pageNumber: 1,
          pageSize: 10,
          name: '',
          ip: '',
          brand: ''
        },
        total: 0,
        searchId: null,
        tableData: [],
        tableHeight: undefined,
        tableLoading: false,
        roomData: null,
        roomAcVersionList:[],
        roomAcBrandList:[],
        roomDescription: null,
        importDialogVisible: false,
        importLoading: false,
        headers: {
          Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
          'Idevelop-Auth': 'bearer ' + getToken()
        },

      }
    },
    created() {
      this.searchId = this.$route.query.searchId
      this.getRoom()
      this.getList()
      this.getDictList('info_room_ac_version')
      this.getDictList('info_room_ac_brand')
    },
    mounted() {
      this.setPageContentHeight();
      this.setTableHeight();
      this.searchId = this.$route.query.searchId
      this.getRoom()
      this.getList()
      this.getDictList('info_room_ac_version')
      this.getDictList('info_room_ac_brand')
    },
    methods: {
      handleImport() {
        // 定义需要导出的列
        const columns = {
          name: "门禁名称",
          companyName: "所属公司名称",
          ip: "IP地址",
          port: "端口",
          mac: "MAC地址",
          version: "版本",
          brand: "品牌",
          model: "型号",
          manageUser: "管理人员",
          manageLoginName: "授权账号",
          manageLoginPwd: "授权密码",
          sn: "序列号",
          position: "安装位置",
          nvrName: "关联录像机",
          nvrChannel: "录像机通道",
          createUserName: "创建人",
          createTime: "创建时间",
          updateUserName: "更新人",
          updateTime: "更新时间"
        }
        const _this = this
        // 查询数据
        getAll(this.searchForm).then(res => {
          const dataList = res.data
          // 字典值替换
          for (const item of dataList) {
            const dict1 = _this.roomAcVersionList.find(d => d.dictKey === item.version + '')
            item.version = dict1 ? dict1.dictValue : item.version
            const dict2 = _this.roomAcBrandList.find(d => d.dictKey === item.brand + '')
            item.brand = dict2 ? dict2.dictValue : item.brand
          }
          // 导出数据
          exportData(dataList, columns, '机房门禁信息 ')
        })
      },
      getRoom(){
        getById(this.searchId).then(res => {
          this.roomData = res.data
          this.roomDescription = this.roomData.companyName + ' / ' + this.roomData.name
        })
      },
      refreshData(){
        this.getList()
      },
      //加载字典
      getDictList(code){
        getDictList(code).then(res => {
          if(code==='info_room_ac_version'){
            this.roomAcVersionList = res.data
          }else if(code==='info_room_ac_brand'){
            this.roomAcBrandList = res.data
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
        this.searchForm.ip = undefined;
        this.searchForm.brand = undefined;
        this.searchForm.pageNumber = 1
        this.searchForm.pageSize = 10
        this.getList();
      },
      // 设置表格高度
      setTableHeight() {
        let bodyBox = document.getElementsByClassName('page_body');
        this.tableHeight = (bodyBox[0].offsetHeight - 100) + 'px'
      },
      getList() {
        this.searchForm.roomId = this.searchId
        this.tableLoading = true;
        getByPage(this.searchForm).then(res => {
          this.tableData = res.data.records;
          this.total = res.data.total;
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
      handleAdd() {
        this.workOrderParams.type = 'add';
        this.workOrderParams.isShow = true;
        this.workOrderParams.formDetial = {
          roomId: this.searchId
        };
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
      },
      returnTab() {
        this.$router.push({path: '/xcnanr/authManage/authConfiguration/index',query:{tab:'RoomAccessControl'}})
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
</style>
