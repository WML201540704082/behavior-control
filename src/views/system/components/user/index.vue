<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      :title="getTitle(type)"
      width="1024px"
      top="10vh"
      v-el-drag-dialog>
      <el-form ref="submitForm"
               v-if="formDetial"
               :model="formDetial"
               :rules="rules"
               label-suffix=":"
               label-width="120px"
               size="small"
               v-loading="loading"
               :class="[type==='see'?'e_see':'e_edit']">
        <!-- :disabled="type==='see'? true : false" -->
        <el-row :gutter="12">
          <el-col :span="24">
            <el-form-item label="登录账号" prop="account" size="small">
              <el-input v-model="formDetial.account" @blur="accountInput" placeholder="请输入登录账号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password" size="small" v-if="type=='see'">
              <el-input v-model="formDetial.password" placeholder="请输入密码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="password2" size="small" v-if="type=='see'">
              <el-input v-model="formDetial.password2" placeholder="请输入确认密码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="name" size="small">
              <el-input v-model="formDetial.name" @blur="nameInput" placeholder="请输入用户昵称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="realName" size="small">
              <el-input v-model="formDetial.realName" placeholder="请输入用户姓名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属角色" prop="roleId" size="small">
              <el-select v-model="labelCom" @remove-tag="removeTag" multiple placeholder="请选择角色" clearable>
                <template slot="empty">
                  <div class="d_tree">
                    <el-input v-model="filterSjjsText" placeholder="请输入关键字进行过滤" class="i_filter" clearable></el-input>
                    <el-tree
                      ref="elTree"
                      node-key="id"
                      :props="{children: 'children', label: 'title', isLeaf: 'leaf'}"
                      :data="roleIdList"
                      show-checkbox
                      @check-change="handleClickCheckChange"
                      check-strictly
                      :filter-node-method="filterNode"></el-tree>

                  </div>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="deptName" size="small">
              <el-select v-model="formDetial.deptName" placeholder="请选择所属部门" clearable>
                <template slot="empty">
                  <div class="d_tree">
                    <el-input v-model="filterSjbmText" placeholder="请输入关键字进行过滤" class="i_filter" clearable></el-input>
                    <el-tree ref="sjbmTree"
                             :data="sjbmList"
                             :props="defaultSjbmProps"

                             @node-click="sjbmNodeClick"
                             node-key="id"
                             highlight-current
                             :default-expand-all="false"
                             :filter-node-method="filterNode"></el-tree>

                    <!-- lazy
                    :load="sjbmLoadNode" -->
                  </div>
                </template>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属区域" prop="regionName" size="small">
              <el-select ref="ssqySel" v-model="formDetial.regionName" placeholder="请选择所属区域" clearable disabled>
                <template slot="empty">
                  <div class="d_tree">
                    <el-input v-model="filterSsqyText" placeholder="请输入关键字进行过滤" class="i_filter"></el-input>
                    <el-tree ref="ssqyTree"
                             :data="ssqyList"
                             :props="defaultSsqyProps"
                             @node-click="ssqyNodeClick"
                             node-key="id"
                             highlight-current
                             :default-expand-all="false"
                             :filter-node-method="filterNode"></el-tree>
                    <!--                    <el-tree ref="ssqyTree"-->
                    <!--                             :data="ssqyList"-->
                    <!--                             :props="defaultSsqyProps"-->
                    <!--                             lazy-->
                    <!--                             :load="ssqyLoadNode"-->
                    <!--                             @node-click="ssqyNodeClick"-->
                    <!--                             node-key="id"-->
                    <!--                             highlight-current-->
                    <!--                             :accordion="true"-->
                    <!--                             :default-expand-all="false"-->
                    <!--                             :filter-node-method="filterNode"></el-tree>-->
                  </div>
                </template>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="用户编号" prop="code" size="small">
              <el-input v-model="formDetial.code" placeholder="请输入用户编号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属岗位" prop="postId" size="small">
              <el-select
                v-model="formDetial.postId"
                multiple
                placeholder="请选择"
                clearable>
                <el-option
                  v-for="(item, index) in postIdList"
                  :key="item.id"
                  :label="item.postName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证" prop="idcard" size="small">
              <el-input v-model="formDetial.idcard" placeholder="请输入身份证" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone" size="small">
              <el-input v-model="formDetial.phone" placeholder="请输入手机号码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email" size="small">
              <el-input v-model="formDetial.email" placeholder="请输入电子邮箱" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别" prop="sex" size="small">
              <el-select
                v-model="formDetial.sex"
                placeholder="请选择"
                clearable>
                <el-option
                  v-for="(item, index) in sexList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户生日" prop="birthday" size="small">
              <el-date-picker v-model="formDetial.birthday" type="datetime" placeholder="" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属标签" prop="tag" size="small">
              <el-select
                v-model="formDetial.tag"
                placeholder="请选择"
                clearable>
                <el-option
                  v-for="(item, index) in tagList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户类型" prop="userType" size="small">
              <el-select
                v-model="formDetial.userType"
                placeholder="请选择用户类型"
                clearable>
                <el-option
                  v-for="(item, index) in userTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="form-btn d_end" v-if="type !== 'see'">
          <el-button type="primary" error @click="submit" :loading="saveLoading">{{ getTitle(type) }}</el-button>
          <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
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
  getAreaTree,
} from "@/api/system/user";
import {getDeptLzayList} from "@/api/system/dept";
import {mapGetters} from "vuex";
import {getLazyTree, getAllCityList} from "@/api/base/region";

