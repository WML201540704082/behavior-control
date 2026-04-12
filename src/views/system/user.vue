<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="xt-layout page_body">
      <div class="xt-layout-sider" :class="showSider? 'xt-layout-has-sider':'xt-layout-none-sider'">
        <el-scrollbar style="height:100%" ref="scrollbar">
          <div>
            <el-input placeholder="输入关键字进行过滤" size="mini" v-model="filterText" clearable style="margin-bottom: 12px"></el-input>
            <el-tree
              ref="tree"
              :props="treeProps"
              :data="treeData"
              highlight-current
              :accordion="true"
              node-key="id"
              check-strictly
              @node-click="nodeClick"
              :filter-node-method="filterNode">
                <span class="custom-tree-node" slot-scope="{node, data}">
                  <span :title="node.label"> {{ node.label }} </span>
                </span>
            </el-tree>
          </div>
        </el-scrollbar>
      </div>
      <div class="xt-layout-content" style="padding: 0px 0px 0px 20px">
        <el-form :model="queryParams" label-suffix=":" label-width="80px" size="small">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item label="登录账号" size="small">
                <el-input v-model="queryParams.account" placeholder="请输入登录账号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户姓名" size="small">
                <el-input v-model="queryParams.realName" placeholder="请输入用户姓名" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户类型" clearable>
                <el-select v-model="queryParams.userType" clearable placeholder="请选择用户类型">
                  <el-option v-for="dict in userTypeList" :key="dict.dictValue" :label="dict.dictKey" :value="dict.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-button type="primary" plain size="small" @click="onLoad">查 询</el-button>
              <el-button size="small" plain @click="searchReset">清空</el-button>
              <el-button type="success" plain size="small" @click="handleAdd">新 增</el-button>
              <el-button type="danger" plain size="small" @click="handleDelete">删 除</el-button>

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

            </el-col>
          </el-row>
        </el-form>
        <!-- 设备列表 -->
        <el-table ref="table"
                  :data="data"
                  border
                  size="small"
                  height="68vh"
                  @selection-change="selectionChange"
                  v-loading="loading">
          <el-table-column type="selection" width="30" fixed="left" align="center"></el-table-column>
          <el-table-column label="登录账号" prop="account" show-overflow-tooltip align="left" width="200"></el-table-column>
          <el-table-column label="用户昵称" prop="name" show-overflow-tooltip align="left" width="200"></el-table-column>
          <el-table-column label="用户姓名" prop="realName" show-overflow-tooltip align="left" width="200"></el-table-column>
          <el-table-column label="所属角色" prop="roleId" show-overflow-tooltip align="left" width="200">
            <template slot-scope="scope">
              <div>
                <el-tag> {{ scope.row.roleName }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="所属部门" prop="deptId" show-overflow-tooltip align="left" width="200">
            <template slot-scope="scope">
              <div>
                <el-tag> {{ scope.row.deptName }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="所属区域" prop="regionCode" show-overflow-tooltip align="left" width="200">
            <template slot-scope="scope">
              <div>
                <!-- {{ getRegionCode(scope.row.regionCode) }}  -->
                {{ scope.row.regionName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="身份证" prop="idcard" show-overflow-tooltip align="left" width="200"></el-table-column>
          <el-table-column label="手机号码" prop="phone" show-overflow-tooltip align="left" width="200"></el-table-column>

          <!-- <el-table-column label="是否为部门" prop="type" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <span>{{ getTypeName(scope.row.type) }}</span>
            </template>
          </el-table-column> -->


          <el-table-column label="操作" width="160" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-view" @click="handleSee(scope.row)">查看</el-button>
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit1(scope.row)">修改密码</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="rowDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="page.total"
          :page.sync="page.currentPage"
          :limit.sync="page.pageSize"
          @pagination="onLoad"
        />
      </div>
    </div>


    <dept-manager :is-show="deptManagerParams.isShow"
                  v-if="deptManagerParams.isShow"
                  :type="deptManagerParams.type"
                  :form-detial="deptManagerParams.formDetial"
                  :deptId="deptIdd"
                  @close="componentClose"
                  @refreshData="refreshData"></dept-manager>

    <password :open="deptManagerParams.open"
              v-if="deptManagerParams.open"
              :type="deptManagerParams.type"
              :form-detial="deptManagerParams.formDetial"
              :deptId="deptIdd"
              :updateId = "updateId"
              @close="componentClose"
              @refreshData="refreshData"></password>

    <el-dialog title="用户角色配置"
               append-to-body
               :visible.sync="roleBox"
               width="345px">

      <el-tree :data="roleGrantList"
               show-checkbox
               default-expand-all
               node-key="id"
               ref="treeRole"
               check-strictly
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
            <el-select v-model="queryParam.queryKey" slot="prepend" placeholder="请选择" size="small" style="width: 100px">
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
import deptManager from "./components/user/index.vue";
import password from "./components/user/password.vue";
import {getAllCityList} from "@/api/base/region";

export default {
  components: {deptManager,password},
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
      updateId:undefined,
      filterText: null,
      deptIdd: undefined,
      ssqyList: [],
      deptName: '',
      regionCode: '',
      expandKeys: [],

      selectObj: {},

      queryParams: {},
      userTypeList: [
        {
          dictKey: "自建",
          dictValue: 1
        },
        {
          dictKey: "ISC",
          dictValue: 2
        }
      ],
      roleIdArr: [],
      regionCodeArr: [],
      deptManagerParams: {
        isShow: false,
        open: false,
        type: 'add',
        formDetial: {
          password: '',
          password2: '',
          idcard: '',
          realName: '',
          // deptId: this.queryParams.deptId,
          // deptName: this.deptName
        },
      },


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
      search: {},
      roleBox: false,
      excelBox: false,
      loading: false,
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
    filterText(val) {
      this.$refs.tree.filter(val);
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
    this.onLoad();
    this.getTreeData()
    this.setPageContentHeight()
    // this.getIscUser()

    getAllCityList('37').then(res => {
      this.ssqyList = res.data;
    });
  },
  methods: {
    componentClose() {
      this.deptManagerParams = {
        isShow: false,
        open:false,
        type: 'add',
        formDetial: {
          password: '',
          password2: '',
          idcard: '',
          realName: '',
          // deptId: this.queryParams.deptId,
          // deptName: this.deptName
        },
      }
    },
    refreshData() {
      this.onLoad();
      // this.getTreeData()
    },


    getRegionCode(str) {
      function aaa(arr) {

        let select = arr.filter(el => el.id == str)[0]
        if (select) {
          return select.name
        }

        for (let index = 0; index < arr.length; index++) {
          if (arr[index].children) {
            return aaa(arr[index].children)
          }
        }

      }

      return aaa(this.regionCodeArr)
    },
    getRoleId(str) {
      let arr = str.split(',')

      arr = arr.map(el => {
        // console.log(898989, this.roleIdArr.filter(ell => ell.value == el))
        let select = this.roleIdArr.filter(ell => ell.value == el)
        return select[0] ? select[0].title : ''
      })
      return arr.join(',')
    },
    getDeptIds(str) {
      return str.split(',')
    },


    getTreeData() {
      getDeptTree(this.form.tenantId).then(res => {
        this.expandKeys = [res.data[0].id]
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
      if (node.level === 0) {
        form.type = 'id'
        form.value = "1"
      } else {
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
      // console.log(9090, data)

      // this.queryParams.deptId = data.id
      this.deptIdd = data.id
      // this.queryParams.regionCode = data.value
      this.deptName = data.title
      this.regionCode = data.value
      this.selectObj = data
      this.onLoad();
    },
    filterNode(value, data, node) {
      if (!value) return true;

      let parentNode = node.parent;
      let labels = [node.label];
      let level = 1;

      while (level < node.level) {
        labels = [...labels, parentNode.label]
        parentNode = parentNode.parent;
        level++;
      }
      return labels.some((label) => label.indexOf(value) !== -1);
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
        this.onLoad();
      });
    },
    rowSave(row, done, loading) {
      row.deptId = func.join(row.deptId);
      row.roleId = func.join(row.roleId);
      row.postId = func.join(row.postId);
      if (row.userType === '' || row.userType === undefined || row.userType === null) {
        row.userType = '1'
      }
      //todo 先写死 后面有空处理
      row.tenantId = '000000'
      add(row).then(() => {
        done();
        this.onLoad();
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
        this.onLoad();
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
          this.page.currentPage = 1
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    searchReset() {
      this.queryParams = {};
      this.onLoad();
    },
    handleAdd() {
      let namme = undefined
      if (this.regionCode) {
        namme = this.ssqyList.filter(el => el.code == this.regionCode)[0]
        namme = namme.name
      }


      this.deptManagerParams = {

        isShow: false,
        type: 'add',
        formDetial: {
          password: '',
          password2: '',
          idcard: '',
          realName: '',
          deptId: this.deptIdd,
          deptName: this.deptName,
          regionCode: this.regionCode,
          regionName: namme,
          tag: '1'
        },


      }

      this.deptManagerParams.type = 'add';
      this.deptManagerParams.isShow = true;
    },


    handleSee(row) {
      this.deptManagerParams.type = 'see';
      row.password2 = row.password
      this.deptManagerParams.formDetial = row;
      this.deptManagerParams.isShow = true;
    },

    handleEdit(row) {
      this.deptManagerParams.type = 'edit';
      row.password2 = row.password
      this.deptManagerParams.formDetial = row;
      this.deptManagerParams.isShow = true;
    },
    handleEdit1(row) {
      this.deptManagerParams.type = 'password';
      row.password2 = row.password
      this.deptManagerParams.formDetial = row;
      this.deptManagerParams.open = true;
      this.updateId = row.id
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
          this.page.currentPage = 1
          this.onLoad();
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
    handleImportIscUser() {
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
          if (this.form.hasOwnProperty("roleId")) {
            this.form.roleId = this.form.roleId.split(",");
          }
          if (this.form.hasOwnProperty("postId")) {
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
      this.onLoad();
    },
    onLoad(page, params = {}) {

      // getDeptTree(this.form.tenantId).then(res => {
      //   const column = this.findObject(this.option.column, "deptId");
      //   column.dicData = res.data;
      // });
      getRoleTree(this.form.tenantId).then(res => {
        // const column = this.findObject(this.option.column, "roleId");
        // column.dicData = res.data;

        this.roleIdArr = res.data
      });
      // getPostList(this.form.tenantId).then(res => {
      //   const column = this.findObject(this.option.column, "postId");
      //   column.dicData = res.data;
      // });
      getAreaTree({code: '37'}).then(res => {
        // const column = this.findObject(this.option.column, "regionCode");
        // column.dicData = res.data;
        // console.log(80, res)
        this.regionCodeArr = res.data


        this.loading = true;


        this.addIds()

        getList(this.page.currentPage, this.page.pageSize, this.queryParams).then(res => {
          const data = res.data;
          let neirong = data.records
          // neirong.forEach(el=>{
          //   el.regionName = this.getRegionCode(el.regionCode)
          // })
          this.page.total = data.total;
          this.data = neirong;
          this.loading = false;
        });

      })
    },
    addIds() {

      let strr = []

      function aaa(arr) {
        arr.forEach(ele => {
          strr.push(ele.id)
          if (ele.children) {
            aaa(ele.children)
          }
        })
      }

      strr.push(this.selectObj.id)
      if (this.selectObj.children) aaa(this.selectObj.children)
      this.queryParams.deptId = strr.join(',')
    },
    // 获取ISC用户
    getIscUser() {
      this.iscTableLoading = true
      iscUser(this.queryParam.queryKey, this.queryParam.queryValue).then(res => {
        if (res.success) {
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
::v-deep .el-tree-node > .el-tree-node__children {
  overflow: visible;
}

::v-deep .el-scrollbar__wrap {
  overflow-x: inherit;
}

.xt-layout-has-sider {
  width: 260px !important;
  min-width: 260px !important;
  max-width: 260px !important;
  flex: 0 0 260px !important;
  transition: all 0.3s;
}

::v-deep .el-button--text {
  padding: 0;
}

.custom-tree-node {
  font-size: 14px;
  display: flex;
}

.custom-tree-node span {
  display: inline-block;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
