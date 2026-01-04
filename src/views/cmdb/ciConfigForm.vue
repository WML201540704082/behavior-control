<template>
  <div style="height:100%">
    <div class="config_top">
      <div class="detail_top_left">
        <el-button-group>
          <el-button type="primary" size="small" @click="$emit('quitConfig')" icon="el-icon-arrow-left">模 型 详 情</el-button>
          <el-button type="primary" size="small" @click="siderControl" icon="tsfont-bar"></el-button>
        </el-button-group>
      </div>
      <div class="detail_top_right">
        <el-button-group>
          <el-button type="primary" size="small" @click="$emit('quitConfig')" icon="el-icon-edit">编 辑 模 型</el-button>
          <el-button 
            v-if="!ciDetailData.isVirtual && !ciDetailData.isAbstract && ciDetailData.authData['cientityinsert']"
            type="primary" 
            size="small" 
            icon="el-icon-plus"
            @click="addConfig"
          >配 置 项</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="config_content xt-layout">
      <!-- 侧边栏 -->
      <div :class="showSider? 'xt-layout-has-sider':'xt-layout-none-sider'">
        <ciTypeList :ciId="ciId" @clickCiTree="clickCiTree"></ciTypeList>
      </div>
      <!-- 内容 -->
      <div class="xt-layout-content" style="padding: 15px 0px 0px 20px">
        <el-scrollbar style="height:100%">
          <div class="ci_baic_info config_ci_info">
            <div class="ci_icon text-default">
              <i class="ci_icon" :class="ciDetailData.icon"></i>
            </div>
            <div class="ci_detail">
              <div style="font-size: 15px">
                <span>{{ciDetailData.label}}</span>
                <span class="text-grey">({{ciDetailData.name}})</span>
              </div>
              <div class="text-grey" style="font-size: 13px">
                {{ ciDetailData.id }}
              </div>
              <div class="text-grey" style="font-size: 13px">
                {{ciDetailData.isAbstract === 1? '抽象模型':''}}
              </div>

            </div>

            <el-button 
              type="primary" 
              size="small" 
              icon="el-icon-download"
              @click="handleExport"  
              style="margin-bottom: 5px;position: absolute;right: 0;bottom: -55px;z-index: 111;"
            >导出</el-button>
          </div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="配置项列表" :name="0">
              <xtTable
                :tableData="configTableData"
                :colList="configTableCol"
                :needAction="true"
                :tableLoading="tableLoading"
                :tableHeight="tableHeight"
                :actionWidth="'280px'"> 
                <template v-slot:action="scope">
                  <div class="btnRow">
                    <el-button type="primary" size="mini" @click="detailConfig(scope.scopeData.row)">详情</el-button>
                    <el-button type="primary" size="mini" @click="editConfig(scope.scopeData.row)">编 辑</el-button>
                    <el-button type="danger" size="mini" @click="delConfig(scope.scopeData.row)">删 除</el-button>
                    <el-button type="primary" size="mini" @click="handleLog(scope.scopeData.row)">日 志</el-button>
                  </div>
                </template>
              </xtTable>
              <pagination
              :total="total"
              :page.sync="searchForm.currentPage"
              :limit.sync="searchForm.pageSize"
              @pagination="getConfigList"/>
            </el-tab-pane>
            <!-- <el-tab-pane label="未提交事务" :name="1">
              
            </el-tab-pane> -->
            <!-- <el-tab-pane label="删除记录" :name="2">
              <el-table
                ref="arrtTable"
                :data="arrtList"
                stripe
                size="small"
                v-loading="tableLoading"
              >
                <el-table-column label="事务id" prop="name" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="事务id" prop="name" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="事务id" prop="name" align="center" show-overflow-tooltip></el-table-column>
              </el-table>
            </el-tab-pane> -->
          </el-tabs>
        </el-scrollbar>
      </div>
    </div>

    
    <!-- 日志 -->
    <configLog
      v-if="showLog"
      :isShow="showLog"
      :configId="configId"
      @close="showLog = false"
    ></configLog>
    
    <!-- 删除确认 -->
    <configDelForm
      v-if="showDelForm"
      :isShow="showDelForm"
      :configId="configId"
      @close="showDelForm = false"
      @submitDelConfig="submitDelConfig"
    ></configDelForm>

    <!-- 新增配置项目 -->
    <configSubmitForm
      v-if="showSubmitForm"
      :isShow="showSubmitForm"
      :configId="configId"
      :ciId="ciId"
      :showType="showType"
      @close="showSubmitForm = false"
      @saveConfigItem="saveConfigItem"
    ></configSubmitForm>

    <!-- 导出 -->
    <cientityList
      v-if="showForm"
      :isShow="showForm"
      :ciId="ciId"
      @close="showForm = false"
    ></cientityList>
  </div>
