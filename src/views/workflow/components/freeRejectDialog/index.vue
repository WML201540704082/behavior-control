<!--  任务管理=》自由驳回  -->
<template>
  <el-dialog
      custom-class="workFlow-dialog"
      class="freeReject-dialog lcdp-dialog"
      :visible.sync="freeRejectShow"
      title="自由驳回"
      width="694px"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="handleClose">
    <!-- 意见输入框 -->
    <div class="freeReject-dialog-body">
      <div class="text-box">
        <el-input
            class="commentTextarea"
            type="textarea"
            :rows="6"
            resize="none"
            maxlength="500"
            placeholder="请输入意见"
            v-model="comment">
        </el-input>
        <div class="bottom-info">
          <div class="total-text"><span>{{totalText}}</span>/500个字</div>
          <div class="quick-comments">
            <!-- 快捷意见弹出层 -->
            <el-popover
                width="256"
                popper-class="popCls2"
                height="184"
                v-model="visible">
              <div class="quick-top" v-for="(item,index) in commentArr" :key="index" @click="electedComments(index)">
                <p>{{item.commentInfo}}</p>
              </div>
              <div @click="visible = false; dialogVisible = true;" class="quick-center">
                <p>自定义设置</p>
              </div>
<!--              <el-button type="text" slot="reference"><div class="quick-bottom">-->
<!--                <div class="quick-bottom1"></div>快捷意见</div></el-button>-->
            </el-popover>
          </div>
        </div>
      </div>
      <!-- 驳回节点 -->
      <div class="text selectType">
        <span>驳回节点：</span>
        <div>
          <el-radio v-model="rejectType" label="initial">驳回至第一节点</el-radio>
          <el-radio v-model="rejectType" label="prev">驳回至上一节点</el-radio>
          <el-radio v-model="rejectType" label="any">驳回至任意节点</el-radio>
          <div class="anyRejectDiv" v-if="rejectNodeShow">
            <el-checkbox-group v-model="rejectNodeCheckList">
              <el-checkbox v-for="(item,index) in rejectNodes" :key="index" :label="index">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button   @click="handleClose">取消</el-button>
      <el-button   type="primary" @click="handleSave">确定</el-button>
    </div>
    <!-- 自定义设置意见弹窗 -->
    <el-dialog

        custom-class="workFlow-dialog zidingyi"
        class="freeReject-dialog lcdp-dialog jxd_additional lcdp_axe"
        title="自定义设置"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="420px"
    >
      <!-- 新建意见 -->
      <div class="zdy-top">
        <div v-show="pressDisabled" style="cursor:not-allowed;">+新建</div>
        <div v-show="!pressDisabled" @click="press" style="cursor:pointer;">+新建</div>
        <p>{{commentArr.length}}/5</p>
      </div>
      <!-- 自定义意见列表 -->
      <div class="boder">
        <div  v-for="(item,index) in commentArr" :key="item.id" class="zdy-bottom" @dblclick="modify(index)">
          <div v-show="textarea !=index" class='zdy-bottom-top' style="cursor:pointer; padding:0 14px;">
            <p style="line-height: 30px; width: 348px; text-overflow: ellipsis; overflow: hidden; white-space:nowrap; padding-right: 14px;">{{item.commentInfo}}</p>
            <p class="delete" @click="clear(index)">
            </p>
          </div>
          <!-- 修改意见 -->
          <div v-show="textarea === index">
            <el-input
                class="jxd_ins_elTextArea lay-textarea default input_width"
                ref="editText"
                type="textarea"
                resize="none"
                @blur="done(index)"
                maxlength="100"
                :autosize="{ minRows: 1, maxRows: 2 }"
                v-model="textareaMess">
            </el-input>
          </div>
        </div>
        <!-- 新增意见 -->
        <el-input
            class="jxd_ins_elTextArea lay-textarea default input_width"
            ref="input"
            @blur="done"
            v-show="inputShow"
            type="textarea"
            resize="none"
            maxlength="100"
            :autosize="{ minRows: 1, maxRows: 2 }"
            v-model="inputMess">
        </el-input>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>

import hussarRequest from '@/views/workflow/util/request'
import { TaskApi } from "@/api/workflow/taskManagement/taskApi";

