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
                                     @getTreeItem="getEntityReceiveUnit"
                                     v-if="$route.query.treeType =='1'"
                ></xt-tree-lzay-select>
                <el-input v-else v-model="warehouseData.ownerUnit" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属区域" prop="regionName">
                <el-input v-if="$route.query.treeType =='1'" v-model="warehouseData.regionName" disabled></el-input>
                <el-input v-if="$route.query.showType =='详情'" v-model="area" disabled></el-input>
                <areaTreeSelect
                  v-else
                  :formValue="area"
                  @getTreeItem="getAreaInfo"
                />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row type="flex">
            <el-col :span="4"></el-col>
            <el-col :span="8">
              <el-form-item label="所在位置" prop="address">
                <el-input v-model="warehouseData.address" placeholder="请输入所在位置"></el-input>
              </el-form-item>
            </el-col>
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
          <el-row type="flex">
            <el-col :span="4"></el-col>
            <el-col :span="8">
              <el-form-item label="I6000关联仓库" prop="i6000Uuid">
                <el-select v-model="warehouseData.i6000Uuid" placeholder="请选择I6000关联仓库" clearable>
                  <el-option v-for="dict in warehouseI6000List" :key="dict.uuid" :label="dict.name"
                             :value="dict.uuid"></el-option>
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
            @click="$closePage('/assets/comdevManage')"
          >返 回
          </el-button>
        </div>
      </el-scrollbar>
    </div>
  </basic-container>
</template>

<script>
import {getDetail, update, getI6000WarehouseList} from "@/api/device/warehouse";
import {getDictList} from "@/api/dict";
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import {getDeptList} from "@/api/system/dept";
import {mapGetters, mapState} from "vuex";
import {getRegionDetail} from "@/api/base/region"
import areaTreeSelect from "@/components/areaTreeSelect/index.vue";

export default {
  props: ["warehouseId"],
  components: {xtTreeLzaySelect, areaTreeSelect},
  data() {
    return {
      searchForm: {
        current: 1,
        size: 20
      },
      receiveUnitList: [],
      warehouseStatusList: [],
      warehouseI6000List: [],
      oprtDeptList: [],
      showBtn: '', //显示
      saveLoading: false,
      warehouseData: {
        ownerUnit: undefined,
        regionName: undefined
      },
      rules: {  //校验规则
        warehouseName: [
          {required: true, message: '请输入仓库名称', trigger: 'blur'}
        ],
        ownerUnit: [
          {required: true, message: '请选择所属单位', trigger: 'change'}
        ],
        address: [
          {required: true, message: '请输入所在位置', trigger: 'blur'}
        ],
        regionName: [
          {required: true, message: '请选择所属区域', trigger: 'change'}
        ],
        warehouseStatus: [
          {required: true, message: '请选择仓库状态', trigger: 'change'}
        ],

      },
      isSave: false, //是否可保存
      //新增修改表单类型判断
      showType: '',
      area:''
    }
  },
  computed: {
    ...mapGetters(["permission","userDetail"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    permissionList() {
      return {};
    },
  },
  async mounted() {
    // 获得部门树
    this.getDeptList();
    //加载所属单位
    await this.getDictList("warehouse_status");
    // 获取I6000机房数据
    this.getI6000Warehouses();
    // 设置页面元素高度
    this.setPageContentHeight()
    if (this.$route.query.showType === "修改") {
      this.isSave = true
      getDetail(this.$route.query.id).then(res => {
        this.warehouseData = res.data;
        this.getArea();
      });
    } else if (this.$route.query.showType === "查看") {
      this.showBtn = 'none'
      getDetail(this.$route.query.id).then(res => {
        this.warehouseData = res.data;
      });
    } else if (this.$route.query.showType === "新增") {
      this.isSave = true
      this.loadData()
    } else if (this.$route.query.showType === "详情") {
      this.showBtn = 'none'
      getDetail(this.$route.query.id).then(res => {
        this.warehouseData = res.data;
        this.getArea();
      });
    }
  },
  methods: {
    getArea(){
      getRegionDetail(this.warehouseData.regionCode).then(res =>{
        this.area = res.data.name
        this.warehouseData.regionName = res.data.name
      })
    },
    loadData() {
      //默认数据
      // this.warehouseData.ownerUnit = this.$store.state.user.userDetail.deptName
      // this.warehouseData.ownerUnitId = this.$store.state.user.userDetail.deptId
      if (this.$route.query.treeType == 1) {
        this.warehouseData.regionCode = this.$route.query.areaId
        this.warehouseData.regionName = this.$route.query.areaName;
      } else {
        this.warehouseData.ownerUnit = this.$route.query.areaName
        this.warehouseData.ownerUnitId = this.$route.query.areaId;
      }
      // this.warehouseData.warehouseStatus = '1'
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
      this.$closePage("/assets/comdevManage");
    },
    getI6000Warehouses() {
      getI6000WarehouseList().then(res => {
        if (res.code == 200) {
          this.warehouseI6000List = res.data;
        }
      });
    },
    getAreaInfo(val) {
      this.warehouseData.regionCode = val.id
      this.warehouseData.regionName = val.name
      this.area = val.name
      this.$forceUpdate()
    },
    onSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          let current = this.warehouseI6000List.filter(el=> el.uuid == this.warehouseData.i6000Uuid)[0];
          if(current){ this.warehouseData.i6000Name = current.name; }
          
          update(this.warehouseData).then((res) => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });

            let handleType = ''
            if (this.$route.query.showType === "修改") handleType = '修改'
            else handleType = '新增'

            res.data.name = res.data.warehouseName
            res.data.id = res.data.uuid
            res.data.type = 'warehouse'
            this.$store.commit('SET_LIST_UPDATE', (new Date()).getTime())
            this.$store.commit('SET_UPDATE_FORM', {handleType: handleType, dataType: 'room', nodeDetail: res.data})

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
