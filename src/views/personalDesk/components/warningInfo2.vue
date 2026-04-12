<template>
  <div>
    <div class="table_box">
      <el-table
        ref="dataTable"
        stripe
        size="small"
        :data="tableData"
        v-loading="tableLoading"
        height="280px"
      >
        <el-table-column type="index" label="序号" width="50" align="left"></el-table-column>
        <el-table-column prop="aaa1" label="告警设备" width="100px" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="aaa2" label="告警等级" width="100px" align="left" show-overflow-tooltip>
          <template slot-scope="{row}">
            <!-- <el-tag type="success">次要</el-tag>
            <el-tag type="warning">主要</el-tag> -->
            <el-tag type="danger">紧急</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="aaa3" label="告警类型" width="100px" align="left" show-overflow-tooltip>
          <template slot-scope="{row}">
            新发现设备
          </template>
        </el-table-column>
        <el-table-column prop="aaa4" label="告警详情" width="350px" align="left">
          <template slot-scope="{row}">
            在网IP为 <span style="color: #e9550c"> 10.140.191.44 </span> 与MAC为 <span style="color: #e9550c"> 00:26:55:23:50:86 </span> 未匹配到台账，发现新设备.
          </template>
        </el-table-column>
        <el-table-column prop="aaa5" label="开始时间" width="150px" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="aaa6" label="告警次数" width="100px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="aaa7" label="确认状态" width="120px" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <div class="zhaungtai">
              <div class="dian"></div>
              待确认
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="aaa8" label="处置状态" width="120px" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <div class="zhaungtai">
              <div class="dian"></div>
              待处置
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="120">
          <template slot-scope="{row}">
            <!-- <el-button type="text" class="list_btn" size="small" @click="handleConfirm(row)">确认</el-button>
            <el-button type="text" class="list_btn" size="small" @click="handleHHu(row)">忽略</el-button> -->
            <el-button type="text" class="list_btn" size="small" @click="handleDis(row)">处置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        class="pagination111"
        :total="total"
        :smalla="true"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="getOrderList"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { warningList } from "@/api/personalDesk/index"

export default {
  props: ['isShow', 'orderDeatil', 'processKeys','orderType'],
  data() {
    return {
      searchForm:{
        current: 1,
        size: 20
      },

      tableData: [
        {
          aaa1: '未知设备',
          aaa2: '',
          aaa3: '',
          aaa4: '',
          aaa5: '2024-07-17 23:01:56',
          aaa6: '1',
          aaa7: '',
          aaa8: '',
        }
      ],
      tableLoading: false

    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      warningList().then(res=>{
        // console.log(23, res)
      })
    },
    handleConfirm(row){

    },
    handleHHu(row){

    },
    handleDis(row){

    },
  }
}
</script>
<style lang="scss" scoped>
  
  .zhaungtai{
   
    display: flex;
    justify-content: center;
    align-items: center;

    .dian{
      width: 8px;
      height: 8px;
      background: #FFA419;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
</style>
<style lang="scss" scoped>
  ::v-deep .pagination111{
    margin-top: -10px;
  }
</style>
