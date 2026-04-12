<template>
  <div class="wrap">
    <el-input v-model="myValue" readonly @click.native="handleClick" :placeholder="placeholder" suffix-icon="el-icon-search"></el-input>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="交换机选择"
      width="1000px"
      top="10vh"
      v-el-drag-dialog
    >
      <!-- <basic-container> -->
        <div class="page_form">
          <el-form ref="queryForm" :model="searchForm" label-width="105px" class="xt_search_form">
            <el-row>
              <el-col :span="6">
                  <div>
                      <el-form-item label="交换机标签">
                          <el-input v-model="searchForm.swName" size="mini" clearable></el-input>
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="6">
                  <div>
                      <el-form-item label="安装地点">
                          <el-input v-model="searchForm.swWhere" size="mini" clearable></el-input>
                      </el-form-item>
                  </div>
              </el-col>

              <el-col :span="6">
                  <div>
                      <el-form-item label="所属单位">
                          <el-select v-model="searchForm.orgCode" size="mini" clearable placeholder="">
                              <el-option v-for="item in orgCodeList" :value="item.deptCode" :label="item.deptName"
                                          :key="item.deptCode"></el-option>
                          </el-select>
                      </el-form-item>
                  </div>
              </el-col>

              <el-col :span="6">
                  <div>
                      <el-form-item label="设备编码">
                          <el-input v-model="searchForm.sbbm" size="mini" clearable></el-input>
                      </el-form-item>
                  </div>
              </el-col>


              <el-col :span="6">
                  <div>
                      <el-form-item label="NASIP">
                          <el-input v-model="searchForm.NASIP" size="mini" clearable></el-input>
                      </el-form-item>
                  </div>
              </el-col>


              <el-col :span="6">
                  <div>
                      <el-form-item label="汇聚/接入">
                        <el-select v-model="searchForm.is3" placeholder="" size="mini" clearable>
                            <el-option
                              v-for="item in is3List" :key="item.dictKey" :label="item.dictValue"
                              :value="item.dictKey"> </el-option>
                        </el-select>
                      </el-form-item>
                  </div>
              </el-col>

              <el-col :span="6">
                  <div>
                      <el-form-item label="型号">
                          <el-input v-model="searchForm.swModel" size="mini" clearable></el-input>
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="6">
                  <div>
                      <el-form-item label="设备状态">
                        <el-select v-model="searchForm.swState" placeholder="" size="mini" clearable>
                            <el-option
                              v-for="item in swStateList" :key="item.dictKey" :label="item.dictValue"
                              :value="item.dictKey"> </el-option>
                        </el-select>
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="6">
                  <div>
                      <el-form-item label="认证方式">
                        <el-select v-model="searchForm.Is802" placeholder="" size="mini" clearable>
                          <el-option
                          v-for="item in Is802List" :key="item.dictKey" :label="item.dictValue"
                          :value="item.dictKey"> </el-option>
                        </el-select>
                      </el-form-item>
                  </div>
              </el-col>

              <el-col :span="6">
                <div>
                    <el-form-item label="认证状态">
                        <el-select v-model="searchForm.isAccessSwitch" size="mini" clearable placeholder="">
                            <el-option v-for="item in isAccessSwitchList" :key="item.dictKey" :label="item.dictValue"
                                        :value="item.dictKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="管理IP">
                  <el-input v-model="searchForm.telIp" size="mini" clearable></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          </el-form>

        </div>
        <div class="page_body">
          <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
            <div slot="rightBtnBox">
              <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="searchReset" plain>重置</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="handleSubmit">提交</el-button>
              <el-button type="primary" icon="el-icon-delete" @click="handleSEmpty" plain>清空</el-button>
            </div>
          </formTitle>
          <el-table
            ref="dataTable"
            stripe
            size="small"
            :data="tableData"
            :height="tableHeight"
            v-loading="tableLoading"
            @selection-change="select"
          >
            <el-table-column type="selection" width="30" fixed="left"></el-table-column>
            <el-table-column type="index" fixed label="序号" align="center" width="50"></el-table-column>
            <el-table-column show-overflow-tooltip fixed prop="swName" label=" 交换机标签" width="200px"></el-table-column>
            <!-- <el-table-column show-overflow-tooltip prop="orgName" label="公司" width="200px"></el-table-column> -->
            <el-table-column show-overflow-tooltip prop="swMaker" label="制作商" width="150px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swFirm" label="品牌" width="150px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swSeries" label="系列" width="150px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swModel" label="型号" width="100px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swWhere" label="安装地点" width="120px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swPurpose" label="用途" width="100px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="is3"  label="网络设备用途类型" width="150px">
              <template  slot-scope="scope">
                <span>{{showDictLable(scope.row.is3, is3List)}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="swState" label="设备状态" width="100px">
              <template  slot-scope="scope">
                <span>{{showDictLable(scope.row.swState, swStateList)}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="telIp" label="管理IP" width="150px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swIp" label="NASIP" width="150px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="sbbm" label="设备编码" width="200px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="swPass" label="NASSECRET" width="130px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="snmpVersion" label="SNMP版本号" width="150px">
              <template  slot-scope="scope">
                <span>{{showDictLable(scope.row.snmpVersion, snmpVersionList)}}</span>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip prop="snmpReadStr" label="SNMP读字符串" width="200px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="snmpWriteStr" label="SNMP写字符串" width="200px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="is802" label="认证方式" width="180px">
              <template  slot-scope="scope">
                <span>{{showDictLable(scope.row.is802, is802List)}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="isAccessSwitch" label="认证状态" width="150px">
              <template  slot-scope="scope">
                <span>{{showDictLable(scope.row.isAccessSwitch, isAccessSwitchList)}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="fillMan" label="录入人" width="150px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="portsCount" label="端口数量" width="100px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="fillDate" label="录入时间" width="150px"></el-table-column>
            <el-table-column show-overflow-tooltip prop="bakCol1" label="备注"></el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page.sync="searchForm.current"
            :limit.sync="searchForm.size"
            @pagination="getList"/>
         
        </div>
      <!-- </basic-container> -->

    </el-dialog>
  </div>
</template>
<script>
import { projectmanagerList } from '@/api/assets/projectManage'

import {getDictList, getDictCmdbList} from "@/api/dict";
import { switcheList } from "@/api/operation/safeaccess/switch";

export default {
  props: {
    placeholder: {
      type: String
    },
    value: {
      type: [String, Number, Array],
      default: ""
    }
  },
  watch: {
    value(val) {
      this.myValue = val;
      this.$emit("input", val);
    }
  },
  data() {
    return {
      deviceSourceList: [],
      deviceCategoryList: [],
      deviceTypeList: [],
      voltageLevelList: [],
      is3List: [],
      swStateList: [],
      Is802List: [],
      isAccessSwitchList: [],


      isShow: false,
      searchForm: {
        current: 1,
        size: 20
      },
      // 表格
      tableData: [
        {eprNum: 2023},
        {eprNum: 220},
      ],
      tableHeight: '450px',
      tableLoading: false,
      total: 0,
      selectList: [],
      list: [],
      myValue: this.value
    };
  },
  created() {
    // 设置页面元素高度
    // this.setPageContentHeight()
    // 设置表格高度
    // this.setTableHeight()
    this.getList()

    //加载字典--工单状态
    // //加载字典--WBS元素
    // this.getDictList("is3");
    
    //加载字典--入库仓库
    this.getDictList("swState");
    //加载字典--WBS项目
    this.getDictList("Is802");
    //加载字典--i6000同步状态
    this.getDictList("isAccessSwitch");
    //加载字典--i6000同步状态
    this.getDictList("is_to_i6000");
    // 加载字典
    this.getDictCmdbList('1102860579569664') // 设备来源
    this.getDictCmdbList('1097745625841664') // 设备分类
    this.getDictCmdbList('1097745969774592') // 设备类型
    this.getDictCmdbList('1084068218601472') // 电压等级
    this.getDictCmdbList('1131177441558528')
  },
  methods: {
    getDictCmdbList(ciId){
      //加载字典
      getDictCmdbList({ ciId: ciId }).then(res => {
        if(ciId==='1102860579569664'){ // 设备来源
          this.deviceSourceList  = res.data;
        }else if(ciId==='1097745625841664'){ // 设备分类
          this.deviceCategoryList  = res.data;
        }else if(ciId==='1097745969774592'){ // 设备类型
          this.deviceTypeList = res.data;
        }else if(ciId==='1084068218601472'){ // 电压等级
          this.voltageLevelList = res.data;
        }else if(code==='1131177441558528'){ // 网络设备用途类型
          this.is3List = res.data;
        }
      });
    },

    getDictList(code){
      //加载字典
      getDictList(code).then(res => {
        if(code==='swState'){
          this.swStateList = res.data;
        }else if(code==='Is802'){
          this.Is802List = res.data;
        }else if(code==='isAccessSwitch'){
          this.isAccessSwitchList = res.data;
        }
      });
    },
    showDictLable(code,dictList){
      //字典回显
      if(dictList!=null && code!==''){
        let items = dictList.filter(item => item.dictKey==code);
        if(items!=null && items.length>0){
          return items[0].dictValue;
        }
      }
      return code;
    },
    select(val) {
      this.selectList = val;
    },
    handleClick(){
      this.isShow = true
      this.getList()
    },
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 50 - 60 + 'px'
    },
    getList() {
      this.tableLoading = true
      switcheList(this.searchForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    handleSubmit(){
      if (this.selectList.length != 1) {
        this.$message.warning("请选择一条数据!")
        return
      }
      this.$emit("input", this.selectList[0].swIp);
      this.$emit("change", this.selectList[0]);
      this.isShow = false
    },
    handleSEmpty(){
      this.$emit("input", '');
      this.$emit("change", {});
      this.isShow = false
    },
    // 查询
    handleQuery() {
      this.searchForm.current = 1
      this.getList()
    },
    // 重置
    searchReset() {
      this.searchForm = {
        current: 1,
        size: 20
      }
      this.getList()
    },
    handleSave(row){
      //保存
      this.$emit("input", row.swIp);
      this.$emit("change", row);
      this.isShow = false
    }
  }
};
</script>
<style lang='scss' scoped>
.wrap {
  width: 100%;
}
::v-deep .el-select {
  width: 100% !important;
}
</style>
