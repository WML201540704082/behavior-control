<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="添加关系"
      width="700px"
      top="10vh"
      v-el-drag-dialog
    >
      <scrollbarBox>
        <el-form
          ref="submitForm"
          :model="submitForm"
          :rules="rules"
          label-suffix=":"
          label-width="90px"
          size="small"
          style="padding-right: 25px"
        >
          <el-form-item label="关系类型">
            <div class="moshi1 moshi3">
              <el-select v-model="submitForm.quantity" placeholder="请选择" style="width:180px;margin-right: 15px">
                <el-option label="逻辑调用" :value="1"></el-option>
                <el-option label="物理调用" :value="2"></el-option>
                <el-option label="成员" :value="3"></el-option>
              </el-select>
              <div class="moshi3-r">
                <div class="moshi3-rl">
                  自动采集
                </div>
                <el-switch 
                  v-model="submitForm.isCji" 
                  active-color="#409eff" 
                  inactive-color="#e5e5e5"
                  :active-value="1"
                  :inactive-value="0"
                  style="margin-right: 2px"
                ></el-switch>
                <el-tooltip effect="light" content="激活了自动采集的关系才能在采集映射管理中配置" placement="top">
                  <i class="tsfont-info-o"></i>
                </el-tooltip>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="" prop="bs1">
            <!-- <div class="photo">
              <i class="demo-icon tsfont-storagerpa"></i>
            </div> -->
            <div class="wrapper bg-block radius-md">
              <div class="item-left">
                <div :class=" isFlagg ? 'text-primary':'' "> 上游端 </div>
                <div class="reledit-icon border-color bg-block" :class=" isFlagg ? 'border-primary text-primary':'' ">
                  <i v-if="isFlagg" class="tsfont-storagerpa" style=""></i>
                  <i v-else class="tsfont-plus"></i>
                </div>
                <div class="overflow" :class=" isFlagg ? 'text-primary':'' "> {{ isFlagg ? 'IT设备':'...' }} </div>
              </div>
              <div title="位置对调" @click="isFlagg = !isFlagg" class="reledit-switch border-color bg-block">
                <i class="tsfont-change"></i>
              </div>
              <div class="reledit-line border-color"></div>
              <div class="item-right">
                <div :class=" !isFlagg ? 'text-primary':'' "> 下游端 </div>
                <div class="reledit-icon border-color bg-block" :class=" !isFlagg ? 'border-primary text-primary':'' ">
                  <i v-if="!isFlagg" class="tsfont-storagerpa" style=""></i>
                  <i v-else class="tsfont-plus"></i>
                </div>
                <div class="overflow" :class=" !isFlagg ? 'text-primary':'' "> {{ !isFlagg ? 'IT设备':'...' }} </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="唯一标识" prop="bs1">
            <div class="moshi1">
              <el-input v-model="submitForm.bs1" placeholder="上游端唯一标识" style="margin-right: 15px"></el-input>
              <el-input v-model="submitForm.bs2" placeholder="下游端唯一标识"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="名称" prop="name1">
            <div class="moshi1">
              <el-input v-model="submitForm.name1" placeholder="上游端名称" style="margin-right: 15px"></el-input>
              <el-input v-model="submitForm.name2" placeholder="下游端名称"></el-input>
            </div>
          </el-form-item>
         
          <el-form-item label="必填" prop="isRequired">
            <div class="moshi2">
              <div class="moshi2-l">
                <el-switch 
                  v-model="submitForm.isRequired1" 
                  active-color="#409eff" 
                  inactive-color="#e5e5e5"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </div>
              <div class="moshi2-r">
                <el-switch 
                  v-model="submitForm.isRequired2" 
                  active-color="#409eff" 
                  inactive-color="#e5e5e5"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </div>
            </div>
          </el-form-item>
     
       
          <el-form-item label="关联个数">
            <div class="moshi1">
              <el-select v-model="submitForm.quantity" style="margin-right: 15px">
                <el-option label="一个" :value="1"></el-option>
                <el-option label="多个" :value="2"></el-option>
              </el-select>
              <el-select v-model="submitForm.quantity2">
                <el-option label="一个" :value="1"></el-option>
                <el-option label="多个" :value="2"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="是否唯一" style="margin-bottom: 0">
            <div class="moshi1">
              <el-select v-model="submitForm.isFlag" style="margin-right: 15px">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="2"></el-option>
              </el-select>
              <el-select v-model="submitForm.isFlag2">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="2"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="" prop="isRequired">
            <div class="moshi2 text-grey">
              <div class="moshi2-l">
                唯一代表上游端只能被下游端引用一次
              </div>
              <div class="moshi2-r">
                唯一代表下游端只能被上游端引用一次
              </div>
            </div>
          </el-form-item>
          <el-form-item label="分组">
            <el-dropdown>
              <span class="el-dropdown">
                不分组<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>不分组</el-dropdown-item>
                <el-dropdown-item>添加分组</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item label="级联删除" prop="isDel" style="margin-bottom: 0">
            <div class="moshi2">
              <div class="moshi2-l">
                <el-switch 
                  v-model="submitForm.isDel1" 
                  active-color="#409eff" 
                  inactive-color="#e5e5e5"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </div>
              <div class="moshi2-r">
                <el-switch 
                  v-model="submitForm.isDel2" 
                  active-color="#409eff" 
                  inactive-color="#e5e5e5"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="" prop="isRequired">
            <div class="moshi2 text-grey">
              <div class="moshi2-l">
                删除上游端配置项时，自动删除下游端配置项
              </div>
              <div class="moshi2-r">
                删除下游端配置项时，自动删除上游端配置项
              </div>
            </div>
          </el-form-item>

        </el-form>
      </scrollbarBox>
      <div class="submit_btn">
        <el-button type="primary" size="small" @click="save" :loading="saveLoading">确 认</el-button>
        <el-button size="small" @click="$emit('close')">取 消</el-button>
      </div>
      
    </el-dialog>
  </div>