</template>

<script>
import { ciDetail } from "@/api/system/ciModel";
import { ciConfigList } from "@/api/cmdb/ciConfig";
import configLog from './components/configFormComponent/configLog'
import configDelForm from './components/configFormComponent/configDelForm'
import configSubmitForm from './components/configFormComponent/configSubmitForm'
import cientityList from './components/configFormComponent/cientityList'
import ciTypeList from './components/modelManageComponent/ciTypeList';

export default {
  components: { configLog, configDelForm, configSubmitForm, ciTypeList, cientityList },
  props: ['ciId'],
  data() {
    return{
      showForm: false,

      searchForm: {
        ciId: this.ciId,
        currentPage: 1,
        pageSize: 20,
        needAction: false,
        needActionType: false,
      },
      total: 0,
      showSider: true,
      activeName: 0,
      ciDetailData: {
        authData: {}
      }, //模型详情
      tableConfig: {
        ref: 'configTable',
        size: 'small',
        needSelect: true,
        tableData: [],
        colList: [],
      },
      configTableData: [], //配置项列表
      configTableCol: [], //列表表头
      tableLoading: false, //表格加载
      tableHeight: undefined,

      // 弹窗
      showLog: false,
      showDelForm: false,
      showSubmitForm: false,
      showType: '',
      configId: ''
    }
  },
  mounted() {
    setTimeout(() => {
      this.setPageContentHeight('config_top', 'config_content')
    }, 500)
    setTimeout(() => {
      this.setTabelHeight()
    }, 1000)
    this.getDetail(this.ciId)
    this.getConfigList()
  },
  methods: {
    handleExport(){
      this.showForm = true
    },
    setTabelHeight() {
      let contentBox = document.getElementsByClassName('config_content')
      let ciBaicInfoBox = document.getElementsByClassName('config_ci_info')
      this.tableHeight = contentBox[0].offsetHeight - ciBaicInfoBox[0].offsetHeight - 15 - 15 - 40 - 15 - 47 + 'px'  
    },
    async getDetail(id) {
      this.pageLoading = true
      await ciDetail({id: id, needAction: true}).then(res => {
        this.ciDetailData = res.Return
      })
    },
    getConfigList() {
      this.tableLoading = true
      ciConfigList(this.searchForm).then(res => {
        this.configTableCol = res.theadList
        this.configTableData = res.tbodyList
        this.total = res.rowNum
        this.tableLoading = false
      })
    },
    // 侧边栏缩放
    siderControl() {
      this.showSider = !this.showSider
    },
    // 日志
    handleLog(row){
      this.showLog = true
      this.configId = row.id
    },
    // 编辑配置项
    editConfig(row) {
      this.showType = '修改'
      this.configId = row.id
      this.showSubmitForm = true
    },
    detailConfig(row) {
      this.showType = '详情'
      this.configId = row.id
      this.showSubmitForm = true
    },
    // 删除配置项
    delConfig(row) {
      this.showDelForm = true
      this.configId = row.id
    },
    // 删除成功回调
    submitDelConfig() {
      this.showDelForm = false
      this.getConfigList()
    },
    // 新增配置项
    addConfig() {
      this.showSubmitForm = true
      this.showType = '新增'
    },
    async clickCiTree(val) {
      await this.getDetail(val.id)
      this.searchForm.ciId = val.id
      this.getConfigList()
      this.$nextTick(() => {
        this.setTabelHeight()
      })
      this.$emit("update:ciId", this.ciId = val.id)
    },
    // 配置项新增回调
    saveConfigItem() {
      this.showSubmitForm = false
      this.getConfigList()
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .btnRow .el-button{
  padding: 9px 10px !important;
}

.config_top{
  min-width: 750px;
  width: 100%;
  display: flex;
  justify-content: space-between
}
.config_content{
  // border: 1px solid red
}
.ci_baic_info{
  position: relative;
  display: grid;
  grid-template-columns: 60px auto;
  grid-gap: 0px;
  margin-bottom: 15px;
  .ci_icon{
    align-self: center;
    justify-self: center;
    font-size: 25px; 
  }
}

</style>
