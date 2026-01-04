<template>
  <el-dialog
    :close-on-click-modal="false"
    :show-close="true"
    append-to-body
    :visible.sync="dialogFlag"
    title="巡视配置项详情"
    width="900px"
    @close="closeThisDialog"
    v-el-drag-dialog>
    <el-form class="xt_form" ref="submitForm" inline :model="form" label-suffix=":" label-width="100px" style="width: 800px;margin: 0 auto;">
      <span style="display: block; color: #1c8cd9;margin-bottom: 10px">基本信息</span>
      <el-form-item label="配置项名称">
        <el-input v-model="form.name" maxlength="20" show-word-limit disabled style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="form.type" disabled style="width: 130px;">
          <el-option v-for="item in dictForVisitationType" :key="item.dictValue" :label="item.dictValue" :value="item.dictKey" />
        </el-select>
      </el-form-item>

      <el-divider></el-divider>

      <span style="display: block; color: #1c8cd9;margin-bottom: 10px">配置项明细</span>
      <el-table :data="form.detailList" style="width: 100%" :key="detailTableKey" stripe max-height="400">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="巡视项" width="200"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="enabled" align="center" label="是否启用" width="100">
          <template slot-scope="scope">
            {{ convertDictValue(scope.row.enabled + '', dictForEnableStatus) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="form-btn d_end" style="margin: 10px auto">
        <el-button type="info" plain @click="closeThisDialog">关 闭</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
  import {getDictList} from '@/api/dict'
  import {getDataById} from "@/api/xcnanr/visitationConfig";
  import Breadcrumb from '../../components/Breadcrumb'

  export default {
    components: { Breadcrumb },
    data() {
      return {
        dictForVisitationType: [], dictForEnableStatus: [],
        form: {
          name: '',
          type: '1',
          roomId: '',
          roomName: '',
          detailList: []
        },
        detailTableKey: 0
      };
    },
    props: {
      dialogFlag: {
        type: Boolean, default: false
      },
      dialogObject: {
        type: Object, default: null
      }
    },
    created() {
      // 加载字典信息：巡视类型
      getDictList("info_inspection_plan_type").then(res => {
        this.dictForVisitationType = res.data
      })
      // 加载字典信息：启用状态
      getDictList("info_enable_status").then(res => {
        this.dictForEnableStatus = res.data
      })
      this.initForm();
    },
    methods: {
      // 关闭当前弹层
      closeThisDialog() {
        this.$emit('closeDialog', null)
      },
      convertDictValue(type, dictList){
        const item = dictList.find(config => config.dictKey === type);
        return item ? item.dictValue : null;
      },
      initForm() {
        const configId = this.dialogObject.id
        const _this = this
        getDataById(configId).then(res => {
          if (res && res.code === 200) {
            _this.form = res['data']
            _this.form.type = _this.form.type += ''
            _this.detailTableKey += 1
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .d_tree {
    padding: 12px;
    height: 300px;
    overflow-y: auto;
  }

  .i_filter {
    margin-bottom: 12px;
  }

  .s_disabled {
    font-size: 14px;
    color: #a1a1a1;
    display: block;
    margin-bottom: 3px;
  }

  .s_default {
    font-size: 14px;
    color: #000000;
    display: block;
    margin-bottom: 3px;
  }

  ::v-deep.title-head {
    width: 100%;
    float: left;
    margin: 12px 0 0 60px;
    font-size: 25px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
  /deep/.el-divider {
    margin: 12px 0 10px 0
  }

  ::v-deep(.el-textarea .el-input__count){
    background: #e0f3ff10 !important;
  }
  ::v-deep(.el-input .el-input__count .el-input__count-inner){
    background: #e0f3ff10 !important;
  }
</style>
