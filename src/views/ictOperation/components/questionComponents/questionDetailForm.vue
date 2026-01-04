<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      :visible.sync="isShow"
      :title="isChuli? '问题处理' : '问题详情'"
      width="1200px"
      top="5vh"
      v-el-drag-dialog
    >
      <div class="question_detail" v-loading="pageLoading">
        <div class="question_title">
          {{detailForm.title}}
        </div>
        <!-- <div class="question_time">
          <span style="color:#333">发布时间：</span>
          {{detailForm.createTime}}
        </div> -->
        <div class="question_describe">
          <div class="describe_title">问题描述：</div>
          <div class="describe_content">
            <el-form
              v-if="isChuli"
              ref="xqForm"
              :model="submitForm"
              :rules="rules"
              label-width="0"
            >
              <el-form-item label="" prop="content">
                <el-input v-model="submitForm.content" type="textarea" :rows="5" maxlength="500" show-word-limit></el-input>
              </el-form-item>
            </el-form>

            <span v-else>{{detailForm.content}}</span>
          </div>
          <div class="describe_img" v-if="imgList.length > 0">
            <span
              v-for="(item, index) in imgList"
              :key="index"
              class="img_item"
            >
              <el-image
                style="width:150px;height:90px"
                :src="item"
                :preview-src-list="imgList"
              ></el-image>
            </span>

          </div>
        </div>
        <!-- 省测处理 -->
        <div class="question_describe" v-if="isChuli">
          <template>
            <el-form
              ref="xqForm"
              :model="submitForm"
              :rules="rules"
              label-width="0"
            >
              <div class="describe_line describe_line2">
                <div class="describe_title">纳入需求：</div>
                <div class="describe_content">
                  <el-form-item label="">
                    <el-checkbox v-model="checked" @change="handleChange"></el-checkbox>
                  </el-form-item>
                </div>
              </div>
              <div class="describe_line">
                <div class="describe_title">解决方案：</div>
                <div class="describe_content">
                  <el-form-item label="" prop="comment">
                    <el-input v-model="submitForm.comment" type="textarea" :rows="5" maxlength="500" show-word-limit></el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </template>
        </div>
        <div class="question_describe" v-if="!isChuli && detailForm.status != 1">
          <template>
            <div class="describe_title">解决方案：</div>
            <div class="describe_content">
              <span>{{detailForm.comment}}</span>
              <!-- <el-form
                v-if="isChuli"
                ref="xqForm"
                :model="submitForm"
                :rules="rules"
                label-width="0"
              >
                <el-form-item label="" prop="comment">
                  <el-input v-model="submitForm.comment" type="textarea" :rows="5"></el-input>
                </el-form-item>
              </el-form>

              <span v-else>{{detailForm.comment}}</span> -->
            </div>
          </template>
        </div>

        <div class="question_info" v-if="(!isChuli && detailForm.status > 1) || isChuli">
          
            <div class="info_item">
              <span class="question_info_name question_info_name2">解决人：</span>
              <el-form
                ref="xqForm"
                :model="submitForm"
                :rules="rules"
                label-width="0"
                v-if="isChuli"
                class="mm1"
              >
                <el-form-item label="" prop="handler">
                  <el-input v-model="submitForm.handler" size="mini" disabled></el-input>
                </el-form-item>
              </el-form>
              <span v-else>{{ detailForm.handler }}</span>
            </div>
            <div class="info_item">
              <span class="question_info_name question_info_name2">联系电话：</span>
              <el-form
                ref="xqForm"
                :model="submitForm"
                :rules="rules"
                label-width="0"
                v-if="isChuli"
                class="mm1"
              >
                <el-form-item label="" prop="handlerTel">
                  <el-input v-model="submitForm.handlerTel" size="mini"></el-input>
                </el-form-item>
              </el-form>
              <span v-else>{{ detailForm.handlerTel }}</span>
            </div>

        </div>
        <div class="question_wrap">
          <div class="question_wrap_l">
            基础信息
          </div>
          <div class="question_info">
            <div
              v-for="(item, index) in infoItemList"
              :key="index"
              class="info_item"
            >
              <!-- <img src="../../img/frame.png" alt=""> -->
              <span class="question_info_name">{{item.name}}：</span>
              <span v-if="item.name=='问题状态'" class="item_status" :class="'item_status' + detailForm['status']" style="margin-left: 0px; height: fit-content;">{{getValue(item)}}</span>
              <span v-else style="flex: 1;">{{getValue(item)}}</span>
            </div>
          </div>
        </div>
        <div class="question_icon">
          <i @click="isInfo = !isInfo" :class="[isInfo?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
        </div>

        <!-- 纳入需求 -->
        <div class="question_describe" v-if="isJiejue || (detailForm.status==3 && detailForm.isResolve==1 && !isJiejue)">
          <template v-if="isJiejue">
            <el-form 
              ref="submitForm2"
              :model="submitForm2"
              :rules="rules2"
              label-width="0"
            >
              <!-- <div class="describe_line">
                <div class="describe_title">需求确认：</div>
                <div class="describe_content">
                  <el-form-item label="" prop="needConfirm">
                    <el-input v-model="submitForm2.needConfirm" type="textarea" :rows="5"></el-input>
                  </el-form-item>
                </div>
              </div> -->
              <div class="describe_line">
                <div class="describe_title">纳入需求后的解决方案：</div>
                <div class="describe_content">
                  <el-form-item label="" prop="solution">
                    <el-input v-model="submitForm2.solution" type="textarea" :rows="5" maxlength="500" show-word-limit></el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </template>
          <template v-if="detailForm.status==3 && detailForm.isResolve==1 && !isJiejue">
            <div class="describe_title">纳入需求后的解决方案：</div>
            <div class="describe_content">
              <span>{{detailForm.solution}}</span>
            </div>
          </template>
        </div>
        
        <!-- 省处理展示 -->
        <!-- <div class="question_info question_info2" v-if="infoItemList2.length != 0">
          <div class="shengTit">省测处理</div>
          <div
            v-for="(item, index) in infoItemList2"
            :key="index"
            :class="{
              info_item: true, 
              info_item2: true
            }"
          >
            <img src="../../img/frame.png" alt="">
            <span class="ww1">{{item.name}}:</span>
            <span class="ww2">{{getValue(item)}}</span>
          </div>
        </div> -->
        <!-- 需求展示 -->
        <!-- <div class="question_info question_info2" v-if="detailForm.status==3 && !isJiejue">
          <div class="shengTit">纳入需求</div>
          <div
            v-for="(item, index) in infoItemList3"
            :key="index"
            :class="{
              info_item: true, 
              info_item2: true
            }"
          >
            <img src="../../img/frame.png" alt="">
            <span class="ww1">{{item.name}}:</span>
            <span class="ww2">{{getValue(item)}}</span>
          </div>
        </div> -->
        <!-- <div class="question_info2" v-if="isChuli">
          <div class="shengTit">省测处理</div>
          <el-form
            v-if="isChuli"
            ref="xqForm"
            :model="submitForm"
            :rules="rules"
            label-suffix=":"
            label-width="100px"
          >
            <el-form-item label="纳入需求">
              <el-checkbox v-model="checked" @change="handleChange"></el-checkbox>
            </el-form-item>
            <el-form-item label="处理意见" prop="comment">
              <el-input v-model="submitForm.comment" type="textarea" :rows="5"></el-input>
            </el-form-item>
          </el-form>
        </div> -->
        <!-- 解决 -->
        <!-- <el-form
          v-if="isJiejue"
          ref="submitForm2"
          :rules="rules2"
          :model="submitForm2"
          label-suffix=":"
          label-width="100px"
        >
          <el-form-item label="需求确认" prop="needConfirm">
            <el-input v-model="submitForm2.needConfirm" type="textarea" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="解决方式" prop="solution">
            <el-input v-model="submitForm2.solution" type="textarea" :rows="5"></el-input>
          </el-form-item>
        </el-form> -->



        <!-- <div class="process_box">
          <div class="process_title">
            <span class="title_logo">
              <i class="el-icon-document-add"></i>
            </span>
            <span class="title">流程进度</span>
          </div>
          <div
            v-for="(item, index) in processList"
            :key="index"
            class="process_item"
          >
            <div class="process_item_line" v-if="currentNode >= index"></div>
            <div class="process_item_body">
              <div class="item_icon">
                <img src="../../img/processicon2.png" alt="" style="margin-right: 12px;">
                <img src="../../img/processicon1.png" alt="">

              </div>
              <div class="item_content">
                <div class="content_top">
                  <span>{{item.nodeName}}</span>
                  <span class="content_top_text" v-if="currentNode == index && !item.createTime">处理中...</span>
                  <span class="content_top_text" v-if="currentNode > index || (currentNode == index && item.createTime)">已处理</span>
                  <span></span>
                </div>
                <div class="content_time">
                  {{item.createTime?item.createTime:'--'}}
                </div>
                <div class="content_advice">
                  处理意见： {{item.commons? item.commons : ''}}
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <!-- 解决 -->
      <div class="btn_box" v-if="isJiejue">
        <el-button type="primary" size="mini" @click="submit2(0)" :loading="saveLoading">暂存</el-button>
        <el-button type="primary" size="mini" @click="submit2(1)" :loading="saveLoading">需求归档</el-button>
        <el-button type="primary" size="mini" plain @click="$emit('close')">取消</el-button>
      </div>
      <div class="btn_box" v-else>
        <!-- <el-button v-if="(detailForm.status == 1 || detailForm.status == 0) && detailForm.view == 1" type="primary" size="mini" @click="submit" :loading="saveLoading">处理</el-button> -->
        <!-- <el-button v-if="detailForm.statusValues == '处理中'" type="primary" size="mini" @click="submit" :loading="saveLoading">处理</el-button> -->
        <el-button type="primary" size="mini" @click="zhanwei" :loading="saveLoading" v-if="detailForm.status == 2">转为知识</el-button>
        <el-button type="primary" size="mini" @click="submit" :loading="saveLoading" v-if="isChuli">提交</el-button>
        <el-button type="primary" size="mini" plain @click="$emit('close')">取消</el-button>
      </div>

      <operateForm
        v-if="showOperate"
        :isShow="showOperate"
        :questionId="questionId"
        @close="showOperate = false"
        @submitProcess="submitProcess"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  questionSave,
  questionSubmit,
  questionDetail,
  allProcess,
  currentProcessNode,
  processCreate,
  auditingUserList,
  saveDemand,
  convert
} from "@/api/ictOperation/index"
import { getDictList,getDictCmdbList} from "@/api/dict";
import operateForm from './operateForm'
import {mapGetters, mapState} from "vuex";
export default {
  components: { operateForm },
  props: ['isShow', 'questionId', 'isJiejue', 'orderType'],
  data() {
    return{
      isInfo: false,
      checked: false,
      submitForm: {
        id: '',
        comment: '',
        content: '',
        isResolve: -1,
        handler: '',
        handlerTel: ''
      },
      rules: {
        content: [
          { required: true, message: "问题描述不能为空", trigger: "blur" },
        ],
        questionConfirm: [
          { required: true, message: "问题确认不能为空", trigger: "blur" },
        ],
        comment: [
          { required: true, message: "处理意见不能为空", trigger: "blur" },
        ],
        handlerTel: [
          { required: true, message: "联系方式不能为空", trigger: "blur" },
        ],
      },
      rules2: {
        needConfirm: [
          { required: true, message: "需求确认不能为空", trigger: "blur" },
        ],
        solution: [
          { required: true, message: "解决方式不能为空", trigger: "blur" },
        ],
      },
      submitForm2: {
        id: '',
        solution: '',
        needConfirm: '',
        saveFlag: 0
      },
      saveLoading: false,

      pageLoading: false,
      detailForm: {},
      imgList: [],
      // infoItemList: [
      //   {name: '问题状态', infoKey: 'statusValues'},
      //   {name: '操作系统', infoKey: 'osType'},
      //   {name: '出现频率', infoKey: 'frequencyName'},
      //   {name: '业务部门', infoKey: 'dept'},
      //   {name: '问题类型', infoKey: 'type'},
      //   {name: '品牌', infoKey: 'brandCn'},
      //   {name: '终端类型', infoKey: 'deviceType'},
      //   {name: '紧急程度', infoKey: 'urgentLevelName'},
      //   {name: '问题提报人', infoKey: 'filler'},
      //   {name: '提报人电话', infoKey: 'phone'},
      //   {name: '提报时间', infoKey: 'createTime'},
        
      //   // {name: '系列', infoKey: 'seriesCn'},
      //   // {name: '型号', infoKey: 'modelCn'},
        
      //   // {name: '省测处理意见', infoKey: 'comment'},
      //   // {name: '审批人', infoKey: 'handler'},
      // ],
      infoItemList2: [
        // {name: '省测处理意见', infoKey: 'comment'},
        // {name: '审批人', infoKey: 'handler'},
      ],
      infoItemList3: [
        {name: '需求确认', infoKey: 'needConfirm'},
        {name: '处理意见', infoKey: 'solution'},
        {name: '处理时间', infoKey: 'resolveTime'},
      ],
      processList: [], //流程
      showOperate: false,
      // saveLoading: false,
      currentNode: -1,
      osTypeList: [],
      typeList: [],
     deviceTypeList: [],
    }
  },
  computed: {
    ...mapGetters(["userDetail"]),
    isRoleAlias(){
      return this.$store.state.user.userDetail.roleAlias.includes('control_solver')
    },
    isChuli(){
      return (this.detailForm.status == 1 || this.detailForm.status == 0) && this.detailForm.view == 1 && this.orderType != 'see'
    },
    infoItemList(){
      // if( this.isInfo ){
      //   return [
      //     {name: '操作系统', infoKey: 'osType'},
      //     {name: '提报部门', infoKey: 'dept'},
      //     {name: '出现频率', infoKey: 'frequencyName'},
          
      //     {name: '问题状态', infoKey: 'statusValues'},
      //     {name: '品牌', infoKey: 'brandCn'},
      //     {name: '提报人', infoKey: 'filler'},
      //     {name: '紧急程度', infoKey: 'urgentLevelName'},
          
          
      //     {name: '问题类型', infoKey: 'type'},
      //     {name: '终端类型', infoKey: 'deviceType'},
      //     {name: '联系电话', infoKey: 'phone'},

      //     // {name: '问题提报人', infoKey: 'filler'},
      //     // {name: '提报人电话', infoKey: 'phone'},
      //     // {name: '提报时间', infoKey: 'createTime'},
      //   ]
      // }else{
      //   return [
      //     {name: '操作系统', infoKey: 'osType'},
      //     {name: '出现频率', infoKey: 'frequencyName'},
      //     {name: '提报部门', infoKey: 'dept'},
      //     {name: '问题状态', infoKey: 'statusValues'},
      //   ]
      // }
      if( this.isInfo ){
        return [
          {name: '出现频率', infoKey: 'frequencyName'},
          {name: '紧急程度', infoKey: 'urgentLevelName'},
          {name: '问题类型', infoKey: 'type'},
          {name: '问题状态', infoKey: 'statusValues'},
          {name: '提报部门', infoKey: 'dept'},
          {name: '提报人', infoKey: 'filler'},
          {name: '联系电话', infoKey: 'phone'},
          {name: '提报时间', infoKey: 'createTime'},
          {name: '操作系统', infoKey: 'osType'},
          {name: '品牌', infoKey: 'brandCn'},
          {name: '终端类型', infoKey: 'deviceType'},
        ]
      }else{
        return [
          {name: '出现频率', infoKey: 'frequencyName'},
          {name: '紧急程度', infoKey: 'urgentLevelName'},
          {name: '问题类型', infoKey: 'type'},
          {name: '问题状态', infoKey: 'statusValues'},
        ]
      }
    }
    
  },
  async mounted() {

    await this.getDict()
    // await this.getDictCmdbList('1131183120646144') // 操作系统
    this.getDetail()

    // auditingUserList().then(res=>{
    //   console.log(123, res)
    // })
  },
  methods: {
    handleChange(val){
      if(val){
        this.submitForm.isResolve = 0
      }else{
        this.submitForm.isResolve = -1
      }
    },
     showDictLable(code, dictList) {
      //字典回显
      if (dictList != null && code != '') {
        let items = dictList.filter(item => item.dictKey == code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }else{
          return code;
        }
      }
    },

    getValue(item){
     if(item.name === '操作系统'){
       let osName =  this.showDictLable(this.detailForm[item.infoKey],this.osTypeList);
       return osName;
      }else if(item.name === '问题类型'){
       let typeName =  this.showDictLable(this.detailForm[item.infoKey],this.typeList);
       return typeName;
      }else if(item.name === '终端类型'){
       let deviceTypeName =  this.showDictLable(this.detailForm[item.infoKey],this.deviceTypeList);
       return deviceTypeName;
      }else{
         return this.detailForm[item.infoKey]
      }
    },

    // 字典值
    getDict() {
      let dict = [
        "control_question_type",
        "control_question_osType",
        "control_question_device_type"
      ];
      for (let i = 0; i < dict.length; i++) {
        getDictList(dict[i]).then((res) => {
          if (dict[i] == "control_question_type") {
            //问题类型
            this.typeList = res.data;
          } else if (dict[i] == "control_question_osType") {
            //操作系统
            this.osTypeList = res.data;
          }else if (dict[i] == "control_question_device_type") {
            //操作系统
            this.deviceTypeList = res.data;
          }
        });
      }
    },


    getDictCmdbList(ciId) { //加载字典
      getDictCmdbList({ciId: ciId}).then(res => {
        if(ciId ==='1131183120646144'){ // 操作系统类型 .includes('css')
          this.osTypeList = res.data.filter(item=> item.dictValue === '银河麒麟' || item.dictValue === '统信');
        }

      });
    },

    // 获得流程节点
    async getProcess() {
      let questionStatus = this.detailForm.isResolve
      await allProcess({ questionStatus: questionStatus }).then(res => {
        this.processList = res.data
      })
    },
    // 获得已完成流程
    async getCurrentNode() {
      await currentProcessNode({id: this.questionId}).then(res => {
        for(let i=0; i<res.data.length; i++) {
          let item = res.data[i]
          this.processList[i].createTime = item.createTime
          this.processList[i].commons = item.commons
        }
        if(res.data.length > 0) {
          for(let i=0; i<this.processList.length; i++) {
            if(this.processList[i].node == res.data[res.data.length-1].taskName) {
              this.currentNode = i
            }
          }
        }
        // console.log(this.currentNode)
      })
    },
    // 详情
    getDetail() {
      this.pageLoading = true
      questionDetail({id: this.questionId}).then( async res => {
        this.detailForm = res.data
        this.submitForm2.id = res.data.id
        this.submitForm2.solution = res.data.solution
        this.submitForm2.needConfirm = res.data.needConfirm

        this.submitForm.content = this.detailForm.content
        if(res.data.status == 1){ // 处理中
          this.submitForm.handler = this.userDetail.realName
          this.submitForm.handlerTel = this.userDetail.phone
        }
        

        

        if(res.data.path != '' && res.data.path != null) {
          this.imgList = res.data.path.split(',')
        }
        if(this.detailForm.status == 2) this.currentNode = this.processList.length
        else if(this.detailForm.status == 0)this.currentNode = -1
        this.pageLoading = false

        await this.getProcess()
        await this.getCurrentNode()

        if(!((this.detailForm.status == 1 || this.detailForm.status == 0) && this.detailForm.view == 1)){
          this.infoItemList2.push({name: '问题确认', infoKey: 'questionConfirm'})
          this.infoItemList2.push({name: '省测处理意见', infoKey: 'comment'})
          this.infoItemList2.push({name: '审批人', infoKey: 'handler'})
          this.infoItemList2.push({name: '处理时间', infoKey: 'approvalTime'})
        }

        // if((this.detailForm.status == 1 || this.detailForm.status == 0) && this.detailForm.view == 1){
          
        // }else{
        //   this.infoItemList2.push({name: '问题确认', infoKey: 'questionConfirm'})
        //   this.infoItemList2.push({name: '省测处理意见', infoKey: 'comment'})
        //   this.infoItemList2.push({name: '审批人', infoKey: 'handler'})
        //   this.infoItemList2.push({name: '处理时间', infoKey: 'approvalTime'})
        // }
        
      })

      // 表单
      this.initForm()
    },
    initForm() {
      this.submitForm.userName = this.userDetail.userName
      this.submitForm.id = this.questionId
      this.$forceUpdate()
    },
    
    zhanwei() {
      this.$confirm("是否确认转为知识!","提示",{
        confirmButtonText:"确认",
        cancelButtonText:"取消",
        type:"warning"
      }).then(()=>{
        this.saveLoading = true
        convert(this.detailForm).then(res => {
          this.saveLoading = false
          this.$emit('submitProcess')
        })
      })
    },

    async submit() {
      this.$refs.xqForm.validate(async (valid) => {
        if (valid) {

          this.$confirm("是否确认提交!","提示",{
            confirmButtonText:"确认",
            cancelButtonText:"取消",
            type:"warning"
          }).then( async ()=>{
            if(this.detailForm.status == 0) {
              let createRes = await processCreate({id: this.detailForm.id})
            }

            this.saveLoading = true
            this.submitForm.handler = this.userDetail.realName
            questionSubmit(this.submitForm).then(res => {
              this.saveLoading = false
              this.$emit('submitProcess')
            })
          })
          
        }
      })
    },

    submit2(val) {
      this.$refs.submitForm2.validate(async (valid) => {
        if (valid) {
          this.submitForm2.saveFlag = val
          this.saveLoading = true
          saveDemand(this.submitForm2).then(res => {
            this.saveLoading = false
            this.$emit('submitProcess')
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>

.mm1{
  ::v-deep .el-form-item{
    margin-top: -7px;
    margin-bottom: 0;
    // line-height: 36px;
  }
} 


::v-deep .el-dialog__title{
  position: relative;
  padding-left: 12px;
}
::v-deep .el-dialog__title::before{
  content: '';
    position: absolute;
    left: 0px;
    top: 1px;
    width: 0px;
    height: 100%;
    border-left: 4px solid;
    z-index: 9;
    margin-right: 4px;
    color: #1061ff;
    // color: #409EFF;
}
.item_status{
  font-size: 15px;
  color: #fff;
  
  display: inline-block;
  padding: 1px 5px;
  border-radius: 2px;
  margin-right: 10px;
  white-space: nowrap;
}
.item_status.item_status0{
  background: #ffb800;
}
.item_status.item_status1{
  background: #00c868;
}
.item_status.item_status2{
  background: #c4c4c4;
}
.item_status.item_status3{
  background: #c4c4c4;
}


::v-deep{
  .el-dialog__header{
    padding: 20px 30px 10px
  }
  .el-dialog__body{
    padding: 15px 30px 15px;
  }
}
.question_detail{
  height: 75vh;
  overflow: auto;
  .question_title{
    font-size: 20px;
    font-family: '黑体';
    font-weight: bold;
    line-height: 22px;
    color: #000;
    margin-bottom: 20px
  }
  .question_time{
    font-size: 14px;
    line-height: 22px;
    color: #1061ff;
    margin-bottom: 20px
  }
  .question_describe{
    border-radius: 2px;
    background-color: #ecf5ff;
    padding: 15px;
    font-size: 14px;
    margin-bottom: 20px;
    .describe_title{
      color:#1061ff;
      line-height:22px;
      margin-bottom: 5px;
    }
    .describe_content{
      margin-bottom: 30px
    }
    .describe_img{
      .img_item{
        border: 1px solid #9d9d9d;
        display: inline-block;
        margin-right: 15px;
        border-radius: 2px;
        padding: 5px
      }
    }

    .describe_line2{
      display: flex;
      height: 40px;
      .describe_title{
        line-height: 40px;
      }
      .describe_content{
        margin-bottom: 10px;
      }
    }
  }
  .shengTit{
    font-size: 16px;
    margin-bottom: 20px;
  }
  .question_icon{
    font-size: 28px;
    text-align: center;
    margin: 0 0 10px 0;
    cursor: pointer;
  }
  .question_wrap{
    // display: flex;
  }
  .question_wrap_l{
    width: 90px;
    text-align: center;
    font-size: 15px;
    margin-top: 1px;
    margin-bottom: 15px;
  }
  .question_info{
    display: flex;
    flex-wrap: wrap;
    // margin-bottom: 15px;
    .question_info_name{
      display: inline-block;
      width: 95px;
      text-align: right;
      // margin-right: 5px;
    }
    .question_info_name2{
      text-align: right;
    }
    .info_item{
      // width: 33.33%;
      width: 25%;
      display: flex;
      // align-items: center;
      color: #333;
      font-size: 15px;
      line-height: 22px;
      margin-bottom: 25px;
      padding-right: 10px;
      box-sizing: border-box;
      img{
        margin-right: 10px;
        width: 18px;
        height: 18px;
        margin-top: 3px;
      }
    }
    .info_item2{
      width: 100%;
      display: flex;
      .ww1{
        width: 100px;
      }
      .ww2{
        flex: 1;
      }
    }
  }
  .question_info2{
    border-top: 2px solid #e9e9e9;
    margin-bottom: 15px;
    padding-top: 23px;
  }
  .process_box{
    position: relative;
    .process_title{
      span{display: inline-block}
      .title_logo{
        height: 55px; width: 55px;
        border-radius: 50%;
        border: 1px solid #1061ff;
        color: #1061ff;
        text-align: center;
        line-height: 49px;
        font-size: 25px
      }
      .title{
        color: #000;
        font-family: '黑体';
        font-size: 22px;
        font-weight: bold;
        margin-left: 20px;
      }
    }

    .process_item{
      padding-left: 70px;
      .process_item_line{
        position: absolute;
        width: 100px;
        border-bottom: 1px #1061ff dashed;
        border-left: 1px #1061ff dashed;
        left: 25px;
      }
      .process_item_body{
        background-color: #fafafa;
        border: 1px solid #efefef;
        border-radius: 4px;
        margin-bottom: 30px;
        padding: 15px;
        display: flex;
        position: relative;
        padding-left: 50px;
        .item_icon{
          position: absolute;
          left: -6px;
          top: 28px;
          display: flex;
          align-items: center;

        }
        .item_content{
          .content_top{
            color: #000;
            font-size: 16px;
            font-weight: bold;
            font-family: '黑体';
            .content_top_text{
              font-size: 16px;
              display: inline-block;
              margin-left: 20px;
              color: #1061ff;
            }
          }
          .content_time{
            color: rgba(0,0,0, 0.5);
            font-size: 14px;
            line-height: 22px;
            margin-bottom: 15px;
          }
          .content_advice{
            color: rgba(0,0,0, 0.5);
            font-size: 14px;
            line-height: 22px;

          }
        }
      }
    }
    .process_item:nth-child(2) {
      .process_item_line{
        height: 38px;
      }
    }
    .process_item:nth-child(3) {
      .process_item_line{
        height: 135px;
        top: 96px;
      }
    }
    .process_item:nth-child(4) {
      .process_item_line{
        height: 135px;
        top: 235px;
      }
    }
  }
}
.btn_box{
  text-align: center
}
::-webkit-scrollbar{
  width: 5px;
  height: 5px;
}
::v-deep ::-webkit-scrollbar-button{
  display: none
}
::-webkit-scrollbar-thumb{
  background: #bed4ff;
  border-radius: 3px
}
::-webkit-scrollbar-track{
  margin: 5px
}
</style>
