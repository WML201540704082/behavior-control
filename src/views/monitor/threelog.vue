<template>
  <basic-container>
    <div class="page_form">
      <el-form ref="searchForm" :model="searchForm" label-width="105px" class="xt_search_form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="用户区域" prop="regionName">
              <el-input
                placeholder="请输入用户区域"
                clearable
                v-model="searchForm.regionName"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="三方系统" prop="tripleType">
              <el-select v-model="searchForm.tripleType" placeholder="请选择三方系统" clearable>
                <el-option v-for="dict in tripleTypeList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作类型" prop="value">
              <el-select v-model="searchForm.value" placeholder="请选择操作类型" clearable>
                <el-option v-for="dict in valueList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否成功" prop="success">
              <el-select v-model="searchForm.success" placeholder="请选择是否成功" clearable>
                <el-option v-for="dict in successList" :key="dict.dictKey" :label="dict.dictValue"
                           :value="dict.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="ip地址" prop="ip">
              <el-input placeholder="请输入ip地址" clearable v-model="searchForm.ip">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="参数值" prop="text">
              <el-input placeholder="请输入参数值" clearable v-model="searchForm.text">
              </el-input>
            </el-form-item>
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
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="30" fixed="left"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="regionName" label="用户区域" width="200" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="tripleType" label="三方系统" width="200" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="value" label="操作类型" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ip" label="ip地址" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="200" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="success" label="是否成功" width="100" align="center" :formatter="changeStatus"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="list_btn"
              icon="el-icon-view"
              @click="handleView(scope.row, scope.index)">查看
            </el-button>
            <el-button
              type="text"
              size="small"
              class="list_btn btn_red"
              icon="el-icon-delete"
              @click="handleDeleteOne(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="getList"/>
    </div>

    <!-- 详情弹窗 -->
    <threelogDetail
      v-if="showDialog"
      :isShow="showDialog"
      :itemId="itemId"
      @close="showDialog = false"
    ></threelogDetail>
  </basic-container>
</template>

<script>
  import {getTripleapilogList} from "@/api/logs";
  import {getDictList} from "@/api/dict";
  import {getDeptList} from "@/api/system/dept";
  import threelogDetail from './components/threelog/threelogDetail'

  export default {
    components: {threelogDetail},
    data() {
      return {
        searchForm: {
          current: 1,
          size: 20
        },

        successList: [{
          "dictKey": 0,
          "dictValue": "成功"
        }, {
          "dictKey": 1,
          "dictValue": "失败"
        }],
        dataList: [],
        tableLoading: false, //表格加载
        tableHeight: undefined,
        total: 0,
        selectionList: [],
        valueList: [],
        tripleTypeList: [],

        showDialog: false,
        itemId: '',
      };
    },
    computed: {
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    mounted() {
      // 设置页面元素高度
      this.setPageContentHeight()
      this.setTableHeight()
      this.getDictList("threeLogValue");
      this.getDictList("tripleTypeList");
      this.getList();
      this.getDeptList();
    },
    methods: {
      changeStatus(row) {
        if (row.success === 0) {
          return "成功"
        } else if (row.success === 1) {
          return "失败"
        }
      },
      getDeptList() {
        getDeptList.then(res => {
        }).catch(error => {
        })
      },
      getDictList(code) {
        //加载字典
        getDictList(code).then(res => {
          if (code === 'threeLogValue') {
            this.valueList = res.data;
          } else if (code === 'tripleTypeList') {
            this.tripleTypeList = res.data;
          }
        });
      },
      // 设置表格高度
      setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 61 - 47 + 'px'
      },
      handleView(row) {
        this.showDialog = true
        this.itemId = row.id
      },
      handleReset() {
        this.searchForm = {
          current: 1,
          size: 20,
        };
        this.getList()
      },
      getList() {
        this.tableLoading = true
        getTripleapilogList(this.searchForm).then(res => {
          this.dataList = res.data.records
          this.total = res.data.total
          this.tableLoading = false
        })
      },
      handleQuery() {
        this.searchForm.current = 1
        this.getList()
      },
      handleDeleteOne(id) {
        //删除按钮
        let ids = id;
        this.handleDeleteConfirm(ids);
        this.selectionList.filter(item => item != id);
      },
      handleDeleteConfirm(ids) {
        this.$confirm("点击确认将永久删除数据且无法恢复，请谨慎选择。", "确定将选择数据删除?", {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(ids);
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.getList()
          });
      },
      selectionChange(list) {
        this.selectionList = list;
      },
    }
  };
</script>

<style lang="scss" scoped>
  .list_btn {
    padding: 9px 5px !important;
  }

  .btn_red {
    color: red;
  }
</style>
