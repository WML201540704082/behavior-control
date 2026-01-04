<template>
  <div class="wrap">
    <el-dialog
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="beforeCloseHandler"
      :visible.sync="isShow"
      append-to-body
      title="导出字段"
      width="1100px"
      top="8vh"
      v-el-drag-dialog
    >
      <div>
          <div>
            <el-input v-model="filterStr" placeholder="请输入筛选" size="small" clearable style="width: 500px;margin-bottom:10px"></el-input>
            <el-button type="primary" size="small" @click="handleInput" style="margin-left: 10px;">搜索</el-button>
          </div>
          <div v-loading="!loading" style="min-height: 100px;">
            <el-checkbox-group v-model="selectArr" size="mini" v-if="loading">
              <el-checkbox v-for="(item,index) in tableData" :key="item.ciId" :label="item.id" border>{{ item.label }}</el-checkbox>
              <!-- <el-checkbox label="label2" border>key2</el-checkbox> -->
            </el-checkbox-group>
          </div>
      </div>

      <div class="submit_btn">
        <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
        <el-button type="primary" plain size="small" @click="beforeCloseHandler" style="margin-left: 20px">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getAttr } from "@/api/assets/devStandingBook"
  import {mapGetters} from "vuex";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";

  export default {
    components: { xtTreeLzaySelect },
    props: {
      ciId2: {
        type: [String, Number],
      },
      warehouse: {
        type: String,
        default: ""
      },
      warehouseName: {
        type: String,
        default: ""
      },
      value: {
        type: [String, Number, Array],
        default: ""
      }
    },
    data() {
      return {
        // abb: true,

        filterStr: '',
        isShow: true,
        loading: false,
        tableData: [],
        tableData2: [],
        selectArr: []
      };
    },
    computed: {
      ...mapGetters(["userInfo", "userDetail"]),
      isVisible: {
        get() {
          return this.isVisible
        },
        set(val) {
          this.$emit("update:isShow", val)
        }
      },
      // aaa(){
      //   console.log(88, this.filterStr, this.tableData)
      //   return this.tableData.filter(ele=> ele.label.includes(this.filterStr))
      // }
    },
    created() {
      //加载数据
      this.getList()
      // console.log(111, this.$store.state.common.govern.SG_CM_BUS)
    },
    methods: {
      handleInput(){
        this.loading = false
        let datas = JSON.parse(JSON.stringify(this.tableData2))
        // console.log(66, this.filterStr, datas)
        if(this.filterStr){
          let hhh = datas.filter(ele=>{
            return ele.label.includes(this.filterStr)
          })
          this.tableData = hhh
        }else{
          this.tableData = datas
        }

        setTimeout(() => {
          this.loading = true
        }, 1200);
      },
      handleSubmit(){
        // console.log(88, this.selectArr)
        this.$emit("setVal", this.selectArr)
        this.isVisible = false
      },
      getList() {
        this.loading = false
        getAttr({ ciId: this.ciId2, attrCiId: this.ciId2 }).then(res => {
          this.tableData = res.data;
          this.tableData2 = res.data;
          
          this.loading = true
        }).catch(() => {
          this.loading = true
        })
      },
      handleSave(row) {
        // if (this.deviceList.length > 0 && this.deviceList.some(el => el.deviceId == row.id)) {
        //   this.$message.warning('该设备已存在，请重新选择')
        //   return
        // }

        // //保存
        // let list = [];
        // list.push(row);
        // this.$emit("setVal", list);
        // this.isVisible = false
      },
      beforeCloseHandler() {
        //点击关闭按钮
        // this.$emit('close')
        this.isVisible = false
      },
    }
  };
</script>
<style lang='scss' scoped>
  ::v-deep .el-checkbox{
    margin-right: 15px;
    margin-left: 0 !important;
    margin-bottom: 10px;
  }

  ::v-deep .el-dialog{
    margin: 0 auto 10px;
  }

  .wrap {
    width: 100%;
  }

  ::v-deep .el-select {
    width: 100% !important;
  }

  .submit_btn {
    text-align: center
  }
</style>
