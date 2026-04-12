<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <el-scrollbar style="height: calc(100% - 50px)">
       <div style="width: 100%;height: 1px;"></div>
      <template>
        <formTitle :titleText="'处理进度'" :titleType="'page_title'" style="margin-top: 0px;margin-bottom: 20px;"></formTitle>
        <el-row type="flex">
          <el-col :span="20" style="height: 110px;">
            <step
              :processKey="'bpm_pdrw'"
              :orderId="form.id"
              :orderCode="form.filingNo"
              v-if="form.id"
              :currentSteps="form.processStatus"
              :status="form.status"
            ></step>
          </el-col>
          
          <el-col span="4" style="height: 110px;">
              <div class="approve_status">
                <img src="@/assets/pandianTask/complish.png"  v-if="form.processStatus =='hussar_6'"/>
                <img src="@/assets/pandianTask/unComplish.png"  v-else/>
                
              </div>
          </el-col >
        </el-row>
      </template>
        <formTitle
          :titleText="'任务信息'"
          :titleType="'page_title'"
        ></formTitle>
        <!-- <el-scrollbar> -->


           <div class="info_form">
        <div class="form_box">
          <el-row>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">任务编号: </div>
              <div class="form_content">{{ form.filingNo }}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">任务名称: </div>
              <div class="form_content">{{ form.taskName }}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">发起单位: </div>
              <div class="form_content">{{ form.launchUnitName }}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">盘点时间: </div>
              <div class="form_content">{{ form.taskStartTime }}-{{form.taskEndTime}}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">发起人: </div>
              <div class="form_content">{{ userDetail.userName }}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">发起时间: </div>
              <div class="form_content">{{ form.createTime }}</div>
            </el-col>
            <el-col :span="6" class="form_item xt-font">
              <div class="form_label xt-font">备注: </div>
              <div class="form_content">{{ form.remark }}</div>
            </el-col>
          </el-row>
        </div>
     </div>

    

       
        
        <el-form
          :model="form"
          ref="dataForm"
          class="xt_form topHeight"
        >

          <el-row :span="12">
            <el-col :span="12">
              <el-form-item
                label="设备类型:"
                prop="applyPhone"
                :rules="[
                  { required: true, message: '设备类型', trigger: 'change' },
                ]"
              >
                <label
                  style="margin-right: 10px"
                  v-for="(item, index) in deviceTypeList"
                  :key="index"
                  >{{ item }}</label
                >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="部门范围:"
                prop="applyPhone"
                :rules="[
                  { required: true, message: '部门范围', trigger: 'change' },
                ]"
              >
                <label
                  style="margin-right: 10px"
                  v-for="(item, index) in deptList"
                  :key="index"
                  >{{item }}</label
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 中间设备列表 -->
        
         <el-table
          ref="deviceTable"
          :data="deviceList"
          v-loading="loading"
          size="small"
          height="275px"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column label="设备编码" prop='deviceCode' width="140" align="center">
          </el-table-column>

            <el-table-column
            prop="deviceCategory"
            label="设备分类"
            min-width="140"
            align="center"
          >
         <!-- <template  slot-scope="scope">
            <span>{{showLabel(scope.row.deviceCategory,deviceFenleiList)}}</span>
          </template> -->
          </el-table-column>

          <el-table-column
            prop="deviceType"
            label="设备类型"
            min-width="140"
            align="center"
          >
          <!-- <template  slot-scope="scope">
            <span>{{showLabel(scope.row.deviceType,deviceLeixingList)}}</span>
          </template> -->
          </el-table-column>

         

           <el-table-column
            prop="deviceStatus"
            label="设备状态"
            min-width="140"
            align="center"
          >
        
         <!-- <template  slot-scope="scope">
            <span>{{showLabel(scope.row.deviceStatus,deviceStatusList)}}</span>
          </template> -->

          </el-table-column>

 
          <el-table-column
            prop="user"
            label="使用责任人"
            min-width="140"
            align="center"
          >
        
          </el-table-column>
            <el-table-column
            prop="userTel"
            label="使用责任人联系方式"
            min-width="160"
            align="center"
          >
        
          </el-table-column>

                   <el-table-column
            prop="user"
            label="使用人"
            min-width="120"
            align="center"
          >
           
          </el-table-column>
          
          <el-table-column
            prop="receiveDept"
            label="所在部门"
            min-width="140"
            align="center"
          >
         
          </el-table-column>

   
          <el-table-column
            prop="installationSite"
            label="安装位置"
            min-width="140"
            align="center"
          >
        
          </el-table-column>  

        </el-table>

          <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getDeviceList"
        />

      
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
import { getLogOptList } from "@/api/device/logopt";
import { getDictCmdbList} from "@/api/dict";
import { getRDeptrpList } from "@/api/device/devicerecord";
import { mapGetters } from "vuex";
import {pandianTaskDetail,pandianTaskDetailDeviceList} from "@/api/shujubaoxian/pandianTask";
import step from "@/components/step/index"

