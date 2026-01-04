<template>
  <basic-container>
    <div class="page_form" style="padding-bottom: 0px">
      <!-- <el-form ref="searchForm" :model="searchForm" label-width="100px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="设备类型" prop="extCode">
              <el-select v-model="searchForm.extCode" placeholder="请输入设备类型" clearable>
                <el-option v-for="(item,index) in extCodeList"
                           :key="item.EXT_CODE"
                           :label="item.EXT_NAME"
                           :value="item.EXT_CODE"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="治理情况" prop="extCode">
              <el-select v-model="searchForm.extCode" placeholder="请输入治理情况" clearable>
                <el-option v-for="(item,index) in extCodeList"
                           :key="item.EXT_CODE"
                           :label="item.EXT_NAME"
                           :value="item.EXT_CODE"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="治理进度" prop="extId">
              <div class="flexl">
                <el-input
                  placeholder="请输入最低进度"
                  clearable
                  v-model="searchForm.extId"
                ></el-input>
                <span>—</span>
                <el-input
                  placeholder="请输入最高进度"
                  clearable
                  v-model="searchForm.extId"
                ></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="只看TOP" prop="extName">
              <el-input
                placeholder="请输入数字（只看进度最高设备相关数据）"
                clearable
                v-model="searchForm.extName"
              ></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="公司筛选" prop="extCode">
              <el-select v-model="searchForm.extCode" placeholder="请选择公司" clearable>
                <el-option v-for="(item,index) in extCodeList"
                           :key="item.EXT_CODE"
                           :label="item.EXT_NAME"
                           :value="item.EXT_CODE"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18" style="text-align: right;line-height: 42px;">
            <el-button type="primary"
                 @click="handleQuery">查询
            </el-button>
            <el-button style="margin-left: 5px;" type="primary" plain
                      @click="handleReset">重置
            </el-button>
            <el-button style="margin-left: 5px;" type="primary" plain
                      @click="handleExport">导出数据
            </el-button>
            <el-button style="margin-left: 5px;" type="primary" plain
                      @click="handleSet">权重设置
            </el-button>
          </el-col>
        </el-row>
      </el-form> -->
      
      <el-row>
        <el-col :span="3">
          <el-select v-model="searchForm.region" placeholder="请选择地区" clearable size="small" style="margin-top: 5px">
            <el-option v-for="(item,index) in regions"
                        :key="item.code"
                        :label="item.shortName"
                        :value="item.code"></el-option>
          </el-select>
        </el-col>
        <el-col :span="21" style="text-align: right;line-height: 42px;">
          <el-button type="primary"
                @click="handleQuery">查询
          </el-button>
          <!-- <el-button style="margin-left: 5px;" type="primary" plain
                    @click="handleReset">重置
          </el-button> -->
          <el-button style="margin-left: 5px;" type="primary" plain
                    @click="handleExport">导出数据
          </el-button>
          <el-button style="margin-left: 5px;" type="primary" plain
                    @click="handleNew">刷新
          </el-button>
          <!-- <el-button style="margin-left: 5px;" type="primary" plain
                    @click="handleSet">权重设置
          </el-button> -->
        </el-col>
      </el-row>
      
    </div>
    <div class="page_body">
      <el-table
        ref="arrtTable"
        :data="tableData"
        :span-method="objectSpanMethods"
        :height="tableHeight"
        cell-class-name="bgE"
        size="small"
        v-loading="tableLoading"
        @selection-change="selectionChange"
        border
      >
        <!-- <el-table-column type="selection" width="30"></el-table-column> -->
        <!-- <el-table-column type="index" align="center" label="序号"></el-table-column> -->
        <!-- <el-table-column label="序号" prop="rn" align="center" width="50" show-overflow-tooltip></el-table-column> -->
        <el-table-column label="设备分类" prop="deviceType" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="治理情况" prop="governance" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column v-for="item in tabCon" :key="item.regionName" :label="item.regionName" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span> {{ row[item.regionName] }} </span>
          </template>
        </el-table-column>


        <!-- <el-table-column label="济南市" prop="jiNan" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.jiNan }}% </span>
            <span v-else> {{ row.jiNan }} </span>
          </template>
        </el-table-column>
        <el-table-column label="青岛市" prop="qingDao" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.qingDao }}% </span>
            <span v-else> {{ row.qingDao }} </span>
          </template>
        </el-table-column>
        <el-table-column label="淄博市" prop="ziBo" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.ziBo }}% </span>
            <span v-else> {{ row.ziBo }} </span>
          </template>
        </el-table-column>
        <el-table-column label="枣庄市" prop="zaoZhuang" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.zaoZhuang }}% </span>
            <span v-else> {{ row.zaoZhuang }} </span>
          </template>
        </el-table-column>
        <el-table-column label="东营市" prop="dongYing" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.dongYing }}% </span>
            <span v-else> {{ row.dongYing }} </span>
          </template>
        </el-table-column>
        <el-table-column label="烟台市" prop="yanTai" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.yanTai }}% </span>
            <span v-else> {{ row.yanTai }} </span>
          </template>
        </el-table-column>
        <el-table-column label="潍坊市" prop="weiFang" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.weiFang }}% </span>
            <span v-else> {{ row.weiFang }} </span>
          </template>
        </el-table-column>
        <el-table-column label="济宁市" prop="jiNing" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.jiNing }}% </span>
            <span v-else> {{ row.jiNing }} </span>
          </template>
        </el-table-column>
        <el-table-column label="泰安市" prop="taiAn" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.taiAn }}% </span>
            <span v-else> {{ row.taiAn }} </span>
          </template>
        </el-table-column>
        <el-table-column label="威海市" prop="weiHai" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.weiHai }}% </span>
            <span v-else> {{ row.weiHai }} </span>
          </template>
        </el-table-column>
        <el-table-column label="日照市" prop="riZhao" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.riZhao }}% </span>
            <span v-else> {{ row.riZhao }} </span>
          </template>
        </el-table-column>
        <el-table-column label="莱芜市" prop="laiWu" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.laiWu }}% </span>
            <span v-else> {{ row.laiWu }} </span>
          </template>
        </el-table-column>
        <el-table-column label="临沂市" prop="linYi" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.linYi }}% </span>
            <span v-else> {{ row.linYi }} </span>
          </template>
        </el-table-column>
        <el-table-column label="德州市" prop="deZhou" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.deZhou }}% </span>
            <span v-else> {{ row.deZhou }} </span>
          </template>
        </el-table-column>
        <el-table-column label="聊城市" prop="liaoCheng" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.liaoCheng }}% </span>
            <span v-else> {{ row.liaoCheng }} </span>
          </template>
        </el-table-column>
        <el-table-column label="滨州市" prop="binZhou" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.binZhou }}% </span>
            <span v-else> {{ row.binZhou }} </span>
          </template>
        </el-table-column>
        <el-table-column label="菏泽市" prop="heZe" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.heZe }}% </span>
            <span v-else> {{ row.heZe }} </span>
          </template>
        </el-table-column>
        <el-table-column label="总数" prop="all" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.governance == '治理进度'" style="color: #409EFF"> {{ row.all }}% </span>
            <span v-else> {{ row.all }} </span>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="i6000属性值源类型" prop="i6000OriType" align="left" :formatter="changeStatus" show-overflow-tooltip></el-table-column> -->

        <!-- <el-table-column label="操作" prop="createTime" align="left" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link type="primary" size="mini" :underline="false" icon="el-icon-edit" style="margin-right: 10px"
                     @click="editArrt(scope.row)">编 辑
            </el-link>
            <el-link type="danger" size="mini" :underline="false" icon="el-icon-delete" style="margin-right: 10px"
                     :disabled="scope.row.invokeCount > 0" @click="delArrt(scope.row)">删 除
            </el-link>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        :pageSizes="[20,50,100,200]"
        @pagination="getList"/> -->
    </div>

    
  </basic-container>
