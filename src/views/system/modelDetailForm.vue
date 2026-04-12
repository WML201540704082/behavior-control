<template>
  <div style="height:100%">
    <div class="detail_top">
      <div class="detail_top_left">
        <el-button-group>
          <el-button type="primary" size="small" @click="$emit('quitDetail')" icon="el-icon-arrow-left">模 型 管 理</el-button>
          <el-button type="primary" size="small" @click="siderControl" icon="tsfont-bar"></el-button>
        </el-button-group>
      </div>
      <div class="detail_top_right">
        <el-button-group>
          <el-button type="primary" size="small" @click="$emit('seeCiDetail')" icon="el-icon-edit">基 本 信 息</el-button>
          <el-button type="primary" size="small" @click="addModel" icon="el-icon-plus">属 性</el-button>
          <el-button type="primary" size="small" @click="addModel" icon="el-icon-plus">关 系</el-button>
          <el-popover
            placement="top-start"
            title="标题"
            width="200"
            trigger="hover"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <el-button slot="reference" type="primary" size="small" icon="el-icon-more-outline">更 多 配 置</el-button>
          </el-popover>
          <el-button type="primary" size="small" @click="addModel" icon="el-icon-document">查 看 配 置 项</el-button>
        </el-button-group>
        <el-button type="danger" size="small" @click="addModel" icon="el-icon-delete">删 除</el-button>
      </div>
    </div>
    <div class="detail_content xt-layout">
      <div :class="showSider? 'xt-layout-has-sider':'xt-layout-none-sider'" style="border-right: 1px solid red">

      </div>
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
                <el-table-column label="唯一标识" prop="name" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="名称" prop="label" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="类型" prop="typeText" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="继承自" prop="ciLabel" align="center" show-overflow-tooltip>
                  
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
                    <span :class="scope.row.isActive === 1? 'text-success': 'text-grey'">
                      {{ scope.row.isActive === 1? '是':'否' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="自动采集" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span :class="scope.row.isActive === 1? 'text-success': 'text-grey'">
                      {{ scope.row.isActive === 1? '是':'否' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="校验" prop="name" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="分组" prop="groupName" align="center" show-overflow-tooltip></el-table-column>
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
                      >{{ item.label }}</el-radio>
                    </el-radio-group>
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
            <el-tab-pane label="全局属性" v-if="globalArrtList.length > 0">
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
                    <span v-if="scope.row.itemList.length === 0">--</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { ciDetail, cilistattr, savenameattr, ciuniqueSave } from "@/api/system/ciModel";
import { globalattrSearch } from "@/api/system/globalArrtManage";

export default {
  props: ['ciId'],
  data() {
    return{
      ciDetailData: {},
      showSider: true,
      activeName: 0,
      arrtList: [],
      checkList: [],
      globalArrtList: [],
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
    // 侧边栏缩放
    siderControl() {
      this.showSider = !this.showSider
    },
    seeParentCi(id) {
      this.getDetail(id)
    }
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
  .ci_icon{
    align-self: center;
    justify-self: center;
    font-size: 25px; 
  }
}

</style>
