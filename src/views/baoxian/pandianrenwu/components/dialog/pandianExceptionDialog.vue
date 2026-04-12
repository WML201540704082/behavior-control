<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="盘点异常信息处置"
      width="700px"
      top="10vh"
      v-el-drag-dialog
    >

   

      <el-form
        :model="form"
        ref="form"
        label-suffix=":"
        label-width="100px"
        size="small"
      >

       <formTitle :titleText="'提交人信息'" :titleType="'page_title'" class="page_re"></formTitle>
    <el-descriptions style="padding:10px 10px ">
        <el-descriptions-item label='提交人'>{{form.subPerson}}</el-descriptions-item>
        <el-descriptions-item label='提交人联系方式'>{{form.subTel}}</el-descriptions-item>
        <el-descriptions-item label='提交人所在部门'>{{form.subDept}}</el-descriptions-item>
        <el-descriptions-item label='提交时间'>{{form.subTime}}</el-descriptions-item>
        <el-descriptions-item label='关联盘点任务'>{{form.taskName}}</el-descriptions-item>
        <el-descriptions-item label='关联盘点任务编号'>{{form.taskNo}}</el-descriptions-item>
    </el-descriptions>

   <formTitle :titleText="'变更内容'" :titleType="'page_title'" class="page_re"></formTitle>
     <div class="page_form">
          <el-table
            ref="tableData"
            size="small"
            :data="tableData"
            v-loading="loading"
            row-key="id"
          >
            <el-table-column prop="property" label="属性名称"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="lastComment" label="修改前"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="newComment" label="修改后"  align="center" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>

       <div v-if="!onlyRead">
            <formTitle :titleText="'处置意见'" :titleType="'page_title'" class="page_re"></formTitle>

        <el-form-item  label="请选择" prop="opearteResult" :rules="[{ required: true, message: '请选择处置意见', trigger: 'change'}]">
          <el-radio-group v-model="form.opearteResult">
            <el-radio :label="1">同意</el-radio>
            <el-radio :label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input v-model="comment" type="textarea" placeholder="请输入审批意见（《300字）" :rows="5"></el-input>
        </el-form-item> 
       </div>

       <div v-else>
           <formTitle :titleText="'处置信息'" :titleType="'page_title'" class="page_re"></formTitle>
            <el-descriptions style="padding:10px 10px " >
           <el-descriptions-item label='处置人'>{{form.disPerson}}</el-descriptions-item>
        <el-descriptions-item label='处置人联系方式'>{{form.disTel}}</el-descriptions-item>
        <el-descriptions-item label='处置人所在部门'>{{form.disDept}}</el-descriptions-item>
        <el-descriptions-item label='处置时间'>{{form.disTime}}</el-descriptions-item>
        <el-descriptions-item label='处置结果'>{{form.disposeResult == 1 ? '同意' : '驳回'}}</el-descriptions-item>
        <el-descriptions-item label='处置意见'>{{form.disComment}}</el-descriptions-item>
    </el-descriptions>
       </div>
      
        <div class="form-btn">
          <el-button type="primary" @click="submitOperate" :loading="loading">确定</el-button>
          <el-button type="primary" plain @click="$emit('close')">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  pandianTaskDeviceInfo,pandianTaskDeviceApprove} from "@/api/shujubaoxian/pandianTask";
export default {
     props: ['isShow','taskId','onlyRead','filingNo'],
    data(){
        return{
  form:{
              opearteResult:'',
            },   
                     comment:'',
            isApproval:false,
        }
    },

    methods:{
        submitOperate(){
          if(this.onlyRead){
            this.$emit('close')
            return;
          }
           pandianTaskDeviceApprove({id:this.taskId,disposeResult:this.form.opearteResult,editType:'0',disComment:this.comment,
            filingNo:this.filingNo,workerStatus:this.form.opearteResult == 1 ? '0' :'1'}).then((res) => {
             if(res.code == 200){
             this.$message({
                type: "success",
                message: "处置成功!"
              });
              this.$emit('refresh')
        }
      }).catch(err=>{
        // console.log(err,'错误信息=============');
      }); 
        },
          loadDetail() {
          pandianTaskDeviceInfo({id:this.taskId,editType:'1'}).then((res) => {
             if(res.code == 200){
             this.form = res.data;
             this.tableData = JSON.parse(res.data.changeContent);
             this.tableData = this.tableData.filter(item=> item.property.includi )
            //  console.log(this.tableData);


        }
      });
     },

        
    },
    mounted(){
      this.loadDetail();
    },
   
    
}
</script>

<style lang="scss" scoped>

/deep/ .el-descriptions-item__content{
  color:#909399
}

.page_re{
  border-bottom: 0px !important;
}
</style>