<template>
  <div>
    <div v-if="!isInfo">
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check"
                 @click="submitForm">保存</el-button>
    </div>

    <div>
      <el-form :disabled="isInfo" style="padding-right: 5px" :rules="rules"  label-width="105px" ref="form" :model="form"  :status-icon="true">
        <el-row>
          <el-col>
            <el-form-item label="督察分类:" prop="supervision">
              <el-select 
                v-model="form.supervision" 
                filterable
                size="mini" 
                clearable 
                placeholder=""
                @blur="supervisionBlur"
                @change="supervisionChange"
                allow-create
                default-first-option
              >
                <el-option
                  v-for="item in supervisionList"
                  :value="item.supervision"
                  :key="item.supervision"
                  :label="item.supervision"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="queryDisabled.isSupervision">
          <el-col>
            <el-form-item label="督察项:" prop="supervisionType">
              <el-input
                placeholder=""
                clearable
                size="mini"
                v-model="form.supervisionType"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="queryDisabled.isSupervision">
          <el-col>
            <el-form-item label="督察要点:" prop="supervisionPoint">
              <el-input
                type="textarea"
                placeholder=""
                clearable
                size="mini"
                :rows="5"
                v-model="form.supervisionPoint"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { securitySupervision, securityId, securityAdd, securityEdit } from "@/api/safeDanger/networkSecure"
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
        supervision: undefined,
        supervisionType: undefined,
        supervisionPoint: undefined
      },
      queryDisabled: {
        isSupervision: false
      },
      supervisionList: [],
      //校验
      rules:{
        supervision:[{required:true,message:'请填写或选择督察分类',trigger:'change'}],
        supervisionType:[{required:true,message:'请填写督察项',trigger:'blur'}],
        supervisionPoint:[{required:true,message:'请填写督察要点',trigger:'blur'}]
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
    editState(val){
      if(!this.parentDis){
        let selectSupervision = this.supervisionList.filter(el=> el.supervision == val )[0]
        if(selectSupervision){
          this.queryDisabled.isSupervision = true
        }else{
          this.queryDisabled.isSupervision = false
        } 
      }
    },
    supervisionChange(val){
      this.editState(val)
    },
    supervisionBlur(e){
        let value = e.target.value
        if(value){
          this.editState(value)
          this.form.supervision = value
        }
    },
    initData(){
      securitySupervision().then(res=>{
        this.supervisionList = res.data
      })
    },
    showInfo() {
      // this.resetForm("form");
      if(this.roomId) {
        securityId(this.roomId).then(response =>{
          this.form = Object.assign({}, response.data)

          if(this.form.supervisionType){  // 如果督察项有
            this.queryDisabled.isSupervision = true
          }else{
            this.queryDisabled.isSupervision = false
            this.parentDis = true
          }
        })
      }
    },
    /** 提交按钮 */
    submitForm: function() {

      let selectSupervision = this.supervisionList.filter(el=> el.supervision == this.form.supervision )[0]
      if(selectSupervision){
        this.form.parentId = selectSupervision.id
      }else{
        this.form.parentId = ''
        this.form.supervisionType = undefined
        this.form.supervisionPoint = undefined
      } 

      if(this.parentDis){
        this.form.parentId = 0
      }

      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.roomId) {
            securityEdit(this.form).then(response => {
              if (response.code === 200) {
                this.$message.success("修改成功");
                this.$emit('closeRoom')
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            securityAdd(this.form).then(response => {
              if (response.code === 200) {
                this.$message.success("新增成功");
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
  .el-cascader{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }
  .el-input{
    width: 100%;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }
  .el-col-24 {
    /* height: 50px; */
    margin-bottom: 0;
  }
</style>
