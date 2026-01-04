<!--<template>-->
<!--  <el-dialog :close-on-click-modal="false" :show-close="true" append-to-body :visible.sync="dialogFlag" title="选择维修设备" width="1500px" top="10vh" @close="closeThisDialog" v-el-drag-dialog>-->
<!--    <div style="height: 750px;">-->
<!--      <el-row>-->
<!--        <el-col :span="4">-->
<!--          <el-scrollbar id="categoryScrollbar" style="height:100%">-->
<!--            <el-tree id="categoryTree" ref="tree" :props="props" :data="treeData" :load="loadNode" :default-expanded-keys="defaultExpandedKeys" lazy highlight-current :accordion="true" node-key="ciId" check-strictly @node-click="nodeClick" :default-expand-all="false">-->
<!--              <div class="span-ellipsis" style="font-size:14px;" slot-scope="{node,data}">-->
<!--              <span :title="data.ciLabel">-->
<!--                {{ data.ciLabel }}-->
<!--              </span>-->
<!--              </div>-->
<!--            </el-tree>-->
<!--          </el-scrollbar>-->
<!--        </el-col>-->
<!--        <el-col :span="20">-->
<!--          <div class="page_form" style="padding-bottom: 15px">-->
<!--            <el-form ref="searchForm" :model="searchForm" label-width="130px" class="xt_search_form">-->
<!--              <el-row>-->
<!--                <el-col :span="8">-->
<!--                  <el-form-item label="标准全称">-->
<!--                    <el-input placeholder="请输入标准全称" @keyup.enter.native="getList" clearable v-model="searchForm.fullName" />-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="8">-->
<!--                  <el-form-item label="设备编码">-->
<!--                    <el-input placeholder="请输入设备编码" @keyup.enter.native="getList" clearable v-model="searchForm.deviceCode" />-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="8">-->
<!--                  <el-form-item label="IP地址">-->
<!--                    <el-input placeholder="请输入IP地址" @keyup.enter.native="getList" clearable v-model="searchForm.IP" />-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="8">-->
<!--                  <el-form-item label="MAC">-->
<!--                    <el-input placeholder="请输入MAC地址" @keyup.enter.native="getList" clearable v-model="searchForm.MAC" />-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="8">-->
<!--                  <el-form-item label="产权单位" prop="companyId" size="small">-->
<!--                    <xt-tree-lzay-select :formValue="searchForm.ownerUnit" :selectType="'CORP'" @getTreeItem="(v)=>getTreeItem(v)">-->
<!--                    </xt-tree-lzay-select>-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="8">-->
<!--                  <el-button type="primary" style="margin-left: 130px" @click="getList">查询</el-button>-->
<!--                  <el-button style="margin-right: 5px;" type="primary" plain @click="handleReset">重置</el-button>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </el-form>-->
<!--          </div>-->
<!--          <el-table ref="arrtTable" :data="tableData" stripe size="small" v-loading="tableLoading"  row-key="id" height="500px" style="overflow-y: auto" @selection-change="selectionChange">-->
<!--            <el-table-column type="selection" width="30" fixed="left"></el-table-column>-->
<!--            <el-table-column label="标准全称" prop="fullName" width="160" align="center" show-overflow-tooltip>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ !scope.row.fullName ? '-' : scope.row.fullName }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="设备名称" prop="deviceName" width="160" align="center" show-overflow-tooltip>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ !scope.row.deviceName ? '-' : scope.row.deviceName }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="设备编码" prop="deviceCode" width="200" align="center" show-overflow-tooltip></el-table-column>-->
<!--            <el-table-column label="设备来源" prop="deviceSource" width="120" align="center" show-overflow-tooltip></el-table-column>-->
<!--            <el-table-column label="设备状态" prop="deviceStatus" width="120" align="center" show-overflow-tooltip></el-table-column>-->
<!--            <el-table-column label="设备类型" prop="deviceType" width="120" align="center" show-overflow-tooltip></el-table-column>-->
<!--            <el-table-column label="IP地址" prop="IP" width="120" align="center" show-overflow-tooltip>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ !scope.row.IP ? '-' : scope.row.IP }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="MAC" prop="MAC" width="150" align="center" show-overflow-tooltip>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ !scope.row.MAC ? '-' : scope.row.MAC }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="品牌" prop="brand" width="120" align="center" show-overflow-tooltip></el-table-column>-->
<!--            <el-table-column label="型号" prop="deviceModel" width="120" align="center" show-overflow-tooltip></el-table-column>-->
<!--            <el-table-column label="出厂序列号" prop="sn" width="120" align="center" show-overflow-tooltip></el-table-column>-->
<!--            <el-table-column label="投运日期" prop="oprtDate" width="120" align="center" show-overflow-tooltip>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ !scope.row.oprtDate ? '-' : scope.row.oprtDate }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="领用单位" prop="receiveUnit" width="250" align="center" show-overflow-tooltip>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ !scope.row.receiveUnit ? '-' : scope.row.receiveUnit }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="领用部门" prop="receiveDept" width="150" align="center" show-overflow-tooltip>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ !scope.row.receiveDept ? '-' : scope.row.receiveDept }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="产权单位" prop="ownerUnit" width="250" align="center" show-overflow-tooltip>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ !scope.row.ownerUnit ? '-' : scope.row.ownerUnit }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--          <pagination :total="total" :page.sync="searchForm.pageNumber" :limit.sync="searchForm.pageSize" :pageSizes="[10,20,50]" @pagination="getList"/>-->
<!--          <el-button type="primary" style="margin-top: -30px;position: absolute;z-index: 9999;;" @click="addNeedAuthListFunc">加入维修列表</el-button>-->
<!--          <br>-->
<!--          <span>已选择待维修设备：<span v-for="(item, index) in selectedDeviceForOtherPage" :key="item.id">{{ getSelectedDeviceStr(item, index) }}</span></span>-->
<!--        </el-col>-->
<!--        <div class="submit_btn">-->
<!--          <el-button type="primary"  @click="submitThisPage">确认</el-button>-->
<!--          <el-button type="primary" plain @click="closeThisDialog">取消</el-button>-->
<!--        </div>-->
<!--      </el-row>-->

