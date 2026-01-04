<template>
  <div class="wrap">
      <basic-container>
      <div class="page_form">
        
        <div class="step_content">
            <el-steps :active="active" finish-status="success" align-center>
            <el-step title="选择设备"></el-step>
            <el-step title="完善自评信息"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        </div>
      </div>
      <div class="page_body">
        <formTitle :titleText="'完善自评信息'" :titleType="'page_title'">
          <!-- <div slot="rightBtnBox">
            <el-button type="primary" icon="el-icon-refresh" @click="handleDelete" plain>移除</el-button>
          </div> -->
        </formTitle>
        <el-table
          ref="dataTable"
          size="small"
          @selection-change="select"
          :data="tableData"
          v-loading="loading"
          height="600px"
          row-key="id"
        >
          <el-table-column type="selection" width="30" fixed="left" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" width="180" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceTypeName" label="设备类型" width="120" align="center" show-overflow-tooltip>

          </el-table-column>
          <el-table-column prop="faultCount" label="近三年故障数" width="80" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
                 <el-input v-model="scope.row.faultCount" ></el-input>

              </template>
          </el-table-column>
          <el-table-column prop="faultDetail" label="近三年故障描述" width="230" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
                 <el-input v-model="scope.row.faultDetail"  ></el-input>
              </template>
          </el-table-column>

         <el-table-column prop="hiddenCount" label="近三年隐患数" width="80" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
                 <el-input v-model="scope.row.hiddenCount" ></el-input>

              </template>
          </el-table-column>   
        
        
         <el-table-column prop="hiddenDetail" label="近三年隐患描述" width="230" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
                 <el-input v-model="scope.row.hiddenDetail" ></el-input>

              </template>
          </el-table-column>  

            <el-table-column prop="oprtDateFirst" label="上传证明材料" :min-width="300" :max-width="400" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
                 <uploadImage  ref="uploadImg"
            :type="'老旧设备'"
            :index='scope.row.index'
            :fileList.sync="fileList"
            @setVal="selectDeviceHandler"></uploadImage>
            </template>
          </el-table-column> 


        </el-table>

        <div class="form-btn">
        <el-button
          type="primary"
          size="small"
          style="margin-left: 50px;margin-bottom:10px"
          @click="handleSubmit"
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
import uploadImage from './uploadImage';
import {uploadFileForPingS} from "@/api/device/oldEquipmentLibrary.js";

export default {
  components:{
    uploadImage
  },
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
      },
      fileList:[],
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
      active:1,
      isEdit:false,
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
   mounted(){
    this.tableData = this.$route.query.data;
    // console.log( this.tableData,'11111111111');
  },
  methods: {
    handleCancel(){
        this.$closePage("/assets/oldEquipmentLibrary");
    },

     selectDeviceHandler(file,index) {
      
        this.tableData[index].deviceOldFileList = [];
        this.tableData[index].deviceOldFileList.push(file);  
    },
     select(val) {
      this.selectList = val;
    },

   
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 50 - 47 + 'px'
    },

    handleSubmit() {
      let paramsList = [];
      if (this.tableData.length == 0) {
        this.$message.warning("当前暂无数据!")
        return
      }else{
        if(this.selectList.length > 0){
           paramsList = this.selectList;
        }else{
          paramsList = this.tableData;
        }
      }
      uploadFileForPingS(paramsList).then(res => {
        if(res.code != 200){
          throw res.msg;
        }
        this.active = 2;
        this.$message.success("上报成功")
        this.$closePage("/assets/oldEquipmentLibrary");


      }).catch(() => {
      })

    },
    // 编辑
    handleEdit() {
       this.isEdit = true;
    },
    // 移除
    handleDelete() {
      this.tableData = this.tableData.filter(aItem => !this.selectList.some(bItem => bItem.deviceCode === aItem.deviceCode));
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
