<template>
  <div style="height: 100%;overflow: hidden;" class="content-box flex">
    <el-scrollbar :style="{ height: catalogHeight }">
      <formTitle :titleText="'cmdb实时信息'" :titleType="'page_title'"></formTitle>
      <el-form :model="form" ref="dataForm" class="xt_search_form" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="资源ID" prop="appId" size="small">
              <el-select v-model="form.appId" @change="modelChange">
                <el-option
                  v-for="item in deviceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="模型类型" prop="appType" size="small">
              <el-input v-model="form.appType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="ciTypeId：" prop="ciTypeId" size="small">
              <el-input v-model="form.ciTypeId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警状态" prop="health" size="small"> {{showDictLable(form.health,healthList)}} </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="typeCode" prop="typeCode" size="small">  {{form.typeCode}} </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="typeName" prop="typeName" size="small">  {{form.typeName}} </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="typeId" prop="typeId" size="small">  {{form.typeId}} </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="uuid" prop="uuid" size="small">  {{ form.uuid }} </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-button type="primary" size="small" icon="el-icon-setting" plain  @click="getDeatil(id,form.ciTypeId)">在线详情</el-button>
          </el-col>
        </el-row>
      </el-form>
      <formTitle :titleText="'业务信息'" :titleType="'page_title'"></formTitle>
      <el-table size="small" stripe="true" :data="form.itemList" style="width: 100%">
        <el-table-column  prop="key" label="key" width="280"></el-table-column>
        <el-table-column  prop="value" label="value"></el-table-column>
      </el-table>
    </el-scrollbar>
  </div>
</template>

<script>
import {getCmdbrsCmdbCi, getListLocal,  getApplications} from "@/api/h3c/h3capplication";

export default {
  props: ['keyId'],
  data() {
    return{
      keyword: '',
      form: {},
      id: '',
      ciTypeId: '',
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
      this.getDeatil(this.$route.query.id,this.$route.query.ciTypeId);
    }
    //获取 监控设备列表
    this.getList();
  },
  methods: {
    getList(){
      getApplications(1, 100, {}).then(res => {
        const data = res.data;
        this.deviceList = data.records;
      }).catch(() => {
        getListLocal(1, 100, {}).then(res => {
          const data = res.data;
          this.deviceList = data.records;
        })
      });
    },
    getDeatil(id,ciTypeId) {
      let _this = this;
      getCmdbrsCmdbCi({id:id,ciTypeId:ciTypeId}).then(res => {
        if(res.data && res.data.typeId){
          _this.form = res.data
        }
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
          this.ciTypeId = item.ciTypeId||''
          this.$forceUpdate()
          this.getDeatil(this.form.id);
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

