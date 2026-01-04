<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="删除确认"
      width="700px"
      top="30vh"
      v-el-drag-dialog
    >
      <div>
        是否确认删除当前选中配置项？
      </div>
      <el-divider></el-divider>
      <el-input v-model="description" type="textarea" :rows="5"></el-input>
      <div class="submit_btn">
        <el-button type="danger" size="small" @click="delConfig(true)" :loading="saveLoading">删 除</el-button>
        <!-- <el-button type="danger" size="small" @click="delConfig(false)" :loading="saveLoading">删 除</el-button> -->
        <el-button size="small" @click="$emit('close')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteConfig } from "@/api/cmdb/ciConfig";

export default {
  props: ['isShow', "configId"],
  data() {
    return{
      description: '',
      saveLoading: false
    }
  },
  mounted() {},
  methods: {
    // 删除并提交
    delConfig(val) {
      let form = {
        id: this.configId,
        description: this.description,
        needCommit: val
      }
      this.saveLoading = true
      deleteConfig(form).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功！'
        });
        this.saveLoading = false
        this.$emit('submitDelConfig')
      }).catch(() => {
        this.saveLoading = false
      })
    },
   
  }
}
</script>
