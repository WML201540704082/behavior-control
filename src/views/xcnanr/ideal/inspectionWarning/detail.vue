<template>
  <el-dialog
    :close-on-click-modal="false"
    :show-close="true"
    append-to-body
    :visible.sync="dialogFlag"
    title="查看告警详情"
    width="1000px"
    top="10vh"
    @close="closeThisDialog"
    v-el-drag-dialog>
    <el-form ref="form" :model="dialogObject" inline :rules="rules" label-suffix=":" label-width="150px" v-loading="pageLoading" style="margin-top: 20px">
      <el-form-item label="公司">
        <el-input v-model="dialogObject.companyName" readonly style="width: 300px" />
      </el-form-item>
      <el-form-item label="所属机房">
        <el-input v-model="dialogObject.roomName" readonly style="width: 300px" />
      </el-form-item>
      <el-form-item label="告警单元">
        <el-input v-model="dialogObject.unitName" readonly style="width: 300px" />
      </el-form-item>
      <el-form-item label="告警时间">
        <el-input v-model="dialogObject.warningTime" readonly style="width: 300px" />
      </el-form-item>
      <el-form-item label="告警来源">
        <el-input v-model="sourceStr" readonly style="width: 300px" />
      </el-form-item>
      <el-form-item label="告警类型">
        <el-input v-model="warnTypeStr" readonly style="width: 300px" />
      </el-form-item>
      <el-form-item v-if="dialogObject.source === 1" label="关联工单">
        <el-input v-model="dialogObject.code" readonly style="width: 300px" />
      </el-form-item>
      <el-form-item v-if="dialogObject.source === 1" label="创建人">
        <el-input v-model="dialogObject.createUserName" readonly style="width: 300px" />
      </el-form-item>
      <el-form-item label="告警内容">
        <el-input v-model="dialogObject.content" type="textarea" :rows="3" readonly style="width: 760px" />
      </el-form-item>
      <template v-if="dialogObject.status === 1">
        <el-form-item label="处理人">
          <el-input v-model="dialogObject.updateUserName" readonly style="width: 300px" />
        </el-form-item>
        <el-form-item label="处理时间">
          <el-input v-model="updateTimeStr" readonly style="width: 300px" />
        </el-form-item>
        <el-form-item label="处理内容">
          <el-input v-model="dialogObject.dealContent" type="textarea" :rows="3" readonly style="width: 760px" />
        </el-form-item>
      </template>
      <el-form-item label="附件" v-if="uploadFiles && uploadFiles.length > 0">
        <el-table :data="uploadFiles" max-height="400px" width="760px" stripe>
          <el-table-column type="index" label="序号" align="center" width="100px"></el-table-column>
          <el-table-column prop="fileName" align="center" :show-overflow-tooltip="true" width="480px" label="附件名称" />
          <el-table-column label="操作" align="center" min-width="180px">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.ossAddress && scope.row.ossAddress.trim() !== '' " @click="previewFileFunc(scope.row.ossAddress)">查看</el-button>
              <span v-else style="color: red;font-size: 12px">文件路径为空</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <div align="center" style="margin-top: 10px">
        <el-button type="primary" @click="closeThisDialog">返 回</el-button>
      </div>

    </el-form>
  </el-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
import { getDictList } from '@/api/dict'

export default {
  components: {},
  props: {
    dialogFlag: {
      type: Boolean,
      default: false
    },
    dialogObject: {
      type: Object,
      default: null
    },
    uploadFiles:{
      type: Object,
      default: null
    }
  },
  data() {
    return {
      sourceStr: null, warnTypeStr: null, statusStr: null, updateTimeStr: null
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userDetail'])
  },
  created() {
    const _this = this
    getDictList("info_warningSource").then(res => {
      const items = res.data.filter(d => d.dictKey === _this.dialogObject.source + '')
      _this.sourceStr = items.length > 0 ? items[0].dictValue : _this.dialogObject.source
    })
    getDictList("info_warningSattus").then(res => {
      const items = res.data.filter(d => d.dictKey === _this.dialogObject.status + '')
      _this.statusStr = items.length > 0 ? items[0].dictValue : _this.dialogObject.status
    })
    getDictList("info_warning_type").then(res => {
      const items = res.data.filter(d => d.dictKey === _this.dialogObject.warnType + '')
      _this.warnTypeStr = items.length > 0 ? items[0].dictValue : '未定义'
    })

    // 处理确认时间格式
    if (this.dialogObject.updateTime.indexOf("T") > 0) {
      const timeArr = this.dialogObject.updateTime.split("T");
      this.updateTimeStr = timeArr[0] + ' ' + timeArr[1]
    } else {
      this.updateTimeStr = this.dialogObject.updateTime
    }
  },
  mounted() {
  },
  methods: {
    /**
     * 预览反馈上传的附件
     */
    previewFileFunc(ossAddress) {
      if (ossAddress && ossAddress.length > 0) {
        window.open(ossAddress)
      }
    },
    // 关闭当前探测光
    closeThisDialog() {
      this.$emit('closeDialog', null)
    },
    closeTab() {
      document.getElementById('tab-/xcnanr/tempAuthAdd?type=add').childNodes[1].click()
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
