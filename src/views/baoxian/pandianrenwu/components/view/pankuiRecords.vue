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
          <el-form-item label="处置状态" prop="disposeStatus">
            <el-select
              v-model="searchForm.disposeStatus"
              clearable
              placeholder="请选择处置状态"
            >
              <el-option
                v-for="dict in pyStatusList"
                :key="dict.node"
                :label="dict.nodeName"
                :value="dict.node"
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
          min-width="140"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="deviceType"
          label="设备类型"
          min-width="140"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ showLabel(scope.row.deviceType, deviceTypeList) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="receiveDept"
          label="所在部门"
          min-width="80"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="deviceStatus"
          label="设备状态"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
                showLabel(scope.row.deviceStatus, deviceStatusList)
              }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="user" label="使用人" min-width="80" align="center">
        </el-table-column>

        <el-table-column
          prop="receivingPerson"
          label="使用责任人"
          min-width="160"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="receivingTel"
          label="使用责任人联系方式"
          min-width="160"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="disposeStatus"
          label="处置状态"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">
            <div class="status_chuzhi">
              <div
                class="cicle"
                :class="
                  scope.row.disposeStatus === '1' ? 'approved' : 'unApprove'
                "
              ></div>
              <div>
                {{ scope.row.disposeStatus == "0" ? "待处置" : "已处置" }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="address"
          label="处置结果"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">
            <div style="display:flex;">
              <span>
                {{ showLabel(scope.row.disposeResult, chuzhiList) }}
              </span>
              <el-tooltip placement="top" v-if="scope.row.disposeResult == '4'">
                <div slot="content">
                  断网开始时间：{{ scope.row.offlineStartTime }} <br/>断网恢复时间：{{
                    scope.row.offlineEndTime
                  }}
                </div>
                <i class="el-icon-info" style="color: #409eff"> </i>
              </el-tooltip>
            </div>

          </template>
        </el-table-column>

        <el-table-column
          prop="installationSite"
          label="安装位置"
          min-width="160"
          align="center"
        >
        </el-table-column>

        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="list_btn"
              size="small"
              v-if="scope.row.disposeResult =='0' || scope.row.disposeResult =='3'"
              :disabled="scope.row.disposeResult =='3'"
              @click="tuiwang(scope.row.id)"
            >临时退网
            </el-button>
            <el-button
              type="text"
              class="list_btn"
              size="small"
              v-if="scope.row.disposeResult =='5'"
              @click="ruwang(scope.row.id)"
            >恢复入网
            </el-button>

            <el-button
              type="text"
              class="list_btn btn_red"
              size="small"
              v-if="scope.row.disposeResult =='5' || scope.row.disposeResult =='0'|| scope.row.disposeResult =='3'|| scope.row.disposeResult =='4'"
              :disabled="scope.row.disposeResult =='3'"
              @click="tuiyun(scope.row.id)"
            >退运
            </el-button>
            <el-button
              type="text"
              class="list_btn"
              size="small"
              @click="$message.success('操作成功')"
            >设备变更
            </el-button>
          </template>
        </el-table-column>
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
import {getDictCmdbList, getDictList} from "@/api/dict";
import {
  pandianTaskDetailDeviceList, pandianTaskDeviceApprove
} from "@/api/shujubaoxian/pandianTask";

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
      total: 0,
      deviceTypeList: [],
      deviceStatusList: [],
      deviceList: [],
      pyStatusList: [
        {node: "0", nodeName: "待处置"},
        {node: "1", nodeName: "已处置"},
      ], //盘盈状态
    };
  },
  async mounted() {
    //加载字典--设备类型
    await this.getCmdbDictList("1097745969774592");
    await this.getCmdbDictList("1103423111233536");
    await this.getTaskStatusList("disposeResult");
    this.getDeviceList();
  },
  methods: {
    //处置结果
    getTaskStatusList(code) {
      //加载字典
      getDictList(code).then((res) => {
        this.chuzhiList = res.data;
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

    getDeviceList() {
      this.loading = true;
      this.searchForm.taskId = this.taskId;
      this.searchForm.checkStatus = "3";
      pandianTaskDetailDeviceList(this.searchForm)
        .then((res) => {
          this.deviceList = res.data.records;
          this.total = res.data.total;
          this.loading = false;
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

    tuiwang(id) {
      this.showDialog = true;
      this.$confirm(
        "点击确定后该设备将临时断网7天，7天后自动恢复，确认后无法撤回，请谨慎操作",
        "确定将该设备临时断网吗?",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        pandianTaskDeviceApprove({id: id, disposeResult: '5', editType: '2'}).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "临时退网成功!"
            });
            this.searchReset();

          }
        }).catch(err => {

        });
      });
    },
    ruwang(id) {
      pandianTaskDeviceApprove({id: id, disposeResult: '4', editType: '2'}).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "入网成功!"
          });
          this.searchReset();

        }
      }).catch(err => {

      });
    },
    tuiyun(id) {
      this.showDialog = true;
      this.$confirm(
        "点击确定后将生成一条退运工单并将该设备退运，一旦确认后无法撤回，请谨慎选择",
        "确定将该设备退运吗?",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        pandianTaskDeviceApprove({id: id, disposeResult: '3', editType: '2'}).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "成功!"
            });
            this.searchReset();

          }
        }).catch(err => {

        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.status_chuzhi {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .cicle {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    margin-right: 5px;
  }

  .approved {
    background-color: green;
  }

  .unApprove {
    background-color: orange;
  }
}

::v-deep .btn_red {
  color: red;
}
</style>


