<template>
  <div class="xt-layout page_body">
    <div class="xt-layout-content" style="height: 84vh; padding: 0px 0px 0px 20px;overflow: hidden">
      <el-form :model="queryParams" label-suffix=":" label-width="auto" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="模型ID" size="small">
              <el-input v-model="queryParams.ciId" placeholder="请输入模型ID" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="模型英文" clearable>
              <el-input v-model="queryParams.ciName" placeholder="请输入模型英文" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="模型名称" clearable>
              <el-input v-model="queryParams.ciLabel" placeholder="请输入模型名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="显示树形" clearable>
              <el-select v-model="queryParams.isMenu" placeholder="请选择显示树形" @visible-change="((val)=>{elSelectVis(val,yesnoList,'tree_is_menu')})" clearable>
                <template #empty>
                  <div class="d_stext">
                    <span v-if="yesnoList&&yesnoList.length === 0">暂无数据</span>
                    <span v-else>获取中...</span>
                  </div>
                </template>
                <el-option
                  v-for="(item, index) in yesnoList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="属性映射" clearable>
              <el-select v-model="queryParams.isMap" placeholder="请选择属性映射" @visible-change="((val)=>{elSelectVis(val,yesnoList,'tree_is_menu')})" clearable>
                <template #empty>
                  <div class="d_stext">
                    <span v-if="yesnoList&&yesnoList.length === 0">暂无数据</span>
                    <span v-else>获取中...</span>
                  </div>
                </template>
                <el-option
                  v-for="(item, index) in yesnoList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="属性层级" clearable>
              <el-select v-model="queryParams.isUpdate" placeholder="请选择属性层级" @visible-change="((val)=>{elSelectVis(val,yesnoList,'tree_is_menu')})" clearable>
                <template #empty>
                  <div class="d_stext">
                    <span v-if="yesnoList&&yesnoList.length === 0">暂无数据</span>
                    <span v-else>获取中...</span>
                  </div>
                </template>
                <el-option
                  v-for="(item, index) in yesnoList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备分类" clearable>
              <el-select v-model="queryParams.deviceClaccify" placeholder="请选择设备分类" @visible-change="((val)=>{elSelectVis(val,deviceCategoryList,'deviceClaccify')})"
                         @change="val=>{selChange(val,'deviceClaccify')}" clearable>
                <template #empty>
                  <div class="d_stext">
                    <span v-if="deviceCategoryList&&deviceCategoryList.length === 0">暂无数据</span>
                    <span v-else>获取中...</span>
                  </div>
                </template>
                <el-option
                  v-for="(item, index) in deviceCategoryList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="设备类型" clearable>
              <el-select v-model="queryParams.deviceType" placeholder="请选择设备类型" @visible-change="((val)=>{elSelectVis(val,deviceTypeList,'deviceType')})"
                         @change="val=>{selChange(val,'deviceType')}" clearable>
                <template #empty>
                  <div class="d_stext">
                    <span v-if="deviceTypeList&&deviceTypeList.length === 0">暂无数据</span>
                    <span v-else>获取中...</span>
                  </div>
                </template>
                <el-option
                  v-for="(item, index) in deviceTypeList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="d_sb">
              <div>
                <el-button type="primary" plain size="small" @click="getList">查 询</el-button>
                <el-button type="success" plain size="small" @click="reset">重 置</el-button>

                <el-button type="danger" plain size="small" @click="handelDelete(null)">删 除</el-button>
              </div>

              <div>
                <el-button type="danger" plain size="small" icon="el-icon-refresh" @click="handleRefresh" :loading="modelLoad.handleRefresh">刷新模型</el-button>
                <el-button type="danger" plain size="small" icon="el-icon-refresh" @click="handleRefreshCiAttr" :loading="modelLoad.handleRefreshCiAttr">刷新模型属性
                </el-button>
                <el-button type="danger" plain size="small" icon="el-icon-refresh" @click="handleRefreshCiAttrGrade" :loading="modelLoad.handleRefreshCiAttrGrade">
                  刷新模型层级属性
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 设备列表 -->
      <el-table ref="table" :data="tableData" stripe border size="small" height="58vh" v-loading="loading">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column width="50" type="index" :index="Nindex" label="序号" align="center"></el-table-column>
        <el-table-column label="父模型ID" width="150" prop="parentCiId" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="模型ID" width="150" prop="ciId" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="模型英文" width="150" prop="ciName" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="模型名称" prop="ciLabel" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="设备分类" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ getDeviceClaccifyName(scope.row.deviceClaccify) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备类型" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ getDeviceTypeName(scope.row.deviceType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前层级" prop="level" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="显示树形" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ getYesNoName(scope.row.isMenu) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性映射" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ getYesNoName(scope.row.isMap) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性层级" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ getYesNoName(scope.row.isUpdate) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" @click="handelDelete(scope.row.ciId)" style="color: red;">删除</el-button>

            <el-button type="text" size="small" icon="el-icon-setting" @click.stop="handleDataScope(scope.row)" v-if="scope.row.isMap == '1'">映射</el-button>
            <el-button type="text" size="small" icon="el-icon-setting" @click.stop="setupCi(scope.row)" v-if="scope.row.isUpdate === '1'">层级</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination :total="page.total" :page.sync="page.currentPage" :limit.sync="page.pageSize" @pagination="getList"/>
    </div>

    <edit v-if="componentsParams.isShow"
          :isShow="componentsParams.isShow"
          :type="componentsParams.type"
          :formDetial="editRow"
          @refreshData="getList"
          @close="close"></edit>

    <!-- 属性映射弹窗 -->
    <arrtMapping
      v-if="showArrt"
      :isShow="showArrt"
      :ciId="ciId"
      :ciName="ciName"
      :ciLabel="ciLabel"
      @close="showArrt = false"
    ></arrtMapping>

    <!-- 属性配置 -->
    <setupCiForm
      v-if="showSetup"
      :isShow="showSetup"
      :ciId="ciId"
      :ciName="ciName"
      :ciLabel="ciLabel"
      @close="showSetup = false"
    ></setupCiForm>
  </div>
