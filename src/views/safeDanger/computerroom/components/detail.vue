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
            <el-form-item label="督察分类:" prop="category">
              <el-select 
                v-model="form.category" 
                filterable
                size="mini" 
                clearable 
                placeholder=""
                @blur="categoryBlur"
                @change="categoryChange"
                allow-create
                default-first-option
              >
                <el-option
                  v-for="item in categoryList"
                  :value="item.category"
                  :key="item.id"
                  :label="item.category"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="督察内容:" prop="content">
              <!-- <el-input
                placeholder=""
                clearable
                size="mini"
                v-model="form.content"
              >
              </el-input> -->
              <el-select 
                v-model="form.content" 
                filterable
                size="mini" 
                clearable 
                placeholder=""
                @blur="contentBlur"
                allow-create
                default-first-option
              >
                <el-option
                  v-for="item in contentList"
                  :value="item.content"
                  :key="item.id"
                  :label="item.content"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="督察项:" prop="supervision">
              <el-input
                placeholder=""
                clearable
                size="mini"
                v-model="form.supervision"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="督察要点:" prop="supervisionPoint">
              <el-input
                type="textarea"
                placeholder=""
                clearable
                size="mini"
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
import { allCategory, securityId, securityAdd, securityEdit, allContent } from "@/api/safeDanger/computerroom"
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
      categoryList: [],
      contentList: [],
      //校验
      rules:{
        category:[{required:true,message:'请填写或选择分类',trigger:'change'}],
        content:[{required:true,message:'请填写内容',trigger:'blur'}],
        // supervision:[{required:true,message:'请填写督察分类',trigger:'blur'}],
        // supervisionPoint:[{required:true,message:'请填写督察要点',trigger:'blur'}]
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
      let selectCategory = this.categoryList.filter(el=> el.category == val )[0]
      // if(!this.parentDis){
      //   if(selectCategory){
      //     this.queryDisabled.isSupervision = true
      //   }else{
      //     this.queryDisabled.isSupervision = false
      //   } 
      // }

      if(selectCategory){
        // this.form.content = selectCategory.content
        allContent({ category: val }).then(res=>{
          this.contentList = res.data
        })

      }else{
        this.form.content = ''
      } 
    },
    editState2(val){
      let selectCategory = this.categoryList.filter(el=> el.category == val )[0]
      if(selectCategory){
        // this.form.content = selectCategory.content
        allContent({ category: val }).then(res=>{
          this.contentList = res.data
        })
      }
    },


    categoryChange(val){
      this.editState(val)
    },
    categoryBlur(e){
        let value = e.target.value
        if(value){
          this.editState(value)
          this.form.category = value
        }
    },
    contentBlur(e){
      let value = e.target.value
      if(value){
        this.form.content = value
      }
    },
    initData(){
      allCategory().then(res=>{
        this.categoryList = res.data
        this.editState2(this.form.category)
      })
    },
    showInfo() {
      // this.resetForm("form");
      if(this.roomId) {
        securityId(this.roomId).then(response =>{
          this.form = Object.assign({}, response.data)

          this.editState2(this.form.category)
          // if(this.form.content){  // 如果督察项有
          //   this.queryDisabled.isSupervision = true
          // }else{
          //   this.queryDisabled.isSupervision = false
          //   this.parentDis = true
          // }
        })
      }
    },
    /** 提交按钮 */
    submitForm: function() {

      let selectCategory = this.categoryList.filter(el=> el.category == this.form.category )[0]
      if(selectCategory){
        this.form.parentId = selectCategory.id
      }else{
        this.form.parentId = ''
        this.form.supervision = undefined
        this.form.supervisionPoint = undefined
      } 

      let selectContent = this.contentList.filter(el=> el.content == this.form.content )[0]
      if(selectContent){
        this.form.parentId = selectContent.id
      }else{
        this.form.parentId = ''
      } 

      // if(this.parentDis){
      //   this.form.parentId = 0
      // }

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
    height: 50px;
  }
</style>
