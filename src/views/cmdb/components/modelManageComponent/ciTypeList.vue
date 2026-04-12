<template>
  <div style="height: 100%;overflow: hidden;">
    <el-input v-model="keyword" placeholder="请输入关键字" size="small" style="width: 95%;margin: 6px 0 15px;">
      <i class="el-icon-search" @click="handleSearch" slot="suffix"></i>
    </el-input>
    <el-scrollbar :style="{ height: catalogHeight }">
      <div v-for="item in ciTypeList" :key="item.id" class="titlelistBox">
        <div v-if="item.ciList.length > 0" class="treeTitle ci-label text-title text-grey">{{ item.name }}</div>
        <div v-if="item.ciList.length > 0">
          <ul style="padding-right: 5px">
            <li
              v-for="ci in item.ciList"
              :id="'ci-' + ci.id"
              :key="ci.id"
              class="text-default overflow treeList radius-sm pl-sm pr-xs"
              :class="ci.icon + (ciId == ci.id ? ' bg-selected' : '')"
              :title="ci.label + '(' + ci.name + ')'"
              @click="handleClick(item, ci)"
            >
              <span>{{ ci.label }}</span>
              <span style="padding-left: 2px" class="text-grey">({{ ci.name }})</span>
            </li>
          </ul>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>

import { attrtypeList, attrSave, attrDetail, citypesearch } from "@/api/system/ciModel";
import { validatorSearch } from "@/api/system/checkRulesManage";


export default {
  props: ["ciId"],
  data() {
    return{
      keyword: '',
      ciTypeList: [],
      filterCiTypeList: [],
      catalogHeight: `calc(100% - 53px)` // 默认值高度：50px搜索框高度（21外边距）
    }
  },
  mounted() {
    this.getDict()
    this.getDeatil()
  },
  methods: {
    handleSearch(){
      this.getDeatil({ keyword: this.keyword })
    },
    getDeatil(params = {}) {
      citypesearch(params).then(res => {
        this.ciTypeList = res.Return
      })
      
    },
    getDict() {
      attrtypeList().then(res => {
        this.typeRadioList = res.Return
      })
      validatorSearch({needPage: false}).then(res => {
        this.validatorList = res.Return.tbodyList
      })
    },
    handleClick(item, ci){
      this.$emit("clickCiTree", ci)
    }
  }
}
</script>
<style lang='scss' scoped>
  .titlelistBox {
    margin-bottom: 14px;
  }
  .treeTitle {
    padding-left: 4px;
    font-size: 12px;
    margin-bottom: 4px;
  }
  .treeList {
    font-size: 13px;
    font-weight: 400;
    min-width: 130px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    padding-left: 3px;
  }
  .tsbg-block {
    border-radius: 6px;
  }
  ::v-deep.icon-pr-6 {
    &::before {
      padding-right: 6px;
    }
  }
  .bg-selected{
    background-color: #e7f0ff;
    border-radius: 5px
  }
</style>