</template>

<script>
import {getDictList, getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import {getList, getDetail, add, update, remove, refresh, cmdbciattrgradeRefresh} from "@/api/device/hardwarebasictree";
import {refreshCiAttr} from "@/api/device/cmdbciattr";
import edit from './components/tree/edit.vue'
import arrtMapping from './components/tree/arrtMapping.vue'
import setupCiForm from './components/tree/setupCiForm.vue'

export default {
  name: 'tabTree',
  components: {edit, arrtMapping, setupCiForm},
  data() {
    return {
      queryParams: {},
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
      keyword: '',

      loading: false,
      tableData: null,
      yesnoList: null,
      deviceCategoryList: null,
      deviceTypeList: null,

      deviceTypeListTemp: null,

      modelLoad: {
        handleRefresh: false,
        handleRefreshCiAttr: false,
        handleRefreshCiAttrGrade: false,
      },

      editRow: null,
      componentsParams: {
        isShow: false,
        type: null,
      },

      showArrt: false,
      showSetup: false,
      ciId: '',
      ciName: '',
      ciLabel: ''
    };
  },
  async mounted() {
    this.page = {
      currentPage: 1,
      pageSize: 20,
      total: 0,
    };
    this.modelLoad = {
      handleRefresh: false,
      handleRefreshCiAttr: false,
      handleRefreshCiAttrGrade: false,
    };

    this.loading = true;
    await this.initTableColmonDict();
    this.getList();
  },
  methods: {
    close() {
      this.componentsParams.isShow = false;
      this.componentsParams.type = null;
      this.editRow = null;
    },
    Nindex(index) {
      return index + 1 + (this.page.currentPage - 1) * this.page.pageSize;
    },
    async initTableColmonDict() {
      //yes or no menu
      await getDictList('tree_is_menu').then(res => {
        this.yesnoList = res.data;
      });

      //设备分类
      await getDictCmdbList({
        ciId: 1097745625841664,
      }).then(res => {
        this.deviceCategoryList = res.data;
      });

      //设备类型
      await getDictCmdbList({
        ciId: 1097745969774592,
      }).then(res => {
        this.deviceTypeListTemp = res.data;
      });
    },

    getList() {
      this.loading = true;
      getList(this.page.currentPage, this.page.pageSize, this.queryParams).then(res => {
        const data = res.data;
        this.page.total = data.total;
        this.tableData = data.records;

        this.loading = false;
        this.selectionClear();
        this.tableData = [];
      });
    },
    reset() {
      this.queryParams = {};
    },
    elSelectVis(val, list, type) {
      if (val) {
        if (list && list.length > 0) {
          return;
        }

        if (type === 'tree_is_menu') {
          //yes or no menu
          getDictList('tree_is_menu').then(res => {
            this.yesnoList = res.data;
          });
        } else if (type === 'deviceClaccify') {
          //设备分类
          getDictCmdbList({
            ciId: 1097745625841664,
          }).then(res => {
            this.deviceCategoryList = res.data;
          });
        } else if (type === 'deviceType') {
          //设备类型
          if (!this.queryParams.deviceClaccify) {
            this.$message.warning('请先选择设备分类');
            this.deviceTypeList = [];
            return;
          }
          getDictCmdbListPid({
            ciId: 1097745969774592,
            pid: this.queryParams.deviceClaccify,
          }).then(res => {
            this.deviceTypeList = res.data;
          });
        }
      }
    },
    selChange(value, type) {
      if (type === 'deviceClaccify') {
        //设备分类
        this.deviceTypeList = null;
        this.queryParams.deviceType = null;
        if (value != null && value != '') {
          this.elSelectVis(true, this.deviceTypeList, 'deviceType');
        }
      } else if (type === 'deviceType') {
        //设备类型
        this.$forceUpdate()
      }
    },
    //刷新模型
    handleRefresh() {
      const keyword = this.keyword;
      this.$confirm("是否刷新全量资产树形结构数据?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.modelLoad.handleRefresh = true;
        return refresh(keyword);
      }).then((res) => {
        this.modelLoad.handleRefresh = false;
        this.getList()
        this.$message({type: "success", message: res.data});
      });
    },
    handleRefreshCiAttr() {
      const ciId = this.keyword;
      const ciName = this.keyword;
      this.$confirm("是否刷新全量刷新模型属性数据?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.modelLoad.handleRefreshCiAttr = true;
        return refreshCiAttr({
          ciId: ciId,
          ciName: ciName
        });
      }).then((res) => {
        this.modelLoad.handleRefreshCiAttr = false;
        this.getList()
        this.$message({type: "success", message: res.data});
      });
    },
    handleRefreshCiAttrGrade() {
      const ciId = this.keyword;
      const ciName = this.keyword;
      this.$confirm("是否刷新模型层级属性数据?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.modelLoad.handleRefreshCiAttrGrade = true;
        return cmdbciattrgradeRefresh({
          ciId: ciId,
          ciName: ciName
        });
      }).then((res) => {
        this.modelLoad.handleRefreshCiAttrGrade = false;
        this.getList();
        this.$message({type: "success", message: res.data});
      });
    },
    getDeviceClaccifyName(value) {
      if (this.deviceCategoryList) {
        let fItem = this.deviceCategoryList.find(a => a.dictKey == value);
        if (fItem) {
          return fItem.dictValue;
        }
      }
      return null;
    },
    getDeviceTypeName(value) {
      if (this.deviceTypeListTemp) {
        let fItem = this.deviceTypeListTemp.find(a => a.dictKey == value);
        if (fItem) {
          return fItem.dictValue;
        }
      }
      return null;
    },
    getYesNoName(value) {
      if (this.yesnoList) {
        let fItem = this.yesnoList.find(a => a.dictKey == value);
        if (fItem) {
          return fItem.dictValue;
        }
      }
      return null;
    },
    handelDelete(ciId) {
      if (ciId) {
        //删除某一条数据
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return remove(ciId);
        }).then(() => {
          this.getList();
          this.$message({type: "success", message: "操作成功!"});
        });
      } else {
        //删除多条数据
        if (this.$refs.table.selection.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        let ids = [];
        this.$refs.table.selection.forEach(ele => {
          ids.push(ele.ciId);
        });
        ids = ids.join(",");
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return remove(this.ids);
        }).then(() => {
          this.getList();
          this.$message({type: "success", message: "操作成功!"});
        });
      }
    },
    handleEdit(row) {
      this.componentsParams.isShow = true;
      this.componentsParams.type = 'edit';
      this.editRow = JSON.parse(JSON.stringify(row));
    },
    // 映射
    handleDataScope(row) {
      this.showArrt = true;
      this.ciId = row.ciId;
      this.ciName = row.ciName;
      this.ciLabel = row.ciLabel;
    },
    // 层级
    setupCi(row) {
      this.showSetup = true
      this.ciId = row.ciId;
      this.ciName = row.ciName;
      this.ciLabel = row.ciLabel;
    },
  },
}
</script>
<style scoped lang="scss">
.d_stext {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.d_stext span {
  font-size: 14px;
  color: #666666;
}

.d_sb {
  display: flex;
  justify-content: space-between;
}
</style>
