<template>
  <div class="warehouseDetail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="仓库详情" name="0">
        <div class="table-form-box">
          <!--          <div style="margin-bottom: 10px">-->
          <!--            <el-button type="primary" plain size="small" @click="isSave = !isSave">修 改</el-button>-->
          <!--            <el-button :disabled="!isSave" type="primary" plain size="small" @click="saveBtn" :loading="saveLoading">保存</el-button>-->
          <!--          </div>-->
          <el-form
            ref="warehouseDetail"
            :model="warehouseDetail"
            :rules="rules"
            label-width="100px"
            size="small"
            :disabled="!isSave"
          >
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="8">
                <el-form-item label="仓库名称" prop="warehouseName">
                  <el-input v-model="warehouseDetail.warehouseName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="负责人" prop="chargeUser">
                  <el-input v-model="warehouseDetail.chargeUser"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="8">
                <el-form-item label="联系电话" prop="phoneNum">
                  <el-input v-model="warehouseDetail.phoneNum"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="仓库编号" prop="warehouseId">
                  <el-input v-model="warehouseDetail.warehouseId" disabled></el-input>
                </el-form-item>
              </el-col>



            </el-row>
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="8">
                <el-form-item label="所属单位" prop="ownerUnit">
                  <el-input v-model="warehouseDetail.ownerUnit" clearable></el-input>
                  <!--                  <xt-tree-lzay-select :formValue="warehouseDetail.ownerUnit"-->
                  <!--                                       :selectType="'CORP'"-->
                  <!--                                       @getTreeItem="getEntityUnit"></xt-tree-lzay-select>-->
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属区域" prop="regionCode">
                  <el-input v-model="warehouseDetail.regionCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="8">
                <el-form-item label="所在位置" prop="address">
                  <el-input v-model="warehouseDetail.address"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="仓库状态" prop="warehouseStatus">
                  <el-select v-model="warehouseDetail.warehouseStatus" clearable placeholder="仓库状态">
                    <el-option
                      v-for="dict in warehouseStatusList"
                      :key="dict.dictKey" :label="dict.dictValue" :value="dict.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getDeptList} from "@/api/system/dept";
import {getDictList} from "@/api/dict";
import {getDetail, update} from "@/api/device/warehouse";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";

export default {
  props: ["warehouseId"],
  components: {xtTreeLzaySelect},
  data() {
    return {
      warehouseDetail: {},
      warehouseStatusList:[],
      unitList: [],
      saveLoading: false,
      rules: {},
      isSave: false, //是否可保存
    }
  },
  watch: {
    warehouseId() {
      this.getDetail()
    }
  },
  mounted() {
    this.getDictList("warehouse_status");
    this.getDeptList()
    this.getDetail()
  },
  methods: {
    async getDictList(code) {
      //加载字典
      await getDictList(code).then(res => {
        if (code === 'warehouse_status') {
          this.warehouseStatusList = res.data;
        }
      });
    },
    getDeptList() {
      //获取部门 单位
      getDeptList().then(res => {
        this.unitList = res.data
      })
    },
    getDetail() {
      getDetail(this.warehouseId).then(res => {
        this.warehouseDetail = res.data
      })
    },
    saveBtn() {
      this.$refs.warehouseDetail.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          update(this.warehouseDetail).then((res) => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.warehouseDetail.name = this.warehouseDetail.cabinetsName
            this.warehouseDetail.id = this.warehouseDetail.uuid
            this.warehouseDetail.type = 'warehouse'
            this.isSave = false
            this.$emit('updateNode', {handleType: '修改', dataType: 'warehouse', nodeDetail: this.warehouseDetail})
            this.saveLoading = false
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    },
    getEntityUnit(val) {
      //选择领用单位 部门
      this.warehouseDetail.ownerUnit = val.fullName
      this.$refs.warehouseDetail.$forceUpdate()
      this.$forceUpdate()
    },
  }
}
</script>

<style lang="scss" scoped>
  .table-form-box .el-row{
    border: 0;
  }
.el-col-6, .el-col-18 {
  height: 40px;
}
</style>
