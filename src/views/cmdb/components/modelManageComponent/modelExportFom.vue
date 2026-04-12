<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="导出模型"
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
          <el-form-item label="模型" prop="checkedNodes">
            <el-select multiple v-model="labelCom" @change="changeCitype" @remove-tag="removeTag">
              <el-option label="" value="">
                <el-tree
                  ref="elTree"
                  node-key="value"
                  :data="treeData"
                  show-checkbox
                  @check-change="handleClickCheckChange"
                  check-strictly>
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
      </el-form>
      <div class="submit_btn">
        <el-button type="primary" size="small" @click="save">确 认</el-button>
        <el-button size="small" @click="$emit('close')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { citypeList, ciSave, listtree } from "@/api/system/ciModel";


export default {
  components: {  },
  props: ["isShow", "ciId"],
  data() {
    return{
      treeData: [
        {
          label: '节点1',
          value: '1',
          children: [
            {
              label: '节点1-1',
              value: '11',
              children: [
                {
                  label: '节点1-11',
                  value: '111'
                },
                {
                  label: '节点1-12',
                  value: '222'
                },
                {
                  label: '节点1-13',
                  value: '333'
                }
              ]
            }
          ]
        }
      ],
      submitForm: {
        checkedNodes: []
      },
      rules: {
        checkedNodes: [
          { type: 'array', required: true, message: '请选择模型', trigger: 'change' },
        ]
      },
      ciTypeList: [],
  
      // 弹窗
      showIcon: false,


      
    }
  },
  computed:{
    labelCom(){
      return this.submitForm.checkedNodes.map(el=> el.label)
    }
  },
  mounted() {
    this.getDicts()
  },
  methods: {
    // 字典值
    getDicts() {
      // 模型层级
      listtree().then(res => {
        // console.log(890, res)
        this.treeData = res.Return
      })
    },

    handleClickCheckChange(data, checked, indeterminate){
      this.submitForm.checkedNodes = this.$refs.elTree.getCheckedNodes()
    },
    // 获得层级名称
    changeCitype(val) {
    },
    removeTag(val){
      let shengyu = this.submitForm.checkedNodes.filter(el => el.label != val)
      this.submitForm.checkedNodes = shengyu
      this.$refs.elTree.setCheckedNodes(shengyu)
    },

    
    save() {
      this.$refs.submitForm.validate((valid) => {
        if(valid) {
          this.saveLoading = true
          let params = {
            idList: this.submitForm.checkedNodes.map(el=> el.id),
            isSimple: true
          } 
          this.download(
            "/api/idevelop-cmdb/cmdb/ci/export/forexcel",
            params,
            "导出模型.xlsx"
          );
          // ciSave(tparams).then(res => {
          //   this.$message({
          //     type: 'success',
          //     message: '保存成功！'
          //   });
          //   this.$emit('saveCi')
          //   this.saveLoading = false
          // }).catch(() => {
          //   this.saveLoading = false
          // })
        }
      })
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

