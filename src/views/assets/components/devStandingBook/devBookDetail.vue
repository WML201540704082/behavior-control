<template>
  <div class="xt_page_box">
    <div class="page_form"></div>
    <div class="page_body">
      <el-scrollbar style="height:100%">
        <el-form
          label-width="150px"
          label-suffix=":"
        >
          <devBookTitleDetail :formValue="titleFormData"
                              :ciName="$route.query.ciName"
                              :deviceStatus='deviceStatus'
                              ref="DeviceStatus"></devBookTitleDetail>
          <devBookMainDetail :bookDetailForm="bookDetailForm"
                             :bookHideDetailForm="bookHideDetailForm"
                             :attrList="attrList"
                             :titleFormData="titleFormData"
                             :is-edit.sync="isEdit"
                             @editClick="edit"
                             v-if="!pageLoading"></devBookMainDetail>
          <div v-else v-loading="pageLoading" style="height: 400px"></div>
        </el-form>


        <devBookDetialDialog
          v-if="showEdit"
          :isShow="showEdit"
          :ciId="$route.query.ciId"
          :configId="$route.query.devId"
          :editParams="editParams"
          @refreshDetial="refreshDetial"
          @close="showEdit= false">
        </devBookDetialDialog>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {devBookDetail, cmdbciattrgradePage} from "@/api/assets/devStandingBook"
import {cilistattr} from "@/api/system/ciModel";
import devBookTitleDetail from './devBookTitleDetail'
import devBookMainDetail from './devBookMainDetail'
import devBookDetialDialog from "./components/devBookDetialDialog"

export default {
  props: ['isEdit'],
  components: {
    devBookTitleDetail,
    devBookMainDetail,
    devBookDetialDialog
  },
  data() {
    return {
      showEdit: false,
      editParams: {
        tabsList: {},
        formData: {}
      },
      pageLoading: true,
      bookDetailForm: {},
      bookDetailFormEdit: {},
      bookHideDetailForm: {}, //隐藏数据详情
      deviceStatus: "",
      titleFormData: {
        receiveUnit: undefined,
        receiveDept: undefined,
        receivingPerson: undefined,
        user: undefined,
        IP: undefined,
        installationSite: undefined,
        receivingTel: undefined,
        userTel: undefined,
        MAC: undefined,
        deviceName: undefined,
        firstOprtDate: undefined,
        oprtDate: undefined,
        useAge: undefined,
        deviceStatus: undefined,
        deviceCategoryCode: undefined,
        deviceCode: undefined,
        deviceType: undefined,
        sn: undefined,
        deviceModel: undefined,
        brand: undefined,
        fullName: undefined,
        ownerUnit: undefined,
        assetCodeErp: undefined
      },
      attrList: [],
    }
  },
  mounted() {
    // 设置页面元素高度
    this.setPageContentHeight(undefined, undefined, true)
    this.refreshDetial();

  },
  methods: {
    async refreshDetial() {
      this.pageLoading = true
      await this.getAttr()
      await this.getDetail()
      this.pageLoading = false
      this.isEdit = this.$route.query.isEdit;
    },
    edit() {
      this.editParams.ciName = this.$route.query.ciName;
      this.editParams.devDetail = this.bookDetailFormEdit;
      this.editParams.devid = this.$route.query.devId;
      this.editParams.ciId = this.$route.query.ciId;
      this.editParams.uuid = this.$route.query.uuid;

      this.showEdit = true;
    },
    async getAttr() {
      await cmdbciattrgradePage({
        // showType: 'detail',
        ciId: this.$route.query.ciId,
      }).then(res => {
        this.attrList = res.data.records
        // console.log(889, this.attrList)
        this.attrList.forEach(ele=>{
          if(ele.name.includes('deviceTyp') ){
            // console.log(222, ele)
          }
        })
        this.$forceUpdate()
      })

    },
    async getDetail() {
      let form = {
        ciId: this.$route.query.ciId,
        ciEntityId: this.$route.query.devId,
        needAction: true
      }
      await devBookDetail(form).then(res => {
        // 处理头部表单
        for (let key in this.titleFormData) {
          for (let i = 0; i < this.attrList.length; i++) {
            let item = this.attrList[i]
            if (item.name === key) {
              // console.log(123, item)
              this.titleFormData[key] =
                res.data.Return.attrEntityData['attr_' + item.id] == undefined ? '' : res.data.Return.attrEntityData['attr_' + item.id].valueList[0]
              break;
            }
          }
        }
        this.titleFormData.deviceType = res.data.Return.ciLabel
        let resData = res.data.Return
        for (let key in resData.attrEntityData) {
          let dataItem = resData.attrEntityData[key]
          //console.log(dataItem.label)
          this.$set(this.bookDetailForm, dataItem.name, dataItem.actualValueList[0])
          if (dataItem.actualValueList && dataItem.actualValueList.length > 0) {
            this.$set(this.bookDetailFormEdit, dataItem.name, dataItem.valueList[0])
          }
        }


        // //治理时间、数据来源 特殊处理
        // let gtime = resData.attrEntityData[`attr_${this.$store.state.common.govern.governTime}`];
        // this.$set(this.bookDetailForm, 'governTime', gtime?gtime.actualValueList[0]:null);
        // let dataSource = resData.attrEntityData[`attr_${this.$store.state.common.govern.dataSource}`];
        // this.$set(this.bookDetailForm, 'dataSource', dataSource?dataSource.actualValueList[0]:null);

        // for (const dataSourceKey in this.bookDetailFormEdit) {
        //   console.log(dataSourceKey,this.bookDetailFormEdit[dataSourceKey])
        // }


        for (let key in resData.attrEntityData) {
          let dataItem = resData.attrEntityData[key]
          this.$set(this.bookHideDetailForm, dataItem.name, dataItem.valueList[0])
          this.bookHideDetailForm.ciId = resData.ciId
          this.bookHideDetailForm.ciIcon = resData.icon
          this.bookHideDetailForm.authData = resData.authData
          this.bookHideDetailForm.ciLabel = resData.label
          this.bookHideDetailForm.ciName = resData.name
          this.bookHideDetailForm.maxAttrEntityCount = 999999999
          this.bookHideDetailForm.maxRelEntityCount = 999999999
          this.bookHideDetailForm.uuid = resData.uuid
          this.bookHideDetailForm.id = resData.id


          if (dataItem.label === '设备状态') {
            this.deviceStatus = dataItem.actualValueList[0];
            this.$refs.DeviceStatus.getDeviceStatus(this.deviceStatus,);
          }

          if (dataItem.label === '设备分类名称') {
            this.$refs.DeviceStatus.getDeviceType(dataItem.actualValueList[0]);
          }

        }
      })
    }
  }
}
</script>
