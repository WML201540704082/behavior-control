<template>
  <div class="wrap">
      <basic-container>
      <div class="page_form">

        <div class="step_content">
            <el-steps :active="0" finish-status="success" align-center>
            <el-step title="选择设备"></el-step>
            <el-step title="完善自评信息"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        </div>


          <formTitle :titleText="'添加设备'" :titleType="'page_title'">
        </formTitle>

        <el-form
          ref="searchForm"
          :model="searchForm"
          label-suffix=":"
          label-width="100px"
          class="xt_search_form"
        >

        <el-row :gutter="6">
         <el-col :span="6">
              <el-form-item label="设备分类" prop="deviceCategory">
                <el-select v-model="searchForm.deviceCategory"  placeholder="请选择设备分类" clearable @change="deviceCategoryCodeChange" disabled>
                  <el-option  v-for="dict in deviceCategoryList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备类型" prop="deviceType" >
                <el-select v-model="searchForm.deviceType"  placeholder="请输入设备类型" clearable >
                  <el-option  v-for="dict in deviceTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

              <el-col :span="6">
              <el-form-item label="设备状态" prop="deviceStatus">
              <el-select v-model="searchForm.deviceStatus" clearable placeholder="请选择设备状态"  @change="deviceStatusCodeChange">
                <el-option v-for="dict in deviceStatusList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
            </el-col>

              <el-col :span="6">
            <el-form-item label="设备来源" prop="deviceSourceCode">
              <el-select v-model="searchForm.deviceSourceCode" placeholder="请选择设备来源" clearable  @change="deviceSourceCodeChange">
                <el-option v-for="dict in deviceSourceList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

             </el-row>



          <el-row :gutter="6">

          </el-row>
          <el-row :gutter="6">
            <el-col :span="6">
              <el-form-item label="设备编码" prop="deviceCode">
                <el-input v-model="searchForm.deviceCode" placeholder="请输入设备编码"></el-input>
              </el-form-item>
            </el-col>

             <el-col :span="6">
            <el-form-item label="投运年限" prop="useAge">
                <div class="pj_content">
                    <el-input v-model="searchForm.beginAge"  placeholder="请输入最低年限" clearable ></el-input>
              - <el-input v-model="searchForm.endAge"  placeholder="请输入最高年限" clearable ></el-input>
                </div>

            </el-form-item>
          </el-col>

          <el-col :span="6">
              <el-form-item label="所属机房" prop="roomCode" >
                <el-select v-model="searchForm.roomCode" placeholder="请选择所属机房" clearable >
                  <el-option  v-for="dict in roomList" :key="dict.uuid"  :label="dict.roomName" :value="dict.uuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </div>
      <div class="page_body">
        <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="searchReset" plain>重置</el-button>
            <!-- <el-button type="primary" icon="el-icon-plus" @click="handleSubmit">提交</el-button> -->
          </div>
        </formTitle>
        <el-table
          ref="dataTable"
          size="small"
          @selection-change="select"
          :data="tableData"
          v-loading="loading"
          height="400px"
          row-key="id"
        >
          <el-table-column  type="selection" width="50"  fixed="left" align="center"></el-table-column >
          <el-table-column  type="index" label="序号"  width="50" align="center"></el-table-column >
          <el-table-column  prop="deviceCode" label="设备编码"  min-width="200" align="center" show-overflow-tooltip></el-table-column >
          <!-- <el-table-column  prop="deviceCategory" label="设备分类" width="100" align="center" show-overflow-tooltip></el-table-column > -->
          <el-table-column  prop="deviceType" label="设备类型"  min-width="120"  align="center" show-overflow-tooltip></el-table-column >
          <el-table-column  prop="oprtDateFirst" label="首次投运日期"  min-width="120"  align="center" show-overflow-tooltip></el-table-column >
         <el-table-column  prop="useAge" label="投运年限"   min-width="120"  align="center" show-overflow-tooltip></el-table-column >
          <el-table-column  prop="referenceAge" label="参考年限"  min-width="120"  align="center" show-overflow-tooltip></el-table-column >

          <el-table-column  prop="afterSaleExpDate" label="售后服务到期日期"  min-width="200"  align="center" show-overflow-tooltip></el-table-column >
          <el-table-column  prop="computerRoom" label="所属机房"  min-width="150"  align="center" show-overflow-tooltip></el-table-column >
          <el-table-column  prop="roomType" label="机房类型"  min-width="150" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.roomType, roomTypeList) }}</span>
          </template>
          </el-table-column >
          <el-table-column  prop="deviceStatus" label="设备状态"   min-width="120" align="center" show-overflow-tooltip></el-table-column >
          <el-table-column  prop="deviceSource" label="设备来源"  min-width="120"  align="center" show-overflow-tooltip></el-table-column >
          <el-table-column  prop="deviceCategory" label="设备分类"   min-width="120" align="center" show-overflow-tooltip></el-table-column >
        </el-table>

      <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"
        />

        <div class="form-btn">
        <el-button
          type="primary"
          size="small"
          style="margin-left: 50px;margin-bottom:10px"
          @click="nextClick"
        >下一步
        </el-button
        >
        <el-button
          class="border-btn"
          size="small"
          @click="handleCancel"
          style="margin-left: 50px;margin-bottom:10px"
        >取消
        </el-button
        >
      </div>
      </div>
      </basic-container>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import {getDictCmdbList,getDictCmdbListPid,getDictList} from "@/api/dict";
