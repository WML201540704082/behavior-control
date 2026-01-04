<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="添加模型"
      width="700px"
      top="10vh"
      v-el-drag-dialog
    >
      <scrollbarBox>
        <el-form
          ref="submitForm"
          :model="submitForm"
          :rules="rules"
          size="small"
          label-suffix=":"
          label-width="100px"
          style="padding-right:20px"
        >
          <el-form-item label="图标" prop="icon">
            <div class="icon_box text_primary" @click="selectIcon">
              <i :class="submitForm.icon"></i>
            </div>
          </el-form-item>
          <el-form-item label="模型层级" prop="typeId">
            <el-select v-model="submitForm.typeId" @change="changeCitype">
              <el-option
                v-for="(item, index) in ciTypeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="唯一标识" prop="name" :rules="$formRules.common.nameCheck">
            <el-input v-model="submitForm.name" :disabled="showType =='修改'"></el-input>
            <div class="form-tips text-tips">保存后不可修改</div>
          </el-form-item>
          <el-form-item label="名称" prop="label">
            <el-input v-model="submitForm.label"></el-input>
          </el-form-item>
          <el-form-item label="虚拟模型" prop="isVirtual" v-if="showType =='新增'">
            <el-switch 
              v-model="submitForm.isVirtual" 
              active-color="#13ce66" 
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item label="配置" v-if="submitForm.isVirtual === 1">
            <el-popover
              placement="right"
              width="500"
              trigger="hover"
              >
              <div>
                <pre>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;ci&gt;
  &lt;!--模型属性定义，需要SQL语句返回对应列--&gt;
  &lt;attrs&gt;
    &lt;attr name="user_id" label="用户id"/&gt;
    &lt;attr name="user_name" label="用户名"/&gt;
    &lt;attr name="teamName" label="分组"/&gt;
  &lt;/attrs&gt;
  &lt;sql&gt;
    SELECT
    &lt;!--必须包含id字段，作为配置项主键--&gt;
    `u`.`id` AS id,
    &lt;!--必须包含uuid字段，数据类型是char(32)，作为配置项全局主键--&gt;
    md5(`u`.`id`) AS uuid,
    &lt;!--必须包含name字段，作为配置项名称--&gt;
    `u`.`user_name` AS name,
    &lt;!--属性列需要在上面attrs中定义才生效--&gt;
    `u`.`user_id` as user_id,
    `u`.`user_name` as user_name,
    group_concat( `t`.`name`) AS teamName
    FROM
    `user` `u`
    LEFT JOIN `user_team` `ut` 
    ON `u`.`uuid` = `ut`.`user_uuid`
    LEFT JOIN `team` `t` 
    ON `t`.`uuid` = `ut`.`team_uuid`
    GROUP BY u.uuid
  &lt;/sql&gt;
&lt;/ci&gt;
                </pre>
              </div>
              <span slot="reference" class="text_primary" style="cursor: pointer;">查看范例</span>
            </el-popover>
            <codemirror
              v-model="viewXml"
              codeMode="xml"
            ></codemirror>
          </el-form-item>
          <el-form-item label="继承" prop="parentCiId" v-if="submitForm.isVirtual === 0">
            <el-select v-model="submitForm.parentCiId" @change="changeParentCi" clearable>
              <el-option
                v-for="(item, index) in ciInheritList"
                :key="index"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
            <div class="form-tips text-tips">被继承模型只能是抽象模型</div>
          </el-form-item>
          <el-form-item label="抽象模型" prop="isAbstract" v-if="submitForm.isVirtual === 0">
            <el-switch 
              v-model="submitForm.isAbstract" 
              active-color="#13ce66" 
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <div class="form-tips text-tips">抽象模型可以被继承，但不能添加配置项</div>
          </el-form-item>
          <el-form-item label="关键模型" prop="isMenu">
            <el-switch 
              v-model="submitForm.isMenu" 
              active-color="#13ce66" 
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <div class="form-tips text-tips">关键模型会显示在最左侧菜单中</div>
          </el-form-item>
          <el-form-item label="有效日期" prop="expiredDay" v-if="submitForm.isVirtual === 0">
            <el-input type="number" v-model="submitForm.expiredDay" :min="0"></el-input>
            <div class="form-tips text-tips">单位是天，有效日期为零代表永不过期</div>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="submitForm.description" type="textarea" :rows="5"></el-input>
          </el-form-item>
        </el-form>
      </scrollbarBox>
      
      <div class="submit_btn">
        <el-button type="primary" size="small" @click="save">保 存</el-button>
        <el-button size="small" @click="$emit('close')">取 消</el-button>
      </div>
    </el-dialog>

    <iconList
      v-if="showIcon"
      :selectIcon="submitForm.icon"
      :isShow="showIcon"
      @close="showIcon = false"
      @submitIcon="setIcon"
    ></iconList>
  </div>
