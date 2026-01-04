<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="模型结构"
      width="1200px"
      top="10vh"
      v-el-drag-dialog
    >
      <datasourcecolumn
        :modelId = modelId
        :datasourceId = datasourceId
        :datasourceName = datasourceName>
      </datasourcecolumn>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import datasourcecolumn from "@/views/data/datasourcecolumn.vue"

export default {
  components:{
    datasourcecolumn
  },
  props: ['isShow','modelId','datasourceId','datasourceName'],
  data() {
    return {
      userName: '',
      comment: '',
      loading: false,
      nextProcess: {},
    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {

  },
  methods: {   }
}
</script>

