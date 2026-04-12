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
          <div slot="rightBtnBox">
            <el-button type="primary" icon="el-icon-search" @click="handleEdit">{{btnTitle}}</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="handleDelete" plain>移除</el-button>
          </div>
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
          <el-table-column  type="selection"  width='50'  fixed="left" align="center"></el-table-column >
          <el-table-column  type="index" label="序号"  width='50'  align="center"></el-table-column >
          <el-table-column  prop="deviceCode" label="设备编码"  min-width='250'   align="center" show-overflow-tooltip></el-table-column >
          <el-table-column  prop="deviceType" label="设备类型" min-width='250'  align="center" show-overflow-tooltip></el-table-column >
          <el-table-column  prop="faultCount" label="近三年故障数"  min-width='250'  align="center"  show-overflow-tooltip>
             <template slot-scope="scope">
                 <el-input v-model="scope.row.faultCount" @input="faultCountChange($event,scope.row)" type="integer"></el-input>
              </template>
          </el-table-column >
          <el-table-column  prop="faultDetail" label="近三年故障描述"  min-width='250'  align="center" show-overflow-tooltip>
             <template slot-scope="scope">
                 <el-input v-model="scope.row.faultDetail" @input="faultDetailChange($event,scope.row)"></el-input>
              </template>
          </el-table-column >

         <el-table-column  prop="hiddenCount" label="近三年隐患数"  min-width='250'   align="center" show-overflow-tooltip>
             <template slot-scope="scope">
                 <el-input v-model="scope.row.hiddenCount"  @input="hiddenCountChange($event,scope.row)" type="integer"></el-input>

              </template>
          </el-table-column >


         <el-table-column  prop="hiddenDetail" label="近三年隐患描述"  min-width='250'   align="center" show-overflow-tooltip>
             <template slot-scope="scope">
                 <el-input v-model="scope.row.hiddenDetail" @input="hiddenDetailChange($event,scope.row)"></el-input>
              </template>
          </el-table-column >

        </el-table>


        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"
        />

      </div>

              <div class="form-btn">
            <el-button
          class="border-btn"
          size="small"
          @click="handleCancel"
          style="margin-left: 50px"
        >上一步
        </el-button
        >
        <el-button
          type="primary"
          size="small"
          style="margin-left: 50px"
          @click="handleSubmit"
        >下一步
        </el-button
        >

      </div>
      </basic-container>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import {selectOldDeviceSubmit} from "@/api/device/oldEquipmentLibrary.js";
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
      active:1,
      isEdit:false,
      btnTitle:'同步编辑',
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
  },
  methods: {

    faultCountChange(value,row){
      if(this.isEdit){
        this.tableData.forEach(item => {
          if(value == 'e' || value == 'E'){
            item.faultCount = '';
          }else{
             item.faultCount =  value.replace(/[^\d]/g,'')
          }

        });
      }else{
         if(value == 'e' || value == 'E'){
            row.faultCount = '';
          }else{
             row.faultCount =  value.replace(/[^\d]/g,'')
          }
      }
    },
    faultDetailChange(value,row){
      if(this.isEdit){
        this.tableData.forEach(item => {
          item.faultDetail = value;
        });
      }else{
         row.faultDetail = value;
      }
    },
    hiddenCountChange(value,row){
      if(this.isEdit){
        this.tableData.forEach(item => {
           if(value == 'e' || value == 'E'){
            item.hiddenCount = '';
          }else{
             item.hiddenCount =  value.replace(/[^\d]/g,'')
          }
        });
      }else{
         if(value == 'e' || value == 'E'){
            row.hiddenCount = '';
          }else{
             row.hiddenCount =  value.replace(/[^\d]/g,'')
          }
      }

    },
    hiddenDetailChange(value,row){
       if(this.isEdit){
        this.tableData.forEach(item => {
          item.hiddenDetail = value;
        });
      }else{
         row.hiddenDetail = value;
      }
      this.$forceUpdate();
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
      if (this.selectList.length == 0) {
         if(this.tableData.length > 0){
           paramsList = [...this.tableData];
         }
         else{
          paramsList = [];
          this.$message.warning("当前暂无设备!")
          return
         }


      }else{
          paramsList = [...this.selectList];
      }

    let canSave = true;
    if(paramsList.length > 0){
          paramsList.map((item,index)=> {
         if(!item.faultCount){
           this.$message.warning('存在必填项为空，请填写完整再保存！')
           canSave = false;
           return
         }
          if(!item.faultDetail){
         this.$message.warning('存在必填项为空，请填写完整再保存！')
           canSave = false;
           return
         }

          if(!item.hiddenCount){
          this.$message.warning('存在必填项为空，请填写完整再保存！')
           canSave = false;
           return
         }

          if(!item.hiddenDetail){
           this.$message.warning('存在必填项为空，请填写完整再保存！')
           canSave = false;
           return
         }
      })
   }

   if(canSave){
        selectOldDeviceSubmit(paramsList).then((res) => {
        if (res.code != 200) {
          throw res.msg;
        }
        this.active = 2;
        this.$message({
          message: "提交设备成功",
          type: "success",
        });
           this.$closePage("");

         setTimeout(() => {
           this.$EventBus.$emit('onClosePage');
         }, 100);

       });
   }





    },
    // 编辑
    handleEdit() {
       if(this.isEdit == false){
         this.$confirm('此操作将会同步所有设备数据的当前编辑选项，是否继续?','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning',
         }).then(()=>{
          this.isEdit = true;
          this.btnTitle = '取消同步编辑'

         }).catch(()=>{
          this.isEdit = false;
          this.btnTitle = '同步编辑'
         })
       }else{
         this.$message.warning('取消同步编辑');
         this.btnTitle = '同步编辑'
         this.isEdit = false;
       }
    },
    // 移除
    handleDelete() {
      this.tableData = this.tableData.filter(aItem => !this.selectList.some(bItem => bItem.deviceCode === aItem.deviceCode));
    },

    handleCancel(){
        this.$router.back();
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
