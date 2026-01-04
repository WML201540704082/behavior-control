<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      :title="'信创课程图谱'"
      width="1000px"
      top="5vh"
      v-el-drag-dialog
    >
      <div id="g6_topology"></div>
      
    </el-dialog>
  </div>
</template>

<script>
import { getDictList } from "@/api/dict";
import { resourceList } from "@/api/ictOperation/index"
// 文件上传
import website from '@/config/website';
import {Base64} from 'js-base64';
import {getToken} from '@/util/auth'
import { formatDate } from '@/util/date'
import { mapGetters } from "vuex";
import G6 from "@antv/g6";

export default {
  props: ['isShow', 'questionId', 'isCollect'],
  data() {
    return{
      graph:null,
      datas: {
        id: "131313",
        title: '信创课程',
        children: [
          { 
            id: '1313131', 
            title: '文档',
            children:[
              // { id: '子1' },
              // { id: '子2' },
              // { id: '子3' }
            ] 
          },
          { id: '13131312', 
            title: '视频',
            children:[
              // { id: '子13' },
              // { id: '子23' },
              // { id: '子33' }
            ] 
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(["userDetail"]),
  },
  mounted() {
    this.getList()

    // setTimeout(() => {
    //   this.initTopology()
    // }, 1000);
    
  },
  methods: {
    getList(){
      resourceList({
        current: 1,
        size: 1000,
        tag: 0,
        resourceCondition: ''
      }).then(res => {
        // console.log(123123, res.data.records)
        let res1 = res.data.records
        let qian = res1.slice(0, 5)
        qian.push({ id: '555123', title: '......' })
        let hou = res1.slice(-5)
        
        this.datas.children[0].children = [...qian, ...hou]
        
        this.getList2()
      })
    },
    getList2(){
      resourceList({
        current: 1,
        size: 1000,
        tag: 1,
        resourceCondition: ''
      }).then(res => {
        // console.log(123123, res.data.records)
        let res1 = res.data.records
        let qian = res1.slice(0, 5)
        qian.push({ id: '555123111', title: '......' })
        let hou = res1.slice(-5)
        
        this.datas.children[1].children = [...qian, ...hou]
        
        this.initTopology()
      })
    },

    initTopology(){
      // console.log(111, G6, this.datas)
      
      const container = document.getElementById("g6_topology")
      const width = container.scrollWidth
      const height = container.scrollHeight
      this.graph = new G6.TreeGraph({
        container: 'g6_topology',
        width,
        height,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed){
                const data = item.get('model');
                data.collapsed = collapsed;
                return true
              }
            },
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        defaultNode: {
        //  size: 26,
        //  anchorPoints: [
        //    [0, 0.5],
        //    [1, 0.5],
        //  ]
        },
        defaultEdge: {
          type: 'cubic-horizontal',
        },
        layout: {
          type: 'mindmap',
          direction: 'H',
          getHeight: ()=>{
            return 16
          },
          getWidth: ()=>{
            return 160
          },
          getVGap: ()=>{
            return 16
          },
          getHGap: ()=>{
            return 16
          },
          getSide: ()=>{
            return 'right'
          },
          // controlPoints: true,
          // ranksep: 70,
          // nodesepFunc: (d) => {
          //   return 50
          // },
        },
      })

      let centerX = 0;
      this.graph.node(function(node){
        if(node.id == '啊啊1'){
          centerX = node.x
        }

        return {
          label: node.title,
          labelCfg: {
            position:
             node.children && node.children.length>0
              ? 'right'
              : node.x > centerX
              ? 'right'
              : 'left',
            offset: 5
          }
        }
      })

      this.graph.data(this.datas)
      this.graph.render()
      this.graph.fitView()

      this.graph.on('node:click', evt=>{
        // console.log(12333, evt.item.getModel())
        let current = evt.item.getModel()
        if(current.tag === "0"){
          this.$router.push({
            path: '/resourceDetail',
            query: {id: current.id, type: '文档'}
          })
        }
        if(current.tag === "1"){
          this.$router.push({
            path: '/resourceDetail',
            query: {id: current.id, type: '视频'}
          })
        }
      })
    },
    // initTopology2(res) {
    //   G6.registerNode(
    //     'sql',
    //     {
    //       drawShape(cfg, group) {
    //         const rect = group.addShape('image', {
    //           attrs: {
    //             x: -75,
    //             y: -25,
    //             width: 150,
    //             height: 100,
    //             radius: 10,
    //             stroke: '#5b8ff9',
    //             fill: '#c6e5ff',
    //             lineWidth: 3,
    //             // img: cfg.types == 0? require('./img/wall.png') : require('./img/cloud.png')
    //           },
    //           name: 'rect-shape'
    //         });
    //         if(cfg.name) {
    //           let nameText = ''
    //           if(cfg.types == 0) {
    //             nameText = `${cfg.name}
    //           ${cfg.manageAddr}`
    //           }else {
    //             nameText = cfg.name
    //           }
    //           group.addShape('text', {
    //             attrs: {
    //               text: nameText,
    //               x: 0,
    //               y: 90,
    //               fill: '#00287e',
    //               fontSize: 20,
    //               textAlign: 'center',
    //               textBaseline: 'top',
    //               fontWeight: 'bold'
    //             },
    //             name: 'text-shape'
    //           });
    //         }
    //         return rect
    //       }
    //     },
    //     'single-node'
    //   )

    //   const tooltip = new G6.Tooltip({
    //     offsetX: 10,
    //     offsetY: 10,
    //     trigger: 'click',
    //     itemTypes: ['node'],
    //     getContent: (e)=>{
    //       let str = `<div class="tooltip_div">
    //                     <p> 未处理预警信息：${this.zhi1} </p>
    //                     <p> 实时告警日志：${this.zhi2} </p>
    //                     <p> 端口开放状态排行榜：${this.zhi3} </p>
    //                   </div>`
    //       return str
    //     },
    //     shouldBegin: (evt)=>{
    //       let types = evt.item._cfg.model.types
    //       if(types == 1){
    //         return true
    //       }else{
    //         return false
    //       }
    //     }
    //   })

    //   const container = document.getElementById("g6_topology")
    //   const width = container.scrollWidth
    //   const height = container.scrollHeight
    //   this.graph = new G6.Graph({
    //     container: 'g6_topology',
    //     width,
    //     height,
    //     zoom:1,
    //     fitView: true,
    //     plugins: [tooltip],
    //     modes: {
    //       default: [
    //         'drag-canvas',
    //         // 'click-select',
    //         'zoom-canvas',
    //       ],
    //     },
    //     layout: {
    //       type: 'dagre',
    //       controlPoints: true,
    //       ranksep: 70,
    //       nodesepFunc: (d) => {
    //         return 50
    //       },
    //     },
    //     defaultNode: {
    //      type: 'sql',
    //     },
    //     nodeStateStyles: {
    //       selected: {
    //         lineWidth: 0.5,
    //         stroke: '#5394ef'
    //       }
    //     },
    //     defaultEdge: {
    //       type: 'polyline',
    //       style: {
    //         radius: 20,
    //         offset: 45,
    //         endArrow: false,
    //         lineWidth: 2,
    //         stroke: "#c2c8d5"
    //       }
    //     },
    //   })
    //   this.graph.data(res.data)
    //   this.graph.render()
    //   this.graph.on('node:dblclick', evt=>{
    //     // console.log(12333, evt.item.getModel())
    //     let current = evt.item.getModel()
    //     if(current.types === 0){
    //       this.goBus('策略')
    //     }
    //   })
    // },

  },
}
</script>

<style lang="scss" scoped>
#g6_topology{
  height: 600px;
  width: 980px;
}
</style>
