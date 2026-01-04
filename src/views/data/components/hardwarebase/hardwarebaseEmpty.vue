<template>
  <div>
    功能暂未开放
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {},
  props: ['loading','type','tableHeight',"keyId","searchForm"],
  data() {
    return {    }
  },
  computed: {
    ...mapGetters(["userInfo","userDetail"])
  },
  mounted() {  },
  methods: {  }
}
</script>

