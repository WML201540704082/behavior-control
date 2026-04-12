<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="导入模型"
      width="700px"
      top="10vh"
      v-el-drag-dialog
    >
      <el-form
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
        size="small"
        label-suffix=":"
        label-width="100px"
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
        <el-form-item label="唯一标识" prop="name">
          <el-input v-model="submitForm.name"></el-input>
          <div class="form-tips text-tips">保存后不可修改</div>
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input v-model="submitForm.label"></el-input>
        </el-form-item>
        <el-form-item label="模型文件">
          <!-- <uploadModel></uploadModel> -->
          <el-upload
            ref="uoload"
            class="upload-model"
            :action="url"
            :headers="headers"
            multiple
            :limit="1"
            :file-list="fileList"
            :auto-upload="false"
            :http-request="uploadFile"
            :on-change="changeFile"
            :before-upload="beforeUpload">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        


      </el-form>
      <div class="submit_btn">
        <el-button type="primary" size="small" @click="save">导 入</el-button>
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
import { citypeList } from "@/api/system/ciModel";
import { importCi } from "@/api/cmdb/ciModel"
import website from '@/config/website';
import {Base64} from 'js-base64';
import crypto from "@/util/crypto";
import {serialize} from '@/util/util'
import {getToken} from '@/util/auth'
import iconList from './iconList'
import uploadModel from './uploadModel'

const formData = new FormData()
export default {
  components: { iconList, uploadModel },
  props: ["isShow",],
  data() {
    return{
      submitForm: {
        icon: 'tsfont-ci',
        isMenu: 0,
        isAbstract: 0,
      },
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
      url: '/api/idevelop-cmdb/cmdb/ci/import',
      headers: {
        Authorization: undefined,
        'Idevelop-Auth': undefined,
      },
      fileList: [],
  
      // 弹窗
      showIcon: false,
    }
  },
  mounted() {
    this.getDicts()
  },
  methods: {
    // 字典值
    getDicts() {
      // 模型层级
      citypeList().then(res => {
        this.ciTypeList = res.Return
      })
    },
    // 获得层级名称
    changeCitype(val) {
      for(let i=0; i<this.ciTypeList.length; i++) {
        let item = this.ciTypeList[i]
        if(item.id === val) this.submitForm.typeName = item.name
      }
    },
    changeFile(file) {
      if(file.name.split('.')[1] !== 'model') {
        this.$message({
          type: 'warning',
          message: '请上传.model类型文件！'
        });
        this.fileList = []
        return false
      }
    },
    beforeUpload(file) {
      formData.append('file', file)
      this.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
      this.headers['Idevelop-Auth'] = 'bearer ' + getToken()
    },
    uploadFile() {
      this.$refs.submitForm.validate((valid) => {
        if(valid) {
          formData.append('icon', this.submitForm.icon)
          formData.append('name', this.submitForm.name)
          formData.append('label', this.submitForm.label)
          formData.append('typeId', this.submitForm.typeId)
          importCi(formData).then(res => {
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
    save() {
      this.$refs.uoload.submit()
      // this.$refs.submitForm.validate((valid) => {
      //   if(valid) {
      //     this.saveLoading = true
      //     console
      //     importCi(this.submitForm).then(res => {
      //       this.$message({
      //         type: 'success',
      //         message: '保存成功！'
      //       });
      //       this.$emit('saveCi')
      //       this.saveLoading = false
      //     }).catch(() => {
      //       this.saveLoading = false
      //     })
      //   }
      // })
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

