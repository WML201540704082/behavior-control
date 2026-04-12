<template>
  <div>
    <div v-if="!isInfo">
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check"
                 @click="submitForm">保存
      </el-button>
    </div>

    <div>
      <el-form :disabled="isInfo" style="margin-top: 10px;padding-right: 5px" :rules="rules" label-width="105px" ref="form" :model="form" :status-icon="true">
        <el-row>
          <el-col>
            <el-form-item label="隐患分类:" prop="parentId">
              <!-- :disabled=" roomId && !form.parentId " -->
              <!-- <el-select v-model="form.parentId" placeholder="" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select> -->

              <el-cascader
                :options="options"
                :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name', children: 'children' }"
                v-model="form.parentId"
                clearable>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="分类名称:" prop="name">
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
import {securityId, securityAdd, securityEdit, categoryTree} from "@/api/safeDanger/hiddenCategory"

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
        category: undefined,
        content: undefined,
        supervision: undefined,
        supervisionPoint: undefined
      },
      queryDisabled: {
        isSupervision: false,
        isContent: false
      },

      options: [],
      //校验
      rules: {
        category: [{required: true, message: '请填写或选择分类', trigger: 'change'}],
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
    initData() {
      categoryTree({
        pageNum: 1,
        pageSize: 50
      }).then(response => {
        // let arr = []
        // let datas = response.data
        // console.log(77777777)
        // function xunhuan(datas){
        //   datas.forEach(el=>{
        //     arr.push({
        //       id: el.id,
        //       name: el.name,
        //     })
        //     if(el.hiddenCategoryVOList){
        //       xunhuan(el.hiddenCategoryVOList)
        //     }
        //   })
        // }
        // xunhuan(datas)

        // response.data.forEach(ele => {
        //   ele.id = Number(ele.id)
        // });
        this.options = response.data
      })
    },
    showInfo() {
      // this.resetForm("form");
      if (this.roomId) {
        securityId(this.roomId).then(response => {
          let datas = Object.assign({}, response.data)
          // datas.parentId = datas.parentId.toString()
          if (datas.parentId === '0') {
            datas.parentId = undefined
          }
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
