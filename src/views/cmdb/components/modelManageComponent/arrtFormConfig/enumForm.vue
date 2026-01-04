<template>
  <div>
    <el-form-item label="成员">
      <el-button type="text" class="el-icon-plus" @click="addItem">添 加 成 员</el-button>
      <div
        v-for="(item, index) in memberList"
        :key="index"
        class="member_item"
      >
        <i 
          class="el-icon-minus" 
          style="cursor: pointer;color:#409EFF;margin-right:10px"
          @click="delItem(index)"
        ></i>
        <el-input v-model="memberList[index]" maxlength="30" show-word-limit></el-input>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['formValue', 'showType'],
  data() {
    return{
      memberList: [],
    }
  },
  mounted() {
    if(this.showType != '新增') {
      this.memberList = this.formValue.config.members
    }else {
      this.formValue.config = {
        members: this.memberList
      }
    }
    
  },
  methods: {
    addItem() {
      this.memberList.push("")
    },
    delItem(index) {
      this.memberList.splice(index, 1)
    },
  }
}
</script>

<style lang="scss" scoped>
.member_item{
  display: flex;
  align-items: center; 
  margin-bottom: 10px
}
</style>
