<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="xt-layout page_body">
      <div class="xt-layout-sider" :class="showSider? 'xt-layout-has-sider':'xt-layout-none-sider'">
        <!--        <div style="margin-bottom:10px">-->
        <!--          <el-radio-group v-model="treeType" @change="changeTreeType">-->
        <!--            <el-radio :label="1">区域划分</el-radio>-->
        <!--            <el-radio :label="2">单位划分</el-radio>-->
        <!--          </el-radio-group>-->
        <!--        </div>-->
        <el-scrollbar style="height: calc(100% - 32px);" ref="scrollbar">
          <el-tree
            ref="tree"
            :props="props"
            :data="treeData"
            :load="loadNode"
            :default-expanded-keys="defaultExpandedKeys"
            lazy
            highlight-current="true"
            :accordion="true"
            node-key="id"
            check-strictly
            @node-click="nodeClick"
            :default-expand-all="false"
            indent="16"
            :key="treeKey"
          >
          </el-tree>
        </el-scrollbar>

      </div>
      <div class="xt-layout-content" style="padding: 0px 0px 0px 20px">
        <component
          :is="componentName"
          :areaId="areaId"
          :areaCode="areaCode"
          :areaName="areaName"
          :nodeType="nodeType"
          :treeType="treeType"
          :roomId="roomId"
          :cabinetsId="cabinetsId"
          :cabinetsCiId="cabinetsCiId"
          :cabinetsCiEntityId="cabinetsCiEntityId"
          :racksId="racksId"
          :roomListId="roomListId"
          :roomListName="roomListName"
          :cabinetsListId="cabinetsListId"
          :cabinetCapacity="cabinetCapacity"
          :racksListId="racksListId"
          :ciId="ciId"
          :ciEntityId="ciEntityId"
          :warehouseId="warehouseId"
          @delNode="delNode"
          @updateNode="updateNode"
          :key="treeKey"
        ></component>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {resourceDeptTree} from "@/api/device/resoureroom";
import roomList from './components/comdevManage/roomList' //机房列表
import roomDetail from './components/comdevManage/roomDetail' //机房详情
import rackDetail from './components/comdevManage/rackDetail' //机架详情
import cabinetsDetail from './components/comdevManage/cabinetsDetail' //机柜详情
import devDetail from './components/comdevManage/devDetail'
import warehouseDetail from './components/comdevManage/warehouseDetail'//仓库详情
import {mapGetters} from "vuex";

