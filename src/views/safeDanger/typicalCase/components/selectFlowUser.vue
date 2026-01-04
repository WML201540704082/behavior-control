<template>
  <div v-loading="showLoading" element-loading-text="拼命加载中。。。" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0,0,0,0.8)">
    <div id="app" class="flowDiv" style="width: 100%;height: 100%;" >
      <div style="width: 23%">
        <el-container>
          <div>
            <span style="color: #1e9fff;font-size: larger;">待选择</span>
            <el-aside>
              <div style="height: 450px">
                <el-input
                  placeholder="输入关键字进行过滤"
                  size="mini"
                  v-model="filterText">
                </el-input>
                <el-tree ref="tree" :data="treeData" :props="defaultProps" style="width: 100%;" :filter-node-method="filterNode"
                         default-expand-all show-checkbox @node-click="treeClick">
                  <span class="custom-tree-node" slot-scope="{node, data}">
                    <span :title="node.label"> {{ node.label }} </span>
                  </span>


                </el-tree>
              </div>
            </el-aside>
          </div>
        </el-container>
      </div>
      <div style="width: 7%;margin-left: 10px">
        <el-container>
          <div id="buttonDiv">
            <el-header>
              <el-button type="primary" size="mini" @click="addTableData" >></el-button>
            </el-header>
            <el-footer>
              <el-button type="primary" size="mini" @click="delTableData" ><</el-button>
            </el-footer>
          </div>
        </el-container>
      </div>
      <div style="width: 70%">
        <div>
          <div style="color: #1E9FFF;font-size: larger;">已选择</div>
          <!-- 此处tale与tree中key对应 可通过defaultProps了解 -->
          <div style="margin-right: auto">
            <el-table border size="mini"
                      stripe  ref="perTable" :data="tableData" highlight-current-row height="360"
                      @row-click="clickRow" style="width: 100%;height:420px;">
              <el-table-column type="selection" align="center" width="55"></el-table-column>
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop=displayMode label="流程环节" width="180"></el-table-column>
              <el-table-column prop="imageUrl" label="角色"></el-table-column>
              <el-table-column prop="text" label="用户"></el-table-column>
              <el-table-column v-if="false" prop="id" label="用户id" width="100"></el-table-column>
            </el-table>
          </div>
        </div>
        <div id="buttDiv" style="float: right;margin-top: 10px">
          <el-button @click="submitBut" type="primary" size="mini">确定</el-button>
          <el-button @click="cancelBut" type="primary" size="mini">取消</el-button>
          <el-button @click="cleanBut" type="primary" size="mini">清空已选</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextWorkItem, queryNextFlowUsers } from "@/api/safeDanger/workorder/bpm/bpm";
export default {
  name: "selectFlowUser",
  props: {
    processInstID: {
      type: String,
      required: true
    },

    applyUser: {
      type: String,
      required:false
    },
    applyCompany: {
      type: String,
      required: false
    },
    applyDept: {
      type: String,
      required: false
    },
    //流程发送方式,1-前端,2-后端
    processType: {
      type: String,
      required: false
    },

    specialityName: {
      type: String,
      required: false
    },


  },
  data() {
    return {
      submitLoading: false,
      showLoading:true,
      treeData:[{}],
      filterText: '',
      defaultProps:{
        id:'id',
        itemType:'itemType',
        displayMode:'displayMode',//流程环节
        imageUrl:'imageUrl',//角色
        label:'text',
        children:'childNodes'

      },
      tableData:[],
      successful:"0", //0：初始值 1：成功 2：失败，
      treeClickCount: 0
    }
  },
  created: function() {
    this.initTreeVue();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods:{
    filterNode(value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },
    treeClick(data) {
      this.treeClickCount++
      if(this.treeClickCount > 2) return
      setTimeout(() => {
        if(this.treeClickCount === 1) {
          // 单击事件
        }else if(this.treeClickCount === 2) {
          // 双击事件
          if(data.itemType === '03' || data.text === '结束') {
            if(this.tableData.length === 0) {
              this.tableData.push(data);
            }else {
              let flag = false;
              for(let i=0;i<this.tableData.length;i++) {
                if(this.tableData[i].text === data.text) {
                  flag = true;
                }
              }
              if(!flag) {
                this.tableData.push(data);
              }
            }
          }
        }
        this.treeClickCount = 0
      }, 500)
      if ("03" == data.itemType) {//

      }
    },
    //初始化树
    initTreeVue:function() {
      let _this = this;
      let data = {
        processInstId: this.processInstID,
        rectificationStatus: 0
      }
      queryNextFlowUsers(data).then(response =>{
        _this.treeData = response.data;
        _this.showLoading = false;
      })
    },
    //行点击事件
    clickRow:function(row) {
      let _this = this;
      _this.$refs.perTable.toggleRowSelection(row);
    },
    //向右按钮点击
    addTableData:function() {
      let _this = this;
      let dataTree = _this.$refs.tree.getCheckedNodes(true,false);//只查询子节点，不包含半选节点
      if (dataTree.length <= 0) {
        _this.$message.warning('请选择待选择区人员！');
        return;
      }
      _this.tableData = dataTree;
    },
    //向左按钮点击
    delTableData:function() {
      let _this = this;
      //获取列表选择数据
      let perTable = _this.$refs.perTable.selection;
      if (perTable.length <= 0) {
        _this.$message.warning('请勾选已选择区人员！');
        return;
      }
      //删除操作
      for (let i = 0 ; i < perTable.length ; i++) {
        for (let j = 0 ; j < _this.tableData.length ; j++) {
          if (_this.tableData[j] == perTable[i]) {//相等删除并跳出循环
            _this.tableData.splice(j,1);
            break;
          }
        }
      }
    },
    //提交操作
    submitBut() {
      let _this = this;
      if (_this.tableData.length <= 0) {
        _this.$message.warning('请选择人员！');
        return;
      }
      let userList = new Array();
      for (let i = 0; i < _this.tableData.length; i++) {
        let user = {
          id: _this.tableData[i].id,
          name: _this.tableData[i].text,
          typeCode: '03'
        };
        userList.push(user);
      }
      let data = {
        processInstId: this.processInstID,
        list: userList,
        applyUser: this.applyUser,
        applyCompany: this.applyCompany,
        applyDept: this.applyDept,
        specialityName: this.specialityName
      }
      if (this.processType === '2') {//如果时后端发送流程
        this.$emit('sendWorkflow', data);
      } else {
        _this.submitLoading = true
        nextWorkItem(data).then(response =>{
          if (response.code === 200) {
            this.$emit('bpmUpdateDetail', response.data.currentItmeName);
            this.cancelBut();
            _this.submitLoading = false;
          } else{
            this.msgError(response.msg);
            this.cancelBut();
            _this.submitLoading = false;
          }
        }).catch(err =>{
          _this.submitLoading = false
        })
      }
    },
    //清空列表数据handleClose
    cleanBut:function() {
      let _this = this;
      _this.tableData = null;
    },
    cancelBut () {
      this.$emit('handleClose');
    }
  }
}
</script>

<style scoped>
  .flowDiv{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: start;
  }
  #buttonDiv{
    width: 100%;
    height: 450px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .custom-tree-node{
    font-size: 14px;
    display: flex;
  }
  .custom-tree-node span{
    display: inline-block;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
