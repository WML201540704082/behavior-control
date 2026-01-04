<template>
  <component
    :is="componentName"
    :formRouter="formRouter"
  ></component>
</template>

<script>
import terminalAdd from "@/views/terminal/terminalList/terminalAdd.vue"
import userAdd from "@/views/terminal/userManagement/userAdd.vue"
import systemAdd from "@/views/monitoring/networkAccess/systemMaintenance/systemAdd.vue"



import devRecordAdd from "@/views/device/components/devRecord/devRecordAdd.vue"
import devApplyAdd from "@/views/device/components/devApply/devApplyAdd"
import devScrappedAdd from "@/views/operation/components/devScrapped/devScrappedAdd"

import devRecordDetail from "@/views/device/components/devRecord/devRecordDetail.vue"
import capitalTransferAdd from "@/views/device/components/capitalTransfer/capitalTransferAdd"
import capitalTransDetail from "@/views/device/components/capitalTransfer/capitalTransferDetail"
import racksForm from "@/views/assets/components/recourceForm/racksAddOrUpdate"
import cabinetsForm from "@/views/assets/components/recourceForm/cabinetsAddOrUpdate"
import roomForm from "@/views/assets/components/recourceForm/roomAddOrUpdate"
import roomDetail from "@/views/assets/components/comdevManage/roomDetail"
import devBookDetail from "@/views/assets/components/devStandingBook/devBookDetail"
import capitalTransferDetail from "@/views/device/components/capitalTransfer/capitalTransferDetail"
import devInBoundDetail from "@/views/device/devInBoundDetail"
import devApplyDetail from "@/views/device/components/devApply/devApplyDetail"
import warehouseForm from "@/views/device/warehouseForm"
import warehouseForm1 from "@/views/monitor/warehouseForm"
import devOutBoundAdd from "@/views/device/components/devOutBound/devOutBoundAdd"
import devOutBoundDetail from "@/views/device/components/devOutBound/devOutBoundDetail"
import devOperationAdd from "@/views/operation/components/devOperation/devOperationAdd"
import devOperationEdit from "@/views/operation/components/devOperation/devOperationEdit"
import devOperationDetail from "@/views/operation/components/devOperation/devOperationDetail"
import devChangeDetail from "@/views/operation/components/devChange/devChangeDetail.vue"
import devChangeAdd from "@/views/operation/components/devChange/devChangeAdd"

import devReturnedAdd from "@/views/operation/components/devReturned/devReturnedAdd"
import devScrappedDetail from "@/views/operation/components/devScrapped/devScrappedDetail"
import subnetInfo from '@/views/operation/safeaccess/components/subnet/subnetInfo'
import userInfo from '@/views/operation/safeaccess/components/useraccess/userInfo'
import devRepairAdd from '@/views/operation/components/devRepair/devRepairAdd'
import devRepairDetail from '@/views/operation/components/devRepair/devRepairDetail'

//盘点任务新增
import pandianTaskAdd from "@/views/baoxian/pandianrenwu/pandianTaskAdd"
//盘点任务详情
import pandianTaskDetail from "@/views/baoxian/pandianrenwu/pandianTaskDetail"
//盘点任务未完成审批详情
import pandianTaskProcessDetail from "@/views/baoxian/pandianrenwu/pandianTaskProcessApprove"

import cabinetsDetail from "../assets/components/comdevManage/cabinetsDetail";
import oldEquipmentDetail from '@/views/assets/components/oldEquipment/oldEquipmentDetail.vue'
import oldEquipmentSelect from '@/views/assets/components/oldEquipment/oldEquipmentDeviceSelect.vue'
import oldEquipmentEdit from '@/views/assets/components/oldEquipment/oldEquipmentDeviceEdit.vue'
import oldEquipmentChangePj from '@/views/assets/components/oldEquipment/oldEquipmentChangePj.vue'
import oldEquipmentUpload from '@/views/assets/components/oldEquipment/oldEquipmentUpload.vue'

import shebeiyidongDetial from "@/views/baoxian/shebeiyidonggaojing/shebeiyidongDetial.vue";

import dataListAdd from "@/views/dataSharing/components/dataList/dataListAdd"
import dataApplyAdd from "@/views/dataSharing/components/dataApply/dataApplyAdd"
import dataApplyDetail from "@/views/dataSharing/components/dataApply/dataApplyDetail"


export default {
  components: {
    terminalAdd,
    userAdd,
    systemAdd,




    dataListAdd,
    dataApplyAdd,
    dataApplyDetail,

    cabinetsDetail,
    devScrappedDetail,
    devRecordAdd,
    devRecordDetail,
    capitalTransferAdd,
    capitalTransDetail,
    roomForm,
    racksForm,
    cabinetsForm,
    devBookDetail,
    capitalTransferDetail,
    devInBoundDetail,
    warehouseForm,
    warehouseForm1,
    devApplyAdd,
    devApplyDetail,
    devOutBoundAdd,
    devOutBoundDetail,
    devOperationAdd,
    devOperationEdit,
    devOperationDetail,
    devChangeDetail,
    devScrappedAdd,
    devReturnedAdd,
    devChangeAdd,
    subnetInfo,
    userInfo,
    devRepairAdd,
    devRepairDetail,
    pandianTaskAdd,
    pandianTaskDetail,
    pandianTaskProcessDetail,
    oldEquipmentDetail,
    oldEquipmentSelect,
    oldEquipmentEdit,
    oldEquipmentChangePj,
    oldEquipmentUpload,
    shebeiyidongDetial
  },
  data() {
    return {
      componentName: '',
      formRouter: '',
    }
  },
  watch: {
    $route: {
      handler() {
        this.componentName = ''
        this.$nextTick(() => {
          this.componentName = this.$route.query.componentName
        })
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.formRouter = from.fullPath
    })
  },
  mounted() {
    this.componentName = this.$route.query.componentName
  },
  methods: {}
}
</script>
