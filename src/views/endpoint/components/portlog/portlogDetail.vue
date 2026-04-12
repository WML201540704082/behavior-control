<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="三方系统交互详情"
      width="1000px"
      top="5vh"
      v-el-drag-dialog
    >
      <el-form
        :model="threeLogDetail"
        label-suffix=":"
        label-width="120px"
        size="small"
      >
        <scrollbarBox :boxHeight="'700px'">
          <el-form-item
            v-for="(item, index) in formItemList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
          >
            <div v-if="item.prop == 'text'" class="json_box">
              <json-viewer :value="threeLogDetail[item.prop]"></json-viewer>
            </div>
            <el-input v-else v-model="threeLogDetail[item.prop]" disabled></el-input>
          </el-form-item>
        </scrollbarBox>

      </el-form>

    </el-dialog>
  </div>
</template>

<script>
  import {tripleapilogDetail} from "@/api/logs";

  export default {
    props: ['isShow', 'itemId'],
    data() {
      return{
        formItemList: [
          {
            label: 'ID',
            prop: 'id',
            value: ''
          },
          {
            label: '类名',
            prop: 'className',
            value: ''
          },
          {
            label: '结束时间',
            prop: 'endTime',
            value: ''
          },
          {
            label: 'ip地址',
            prop: 'ip',
            value: ''
          },
          {
            label: '方法名',
            prop: 'methodName',
            value: ''
          },
          {
            label: '用户区域名称',
            prop: 'regionName',
            value: ''
          },
          {
            label: '返回结果',
            prop: 'result',
            value: ''
          },
          {
            label: '开始时间',
            prop: 'startTime',
            value: ''
          },
          {
            label: '是否成功',
            prop: 'success',
            value: ''
          },

          {
            label: '参数值',
            prop: 'text',
            value: ''
          },
          {
            label: '三方系统',
            prop: 'tripleType',
            value: ''
          },
          {
            label: '操作类型',
            prop: 'value',
            value: ''
          },
        ],
        threeLogDetail: {}
      }
    },
    mounted() {
      this.getDetail()
    },
    methods: {
      getDetail() {
        tripleapilogDetail({id: this.itemId}).then(res => {
          this.threeLogDetail = res.data
          this.threeLogDetail.text = JSON.parse(this.threeLogDetail.text)
          for(let i=0; i<this.formItemList.length; i++) {
            let item = this.formItemList[i]
            if(item.label == '是否成功') {
              this.threeLogDetail[item.prop] = this.threeLogDetail[item.prop] == 1? '失败' : '成功'
            }

            item.value = this.threeLogDetail[item.prop]
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .json_box{
    background-color: #F5F7FA;
    border: 1px solid #E4E7ED;
    border-radius: 4px;
    max-height: 350px;
    overflow-y: auto;
  }
  ::v-deep .jv-container.jv-light{
    background-color: #F5F7FA;
    border-radius: 4px;

  }
  ::v-deep .jv-container .jv-code{
    padding: 15px
  }
</style>
