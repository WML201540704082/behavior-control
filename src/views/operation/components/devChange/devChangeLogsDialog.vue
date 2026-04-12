<template>
  <div class="wrap">
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="beforeCloseHandler"
      :visible.sync="isShow"
      append-to-body
      title="变更对比列表"
      width="1100px"
      top="10vh"
      v-el-drag-dialog
    >
      <basic-container>
        <div class="page_form">
          <el-table
            ref="dataTable"
            size="small"
            :data="tableData"
            v-loading="loading"
            row-key="id"
          >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="attributeName" label="属性名称"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="changeBefore" label="修改前"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="changeAfter" label="修改后"  align="center" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <!-- 底部按钮 -->
        <div class="form-btn">
          <el-button class="border-btn" size="small" @click="searchReset">返 回</el-button>
        </div>
      </basic-container>
    </el-dialog>
  </div>
</template>
<script>
import {getDeviceLogList} from "@/api/operation/devChange/devChange";
import {getDictList,getDictCmdbList} from "@/api/dict";

export default {
  props: {
    type: {
      type: String
    },
    bindId: {
      type: String
    },
    deviceCode:{
      type: String
    },
    deviceForm: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      levelList:[],
      searchForm:{},
      tableData:[],
      isShow:true,
      tableHeight: '550px',
      loading: false,
      dataTable: [],
      page: {
        pageSize: 100,
        currentPage: 1,
        total: 0
      },
    };
  },
  computed: {
    isVisible: {
      get(){
        return this.isVisible
      },
      set(val){
        this.$emit("update:isShow", val)
      }
    }
  },
  created() {


    const search = {
      changeId:this.bindId,
      deviceCode:this.deviceCode
    }
    getDeviceLogList(search).then(res =>{
      this.tableData = res.data

      //加载字典--运维等级
      this.getDictCmdbList('1107954469502976')

    })
  },
  methods: {
    getDictCmdbList(ciId){
      //加载字典
      getDictCmdbList({ ciId: ciId }).then(res => {
        if(ciId==='1107954469502976'){ // 运维等级
          this.levelList  = res.data;
          this.levelChange();
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
    //运维等级转换
    levelChange(){
      this.tableData.forEach(s=>{
        if (s.attributeName=='运维等级'){
          let lable1 = this.showDictLable(s.changeBefore,this.levelList);
          s.changeBefore = lable1
          let lable2 = this.showDictLable(s.changeAfter,this.levelList);
          s.changeAfter = lable2
        }
      })
    },
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 50 - 47 + 'px'
    },
    loadDeviceDataList() {
      //加载 设备列表
      this.loading = true;
      let query = {...this.page};
      query.changeId = this.id||'';
      getDeviceLogList(query).then(res => {
        const data = res.data.data;
        this.tableData = data.records;
        this.loading = false;
      });
    },
    searchReset() {
      // 关闭
      this.beforeCloseHandler();
    },
    beforeCloseHandler(){
      //点击关闭按钮
      this.$emit('close')
      this.isVisible = false
    },
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
.formLabel{
 line-height: 16px;
 display: block;
  padding-top: 5px;
}
</style>
