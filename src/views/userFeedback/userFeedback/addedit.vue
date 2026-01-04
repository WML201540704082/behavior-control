<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      :title="getTitle(type)"
      width="600px"
      top="10vh"
      v-el-drag-dialog>
      <el-form ref="submitForm" v-if="formDetial" :model="formDetial" :rules="rules" label-suffix=":"
               label-width="120px" size="small">
        <el-form-item label="反馈编号" prop="backNum" size="small">
          <el-input v-model="formDetial.backNum" placeholder="请输入反馈编号" clearable :disabled="type=='check' || type=='adopt' || type=='finshed'"></el-input>
        </el-form-item>
        <el-form-item label="反馈单位" prop="dept" size="small">
          <el-select
            v-model="formDetial.dept"
            placeholder="请选择反馈单位"
            @change="deptChange"
            filterable
            :disabled="type=='check' || type=='adopt' || type=='finshed'">
            <el-option
              v-for="(item, index) in deptList"
              :key="item.id"
              :label="item.fullName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反馈人员" prop="userName" size="small">
          <el-input v-model="formDetial.userName" placeholder="请输入反馈人员" clearable :disabled="type=='check' || type=='adopt' || type=='finshed'"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime" size="small">
          <el-date-picker v-model="formDetial.createTime" type="datetime" placeholder="请选择创建时间" value-format="yyyy-MM-dd HH:mm:ss" :disabled="type=='check' || type=='adopt' || type=='finshed'" style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone" size="small">
          <el-input v-model="formDetial.phone" placeholder="请输入联系方式" clearable :disabled="type=='check' || type=='adopt' || type=='finshed'"></el-input>
        </el-form-item>
        
        <el-form-item label="问题简介" prop="backBriefly" size="small">
          <el-input type="textarea" v-model="formDetial.backBriefly" placeholder="请输入问题简介" :rows="3" clearable :disabled="type=='check' || type=='adopt' || type=='finshed'"></el-input>
        </el-form-item>
        <el-form-item label="问题类型" prop="backType" size="small">
          <el-select
            v-model="formDetial.backType"
            placeholder="请选择问题类型"
            filterable
            clearable
            :disabled="type=='check' || type=='adopt' || type=='finshed'">
            <el-option
              v-for="(item, index) in backTypeOptions"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" prop="backDetail" size="small">
          <el-input type="textarea" v-model="formDetial.backDetail" placeholder="请输入问题描述" :rows="3" clearable :disabled="type=='check' || type=='adopt' || type=='finshed'"></el-input>
        </el-form-item>
        
        <el-form-item label="上传图片" prop="img" size="small">
          <uploadImg
            :disabled="type=='check' || type=='adopt' || type=='finshed'"
            ref="uploadImg"
            :limit="10"
            :fileList.sync="fileList"
            @setVal="selectDeviceFileHandler"
          ></uploadImg>
        </el-form-item>

        <template v-if="type=='adopt' || type=='finshed' || type=='check'">
          <el-form-item label="是否采纳" prop="isAccept" size="small">
            <el-select
              v-model="formDetial.isAccept"
              placeholder="请选择是否采纳"
              @change="isAcceptChange"
              :disabled="type=='check' || type=='finshed'">
              <el-option
                v-for="(item, index) in isAcceptOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预计完成时间" prop="expectedTime" size="small" v-if="formDetial.isAccept == 1">
            <el-date-picker v-model="formDetial.expectedTime" type="datetime" placeholder="请选择预计完成时间" value-format="yyyy-MM-dd HH:mm:ss" :disabled="type=='check' || type=='finshed'" style="width: 100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="未采纳原因" prop="noAcceptDetail" size="small">
            <el-input type="textarea" v-model="formDetial.noAcceptDetail" placeholder="请输入未采纳原因" :rows="3" clearable :disabled="type=='check' || type=='finshed'"></el-input>
          </el-form-item>
        </template>

        <template v-if="type=='finshed' || type=='check'">
          <el-form-item label="是否完成" prop="isFinish" size="small">
            <el-select
              v-model="formDetial.isFinish"
              placeholder="请选择是否完成"
              :disabled="type=='check'">
              <el-option
                v-for="(item, index) in isFinishOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark" size="small">
            <el-input type="textarea" v-model="formDetial.remark" placeholder="请输入备注" :rows="3" clearable :disabled="type=='check'"></el-input>
          </el-form-item>
        </template>

        
        

        <div class="form-btn d_end">
          <el-button type="primary" error @click="submit" :loading="saveLoading" v-if="type!='check'">{{ getTitle(type) }}</el-button>
          <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getList, getDept, feedbackSave, feedbackUpdate, feedbackDetail, feedbackAccept, feedbackFinish, feedbackLoad} from "@/api/userFeedback/index.js";
import {add, update} from "@/api/operation/safeaccess/areacode";
import uploadImg from "./uploadImg.vue";
import {Message} from "element-ui";
import { getDictList } from '@/api/dict'

