<template>
  <basic-container>
    <div class="model_top page_form">
      <div class="model_top_left">
        <el-button-group>
          <el-button type="primary" size="small" @click="addCi" icon="el-icon-plus">模 型</el-button>
          <el-button type="primary" size="small" @click="importModel" icon="el-icon-upload">导 入 模 型</el-button>
          <el-button type="primary" size="small" @click="exportModel" icon="el-icon-download">导 出 模 型</el-button>
          <el-button type="primary" size="small" @click="showLevel = true" icon="el-icon-plus">层 级</el-button>
          <el-button type="primary" size="small" @click="showLevelManage = true" icon="el-icon-edit">层 级</el-button>
          <el-button type="primary" size="small" @click="addModel" icon="el-icon-view">
            {{ showTopo ? '隐 藏 拓 扑' : '显 示 拓 扑' }}
          </el-button>
        </el-button-group>
      </div>

      <el-row class="model_top_right">
        <!-- <el-col :span="7">
          <el-radio-group v-model="modeShowType" size="small">
            <el-radio-button label="card"><i class="el-icon-s-grid"></i></el-radio-button>
            <el-radio-button label="table"><i class="el-icon-s-unfold"></i></el-radio-button>
          </el-radio-group>
        </el-col> -->
        <el-col :span="17">
          <el-input style="width:250px" placeholder="请输入内容" v-model="searchText" size="medium"
                    class="input-with-select">
            <el-button slot="append" size="small" icon="el-icon-search" @click="searchCi"></el-button>
            <!-- <el-popover
              slot="append"
              placement="bottom"
              title="标题"
              width="200"
              trigger="click"
            >
              <el-button slot="reference" size="small" icon="el-icon-setting"></el-button>
            </el-popover> -->
          </el-input>
        </el-col>
      </el-row>

    </div>
    <div class="model_content page_body" v-loading="pageLoading">
      <el-scrollbar v-if="modeShowType === 'card'" style="height:100%">
        <div
          class="level_box"
          v-for="item in modelList"
          :key="item.id"
        >
          <div class="level_name text-grey">
            <i class="tsfont-formstaticlist" v-if="item.isMenu === 1"></i>
            {{ item.name }}
          </div>
          <el-row :gutter="50" class="model_list">
            <el-col
              :span="6"
              style="margin-bottom: 20px"
              v-for="(it, index) in item.ciList"
              :key="index"
            >
              <div class="model_card" @click="seeCiDetail(it)">
                <i class="icon" :class="it.icon + ' ' + getIconClass(it)"></i>
                <div class="ci_name">
                  <div>{{ it.label }}</div>
                  <div class="text-grey" style="margin-top:4px">{{ it.name }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-scrollbar>
    </div>

    <!-- 详情页面 -->
    <div ref="ciDetail" class="form_detail">
      <modelDetailForm
        v-if="showDetail"
        ref="modelDetailForm"
        :ciId="ciId"
        @quitDetail="backManage"
        @seeCiDetail="editCi"
        @delci="delci"
      ></modelDetailForm>
    </div>
    <!-- 模型弹窗 -->
    <modelForm
      v-if="showModel"
      :isShow="showModel"
      :showType="showType"
      :ciId="ciId"
      @close="showModel = false"
      @saveCi="saveCi"
    ></modelForm>
    <!-- 导入模型弹窗 -->
    <modelImportFom
      v-if="showModelImport"
      :isShow="showModelImport"
      :ciId="ciId"
      @close="showModelImport = false"
      @saveCi="saveModel"
    ></modelImportFom>
    <!-- 导出模型弹窗 -->
    <modelExportFom
      v-if="showModelExport"
      :isShow="showModelExport"
      :ciId="ciId"
      @close="showModelExport = false"
      @saveCi="saveExportModel"
    ></modelExportFom>

    <!-- 层级弹窗 -->
    <levelForm
      v-if="showLevel"
      :isShow="showLevel"
      @close="showLevel = false"
      @saveCitype="saveCitype"
    ></levelForm>

    <!-- 层级管理弹窗 -->
    <levelManage
      v-if="showLevelManage"
      :isShow="showLevelManage"
      @close="showLevelManage = false"
      @saveCitypeManage="saveCitype"
    ></levelManage>

  </basic-container>
</template>

<script>
import {citypesearch} from "@/api/system/ciModel";
import modelForm from './components/modelManageComponent/modelFom';
import modelImportFom from './components/modelManageComponent/modelImportFom';
import modelExportFom from './components/modelManageComponent/modelExportFom';
import levelForm from './components/modelManageComponent/levelForm';
import levelManage from './components/modelManageComponent/levelManage';
import modelDetailForm from './modelDetailForm';

export default {
  components: {
    modelForm,
    modelImportFom,
    modelExportFom,
    levelForm,
    levelManage,
    modelDetailForm,
  },
  data() {
    return {
      showTopo: false,
      modeShowType: "card",
      searchText: '',
      modelList: [],
      pageLoading: false,
      // 弹窗相关
      showModel: false,
      showModelImport: false,
      showModelExport: false,
      showLevel: false,
      showLevelManage: false,
      showDetail: false,
      ciId: '', //模型id
      showType: '',
    }
  },
  mounted() {
    this.setPageContentHeight()
    this.getModelList()
  },
  methods: {
    // 获得所有模型列表
    getModelList(params = {}) {
      this.pageLoading = true
      citypesearch(params).then(res => {
        this.modelList = res.Return
        this.pageLoading = false
      }).catch(err => {
        this.pageLoading = false
      })
    },
    // 设置图标颜色
    getIconClass(row) {
      if (row.isVirtual) {
        return 'text-grey';
      } else {
        if (!row.isAbstract) {
          return 'text_primary';
        } else {
          return 'text_default';
        }
      }
    },
    // 查看模型详情
    seeCiDetail(row) {
      this.$refs.ciDetail.style.width = 'calc(100% - 40px)'
      this.ciId = row.id
      // setTimeout(() => {
      //   this.showDetail = true
      // }, 500);
      this.showDetail = true

    },
    // 返回模型管理
    backManage() {
      this.$refs.ciDetail.style.width = '0px'
      this.$nextTick(() => {
        this.showDetail = false
      })
    },
    // 层级保存成功回调
    saveCitype() {
      this.showLevel = false
      this.showLevelManage = false
      this.getModelList()
    },
    // 模型保存回调
    saveCi() {
      this.showModel = false
      this.getModelList()
      if (this.$refs.modelDetailForm) {
        this.$refs.modelDetailForm.getDetail(this.ciId)
      }
    },
    // 模型删除回调
    delci() {
      this.$refs.ciDetail.style.width = '0px'
      this.showDetail = false
      this.getModelList()
    },
    // 新增模型
    addCi() {
      this.showModel = true
      this.showType = '新增'
    },
    // 编辑模型
    editCi(val) {
      this.ciId = val
      this.showModel = true
      this.showType = '修改'
    },

    // 导入模型保存回调
    saveModel() {
      this.showModelImport = false
      this.getModelList()
      if (this.$refs.modelDetailForm) {
        this.$refs.modelDetailForm.getDetail(this.ciId)
      }
    },
    // 导入模型
    importModel() {
      this.showModelImport = true
    },
    // 导出模型保存回调
    saveExportModel() {
      this.showModelExport = false
      this.getModelList()
      if (this.$refs.modelDetailForm) {
        this.$refs.modelDetailForm.getDetail(this.ciId)
      }
    },
    // 导出模型
    exportModel() {
      this.showModelExport = true
    },
    // 搜索模型
    searchCi() {
      this.getModelList({keyword: this.searchText})
    }
  }
}
</script>

<style lang="scss" scoped>
.model_top {
  display: flex;
  justify-content: space-between;

  &_right {
    display: flex
  }
}

.el-col-6 {
  height: 100% !important;
}

.model_content {
  .level_box {
    .level_name {
      font-size: 14px;
      margin-bottom: 5px
    }
  }

  .model_card {
    background-color: #edeef3;
    min-height: 60px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 5px;
    padding: 10px;
    display: flex;
    cursor: pointer;
    align-items: center;

    .icon {
      font-size: 24px;
      margin-right: 20px;
    }

    .ci_name {
      font-size: 14px;
    }
  }
}

.form_detail {
  // width: calc(100% - 40px);
  width: 0px;
  height: calc(100% - 20px);
  position: absolute;
  top: 20px;
  left: 20px;
  transition: all 0.5s;
  background: #fff;
  overflow: hidden;
}
</style>
