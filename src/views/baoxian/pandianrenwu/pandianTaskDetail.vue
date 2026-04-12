<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <el-scrollbar style="height: calc(100% - 50px)">
        <div style="width: 100%; height: 1px"></div>
        <template>
          <formTitle
            :titleText="'数据概览'"
            :titleType="'page_title'"
          ></formTitle>
          <el-row type="flex">
            <el-col :span="24" style="height: 120px">
               <div class="head_p">
                 <div class="headContent">
                    <img src='@/assets/pandianTask/pandian.png'>
                    <div class="num_content">
                      <p class="title">已盘</p>
                      <p class="num">{{form.isCheckNum}}</p>
                    </div>
                 </div>

                 <div class="headContent">
                    <img src='@/assets/pandianTask/pandian.png'>
                    <div class="num_content">
                      <p class="title">盘亏</p>
                      <p  class="num">{{form.pkProgress}}</p>
                    </div>
                 </div>


                 <div class="headContent">
                    <img src='@/assets/pandianTask/panying.png'>
                    <div class="num_content">
                      <p class="title">盘盈</p>
                      <p  class="num">{{form.pyProgress}}</p>
                    </div>
                 </div>



               </div>

            </el-col>
          </el-row>
        </template>
        <!-- 中间设备列表 -->

        <el-tabs v-model="active" type='card' @tab-click='handleTabClick' style="margin-top:20px">
           <el-tab-pane label="设备列表"  name='0'>
              <device-list ref="ref1" :taskId='taskId' @handleOpera="handleOpera"></device-list>
           </el-tab-pane>
           <!-- <el-tab-pane label="异常设备"  name='1'>
              <exception-records ref="ref2" :taskId='taskId' @handleOpera="handleOpera"></exception-records>
           </el-tab-pane> -->
           <el-tab-pane label="盘盈记录"  name='2'>
            <panying-recoreds ref="ref3" :taskId='taskId' @handleOpera="handleOpera"></panying-recoreds>
           </el-tab-pane>
           <el-tab-pane label="盘亏记录"  name='3'>
             <pankui-records-vue ref="ref4" :taskId='taskId' @handleOpera="handleOpera"></pankui-records-vue>
           </el-tab-pane>
        </el-tabs>

      </el-scrollbar>


      <!-- 底部按钮 -->
      <div class="form-btn" style="padding-top: 10px;">
        <el-button
          class="border-btn"
          size="small"
          @click="handleReset"
          style="margin-left: 50px"
        >返回
        </el-button>
      </div>
    </div>

  </basic-container>
</template>

<script>
import { scrapDetail } from "@/api/operation/deviceoperation";
import { getLogOptList } from "@/api/device/logopt";
import { getDictCmdbList } from "@/api/dict";
import { getRDeptrpList } from "@/api/device/devicerecord";
import { mapGetters } from "vuex";
import deviceList from '../pandianrenwu/components/view/deviceList'
import ExceptionRecords from '../pandianrenwu/components/view/exceptionRecords.vue';
import panyingRecoreds from '../pandianrenwu/components/view/panyingRecoreds.vue';
import pankuiRecordsVue from './components/view/pankuiRecords.vue';
import {pandianTaskDetail} from "@/api/shujubaoxian/pandianTask";

export default {
  components: {deviceList,ExceptionRecords,panyingRecoreds,pankuiRecordsVue},
  data() {
    return {
      fileList: [],
      showOperate: false,
      deviceStatusList: [],
      optList: [],
      deviceSelectSync: false,
      form: {},
      loading: false,
      deviceList: [],
      deviceTypeList: [{ name: "主机" }],
      active:"0",
      taskId:'',
    };
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  mounted() {
    // 设置页面元素高度
    this.setPageContentHeight();
    //加载字典--投运类型
    //获取参数 判断是否是新增还是修改
    const params = this.$route.query;
    this.taskId = params.taskId;
    this.active = params.index

    if (params.taskId) {
      this.active = params.index;
      this.loadDetail();
    }
  },
  methods: {
    handleOpera(){
      this.loadDetail()
      this.$refs.ref1.getDeviceList()
      // this.$refs.ref2.getDeviceList()
      this.$refs.ref3.getDeviceList()
      this.$refs.ref4.getDeviceList()
    },
    refresh(){
      this.loadDetail();
    },
    loadDetail() {
      pandianTaskDetail({id:this.taskId}).then((res) => {
        console.log(90, res)
        if(res.code == 200){
          this.form = res.data;

        }
      });
    },

    //返回
    handleReset() {
      this.$closePage("/baoxian/pandianrenwu");
    },
  },
};
</script>
<style lang="scss" scoped>
.devRenCon {
  width: 100%;
  height: 100%;
}
.formLabel {
  line-height: 16px;
  display: block;
}

.head_p{

  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  .headContent{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-right: 40px;
    height:80px;
    img{
      width:68px;
      height:71px;
    }
    .num_content{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 10px;
      .title{
        font-size: 14px;
      }
      .num{
        color: #409EFF;
        font-size: 20px;
        font-weight: 500;
      }
    }

  }
}
</style>
