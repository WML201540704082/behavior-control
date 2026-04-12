<template>
  <div class="list-container modelEditor" style="padding: 10px 0px 10px 20px;">
    <div class="list-box">

      <div class="table-box">
        <div class="table-filter flex">
          <el-input
            size="mini"
            v-model="listQuery.modelName"
            style="width: 200px;"
            :placeholder="$hussarT('hussar-modelEdit.processName')"
            type="text"
            clearable
            class="search-input"/>
            <el-button
              size="mini"
              type="primary"
              style="margin-left: 10px;"
              @click="queryModel(true)">{{ $hussarT('hussar-common.search') }}</el-button>
            <el-button
              size="mini"
              @click="clearData()">{{ $hussarT('hussar-common.reset') }}</el-button>
        </div>

        <div class="table-wrap" style="margin-top: 10px;">
          <el-table
            v-loading="listLoading"
            ref="tableRow"
            :data="list"
            :row-key="(row)=>{ return row.modelId}"
            :element-loading-text="$hussarT('hussar-common.loading')"
            tooltip-effect="light"
            height="calc(100vh - 200px)"
            fit
            stripe
            class="lcdp-table"
            @selection-change="changeFun"
            @select-all="selectAll"
          >
            <el-table-column
              type="selection"
              align="center"
              width="50" />
            <el-table-column
              :label="$hussarT('hussar-common.no')"
              :index="indexMethod"
              type="index"
              width="80"
              align="center" />
            <el-table-column :label="$hussarT('hussar-modelEdit.processKey')">
              <template slot-scope="scope">
                {{ scope.row.processKey }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-modelEdit.processName')"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-modelEdit.processDescribe')"
              :formatter="descriptionFormat"
              :show-overflow-tooltip="true"/>
            <el-table-column
              :label="$hussarT('hussar-modelEdit.create')"
              align="center">
              <template slot-scope="scope">
                {{ scope.row.createTime === null ? "-" : scope.row.createTime.substr(0,19) }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-modelEdit.editTime')"
              align="center">
              <template slot-scope="scope">
                {{ scope.row.lastEditTime === null ? "-" : scope.row.lastEditTime.substr(0,19) }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-common.operation')"
              width="220"
              align="center">
              <template slot-scope="scope">
                <div class="btn-box flex flex-center">
                  <div
                    class="btn-text"
                    @click="showBpm(scope.row)">{{ $hussarT('hussar-modelEdit.look') }}</div>

                  <div
                    class="btn-text"
                    @click="versionManagement(scope.row.processKey)">{{ $hussarT('hussar-modelEdit.versionMana') }}</div>

                  <div
                    class="btn-text"
                    @click="deleteModel(scope.row)">{{ $hussarT('hussar-common.delete') }}</div>

                </div>

              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="margin-top: 10px;text-align: right;"
            :current-page.sync="page.currentPage"
            :page-size="listQuery.size"
            :total="total"
            :page-sizes="[10, 20, 30, 50]"
            :pager-count="pageCount"
            layout="total, sizes, prev, pager, next"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="showPicFlag"
               width="1200px"
               title="流程图">
      <flowfile
        :processInsId="showPicProcessInstanceId"
        :processKey="showPicProcessKey"
        :showHistory="false"
        class="workflow"
        @close="close" />
    </el-dialog>
    <el-dialog :visible.sync="showVersions"
               width="1200px"
               title="版本管理">
      <VersionManage :mykey="mykey"></VersionManage>
    </el-dialog>
  </div>
</template>
<script>
import { ModelApi } from "@/api/workflow/modeling/modelApi";
import hussarRequest from '@/views/workflow/util/request'
import  flowfile  from '../components/flowFile/flowfile';
import VersionManage from '../components/VersionMange'

export default {
  name: 'modeling',
  components: {
    flowfile,
    VersionManage
  }, // 流程管理页面
  data() {
    return {
      url: window.baseUrl,
      showPicFlag: false,
      showVersions:false,
      showPicProcessInstanceId: '',
      showPicProcessKey: null,
      // 查询条件
      listQuery: {
        modelName: '',
        page: 1,
        size: 10
      },
      uploadUrl: '/model/modelImport',
      address: '',
      // 列表数据
      list: [],
      listLoading: false,
      // 列表选择的数据集合
      checkBoxData: [],
      // 总页数
      total: 0,
      mykey:'',
      pageCount: 7,
      // 分页参数
      page: { currentPage: 1, size: 10, sizes: [10, 20, 50, 100] }
    };
  },
  mounted() {
    this.queryModel();
  },
  methods: {
    // 工作流查看
    showBpm(data) {
      this.showPicFlag = true;
      this.showPicProcessInstanceId = data.processKey;
      this.showPicProcessKey = data.processKey;
    },
    close() {
      this.showPicFlag = false;
    },
    // 设置序号
    indexMethod(index) {
      const curpage = this.page.currentPage;
      const limitpage = this.listQuery.size;
      return (index + 1) + (curpage - 1) * limitpage;
    },
    // 查询列表的数据
    queryModel(isReset) {
      if(isReset){
        this.listQuery.page = 1;
        this.page.currentPage = 1;
      }
      this.listLoading = true;
      this.listQuery.current = this.listQuery.page;
      hussarRequest.get(ModelApi.list, this.listQuery).then(res => {
        if (res.code === 10000) {
          this.listLoading = false;
          this.list = res.data.records;
          this.total = res.data.total;
        } else {
          this.listLoading = false;
        }
      }).catch(res => {
        this.listLoading = false;
      });
    },

    // 删除
    deleteModel(row) {

      let modelId = row.modelId;
      let name = row.name;
      const msg =   '此操作将删除<span class="msg-highlight">"' +  name + '"</span>，删除的数据无法恢复'

      this.$confirm(msg, this.$hussarT('hussar-common.confirmedToDeleteNew'), {
        confirmButtonText: this.$hussarT('hussar-common.delete'),
        cancelButtonText: this.$hussarT('hussar-common.cancel'),
        cancelButtonClass:'dialog-cancel',
        confirmButtonClass:'dialog-delete',
        closeOnClickModal: false,
        dangerouslyUseHTMLString: true,
        showClose:false,
        customClass: 'lcdp-message',
        type: 'warning'
      }).then(res => {
        hussarRequest.post(ModelApi.delete, modelId + '').then(res => {
          if (res.code === 10000) {
            this.$message.success(this.$hussarT('hussar-modeling.deleteSuccess'));
            this.queryModel();
          }
        }).catch(res => {

        });
      });
    },
    // 发布
    deployModel(modelId) {
      const data = {
        modelId: modelId
      };
      // document.body.classList.add("modal-parent");
      this.$confirm(this.$hussarT('hussar-modelEdit.sureRelease'), this.$hussarT('hussar-common.notice'), {
        confirmButtonText: this.$hussarT('hussar-common.confirm'),
        cancelButtonText: this.$hussarT('hussar-common.cancel'),
        cancelButtonClass: 'dialog-cancel',
        confirmButtonClass: 'dialog-save',
        closeOnClickModal: false,
        customClass: 'lcdp-message',
        showClose: false,
        type: 'warning'
      }).then(res => {
        hussarRequest.get(ModelApi.deployModel, data).then(res => {
          if (res.code === 10000) {
            this.$message.success(this.$hussarT('hussar-modelEdit.relSuccess'));
            this.queryModel();
          }
        }).catch(res => {

        });
      });
    },
    // 版本管理
    versionManagement(mykey) {
       this.mykey = mykey;
      this.showVersions = true;
    },
    // 重置按钮
    clearData() {
      this.listQuery.modelName = '';
      this.queryModel(true);
    },
    // 描述
    descriptionFormat(row) {
      // eslint-disable-next-line no-undef
      return JSON.parse(row.description).description;
    },
    // 选择列表数据
    changeFun(val) {
      this.checkBoxData = val;
    },
    selectAll(){
      if(this.list.length==0){this.$refs.tableRow.clearSelection()}
            },
    // 每页条数改变
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.listQuery.size = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.listQuery.page = 1;
      this.queryModel();
    },
    // 页码切换
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryModel();
    }
  }
};
</script>
<style lang="scss" scoped>
  .btn-text{
    cursor:pointer;
    display: inline-block;
    margin: 0 10px;
    color: #0d8eff;
  }
  .dropdown-span {
    display: block;
    width: calc(100% + 40px);
    height: 100%;
    margin-left: -20px;
    padding-left: 20px;
  }
  .container-box .el-dialog__wrapper .input {
    width: 224px;
  }
  /*.el-dropdown {*/
  /*  margin-left: 8px;*/
  /*}*/
  .el-dialog__body_box ::v-deep .el-upload{width: 100%; height: 100%}
  ::v-deep.el-upload-dragger{margin: 0 auto;width: 100%;height: 100%; min-height: 182px; border-radius: 2px;background: #fafcfe;}
  .el-dialog__body_box ::v-deep.el-dialog__body{padding: 32px 32px 35px; height: calc(100% - 70px)}
  .el-dialog__body_box ::v-deep.el-dialog__body .upload-demo{height: 100%}
  ::v-deep.el-upload-dragger .el-icon-upload{margin: 56px 0 8px;font-size: 56px;color: #69BCFF}
  ::v-deep.el-upload-dragger .el-upload__text{color: #878787}
</style>
<style lang="scss" scoped>
  ::v-deep.el-dialog_import .el-dialog {
    height: 34%;
  }
  ::v-deep.el-dialog_import .el-dialog__body {
    padding: 30px 40px;
  }
  ::v-deep.el-dialog_import .el-upload, .el-dialog_import .el-upload-dragger {
    width: 100%;
  }
  ::v-deep.el-dialog_import .el-upload-dragger {
    height: 200px;
  }
  ::v-deep.el-dialog_import .el-icon-upload {
    margin-top: 50px;
  }
  ::v-deep.list-container .el-dialog__body {
    text-align: center!important;
  }
</style>

