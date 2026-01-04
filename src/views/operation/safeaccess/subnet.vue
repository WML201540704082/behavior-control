<template>
  <div class="ziwang">
    <div class="ziwang_l">
      <el-aside class="xt-layout-sider">
        <el-tree ref="treeZW"
                 v-show="activeName=='first'"
                 :data="unitlList"
                 :props="defaultProps2"
                 node-key="id"
                 :default-expand-all="false"
                 highlight-current
                 accordion
                 @node-click="handleNodeClick2"
                 style="min-width:180px;height:100%; overflow-y: auto;overflow-x: auto"></el-tree>
        <el-tree ref="treeIP"
                 v-show="activeName=='second'"
                 :data="ipdata"
                 :props="defaultProps"
                 :default-expand-all="false"
                 node-key="id"
                 lazy
                 accordion
                 :load="loadNode"
                 @node-click="handleNodeClick"
                 style="min-width:180px;height:100%; overflow-y: auto;overflow-x: auto"></el-tree>
      </el-aside>
    </div>
    <div class="ziwang_r">
      <basic-container>
        <div class="page_form"></div>
        <div class="page_body">
          <el-tabs v-model="activeName" @click="handleClick">
            <el-tab-pane name="first">
              <span slot="label"> <i class="el-icon-s-operation"></i> 子网管理 </span>
              <subnetManage ref="subnetManage" v-show="activeName == 'first'" @resetClick="resetClick"></subnetManage>
            </el-tab-pane>
            <el-tab-pane name="second">
              <span slot="label"> <i class="el-icon-set-up"></i> IP资源管理 </span>
              <newIpPool ref="newIpPool" v-show="activeName == 'second'" @resetClick="resetClick"></newIpPool>
            </el-tab-pane>
          </el-tabs>
        </div>
      </basic-container>
    </div>
  </div>
</template>

<script>
import {queryDept} from "@/api/operation/safeaccess/subnet";
import {mapGetters, mapState} from "vuex";
import newIpPool from '@/views/operation/safeaccess/newIpPool'
import subnetManage from '@/views/operation/safeaccess/subnetManage'
import {subnetQuery} from "@/api/operation/safeaccess/newIpPool";

