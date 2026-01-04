<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="操作记录"
      width="600px"
      top="15vh"
      v-el-drag-dialog
    >
      <div>
        <el-timeline :reverse="reverse">
          <el-timeline-item
            color="#409EFF"
            v-for="(activity, index) in activities"
            :key="index"
          >
            <div class="content">
              <div class="hang1">
                <span>{{ activity.commitUserName }}</span>
                <span>{{ dateFormat2(activity.commitTime) }}</span>
              </div>
              <div class="hang2">
                <span>来自</span>
                {{ activity.inputFromText }}
              </div>
              <div class="hang3">
                <span class="span1">变更</span>
                属性
                <b class="span2" @click="handleDetail(activity)">{{ activity.ciEntityTransactionVo.updateAttrCount }}</b>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
      <!-- <div class="submit_btn">
        <el-button size="small" @click="$emit('close')">取 消</el-button>
      </div> -->
    </el-dialog>


    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => isShow2=false"
      :show-close="true"
      append-to-body
      :visible.sync="isShow2"
      title="详情"
      width="1000px"
      top="15vh"
      v-el-drag-dialog
    >
      <div class="historyTable">
        <div class="historyHang">
          <div class="cell"></div>
          <div class="cell">类型</div>
          <div class="cell diffHeader">
            <div>修改前</div>
            <div>修改后</div>
          </div>
        </div>

        <div class="historyHang"
          v-for="row in details"
          :key="row.id"
        >
          <div class="cell">{{ row.label }}</div>
          <div class="cell">{{ row.type == "globalattr" ? '全局属性':'属性' }}</div>
          <div class="cell diffHeader">
            <template v-if="row.type == 'globalattr'"> 
              <div>{{ row.oldValue && row.oldValue.map(el=>el.value).join(',') }}</div>
              <div>{{ row.newValue && row.newValue.map(el=>el.value).join(',') }}</div>
            </template>
            <template v-else>
              <div>{{ row.oldValue && row.oldValue.actualValueList.join(',') }}</div>
              <div>{{ row.newValue && row.newValue.actualValueList.join(',') }}</div>
            </template>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteConfig, transactionSearch, transactionGet } from "@/api/cmdb/ciConfig";
import { dateFormat } from "@/util/date";

export default {
  props: ['isShow', "configId"],
  data() {
    return{
      activities: [],
      details: [],
      isShow2: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleDetail(row){
      transactionGet({
        ciEntityId: row.ciEntityId,
        ciId: row.ciId,
        transactionId: row.id
      }).then(res=>{
        this.details = res.Return.detail
      })
      this.isShow2 = true
    },
    dateFormat2(time){
      return dateFormat( new Date(time), 'yyyy-MM-dd hh:mm' )
    },
    getList(){
      transactionSearch({ 
        statusList: ["commited", "recover"],
        pageSize: 100,
        ciEntityId: this.configId 
      }).then(res=>{
        // console.log(1, res.Return.tbodyList)
        this.activities = res.Return.tbodyList
      })
    },
    
   
  }
}
</script>
<style lang="scss" scoped>
  .historyTable{
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 0px;
    max-height: calc((100vh - 254px) - 24px);
    .historyHang{
      display: grid;
      grid-template-columns: 150px 80px auto;
      .cell{
        padding: 9px;
        border-bottom: 1px solid #e5e5e5;
      }
      .diffHeader{
        display: grid;
        grid-template-columns: 50% 50%;
        grid-gap: 10px;
        word-break: break-all;
      }
    }
  }



  .content{
    color: #333;
    
    .hang1{
      span{
        margin-right: 6px;
      }
    }
    .hang2{
      span{
        margin-right: 6px;
        color: #8c8c8c;
      }
    }
    .hang3{
      span{
        margin-right: 6px;
        color: #8c8c8c;
      }
      .span2{
        margin-left: 6px;
        color: #1670f0;
        cursor: pointer;
      }
    }
  }
</style>