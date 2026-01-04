<template>
  <div class="wrap">
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="beforeCloseHandler"
      :visible.sync="isShow"
      append-to-body
      title="设备列表"
      width="1100px"
      top="8vh"
      v-el-drag-dialog
    >
      <div class="page_form">
        <el-form
          ref="searchForm"
          :model="searchForm"
          label-suffix=":"
          label-width="100px"
          class="xt_search_form"
        >
          <el-row :gutter="6">
            <el-col :span="8">
              <el-form-item label="设备编码" prop="deviceCode">
                <el-input v-model="searchForm.deviceCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备状态" prop="deviceStatusCode">
                <el-select v-model="searchForm.deviceStatusCode" clearable placeholder="请选择设备状态" :disabled="isChange()">
                  <el-option v-for="dict in deviceStatusCodeList" :key="dict.dictValue" :label="dict.dictValue"
                            :value="dict.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产权单位" prop="getEntityUnit">
                <xt-tree-lzay-select :formValue="searchForm.ownerUnit"
                                   :selectType="'CORP'"
                                   @getTreeItem="getEntityUnit"
                ></xt-tree-lzay-select>
              </el-form-item>
            </el-col>
            
            <template v-if="isExpand">
              <el-col :span="8">
                <el-form-item label="产权部门" prop="propertyDept">
                  <xt-tree-lzay-select :formValue="searchForm.propertyDept"
                                    :unit-id="searchForm.ownerUnitCode"
                                    :selectType="'DEPT'"
                                    @getTreeItem="getEntityDept"
                  ></xt-tree-lzay-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出厂序列号" prop="sn">
                  <el-input v-model="searchForm.sn"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="ERP资产编码" prop="assetCodeErp">
                  <el-input v-model="searchForm.assetCodeErp"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备来源" prop="deviceSourceCode">
                  <el-select v-model="searchForm.deviceSourceCode" @change="deviceChange" clearable placeholder="请选择设备来源">
                    <el-option
                      v-for="item in deviceSourceList"
                      :value="item.dictKey"
                      :key="item.dictKey"
                      :label="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :span="8">
                <el-form-item label="设备分类" prop="deviceCategoryCode">
                  <el-select v-model="searchForm.deviceCategoryCode" :disabled="deviceCategory" placeholder="请选择设备分类"
                            clearable @change="deviceCategoryCodeChange">
                    <el-option v-for="dict in deviceCategoryCodeList" :key="dict.dictValue" :label="dict.dictValue"
                              :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备类型" prop="deviceTypeCode">
                  <el-select v-model="searchForm.deviceTypeCode"
                            :disabled="!(searchForm.deviceCategoryCode && !deviceType)" placeholder="请输入设备类型" clearable>
                    <el-option v-for="dict in deviceTypeCodeList" :key="dict.dictValue" :label="dict.dictValue"
                              :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="IP地址" prop="IP">
                  <el-input v-model="searchForm.IP"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="MAC地址" prop="MAC">
                  <el-input v-model="searchForm.MAC"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="使用人" prop="user">
                  <el-input v-model="searchForm.user"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="warehouseName">
                <el-form-item label="所在仓库">
                  <el-input v-model="warehouseName" disabled></el-input>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="isExpand ? 24:24" style="text-align: right;">
              <el-button @click="isExpand=!isExpand" type="text" :icon="isExpand ? 'el-icon-arrow-up':'el-icon-arrow-down'" style="font-size: 15px">{{ isExpand ? '收回':'展开' }}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="page_body">
        <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary" @click="handleExport">导出</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="searchReset" plain>重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="handleSubmit">提交</el-button>
          </div>
        </formTitle>
        <el-table
          ref="dataTable"
          size="small"
          @selection-change="select"
          :data="tableData"
          v-loading="loading"
          height="400px"
          row-key="id"
        >
          <el-table-column type="selection" width="30" fixed="left" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" width="180" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="deviceCategory" label="设备分类" width="100" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="deviceType" label="设备类型" width="100" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="deviceSource" label="设备来源" width="100" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="assetCodeErp" label="ERP资产编码" width="175" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="deviceCodeErp" label="ERP设备台账编码" width="175" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="fullName" label="设备名称" width="150" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="deviceStatus" label="设备状态" width="100" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="IP" label="IP地址" width="120" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="MAC" label="MAC地址" width="120" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <!-- <el-table-column prop="ip" label="IP地址" width="100" align="center" show-overflow-tooltip sortable></el-table-column> -->
          <el-table-column prop="sn" label="出厂序列号" width="120" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="brand" label="品牌" width="100" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="series" label="系列" width="100" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="deviceModel" label="型号" width="100" align="center" show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleSave(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {getDictCmdbList, getCmdbList, getDictCmdbListPid} from "@/api/dict";
  import {mapGetters} from "vuex";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";

  export default {
    components: { xtTreeLzaySelect },
    props: {
      placeholder: {
        type: String
      },
      warehouse: {
        type: String,
        default: ""
      },
      warehouseName: {
        type: String,
        default: ""
      },
      deviceType: {
        type: String,
        default: ""
      },
      deviceCategory: {
        type: String,
        default: undefined
      },
      type: {
        type: String
      },
      changeType: {
        type: String
      },
      value: {
        type: [String, Number, Array],
        default: ""
      },
      bindId: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: true
      },
      deviceList: {
        type: Array,
        default: []
      },
      deviceList1: {
        type: Array,
        default: []
      },
      chuku: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        isExpand: false,
        deviceSourceList: [],
        isShow: true,
        searchForm: {
          current: 1,
          size: 20,
          // deviceStatusCode: '退运在库',
          deviceStatusCode: undefined,
          deviceCategoryCode: this.deviceCategory,
          deviceTypeCode: this.deviceType,

          ownerUnit: undefined,
          ownerUnitCode: undefined,
        },
        // 表格
        tableData: [
          // {eprNum: 2023},
          // {eprNum: 220},
        ],
        tableHeight: '550px',
        loading: false,
        total: 0,
        selectList: [],
        list: [],
        myValue: this.value,
        deviceCategoryCodeList: [],
        deviceTypeCodeList: [],
        deviceStatusCodeList: [],
      };
    },
    computed: {
      ...mapGetters(["userInfo", "userDetail"]),
      isVisible: {
        get() {
          return this.isVisible
        },
        set(val) {
          this.$emit("update:isShow", val)
        }
      }
    },
    created() {

      // 已报废 1105092729438209
      // 退运在库 1105092544888833
      // 待报废 1105089734705152
      // 在运 1105089449492480
      // 库存备用 1104999917879296
      //加载字典--设备类型
      //this.getDictList("deviceType");
      // this.getCmdbDictList("1097745969774592");
      this.getDictCmdbListPid('1097745969774592', this.deviceCategory) // 设备类型
      //加载字典--设备分类
      //this.getDictList("deviceCategory");
      this.getCmdbDictList("1097745625841664");
      //加载字典--设备状态
      this.getCmdbDictList("1103423111233536");
      //加载字典--设备来源
      this.getCmdbDictList("1102860579569664");

      if (this.type === 'operation') {
        //退运 仅查询  退运在库 库存备用
        this.searchForm.deviceStatusCode = '1105092544888833' //退运在库
      } else if (this.type === 'change') {
        //变更 仅查询  在运
        this.searchForm.deviceStatusCode = '1105089449492480' //在运
      } else if (this.type === 'outbound' && !this.chuku) {
        //退运 仅查询  退运在库 库存备用
        this.searchForm.deviceStatusCode = '1104999917879296' //库存备用
      } else if (this.type === 'returned') {
        //退运 仅查询  在运
        this.searchForm.deviceStatusCode = '1105089449492480' //在运
      }
      this.searchForm.area = this.userDetail.regionCode || '37'
      this.searchForm.ownerUnitCode = this.userDetail.ownerUnit || ''
      this.searchForm.ownerUnit = this.userDetail.ownerUnitName || ''
      this.searchForm.inWarehouseCode = this.warehouse || ''
      //加载数据
      this.getList()
    },
    methods: {
      getEntityUnit(val) {
        //选择领用单位 部门
        this.searchForm.ownerUnitCode = val.id
        this.searchForm.ownerUnit = val.fullName
        this.$refs.searchForm.$forceUpdate()
        this.$forceUpdate()
      },
      getEntityDept(val) {
        //选择领用单位 部门
        this.searchForm.propertyDeptCode = val.id
        this.searchForm.propertyDept = val.fullName
        this.$refs.searchForm.$forceUpdate()
        this.$forceUpdate()
      },

      isChange() {
        // 网络设备变更
        if (this.type === 'change' && this.changeType =='2') {
          return true
        }
      },
      select(val) {
        this.selectList = val;
      },
      // 设置表格高度
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body');
        this.tableHeight = pageBody[0].offsetHeight - 50 - 47 + 'px'
      },
      getCmdbDictList(code) {
        //加载cmdb字典
        let query = {}
        query.ciId = code || '1082372687986688';
        getDictCmdbList(query).then(res => {
          if (code === '1103423111233536') {
            // 设备状态
            this.deviceStatusCodeList = res.data;
            if (this.type === 'operation') {
              //退运 仅查询  退运在库 库存备用
              this.deviceStatusCodeList = this.deviceStatusCodeList.filter(el => (el.dictValue == '退运在库' || el.dictValue == '库存备用'))
            }
            if (this.type === 'outbound') {
              //出库 仅查询  退运在库 库存备用
              this.deviceStatusCodeList = this.deviceStatusCodeList.filter(el => (el.dictValue == '退运在库' || el.dictValue == '库存备用'))
            }
            if (this.type === 'change') {
              //变更 仅查询  在运
              // this.deviceStatusCodeList = this.deviceStatusCodeList.filter(el => (el.dictValue == '在运'))
            }
            if (this.type === 'returned') {
              //变更 仅查询  在运
              this.deviceStatusCodeList = this.deviceStatusCodeList.filter(el => (el.dictValue == '在运'))
            }
          } else if (code === '1097745625841664') {
            this.deviceCategoryCodeList = res.data;
          } else if (code === '1097745969774592') {
            this.deviceTypeCodeList = res.data;
          } else if (code === '1102860579569664') { // 设备来源
            this.deviceSourceList = res.data;
          }
        });
      },
      getDictCmdbListPid(ciId, pid) {
        getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
          if (ciId === '1097745969774592') { // 设备类型
            this.deviceTypeCodeList = res.data
          }
        });
      },
      deviceCategoryCodeChange(code) {
        //设备分类选择
        this.searchForm.deviceType = undefined;
        this.searchForm.deviceTypeCode = undefined;
        // this.deviceTypeList = this.deviceTypeListAll.filter(item => item.dictKey.startsWith(code));
        this.getDictCmdbListPid('1097745969774592', code) // 设备类型
      },
      deviceChange() {

      },
      getList() {
        this.loading = true

        if(this.type === 'change' && this.changeType =='1'){
          this.searchForm.isChange = true
        }

        getCmdbList(this.searchForm).then(res => {
          if (this.type === 'change') {
            let list = res.data.data;
            //暂时屏蔽交换机
            // const result = list.filter(item => item.deviceTypeCode != '1135308294128009');
            // const result1 = result.filter(item => item.deviceTypeCode != '1135308294128233');
            // this.tableData = result1.filter(item => item.deviceTypeCode != '1135308294127776');
            this.tableData = list;
            this.total = res.data.total;
            this.loading = false;
          } else {
            this.tableData = res.data.data;
            this.total = res.data.total;
            this.loading = false
          }
        }).catch(() => {
          this.loading = false
        })
      },
      handleSave(row) {

        if (this.deviceList.length > 0 && this.deviceList.some(el => el.deviceId == row.id)) {
          this.$message.warning('该设备已存在，请重新选择')
          return
        }

        //保存
        let list = [];
        list.push(row);
        this.$emit("setVal", list);
        this.isVisible = false
      },
      handleSubmit() {
        if (this.selectList.length == 0) {
          this.$message.warning("请选择一条数据!");
          return
        }

        let flag = this.deviceList.some(el => {
          return this.selectList.some(el2 => el2.id == el.deviceId);
        })
        if (flag) {
          this.$message.warning('该设备已存在，请重新选择');
          return
        }

        if (this.selectList.length > this.deviceList.length && this.type === 'outbound') { // 出库工单选择设备时做判断
          this.$message.warning('选择设备数量超出上限！');
          return
        }

        // for (const obj1 of this.selectList){
        //   for (const obj2 of this.deviceList1){
        //     if (obj1.id==obj2.id){
        //       this.$message.warning("设备已存在，请重新选择!")
        //       return;
        //     }
        //   }
        // }
        this.$emit("setVal", this.selectList);
        this.isVisible = false
      },
      handleExport() {
        if(this.selectList.length == 0){
          this.$message.warning('请选择导出设备！')
          return
        }

        //导出
          let arr = this.selectList.map(ele=> ele.id)
          // this.$confirm("是否导出数据?", "提示", {
          //   confirmButtonText: "确定",
          //   cancelButtonText: "取消",
          //   type: "warning"
          // }).then(() => {
            this.download(
              "/api/idevelop-device/device/change/list/export",
              {idList: arr},
              "设备列表.xlsx"
            )
          // });
        
      },
      // 查询
      handleQuery() {
        this.searchForm.current = 1;
        this.getList()
      },
      // 重置
      searchReset() {
        this.searchForm = {
          current: 1,
          size: 20,
          area: this.userDetail.regionCode || '37',
          ownerUnitCode: this.userDetail.ownerUnit || '',
          deviceStatusCode: undefined,
          deviceCategoryCode: this.deviceCategory,
          deviceTypeCode: this.deviceType,
        }

        if (this.type === 'operation') {
          //退运 仅查询  退运在库 库存备用
          this.searchForm.deviceStatusCode = '1105092544888833' //退运在库
        } else if (this.type === 'change') {
          //变更 仅查询  在运
          this.searchForm.deviceStatusCode = '1105089449492480' //在运
        } else if (this.type === 'outbound' && !this.chuku) {
          //退运 仅查询  退运在库 库存备用
          this.searchForm.deviceStatusCode = '1104999917879296' //库存备用
          this.searchForm.inWarehouseCode = this.warehouse || ''
        } else if (this.type === 'returned') {
          // 退运
          this.searchForm.deviceStatusCode = '1105089449492480' //在运
        }

        this.getList()
      },

      beforeCloseHandler() {
        //点击关闭按钮
        this.$emit('close')
        this.isVisible = false
      },
    }
  };
</script>
<style lang='scss' scoped>
  ::v-deep .el-dialog{
    margin: 0 auto 10px;
  }

  .wrap {
    width: 100%;
  }

  ::v-deep .el-select {
    width: 100% !important;
  }
</style>
