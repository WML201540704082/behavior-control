<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="xt-layout page_body">
      <div class="xt-layout-sider" :class="showSider? 'xt-layout-has-sider':'xt-layout-none-sider'">
        <el-tree
          ref="tree"
          :props="props"
          :data="treeData"
          :load="loadNode"
          :default-expanded-keys="defaultExpandedKeys"
          lazy
          indent="12"
          highlight-current="true"
          :accordion="true"
          node-key="id"
          check-strictly
          @node-click="nodeClick"
          :default-expand-all="false"
          :key="treeKey"
        >
        </el-tree>
      </div>
      <div class="xt-layout-content" style="padding: 0px 0px 0px 20px">
        <!-- 设备台账列表-->
        <component
          ref="componentHandler"
          :is="componentName"
          :type="type"
          :keyId="id"
          :name="name"
          :h3cModelType="h3cModelType"
          :h3cModelId="h3cModelId"
          :searchForm="searchForm"
          :loading="loading"
        ></component>
      </div>
    </div>
  </basic-container>
</template>

<script>
  import {mapGetters} from "vuex";
  import {getList} from "@/api/tool/datasource";
  import {getModelList} from "@/api/data/datasourcemodel";
  import hardwarebaseList from "@/views/data/components/hardwarebase/hardwarebaseList.vue";
  import hardwarebaseRecordList from "@/views/data/components/hardwarebase/hardwarebaseRecordList.vue";
  import hardwarebaseEmpty from "@/views/data/components/hardwarebase/hardwarebaseEmpty.vue";
  import hardwareservice from "@/views/data/hardwareservice.vue";
  import tokengenerate from "@/views/h3c/tokengenerate.vue";
  import h3capplication from "@/views/h3c/h3capplication.vue";
  import hardwarebrand from "@/views/data/components/hardwarebase/hardwarebrand.vue";
  import hardwaredictdata from "@/views/data/components/hardwarebase/hardwaredictdata.vue";
  import ohardwareclassify from "@/views/data/ohardwareclassify.vue";
  import ohardwaretype from "@/views/data/ohardwaretype.vue";
  import applicationsCurrent from "@/views/h3c/components/applicationsCurrent.vue"
  import hardwarecontract from "@/views/data/components/hardwarebase/hardwarecontract.vue";
  import hardwareuse from "@/views/data/components/hardwarebase/hardwareuse.vue";
  import devicecolumnunit from "@/views/data/components/hardwarebase/devicecolumnunit.vue";
  import oidevelopmodelchwserver from "@/views/h3c/oidevelopmodelchwserver.vue";
  import modelchwserverDetail from "@/views/h3c/components/modelchwserverDetail.vue";
  import modelh3cbaseDetail from "@/views/h3c/components/modelh3cbaseDetail.vue";
  import cmdbrscmdbci from "@/views/h3c/components/cmdbrscmdbci.vue"
  import modeCAS2200Detail from "@/views/h3c/components/modeCAS2200Detail.vue"


  export default {
    components: {
      hardwarebaseList,
      hardwarebaseRecordList,
      hardwarebaseEmpty,
      hardwareservice,
      tokengenerate,
      h3capplication,
      hardwarebrand,
      hardwaredictdata,
      ohardwaretype,
      ohardwareclassify,
      applicationsCurrent,
      hardwareuse,
      hardwarecontract,
      devicecolumnunit,
      oidevelopmodelchwserver,
      modelchwserverDetail,
      modelh3cbaseDetail,
      cmdbrscmdbci,
      modeCAS2200Detail,
    },
    data() {
      return {
        componentName: 'hardwarebaseList',
        form: {},
        id: "",
        type: '',
        name: '',
        h3cModelType: '',
        h3cModelId: '',
        tableHeight: undefined,
        showSider: true,
        loading: false,
        searchForm: {
          current: 1,
          size: 10,
          total: 0,
        },
        treeType: 1,
        treeKey: '',
        treeData: [],
        dataList: [],
        datasourceData: [],
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
      }
    },
    watch: {

    },
    computed: {
      ...mapGetters(["userInfo","userDetail"]),
    },
    mounted() {
      this.setPageContentHeight()

      this.setTableHeight()
      //默认区域
      this.areaId = this.userDetail.regionCode||'37'
    },
    methods: {
      // 设置表格高度
      setTableHeight() {
        let bodyBox = document.getElementsByClassName('page_body')
        this.tableHeight = (bodyBox[0].offsetHeight-50) + 'px'
      },
      // 懒加载
      async loadNode(node, resolve) {
        // 加载数据源
        if (node.level == 0) {
          getList(1, 20, {}).then(res => {
            const data = res.data;
            this.datasourceData = data.records;
            this.datasourceData.forEach(ele => {
              ele.hasChildren = true;
              ele.type = 'datasourcce';
            })
            return resolve(this.datasourceData || [])
          });
          return resolve([])
        } else if (node.data.type == 'datasourcce') {
          // 加載模型
          getModelList(1, 20, {datasourceId:node.data.id}).then(res => {
            const data = res.data;
            let records = data.records;
            records.forEach(ele => {
              ele.name = ele.name+' '+ele.code;
              ele.hasChildren = false;
              ele.type = 'model';
            })
            return resolve(records || [])
          });
          return resolve([])
        } else {
          // 返回 空
          return resolve([])
        }
      },
      // 点击树节点
      nodeClick(data) {
        this.dataList = [];
        this.searchForm.total = 0;
        this.searchForm.current = 1
        if (data.code === 'o_hardware_basic') {
          this.id = data.id || "";
          this.type = data.code;
          //加载设备数据源
          this.componentName = 'hardwarebaseList'
        }else if(data.code === 'o_hardware_record'){
          this.id = data.id || "";
          this.type = data.code;
          //加载备案信息
          this.componentName = 'hardwarebaseRecordList'
        }else if ((data.code+'').includes('generate') && (data.code+'').includes('token')) {
          this.id = data.id || "";
          this.type = data.code;
          //加载设备数据源
          this.componentName = 'tokengenerate'
        }else if (data.code === 'o_hardware_service') {
          this.id = data.id || "";
          this.type = data.code;
          //加载设备服務信息
          this.componentName = 'hardwareservice'
        }else if ((data.code+'').includes('v2') && (data.code+'').includes('applications')  && !(data.code+'').includes('current')) {
          this.id = data.id || "";
          this.type = data.code;
          //加载H3c监控信息
          this.componentName = 'h3capplication'
        }else if (data.code === 'o_hardware_brand') {
          this.id = data.id || "";
          this.type = data.code;
          //加载品牌系列型号
          this.componentName = 'hardwarebrand'
        }else if ( data.code === 'o_hardware_dict_type') {
          this.id = data.id || "";
          this.type = data.code;
          //加载字典
          this.componentName = 'hardwaredictdata'
        }else if ( data.code === 'o_hardware_type') {
          this.id = data.id || "";
          this.type = data.code;
          //加载类型
          this.componentName = 'ohardwaretype'
        }else if ( data.code === 'o_hardware_classify') {
          this.id = data.id || "";
          this.type = data.code;
          //加载分类
          this.componentName = 'ohardwareclassify'
        }else if ((data.code+'').includes('applications') && (data.code+'').includes('current')) {
          this.id = data.id || "";
          this.type = data.code;
          //查询监控实时数据
          this.componentName = 'applicationsCurrent'
        }else if ( data.code === 'o_hardware_contract') {
          this.id = data.id || "";
          this.type = data.code;
          //加载 设备采购信息
          this.componentName = 'hardwarecontract'
        }else if ( data.code === 'o_hardware_use') {
          this.id = data.id || "";
          this.type = data.code;
          //加载 设备使用信息
          this.componentName = 'hardwareuse'
        }else if ( data.code === 'idevelop_device_column_unit') {
          this.id = data.id || "";
          this.type = data.code;
          //加载 U-Centor指标映射采集模型字段
          this.componentName = 'devicecolumnunit'
        }else if ( data.code === 'o_idevelop_model_c_hw_server') {
          this.id = data.id || "";
          this.type = data.code;
          this.name = data.name;
          this.h3cModelType = data.h3cModelType;
          this.h3cModelId = data.h3cModelId;
          //加载其他
          this.componentName = 'hardwarebaseEmpty'
          //加载 华为服务器Huawei Server CST
          //this.componentName = 'modelh3cbaseDetail'
          this.componentName = 'modelchwserverDetail'
          //强制刷新
          this.$refs.componentHandler.$forceUpdate();
        }else if ( data.code === 'o_idevelop_model_h3c_base') {
          this.id = data.id || "";
          this.type = data.code;
          this.name = data.name;
          this.h3cModelType = data.h3cModelType;
          this.h3cModelId = data.h3cModelId;
          //加载 H3C 模型base
          this.componentName = 'modelh3cbaseDetail'
        }else if ((data.code+'').includes('cmdbrs') && (data.code+'').includes('cmdb') && (data.code+'').includes('ci')) {
          this.id = data.id || "";
          this.type = data.code;
          //查询监控cmdb实时数据 cmdbrs/cmdb/ci
          this.componentName = 'cmdbrscmdbci'
        }else if ( data.code === 'o_idevelop_model_c_as2200') {
          this.id = data.id || "";
          this.type = data.code;
          this.name = data.name;
          this.h3cModelType = data.h3cModelType;
          this.h3cModelId = data.h3cModelId;
          //加载 浪潮存储 AS2200
          this.componentName = 'modeCAS2200Detail'
        }else{
          //加载其他
          this.componentName = 'hardwarebaseEmpty'
        }
      },
      //加载数据源
      async loadDatasource() {
        getList(1, 20, {}).then(res => {
          const data = res.data;
          this.datasourceData = data.records;
          this.datasourceData.forEach(ele => {
            ele.hasChildren = true;
            ele.type = 'datasourcce';
          })
        });
      },
      // 更新树节点
      updateNode() {


      }
    }
  }
</script>

<style lang="scss" scoped>
  .xt-layout-sider {
    background-color: #f1f8fe;
    border-radius: 5px
  }
  .theme-xintong .xt-layout .xt-layout-has-sider {
    width: 250px;
    min-width: 250px;
    max-width: 250px;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 250px;
    flex: 0 0 250px;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
  ::v-deep .el-tree {
    background: transparent;
    color: #46506d;
  }
</style>
