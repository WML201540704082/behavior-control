<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="新增"
      width="650px"
      top="10vh"
      v-el-drag-dialog
    >
      <el-form
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
        size="small"
        label-suffix=":"
        label-width="130px"
        v-loading="pageLoading"
      >
        <el-form-item label="维护工厂" prop="swerk">
          <el-select v-model="submitForm.swerk" @change="swerkChange" :disabled="!(userDetail.regionCode === '37') || showType=='修改'" filterable clearable placeholder="请选择维护工厂">
            <el-option
              v-for="dict in swerkList"
              :key="dict.code"  :label="dict.name" :value="dict.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能位置名称" prop="pltxt">
          <el-input
            placeholder="请输入功能位置名称"
            v-model="submitForm.pltxt"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="功能位置编码" prop="trlnr">
          <el-input
            style="width: 400px;margin-right: 10px;"
            placeholder="请生成功能位置编码"
            v-model="submitForm.trlnr"
            clearable
          ></el-input>
          <el-button :disabled="showType=='修改'" type="primary" size="mini" @click="buildCode">生成编码</el-button>
        </el-form-item>
        <div class="submit_btn">
          <el-button type="primary" size="small" @click="save" :loading="saveLoading">保 存</el-button>
          <el-button size="small" @click="$emit('close')">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {globalattrDetail, globalattrSave, erpmaintainList, buildCode} from "@/api/assets/functionPosition";

  export default {
    props: ['isShow', 'arrtId', 'showType'],
    data() {
      return {
        operationList: [
          {
            dictKey: 'C',
            dictValue: '创建'
          },
          {
            dictKey: 'M',
            dictValue: '修改'
          },
          {
            dictKey: 'D',
            dictValue: '删除'
          },
        ],
        beberList: [
          {
            dictKey: '003',
            dictValue: '省公司'
          },
          {
            dictKey: '004',
            dictValue: '县公司'
          },
        ],
        swerkList: [],
        cmdbCiIdList: [],
        cmdbAttrCodeList: [],
        i6000AttrCodeList: [],
        submitForm: {
          trlnr: undefined
        },
        rules: {
          swerk: [
            {required: true, message: '维护工厂不能为空', trigger: 'change'},
          ],
          pltxt: [
            {required: true, message: '功能位置名称不能为空', trigger: 'blur'},
          ],
          trlnr: [
            {required: true, message: '功能位置编码不能为空', trigger: 'change'},
          ]
        },
        pageLoading: false,
        saveLoading: false
      }
    },
    computed: {
      ...mapGetters(['userDetail'])
    },
    mounted() {
      this.getDict()
      this.getDetail()
    },
    methods: {
      swerkChange(){
        this.submitForm.trlnr = undefined
      },
      buildCode(){
        buildCode({ swerk: this.submitForm.swerk }).then(res=>{
          this.submitForm.trlnr = res.msg
        })
      },

      getDict() {

        erpmaintainList({ current: 1, size: 200 }).then(res=>{
          this.swerkList = res.data.records
        })

      },

      // 详情
      getDetail() {
        if (this.showType != '新增') {
          this.pageLoading = true
          globalattrDetail({trlnr: this.arrtId}).then(res => {
            this.pageLoading = false
            this.submitForm = res.data
          }).catch(() => {
            this.pageLoading = false
          })
        }else{
          this.submitForm.swerk = this.userDetail.erpUnitCode;
        }
      },
      // 保存
      save() {
        this.$refs.submitForm.validate((valid) => {
          if (valid) {
            this.saveLoading = true
            globalattrSave(this.submitForm).then(res => {
              this.saveLoading = false
              this.$message({
                type: 'success',
                message: '保存成功！'
              });
              this.$emit('saveGlobalArrt')
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-input.is-disabled .el-input__inner{
    color: #606266;
  }
</style>
