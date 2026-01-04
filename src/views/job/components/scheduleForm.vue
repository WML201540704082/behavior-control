<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-form-item label="名称" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="任务方法" prop="beanName">
        <el-input v-model="dataForm.beanName" placeholder="spring bean名称, 如: testTask"></el-input>
      </el-form-item>
      <el-form-item label="参数" prop="params">
        <el-input v-model="dataForm.params" placeholder="参数"></el-input>
      </el-form-item>
      <el-form-item label="cron表达式" prop="cronExpression">
        <el-input v-model="dataForm.cronExpression" placeholder="如: 0 0 12 * * ?"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="dataForm.type">
          <el-option label="数据抽取" value="数据抽取"></el-option>
          <el-option label="数据校验" value="数据校验"></el-option>
          <el-option label="数据贯通" value="数据贯通"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from "@/router/axios";

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        beanName: '',
        params: '',
        cronExpression: '',
        remark: '',
        status: 0,
        type: '',
      },
      dataRule: {
        beanName: [
          {required: true, message: '用户名不能为空', trigger: 'blur'}
        ],
        cronExpression: [
          {required: true, message: 'cron表达式不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          request({
            url: `/api/idevelop-data/sys/schedule/info/${this.dataForm.id}`,
            method: 'get',
            params: {}
          }).then(({data}) => {
            if (data) {
              this.dataForm.beanName = data.beanName
              this.dataForm.params = data.params
              this.dataForm.cronExpression = data.cronExpression
              this.dataForm.remark = data.remark
              this.dataForm.status = data.status
              this.dataForm.type = data.type
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let url = '/api/idevelop-data/sys/schedule/save'
          if (this.dataForm.id) {
            url = '/api/idevelop-data/sys/schedule/update'
          }
          request({
            url: url,
            method: 'post',
            data: {
              'jobId': this.dataForm.id || undefined,
              'beanName': this.dataForm.beanName,
              'params': this.dataForm.params,
              'cronExpression': this.dataForm.cronExpression,
              'remark': this.dataForm.remark,
              'status': !this.dataForm.id ? undefined : this.dataForm.status,
              'type': this.dataForm.type,
            }
          }).then(({data}) => {
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
      })
    }
  }
}
</script>
