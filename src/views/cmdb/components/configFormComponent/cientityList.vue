<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="请选择需要导出的属性"
      width="700px"
      top="10vh"
      v-el-drag-dialog
    >
      <div class="exportItemContainer">
        <div
          v-for="(item, index) in attrRelList"
          :key="index"
          class="exportItem overflow padding-xs"
          @click="selectExportItem(item)"
        >
          <i v-if="item.selected" class="el-icon-success text-success selected"></i>
          <div>{{ item.label }}</div>
          <div class="text-grey">{{ item.name }}</div>
        </div>

      </div>
      <div class="btn-line">
        <el-button type="primary" plain @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="selectAllExportItem">全选</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { globalattrDetail, globalattrSave } from "@/api/system/relationManage";
import { attrrelSearch } from "@/api/cmdb/ciConfig";

export default {
  props: ['isShow', 'ciId', 'showType'],
  data() {
    return{
      attrRelList: []

    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    // 详情
    getDetail() {
      attrrelSearch({ciId: this.ciId}).then(res => {
        this.attrRelList = res.Return;
      })
    },
    selectExportItem(item) {
      this.$set(item, 'selected', !item.selected);
    },
    selectAllExportItem() {
      this.attrRelList.forEach(element => {
        this.$set(element, 'selected', true);
      });
    },
    // 保存
    save() {
      let selectArr = this.attrRelList.filter(el=> el.selected)

      let params = {
        ciId: this.ciId,
        showAttrRelList: selectArr.map(el => el.uid)
      }
      this.download(
        "/api/idevelop-cmdb/ci/cmdb/cientity/export",
        params,
        this.ciId + "_配置项.xlsx"
      );
      this.$emit('close')

    }
  }
}
</script>

<style lang="scss" scoped>
  .exportItemContainer {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
  }
  .exportItemContainer .exportItem {
    cursor: pointer;
    font-size: 12px;
    border-radius: 4px;
    position: relative;
  }
  .exportItemContainer .exportItem .selected {
      position: absolute;
      right: 5px;
      top: 5px;
  }
  .btn-line{
    text-align: right;
    margin-top: 10px;
  }
  .text-success {
      color: #25b864;
  }
  .padding-xs {
      padding: 6px;
  }
</style>
