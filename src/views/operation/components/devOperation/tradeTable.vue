<template>
  <div>
    <el-table
      ref="deviceTable"
      :data="tradeListNo"
      v-loading="loading"
      size="small"
      height="400px"
    >
      <!-- <el-table-column type="selection" width="30" fixed="left"></el-table-column> -->
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="userName" label="新设备" align="center">
        <el-table-column prop="userName" label="使用信息" align="center">
          <template slot-scope="scope">
            <!-- <el-input v-model="scope.row.userName" placeholder="请输入" clearable style="width:100%"></el-input> -->

            <el-form class="newList" ref="form" label-width="110px" size="mini">
              <el-form-item label="使用类型">
                {{ scope.row.userType == '1' ? '个人' : '公用' }}
              </el-form-item>
              <el-form-item label="使用人">
                {{ scope.row.userName }}
              </el-form-item>
              <el-form-item label="使用人身份证号">
                <!-- <el-input v-model="scope.row.userCard" :disabled="disabled" size="mini" placeholder="请输入" clearable style="width:100%"></el-input> -->
                {{ scope.row.userCard }}
              </el-form-item>
              <el-form-item label="使用人联系方式">
                <!-- <el-input v-model="scope.row.userPhone" :disabled="disabled" size="mini" placeholder="请输入" clearable style="width:100%"></el-input> -->
                {{ scope.row.userPhone }}
              </el-form-item>
              <el-form-item label="安装地点">
                <!-- <el-input v-model="scope.row.address" :disabled="disabled" size="mini" placeholder="请输入" clearable style="width:100%"></el-input> -->
                {{ scope.row.address }}
              </el-form-item>
            </el-form>        
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="网络信息" align="center">
          <template slot-scope="scope">
            <!-- <el-input v-model="scope.row.userName" placeholder="请输入" clearable style="width:100%"></el-input> -->

            <el-form class="newList" ref="form" label-width="110px" size="mini">
              <el-form-item label="设备编码">
                {{ scope.row.deviceCode }}
              </el-form-item>
              <el-form-item label="MAC">
                <el-input v-model="scope.row.deviceMac" :disabled="disabled || scope.row.deviceStatus == '退运在库'" size="mini" placeholder="请输入新设备MAC地址" clearable style="width:100%"></el-input>
              </el-form-item>
              <el-form-item label="IP">
                {{ scope.row.deviceIp }}
              </el-form-item>
              <el-form-item label="所属子网">
                {{ scope.row.deviceSubnetName }}
              </el-form-item>
              <el-form-item label="认证账号">
                {{ scope.row.authAccount }}
              </el-form-item>
              <el-form-item label="认证密码">
                {{ scope.row.authPassword }}
              </el-form-item>
            </el-form>          
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column prop="userName" label="旧设备" align="center">
        <el-table-column prop="userName" label="网络信息" align="center">
          <template slot-scope="scope">
            <el-form class="newList" ref="form" label-width="110px" size="mini">
              <el-form-item label="设备编码">
                {{ scope.row.oldDeviceCode }}
              </el-form-item>
              <el-form-item label="MAC">
                {{ scope.row.deviceOldMac }}
              </el-form-item>
              <el-form-item label="IP">
                {{ scope.row.oldDeviceIp }}
              </el-form-item>
              <el-form-item label="所属子网">
                {{ scope.row.deviceSubnetName }}
              </el-form-item>
              <el-form-item label="认证账号">
                {{ scope.row.authAccount }}
              </el-form-item>
              <el-form-item label="认证密码">
                {{ scope.row.authPassword }}
              </el-form-item>
              <el-form-item label="退运去向">
                <el-select v-model="scope.row.returnDeviceStatus" :disabled="disabled" style="width:100%">
                  <el-option v-for="dict in deviceStatusCodeList" :key="dict.dictValue"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="目标仓库">
                <el-select v-model="scope.row.returnWarehouseCode" @change="returnWarehouseChange($event, scope.row)" :disabled="disabled" style="width:100%">
                  <el-option
                    v-for="item in addressList"
                    :value="item.warehouseId"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="存放位置">
                <el-input v-model="scope.row.returnAddress" disabled size="mini" placeholder="" clearable style="width:100%"></el-input>
              </el-form-item>
            </el-form>          


            <!-- <div class="oldList">
              <p>
                <span class="labell">设备编码</span>
                <span class="valuer">{{ scope.row.oldDeviceCode }}</span>
              </p>
              <p>
                <span class="labell">MAC</span>
                <span class="valuer">{{ scope.row.deviceOldMac }}</span>
              </p>
              <p>
                <span class="labell">IP</span>
                <span class="valuer">{{ scope.row.oldDeviceIp }}</span>
              </p>
              <p>
                <span class="labell">所属子网</span>
                <span class="valuer">{{ scope.row.deviceSubnetName }}</span>
              </p>
              <p>
                <span class="labell">认证账号</span>
                <span class="valuer">{{ scope.row.deviceSubnetName }}</span>
              </p>
              <p>
                <span class="labell">认证密码</span>
                <span class="valuer">{{ scope.row.deviceSubnetName }}</span>
              </p>
              <p>
                <span class="labell">退运去向</span>
                <span class="valuer">
                  <el-select v-model="scope.row.userType" :disabled="disabled" style="width:100%">
                    <el-option :value='1' label="个人"></el-option>
                    <el-option :value='0' label="公用"></el-option>
                  </el-select>
                </span>
              </p>
              <p>
                <span class="labell">目标仓库</span>
                <span class="valuer">
                  <el-select v-model="scope.row.userType" :disabled="disabled" style="width:100%">
                    <el-option :value='1' label="个人"></el-option>
                    <el-option :value='0' label="公用"></el-option>
                  </el-select>
                </span>
              </p>
              <p>
                <span class="labell">存放位置</span>
                <span class="valuer">
                  <el-input v-model="scope.row.userName" :disabled="disabled" size="mini" placeholder="请输入" clearable style="width:100%"></el-input>
                </span>
              </p>
            </div> -->
          </template>
        </el-table-column>
      </el-table-column>
      



      <!-- <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.$index)">删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>