</template>

<script>
import {governanceSituation, governanceRegion, governanceCounty} from "@/api/data/stockStatistics";

export default {
  components: {
    
  },
  data() {
    return {
      selectionList: [],
      cmdbCiIdList: [],
      cmdbAttrCodeList: [],
      i6000AttrCodeList: [],
      searchForm: {
        current: 1,
        size: 20,
        region: '37',
        cmdbCiName: undefined,
        cmdbAttrCode: undefined,
        i6000AttrCode: undefined,
      },
      total: 0,

      tableData: [],
      tableHeight: undefined,
      tableLoading: false,

      rowSpanArr1: [],
     

      extCodeList:null,

      regions: [],
      tabCon: []
    }
  },
  mounted() {
    this.setPageContentHeight();
    this.setTableHeight();
    
    this.getList();

    governanceRegion().then(res=>{
      // console.log(89123, res)
      res.data.unshift({
        shortName: "山东省",
        code: '37' 
      })
      this.regions = res.data
    })
  },
  methods: {

    handleTableData1(tableData) {
      let rowSpanArr = [], position = 0
      for (const [index, item] of tableData.entries()) {
        if (index == 0) {
          rowSpanArr.push(1)
          position = 0
        } else {
          if (item.deviceType == tableData[index - 1].deviceType) {
            rowSpanArr[position] += 1
            rowSpanArr.push(0)
          } else {
            rowSpanArr.push(1)
            position = index
          }
        }
      }
      this.rowSpanArr1 = rowSpanArr
    },
    objectSpanMethods({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const rowSpan = this.rowSpanArr1[rowIndex]
        return {
          rowspan: rowSpan,
          colspan: 1
        }
      }
    },



    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection.map(item => item.id);
    },
    changeStatus(row) {
      if (row.i6000OriType === '1') {
        return "手工录入"
      } else if (row.i6000OriType === '2') {
        return "枚举数据"
      } else if (row.i6000OriType === '3') {
        return "配置类型"
      } else if (row.i6000OriType === '4') {
        return "外部数据"
      }
    },
    showDictLable(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }
      }
      return code;
    },
    handleQuery() {
      this.searchForm.current = 1;
      this.searchForm.flush = undefined;
      this.getList();
    },
    handleReset() {
      this.searchForm.cmdbAttrCode = undefined;
      this.searchForm.i6000AttrCode = undefined;
      this.searchForm.flush = undefined;
      this.getList();
    },
    handleNew(){
      this.searchForm.flush = 1;
      this.getList();
    },
    handleExport(){
      this.download(
          "/api/idevelop-device/staatistics/governance/export",
          this.tableData,
          "设备台账.xlsx"
        );
    },
    handleSet(){

    },
    
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body');
      this.tableHeight = (bodyBox[0].offsetHeight - 20) + 'px'
    },
    getList() {
      // 已治理 未治理 整改情况
      this.tableLoading = true;
      governanceCounty(this.searchForm).then(res => {
        let datas = res.data
        let fenleiObj = {}
        datas.forEach(ele=>{
          if( fenleiObj[ele.deviceType] ){
            fenleiObj[ele.deviceType].push( ele )
          }else{
            fenleiObj[ele.deviceType] = []
            fenleiObj[ele.deviceType].push( ele )
          }
        })
        // console.log(909090, fenleiObj)
        this.tabCon = fenleiObj['主机设备']


        let newArr = []
        for (let key in fenleiObj) {
          let element = fenleiObj[key];
          // console.log(61, element)
          let newObj1 = {
            deviceType: element[0].deviceType,
            governance: '已治理',
          }
          let newObj2 = {
            deviceType: element[0].deviceType,
            governance: '未治理',
          }
          let newObj3 = {
            deviceType: element[0].deviceType,
            governance: '整改情况',
          }
          element.forEach(ele=>{
            newObj1[ele.regionName] = ele.governanceYes
            newObj2[ele.regionName] = ele.governanceNo
            newObj3[ele.regionName] = ele.rate
          })
          newArr.push(newObj1)
          newArr.push(newObj2)
          newArr.push(newObj3)
        }
        // console.log(788, newArr)
        this.tableData = newArr;
        this.handleTableData1(this.tableData)
        this.tableLoading = false
        

        // this.total = res.data.total;
        // this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 删除
    delArrt() {
      this.$confirm('确定是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        globalattrDel({ids: this.selectionList.join(',')}).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.searchForm.flush = undefined;
          this.getList()
        })
      })
    },
  
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .bgE{
    background: #e2f2ff;
    border: 1px solid #fff!important;
  }
</style>
<style lang="scss" scoped>

  .flexl{
    display: flex;
    justify-content: space-between;

    span{
      padding: 0 5px;
    }
  }
</style>
