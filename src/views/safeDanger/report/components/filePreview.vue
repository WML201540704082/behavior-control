<template>
  <div>
    <el-table
      :data="tableList"
      stripe
      size="mini"
      style="width: 100%;height:100%;margin-top: 0px;">
      <el-table-column
        prop="hiddenNumber"
        label=""
        show-overflow-tooltip
        width="80"
        align="center">
        <template slot-scope="scope">{{ fileTypeText }}</template>
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="left"
        :label="tabName1">
        <template slot-scope="scope">
          <!-- <img v-for="item in filesArrImg1" :key="item.id" @click="handleImg(item.fileUrl)" width="100px" height="100px" :src="item.fileUrl" :alt="item.fileName" style="margin-right: 10px;margin-bottom: 10px"> -->
          <el-image
            v-for="item in filesArrImg1" :key="item.id"
            fit="cover"
            style="width: 100px; height: 100px; margin-right: 10px;margin-bottom: 10px"
            :src="item.fileUrl"
            :alt="item.fileName"
            :preview-src-list="srcList"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="hiddenSource"
        header-align="left"
        :label="tabName2"
        width="410"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="item in filesArrFile1" :key="item.id">
            <!-- <a :href="item.fileUrl"> {{ item.fileName }} </a> -->
            <el-link @click="downloadFileByName(item)" type="primary"> {{ item.fileName }} </el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :close-on-click-modal="false" append-to-body class="picShow" :visible.sync="dialogVisible" v-if="dialogVisible" title="图片预览">
      <img class="imgg" :src="imgUrl" ref="img">
    </el-dialog>
  </div>
</template>

<script>
import { queryShortNameTree } from "@/api/safeDanger/report"
import { mapGetters } from 'vuex'
export default {
  name: "workLog",
  props: {
    filesArr: {
      type: Array,
      require: false
    },
    fileTypeText: {
      type: String,
      require: false
    },
    fileType: {
      type: Number,
      require: false
    },
    disabledd: {
      type: Boolean,
      require: false,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
    ]),
    firstCompanys: {
      get(){
        return this.firstCompany
      },
      set(val){
        this.$emit('update:firstCompany', val)
      }
    },
    srcList(){
      return this.filesArrImg1.map(el => el.fileUrl)
    },
    filesArrImg1(){
      return this.filesArr.filter(el => el.textImages == 1 && el.type == this.fileType)
    },
    filesArrFile1(){
      return this.filesArr.filter(el => el.textImages == 0 && el.type == this.fileType)
    },

    tabName1(){
      if(this.fileTypeText == '整改前'){
        return '隐患图片'
      }
      if(this.fileTypeText == '整改计划'){
        return '整改计划图片'
      }
      if(this.fileTypeText == '整改前'){
        return '隐患图片'
      }
    },
    tabName2(){
      if(this.fileTypeText == '整改前'){
        return '隐患文件'
      }
      if(this.fileTypeText == '整改计划'){
        return '整改计划文件'
      }
      if(this.fileTypeText == '整改后'){
        return '整改文件'
      }
    },

  },
  data() {
    return {
      tableList: [ {} ],
      // srcList: [],

      dialogVisible: false,
      imgUrl: '',
    }
  },
  created() {
    this.showInfo()
  },
  mounted() {

  },
  methods: {
    //下载附件
    downloadFileByName(row) {
      // console.log(889, row)
      // return
      let data = {
        businessKey: row.businessKey,
        // tableName: 'cs_t_network_process',
        // columName: 'fileUrl',
        fileName: row.fileName
      };
      this.download('msdp-system/oss/downloadFile', data, row.fileName)
    },

    handleImg(url){
      this.dialogVisible = true;
      this.imgUrl = url
    },
    showInfo(){
      // this.filesArrImg1 = this.filesArr.filter(el => el.textImages == 1 && el.type == 0)
      // this.filesArrFile1 = this.filesArr.filter(el => el.textImages == 0 && el.type == 0)
    }
  }
}
</script>

<style scoped>
  .imgg{
    max-height: 100%;
    max-width: 100%;
  }
</style>
