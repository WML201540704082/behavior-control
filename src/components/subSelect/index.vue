<template>
  <div class="wrap">
    <el-input v-model="myValue" :disabled="disabled" readonly @click.native="handleClick" :placeholder="placeholder" suffix-icon="el-icon-search"></el-input>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="子网选择"
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
                  <el-form-item label="子网名称">
                      <el-input v-model="searchForm.subnetName" size="mini" clearable></el-input>
                  </el-form-item>
              </div>
            </el-col>
            <!-- <el-col :span="6">
                <div>
                    <el-form-item label="状态">
                        <el-select v-model="searchForm.code" size="mini" clearable placeholder="">
                            <el-option v-for="item in codeList" :value="item.dictValue" :label="item.dictKey"
                                        :key="item.dictValue"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>

            <el-col :span="6">
                <div>
                    <el-form-item label="vlanId">
                        <el-input v-model="searchForm.vlanId" size="mini" clearable></el-input>
                    </el-form-item>
                </div>
            </el-col> -->

            <el-col :span="6">
                <div>
                    <el-form-item label="子网地址">
                        <el-input v-model="searchForm.subnetAddress" size="mini" clearable></el-input>
                    </el-form-item>
                </div>
            </el-col>


            <!-- <el-col :span="6">
                <div>
                    <el-form-item label="安全分区名称">
                        <el-input v-model="searchForm.spName" size="mini" clearable></el-input>
                    </el-form-item>
                </div>
            </el-col> -->


            <el-col :span="6">
                <div>
                    <el-form-item label="是否共用">
                      <el-select v-model="searchForm.isPublic" placeholder="" size="mini" clearable>
                          <el-option
                            v-for="item in isPublicList" :key="item.dictValue" :label="item.dictKey"
                            :value="item.dictValue"> </el-option>
                      </el-select>
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
            <el-table-column show-overflow-tooltip
                              prop="subnetName" label="子网名称" width="200px" sortable align="center"></el-table-column>
            <el-table-column show-overflow-tooltip
                              prop="institutionName" label="所属单位" width="200px" sortable align="center"></el-table-column>
            <el-table-column show-overflow-tooltip
                              prop="isPublic" label="是否共用" width="100px" sortable align="center">
              <template slot-scope="scope">{{scope.row.isPublic === '0' ? '否':'是'}}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip
                              prop="subnetAddress" label="子网地址" width="150px" sortable align="center"></el-table-column>
            <el-table-column show-overflow-tooltip
                              prop="subnetGateway" label="子网网关" width="150px" sortable align="center"></el-table-column>
            <el-table-column show-overflow-tooltip
                              prop="subnetMask" label="子网掩码" width="150px" sortable align="center"></el-table-column>
            <el-table-column show-overflow-tooltip
                              prop="broadcastAddress" label="广播地址" width="150px" sortable align="center"></el-table-column>
            <el-table-column show-overflow-tooltip
                              prop="dnsip" label="首选DNS服务器" width="150px" sortable align="center"></el-table-column>
            <el-table-column show-overflow-tooltip
                              prop="dnsip2" label="备选DNS服务器" width="150px" sortable align="center"></el-table-column>
            <!-- <el-table-column show-overflow-tooltip
                              prop="code" label="状态" :formatter="formattercode" sortable align="center"></el-table-column> -->
            <!-- <el-table-column show-overflow-tooltip
                              prop="switchName" label="所属交换机" width="200px" sortable align="center"></el-table-column> -->
            <!-- <el-table-column show-overflow-tooltip
                              prop="vlanId" label="vlanId" sortable width="150px" align="center"></el-table-column> -->
            <!-- <el-table-column show-overflow-tooltip
                              prop="spName" label="所属安全分区" width="200px" sortable align="center"></el-table-column> -->
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
import { subnetList } from "@/api/operation/safeaccess/subnet";
import {getDictList, getDictCmdbList} from "@/api/dict";

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    value: {
      type: [String, Number, Array],
      default: ""
    },
    formIndex: {
      type: Number,
      default: -1
    },
    networkType: {
      type: String
    },
    institutionCode: {
      type: String
    },
  },
  watch: {
    value(val) {
      this.myValue = val;
      this.$emit("input", val);
    }
  },
  data() {
    return {
      codeList: [{
        dictValue: '0',
        dictKey: '正常'
      }, {
        dictValue: '1',
        dictKey: '停用'
      }],
      isPublicList: [{
        dictValue: '0',
        dictKey: '否'
      }, {
        dictValue: '1',
        dictKey: '是'
      }],


      deviceSourceList: [],
      deviceCategoryList: [],
      deviceTypeList: [],
      voltageLevelList: [],
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
    this.getDictList("is3");
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
      if( !this.disabled ){
        this.isShow = true
        this.getList()
      }
    },
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 50 - 60 + 'px'
    },
    getList() {
      this.tableLoading = true
      if( this.networkType ){
        this.searchForm.networkType = this.networkType
      }
      if( this.institutionCode ){
        this.searchForm.institutionCode = this.institutionCode
      }
      subnetList(this.searchForm).then(res => {
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
      this.$emit("input", this.selectList[0].subnetName);
      this.$emit("change", this.selectList[0], this.formIndex);
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
      this.$emit("input", row.subnetName);
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
