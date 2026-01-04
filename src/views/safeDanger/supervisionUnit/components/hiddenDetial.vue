<template>
  <div>
    <div v-if="!(type=='see')">
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check"
                 @click="submitForm">保存
      </el-button>
    </div>

    <div>
      <el-form :disabled="type=='see'" style="margin-top: 10px;padding-right: 5px" :rules="rules" label-width="105px" ref="form" :model="form" :status-icon="true">
        <el-row>
          <el-col>
            <el-form-item label="所属分类:">
              <el-input v-model="category" size="mini" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="分类标准:" prop="type">
              <el-select v-model="form.type" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="隐患内容:">
              <el-input
                placeholder="请输入"
                clearable
                size="mini"
                v-model="form.content"
                type="textarea"
                maxlength="500"
                rows="9"
                show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {hiddenAdd, hiddenUpdate} from "@/api/safeDanger/hiddenCategory"
// import {getHiddenPCDict} from "@/utils/hiddenDict";

export default {
  name: "ComputerRoomHiddenDetail",
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
    ]),
  },
  props: {
    category: {
      type: String,
      default: null
    },
    roomId: {
      default: false
    },
    type: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // 表单参数
      form: {
        categoryId: undefined,
        type: undefined,
        content: undefined,
      },
      // options: getHiddenPCDict,
      options: [],
      //校验
      rules: {
        type: [{required: true, message: '分类标准不能为空', trigger: 'change'}],
        content: [{required: true, message: '隐患内容不能为空', trigger: 'blur'}],
      },
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
      this.form.categoryId = this.roomId;
    },
    showInfo() {
      // this.resetForm("form");
      if (this.type == 'edit') {
        this.form = JSON.parse(JSON.stringify(this.info));
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.type == 'add') {
            hiddenAdd(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.$emit('closeRoom')
              } else {
                this.msgError(response.msg);
              }
            });
          } else if (this.type == 'edit') {
            hiddenUpdate(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.$emit('closeRoom')
              } else {
                this.msgError(response.msg);
              }
            });
          } 
          // else if (this.type == 'delete') {}
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
