<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="新增"
      width="700px"
      top="10vh"
      v-el-drag-dialog
    >
      <el-form
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
        size="small"
        label-suffix=":"
        label-width="100px"
        v-loading="pageLoading"
      >
         <el-form-item label="模型选择" prop="cmdbCiId">
          <el-select v-model="submitForm.cmdbCiId" @change="cmdbCiIdChange" clearable filterable
                     placeholder="请选择模型选择">
            <el-option
              v-for="item in cmdbCiIdList"
              :value="item.cmdbCiId"
              :key="item.cmdbCiId"
              :label="item.cmdbCiName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="i6000属性" prop="i6000AttrCode">
          <el-select v-model="submitForm.i6000AttrCode" :disabled="!submitForm.cmdbCiId" @change="i6000AttrCodeChange" clearable filterable
                     placeholder="请选择i6000属性">
            <el-option
              v-for="item in i6000AttrCodeList"
              :value="item.attrCode"
              :key="item.attrCode"
              :label="item.attrName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="cmdb属性" prop="cmdbAttrCode">
          <el-select v-model="submitForm.cmdbAttrCode" :disabled="!submitForm.cmdbCiId" @change="cmdbAttrCodeChange" clearable filterable
                     placeholder="请选择cmdb属性">
            <el-option
              v-for="item in cmdbAttrCodeList"
              :value="item.attrName"
              :key="item.attrName"
              :label="item.attrLabel"
            >
            </el-option>
          </el-select>
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
  import {globalattrDetail, globalattrSave, cmdbciattrList, i6000ciattrList, i6000Mapping} from "@/api/system/modelMapping";

  export default {
    props: ['isShow', 'arrtId', 'showType'],
    data() {
      return {
        cmdbCiIdList: [],
        cmdbAttrCodeList: [],
        i6000AttrCodeList: [],
        submitForm: {
          i6000AttrCode: undefined,
          i6000Datatype: undefined,
          i6000Expan: undefined,
          i6000OriType: undefined,
          i6000Origin: undefined,
          cmdbAttrCode: undefined,
          cmdbAttrLabel: undefined,
          cmdbAttrType: undefined,
        },
        rules: {
          cmdbAttrCode: [
            {required: true, message: 'cmdb属性不能为空', trigger: 'change'},
          ],
          i6000AttrCode: [
            {required: true, message: 'i6000属性不能为空', trigger: 'change'},
          ]
        },
        pageLoading: false,
        saveLoading: false
      }
    },
    mounted() {
      this.getDict()
      this.getDetail()
    },
    methods: {
      cmdbCiIdChange(val) {
        this.submitForm.i6000AttrCode = undefined
        this.submitForm.i6000Datatype = undefined
        this.submitForm.i6000Expan = undefined
        this.submitForm.i6000OriType = undefined
        this.submitForm.i6000Origin = undefined
        this.submitForm.cmdbAttrCode = undefined
        this.submitForm.cmdbAttrLabel = undefined
        this.submitForm.cmdbAttrType = undefined

        let obj = this.cmdbCiIdList.filter(el => {
          return el.cmdbCiId == val
        })[0]
        this.submitForm.cmdbCiName = obj.cmdbCiName
        this.submitForm.i6000CiId = obj.i6000CiId

        this.getCmdbList(obj)
      },
      cmdbAttrCodeChange(val) {
        let obj = this.cmdbAttrCodeList.filter(el => {
          return el.attrName == val
        })[0]
        this.submitForm.cmdbAttrLabel = obj.attrLabel
        this.submitForm.cmdbAttrType = obj.attrTypeText
      },
      i6000AttrCodeChange(val) {
        let obj = this.i6000AttrCodeList.filter(el => {
          return el.attrCode == val
        })[0]
        this.submitForm.i6000Datatype = obj.datatypeName
        this.submitForm.i6000Expan = obj.attrName
        this.submitForm.i6000OriType = obj.oriType
        this.submitForm.i6000Origin = obj.origin
      },
      getCmdbList(obj){
        cmdbciattrList({
          size: 500,
          current: 1,
          ciId: obj.cmdbCiId
        }).then(res => {
          this.cmdbAttrCodeList = res.data.records
        })
        i6000ciattrList({
          size: 500,
          current: 1,
          isMapping: 0,
          ciCode: obj.i6000CiId
        }).then(res => {
          this.i6000AttrCodeList = res.data.records
        })
      },
      getDict() {
        i6000Mapping().then(res=>{
          this.cmdbCiIdList = res.data
        })

      },

      // 详情
      getDetail() {
        if (this.showType != '新增') {
          this.pageLoading = true
          globalattrDetail({id: this.arrtId}).then(res => {
            this.pageLoading = false
            this.submitForm = res.data
            this.submitForm.cmdbCiId = this.submitForm.cmdbCiId.toString()

            this.getCmdbList(this.submitForm)
          }).catch(() => {
            this.pageLoading = false
          })
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

</style>