import {getDictCmdbList,getCmdbList,getDictCmdbListPid} from "@/api/dict";
import {mapGetters} from "vuex";
import Vue from "vue";
import {getList} from "@/api/device/warehouse";

export default {
  components: {  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    tradeList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      selectionList: [],
      deviceStatusCodeList: [],
      addressList: [],
    };
  },
  computed: {
    ...mapGetters(["permission", "userInfo", "userDetail"]),
    tradeListNo: {
      get(){
        return this.tradeList
      },
      set(val){
        this.$emit("update:tradeList", val)
      }
    }
  },
  mounted() {
    //加载字典--设备状态
    this.getCmdbDictList("1103423111233536");
    // 仓库列表
    getList({ regionCode: this.userDetail.regionCode }).then(res=>{
      this.addressList = res.data.records
    })
  },
  methods: {
    returnWarehouseChange(val, row){
      // let current = this.deviceCategoryList.filter(el=> el.dictKey == val)[0]
      // this.tradeListNo[index].returnWarehouseName = current.dictValue;
      // this.tradeListNo[index].returnAddress = current.dictValue;
      let select = this.addressList.filter(el=> el.warehouseId == val)[0]
      row.returnWarehouseName = select.warehouseName
      row.returnWarehouse = select.uuid
       row.returnAddress = select.address // 存放位置
    },

    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection;
    },

    getCmdbDictList(code){
      //加载cmdb字典
      let query = {}
      query.ciId = code||'1082372687986688'
      getDictCmdbList( query ).then(res => {
        if(code==='1103423111233536'){ // 设备状态
          let data = res.data
          this.deviceStatusCodeList  = data.filter(el => (el.dictValue == '退运在库' || el.dictValue == '待报废'));
        }else if(code==='1097745625841664'){
          this.deviceCategoryCodeList  = res.data;
        }else if(code==='1097745969774592'){
          this.deviceTypeCodeList  = res.data;
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
  ::v-deep .el-input.is-disabled .el-input__inner{
    color: #606266;
  }
  .oldList{
    width: 320px;
    margin: 0 auto;
    p{
      display: flex;
      margin: 0;
    }
    .labell{
      width: 120px;
      text-align: right;
    }
    .valuer{
      flex: 1;
      color: #a9b4ca;
      text-align: left;
      margin-left: 10px;
    }
  }
  ::v-deep .newList{
    width: 300px;
    margin: 0 auto;
    .el-form-item__label{
      font-size: 12px;
    }
    .el-form-item--mini.el-form-item{
      margin-bottom: 3px;
    }
  }
</style>
