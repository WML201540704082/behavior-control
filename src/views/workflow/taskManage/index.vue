<template>
  <div class="app-container" style="padding: 10px 10px 10px 20px;overflow: hidden">
    <div class="list-box">
      <!--      <div class="filter-box">-->
      <!--        <div class="title-text">-->
      <!--          {{ $hussarT('hussar-task.taskManage') }}-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="table-box">
        <div class="table-filter flex processClass" >
          <el-row>
            <el-col :span="4">
              <el-input
                size="mini"
                style="width:200px;margin-right: 8px"
                v-model="listQuery.processName"
                placeholder="流程名称"
                class="search-input"
                type="text"
                clearable
              />
            </el-col>
            <el-col :span="4">
              <el-select
                size="mini"
                v-model="listQuery.suspensionState"
                :placeholder="$hussarT('hussar-task.runningState')"
                clearable
                popper-class="maxTable short_select"
                @change="selectSuspension($event)">
                <el-option
                  v-for="selects in suspensions"
                  :key="selects.id"
                  :value="selects.id"
                  :label="selects.value" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select
                size="mini"
                v-model="listQuery.timeoutState"
                :placeholder="$hussarT('hussar-task.timeoutState')"
                clearable
                popper-class="maxTable short_select"
                style="margin: 0 10px"
                @change="selectIsTimeOut($event)">
                <el-option
                  v-for="selects in isTimeOuts"
                  :key="selects.id"
                  :value="selects.id"
                  :label="selects.value" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-date-picker
                size="mini"
                :rows="5"
                v-model="listQuery.startTime"
                :placeholder="$hussarT('hussar-process.startData')"
                :class="listQuery.startTime?'dateIcon':''"
                :picker-options="startPickerOptions"
                clearable
                type="datetime"
                prefix-icon="font_family icon-hussar_calendar"
                class="lcdp-date"
                value-format="yyyy-MM-dd HH:mm:ss"
                popper-class="lcdp-date-pop"
              />
            </el-col>
            <el-col :span="4">
              <el-date-picker
                size="mini"
                :rows="5"
                v-model="listQuery.endTime"
                :placeholder="$hussarT('hussar-process.endData')"
                :class="listQuery.endTime?'dateIcon':''"
                :picker-options="endPickerOptions"
                clearable
                style="margin-left: 8px;"
                type="datetime"
                prefix-icon="font_family icon-hussar_calendar"
                class="lcdp-date"
                value-format="yyyy-MM-dd HH:mm:ss"
                popper-class="lcdp-date-pop"
              />
            </el-col>
            <el-button
              size="mini"
              style="margin-left: 8px;"
              class="btn-search left"
              type="primary"
              @click="queryDefinition(true)">{{ $hussarT('hussar-common.search') }}</el-button>
            <el-button
              size="mini"
              class="btn-reset"
              type="button"
              @click="clearData()">{{ $hussarT('hussar-common.reset') }}</el-button>
          </el-row>
        </div>
        <div class="table-wrap" style="margin-top: 10px;">
          <el-table
            v-loading="listLoading"
            ref="tableRow"
            :data="list"
            :row-key="(row)=>{ return row.id}"
            :element-loading-text="$hussarT('hussar-common.loading')"
            height="calc(100vh - 200px)"
            fit
            stripe
         >
            <el-table-column
              :label="$hussarT('hussar-common.no')"
              :index="indexMethod"
              type="index"
              width="80"
              align="center"/>
            <el-table-column :label="$hussarT('hussar-task.processName')">
              <template slot-scope="scope">
                <span :title="scope.row.processName">{{ scope.row.processName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$hussarT('hussar-task.nodeName')">
              <template slot-scope="scope">
                <span :title="scope.row.nodeName">{{ scope.row.nodeName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$hussarT('hussar-task.receiver')">
              <template slot-scope="scope">
                <span :title="setNames(scope.row.receiverName)">{{ setNames(scope.row.receiverName) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-task.startTime')"
              width="150"
              align="center">
              <template slot-scope="scope">
                <span :title="scope.row.startTime.substr(0,19)">{{ scope.row.startTime.substr(0,19) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-task.duringTime')"
              width="180"
              align="center">
              <template slot-scope="scope">
                <div style="width: fit-content;margin-left: auto">
                  <span :title="getTimes(scope.row.startTime,null)">{{
                    getTimes(scope.row.startTime,null)
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-task.runningState')"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.suspensionState == 1">{{ $hussarT('hussar-task.running') }}</span>
                <span v-if="scope.row.suspensionState == 2">{{ $hussarT('hussar-task.hanged') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-task.whetherTimeout')"
              align="center"
              width="80">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.timeoutState == 1"
                  class="flex flex-center">
                  <div
                    class="state-dot"
                    style="background-color: #FF4D4F;"/>
                  <div>{{ $hussarT('hussar-task.timeout') }}</div>
                </div>
                <div
                  v-if="scope.row.timeoutState != 1"
                  class="flex flex-center">
                  <div
                    class="state-dot"
                    style="background-color: #49AA19;"/>
                  <div>{{ $hussarT('hussar-task.noTimeout') }}</div>
                </div>
                <!--                <span v-if="scope.row.timeoutState == 1">{{ $hussarT('hussar-task.timeout') }}</span>-->
                <!--                <span v-if="scope.row.timeoutState != 1">{{ $hussarT('hussar-task.noTimeout') }}</span>-->
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-common.operation')"
              align="center"
              width="180">
              <template slot-scope="scope">
                <div class="btn-box flex flex-center">
                  <div
                    class="btn-text cursor"
                    @click="showPic(scope.row)">{{ $hussarT('hussar-task.flowChart') }}</div>

                  <div
                    v-if="scope.row.suspensionState == 1"
                    class="btn-text "
                    @click="suspendProcess(scope.row.processInsId)">{{ $hussarT('hussar-task.hang') }}</div>
                  <div
                    v-if="scope.row.suspensionState == 2"
                    class="btn-text"
                    @click="activeProcess(scope.row.processInsId)">{{ $hussarT('hussar-task.activation') }}</div>

                  <el-dropdown trigger="click">
                    <div class="flex flex-up-down btn-more">
                      <span class="btn-text">更多</span>
                      <i class="font_family icon-hussar_expand"/>
                    </div>
                    <el-dropdown-menu
                      slot="dropdown"
                      class="operation-dropdown">
                      <el-dropdown-item @click.native="completeTask(scope.row.id)">
                        <i class="font_family icon-bpm_approval"/>
                        {{ $hussarT('hussar-task.approval') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="editUser(scope.row.id,scope.row.receivers)">
                        <i class="font_family icon-bpm_edit_participant"/>
                        {{ $hussarT('hussar-task.edit') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="openFreeJump(scope.row.id)">
                        <i class="font_family icon-bpm_freejump"/>
                        {{ $hussarT('hussar-task.jump') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="openFreeReject(scope.row.id)">
                        <i class="font_family icon-xiaoxitongzhi_ziyoubohui"></i>
                        {{ $hussarT('hussar-task.reject') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="urgetask(scope.row.processInsId)">
                        <i class="font_family icon-bpm_urge"/>
                        {{ $hussarT('hussar-task.urge') }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="text-align: right;margin-top: 10px"
            background
            :current-page.sync="page.currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQuery.size"
            :total="total"
            :pager-count="pageCount"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 修改参与者 -->
    <assigneeDialog
      :assignee-dialog-visible="addOrEditAssignee"
      :assignee-dialog-loading="assigneeDialogLoading"
      :original-assignee="originalAssignee"
      @close="closeAssignee"
      @confirm="confirmAssignee"/>
    <!-- 自由跳转 -->
    <freeJumpDialog
      :free-jump-dialog-visible="isJump"
      :next-node-options="jumpTasks"
      :free-jump-dialog-loading="freeJumpDialogLoading"
      dialogTitle = "自由跳转"
      @close="closeFreeJump"
      @confirm="confirmFreeJump">
    </freeJumpDialog>
    <FreeReject
      @confirm="queryDefinition" @close="closeFreeReject" :freeRejectShow="isReject" :taskId="rejectTaskId" :userId="rejectUserId" >
    </FreeReject>
    <el-dialog :visible.sync="showPicFlag"
               width="1200px"
            title="流程图">
      <flowfile
        :processInsId="showPicprocessInsId"
        :businessId="showPicBusinessId"
        class="workflow"
        @close="close" />
    </el-dialog>

  </div>
</template>
<script>
  import { TaskApi } from "@/api/workflow/taskManagement/taskApi";
  import hussarRequest from '@/views/workflow/util/request'
  import assigneeDialog from '../components/assigneeDialog/index';
  import freeJumpDialog from '../components/freeJumpDialog/index';
  import FreeReject from '../components/freeRejectDialog/index';

  import  flowfile  from '../components/flowFile/flowfile';

  export default {
    name: 'taskManagement', // 任务管理页面
    components: {
      flowfile,
      assigneeDialog,
      freeJumpDialog,
      FreeReject,
    },
    data() {
      return {
        // 任务转办对应的任务id
        taskId: '',
        // 人员树数据
        props: {
          id: 'id',
          label: 'label',
          children: 'zones',
          isLeaf: 'isLeaf',
          disabled: this.disabledFn
        },
        showPicFlag: false,
        showPicprocessInsId: '',
        showPicBusinessId: '',
        times: '',
        // 增加/修改参与者窗口是否显示
        addOrEditAssignee: false,
        // 查询条件
        listQuery: {
          processName: null,
          startTime: null,
          endTime: null,
          timeoutState: null,
          suspensionState: null,
          size: 10,
          page: 1
        },
        isTimeOuts: [
          //{ id: null, value: '' },
          { id: '1', value: this.$hussarT('hussar-task.timeout') },
          { id: '0', value: this.$hussarT('hussar-task.noTimeout') }
        ],
        suspensions: [
         // { id: null, value: '' },
          { id: '1', value: this.$hussarT('hussar-task.running') },
          { id: '2', value: this.$hussarT('hussar-task.hanged') }
        ],
        // 列表数据
        list: [],
        listLoading: false,
        // 总页数
        total: 0,
        pageCount: 7,
        // 分页参数
        page: { currentPage: 1, size: 10, sizes: [10, 20, 50, 100] },
        isJump: false,
        isReject: false,
        rejectTaskId: '',
        rejectUserId: '',
        jumpTasks: [
          { id: null, value: '' }
        ],
        freeJumpData: {
          taskId: null,
          userId: null,
          activityId: null,
          assignees: null
        },
        startPickerOptions: {
          disabledDate: time => {
            if (this.listQuery.endTime !== '' && this.listQuery.endTime !== null) {
              return time.getTime() > new Date(this.listQuery.endTime).getTime()
            }
          },
          selectableRange: "00:00:00 - 23:59:59",
        },
        endPickerOptions: {
          disabledDate: time => {
            if (this.listQuery.startTime !== '' && this.listQuery.startTime !== null) {
              return time.getTime() < new Date(this.listQuery.startTime).getTime() + 1 - 8.64e7;
            }
          },
          selectableRange: "00:00:00 - 23:59:59",
        },
        // 自由跳转弹窗loading
        freeJumpDialogLoading: false,
        // 修改参与者弹窗loading
        assigneeDialogLoading: false,
        //原参与者
        originalAssignee:[],
      };
    },
    computed: {
      duringTimeLabelWidth() {
        return this.$hussarT('hussar-task.duringTimeLabelWidth');
      },
      runningStateLabelWidth() {
        return this.$hussarT('hussar-task.runningStateLabelWidth');
      },
      operationLabelWidth() {
        return this.$hussarT('hussar-task.operationLabelWidth');
      }
    },
    watch: {
    },
    created() {
      if (this.$route.params.key === this.isTimeOuts[1].id) {
        this.listQuery.timeoutState = this.isTimeOuts[1].id;
        this.queryDefinition();
        // this.selectIsTimeOut(this.isTimeOuts[1].id);
      }
    },
    mounted() {
      this.queryDefinition();
    },
    methods: {
      // 加载树
      loadNode(node, resolve) {
        var id = '-1';
        if (node.level !== 0) {
          id = node.data.id;
        }
        const data = { id: id };
        hussarRequest.get(TaskApi.userTree, data).then(res => {
          return resolve(res);
        });
      },
      indexMethod(index) {
        const curpage = this.page.currentPage;
        const size = this.listQuery.size;
        return (index + 1) + (curpage - 1) * size;
      },
      renderContent(h, { node, data, store }) {
        let iconType = 'tree-com';
        if (data.type === 'user') {
          iconType = 'tree-staff';
        }
        return (
          <div class='custom-tree-node'>
          <div class='tree-node-info'>
          <div class='tree-icon'>
          <svg-icon icon-class={iconType}/>
        </div>
        <span title={node.label}> {node.label} </span>
          </div>
          </div>
      );

        // return (
        //   <div>
        //     <span class='staff-tree'>
        //       <span className='svg-icon'><svg-icon icon-class={iconType}/></span>
        //       {node.label}
        //     </span>
        //   </div>);
      },
      // 设置叶子节点组织机构不可选
      disabledFn(data, node) {
        if ((data.isLeaf && data.type !== 'user')) {
          return true;
        } else {
          return false;
        }
      },
      // 过滤树节点文本
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 获取树被选中用户
      getTreeCheckUser() {
        var nodes = this.$refs.tree.getCheckedNodes();
        // 未选中用户 提示对应信息
        if (nodes.length === 0) {
          return '';
        }
        // 获取处理被选中用户id
        var ids = '';
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].type === 'user') {
            ids = ids + ',' + nodes[i].id;
          }
        }
        if (ids.length === 0) {
          return '';
        }
        ids = ids.substr(1);
        return ids;
      },

      getParams() {
        const routerParams = this.$route.params.key;
        this.listQuery.timeoutState = routerParams;
      },
      // 整理接收人
      setNames(data) {
        var num = data.length;
        if (num === 0) {
          return '';
        }
        var str = data[0];
        if (str == null) {
          str = '';
        }
        for (var i = 1; i < num; i++) {
          if (data[i] != null) {
            if (str === '') {
              str = data[i];
            } else {
              str = str + ' , ' + data[i];
            }
          }
        }
        return str;
      },
      // 查询数据
      queryDefinition(isReset) {
        if(isReset){
          this.listQuery.page = 1;
          this.page.currentPage = 1;
        }
        this.listLoading = true;
        this.listQuery.current = this.listQuery.page;
        hussarRequest.get(TaskApi.list, this.listQuery).then(res => {
            if (res.code === 10000) {
            this.listLoading = false;
            this.list = res.data.records;
            this.total = res.data.total;
          }
        }).catch(res => {
          this.listLoading = false;
        });
      },
      // 获取时间差
      getTimes(start, end) {
        var time1 = new Date(start);
        var time2 = new Date(end);
        if (end === '' | end == null) {
          time2 = new Date();
        }
        var times = time2 - time1;
        var day = Math.floor(times / (24 * 3600 * 1000));
        times = times % (24 * 3600 * 1000);
        var hour = Math.floor(times / (3600 * 1000));
        times = times % (3600 * 1000);
        var min = Math.floor(times / (60 * 1000));
        times = times % (60 * 1000);
        var s = Math.floor((times / 1000));
        var str = day + this.$hussarT('hussar-task.day') + hour + this.$hussarT('hussar-task.hour') + min + this.$hussarT('hussar-task.minute') + s + this.$hussarT('hussar-task.second');
        return str;
      },
      // 确定开始时间、结束时间
      timeChange() {
        if (this.times == null) {
          this.listQuery.startTime = '';
          this.listQuery.endTime = '';
        } else {
          this.listQuery.startTime = this.times[0];
          this.listQuery.endTime = this.times[1];
        }
      },
      // 挂起数据
      suspendProcess(processInsId) {
        document.body.classList.add("modal-parent");
        this.$confirm(this.$hussarT('hussar-task.sureHang'), this.$hussarT('hussar-common.notice'), {
          confirmButtonText: this.$hussarT('hussar-common.confirm'),
          cancelButtonText: this.$hussarT('hussar-common.cancel'),
          cancelButtonClass: 'dialog-cancel',
          confirmButtonClass: 'dialog-save',
          closeOnClickModal: false,
          customClass: 'lcdp-message',
          showClose: false,
          type: 'warning'
        }).then(() => {
          hussarRequest.postForm(TaskApi.suspendTask, {processInsId}).then(res => {
            if (res.code === 10000) {
              this.$message.success(this.$hussarT('hussar-task.hangS'));
              this.queryDefinition();
            }
          }).catch(res => {
            
          });
        }).catch(()=>{
        });
      },
      // 激活数据
      activeProcess(processInsId) {
        document.body.classList.add("modal-parent");
        this.$confirm(this.$hussarT('hussar-task.sureActivation'), this.$hussarT('hussar-common.notice'), {
          confirmButtonText: this.$hussarT('hussar-common.confirm'),
          cancelButtonText: this.$hussarT('hussar-common.cancel'),
          cancelButtonClass: 'dialog-cancel',
          confirmButtonClass: 'dialog-save',
          closeOnClickModal: false,
          customClass: 'lcdp-message',
          showClose: false,
          type: 'warning'
        }).then(() => {
          hussarRequest.postForm(TaskApi.activateTask, {processInsId}).then(res => {
            if (res.code === 10000) {
              this.$message.success(this.$hussarT('hussar-task.activationS'));
              this.queryDefinition();
            }
          }).catch(res => {
            
          });
        }).catch(()=>{
        });
      },
      // 重置按钮
      clearData() {
        this.times = '';
        this.listQuery.processName = '';
        this.listQuery.startTime = null;
        this.listQuery.endTime = null;
        this.listQuery.timeoutState = null;
        this.listQuery.suspensionState = null;
        this.queryDefinition(true);
      },
      showPic(row) {
        this.showPicprocessInsId = row.processInsId;
        this.showPicBusinessId = row.businessId;
        this.showPicFlag = true;
      },
      close() {
        this.showPicFlag = false;
      },
      // 获取对应选项
      selectIsTimeOut(id) {
        this.listQuery.timeoutState = id;
        // this.queryDefinition();
      },
      selectSuspension(id) {
        this.listQuery.suspensionState = id;
        // this.queryDefinition();
      },
      // 每页条数改变
      handleSizeChange(val) {
        // 改变每页显示的条数
        this.listQuery.size = val;
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.listQuery.page = 1;
        this.queryDefinition();
      },
      // 页码切换
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.queryDefinition();
      },
      // 直接审核 （办理）
      completeTask(id) {
        this.listLoading = true;
        const data = {
          taskId: id,
          userId: this.$getHussarUserId(this),
        };
        // 增加参与者
        hussarRequest.post(TaskApi.completeTask, data).then(res => {
          if (res.code === 10000) {
            this.$message.success(this.$hussarT('hussar-task.approvalS'));
            this.queryDefinition();
          }
          this.listLoading = false;
        }).catch(res => {
          this.listLoading = false;
        });
      },
      // 打开任务转办页面
      editUser(id,originalAssignee) {
        this.taskId = id;
        this.addOrEditAssignee = true;
        this.originalAssignee = originalAssignee;
      },
      // 打开自由跳转页面
      openFreeJump(taskId) {
        const data = {
          taskId: taskId
        };
        this.freeJumpData.userId = this.$getHussarUserId(this);
        // 获取任务所有节点
        hussarRequest.get(TaskApi.getJumpTasks, data).then(res => {
          if (res.code === 10000) {
            this.jumpTasks = res.data;
            this.isJump = true;
            this.freeJumpData.taskId = taskId;
          }
        }).catch(() => {
          
        });
      },
      // 打开自由驳回页面
      openFreeReject(taskId){
        this.rejectTaskId = taskId;
        this.isReject = true;
        this.rejectUserId =  this.$getHussarUserId(this);
      },
      urgetask(id) {
        const data = {
          processInsId: id
        };
        hussarRequest.post(TaskApi.urgeTask, data).then(res => {
          if (res.code === 10000) {
            this.$message.success(this.$hussarT('hussar-task.urgeS'));
          }
        }).catch(res => {
        });
      },
      // 关闭修改参与者弹窗
      closeAssignee() {
        this.addOrEditAssignee = false;
      },
      // 确定修改参与者弹窗
      confirmAssignee(obj) {
        let ids = obj.ids;
        if (ids === '') {
          this.$message.error(this.$hussarT('hussar-task.userNull'));
          return;
        }
        this.assigneeDialogLoading = true;
        const data = {
          taskId: this.taskId,
          mandatary: ids
        };
        // 修改参与者
        hussarRequest.post(TaskApi.entrustTask, data).then(res => {
          if (res.code === 10000) {
            this.$message.success(this.$hussarT('hussar-common.changedSuccessful'));
            this.queryDefinition();
          } else if (res.code === 30022) {
            this.$message.error(this.$hussarT('hussar-task.multUserOnlyOne'));
          }
          this.assigneeDialogLoading = false;
          this.addOrEditAssignee = false;
        }).catch(() => {
          this.assigneeDialogLoading = false;
          this.addOrEditAssignee = false;
        });
      },
      // 关闭自由跳转弹窗
      closeFreeJump() {
        this.isJump = false;
      },
      //关闭自由驳回弹窗
      closeFreeReject() {
        this.isReject = false;
      },
      // 确认自由跳转弹窗
      confirmFreeJump(obj) {
        this.freeJumpDialogLoading = true;
        this.freeJumpData.activityId = obj.nextNodeValue;
        this.freeJumpData.processInstId = obj.nextNodeValue;
        this.freeJumpData.assignees = obj.ids;
        // 自由跳转
        hussarRequest.post(TaskApi.freeJump, this.freeJumpData).then(res => {
          if (res.code === 10000) {
            this.$message.success(this.$hussarT('hussar-task.jumpS'));
            this.queryDefinition();
          }
          this.freeJumpDialogLoading = false;
          this.isJump = false;
        }).catch(() => {
          this.freeJumpDialogLoading = false;
          this.isJump = false;
        });
      },
    }
  };
</script>
<style scoped>
  .btn-text{
    cursor:pointer;
    display: inline-block;
    margin: 0 10px;
    color: #0d8eff;
  }
  .datePicker{
    overflow: hidden;
    margin-right: 4px;
    vertical-align: middle;
  }
  .fliter-item{
    display: inline-block;
    overflow: hidden;
    margin-right: 4px;
    vertical-align: middle;
  }
  .container-box .el-dialog__wrapper .input {
    width: 224px;
  }
  @keyframes warn {
    0% {
      transform: scale(0.5);
      opacity: 1;
    }

    30% {
      opacity: 1;
    }

    100% {
      transform: scale(1.4);
      opacity: 0;
    }
  }
  .timeout-point {
    width: 6px;
    height: 6px;
    background-color: #FD3A3A;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
  }
  .point-flicker:after {
    background-color: #FD3A3A;
  }
  .point-flicker:before {
    background-color: rgba(255, 209, 208, 1);
  }
  .point-flicker:before,
  .point-flicker:after {
    content: '';
    width: 8px;
    height: 8px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -4px;
    margin-top: -4px;
    border-radius: 50%;
    animation: warn 1.5s ease-out 0s infinite;
  }
  .timeout{
    color: #FD3A3A;
  }
  .timeout ::v-deep span{
    position: relative;
    top: 4px;
    left: -13px;
  }
  .no-timeout{
    color: #2794F8;
  }
  .no-timeout ::v-deep span{
    position: relative;
    top: 13px;
    left: 6px;
  }
  .no-timeout-point{
    width: 6px;
    height: 6px;
    border-radius: 50px;
    background: #2794F8;
    position: absolute;
  }
  .filter-tree{
    overflow: auto;
    height: 270px;
  }
  /*.el-dropdown {*/
  /*  margin-left: 8px;*/
  /*}*/
  .menu-dialog ::v-deep.lcdp-tree .el-tree-node__content > .el-tree-node__expand-icon{margin-left: 0;padding: 6px;font-size: 12px;}
</style>
