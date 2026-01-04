<template>
  <basic-container>
   <div class="page_form"></div>
    <div class="page_body">
      <el-scrollbar style="height:calc(100vh - 150px)">
        <el-form
          label-width="150px"
          label-suffix=":"
        >
          <oldEquipmentTiltleHead 
                              ref="DeviceStatus"></oldEquipmentTiltleHead>

         <setting-title titleText="打分详情" :showBtn="false"></setting-title>
           <el-table
            ref="dataTable"
            stripe
            size="small"
            :data="tableData"
            style="width:100%;margin:10px">
            <el-table-column prop="leftHead" align="center" label="打分维度"
                             show-overflow-tooltip>
                 
            </el-table-column>
            <el-table-column prop="rightHead" label="对应取值" align="center" show-overflow-tooltip>
            </el-table-column>
              <el-table-column prop="score" label="该项得分" align="center" show-overflow-tooltip>
            </el-table-column>
          </el-table>

         <!-- <el-table
            ref="dataTable"
            stripe
            size="small"
            style="width:100%;margin-bottom:10px">
            <el-table-column  align="center" show-overflow-tooltip>
                  <template slot-scope="scope"  slot="header"> -->
                    <div class="total_content">
                        <span>总得分</span>
                        <span style="margin-left:30px">{{total}}</span>
                    </div>
                   
              <!-- </template>
            </el-table-column>
          </el-table> -->


        
        <setting-title titleText="故障与隐患记录" :showBtn="false"></setting-title>
           <el-table
            ref="dataTable"
            stripe
            size="small"
            :data="detailRecords"
            style="width:100%;margin:10px">
            <el-table-column prop="faultDetail" align="center" label="近三年故障记录"
                             show-overflow-tooltip>
                 
            </el-table-column>
            <el-table-column prop="hiddenDetail" label="近三年隐患记录" align="center" show-overflow-tooltip>
            </el-table-column>

             <el-table-column  label="附件" align="center" show-overflow-tooltip>

                 <template slot-scope="scope">
                     <el-image  style="width:100px;height:100px" :src="fileUrl" v-if="fileUrl" :preview-src-list='[fileUrl]'></el-image>
                     <span v-else>暂无附件</span>
              </template>
            </el-table-column>
          </el-table>

  
        <setting-title titleText="自评记录" :showBtn="false"></setting-title>
           <el-table
            ref="dataTable"
            stripe
            size="small"
            :data="detailRecords"

            style="width:100%;margin:10px">
            <el-table-column prop="isChange"  align="center" label="自评情况"
                             show-overflow-tooltip>
                
                  <template slot-scope="scope">
                    <span>{{ showDictLable(scope.row.isChange, isOrNotList) }}</span>

              </template>
            </el-table-column>
            <el-table-column  prop="changeUser"  label="修改人" align="center" show-overflow-tooltip>   
                <template slot-scope="scope">
                    <span>{{ scope.row.changeUser}}</span>
              </template>     
                  </el-table-column>

            <el-table-column   prop="updateTime"  label="修改时间" align="center" show-overflow-tooltip> 
                <template slot-scope="scope">
                    <span>{{ scope.row.updateTime}}</span>

              </template>        
                 </el-table-column>

            <el-table-column  prop="changeReason"   label="修改原因" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.changeReason}}</span>

              </template>

            </el-table-column>
          </el-table>
          
        </el-form>

       
        <div class="form-btn">
        <el-button
          type="primary"
          size="small"
          style="margin-left: 50px"
          @click="handleBack"
        >返回
        </el-button
        >
      </div>
       
      </el-scrollbar>

     

    </div>
  </basic-container>
</template>

<script>
import oldEquipmentTiltleHead from './oldEquipmentTiltleHead.vue'
import settingTitle from '../../components/settingTitle.vue';
import {getoldDeviceDetail,getDeviceRank} from "@/api/device/oldEquipmentLibrary.js";
import {getDictList,getDictCmdbList} from "@/api/dict";