export default {
  props: ['isShow', 'arrtId', 'type', 'detailId'],
  components: {uploadImg},
  data() {
    return {
      deptList: [],
      formDetial: {
        isFinish: "",
        backType: ""
      },
      isView: false,
      fileList: [
        // {
        //   url: "http://xt-public-storage.oss-cn-jinan-sddlyf-d01-a.ops-devcloud.sd.sgcc.com.cn/upload/20250327/c018f202546bd257905e8a5342e4e202.png"
        // }
      ],
      isAcceptOptions: [],
      isFinishOptions: [
        {
          dictKey: '1',
          dictValue: '是'
        },
        {
          dictKey: '0',
          dictValue: '否'
        },
      ],
      backTypeOptions: [],

      saveLoading: false,
      typeList: null,
      rules: {
        backNum: [{required: true, message: '反馈编号不能为空', trigger: 'blur'}],
        dept: [{required: true, message: '反馈单位不能为空', trigger: 'change'}],
        userName: [{required: true, message: '反馈人员不能为空', trigger: 'blur'}],
        createTime: [{required: true, message: '创建时间不能为空', trigger: 'change'}],
        phone: [{required: true, message: '联系方式不能为空', trigger: 'blur'}],
        backDetail: [{required: true, message: '问题描述不能为空', trigger: 'blur'}],
        backType: [{required: true, message: '问题类型不能为空', trigger: 'change'}],
        backBriefly: [{required: true, message: '问题简介不能为空', trigger: 'blur'}],
        img: [{required: true, message: '上传图片不能为空', trigger: 'change'}],
        isAccept: [{required: true, message: '是否采纳不能为空', trigger: 'change'}],
        expectedTime: [{required: true, message: '预计完成时间不能为空', trigger: 'change'}],
        noAcceptDetail: [{required: true, message: '未采纳原因不能为空', trigger: 'blur'}],
        isFinish: [{required: true, message: '是否完成不能为空', trigger: 'change'}],
        // remark: [{required: true, message: '备注不能为空', trigger: 'blur'}],
        
      },
    }
  },
  computed: {},
  mounted() {
    this.getDeptList();
    this.getDictList('back_isAccept')
    this.getDictList('back_type')
    if (this.type == 'add') {
      feedbackLoad().then(res=>{
        this.formDetial = res.data
      })
    }
    if (this.type != 'add') {
      feedbackDetail({id: this.detailId}).then(res=>{
        this.formDetial = res.data;
        if(res.data.img){
          let urlArr = res.data.img.split(',')
          this.fileList = urlArr.map(ele=>{
            return {
              url: ele
            }
          })
        }
      })
    }
    
  },
  watch: {
    'formDetial.isAccept': {
      // deep: true,
      handler(val, oldVal) {
        // console.log(val)
        if(val == 1){ // 已采纳
          this.rules.noAcceptDetail = [{required: false, message: '未采纳原因不能为空', trigger: 'blur'}]
          this.$refs.submitForm.validateField('noAcceptDetail')
        }else{ // 未采纳
          this.rules.noAcceptDetail = [{required: true, message: '未采纳原因不能为空', trigger: 'blur'}]
        }
      },
    }
  },
  methods: {
    isAcceptChange(val){
      // console.log(val)
      // if(val == 1){ // 已采纳
      //   this.rules.noAcceptDetail = [{required: false, message: '未采纳原因不能为空', trigger: 'blur'}]
      //   this.$refs.submitForm.validateField('noAcceptDetail')
      // }else{ // 未采纳
      //   this.rules.noAcceptDetail = [{required: true, message: '未采纳原因不能为空', trigger: 'blur'}]
      // }
    },
    deptChange(val){
      let current = this.deptList.filter(ele=> ele.id==val)[0]
      this.formDetial.deptName = current.fullName
    },
    getDictList(code){
      //加载字典
      getDictList(code).then(res => {
        if(code==='back_isAccept'){
          this.isAcceptOptions = res.data
        }else if(code==='back_type'){
          this.backTypeOptions = res.data
        }

      })
    },

    selectDeviceFileHandler(file123, fileList){
      //新增文件
      // this.form.orderFile = undefined
      // if(file123){
      //   this.form.orderFile = file123
      // }
      // console.log(111, file123, fileList)

      let arr = fileList.map(ele=> {
        if(ele.response){
          return ele.response.data.link
        }else{
          return ele.url
        }
      })
      this.formDetial.img = arr.join(',')

      this.$refs.submitForm.validateField('img')
    },
    getDeptList() {
      getDept({}).then(res=>{
        this.deptList = res.data
      })
    },
    selectionChange(val) {
      this.selectionList = val;
    },
    submit() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          if (this.type == 'add') {
            this.saveLoading = true;
            feedbackSave(this.formDetial).then(res => {
              this.saveLoading = false
              this.$message.success('添加成功');
              this.$emit("close");
              this.$emit("refreshData");
            });
          } else if (this.type == 'edit') {
            this.saveLoading = true;
            feedbackUpdate(this.formDetial).then(res => {
              this.saveLoading = false
              this.$message.success('修改成功');
              this.$emit("close");
              this.$emit("refreshData");
            });
          } else if (this.type == 'adopt') {
            this.saveLoading = true;
            feedbackAccept(this.formDetial).then(res => {
              this.saveLoading = false
              this.$message.success('操作成功');
              this.$emit("close");
              this.$emit("refreshData");
            });
          } else if (this.type == 'finshed') {
            this.saveLoading = true;
            feedbackFinish(this.formDetial).then(res => {
              this.saveLoading = false
              this.$message.success('操作成功');
              this.$emit("close");
              this.$emit("refreshData");
            });
          }
        }
      })
    },
    getTitle(type) {
      if (type == 'add') {
        return '新 增';
      } else if (type == 'edit') {
        return '更 新';
      } else if (type == 'check') {
        return '查 看';
      } else if (type == 'adopt') {
        return '采 纳';
      } else if (type == 'finshed') {
        return '完 成';
      }
      return null;
    },
  }
}
</script>

<style lang="scss" scoped>
.d_end {
  display: flex;
  justify-content: flex-end;
}

.d_end button {
  width: 100px;
}
</style>
