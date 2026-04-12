<template>
  <el-dialog
    :close-on-click-modal="false"
    :show-close="true"
    append-to-body
    :visible.sync="dialogFlag"
    :title="'选择待' + title + '设备'"
    width="1500px"
    top="10vh"
    @close="closeThisDialog"
    v-el-drag-dialog>
    <div style="height: 750px;">
      <el-row>
        <el-col :span="4">
          <el-scrollbar id="categoryScrollbar" style="height:100%">
            <el-tree
              id="categoryTree"
              ref="tree"
              :props="props"
              :data="treeData"
              :load="loadNode"
              :default-expanded-keys="defaultExpandedKeys"
              lazy
              highlight-current
              :accordion="true"
              node-key="ciId"
              check-strictly
              @node-click="nodeClick"
              :default-expand-all="false"
            >
              <div class="span-ellipsis" style="font-size:14px;" slot-scope="{node,data}">
              <span :title="data.ciLabel">
                {{ data.ciLabel }}
              </span>
              </div>
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="20">
          <div class="page_form" style="padding-bottom: 15px">
            <el-form ref="searchForm" :model="searchForm" label-width="80px" class="xt_search_form">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="标准全称">
                    <el-input
                      placeholder="请输入标准全称"
                      clearable
                      v-model="searchForm.fullName"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="设备编码">
                    <el-input
                      placeholder="请输入设备编码"
                      clearable
                      v-model="searchForm.deviceCode"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="IP地址">
                    <el-input
                      placeholder="请输入IP地址"
                      clearable
                      @keyup.enter.native="getList"
                      v-model="searchForm.IP"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="MAC">
                    <el-input
                      placeholder="请输入MAC地址"
                      clearable
                      v-model="searchForm.MAC"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="产权单位" prop="companyId" size="small">
                    <xt-tree-lzay-select :formValue="searchForm.ownerUnit"
                                         :selectType="'CORP'"
                                         @getTreeItem="(v)=>getTreeItem(v)">
                    </xt-tree-lzay-select>
                  </el-form-item>
                </el-col>
                <el-col :span="18" align="right">
                  <el-button type="primary" @click="getList">查询</el-button>
                  <el-button style="margin-right: 5px;" type="primary" plain @click="handleReset">重置</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-table
            ref="arrtTable"
            :data="tableData"
            stripe
            size="small"
            v-loading="tableLoading"
            @selection-change="selectionChange"
            row-key="id"
            height="500px"
            style="overflow-y: auto"
          >
            <el-table-column type="selection" width="30" fixed="left"></el-table-column>
            <el-table-column label="标准全称" prop="fullName" width="160" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备名称" prop="deviceName" width="160" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备编码" prop="deviceCode" width="200" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备来源" prop="deviceSource" width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备状态" prop="deviceStatus" width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备类型" prop="deviceType" width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="IP地址" prop="IP" width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="MAC" prop="MAC" width="150" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="型号" prop="deviceModel" width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="出厂序列号" prop="sn" width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="投运日期" prop="oprtDate" width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="领用单位" prop="receiveUnit" width="250" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="领用部门" prop="receiveDept" width="150" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="产权单位" prop="ownerUnit" width="250" align="center" show-overflow-tooltip></el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page.sync="searchForm.pageNumber"
            :limit.sync="searchForm.pageSize"
            :pageSizes="[10,20,50]"
            @pagination="getList"/>
          <span v-if="selectedDeviceForOtherPage.length === 0" style="color:red">{{ '未选择' + title + '设备' }}<span v-for="(item, index) in selectedDeviceForOtherPage" :key="item.id">{{ getSelectedDeviceStr(item, index) }}</span></span>
          <span v-else>{{ '已选择待' + title + '设备：' }}<span v-for="(item, index) in selectedDeviceForOtherPage" :key="item.id">{{ getSelectedDeviceStr(item, index) }}</span></span>
        </el-col>
        <div style="margin-left: 700px;">
          <el-button type="info" @click="closeThisDialog">取消</el-button>
          <el-button type="primary" @click="submitThisPage">确认</el-button>
        </div>
      </el-row>

    </div>
  </el-dialog>
</template>

<script>
import { queryDevice } from "@/api/xcnanr/idevelopOther"
import { devBookCiTree } from "@/api/assets/devStandingBook"
import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";

