<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <formTitle :titleText="'机架信息'" :titleType="'page_title'"></formTitle>
      <el-scrollbar style="height:calc(100% - 50px - 48px)">
        <el-form :model="form" ref="dataForm" class="xt_form" label-width="150px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="机架名称" prop="racksName" :rules="[{ required: true, message: '机架名称不能为空',trigger:'blur'}]">
                <el-input v-model="form.racksName" placeholder="请输入机架名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="全局名称" prop="globalName" clearable :rules="[{ required: false, message: '全局名称不能为空'}]">
                <el-input v-model="form.globalName" placeholder="请输入全局名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="简称" prop="abbreviation" :rules="[{ required: false, message: '简称不能为空'}]">
                <el-input v-model="form.abbreviation" placeholder="请输入简称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属机柜" prop="belongRacks" :rules="[{ required: false, message: '所属机柜不能为空'}]">
                <el-input v-model="form.belongRacks" placeholder="请输入所属机柜" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="投运日期" prop="useDate" :rules="[{ required: true, message: '投运日期不能为空',trigger:'blur'}]">
                <el-date-picker
                  type="date"
                  placeholder="选择投运日期"
                  v-model="form.useDate"
                  @change="changeUseDate"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产厂家" prop="produceFactory" :rules="[{ required: true, message: '生产厂家不能为空',trigger:'blur'}]">
                <el-input v-model="form.produceFactory" placeholder="请输入生产厂家"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="序号" prop="racksNum" :rules="[{ required: true, message: '序号不能为空',trigger:'blur'}]">
                <el-input v-model="form.racksNum" placeholder="请输入序号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机架占用" prop="racksOccupancy">
                <el-select
                  v-model="form.racksOccupancy"
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
              <el-form-item label="退运日期" prop="returnDate" :rules="[{ required: false, message: '退运日期不能为空'}]">
                <el-date-picker
                  type="date"
                  placeholder="选择退运日期"
                  v-model="form.returnDate"
                  @change="changeReturnDate"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运行状态" prop="runningStatus">
                <el-select
                  v-model="form.runningStatus"
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
              <el-form-item label="位置" prop="racksLocation" :rules="[{ required: true, message: '位置不能为空',trigger:'blur'}]">
                <el-input v-model="form.racksLocation" placeholder="请输入位置"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维护单位" prop="maintenanceUnit">
                <xt-tree-lzay-select :formValue="form.maintenanceUnit"
                                     :selectType="'CORP'"
                                     @getTreeItem="getEntityUnit"
                ></xt-tree-lzay-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维护人" prop="maintenanceUser" :rules="[{ required: true, message: '维护人不能为空',trigger:'blur'}]">
                <el-input v-model="form.maintenanceUser" placeholder="请输入维护人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="remark" :rules="[{ required: false, message: '备注不能为空'}]">
                <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
      <div class="form-btn">
        <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
        <el-button class="border-btn" size="small" @click="$closePage('/assets/comdevManage')"
                   style="margin-left: 50px;">返 回
        </el-button>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {addRacks, getRacksDetail} from "@/api/device/resoureracks";
import {getDictList} from "@/api/dict";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDeptList} from "@/api/system/dept";

export default {
  name: "racksAddOrUpdate",
  components: {xtTreeLzaySelect},
  data() {
    return {
      runningStatusList: [],
      racksOccupancyList: [],
      maintenanceFactoryList: [],
      form: {},
      unitList: []
    }
  },
  created() {
    //获取 部门列表
    this.getDeptList()
    //字典加载
    this.getDictList("maintenanceFactory");
    this.getDictList("yesNo");
    this.getDictList("cabinets_status");
    this.form.belongRacks = this.$route.query.cabinetsName
    if (this.$route.query.showType === '修改') {
      getRacksDetail(this.$route.query.id).then(res => {
          this.form = res.data
        }
      )
    }
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
      this.form.maintenanceUnit = val.fullName
      this.$refs.dataForm.$forceUpdate()
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
    submitReset() {
      this.$closePage('/assets/comdevManage')
    },
    onSubmit() {
      let cabinetsId = this.$route.query.cabinetsId
      this.form.cabinetsId = cabinetsId
      addRacks(this.form).then((res) => {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        let handleType = ''
        if (this.$route.query.showType === "修改") handleType = '修改'
        else handleType = '新增'
        res.data.title = res.data.racksName
        this.$store.commit('SET_LIST_UPDATE', (new Date()).getTime())
        this.$store.commit('SET_UPDATE_FORM', {handleType: handleType, dataType: 'racks', nodeDetail: res.data})
        this.submitReset();
      }, error => {
        
      });
    },
    changeUseDate(val) {
      if (val != null && this.form.returnDate && this.form.returnDate != null) {
        if (new Date(val).getTime() > new Date(this.form.returnDate).getTime()) {
          this.$message({
            type: "warning",
            message: "投运日期不可大于退运日期!"
          });
          this.form.useDate = null
        }
      }
    },
    changeReturnDate(val) {
      if (val != null && this.form.useDate && this.form.useDate != null) {
        if (new Date(val).getTime() < new Date(this.form.useDate).getTime()) {
          this.$message({
            type: "warning",
            message: "退运日期不可小于投运日期!"
          });
          this.form.returnDate = null
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
