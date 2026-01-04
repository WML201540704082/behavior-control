<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="设备盘盈信息处置"
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

       <formTitle :titleText="'设备信息'" :titleType="'page_title'" class="page_re"></formTitle>
        <el-table
            ref="dataTable"
            size="small"
            :data="tableData"
            v-loading="loading"
            row-key="id"
          >
            <el-table-column prop="attributeName" label="基本信息"  align="center" show-overflow-tooltip>
                 
               <template  slot-scope="scope">
                   <div class="description">
                        <p >出场序列号：{{scope.row.factorySerial ? scope.row.factorySerial: ''}}</p>
                        <p style="text-align:left">设备分类：{{scope.row.deviceCategory}}</p>
                        <p style="text-align:left">设备类型：{{scope.row.deviceType}}</p>
                        <p style="text-align:left">品牌/系列/型号：{{scope.row.brand}} / {{scope.row.series}}  / {{scope.row.deviceModel }}</p>                     
                        <p>标准全称：{{scope.row.fullName ? scope.row.fullName:''}}</p>
                        <p>是否信创设备：{{ showLabel(scope.row.isITAICode, dataList)}}</p>
                   </div>
                          
               </template>



            </el-table-column>
            <el-table-column prop="changeBefore" label="维护信息"  align="center" show-overflow-tooltip>
                             <template  slot-scope="scope">
               <div class="description">
                        <p >使用人属性：{{scope.row.userType ? scope.row.userType: ''}}</p>
                        <p style="text-align:left">使用人：{{scope.row.user ? scope.row.user : ''}}</p>
                        <p style="text-align:left">使用人联系方式：{{scope.row.userTel ? scope.row.userTel:''}}</p>
                        <p style="text-align:left">使用人身份证号：{{scope.row.deviceUserIDCard ? scope.row.deviceUserIDCard : ''}}</p>                     
                        <p>运行单位：{{scope.row.oprtDept ? scope.row.oprtDept:''}}</p>
                        <p>领用单位：{{scope.row.receiveUnit ? scope.row.receiveUnit:''}}</p>
                        <p>领用部门：{{scope.row.receiveDept ? scope.row.receiveDept:''}}</p>
                        <p>责任人：{{scope.row.receivingPerson ? scope.row.receivingPerson:''}}</p>
                        <p>责任人联系方式：{{scope.row.receivingTel ? scope.row.receivingTel:''}}</p>
                        <p>责任人身份证号：{{scope.row.receivingIDCard ? scope.row.receivingIDCard:''}}</p>

                   </div>
                                  </template>

            </el-table-column>
            <el-table-column prop="changeAfter" label="网络信息"  align="center" show-overflow-tooltip>
                             <template  slot-scope="scope">

               <div class="description">
                        <p >IP地址：{{scope.row.ip ? scope.row.ip: ''}}</p>
                        <p style="text-align:left">MAC地址：{{scope.row.mac ? scope.row.mac : ''}}</p>
                        <p style="text-align:left">是否临时：{{scope.row.isInterim ? scope.row.isInterim:''}}</p>
                        <p style="text-align:left">所属网络：{{scope.row.netWorkCode ? scope.row.netWorkCode : ''}}</p>
                        <p style="text-align:left">所属子网：{{scope.row.subnetName ? scope.row.subnetName : ''}}</p>
                        <p style="text-align:left">认证方式：{{scope.row.authentication ? scope.row.authentication : ''}}</p>                                                                                    
                        <p>安装地点：{{scope.row.installationSite ? scope.row.installationSite:''}}</p>
                        <p>投运日期：{{scope.row.oprtDate ? scope.row.oprtDate:''}}</p>
                   </div>
                                  </template>

            </el-table-column>
          </el-table>


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
        <el-descriptions-item label='关联投运工单' :contentStyle="{'color':'#409EFF',}">{{form.filingNo}}</el-descriptions-item>
        <el-descriptions-item label='处置意见'>{{form.disComment}}</el-descriptions-item>
    </el-descriptions>
       </div>
      
        <div class="form-btn">
          <el-button type="primary" @click="submitOperate">确定</el-button>
          <el-button type="primary" plain  @click="$emit('close')">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  pandianTaskDeviceInfo,pandianTaskDeviceApprove} from "@/api/shujubaoxian/pandianTask";
import { getDictCmdbList } from "@/api/dict";
export default {
    props: ['isShow','taskId','onlyRead'],
    data(){
        return{
            // opearteResult:0,
            comment:'',
            isApproval:true,
            tableData:[],
            form:{
              // opearteResult:'',
            },
            deviceCategoryList:[],
            deviceTypeList:[],
            isITAICodeList:[],
        }
    },
    methods:{
          showLabel(code, dictList) {
      //字典回显
      if (dictList != null && code !== "") {
        let items = dictList.filter((item) => item.dictKey == code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        } else {
          return "";
        }
      }
      return code;
    },

        submitOperate(){
          if(this.onlyRead){
            this.$emit('close')
            return;
          }
           pandianTaskDeviceApprove({id:this.taskId,disposeResult:this.form.opearteResult,editType:'1',disComment:this.comment}).then((res) => {
             if(res.code == 200){
             this.$message({
                type: "success",
                message: "处置成功!"
              });
            
            this.$emit('refresh');
        }
      }).catch(err=>{
        
      }); 
        },
          loadDetail() {
          pandianTaskDeviceInfo({id:this.taskId,editType:'1'}).then((res) => {
             if(res.code == 200){
             this.form = res.data;
             this.tableData = res.data.devices;
        }
      });
     },

     getCmdbDictList(code) {
      //加载cmdb字典
      let query = {};
      query.ciId = code;
      getDictCmdbList(query).then((res) => {
         if (code === "1097745625841664") {
          this.deviceCategoryList = res.data;
        } else if (code === "1097745969774592") {
          this.deviceTypeList = res.data;
        }else{
          this.isITAICodeList = res.data;
        }
      });
    },

        
    },
  async mounted(){
      
          //加载字典--设备类型
  await  this.getCmdbDictList("1097745969774592");
    //加载字典--设备分类
  await  this.getCmdbDictList("1097745625841664");
  //是否信创
    await this.getCmdbDictList("1104198218612736");
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

.description{
  p{
    text-align: left !important;
  }
}
</style>