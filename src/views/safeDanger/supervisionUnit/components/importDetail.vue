<template>
  <div>
    <div v-if="!isInfo" style="margin-bottom: 10px">
      <el-button type="primary" size="mini" style="margin-right: 5px;" icon="el-icon-check" @click="submitForm">保存</el-button>        
    </div>
    <div>
      <el-form :disabled="isInfo" style="padding-right: 5px" :rules="rules"  label-width="140px" ref="form" :model="formData"  :status-icon="true">
            <el-row>
             
              <el-col :span="18">
                <el-form-item label="责任单位:" prop="secondCompany">
                    <el-cascader
                      :disabled="Boolean(detailId)"
                      size="mini"
                      v-model="formData.secondCompany"
                      :options="basicUnitSeconds"
                      :props="defaultProps"
                      @change="secondCompanyChange"
                      style="width: 100%"
                      placeholder=""
                      clearable>
                    </el-cascader>
                  
                </el-form-item>
              </el-col>

    
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label="责任人:" prop="userIdList">
                  <el-select v-model="formData.userIdList" multiple filterable size="mini" placeholder="" :disabled="!formData.secondCompany || formData.secondCompany.length == 0">
                    <el-option
                      v-for="item in userList"
                      :value="item.userId"
                      :key="item.userId"
                      :label="item.nickName"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
             
            </el-row>
      </el-form>
    </div>

 


  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Upload from '@/components/Upload/index'

import { selectShortNameTree, selectShoutUser, machineroomuserId, machineRoomUserAdd, machineRoomUserEdit, userDetail } from "@/api/safeDanger/hiddenCategory"
import { updateHidden } from "@/api/safeDanger/rectificationImport"

export default {
  name: "ComputerRoomDetail",
  // components: {Upload},
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
      'userId'
    ]),
  },
  props: {
    roomId: {
      type: Number,
    },
    detailId: {
      type: Number,
    },
    detailObj: {
      type: Object
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
      defaultProps: {
        value: 'orgId',
        label: 'shortName',
        leaf: 'leaf',
        children: 'shortNameVOList',
        // checkStrictly: true,
        // emitPath: false,
        expandTrigger: 'hover'
      },

      // 表单参数
      formData: {
        secondCompany: undefined,
        userIdList: [],
      },

      //校验
      rules:{

        secondCompany:[{required:true, type: 'array', message:'请选择责任单位', trigger:'change'}],
        userIdList:[{required:true, message:'请选择责任人', trigger:'change'}],

      },
      


      // 下拉列表
      basicUnitSeconds: [],
      userList: [],

    }
  },
  created() {
    this.initData()
    this.showInfo();
  },
  mounted() {

  },
  methods: {
    secondCompanyChange(val){
      this.formData.userIdList = ''
      if(val.length > 0){
        selectShoutUser({ orgCode: val[2] }).then(res=>{
          this.userList = res.data
        })
      }
    },
    // 渲染表格
    showInfo() {
      if(this.detailId){
        // machineroomuserId({ roomId: this.roomId, firstCompany: this.detailObj.firstCompany, secondCompany: this.detailObj.secondCompany }).then(res=>{
        //   let data = res.data
        //   this.formData.secondCompany = [ data.orgCode, data.firstCompany, data.secondCompany ]
        //   selectShoutUser({ orgCode: data.secondCompany }).then(res=>{
        //     this.userList = res.data
        //     this.formData.userIdList = data.hiddenOrderUserVOS.map(el=> el.userId)
        //   })
        // })
        
        userDetail( { categoryId: this.detailId, firstCompany: this.detailObj.firstCompany, secondCompany: this.detailObj.secondCompany } ).then(res=>{
          if(res.data.length>0){
            // this.formData = res.data[0]
            let datas = res.data
            let data = res.data[0]
            this.formData.secondCompany = [ data.orgCode, data.firstCompany, data.secondCompany ]

            selectShoutUser({ orgCode: data.secondCompany }).then(res=>{
              this.userList = res.data
              this.formData.userIdList = datas.map(el=> el.userId)
            })
          }
          
        })
      }
    },
    
    /** 提交按钮 */
    submitForm: function() {
      // this.formData.firstCompany = this.companyCode.slice(0, 4)
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = {
            categoryId: this.roomId,
            orgCode: this.formData.secondCompany[0],
            firstCompany: this.formData.secondCompany[1],
            secondCompany: this.formData.secondCompany[2],
            userIdList: this.formData.userIdList
          }

          if(this.detailId){
            params.id = this.detailId
            machineRoomUserEdit(params).then(res=>{
              this.$message.success(res.msg)
              this.$emit('closeRoom')
            })
          }else{
            machineRoomUserAdd(params).then(res=>{
              this.$message.success(res.msg)
              this.$emit('closeRoom')
            })
          }


          // let forms = JSON.parse(JSON.stringify(this.formData))

          // updateHidden(forms).then(response => {
          //   if (response.code === 200) {
          //     this.msgSuccess("修改成功");
          //     this.$emit('closeRoom', response.data)
          //   } else {
          //     this.msgError(response.msg);
          //   }
          // });
        }
      });
    },

    // 获取下拉列表
    initData(){
      selectShortNameTree().then(res=>{
        this.basicUnitSeconds = res.data
      })


    },






  }
}
</script>

<style lang='scss' scoped>
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

  ::v-deep .el-form-item {
    margin-bottom: 18px;
  }
  .rowSelect2 .el-select{
    width: 48.5%;
  }

</style>
