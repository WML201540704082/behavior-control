<template>
  <div class="main_detail">
    <div class="xt_card">
      <div v-if="isEdit" class="d_edit">
        <el-button type="primary" @click="edit">编辑</el-button>
      </div>
      <el-tabs v-if="attrList.length > 0" v-model="activeName" class="dev_tabs">
        <el-tab-pane
          v-for="item in tabsList"
          :key="item.name"
          :label="item.name"
          :name="item.name">
          <div class="btn_box">

            <div>
              <span v-if="devDetail.collectTime">采集时间：{{ devDetail.collectTime }}</span>
              <span v-if="devDetail.dataSource">数据来源：{{ devDetail.dataSource }}</span>
            </div>

            <span style="margin-left: 15px;color: #409EFF">
              <i class="el-icon-info"></i>
              蓝色为工具自动采集
            </span>
            <div>
              <span class="xt-font">隐藏字段:</span>
              <el-switch v-model="showHide"></el-switch>
            </div>
          </div>
          <div
            class="form_body"
            v-for="(val, key) in formData[item.formName]"
            :key="key"
          >
            <div class="form_box" v-if="val.name != '隐藏字段' && val.fieldData.length > 0">
              <div class="form_tags">
                <span>{{ val.name }}</span>
              </div>
              <div class="form_item">
                <el-row style="display: flex;flex-wrap: wrap;width:100%">
                  <el-col
                    :span="6"
                    v-for="(it, index) in val.fieldData"
                    :key="index"
                    class="form_item_box"
                  >

                    <span class="form_label xt-font">
                      <span class="label_text" :class="getRequireClass(it.isXtythRequired)">{{ it.label }}:</span>
                      <!-- <i class="label_tag" v-if="it.inputType === 'at'">自</i> -->
                    </span>
                    <span
                      class="form_content_p"
                      style="color: #409EFF"
                      v-if="it.inputType === 'at' && buleTextFlag"
                    >
                      {{ devDetail[it.name] }}
                      <!-- 需求变更, 去掉角标 -->
                      <!-- <sup v-if="devDetail[it.name] != null">自动采集</sup> -->
                    </span>
                    <span class="form_content" v-else>{{ devDetail[it.name] }}</span>

                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="form_box" v-show="showHide" style="padding-right: 100px">
            <div class="form_tags">
              <span style="background: #cecece">{{ formData[item.formName].hideField.name }}</span>
            </div>
            <div class="form_item">
              <el-form
                :ref="'submitForm'+item.formName"
                :model="bookHideDetailForm"
                label-width="150px"
                label-suffix=":"
                :rules="formData[item.formName].hideField.rules"
                class="xt_form"
                :class="'submitForm'+item.formName"
              >
                <el-row>
                  <el-col
                    :span="6"
                    v-for="(it, index) in formData[item.formName].hideField.fieldData"
                    :key="index"
                  >
                    <component
                      :is="it.type + 'Formitem'"
                      :configData="it"
                      :formValue="devHideDetail"
                      :rules="formData[item.formName].hideField.rules[it.name]"
                      :disabled="formDisabled"
                    ></component>
                  </el-col>
                </el-row>
              </el-form>


            </div>
          </div>
          <div class="submit_btn">
            <el-button size="small" type="primary" plain @click="backClick()">
              返回
            </el-button>
            <template v-if="showHide">
              <el-button size="small" :type="formDisabled?'':'danger'" plain @click="mcancel">
                {{ formDisabled ? '修 改' : '取 消' }}
              </el-button>
              <el-button size="small" type="primary" @click="save(item)" v-if="!formDisabled" :loading="saveLoading">保 存</el-button>
            </template>

          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
