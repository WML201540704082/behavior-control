<template>
  <div class="d_root" v-loading="loading">
    <div class="d_form">
      <el-form
        ref="submitForm"
        label-width="100px"
        size="small">
        <el-row :gutter="12">
          <el-col :span="12" v-for="(item,index) in attrList" :key="item.id">
            <el-form-item>
              <template #label>
                <el-tooltip :content="item.label">
                  <span class="s_ellips">{{ item.label }}</span>
                </el-tooltip>
              </template>
              <div class="d_start">
                <el-select v-if="false" v-model="item.expression" class="d_w1" clearable filterable>
                  <el-option v-for="(itemJ,indexJ) in item.expressionList"
                             :key="itemJ.value"
                             :label="itemJ.text"
                             :value="itemJ.value"></el-option>
                </el-select>
                <div v-if="item.name === 'receiveUnit' || item.name === 'receiveDept' || item.name === 'ownerUnit'" class="d_w2">
                  <xt-tree-lzay-select :select-type="item.name === 'receiveUnit' || item.name === 'ownerUnit' ?'CORP':'DEPT'"
                                       :form-value="item.value1"
                                       :unit-id="getUnitId(item)"
                                       @getTreeItem="val=>{getTreeItem(val,item)}">

                  </xt-tree-lzay-select>
                </div>

                <el-input v-else-if="item.type === 'text'||item.type === 'textarea'" v-model="item.value1" class="d_w2" :placeholder="`请填写${item.label}`"
                          clearable></el-input>
                <el-select v-else-if="item.type === 'select'" v-model="item.value1" class="d_w2" :placeholder="`请选择${item.label}`"
                           @visible-change="((val)=>{elSelectVis(val,item)})"
                           @change="elSelectChange(item.name)"
                           :multiple="item.multiple" clearable>
                  <template #empty>
                    <div class="d_stext">
                      <span v-if="item.valueList&&item.valueList.length === 0">暂无数据</span>
                      <span v-else>获取中...</span>
                    </div>
                  </template>
                  <el-option v-for="(itemJ,indexJ) in item.valueList"
                             :key="itemJ.id"
                             :label="itemJ.name"
                             :value="itemJ.id"></el-option>
                </el-select>
                <div class="d_sp d_w2" v-else-if="item.type === 'date'">
                  <el-date-picker v-model="item.date1" value-format="yyyy-MM-dd" placeholder="开始日期" class="d_date_w" clearable></el-date-picker>
                  <span>~</span>
                  <el-date-picker v-model="item.date2" value-format="yyyy-MM-dd" placeholder="结束日期" class="d_date_w" clearable></el-date-picker>
                </div>
                <el-input v-else-if="item.type === 'number'" v-model="item.value1" class="d_w2" type="number" :placeholder="`请填写${item.label}`"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="d_btns">
      <el-button type="primary" size="mini" @click="saveSearchItem">确定</el-button>
      <el-button type="danger" size="mini" plain @click="$emit('filterCancel')">取消</el-button>
    </div>
  </div>
</template>

<script>
import {targetciSearch, listattr} from "@/api/system/ciModel";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDictCmdbListPid} from "@/api/dict";

