<template>
  <div style="height:100%;position: relative;">
    <div class="detail_top">
      <div class="detail_top_left">
        <el-button-group>
          <el-button type="primary" size="small" @click="$emit('quitDetail')" icon="el-icon-arrow-left">模 型 管 理</el-button>
          <el-button type="primary" size="small" @click="siderControl" icon="tsfont-bar"></el-button>
        </el-button-group>
      </div>
      <div class="detail_top_right">
        <el-button-group>
          <el-button type="primary" size="small" @click="$emit('seeCiDetail', ciId)" icon="el-icon-edit">基 本 信 息</el-button>
          <el-button v-if="!ciDetailData.isVirtual" type="primary" size="small" @click="()=>{showArrtForm = true; showArrtType='新增'}" icon="el-icon-plus">属 性</el-button>
          <el-button v-if="!ciDetailData.isVirtual" type="primary" size="small" @click="()=>{showRel = true}" icon="el-icon-plus">关 系</el-button>
          <el-dropdown @command="commandDrop">
            <span class="el-dropdown-link">
              <el-button type="primary" size="small" icon="el-icon-more-outline">更 多 配 置</el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="!ciDetailData.isVirtual" command="export">导 出 模 型</el-dropdown-item>
              <el-dropdown-item v-if="!ciDetailData.isVirtual" command="view">模型属性配置管理</el-dropdown-item>
              <el-dropdown-item v-if="ciDetailData.isVirtual" command="view">显 示 设 置</el-dropdown-item>
              <!-- <el-dropdown-item v-if="!ciDetailData.isVirtual" command="auth">授 权</el-dropdown-item> -->
              <!-- <el-dropdown-item v-if="!ciDetailData.isVirtual" command="check">合 规 检 查</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" size="small" @click="seeConfig" icon="el-icon-document">查 看 配 置 项</el-button>
        </el-button-group>
        <el-button type="danger" size="small" @click="delCi" icon="el-icon-delete">删 除</el-button>
      </div>
    </div>
    <div class="detail_content xt-layout">
      <!-- 侧边栏 -->
      <div :class="showSider? 'xt-layout-has-sider':'xt-layout-none-sider'" style="border-right: 1px solid #dcdcdc">
        <ciTypeList :ciId="ciId" @clickCiTree="clickCiTree"></ciTypeList>
      </div>

      <!-- 内容 -->
      <div class="xt-layout-content" style="padding: 15px 0px 0px 20px">
        <el-scrollbar style="height:100%">
          <div class="ci_baic_info">
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
                <span v-if="ciDetailData.parentCiId">
                  继承自 <span class="text_primary" style="cursor: pointer;" @click="seeParentCi(ciDetailData.parentCiId)">{{ ciDetailData.parentCiLabel }}</span>
                </span>
              </div>

            </div>
          </div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="属性" :name="0">
              <el-table
                ref="arrtTable"
                :data="arrtList"
                stripe
                size="small"
                v-loading="tableLoading"
              >
                <el-table-column type="index" align="center" label="序号"></el-table-column>
                <el-table-column label="唯一标识" prop="name" align="center" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <a v-if="row.isExtended === 0" href="#" class="text_primary" @click="editArrt(row)">{{row.name}}</a>
                    <span v-else>{{row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="名称" prop="label" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="类型" prop="typeText" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="继承自" prop="ciLabel" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.isExtended === 1">{{ scope.row.ciLabel }}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否必填" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span :class="scope.row.isRequired === 1? 'text-success': 'text-grey'">
                      {{ scope.row.isActive === 1? '是':'否' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="是否唯一" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span :class="scope.row.isUnique === 1? 'text-success': 'text-grey'">
                      {{ scope.row.isUnique === 1? '是':'否' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="自动采集" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span :class="scope.row.inputType === 'at'? 'text-success': 'text-grey'">
                      {{ scope.row.inputType === 'at'? '是':'否' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="校验" prop="validatorName" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="分组" prop="groupName" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                  <template slot-scope="{ row }">
                    <el-button v-if="!row.isPrivate && !row.isExtended" size="mini" type="danger" @click="delArrt(row)">删 除</el-button>
                  </template>
                  
                </el-table-column>
              </el-table>
              
              <div style="margin-top:10px;">
                <el-form label-position="top" size="mini">
                  <el-form-item label-width="100px">
                    <div slot="label">
                      名 称 属 性
                      <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        content="名称用于拓扑展示和关系展示">
                        <i slot="reference" class="el-icon-info"></i>
                      </el-popover>
                    </div>
                    <el-radio-group v-model="ciDetailData.nameAttrId" @change="changeRadio">
                      <el-radio 
                        v-for="item in arrtList"
                        :key="item.id"
                        :label="item.id"
                        class="marginBto20"
                      >{{ item.label }}</el-radio>
                      
                    </el-radio-group>
                    <el-alert
                      v-if="!ciDetailData.nameAttrId || ciDetailData.nameAttrId == ''"
                      title="请选择一个属性作为配置项的名称。"
                      type="error">
                    </el-alert>
                  </el-form-item>
                  <el-form-item label-width="100px">
                    <div slot="label">
                      唯 一 规 则
                      <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        content="选择多个属性作为配置项的唯一性校验">
                        <i slot="reference" class="el-icon-info"></i>
                      </el-popover>
                    </div>
                    <el-checkbox-group v-model="ciDetailData.uniqueAttrIdList" @change="changeCheckbox">
                      <el-checkbox 
                        v-for="item in arrtList"
                        :key="item.id"
                        :label="item.id"
                      >{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-form>
                
              </div>
            </el-tab-pane>
            <el-tab-pane label="全局属性" v-if="globalArrtList.length > 0" :name="1">
              <el-table
                ref="arrtTable"
                :data="globalArrtList"
                stripe
                size="small"
              >
                <el-table-column type="index" align="center" label="序号"></el-table-column>
                <el-table-column label="唯一标识" prop="name" align="center" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="名称" prop="label" align="center" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="选项" prop="createTime" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-tag
                      v-for="item in scope.row.itemList" 
                      :key="item.id"
                      type="info" 
                      size="small"
                    >{{ item.value }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-scrollbar>
      </div>
    </div>

    <!-- 配置页面 -->
    <div ref="ciConfig" class="ci_config">
      <ciConfigForm
        v-if="showCiconfig"
        ref="modelDetailForm"
        :ciId="ciId"
        @quitConfig="backDetail"
      ></ciConfigForm>
    </div>

    <!-- 合规检查 -->
    <complianceCheck
      v-if="showComplianceCheck"
      :isShow="showComplianceCheck"
      :ciId="ciId"
      :arrtId="arrtId"
      @close="showComplianceCheck = false"
      @saveArrt="saveCompliance"
    ></complianceCheck>

    <!-- 新增属性 -->
    <arrtForm
      v-if="showArrtForm"
      :isShow="showArrtForm"
      :ciId="ciId"
      :arrtId="arrtId"
      :showType="showArrtType"
      @close="showArrtForm = false"
      @saveArrt="saveArrt"
    ></arrtForm>

    <!-- 新增关系 -->
    <relForm
      v-if="showRel"
      :isShow="showRel"
      :ciId="ciId"
      :arrtId="arrtId"
      @close="showRel = false"
      @saveArrt="saveRel"
    ></relForm>

    <!-- 显示、编辑设置 -->
    <arrtEidtList
      v-if="showArrtList"
      :isShow="showArrtList"
      :ciId="ciId"
      :isVirtual="ciDetailData.isVirtual"
      @close="showArrtList = false"
      @saveView="saveView"
    ></arrtEidtList>
  </div>
</template>

<script>
import { ciDetail, ciDel, cilistattr, savenameattr, ciuniqueSave, attrDelete } from "@/api/system/ciModel";
import { globalattrSearch } from "@/api/system/globalArrtManage";
import arrtForm from './components/modelManageComponent/arrtForm';
import relForm from './components/modelManageComponent/relForm';
import arrtEidtList from './components/modelManageComponent/arrtEidtList';
import ciConfigForm from './ciConfigForm'
import complianceCheck from './components/modelManageComponent/complianceCheck';
import ciTypeList from './components/modelManageComponent/ciTypeList';

export default {
  components: { arrtForm, relForm, arrtEidtList, complianceCheck, ciTypeList, ciConfigForm },
  props: ['ciId'],
  data() {
    return{
      showRel: false,

      ciDetailData: {
        uniqueAttrIdList: []
      },
      showSider: true,
      activeName: 0,
      arrtList: [],
      checkList: [],
      globalArrtList: [],
      // 弹窗
      showArrtForm: false,
      showArrtList: false,
      showCiconfig: false,
      arrtId: '',
      showArrtType: '',

      showComplianceCheck: false,
    }
  },
  mounted() {
    setTimeout(() => {
      this.setPageContentHeight('detail_top', 'detail_content')
    }, 500)
    this.getDetail(this.ciId)
  },
  methods: {
    getDetail(id) {
      this.pageLoading = true
      ciDetail({id: id, needAction: true}).then(res => {
        this.ciDetailData = res.Return
      })
      cilistattr({ciId: id}).then(res => {
        this.arrtList = res.Return
      })
      globalattrSearch({isisActive: 1}).then(res => {
        this.globalArrtList = res.Return.tbodyList
      })
    },
    // 侧边栏缩放
    siderControl() {
      this.showSider = !this.showSider
    },
    // 查看继承模型
    seeParentCi(id) {
      this.getDetail(id)
    },
    // 修改名称属性
    changeRadio(val) {
      let form = {
        ciId: this.ciId,
        attrId: val
      }
      savenameattr(form).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功！'
        });
      })
    },
    // 修改唯一规则
    changeCheckbox(val) {
      let form = {
        ciId: this.ciId,
        attrIdList: val
      }
      ciuniqueSave(form).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功！'
        });
      })
    },
    // 删除模型
    delCi() {
      this.$confirm('确定删除该模型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ciDel({id: this.ciId}).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.$emit('delci')
        })
      })
    },
    // 编辑属性
    editArrt(row) {
      this.showArrtForm = true
      this.showArrtType = '修改'
      this.arrtId = row.id
    },
    // 删除属性
    delArrt(row) {
      // return
      this.$confirm(`确定删除属性：${row.label}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        attrDelete({id: row.id}).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getDetail(this.ciId)
        })
      })
    },
    // 保存属性回调
    saveArrt() {
      this.showArrtForm = false
      this.getDetail(this.ciId)
    },
    // 保存关系
    saveRel() {
      this.showRel = false
      this.getDetail(this.ciId)
    },
    // 保存显示设置回调
    saveView() {
      this.showArrtList = false
      this.getDetail(this.ciId)
    },
    saveCompliance() {
      this.showComplianceCheck = false
      this.getDetail(this.ciId)
    },
    // 更多配置
    commandDrop(val) {
      if(val === 'view') {
        this.showArrtList = true
      }else if(val === 'check'){
        this.showComplianceCheck = true
      }else if(val == 'export'){
        let params = {
          ciId: this.ciId
        } 
        this.download(
          "/api/idevelop-cmdb/cmdb/ci/export",
          params,
          "导出模型.model"
        );
      }
    },
    // 查看配置项
    seeConfig() {
      this.$refs.ciConfig.style.width = '100%'
      this.showCiconfig = true
    },
    // 配置返回详情
    backDetail() {
      this.$refs.ciConfig.style.width = '0'
      this.showCiconfig = false
    },
    // 点击左侧树
    clickCiTree(val) {
      this.getDetail(val.id)
      this.$emit("update:ciId", this.ciId = val.id)
    },
    
  }
}
</script>

<style lang="scss" scoped>
.detail_top{
  min-width: 750px;
  width: 100%;
  display: flex;
  justify-content: space-between
}
.detail_content{
  // border: 1px solid red
}
.ci_baic_info{
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

.ci_config{
  width: 0px;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  transition: all 0.5s;
  background: #fff;
  overflow: hidden;
  z-index: 999;
}

</style>
