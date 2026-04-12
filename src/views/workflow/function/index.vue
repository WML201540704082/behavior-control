<template>
  <div class="list-container functionMain">
    <div class="list-box">

      <div class="table-box">
        <div class="table-filter flex">
          <el-input
            v-model="listQuery.functionName"
            style="width:200px;"
            :placeholder="$hussarT('hussar-function.functionName')"
            class="search-input"
            clearable
            type="text"
          />

            <el-button
              class="ml1"
              style="margin-left: 10px;"
              type="primary"
              @click="queryFunction(true)">
              {{ $hussarT('hussar-common.search') }}
            </el-button>
            <el-button
              class="ml1"
              @click="clearData()">
              {{ $hussarT('hussar-common.reset') }}
            </el-button>

            <el-button
              class="ml1"
              type="primary"
              @click="addFunction">
              {{ $hussarT('hussar-common.new') }}
            </el-button>

          </div>
        </div>
        <div class="table-wrap">
          <el-table
            v-loading="listLoading"
            ref="tableRow"
            :data="list"
            :element-loading-text="$hussarT('hussar-common.loading')"
            height="calc(100vh - 200px)"
            fit
            stripe
            style="margin-top:10px;"
            class="lcdp-table"
            @selection-change="changeFun"
            @select-all="selectAll"
          >
            <el-table-column
              type="selection"
              align="center"
              width="80" />
            <el-table-column
              :label="$hussarT('hussar-common.no')"
              :index="indexMethod"
              type="index"
              align="center"/>
            <el-table-column
              :label="$hussarT('hussar-function.functionName')"
              prop="functionName">
              <template slot-scope="scope">
                <a
                  href="#"
                  class="mainColor"
                  @click.stop="view(scope.row.id,scope.row.functionBean,scope.row.functionName)">
                  <span :title="scope.row.functionName">{{ scope.row.functionName }}</span>
                </a>
              </template>
            </el-table-column>
            <el-table-column
              label="beanId"
              prop="functionBean" />
            <el-table-column
              :label="$hussarT('hussar-function.createTime')"
              prop="createTime" />
            <el-table-column
              :label="$hussarT('hussar-common.operation')"
              align="center"
              width="180">
              <template slot-scope="scope">
                <div class="btn-box flex flex-center">
                  <div
                    class="btn-text"
                    @click="openEdit(scope.row.id,scope.row.functionBean,scope.row.functionName)">{{ $hussarT('hussar-common.edit') }}</div>
                  <!--                  <div class="line" />-->
                  <!--                  <div class="btn-text" @click="view(scope.row.id,scope.row.functionBean,scope.row.functionName)">{{ $hussarT('hussar-function.check') }}</div>-->

                  <div
                    class="btn-text"
                    @click="deleteFun(scope.row)">{{ $hussarT('hussar-common.delete') }}</div>
                </div>
                <!--                <el-button class="btn-blue" @click="openEdit(scope.row.id,scope.row.functionBean,scope.row.functionName)">{{$hussarT('hussar-common.change')}}</el-button>-->
                <!--                <el-button class="btn-blue" @click="view(scope.row.id,scope.row.functionBean,scope.row.functionName)">{{$hussarT('hussar-function.check')}}</el-button>-->
                <!--                <el-button class="btn-red" @click="deleteFun(scope.row.id)">{{$hussarT('hussar-common.delete')}}</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page.sync="page.currentPage"
            :page-sizes="page.sizes"
            :page-size="listQuery.size"
            :total="total"
            :pager-count="pageCount"
            layout="total, sizes, prev, pager, next"
             background
            style="text-align: right;margin-top: 10px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

    <!--                    抽屉-->
    <el-drawer
      ref="drawer"
      :with-header="false"
      :show-close="false"
      :destroy-on-close="true"

      :append-to-body="true"
      :wrapper-closable="isView"
      :visible.sync="showDrawer"
      size="480px"
      class="table-drawer"
    >
      <div class="flex flex-col drawer-height"  style="padding:20px 10px;">
        <div class="drawer-title-box flex flex-up-down">
          <i
            v-if="!isView && isAdd"
            class="font_family icon-hussar_slideright_add icon" />
          <i
            v-if="!isView && !isAdd"
            class="font_family icon-hussar_slideright_edit icon" />
          <i
            v-if="isView"
            class="font_family icon-hussar_slideright_info icon" />
          <div class="title-content">
            <div class="title-text">
              <span>{{ isView ? this.$hussarT('hussar-function.functionType') : isAdd ? this.$hussarT('hussar-function.funcAdd') : this.$hussarT('hussar-function.funcChange') }}</span>
            </div>
            <!--                                        <div class="title-des">新增入职人员,直接保持人员生效，还需设置对应角色和权限</div>-->
          </div>
          <div
            v-if="isView"
            style="margin-left: auto">
            <el-button
              class="drawer-btn-detail-edit"
              @click="detailToEdit">{{ $hussarT('hussar-common.change') }}</el-button>
          </div>
        </div>
        <div class="line" />
        <div
          class="form-box"
          style="flex-grow: 1">
          <el-form
            ref="functionForm"
            :model="dynamicValidateForm"
            :hide-required-asterisk="isView"
            :class="isView?'detail-form':''"
            class="drawer-form">
            <!--函数类型增加或修改-->
            <el-form-item
              :rules="functionRules.functionName"
              :label="$hussarT('hussar-function.functionName')"
              prop="functionName">
              <el-input
                v-if="!isView"
                v-model="dynamicValidateForm.functionName"
                :placeholder="$hussarT('hussar-function.inFunctionName')"
                maxlength="30" />
              <div
                v-if="isView"
                class="detail-item">
                {{ dynamicValidateForm.functionName }}
              </div>
            </el-form-item>
            <el-form-item
              :rules="functionRules.functionBean"
              label="beanId"
              prop="functionBean">
              <el-input
                v-if="!isView"
                v-model="dynamicValidateForm.functionBean"
                :disabled="!isAdd"
                :placeholder="$hussarT('hussar-function.inBeanId')"
                maxlength="30" />
              <div
                v-if="isView"
                class="detail-item">
                {{ dynamicValidateForm.functionBean }}
              </div>
            </el-form-item>
            <div>
              <el-divider>{{ $hussarT('hussar-function.configureParameter') }}</el-divider>
            </div>
            <!--            <el-button v-if="!isView" type="primary" class="hs-btn-long-4 btn-common" @click="addDomain">{{$hussarT('hussar-function.addFunc')}}</el-button>-->
            <!--参数-->
            <div
              v-for="(functionValue,index) in dynamicValidateForm.functionValues"
              :key="index"
              class="domain-item flex flex-up-down">
              <!--              <div class="domain-title flex flex-up-down">-->
              <!--                <div class="title-line" />-->
              <!--                <div class="title-text">-->
              <!--                  <span>{{ $hussarT('hussar-function.param') }}{{ index + 1 }}</span>-->
              <!--                </div>-->
              <!--                <i v-if="!isView" class="el-icon-delete" @click="removeDomain(functionValue)" />-->
              <!--              </div>-->
              <el-form-item
                :rules="functionRules.parmKey"
                :prop="'functionValues.' + index + '.parmKey'"
                :label="$hussarT('hussar-function.paramIdent')"
              >
                <el-input
                  v-if="!isView"
                  v-model="functionValue.parmKey"
                  :placeholder="$hussarT('hussar-function.inParamIdent')"
                  maxlength="30"
                  style="margin-right: 14px;" />
                <div
                  v-if="isView"
                  class="detail-item"
                  style="margin-right: 14px">
                  {{ functionValue.parmKey }}
                </div>
              </el-form-item>
              <el-form-item
                :rules="functionRules.parmName"
                :prop="'functionValues.' + index + '.parmName'"
                :label="$hussarT('hussar-function.paramName')"
              >
                <el-input
                  v-if="!isView"
                  v-model="functionValue.parmName"
                  :placeholder="$hussarT('hussar-function.inParamName')"
                  maxlength="50" />
                <div
                  v-if="isView"
                  class="detail-item">
                  {{ functionValue.parmName }}
                </div>
              </el-form-item>
              <i
                v-if="!isView"
                class="font_family icon-hussar_delete"
                @click="removeDomain(functionValue)" />
            </div>
            <el-button
              v-if="!isView"
              size="small"
              type="primary"
              style="margin-bottom: 16px;"
              @click="addDomain">
                {{ $hussarT('hussar-function.addFunc') }}
            </el-button>
          </el-form>
        </div>
        <div
          v-if="!isView"
          class="line"/>
        <div
          v-if="!isView"
          style="text-align: center;"
          class="bottom-box">
          <div class="btn-box">
            <el-button
              class="drawer-btn-cancel"
              @click="handleClose">{{ $hussarT('hussar-common.cancel') }}</el-button>
            <el-button
              :loading="addLoading"
              type="primary"
              class="drawer-btn-save"
              @click="saveFunctionForm">{{ $hussarT('hussar-common.save') }}</el-button>
          </div>
        </div>
      </div>
    </el-drawer>

  </div>
