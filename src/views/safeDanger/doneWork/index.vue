<template>
  <div>
    <TodoWork :types='true'></TodoWork>   
  </div>
</template>

<script>
import TodoWork from "../todoWork/index";

import { mapGetters } from 'vuex'



// import { list, del } from "@/api/safeDanger/computerroom";
export default {
  name: "index",
  computed: {
    ...mapGetters([
      'nickName',
      'companyId',
      'companyCode',
    ]),
  },
  components: {TodoWork},
  data() {
    return {
      

    }
  },
  created() {
    
  },
  mounted() {
    
  },
  methods: {
 
  }
}
</script>

<style scoped>
  
</style>
