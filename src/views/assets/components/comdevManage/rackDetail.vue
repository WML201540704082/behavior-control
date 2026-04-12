<template>
  <div class="cabinetsDetail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="机架详情" name="0">
        <div class="table-form-box">
          <div style="margin-bottom: 10px">
            <el-button type="primary" plain @click="isSave = !isSave">修 改</el-button>
            <el-button :disabled="!isSave" type="primary" plain @click="saveDetailBtn">保 存</el-button>
          </div>
          <el-form
            ref="racksDetail"
            :model="racksDetail"
            label-width="100px"
            size="small"
            :disabled="!isSave"
            :rules="rules"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="名称" prop="racksName">
                  <el-input v-model="racksDetail.racksName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="全局名称" prop="globalName">
                  <el-input v-model="racksDetail.globalName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="简称" prop="abbreviation">
                  <el-input v-model="racksDetail.abbreviation"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属机柜" prop="belongRacks">
                  <el-input v-model="racksDetail.belongRacks"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="投运日期" prop="useDate">
                  <el-date-picker type="date" placeholder="选择投运日期" v-model="racksDetail.useDate" disabled style="width: 363px"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生产厂家" prop="produceFactory">
                  <el-input v-model="racksDetail.produceFactory"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="序号" prop="racksNum">
                  <el-input v-model="racksDetail.racksNum" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="机架占用" prop="racksOccupancy">
                  <el-select
                    v-model="racksDetail.racksOccupancy"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="dict in racksOccupancyList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="退运日期" prop="returnDate">
                  <el-date-picker
                    type="date"
                    placeholder="选择退运日期"
                    v-model="racksDetail.returnDate"
                    style="width: 363px"
                    @change="changeReturnDate"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="运行状态" prop="runningStatus">
                  <el-select
                    v-model="racksDetail.runningStatus"
                    placeholder="请选择运行状态"
                    clearable
                  >
                    <el-option
                      v-for="dict in runningStatusList"
                      :key="dict.dictKey"
                      :label="dict.dictValue"
                      :value="dict.dictKey"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="位置" prop="racksLocation">
                  <el-input v-model="racksDetail.racksLocation"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="维护单位" prop="maintenanceUnit">
                  <xt-tree-lzay-select
                    :formValue="racksDetail.maintenanceUnit"
                    :selectType="'CORP'"
                    @getTreeItem="getEntityUnit"
                  ></xt-tree-lzay-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="维护人" prop="maintenanceUser">
                  <el-input v-model="racksDetail.maintenanceUser"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="racksDetail.remark"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label='  ' prop="">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备列表" name="1">
        <el-form
          :model="searchForm"
          ref="searchForm"
          label-suffix=":"
          label-width="80px"
          size="small"
        >
          <el-row gutter="20">
            <el-col :span="6">
              <el-form-item label="设备名称">
                <el-input v-model="searchForm.deviceName" clearable placeholder="请输入设备名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-button type="primary" size="small" @click="search">查 询</el-button>
              <el-button type="primary" plain size="small" @click="restForm">重 置</el-button>
              <el-button type="primary" plain size="small" @click="exportBtn">导 出</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          ref="table"
          :data="tableData"
          stripe
          border
          size="small"
          :height="tableHeight"
          v-loading="tableLoading"
        >
          <el-table-column width="50" type="selection" align="center"></el-table-column>
          <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="设备名称" prop="deviceName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="所属机架" prop="rack" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="起始U数" prop="deviceHeightBegin" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="终止U数" prop="deviceHeightEnd" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="机架占用" prop="rackUse" show-overflow-tooltip align="center"></el-table-column>
        </el-table>
        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {getRacksDetail, addRacks, getDeviceList} from "@/api/device/resoureracks";
import {getDictList} from "@/api/dict";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDeptList} from "@/api/system/dept";

export default {
  props: ["racksId"],
  components: {xtTreeLzaySelect},
  data() {
    return {
      runningStatusList: [],
      racksOccupancyList: [],
      maintenanceFactoryList: [],
      searchForm: {
        current: 1,
        size: 20,

      },
      racksDetail: {},
      rules: {
        racksName: [
          {required: true, message: '名称不能为空', trigger: 'blur'}
        ],
        belongRacks: [
          {required: true, message: '所属机柜不能为空', trigger: 'blur'}
        ],
        useDate: [
          {required: true, message: '投运日期不能为空', trigger: 'blur'}
        ],
        racksOccupancy: [
          {required: true, message: '机架占用不能为空', trigger: 'blur'}
        ],
        racksNum: [
          {required: true, message: '机架序号不能为空', trigger: 'blur'}
        ],
      },
      isSave: false,
      saveLoading: false,
      tableHeight: undefined,
      tableLoading: false,
      total: 0,
      activeName: '0',
      tableData: [],
      unitList: [],
    }
  },
  watch: {
    racksId() {
      this.getList()
      this.getDetail()
    },
  },
  mounted() {
    //获取 部门列表
    this.getDeptList()
    //字典加载
    this.getDictList("maintenanceFactory");
    this.getDictList("yesNo");
    this.getDictList("cabinets_status");
    this.$nextTick(() => {
      this.setTableHeight()
    })
    this.getDetail()
    this.getList()
  },
  methods: {
    getDeptList() {
      //获取部门 单位
      getDeptList().then(res => {
        this.unitList = res.data
      })
    },
    getEntityUnit(val) {
      //选择领用单位 部门
      this.racksDetail.maintenanceUnit = val.fullName
      this.$refs.racksDetail.$forceUpdate()
      this.$forceUpdate()
    },
    getDictList(code) {
      getDictList(code).then(res => {
        if (code === "maintenanceFactory") {
          this.maintenanceFactoryList = res.data;
        } else if (code === "yesNo") {
          this.racksOccupancyList = res.data;
        } else if (code === "cabinets_status") {
          this.runningStatusList = res.data;
        }
      });
    },
    saveDetailBtn() {
      this.$refs.racksDetail.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          addRacks(this.racksDetail).then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.racksDetail.title = this.racksDetail.racksName
            this.isSave = false
            this.$emit('updateNode', {handleType: '修改', dataType: 'racks', nodeDetail: this.racksDetail})
            this.saveLoading = false
            this.getDetail();
          });
        }
      })

    },
    setTableHeight() {
      let pageBody = document.getElementsByClassName('page_body')
      this.tableHeight = pageBody[0].offsetHeight - 55 - 48 - 47 + 'px'
    },
    getDetail() {
      getRacksDetail(this.racksId).then(res => {
        this.racksDetail = res.data
      })
    },
    getList() {
      this.tableLoading = true
      this.searchForm.rackCode = this.racksId
      getDeviceList(this.searchForm).then(res => {
        this.tableData = res.data.data
        this.tableLoading = false
        this.tableData.forEach(item => {
          // if()
          item.rackUse = item.deviceHeightEnd - item.deviceHeightBegin + 1
        })
      })

    },
    search() {
      this.searchForm.current = 1
      this.getList()
    },
    restForm() {
      this.searchForm = {
        current: 1,
        size: 20,
      }
      this.getList()
    },
    changeReturnDate(val) {
      if (val != null) {
        if (new Date(val).getTime() < new Date(this.cabinetsDetail.useDate).getTime()) {
          this.$message({
            type: "warning",
            message: "退运日期不可小于投运日期!"
          });
          this.cabinetsDetail.returnDate = null
        }
      }
    }
  }
}
</script>
