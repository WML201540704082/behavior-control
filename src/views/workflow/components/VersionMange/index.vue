<!--版本管理-->
<template>
  <div class="list-container">
    <div class="list-box">
      <div class="table-box">
        <div
          class="table-wrap"
          style="height: 100%">
          <el-table
            v-loading="listLoading"
            ref="tableRow"
            :data="list"
            :row-key="(row)=>{ return row.deploymentId}"
            :element-loading-text="$hussarT('hussar-common.loading')"
            height="calc(100vh - 450px)"
            fit
            class="lcdp-table"
          >
            <el-table-column
              :label="$hussarT('hussar-common.no')"
              :index="indexMethod"
              type="index"
              width="80"
              align="center" />
            <el-table-column :label="$hussarT('hussar-modeling.processName')">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column :label="$hussarT('hussar-modeling.version')">
              <template slot-scope="scope">
                {{ scope.row.version === null ? "-" : scope.row.version }}
              </template>
            </el-table-column>
            <el-table-column :label="$hussarT('hussar-modeling.releaseTime')">
              <template slot-scope="scope">
                {{ scope.row.startTime.substr(0,19) }}
              </template>
            </el-table-column>
            <el-table-column :label="$hussarT('hussar-modeling.whetherMain')">
              <template slot-scope="scope">
                {{ scope.row.main == 1 ? $hussarT('hussar-common.yes') : $hussarT('hussar-common.no1') }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-common.operation')"
              width="260"
              align="center">
              <template slot-scope="scope">
                <div class="btn-box flex flex-center">
                  <div
                    v-if="scope.row.main == '1'"
                    class="btn-text"
                    @click="cancelThisMain(scope.row.id)">{{ $hussarT('hussar-modeling.cancelMain') }}</div>
                  <div
                    v-if="scope.row.main != '1'"
                    class="btn-text"
                    @click="setThisMain(scope.row.id)">{{ $hussarT('hussar-modeling.setMain') }}</div>

                  <!--                  <div @click="downloadFiles(scope.row.deploymentId,scope.row.resourceName,scope.row.name)" class="btn-text">{{ $hussarT('hussar-common.export') }}</div>
                  <div class="line"></div>-->
                  <div
                    class="btn-text"
                    @click="showBpm(scope.row)">{{ $hussarT('hussar-modeling.look') }}</div>

                  <div
                    class="btn-text"
                    @click="deleteModelWithVersion(scope.row.id)">{{ $hussarT('hussar-common.delete') }}</div>
                </div>

              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page.sync="page.currentPage"
            :page-sizes="page.sizes"
            :page-size="listQuery.size"
            :total="total"
            background
            :pager-count="pageCount"
            style="text-align: right;margin-top: 10px;"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="showPicFlag"
               width="1200px"
               z-index="20000"
               :modal="false"
               title="流程图">
      <flowfile
        :processInsId="showPicProcessInstanceId"
        :processKey="showPicProcessKey"
        class="workflow"
        :show-history="false"
        @close="close" />
    </el-dialog>

  </div>
</template>
<script>
import { DefinitionApi } from "@/api/workflow/modeling/definitionApi";
import hussarRequest from '@/views/workflow/util/request'

import  flowfile  from '../flowFile/flowfile';
export default {
  name: 'Definition',
  components: {
    flowfile
  }, // 版本管理页面
  props:{
    mykey:{
      type:String
    }
  },
  data() {
    return {
      showPicFlag: false,
      showPicProcessInstanceId: '',
      showPicProcessKey: '',
      // 查询条件
      listQuery: {
        definitionKey: this.mykey,
        page: 1,
        size: 10
      },
      setMain: {
        processKey: this.mykey,
        id: ''
      },
      // 列表数据
      list: [],
      listLoading: false,
      // 列表选择的数据集合
      checkBoxData: [],
      // 总页数
      total: 0,
      pageCount: 7,
      // 分页参数
      page: { currentPage: 1, size: 10, sizes: [10, 20, 50, 100] }
    };
  },
  watch:{
    mykey(){
      this.listQuery.definitionKey = this.mykey;
      this.setMain.processKey = this.mykey;
      this.queryDefinition();
    }
  },
  mounted() {
    this.queryDefinition();
  },
  methods: {
    deleteModelWithVersion(id) {
      hussarRequest.post(DefinitionApi.delete, id).then(res => {
        if (res.code === 10000) {
          this.$message.success(this.$hussarT('hussar-modeling.deleteSuccess'));
          this.queryDefinition();
        }
      }).catch(res => {
      });
    },
    // 设置序号
    indexMethod(index) {
      const curpage = this.page.currentPage;
      const limitpage = this.listQuery.size;
      return (index + 1) + (curpage - 1) * limitpage;
    },
    // 设置为主版本
    setThisMain(id) {
      this.setMain.id = id;
      hussarRequest.get(DefinitionApi.setMain, this.setMain).then(res => {
        if (res.code === 10000) {
          this.$message.success(this.$hussarT('hussar-modelEdit.setSu'));
          this.queryDefinition();
        } else if (res.code === 30004) {
          this.$message.error(this.$hussarT('hussar-modelEdit.notFind'));
        }
      }).catch(res => {
        
      });
    },
    // 取消主版本
    cancelThisMain(id) {
      this.setMain.id = id;
      hussarRequest.get(DefinitionApi.cancelMain, this.setMain).then(res => {
        if (res.code === 10000) {
          this.$message.success(this.$hussarT('hussar-common.changedSuccessful'));
          this.queryDefinition();
        } else if (res.code === 30004) {
          this.$message.error(this.$hussarT('hussar-modelEdit.notFind'));
        }
      }).catch(res => {
        
      });
    },
    // 工作流查看
    showBpm(data) {
      this.showPicFlag = true;
      this.showPicProcessInstanceId = data.id;
      this.showPicProcessKey = this.mykey;
    },
    close() {
      this.showPicFlag = false;
    },
    // 查询列表的数据
    queryDefinition() {
      this.listLoading = true;
      this.listQuery.current = this.listQuery.page;
      hussarRequest.get(DefinitionApi.list, this.listQuery).then(res => {
        if (res.code === 10000) {
          this.listLoading = false;
          this.list = res.data.records;
          this.total = res.data.total;
        }
      }).catch(res => {
        this.listLoading = false;
      });
    },
    // 下载文件
    downloadFiles(deploymentId, resourceName, name) {
      const data = {
        'deploymentId': deploymentId,
        'resourceName': resourceName
      };
      hussarAxiosRequestUtils.downFile(DefinitionApi.downloadFiles, data).then(res => {
        const content = res;
        const blob = new Blob([content]);
        const fileName = name + '.zip';
        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        }
      }).catch(res => {
        this.$message.error(this.$hussarT('hussar-modeling.exportError'));
      });
    },
    // 每页条数改变
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.listQuery.size = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.listQuery.page = 1;
      this.queryDefinition();
    },
    // 页码切换
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryDefinition();
    }
  }
};
</script>
<style scoped>
  .btn-text{
    cursor:pointer;
    display: inline-block;
    margin: 0 10px;
    color: #0d8eff;
  }
  .container-box .el-dialog__wrapper .input {
    width: 224px;
  }
  .table-box {
    padding: 10px 24px 16px 24px;
    margin-top: 0;
    height: calc(100% - 45px);
  }
</style>
