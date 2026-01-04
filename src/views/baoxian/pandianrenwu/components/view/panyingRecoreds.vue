<template>
  <div>
    <el-form
      :model="searchForm"
      ref="searchForm"
      label-width="110px"
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

        <el-col :span="6">
          <el-form-item label="责任人" prop="receivingPerson">
            <el-input
              v-model="searchForm.receivingPerson"
              placeholder="请输入责任人"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="是否信创" prop="isITAICode">
            <el-select
              v-model="searchForm.isITAICode"
              clearable
              placeholder="请选择设备状态"
            >
              <el-option
                v-for="dict in dataList"
                :key="dict.dictKey"
                :label="dict.dictValue"
                :value="dict.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="申报人" prop="subPerson">
            <el-input
              v-model="searchForm.subPerson"
              placeholder="请输入申报人"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="申报人联系方式" prop="subTel">
            <el-input
              v-model="searchForm.subTel"
              placeholder="请输入申报人联系方式"
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
          prop="subPerson"
          label="申报人"
          min-width="80"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="subTel"
          label="申报人联系方式"
          min-width="160"
          align="center"
        >
        </el-table-column>

        <el-table-column prop="user" label="使用人" min-width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="receivingPerson"
          label="责任人"
          min-width="160"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="installationSite"
          label="安装位置"
          min-width="160"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="处置结果"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span
              :style="{
                color:
                  scope.row.disposeResult == '2'
                    ? 'red'
                    : scope.row.disposeResult == '0'
                    ? 'lightGray'
                    : 'black',
              }"
            >{{ showLabel(scope.row.disposeResult, chuzhiList) }}</span
            >
          </template>
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

        <el-table-column
          prop="filingNo"
          label="关联投运单号"
          min-width="80"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="oprtDate"
          label="投运时间"
          min-width="80"
          align="center"
        ></el-table-column>

        <el-table-column prop="ip" label="ip地址" min-width="120" align="center">
        </el-table-column>
        <el-table-column prop="mac" label="MAC地址" min-width="120" align="center">
        </el-table-column>

        <el-table-column
          prop="factorySerial"
          label="出场序列号"
          min-width="120"
          align="center"
        ></el-table-column>

        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="list_btn"
              size="small"
              v-if="scope.row.disposeStatus =='1'"
              @click="handleView(scope.row.id)"
            >查看
            </el-button>
            <el-button
              type="text"
              class="list_btn"
              size="small"
              v-if="scope.row.disposeStatus =='0'"
              @click="handleEdit(scope.row.id)"
            >处置
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

    <panying-dialog v-if="showDialog" @close="showDialog = false" :onlyRead='onlyRead' :isShow="showDialog" :taskId="id" @refresh='refresh'>

    </panying-dialog>
  </div>
</template>

<script>
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import panyingDialog from "../dialog/panyingDialog.vue";
import {getDictCmdbList, getDictList} from "@/api/dict";
import {
  pandianTaskDeviceDetail,
  pandianTaskDetailDeviceList,
} from "@/api/shujubaoxian/pandianTask";

export default {
  components: {xtTreeLzaySelect, panyingDialog},
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
      showDialog: false,
      deviceTypeList: [],
      deviceStatusList: [],
      deviceList: [],
      dataList: [
      ],
      chuzhiList: [],
      id: '',
      onlyRead: true,
    };
  },
  async mounted() {
    //加载字典--设备类型
    await this.getCmdbDictList("1097745969774592");
    //加载字典--设备分类
    await this.getCmdbDictList("1097745625841664");
    //加载字典--设备状态
    await this.getCmdbDictList("1103423111233536");
    //是否信创
    await this.getCmdbDictList("1104198218612736");
    await this.getTaskStatusList("disposeResult");
    this.getDeviceList();

  },

  methods: {

    refresh() {
      this.showDialog = false
      this.searchReset();
    },
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
        }else{
          this.dataList = res.data;
        }
      });
    },

    handleQuery() {
      this.getDeviceList();
    },
    searchReset() {
      this.searchForm.current = 1;
      this.getDeviceList();
    },

    getDeviceList() {
      this.loading = true;
      this.searchForm.taskId = this.taskId;
      this.searchForm.checkStatus = "2";

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

    getuseApplyDept(val) {
      this.searchForm.receiveDeptCode = val.id;
      this.searchForm.receiveDeptName = val.fullName;
      this.$forceUpdate();
    },

    handleView(id) {
      this.showDialog = true;
      this.id = id;
      this.onlyRead = true;
    },
    handleEdit(id) {
      this.showDialog = true;
      this.id = id;
      this.onlyRead = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>


