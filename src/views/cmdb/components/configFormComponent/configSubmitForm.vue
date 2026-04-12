<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="配置表单"
      width="1000px"
      top="10vh"
      v-el-drag-dialog
    >
      <div v-loading="pageLoading">
        <el-form
          ref="submitForm"
          :model="submitForm"
          label-width="150px"
          label-position="left"
          label-suffix=":"
          size="small"
          :rules="rules"
          :disabled="showType == '详情'"
          style="padding-right: 20px"
        >
          <scrollbarBox>
            <el-collapse v-model="activeNames">
              <el-collapse-item v-if="globalAttrList.length > 0" title="全局属性" name="1">
                <el-form-item
                  v-for="(item, index) in globalAttrList"
                  :key="index"
                  :label="item.label"

                >
                  <el-radio-group v-model="submitForm[item.name]" v-if="!item.isMultiple">
                    <el-radio
                      v-for="it in item.itemList"
                      :key="it.id"
                      :label="it.sort"
                    >{{ it.value }}</el-radio>
                  </el-radio-group>
                  <el-checkbox-group v-model="submitForm[item.name]" v-else>
                    <el-checkbox
                      v-for="it in item.itemList"
                      :key="it.id"
                      :label="it.sort"
                    >{{ it.value }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item v-if="manualEntryAttrList.length > 0" title="人工录入" name="2">
                <component
                  v-for="(item, index) in manualEntryAttrList"
                  :key="index"
                  :is="item.type + 'Formitem'"
                  :configData="item"
                  :formValue="submitForm"
                  :disabled="showType == '详情'"
                ></component>
              </el-collapse-item>
              <el-collapse-item v-if="autoEntryAttrList.length > 0" title="自动录入" name="3">

              </el-collapse-item>

              <el-collapse-item title="变更说明" name="4">
                <el-form-item label="变更说明">
                  <el-input v-model="submitForm.description" type="textarea" :rows="5"></el-input>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </scrollbarBox>

          <div class="submit_btn" v-if="showType != '详情'">
            <el-button type="primary" size="small" @click="save(true)" :loading="saveLoading">提交</el-button>
            <!-- <el-button type="primary" size="small" @click="save(false)" :loading="saveLoading">保存事务</el-button> -->

            <el-button size="small" @click="$emit('close')">取 消</el-button>
          </div>

        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ciListglobalattr, cientityValidate, cientityBatchsave, cientityDetail } from "@/api/cmdb/ciConfig";
import { cilistattr, ciDetail } from "@/api/system/ciModel";
import textFormitem from "@/components/xtform/config/textFormitem"
import numberFormitem from "@/components/xtform/config/numberFormitem"
import enumFormitem from "@/components/xtform/config/enumFormitem"
import datetimeFormitem from "@/components/xtform/config/datetimeFormitem"
import textareaFormitem from "@/components/xtform/config/textareaFormitem"
import selectFormitem from "@/components/xtform/config/selectFormitem"
import timeFormitem from "@/components/xtform/config/timeFormitem"
import dateFormitem from "@/components/xtform/config/dateFormitem"
import datetimerangeFormitem from "@/components/xtform/config/datetimerangeFormitem"

import md5 from 'js-md5';
const uuid = require('uuid');

