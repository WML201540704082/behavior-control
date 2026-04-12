<template>
  <div>
    <div class="table_box">
      <el-table
        ref="dataTable"
        size="small"
        :data="tableData"
        v-loading="tableLoading"
        height="215px"
      >
        
        <el-table-column prop="warningType" label="告警类型" width="100px" align="left" show-overflow-tooltip>
          <template slot-scope="{row}">
            <div class="ddd">
              <div class="dian"></div>
              {{ row.warningType }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="warningDetail" label="告警详情"  align="left">
          <template slot-scope="{row}">
            <!-- 在网IP为<span style="color: #ed4a08;margin: 0 5px;">192.168.13</span>与MAC为<span style="color: #ed4a08;margin: 0 5px;">FF:FF:FF:FF:A3:FF</span>未匹配到台账，发及新设备 -->
            {{ row.warningDetail }}
          </template>
        </el-table-column>
        
        
      </el-table>
      
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { warningDetail } from "@/api/wel/index.js"

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
          aaa3: '新发现设备',
          aaa4: '',
          aaa5: '2024-04-30 23:56:56',
          aaa6: '1',
          aaa7: '',
          aaa8: '',
        },
        {
          aaa1: '未知设备',
          aaa2: '',
          aaa3: 'IP/MAC变更',
          aaa4: '',
          aaa5: '2024-04-30 23:56:56',
          aaa6: '1',
          aaa7: '',
          aaa8: '',
        },
        {
          aaa1: '未知设备',
          aaa2: '',
          aaa3: '新发现设备',
          aaa4: '',
          aaa5: '2024-04-30 23:56:56',
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
    warningDetail().then(res=>{
      this.tableData = res.data
    })
  },
  methods: {
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
  
  .table_box{
    width: 100%;
    height: 100%;
  }
  .ddd{
    display: flex;
    align-items: center;
    .dian{
      width: 5px;
      height: 5px;
      background: #FE8D00;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
</style>
