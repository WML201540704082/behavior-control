<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <formTitle :titleText="'仓库信息'" :titleType="'page_title'"></formTitle>
      <el-scrollbar style="height:calc(100% - 50px - 48px)">
        <el-form :model="warehouseData" :rules="rules" ref="dataForm" :disabled="!isSave" class="xt_form" label-width="150px">
          <el-row type="flex">
            <el-col :span="4"></el-col>
            <el-col :span="8">
              <el-form-item label="仓库名称" prop="warehouseName">
                <el-input v-model="warehouseData.warehouseName" placeholder="请输入仓库名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="负责人" prop="chargeUser">
                <el-input v-model="warehouseData.chargeUser" placeholder="请输入负责人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="4"></el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="phoneNum">
                <el-input v-model="warehouseData.phoneNum" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓库编号" prop="warehouseId">
                <el-input v-model="warehouseData.warehouseId" placeholder="提交时自动生成" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="4"></el-col>
            <el-col :span="8">
              <el-form-item label="所属单位" prop="ownerUnit">
                <xt-tree-lzay-select :formValue="warehouseData.ownerUnit"
                                     :selectType="'CORP'"
                                     @getTreeItem="getEntityReceiveUnit"></xt-tree-lzay-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="warehouseData.address" placeholder="请输入详细地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="4"></el-col>
            <el-col :span="8">
              <el-form-item label="仓库状态" prop="warehouseStatus">
                <el-select v-model="warehouseData.warehouseStatus" clearable placeholder="仓库状态">
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
        <div class="form-btn">
          <el-button type="primary" @click="onSubmit" :loading="saveLoading" :style="{display: showBtn}">提交</el-button>
          <el-button
            plain
            class="border-btn"
            @click="$closePage('/device/warehouse')"
          >返 回
          </el-button>
        </div>
      </el-scrollbar>
    </div>
  </basic-container>
</template>

<script>
import {getDetail, update,} from "@/api/device/warehouse";
import {getDictList} from "@/api/dict";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDeptList} from "@/api/system/dept";
import {mapGetters, mapState} from "vuex";
import {async} from 'q';

export default {
  props: ["warehouseId"],
  components: {xtTreeLzaySelect},
  data() {
    return {
      searchForm: {
        current: 1,
        size: 20
      },
      receiveUnitList: [],
      warehouseStatusList: [],
      oprtDeptList: [],
      showBtn: '', //显示
      saveLoading: false,
      warehouseData: {},
      rules: {  //校验规则
        warehouseName: [
          {required: true, message: '请输入仓库名称', trigger: 'blur'}
        ],
        chargeUser: [
          {required: true, message: '请输入负责人', trigger: 'blur'}
        ],
        phoneNum: [
          {required: true, message: '请输入联系电话', trigger: 'blur'}
        ],
        ownerUnit: [
          {required: true, message: '请选择所属单位', trigger: 'blur'}
        ],
        address: [
          {required: false, message: '请输入仓库名称', trigger: 'blur'}
        ],
      },
      isSave: false, //是否可保存
      //新增修改表单类型判断
      showType: '',
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    permissionList() {
      return {};
    },
  },
  async mounted() {
    // 获得部门树
    this.getDeptList()
    //加载所属单位
    await this.getDictList("warehouse_status");
    // 设置页面元素高度
    this.setPageContentHeight()
    if (this.$route.query.showType === "修改") {
      this.isSave = true
      getDetail(this.$route.query.id).then(res => {
        this.warehouseData = res.data;
      });
    } else if (this.$route.query.showType === "查看") {
      this.showBtn = 'none'
      getDetail(this.$route.query.id).then(res => {
        this.warehouseData = res.data;
      });
    } else if (this.$route.query.showType === "新增") {
      this.isSave = true
      this.loadData()
    }
  },
  methods: {
    loadData() {
      //默认数据
      this.warehouseData.ownerUnit = this.$store.state.user.userDetail.deptName
      this.warehouseData.ownerUnitId = this.$store.state.user.userDetail.deptId
      this.warehouseData.warehouseStatus = '1'
    },
    getEntityReceiveUnit(val) {
      //选择所属单位
      this.warehouseData.ownerUnit = val.fullName
      this.warehouseData.ownerUnitId = val.id
      this.$refs.dataForm.$forceUpdate()
      this.$forceUpdate()
    },
    async getDeptList() {
      //加载部门数据
      await getDeptList().then(res => {
        this.receiveUnitList = res.data
      })
    },
    async getDictList(code) {
      //加载字典
      await getDictList(code).then(res => {
        if (code === 'warehouse_status') {
          this.warehouseStatusList = res.data;
        }
      });
    },
    submitReset() {
      this.$closePage("/device/warehouse");
    },
    onSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          update(this.warehouseData).then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.submitReset()
            this.saveLoading = false
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    },
  },

}
</script>

<style scoped>

</style>