export default {
  components: {
    newIpPool,
    subnetManage
  },
  data() {
    return {
      activeName: "first",
      defaultProps: {
        label: 'subnetName',
        children: 'children',
        isLeaf: 'leaf'
      },
      ipdata: [],
      unitlList: [],
      defaultProps2: {
        children: 'children',
        label: 'deptName'
      },
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  watch: {
    'activeName'(newVal, oldVal) {
      if (newVal === 'second') {
        this.$refs.newIpPool.requestLoadData();
      }
    }
  },
  mounted() {
    // this.setPageContentHeight()
    // this.setTableHeight()

    //加载所属单位
    let newUnitList = JSON.parse(JSON.stringify(this.$store.state.user.userUnitList));
    this.initUserUnit(newUnitList);
    this.unitlList = newUnitList;
  },
  methods: {
    resetClick() {
      let tree = null;
      if (this.activeName === 'first') {
        tree = this.$refs.treeZW;
      } else if (this.activeName === 'second') {
        tree = this.$refs.treeIP;
      }
      tree.setCurrentKey(null)
      for (let i = 1; i < tree.store._getAllNodes().length; i++) {
        tree.store._getAllNodes()[i].expanded = false;
      }
    },
    //加载单位
    initUserUnit(list) {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].type != 'CORP') {
          list.splice(i, 1)
        }
        if (list[i] && list[i].children) {
          this.initUserUnit(list[i].children)
        }
      }
    },
    loadNode(val, resolve) {
      if (val.level === 0) {
        //加载所属单位
        let newUnitList = JSON.parse(JSON.stringify(this.$store.state.user.userUnitList));
        this.initUserUnit(newUnitList);
        let newList = newUnitList;
        for (let i = 0; i < newList.length; i++) {
          newList[i].subnetName = newList[i].deptName
          //newList[i].children = []
        }
        this.ipdata = newList;
        this.ipdata.push({
          subnetName: '公共子网',
          children: [],
        })
        return resolve(this.ipdata);
      } else {
        let form = {}
        if (val.data.subnetName == '公共子网') {
          form = {
            currentPage: 1,
            pagesize: 9999,
            isPublic: 1
          }
          subnetQuery(form).then(res => {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].leaf = true
            }
            resolve(res.data)
          })
        } else {
          form = {
            currentPage: 1,
            pagesize: 9999,
            institutionCode: val.data.id,
            // isPublic: 0
          }
          subnetQuery(form).then(res => {
            let arrs = [];
            if (val.data.children) {
              for (let i = 0; i < val.data.children.length; i++) {
                val.data.children[i].subnetName = val.data.children[i].deptName
                //newList[i].children = []
              }
              arrs = arrs.concat(val.data.children);
            }

            for (let i = 0; i < res.data.length; i++) {
              res.data[i].leaf = true
            }
            arrs = arrs.concat(res.data);
            resolve(arrs)
          })
        }
      }
    },

    handleNodeClick(val) { //点击树状图节点
      if (val.subnetAddress) {
        if (!val.children) {
          this.$refs.newIpPool.subnetNum = val.subnetNum
          this.$refs.newIpPool.code = val.subnetMask
          this.$refs.newIpPool.searchForm.subnetName = val.subnetName
          this.$refs.newIpPool.institutionName = val.institutionName || ''

          this.$refs.newIpPool.getIpSegmentList(val.id)
        }
      }
    },

    handleNodeClick2(data) {
      this.$refs.subnetManage.searchForm.institutionCode = data.id
      this.$refs.subnetManage.getList()
    },
    handleClick() {

    },
    // 设置表格高度
    setTableHeight() {
      let bodyBox = document.getElementsByClassName('page_body')
      this.tableHeight = (bodyBox[0].offsetHeight - 97) + 'px'
    },

  }
}
</script>
<style lang="scss" scoped>
::v-deep .confirmClass {
  padding-bottom: 15px;

  .el-message-box__status {
    position: absolute;
    top: 21%;
  }

  .el-message-box__message {
    font-size: 16px;
    font-weight: bold;

    div {
      font-size: 14px;
      margin-top: 10px;
      font-weight: normal;
    }
  }

  .el-button--primary {
    color: #FFF;
    background-color: #f56c6c;
    border-color: #f56c6c;
  }

  .el-button--primary:focus, .el-button--primary:hover {
    background: #f78989;
    border-color: #f78989;
    color: #FFF;
  }
}
</style>
<style lang="scss" scoped>
.ziwang {
  width: 100%;
  display: flex;
  padding-left: 16px;

  .el-aside {
    width: 200px !important;
    overflow-x: auto
  }

  .ziwang_r {
    flex: 1;
    overflow: hidden;
  }
}

::v-deep .el-tree {
  background: transparent;
  color: #46506d;
}

::v-deep .el-tree-node.is-current > .el-tree-node__content {
  background: none
}

::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background: none
}

::v-deep .el-tree-node__content:hover {
  background: none
}

.xt-layout-sider {
  background-color: #cfe6f9;
  border-radius: 5px;
  height: 100%;
}

::v-deep .el-tree-node__label {
  padding-right: 10px;
}

::v-deep .el-tabs__item {
  height: 20px;
  line-height: 20px;
}

::v-deep .el-tabs__nav {
  padding-bottom: 10px;
}

::v-deep .list_btn {
  padding: 9px 5px !important;
}

::v-deep .btn_red {
  color: red;
}

.title_line {

  position: relative;
  padding-left: 15px;
  font-size: 15px;
  font-weight: bold;
  height: 20px;

  &::before {
    content: '';
    position: absolute;
    left: 0px;
    width: 0px;
    height: 100%;
    border-left: 4px solid;
    z-index: 9;
    margin-right: 4px;
    color: #409EFF;
  }


}
</style>