export default {
  components: {
    textFormitem,
    numberFormitem,
    enumFormitem,
    datetimeFormitem,
    textareaFormitem,
    selectFormitem,
    timeFormitem,
    dateFormitem,
    datetimerangeFormitem
  },
  props: ["isShow", "showType", "configId", "ciId"],
  data() {
    return{
      pageLoading: false,
      activeNames: ['1', '2', '3', '4'],
      submitForm: {
        attrEntityData: {},
        globalAttrEntityData: {},
      },
      rules: {},
      globalAttrList: [],
      manualEntryAttrList: [], //人工录入
      autoEntryAttrList: [], //自动录入
      saveLoading: false,
    }
  },
  async mounted() {
    this.pageLoading = true
    await this.getCiDetail()
    await this.initForm()
    if(this.showType != '新增') {
      await this.getDetail()
    }
    this.pageLoading = false

  },
  methods: {
    async getDetail() {
      await cientityDetail({
        ciEntityId: this.configId,
        ciId: this.ciId,
        limitAttrEntity: false,
        limitRelEntity: false,
        needAction: true,
      }).then(res => {
        let resData = res.Return
        this.submitForm.uuid = resData.uuid
        this.submitForm.id = resData.id
        // 回显全局属性
        for(let key in resData.globalAttrEntityData) {
          if(this.submitForm[resData.globalAttrEntityData[key].name] === '' && resData.globalAttrEntityData[key].valueList.length > 0) {
            this.globalAttrList.forEach(item => {
              if(item.name == resData.globalAttrEntityData[key].name) {
                item.itemList.forEach(it => {
                  if(it.id == resData.globalAttrEntityData[key].valueList[0].id) this.submitForm[resData.globalAttrEntityData[key].name] = it.sort
                })
              }
            })
          }
          if(this.submitForm[resData.globalAttrEntityData[key].name] instanceof Array && resData.globalAttrEntityData[key].valueList.length > 0) {
            this.globalAttrList.forEach(item => {
              if(item.name == resData.globalAttrEntityData[key].name) {
                item.itemList.forEach(it => {
                  resData.globalAttrEntityData[key].valueList.forEach(ii => {
                    if(ii.id == it.id) this.submitForm[resData.globalAttrEntityData[key].name].push(it.sort)
                  })
                })
              }
            })
          }
        }
        // 回显人工录入属性
        for(let key in resData.attrEntityData) {
          let dataItem = resData.attrEntityData[key]
          if(dataItem.type == 'datetimerange') {
            this.$set(this.submitForm, dataItem.name, dataItem.valueList[0].split(','))
          }else {
            this.$set(this.submitForm, dataItem.name, dataItem.valueList[0])
          }
        }
      })
    },
    async getCiDetail() {
      await ciDetail({
        id: this.ciId,
        needAction: true
      }).then(res => {
        let resData = res.Return
        this.submitForm.ciId = resData.id
        this.submitForm.ciIcon = resData.icon
        this.submitForm.authData = resData.authData
        this.submitForm.ciLabel = resData.label
        this.submitForm.ciName = resData.name,
        this.submitForm.maxAttrEntityCount = 999999999
        this.submitForm.maxRelEntityCount = 999999999
      })
    },
    async initForm() {
      // 获得全局属性
      await ciListglobalattr({
        allowEdit: 1,
        ciId: this.ciId,
        isActive: 1,
      }).then(res => {
        this.globalAttrList = res.Return
        this.globalAttrList.forEach(item => {
          this.$set(this.submitForm, item.name, item.isMultiple? [] : '')
        })
        this.$forceUpdate()
      })

      // 获得自定义属性
      await cilistattr({
        allowEdit: 1,
        ciId: this.ciId,
      }).then(res => {
        for(let i=0; i<res.Return.length; i++) {
          let item = res.Return[i]
          if(item.isRequired) {
            this.rules[item.name] = [
              {
                required: true, message: item.label + '不能为空', trigger: 'blur'
              }
            ]
          }
          this.manualEntryAttrList.push(item)
          // if(item.inputType === "at") {
          //   this.autoEntryAttrList.push(item)
          // }else if(item.inputType === "mt") {
          //   this.manualEntryAttrList.push(item)
          // }
        }
      })
    },
    changeAttr() {
      this.$forceUpdate()
    },
    // 保存按钮
    save(val) {
      this.saveLoading = true
      // 处理全局属性
      for(let i=0; i<this.globalAttrList.length; i++) {
        let item = this.globalAttrList[i]
        if(item.isMultiple) {
          let vlaueList = []
          this.submitForm[item.name].forEach(it => {
            vlaueList.push(item.itemList[it-1])
          })
          this.submitForm.globalAttrEntityData['global_' + item.id] = {
            valueList: vlaueList
          }
        }else {
          this.submitForm.globalAttrEntityData['global_' + item.id] = {
            valueList: this.submitForm[item.name] === '' ? [] : [
              item.itemList[this.submitForm[item.name]-1]
            ]
          }

        }
      }

      // 处理人工录入属性
      this.manualEntryAttrList.forEach(item => {
        let attrValue = []
        if(this.submitForm[item.name]) {
          if(this.submitForm[item.name] instanceof Array) {
            // attrValue = this.submitForm[item.name]
            if(item.type === 'datetimerange') attrValue = [this.submitForm[item.name][0] + ',' + this.submitForm[item.name][1]]
            else attrValue = this.submitForm[item.name]
          }
          else attrValue = [this.submitForm[item.name]]
        }else {
          attrValue = []
        }
        this.submitForm.attrEntityData['attr_' + item.id] = {
          type: item.type,
          valueList: attrValue,
          actualValueList: attrValue,
        }
      })

      this.saveLoading = false
      this.$refs.submitForm.validate((valid) => {
        if(valid) {
          if(this.showType == '新增') this.submitForm.uuid = md5(uuid.v4())

          this.saveLoading = true
          cientityValidate(this.submitForm).then(res => {
            if(res.Return.hasChange) {
              cientityBatchsave({
                needCommit: val,
                ciEntityList: [this.submitForm]
              }).then(res => {
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                });
                this.$emit('saveConfigItem')
                this.saveLoading = false
              }).catch(() => {
                this.saveLoading = false
              })
            }else{
              this.saveLoading = false
              this.$emit('close')
            }
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
::v-deep .el-collapse-item__content{
  padding-top: 25px;
  padding-left: 20px
}
</style>