</template>

<script>
import { citypeList, getCiInheritList, ciSave, ciDetail } from "@/api/system/ciModel";
import iconList from './iconList'
import codemirror from '@/components/codemirror/index'

export default {
  components: { iconList, codemirror },
  props: ["isShow", "ciId", "showType"],
  data() {
    return{
      submitForm: {
        icon: 'tsfont-ci',
        isVirtual: 0,
        isMenu: 0,
        isAbstract: 0,
        viewXml: ""
      },
      viewXml: "",
      rules: {
        typeId: [
          { required: true, message: '模型层级不能为空', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '唯一标识不能为空', trigger: 'blur' },
        ],
        label: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
        ],
      },
      ciTypeList: [],
      ciInheritList: [
        
      ],
      // 弹窗
      showIcon: false,
    }
  },
  mounted() {
    this.getDicts()
    this.getDetail()
  },
  methods: {
    // 获得详情
    getDetail() {
      if(this.showType == '修改') {
        this.pageLoading = true
        ciDetail({id: this.ciId, needAction: true}).then(res => {
          this.submitForm = res.Return
          this.viewXml = this.submitForm.viewXml
          this.pageLoading = false
        }).catch(() => {
          this.pageLoading = false
        })
      }
    },
    // 字典值
    getDicts() {
      // 模型层级
      citypeList().then(res => {
        this.ciTypeList = res.Return
      })
      // 继承列表
      getCiInheritList({isAbstract: 1, isVirtual: 0}).then(res => {
        this.ciInheritList = res.Return
      })
    },
    // 获得层级名称
    changeCitype(val) {
      for(let i=0; i<this.ciTypeList.length; i++) {
        let item = this.ciTypeList[i]
        if(item.id === val) this.submitForm.typeName = item.name
      }
    },
    // 获得继承名称
    changeParentCi(val) {
      for(let i=0; i<this.ciInheritList.length; i++) {
        let item = this.ciInheritList[i]
        if(item.value === val) {
          let indexStart = item.text.indexOf('(')
          let indexEnd = item.text.indexOf(')')
          if(indexStart !== -1 && indexEnd !== -1) {
            this.submitForm.parentCiLabel = item.text.substring(0, indexStart)
            this.submitForm.parentCiName = item.text.substring(indexStart+1, indexEnd)
          }else {
            this.submitForm.parentCiLabel = ""
            this.submitForm.parentCiName = ""
          }
          break;
        }
      }
    },
    
    save() {
      this.$refs.submitForm.validate((valid) => {
        if(valid) {
          this.saveLoading = true
          if(this.submitForm.isVirtual) this.submitForm.viewXml = Base64.encode(this.viewXml)
          ciSave(this.submitForm).then(res => {
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.$emit('saveCi')
            this.saveLoading = false
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    },
    selectIcon() {
      this.showIcon = true
    },
    setIcon(val) {
      this.showIcon = false
      this.submitForm.icon = val
    },
  }
} 
</script>

<style lang="scss" scoped>
.icon_box{
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: inline-block;
  position: relative;
  border: 1px solid #f5f6fa;
  background-color: #f5f6fa;
  border-radius: 5px;
  line-height: 40px;
  text-align: center;
  i{
    font-size: 20px;
  }
}
</style>

