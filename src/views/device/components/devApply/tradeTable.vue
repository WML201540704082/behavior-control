<template>
  <div>
    <el-table
      ref="deviceTable"
      :data="tradeListNo"
      v-loading="loading"
      size="small"
      height="330px"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="30" fixed="left"></el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="userName" label="旧设备基本信息" align="center">
        <template slot-scope="scope">
          <div class="oldList">
            <p>
              <span class="labell">使用类型:</span>
              <span class="valuer">{{ scope.row.oldUserType == 1 ? '个人' : '公用' }}</span>
            </p>
            <p>
              <span class="labell">使用人:</span>
              <span class="valuer">{{ scope.row.oldDeviceUser }}</span>
            </p>
            <p>
              <span class="labell">使用人联系方式:</span>
              <span class="valuer">{{ scope.row.oldUserPhone }}</span>
            </p>
            <p>
              <span class="labell">使用人身份证号:</span>
              <span class="valuer">{{ scope.row.oldUserCard }}</span>
            </p>
            <p>
              <span class="labell">安装地点:</span>
              <span class="valuer">{{ scope.row.oldAddress }}</span>
            </p>
            <p>
              <span class="labell">设备编码:</span>
              <span class="valuer">{{ scope.row.oldDeviceCode }}</span>
            </p>
            <p>
              <span class="labell">MAC:</span>
              <span class="valuer">{{ scope.row.deviceOldMac }}</span>
            </p>
            <p>
              <span class="labell">IP:</span>
              <span class="valuer">{{ scope.row.oldDeviceIp }}</span>
            </p>
            <p>
              <span class="labell">所属子网:</span>
              <span class="valuer">{{ scope.row.deviceSubnetName }}</span>
            </p>
            <p>
              <span class="labell">认证账户:</span>
              <span class="valuer">{{ scope.row.authAccount }}</span>
            </p>
            <p>
              <span class="labell">认证密码:</span>
              <span class="valuer">{{ scope.row.authPassword }}</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="新设备使用信息" align="center">
        <template slot-scope="scope">
          <!-- <el-input v-model="scope.row.userName" placeholder="请输入" clearable style="width:100%"></el-input> -->

          <el-form class="newList" ref="form" label-width="110px" size="mini">
            <el-form-item label="使用类型">
              <el-select v-model="scope.row.userType" @change="userTypeChange(scope.row.userType, scope.$index)" :disabled="disabled" style="width:100%">
                <el-option :value='1' label="个人"></el-option>
                <el-option :value='0' label="公用"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="使用人">
              <el-input v-model="scope.row.userName" :disabled="disabled" size="mini" placeholder="请输入" clearable style="width:100%"></el-input>
            </el-form-item>
            <el-form-item label="使用人联系方式">
              <el-input v-model="scope.row.userPhone" :disabled="disabled" size="mini" placeholder="请输入" clearable style="width:100%"></el-input>
            </el-form-item>
            <el-form-item label="使用人身份证号">
              <el-input v-model="scope.row.userCard" :disabled="!(scope.row.userType === 1 && !disabled)" size="mini" placeholder="请输入" clearable style="width:100%"></el-input>
            </el-form-item>
            <el-form-item label="安装地点">
              <el-input v-model="scope.row.address" :disabled="disabled" size="mini" placeholder="请输入" clearable style="width:100%"></el-input>
            </el-form-item>
            <el-form-item label="认证账户">
              <!-- :disabled="disabled || !scope.row.userType == 1" -->
              <el-input v-model="scope.row.authAccount" disabled size="mini" placeholder="" clearable style="width:100%"></el-input>
            </el-form-item>
            <el-form-item label="认证密码">
              <!-- :disabled="disabled || !scope.row.userType == 1" -->
              <el-input v-model="scope.row.authPassword" disabled size="mini" placeholder="" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-form>        
        </template>
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

import {dateFormat} from "@/util/date";
import {mapGetters} from "vuex";
import Vue from "vue";


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
      tradeList: [
        
      ],
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
    
  },
  methods: {
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection;
    },
    remove(){
      this.selectionList.forEach(item=>{
        let index = this.tradeList.findIndex(ell=> ell.id == item.id)
        this.tradeList.splice(index, 1)
      })
    },
    userTypeChange(userType, index) {
      //子表领用类型
      if (userType === '0' || userType === 0) {
        this.tradeListNo[index].userCard = null;
      } else {
        this.tradeListNo[index].userCard = null;
      }
    },
  }
};
</script>
<style lang="scss" scoped>
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
      // color: #a9b4ca;
      // color: #909399;
      color: #333;
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

    .el-input.is-disabled .el-input__inner{
      color: #333;
    }
  }
</style>
