<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="xt-layout page_body">
      <div class="xt-layout-sider" :class="showSider? 'xt-layout-has-sider':'xt-layout-none-sider'">
        <el-scrollbar style="height:100%">
          <el-tree
            ref="tree"
            :props="treeProps"
            :data="treeData"
            highlight-current
            :accordion="true"
            node-key="id"
            check-strictly
            @node-click="nodeClick"
            :default-expand-all="true"
          >
            <div class="span-ellipsis" style="font-size:14px;" slot-scope="{node,data}">
             <span :title="data.title">
               {{data.title}}
             </span>
            </div>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="xt-layout-content" style="padding: 0px 0px 0px 20px">
        <el-row gutter="20">
          <el-col :span="12">
            <el-button type="primary" plain size="small" @click="handleAdd">新 增</el-button>
            <el-button type="primary" plain size="small" @click="getList">刷 新</el-button>
          </el-col>
        </el-row>
        <!-- 设备列表 -->
        <el-table
          ref="table"
          :data="tableData"
          stripe
          border
          size="small"
          :height="tableHeight"
          v-loading="loading"
        >
          <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="班组名称" prop="groupName" show-overflow-tooltip align="center">
            <template  slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.groupName"  placeholder="请输入班组名称" clearable style="width:100%"></el-input>
              <span v-else>{{scope.row.groupName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="deptName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="排序" prop="sort"  width="80" show-overflow-tooltip align="center">
            <template  slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.sort" type="integer"  placeholder="请输入排序" clearable style="width:100%"></el-input>
              <span v-else>{{scope.row.sort}}</span>
            </template>
          </el-table-column>
          <el-table-column label="说明" prop="remark" show-overflow-tooltip align="center">
            <template  slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.remark"  placeholder="请输入说明" clearable style="width:100%"></el-input>
              <span v-else>{{scope.row.remark}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template  slot-scope="scope">
              <el-button type="text"
                         size="small"
                         icon="el-icon-edit"
                         v-if="permission.usergroup_edit && !scope.row.isEdit"
                         @click="handleEdit(scope.row)">编辑
              </el-button>
              <el-button type="text"
                         size="small"
                         icon="el-icon-edit"
                         v-if="permission.usergroup_edit && scope.row.isEdit"
                         @click="handleSave(scope.row)">保存
            </el-button>
              <el-button type="text"
                         size="small"
                         icon="el-icon-delete"
                         v-if="permission.usergroup_delete"
                         @click="handleDelete(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
<!--        <pagination
          :total="total"
          :page.sync="searchForm.current"
          :limit.sync="searchForm.size"
          @pagination="getList"
        />-->
      </div>
    </div>
  </basic-container>
</template>

<script>
import {getList, add, update, remove} from "@/api/system/usergroup";
import {getDeptTree, getLazyList} from "@/api/system/dept";
import {mapGetters, mapState} from "vuex";
import {iscbaseorgTree} from "@/api/system/user";

export default {
  components: {
  },
  data() {
    return {
      tableHeight: undefined,
      loading: false,
      total: 0,
      showSider: true,
      componentName: 'groupList',
      treeData: [],
      treeProps: { //树组件配置项
        label: 'title',
        isLeaf: 'leaf'
      },
      props: { //树组件配置项
        label: 'title',
        isLeaf: 'leaf'
      },
      form:{},
      searchForm: {
        current: 1,
        size: 20,
      },
      parentId: '',
      deptId:'',
      deptName:'',
      tableData: [{
        hasChildren: true,
        id: "1745022609004736513",
        key: "1745022609004736513",
        parentId: "0",
        title: "国网山东省电力公司",
        value: "1745022609004736513",
        type: 'dept'
      }],
      queryParam: {
          queryKey: 'name',
          queryValue: undefined
      },
      query: {},
      page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
      },

    }
  },
  mounted() {
    this.setPageContentHeight()
    this.getTreeData()
    //记载默认数据
    this.getList()
  },
  computed: {
    ...mapGetters(["permission","userInfo"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.usergroup_add, false),
        viewBtn: this.vaildData(this.permission.usergroup_view, false),
        delBtn: this.vaildData(this.permission.usergroup_delete, false),
        editBtn: this.vaildData(this.permission.usergroup_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    getTreeData() {
        getDeptTree(this.form.tenantId).then(res => {
            this.treeData = res.data
        });
    },
    setTableHeight() {
        let pageBody = document.getElementsByClassName('page_body')
        this.tableHeight = pageBody[0].offsetHeight - 55 - 48 - 47 + 'px'
    },
    loadNode(node, resolve) {
        let form = {
            type: '',
            value: '',
        }
        if(node.level === 0) {
            form.type = 'id'
            form.value = "1"
        }else {
            form.type = 'parentId'
            form.value = node.data.id
        }
        iscbaseorgTree(form).then(res => {
            setTimeout(() => {
                this.$refs.scrollbar.update()
            }, 500)
            return resolve(res.data)
        })
    },
    loadNode1(node, resolve) {
      let parentCode =  node.data.id
      if(!parentCode){
        parentCode = '1745022609004736513'
        // userInfo.deptId||
        return resolve(this.tableData)
      }
      // 加载默认
      if (node.data.type === 'dept') {
        //加载下级单位部门
        getLazyList({parentId:parentCode}).then(res => {
          if(res.data){
            //包装tree node格式
            let nodes = res.data;
            nodes.forEach(i => {
              i.hasChildren = true,
              i.key = i.id,
              i.title = i.deptName||'-',
              i.value = i.id,
              i.type = 'dept'
            })
            return resolve(nodes)
          }
        })
        // 加载班组列表
        getList(1,999,{
          deptId: node.data.id
        }).then(res => {
          if(res.data){
            //包装tree node格式
            let nodes = res.data;
            nodes.forEach(i => {
              i.hasChildren = false,
              i.key = i.id,
              i.title = i.groupName||'-',
              i.value = i.id,
              i.type = 'group'
            })
            return resolve(nodes)
          }
        })
      }else {
          return resolve([])
      }
    },
    // eslint-disable-next-line no-unused-vars
    nodeClick(data, node) {
        //id            :            "1770010887220600834"
        //key            :            "1770010887220600834"
        //parentId            :            "1768803691075489793"
        //title            :            "发展建设部"
        //value            :            "1770010887220600834"

      this.searchForm.deptId = data.id
      this.deptId=node.data.id;
      this.query.deptId = data.id
      this.deptName=node.data.title||'';
      //加载班组
      this.getList()
        //加载下级
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
            const data = res.data;
            this.page.total = data.total;
            this.data = data.records;
        });
    },
    getList() {
      //加载 班组
      this.tableData = []
      this.Loading = true
      getList(1,999,this.searchForm).then(res => {
        this.tableData = res.data
        this.tableData.forEach(i => {i.isEdit = false })
        //this.total = res.data.total
        this.Loading = false
      })
    },
    handleEdit(row) {
      //编辑 行
      this.form = row
      this.tableData.forEach(item => {
        if(item.id == row.id){
          item.isEdit = true;
        }
      })
      row.isEdit = true;
      this.tableData.push({})
      this.tableData.pop()
      this.$refs.table.doLayout()
      this.$forceUpdate();
    },
    handleDelete(id) {
      this.$confirm("点击确认将永久删除数据且无法恢复，请谨慎选择。","确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(id);
        })
        .then(() => {
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    handleSave(row) {
      //行保存
      if(row.id){
        //修改
        update(row).then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.getList()
        }, error => {
           
        });
      }else{
        //新增
        add(row).then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.getList()
        }, error => {
           
        });
      }
    },
    handleAdd() {
      if(this.deptId){
        this.tableData.push({
          deptId: this.deptId,
          deptName: this.deptName,
          groupCode: '',
          groupName: '',
          isDeleted: 0,
          remark: '',
          sort:9,
          isEdit: true
        })
      }else{
        this.$message({
          type: "warning",
          message: "请选择左侧部门!"
        });
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.xt-layout-sider {
  background-color: #f1f8fe;
  border-radius: 5px
}

::v-deep .el-tree {
  background: transparent;
  color: #46506d;
}

.theme-xintong .xt-layout .xt-layout-has-sider {
  width: 320px;
  min-width: 300px;
  max-width: 320px;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 320px;
  flex: 0 0 320px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
</style>
