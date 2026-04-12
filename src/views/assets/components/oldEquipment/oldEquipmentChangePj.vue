<template>
  <div class="wrap">
      <basic-container>
      <div class="page_form">
      </div>
      <div class="page_body">
        <formTitle :titleText="'完善自评信息'" :titleType="'page_title'">
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
          <el-table-column type="index" label="序号"  width="50"  align="center"></el-table-column>
          <el-table-column type="selection"  fixed="left"  width="50"   align="center"></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" min-width="250"  align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceTypeName" label="设备类型"   min-width="250"   align="center" show-overflow-tooltip></el-table-column>
          <el-table-column  prop="isChange" label="自评是否更换"   min-width="350" align="center" show-overflow-tooltip>
             <template slot-scope="scope">       
                 <el-select v-model="scope.row.isChange" placeholder="">
                  <el-option  v-for="dict in isOrNotList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                </el-select>
              </template>
          </el-table-column >
          <el-table-column  prop="changeReason" label="修改原因"  min-width="350"  align="center" show-overflow-tooltip>
             <template slot-scope="scope">
                 <el-input v-model="scope.row.changeReason"></el-input>
              </template>
          </el-table-column > 
        </el-table>

        <div class="form-btn">
        <el-button
          type="primary"
          size="small"
          style="margin-left: 50px;margin-bottom:10px"
          @click="handleSave"
        >保存
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
import {getDictList} from "@/api/dict";
import {updateDeviceEvalute} from "@/api/device/oldEquipmentLibrary.js";

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

      ],
      tableHeight: '550px',
      loading: false,
      total: 0,
      selectList: [],
      list: [],
      active:1,
      isEdit:false,
      isOrNotList:[],
      scale:1,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"]),
  },
 async  mounted(){
    
    this.setTableHeight();
  await  this.getDictList("needNo");
       this.tableData = this.$route.query.data;
      this.scale = document

  },
  methods: {
     select(val) {
      this.selectList = val;
    },
     async getDictList(code) {
      await   getDictList(code).then(res => {
            if(code === 'needNo'){
             this.isOrNotList = res.data;
          }
        });
      },

      handleCancel(){
        this.$closePage("/assets/oldEquipmentLibrary");
     },

    handleSave() {
      if (this.tableData.length == 0) {
        this.$message.warning("当前暂无数据!")
        return
      }
      
      let list = [];
      if(this.selectList.length === 0){
          list = [...this.tableData];
      }else{
        list = [...this.selectList];
      }

      let canSave = true;
      list.map((item,index)=> {
         if(!item.isChange){
          let tip = '第' + (index + 1)+ '条数据自评是否更换不能为空'
           this.$message.warning(tip)
           canSave = false;
           return
         }
          if(!item.changeReason){
          let tip = '第' + (index + 1)+ '条数据自评更换原因不能为空'
           this.$message.warning(tip)
           canSave = false;
           return
         }
      })

      if(canSave == true){
              updateDeviceEvalute(list).then((res) => {
        if (res.code != 200) {
          throw res.msg;
        }
        this.$message({
          message: "字段修改成功",
          type: "success",
        });

         this.$closePage("/assets/oldEquipmentLibrary");
       });
      }
    },
   
    // 设置表格高度
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      // console.log(pageBody[0].offsetHeight);
      this.tableHeight = pageBody[0].offsetHeight + 'px'
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
