<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="() => $emit('close')"
    :show-close="true"
    append-to-body
    :visible.sync="showHeper"
    title="帮助文档"
    width="800px"
    v-el-drag-dialog>
    <div v-loading="loading" class="d_wd">
      <div v-for="(item,index) in files" :key="item.uploadFileName" class="d_file">
        <img/>
        <!--        :href="item.fileUrl"-->
        <a class="a_fname" @click="aDowload(item)">{{ item.uploadFileName }}{{ getFileType(item.fileUrl) }}</a>
      </div>

      <div v-if="files&&files.length==0" class="d_empty">
        <span>暂无数据</span>
      </div>
    </div>

    <div class="form-btn d_end">
      <el-button type="danger" plain @click="$emit('close')">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getList} from '@/api/data/uploadfiles'
import {mapGetters} from "vuex";

export default {
  props: ['showHeper'],
  components: {},
  data() {
    return {
      files: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["lockPasswd"])
  },
  mounted() {
    this.loading = true;
    getList().then(res => {
      this.loading = false;
      this.files = res.data.records;
    }).catch(err => {
      this.loading = false;
    })
  },

  methods: {
    aDowload(item) {
      const x = new window.XMLHttpRequest();
      const url = item.fileUrl;
      const fileName = item.uploadFileName;
      x.open('GET', url, true);
      x.responseType = 'blob';
      x.onload = () => {
        const url2 = window.URL.createObjectURL(x.response);
        const a = document.createElement('a');
        a.href = url2;
        a.download = fileName;
        a.click();

        a.style.display = 'none';
        const timer = setTimeout(() => {
          a.remove();

          //释放blob对象
          URL.revokeObjectURL(url2);
          clearTimeout(timer);
        }, 1000)

      };
      x.send();
    },
    getFileType(url) {
      if (url && url.lastIndexOf('.') != -1) {
        return `${url.substr(url.lastIndexOf('.'))}`;
      }
      return null;
    }
  },

};
</script>

<style lang="scss" scoped>
.d_end {
  display: flex;
  justify-content: flex-end;
}

.d_file {
  padding: 0px 12px 12px 12px;

}

.a_fname {
  font-size: 14px;
  color: #0D8EFF;
}

.d_wd {
  height: 50vh;
  overflow-y: auto;
  position: relative;
}
.d_empty{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>
