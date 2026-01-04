<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      :title="getTitle"
      width="500px"
      top="10vh"
      v-el-drag-dialog
    >
      <div>
        <el-form
          ref="queryForm"
          :model="searchForm"
          label-width="110px"
          class="xt_form"
          :disabled="showType == 'check'"
        >
          <el-row>
            <el-col :span="22">
              <el-form-item label="类型">
                <el-select
                  v-model="searchForm.ciId"
                  placeholder=""
                  size="mini"
                  clearable
                  @change='changeItemClick'
                  :disabled="showType == 'check' || this.showType == 'edit'"
                >
                  <el-option
                    v-for="item in libraryList"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="22">
              <el-form-item label="编码">
                <el-input v-model="searchForm.dictKey" style="width:100%" clearable placeholder="自动生成"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="22">
              <el-form-item label="名称">
                <el-input v-model="searchForm.dictValue" style="width:100%" clearable placeholder="请输入名称"
                          :disabled="showType == 'check'"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <template v-if="showType == 'edit' || showType == 'add'">
            <el-row v-show="showLevel">
              <el-col :span="22">
                <el-form-item label="上级类型">
                  <el-input v-model="searchForm.cientityType" style="width:100%" clearable placeholder=""
                            disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-show="showLevel">
              <el-col :span="22">
                <el-form-item label="上级类型名称">
                  <el-select
                    :disabled="showType == 'check'"
                    v-model="searchForm.cientityPid"
                    placeholder=""
                    size="mini"
                    clearable
                    filterable
                    @change="itemClick"
                  >
                    <el-option
                      v-for="item in dataArr"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-show="showLevel">
              <el-col :span="22">
                <el-form-item label="上级类型编码">
                  <el-input v-model="searchForm.cientityPidCode" style="width:100%" clearable placeholder=""
                            disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <!-- 查看时展示信息 -->
          <template v-if="showType == 'check'">
            <el-row v-if="isBrand || isSeries || isModel">
              <el-col :span="22">
                <el-form-item :label="oneTypeName">
                  <el-input v-model="searchForm.upOneName" style="width:100%" clearable placeholder=""
                            disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row v-if="isBrand || isSeries || isModel">
              <el-col :span="22">
                <el-form-item :label="oneTypeCode">
                  <el-input v-model="searchForm.upOneCode" style="width:100%" clearable placeholder=""
                            disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row v-if="isSeries || isModel">
              <el-col :span="22">
                <el-form-item :label="twoTypeName">
                  <el-input v-model="searchForm.upTwoName" style="width:100%" clearable placeholder=""
                            disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row v-if="isSeries || isModel">
              <el-col :span="22">
                <el-form-item :label="twoTypeCode">
                  <el-input v-model="searchForm.upTwoCode" style="width:100%" clearable placeholder=""
                            disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row v-if="isModel">
              <el-col :span="22">
                <el-form-item label="制造商名称">
                  <el-input v-model="searchForm.upThreeName" style="width:100%" clearable placeholder=""
                            disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row v-if="isModel">
              <el-col :span="22">
                <el-form-item label="制造商编码">
                  <el-input v-model="searchForm.upThreeCode" style="width:100%" clearable placeholder=""
                            disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
          </template>


          <el-row :gutter="10" v-if="isEdit">
            <el-col :span="22">
              <el-form-item label="数据来源">
                <el-select v-model="searchForm.dataSource" size="mini" clearable placeholder=""
                           :disabled="userDetail.regionCode != '37' && showType == 'check'">
                  <el-option v-for="item in dataSourceList" :value="item.dictKey" :label="item.dictValue"
                             :key="item.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="form-btn" v-if="showType != 'check'">
          <el-button v-if="showType == 'add'"
                     type="primary"
                     size="small"
                     style="margin-left: 50px;margin-bottom:10px"
                     @click="handleSave"
          >新增
          </el-button
          >
          <el-button v-else-if="showType == 'edit'"
                     type="primary"
                     size="small"
                     style="margin-left: 50px;margin-bottom:10px"
                     @click="handleEdit"
          >修改
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
    </el-dialog>
  </div>
</template>

