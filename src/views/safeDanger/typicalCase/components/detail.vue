<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="典例案例库详情" name="first">
        <div>
          <el-form :disabled="isInfo" style="padding-right: 5px" label-width="140px" ref="form" :model="formData"
                   :status-icon="true">
            <el-row>
              <el-col :span="8">
                <el-form-item label="隐患编号:" prop="hiddenNumber">
                  {{ formData.hiddenNumber }}
                </el-form-item>
              </el-col>
              <el-col :span="8" class="rowSelect2">
                <el-form-item label="隐患分类:" prop="hiddenCategory">
                  {{ formatHiddenCategory(formData) }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="隐患内容:" prop="content">
                  {{ formData.content }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="整改措施:" prop="rectificationPlan">
                  {{ formData.rectificationRecord }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <el-form :disabled="isInfo" style="padding-right: 5px" label-width="140px" ref="form" :model="formData"
                   :status-icon="true">
            <el-row>
              <el-col :span="24">
                <el-form-item label="附件材料:" prop="rectificationPlan">
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

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
        </div>

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
  import {
    orderId,
    queryShortNameList,
    networkList,
    machineroomList
  } from '@/api/safeDanger/typicalCase'
  import { securitySupervision } from '@/api/safeDanger/networkSecure'
  import { allCategory } from '@/api/safeDanger/computerroom'

  export default {
    name: 'typicalCaseDetail',
    components: {},
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
        type: Number
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
        tableList: [{}],

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
          }
        ],
        filesArrImg1: [],
        filesArrFile1: [],
        filesArrImg2: [],
        filesArrFile2: [],
        networkList: [],
        machineroomTypeList: []
      }
    },
    created() {
      this.initData()
      this.showInfo()
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
        if (this.detailId) {
          orderId(this.detailId).then(response => {
            this.formData = Object.assign({}, response.data)
            // 获取 隐患分类二级列表
            this.changeHiddenCategory(this.formData.hiddenCategory)
            let filesArr = response.data.evidenceDTOList
            this.filesArrImg1 = filesArr.filter(el => el.textImages == 1 && (el.type == 2 || el.type == 0) )
            this.filesArrFile1 = filesArr.filter(el => el.textImages == 0 && (el.type == 2 || el.type == 0) )

            this.filesArrImg2 = filesArr.filter(el => el.textImages == 1 && el.type == 1)
            this.filesArrFile2 = filesArr.filter(el => el.textImages == 0 && el.type == 1)
          })
        }
      },
      // 获取下拉列表
      initData() {
        queryShortNameList({ parentId: this.companyCode.slice(0, 4) }).then(response => {
          this.basicUnitSeconds = response.data
        })
        this.getDicts('hidden_source').then(response => {
          this.hiddenSourceList = response.data
        })
        this.getDicts('hidden_category').then(response => {
          this.hiddenCategoryList = response.data
        })
        securitySupervision().then(res => {
          this.supervisionList = res.data
        })
        allCategory().then(res => {
          this.categoryList = res.data
        })
        networkList().then(response => {
          this.networkList = response.data
        })
        machineroomList().then(response => {
          this.machineroomTypeList = response.data
        })
      },
      // 隐患分类选中
      changeHiddenCategory(value) {
        if (value) {
          let data
          if (value == 0) { // 机房
            data = this.categoryList
            data.forEach(el => el.dictLabel = el.category)
          } else {
            data = this.supervisionList
            data.forEach(el => el.dictLabel = el.supervision)
          }
          this.hiddenCategoryList2 = data
        } else {
          this.hiddenCategoryList2 = []
        }
      },
      // 格式化数据
      formatHiddenSource(row){
        return this.selectDictLabel( this.hiddenSourceList, row.hiddenSource )
      },

      formatHiddenCategory(row){
        let hiddenCategorylet = this.selectDictLabel( this.hiddenCategoryList, row.hiddenCategory )
        if (row.hiddenCategory == 0) {
          let data = this.machineroomTypeList;
          for (let i = 0; i < data.length; i++) {
            if (row.hiddenType == data[i].id) {
              return hiddenCategorylet+ ' - ' + data[i].category
            }
          }
        } else {
          let data = this.networkList;
          for (let i = 0; i < data.length; i++) {
            if (row.hiddenType == data[i].id) {
              return hiddenCategorylet+ ' - ' + data[i].supervision
            }
          }
        }
      },
      // formatHiddenCategory2(row){
      //   return this.hiddenCategoryList2.filter(el => el.id == row.hiddenType)[0].dictLabel
      // },
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
            return data[i].fullName;
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
  .el-cascader {
    width: 100%;
  }

  .el-select {
    width: 100%;
  }

  .el-input {
    width: 100%;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }

  ::v-deep .el-form-item {
    margin-bottom: 18px;
  }

  .rowSelect2 .el-select {
    width: 48.5%;
  }

  // ::v-deep .el-form-item__label{
  //   text-align: left;
  // }

</style>
