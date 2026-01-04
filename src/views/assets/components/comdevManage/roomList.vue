<template>
  <div class="roomList">
    <div class="perspective_btn" v-if="treeType == 2">
      <el-button size="mini" type="primary" plain @click="handlePerspective">
        <template v-if="!isPerspective">数据透视</template>
        <template v-else>取消数据透视</template>
      </el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="机房列表" name="0"
        v-if="nodeType != 'defaultWarehouse'"
      >
        <el-form
          class="xt_search_form"
          :model="searchForm"
          ref="searchForm"
          label-suffix=":"
          label-width="80px"
          size="small"

        >
          <el-row gutter="20">
            <el-col :span="8">
              <el-form-item label="机房名称">
                <el-input v-model="searchForm.roomName" clearable placeholder="请输入机房名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机房类型">
                <el-select v-model="searchForm.roomType" placeholder="请选择机房类型" clearable>
                  <el-option
                    v-for="dict in roomTypeList"
                    :key="dict.dictKey"
                    :label="dict.dictValue"
                    :value="dict.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机房功能">
                <el-select v-model="searchForm.roomFunction" placeholder="请选择机房功能" clearable>
                  <el-option
                    v-for="dict in roomFunctionList"
                    :key="dict.dictKey"
                    :label="dict.dictValue"
                    :value="dict.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机房位置">
                <el-input v-model="searchForm.roomLocation" clearable placeholder="请输入机房位置"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16" style="text-align: right;">

              <el-button type="primary" size="small" @click="search('room')">查 询</el-button>
              <el-button type="primary" plain size="small" @click="restForm('room')">重 置</el-button>
              <template v-if="nodeType === 'defaultWarehouse' || nodeType === 'defaultRoom'">
                <el-button type="primary" plain size="small" @click="addBtn('room')">新 增</el-button>
                <el-button type="primary" plain size="small" @click="editBtn('room')">修 改</el-button>
                <el-button type="danger" plain size="small" @click="delBtn('room')">删 除</el-button>
                <el-button type="primary" plain size="small" @click="exportBtn('room')">导 出</el-button>
                <el-button type="primary" size="small" @click="handleRooms">批量关联i6000机房</el-button>
              </template>
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
          @row-dblclick="showDetailRoom"
        >
          <el-table-column width="50" type="selection" align="center"></el-table-column>
          <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="机房名称" prop="roomName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="机房类型" prop="roomType" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <span>{{showDictLable(scope.row.roomType,roomTypeList)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="roomFunction" label="机房功能" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ showDictLable(scope.row.roomFunction, roomFunctionList) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="机房位置" prop="roomLocation" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="所属区域" prop="regionName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="I6000关联机房" prop="i6000Name" show-overflow-tooltip align="center"></el-table-column>
        </el-table>
        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getRoomList"
        />
      </el-tab-pane>
      <el-tab-pane label="仓库列表" name="1" v-if="nodeType != 'defaultRoom'">
        <el-form
          :model="warehouseSearchForm"
          ref="searchWarehouseForm"
          label-suffix=":"
          label-width="80px"
          size="small"
        >
          <el-row gutter="20">
            <el-col :span="6">
              <el-form-item label="仓库名称" prop="warehouseName">
                <el-input
                  placeholder="请输入仓库名称"
                  clearable
                  v-model="warehouseSearchForm.warehouseName"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="仓库编号" prop="warehouseId">
                <el-input
                  placeholder="请输入仓库编号"
                  clearable
                  v-model="warehouseSearchForm.warehouseId"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" size="small" @click="search('warehouse')">查 询</el-button>
              <el-button type="primary" plain size="small" @click="restForm('warehouse')">重 置</el-button>
              <template v-if="nodeType === 'defaultWarehouse' || nodeType === 'defaultRoom'">
                <el-button type="primary" plain size="small" @click="addBtn('warehouse')">新 增</el-button>
                <el-button type="primary" plain size="small" @click="editBtn('warehouse')">修 改</el-button>
                <el-button type="danger" plain size="small" @click="delBtn('warehouse')">删 除</el-button>
                <el-button type="primary" plain size="small" @click="exportBtn('warehouse')">导 出</el-button>
                <el-button type="primary" size="small" @click="handleWarehouses">批量关联i6000仓库</el-button>
              </template>

            </el-col>
          </el-row>
        </el-form>
        <el-table
          ref="warehouseTable"
          :data="warehouseTableData"
          stripe
          border
          size="small"
          :height="tableHeight"
          v-loading="tableLoading"
          @row-dblclick="showDetailWare"
        >
          <el-table-column type="selection" width="30"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="warehouseId" label="仓库编号" width="200" align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="warehouseName" label="仓库名称" width="200" align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="i6000Name" label="I6000关联仓库" width="200" align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="ownerUnit" label="所属单位" width="200" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{showDictLable(scope.row.ownerUnit,oprtDeptList)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="warehouseStatus" label="仓库状态" width="200" align="center" show-overflow-tooltip
                           :formatter="changeStatus"></el-table-column>
          <el-table-column prop="chargeUser" label="负责人员" width="200" align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="phoneNum" label="联系电话" width="200" align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="address" label="所在位置" width="200" align="center"
                           show-overflow-tooltip></el-table-column>
        </el-table>
        <pagination
          :total="warehouseTotal"
          :page.sync="warehouseSearchForm.current"
          :limit.sync="warehouseSearchForm.size"
          @pagination="getWarehouseList"
        />
      </el-tab-pane>
    </el-tabs>


    <el-dialog :close-on-click-modal="false"
               :before-close="() => isShow=false"
               :show-close="true"
               append-to-body
               :visible.sync="isShow"
               title="批量关联i6000机房"
               width="500px"
               top="35vh"
               v-el-drag-dialog>
      <el-form :model="form" :rules="rules" ref="dataForm" class="xt_form" label-width="120px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="I6000关联机房" prop="i6000Uuid">
              <el-select v-model="form.i6000Uuid" placeholder="请选择I6000关联机房" clearable>
                <el-option v-for="dict in roomI6000" :key="dict.uuid" :label="dict.name"
                           :value="dict.uuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="form-btn">
        <el-button type="primary" @click="onSubmit" :loading="saveLoading" v-show="!isChange">提交</el-button>
        <el-button
          plain
          class="border-btn"
          @click="isShow=false"
        >返 回
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"
               :before-close="() => isWarehouseShow=false"
               :show-close="true"
               append-to-body
               :visible.sync="isWarehouseShow"
               title="批量关联i6000仓库"
               width="500px"
               top="35vh"
               v-el-drag-dialog>
      <el-form :model="form" :rules="rules" ref="warehouseDataForm" class="xt_form" label-width="120px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="I6000关联仓库" prop="i6000Uuid">
              <el-select v-model="form.i6000Uuid" placeholder="请选择I6000关联仓库" clearable>
                <el-option v-for="dict in warehouseI6000List" :key="dict.uuid" :label="dict.name"
                           :value="dict.uuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="form-btn">
        <el-button type="primary" @click="onSubmitWarehouse" :loading="saveLoading" v-show="!isChange">提交</el-button>
        <el-button
          plain
          class="border-btn"
          @click="isWarehouseShow=false"
        >返 回
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getRoomList, removeRoom, getI6000RoomList, batchSubmit} from "@/api/device/resoureroom";
  import {getDictList} from "@/api/dict";
  import {getList, remove, getI6000WarehouseList, batchWarehouseSubmit} from "@/api/device/warehouse";


  export default {
    props: ["areaId", "areaName", "nodeType", "treeType", "areaCode"],
    data() {
      return {
        isShow: false,
        isWarehouseShow: false,
        form: {
          i6000Uuid: ''
        },
        rules: {
          i6000Uuid: [
            {required: true, message: 'I6000关联机房不能为空', trigger: 'change'}
          ]
        },
        roomI6000: [],
        warehouseI6000List: [],
        saveLoading: false,
        activeName: '0',
        isPerspective: false,
        searchForm: {
          current: 1,
          size: 20,
        },
        warehouseSearchForm: {
          current: 1,
          size: 20,
        },
        tableData: [],
        warehouseTableData: [],
        tableHeight: undefined,
        tableLoading: false,
        total: 0,
        warehouseTotal: 0,

        roomTypeList: [],
        roomFunctionList: [],

        //新增修改表单类型判断
        showType: '',
      }
    },
    watch: {
      areaId() {
        this.activeName = '0'
      },
      '$store.state.pageUpdate.listUpdate'() {
        this.getRoomList()
        this.getWarehouseList()
      },
      nodeType() {
        if (this.nodeType == 'corp') { // 初始单位

        } else if (this.nodeType == 'defaultWarehouse') {
          this.activeName = '1'
          this.getWarehouseList()
        } else {
          this.activeName = '0'
          this.tableData = []
          this.getRoomList()

        }
      }
    },
    mounted() {
      if (this.nodeType == 'defaultWarehouse') this.activeName = '1'
      else this.activeName = '0'
      //字典加载
      this.getDictList("room_type");
      this.getDictList("room_function");
      setTimeout(() => {
        this.setTableHeight()
      }, 200);
      // this.$nextTick(() => {
      //   this.setTableHeight()
      // });

      this.getRoomList();
      this.getWarehouseList();
      this.getI6000Rooms();
      this.getI6000WarehouseList();
    },
    methods: {
      onSubmit() {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.saveLoading = true;

            let current = this.roomI6000.filter(el=> el.uuid == this.form.i6000Uuid)[0];
            let selectList = this.$refs.table.selection;
            let ids = selectList.map(ele=> ele.uuid);
            ids = ids.join(',');
            let params = {
              roomWarehouseIds: ids,
              i6000Uuid: current.uuid,
              i6000Name: current.name
            };
            batchSubmit(params).then(() => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });

              this.saveLoading = false;
              this.isShow=false;
              this.search('room');
            }).catch(() => {
              this.saveLoading = false
            });
          } else {
            // this.$message.warning("请将信息填写完整!")
          }
        })

      },
      getI6000Rooms() {
        getI6000RoomList().then(res => {
          if (res.code === 200) {
            this.roomI6000 = res.data;
          }
        });
      },
      onSubmitWarehouse() {
        this.$refs.warehouseDataForm.validate((valid) => {
          if (valid) {
            this.saveLoading = true;

            let current = this.warehouseI6000List.filter(el=> el.uuid == this.form.i6000Uuid)[0];
            let selectList = this.$refs.warehouseTable.selection;
            let ids = selectList.map(ele=> ele.uuid);
            ids = ids.join(',');
            let params = {
              roomWarehouseIds: ids,
              i6000Uuid: current.uuid,
              i6000Name: current.name
            };
            batchWarehouseSubmit(params).then(() => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });

              this.saveLoading = false;
              this.isWarehouseShow=false;
              this.search('warehouse')
            }).catch(() => {
              this.saveLoading = false
            });
          } else {
            // this.$message.warning("请将信息填写完整!")
          }
        })

      },
      getI6000WarehouseList() {
        getI6000WarehouseList().then(res => {
          if (res.code === 200) {
            this.warehouseI6000List = res.data;
          }
        });
      },

      showDetailRoom(row) {
        //双击跳转详情页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: 'roomForm',
            routerTitle: '机房详情',
            id: row.uuid,
            showType: '详情'
          }
        });
      },
      showDetailWare(row) {
        //双击跳转详情页面
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: 'warehouseForm',
            routerTitle: '仓库详情',
            id: row.uuid,
            showType: '详情'
          }
        });
      },
      getDictList(code) {
        getDictList(code).then(res => {
          if (code === "room_type") { // 机房类型
            this.roomTypeList = res.data;
          } else if (code === 'room_function') { // 机房功能
            this.roomFunctionList = res.data;
          }
        });
      },
      showDictLable(code, dictList) {
        //字典回显
        if (dictList != null && code != '') {
          let items = dictList.filter(item => item.dictKey == code);
          if (items != null && items.length > 0) {
            return items[0].dictValue;
          }
        }
        return code;
      },
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 55 - 48 - 100 + 'px'
      },
      // 机房
      getRoomList() {
        this.tableLoading = true
        this.searchForm.regionCode = ''
        this.searchForm.maintenanceUnit = ''
        if (this.treeType == 1 || this.isPerspective) {
          this.searchForm.regionCode = this.isPerspective ? this.areaCode : this.areaId
        } else this.searchForm.maintenanceUnit = this.areaId
        getRoomList(this.searchForm).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.tableLoading = false
        })
      },
      // 仓库
      getWarehouseList() {
        this.tableLoading = true
        this.warehouseSearchForm.regionCode = ''
        this.warehouseSearchForm.ownerUnitId = ''
        if (this.treeType == 1 || this.isPerspective) {
          this.warehouseSearchForm.regionCode = this.isPerspective ? this.areaCode : this.areaId
        } else this.warehouseSearchForm.ownerUnitId = this.areaId
        getList(this.warehouseSearchForm).then(res => {
          this.warehouseTableData = res.data.records
          this.warehouseTotal = res.data.total
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      //状态
      changeStatus(row) {
        if (row.warehouseStatus == '0') {
          return "停用"
        } else if (row.warehouseStatus == '1') {
          return "启用"
        }
      },
      // 查询
      search(val) {
        if (val == 'room') {
          this.searchForm.current = 1
          this.getRoomList()
        } else if (val == 'warehouse') {
          this.warehouseSearchForm.current = 1
          this.getWarehouseList()
        }
      },
      // 重置
      restForm(val) {
        if (val == 'room') {
          this.searchForm = {
            current: 1,
            size: 20,
          }
          this.getRoomList()
        } else if (val == 'warehouse') {
          this.warehouseSearchForm = {
            current: 1,
            size: 20,
          }
          this.getWarehouseList()
        }
      },
      //获取id串
      ids(list) {
        let idList = [];
        list.forEach(ele => {
          idList.push(ele.uuid);
        });
        return idList.join(",");
      },
      addBtn(val) {
        this.showType = '新增'
        let componentName = ''
        let routerTitle = ''
        if (val == 'room') {
          componentName = 'roomForm';
          routerTitle = '机房新增'
        } else if (val == 'warehouse') {
          componentName = 'warehouseForm'
          routerTitle = '仓库表单'
        }
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: componentName,
            routerTitle: routerTitle,
            areaId: this.areaId,
            areaName: this.areaName,
            showType: this.showType,
            treeType: this.treeType
          }
        });
      },
      editBtn(val) {
        // let selectList = this.$refs.table.selection
        let selectList = []
        if (val == 'room') {
          selectList = this.$refs.table.selection
        } else if (val == 'warehouse') {
          selectList = this.$refs.warehouseTable.selection
        }
        if (selectList.length != 1) {
          this.$message({
            type: 'warning',
            message: '请只选择一条数据修改！'
          });
          return
        }
        this.showType = '修改'
        let componentName = ''
        let routerTitle = ''
        let id = selectList[0].uuid;
        if (val == 'room') {
          componentName = 'roomForm';
          routerTitle = '机房修改'
        } else if (val == 'warehouse') {
          componentName = 'warehouseForm'
          routerTitle = '仓库表单'
        }
        this.$router.push({
          path: '/detailRoute',
          query: {
            componentName: componentName,
            routerTitle: routerTitle,
            areaId: this.areaId,
            showType: this.showType,
            id: id,
            treeType: this.treeType
          }
        });
      },
      delBtn(val) {
        let selectList = []
        let removeApi = null
        if (val == 'room') {
          selectList = this.$refs.table.selection
          removeApi = removeRoom
        } else if (val == 'warehouse') {
          selectList = this.$refs.warehouseTable.selection
          removeApi = remove
        }

        if (selectList == 0) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的数据！'
          });
          return
        }

        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = this.ids(selectList);
          removeApi(ids).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            this.$emit('delNode', selectList)
            if (val == 'room') this.getRoomList()
            else this.getWarehouseList()
          })
        })
      },
      exportBtn(val) {

        if (val === 'room') {
          let params = {};
          let selectList = this.$refs.table.selection;
          params = {
            ids: this.ids(selectList),
            ...this.searchForm,
          };
          this.download(
            "/api/idevelop-device/resource/room/exportExcel",
            params,
            "机房列表.xlsx"
            // ,"导入模板生成中..."
          );
        } else if (val === 'warehouse') {
          let params = {};
          let selectList = this.$refs.warehouseTable.selection;
          params = {
            ids: this.ids(selectList),
            ...this.warehouseSearchForm,
          };
          this.download(
            "/api/idevelop-device/warehouse/exportExcel",
            params,
            "仓库列表.xlsx"
            // ,"导入模板生成中..."
          );
        }
      },
      handleRooms(){
        this.form.i6000Uuid = '';
        if(this.$refs.dataForm){
          this.$refs.dataForm.resetFields()
        }
        let selectList = this.$refs.table.selection;
        if (selectList.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择关联机房！'
          });
          return
        }
        this.isShow = true
      },
      handleWarehouses(){
        this.form.i6000Uuid = '';
        if(this.$refs.warehouseDataForm){
          this.$refs.warehouseDataForm.resetFields()
        }
        let selectList = this.$refs.warehouseTable.selection;
        if (selectList.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择关联仓库！'
          });
          return
        }
        this.isWarehouseShow = true
      },
      handlePerspective() {
        this.isPerspective = !this.isPerspective
        this.getRoomList()
        this.getWarehouseList()
      },


    }
  }
</script>

<style lang="scss" scoped>
  .el-col-6, .el-col-18 {
    height: 40px;
  }

  .roomList {
    position: relative;

    .perspective_btn {
      position: absolute;
      right: 0px;
      z-index: 999
    }
  }
</style>
