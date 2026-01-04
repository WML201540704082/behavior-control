<template>
  <basic-container>
    <div class="yyy">
      <div class="yyy_l">
        <div class="xt-layout-sider" :class="showSider? 'xt-layout-has-sider':'xt-layout-none-sider'">
          <div
            class="layout-sider-btn"
            @click="showSider = !showSider"
          >
            <i v-if="showSider" class="el-icon-arrow-left"></i>
            <i v-else class="el-icon-arrow-right"></i>
          </div>
          <el-input placeholder="输入制造商检索" v-model="filterText"></el-input>
          <el-scrollbar style="height:100%">
            <el-tree
              ref="tree"
              :props="props"
              :data="treeData"
              :load="loadNode"
              highlight-current
              node-key="dictKey"
              lazy
              :accordion="true"
              @node-click="nodeClick"
              check-strictly
              :default-expand-all="false"
              :filter-node-method="filterNode"
            >
              <div class="span-ellipsis" style="font-size:14px;" slot-scope="{node,data}">
                <span :title="data.dictValue">
                  {{ data.dictValue }}
                </span>
              </div>
            </el-tree>
          </el-scrollbar>
        </div>
      </div>
      <div class="yyy_r">
        <div class="page_form">
          <el-form ref="queryForm" :model="searchForm" label-width="105px" class="xt_search_form">
            <el-row>

              <el-col :span="6">
                <div>
                  <el-form-item label="自建库名称">
                    <el-select v-model="searchForm.ciId" placeholder="" size="mini" clearable>
                      <el-option
                        v-for="item in libraryList" :key="item.dictKey" :label="item.dictValue"
                        :value="item.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <el-form-item label="编码">
                    <el-input v-model="searchForm.dictKey" size="mini" clearable></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <el-form-item label="名称">
                    <el-input v-model="searchForm.dictValue" size="mini" clearable></el-input>
                  </el-form-item>
                </div>
              </el-col>


              <el-col :span="6">
                <div>
                  <el-form-item label="数据来源">
                    <el-select v-model="searchForm.dataSource" size="mini" clearable placeholder="">
                      <el-option v-for="item in dataSourceList" :value="item.dictKey" :label="item.dictValue"
                                 :key="item.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>

            </el-row>
          </el-form>
        </div>
        <div class="page_body">
          <el-row>
            <formTitle :titleText="'标准型号库管理'" :titleType="'page_title'">
              <div slot="rightBtnBox">
                <el-button type="primary"
                           @click="handleQuery">查询
                </el-button>
                <el-button style="margin-left: 5px;" type="primary" plain
                           @click="handleReset">重置
                </el-button>
                <el-button v-if="isAdmin()" style="margin-left: 5px;" type="primary" plain
                           @click="handleAdd">新增
                </el-button>
                <el-button v-if="isAdmin()" style="margin-left: 5px;" type="danger" plain
                           @click="handleSomeDelete">删除
                </el-button>
                <!-- <el-button  type="primary"  style="margin-left: 5px;"
                            @click="handleSync">同步radius数据</el-button> -->

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
            @row-dblclick="handleView"
            @selection-change="selectionChange">
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <!-- <el-table-column show-overflow-tooltip prop="ciId" label="自建库名称" width="150" align="center">
              <template slot-scope="scope">
                <div class="changeC">
                  <span>{{ showDictLable(scope.row.ciId, libraryList) }}</span>
                </div>
              </template>
            </el-table-column> -->
            <!-- <el-table-column show-overflow-tooltip prop="dictValue" :width="isMaker ? undefined : 190" label="名称" align="center"></el-table-column> -->
            <el-table-column show-overflow-tooltip prop="dictValue" label="名称" align="center"></el-table-column>
            
            <el-table-column show-overflassetsow-tooltip prop="upOneName" v-if="isBrand || isSeries || isModel" :label="oneTypeName" align="center"></el-table-column>
            <!-- <el-table-column show-overflassetsow-tooltip prop="upOneCode" v-if="isBrand || isSeries || isModel" width="260" :label="oneTypeCode" align="center"></el-table-column> -->
            <el-table-column show-overflassetsow-tooltip prop="upTwoName" v-if="isSeries || isModel" :label="twoTypeName" align="center"></el-table-column>
            <!-- <el-table-column show-overflassetsow-tooltip prop="upTwoCode" v-if="isSeries || isModel" width="260" :label="twoTypeCode" align="center"></el-table-column> -->
            <el-table-column show-overflassetsow-tooltip prop="upThreeName" v-if="isModel" label="制造商名称" align="center"></el-table-column>
            <!-- <el-table-column show-overflassetsow-tooltip prop="upThreeCode" v-if="isModel" width="260" label="制造商编码" align="center"></el-table-column> -->


            <!-- <el-table-column show-overflow-tooltip prop="dictKey" :width="isMaker ? undefined : 260" label="编码" align="center"></el-table-column> -->
            <el-table-column show-overflow-tooltip prop="dictKey" label="编码" align="center" :width="isMaker ? 265 : 180"></el-table-column>

            <el-table-column show-overflow-tooltip prop="dataSource" label="数据来源" :width="isMaker ? 265 : 120" align="center">
              <template slot-scope="scope">
                <div class="changeC">
                  <span>{{ showDictLable(scope.row.dataSource, dataSourceList) }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="200" align="center" fixed="right" v-if="isAdmin()">
              <template slot-scope="scope">
                <!-- v-if="permission.deviceRecord_view" -->
                <!--                <el-button type="text"-->
                <!--                           class="list_btn"-->
                <!--                           size="small"-->
                <!--                           icon="el-icon-view" -->
                <!--                           @click="handleView(scope.row)">查看-->
                <!--                </el-button>-->
                <!-- v-if="permission.deviceRecord_edit && (scope.row.status=='1' || scope.row.processStatus=='hussar_4')" -->
                <el-button type="text"
                           class="list_btn"
                           size="small"
                           icon="el-icon-edit"
                           @click="handleEdit(scope.row)">编辑
                </el-button>
                <!-- v-if=" permission.deviceRecord_delete && scope.row.status == 1 && !scope.row.processStatus " -->
                <el-button type="text"
                           class="list_btn btn_red"
                           size="small"
                           icon="el-icon-delete"
                           @click="handleDelete(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="150" align="center" fixed="right" v-if="!isAdmin()">
              <template slot-scope="scope">
               
                <el-button type="text"
                           class="list_btn"
                           size="small"
                           icon="el-icon-view"
                           @click="handleView(scope.row)">查看
                </el-button>
                
              </template>
            </el-table-column>


          </el-table>
          <pagination
            :total="total"
            :page.sync="searchForm.currentPage"
            :limit.sync="searchForm.pageSize"
            @pagination="getList"/>
        </div>
      </div>
    </div>


    <!-- 属性新增弹窗 -->
    <switchInfo
      v-if="showForm"
      :isShow="showForm"
      :arrtId="arrtId"
      :isEdit='edit'
      :editItem='editItem'
      :showType="showType"
      @close="showForm = false"
      @update='updateList'
    ></switchInfo>
  </basic-container>
</template>

<script>
import switchInfo from './components/switch/switchInfo'
import {getDictCmdbList, getDictCmdbListPid} from "@/api/dict";
import {standLibraryList, standLibraryRemove} from "@/api/operation/safeaccess/switch";
import {mapGetters, mapState} from "vuex";

export default {
  components: {
    switchInfo,
  },
  data() {
    return {
      isMaker: false,
      isBrand: false,
      isSeries: false,
      isModel: false,

      showSider: true, //是否显示侧边栏
      treeData: [],
      props: { //树组件配置项
        label: 'dictValue',
        isLeaf: 'leaf'
      },


      createTimes: [],

      unitlList: [],
      is3List: [],
      swStateList: [],
      Is802List: [],
      isAccessSwitchList: [],

      searchForm: {
        currentPage: 1,
        pageSize: 20,
        ciId: '',
      },

      dataList: [],
      selectionList: [],
      total: 0,
      tableLoading: false, //表格加载
      tableHeight: undefined,
      // 弹窗
      showForm: false,
      showType: '',
      arrtId: '',
      libraryList: [
        {dictValue: '制造商', dictKey: this.$store.state.common.govern.dictMaker},
        {dictValue: '品牌', dictKey: this.$store.state.common.govern.dictBrand},
        {dictValue: '系列', dictKey: this.$store.state.common.govern.dictSeries},
        {dictValue: '型号', dictKey: this.$store.state.common.govern.dictModel}
      ],
      dataSourceList: [],
      edit: false,
      editItem: {},
      filterText: '',
      innerHeight: 100,
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    oneTypeName(){
      if(this.isBrand){
        return '制造商名称'
      }else if(this.isSeries){
        return '品牌名称'
      }else if(this.isModel){
        return '系列名称'
      }
    },
    oneTypeCode(){
      if(this.isBrand){
        return '制造商编码'
      }else if(this.isSeries){
        return '品牌编码'
      }else if(this.isModel){
        return '系列编码'
      }
    },
    twoTypeName(){
      if(this.isSeries){
        return '制造商名称'
      }else if(this.isModel){
        return '品牌名称'
      }
    },
    twoTypeCode(){
      if(this.isSeries){
        return '制造商编码'
      }else if(this.isModel){
        return '品牌编码'
      }
    },


  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.innerHeight = window.innerHeight;
    this.setPageContentHeight()
    this.setTableHeight()
    this.searchForm.ciId = this.libraryList[0].dictKey;
    this.getCmdbDictList(this.$store.state.common.govern.dictValueType);
    this.getCmdbDictList(this.$store.state.common.govern.dictMaker);
    this.getList()
    this.doLayout()
  },
  methods: {
    doLayout(){
      this.isMaker = this.searchForm.ciId == this.libraryList[0].dictKey;
      this.isBrand = this.searchForm.ciId == this.libraryList[1].dictKey;
      this.isSeries = this.searchForm.ciId == this.libraryList[2].dictKey;
      this.isModel = this.searchForm.ciId == this.libraryList[3].dictKey;
      setTimeout(() => {
        this.$refs.dataTable.doLayout()
      }, 600);
      
    },
    // isBrand(){ // 品牌
    //   return this.searchForm.ciId == this.libraryList[1].dictKey
    // },
    // isSeries(){ // 系列
    //   return this.searchForm.ciId == this.libraryList[2].dictKey
    // },
    // isModel(){ // 型号
    //   return this.searchForm.ciId == this.libraryList[3].dictKey
    // },

    filterNode(value, data) {
      if (!value) return true;
      return data.dictValue.indexOf(value) !== -1;
    },
    updateList() {
      this.showForm = false;
      this.searchForm.current = 1;
      this.getList();
    },
    loadNode(node, resolve) {
      let query = {};
      if (node.level === 0) {
        query.ciId = this.$store.state.common.govern.dictMaker;
      } else if (node.level === 1) {
        query.ciId = this.$store.state.common.govern.dictBrand;
        query.pid = node.data.dictKey;
      } else if (node.level === 2) {
        query.ciId = this.$store.state.common.govern.dictSeries;
        query.pid = node.data.dictKey;
      } else if (node.level === 3) {
        query.ciId = this.$store.state.common.govern.dictModel;
        query.pid = node.data.dictKey;
      }
      // console.log(899, node)
      if (node.level === 0) {
        getDictCmdbList(query).then(res => {
          res.data.forEach(item => {
            item.leaf = false;
          });
          return resolve(res.data)

        });
      } else {
        getDictCmdbListPid(query).then(res => {

          if (node.level === 1 || node.level === 2) {
            res.data.forEach(item => {
              item.leaf = false;
            })
          } else {
            res.data.forEach(item => {
              item.leaf = true;
            })
          }
          return resolve(res.data)
        });
      }
    },
    nodeClick(data, node) {
      this.searchForm = {
        current: 1,
        pageSize: 20,
        ciId: ''
      };
      if (node.level === 1) {
        this.searchForm.ciId = this.libraryList[1].dictKey;
        this.searchForm.cientityPid = data.dictKey;
      } else if (node.level === 2) {
        this.searchForm.ciId = this.libraryList[2].dictKey;
        this.searchForm.cientityPid = data.dictKey;
      } else if (node.level === 3) {
        this.searchForm.ciId = this.libraryList[3].dictKey;
        this.searchForm.cientityPid = data.dictKey;
      } else if (node.level === 4) {
        this.searchForm.ciId = this.libraryList[3].dictKey;
        this.searchForm.cientityId = data.dictKey;
      }
      this.doLayout()
      this.getList();

    },
    handleAdd() {
      this.arrtId = undefined
      this.showType = 'add'
      this.showForm = true
      this.edit = false;
    },
    handleView(data) {
      this.arrtId = undefined
      this.showType = 'check'
      this.showForm = true
      this.edit = false;
      this.editItem = data;
    },
    handleEdit(data) {
      this.arrtId = undefined
      this.showType = 'edit'
      this.showForm = true
      this.edit = true;
      this.editItem = data;
    },
    handleDelete(row) {
      standLibraryRemove([
        {
          ciEntityId: row.cientityId,
          ciEntityName: row.ciEntityName,
          ciId: row.ciId,
        }
      ]).then(res => {
        if (res.code != 200) {
          throw res.mag;
        }
        this.$message.success('删除成功');
        this.searchForm.current = 1;
        this.getList();
      })
    },

    handleSomeDelete() {
      if (this.selectionList.length == 0) {
        this.$message.warning('当前没有选择数据');
        return;

      }

      this.selectionList.forEach(item => {
        item.ciEntityId = item.cientityId;
      })
      standLibraryRemove(this.selectionList).then(res => {
        if (res.code != 200) {
          throw res.mag;
        }
        this.$message.success('删除成功');
        this.searchForm.current = 1;
        this.getList();
      })
    },

    getCmdbDictList(code) {
      //加载cmdb字典
      let query = {}
      query.ciId = code
      getDictCmdbList(query).then(res => {
        if (code == this.$store.state.common.govern.dictValueType) { // 数据来源
          this.dataSourceList = res.data;
        } else {
          this.treeData = res.data;
          setTimeout(() => {
            this.$refs.tree.setCurrentKey(this.$store.state.common.govern.dictMaker) //制造商
          }, 500);
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
    handleQuery() {
      this.doLayout()
      this.getList()
    },
    handleReset() {
      this.searchForm = {
        current: 1,
        pageSize: 20,
        ciId: ''
      }
      this.searchForm.ciId = this.libraryList[0].dictKey;
      this.doLayout()
      this.getList()
    },

    showSwitcheInfo(row) {
      this.arrtId = row.id
      this.showForm = true
    },

    selectionChange(selection) {
      //点击选择事件
      this.selectionList = selection
    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 110) + 'px'
    },
    getList() {
      this.tableLoading = true
      standLibraryList(this.searchForm).then(res => {
        this.dataList = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      })
    },
    isAdmin() {
      if (this.userInfo && this.userInfo.authority) {
        if (this.userInfo.authority.includes('administrator')) {
          return true;
        }
      }
      return false;
    },
  }
}
</script>
<style lang="scss" scoped>
.yyy {
  display: flex;

  .yyy_l {
    // width: 200px;
    // height: 100px;
    // background: red;

    height: 80vh;
    position: relative;
    padding-top: 10px;

    background-color: #cfe6f9;
    border-radius: 5px;


    .xt-layout-has-sider {
      width: 300px;
      min-width: 300px;
      max-width: 300px;
      -webkit-box-flex: 0;
      -ms-flex: 0 0 300px;
      flex: 0 0 300px;
      -webkit-transition: all 0.3s;
      transition: all 0.3s;
    }

    .xt-layout-none-sider {
      width: 0px;
      min-width: 0px;
      max-width: 0px;
      -webkit-box-flex: 0;
      -ms-flex: 0 0 0px;
      flex: 0 0 0px;
      -webkit-transition: all 0.3s;
      transition: all 0.3s;
    }

    .xt-layout-sider {
      height: 93%;
      position: relative;
    }

    .layout-sider-btn {
      position: absolute;
      width: 12px;
      height: 87px;
      top: 50%;
      right: -12px;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      background-color: #909399;
      color: #fff;
      cursor: pointer;
      border-radius: 0 5px 5px 0;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
    }

    .el-scrollbar {
      overflow: hidden;
      position: relative;
    }

    .el-tree {
      background: transparent;
      color: #46506d;
    }
  }

  .yyy_r {
    padding-left: 20px;
    width: 10px;
    flex: 1;
  }
}

::v-deep .el-input__inner {
  margin: 0px 10px 5px;
  width: calc(100% - 20px);
}

::v-deep .dates {
  .el-range__icon {
    line-height: 25px;
  }
}

::v-deep .list_btn {
  padding: 9px 5px !important;
}

::v-deep .btn_red {
  color: red;
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