<!--    </div>-->
<!--  </el-dialog>-->
<!--</template>-->

<!--<script>-->
<!--import { queryDevice } from "@/api/xcnanr/idevelopOther"-->
<!--import { devBookCiTree } from "@/api/assets/devStandingBook"-->
<!--import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";-->

<!--export default {-->
<!--  name: "deviceDialog",-->
<!--  components: { xtTreeLzaySelect },-->
<!--  props: {-->
<!--    dialogFlag: {-->
<!--      type: Boolean,-->
<!--      default: false-->
<!--    },-->
<!--    authDeviceTypeList: {-->
<!--      type: Array,-->
<!--      default: null-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      total: 0,-->
<!--      searchForm: {},-->
<!--      tableData: [],-->
<!--      tableLoading: true,-->
<!--      props: { //树组件配置项-->
<!--        label: 'name',-->
<!--        isLeaf: 'leaf'-->
<!--      },-->
<!--      treeData: [],-->
<!--      defaultExpandedKeys: [],-->
<!--      dictForDeviceSource: [],-->
<!--      authDeviceTypeNameList: [],-->
<!--      authDeviceTypeCodeList: [],-->
<!--      // 表格复选框选择列表定义两个方法，一个用于当前页面的选择内容，一个用于全局选择内容-->
<!--      selectedDeviceForThisPage: [],-->
<!--      selectedDeviceForOtherPage: []-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    this.authDeviceTypeNameList = this.authDeviceTypeList === null ? null : this.authDeviceTypeList.map(d => d.dictValue)-->
<!--    this.initSearchForm()-->
<!--  },-->
<!--  methods: {-->
<!--    // 关闭当前探测光-->
<!--    closeThisDialog() {-->
<!--      this.$emit('closeDialog', null)-->
<!--    },-->
<!--    // 单位下拉框中选择值的事件赋值-->
<!--    getTreeItem(val) {-->
<!--      this.searchForm.ownerUnitCode = val.id-->
<!--      this.searchForm.ownerUnit = val.fullName-->
<!--    },-->
<!--    // 初始化或重置查询form表单-->
<!--    initSearchForm() {-->
<!--      this.authDeviceTypeCodeList = this.authDeviceTypeList === null ? null : this.authDeviceTypeList.map(d => d.dictKey).join(',')-->
<!--      this.searchForm = {-->
<!--        pageNumber: 1,-->
<!--        pageSize: 10,-->
<!--        ownerUnitCode: '',-->
<!--        ownerUnit: '',-->
<!--        fullName: '',-->
<!--        deviceCode: '',-->
<!--        IP: '',-->
<!--        MAC: '',-->
<!--        deviceCategoryCode: this.authDeviceTypeCodeList,-->
<!--        deviceTypeCode: this.authDeviceTypeCodeList-->
<!--      }-->
<!--    },-->
<!--    // 重置form表单事件-->
<!--    handleReset() {-->
<!--      this.initSearchForm()-->
<!--      this.getList();-->
<!--    },-->
<!--    // 加入待授权列表事件-->
<!--    addNeedAuthListFunc() {-->
<!--      if (this.selectedDeviceForThisPage.length === 0) {-->
<!--        this.$message({-->
<!--          message: '该分页未选择设备',-->
<!--          type: 'warning'-->
<!--        })-->
<!--        return-->
<!--      }-->
<!--      for (let i = 0; i < this.selectedDeviceForThisPage.length; i++) {-->
<!--        const selectedItem = this.selectedDeviceForThisPage[i]-->
<!--        if(this.authDeviceTypeList !== null) {-->
<!--          // 远程作业-->
<!--          if (!selectedItem['IP']) {-->
<!--            this.$message({-->
<!--              message: '选择设备的IP不能为空',-->
<!--              type: 'error'-->
<!--            })-->
<!--            return-->
<!--          }-->
<!--        } else {-->
<!--          // 现场作业-->
<!--          if (!selectedItem['fullName'] && !selectedItem['deviceName']) {-->
<!--            this.$message({-->
<!--              message: '选择设备的标准全称或设备名称不能为空',-->
<!--              type: 'error'-->
<!--            })-->
<!--            return-->
<!--          }-->
<!--        }-->

<!--        const tempList = this.selectedDeviceForOtherPage.filter(s => s['id'] === selectedItem['id'])-->
<!--        if (tempList.length === 0) {-->
<!--          this.selectedDeviceForOtherPage.push(selectedItem)-->
<!--        }-->
<!--      }-->
<!--      this.$refs['arrtTable'].clearSelection()-->
<!--      this.selectedDeviceForThisPage = []-->
<!--    },-->
<!--    // 表格选择复选框事件-->
<!--    selectionChange(selection) {-->
<!--      this.selectedDeviceForThisPage = selection-->
<!--    },-->
<!--    // 提交事件-->
<!--    submitThisPage() {-->
<!--      if (this.selectedDeviceForOtherPage.length === 0) {-->
<!--        this.$message({-->
<!--          message: '未选择维修设备',-->
<!--          type: 'warning'-->
<!--        })-->
<!--        return-->
<!--      }-->
<!--      this.$emit('submitDialog', this.selectedDeviceForOtherPage)-->
<!--      this.closeThisDialog()-->
<!--    },-->
<!--    // 已选择设备回显方法-->
<!--    getSelectedDeviceStr(item, index) {-->
<!--      let objectStr = ''-->
<!--      if(this.authDeviceTypeList !== null) {-->
<!--        objectStr = item['IP'] + (index === this.selectedDeviceForOtherPage.length - 1 ? '' : ', ')-->
<!--      } else {-->
<!--        if(item['fullName'] && item['fullName'].trim().length > 0) {-->
<!--          objectStr = item['fullName'] + (index === this.selectedDeviceForOtherPage.length - 1 ? '' : ', ')-->
<!--        } else {-->
<!--          objectStr = item['deviceName'] + (index === this.selectedDeviceForOtherPage.length - 1 ? '' : ', ')-->
<!--        }-->
<!--      }-->
<!--      return objectStr-->
<!--    },-->
<!--    // 加载-->
<!--    loadNode(node, resolve) {-->
<!--      let form = {-->
<!--        parentCiId: '',-->
<!--        isMenu: 1,-->
<!--        current: 1,-->
<!--        size: 999-->
<!--      }-->
<!--      if (node.level === 0) {-->
<!--        form.parentCiId = this.$store.state.common.govern.basicCiId-->
<!--      } else {-->
<!--        form.parentCiId = node.data.ciId-->
<!--      }-->
<!--      devBookCiTree(form).then(res => {-->

<!--        if (node.level == 0) {-->
<!--          this.defaultExpandedKeys = [res.data.records[0].ciId]-->
<!--        } else if (node.level === 1) {-->
<!--          if (this.fromAssets && this.fromAssets.cateciid) {-->
<!--            //从资产管理进入-->
<!--            setTimeout(() => {-->
<!--              this.defaultExpandedKeys = [this.fromAssets.cateciid];-->
<!--              let itm = res.data.records.find(a => a.ciId == this.fromAssets.cateciid);-->
<!--              this.nodeClick(itm, {level: 2});-->

<!--              //高亮显示-->
<!--              this.$refs.tree.setCurrentKey(this.fromAssets.cateciid)-->
<!--            }, 300);-->
<!--          } else {-->
<!--            this.nodeClick({level: 0});-->
<!--          }-->
<!--        } else if (node.level === 2) {-->
<!--          res.data.records.forEach(item => {-->
<!--            item.leaf = true-->
<!--          })-->
<!--          if (this.fromAssets && this.fromAssets.typeciid) {-->
<!--            //从资产管理进入-->
<!--            setTimeout(() => {-->
<!--              let itm = res.data.records.find(a => a.ciId == this.fromAssets.typeciid);-->
<!--              this.nodeClick(itm, {level: 3});-->

<!--              //高亮显示-->
<!--              this.$refs.tree.setCurrentKey(this.fromAssets.typeciid)-->
<!--            }, 300);-->
<!--          }-->
<!--        }-->
<!--        // 只需要网络设备和主机设备这两种大类型的分类-->
<!--        const types = res.data.records-->
<!--        let tempTypes = []-->
<!--        if (types[0].level !== 0 && this.authDeviceTypeNameList !== null) {-->
<!--          for (let i = 0; i < types.length; i++) {-->
<!--            const item = types[i]-->
<!--            if (this.authDeviceTypeNameList.indexOf(item.ciLabel) >= 0) {-->
<!--              tempTypes.push(item)-->
<!--            }-->
<!--          }-->
<!--        } else {-->
<!--          tempTypes = types-->
<!--        }-->
<!--        return resolve(tempTypes)-->
<!--      })-->
<!--    },-->
<!--    nodeClick(data) {-->
<!--      this.tableLoading = true-->
<!--      if (data.level === 0) {-->
<!--        this.searchForm.deviceCategoryCode = this.authDeviceTypeCodeList-->
<!--        this.searchForm.deviceTypeCode = this.authDeviceTypeCodeList-->
<!--        this.getList();-->
<!--      } else {-->
<!--        const categoryCode = data.deviceClaccify || '';-->
<!--        const typeCode = data.deviceType || '';-->
<!--        this.searchForm.deviceCategoryCode = categoryCode ? categoryCode : this.authDeviceTypeCodeList-->
<!--        this.searchForm.deviceTypeCode = typeCode ? typeCode : this.authDeviceTypeCodeList-->
<!--        this.getList()-->
<!--      }-->
<!--    },-->
<!--    getList() {-->
<!--      this.tableLoading = true-->
<!--      queryDevice(this.searchForm).then(res => {-->
<!--        this.tableData = res.data.data-->
<!--        this.tableLoading = false-->
<!--        this.total = res.data.total;-->
<!--      })-->
<!--    },-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--  /deep/#categoryScrollbar > .el-scrollbar__wrap {-->
<!--    margin-bottom: 0px!important;-->
<!--    margin-right: 0px!important;-->
<!--  }-->
<!--  /deep/.el-table::before {-->
<!--    display: none;-->
<!--  }-->
<!--</style>-->
