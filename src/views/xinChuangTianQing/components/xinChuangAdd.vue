<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-form-item label="区域IP" prop="regionIp">
        <el-input v-model="dataForm.regionIp" placeholder="区域IP"></el-input>
      </el-form-item>
      <el-form-item label="区域名称" prop="regionName">
        <el-input v-model="dataForm.regionName" placeholder="区域名称"></el-input>
      </el-form-item>
      <el-form-item label="区域端口号" prop="regionPort">
        <el-input v-model="dataForm.regionPort" placeholder="区域端口号"></el-input>
      </el-form-item>
      <el-form-item label="区域组织id" prop="regionAssetOid">
        <el-input v-model="dataForm.regionAssetOid" placeholder="区域组织id"></el-input>
      </el-form-item>
     <el-form-item label="区域资产id" prop="regionAssetId">
        <el-input v-model="dataForm.regionAssetId" placeholder="区域资产id"></el-input>
      </el-form-item>
      <el-form-item label="区域AppKey" prop="regionAppKey">
        <el-input v-model="dataForm.regionAppKey" placeholder="区域AppKey"></el-input>
      </el-form-item>
      <el-form-item label="区域AppSecret" prop="regionAppSecret">
        <el-input v-model="dataForm.regionAppSecret" placeholder="区域AppSecret"></el-input>
      </el-form-item>
      <el-form-item label="区域Timestamp" prop="regionTimestamp">
        <el-input v-model="dataForm.regionTimestamp" placeholder="区域Timestamp"></el-input>
      </el-form-item>
      <el-form-item label="区域Signature" prop="regionSignature">
        <el-input v-model="dataForm.regionSignature" placeholder="区域Signature"></el-input>
      </el-form-item>
      <el-form-item label="区域Authorization" prop="regionAuthorization">
        <el-input v-model="dataForm.regionAuthorization" placeholder="区域Authorization"></el-input>
      </el-form-item>
      <el-form-item label="数据权限备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="数据权限备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import {signatureDetail,signatureSave,signatureUpdate} from "../../../api/assets/xinChuangTQXX";
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: '',
        regionIp: '',
        regionName: '',
        regionPort: '',
        remark: '',
        regionAssetOid: '',
        regionAssetId: '',
        regionAppKey: '',
        regionAppSecret: '',
        regionTimestamp: '',
        regionSignature: '',
        regionAuthorization:''
      },
      dataRule: {
        // beanName: [
        //   {required: true, message: '用户名不能为空', trigger: 'blur'}
        // ],
        // cronExpression: [
        //   {required: true, message: 'cron表达式不能为空', trigger: 'blur'}
        // ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || ''
      this.visible = true
     
      this.$nextTick(() => {
         if(!this.dataForm.id.length){
        this.$refs['dataForm'].resetFields()
      }
        if (this.dataForm.id) {
         signatureDetail({id:this.dataForm.id}).then(({data}) => {
          //  console.log(data)
            if (data) {
              this.dataForm.id = data.id
              this.dataForm.regionIp = data.regionIp
              this.dataForm.regionName = data.regionName
              this.dataForm.regionPort = data.regionPort
              this.dataForm.remark = data.remark
              this.dataForm.regionAssetOid = data.regionAssetOid
              this.dataForm.regionAssetId = data.regionAssetId
              this.dataForm.regionAppKey = data.regionAppKey
              this.dataForm.regionAppSecret = data.regionAppSecret
              this.dataForm.regionTimestamp = data.regionTimestamp
              this.dataForm.regionSignature = data.regionSignature     
              this.dataForm.regionAuthorization = data.regionAuthorization
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
        if(this.dataForm.id){
        signatureUpdate(this.dataForm).then(({data}) => {
            if (data) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              })
              this.visible = false;
              this.$emit('refreshDataList')
              this.$emit('close')
            } else {
              this.$message.error(data.msg)
            }
          })
        }else{
          signatureSave(this.dataForm).then(({data}) => {
            if (data) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              })
              this.visible = false;
              this.$emit('refreshDataList')
              this.$emit('close')
            } else {
              this.$message.error(data.msg)
            }
          })
        }
        }
      })
    }
  }
}
</script>
