<template>
  <div class="ruleCon">
    <div class="ruleCon_Con">
      <div style="margin-bottom: 15px">
        <i class="el-icon-plus el-dropdown-link" @click="addParentCondition"></i>
        <span class="el-dropdown-link" @click="addParentCondition">规则组合</span>
      </div>
      <!-- 父级块 -->
      <div 
        class="parent-item" 
        v-for="(parentItem,index) in ruleObj.conditionGroupList" 
        :key="parentItem.uuid"
      >
        <!-- 父级别删除 -->
        <i class="el-icon-error postionFix" @click="delParentCondition(index)"></i>
        <!-- 子级块 -->
        <div 
          class="child-item"
          v-for="(childItem,index2) in parentItem.conditionList" 
          :key="childItem.uuid"
        >
          <!-- 输入框 -->
          <el-row :gutter="10">
            <!-- 属性选择 -->
            <el-col :span="6">
              <div class="ruleCon_item">
                <el-select v-model="childItem.id" @change="setAttr(childItem, $event)" placeholder="">
                  <el-option
                    v-for="item in attrRelList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                    <div class="attr-line">
                      <span class="text-grey">属性·</span>
                      <span class="">{{item.label}}</span>
                      <span class="text-grey">({{item.name}})</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <!-- 条件选择 -->
            <el-col :span="6">
              <div class="ruleCon_item">
                <el-select v-model="childItem.expression" @change="setAttrExpression(childItem, $event)" placeholder="">
                  <el-option
                    v-for="item in getExpressionList(childItem)"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <!-- 值输入 -->
            <el-col :span="10">
              <div class="ruleCon_item minWidth">
                <div v-if="isNeedAttrValue(childItem)">
                  <!-- <el-input v-model="model3" placeholder="请输入"></el-input> -->
                  <AttrSearcher
                    v-if="childItem.type == 'attr' && getAttrById(childItem.id)"
                    ref="attrHandler"
                    :valueList="childItem.valueList"
                    :attrData="getAttrById(childItem.id)"
                    @setData="setAttrValue(childItem, arguments[0])"
                  ></AttrSearcher>
                </div>
              </div>
            </el-col>
            <!-- 子级：添加/删除 -->
            <el-col :span="2">
              <div class="ruleCon_item">
                <i class="el-icon-plus" @click="addChildCondition(parentItem)"></i>
                <i class="el-icon-minus" @click="delChildCondition(parentItem, index2)" v-if="index2 != 0" style="margin-left: 5px"></i>
              </div>
            </el-col>
          </el-row>
          <!-- 子级并且/或者 -->
          <div class="childRe" v-if="parentItem.conditionList.length-1 != index2">
            <el-row :gutter="10">
              <el-col :span="12">
                <div style="width: 100%;height: 1px;"></div>
              </el-col>
              <el-col :span="6">
                <div class="jijijiji">
                  <el-dropdown trigger="click" style="margin-left: 20px;">
                    <span class="el-dropdown-link">
                      {{ formatRe(parentItem.conditionRelList[index2]) }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item 
                        v-for="item in joinTypeList" 
                        :key="item.value"
                        :class="{ isActive: parentItem.conditionRelList[index2] == item.value }"
                        @click.native="relationClick2(item, index, index2)"
                      > 
                        {{ item.label }} 
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- 父级并且/或者 -->
        <div v-if="ruleObj.conditionGroupList.length-1 != index">
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="jijijiji">
                <el-dropdown trigger="click" style="margin-left: 20px;">
                  <span class="el-dropdown-link">
                    {{ formatRe(ruleObj.conditionGroupRelList[index]) }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item 
                      v-for="item in joinTypeList" 
                      :key="item.value"
                      :class="{ isActive: ruleObj.conditionGroupRelList[index] == item.value }"
                      @click.native="relationClick(item, index)"
                    > 
                      {{ item.label }} 
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-col>
          </el-row>
        </div>

    </div>

    </div>
  </div>
</template>

<script>

import { attrtypeList, attrSave, cilistattr } from "@/api/system/ciModel";
import { validatorSearch } from "@/api/system/checkRulesManage";
import AttrSearcher from './attr-searcher'
import md5 from 'js-md5';
const uuid = require('uuid');

export default {
  props: ["isShow", "ciId", "showType", "arrtId"],
  components: { AttrSearcher },
  data() {
    return{
      attrMap: {},
      model1: '',
      options1: [
        {
          label: '哈哈',
          value: 1
        }
      ],
      model2: '',
      options2: [
        {
          label: '哈哈',
          value: 1
        }
      ],
      model3: '',
      relation: '并且',
      joinTypeList: [
        {
          label: '并且',
          value: 'and'
        },
        {
          label: '或者',
          value: 'or'
        }
      ],

      
      ruleObj: {
        conditionGroupList: [],
        conditionGroupRelList: []
      },
      attrRelList: []
      // ruleObj: {
      //   conditionGroupList: [
      //     {
      //       conditionList: [
      //         {
      //           expression: "is-not-null",
      //           id: "attr_1094898062524422",
      //           label: "",
      //           name: "",
      //           type: "attr",
      //           uuid: "863b6c5be3cb4102ab8b17ff7fddd5081",
      //           valueList: []
      //         },
      //         {
      //           expression: "is-not-null",
      //           id: "attr_1094898062524422",
      //           label: "",
      //           name: "",
      //           type: "attr",
      //           uuid: "863b6c5be3cb4102ab8b17ff7fddd5082",
      //           valueList: []
      //         }
      //       ],
      //       conditionRelList: ['and'],
      //       uuid: "21d4cd72f4f74f1481b374356432dddb3"
      //     },

      //     {
      //       conditionList: [
      //         {
      //           expression: "is-not-null",
      //           id: "attr_1094898062524422",
      //           label: "",
      //           name: "",
      //           type: "attr",
      //           uuid: "863b6c5be3cb4102ab8b17ff7fddd5084",
      //           valueList: []
      //         }
      //       ],
      //       conditionRelList: [],
      //       uuid: "21d4cd72f4f74f1481b374356432dddb5"
      //     }
      //   ],
      //   conditionGroupRelList: ['and']
      // }
    }
  },
  computed: {
    getAttrById() {
      return attrId => {
        return this.attrMap[attrId];
      };
    },
    isNeedAttrValue() {
      return condition => {
        if (!condition.expression || condition.expression == 'is-null' || condition.expression == 'is-not-null') {
          return false;
        } else {
          return true;
        }
      };
    }
  },
  mounted() {
    this.getCiById()
  },
  methods: {
    setAttrValue(condition, value) {
      if (value) {
        if (typeof value == 'object') {
          this.$set(condition, 'valueList', value);
        } else {
          this.$set(condition, 'valueList', [value]);
        }
      } else {
        this.$set(condition, 'valueList', null);
      }
    },
    getData(rule = {}){
      if(!rule){
        rule = {
          conditionGroupList: [],
          conditionGroupRelList: []
        }
      }
      this.ruleObj = rule
    },
    getExpressionList(condition) {
      if (condition.type == 'attr' && this.attrMap[condition.id]) {
        return this.attrMap[condition.id].expressionList;
      } 
      // else if ((condition.type == 'relfrom' || condition.type == 'relto') && this.relMap[condition.id]) {
      //   return this.relMap[condition.id].expressionList;
      // }
      return [];
    },

    setAttr(condition, id) {
      if (id) {
        this.$set(condition, 'id', id);
        this.$set(condition, 'type', 'attr');

        this.$set(condition, 'expression', '');
        this.$set(condition, 'valueList', null);
      } else {
        this.$set(condition, 'id', null);
        this.$set(condition, 'type', null);
        
        this.$set(condition, 'expression', '');
        this.$set(condition, 'valueList', null);
      }

    },
    setAttrExpression(condition, expression) {
      this.$set(condition, 'expression', expression);
      
      this.$set(condition, 'valueList', null);

    },
    async getCiById() {
      if (this.ciId) {
        let attrList = await cilistattr({ ciId: this.ciId });
        attrList = attrList.data.Return
        // console.log(13, attrList)
        attrList.forEach(attr => {
          this.attrRelList.push({ type: 'attr', id: 'attr_' + attr.id, name: attr.name, label: attr.label, expressionList: attr.expressionList });

          if (!this.attrMap['attr_' + attr.id]) {
            this.$set(this.attrMap, 'attr_' + attr.id, attr);
          }
        });
      }
    },
    formatRe(val){
      return this.joinTypeList.filter(el => el.value == val)[0].label
    },
    relationClick(item, index){
      let newArr = JSON.parse(JSON.stringify(this.ruleObj.conditionGroupRelList))
      newArr[index] = item.value
      this.ruleObj.conditionGroupRelList = newArr
      // console.log(89999, this.ruleObj)
      // this.$set(this.submitForm, item.name, item.isMultiple? [] : '')
    },
    relationClick2(item, index, index2){
      let newArr = JSON.parse(JSON.stringify(this.ruleObj.conditionGroupList[index].conditionRelList))
      newArr[index2] = item.value
      this.ruleObj.conditionGroupList[index].conditionRelList = newArr
      // console.log(8999912, this.ruleObj)
      // this.$set(this.submitForm, item.name, item.isMultiple? [] : '')
    },
    addParentCondition(){
      if (!this.ruleObj.conditionGroupRelList) {
        this.$set(this.ruleObj, 'conditionGroupRelList', []);
      }

      if (!this.ruleObj.conditionGroupList) {
        this.$set(this.ruleObj, 'conditionGroupList', []);
      }
      if (this.ruleObj.conditionGroupList.length > 0) {
        this.ruleObj.conditionGroupRelList.push('and');
      }
     
      let group = {
        uuid: md5(uuid.v4()),
        conditionList: [
          {
            uuid: md5(uuid.v4()),
            id: null,
            label: '',
            name: '',
            type: '',
            expression: '',
            valueList: []
          }
        ],
        conditionRelList: []
      }; 
      this.ruleObj.conditionGroupList.push(group)
      // console.log(9990, this.ruleObj.conditionGroupList)

    },
    delParentCondition(index){
      this.ruleObj.conditionGroupList.splice(index, 1);
      if (index > 0) {
        if (this.ruleObj.conditionGroupRelList && this.ruleObj.conditionGroupRelList.length > 0) {
          this.ruleObj.conditionGroupRelList.splice(index - 1, 1);
        }
      }
    },
    addChildCondition(conditionGroup){
      conditionGroup.conditionList.push({
        uuid: md5(uuid.v4()),
        id: null,
        label: '',
        name: '',
        type: '',
        expression: '',
        valueList: []
      });
      if (conditionGroup.conditionList.length > 1) {
        if (!conditionGroup.conditionRelList) {
          this.$set(conditionGroup, 'conditionRelList', []);
        }
        conditionGroup.conditionRelList.push('and');
      }
    },
    delChildCondition(conditionGroup, index){
      conditionGroup.conditionList.splice(index, 1);
      if (index > 0) {
        if (conditionGroup.conditionRelList && conditionGroup.conditionRelList.length > 0) {
          conditionGroup.conditionRelList.splice(index - 1, 1);
        }
      }
    },
  }
}
</script>
<style lang='scss' scoped>
  .attr-line{
    padding-left: 20px;
    span{
      padding: 0;
    }
  }
  .jijijiji{
    position: relative;
    &::before{
      content: '';
      position: absolute;
      left: 32px;
      width: 0px;
      height: 6px;
      border-left: 1px solid;
      z-index: 9;
      margin-right: 4px;
      color: #409EFF;
    }
    &::after{
      content: '';
      position: absolute;
      left: 32px;
      bottom: 0;
      width: 0px;
      height: 6px;
      border-left: 1px solid;
      z-index: 9;
      margin-right: 4px;
      color: #409EFF;
    }
  }

  .parent-item{
    position: relative;
  }
  .postionFix {
    position: absolute;
    top: -20px;
    right: 0;
    font-size: 15px;
    cursor: pointer;
  }
  .el-dropdown-link{
    cursor: pointer;
    color: #409EFF;
  }
  .isActive{
    color: #409EFF;
  }
  ::v-deep .ruleCon_Con{
    overflow: hidden;
    .el-col{
      margin-bottom: 0;
    }
  }
  .ruleCon_item{
    cursor: pointer;
  }
  .minWidth{
    width: 100%;
    min-height: 10px;
  }
</style>
