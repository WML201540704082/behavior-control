<template>
  <div style="padding-bottom: 25px">
    <el-table
      ref="dataTable"
      stripe
      size="small"
      :data="dataList"
      :height="tableHeight"
      v-loading="tableLoading"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="30" fixed="left"></el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="optName" label="操作人" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="操作时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="title" label="操作内容" align="center" show-overflow-tooltip></el-table-column>

      <!-- <el-table-column label="硬件配置" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="tableItem">
            <p>品牌：{{ scope.row.brand }}</p>
          </div>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      :total="total"
      :page.sync="searchForm.current"
      :limit.sync="searchForm.size"
      @pagination="getList"/>
  </div>
</template>

<script>
import { globalattrDetail, globalattrSave } from "@/api/system/relationManage";
import { optList } from "@/api/system/devInBound";
export default {
  props: ['infoList', 'serialNumber'],
  data() {
    return{

      searchForm: {
        current: 1,
        size: 20,
        // needAction: false,
        // needActionType: false,
      },
      dataList: [],
      selectionList: [],
      total: 0,
      tableLoading: false, //表格加载
      tableHeight: null,
    }
  },
  computed: {
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  mounted() {
    setTimeout(() => {
      this.getList()
    }, 800);

  },
  methods: {
    getList() {
      this.tableLoading = true
      this.searchForm.logId = this.serialNumber
      optList(this.searchForm).then(res=>{
        this.dataList = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      })
    },
    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection.map(item => item.id);
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

  },
  watch:{
    // infoList: {
    //   handler(newValue, oldValue) {
    //     this.getList()
    //   },
    //   deep: true,
    //   // immediate: true
    // }
  }
}
</script>

<style lang="scss" scoped>
  .tableItem{
    text-align: left;
    p{
      margin: 0;
    }

  }
</style>
