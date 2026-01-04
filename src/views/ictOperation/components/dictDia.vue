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
      <!-- :class="[type==='see'?'e_see':'e_edit']" -->
      <el-form ref="submitForm"
               v-if="formDetial"
               :model="formDetial"
               :rules="rules"
               label-suffix=":"
               label-width="120px"
               size="small"
               v-loading="loading"
               :disabled="type==='see'"
      >
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="知识分类名称" prop="dictValue" size="small">
              <el-input v-model="formDetial.dictValue" placeholder="请输入知识分类名称" clearable :maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级部门" prop="parentId" size="small">
              <el-cascader
                :options="options"
                :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'title' }"
                v-model="formDetial.parentId"
                clearable
                style="width: 100%">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="知识分类键值" prop="dictKey" size="small">
              <el-input type="number" v-model="formDetial.dictKey" placeholder="请输入知识分类键值" clearable :maxlength="500"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="部门全称" prop="fullName" size="small">
              <el-input v-model="formDetial.fullName" placeholder="请输入部门全称" clearable></el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="上级部门" prop="parentName" size="small">
              <el-select v-model="formDetial.parentName" placeholder="请选择上级部门" clearable>
                <template slot="empty">
                  <div class="d_tree">
                    <el-input v-model="filterSjbmText" placeholder="请输入关键字进行过滤" class="i_filter" v-if="false"></el-input>
                    <el-tree ref="sjbmTree"
                             :data="sjbmList"
                             :props="defaultSjbmProps"
                             lazy
                             :load="sjbmLoadNode"
                             @node-click="sjbmNodeClick"
                             node-key="id"
                             highlight-current
                             :default-expand-all="false"
                             :filter-node-method="filterNode"></el-tree>
                  </div>
                </template>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="排序" prop="sort" size="small">
              <el-input v-model="formDetial.sort" type="number" placeholder="请输入排序" clearable></el-input>
            </el-form-item>
          </el-col> -->


        </el-row>
        <div class="form-btn d_end" v-if="type !== 'see'">
          <el-button type="primary" error @click="submit" :loading="saveLoading">保 存</el-button>
          <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { knowledgeTree, collectDelete } from "@/api/ictOperation/index"
import { erpDeptList, erpUnitList, getDeptLzayList, i6000deptList, i6000UnitList} from "@/api/system/dept";
import {add, getDict, getDictTree, getList, remove, update} from "@/api/system/dict";
import {mapGetters} from "vuex";
import {getLazyTree} from "@/api/base/region";

export default {
  props: ['isShow', 'type', 'formDetial'],
  data() {
    return {
      saveLoading: false,
      loading: false,
      filterSjbmText: null,
      filterSsqyText: null,
      filterErpText: null,
      filterI6000Text: null,
      sjbmList: null,
      ssqyList: null,
      erpList: null,
      i6000List: null,
      defaultSjbmProps: {children: 'children', label: 'deptName', isLeaf: 'leaf'},
      defaultSsqyProps: {children: 'children', label: 'title', isLeaf: 'leaf'},
      defaultErpProps: {children: 'childrenList', label: 'name', isLeaf: 'leaf', disabled: 'disabled'},
      defaultI6000Props: {children: 'childrenList', label: 'name', isLeaf: 'leaf', disabled: 'disabled'},

      typeList: null,
      rules: {
        dictValue: [{required: true, message: '知识分类名称不能为空', trigger: 'blur'}],
        parentId: [{required: true, message: '上级部门不能为空', trigger: 'change'}],
        dictKey: [{required: true, message: '知识分类键值不能为空', trigger: 'blur'}]
      },

      options: []

    };
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  watch: {
    'filterSjbmText'(newVal, oldVal) {
      this.$refs.sjbmTree.filter(newVal);
    },
    'filterSsqyText'(newVal, oldVal) {
      this.$refs.ssqyTree.filter(newVal);
    },
    'filterErpText'(newVal, oldVal) {
      this.$refs.erpTree.filter(newVal);
    },
    'filterI6000Text'(newVal, oldVal) {
      this.$refs.i6000Tree.filter(newVal);
    },
    // 'formDetial.type'(newVal, oldVal) {
    //   if (newVal === 'CORP') {
    //     this.erpList.forEach(item => {
    //       item.disabled = false
    //     })
    //     this.i6000List.forEach(item => {
    //       item.disabled = false
    //     })
    //   } else {
    //     this.erpList.forEach(item => {
    //       item.disabled = true
    //     })
    //     this.i6000List.forEach(item => {
    //       item.disabled = true
    //     })
    //   }

    //   this.formDetial.erpObj = null;
    //   this.formDetial.erpUnit = null;
    //   this.formDetial.erpUnitCode = null;

    //   this.formDetial.i6000Obj = null;
    //   this.formDetial.i6000Unit = null;
    //   this.formDetial.i6000UnitCode = null;
    // }
  },
  mounted() {
    //加载上级部门列表
    knowledgeTree({}).then(res => {
      this.options = res.data
    })

    this.getList();

    // this.$nextTick(() => {
    //   if (this.type === 'edit' || this.type === 'see') {
    //     this.formDetial.erpObj = this.formDetial.erpUnit;
    //     this.formDetial.i6000Obj = this.formDetial.i6000Unit;
    //     this.formDetial.regionFullName = this.formDetial.regionName;
    //   } else if (this.type === 'addchildren') {
    //     //新增子项
    //     this.formDetial = {
    //       parentName: this.formDetial.deptName,
    //       parentId: this.formDetial.id
    //     };
    //   }
    //   this.$refs.submitForm.$forceUpdate()
    //   this.$forceUpdate()
    // });
  },
  methods: {
    submit() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          if (this.type === 'add' || this.type === 'addchildren') {
            this.formDetial.code = 'control_knowledge_type'
            this.formDetial.sort = '0'
            add(this.formDetial).then(() => {
              this.$message({
                type: "success",
                message: "新增成功!"
              });
              this.$emit('refreshData');
              this.$emit('close');
            }).catch(err => {

            }).finally(() => {
              this.saveLoading = false
            });
          } else {
            this.formDetial.code = 'control_knowledge_type'
            update(this.formDetial).then(() => {
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
    getList() {
      //部门类型
      this.typeList = [
        {name: "公司", id: 'CORP'},
        {name: "部门", id: 'DEPT'},
        {name: "班组", id: 'TEAM'},
      ];
    },
    initUnits(list) {
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.id === this.formDetial.parentId) {
          this.formDetial.parentName = item.deptName;
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
          if(this.type === 'edit' || this.type === 'see'){
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
    sjbmNodeClick(data, node) {
      this.formDetial.parentId = data.id;
      this.formDetial.parentName = data.deptName;
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
        return '编 辑';
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
  pointer-events: none;
}

</style>
