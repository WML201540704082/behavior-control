<template>
  <div style="height: 100%;overflow: hidden;" class="content-box flex">

      <formTitle :titleText="name" :titleType="'page_title'"></formTitle>
      <el-form :model="form" ref="dataForm" class="xt_search_form" label-width="150px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="数据模板ID：" prop="appId" size="small"> {{form.modelId}}  </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="H3C模型类型：" prop="appType" size="small">
              <el-input v-model="form.appType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="H3C模型ID：" prop="appId" size="small">  {{form.appId}} </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <formTitle :titleText="'业务信息'" :titleType="'page_title'">
        <div slot="rightBtnBox">
          <el-button class="query-btn" size="small" @click="dataDialogShowHandler">数据预览</el-button>
          <el-button class="query-btn" size="small" @click="addDialogShowHandler">新增指标</el-button>
        </div>
      </formTitle>
    <el-scrollbar :style="{ height: catalogHeight, 'padding-bottom': '15px'  }">
      <el-card class="box-card">
        <el-table size="small"
                  :height="tableHeight"
                  :data="devicecolumnunitList"
                  style="width: 100%">

          <el-table-column  prop="colName" label="模型字段" width="150"></el-table-column>
<!--          <el-table-column  prop="modelId" label="模型Id" width="180"></el-table-column>-->
          <el-table-column prop="type" label="计算方法" width="100"></el-table-column>
<!--          <el-table-column prop="appId" label="监控UUID"  width="120"></el-table-column>-->
          <el-table-column prop="appType" label="监控类型"  width="120"></el-table-column>
          <el-table-column prop="appUnit" label="监控指标组" width="120"></el-table-column>
          <el-table-column prop="appUnitHeader" label="绑定指标" width="260"></el-table-column>
          <el-table-column prop="remark" label="备注"  width="200"></el-table-column>
          <el-table-column  prop="colId" label="模型字段id" width="150"></el-table-column>
          <el-table-column prop="resType" label="来源"></el-table-column>
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template  slot-scope="scope">
              <el-button type="text"  size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text"  size="small" @click="handleDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-scrollbar>
    <!-- 编辑弹框 -->
    <el-dialog title="编辑" :visible.sync="columnFormVisible" width="360" append-to-body>
      <el-form :model="columnForm" size="small" ref="columnForm" label-width="120px">
        <el-form-item label="模型字段id"  prop="colId" :rules="[{ required: false, message: '模型字段id不能为空'}]">
          <el-input v-model="columnForm.colId"  placeholder="请输入模型字段id" disabled></el-input>
        </el-form-item>
        <el-form-item label="模型字段"  prop="colName" :rules="[{ required: false, message: '模型字段id不能为空'}]">
          <el-select v-model="columnForm.colName" @change="columnChange">
            <el-option v-for="(item, index) in columnList"
                       :key="index"
                       :label="item.code+' / '+ item.name"
                       :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型Id"  prop="modelId" :rules="[{ required: true, message: '模型Id不能为空'}]">
          <el-input v-model="columnForm.modelId"  placeholder="请输入模型Id" disabled></el-input>
        </el-form-item>
        <el-form-item label="计算方法"  prop="type" :rules="[{ required: true, message: '计算方法不能为空'}]">
          <el-select v-model="columnForm.type" placeholder="请输入计算方法" clearable >
            <el-option  key="取值"  label="取值" value="取值"></el-option>
            <el-option  key="固定值"  label="固定值" value="固定值"></el-option>
            <el-option  key="求和"  label="求和" value="求和"></el-option>
            <el-option  key="拼接json"  label="拼接json" value="拼接json"></el-option>
            <el-option  key="取最大值"  label="取最大值" value="取最大值"></el-option>
            <el-option  key="取最小值"  label="取最小值" value="取最小值"></el-option>
            <el-option  key="计数"  label="计数" value="计数"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控UUID"  prop="appId" :rules="[{ required: false, message: '监控UUID不能为空'}]">
          <el-input v-model="columnForm.appId"  placeholder="请输入监控UUID"></el-input>
        </el-form-item>
        <el-form-item label="监控类型"  prop="appType" :rules="[{ required: false, message: '监控类型不能为空'}]">
          <el-input v-model="columnForm.appType"  placeholder="请输入监控类型"></el-input>
        </el-form-item>
        <el-form-item label="监控指标组"  prop="appUnit" :rules="[{ required: false, message: '监控指标组不能为空'}]">
          <el-input v-model="columnForm.appUnit"  placeholder="请输入监控指标组"></el-input>
        </el-form-item>
        <el-form-item label="绑定指标"  prop="appUnitHeader" :rules="[{ required: true, message: '绑定指标不能为空'}]">
          <el-input v-model="columnForm.appUnitHeader"  placeholder="请输入绑定指标"></el-input>
        </el-form-item>
        <el-form-item label="备注"  prop="remark" :rules="[{ required: false, message: '备注不能为空'}]">
          <el-input v-model="columnForm.remark"  placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="数据来源"  prop="resType" :rules="[{ required: true, message: '来源不能为空'}]">
          <el-select v-model="columnForm.resType" placeholder="选择来源" clearable >
            <el-option  key="iom"  label="iom" value="iom"></el-option>
            <el-option  key="cmdb"  label="cmdb" value="cmdb"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addHandler">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 数据列表 -->
    <mode-chwserver-dialog
      :modelId="form.modelId"
      :h3cModelType="form.appType"
      :h3cModelId="h3cModelId"
      :name="name"
      :visible.sync="dataDialogVisible"
      :isShow="dataDialogVisible"
      @close="dataDialogVisible = false"></mode-chwserver-dialog>
  </div>
