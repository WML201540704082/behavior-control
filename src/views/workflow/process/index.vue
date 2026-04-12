<template>
  <div
    v-loading="fullscreenLoading"
    class="app-container" style="padding: 10px 20px;overflow: hidden">
    <div class="list-box">

      <div class="table-box">
        <div class="table-filter flex processClass">
          <el-row>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="listQuery.processName"
                :placeholder="$hussarT('hussar-process.processName')"
                class="search-input"
                type="text"
                clearable
                style="width:200px;margin-right: 8px"/>
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="listQuery.businessId"
                :placeholder="$hussarT('hussar-process.businessKey')"
                class="search-input"
                type="text"
                clearable
                style="width:200px;margin-right: 8px"/>
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="listQuery.businessId"
                :placeholder="$hussarT('hussar-process.businessKey')"
                class="search-input"
                type="text"
                clearable
                style="width:200px;margin-right: 8px"/>
            </el-col>
            <el-col :span="4">
              <el-select
                size="mini"
                v-model="selectMsg"
                :placeholder="$hussarT('hussar-process.chooseState')"
                clearable
                popper-class="maxTable short_select"
                style="margin-right: 8px">
                <!--            @change="selectFn($event)">-->
                <el-option
                  v-for="selects in selectMsgs"
                  :key="selects.id"
                  :value="selects.id"
                  :label="selects.value"/>
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
                v-model="listQuery.startTimeEnd"
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
            <el-col :span="4">
              <el-button
                size="mini"
                style="margin-left: 8px;"
                class="btn-search left"
                type="primary"
                @click="queryDefinition(true)">{{ $hussarT('hussar-common.search') }}
              </el-button>
              <el-button
                size="mini"
                class="btn-reset"
                type="button"
                @click="clearData()">{{ $hussarT('hussar-common.reset') }}
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div class="table-wrap" style="margin-top: 10px;">
          <el-table
            v-loading="listLoading"
            ref="tableRow"
            :data="list"
            :row-key="(row)=>{ return row.processInsId}"
            :element-loading-text="$hussarT('hussar-common.loading')"
            height="calc(100vh - 200px)"
            fit
            stripe
            class="lcdp-table"
          >
            <el-table-column
              :label="$hussarT('hussar-common.no')"
              :index="indexMethod"
              type="index"
              align="center"
              width="80"/>
            <el-table-column :label="$hussarT('hussar-process.processName')">
              <template slot-scope="scope">
                <span :title="scope.row.processDefinitionName">{{ scope.row.processDefinitionName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$hussarT('hussar-process.businessKey')">
              <template slot-scope="scope">
                <span :title="scope.row.businessId">{{ scope.row.businessId }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-process.startTime')"
              width="150"
              align="center">
              <template slot-scope="scope">
                <span :title="scope.row.startTime.substr(0,19)">{{ scope.row.startTime.substr(0,19) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$hussarT('hussar-process.endTime')" width="150" align="center">
              <template slot-scope="scope">
                <span :title="scope.row.endTime.substr(0,19)">{{ scope.row.endTime.substr(0,19) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-process.continueTime')"
              width="180"
              align="center">
              <template slot-scope="scope">
                <div style="width: fit-content;margin-left: auto">
                  <span :title="getTimes(scope.row.startTime,scope.row.endTime)">{{
                    getTimes(scope.row.startTime,scope.row.endTime)
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$hussarT('hussar-process.linkName')">
              <template slot-scope="scope">
                <span v-if="scope.row.endTime != null && scope.row.endTime !== ''">{{ $hussarT('hussar-process.end') }}</span>
                <span
                  v-if="scope.row.suspensionState == 2 || scope.row.suspensionState == 1"
                  :title="setNames(scope.row.names)">{{ setNames(scope.row.names) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-process.state')"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.suspensionState == 1">{{ $hussarT('hussar-process.running') }}</span>
                <span v-if="scope.row.suspensionState == 2">{{ $hussarT('hussar-process.hanged') }}</span>
                <span v-if="scope.row.endTime != null && scope.row.endTime !== ''">{{ $hussarT('hussar-process.done') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$hussarT('hussar-common.operation')"
              width="180"
              align="center">
              <template slot-scope="scope">
                <div class="btn-box flex flex-center">
                  <div @click="showPic(scope.row)" class="btn-text">{{ $hussarT('hussar-process.flowChart') }}</div>

                  <div v-if="scope.row.endTime != null && scope.row.endTime !== ''"
                       @click="deleteFinished(scope.row)" class="btn-text">{{ $hussarT('hussar-common.delete') }}
                  </div>
                  <div v-if="scope.row.endTime == null || scope.row.endTime == ''"
                       @click="deleteRun(scope.row)" class="btn-text">{{ $hussarT('hussar-common.delete') }}
                  </div>

                  <el-dropdown trigger="click">
                    <div class="flex flex-up-down btn-more">
                      <span class="btn-text">更多</span>
                      <i class="font_family icon-hussar_expand"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown" class="operation-dropdown">
                      <el-dropdown-item @click.native="openUpdateComment(scope.row)">
                        <i class="font_family icon-hussar_edit"></i>
                        {{ $hussarT('hussar-process.updateComment') }}
                      </el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.suspensionState == 1"
                                        @click.native="suspendProcess(scope.row.processInsId)">
                        <i class="font_family icon-bpm_hang"></i>
                        {{ $hussarT('hussar-process.hang') }}
                      </el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.suspensionState == 2"
                                        @click.native="activeProcess(scope.row.processInsId)">
                        <i class="font_family icon-hussar_active"></i>
                        {{ $hussarT('hussar-process.activation') }}
                      </el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.suspensionState == 1 || scope.row.suspensionState == 2"
                                        @click.native="endProcess(scope.row.processInsId)">
                        <i class="font_family icon-xiaoxitongzhi_zhongzhi"></i>
                        {{ $hussarT('hussar-process.terminate') }}
                      </el-dropdown-item>
                      <el-dropdown-item v-else
                                        @click.native="reStartProcess(scope.row.processInsId)">
                        <i class="font_family icon-xiaoxitongzhi_zhongqi"></i>
                        {{ $hussarT('hussar-process.reStart') }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <!--                <el-button v-if="scope.row.suspension == 1" class="btn-blue" @click="suspendProcess(scope.row.processInsId)">{{$hussarT('hussar-process.hang')}}</el-button>-->
                <!--                <el-button v-if="scope.row.suspension == 2" class="btn-blue" @click="activeProcess(scope.row.processInsId)">{{$hussarT('hussar-process.activation')}}</el-button>-->
                <!--                <el-button class="btn-blue" @click="showPic(scope.row.processInsId)">{{$hussarT('hussar-process.flowChart')}}</el-button>-->
                <!--                <el-button v-if="scope.row.endTime != null && scope.row.endTime !== ''" class="btn-red" @click="deleteFinished(scope.row.processInsId)">{{$hussarT('hussar-common.delete')}}</el-button>-->
                <!--                <el-button v-if="scope.row.endTime == null || scope.row.endTime == ''" class="btn-red" @click="deleteRun(scope.row.processInsId)">{{$hussarT('hussar-common.delete')}}</el-button>-->

              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            style="text-align: right;margin-top: 10px;"
            :current-page.sync="page.currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQuery.limit"
            :total="total"
            :pager-count="pageCount"
            layout="total, sizes, prev, pager, next"

            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 修改意见 -->
    <updateCommentDialog
      :updateCommentDialogVisible="updateCommentDialogVisible"
      :updateCommentDialogLoading="updateCommentDialogLoading"
      :taskComments="taskComments"
      @close="closeUpdateComment"
      @confirm="confirmUpdateComment">
    </updateCommentDialog>
    <el-dialog :visible.sync="showPicFlag"
               width="1200px"
               title="流程图">
      <flowfile
        :processInsId="showPicProcessInstanceId"
        :businessId="showPicBusinessId"
        class="workflow"
        @close="close"/>
    </el-dialog>

    <!-- 流程重启 -->
    <reStartDialog
      :freeJumpDialogVisible="isReStart"
      :nextNodeOptions="reStartTasks"
      :freeJumpDialogLoading="reStartDialogLoading"
      dialogTitle="流程重启"
      @close="closeReStart"
      @confirm="confirmReStart">
    </reStartDialog>
  </div>
</template>
<script>
  import {ProcessApi} from "@/api/workflow/processinst/processApi";
  import hussarRequest from '@/views/workflow/util/request'

  import flowfile from '../components/flowFile/flowfile';
  import updateCommentDialog from '../components/updateCommentDialog/index';
  import {TaskApi} from "@/api/workflow/taskManagement/taskApi";
  import reStartDialog from '../components/restartDialog/index';

  export default {
    name: 'processinst', // 实例管理页面
    components: {
      flowfile,
      updateCommentDialog,
      reStartDialog
    },
    data() {
      return {
        showPicFlag: false,
        showPicProcessInstanceId: '',
        showPicBusinessId: '',
        // 修改意见窗口是否显示
        updateCommentDialogVisible: false,
        // 查询条件
        listQuery: {
          processName: '',
          processInsId: '',
          businessId: '',
          startTime: null,
          startTimeEnd: null,
          page: 1,
          limit: 10,
          suspensionState: null
        },
        // 下拉选项设置
        selectMsg: null,
        selectMsgs: [
          // { id: null, value: '' },
          {id: '1', value: this.$hussarT('hussar-process.running')},
          {id: '2', value: this.$hussarT('hussar-process.hanged')},
          {id: '3', value: this.$hussarT('hussar-process.done')}
        ],
        isReStart: false,
        reStartTasks: [
          {id: null, value: ''}
        ],
        reStartData: {
          processInsId: null,
          businessId: null,
          taskDefinitionKey: null,
          userId: null,
          assignee: null,
          isSubmit: false,
        },
        // 自由跳转弹窗loading
        reStartDialogLoading: false,
        times: '',
        // 列表数据
        list: [],
        listLoading: false,
        // 列表选择的数据集合
        checkBoxData: [],
        // 总页数
        total: 0,
        pageCount: 7,
        // 分页参数
        page: {currentPage: 1, size: 10, sizes: [10, 20, 50, 100]},
        startPickerOptions: {
          disabledDate: time => {
            if (this.listQuery.startTimeEnd !== '' && this.listQuery.startTimeEnd !== null) {
              return time.getTime() > new Date(this.listQuery.startTimeEnd).getTime()
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
        //接收后台传过来的数据
        taskComments: [
          {id: null, value: ''}
        ],
        updateCommentsData: [],
        // 加载遮罩层显隐标识
        fullscreenLoading: false,
        // 修改意见弹窗loading
        updateCommentDialogLoading: false,
      };
    },
    mounted() {
      this.queryDefinition();
    },
    methods: {
      // 设置环节的输出数据
      setNames(data) {
        if (data === '' || data === null) {
          return this.$hussarT('hussar-process.end');
        }
        if (data.substring(0, 1) === ',') {
          return data.substring(1);
        }
        return data;
      },
      // 查询列表的数据
      indexMethod(index) {
        const curpage = this.page.currentPage;
        const limitpage = this.listQuery.limit;
        return (index + 1) + (curpage - 1) * limitpage;
      },
      // 获取对应选项
      selectFn(id) {
        this.selectMsg = id;
        this.queryDefinition();
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
        var str = day + this.$hussarT('hussar-process.day') + hour + this.$hussarT('hussar-process.hour') + min + this.$hussarT('hussar-process.minute') + s + this.$hussarT('hussar-process.second');
        return str;
      },
      // 确定开始时间、结束时间
      timeChange() {
        if (this.times == null) {
          this.listQuery.startTime = '';
          this.listQuery.startTimeEnd = '';
        } else {
          this.listQuery.startTime = this.times[0];
          this.listQuery.startTimeEnd = this.times[1];
        }
      },
      // 查询数据
      queryDefinition(isReset) {
        if (isReset) {
          this.listQuery.page = 1;
          this.page.currentPage = 1;
        }
        this.listLoading = true;
        this.listQuery.suspensionState = this.selectMsg;
        this.listQuery.current = this.listQuery.page;
        this.listQuery.size = this.listQuery.limit;
        hussarRequest.get(ProcessApi.list, this.listQuery).then(res => {
          if (res.code === 10000) {
            this.listLoading = false;
            this.list = res.data.records;
            this.total = res.data.total;
          } else {
            this.listLoading = false;
          }
        }).catch(() => {
          this.listLoading = false;
        });
      },
      showPic(row) {
        this.showPicProcessInstanceId = row.processInsId;
        this.showPicBusinessId = row.businessId;
        this.showPicFlag = true;
      },
      close() {
        this.showPicFlag = false;
      },
      // 删除数据
      deleteFinished(row) {
        let processInsId = row.processInsId;
        let processDefinitionName = row.processDefinitionName;
        const msg = '此操作将删除'
          + '<span class="msg-highlight">"' + processDefinitionName + '"</span>，'
          + '删除的数据无法恢复';
        this.$confirm(msg, this.$hussarT('hussar-common.confirmedToDeleteNew'), {
          confirmButtonText: this.$hussarT('hussar-common.confirm'),
          cancelButtonText: this.$hussarT('hussar-common.cancel'),
          cancelButtonClass: 'dialog-cancel',
          closeOnClickModal: false,
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'dialog-delete',
          showClose: false,
          type: 'warning',
          customClass: 'lcdp-message',
        }).then(() => {
          this.fullscreenLoading = true;
          hussarRequest.postForm(ProcessApi.deleteFinished, {processInsId}).then(res => {
            if (res.code === 10000) {
              this.$message.success(this.$hussarT('hussar-common.deleteSuccessful'));
              this.queryDefinition();
            }
            this.fullscreenLoading = false;
          }).catch(() => {
            this.fullscreenLoading = false;
          });
        }).catch(() => {

        });
      },
      // 删除数据
      deleteRun(row) {
        let processInsId = row.processInsId;
        let processDefinitionName = row.processDefinitionName;
        const msg = this.$hussarT('hussar-common.confirmedMsgToDelete1')
          + '<span class="msg-highlight">"' + processDefinitionName + '"</span>，'
          + this.$hussarT('hussar-common.confirmedMsgToDelete2');
        this.$confirm(msg, this.$hussarT('hussar-common.confirmedToDeleteNew'), {
          confirmButtonText: this.$hussarT('hussar-common.confirm'),
          cancelButtonText: this.$hussarT('hussar-common.cancel'),
          cancelButtonClass: 'dialog-cancel',
          closeOnClickModal: false,
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'dialog-delete',
          showClose: false,
          type: 'warning',
          customClass: 'lcdp-message',
        }).then(() => {
          this.fullscreenLoading = true;
          hussarRequest.postForm(ProcessApi.deleteRun, {processInsId}).then(res => {
            if (res.code === 10000) {
              this.$message.success(this.$hussarT('hussar-common.deleteSuccessful'));
              this.queryDefinition();
            }
            this.fullscreenLoading = false;
          }).catch(() => {
            this.fullscreenLoading = false;
          });
        }).catch(() => {

        });
      },
      //打开修改意见弹窗
      openUpdateComment(row) {
        const data = {
          processInsId: row.processInsId,
          businessId: row.businessId
        };
        // 获取任务所有节点
        hussarRequest.get(ProcessApi.getProcessDetailList, data).then(res => {
          if (res.code === 10000) {
            this.taskComments = res.data;
            this.updateCommentDialogVisible = true;
          }
        }).catch(() => {
          // console.error(this.$hussarT('hussar-license..dataFailed'));
        });
      },
      // 关闭修改意见弹窗
      closeUpdateComment() {
        this.updateCommentDialogVisible = false;
      },
      //确认修改意见弹窗
      confirmUpdateComment(obj) {
        this.updateCommentsData = obj.taskCommentList;
        this.updateCommentDialogLoading = true;
        hussarRequest.post(ProcessApi.updateTaskComments, this.updateCommentsData).then(res => {
          if (res.code === 10000) {
            this.$message.success("修改成功");
          }
          this.updateCommentDialogLoading = false;
          this.updateCommentDialogVisible = false;
        }).catch(() => {
          // console.error(this.$hussarT('hussar-license..dataFailed'));
          this.updateCommentDialogLoading = false;
          this.updateCommentDialogVisible = false;
        })
      },
      // 挂起数据
      suspendProcess(processInsId) {
        this.$confirm(this.$hussarT('hussar-process.sureHang'), this.$hussarT('hussar-common.notice'), {
          confirmButtonText: this.$hussarT('hussar-common.confirm'),
          cancelButtonText: this.$hussarT('hussar-common.cancel'),
          cancelButtonClass: 'dialog-cancel',
          confirmButtonClass: 'dialog-save',
          customClass: 'lcdp-message',
          showClose: false,
          type: 'warning'
        }).then(() => {
          hussarRequest.postForm(ProcessApi.suspendProcess, {processInsId}).then(res => {
            if (res.code === 10000) {
              this.$message.success(this.$hussarT('hussar-process.hangS'));
              this.queryDefinition();
            }
          }).catch(() => {
          });
        }).catch(() => {

        });
      },
      // 激活数据
      activeProcess(processInsId) {
        this.$confirm(this.$hussarT('hussar-process.sureActivation'), this.$hussarT('hussar-common.notice'), {
          confirmButtonText: this.$hussarT('hussar-common.confirm'),
          cancelButtonText: this.$hussarT('hussar-common.cancel'),
          cancelButtonClass: 'dialog-cancel',
          confirmButtonClass: 'dialog-save',
          customClass: 'lcdp-message',
          showClose: false,
          type: 'warning'
        }).then(() => {
          hussarRequest.postForm(ProcessApi.activeProcess, {processInsId}).then(res => {
            if (res.code === 10000) {
              this.$message.success(this.$hussarT('hussar-process.activationS'));
              this.queryDefinition();
            }
          }).catch(() => {
          });
        }).catch(() => {

        });
      },
      // 终止数据
      endProcess(processInsId) {
        this.$confirm(this.$hussarT('hussar-process.sureTerminate'), this.$hussarT('hussar-common.notice'), {
          confirmButtonText: this.$hussarT('hussar-common.confirm'),
          cancelButtonText: this.$hussarT('hussar-common.cancel'),
          cancelButtonClass: 'dialog-cancel',
          confirmButtonClass: 'dialog-save',
          customClass: 'lcdp-message',
          showClose: false,
          type: 'warning'
        }).then(() => {
          this.fullscreenLoading = true;
          const data = {
            processInsId: processInsId,
            userId: this.$getHussarUserId(this),
          }
          hussarRequest.post(ProcessApi.endProcess, data).then(res => {
            if (res.code === '1') {
              this.$message.success(this.$hussarT('hussar-process.terminateS'));
              this.queryDefinition();
            }
            this.fullscreenLoading = false;
          }).catch(() => {
            this.fullscreenLoading = false;
          });
        }).catch(() => {

        });
      },
      // 打开重启流程页面
      reStartProcess(processInsId, businessId) {
        const data = {
          processInsId: processInsId
        };
        this.reStartData.userId = this.$getHussarUserId(this);
        // 获取任务所有节点
        hussarRequest.get(TaskApi.getJumpTasks, data).then(res => {
          if (res.code === 10000) {
            this.reStartTasks = res.data;
            this.isReStart = true;
            this.reStartData.processInsId = processInsId;
            this.reStartData.businessId = businessId;
          }
        }).catch(() => {
          // console.error(this.$hussarT('hussar-license..dataFailed'));
        });
      },
      // 关闭重启流程弹窗
      closeReStart() {
        this.isReStart = false;
      },
      // 确认流程重启弹窗
      confirmReStart(obj) {
        this.reStartDialogLoading = true;
        this.reStartData.taskDefinitionKey = obj.nextNodeValue;
        this.reStartData.assignee = obj.ids;
        // 自由跳转
        hussarRequest.post(ProcessApi.reStartProcess, this.reStartData).then(res => {
          if (res.code === '1') {
            this.$message.success(this.$hussarT('hussar-process.reStartS'));
            this.queryDefinition();
          }
        }).catch(() => {
        }).finally(() => {
          this.reStartDialogLoading = false;
          this.isReStart = false;
        });
      },
      // 重置按钮
      clearData() {
        this.listQuery.processName = '';
        this.listQuery.processInsId = '';
        this.listQuery.businessId = '';
        this.listQuery.startTime = null;
        this.listQuery.startTimeEnd = null;
        this.selectMsg = null;
        this.times = '';
        this.queryDefinition(true);
      },
      // 判断激活或挂起的显示
      stateFormat(row, column) {
        if (row.isSuspended === 'false') {
          return this.$hussarT('hussar-process.activation');
        } else if (row.isSuspended === 'true') {
          return this.$hussarT('hussar-process.hang');
        } else {
          return '-';
        }
      },
      // 每页条数改变
      handleSizeChange(val) {
        // 改变每页显示的条数
        this.listQuery.limit = val;
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.listQuery.page = 1;
        this.queryDefinition();
      },
      // 页码切换
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.queryDefinition();
      }
    }
  };
</script>
<style scoped>
  .btn-text {
    cursor: pointer;
    display: inline-block;
    margin: 0 10px;
    color: #0d8eff;
  }

  .container-box .el-dialog__wrapper .input {
    width: 224px;
  }

  .fliter-item {
    display: inline-block;
    overflow: hidden;
    margin-right: 4px;
    vertical-align: middle;
  }

  .list-container ::v-deep .el-loading-mask {
    background: transparent;
  }
</style>