<script>
  import {standLibraryAdd, standLibraryEdit} from "@/api/operation/safeaccess/switch";
  import {getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
  import {mapGetters, mapState} from "vuex";

  const uuid = require('uuid');

  export default {
    props: ["isShow", "arrtId", "showType", 'isEdit', 'editItem'],
    data() {
      return {
        deviceSourceList: [],

        orgCodeList: [],
        is3List: [],
        swStateList: [],
        snmpVersionList: [],
        Is802List: [],
        isAccessSwitchList: [],

        brandList: [],
        seriesList: [],
        deviceModelList: [],
        brandOriginList: [],
        seriesOriginList: [],
        deviceModelOriginList: [],
        maintenanceCountryList: [],

        searchForm: {},
        rules: {
          name: [{required: true, message: "名称不能为空", trigger: "blur"}],
        },
        pageLoading: false,

        dataList: [],
        selectionList: [],
        total: 0,
        tableLoading: false, //表格加载
        tableHeight: undefined,
        libraryList: [
          {dictValue: "制造商", dictKey: this.$store.state.common.govern.dictMaker},
          {dictValue: "品牌", dictKey: this.$store.state.common.govern.dictBrand},
          {dictValue: "系列", dictKey: this.$store.state.common.govern.dictSeries},
          {dictValue: "型号", dictKey: this.$store.state.common.govern.dictModel},
        ],
        makerList: [],
        showLevel: false,

        dataArr: [],
        uuid: '',
        dataSourceList: [],
      };
    },
    computed: {
      ...mapGetters(["permission", "userDetail"]),

      getTitle() {
        if (this.showType == "add") {
          return "新增";
        } else if (this.showType == "check") {
          return "查看";
        } else if (this.showType == "edit") {
          return "修改";
        }
      },

      oneTypeName(){
        if(this.isBrand){
          return '制造商名称'
        }else if(this.isSeries){
          return '品牌名称'
        }else if(this.isModel){
          return '系列名称'
        }
      },
      oneTypeCode(){
        if(this.isBrand){
          return '制造商编码'
        }else if(this.isSeries){
          return '品牌编码'
        }else if(this.isModel){
          return '系列编码'
        }
      },
      twoTypeName(){
        if(this.isSeries){
          return '制造商名称'
        }else if(this.isModel){
          return '品牌名称'
        }
      },
      twoTypeCode(){
        if(this.isSeries){
          return '制造商编码'
        }else if(this.isModel){
          return '品牌编码'
        }
      },
      isMaker(){
        return this.searchForm.ciId == this.libraryList[0].dictKey
      },
      isBrand(){
        return this.searchForm.ciId == this.libraryList[1].dictKey
      },
      isSeries(){
        return this.searchForm.ciId == this.libraryList[2].dictKey
      },
      isModel(){
        return this.searchForm.ciId == this.libraryList[3].dictKey
      },
 

    },
    async mounted() {
      if (this.showType != 'add') {
        await this.getCmdbDictList(this.$store.state.common.govern.dictValueType)
        this.searchForm = JSON.parse(JSON.stringify(this.editItem));
        let typeName = this.libraryList.filter(item => item.dictKey == this.searchForm.ciId)[0].dictValue;
        this.showLevel = typeName === '制造商' ? false : true;
        if (typeName === '型号') {
          this.searchForm.cientityType = '系列';
          await this.getCmdbDictList("1082609011851264"); // 系列
          this.dataArr = this.seriesOriginList;
        } else if (typeName === '系列') {
          this.searchForm.cientityType = '品牌';
          await this.getCmdbDictList("1082554947272704"); // 品牌
          this.dataArr = this.brandOriginList;
        } else if (typeName === '品牌') {
          this.searchForm.cientityType = '制造商';
          await this.getCmdbDictList('1082610161090560');
          this.dataArr = this.makerList;
        }
      } else {
        this.searchForm.dictKey = uuid.v4();
      }
    },
    methods: {
      async changeItemClick(code) {
        this.searchForm.cientityPid = '';
        this.searchForm.cientityPidName = '';
        this.searchForm.cientityPidCode = '';
        this.dataArr = [];
        let itemText = this.libraryList.filter(item => item.dictKey === code)[0].dictValue;
        this.searchForm.ciEntityName = itemText;
        this.showLevel = itemText === '制造商' ? false : true;
        if (itemText === '型号') {
          if (this.seriesOriginList.length > 0) {
            this.dataArr = this.seriesOriginList;
          } else {
            await this.getCmdbDictList("1082609011851264"); // 系列
            this.dataArr = this.seriesOriginList;
          }
          this.searchForm.cientityType = '系列';
        } else if (itemText === '系列') {
          if (this.brandOriginList.length > 0) {
            this.dataArr = this.brandOriginList;
          } else {
            await this.getCmdbDictList("1082554947272704"); // 品牌
            this.dataArr = this.brandOriginList;
          }
          this.searchForm.cientityType = '品牌';
        } else if (itemText === '品牌') {
          if (this.makerList.length > 0) {
            this.dataArr = this.makerList;
          } else {
            await this.getCmdbDictList("1082610161090560"); // 制造商
            this.dataArr = this.makerList;
          }
          this.searchForm.cientityType = '制造商';
        }
      },
      itemClick(code) {
        this.searchForm.cientityPidName = this.dataArr.filter(item => item.dictKey === code)[0].dictValue;
        this.searchForm.cientityPidCode = this.dataArr.filter(item => item.dictKey === code)[0].remarkTemp;
        this.$forceUpdate();
      },
      async getCmdbDictList(code) {
        //加载cmdb字典
        let query = {}
        query.ciId = code
        await getDictCmdbList(query).then(res => {
          if (code == '1082610161090560') { // 制造商
            this.makerList = res.data;
          } else if (code == '1082554947272704') { // 品牌
            this.brandOriginList = res.data;
          } else if (code == '1082609011851264') { // 系列
            this.seriesOriginList = res.data;
          } else {
            this.dataSourceList = res.data;
          }

        });
      },
      handleEdit() {

        this.searchForm.isDeleted = 0;

        standLibraryEdit(this.searchForm)
          .then((res) => {
            if (res.code != 200) {
              throw res.mag;
            }
            this.$message.success('修改成功');
            this.$emit("update");
          })
          .catch(() => {
            this.pageLoading = false;
          });

      },
      handleSave() {
        this.$emit("setVal", this.searchForm);

        this.searchForm.isDeleted = 0;
        standLibraryAdd(this.searchForm)
          .then((res) => {
            if (res.code != 200) {
              throw res.mag;
            }
            this.$message.success('添加成功');
            this.$emit("update");
          })
          .catch(() => {
            this.pageLoading = false;
          });

      },
      handleCancel() {
        this.$emit("close");
      },
    },
  };
</script>

<style lang="scss" scoped>
  .formLabel {
    line-height: 10px;
  }

  .btn-row {
    text-align: right;
  }
</style>
