<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="open"
      :title="getTitle(type)"
      width="720px"
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
        <el-row :gutter="12" type="flex" justify="center">
          <el-col :span="12" >
            <el-form-item label="原密码" prop="password" size="small">
              <el-input v-model="formDetial.password" placeholder="请输入原密码" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12" type="flex" justify="center">
          <el-col :span="12">
            <el-form-item label="新密码" prop="password2" size="small">
              <el-input v-model="formDetial.password2" placeholder="请输入新密码" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12" type="flex" justify="center">
          <el-col :span="12">
            <el-form-item label="确认密码" prop="password3" size="small">
              <el-input v-model="formDetial.password3" placeholder="请输入确认密码" clearable></el-input>
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
  updatePassword
} from "@/api/system/user";
import {getDeptLzayList} from "@/api/system/dept";
import {mapGetters} from "vuex";
import {getLazyTree, getAllCityList} from "@/api/base/region";

import {getRoleTree} from "@/api/system/role";
import {getPostList} from "@/api/system/post";

import {getDeptTree} from "@/api/system/dept";

export default {
  props: ['open', 'type','updateId'],
  data() {
    var password2Check = (rule, value, callback)=>{
      /*投运日期<=退运日期<=当前时间*/
      let passwordStr = this.formDetial['password3'];
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
      formDetial: {},
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
        password: [{required: true, message: '原密码不能为空', trigger: 'blur'}],
        password3: [{required: true, validator: password2Check, trigger: 'blur'}],
        password2: [{required: true, message: '新密码不能为空', trigger: 'blur'}],

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
    getRoleTree().then(res => {
      this.roleIdList = res.data;
    });
    getPostList().then(res => {
      this.postIdList = res.data
    });
    if (this.formDetial.roleId) {
      // this.checkedKeys = this.formDetial.roleId.split(',')
      // console.log('dmx', this.formDetial)
      // setTimeout(() => {
      //   this.$refs.elTree.setCheckedKeys(this.formDetial.roleId.split(','))
      //   this.handleClickCheckChange()
      // }, 600);
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
      this.$refs.submitForm.validate((valid) => {
          if (valid) {
            this.saveLoading = true
            updatePassword(this.formDetial.password,this.formDetial.password2,this.formDetial.password3,this.updateId).then(() => {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.$emit('refreshData');
              this.$emit('close');
            }).catch(err => {

            }).finally(() => {
              // this.open = false
              this.saveLoading = false
            });
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
      // console.log(data)

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
      } else if(type == 'password'){
        return '修改密码'
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
