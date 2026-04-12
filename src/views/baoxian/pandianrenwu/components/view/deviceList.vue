<template>
  <div>
    <el-form
      :model="searchForm"
      ref="searchForm"
      label-width="100px"
      class="xt_search_form"
    >
      <el-row :gutter="6">
        <el-col :span="6">
          <el-form-item label="所在部门" prop="receiveDeptName">
            <xt-tree-lzay-select :formValue="searchForm.receiveDeptName"
                                 :unit-id="$store.getters.userDetail.ownerUnit"
                                 :selectType="'DEPT'"
                                 @getTreeItem="getuseApplyDept"
            ></xt-tree-lzay-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="设备类型" prop="deviceType">
            <el-select
              v-model="searchForm.deviceType"
              placeholder="请输入设备类型"
              clearable
            >
              <el-option
                v-for="dict in deviceTypeList"
                :key="dict.dictKey"
                :label="dict.dictValue"
                :value="dict.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="盘点状态" prop="checkStatus">
            <el-select
              v-model="searchForm.checkStatus"
              clearable
              placeholder="请选择盘点状态"
            >
              <el-option
                v-for="dict in pandianStatusList"
                :key="dict.dictKey"
                :label="dict.dictValue"
                :value="dict.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="责任人" prop="receivingPerson">
            <el-input
              v-model="searchForm.receivingPerson"
              placeholder="请输入责任人"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="设备状态" prop="deviceStatus">
            <el-select
              v-model="searchForm.deviceStatus"
              clearable
              placeholder="请选择设备状态"
            >
              <el-option
                v-for="dict in deviceStatusList"
                :key="dict.dictKey"
                :label="dict.dictValue"
                :value="dict.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="page_body">
      <el-row>
        <formTitle :titleText="'列表'" :titleType="'page_title'">
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
      </el-row>
      <el-table
        ref="deviceTable"
        :data="deviceList"
        v-loading="loading"
        size="small"
        height="360px"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          label="设备编码"
          prop="deviceCode"
          min-width="160"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="deviceType"
          label="设备类型"
          min-width="140"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ showLabel(scope.row.deviceType, deviceTypeList) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="receiveDept"
          label="所在部门"
          min-width="160"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="user" label="使用人" min-width="100" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="receivingPerson"
          label="使用责任人"
          min-width="160"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="receivingTel"
          label="使用责任人联系方式"
          min-width="160"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="ip" label="ip地址" min-width="160" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="mac" label="MAC地址" min-width="160" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="installationSite"
          label="安装位置"
          min-width="160"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <div v-if="scope.row.checkStatus === '1'">
              <el-button
                type="text"
                class="list_btn"
                size="small"
                @click="handleNormal(scope.row, 0)"
              >已盘点
              </el-button>
              <el-button
                type="text"
                class="list_btn"
                size="small"
                @click="handleNormal(scope.row, 2)"
              >盘盈
              </el-button>
              <el-button
                type="text"
                class="list_btn"
                size="small"
                @click="handleNormal(scope.row, 3)"
              >盘亏
              </el-button>
            </div>
          </template>
        </el-table-column>


        <!-- <el-table-column
            prop="checkStatus"
            label="盘点状态"
            width="80"
            align="center"
          >

          <template  slot-scope="scope">
            <span>{{showLabel(scope.row.checkStatus,pandianStatusList)}}</span>
          </template>


          </el-table-column> -->
      </el-table>

      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="getDeviceList"
      />
    </div>
  </div>
</template>

<script>
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {pandianTaskDetailDeviceList, checkTest} from "@/api/shujubaoxian/pandianTask";
import {getDictList, getDictCmdbList} from "@/api/dict";

export default {
  components: {xtTreeLzaySelect},
  props: {
    taskId: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      searchForm: {
        current: 1,
        size: 10,
      },
      deviceTypeList: [],
      deviceCategoryList: [],
      deviceStatusList: [],
      pandianStatusList: [],
      total: 0,
    };
  },
  async mounted() {
    // console.log(this.taskId, "dayin-------------");
    await this.getTaskStatusList("checkStatus");
    //加载字典--设备类型
    await this.getCmdbDictList("1097745969774592");
    //加载字典--设备分类
    await this.getCmdbDictList("1097745625841664");
    //加载字典--设备状态
    await this.getCmdbDictList("1103423111233536");
    this.getDeviceList();

  },
  methods: {
    handleNormal(row, checkStatus){
      checkTest({
        id: row.id,
        checkStatus: checkStatus
      }).then(res=>{
        this.$message.success(res.msg)
        this.$emit('handleOpera')
      })
    },

    //盘点状态
    getTaskStatusList(code) {
      //加载字典
      getDictList(code).then((res) => {
        this.pandianStatusList = res.data;
      });
    },

    showLabel(code, dictList) {
      //字典回显
      if (dictList != null && code !== "") {
        let items = dictList.filter((item) => item.dictKey == code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        } else {
          return "";
        }
      }
      return code;
    },

    getCmdbDictList(code) {
      //加载cmdb字典
      let query = {};
      query.ciId = code;
      getDictCmdbList(query).then((res) => {
        if (code === "1103423111233536") {
          // 设备状态
          this.deviceStatusList = res.data;
        } else if (code === "1097745625841664") {
          this.deviceCategoryList = res.data;
        } else if (code === "1097745969774592") {
          this.deviceTypeList = res.data;
        }
      });
    },

    getuseApplyDept(val) {
      this.searchForm.receiveDeptCode = val.id;
      this.searchForm.receiveDeptName = val.fullName;
      this.$forceUpdate();
    },

    getDeviceList() {
      this.loading = true;
      this.searchForm.taskId = this.taskId;
      this.deviceList = []
      pandianTaskDetailDeviceList(this.searchForm)
        .then((res) => {
          // setTimeout(() => {
            this.deviceList = res.data.records;
            this.total = res.data.total;
            this.loading = false;
          // }, 2000);
        })
        .catch(() => {
          this.loading = false;
        });
    },

    handleQuery() {
      this.getDeviceList();
    },
    searchReset() {
      this.searchForm.current = 1;
      this.getDeviceList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>


