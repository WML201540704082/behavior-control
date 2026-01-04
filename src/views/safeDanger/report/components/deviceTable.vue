<template>
  <div>
    <el-container>
      <el-header style="padding: 10px 20px 5px 0px;margin:0px;display: inline-table;justify-content: space-between;align-items: center;height: auto;">
        <el-form ref="queryForm" label-width="auto">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="设备分类" size="small">
                <el-select v-model="queryParams.deviceCategory" size="mini" clearable
                           :placeholder="getPlaceholder(deviceCategoryList)" :disabled="getDisabled(deviceCategoryList)">
                  <el-option v-for="(item,index) in deviceCategoryList"
                             :key="item.enumKey"
                             :label="item.enumValue"
                             :value="item.enumKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="设备类型" size="small">
                <el-select v-model="queryParams.deviceType" size="mini" clearable
                           :placeholder="getPlaceholder(deviceTypeList,{name:queryParams.deviceCategory,label:'设备分类'})"
                           :disabled="getDisabled(deviceTypeList,{name:queryParams.deviceCategory,label:'设备分类'})">
                  <el-option v-for="(item,index) in deviceTypeList"
                             :key="item.dictKey"
                             :label="item.dictValue"
                             :value="item.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="设备来源" size="small">
                <el-select v-model="queryParams.deviceSource" size="mini" clearable
                           :placeholder="getPlaceholder(deviceSourceList)" :disabled="getDisabled(deviceSourceList)">
                  <el-option v-for="(item,index) in deviceSourceList"
                             :key="item.enumKey"
                             :label="item.enumValue"
                             :value="item.enumKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>


            <!--            <el-col :span="8">-->
            <!--              <el-button type="primary" size="mini" icon="el-icon-search" @click="handleQuery">查询</el-button>-->
            <!--              <el-button type="primary" size="mini" style="margin-left: 5px;" icon="el-icon-refresh-left" @click="resetQuery">重置</el-button>-->
            <!--            </el-col>-->

          </el-row>

          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="制造商" size="small" prop="maker">
                <el-select v-model="queryParams.maker" size="mini" filterable clearable :placeholder="getPlaceholder(makerList)" :disabled="getDisabled(makerList)">
                  <el-option v-for="dict in makerList"
                             :key="dict.enumKey"
                             :label="dict.enumValue"
                             :value="dict.enumKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="品牌" size="small" prop="brand">
                <el-select v-model="queryParams.brand" size="mini" filterable clearable
                           :placeholder="getPlaceholder(brandList,{name:queryParams.maker,label:'制造商'})"
                           :disabled="getDisabled(brandList,{name:queryParams.maker,label:'制造商'})">
                  <el-option v-for="dict in brandList"
                             :key="dict.dictKey"
                             :label="dict.dictValue"
                             :value="dict.dictKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="系列" size="small" prop="series">
                <el-select v-model="queryParams.series" size="mini" filterable clearable
                           :placeholder="getPlaceholder(seriesList,{name:queryParams.brand,label:'品牌'})"
                           :disabled="getDisabled(seriesList,{name:queryParams.brand,label:'品牌'})">
                  <el-option v-for="dict in seriesList"
                             :key="dict.dictKey"
                             :label="dict.dictValue"
                             :value="dict.dictKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="型号" size="small" prop="deviceModel">
                <el-select v-model="queryParams.deviceModel" size="mini" filterable clearable
                           :placeholder="getPlaceholder(deviceModelList,{name:queryParams.series,label:'系列'})"
                           :disabled="getDisabled(deviceModelList,{name:queryParams.series,label:'系列'})">
                  <el-option v-for="dict in deviceModelList"
                             :key="dict.dictKey"
                             :label="dict.dictValue"
                             :value="dict.dictKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备编码" size="small" prop="deviceCode">
                <el-input v-model="queryParams.deviceCode" size="mini" placeholder="请输入设备编码" filterable clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div class="d_end">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
                <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="padding-left: 20px;padding-top: 0px">
        <div>
          <el-table
            ref="table"
            :data="tableList"
            :height="tableHeight"
            v-loading="loading"
            border
            size="mini">
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="type" label="分类标准" show-overflow-tooltip width="200"></el-table-column>
            <el-table-column prop="content" align="left" label="隐患内容" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" align="left" label="创建时间" show-overflow-tooltip></el-table-column>
          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>

import {getList, enumAll, getEnumValues, getDictList} from "@/api/safeDanger/glDevice";

