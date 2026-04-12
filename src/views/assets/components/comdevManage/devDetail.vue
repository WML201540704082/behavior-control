<template>
  <div class="cabinetsDetail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="设备详情" name="0">
        <div class="table-form-box">
          <el-form
            ref="devDetail"
            :model="devDetail"
            label-width="100px"
            size="small"
            :disabled="true"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="设备编号" prop="deviceCode">
                  <el-input v-model="devDetail.deviceCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备名称" prop="deviceName">
                  <el-input v-model="devDetail.deviceName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="维护单位" prop="receiveUnit">
                  <el-input v-model="devDetail.receiveUnit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属机房" prop="computerRoom">
                  <el-input v-model="devDetail.computerRoom"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属机柜" prop="cabinet">
                  <el-input v-model="devDetail.cabinet"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="起始高度(U)" prop="deviceHeightBegin">
                  <el-input v-model="devDetail.deviceHeightBegin"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="品牌" prop="brand">
                  <el-input v-model="devDetail.brand"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="系列" prop="series">
                  <el-input v-model="devDetail.series"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="型号" prop="deviceModel">
                  <el-input v-model="devDetail.deviceModel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备状态" prop="deviceStatus">
                  <el-input v-model="devDetail.deviceStatus"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="首次投运日期" prop="oprtDateFirst">
                  <el-input v-model="devDetail.oprtDateFirst"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="投运日期" prop="oprtDate">
                  <el-input v-model="devDetail.oprtDate"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出厂序列号" prop="sn">
                  <el-input v-model="devDetail.sn"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="ERP资产编码" prop="assetCodeErp">
                  <el-input v-model="devDetail.assetCodeErp"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="责任人" prop="receivingPerson">
                  <el-input v-model="devDetail.receivingPerson"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备分类" prop="deviceCategory">
                  <el-input v-model="devDetail.deviceCategory"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备类别" prop="deviceType">
                  <el-input v-model="devDetail.deviceType"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import {getRacksList,getDeviceList,getDeviceDetail} from "@/api/device/resoureracks";


  export default {
    components:{
    },
    props: ["devId","cabinetCode","rackCode","computerRoomCode","ciEntityId","ciId"],
    data(){
      return{
        showForm:false,
        searchForm: {
          current: 1,
          size: 20,

        },
        devDetail:{},
        tableHeight: undefined,
        tableLoading: false,
        total: 0,
        activeName: '0',
        tableData:[],
      }
    },
    watch: {
      ciId() {
        this.getDetail()
      },
      ciEntityId(){
        this.getDetail()
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.setTableHeight()
      })
      this.getDetail()
      this.getList()
    },
    methods: {
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 55 - 48 - 47 + 'px'
      },
      getDetail() {
        getDeviceDetail({ciEntityId:this.ciEntityId,ciId:this.ciId}).then(res => {
          this.devDetail = res.data
        })
      },
      getList() {

      },
      getDevice() {

      },
      search() {
        this.searchForm.current = 1
        this.getList()
      },
      // restForm() {
      //   this.searchForm = {
      //     current: 1,
      //     size: 20,
      //   }
      //   this.getList()
      // },
    }
  }
</script>
