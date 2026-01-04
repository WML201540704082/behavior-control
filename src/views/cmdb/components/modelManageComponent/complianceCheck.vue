<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="合规检查设置"
      width="900px"
      top="10vh"
      v-el-drag-dialog
    >
      <div class="main">
        <!-- v-if="legalValidList && legalValidList.length > 0" -->
        <div class="broadside">
        
            <div class="legalValid">
              <div :class="!id ? 'text_primary' : ''" @click="editLegalValid()">新建规则</div>
              <div
                v-for="legalValid in legalValidList"
                :key="legalValid.id"
                style="position: relative"
                :class="id && id == legalValid.id ? 'text_primary' : ''"
                class="overflow pr-xs"
                @click="editLegalValid(legalValid.id)"
              >
                <span :title="legalValid.name" :class="legalValid.isActive == 0 ? 'text-grey' : ''">{{ legalValid.name }}</span>
                <i class="tsfont-trash-o" style="cursor: pointer; position: absolute; right: 2px; top: 2px" @click="delLegalValid(legalValid)"></i>
              </div>
            </div>
          
        </div>
        <div class="content">
          <el-form
            ref="submitForm"
            :model="submitForm"
            :rules="rules"
            label-suffix=":"
            label-width="100px"
            size="small"
          >
            <el-form-item label="名称" prop="name">
              <el-input v-model="submitForm.name"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <div class="type">
                <el-radio-group v-model="submitForm.type">
                  <el-radio 
                    v-for="typeRadio in typeRadioList"
                    :key="typeRadio.value" 
                    :label="typeRadio.value"
                  >
                    {{ typeRadio.text }}
                  </el-radio>
                </el-radio-group>
                <div class="tips">
                  模型规则：不满足模型属性和关系的相关约束的配置项则视为不合规；自定义规则：满足自定义规则的配置项视为不合规。
                </div>
              </div>
            </el-form-item>
            <el-form-item label="激活" prop="isActive">
              <el-switch 
                v-model="submitForm.isActive" 
                active-color="#13ce66" 
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </el-form-item>
            
            <el-form-item label="定时" prop="cron">
              <fixedTime ref='fixedTime' @onCron='editCron'></fixedTime>
            </el-form-item>
            <el-form-item label="规则" prop="rule" v-if="submitForm.type == 'custom'">
              <ruleCom ref='ruleCom' :ciId="ciId"></ruleCom>
            </el-form-item>
          

            <div class="submit_btn">
              <el-button type="primary" size="small" @click="save" :loading="saveLoading">确 认</el-button>
              <el-button size="small" @click="$emit('close')">取 消</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { 
  enumGet,
  legalvalidSave,
  targetciSearch,
  legalvalidSearch,
  legalvalidGet,
  legalvalidDelete
} from "@/api/system/ciModel";
import { validatorSearch } from "@/api/system/checkRulesManage";
import fixedTime from './fixedTime';
import ruleCom from './ruleCom';

export default {
  props: ["isShow", "ciId", "arrtId"],
  components: {fixedTime, ruleCom},
  data() {
    return{
      id: '',
      legalValidList: [
        {
          id: 1,
          name: "12312213123"
        }
      ],
      submitForm: {
        isActive: 0
      },
      rules: {
        name: [
          { required: true, message: '唯一标识不能为空', trigger: 'blur' },
        ],
        label: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' },
        ],
      },
      typeRadioList: [],
      validatorList: [],
      saveLoading: false
    }
  },
  mounted() {
    this.getDict()
    this.getList()
  },
  computed: {
    
  },
  methods: {
    editCron(data) {
      let arrr = [data.second, data.minute, data.hour, data.dayofmonth, data.month, data.dayofweek, data.year]
      let str = arrr.join(' ')
      this.submitForm.cron = str
    },
    editLegalValid(id) {
      this.id = id;
      if( id ){
        legalvalidGet({ id: id }).then(res=>{
          this.submitForm = res.Return
    
          this.$nextTick(()=>{
            this.$refs.fixedTime.getData(this.submitForm.cron)
            if(this.$refs.ruleCom){
              this.$refs.ruleCom.getData(this.submitForm.rule)
            }
          })
          
        })
      }else{
        this.submitForm = {
          isActive: 0
        }

        this.$nextTick(()=>{
          this.$refs.fixedTime.getData(undefined)
          if(this.$refs.ruleCom){
            this.$refs.ruleCom.getData(undefined)
          }
        })
      }
    },
    delLegalValid(row) {
      this.$confirm('是否确认删除当前' + row.name + '?', "删除确认", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return legalvalidDelete({ id: row.id }).then( async res => {})
        }).then(() => {
          this.getList()
          this.$message.success('操作成功')
        }).catch(function() {});

      
    },

    getList() {
      legalvalidSearch({ciId: this.ciId}).then(res => {
        this.legalValidList = res.Return
      })
    },
    getDict() {
      enumGet().then(res => {
        this.typeRadioList = res.Return
      })
      validatorSearch({needPage: false}).then(res => {
        this.validatorList = res.Return.tbodyList
      })
    },
    save() {
      this.$refs.submitForm.validate((valid) => {
        if(valid) {
          this.saveLoading = true
          this.submitForm.ciId = this.ciId

          if( this.$refs.ruleCom ){
            this.submitForm.rule = this.$refs.ruleCom.ruleObj
          }
          // this.saveLoading = false
          // return

          legalvalidSave(this.submitForm).then(res => {
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.$emit('saveArrt')
            this.saveLoading = false
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    },
  }
}
</script>
<style lang='scss' scoped>
  .legalValid {
    height: 100%;
    div {
      font-weight: 400;
      min-width: 130px;
      height: 32px;
      line-height: 32px;
      padding-left: 16px;
      cursor: pointer;
      padding-right: 30px;
    }
  }

  .main{
    display: flex;
    justify-content: space-between;
    .broadside{
      width: 200px;
    }
    .content{
      flex: 1;
    }
  }


  ::v-deep .type{
    .el-radio {
      margin-bottom: 0;
    }
    .tips {
      color: #a1a1a1;
      font-size: 12px;
      line-height: 20px;
    }
  }
</style>
