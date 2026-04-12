<template>
  <!-- 流程进度组件 -->
  <div class="setp_list" v-loading="loading">
    <el-steps class="stepTop" :active="active" align-center v-if="!stepType" finish-status="success">
      <el-step
        v-for="(item, index) in stepList"
        :key="index"
        :title="item.nodeName"
      >
        <template slot="description">
          <div style="text-align:center">
            {{item.description.optName||'--'}}
            <!-- <span>{{item.description.optName||'--'}}</span> -->
          </div>
          <div>{{item.description.createTime}}</div>
          <div v-if="index == active && item.type === '1'">
            <el-popover
              placement="right"
              width="500"
              trigger="hover"
              >
              <el-link slot="reference" type="primary">审核人</el-link>
              <el-table
                ref="dataTable"
                stripe
                size="small"
                :data="currentUserList"
                max-height="400px"
              >
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="realName" label="审核人" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="phone" label="联系方式" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="100" align="center">
                  <template slot-scope="{row}">
                    <el-button type="primary" size="mini" plain @click="sendMessage(row)">催 办</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-popover>
          </div>
        </template>
      </el-step>
    </el-steps>
    <div class="stepBottom" v-else :style="{height: stepHeight}">
      <el-steps direction="vertical" :active="active" finish-status="success">
        <el-step
          v-for="(item, index) in stepList"
          :key="index"
        >
          <template slot="title">
            <span>{{ item.nodeName }}</span>
            <span style="color: #C0C4CC;font-size: 12px;margin-left: 15px">{{ item.description.optDate }}</span>
          </template>
          <template slot="description">
            <div class="audit_box">
              <div class="audit_info">
                <i class="el-icon-s-custom"></i>
                <span v-if="item.description.optRole && item.description.optRole != ''">{{ item.description.optRole }}:</span>
                <span style="margin-left: 5px">{{ item.description.optName }}</span>
                <!-- <span>{{ item.description.optTitle }}</span> -->
              </div>
              <div class="audit_remark" v-if="item.description.optOpinion != ''">
                <template v-if="index > 0">
                  {{ item.description.optOpinion? item.description.optOpinion:'待审核' }}
                </template>
                <template v-else>
                  <!-- 待提交 -->
                  {{ item.description.optOpinion }}
                </template>
              </div>
            </div>

          </template>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
import { processDict, processCurrentUserInfo, queryAssignee, pressDo } from "@/api/process/index"
import { getApproveList } from "@/api/device/approverecord";

export default {
  props: ['processKey', 'orderNo', 'stepType', 'orderId', 'orderCode', 'currentSteps', 'stepHeight', 'status', 'repairType','creatType'],
  data() {
    return{
      active: -1,
      stepList: [],
      loading: false,
      currentUserList: [],
    }
  },
  mounted() {
    this.getProcessStep()
    this.getCurrentStep()
  },
  methods: {

    async getProcessStep() {
      // console.log(123, this.orderNo)
      this.loading = true
      let processDictRes = await processDict({orderType: this.processKey, orderNo: this.orderNo})
      let approveRes = await getApproveList({filingNo: this.orderId})
      // console.log(1666, processDictRes)
      // console.log(9999901, approveRes)
      this.stepList = processDictRes.data
      if(this.processKey == 'bpm_sbbx' && this.repairType != '3') {
        this.stepList = this.stepList.filter(item => item.node != 'hussar_6' && item.node != 'hussar_8')
        for(let i=0; i<this.stepList.length; i++) {
          if(this.currentSteps == this.stepList[i].node) this.active = i
        }
      }else if (this.processKey == 'bpm_sbbx' && this.repairType == '3'){
        this.stepList = this.stepList.filter(item => item.node != 'hussar_12')
        for(let i=0; i<this.stepList.length; i++) {
          if(this.currentSteps == this.stepList[i].node) this.active = i
        }
      }
      if (this.processKey == 'bpm_sbty' && this.creatType == '0'){
        this.stepList = this.stepList.filter(item => item.node != 'hussar_411')
        for(let i=0; i<this.stepList.length; i++) {
          if(this.currentSteps == this.stepList[i].node) this.active = i
        }
      }
      for(let i=0; i<this.stepList.length; i++) {
        let item = this.stepList[i]
        // console.log(98, this.currentSteps, i, item)
        if(this.currentSteps == item.node) {
          if( item.type == '2' ){ // 自动归档
            this.active = this.stepList.length
          }else{
            this.active = i
          }
        }
        item.description = {}
        for(let j=0; j<approveRes.data.length; j++) {
          if(item.node === approveRes.data[j].nodeId) {
            item.description = approveRes.data[j]
            break;
          }
        }
      }

      // console.log(111, this.status, this.active)
      // // 设置归档节点
      // if(this.status) this.active = this.stepList.length
      // console.log(222, this.status, this.active)

      this.loading = false
    },
    getCurrentStep() {
      if(this.orderCode) {
        // processCurrentUserInfo({businessKey: this.orderCode}).then(res => {
        //   this.currentUserList = res.data
        // })
        queryAssignee({businessKey: this.orderCode}).then(res => {
          // console.log(999122, res.data)
          this.currentUserList = res.data
        })
      }
    },
    sendMessage(row) {
      let params = {
        filingCode: this.orderCode,
        phone: row.phone,
        type: this.processKey,
      }

      pressDo(params).then(res=>{
        this.$message.success("操作成功！")
      })
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-step.is-center .el-step__line{
  left: 65%;
  right: -50%;
  width: 70%;
}
::v-deep .el-step__head.is-process{
  color: #409EFF;
  border-color: #409EFF;
}
::v-deep .el-step__title.is-process{
  color: #409EFF;
}
::v-deep .el-step.is-vertical .el-step__title{
  font-size: 15px;

}

::v-deep .el-step__head.is-wait {
   .el-step__line{
     border: 0.5px dashed #C0C4CC;
     background-color: transparent;
     height: 0.1px;

  }

}

::v-deep .el-step__title.is-success{
    color:#409EFF;
    font-weight: 700;

}

::v-deep .el-step__description.is-success{
      color:#333333;
      font-size: 12px;
}

::v-deep .el-step__head.is-process{
  .el-step__line{
     border: 0.5px dashed #C0C4CC;
     background-color: transparent;
     height: 0.1px;

  }
}
::v-deep .el-step__head.is-success{
  .is-text{
    background: #409EFF;
    border-color:#409EFF;
  }
  .el-step__line{
     border: 0.5px dashed #409EFF;
     background-color: transparent;
     height: 0.1px;
  }

 .el-step__line-inner{
    border-width: 0px !important;
    width:0px  !important;
  }

}

.setp_list{
  min-height: 100px
}
.audit_remark{
  background-color: #EBEEF5;
  line-height: 14px;
  padding: 10px;
  color: #909399;
  margin-left: 30px;
  border-radius: 4px;

}
.audit_info{
  padding-left: 10px;
  font-size: 14px;
  margin: 8px 0 5px;
  i{
    color: #409EFF;
    font-size: 16px;
    margin-right: 15px;
  }
  span{
    color: #46506d;
  }
}

::v-deep .stepBottom .el-step:last-of-type .el-step__description, .el-step:last-of-type .el-step__main {
    padding-right: 10%;
}
</style>
