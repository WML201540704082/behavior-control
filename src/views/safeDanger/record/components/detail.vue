<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="隐患基本信息" name="first">
        <div>
          <el-form :disabled="isInfo" style="padding-right: 5px" label-width="140px" ref="form" :model="formData"  :status-icon="true">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="隐患编号:" prop="hiddenNumber">
                      {{ formData.hiddenNumber }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="隐患来源:" prop="hiddenSource">
                      {{ formatHiddenSource(formData) }}
                      <!-- <el-select v-model="formData.hiddenSource" size="mini" clearable placeholder="">
                        <el-option
                          v-for="item in hiddenSourceList"
                          :value="item.dictValue"
                          :key="item.dictValue"
                          :label="item.dictLabel"
                        >
                        </el-option>
                      </el-select> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" class="rowSelect2">
                    <el-form-item label="隐患分类:" prop="hiddenCategory">
                      <!-- {{ formData.hiddenCategory }} -->
                      {{ formatHiddenCategory(formData) }} - {{ formatHiddenCategory2(formData) }}

                      <!-- <el-select v-model="formData.hiddenCategory" @change="changeHiddenCategory" size="mini" clearable placeholder="">
                        <el-option
                          v-for="item in hiddenCategoryList"
                          :value="item.dictValue"
                          :key="item.id"
                          :label="item.dictLabel"
                        >
                        </el-option>
                      </el-select>
                      <el-select v-model="formData.hiddenType" :disabled="hiddenCategoryList2.length == 0" size="mini" clearable placeholder="" style="margin-left: 1%">
                        <el-option
                          v-for="item in hiddenCategoryList2"
                          :value="item.id"
                          :key="item.id"
                          :label="item.dictLabel"
                        >
                        </el-option>
                      </el-select> -->
                    </el-form-item>
                  </el-col>
                  
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="责任单位:" prop="secondCompany">
                        {{ formData.shortName }}
                        <!-- {{ formatSecondCompany(formData) }} -->


                        <!-- <el-select v-model="formData.secondCompany" size="mini" clearable placeholder="">
                          <el-option
                            v-for="item in basicUnitSeconds"
                            :value="item.orgId"
                            :key="item.orgId"
                            :label="item.fullName"
                          >
                          </el-option>
                        </el-select> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="整改责任人:" prop="responsibleBy">
                        {{ formData.responsibleBy }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="责任人联系方式:" prop="responsiblePhone">
                        {{ formData.responsiblePhone }}
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="整改情况:" prop="rectificationStatus">
                      <!-- {{ formData.rectificationStatus }} -->
                      {{ formatRectificationStatus(formData) }}

                      <!-- <el-select v-model="formData.rectificationStatus" size="mini" clearable placeholder="">
                        <el-option
                          v-for="item in rectificationStatusList"
                          :value="item.dictValue"
                          :key="item.dictValue"
                          :label="item.dictLabel"
                        >
                        </el-option>
                      </el-select> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="预计整改完成时间:" prop="rectificationExpectTime">
                      {{ formData.rectificationExpectTime }}
                      <!-- <el-date-picker
                              v-model="formData.rectificationExpectTime" placeholder="" type="date"
                              format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%">
                      </el-date-picker> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="实际整改完成时间:" prop="rectificationFinishTime">
                      {{ formData.rectificationFinishTime }}
                      <!-- <el-date-picker
                              v-model="formData.rectificationFinishTime" placeholder="" type="date"
                              format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%">
                      </el-date-picker> -->
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="发现人:" prop="discoverBy">
                      {{ formData.discoverBy }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="发现日期:" prop="discoverDate">
                      {{ formData.discoverDate }}
                      <!-- <el-date-picker
                              v-model="formData.discoverDate" placeholder="" type="date"
                              format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width: 100%">
                      </el-date-picker> -->
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="隐患内容:" prop="content">
                      {{ formData.content }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="隐患依据:" prop="hiddenItems">
                      {{ formData.hiddenItems }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="已采取的防范措施:" prop="rectificationPrecautions">
                      {{ formData.rectificationPrecautions }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="整改措施:" prop="rectificationPlan">
                      {{ formData.rectificationPlan }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="附件材料:" prop="rectificationPlan">
                    </el-form-item>
                  </el-col>
                </el-row>
          </el-form>
        </div>
        <el-table
            :data="tableList"
            
            stripe
            size="mini"
            style="width: 100%;height:100%;margin-top:5px;">
            <el-table-column
              prop="hiddenNumber"
              label=""
              show-overflow-tooltip
              width="80"
              align="center">
              <template slot-scope="scope">整改前</template>
            </el-table-column>
            <el-table-column
              prop="content"
              header-align="center"
              label="隐患图片">
              <template slot-scope="scope">
                <!-- <img v-for="item in filesArrImg1" :key="item.id" @click="handleImg(item.fileUrl)" width="100px" height="100px" :src="item.fileUrl" :alt="item.fileName" style="margin-right: 10px;margin-bottom: 10px"> -->
                <el-image
                  v-for="item in filesArrImg1" :key="item.id"
                  style="width: 100px; height: 100px; margin-right: 10px;margin-bottom: 10px"
                  :src="item.fileUrl"
                  :alt="item.fileName"
                  :preview-src-list="srcList1"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column
              prop="hiddenSource"
              header-align="center"
              label="隐患文件"
              width="450"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-for="item in filesArrFile1" :key="item.id" style="margin-left: 50px">
                  <!-- <a :href="item.fileUrl"> {{ item.fileName }} </a> -->
                  <el-link type="primary" :href="item.fileUrl"> {{ item.fileName }} </el-link>
                </div>
              </template>
            </el-table-column>
        </el-table>



        <el-table
            :data="tableList"
            
            stripe
            size="mini"
            style="width: 100%;height:100%;margin-top:5px;">
            <el-table-column
              prop="hiddenNumber"
              label=""
              show-overflow-tooltip
              width="80"
              align="center">
              <template slot-scope="scope">整改后</template>
            </el-table-column>
            <el-table-column
              prop="content"
              header-align="center"
              label="整改图片">
              <template slot-scope="scope">
                <!-- <img v-for="item in filesArrImg2" :key="item.id" @click="handleImg(item.fileUrl)" width="100px" height="100px" :src="item.fileUrl" :alt="item.fileName" style="margin-right: 10px;margin-bottom: 10px"> -->
                <el-image
                  v-for="item in filesArrImg2" :key="item.id"
                  style="width: 100px; height: 100px; margin-right: 10px;margin-bottom: 10px"
                  :src="item.fileUrl"
                  :alt="item.fileName"
                  :preview-src-list="srcList2"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column
              prop="hiddenSource"
              header-align="center"
              label="整改文件"
              width="450"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-for="item in filesArrFile2" :key="item.id" style="margin-left: 50px">
                  <!-- <a :href="item.fileUrl"> {{ item.fileName }} </a> -->
                  <el-link type="primary" :href="item.fileUrl"> {{ item.fileName }} </el-link>
                </div>
              </template>
            </el-table-column>
        </el-table>
        


      </el-tab-pane>
      <el-tab-pane label="流程信息" name="second">
        <SecondSlot :detailId="detailId"></SecondSlot>
      </el-tab-pane>
    </el-tabs>


    <el-dialog :close-on-click-modal="false" append-to-body class="picShow" :visible.sync="dialogVisible" v-if="dialogVisible" title="图片预览">
            <!-- <span style="margin-left: 96%;cursor: pointer;" title="下载图片" class="el-upload-list-download" @click="downloadFileByName(false)">
                <i class="el-icon-download" style="color: #006F6B;"></i>
            </span> -->
      <img class="imgg" :src="imgUrl" ref="img">
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { orderId, orderAdd, orderUpdate, queryShortNameList, createFlow, sendBpm, backToLastItem, queryNextFlowUsers } from "@/api/safeDanger/report"
import { securitySupervision } from "@/api/safeDanger/networkSecure"
import { allCategory } from "@/api/safeDanger/computerroom"
import SecondSlot from "./secondSlot";

export default {
  name: "recordDetail",
  components: {SecondSlot},
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
      'userId'
    ]),
    srcList1(){
      return this.filesArrImg1.map(el => el.fileUrl) 
    },
    srcList2(){
      return this.filesArrImg2.map(el => el.fileUrl) 
    },
  },
  props: {
    detailId: {
      default: true
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      imgUrl: '',

      activeName: 'first',
      tableList: [ {} ],

      // 表单参数
      formData: {},
      
      // 下拉列表
      hiddenSourceList: [],
      hiddenCategoryList: [],
      hiddenCategoryList2: [],
      basicUnitSeconds: [], // 二级单位
      supervisionList: [],
      categoryList: [],
      rectificationStatusList: [
        {
          dictValue: 0,
          dictLabel: '未完成'
        },
        {
          dictValue: 1,
          dictLabel: '已完成'
        },
      ],

      filesArrImg1: [],
      filesArrFile1: [],
      filesArrImg2: [],
      filesArrFile2: [],

    }
  },
  created() {
    this.initData()
    this.showInfo();
  },
  mounted() {

  },
  methods: {
    handleImg(url){
      this.dialogVisible = true;
      this.imgUrl = url
    },

    

    // 渲染表格
    showInfo() {
      this.formData.status = 0
      if(this.detailId) {
        orderId(this.detailId).then(response =>{
          this.formData = Object.assign({}, response.data)
          // 获取 隐患分类二级列表
          this.changeHiddenCategory(this.formData.hiddenCategory)
          let filesArr = response.data.evidenceDTOList
          this.filesArrImg1 = filesArr.filter( el => el.textImages == 1 && (el.type == 2 || el.type == 0) )
          this.filesArrFile1 = filesArr.filter( el => el.textImages == 0 && (el.type == 2 || el.type == 0) )

          this.filesArrImg2 = filesArr.filter(el => el.textImages == 1 && el.type == 1)
          this.filesArrFile2 = filesArr.filter(el => el.textImages == 0 && el.type == 1)
        })        
      }
    },
    // 获取下拉列表
    initData(){
      queryShortNameList({ parentId: this.companyCode.slice(0, 4) }).then(response => {
        this.basicUnitSeconds = response.data
      })
      this.getDicts('hidden_source').then(response => {
        this.hiddenSourceList = response.data
      });
      this.getDicts('hidden_category').then(response => {
        this.hiddenCategoryList = response.data
      });
      securitySupervision().then(res=>{
        this.supervisionList = res.data
      })
      allCategory().then(res=>{
        this.categoryList = res.data
      })
    },
    // 隐患分类选中
    changeHiddenCategory(value){ 
      if(value){
        let data;
        if(value == 0){ // 机房
          data = this.categoryList 
          data.forEach(el=> el.dictLabel = el.category )
        }else{
          data = this.supervisionList
          data.forEach(el=> el.dictLabel = el.supervision )
        }
        this.hiddenCategoryList2 = data
      }else{
        this.hiddenCategoryList2 = []
      }
    },

    // 格式化数据
    formatHiddenSource(row){
      return this.selectDictLabel( this.hiddenSourceList, row.hiddenSource )
    },
    formatHiddenCategory(row){
      return this.selectDictLabel( this.hiddenCategoryList, row.hiddenCategory )
    },
    formatHiddenCategory2(row){
      if(this.hiddenCategoryList2.filter(el => el.id == row.hiddenType)[0]){
        return this.hiddenCategoryList2.filter(el => el.id == row.hiddenType)[0].dictLabel
      }
    },
    formatState(row){
      return this.selectDictLabel( this.statusList, row.status )
    },
    formatRectificationStatus(row){
      if(row.rectificationStatus == 0){
        return '未完成'
      }
      if(row.rectificationStatus == 1){
        return '已完成'
      }
    },

    formatSecondCompany(row){
      if(!row.secondCompany) return ''
      let data = this.basicUnitSeconds;
      for (let i = 0; i < data.length; i++) {
        if (row.secondCompany == data[i].orgId) {
          return data[i].shortName;
        }
      }
    },

 
  }
}
</script>

<style lang='scss' scoped>
  .imgg{
    max-height: 100%;
    max-width: 100%;
  }
  .el-cascader{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }
  .el-input{
    width: 100%;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }

  ::v-deep .el-form-item {
    margin-bottom: 18px;
  }
  .rowSelect2 .el-select{
    width: 48.5%;
  }

  // ::v-deep .el-form-item__label{
  //   text-align: left;
  // }

</style>