import {getRoleTree} from "@/api/system/role";
import {getPostList} from "@/api/system/post";

import {getDeptTree} from "@/api/system/dept";

export default {
  props: ['isShow', 'type', 'formDetial'],
  data() {
    var password2Check = (rule, value, callback)=>{
      /*投运日期<=退运日期<=当前时间*/
      let passwordStr = this.formDetial['password'];
      let password2Str = this.formDetial['password2'];
      if (!password2Str) {
        callback(new Error('确认密码不能为空'));
        return;
      } else {
        if( passwordStr == password2Str ){
          callback();
        }else{
          callback(new Error('确认密码不一致'));
        }
      }


    }

    return {
      postIdList: [],
      roleIdList: [],
      bbba: [],
      sexList: [
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
      tagList: [
        {
          label: "数字化部",
          value: '1'
        },
        {
          label: "其他",
          value: '2'
        }
      ],
      userTypeList: [
        {
          label: "自建用户",
          value: '1'
        },
        {
          label: "ISC用户",
          value: '2'
        }
      ],
      checkedKeys: [],
      saveLoading: false,
      loading: false,
      filterSjjsText: null,
      filterSjbmText: null,
      filterSsqyText: null,
      filterErpText: null,
      filterI6000Text: null,
      sjbmList: null,
      ssqyList: null,
      erpList: null,
      i6000List: null,
      defaultSjbmProps: {children: 'children', label: 'title', isLeaf: 'leaf'},
      defaultSsqyProps: {children: 'children', label: 'name', isLeaf: 'leaf'},
      defaultErpProps: {children: 'childrenList', label: 'name', isLeaf: 'leaf', disabled: 'disabled'},
      defaultI6000Props: {children: 'childrenList', label: 'name', isLeaf: 'leaf', disabled: 'disabled'},
      typeList: [
        {name: "公司", id: 'CORP'},
        {name: "部门", id: 'DEPT'},
        {name: "班组", id: 'TEAM'},
      ],
      rules: {
        account: [{required: true, message: '登录账号不能为空', trigger: 'blur'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
        password2: [{required: true, validator: password2Check, trigger: 'blur'}],
        name: [{required: true, message: '用户昵称不能为空', trigger: 'blur'}],
        realName: [{required: true, message: '用户姓名不能为空', trigger: 'blur'}],
        roleId: [{required: true, message: '所属角色不能为空', trigger: 'blur'}],
        deptName: [{required: true, message: '所属部门不能为空', trigger: 'blur'}],
        regionName: [{required: true, message: '所属区域不能为空', trigger: 'blur'}],
        postId: [{required: true, message: '所属岗位不能为空', trigger: 'blur'}],
        idcard: [{required: true, message: '身份证不能为空', trigger: 'blur'}],
        phone: [{required: true, message: '手机号码不能为空', trigger: 'blur'}],
        userType: [{required: true, message: '用户类型不能为空', trigger: 'blur'}],
        tag: [{required: true, message: '所属标签不能为空', trigger: 'change'}],
      },

    };
  },
  computed: {
    ...mapGetters(["userDetail"]),
    labelCom() {
      return this.bbba.map(el => el.title)
    }
  },
  watch: {
    filterSjbmText(val) {
      this.$refs.sjbmTree.filter(val);
    },
    filterSjjsText(val) {
      this.$refs.elTree.filter(val);
    },
    filterSsqyText(val) {
      this.$refs.ssqyTree.filter(val);
    }
  },
  mounted() {
    let shuju = JSON.parse(JSON.stringify(this.formDetial))
    shuju.sex = shuju.sex < 0 ? undefined : shuju.sex
    // console.log(765, shuju)
    this.formDetial = shuju


    getRoleTree().then(res => {
      this.roleIdList = res.data;
    });
    getPostList().then(res => {
      this.postIdList = res.data
    });


    if (this.formDetial.roleId) {
      // this.checkedKeys = this.formDetial.roleId.split(',')
      // console.log('dmx', this.formDetial)
      setTimeout(() => {
        this.$refs.elTree.setCheckedKeys(this.formDetial.roleId.split(','))
        this.handleClickCheckChange()
      }, 600);
    }
    if (this.formDetial.postId) {
      this.formDetial.postId = this.formDetial.postId.split(',')
    }

    getDeptTree(this.formDetial.tenantId).then(res => {
      this.sjbmList = res.data;
    });

    getAllCityList('37').then(res => {
      this.ssqyList = res.data;
    });
  },
  methods: {
    accountInput(val) {
      this.formDetial.idcard = this.formDetial.account
    },

    nameInput(val) {
      this.formDetial.realName = this.formDetial.name
    },

    submit() {

      this.formDetial.roleId = this.bbba.map(el => el.id).join(',')


      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          if (this.type === 'add' || this.type === 'addchildren') {


            if (this.formDetial.userType === '' || this.formDetial.userType === undefined || this.formDetial.userType === null) {
              this.formDetial.userType = '1'
            }
            //todo 先写死 后面有空处理
            this.formDetial.tenantId = '000000'
            // this.formDetial.sex = ''

            let params = JSON.parse(JSON.stringify(this.formDetial))
            params.roleId = this.bbba.map(el => el.id).join(',')
            params.postId = params.postId.join(',')
            add(params).then(() => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.$emit('refreshData');
              this.$emit('close');
            }).catch(err => {

            }).finally(() => {
              this.saveLoading = false
            });


            // this.formDetial.roleId = this.bbba.map(el=> el.id).join(',')
            // add(this.formDetial).then(() => {
            //   this.$message({
            //     type: "success",
            //     message: "新增成功!"
            //   });
            //   this.$emit('refreshData');
            //   this.$emit('close');
            // }).catch(err => {

            // }).finally(() => {
            //   this.saveLoading = false
            // });
          } else {
            let params = JSON.parse(JSON.stringify(this.formDetial))
            params.roleId = this.bbba.map(el => el.id).join(',')
            params.postId = params.postId.join(',')
            update(params).then(() => {
              this.$message({
                type: "success",
                message: "更新成功!"
              });
              this.$emit('refreshData');
              this.$emit('close');
            }).catch(err => {

            }).finally(() => {
              this.saveLoading = false
            });
          }
        }
      })
    },

    initUnits(list) {
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.id === this.formDetial.deptId) {
          this.formDetial.deptName = item.deptName;
        } else {
          if (item.children && item.children.length > 0) {
            this.initUnits(item.children)
          }
        }
      }
    },
    sjbmLoadNode(node, resolve) {
      if (node.level == 0) {
        //请求上级部门列表
        getDeptLzayList({type: 'CORP'}).then(res => {
          // //获取上级部门名称
          if (this.type === 'edit' || this.type === 'see') {
            this.initUnits(res.data);
          }
          resolve(res.data);
        })
      } else {
        let data = node.data;
        if (data) {
          if (data.type === 'CORP') {
            if (data.children && data.children.length > 0) {
              resolve(data.children)
            } else {
              //加载部门
              getDeptLzayList({type: 'DEPT', parentId: data.id}).then(res => {
                resolve(res.data)
              }).catch(err => {
                resolve([])
              })
            }
          } else if (data.type === 'DEPT') {
            if (data.children && data.children.length > 0) {
              resolve(data.children)
            } else {
              //加载班组
              getDeptLzayList({type: 'TEAM', parentId: data.id}).then(res => {
                //加载到班组不在显示展开按钮
                res.data.forEach((a) => {
                  a.leaf = true;
                })
                resolve(res.data)
              }).catch(err => {
                resolve([])
              })
            }
          }
        }
      }
    },
    removeTag(val) {
      let shengyu = this.bbba.filter(el => el.title != val)
      this.bbba = shengyu
      this.$refs.elTree.setCheckedNodes(shengyu)
    },
    handleClickCheckChange(data, checked, indeterminate) {
      // console.log(555, this.$refs.elTree.getCheckedNodes())
      let zhi = this.$refs.elTree.getCheckedNodes()
      this.bbba = zhi
      // this.formDetial.roleId = zhi.map(el=> el.id)
      // this.formDetial.roleName = zhi.map(el=> el.title)

    },
    sjbmNodeClick(data, node) {

      this.formDetial.deptId = data.id;
      this.formDetial.deptName = data.title;

      let namme = this.ssqyList.filter(el=>el.code == data.value)[0]
      this.formDetial.regionName = namme.name;
      this.formDetial.regionCode = data.value;

      this.$refs.submitForm.$forceUpdate()
      this.$forceUpdate()
    },

    ssqyLoadNode(node, resolve) {
      if (node.level == 0) {
        //所属区域
        let dType = 'area';
        if (this.userDetail.regionCode.length == 6) {
          dType = 'city'
        }
        resolve([{
          title: this.userDetail.regionName || '山东省',
          id: this.userDetail.regionCode || '37',
          hasChildren: true,
          type: dType
        }])
      } else {
        let data = node.data;
        if (data) {
          getLazyTree(data.id).then(res => {
            res.data.forEach(item => {
              if (item.id.length == 6) {
                item.type = 'city'
                item.leaf = true
              } else {
                item.type = 'area'
              }
            })
            return resolve(res.data)
          })
        }
      }
    },
    ssqyNodeClick(data, node) {
      // let parentNode = node.parent;
      // let labels = [node.label];
      // while (parentNode && parentNode.level != 0) {
      //   labels.unshift(parentNode.label)
      //   parentNode = parentNode.parent;
      // }
      //
      // console.log(data)
      // this.formDetial.regionFullName = labels.join('/');
      // this.formDetial.regionName = data.title;
      // this.formDetial.regionCode = data.id;
      //
      // this.$refs.submitForm.$forceUpdate()
      // this.$forceUpdate()

      // this.formDetial.regionFullName = `${data.provinceName}/${data.cityName}/${data.districtName}`;
      this.formDetial.regionName = data.name;
      this.formDetial.regionCode = data.code;
      // this.formDetial.regionCode = data.districtCode;

      // console.log(this.formDetial)
      this.$refs.submitForm.$forceUpdate()
      this.$forceUpdate()

      this.$refs.ssqySel.blur();
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

    getTitle(type) {
      if (type == 'add' || type == 'addchildren') {
        return '新 增';
      } else if (type == 'edit') {
        return '更 新';
      } else if (type == 'see') {
        return '详 情';
      }
      return null;
    },
  }
  ,
}
</script>
<style scoped lang="scss">
::v-deep .el-date-editor {
  width: 100%;
}

.d_tree {
  padding: 12px;
  height: 300px;
  overflow-y: auto;
}

.i_filter {
  margin-bottom: 12px;
}

.s_disabled {
  font-size: 14px;
  color: #a1a1a1;
  display: block;
  margin-bottom: 3px;
}

.s_default {
  font-size: 14px;
  color: #000000;
  display: block;
  margin-bottom: 3px;
}

.e_see {
  pointer-events: none !important;

  ::v-deep .el-input__suffix-inner {
    pointer-events: none !important;
  }
}

.e_edit {

}
</style>
