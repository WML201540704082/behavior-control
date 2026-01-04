<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="ip地址池管理"
      width="1200px"
      top="10vh"
      v-el-drag-dialog
    >
      <div>
        <div class="page_form">
          <el-form ref="queryForm" :model="searchForm" label-width="105px" class="xt_search_form">
            <el-row>
              <el-col :span="6">
                <div>
                  <el-form-item label="IP地址">
                    <el-input v-model="searchForm.ip" size="mini"></el-input>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="6">
                <div>
                  <el-form-item label="级别">
                    <el-select v-model="searchForm.level" size="mini" placeholder="" clearable style="width: 100%">
                      <el-option
                        v-for="item in levelList" :value="item.dictKey" :label="item.dictValue" :key="item.dictKey">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <el-form-item
                    label="使用情况">
                    <el-select v-model="searchForm.isUsed" size="mini" placeholder="" style="width: 100%" clearable>
                      <el-option
                        v-for="item in isUsedList" :value="item.dictKey" :label="item.dictValue" :key="item.dictKey">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-form>

        </div>
        <div class="page_body">
          <formTitle :titleText="'查询结果列表'" :titleType="'page_title'">
            <div slot="rightBtnBox">
              <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="searchReset" plain>重置</el-button>
              <el-button type="primary" icon="el-icon-c-scale-to-original" @click="initIpPool">初始化ip地址池</el-button>
              <el-button type="primary" icon="el-icon-setting" @click="updateLevel(1)">设置为普通地址</el-button>
              <el-button type="primary" icon="el-icon-setting" @click="updateLevel(2)">设置为预留地址</el-button>
              <el-button type="primary" icon="el-icon-setting" @click="updateLevel(3)">设置为禁用地址</el-button>
              <el-button type="primary" icon="el-icon-setting" @click="updateNewGateway">设置为新网关</el-button>

            </div>
          </formTitle>
          <el-table
            ref="dataTable"
            stripe
            size="small"
            :data="tableData"
            :height="tableHeight"
            v-loading="tableLoading"
            @selection-change="selectionChange"
          >
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column
              prop="orgName" label="公司" width="210px"></el-table-column>
            <el-table-column
              prop="subnetName" label="所属子网"></el-table-column>
            <el-table-column
              prop="ip" label="IP地址"></el-table-column>
            <el-table-column
              prop="ipLevel" label="级别" :formatter="ipLevelFormatter"></el-table-column>
            <el-table-column
              prop="isUsed" label="使用情况" :formatter="isUsedFormatter"></el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page.sync="searchForm.current"
            :limit.sync="searchForm.size"
            @pagination="getList"/>

        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>

import {ippoolSearch, initIpPool, setIpLevel, setNewGateway} from "@/api/operation/safeaccess/subnet";
import {setIsUsed} from "@/api/operation/safeaccess/newIpPool";
import {getDictList} from "@/api/dict";

export default {
  props: ['isShow', 'arrtId', 'institutionName'],
  data() {
    return {
      levelList: [],
      isUsedList: [],

      searchForm: {
        current: 1,
        size: 10
      },
      rules: {
        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'},
        ]
      },

      saveLoading: false,

      tableData: [],
      dataList: [],
      selectionList: [],
      total: 0,
      tableLoading: false, //表格加载
      tableHeight: undefined,
    }
  },
  computed: {
    // ids() {
    //   let ids = [];
    //   this.selectionList.forEach(ele => {
    //     ids.push(ele.id);
    //   });
    //   return ids.join(",");
    // },
  },
  created() {
    this.getList()
    //加载字典--工单状态
    this.getDictList("itump_ippool_level");
    this.getDictList("itump_ippool_isUse");
  },
  methods: {
    selectionChange(val) {
      this.selectionList = val;
    },
    ipLevelFormatter(row) {
      if (row.ipLevel === '1') {
        return '普通地址';
      } else if (row.ipLevel === '2') {
        return '预留地址'
      } else {
        return '禁用地址'
      }
    },
    isUsedFormatter(row) {
      if (row.isUsed === '0') {
        return '未分配';
      } else if (row.isUsed === '1') {
        return '已分配'
      } else {
        return '网关'
      }
    },
    handleSubmit() {
      this.$emit('setVal', this.searchForm)
    },
    handleCancel() {
      this.$emit('close')
    },
    getDictList(code) {
      //加载字典
      getDictList(code).then(res => {
        if (code === 'itump_ippool_level') { // 工单状态
          this.levelList = res.data;
        } else if (code === 'itump_ippool_isUse') {
          this.isUsedList = res.data;
        }
      });
    },
    // 查询
    handleQuery() {
      this.searchForm.current = 1
      this.getList()
    },
    // 重置
    searchReset() {
      this.searchForm = {
        current: 1,
        size: 20
      }
      this.getList()
    },

    //初始化IP地址池
    initIpPool() {
      let params = {
        subnetId: this.arrtId
      }
      this.tableLoading = true;
      initIpPool(params).then(resp => {
        if (resp) {
          this.$message({
            message: "ip地址池初始化成功",
            type: "success"
          });
          this.getList();
        } else {
          this.$message({
            message: "ip地址池初始化失败，请重试",
            type: "error"
          });
        }
        this.tableLoading = false;
      }).catch(() => {
        this.$message.error('初始化IP地址池出现异常');
        this.tableLoading = false;
      })
    },
    updateLevel (val) {

        if (this.selectionList.length!=0){
          for(let i=0;i<this.selectionList.length;i++){
              if(this.selectionList[i].isUsed!='0'){
                  this.$message({
                      message:"只能修改未分配地址",
                      type:"warning"
                  });
                  return;
              }
          }
          // console.log(123, this.selectionList)

          let params = {
              ids: this.selectionList.map(el=> el.ipId),
              ipLevel: val
          };
          setIpLevel(params).then(rel => {
              if(rel.code != 200)return
              this.$message.success("设置成功")
              this.getList();
          })
        }else {
          this.$message.warning( '请选择一条数据')
          return;
        }
       
    },
    updateNewGateway() {
      if (this.selectionList.length != 1) {
        this.$message.warning('只能选择一个网关地址')
        return;
      }
      if (this.selectionList[0].isUsed != '0') {
        this.$message.warning('所选地址已分配，只能选择未分配的地址设置为新网关')
        return;
      }

      let oldParams = null;
      let fItem = this.tableData.find(a => a.isUsed == '2');
      if (fItem) {
        oldParams = {
          ipId: fItem.ipId,
          isUsed: 0,
        };
      }

      let params = {
        ipId: this.selectionList[0].ipId,
        // subnet: this.selectionList[0].subnet
      };
      setNewGateway(params).then(rel => {
        if (rel.code != 200) return
        this.$message({message: "设置为网关成功", type: "success"});
        if (oldParams) {
          //将旧网关设置成未分配状态
          setIsUsed(oldParams).then(res => {
            this.getList();
          })
        }
      })

    },

    // 查询
    getList() {
      this.searchForm.subnet = this.arrtId
      this.tableLoading = true
      ippoolSearch(this.searchForm).then(res => {
        // console.log(123, res)
        res.data.records.forEach(ele=>{
          ele.orgName = this.institutionName
        })
        
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.formLabel {
  line-height: 20px;
}

.btn-row {
  text-align: right;
}
</style>