export default {
  props: ['ciId'],
  components: {xtTreeLzaySelect},
  data() {
    return {
      loading: false,
      attrList: null,
    };
  },
  mounted() {
    //this.getAttrs();
  },
  methods: {
    delAttr(item) {
      let fItem = this.attrList.find(a => a.id === item.attrId);
      if (fItem) {
        if (fItem.type === 'select') {
          fItem.value1 = [];
        } else {
          fItem.value1 = null;
        }
        fItem.date1 = null;
        fItem.date2 = null;
      }
    },
    getAttrs(refresh) {
      if (refresh) {
        this.attrList = [];
      }
      if (this.attrList && this.attrList.length > 0) {
        return;
      }
      this.loading = true;
      listattr().then(res => {
        res.data.Return.forEach(item => {
          if(item.type == "date"){
            item.expression = 'between';// item.expressionList[0].value;
          }else{
            item.expression = 'like';// item.expressionList[0].value;
          }

          if (item.name == 'isITAICode') {
            //是否信创 单选
            item.multiple = false;
          } else if (item.name == 'deviceCategoryCode') {
            //设备分类
            item.multiple = false;
          } else if (item.name == 'deviceTypeCode') {
            //设备类型
            item.multiple = false;
          } else {
            item.multiple = true;
          }
        })
        this.attrList = res.data.Return;
      }).finally(() => {
        this.loading = false;
      })
    },
    elSelectChange(name) {
      if (name == 'deviceCategoryCode') {
        let fItem = this.attrList.find(a => a.name == 'deviceTypeCode');
        if (fItem) {
          if (fItem.value1) {
            fItem.value1 = null;
          }
          if (fItem.valueList) {
            fItem.valueList = [];
          }

          //联动
          this.elSelectVis(true, fItem)
        }
      }
    },
    elSelectVis(val, item) {
      if (val) {
        //设备分类、设备类型联动
        if (item.name == 'deviceTypeCode') {
          let fItem = this.attrList.find(a => a.name == 'deviceCategoryCode');
          if (fItem && fItem.value1 != null && fItem.value1 != '') {
            //根据设备分类加载设备类型
            getDictCmdbListPid({
              ciId: 1097745969774592,
              pid: fItem.value1,
            }).then(res => {
              let arrs = [];
              res.data.forEach(itemJ => {
                arrs.push({
                  name: itemJ.dictValue,
                  id: parseFloat(itemJ.dictKey)
                })
              })
              item.valueList = arrs
              this.$forceUpdate()
            });

            return;
          }
        }

        if (item.valueList && item.valueList.length > 0) {
          return;
        }
        targetciSearch(
          {
            attrId: item.id,
            currentPage: 1,
            pageSize: 999,
            keyword: ''
          }
        ).then(res => {
          item.valueList = res.Return
          //this.$refs.searchForm.$forceUpdate()
          this.$forceUpdate()
        })
      }
    },
    saveSearchItem() {
      let attrFilterList = [];

      this.attrList.forEach(item => {
        let valueList = [];
        if ((item.type === 'text' || item.type === 'number' || item.type === 'textarea') && item.value1) {
          valueList = [item.value1];
        } else if (item.type === 'select') {
          if (item.value1) {
            if (item.value1 instanceof Array) {
              valueList = item.value1;
            } else {
              valueList = [item.value1];
            }
          }
        } else if (item.type === 'date' && item.date1 && item.date2) {
          valueList = [`${item.date1}~${item.date2}`];
        }
        if (valueList && valueList.length > 0) {
          attrFilterList.push({
            expression: item.expression,
            attrId: item.id,
            attrName: item.label,
            valueList: valueList,
            type: 'search'
          })
        }
      })
      // console.log(attrFilterList)
      this.$emit('filterOK', {attrFilterList: attrFilterList})
    },
    getTreeItem(val, item) {
      if (item.name === 'receiveUnit') {
        //单位
        item.value1 = val.fullName;
        item.value1Code = val.id;

        //部门置空
        let bmItem = this.attrList.find(a => a.name === 'receiveDept');
        if (bmItem) {
          bmItem.value1 = null;
          bmItem.value1Code = null;
        }
      } else if (item.name === 'receiveDept') {
        //部门
        item.value1 = val.fullName;
        item.value1Code = val.id;
      } else if( item.name === 'ownerUnit' ) {
        //产权单位
        item.value1 = val.fullName;
        item.value1Code = val.id;
      }

      this.$forceUpdate()
    },
    getUnitId(item) {
      if (item.name === 'receiveDept') {
        let dwItem = this.attrList.find(a => a.name === 'receiveUnit');
        if (dwItem) {
          return dwItem.value1Code;
        }
      }
      return null;
    },
  },
}
</script>
<style scoped lang="scss">

.d_root {
  width: 100vh;
  height: auto; // 50vh;
  padding: 20px;
  margin: -13px;
  border: 1px solid #1A97D8;
  border-radius: 4px;
}

.s_ellips {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.d_start {
  display: flex;
  justify-content: flex-start
}

.d_w1 {
  width: 30%;
  margin-right: 6px;
}

.d_w2 {
  //width: 70%;
  width: 100%;
}

.d_sp {
  display: flex;
  justify-content: space-between;
}

.d_date_w {
  width: 48%;
}

.d_stext {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.d_stext span {
  font-size: 14px;
  color: #666666;
}

.d_form {
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  height: 90%
}

.d_btns {
  display: flex;
  justify-content: flex-end;
}
</style>
