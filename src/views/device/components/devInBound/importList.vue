<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="解析结果"
      width="1200px"
      top="10vh"
      v-el-drag-dialog
    >
      <div class="btn-line">
        <el-button size="small" style="margin-left: 5px;"
                        @click="handleRefresh">刷新</el-button>
        <el-button type="primary" size="small"
                    @click="handleChooseDevice">选设备</el-button>
      </div>
      <xtTable
        :tableData="configTableData"
        :colList="configTableCol"
        :needAction="true"
        :tableLoading="tableLoading"
        :tableHeight="tableHeight"
      > 
        <template v-slot:action="scope">
          <el-link type="primary" size="small" style="margin-right: 10px" @click="handleCheck(scope.scopeData)">查看</el-link>
          <el-link type="primary" size="small" style="margin-right: 10px" @click="handleEdit(scope.scopeData)">编辑</el-link>
          <el-link type="danger" size="small" @click="handleDel(scope.scopeData.row)">删除</el-link>
        </template>
      </xtTable>
      <div style="margin-top: 20px">
        <xtTable
          :tableData="configTableData"
          :colList="configTableCol"
          :needAction="true"
          :tableLoading="tableLoading"
          :tableHeight="tableHeight"
        > 
          <template v-slot:action="scope">
            <el-link type="primary" size="small" style="margin-right: 10px" @click="handleCheck(scope.scopeData)">查看</el-link>
            <el-link type="primary" size="small" style="margin-right: 10px" @click="handleEdit(scope.scopeData)">编辑</el-link>
            <el-link type="danger" size="small" @click="handleDel(scope.scopeData.row)">删除</el-link>
          </template>
        </xtTable>
        <pagination
          :total="total"
          :page.sync="searchForm.currentPage"
          :limit.sync="searchForm.pageSize"
          @pagination="getList"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { globalattrDetail, globalattrSave } from "@/api/system/relationManage";

export default {
  props: ['isShow', 'arrtId', 'showType'],
  data() {
    return{
      submitForm: {
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
        ]
      },
      pageLoading: false,
      saveLoading: false,

      searchForm: {
        currentPage: 1,
        pageSize: 20,
      },
      total: 0,
      configTableData: [], //配置项列表
      configTableCol: [], //列表表头
      tableLoading: false, //表格加载
      tableHeight: undefined,
    }
  },
  mounted() {
    // this.getDetail()
    this.configTableData = [
      {
        attrEntityData: {
          attr_idd1: {
            valueList: [111]
          },
          attr_idd2: {
            valueList: [111]
          },
          attr_idd3: {
            valueList: [111]
          },
          attr_idd4: {
            valueList: [111]
          },
          attr_idd5: {
            valueList: [111]
          },
          attr_idd6: {
            valueList: [111]
          },
        },
        globalAttrEntityData: {

        }
      }
    ]
    this.configTableCol = [
        {
          key: "attr_idd1",
          title: "文本框1"
        },
        {
          key: "attr_idd2",
          title: "文本框2"
        },
        {
          key: "attr_idd3",
          title: "文本框3"
        },
        {
          key: "attr_idd4",
          title: "文本框4"
        },
        {
          key: "attr_idd5",
          title: "文本框5"
        },
        {
          key: "attr_idd6",
          title: "文本框6"
        },
      ]
  },
  methods: {
    handleRefresh(){

    },
    handleChooseDevice(){

    },
    // 详情
    getDetail() {
      if(this.showType != '新增') {
        this.pageLoading = true
        globalattrDetail({id: this.arrtId}).then(res => {
          this.pageLoading = false
          this.submitForm = res.Return
        }).catch(() => {
          this.pageLoading = false
        })
      }
    },
    // 保存
    save() {
      this.$refs.submitForm.validate((valid) => {
        if(valid) {
          this.saveLoading = true
          globalattrSave(this.submitForm).then(res => {
            this.saveLoading = false
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.$emit('saveGlobalArrt')
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-line{
    text-align: right;
    margin-bottom: 20px;
  }
  // ::v-deep .el-dialog__header{
  //   background: #409EFF;
  // }
</style>
