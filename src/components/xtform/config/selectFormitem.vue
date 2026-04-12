<template>
  <div>
    <!--    :required="configData.isRequired"-->
    <el-form-item :prop="configData.name" :rules="rules">
      <template #label>
        <span>{{ configData.label }}</span>
      </template>
      <el-select
        style="width:100%"
        :value="getValue(selectList)"
        @input="value=>formValue[configData.name] = value"
        :placeholder="`请选择${configData.label}`"
        filterable
        v-if="!onlyRead"
        :disabled="(disabled&&!formValue[configData.name])"
        size="small"
        clearable
        @change="selChange"
        @visible-change="(vis)=>{this.$emit('vsChange',{vis:vis,name:configData.name,arrs:selectList});}"
        @clear="clearClick">
        <template #empty>
          <div style="padding: 12px;font-size: 14px;color: #666666;">
            <span>{{ selectList == null ? '加载中' : (selectList.length == 0) ? '暂无数据' : '' }}</span>
          </div>
        </template>
        <el-option
          v-for="(item, index) in selectList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          :disabled="item.disabled?true:false"
        ></el-option>
      </el-select>
      <el-input v-else v-model="formValue[configData.name]" disabled></el-input>
    </el-form-item>
  </div>
</template>

<script>
import {targetciSearch} from "@/api/system/ciModel";
import {getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import request from '@/router/axios';
import {mapGetters} from "vuex";

export default {
  props: ['configData', 'formValue', 'onlyRead', 'disabled', 'rules'],
  data() {
    return {
      selectList: null
    }
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  watch: {
    'configData.pid'(newVal, oldVal) {
      if (this.configData.name === 'procureTypeCode') {
        //采购方式处理
        if (this.selectList) {
          this.selectList.forEach(item => {
            if (newVal == this.$store.state.common.govern.sourceFtyng) {
              //非统一纳管
              if (item.id != this.$store.state.common.govern.procureTypeDwzg) {
                item.disabled = true;
              } else {
                item.disabled = false;
              }
            } else {
              //统一纳管
              item.disabled = false;
            }
          })
          this.$forceUpdate();
        }
      } else {
        this.getDict();
      }
    },
    'configData.cans.roomId'(newVal, oldVal) {
      if (this.configData.name === 'cabinetCode') {
        //加载机柜
        this.getDict();
      }
    },
    'configData.cans.ownerUnitId'(newVal, oldVal) {
      if (this.configData.name === 'inWarehouseCode') {
        //加载仓库
        this.getDict();
      }
    },
    'configData.cans.maintenanceUnit'(newVal, oldVal) {
      if (this.configData.name === 'computerRoomCode') {
        //加载机房
        this.getDict();
      }
    },
    'configData.arrs'(newVal, oldVal) {
      this.selectList = newVal;
    },
    'selectList'(newVal, oldVal) {
      if (this.configData.type === 'select') {
        this.$emit('escapeCode', {arrs: this.selectList, configData: this.configData});
      }

      // if (this.configData.name == 'deviceTypeCode') {
      //   console.log('deviceTypeCode', newVal);
      // }
    },
  },
  mounted() {
    this.getDict()
  },
  methods: {
    getValue(selectList) {
      if (selectList == null || selectList.length == 0) {
        if (this.configData.nameForCode) {
          return this.formValue[this.configData.nameForCode];
        }
      } else {
        if (!selectList.find(a => a.id == this.formValue[this.configData.name])) {
          if (this.configData.nameForCode) {
            return this.formValue[this.configData.nameForCode];
          }
        }
      }
      return this.formValue[this.configData.name];
    },
    getDict() {
      if (this.configData.url) {
        if (this.configData.cans) {
          for (const key in this.configData.cans) {
            if (!this.configData.cans[key]) {
              //如果有空参数 不执行请求 说明有联动情况
              return
            }
          }
          request({
            url: this.configData.url,
            method: 'get',
            params: this.configData.cans
          }).then(res => {
            this.$emit('selectListEvent', {res: res, configData: this.configData});
          });
        } else {
          if (this.configData.url.indexOf('pid') != -1) {
            if (!this.configData.pid) {
              //this.selectList = [];
              return;
            }
            getDictCmdbListPid({
              ciId: this.configData.id,
              pid: this.configData.pid,
            }).then(res => {
              this.selectList = this.initArr(res.data);
            });
          } else {
            getDictCmdbList({
              ciId: this.configData.id,
            }).then(res => {
              this.selectList = this.initArr(res.data);
            }).catch(err => {
              if (this.configData.type === 'select') {
                this.$message.error(`${this.configData.label}无下拉数据，请在模型管理中添加字典`)
                return;
              }
            });
          }
        }
      } else {
        // if(this.configData.name == 'securityBoundary'){
        //
        //   console.log('this.configData',this.configData)
        // }
        targetciSearch(
          {
            attrId: this.configData.id,
            currentPage: 1,
            pageSize: 999,
            keyword: ''
          }
        ).then(res => {
          this.selectList = res.Return
          if (this.configData.type === 'select') {
            this.$emit('escapeCode', {arrs: this.selectList, configData: this.configData});
          }
        })
      }
    },
    selChange(pid) {
      this.$emit('selectChange', {
        label: this.configData.label,
        name: this.configData.name,
        nameForCode: this.configData.nameForCode,
        piName: this.selectList.find(a => a.id == pid) ? this.selectList.find(a => a.id == pid).name : '',
        obj: this.selectList.find(a => a.id == pid),
        pid: pid
      });
    },
    initArr(data) {
      let arrs = [];
      if (data) {
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          arrs.push({
            id: item.dictKey,
            name: item.dictValue,
          });
        }
      }
      return arrs;
    },
    clearClick() {
      if (this.configData.name) {
        this.formValue[this.configData.name] = '';
      }
      if (this.configData.nameForCode) {
        this.formValue[this.configData.nameForCode] = '';
      }
    }
  }
}
</script>
