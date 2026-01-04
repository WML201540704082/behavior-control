<template>
  <div>
    <div v-if="!isInfo">
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check"
                 @click="submitForm">保存
      </el-button>
    </div>

    <div>
      <el-form :disabled="isInfo" style="margin-top: 10px;padding-right: 5px" :rules="rules" label-width="140px" ref="form" :model="form" :status-icon="true">
        <el-row>
          <el-col>
            <el-form-item label="父级督察单位名称:" prop="parentId">
              <el-cascader
                ref="aaa"
                :options="options"
                :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name', children: 'children' }"
                v-model="form.parentId"
                @change="add1"
                clearable>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="区域编码:" prop="regionCode">
              <el-input
                placeholder=""
                clearable
                size="large"
                v-model="form.regionCode"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="区域名称:" prop="regionName">
              <el-input
                placeholder=""
                clearable
                size="large"
                v-model="form.regionName"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="督察单位名称:" prop="name">
              <el-input
                placeholder=""
                clearable
                size="large"
                v-model="form.name"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-row>-->
<!--          <el-col>-->
<!--            <el-form-item label="隐患内容:" prop="content">-->
<!--              <el-input-->
<!--                placeholder=""-->
<!--                clearable-->
<!--                size="mini"-->
<!--                v-model="form.content"-->
<!--                type="textarea"-->
<!--                rows="10">-->
<!--              </el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
      </el-form>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {securityId, securityAdd, securityEdit, categoryTree} from "@/api/safeDanger/supervisionUnit"
import { getAreaTree } from "@/api/safeDanger/networkSecure"

export default {
  name: "ComputerRoomDetail",
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
    ]),
  },
  props: {
    roomId: {
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表单参数
      form: {
        parentId: undefined,
        regionName: undefined,
        regionCode: undefined,
        name: undefined
      },
      queryDisabled: {
        isSupervision: false,
        isContent: false
      },

      options: [],
      //校验
      rules: {
        parentId: [{required: true, message: '请选择父级督察单位名称', trigger: 'change'}],
        regionCode: [{required: true, message: '请输入区域编码', trigger: 'blur'}],
        regionName: [{required: true, message: '请输入区域名称', trigger: 'blur'}],
        name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
      },

      parentDis: false
    }
  },
  created() {
    this.initData()
    this.showInfo();
  },
  mounted() {

  },
  methods: {
    add1(vall){
      // console.log(132, vall)
      // let current1 = this.$refs["aaa"].getCheckedNodes()[0]
      // this.form.parentId = current1.data.parentId
      // this.form.regionName = current1.data.name

      // setTimeout(() => {
      //   console.log(222, this.$refs["aaa"].getCheckedNodes())
        
      // }, 2000);
    },
    initData() {
      categoryTree({}).then(res=>{
        // this.basicUnitSeconds = res.data
        this.options = res.data
      })

      // categoryTree({
      //   pageNum: 1,
      //   pageSize: 50
      // }).then(response => {
      //   this.options = response.data
      // })
    },
    showInfo() {
      // this.resetForm("form");
      if (this.roomId) {
        securityId(this.roomId).then(response => {
          let datas = Object.assign({}, response.data)
          // if (datas.parentId === 0) {
          //   datas.parentId = undefined
          // }
          this.form = datas
        })
      }
    },
    /** 提交按钮 */
    submitForm: function () {

      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.roomId) {
            // if(!this.form.parentId){
            //   this.form.parentId = undefined
            // }
            securityEdit(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.$emit('closeRoom')
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            securityAdd(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.$emit('closeRoom')
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}

.el-select {
  width: 100%;
}

.el-input {
  width: 100%;
}

.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100% !important;
}

.el-col-24 {
  height: 50px;
}
</style>