</template>

<script>
import {getList, getDetail, add, update, remove ,getColumnList} from "@/api/data/devicecolumnunit";
import ModeChwserverDialog from "@/views/h3c/components/modeChwserverDialog.vue";
export default {
  components: {ModeChwserverDialog},
  props: ['keyId','name',"h3cModelType","h3cModelId"],
  data() {
    return{
      keyword: '',
      form: {
        modelId: '1777628067834847233',
        appId: undefined,
        appType: undefined,
      },
      columnForm: {
        modelId: '1777628067834847233',
        appId: undefined,
        appType: undefined,
      },
      id: '',
      columnList: [],
      tableHeight: '60vh',
      columnFormVisible: false,
      dataDialogVisible: false,
      devicecolumnunitList: [],
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
      catalogHeight: `calc(100% - 200px)` // 默认值高度：50px搜索框高度（21外边距）

    }
  },
  watch: {
    keyId(keyId) {
      this.keyId = keyId;
      //初始化数据
      this.init();
    }

  },
  mounted() {

    //初始化数据
    this.init();

  },
  methods: {
    //初始化id
    init(){
      if(!this.name){
        this.name = '华为服务器Huawei Server CST信息';
      }
      if(this.keyId){
        this.form.modelId = this.keyId;
        this.columnForm.modelId = this.keyId;
      }
      if(this.h3cModelType){
        this.form.appType = this.h3cModelType;
        this.form.appId = this.h3cModelId;
        this.columnForm.appId = this.h3cModelId;
        this.columnForm.appType = this.h3cModelType;
      }
      //this.getDeatil(this.$route.query.id)
      //加载列表
      this.getDataList()
      // 设置表格高度
      this.setTableHeight()
      //加载 Column列表
      this.getColumnList()
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight-230) + 'px'
    },
    getDataList() {
      let _this = this;
      this.loading = true;
      getList(1, 300, {modelId:this.form.modelId}).then(res => {
        const data = res.data;
        _this.devicecolumnunitList = data.records;
        _this.loading = false;
      });
    },
    getDetail(id){
      //获取详情
      getDetail(id).then(res => {
        this.columnForm = res.data;
      });
    },
    getColumnList(){
      //获取模板对应 字段
      let _this = this;
      getColumnList(1, 300, {modelId:this.form.modelId}).then(res => {
        const data = res.data;
        _this.columnList = data.records;
      });
    },
    columnChange(code){
      //选择字段
      let items = this.columnList.filter(item => item.id===(""+code));
      if (items != null && items.length > 0) {
        this.columnForm.colId = items[0].id;
        this.columnForm.colName = items[0].code+' / '+ items[0].name;
      }
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
    dataDialogShowHandler(){
      //数据预览
      this.dataDialogVisible = true;
    },
    addDialogShowHandler() {
      //弹框
      this.columnFormVisible = true;
      this.columnForm = {}
      this.columnForm.modelId = this.form.modelId
      this.columnForm.appId = this.form.appId
      this.columnForm.appType = this.form.appType
    },
    addHandler(){
      //新增
      this.$refs.columnForm.validate((valid) => {
        if(valid) {
          if(this.columnForm.id){
            //修改
            update(this.columnForm).then(res => {
              this.$message({
                type: "success",
                message: "操作成功!"+res.code
              });
              this.getDataList()
              this.columnFormVisible = false;
              this.columnForm = {}
            }).catch(() => {  })
          }else {
            //新增
            add(this.columnForm).then(res => {
              this.$message({
                type: "success",
                message: "操作成功!" + res.code
              });
              this.getDataList()
              this.columnFormVisible = false;
              this.columnForm = {}
            }).catch(() => { })
          }
        }
      })
    },
    handleEdit(row){
      //编辑
      if(row){
        this.columnFormVisible = true;
        this.columnForm = row||{}
      }
    },
    handleDel(row){
      //删除
      this.$confirm("点击确认将永久删除数据且无法恢复，请谨慎选择。","确定将选择数据删除?", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.getDataList()
        });
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