export default {
  name: "deviceDialog",
  components: { xtTreeLzaySelect },
  props: {
    dialogFlag: {
      type: Boolean,
      default: false
    },
    authDeviceTypeList: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: '授权'
    }
  },
  data() {
    return {
      total: 0,
      searchForm: { pageNumber: 1, pageSize: 10 },
      tableData: [],
      tableLoading: true,
      props: { //树组件配置项
        label: 'name',
        isLeaf: 'leaf'
      },
      treeData: [],
      defaultExpandedKeys: [],
      dictForDeviceSource: [],
      authDeviceTypeNameList: [],
      authDeviceTypeCodeList: [],
      // 表格复选框选择缓存列表
      selectedDeviceForOtherPage: [],
      // message提示时间，用于避免重复提示时使用
      tipTime: new Date().getTime(),
      // 复选框事件保护
      selectEventProtect: false
    }
  },
  created() {
    this.authDeviceTypeNameList = this.authDeviceTypeList.map(d => d.dictValue)
    this.initSearchForm()
  },
  methods: {
    // 关闭当前探测光
    closeThisDialog() {
      this.$emit('closeDialog', null)
    },
    // 单位下拉框中选择值的事件赋值
    getTreeItem(val) {
      this.searchForm.ownerUnitCode = val.id
      this.searchForm.ownerUnit = val.fullName
    },
    // 初始化或重置查询form表单
    initSearchForm() {
      this.authDeviceTypeCodeList = this.authDeviceTypeList.map(d => d.dictKey).join(',')
      this.searchForm = {
        pageNumber: 1,
        pageSize: 10,
        ownerUnitCode: '',
        ownerUnit: '',
        fullName: '',
        deviceCode: '',
        IP: '',
        MAC: '',
        deviceCategoryCode: this.authDeviceTypeCodeList,
        deviceTypeCode: this.authDeviceTypeCodeList
      }
    },
    // 重置form表单事件
    handleReset() {
      this.initSearchForm()
      this.getList();
    },
    // 表格选择复选框事件
    selectionChange(selection) {
      if (this.selectEventProtect) {
        // console.log("复选框事件保护期")
        return
      }
      // console.log("复选框事件")
      for (const item of this.tableData) {
        const selected = selection.find(select => select['id'] === item['id'])
        if (selected) {
          // 该行已被选择，判断缓存列表中是否存在该行，如果不存在则加到缓存列表
          const cacheIndex = this.selectedDeviceForOtherPage.findIndex(cache => cache['id'] === item['id'])
          if (cacheIndex < 0) {
            // 缓存列表不存在，需要加进来
            if (this.authDeviceTypeList && this.authDeviceTypeList.length > 0) {
              // 远程作业
              if (!item['IP']) {
                if (new Date().getTime() - this.tipTime > 2000) {
                  this.tipTime = new Date().getTime()
                  this.$message({ message: '选择设备的IP不能为空', type: 'error' })
                }
                // 需要从已选择中去掉复选框的按钮
                this.$refs['arrtTable'].toggleRowSelection(item, false);
                continue
              }
            } else {
              // 现场作业
              if (!item['fullName'] && !item['deviceName']) {
                if (new Date().getTime() - this.tipTime > 2000) {
                  this.tipTime = new Date().getTime()
                  this.$message({ message: '选择设备的标准全称或设备名称不能为空', type: 'error' })
                }
                // 需要从已选择中去掉复选框的按钮
                this.$refs['arrtTable'].toggleRowSelection(item, false);
                continue
              }
            }
            // 无异常，可选择，加到缓存列表
            this.selectedDeviceForOtherPage.push(item)
          }
        } else {
          // 该行未被选择，判断缓存列表中是否存在该行，如果存在则从缓存列表中删除
          const cacheIndex = this.selectedDeviceForOtherPage.findIndex(cache => cache['id'] === item['id'])
          if (cacheIndex >= 0) {
            this.selectedDeviceForOtherPage.splice(cacheIndex, 1)
          }
        }
      }
    },
    // 提交事件
    submitThisPage() {
      const _this = this
      if (this.selectedDeviceForOtherPage.length === 0) {
        this.$message({
          message: '未选择待' + _this.title + '设备',
          type: 'warning'
        })
        return
      }
      this.$emit('submitDialog', this.selectedDeviceForOtherPage)
      this.closeThisDialog()
    },
    // 已选择设备回显方法
    getSelectedDeviceStr(item, index) {
      let objectStr = ''
      if(this.authDeviceTypeList && this.authDeviceTypeList.length > 0) {
        objectStr = item['IP'] + (index === this.selectedDeviceForOtherPage.length - 1 ? '' : ', ')
      } else {
        if(item['fullName'] && item['fullName'].trim().length > 0) {
          objectStr = item['fullName'] + (index === this.selectedDeviceForOtherPage.length - 1 ? '' : ', ')
        } else {
          objectStr = item['deviceName'] + (index === this.selectedDeviceForOtherPage.length - 1 ? '' : ', ')
        }
      }
      return objectStr
    },
    // 加载
    loadNode(node, resolve) {
      let form = {
        parentCiId: '',
        isMenu: 1,
        current: 1,
        size: 999
      }
      if (node.level === 0) {
        form.parentCiId = this.$store.state.common.govern.basicCiId
      } else {
        form.parentCiId = node.data.ciId
      }
      devBookCiTree(form).then(res => {

        if (node.level == 0) {
          this.defaultExpandedKeys = [res.data.records[0].ciId]
        } else if (node.level === 1) {
          if (this.fromAssets && this.fromAssets.cateciid) {
            //从资产管理进入
            setTimeout(() => {
              this.defaultExpandedKeys = [this.fromAssets.cateciid];
              let itm = res.data.records.find(a => a.ciId == this.fromAssets.cateciid);
              this.nodeClick(itm, {level: 2});

              //高亮显示
              this.$refs.tree.setCurrentKey(this.fromAssets.cateciid)
            }, 300);
          } else {
            this.nodeClick({level: 0});
          }
        } else if (node.level === 2) {
          res.data.records.forEach(item => {
            item.leaf = true
          })
          if (this.fromAssets && this.fromAssets.typeciid) {
            //从资产管理进入
            setTimeout(() => {
              let itm = res.data.records.find(a => a.ciId == this.fromAssets.typeciid);
              this.nodeClick(itm, {level: 3});

              //高亮显示
              this.$refs.tree.setCurrentKey(this.fromAssets.typeciid)
            }, 300);
          }
        }
        // 只需要网络设备和主机设备这两种大类型的分类
        if (this.authDeviceTypeNameList.length > 0) {
          const types = res.data.records
          let tempTypes = []
          if (types[0].level !== 0) {
            for (let i = 0; i < types.length; i++) {
              const item = types[i]
              if (this.authDeviceTypeNameList.indexOf(item.ciLabel) >= 0) {
                tempTypes.push(item)
              }
            }
          } else {
            tempTypes = types
          }
          return resolve(tempTypes)
        } else {
          return resolve(res.data.records)
        }
      })
    },
    nodeClick(data, node) {
      this.tableLoading = true
      if (data.level === 0) {
        this.searchForm.deviceCategoryCode = this.authDeviceTypeCodeList
        this.searchForm.deviceTypeCode = this.authDeviceTypeCodeList
        this.getList();
      } else {
        const categoryCode = data.deviceClaccify || '';
        const typeCode = data.deviceType || '';
        this.searchForm.deviceCategoryCode = categoryCode ? categoryCode : this.authDeviceTypeCodeList
        this.searchForm.deviceTypeCode = typeCode ? typeCode : this.authDeviceTypeCodeList
        this.getList()
      }
    },
    getList() {
      this.tableLoading = true
      this.selectEventProtect = true
      queryDevice(this.searchForm).then(res => {
        this.tableData = res.data.data
        this.tableLoading = false
        this.total = res.data.total;

        // 数据加载完成后，给已经选择的复选框添加勾选
        setTimeout(() => {
          for (const item of this.tableData) {
            const cacheItem = this.selectedDeviceForOtherPage.find(cache => cache['id'] === item['id'])
            if (cacheItem) {
              // console.log("之前选择过：" + item['id'])
              this.$refs['arrtTable'].toggleRowSelection(item, true);
            }
          }
          this.selectEventProtect = false
        }, 100)
      })
    },
  }
}
</script>

<style scoped>
  /deep/#categoryScrollbar > .el-scrollbar__wrap {
    margin-bottom: 0px!important;
    margin-right: 0px!important;
  }
  /deep/.el-table::before {
    display: none;
  }
</style>
