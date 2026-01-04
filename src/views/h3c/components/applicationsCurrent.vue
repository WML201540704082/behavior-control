<template>
  <div style="height: 100%;overflow: hidden;" class="content-box flex">
    <el-scrollbar :style="{ height: catalogHeight }">
      <formTitle :titleText="'iom实时信息'" :titleType="'page_title'"></formTitle>
      <el-form :model="form" ref="dataForm" class="xt_search_form" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="资源ID" prop="appId" size="small">
              <el-select v-model="form.appId" @change="modelChange">
                <el-option  v-for="item in deviceList"  :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资源类型" prop="appType" size="small">
              <el-input v-model="form.appType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="可用性" prop="available" size="small">  {{showDictLable(form.available,availableList)}} </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警状态" prop="health" size="small"> {{showDictLable(form.health,healthList)}} </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-button type="primary" size="small" icon="el-icon-setting" plain  @click="getDeatil(id)">在线详情</el-button>
<!--            <el-button type="primary" size="small" icon="el-icon-setting" plain  @click="getLoaclDeatil(id)">本地详情</el-button>-->
          </el-col>
        </el-row>
      </el-form>
      <formTitle :titleText="'业务信息'" :titleType="'page_title'"></formTitle>
      <el-collapse>
        <el-collapse-item :title=" (itemindex+1)+'、分组:['+item.appId +'.'+ item.appType +'.'+ item.appUnit+']'" :name="item.appType  + item.appUnit" v-for="(item,itemindex)  in form.unitData" :key="item.appId">
      <el-card class="box-card">
        <el-table size="small" stripe="true" :data="item.headers" style="width: 100%">
          <el-table-column  prop="appId" label="资源ID" width="180"></el-table-column>
          <el-table-column  prop="appField" label="指标" width="180"></el-table-column>
          <el-table-column prop="valueType" label="值类型" width="120">
            <template slot-scope="scope">
              {{ scope.row.valueType === 1? '数字':'字符串' }}
            </template>
          </el-table-column>
          <el-table-column prop="valueUnit" label="单位"></el-table-column>
          <el-table-column prop="unitGroup" label="指标单位组">
            <template slot-scope="scope">
              {{ scope.row.unitGroup!="" ? scope.row.unitGroup : item.appUnit }}
            </template>
          </el-table-column>
          <el-table-column prop="unitGroup" label="拼接取值" width="320">
            <template slot-scope="scope">
              {{ item.appType }}.{{ item.appUnit }}.{{ scope.row.appField }}
            </template>
          </el-table-column>
        </el-table>
        <div class="clearfix"><span style="font-size: 16px;"> 动态业务数据： </span></div>
        <div :key="values" v-for="values in item.values">
          <el-table size="mini"  border="true" :data="values" style="width: 100%">
<!--            <el-table-column  prop="appId" label="资源ID" width="180"></el-table-column>-->
            <el-table-column  prop="appField" label="指标" width="180"></el-table-column>
            <el-table-column prop="valueType" label="值类型" width="120">
              <template slot-scope="scope">
                {{ scope.row.valueType === 1? '数字':'字符串' }}
              </template>
            </el-table-column>
            <el-table-column prop="valueUnit" label="单位"></el-table-column>
            <el-table-column prop="unitGroup" label="指标单位组"></el-table-column>
            <el-table-column prop="instanceId" label="例ID"></el-table-column>
            <el-table-column prop="value" label="原始值"></el-table-column>
            <el-table-column prop="minValue" label="聚合数据最小值"></el-table-column>
            <el-table-column prop="maxValue" label="聚合数据最大值"></el-table-column>
          </el-table>
        </div>
      </el-card>

        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </div>
</template>

<script>
import {getLocalDetail, getApplicationsCurrent, getListLocal,  getApplications} from "@/api/h3c/h3capplication";

