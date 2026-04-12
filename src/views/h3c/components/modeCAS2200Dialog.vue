<template>
  <div>
    <el-dialog
      :close-on-click-modal="true"
      :before-close="() => {$emit('close');}"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="数据预览"
      width="1200px"
      top="10vh"
      v-el-drag-dialog
    >
      <!-- 数据列表  通用 -->
      <modelserver-list :modelId="modelId"></modelserver-list>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import modelChwserver from "@/views/h3c/oidevelopmodelchwserver.vue";
import modelserverList from "@/views/h3c/modelserverList.vue";
export default {
  components:{
    modelChwserver,
    modelserverList,
  },
  props: ['isShow',"modelId"],
  data() {
    return {
      userName: '',
      comment: '',
      nextProcess: {},
    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {   },
  methods: {   }
}
</script>

