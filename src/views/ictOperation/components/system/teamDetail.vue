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
            <el-form-item label="类型" prop="type" size="small">
              <el-select v-model="formDetial.type" placeholder="请选择类型" @change="typeChange">
                  <el-option v-for="(item,index) in typeList"
                             :key="item.label"
                             :label="item.label"
                             :value="item.label"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员" prop="userId" size="small">
              <el-select v-model="formDetial.userId" clearable filterable :disabled="!formDetial.type" placeholder="请选择人员">
                  <el-option v-for="(item,index) in userList"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="知识分类键值" prop="dictKey" size="small">
              <el-input v-model="formDetial.dictKey" placeholder="请输入知识分类键值" clearable></el-input>
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
import { controloperationteamUser, controloperationteamSave, collectDelete } from "@/api/ictOperation/index"
import { erpDeptList, erpUnitList, getDeptLzayList, i6000deptList, i6000UnitList} from "@/api/system/dept";
import {add, getDict, getDictTree, getList, remove, update} from "@/api/system/dict";
import {mapGetters} from "vuex";
import {getLazyTree} from "@/api/base/region";

export default {
  props: ['isShow', 'type', 'detailId'],
  data() {
    return {
      formDetial: {},

      saveLoading: false,
      loading: false,
      

      rules: {
        type: [{required: true, message: '类型不能为空', trigger: 'change'}],
        userId: [{required: true, message: '人员不能为空', trigger: 'change'}],
      },

      typeList: [
        {
          label: '地市运维团队',
          value: '地市运维团队'
        },
        {
          label: '省运维团队',
          value: '省运维团队'
        },
      ],
      userList: []

    };
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  watch: {
    // 'filterSjbmText'(newVal, oldVal) {
    //   this.$refs.sjbmTree.filter(newVal);
    // }
  },
  mounted() {
    //加载上级部门列表
    // knowledgeTree({}).then(res => {
    //   this.options = res.data
    // })
    // console.log('formDetial', this.formDetial)



  },
  methods: {
    typeChange(val){
      controloperationteamUser({ type: val }).then(res=>{
        this.userList = res.data
      })
    },
    submit() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          if (this.type === 'add') {
            controloperationteamSave(this.formDetial).then(() => {
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