export default {
  name: 'FreeReject',
  props: {
    freeRejectShow: Boolean,
    taskId: String,
    userId: String | Number,
  },
  data() {
    return {
      // 自定义意见列表
      commentArr: [],
      // 前端自定义意见列表数据量
      addNumber: 0,
      dataLength: 0,
      // 意见内容
      comment: '',
      rejectType: 'initial',
      // 控制驳回任意节点显隐
      rejectNodeShow: false,
      // 任意节点列表
      rejectNodes: [],
      // 选中的驳回节点
      rejectNodeCheckList: [],
      noDataText: '',
      // 总字数
      totalText:0,
      // 控制快捷意见popover显隐
      visible: false,
      // 控制自定义意见弹窗显隐
      dialogVisible:false,
      // 新增意见
      inputMess:'',
      // 新增意见显隐
      inputShow:false,
      // textarea初始隐藏
      textarea:999,
      // 修改意见内容
      textareaMess:'',
      pressDisabled: false,
    };
  },
  watch: {
    // 父组件传参
    freeRejectShow: {
      handler(n) {
        // 每次打开自由驳回弹窗时，初始化数据
        if (n) {
          this.init();
        }
      },
      deep: true,
    },
    // 监控驳回那一节点
    rejectType: {
      handler(n) {
        if (n === 'any') {
          // console.log('zoul0')
          this.rejectNodesCopy = [];
          this.rejectNodeShow = true;
        } else {
          this.rejectNodeShow = false;
        }
      },
      deep: true,
    },
    // 监控自由驳回显隐
    rejectNodeShow: {
      handler(n) {
        if (n) {
          this.getRejectNode();
        }
      },
      deep: true,
    },
    // 监控意见
    comment(){
      this.totalText = this.comment.length
    },
    // 监控修改意见
    textareaMess(){
      if(this.textareaMess.length===100){
        this.$message({
          type:'warning',
          message:'自定义意见长度限制100'
        });
      }
    },
    // 监测新增意见
    inputMess(){
      if(this.inputMess.length ===100){
        this.$message({
          type:'warning',
          message:'自定义意见长度限制100'
        });
      }
    }
  },
  methods: {
    // 获取驳回任意节点列表数据
    getRejectNode() {
      const self = this;
      let taskId = this.taskId;
      function queryRejectNode(data) {
        return hussarRequest.get(TaskApi.queryRejectNode, data);
      }
      let data = {
        taskId,
      };
      // console.log(taskId)
      if (taskId) {
        queryRejectNode(data).then(res => {
          // console.log(res)
          if (res.code === "1") {
            let result = res.result;
            self.rejectNodes = [];
            result.forEach((val) => {

              self.rejectNodes.push({
                value: val.id,
                name: val.name,
              });
              // console.log(self.rejectNodes)
            });
          } else {
            self.$message({
              type:'error',
              message:res.msg
            });
          }
        }).catch(function() {
          self.$message({
            type:'error',
            message:error.msg || '驳回节点数据请求异常'
          });
        });
      }
    },
    // 确认驳回
    handleSave() {
      const self = this;
      let flowEventDataCopy = {...this.flowEventData};
      const url = flowEventDataCopy.url;
      const pageCloseBoolean = flowEventDataCopy.pageCloseBoolean;
      const changePagePath = flowEventDataCopy.changePagePath;
      flowEventDataCopy.comment = this.comment;
      flowEventDataCopy.type = this.rejectType;
      if (this.rejectNodeCheckList.length > 0) {
        flowEventDataCopy.rejectNode = '';
        this.rejectNodeCheckList.forEach((item) => {
          flowEventDataCopy.rejectNode = flowEventDataCopy.rejectNode + ',' + this.rejectNodes[item].value;
        });
        flowEventDataCopy.rejectNode = flowEventDataCopy.rejectNode.slice(1);
      }
      if (this.rejectType === 'any' && this.rejectNodeCheckList.length == 0) {
        this.$message( {message:'请选择驳回节点', type:'warning'});
        self.$emit('freeRejectExecuteFunction');
      } else {
        const loading = self.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        let data = {
          taskId:this.taskId,
          comment:this.comment,
          userId:this.userId,
          isSubmit:false,
          backActivityId:'',
        }
        let totalUrl;
        if(this.rejectType === 'initial'){
          totalUrl = TaskApi.rejectToFirstTask;
        } else if(this.rejectType === 'any'){
          totalUrl = TaskApi.rejectToAnyTask;
          data.backActivityId = flowEventDataCopy.rejectNode;
        } else {
          totalUrl = TaskApi.rejectToLastTask;
        }
        hussarRequest.post(totalUrl, data).then(res => {
          if (res.code === '1') {
            this.$emit("confirm");
            this.$message( {message:'驳回成功', type:'success'});
          } else {
            this.$message( {message: res.msg, type:'error'});
          }
          loading.close();
          this.handleClose();
        }).catch((error) => {
          loading.close();
          this.handleClose();
        });
      }
    },
    // 关闭自由驳回弹窗
    handleClose() {
      this.rejectNodeCheckList = [],
          this.$emit('close');
    },
    // 点击快捷意见赋值意见
    electedComments(index){
      this.comment=this.commentArr[index].commentInfo;
      this.visible = false;
    },
    // 新增意见
    press(){
      this.pressDisabled = true;
      if(this.addNumber >= 5 || this.commentArr.length >=5){
        this.$message({
          type:'error',
          message:'自定义意见已满，请删除一条数据'
        });
        return;
      }else {
        this.addNumber +=1
      }
      this.inputShow=true;
      this.$nextTick(()=> {
        // console.log(this.$refs)
        this.$refs.input.focus();
      });
    },
    // 修改意见
    modify(index){
      this.textarea = index;
      this.textareaMess = this.commentArr[index].commentInfo;
      this.$nextTick(()=> {
        // console.log(this.$refs)
        this.$refs.editText[index].focus();
      });
    },
    // 失去焦点验证并提交
    done(index){
      let data
      if((this.inputMess ==='' || this.inputMess.replace(/(^\s*)|(\s*$)/g, "") === '')
          && (this.textareaMess ==='' || this.textareaMess.replace(/(^\s*)|(\s*$)/g, "") === '')){
        this.inputShow=false;
        this.pressDisabled = false;
        this.addNumber -= 1;
        this.inputMess ='';
        this.textarea = 999;
        return;
      }
      if(this.textareaMess !==''){
        data={
          id:this.commentArr[index].id,
          commentInfo:this.textareaMess,
          commentType:1
        }
        if(this.textareaMess.length !== this.commentArr[index].commentInfo.length){
          this.getComments(data,index)
        }else{
          this.textareaMess ='';
          this.inputMess='';
          this.textarea =999;
        }
      }else{
        data={
          commentInfo:this.inputMess,
          commentType:1
        }
        this.getComments(data,index)
      }
      this.inputShow=false;
    },
    // 获取快捷意见数据
    getComments(data,index){
      hussarRequest.post(TaskApi.saveOrUpdate,data).then(res=>{
        if(res.code===10000){
          if(Object.keys(data).length === 2){
            this.getcommentArr();
            this.$message({
              type:'success',
              message:'新增成功'
            });
          }else{
            this.commentArr[index].commentInfo=this.textareaMess
            this.$message({
              type:'success',
              message:'修改成功'
            });
          }
          this.textareaMess =''
          this.inputMess='';
          this.textarea =999;
          this.pressDisabled = false
        }
      })
    },
    getcommentArr(){
      const self = this;
      const data = {
        commentType: '1',
        size:5,
        current:1
      };
      hussarRequest.get(TaskApi.queryByPage, data).then(res => {
        if (res.code === 10000) {
          self.dataLength = res.data.records.length;
          self.commentArr = [];
          if (self.dataLength !== 0) {
            self.commentArr =res.data.records
          }
          if (self.commentArr.length === 0) {
            self.noDataText = '暂无常用意见';
          }
        } else {
          this.$message({
            type:'error',
            message:'请求字典数据失败'
          });
          self.noDataText = '暂无常用意见';
        }
      }).catch(() => {
        this.$message({
          type:'error',
          message:'请求字典数据异常'
        });
        self.noDataText = '暂无常用意见';
      });
    },
    // 删除自定义意见
    clear(index){
      hussarRequest.post(TaskApi.delete,this.commentArr[index].id).then(res =>{
        if(res.code === 10000){
          this.$message({
            type:'success',
            message:'删除成功'
          });
          this.commentArr.splice(index,1);
          this.addNumber -= 1
          this.pressDisabled = false
        }
      })
    },
    // 初始化方法
    init() {
      this.commentArr = [];
      this.dataLength = 0;
      this.commentShowText = '展开';
      this.commentShow = false;
      this.comment = '';
      this.rejectType = 'initial';
      this.rejectNodeShow = false;
      this.rejectNodes = [];
      this.rejectNodesCopy = [];
      this.noDataText = '';
      const self = this;
      const data = {
        commentType: '1',
        size:5,
        current:1
      };
      // hussarRequest.get(TaskApi.queryByPage, data).then(res => {
      //   // console.log(res.data.records)
      //   if (res.code === 10000) {
      //     self.dataLength = res.data.records.length;
      //     self.commentArr = [];
      //     if (self.dataLength !== 0) {
      //       self.commentArr =res.data.records
      //       self.addNumber =res.data.records.length
      //     }
      //     if (self.commentArr.length === 0) {
      //       self.noDataText = '暂无常用意见';
      //     }
      //   } else {
      //     this.$message({
      //       type:'error',
      //       message:'请求字典数据失败'
      //     });
      //     self.noDataText = '暂无常用意见';
      //   }
      // }).catch(() => {
      //   this.$message({
      //     type:'error',
      //     message:'请求字典数据异常'
      //   });
      //   self.noDataText = '暂无常用意见';
      // });
    },
  },
  mounted() {
    this.init();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .popCls2 {
  padding: 4px 0 0;
}
::v-deep .quick-top p{
  padding: 0 12px;
  height: 32px;
  width: 100%;
  text-overflow: ellipsis; overflow: hidden; white-space:nowrap;
  line-height: 30px;
  &:hover {
    background: #E9F4FE;
    cursor: pointer;
  }
}
::v-deep .quick-center {
  text-align: left;
  height: 40px;
  display: flex;
  align-items: center;
  border-top: 1px solid #E0E0E0;
  p {
    cursor: pointer;
    height: 32px;
    padding: 0 12px;
    width: 100%;
    text-overflow: ellipsis; overflow: hidden; white-space:nowrap;
    line-height: 30px;
    &:hover {
      background: #E9F4FE;
      cursor: pointer;
    }
  }

}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../style/workFlow.scss';
::v-deep .workFlow-dialog {
  height: 521px;
  .el-dialog__body {
    padding: 15px 16px 0;
    overflow-x: hidden;
  }
  .el-dialog__body{
    position: relative;
    .commentTextarea .el-textarea__inner{
      height: 240px;
      padding: 10px 15px 40px 15px;
    }
    .el-radio__label{
      line-height: 25px !important;
    }
    .anyRejectDiv{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      min-height: 40px;
      border: 1px solid #E7E7E7;
      margin-top: 6px;
      padding: 0 0 0 20px;
      box-sizing: border-box;
      .el-checkbox-group {
        display: flex;
        line-height: 40px;
        flex-wrap: wrap;
        align-items: center;
        >label {
          margin-right: 25px !important;
          display: flex;
          align-items: center;
          min-height: 40px;
        }
        .el-checkbox {
          line-height: 40px;
        }
        .el-checkbox__label {
          display: inline-block;
          word-break: break-word;
          width: auto;
          white-space: pre-wrap;
        }
      }
    }
  }
  .selectType{
    margin-top: 18px;
    width: 100%;
    overflow: hidden;
    display: flex;
    >span {
      width: 70px;
    }
    >div {
      width: calc(100% - 95px);
      display: flex;
      flex-direction: column;
      margin-left: 25px;
      margin-bottom: 0;
      >.el-radio:not(:nth-child(3)) {
        margin-bottom: 12px;
      }
    }
  }
  .text-box {
    position: relative;
    .bottom-info {
      position: absolute;
      background: #fff;
      width: calc(100% - 2px);
      height: 40px;
      padding: 0 14px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      left: 1px;
      bottom: 1px;
      border-radius: 4px;
    }
  }
  .total-text{
    color:#999999;
  }
  .quick-comments{
    .quick-bottom{
      display: flex;
      color: #4A4C66;
      .quick-bottom1{
        width: 12px;
        height: 13px;
        margin-right: 6px;
        background-image: url('../../../assets/workflow/quick-comments.svg');
        background-size: 12px 13px;
      }
    }
    .quick-bottom:hover{
      color:#0D8EFF;
    }
    .quick-bottom:hover .quick-bottom1{
      background-image: url('../../../assets/workflow/quick-comments1.svg');
    }
  }
}
::v-deep .zidingyi{
  height: 266px;
  .el-dialog__title{
    font-size: 14px;
  }
  .zdy-top{
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .delete{
    display: none;
  }
  .zdy-bottom{

    .zdy-bottom-top{
      display: flex;
      justify-content: space-between;
    }
  }
  .zdy-bottom:hover{
    background: #E9F4FE;
    .delete{
      display: block;
      width: 16px;
      height: 16px;
      background-image: url('../../../assets/workflow/delete.svg');
      margin-top:5px
    }
  }
  .el-dialog__body{
    height: 220px;
    padding: 24px 20px 0;
  }
  .boder{
    padding-top: 3px;
    width: 388px;
    height: 156px;
    border: 1px solid #E7E7E7;
  }
}
</style>
<style scoped>
/* -------主题修改样式--------- */
/* 按钮 */
.dialog-cancel {
  background-color: #ffffff;
  color: #0D8EFF;
  border: 1px solid var(--theme-color);
}
.dialog-cancel :hover{
  color: #FFF !important;
  background: var(--theme-color);
}
.jxd_ins_elButton.default:hover:not(.is-disabled){
  color:  #FFF !important;
  background: var(--theme-color);
}
.dialog-save, .dialog-cancel {
  border-radius: 2px !important;
  padding: 0px 0px !important;
}
</style>