</template>

<script>

import { attrtypeList, attrSave, attrDetail } from "@/api/system/ciModel";
import { validatorSearch } from "@/api/system/checkRulesManage";


export default {
  components: {
    
  },
  props: ["isShow", "ciId", "showType", "arrtId"],
  data() {
    return{
      isFlagg: true,
      submitForm: {},
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
    // this.getDict()
    // this.getDeatil()
  },
  methods: {
    getDeatil() {
      if(this.showType != '新增') {
        attrDetail({id: this.arrtId}).then(res => {
          this.submitForm = res.Return
        })
      }
    },
    getDict() {
      attrtypeList().then(res => {
        this.typeRadioList = res.Return
      })
      validatorSearch({needPage: false}).then(res => {
        this.validatorList = res.Return.tbodyList
      })
    },
    save() {
      this.$emit('saveArrt')
      this.$message({
        type: 'success',
        message: '操作成功！'
      });
      // this.$refs.submitForm.validate((valid) => {
      //   if(valid) {
      //     this.saveLoading = true
      //     this.submitForm.ciId = this.ciId
      //     attrSave(this.submitForm).then(res => {
      //       this.$message({
      //         type: 'success',
      //         message: '保存成功！'
      //       });
      //       this.$emit('saveArrt')
      //       this.saveLoading = false
      //     }).catch(() => {
      //       this.saveLoading = false
      //     })
      //   }
      // })
    },
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-dialog{
    background-color: #f5f6fa;
  }
  ::v-deep .el-dialog__title{
    font-size: 16px;
  }
  .wrapper{
    display: flex;
    padding: 16px 96px;
    align-items: center;
    justify-content: space-between;
  }
  .radius-md {
    border-radius: 8px;
  }
  .bg-block {
    background-color: #fff;
  }
  .wrapper .item-left {
    width: 70px;
    text-align: center;
    z-index: 2;
  }
  .text-primary {
    color: #1670f0;
  }
  .wrapper .reledit-icon {
    width: 70px;
    height: 70px;
    border: 1px solid;
    font-size: 35px;
    text-align: center;
    padding-top: 0px;
    border-width: 1px;
    border-radius: 2px;
    border-style: solid;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 4px;
    margin-top: 4px;
  }
  .wrapper .reledit-switch {
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 32px;
    border: 1px solid;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
  }
  .wrapper .reledit-line {
    top: 88px;
    left: 190px;
    right: 190px;
    height: 1px;
    border-top: 1px solid;
    z-index: 0;
    position: absolute;
  }

  .wrapper .item-right {
    width: 70px;
    z-index: 2;
    text-align: center;
  }



  .text-grey{
    color: #8c8c8c;
    fill: #8c8c8c;
  }
  .border-primary {
    border-color: #1670f0;
  }
  .overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }
  .border-color {
    border-color: var(--border-color, #e5e5e5) !important;
  }

  .moshi1{
    display: flex;
    justify-content: space-between
  }
  .moshi2{
    display: flex;
    justify-content: space-between;
    font-size: 12px;

    .moshi2-l{
      width: 50%;
      margin-right: 15px
    }
    .moshi2-r{
      width: 50%;
    }
  }
  .moshi3-r{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .moshi3-rl{
      margin-right: 5px;
    }
  }
</style>