import textFormitem from "@/components/xtform/config/textFormitem"
import numberFormitem from "@/components/xtform/config/numberFormitem"
import enumFormitem from "@/components/xtform/config/enumFormitem"
import datetimeFormitem from "@/components/xtform/config/datetimeFormitem"
import textareaFormitem from "@/components/xtform/config/textareaFormitem"
import selectFormitem from "@/components/xtform/config/selectFormitem"
import timeFormitem from "@/components/xtform/config/timeFormitem"
import dateFormitem from "@/components/xtform/config/dateFormitem"
import datetimerangeFormitem from "@/components/xtform/config/datetimerangeFormitem"
import {cientityValidate, cientityBatchsave} from "@/api/cmdb/ciConfig";

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
  props: ["bookDetailForm", "attrList", "bookHideDetailForm", 'isEdit', 'titleFormData'],
  data() {
    return {
      activeName: '基本信息',
      tabsList: [
        {
          name: '基本信息',
          active: 1,
          formName: 'basicForm'
        },
        {
          name: '运行信息',
          active: 2,
          formName: 'runForm'
        },
        {
          name: '维护信息',
          active: 3,
          formName: 'maintenanceForm'
        },
        {
          name: '服务信息',
          active: 4,
          formName: 'serviceForm'
        },
        {
          name: '仓储信息',
          active: 5,
          formName: 'storageForm'
        },
        {
          name: '资产信息',
          active: 6,
          formName: 'propertyForm'
        },
        {
          name: '安全信息',
          active: 7,
          formName: 'safeForm'
        },
        {
          name: '其它信息',
          active: 8,
          formName: 'otherForm'
        },
        // {
        //   name: '设备履历',
        //   active: 9,

        // },
      ],
      formData: {
        basicForm: {
          oneField: {name: '一类字段', fieldData: []},
          twoField: {name: '二类字段', fieldData: []},
          threeField: {name: '三类字段', fieldData: []},
          hideField: {name: '隐藏字段', fieldData: [], rules: {}},
        },
        runForm: {
          oneField: {name: '一类字段', fieldData: []},
          twoField: {name: '二类字段', fieldData: []},
          threeField: {name: '三类字段', fieldData: []},
          hideField: {name: '隐藏字段', fieldData: [], rules: {}},
        },
        maintenanceForm: {
          oneField: {name: '一类字段', fieldData: []},
          twoField: {name: '二类字段', fieldData: []},
          threeField: {name: '三类字段', fieldData: []},
          hideField: {name: '隐藏字段', fieldData: [], rules: {}},
        },
        serviceForm: {
          oneField: {name: '一类字段', fieldData: []},
          twoField: {name: '二类字段', fieldData: []},
          threeField: {name: '三类字段', fieldData: []},
          hideField: {name: '隐藏字段', fieldData: [], rules: {}},
        },
        storageForm: {
          oneField: {name: '一类字段', fieldData: []},
          twoField: {name: '二类字段', fieldData: []},
          threeField: {name: '三类字段', fieldData: []},
          hideField: {name: '隐藏字段', fieldData: [], rules: {}},
        },
        propertyForm: {
          oneField: {name: '一类字段', fieldData: []},
          twoField: {name: '二类字段', fieldData: []},
          threeField: {name: '三类字段', fieldData: []},
          hideField: {name: '隐藏字段', fieldData: [], rules: {}},
        },
        safeForm: {
          oneField: {name: '一类字段', fieldData: []},
          twoField: {name: '二类字段', fieldData: []},
          threeField: {name: '三类字段', fieldData: []},
          hideField: {name: '隐藏字段', fieldData: [], rules: {}},
        },
        otherForm: {
          oneField: {name: '一类字段', fieldData: []},
          twoField: {name: '二类字段', fieldData: []},
          threeField: {name: '三类字段', fieldData: []},
          hideField: {name: '隐藏字段', fieldData: [], rules: {}},
        },
      },
      devDetail: {},
      devHideDetail: {},
      showHide: false,
      formDisabled: true,
      saveLoading: false,
      buleTextFlag: false, //字体是否可变蓝

      xinArr: []
    }
  },
  watch: {
    attrList() {
      this.initForm()
    },
    devDetail() {
      if ((this.devDetail.deviceCategoryCode == '主机设备' ||
          this.devDetail.deviceCategoryCode == '存储设备' ||
          this.devDetail.deviceCategoryCode == '网络设备' ||
          this.devDetail.deviceCategoryCode == '安全设备' ||
          this.devDetail.deviceCategoryCode == '终端设备')
        && this.devDetail.dataSource
      ) {
        this.buleTextFlag = true
      } else {
        this.buleTextFlag = false
      }
    },
  },
  mounted() {
    this.initForm()
    this.devDetail = JSON.parse(JSON.stringify(this.bookDetailForm))
    this.devHideDetail = JSON.parse(JSON.stringify(this.bookHideDetailForm))
  },
  methods: {
    getRequireClass(isXtythRequired){
      if(isXtythRequired == 1){
        return 'isRequiredRed';
      }else if(isXtythRequired == 2){
        return 'isRequiredBlack';
      }
      return '';
    },
    initForm() {
      // console.log(789, this.attrList)


      for (let i = 0; i < this.attrList.length; i++) {
        let item = this.attrList[i]

        if( item.name == "deviceCode" || item.name == "area" || item.name == "realArea" ){
          // console.log(666, item)
          this.xinArr.push(item)
        }


        for (let j = 0; j < this.tabsList.length; j++) {
          let tabsItem = this.tabsList[j]
          if (item.groupName === tabsItem.name && item.description && item.description != null) {
            if (item.attrGrade == 'first') {
              this.formData[tabsItem.formName].oneField.fieldData.push(item)
            } else if (item.attrGrade == 'second') {
              this.formData[tabsItem.formName].twoField.fieldData.push(item)
            } else if (item.attrGrade == 'third') {
              this.formData[tabsItem.formName].threeField.fieldData.push(item)
            } else if (item.attrGrade == 'fourth') {
              this.formData[tabsItem.formName].hideField.fieldData.push(item)
              if (item.isRequired == 1) {
                this.formData[tabsItem.formName].hideField.rules[item.name] = [
                  {
                    required: true, message: item.label + '不能为空', trigger: 'blur'
                  }
                ]
              }
            }


            



            break;
          }
        }
      }
    },
    edit() {
      //使用JSON互转 防止数据源改动影响其他页面逻辑
      //let newTabsList = JSON.parse(JSON.stringify(this.tabsList));
      //let newFormData = JSON.parse(JSON.stringify(this.formData));

      // for (let i = 0; i < newTabsList.length; i++) {
      //   let newTab = newTabsList[i];
      //   newTab.fromData = [];
      //
      //
      // }

      //this.$emit('editClick', {tabsList: newTabsList, formData: newFormData,devDetail:this.devDetail});
      this.$emit('editClick');
    },
    save(val) {
      let submitForm = {
        ciId: this.devHideDetail.ciId,
        ciIcon: this.devHideDetail.icon,
        authData: this.devHideDetail.authData,
        ciLabel: this.devHideDetail.label,
        ciName: this.devHideDetail.name,
        maxAttrEntityCount: 999999999,
        maxRelEntityCount: 999999999,
        uuid: this.devHideDetail.uuid,
        id: this.devHideDetail.id,
        attrEntityData: {},
      }


      let toParams = JSON.parse(JSON.stringify(this.formData[val.formName].hideField.fieldData))
      toParams = [...toParams, ...this.xinArr]

      toParams.forEach(item => {
        let attrValue = []
        if (this.devHideDetail[item.name]) {
          if (this.devHideDetail[item.name] instanceof Array) {
            // attrValue = this.submitForm[item.name]
            if (item.type === 'datetimerange') attrValue = [this.devHideDetail[item.name][0] + ',' + this.devHideDetail[item.name][1]]
            else attrValue = this.devHideDetail[item.name]
          } else attrValue = [this.devHideDetail[item.name]]
        } else {
          attrValue = []
        }
        submitForm.attrEntityData['attr_' + item.id] = {
          type: item.type,
          valueList: attrValue,
          actualValueList: attrValue,
        }
      })
      this.$refs['submitForm' + val.formName][0].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          cientityValidate(submitForm).then(res => {
            if (res.Return.hasChange) {
              cientityBatchsave({
                needCommit: true,
                ciEntityList: [submitForm]
              }).then(res => {
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                });

                this.bookHideDetailForm = JSON.parse(JSON.stringify(this.devHideDetail))
              })
            } else {
              this.$message({
                type: 'warning',
                message: '未校验到数据修改！'
              });
            }
          }).finally(() => {
            this.formDisabled = true;
            this.saveLoading = false
            this.showHide = false;
          })
        }
      })
      // cientityValidate
    },
    mcancel() {
      if (!this.formDisabled) {
        //点了取消按钮
        this.devHideDetail = JSON.parse(JSON.stringify(this.bookHideDetailForm))
      }
      this.formDisabled = !this.formDisabled;
      if (this.formDisabled) {
        this.showHide = false;
      }
    },
    backClick() {
      // console.log(8898898, this.$route)
      if( this.$route.query.routerTitle == '设备台账详情' ){
        //返回设备台账
        this.$closePage('/assets/devStandingBook');
      }else{
        //返回资产管理
        this.$closePage('/data/assetmanager');
      }


      // if (this.isEdit) {
      //   //返回资产管理
      //   this.$closePage('/data/assetmanager');
      // } else {
      //   //返回设备台账
      //   this.$closePage('/assets/devStandingBook');
      // }
    },
  }
}
</script>