export default {
    components:{
        oldEquipmentTiltleHead,
        settingTitle,
    },
    data(){
        return{
            roomFunctionList:[],
            dataDetail:{},
            tableData:[{leftHead:'A 机房级别',rightHead:'该项得分',score:1},
            {leftHead:'B 机房功能',rightHead:'该项得分',score:1},
            {leftHead:'S 设备状态',rightHead:'该项得分',score:1},
            {leftHead:'T 超龄时间',rightHead:'该项得分',score:1},
            {leftHead:'C 运维情况',rightHead:'该项得分',score:1},
            {leftHead:'D 设备归属部门',rightHead:'该项得分',score:1},
            {leftHead:'E 服务风险',rightHead:'该项得分',score:1},
            {leftHead:'F 运行情况自评',rightHead:'对应量化取值',score:1},
            {leftHead:'H n-1满足情况',rightHead:'该项得分',score:1}],
            total:'',
            detailRecords:[],
            ywqkList:[],
            score:{},
            id:'',
            operationDeptCode:'',
            propertyDeptCode:'',
            deviceCategory:'',
            deviceType:'',
            totalScore:0,
            fileUrl:'',
        }
    },
 async  mounted(){
  
    this.id = this.$route.query.id;
    this.operationDeptCode = this.$route.query.operationDeptCode;
    this.propertyDeptCode = this.$route.query.propertyDeptCode;
    this.deviceCategory = this.$route.query.deviceCategory;
    this.deviceType = this.$route.query.deviceType;

    await  this.getDictList("needNo");
    await  this.getDictList("haveNo");
    await  this.getDictList("room_function");
    await this.getCmdbDictList('1103423111233536');
      this.getDetail();
    },
    methods:{
      handleBack(){
        if(this.$route.query.from == 'library'){
           this.$closePage("/assets/oldEquipmentLibrary");
        }else{
           this.$closePage("/assets/oldEquipmentAudit");
        }
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

 async getCmdbDictList(code) {
      //加载cmdb字典
      let query = {}
      query.ciId = code
    await  getDictCmdbList(query).then(res => {
        if (code === '1103423111233536') {
          this.deviceStatusList = res.data;
        }
      });
    },

   async  getDictList(code) {
       await  getDictList(code).then(res => {
            if(code === 'needNo'){
             this.isOrNotList = res.data;
          }else if(code === 'haveNo'){
            this.ywqkList = res.data;
          }else if(code ==='room_function') {
            this.roomFunctionList = res.data;
          }
        });
      },

      getDetail(){
        getoldDeviceDetail({id:this.id,operationDeptCode:this.operationDeptCode,propertyDeptCode:this.propertyDeptCode}).then(res => {
           
           this.detailRecords.push(res.data);
           if(this.detailRecords[0].oldFileList.length > 0){
            this.fileUrl = this.detailRecords[0].oldFileList[0].fileUrl;
           }
          //  else{
          //     this.$set(this.detailRecords,0,{...this.detailRecords[0],fileUrl:this.detailRecords[0].oldFileList[0].fileUrl});
          //  }
           //设置打分详情数据
           this.$set(this.tableData[0],'rightHead', res.data.roomTypeItem);
           this.$set(this.tableData[0],'score', res.data.roomLevelScore);
           this.$set(this.tableData[1],'rightHead',this.showDictLable(res.data.roomFunction,this.roomFunctionList));
           this.$set(this.tableData[1],'score', res.data.roomFunctionScore);  
           this.$set(this.tableData[2],'rightHead', this.showDictLable(res.data.deviceStatus,this.deviceStatusList));
           this.$set(this.tableData[2],'score', res.data.deviceStatusScore); 
            this.$set(this.tableData[3],'rightHead', res.data.overAgeItem);
           this.$set(this.tableData[3],'score', res.data.overAgeScore); 
            this.$set(this.tableData[4],'rightHead', this.showDictLable(res.data.operationCondition,this.ywqkList));
           this.$set(this.tableData[4],'score', res.data.maintenanceScore);  
           this.$set(this.tableData[5],'rightHead', res.data.deptItem);
           this.$set(this.tableData[5],'score', res.data.deptScore); 
            this.$set(this.tableData[6],'rightHead', res.data.serviceRiskItem);
           this.$set(this.tableData[6],'score', res.data.serviceRiskScore);  
           this.$set(this.tableData[7],'rightHead', res.data.appriseOwnItem);
           this.$set(this.tableData[7],'score', res.data.appriseOwnScore); 
            this.$set(this.tableData[8],'rightHead', res.data.customizeItem);
           this.$set(this.tableData[8],'score', res.data.customizeScore);
           

        //计算总得分
           let total =  res.data.roomLevelScore * res.data.roomFunctionScore *  res.data.deviceStatusScore *(
             res.data.overAgeScore * res.data.maintenanceScore  + res.data.serviceRiskScore + res.data.customizeScore
           )*res.data.deptScore * res.data.appriseOwnScore ;
           this.total = 'R=A*B*S*(T*C+E+H)*D*F=' + res.data.roomLevelScore + '*' + res.data.roomFunctionScore + '*'
           + res.data.deviceStatusScore + '*' + '(' + res.data.overAgeScore + '*' + res.data.maintenanceScore  + '+'
           + res.data.serviceRiskScore + '+' + res.data.customizeScore  + ')' +'*' +  res.data.deptScore + '*' + 
           res.data.appriseOwnScore  + '=' + total.toFixed(2);

           this.$refs.DeviceStatus.setData(total.toFixed(2),res.data);
           this.totalScore = total.toFixed(2);
           this.getDeviceRank();

      }).catch(() => {
       
      })
      },

      getDeviceRank(){

    getDeviceRank({id:this.id,deviceCategory:this.deviceCategory,deviceType:this.deviceType,score:this.totalScore}).then(res => {
      this.$refs.DeviceStatus.setRank(res.data);
       
      }).catch(() => {
      })
      },
    },
}
</script>

<style lang="scss" scoped>
.total_content{
  color: #409EFF;
  font-size: 18px;
  width:100%;
  background: #BFE1FF;
  text-align: center;
  height:50px;
  line-height: 50px;
  font-weight:700;
  margin-bottom: 10px;
}
</style>