<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      :title="isCollect ? '典型经验详情' : '新建典型经验'"
      width="1000px"
      top="5vh"
      v-el-drag-dialog
    >
      <el-form
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
        :disabled="isCollect"
        label-suffix=":"
        label-width="120px"
      >
        <el-form-item label="知识标题" prop="title">
          <el-input v-model="submitForm.title" placeholder="请输入" :maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="知识描述" prop="problem">
          <el-input v-model="submitForm.problem" placeholder="请输入" type="textarea" :rows="5" :maxlength="500" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="解决方案" prop="answer">
          <el-input v-model="submitForm.answer" placeholder="请输入" type="textarea" :rows="5" :maxlength="500" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="知识类型" prop="type">
          <el-select v-model="submitForm.type" placeholder="请选择">
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="知识提报人" prop="createBy">
          <el-input v-model="submitForm.createBy" placeholder="请输入" disabled :maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="submitForm.phone" placeholder="请输入" :maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="deptName">
          <el-input v-model="submitForm.deptName" placeholder="请输入" disabled :maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="知识提报时间" prop="createTime">
          <el-date-picker
                  v-model="submitForm.createTime"
                  disabled
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择"></el-date-picker>
        </el-form-item>
        

        
        <div class="btn_box" v-if="!isCollect">
          <el-button type="primary" @click="zancun" :loading="saveLoading1">暂存</el-button>
          <el-button type="primary" @click="submit" :loading="saveLoading">提交</el-button>
          <el-button type="primary" @click="$emit('close')">取消</el-button>
        </div>
      </el-form>

      <el-form
        v-if="isShenpi"
        ref="submitForm2"
        :model="submitForm2"
        :rules="rules2"
        label-suffix=":"
        label-width="100px"
        style="border-top: 1px solid #d9d9d9;padding-top: 10px;"
      >
        <el-form-item label="审核结果" prop="result">
          <el-radio-group v-model="submitForm2.result">
            <el-radio :label="0">未通过</el-radio>
            <el-radio :label="1">已通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="comment">
          <el-input v-model="submitForm2.comment" type="textarea" :rows="5" :maxlength="500" show-word-limit></el-input>
        </el-form-item>

        
        <div class="btn_box">
          <el-button type="primary" @click="submit2" :loading="saveLoading">提交</el-button>
          <el-button type="primary" @click="$emit('close')">取消</el-button>
        </div>
      </el-form>
      <!-- <el-form
        ref="searchForm"
        :model="searchForm"
        label-suffix=":"
        label-width="100px"
        @submit.native.prevent
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="问题标题" prop="resourceCondition">
              <el-input v-model="searchForm.resourceCondition"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="问题标题" prop="resourceCondition">
              <el-input v-model="searchForm.resourceCondition"></el-input>
            </el-form-item>
          </el-col>
        </el-row>




        <el-col :span="14" class="btn_box">
            <el-button size="mini" type="primary" @click="search">查询</el-button>
            <el-button size="mini" type="primary" plain @click="restForm">重置</el-button>
            
          </el-col>
      </el-form> -->
      
    </el-dialog>
  </div>
</template>

<script>
import { getDictList } from "@/api/dict";
import { knowledgePage, knowledgeDelete, knowledgeSave, knowledgeSubmit, knowledgeDetail, knowledgeReview } from "@/api/ictOperation/index"
// 文件上传
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'
import { formatDate } from '@/util/date'
import { mapGetters } from "vuex";

export default {
  props: ['isShow', 'questionId', 'isCollect', 'isShenpi'],
  data() {
    return{
      submitForm2: {},

      typeList: [],
      saveLoading1: false,
      saveLoading: false,
      submitForm: {
        createBy: undefined
      },
      rules: {
        title: [
          { required: true, message: "知识标题不能为空", trigger: "blur" },
        ],
        problem: [
          { required: true, message: "知识描述不能为空", trigger: "blur" },
        ],
        answer: [
          { required: true, message: "解决方案不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "知识类型不能为空", trigger: "blur" },
        ],
        createBy: [
          { required: true, message: "知识提报人不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
          { pattern:/^1[3-9]\d{9}$/, message:'手机号码格式错误', trigger:'blur' }
        ],
        deptName: [
          { required: true, message: "单位不能为空", trigger: "blur" },
        ],
        createTime: [
          { required: true, message: "知识提报时间不能为空", trigger: "blur" },
        ],
      },
      rules2: {
        result: [
          { required: true, message: "审核结果不能为空", trigger: "change" },
        ],
        comment: [
          { required: true, message: "审核意见不能为空", trigger: "blur" },
        ],
      },

      searchForm: {
        current: 1,
        size: 20,
        resourceCondition: '',
        dept: '',
        deptName: '',
      },


    }
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  mounted() {
    this.getDict()
    

    if(this.questionId){
      knowledgeDetail({ id: this.questionId }).then(res=>{
        this.submitForm = res.data
      })

      this.initForm()
    }else{
      this.submitForm.createBy = this.userDetail.realName;
      // this.submitForm.dept = this.userDetail.ownerUnitName;
      this.submitForm.createTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      this.submitForm.dept = this.$store.state.user.userDetail.deptId
      this.submitForm.deptName = this.$store.state.user.userDetail.deptName
    }
  },
  methods: {
    initForm() {
      this.submitForm2.id = this.questionId
      this.$forceUpdate()
    },
    submit2() {
      this.$refs.submitForm2.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          knowledgeReview(this.submitForm2).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.$emit('close')
            this.$emit('addClose')
          })
        }
      })
    },


    // 字典值
    getDict() {
      let dict = ['control_knowledge_type']
      for(let i=0; i<dict.length; i++) {
        getDictList(dict[i]).then(res => {
          if(dict[i] == 'control_knowledge_type') { //问题类型
            this.typeList = res.data
          }
        })
      }
    },
    zancun(){
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          // console.log(111, this.submitForm)
          this.saveLoadin1g = true;
          knowledgeSave(this.submitForm).then((res) => {
            this.$message({
              message: "暂存成功！",
              type: "success",
            });
            this.submitForm.id = res.data.id;
            this.saveLoading1 = false;
            this.$emit('addClose')
          });
        } else {
          this.$message({
            message: "请完善表单项",
            type: "warning",
          });
        }
      });
      // knowledgeSave
      // knowledgeSubmit
    },
    submit(){
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          // console.log(222, this.submitForm)
          this.saveLoading = true;
          knowledgeSubmit(this.submitForm).then((res) => {
            this.$message({
              message: "提交成功！",
              type: "success",
            });
            this.saveLoading = false;
            this.$emit('close')
            this.$emit('addClose')
          });
        } else {
          this.$message({
            message: "请完善表单项",
            type: "warning",
          });
        }
      });


      // questionSubmit(this.submitForm).then(res => {
      //   this.saveLoading = false
      //   this.$emit('close')
      // })
    },
    
    search() {
      this.searchForm.current = 1
      this.getList()
    },
    restForm() {
      this.searchForm = {
        current: 1,
        size: 20,
        resourceCondition: '',
      }
      this.getList()
    },
    delBtn(row) {
      this.$confirm('确定删除该问答项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        knowledgeDelete({id: row.id}).then(res => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.getList()
        })
      })
    },

  },
}
</script>

<style lang="scss" scoped>
::v-deep .btn_box{
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  margin: 15px 0;
}
</style>