</template>
<script>
import { FunctionApi } from "@/api/workflow/functionApi";

import hussarRequest from '@/views/workflow/util/request'

export default {
  name: 'function', // 函数管理页面
  data() {
    const parmKeyCheck = (rule, value, callback) => {
      // 检验是否为空
      if (value === undefined || value === null || value.trim() === '' || value.trim().split('').length === 0) {
        return callback(new Error('此项为必填项'));
      }
      var regex = /^[A-Za-z0-9]+$/;
      if (!regex.test(value)) {
        return callback(new Error(this.$hussarT('hussar-function.paramR1')));
      }
      // 检验是否重复
      var row_index = rule.field.replace(/[^0-9]/ig, '');
      if (this.dynamicValidateForm.functionValues.length > 1) {
        for (var index in this.dynamicValidateForm.functionValues) {
          var item = this.dynamicValidateForm.functionValues[index];
          if (item.parmKey === value && index !== row_index) {
            return callback(new Error(this.$hussarT('hussar-function.paramR2')));
          }
        }
        callback();
      } else {
        callback();
      }
    };
    const checkBeanId = (rule, value, callback) => {
      // 检验是否为空
      if (value === undefined || value === null || value.trim() === '' || value.trim().split('').length === 0) {
        return callback(new Error('此项为必填项'));
      }
      var regex = /^[A-Za-z0-9]+$/;
      if (!regex.test(value)) {
        return callback(new Error(this.$hussarT('hussar-function.funcR1')));
      }
      callback();
    };
    const trimCheckFunctionName = (rule, value, callback) => {
      // 检验是否为空
      if (value === undefined || value === null || value.trim() === '' || value.trim().split('').length === 0) {
        return callback(new Error('此项为必填项'));
      }
      callback();
    };
    const trimCheckParmName = (rule, value, callback) => {
      // 检验是否为空
      if (value === undefined || value === null || value.trim() === '' || value.trim().split('').length === 0) {
        return callback(new Error('此项为必填项'));
      }
      callback();
    };
    return {
      showDrawer: false,
      // 查询条件
      listQuery: {
        functionName: null,
        size: 10,
        page: 1
      },
      // 是否查看
      isView: false,
      // 是否新增
      isAdd: true,
      // 新增时loading
      addLoading: false,
      // 表单增减项
      dynamicValidateForm: {
        function: {
          id: '',
          functionName: '',
          functionBean: '',
          change: ''
        },
        functionName: '',
        functionValues: []
      },
      // 修改时原本的数据
      editDefaultForm: {
        functionName: '',
        functionBean: ''
      },
      // 是否修改了函数
      isChange: false,
      // 删除的函数id
      delPrimaryKeys: [],
      // 列表选择的数据集合
      checkBoxData: [],
      // 列表数据
      list: [],
      listLoading: false,
      // 总页数
      total: 0,
      pageCount: 7,
      // 分页参数
      page: { currentPage: 1, size: 10, sizes: [10, 20, 50, 100] },
      // 表单验证规则
      functionRules: {
        functionBean: [
          { validator: checkBeanId, trigger: 'blur' },
          { required: true, trigger: 'blur', message: '此项为必填项' },
          { min: 0, max: 30, message: this.$hussarT('hussar-function.paramR3'), trigger: 'blur' }],
        functionName: [
          { validator: trimCheckFunctionName, trigger: 'blur' },
          { required: true, trigger: 'blur', message: '此项为必填项' },
          { min: 0, max: 30, message: this.$hussarT('hussar-function.funcR2'), trigger: 'blur' }],
        parmKey: [
          { validator: parmKeyCheck, trigger: 'blur' },
          { required: true, trigger: 'blur', message: '此项为必填项' },
          { min: 0, max: 30, message: this.$hussarT('hussar-function.funcR3'), trigger: 'blur' }],
        parmName: [
          { validator: trimCheckParmName, trigger: 'blur' },
          { required: true, trigger: 'blur', message: '此项为必填项' },
          { min: 0, max: 50, message: this.$hussarT('hussar-function.paramR4'), trigger: 'blur' }]
      }
    };
  },
  watch: {
    'dynamicValidateForm': {
      deep: true,
      handler: function(newV, oldV) {
        if (newV === oldV) {
          return;
        }
        if (this.$refs.functionForm) {
          this.$refs.functionForm.validate({});
        }
      }
    }
  },
  mounted() {
    this.queryFunction();
  },
  methods: {
    indexMethod(index) {
      const curpage = this.page.currentPage;
      const size = this.listQuery.size;
      return (index + 1) + (curpage - 1) * size;
    },
    //编辑页面跳转修改
    detailToEdit(){
      this.handleClose();
      this.$nextTick(() => {
        this.openEdit(this.dynamicValidateForm.id,this.dynamicValidateForm.functionBean,this.dynamicValidateForm.functionName)
      })

    },
    // 函数新增
    addFunction() {
      this.reset();
      this.delPrimaryKeys = [];
      if (this.$refs.functionForm !== undefined) {
        this.$refs.functionForm.resetFields();
      }
      this.showDrawer = true;
      this.isAdd = true;
      this.isView = false;
      if (this.$refs.functionForm !== undefined) {
        this.$refs.functionForm.resetFields();
      }
    },
    // 函数删除
    deleteFun(row) {
      // document.body.classList.add("modal-parent");
      let id = row.id;
      let name = row.functionName;
      const msg = this.$hussarT('hussar-common.confirmedMsgToDelete1')
              + '<span class="msg-highlight">"' +  name + '"</span>，'
              + this.$hussarT('hussar-common.confirmedMsgToDelete2');
      this.$confirm(msg, this.$hussarT('hussar-common.confirmedToDeleteNew'), {
        confirmButtonText: this.$hussarT('hussar-common.delete'),
        cancelButtonText: this.$hussarT('hussar-common.cancel'),
        cancelButtonClass:'dialog-cancel',
        closeOnClickModal: false,
        dangerouslyUseHTMLString: true,
        confirmButtonClass:'dialog-delete',
        showClose:false,
        type: 'warning',
        customClass: 'lcdp-message',
      }).then(res => {
        hussarRequest.post(FunctionApi.delete, id).then(res => {
          if (res.code === 10000) {
            this.queryFunction();
            this.$message.success('删除成功');
          }
        }).catch(res => {
          this.$message.error('删除失败');
        });
      });
    },
    // 打开修改弹窗
    openEdit(id, functionBean, functionName) {
      this.reset();
      this.delPrimaryKeys = [];
      if (this.$refs.functionForm !== undefined) {
        this.$refs.functionForm.resetFields();
      }
      hussarRequest.get(FunctionApi.detail, { 'functionId': id }).then(res => {
        if (res.code === 10000) {
          this.isView = false;
          this.isAdd = false;
          this.showDrawer = true;
          this.isChange = false;
          this.dynamicValidateForm.id = id;
          this.dynamicValidateForm.functionBean = functionBean;
          this.dynamicValidateForm.functionName = functionName;
          this.dynamicValidateForm.functionValues = res.data;
          this.editDefaultForm.functionBean = functionBean;
          this.editDefaultForm.functionName = functionName;
        }
      }).catch(res => {
        this.$message.error(this.$hussarT('hussar-function.openError'));
      });
    },
    // 查看
    view(id, functionBean, functionName) {
      this.reset();
      this.delPrimaryKeys = [];
      if (this.$refs.functionForm !== undefined) {
        this.$refs.functionForm.resetFields();
      }
      hussarRequest.get(FunctionApi.detail, { 'functionId': id }).then(res => {
        if (res.code === 10000) {
          this.isView = true;
          this.showDrawer = true;
          this.dynamicValidateForm.id = id;
          this.dynamicValidateForm.functionBean = functionBean;
          this.dynamicValidateForm.functionName = functionName;
          this.dynamicValidateForm.functionValues = res.data;
        }
      }).catch(res => {
        this.$message.error(this.$hussarT('hussar-function.checkError'));
      });
    },
    // 删除dom
    removeDomain(item) {
      const index = this.dynamicValidateForm.functionValues.indexOf(item);
      if (index !== -1) {
      // 记住被删除的主键
        if (item.id !== '' && item.id !== '' && item.id !== undefined && item.id !== null) {
          this.delPrimaryKeys.push(item.id);
        }
        this.dynamicValidateForm.functionValues.splice(index, 1);
        // 表单验证渲染
        this.$nextTick (() => {
          this.$refs.functionForm.validate({}).catch(() => {});
        })
      }
    },
    // 增加dom
    addDomain() {
      this.dynamicValidateForm.functionValues.push({ id: '', parmKey: '', parmName: '' });
    },
    // 新增或修改保存
    saveFunctionForm() {
      // 按钮加loading
      this.addLoading = true;
      this.$refs.functionForm.validate(res => {
        if (res) {
          // 新增
          if (this.isAdd) {
            const params = {
              functionName: this.dynamicValidateForm.functionName,
              functionBean: this.dynamicValidateForm.functionBean,
              functionParm: this.dynamicValidateForm.functionValues.length === 0 ? null : JSON.stringify(this.dynamicValidateForm.functionValues)
            };
            hussarRequest.post(FunctionApi.add, params).then(res => {
              if (res.code === 10000) {
                this.clearData();
                this.$message.success(this.$hussarT('hussar-function.addSucc'));
                this.handleClose();
              }
              this.addLoading = false;
            }).catch(res => {
              // this.$message.error(this.$hussarT('hussar-function.addFail') + (res.message || this.$hussarT('hussar-function.unknowError')) + this.$hussarT('hussar-function.parenttheses'));
              this.addLoading = false;
            });
          } else {
            if (this.dynamicValidateForm.functionName !== this.editDefaultForm.functionName ||
                    this.dynamicValidateForm.functionBean !== this.editDefaultForm.functionBean) {
              this.isChange = true;
            }
            const params = {
              id: this.dynamicValidateForm.id,
              functionName: this.dynamicValidateForm.functionName,
              functionBean: this.dynamicValidateForm.functionBean,
              change: this.isChange,
              functionParm: this.dynamicValidateForm.functionValues.length === 0 ? null : JSON.stringify(this.dynamicValidateForm.functionValues),
              delIds: this.delPrimaryKeys.join(',')
            };
            // 更新
            hussarRequest.post(FunctionApi.edit, params).then(res => {
              if (res.code === 10000) {
                this.clearData();
                this.$message.success(this.$hussarT('hussar-common.changedSuccessful'));
                this.handleClose();
              }
              this.addLoading = false;
            }).catch(res => {
              this.addLoading = false;
            });
          }
        } else {
          this.addLoading = false;
        }
      });
    },
    // 选择列表数据
    changeFun(val) {
      this.checkBoxData = val;
    },
     selectAll(){
        if(this.list.length==0){this.$refs.tableRow.clearSelection()}
        },
    // 函数新增修改对话框关闭
    handleClose() {
      this.$refs.drawer.closeDrawer();
      this.delPrimaryKeys = [];
    },
    // 表单重置
    reset() {
      this.dynamicValidateForm = {
        id: '',
        functionName: '',
        functionBean: '',
        change: '',
        functionValues: []
      };
      this.editDefaultForm = {
        functionName: '',
        functionBean: ''
      };
    },
    // 查询数据
    queryFunction(isReset) {
      if(isReset){
        this.listQuery.page = 1;
        this.page.currentPage = 1;
      }
      this.listLoading = true;
      this.listQuery.current = this.listQuery.page;
      hussarRequest.get(FunctionApi.list, this.listQuery).then(res => {
        if (res.code === 10000) {
          this.listLoading = false;
          this.list = res.data.records;
          this.total = res.data.total;
        } else {
          this.listLoading = false;
        }
      }).catch(res => {
        this.listLoading = false;
      });
    },
    // 重置按钮
    clearData() {
      this.listQuery.functionName = '';
      this.queryFunction(true);
    },
    // 每页条数改变
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.listQuery.size = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.listQuery.page = 1;
      this.queryFunction();
    },
    // 页码切换
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryFunction();
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

  .row_split {
    border-bottom: 1px solid #DCDFE6;
    position: relative;
    height:60px !important;
  }
  .el-form-item.is-required ::v-deep .el-form-item__label{
    text-align: right
  }
  .domainForm {
    height: 100%;
    overflow: hidden;
  }
  .domainBox {
    height: calc(100% - 81px);
    position: relative;
    overflow: auto;
    top: 20px;
  }
  .fliter-item{
      display: inline-block;
      overflow: hidden;
      margin-right: 4px;
      vertical-align: middle;
    }
  .hs-btn-long-4{
    width: auto;
  }
</style>
<style lang="scss" scoped>
  ::v-deep.functionMain {
    width: 100%;
    height: 100%;
    padding: 10px 10px 10px 20px;
  }
  ::v-deep.functionMain .el-upload-dragger{
    margin: 0 auto;
    width: 90%
  }
  ::v-deep.dialogFitHeightDict .el-dialog__body{
    height: 380px!important;
    overflow: hidden;
  }
  ::v-deep.dialogFitHeightDict .el-dialog {
    overflow: hidden !important;
  }
::v-deep.dialog-delete{font-size:14px;}
::v-deep.dialog-cancel{font-size:14px;}
</style>
<style lang="scss" scoped>

  .btn-text{
    cursor:pointer;
    display: inline-block;
    margin: 0 10px;
    color: #0d8eff;
  }
  .el-upload{width: 100%}
  ::v-deep.el-upload-dragger{margin: 0 auto;width: 100%;height: 100%; min-height: 182px; border-radius: 2px;background: #fafcfe;}
  .el-dialog__body_box ::v-deep.el-dialog__body{padding: 32px 32px 35px; width: 100%; height: 100%;text-align: center;}
  .el-dialog__body_box ::v-deep.el-dialog__body .upload-demo{height: calc(100% - 64px); width: 100%}
  ::v-deep.el-upload-dragger .el-icon-upload{margin: 56px 0 8px;font-size: 56px;color: #69BCFF}
  ::v-deep.el-upload-dragger .el-upload__text{color: #878787}
  ::v-deep.el-divider--horizontal{margin: 10px 0 34px}
  ::v-deep.el-divider__text{font-size: 16px;font-family: PingFangSC, PingFangSC-Regular;font-weight: 400;color: #545672;}
  .drawer-form .domain-item ::v-deep.el-form-item__content .el-input,
  .drawer-form .domain-item .detail-item{width: 186px;}
  .drawer-form .domain-item i{margin-left: 6px;font-size: 18px;color: #545672;cursor: pointer;}
</style>