export default {
      components: {step},

  data() {
    return {
      fileList: [],
      showOperate: false,
      deviceStatusList: [],
      optList: [],
      deviceSelectSync: false,
      form: {
        status:'1'
      },
      loading: false,
      deviceList: [],
      deviceTypeList: [],
      deptList:[],
      active:"first",
      formValue:{name:'123'},
      searchForm:{
        current:1,
        size:20,
      },
      deviceFenleiList:[],
      deviceLeixingList:[],
            total: 0,

    };
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
 async mounted() {
    // 设置页面元素高度
    this.setPageContentHeight();
    this.id = null;
    //获取参数 判断是否是新增还是修改
    const params = this.$route.query;
    this.id = params.id;

    if (params.id) {
      this.id = params.id;
      this.loadDetail(params.id);
      await this.getDeviceList();
      // this.getDeptList();
      this.getDeviceFenlei();
      this.getDeviceLeiXing();
      // this.loadLogOptDataList();
      // this.getScarpReason();
      // this.getDeptList();
    }
  },
  methods: {
     getDeviceFenlei(){
      //设备分类
         getDictCmdbList({ ciId: '1097745625841664' }).then(res => {
          this.deviceFenleiList = res.data;
        
      });
     },
     getDeviceLeiXing(){

         getDictCmdbList({ ciId: '1097745969774592'}).then(res => {
        this.deviceLeixingList =  res.data;
      });
     
    },
    getDeviceStatus(){
      
       getDictCmdbList({ ciId: '1103423111233536'}).then(res => {
        this.deviceStatusList =  res.data;
      });
    },
     showLabel(code,dictList){
      //字典回显
      if(dictList!=null && code!==''){
        let items = dictList.filter(item => item.dictKey==code);
        if(items!=null && items.length>0){
          return items[0].dictValue;
        }else{
          return '暂存'
        }
      }
      return code;
    },
    getScarpReason() {
      //加载字典
      getDictCmdbList({ ciId: "1131281812619264" }).then((res) => {
        this.form.scrapReason = res.data.filter(
          (item) => item.dictKey === this.form.scrapReason
        )[0].dictValue;
      });
    },
    getDeptList() {
      getRDeptrpList({
        swerk: this.userDetail.erpDeptCode || "AAAA",
        current: 1,
        size: 100,
      }).then((res) => {
        this.form.useKeepDept = res.data.records.filter(
          (item) => item.kostl === this.form.useKeepDept
        )[0].kostlT;
      });
    },

    loadLogOptDataList() {
      //加载操作记录
      let query = {};
      query.logId = this.id || "--";
      getLogOptList(1, 20, query).then((res) => {
        const data = res.data;
        this.optList = data.records;
      });
    },

    loadDetail() {
      pandianTaskDetail({id:this.id}).then((res) => {
        if(res.code == 200){
        this.form = res.data;
        this.deviceTypeList = this.form.deviceTypes.split(',');
        this.deptList = this.form.checkDepts.split(',');
        }
      });
    },


    getDeviceList(){
      
      this.loading = true
      this.searchForm.taskId = this.id;
      pandianTaskDetailDeviceList(this.searchForm).then(res => {
        this.deviceList = res.data.records
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
      width:60px;
      height:60px;
    }
    .num_content{
      display: flex;
      flex-direction: column;
       justify-content: center;
      align-items: center;
      margin: 10px 20px;
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

.info_form{

    display: flex;
    align-items: center;
    padding-left: 10px;
    flex-direction: row;
    .form_box{
      width: 100%;
      .form_item{
        display: flex;
        flex-direction: row;
        .form_label{
          line-height: 40px;
          font-size: 14px;
          white-space: nowrap;
          position: relative;
        }
        .form_content{
          flex: auto;
          overflow-x: hidden;
          line-height: 40px;
          font-size: 14px;
          padding-left: 15px;
        }
      }
    }
  }

.approve_status{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  img{
    width:88px;
    height: 77px;
  }
}
</style>
