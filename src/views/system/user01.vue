<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="xt-layout page_body">
     <div class="xt-layout-sider" :class="showSider? 'xt-layout-has-sider':'xt-layout-none-sider'">
       <el-scrollbar style="height:100%" ref="scrollbar">
         <el-tree
           ref="tree"
           :props="treeProps"
           :data="treeData"
           highlight-current
           :accordion="true"
           node-key="id"
           check-strictly
           @node-click="nodeClick"
           :default-expand-all="false"
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
        <avue-crud :option="option"
                  :table-loading="loading"
                  :data="data"
                  ref="crud"
                  v-model="form"
                  :permission="permissionList"
                  :search.sync="search"
                  @row-del="rowDel"
                  @row-update="rowUpdate"
                  @row-save="rowSave"
                  :before-open="beforeOpen"
                  :page="page"
                  @search-change="searchChange"
                  @search-reset="searchReset"
                  @selection-change="selectionChange"
                  @current-change="currentChange"
                  @size-change="sizeChange"
                  @refresh-change="refreshChange"

                  @on-load="onLoad">
          <template slot="menuLeft">
            <el-button type="danger"
                      size="small"
                      icon="el-icon-delete"
                      plain
                      v-if="permission.user_delete"
                      @click="handleDelete">删 除
            </el-button>
            <el-button type="info"
                      size="small"
                      plain
                      v-if="userInfo.authority.includes('admin')"
                      icon="el-icon-user"
                      @click="handleGrant">角色配置
            </el-button>
            <el-button type="primary"
                      size="small"
                      plain
                      v-if="permission.user_reset"
                      icon="el-icon-refresh"
                      @click="handleReset">密码重置
            </el-button>
            <el-button type="success"
                       size="small"
                       plain
                       v-if="userInfo.authority.includes('admin')"
                       icon="el-icon-upload2"
                       @click="handleImportIscUser">导入ISC用户
            </el-button>
            <el-button type="success"
                      size="small"
                      plain
                      v-if="userInfo.authority.includes('admin')"
                      icon="el-icon-upload2"
                      @click="handleImport">导入
            </el-button>
            <el-button type="warning"
                      size="small"
                      plain
                      v-if="userInfo.authority.includes('admin')"
                      icon="el-icon-download"
                      @click="handleExport">导出
            </el-button>
          </template>
          <template slot-scope="{row}"
                    slot="roleId">
            <el-tag>{{row.roleName}}</el-tag>
          </template>
          <template slot-scope="{row}"
                    slot="deptId">
            <el-tag>{{row.deptName}}</el-tag>
          </template>
        </avue-crud>
      </div>
    </div>

    <el-dialog title="用户角色配置"
               append-to-body
               :visible.sync="roleBox"
               width="345px">

      <el-tree :data="roleGrantList"
               show-checkbox
               default-expand-all
               node-key="id"
               ref="treeRole"
               :default-checked-keys="roleTreeObj"
               :props="props">
      </el-tree>

      <span slot="footer" class="dialog-footer">
            <el-button @click="roleBox = false">取 消</el-button>
            <el-button type="primary"
                       @click="submitRole">确 定</el-button>
          </span>
    </el-dialog>
    <el-dialog title="用户数据导入"
               append-to-body
               :visible.sync="excelBox"
               width="555px">
      <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
        <template slot="excelTemplate">
          <el-button type="primary" @click="handleTemplate()">
            点击下载<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </template>
      </avue-form>
    </el-dialog>
    <!-- ISC用户列表 -->
    <el-dialog :close-on-click-modal="false"
               append-to-body
               :visible.sync="isShow"
               title="ISC用户数据导入"
               width="1000px"
               top="10vh"
               v-el-drag-dialog>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryParam.queryValue" size="small">
            <el-select v-model="queryParam.queryKey" slot="prepend" placeholder="请选择" size="small"  style="width: 100px">
              <el-option label="用户姓名" value="name"></el-option>
              <el-option label="账号" value="loginName"></el-option>
              <el-option label="电话" value="tel"></el-option>
              <el-option label="邮箱" value="email"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="getIscUser"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
          ref="table"
          :data="iscTableData"
          stripe
          border
          size="small"
          :height="iscTableHeight"
          v-loading="iscTableLoading"
      >
          <el-table-column width="50" type="selection" align="center"></el-table-column>
          <el-table-column width="50" type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="用户姓名" prop="user.name" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="账号" prop="user.userName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="电话" prop="user.mobile" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="邮箱" prop="user.email" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="所属组织" prop="organization" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
            <template slot-scope="scope">
              <el-button @click="handleRegistUser(scope.row)" type="text" size="small">导入</el-button>
            </template>
          </el-table-column>
      </el-table>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {
    getList,
    getUser,
    remove,
    update,
    add,
    grant,
    resetPassword,
    iscbaseorgTree,
    userByBaseorgId,
    getAreaTree
  } from "@/api/system/user";
  import {getDeptTree} from "@/api/system/dept";
  import {getRoleTree} from "@/api/system/role";
  import {getPostList} from "@/api/system/post";
  import {iscUser} from "@/api/user";
  import {mapGetters} from "vuex";
  import website from '@/config/website';
  import {getToken} from '@/util/auth';
  import func from "@/util/func";

  export default {
    data() {
      const validatePass = (rule, value, callback) => {
          this.form.password = value
          if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
            callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        isShow: false,
        queryParam: {
          queryKey: 'name',
          queryValue: undefined
        },
        iscTableData: [],
        iscTableHeight: undefined,
        iscTableLoading: false,
        activeName: "first",
        showSider: true,
        treeProps: { //树组件配置项
          label: 'title',
          isLeaf: 'leaf'
        },
        treeData: [],
        form: {},
        search:{},
        roleBox: false,
        excelBox: false,
        loading: true,
        selectionList: [],
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        init: {
          roleTree: [],
          deptTree: [],
        },
        props: {
          label: "title",
          value: "key"
        },
        roleGrantList: [],
        roleTreeObj: [],
        option: {
          // height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          selection: true,
          viewBtn: true,
          height: '600px',
          column: [
            {
              label: "登录账号",
              prop: "account",
              search: true,
              rules: [{
                required: true,
                message: "请输入登录账号",
                trigger: "blur"
              }],
              span: website.tenantMode ? 12 : 24,
            },
            {
              label: "所属租户",
              prop: "tenantId",
              type: "tree",
              dicUrl: "/api/idevelop-system/tenant/select",
              props: {
                label: "tenantName",
                value: "tenantId"
              },
              hide: !website.tenantMode,
              addDisplay: website.tenantMode,
              editDisplay: website.tenantMode,
              viewDisplay: website.tenantMode,
              search: false,
              rules: [{
                required: true,
                message: "请输入所属租户",
                trigger: "click"
              }]
            },
            {
              label: '密码',
              prop: 'password',
              hide: true,
              editDisplay: false,
              viewDisplay: false,
              rules: [{required: true, validator: validatePass, trigger: 'blur'}]
            },
            {
              label: '确认密码',
              prop: 'password2',
              hide: true,
              editDisplay: false,
              viewDisplay: false,
              rules: [{required: true, validator: validatePass2, trigger: 'blur'}]
            },
            {
              label: "用户昵称",
              prop: "name",
              rules: [{
                required: true,
                message: "请输入用户昵称",
                trigger: "blur"
              }]
            },
            {
              label: "用户姓名",
              prop: "realName",
              search: true,
              rules: [{
                required: true,
                message: "请输入用户姓名",
                trigger: "blur"
              }]
            },
            {
              label: "所属角色",
              prop: "roleId",
              multiple: true,
              type: "tree",
              dicData: [],
              props: {
                label: "title"
              },
              slot: true,
              checkStrictly: true,
              rules: [{
                required: true,
                message: "请选择所属角色",
                trigger: "click"
              }]
            },
            {
              label: "所属部门",
              prop: "deptId",
              type: "tree",
              multiple: false,
              dicData: [],
              props: {
                label: "title",
                value: 'id'
              },
              slot: true,
              checkStrictly: true,
              rules: [{
                required: true,
                message: "请选择所属部门",
                trigger: "click"
              }]
            },
            {
              label: "所属区域",
              prop: "regionCode",
              type: "tree",
              multiple: false,
              dicData: [],
              props: {
                label: "name",
                value: 'id'
              },
              slot: true,
              checkStrictly: true,
              rules: [{
                required: true,
                message: "请选择所属区域",
                trigger: "click"
              }]
            },
            {
              label: "用户编号",
              prop: "code",
              hide: true,
            },
            {
              label: "所属岗位",
              prop: "postId",
              type: "tree",
              multiple: true,
              dicData: [],
              hide: true,
              props: {
                label: "postName",
                value: "id"
              },
              // rules: [{
              //   required: true,
              //   message: "请选择所属岗位",
              //   trigger: "click"
              // }],
            },
            {
              label: "身份证",
              prop: "idcard",
              overHidden: true
            },
            {
              label: "手机号码",
              prop: "phone",
              overHidden: true
            },
            {
              label: "电子邮箱",
              prop: "email",
              hide: true,
              overHidden: true
            },
            {
              label: "用户性别",
              prop: "sex",
              type: "select",
              dicData: [
                {
                  label: "男",
                  value: 1
                },
                {
                  label: "女",
                  value: 2
                },
                {
                  label: "未知",
                  value: 3
                }
              ],
              hide: true
            },
            {
              label: "用户生日",
              type: "date",
              prop: "birthday",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
              hide: true
            },
            {
              label: "所属标签",
              prop: "tag",
              type: "select",
              dicData: [
                {
                  label: "数字化部",
                  value: '1'
                },
                {
                  label: "其他",
                  value: '2'
                }
              ],
              hide: true
            },
            {
              label: "账号状态",
              prop: "statusName",
              hide: true,
              display: false
            },
            {
              label: "用户类型",
              prop: "userType",
              hide: true,
              display: false,
              search: true,
              type: "select",
              dicData: [
                {
                  label: "自建",
                  value: 1
                },
                {
                  label: "ISC",
                  value: 2
                }
              ],
            }
          ]
        },
        data: [],
        excelForm: {},
        excelOption: {
          submitBtn: false,
          emptyBtn: false,
          column: [
            {
              label: '模板上传',
              prop: 'excelFile',
              type: 'upload',
              drag: true,
              loadText: '模板上传中，请稍等',
              span: 24,
              propsHttp: {
                res: 'data'
              },
              tip: '请上传 .xls,.xlsx 标准格式文件',
              action: "/api/idevelop-user/import-user"
            },
            {
              label: '模板下载',
              prop: 'excelTemplate',
              formslot: true,
              span: 24,
            }
          ]
        }
      };
    },
    watch: {
      'form.tenantId'() {
        if (this.form.tenantId !== '') {
          getDeptTree(this.form.tenantId).then(res => {
            const column = this.findObject(this.option.column, "deptId");
            column.dicData = res.data;
          });
          getRoleTree(this.form.tenantId).then(res => {
            const column = this.findObject(this.option.column, "roleId");
            column.dicData = res.data;
          });
          getPostList(this.form.tenantId).then(res => {
            const column = this.findObject(this.option.column, "postId");
            column.dicData = res.data;
          });
        }
      },
    },
    computed: {
      ...mapGetters(["userInfo", "permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.user_add, false),
          viewBtn: this.vaildData(this.permission.user_view, false),
          delBtn: this.vaildData(this.permission.user_delete, false),
          editBtn: this.vaildData(this.permission.user_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
    },
    mounted() {
      this.getTreeData()
      this.setPageContentHeight()
      // this.getIscUser()
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
          // if(node.level != 0) {
          //   userByBaseorgId({baseorgId: form.value}).then(req => {
          //     return resolve(req.data.concat(res.data))
          //   })
          // }else {
          //   return resolve(res.data)
          // }
          setTimeout(() => {
            this.$refs.scrollbar.update()
          }, 500)
          return resolve(res.data)
        })
      },
      nodeClick(data, node) {
        this.query.deptId = data.id
        this.onLoad(this.page, this.query);
      },
      // getList() {
      //   this.tableLoading = true
      //   devBookList(this.searchForm).then(res => {
      //     this.tableData = res.data.tbodyList
      //     this.tableCol = res.data.theadList
      //     this.total = res.data.rowNum
      //     this.tableLoading = false
      //   }).catch(() => {
      //     this.tableLoading = false
      //   })
      // },
      submitRole() {
        const roleList = this.$refs.treeRole.getCheckedKeys().join(",");
        grant(this.ids, roleList).then(() => {
          this.roleBox = false;
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.onLoad(this.page);
        });
      },
      rowSave(row, done, loading) {
        row.deptId = func.join(row.deptId);
        row.roleId = func.join(row.roleId);
        row.postId = func.join(row.postId);
        if(row.userType === '' || row.userType === undefined || row.userType === null){
            row.userType = '1'
        }
        //todo 先写死 后面有空处理
        row.tenantId = '000000'
        add(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
           
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        row.deptId = func.join(row.deptId);
        row.roleId = func.join(row.roleId);
        row.postId = func.join(row.postId);
        update(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
           
          loading();
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        let deptId = this.query.deptId
        params.deptId = deptId
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      handleReset() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("您确定账号密码重置?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return resetPassword(this.ids);
          })
          .then(res => {
            this.$message({
              type: "success",
              message: '您的新密码为:' + res.data
            });
            this.$refs.crud.toggleSelection();
          });
      },
      handleGrant() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.roleTreeObj = [];
        if (this.selectionList.length === 1) {
          this.roleTreeObj = this.selectionList[0].roleId.split(",");
        }
        getRoleTree().then(res => {
          this.roleGrantList = res.data;
          this.roleBox = true;
        });
      },
      handleImport() {
        this.excelBox = true;
      },
      handleImportIscUser(){
        this.isShow = true
      },
      uploadAfter(res, done, loading, column) {
        // window.console.log(column);
        done();
        this.excelBox = false;
        this.refreshChange();
      },
      handleExport() {
        this.$confirm("是否导出用户数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          window.open(`/api/idevelop-user/export-user?idevelop-auth=${getToken()}&account=${this.search.account}&realName=${this.search.realName}`);
        });
      },
      handleTemplate() {
        window.open(`/api/idevelop-user/export-template?idevelop-auth=${getToken()}`);
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getUser(this.form.id).then(res => {
            this.form = res.data;
            // if(this.form.hasOwnProperty("deptId")){
            //   this.form.deptId = this.form.deptId.split(",");
            // }
            if(this.form.hasOwnProperty("roleId")){
              this.form.roleId = this.form.roleId.split(",");
            }
            if(this.form.hasOwnProperty("postId")){
              this.form.postId = this.form.postId.split(",");
            }
          });
        }
        done();
      },
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
        getDeptTree(this.form.tenantId).then(res => {
          const column = this.findObject(this.option.column, "deptId");
          column.dicData = res.data;
        });
        getRoleTree(this.form.tenantId).then(res => {
          const column = this.findObject(this.option.column, "roleId");
          column.dicData = res.data;
        });
        getPostList(this.form.tenantId).then(res => {
          const column = this.findObject(this.option.column, "postId");
          column.dicData = res.data;
        });
        getAreaTree({code: '37'}).then(res => {
          const column = this.findObject(this.option.column, "regionCode");
          column.dicData = res.data;
        })
      },
      // 获取ISC用户
      getIscUser() {
        this.iscTableLoading = true
        iscUser(this.queryParam.queryKey, this.queryParam.queryValue).then(res => {
          if(res.success) {
            this.iscTableData = res.data
          }
            this.iscTableLoading = false
        }).catch(err => {
            this.iscTableLoading = false
        })
      },
      // 注册系统用户
      handleRegistUser(row) {
        // 初始化表单数据
        this.form.account = row.user.userName
        this.form.name = row.user.name
        this.form.realName = row.user.name
        this.form.phone = row.user.mobile
        this.form.name = row.user.name
        this.form.email = row.user.email
        // ISC用户
        this.form.userType = "2"
        this.$refs.crud.rowAdd()
      },
    }
  };
</script>

<style lang="scss" scoped>
::v-deep .el-tree-node>.el-tree-node__children{
  overflow: visible;
}
::v-deep .el-scrollbar__wrap{
  overflow-x: inherit;
}
.xt-layout-has-sider{
    width: 260px!important;
    min-width: 260px!important;
    max-width: 260px!important;
    flex: 0 0 260px!important;
    transition: all 0.3s;
}
::v-deep .el-button--text{
  padding: 0
}
</style>