export default {
  props: ['keyId'],
  data() {
    return{
      keyword: '',
      form: {},
      id: '',
      availableList: [
        {dictKey: '0',dictValue: '可用'},
        {dictKey: '2',dictValue: 'Ping不可达'},
        {dictKey: '3',dictValue: '协议连接失败'},
        {dictKey: '4',dictValue: '未知(显示:–)'},
      ],
      healthList: [
        {dictKey: '0',dictValue: '正常'},
        {dictKey: '1',dictValue: '未知(显示:–)'},
        {dictKey: '2',dictValue: ''},
        {dictKey: '3',dictValue: '通知'},
        {dictKey: '4',dictValue: '警告'},
        {dictKey: '5',dictValue: '次要'},
        {dictKey: '6',dictValue: '重要'},
        {dictKey: '7',dictValue: '紧急'},
      ],
      deviceList: [],
      catalogHeight: `calc(100% - 53px)` // 默认值高度：50px搜索框高度（21外边距）

    }
  },
  mounted() {
    if(this.keyId){
      this.form.appId = this.keyId
    }
    if(this.$route.query.id){
      this.getDeatil(this.$route.query.id);
    }
    //获取 监控设备列表
    this.getList();
  },
  methods: {
    getList(){
      getApplications(1, 100, {appType: this.form.appType}).then(res => {
        const data = res.data;
        this.deviceList = data.records;
      }).catch(() => {
        getListLocal(1, 100, {}).then(res => {
          const data = res.data;
          this.deviceList = data.records;
        })
      });
    },
    getDeatil(id) {
      let _this = this;
      getApplicationsCurrent(id).then(res => {
        _this.form = res.data.data[0]
        //console.log(_this.form.unitData)
        _this.form.unitData.forEach((item, uidx) => {
           //获取指标组
          item.values.forEach((valItem, vidx) => {
            //获取指标组
            valItem.forEach((val, vvidx) => {
              _this.form.unitData[uidx].values[vidx][vvidx].appId = item.headers[vvidx].appId||''
              _this.form.unitData[uidx].values[vidx][vvidx].appField = item.headers[vvidx].appField||''
              _this.form.unitData[uidx].values[vidx][vvidx].valueType = item.headers[vvidx].valueType||''
              _this.form.unitData[uidx].values[vidx][vvidx].valueType = item.headers[vvidx].valueType||''
              _this.form.unitData[uidx].values[vidx][vvidx].valueUnit = item.headers[vvidx].valueUnit||''
              _this.form.unitData[uidx].values[vidx][vvidx].unitGroup = item.headers[vvidx].unitGroup||''
            })
          })
        })
        //console.log(_this.form.unitData)
      })
    },
    getLoaclDeatil(id) {
      let _this = this;
      getLocalDetail(id).then(res => {
        _this.form = res.data.data[0]
        //console.log(_this.form.unitData)
        _this.form.unitData.forEach((item, uidx) => {
          //获取指标组
          item.values.forEach((valItem, vidx) => {
            //获取指标组
            valItem.forEach((val, vvidx) => {
              _this.form.unitData[uidx].values[vidx][vvidx].appId = item.headers[vvidx].appId||''
              _this.form.unitData[uidx].values[vidx][vvidx].appField = item.headers[vvidx].appField||''
              _this.form.unitData[uidx].values[vidx][vvidx].valueType = item.headers[vvidx].valueType||''
              _this.form.unitData[uidx].values[vidx][vvidx].valueType = item.headers[vvidx].valueType||''
              _this.form.unitData[uidx].values[vidx][vvidx].valueUnit = item.headers[vvidx].valueUnit||''
              _this.form.unitData[uidx].values[vidx][vvidx].unitGroup = item.headers[vvidx].unitGroup||''
            })
          })
        })
        //console.log(_this.form.unitData)
      })
    },
    showDictLable(code,dictList){
      //字典回显
      if(dictList!=null && code!=''){
        let items = dictList.filter(item => item.dictKey===(""+code));
        if(items!=null && items.length>0){
          return items[0].dictValue;
        }
      }
      return code;
    },
    modelChange(val) {
      //获取模型
      for(let i=0; i<this.deviceList.length; i++) {
        let item = this.deviceList[i]
        if(item.id === val) {
          this.form.appType = item.appType
          this.form.available = item.available
          this.form.health = item.health
          this.form.id = item.id
          this.id = item.id
          this.getDeatil(this.form.id);
          //this.getLoaclDeatil(this.form.id);
        }
      }
    },
  }
}
</script>
<style lang='scss' scoped>
.clearfix {
  *zoom: 1;
  line-height: 30px;
  margin-top: 5px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
  line-height: 0;
}
.clearfix:after {
  clear: both;
}
.item {
  margin-bottom: 18px;
}
</style>