export default {
  name: "deviceTable",
  components: {},
  props: {},
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        ciId: '1097755012694017',//默认IT设备
        attrCode: 'deviceCode,deviceName'
      },
      // 总条数
      total: 0,

      options: [],

      tableList: [],
      tableHeight: undefined,
      loading: false,

      ciIdList: [],
      deviceCategoryList: null,
      deviceTypeList: null,
      deviceSourceList: null,

      makerList: null,
      brandList: null,
      seriesList: null,
      deviceModelList: null,
    }
  },
  watch: {
    'queryParams.deviceCategory'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        //加载设备类型
        this.getCmdbDictListPid(this.ciIdList.find(a => a.name == 'deviceType'), newVal);
      }

      this.deviceTypeList = null;
      if (!this.isEmpty(this.queryParams.deviceType)) {
        this.queryParams.deviceType = null;
      }
    },
    'queryParams.maker'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        //加载品牌
        this.getCmdbDictListPid(this.ciIdList.find(a => a.name == 'brand'), newVal);
      }
      //初始化品牌、系列、型号
      this.brandList = null;
      this.seriesList = null;
      this.deviceModelList = null;
      if (!this.isEmpty(this.queryParams.brand)) {
        this.queryParams.brand = null;
      }
      if (!this.isEmpty(this.queryParams.series)) {
        this.queryParams.series = null;
      }
      if (!this.isEmpty(this.queryParams.deviceModel)) {
        this.queryParams.deviceModel = null;
      }
    },
    'queryParams.brand'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        //加载系列
        this.getCmdbDictListPid(this.ciIdList.find(a => a.name == 'series'), newVal);
      }
      //初始化系列、型号
      this.seriesList = null;
      this.deviceModelList = null;
      if (!this.isEmpty(this.queryParams.series)) {
        this.queryParams.series = null;
      }
      if (!this.isEmpty(this.queryParams.deviceModel)) {
        this.queryParams.deviceModel = null;
      }
    },
    'queryParams.series'(newVal, oldVal) {
      if (!this.isEmpty(newVal)) {
        //加载型号
        this.getCmdbDictListPid(this.ciIdList.find(a => a.name == 'deviceModel'), newVal);
      }
      if (this.formValue.disposeStatus == 0) {
        //初始化型号
        this.deviceModelList = null;
        if (!this.isEmpty(this.queryParams.deviceModel)) {
          this.queryParams.deviceModel = null;
        }
      }
    },
  },
  mounted() {
    //获取字典
    enumAll().then(res => {
      let list = res.data;
      if (list) {
        let props = [
          {name: 'deviceCategory', label: '设备分类'},
          {name: 'deviceType', label: '设备类型', loading: false},
          {name: 'deviceSource', label: '设备来源'},
          {name: 'maker', label: '制造商'},
          {name: 'brand', label: '品牌', loading: false},
          {name: 'series', label: '系列', loading: false},
          {name: 'deviceModel', label: '型号', loading: false}
        ];
        props.forEach(item => {
          let fItem = list.find(a => a.enumCiAlias == item.label);
          if (fItem) {
            this.ciIdList.push({name: item.name, label: item.label, enumCiId: fItem.enumCiId, loading: item.loading});
          }
        })
      }
      //加载字典
      for (let i = 0; i < this.ciIdList.length; i++) {
        let item = this.ciIdList[i];
        if (item.loading != false) {
          this.getCmdbDictList(item);
        }
      }
    });
    this.getCurrentHeight()
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true
      getList(this.queryParams).then(response => {
        this.tableList = response.rows
        this.total = response.total
      }).finally(() => {
        this.loading = false
      })
    },
    handleQuery() {

    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 20,
      };
      this.total = 0;
      this.getList();
    },
    getCmdbDictList(item) {
      if (!item) {
        return;
      }
      getEnumValues(item.enumCiId).then(res => {
        if (item.name === 'deviceCategory') {
          // 设备分类
          this.deviceCategoryList = res.data;
        } else if (item.name === 'deviceSource') {
          // 设备来源
          this.deviceSourceList = res.data;
        } else if (item.name === 'maker') {
          // 制造商
          this.makerList = res.data;
        }
      })
    },
    getCmdbDictListPid(item, pid) {
      getDictList({ciId: item.enumCiId, cientityPid: pid}).then(res => {
        if (item.name === 'deviceType') {
          //设备类型
          this.deviceTypeList = res.data;
        } else if (item.name === 'brand') {
          //品牌
          this.brandList = res.data;
        } else if (item.name === 'series') {
          //系列
          this.seriesList = res.data;
        } else if (item.name === 'deviceModel') {
          //型号
          this.deviceModelList = res.data;
        }
      });
    },
    getPlaceholder(list, params) {
      if (params && this.isEmpty(params.name)) {
        return `请先选择${params.label}`;
      }
      return list == null ? '加载中' : '请选择';
    },
    getDisabled(list, params) {
      if (params) {
        if (this.isEmpty(params.name)) {
          return true;
        } else {
          return list == null ? true : false;
        }
      }
      return list == null ? true : false;
    },
    isEmpty(value) {
      if (value == null || value === '') {
        return true;
      }
      return false
    },
    // 获取自适应高度
    getCurrentHeight() {
      let windowHeight = window.innerHeight //窗口高度
      this.tableHeight = (windowHeight - 690) + 'px'
    },
  }
}
</script>

<style lang="scss" scoped>
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

.el-col-24 {
  height: 50px;
}


::v-deep .danger-row {
  background: red;
  color: #333;
}

::v-deep .el-dialog__body {
  height: 50vh !important;
}

::v-deep .el-form-item {
  margin-bottom: 0;
}

.hiddenDetail .el-dialog__body {
  height: 30vh !important;
}

.d_end {
  display: flex;
  justify-content: flex-end;
}
</style>