export default {
  components: {
    roomList,
    roomDetail,
    rackDetail,
    cabinetsDetail,
    devDetail,
    warehouseDetail
  },
  data() {
    return {
      showSider: true,
      componentName: 'roomList',
      treeType: 2,
      treeKey: '',
      treeData: [],
      props: { //树组件配置项
        label: 'name',
        isLeaf: 'leaf'
      },
      parentsNode: [],
      defaultExpandedKeys: [],
      currentNodeKey: '',
      areaId: '',
      areaCode: '',
      areaName: '',
      hasChildren: true, //是否为三级地区菜单
      roomId: '',
      cabinetsId: '',
      cabinetsCiId: '',
      cabinetsCiEntityId: '',
      racksId: '',
      roomListId: '',
      roomListName: '',
      cabinetsListId: '',
      cabinetCapacity: '',
      racksListId: '',
      ciId: '',
      nodeType: '',
      ciEntityId: '',
      warehouseId: '',
    }
  },
  watch: {
    '$store.state.pageUpdate.updateForm': {
      deep: true,
      handler(val) {
        this.updateNode(val)
      },
    }
  },
  computed: {
    ...mapGetters(["userInfo", "userDetail"]),
  },
  mounted() {
    this.setPageContentHeight()
    //默认区域
    // this.areaId = this.userDetail.regionCode || '37'
  },
  methods: {
    // 修改树类型
    changeTreeType(val) {
      this.treeKey = new Date().getTime()
      this.componentName = 'roomList'
    },
    // 懒加载
    loadNode(node, resolve) {
      // console.log(321, node, resolve)

      if (node.level == 0) {
        return setTimeout(()=>{
          let unitData = {
            name: this.userDetail.ownerUnitName || '国网山东省电力公司',
            id: this.userDetail.ownerUnit || '0',
            hasChildren: true,
            type: 'corp',
            regionCode: this.userDetail.regionCode,
          }

          resolve([ unitData ])

          this.defaultExpandedKeys = [this.userDetail.ownerUnit || '0']
          this.$refs.tree.setCurrentKey(this.userDetail.ownerUnit || '0')
          this.nodeClick(unitData)

        }, 600)

        // let initObj = {
        //   name: this.userDetail.ownerUnitName || '国网山东省电力公司',
        //   id: this.userDetail.ownerUnit || '0',
        //   hasChildren: true,
        //   type: 'corp',
        //   regionCode: this.userDetail.regionCode
        // }
        // resourceDeptTree({
        //   id: this.userDetail.ownerUnit || '0',
        //   type: 'corp'
        // }).then(res => {
        //   initObj.children = res.data
        //   return resolve(initObj)
        // })
        // this.$refs.tree.setCurrentKey(this.userDetail.ownerUnit || '0')
      } else {
        let form = {
          id: node.data.id,
          type: node.data.type
        }
        if (node.data.type === 'defaultWarehouse' || node.data.type === 'defaultRoom') {
          form.id = node.parent.data.id
        }
        resourceDeptTree(form).then(res => {
          if (node.level == 0) {
            this.areaId = res.data[0].id
          }
          return resolve(res.data)
        })
      }










      // 地区划分
      // if (this.treeType === 1) {
      //   if (node.level == 0) {
      //     let type = ''
      //     this.defaultExpandedKeys = [this.userDetail.regionCode || '37']
      //     if (this.userDetail.regionCode.length == 2) type = ''
      //     else if (this.userDetail.regionCode.length == 4) type = 'city'
      //     else type = 'county'
      //     this.areaId = '37'
      //     this.nodeType = ''
      //     return resolve([{
      //       name: this.userDetail.regionName || '山东省',
      //       id: this.userDetail.regionCode || '37',
      //       hasChildren: true,
      //       type: type
      //     }])
      //   } else {
      //     resourceLazyTree(form).then(res => {
      //       return resolve(res.data)
      //     })
      //   }
      // }
      // // 单位划分
      // else {
      //   // this.defaultExpandedKeys = [this.userDetail.ownerUnit]
      //   if (node.level == 0) {
      //     // form.id = this.dept.parentId
      //     // form.type = 'top'
      //     return setTimeout(()=>{
      //       resolve([{
      //         name: this.userDetail.ownerUnitName || '国网山东省电力公司',
      //         id: this.userDetail.ownerUnit || '0',
      //         hasChildren: true,
      //         type: 'corp',
      //         regionCode: this.userDetail.regionCode
      //       }])
      //     }, 600)
      //   } else {
      //     resourceDeptTree(form).then(res => {
      //       if (node.level == 0) {
      //         this.areaId = res.data[0].id
      //       }
      //       return resolve(res.data)
      //     })
      //   }
      // }

    },
    // 点击树节点
    nodeClick(data, node) {
      // console.log(9090, data.type)
      if (data.type === 'room') {
        this.componentName = 'roomDetail'
        this.roomId = data.id
        this.roomListId = data.id
        this.roomListName = data.name
      } else if (data.type === 'cabinets') {
        this.componentName = 'cabinetsDetail'
        this.cabinetsId = data.id
        this.cabinetsCiId = data.ciId
        this.cabinetsCiEntityId = data.ciEntityId
        this.cabinetsListId = data.id
        this.cabinetCapacity = data.cabinetCapacity
      } else if (data.type === 'racks') {
        this.componentName = 'rackDetail'
        this.racksId = data.id
        this.racksListId = data.id
      } else if (data.type === 'device') {
        this.componentName = 'devDetail'
        this.ciId = data.ciId
        this.ciEntityId = data.id
      } else if (data.type === 'warehouse') {
        this.componentName = 'warehouseDetail'
        this.warehouseId = data.id
      } else {
        this.parentsNode = []
        this.getParentsNode(this.$refs.tree.getNode(data))
        localStorage.setItem('parentsNode', JSON.stringify(this.parentsNode))
        if (data.type == 'defaultRoom' || data.type == 'defaultWarehouse') {

          this.areaId = this.parentsNode[this.parentsNode.length - 1].id
          this.areaName = this.parentsNode[this.parentsNode.length - 1].name
          if (this.treeType == 2) this.areaCode = this.parentsNode[this.parentsNode.length - 1].regionCode
        } else {
          this.areaId = data.id
          this.areaName = data.name
          if (this.treeType == 2) this.areaCode = data.regionCode
        }

        this.componentName = 'roomList'
        this.nodeType = data.type
        this.hasChildren = data.hasChildren
      }

    },
    // 获得选中节点的所有父节点
    getParentsNode(node) {
      if (node.level && node.level != 1) {
        this.parentsNode.unshift(node.parent.data)
        this.getParentsNode(node.parent)
      }
    },
    // 删除树节点
    delNode(val, uuidFlag) {
      for (let i = 0; i < val.length; i++) {
        if(val[i].uuid && !uuidFlag) {
          val[i].id = val[i].uuid
        }
        this.$refs.tree.remove(val[i])
      }
    },
    // 更新树节点
    updateNode(val) {
      // console.log(988, val)
      if (val.handleType == '修改') {
        let node = this.$refs.tree.getNode(val.nodeDetail.id)
        this.$set(node, 'data', val.nodeDetail)
        this.$forceUpdate()
      } else if (val.handleType == '新增') {
        let nodeId = ''
        if (this.componentName === 'roomDetail') {
          // val.nodeDetail.name = val.nodeDetail.cabinetsName
        } else if (this.componentName === 'cabinetsDetail') {
          // val.nodeDetail.name = val.nodeDetail.racksName
        } else if (this.componentName === 'rackDetail') {
          // nodeId = this.racksId
        }
        this.$refs.tree.append(val.nodeDetail, this.$refs.tree.getCurrentKey())
      } else if (val.handleType == '机柜新增') {
        this.$refs.tree.append(val.nodeDetail, this.$refs.tree.getCurrentKey())
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.xt-layout-sider {
  background-color: #f1f8fe;
  border-radius: 5px;
  min-width: 330px !important;
}

::v-deep .el-tree {
  background: transparent;
  color: #46506d;
}
</style>
