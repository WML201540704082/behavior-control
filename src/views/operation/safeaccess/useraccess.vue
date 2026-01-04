<template>
  <basic-container>
    <div class="page_form">
      <el-form ref="queryForm" :model="searchForm" label-width="105px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <div>
              <el-form-item label="所属单位">
                <!--                <el-select v-model="searchForm.company" size="mini" clearable placeholder="">-->
                <!--                  <el-option v-for="item in unitlList" :value="item.id" :label="item.deptName"-->
                <!--                             :key="item.id"></el-option>-->
                <!--                </el-select>-->
                <xt-tree-lzay-select :placeholder="'请选择单位'"
                                     :form-value="unitName"
                                     :show-full-name="false"
                                     :is-user-unit="true"
                                     :select-type="'CORP'"
                                     @getTreeItem="(v)=>{getOwnerUnit(v)}"></xt-tree-lzay-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="MAC地址:">
                <el-input
                  v-model="searchForm.macAddress" placeholder="" size="mini"
                  style="width:100%;" clearable></el-input>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div>
              <el-form-item label="ip地址:">
                <el-input
                  v-model="searchForm.ipAddress" placeholder="" size="mini"
                  style="width:100%;" clearable></el-input>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div>
              <el-form-item label="设备编码:">
                <el-input
                  v-model="searchForm.deviceCode" placeholder="" size="mini"
                  style="width:100%;" clearable></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="设备分类:">
                <el-select v-model="searchForm.deviceCategory" clearable placeholder="请选择设备分类" @change="deviceCategoryChange">
                  <el-option
                    v-for="item in deviceCategoryList"
                    :value="item.dictKey"
                    :key="item.dictKey"
                    :label="item.dictValue"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="设备类型:">
                <el-select v-model="searchForm.deviceType" clearable placeholder="请选择设备类型" :disabled="!searchForm.deviceCategory">
                  <el-option
                    v-for="item in deviceLeixingList"
                    :value="item.dictKey"
                    :key="item.dictKey"
                    :label="item.dictValue"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="认证用户:">
                <el-input
                  v-model="searchForm.approveuUser" placeholder="" size="mini"
                  style="width:100%;" clearable></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="使用人:">
                <el-input
                  v-model="searchForm.miChargeUser" placeholder="" size="mini"
                  style="width:100%;" clearable></el-input>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div>
              <el-form-item label="责任人:">
                <el-input
                  v-model="searchForm.miUser" placeholder="" size="mini"
                  style="width:100%;" clearable></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="认证状态">
                <el-select v-model="searchForm.isAccess" size="mini" clearable placeholder="">
                  <el-option v-for="item in isAccessSwitchList" :key="item.dictKey" :label="item.dictValue"
                             :value="item.dictKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form-item label="所属子网">
                <subSelect placeholder="" v-model="searchForm.subnetName" @change="subChange1"></subSelect>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="page_body">
      <el-row>
        <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
          <div slot="rightBtnBox">
            <el-button type="primary"
                       @click="handleQuery">查询
            </el-button>
            <el-button style="margin-left: 5px;" type="primary" plain
                       @click="handleReset">重置
            </el-button>
            <el-button type="primary" plain
                       @click="handleIpPool">IP地址池管理
            </el-button>
            <el-button type="primary" plain
                       @click="handleSyncRadius">同步Radius数据
            </el-button>

            <el-button type="primary" plain
                       icon="el-icon-smoking"
                       :loading="netWorkLoading"
                       :disabled="netWorkDisabled"
                       @click="handleNetWork">恢复入网
            </el-button>
            <el-button type="primary" plain @click="handleExport">导出</el-button>
          </div>
        </formTitle>
      </el-row>
      <el-table
        ref="dataTable"
        stripe
        size="small"
        :data="dataList"
        :height="tableHeight"
        v-loading="tableLoading"
        @row-dblclick="showSwitcheInfo"
        @row-click="rowClick"
        @selection-change="selectionChange">
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="companyName" label="所属单位" width="150px" sortable></el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="deptName" label="所属部门" width="150px" sortable></el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="deviceCode" label="设备编码" sortable width="200px"></el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="subnetName" label="所属子网" sortable width="150px"></el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="deviceTypeName" label="设备类型" sortable width="150px"></el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="macAddress" label="MAC地址" sortable width="150px"></el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="ipAddress" label="IP地址" sortable width="150px"></el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="address" label="安装地点" width="150px" sortable></el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="phone" label="联系电话" sortable width="150px"></el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="approveuUser" label="认证用户" sortable width="150px"></el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="approveuPassword" label="认证密码" sortable width="150px"></el-table-column>

        <el-table-column show-overflow-tooltip prop="code" label="状态" width="100px">
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.code, swStateList) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip
                          prop="acceptMan" label="受理人" sortable width="150px"></el-table-column>
        <el-table-column show-overflow-tooltip
                          prop="startTime" label="受理时间" sortable width="150px"></el-table-column> -->
        <el-table-column show-overflow-tooltip
                         prop="startTime" label="开始入网时间" sortable width="150px"></el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="allowDays" label="允许入网时长(天)" sortable width="160px"></el-table-column>
        <el-table-column show-overflow-tooltip prop="is802" label="认证方式" width="150px">
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.is802, Is802List) }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="isAccess" label="终端是否认证" width="150px">
          <template slot-scope="scope">
            <span>{{ showDictLable(scope.row.isAccess, isAccessSwitchList) }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="miUser" label="责任人" sortable width="150px"></el-table-column>

        <el-table-column show-overflow-tooltip
                         prop="miChargeUser" label="使用人" sortable width="150px"></el-table-column>
        <!-- <el-table-column show-overflow-tooltip
                          prop="nasipAddress" label="交换机地址" sortable width="150px"></el-table-column>
        <el-table-column show-overflow-tooltip
                             prop="port" label="交换机接口" sortable width="150px"></el-table-column> -->
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="getList"/>
    </div>

    <!-- IP地址池管理 -->
    <ipPoolList
      v-if="showIpPoolList"
      :isShow="showIpPoolList"
      :arrtId="arrtId"
      @close="showIpPoolList = false"
    ></ipPoolList>
  </basic-container>
</template>

<script>
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
import subSelect from "@/components/subSelect";
import {getDictList, getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import ipPoolList from './components/subnet/ipPoolList'
import {userList, batchSyncRadius, accessNetWork} from "@/api/operation/safeaccess/useraccess";
import {mapGetters, mapState} from "vuex";

export default {
  components: {
    ipPoolList,
    subSelect,
    xtTreeLzaySelect
  },
  data() {
    return {
      isAccessSwitchList: [],
      swStateList: [],
      optionProps2: {
        value: 'code',
        label: 'label',
        children: 'children',
        checkStrictly: true,
        emitPath: false,
        expandTrigger: 'hover'
      },
      Is802List: [],

      searchForm: {
        current: 1,
        size: 20
      },

      dataList: [],
      selectionList: [],
      total: 0,
      tableLoading: false, //表格加载
      tableHeight: undefined,
      // 弹窗
      arrtId: '',

      deviceCategoryList: [],
      deviceTypeList: [],
      deviceLeixingList: [],
      showIpPoolList: false,

      unitName: null,

      netWorkLoading: false,
      netWorkDisabled:true,
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    // deviceTypeListCom(){
    //   return this.deviceTypeList.filter(el => el.dictKey.includes(this.searchForm.deviceCategory))
    // }
  },
  mounted() {
    this.setPageContentHeight()
    this.setTableHeight()
    this.getList()

    // //加载字典--WBS元素
    //加载字典--工单状态
    this.getDictList("isAccessSwitch");
    //加载字典--认证方式
    this.getDictList("Is802");
    //加载字典--入库仓库
    this.getDictList("swState");

    // 加载字典
    this.getDictCmdbList('1102860579569664') // 设备来源
    this.getDictCmdbList('1097745625841664') // 设备分类
    this.getDictCmdbList('1097745969774592') // 设备类型
    this.getDictCmdbList('1084068218601472') // 电压等级
  },
  methods: {
    // 导出
    handleExport() {
      let fileName = `终端设备准入管理_${this.getTodayTime()}.xlsx`;
      this.download(
        "/api/idevelop-device/safe/access/user/export",
        this.searchForm,
        fileName
      );
    },

    getTodayTime(day = 0) {
      let date = new Date()
      date.setDate((new Date().getDate() + day));
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();

      m = (m >= 10) ? m : "0" + m;
      d = (d >= 10) ? d : "0" + d;

      hour = (hour >= 10) ? hour : "0" + hour;
      min = (min >= 10) ? min : "0" + min;

      let timeStr = date.getTime().toString();
      let tRand = timeStr.substring(timeStr.length - 2, timeStr.length);

      return `${y}${m}${d}${hour}${min}${tRand}`;
    },
    //加载单位
    initUserUnit(list) {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].type != 'CORP') {
          list.splice(i, 1)
        }
        if (list[i] && list[i].children) {
          this.initUserUnit(list[i].children)
        }
      }
    },
    deviceCategoryChange(val) {
      this.getDeviceLeiXing('1097745969774592', val) // 设备类型

      if (this.searchForm.deviceType) {
        this.searchForm.deviceType = null;
      }
    },
    getDeviceLeiXing(ciId, pid) {
      getDictCmdbListPid({ciId: ciId, pid: pid}).then(res => {
        this.deviceLeixingList = res.data;
      });
    },

    showSwitcheInfo(row) {
      this.$router.push({
        path: '/detailRoute',
        query: {
          arrtId: row.id,
          componentName: 'userInfo',
          routerTitle: '查看',
          showType: 'check'
        }
      });
    },
    handleNetWork() {
      if (this.selectionList.length == 0) {
        this.$alert('请先选择一条数据', '提醒', {
          confirmButtonText: this.$t("submitText"),
          cancelButtonText: this.$t("cancelText"),
          type: "warning"
        });
        return;
      }
      this.netWorkLoading = true;
      accessNetWork({id: this.selectionList[0].id}).then(res => {
        this.$message.success('恢复入网成功');
      }).finally(() => {
        this.netWorkLoading = false;
      });
    },
    handleSyncRadius() {
      if (this.selectionList.length == 0) {
        this.$message({
          message: '请选择数据',
          type: 'warning'
        })
        return
      }
      // let params = {
      //   ids: this.selectionList.map(el => el.id)
      // }
      batchSyncRadius(this.selectionList.map(el => el.id)).then(resp => {
        if (resp.data) {
          this.$message({
            message: 'radius子网数据同步成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: 'radius子网数据同步失败！',
            type: 'error'
          })
        }
      })
    },
    handleIpPool() {
      if (this.selectionList.length == 0) {
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        })
        return
      }
      this.arrtId = this.selectionList[0].subnetId
      this.showIpPoolList = true
    },
    deviceIdChanged(val) {
      this.searchForm.deviceId = val
    },


    wbsChange(val, type) {
      if (type == 'wbsElement') {
        this.searchForm.wbsProject = val.wbsName
      } else if (type == 'wbsProject') {
        this.searchForm.wbsElement = val.wbsCode
      }
    },

    getDictCmdbList(ciId) {
      //加载字典
      getDictCmdbList({ciId: ciId}).then(res => {
        if (ciId === '1097745625841664') { // 设备分类
          this.deviceCategoryList = res.data;
        } else if (ciId === '1097745969774592') { // 设备类型
          this.deviceTypeList = res.data;
        }
      });
    },

    getDictList(code) {
      //加载字典
      getDictList(code).then(res => {
        if (code === 'Is802') {
          this.Is802List = res.data;
        } else if (code === 'isAccessSwitch') {
          this.isAccessSwitchList = res.data;
        } else if (code === 'swState') {
          this.swStateList = res.data;
        }
      });
    },
    showDictLable(code, dictList) {
      //字典回显
      if (dictList != null && code !== '') {
        let items = dictList.filter(item => item.dictKey == code);
        if (items != null && items.length > 0) {
          return items[0].dictValue;
        }
      }
      return code;
    },
    subChange1(data) {
      this.searchForm.subnetId = data.id
      this.searchForm.subnetName = data.subnetName;
    },
    handleQuery() {
      this.getList()
    },
    handleReset() {
      this.searchForm = {
        current: 1,
        size: 20
      }
      this.getList()
    },
    handleAdd() {
      // this.$router.push({path: '/device/devInBoundDetail'});
      this.$router.push({
        path: '/detailRoute',
        query: {
          // id: row.id,
          componentName: 'devInBoundDetail',
          routerTitle: '入库管理详情'
        }
      });
    },


    handleView(row) {
      this.$router.push({
        path: '/detailRoute',
        query: {
          id: row.id,
          isView: true,
          componentName: 'devInBoundDetail',
          routerTitle: '入库管理详情'
        }
      });
    },
    handleEdit(row) {
      this.$router.push({
        path: '/detailRoute',
        query: {
          id: row.id,
          componentName: 'devInBoundDetail',
          routerTitle: '入库管理详情'
        }
      });
    },
    rowClick(row) {
      //只能选择一行，选择其他，清除上一行
      if (this.$refs.dataTable.selection.length > 0) {
        let del_row = this.$refs.dataTable.selection.shift();
        this.$refs.dataTable.toggleRowSelection(del_row, false) //设置这一行取消选中
      }
      if (!row.disabled) {
        this.$refs.dataTable.toggleRowSelection(row);
      }
    },
    selectionChange(selection) {
      //点击选择事件
      if (selection.length > 1) {
        let del_row = selection.shift()
        this.$refs.dataTable.toggleRowSelection(del_row, false) //设置这一行取消选中
      }
      this.selectionList = selection;

      if (this.selectionList.length == 1) {
        if (this.selectionList[0].disableStatus == '1') {
          this.netWorkDisabled = false;
        } else {
          this.netWorkDisabled = true;
        }
      } else {
        this.netWorkDisabled = true;
      }
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 110) + 'px'
    },
    getList() {
      this.tableLoading = true
      userList(this.searchForm).then(res => {
        this.dataList = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      })
    },
    getOwnerUnit(val) {
      this.searchForm.company = val.id;
      this.unitName = val.deptName;
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .confirmClass {
  padding-bottom: 15px;

  .el-message-box__status {
    position: absolute;
    top: 21%;
  }

  .el-message-box__message {
    font-size: 16px;
    font-weight: bold;

    div {
      font-size: 14px;
      margin-top: 10px;
      font-weight: normal;
    }
  }

  .el-button--primary {
    color: #FFF;
    background-color: #f56c6c;
    border-color: #f56c6c;
  }

  .el-button--primary:focus, .el-button--primary:hover {
    background: #f78989;
    border-color: #f78989;
    color: #FFF;
  }
}
</style>
<style lang="scss" scoped>
::v-deep .list_btn {
  padding: 9px 5px !important;
}

::v-deep .btn_red {
  color: red;
}

::v-deep .page_form {
  // .el-form-item {
  //   margin-bottom: 0px;
  // }
  // .el-col{
  //   margin-bottom: 0;
  // }
  // .el-date-editor{
  //   width: 100%;
  // }
}

.title_line {

  position: relative;
  padding-left: 15px;
  font-size: 15px;
  font-weight: bold;
  height: 20px;

  &::before {
    content: '';
    position: absolute;
    left: 0px;
    width: 0px;
    height: 100%;
    border-left: 4px solid;
    z-index: 9;
    margin-right: 4px;
    color: #409EFF;
  }


}
</style>