import {getRoomList} from "@/api/device/resoureroom";
import {getDeviceList} from "@/api/device/oldEquipmentLibrary.js";
export default {
  props: {
  },
  data() {
    return {
      isShow: true,
      searchForm: {
        current: 1,
        size: 20,
        deviceStatus:'',
        deviceType:'',
        deviceSourceCode:'',
      },
      // 表格
      tableData: [
        {eprNum: 2023},
        {eprNum: 220},
      ],
      tableHeight: '550px',
      loading: false,
      total: 0,
      selectList: [],
      list: [],
      deviceCategoryList:[],
      deviceTypeList:[],
      deviceStatusList:[],
      afterSaleStatusList:[],
      deviceSourceList: [],
      roomList:[],
      roomTypeList:[],

    };
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"]),
    isVisible: {
      get() {
        return this.isVisible
      },
      set(val) {
        this.$emit("update:isShow", val)
      }
    }
  },
  async mounted(){

    this.$EventBus.$on('onClosePage',()=>{
      this.$closePage("/assets/oldEquipmentLibrary");

    })
    //加载字典--设备分类
 await this.getCmdbDictList("1097745625841664");
     this.searchForm.deviceCategory = this.deviceCategoryList.filter(item=> item.dictValue ==='基础设施')[0].dictKey;
    this.searchForm.deviceCategoryName =  this.deviceCategoryList.filter(item=> item.dictValue ==='基础设施')[0].dictValue;
    let dictKey = this.deviceCategoryList.filter(item=> item.dictValue =='基础设施')[0].dictKey;
    this.getDictCmdbListPid('1097745969774592',dictKey);
    //加载字典--设备状态
  await this.getCmdbDictList("1103423111233536");
      this.searchForm.deviceStatus = this.deviceStatusList.filter(item=> item.dictValue ==='在运')[0].dictKey;
     //加载字典--机房列表
    this.getRoomList();
    //机房类型
    await this.getDictList("room_type");
    //设备来源
     await this.getCmdbDictList("1102860579569664");
    this.searchForm.deviceSourceCode = this.deviceSourceList.filter(item=> item.dictValue === '统一纳管')[0].dictKey;
    this.getList()
  },
  methods: {
    handleCancel(){
       this.$closePage("/assets/oldEquipmentLibrary");

    },
    getRoomList(){
      getRoomList({current:1,size:999999,maintenanceUnit:this.userDetail.ownerUnit}).then(res => {
          this.roomList = res.data.records;
        })
    },
     showDictLable(code, dictList) {
      //字典回显
      if (dictList != null && code != '') {
        let items = dictList.filter(item => item.dictKey == code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }
      }
      return code;
    },

     async getDictList(code) {
        await getDictList(code).then(res => {
          if (code === "room_type") {
            this.roomTypeList = res.data;
          }
        });
      },

  async getCmdbDictList(code){
      //加载cmdb字典
      let query = {}
      query.ciId = code||'1082372687986688'
    await  getDictCmdbList( query ).then(res => {
        if(code =='1103423111233536'){
          // 设备状态
          this.deviceStatusList  = res.data.filter(item=> item.dictValue !== '待报废' && item.dictValue !== '已报废')

        }else if(code == '1097745625841664'){
          this.deviceCategoryList  = res.data;
        }else if (code == '1102860579569664') {
          this.deviceSourceList = res.data;
        }else{
            this.afterSaleStatusList = res.data;
        }

      });
    },
    getDictCmdbListPid(ciId, pid){
      getDictCmdbListPid({ ciId: ciId, pid: pid }).then(res => {
        if(ciId==='1097745969774592'){ // 设备类型
          this.deviceTypeList = res.data
        }
      });
    },
    deviceCategoryCodeChange(code){
      //设备分类选择
      this.searchForm.deviceType = undefined
      this.searchForm.deviceTypeName = undefined
      // this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));
      this.getDictCmdbListPid('1097745969774592', code) // 设备类型
    },

    deviceStatusCodeChange(code){
      this.searchForm.deviceStatus = code;
      this.$forceUpdate();
      // this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));
    },

    deviceSourceCodeChange(code){
      this.searchForm.deviceSourceCode = code;
      this.$forceUpdate();
    },

    handleReset() {
      this.isVisible = false
    },
    handleSelect(row){
        this.$refs.dataTable.toggleRowSelection(row);

    },
    select(val) {
      this.selectList = val;
    },
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 50 - 47 + 'px'
    },

    getList() {
      this.tableLoading = true
      getDeviceList(this.searchForm).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    handleQuery() {
      this.searchForm.current = 1
      this.getList()
    },
    // 重置
    searchReset() {
       this.searchForm = {
        current: 1,
        size: 20,
      };
      this.searchForm.deviceCategory = this.deviceCategoryList.filter(item=> item.dictValue ==='基础设施')[0].dictKey;
      this.searchForm.deviceCategoryName =  this.deviceCategoryList.filter(item=> item.dictValue ==='基础设施')[0].dictValue;
      this.getList()
    },
    beforeCloseHandler() {
      //点击关闭按钮
      this.$emit('close')
      this.isVisible = false
    },
    nextClick(){
       if (this.selectList.length == 0) {
        this.$message.warning("请选择一条数据!")
        return
      }

       this.$router.push({
        path: '/detailRoute',
        query: {
          data:this.selectList,
          componentName: 'oldEquipmentEdit',
          routerTitle: '老旧设备自评库编辑详情'
        }
      });
    },
  }
};
</script>
<style lang='scss' scoped>
.wrap {
  width: 100%;
}

::v-deep .el-select {
  width: 100% !important;
}

.pj_content{
  display: flex;
}

.step_content{
   width: 100%;
   padding-left: 10%;
}
::v-deep .el-steps--horizontal .el-step.is-horizontal{
 flex-basis: 30% !important;
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

</style>
