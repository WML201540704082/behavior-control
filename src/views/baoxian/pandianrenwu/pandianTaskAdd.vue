<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <formTitle :titleText="'任务信息'" :titleType="'page_title'" style="margin-top: 0;"></formTitle>
      <el-scrollbar style="height: calc(100% - 80px - 68px)">
        <el-form
          :model="form"
          ref="dataForm"
          class="xt_form topHeight"
          label-width="100px"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="任务编号" prop="filingNo" size="small">
                <el-input
                  v-model="form.filingNo"
                  placeholder="请输入任务编号"
                  clearable
                  maxlength="24"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="任务名称"
                prop="taskName"
                size="small"
                :rules="[
                  {
                    required: true,
                    message: '请输入盘点任务名称',
                    trigger: 'change',
                  },
                ]"
              >
                <el-input
                  v-model="form.taskName"
                  placeholder="请输入盘点任务名称"
                  clearable
                  maxlength="24"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="盘点时间"
                prop="createTimes"
                :rules="[
                  {
                    required: true,
                    message: '盘点时间不能为空',
                    trigger: 'change',
                  },
                ]"
              >
                <el-date-picker
                  v-model="form.createTimes"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  @change="dataPickerChange"
                  size="small"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发起单位" prop="launchUnitName">
                <xt-tree-lzay-select :formValue="form.launchUnitName"
                                     :selectType="'CORP'"
                                     @getTreeItem="getuseApplyUnit"
                                     disabled
                ></xt-tree-lzay-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item
                label="盘点人员"
                prop="receiverName"
                :rules="[
                  {
                    required: true,
                    message: '盘点人员不能为空',
                    trigger: 'change',
                  },
                ]"
              >
                <el-input
                  v-model="form.receiverName"
                  placeholder="请选择盘点人员"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item
                label="根据历史盘点情况创建"
                prop="historyTask"
                class="bhs"
                :rules="[
                  {
                    required: true,
                    message: '根据历史盘点情况创建不能为空',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model="form.historyTask"
                  placeholder="请选择根据历史盘点情况创建"
                  clearable
                  @change="pandianqk"

                >
                  <el-option
                    v-for="dict in pandianQKList"
                    :key="dict.taskId"
                    :label="dict.taskName"
                    :value="dict.taskId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="发起时间" prop="createTime" size="small">
                <el-input
                  v-model="form.createTime"
                  placeholder="提交时系统自动记录"
                  clearable
                  maxlength="24"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="备注" prop="remark" size="small">
                <el-input
                  v-model="form.remark"
                  placeholder="请填写补充说明。限200个字"
                  clearable
                  maxlength="240"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 中间设备列表 -->

        <formTitle
          :titleText="'盘点范围'"
          :titleType="'page_title'"
        ></formTitle>
        <div class="selectDep" v-if="form.historyTask == '1'">
          <el-form
            :model="form"
            class="topHeight label_rule"
            label-width="120px"
          >
            <el-form-item
              label="部门范围"
              size="small"
              prop="selectDept"
              :rules="[
                {
                  type: 'array',
                  required: true,
                  message: '请至少选择一个部门',
                  trigger: 'change',
                },
              ]"
            >
              <el-checkbox :indeterminate='isIndeterminateDept' v-model="checkAllDept" @change="handleChangeAllDept">全选</el-checkbox>
              <el-checkbox-group v-model="form.selectDept">
                <!-- v-model="deptCheck" -->
                <el-checkbox
                  v-for="(item, PIndex) in checkDataList"
                  :key="PIndex"
                  :label="PIndex"
                  @change="handleCheckedDeptChanges(PIndex)"
                >{{ item.deptName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item
              label="设备分类"
              size="small"
              prop="selectFenlei"
              :rules="[
                {
                  type: 'array',
                  required: true,
                  message: '请至少选择一个设备分类',
                  trigger: 'change',
                },
              ]"
            >
              <el-checkbox :indeterminate='isIndeterminateFenlei' v-model="checkAllFenlei" @change="handleChangeAllFenlei">全选</el-checkbox>
              <el-checkbox-group v-model="form.selectFenlei">
                <!-- v-model="fenleiCheck" -->
                <el-checkbox
                  v-for="(item, deviceFenleiIndex) in deviceFenleiList"
                  :key="deviceFenleiIndex"
                  :label="deviceFenleiIndex"
                  @change="fenleiChange(deviceFenleiIndex)"
                >{{ item.dictValue }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item
              label="设备类型"
              size="small"
              prop="selectLeixing"
              :rules="deviceRule"
            >
              <el-checkbox
                :indeterminate="isIndeterminateLeixing"
                v-model="checkAllLeixing"
                @change="handleChangeAllLeixing"
              >全选
              </el-checkbox
              >
              <el-checkbox-group v-model="form.selectLeixing">
                <el-checkbox
                  v-for="item in deviceLeixingList"
                  :key="item.dictKey"
                  :label="item.dictKey"
                  @change="handleleixingChanges(item.dictKey)"
                >{{ item.dictValue }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>

        <div class="selectDep" v-else>
          <el-form
            :model="form"
            ref="selectForm"
            class="topHeight label_rule"
            label-width="120px"
          >
            <el-form-item
              label="盘点范围"
              size="small"
              prop="selectFanwei"
              :rules="pandianRule"
            >
              <el-checkbox
                :indeterminate="isIndeterminateFanWei"
                v-model="checkAllFanwei"
                @change="handleChangeAllFanWei"
              >全选
              </el-checkbox
              >
              <el-checkbox-group
                v-model="form.selectFanwei"
              >
                <el-checkbox
                  v-for="item in fanweiList"
                  :key="item.dictKey"
                  :label="item.dictKey"
                  @change="handleleFanWeiChanges(item.dictKey)"

                >{{ item.dictValue }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>

        <formTitle :titleText="'设备列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="handleQuery"
            >查询
            </el-button
            >
            <el-button
              class="border-btn"
              size="small"
              icon="el-icon-refresh"
              @click="searchReset"
            >重置
            </el-button
            >
          </div>
        </formTitle>
        <el-table
          ref="deviceTable"
          :data="deviceList"
          v-loading="loading"
          size="small"
          height="380px"
          @selection-change="selectionChange"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="deviceCode"
            label="设备编码"
            min-width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="deviceCategory"
            label="设备分类"
            min-width="160"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="deviceType"
            label="设备类型"
            min-width="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="deviceStatus"
            label="设备状态"
            min-width="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="receivingPerson"
            label="责任人"
            min-width="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="receivingTel"
            label="责任人联系方式"
            min-width="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="user"
            label="使用人"
            min-width="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="receiveDept"
            label="使用部门"
            min-width="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="swWhere"
            label="安装位置"
            min-width="140"
            align="center"
          >
          </el-table-column>
        </el-table>
        <!-- <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="fenye"
        /> -->
      </el-scrollbar>
      <!-- 底部按钮 -->
      <div class="form-btn">
        <el-button
          class="border-btn"
          size="small"
          @click="handleSaveOK"
          style="margin-left: 50px"
          v-if="!isEdit"
        >暂存
        </el-button
        >
        <el-button
          type="primary"
          size="small"
          style="margin-left: 50px"
          @click="submit"
        >提交
        </el-button
        >
        <el-button
          class="border-btn"
          size="small"
          @click="handleReset"
          style="margin-left: 50px"
        >返回
        </el-button
        >
      </div>

      
    </div>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import {
  historyPandianTaskList,
  getDept,
  pandianTaskSave,
  pandianTaskDetailDeviceList,
  pandianTaskSubmit,
  pandianTaskDetail,
} from "@/api/shujubaoxian/pandianTask";
import {
  getDictCmdbList,
  getDictCmdbListPid,
  getCmdbList,
  getDictList,
} from "@/api/dict";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getList} from "@/api/system/user";

export default {
  components: {xtTreeLzaySelect},
  data() {
    return {
      id: "",
      form: {
        historyTask: '1',
        selectDept: [],
        selectFenlei: [],
        selectLeixing: [],
        selectFanwei: [],
        receiverName: "",
        receiverIds: [],
        createTimes: null,
      },
      searchForm: {
        current: 1,
        size: 200,
        lastDevice: [],
      },
      selectDept: [],
      loading: false,
      isEdit: false,
      deviceList: [],
      formDeviceList: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      checkDataList: [],
      isIndeterminateDept: true,
      checkAllDept: false,
      isIndeterminateFenlei: true,
      checkAllFenlei: false,
      isIndeterminateLeixing: true,
      checkAllLeixing: false,
      checkAllFanwei: false,
      isIndeterminateFanWei: true,
      deviceFenleiList: [],
      deviceLeixingList: [],
      fanweiList: [],
      // fenleiCheck: false,
      // deptCheck: false,
      pandianQKList: [],
      pandianPersonsList: [],
      selectPersonName: [],
      rules: [
        {required: true, validator: this.personRule, trigger: "change"},
      ],
      deviceRule: [
        {
          type: "array",
          required: true,
          validator: this.deviceRulesValidator,
          trigger: "change",
        },
      ],
      pandianRule: [
        {
          type: 'array',
          required: true,
          validator: this.pandianRulesValidator,
          trigger: 'change',
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["permission", "userInfo", "userDetail"]),
  },
  async mounted() {
    // 设置页面元素高度
    this.setPageContentHeight();
    this.id = null;
    // //获取参数 判断是否是新增还是修改
    const params = this.$route.query;

    this.form.launchUnitName = this.userDetail.ownerUnitName;
    this.form.launchUnit = this.userDetail.ownerUnit;
    await this.getDeviceFenlei();
    await this.getDeptList();
    this.getHistoryTask();
    this.getTaskStatusList("lastCheckTask");

    if (params.id) {
      this.id = params.id;
      this.form.id = params.id;
      this.loadDetail(params.id);
      this.isEdit = true;
    } else {
      //加载空数据
      this.isEdit = false;
    }
  },
  methods: {
    deviceRulesValidator(rule, value, callback) {
      if (this.form.selectLeixing.length == 0) {
        callback(new Error("请选择设备类型"));
      } else {
        callback();
      }
    },
    personRule(rule, value, callback) {
      if (!this.form.receiverName) {
        callback(new Error("请选择盘点人员"));
      } else {
        callback();
      }
    },
    pandianRulesValidator(rule, value, callback) {
      if (this.form.selectFanwei.length == 0) {
        callback(new Error("请选择盘点范围"));
      } else {
        callback();
      }
    },
    pandianqk(code) {
      this.pandianQKList.forEach(val => {
        if (val.taskId === code) {
          this.form.historyCheckTypes = val.taskName;
          this.form.historyTask = val.taskId;
          if (this.form.historyTask != 1) {
            this.form.receiverName = val.receiverName;
            this.form.receiverIds = val.receiverIds;
          }
          this.$forceUpdate();
        }
      })
    },
    async getPersons(deptId) {
      await getList(1, 1000, Object.assign({deptId: deptId})).then((res) => {
        this.pandianPersonsList = res.data.records;

        if (this.pandianPersonsList.length > 0) {
          if (this.form.receiverName) {
            this.form.receiverName =
              this.form.receiverName +
              "," +
              this.pandianPersonsList.map((item) => item.name);
          } else {
            this.pandianPersonsList.map((item) => {
              this.form.receiverName = item.name;
            });
          }

          // console.log(this.form, 'this.form.receiverIds====');
          if (this.form.receiverIds.length > 0) {
            this.form.receiverIds = this.form.receiverIds.concat(
              this.pandianPersonsList.map((item) => item.id)
            );
          } else {
            this.form.receiverIds = this.pandianPersonsList.map((item) => item.id)
          }

        }

        if (this.selectPersonName.length === 0) {
          this.selectPersonName = [...res.data.records];
        } else {
          this.selectPersonName = this.selectPersonName.concat(
            res.data.records
          );
        }

        this.$forceUpdate();
      });
    },
    //上期盘点范围
    getTaskStatusList(code) {
      //加载字典
      getDictList(code).then((res) => {
        this.fanweiList = res.data;
      });
    },
    async getDeptList() {
      await getDept({parentId: this.form.launchUnit}).then((res) => {
        if (res.code == 200) {
          this.checkDataList = res.data;
        }
      });
    },
    fenye(){
      if (this.form.historyTask == "1") {
        this.getdeviceList();
      } else {
        this.getPandianTaskList();
      }
    },
    handleQuery() {
      this.searchForm.deviceCategoryCode = "";
      this.searchForm.deviceTypeCode = "";
      this.searchForm.lastDevice = [];
      this.searchForm.id = "";
      if (this.form.historyTask == "1") {
        this.getdeviceList();
      } else {
        this.getPandianTaskList();
      }
    },
    searchReset() {
      this.searchForm.current = 1;
      this.getdeviceList();
    },
    dataPickerChange() {
      //时间段选择
      if (this.form.createTimes != null && this.form.createTimes.length > 0) {
        this.form.taskStartTime = this.form.createTimes[0];
        this.form.taskEndTime = this.form.createTimes[1];
      } else {
        this.form.taskStartTime = null;
        this.form.taskEndTime = null;
      }
    },
    async getDeviceFenlei() {
      //设备分类
      await getDictCmdbList({ciId: "1097745625841664"}).then((res) => {
        if (res.code == 200) {
          this.deviceFenleiList = res.data;
        }
      });
    },

    //获取历史盘点情况
    getHistoryTask() {
      historyPandianTaskList()
        .then((res) => {
          if (res.data.length > 0) {
            this.pandianQKList = res.data;
          } else {
            this.pandianQKList = [];
          }
          let item = {taskName: "不选择历史盘点任务", taskId: "1"};
          this.pandianQKList.push(item);
        })
        .catch(() => {
        });
    },
    //设备列表
    getdeviceList() {
      this.loading = true;
      this.searchForm.deviceCategoryCode = this.form.selectFenlei
        .map((index) => this.deviceFenleiList[index].dictKey)
        .join(",");
      this.searchForm.deviceTypeCode = this.form.selectLeixing.join(",");
      this.searchForm.id = this.$route.query.id ? this.$route.query.id : "";
      this.searchForm.receiveUnitCode = this.form.launchUnit;
      this.searchForm.area = this.userDetail.regionCode||'37'
      getCmdbList(this.searchForm)
        .then((res) => {
          this.deviceList = res.data.data;
          this.total = res.data.total;
          this.loading = false;
          this.formDeviceList = JSON.parse(JSON.stringify(res.data.data));
          this.formDeviceList = this.formDeviceList.map((item) => {
            item.deviceId = item.id;
            // item.deviceCategory = item.deviceCategoryCode;
            // item.deviceStatus = item.deviceStatusCode;
            // item.deviceType = item.deviceTypeCode;
            return item;
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },

    //盘点历史列表
    getPandianTaskList() {
      //加载数据
      this.loading = true;
      this.searchForm.taskId = this.form.historyTask;
      this.searchForm.lastDeviceStr = this.form.selectFanwei.join(',');
      pandianTaskDetailDeviceList(this.searchForm).then((res) => {
        const data = res.data;
        this.total = data.total;
        this.deviceList = data.records;
        this.loading = false;
      });
    },

    handleChangeAllDept(val){
      console.log(111)

      this.form.selectDept = val ? this.checkDataList.map((item, index) => index) : [];
      this.isIndeterminateDept = false;
      this.checkAllDept = val;

    },

    //选择部门
    handleCheckedDeptChanges(index) {
      console.log(222)

      // 是否全选效果渲染
      let checkCount = this.form.selectDept.length;
      this.checkAllDept = checkCount === this.checkDataList.length;
      this.isIndeterminateDept = checkCount > 0 && checkCount < this.checkDataList.length;


      const isChecked = this.form.selectDept.includes(index);
      let deptId = this.checkDataList[index].id;
      console.log(isChecked)

      if (isChecked) {
        let personArr = this.selectPersonName.filter(
          (item) => item.deptId == deptId
        );
        if (personArr.length === 0) {
          this.getPersons(deptId); // 设备类型
        }
      } else {
        let personArr = this.selectPersonName.filter(
          (item) => item.deptId == deptId
        );
        if (personArr.length > 0) {
          this.selectPersonName = this.selectPersonName.filter(
            (obj) => obj.deptId != deptId
          );
          this.form.receiverName = this.selectPersonName
            .map((item) => item.name)
            .join(",");
          this.form.receiverId = this.selectPersonName
            .map((item) => item.id);
        }
      }
      this.$forceUpdate();
    },




    handleChangeAllFenlei(val){
      this.form.selectFenlei = val ? this.deviceFenleiList.map((item, index) => index) : [];
      this.isIndeterminateFenlei = false;
      this.checkAllFenlei = val;

      this.form.selectLeixing = []
      
      this.handleQuery()
    },

    fenleiChange(index) {
      let checkCount = this.form.selectFenlei.length;
      this.checkAllFenlei = checkCount === this.deviceFenleiList.length;
      this.isIndeterminateFenlei = checkCount > 0 && checkCount < this.deviceFenleiList.length;

      // console.log(this.form.selectFenlei,'设备分类=============');
      const isChecked = this.form.selectFenlei.includes(index);
      let deviceTypeId = this.deviceFenleiList[index].dictKey;
      let leixingArr = this.deviceLeixingList.filter(
        (item) => item.pid == deviceTypeId
      );
      if (isChecked) {
        
        if (leixingArr.length === 0) {
          this.getDeviceLeiXing("1097745969774592", deviceTypeId); // 设备类型
        }

      } else {
        
        if (leixingArr.length > 0) {
          this.deviceLeixingList = this.deviceLeixingList.filter(
            (obj) => obj.pid != deviceTypeId
          );
        }

      }

      this.form.selectLeixing = []
      this.handleQuery()

    },
    async getDeviceLeiXing(ciId, pid) {
      //  debugger
      await getDictCmdbListPid({ciId: ciId, pid: pid}).then((res) => {
        this.deviceLeixingList = this.deviceLeixingList.concat(res.data);
      });
    },

    //全选设备类型
    handleChangeAllLeixing(val) {
      this.form.selectLeixing = val
        ? this.deviceLeixingList.map((item) => item.dictKey)
        : [];
      this.isIndeterminateLeixing = false;
      this.checkAllLeixing = val;

      this.handleQuery()
    },
    //选择设备类型
    handleleixingChanges(dictKey) {
      let checkCount = this.form.selectLeixing.length;
      this.checkAllLeixing = checkCount === this.deviceLeixingList.length;
      this.isIndeterminateLeixing = checkCount > 0 && checkCount < this.deviceLeixingList.length;
      this.$forceUpdate();

      this.handleQuery()
    },

    //全选盘点范围
    handleChangeAllFanWei(val) {
      this.form.selectFanwei = val
        ? this.fanweiList.map((item) => item.dictKey)
        : [];
      // console.log(this.form.selectFanwei);

      this.isIndeterminateFanWei = false;
      this.checkAllFanwei = val;
      if (val) {
        this.form.lastDevice = this.form.selectFanwei
      } else {
        this.form.lastDevice = [];
      }
    },
    //选择盘点范围
    handleleFanWeiChanges(val) {
      // console.log(this.form.selectFanwei);
      let checkCount = this.form.selectFanwei.length;
      this.checkAllFanwei = checkCount === this.fanweiList.length;
      this.isIndeterminateFanWei = checkCount > 0 && checkCount < this.fanweiList.length;
      this.form.lastDevice = this.form.selectFanwei
      this.$forceUpdate();
    },

    // 发起单位
    getuseApplyUnit(val) {
      this.form.getuseApplyUnit = val.id;
      this.form.launchUnitName = val.fullName;

      this.checkDataList = [...val.children];
    },
    handleSaveOK() {

      //不选盘点历史范围的时候，选择处理过的设备列表,
      if (this.form.historyTask === "1") {
        this.form.checkTaskDeviceDTOS = [...this.formDeviceList];
        this.form.checkDeptIds = this.form.selectDept.map(
          (index) => this.checkDataList[index].id
        );
        this.form.checkDepts = this.form.selectDept
          .map((index) => this.checkDataList[index].deptName)
          .join(",");
        this.form.checkNum = this.formDeviceList.length;
        this.form.deviceCategoryIds = this.form.selectFenlei.map(
          (index) => this.deviceFenleiList[index].dictKey
        );
        this.form.deviceTypeIds = this.form.selectLeixing;
        this.form.deviceTypes = "";

        for (let i = 0; i < this.form.deviceTypeIds.length; i++) {
          const dictKey = this.form.deviceTypeIds[i];
          const obj = this.deviceLeixingList.find(
            (item) => item.dictKey == dictKey
          );
          if (obj) {
            if (this.form.deviceTypes != "") {
              this.form.deviceTypes += ",";
            }
            this.form.deviceTypes += obj.dictValue;
          }
        }
      } else {
        this.form.checkTaskDeviceDTOS = [...this.deviceList];
        this.form.checkNum = this.deviceList.length;
      }

      console.log(96, this.form)

      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          //提交建档
          pandianTaskSave(this.form).then(
            (res) => {
              this.$message({
                type: "success",
                message: "保存成功!",
              });
              this.form.filingNo = res.data.filingNo;
              this.form.id = res.data.id;
              this.handleReset();
              // this.$router.push("/baoxian/pandianrenwu");
            },
            (error) => {
              //  
            }
          );
        }
      });
    },
    handleReset() {
      //返回
      this.$closePage("/baoxian/pandianrenwu");
    },
    submit() {

      //不选盘点历史范围的时候，选择处理过的设备列表,
      if (this.form.historyTask === "1") {
        this.form.checkTaskDeviceDTOS = [...this.formDeviceList];
        this.form.checkDeptIds = this.form.selectDept.map(
          (index) => this.checkDataList[index].id
        );
        this.form.checkDepts = this.form.selectDept
          .map((index) => this.checkDataList[index].deptName)
          .join(",");
        this.form.checkNum = this.formDeviceList.length;
        this.form.deviceCategoryIds = this.form.selectFenlei.map(
          (index) => this.deviceFenleiList[index].dictKey
        );
        this.form.deviceTypeIds = this.form.selectLeixing;
        this.form.deviceTypes = "";
        for (let i = 0; i < this.form.deviceTypeIds.length; i++) {
          const dictKey = this.form.deviceTypeIds[i];
          const obj = this.deviceLeixingList.find(
            (item) => item.dictKey == dictKey
          );
          if (obj) {
            if (this.form.deviceTypes != "") {
              this.form.deviceTypes += ",";
            }
            this.form.deviceTypes += obj.dictValue;
          }
        }
      } else {
        this.form.checkTaskDeviceDTOS = [...this.deviceList];
        this.form.checkNum = this.deviceList.length;

      }
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          //提交建档
          pandianTaskSubmit(this.form).then(
            (res) => {
              this.$message({
                type: "success",
                message: "保存成功!",
              });
              this.form.filingNo = res.data.filingNo;
              this.form.id = res.data.id;
              this.handleReset();
              // this.$router.push("/baoxian/pandianrenwu");
            },
            (error) => {
              //  
            }
          );
        }
      });
    },

    showDictLable(code, dictList) {
      if (dictList != null && code != "") {
        let items = dictList.filter((item) => item.dictKey === code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }
      }
      return code;
    },

    async getLeixing(deviceTypeIds, deviceCategoryIds) {
      this.form.selectLeixing = [];
      // debugger
      for (let i = 0; i < deviceCategoryIds.length; i++) {
        await this.getDeviceLeiXing("1097745969774592", deviceCategoryIds[i]); // 设备类型
      }

      this.form.selectLeixing = deviceTypeIds;
      this.handleQuery();

      this.$forceUpdate();
    },

    async getPersonByDept(checkDeptIds) {
      this.form.selectLeixing = [];
      for (let i = 0; i < checkDeptIds.length; i++) {
        await this.getPersons(checkDeptIds[i]);
      }

      this.$forceUpdate();
    },

    loadDetail() {
      pandianTaskDetail({id: this.id}).then((res) => {
        this.form = res.data;
        this.form.selectDept = res.data.checkDeptIds.map((id) =>
          this.checkDataList.findIndex((item) => item.id == id)
        );
        this.form.selectFenlei = res.data.deviceCategoryIds.map((dictKey) =>
          this.deviceFenleiList.findIndex((item) => item.dictKey == dictKey)
        );
        if (this.form.selectFenlei.length > 0) {
          this.getLeixing(res.data.deviceTypeIds, res.data.deviceCategoryIds);
        }

        if (this.form.selectDept.length > 0) {
          this.getPersonByDept(res.data.checkDeptIds);
        }
        this.form.historyTask = res.data.historyTask ? res.data.historyTask : '1';
        this.form.createTimes = [res.data.taskStartTime, res.data.taskEndTime];
        this.form.selectFanwei = res.data.lastDevice;
        if (this.form.selectFanwei.length > 0) {
          this.handleQuery();
        }
        this.$forceUpdate();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .bhs{
  .el-form-item__label{
    line-height: 21px;
  }
}

.formLabel {
  line-height: 16px;
  display: block;
}

.topHeight {
  height: auto;
}

.label_rule {
  text-align: left !important;
}

.selectDep {
  /deep/ .el-form-item__label {
    text-align: left;
  }
}
</style>