<style lang="scss" scoped>
.xt_card {
  position: relative;
}

.btn_box {
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  margin-bottom: 10px;

  span {
    margin-right: 10px;
    display: inline-block;
    vertical-align: bottom;
    height: 22px;
  }
}

.form_body {
  margin-bottom: 12px;

  &:first-child {
    border-bottom: 1px dashed #91D5FF;
  }
}

.form_box {
  display: flex;
  flex-direction: row;

  .form_tags {
    width: 120px;
    min-width: 120px;
    max-width: 120px;
    flex: 0 0 120px;
    text-align: right;

    span {
      display: inline-block;
      background: #91D5FF;
      color: #fff;
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 4px;
    }
  }

  .form_item {
    flex: auto;
    overflow-x: hidden;
    padding-left: 15px;

    .form_item_box {
      display: flex;
      flex-direction: row;
      margin-bottom: 25px;
    }

    .form_label {
      // line-height: 40px;
      font-size: 14px;
      white-space: nowrap;
      position: relative;

      .label_text {
        position: relative;
        z-index: 10;
      }

      .label_tag {
        position: absolute;
        background: #67C23A;
        color: #fff;
        font-size: 8px;
        width: 12px;
        height: 12px;
        line-height: 12px;
        text-align: center;
        font-style: normal;
        border-radius: 50%;
        display: inline-block;
        padding: 2px;
        right: -10px;
        top: 6px;
      }
    }

    .form_content {
      // line-height: 40px;
      font-size: 14px;
      color: #909399;
      padding-left: 10px;
      flex: auto;
      padding-right: 10px;
      overflow: hidden

    }

    .form_content_p {
      // line-height: 40px;
      font-size: 14px;
      color: #909399;
      padding-left: 10px;
      // flex: auto;
      padding-right: 10px;
      overflow: hidden;
      padding-right: 5px;

      sup {
        font-size: 10px;
        font-weight: 400;
        background: #F0F6FE;
        top: -10px;
        right: 0;
      }
    }
  }
}

.submit_btn {
  text-align: center
}

.d_edit {
  position: absolute;
  right: 12px;
  z-index: 1;
}

// 必填样式
.isRequiredRed::before {
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
  position: absolute;
  left: -10px;
  top: 2px;
}
// 必填样式
.isRequiredBlack::before {
  content: '*';
  color: #333333;
  margin-right: 4px;
  position: absolute;
  left: -10px;
  top: 2px;
}

.dev_tabs {
  /deep/ .el-tabs__item {
    font-size: 14px;
    font-weight: normal;
    color: #000000;
  }

  /deep/ .el-tabs__item.is-active {
    color: #0D8EFF;
    font-size: 15px;
    font-weight: bold;
  }
}

</style>
