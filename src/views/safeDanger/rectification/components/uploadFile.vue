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
            <el-form-item label="上级菜单:" prop="company">
              <el-select :disabled="queryDisabled.showUnitThird" v-model="form.company" size="mini" clearable placeholder="">
                <el-option
                  v-for="item in basicUnitThirds"
                  :value="item.deptId"
                  :key="item.deptId"
                  :label="item.deptName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="分类:" prop="roomCode">
              <el-input
                placeholder=""
                clearable
                size="mini"
                v-model="form.roomCode"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="内容:" prop="roomName">
              <el-input
                placeholder=""
                clearable
                size="mini"
                v-model="form.roomName"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="督察分类:" prop="roomLoc">
              <el-input
                placeholder=""
                clearable
                size="mini"
                v-model="form.roomLoc"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="督察要点:" prop="roomLoc">
              <el-input
                placeholder=""
                clearable
                size="mini"
                v-model="form.roomLoc"
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
import { queryTowThreeDpet, queryThreeDeptByTwoIdFor05 } from "@/api/safeDanger/system/dept";
import { getComputerroom, addComputerroom, updateComputerroom } from "@/api/safeDanger/system/deviceInfo/computerroom";
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
      type: String,
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
      form: {},
      queryDisabled: {
        showUnitSecond: false,
        showUnitThird: false
      },
      // 二级单位
      basicUnitSeconds: [],
      // 三级单位
      basicUnitThirds: [],
      //校验
      rules:{
        roomCode:[{required:true,message:'请填写编码',trigger:'blur'}],
        roomName:[{required:true,message:'请填写名称',trigger:'blur'}],
        roomLoc:[{required:true,message:'请填写地点',trigger:'blur'}],
        orgNo:[{required:true,message:'请选择二级单位',trigger:'blur'}],
        company:[{required:true,message:'请选择三级单位',trigger:'blur'}]
      },
    }
  },
  created() {
    this.deptSelect();
    this.showInfo();
  },
  mounted() {

  },
  methods: {
    showInfo() {
      if(this.isEdit || this.roomId !== undefined) {
        getComputerroom(this.roomId).then(response =>{
          this.form = Object.assign({}, response.data)
        })
      }else{
        this.reset();
      }
    },
    // 表单重置
    reset() {
      this.form = {
        roomId: undefined,
        roomCode: undefined,          //编码
        roomName: undefined,          //名称
        roomLoc: undefined,          //地点
        orgNo: undefined,    //二级单位
        gpsCoordinate: undefined,     //GPS坐标
        navigationPos: undefined,          //导航位置
        company: undefined         //三级单位
      };
      // this.resetForm("form");
      this.$refs.form.resetFields();
    },
    // 获取 二、三级单位及部门
    deptSelect(){
      queryTowThreeDpet().then(response => {
        this.basicUnitSeconds = response.data.towDept
        if(response.data.towDept.length === 1) {
          this.form.orgNo = response.data.towDept[0].deptId
          this.queryDisabled.showUnitSecond = true
        }
        this.basicUnitThirds = response.data.threeDept
      })
    },
    changeSecondSelect(value) {
      if(value !== '') {
        if(this.companyCode === '05' || this.companyCode === '0599') {
          //如果是省公司账号
          let params = {
            deptId: value
          };
          queryThreeDeptByTwoIdFor05(params).then(response => {
            this.basicUnitThirds = response.data
          })
        }else {
          let parmas = {
            selectTowDeptId: value
          }
          queryTowThreeDpet(parmas).then(response =>{
            this.basicUnitThirds = response.data.threeDept
          })
        }
      }else {
        this.queryDisabled.showUnitThird = true
        this.form.company = undefined
        this.basicUnitThirds = []
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roomId !== undefined) {
            updateComputerroom(this.form).then(response => {
              if (response.code === 200) {
                this.$message.success("修改成功");
                this.$emit('closeRoom')
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addComputerroom(this.form).then(response => {
              if (response.code === 200) {
                this.form.roomId = response.data.id
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
